/**
 * There are the functions that other modules, systems and macros can access and what they can do. Most of these are for advanced interfacing with Simple Calendar and not something everyone needs to worry about.
 *
 * @remarks
 * Simple Calendar exposes a variable called `SimpleCalendar`, all of these API functions exist the property api on that variable `SimpleCalendar.api`
 * @module API
 */
import { Logger } from "../logging";
import { GameSettings } from "../foundry-interfacing/game-settings";
import {
    CalendarClickEvents,
    DateSelectorPositions,
    Icons,
    LeapYearRules,
    MoonYearResetOptions,
    NoteRepeat,
    PredefinedCalendars,
    PresetTimeOfDay,
    SettingNames,
    SocketTypes,
    TimeKeeperStatus,
    YearNamingRules
} from "../../constants";
import PF2E from "../systems/pf2e";
import { AdvanceTimeToPreset, DateToTimestamp, FormatDateTime, MergeDateTimeObject, TimestampToDateData } from "../utilities/date-time";
import DateSelectorManager from "../date-selector/date-selector-manager";
import PredefinedCalendar from "../configuration/predefined-calendar";
import Renderer from "../renderer";
import { CalManager, MainApplication, MigrationApplication, NManager, SC } from "../index";
import { canUser } from "../utilities/permissions";
import GameSockets from "../foundry-interfacing/game-sockets";
import { ordinalSuffix } from "../utilities/string";
import { GetThemeList, GetThemeName } from "../utilities/visual";

/**
 * The Date selector class used to create date selector inputs based on the calendar
 */
export const DateSelector = {
    Activate: DateSelectorManager.ActivateSelector.bind(DateSelectorManager),
    Get: DateSelectorManager.GetSelector.bind(DateSelectorManager),
    Remove: DateSelectorManager.RemoveSelector.bind(DateSelectorManager)
};
/**
 * The different date selector positions available
 */
export { DateSelectorPositions };
/**
 * The predefined calendars packaged with the calendar
 */
export { PredefinedCalendars as Calendars };
/**
 * The leap year rules
 */
export { LeapYearRules };
/**
 * The Moon Icons
 */
export { Icons };
/**
 * The moon year reset options
 */
export { MoonYearResetOptions };
/**
 * The year naming rules
 */
export { YearNamingRules };
/**
 * The sun positions
 */
export { PresetTimeOfDay };
/**
 * The options for note repeating
 */
export { NoteRepeat };

/**
 * This function is used to activate event listeners for calendars displayed with the [sc-full-calendar](#sc-full-calendar) Handlebar helper.
 *
 * If being used in a FoundryVTT application or FormApplication it is best called in the activateListeners function.
 * @param calendarId The ID of the HTML element of the calendar to activate listeners for. This is the same ID used in the [sc-full-calendar](#sc-full-calendar) Handlebar helper.
 * @param onMonthChange Optional function to be called when the month being viewed has changed. Returned parameters to the function are:<br/> - The direction moved, previous or next.<br/> - The options used to render the calendar, which includes the date being shown.
 * @param onDayClick Optional function to be called when a day is clicked. Returned parameters to the function are:<br/>- The options used to render the calendar, which includes the selected date.
 *
 * @example
 * ```javascript
 * SimpleCalendar.api.activateFullCalendarListeners('example_1');
 * ```
 */
export function activateFullCalendarListeners(
    calendarId: string,
    onMonthChange:
        | ((clickType: CalendarClickEvents.previous | CalendarClickEvents.next, options: SimpleCalendar.Renderer.CalendarOptions) => void)
        | null = null,
    onDayClick: ((options: SimpleCalendar.Renderer.CalendarOptions) => void) | null = null
): void {
    Renderer.CalendarFull.ActivateListeners(calendarId, onMonthChange, onDayClick);
}

/**
 * This function adds a new note to the calendar
 *
 * @param title The title of the new note
 * @param content The contents of the new note
 * @param startDate The date and time the note starts, if any date or time properties are missing the current date/time values will be used.
 * @param endDate The date and time the note ends (can be the same as the start date), if any date or time properties are missing the current date/time values will be used.
 * @param allDay If the note lasts all day or if it has a specific time duration. Whether to ignore the time portion of the start and end dates.
 * @param repeats If the note repeats and how often it does
 * @param categories A list of note categories to assign to this note
 * @param macro The ID of the macro that this note should execute when the in game time meets or exceeds the note time. Or null if no macro should be executed.
 * @param calendarId Optional parameter to specify the ID of the calendar to add the note too. If not provided the current active calendar will be used.
 * @param userVisibility Optional parameter to specify an array of user ID's who will have permission to view the note. The creator of the note will always have permission. Use ['default'] if you want all users to be able to view it.
 * @param remindUsers Optional parameter to provide an array of user ID's who will be reminded of the note.
 *
 * @returns The newly created JournalEntry that contains the note data, or null if there was an error encountered.
 *
 * @example
 * ```javascript
 * const newJournal = await SimpleCalendar.api.addNote('Christmas Day','Presents!', {year: 2022, month: 11, day: 24, hour: 0, minute: 0, seconds: 0}, {year: 2022, month: 11, day: 24, hour: 0, minute: 0, seconds: 0}, true, SimpleCalendar.api.NoteRepeat.Yearly, ['Holiday']);
 * // Will create a new note on Christmas day of 2022 that lasts all day and repeats yearly.
 * ```
 */
export async function addNote(
    title: string,
    content: string,
    startDate: SimpleCalendar.DateTimeParts,
    endDate: SimpleCalendar.DateTimeParts,
    allDay: boolean,
    repeats: NoteRepeat = NoteRepeat.Never,
    categories: string[] = [],
    calendarId: string = "active",
    macro: string | null = null,
    userVisibility: string[] = [],
    remindUsers: string[] = []
): Promise<StoredDocument<JournalEntry> | null> {
    const activeCalendar = calendarId === "active" ? CalManager.getActiveCalendar() : CalManager.getCalendar(calendarId);
    if (activeCalendar) {
        const je = await NManager.createNote(
            title,
            content,
            {
                calendarId: activeCalendar.id,
                startDate: MergeDateTimeObject(startDate, null, activeCalendar),
                endDate: MergeDateTimeObject(endDate, null, activeCalendar),
                allDay: allDay,
                order: 0,
                categories: categories,
                repeats: repeats,
                remindUsers: Array.isArray(remindUsers) ? remindUsers : [],
                macro: macro ? macro : "none"
            },
            activeCalendar,
            false
        );

        if (je && Array.isArray(userVisibility) && userVisibility.length) {
            const perms: Partial<Record<string, 0 | 1 | 2 | 3>> = {};
            if (userVisibility.indexOf("default") > -1) {
                (<Game>game).users?.forEach((u) => {
                    return (perms[u.id] = (<Game>game).user?.id === u.id ? 3 : 2);
                });
                perms["default"] = 2;
            } else {
                userVisibility.forEach((o) => {
                    return (perms[o] = (<Game>game).user?.id === o ? 3 : 2);
                });
            }
            await je.update({ ownership: perms }, { render: false, renderSheet: false });
        }
        return je;
    }
    return null;
}

/**
 * Add a custom button to the right side of the calendar (When in full view). The button will be added below the Note Search button.
 *
 * @param buttonTitle The text that appears when the button is hovered over.
 * @param iconClass The Font Awesome Free icon class to use for the buttons display.
 * @param customClass A custom CSS class to add to the button.
 * @param showSidePanel If the button should open a side panel or not. A side panel functions like the notes list but will be completely empty.
 * @param onRender Function that is called to show information to users, see below for more details.

 * If the showSidePanel parameter is true this function will be passed an HTMLElement representing the side panel.
 * The element could potentially be null so code should account for that.
 * This function is then responsible for populating the side panel with any information.
 * This function is called everytime the calendar is rendered.
 *
 * If the showSidePanel parameter is false this function will be passed an Event for the click.
 * The event could potentially be null so code should account for that.
 * This function should then open up an application or dialog or perform an action for the user.
 * This function is called everytime the button is clicked.
 *
 * @example
 * ```javascript
 * // Function to call to populate the side panel
 * function populateSidePanel(event, element){
 *     if(element){
 *            const header = document.createElement('h2');
 *            header.innerText = "My Custom Button";
 *            element.append(header);
 *        }
 * }
 *
 * // Function to call when the button is clicked
 * function sidePanelButtonClick(event, element){
 *     if(event){
 *          const dialog = new Dialog({
 *             title: "My Module",
 *             content: "You clicked the button!",
 *             buttons:{
 *                 awesome: {
 *                     icon: '<i class="fa-solid fa-face-smile"></i>',
 *                     label: "Awesome!"
 *                 }
 *             },
 *             default: "awesome"
 *         });
 *         dialog.render(true);
 *     }
 * }
 *
 *
 * // Adding a button that should show a side panel
 * // Clicking the button will show a side panel that will have the title "My Custom Button"
 * SimpleCalendar.api.addSidebarButton("My Module", "fa-computer-mouse", "my-custom-class", true, populateSidePanel);
 *
 * // Adding a button that will show a dialog when clicked
 * SimpleCalendar.api.addSidebarButton("My Module", "fa-computer-mouse", "my-custom-class", false, sidePanelButtonClick);
 *
 * ```
 */
export function addSidebarButton(
    buttonTitle: string,
    iconClass: string,
    customClass: string,
    showSidePanel: boolean,
    onRender: (event: Event | null, renderTarget: HTMLElement | null | undefined) => void
) {
    MainApplication.addonButtons.push({
        title: buttonTitle,
        iconClass: iconClass,
        customClass: customClass,
        showSidePanel: showSidePanel,
        onRender: onRender
    });
    MainApplication.updateApp();
}

/**
 * Advance the date and time to match the next preset time.
 *
 * **Important**: This function can only be run by users who have permission to change the date in Simple Calendar.
 * @param preset The preset time that is used to set the time of day.
 * @param calendarId Optional parameter to specify the ID of the calendar to advance the time and date for. If not provided the current active calendar will be used.
 *
 * @returns True if the date was set successfully, false if it was not.
 *
 * @example
 * ```javascript
 * //Assuming the current time is 11am, set the time to the next sunset
 * //Will result in the date staying the same but the time changing to 6pm
 * SimpleCalendar.api.advanceTimeToPreset(SimpleCalendar.api.PresetTimeOfDay.Sunset);
 *
 * //Assuming the current time is 11am, set the time to the next sunrise
 * //Will result in the date advancing by 1 day and the time changing to 6am
 * SimpleCalendar.api.advanceTimeToPreset(SimpleCalendar.api.PresetTimeOfDay.Sunrise);
 * ```
 */
