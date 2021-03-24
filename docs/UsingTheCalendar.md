# Accessing and Using the Calendar
The module adds a calendar button to the basic controls section of the layer controls. Clicking on this will open the module window

![Calendar Button Location](https://raw.githubusercontent.com/vigoren/foundryvtt-simple-calendar/main/docs/images/layers-button.png)

The above image helps shows the controls, they are detailed out below.

Control | Description
------- | -----------
Previous/Next | Allow the user to change which month/year they are currently viewing.
Today Button | Changes the calendar so that the current day (in the game world) is visible and selected.
Blue Circle Day | This indicates the current day in the game world, can be changed by the GM
Green Circle Day | This indicates the day the user currently has selected. This will show any notes on this day.
Red Indicator | This shows on any days that have notes that the user can see. It will show the number of notes on that day up to 99.
Notes List | Any notes that appear in this list can be clicked on to open the note details.


## Simple Calendars Clock

Simple Calendar can now display a clock below the calendar. If the clock is not showing up, it is likely that the GM has turned off the clock for the current game as it will be not needed.

The clock can be updated manually by the GM, or it can be enabled to update as real world time passes. The amount of in game time that passes as real world time passes is configurable by the GM.

Once the clock has been started, it will begin incrementing time. The clock updates every 30 real life seconds, this is to allow time for proper syncing of the game time between all players.

The clock icon next to the Current Time display will also update based on the state of the Simple Calendars clock.

- **Red**: Means that Simple Calendars Clock is currently stopped and not automatically incrementing.
- **Yellow**: Means that Simple Calendars Clock has been started but because the game is paused OR there is an active combat the clock is not updating.
- **Green**: The clock will begin its animation, this means that Simple Calendars Clock is running and updating the game time as real time passes.
