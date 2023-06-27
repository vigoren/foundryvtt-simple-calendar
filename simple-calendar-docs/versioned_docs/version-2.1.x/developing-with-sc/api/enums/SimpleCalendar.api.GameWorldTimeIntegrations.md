---
id: "SimpleCalendar.api.GameWorldTimeIntegrations"
title: "Enumeration: GameWorldTimeIntegrations"
sidebar_label: "GameWorldTimeIntegrations"
custom_edit_url: null
pagination_next: null
pagination_prev: null
---

[SimpleCalendar](../namespaces/SimpleCalendar.md).[api](../namespaces/SimpleCalendar.api.md).GameWorldTimeIntegrations

The different game world integrations offered

## Enumeration Members

### Mixed

• **Mixed** = ``"mixed"``

This option is a blend of the self and third party options. Simple calendar can change the game world time and changes made by other modules are reflected in Simple Calendar. This setting is ideal if you want to use Simple Calendar and another module to change the game time.

**Update Game World Time**: Will update the game world time.

**Whe Game World Time Is Updated**: Will update its own time based on changes to the game world time, following what other modules say the time is.

___

### None

• **None** = ``"none"``

Simple Calendar does not interact with the game world time at all. This setting is ideal if you want to keep Simple Calendar isolated from other modules.

**Update Game World Time**: Does not update the game world time.

**Whe Game World Time Is Updated**: Simple Calendar is not updated when the game world time is updated by something else.

___

### Self

• **Self** = ``"self"``

Treats Simple Calendar as the authority source for the game world time. This setting is ideal when you want Simple Calendar to be in control of the games time and don't want other modules updating Simple Calendar.

**Update Game World Time**: Updates the game world time to match what is in Simple Calendar.

**Whe Game World Time Is Updated**: Combat round changes will update Simple Calendars time. Simple Calendar will ignore updates from all others modules.

___

### ThirdParty

• **ThirdParty** = ``"third-party"``

This will instruct Simple Calendar to just display the Time in the game world time. All date changing controls are disabled and the changing of time relies 100% on another module. This setting is ideal if you are just want to use Simple Calenar to display the date in calendar form and/or take advantage of the notes.

**Update Game World Time**: Does not update the game world time.

**Whe Game World Time Is Updated**: Updates its display everytime the game world time is changed, following what the other modules say the time is.