export function advanceTimeToPreset(preset: PresetTimeOfDay, calendarId: string = "active"): boolean {
    const activeCalendar = calendarId === "active" ? CalManager.getActiveCalendar() : CalManager.getCalendar(calendarId);
    if (activeCalendar) {
        if (canUser((<Game>game).user, SC.globalConfiguration.permissions.changeDateTime)) {
            AdvanceTimeToPreset(preset, activeCalendar).catch(Logger.error);
            return true;
        }
    } else {
        Logger.error(`SimpleCalendar.api.advanceTimeToPreset - Unable to find a calendar with the passed in ID of "${calendarId}"`);
    }
    return false;
}

/**
 * Changes the current date of Simple Calendar.
 * **Important**: This function can only be run by users who have permission to change the date in Simple Calendar.
 * @param interval The interval objects properties are all optional so only those that are needed have to be set.<br/>Where each property is how many of that interval to change the current date by.
 * @param calendarId Optional parameter to specify the ID of the calendar to change the date on. If not provided the current active calendar will be used.
 *
 * @returns True if the date change was successful and false if it was not.
 *
 * @example
 * ```javascript
 * //Assuming a date of June 1, 2021 and user has permission to change the date
 * SimpleCalendar.api.changeDate({day: 1}); // Will set the new date to June 2, 2021
 *
 * //Assuming a date of June 1, 2021 and user has permission to change the date
 * SimpleCalendar.api.changeDate({day: -1}); // Will set the new date to May 31, 2021
 *
 * //Assuming a date of June 1, 2021 10:00:00 and user has permission to change the date
 * SimpleCalendar.api.changeDate({year: 1, month: 1, day: 1, hour: 1, minute: 1, seconds: 1}); // Will set the new date to July 2, 2022 11:01:01
 *
 * //Assuming a date of June 1, 2021 10:00:00 and user has permission to change the date
 * SimpleCalendar.api.changeDate({seconds: 3600}); // Will set the new date to June 1, 2021 11:00:00
 * ```
 */
export function changeDate(interval: SimpleCalendar.DateTimeParts, calendarId: string = "active"): boolean {
    const activeCalendar = calendarId === "active" ? CalManager.getActiveCalendar() : CalManager.getCalendar(calendarId);
    if (activeCalendar) {
        return activeCalendar.changeDateTime(interval, { updateMonth: false, showWarning: true });
    } else {
        Logger.error(`SimpleCalendar.api.changeDate - Unable to find a calendar with the passed in ID of "${calendarId}"`);
    }
    return false;
}

/**
 * Will choose a random date between the 2 passed in dates, or if no dates are passed in will choose a random date.
 * @param startingDate The start date objects properties are all optional so only those needed have to be set.<br/>Where each property is the earliest date to be chosen when randomly selecting a date.<br/>The month and day properties are both index's so January would be 0 and the first day of the month is also 0.
 * @param endingDate The end date objects properties are all optional so only those needed have to be set.<br/>Where each property is the latest date to be chosen when randomly selecting a date.<br/>The month and day properties are both index's so January would be 0 and the first day of the month is also 0.
 * @param calendarId Optional parameter to specify the ID of the calendar to choose the random date from. If not provided the current active calendar will be used.
 *
 * @returns A full date and time, where all properties will be randomly set. The month and day properties will be the index of the month/day chosen.
 *
 * @example
 * ```javascript
 * SimpleCalendar.api.chooseRandomDate({year: 2021, month: 3, day: 0}, {year: 2021, month: 5, day: 1})
 *
 * // {
 * //     day: 1
 * //     hour: 12
 * //     minute: 5
 * //     month: 4
 * //     seconds: 41
 * //     year: 2021
 * // }
 *
 SimpleCalendar.api.chooseRandomDate({year: 1900, month: 3}, {year: 2021, month: 5})
 * // {
 * //     day: 19
 * //     hour: 8
 * //     minute: 16
 * //     month: 3
 * //     seconds: 25
 * //     year: 1982
 * // }
 *
 * SimpleCalendar.api.chooseRandomDate();
 * // {
 * //     day: 11
 * //     hour: 0
 * //     minute: 49
 * //     month: 8
 * //     seconds: 37
 * //     year: 3276
 * // }
 * ```
 */
export function chooseRandomDate(
    startingDate: SimpleCalendar.DateTimeParts = {},
    endingDate: SimpleCalendar.DateTimeParts = {},
    calendarId: string = "active"
): SimpleCalendar.DateTime {
    const activeCalendar = calendarId === "active" ? CalManager.getActiveCalendar() : CalManager.getCalendar(calendarId);
    let year = 0,
        month = 0,
        day = 0,
        hour = 0,
        minute = 0,
        second = 0;

    if (activeCalendar) {
        /**
         * Choose a random year
         *      If the starting and ending year are the same, use that year
         *      If they are different random choose a year between them (they are included)
         *      If no years are provided, random choose a year between 0 and 10,000
         */
        if (startingDate.year !== undefined && endingDate.year !== undefined) {
            if (startingDate.year === endingDate.year) {
                year = startingDate.year;
            } else {
                year = Math.floor(Math.random() * (endingDate.year - startingDate.year + 1)) + startingDate.year;
            }
        } else {
            year = Math.floor(Math.random() * 10000);
        }

        /**
         * Choose a random month
         *      If the starting and ending month are the same use that month
         *      If they are different randomly choose a month between them (they are included)
         *      If no months are provided randomly choose a month between 0 and the number of months in a year
         */
        if (startingDate.month !== undefined && endingDate.month !== undefined) {
            if (startingDate.month === endingDate.month) {
                month = startingDate.month;
            } else {
                month = Math.floor(Math.random() * (endingDate.month - startingDate.month + 1)) + startingDate.month;
            }
        } else {
            month = Math.floor(Math.random() * activeCalendar.months.length);
        }

        if (month < 0 || month >= activeCalendar.months.length) {
            month = activeCalendar.months.length - 1;
        }

        const monthObject = activeCalendar.months[month];
        /**
         * Chose a random day
         *      If the starting and ending day are the same use that day
         *      If they are different randomly choose a day between them (they are included)
         *      If no days are provided randomly choose a day between 0 and the number of days in the month selected above
         */
        if (startingDate.day !== undefined && endingDate.day !== undefined) {
            if (startingDate.day === endingDate.day) {
                day = startingDate.day;
            } else {
                day = Math.floor(Math.random() * (endingDate.day - startingDate.day + 1)) + startingDate.day;
            }
        } else {
            day = Math.floor(Math.random() * monthObject.days.length);
        }

        if (day < 0 || day >= monthObject.days.length) {
            day = monthObject.days.length - 1;
        }

        if (startingDate.hour !== undefined && endingDate.hour !== undefined) {
            if (startingDate.hour === endingDate.hour) {
                hour = startingDate.hour;
            } else {
                hour = Math.floor(Math.random() * (endingDate.hour - startingDate.hour + 1)) + startingDate.hour;
            }
        } else {
            hour = Math.floor(Math.random() * activeCalendar.time.hoursInDay);
        }

        if (startingDate.minute !== undefined && endingDate.minute !== undefined) {
            if (startingDate.minute === endingDate.minute) {
                minute = startingDate.minute;
            } else {
                minute = Math.floor(Math.random() * (endingDate.minute - startingDate.minute + 1)) + startingDate.minute;
            }
        } else {
            minute = Math.floor(Math.random() * activeCalendar.time.minutesInHour);
        }

        if (startingDate.seconds !== undefined && endingDate.seconds !== undefined) {
            if (startingDate.seconds === endingDate.seconds) {
                second = startingDate.seconds;
            } else {
                second = Math.floor(Math.random() * (endingDate.seconds - startingDate.seconds + 1)) + startingDate.seconds;
            }
        } else {
            second = Math.floor(Math.random() * activeCalendar.time.secondsInMinute);
        }
    } else {
        Logger.error(`SimpleCalendar.api.chooseRandomDate - Unable to find a calendar with the passed in ID of "${calendarId}"`);
    }

    return {
        year: year,
        month: month,
        day: day,
        hour: hour,
        minute: minute,
        seconds: second
    };
}

/**
 * Get the current status of the built-in clock for the specified calendar in Simple Calendar
 * @param calendarId Optional parameter to specify the ID of the calendar to check its clock status. If not provided the current active calendar will be used.
 *
 * @returns The clock status for the specified calendar.
 *
 * @example
 * ```javascript
 * const status = SimpleCalendar.api.clockStatus();
 * console.log(status); // {started: false, stopped: true, paused: false}
 * ```
 */
export function clockStatus(calendarId: string = "active"): SimpleCalendar.ClockStatus {
    const cal = calendarId === "active" ? CalManager.getActiveCalendar() : CalManager.getCalendar(calendarId);
    if (cal) {
        const status = cal.timeKeeper.getStatus();
        return {
            started: status === TimeKeeperStatus.Started,
            stopped: status === TimeKeeperStatus.Stopped,
            paused: status === TimeKeeperStatus.Paused
        };
    } else {
        Logger.error(`SimpleCalendar.api.clockStatus - Unable to find a calendar with the passed in ID of "${calendarId}"`);
        return {
            started: false,
            stopped: false,
            paused: false
        };
    }
}

/**
 * Sets up the current calendar to match the passed in configuration. This function can only be run by GMs.
 * @param calendarData The configuration to set the calendar to. It can be one of the predefined calendars or a {@link SimpleCalendar.CalendarData} object representing a custom calendar.
 * @param calendarId Optional parameter to specify the ID of the calendar to configure. If not provided the current active calendar will be used.
 *
 * @returns A promise that resolves to a boolean value, true if the change was successful and false if it was not.
 *
 * @example
 * ```javascript
 *
 * //Set the calendar configuration to the Gregorian calendar
 * const result = await SimpleCalendar.api.configureCalendar(SimpleCalendar.api.Calendars.Gregorian);
 *
 * //Set the calendar configuration to a custom calendar
 * const custom = {};
 *
 * const result = await SimpleCalendar.api.configureCalendar(custom);
 * ```
 */
