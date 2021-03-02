# Change Log

## v1.1.0 - Reoccurring Notes, Leap Years and Bug Fixes

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

### Bug Fixes and QoL improvements

This update also includes the following bug fixes and quality of life improvements:

- Improved the layout of the calendar configuration dialog.
- Added a new module setting Note Default Player Visibility. This allows the GM to set for new notes, if by default the player visibility option is checked or not.
- Notes should be more consistent at saving with no details entered.
- Updated the note indicator that shows days with notes. The indicator is now a reddish circle that contains the number of notes on that day.
- The note dialog now opens at a consistent width so very long content will no longer stretch the dialog across the screen.
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
