export import SimpleCalendar = globalThis.SimpleCalendar;
export import HandlebarHelpers = globalThis.HandlebarHelpers;
import { DateSelector } from "../src/classes/date-selector";
import Calendar from "../src/classes/calendar";
import UserPermissions from "../src/classes/configuration/user-permissions";
import {
    CalendarViews,
    CombatPauseRules,
    CompactViewDateTimeControlDisplay,
    DateSelectorPositions,
    DateTimeChangeSocketTypes,
    GameWorldTimeIntegrations,
    Icons,
    LeapYearRules,
    MoonYearResetOptions,
    NoteReminderNotificationType,
    NoteRepeat,
    PredefinedCalendars,
    PresetTimeOfDay,
    SimpleCalendarHooks,
    SocketTypes,
    TimeKeeperStatus,
    YearNamingRules
} from "../src/constants";
import NoteStub from "../src/classes/notes/note-stub";

declare global {
    /**
     * The `SimpleCalendar` namespace is used to house all functionality that other modules, systems and macros can access for interacting with the Simple Calendar module.
     */
    namespace SimpleCalendar {
        /**
         * The `SimpleCalendar.api` namespace contains functions and properties used to update the Simple Calendar module or get information from it.
         */
        namespace api {
            export { DateSelectorPositions };
            export { LeapYearRules };
            export { PredefinedCalendars as Calendars };
            export { Icons };
            export { MoonYearResetOptions };
            export { YearNamingRules };
            export { PresetTimeOfDay };
            export { GameWorldTimeIntegrations };
            export { NoteRepeat };
            export { CompactViewDateTimeControlDisplay };

            /**
             * This function is used to activate event listeners for calendars displayed with the {@link HandlebarHelpers.sc-full-calendar}.
             *
             * If being used in a FoundryVTT application or FormApplication it is best called in the activateListeners function.
             * @param calendarId The ID of the HTML element of the calendar to activate listeners for. This is the same ID used in the {@link HandlebarHelpers.sc-full-calendar}.
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
                onMonthChange: Function | null = null,
                onDayClick: Function | null = null
            ): void;

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
             * @param userVisibility Optional parameter to specify an array of user ID's who will have permission to view the note. The creator of the note will always have permission. Use `['default']` if you want all users to be able to view it.
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
            ): Promise<StoredDocument<JournalEntry> | null>;

            /**
             * Add a custom button to the right side of the calendar (When in full view). The button will be added below the Note Search button.
             *
             * @param buttonTitle The text that appears when the button is hovered over.
             * @param iconClass The Font Awesome Free icon class to use for the buttons display.
             * @param customClass A custom CSS class to add to the button.
             * @param showSidePanel If the button should open a side panel or not. A side panel functions like the notes list but will be completely empty.
             * @param onRender Function that is called to show information to users.
             *
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
            );

            /**
             * Advance the date and time to match the next preset time.
             *
             * **Important**: This function can only be run by users who have permission to change the date in Simple Calendar.
             * @param preset The preset time that is used to set the time of day.
             * @param calendarId Optional parameter specify the ID of the calendar to advance the time and date for. If not provided the current active calendar will be used.
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
            export function advanceTimeToPreset(preset: PresetTimeOfDay, calendarId: string = "active"): boolean;

            /**
             * Changes the current date of Simple Calendar.
             * **Important**: This function can only be run by users who have permission to change the date in Simple Calendar.
             * @param interval The interval objects properties are all optional so only those that are needed have to be set.<br/>Where each property is how many of that interval to change the current date by.
             * @param calendarId Optional parameter specify the ID of the calendar to change the date on. If not provided the current active calendar will be used.
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
            export function changeDate(interval: SimpleCalendar.DateTimeParts, calendarId: string = "active"): boolean;

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
            ): SimpleCalendar.DateTime;

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
            export function clockStatus(calendarId: string = "active"): SimpleCalendar.ClockStatus;

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
            ): Promise<boolean>;

            /**
             * Gets the current date and time for the current calendar or the passed in calendar.
             * @param calendarId Optional parameter to specify the ID of the calendar to get the current day from. If not provided the current active calendar will be used.
             *
             * @returns The current date and time. The month and day are index's and as such start at 0 instead of 1.  If the passed in calendar can't be found null will be returned.
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
            export function currentDateTime(calendarId: string = "active"): SimpleCalendar.DateTime | null;

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
            export function currentDateTimeDisplay(calendarId: string = "active"): SimpleCalendar.DateDisplayData | null;

            /**
             * Converts the passed in date to a timestamp.
             * @param date A date object (eg `{year:2021, month: 4, day: 12, hour: 0, minute: 0, seconds: 0}`) with the parameters set to the date that should be converted to a timestamp. Any missing parameters will default to the current date value for that parameter.<br/>**Important**: The month and day are index based so January would be 0 and the first day of the month will also be 0.
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
            export function dateToTimestamp(date: SimpleCalendar.DateTimeParts, calendarId: string = "active"): number;

            /**
             * Converts the passed in date/time into formatted date and time strings that match the configured date and time formats or the passed in format string.
             *
             * - Any missing date/time parameters will default to a value of 0.
             * - If the date/time parameters are negative, their value will be set to 0. The exception to this is the year parameter, it can be negative.
             * - If the date/time parameters are set to a value greater than possible (eg. the 20th month in a calendar that only has 12 months, or the 34th hour when a day can only have 24 hours) the max value will be used.
             *
             * @param date A date object (eg `{year:2021, month: 4, day: 12, hour: 0, minute: 0, seconds: 0}`) with the parameters set to the date and time that should be formatted.<br/>**Important**: The month and day are index based so January would be 0 and the first day of the month will also be 0.
             * @param format Optional format string to return custom formats for the passed in date and time.
             * @param calendarId Optional parameter to specify the ID of the calendar to use when converting a date to a formatted string. If not provided the current active calendar will be used.
             *
             * @returns If no format string is provided an object with the date and time formatted strings, as set in the configuration, will be returned. If a format is provided then a formatted string will be returned.
             *
             * @example
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
             * // Returns "31/12/2021 23:59:00 PM"
             * ```
             */
            export function formatDateTime(
                date: SimpleCalendar.DateTimeParts,
                format: string = "",
                calendarId: string = "active"
            ): string | { date: string; time: string };

            /**
             * Converts the passed in timestamp into formatted date and time strings that match the configured date and time formats or the passed in format string.
             *
             * @param timestamp The timestamp (in seconds) of the date to format.
             * @param format Optional format string to return custom formats for the passed in date and time.
             * @param calendarId Optional parameter to specify the ID of the calendar to use when converting a date to a formatted string. If not provided the current active calendar will be used.
             *
             * @returns If no format string is provided an object with the date and time formatted strings, as set in the configuration, will be returned. If a format is provided then a formatted string will be returned.
             *
             * @example
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
            export function formatTimestamp(
                timestamp: number,
                format: string = "",
                calendarId: string = "active"
            ): string | { date: string; time: string };

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
            export function getAllCalendars(): SimpleCalendar.CalendarData[];

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
            export function getAllMonths(calendarId: string = "active"): SimpleCalendar.MonthData[];

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
            export function getAllMoons(calendarId: string = "active"): SimpleCalendar.MoonData[];

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
            export function getAllSeasons(calendarId: string = "active"): SimpleCalendar.SeasonData[];

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
            export function getAllThemes(): { [themeId: string]: string };

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
            export function getAllWeekdays(calendarId: string = "active"): SimpleCalendar.WeekdayData[];

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
            export function getCurrentCalendar(): SimpleCalendar.CalendarData;

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
            export function getCurrentDay(calendarId: string = "active"): SimpleCalendar.DayData | null;

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
            export function getCurrentMonth(calendarId: string = "active"): SimpleCalendar.MonthData | null;

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
            export function getCurrentSeason(calendarId: string = "active"): SimpleCalendar.SeasonData;

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
            export function getCurrentTheme(): string;

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
            export function getCurrentWeekday(calendarId: string = "active"): SimpleCalendar.WeekdayData | null;

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
            export function getCurrentYear(calendarId: string = "active"): SimpleCalendar.YearData | null;

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
            export function getLeapYearConfiguration(calendarId: string = "active"): SimpleCalendar.LeapYearData | null;

            /**
             * Gets all notes that the current user is able to see for the specified calendar.
             *
             * @param calendarId Optional parameter to specify the ID of the calendar to get the notes from. If not provided the current active calendar will be used.
             *
             * @returns A list of [JournalEntries](https://foundryvtt.com/api/JournalEntry.html) that contain the note data.
             *
             * @example
             * ```javascript
             * // Returns an array of JournalEntry objects
             * SimpleCalendar.api.getNotes();
             *```
             */
            export function getNotes(calendarId: string = "active"): (StoredDocument<JournalEntry> | undefined)[];

            /**
             * Gets all notes that the current user is able to see for the specified date from the specified calendar.
             * @param year The year of the date to get the notes for.
             * @param month The index of the month to get the notes for.
             * @param day The index of the day to get the notes for.
             * @param calendarId Optional parameter to specify the ID of the calendar to get the notes from. If not provided the current active calendar will be used.
             *
             * @returns A list of [JournalEntries](https://foundryvtt.com/api/JournalEntry.html)  that contain the note data.
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
            ): (StoredDocument<JournalEntry> | undefined)[];

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
            export function getTimeConfiguration(calendarId: string = "active"): SimpleCalendar.TimeData | null;

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
            export function isOpen(): boolean;

            /**
             * Get if the current user is considered the primary GM or not.
             *
             * @returns If the current user is the primary GM.
             *
             * @example
             * ```javascript
             *
             * SimpleCalendar.api.isPrimaryGM(); //True or Flase depending on if the current user is primary gm
             *
             * ```
             */
            export function isPrimaryGM(): boolean;

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
            export function pauseClock(calendarId: string = "active"): boolean;

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
            export async function removeNote(journalEntryId: string): Promise<boolean>;

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
            export function runMigration(): void;

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
            ): (StoredDocument<JournalEntry> | undefined)[];

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
            export function secondsToInterval(seconds: number, calendarId: string = "active"): SimpleCalendar.DateTimeParts;

            /**
             * Will set the current date of the specified calendar to match the passed in date.
             * **Important**: This function can only be run by users who have permission to change the date in Simple Calendar.
             *
             * @param date A date object (eg `{year:2021, month: 4, day: 12, hour: 0, minute: 0, seconds: 0}`) with the parameters set to the date that the calendar should be set to. Any missing parameters will default to the current date value for that parameter.<br/>**Important**: The month and day are index based so January would be 0 and the first day of the month will also be 0.
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
            export function setDate(date: SimpleCalendar.DateTimeParts, calendarId: string = "active"): boolean;

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
            export async function setTheme(themeId: string): Promise<boolean>;

            /**
             * Will open up Simple Calendar to the current date, or the passed in date.
             *
             * @param date A date object (eg `{year:2021, month: 4, day: 12}`) with the year, month and day set to the date to be visible when the calendar is opened.<br/>**Important**: The month is index based so January would be 0.
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
            export function showCalendar(
                date: SimpleCalendar.DateTimeParts | null = null,
                compact: boolean = false,
                calendarId: string = "active"
            ): void;

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
            export function startClock(calendarId: string = "active"): boolean;

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
            export function stopClock(calendarId: string = "active"): boolean;

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
            export function timestamp(calendarId: string = "active"): number;

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
            export function timestampPlusInterval(
                currentSeconds: number,
                interval: SimpleCalendar.DateTimeParts,
                calendarId: string = "active"
            ): number;

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
            export function timestampToDate(seconds: number, calendarId: string = "active"): SimpleCalendar.DateData | null;
        }

        /**
         * Contains the interfaces associated with data that is used by any Handlebar template
         * @internal
         */
        namespace HandlebarTemplateData {
            interface Calendar extends IDataItemBase {
                calendarDisplayId: string;
                clockDisplayId: string;
                name: string;
                id: string;
                selectedDay: {
                    dateDisplay: string;
                    noteCount: number;
                    noteReminderCount: number;
                    notes: NoteStub[];
                };
                currentYear: Year;
                visibleDate: { year: number; month: number };
            }

            /**
             * Interface for the day template that is passed to the HTML for rendering
             */
            interface Day extends IDataItemBase {
                /** The display name of the day */
                name: string;
                /** The numeric representation of the day */
                numericRepresentation: number;
                /** If this day is the current day */
                current: boolean;
                /** If this day has been selected */
                selected: boolean;
            }

            interface GeneralSettings extends IDataItemBase {
                /** How Simple Calendar interacts with the game world time */
                gameWorldTimeIntegration: GameWorldTimeIntegrations;
                /** If to show the clock below the calendar */
                showClock: boolean;
                noteDefaultVisibility: boolean;
                postNoteRemindersOnFoundryLoad: boolean;
                /** If the Pathfinder 2e world clock sync is turned on */
                pf2eSync: boolean;
                /** Formats used for display date and time information */
                dateFormat: {
                    date: string;
                    time: string;
                    monthYear: string;
                };
                /** The different display options tied to the compact view. */
                compactViewOptions: {
                    /** How to display the date/time control buttons. */
                    controlLayout: CompactViewDateTimeControlDisplay;
                };
            }

            interface LeapYearTemplate extends IDataItemBase {
                rule: LeapYearRules;
                customMod: number;
                startingYear: number;
            }

            /**
             * Interface for the month template that is passed to the HTML for rendering
             */
            interface Month extends IDataItemBase {
                abbreviation: string;
                name: string;
                numericRepresentation: number;
                numericRepresentationOffset: number;
                current: boolean;
                visible: boolean;
                selected: boolean;
                days: Day[];
                numberOfDays: number;
                numberOfLeapYearDays: number;
                intercalary: boolean;
                intercalaryInclude: boolean;
                showAdvanced: boolean;
                startingWeekday: number | null;
            }

            /**
             * Interface for a moons template
             */
            interface Moon extends IDataItemBase {
                name: string;
                cycleLength: number;
                firstNewMoon: FirstNewMoonDate;
                phases: MoonPhase[];
                color: string;
                cycleDayAdjust: number;
                firstNewMoonDateSelectorId: string;
                firstNewMoonSelectedDate: DateTime;
            }

            /**
             * Interface for displaying the season information
             */
            interface Season extends IDataItemBase {
                name: string;
                description: string;
                startingMonth: number;
                startingDay: number;
                color: string;
                icon: Icons;
                startDateSelectorId: string;
                startDateSelectedDate: DateTime;
                sunriseSelectorId: string;
                sunriseSelectorSelectedDates: {
                    start: DateTime;
                    end: DateTime;
                };
            }

            interface UserPermissions extends IDataItemBase {
                /** Who can view the calendar */
                viewCalendar: PermissionMatrix;
                /** Who can add notes */
                addNotes: PermissionMatrix;
                /** Who can reorder notes */
                reorderNotes: PermissionMatrix;
                /** Who can change the date and time */
                changeDateTime: PermissionMatrix;
                /** Who can change the active calendar */
                changeActiveCalendar: PermissionMatrix;
                /** Which users can see the detailed time */
                viewExactTime: PermissionMatrix;
            }

            /**
             * Interface for the weekday template that is passed to the HTML for rendering
             */
            interface Weekday extends IDataItemBase {
                abbreviation: string;
                name: string;
                numericRepresentation: number;
                showAdvanced: boolean;
                restday: boolean;
            }

            /**
             * Interface for the year template that is passed to the HTML for rendering
             */
            interface Year extends IDataItemBase {
                yearZero: number;
                /** The numeric representation of the year */
                numericRepresentation: number;
                firstWeekday: number;
                yearNames: string[];
                yearNamesStart: number;
                yearNamingRule: YearNamingRules;
            }
        }

        /**
         * Contains the interfaces associated with the Simple Calendar date selector
         * @internal
         */
        namespace DateTimeSelector {
            /**
             * The list of initialized date/time selectors
             */
            interface SelectorList {
                [key: string]: DateSelector;
            }

            /**
             * The different configuration options that can be specified for initializing a date/time selector
             */
            interface Options {
                /** The calendar to use for generating the date selector */
                calendar?: Calendar;
                /** Function to be called when a date or dates have been selected */
                onDateSelect?: (selectedDates: SimpleCalendar.DateTimeSelector.SelectedDates) => void;
                /** Allow a range of dates to be selected */
                allowDateRangeSelection?: boolean;
                /** All for a range of time to be selected */
                allowTimeRangeSelection?: boolean;
                /** Is the year display number editable through an input */
                editYear?: boolean;
                /** How to open the date selector from the input box */
                position?: DateSelectorPositions;
                /** Show the year in the calendar display */
                showCalendarYear?: boolean;
                /** Show the date selection portion of the date/time selector */
                showDateSelector?: boolean;
                /** Show the time selector position of the date/time selector */
                showTimeSelector?: boolean;
                /** The selected starting date */
                selectedStartDate?: DateTime;
                /** The selected ending date */
                selectedEndDate?: DateTime;
                /** If a time has been selected */
                timeSelected?: boolean;
                /** The string to use as a delimiter between the date and time */
                timeDelimiter?: string;
                /** If to use the cloned calendar lists when generating this date delector */
                useCloneCalendars?: boolean;
            }

            /**
             * Dates used internally to a date/time selector to keep track of user interaction
             * @internal
             */
            interface Dates {
                /** The year/month that is currently visible in the date selector calendar */
                visible: DateTime;
                /** The selected start date/time of the date/time selector */
                start: DateTime;
                /** The selected end date/time of the date/time selector */
                end: DateTime;
                /** If the date is supposed to take place all day (no time has been selected yet) */
                allDay: boolean;
            }

            /**
             * The date(s) that have been selected from the date/time selector
             */
            interface SelectedDates {
                /** The start date/time of a date/time range, or if just a single date/time can be selected that date/time */
                startDate: DateTimeParts;
                /** The end date/time of a date/time range, or if just a single date/time this value will be the same as the start */
                endDate: DateTimeParts;
                /** If a time was selected or not */
                timeSelected: boolean;
            }
        }

        /**
         * Contains the interfaces associated with the Simple Calendar renderer
         * @internal
         */
        namespace Renderer {
            /**
             * The options that can be set for rendering a calendar display
             */
            export interface CalendarOptions {
                /** If to add in the arrows for changing the visible month */
                allowChangeMonth?: boolean;
                /** If to allow for the selecting of more than 1 day */
                allowSelectDateRange?: boolean;
                /** If to color the background to match the current seasons color */
                colorToMatchSeason?: boolean;
                /** Any custom css classes to add to the containing div */
                cssClasses?: string;
                /** The currently visible date */
                date?: SimpleCalendar.Date;
                /** If the year is a number input that can be changed */
                editYear?: boolean;
                /** The ID of the HTML element being added */
                id: string;
                /** The dates that are currently selected, if just single date mode use start */
                selectedDates?: {
                    /** The selected starting date */
                    start: SimpleCalendar.Date;
                    /** The selected ending date */
                    end: SimpleCalendar.Date;
                };
                /** If to highlight the current date for the calendar */
                showCurrentDate?: boolean;
                /** If to show more details about the day when it is right-clicked on */
                showDayDetails?: boolean;
                /** If to show the description popups */
                showDescriptions?: boolean;
                /** If to show the different moon phases on the calendar */
                showMoonPhases?: boolean;
                /** If to show any note counts on the calendar */
                showNoteCount?: boolean;
                /** If to show the season name */
                showSeasonName?: boolean;
                /** If to show the year */
                showYear?: boolean;
                /** The theme to use for rendering the calendar */
                theme?: string;
                /** The view of the calendar */
                view?: CalendarViews;
            }

            /**
             * The options that can be set for rendering the clock
             */
            export interface ClockOptions {
                /** The ID of the HTML element being added */
                id: string;
                /** Any custom css classes to add to the containing div */
                cssClasses?: string;
                /** The theme to use for rendering this clock */
                theme?: string;
            }

            /**
             * The options that can be set for rendering the time selector
             */
            export interface TimeSelectorOptions {
                /** The ID of the HTML element being added */
                id: string;
                /** If to allow the selection of a range of time */
                allowTimeRange?: boolean;
                /** This will disable the renderer's self updating after change. Will require the time selector to be updated externally to view changes. */
                disableSelfUpdate?: boolean;
                /** The selected time to show, if not using the time range just use the start */
                selectedTime?: {
                    /** The selected starting time */
                    start: SimpleCalendar.Time;
                    /** The selected ending time */
                    end: SimpleCalendar.Time;
                };
                /** The custom string to use as the delimiter between the time range inputs and display */
                timeDelimiter?: string;
                /** If to use clones of the calendars to pull data for the time selector, used in the configuration dialog */
                useCalendarClones?: boolean;
            }

            export interface MultiSelectOptions {
                /** The ID of the HTML element being added */
                id: string;
                /** The options of the select that can be chosen by a user */
                options: MultiSelectOption[];
            }

            export interface MultiSelectOption {
                value: string;
                text: string;
                selected: boolean;
                disabled?: boolean;
                static?: boolean;
                makeOthersMatch?: boolean;
            }

            export interface DateTimeControlOptions {
                showDateControls?: boolean;
                showTimeControls?: boolean;
                displayType?: CompactViewDateTimeControlDisplay;
                showPresetTimeOfDay?: boolean;
                fullDisplay?: {
                    unit: string;
                    unitText: string;
                    dateTimeUnitOpen: boolean;
                };

                largerSteps?: boolean;
                reverseTime?: boolean;
            }
        }

        /**
         * Contains the interfaces associated with the note search options
         * @internal
         */
        namespace Search {
            type Document = {
                id: string;
                content: string | string[];
            };
            type Term = {
                n: number;
                idf: number;
            };
            type DocumentTerm = {
                count: number;
                freq: number;
            };
            type ProcessedDocument = Document & {
                terms: Record<string, DocumentTerm>;
                termCount: number;
                tokens: string[];
                score: number;
            };

            export interface OptionsFields {
                date: boolean;
                title: boolean;
                details: boolean;
                author: boolean;
                categories: boolean;
            }
        }

        /**
         * Contains the interfaces associated with the Simple Calendar sockets
         * @internal
         */
        namespace SimpleCalendarSocket {
            /**
             * Interface for the data that is sent with each socket
             */
            export interface Data {
                type: SocketTypes;
                data:
                    | boolean
                    | Partial<MainAppUpdate>
                    | DateTimeChange
                    | TimeKeeperStatus
                    | Partial<Primary>
                    | Partial<NoteUpdate>
                    | Partial<EmitHook>
                    | Partial<SetActiveCalendar>;
            }

            type MainAppUpdate = {
                userId: string;
            };

            type DateTimeChange = {
                type: DateTimeChangeSocketTypes;
                interval: DateTimeParts;
                presetTimeOfDay?: PresetTimeOfDay;
            };

            type Primary = {
                primaryCheck: boolean;
                amPrimary: boolean;
            };

            type NoteUpdate = {
                journalId: string;
                userId: string;
                calendarId: string;
                date: DateTime;
                newOrder: string[];
            };

            type EmitHook = {
                hook: SimpleCalendarHooks;
                param: any;
            };

            type SetActiveCalendar = {
                calendarId: string;
            };
        }

        /**
         * Interface base for all data items
         * @internal
         */
        type IDataItemBase = {
            /** The unique ID of the data item */
            id: string;
            /** The optional name of the data item */
            name?: string;
            /** The optional numeric representation of the data item */
            numericRepresentation?: number;
            /** The optional description of the data item */
            description?: string;
            /** The abbreviated name of the data item. */
            abbreviation?: string;
            /** If to show the advanced options, this is not saved */
            showAdvanced?: boolean;
        };

        /**
         * Interface for information about the app windows position
         * @internal
         */
        interface AppPosition {
            /** The top most position of the window */
            top?: number;
            /** The left most position of the window */
            left?: number;
        }

        interface Theme {
            key: string;
            name: string;
            system: boolean;
            module: boolean;
            images?: Record<string, string>;
        }

        /**
         * @internal
         */
        type AddonButton = {
            title: string;
            iconClass: string;
            customClass: string;
            showSidePanel: boolean;
            onRender: (event: Event | null, renderTarget: HTMLElement | null | undefined) => void;
        };

        /**
         * Interface for Journal page data
         * @internal
         */
        interface JournalPageData {
            show: boolean;
            _id: string;
            name: string;
            type: string;
            text?: { content: string };
            src?: string;
            image?: { caption: string };
            video?: {
                autoplay: boolean;
                controls: boolean;
                height: null | number;
                loop: boolean;
                timestamp: number;
                volume: number;
                width: null | number;
            };
        }

        /**
         * Interface for all information about a calendar
         */
        interface CalendarData extends IDataItemBase {
            /** The current date of the calendar. */
            currentDate?: CurrentDateData;
            /** The general settings for the calendar. */
            general?: GeneralSettingsData;
            /** The leap year settings for the calendar. */
            leapYear?: LeapYearData;
            /** An array of month settings for each month of the calendar. */
            months?: MonthData[];
            /** An array of moon settings for each moon of the calendar. */
            moons?: MoonData[];
            /** An array of note categories for the calendar. */
            noteCategories?: NoteCategory[];
            /** An array of season settings for each season of the calendar. */
            seasons?: SeasonData[];
            /** The time settings for the calendar. */
            time?: TimeData;
            /** An array of weekday settings for each weekday of the calendar. */
            weekdays?: WeekdayData[];
            /** The year settings for the calendar. */
            year?: YearData;

            /**
             * @deprecated Please use {@link CalendarData.general} instead. This is to support importing loading of configurations created before version 2 of Simple Calendar.
             */
            generalSettings?: GeneralSettingsData;
            /**
             * @deprecated Please use {@link CalendarData.leapYear} instead. This is to support importing loading of configurations created before version 2 of Simple Calendar.
             */
            leapYearSettings?: LeapYearData;
            /**
             * @deprecated Please use {@link CalendarData.months} instead. This is to support importing loading of configurations created before version 2 of Simple Calendar.
             */
            monthSettings?: MonthData[];
            /**
             *
             * @deprecated Please use {@link CalendarData.moons} instead. This is to support importing loading of configurations created before version 2 of Simple Calendar.
             */
            moonSettings?: MoonData[];
            /**
             * @deprecated Please use {@link CalendarData.seasons} instead. This is to support importing loading of configurations created before version 2 of Simple Calendar.
             */
            seasonSettings?: SeasonData[];
            /**
             * @deprecated Please use {@link CalendarData.time} instead. This is to support importing loading of configurations created before version 2 of Simple Calendar.
             */
            timeSettings?: TimeData;
            /**
             * @deprecated Please use {@link CalendarData.weekdays} instead. This is to support importing loading of configurations created before version 2 of Simple Calendar.
             */
            weekdaySettings?: WeekdayData[];
            /**
             * @deprecated Please use {@link CalendarData.year} instead. This is to support importing loading of configurations created before version 2 of Simple Calendar.
             */
            yearSettings?: YearData;
        }

        /**
         * Interface for all client settings for the Simple Calendar module
         * @internal
         */
        interface ClientSettingsData extends IDataItemBase {
            /** The current visual theme of the Simple Calendar module. */
            theme: string;
            /** If the Simple Calendar module should open its window when the foundry is loaded. */
            openOnLoad: boolean;
            /** If the Simple Calendar module should open in compact mode */
            openCompact: boolean;
            /** If the Simple Calendar module should remember where it was last positioned. */
            rememberPosition: boolean;
            /** If the Simple Calendar module should remember where the compact view was last positioned. */
            rememberCompactPosition: boolean;
            /** The current position of the Simple Calendar module. */
            appPosition: AppPosition;
            /** How the user wants note reminder notifications to be displayed. */
            noteReminderNotification: NoteReminderNotificationType;
            /** The direction the side drawers open from the main application. */
            sideDrawerDirection: string;
            /** If the note list should always be open. */
            alwaysShowNoteList: boolean;
            /** If the calendar is always open (no close button) and the Toolbar button becomes a toggle. */
            persistentOpen: boolean;
            /** The scaling options for the compact view. */
            compactViewScale: number;
        }

        /**
         * Interface for indicating the current status of a real time clock in Simple Calendar
         */
        interface ClockStatus {
            /** If the clock is currently started and running. */
            started: boolean;
            /** If the clock is currently stopped and not running. */
            stopped: boolean;
            /** If the clock is currently paused. The clock will be paused if the pause button has been clicked, when the game is paused or the active scene has an active combat. */
            paused: boolean;
        }

        /**
         * Interface for all information about the current date of a calendar
         */
        interface CurrentDateData {
            /** The current year */
            year: number;
            /** The current month */
            month: number;
            /** The current day */
            day: number;
            /** The current time of day in seconds */
            seconds: number;
        }

        /**
         * Object containing all information about a date and time. This can either be the current date and time or the date and time calculated from a timestamp
         */
        interface DateData {
            /** The year for this date. */
            year: number;
            /** The index of the month in the year for this date. */
            month: number;
            /** The number of days that the months days are offset by. */
            dayOffset: number;
            /** The index of the day in the month for this date. */
            day: number;
            /** The day of the week the day falls on. */
            dayOfTheWeek: number;
            /** The hour portion of the time */
            hour: number;
            /** The minute portion of the time */
            minute: number;
            /** The second portion of the time */
            second: number;
            /** The year that is considered to be the starting year. This is the year used to base calculating timestamps from */
            yearZero: number;
            /** The timestamp of when the sun rises for this date. */
            sunrise: number;
            /** The timestamp of when the sun sets for this date. */
            sunset: number;
            /** The timestamp of when it is considered midday for this date. */
            midday: number;
            /** A list of weekday names. */
            weekdays: string[];
            /** If to show the weekday headings for the month. */
            showWeekdayHeadings: boolean;
            /** The season information for this date */
            currentSeason: SeasonData;
            /** If this date falls on a leap year. */
            isLeapYear: boolean;
            /** All the formatted strings for displaying this date */
            display: DateDisplayData;
        }

        /**
         * Object containing all formatted strings for displaying a date and time
         */
        interface DateDisplayData {
            /** The formatted date string based on the configuration display option for Date Format. */
            date: string;
            /** The numerical representation of the day. */
            day: string;
            /** The Ordinal Suffix associated with the day number (st, nd, rd or th) */
            daySuffix: string;
            /** The name of the weekday this date falls on. */
            weekday: string;
            /** The name of the month. */
            monthName: string;
            /** The numerical representation of the month. */
            month: string;
            /** The numerical representation of the year */
            year: string;
            /** The name of the year, if year names have been set up. */
            yearName: string;
            /** The prefix value for the year */
            yearPrefix: string;
            /** The postfix value for the year */
            yearPostfix: string;
            /** The formatted time string based on the configuration display option for Time Format. */
            time: string;
        }

        /**
         * Interface for all information about a day
         */
        interface DayData extends IDataItemBase {
            /** The name of the day, at the moment it is just the day number in string form. */
            name: string;
            /** The number associated with the day. */
            numericRepresentation: number;
        }

        /**
         * Interface for a moons first new moon date
         */
        interface FirstNewMoonDate {
            /** If and when the year of the new moon should be reset. {@link SimpleCalendar.api.MoonYearResetOptions | List of options}*/
            yearReset: MoonYearResetOptions;
            /** The year of the first new moon. */
            year: number;
            /** Reset the new moon year every X years. */
            yearX: number;
            /** The month of the first new moon. */
            month: number;
            /** The day of the first new moon. */
            day: number;
        }

        /**
         * Interface for all general settings for a calendar in the Simple Calendar module
         */
        interface GeneralSettingsData extends IDataItemBase {
            /** How Simple Calendar interacts with the game world time */
            gameWorldTimeIntegration: GameWorldTimeIntegrations;
            /** If to show the clock below the calendar */
            showClock: boolean;
            /** The default visibility for new notes added to the calendar */
            noteDefaultVisibility: boolean;
            /** If note reminders should be PM'd to players when they log into foundry */
            postNoteRemindersOnFoundryLoad: boolean;
            /** If the Pathfinder 2e world clock sync is turned on */
            pf2eSync: boolean;
            /** Formats used for display date and time information */
            dateFormat: {
                /** The format string used to display the date */
                date: string;
                /** The format string used to display the time */
                time: string;
                /** The format string used to display the month and year at the top of a calendar display */
                monthYear: string;
                /** Date and time format used when displaying the in game timestamp on chat messages */
                chatTime: string;
            };
            /** The different display options tied to the compact view. */
            compactViewOptions: {
                /** How to display the date/time control buttons. */
                controlLayout: CompactViewDateTimeControlDisplay;
            };
            /** @deprecated Old 'Players Can Add Notes' permission setting, only used for very old setting files */
            playersAddNotes?: boolean;
        }

        /**
         * Interface for all global configuration options that can be set in the Simple Calendar module
         * @internal
         */
        interface GlobalConfigurationData extends IDataItemBase {
            /** The current version of the module. */
            version: string;
            /** If calendars should use the same timestamp. */
            calendarsSameTimestamp: boolean;
            /** The rules around how the realtime clock is paused when a combat is started.  */
            combatPauseRule: CombatPauseRules;
            /** All the set permissions for users. */
            permissions: UserPermissions;
            /** How many seconds are in a combat round. */
            secondsInCombatRound: number;
            /** If to sync all time changes across each calendar. */
            syncCalendars: boolean;
            /** If to show the notes folder in the journal entries tab. */
            showNotesFolder: boolean;
            /** If to replace the timestamps on chat messages with the date/time they were said in world time rather than real time. */
            inGameChatTimestamp: boolean;
        }

        /**
         * Interface for all information about how leap years are set up
         */
        interface LeapYearData extends IDataItemBase {
            /** This is the leap year rule to follow. */
            rule: LeapYearRules;
            /** The number of years that a leap year happens when the rule is set to 'custom'. */
            customMod: number;
            /** The year to start calculating leap years from. */
            startingYear: number;
        }

        /**
         * Interface for all information about a month
         */
        interface MonthData extends IDataItemBase {
            /** The abbreviated name of the month. */
            abbreviation: string;
            /** The name of the month. */
            name: string;
            /** The description of the month. */
            description: string;
            /** The number associated with the display of this month. */
            numericRepresentation: number;
            /** The amount to offset day numbers by for this month. */
            numericRepresentationOffset: number;
            /** The number of days this month has during a non leap year. */
            numberOfDays: number;
            /** The number of days this month has during a leap year. */
            numberOfLeapYearDays: number;
            /** If this month is an intercalary month. */
            intercalary: boolean;
            /** If this month is intercalary then if its days should be included in total day calculations. */
            intercalaryInclude: boolean;
            /** The day of the week this month should always start on. */
            startingWeekday: number | null;
        }

        /**
         * Interface for all information about a moon
         */
        interface MoonData extends IDataItemBase {
            /** The name of the moon. */
            name: string;
            /** How many days it takes the moon to complete 1 cycle. */
            cycleLength: number;
            /** The moon phase for the current date. */
            currentPhase?: MoonPhase;
            /** The different phases of the moon. */
            phases: MoonPhase[];
            /** When the first new moon was. This is used to calculate the current phase for a given day. */
            firstNewMoon: FirstNewMoonDate;
            /** The color associated with the moon. */
            color: string;
            /** A way to nudge the cycle calculations to align with correct dates. */
            cycleDayAdjust: number;
        }

        /**
         * Interface for all information about a moon phase
         */
        interface MoonPhase {
            /** The name of the phase. */
            name: string;
            /** How many days of the cycle this phase takes up. */
            length: number;
            /** If this phase should only take place on a single day. */
            singleDay: boolean;
            /** The icon to associate with this moon phase. */
            icon: Icons;
        }

        interface NoteData {
            calendarId: string;
            startDate: DateTime;
            endDate: DateTime;
            allDay: boolean;
            repeats: NoteRepeat;
            order: number;
            categories: string[];
            remindUsers: string[];
            fromPredefined?: boolean;
            macro?: string;
        }

        /**
         * Interface for all information about note categories
         */
        interface NoteCategory extends IDataItemBase {
            /** The name of the note category. */
            name: string;
            /** The background color assigned to the note category. */
            color: string;
            /** The color of the text assigned to the note category. */
            textColor: string;
        }

        /**
         * Interface for all permissions that can be set within Simple Calendar
         * @internal
         */
        interface UserPermissionsData extends IDataItemBase {
            /** Who can view the calendar */
            viewCalendar: PermissionMatrix;
            /** Who can add notes */
            addNotes: PermissionMatrix;
            /** Who can reorder notes */
            reorderNotes: PermissionMatrix;
            /** Who can change the date and time */
            changeDateTime: PermissionMatrix;
            /** Who can change the active calendar */
            changeActiveCalendar: PermissionMatrix;
            /** Which users can see the detailed time */
            viewExactTime: PermissionMatrix;
        }

        /**
         * Which class of users are allowed to access a specific permissions
         * @internal
         */
        interface PermissionMatrix {
            /** Users set as players. */
            player: boolean;
            /** Users set as trusted players */
            trustedPlayer: boolean;
            /** Users set as assistant game masters */
            assistantGameMaster: boolean;
            /** A list of specific user ID's */
            users?: string[];
        }

        /**
         * Interface for all information about a season
         */
        interface SeasonData extends IDataItemBase {
            /** The name of the season. */
            name: string;
            /** The description of the season. */
            description: string;
            /** The month this season starts on */
            startingMonth: number;
            /** The day of the starting month this season starts on */
            startingDay: number;
            /** The time, in seconds, that the sun rises */
            sunriseTime: number;
            /** The time, in seconds, that the sun sets */
            sunsetTime: number;
            /** The color of the season */
            color: string;
            /** The icon associated with the season */
            icon: Icons;
            /**
             * The custom color for the season
             * @deprecated This is no longer used
             */
            customColor?: string;
        }

        /**
         * Interface for all information about time
         */
        interface TimeData extends IDataItemBase {
            /** The number of hours in a single day. */
            hoursInDay: number;
            /** The number of minutes in a single hour. */
            minutesInHour: number;
            /** The number of seconds in a single minute. */
            secondsInMinute: number;
            /** When running the clock for every second that passes in the real world how many seconds pass in game. */
            gameTimeRatio: number;
            /** If to start/stop the clock when the game is unpaused/paused. */
            unifyGameAndClockPause: boolean;
            /** How often (in real world seconds) to update the time while the clock is running. */
            updateFrequency: number;
        }

        /**
         * Interface for all information about a weekday
         */
        interface WeekdayData extends IDataItemBase {
            /** The abbreviated name of the weekday. */
            abbreviation: string;
            /** The name of the weekday. */
            name: string;
            /** The description of the weekday. */
            description: string;
            /** The number representing the weekday. */
            numericRepresentation: number;
            /** If this weekday is considered a rest day */
            restday: boolean;
        }

        /**
         * Interface for all information about a year
         */
        interface YearData extends IDataItemBase {
            /** The number representing the year. */
            numericRepresentation: number;
            /** A string to append to the beginning of a year's number. */
            prefix: string;
            /** A string to append to the end of a year's number. */
            postfix: string;
            /** If to show weekday headings on the calendar. */
            showWeekdayHeadings: boolean;
            /** The day of the week the first day of the first month of year zero starts on. */
            firstWeekday: number;
            /** What is considered to be the first year when calculating timestamps. */
            yearZero: number;
            /** A list of names to use for years. */
            yearNames: string[];
            /** The year to start applying the year names. */
            yearNamesStart: number;
            /** How to calculate what year name to give to a year. */
            yearNamingRule: YearNamingRules;
        }

        /**
         * @internal
         */
        interface NoteRepeats {
            [index: number]: string;
            0: string;
            1?: string;
            2?: string;
            3?: string;
        }

        /**
         * Type representing a date within Simple Calendar
         */
        type Date = {
            /** The year value of the date. */
            year: number;
            /** The month value of the date. The month is index based, meaning the first month of a year will have a value of 0. */
            month: number;
            /** The day value of the date. The day is index based, meaning the first day of the month will have a value of 0. */
            day: number;
        };

        /**
         * Type representing a time within Simple Calendar
         */
        type Time = {
            /** The hour value of the time. */
            hour: number;
            /** The minute value of the time. */
            minute: number;
            /** The second value of the time. */
            seconds: number;
        };

        /**
         * Type representing a date and time
         */
        type DateTime = Date & Time;

        /**
         * Type representing a date and time with optional parameters
         */
        type DateTimeParts = Partial<Date> & Partial<Time>;

        /**
         * @internal
         */
        type DateChangeOptions = {
            showWarning?: boolean;
            updateMonth?: boolean;
            save?: boolean;
            sync?: boolean;
            updateApp?: boolean;
            fromCalSync?: boolean;
            bypassPermissionCheck?: boolean;
        };
    }

    /**
     * The Simple Calendar module comes with some built in Handlebar helpers that can be used by other modules/systems to display information in areas other than in the Simple Calendar module.
     */
    enum HandlebarHelpers {
        /**
         * This handlebar helper is used to generate the HTML for displaying a full calendar view for the current date or a passed in date.
         *
         * @remarks
         * Don't forget to call the {@link SimpleCalendar.api.activateFullCalendarListeners} function for any calendars that should be interactive. Static displays do not need to call this function.
         * A unique ID is required to ensure proper functionality of a Calendar added with this Handlebar helper.
         * <br/><br/>
         *
         * **Parameters**
         *
         * - **allowChangeMonth:** *boolean* = true<br/>If to allow months to be changed on this display.<br/><br/>
         * - **colorToMatchSeason:** *boolean* = true<br/>If to color the background of the calendar to match the color of the season the date falls on.<br/><br/>
         * - **cssClasses:** *string* = ""<br/>Any custom CSS classes to add to the wrapper div around the calendar.<br/><br/>
         * - **date:** *boolean* = true<br/>The year and the month index to display for the full calendar view.<br/><br/>
         * - **id:** *string* = ""<br/>The unique ID to set in the calendar HTML.<br/><br/>
         * - **showCurrentDate:** *boolean* = true<br/>If to highlight the current date on the calendar.<br/><br/>
         * - **showDescriptions:** *boolean* = true<br/>If to show the description pop ups for months,weekdays,seasons that have a description.<br/><br/>
         * - **showSeasonName:** *boolean* = true<br/>If to show the season name in the calendar view.<br/><br/>
         * - **showNoteCount:** *boolean* = true<br/>If to show the indicator for notes on the days being displayed.<br/><br/>
         * - **showMoonPhases:** *boolean* = true<br/>If to show the moon phases for the days being displayed.<br/><br/>
         * - **showYear:** *boolean* = true<br/>If to show the year in the header text of the full calendar.<br/><br/>
         * - **theme:** *string* = "auto"<br/>The theme you want the calendar to have. 'auto' means the theme will match what ever theme the current user has selected, 'none' means no theme will be applied, 'dark', 'light', 'classic' will apply that specific theme to the calendar.
         *
         * You can customize the calendars theme, how it looks, to be anything you like if you follow these steps:
         * - Set the theme parameter to 'none'.
         * - wrap them handlebar helper in a div with the 'simple-calendar' class (if you wish to keep the same structure for the calendar) `<div class="simple-calendar"></div>`
         * - Create your custom CSS
         *
         * **Examples**:
         *
         * Assuming the Gregorian calendar with a current date of December 15th, 2021 for all examples.
         *
         * @example Default
         * ```html
         * {{sc-full-calendar id='custom_id'}}
         * ```
         * ![Default Example](media://sc-full-calendar-example-default.png)
         *
         * @example All Options Disabled
         * ```html
         * {{sc-full-calendar id='custom_id' colorToMatchSeason=false showCurrentDate=false showSeasonName=false showNoteCount=false showMoonPhases= false showYear=false}}
         * ```
         * ![All Disabled Example](media://sc-full-calendar-example-all-disabled.png)
         *
         * @example Specific Date Set
         *
         * Assumes that there is a variable called newDate that looks like this:
         * ```javascript
         * let newDate = {
         *     year: 1999,
         *     month: 5
         * };
         * ```
         * ```html
         * {{sc-full-calendar id='custom_id' date=newDate }}
         * ```
         * ![Specific Date Example](media://sc-full-calendar-example-set-date.png)
         *
         * @example Specified Theme
         *
         * This forces the theme to be the light theme for this calendar, regardless of what the current users preferred Simple Calendar theme is set too.
         * ```html
         * {{sc-full-calendar id='custom_id' theme='light' }}
         * ```
         * ![Set Theme Example](media://sc-full-calendar-example-set-theme.png)
         */
        "sc-full-calendar",
        /**
         * This handlebar helper is used to generate the interactive date/time selector tool used throughout Simple Calendar. The date selector will match the configured calendar allowing for a very easy way to choose a date and/or time.
         *
         * **Parameters**
         *
         * - **allowDateRangeSelection:** *boolean* = false<br/>If true will allow a range of dates to be selected on the calendar. If false only a single date can be chosen.<br/><br/>
         * - **allowTimeRangeSelection:** *boolean* = false<br/>If true will allow a start and end time to be chosen. If false only a single time can be selected.<br/><br/>
         * - **onDateSelect:** *null | Function* = null<br/>This is the function to call with the results of a date/time being selected in the date selector. The function will be passed a [Date Selector Result](#date-selector-result) object with the selected date(s) set.<br/><br/>
         * - **position:** *boolean* = true<br/>How to position the date selector when it is opened from the input.<br/><br/>
         * - **selectedEndDate:** *boolean* = true<br/>This is used for the ending date and/or time that is selected in the date selector. In single date/time mode this value is ignored.<br/><br/>
         * - **selectedStartDate:** *boolean* = true<br/>This is used for the starting date and/or time that is selected in the date selector.<br/><br/>
         * - **showCalendarYear:** *boolean* = true<br/>If true the year will be shown at the top of the calendar display for the date selector. If false the year will not be shown.<br/><br/>
         * - **showDateSelector:** *boolean* = true<br/>If true the calendar will be shown to allow for the selection of one or more dates. If false the calendar will not be shown.<br/><br/>
         * - **showTimeSelector:** *boolean* = true<br/>If true the inputs for selecting a time or range of time will be shown. If false  the time selection inputs will not be shown.<br/><br/>
         * - **timeDelimiter:** *string* = "-"<br/>This is the text that is used between the start and end time of a time range.<br/><br/>
         * - **timeSelected:** *boolean* = true<br/>If a time or time range have been selected. If true the time inputs will appear filled with the selected times. If false the "Add Time" button will appear.<br/><br/>
         *
         * **Styling**:
         *
         * To use the default styles for the date selector be sure to add the class `simple-calendar` to the div that contains this handlebar helper. If this is not included then you will be responsible for creating the styles for the date selector.
         *
         * **Examples**:
         */
        //"sc-date-selector",
        /**
         * This handlebar helper is used to generate the HTML for displaying a clock view for the current time of the specified calendar.
         *
         * @remarks The clock does not automatically update. Listening to the {@link SimpleCalendar.Hooks.DateTimeChange} hook would allow you to refresh the clock display.
         *
         * **Parameters**
         *
         * - **id:** *string* = ""<br/>The unique ID to set in the clock HTML.<br/><br/>
         * - **calendarId:** *string* = ""<br/>The ID of the calendar to get the time from. If no ID is provided the current active calendar will be used.<br/><br/>
         * - **theme:** *string* = "auto"<br/>The theme you want the clock to have. 'auto' means the theme will match what ever theme the current user has selected, 'none' means no theme will be applied, 'dark', 'light', 'classic' will apply that specific theme to the clock.
         *
         * You can customize the clocks theme, how it looks, to be anything you like if you follow these steps:
         * - Set the theme parameter to 'none'.
         * - wrap them handlebar helper in a div with the 'simple-calendar' class (if you wish to keep the same structure for the calendar) `<div class="simple-calendar"></div>`
         * - Create your custom CSS
         *
         * **Examples**:
         *
         * @example Default Display
         * ```html
         * {{sc-clock id='unique_id' }}
         * ```
         * ![Clock](media://sc-clock-example.png)
         *
         * @example Specified Theme
         *
         * This forces the theme to be the light theme for the clock, regardless of what the current users preferred Simple Calendar theme is set too.
         * ```html
         * {{sc-clock id='unique_id' theme='light'}}
         * ```
         * ![Clock Set Theme](media://sc-clock-example-set-theme.png)
         *
         * @example Specific Calendar
         * ```html
         * {{sc-clock id='unique_id' calendarId='b74474f7' }}
         * ```
         */
        "sc-clock",
        /**
         * This handlebar helper is used to render one of the icons included with Simple Calendar.
         *
         * **Parameters**
         *
         * - **name:** *{@link SimpleCalendar.api.Icons}*<br/>Which icon to display.<br/><br/>
         * - **stroke:** *string* = "#000000"<br/>The HEX color to set the stroke of the icons SVG.<br/><br/>
         * - **fill:** *string* = "#000000"<br/>The HEX color to set the fill of the icons SVG.<br/><br/>
         *
         * @example Display an Icon
         * ```html
         * {{sc-icon name='clock' }}
         * ```
         * ![Display an Icon](media://sc-icon-example-default.png)
         *
         * @example Display a custom colored Icon
         * ```html
         * {{sc-icon name='clock' fill='#ff0000' stroke='#ff0000' }}
         * ```
         * ![Display a custom colored Icon](media://sc-icon-example-color.png)
         */
        "sc-icon"
    }
}