export async function configureCalendar(
    calendarData: PredefinedCalendars | SimpleCalendar.CalendarData,
    calendarId: string = "active"
): Promise<boolean> {
    let res = false;
    if (GameSettings.IsGm()) {
        const activeCalendar = calendarId === "active" ? CalManager.getActiveCalendar() : CalManager.getCalendar(calendarId);
        if (activeCalendar) {
            if (typeof calendarData === "string") {
                res = await PredefinedCalendar.setToPredefined(activeCalendar, <PredefinedCalendars>calendarData);
            } else if (Object.keys(calendarData).length) {
                activeCalendar.loadFromSettings(calendarData);
                res = true;
            }
            CalManager.saveCalendars().catch(Logger.error);
        } else {
            Logger.error(`SimpleCalendar.api.configureCalendar - Unable to find a calendar with the passed in ID of "${calendarId}"`);
        }
    }
    return res;
}

/**
 * Gets the current date and time for the current calendar or the passed in calendar.
 * @param calendarId Optional parameter to specify the ID of the calendar to get the current day from. If not provided the current active calendar will be used.
 *
 * @returns The current date and time. The month and day are index's and as such start at 0 instead of 1. If the passed in calendar can't be found null will be returned.
 *
 * @example
 * ```javascript
 * // Assuming a Gregorian calendar
 * SimpleCalendar.api.currentDateTime();
 * //Returns a DateTime object like this
 * // {
 * //     year: 2021,
 * //     month: 11,
 * //     day: 24,
 * //     hour: 12,
 * //     minute: 13,
 * //     seconds: 14
 * // }
 * ```
 */
export function currentDateTime(calendarId: string = "active"): SimpleCalendar.DateTime | null {
    const cal = calendarId === "active" ? CalManager.getActiveCalendar() : CalManager.getCalendar(calendarId);
    if (cal) {
        const monthDayIndex = cal.getMonthAndDayIndex();
        const time = cal.time.getCurrentTime();
        return {
            year: cal.year.numericRepresentation,
            month: monthDayIndex.month || 0,
            day: monthDayIndex.day || 0,
            hour: time.hour,
            minute: time.minute,
            seconds: time.seconds
        };
    }
    return null;
}

/**
 * Gets the formatted display data for the current date and time of the active calendar, or the calendar with the passed in ID.
 * @param calendarId Optional parameter to specify the ID of the calendar to get the current day from. If not provided the current active calendar will be used.
 *
 * @returns All the formatted display strings for the current date and time. Or if the passed in calendar can't be found, null.
 *
 * @example
 * ```javascript
 * // Assuming a Gregorian calendar
 * SimpleCalendar.api.currentDateTimeDisplay();
 * //Returns a DateTime object like this
 * // {
 * //     date: "June 01, 2021",
 * //     day: "1",
 * //     daySuffix: "st",
 * //     month: "6",
 * //     monthName: "June",
 * //     time: "00:00:00",
 * //     weekday: "Tuesday",
 * //     year: "2021",
 * //     yearName: "",
 * //     yearPostfix: "",
 * //     yearPrefix: ""
 * // }
 * ```
 */
export function currentDateTimeDisplay(calendarId: string = "active"): SimpleCalendar.DateDisplayData | null {
    const cal = calendarId === "active" ? CalManager.getActiveCalendar() : CalManager.getCalendar(calendarId);
    if (cal) {
        const monthDayIndex = cal.getMonthAndDayIndex();
        const month = cal.months[monthDayIndex.month || 0];
        const day = month.days[monthDayIndex.day || 0];
        const dayOfTheWeek = cal.dayOfTheWeek(cal.year.numericRepresentation, monthDayIndex.month || 0, monthDayIndex.day || 0);
        const time = cal.time.getCurrentTime();

        return {
            date: FormatDateTime(
                {
                    year: cal.year.numericRepresentation,
                    month: monthDayIndex.month || 0,
                    day: monthDayIndex.day || 0,
                    hour: time.hour,
                    minute: time.minute,
                    seconds: time.seconds
                },
                cal.generalSettings.dateFormat.date,
                cal
            ),
            day: day.numericRepresentation.toString(),
            daySuffix: ordinalSuffix(day.numericRepresentation),
            weekday: cal.weekdays.length > dayOfTheWeek ? cal.weekdays[dayOfTheWeek].name : "",
            monthName: month.name,
            month: month.numericRepresentation.toString(),
            year: cal.year.numericRepresentation.toString(),
            yearName: cal.year.getYearName(cal.year.numericRepresentation),
            yearPrefix: cal.year.prefix,
            yearPostfix: cal.year.postfix,
            time: FormatDateTime(
                {
                    year: cal.year.numericRepresentation,
                    month: monthDayIndex.month || 0,
                    day: monthDayIndex.day || 0,
                    hour: time.hour,
                    minute: time.minute,
                    seconds: time.seconds
                },
                cal.generalSettings.dateFormat.time,
                cal
            )
        };
    }
    return null;
}

/**
 * Converts the passed in date to a timestamp.
 * @param date A date object (eg `{year:2021, month: 4, day: 12, hour: 0, minute: 0, seconds: 0}`) with the parameters set to the date that should be converted to a timestamp. Any missing parameters will default to the current date value for that parameter.<br>**Important**: The month and day are index based so January would be 0 and the first day of the month will also be 0.
 * @param calendarId Optional parameter to specify the ID of the calendar to use when converting a date to a timestamp. If not provided the current active calendar will be used.
 *
 * @returns The timestamp for that date.
 *
 * @example
 * ```javascript
 * SimpleCalendar.api.dateToTimestamp({}); //Returns the timestamp for the current date
 *
 * SimpleCalendar.api.dateToTimestamp({year: 2021, month: 0, day: 0, hour: 1, minute: 1, seconds: 0}); //Returns 1609462860
 * ```
 */
export function dateToTimestamp(date: SimpleCalendar.DateTimeParts, calendarId: string = "active"): number {
    const cal = calendarId === "active" ? CalManager.getActiveCalendar() : CalManager.getCalendar(calendarId);
    if (cal) {
        return DateToTimestamp(date, cal);
    } else {
        Logger.error(`SimpleCalendar.api.dateToTimestamp - Unable to find a calendar with the passed in ID of "${calendarId}"`);
        return 0;
    }
}

/**
 * Converts the passed in date/time into formatted date and time strings that match the configured date and time formats or the passed in format string.
 *
 * - Any missing date/time parameters will default to a value of 0.
 * - If the date/time parameters are negative, their value will be set to 0. The exception to this is the year parameter, it can be negative.
 * - If the date/time parameters are set to a value greater than possible (eg. the 20th month in a calendar that only has 12 months, or the 34th hour when a day can only have 24 hours) the max value will be used.
 *
 * @param date A date object (eg `{year:2021, month: 4, day: 12, hour: 0, minute: 0, seconds: 0}`) with the parameters set to the date and time that should be formatted.<br>**Important**: The month and day are index based so January would be 0 and the first day of the month will also be 0.
 * @param format Optional format string to return custom formats for the passed in date and time.
 * @param calendarId Optional parameter to specify the ID of the calendar to use when converting a date to a formatted string. If not provided the current active calendar will be used.
 *
 * @returns If no format string is provided an object with the date and time formatted strings, as set in the configuration, will be returned. If a format is provided then a formatted string will be returned.
 *
 * @examples
 * ```javascript
 * // Assuming that the default date and time formats are in place
 * // Date: Full Month Name Day, Year
 * // Time: 24Hour:Minute:Second
 *
 * SimpleCalendar.api.formatDateTime({year: 2021, month: 11, day: 24, hour: 12, minute: 13, seconds: 14});
 * // Returns {date: 'December 25, 2021', time: '12:13:14'}
 *
 * SimpleCalendar.api.formatDateTime({year: -2021, month: -11, day: 24, hour: 12, minute: 13, seconds: 14})
 * // Returns {date: 'January 25, -2021', time: '12:13:14'}
 *
 * SimpleCalendar.api.formatDateTime({year: 2021, month: 111, day: 224, hour: 44, minute: 313, seconds: 314})
 * // Returns {date: 'December 31, 2021', time: '23:59:59'}
 *
 * SimpleCalendar.api.formatDateTime({year: 2021, month: 111, day: 224, hour: 44, minute: 313, seconds: 314},"DD/MM/YYYY HH:mm:ss A")
 * // Returns '31/12/2021 23:59:59 PM'
 * ```
 */
export function formatDateTime(
    date: SimpleCalendar.DateTimeParts,
    format: string = "",
    calendarId: string = "active"
): string | { date: string; time: string } {
    const activeCalendar = calendarId === "active" ? CalManager.getActiveCalendar() : CalManager.getCalendar(calendarId);
    if (activeCalendar) {
        const year = date.year ? date.year : 0;
        let monthIndex = date.month && date.month >= 0 ? date.month : 0;
        if (monthIndex >= activeCalendar.months.length) {
            monthIndex = activeCalendar.months.length - 1;
        }
        const month = activeCalendar.months[monthIndex];
        let dayIndex = date.day && date.day >= 0 ? date.day : 0;
        if (dayIndex >= month.days.length) {
            dayIndex = month.days.length - 1;
        }
        let hour = date.hour && date.hour >= 0 ? date.hour : 0;
        if (hour >= activeCalendar.time.hoursInDay) {
            hour = activeCalendar.time.hoursInDay - 1;
        }
        let minute = date.minute && date.minute >= 0 ? date.minute : 0;
        if (minute >= activeCalendar.time.minutesInHour) {
            minute = activeCalendar.time.minutesInHour - 1;
        }
        let second = date.seconds && date.seconds >= 0 ? date.seconds : 0;
        if (second >= activeCalendar.time.secondsInMinute) {
            second = activeCalendar.time.secondsInMinute - 1;
        }
        if (format) {
            return FormatDateTime(
                { year: year, month: monthIndex, day: dayIndex, hour: hour, minute: minute, seconds: second },
                format,
                activeCalendar
            );
        } else {
            return {
                date: FormatDateTime(
                    { year: year, month: monthIndex, day: dayIndex, hour: 0, minute: 0, seconds: 0 },
                    activeCalendar.generalSettings.dateFormat.date,
                    activeCalendar
                ),
                time: FormatDateTime(
                    { year: 0, month: 0, day: 0, hour: hour, minute: minute, seconds: second },
                    activeCalendar.generalSettings.dateFormat.time,
                    activeCalendar
                )
            };
        }
    } else {
        Logger.error(`SimpleCalendar.api.formatDateTime - Unable to find a calendar with the passed in ID of "${calendarId}"`);
        return "";
    }
}

