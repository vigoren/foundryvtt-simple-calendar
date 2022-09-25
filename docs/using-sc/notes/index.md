Notes are great ways to add reminders or events.

Notes are stored as journal entries in their own folder in the journal directory. By default, this folder is hidden from view but a GM {@page ../../global-configuration/settings.md can enable it to be visible} if they wish.

**Important**: Only notes in this folder will be read by Simple Calendar! If notes are moved from this folder they will not appear in the module.

- [Viewing Notes](#viewing-notes)
  - [Note List](#note-list)
  - [Opening A Note](#opening-a-note)
  - [Note Details](#note-details)
  - [Note Reminders](#note-reminders)
- [Searching Notes](#searching-notes)
  - [Searching](#searching)
  - [Search Options](#search-options)
  - [Search Results](#search-results)
- {@page ./adding-editing-removing.md Adding / Editing / Removing Notes}

## Viewing Notes

### Note List

![](media://viewing-notes.png)

To view the list of notes simply click on the Note Buttons in the Action Buttons bar next to the calendar to open the note list.

This list shows all notes that are visible to the current player for the specified day. Each note will show the title as well as some quick details about the note. These details can be:

| Detail                      | Description                                                                                                                                                                                                                                                                                                                                                               |
|-----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Bell Icon                   | This will show on notes that the current player wants to be reminded about.<br/>![](media://note-list-reminder.png)                                                                                                                                                                                                                                                       |
| Time                        | This will show what time the note takes place at on the day<br/>![](media://note-list-time-range.png)<br/>or the text all day if the note doesn't have a specific time<br/>![](media://note-list-all-day.png)<br/>or it will show a date range if the note takes place over multiple days.<br/>![](media://note-list-date-range.png)                                      |
| Author                      | This will show who authored the note. If the author says "System" then the note was included as part of a predefined calendar.<br/>![](media://note-list-author.png)                                                                                                                                                                                                      |
| Categories                  | All of the note categories associated with the note will also be displayed.<br/>![](media://note-list-category.png)                                                                                                                                                                                                                                                       |
| Player Visible<br>(GM Only) | This icon will show only for GMs but indicate if a note is visible to all, one or more players or if only the GM(s) can see the note. The tooltip for this icon will show a list of which players can see the note.<br/>![](media://note-list-player-visible.png)<br/>![](media://note-list-partial-player-visible.png)<br/>![](media://note-list-not-player-visible.png) |
| Macro Icon                  | This icon will show only for GMs and authors of the note. It indicates if a macro has been set to trigger when the calendars date and time reach the notes date and time.<br/>![](media://note-list-macro.png)                                                                                                                                                            |
| Sorting Icon                | If you are the GM or the GM has given a user role permission to change the order of notes on a day, there will be a sort icon displayed. Clicking this icon and dragging the note up or down will change the order the notes are displayed on that day.<br/>![](media://note-list-reorder.png)                                                                            |

### Opening A Note

Opening a note is very simple, moving your mouse pointer over a note in the list of notes will change the background color. Clicking on that note will then open the [notes details](#note-details).

![](media://note-list-hover.png)

### Note List Context Menu (Right Click Menu)

You can right-click on notes under the notes list to show different actions that can be done. The list of actions available will change depending on if you are the GM or own the note being right-clicked on.

![](media://note-list-context-menu.png)

| Action                      | Who Can See    | Description                                                                                                                                                                                                                                                               |
|-----------------------------|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Remind Me / Don't Remind Me | Everyone       | A quick way to toggle being reminded about a note. For more details about note reminders view [this section](#note-reminders).                                                                                                                                            |
| Show Players                | GM             | This functions the exact same as the `Show Players` button in the header of a Journal Entry and allows a GM to show this note to the specified players regardless of if they can see it or not.                                                                           |
| Edit                        | GM, Note Owner | Clicking this will open the note directly into {@page ./adding-editing-removing.md edit mode}.                                                                                                                                                                            |
| Delete                      | GM, Note Owner | Clicking this will open a confirmation dialog, to ensure that you do want to remove this note. Clicking the delete button in the confirmation dialog will remove the note. Check out the section on {@page ./adding-editing-removing.md removing notes} for more details. |


### Note Details

The note details dialog is a customized journal sheet that displays all the information about a note.

![](media://note-details.png)

| Detail          | Description                                                                                                                                                                                                                                                                     |
|-----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Note Title      | This is the title of the note.                                                                                                                                                                                                                                                  |
| Date and Time   | This shows the date and time of the note.                                                                                                                                                                                                                                       |
| Note Repeats    | If this note is set up to repeat (such as a yearly holiday) this will show how often the note is repeated.                                                                                                                                                                      |
| Note Author     | This shows who authored the note.                                                                                                                                                                                                                                               |
| Note Macro      | This will show only for GMs and authors of the note. It indicates if a macro, and shows the name of that macro, has been set to trigger when the calendars date and time reach the notes date and time.                                                                         |
| Reminder Button | This button can be clicked to toggle if to be reminded about this note. A grey bell means no reminder, a green bell means remind me. For more details about note reminders view [this section](#note-reminders).                                                                |
| Note Categories | Any categories assigned to the note will be shown here.                                                                                                                                                                                                                         |
| Note Content    | This is the content of the note page that is currently selected.                                                                                                                                                                                                                |
| Note Pages      | The notes pages is a collapsible sidebar that show all of the pages associated with this note. If a note only has 1 page this sidebar will not appear when viewing the note.<br/><br/>Clicking a page title will replace the note content with the content of the page clicked. |
| Page Search     | This search box is used to filter down the list of pages based on the page title.                                                                                                                                                                                               |


### Note Reminders

Users can tell Simple Calendar that they would like to be reminded about certain notes when the in game time meets or passes the time of the note.

Each player can customize how the reminder is sent to them by setting the [Note Reminder Notification](https://simplecalendar.info/pages/docs/global-configuration/settings.html#client-settings) option under the Client Settings.

## Searching Notes

![](media://search.png)

Searching notes is easy in Simple Calendar, clicking the main search button, entering your search term in the text box then pressing enter or hitting the search button will show you the results! There are some details to take note of though.

### Searching

The search box is where you enter the text you are wanting to search for in notes. 

**Important**: When performing a search, only notes that the current user can view are searched. They are not able to search against notes they can not view.

Clicking the search button, or hitting enter will then perform the search. The search is a fuzzy search, which means that slight misspellings (1 or 2 characters) will still be matched in the results.

### Search Options

There are several options that can be applied before performing a search.

| Options    | Description                                                                                                                                                       |
|------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Date       | This will search against the calendars date. Example If you search for January, all notes that take place in January will be returned.                            |
| Title      | This will search against the notes title.                                                                                                                         |
| Details    | This will search against the content of the note.                                                                                                                 |
| Author     | This will search against the author of the note. A quick way to find all notes entered by a certain user.                                                         |
| Categories | This will search against all the categories assigned to notes. Example, if you search for Holidays, all notes that are categorized as a Holiday will be returned. |

### Search Results

The list of search results displays and behaves exactly like the [note list](#note-list).
