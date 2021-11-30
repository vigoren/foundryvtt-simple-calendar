import {SCDateSelector, SCRenderer} from "../../interfaces";
import {GameSettings} from "../foundry-interfacing/game-settings";
import {GetDisplayDate, DateTheSame} from "../utilities/date-time";
import Renderer from "../renderer";
import {CalendarClickEvents, DateSelectorPositions} from "../../constants";
import Calendar from "../calendar";
import {CalManager} from "../index";

export default class DateSelector {
    /**
     * The unique ID of the date selector object
     * @type {string}
     */
    id: string;
    /**
     * If to show the calendar portion of the picker
     * @type{boolean}
     */
    showDateSelector: boolean;
    /**
     * If to show the year for date selection
     * @type {boolean}
     */
    showCalendarYear: boolean = true;
    /**
     * If to show the time portion of the picker
     * @type{boolean}
     */
    showTimeSelector: boolean;
    /**
     * If the add time controls should be shown or not
     */
    addTime: boolean = false;
    /**
     * The string between the start and end time inputs
     * @type {string}
     */
    timeDelimiter: string = '-';
    /**
     * If the date selector allows users to select a range of dates or just a single date
     * @type {boolean}
     */
    allowDateRangeSelection: boolean = false;
    /**
     * If the time selectors allow users to select a range of time or just a single time stamp
     * @type {boolean}
     */
    allowTimeRangeSelection: boolean = true;
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

    position: DateSelectorPositions = DateSelectorPositions.Auto;

    calendar: Calendar = CalManager.getActiveCalendar();

    calendarId: string;

    timeSelectorId: string;

    editYear: boolean = false;


    /**
     * Constructor for a new Date Selector
     * @param {string} id The unique ID of the selector to add
     * @param {SCDateSelector.Options} options The options associated with setting up the new Date Selector
     */
    constructor(id: string, options: SCDateSelector.Options) {
        this.id = id;
        this.calendarId = `${this.id}_calendar`;
        this.timeSelectorId = `${this.id}_time_selector`;
        this.showDateSelector = true;
        this.showTimeSelector = false;
        this.selectedDate = {
            visibleDate:{
                year: 0,
                month: 1,
                day: 1,
                allDay: true,
                hour: 0,
                minute: 0
            },
            startDate: {
                year: 0,
                month: 1,
                day: 1,
                allDay: true,
                hour: 0,
                minute: 0
            },
            endDate: {
                year: 0,
                month: 1,
                day: 1,
                allDay: true,
                hour: 0,
                minute: 0
            }
        };
        this.applyOptions(options);
        if(options.selectedEndDate === undefined){
            this.selectedDate.endDate = {
                year: this.selectedDate.startDate.year,
                month: this.selectedDate.startDate.month,
                day: this.selectedDate.startDate.day,
                hour: this.selectedDate.startDate.hour,
                minute: this.selectedDate.startDate.minute,
                allDay: this.selectedDate.startDate.allDay
            };
        }
        if(!this.selectedDate.startDate.allDay){
            this.addTime = true;
        }
    }

    /**
     * Applies the passed in options object to the date selector
     * @param options
     */
    applyOptions(options: SCDateSelector.Options){
        if(options.calendar !== undefined){
            this.calendar = options.calendar;
        }
        if(options.showDateSelector !== undefined){
            this.showDateSelector = options.showDateSelector;
        }
        if(options.showTimeSelector !== undefined){
            this.showTimeSelector = options.showTimeSelector;
        }
        if(options.showCalendarYear !== undefined){
            this.showCalendarYear = options.showCalendarYear;
        }
        if(options.onDateSelect){
            this.onDateSelect = options.onDateSelect;
        }
        if(options.position){
            this.position = options.position;
        }

        if(options.allowDateRangeSelection !== undefined){
            this.allowDateRangeSelection = options.allowDateRangeSelection;
        }
        if(options.allowTimeRangeSelection !== undefined){
            this.allowTimeRangeSelection = options.allowTimeRangeSelection;
        }
        if(options.editYear !== undefined){
            this.editYear = options.editYear;
        }
        if(options.timeDelimiter !== undefined){
            this.timeDelimiter = options.timeDelimiter;
        }
        if(options.selectedStartDate !== undefined){
            this.selectedDate.startDate = {
                year: options.selectedStartDate.year,
                month: options.selectedStartDate.month,
                day: options.selectedStartDate.day,
                allDay: !this.showTimeSelector,
                hour: options.selectedStartDate.hour,
                minute: options.selectedStartDate.minute
            };
            this.selectedDate.visibleDate = {
                year: this.selectedDate.startDate.year,
                month: this.selectedDate.startDate.month,
                day: this.selectedDate.startDate.day,
                allDay: !this.selectedDate.startDate.allDay,
                hour: this.selectedDate.startDate.hour,
                minute: this.selectedDate.startDate.minute
            };
        }
        if(options.selectedEndDate !== undefined){
            this.selectedDate.endDate = {
                year: options.selectedEndDate.year,
                month: options.selectedEndDate.month,
                day: options.selectedEndDate.day,
                allDay: !this.showTimeSelector,
                hour: options.selectedEndDate.hour,
                minute: options.selectedEndDate.minute
            };
        }
        if(options.timeSelected !== undefined){
            this.selectedDate.startDate.allDay = !options.timeSelected;
            this.selectedDate.endDate.allDay = !options.timeSelected;
            this.selectedDate.visibleDate.allDay = !options.timeSelected;
        }
    }