/**
 * Converts the passed in timestamp into formatted date and time strings that match the configured date and time formats or the passed in format string.
 *
 * @param timestamp The timestamp (in seconds) of the date to format.
 * @param format Optional format string to return custom formats for the passed in date and time.
 * @param calendarId Optional parameter to specify the ID of the calendar to use when converting a date to a formatted string. If not provided the current active calendar will be used.
 *
 * @returns If no format string is provided an object with the date and time formatted strings, as set in the configuration, will be returned. If a format is provided then a formatted string will be returned.
 *
 * @examples
 * ```javascript
 * // Assuming that the default date and time formats are in place
 * // Date: Full Month Name Day, Year
 * // Time: 24Hour:Minute:Second
 *
 * SimpleCalendar.api.formatTimestamp(1640434394);
 * // Returns {date: 'December 25, 2021', time: '12:13:14'}
 *
 * SimpleCalendar.api.formatTimestamp(1640434394,"DD/MM/YYYY HH:mm:ss A");
 * // Returns '25/12/2021 12:13:14 PM'
 * ```
 */
export function formatTimestamp(timestamp: number, format: string = "", calendarId: string = "active"): string | { date: string; time: string } {
    const activeCalendar = calendarId === "active" ? CalManager.getActiveCalendar() : CalManager.getCalendar(calendarId);
    if (activeCalendar) {
        // If this is a Pathfinder 2E game, add the world creation seconds
        if (PF2E.isPF2E && activeCalendar.generalSettings.pf2eSync) {
            timestamp += PF2E.getWorldCreateSeconds(activeCalendar);
        }
        const date = activeCalendar.secondsToDate(timestamp);
        if (format) {
            return FormatDateTime(date, format, activeCalendar);
        } else {
            return {
                date: FormatDateTime(date, activeCalendar.generalSettings.dateFormat.date, activeCalendar),
                time: FormatDateTime(date, activeCalendar.generalSettings.dateFormat.time, activeCalendar)
            };
        }
    } else {
        Logger.error(`SimpleCalendar.api.formatTimestamp - Unable to find a calendar with the passed in ID of "${calendarId}"`);
        return "";
    }
}

/**
 * Gets the details of all calendars that have been configured in Simple Calendar
 *
 * @returns Array of all calendars and their data.
 *
 * @example
 * ```javascript
 * const c = SimpleCalendar.api.getAllCalendars();
 * console.log(c); // Will contain a list of all calendars and their data
 * ```
 */
export function getAllCalendars(): SimpleCalendar.CalendarData[] {
    const calendars = CalManager.getAllCalendars();
    const data: SimpleCalendar.CalendarData[] = [];
    for (let i = 0; i < calendars.length; i++) {
        data.push(calendars[i].toConfig());
    }
    return data;
}

/**
 * Gets the details for all the months of the specified calendar.
 *
 * @param calendarId Optional parameter to specify the ID of the calendar to get the list of months from. If not provided the current active calendar will be used.
 *
 * @returns Array of all months in the calendar.
 *
 * @example
 * ```javascript
 * SimpleCalendar.api.getAllMonths();
 * // Returns an array like this, assuming the Gregorian Calendar
 * // [
 * //     {
 * //         "id": "13390ed",
 * //         "name": "January",
 * //         "description" : "",
 * //         "abbreviation": "Jan",
 * //         "numericRepresentation": 1,
 * //         "numericRepresentationOffset": 0,
 * //         "numberOfDays": 31,
 * //         "numberOfLeapYearDays": 31,
 * //         "intercalary": false,
 * //         "intercalaryInclude": false,
 * //         "startingWeekday": null
 * //     },
 * //     {
 * //         "id": "effafeee",
 * //         "name": "February",
 * //         "description" : "",
 * //         "abbreviation": "Feb",
 * //         "numericRepresentation": 2,
 * //         "numericRepresentationOffset": 0,
 * //         "numberOfDays": 28,
 * //         "numberOfLeapYearDays": 29,
 * //         "intercalary": false,
 * //         "intercalaryInclude": false,
 * //         "startingWeekday": null
 * //     },
 * //     {
 * //         "id": "25b48251",
 * //         "name": "March",
 * //         "description" : "",
 * //         "abbreviation": "Mar",
 * //         "numericRepresentation": 3,
 * //         "numericRepresentationOffset": 0,
 * //         "numberOfDays": 31,
 * //         "numberOfLeapYearDays": 31,
 * //         "intercalary": false,
 * //         "intercalaryInclude": false,
 * //         "startingWeekday": null
 * //     },
 * //     {
 * //         "id": "e5e9782f",
 * //         "name": "April",
 * //         "description" : "",
 * //         "abbreviation": "Apr",
 * //         "numericRepresentation": 4,
 * //         "numericRepresentationOffset": 0,
 * //         "numberOfDays": 30,
 * //         "numberOfLeapYearDays": 30,
 * //         "intercalary": false,
 * //         "intercalaryInclude": false,
 * //         "startingWeekday": null
 * //     },
 * //     {
 * //         "id": "93f626f6",
 * //         "name": "May",
 * //         "description" : "",
 * //         "abbreviation": "May",
 * //         "numericRepresentation": 5,
 * //         "numericRepresentationOffset": 0,
 * //         "numberOfDays": 31,
 * //         "numberOfLeapYearDays": 31,
 * //         "intercalary": false,
 * //         "intercalaryInclude": false,
 * //         "startingWeekday": null
 * //     },
 * //     {
 * //         "id": "22b4b204",
 * //         "name": "June",
 * //         "description" : "",
 * //         "abbreviation": "Jun",
 * //         "numericRepresentation": 6,
 * //         "numericRepresentationOffset": 0,
 * //         "numberOfDays": 30,
 * //         "numberOfLeapYearDays": 30,
 * //         "intercalary": false,
 * //         "intercalaryInclude": false,
 * //         "startingWeekday": null
 * //     },
 * //     {
 * //         "id": "adc0a7ca",
 * //         "name": "July",
 * //         "description" : "",
 * //         "abbreviation": "Jul",
 * //         "numericRepresentation": 7,
 * //         "numericRepresentationOffset": 0,
 * //         "numberOfDays": 31,
 * //         "numberOfLeapYearDays": 31,
 * //         "intercalary": false,
 * //         "intercalaryInclude": false,
 * //         "startingWeekday": null
 * //     },
 * //     {
 * //         "id": "58197d71",
 * //         "name": "August",
 * //         "description" : "",
 * //         "abbreviation": "Aug",
 * //         "numericRepresentation": 8,
 * //         "numericRepresentationOffset": 0,
 * //         "numberOfDays": 31,
 * //         "numberOfLeapYearDays": 31,
 * //         "intercalary": false,
 * //         "intercalaryInclude": false,
 * //         "startingWeekday": null
 * //     },
 * //     {
 * //         "id": "eca76bbd",
 * //         "name": "September",
 * //         "description" : "",
 * //         "abbreviation": "Sep",
 * //         "numericRepresentation": 9,
 * //         "numericRepresentationOffset": 0,
 * //         "numberOfDays": 30,
 * //         "numberOfLeapYearDays": 30,
 * //         "intercalary": false,
 * //         "intercalaryInclude": false,
 * //         "startingWeekday": null
 * //     },
 * //     {
 * //         "id": "6b0da33e",
 * //         "name": "October",
 * //         "description" : "",
 * //         "abbreviation": "Oct",
 * //         "numericRepresentation": 10,
 * //         "numericRepresentationOffset": 0,
 * //         "numberOfDays": 31,
 * //         "numberOfLeapYearDays": 31,
 * //         "intercalary": false,
 * //         "intercalaryInclude": false,
 * //         "startingWeekday": null
 * //     },
 * //     {
 * //         "id": "150f5519",
 * //         "name": "November",
 * //         "description" : "",
 * //         "abbreviation": "Nov",
 * //         "numericRepresentation": 11,
 * //         "numericRepresentationOffset": 0,
 * //         "numberOfDays": 30,
 * //         "numberOfLeapYearDays": 30,
 * //         "intercalary": false,
 * //         "intercalaryInclude": false,
 * //         "startingWeekday": null
 * //     },
 * //     {
 * //         "id": "b67bc3ee",
 * //         "name": "December",
 * //         "description" : "",
 * //         "abbreviation": "Dec",
 * //         "numericRepresentation": 12,
 * //         "numericRepresentationOffset": 0,
 * //         "numberOfDays": 31,
 * //         "numberOfLeapYearDays": 31,
 * //         "intercalary": false,
 * //         "intercalaryInclude": false,
 * //         "startingWeekday": null
 * //     }
 * // ]
 * ```
 */
export function getAllMonths(calendarId: string = "active"): SimpleCalendar.MonthData[] {
    const cal = calendarId === "active" ? CalManager.getActiveCalendar() : CalManager.getCalendar(calendarId);
    if (cal) {
        return cal.months.map((m) => {
            return m.toConfig();
        });
    } else {
        Logger.error(`SimpleCalendar.api.getAllMonths - Unable to find a calendar with the passed in ID of "${calendarId}"`);
        return [];
    }
}

