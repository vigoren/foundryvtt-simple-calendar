import {DayTemplate, SCDateSelector} from "../interfaces";
import SimpleCalendar from "./simple-calendar";
import {Note} from "./note";
import {DateRangeMatch} from "../constants";

export default class DateSelector {

    /**
     * List of date selector objects that are active on the page.
     * @type {SCDateSelector.SelectorList}
     */
    static Selectors:SCDateSelector.SelectorList = {};

    /**
     * Creates a new Date Selector or returns an existing Date Selector if it all ready exists in the list.
     * @param {string} id The unique ID of the selector to add
     * @param {SCDateSelector.Options} options The options associated with setting up the new Date Selector
     * @return {DateSelector}
     */
    static GetSelector(id: string, options: SCDateSelector.Options){
        if(DateSelector.Selectors.hasOwnProperty(id)){
            return this.Selectors[id];
        } else {
            const ds = new DateSelector(id, options);
            this.Selectors[id] = ds;
            return ds;
        }
    }

    /**
     * Removes a Date Selector from the list of selectors
     * @param {string} id The ID of the selector to remove
     */
    static RemoveSelector(id: string){
        if(DateSelector.Selectors.hasOwnProperty(id)){
            delete this.Selectors[id];
        }
    }

    static IsDayBetweenDates(checkDate: SCDateSelector.Date, startDate: SCDateSelector.Date, endDate: SCDateSelector.Date | null = null){
        let between = DateRangeMatch.None;
        if(SimpleCalendar.instance && SimpleCalendar.instance.currentYear){
            let checkMonthIndex = checkDate.month;
            let startMonthIndex = startDate.month;
            let endMonthIndex = 0;

            const sMonth = SimpleCalendar.instance.currentYear.months.findIndex(m => m.numericRepresentation === startDate.month);
            const cMonth = SimpleCalendar.instance.currentYear.months.findIndex(m => m.numericRepresentation === checkDate.month);
            if(sMonth > -1){
                startMonthIndex = sMonth;
            }
            if(cMonth > -1){
                checkMonthIndex = cMonth;
            }

            if(endDate !== null){
                const eMonth = SimpleCalendar.instance.currentYear.months.findIndex(m => m.numericRepresentation === endDate.month);
                if(eMonth > -1){
                    endMonthIndex = eMonth;
                } else {
                    endMonthIndex = endDate.month;
                }
                if(checkDate.day === startDate.day && checkMonthIndex === startMonthIndex && checkDate.year === startDate.year){
                    between = DateRangeMatch.Start;
                } else if(checkDate.day === endDate.day && checkMonthIndex === endMonthIndex && checkDate.year === endDate.year){
                    between = DateRangeMatch.End;
                } else {
                    // Start and end are the same month and year
                    if(startMonthIndex === endMonthIndex && startMonthIndex === checkMonthIndex && startDate.year === endDate.year){
                        if(checkDate.day > startDate.day && checkDate.day < endDate.day){
                            between = DateRangeMatch.Middle;
                        }
                    }
                    // Start and end are different month but year is the same
                    else if(startMonthIndex !== endMonthIndex){
                        // Start month go until the end of the month
                        if(checkMonthIndex === startMonthIndex && checkDate.day > startDate.day && checkDate.year === startDate.year){
                            between = DateRangeMatch.Middle;
                        }
                        //End month go from the first of the month until the end
                        else if(checkMonthIndex === endMonthIndex && checkDate.day < endDate.day && checkDate.year === endDate.year){
                            between = DateRangeMatch.Middle;
                        }
                        //In-between month go from first until end of the month
                        else if(
                            (checkMonthIndex > startMonthIndex && checkMonthIndex < endMonthIndex) ||
                            (checkDate.year > startDate.year && checkDate.year < endDate.year) //||
                            //(checkMonthIndex > startMonthIndex && checkDate.year === startDate.year) ||
                            //(checkMonthIndex < endMonthIndex && checkDate.year === endDate.year)
                        ){
                            between = DateRangeMatch.Middle;
                        }
                    }
                }
            } else if(checkMonthIndex === startMonthIndex && checkDate.year === startDate.year) {
                between = checkDate.day === startDate.day? DateRangeMatch.Exact : DateRangeMatch.None;
            }
        }
        return between;
    }
    /**
     * The unique ID of the date selector object
     * @type {string}
     */
    id: string;
    /**
     * Any place holder text for the Date Select input box
     * @type {string}
     */
    placeHolderText: string = '';

    range: boolean = false;

    secondDaySelect: boolean = false;
    /**
     * The currently selected date
     * @type {SCDateSelector.SelectedDate}
     */
    selectedDate: SCDateSelector.SelectedDate;
    /**
     * A function to call when a date is selected
     * @type{Function | null}
     */
    onDateSelect: Function | null = null;

