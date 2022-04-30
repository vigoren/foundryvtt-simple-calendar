# Contributing To Simple Calendar

There are several ways in which you can contribute to this project!

- [Translations](#translations)
- [Predefined Calendars](#predefined-calendars)

## Translations

If there is a language that Simple Calendar has not been translated into, and you would like to help translate the module please follow these steps:

- Fork this repository.
- Under the src/lang folder copy the en.json file.
- Rename that file so that it matches your languages [2 letter ISO code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes).
- Go through that file and translate all the english values to your language.
- Open the src/module.json and add your language to the list under "languages"
- Update the ReadMe file to add your name to the table above.
- Create a pull request back into this repository with your additions.
- Know that your help is appreciated to bring this module to as many users as possible!


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