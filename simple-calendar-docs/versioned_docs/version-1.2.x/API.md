# Simple Calendar API

There are the functions that other modules, systems and macros can access and what they can do. Most of these are for advanced interfacing with Simple Calendar and not something everyone needs to worry about.

Simple Calendar exposes a variable called `SimpleCalendar`, all of these API functions exist the property api on that variable `SimpleCalendar.api`

## `SimpleCalendar.api.changeDate(interval)`

Changes the current date of Simple Calendar.

**Important**: This function can only be run by users who have permission to change the date in Simple Calendar.

### Parameters

Parameter|Type|Default Value|Description
---------|-----|-------------|-----------
interval|Object|No Default|The interval objects properties are all optional so only those needed have to be set.<br/>A full object looks like this ```{year:0, month:0, day: 0, hour: 0, minute: 0, second: 0}```<br/>Where each property is how many of that interval to change the current date by.

### Returns

This function will return true if the date change was successful and false if it was not.

### Examples
```javascript
//Assuming a date of June 1, 2021 and user has permission to change the date
SimpleCalendar.api.changeDate({day: 1}); // Will set the new date to June 2, 2021

//Assuming a date of June 1, 2021 and user has permission to change the date
SimpleCalendar.api.changeDate({day: -1}); // Will set the new date to May 31, 2021

//Assuming a date of June 1, 2021 10:00:00 and user has permission to change the date
SimpleCalendar.api.changeDate({year: 1, month: 1, day: 1, hour: 1, minute: 1, second: 1}); // Will set the new date to July 2, 2022 11:01:01

//Assuming a date of June 1, 2021 10:00:00 and user has permission to change the date
SimpleCalendar.api.changeDate({second: 3600}); // Will set the new date to June 1, 2021 11:00:00
```

## `SimpleCalendar.api.chooseRandomDate(startDate, endDate)`

Will choose a random date between the 2 passed in dates, or if no dates are passed in will choose a random date.

### Parameters

Parameter|Type|Default Value|Description
---------|-----|-------------|-----------
startDate|Object|{}|The start date objects properties are all optional so only those needed have to be set.<br/>A full object looks like this ```{year:0, month:0, day: 0, hour: 0, minute: 0, second: 0}```<br/>Where each property is the earliest date to be chosen when randomly selecting a date.<br/>The month and day properties are both index's so January would be 0 and the first day of the month is also 0.
endDate|Object|{}|The end date objects properties are all optional so only those needed have to be set.<br/>A full object looks like this ```{year:0, month:0, day: 0, hour: 0, minute: 0, second: 0}```<br/>Where each property is the latest date to be chosen when randomly selecting a date.<br/>The month and day properties are both index's so January would be 0 and the first day of the month is also 0.

### Returns
The date object returned has the following properties

Property|Type|Default Value|Description
---------|-----|-------------|-----------
year|Number|0|The randomly selected year
month|Number|0|The randomly selected month index
day|Number|0|The randomly selected day index
hour|Number|0|The randomly selected hour
minute|Number|0|The randomly selected minute
second|Number|0|The randomly selected second

### Examples

```javascript
SimpleCalendar.api.chooseRandomDate({year: 2021, month: 3, day: 0},{year: 2021, month: 5, day: 1})
/*
{
    day: 1
    hour: 12
    minute: 5
    month: 4
    second: 41
    year: 2021
}
 */

SimpleCalendar.api.chooseRandomDate({year: 1900, month: 3},{year: 2021, month: 5})
/*
{
    day: 19
    hour: 8
    minute: 16
    month: 3
    second: 25
    year: 1982
}
*/

SimpleCalendar.api.chooseRandomDate();
/*
{
    day: 11
    hour: 0
    minute: 49
    month: 8
    second: 37
    year: 3276
}
 */
```

## `SimpleCalendar.api.clockStatus()`

Will get the current status of the built-in clock in Simple Calendar

### Returns

The returned object has the following properties:

Property|Type|Description
---------|-----|-----------
started|Boolean|If the clock has started and is running.
stopped|Boolean|If the clock is stopped and not running.
paused|Boolean|If the clock has paused. The clock will be paused when the game is paused or the active scene has an active combat.

### Examples

```javascript
const status = SimpleCalendar.api.clockStatus();
console.log(status); // {started: false, stopped: true, paused: false}
```

## `SimpleCalendar.api.dateToTimestamp(date)`

Will convert that passed in date object to a timestamp.

### Parameters

Parameter|Type|Default Value|Description
---------|-----|-------------|-----------
date|object or null|null|A date object (eg `{year:2021, month: 4, day: 12, hour: 0, mintue: 0, second: 0}`) with the parameters set to the date that should be converted to a timestamp. Any missing parameters will default to the current date value for that parameter.<br/>**Important**: The month and day are index based so January would be 0 and the first day of the month will also be 0.

