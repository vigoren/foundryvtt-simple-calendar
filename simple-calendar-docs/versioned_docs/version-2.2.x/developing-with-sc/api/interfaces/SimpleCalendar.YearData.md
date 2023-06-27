---
id: "SimpleCalendar.YearData"
title: "Interface: YearData"
sidebar_label: "YearData"
custom_edit_url: null
pagination_next: null
pagination_prev: null
---

[SimpleCalendar](../namespaces/SimpleCalendar.md).YearData

Interface for all information about a year

## Hierarchy

- `IDataItemBase`

  ↳ **`YearData`**

## Properties

### abbreviation

• `Optional` **abbreviation**: `string`

The abbreviated name of the data item.

#### Inherited from

IDataItemBase.abbreviation

___

### description

• `Optional` **description**: `string`

The optional description of the data item

#### Inherited from

IDataItemBase.description

___

### firstWeekday

• **firstWeekday**: `number`

The day of the week the first day of the first month of year zero starts on.

___

### id

• **id**: `string`

The unique ID of the data item

#### Inherited from

IDataItemBase.id

___

### name

• `Optional` **name**: `string`

The optional name of the data item

#### Inherited from

IDataItemBase.name

___

### numericRepresentation

• **numericRepresentation**: `number`

The number representing the year.

#### Overrides

IDataItemBase.numericRepresentation

___

### postfix

• **postfix**: `string`

A string to append to the end of a year's number.

___

### prefix

• **prefix**: `string`

A string to append to the beginning of a year's number.

___

### showAdvanced

• `Optional` **showAdvanced**: `boolean`

If to show the advanced options, this is not saved

#### Inherited from

IDataItemBase.showAdvanced

___

### showWeekdayHeadings

• **showWeekdayHeadings**: `boolean`

If to show weekday headings on the calendar.

___

### yearNames

• **yearNames**: `string`[]

A list of names to use for years.

___

### yearNamesStart

• **yearNamesStart**: `number`

The year to start applying the year names.

___

### yearNamingRule

• **yearNamingRule**: [`YearNamingRules`](../enums/SimpleCalendar.api.YearNamingRules.md)

How to calculate what year name to give to a year.

___

### yearZero

• **yearZero**: `number`

What is considered to be the first year when calculating timestamps.
