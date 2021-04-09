# Change Log

## v1.2.10 - Bug Fixes and QoL Improvements

### Quality of Life Improvements

- Cleaned up the styling of the calendar dialog. The calendar will now consistently open so that the calendar, date controls (if gm) and 2 rows of notes will be visible.
- Resizing of the calendar dialog will now reset when you close and re-open the dialog.
- Added the Traveller - Imperial Calendar as a predefined calendar.
- Added a new section in month configuration called Advanced. Clicking on a months "Show Advanced" link will show the advanced options' area. This area will contain things that are probably not relevant to most calendars.
- Added a new option to months advanced settings to offset the day numbers by an amount. This is to accommodate instances where a month may start on day 2. The best example is the Traveller calendar where days are numbered by what day of the year they are rather than which day of the month they are.

### Bug Fixes

## v1.2.5 - Bug Fixes and QoL Improvements

### Quality of Life Improvements

- Adjusted the styling around the calendar configuration tabs. The tab titles shouldn't break into multiple lines unless the config window is shrunk and if they do break into multiple lines it should look cleaner.
- Adjusted the starting height of the calendar to have more space for the events list.
- Updated adding/editing a note so that the text editor does not need to be saved before saving the note. When saving the note any content entered will be saved.
- Updated the weekday headings so that the first 2 characters of the weekday name are shown. This will help distinguish between days of the week that start with the same character.

### Bug Fixes

- Fixed a bug where in some instances importing data from Calendar/Weather into Simple Calendar would incorrectly save numerical data as strings causing Simple Calendar to not open.

## v1.2.0 - Time, Other Modules, Seasons, Moons and Notes

This update was a long time coming so apologies for making you wait for it. This update with most of the currently requested changes to Simple Calendar

### Time

Simple Calendar now supports time of day! What this means is that Simple Calendar can now be tied into FoundryVTTs game world time. This allows any other module that ties into the game world time to be updated whe Simple Calendar updates or update Simple Calendar when they change the game world time.

There are 4 different options on how to tie into the game world time to achieve the exact level of interaction you want for your world. They are:

Option|Description|Update Game World Time|When Game World Time is Updated
--------|--------------------|-------------------------------------------------|----------------------------------------------------------
None (default)|Simple Calendar does not interact with the game world time at all. This setting is ideal if you want to keep Simple Calendar isolated from other modules.|Does not update the game world time|Simple Calendar is not updated when the game world time is updated by something else.
Self|Treats Simple Calendar as the authority source for the game world time. This setting is ideal when you want Simple Calendar to be in control of the games time and don't want other modules updating Simple Calendar|Updates the game world time to match what is in Simple Calendar.|Combat round changes will update Simple Calendars time. Simple Calendar will ignore updates from all others modules.
Third Party Module|This will instruct Simple Calendar to just display the Time in the game world time. All date changing controls are disabled and the changing of time relies 100% on another module. This setting is ideal if you are just want to use Simple Calenar to display the date in calendar form and/or take advantage of the notes.|Does not update the game world time.|Updates it's display everytime the game world time is changed, following what the other modules say the time is.
Mixed|This option is a blend of the self and third party options. Simple calendar can change the game world time and and changes made by other modules are reflected in Simple Calendar. This setting is ideal if you want to use Simple Calendar and another module to change the game time.|Will update the game world time|Will update it's own time based on changes to the game world time, following what other modules say the time is.

