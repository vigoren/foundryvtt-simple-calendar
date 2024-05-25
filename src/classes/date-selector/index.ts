import { GameSettings } from "../foundry-interfacing/game-settings";
import { GetDisplayDate, DateTheSame } from "../utilities/date-time";
import Renderer from "../renderer";
import { CalendarClickEvents, DateSelectorPositions } from "../../constants";
import Calendar from "../calendar";
import { CalManager } from "../index";

/**
 * The Date Selector class
 */
export class DateSelector {
    /**
     * The unique ID of the date selector object
     * @type {string}
     */
    id: string;
    /**
     * If to show the calendar portion of the picker
     */
    showDateSelector: boolean;
    /**
     * If to show the year for date selection
     */
    showCalendarYear: boolean = true;
    /**
     * If to show the time portion of the picker
     */
    showTimeSelector: boolean;
    /**
     * If the add time controls should be shown or not
     */
    addTime: boolean = false;
    /**
     * The string between the start and end time inputs
     */
    timeDelimiter: string = "-";
    /**
     * If the date selector allows users to select a range of dates or just a single date
     */
    allowDateRangeSelection: boolean = false;
    /**
     * If the time selectors allow users to select a range of time or just a single time stamp
     */
    allowTimeRangeSelection: boolean = true;
    /**
     * Used internally to determine if the second day of a range has been selected.
     */
    secondDaySelect: boolean = false;
    /**
     * The currently selected date
     */
    selectedDate: SimpleCalendar.DateTimeSelector.Dates;
    /**
     * A function to call when a date is selected
     */
    onDateSelect: ((selectedDates: SimpleCalendar.DateTimeSelector.SelectedDates) => void) | null = null;
    /**
     * The position of the date selector relative to the input box
     */
    position: DateSelectorPositions = DateSelectorPositions.Auto;
    /**
     * The calendar associated with this date selector
     */
    calendar: Calendar = CalManager.getActiveCalendar();
    /**
     * The HTML id used for rendering the calendar
     */
    calendarId: string;
    /**
     * The HTML id used for rendering the time selector
     */
    timeSelectorId: string;
    /**
     * If to allow the editing of the year in the calendar view
     */
    editYear: boolean = false;
    /**
     * If to use and clone calendars or the real calendars
     */
    useCloneCalendars: boolean = false;

    /**
     * Constructor for a new Date Selector
     * @param id The unique ID of the selector to add
     * @param options The options associated with setting up the new Date Selector
     */
    constructor(id: string, options: SimpleCalendar.DateTimeSelector.Options) {
        this.id = id;
        this.calendarId = `${this.id}_calendar`;
        this.timeSelectorId = `${this.id}_time_selector`;
        this.showDateSelector = true;
        this.showTimeSelector = false;
        this.selectedDate = {
            visible: {
                year: 0,
                month: 1,
                day: 1,
                hour: 0,
                minute: 0,
                seconds: 0
            },
            start: {
                year: 0,
                month: 1,
                day: 1,
                hour: 0,
                minute: 0,
                seconds: 0
            },
            end: {
                year: 0,
                month: 1,
                day: 1,
                hour: 0,
                minute: 0,
                seconds: 0
            },
            allDay: true
        };
        this.applyOptions(options);
        if (options.selectedEndDate === undefined) {
            this.selectedDate.end = {
                year: this.selectedDate.start.year,
                month: this.selectedDate.start.month,
                day: this.selectedDate.start.day,
                hour: this.selectedDate.start.hour,
                minute: this.selectedDate.start.minute,
                seconds: this.selectedDate.start.seconds
            };
        }
        if (!this.selectedDate.allDay) {
            this.addTime = true;
        }
    }