    /**
     * Constructor for a new Date Selector
     * @param {string} id The unique ID of the selector to add
     * @param {SCDateSelector.Options} options The options associated with setting up the new Date Selector
     */
    constructor(id: string, options: SCDateSelector.Options) {
        this.id = id;
        this.selectedDate = {
            visibleDate:{
                year: 0,
                month: 0,
                day: 0
            },
            startDate:{
                year: 0,
                month: 0,
                day: 0
            }
        };
        if(options.placeHolderText){
            this.placeHolderText = options.placeHolderText;
        }

        if(options.onDateSelect){
            this.onDateSelect = options.onDateSelect;
        }

        if(options.rangeSelect !== undefined){
            this.range = options.rangeSelect;
        }
    }

    /**
     * Updates the currently selected date based on the passes in note.
     * @param {Note} note
     */
    updateSelectedDate(note: Note){
        this.selectedDate.startDate = {
            year: note.year,
            month: note.month,
            day: note.day
        };
        this.selectedDate.visibleDate = {
            year: note.year,
            month: note.month,
            day: note.day
        };
        if(note.endDate !== null){
            this.selectedDate.endDate = {
                year: note.endDate.year,
                month: note.endDate.month,
                day: note.endDate.day
            };
        }
    }

    /**
     * Builds the HTML string for the Date Select input
     * @param {boolean} [justCalendar=false] If we should just be rendering the calendar HTML or the full inputs HTML
     */
    build(justCalendar = false){
        if(SimpleCalendar.instance && SimpleCalendar.instance.currentYear){
            let weeks: (boolean | DayTemplate)[][] = [[false]],
                visibleMonthName: string = '',
                visibleMonthIndex: number = 0,
                startingMonthName: string = '',
                startingMonthIndex: number = 0,
                endingMonthName: string = '',
                endingMonthIndex: number = 0,
                weekdays = SimpleCalendar.instance.currentYear.showWeekdayHeadings? SimpleCalendar.instance.currentYear.weekdays : [];
            const visibleMonth = SimpleCalendar.instance.currentYear.months.find(m => m.numericRepresentation === this.selectedDate.visibleDate.month);
            if(visibleMonth){
                weeks = SimpleCalendar.instance.currentYear.daysIntoWeeks(visibleMonth, this.selectedDate.startDate.year, SimpleCalendar.instance.currentYear.weekdays.length);
                visibleMonthName = visibleMonth.name;
                visibleMonthIndex = SimpleCalendar.instance.currentYear.months.indexOf(visibleMonth);
            }
            const startingMonth = SimpleCalendar.instance.currentYear.months.find(m => m.numericRepresentation === this.selectedDate.startDate.month);
            if(startingMonth){
                startingMonthName = startingMonth.name;
                startingMonthIndex = SimpleCalendar.instance.currentYear.months.indexOf(startingMonth);
            }
            if(this.selectedDate.endDate){
                const endingMonth = SimpleCalendar.instance.currentYear.months.find(m => m.numericRepresentation === this.selectedDate.endDate?.month);
                if(endingMonth){
                    endingMonthName = endingMonth.name;
                    endingMonthIndex = SimpleCalendar.instance.currentYear.months.indexOf(endingMonth);
                }
            }

            if(!weeks.length){
                return '';
            }
            const calendarWidth = (10 + (weeks[0].length * 40)) + 'px';
            let displayText =`${startingMonthName} ${this.selectedDate.startDate.day}, ${this.selectedDate.startDate.year}`;
            let hiddenValue = `${this.selectedDate.startDate.year}/${this.selectedDate.startDate.month}/${this.selectedDate.startDate.day}`;
            if(this.range && this.selectedDate.endDate){
                displayText += ` - ${endingMonthName} ${this.selectedDate.endDate.day}, ${this.selectedDate.endDate.year}`;
                hiddenValue += ` ~ ${this.selectedDate.endDate.year}/${this.selectedDate.endDate.month}/${this.selectedDate.endDate.day}`;
            }

            const input = jQuery(`<div></div>`).append(`<input type="hidden" value="${hiddenValue}" class="sc-selected-value" /><input class="display-input" style="width: ${calendarWidth};" value="${displayText}" placeholder="${this.placeHolderText}" tabindex="0" type="text" readonly="readonly">`);
            const calendar = jQuery(`<div class="sc-date-selector-calendar" style="display: none;width: ${calendarWidth};"></div>`);
            calendar.append(`<div class="header"><div class="current"><a class="prev fa fa-chevron-left"></a><span class="month-year" data-visible="${this.selectedDate.visibleDate.month}/${this.selectedDate.visibleDate.year}">${visibleMonthName} ${this.selectedDate.visibleDate.year}</span><a class="next fa fa-chevron-right"></a></div></div>`);
            if(weekdays.length){
                let weekdayRow = '<div class="weekdays">';
                for(let i = 0; i < weekdays.length; i++){
                    const wd = weekdays[i].toTemplate();
                    weekdayRow += `<div class="weekday" title="${wd.name}">${wd.firstCharacter}</div>`;
                }
                weekdayRow += '</div>';
                calendar.find('.header').append(weekdayRow);
            }
            let dayContainer = '<div class="days">';
            for(let i = 0; i < weeks.length; i++){
                dayContainer += `<div class="week">`;
                for(let d = 0; d < weeks[i].length; d++){
                    if(weeks[i][d] === false){
                        dayContainer += `<div class="empty-day"></div>`;
                    } else {
                        let selected = '';
                        const checkDate = {
                            year: this.selectedDate.visibleDate.year,
                            month: this.selectedDate.visibleDate.month,
                            day: (<DayTemplate>weeks[i][d]).numericRepresentation
                        };
                        const inBetween = DateSelector.IsDayBetweenDates(checkDate, this.selectedDate.startDate, this.selectedDate.endDate);
                        switch (inBetween){
                            case DateRangeMatch.Exact:
                                selected = 'selected';
                                break;
                            case DateRangeMatch.Start:
                                selected = 'selected selected-range-start';
                                break;
                            case DateRangeMatch.Middle:
                                selected = 'selected selected-range-mid';
                                break;
                            case DateRangeMatch.End:
                                selected = 'selected selected-range-end';
                                break;
                        }
                        dayContainer += `<div class='day ${selected}' data-day='${(<DayTemplate>weeks[i][d]).numericRepresentation}'>${(<DayTemplate>weeks[i][d]).name}</div>`;
                    }
                }
                dayContainer += '</div>';
            }
            dayContainer += '</div>';
            calendar.append(dayContainer);

            input.append(calendar);
            if(justCalendar){
                return calendar.html();
            } else {
                return `<div id="${this.id}" class="sc-date-selector">${input.html()}</div>`;
            }
        }
        return  '';
    }

