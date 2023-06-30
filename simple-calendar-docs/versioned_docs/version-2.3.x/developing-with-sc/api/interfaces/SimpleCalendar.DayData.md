---
id: "SimpleCalendar.DayData"
title: "Interface: DayData"
sidebar_label: "DayData"
custom_edit_url: null
pagination_next: null
pagination_prev: null
---

[SimpleCalendar](../namespaces/SimpleCalendar.md).DayData

Interface for all information about a day

## Hierarchy

- `IDataItemBase`

  ↳ **`DayData`**

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

### id

• **id**: `string`

The unique ID of the data item

#### Inherited from

IDataItemBase.id

___

### name

• **name**: `string`

The name of the day, at the moment it is just the day number in string form.

#### Overrides

IDataItemBase.name

___

### numericRepresentation

• **numericRepresentation**: `number`

The number associated with the day.

#### Overrides

IDataItemBase.numericRepresentation

___

### showAdvanced

• `Optional` **showAdvanced**: `boolean`

If to show the advanced options, this is not saved

#### Inherited from

IDataItemBase.showAdvanced
