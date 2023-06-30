---
id: "SimpleCalendar.Hooks"
title: "Namespace: Hooks"
sidebar_label: "Hooks"
custom_edit_url: null
pagination_next: null
pagination_prev: null
---

[SimpleCalendar](SimpleCalendar.md).Hooks

The `SimpleCalendar.Hooks` property contains a list of all hooks that the Simple Calendar module can emit, when they are emitted and what information they pass along.

## Interfaces

- [DateChangeResponse](../interfaces/SimpleCalendar.Hooks.DateChangeResponse.md)
- [IsPrimaryGmResponse](../interfaces/SimpleCalendar.Hooks.IsPrimaryGmResponse.md)

## Variables

### ClockStartStop

• `Const` **ClockStartStop**: ``"simple-calendar-clock-start-stop"``

This hook is emitted in the following cases:

- When the clock is started.
- When the clock is stopped.
- When the game is paused or unpaused.
- When a combat is started or ended in the active scene
- When a combat round is advanced.

**What is passed**: When this hook is emitted it will pass a [ClockStatus](../interfaces/SimpleCalendar.ClockStatus.md) object.

**Examples:**

**`Example`**

How to listen for the hook:
  ```javascript
Hooks.on(SimpleCalendar.Hooks.ClockStartStop, (data) => {
     console.log(data);
 });
```
Response Data:
```json
{
  "started": false,
  "stopped": true,
  "paused": false
}
```

___

### DateTimeChange

• `Const` **DateTimeChange**: ``"simple-calendar-date-time-change"``

This hook is emitted any time the current date is updated. The current date can be updated by several means:

- When the GM clicks on the "Set Current Date" button after adjusting the current date.
- When the clock is running every interval update.
- When the [setDate](SimpleCalendar.api.md#setdate) function is called.
- When the [changeDate](SimpleCalendar.api.md#changedate) function is called.
- When the game world time changed and Simple Calendar is configured to update when that changes.

**What is passed**: When this hook is emitted it will pass a [DateChangeResponse](../interfaces/SimpleCalendar.Hooks.DateChangeResponse.md) object.

**Examples:**

**`Example`**

How to listen for the hook:
  ```javascript
Hooks.on(SimpleCalendar.Hooks.DateTimeChange, (data) => {
     console.log(data);
 });
```
Response Data:
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
    "sunrise": 1622527200,
    "sunset": 1622570400,
    "midday": 1622548800,
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
  ]
}
```

___

### Init

• `Const` **Init**: ``"simple-calendar-init"``

This hook is emitted while Simple Calendar is initializing, before the module is ready to use.

**What is passed**: No data is passed when this hook is fired.

**Examples:**

**`Example`**

How to listen for the hook:
  ```javascript
Hooks.on(SimpleCalendar.Hooks.Init, () => {
     console.log(`Simple Calendar is initializing!`);
 });
```

___

### PrimaryGM

• `Const` **PrimaryGM**: ``"simple-calendar-primary-gm"``

This hook is emitted when the current users is promoted to the primary GM role.

This will happen 5 seconds after loading the game if no other GM is currently in the primary role.

**What is passed**: When this hook is emitted it will pass a [IsPrimaryGmResponse](../interfaces/SimpleCalendar.Hooks.IsPrimaryGmResponse.md) object.

**Examples:**

**`Example`**

How to listen for the hook:
  ```javascript
Hooks.on(SimpleCalendar.Hooks.PrimaryGM, (data) => {
     console.log(data);
 });
```
Response Data:
```json
{
  "isPrimaryGM": true
}
```

___

### Ready

• `Const` **Ready**: ``"simple-calendar-ready"``

This hook is emitted when Simple Calendar is fully initialized and ready to use.

For GMs this will happen up to 5 seconds after loading the game as additional checks are done to see which GM is to be considered the primary GM.

**What is passed**: No data is passed when this hook is fired.

**Examples:**

**`Example`**

How to listen for the hook:
  ```javascript
Hooks.on(SimpleCalendar.Hooks.Ready, () => {
     console.log(`Simple Calendar is ready!`);
 });
```
