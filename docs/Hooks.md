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
DateTimeChange|`"simple-calendar-date-time-change"`|This hook is emitted any time the current date is updated.

## Date/Time Change

### When it is emitted
This hook is emitted any time the current date is updated. The current date can be updated by several means:

- When the GM clicks on the "[Set Current Date](./docs/UpdatingDateTime.md#date-controls)" button after adjusting the current date.
- When the [Set Date/Time macro](./docs/Macros.md#set-date-and-time) is called.
- When the [Change Date/Time macro](./docs/Macros.md#change-date-time) is called.
- When importing settings from [about-time](./docs/Configuration.md#about-time) or [Calendar/Weather](./docs/Configuration.md#calendarweather).
- When the [game world time](./docs/Configuration.md#game-world-time-integration) has changed and Simple Calendar is configured to update when that changes.

### What is passed

When this hook is emitted it will pass a data object that contains information about the new current day. The object will have these top level properties:

Property Name|Default Value|Description
-------------|-------------|------------
year|`{}` - Empty Object|This property will contain all information about the current year.<br/>For a breakdown of that information [see below](#year-properties).
month|`{}` - Empty Object|This property will contain all information about the current month.<br/>For a breakdown of that information [see below](#month-properties).
day|`{}` - Empty Object|This property will contain all information about the current day.<br/>For a breakdown of that information [see below](#day-properties).
time|`{}` - Empty Object|This property will contain all information about the current time.<br/>For a breakdown of that information [see below](#time-properties).
season|`{}` - Empty Object|This property will contain all information about the current season.<br/>For a breakdown of that information [see below](#season-properties).
moons|`[]` - Empty Array|This property will contain all information about the current moons.<br/>For a breakdown of that information [see below](#moon-properties).


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

#### Moon Properties

The moon properties is an array of moon objects, one for every moon in the calendar. The moon object is detailed below:

Property Name|Value Type|Description
-------------|-------------|------------
name|string|The name of the moon.
color|string|The hex color representation of the moon.
cycleLength|number|The number of calendar days for 1 cycle of the moon.
cycleDayAdjust|number|A entered adjustment used when calculating the current day of a cycle.
currentPhase|object|An object containing details about the phase the moon is in on this day.

#### Moon Phase Properties

Property Name|Value Type|Description
-------------|-------------|------------
name|string|The name of this moon phase.
icon|string|The css class associated with this moons phase to give the proper icon.
length|number|How many days of the cycle this phase lasts.
singleDay|boolean|If this phase should only happen on one day.


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

```javascript
{
    "year": {
        "number": 2021,
        "prefix": "",
        "postfix": "",
        "isLeapYear": false
    },
    "month": {
        "name": "April",
        "number": 4,
        "intercalary": false,
        "numberOfDays": 30,
        "numberOfLeapYearDays": 30
    },
    "day": {
        "number": 13
    },
    "time": {
        "hour": "00",
        "minute": "00",
        "second": "56"
    },
    "season": {
        "name": "Spring",
        "color": "#fffce8"
    },
    "moons": [
        {
            "name": "Moon",
            "color": "#ffffff",
            "cycleLength": 29.53059,
            "cycleDayAdjust": 0.5,
            "currentPhase": {
                "name": "Waxing Crescent",
                "length": 6.3826,
                "icon": "waxing-crescent",
                "singleDay": false
            }
        }
    ]
}
```
