---
id: "SimpleCalendar.MonthData"
title: "Interface: MonthData"
sidebar_label: "MonthData"
custom_edit_url: null
pagination_next: null
pagination_prev: null
---

[SimpleCalendar](../namespaces/SimpleCalendar.md).MonthData

Interface for all information about a month

## Hierarchy

- `IDataItemBase`

  ↳ **`MonthData`**

## Properties

### abbreviation

• **abbreviation**: `string`

The abbreviated name of the month.

#### Overrides

IDataItemBase.abbreviation

___

### description

• **description**: `string`

The description of the month.

#### Overrides

IDataItemBase.description

___

### id

• **id**: `string`

The unique ID of the data item

#### Inherited from

IDataItemBase.id

___

### intercalary

• **intercalary**: `boolean`

If this month is an intercalary month.

___

### intercalaryInclude

• **intercalaryInclude**: `boolean`

If this month is intercalary then if its days should be included in total day calculations.

___

### name

• **name**: `string`

The name of the month.

#### Overrides

IDataItemBase.name

___

### numberOfDays

• **numberOfDays**: `number`

The number of days this month has during a non leap year.

___

### numberOfLeapYearDays

• **numberOfLeapYearDays**: `number`

The number of days this month has during a leap year.

___

### numericRepresentation

• **numericRepresentation**: `number`

The number associated with the display of this month.

#### Overrides

IDataItemBase.numericRepresentation

___

### numericRepresentationOffset

• **numericRepresentationOffset**: `number`

The amount to offset day numbers by for this month.

___

### showAdvanced

• `Optional` **showAdvanced**: `boolean`

If to show the advanced options, this is not saved

#### Inherited from

IDataItemBase.showAdvanced

___

### startingWeekday

• **startingWeekday**: ``null`` \| `number`

The day of the week this month should always start on.
