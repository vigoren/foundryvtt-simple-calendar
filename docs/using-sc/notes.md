# Notes

Notes are great ways to add reminders or events.

Notes are stored as journal entries in their own folder in the journal directory. By default, this folder is hidden from view but a GM {@page ../global-configuration/settings.md can enable it to be visible} if they wish.

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
- [Adding Notes](#adding-notes)
- [Editing Notes](#editing-notes)
- [Removing Notes](#removing-notes)

## Viewing Notes

### Note List

![](media://viewing-notes.png)

To view the list of notes simply click on the Note Buttons in the Action Buttons bar next to the calendar to open the note list.

This list shows all notes that are visible to the current player for the specified day. Each note will show the title as well as some quick details about the note. These details can be:

| Detail                      | Description                                                                                                                                                                                                                                                                                                                          |
|-----------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Bell Icon                   | This will show on notes that the current player wants to be reminded about.<br/>![](media://note-list-reminder.png)                                                                                                                                                                                                                  |
| Time                        | This will show what time the note takes place at on the day<br/>![](media://note-list-time-range.png)<br/>or the text all day if the note doesn't have a specific time<br/>![](media://note-list-all-day.png)<br/>or it will show a date range if the note takes place over multiple days.<br/>![](media://note-list-date-range.png) |
| Author                      | This will show who authored the note. If the author says "System" then the note was included as part of a predefined calendar.<br/>![](media://note-list-author.png)                                                                                                                                                                 |
| Categories                  | All of the note categories associated with the note will also be displayed.<br/>![](media://note-list-category.png)                                                                                                                                                                                                                  |
| Player Visible<br>(GM Only) | This icon will show only for GMs but indicate if a note is visible to one or more players or if only the GM(s) can see the note.<br/>![](media://note-list-not-player-visible.png)<br/>![](media://note-list-player-visible.png)                                                                                                     |
| Macro Icon                  | This icon will show only for GMs and authors of the note. It indicates if a macro has been set to trigger when the calendars date and time reach the notes date and time.<br/>![](media://note-list-macro.png)                                                                                                                       |
| Sorting Icon                | If you are the GM or the GM has given a user role permission to change the order of notes on a day, there will be a sort icon displayed. Clicking this icon and dragging the note up or down will change the order the notes are displayed on that day.<br/>![](media://note-list-reorder.png)                                       |

### Opening A Note

Opening a note is very simple, moving your mouse pointer over a note in the list of notes will change the background color. Clicking on that note will then open the [notes details](#note-details).

![](media://note-list-hover.png)

### Note Details

The note details dialog is a customized journal sheet that displays all the information about a note.

![](media://note-details.png)

| Detail          | Description                                                                                                                                                                                                      |
|-----------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Note Title      | This is the title of the note.                                                                                                                                                                                   |
| Reminder Button | This button can be clicked to toggle if to be reminded about this note. A grey bell means no reminder, a green bell means remind me. For more details about note reminders view [this section](#note-reminders). |
| Date and Time   | This shows the date and time of the note.                                                                                                                                                                        |
| Note Repeats    | If this note is set up to repeat (such as a yearly holiday) this will show how often the note is repeated.                                                                                                       |
| Note Author     | This shows who authored the note.                                                                                                                                                                                |
| Note Macro      | This will show only for GMs and authors of the note. It indicates if a macro, and shows the name of that macro, has been set to trigger when the calendars date and time reach the notes date and time.          |
| Note Categories | Any categories assigned to the note will be shown here.                                                                                                                                                          |
| Note Content    | This is all the contents of the note as defined in the rich text editor.                                                                                                                                         |

### Note Reminders

Users can tell Simple Calendar that they would like to be reminded about certain notes when the in game time meets or passes the time of the note.

When a reminder is to be sent, Simple Calendar will send you a whisper in Foundry's chat reminding you about this note.

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

## Adding Notes

![](media://add-notes.png)

If a user is allows to add a note, the add note button will appear in the action button section of the main calendar.

Users who can add a note are:

- Users in the GM role can always add a note.
- Users in any of the other roles that the GM has configured to be allowed to add notes. See {@page ../global-configuration/permissions.md the permissions page} for more details.

Clicking on the Add Note button will create a new note for that day and open up the [note details in edit view](#editing-notes). Read that section for details on all the fields and what they do!

## Editing Notes

Users are allowed to edit any notes that they have added and GM's are allowed to edit any note they can view.

If you are able to edit a note you will see some additional buttons when you are viewing the notes details.

![](media://edit-delete-note-buttons.png)

Clicking the edit button will change the note details view into the note edit details view, where you can change all the details about a note.

![](media://note-edit-details.png)

| Field           | Description                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|-----------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Title           | The title becomes an editable textbox that allows for changing the title of the note.                                                                                                                                                                                                                                                                                                                                                                |
| Note Date/Time  | This field is a date time selector that will open up when the text box is clicked on and allow a user to choose the exact date(s) and time(s) the note takes place.                                                                                                                                                                                                                                                                                  |
| Note Repeats    | This drop down allows the user to choose how often this note is repeated:<br/>**Never**: The note does not repeat.<br/>**Weekly**: This note repeats every week on the same day(s) of the week.<br/>**Monthly**: This note repeats every month on the same day. If a month does not have that day (eg not all months have a 31st day) then that month will not have the note.<br/>**Yearly**:This note repeats on the same month and day every year. |
| Note Categories | The list of {@page ../calendar-configuration/note-settings.md custom note categories} will appear here, each one that is checked will be applied to the note.                                                                                                                                                                                                                                                                                        |
| Player Viewable | This shows a list of all players in the game and allows the user to choose who can see the note. The current player is always checked in this list.                                                                                                                                                                                                                                                                                                  |
| Details         | This is the details of the note, a rich text editor that allows complete customization of the notes contents.                                                                                                                                                                                                                                                                                                                                        |

### Advanced Options

Clicking the "Show Advanced" title will reveal even more options that can be configured for the note. These options are considered advanced or special use case options that won't be used most of the time.

![](media://note-advanced.png)

| Field              | Description                                                                                                    |
|--------------------|----------------------------------------------------------------------------------------------------------------|
| Auto Execute Macro | Choose a macro that will be automatically executed when the in game time meets or passes the time of the note. |


### Saving and Closing

At the bottom of the note sheet there is a button to save the changes or to delete the note. If the delete note button is clicked, a confirmation dialog will show to confirm that you wish to delete the note before removing it.

If you have made any changes to the note then click the close button in the top right of note sheet, a confirmation dialog will appear to check if you want to discard your changes or to save them.

## Removing Notes

Users are allowed to remove any notes that they have added and GM's are allowed to remove any note they can view.

If you are able to remove a note you will see some additional buttons when you are viewing the notes details.

![](media://edit-delete-note-buttons.png)

Clicking the Delete button will open up a confirmation dialog, to ensure that you do want to remove this note. Clicking the delete button in the confirmation dialog will remove the note.