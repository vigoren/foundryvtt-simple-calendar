---
id: "SimpleCalendar.api"
title: "Namespace: api"
sidebar_label: "api"
custom_edit_url: null
pagination_next: null
pagination_prev: null
---

[SimpleCalendar](SimpleCalendar.md).api

The `SimpleCalendar.api` namespace contains functions and properties used to update the Simple Calendar module or get information from it.

## Enumerations

- [Calendars](../enums/SimpleCalendar.api.Calendars.md)
- [CompactViewDateTimeControlDisplay](../enums/SimpleCalendar.api.CompactViewDateTimeControlDisplay.md)
- [GameWorldTimeIntegrations](../enums/SimpleCalendar.api.GameWorldTimeIntegrations.md)
- [Icons](../enums/SimpleCalendar.api.Icons.md)
- [LeapYearRules](../enums/SimpleCalendar.api.LeapYearRules.md)
- [MoonYearResetOptions](../enums/SimpleCalendar.api.MoonYearResetOptions.md)
- [NoteRepeat](../enums/SimpleCalendar.api.NoteRepeat.md)
- [PresetTimeOfDay](../enums/SimpleCalendar.api.PresetTimeOfDay.md)
- [YearNamingRules](../enums/SimpleCalendar.api.YearNamingRules.md)

## Functions

### activateFullCalendarListeners

▸ **activateFullCalendarListeners**(`calendarId`, `onMonthChange?`, `onDayClick?`): `void`