    /**
     * Builds the HTML string for the Date Select input
     * @param {boolean} [hideCalendar=false] If we should just be rendering the calendar HTML or the full inputs HTML
     */
    build(hideCalendar = true, includeWrapper: boolean = true){
        let returnHtml;
        let wrapper = `<div id="${this.id}" class="sc-date-selector">`;
        let calendar = '';
        let timeSelectors = '';

        if(this.showDateSelector){
            calendar = Renderer.CalendarFull.Render(this.calendar, {
                id: this.calendarId,
                allowChangeMonth: true,
                allowSelectDateRange: this.allowDateRangeSelection,
                cssClasses: `sc-date-selector-calendar`,
                colorToMatchSeason: false,
                editYear: this.editYear,
                showCurrentDate: false,
                showMoonPhases: false,
                showNoteCount: false,
                showSeasonName: false,
                showYear: this.showCalendarYear,
                date: {
                    month: this.calendar.year.months.findIndex(m => m.numericRepresentation === this.selectedDate.visibleDate.month),
                    year: this.selectedDate.visibleDate.year
                },
                selectedDates: {
                    start: {
                        year: this.selectedDate.startDate.year,
                        month: this.calendar.year.months.findIndex(m => m.numericRepresentation === this.selectedDate.startDate.month),
                        day: this.selectedDate.startDate.day
                    },
                    end: {
                        year: this.selectedDate.endDate.year,
                        month: this.calendar.year.months.findIndex(m => m.numericRepresentation === this.selectedDate.endDate.month),
                        day: this.selectedDate.endDate.day
                    }
                }
            });
        }
        if(this.showTimeSelector){
            timeSelectors = `<div class="sc-date-selector-time-selector-wrapper">`
            if(this.addTime){
                timeSelectors += Renderer.TimeSelector.Render(this.calendar, {
                    id: this.timeSelectorId,
                    allowTimeRange: this.allowTimeRangeSelection,
                    disableSelfUpdate: true,
                    selectedTime: {
                        start: {
                            hour: this.selectedDate.startDate.hour,
                            minute: this.selectedDate.startDate.minute
                        },
                        end: {
                            hour: this.selectedDate.endDate.hour,
                            minute: this.selectedDate.endDate.minute
                        }
                    },
                    timeDelimiter: this.timeDelimiter
                });
                if(this.showDateSelector){
                    timeSelectors += `<div class="remove-time"><button class="control delete"><i class="fa fa-times"></i> ${GameSettings.Localize('FSC.RemoveTime')}</button></div>`;
                }
            } else {
                timeSelectors += `<div class="add-time"><button class="control"><i class="fa fa-clock"></i> ${GameSettings.Localize('FSC.Notes.DateTime.AllDay')}</button></div>`;
            }
            timeSelectors += `</div>`;
        }
        const displayDate = GetDisplayDate(this.calendar, this.selectedDate.startDate, this.selectedDate.endDate, (this.showTimeSelector && !this.showDateSelector), this.showCalendarYear, this.timeDelimiter);
        returnHtml = `<input class="display-input" value="${displayDate}" tabindex="0" type="text" readonly="readonly"><div class="sc-date-selector-calendar-wrapper${this.showTimeSelector && !this.showDateSelector? ' just-time' : ''}" style="display:${hideCalendar? 'none' : 'block'};">${calendar}${timeSelectors}</div>`;
        if(includeWrapper){
            returnHtml = `${wrapper}${returnHtml}</div>`
        }
        return returnHtml;
    }

