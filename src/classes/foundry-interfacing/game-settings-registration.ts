import { ModuleName, SettingNames } from "../../constants";
import ConfigurationApp from "../applications/configuration-app";
import { CalManager, SC } from "../index";
import { GameSettings } from "./game-settings";
import SCController from "../s-c-controller";
import { GetThemeList } from "../utilities/visual";
import MainAppConfigWrapper from "../applications/main-app-config-wrapper";

export default class GameSettingsRegistration {
    /**
     * Register the settings this module needs to use with the game
     */
    static Register() {
        // -------------------
        // Client Settings
        // -------------------
        (<Game>game).settings.register(ModuleName, `${(<Game>game).world.id}.${SettingNames.Theme}`, {
            name: "FSC.Configuration.Theme.Title",
            hint: "FSC.Configuration.Theme.Description",
            scope: "client",
            config: true,
            type: String,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            choices: GetThemeList(),
            default: "",
            onChange: SCController.ThemeChange.bind(SCController)
        });
        (<Game>game).settings.register(ModuleName, SettingNames.Theme, {
            name: "FSC.Configuration.Theme.Title",
            hint: "FSC.Configuration.Theme.Description",
            scope: "client",
            config: false,
            type: String,
            default: "dark"
        });
        (<Game>game).settings.register(ModuleName, SettingNames.OpenOnLoad, {
            name: "FSC.Configuration.Client.OpenOnLoad.Title",
            hint: "FSC.Configuration.Client.OpenOnLoad.Description",
            scope: "client",
            config: true,
            type: Boolean,
            default: true
        });
        (<Game>game).settings.register(ModuleName, SettingNames.OpenCompact, {
            name: "FSC.Configuration.Client.OpenCompact.Title",
            hint: "FSC.Configuration.Client.OpenCompact.Description",
            scope: "client",
            config: true,
            type: Boolean,
            default: false
        });
        (<Game>game).settings.register(ModuleName, SettingNames.RememberPosition, {
            name: "FSC.Configuration.Client.RememberPosition.Title",
            hint: "FSC.Configuration.Client.RememberPosition.Description",
            scope: "client",
            config: true,
            type: Boolean,
            default: true
        });
        (<Game>game).settings.register(ModuleName, SettingNames.RememberCompactPosition, {
            name: "FSC.Configuration.Client.RememberCompactPosition.Title",
            hint: "FSC.Configuration.Client.RememberCompactPosition.Description",
            scope: "client",
            config: true,
            type: Boolean,
            default: false
        });
        (<Game>game).settings.register(ModuleName, SettingNames.AppPosition, {
            name: "Application Position",
            hint: "",
            scope: "client",
            config: false,
            type: Object,
            default: {}
        });
        (<Game>game).settings.register(ModuleName, SettingNames.AppCompactPosition, {
            name: "Application Compact Position",
            hint: "",
            scope: "client",
            config: false,
            type: Object,
            default: {}
        });
        (<Game>game).settings.register(ModuleName, SettingNames.NoteReminderNotification, {
            name: "FSC.Configuration.Client.NoteReminderNotification.Title",
            hint: "FSC.Configuration.Client.NoteReminderNotification.Description",
            scope: "client",
            config: true,
            type: String,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            choices: {
                whisper: GameSettings.Localize("FSC.Configuration.Client.NoteReminderNotification.Whisper"),
                render: GameSettings.Localize("FSC.Configuration.Client.NoteReminderNotification.Render")
            },
            default: "whisper"
        });
        (<Game>game).settings.register(ModuleName, SettingNames.NoteListOpenDirection, {
            name: "FSC.Configuration.Client.NoteListOpenDirection.Title",
            hint: "FSC.Configuration.Client.NoteListOpenDirection.Description",
            scope: "client",
            config: true,
            type: String,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            choices: {
                "sc-right": GameSettings.Localize("FSC.Right"),
                "sc-left": GameSettings.Localize("FSC.Left"),
                "sc-down": GameSettings.Localize("FSC.Down")
            },
            default: "sc-right",
            onChange: SCController.SideDrawerDirectionChange.bind(SCController)
        });
        (<Game>game).settings.register(ModuleName, SettingNames.AlwaysShowNoteList, {
            name: "FSC.Configuration.Client.AlwaysShowNoteList.Title",
            hint: "FSC.Configuration.Client.AlwaysShowNoteList.Description",
            scope: "client",
            config: true,
            type: Boolean,
            default: false,
            onChange: SCController.AlwaysShowNoteListChange.bind(SCController)
        });
        (<Game>game).settings.register(ModuleName, SettingNames.PersistentOpen, {
            name: "FSC.Configuration.Client.PersistentOpen.Title",
            hint: "FSC.Configuration.Client.PersistentOpen.Description",
            scope: "client",
            config: true,
            type: Boolean,
            default: false,
            onChange: SC.PersistenceChange.bind(SC)
        });
        (<Game>game).settings.register(ModuleName, SettingNames.CompactViewScale, {
            name: "FSC.Configuration.Client.CompactViewScale.Title",
            hint: "FSC.Configuration.Client.CompactViewScale.Description",
            scope: "client",
            config: true,
            type: Number,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            range: {
                min: 70,
                max: 200,
                step: 10
            },
            default: 100,
            onChange: SC.CompactScaleChange.bind(SC)
        });

        // -------------------
        // Configuration Button
        // -------------------
        (<Game>game).settings.registerMenu(ModuleName, SettingNames.CalendarMainApp, {
            name: "",
            label: "FSC.Title",
            hint: "",
            icon: "fa fa-calendar",
            type: MainAppConfigWrapper
        });
        (<Game>game).settings.registerMenu(ModuleName, SettingNames.CalendarConfigurationMenu, {
            name: "",
            label: "FSC.Configuration.Title",
            hint: "",
            icon: "fa fa-cog",
            type: ConfigurationApp
        });
        // -------------------
        // Core Settings
        // -------------------
        (<Game>game).settings.register(ModuleName, SettingNames.CalendarConfiguration, {
            name: "Calendar Configuration",
            scope: "world",
            config: false,
            type: Array,
            default: [],
            onChange: CalManager.loadCalendars.bind(CalManager)
        });
        (<Game>game).settings.register(ModuleName, SettingNames.ActiveCalendar, {
            name: "Active Calendar",
            scope: "world",
            config: false,
            type: String,
            default: "default",
            onChange: CalManager.loadActiveCalendar.bind(CalManager)
        });
        (<Game>game).settings.register(ModuleName, SettingNames.GlobalConfiguration, {
            name: "Global Configuration",
            scope: "world",
            config: false,
            type: Object,
            default: {},
            onChange: SC.load.bind(SC)
        });

        // -------------------
        // Legacy Settings
        // -------------------
        (<Game>game).settings.register(ModuleName, SettingNames.GeneralConfiguration, {
            name: "General Configuration",
            scope: "world",
            config: false,
            type: Object,
            default: {}
        });
        (<Game>game).settings.register(ModuleName, SettingNames.YearConfiguration, {
            name: "Year Configuration",
            scope: "world",
            config: false,
            type: Object,
            default: {}
        });
        (<Game>game).settings.register(ModuleName, SettingNames.WeekdayConfiguration, {
            name: "Weekday Configuration",
            scope: "world",
            config: false,
            type: Array,
            default: []
        });
        (<Game>game).settings.register(ModuleName, SettingNames.MonthConfiguration, {
            name: "Month Configuration",
            scope: "world",
            config: false,
            type: Array,
            default: []
        });
        (<Game>game).settings.register(ModuleName, SettingNames.CurrentDate, {
            name: "Current Date",
            scope: "world",
            config: false,
            type: Object,
            default: {}
        });
        (<Game>game).settings.register(ModuleName, SettingNames.LeapYearRule, {
            name: "Leap Year Rule",
            scope: "world",
            config: false,
            type: Object,
            default: {}
        });
        (<Game>game).settings.register(ModuleName, SettingNames.DefaultNoteVisibility, {
            name: "FSC.Configuration.DefaultNoteVisibility",
            hint: "FSC.Configuration.DefaultNoteVisibilityHint",
            scope: "world",
            type: Boolean,
            default: false
        });
        (<Game>game).settings.register(ModuleName, SettingNames.Notes, {
            name: "Notes",
            scope: "world",
            config: false,
            type: Array,
            default: []
        });
        (<Game>game).settings.register(ModuleName, SettingNames.TimeConfiguration, {
            name: "Time",
            scope: "world",
            config: false,
            type: Object,
            default: {}
        });
        (<Game>game).settings.register(ModuleName, SettingNames.SeasonConfiguration, {
            name: "Season Configuration",
            scope: "world",
            config: false,
            type: Array,
            default: []
        });
        (<Game>game).settings.register(ModuleName, SettingNames.MoonConfiguration, {
            name: "Moon Configuration",
            scope: "world",
            config: false,
            type: Array,
            default: []
        });
        (<Game>game).settings.register(ModuleName, SettingNames.NoteCategories, {
            name: "Note Categories",
            scope: "world",
            config: false,
            type: Array,
            default: [{ name: "Holiday", color: "#148e94", textColor: "#FFFFFF" }]
        });
    }
}
