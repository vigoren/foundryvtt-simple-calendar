import {ModuleName, SettingNames} from "../../constants";
import {ConfigurationApp} from "../applications/configuration-app";
import {CalManager} from "../index"

export default class GameSettingsRegistration{
    /**
     * Register the settings this module needs to use with the game
     */
    static Register(){
        // -------------------
        // Client Settings
        // -------------------
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
        (<Game>game).settings.register(ModuleName, SettingNames.AppPosition, {
            name: "Application Position",
            hint: "",
            scope: "client",
            config: false,
            type: Object,
            default: {}
        });
        // -------------------
        // Configuration Button
        // -------------------
        (<Game>game).settings.registerMenu(ModuleName, SettingNames.CalendarConfigurationMenu, {
            name: "",
            label: "FSC.Configuration.Title",
            hint: "",
            icon: "fa fa-cog",
            type: ConfigurationApp,
            restricted: true
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


        // -------------------
        // Legacy Settings
        // -------------------
        (<Game>game).settings.register(ModuleName, SettingNames.GeneralConfiguration, {
            name: "General Configuration",
            scope: "world",
            config: false,
            type: Object
        });
        (<Game>game).settings.register(ModuleName, SettingNames.YearConfiguration, {
            name: "Year Configuration",
            scope: "world",
            config: false,
            type: Object
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
            type: Object
        });
        (<Game>game).settings.register(ModuleName, SettingNames.LeapYearRule, {
            name: "Leap Year Rule",
            scope: "world",
            config: false,
            type: Object
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
            default: [{name: "Holiday", color: "#148e94", textColor: "#FFFFFF"}]
        });
    }
}