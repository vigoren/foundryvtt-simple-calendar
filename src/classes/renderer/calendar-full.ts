import Calendar from "../calendar";
import { deepMerge } from "../utilities/object";
import { FormatDateTime, GetPresetTimeOfDay, IsDayBetweenDates } from "../utilities/date-time";
import { GetIcon } from "../utilities/visual";
import { GameSettings } from "../foundry-interfacing/game-settings";
import { CalendarClickEvents, CalendarViews, DateRangeMatch, NoteRepeat, PresetTimeOfDay } from "../../constants";
import RendererUtilities from "./utilities";
import { CalManager, MainApplication, NManager, SC } from "../index";
import { canUser } from "../utilities/permissions";

export default class CalendarFull {
    /**
     * The default options used when creating a full view calendar
     * @private
     */
    private static defaultOptions: SimpleCalendar.Renderer.CalendarOptions = {
        id: "",
        allowChangeMonth: true,
        allowSelectDateRange: false,
        colorToMatchSeason: true,
        cssClasses: "",
        editYear: false,
        showCurrentDate: true,
        showSeasonName: true,
        showNoteCount: true,
        showMoonPhases: true,
        showYear: true,
        showDescriptions: true,
        showDayDetails: true,
        theme: "auto",
        view: CalendarViews.Month
    };

    /**
     * Renders the full view for the passed in calendar
     * @param calendar
     * @param options
     */
    public static Render(calendar: Calendar, options: SimpleCalendar.Renderer.CalendarOptions = { id: "" }): string {
        options = deepMerge({}, this.defaultOptions, options);

        let HTML = "";
        if (options.view === CalendarViews.Month) {
            HTML = this.Build(calendar, options);
        } else if (options.view === CalendarViews.Year) {
            const vYear = options.date ? options.date.year : calendar.year.visibleYear;

            HTML = `<div class="fsc-year-view-wrapper" id="${options.id}"><div class="fsc-current-year">`;
            if (options.allowChangeMonth) {
                HTML += `<a class="fa fa-chevron-left" data-tooltip="${GameSettings.Localize("FSC.ChangePreviousMonth")}"></a>`;
            }
            HTML += `<span>${vYear}</span>`;
            if (options.allowChangeMonth) {
                HTML += `<a class="fa fa-chevron-right" data-tooltip="${GameSettings.Localize("FSC.ChangeNextMonth")}"></a>`;
            }
            HTML += "</div>";
            HTML += `<div  class="fsc-year-view">`;
            options.showYear = false;
            options.allowChangeMonth = false;
            const origId = options.id;
            for (let i = 0; i < calendar.months.length; i++) {
                options.date = {
                    year: vYear,
                    month: i,
                    day: 0
                };
                options.id = `${origId}-${i}`;
                HTML += this.Build(calendar, options);
            }
            HTML += "</div>";
            HTML += "</div>";
        }
        if (options.theme !== "none") {
            const theme = options.theme === "auto" ? SC.clientSettings.theme : options.theme;
            HTML = `<div class="simple-calendar ${theme}">${HTML}</div>`;
        }
        return HTML;
    }

