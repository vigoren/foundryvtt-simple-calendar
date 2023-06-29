---
id: "SimpleCalendar.Hooks.DateChangeResponse"
title: "Interface: DateChangeResponse"
sidebar_label: "DateChangeResponse"
custom_edit_url: null
pagination_next: null
pagination_prev: null
---

[SimpleCalendar](../namespaces/SimpleCalendar.md).[Hooks](../namespaces/SimpleCalendar.Hooks.md).DateChangeResponse

The structure of the object passed when the Simple Calendar module emits a [SimpleCalendar.Hooks.DateTimeChange](../namespaces/SimpleCalendar.Hooks.md#datetimechange) hook

## Properties

### date

• **date**: [`DateData`](SimpleCalendar.DateData.md)

This contains all information about the current date.

___

### day

• **day**: [`Day`](SimpleCalendar.Hooks.Day.md)

**`deprecated`** Please use the [DateChangeResponse.date](SimpleCalendar.Hooks.DateChangeResponse.md#date) property. This will be removed when Foundry v10 stable is released.

___

### diff

• **diff**: `number`

This contains the difference in seconds from the previous date and time to this new date and time.

___

### month

• **month**: [`Month`](SimpleCalendar.Hooks.Month.md)

**`deprecated`** Please use the [DateChangeResponse.date](SimpleCalendar.Hooks.DateChangeResponse.md#date) property. This will be removed when Foundry v10 stable is released.

___

### moons

• **moons**: [`MoonData`](SimpleCalendar.MoonData.md)[]

___

### season

• **season**: [`Season`](SimpleCalendar.Hooks.Season.md)

**`deprecated`** Please use the [DateChangeResponse.date](SimpleCalendar.Hooks.DateChangeResponse.md#date) property. This will be removed when Foundry v10 stable is released.

___

### time

• **time**: [`Time`](SimpleCalendar.Hooks.Time.md)

**`deprecated`** Please use the [DateChangeResponse.date](SimpleCalendar.Hooks.DateChangeResponse.md#date) property. This will be removed when Foundry v10 stable is released.

___

### year

• **year**: [`Year`](SimpleCalendar.Hooks.Year.md)

**`deprecated`** Please use the [DateChangeResponse.date](SimpleCalendar.Hooks.DateChangeResponse.md#date) property. This will be removed when Foundry v10 stable is released.
