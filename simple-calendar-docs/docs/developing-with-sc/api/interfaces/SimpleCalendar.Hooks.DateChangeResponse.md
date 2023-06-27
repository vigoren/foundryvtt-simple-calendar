---
id: "SimpleCalendar.Hooks.DateChangeResponse"
title: "Interface: DateChangeResponse"
sidebar_label: "DateChangeResponse"
custom_edit_url: null
pagination_next: null
pagination_prev: null
---

[SimpleCalendar](../namespaces/SimpleCalendar.md).[Hooks](../namespaces/SimpleCalendar.Hooks.md).DateChangeResponse

The structure of the object passed when the Simple Calendar module emits a [DateTimeChange](../namespaces/SimpleCalendar.Hooks.md#datetimechange) hook

## Properties

### date

• **date**: [`DateData`](SimpleCalendar.DateData.md)

This contains all information about the current date.

___

### diff

• **diff**: `number`

This contains the difference in seconds from the previous date and time to this new date and time.

___

### moons

• **moons**: [`MoonData`](SimpleCalendar.MoonData.md)[]