    /**
     * Sets the position class for the date selector based on the set option. If auto will attempt to fit it into the window app the date selector is in
     * @param element
     */
    setPosition(element: HTMLElement | null){
        if(element){
            element.classList.remove(DateSelectorPositions.LeftUp);
            element.classList.remove(DateSelectorPositions.LeftDown);
            element.classList.remove(DateSelectorPositions.RightUp);
            element.classList.remove(DateSelectorPositions.RightDown);
            let positionClass: DateSelectorPositions | string = this.position;
            if(this.position === DateSelectorPositions.Auto){
                //Look at the element and position it so it is the most visible
                const container = element.closest('.window-app');
                if(container){
                    let elementBoundingRect = element.getBoundingClientRect();
                    //If inside a foundry window, adjust the bounding rects to match that of the windows not the browser.
                    if(container){
                        const containerBoundingRect = container.getBoundingClientRect();
                        //Align to the right
                        if(elementBoundingRect.right > containerBoundingRect.right){
                            positionClass = 'right-';
                        } else {
                            positionClass = 'left-';
                        }
                        if(elementBoundingRect.bottom > containerBoundingRect.bottom && (elementBoundingRect.top - elementBoundingRect.height) > containerBoundingRect.top){
                            positionClass += 'up';
                        } else {
                            positionClass += 'down';
                        }
                    }
                }
            }
            element.classList.add(positionClass);
        }
    }

    /**
     * Updates the current calendar display for showing a new month
     */
    update(hideCalendar: boolean = false){
        const newData = this.build(hideCalendar, false);
        const ds = <HTMLElement>document.querySelector(`#${this.id}`);
        if(ds){
            ds.innerHTML = newData;
            this.activateListeners(ds, true, true, false);
            (<HTMLElement>ds).style.display = "block";
            this.setPosition(<HTMLElement> ds.querySelector('.sc-date-selector-calendar-wrapper'));
        }
    }

    /**
     * Adds all of the click events needed to the calendars HTML for proper interaction
     * @param {HTMLElement | null} html The HTML element for the calendar
     * @param {boolean} activateCalendarListeners If we should activate the calendar listeners
     * @param {boolean} activateTimeListeners If we should activate the time selector listeners
     * @param {boolean} activateDomListener If we should activate the document listener
     */
    activateListeners(html: HTMLElement | null = null, activateCalendarListeners: boolean = true, activateTimeListeners: boolean = true, activateDomListener: boolean = true){
        if(!html){
            html = document.querySelector(`#${this.id}`);
        }
        if(html){
            if(activateDomListener){
                document.addEventListener('click', this.hideCalendar.bind(this,html));
            }
            if(activateCalendarListeners && activateTimeListeners){
                const di = <HTMLElement>html.querySelector('.display-input');
                if(di){
                    di.addEventListener('click', this.toggleCalendar.bind(this, html));
                }
            }

            if(activateCalendarListeners && this.showDateSelector){
                Renderer.CalendarFull.ActivateListeners(this.calendarId, this.changeMonthClick.bind(this), this.dayClick.bind(this), this.changeYear.bind(this));
            }
            if(this.showDateSelector){
                const cal = <HTMLElement>html.querySelector('.sc-date-selector-calendar');
                if(cal){
                    cal.addEventListener('click', this.calendarClick.bind(this));
                }
            }


            if(activateTimeListeners && this.showTimeSelector){
                Renderer.TimeSelector.ActivateListeners(this.timeSelectorId, this.timeChange.bind(this));
            }
            if(this.showTimeSelector){
                const atb = html.querySelector('.add-time button');
                if(atb){
                    atb.addEventListener('click', this.addTimeClick.bind(this));
                }
                const cb = html.querySelector('.remove-time button');
                if(cb){
                    cb.addEventListener('click', this.removeTimeClick.bind(this));
                }
            }
        }
    }

    /**
     * Will call the onDateSelect function set by the options, if set.
     */
    callOnDateSelect(){
        if(this.onDateSelect){

            const startMonthIndex = this.calendar.year.months.findIndex(m => m.numericRepresentation === this.selectedDate.startDate.month);
            const endMonthIndex = this.calendar.year.months.findIndex(m => m.numericRepresentation === this.selectedDate.endDate.month);
            let startDayIndex = 0;
            let endDayIndex = 0;
            if(startMonthIndex > -1){
                startDayIndex = this.calendar.year.months[startMonthIndex].days.findIndex(d => d.numericRepresentation === this.selectedDate.startDate.day);
            }
            if(endMonthIndex > -1){
                endDayIndex = this.calendar.year.months[endMonthIndex].days.findIndex(d => d.numericRepresentation === this.selectedDate.endDate.day);
            }


            const returnValue = {
                startDate: {
                    year: this.selectedDate.startDate.year,
                    month: startMonthIndex,
                    day: startDayIndex,
                    hour: this.selectedDate.startDate.hour,
                    minute: this.selectedDate.startDate.minute
                },
                endDate: {
                    year: this.selectedDate.endDate.year,
                    month: endMonthIndex,
                    day: endDayIndex,
                    hour: this.selectedDate.endDate.hour,
                    minute: this.selectedDate.endDate.minute
                },
                timeSelected: !this.selectedDate.startDate.allDay
            };
            this.onDateSelect(returnValue);
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
                this.setPosition(cal);
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
            this.callOnDateSelect();
        }
    }

