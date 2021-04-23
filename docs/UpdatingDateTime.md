# Updating the Current Date
The GM version of the module looks a little different, with the addition of controls to change the current date and a button to enter the configuration.

![GM View](https://raw.githubusercontent.com/vigoren/foundryvtt-simple-calendar/main/docs/images/gm-view.png)

The above image helps shows the controls, they are detailed out below.

## Time Controls

These controls are specific to controlling the time of the current day. As well as starting/stopping the built-in clock.

**Important**: These controls will not display if the [Simple Calendar's game world time integration](./Configuration.md#game-world-time-integration) is configured to set to "Third Party" OR if the [Show Clock setting](./Configuration.md#show-clock) is unchecked.

The top controls are used to select a unit of time (second, minute or hour) that will be changed by the buttons below.

These buttons are used to move time forward or backward by the amount listed on the button (1 or 5)

Simple Calendar has a built-in clock that can be used to automatically advance time as real world time passes by. This clock is started or stopped by the GM using the start/stop buttons under the time controls. Check out [Simple Calendars clock](./UsingTheCalendar.md#simple-calendars-clock) for more information.


## Date Controls

These controls are specific to controlling the date, day/month/year, of the calendar.

**Important**: These controls will not display if the [Simple Calendar's game world time integration](./Configuration.md#game-world-time-integration) is configured to set to "Third Party".

Control | Description
------- | -----------
Day Back/Forward | This moves the current day forward or back one day.
Month Back/Forward | This moves the current month forward or back one month. The current day will be mapped to the same day as the old month, or the last day of the month if the old month has more days.
Year Back/Forward | This moves the current year forward or back one year. The current month and day will stay the same in the new year.
Set Current Date | If a day is selected the "Set Current Date" button will show. Clicking this button will set the current date to the selected day.



## Other Controls

These are additional controls that only the GM can access but are not specific to one of the above categories.

Control | Description
------- | -----------
Configuration | This opens up the configuration dialog to allow the GM to fully customize the calendar.
Add New Note Button | This will open the add notes dialog to add a new note for the selected day.


## Compact View

The compact view offers many of the same controls as the full view but not all.

![GM Compact View](https://raw.githubusercontent.com/vigoren/foundryvtt-simple-calendar/main/docs/images/gm-compact-view.png)

Control | Description
------- | -----------
Day Back/Forward | This moves the current day forward or back one day.
Start/Stop button| Used to start or stop the [Simple Calendars built in clock](./UsingTheCalendar.md#simple-calendars-clock).
Time Amount Buttons|These buttons will advance the time by the amount listed on them.
