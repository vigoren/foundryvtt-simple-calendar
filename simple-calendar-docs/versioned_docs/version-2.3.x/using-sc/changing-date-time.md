# Changing the Date and Time

If you are able to change the date and time within Simple Calendar then you will see some additional controls when viewing the interface.

These controls appear in both the full and compact versions of the calendar display.

Users who can change the date and time are:

- Users in the Gamemaster role can always change the date and time.
- Users in any of the other roles that the Gamemaster has [given permission](../global-configuration/permissions.md) to change the date and time.

## Calendar View

The calendar view will show several ways of changing the date and time within Simple Calendar

![](../images/change-date-calendar.png)

### Date / Time Adjuster

The date / time adjuster mechanism is used to change the current date or time by the unit specified. There are 3 main parts to this adjuster:

| Component     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
|---------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| « / »         | These buttons will change the current date or time by 5 of the unit specified.                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ‹ / ›         | These buttons will change the current date or time by 1 of the unit specified.                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Unit Selector | The middle button allows you to choose which unit will be adjusted by the other buttons. The options are:<br/><ul><li>**Second**: Adjust the number of seconds.</li><li>**Round**: Adjust the number of seconds by the number of seconds in a round.</li><li>**Minutes**: Adjust the number of minutes.</li><li>**Hour**: Adjust the number of hours.</li><li>**Day**: Adjust the current day.</li><li>**Month**: Adjust the current month.</li><li>**Year**: Adjust the current year.</li></ul>![](../images/change-date-options.png) |

### Dawn, Midday, Dusk, Midnight

These four buttons will advance the time of day to the next time clicked. 

Example: If the current time is 8:00am, pressing the midday button will advance the current time to 12:00pm of the same day. Pressing the midday button again will advance the time to 12:00pm of the next day.

The time that these buttons represent are determined as follows:

- **Dawn**: Dawn is based on the sunrise time set for the current season. Simple Calendar will attempt to gradually change this time to meet the sunrise time of the next season.
- **Midday**: This is always the half-way time of the day. It takes the number of hours in a day and divides by 2 to determine the midday time.
- **Dusk**: Dusk is based on the sunset time set for the current season. Simple Calendar will attempt to gradually change this time to meet the sunset time of the next season.
- **Midnight**: Midnight is always set to a time of 0 hours, 0 minutes and 0 seconds, the very beginning of a day.

:::caution Important
If **no seasons** are configured these buttons will default to setting the time to 0:0:0. This is because the sunrise and sunset times they use are based off of the sunrise and sunset time set for the season.
:::


### Set Date

This button appears when a date is selected that is not the current date of the calendar. Clicking this button will set the current date to the selected date.

### Context Menu (Right-Click) Set Date

Right-clicking on a date will bring up a [context menu](calendar-view.md#context-menu-right-click-menu) that will have an option of setting the date that was clicked on to the current date.

## Compact View

The compact view has a [configurable setting](../calendar-configuration/display-options.md#compact-view-options) for changing what date and time changing buttons are available.

### Full Controls

This is the default setting and will show both the [Date / Time Adjuster](#date--time-adjuster) and [Dawn, Midday, Dusk and Midnight](#dawn-midday-dusk-midnight) buttons.

### Quick Increment

This setting shows a refined list of predefined values the date and time can be changed by. It also shows the [Dawn, Midday, Dusk and Midnight](#dawn-midday-dusk-midnight) buttons.

The list of predefined values are:

- 1 Round (1r)
- 1 Minute (1m)
- 5 Minutes (5m)
- 15 Minutes (15m)
- 1 Hour (1h)

This setting also supports key modifiers to adjust those predefined values

- **Shift Key**: When the shift key is held down the amount of time that is changed for each increment is increased from `1 round, 1 minute, 5 minutes, 15 minutes, 1 hour` to `5 rounds, 5 minutes, 20 minutes, 45 minutes, 5 hours`.
- **Control Key**: When the control key is held down each increment will be subtracted from the current time, this can be combined with the shift key for going back in time by larger amounts.
