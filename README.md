[![foundry](https://img.shields.io/badge/Foundry-0.7.9-orange)](https://foundryvtt.com/releases/)
![GitHub package.json version](https://img.shields.io/github/package-json/v/vigoren/foundryvtt-simple-calendar)
[![license](https://img.shields.io/badge/license-MIT-blue)](https://github.com/vigoren/foundryvtt-simple-calendar/blob/main/LICENSE)
[![jest](https://jestjs.io/img/jest-badge.svg)](https://github.com/facebook/jest)
[![codecov](https://codecov.io/gh/vigoren/foundryvtt-simple-calendar/branch/main/graph/badge.svg?token=43TJ117WP1)](https://codecov.io/gh/vigoren/foundryvtt-simple-calendar)

![Logo](https://raw.githubusercontent.com/vigoren/foundryvtt-simple-calendar/main/docs/images/logo.png)

# Simple Calendar

A simple calendar module for [FoundryVTT](https://foundryvtt.com/) that is system independent. 

This module allows you to create a calendar with any number of months per year and any number of days per month for your game world.
It is intended as a way for a GM to show a calendar like interface that maps to their in game world.
The simple calendar module does not keep track of time or tie into any system to advance the day, date changing is a manual process by the GM.

If you are looking for a module that tracks in game time and has weather related effects I recommend you check out the [Calendar/Weather module](https://www.foundryvtt-hub.com/package/calendar-weather/).

## GM Features:

* Configure the calendar to meet your worlds needs
    * Set the year as well as add any prefix or postfix to the years name
    * Define how many months in a year
    * Set a custom name for each month
    * Set the number of days in each month
* Set and change the current day as your game story progresses
* Add notes to specific days on the calendar to remind yourself of events or other world related things
    * These notes can either be visible to players as well as the GM or just the GM
    
## Player Features:

* Browse a calendar interface to see the years, months and day of the game world
* Select days to see any notes/events specific to that day

## Accessing and using the Calendar
The module adds a calendar button to the basic controls section of the layer controls. Clicking on this will open the module window

![Calendar Button Location](https://raw.githubusercontent.com/vigoren/foundryvtt-simple-calendar/main/docs/images/layers-button.png)

The above image helps shows the controls, they are detailed out below.

Control | Description
------- | -----------
Previous/Next | Allow the user to change which month/year they are currently viewing.
Today Button | Changes the calendar so that the current day (in the game world) is visible and selected.
Blue Circle Day | This indicates the current day in the game world, can be changed by the GM
Green Circle Day | This indicates the day the user currently has selected. This will show any notes on this day.
Orange Icon | This shows on any days that have notes that the user can see.
Notes List | Any notes that appear in this list can be clicked on to open the note details.

### Note Details

The note details shows all the information about a specific note: the date the note is for, the title of the note and the content of the note.

![Calendar Button Location](https://raw.githubusercontent.com/vigoren/foundryvtt-simple-calendar/main/docs/images/note-view.png)

## Updating the Current Date
The GM version of the module looks a little different, with the addition of controls to change the current date and a button to enter the configuration. 

![GM View](https://raw.githubusercontent.com/vigoren/foundryvtt-simple-calendar/main/docs/images/gm-view.png)

The above image helps shows the controls, they are detailed out below.

Control | Description
------- | -----------
Day Back/Forward | This moves the current day forward or back one day.
Month Back/Forward | This moves the current month forward or back one month. The current day will be mapped to the same day as the old month, or the last day of the month if the old month has more days.
Year Back/Forward | This moves the current year forward or back one year. The current month and day will stay the same in the new year.
Apply | This will apply the changes, saving the new current day in the settings and updating all of the players calendars to reflect the new current day.
Configuration | This opens up the configuration dialog to allow the GM to fully customize the calendar.
Add New Note Button | This will open the add notes dialog to add a new note for the selected day.

## Adding, Editing and Removing notes

The GM has the ability to add new notes by clicking on the add new note button for a selected date. This will open a dialog where the details of the note can be filled out.

![Calendar Button Location](https://raw.githubusercontent.com/vigoren/foundryvtt-simple-calendar/main/docs/images/note-new.png)

Field | Description
------- | -----------
Note Title | The title for the note, this title will appear in the listing of notes for the day.
Player Visible | If this note can be seen by players or if it is for the GM only.
Details | Here you can enter the details of a note using the built in text editor.

After all of the details are filled out you can save the note.

**Important**: If you have not saved the content in the text editor using the text editor save button, a warning will appear when you try to save the note letting you know.

The GM can also edit or delete existing notes. To do this click on an existing note, at the bottom of the note view 2 additional buttons will be visible, Edit and Delete. 

Button | Description
------- | -----------
The Edit button | This will load the contents of the note in the same editor as creating a new note.
The Delete button | This will open up a confirmation dialog, where selecting delete again will permanently remove the note.

## Configuring Your calendar

Configuration of the calendar is straight forward. As the GM open the configuration dialog and start customizing your calendar!

### Year Settings

This section allows you to change some settings about the years in your game world

Setting | Description
-------- | ----------
Current Year | The Current year your game world is in. This can be any positive number.
Year Prefix | Text that will appear before the year number.
Year Postfix | Text that will appear after the year number.

### Month Settings

This section displays all the months that exist in the calendar. Here you can change month names, the number of days in a month, remove a month, add a new month or remove all months.

Setting | Description
-------- | ----------
Month Name | These text boxes for each month allow you to change the name of an existing month.
Number of Days | These text boxes for each month allow you to change the number of days in each month.
Remove Button | These buttons for each month allow you to remove the month from the list.
Add New Month Button | This button will add a new month to the bottom of the list with a default name and number of days that you can then configure to your liking.
Remove All Months Button | This button will remove all of the months from the list. 


### Weekday Settings

This section displays all the weekdays that exist in the calendar. Weekdays are used to determine how wide the calendar display should be and how to make month days to each day of the week.

Setting | Description
-------- | ----------
Weekday Name | These text boxes for each weekday allow you to change the name of an existing weekday.
Remove Button | These buttons for each weekday allow you to remove the weekday from the list.
Add New Weekday Button | This button will add a new weekday to the bottom of the list with a default name that you can then configure to your liking.
Remove All Weekdays Button | This button will remove all of the weekdays from the list.


After you have changed the settings to your liking don't forget to save the configuration by hitting the Save Configuration button!