    /**
     * Applies the passed in options object to the date selector
     * @param options
     */
    applyOptions(options: SimpleCalendar.DateTimeSelector.Options) {
        if (options.calendar !== undefined) {
            this.calendar = options.calendar;
        }
        if (options.showDateSelector !== undefined) {
            this.showDateSelector = options.showDateSelector;
        }
        if (options.showTimeSelector !== undefined) {
            this.showTimeSelector = options.showTimeSelector;
        }
        if (options.showCalendarYear !== undefined) {
            this.showCalendarYear = options.showCalendarYear;
        }
        if (options.onDateSelect) {
            this.onDateSelect = options.onDateSelect;
        }
        if (options.position) {
            this.position = options.position;
        }

        if (options.allowDateRangeSelection !== undefined) {
            this.allowDateRangeSelection = options.allowDateRangeSelection;
        }
        if (options.allowTimeRangeSelection !== undefined) {
            this.allowTimeRangeSelection = options.allowTimeRangeSelection;
        }
        if (options.editYear !== undefined) {
            this.editYear = options.editYear;
        }
        if (options.timeDelimiter !== undefined) {
            this.timeDelimiter = options.timeDelimiter;
        }
        if (options.selectedStartDate !== undefined) {
            this.selectedDate.start = {
                year: options.selectedStartDate.year,
                month: options.selectedStartDate.month,
                day: options.selectedStartDate.day,
                hour: options.selectedStartDate.hour,
                minute: options.selectedStartDate.minute,
                seconds: options.selectedStartDate.seconds
            };
            this.selectedDate.visible = {
                year: this.selectedDate.start.year,
                month: this.selectedDate.start.month,
                day: this.selectedDate.start.day,
                hour: this.selectedDate.start.hour,
                minute: this.selectedDate.start.minute,
                seconds: this.selectedDate.start.seconds
            };
        }
        if (options.selectedEndDate !== undefined) {
            this.selectedDate.end = {
                year: options.selectedEndDate.year,
                month: options.selectedEndDate.month,
                day: options.selectedEndDate.day,
                hour: options.selectedEndDate.hour,
                minute: options.selectedEndDate.minute,
                seconds: options.selectedEndDate.seconds
            };
        }
        if (options.timeSelected !== undefined) {
            this.selectedDate.allDay = !options.timeSelected;
        } else {
            this.selectedDate.allDay = !this.showTimeSelector;
        }
        if (options.useCloneCalendars) {
            this.useCloneCalendars = options.useCloneCalendars;
        }
    }

    /**
     * Builds the HTML string for the Date Select input
     * @param [hideCalendar=false] If we should just be rendering the calendar HTML or the full inputs HTML
     * @param [includeWrapper=true] If to include the overall wrapping dive when building
     */
    build(hideCalendar = true, includeWrapper: boolean = true) {
        let returnHtml;
        const wrapper = `<div id="${this.id}" class="fsc-date-selector">`;
        let calendar = "";
        let timeSelectors = "";

        if (this.showDateSelector) {
            calendar = Renderer.CalendarFull.Render(this.calendar, {
                id: this.calendarId,
                allowChangeMonth: true,
                allowSelectDateRange: this.allowDateRangeSelection,
                cssClasses: "fsc-date-selector-calendar",
                colorToMatchSeason: false,
                editYear: this.editYear,
                showCurrentDate: false,
                showDayDetails: false,
                showDescriptions: false,
                showMoonPhases: false,
                showNoteCount: false,
                showSeasonName: false,
                showYear: this.showCalendarYear,
                date: {
                    month: this.selectedDate.visible.month,
                    year: this.selectedDate.visible.year,
                    day: 0
                },
                theme: "none",
                selectedDates: {
                    start: {
                        year: this.selectedDate.start.year,
                        month: this.selectedDate.start.month,
                        day: this.selectedDate.start.day
                    },
                    end: {
                        year: this.selectedDate.end.year,
                        month: this.selectedDate.end.month,
                        day: this.selectedDate.end.day
                    }
                }
            });
        }
        if (this.showTimeSelector) {
            timeSelectors = `<div class="fsc-date-selector-time-selector-wrapper">`;
            if (this.addTime) {
                timeSelectors += Renderer.TimeSelector.Render(this.calendar, {
                    id: this.timeSelectorId,
                    allowTimeRange: this.allowTimeRangeSelection,
                    disableSelfUpdate: true,
                    selectedTime: {
                        start: {
                            hour: this.selectedDate.start.hour,
                            minute: this.selectedDate.start.minute,
                            seconds: this.selectedDate.start.seconds
                        },
                        end: {
                            hour: this.selectedDate.end.hour,
                            minute: this.selectedDate.end.minute,
                            seconds: this.selectedDate.end.seconds
                        }
                    },
                    timeDelimiter: this.timeDelimiter,
                    useCalendarClones: this.useCloneCalendars
                });
                if (this.showDateSelector) {
                    timeSelectors += `<div class="fsc-remove-time"><button class="fsc-control fsc-delete"><i class="fa fa-times"></i> ${GameSettings.Localize(
                        "FSC.RemoveTime"
                    )}</button></div>`;
                }
            } else {
                timeSelectors += `<div class="fsc-add-time"><button class="fsc-control fsc-primary"><i class="fa fa-clock"></i> ${GameSettings.Localize(
                    "FSC.Notes.DateTime.AllDay"
                )}</button></div>`;
            }
            timeSelectors += `</div>`;
        }
        let selectedEndDate: SimpleCalendar.DateTime = {
            year: this.selectedDate.end.year,
            month: this.selectedDate.end.month,
            day: this.selectedDate.end.day,
            hour: this.selectedDate.end.hour,
            minute: this.selectedDate.end.minute,
            seconds: this.selectedDate.end.seconds
        };
        if (
            isNaN(selectedEndDate.year) ||
            isNaN(selectedEndDate.month) ||
            isNaN(selectedEndDate.day) ||
            isNaN(selectedEndDate.hour) ||
            isNaN(selectedEndDate.minute) ||
            isNaN(selectedEndDate.seconds)
        ) {
            selectedEndDate = {
                year: this.selectedDate.start.year,
                month: this.selectedDate.start.month,
                day: this.selectedDate.start.day,
                hour: this.selectedDate.start.hour,
                minute: this.selectedDate.start.minute,
                seconds: this.selectedDate.start.seconds
            };
        }
        const displayDate = GetDisplayDate(
            this.calendar,
            this.selectedDate.start,
            selectedEndDate,
            this.selectedDate.allDay,
            this.showTimeSelector && !this.showDateSelector,
            this.showCalendarYear,
            this.timeDelimiter
        );
        returnHtml = `<input class="fsc-display-input" value="${displayDate}" tabindex="0" type="text" readonly="readonly"><div class="fsc-date-selector-calendar-wrapper" style="display:${
            hideCalendar ? "none" : "block"
        };">${calendar}${timeSelectors}</div>`;
        if (includeWrapper) {
            returnHtml = `${wrapper}${returnHtml}</div>`;
        }
        return returnHtml;
    }