    /**
     * Updates the current calendar display for showing a new month
     */
    update(){
        const newData = this.build(true);
        const ds = jQuery(`#${this.id} .sc-date-selector-calendar`);
        ds.html(newData);
        this.activateListeners(ds.parent().parent(), true);
        ds.show();
    }

    /**
     * Adds all of the click events needed to the calendars HTML for proper interaction
     * @param {JQuery} html The JQuery object of the HTML for the input
     * @param {boolean} justCalendar If we should just update the listeners for the calendar
     */
    activateListeners(html: JQuery, justCalendar = false){
        const dateSelector = html.find(`#${this.id}`);
        if(!justCalendar){
            html.on('click', this.hideCalendar.bind(this, html));
            dateSelector.find('.display-input').on('click', this.toggleCalendar.bind(this, dateSelector));
        }
        dateSelector.find('.days .day').on('click', this.dayClick.bind(this, dateSelector));
        dateSelector.find('.header .current .prev').on('click', this.prevClick.bind(this));
        dateSelector.find('.header .current .next').on('click', this.nextClick.bind(this));
    }

    /**
     * Toggles if the calendar portion of the input should be shown or not
     * @param {JQuery} html The JQuery object of the HTML for the input
     * @param {Event} event The click event that triggered this call
     */
    toggleCalendar(html: JQuery, event: Event){
        event.stopPropagation();
        html.find('.sc-date-selector-calendar').toggle();
    }

    /**
     * Hides the calendar portion of the input
     * @param {JQuery} html The JQuery object of the HTML for the input
     */
    hideCalendar(html: JQuery){
        html.find('.sc-date-selector-calendar').hide();
    }

