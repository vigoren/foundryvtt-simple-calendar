[![Supported Foundry Versions](https://img.shields.io/endpoint?url=https://foundryshields.com/version?url=https://github.com/vigoren/foundryvtt-simple-calendar/releases/latest/download/module.json)](https://foundryvtt.com/releases/)
![](https://img.shields.io/endpoint?url=https%3A%2F%2Ffoundryshields.com%2Fsystem%3FnameType%3Dfull%26showVersion%3D1%26url%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fvigoren%2Ffoundryvtt-simple-calendar%2Fmain%2Fsrc%2Fmodule.json)
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

![](./docs/images/logo.png)
![](media://logo.png)

# Simple Calendar 

Simple Calendar is the ultimate timekeeping module for [FoundryVTT](https://foundryvtt.com/) that works with all game systems!

It comes prepackaged with many [preset calendars](https://simplecalendar.info/pages/docs/calendar-configuration/quick-setup.html) to get your world up and running quickly. Or if you have a completely custom-built calendering system for your world, Simple Calendar can handle that as well!

![](./docs/images/sc-v2-themes.gif)
![](media://sc-v2-themes.gif)

## Creating The Perfect Calendar

Simple Calendar gives Game Masters to power to create calendars to enrich their worlds for their players.

### Define months that make sense for your world. 

* Your world can have as many months as it needs!.
* [Customize](https://simplecalendar.info/pages/docs/calendar-configuration/month-settings.html) each month to specify everything from how many days it has, its name to if the month is considered intercalary (falls outside normal months) or not.

### Custom Years

* Set the current year or add a prefix/postfix.
* You can also [name each year](https://simplecalendar.info/pages/docs/calendar-configuration/year-settings.html#year-names) to give your world a unique touch!

### Unique Weekdays

* You set how many days are in a week and customize the name of each weekday!

### Set Your Own Leap Year Rules

* Customize if your world has [leap years](https://simplecalendar.info/pages/docs/calendar-configuration/leap-year-settings.html) and if so how often they occur.
* Set how many days a month has during a leap year. You can even have months only appear or disappear during leap years!

### Seasons

* Determine how many [seasons](https://simplecalendar.info/pages/docs/calendar-configuration/season-settings.html) there are in your world.
* [Customize](https://simplecalendar.info/pages/docs/calendar-configuration/season-settings.html) their names, when the season starts, and assign an icon and color to make each season unique.
* You can also specify Sunrise and Sunset times for each season and Simple Calendar will do the math to gradually shift those times between season!

### Create Custom Moons

* [Set up](https://simplecalendar.info/pages/docs/calendar-configuration/moon-settings.html) as many moons as your world needs and give it a unique name, cycle length and color.
* Go deeper into the settings and [customize each phase](https://simplecalendar.info/pages/docs/calendar-configuration/moon-settings.html#phases) of the moon!

### Unique Time? No Problem

* [Customize](https://simplecalendar.info/pages/docs/calendar-configuration/time-settings.html) the number hours in a day, minutes in an hour and seconds in a minute.
* Configure how the real time clock interacts with your world, so as seconds pass in the real world time passes in your world!

### Notes and Events 

* Add [notes](https://simplecalendar.info/pages/docs/using-sc/notes.html) and events to your calendar so that you never forget an event again.
* Specify how often notes can repeat, categorize your notes for easy identification and select who can view each note.

## Documentation

Simple Calendar has a dedicated site for everything from how to use the module as a player, to configure the module as a game master to how to interact with the API for use with other modules / systems. Check out the links below!

- [Documentation](https://simplecalendar.info/index.html)
- [Using Simple Calendar](https://simplecalendar.info/pages/docs/using-sc/index/index.html)
- [Configuring your Calendar](https://simplecalendar.info/pages/docs/calendar-configuration/index/index.html)
- [Notes](https://simplecalendar.info/pages/docs/using-sc/notes.html)
- [Hooks](https://simplecalendar.info/modules/SimpleCalendar.Hooks.html)
- [API (For use by other modules, systems or macros)](https://simplecalendar.info/modules/SimpleCalendar.api.html)

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

| Language                  | Translator(s)                                                                                                                                                              |
|---------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| German (de)               | [MasterZelgadis](https://github.com/MasterZelgadis) <br/> [BlueSkyBlackBird](https://github.com/BlueSkyBlackBird) <br/> [Fallayn](https://github.com/Fallayn) <br/> מר כוס |
| Traditional Chinese (zh)  | [benwater12](https://github.com/benwater12)                                                                                                                                |
| Spanish (es)              | [areymoreno](https://github.com/areymoreno) <br/> [lozalojo](https://github.com/lozalojo)                                                                                  |
| Korean (ko)               | [drdwing](https://github.com/drdwing)                                                                                                                                      |
| Portuguese Brasil (pt-BR) | [castanhocorreia](https://github.com/castanhocorreia)                                                                                                                      |
| Czech (cs)                | [robertjunek](https://github.com/robertjunek)                                                                                                                              |
| French (fr)               | [JDR Ninja](https://github.com/JDR-Ninja) <br/> [TheBird956](https://github.com/TheBird956)                                                                                |
| Italian (it)              | [Haloghen](https://github.com/Haloghen)                                                                                                                                    |

## Contributing

If you would like to contribute to the Simple Calendar module check out the [contributing](./CONTRIBUTING.md) guide!

## Credits

Moon Phase, Sunrise, Sunset and Midday Icons by [Bas Milius](https://github.com/basmilius/weather-icons), modified by [vigorator](https://github.com/vigoren)