/**
 * Gets the details for all the moons of the specified calendar.
 *
 * @param calendarId Optional parameter to specify the ID of the calendar to get the list of moons from. If not provided the current active calendar will be used.
 *
 * @returns Array of all moons in the calendar.
 *
 * @example
 * ```javascript
 * SimpleCalendar.api.getAllMoons();
 * // Returns an array like this, assuming the Gregorian Calendar
 * // [
 * //     {
 * //         "id": "2c26abfa",
 * //         "name": "Moon",
 * //         "color": "#ffffff",
 * //         "cycleLength": 29.53059,
 * //         "cycleDayAdjust": 0.5,
 * //         "firstNewMoon": {
 * //             "year": 2000,
 * //             "month": 1,
 * //             "day": 6,
 * //             "yearX": 0,
 * //             "yearReset": "none"
 * //         },
 * //         "phases": [
 * //             {
 * //                 "name": "New Moon",
 * //                 "length": 1,
 * //                 "icon": "new",
 * //                 "singleDay": true
 * //             },
 * //             {
 * //                 "name": "Waxing Crescent",
 * //                 "length": 6.3826,
 * //                 "icon": "waxing-crescent",
 * //                 "singleDay": false
 * //             },
 * //             {
 * //                 "name": "First Quarter",
 * //                 "length": 1,
 * //                 "icon": "first-quarter",
 * //                 "singleDay": true
 * //             },
 * //             {
 * //                 "name": "Waxing Gibbous",
 * //                 "length": 6.3826,
 * //                 "icon": "waxing-gibbous",
 * //                 "singleDay": false
 * //             },
 * //             {
 * //                 "name": "Full Moon",
 * //                 "length": 1,
 * //                 "icon": "full",
 * //                 "singleDay": true
 * //             },
 * //             {
 * //                 "name": "Waning Gibbous",
 * //                 "length": 6.3826,
 * //                 "icon": "waning-gibbous",
 * //                 "singleDay": false
 * //             },
 * //             {
 * //                 "name": "Last Quarter",
 * //                 "length": 1,
 * //                 "icon": "last-quarter",
 * //                 "singleDay": true
 * //             },
 * //             {
 * //                 "name": "Waning Crescent",
 * //                 "length": 6.3826,
 * //                 "icon": "waning-crescent",
 * //                 "singleDay": false
 * //             }
 * //         ],
 * //         "currentPhase": {
 * //             "name": "Waning Crescent",
 * //             "length": 6.3826,
 * //             "icon": "waning-crescent",
 * //             "singleDay": false
 * //         }
 * //     }
 * // ]
 * ```
 */
export function getAllMoons(calendarId: string = "active"): SimpleCalendar.MoonData[] {
    const activeCalendar = calendarId === "active" ? CalManager.getActiveCalendar() : CalManager.getCalendar(calendarId);
    if (activeCalendar) {
        return activeCalendar.moons.map((m) => {
            const c = m.toConfig();
            c.currentPhase = m.getMoonPhase(activeCalendar);
            return c;
        });
    } else {
        Logger.error(`SimpleCalendar.api.getAllMoons - Unable to find a calendar with the passed in ID of "${calendarId}"`);
        return [];
    }
}

/**
 * Gets the details for all the seasons for the specified calendar.
 *
 * @param calendarId Optional parameter to specify the ID of the calendar to get the list of seasons from. If not provided the current active calendar will be used.
 *
 * @returns Array of all seasons in the calendar.
 *
 * @example
 * ```javascript
 * SimpleCalendar.api.getAllSeasons();
 * // Returns an array like this, assuming the Gregorian Calendar
 * // [
 * //     {
 * //         color: "#fffce8",
 * //         description : "",
 * //         icon: "spring,
 * //         id: "4916a231",
 * //         name: "Spring",
 * //         startingDay: 20,
 * //         startingMonth: 3,
 * //         sunriseTime: 21600,
 * //         sunsetTime: 64800
 * //     },
 * //     {
 * //         color: "#f3fff3",
 * //         description : "",
 * //         icon: "summer,
 * //         id: "e596489",
 * //         name: "Summer",
 * //         startingDay: 20,
 * //         startingMonth: 6,
 * //         sunriseTime: 21600,
 * //         sunsetTime: 64800
 * //     },
 * //     {
 * //         color: "#fff7f2",
 * //         description : "",
 * //         icon: "fall,
 * //         id: "3f137ee5",
 * //         name: "Fall",
 * //         startingDay: 22,
 * //         startingMonth: 9,
 * //         sunriseTime: 21600,
 * //         sunsetTime: 64800
 * //     },
 * //     {
 * //         color: "#f2f8ff",
 * //         description : "",
 * //         icon: "winter,
 * //         id: "92f919a2",
 * //         name: "Winter",
 * //         startingDay: 21,
 * //         startingMonth: 12,
 * //         sunriseTime: 21600,
 * //         sunsetTime: 64800
 * //     }
 * // ]
 * ```
 */
export function getAllSeasons(calendarId: string = "active"): SimpleCalendar.SeasonData[] {
    const cal = calendarId === "active" ? CalManager.getActiveCalendar() : CalManager.getCalendar(calendarId);
    if (cal) {
        return cal.seasons.map((s) => {
            return s.toConfig();
        });
    } else {
        Logger.error(`SimpleCalendar.api.getAllSeasons - Unable to find a calendar with the passed in ID of "${calendarId}"`);
        return [];
    }
}

/**
 * Gets a list of all available themes a user can choose from. System specific themes that do not match the current system will be excluded. Module specific themes whos modules are not installed and enabled will be excluded.
 *
 * @returns A object where the properties represent theme IDs and the values are the localized strings of the theme name.
 *
 * @example
 * ```javascript
 * SimpleCalendar.api.getAllThemes();
 * // {
 * //    "dark": "Dark",
 * //    "light": "Light",
 * //    "classic": "Classic"
 * // }
 * ```
 */
export function getAllThemes(): { [themeId: string]: string } {
    const themes = GetThemeList();
    for (const key in themes) {
        themes[key] = GameSettings.Localize(themes[key]);
    }
    return themes;
}

/**
 * Gets the details about all the weekdays for the specified calendar.
 *
 * @param calendarId Optional parameter to specify the ID of the calendar to get the list of weekdays from. If not provided the current active calendar will be used.
 *
 * @returns Array of all weekdays in the calendar.
 *
 * @example
 * ```javascript
 * SimpleCalendar.api.getAllWeekdays();
 * // Returns an array like this, assuming the Gregorian Calendar
 * // [
 * //     {
 * //         id: "dafbfd4",
 * //         name: "Sunday",
 * //         description : "",
 * //         numericRepresentation: 1,
 * //         restday : false,
 * //     },
 * //     {
 * //         id: "8648c7e9",
 * //         name: "Monday",
 * //         description : "",
 * //         numericRepresentation: 2,
 * //         restday : false,
 * //     }
 * //     {
 * //         id: "b40f3a20",
 * //         name: "Tuesday",
 * //         description : "",
 * //         numericRepresentation: 3,
 * //         restday : false,
 * //     },
 * //     {
 * //         id: "6c20a99e",
 * //         name: "Wednesday",
 * //         description : "",
 * //         numericRepresentation: 4,
 * //         restday : false,
 * //     },
 * //     {
 * //         id: "56c14ec7",
 * //         name: "Thursday",
 * //         description : "",
 * //         numericRepresentation: 5,
 * //         restday : false,
 * //     },
 * //     {
 * //         id: "2c732d04",
 * //         name: "Friday",
 * //         description : "",
 * //         numericRepresentation: 6,
 * //         restday : false,
 * //     },
 * //     {
 * //         id: "c8f72e3d",
 * //         name: "Saturday",
 * //         description : "",
 * //         numericRepresentation: 7,
 * //         restday : false,
 * //     }
 * // ]
 * ```
 */
export function getAllWeekdays(calendarId: string = "active"): SimpleCalendar.WeekdayData[] {
    const cal = calendarId === "active" ? CalManager.getActiveCalendar() : CalManager.getCalendar(calendarId);
    if (cal) {
        return cal.weekdays.map((w) => {
            return w.toConfig();
        });
    } else {
        Logger.error(`SimpleCalendar.api.getAllWeekdays - Unable to find a calendar with the passed in ID of "${calendarId}"`);
        return [];
    }
}

/**
 * Gets the details about the current active calendar.
 *
 * @returns The current active calendars configuration.
 *
 * @example
 * ```javascript
 * cosnt c = SimpleCalendar.api.getCurrentCalendar();
 * console.log(c); // Will contain all the configuration data for the current calendar.
 * ```
 */
export function getCurrentCalendar(): SimpleCalendar.CalendarData {
    return CalManager.getActiveCalendar().toConfig();
}

/**
 * Gets the details about the current day for the specified calendar.
 *
 * @param calendarId Optional parameter to specify the ID of the calendar to get the current day from. If not provided the current active calendar will be used.
 *
 * @returns The current day data or null if no current day can be found.
 *
 * @example
 * ```javascript
 * SimpleCalendar.api.getCurrentDay();
 * // Returns an object like this:
 * // {
 * //     id: "cbdb31cb",
 * //     name: "8",
 * //     numericRepresentation: 8
 * // }
 * ```
 */
export function getCurrentDay(calendarId: string = "active"): SimpleCalendar.DayData | null {
    const cal = calendarId === "active" ? CalManager.getActiveCalendar() : CalManager.getCalendar(calendarId);
    if (cal) {
        const month = cal.getMonth();
        if (month) {
            const day = month.getDay();
            if (day) {
                return day.toConfig();
            }
        }
    } else {
        Logger.error(`SimpleCalendar.api.getCurrentDay - Unable to find a calendar with the passed in ID of "${calendarId}"`);
    }
    return null;
}

/**
 * Gets the details about the current month for the specified calendar.
 *
 * @param calendarId Optional parameter to specify the ID of the calendar to get the current month from. If not provided the current active calendar will be used.
 *
 * @returns The current month data or null if no current month can be found.
 *
 * @example
 * ```javascript
 * SimpleCalendar.api.getCurrentMonth();
 * // Returns an object like this:
 * // {
 * //     abbreviation: "Jun",
 * //     id: "22b4b204",
 * //     intercalary: false,
 * //     intercalaryInclude: false,
 * //     name: "June",
 * //     description: "",
 * //     numberOfDays: 30,
 * //     numberOfLeapYearDays: 30,
 * //     numericRepresentation: 6,
 * //     numericRepresentationOffset: 0,
 * //     startingWeekday: null
 * // }
 * ```
 */