    /**
     * Processes the selecting of a day on the calendar
     * @param {JQuery} html The JQuery object of the HTML for the input
     * @param {Event} event The click event that triggered this call
     */
    dayClick(html: JQuery, event: Event){
        event.stopPropagation();
        let target = <HTMLElement>event.target;
        const dataDate = target.getAttribute('data-day');
        const currentMonthYear = html.find('.month-year');
        if(currentMonthYear && dataDate){
            const dataVis = currentMonthYear.attr('data-visible');
            if(dataVis){
                const my = dataVis.split('/');
                if(my.length === 2){
                    const dayNumber = parseInt(dataDate);
                    const monthNumber = parseInt(my[0]);
                    const yearNumber = parseInt(my[1]);
                    if(!isNaN(yearNumber) && !isNaN(monthNumber) && !isNaN(dayNumber)){
                        let hideCalendar = true;
                        if(this.range){
                            if(!this.secondDaySelect){
                                this.selectedDate.startDate.year = yearNumber;
                                this.selectedDate.startDate.month = monthNumber;
                                this.selectedDate.startDate.day = dayNumber;
                                this.selectedDate.endDate = undefined;
                                this.secondDaySelect = true;
                                hideCalendar = false;
                            } else {
                                let sMonthIndex = this.selectedDate.startDate.month;
                                let newMonthIndex = monthNumber;
                                if(SimpleCalendar.instance && SimpleCalendar.instance.currentYear){
                                    const sMonth = SimpleCalendar.instance.currentYear.months.findIndex(m => m.numericRepresentation === this.selectedDate.startDate.month);
                                    const nMonth = SimpleCalendar.instance.currentYear.months.findIndex(m => m.numericRepresentation === monthNumber);
                                    if(sMonth > -1){
                                        sMonthIndex = sMonth;
                                    }
                                    if(nMonth > -1){
                                        newMonthIndex = nMonth;
                                    }
                                }
                                // End date is the same as the start date
                                if(this.selectedDate.startDate.day === dayNumber && sMonthIndex === newMonthIndex && this.selectedDate.startDate.year === yearNumber){
                                    this.selectedDate.endDate = undefined;
                                }
                                // End date is less than start date
                                else if(
                                    (this.selectedDate.startDate.day > dayNumber && sMonthIndex === newMonthIndex  && this.selectedDate.startDate.year === yearNumber) ||
                                    (sMonthIndex > newMonthIndex && this.selectedDate.startDate.year === yearNumber) ||
                                    this.selectedDate.startDate.year > yearNumber)
                                {
                                    this.selectedDate.endDate = {
                                        year: this.selectedDate.startDate.year,
                                        month: this.selectedDate.startDate.month,
                                        day: this.selectedDate.startDate.day
                                    };
                                    this.selectedDate.startDate.year = yearNumber;
                                    this.selectedDate.startDate.month = monthNumber;
                                    this.selectedDate.startDate.day = dayNumber;
                                }
                                else {
                                    this.selectedDate.endDate = {
                                        year: yearNumber,
                                        month: monthNumber,
                                        day: dayNumber
                                    };
                                }

                                this.secondDaySelect = false;
                            }
                        } else {
                            this.selectedDate.startDate.year = yearNumber;
                            this.selectedDate.startDate.month = monthNumber;
                            this.selectedDate.startDate.day = dayNumber;
                        }
                        if(hideCalendar){
                            this.hideCalendar(html);
                            if(this.onDateSelect){
                                this.onDateSelect(this.selectedDate);
                            }
                        } else {
                            this.update();
                        }

                    }
                }
            }
        }

    }

    /**
     * When the next month button is clicked
     * @param {Event} event The click event that triggered this call
     */
    nextClick(event: Event){
        event.stopPropagation();
        this.changeMonth(true);
    }

    /**
     * When the previous month button is clicked
     * @param {Event} event The click event that triggered this call
     */
    prevClick(event: Event){
        event.stopPropagation();
        this.changeMonth(false);
    }

    /**
     * Changes the actual month being shown on the calendar
     * @param {boolean} next If to go to the next month or the previous month
     */
    changeMonth(next: boolean){
        if(SimpleCalendar.instance.currentYear){
            let monthIndex = 0;
            for(let i = 0; i < SimpleCalendar.instance.currentYear.months.length; i++){
                if(SimpleCalendar.instance.currentYear.months[i].numericRepresentation === this.selectedDate.visibleDate.month){
                    monthIndex = i;
                    if(next){
                        if(i === SimpleCalendar.instance.currentYear.months.length - 1){
                            monthIndex = 0;
                            this.selectedDate.visibleDate.month = SimpleCalendar.instance.currentYear.months[monthIndex].numericRepresentation;
                            this.selectedDate.visibleDate.year++;
                        } else {
                            monthIndex = i + 1;
                            this.selectedDate.visibleDate.month = SimpleCalendar.instance.currentYear.months[monthIndex].numericRepresentation;
                        }

                    } else{
                        if(!next && i === 0){
                            monthIndex = SimpleCalendar.instance.currentYear.months.length - 1;
                            this.selectedDate.visibleDate.month = SimpleCalendar.instance.currentYear.months[monthIndex].numericRepresentation;
                            this.selectedDate.visibleDate.year--;
                        } else {
                            monthIndex = i - 1;
                            this.selectedDate.visibleDate.month = SimpleCalendar.instance.currentYear.months[monthIndex].numericRepresentation;
                        }
                    }
                    const isLeapYear = SimpleCalendar.instance.currentYear.leapYearRule.isLeapYear(this.selectedDate.visibleDate.year);
                    const skipMonth = (isLeapYear && SimpleCalendar.instance.currentYear.months[monthIndex].numberOfLeapYearDays === 0) || (!isLeapYear && SimpleCalendar.instance.currentYear.months[monthIndex].numberOfDays === 0);
                    if(skipMonth){
                        this.changeMonth(next);
                        return;
                    }
                    break;
                }
            }
            this.update();
        }
    }
}
