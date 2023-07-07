# Change Log

## 2.2.0 - Foundry Version 11 Update, Quality of Life Updates & Bug Fixes

![](https://img.shields.io/badge/release%20date-May%2024%2C%202023-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v2.2.0/module.zip)

### Foundry Version 11 Update

Updated Simple Calendar to be functional with FoundryVTT version 10 and 11.

Fixes Include:

- Fixed when moving the application window to a new location, releasing the mouse would not stop the dragging action.
- Fixed switching into compact mode would fail to stay in compact mode.
- Fixed the icon for the button under "Journal Notes" not displaying correctly.

### Quality of Life Updates

- Added a new predefined calendar for White Wolf's Exalted setting (Thanks [Aliharu](https://github.com/Aliharu)!)

### Bug Fixes

- Fixed a bug where system specific themes would not load images properly if a routePrefix was set in Foundry's configuration.
- Fixed an issue where if the setting [Show Clock](https://simplecalendar.info/pages/calendar-configuration/index/time-settings.html#clock-settings) was disabled and a user was using the [Quick Increment](https://simplecalendar.info/pages/calendar-configuration/index/display-options.html#compact-view-options) Compact view layout no buttons would appear to adjust the date.
- Fixed a bug where a macro could not be selected from the macro list in a note.

### Translation Updates

Thank you to the follow people for making updates to Simple Calendars translations:

- [Sven Hesse](https://weblate.foundryvtt-hub.com/user/DrMcCoy/) (German)
- [vincent](https://weblate.foundryvtt-hub.com/user/rectulo/) (French)
- [Jakub](https://weblate.foundryvtt-hub.com/user/Lioheart/) (Polish)
- [SwedishRabbit](https://github.com/SwedishRabbit) (Swedish)

<hr/>

## 2.1.80 - Quality of Life Updates && Bug Fixes

![](https://img.shields.io/badge/release%20date-February%2004%2C%202023-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v2.1.80/module.zip)

### Quality of Life Updates

- Changed the [Update Frequency](https://simplecalendar.info/pages/calendar-configuration/index/time-settings.html#clock-settings) setting so that it can support decimals. This can allow you to set an "Update Frequency" of 0.5 and a "Game Seconds Per Real Life Seconds" of 2 to get the game to move at twice the speed but have the clock still update for every game second.
- Updated the compact view to show up to 5 moons before collapsing them into a hover-over view.
- Added a new client setting "Compact View Scale" that allows you to change the scale at which the compact view is displayed at. You can use this to make the compact view appear larger or smaller. The number represents the percentage of the scale size when compared to the default size, 100%. The range goes in increments of 10 from 70% to 200%.
- Added support for keyboard key modifiers when in compact view with [Time Control Layout](https://simplecalendar.info/pages/calendar-configuration/index/display-options.html#compact-view-options) set to `Quick Increment`:
  - **Shift Key**: When the shift key is held down the amount of time that is changed for each increment is increased from `1 round, 1 minute, 5 minutes, 15 minutes, 1 hour` to `5 rounds, 5 minutes, 20 minutes, 45 minutes, 5 hours`.
  - **Control Key**: When the control key is held down each increment will be subtracted from the current time, this can be combined with the shift key for going back in time by larger amounts.

### Bug Fixes

- Fixed an issue where the hook `SimpleCalendar.Hooks.DateTimeChange` would fire twice when the time changed while the clock was running. It should now only fire once for every time increment.
- Fixed an issue where on the full calendar view the preset time of day buttons would sometimes get bumped down to a second row.
- Fixed an issue where when in the compact view with the [Time Control Layout](https://simplecalendar.info/pages/calendar-configuration/index/display-options.html#compact-view-options) set to `Full Controls` the unit selector would open up when near the top of the page potentially making some options inaccessible.

### Translation Updates

Thank you to the follow people for making updates to Simple Calendars translations:

- [vincent](https://weblate.foundryvtt-hub.com/user/rectulo/) (French)

### Documentation Changes

- Improved the wording of the "Persistent Open" client setting to be more clear on where the toggle button is.
- Updated the [Update Frequency](https://simplecalendar.info/pages/calendar-configuration/index/time-settings.html#clock-settings) documentation to note it supports decimals.
- Updated the [Client Setting](https://simplecalendar.info/pages/global-configuration/index/settings.html#client-settings) documentation to include information about the new "Compact View Scale" setting.

<hr/>

## 2.1.73 - Refreshed Compact Display, Quality of Life Updates and Bug Fixes

![](https://img.shields.io/badge/release%20date-January%2026%2C%202023-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v2.1.73/module.zip)

### Refreshed Compact Display

The compact display has been updated to make it a little cleaner and utilize the unused space to keep it nice and compact without losing any functionality.

![](images/sc-v2-theme-dark-comp.png)

Changes include:

- If seasons are configured the current season will be shown by just its icon (or the first 2 letters of its name if no icon is chosen) in the top left of the header. Hovering over the icon will show the full season name.
- If moons are configured they are shown next to the season in the top left of the header. The current phase of the moon(s) are shown. If 1-2 moons are configured they will be shown beside each-other, if 3 or more  moons are configured the first moon will be shown with an indicator that hovering over that icon will show a dialog will all the moons current phases.
- The note indicators (Notes for that day and notes you want to be reminded of) are shown in the top right of the header next to the close button.
- If the player has permissions to add notes the add note button is displayed next to the note indicators in the top right of the header.
- The main body of the display contains the current date and time. The primary GM will see the buttons to start/pause/stop the real time clock next to the time.
- If the player has permissions to change the current date and time at the bottom the buttons used to change the date and time as well as the dawn/midday/dusk/midnight buttons.
- All the themes have been updated to take advantage of this new layout.

Overall these changes have helped reduce the height and width of the compact display making it easier to keep on the screen while playing.

A preview of all themes for the new compact mode:

![](images/sc-v2-theme-dark-comp.png)
![](images/sc-v2-theme-light-comp.png)
![](images/sc-v2-theme-classic-comp.png)
![](images/sc-v2-theme-eclipsephase-comp.png)
![](images/sc-v2-theme-sfrpg-comp.png)
![](images/sc-v2-theme-dsa5-comp.png)
![](images/sc-v2-theme-forbidden-lands-comp.png)
![](images/sc-v2-theme-wfrp4e-comp.png)
![](images/sc-v2-theme-wrath-and-glory-comp.png)

#### Time Control Button Options

The compact display also now lets you choose from 2 button layouts for changing the time!

- **Full**: This is the current layout and allows you to change any time unit forward or back.<br/>![](images/sc-v2-theme-dark-comp.png)<br/><br/>
- **Quick Increment**: This layout offers 5 options (1 Round, 1 Minute, 5 Minutes, 15 Minutes, 1 Hour) and allows users to quickly advance the time by those amounts.<br/>![](images/sc-v2-theme-dark-comp-qi.png)

The setting for this can be found under the calendars [Display Options](https://simplecalendar.info/pages/calendar-configuration/index/display-options.html) configuration section.

### Quality of Life Updates

- Added a new client setting, [Persistent Open](https://simplecalendar.info/pages/global-configuration/index/settings.html#client-settings), that when enabled will remove the close button from the calendar window and prevent the escape key from closing it. The button under the scene control then becomes a toggle to open and close the calendar.

### Bug Fixes

- Fixed an issue when changing the [Update Frequency](https://simplecalendar.info/pages/calendar-configuration/index/time-settings.html#clock-settings) setting while the clock was running that would result in the time updating incorrectly.
- Fixed an issue when reloading the page would not properly recognise any active combats and in certain cases the clock could be started.
- Fixed a few style issues with the Forbidden Lands theme.
- Fixed an issue with the Eclipse Phase system where note pages couldn't be added (Style change hide the interface).
- Fixed an issue where "When Leap Years Happen" could be set to 0 or a negative value, which doesn't make sense and would cause issues. If the value is set to something not valid the leap year rule will be set to None.
- Fixed a bug where loading of corrupt calendar configurations would prevent the module from working at all.
- Fixed an issue where some systems would break the displaying of icons within Simple Calendar.

### API Changes

- Added a new function [`SimpleCalendar.api.isOpen()`](https://simplecalendar.info/functions/SimpleCalendar.api.isOpen.html) that will return a boolean if the calendar is open or closed.
- Added a new hook [`SimpleCalendar.Hooks.Init`](https://simplecalendar.info/variables/SimpleCalendar.Hooks.Init.html). This hook fires as Simple Calendar is initializing but before the module is fully ready to use.
- Added a new function, [`SimpleCalendar.api.addSidebarButton`](https://simplecalendar.info/functions/SimpleCalendar.api.addSidebarButton.html), for adding custom buttons to the right of the calendar.

### Translation Updates

Thank you to the follow people for making updates to Simple Calendars translations:

- [Greg R.](https://weblate.foundryvtt-hub.com/user/gbursson/) (Polish)
- [Farevell](https://weblate.foundryvtt-hub.com/user/Farevell/) (Chinese (Simplified))
- [Sir Motte](https://weblate.foundryvtt-hub.com/user/SirMotte/) (German)
- [Chris76J](https://weblate.foundryvtt-hub.com/user/Chris76J/) (German)
- [Novella Locritani](https://weblate.foundryvtt-hub.com/user/Nuvvola/) (Italian)
- [Davide Lamberti](https://weblate.foundryvtt-hub.com/user/leWebslinger/) (Italian)

### Documentation Changes

- Added a new [FAQ](https://simplecalendar.info/pages/site/docs/faq.html) page to help answer some commonly asked questions!
- Added documentation for the new [client setting Persistent Open](https://simplecalendar.info/pages/global-configuration/index/settings.html#client-settings).
- Added documentation for the new [compact view options](https://simplecalendar.info/pages/calendar-configuration/index/display-options.html#compact-view-options).
- Updated the [client settings](https://simplecalendar.info/pages/global-configuration/index/settings.html#client-settings) documentation for the new Persistent Open setting.
- Updated images of the compact view.
- Updated image for the client settings.
- Updated the image for the date/time formatting section of the display options.
- Added an image for the compact view options section of the display options.

<hr/>

## 2.1.60 - Bug Fix and Translation Updates

![](https://img.shields.io/badge/release%20date-November%2017%2C%202022-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v2.1.60/module.zip)

### Bug Fixes

- Fixed broken help links in the configuration dialog.

### Translation Updates

Thank you to the follow people for making updates to Simple Calendars translations:

- [vincent](https://weblate.foundryvtt-hub.com/user/rectulo/) (French)
- [Marc Feuillen](https://weblate.foundryvtt-hub.com/user/Elfenduil/) (French)
- [Raul Castaño](https://weblate.foundryvtt-hub.com/user/ZRAAA78/) (Spanish)
- [Farevell](https://weblate.foundryvtt-hub.com/user/Farevell/) (Chinese (Simplified))
- [Greg R.](https://weblate.foundryvtt-hub.com/user/gbursson/) (Polish)
- [Michał Gołaszewski](https://github.com/MichalGolaszewski) (Polish)

<hr/>

## 2.1.58 - Bug Fixes and API Changes

![](https://img.shields.io/badge/release%20date-November%2004%2C%202022-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v2.1.58/module.zip)

### Bug Fixes

- Fixed an issue where if the `Remember Position` option was enabled and the `Remember Compact Position` option was disabled the compact view would snap back to the full view's position when the time was changed.

### Predefined Calendar

- Added a predefined calendar for the Ambrian Calendar from the Symbaroum system (Thanks [bithir](https://github.com/bithir)!)

### API Changes

- Added a new function [`SimpleCalendar.api.currentDateTime()`](https://simplecalendar.info/functions/SimpleCalendar.api.currentDateTime.html) that returns a [DateTime](https://simplecalendar.info/types/SimpleCalendar.DateTime.html) object with the current date and time of the active calendar, or calendar with the passed in ID.
- Added a new function [`SimpleCalendar.api.currentDateTimeDisplay()`](https://simplecalendar.info/functions/SimpleCalendar.api.currentDateTimeDisplay.html) that returns a [DateDisplayData](https://simplecalendar.info/interfaces/SimpleCalendar.DateDisplayData.html) object for the current date and time of the active calendar, or the calendar with the passed in ID.
- Added a new function [`SimpleCalendar.api.formatTimestamp()`](https://simplecalendar.info/functions/SimpleCalendar.api.formatTimestamp.html) that functions just like the [formatDateTime](https://simplecalendar.info/functions/SimpleCalendar.api.formatDateTime.html) function but instead takes in a timestamp instead of a [DateTimeParts](https://simplecalendar.info/types/SimpleCalendar.DateTimeParts.html) object.
- Added a new function [`SimpleCalendar.api.getAllThemes()`](https://simplecalendar.info/functions/SimpleCalendar.api.getAllThemes.html) that returns a list of all available themes for players to choose from.
- Added a new function [`SimpleCalendar.api.getCurrentTheme()`](https://simplecalendar.info/functions/SimpleCalendar.api.getCurrentTheme.html) that returns the ID of the theme being used by the player.
- Added a new function [`SimpleCalendar.api.setTheme()`](https://simplecalendar.info/functions/SimpleCalendar.api.setTheme.html) that takes in a theme ID and will set Simple Calendars theme to that ID for the player. An information notification will be shown to the player if the theme was changed to let them know it has been changed programmatically.

### Translation Updates

Thank you to the follow people for making updates to Simple Calendars translations:

- [vincent](https://weblate.foundryvtt-hub.com/user/rectulo/) (French)
- [eunaumtenhoid](https://weblate.foundryvtt-hub.com/user/eunaumtenhoid/) (Portuguese (Brazil))
- [ricdark](https://weblate.foundryvtt-hub.com/user/ricdark/) (German)

<hr/>

## 2.1.50 - Quality of Life Improvements, Bug Fixes and a New Theme

![](https://img.shields.io/badge/release%20date-October%2024%2C%202022-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v2.1.50/module.zip)

### Quality of Life Improvements

- A new client setting [Always Show Note List](https://simplecalendar.info/pages/global-configuration/index/settings.html#client-settings) has been added. This setting will make it so the note list will always be visible and can not be closed. The only exception is if the calendar list or note search are opened they will open over top of the note list, but when closed the note list will remain visible.

### Bug Fixes

- Fixed an issue with the DSA/TDE 5 system theme that would cause the dialog background not to load properly.
- Fixed an issue with the DSA/TDE 5 system theme that cause the compact view dialog header to display incorrectly.
- Fixed an issue with the DSA/TDE 5 system theme where the clock would have a background color in compact view.
- Fixed an issue with the Warhammer 40,000: Wrath & Glory system theme where the clock would have a background color in compact view.
- Fixed an issue with the Warhammer Fantasy Roleplay system theme that would cause the dialog borders to not load correctly.
- Fixed a bug where the context menu for the note list would not appear in the correct location when the list expanded to the left or bottom of the calendar.
- Fixed a bug where if the side drawers were set to open below the calendar, the note list would not fully open in the compact view.

### New Themes

- **New** [Eclipse Phase 2E](https://foundryvtt.com/packages/eclipsephase) System Theme<br/>![](images/sc-theme-eclipsephase.png)

### Translation Updates

Thank you to the follow people for making updates to Simple Calendars translations:

- [vincent](https://weblate.foundryvtt-hub.com/user/rectulo/) (French)
- [eunaumtenhoid](https://weblate.foundryvtt-hub.com/user/eunaumtenhoid/) (Portuguese (Brazil))

<hr/>

## 2.1.40 - Theming, Quality of Life Improvements, Bug Fixes & API Updates

![](https://img.shields.io/badge/release%20date-October%2022%2C%202022-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v2.1.40/module.zip)

### Theming

I have done a lot of work around making theming Simple Calendar as easy as possible. This allows me to add new themes easier and quicker. It also opens up the ability of third party modules or individuals to easily customize the look of Simple Calendar. For more details on how to theme Simple Calendar check out the [theming](https://simplecalendar.info/pages/docs/developing-with-sc/index/theming.html) documentation!

Changes that has been done to enable easy theming:

- Changed all sizes to use REM instead of PX so that the entire interface can scale easily with any changes to the root REM size.
- The addition of many CSS variables to quickly change how Simple Calendar looks. All the included themes use these variables to style SC.

#### Themes

To go along with these changes I have updated all the existing themes and added a couple of new themes to Simple Calendar!

|                                                                                                                                   |                                                                                                                                                             |
|-----------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Dark Theme ![](images/sc-theme-dark.png)                                                                                          | Light Theme ![](images/sc-theme-light.png)                                                                                                                  |
| Classic Theme ![](images/sc-theme-classic.png)                                                                                    | [Warhammer Fantasy Roleplay 4th Edition](https://foundryvtt.com/packages/wfrp4e) System Theme ![](images/sc-theme-wfrp4e.png)                               |
| **NEW** [Forbidden Lands](https://foundryvtt.com/packages/forbidden-lands) System Theme  ![](images/sc-theme-forbidden-lands.png) | **NEW** [Das Schwarze Auge / The Dark Eye (5th Edition)](https://foundryvtt.com/packages/dsa5) System Theme ![](images/sc-theme-dsa5.png)                   |
| **NEW** [Starfinder](https://foundryvtt.com/packages/sfrpg) System Theme ![](images/sc-theme-sfrpg.png)                           | **NEW** [Warhammer 40,000 Roleplay: Wrath and Glory](https://foundryvtt.com/packages/wrath-and-glory) System Theme ![](images/sc-theme-wrath-and-glory.png) |


### Quality of Life Improvements

- Added a new client setting [Remember Compact Position](https://simplecalendar.info/pages/global-configuration/index/settings.html#client-settings). When enabled Simple Calendar will remember where the compact view is on the screen separate from where the full view is. This allows users to place the compact view in a corner, switch to full view and have the full view in the middle of the screen, then switch back to compact view, and it will return to the corner.
- Added a new client setting [Side Drawer Open Direction](https://simplecalendar.info/pages/global-configuration/index/settings.html#client-settings). This allows users to choose which direction from the calendar side drawers like the note list will open. The current options are Right, Left and Down that will open the side drawers to the right, to the left and below the main calendar.

### Bug Fixes

- Fixed a few instances where the notes dialog would not be sized correctly.
- Fixed an issue where deleting a note after starting an edit would spawn several "Discard current changes" dialogs.
- Fixed a bug where notes shown in the search result list would not properly show who had access to view the note.
- Fixed a bug where the compact view would not have the correct height set.
- Fixed a bug with the `Unify Clock Start/Pause With Game Pause` setting that would make it so the game always started paused. (Fixes a compatibility error with the [Koboldworkds - Pause Control](https://foundryvtt.com/packages/koboldworks-pause-control) module).

### API Updates

- Changed the [`SimpleCalendar.api.addNote()`](https://simplecalendar.info/functions/SimpleCalendar.api.addNote.html) function so that the `repeats` and `categories` parameters are now optional.
- Changed the [`SimpleCalendar.api.addNote()`](https://simplecalendar.info/functions/SimpleCalendar.api.addNote.html) function so that the start and end dates are now [DateTimeParts](https://simplecalendar.info/types/SimpleCalendar.DateTimeParts.html) and any missing date/time properties on them will be filled out with the current date/time equivalent.
- Added a new optional parameter to the [`SimpleCalendar.api.addNote()`](https://simplecalendar.info/functions/SimpleCalendar.api.addNote.html) function, `userVisibility` that takes in an array of user ID's. These users will be able to view the note.
- Added a new optional parameter to the [`SimpleCalendar.api.addNote()`](https://simplecalendar.info/functions/SimpleCalendar.api.addNote.html) function, `remindUsers` that takes in an array of user ID's. These users will be reminded of the note.

### Translation Updates

Thank you to the follow people for making updates to Simple Calendars translations:

- [Bextia](https://weblate.foundryvtt-hub.com/user/bext1a/) (Spanish)
- [DragonHale](https://weblate.foundryvtt-hub.com/user/DragonHale/) (Spanish)
- [Marc Feuillen](https://weblate.foundryvtt-hub.com/user/Elfenduil/) (French)
- [vincent](https://weblate.foundryvtt-hub.com/user/rectulo/) (French)
- [Sir Motte](https://weblate.foundryvtt-hub.com/user/SirMotte/) (German)
- [Greg R.](https://weblate.foundryvtt-hub.com/user/gbursson/) (Polish)
- [Damian Wodziński](https://weblate.foundryvtt-hub.com/user/waaldii/) (Polish)
- [eunaumtenhoid](https://weblate.foundryvtt-hub.com/user/eunaumtenhoid/) (Portuguese (Brazil))
- [benwater12](https://weblate.foundryvtt-hub.com/user/benwater12/) (Chinese Traditional)

### Documentation Changes

- Added a link to the GitHub page for the module in the header of the documentation site.
- Added documentation for [customizing the themes](https://simplecalendar.info/developing-with-sc/index/theming.html) of Simple Calendar.
- Added documentation for [contributing](https://github.com/vigoren/foundryvtt-simple-calendar/blob/main/CONTRIBUTING.md#themes) a new theme to Simple Calendar.
- Added documentation that outlines all the [available themes](https://simplecalendar.info/pages/docs/using-sc/index/themes.html) within Simple Calendar.
- Updated the [client settings](https://simplecalendar.info/pages/global-configuration/index/settings.html#client-settings) documentation to include the new settings `Remember Compact Position` and `Side Drawer Open Direction`.
- Fixed some typos in the example of the [setDate API function](https://simplecalendar.info/functions/SimpleCalendar.api.setDate.html)
- Fixed typos in the API documentation when referencing a `second` property when it should be `seconds`.
- Updated the example for the [timestampToDate](https://simplecalendar.info/functions/SimpleCalendar.api.timestampToDate.html) API function. 
- Updated the example for the [DateTimeChange](https://simplecalendar.info/variables/SimpleCalendar.Hooks.DateTimeChange.html) hook.
- Updated the example for the [getAllSeasons](https://simplecalendar.info/functions/SimpleCalendar.api.getAllSeasons.html) API function.
- Updated the example for the [getCurrentSeason](https://simplecalendar.info/functions/SimpleCalendar.api.getCurrentSeason.html) API function.
- Updated the example for the [getAllMonths](https://simplecalendar.info/functions/SimpleCalendar.api.getAllMonths.html) API function.
- Updated the example for the [getCurrentMonth](https://simplecalendar.info/functions/SimpleCalendar.api.getCurrentMonth.html) API function.
- Updated the example for the [getAllWeekdays](https://simplecalendar.info/functions/SimpleCalendar.api.getAllWeekdays.html) API function.
- Updated the example for the [getCurrentWeekday](https://simplecalendar.info/functions/SimpleCalendar.api.getCurrentWeekday.html) API function.

<hr/>

## v2.1.27 - Improved Note Permissions, Note List Context Menu and Bug Fixes

![](https://img.shields.io/badge/release%20date-September%2024%2C%202022-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v2.1.27/module.zip)

### Improved Note Permissions

Assigning permissions to notes has been improved!

- Renamed the `Player Viewable` field on notes to `Who Can See` to clearly indicate what that setting is for.
- Added an `All Players` option to the `Who Can See` field for setting note permissions. This setting will:
  - Select all players in the drop-down and not allow you to unselect them while the `All Players` option is selected.
  - Sets it so all current and future players will be able to see this note. GM's will no longer have to add new players to notes everyone should be able to see!
- Updated all predefined notes so that when created they are set so All Players (current and future) can view them. **This is not retroactive**.
- Updated the `Player Visible` icon on the notes list that GM's see:
  - It now has 3 states instead of 2
    - `Green Eye`![](images/note-list-player-visible.png): All players can view this note.
    - `Yellow Partial Eye`![](images/note-list-partial-player-visible.png): Some players can view this note.
    - `Red Eye Slash`![](images/note-list-not-player-visible.png): Only the author of this note can view it.
  - The tooltip for the `Player Visible` icon now shows a list of players that can view the note.<br/>![](images/note-list-who-can-see-tooltip.png)
- Added the `Show Players` button in the header of the note dialog so any note can be shown to the players. This works just like the Journal Show Players button.

The `All Players` option for `Who Can See` a note is not retroactive, so older notes shared with everyone will not have this set.

### Note List Context Menu (Right Click)

You can now right-click on notes under the notes list to show different actions that can be done. The list of actions available will change depending on if you are the GM or own the note being right-clicked on.

![](images/note-list-context-menu.png)

- All players will be shown the `Remind Me`/`Don't Remind Me` option as a quick way to toggle being reminded about the note.
- GM's will be shown the `Show Players` option. This functions the exact same as the `Show Players` button in the header of a Journal Entry and allow you to show this note to the specified players regardless of if they can see it or not.
- If you added the note, or are the GM you will see another 2 options:
  - `Edit` will open the note directly into the edit mode.
  - `Delete` will allow you to delete the note. A confirmation dialog is still shown to help make sure no accidental deletions happen.


### Bug Fixes

- Fixed a bug where the checked indicator of a multiple select dropdown would not select the item when clicked.
- Fixed an issue where, in some instances, the calendar would be drawn wider than needed and slowly shrink as time was changed.

### Translation Updates

Thank you to the follow people for making updates to Simple Calendars translations:

* [vt-tom](https://weblate.foundryvtt-hub.com/user/vt-tom/) (German)
* [Pierre Revat](https://weblate.foundryvtt-hub.com/user/Dolgren/) (French)
* [benwater12](https://weblate.foundryvtt-hub.com/user/benwater12/) (Chinese Traditional)

### Documentation Updates

- Added better styling for tables in the new look.
- Updated the [note editing documentation](https://simplecalendar.info/pages/docs/using-sc/index/notes/index/adding-editing-removing.html#editing-notes) to account for the new `All Players` option in the `Who Can View` setting.
- Updated the [notes documentation](https://simplecalendar.info/pages/docs/using-sc/index/notes/index/index.html) to account for the changes to the Player Visible option
- Updated the [notes documentation](https://simplecalendar.info/pages/docs/using-sc/index/notes/index/index.html) to account for the new context menu in the note list.

<hr/>

## v2.1.19 - Bug Fix... Oops

![](https://img.shields.io/badge/release%20date-September%2016%2C%202022-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v2.1.19/module.zip)

- Fixed showing all months at once (experimental year view).

<hr/>

## v2.1.18 - Rest Day Highlighting, Descriptions, Day Context Menu, Bug Fixes, QoL Improvements

![](https://img.shields.io/badge/release%20date-September%2016%2C%202022-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v2.1.18/module.zip)

### Rest Day Highlighting

Weekdays now have a new setting that let you specify if that weekday is a rest day. Rest days are highlighted on the calendar.

![](images/weekend-example.png)

### Descriptions

GM's can now add descriptions to months, weekdays and seasons! Descriptions can help give more detail or lore to your calendars. If a description is added to a month, weekday or season users can click on the name of that item and have an informational popup appear showing the description.

The descriptions do support HTML to help with formatting the text!

![](images/description-example.png)

### Day Context Menu (Right Click)

Right-clicking on a day will now bring up a menu that shows additional information about that day and potentially some actions! 

The sunrise and sunset times are shown for the day clicked.

If you are able to change the date of the calendar you will also see an option to set this day to the current date. This functions just like the set to current date button that appears when you select a day.

If you are able to add notes you will also see an option to add a new note to that day. This functions just like adding a note to a selected day.

![](images/day-context-gif.gif)

### Bug Fixes

- Fixed some performance issues in the Pathfinder 2E system.
- Fixed a styling issue with the "Search Notes" search box.
- Fixed an issue with the Simplified Chinese translation that would cause an error on loading in PF2E systems.

### Quality of Life Improvements

- Update anything that used the browser tooltip to use the new v10 Tooltips.
- A few improvements to accessibility within the configuration dialog.

### Translation Updates

Thank you to the follow people for making updates to Simple Calendars translations:

* [Greg R.](https://weblate.foundryvtt-hub.com/user/gbursson/) (Polish)

### API Changes

- Updated the [`sc-full-calendar`](https://simplecalendar.info/enums/HandlebarHelpers.html#sc_full_calendar) Handlebar Helper to accept a new parameter `showDescriptions` to choose if you want the descriptions for months, weekdays and seasons to be able to show or not.
- The `description` property has been added to the [MonthData](https://simplecalendar.info/interfaces/SimpleCalendar.MonthData.html) object. All functions that return  month data will now include the description, if set.
- The `description` property has been added to the [SeasonData](https://simplecalendar.info/interfaces/SimpleCalendar.SeasonData.html) object. All functions that return  season data will now include the description, if set.
- The `description` property has been added to the [WeekdayData](https://simplecalendar.info/interfaces/SimpleCalendar.WeekdayData.html) object. All functions that return  weekday data will now include the description, if set.
- The `restday` property has been added to the [WeekdayData](https://simplecalendar.info/interfaces/SimpleCalendar.WeekdayData.html) object. All functions that return  weekday data will now include if the weekday is considered a rest day or not.


### Documentation Updates

- Upgraded to the latest version of Typedoc which brings a host of usability and visual improvements.
- Updated the [month settings](https://simplecalendar.info/pages/docs/calendar-configuration/month-settings.html) documentation to reflect the new description setting.
- Updated the [season settings](https://simplecalendar.info/pages/docs/calendar-configuration/season-settings.html) documentation to reflect the new description setting.
- Updated the [weekday settings](https://simplecalendar.info/pages/docs/calendar-configuration/weekday-settings.html) documentation to reflect the new rest day and description settings.
- Updated the [using Simple Calendar](https://simplecalendar.info/pages/docs/using-sc/index/index.html) documentation to include information about the description popups and show example images.
- Updated the [using Simple Calendar](https://simplecalendar.info/pages/docs/using-sc/index/index.html) documentation to include information about the new context menu for days.

<hr/>

## v2.1.10 - Bug Fixes, QoL Improvements and Translation Updates

![](https://img.shields.io/badge/release%20date-September%208%2C%202022-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v2.1.10/module.zip)

### Bug Fixes

- Fixed a bug where months with a day offset would go back a day while the clock was running.
- Changed the "PF2E World Clock Sync" setting so that it uses the switch styling rather than the checkbox styling.
- Fixed an issue with the migration from Simple Calendar version 1.x to version 2.x in FoundryVTT v10.
- Fixed some depreciation warnings on the PF2E system.

### Quality of Life Improvements

- Improved the strictness of the CSS for Simple Calendar themes to have a more consistent look when FoundryVTT UI/Theme modules are installed. I tested the following UI modules: Ernie's Modern UI, Minimal UI, Polished UI.

### Translations

Simple Calendar translations are now done on Foundry Hub Weblate, you can check it out (and help out) [here](https://weblate.foundryvtt-hub.com/engage/simple-calendar/)!

Many people have contributed on Weblate all ready to update and add translations! Thank you to the following people:

* [Demian Wright](https://weblate.foundryvtt-hub.com/user/Demian/) (Finnish, English)
* [TonyTheBaloney](https://weblate.foundryvtt-hub.com/user/TonyTheBaloney/) (Spanish)
* [Cristina Ibañez](https://weblate.foundryvtt-hub.com/user/bolsacris/) (Spanish)
* [JDW](https://weblate.foundryvtt-hub.com/user/JDW/) (French)
* [EldritchTranslator](https://weblate.foundryvtt-hub.com/user/EldritchTranslator/) (Italian)
* [Greg R.](https://weblate.foundryvtt-hub.com/user/gbursson/) (Polish)
* [moinen](https://weblate.foundryvtt-hub.com/user/moinen/) (Polish)
* [Mateusz Sałasiński](https://weblate.foundryvtt-hub.com/user/matejss/) (Polish)
* [eduardopato41](https://weblate.foundryvtt-hub.com/user/eduardopato41/) (Portuguese (Brazil))
* [Matheus Clemente](https://weblate.foundryvtt-hub.com/user/mclemente/) (Portuguese (Brazil))
* [Bruno Eiras](https://weblate.foundryvtt-hub.com/user/Beur1998/) (Portuguese (Brazil))
* [Farevell](https://github.com/Farevell) (Simplified Chinese)

### Documentation Updates

- Updated the configuration documentation to reflect some improvements to the English language made while being translated.

<hr/>

## v2.1.4 - QoL Updates and Bug Fixes 

![](https://img.shields.io/badge/release%20date-September%202%2C%202022-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v2.1.4/module.zip)

### Quality of Life Updates

- When the [Pathfinder 2E: World Clock Sync](https://simplecalendar.info/pages/docs/calendar-configuration/general-settings.html#pathfinder-2e-world-clock-sync) is enabled the settings that it disables will now appear disabled in the configuration dialog with a message letting users know why.

### Bug Fixes

- Fixed a bug that was making it not possible to update a notes title.
- Added validation for the time settings ("Hours in a Day", "Minutes in an Hour", "Seconds in a Minute" and "Update Frequency") to ensure that they can not be set to 0 or a negative value.
- Fixed a holiday for the Das Schwarze Auge/The Dark Eye 5th Edition Predefined Calendar that was on the wrong day.

<hr/>

## v2.1.0 - FoundryVTT V10 Support, Note Pages, System Specific Themes, QoL Improvements, Bug Fixes

![](https://img.shields.io/badge/release%20date-August%2031%2C%202022-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v2.1.0/module.zip)

### FoundryVTT Version 10 Support

Updated Simple Calendar so that it supports these changes in version 10 of FoundryVTT:

- Updated manifest to work with the new manifest options.
- Ensured the styles work with the new Font Awesome update.
- Updated the journal interactions to be compatible with FoundryVTTs Journals V2.

### Note Pages

With the new Journals in FoundryVTT version 10 Simple calendar has been updated so notes can take advantage of these changes. Notes in Simple Calendar can now:

- Have multiple pages with a collapsible panel when switching between pages being viewed.
- Supports the different page types (Text, Images, PDFs and Videos).
- The interface has been updated so the fields are more condensed for an easier editing experience.
- Switched to using the new Prosemirror editor for notes over TinyMCE.

Existing notes will be automatically migrated by Foundry over to Journals with a single text page.

### System Specific Themes

Simple Calendar can now have themes specific to the system the module is being used in. 
These themes will only appear in the Theme selector as an option for players when playing a game in the system they are built for and are intended to keep the experience of the module more cohesive with the systems.

The first system to get a dedicated theme is Warhammer Fantasy Roleplay 4th Edition! (Thanks to [ZwS](https://github.com/ZwS) for getting this started with updates to the classic theme)

![](images/sc-v2-theme-wfrp.png)

Other systems will get their own specific themes as time goes on

### Quality of Life Improvements

- Moved the icon for opening Simple Calendar from the `Token Controls` tab to the `Journal Notes` tab as this makes way more sense for Simple Calendar to live.
- Added a button to open Simple Calendar from the "Configure Settings" dialog.
- The date selector for notes now allows you to enter the year instead of having to scroll through months to change the year the note takes place.
- Changed some setting checkboxes in the configuration dialog to use a switch where it made sense.
- Added a close button to the header of the compact view.
- Changed the Reminder chat whisper to show a link to the note instead of the notes content.
- Added a new client setting for each player to choose how note reminders notify them. The options are:
  - Have a whisper sent in the chat to the player with some details about the note and a link to open the note. This is the default option.
  - Have the note automatically open.
- When editing a Scenes configuration, if the setting `Show Notes Folder` is set to off then all Calendar notes are removed from the Journal Entry field under the Ambience tab.
- Themes are now saved as client settings specific to worlds, so if you have more than one world on your server having different themes for the calendar will work.
- Improved the strictness of the CSS for themes to have a more consistent look across systems.

### Bug Fixes

- Fixed several bugs on the note edit view where buttons wouldn't always respond to the first click.
- Fixed a bug where positioning the calendar, with the remember position setting turned on, in the very top or very left of the screen would fail to place it back in that location on reloads.
- Fixed a bug where when stopping the real time clock would cause the resulting time that is saved to be a few seconds (< 5) behind what it should be.

### Documentation Changes

- Updated the [Client Settings](https://simplecalendar.info/pages/docs/global-configuration/settings.html#client-settings) docs to include details about the new note reminder setting.
- Updated the [Using Simple Calendar](https://simplecalendar.info/pages/docs/using-sc/index/index.html) docs to reflect the change in location of the buttons to open Simple Calendar.
- Updated the [Notes](https://simplecalendar.info/pages/docs/using-sc/notes/index.html) docs to reflect all the changes to the notes interface.
- Added a new page [Notes: Adding / Editing / Removing](https://simplecalendar.info/pages/docs/using-sc/notes/adding-editing-removing.html) for detailing how to add, edit and remove notes with a section specific to the new pages functionality.
- Updated several images to properly reflect the changes in this update.

### API Changes

To go along with the release of FoundryVTT version 10 some depreciated options within simple calendar have been removed.

- `SimpleCalendar.api.MoonIcons` has been removed. Please use `SimpleCalendar.api.Icons` instead.
- From the [Date Time Change Hook Response](https://simplecalendar.info/interfaces/SimpleCalendar.Hooks.DateChangeResponse.html) data the `day` property has been removed. Please use the options under the `date` property instead.
- From the [Date Time Change Hook Response](https://simplecalendar.info/interfaces/SimpleCalendar.Hooks.DateChangeResponse.html) data the `month` property has been removed. Please use the options under the `date` property instead.
- From the [Date Time Change Hook Response](https://simplecalendar.info/interfaces/SimpleCalendar.Hooks.DateChangeResponse.html) data the `season` property has been removed. Please use the options under the `date` property instead.
- From the [Date Time Change Hook Response](https://simplecalendar.info/interfaces/SimpleCalendar.Hooks.DateChangeResponse.html) data the `time` property has been removed. Please use the options under the `date` property instead.
- From the [Date Time Change Hook Response](https://simplecalendar.info/interfaces/SimpleCalendar.Hooks.DateChangeResponse.html) data the `year` property has been removed. Please use the options under the `date` property instead.

<hr/>

## v2.0.30 - Combat Detection Changes & Bug Fixes

![](https://img.shields.io/badge/release%20date-July%204%2C%202022-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v2.0.30/module.zip)

### Combat Detection Changes

I have added a new setting to help GMs better choose when the real time clock of Simple Calendar will pause when a combat has been started.
The setting is called "Pause Real Time Clock on Combat Rule" and is under the Global Configuration Settings. It currently has 2 options:

- **Pause Only on the Active Scene**: This behaves exactly as the current implementation does, only pausing the real time clock is a combat is running on the current active scene.
- **Pause on the Scene the GM is Currently Viewing**: This new option will pause the clock only if the current scene the primary GM is viewing has a combat running.

The new option can be handy in instances of pulling a single character to a new scene to do a solo fight without the clock starting to run again and without having to make that scene the active one.

### Bug Fixes

- Fixed a bug where Simple Calendar would fail to load properly if a non calendar note Journal Entry was added to Simple Calendars notes directory folder.
- Fixed a bug where Simple Calendar notes would not load if they were in sub folders under the Simple Calendar notes directory folder.
- Fixed a bug in the configuration dialog that would scroll back to the top when adding to the bottom of long lists. 
- Fixed a bug in the configuration dialog where if the advanced options for a month were open and a new month was added, the advanced options for the month that had them open would no longer be visible.

### Documentation Changes

- Fixed a typo in the predefined calendar list (Thanks Dan-Q!).
- Added documentation for the new Combat Pause Real Time Clock Rule setting.
- Improved the documentation around how to switch between calendars in the configuration dialog and in the calendar.

### API Changes

- Added Simple Calendar as an [NPM package](https://www.npmjs.com/package/foundryvtt-simple-calendar) so that other projects can reference the built-in type definitions. See the [documentation](https://simplecalendar.info/pages/docs/developing-with-sc/index.html) for more details.

<hr/>

## v2.0.25 - Bug Fixes

![](https://img.shields.io/badge/release%20date-June%2010%2C%202022-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v2.0.25/module.zip)

### Bug Fixes

- Fixed a bug where the module would fail to open if the number of months was changed and a note exists that now falls outside the months.
- Fixed a bug where players with permission to change the date and time would see an error message while the clock was running.
- Fixed a bug where clicking on the configuration setting title "Show Notes Folder" would cause the "Sync Date/Time" setting checkbox to change its state.
- Fixed a bug where clicking on the note settings title "Send Reminders On Login" would cause the "Note Default Player Visibility" setting checkbox to change its state.
- Fixed a rare bug where invalid permissions could be loaded and cause the configuration dialog to fail to open properly.

<hr/>

## v2.0.20 - Bug Fixes

![](https://img.shields.io/badge/release%20date-May%2029%2C%202022-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v2.0.20/module.zip)

### Bug Fixes

- Adjusted the maximum height of the note dialog when editing to be 95% of the height of the browser window up from 75%.
- Fixed a bug where the configuration save button was not being styled correctly.
- Fixed an issue where Note Category and Player lists that were very long would get cut off without showing all options.
- Fixed an issue with loading the note rich text editor styles when hosting foundry on the Forge.

### API Changes

- Added a new function `SimpleCalendar.api.pauseClock()` that will pause the clock if it is started.
- Added a new function `SimpleCalendar.api.removeNote()` that will remove the note and journal entry with the passed in ID.
- Added a new function `SimpleCalendar.api.searchNotes()` that will search notes for the passed in term. Only the notes that the current player can see are searched.

<hr/>

## v2.0.13 - Notes Auto Execute Macros and Bug Fixes

![](https://img.shields.io/badge/release%20date-May%2023%2C%202022-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v2.0.13/module.zip)

### Notes Auto Execute Macros

Notes now have the option to choose a single macro to be automatically executed when the current date and time meet the notes starting date and time. This behaves in a very similar way to note reminders but instead of a reminder a macro is executed.

Notes that have a macro that will be triggered will have an icon appear. This icon will only appear for GMs and the author of the note.

### Bug Fixes

- Fixed an issue where players couldn't add notes if the GM wasn't logged in (oops)
- Adjusted the Token Control icon so that it scales better with the button size.
- Fixed some styling issues (spacing)
- Fixed the unit selector text color for the classic theme.
- Fixed an issue with the migration tool that would cause it to run everytime the world was loaded.

### API Changes

- Updated the `SimpleCalendar.api.addNote` function to accept an optional macro to be executed when the in game time meets or exceeds the notes time.
- Fixed a bug where the hook `SimpleCalendar.Hooks.DateTimeChange` would not fire correctly.
- Changed the API function `SimpleCalendar.api.runMigration` so that it no longer returns a promise but instead will show a dialog to confirm that the GM wants to run the migration. This will help prevent accidental re-running of migrations when not intended.

### Translations

- The German translation has been updated thanks to מר כוס!

<hr/>

## v2.0.4 - Update Issue Fix and More Bugs Squished

![](https://img.shields.io/badge/release%20date-May%2010%2C%202022-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v2.0.4/module.zip)


### Update Issue Fix

Right now Foundry says that version 1.3.75 is newer than version 2.0.1 and won't update the module. I will explain why below.

**TL;DR**: I made a mistake, the quick fix is to uninstall and reinstall Simple Calendar. There will be no data loss and the issue will be solved going forward.

**Longer Version**: When I first release Simple Calendar I did a silly thing and put a "v" in front of the version that Foundry reads. Foundry uses this version to determine if an update is a newer version or not. 

This version is also stored in the module's details so not something that can be fixed without updating the module.

When Foundry compares a version that starts with a v to one that does not start with a v, the one that starts with a v is considered newer. As well the first portion of two versions that both start with a v, example 'v1' and 'v2', are considered to be the same. Until version 2 of Simple Calendar this didn't matter as it was always comparing 'v1' to 'v1'. FoundryVTT won't change how they check version so I need to make the change on my side.

Unfortunately the easiest way to fix this is to uninstall the previous version of Simple Calendar and reinstall it. After doing this, it will update properly going forward. When uninstalling a module that modules' data is not removed so there is no data loss in doing this. That said if you are concerned about data loss please make a backup of your world(s) before doing this exercise.

I apologize about this mistake and the extra work/confusion that may have come because of it.

### Bug Fixes
- Fixed a bug where after doing a quick setup with a predefined calendar with notes, the notes would be listed twice on days until the page was refreshed.
- Fixed a bug where the Display Options Time Formats previews were no longer updating as changes were made to the format.
- Toned down the Token Control button coloring, so it is not as vivid and distracting.

<hr/>

## v2.0.1 - Bug Fixing

![](https://img.shields.io/badge/release%20date-May%209%2C%202022-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v2.0.1/module.zip)


- Changes to the migration process from v1.x to v2 to account for updates from Simple Calendar versions previous to 1.3.x
  - **Important**: If you ran into migration errors please run this command in the browser console after updating `SimpleCalendar.api.runMigration()`
- Documentation Updates.

<hr/>

## v2.0.0 - Visual Redesign / Themes, Multiple Calendar Support, Note Improvements and more!

![](https://img.shields.io/badge/release%20date-May%207%2C%202022-blue)
![GitHub release](https://img.shields.io/github/downloads-pre/vigoren/foundryvtt-simple-calendar/v2.0.0/module.zip)


I am very happy to announce the release of version 2 of Simple Calendar! This update is big and covers many improvements and changes. Be sure to check out the full notes for all the details.

### Visual Redesign / Themes

I am happy to say that Simple Calendar has finally had a big visual update. This touches on every aspect of the calendar, configuration and notes.

#### Themes

There are now different themes that can be applied to Simple Calendar to change how it looks! This release includes Light and Dark themes as well as a "Classic" theme (to match the aesthetic of Simple Calendar version 1).  Additional themes or system specific themes may be added as time goes on.

I have tried to make sure that the light and dark themes are still easily usable for individuals with color blindness.

#### Main Calendar

![](images/sc-v2-themes.gif)

This section of the module has been 100% redesigned so that the full version is much more compact and easy to use. It features:

- A refreshed calendar display.
  - Seasons no longer change the full background color of the calendar but instead change the color of the border around the calendar.
- A refreshed clock display.
  - The clock icon has been updated to a better looking version.
  - The "Current Time" text has been removed to simplify the view
- The controls for changing the date/time have been compacted into 1 control where users can choose which time unit (year, month, day, hour, minute, round, second) they wish to change.
- Simplified buttons for advancing to the next dawn, midday, dusk or midnight with new icons.
- All other buttons have been moved to the right of the calendar and have been simplified with just an icon instead of an icon and text.
- The notes list will now slide out to the right of the window when the notes button is clicked. This makes viewing notes easier and less intrusive to the calendar view.
- Search has been changed so that it also slides out to the right of the window (rather than its own window) where a search can be preformed.

#### Compact View

![](images/sc-v2-themes-comp.gif)

The compact view has also been completely redesigned to be more compact while still showing the same amount of information and functionality as before. It is now just slightly larger than the old calendar/weather widget.

The button in the header to switch between compact and full views has been removed. To switch between the compact and full views simply double-click on the title bar.

#### Configuration Dialog

![](images/sc-v2-themes-config.gif)

The configuration dialog has also been completely redesigned to support multiple calendars and hopefully reduce some confusion around configuring a calendar. It features:

- A Refreshed display with sections.
  - **Global Configuration Settings**: These affect Simple Calendar overall and are not specific to any one calendar.
  - **Calendar Settings**: This section features a calendar selector, the ability to add or remove calendars and all the settings that affect the currently selected calendar.
  - **Help**: This section provides a link to the documentation and an about section with more details about the module.

#### Notes Dialog

![](images/sc-v2-themes-notes.gif)

The note dialog has been redesigned as well to match the look and feel of the other dialogs!

- A refreshed display for editing notes
- A refreshed display for viewing notes

### Multiple Calendar Support

Simple Calendar now support having multiple calendars within the module!

In the configuration GMs can now add new and remove existing calendars, switch between calendars and customize each calendar individually. Each calendar can also be given a name to help distinguish it from the other calendars.

The main Calendar interface also has a new button (that shows when more than 1 calendar has been added) that allows you to switch between which calendar you are currently viewing as well as which calendar is currently active. The listing of calendars will also show you the current date and time for each calendar.

You can also choose to sync time changes across all calendars. This change is done by determining the change in seconds and adjusting the other calendars by that number of seconds. This way if another calendar has days that are different in length they will update accurately.

### Configuration Changes

The configuration dialog can now be opened by GMs and players. GM only options are hidden for players, but any player specific options will be shown to the players.

The configuration dialog should be a little easier to understand and hopefully more intuitive to use.

#### Client Settings

Four new settings have been added to the Module Settings dialog of Foundry. These settings are [client settings](https://foundryvtt.com/article/settings/), which are saved in the browser and are applied on a per-browser basis. So everyone can customize these to their liking!

- **Theme**: Each player can choose what visual theme to use for Simple Calendar!
- **Open On Load**: This setting will open Simple Calendar's main interface when loading foundry. If the GM has disabled viewing the calendar for players, Simple Calendar will not show regardless of this setting. By default, this is set to true.
- **Open In Compact View**: If checked anytime Simple Calendar is opened (On Load, Clicking the button or through a macro) it will be opened in the compact view. By default, this is set to false.
- **Remember Position**: If checked Simple Calendar will remember where it was placed on the screen and position itself there everytime it is opened. By default, this is set to true.

#### Import/Export

The importing and exporting of calendar settings has been improved.
- **Exporting**: You can now choose what to export, specific calendars, notes, permissions or the global configuration settings.
- **Importing**: When importing the file will be parsed and show what was found inside and allow you to choose if to import it or not. For calendar configurations and notes you can also choose which calendar to import them into or to import them into a new calendar.

You will be able to import configurations from version 1.x of Simple Calendar so any saved configurations will not be lost!

#### Quick Setup

For new and existing calendars a GM can run through the Quick Setup tab to configure a calendar in 5 easy clicks. This tab will prompt you to:

- Choose a starting predefined calendar to base your calendar on.
- Choose the current date for your calendar.
- Choose if to show the clock for your calendar or not.

Then save to apply your changes!

#### Display Options

A display options tab has been added where the options for specifying your date and time formats live. The inputs for these formats have been improved for an easier time creating the formats as well as a real time preview of how it will look for the selected calendar.


### Note Improvements

#### Journal Entries

The main change in this update to the notes is now notes are stored as journal entries instead of in the settings. This makes way more sense as a note is closest to a journal entire within foundry.  

- Simple Calendar will create its own journal entries folder where all notes will be saved. 
- Simple Calendar notes have their own sheet associated with them, this means that opening up a journal entire for a note from th sidebar will open it up in the correct display.
- The display and styling of the note sheet has been redone to match with the new aesthetic for Simple Calendar.
- Players can now add notes without the GM needing to be logged in (provided they have the correct permissions to do so)
- There are still two situations where the GM will need to be logged in for players to do certain actions with the notes:
  - Toggling if to be reminded of a note only if the player wanting to be reminded did not create the note.
  - Re-ordering notes on a day.

#### User Permissions

With the change to using journal entries for notes how permissions are done for notes has changed.

- To add notes players MUST have the Create Journal Entries permission level.
- The "Player Viewable" option has changed on notes from being a single check box to allowing you to specify which players can see the note.
- The configuration setting "Note Default Player Visibility" will now check all players under "Player Viewable" when creating a new note.

#### Note Search Updates

The searching for notes has been improved since the initial quick search added. The smaller improvements are:

- Search is part of the main calendar display instead of its own dialog now.
- Hitting enter on the search text box will now trigger a search.
- Note author is now also searched against.
- Note categories are now also searched against.
- Added options to choose which fields on a note to search.
 
The big improvement to searching is that the algorithm has been completely rewritten. The new algorithm provides much better relevancy ranking of notes as well as fuzzy matching to offer results even when typos are entered in the search terms.

For the search nerds out there it is a custom algorithm that utilizes the Okapi BM25 search method for great relevancy matching as well as a Levenshtein Distance search to provide support for fuzzy matching. 

I have run some stress tests on the new algorithm and have been happy with the results. With a data set that consists of 25,000 notes that contain 3.75 million total words the average search time was under 10 seconds on my computer (Using Chrome with an AMD 5800X). I don't think anyone is storing near that many notes in Foundry so I feel safe in this is an acceptable amount of time for searching.


### Improved Date/Time Selector

The date/time selector that is used when choosing a date for notes or specifying the month of a Season or the sunrise/sunset time of a season has been improved.

- The date selector will now attempt to intelligently place itself so that it doesn't disappear outside the window.
- The time selection portion has been re-designed and improved with the following improvement:
  - The design of the interface has been improved with better looking and easier to interact with text boxes and dropdowns for the text boxes.
  - Added the ability to use the scroll wheel to change the number up or down in any of the text boxes.
  - Validation and changes are more consistent, they worked fine before but just feel better now.

### Migration

All the above changes have resulted in a change in how Simple Calendar stores data within FoundryVTT. Simple Calendar version 2 will detect if you are on a version 1 install and migrate users data over to the new format.

After the data has been migrated over there will be an option to clean up the old data, this just involves removing the old data from Foundry. This can be skipped if you do not want to remove it.

### Quality of Life Changes

- Added a new way to change time, you can now manually change the time by Rounds. 
  - This option has been added to the unit type selector. 
  - The number of seconds this changes the time by is based on "Seconds per Combat Round" setting.
- Added a new note setting "Send Reminders On Login", if enabled when a player logs in any note reminder on the current day will be PM'd to them. This replaced to default of doing that step no matter what.
- Adjusted how moon phase icons are displayed. If a day has more than 2 moon phases showing only the first phase will be down with a down arrow. Hovering over that moon phase/arrow will display a popup dialog that shows the phase for every moon on that day.
- Added the ability to set an icon for each season. This will be displayed next to the season name on the calendar.
- Moved predefined calendars configurations and the list of predefined calendars to their own json files. They are only downloaded when required, reducing the overall footprint of the module when loaded.

### Bug Fixes

- Fixed a bug where the display year in the calendar header would not update properly if the year being viewed was different from the current year.
- Fixed a bug where clicking on a moon icon or note indicator would not select the day properly.
- Fixed a bug with the Warhammer predefined calendar where the season starts were set to the wrong dates.
- Fixed a bug where using Z or ZZ in the date/time formats would break the calendars' configuration.
- Fixed a bug when using dates before the year zero year (negative timestamps) the real time clock would skip times near the end of an hour.
- Fixed a bug with PF2E systems where the year in Simple Calendar would not match the year of the built-in world clock due to an update to the PF2E world clock.
- Fixed a bug where the visible month would reset back to the month of the current date while the real time clock is running.

### API Changes

To go along with the large changelist to the Simple Calendar module the API has also undergone some large changes. 

None of these changes should be breaking to existing implementations using the API but please read over all the changes to make sure your Systems/Modules/Macros are not impacted.

The documentation for the API has also moved to [https://simplecalendar.info/api/index.html](https://simplecalendar.info/modules/SimpleCalendar.html). This site will be home to all documentation around Simple Calendar but for right now it just contains the up-to-date API documentation.

#### General Changes

- Added a new property [`SimpleCalendar.api.Icons`](https://simplecalendar.info/enums/SimpleCalendar.api.Icons.html) that contains a list of all available icons within Simple Calendar.
- **Important**: Depreciating the property `SimpleCalendar.api.MoonIcons`. This has been replaced with the Icons property and will be removed when FoundryVTT v10 Stable has been released.
- Updated the [`SimpleCalendar.api.formateDate()`](https://simplecalendar.info/modules/SimpleCalendar.api.html#formatDateTime) function to also take in an optional format string to format the date/time in any custom way. If no format string is provided it will return an object with the date formatted using the formats from the configuration, otherwise it will return the formatted string
- Added a new function [`SimpleCalendar.api.runMigration()`](https://simplecalendar.info/modules/SimpleCalendar.api.html#runMigration) function that will run the migration code again.

#### Bug Fixes

- Fixed a bug with `SimpleCalendar.api.changeDate` where if just a year was passed in the month would update to the first month of the year.

#### Multi Calendar Support

- Added a function [`SimpleCalendar.api.getCurrentCalendar()`](https://simplecalendar.info/modules/SimpleCalendar.api.html#getCurrentCalendar) that returns the configuration data for the current active calendar.
- Added a new function [`SimpleCalendar.api.getAllCalendars()`](https://simplecalendar.info/modules/SimpleCalendar.api.html#getAllCalendars) that returns a list of all calendars set up in Simple Calendar. (This does not include any predefined calendars)
- Updated all API functions so that they can now take an additional optional parameter `calendarId` (where it made sense).
  - This parameter can be used to target a specific calendar for the API function to update/get data from. If the parameter is not specified then the current active calendar will be used.
  - This means that current systems/modules/macros that use the API will not need to update their function calls unless they want to add the ability to target calendars that are not the one currently being used.

#### Note Support

- Added a function [`SimpleCalendar.api.getNotes()`](https://simplecalendar.info/modules/SimpleCalendar.api.html#getNotes) that returns all notes that the current player can see. Optional parameter to specify the ID of the calendar to get the notes from, defaults to the active calendar.
- Added a function [`SimpleCalendar.api.getNotesForDay(year, month, day)`](https://simplecalendar.info/modules/SimpleCalendar.api.html#getNotesForDay) that returns all notes that the current player can see for the date specified. . Optional parameter to specify the ID of the calendar to get the notes from, defaults to the active calendar.
- Added a function [`SimpleCalendar.api.addNote()`](https://simplecalendar.info/modules/SimpleCalendar.api.html#addNote) that will add a new note of the specified content to the specified date of the specified calendar. This function will return the newly created JournalEntry that contains the notes' data.

#### Handlebar Helpers

- Removed 2 Handlebar helpers, day-has-note and day-moon-phase. These were used internally and are no longer required.
- Added a new Handlebar helper [sc-full-calendar](https://simplecalendar.info/enums/HandlebarHelpers.html#sc_full_calendar) that can be used to render a full calendar view of the current date or passed in date.
  - These calendars support basic interactivity, change which month is being viewed and selecting a day when it is clicked, with the option to pass in your own function to extend this functionality.
  - These calendars can use the default Simple Calendar styling or be customized.
- Added a new function [`SimpleCalendar.api.activateFullCalendarListeners()`](https://simplecalendar.info/modules/SimpleCalendar.api.html#activateFullCalendarListeners) that is used to activate all the basic interactivity for calendars rendered with the [sc-full-calendar](https://simplecalendar.info/api/enums/HandlebarHelpers.html#sc_full_calendar) Handlebar helper.
#### Removal of Depreciated Items

- With the release of Foundry v9 depreciated properties from the [Date Object](https://simplecalendar.info/interfaces/SimpleCalendar.DateData.html) have been removed:
  - _**dayDisplay**_: Please use display.day instead.
  - _**monthName**_: Please use display.monthName instead.
  - **_yearName_**: Please use display.yearName instead.
  - **_yearPrefix_**: Please use display.yearPrefix instead.
  - **_yearPostfix_**: Please use display.yearPostfix instead.
- With the release of Foundry v9 depreciated functions from the SimpleCalendar class have been removed:
    - `SimpleCalendar.show();`: Please use `SimpleCalendar.api.showCalendar();`
    - `SimpleCalendar.setDateTime()`: Please use `SimpleCalendar.api.setDate()`
    - `SimpleCalendar.changeDateTime()`: Please use `SimpleCalendar.api.changeDate()`

### Translation Updates

- Updates to the German translation thanks to [BlueSkyBlackBird](https://github.com/BlueSkyBlackBird)!
- Simple Calendar is now available in Italian thanks to [Haloghen](https://github.com/Haloghen)!

### About Time and Calendar/Weather Importing

I have removed the functionality for importing calendar data from about-time and calendar/weather. About-time has not supported custom calendars for several months now and calendar/weather has been depreciated for weather control.

<hr/>

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
