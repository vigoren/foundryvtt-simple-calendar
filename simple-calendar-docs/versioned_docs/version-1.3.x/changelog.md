# Change Log

## v1.3.75 - Bug Fixes

![](https://img.shields.io/badge/release%20date-October%2011%2C%202021-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v1.3.75/module.zip)

  - Fixed a rare issue where date formats would throw an exception and cause the calendar and the configuration to not open.
  - Updated the Pathfinder 2E World Clock Sync to work properly with the updates World Clock in Pathfinder 2E System version 2.15.0 


<hr/>

## v1.3.73 - Translation Updates, Bug Fixes, API Changes

![](https://img.shields.io/badge/release%20date-October%206%2C%202021-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v1.3.73/module.zip)

### Bug Fixes

- Fixed some styling issues with dialogs in the Warhammer Fantasy 4E system.

### Translation Updates

- Updates to the Korean translation thanks to [drdwing](https://github.com/drdwing)!
- Updates to the Traditional Chinese translation thanks to [benwater12](https://github.com/benwater12)!
- Updates to the Spanish translation thanks to [lozalojo](https://github.com/lozalojo)!
- Updates to the Czech translation thanks to [robertjunek](https://github.com/robertjunek)!
- Updates to the Protugues (Brasil) translation thanks to [castanhocorreia](https://github.com/castanhocorreia)!
- Updates to the French translation thanks to [JDR-Ninja](https://github.com/JDR-Ninja)!

### API Changes

- Added a new hook `SimpleCalendar.Hooks.Ready` that is emitted when Simple Calendar is ready to go.
  - This hook can take a little longer for GM's to emit as there are some additional checks done to see which GM will be considered the primary GM.
- Updated the passed parameter for the hook `SimpleCalendar.Hooks.DateTimeChange` to include a new property, `diff`. This property contains the difference, in seconds, from the previous date and time to the new date and time.
- The function `SimpleCalendar.api.timestampToDate` has 1 new property `midday`. This value represents the timestamp for midday of the day from the passed in timestamp.
- Added a new property `SimpleCalendar.api.PresetTimeOfDay`. This property is used to set the time of day based on a list of preset times. Right now the options are: Midnight, Sunrise, Midday, Sunset.
- Added a new functions `SimpleCalendar.api.advanceTimeToPreset(preset)`. This function allows you to advance to the time and date of the next preset time of day. Examples:
  - Current time is 11am, advancing to the next sunset would change the time be 6pm the same day.
  - Current Time is 11am, advancing to the next sunrise would change the time and date to 6am the next day.

<hr/>

## v1.3.66 - Note Searching and Bug Fixes

![](https://img.shields.io/badge/release%20date-September%2030%2C%202021-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v1.3.66/module.zip)

### Note Searching

You can now search for notes!

- A new button has been added below the calendar called search. Click that will open a new dialog where you will be able to search for notes.
- All notes are searched using the following note fields are searched:
  - Title
  - Content
  - Date
- The list is sorted by relevancy to what was typed in.
- The search does not account for spelling errors or similar meaning words. It is a fairly basic search at the moment.

### Bug Fixes

- Fixed a bug where the Pathfinder 2E World Time Sync option would not display in the configuration window for PF2E games. This was just a display bug not a functionality bug.
- Fixed a bug where the clock would not use the custom time format while running.
- Fixed a bug where if the clock was running and a player joins, the clock would not run for the player until the GM stopped and started it again.

<hr/>

## v1.3.62 - Custom Date Formats, Quality of Life Improvements, API Changes and Bug Fixes

![](https://img.shields.io/badge/release%20date-September%2028%2C%202021-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v1.3.62/module.zip)

### Custom Date Formats

You can now customize how the date and time is displayed in Simple Calendar with custom date/time formats!

- New General Settings for specifying custom date/time formats to customize how dates and times are displayed in the calendar.
  - **Date Format**: This indicates how all dates will appear within Simple Calendar. The dates that are affected by this format are:
    - _**Full View**_: The note list heading, "Notes for [date]".
    - _**Compact View**_: The displayed date.
    - _**Date Selector**_: The date portion of the Date Selector text box.
    - _**Notes**_: The Date/Time pill in the note list and in the note display will use this format to display the date portion.
  - **Time Format**: This indicates how all times will be displayed within Simple Calendar. The times that are affected by this format are:
    - _**Full View**_: The clock below the calendar.
    - _**Compact View**_: The clock below the date.
    - _**Date Selector**_: The time portion of the Date Selector text box as well as the time selection text boxes.
    - _**Notes**_: The Date/Time pill in the note list and in the note display will use this format to display the time portion.
  - **Month/Year Format**: This indicates how the month and year are displayed at the top of the calendar in the Full View and the Date Selector.
- Above the new date format settings is a table that contains a list of all the tokens that can be used in the formats. This table is large so by default it is collapsed, but clicking the header will expand it. A detailed list of all the tokens is also available in the [configuration documentation](https://simplecalendar.info/pages/docs/calendar-configuration/display-options.html#datetime-formats).

### Quality of Life Improvements

- Added a new month configuration option to set the abbreviated name of the month. By default, the first 3 letters of the name are used.
  - This abbreviated text is used by the new date formatting.
  - The setting is under the advanced options.
- Added a new weekday configuration option to set the abbreviated name of the weekday. By default, the first 2 letters of the name are used.
  - This abbreviated text is sued by the new date formatting and as the heading for each weekday in the calendar view.


### Bug Fixes

- Improved the performance of drawing calendars with a large number of days and/or a calendar with a large number of notes.
- Fixed a bug where the `SimpleCalendar.Hooks.DateTimeChange` Hook would not fire for players when the date/time was changed.
- Fixed a bug where the real time clock would not run if the Game World Time Integration was set to None.

### API Changes

- Added a `date` property to the [Date Display Object](https://simplecalendar.info/interfaces/SimpleCalendar.DateDisplayData.html) that contains the formatted date string for the date. This object is part of the return from the `SimpleCalendar.api.timestampToDate` function.
- Updated the `time` property of the [Date Display Object](https://simplecalendar.info/interfaces/SimpleCalendar.DateDisplayData.html) so that it contains the formatted time string for the date.
- Added a new function to the API, `SimpleCalendar.api.formatDateTime(date)`. This takes in a DateTime object and will format it to the currently configured date and time formats. Check out the [API Docs](https://simplecalendar.info/modules/SimpleCalendar.api.html#formatDateTime) for more details!
- Added a new function to the API, `SimpleCalendar.api.getAllMonths()`. This function will return configuration details for all months in the calendar.
- Added a new function to the API, `SimpleCalendar.api.getAllMoons()`. This function will return configuration details for all moons of the calendar.
- Added a new function to the API, `SimpleCalendar.api.getAllWeekdays()`. This function will return configuration details for all weekdays in the calendar.
- Added a new function to the API, `SimpleCalendar.api.getCurrentDay()`. This function returns details for the current day of the calendar.
- Added a new function to the API, `SimpleCalendar.api.getCurrentMonth()`. This function returns details for the current month of the calendar.
- Added a new function to the API, `SimpleCalendar.api.getCurrentWeekday()`. This function returns details for the current weekday.
- Added a new function to the API, `SimpleCalendar.api.getCurrentYear()`. This function returns details for the current year of the calendar.
- Added a new function to the API, `SimpleCalendar.api.getLeapYearConfiguration()`. This function returns details for how leap years are configured for the calendar.
- Added a new function to the API, `SimpleCalendar.api.getTimeConfiguration()`. This function returns details for how time is configured for the calendar.


### Language Updates
- An update to the korean language file thanks to drdwing!

### Patreon

I have started up my own Patreon for those of you who are interested in supporting me as I develop this and other modules. There is zero pressure to do so as I create this module for fun but any contributions to get me a coffee are very much appreciated.

I will not tie any functionality of Simple Calendar to being a patron, Simple Calendar will always remain free for everyone. My plan for any patrons is to provide update posts with more detail on what I am working on and maybe some polls about features or functionality.

If you are interested is becoming a patron please check out [my page here](https://www.patreon.com/vigorator) and thank you!

<hr/>

## v1.3.44 - Bug Fixes

![](https://img.shields.io/badge/release%20date-September%2021%2C%202021-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v1.3.44/module.zip)

### Bug Fixes

- Fixed a bug where the Date/Time change hook would be fired multiple times while the clock was running.
- Fixed a bug where creating an empty combat would not pause the real clock when a combatant was added in.
- Fixed a bug where ending a combat in a scene that is not the active scene could restart the real time clock while a combat was running in the active scene.
- Fixed a bug where seasons that start on an Intercalary Month would not be sorted properly, this would cause the seasons to not be selected correctly.
  - This fix also applies to the Sunrise/Sunset calculation for seasons that start on an intercalary month.

### Pre-work for Multi-calendar Support

There have been a few requests to support more than one calendar and the ability to switch between them. 
Simple Calendar was built with only one calendar in mind, as such support for adding more than one calendar requires some backend code changes.
This update includes some of that work.

The changes in this update involved creating some new classes and moving functionality from other classes into those new classes. 
Since functionality has only been moved around and not changed there should be **no changes to how calendars or the API currently work**. 
All functionality will be exactly the same as the previous version, with the exception of the bug fixes above. 

This portion of the update is just informative to let everyone know where I am at with the multi-calendar support and that there have been some changes to the backend of the codebase.
If any bugs do crop up in your game I am sorry and please let me know with a bug report and I will fix it up right away.


<hr/>

## v1.3.39 - Season Changes, QoL Improvements, API Changes and Bug Fixing

![](https://img.shields.io/badge/release%20date-September%208%2C%202021-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v1.3.39/module.zip)

### Season Changes

- Updated the Starting Month and Starting Day fields to be one field "Starting Date" that uses the built-in Date Selector to choose a month and day.
- Added the ability to set the Sunrise and Sunset times for the first day of the season:
  - The setting of the times uses the built-in Time Selector to ensure that only times that work with your calendar can be chosen and that the sunset is always after the sunrise.
- Sunrise and sunset times slowly change as days progress to meet the sunrise/sunset time of the next season. This is to add a smooth transition between seasons sunrise and sunset times.
- Added buttons to the time control to advance to the next dawn, midday, dusk or midnight.
  - Dawn will advance to the next sunrise.
  - Midday will advance to the next middle of the day. The midday is calculated as the exact middle of the day, for most calendars this will be 12:00pm but for calendars with different hours per day it will calculate correctly.
  - Dusk will advance to the next sunset.
  - Midnight will advance to the next beginning of the day, time 00:00.
- Set up default sunrise/sunset times for predefined calendars. Where information was available used that otherwise they will default to a 6am sunrise and a 6pm sunset.

### Quality of Life Improvements

- Added a new time setting to specify how long a round of combat lasts in seconds. This is to address the issue where the clock did not advance as combat rounds passed when using systems that do not increment time during combat.
- Removed the Import/Export dialog for about-time and Calendar/Weather that appears on the first load of a world. This dialog was causing issues for some users and is no longer needed as these options can be reached through the calendar configuration dialog.

### API Changes

- Functions that return season information (`SimpleCalendar.api.getCurrentSeason`, `SimpleCalendar.api.getAllSeasons` and `SimpleCalendar.api.timstampToDate`) now includes the sunrise and sunset times for the season, as set through the new season options. The times are represented as seconds passed for that day eg. 3600 would be 1:00am in a Gregorian calendar.
- The function `SimpleCalendar.api.timestampToDate` has 2 new properties, sunrise and sunset. These values represent the timestamps for the sunrise and sunset times parsed from the passed in timestamp.
- Fixed a bug with the `SimpleCalendar.api.timestampToDate` function where the display time was always returning as the current time not the time from the passed in timestamp.


### Bug Fixes

- Fixed a bug with seasons always showing the last season for all, or most months. Seasons were expecting to be in order, now order does not matter.
- Improvements to the built-in date/time selector to ensure a better user experience.
- Fixed a bug where setting a different hours per day could cause the clock to not advance days properly.

### Foundry 0.8.9

- Made sure that Simple Calendar works as expected with Foundry version 0.8.9!

### Translations

- I am happy to say that Simple Calendar has been translated to French thanks to [JDR-Ninja](https://github.com/JDR-Ninja) with input from [Julien Stébenne](https://github.com/TheBird956)!
- Updates to the Spanish translation thanks to [lozalojo](https://github.com/lozalojo)!

<hr/>

## v1.3.28 - API Changes

![](https://img.shields.io/badge/release%20date-August%2011%2C%202021-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v1.3.28/module.zip)

- Updated the [DateTimeChange hook](https://simplecalendar.info/modules/SimpleCalendar.Hooks.html#DateTimeChange) to have a new property in its returned value called "date". This property contains the same contents as the [API timestampToDate function](https://simplecalendar.info/modules/SimpleCalendar.api.html#timestampToDate) with the current timestamp passed in. This is to have the exact same data available in the hook as the API function. As a result some existing properties will be removed as stated below:
  - **Future Breaking**: The property "year" will be removed when Foundry v10 Stable is released. Please use the year information from the new "date" property.
  - **Future Breaking**: The property "month" will be removed when Foundry v10 Stable is released. Please use the month information from the new "date" property.
  - **Future Breaking**: The property "day" will be removed when Foundry v10 Stable is released. Please use the day information from the new "date" property.
  - **Future Breaking**: The property "time" will be removed when Foundry v10 Stable is released. Please use the time information from the new "date" property.
  - **Future Breaking**: The property "season" will be removed when Foundry v10 Stable is released. Please use the season information from the new "date" property.
- Updated the [Clock Start/Stop hook](https://simplecalendar.info/modules/SimpleCalendar.Hooks.html#ClockStartStop) so that it uses the same function as the [API clockStatus function](https://simplecalendar.info/modules/SimpleCalendar.api.html#clockStatus). No change to returned values, this is to keep consistency between those functions.
- Updated the [PrimaryGM hook](https://simplecalendar.info/modules/SimpleCalendar.Hooks.html#PrimaryGM) so that it uses the same function as the [API isPrimaryGM function](https://simplecalendar.info/modules/SimpleCalendar.api.html#isPrimaryGM). No change to returned values, this is to keep consistency between those functions.
- Changed when the DateTimeChange hook is fired to include every tick of the clock.
- Added the "isLeapYear" property to the [Date Object](https://simplecalendar.info/interfaces/SimpleCalendar.DateData.html) returned by [timeStampToDate API function](https://simplecalendar.info/modules/SimpleCalendar.api.html#timestampToDate) that indicates if the date falls on a leap year or not.

<hr/>

## v1.3.23 - Note Reminders, API Changes, Bug Fixing and Translations

![](https://img.shields.io/badge/release%20date-August%207%2C%202021-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v1.3.23/module.zip)

### Note Reminders

GMs and players can select notes to be reminded of when the current calendar date and time read the date and time of the note.

- When viewing or adding a new note there is a "Remind Me!" button in the top right of the dialog. Clicking that will register you to be reminded about this note (the button will change green when registered).
- In the note list a green bell icon will appear next to the note(s) that you will be reminded of on that day.
- Days that have reminder notes for the player will have an additional blue indicator showing the number of notes they wanted to be reminded of on that day.
- When the current date changes to a day with a note reminder, all users who have registered to be reminded will receive a whispered chat message with the date, title of the note and the content of the note.
  - For notes with a set time they will be sent when the current time equals or is greater than the notes start time.
  - When a user first logs in any notes on the current day will be whispered to them.
  - These whispers are only sent once so if you move the day forward, whispers will be sent out then if you move back to that date whispers will not be re-sent.
    - This setting on persists per session, so if you re-load the page the whispers will be resent.
    - This is set up so that if the time is advanced past the starting time note reminders will still be sent but will not be continually sent as time changes.
  - If you skip a day with reminders those days reminders are not sent.
    - This is to prevent advancing the clock by a year and getting a year's worth of reminders all in one go.

### Quality of Life Improvements

- Added the Forbidden Lands calendar as a predefined calendar.

### API Changes

- Added a new enum `SimpleCalendar.api.Calendars`. This enum contains a list of all available predefined calendars in Simple Calendar.
- Added a new enum `SimpleCalendar.api.LeapYearRules`. This enum contains a list of all rules that can be used when calculating leap years.
- Added a new enum `SimpleCalendar.api.MoonIcons`. This enum contains a list of all available moon icons.
- Added a new enum `SimpleCalendar.api.MoonYearResetOptions`. This is an enum that contains the options for when a moons first new moon year should be reset.
- Added a new enum `SimpleCalendar.api.YearNamingRules`. This enum contains a list of all rules that can be used when determining what name a given year gets.
- Added a new function `SimpleCalendar.api.configureCalendar`. This function will set up the calendar configuration to be one of the predefined calendars (if an option from the new Calendars enum is passed in) or can take in a JSON object to configure the calendar in a custom way. The JSON object will look the same as the contents of a configuration export file.

### Bug Fixes

- Updated the styling around the note list to work better on systems with darker backgrounds.
- Changed the rules of determining the initial size of the note dialog to have a minimum height and a maximum width.
- Fixed a bug where calendars would get a scrollbar in Firefox when a moon icon was visible on the last week of that month.

### Translations

- Simple Calendar has been translated to Portuguese thanks to [castanhocorreia](https://github.com/castanhocorreia), thank you!
- Simple Calendar has been translated to Czech thanks to [robertjunek](https://github.com/robertjunek), thank you!
- Updates to the German translation thanks to [Fallayn](https://github.com/Fallayn)!
- Updates to the Korean translation thanks to [drdwing](https://github.com/drdwing)!

<hr/>

## v1.3.8 - Bug Fixes

![](https://img.shields.io/badge/release%20date-July%2015%2C%202021-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v1.3.8/module.zip)

### Quality of Life Improvements

- Changed the moon icons to a new set of SVG's. This will make the creation of Calendar themes easier in the future.

### Bug Fixes

- Fixed a bug for the DSA5 system where the save configuration button would float in the middle of the content.
- Fixed a bug where linked items (Journals, Tables, Macros, etc...) in notes were not linking properly.
- Fixed a bug where you were unable to set a note end time to be less than the start time for notes that spanned multiple days.
- Fixed a bug when converting seconds to a date where months with 0 days for that year were not skipped.
- Fixed a bug when calculating the seconds for a date for calendars with a "Leap Month" (A month with 0 days normally but days during a leap year) that had more than one day. The calendar would incorrectly advance by the number of days in that leap month.
- Fixed a bug where months were unable to have 0 leap year days.
- Fixed a bug where the moon calculation could occasionally say every day of a month was the same moon phase.

<hr/>

## v1.3.0 - Note Improvements

![](https://img.shields.io/badge/release%20date-July%2014%2C%202021-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v1.3.0/module.zip)

### Notes

This update is mainly around notes and improving the experience around adding, editing and viewing them. The notable improvements/changes to notes are:

#### Functional Changes

- Notes can now span more than 1 day.
- Notes can now have a start and end time associated with them.
- Added a built-in Date/Time selector. This is a new input type that will show a calendar where you can choose a day, or range of days for the note a well as add a start/end time for the note.
- Notes can now be ordered on a day. By default, notes are ordered by starting time but can be adjusted for a custom order.

#### New Configuration Options

- Added a new setting to allow players to order notes on a day or not.
- Added the ability to specify note categories with unique labels and colors. These can be applied to a note to help distinguish different types of notes.

#### Visual Changes

- Refreshed the look of the note list.
  - Added an indicator to the note list for GMs if the note is visible to the players or not.
  - Added a label to the note list for the time the note takes place at.
  - Added a label to the note list for who wrote the note.
  - Any custom note categories associated with the note will also be shown.
- Changed the dialog's behaviour so that it will attempt to size itself to fit the content of the note appropriately.
  
### Quality of Life Changes

- Added a button to the module settings list that will open Simple Calendars configuration window.
- Changed the default "Show Clock" option so that new installs will show the clock right away. The clock can still be disabled by unchecking that option.
- Changed the default for the "Game World Integration" from None to Mixed. This only affects new installs of the module.

### API Changes

- Fixed a bug with the API getCurrentSeason function where the last season would always be returned.
- Additional information about the Season is returned for the api functions `getCurrentSeason`, `getAllSeasons` and `timestampToDate`:
  - startingMonth: The month index the season starts on.
  - startingDay: The day index of the starting month the season starts on.
- Fixed a bug with the API function `timestampPlusInterval` where in PF2E systems the returned value would be ahead by 1 day.

### Bug Fixes

- Fixed a bug where the [Moerills Expandable Markdown Editor](https://www.foundryvtt-hub.com/package/markdown-editor/) would not load properly when adding/editing notes.
- Fixed a bug where on new installs the default month and weekday names would not load correctly.
- Added a temporary "fix" to help with the weirdness that happens when running the latest version of Calendar/Weather. This "fix" will go away once Calendar/Weather has finished their integration with Simple Calendar. Some things to note about the changes:
  - Any updates to the calendar structure (changing or months, season or moons) done within the Calendar/Weather interface will now require you to go into Simple Calendars configuration and re-import the calendar to have the changes reflected there.
  - I have run tests with PF2E worlds and everything should stay in sync with that systems world clock.
  - Calendar/Weather, about-time and Simple Calendar play better together but they will be their best when Calendar/Weather has finished its rewrite to properly utilize Simple Calendars API.
- Fixed an issued with importing events from Calendar/Weather.
  - In some instances Calendar/Weather Events don't have their month saved properly, in these instances the month is set to the first month of the year.

### Translations

- German Translation updates from [BlueSkyBlackBird](https://github.com/BlueSkyBlackBird) and [MasterZelgadis](https://github.com/MasterZelgadis), thanks!

<hr/>

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