You can check out the [configuration](./docs/Configuration.md#game-world-time-integration) section for more details.

#### Simple Calendar Clock

There is now a time of day clock that displays below the calendar to show the current time of the current day.
The GM can manually control this clock if they wish, or they can start the clock and have it update as real time passes.
The clock does also update as combat rounds pass. For more details on the clock check out [here](./docs/UsingTheCalendar.md#simple-calendars-clock).

#### Configuration

You can configure the calendar with how many hours in a day, minutes in an hour and seconds in a minute.

You can also set the ratio of game time to real world seconds. This is used when the built-in clock is running and needs to update the game time as real world seconds pass. This ratio can be a decimal.
A ratio of 1 would mean for every second that passes in the real world 1 second passes in game time, a ratio of 2 would mean for every second of real world time 2 seconds pass in game.

### Other Modules

Simple Calendar also now interfaces with other modules. These modules can be used to adjust the game world time and have those changes reflected in Simple Calendar.

For two of the more common modules Simple Calendar can also import their settings into Simple Calendar or export Simple Calendars settings into those modules. The two modules that support this are about-time and Calendar/Weather. Check out this [documentation](./docs/Configuration.md#third-party-module-importexport) for more details on how it all works.


### Seasons

Simple Calendar now supports seasons. Any number of seasons can be added to a calendar, and you are able to specify the following options for each season:

Setting | Description
--------|------------
Season Name | Specify a custom name of the season.
Starting Month | From a drop down choose which month this season starts in. This drop down is populated based on the custom months that have been set up.
Starting Day | From a drop down choose which day of the the starting month this season begins on. This drop down is populated with a list of days based on the staring month selected.
Color | Seasons can be assigned a color, this color is used as the background color for the calendar display when it is the current season. There is a list of predefined colors that work well for standard season and the option to enter a custom color.
Custom Color | If the color option is set to Custom Color an option will appear where you can enter a custom Hex representation of a color to use for the seasons color.

The calendar display has also been updated so that right below the month and year the name of the current season will be displayed.

The background color of the calendar is also set based on the current season and its color settings.

I think this gives the best approach for defining seasons and allowing customization in how they look.

### Moons

Simple Calendar now supports the addition of moons. Any number of moons can be added to a calendar, and they can be customized to meet your needs.
For details on how to add and customize a moon please check out the [configuration documentation](./docs/Configuration.md#moon-settings).

The calendar now also displays the important (single day) moon phases on the calendar as well as the moon phase for the current day and selected day.

The predefined calendars have been updated to set up their moon(s) for the calendar.

### Notes

A configuration option has been added to allow players to add their own notes to the Calendar. If enabled they will see the "Add New Note" button on the main calendar display.

**Important**: For a user to add their own note a GM must also be logged in at the same time, a warning is displayed if a user attempts to add a note when not GM is logged in.

### Documentation

I did a complete re-organization/clean up of all the documentation around Simple Calendar. I also added in links within the Simple Calendar configuration window to this documentation. I hope this will help make configuration and use of the tool easier for all.


## v1.1.8 - Bug Fixes

- Fixed a rare bug where the day of the week a month starts on would be incorrect.
- Fixed an issue with the Harptos calendar preset where the wrong month was getting set as intercalary (oops)

## v1.1.6 - Bug Fixes & QoL Improvements

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
SimpleCalendar.show();
```
**Important**: If this macro is intended to be useable by players don't forget to configure the Macros permissions for all players. It will need to be set to at least the "Limited", permission level.

The show function can take 3 parameters to set the year, month and day that the calendar opens up to.

Parameter|Type|Default|Details
---------|----|-------|-------
Year | number or null | null | The year to open the calendar too. If null is passed in it will open the calendar to the year the user last viewed
Month | number or null | null | The month to open the calendar too.<br/>This month is expected to start at 0, or be the index of the month to show. This way intercalary months can be easily chosen by using their index as they don't have a month number.<br/>-1 can be passed in to view the last month of the year.<br/>If null is passed in the calendar will open to the month the user last viewed.
Day | number or null | null | The day of the month to select.<br/>The day is expected to start at 1.<br/>-1 can be passed in to select the last day of the month.<br/>If null is passed in the selected day will be the last day the user selected, if any.

##### Examples
All these examples assume we are using a standard Gregorian calendar.

Open the calendar to August 2003
```javascript
SimpleCalendar.show(2003, 7);
```

Open the calendar to December 1999 and select the 25th day
```javascript
SimpleCalendar.show(1999, 11, 25);
```

## v1.1.0 - Reoccurring Notes, Leap Years, Intercalary Months and Bug Fixes

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

## v1.0.3 - Bug Fixes

Fixed issues around viewing notes in years that were not the current year.

- Fixed an issue where clicking on a day in a year that was not in the current year, and the day would not get properly selected.
- Fixed an issue where changing years would not show notes in different years.
- Fixed an issue where clicking the today button would not take you to the correct day if you were viewing a different year.

## v1.0.0 - Initial Release

The initial public release of the simple calendar.

Set up your game worlds own calendar by configuring:

- The current year and any prefix or postfix on the year.
- The number of months in a year.
- The names of each month.
- The number of days in each month.
- The number  of days in a week and the name of each weekday.

As the GM you will also be able to change the current day in your game and add notes to days. Notes can be events or reminders and can be visible to players or just the GM.

The players are presented with a familiar calendar interface for switching between months and selecting days to see any notes on those days.