    /**
     * Sets the position class for the date selector based on the set option. If auto will attempt to fit it into the window app the date selector is in
     * @param element
     */
    setPosition(element: HTMLElement | null) {
        if (element) {
            element.classList.remove(DateSelectorPositions.LeftUp);
            element.classList.remove(DateSelectorPositions.LeftDown);
            element.classList.remove(DateSelectorPositions.RightUp);
            element.classList.remove(DateSelectorPositions.RightDown);
            let positionClass: DateSelectorPositions | string = this.position;
            if (this.position === DateSelectorPositions.Auto) {
                //Look at the element and position it, so it is the most visible
                const container = element.closest(".window-app");
                if (container) {
                    const elementBoundingRect = element.getBoundingClientRect();
                    //If inside a foundry window, adjust the bounding rects to match that of the windows not the browser.
                    const containerBoundingRect = container.getBoundingClientRect();
                    //Align to the right
                    if (elementBoundingRect.right > containerBoundingRect.right) {
                        positionClass = "right-";
                    } else {
                        positionClass = "left-";
                    }
                    if (
                        elementBoundingRect.bottom > containerBoundingRect.bottom &&
                        elementBoundingRect.top - elementBoundingRect.height > containerBoundingRect.top
                    ) {
                        positionClass += "up";
                    } else {
                        positionClass += "down";
                    }
                }
            }
            element.classList.add(positionClass);
        }
    }

    /**
     * Updates the current calendar display for showing a new month
     */
    update(hideCalendar: boolean = false) {
        const newData = this.build(hideCalendar, false);
        const ds = <HTMLElement>document.querySelector(`#${this.id}`);
        if (ds) {
            ds.innerHTML = newData;
            this.activateListeners(ds, true, true, false);
            (<HTMLElement>ds).style.display = "block";
            this.setPosition(<HTMLElement>ds.querySelector(".fsc-date-selector-calendar-wrapper"));
        }
    }

