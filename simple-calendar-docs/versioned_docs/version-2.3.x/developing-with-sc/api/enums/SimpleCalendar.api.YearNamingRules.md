---
id: "SimpleCalendar.api.YearNamingRules"
title: "Enumeration: YearNamingRules"
sidebar_label: "YearNamingRules"
custom_edit_url: null
pagination_next: null
pagination_prev: null
---

[SimpleCalendar](../namespaces/SimpleCalendar.md).[api](../namespaces/SimpleCalendar.api.md).YearNamingRules

The different rules used for determining how to name years

## Enumeration Members

### Default

• **Default** = ``"default"``

Names from the list of year names are used in order. If there are not enough names in the list for the current year then the last name in the list is used.

___

### Random

• **Random** = ``"random"``

Names from the list of year names are randomly assigned to years

**`Remarks`**

Simple Calendar does attempt to keep the same name for years, so switching between years should not result in a different name every time.
If a name is added or removed from the list of year names, the year names are randomly assigned again to years. This can result in a different name being used for the current year.

___

### Repeat

• **Repeat** = ``"repeat"``

Names from the list of year names are used in order. If there are not enough names in the list for the current year then the list is repeated.
