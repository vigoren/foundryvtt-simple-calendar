# Macro's

Here are all the exposed functions that can be used when creating a macro.

## Open Simple Calendar
This macro has been depreciated. Please use the new [showCalendar](./docs/API.md#simplecalendarapishowcalendardate) function.

## Set Date and Time

You can create macros that will set a specific date and time to be the current date and time in Simple Calendar with this function.

**Important**: This macro can only be used by GMs as it changes the current date in Simple Calendar and that is something only GMs can do.

To use as a macro, create a new script macro and use the following as a starting base:

```javascript
SimpleCalendar.setDateTime(year, month, day, hour, minute, seconds);
```

The set date time function can take 6 parameters to set the year, month, day, hour, minute and seconds of the Simple Calendar.

Parameter|Type|Default|Details
---------|----|-------|-------
Year | number or null | null | The year to set the current date to. If null is passed in it will use the current year.
Month | number or null | null | The month to set the current date to.<br/>The month is expected to start at 0, or be the index of the month to show. This way intercalary months can be easily chosen by using their index as they don't have a month number.<br/>If null is passed in the current month will be used.
Day | number or null | null | The day of the month to set the current date to.<br/>The day is expected to start at 1.<br/>If null is passed in the current day of the month will be used.
Hour | number or null | null | The hour of the day to set the current time to. If null is passed in the current hour will be used.
Minute | number or null | null | The minutes of the day to set the current time to. If null is passed in the current minutes will be used.
Seconds | number or null | null | The seconds of the day to set the current time to. If null is passed in the current seconds will be used.

### Examples

Some examples on how to set the current. All examples are using the standard Gregorian calendar.

Set the current date to December 25th 1999

```javascript
SimpleCalendar.setDateTime(1999, 11, 25);
```

Set the current date to January 11, 2021

```javascript
SimpleCalendar.setDateTime(2021, 0, 11);
```

Set the current date to December 31st 1999 and the time to 11:59:59pm

```javascript
SimpleCalendar.setDateTime(1999, 11, 31, 23, 59, 59);
```

Set time to noon of the current day

```javascript
SimpleCalendar.setDateTime(null, null, null, 12, 0, 0);
```

## Change Date Time

You can create macros that will change the current date and time by various amounts in Simple Calendar with this function.

**Important**: This macro can only be used by GMs as it changes the current date in Simple Calendar and that is something only GMs can do.

To use as a macro, create a new script macro and use the following as a starting base:

```javascript
SimpleCalendar.changeDateTime(seconds,minutes,hours,days,months,years);
```

The change date time function can take 6 parameters to change the current date time by seconds, minutes, hours, days, months and years.

Parameter|Type|Default|Details
---------|----|-------|-------
Seconds | number | 0 | The amount of seconds to change the current time by. Can be any amount. Positive to advance time forward or negative to advance time backwards.
Minutes | number | 0 | The amount of minutes to change the current time by. Can be any amount. Positive to advance time forward or negative to advance time backwards.
Hours | number | 0 | The amount of hours to change the current time by. Can be any amount. Positive to advance time forward or negative to advance time backwards.
Days | number | 0 | The amount of days to change the current date by. Can be any amount. Positive to advance the date forward or negative to advance the date backwards.
Months | number | 0 | The amount of months to change the current date by. Can be any amount. Positive to advance the date forward or negative to advance the date backwards.
Years | number | 0 | The amount of years to change the current date by. Can be any amount. Positive to advance the date forward or negative to advance the date backwards.

### Examples

Advance time by 30 seconds

```javascript
SimpleCalendar.changeDateTime(30);
```

Advance time by 1 minute

```javascript
SimpleCalendar.changeDateTime(60);
//Or
SimpleCalendar.changeDateTime(0, 1);
```

Advance time by 1 hour

```javascript
SimpleCalendar.changeDateTime(3600);
//Or
SimpleCalendar.changeDateTime(0, 60);
//Or
SimpleCalendar.changeDateTime(0, 0, 1);
```

Go back 1 minute
```javascript
SimpleCalendar.changeDateTime(-60);
//Or
SimpleCalendar.changeDateTime(0, -1);
```

Advance the date by 1 year
```javascript
SimpleCalendar.changeDateTime(31556952);
//Or
SimpleCalendar.changeDateTime(0, 525600);
//Or
SimpleCalendar.changeDateTime(0, 0, 8760);
//Or
SimpleCalendar.changeDateTime(0, 0, 0, 365);
//Or
SimpleCalendar.changeDateTime(0, 0, 0, 0, 12);
//Or
SimpleCalendar.changeDateTime(0, 0, 0, 0, 0, 1);
```
