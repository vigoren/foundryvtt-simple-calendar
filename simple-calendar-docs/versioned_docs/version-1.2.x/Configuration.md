# Configuring Your calendar

Configuration of the calendar is straight forward. As the GM open the configuration dialog and start customizing your calendar!

## General Settings

This tab allows you to set some general settings for the entire calendar.

### Quick Setup

#### Predefined Calendars

This setting lets you choose from a list of predefined calendars to get your calendar started with. The following calendars can be selected to configure the game calendar:

Calendar|Description|Initial Date
--------|-----------|-------------
Gregorian|This the standard real life calendar|The current date will be used
Dark Sun |This is the calendar from the Sark Sun setting for Dungeons and Dragons|Scorch 1,1
Eberron| This is the calendar from the Eberron setting for Dungeons and Dragons | Zarantyr 1, 998 YK
Exandrian |This is the calendar from the Exandria setting for Dungeons and Dragons | Horisal 1, 812 P.D.
Golarian: Pathfinder 1E | This is the calendar from the Pathfinder 1E game | Abadius 1, 4710 AR
Golarian: Pathfinder 2E | This is the calendar from the Pathfinder 2E game | Abadius 1, 4710 AR
Greyhawk | This is the calendar from the Greyhawk setting for Dungeons and Dragons | Needfest 1, 591 cy
Harptos | This is the calendar used across Faerun in the Forgotten Realms | Hammer 1, 1495 DR
Traveller: Imperial Calendar|This is the Imperial calendar used for the Traveller game system|1, 1000
Warhammer | This is the calendar used by the Imperium in the Fantasy Warhammer game | Hexenstag 1, 2522

All of these calendars can be further customized after they are loaded. They are here to provide a simple starting point for your game.

### Game World Time Integration

These settings dictate how Simple Calendar interacts with Foundry's game world time (the in game clock). Most other modules that have timed events or deal with time tie into the game world time, so it is a great way to keep everything in sync. The different settings for how Simple Calendar can interact with the game world time are:

Option|Description|Update Game World Time|When Game World Time is Updated
--------|--------------------|-------------------------------------------------|----------------------------------------------------------
None (default)|Simple Calendar does not interact with the game world time at all. This setting is ideal if you want to keep Simple Calendar isolated from other modules.|Does not update the game world time|Simple Calendar is not updated when the game world time is updated by something else.
Self|Treats Simple Calendar as the authority source for the game world time. This setting is ideal when you want Simple Calendar to be in control of the games time and don't want other modules updating Simple Calendar|Updates the game world time to match what is in Simple Calendar.|Combat round changes will update Simple Calendars time. Simple Calendar will ignore updates from all others modules.
Third Party Module|This will instruct Simple Calendar to just display the Time in the game world time. All date changing controls are disabled and the changing of time relies 100% on another module. This setting is ideal if you are just want to use Simple Calenar to display the date in calendar form and/or take advantage of the notes.|Does not update the game world time.|Updates it's display everytime the game world time is changed, following what the other modules say the time is.
Mixed|This option is a blend of the self and third party options. Simple calendar can change the game world time and and changes made by other modules are reflected in Simple Calendar. This setting is ideal if you want to use Simple Calendar and another module to change the game time.|Will update the game world time|Will update it's own time based on changes to the game world time, following what other modules say the time is.

The most common interaction with another module is likely to be with Calendar/Weather. For this module I recommend using the "Self" or "Mixed" setting. With self weather effects will still trigger from Calendar/Weather as you advance time in Simple Calendar. Only use mixed if you also want to be able to use the Calendar/Weather controls to advance time to certain points (like dawn or dusk).

### Pathfinder 2E: World Clock Sync
For games running the Pathfinder 2E system, this setting will attempt to keep Simple Calendars date and time in sync with the Pathfinder 2E's World Clock.
- The setting only appears if you are using the Pathfinder 2E system.
- The Setting is enabled by default.
- For the Golarion (Absalom Reckoning) Date Theme in PF2E's world clock use Simple Calendars Golarian: Pathfinder 2E predefined calendar.
- For the Earth (Gregorian) or Unthemed (Gregorian) Date Theme in PF2E's world clock use Simple Calendars Gregorian predefined calendar

