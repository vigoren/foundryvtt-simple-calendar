# Change Log

## v1.2.113 - API Changes

![](https://img.shields.io/badge/release%20date-July%202%2C%202021-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v1.2.113/module.zip)

- Updated the timestampToDate function's return values. The result now contains a display object that contains all the different display strings for the passed in timestamp.
- Fixed a bug with the timestampToDate function where months with day offsets would return the incorrect day of the week for days in that month.
- Fixed a bug with the timestampToDate function where the "showWeekdayHeadings" property would be incorrectly set.
- Added a function SimpleCalendar.api.getCurrentSeason() that returns details about the season for the current date.
- Added a function SimpleCalendar.api.getAllSeasons() that returns details for every configured season in Simple Calendar.
- Fixed a bug when importing from Calendar/weather where the hours per day would end up being undefined.
- Added the ability to use the new Date Selector input type to other modules/systems through Simple Calendars API. [Read more here!](https://simplecalendar.info/modules/SimpleCalendar.api.html)

<hr/>

## v1.2.107 - Calendar Configuration Import/Export, API Changes, Bug Fixes

![](https://img.shields.io/badge/release%20date-June%2026%2C%202021-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v1.2.107/module.zip)

### Import/Export

You can now export and import calendar configurations for Simple Calendar. Under the general settings tab in the configuration window there is an Import/Export section with these options: 
- Export Button: when clicked you will be prompted to download a json file that contains all of the configuration data. 
- Import Button/ File Selector: Next to the import button is a file selected where you choose the exported json file to import then click the import button for the contents to be set for the current calendar.

**Important**: This import and export is just for the calendar configuration, notes are not exported or imported through this process! Note exporting is planned, just not ready yet.

### API Changes

- Updated the timestampToDate function to return some additional information:
  - dayOffset: The number of days the months days are offset by.
  - dayDisplay: How the day is displayed, generally its number on the calendar.

### Bug Fixes

- Fixed a bug where months with day offsets set, the calculated timestamp would include the skipped days.
  - If you use calendars that have months with day offsets, you will need to "toggle" (move the day forward 1 then back) the date to update the timestamp properly.
- Renamed the "Include Intercalary Month in Total Day Count" to "Include Intercalary Month in Day Calculations" to better explain what the setting actually does.

<hr/>

## v1.2.103 - API Changes, Module Import/Export Changes and Bug Fixes

![](https://img.shields.io/badge/release%20date-June%2024%2C%202021-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v1.2.103/module.zip)

### API Changes

- The timestampToDate function now returns additional information about the date: year prefix, year postfix, the current season and if to show the weekday headings.
- The calendar/weather import function has been temporarily exposed in the API to assist in the transition for calendar/weather from using about-time to using Simple Calendar. Once this transition has taken place, this functionality will be removed from the API.

### Module Import/Export Changes

- The calendar/weather export now saves the custom calendar setting directly rather than using about-times save function. This is to support the upcoming changes to about-time.
- Fixed up the calendar/weather import so that it works better with the most recent version of Calendar/weather.
  - **Important**: Calendar/Weather and Simple Calendar calculate moon phases differently so imported moons will not match cycles exactly.
- If the about time version is 1.0.0 or greater the "Export To about-time" option will not be available. This is because about-time will be using Simple Calendar as its calendar source so the export will not be needed. 

### Bug Fixes

- Fixed a bug where months with day offsets would not advance the days correctly.

<hr/>

## v1.2.97 - API Bug Fixes

![](https://img.shields.io/badge/release%20date-June%2016%2C%202021-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v1.2.97/module.zip)

- Fixed a bug with the API function timestampPlusInterval where adding just a year would increment to the first day of the year not by the number of years.
- Fixed a bug with the API function timestampPlusInterval where if very large values for the different intervals were passed in an error would be thrown

<hr/>

## v1.2.95 - Translations & Foundry 0.8.7

![](https://img.shields.io/badge/release%20date-June%2015%2C%202021-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v1.2.95/module.zip)

- Ensured that Simple Calendar works in foundry version 0.8.7.
- The addition of a Korean translation thanks to drdwing!

<hr/>

## v1.2.93 - Clock Changes & Bug Fixing

![](https://img.shields.io/badge/release%20date-June%2015%2C%202021-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v1.2.93/module.zip)

### Clock Changes

- Added the ability to pause the clock once it has started running. The start (play) button will change into a pause button when the clock has been started. Clicking the pause button will pause the clock and change the button back into the start (play) button. Clicking play will start the clock again.
- Added a new clock setting called "Update Frequency" under the Time Settings. This setting allows you to configure how often (in seconds) the clock is updated when running. The default is 1 second.
- Added a new clock setting called "Unify Clock Start/Pause with Game Pause" under the Time Settings. When checked this setting will start the game when the start clock button is pressed and pause the game when the pause/stop button are pressed. The clock is still paused as normal when a combat is started in the currently active scene.

### Bug Fixing

- Fixed a bug where saving the calendars configuration would not update the current timestamp to match any changes.
- Addressed a rounding issue if the clocks "Game seconds per real life seconds" setting was a decimal.
- Fixed a bug where calendars with a year zero of 0 a leap year rule of none would end up being behind by a day.
- Fixed a bug with the PF2E system where advancing the time with the system clock would set the day in Simple Calendar ahead by one day.
- Fixed a bug where after page load the first third party module date/time change would not be reflected in Simple Calendar. Subsequent changes were properly shown.

<hr/>

## v1.2.85 - New Clock, API Changes and as always more Bug Fixing

![](https://img.shields.io/badge/release%20date-June%2011%2C%202021-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v1.2.85/module.zip)

### New Clock

The old clock in Simple Calendar was very basic and not very good. I have removed that clock and re-written the entire thing which should provide a much nicer experience.
The clock now functions as follows:

- The time will now update every second for all players.
- Every 10 seconds all players time will sync with the primary GM's time. This is to mitigate any time "wandering" that may happen.
- The time can still be manually updated by those with permission while the clock is running.
- For every second that passes, the time updates by the amount in the configuration setting [Game Seconds Per Real Life Seconds](https://simplecalendar.info/pages/docs/calendar-configuration/time-settings.html) under the time seconds.
- If the GM disconnects while the clock is running, when they reconnect all the players clocks will stop running and be updated to the time when the GM disconnected.

It is important to note that while the clock does its best to keep everyone on the same time if a player or GM has a high latency to the server (greater than one to two seconds) then the time may be visually off between the GM and the players. The Primary GM's time is considered correct and all other players will use that time.

### API Changes

- Changed the API showCalendar function to accept an additional parameter compact. Which, if set to true will open the calendar in compact mode.
- Changed the API setDate function so that any time options that were not specified in passed in parameter will default to the current value. Eg If no year is specified the current year will be used.
- Added a new API function, dateToTimestamp. This function will take in a date object and convert it to a timestamp.
- Added a new API function, isPrimaryGM. This function will return if the current user is the primary GM. There is a 5-second delay from when a user joins to when they can be assigned the primary GM, this is to check for other primary GMs before taking over.
- Added a hook that fires when the user is selected as the primary GM.
- Added new API functions, startClock and stopClock. These functions will start/stop the built-in clock. Only the Primary GM can run the clock.

### Bug Fixes

- Fixed a bug when dealing with negative timestamps and negative years.
- Fixed a bug where if the time updated while you were viewing another month, the calendar would update to view the month of the current date.
- Fixed an issue with the API timestampToDate function that didn't account for the PF2E system.
- Fixed an issue with the API timestampPlusInterval function that didn't account for the PF2E system.
- Fixed a bug where occasionally the last day of the month would have a value of -1.

<hr/>

## v1.2.73 - API Bug Fixing

![](https://img.shields.io/badge/release%20date-June%2071%2C%202021-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v1.2.73/module.zip)

### Bug Fixes

- Fixed a bug with the new API timestampPlusInterval function that would incorrectly add a day when it shouldn't.
- Fixed a bug with the new API timestampPlusInterval function where if the time variables added up to be more seconds than in a day, the day would not advance.
- Fixed a bug with the new API timestampToDate function where the day of the week would be incorrectly calculated.
- Changed the API timestampToDate function so that days are also 0 indexed.
- Standardized the naming of the parameters and variables of the different API functions so results can be directly passed from one into another.

### New API

- Added a new API function [chooseRandomDate](https://simplecalendar.info/modules/SimpleCalendar.api.html#chooseRandomDate) that will choose a random date on the calendar or between a passed in start and end date.

<hr/>

## v1.2.67 - Translations, Macro/API Changes, Bug Fixes

![](https://img.shields.io/badge/release%20date-June%206%2C%202021-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v1.2.67/module.zip)

### Macro/API Changes

An API interface to Simple Calendar has been added so that other modules can have an easier time talking to Simple Calendar. These are going to be primarily used by about-time to ensure the syncing of time between them is accurate.

All the existing macro functions have been moved into this new API interface. The existing functions remain with a depreciation warning, and they will be removed in a later update.

Check out the new [API documentation](https://simplecalendar.info/modules/SimpleCalendar.api.html) for all the additions and changes.


### Bug Fixes

- Fixed a bug where advancing the calendar by 1 month would reset the dat to the start of the month instead of keeping the day the same between month advancements.

### Translations
  - Updates to the existing translations for Traditional Chinese some new content.
  - The addition of a Spanish translation thanks to areymoreno!

<hr/>

## v1.2.63 - Year Names, Bug Fixing & Foundry 0.8.6 Support

![](https://img.shields.io/badge/release%20date-May%2031%2C%202021-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v1.2.63/module.zip)

### Year Names

You can now have named years in Simple Calendar! This update adds several options for adding and configuring how named years work.

| Setting                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
|-------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Year Names              | This is a list of different names that can be used for the years.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Year Name Behaviour     | This drop down is used to determine how the year names are applied to years. The options are:<br/><strong>Default:</strong> The year list starts at the specified starting year and goes down the list for each subsequent year. If the year is past the number of names in the list it will continue to use the last name from the list.<br/><br/><strong>Repeat</strong>: The year list starts at the specified starting year and goes down the list for each subsequent year. When the current year is past the name list length it will start again at the top of the list and repeat it forever.<br/><br/><strong>Random</strong>: For every year a random name from the list will be chosen. The calendar will do its best to keep the same name for a year. |
| Starting Year For Names | This is the year that the first name in the list of Year Names is associated with.<br/>This option only appears if the Year Name Behaviour setting is set to None or Repeat.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |

The Dark Sun predefined calendar has been updated to include named years that match the Merchant Calendar for that game system.

### Bug Fixing

- Adjusted the calendar's auto height and width calculations to work better for more systems.
- Added some specific styles to better support the Warhammer Fantasy Roleplay 4th Edition system.
- Updated the styling of the configuration dialog so that it is more consistent across different systems.
- Changed the "Include Intercalary Month In Total Day Count" month setting so that it is hidden under the advanced setting area for months instead of always showing if the "Intercalary Month" setting was checked. It will still only appear if the "Intercalary Month" setting is checked.
- Fixed a bug where the Pathfinder 2E Sync option wouldn't stay checked (even though it was checked)
- Fixed a bug where the year Postfix/Prefix would not include a space between them and the year number.
- Ensured that Simple Calendar works with Foundry 0.8.6 and Foundry 0.7.10

## v1.2.55 - Improved PF2E Support, Permissions, Bug Fixes

![](https://img.shields.io/badge/release%20date-May%2021%2C%202021-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v1.2.55/module.zip)

### Improved Pathfinder 2E Support

Simple Calendar and Pathfinder 2E's world clock did not play together nicely, this update allows them to be in sync with their times so users don't have to choose between using one or the other.

- Removed the Golarian pre-defined calendar and added 2 new pre-defined Golarian Calendars, one for Pathfinder 1E and one for Pathfinder 2E. This is because of a change in the leap year rules between the two editions. 
- Added a new configuration setting for games running the Pathfinder 2E system, World Clock Sync:
  - This setting will attempt to keep Simple Calendars date and time in sync with the Pathfinder 2E's World Clock.
  - The setting only appears if you are using the Pathfinder 2E system.
  - The Setting is enabled by default.
  - For the Golarion (Absalom Reckoning) Date Theme in PF2E's world clock use Simple Calendars Golarian: Pathfinder 2E predefined calendar.
  - For the Earth (Gregorian) or Unthemed (Gregorian) Date Theme in PF2E's world clock use Simple Calendars Gregorian predefined calendar

### Permissions

This update changes how permissions work within Simple Calendar. There is now a section under the general settings tab called permissions where all user permissions can be adjusted. Permissions are now role based so players in certain foundry roles can be given extra permissions within Simple Calendar.

**Important**: The existing Allow Players to Add Notes setting will be properly converted over to these new permissions.

These are the current available permissions:

| Permission           | Description                                                             |
|----------------------|-------------------------------------------------------------------------|
| View Calendar        | If users in this role can view the calendar interface or not.           |
| Add Notes            | If users in these roles are able to add notes to the calendar.          |
| Change Date and Time | If users in these roles are able to change the calendars date and time. |

### Quality of Life Improvements

- Added a button in the calendar dialogs title bar to switch between compact and full view.
- Moved the "Show Clock" configuration setting from the general settings tab to the time settings tab.

### Bug Fixes

- Fixed a discrepancy with the newest version of about-time (v0.8.3+) that would cause the day set in Simple Calendar to be off in about-time.
  - If you are running about-time version 0.8.3 or later and running into this issue please re-export Simple Calendars settings into about-time.

<hr/>

## v1.2.47 - New Features, Translations, QoL Improvements & Bug Fixes 

![](https://img.shields.io/badge/release%20date-May%2013%2C%202021-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v1.2.47/module.zip)

### New Features

- Added the ability to set the "Year Zero" for a calendar. This year is then the reference point for calculating how many days have passed and other similar calculations. It is unlikely this value will need to be changed but adjusting this value can allow Simple Calendar to work better with other modules.
- Added the ability to specify the day of the week a month will start on. This will make that month always start on that day of the week regardless of other months. Useful for fixe day calendars with months who's days don't fall evenly into full weeks.
- Added a default calendar for Dark Sun. Note the eras and year names are not currently populating this will be added in a future release.

### Quality of Live Improvements

- Ensured that Simple Calendar works in Foundry version 0.8.3
- Moved the Note settings to its own tab in the configuration dialog.
- Updated the season and moon color selector to use an actual color selector instead of just text.

### Bug Fixes

- Fixed a bug where the day of the "Starting Week Day" setting would be off by 1 day.
- Fixed some styling issues with the configuration dialog.

### Translations

I am happy to say that Simple Calendar has been translated into Traditional Chinese by [benwater12](https://github.com/benwater12)

<hr/>

## v1.2.38 - Quality of Life Improvements and Bug Fixes

![](https://img.shields.io/badge/release%20date-May%209%2C%202021-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v1.2.38/module.zip)

### Quality of Live Improvements
- Changed the tooltip for days with notes. If the day has 1 or 2 notes the tool tip will now show the title of the notes on that day instead of just the count. If there are 3 or more notes the tool tip will just show the number of notes on that day (like it does now).

### Bug Fixes

- Fixed an issue where about-time would be off by a day or more when changing the date in Simple Calendar.<br/>**IMPORTANT**: If you were impacted by this please follow these steps:
  - Open the Simple Calendar configuration and click the save configuration button (This will fix part of the issue within Simple Calendar).
  - Open the Simple Calendar configuration and under the General Settings tab click the "Export Into About-Time" button (This will update about-time with the fix).
  - Change the day in Simple Calendar, move a day forward or backward. This will re-sync both modules.
- Fixed an issue where Intercalary Days could not be set as the start of seasons or used for the moon's reference month.

<hr/>

## v1.2.35 - Bug Fix

![](https://img.shields.io/badge/release%20date-April%2030%2C%202021-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v1.2.35/module.zip)

- Fixed a bug where users were unable to set the custom leap year value.

<hr/>

## v1.2.34 - Bug Fixing

![](https://img.shields.io/badge/release%20date-April%2025%2C%202021-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v1.2.34/module.zip)

- Fixed a bug where removing all phases from a moon would cause the calendar to no longer open.
- Fixed an issue where the compact view clock would show when the show clock setting was unchecked. 
- Fixed an issue where GM date and time controls would show when they.
- Fixed an issue when time was advanced by other means (combat tracker or third party module) on maps with intercalary days. Simple Calendar would calculate the new date incorrectly.

<hr/>

## v1.2.30 - Compact View, Bug Fixes, QoL Improvements & Translations

![](https://img.shields.io/badge/release%20date-April%2023%2C%202021-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v1.2.30/module.zip)

### Compact View

I have added a compact view for the calendar that only shows the current day and relevant information for that day. Switching between the full  and compact views is done by double-clicking on the dialog's header.

![Compact View](images/compact-view.gif)

### Quality of Life Improvements

- Updated the Simple Calendar clock so that it only checks for active combats on the currently active scene instead of all scenes. It was confusing when the clock would not start because of a combat in a non-active scene.
- The Date and Time GM controls are feeling clunky and not intuitive, so I have changed them up in the following ways:
  - Changed the Date Controls so that when a day/month/year is moved forward or backward that change is propagated out to the players immediately. This removed the need to click the "Set Current Date" button after setting the date.
  - Changed the Time Controls so that when a second/minute/hour is incremented or decremented the change is propagated out to the players immediately. This removes the need to click the "Set Current Date" button after setting the time.
  - The "Set Current Date" button now appears after a day has been selected. Clicking the button will set the current date to the selected date.
    - If the selected day is not current visible, such as changing the visible month after selecting a day, and the "Set Current Date" button is clicked a dialog will appear to confirm changing the date to the day that is not visible.

### Bug Fixes

- Fixed an issue where when updating the time the new value would get saved twice.
- Fixed a rare issue where when there was more than 1 GM in a game, initial loading could result in an unwanted time change.
- Fixed an issue where clicking on a days note indicator, or a moon phase icon would not select the day and throw an error.
- Fixed an issue with the moon phase icons where the first and last quarter icons were switched.

### Translations

I am happy to say that Simple Calendar has been translated into German by [MasterZelgadis](https://github.com/MasterZelgadis)

<hr/>

## v1.2.20 - Macros, Hooks, Bug Fixes and QoL Improvements

![](https://img.shields.io/badge/release%20date-April%2014%2C%202021-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v1.2.20/module.zip)

### Macros

- Added a new macro for setting a specific date/time for the calendar, check out the [documentation](https://simplecalendar.info/modules/SimpleCalendar.api.html#setDate) for how to use it.
- Added a new macro for changing the current date/time by a passed in amount. Check out the [documentation](https://simplecalendar.info/modules/SimpleCalendar.api.html#changeDate) for how to use it.


### Hooks

Simple Calendar will now emit certain hooks that other modules/code can listen for.

- Added a hook that is fired every time the current date is changed and contains the information for the new date. Check out the [documentation](https://simplecalendar.info/modules/SimpleCalendar.Hooks.html#DateTimeChange) for more details.

### Quality of Life Improvements

- Cleaned up the styling of the calendar dialog. The calendar will now consistently open so that the calendar, date controls (if gm) and 2 rows of notes will be visible.
- Resizing of the calendar dialog will now reset when you close and re-open the dialog.
- Added the Traveller - Imperial Calendar as a predefined calendar.
- Added a new section in month configuration called Advanced. Clicking on a months "Show Advanced" link will show the advanced options' area. This area will contain things that are probably not relevant to most calendars.
- Added a new option to months advanced settings to offset the day numbers by an amount. This is to accommodate instances where a month may start on day 2. The best example is the Traveller calendar where days are numbered by what day of the year they are rather than which day of the month they are.
- For calendars that have months with many days (example the traveller calendar) the calendar now has a maximum height of 500px. The list of days will become scrollable. For Current days or selected days the calendar will attempt to keep them in view when it makes sense (selecting a new day).
- Added the ability to specify the starting day of the week for the first day of year 0. This helps align your calendar with official calendars.
- Updated the pre-defined calendars to have their starting day of the week set so that they match with official calendars.
- There was no way to unselect a day so now if a selected day is clicked again it will become unselected.

### Bug Fixes

- Fixed a bug for games with multiple GMs. In some instances both GMs would get assigned as the primary GM and process changes, instead of only 1 processing the changes. This sometimes resulted in incorrect dates being set.
- Fixed an issue with the Exandrian pre-defined calendar where I missed an entire weekday, big oops.


### Foundry 0.8.1

I have made a couple of small changes to Simple Calendar that allows it to work properly with Foundry version 0.8.1.

That version of Foundry is still in alpha, so I do warn against updating your main games to that Foundry version yet. This step in testing will hopefully allow a very seamless transition into 0.8.x when it is released for everyone.


<hr/>

## v1.2.5 - Bug Fixes and QoL Improvements

![](https://img.shields.io/badge/release%20date-April%205%2C%202021-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v1.0.3/module.zip)

### Quality of Life Improvements

- Adjusted the styling around the calendar configuration tabs. The tab titles shouldn't break into multiple lines unless the config window is shrunk and if they do break into multiple lines it should look cleaner.
- Adjusted the starting height of the calendar to have more space for the events list.
- Updated adding/editing a note so that the text editor does not need to be saved before saving the note. When saving the note any content entered will be saved.
- Updated the weekday headings so that the first 2 characters of the weekday name are shown. This will help distinguish between days of the week that start with the same character.

### Bug Fixes

- Fixed a bug where in some instances importing data from Calendar/Weather into Simple Calendar would incorrectly save numerical data as strings causing Simple Calendar to not open.

<hr/>

## v1.2.0 - Time, Other Modules, Seasons, Moons and Notes

![](https://img.shields.io/badge/release%20date-April%204%2C%202021-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v1.2.0/module.zip)

This update was a long time coming so apologies for making you wait for it. This update with most of the currently requested changes to Simple Calendar

### Time

Simple Calendar now supports time of day! What this means is that Simple Calendar can now be tied into FoundryVTTs game world time. This allows any other module that ties into the game world time to be updated whe Simple Calendar updates or update Simple Calendar when they change the game world time.

There are 4 different options on how to tie into the game world time to achieve the exact level of interaction you want for your world. They are:

| Option             | Description                                                                                                                                                                                                                                                                                                                   | Update Game World Time                                           | When Game World Time is Updated                                                                                      |
|--------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------|
| None (default)     | Simple Calendar does not interact with the game world time at all. This setting is ideal if you want to keep Simple Calendar isolated from other modules.                                                                                                                                                                     | Does not update the game world time                              | Simple Calendar is not updated when the game world time is updated by something else.                                |
| Self               | Treats Simple Calendar as the authority source for the game world time. This setting is ideal when you want Simple Calendar to be in control of the games time and don't want other modules updating Simple Calendar                                                                                                          | Updates the game world time to match what is in Simple Calendar. | Combat round changes will update Simple Calendars time. Simple Calendar will ignore updates from all others modules. |
| Third Party Module | This will instruct Simple Calendar to just display the Time in the game world time. All date changing controls are disabled and the changing of time relies 100% on another module. This setting is ideal if you are just want to use Simple Calenar to display the date in calendar form and/or take advantage of the notes. | Does not update the game world time.                             | Updates it's display everytime the game world time is changed, following what the other modules say the time is.     |
| Mixed              | This option is a blend of the self and third party options. Simple calendar can change the game world time and and changes made by other modules are reflected in Simple Calendar. This setting is ideal if you want to use Simple Calendar and another module to change the game time.                                       | Will update the game world time                                  | Will update it's own time based on changes to the game world time, following what other modules say the time is.     |

You can check out the [configuration](https://simplecalendar.info/pages/docs/calendar-configuration/general-settings.html#game-world-time-integration) section for more details.

#### Simple Calendar Clock

There is now a time of day clock that displays below the calendar to show the current time of the current day.
The GM can manually control this clock if they wish, or they can start the clock and have it update as real time passes.
The clock does also update as combat rounds pass. For more details on the clock check out [here](https://simplecalendar.info/pages/docs/using-sc/index/index.html#clock).

#### Configuration

You can configure the calendar with how many hours in a day, minutes in an hour and seconds in a minute.

You can also set the ratio of game time to real world seconds. This is used when the built-in clock is running and needs to update the game time as real world seconds pass. This ratio can be a decimal.
A ratio of 1 would mean for every second that passes in the real world 1 second passes in game time, a ratio of 2 would mean for every second of real world time 2 seconds pass in game.

### Other Modules

Simple Calendar also now interfaces with other modules. These modules can be used to adjust the game world time and have those changes reflected in Simple Calendar.

For two of the more common modules Simple Calendar can also import their settings into Simple Calendar or export Simple Calendars settings into those modules. The two modules that support this are about-time and Calendar/Weather.


### Seasons

Simple Calendar now supports seasons. Any number of seasons can be added to a calendar, and you are able to specify the following options for each season:

| Setting        | Description                                                                                                                                                                                                                                         |
|----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Season Name    | Specify a custom name of the season.                                                                                                                                                                                                                |
| Starting Month | From a drop down choose which month this season starts in. This drop down is populated based on the custom months that have been set up.                                                                                                            |
| Starting Day   | From a drop down choose which day of the the starting month this season begins on. This drop down is populated with a list of days based on the staring month selected.                                                                             |
| Color          | Seasons can be assigned a color, this color is used as the background color for the calendar display when it is the current season. There is a list of predefined colors that work well for standard season and the option to enter a custom color. |
| Custom Color   | If the color option is set to Custom Color an option will appear where you can enter a custom Hex representation of a color to use for the seasons color.                                                                                           |

The calendar display has also been updated so that right below the month and year the name of the current season will be displayed.

The background color of the calendar is also set based on the current season and its color settings.

I think this gives the best approach for defining seasons and allowing customization in how they look.

### Moons

Simple Calendar now supports the addition of moons. Any number of moons can be added to a calendar, and they can be customized to meet your needs.
For details on how to add and customize a moon please check out the [configuration documentation](https://simplecalendar.info/pages/docs/calendar-configuration/moon-settings.html).

The calendar now also displays the important (single day) moon phases on the calendar as well as the moon phase for the current day and selected day.

The predefined calendars have been updated to set up their moon(s) for the calendar.

### Notes

A configuration option has been added to allow players to add their own notes to the Calendar. If enabled they will see the "Add New Note" button on the main calendar display.

**Important**: For a user to add their own note a GM must also be logged in at the same time, a warning is displayed if a user attempts to add a note when not GM is logged in.

### Documentation

I did a complete re-organization/clean up of all the documentation around Simple Calendar. I also added in links within the Simple Calendar configuration window to this documentation. I hope this will help make configuration and use of the tool easier for all.


<hr/>

## v1.1.8 - Bug Fixes

![](https://img.shields.io/badge/release%20date-March%2010%2C%202021-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v1.1.8/module.zip)

- Fixed a rare bug where the day of the week a month starts on would be incorrect.
- Fixed an issue with the Harptos calendar preset where the wrong month was getting set as intercalary (oops)

<hr/>

## v1.1.6 - Bug Fixes & QoL Improvements

![](https://img.shields.io/badge/release%20date-March%205%2C%202021-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v1.1.6/module.zip)

### Bug Fixes
- Fixed an issue when editing an existing note and being unable to change when it repeats.
- When Adding a new note or editing an existing note, the title field is now the initial field in focus instead of the details section.
- The default title for new notes is now empty instead of "New Note".
- Moved the "Note Default Player Visibility" setting to be under the Calendars General Settings instead of module settings under the game.
- Cleaned up the Calendar styling.
- Misc improvements to back end code.

### QoL Improvements

#### Macro Support

A function has been added to allow users to make macros that open the calendar. 

This function can be accessed by using a script macro and running this command:

```javascript
MainApp.show();
```
**Important**: If this macro is intended to be useable by players don't forget to configure the Macros permissions for all players. It will need to be set to at least the "Limited", permission level.

The show function can take 3 parameters to set the year, month and day that the calendar opens up to.

| Parameter | Type           | Default | Details                                                                                                                                                                                                                                                                                                                                                                     |
|-----------|----------------|---------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Year      | number or null | null    | The year to open the calendar too. If null is passed in it will open the calendar to the year the user last viewed                                                                                                                                                                                                                                                          |
| Month     | number or null | null    | The month to open the calendar too.<br/>This month is expected to start at 0, or be the index of the month to show. This way intercalary months can be easily chosen by using their index as they don't have a month number.<br/>-1 can be passed in to view the last month of the year.<br/>If null is passed in the calendar will open to the month the user last viewed. |
| Day       | number or null | null    | The day of the month to select.<br/>The day is expected to start at 1.<br/>-1 can be passed in to select the last day of the month.<br/>If null is passed in the selected day will be the last day the user selected, if any.                                                                                                                                               |

##### Examples
All these examples assume we are using a standard Gregorian calendar.

Open the calendar to August 2003

```javascript
MainApp.show(2003, 7);
```

Open the calendar to December 1999 and select the 25th day

```javascript
MainApp.show(1999, 11, 25);
```

<hr/>

## v1.1.0 - Reoccurring Notes, Leap Years, Intercalary Months and Bug Fixes

![](https://img.shields.io/badge/release%20date-March%204%2C%202021-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v1.1.0/module.zip)

### Reoccurring Notes
This update adds the ability to have notes that repeat at certain intervals. When creating or editing a note the GM will be able to pick from these options for how often the note repeats:

- Never: This is the default option, this note will not repeat.
- Weekly: The note will repeat every week on the same day of the week.
- Monthly: The note will repeat every month on the same day of the month. **Important**: If the note is on a day of the month that not all months have (example: the 31st) then the note will not appear on months that don't have that day.
- Yearly: The note will repeat every year on the same month and day.

When viewing a note that is repeating there will be a message on the top right of the note indicating that this is a repeating note and how often it repeats.

### Leap Years

The calendar configuration dialog now has a section for configuration of leap years. There are several new options that should make setting up your own leap years easy.

- Leap Year Rule: This setting lets you define the rules you want around leap years. The options are:
    - None: The calendar contains no leap years
    - Gregorian: The calendars leap year rules are like the standard calendar (Every year that is exactly divisible by four is a leap year, except for years that are exactly divisible by 100, but these years are leap years if they are exactly divisible by 400)
    - Custom: Allows you to specify n interval in years for when a leap year happens.
- When Leap Years Happen: **This only appears if the custom rule is selected**. The number of years when a leap year occurs. Example a value of 5 would mean every 5th year is a leap year.
- Months List: A list of months will appear if you have the Gregorian or Custom rule selected. This list will show each month, and a textbox where you can change the number of days the corresponding month has during a leap year.

### Intercalary Months

When configuring the calendars months there is now an option to specify if a month is to be considered intercalary or not.
An intercalary month is one that does not follow the standard month numbering and is skipped. Example: If we were to add an intercalary month between January and February, January would still be considered the first month and February would be considered the second month. The new month does not get a number.

Intercalary months also do not count towards the years total days nor do they affect the day of the week subsequent months start on.

When you select a month to be intercalary, there is the option to include these days as part of the years total days and have its days afect the day of the week subsequent months start on. The month though still is not numbered.

### Bug Fixes and QoL improvements

This update also includes the following bug fixes and quality of life improvements:

- Added a new setting that will hide the day of week letter at the top of the calendar.
- Added a new module setting Note Default Player Visibility. This allows the GM to set for new notes, if by default the player visibility option is checked or not.
- Updated the note indicator that shows days with notes. The indicator is now a reddish circle that contains the number of notes on that day.
- The note dialog now opens at a consistent width so very long content will no longer stretch the dialog across the screen.
- Notes should be more consistent at saving with no details entered.
- Improved the layout of the calendar configuration dialog.
  Added some predefined calendars that a GM can choose to use. These replace the existing calendar configuration with a new one to match the world.
- Various improvements to the backend code.

<hr/>

## v1.0.3 - Bug Fixes

![](https://img.shields.io/badge/release%20date-February%2025%2C%202021-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v1.0.3/module.zip)

Fixed issues around viewing notes in years that were not the current year.

- Fixed an issue where clicking on a day in a year that was not in the current year, and the day would not get properly selected.
- Fixed an issue where changing years would not show notes in different years.
- Fixed an issue where clicking the today button would not take you to the correct day if you were viewing a different year.

<hr/>

## v1.0.0 - Initial Release

![](https://img.shields.io/badge/release%20date-February%2023%2C%202021-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v1.0.0/module.zip)

The initial public release of the simple calendar.

Set up your game worlds own calendar by configuring:

- The current year and any prefix or postfix on the year.
- The number of months in a year.
- The names of each month.
- The number of days in each month.
- The number  of days in a week and the name of each weekday.

As the GM you will also be able to change the current day in your game and add notes to days. Notes can be events or reminders and can be visible to players or just the GM.

The players are presented with a familiar calendar interface for switching between months and selecting days to see any notes on those days.