export function getCurrentMonth(calendarId: string = "active"): SimpleCalendar.MonthData | null {
    const cal = calendarId === "active" ? CalManager.getActiveCalendar() : CalManager.getCalendar(calendarId);
    if (cal) {
        const month = cal.getMonth();
        if (month) {
            return month.toConfig();
        }
    } else {
        Logger.error(`SimpleCalendar.api.getCurrentMonth - Unable to find a calendar with the passed in ID of "${calendarId}"`);
    }
    return null;
}

/**
 * Gets the details about the season for the current date of the specified calendar.
 *
 * @param calendarId Optional parameter to specify the ID of the calendar to get the current season from. If not provided the current active calendar will be used.
 *
 * @returns The current seasons data or an empty season data object if no current season can be found.
 *
 * @example
 * ```javascript
 * SimpleCalendar.api.getCurrentSeason();
 * // Returns an object like this
 * // {
 * //     color: "#fffce8",
 * //     id: "4916a231",
 * //     name: "Spring",
 * //     description: "",
 * //     icon: "spring",
 * //     startingDay: 19,
 * //     startingMonth: 2,
 * //     sunriseTime: 21600,
 * //     sunsetTime: 64800
 * // }
 * ```
 */
export function getCurrentSeason(calendarId: string = "active"): SimpleCalendar.SeasonData {
    const cal = calendarId === "active" ? CalManager.getActiveCalendar() : CalManager.getCalendar(calendarId);
    if (cal) {
        const monthDayIndex = cal.getMonthAndDayIndex();
        return cal.getSeason(monthDayIndex.month || 0, monthDayIndex.day || 0).toConfig();
    } else {
        Logger.error(`SimpleCalendar.api.getCurrentSeason - Unable to find a calendar with the passed in ID of "${calendarId}"`);
    }
    return { id: "", name: "", description: "", icon: Icons.None, color: "", startingMonth: 0, startingDay: 0, sunriseTime: 0, sunsetTime: 0 };
}

/**
 * Gets the ID of the theme being used by the player.
 *
 * @returns A string ID of the theme being used.
 *
 * @example
 * ```javascript
 * SimpleCalendar.api.getCurrentTheme();
 * // Returns "dark"
 * ```
 */
export function getCurrentTheme(): string {
    return GetThemeName();
}

/**
 * Gets the details about the current weekday.
 *
 * @param calendarId Optional parameter to specify the ID of the calendar to get the current weekday from. If not provided the current active calendar will be used.
 *
 * @returns The current weekday data or null if no current weekday can be found.
 *
 * @example
 * ```javascript
 * SimpleCalendar.api.getCurrentWeekday();
 * // Returns an object like this
 * // {
 * //     id: "b40f3a20",
 * //     name: "Tuesday",
 * //     abbreviation: "Tu",
 * //     description: "",
 * //     numericRepresentation: 3,
 * //     restday: false
 * // }
 * ```
 */
export function getCurrentWeekday(calendarId: string = "active"): SimpleCalendar.WeekdayData | null {
    const activeCalendar = calendarId === "active" ? CalManager.getActiveCalendar() : CalManager.getCalendar(calendarId);
    if (activeCalendar) {
        const monthDayIndex = activeCalendar.getMonthAndDayIndex();
        const weekdayIndex = activeCalendar.dayOfTheWeek(activeCalendar.year.numericRepresentation, monthDayIndex.month || 0, monthDayIndex.day || 0);
        return activeCalendar.weekdays[weekdayIndex].toConfig();
    } else {
        Logger.error(`SimpleCalendar.api.getCurrentWeekday - Unable to find a calendar with the passed in ID of "${calendarId}"`);
    }

    return null;
}

/**
 * Gets the details about the current year for the specified calendar.
 *
 * @param calendarId Optional parameter to specify the ID of the calendar to get the current year from. If not provided the current active calendar will be used.
 *
 * @returns The current year data or null if no current year can be found.
 *
 * @example
 * ```javascript
 * SimpleCalendar.api.getCurrentYear();
 * // Returns an object like this
 * // {
 * //     firstWeekday: 4,
 * //     id: "bbe5385c",
 * //     numericRepresentation: 2021,
 * //     postfix: "",
 * //     prefix: "",
 * //     showWeekdayHeadings: true,
 * //     yearNames: [],
 * //     yearNamesStart: 0,
 * //     yearNamingRule: "default",
 * //     yearZero: 1970
 * // }
 * ```
 */
export function getCurrentYear(calendarId: string = "active"): SimpleCalendar.YearData | null {
    const cal = calendarId === "active" ? CalManager.getActiveCalendar() : CalManager.getCalendar(calendarId);
    if (cal) {
        return cal.year.toConfig();
    } else {
        Logger.error(`SimpleCalendar.api.getCurrentYear - Unable to find a calendar with the passed in ID of "${calendarId}"`);
    }
    return null;
}

/**
 * Gets the details about how leap years are configured for the specified calendar.
 *
 * @param calendarId Optional parameter to specify the ID of the calendar to get the leap year configuration from. If not provided the current active calendar will be used.
 *
 * @returns The leap year configuration.
 *
 * @example
 * ```javascript
 * SimpleCalendar.api.getLeapYearConfiguration();
 * // Returns an object like this
 * // {
 * //     customMod: 0,
 * //     id: "1468d034",
 * //     rule: "gregorian"
 * }
 * ```
 */
export function getLeapYearConfiguration(calendarId: string = "active"): SimpleCalendar.LeapYearData | null {
    const cal = calendarId === "active" ? CalManager.getActiveCalendar() : CalManager.getCalendar(calendarId);
    if (cal) {
        return cal.year.leapYearRule.toConfig();
    } else {
        Logger.error(`SimpleCalendar.api.getLeapYearConfiguration - Unable to find a calendar with the passed in ID of "${calendarId}"`);
    }
    return null;
}

/**
 * Gets all notes that the current user is able to see for the specified calendar.
 *
 * @param calendarId Optional parameter to specify the ID of the calendar to get the notes from. If not provided the current active calendar will be used.
 *
 * @returns A list of [JournalEntry](https://foundryvtt.com/api/JournalEntry.html) that contain the note data.
 *
 * @example
 * ```javascript
 * // Returns an array of JournalEntry objects
 * SimpleCalendar.api.getNotes();
 *```
 */
export function getNotes(calendarId: string = "active"): (StoredDocument<JournalEntry> | undefined)[] {
    calendarId = calendarId === "active" ? CalManager.getActiveCalendar().id : calendarId;
    return NManager.getNotes(calendarId).map((n) => {
        return (<Game>game).journal?.get(n.entryId);
    });
}

/**
 * Gets all notes that the current user is able to see for the specified date from the specified calendar.
 * @param year The year of the date to get the notes for.
 * @param month The index of the month to get the notes for.
 * @param day The index of the day to get the notes for.
 * @param calendarId Optional parameter to specify the ID of the calendar to get the notes from. If not provided the current active calendar will be used.
 *
 * @returns A list of [JournalEntry](https://foundryvtt.com/api/JournalEntry.html) that contain the note data.
 *
 * @example
 * ```javascript
 * // Returns an array of JournalEntry objects
 * SimpleCalendar.api.getNotesForDay(2022, 11, 24);
 * ```
 */
export function getNotesForDay(
    year: number,
    month: number,
    day: number,
    calendarId: string = "active"
): (StoredDocument<JournalEntry> | undefined)[] {
    calendarId = calendarId === "active" ? CalManager.getActiveCalendar().id : calendarId;
    return NManager.getNotesForDay(calendarId, year, month, day).map((n) => {
        return (<Game>game).journal?.get(n.entryId);
    });
}

/**
 * Get the details about how time is configured for the specified calendar.
 *
 * @param calendarId Optional parameter to specify the ID of the calendar to get the time configuration from. If not provided the current active calendar will be used.
 *
 * @returns The time configuration.
 *
 * @example
 * ```javascript
 * SimpleCalendar.api.getTimeConfiguration();
 * // Returns an object like this
 * // {
 * //     gameTimeRatio: 1,
 * //     hoursInDay: 24,
 * //     id: "d4791796",
 * //     minutesInHour: 60,
 * //     secondsInCombatRound: 6,
 * //     secondsInMinute: 60,
 * //     unifyGameAndClockPause: true,
 * //     updateFrequency: 1
 * // }
 * ```
 */
export function getTimeConfiguration(calendarId: string = "active"): SimpleCalendar.TimeData | null {
    const cal = calendarId === "active" ? CalManager.getActiveCalendar() : CalManager.getCalendar(calendarId);
    if (cal) {
        return cal.time.toConfig();
    } else {
        Logger.error(`SimpleCalendar.api.getTimeConfiguration - Unable to find a calendar with the passed in ID of "${calendarId}"`);
    }
    return null;
}

/**
 * If the calendar is open or not.
 *
 * @returns boolean True if the calendar is open, false if it is closed.
 *
 * @example
 * ```javascript
 * SimpleCalendar.api.isOpen(); // True or false depending on if the calendar is open or closed.
 * ```
 */
export function isOpen(): boolean {
    return MainApplication.rendered;
}

/**
 * Get if the current user is considered the primary GM or not.
 *
 * @returns If the current user is the primary GM.
 *
 * @example
 * ```javascript
 *
 * SimpleCalendar.api.isPrimaryGM(); //True or False depending on if the current user is primary gm
 *
 * ```
 */
export function isPrimaryGM(): boolean {
    return SC.primary;
}

/**
 * Pauses the real time clock for the specified calendar. Only the primary GM can pause a clock.
 *
 * @param calendarId Optional parameter to specify the ID of the calendar to pause the real time clock for. If not provided the current active calendar will be used.
 *
 * @returns True if the clock was paused, false otherwise
 *
 * @example
 * ```javascript
 * SimpleCalendar.api.pauseClock();
 * ```
 */