### Returns

Returns the timestamp for that date.


### Examples

```javascript
SimpleCalendar.api.dateToTimestamp({}); //Returns the timestamp for the current date

SimpleCalendar.api.dateToTimestamp({year: 2021, month: 0, day: 0, hour: 1, minute: 1, second: 0}); //Returns 1609462860
```

## `SimpleCalendar.api.isPrimaryGM()`

Returns if the current user is considered the primary GM or not.

### Examples

```javascript

SimpleCalendar.api.isPrimaryGM(); //True or Flase depending on if the current user is primary gm

```


## `SimpleCalendar.api.secondsToInterval(seconds)`

Will attempt to parse the passed in seconds into larger time intervals that make it up.

### Parameters

Parameter|Type|Default Value|Description
---------|-----|-------------|-----------
seconds|Number|No Default|The number of seconds to convert to different intervals.

### Returns

The interval object returned has the following properties

Property|Type|Default Value|Description
---------|-----|-------------|-----------
year|Number|0|The number of years in the passed in seconds
month|Number|0|The number of months in the passed in seconds (month lengths are averaged out between all of the months so this may not be 100% accurate)
day|Number|0|The number of days in the passed in seconds
hour|Number|0|The number of hours in the passed in seconds
minute|Number|0|The number of minutes in the passed in seconds
second|Number|0|The number of remaining seconds from the passed in seconds

### Examples

```javascript
//Assuming a Gregorian Calendar
SimpleCalendar.api.secondsToInterval(3600); //Returns {year: 0, month: 0, day: 0, hour: 1, minute: 0, second 0}
SimpleCalendar.api.secondsToInterval(3660); //Returns {year: 0, month: 0, day: 0, hour: 1, minute: 1, second: 0}
SimpleCalendar.api.secondsToInterval(86400); //Returns {year: 0, month: 0, day: 1, hour: 0, minute: 0, second: 0}
SimpleCalendar.api.secondsToInterval(604800); //Returns {year: 0, month: 0, day: 7, hour: 0, minute: 0, second: 0}
SimpleCalendar.api.secondsToInterval(2629743); //Returns {year: 0, month: 1, day: 0, hour: 10, minute: 29, second: 3}
SimpleCalendar.api.secondsToInterval(31556926); //Returns {year: 1, month: 0, day: 0, hour: 5, minute: 48, second: 46}
```

## `SimpleCalendar.api.setDate(date)`

Will set the current date to the passed in date.

**Important**: This function can only be run by users who have permission to change the date in Simple Calendar.

### Parameters

Parameter|Type|Default Value|Description
---------|-----|-------------|-----------
date|object or null|null|A date object (eg `{year:2021, month: 4, day: 12, hour: 0, mintue: 0, second: 0}`) with the parameters set to the date that the calendar should be set to. Any missing parameters will default to the current date value for that parameter.<br/>**Important**: The month and day are index based so January would be 0 and the first day of the month will also be 0.

### Returns

This function will return true if the date was set successfully, false if it was not.

### Examples

```javascript
//To set the date to December 25th 1999 with the time 00:00:00
SimpleCalendar.setDateTime(1999, 11, 24);

//To set the date to December 31st 1999 and the time to 11:59:59pm
SimpleCalendar.setDateTime(1999, 11, 30, 23, 59, 59);
```

## `SimpleCalendar.api.showCalendar(date, compact)`

Will open up Simple Calendar to the current date, or the passed in date.

### Parameters

Parameter|Type|Default Value|Description
---------|-----|-------------|-----------
date|object or null|null|A date object (eg `{year:2021, month: 4, day: 12}`) with the year, month and day set to the date to be visible when the calendar is opened.<br/>**Important**: The month is index based so January would be 0.
compact|boolean|false|If to open the calendar in compact mode or not.

### Examples
```javascript
//Assuming a Gregorian Calendar
SimpleCalendar.api.showCalendar(); // Will open the calendar to the current date.
SimpleCalendar.api.showCalendar({year: 1999, month: 11, day: 25}); // Will open the calendar to the date December 25th, 1999
SimpleCalendar.api.showCalendar(null, true); // Will opent the calendar to the current date in compact mode.
```

## `SimpleCalendar.api.timestamp()`

Return the timestamp (in seconds) of the calendars currently set date.

### Examples
```javascript
const timestamp = SimpleCalendar.api.timestamp();
console.log(timestamp); // This will be a number representing the current number of seconds passed in the calendar.
```

## `SimpleCalendar.api.startClock()`

