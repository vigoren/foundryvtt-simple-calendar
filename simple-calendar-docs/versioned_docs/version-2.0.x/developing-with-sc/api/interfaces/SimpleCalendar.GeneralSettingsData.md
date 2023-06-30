---
id: "SimpleCalendar.GeneralSettingsData"
title: "Interface: GeneralSettingsData"
sidebar_label: "GeneralSettingsData"
custom_edit_url: null
pagination_next: null
pagination_prev: null
---

[SimpleCalendar](../namespaces/SimpleCalendar.md).GeneralSettingsData

Interface for all general settings for a calendar in the Simple Calendar module

## Hierarchy

- `IDataItemBase`

  ↳ **`GeneralSettingsData`**

## Properties

### dateFormat

• **dateFormat**: `Object`

Formats used for display date and time information

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `date` | `string` | The format string used to display the date |
| `monthYear` | `string` | The format string used to display the month and year at the top of a calendar display |
| `time` | `string` | The format string used to display the time |

___

### gameWorldTimeIntegration

• **gameWorldTimeIntegration**: [`GameWorldTimeIntegrations`](../enums/SimpleCalendar.api.GameWorldTimeIntegrations.md)

How Simple Calendar interacts with the game world time

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

### noteDefaultVisibility

• **noteDefaultVisibility**: `boolean`

The default visibility for new notes added to the calendar

___

### numericRepresentation

• `Optional` **numericRepresentation**: `number`

The optional numeric representation of the data item

#### Inherited from

IDataItemBase.numericRepresentation

___

### pf2eSync

• **pf2eSync**: `boolean`

If the Pathfinder 2e world clock sync is turned on

___

### playersAddNotes

• `Optional` **playersAddNotes**: `boolean`

**`deprecated`** Old 'Players Can Add Notes' permission setting, only used for very old setting files

___

### postNoteRemindersOnFoundryLoad

• **postNoteRemindersOnFoundryLoad**: `boolean`

If note reminders should be PM'd to players when they log into foundry

___

### showClock

• **showClock**: `boolean`

If to show the clock below the calendar