    /**
     * Adds all the click events needed to the calendars HTML for proper interaction
     * @param {HTMLElement | null} html The HTML element for the calendar
     * @param activateCalendarListeners If we should activate the calendar listeners
     * @param activateTimeListeners If we should activate the time selector listeners
     * @param activateDomListener If we should activate the document listener
     */
    activateListeners(
        html: HTMLElement | null = null,
        activateCalendarListeners: boolean = true,
        activateTimeListeners: boolean = true,
        activateDomListener: boolean = true
    ) {
        if (!html) {
            html = document.querySelector(`#${this.id}`);
        }
        if (html) {
            if (activateDomListener) {
                document.addEventListener("click", this.hideCalendar);
            }
            if (activateCalendarListeners && activateTimeListeners) {
                const di = <HTMLElement>html.querySelector(".fsc-display-input");
                if (di) {
                    di.addEventListener("click", this.toggleCalendar.bind(this, html));
                }
            }

            if (activateCalendarListeners && this.showDateSelector) {
                Renderer.CalendarFull.ActivateListeners(
                    this.calendarId,
                    this.changeMonthClick.bind(this),
                    this.dayClick.bind(this),
                    this.changeYear.bind(this)
                );
            }
            if (this.showDateSelector) {
                const cal = <HTMLElement>html.querySelector(".fsc-date-selector-calendar");
                if (cal) {
                    cal.addEventListener("click", this.calendarClick.bind(this));
                }
            }

            if (activateTimeListeners && this.showTimeSelector) {
                Renderer.TimeSelector.ActivateListeners(this.timeSelectorId, this.timeChange.bind(this));
            }
            if (this.showTimeSelector) {
                const atb = html.querySelector(".fsc-add-time button");
                if (atb) {
                    atb.addEventListener("click", this.addTimeClick.bind(this));
                }
                const cb = html.querySelector(".fsc-remove-time button");
                if (cb) {
                    cb.addEventListener("click", this.removeTimeClick.bind(this));
                }
            }
        }
    }

    deactivateListeners() {
        document.removeEventListener("click", this.hideCalendar);
    }

    /**
     * Will call the onDateSelect function set by the options, if set.
     */
    callOnDateSelect() {
        if (this.onDateSelect) {
            if (isNaN(this.selectedDate.end.year)) {
                this.selectedDate.end.year = this.selectedDate.start.year;
                this.selectedDate.end.month = this.selectedDate.start.month;
                this.selectedDate.end.day = this.selectedDate.start.day;
                this.selectedDate.end.hour = this.selectedDate.start.hour;
                this.selectedDate.end.minute = this.selectedDate.start.minute;
                this.selectedDate.end.seconds = this.selectedDate.start.seconds;
            }

            const returnValue: SimpleCalendar.DateTimeSelector.SelectedDates = {
                startDate: {
                    year: this.selectedDate.start.year,
                    month: this.selectedDate.start.month,
                    day: this.selectedDate.start.day,
                    hour: this.selectedDate.start.hour,
                    minute: this.selectedDate.start.minute
                },
                endDate: {
                    year: this.selectedDate.end.year,
                    month: this.selectedDate.end.month,
                    day: this.selectedDate.end.day,
                    hour: this.selectedDate.end.hour,
                    minute: this.selectedDate.end.minute
                },
                timeSelected: !this.selectedDate.allDay
            };
            this.onDateSelect(returnValue);
        }
    }

    /**
     * Toggles if the calendar portion of the input should be shown or not
     * @param {HTMLElement} html The HTMLElement for the calendar input wrapper
     * @param {Event} event The click event that triggered this call
     */
    toggleCalendar(html: HTMLElement, event: Event) {
        event.stopPropagation();
        const cal = <HTMLElement>html.querySelector(".fsc-date-selector-calendar-wrapper");
        if (cal) {
            if (cal.style.display === "none") {
                cal.style.display = "block";
                this.setPosition(cal);
            } else {
                cal.style.display = "none";
            }
        }
    }

    /**
     * Hides the calendar portion of the input
     * @param {HTMLElement} html The HTMLElement for the calendar
     */
    hideCalendar = () => {
        this.secondDaySelect = false;
        const html = document.getElementById(this.id);
        if (html) {
            const cal = <HTMLElement>html.querySelector(".fsc-date-selector-calendar-wrapper");
            if (cal) {
                cal.style.display = "none";
                this.callOnDateSelect();
            }
        }
    };

    /**
     * If the calendar container div is clicked
     * @param {Event} event
     */
    calendarClick(event: Event) {
        event.stopPropagation();
        Renderer.TimeSelector.HideTimeDropdown(this.timeSelectorId);

        // Hide all time dropdowns
        const wrapper = document.getElementById(this.id);
        if (wrapper) {
            const dropdowns = wrapper.getElementsByClassName("fsc-time-dropdown");
            for (let i = 0; i < dropdowns.length; i++) {
                dropdowns[i].classList.add("hide");
            }
        }
    }

