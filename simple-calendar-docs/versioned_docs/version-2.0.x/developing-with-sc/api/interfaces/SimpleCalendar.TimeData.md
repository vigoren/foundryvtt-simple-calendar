---
id: "SimpleCalendar.TimeData"
title: "Interface: TimeData"
sidebar_label: "TimeData"
custom_edit_url: null
pagination_next: null
pagination_prev: null
---

[SimpleCalendar](../namespaces/SimpleCalendar.md).TimeData

Interface for all information about time

## Hierarchy

- `IDataItemBase`

  ↳ **`TimeData`**

## Properties

### gameTimeRatio

• **gameTimeRatio**: `number`

When running the clock for every second that passes in the real world how many seconds pass in game.

___

### hoursInDay

• **hoursInDay**: `number`

The number of hours in a single day.

___

### id

• **id**: `string`

The unique ID of the data item

#### Inherited from

IDataItemBase.id

___

### minutesInHour

• **minutesInHour**: `number`

The number of minutes in a single hour.

___

### name

• `Optional` **name**: `string`

The optional name of the data item

#### Inherited from

IDataItemBase.name

___

### numericRepresentation

• `Optional` **numericRepresentation**: `number`

The optional numeric representation of the data item

#### Inherited from

IDataItemBase.numericRepresentation

___

### secondsInMinute

• **secondsInMinute**: `number`

The number of seconds in a single minute.

___

### unifyGameAndClockPause

• **unifyGameAndClockPause**: `boolean`

If to start/stop the clock when the game is unpaused/paused.

___

### updateFrequency

• **updateFrequency**: `number`

How often (in real world seconds) to update the time while the clock is running.
