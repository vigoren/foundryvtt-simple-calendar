---
id: "SimpleCalendar.CalendarData"
title: "Interface: CalendarData"
sidebar_label: "CalendarData"
custom_edit_url: null
pagination_next: null
pagination_prev: null
---

[SimpleCalendar](../namespaces/SimpleCalendar.md).CalendarData

Interface for all information about a calendar

## Hierarchy

- `IDataItemBase`

  ↳ **`CalendarData`**

## Properties

### currentDate

• `Optional` **currentDate**: [`CurrentDateData`](SimpleCalendar.CurrentDateData.md)

The current date of the calendar.

___

### general

• `Optional` **general**: [`GeneralSettingsData`](SimpleCalendar.GeneralSettingsData.md)

The general settings for the calendar.

___

### generalSettings

• `Optional` **generalSettings**: [`GeneralSettingsData`](SimpleCalendar.GeneralSettingsData.md)

**`deprecated`** Please use [CalendarData.general](SimpleCalendar.CalendarData.md#general) instead. This will be removed when Foundry v10 Stable is released.

___

### id

• **id**: `string`

The unique ID of the data item

#### Inherited from

IDataItemBase.id

___

### leapYear

• `Optional` **leapYear**: [`LeapYearData`](SimpleCalendar.LeapYearData.md)

The leap year settings for the calendar.

___

### leapYearSettings

• `Optional` **leapYearSettings**: [`LeapYearData`](SimpleCalendar.LeapYearData.md)

**`deprecated`** Please use [CalendarData.leapYear](SimpleCalendar.CalendarData.md#leapyear) instead. This will be removed when Foundry v10 Stable is released.

___

### monthSettings

• `Optional` **monthSettings**: [`MonthData`](SimpleCalendar.MonthData.md)[]

**`deprecated`** Please use [CalendarData.months](SimpleCalendar.CalendarData.md#months) instead. This will be removed when Foundry v10 Stable is released.

___

### months

• `Optional` **months**: [`MonthData`](SimpleCalendar.MonthData.md)[]

An array of month settings for each month of the calendar.

___

### moonSettings

• `Optional` **moonSettings**: [`MoonData`](SimpleCalendar.MoonData.md)[]

**`deprecated`** Please use [CalendarData.moons](SimpleCalendar.CalendarData.md#moons) instead. This will be removed when Foundry v10 Stable is released.

___

### moons

• `Optional` **moons**: [`MoonData`](SimpleCalendar.MoonData.md)[]

An array of moon settings for each moon of the calendar.

___

### name

• `Optional` **name**: `string`

The optional name of the data item

#### Inherited from

IDataItemBase.name

___

### noteCategories

• `Optional` **noteCategories**: [`NoteCategory`](SimpleCalendar.NoteCategory.md)[]

An array of note categories for the calendar.

___

### numericRepresentation

• `Optional` **numericRepresentation**: `number`

The optional numeric representation of the data item

#### Inherited from

IDataItemBase.numericRepresentation

___

### seasonSettings

• `Optional` **seasonSettings**: [`SeasonData`](SimpleCalendar.SeasonData.md)[]

**`deprecated`** Please use [CalendarData.seasons](SimpleCalendar.CalendarData.md#seasons) instead. This will be removed when Foundry v10 Stable is released.

___

### seasons

• `Optional` **seasons**: [`SeasonData`](SimpleCalendar.SeasonData.md)[]

An array of season settings for each season of the calendar.

___

### time

• `Optional` **time**: [`TimeData`](SimpleCalendar.TimeData.md)

The time settings for the calendar.

___

### timeSettings

• `Optional` **timeSettings**: [`TimeData`](SimpleCalendar.TimeData.md)

**`deprecated`** Please use [CalendarData.time](SimpleCalendar.CalendarData.md#time) instead. This will be removed when Foundry v10 Stable is released.

___

### weekdaySettings

• `Optional` **weekdaySettings**: [`WeekdayData`](SimpleCalendar.WeekdayData.md)[]

**`deprecated`** Please use [CalendarData.weekdays](SimpleCalendar.CalendarData.md#weekdays) instead. This will be removed when Foundry v10 Stable is released.

___

### weekdays

• `Optional` **weekdays**: [`WeekdayData`](SimpleCalendar.WeekdayData.md)[]

An array of weekday settings for each weekday of the calendar.

___

### year

• `Optional` **year**: [`YearData`](SimpleCalendar.YearData.md)

The year settings for the calendar.

___

### yearSettings

• `Optional` **yearSettings**: [`YearData`](SimpleCalendar.YearData.md)

**`deprecated`** Please use [CalendarData.year](SimpleCalendar.CalendarData.md#year) instead. This will be removed when Foundry v10 Stable is released.