    /**
     * Processes the selecting of a day on the calendar
     * @param options The renderer options returned from the click event
     */
    dayClick(options: SimpleCalendar.Renderer.CalendarOptions) {
        if (options.selectedDates) {
            let hideCalendar = true;

            if (!this.secondDaySelect) {
                this.selectedDate.start.year = options.selectedDates.start.year;
                this.selectedDate.start.month = options.selectedDates.start.month;
                this.selectedDate.start.day = options.selectedDates.start.day || 0;
                if (this.allowDateRangeSelection) {
                    this.selectedDate.end.year = options.selectedDates.end.year;
                    this.selectedDate.end.month = options.selectedDates.end.month;
                    this.selectedDate.end.day = options.selectedDates.end.day;
                } else {
                    this.selectedDate.start.year = options.selectedDates.start.year;
                    this.selectedDate.start.month = options.selectedDates.start.month;
                    this.selectedDate.start.day = options.selectedDates.start.day || 0;
                    this.selectedDate.end.year = options.selectedDates.end.year;
                    this.selectedDate.end.month = options.selectedDates.end.month;
                    this.selectedDate.end.day = options.selectedDates.end.day || 0;
                }
                this.secondDaySelect = true;
                hideCalendar = !this.allowDateRangeSelection;
            } else {
                this.selectedDate.start.year = options.selectedDates.start.year;
                this.selectedDate.start.month = options.selectedDates.start.month;
                this.selectedDate.start.day = options.selectedDates.start.day || 0;
                this.selectedDate.end.year = options.selectedDates.end.year;
                this.selectedDate.end.month = options.selectedDates.end.month;
                this.selectedDate.end.day = options.selectedDates.end.day || 0;
            }
            if (hideCalendar) {
                this.secondDaySelect = false;
                this.update(hideCalendar);
                this.callOnDateSelect();
            } else if (this.showTimeSelector) {
                Renderer.TimeSelector.HideTimeDropdown(this.timeSelectorId);
            }
        }
    }

    /**
     * Processes the callback from the Calendar Renderer's month change click
     * @param clickType
     * @param options
     */
    changeMonthClick(clickType: CalendarClickEvents, options: SimpleCalendar.Renderer.CalendarOptions) {
        if (options.date) {
            this.selectedDate.visible.year = options.date.year;
            this.selectedDate.visible.month = options.date.month;
        }
        this.update(false);
        if (this.showTimeSelector) {
            Renderer.TimeSelector.HideTimeDropdown(this.timeSelectorId);
        }
    }

    /**
     * Processes the callback from the Calendar Renderer's year change event
     * @param options
     */
    changeYear(options: SimpleCalendar.Renderer.CalendarOptions) {
        if (options.date) {
            this.selectedDate.visible.year = options.date.year;
        }
        this.update(false);
        if (this.showTimeSelector) {
            Renderer.TimeSelector.HideTimeDropdown(this.timeSelectorId);
        }
    }

    /**
     * When the add time button is clicked to add a specific time for this note
     * @param {Event} event
     */
    addTimeClick(event: Event) {
        event.stopPropagation();
        this.addTime = true;
        this.selectedDate.allDay = false;
        this.selectedDate.start.hour = 0;
        this.selectedDate.start.minute = 0;
        this.selectedDate.start.seconds = 0;
        this.selectedDate.end.hour = 0;
        this.selectedDate.end.minute = 0;
        this.selectedDate.end.seconds = 0;
        this.update();
    }

    /**
     * When the clear time button is clicked, will remove all time associated with this note
     * @param {Event} event
     */
    removeTimeClick(event: Event) {
        event.stopPropagation();
        this.addTime = false;
        this.selectedDate.allDay = true;
        this.selectedDate.start.hour = 0;
        this.selectedDate.start.minute = 0;
        this.selectedDate.start.seconds = 0;
        this.selectedDate.end.hour = 0;
        this.selectedDate.end.minute = 0;
        this.selectedDate.end.seconds = 0;
        this.update();
    }

    /**
     * Called when the time selector has benn changed
     * @param options
     */
    timeChange(options: SimpleCalendar.Renderer.TimeSelectorOptions) {
        if (options.selectedTime) {
            //If the day is the same, make sure that the end time is not before the start time
            if (DateTheSame(this.selectedDate.start, this.selectedDate.end)) {
                if (options.selectedTime.end.hour <= options.selectedTime.start.hour) {
                    options.selectedTime.end.hour = options.selectedTime.start.hour;

                    if (options.selectedTime.end.minute < options.selectedTime.start.minute) {
                        options.selectedTime.end.minute = options.selectedTime.start.minute;
                    }
                }
            }

            this.selectedDate.start.hour = options.selectedTime.start.hour;
            this.selectedDate.start.minute = options.selectedTime.start.minute;
            this.selectedDate.end.hour = options.selectedTime.end.hour;
            this.selectedDate.end.minute = options.selectedTime.end.minute;
            this.update();
            if (this.showTimeSelector && !this.showDateSelector) {
                this.callOnDateSelect();
            }
        }
    }
}
