---
id: "SimpleCalendar.api.MoonYearResetOptions"
title: "Enumeration: MoonYearResetOptions"
sidebar_label: "MoonYearResetOptions"
custom_edit_url: null
pagination_next: null
pagination_prev: null
---

[SimpleCalendar](../namespaces/SimpleCalendar.md).[api](../namespaces/SimpleCalendar.api.md).MoonYearResetOptions

These options are used to tell Simple Calendar when to reset the year portion of the reference new moon.

**`remarks`**
The reference new moon is any date a new moon occurred on in the calendar. This date is then used as a starting point to calculate the different phases of the moon. Any phase in any year can be calculated from this value, and it does not need to be updated after its initial setting.

## Enumeration Members

### LeapYear

• **LeapYear**

Reset the year of the reference new moon every year that is a leap year

___

### None

• **None**

Do not reset the year of the reference new moon

___

### XYears

• **XYears**

Reset the year of the reference new moon by every x number of years