    /**
     * If the calendar container div is clicked
     * @param {Event} event
     */
    calendarClick(event: Event){
        event.stopPropagation();
        Renderer.TimeSelector.HideTimeDropdown(this.timeSelectorId);

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
     * @param {SCRenderer.CalendarOptions} options The renderer options returned from the click event
     */
    dayClick(options: SCRenderer.CalendarOptions){
        if(options.selectedDates){
            let hideCalendar = true;
            if(!this.secondDaySelect){
                this.selectedDate.startDate.year = options.selectedDates.start.year;
                this.selectedDate.startDate.month = this.calendar.year.months[options.selectedDates.start.month].numericRepresentation;
                this.selectedDate.startDate.day = options.selectedDates.start.day || 1;
                this.selectedDate.endDate.year = options.selectedDates.start.year;
                this.selectedDate.endDate.month = this.calendar.year.months[options.selectedDates.start.month].numericRepresentation;
                this.selectedDate.endDate.day = options.selectedDates.start.day || 1;
                this.secondDaySelect = true;
                hideCalendar = !this.allowDateRangeSelection;

            }else{
                this.selectedDate.startDate.year = options.selectedDates.start.year;
                this.selectedDate.startDate.month = this.calendar.year.months[options.selectedDates.start.month].numericRepresentation;
                this.selectedDate.startDate.day = options.selectedDates.start.day || 1;
                this.selectedDate.endDate.year = options.selectedDates.end.year;
                this.selectedDate.endDate.month = this.calendar.year.months[options.selectedDates.end.month].numericRepresentation;
                this.selectedDate.endDate.day = options.selectedDates.end.day || 1;
            }

            if(hideCalendar){
                this.secondDaySelect = false;
                this.update(hideCalendar);
                this.callOnDateSelect();
            } else if(this.showTimeSelector){
                Renderer.TimeSelector.HideTimeDropdown(this.timeSelectorId);
            }
        }
    }

    /**
     * Processes the callback from the Calendar Renderer's month change click
     * @param clickType
     * @param options
     */
    changeMonthClick(clickType: CalendarClickEvents, options: SCRenderer.CalendarOptions){
        if(options.date){
            this.selectedDate.visibleDate.year = options.date.year;
            this.selectedDate.visibleDate.month = this.calendar.year.months[options.date.month].numericRepresentation;
        }
        this.activateListeners(null, false, false);
        if(this.showTimeSelector){
            Renderer.TimeSelector.HideTimeDropdown(this.timeSelectorId);
        }
    }

    /**
     * Processes the callback from the Calendar Renderer's year change event
     * @param options
     */
    changeYear(options: SCRenderer.CalendarOptions){
        if(options.date){
            this.selectedDate.visibleDate.year = options.date.year;
        }
        this.activateListeners(null, false, false);
        if(this.showTimeSelector){
            Renderer.TimeSelector.HideTimeDropdown(this.timeSelectorId);
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
     * Called when the time selector has benn changed
     * @param options
     */
    timeChange(options: SCRenderer.TimeSelectorOptions){
        if(options.selectedTime){
            //If the day is the same, make sure that the end time is not before the start time
            if(DateTheSame(this.selectedDate.startDate, this.selectedDate.endDate)){
                if(options.selectedTime.end.hour <= options.selectedTime.start.hour){
                    options.selectedTime.end.hour = options.selectedTime.start.hour;

                    if(options.selectedTime.end.minute < options.selectedTime.start.minute){
                        options.selectedTime.end.minute = options.selectedTime.start.minute;
                    }
                }
            }

            this.selectedDate.startDate.hour = options.selectedTime.start.hour;
            this.selectedDate.startDate.minute = options.selectedTime.start.minute;
            this.selectedDate.endDate.hour = options.selectedTime.end.hour;
            this.selectedDate.endDate.minute = options.selectedTime.end.minute;
            this.update();
            if(this.showTimeSelector && !this.showDateSelector){
                this.callOnDateSelect();
            }
        }
    }
}
