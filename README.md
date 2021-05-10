[![Supported Foundry Versions](https://img.shields.io/endpoint?url=https://foundryshields.com/version?url=https://github.com/vigoren/foundryvtt-simple-calendar/releases/latest/download/module.json)](https://foundryvtt.com/releases/)
![GitHub package.json version](https://img.shields.io/github/package-json/v/vigoren/foundryvtt-simple-calendar)
[![license](https://img.shields.io/badge/license-MIT-blue)](https://github.com/vigoren/foundryvtt-simple-calendar/blob/main/LICENSE)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/vigoren/foundryvtt-simple-calendar/Node.js%20CI)
[![codecov](https://codecov.io/gh/vigoren/foundryvtt-simple-calendar/branch/main/graph/badge.svg?token=43TJ117WP1)](https://codecov.io/gh/vigoren/foundryvtt-simple-calendar)
[![GitHub release (latest by date)](https://img.shields.io/github/downloads/vigoren/foundryvtt-simple-calendar/latest/module.zip)](https://github.com/vigoren/foundryvtt-simple-calendar/releases/latest)
[![forge](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%&url=https://forge-vtt.com/api/bazaar/package/foundryvtt-simple-calendar&colorB=3d8b41)](https://forge-vtt.com/bazaar#package=foundryvtt-simple-calendar)
[![Foundry Hub Endorsements](https://img.shields.io/endpoint?logoColor=white&url=https://www.foundryvtt-hub.com/wp-json/hubapi/v1/package/foundryvtt-simple-calendar/shield/endorsements)](https://www.foundryvtt-hub.com/package/foundryvtt-simple-calendar/)
[![Foundry Hub Comments](https://img.shields.io/endpoint?logoColor=white&url=https://www.foundryvtt-hub.com/wp-json/hubapi/v1/package/foundryvtt-simple-calendar/shield/comments)](https://www.foundryvtt-hub.com/package/foundryvtt-simple-calendar/)

[![ko-fi](https://img.shields.io/badge/%20-Support%20me%20on%20Ko--fi-%23FF5E5B?style=flat&logo=ko-fi&logoColor=white)](https://ko-fi.com/A0A546HOX)

![Logo](https://raw.githubusercontent.com/vigoren/foundryvtt-simple-calendar/main/docs/images/logo.png)


# Simple Calendar

A simple calendar module for [FoundryVTT](https://foundryvtt.com/) that is system independent. 

This module allows you to create a calendar with any number of months per year, any number of days per month and customizable hours, minutes and seconds for your game world.
It is intended as a way for a GM to show a calendar like interface that maps to their in game world.

## Features
 Simple Calendar has a number of features that make it a great time keeping tool for your games!

### For GMs
* Complete customization of the calendar to meet your worlds needs:
  * Set the year as well as add any prefix or postfix to the years name.
  * Define how many months in a year.
  * Set a custom name, the number of days and days during a leap year (if applicable) for each month.
  * Choose if months are considered intercalary (fall outside normal months).
  * Set the number hours in a day, minutes in an hour and seconds in a minute.  
  * Set up your own Leap Year rules.
  * Set up different seasons for your calendar and how they are displayed to the users.
  * Set up your own custom moons.
  * Or choose from a selection of [preset calendars](./docs/Configuration.md#predefined-calendars).
* Set and change the current day and time as your game story progresses or have it automatically advance based on real world time and passing combat rounds.
* Add notes to specific days on the calendar to remind yourself of events or other world related things.
  * These notes can either be visible to players as well as the GM or just the GM.

![GM View of Calendar](https://raw.githubusercontent.com/vigoren/foundryvtt-simple-calendar/main/docs/images/gm-screenshot-1.png)

### For Players

* Browse a calendar interface to see the years, months and day of the game world.
* See the current day and time of the game world.
* Select days to view any notes/events specific to that day.
* If the GM allows it, the ability to add their own notes to the calendar.
* The Ability to switch between a full and compact view of the calendar.

![Player View of Calendar](https://raw.githubusercontent.com/vigoren/foundryvtt-simple-calendar/main/docs/images/player.gif)

## Contents

- [Installation](#installing-the-module)
- [Compatible Modules](#compatible-modules)
- [Accessing and using the calendar](./docs/UsingTheCalendar.md)
- [Changing the date and time](./docs/UpdatingDateTime.md)
- [Notes](./docs/Notes.md)
- [Configuring your Calendar](./docs/Configuration.md)
- [Macros](./docs/Macros.md)
- [Hooks](./docs/Hooks.md)
- [Translations](#translations)

## Installing The Module

There are 2 ways to install the module, using the module.json file or by manually downloading the zip file.

### module.json

To install using the module json file, use this link [https://github.com/vigoren/foundryvtt-simple-calendar/releases/latest/download/module.json](https://github.com/vigoren/foundryvtt-simple-calendar/releases/latest/download/module.json)

### Zip File

To install the most recent version of the module, view the releases section to the right of the main GitHub page. 
Selecting the latest release will bring you to a page where you can download the module.zip asset. This will contain everything you need to manually install the module.

## Compatible Modules
These are other time keeping modules that Simple Calendar can work if they are installed in your world.

**Important**: None of these modules are required, the option to work with them is available to make a GMs life easier if they want to use Simple Calendar but have another of these modules installed.

- [about-time](https://foundryvtt.com/packages/about-time): See the [about-time module configuration for Simple Calendar](./docs/Configuration.md#about-time) for more information.
- [Calendar/Weather](https://foundryvtt.com/packages/calendar-weather): See the [Calendar/Weather module configuration for Simple Calendar](./docs/Configuration.md#calendarweather) for more information.

## Translations

Simple Calendar is available in languages other than English thanks to the following people:

Language|Translator(s)
--------|----------
German (de)|[MasterZelgadis](https://github.com/MasterZelgadis)
Traditional Chinese (zh)|[benwater12](https://github.com/benwater12)


If your language is missing from the list, and you would like to help translate Simple Calendar please follow these steps:

- Fork this repository.
- Under the src/lang folder copy the en.json file.
- Rename that file so that it matches your languages [2 letter ISO code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes).
- Go through that file and translate all the english values to your language.
- Open the src/module.json and add your language to the list under "languages"
- Update the ReadMe file to add your name to the table above.
- Create a pull request back into this repository with your additions.
- Know that your help is appreciated to bring this module to as many users as possible!

## Credits

Moon Icons by [Wolf Böse](https://thenounproject.com/neuedeutsche/)