### Permissions

Permissions are role based so players in certain Foundry roles can be given extra permissions within Simple Calendar. These settings allow a GM to customize how and what players are allowed to interact with and change.

Permission|Description|Roles
----------|------------|----
View Calendar | If users in this role can view the calendar interface or not.|Player, Trusted Player, Assistant GM
Add Notes | If users in these roles are able to add notes to the calendar.|Player, Trusted Player, Assistant GM
Change Date and Time| If users in these roles are able to change the calendars date and time.|Player, Trusted Player, Assistant GM

### Import/Export

- Export Button: when clicked you will be prompted to download a json file that contains all of the configuration data.
- Import Button/ File Selector: Next to the import button is a file selected where you choose the exported json file to import then click the import button for the contents to be set for the current calendar.

**Important**: This import and export is just for the calendar configuration, notes are not exported or imported through this process! Note exporting is planned, just not ready yet.

### Third Party Module Import/Export

If you have certain other modules installed and active in your game, options will appear here to either import their settings into Simple Calendar or to export Simple Calendars settings into that module.
The current supported modules for importing/exporting settings:

#### about-time

The [about-time](https://foundryvtt.com/packages/about-time) module is used for many other modules but can also be used on its own. 

Settings can be imported and exported between these two modules without issue.

#### Calendar/Weather

The [Calendar/Weather](https://foundryvtt.com/packages/calendar-weather) module is used as a way to integrate about-time with a custom calendar and additional weather effects.

Most settings can be imported and exported between these two modules with these notable exceptions:

- Calendar/Weather does not seem to support Leap Years at all (see this [line of code](https://github.com/DasSauerkraut/calendar-weather/blob/89b59e047c86c979b246ae385c471f4e824eaaa1/modules/dateTime.mjs#L42)) as a result:
    - When Importing from Calendar/Weather no leap year rule will be set in Simple Calendar.
    - When Exporting to Calendar/Weather the date will be off by the number of leap days that have passed so far. Example if there have been 4 leap years with 1 extra day each year the Calendar/Weather's calendar will be ahead by 4 days. This gets very exaggerated when using a Gregorian calendar for today's date as there have been 490 extra leap days for 2021.
- Calendar/Weather's season colors and Simple Calendar's season colors do not line up so they are not Imported or Exported.
- Calendar/Weather's season month is not properly stored:
    - When Importing from Calendar/Weather every season will have its month set to be the first month.
    - When Exporting to Calendar/Weather every season will have no month set.

## Note Settings

This tab contains the settings for creating and interacting with notes.

Setting | Description
-------- | ----------
Note Default Player Visibility | For new notes, if by default the player visibility option is checked or not.



## Year Settings

This tab allows you to change some settings about the years in your game world

### Current Year

This section is for setting information about the current year. The settings that are available to change are listed below:

Setting | Description
-------- | ----------
Current Year | The Current year your game world is in. This can be any positive number.
Year Prefix | Text that will appear before the year number.
Year Postfix | Text that will appear after the year number.
Year Zero | This is the year that considered to be year zero for calculating how much time has passed.<br/>Generally this setting will not need to be adjusted but is present for calendars that require a different year zero.<br/>The best example of this is calculating real world timestamps, the year 1970 is used as year zero.

### Year Names

With the options below you can configure how Simple Calendar will name years in the calendar.

Setting|Description
-------|-----------
Year Names | This is a list of different names that can be used for the years.
Year Name Behaviour|This drop down is used to determine how the year names are applied to years. The options are:<br/><strong>Default:</strong> The year list starts at the specified starting year and goes down the list for each subsequent year. If the year is past the number of names in the list it will continue to use the last name from the list.<br/><br/><strong>Repeat</strong>: The year list starts at the specified starting year and goes down the list for each subsequent year. When the current year is past the name list length it will start again at the top of the list and repeat it forever.<br/><br/><strong>Random</strong>: For every year a random name from the list will be chosen. The calendar will do its best to keep the same name for a year.
Starting Year For Names | This is the year that the first name in the list of Year Names is associated with.<br/>This option only appears if the Year Name Behaviour setting is set to None or Repeat.


### Seasons

This section displays all the seasons that exist in the calendar. 
Seasons are optional but can provide a nice thematic for your world.
The options available for customizing each Season are listed below:

Setting | Description
--------|------------
Season Name | These text boxes for each season allow you to change the name of an existing season.
Starting Month | These drop downs for each season show all of the months of your calendar and allow you to choose which month this season starts in.
Starting Day | These drop downs for each season show all of the days for the selected Starting Month and allow you to choose with day the season starts on in that month.
Color | Seasons can be assigned a color, this color is used as the background color for the calendar display when it is the current season. There is a list of predefined colors that work well for standard season and the option to enter a custom color.
Custom Color | If the color option is set to Custom Color this text box will appear where you can enter a custom Hex representation of a color to use for the season.
Remove Button | These buttons for each season allow you to remove the specific season from the list.
Add New Season Button | This button will add a new season to the bottom of the list with a default name that you can then configure to your liking.
Remove All Seasons Button | This button will remove all of the seasons from the list.

## Month Settings

This tab displays all the months that exist in the calendar. Here you can change month names, the number of days in a month, remove a month, add a new month or remove all months.

Setting | Description
-------- | ----------
Month Name | These text boxes for each month allow you to change the name of an existing month.
Number of Days | These text boxes for each month allow you to change the number of days in each month. A month can have a minimum of 0 days.
Intercalary Month | An intercalary month is one that does not follow the standard month numbering and is skipped.<br/>Example: If we were to add an intercalary month between January and February, January would still be considered the first month and February would be considered the second month. The new month does not get a number.<br/>Intercalary months also do not count towards the years total days nor do they affect the day of the week subsequent months start on.
Include Intercalary Month in Day Calculations | When you select a month to be intercalary this option will appear. When checked the intercalary month will be treated like a normal month for calculating the day of the week days fall on and the total days in a year but still be listed as an intercalary month.
Day Offset | The number of days to offset the day's number by. Example: Setting to 1 will have the month start on day 2 instead of day 1.
Starts On Weekday | Choose which day of the week that this month starts on. Leave on Default to have the calendar figure out the appropriate weekday to start the month on.
Remove Button | These buttons for each month allow you to remove the month from the list.
Add New Month Button | This button will add a new month to the bottom of the list with a default name and number of days that you can then configure to your liking.
Remove All Months Button | This button will remove all of the months from the list.


## Weekday Settings

This section displays all the weekdays that exist in the calendar. Weekdays are used to determine how wide the calendar display should be and how to make month days to each day of the week.

There are some global settings that affect all weekedays and they are as follows:

Setting | Description
-------- | ----------
Show Weekday Headings| If checked on the calendar view a row of weekday headings will show above the list of days. If unchecked these headings will be hidden.
Starting Week Day| This is used to select the day of the week that the first day of year 0 starts on. This can be used to help adjust the calendar so the days line up with official calendars.

The individual weekday settings are listed below:

Setting | Description
-------- | ----------
Weekday Name | These text boxes for each weekday allow you to change the name of an existing weekday.
Remove Button | These buttons for each weekday allow you to remove the weekday from the list.
Add New Weekday Button | This button will add a new weekday to the bottom of the list with a default name that you can then configure to your liking.
Remove All Weekdays Button | This button will remove all of the weekdays from the list.

## Leap Year Settings

This section allows the GM to configure how leap years work for this calendar.

Setting | Description
-------- | ----------
Leap Year Rule | Which ruleset to follow when determining leap years. The options are <ul><li>None: The calendar contains no leap years</li><li>Gregorian: The calendars leap year rules are like the standard calendar (Every year that is exactly divisible by four is a leap year, except for years that are exactly divisible by 100, but these years are leap years if they are exactly divisible by 400)</li><li>Custom: Allows you to specify n interval in years for when a leap year happens.</li></ul>
When Leap Years Happen | **This only appears if the Custom leap year rule is selected**.<br/>The number of years when a leap year occurs. Example a value of 5 would mean every 5th year is a leap year.
Months
After you have changed the settings to your liking don't forget to save the configuration by hitting the Save Configuration button!
List | **This only appears if the Custom or Gregorian leap year rule is selected**.<br/>A list of months will appear that shows each month, and a textbox where you can change the number of days the corresponding month has during a leap year. A month can have a minimum of 0 leap year days.


## Time Settings

This section allows the GM to configure how hours, minutes and seconds work in their world.

Setting | Description
-------- | ----------
Hours in a Day | This defines how many hours make up a single day.
Minutes in a Hour | This defines how many minutes make up a single hour.
Seconds in a Minute | This defines how many seconds make up a single minute.


### Clock Settings

Settings specific to the clock portion of the calendar.

Setting | Description
-------- | ----------
Show Clock | 	This setting is used to show the time clock below the calendar or to hide it. Not all games care about keeping track of the specific time of day so this is a great option to disable that part. Hiding the clock also hides the controls for changing hours, minutes, seconds.
Game Seconds Per Real Life Seconds | This is used to determine how quickly game time advances when running the Simple Calendar clock. With a value of 1, for every real life seconds 1 second passes in the game. With a value of 2 for every 1 real life seconds 2 seconds pass in game. This does support decimals for more specific control.
Update Frequency | THis determines how often (in seconds) the clock is updated. By default the clock updates every second but this can be changed to less frequently if that is desired.
Unify Clock Start/Pause With Game Pause | This ties the clocks start/pause button with the game pause state. Starting the clock will unpause the game, pausing the clock will pause the game. The opposite is true as well.

## Moon Settings

This section allows the GM to configure the different moons of the world so that their cycles display on the calendar.

There are lots of settings when configuring a moon to make it as customized as you would like.

### Main Settings

Settings | Description
---------|------------
Moon Name | The name of the moon, used to help distinguish between moons when there are more than one. Will show when hovering over a moon on the calendar view.
Cycle Length | How many days it takes the moon to go from new moon to new moon. This field supports decimal places to get as precise as needed.
Cycle Adjustment | When calculating how many days into a cycle a given date is, adjust that by this many days. This value will most likely be a decimal of less than 1 as adjustments do not need to be that large but supports any number.
Moon Color | A color to associate with the moon. This is used to color the moon icons on the calendar view and helps distinguish between multiple moons. This is a hex color value.
Remove | Will remove this moon from the list of moons.
Add New Moon | Will add a moon to the list of moons.
Remove All Moons | Will remove all moons from the list of moons.

### Reference New Moon Settings

This group of settings is used to tell the Calendar of when a New Moon occurred so that it can base when others will happen based off of that date.

Settings | Description
---------|------------
Reference Moon Year Reset | This can be used to tell the calendar to reset the year portion of the reference new moon. Options are:<br/><ul><li>**Do not reset reference year**: this will always use the entered year as the reference year.</li><li>**Reset reference year every leap year**: This will reset the reference year being used to the year of the most recent leap year. Some calendars (Harptos) have their moons cycle reset on leap years.</li><li>**Reset reference year every X years**: The same as the reset every leap year but instead will reset every X number of years entered. This is handy if the reference years need to reset and there are no leap years or they reset on a different schedule than leap years.</li></ul>
New Moon Year| **Important**: This only shows when the Reference Moon Year Reset is set to "Do not reset reference year". This is the year of the reference new moon.
Reset Reference Moon Years | **Important**: This only shows when the Reference Moon Year Reset is set to "Reset reference year every X years". This is how often, in years, to reset the reference year.
New Moon Month | A drop down of all the months in the calendar where you can choose which month the new moon took place in.
New Moon Day | A drop down of all the days for the selected new moon month where you can choose which day the new moon took place on.

### Phases

This section allows you to customize the different phases of the moon. Generally there will be no need to change the defaults for this, but the option is there in case it is required.

Settings | Description
---------|------------
Phase Name | The name of the phase.
Phase Length | The calculated number of days this phase will last based on the total number of phases and the moons cycle length.
Phase Single Day | If this phase should only happen on 1 day, rather than over several days. This is used from the important moon phases like full moon.
Phase Icon | Select from a list of available icons to use when displaying this phase of the moon.
Remove | Removes this phase from the moons list of phases.
Add New Moon Phase | Adds a new phase to the list of phases for this moon.
Remove All Moon Phases | Removes all phases from the list of phases for this moon.
