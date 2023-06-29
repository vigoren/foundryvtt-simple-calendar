/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
      "configSidebar": [
        "installing",
        "opening-configuration",
        {
          "type": "category",
          "label": "Global Configuration",
          "link": {
            "type": "generated-index",
            "title": "Global Configuration",
            "description": "The global configuration are settings that apply generally across Simple Calendar and are not specific to a calendar."
          },
          "items": [
            "global-configuration/settings",
            "global-configuration/permissions",
            "global-configuration/import-export"
          ]
        },
        {
          "type": "category",
          "label": "Calendar Configuration",
          "link": {
            "type": "generated-index",
            "title": "Calendar Configuration",
            "description": "The calendar configuration are settings that apply to a specific calendar. This allows the creation of multiple calendars with unique configurations!"
          },
          "items": [
            "calendar-configuration/add-remove-switch-calendar",
            "calendar-configuration/quick-setup",
            "calendar-configuration/general-settings",
            "calendar-configuration/display-options",
            "calendar-configuration/year-settings",
            "calendar-configuration/month-settings",
            "calendar-configuration/weekday-settings",
            "calendar-configuration/leap-year-settings",
            "calendar-configuration/season-settings",
            "calendar-configuration/moon-settings",
            "calendar-configuration/time-settings",
            "calendar-configuration/note-settings"
          ]
        }
      ],
      "usingSidebar": [
        {
          "type": "category",
          "label": "Using Simple Calendar",
          "link": {
            "type": "generated-index",
            "title": "Using Simple Calendar",
            "description": "Simple Calendar is designed to be as intuitive to use as possible but it can be customized in many ways. The sections below help layout how to use the module and its different features!"
          },
          "collapsed": false,
          "items": [
            "using-sc/opening-sc",
            "using-sc/calendar-view",
            "using-sc/compact-view",
            {
              "type": "category",
              "label": "Notes",
              "link": {
                "type": "doc",
                "id": "using-sc/notes/index"
              },
              "items": [
                "using-sc/notes/adding",
                "using-sc/notes/editing",
                "using-sc/notes/removing",
                "using-sc/notes/searching"
              ]
            },
            "using-sc/changing-date-time",
            "using-sc/switching-calendars"
          ]
        },
        "using-sc/client-settings",
        "using-sc/themes"
      ],
      "devSidebar": [
        "developing-with-sc/index",
        {
          "type": "category",
          "label": "API",
          "link": {
            "type": "doc",
            "id": "developing-with-sc/api/namespaces/SimpleCalendar"
          },
          "items": [
            {
              "type": "category",
              "label": "SimpleCalendar.api",
              "link": {
                "type": "doc",
                "id": "developing-with-sc/api/namespaces/SimpleCalendar.api"
              },
              "items": [
                "developing-with-sc/api/enums/SimpleCalendar.api.Calendars",
                "developing-with-sc/api/enums/SimpleCalendar.api.CompactViewDateTimeControlDisplay",
                "developing-with-sc/api/enums/SimpleCalendar.api.GameWorldTimeIntegrations",
                "developing-with-sc/api/enums/SimpleCalendar.api.Icons",
                "developing-with-sc/api/enums/SimpleCalendar.api.LeapYearRules",
                "developing-with-sc/api/enums/SimpleCalendar.api.MoonYearResetOptions",
                "developing-with-sc/api/enums/SimpleCalendar.api.NoteRepeat",
                "developing-with-sc/api/enums/SimpleCalendar.api.PresetTimeOfDay",
                "developing-with-sc/api/enums/SimpleCalendar.api.YearNamingRules"
              ]
            },
            {
              "type": "category",
              "label": "SimpleCalendar.Hooks",
              "link": {
                "type": "doc",
                "id": "developing-with-sc/api/namespaces/SimpleCalendar.Hooks"
              },
              "items": [
                "developing-with-sc/api/interfaces/SimpleCalendar.Hooks.DateChangeResponse",
                "developing-with-sc/api/interfaces/SimpleCalendar.Hooks.IsPrimaryGmResponse"
              ]
            },
            "developing-with-sc/api/enums/HandlebarHelpers",
            {
              "type": "category",
              "label": "Interfaces",
              "items": [
                {
                  "type": "autogenerated",
                  "dirName": "developing-with-sc/api/interfaces"
                }
              ]
            }
          ]
        },
        "developing-with-sc/theming"
      ]
    }
;

module.exports = sidebars;
