# Simple Calendar API

There are the functions that other modules, systems and macros can access and what they can do. Most of these are for advanced interfacing with Simple Calendar and not something everyone needs to worry about.

Simple Calendar exposes a variable called `SimpleCalendar`, all of these API functions exist the property api on that variable `SimpleCalendar.api`

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
years|Number|0|The number of years in the passed in seconds
months|Number|0|The number of months in the passed in seconds (month lengths are averaged out between all of the months so this may not be 100% accurate)
days|Number|0|The number of days in the passed in seconds
hours|Number|0|The number of hours in the passed in seconds
minutes|Number|0|The number of minutes in the passed in seconds
seconds|Number|0|The number of remaining seconds from the passed in seconds

### Examples

```javascript
//Assuming a Gregorian Calendar
SimpleCalendar.api.secondsToInterval(3600); //Returns {years: 0, months: 0, days: 0, hours: 1, minutes: 0, seconds: 0}
SimpleCalendar.api.secondsToInterval(3660); //Returns {years: 0, months: 0, days: 0, hours: 1, minutes: 1, seconds: 0}
SimpleCalendar.api.secondsToInterval(86400); //Returns {years: 0, months: 0, days: 1, hours: 0, minutes: 0, seconds: 0}
SimpleCalendar.api.secondsToInterval(604800); //Returns {years: 0, months: 0, days: 7, hours: 0, minutes: 0, seconds: 0}
SimpleCalendar.api.secondsToInterval(2629743); //Returns {years: 0, months: 1, days: 0, hours: 10, minutes: 29, seconds: 3}
SimpleCalendar.api.secondsToInterval(31556926); //Returns {years: 1, months: 0, days: 0, hours: 5, minutes: 48, seconds: 46}
```

## `SimpleCalendar.api.showCalendar(date)`

Will open up Simple Calendar to the current date, or the passed in date.

### Parameters

Parameter|Type|Default Value|Description
---------|-----|-------------|-----------
date|object or null|null|A date object (eg `{year:2021, month: 4, 12}`) with the year, month and day set to the date to be visible when the calendar is opened.<br>**Important**: The month is index based so January would be 0.

### Examples
```javascript
//Assuming a Gregorian Calendar
SimpleCalendar.api.showCalendar(); // Will open the calendar to the current date.
SimpleCalendar.api.showCalendar({year: 1999, month: 11, day: 25}); // Will open the calendar to the date December 25th, 1999
```

## `SimpleCalendar.api.timestamp()`

Return the timestamp (in seconds) of the calendars currently set date.

### Examples
```javascript
const timestamp = SimpleCalendar.api.timestamp();
console.log(timestamp); // This will be a number representing the current number of seconds passed in the calendar.
```


## `SimpleCalendar.api.timestampPlusInterval(timestamp, interval)`

Returns the current timestamp plus the passed in interval amount.

### Parameters

Parameter|Type|Default Value|Description
---------|-----|-------------|-----------
timestamp|Number| No Default |The timestamp (in seconds) to have the interval added too.
interval|Object|No Default|The interval objects properties are all optional so only those needed have to be set.<br/>A full object looks like this ```{years:0, months:0, days: 0, hours: 0, minutes: 0, seconds: 0}```<br/>Where each property is how many of that interval to increase the passed in timestamp by.

### Examples

```javascript
let newTime = SimpleCalendar.api.timestampPlusInterval(0, {days: 1});
console.log(newTime); // this will be 0 + the number of seconds in 1 day. For most calendars this will be 86400

// Assuming Gregorian Calendar with the current date of June 1, 2021
newTime = SimpleCalendar.api.timestampPlusInterval(1622505600, {months: 1, days: 1});
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
yearName|String|""|The name of the year, if year names have been set up.
month|Number|0|The index of the month represented in the timestamp.
monthName|String|""|The name of the month.
day|Number|0|The day of the month represented in the timestamp.
dayOfTheWeek|Number|0|The day of the week the day falls on.
hours|Number|0|The hour represented in the timestamp.
minutes|Number|0|The minute represented in the timestamp.
seconds|Number|0|The seconds represented in the timestamp.
yearZero|Number|0|What is considered as year zero when doing timestamp calculations.
weekdays|String Array|[]|A list of weekday names.

### Examples

```javascript
// Assuming Gregorian Calendar with the current date of June 1, 2021
let scDate = SimpleCalendar.api.timestampToDate(1622505600);
console.log(scDate);
/* This is what the returned object will look like
{
    day: 1,
    dayOfTheWeek: 6,
    hours: 0,
    minutes: 0,
    month: 5,
    monthName: "June",
    seconds: 0,
    weekdays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    year: 2021,
    yearName: "",
    yearZero: 1970
}
*/
```

