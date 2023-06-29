---
id: "SimpleCalendar.SeasonData"
title: "Interface: SeasonData"
sidebar_label: "SeasonData"
custom_edit_url: null
pagination_next: null
pagination_prev: null
---

[SimpleCalendar](../namespaces/SimpleCalendar.md).SeasonData

Interface for all information about a season

## Hierarchy

- `IDataItemBase`

  ↳ **`SeasonData`**

## Properties

### color

• **color**: `string`

The color of the season

___

### customColor

• `Optional` **customColor**: `string`

The custom color for the season

**`deprecated`** This is no longer used

___

### icon

• **icon**: [`Icons`](../enums/SimpleCalendar.api.Icons.md)

The icon associated with the season

___

### id

• **id**: `string`

The unique ID of the data item

#### Inherited from

IDataItemBase.id

___

### name

• **name**: `string`

The name of the season.

#### Overrides

IDataItemBase.name

___

### numericRepresentation

• `Optional` **numericRepresentation**: `number`

The optional numeric representation of the data item

#### Inherited from

IDataItemBase.numericRepresentation

___

### startingDay

• **startingDay**: `number`

The day of the starting month this season starts on

___

### startingMonth

• **startingMonth**: `number`

The month this season starts on

___

### sunriseTime

• **sunriseTime**: `number`

The time, in seconds, that the sun rises

___

### sunsetTime

• **sunsetTime**: `number`

The time, in seconds, that the sun sets