    private static Build(calendar: Calendar, options: SimpleCalendar.Renderer.CalendarOptions): string {
        let monthYearFormat = calendar.generalSettings.dateFormat.monthYear;
        if (!options.showYear) {
            monthYearFormat = monthYearFormat.replace(/YN|YA|YZ|YY(?:YY)?/g, "");
        }

        let vYear,
            vMonthIndex = 0,
            ssYear,
            ssMonth,
            ssDay,
            seYear,
            seMonth,
            seDay,
            weeks: (boolean | SimpleCalendar.HandlebarTemplateData.Day)[][] = [],
            calendarStyle = "",
            seasonIcon = "",
            seasonName = "";
        let seasonDescription = "";
        let weekdayDescriptions: string[] = [];

        if (options.date) {
            if (options.date.month >= 0 && options.date.month < calendar.months.length) {
                vMonthIndex = options.date.month;
            }
            vYear = options.date.year;
        } else {
            vYear = calendar.year.visibleYear;
            vMonthIndex = calendar.getMonthIndex("visible");
        }
        weeks = calendar.daysIntoWeeks(vMonthIndex, vYear, calendar.weekdays.length);

        //TODO: When Changing the year the same day and month are considered selected
        if (options.selectedDates) {
            ssYear = options.selectedDates.start.year;
            seYear = options.selectedDates.end.year;
            ssMonth =
                options.selectedDates.start.month > 0 && options.selectedDates.start.month < calendar.months.length
                    ? options.selectedDates.start.month
                    : 0;
            seMonth =
                options.selectedDates.end.month > 0 && options.selectedDates.end.month < calendar.months.length ? options.selectedDates.end.month : 0;
            ssDay = options.selectedDates.start.day || 0;
            seDay = options.selectedDates.end.day || 0;
        } else {
            ssYear = seYear = calendar.year.selectedYear;
            ssMonth = seMonth = calendar.getMonthIndex("selected");
            if (ssMonth > -1) {
                ssDay = seDay = calendar.months[ssMonth].getDayIndex("selected");
            }
        }

        if (options.showSeasonName || options.colorToMatchSeason) {
            const season = calendar.getSeason(vMonthIndex, ssDay ? ssDay : 0);
            seasonName = season.name;
            seasonDescription = season.description;
            seasonIcon = GetIcon(season.icon, season.color, season.color);
            calendarStyle = `border-color: ${season.color};`;
        }

        const monthDescription = calendar.months[vMonthIndex].description;
        const showMonthClickable = monthDescription && options.showDescriptions;
        const showSeasonClickable = seasonDescription && options.showDescriptions;

        let html = `<div id="${options.id}" class="fsc-calendar-wrapper" data-calendar="${calendar.id}">`;
        //Calendar HTML
        html += `<div  class="fsc-calendar ${options.cssClasses}" style="${options.colorToMatchSeason ? calendarStyle : ""}" >`;
        //Hidden Options
        html += `<input class="fsc-render-options" type="hidden" value="${encodeURIComponent(JSON.stringify(options))}"/>`;
        //Put the header together
        html += `<div class="fsc-calendar-header">`;
        //Visible date change and current date
        html += `<div class="fsc-current-date">`;
        if (options.allowChangeMonth) {
            html += `<a class="fa fa-chevron-left" data-tooltip="${GameSettings.Localize("FSC.ChangePreviousMonth")}"></a>`;
        } else {
            html += `<span></span>`;
        }
        html += `<span class="fsc-month-year ${
            showMonthClickable ? "fsc-description-clickable" : ""
        }" data-visible="${vMonthIndex}/${vYear}">${FormatDateTime(
            { year: vYear, month: vMonthIndex, day: 0, hour: 0, minute: 0, seconds: 0 },
            monthYearFormat,
            calendar,
            { year: options.editYear }
        )}</span>`;
        if (options.allowChangeMonth) {
            html += `<a class="fa fa-chevron-right" data-tooltip="${GameSettings.Localize("FSC.ChangeNextMonth")}"></a>`;
        } else {
            html += `<span></span>`;
        }
        html += "</div>";
        //Season Name
        if (options.showSeasonName) {
            html += `<div class="fsc-season">${seasonIcon}<span class="fsc-season-name ${
                showSeasonClickable ? "fsc-description-clickable" : ""
            }">${seasonName}</span></div>`;
        }
        //Weekday Headings
        if (calendar.year.showWeekdayHeadings) {
            html += `<div class="fsc-weekdays">${calendar.weekdays
                .map((w) => {
                    return `<div class="fsc-weekday ${w.restday ? "fsc-weekend" : ""} ${
                        w.description && options.showDescriptions ? "fsc-description-clickable" : ""
                    }" data-tooltip="${w.name}">${w.abbreviation}</div>`;
                })
                .join("")}</div>`;
            weekdayDescriptions = calendar.weekdays.map((w) => {
                return w.description;
            });
        }
        //Close header div
        html += "</div>";

        //Generate day list
        html += `<div class="fsc-days">`;
        for (let i = 0; i < weeks.length; i++) {
            if (weeks[i]) {
                html += `<div class="fsc-week ${!calendar.year.showWeekdayHeadings ? "fsc-weekend-round" : ""}">`;
                for (let x = 0; x < weeks[i].length; x++) {
                    const isWeekend = calendar.weekdays[x].restday;
                    html += `<div class="fsc-day-wrapper ${isWeekend ? "fsc-weekend" : ""}">`;
                    if (weeks[i][x]) {
                        let dayClass = "fsc-day";
                        const dayIndex = calendar.months[vMonthIndex].days.findIndex((d) => {
                            return d.numericRepresentation === (<SimpleCalendar.HandlebarTemplateData.Day>weeks[i][x]).numericRepresentation;
                        });

                        //Check for selected dates to highlight
                        if (ssMonth !== undefined && ssDay !== undefined && seMonth !== undefined && seDay !== undefined) {
                            const checkDate: SimpleCalendar.DateTime = {
                                year: options.showYear ? vYear : 0,
                                month: vMonthIndex,
                                day: dayIndex,
                                hour: 0,
                                minute: 0,
                                seconds: 0
                            };
                            const inBetween = IsDayBetweenDates(
                                calendar,
                                checkDate,
                                { year: ssYear, month: ssMonth, day: ssDay, hour: 0, minute: 0, seconds: 0 },
                                { year: seYear, month: seMonth, day: seDay, hour: 0, minute: 0, seconds: 0 }
                            );
                            switch (inBetween) {
                                case DateRangeMatch.Exact:
                                    dayClass += " fsc-selected";
                                    (<SimpleCalendar.HandlebarTemplateData.Day>weeks[i][x]).selected = true;
                                    break;
                                case DateRangeMatch.Start:
                                    dayClass += " fsc-selected fsc-selected-range-start";
                                    break;
                                case DateRangeMatch.Middle:
                                    dayClass += " fsc-selected fsc-selected-range-mid";
                                    break;
                                case DateRangeMatch.End:
                                    dayClass += " fsc-selected fsc-selected-range-end";
                                    break;
                                default:
                                    break;
                            }
                        }
                        //Check for current date to highlight
                        if (
                            options.showCurrentDate &&
                            vYear === calendar.year.numericRepresentation &&
                            (<SimpleCalendar.HandlebarTemplateData.Day>weeks[i][x]).current
                        ) {
                            dayClass += " fsc-current";
                        }

                        html += `<div class="${dayClass}" data-day="${dayIndex}">`;
                        if (options.showNoteCount) {
                            html += `<div class="fsc-day-notes">${CalendarFull.NoteIndicator(calendar, vYear, vMonthIndex, dayIndex)}</div>`;
                        }
                        html += (<SimpleCalendar.HandlebarTemplateData.Day>weeks[i][x]).name;
                        if (options.showMoonPhases) {
                            html += `<div class="fsc-moons">${CalendarFull.MoonPhaseIcons(
                                calendar,
                                vYear,
                                vMonthIndex,
                                dayIndex,
                                x !== 0 && x === weeks[i].length - 1,
                                i === weeks.length - 1
                            )}</div>`;
                        }
                        html += "</div>";
                    } else {
                        html += '<div class="fsc-empty-day"></div>';
                    }
                    html += "</div>";
                }
                html += "</div>";
            }
        }
        //Close day list div
        html += "</div>";

        //Close calendar div
        html += "</div>";

        //Element Descriptions
        if (options.showDescriptions || options.showDayDetails) {
            html += `<div class="fsc-descriptions">`;
            if (options.showDescriptions) {
                if (monthDescription) {
                    html += `<div class="fsc-context-menu fsc-hide" data-type="month"><div class="fsc-description-content">${monthDescription}</div></div>`;
                }
                if (weekdayDescriptions.length) {
                    for (let i = 0; i < weekdayDescriptions.length; i++) {
                        if (weekdayDescriptions[i]) {
                            html += `<div class="fsc-context-menu fsc-hide" data-type="week${i}"><div class="fsc-description-content">${weekdayDescriptions[i]}</div></div>`;
                        }
                    }
                }
                if (seasonDescription) {
                    html += `<div class="fsc-context-menu fsc-hide" data-type="season"><div class="fsc-description-content">${seasonDescription}</div></div>`;
                }
            }
            if (options.showDayDetails) {
                const canChangeTime = canUser((<Game>game).user, SC.globalConfiguration.permissions.changeDateTime);
                const canAddNote = canUser((<Game>game).user, SC.globalConfiguration.permissions.addNotes);
                html += `<div class="fsc-context-menu fsc-hide" data-type="day"><div class="fsc-day-context-list" data-date=""><div class="fsc-context-list-title"></div>`;
                html += `<div class="fsc-context-list-expand fsc-sunrise-sunset"><span class="fa fa-sun"></span>${GameSettings.Localize(
                    "FSC.Configuration.Season.SunriseSunset"
                )}<span class="fa fa-caret-right"></span><div class="fsc-context-list-sub-menu"><div class="fsc-context-list-text"><strong>${GameSettings.Localize(
                    "FSC.Sunrise"
                )}</strong>: <span class="fsc-sunrise"></span></div><div class="fsc-context-list-text"><strong>${GameSettings.Localize(
                    "FSC.Sunset"
                )}</strong>: <span class="fsc-sunset"></span></div></div></div>`;
                if (canChangeTime || canAddNote) {
                    html += `<div class="fsc-context-list-break"></div>`;
                    if (canChangeTime) {
                        html += `<div class="fsc-context-list-action" data-action="current"><span class="fa fa-calendar-check"></span>${GameSettings.Localize(
                            "FSC.SetCurrentDate"
                        )}</div>`;
                    }
                    if (canAddNote) {
                        html += `<div class="fsc-context-list-action" data-action="note"><span class="fa fa-sticky-note"></span>${GameSettings.Localize(
                            "FSC.Notes.AddNew"
                        )}</div>`;
                    }
                }
                html += `</div></div>`;
            }
            html += `</div>`;
        }

        //Close wrapper div
        html += "</div>";
        return html;
    }

    /**
     * Activates listeners for month change and day clicks on the specified rendered calendar
     * @param calendarId The ID of the HTML element representing the calendar to activate listeners for
     * @param onMonthChange Function to call when the month is changed
     * @param onDayClick Function to call when a day is clicked
     * @param onYearChange Function to call when the year is an input, and it changes
     */
    public static ActivateListeners(
        calendarId: string,
        onMonthChange:
            | ((clickType: CalendarClickEvents.previous | CalendarClickEvents.next, options: SimpleCalendar.Renderer.CalendarOptions) => void)
            | null = null,
        onDayClick: ((options: SimpleCalendar.Renderer.CalendarOptions) => void) | null = null,
        onYearChange: ((options: SimpleCalendar.Renderer.CalendarOptions) => void) | null = null
    ) {
        const calendarElement = document.getElementById(calendarId);
        if (calendarElement) {
            const prev = <HTMLElement>calendarElement.querySelector(".fsc-calendar-header .fsc-current-date .fa-chevron-left");
            if (prev) {
                prev.addEventListener(
                    "click",
                    CalendarFull.EventListener.bind(CalendarFull, calendarId, CalendarClickEvents.previous, {
                        onMonthChange: onMonthChange,
                        onDayClick: onDayClick,
                        onYearChange: onYearChange
                    })
                );
            }
            const next = <HTMLElement>calendarElement.querySelector(".fsc-calendar-header .fsc-current-date .fa-chevron-right");
            if (next) {
                next.addEventListener(
                    "click",
                    CalendarFull.EventListener.bind(CalendarFull, calendarId, CalendarClickEvents.next, {
                        onMonthChange: onMonthChange,
                        onDayClick: onDayClick,
                        onYearChange: onYearChange
                    })
                );
            }
            const yearInput = <HTMLElement>calendarElement.querySelector(".fsc-calendar-header .fsc-current-date .fsc-month-year input[type=number]");
            if (yearInput) {
                yearInput.addEventListener("click", (e) => {
                    return e.stopPropagation();
                });
                yearInput.addEventListener(
                    "change",
                    CalendarFull.EventListener.bind(CalendarFull, calendarId, CalendarClickEvents.year, {
                        onMonthChange: onMonthChange,
                        onDayClick: onDayClick,
                        onYearChange: onYearChange
                    })
                );
            }
            calendarElement.querySelectorAll(".fsc-days .fsc-day").forEach((el) => {
                el.addEventListener(
                    "click",
                    CalendarFull.EventListener.bind(CalendarFull, calendarId, CalendarClickEvents.day, {
                        onMonthChange: onMonthChange,
                        onDayClick: onDayClick,
                        onYearChange: onYearChange
                    })
                );
                el.addEventListener("contextmenu", CalendarFull.ShowDescription.bind(CalendarFull, `day`));
            });
            calendarElement.addEventListener(
                "click",
                CalendarFull.EventListener.bind(CalendarFull, calendarId, CalendarClickEvents.calendar, {
                    onMonthChange: onMonthChange,
                    onDayClick: onDayClick,
                    onYearChange: onYearChange
                })
            );

            //Day context click
            calendarElement.querySelectorAll(".fsc-context-list-action").forEach((el) => {
                el.addEventListener("click", CalendarFull.DayContextClick);
            });

            //Description Click events
            calendarElement.querySelector(".fsc-month-year")?.addEventListener("click", CalendarFull.ShowDescription.bind(CalendarFull, "month"));
            calendarElement.querySelector(".fsc-season-name")?.addEventListener("click", CalendarFull.ShowDescription.bind(CalendarFull, "season"));
            calendarElement.querySelectorAll(".fsc-weekdays .fsc-weekday").forEach((el, index) => {
                el.addEventListener("click", CalendarFull.ShowDescription.bind(CalendarFull, `week${index}`));
            });
        }
    }

    /**
     * Updates the rendered calendars view to change to the next or previous month
     * @param calendarId The ID of the HTML element making up the calendar
     * @param clickType If true the previous button was clicked, otherwise next was clicked
     * @param funcs The functions that can be called
     * @param funcs.onMonthChange The custom function to call when the month is changed.
     * @param funcs.onDayClick The custom function to call when a day is clicked.
     * @param funcs.onYearChange Function to call when the year is an input and it changes
     * @param event The click event
     */
    public static EventListener(
        calendarId: string,
        clickType: CalendarClickEvents,
        funcs: {
            onMonthChange:
                | ((clickType: CalendarClickEvents.previous | CalendarClickEvents.next, options: SimpleCalendar.Renderer.CalendarOptions) => void)
                | null;
            onDayClick: ((options: SimpleCalendar.Renderer.CalendarOptions) => void) | null;
            onYearChange: ((options: SimpleCalendar.Renderer.CalendarOptions) => void) | null;
        },
        event: Event
    ) {
        event.stopPropagation();
        event.preventDefault();
        const calendarElement = document.getElementById(calendarId);
        if (calendarElement) {
            const calendarIndex = calendarElement.getAttribute("data-calendar") || "";
            const calendar = CalManager.getCalendar(calendarIndex);
            if (calendar) {
                let options: SimpleCalendar.Renderer.CalendarOptions = { id: "" };
                const optionsInput = calendarElement.querySelector(".fsc-render-options");
                if (optionsInput) {
                    options = JSON.parse(decodeURIComponent((<HTMLInputElement>optionsInput).value));
                }
                const currentMonthYear = <HTMLElement>calendarElement.querySelector(".fsc-month-year");
                if (currentMonthYear) {
                    const dataVis = currentMonthYear.getAttribute("data-visible");
                    if (dataVis) {
                        const my = dataVis.split("/");
                        if (my.length === 2) {
                            let monthIndex = parseInt(my[0]);
                            let yearNumber = parseInt(my[1]);
                            if (!isNaN(yearNumber) && !isNaN(monthIndex)) {
                                if (clickType === CalendarClickEvents.previous || clickType === CalendarClickEvents.next) {
                                    let loop = true;
                                    let loopCount = 0;
                                    while (loop && loopCount < calendar.months.length) {
                                        if (clickType === CalendarClickEvents.previous) {
                                            if (monthIndex === 0) {
                                                monthIndex = calendar.months.length - 1;
                                                yearNumber--;
                                            } else {
                                                monthIndex--;
                                            }
                                        } else {
                                            if (monthIndex === calendar.months.length - 1) {
                                                monthIndex = 0;
                                                yearNumber++;
                                            } else {
                                                monthIndex++;
                                            }
                                        }
                                        const isLeapYear = calendar.year.leapYearRule.isLeapYear(yearNumber);
                                        if (
                                            (isLeapYear && calendar.months[monthIndex].numberOfLeapYearDays > 0) ||
                                            (!isLeapYear && calendar.months[monthIndex].numberOfDays > 0)
                                        ) {
                                            loop = false;
                                        }
                                        loopCount++;
                                    }
                                } else if (clickType === CalendarClickEvents.day || clickType === CalendarClickEvents.dayContext) {
                                    let target = <HTMLElement>event.target;
                                    //If a child of the day div is clicked get the closest day
                                    const closestDay = target.closest(".fsc-day");
                                    if (closestDay) {
                                        target = <HTMLElement>closestDay;
                                    }
                                    const dataDate = target.getAttribute("data-day");
                                    if (dataDate) {
                                        const dayIndex = parseInt(dataDate);
                                        if (!isNaN(dayIndex)) {
                                            const start = { year: 0, month: 0, day: 0 };
                                            const end = { year: 0, month: 0, day: 0 };

                                            if (options.allowSelectDateRange) {
                                                if (!options.selectedDates || options.selectedDates.end.year !== null) {
                                                    start.year = yearNumber;
                                                    start.month = monthIndex;
                                                    start.day = dayIndex;
                                                    end.year = NaN;
                                                    end.month = NaN;
                                                    end.day = NaN;
                                                } else {
                                                    start.year = options.selectedDates.start.year;
                                                    start.month = options.selectedDates.start.month;
                                                    start.day = options.selectedDates.start.day || 0;
                                                    end.year = yearNumber;
                                                    end.month = monthIndex;
                                                    end.day = dayIndex;

                                                    // End date is less than start date
                                                    if (
                                                        (start.day > dayIndex && start.month === monthIndex && start.year === yearNumber) ||
                                                        (start.month > monthIndex && start.year === yearNumber) ||
                                                        start.year > yearNumber
                                                    ) {
                                                        end.year = options.selectedDates.start.year;
                                                        end.month = options.selectedDates.start.month;
                                                        end.day = options.selectedDates.start.day || 0;
                                                        start.year = yearNumber;
                                                        start.month = monthIndex;
                                                        start.day = dayIndex;
                                                    }
                                                }
                                            } else {
                                                start.year = yearNumber;
                                                start.month = monthIndex;
                                                start.day = dayIndex;
                                                end.year = yearNumber;
                                                end.month = monthIndex;
                                                end.day = dayIndex;
                                            }
                                            options.selectedDates = {
                                                start: start,
                                                end: end
                                            };
                                        }
                                    }
                                } else if (clickType === CalendarClickEvents.year) {
                                    const yearInput = <HTMLInputElement>currentMonthYear.querySelector("input[type=number]");
                                    if (yearInput) {
                                        const newYear = parseInt(yearInput.value);
                                        if (!isNaN(newYear)) {
                                            yearNumber = newYear;
                                        }
                                    }
                                }
                                options.date = {
                                    year: yearNumber,
                                    month: monthIndex,
                                    day: 0
                                };
                            }
                        }
                    }
                }
                const newHTML = CalendarFull.Render(calendar, options);
                const temp = document.createElement("div");
                temp.innerHTML = newHTML;
                if (temp.firstChild) {
                    calendarElement.replaceWith(temp.firstChild);
                    CalendarFull.ActivateListeners(options.id, funcs.onMonthChange, funcs.onDayClick);
                }
                if (funcs.onMonthChange !== null && (clickType === CalendarClickEvents.previous || clickType === CalendarClickEvents.next)) {
                    funcs.onMonthChange(clickType, options);
                } else if (funcs.onDayClick !== null && clickType === CalendarClickEvents.day) {
                    funcs.onDayClick(options);
                } else if (funcs.onYearChange !== null && clickType === CalendarClickEvents.year) {
                    funcs.onYearChange(options);
                }
            }
        }
        return false;
    }

    public static DayContextClick(e: Event) {
        const target = <HTMLElement>e.target;
        if (target) {
            const action = target.getAttribute("data-action");
            const date = target.closest(".fsc-day-context-list")?.getAttribute("data-date");
            if (action && date) {
                const dateParts = date.split("/");
                if (dateParts.length === 3) {
                    const year = parseInt(dateParts[0]);
                    const month = parseInt(dateParts[1]);
                    const day = parseInt(dateParts[2]);
                    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
                        if (action === "current") {
                            MainApplication.setCurrentDate(year, month, day);
                        } else if (action === "note") {
                            const calId = target.closest(".fsc-calendar-wrapper")?.getAttribute("data-calendar");
                            if (calId) {
                                const cal = CalManager.getCalendar(calId);
                                if (cal) {
                                    NManager.createNote(
                                        "New Note",
                                        "",
                                        {
                                            calendarId: calId,
                                            startDate: { year: year, month: month, day: day, hour: 0, minute: 0, seconds: 0 },
                                            endDate: { year: year, month: month, day: day, hour: 0, minute: 0, seconds: 0 },
                                            allDay: true,
                                            repeats: NoteRepeat.Never,
                                            order: 0,
                                            categories: [],
                                            remindUsers: []
                                        },
                                        cal
                                    ).catch((e) => {
                                        return console.error(e);
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * Hides all descriptions then shows the specified type
     * @param type Which description to show
     * @param e The click event
     */
    public static ShowDescription(type: string, e: Event) {
        e.preventDefault();
        e.stopPropagation();
        const target = <HTMLElement>e.target;
        if (target) {
            const calWrapper = <HTMLElement>target.closest(".fsc-calendar-wrapper");
            const descriptions = <HTMLElement>calWrapper?.querySelector(".fsc-descriptions");
            if (calWrapper && descriptions) {
                descriptions.querySelectorAll("div[data-type]").forEach((e) => {
                    return e.classList.add("fsc-hide");
                });
                const desc = descriptions.querySelector(`div[data-type="${type}"]`);
                if (desc) {
                    desc.classList.remove("fsc-hide");
                    descriptions.style.top = `${target.offsetTop + target.offsetHeight}px`;
                    descriptions.style.left = `${target.offsetLeft}px`;
                    if (type === "day") {
                        const calendarId = calWrapper.getAttribute("data-calendar");
                        const day = target.closest(".fsc-day")?.getAttribute("data-day");
                        const monthYear = target
                            .closest(".fsc-calendar")
                            ?.querySelector(".fsc-calendar-header .fsc-month-year")
                            ?.getAttribute("data-visible")
                            ?.split("/");

                        const contextList = calWrapper.querySelector(".fsc-day-context-list");
                        if (calendarId && day && monthYear && monthYear.length >= 2 && contextList) {
                            const calendar = CalManager.getCalendar(calendarId);
                            const dayIndex = parseInt(day);
                            const monthIndex = parseInt(monthYear[0]);
                            const yearIndex = parseInt(monthYear[1]);
                            if (calendar && !isNaN(dayIndex) && !isNaN(monthIndex) && !isNaN(yearIndex)) {
                                contextList.setAttribute("data-date", `${yearIndex}/${monthIndex}/${dayIndex}`);
                                const contextListTitle = contextList.querySelector(".fsc-context-list-title");
                                if (contextListTitle) {
                                    contextListTitle.textContent = FormatDateTime(
                                        { year: yearIndex, month: monthIndex, day: dayIndex, hour: 0, minute: 0, seconds: 0 },
                                        calendar.generalSettings.dateFormat.date,
                                        calendar
                                    );
                                }
                                const sunrise = contextList.querySelector(".fsc-sunrise-sunset .fsc-sunrise");
                                const sunset = contextList.querySelector(".fsc-sunrise-sunset .fsc-sunset");
                                if (sunrise && sunset) {
                                    sunrise.textContent = FormatDateTime(
                                        {
                                            year: 0,
                                            month: 0,
                                            day: 0,
                                            ...GetPresetTimeOfDay(PresetTimeOfDay.Sunrise, calendar, {
                                                year: yearIndex,
                                                month: monthIndex,
                                                day: dayIndex
                                            })
                                        },
                                        calendar.generalSettings.dateFormat.time,
                                        calendar
                                    );
                                    sunset.textContent = FormatDateTime(
                                        {
                                            year: 0,
                                            month: 0,
                                            day: 0,
                                            ...GetPresetTimeOfDay(PresetTimeOfDay.Sunset, calendar, {
                                                year: yearIndex,
                                                month: monthIndex,
                                                day: dayIndex
                                            })
                                        },
                                        calendar.generalSettings.dateFormat.time,
                                        calendar
                                    );
                                }
                            }
                        }
                    }
                }
            }
        }
        return false;
    }

    /**
     * Hide all description popups
     */
    public static HideDescription() {
        const descriptions = <HTMLElement>document.querySelector(".simple-calendar .fsc-calendar-wrapper .fsc-descriptions");
        if (descriptions) {
            descriptions.querySelectorAll("div[data-type]").forEach((e) => {
                return e.classList.add("fsc-hide");
            });
        }
    }

    /**
     * Checks if the passed in day has any notes from the passed in calendar and generates the note indicators
     * @param {Calendar} calendar The calendar to pull the data from
     * @param {number} visibleYear
     * @param {number} visibleMonthIndex
     * @param dayIndex They day to check
     */
    public static NoteIndicator(calendar: Calendar, visibleYear: number, visibleMonthIndex: number, dayIndex: number): string {
        let r = "";
        const notes = NManager.getNotesForDay(calendar.id, visibleYear, visibleMonthIndex, dayIndex);
        if (notes.length) {
            const regularNotes = notes.filter((n) => {
                return !n.userReminderRegistered;
            });
            const reminderNotes = notes.filter((n) => {
                return n.userReminderRegistered;
            });

            if (regularNotes.length) {
                const rCount = regularNotes.length < 100 ? regularNotes.length : 99;
                const rTitle = RendererUtilities.GenerateNoteIconTitle(rCount, regularNotes);
                r = `<span class="fsc-note-count" data-tooltip="${rTitle}">${rCount}</span>`;
            }
            if (reminderNotes.length) {
                const remCount = reminderNotes.length < 100 ? reminderNotes.length : 99;
                const remTitle = RendererUtilities.GenerateNoteIconTitle(remCount, reminderNotes);
                r += `<span class="fsc-note-count fsc-reminders" data-tooltip="${remTitle}">${remCount}</span>`;
            }
        }
        return r;
    }

    /**
     * Gets the icons for all moon phases for the passed in day from the passed in calendar and generates the HTML
     * @param {Calendar} calendar The calendar to pull data from
     * @param {number} visibleYear
     * @param {number} visibleMonthIndex
     * @param dayIndex The day to check
     * @param lastDayOfWeek If this day is the last day of the week
     * @param lastWeekOfMonth if this is the last week of the month
     */
    public static MoonPhaseIcons(
        calendar: Calendar,
        visibleYear: number,
        visibleMonthIndex: number,
        dayIndex: number,
        lastDayOfWeek: boolean = false,
        lastWeekOfMonth: boolean = false
    ): string {
        let html;
        const moonHtml: string[] = [];
        for (let i = 0; i < calendar.moons.length; i++) {
            const mp = calendar.moons[i].getDateMoonPhase(calendar, visibleYear, visibleMonthIndex, dayIndex);
            const d = calendar.months[visibleMonthIndex].days[dayIndex];
            if (mp && (mp.singleDay || d.selected || d.current)) {
                const moon = GetIcon(mp.icon, "#000000", calendar.moons[i].color);
                moonHtml.push(`<span class="fsc-moon-phase ${mp.icon}" data-tooltip="${calendar.moons[i].name} - ${mp.name}">${moon}</span>`);
            }
        }
        if (moonHtml.length < 3) {
            html = moonHtml.join("");
        } else {
            html = `<div class="fsc-moon-group-wrapper">${
                moonHtml[0]
            }<span class="fsc-moon-phase fa fa-caret-down"></span><div class="fsc-moon-group ${lastDayOfWeek ? "fsc-left" : "fsc-right"} ${
                lastWeekOfMonth ? "fsc-bottom" : "fsc-top"
            }">${moonHtml.join("")}</div></div>`;
        }
        return html;
    }
}
