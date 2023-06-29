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

This multiple select drop down contains a list of [custom note categories](../../calendar-configuration/note-settings.md), each one that is selected will be applied to the note.

### Who Can See

This drop down contains a list of all players in the game and allows the user to choose who can see the note. The author of the note is always checked.

The option `All Players` is always at the top of the list. Clicking this will select all players in the list and make the note viewable by all those players as well as any new players that may join the world later.

### Auto Execute Macro

Choose a macro that will be automatically executed when the in game time meets or passes the time of the note.

### Remind Me

This can be toggled if the current user wants to be reminded about this note.

## Pages

Each calendar note can have different pages of information, if that makes sense for the note. This leverages the built-in FoundryVTT journal pages that were added in v10. By default, each note will have a single text page.

The collapsible sidebar is where new pages can be added (green add button) or existing pages removed (red trashcan button). The sidebar can also search page names to make it easier to find specific pages if there are many attached to the note.

Every page has a name and type associated with it, then depending on the type selected there will be additional fields to fill out for that page.

### Page Name

Each page can have a name given to it to let players know what that page contains. This is also what is used when search pages in the page collapsible sidebar.

### Page Types

There are 4 different types of pages that can be added to a calendar note.

#### Text

![](../../images/note-edit-details-pages.png)

The text page type is a rich text editor that allows you to enter custom formatted content for this page.

:::info
The rich text editor used is **Prosemirror**. TinyMCE and Markdown are currently not available.
:::

#### Image

![](../../images/note-edit-details-pages-image.png)

The image page type allows a player to pick an image to show and provide an optional caption. A preview of the image and caption are shown above the fields.

| Field         | Description                                                                                                                         |
|---------------|-------------------------------------------------------------------------------------------------------------------------------------|
| Image Source  | The image to display.<br/>This can be a URL to an image or the file picker can be used to choose from images uploaded to FoundryVTT |
| Image Caption | Text to display below the image to describe what the image is of.                                                                   |


#### PDF

![](../../images/note-edit-details-pages-pdf.png)

The PDF page type allows a player to choose an PDF to be displayed within a PDF viewer in FoundryVTT.

When editing the note a preview of the PDF is shown above the fields.

When viewing the note a button will be shown asking the player to load the PDF and indicate the PDF's size.

| Field      | Description                                                                                                                   |
|------------|-------------------------------------------------------------------------------------------------------------------------------|
| PDF Source | The pdf to display.<br/>This can be a URL to a PDF or the file picker can be used to choose from PDFs uploaded to FoundryVTT  |

#### Video

![](../../images/note-edit-details-pages-video.png)

The video page types allows a player to choose a video to be displayed and how other users can interact with that video.

| Field               | Description                                                                                                                                                           |
|---------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Video Source        | The video to display.<br/> This can be a URL to a raw video file (mp4), a URL to a YouTube video or use the file picker to choose from videos uploaded to FoundryVTT. |
| Show Video Controls | If the controls for changing aspects of the video are shown. (Volume, seeking bar, etc)                                                                               |
| Autoplay Video      | If the video should automatically start playing once it has loaded.                                                                                                   |
| Loop Video          | If the video should repeat after it has finished playing.                                                                                                             |
| Video Volume        | The volume the video should be played at.                                                                                                                             |
| Width               | The width to display the video at, if left blank the video will be fit to the size of the note dialog.                                                                |
| Height              | The height to display the video at, if left blank the video will be fit to the size of the note dialog.                                                               |
| Video Start Time    | Where the video should start at when being played.                                                                                                                    |


## Saving and Closing

At the bottom of the note sheet there is a button to save the changes or to delete the note. If the delete note button is clicked, a confirmation dialog will show to confirm that you wish to delete the note before removing it.

If you have made any changes to the note then click the close button in the top right of note sheet, a confirmation dialog will appear to check if you want to discard your changes or to save them.
