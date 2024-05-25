---
id: "SimpleCalendar"
title: "Namespace: SimpleCalendar"
sidebar_label: "SimpleCalendar"
sidebar_position: 0
custom_edit_url: null
pagination_next: null
pagination_prev: null
---

The `SimpleCalendar` namespace is used to house all functionality that other modules, systems and macros can access for interacting with the Simple Calendar module.

## Namespaces

- [Hooks](SimpleCalendar.Hooks.md)
- [api](SimpleCalendar.api.md)

## Interfaces

- [CalendarData](../interfaces/SimpleCalendar.CalendarData.md)
- [ClockStatus](../interfaces/SimpleCalendar.ClockStatus.md)
- [CurrentDateData](../interfaces/SimpleCalendar.CurrentDateData.md)
- [DateData](../interfaces/SimpleCalendar.DateData.md)
- [DateDisplayData](../interfaces/SimpleCalendar.DateDisplayData.md)
- [DayData](../interfaces/SimpleCalendar.DayData.md)
- [FirstNewMoonDate](../interfaces/SimpleCalendar.FirstNewMoonDate.md)
- [GeneralSettingsData](../interfaces/SimpleCalendar.GeneralSettingsData.md)
- [LeapYearData](../interfaces/SimpleCalendar.LeapYearData.md)
- [MonthData](../interfaces/SimpleCalendar.MonthData.md)
- [MoonData](../interfaces/SimpleCalendar.MoonData.md)
- [MoonPhase](../interfaces/SimpleCalendar.MoonPhase.md)
- [NoteCategory](../interfaces/SimpleCalendar.NoteCategory.md)
- [NoteData](../interfaces/SimpleCalendar.NoteData.md)
- [SeasonData](../interfaces/SimpleCalendar.SeasonData.md)
- [TimeData](../interfaces/SimpleCalendar.TimeData.md)
- [WeekdayData](../interfaces/SimpleCalendar.WeekdayData.md)
- [YearData](../interfaces/SimpleCalendar.YearData.md)

## Type Aliases

### Date

Ƭ **Date**: `Object`

Type representing a date within Simple Calendar

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `day` | `number` | The day value of the date. The day is index based, meaning the first day of the month will have a value of 0. |
| `month` | `number` | The month value of the date. The month is index based, meaning the first month of a year will have a value of 0. |
| `year` | `number` | The year value of the date. |

___

### DateChangeOptions

Ƭ **DateChangeOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bypassPermissionCheck?` | `boolean` |
| `fromCalSync?` | `boolean` |
| `save?` | `boolean` |
| `showWarning?` | `boolean` |
| `sync?` | `boolean` |
| `updateApp?` | `boolean` |
| `updateMonth?` | `boolean` |

___

### DateTime

Ƭ **DateTime**: [`Date`](SimpleCalendar.md#date) & [`Time`](SimpleCalendar.md#time)

Type representing a date and time

___

### DateTimeParts

Ƭ **DateTimeParts**: `Partial`\<[`Date`](SimpleCalendar.md#date)\> & `Partial`\<[`Time`](SimpleCalendar.md#time)\>

Type representing a date and time with optional parameters

___

### Time

Ƭ **Time**: `Object`

Type representing a time within Simple Calendar

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `hour` | `number` | The hour value of the time. |
| `minute` | `number` | The minute value of the time. |
| `seconds` | `number` | The second value of the time. |
