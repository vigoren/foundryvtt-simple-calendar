- [Opening Simple Calendar](#opening-simple-calendar)
- [Calendar View](#calendar-view)
  - [Calendar](#calendar)
  - [Clock](#clock)
  - [Action Buttons](#action-buttons)
- [Compact View](#compact-view)

## Opening Simple Calendar

The main way to open up Simple Calendar is through the button under Journal Notes.

![](media://calendar-button.png)

Simple Calendar can also be opened through the Configure Settings dialog of Foundry.

![](media://module-settings-open-calendar.png)

Each player can also {@page ../global-configuration/settings.md choose if Simple Calendar opens by default} when FoundryVTT is loaded

Simple Calendar also has a configurable keybinding for opening/closing the calendar window. By default, the key used is `Z` but this can be customized under [FoundryVTT's Configure Controls](https://foundryvtt.com/article/keybinds/) menu.

## Calendar View

The calendar view is the main way of interacting with Simple Calendar. The image below breaks the view into 3 main sections which will be further broken down individually. This will give you the best understanding of how to use Simple Calendar!

![](media://main-app-overview.png)

### Calendar

![](media://calendar-view-detailed.png)

| Feature                     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
|-----------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Month/Year                  | This is the text at the very top of the calendar that represents the current month and year being viewed. This text can be customized by the {@page ../calendar-configuration/display-options.md Month/Year Format display option}.<br/><br/>If the GM has provided a description for this month, clicking the month name will open up an informational popup showing that description.<br/>![](media://month-description-example.png)                                                                                                                                                                                         |
| Previous/Next Month Buttons | These buttons are used to view the previous or next month of the calendar.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Season Icon and Name        | Each season can have an icon, color and name set. This section will show the current seasons icon (in the color associated with the season) next to the seasons name.<br/><br/>If the GM has provided a description for this season, clicking the season name will open up an informational popup showing that description.<br/>![](media://season-description-example.png)                                                                                                                                                                                                                                                    |
| Border Color                | The border color of the calendar is set to be the color of the current season.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Weekdays                    | Above the list of days of the month is the abbreviated weekday names. The display of weekdays can be turned off so it may not show on all calendars.<br/><br/>If the GM has provided descriptions for the weekdays, clicking the weekday name will open up an informational popup showing that description.<br/>![](media://weekday-description-example.png)                                                                                                                                                                                                                                                                   |
| Blue Highlight              | A day with a blue highlight represents the current date of the calendar.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Green Highlight             | A day with a green highlight represents the selected date of the calendar.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Note Indicators             | In the top right corner of a date can be a yellow and/or purple indicator with a number. These represent notes on that particular day.<br/>The yellow indicator are notes on the day that are visible to the current player.<br/>The purple indicator are notes on the day that the current player wants to be reminded of.                                                                                                                                                                                                                                                                                                    |
| Moon Phases                 | In the bottom right corner of a date is where the moon(s) phase for that date are shown. Phases are shown when:<br/>- The phase for that day is a single day phase (new moon, full moon, first quarter moon or last quarter moon)<br/>- For the current date (all moons current phase are shown)<br/>- For the selected date (all moons current phase are shown)<br/><br/>If there are more than 2 moons to be shown the first moon's phase is shown with a down arrow, then hovering over that moon icon will reveal a popup that shows all the other moons phase for that date.<br/>![](media://calendar-multiple-moons.png) |



#### Context Menu (Right Click Menu)

![](media://day-context-gif.gif)

Each day on the calendar can be right-clicked (control-click on Mac) which will bring up a context menu with more details and actions for that day.

The menu shows the date for the clicked day as well as the sunrise and sunset times for that day.

If you have {@page ../global-configuration/permissions.md permissions} to change the date of the calendar you will see an option to set this day to the current date.

If you have {@page ../global-configuration/permissions.md permissions} to add notes to the calendar you will see an option to add a new note to this day.

### Clock

![](media://calendar-clock-display.png)

| Feature      | Description                                                                                                                                                                                                                                                                                              |
|--------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Current Time | This is the text that represents the current time (hour, minute and seconds). This text can be customized by the {@page ../calendar-configuration/display-options.md Time Format display option}                                                                                                         |
| Clock Icon   | This icon represents the current state of the real time clock:<br/>- Red means the clock is stopped.<br/>![](media://clock-stopped.png)<br/>-Yellow means the clock is paused.<br/>![](media://clock-paused.png)<br/>-Green and animated means the clock is running.<br/>![](media://clock-runnings.png) |


### Action Buttons

![](media://calendar-action-buttons.png)

| Feature       | Description                                                                                                                                                                                                                                                                                                                                        |
|---------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Calendars     | This button will open up the calendar panel that will show all calendars currently configured in Simple Calendar. This button will only display if there are 2 or more calendars configured. More details on this panel under the {@page ./switching-calendars.md switching calendars documentation}.<br/> ![](media://calendar-calendar-list.png) |
| Note Buttons  | These buttons will open up a panel that will show the notes on the selected date. The yellow button indicates notes that the current player can see on the date while the purple button indicates note reminders for the current player on that date.<br/> ![](media://calendar-note-list.png)                                                     |
| Search Notes  | This button will open up the note searching panel. More details on this panel under the {@page ./notes/index.md notes documentation}.  <br/> ![](media://calendar-search-notes.png)                                                                                                                                                                |
| Today         | This button will select the current date of the calendar and refresh the display to make sure it is visible.                                                                                                                                                                                                                                       |
| Configuration | This opens up the configuration options. Players will see a limited selection of options that pertain to them while GMs will see all of the options.                                                                                                                                                                                               |

## Compact View

![](media://calendar-compact-view.png)

Simple Calendar also allows users to view the module in a compact view. This view has a much more limited view but takes up less screen space for ease of keeping it always open.

The compact view will show:

- The current season.
- The current moon phase(s).
- The current date.
- The current time and real time clock status.
- Action buttons to view any notes the current player can see or has reminders for on this date.

To switch to the compact view, simple double-click the header of the main application, and it will switch. To switch back you can double-click the header of the compact view.

![](media://calendar-header-click.png)
![](media://calendar-compact-view-header-click.png)
