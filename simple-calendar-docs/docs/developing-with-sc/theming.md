---
pagination_next: null
pagination_prev: null
---


# Theming

Simple Calendar exposes several CSS variables that can be used to change its appearance. These variables are used by the built-in themes to control their appearance but can be overwritten to match a third party modules overall theme.

These variables are added to the `.simple-calendar.{theme}` classes. Example for the dark theme would be `.simple-calendar.dark` class will have the CSS variables. These classes are added by default to each Foundry VTT application to ensure all dialogs look correct.

Check out the [contributing guide](https://github.com/vigoren/foundryvtt-simple-calendar/blob/main/CONTRIBUTING.md#themes) if you want to add your own theme to Simple Calendar for everyone to use!

Below is the list of all available CSS variables and what they target:

## Application Windows

These are all the variables associated with changing how the Foundry VTT application windows look for Simple Calendar. 

| CSS Variable              | Description                                                                                                                     |
|---------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| --app-header-bg-color     | The application header background color.                                                                                        |
| --app-header-bg-image     | The application header background image. Links to images need to be wrapped in `url('')`. Choose `unset` if no image is wanted. |
| --app-header-color        | The application header text color.                                                                                              |
| --app-header-border       | The application header border css property.                                                                                     |
| --app-header-border-image | The application header border image. Links to images need to be wrapped in `url('')`. Choose `unset` if no image is wanted.     |
| --app-header-height       | The height of the application header. The height must include the units, rem is recommended.                                    |
| --app-bg-color            | The applications body background color.                                                                                         |
| --app-bg-image            | The applications body background image. Links to images need to be wrapped in `url('')`. Choose `unset` if no image is wanted.  |
| --app-border              | The applications body border css property.                                                                                      |
| --app-border-image        | The applications body border image. Links to images need to be wrapped in `url('')`. Choose `unset` if no image is wanted.      |
| --app-color               | The applications body text color.                                                                                               |

## Application Window Sections

These are all the variables associated with changing how defined sections (calendar, clock) look within Simple Calendar.

| CSS Variable           | Description                           |
|------------------------|---------------------------------------|
| --section-bg-color     | The background color for the section. |
| --section-border-color | The border color for the section.     |
| --section-color        | The text color for the section.       |

## Buttons

These are all the variables associated with changing how buttons look within Simple Calendar.

| CSS Variable                      | Description                                                                                                                        |
|-----------------------------------|------------------------------------------------------------------------------------------------------------------------------------|
| --btn-bg-image                    | A background image to apply to all buttons. Links to images need to be wrapped in `url('')`. Choose `unset` if no image is wanted. |
| --btn-border                      | The border CSS property for the buttons. eg `1px solid green`                                                                      |
| --btn-border-image                | The border image to apply to all buttons. Links to images need to be wrapped in `url('')`. Choose `unset` if no image is wanted.   |
| --btn-grey-border-color           | The border color that should be used for grey buttons.                                                                             |
| --btn-grey-bg-color               | The background color that should be used for grey buttons.                                                                         |
| --btn-grey-color                  | The text color that should be used for grey buttons.                                                                               |
| --btn-grey-bg-hover-color         | The background color that should be used for grey buttons when they are hovered.                                                   |
| --btn-grey-disabled-bg-color      | The background color that should be used for disabled grey buttons.                                                                |
| --btn-primary-border-color        | The border color that should be used for the primary color buttons.                                                                |
| --btn-primary-bg-color            | The background color that should be used for the primary color buttons.                                                            |
| --btn-primary-color               | The text color that should be used for the primary color buttons.                                                                  |
| --btn-primary-bg-hover-color      | The background color that should be used for the primary color buttons when they are hovered.                                      |
| --btn-primary-disabled-bg-color   | The background color that should be used for disabled the primary color buttons.                                                   |
| --btn-secondary-border-color      | The border color that should be used for the secondary color buttons.                                                              |
| --btn-secondary-bg-color          | The background color that should be used for the secondary color buttons.                                                          |
| --btn-secondary-color             | The text color that should be used for the secondary color buttons.                                                                |
| --btn-secondary-bg-hover-color    | The background color that should be used for the secondary color buttons when they are hovered.                                    |
| --btn-secondary-disabled-bg-color | The background color that should be used for disabled the secondary color buttons.                                                 |
| --btn-tertiary-border-color       | The border color that should be used for the tertiary color buttons.                                                               |
| --btn-tertiary-bg-color           | The background color that should be used for the tertiary color buttons.                                                           |
| --btn-tertiary-color              | The text color that should be used for the tertiary color buttons.                                                                 |
| --btn-tertiary-bg-hover-color     | The background color that should be used for the tertiary color buttons when they are hovered.                                     |
| --btn-tertiary-disabled-bg-color  | The background color that should be used for disabled the tertiary color buttons.                                                  |
| --btn-delete-border-color         | The border color that should be used for the delete color buttons.                                                                 |
| --btn-delete-bg-color             | The background color that should be used for the delete color buttons.                                                             |
| --btn-delete-color                | The text color that should be used for the delete color buttons.                                                                   |
| --btn-delete-bg-hover-color       | The background color that should be used for the delete color buttons when they are hovered.                                       |
| --btn-delete-disabled-bg-color    | The background color that should be used for disabled the delete color buttons.                                                    |
| --btn-save-border-color           | The border color that should be used for the save color buttons.                                                                   |
| --btn-save-bg-color               | The background color that should be used for the save color buttons.                                                               |
| --btn-save-color                  | The text color that should be used for the save color buttons.                                                                     |
| --btn-save-bg-hover-color         | The background color that should be used for the save color buttons when they are hovered.                                         |
| --btn-save-disabled-bg-color      | The background color that should be used for disabled the save color buttons.                                                      |

## Calendar

These are all the variables associated with changing how the calendar display looks within Simple Calendar.

| CSS Variable                           | Description                                                                                                                 |
|----------------------------------------|-----------------------------------------------------------------------------------------------------------------------------|
| --cal-weekend-bg-color                 | The background color for days that are considered rest days/the weekend.                                                    |
| --cal-day-border-color                 | The border color of days in the calendar.                                                                                   |
| --cal-day-hover-color                  | The color of a day in the calendar when it is hovered over.                                                                 |
| --cal-day-current-bg-color             | The background color for the current day.                                                                                   |
| --cal-day-current-box-shadow-color     | The box shadow color for the current day.                                                                                   |
| --cal-day-current-hover-bg-color       | The background color for the current day when it is hovered over.                                                           |
| --cal-day-selected-bg-color            | The background color for the selected day.                                                                                  |
| --cal-day-selected-box-shadow-color    | The box shadow color for the selected day.                                                                                  |
| --cal-day-selected-hover-bg-color      | The background color for the selected day when it is hovered over.                                                          |
| --cal-note-indicator-bg-color          | The background color for the indicator that shows there are notes on a specific day.                                        |
| --cal-note-reminder-indicator-bg-color | The background color for the indicator that shows there are notes on a specific day the players wants to be reminded about. |
| --cal-note-indicator-color             | The text color for the note indicators.                                                                                     |
| --cal-moon-group-bg-color              | The background color for the moon group popup that appears when there are too many moons to show directly on the calendar.  |
| --cal-moon-group-border-color          | The border color for the moon group popup that appears when there are too many moons to show directly on the calendar.      |
| --cal-moon-group-box-shadow-color      | The box shadow color for the moon group popup that appears when there are too many moons to show directly on the calendar.  |
| --cal-moon-text-shadow                 | The text shadow color used when displaying moons on the calendar or in the moon group popup.                                |

## Calendar List

These are all the variables associated with changing how the list of calendars appears within Simple Calendar.

| CSS Variable                   | Description                                                                                                                   |
|--------------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| --cal-list-color               | The text color to use for the calendar list.                                                                                  |
| --cal-list-active-border-color | The border color of the currently active calendar in the list.                                                                |
| --cal-list-active-bg-color     | The background color of the currently active calendar in the list.                                                            |
| --cal-list-visible-bg-color    | The background color of the calendar currently being viewed, if different from the active calendar, in the list of calendars. |
| --cal-list-bg-hover-color      | The background color of the calendar currently being viewed in the list of calendars when it is hovered over.                 |

## Clock

These are all the variables associated with changing how the clock appears in Simple Calendar.

| CSS Variable          | Description                                                      |
|-----------------------|------------------------------------------------------------------|
| --clock-started-color | The color of the clock icon when the real time clock is running. |
| --clock-stopped-color | The color of the clock icon when the real time clock is stopped. |
| --clock-paused-color  | The color of the clock icon when the real time clock is paused.  |

## Configuration Dialog Menu

These are all the variables associated with changing how the configuration dialogs left menu looks.

| CSS Variable                              | Description                                                                           |
|-------------------------------------------|---------------------------------------------------------------------------------------|
| --config-menu-heading-color               | The text color of the headings in the configuration dialogs left menu.                |
| --config-menu-item-border-color           | The border color of the divider between items in the menu.                            |
| --config-menu-item-color                  | The text color of all items in the menu.                                              |
| --config-menu-item-hover-color            | The text color of items in the menu when they are hovered over.                       |
| --config-menu-item-hover-bg-color         | The background color of items in the menu when they are hovered over.                 |
| --config-menu-cal-settings-bg-color       | The background color of the menu section specific to the selected calendars settings. |
| --config-menu-cal-selector-bg-color       | The background color for the calendar selector dropdown.                              |
| --config-menu-cal-selector-hover-bg-color | The background color for the calendar selector dropdown when an item is hovered over. |
| --config-menu-cal-selector-color          | The text color for the calendar selector dropdown.                                    |
| --config-menu-cal-selector-hover-color    | The text color for the calendar selector when an item is hovered over.                |

## Context Menu

These are all the variables associated with changing how the context menu (right click/command click menu) appears within Simple Calendar.

| CSS Variable                      | Description                                                                                       |
|-----------------------------------|---------------------------------------------------------------------------------------------------|
| --context-menu-color              | The text color for the context menu.                                                              |
| --context-menu-border-color       | The border color for the context menu.                                                            |
| --context-menu-bg-color           | The background color for the context menu.                                                        |
| --context-menu-action-hover-color | The color of actionable items (links, buttons, side menus) in the context menu when hovered over. |
| --context-menu-divider-color      | The color of the divider line within the context menu.                                            |

## Font

These are all the variables associated with changing the fonts within Simple Calendar.

| CSS Variable          | Description                                                                          |
|-----------------------|--------------------------------------------------------------------------------------|
| --font-family         | This variable changes the font that is used throughout Simple Calendar.              |
| --heading-font-family | This variable changes the font that is used for headings throughout Simple Calendar. |

## Form Groups

These are all the variables associated with changing how form groups look within Simple Calendar.

| CSS Variable                    | Description                                                                                                                                       |
|---------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| --form-group-bg-color           | This variable changes the form group background color. These are the boxes around each setting in the configuration dialog.                       |
| --form-group-bg-hover-color     | This variable changes the form group background color when hovered over. These are the boxes around each setting in the configuration dialog.     |
| --form-group-border-color       | This variable changes the form group border color. These are the boxes around each setting in the configuration dialog.                           |
| --form-group-label-color        | This variable changes the form group setting name color. These are the boxes around each setting in the configuration dialog.                     |
| --form-group-help-color         | This variable changes the form group description/help text color. These are the boxes around each setting in the configuration dialog.            |
| --form-group-input-bg-color     | This variable changes the background color for the compact form group. These are used on the note sheet edit view.                                |
| --form-group-input-border-color | This variable changes the border color for the compact form group. These are used on the note sheet edit view.                                    |
| --form-group-input-color        | This variable changes the text color for the compact form group. These are used on the note sheet edit view.                                      |
| --form-group-help-icon-color    | This variable changes the text color for the help icon that appears on hover of a compact form group. These are used on the note sheet edit view. |

## Headings

These are all the variables associated with changing how headings look within Simple Calendar.

| CSS Variable                   | Description                                                                                                        |
|--------------------------------|--------------------------------------------------------------------------------------------------------------------|
| --heading-border-color         | This variable changes the color of the bottom border for headings.                                                 |
| --about-heading-border-color   | Tis variable changes the color of the bottom order for the main heading in the about section of the configuration. |

## Inputs

These are all the variables associated with changing how inputs (text, numeric, selects, etc.) look within Simple Calendar.

| CSS Variable                   | Description                                                                           |
|--------------------------------|---------------------------------------------------------------------------------------|
| --input-bg-color               | This variable changes the background color of all inputs (text, numeric select, etc). |
| --input-border-color           | This variable changes the border color of all inputs (text, numeric select, etc).     |
| --input-color                  | This variable changes the text color of all inputs (text, numeric select, etc).       |

## Links

These are all the variables associated with changing how links and entity links (links to entities within Foundry VTT like journals, actors etc.) look within Simple Calendar.

| CSS Variable                   | Description                                                                                        |
|--------------------------------|----------------------------------------------------------------------------------------------------|
| --link-color                   | This variable changes the color of hyper links.                                                    |
| --link-hover-color             | This variable changes the color of hyper links when they are hovered over.                         |
| --entity-link-bg-color         | This variable changes the background color of entity links.                                        |
| --entity-link-border-color     | This variable changes the border color of entity links.                                            |
| --entity-link-icon-color       | This variable changes the color of the icon shown with the entity link.                            |
| --entity-link-icon-hover-color | This variable changes the color of the icon shown with the entity link when the entity is hovered. |

## Messages

These are all the variables associated with changing how message alerts appear within Simple Calendar.

| CSS Variable                   | Description                                                 |
|--------------------------------|-------------------------------------------------------------|
| --message-color                | This variable changes the text color of all messages.       |
| --message-warn-bg-color        | This variable changes the warning message background color. |
| --message-warn-border-color    | This variable changes the warning message border color.     |
| --message-success-bg-color     | This variable changes the success message background color. |
| --message-success-border-color | This variable changes the success message border color.     |
| --message-info-bg-color        | This variable changes the info message background color.    |
| --message-info-border-color    | This variable changes the info message border color.        |
| --message-danger-bg-color      | This variable changes the danger message background color.  |
| --message-danger-border-color  | This variable changes the danger message border color.      |

## Multi Select

These are all the variables associated with changing how the multi select controls appear within Simple Calendar.

| CSS Variable                         | Description                                                                   |
|--------------------------------------|-------------------------------------------------------------------------------|
| --multi-select-option-bg-color       | This variable changes the multi selects option background color.              |
| --multi-select-option-bg-hover-color | This variable changes the multi selects option background color when hovered. |
| --multi-select-option-border-color   | This variable changes the multi selects option border color.                  |
| --multi-select-option-color          | This variable changes the multi selects option text color.                    |
| --multi-select-disabled-bg-color     | This variable changes the multi selects disabled option background color.     |
| --multi-select-disabled-color        | This variable changes the multi selects disabled option text color.           |

## Note Category

These are all the variables associated with changing how note category pills appear within Simple Calendar.

| CSS Variable                  | Description                                                                             |
|-------------------------------|-----------------------------------------------------------------------------------------|
| --note-cat-color              | This variable changes the default category text color.                                  |
| --note-cat-bg-color           | This variable changes the default category background color.                            |
| --note-cat-box-shadow-color   | This variable changes the category box shadow color.                                    |
| --note-cat-secondary-bg-color | This variable changes the category background color for ones using the secondary color. |
| --note-cat-secondary-color    | This variable changes the category text color for ones using the secondary color.       |
| --note-cat-success-bg-color   | This variable changes the category background color for ones using the success color.   |
| --note-cat-success-color      | This variable changes the category text color for ones using the success color.         |
| --note-cat-danger-bg-color    | This variable changes the category background color for ones using the danger color.    |
| --note-cat-danger-color       | This variable changes the category text color for ones using the danger color.          |
| --note-cat-reminder-bg-color  | This variable changes the category background color for the reminder indicator.         |
| --note-cat-reminder-color     | This variable changes the category text color for the reminder indicator.               |

## Note List

These are all the variables associated with changing how the note list appears within Simple Calendar.

| CSS Variable                              | Description                                                                                     |
|-------------------------------------------|-------------------------------------------------------------------------------------------------|
| --note-list-note-border-color             | This variable changes the border color of the note list.                                        |
| --note-list-note-bg-hover-color           | This variable changes the background color of a note in the note list when the note is hovered. |
| --note-list-note-hover-color              | This variable changes the text color of a note in the note list when the note is hovered.       |
| --note-list-note-dragger-bg-color         | This variable changes the background color of the dragger indicator.                            |
| --note-list-note-dragger-box-shadow-color | This variable changes the box shadow color of the dragger indicator.                            |

## Note Sheet

These are all the variables associated with changing how the note sheet appears.

| CSS Variable                               | Description                                                                                           |
|--------------------------------------------|-------------------------------------------------------------------------------------------------------|
| --note-sheet-page-list-border-color        | This variable changes the border color of the page list panel.                                        |
| --note-sheet-page-list-page-hover-bg-color | This variable changes the background color of a page when it is hovered or the currently active page. |

## Predefined Calendar Picker

These are all the variables associated with changing how the predefined calendar chooser looks.

| CSS Variable                 | Description                                                                                    |
|------------------------------|------------------------------------------------------------------------------------------------|
| --pre-cal-color              | This variable changes the text color of a predefined calendar.                                 |
| --pre-cal-border-color       | This variable changes the border color of a predefined calendar.                               |
| --pre-cal-border-hover-color | This variable changes the border color of a predefined calendar when that calendar is hovered. |
| --precal-hover-color         | This variable changes the text color of a predefined calendar when that calendar is hovered.   |

## Progress Bar

These are all te variables associated with changing how the progress bar looks.

| CSS Variable                | Description                                                                          |
|-----------------------------|--------------------------------------------------------------------------------------|
| --progress-bar-bg-color     | This variable changes background color for the unfilled portion of the progress bar. |
| --progress-bar-border-color | This variable changes border color for the progress bar.                             |
| --progress-bar-fill-color   | This variable changes background color for the filled portion of the progress bar.   |

## ProseMirror

These are all the variables associated with changing how the ProseMirror text editor looks within Note Sheets for Simple Calendar.

| CSS Variable                         | Description                                                                                     |
|--------------------------------------|-------------------------------------------------------------------------------------------------|
| --editor-color                       | This variable changes the text color for the editor.                                            |
| --editor-menu-bg-color               | This variable changes background color of the editor menu.                                      |
| --editor-menu-control-bg-color       | This variable changes background color of buttons/selects in the editor menu.                   |
| --editor-menu-control-bg-hover-color | This variable changes background color of buttons/selects in the editor menu when hovered over. |

## Scrollbar

These are all the variables associated with changing how the scrollbar looks within Simple Calendar.

| CSS Variable                 | Description                                                             |
|------------------------------|-------------------------------------------------------------------------|
| --scrollbar-background-color | The background color of the scrollbar thumb.                            |
| --scrollbar-border-color     | The border color of the scrollbar thumb.                                |
| --scrollbar-track-bg-color   | The background color of the scrollbar track.                            |
| --scrollbar-track-border     | The border CSS property for the scrollbar track. eg `1px solid green`   |
| --scrollbar-button-height    | The height of the scrollbar buttons.                                    |
| --scrollbar-button-bg-color  | The background color of the scrollbar buttons.                          |
| --scrollbar-button-border    | The border CSS property for the scrollbar buttons. eg `1px solid green` |

## Search Box

These are all the variables associated with changing how the search boxes look within Simple Calendar.

| CSS Variable                   | Description                                                                  |
|--------------------------------|------------------------------------------------------------------------------|
| --search-box-placeholder-color | This variable changes the text color of placeholder text for the search box. |
| --search-box-color             | This variable changes the text color for the search box.                     |

## Side Drawer

These are all the variables associated with changing how side drawers (Note List, Search and Page List) look within Simple Calendar.

| CSS Variable                | Description                                                                                                                      |
|-----------------------------|----------------------------------------------------------------------------------------------------------------------------------|
| --side-drawer-color         | The text color for the side drawers.                                                                                             |
| --side-drawer-bg-color      | The background color of the side drawers.                                                                                        |
| --side-drawer-bg-image      | The background image of the side drawers. Links to images need to be wrapped in `url('')`. Choose `unset` if no image is wanted. |
| --side-drawer-border-color  | The border color of the side drawers.                                                                                            |
| --side-drawer-border-image  | The border image of the side drawers. Links to images need to be wrapped in `url('')`. Choose `unset` if no image is wanted.     |

## Time Selector

These are all the variables associated with changing how the time selector, When choosing a date and time or just a time, looks in Simple Calendar.

| CSS Variable                          | Description                                                                                                      |
|---------------------------------------|------------------------------------------------------------------------------------------------------------------|
| --time-selector-color                 | This variable changes the text color of the time selector.                                                       |
| --time-selector-input-bg-color        | This variable changes the background color of the time selector.                                                 |
| --time-selector-input-border-color    | This variable changes the border color for the time selector.                                                    |
| --time-selector-option-bg-even-color  | This variable changes the background color for every even option in the time selector drop down.                 |
| --time-selector-option-hover-bg-color | This variable changes the background color for the options in the time selector drop down then they are hovered. |

## Toggle

These are all the variables associated with changing how toggles look within Simple Calendar.

| CSS Variable              | Description                                                                                                                                               |
|---------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| --toggle-unchecked-image  | The image to use when the toggle is considered unchecked/inactive. Links to images need to be wrapped in `url('')`. Choose `unset` if no image is wanted. |
| --toggle-checked-image    | The image to use when the toggle is considered checked/active. Links to images need to be wrapped in `url('')`. Choose `unset` if no image is wanted.     |
| --toggle-border-color     | The border color for the toggle.                                                                                                                          |
| --toggle-checked-bg-color | The background color of the toggle when it is considered checked/active.                                                                                  |
