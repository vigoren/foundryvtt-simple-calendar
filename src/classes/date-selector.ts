import {DayTemplate, SCDateSelector} from "../interfaces";
import SimpleCalendar from "./simple-calendar";
import {DateRangeMatch} from "../constants";
import {GameSettings} from "./game-settings";
import Utilities from "./utilities";
import Renderer from "./renderer";

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
     * If to show the year for date selection
     * @type {boolean}
     */
    showYear: boolean = true;
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
     * If to set the input box width to match the calendars width
     * @type {boolean}
     */
    setInputWidth: boolean = true;
    /**
     * Any place holder text for the Date Select input box
     * @type {string}
     */
    placeHolderText: string = '';
    /**
     * The string between the start and end time inputs
     * @type {string}
     */
    timeDelimiter: string = '-';
    /**
     * If the date selector allows users to select a range of dates or just a single date
     * @type {boolean}
     */
    dateRange: boolean = false;
    /**
     * If the time selectors allow users to select a range of time or just a single time stamp
     * @type {boolean}
     */
    timeRange: boolean = true;
    /**
     * If to show the time label next to the time inputs
     * @type {boolean}
     */
    showTimeLabel: boolean = true;
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
        if(options.showYear !== undefined){
            this.showYear = options.showYear;
        }
        if(options.inputMatchCalendarWidth !== undefined){
            this.setInputWidth = options.inputMatchCalendarWidth;
        }
        if(options.placeHolderText){
            this.placeHolderText = options.placeHolderText;
        }

        if(options.onDateSelect){
            this.onDateSelect = options.onDateSelect;
        }

        if(options.dateRangeSelect !== undefined){
            this.dateRange = options.dateRangeSelect;
        }
        if(options.timeRangeSelect !== undefined){
            this.timeRange = options.timeRangeSelect;
        }
        if(options.showTimeLabel !== undefined){
            this.showTimeLabel = options.showTimeLabel;
        }
        if(options.timeDelimiter !== undefined){
            this.timeDelimiter = options.timeDelimiter;
        }

        if(options.startDate !== undefined){
            this.selectedDate.startDate = {
                year: options.startDate.year,
                month: options.startDate.month,
                day: options.startDate.day,
                allDay: !this.showTime,
                hour: options.startDate.hour,
                minute: options.startDate.minute
            };
        } else {
            this.selectedDate.startDate = {
                year: 0,
                month: 1,
                day: 1,
                allDay: true,
                hour: 0,
                minute: 0
            };
        }
        this.selectedDate.visibleDate = {
            year: this.selectedDate.startDate.year,
            month: this.selectedDate.startDate.month,
            day: this.selectedDate.startDate.day,
            allDay: !this.selectedDate.startDate.allDay,
            hour: this.selectedDate.startDate.hour,
            minute: this.selectedDate.startDate.minute
        };
        this.selectedDate.endDate = this.selectedDate.startDate;
        if(options.endDate !== undefined){
            this.selectedDate.endDate = {
                year: options.endDate.year,
                month: options.endDate.month,
                day: options.endDate.day,
                allDay: !this.showTime,
                hour: options.endDate.hour,
                minute: options.endDate.minute
            };
        }
        if(options.allDay !== undefined){
            this.selectedDate.startDate.allDay = options.allDay;
            this.selectedDate.endDate.allDay = options.allDay;
            this.selectedDate.visibleDate.allDay = options.allDay;
        }
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
        let wrapper = `<div id="${this.id}" class="sc-date-selector">`;
        let calendarWidth = 0;
        let calendar = '';
        const timeMask = SimpleCalendar.instance.activeCalendar.generalSettings.dateFormat.time.replace(/:?[s]/g, '');

        if(this.showDate){
            calendar = Renderer.CalendarFull(SimpleCalendar.instance.activeCalendar, {
                id: `${this.id}_calendar`,
                cssClasses: `sc-date-selector-calendar`,
                colorToMatchSeason: false,
                showCurrentDay: false,
                showMoonPhases: false,
                showNoteCount: false,
                showSeasonName: false,
                showYear: this.showYear,
                date: {
                    month: SimpleCalendar.instance.activeCalendar.year.months.findIndex(m => m.numericRepresentation === this.selectedDate.visibleDate.month),
                    year: this.selectedDate.visibleDate.year
                },
                selectedDates: {
                    start: {
                        year: this.selectedDate.startDate.year,
                        month: SimpleCalendar.instance.activeCalendar.year.months.findIndex(m => m.numericRepresentation === this.selectedDate.startDate.month),
                        day: this.selectedDate.startDate.day
                    },
                    end: {
                        year: this.selectedDate.endDate.year,
                        month: SimpleCalendar.instance.activeCalendar.year.months.findIndex(m => m.numericRepresentation === this.selectedDate.endDate.month),
                        day: this.selectedDate.endDate.day
                    }
                }
            });
        }
        if(this.showTime){

            let startTimeText = `00:00`;
            let endTimeText = `00:00`;
            if(!this.selectedDate.startDate.allDay){
                startTimeText = ' ' + Utilities.FormatDateTime({year: 0, month: 1, day: 1, hour: this.selectedDate.startDate.hour, minute: this.selectedDate.startDate.minute, seconds: 0}, timeMask);
            }
            if(!this.selectedDate.endDate.allDay){
                endTimeText = ' ' + Utilities.FormatDateTime({year: 0, month: 1, day: 1, hour: this.selectedDate.endDate.hour, minute: this.selectedDate.endDate.minute, seconds: 0}, timeMask);
            }

            let timeWrapper = `<div class='time-container'>`;

            if(this.addTime){
                let startTimePicker = ``;
                let endTimePicker = ``;
                const halfHour = Math.floor(SimpleCalendar.instance.activeCalendar.year.time.minutesInHour / 2);
                for(let i = 0; i < SimpleCalendar.instance.activeCalendar.year.time.hoursInDay; i++){
                    let startSelected = '', startHalfSelected = '', endSelected = '', endHalfSelected = '';
                    if(this.selectedDate.startDate.hour === i || this.selectedDate.endDate.hour === i){
                        if(this.selectedDate.startDate.hour === i && this.selectedDate.startDate.minute === 0){
                            startSelected = 'selected';
                        } else if(this.selectedDate.startDate.hour === i && this.selectedDate.startDate.minute === halfHour){
                            startHalfSelected = 'selected';
                        } else if(this.selectedDate.endDate.minute === 0){
                            endSelected = 'selected';
                        } else if(this.selectedDate.endDate.minute === halfHour){
                            endHalfSelected = 'selected';
                        }
                    }
                    const hourStartDisp = Utilities.FormatDateTime({year: 0, month: 0, day: 0, hour: i, minute: 0, seconds: 0}, timeMask);
                    const hourMidDisp = Utilities.FormatDateTime({year: 0, month: 0, day: 0, hour: i, minute: halfHour, seconds: 0}, timeMask)
                    startTimePicker += `<div class="time-option ${startSelected}" data-hour="${i}" data-minute="0">${hourStartDisp}</div>`;
                    startTimePicker += `<div class="time-option ${startHalfSelected}" data-hour="${i}" data-minute="${halfHour}">${hourMidDisp}</div>`;
                    endTimePicker += `<div class="time-option ${endSelected}" data-hour="${i}" data-minute="0">${hourStartDisp}</div>`;
                    endTimePicker += `<div class="time-option ${endHalfSelected}" data-hour="${i}" data-minute="${halfHour}">${hourMidDisp}</div>`;

                }
                if(this.showDate || this.timeRange){
                    const startTime = `<div class="time-selector"><input class="start-time" type="text" value="${startTimeText}" /><div class="time-dropdown hide">${startTimePicker}</div></div>`;
                    const endTime = `<div class="time-selector"><input class="end-time" type="text" value="${endTimeText}" /><div class="time-dropdown hide">${endTimePicker}</div></div>`;
                    if(this.showTimeLabel){
                        timeWrapper += `<h3>${GameSettings.Localize('FSC.Notes.Time')}</h3>`;
                    }
                    if(this.timeRange){
                        timeWrapper += `<div class="time-selectors">${startTime}<span>${this.timeDelimiter}</span>${endTime}</div>`;
                    } else {
                        timeWrapper += `<div class="time-selectors">${startTime}</div>`;
                    }

                    if(this.showDate){
                        timeWrapper += `<button class="control delete"><i class="fa fa-times"></i> ${GameSettings.Localize('FSC.Clear')}</button>`;
                    }
                } else{
                    timeWrapper = `<div class='time-container just-time'><input class="start-time" type="hidden" value="${startTimeText}" /><div class="time-dropdown">${startTimePicker}</div>`;
                }
            } else {
                timeWrapper += `<div class="add-time"><button class="control"><i class="fa fa-clock"></i> ${GameSettings.Localize('FSC.Notes.DateTime.AllDay')}</button></div>`;
            }
            calendar += `${timeWrapper}</div>`;
        }
        const displayDate = Utilities.GetDisplayDate(this.selectedDate.startDate, this.selectedDate.endDate, (this.showTime && !this.showDate), this.showYear, this.timeDelimiter);
        if(!justCalendar){
            returnHtml = `${wrapper}<input class="display-input" style="${calendarWidth && this.setInputWidth? "width:"+calendarWidth+"px;" : ''}" value="${displayDate}" placeholder="${this.placeHolderText}" tabindex="0" type="text" readonly="readonly"><div class="sc-date-selector-calendar-wrapper${this.showTime && !this.showDate? ' just-time' : ''}" style="display:none;">${calendar}</div></div>`;
        } else {
            returnHtml = calendar;
            const displayInput = (<HTMLInputElement>document.querySelector(`#${this.id} .display-input`));
            if(displayInput){
                displayInput.value = displayDate;
            }
        }
        return returnHtml;
    }

    /**
     * Updates the current calendar display for showing a new month
     */
    update(){
        const newData = this.build(true);
        const ds = document.querySelector(`#${this.id} .sc-date-selector-calendar-wrapper`);
        if(ds){
            ds.innerHTML = newData;
            this.activateListeners(ds.parentElement, true);
            (<HTMLElement>ds).style.display = "block";
        }
    }

    /**
     * Adds all of the click events needed to the calendars HTML for proper interaction
     * @param {HTMLElement | null} html The HTML element for the calendar
     * @param {boolean} justCalendar If we should just update the listeners for the calendar
     */
    activateListeners(html: HTMLElement | null = null, justCalendar: boolean = false){
        if(!html){
            html = document.querySelector(`#${this.id}`);
        }
        if(html){
            const dateSelector = html;
            if(!justCalendar){
                document.addEventListener('click', this.hideCalendar.bind(this,html));
                const di = <HTMLElement>html.querySelector('.display-input');
                if(di){
                    di.addEventListener('click', this.toggleCalendar.bind(this, dateSelector));
                }
            }
            if(this.showDate){
                const cal = <HTMLElement>html.querySelector('.sc-date-selector-calendar');
                if(cal){
                    cal.addEventListener('click', this.calendarClick.bind(this));
                }
                const prev = <HTMLElement>html.querySelector('.calendar-header .current-date .fa-chevron-left');
                if(prev){
                    prev.addEventListener('click', this.prevClick.bind(this));
                }
                const next = <HTMLElement>html.querySelector('.calendar-header .current-date .fa-chevron-right');
                if(next){
                    next.addEventListener('click', this.nextClick.bind(this));
                }
                html.querySelectorAll('.days .day').forEach(el => {
                    el.addEventListener('click', this.dayClick.bind(this, dateSelector));
                });
            }

            if(this.showTime){
                const atb = html.querySelector('.add-time button');
                if(atb){
                    atb.addEventListener('click', this.addTimeClick.bind(this));
                }
                const cb = html.querySelector('.time-container button.control.delete');
                if(cb){
                    cb.addEventListener('click', this.removeTimeClick.bind(this));
                }
                html.querySelectorAll('.time-container input').forEach(el => {
                    el.addEventListener('click', this.timeClick.bind(this));
                });
                html.querySelectorAll('.time-container .time-dropdown .time-option').forEach(el => {
                    el.addEventListener('click', this.timeDropdownClick.bind(this));
                });
                html.querySelectorAll('.time-container input').forEach(el => {
                    el.addEventListener('change', this.timeUpdate.bind(this));
                });
            }
        }
    }

    /**
     * Toggles if the calendar portion of the input should be shown or not
     * @param {HTMLElement} html The HTMLElement for the calendar input wrapper
     * @param {Event} event The click event that triggered this call
     */
    toggleCalendar(html: HTMLElement, event: Event){
        event.stopPropagation();
        const cal = <HTMLElement> html.querySelector('.sc-date-selector-calendar-wrapper');
        if(cal){
            if(cal.style.display === 'none'){
                cal.style.display = 'block';
            } else {
                cal.style.display = 'none';
            }
        }
    }

    /**
     * Hides the calendar portion of the input
     * @param {HTMLElement} html The HTMLElement for the calendar
     */
    hideCalendar(html: HTMLElement){
        this.secondDaySelect = false;
        const cal = <HTMLElement>html.querySelector('.sc-date-selector-calendar-wrapper');
        if(cal && !!( cal.offsetWidth || cal.offsetHeight || cal.getClientRects().length )){
            cal.style.display = 'none';
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
     * @param {HTMLElement} html The HTMLElement for the date selector
     * @param {Event} event The click event that triggered this call
     */
    dayClick(html: HTMLElement, event: Event){
        event.stopPropagation();
        let target = <HTMLElement>event.target;
        const dataDate = target.getAttribute('data-day');
        const currentMonthYear = <HTMLElement>html.querySelector('.month-year');

        if(currentMonthYear && dataDate){
            const dataVis = currentMonthYear.getAttribute('data-visible');
            if(dataVis){
                const my = dataVis.split('/');
                if(my.length === 2){
                    const dayNumber = parseInt(dataDate);
                    const monthNumber = parseInt(my[0]);
                    const yearNumber = parseInt(my[1]);
                    if(!isNaN(yearNumber) && !isNaN(monthNumber) && !isNaN(dayNumber)){
                        let hideCalendar = true;
                        if(this.dateRange){
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
                                const sMonth = SimpleCalendar.instance.activeCalendar.year.months.findIndex(m => m.numericRepresentation === this.selectedDate.startDate.month);
                                const nMonth = SimpleCalendar.instance.activeCalendar.year.months.findIndex(m => m.numericRepresentation === monthNumber);
                                if(sMonth > -1){
                                    sMonthIndex = sMonth;
                                }
                                if(nMonth > -1){
                                    newMonthIndex = nMonth;
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
        let monthIndex = 0;
        for(let i = 0; i < SimpleCalendar.instance.activeCalendar.year.months.length; i++){
            if(SimpleCalendar.instance.activeCalendar.year.months[i].numericRepresentation === this.selectedDate.visibleDate.month){
                monthIndex = i;
                if(next){
                    if(i === SimpleCalendar.instance.activeCalendar.year.months.length - 1){
                        monthIndex = 0;
                        this.selectedDate.visibleDate.month = SimpleCalendar.instance.activeCalendar.year.months[monthIndex].numericRepresentation;
                        this.selectedDate.visibleDate.year++;
                    } else {
                        monthIndex = i + 1;
                        this.selectedDate.visibleDate.month = SimpleCalendar.instance.activeCalendar.year.months[monthIndex].numericRepresentation;
                    }

                } else{
                    if(!next && i === 0){
                        monthIndex = SimpleCalendar.instance.activeCalendar.year.months.length - 1;
                        this.selectedDate.visibleDate.month = SimpleCalendar.instance.activeCalendar.year.months[monthIndex].numericRepresentation;
                        this.selectedDate.visibleDate.year--;
                    } else {
                        monthIndex = i - 1;
                        this.selectedDate.visibleDate.month = SimpleCalendar.instance.activeCalendar.year.months[monthIndex].numericRepresentation;
                    }
                }
                const isLeapYear = SimpleCalendar.instance.activeCalendar.year.leapYearRule.isLeapYear(this.selectedDate.visibleDate.year);
                const skipMonth = (isLeapYear && SimpleCalendar.instance.activeCalendar.year.months[monthIndex].numberOfLeapYearDays === 0) || (!isLeapYear && SimpleCalendar.instance.activeCalendar.year.months[monthIndex].numberOfDays === 0);
                if(skipMonth){
                    this.changeMonth(next);
                    return;
                }
                break;
            }
        }
        this.update();
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

        if(hour > SimpleCalendar.instance.activeCalendar.year.time.hoursInDay - 1){
            hour = SimpleCalendar.instance.activeCalendar.year.time.hoursInDay - 1;
        } else if (hour < 0){
            hour = 0;
        }
        if(minute > SimpleCalendar.instance.activeCalendar.year.time.minutesInHour - 1){
            minute = SimpleCalendar.instance.activeCalendar.year.time.minutesInHour -1;
        } else if(minute < 0) {
            minute = 0;
        }
        if(cssClass === 'start-time'){
            if(hour >= this.selectedDate.endDate.hour){
                this.selectedDate.endDate.hour = hour;
                this.selectedDate.endDate.hour = hour + 1;
                if(this.selectedDate.endDate.hour > SimpleCalendar.instance.activeCalendar.year.time.hoursInDay - 1){
                    this.selectedDate.endDate.hour = SimpleCalendar.instance.activeCalendar.year.time.hoursInDay - 1;
                }

                if(minute > this.selectedDate.endDate.minute){
                    this.selectedDate.endDate.minute = minute;
                }
            }

            this.selectedDate.startDate.hour = hour;
            this.selectedDate.startDate.minute = minute;

        } else if(cssClass === 'end-time'){
            if(Utilities.DateTheSame(this.selectedDate.startDate, this.selectedDate.endDate)){
                if(hour <= this.selectedDate.startDate.hour){
                    hour = this.selectedDate.startDate.hour;

                    if(minute < this.selectedDate.startDate.minute){
                        minute = this.selectedDate.startDate.minute;
                    }
                }
            }
            this.selectedDate.endDate.hour = hour;
            this.selectedDate.endDate.minute = minute;
        }
        this.update();
        if(this.showTime && !this.showDate && this.onDateSelect){
            this.onDateSelect(this.selectedDate);
        }
    }
}
