---
id: "SimpleCalendar.DateData"
title: "Interface: DateData"
sidebar_label: "DateData"
custom_edit_url: null
pagination_next: null
pagination_prev: null
---

[SimpleCalendar](../namespaces/SimpleCalendar.md).DateData

Object containing all information about a date and time. This can either be the current date and time or the date and time calculated from a timestamp

## Properties

### currentSeason

• **currentSeason**: [`SeasonData`](SimpleCalendar.SeasonData.md)

The season information for this date

___

### day

• **day**: `number`

The index of the day in the month for this date.

___

### dayOfTheWeek

• **dayOfTheWeek**: `number`

The day of the week the day falls on.

___

### dayOffset

• **dayOffset**: `number`

The number of days that the months days are offset by.

___

### display

• **display**: [`DateDisplayData`](SimpleCalendar.DateDisplayData.md)

All the formatted strings for displaying this date

___

### hour

• **hour**: `number`

The hour portion of the time

___

### isLeapYear

• **isLeapYear**: `boolean`

If this date falls on a leap year.

___

### midday

• **midday**: `number`

The timestamp of when it is considered midday for this date.

___

### minute

• **minute**: `number`

The minute portion of the time

___

### month

• **month**: `number`

The index of the month in the year for this date.

___

### second

• **second**: `number`

The second portion of the time

___

### showWeekdayHeadings

• **showWeekdayHeadings**: `boolean`

If to show the weekday headings for the month.

___

### sunrise

• **sunrise**: `number`

The timestamp of when the sun rises for this date.

___

### sunset

• **sunset**: `number`

The timestamp of when the sun sets for this date.

___

### weekdays

• **weekdays**: `string`[]

A list of weekday names.

___

### year

• **year**: `number`

The year for this date.

___

### yearZero

• **yearZero**: `number`

The year that is considered to be the starting year. This is the year used to base calculating timestamps from
