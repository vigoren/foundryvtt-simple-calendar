 # Hooks

Here are all the hooks that Simple Calendar emits and when they are emitted.

## How to Listen for a Hook

The global Simple Calendar object comes with a variable called hooks which will list all the available hooks that can be listened for.

Example: 
```javascript
SimpleCalendar.Hooks.DateTimeChange
```

The current hooks that are emitted are:

Hook Name|Value|Description
---------|------|----------
[DateTimeChange](#datetime-change)|`"simple-calendar-date-time-change"`|This hook is emitted any time the current date is updated.
[ClockStartStop](#clock-startstop)|`"simple-calendar-clock-start-stop"`|This hook is emitted any time the clock is started/stopped or paused.
[PrimaryGM](#is-primary-gm)|`"simple-calendar-primary-gm"`|This hook is emitted when the current user is promoted to the primary GM role.
[Ready](#ready)|`"simple-calendar-ready"`|This hook is emitted when Simple Calendar is fully initialized and ready to take commands.<br/>**Note**: For GM's this can take a little longer as some additional checks are done to see which GM will be considered the primary GM

## Date/Time Change

### When it is emitted
This hook is emitted any time the current date is updated. The current date can be updated by several means:

- When the GM clicks on the "[Set Current Date](UpdatingDateTime.md#date-controls)" button after adjusting the current date.
- When the [clock](UsingTheCalendar.md#simple-calendars-clock) is running every interval update.
- When the [Set Date/Time API function](API.md#simplecalendarapisetdatedate) is called.
- When the [Change Date/Time API function](API.md#simplecalendarapichangedateinterval) is called.
- When the [game world time](Configuration.md#game-world-time-integration) has changed and Simple Calendar is configured to update when that changes.

### What is passed

When this hook is emitted it will pass a data object that contains information about the new current day. The object will have these top level properties:

Property Name| Type                                      |Default Value|Description
-------------|-------------------------------------------|---------|------------
date| [Date Object](API.md#date-object)         |`{}`|This contains information about the current date of the calendar.
diff| Number                                    |0|This contains the difference in seconds from the previous date and time to this new date and time.
moons| Array\<[Moon Object](API.md#moon-object)> |`[]`|This contains information about the moon(s) phases for the current date.
year| [Year Object](#year-properties)           |`{}`|**Depreciated** Please use the date property. This will be removed when Foundry v10 stable is released.
month| [Month Object](#month-properties)         |`{}`|**Depreciated** Please use the date property. This will be removed when Foundry v10 stable is released.
day| [Day Object](#day-properties)             |`{}`|**Depreciated** Please use the date property. This will be removed when Foundry v10 stable is released.
time| [Time Object](#time-properties)           |`{}`|**Depreciated** Please use the date property. This will be removed when Foundry v10 stable is released.
season| [Season Object](#season-properties)       |`{}`|**Depreciated** Please use the date property. This will be removed when Foundry v10 stable is released.



#### Year Properties

Property Name|Value Type|Description
-------------|-------------|------------
number|number|This is the current years numerical representation.
prefix|string|This is the text that appears before the years numerical representation.
postfix|string|This is the test that appears after the years numerical representation.
isLeapYear|boolean|If this year is a leap year.

#### Month Properties

Property Name|Value Type|Description
-------------|-------------|------------
number|number|The months numerical representation.
name|string|The name of the month.
numberOfDays|number|How many days are in this month.
numberOfLeapYearDays|number|How many days are in this month during a leap year.
intercalary|boolean|If this month is considered an intercalary month or not.

#### Day Properties

Property Name|Value Type|Description
-------------|-------------|------------
number|number|The days numerical representation.

#### Time Properties

Property Name|Value Type|Description
-------------|-------------|------------
hour|string|The number of hours into the day it currently is. This result is 0 padded.
minute|string|The number of minutes into the day it currently is. This result is 0 padded.
second|string|The number of seconds into the day it currently is. This result is 0 padded.

#### Season Properties

Property Name|Value Type|Description
-------------|-------------|------------
name|string|The name of the season.
color|string|The hex color representation of the season.

### Examples

#### Hooking to

This is an example of how to listen for the hook:

```javascript
Hooks.on(SimpleCalendar.Hooks.DateTimeChange, (data) => {
    console.log(data);
});
```

#### Response Data

This is an example of the data that is passed with this hook:

```json
{
  "date": {
    "year": 2021,
    "month": 6,
    "dayOffset": 0,
    "day": 8,
    "dayOfTheWeek": 5,
    "hour": 0,
    "minute": 15,
    "second": 30,
    "yearZero": 1970,
    "weekdays": [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    "showWeekdayHeadings": true,
    "currentSeason": {
      "color": "#f3fff3",
      "startingMonth": 5,
      "startingDay": 19,
      "name": "Summer"
    },
    "isLeapYear": false,
    "monthName": "July",
    "dayDisplay": "9",
    "yearName": "",
    "yearPrefix": "",
    "yearPostfix": "",
    "display": {
      "day": "9",
      "daySuffix": "th",
      "weekday": "Friday",
      "monthName": "July",
      "month": "7",
      "year": "2021",
      "yearName": "",
      "yearPrefix": "",
      "yearPostfix": "",
      "time": "00:15:30"
    }
  },
  "diff": 1,
  "moons": [
    {
      "name": "Moon",
      "color": "#ffffff",
      "cycleLength": 29.53059,
      "cycleDayAdjust": 0.5,
      "currentPhase": {
        "name": "New Moon",
        "length": 1,
        "icon": "new",
        "singleDay": true
      }
    }
  ],
  "season": {
    "name": "Summer",
    "color": "#f3fff3"
  },
  "month": {
    "name": "July",
    "number": 7,
    "intercalary": false,
    "numberOfDays": 31,
    "numberOfLeapYearDays": 31
  },
  "day": {
    "number": 9
  },
  "time": {
    "hour": "00",
    "minute": "15",
    "second": "30"
  },
  "year": {
    "number": 2021,
    "prefix": "",
    "postfix": "",
    "isLeapYear": false
  }
}
```
## Clock Start/Stop

### When it is emitted

This event is emitted in the following cases:

- When the clock is started.
- When the clock is stopped.
- When the game is paused or unpaused.
- When a combat is started or ended in the active scene
- When a combat round is advanced.

### What is passed

When this hook is emitted it will pass a data object that contains the following properties:

Property Name|Value Type|Description
-------------|-------------|------------
started|boolean|If the clock is started and running.
stopped|boolean|If the clock is stopped and not running.
paused|boolean|If the clock is paused. The clock is paused when the game is paused or there is an active combat running in the active scene.

### Examples

#### Hooking to

This is an example of how to listen for the hook:

```javascript
Hooks.on(SimpleCalendar.Hooks.ClockStartStop, (data) => {
    console.log(data);
});
```

#### Response Data

This is an example of the data that is passed with this hook:

```json
{
  "started": false,
  "stopped": true,
  "paused": false
}
```


## Is Primary GM

### When it is emitted

This event is emitted when the current users is promoted to the primary GM role. 

This will happen 5 seconds after loading the game if no other GM is currently in the primary role.

### What is passed

Property Name|Value Type|Description
-------------|-------------|------------
isPrimaryGM|boolean|If the user is the primary gm (true).

### Examples

#### Hooking to

This is an example of how to listen for the hook:

```javascript
Hooks.on(SimpleCalendar.Hooks.PrimaryGM, (data) => {
    console.log(data);
});
```

#### Response Data

This is an example of the data that is passed with this hook:

```json
{
  "isPrimaryGM": true
}
```

# Ready

### When it is emitted

This event is emitted when Simple Calendar is fully initialized and ready to use.

For GMs this will happen up to 5 seconds after loading the game as additional checks are done to see which GM is to be considered the primary GM.

### What is passed

No data is passed when this hook is fired.

### Examples

#### Hooking to

This is an example of how to listen for the hook:

```javascript
Hooks.on(SimpleCalendar.Hooks.Ready, () => {
    console.log(`Simple Calendar is ready!`);
});
```