This function is used to activate event listeners for calendars displayed with the [sc-full-calendar](../enums/HandlebarHelpers.md#sc-full-calendar).

If being used in a FoundryVTT application or FormApplication it is best called in the activateListeners function.

**`Example`**

```javascript
SimpleCalendar.api.activateFullCalendarListeners('example_1');
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `calendarId` | `string` | `undefined` | The ID of the HTML element of the calendar to activate listeners for. This is the same ID used in the [sc-full-calendar](../enums/HandlebarHelpers.md#sc-full-calendar). |
| `onMonthChange` | ``null`` \| `Function` | `null` | Optional function to be called when the month being viewed has changed. Returned parameters to the function are:<br/> - The direction moved, previous or next.<br/> - The options used to render the calendar, which includes the date being shown. |
| `onDayClick` | ``null`` \| `Function` | `null` | Optional function to be called when a day is clicked. Returned parameters to the function are:<br/>- The options used to render the calendar, which includes the selected date. |

#### Returns

`void`

___

### addNote

▸ **addNote**(`title`, `content`, `startDate`, `endDate`, `allDay`, `repeats?`, `categories?`, `calendarId?`, `macro?`, `userVisibility?`, `remindUsers?`): `Promise`\<`StoredDocument`\<`JournalEntry`\> \| ``null``\>

This function adds a new note to the calendar

**`Example`**

```javascript
const newJournal = await SimpleCalendar.api.addNote('Christmas Day','Presents!', {year: 2022, month: 11, day: 24, hour: 0, minute: 0, seconds: 0}, {year: 2022, month: 11, day: 24, hour: 0, minute: 0, seconds: 0}, true, SimpleCalendar.api.NoteRepeat.Yearly, ['Holiday']);
// Will create a new note on Christmas day of 2022 that lasts all day and repeats yearly.
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `title` | `string` | `undefined` | The title of the new note |
| `content` | `string` | `undefined` | The contents of the new note |
| `startDate` | [`DateTimeParts`](SimpleCalendar.md#datetimeparts) | `undefined` | The date and time the note starts, if any date or time properties are missing the current date/time values will be used. |
| `endDate` | [`DateTimeParts`](SimpleCalendar.md#datetimeparts) | `undefined` | The date and time the note ends (can be the same as the start date), if any date or time properties are missing the current date/time values will be used. |
| `allDay` | `boolean` | `undefined` | If the note lasts all day or if it has a specific time duration. Whether to ignore the time portion of the start and end dates. |
| `repeats` | [`NoteRepeat`](../enums/SimpleCalendar.api.NoteRepeat.md) | `NoteRepeat.Never` | If the note repeats and how often it does |
| `categories` | `string`[] | `[]` | A list of note categories to assign to this note |
| `calendarId` | `string` | `"active"` | Optional parameter to specify the ID of the calendar to add the note too. If not provided the current active calendar will be used. |
| `macro` | ``null`` \| `string` | `null` | The ID of the macro that this note should execute when the in game time meets or exceeds the note time. Or null if no macro should be executed. |
| `userVisibility` | `string`[] | `[]` | Optional parameter to specify an array of user ID's who will have permission to view the note. The creator of the note will always have permission. Use `['default']` if you want all users to be able to view it. |
| `remindUsers` | `string`[] | `[]` | Optional parameter to provide an array of user ID's who will be reminded of the note. |

#### Returns

`Promise`\<`StoredDocument`\<`JournalEntry`\> \| ``null``\>

The newly created JournalEntry that contains the note data, or null if there was an error encountered.

___

### addSidebarButton

▸ **addSidebarButton**(`buttonTitle`, `iconClass`, `customClass`, `showSidePanel`, `onRender`): `any`

Add a custom button to the right side of the calendar (When in full view). The button will be added below the Note Search button.

**`Example`**

```javascript
// Function to call to populate the side panel
function populateSidePanel(event, element){
    if(element){
           const header = document.createElement('h2');
           header.innerText = "My Custom Button";
           element.append(header);
       }
}

// Function to call when the button is clicked
function sidePanelButtonClick(event, element){
    if(event){
         const dialog = new Dialog({
            title: "My Module",
            content: "You clicked the button!",
            buttons:{
                awesome: {
                    icon: '<i class="fa-solid fa-face-smile"></i>',
                    label: "Awesome!"
                }
            },
            default: "awesome"
        });
        dialog.render(true);
    }
}

// Adding a button that should show a side panel
// Clicking the button will show a side panel that will have the title "My Custom Button"
SimpleCalendar.api.addSidebarButton("My Module", "fa-computer-mouse", "my-custom-class", true, populateSidePanel);

// Adding a button that will show a dialog when clicked
SimpleCalendar.api.addSidebarButton("My Module", "fa-computer-mouse", "my-custom-class", false, sidePanelButtonClick);

```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `buttonTitle` | `string` | The text that appears when the button is hovered over. |
| `iconClass` | `string` | The Font Awesome Free icon class to use for the buttons display. |
| `customClass` | `string` | A custom CSS class to add to the button. |
| `showSidePanel` | `boolean` | If the button should open a side panel or not. A side panel functions like the notes list but will be completely empty. |
| `onRender` | (`event`: ``null`` \| `Event`, `renderTarget`: `undefined` \| ``null`` \| `HTMLElement`) => `void` | Function that is called to show information to users. If the showSidePanel parameter is true this function will be passed an HTMLElement representing the side panel. The element could potentially be null so code should account for that. This function is then responsible for populating the side panel with any information. This function is called everytime the calendar is rendered. If the showSidePanel parameter is false this function will be passed an Event for the click. The event could potentially be null so code should account for that. This function should then open up an application or dialog or perform an action for the user. This function is called everytime the button is clicked. |

#### Returns

`any`

___

### advanceTimeToPreset

▸ **advanceTimeToPreset**(`preset`, `calendarId?`): `boolean`

Advance the date and time to match the next preset time.

**Important**: This function can only be run by users who have permission to change the date in Simple Calendar.

**`Example`**

```javascript
//Assuming the current time is 11am, set the time to the next sunset
//Will result in the date staying the same but the time changing to 6pm
SimpleCalendar.api.advanceTimeToPreset(SimpleCalendar.api.PresetTimeOfDay.Sunset);

//Assuming the current time is 11am, set the time to the next sunrise
//Will result in the date advancing by 1 day and the time changing to 6am
SimpleCalendar.api.advanceTimeToPreset(SimpleCalendar.api.PresetTimeOfDay.Sunrise);
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `preset` | [`PresetTimeOfDay`](../enums/SimpleCalendar.api.PresetTimeOfDay.md) | `undefined` | The preset time that is used to set the time of day. |
| `calendarId` | `string` | `"active"` | Optional parameter specify the ID of the calendar to advance the time and date for. If not provided the current active calendar will be used. |

#### Returns

`boolean`

True if the date was set successfully, false if it was not.

___

### changeDate

▸ **changeDate**(`interval`, `calendarId?`): `boolean`

Changes the current date of Simple Calendar.
**Important**: This function can only be run by users who have permission to change the date in Simple Calendar.

**`Example`**

```javascript
//Assuming a date of June 1, 2021 and user has permission to change the date
SimpleCalendar.api.changeDate({day: 1}); // Will set the new date to June 2, 2021

//Assuming a date of June 1, 2021 and user has permission to change the date
SimpleCalendar.api.changeDate({day: -1}); // Will set the new date to May 31, 2021

//Assuming a date of June 1, 2021 10:00:00 and user has permission to change the date
SimpleCalendar.api.changeDate({year: 1, month: 1, day: 1, hour: 1, minute: 1, seconds: 1}); // Will set the new date to July 2, 2022 11:01:01

//Assuming a date of June 1, 2021 10:00:00 and user has permission to change the date
SimpleCalendar.api.changeDate({seconds: 3600}); // Will set the new date to June 1, 2021 11:00:00
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `interval` | [`DateTimeParts`](SimpleCalendar.md#datetimeparts) | `undefined` | The interval objects properties are all optional so only those that are needed have to be set.<br/>Where each property is how many of that interval to change the current date by. |
| `calendarId` | `string` | `"active"` | Optional parameter specify the ID of the calendar to change the date on. If not provided the current active calendar will be used. |

#### Returns

`boolean`

True if the date change was successful and false if it was not.

___

### chooseRandomDate

▸ **chooseRandomDate**(`startingDate?`, `endingDate?`, `calendarId?`): [`DateTime`](SimpleCalendar.md#datetime)

Will choose a random date between the 2 passed in dates, or if no dates are passed in will choose a random date.

**`Example`**

```javascript
SimpleCalendar.api.chooseRandomDate({year: 2021, month: 3, day: 0}, {year: 2021, month: 5, day: 1})

// {
//     day: 1
//     hour: 12
//     minute: 5
//     month: 4
//     seconds: 41
//     year: 2021
// }

SimpleCalendar.api.chooseRandomDate({year: 1900, month: 3}, {year: 2021, month: 5})
// {
//     day: 19
//     hour: 8
//     minute: 16
//     month: 3
//     seconds: 25
//     year: 1982
// }

SimpleCalendar.api.chooseRandomDate();
// {
//     day: 11
//     hour: 0
//     minute: 49
//     month: 8
//     seconds: 37
//     year: 3276
// }
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `startingDate` | [`DateTimeParts`](SimpleCalendar.md#datetimeparts) | `{}` | The start date objects properties are all optional so only those needed have to be set.<br/>Where each property is the earliest date to be chosen when randomly selecting a date.<br/>The month and day properties are both index's so January would be 0 and the first day of the month is also 0. |
| `endingDate` | [`DateTimeParts`](SimpleCalendar.md#datetimeparts) | `{}` | The end date objects properties are all optional so only those needed have to be set.<br/>Where each property is the latest date to be chosen when randomly selecting a date.<br/>The month and day properties are both index's so January would be 0 and the first day of the month is also 0. |
| `calendarId` | `string` | `"active"` | Optional parameter to specify the ID of the calendar to choose the random date from. If not provided the current active calendar will be used. |

#### Returns

[`DateTime`](SimpleCalendar.md#datetime)

A full date and time, where all properties will be randomly set. The month and day properties will be the index of the month/day chosen.

___

### clockStatus

▸ **clockStatus**(`calendarId?`): [`ClockStatus`](../interfaces/SimpleCalendar.ClockStatus.md)

Get the current status of the built-in clock for the specified calendar in Simple Calendar

**`Example`**

```javascript
const status = SimpleCalendar.api.clockStatus();
console.log(status); // {started: false, stopped: true, paused: false}
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `calendarId` | `string` | `"active"` | Optional parameter to specify the ID of the calendar to check its clock status. If not provided the current active calendar will be used. |

#### Returns

[`ClockStatus`](../interfaces/SimpleCalendar.ClockStatus.md)

The clock status for the specified calendar.

___

### configureCalendar

▸ **configureCalendar**(`calendarData`, `calendarId?`): `Promise`\<`boolean`\>

Sets up the current calendar to match the passed in configuration. This function can only be run by GMs.

**`Example`**

```javascript

//Set the calendar configuration to the Gregorian calendar
const result = await SimpleCalendar.api.configureCalendar(SimpleCalendar.api.Calendars.Gregorian);

//Set the calendar configuration to a custom calendar
const custom = {};

const result = await SimpleCalendar.api.configureCalendar(custom);
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `calendarData` | [`Calendars`](../enums/SimpleCalendar.api.Calendars.md) \| [`CalendarData`](../interfaces/SimpleCalendar.CalendarData.md) | `undefined` | The configuration to set the calendar to. It can be one of the predefined calendars or a [CalendarData](../interfaces/SimpleCalendar.CalendarData.md) object representing a custom calendar. |
| `calendarId` | `string` | `"active"` | Optional parameter to specify the ID of the calendar to configure. If not provided the current active calendar will be used. |

#### Returns

`Promise`\<`boolean`\>

A promise that resolves to a boolean value, true if the change was successful and false if it was not.

___

### currentDateTime

▸ **currentDateTime**(`calendarId?`): [`DateTime`](SimpleCalendar.md#datetime) \| ``null``

Gets the current date and time for the current calendar or the passed in calendar.

**`Example`**

```javascript
// Assuming a Gregorian calendar
SimpleCalendar.api.currentDateTime();
//Returns a DateTime object like this
// {
//     year: 2021,
//     month: 11,
//     day: 24,
//     hour: 12,
//     minute: 13,
//     seconds: 14
// }
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `calendarId` | `string` | `"active"` | Optional parameter to specify the ID of the calendar to get the current day from. If not provided the current active calendar will be used. |

#### Returns

[`DateTime`](SimpleCalendar.md#datetime) \| ``null``

The current date and time. The month and day are index's and as such start at 0 instead of 1.  If the passed in calendar can't be found null will be returned.

___

### currentDateTimeDisplay

▸ **currentDateTimeDisplay**(`calendarId?`): [`DateDisplayData`](../interfaces/SimpleCalendar.DateDisplayData.md) \| ``null``

Gets the formatted display data for the current date and time of the active calendar, or the calendar with the passed in ID.

**`Example`**

```javascript
// Assuming a Gregorian calendar
SimpleCalendar.api.currentDateTimeDisplay();
//Returns a DateTime object like this
// {
//     date: "June 01, 2021",
//     day: "1",
//     daySuffix: "st",
//     month: "6",
//     monthName: "June",
//     time: "00:00:00",
//     weekday: "Tuesday",
//     year: "2021",
//     yearName: "",
//     yearPostfix: "",
//     yearPrefix: ""
// }
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `calendarId` | `string` | `"active"` | Optional parameter to specify the ID of the calendar to get the current day from. If not provided the current active calendar will be used. |

#### Returns

[`DateDisplayData`](../interfaces/SimpleCalendar.DateDisplayData.md) \| ``null``

All the formatted display strings for the current date and time. Or if the passed in calendar can't be found, null.

___

### dateToTimestamp

▸ **dateToTimestamp**(`date`, `calendarId?`): `number`

Converts the passed in date to a timestamp.

**`Example`**

```javascript
SimpleCalendar.api.dateToTimestamp({}); //Returns the timestamp for the current date

SimpleCalendar.api.dateToTimestamp({year: 2021, month: 0, day: 0, hour: 1, minute: 1, seconds: 0}); //Returns 1609462860
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `date` | [`DateTimeParts`](SimpleCalendar.md#datetimeparts) | `undefined` | A date object (eg `{year:2021, month: 4, day: 12, hour: 0, minute: 0, seconds: 0}`) with the parameters set to the date that should be converted to a timestamp. Any missing parameters will default to the current date value for that parameter.<br/>**Important**: The month and day are index based so January would be 0 and the first day of the month will also be 0. |
| `calendarId` | `string` | `"active"` | Optional parameter to specify the ID of the calendar to use when converting a date to a timestamp. If not provided the current active calendar will be used. |

#### Returns

`number`

The timestamp for that date.

___

### formatDateTime

▸ **formatDateTime**(`date`, `format?`, `calendarId?`): `string` \| \{ `date`: `string` ; `time`: `string`  }

Converts the passed in date/time into formatted date and time strings that match the configured date and time formats or the passed in format string.

- Any missing date/time parameters will default to a value of 0.
- If the date/time parameters are negative, their value will be set to 0. The exception to this is the year parameter, it can be negative.
- If the date/time parameters are set to a value greater than possible (eg. the 20th month in a calendar that only has 12 months, or the 34th hour when a day can only have 24 hours) the max value will be used.

**`Example`**

```javascript
// Assuming that the default date and time formats are in place
// Date: Full Month Name Day, Year
// Time: 24Hour:Minute:Second

SimpleCalendar.api.formatDateTime({year: 2021, month: 11, day: 24, hour: 12, minute: 13, seconds: 14});
// Returns {date: 'December 25, 2021', time: '12:13:14'}

SimpleCalendar.api.formatDateTime({year: -2021, month: -11, day: 24, hour: 12, minute: 13, seconds: 14})
// Returns {date: 'January 25, -2021', time: '12:13:14'}

SimpleCalendar.api.formatDateTime({year: 2021, month: 111, day: 224, hour: 44, minute: 313, seconds: 314})
// Returns {date: 'December 31, 2021', time: '23:59:59'}

SimpleCalendar.api.formatDateTime({year: 2021, month: 111, day: 224, hour: 44, minute: 313, seconds: 314},"DD/MM/YYYY HH:mm:ss A")
// Returns "31/12/2021 23:59:00 PM"
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `date` | [`DateTimeParts`](SimpleCalendar.md#datetimeparts) | `undefined` | A date object (eg `{year:2021, month: 4, day: 12, hour: 0, minute: 0, seconds: 0}`) with the parameters set to the date and time that should be formatted.<br/>**Important**: The month and day are index based so January would be 0 and the first day of the month will also be 0. |
| `format` | `string` | `""` | Optional format string to return custom formats for the passed in date and time. |
| `calendarId` | `string` | `"active"` | Optional parameter to specify the ID of the calendar to use when converting a date to a formatted string. If not provided the current active calendar will be used. |

#### Returns

`string` \| \{ `date`: `string` ; `time`: `string`  }

If no format string is provided an object with the date and time formatted strings, as set in the configuration, will be returned. If a format is provided then a formatted string will be returned.

___

### formatTimestamp

▸ **formatTimestamp**(`timestamp`, `format?`, `calendarId?`): `string` \| \{ `date`: `string` ; `time`: `string`  }

Converts the passed in timestamp into formatted date and time strings that match the configured date and time formats or the passed in format string.

**`Example`**

```javascript
// Assuming that the default date and time formats are in place
// Date: Full Month Name Day, Year
// Time: 24Hour:Minute:Second

SimpleCalendar.api.formatTimestamp(1640434394);
// Returns {date: 'December 25, 2021', time: '12:13:14'}

SimpleCalendar.api.formatTimestamp(1640434394,"DD/MM/YYYY HH:mm:ss A");
// Returns '25/12/2021 12:13:14 PM'
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `timestamp` | `number` | `undefined` | The timestamp (in seconds) of the date to format. |
| `format` | `string` | `""` | Optional format string to return custom formats for the passed in date and time. |
| `calendarId` | `string` | `"active"` | Optional parameter to specify the ID of the calendar to use when converting a date to a formatted string. If not provided the current active calendar will be used. |

#### Returns

`string` \| \{ `date`: `string` ; `time`: `string`  }

If no format string is provided an object with the date and time formatted strings, as set in the configuration, will be returned. If a format is provided then a formatted string will be returned.

___

### getAllCalendars

▸ **getAllCalendars**(): [`CalendarData`](../interfaces/SimpleCalendar.CalendarData.md)[]

Gets the details of all calendars that have been configured in Simple Calendar

**`Example`**

```javascript
const c = SimpleCalendar.api.getAllCalendars();
console.log(c); // Will contain a list of all calendars and their data
```

#### Returns

[`CalendarData`](../interfaces/SimpleCalendar.CalendarData.md)[]

Array of all calendars and their data.

___

### getAllMonths

▸ **getAllMonths**(`calendarId?`): [`MonthData`](../interfaces/SimpleCalendar.MonthData.md)[]

Gets the details for all the months of the specified calendar.

**`Example`**

```javascript
SimpleCalendar.api.getAllMonths();
// Returns an array like this, assuming the Gregorian Calendar
// [
//     {
//         "id": "13390ed",
//         "name": "January",
//         "description" : "",
//         "abbreviation": "Jan",
//         "numericRepresentation": 1,
//         "numericRepresentationOffset": 0,
//         "numberOfDays": 31,
//         "numberOfLeapYearDays": 31,
//         "intercalary": false,
//         "intercalaryInclude": false,
//         "startingWeekday": null
//     },
//     {
//         "id": "effafeee",
//         "name": "February",
//         "description" : "",
//         "abbreviation": "Feb",
//         "numericRepresentation": 2,
//         "numericRepresentationOffset": 0,
//         "numberOfDays": 28,
//         "numberOfLeapYearDays": 29,
//         "intercalary": false,
//         "intercalaryInclude": false,
//         "startingWeekday": null
//     },
//     {
//         "id": "25b48251",
//         "name": "March",
//         "description" : "",
//         "abbreviation": "Mar",
//         "numericRepresentation": 3,
//         "numericRepresentationOffset": 0,
//         "numberOfDays": 31,
//         "numberOfLeapYearDays": 31,
//         "intercalary": false,
//         "intercalaryInclude": false,
//         "startingWeekday": null
//     },
//     {
//         "id": "e5e9782f",
//         "name": "April",
//         "description" : "",
//         "abbreviation": "Apr",
//         "numericRepresentation": 4,
//         "numericRepresentationOffset": 0,
//         "numberOfDays": 30,
//         "numberOfLeapYearDays": 30,
//         "intercalary": false,
//         "intercalaryInclude": false,
//         "startingWeekday": null
//     },
//     {
//         "id": "93f626f6",
//         "name": "May",
//         "description" : "",
//         "abbreviation": "May",
//         "numericRepresentation": 5,
//         "numericRepresentationOffset": 0,
//         "numberOfDays": 31,
//         "numberOfLeapYearDays": 31,
//         "intercalary": false,
//         "intercalaryInclude": false,
//         "startingWeekday": null
//     },
//     {
//         "id": "22b4b204",
//         "name": "June",
//         "description" : "",
//         "abbreviation": "Jun",
//         "numericRepresentation": 6,
//         "numericRepresentationOffset": 0,
//         "numberOfDays": 30,
//         "numberOfLeapYearDays": 30,
//         "intercalary": false,
//         "intercalaryInclude": false,
//         "startingWeekday": null
//     },
//     {
//         "id": "adc0a7ca",
//         "name": "July",
//         "description" : "",
//         "abbreviation": "Jul",
//         "numericRepresentation": 7,
//         "numericRepresentationOffset": 0,
//         "numberOfDays": 31,
//         "numberOfLeapYearDays": 31,
//         "intercalary": false,
//         "intercalaryInclude": false,
//         "startingWeekday": null
//     },
//     {
//         "id": "58197d71",
//         "name": "August",
//         "description" : "",
//         "abbreviation": "Aug",
//         "numericRepresentation": 8,
//         "numericRepresentationOffset": 0,
//         "numberOfDays": 31,
//         "numberOfLeapYearDays": 31,
//         "intercalary": false,
//         "intercalaryInclude": false,
//         "startingWeekday": null
//     },
//     {
//         "id": "eca76bbd",
//         "name": "September",
//         "description" : "",
//         "abbreviation": "Sep",
//         "numericRepresentation": 9,
//         "numericRepresentationOffset": 0,
//         "numberOfDays": 30,
//         "numberOfLeapYearDays": 30,
//         "intercalary": false,
//         "intercalaryInclude": false,
//         "startingWeekday": null
//     },
//     {
//         "id": "6b0da33e",
//         "name": "October",
//         "description" : "",
//         "abbreviation": "Oct",
//         "numericRepresentation": 10,
//         "numericRepresentationOffset": 0,
//         "numberOfDays": 31,
//         "numberOfLeapYearDays": 31,
//         "intercalary": false,
//         "intercalaryInclude": false,
//         "startingWeekday": null
//     },
//     {
//         "id": "150f5519",
//         "name": "November",
//         "description" : "",
//         "abbreviation": "Nov",
//         "numericRepresentation": 11,
//         "numericRepresentationOffset": 0,
//         "numberOfDays": 30,
//         "numberOfLeapYearDays": 30,
//         "intercalary": false,
//         "intercalaryInclude": false,
//         "startingWeekday": null
//     },
//     {
//         "id": "b67bc3ee",
//         "name": "December",
//         "description" : "",
//         "abbreviation": "Dec",
//         "numericRepresentation": 12,
//         "numericRepresentationOffset": 0,
//         "numberOfDays": 31,
//         "numberOfLeapYearDays": 31,
//         "intercalary": false,
//         "intercalaryInclude": false,
//         "startingWeekday": null
//     }
// ]
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `calendarId` | `string` | `"active"` | Optional parameter to specify the ID of the calendar to get the list of months from. If not provided the current active calendar will be used. |

#### Returns

[`MonthData`](../interfaces/SimpleCalendar.MonthData.md)[]

Array of all months in the calendar.

___

### getAllMoons

▸ **getAllMoons**(`calendarId?`): [`MoonData`](../interfaces/SimpleCalendar.MoonData.md)[]

Gets the details for all the moons of the specified calendar.

**`Example`**

```javascript
SimpleCalendar.api.getAllMoons();
// Returns an array like this, assuming the Gregorian Calendar
// [
//     {
//         "id": "2c26abfa",
//         "name": "Moon",
//         "color": "#ffffff",
//         "cycleLength": 29.53059,
//         "cycleDayAdjust": 0.5,
//         "firstNewMoon": {
//             "year": 2000,
//             "month": 1,
//             "day": 6,
//             "yearX": 0,
//             "yearReset": "none"
//         },
//         "phases": [
//             {
//                 "name": "New Moon",
//                 "length": 1,
//                 "icon": "new",
//                 "singleDay": true
//             },
//             {
//                 "name": "Waxing Crescent",
//                 "length": 6.3826,
//                 "icon": "waxing-crescent",
//                 "singleDay": false
//             },
//             {
//                 "name": "First Quarter",
//                 "length": 1,
//                 "icon": "first-quarter",
//                 "singleDay": true
//             },
//             {
//                 "name": "Waxing Gibbous",
//                 "length": 6.3826,
//                 "icon": "waxing-gibbous",
//                 "singleDay": false
//             },
//             {
//                 "name": "Full Moon",
//                 "length": 1,
//                 "icon": "full",
//                 "singleDay": true
//             },
//             {
//                 "name": "Waning Gibbous",
//                 "length": 6.3826,
//                 "icon": "waning-gibbous",
//                 "singleDay": false
//             },
//             {
//                 "name": "Last Quarter",
//                 "length": 1,
//                 "icon": "last-quarter",
//                 "singleDay": true
//             },
//             {
//                 "name": "Waning Crescent",
//                 "length": 6.3826,
//                 "icon": "waning-crescent",
//                 "singleDay": false
//             }
//         ],
//         "currentPhase": {
//             "name": "Waning Crescent",
//             "length": 6.3826,
//             "icon": "waning-crescent",
//             "singleDay": false
//         }
//     }
// ]
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `calendarId` | `string` | `"active"` | Optional parameter to specify the ID of the calendar to get the list of moons from. If not provided the current active calendar will be used. |

#### Returns

[`MoonData`](../interfaces/SimpleCalendar.MoonData.md)[]

Array of all moons in the calendar.

___

### getAllSeasons

▸ **getAllSeasons**(`calendarId?`): [`SeasonData`](../interfaces/SimpleCalendar.SeasonData.md)[]

Gets the details for all the seasons for the specified calendar.

**`Example`**

```javascript
SimpleCalendar.api.getAllSeasons();
// Returns an array like this, assuming the Gregorian Calendar
// [
//     {
//         color: "#fffce8",
//         description : "",
//         icon: "spring,
//         id: "4916a231",
//         name: "Spring",
//         startingDay: 20,
//         startingMonth: 3,
//         sunriseTime: 21600,
//         sunsetTime: 64800
//     },
//     {
//         color: "#f3fff3",
//         description : "",
//         icon: "summer,
//         id: "e596489",
//         name: "Summer",
//         startingDay: 20,
//         startingMonth: 6,
//         sunriseTime: 21600,
//         sunsetTime: 64800
//     },
//     {
//         color: "#fff7f2",
//         description : "",
//         icon: "fall,
//         id: "3f137ee5",
//         name: "Fall",
//         startingDay: 22,
//         startingMonth: 9,
//         sunriseTime: 21600,
//         sunsetTime: 64800
//     },
//     {
//         color: "#f2f8ff",
//         description : "",
//         icon: "winter,
//         id: "92f919a2",
//         name: "Winter",
//         startingDay: 21,
//         startingMonth: 12,
//         sunriseTime: 21600,
//         sunsetTime: 64800
//     }
// ]
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `calendarId` | `string` | `"active"` | Optional parameter to specify the ID of the calendar to get the list of seasons from. If not provided the current active calendar will be used. |

#### Returns

[`SeasonData`](../interfaces/SimpleCalendar.SeasonData.md)[]

Array of all seasons in the calendar.

___

### getAllThemes

▸ **getAllThemes**(): `Object`

Gets a list of all available themes a user can choose from. System specific themes that do not match the current system will be excluded. Module specific themes whos modules are not installed and enabled will be excluded.

**`Example`**

```javascript
SimpleCalendar.api.getAllThemes();
// {
//    "dark": "Dark",
//    "light": "Light",
//    "classic": "Classic"
// }
```

#### Returns

`Object`

A object where the properties represent theme IDs and the values are the localized strings of the theme name.

___

### getAllWeekdays

▸ **getAllWeekdays**(`calendarId?`): [`WeekdayData`](../interfaces/SimpleCalendar.WeekdayData.md)[]

Gets the details about all the weekdays for the specified calendar.

**`Example`**

```javascript
SimpleCalendar.api.getAllWeekdays();
// Returns an array like this, assuming the Gregorian Calendar
// [
//     {
//         id: "dafbfd4",
//         name: "Sunday",
//         description : "",
//         numericRepresentation: 1,
//         restday : false,
//     },
//     {
//         id: "8648c7e9",
//         name: "Monday",
//         description : "",
//         numericRepresentation: 2,
//         restday : false,
//     }
//     {
//         id: "b40f3a20",
//         name: "Tuesday",
//         description : "",
//         numericRepresentation: 3,
//         restday : false,
//     },
//     {
//         id: "6c20a99e",
//         name: "Wednesday",
//         description : "",
//         numericRepresentation: 4,
//         restday : false,
//     },
//     {
//         id: "56c14ec7",
//         name: "Thursday",
//         description : "",
//         numericRepresentation: 5,
//         restday : false,
//     },
//     {
//         id: "2c732d04",
//         name: "Friday",
//         description : "",
//         numericRepresentation: 6,
//         restday : false,
//     },
//     {
//         id: "c8f72e3d",
//         name: "Saturday",
//         description : "",
//         numericRepresentation: 7,
//         restday : false,
//     }
// ]
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `calendarId` | `string` | `"active"` | Optional parameter to specify the ID of the calendar to get the list of weekdays from. If not provided the current active calendar will be used. |

#### Returns

[`WeekdayData`](../interfaces/SimpleCalendar.WeekdayData.md)[]

Array of all weekdays in the calendar.

___

### getCurrentCalendar

▸ **getCurrentCalendar**(): [`CalendarData`](../interfaces/SimpleCalendar.CalendarData.md)

Gets the details about the current active calendar.

**`Example`**

```javascript
cosnt c = SimpleCalendar.api.getCurrentCalendar();
console.log(c); // Will contain all the configuration data for the current calendar.
```

#### Returns

[`CalendarData`](../interfaces/SimpleCalendar.CalendarData.md)

The current active calendars configuration.

___

### getCurrentDay

▸ **getCurrentDay**(`calendarId?`): [`DayData`](../interfaces/SimpleCalendar.DayData.md) \| ``null``

Gets the details about the current day for the specified calendar.

**`Example`**

```javascript
SimpleCalendar.api.getCurrentDay();
// Returns an object like this:
// {
//     id: "cbdb31cb",
//     name: "8",
//     numericRepresentation: 8
// }
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `calendarId` | `string` | `"active"` | Optional parameter to specify the ID of the calendar to get the current day from. If not provided the current active calendar will be used. |

#### Returns

[`DayData`](../interfaces/SimpleCalendar.DayData.md) \| ``null``

The current day data or null if no current day can be found.

___

### getCurrentMonth

▸ **getCurrentMonth**(`calendarId?`): [`MonthData`](../interfaces/SimpleCalendar.MonthData.md) \| ``null``

Gets the details about the current month for the specified calendar.

**`Example`**

```javascript
SimpleCalendar.api.getCurrentMonth();
// Returns an object like this:
// {
//     abbreviation: "Jun",
//     id: "22b4b204",
//     intercalary: false,
//     intercalaryInclude: false,
//     name: "June",
//     description: "",
//     numberOfDays: 30,
//     numberOfLeapYearDays: 30,
//     numericRepresentation: 6,
//     numericRepresentationOffset: 0,
//     startingWeekday: null
// }
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `calendarId` | `string` | `"active"` | Optional parameter to specify the ID of the calendar to get the current month from. If not provided the current active calendar will be used. |

#### Returns

[`MonthData`](../interfaces/SimpleCalendar.MonthData.md) \| ``null``

The current month data or null if no current month can be found.

___

### getCurrentSeason

▸ **getCurrentSeason**(`calendarId?`): [`SeasonData`](../interfaces/SimpleCalendar.SeasonData.md)

Gets the details about the season for the current date of the specified calendar.

**`Example`**

```javascript
SimpleCalendar.api.getCurrentSeason();
// Returns an object like this
// {
//     color: "#fffce8",
//     id: "4916a231",
//     name: "Spring",
//     description: "",
//     icon: "spring",
//     startingDay: 19,
//     startingMonth: 2,
//     sunriseTime: 21600,
//     sunsetTime: 64800
// }
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `calendarId` | `string` | `"active"` | Optional parameter to specify the ID of the calendar to get the current season from. If not provided the current active calendar will be used. |

#### Returns

[`SeasonData`](../interfaces/SimpleCalendar.SeasonData.md)

The current seasons data or an empty season data object if no current season can be found.

___

### getCurrentTheme

▸ **getCurrentTheme**(): `string`

Gets the ID of the theme being used by the player.

**`Example`**

```javascript
SimpleCalendar.api.getCurrentTheme();
// Returns "dark"
```

#### Returns

`string`

A string ID of the theme being used.

___

### getCurrentWeekday

▸ **getCurrentWeekday**(`calendarId?`): [`WeekdayData`](../interfaces/SimpleCalendar.WeekdayData.md) \| ``null``

Gets the details about the current weekday.

**`Example`**

```javascript
SimpleCalendar.api.getCurrentWeekday();
// Returns an object like this
// {
//     id: "b40f3a20",
//     name: "Tuesday",
//     abbreviation: "Tu",
//     description: "",
//     numericRepresentation: 3,
//     restday: false
// }
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `calendarId` | `string` | `"active"` | Optional parameter to specify the ID of the calendar to get the current weekday from. If not provided the current active calendar will be used. |

#### Returns

[`WeekdayData`](../interfaces/SimpleCalendar.WeekdayData.md) \| ``null``

The current weekday data or null if no current weekday can be found.

___

### getCurrentYear

▸ **getCurrentYear**(`calendarId?`): [`YearData`](../interfaces/SimpleCalendar.YearData.md) \| ``null``

Gets the details about the current year for the specified calendar.

**`Example`**

```javascript
SimpleCalendar.api.getCurrentYear();
// Returns an object like this
// {
//     firstWeekday: 4,
//     id: "bbe5385c",
//     numericRepresentation: 2021,
//     postfix: "",
//     prefix: "",
//     showWeekdayHeadings: true,
//     yearNames: [],
//     yearNamesStart: 0,
//     yearNamingRule: "default",
//     yearZero: 1970
// }
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `calendarId` | `string` | `"active"` | Optional parameter to specify the ID of the calendar to get the current year from. If not provided the current active calendar will be used. |

#### Returns

[`YearData`](../interfaces/SimpleCalendar.YearData.md) \| ``null``

The current year data or null if no current year can be found.

___

### getLeapYearConfiguration

▸ **getLeapYearConfiguration**(`calendarId?`): [`LeapYearData`](../interfaces/SimpleCalendar.LeapYearData.md) \| ``null``

Gets the details about how leap years are configured for the specified calendar.

**`Example`**

```javascript
SimpleCalendar.api.getLeapYearConfiguration();
// Returns an object like this
// {
//     customMod: 0,
//     id: "1468d034",
//     rule: "gregorian"
}
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `calendarId` | `string` | `"active"` | Optional parameter to specify the ID of the calendar to get the leap year configuration from. If not provided the current active calendar will be used. |

#### Returns

[`LeapYearData`](../interfaces/SimpleCalendar.LeapYearData.md) \| ``null``

The leap year configuration.

___

### getNotes

▸ **getNotes**(`calendarId?`): (`StoredDocument`\<`JournalEntry`\> \| `undefined`)[]

Gets all notes that the current user is able to see for the specified calendar.

**`Example`**

```javascript
// Returns an array of JournalEntry objects
SimpleCalendar.api.getNotes();
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `calendarId` | `string` | `"active"` | Optional parameter to specify the ID of the calendar to get the notes from. If not provided the current active calendar will be used. |

#### Returns

(`StoredDocument`\<`JournalEntry`\> \| `undefined`)[]

A list of [JournalEntries](https://foundryvtt.com/api/JournalEntry.html) that contain the note data.

___

### getNotesForDay

▸ **getNotesForDay**(`year`, `month`, `day`, `calendarId?`): (`StoredDocument`\<`JournalEntry`\> \| `undefined`)[]

Gets all notes that the current user is able to see for the specified date from the specified calendar.

**`Example`**

```javascript
// Returns an array of JournalEntry objects
SimpleCalendar.api.getNotesForDay(2022, 11, 24);
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `year` | `number` | `undefined` | The year of the date to get the notes for. |
| `month` | `number` | `undefined` | The index of the month to get the notes for. |
| `day` | `number` | `undefined` | The index of the day to get the notes for. |
| `calendarId` | `string` | `"active"` | Optional parameter to specify the ID of the calendar to get the notes from. If not provided the current active calendar will be used. |

#### Returns

(`StoredDocument`\<`JournalEntry`\> \| `undefined`)[]

A list of [JournalEntries](https://foundryvtt.com/api/JournalEntry.html)  that contain the note data.

___

### getTimeConfiguration

▸ **getTimeConfiguration**(`calendarId?`): [`TimeData`](../interfaces/SimpleCalendar.TimeData.md) \| ``null``

Get the details about how time is configured for the specified calendar.

**`Example`**

```javascript
SimpleCalendar.api.getTimeConfiguration();
// Returns an object like this
// {
//     gameTimeRatio: 1,
//     hoursInDay: 24,
//     id: "d4791796",
//     minutesInHour: 60,
//     secondsInCombatRound: 6,
//     secondsInMinute: 60,
//     unifyGameAndClockPause: true,
//     updateFrequency: 1
// }
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `calendarId` | `string` | `"active"` | Optional parameter to specify the ID of the calendar to get the time configuration from. If not provided the current active calendar will be used. |

#### Returns

[`TimeData`](../interfaces/SimpleCalendar.TimeData.md) \| ``null``

The time configuration.

___

### isOpen

▸ **isOpen**(): `boolean`

If the calendar is open or not.

**`Example`**

```javascript
SimpleCalendar.api.isOpen(); // True or false depending on if the calendar is open or closed.
```

#### Returns

`boolean`

boolean True if the calendar is open, false if it is closed.

___

### isPrimaryGM

▸ **isPrimaryGM**(): `boolean`

Get if the current user is considered the primary GM or not.

**`Example`**

```javascript

SimpleCalendar.api.isPrimaryGM(); //True or Flase depending on if the current user is primary gm

```

#### Returns

`boolean`

If the current user is the primary GM.

___

### pauseClock

▸ **pauseClock**(`calendarId?`): `boolean`

Pauses the real time clock for the specified calendar. Only the primary GM can pause a clock.

**`Example`**

```javascript
SimpleCalendar.api.pauseClock();
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `calendarId` | `string` | `"active"` | Optional parameter to specify the ID of the calendar to pause the real time clock for. If not provided the current active calendar will be used. |

#### Returns

`boolean`

True if the clock was paused, false otherwise

___

### removeNote

▸ **removeNote**(`journalEntryId`): `Promise`\<`boolean`\>

This function removes the specified note from Simple Calendar.

**`Example`**

```javascript
SimpleCalendar.api.removeNote("asd123").then(...).catch(console.error);
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `journalEntryId` | `string` | The ID of the journal entry associated with the note that is to be removed. |

#### Returns

`Promise`\<`boolean`\>

True if the note was removed or false if it was not.

___

### runMigration

▸ **runMigration**(): `void`

Run the migration from Simple Calendar version 1 to version 2.
This will only work if the current player is the primary GM.

A dialog will be shown to confirm if the GM wants to run the migration. This will prevent accidental running of the migration.

**`Example`**

```javascript
SimpleCalendar.api.runMigration();
```

#### Returns

`void`

___

### searchNotes

▸ **searchNotes**(`term`, `options?`, `calendarId?`): (`StoredDocument`\<`JournalEntry`\> \| `undefined`)[]

Search the notes in Simple Calendar for a specific term. Only notes that the user can see are returned.

**`Example`**

```javascript
SimpleCalendar.api.searchNotes("Note"); //Will return a list of notes that contained the word note somewhere in its content.

SimpleCalendar.api.searchNotes("Note", {title: true}); // Will return a list of notes that contain the world note in the title.

SimpleCalendar.api.searchNotes("Gamemaster", {author: true}); // Will return a list of notes that were written by the gamemaster.
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `term` | `string` | `undefined` | The text that is being searched for |
| `options` | `Object` | `undefined` | Options parameter to specify which fields of the note to use when searching, If not provided all fields are searched against. |
| `options.author` | `boolean` | `true` | - |
| `options.categories` | `boolean` | `true` | - |
| `options.date` | `boolean` | `true` | - |
| `options.details` | `boolean` | `true` | - |
| `options.title` | `boolean` | `true` | - |
| `calendarId` | `string` | `"active"` | Optional parameter to specify the ID of the calendar whose notes to search against. If not provided the current active calendar will be used. |

#### Returns

(`StoredDocument`\<`JournalEntry`\> \| `undefined`)[]

A list of [JournalEntry](https://foundryvtt.com/api/JournalEntry.html) that matched the term being searched.

___

### secondsToInterval

▸ **secondsToInterval**(`seconds`, `calendarId?`): [`DateTimeParts`](SimpleCalendar.md#datetimeparts)

Will attempt to parse the passed in seconds into larger time intervals.

**`Example`**

```javascript
//Assuming a Gregorian Calendar
SimpleCalendar.api.secondsToInterval(3600); //Returns {year: 0, month: 0, day: 0, hour: 1, minute: 0, seconds: 0}
SimpleCalendar.api.secondsToInterval(3660); //Returns {year: 0, month: 0, day: 0, hour: 1, minute: 1, seconds: 0}
SimpleCalendar.api.secondsToInterval(86400); //Returns {year: 0, month: 0, day: 1, hour: 0, minute: 0, seconds: 0}
SimpleCalendar.api.secondsToInterval(604800); //Returns {year: 0, month: 0, day: 7, hour: 0, minute: 0, seconds: 0}
SimpleCalendar.api.secondsToInterval(2629743); //Returns {year: 0, month: 1, day: 0, hour: 10, minute: 29, seconds: 3}
SimpleCalendar.api.secondsToInterval(31556926); //Returns {year: 1, month: 0, day: 0, hour: 5, minute: 48, seconds: 46}
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `seconds` | `number` | `undefined` | The number of seconds to convert to different intervals. |
| `calendarId` | `string` | `"active"` | Optional parameter to specify the ID of the calendar to use when calculating the intervals. If not provided the current active calendar will be used. |

#### Returns

[`DateTimeParts`](SimpleCalendar.md#datetimeparts)

An object containing the larger time intervals that make up the number of seconds passed in.

___

### setDate

▸ **setDate**(`date`, `calendarId?`): `boolean`

Will set the current date of the specified calendar to match the passed in date.
**Important**: This function can only be run by users who have permission to change the date in Simple Calendar.

**`Example`**

```javascript
//To set the date to December 25th 1999 with the time 00:00:00
SimpleCalendar.api.setDate({year: 1999, month: 11, day: 24, hour: 0, minute: 0, seconds: 0});

//To set the date to December 31st 1999 and the time to 11:59:59pm
SimpleCalendar.api.setDate({year: 1999, month: 11, day: 30, hour: 23, minute: 59, seconds: 59});
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `date` | [`DateTimeParts`](SimpleCalendar.md#datetimeparts) | `undefined` | A date object (eg `{year:2021, month: 4, day: 12, hour: 0, minute: 0, seconds: 0}`) with the parameters set to the date that the calendar should be set to. Any missing parameters will default to the current date value for that parameter.<br/>**Important**: The month and day are index based so January would be 0 and the first day of the month will also be 0. |
| `calendarId` | `string` | `"active"` | Optional parameter to specify the ID of the calendar to set the date of. If not provided the current active calendar will be used. |

#### Returns

`boolean`

True if the date was set successfully, false otherwise.

___

### setTheme

▸ **setTheme**(`themeId`): `Promise`\<`boolean`\>

Will set the players Simple Calendar theme that matches the passed in theme ID.

An information notification will be shown to the player if the theme was changed to let them know it has been changed programmatically.

**`Example`**

```javascript

await SimpleCalendar.api.setTheme('light');
//Will return true and change Simple Calendar's theme to the light theme.

await SimpleCalendar.api.setTheme('light');
//Will return true and will not change the theme as it was already set to light.

await SimpleCalendar.api.setTheme('themeDoesNotExist');
//Will return false and log an error to the console.
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `themeId` | `string` | The ID of the theme to set. The ID's of all available themes can be found using [getAllThemes](SimpleCalendar.api.md#getallthemes). |

#### Returns

`Promise`\<`boolean`\>

A promise that resolves to True if the theme is valid and was applied successfully, or it was the theme already being used. The promise will resolve to False if a theme with that ID could not be found.

___

### showCalendar

▸ **showCalendar**(`date?`, `compact?`, `calendarId?`): `void`

Will open up Simple Calendar to the current date, or the passed in date.

**`Example`**

```javascript
//Assuming a Gregorian Calendar
SimpleCalendar.api.showCalendar(); // Will open the calendar to the current date.
SimpleCalendar.api.showCalendar({year: 1999, month: 11, day: 25}); // Will open the calendar to the date December 25th, 1999
SimpleCalendar.api.showCalendar(null, true); // Will open the calendar to the current date in compact mode.
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `date` | ``null`` \| [`DateTimeParts`](SimpleCalendar.md#datetimeparts) | `null` | A date object (eg `{year:2021, month: 4, day: 12}`) with the year, month and day set to the date to be visible when the calendar is opened.<br/>**Important**: The month is index based so January would be 0. |
| `compact` | `boolean` | `false` | If to open the calendar in compact mode or not. |
| `calendarId` | `string` | `"active"` | Optional parameter to specify the ID of the calendar to focus when the calendar view is opened. If not provided the current active calendar will be used. |

#### Returns

`void`

___

### startClock

▸ **startClock**(`calendarId?`): `boolean`

Starts the real time clock for the specified calendar. Only the primary GM can start a clock.

**`Example`**

```javascript
SimpleCalendar.api.startClock();
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `calendarId` | `string` | `"active"` | Optional parameter to specify the ID of the calendar to start the real time clock for. If not provided the current active calendar will be used. |

#### Returns

`boolean`

True if the clock was started, false otherwise

___

### stopClock

▸ **stopClock**(`calendarId?`): `boolean`

Stops the real time clock for the specified calendar. Only the primary GM can stop a clock.

**`Example`**

```javascript
SimpleCalendar.api.stopClock();
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `calendarId` | `string` | `"active"` | Optional parameter to specify the ID of the calendar to stop the real time clock for. If not provided the current active calendar will be used. |

#### Returns

`boolean`

True if the clock was stopped, false otherwise

___

### timestamp

▸ **timestamp**(`calendarId?`): `number`

Get the timestamp (in seconds) of the specified calendars currently set date.

**`Example`**

```javascript
const timestamp = SimpleCalendar.api.timestamp();
console.log(timestamp); // This will be a number representing the current number of seconds passed in the calendar.
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `calendarId` | `string` | `"active"` | Optional parameter to specify the ID of the calendar to get the timestamp for. If not provided the current active calendar will be used. |

#### Returns

`number`

The time stamp of the calendar in seconds

___

### timestampPlusInterval

▸ **timestampPlusInterval**(`currentSeconds`, `interval`, `calendarId?`): `number`

Calculates a new timestamp from the passed in timestamp plus the passed in interval amount.

**`Example`**

```javascript
let newTime = SimpleCalendar.api.timestampPlusInterval(0, {day: 1});
console.log(newTime); // this will be 0 + the number of seconds in 1 day. For most calendars this will be 86400

// Assuming Gregorian Calendar with the current date of June 1, 2021
newTime = SimpleCalendar.api.timestampPlusInterval(1622505600, {month: 1, day: 1});
console.log(newTime); // This will be the number of seconds that equal July 2nd 2021
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `currentSeconds` | `number` | `undefined` | The timestamp (in seconds) to have the interval added too. |
| `interval` | [`DateTimeParts`](SimpleCalendar.md#datetimeparts) | `undefined` | The interval objects properties are all optional so only those needed have to be set.<br/>Where each property is how many of that interval to increase the passed in timestamp by. |
| `calendarId` | `string` | `"active"` | Optional parameter to specify the ID of the calendar to use to calculate the new timestamp. If not provided the current active calendar will be used. |

#### Returns

`number`

The timestamp plus the passed in interval amount

___

### timestampToDate

▸ **timestampToDate**(`seconds`, `calendarId?`): [`DateData`](../interfaces/SimpleCalendar.DateData.md) \| ``null``

Converts a timestamp (in seconds) into a [DateData](../interfaces/SimpleCalendar.DateData.md) objet from the specified calendar

**`Example`**

```javascript
// Assuming Gregorian Calendar with the current date of June 1, 2021
let scDate = SimpleCalendar.api.timestampToDate(1622505600);
console.log(scDate);
// This is what the returned object will look like
// {
//     "currentSeason": { "showAdvanced": false, "id": "75a4ba97", "name": "Spring", "numericRepresentation": null, "description": "", "abbreviation": "", "color": "#46b946", "startingMonth": 2, "startingDay": 19, "sunriseTime": 21600, "sunsetTime": 64800, "icon": "spring"},
//     day: 0,
//     dayOfTheWeek: 2,
//     dayOffset: 0,
//     display: {
//         date: "June 01, 2021",
//         day: "1",
//         daySuffix: "st",
//         month: "6",
//         monthName: "June",
//         time: "00:00:00",
//         weekday: "Tuesday",
//         year: "2021",
//         yearName: "",
//         yearPostfix: "",
//         yearPrefix: "",
//     },
//     hour: 0,
//     isLeapYear: false,
//     midday: 1622548800,
//     minute: 0,
//     month: 5,
//     second: 0,
//     showWeekdayHeadings: true,
//     sunrise: 1622527200,
//     sunset: 1622570400,
//     weekdays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
//     year: 2021,
//     yearZero: 1970
// }
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `seconds` | `number` | `undefined` | The timestamp (in seconds) to convert into a date object. |
| `calendarId` | `string` | `"active"` | Optional parameter to specify the ID of the calendar to use to calculate the [DateData](../interfaces/SimpleCalendar.DateData.md) objet. If not provided the current active calendar will be used. |

#### Returns

[`DateData`](../interfaces/SimpleCalendar.DateData.md) \| ``null``

A date object with information about the date the timestamp represents or null if the specified calendar can not be found
