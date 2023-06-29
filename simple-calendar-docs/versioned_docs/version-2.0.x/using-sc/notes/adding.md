# Adding Notes

![](../../images/add-notes.png)

If a user is allows to add a note, the add note button will appear in the [action button](../calendar-view.md#action-buttons) section of the main calendar.

Users who can add a note are:

- Users in the Gamemaster role can always add a note.
- Users in any of the other roles that the Gamemaster has [given permission](../../global-configuration/permissions.md) to add notes.

Clicking on the Add Note button will create a new note for that day and open up the note details in edit view ready to be filled out!

## Note Fields

Notes have several custom fields that can be filled out to set how they work within Simple Calendar. The page functionality should be the same as normal journal entries just styled to match the note dialog.

![](../../images/note-edit-details.png)

### Title

This is the title of the note and is shown in the [note list](index.md#note-list) to identify what this note is about.

### Note Date/Time

This field is a date time selector that will open up when the text box is clicked on and allow a user to choose the exact date(s) and time(s) the note takes place.

### Note Repeats

This drop down allows the user to choose how often this note is repeated:

- **Never**: The note does not repeat.
- **Weekly**: This note repeats every week on the same day(s) of the week.
- **Monthly**: This note repeats every month on the same day. If a month does not have that day (e.g. not all months have a 31st day) then that month will not have the note.
- **Yearly**:This note repeats on the same month and day every year.

### Note Categories

A list of [custom note categories](../../calendar-configuration/note-settings.md), each one that is selected will be applied to the note.

### Player Viewable

This shows a list of all players in the game and allows the user to choose who can see the note. The current player is always checked in this list.

### Detail

This is the details of the note, a rich text editor that allows complete customization of the notes contents.

### Advanced Options

Clicking the "Show Advanced" title will reveal even more options that can be configured for the note. These options are considered advanced or special use case options that won't be used most of the time.

![](media://note-advanced.png)

#### Auto Execute Macro

Choose a macro that will be automatically executed when the in game time meets or passes the time of the note.


## Saving and Closing

At the bottom of the note sheet there is a button to save the changes or to delete the note. If the delete note button is clicked, a confirmation dialog will show to confirm that you wish to delete the note before removing it.

If you have made any changes to the note then click the close button in the top right of note sheet, a confirmation dialog will appear to check if you want to discard your changes or to save them.
