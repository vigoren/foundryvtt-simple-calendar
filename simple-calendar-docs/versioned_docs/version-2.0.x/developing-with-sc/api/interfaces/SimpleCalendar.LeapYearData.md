---
id: "SimpleCalendar.LeapYearData"
title: "Interface: LeapYearData"
sidebar_label: "LeapYearData"
custom_edit_url: null
pagination_next: null
pagination_prev: null
---

[SimpleCalendar](../namespaces/SimpleCalendar.md).LeapYearData

Interface for all information about how leap years are set up

## Hierarchy

- `IDataItemBase`

  ↳ **`LeapYearData`**

## Properties

### customMod

• **customMod**: `number`

The number of years that a leap year happens when the rule is set to 'custom'.

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

• `Optional` **numericRepresentation**: `number`

The optional numeric representation of the data item

#### Inherited from

IDataItemBase.numericRepresentation

___

### rule

• **rule**: [`LeapYearRules`](../enums/SimpleCalendar.api.LeapYearRules.md)

This is the leap year rule to follow.
