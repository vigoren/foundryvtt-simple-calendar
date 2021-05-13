import {DayTemplate, SCDateSelector} from "../interfaces";
import SimpleCalendar from "./simple-calendar";
import {Note} from "./note";
import {DateRangeMatch} from "../constants";
import {GameSettings} from "./game-settings";

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

    /**
     * If the two dates are the same or not
     * @param {SCDateSelector.Date} startDate
     * @param {SCDateSelector.Date} endDate
     */
    static DateTheSame(startDate: SCDateSelector.Date, endDate: SCDateSelector.Date){
        return startDate.year === endDate.year && startDate.month == endDate.month && startDate.day === endDate.day;
    }

    /**
     * Checks if a passed in date is between 2 other dates. Will return a DateRangeMatch which indicates where it falls (Exact, Start, End, Between or None)
     * @param {SCDateSelector.Date} checkDate The date to check
     * @param {SCDateSelector.Date} startDate The starting date to use
     * @param {SCDateSelector.Date} endDate The ending date to use
     * @constructor
     */
    static IsDayBetweenDates(checkDate: SCDateSelector.Date, startDate: SCDateSelector.Date, endDate: SCDateSelector.Date){
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

            const eMonth = SimpleCalendar.instance.currentYear.months.findIndex(m => m.numericRepresentation === endDate.month);
            if(eMonth > -1){
                endMonthIndex = eMonth;
            } else {
                endMonthIndex = endDate.month;
            }
            // If the start and end date are the same
            if(checkDate.day === startDate.day && checkMonthIndex === startMonthIndex && checkDate.year === startDate.year && checkDate.day === endDate.day && checkMonthIndex === endMonthIndex && checkDate.year === endDate.year){
                between = DateRangeMatch.Exact;
            } else if(checkDate.day === startDate.day && checkMonthIndex === startMonthIndex && checkDate.year === startDate.year){
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
        }
        return between;
    }

    /**
     * Formats an hour and minute to include pre padded 0's
     * @param date
     * @constructor
     */
    static FormatTime(date: SCDateSelector.Date){
        let text = '';
        if(!date.allDay){
            let sHour: string | number = date.hour;
            let sMinute: string | number = date.minute;
            if(sHour < 10){
                sHour = `0${sHour}`;
            }
            if(sMinute < 10){
                sMinute = `0${sMinute}`;
            }
            text = `${sHour}:${sMinute}`;
        }
        return text;
    }

    /**
     * Gets the formatted display date for the passed in start and end date.
     * @param {SCDateSelector.Date} startDate The starting datetime
     * @param {SCDateSelector.Date} endDate The ending datetime
     * @param {boolean} [dontIncludeSameDate=false] If to include the date if it is the same in the result (useful for just getting the time)
     */
    static GetDisplayDate(startDate: SCDateSelector.Date, endDate: SCDateSelector.Date, dontIncludeSameDate: boolean = false){
        let startDateTimeText = '', endDateTimeText = '', startingMonthName = '', endingMonthName = '';
        if(SimpleCalendar.instance && SimpleCalendar.instance.currentYear){
            const startingMonth = SimpleCalendar.instance.currentYear.months.find(m => m.numericRepresentation === startDate.month);
            const endingMonth = SimpleCalendar.instance.currentYear.months.find(m => m.numericRepresentation === endDate.month);
            if(startingMonth){
                startingMonthName = startingMonth.name;
            }
            if(endingMonth){
                endingMonthName = endingMonth.name;
            }

            if(!DateSelector.DateTheSame(startDate, endDate)){
                startDateTimeText += `${startingMonthName} ${startDate.day}`;
                endDateTimeText += `${endingMonthName} ${endDate.day}`;
                if(!dontIncludeSameDate || (dontIncludeSameDate && startDate.year !== endDate.year)){
                    startDateTimeText += `, ${startDate.year}`;
                    endDateTimeText += `, ${endDate.year}`;
                }
            } else if(!dontIncludeSameDate){
                startDateTimeText += `${startingMonthName} ${startDate.day}, ${startDate.year}`;
            }

            let startTimeText = `00:00`;
            let endTimeText = `00:00`;
            if(!startDate.allDay){
                startTimeText = ' ' + DateSelector.FormatTime(startDate);
                startDateTimeText += startTimeText;
            }
            if(!endDate.allDay){
                endTimeText = ' ' + DateSelector.FormatTime(endDate);
                if(endDateTimeText !== '' || (endDateTimeText === '' && startTimeText !== endTimeText)){
                    endDateTimeText += endTimeText;
                }
            }
        }
        return `${startDateTimeText}${endDateTimeText? ' - ' + endDateTimeText: ''}`;
    }

    /**
     * The unique ID of the date selector object
     * @type {string}
     */
    id: string;
    /**
     * If to show the calendar portion of the picker
     * @type{boolean}
     */
    showDate: boolean;
    /**
     * If to show the time portion of the picker
     * @type{boolean}
     */
    showTime: boolean;
    /**
     * If the add time controls should be shown or not
     */
    addTime: boolean = false;
    /**
     * Any place holder text for the Date Select input box
     * @type {string}
     */
    placeHolderText: string = '';
    /**
     * If the date selector allows users to select a range of dates or just a single date
     * @type {boolean}
     */
    range: boolean = false;
    /**
     * Used internally to determine if the second day of a range has been selected.
     * @type {boolean}
     */
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
        this.showDate = options.showDate;
        this.showTime = options.showTime;
        this.selectedDate = {
            visibleDate:{
                year: 0,
                month: 0,
                day: 0,
                allDay: true,
                hour: 0,
                minute: 0
            },
            startDate: {
                year: 0,
                month: 0,
                day: 0,
                allDay: true,
                hour: 0,
                minute: 0
            },
            endDate: {
                year: 0,
                month: 0,
                day: 0,
                allDay: true,
                hour: 0,
                minute: 0
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
            day: note.day,
            allDay: note.allDay,
            hour: note.hour,
            minute: note.minute
        };
        this.selectedDate.visibleDate = {
            year: note.year,
            month: note.month,
            day: note.day,
            allDay: note.allDay,
            hour: note.hour,
            minute: note.minute
        };
        this.selectedDate.endDate = {
            year: note.endDate.year,
            month: note.endDate.month,
            day: note.endDate.day,
            allDay: note.allDay,
            hour: note.endDate.hour? note.endDate.hour : 0,
            minute: note.endDate.minute? note.endDate.minute : 0
        };
        if(!this.selectedDate.startDate.allDay){
            this.addTime = true;
        }
    }

    /**
     * Builds the HTML string for the Date Select input
     * @param {boolean} [justCalendar=false] If we should just be rendering the calendar HTML or the full inputs HTML
     */
    build(justCalendar = false){
        let returnHtml = '';
        if(SimpleCalendar.instance && SimpleCalendar.instance.currentYear){
            const wrapper = jQuery(`<div id="${this.id}" class="sc-date-selector"></div>`);
            let calendarWidth = 0;
            if(this.showDate){
                let weeks: (boolean | DayTemplate)[][] = [[false]],
                    visibleMonthName: string = '',
                    weekdays = SimpleCalendar.instance.currentYear.showWeekdayHeadings? SimpleCalendar.instance.currentYear.weekdays : [];
                const visibleMonth = SimpleCalendar.instance.currentYear.months.find(m => m.numericRepresentation === this.selectedDate.visibleDate.month);
                if(visibleMonth){
                    weeks = SimpleCalendar.instance.currentYear.daysIntoWeeks(visibleMonth, this.selectedDate.startDate.year, SimpleCalendar.instance.currentYear.weekdays.length);
                    visibleMonthName = visibleMonth.name;
                }

                if(!weeks.length){
                    return '';
                }
                calendarWidth = (10 + (weeks[0].length * 40));
                const calendar = jQuery(`<div class="sc-date-selector-calendar" style="display: none;width: ${calendarWidth}px;"></div>`);
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
                                day: (<DayTemplate>weeks[i][d]).numericRepresentation,
                                allDay: true,
                                hour: 0,
                                minute: 0
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

                if(this.showTime){
                    let startTimeText = `00:00`;
                    let endTimeText = `00:00`;
                    if(!this.selectedDate.startDate.allDay){
                        startTimeText = ' ' + DateSelector.FormatTime(this.selectedDate.startDate);
                    }
                    if(!this.selectedDate.endDate.allDay){
                        endTimeText = ' ' + DateSelector.FormatTime(this.selectedDate.endDate);
                    }

                    const timeWrapper = jQuery(`<div class='time-container'></div>`);

                    if(this.addTime){
                        const timeSelectors = jQuery(`<div class="time-selectors"></div>`);
                        const startTime = jQuery(`<div class="time-selector"><input class="start-time" type="text" value="${startTimeText}" /></div>`);
                        const endTime = jQuery(`<div class="time-selector"><input class="end-time" type="text" value="${endTimeText}" /></div>`);

                        const timePicker = jQuery(`<div class="time-dropdown hide"></div>`);
                        const halfHour = Math.floor(SimpleCalendar.instance.currentYear.time.minutesInHour / 2);
                        for(let i = 0; i < SimpleCalendar.instance.currentYear.time.hoursInDay; i++){
                            timePicker.append(`<div class="time-option" data-hour="${i}" data-minute="0">${i < 10? '0'+i : i}:00</div>`);
                            timePicker.append(`<div class="time-option" data-hour="${i}" data-minute="${halfHour}">${i < 10? '0'+i : i}:${halfHour}</div>`);
                        }
                        timePicker.find(`.time-option[data-hour='${this.selectedDate.startDate.hour}'][data-minute='${this.selectedDate.startDate.minute}']`).addClass('selected');
                        startTime.append(`<div class="time-dropdown hide">${timePicker.html()}</div>`);
                        timePicker.find('.time-option').removeClass('selected');
                        timePicker.find(`.time-option[data-hour='${this.selectedDate.endDate.hour}'][data-minute='${this.selectedDate.endDate.minute}']`).addClass('selected');
                        endTime.append(timePicker);

                        timeSelectors.append(startTime);
                        timeSelectors.append(`<span>-</span>`);
                        timeSelectors.append(endTime);
                        timeWrapper.append(`<h3>${GameSettings.Localize('FSC.Notes.Time')}</h3>`);
                        timeWrapper.append(timeSelectors);
                        timeWrapper.append(`<button class="control delete"><i class="fa fa-times"></i> ${GameSettings.Localize('FSC.Clear')}</button>`);
                    } else {
                        timeWrapper.append(`<div class="add-time"><button class="control"><i class="fa fa-clock"></i> ${GameSettings.Localize('FSC.Notes.DateTime.AllDay')}</button></div>`)
                    }
                    calendar.append(timeWrapper);
                }

                if(justCalendar){
                    returnHtml = calendar.html();
                }else{
                    returnHtml = jQuery('<div></div>').append(calendar).html();
                }

            }
            const displayDate = DateSelector.GetDisplayDate(this.selectedDate.startDate, this.selectedDate.endDate);
            if(!justCalendar){
                wrapper.append(`<input class="display-input" style="width: ${calendarWidth}px;" value="${displayDate}" placeholder="${this.placeHolderText}" tabindex="0" type="text" readonly="readonly">`);
                wrapper.append(returnHtml);
                returnHtml = jQuery('<div></div>').append(wrapper).html();
            } else {
                jQuery(`#${this.id} .display-input`).val(`${displayDate}`);
            }
        }
        return returnHtml;
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
        if(this.showDate){
            if(!justCalendar){
                html.on('click', this.hideCalendar.bind(this, html));
                dateSelector.find('.display-input').on('click', this.toggleCalendar.bind(this, dateSelector));
            }
            dateSelector.find('.sc-date-selector-calendar').on('click', this.calendarClick.bind(this));
            dateSelector.find('.days .day').on('click', this.dayClick.bind(this, dateSelector));
            dateSelector.find('.header .current .prev').on('click', this.prevClick.bind(this));
            dateSelector.find('.header .current .next').on('click', this.nextClick.bind(this));
        }

        if(this.showTime){
            dateSelector.find('.add-time button').on('click', this.addTimeClick.bind(this));
            dateSelector.find('.time-container button.control.delete').on('click', this.removeTimeClick.bind(this));
            dateSelector.find('.time-container .time-selectors input').on('click', this.timeClick.bind(this));
            dateSelector.find('.time-container .time-selectors .time-dropdown .time-option').on('click', this.timeDropdownClick.bind(this));
            dateSelector.find('.time-container .time-selectors input').on('change', this.timeUpdate.bind(this));
        }
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
        this.secondDaySelect = false;
        const cal = html.find('.sc-date-selector-calendar');
        if(cal.is(':visible')){
            cal.hide();
            if(this.onDateSelect){
                this.onDateSelect(this.selectedDate);
            }
        }
    }

    /**
     * If the calendar container div is clicked
     * @param {Event} event
     */
    calendarClick(event: Event){
        event.stopPropagation();

        // Hide all time dropdowns
        const wrapper = document.getElementById(this.id);
        if(wrapper){
            const dropdowns = wrapper.getElementsByClassName('time-dropdown');
            for(let i = 0; i < dropdowns.length; i++){
                dropdowns[i].classList.add('hide');
            }
        }
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
                                this.selectedDate.endDate.year = yearNumber;
                                this.selectedDate.endDate.month = monthNumber;
                                this.selectedDate.endDate.day = dayNumber;
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
                                // End date is less than start date
                                if(
                                    (this.selectedDate.startDate.day > dayNumber && sMonthIndex === newMonthIndex  && this.selectedDate.startDate.year === yearNumber) ||
                                    (sMonthIndex > newMonthIndex && this.selectedDate.startDate.year === yearNumber) ||
                                    this.selectedDate.startDate.year > yearNumber)
                                {
                                    const newSDate = {
                                        year: yearNumber,
                                        month: monthNumber,
                                        day: dayNumber,
                                        allDay: this.selectedDate.endDate.allDay,
                                        hour: this.selectedDate.endDate.hour,
                                        minute: this.selectedDate.endDate.minute
                                    };
                                    this.selectedDate.endDate = {
                                        year: this.selectedDate.startDate.year,
                                        month: this.selectedDate.startDate.month,
                                        day: this.selectedDate.startDate.day,
                                        allDay: this.selectedDate.startDate.allDay,
                                        hour: this.selectedDate.startDate.hour,
                                        minute: this.selectedDate.startDate.minute
                                    };
                                    this.selectedDate.startDate = newSDate;
                                }
                                else {
                                    this.selectedDate.endDate.year = yearNumber;
                                    this.selectedDate.endDate.month = monthNumber;
                                    this.selectedDate.endDate.day = dayNumber;
                                }
                                this.secondDaySelect = false;
                            }
                        } else {
                            this.selectedDate.startDate.year = yearNumber;
                            this.selectedDate.startDate.month = monthNumber;
                            this.selectedDate.startDate.day = dayNumber;
                            this.selectedDate.endDate.year = yearNumber;
                            this.selectedDate.endDate.month = monthNumber;
                            this.selectedDate.endDate.day = dayNumber;
                        }
                        if(hideCalendar){
                            this.update();
                            this.hideCalendar(html);
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

    /**
     * When the add time button is clicked to add a specific time for this note
     * @param {Event} event
     */
    addTimeClick(event: Event){
        event.stopPropagation();
        this.addTime = true;
        this.selectedDate.startDate.allDay = false;
        this.selectedDate.startDate.hour = 0;
        this.selectedDate.startDate.minute = 0;
        this.selectedDate.endDate.allDay = false;
        this.selectedDate.endDate.hour = 0;
        this.selectedDate.endDate.minute = 0;
        this.update();

    }

    /**
     * When the clear time button is clicked, will remove all time associated with this note
     * @param {Event} event
     */
    removeTimeClick(event: Event){
        event.stopPropagation();
        this.addTime = false;
        this.selectedDate.startDate.allDay = true;
        this.selectedDate.startDate.hour = 0;
        this.selectedDate.startDate.minute = 0;
        this.selectedDate.endDate.allDay = true;
        this.selectedDate.endDate.hour = 0;
        this.selectedDate.endDate.minute = 0;
        this.update();
    }

    /**
     * When a time input is clicked, show the selector list
     * @param event
     */
    timeClick(event: Event){
        event.stopPropagation();
        this.calendarClick(event);
        const parent = (<HTMLElement>event.currentTarget).parentElement;
        if(parent !== null){
            const dropdown = parent.getElementsByClassName('time-dropdown');
            if(dropdown.length){
                dropdown[0].classList.remove('hide');
            }
        }
    }

    /**
     * When an option of the time dropdown is clicked
     * @param event
     */
    timeDropdownClick(event: Event){
        event.stopPropagation();
        const clickedHour = (<HTMLElement>event.currentTarget).getAttribute('data-hour');
        const clickedMinute= (<HTMLElement>event.currentTarget).getAttribute('data-minute');

        let hour = 0;
        let minute = 0;

        if(clickedHour && clickedMinute){
            const parsedHour = parseInt(clickedHour);
            const parsedMinute = parseInt(clickedMinute);
            if(!isNaN(parsedHour)){
                hour = parsedHour;
            }
            if(!isNaN(parsedMinute)){
                minute = parsedMinute;
            }
        }

        const input = (<HTMLElement>event.currentTarget).parentElement?.parentElement?.getElementsByTagName('input');
        if(input && input.length){
            input[0].value = `${hour}:${minute}`;
            const e = new Event('change');
            input[0].dispatchEvent(e);
        }

    }

    /**
     * When any of the time text boxes are updated.
     * @param {Event} event
     */
    timeUpdate(event: Event){
        event.stopPropagation();
        const cssClass = (<HTMLElement>event.currentTarget).getAttribute('class');
        let value = (<HTMLInputElement>event.currentTarget).value;

        let hour, minute = 0;
        const vParts = value.split(':');
        if(vParts.length === 2){
            hour = parseInt(vParts[0]);
            minute = parseInt(vParts[1]);
        } else {
            hour = parseInt(vParts[0]);
        }

        if(isNaN(hour)){
            hour = 0;
        }

        if(isNaN(minute)){
            minute = 0;
        }

        if(SimpleCalendar.instance && SimpleCalendar.instance.currentYear){
            if(hour > SimpleCalendar.instance.currentYear.time.hoursInDay - 1){
                hour = SimpleCalendar.instance.currentYear.time.hoursInDay - 1;
            } else if (hour < 0){
                hour = 0;
            }
            if(minute > SimpleCalendar.instance.currentYear.time.minutesInHour - 1){
                minute = SimpleCalendar.instance.currentYear.time.minutesInHour -1;
            } else if(minute < 0) {
                minute = 0;
            }
            if(cssClass === 'start-time'){
                this.selectedDate.startDate.hour = hour;
                this.selectedDate.startDate.minute = minute;

                if(this.selectedDate.endDate.hour === 0){
                    this.selectedDate.endDate.hour = hour + 1;
                    if(this.selectedDate.endDate.hour > SimpleCalendar.instance.currentYear.time.hoursInDay - 1){
                        this.selectedDate.endDate.hour = SimpleCalendar.instance.currentYear.time.hoursInDay - 1;
                    }
                }
            } else if(cssClass === 'end-time'){
                if(hour <= this.selectedDate.startDate.hour){
                    hour = this.selectedDate.startDate.hour;

                    if(minute < this.selectedDate.startDate.minute){
                        minute = this.selectedDate.startDate.minute;
                    }
                }
                this.selectedDate.endDate.hour = hour;
                this.selectedDate.endDate.minute = minute;
            }
            this.update();
        }
    }
}
