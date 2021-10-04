[![Supported Foundry Versions](https://img.shields.io/endpoint?url=https://foundryshields.com/version?url=https://github.com/vigoren/foundryvtt-simple-calendar/releases/latest/download/module.json)](https://foundryvtt.com/releases/)
![GitHub package.json version](https://img.shields.io/github/package-json/v/vigoren/foundryvtt-simple-calendar)
[![license](https://img.shields.io/badge/license-MIT-blue)](https://github.com/vigoren/foundryvtt-simple-calendar/blob/main/LICENSE)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/vigoren/foundryvtt-simple-calendar/Node.js%20CI)
[![codecov](https://codecov.io/gh/vigoren/foundryvtt-simple-calendar/branch/main/graph/badge.svg?token=43TJ117WP1)](https://codecov.io/gh/vigoren/foundryvtt-simple-calendar)
[![GitHub release (latest by date)](https://img.shields.io/github/downloads/vigoren/foundryvtt-simple-calendar/latest/module.zip)](https://github.com/vigoren/foundryvtt-simple-calendar/releases/latest)
[![forge](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%&url=https://forge-vtt.com/api/bazaar/package/foundryvtt-simple-calendar&colorB=3d8b41)](https://forge-vtt.com/bazaar#package=foundryvtt-simple-calendar)
[![Foundry Hub Endorsements](https://img.shields.io/endpoint?logoColor=white&url=https://www.foundryvtt-hub.com/wp-json/hubapi/v1/package/foundryvtt-simple-calendar/shield/endorsements)](https://www.foundryvtt-hub.com/package/foundryvtt-simple-calendar/)
[![Foundry Hub Comments](https://img.shields.io/endpoint?logoColor=white&url=https://www.foundryvtt-hub.com/wp-json/hubapi/v1/package/foundryvtt-simple-calendar/shield/comments)](https://www.foundryvtt-hub.com/package/foundryvtt-simple-calendar/)

[![Support me on Patreon](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Fshieldsio-patreon.vercel.app%2Fapi%3Fusername%3Dvigorator%26type%3Dpatrons&style=flat)](https://patreon.com/vigorator)
[![ko-fi](https://img.shields.io/badge/%20-Support%20me%20on%20Ko--fi-%23FF5E5B?style=flat&logo=ko-fi&logoColor=white)](https://ko-fi.com/A0A546HOX)

![Logo](https://raw.githubusercontent.com/vigoren/foundryvtt-simple-calendar/main/docs/images/logo.png)

# Simple Calendar

A simple calendar module for [FoundryVTT](https://foundryvtt.com/) that is game system independent. 

This module allows you to create a completely customizable calendar that ties in with the Game Masters world exactly how they want it to. Notes and events can be added to the calendar to help keep track of what and when things are happening in your world.

All of this is done using a familiar calendaring view both the GM and players will enjoy!

## Contents

- [Features](#features)
- [Installation](#installing-the-module)
- [Accessing and using the calendar](./docs/UsingTheCalendar.md)
- [Configuring your Calendar](./docs/Configuration.md)
- [Notes](./docs/Notes.md)
- [Hooks](./docs/Hooks.md)
- [API (For use by other modules, systems or macros)](./docs/API.md)
- [Translations](#translations)

## Features
 Simple Calendar has a number of features that make it a great time keeping tool for your games!

### For GMs
* Complete customization of the calendar to meet your worlds needs! Including the following functionality:
  * Set the year as well as add any prefix or postfix or a custom name for the year.
  * Define how many months in a year.
  * Set a custom name, the number of days for each month.
  * Choose if months are considered intercalary (fall outside normal months).
  * Define how many days in a week and the name of each weekday.
  * Set the number hours in a day, minutes in an hour and seconds in a minute.  
  * Set up your own Leap Year rules.
  * Set up different seasons for your calendar and how they are displayed to the users.
  * Set up your own custom moons.
  * Or choose from a selection of [preset calendars](./docs/Configuration.md#predefined-calendars).
* Set and change the current day and time as your game story progresses or have it automatically advance based on real world time and passing combat rounds.
* Add notes to specific days on the calendar to remind yourself of events or other world related things.
  * Add custom labels to notes to help distinguish the type of note.
  * Set if the note is visible to players or just the GM.
  * Support for repeating notes! They can repeat weekly, monthly or yearly.

![GM View of Calendar](https://raw.githubusercontent.com/vigoren/foundryvtt-simple-calendar/main/docs/images/gm-screenshot-1.png)

### For Players

* Browse a calendar interface to see the years, months and day of the game world.
* See the current day and time of the game world.
* Select days to view any notes/events specific to that day.
* If the GM allows it, the ability to add their own notes to the calendar.
* The Ability to switch between a full and compact view of the calendar.

![Player View of Calendar](https://raw.githubusercontent.com/vigoren/foundryvtt-simple-calendar/main/docs/images/player.gif)



## Installing The Module

There are 3 ways to install the module:

### Through Foundry

Foundry has a built-in directory of modules that you can install. The easiest way is to use this feature and search for "Simple Calendar" and install!

### module.json

Through the same built-in module installer in foundry, you can specify the link of the module to install instead of searching the directory. To install using the module json file, use this link [https://github.com/vigoren/foundryvtt-simple-calendar/releases/latest/download/module.json](https://github.com/vigoren/foundryvtt-simple-calendar/releases/latest/download/module.json)

### Zip File

To install the most recent version of the module, view the releases section to the right of the main GitHub page. 
Selecting the latest release will bring you to a page where you can download the module.zip asset. This will contain everything you need to manually install the module.

## Translations

Simple Calendar is available in languages other than English thanks to the following people:

Language|Translator(s)
--------|----------
German (de)|[MasterZelgadis](https://github.com/MasterZelgadis) <br/> [BlueSkyBlackBird](https://github.com/BlueSkyBlackBird) <br/> [Fallayn](https://github.com/Fallayn)
Traditional Chinese (zh)|[benwater12](https://github.com/benwater12)
Spanish (es)|[areymoreno](https://github.com/areymoreno) <br/> [lozalojo](https://github.com/lozalojo)
Korean (ko)|[drdwing](https://github.com/drdwing)
Portuguese Brasil (pt-BR)|[castanhocorreia](https://github.com/castanhocorreia)
Czech (cs)|[robertjunek](https://github.com/robertjunek)
French (fr)|[JDR Ninja](https://github.com/JDR-Ninja) <br/> [TheBird956](https://github.com/TheBird956)

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

Moon Icons by [Bas Milius](https://github.com/basmilius/weather-icons), modified by [vigorator](https://github.com/vigoren)
