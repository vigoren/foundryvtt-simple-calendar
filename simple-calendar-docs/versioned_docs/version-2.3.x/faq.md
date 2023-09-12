# FAQ

Below are a few common issues and questions!

## Can't Change Calendar Settings / Can't Edit Notes

The most common cause of this issue is due to the module not having updated past version 1.3.75. If your Simple Calendar version is on 1.3.75 please follow the steps in this [FAQ](#unable-to-update-to-the-latest-version--stuck-on-version-1375).

If you are on a version newer than 1.3.75 and still can not update the configuration or notes please [submit an issue on GitHub](https://github.com/vigoren/foundryvtt-simple-calendar/issues).

<hr/>

## Unable to Update to the Latest Version / Stuck on Version 1.3.75

This is due to an update bug when on version 1.3.75 or earlier. Follow these steps to get the latest version:

1. **Uninstall Simple Calendar**: In the module management section of FoundryVTT uninstall the module. This is a safe procedure as no data (notes, configuration settings) is deleted when uninstalling.
2. **Reinstall Simple Calendar**: In the module management section of FoundryVTT reinstall the module, the new version of Simple Calendar should be 2+.
3. **Relaunch Your World**: Go back into the world that was having the problem, you will see a dialog informing you of a data migration. Once that has finished all your information will be available, the module will work, and you are ready to use the calendar!

<hr/>

## Where Did the Toolbar Button Go?

In versions 1.x.x of Simple Calendar the toolbar button was under "Token Controls".

In versions 2.x.x of Simple Calendar the toolbar button was moved to be under "Journal Notes".
There is also a button to open Simple Calendar under the Configure Settings menu.

This move was made as Simple Calendar does not have anything specific to do with tokens and is largely a journal tool, so it makes more sense for it to live there.

<hr/>

## Why Is Simple Calendar not in Sync with X module/system?

Simple Calendar does its very best to stay synced with all other time modules and systems that provide their own clocks/calendars, sometimes though it isn't perfect.

One setting to make sure is set correctly, regardless of module or system, is to make sure the [Game World Time Integration](https://simplecalendar.info/pages/calendar-configuration/index/general-settings.html#game-world-time-integration) setting is set to "Mixed". Almost everyone will need that setting set to Mixed, the other options are for very specific use cases.

Listed below are some other modules and systems that get asked about:

### Pathfinder 2E

Simple Calendar will sync properly with Pathfinder 2E's world clock in 99% of cases, provided the ["Pathfinder 2E: World Time Sync"](https://simplecalendar.info/pages/calendar-configuration/index/general-settings.html#pathfinder-2e-world-clock-sync) setting is enabled in Simple Calendar. 

There are a few edge cases where time in Simple Calendar will be off by a day from the PF2E World Clock. This has to do with how [each addresses leap years and is not easily fixed from the side of PF2E](https://github.com/foundryvtt/pf2e/issues/1772).

### SmallTime

Simple Calendar and SmallTime should work together correctly. If Simple Calendar is installed SmallTime should automatically switch to using Simple Calendar as its source for date and time.

### SmallTime and Pathfinder 2E

If the time takes place before the Pathfinder 2E's epoch (The date the world was created, resetting the world clock will show the exact date). SmallTime will be off by 1 minute. This is a known issue with SmallTime. Simple Calendar will still show the correct date and time.

<hr/>

## How do I set the time to be a 12-hour clock instead of a 24-hour clock?

Simple Calendar offers a very customizable way to change how the time and date are displayed, all details on how you can customize the display can be found [here](https://simplecalendar.info/pages/calendar-configuration/index/display-options.html).

For a quick setting to a 12-hour clock though you can follow these steps:

1. Open up the Simple Calendar configuration window.
2. Navigate to the calendar's "Display Options" settings.
3. In the field called "Time Format" replace with this `hh:mm:ss A`.
4. Save the configuration, now the clock will be displayed in a 12-hour format!

<hr/>

## Simple Calendar Says "There is an active combat/combats running" but there are no combats running

This message will appear depends on what you have set for the setting ["Pause Real Time Clock on Combat Rule"](https://simplecalendar.info/docs/global-configuration/settings#pause-real-time-clock-on-combat-rule).

If the setting is set to "**Pause Only on the Active Scene**":

- Check to make sure the current scene you are on is the active scene (indicated with a target icon in the scene list). 
  - If it is not make the current scene the active scene. 
  - Or go to the active scene and see if there is a combat running and end that combat.

If the setting is set to "**Pause on the Scene the GM is Currently Viewing**":

- Double check to see if there is a combat running on the scene you are viewing.

If none of the above options help then there could be a stuck combat. Occasionally in Foundry combats are not properly ended and can still report they are active.

You can check this by opening up the developer console (F12) and putting this command in `game.combats.size`. That will show how many combats Foundry thinks is running.

If there are combats that shouldn't be there you can run this command `game.combats.forEach(c => {c.delete()})` to remove all combats.

:::caution

This will delete all combats on all scenes, so it is better to wait until you are done with any combats in progress before running that command.

:::