export function pauseClock(calendarId: string = "active"): boolean {
    if (SC.primary) {
        const cal = calendarId === "active" ? CalManager.getActiveCalendar() : CalManager.getCalendar(calendarId);
        3;
        if (cal) {
            const status = cal.timeKeeper.getStatus();
            if (status === TimeKeeperStatus.Started) {
                cal.timeKeeper.start();
                return cal.timeKeeper.getStatus() === TimeKeeperStatus.Paused;
            } else if (status === TimeKeeperStatus.Paused) {
                return true;
            }
        } else {
            Logger.error(`SimpleCalendar.api.pauseClock - Unable to find a calendar with the passed in ID of "${calendarId}"`);
        }
    }
    return false;
}

/**
 * This function removes the specified note from Simple Calendar.
 *
 * @param journalEntryId The ID of the journal entry associated with the note that is to be removed.
 *
 * @returns True if the note was removed or false if it was not.
 *
 * @example
 * ```javascript
 * SimpleCalendar.api.removeNote("asd123").then(...).catch(console.error);
 * ```
 */
export async function removeNote(journalEntryId: string): Promise<boolean> {
    const je = (<Game>game).journal?.get(journalEntryId);
    if (je) {
        const ns = NManager.getNoteStub(je);
        if (ns?.isVisible) {
            NManager.removeNoteStub(je);
            MainApplication.updateApp();
            await je.delete();
            await GameSockets.emit({ type: SocketTypes.mainAppUpdate, data: {} });
            return true;
        }
    } else {
        Logger.error(`SimpleCalendar.api.removeNote - Unable to find a journal entry with the passed in ID of "${journalEntryId}"`);
    }
    return false;
}

/**
 * Run the migration from Simple Calendar version 1 to version 2.
 * This will only work if the current player is the primary GM.
 *
 * A dialog will be shown to confirm if the GM wants to run the migration. This will prevent accidental running of the migration.
 *
 * @example
 * ```javascript
 * SimpleCalendar.api.runMigration();
 * ```
 */
export function runMigration(): void {
    if (GameSettings.IsGm() && SC.primary) {
        const d = new Dialog({
            title: GameSettings.Localize("FSC.Migration.APIDialog.Title"),
            content: GameSettings.Localize("FSC.Migration.APIDialog.Content"),
            buttons: {
                yes: {
                    icon: '<i class="fas fa-check"></i>',
                    label: GameSettings.Localize("FSC.Confirm"),
                    callback: MigrationApplication.run.bind(MigrationApplication, true)
                },
                no: {
                    icon: '<i class="fas fa-times"></i>',
                    label: GameSettings.Localize("FSC.Cancel")
                }
            },
            default: "no"
        });
        d.render(true);
    }
}

/**
 * Search the notes in Simple Calendar for a specific term. Only notes that the user can see are returned.
 *
 * @param term The text that is being searched for
 * @param options Options parameter to specify which fields of the note to use when searching, If not provided all fields are searched against.
 * @param calendarId Optional parameter to specify the ID of the calendar whose notes to search against. If not provided the current active calendar will be used.
 *
 * @returns A list of [JournalEntry](https://foundryvtt.com/api/JournalEntry.html) that matched the term being searched.
 *
 * @example
 * ```javascript
 * SimpleCalendar.api.searchNotes("Note"); //Will return a list of notes that contained the word note somewhere in its content.
 *
 * SimpleCalendar.api.searchNotes("Note", {title: true}); // Will return a list of notes that contain the world note in the title.
 *
 * SimpleCalendar.api.searchNotes("Gamemaster", {author: true}); // Will return a list of notes that were written by the gamemaster.
 * ```
 */
export function searchNotes(
    term: string,
    options = { date: true, title: true, details: true, categories: true, author: true },
    calendarId: string = "active"
): (StoredDocument<JournalEntry> | undefined)[] {
    const cal = calendarId === "active" ? CalManager.getActiveCalendar() : CalManager.getCalendar(calendarId);
    let results: (StoredDocument<JournalEntry> | undefined)[] = [];
    if (cal) {
        results = NManager.searchNotes(cal.id, term, options).map((n) => {
            return (<Game>game).journal?.get(n.entryId);
        });
    } else {
        Logger.error(`SimpleCalendar.api.searchNotes - Unable to find a calendar with the passed in ID of "${calendarId}"`);
    }
    return results;
}

/**
 * Will attempt to parse the passed in seconds into larger time intervals.
 *
 * @param seconds The number of seconds to convert to different intervals.
 * @param calendarId Optional parameter to specify the ID of the calendar to use when calculating the intervals. If not provided the current active calendar will be used.
 *
 * @returns An object containing the larger time intervals that make up the number of seconds passed in.
 *
 * @example
 * ```javascript
 * //Assuming a Gregorian Calendar
 * SimpleCalendar.api.secondsToInterval(3600); //Returns {year: 0, month: 0, day: 0, hour: 1, minute: 0, seconds: 0}
 * SimpleCalendar.api.secondsToInterval(3660); //Returns {year: 0, month: 0, day: 0, hour: 1, minute: 1, seconds: 0}
 * SimpleCalendar.api.secondsToInterval(86400); //Returns {year: 0, month: 0, day: 1, hour: 0, minute: 0, seconds: 0}
 * SimpleCalendar.api.secondsToInterval(604800); //Returns {year: 0, month: 0, day: 7, hour: 0, minute: 0, seconds: 0}
 * SimpleCalendar.api.secondsToInterval(2629743); //Returns {year: 0, month: 1, day: 0, hour: 10, minute: 29, seconds: 3}
 * SimpleCalendar.api.secondsToInterval(31556926); //Returns {year: 1, month: 0, day: 0, hour: 5, minute: 48, seconds: 46}
 * ```
 */
export function secondsToInterval(seconds: number, calendarId: string = "active"): SimpleCalendar.DateTimeParts {
    const cal = calendarId === "active" ? CalManager.getActiveCalendar() : CalManager.getCalendar(calendarId);
    if (cal) {
        return cal.secondsToInterval(seconds);
    } else {
        Logger.error(`SimpleCalendar.api.secondsToInterval - Unable to find a calendar with the passed in ID of "${calendarId}"`);
    }
    return {};
}

/**
 * Will set the current date of the specified calendar to match the passed in date.
 * **Important**: This function can only be run by users who have permission to change the date in Simple Calendar.
 *
 * @param date A date object (eg `{year:2021, month: 4, day: 12, hour: 0, minute: 0, seconds: 0}`) with the parameters set to the date that the calendar should be set to. Any missing parameters will default to the current date value for that parameter.<br>**Important**: The month and day are index based so January would be 0 and the first day of the month will also be 0.
 * @param calendarId Optional parameter to specify the ID of the calendar to set the date of. If not provided the current active calendar will be used.
 *
 * @returns True if the date was set successfully, false otherwise.
 *
 * @example
 * ```javascript
 * //To set the date to December 25th 1999 with the time 00:00:00
 * SimpleCalendar.api.setDate({year: 1999, month: 11, day: 24, hour: 0, minute: 0, seconds: 0});
 *
 * //To set the date to December 31st 1999 and the time to 11:59:59pm
 * SimpleCalendar.api.setDate({year: 1999, month: 11, day: 30, hour: 23, minute: 59, seconds: 59});
 * ```
 */
export function setDate(date: SimpleCalendar.DateTimeParts, calendarId: string = "active"): boolean {
    const activeCalendar = calendarId === "active" ? CalManager.getActiveCalendar() : CalManager.getCalendar(calendarId);
    if (activeCalendar) {
        return activeCalendar.setDateTime(date, { showWarning: true });
    } else {
        Logger.error(`SimpleCalendar.api.setDate - Unable to find a calendar with the passed in ID of "${calendarId}"`);
    }
    return false;
}

/**
 * Will set the players Simple Calendar theme that matches the passed in theme ID.
 *
 * An information notification will be shown to the player if the theme was changed to let them know it has been changed programmatically.
 *
 * @param themeId The ID of the theme to set. The ID's of all available themes can be found using {@link SimpleCalendar.api.getAllThemes}.
 *
 * @returns A promise that resolves to True if the theme is valid and was applied successfully, or it was the theme already being used. The promise will resolve to False if a theme with that ID could not be found.
 *
 * @example
 * ```javascript
 *
 * await SimpleCalendar.api.setTheme('light');
 * //Will return true and change Simple Calendar's theme to the light theme.
 *
 * await SimpleCalendar.api.setTheme('light');
 * //Will return true and will not change the theme as it was already set to light.
 *
 * await SimpleCalendar.api.setTheme('themeDoesNotExist');
 * //Will return false and log an error to the console.
 * ```
 */
export async function setTheme(themeId: string): Promise<boolean> {
    themeId = themeId.toLowerCase();
    const availableThemes = GetThemeList();
    if (availableThemes[themeId] !== undefined) {
        //If the passed in theme is the same as the current theme being used don't apply the changes
        if (themeId !== GetThemeName()) {
            await GameSettings.SaveStringSetting(`${(<Game>game).world.id}.${SettingNames.Theme}`, themeId, false);
            GameSettings.UiNotification(
                GameSettings.Localize("FSC.Info.ThemeChange").replace("{THEME}", GameSettings.Localize(availableThemes[themeId])),
                "info",
                true
            );
        }
        return true;
    } else {
        console.error(`SimpleCalendar.api.setTheme - Unable to find a theme with the ID of "${themeId}"`);
    }
    return false;
}

/**
 * Will open up Simple Calendar to the current date, or the passed in date.
 *
 * @param date A date object (eg `{year:2021, month: 4, day: 12}`) with the year, month and day set to the date to be visible when the calendar is opened.<br>**Important**: The month is index based so January would be 0.
 * @param compact If to open the calendar in compact mode or not.
 * @param calendarId Optional parameter to specify the ID of the calendar to focus when the calendar view is opened. If not provided the current active calendar will be used.
 *
 * @example
 * ```javascript
 * //Assuming a Gregorian Calendar
 * SimpleCalendar.api.showCalendar(); // Will open the calendar to the current date.
 * SimpleCalendar.api.showCalendar({year: 1999, month: 11, day: 25}); // Will open the calendar to the date December 25th, 1999
 * SimpleCalendar.api.showCalendar(null, true); // Will open the calendar to the current date in compact mode.
 * ```
 */