Starts the real time clock of Simple Calendar. Only the primary GM can start a clock.

### Returns

Will return true if the clock started, false if it did not.

### Examples

```javascript
SimpleCalendar.api.startClock();
```

## `SimpleCalendar.api.stopClock()`

Stops the real time clock of Simple Calendar.

### Returns

Will return true if the clock stopped, false if it did not.

### Examples

```javascript
SimpleCalendar.api.stopClock();
```

## `SimpleCalendar.api.timestampPlusInterval(timestamp, interval)`

Returns the current timestamp plus the passed in interval amount.

### Parameters

Parameter|Type|Default Value|Description
---------|-----|-------------|-----------
timestamp|Number| No Default |The timestamp (in seconds) to have the interval added too.
interval|Object|No Default|The interval objects properties are all optional so only those needed have to be set.<br/>A full object looks like this ```{year:0, month:0, day: 0, hour: 0, minute: 0, second: 0}```<br/>Where each property is how many of that interval to increase the passed in timestamp by.

### Examples

```javascript
let newTime = SimpleCalendar.api.timestampPlusInterval(0, {day: 1});
console.log(newTime); // this will be 0 + the number of seconds in 1 day. For most calendars this will be 86400

// Assuming Gregorian Calendar with the current date of June 1, 2021
newTime = SimpleCalendar.api.timestampPlusInterval(1622505600, {month: 1, day: 1});
console.log(newTime); // This will be the number of seconds that equal July 2nd 2021
```

## `SimpleCalendar.api.timestampToDate(timestamp)`

Takes in a timestamp (in seconds) and will return that as a Simple Calendar date object.

### Parameters

Parameter|Type|Default Value|Description
---------|-----|-------------|-----------
timestamp|Number| No Default |The timestamp (in seconds) to convert into a date object.

### Returns

The date object that is return has the following properties:

Property|Type|Default Value|Description
---------|-----|-------------|-----------
year|Number|0|The year represented in the timestamp.
yearName|String|""|**Depreciated** Please use display.yearName instead. This will be removed when Foundry v9 Stable is released.
month|Number|0|The index of the month represented in the timestamp.
monthName|String|""|**Depreciated** Please use display.monthName instead. This will be removed when Foundry v9 Stable is released.
dayOffset|Number|0|The number of days that the months days are offset by.
day|Number|0|The index of the day of the month represented in the timestamp.
dayDisplay|String|""|**Depreciated** Please use display.day instead. This will be removed when Foundry v9 Stable is released.
dayOfTheWeek|Number|0|The day of the week the day falls on.
hour|Number|0|The hour represented in the timestamp.
minute|Number|0|The minute represented in the timestamp.
second|Number|0|The seconds represented in the timestamp.
yearZero|Number|0|What is considered as year zero when doing timestamp calculations.
yearPrefix|String|""|**Depreciated** Please use display.yearPrefix instead. This will be removed when Foundry v9 Stable is released.
yearPostfix|String|""|**Depreciated** Please use display.yearPostfix instead. This will be removed when Foundry v9 Stable is released.
weekdays|String Array|[]|A list of weekday names.
showWeekdayHeadings|Boolean|true|If to show the weekday headings for the month.
currentSeason|Season|{}|The information for the season of the date, properties include "name" for the seasons name and "color" for the color associated with the season.
display|Display Object|{}|All of the strings associated with displaying the date are put here

#### Display object

Property|Type|Default Value|Description
---------|-----|-------------|-----------
year|String|""|The year number
yearName|String|""|The name of the year, if year names have been set up.
yearPrefix|String|""|The prefix value for the year
yearPostfix|String|""|The postfix value for the year
month|String|""|The month number.
monthName|String|""|The name of the month.
weekday|String|""|The name of the weekday this date falls on.
day|String|""|How the day is displayed, generally its number on the calendar.
daySuffix|String|""|The Ordinal Suffix associated with the day number (st, nd, rd or th)
time|String|''|The hour, minute and seconds.

### Examples

```javascript
// Assuming Gregorian Calendar with the current date of June 1, 2021
let scDate = SimpleCalendar.api.timestampToDate(1622505600);
console.log(scDate);
/* This is what the returned object will look like
{
    currentSeason: {name: "Spring", color: "#fffce8"}
    day: 0
    dayDisplay: 1
    dayOfTheWeek: 2
    dayOffset: 0
    hour: 0
    minute: 0
    month: 5
    monthName: "June"
    second: 0
    showWeekdayHeadings: true
    weekdays: (7) ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    year: 2021
    yearName: ""
    yearPostfix: ""
    yearPrefix: ""
    yearZero: 1970
}
*/
```

