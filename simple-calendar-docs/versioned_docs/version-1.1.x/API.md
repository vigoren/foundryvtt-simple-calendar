# API

You can create macros that will open up the Simple Calendar interface when used. To start create a new script macro and enter this as the command:

```javascript
SimpleCalendar.show();
```

**Important**: If this macro is intended to be useable by players don't forget to configure the Macros permissions for all players. It will need to be set to at least the "Limited", permission level.

The show function can take 3 parameters to set the year, month and day that the calendar opens up to.

Parameter|Type|Default|Details
---------|----|-------|-------
Year | number or null | null | The year to open the calendar too. If null is passed in it will open the calendar to the year the user last viewed
Month | number or null | null | The month to open the calendar too.<br/>The month is expected to start at 0, or be the index of the month to show. This way intercalary months can be easily chosen by using their index as they don't have a month number.<br/>-1 can be passed in to view the last month of the year.<br/>If null is passed in the calendar will open to the month the user last viewed.
Day | number or null | null | The day of the month to select.<br/>The day is expected to start at 1.<br/>-1 can be passed in to select the last day of the month.<br/>If null is passed in the selected day will be the last day the user selected, if any.

### Examples
All these examples assume we are using a standard Gregorian calendar.

Open the calendar to August 2003
```javascript
SimpleCalendar.show(2003, 7);
```

Open the calendar to December 1999 and select the 25th day
```javascript
SimpleCalendar.show(1999, 11, 25);
```
