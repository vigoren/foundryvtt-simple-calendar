# Change Log

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
