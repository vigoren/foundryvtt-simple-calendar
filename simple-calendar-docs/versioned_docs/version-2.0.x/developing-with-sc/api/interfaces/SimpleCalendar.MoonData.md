---
id: "SimpleCalendar.MoonData"
title: "Interface: MoonData"
sidebar_label: "MoonData"
custom_edit_url: null
pagination_next: null
pagination_prev: null
---

[SimpleCalendar](../namespaces/SimpleCalendar.md).MoonData

Interface for all information about a moon

## Hierarchy

- `IDataItemBase`

  ↳ **`MoonData`**

## Properties

### color

• **color**: `string`

The color associated with the moon.

___

### currentPhase

• `Optional` **currentPhase**: [`MoonPhase`](SimpleCalendar.MoonPhase.md)

The moon phase for the current date.

___

### cycleDayAdjust

• **cycleDayAdjust**: `number`

A way to nudge the cycle calculations to align with correct dates.

___

### cycleLength

• **cycleLength**: `number`

How many days it takes the moon to complete 1 cycle.

___

### firstNewMoon

• **firstNewMoon**: [`FirstNewMoonDate`](SimpleCalendar.FirstNewMoonDate.md)

When the first new moon was. This is used to calculate the current phase for a given day.

___

### id

• **id**: `string`

The unique ID of the data item

#### Inherited from

IDataItemBase.id

___

### name

• **name**: `string`

The name of the moon.

#### Overrides

IDataItemBase.name

___

### numericRepresentation

• `Optional` **numericRepresentation**: `number`

The optional numeric representation of the data item

#### Inherited from

IDataItemBase.numericRepresentation

___

### phases

• **phases**: [`MoonPhase`](SimpleCalendar.MoonPhase.md)[]

The different phases of the moon.
