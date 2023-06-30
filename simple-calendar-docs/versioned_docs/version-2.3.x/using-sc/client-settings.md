 # Client Settings

These are settings that affects how Simple Calendar works or is displayed for players using this browser. They do not affect any other players. These settings can also be found under FoundryVTT's module settings.

![](../images/client-settings.png)

## Theme

Choose the visual theme to apply to the Simple Calendar module to change how it looks. Check out the list of [available themes](themes.md)!

## Open on Load

Will open up the Simple Calendar application when foundry is loaded.

## Open In Compact View

When the Simple Calendar application is opened it will open in the compact view by default.

## Remember Position

Simple Calendar will remember where it was last positioned and place itself there.

## Remember Compact Position

Simple Calendar will remember where the compact version was last positioned and place itself there when in compact mode. This is a separate position from the full version.

:::tip
This is useful if you want to put the compact view in a corner and when switching to the full view then back not having to reposition the compact window! 
:::

## Note Reminder Notification

Choose how note reminders are sent to you. The options are:

- **Send a chat whisper with details about the note**: A whisper is sent to the player with details about the note and a link to open the note.
- **Automatically open the note**: The [note details](notes/index.md#note-details) will automatically open when the reminder is triggered.

## Side Drawer Open Direction

The direction from the main calendar that the side drawers will open. The side drawers contain the calendar list, note list and note search. The options are: Right, Left and Down.

## Always Show Note List

This setting will make it so the note list will always be visible and can not be closed. The only exception is if the calendar list or note search are opened they will open over top of the note list, but when closed the note list will remain visible.

## Persistent Open

When enabled this setting will remove the close button from the calendar window and prevent the escape key from closing it. The button under Journal Notes in the left toolbar then becomes a toggle to open and close the calendar.

## Compact View Scale

This setting lets you change the scale at which the compact view is displayed at. You can use this to make the compact view appear larger or smaller. The number represents the percentage of the scale size when compared to the default size, 100%. The range goes in increments of 10 from 70% to 200%.
