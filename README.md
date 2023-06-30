[![Supported Foundry Versions](https://img.shields.io/endpoint?url=https://foundryshields.com/version?url=https://github.com/vigoren/foundryvtt-simple-calendar/releases/latest/download/module.json)](https://foundryvtt.com/releases/)
![](https://img.shields.io/endpoint?url=https%3A%2F%2Ffoundryshields.com%2Fsystem%3FnameType%3Dfull%26showVersion%3D1%26url%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fvigoren%2Ffoundryvtt-simple-calendar%2Fmain%2Fsrc%2Fmodule.json)
![GitHub package.json version](https://img.shields.io/github/package-json/v/vigoren/foundryvtt-simple-calendar)
[![license](https://img.shields.io/badge/license-MIT-blue)](https://github.com/vigoren/foundryvtt-simple-calendar/blob/main/LICENSE)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/vigoren/foundryvtt-simple-calendar/node.js.yml)
[![codecov](https://codecov.io/gh/vigoren/foundryvtt-simple-calendar/branch/main/graph/badge.svg?token=43TJ117WP1)](https://codecov.io/gh/vigoren/foundryvtt-simple-calendar)
[![GitHub release (latest by date)](https://img.shields.io/github/downloads/vigoren/foundryvtt-simple-calendar/latest/module.zip)](https://github.com/vigoren/foundryvtt-simple-calendar/releases/latest)
[![forge](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%&url=https://forge-vtt.com/api/bazaar/package/foundryvtt-simple-calendar&colorB=3d8b41)](https://forge-vtt.com/bazaar#package=foundryvtt-simple-calendar)
[![Foundry Hub Endorsements](https://img.shields.io/endpoint?logoColor=white&url=https://www.foundryvtt-hub.com/wp-json/hubapi/v1/package/foundryvtt-simple-calendar/shield/endorsements)](https://www.foundryvtt-hub.com/package/foundryvtt-simple-calendar/)
[![Foundry Hub Comments](https://img.shields.io/endpoint?logoColor=white&url=https://www.foundryvtt-hub.com/wp-json/hubapi/v1/package/foundryvtt-simple-calendar/shield/comments)](https://www.foundryvtt-hub.com/package/foundryvtt-simple-calendar/)

[![Support me on Patreon](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Fshieldsio-patreon.vercel.app%2Fapi%3Fusername%3Dvigorator%26type%3Dpatrons&style=flat)](https://patreon.com/vigorator)
[![ko-fi](https://img.shields.io/badge/%20-Support%20me%20on%20Ko--fi-%23FF5E5B?style=flat&logo=ko-fi&logoColor=white)](https://ko-fi.com/A0A546HOX)


![](./src/assets/logo.png)
# Simple Calendar 

Simple Calendar is the ultimate timekeeping module for [FoundryVTT](https://foundryvtt.com/) that works with all game systems!

It comes prepackaged with many [preset calendars](https://simplecalendar.info/docs/calendar-configuration/quick-setup#choose-a-predefined-calendar) to get your world up and running quickly. Or if you have a completely custom-built calendering system for your world, Simple Calendar can handle that as well!

Get started and create the perfect calendar to enrich your world for your players!

### Months your way

* Your world can have as many months as it needs!.
* [Customize](https://simplecalendar.info/docs/calendar-configuration/month-settings) each month to specify everything from how many days it has, its name to if the month is considered intercalary (falls outside normal months) or not.

### Custom Years

* Set the current year or add a prefix/postfix.
* You can also [name each year](https://simplecalendar.info/docs/calendar-configuration/year-settings#year-names) to give your world a unique touch!

### Unique Weekdays

* You set how many days are in a week and customize the name of each weekday!

### Set Your Own Leap Year Rules

* Customize if your world has [leap years](https://simplecalendar.info/docs/calendar-configuration/leap-year-settings) and if so how often they occur.
* Set how many days a month has during a leap year. You can even have months only appear or disappear during leap years!

### Seasons

* Determine how many [seasons](https://simplecalendar.info/docs/calendar-configuration/season-settings) there are in your world.
* [Customize](https://simplecalendar.info/docs/calendar-configuration/season-settings) their names, when the season starts, and assign an icon and color to make each season unique.
* You can also specify Sunrise and Sunset times for each season and Simple Calendar will do the math to gradually shift those times between season!

### Create Custom Moons

* [Set up](https://simplecalendar.info/docs/calendar-configuration/moon-settings) as many moons as your world needs and give it a unique name, cycle length and color.
* Go deeper into the settings and [customize each phase](https://simplecalendar.info/docs/calendar-configuration/moon-settings#phases) of the moon!

### Unique Time? No Problem

* [Customize](https://simplecalendar.info/docs/calendar-configuration/time-settings) the number hours in a day, minutes in an hour and seconds in a minute.
* Configure how the real time clock interacts with your world, so as seconds pass in the real world time passes in your world!

### Notes and Events

* Add [notes](https://simplecalendar.info/docs/using-sc/notes/) and events to your calendar so that you never forget an event again.
* Specify how often notes can repeat, categorize your notes for easy identification and select who can view each note.

### And much more!

There are many ways to customize your calendar and how it interacts with FoundryVTT and other systems and modules. Be sure to check out the full documentation to learn all the way!


![](./simple-calendar-docs/docs/images/sc-v2-themes.gif)

## Documentation

Simple Calendar has a dedicated site for everything from how to use the module as a player, to configure the module as a game master to how to interact with the API for use with other modules / systems. Check out the links below!

- [Documentation](https://simplecalendar.info/)
- [Using Simple Calendar](https://simplecalendar.info/docs/category/using-simple-calendar)
- [Configuring your Calendar](https://simplecalendar.info/docs/category/calendar-configuration)
- [Notes](https://simplecalendar.info/docs/using-sc/notes/)
- [Hooks](https://simplecalendar.info/docs/developing-with-sc/api/namespaces/SimpleCalendar.Hooks)
- [API (For use by other modules, systems or macros)](https://simplecalendar.info/docs/developing-with-sc/api/namespaces/SimpleCalendar.api)

### Installing The Module

There are 3 ways to install the module:

#### Through Foundry

Foundry has a built-in directory of modules that you can install. The easiest way is to use this feature and search for "Simple Calendar" and install!

#### module.json

Through the same built-in module installer in foundry, you can specify the link of the module to install instead of searching the directory. To install using the module json file, use this link [https://github.com/vigoren/foundryvtt-simple-calendar/releases/latest/download/module.json](https://github.com/vigoren/foundryvtt-simple-calendar/releases/latest/download/module.json)

#### Zip File

To install the most recent version of the module, view the releases section to the right of the main GitHub page. 
Selecting the latest release will bring you to a page where you can download the module.zip asset. This will contain everything you need to manually install the module.

## Translations

Simple Calendar is available in many languages thanks to the translation community. Be sure to check out the [translation page](./simple-calendar-docs/docs/translations.md) for details on available languages and translators.

## Contributing

If you would like to contribute to the Simple Calendar module check out the [contributing](./CONTRIBUTING.md) guide!

## Support

Have questions? Ran into a bug? There are a couple of ways you can get help!

* The first option is in the official [FoundryVTT discord](https://discord.gg/foundryvtt). The friendly folks in #module-discussion and #module-troubleshooting can help with lots of questions.
* You can also put in an issue on the [GitHub](https://github.com/vigoren/foundryvtt-simple-calendar) for the project and I will help you out!

If you wish to support the development of Simple Calendar there are a few ways you can help:

* Share your good experiences with the module with others!
* Leave an endorsement or comment on [Foundry Hub](https://www.foundryvtt-hub.com/package/foundryvtt-simple-calendar/).
* If you wish and are able to you can support the developer monetarily by becoming a [Patron](https://www.patreon.com/vigorator) or donating on [Ko-fi](https://ko-fi.com/vigorator). Simple Calendar will always be free to use by anyone, these are just options for those who want to donate to the development.

## Credits

Moon Phase, Sunrise, Sunset and Midday Icons by [Bas Milius](https://github.com/basmilius/weather-icons), modified by [vigorator](https://github.com/vigoren)
