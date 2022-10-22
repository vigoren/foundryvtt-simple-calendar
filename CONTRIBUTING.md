# Contributing To Simple Calendar

There are several ways in which you can contribute to this project!

- [Translations](#translations)
- [Predefined Calendars](#predefined-calendars)
- [Themes](#themes)

## Translations

Translations for Simple Calendar are easy to update and add! No coding knowledge or need to understand GitHub required. 

Translations are all done through a [weblate online portal](https://weblate.foundryvtt-hub.com/engage/simple-calendar/), head on over there make an account and start contributing!

## Predefined Calendars

Predefined calendars are the calendars that appear under the Predefined Calendar section of the Quick Setup for a calendar within Simple Calendar.

Adding a new predefined calendar to Simple Calendar is a great way to have other users quickly set up that calendar in their worlds. This is ideal for game systems or worlds that use their own unique calendaring system.

To add a new predefined calendar please follow the steps below:

- Fork this repository.
- Create a new JSON file in the projects `/src/predefined-calendars/` folder and call it the name of your calendar, for this example we will use `new-calendar.json`, and save it with this content:
```json
{
  "calendar": {},
  "notes": []
}
```
- Configure your new predefined calendar in Simple Calendar.
- Export this calendars configuration and notes. No need to export the global configuration or permissions.
- The export file will look something like this:
```json
{
  "exportVersion":2,
  "globalConfig":{},
  "permissions":{},
  "calendars":[
    {...}
  ],
  "notes":{
    "default":[...]
  }
}
```
- From the exported file, copy the object from the calendars array to the calendar property of the `new-calendar.json` file.
- From the exported file, copy the array of notes from the `notes.default` property to the notes property of the `new-calendar.json` file.
- The final object will look something like this:
```json
{
  "calendar": {...},
  "notes": [...]
}
```
- Open the project file `/src/predefined-calendars/calendar-list.json`, this contains a list of all available predefined calendars.
- Add a new object to the files array with the following properties:
    - **key**: The name of the file, minus the .json
    - **label**: The display name of your calendar that will show up in the list within the configuration dialog
    - **config**: Set this to true if a calendar configuration has been added in the predefined calendar file. This should always be true.
    - **notes**: Set this to true if notes have been included in the predefined calendar file.
```json
[
  {"key": "new-calendar", "label": "My New Calendar", "config":  true, "notes":  false}
]
```
- Test to make sure the changes are loading properly by building the project and placing the files in FoundryVTTs module folder for Simple Calendar.
- Create a pull request back into this repository with your additions.
- Thanks for the addition of a new predefined calendar!


## Themes

Adding a new theme to the Simple Calendar codebase is straight forward, just follow these steps to get started!

- Open the `src/constants.ts` file and find the `const Themes` variable, here you will see all the other themes that come with Simple Calendar.
- Copy the dark themes entry and add it to the end of the array and change the variables:
  - `key`: The unique key to distinguish this theme from other themes.
  - `name`: This can be text or a reference to a localization key. This is the text that appears in the Theme selection drop down.
  - `system`: If this theme is only supposed to work with a specific system. If this is set to `true` then the key and theme file name needs to match the ID of the system it is supposed to work for.
  - `module`: If this theme is only supposed to work when a specific module is enabled. If this is set to `true` then the key and theme file name needs to match the ID of the module it is supposed to work for. This won't work if the `system` key is set to true.
- Your theme will now appear in the theme selector for Simple Calendar!
- Navigate to the `/src/styles/themes` folder.
- Copy an existing theme file (the `dark.scss` or `light.scss` is recommended) and rename it to your themes name. Remember if your theme only works with a specific system or module to match this name with that of the system or module.
- Open your copied theme file and scroll to the bottom of the file to find this chunk of code and replace the `dark` class name with the key/file name you used:
```scss
.simple-calendar{
  &.dark{
    @each $prop, $value in $theme {
      --#{$prop}: #{$value};
    }
  }
}
```
- You are now ready to start customizing your theme!

All the properties in the sass variable `$theme` correlate with a CSS variable that is added to the Simple Calendar container and used by the rest of the CSS to style the module. Be sure to check out the [Theming Simple Calendar](https://simplecalendar.info/pages/docs/developing-with-sc/index/theming.html) to see what each CSS variable does!

You can further customize the theme by overriding specific SCSS classes to the bottom of the file. You can see examples of this in the wfrp4e.scss system specific theme file.

Once your theme file has been updated you can build the project using the `package.json` build command, which will output the compiled module to a `dist` folder under the root of the project. Copying the contents of that folder to where the module is installed in foundry will allow you to test the updated content and see your theme. 