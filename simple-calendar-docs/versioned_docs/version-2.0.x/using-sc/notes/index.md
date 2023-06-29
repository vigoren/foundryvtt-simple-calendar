# Notes

Notes are great ways to add reminders or events to the calendar!

## Where Are They Saved?

Notes are stored as [journal entries](https://foundryvtt.com/article/journal/) in their own folder in the journal directory. By default, this folder is hidden from view but a Gamemaster [can enable it to be visible](../../global-configuration/settings.md) if they wish.

:::caution Important
Only notes in this folder will be read by Simple Calendar! If notes are moved from this folder they will not appear in the module.
:::

## Note List

![](../../images/viewing-notes.png)

To view the list of notes simply click on the Note Buttons in the [Action Buttons](../calendar-view.md#action-buttons) bar next to the calendar to open the note list.

:::tip
The note list can always be open by enabling the [Always Show Note List](../client-settings#always-show-note-list) client setting! Each player can configure this setting.
:::

This list shows all notes that are visible to the current player for the specified day. Each note will show the title as well as some quick details about the note. These details can be:

| Detail                               | Description                                                                                                                                                                                                                                                                                                                                           |
|--------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Bell Icon                            | This will show on notes that the current player wants to be reminded about.<br/>![](../../images/note-list-reminder.png)                                                                                                                                                                                                                              |
| Time                                 | This will show what time the note takes place at on the day<br/>![](../../images/note-list-time-range.png)<br/>or the text `all day` if the note doesn't have a specific time<br/>![](../../images/note-list-all-day.png)<br/>or it will show a date range if the note takes place over multiple days.<br/>![](../../images/note-list-date-range.png) |
| Author                               | This will show who authored the note. If the author says `System` then the note was included as part of a predefined calendar.<br/>![](../../images/note-list-author.png)                                                                                                                                                                             |
| Categories                           | All of the note categories associated with the note will also be displayed.<br/>![](../../images/note-list-category.png)                                                                                                                                                                                                                              |
| Player Visible<br/>(Gamemaster Only) | This icon will show only for Gamemasters but indicate if a note is visible to one or more players or if only the GM(s) can see the note.<br/>![](media://note-list-not-player-visible.png)<br/>![](media://note-list-player-visible.png)                                                                                                              |
| Macro Icon                           | This icon will show only for Gamemasters and authors of the note. It indicates if a macro has been set to trigger when the calendars date and time reach the notes date and time.<br/>![](../../images/note-list-macro.png)                                                                                                                           |
| Sorting Icon                         | If you are the Gamemaster or the Gamemaster has given a user role permission to change the order of notes on a day, there will be a sort icon displayed. Clicking this icon and dragging the note up or down will change the order the notes are displayed on that day.<br/>![](../../images/note-list-reorder.png)                                   |

## Opening A Note

Opening a note is very simple, moving your mouse pointer over a note in the list of notes will change the background color. Clicking on that note will then open the [notes details](#note-details).

![](../../images/note-list-hover.png)

## Note Details

The note details dialog is a customized journal sheet that displays all the information about a note.

![](../../images/note-details.png)

| Detail          | Description                                                                                                                                                                                                                                                                     |
|-----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Note Title      | This is the title of the note.                                                                                                                                                                                                                                                  |
| Date and Time   | This shows the date and time of the note.                                                                                                                                                                                                                                       |
| Note Repeats    | If this note is set up to repeat (such as a yearly holiday) this will show how often the note is repeated.                                                                                                                                                                      |
| Note Author     | This shows who authored the note.                                                                                                                                                                                                                                               |
| Note Macro      | This will show only for Gamemasters and authors of the note. It indicates if a macro, and shows the name of that macro, has been set to trigger when the calendars date and time reach the notes date and time.                                                                 |
| Reminder Button | This button can be clicked to toggle if to be reminded about this note. A grey bell means no reminder, a green bell means remind me. For more details about note reminders view [this section](#note-reminders).                                                                |
| Note Categories | Any categories assigned to the note will be shown here.                                                                                                                                                                                                                         |
| Note Content    | This is the content of the note page that is currently selected.                                                                                                                                                                                                                | |


## Note Reminders

Users can tell Simple Calendar that they would like to be reminded about certain notes when the in game time meets or passes the time of the note.

When a reminder is to be sent, Simple Calendar will send you a whisper in Foundry's chat reminding you about this note.