export function showCalendar(date: SimpleCalendar.DateTimeParts | null = null, compact: boolean = false, calendarId: string = "active"): void {
    const activeCalendar = calendarId === "active" ? CalManager.getActiveCalendar() : CalManager.getCalendar(calendarId);

    if (activeCalendar) {
        CalManager.setVisibleCalendar(activeCalendar.id);
        if (date !== null) {
            const finalDate = MergeDateTimeObject(date, null, activeCalendar);

            if (Number.isInteger(finalDate.year) && Number.isInteger(finalDate.month) && Number.isInteger(finalDate.day)) {
                const isLeapYear = activeCalendar.year.leapYearRule.isLeapYear(finalDate.year);
                activeCalendar.year.visibleYear = finalDate.year;
                if (finalDate.month === -1 || finalDate.month > activeCalendar.months.length) {
                    finalDate.month = activeCalendar.months.length - 1;
                }
                activeCalendar.resetMonths("visible");
                activeCalendar.months[finalDate.month].visible = true;

                const numberOfDays = isLeapYear
                    ? activeCalendar.months[finalDate.month].numberOfLeapYearDays
                    : activeCalendar.months[finalDate.month].numberOfDays;
                if (finalDate.day === -1 || finalDate.day > numberOfDays) {
                    finalDate.day = numberOfDays - 1;
                }
                activeCalendar.resetMonths("selected");
                activeCalendar.months[finalDate.month].days[finalDate.day].selected = true;
                activeCalendar.months[finalDate.month].selected = true;
                activeCalendar.year.selectedYear = activeCalendar.year.visibleYear;
            } else {
                Logger.error("Main.api.showCalendar: Invalid date passed in.");
            }
        }
    } else {
        Logger.error(`SimpleCalendar.api.showCalendar - Unable to find a calendar with the passed in ID of "${calendarId}"`);
    }

    MainApplication.uiElementStates.compactView = compact;
    if (MainApplication.rendered) {
        MainApplication.updateApp();
    } else {
        MainApplication.render();
    }
}

/**
 * Starts the real time clock for the specified calendar. Only the primary GM can start a clock.
 *
 * @param calendarId Optional parameter to specify the ID of the calendar to start the real time clock for. If not provided the current active calendar will be used.
 *
 * @returns True if the clock was started, false otherwise
 *
 * @example
 * ```javascript
 * SimpleCalendar.api.startClock();
 * ```
 */
export function startClock(calendarId: string = "active"): boolean {
    if (SC.primary) {
        const cal = calendarId === "active" ? CalManager.getActiveCalendar() : CalManager.getCalendar(calendarId);
        if (cal) {
            cal.timeKeeper.start();
            return true;
        } else {
            Logger.error(`SimpleCalendar.api.startClock - Unable to find a calendar with the passed in ID of "${calendarId}"`);
        }
    }
    return false;
}

/**
 * Stops the real time clock for the specified calendar. Only the primary GM can stop a clock.
 *
 * @param calendarId Optional parameter to specify the ID of the calendar to stop the real time clock for. If not provided the current active calendar will be used.
 *
 * @returns True if the clock was stopped, false otherwise
 *
 * @example
 * ```javascript
 * SimpleCalendar.api.stopClock();
 * ```
 */
export function stopClock(calendarId: string = "active"): boolean {
    if (SC.primary) {
        const cal = calendarId === "active" ? CalManager.getActiveCalendar() : CalManager.getCalendar(calendarId);
        if (cal) {
            cal.timeKeeper.stop();
            return true;
        } else {
            Logger.error(`SimpleCalendar.api.stopClock - Unable to find a calendar with the passed in ID of "${calendarId}"`);
        }
    }
    return false;
}

/**
 * Get the timestamp (in seconds) of the specified calendars currently set date.
 *
 * @param calendarId Optional parameter to specify the ID of the calendar to get the timestamp for. If not provided the current active calendar will be used.
 *
 * @returns The time stamp of the calendar in seconds
 *
 * @example
 * ```javascript
 * const timestamp = SimpleCalendar.api.timestamp();
 * console.log(timestamp); // This will be a number representing the current number of seconds passed in the calendar.
 * ```
 */
export function timestamp(calendarId: string = "active"): number {
    const cal = calendarId === "active" ? CalManager.getActiveCalendar() : CalManager.getCalendar(calendarId);
    if (cal) {
        return cal.toSeconds();
    } else {
        Logger.error(`SimpleCalendar.api.timestamp - Unable to find a calendar with the passed in ID of "${calendarId}"`);
    }
    return NaN;
}

/**
 * Calculates a new timestamp from the passed in timestamp plus the passed in interval amount.
 * @param currentSeconds The timestamp (in seconds) to have the interval added too.
 * @param interval The interval objects properties are all optional so only those needed have to be set.<br/>Where each property is how many of that interval to increase the passed in timestamp by.
 * @param calendarId Optional parameter to specify the ID of the calendar to use to calculate the new timestamp. If not provided the current active calendar will be used.
 *
 * @returns The timestamp plus the passed in interval amount
 *
 * @example
 * ```javascript
 * let newTime = SimpleCalendar.api.timestampPlusInterval(0, {day: 1});
 * console.log(newTime); // this will be 0 + the number of seconds in 1 day. For most calendars this will be 86400
 *
 * // Assuming Gregorian Calendar with the current date of June 1, 2021
 * newTime = SimpleCalendar.api.timestampPlusInterval(1622505600, {month: 1, day: 1});
 * console.log(newTime); // This will be the number of seconds that equal July 2nd 2021
 * ```
 */
export function timestampPlusInterval(currentSeconds: number, interval: SimpleCalendar.DateTimeParts, calendarId: string = "active"): number {
    const activeCalendar = calendarId === "active" ? CalManager.getActiveCalendar() : CalManager.getCalendar(calendarId);
    if (activeCalendar) {
        const clone = activeCalendar.clone(false);
        // If this is a Pathfinder 2E game, add the world creation seconds to the interval seconds
        if (PF2E.isPF2E && activeCalendar.generalSettings.pf2eSync) {
            currentSeconds += PF2E.getWorldCreateSeconds(activeCalendar);
        }

        const dateTime = clone.secondsToDate(currentSeconds);
        clone.updateTime(dateTime);
        if (interval.year) {
            clone.changeYear(interval.year, false, "current");
        }
        if (interval.month) {
            //If a large number of months are passed in then
            if (interval.month > clone.months.length) {
                const years = Math.floor(interval.month / clone.months.length);
                interval.month = interval.month - years * clone.months.length;
                clone.changeYear(years, false, "current");
            }
            clone.changeMonth(interval.month, "current");
        }
        if (interval.day) {
            clone.changeDayBulk(interval.day);
        }
        if (interval.hour && interval.hour > clone.time.hoursInDay) {
            const days = Math.floor(interval.hour / clone.time.hoursInDay);
            interval.hour = interval.hour - days * clone.time.hoursInDay;
            clone.changeDayBulk(days);
        }
        if (interval.minute && interval.minute > clone.time.hoursInDay * clone.time.minutesInHour) {
            const days = Math.floor(interval.minute / (clone.time.hoursInDay * clone.time.minutesInHour));
            interval.minute = interval.minute - days * (clone.time.hoursInDay * clone.time.minutesInHour);
            clone.changeDayBulk(days);
        }
        if (interval.seconds && interval.seconds > clone.time.secondsPerDay) {
            const days = Math.floor(interval.seconds / clone.time.secondsPerDay);
            interval.seconds = interval.seconds - days * clone.time.secondsPerDay;
            clone.changeDayBulk(days);
        }
        const dayChange = clone.time.changeTime(interval.hour, interval.minute, interval.seconds);
        if (dayChange !== 0) {
            clone.changeDay(dayChange);
        }
        return clone.toSeconds();
    } else {
        Logger.error(`SimpleCalendar.api.timestampPlusInterval - Unable to find a calendar with the passed in ID of "${calendarId}"`);
        return NaN;
    }
}

/**
 * Converts a timestamp (in seconds) into a {@link SimpleCalendar.DateData} objet from the specified calendar
 * @param seconds The timestamp (in seconds) to convert into a date object.
 * @param calendarId Optional parameter to specify the ID of the calendar to use to calculate the {@link SimpleCalendar.DateData} objet. If not provided the current active calendar will be used.
 *
 * @returns A date object with information about the date the timestamp represents or null if the specified calendar can not be found
 *
 * @example
 * ```javascript
 * // Assuming Gregorian Calendar with the current date of June 1, 2021
 * let scDate = SimpleCalendar.api.timestampToDate(1622505600);
 * console.log(scDate);
 * // This is what the returned object will look like
 * // {
 * //     "currentSeason": { "showAdvanced": false, "id": "75a4ba97", "name": "Spring", "numericRepresentation": null, "description": "", "abbreviation": "", "color": "#46b946", "startingMonth": 2, "startingDay": 19, "sunriseTime": 21600, "sunsetTime": 64800, "icon": "spring"},
 * //     day: 0,
 * //     dayOfTheWeek: 2,
 * //     dayOffset: 0,
 * //     display: {
 * //         date: "June 01, 2021",
 * //         day: "1",
 * //         daySuffix: "st",
 * //         month: "6",
 * //         monthName: "June",
 * //         time: "00:00:00",
 * //         weekday: "Tuesday",
 * //         year: "2021",
 * //         yearName: "",
 * //         yearPostfix: "",
 * //         yearPrefix: "",
 * //     },
 * //     hour: 0,
 * //     isLeapYear: false,
 * //     midday: 1622548800,
 * //     minute: 0,
 * //     month: 5,
 * //     second: 0,
 * //     showWeekdayHeadings: true,
 * //     sunrise: 1622527200,
 * //     sunset: 1622570400,
 * //     weekdays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
 * //     year: 2021,
 * //     yearZero: 1970
 * // }
 * ```
 */
export function timestampToDate(seconds: number, calendarId: string = "active"): SimpleCalendar.DateData | null {
    const cal = calendarId === "active" ? CalManager.getActiveCalendar() : CalManager.getCalendar(calendarId);
    if (cal) {
        return TimestampToDateData(seconds, cal);
    } else {
        Logger.error(`SimpleCalendar.api.stopClock - Unable to find a calendar with the passed in ID of "${calendarId}"`);
        return null;
    }
}
