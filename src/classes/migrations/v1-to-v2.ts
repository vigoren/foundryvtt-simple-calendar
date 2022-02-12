import {SettingNames} from "../../constants";
import {GameSettings} from "../foundry-interfacing/game-settings";
import Calendar from "../calendar";
import UserPermissions from "../configuration/user-permissions";
import {SC} from "../index";

/**
 * Class for handling the migration from Simple Calendar V1 to V2
 */
export default class V1ToV2{

    /**
     * Migrates the old calendar settings to the new calendar settings.
     */
    public static runCalendarMigration() : Calendar | null {
        //Create a calendar configuration with the legacy settings
        const legacySettings: SimpleCalendar.CalendarData = {
            id: 'default',
            name: 'Default',
            currentDate: <SimpleCalendar.CurrentDateData>GameSettings.GetObjectSettings(SettingNames.CurrentDate),
            general: <SimpleCalendar.GeneralSettingsData>GameSettings.GetObjectSettings(SettingNames.GeneralConfiguration),
            leapYear: <SimpleCalendar.LeapYearData>GameSettings.GetObjectSettings(SettingNames.LeapYearRule),
            months: <SimpleCalendar.MonthData[]>GameSettings.GetObjectSettings(SettingNames.MonthConfiguration),
            moons: <SimpleCalendar.MoonData[]>GameSettings.GetObjectSettings(SettingNames.MoonConfiguration),
            noteCategories: <SimpleCalendar.NoteCategory[]>GameSettings.GetObjectSettings(SettingNames.NoteCategories),
            seasons: <SimpleCalendar.SeasonData[]>GameSettings.GetObjectSettings(SettingNames.SeasonConfiguration),
            time: <SimpleCalendar.TimeData>GameSettings.GetObjectSettings(SettingNames.TimeConfiguration),
            weekdays: <SimpleCalendar.WeekdayData[]>GameSettings.GetObjectSettings(SettingNames.WeekdayConfiguration),
            year: <SimpleCalendar.YearData>GameSettings.GetObjectSettings(SettingNames.YearConfiguration)
        };
        //Create a new calendar loading the legacy settings
        const newCalendar = new Calendar('default', 'Default', legacySettings);
        //Validate the new calendar. As long as the months have a length the calendar should be valid
        let isValid = false;
        if(newCalendar.year && newCalendar.year.months.length){
            isValid = true;
        }
        return isValid ? newCalendar : null;
    }

    /**
     * Migrates the old permissions and general settings to the new global configuration
     */
    public static runGlobalConfigurationMigration(): boolean {
        const oldGeneralConfig = <any>GameSettings.GetObjectSettings(SettingNames.GeneralConfiguration);
        const oldTimeConfig = <any>GameSettings.GetObjectSettings(SettingNames.TimeConfiguration);

        let perms = false, settings = false;

        //Parse the old permissions and save them in the new format
        if(oldGeneralConfig.hasOwnProperty('permissions') && oldGeneralConfig['permissions']){
            const permissions = new UserPermissions();
            permissions.loadFromSettings(oldGeneralConfig['permissions']);
            permissions.changeActiveCalendar = {player: false, trustedPlayer: false, assistantGameMaster: false, users: undefined};

            SC.globalConfiguration.permissions = permissions;
            perms = true;
        }

        //Parse out the seconds per combat round and save them in the new format
        if(oldTimeConfig.hasOwnProperty('secondsInCombatRound') && oldTimeConfig['secondsInCombatRound']){
            const sICR = parseInt(oldTimeConfig['secondsInCombatRound'].toString());
            if(!isNaN(sICR)){
                SC.globalConfiguration.secondsInCombatRound = sICR;
                settings = true;
            }
        }
        return perms && settings;
    }

    public static runNoteMigration(): boolean {
        return true;
    }

    public static async cleanUpOldData(): Promise<boolean> {
        const gcRes = await GameSettings.SaveObjectSetting(SettingNames.GeneralConfiguration, {});
        const ycRes = await GameSettings.SaveObjectSetting(SettingNames.YearConfiguration, {});
        const wcRes = await GameSettings.SaveObjectSetting(SettingNames.WeekdayConfiguration, []);
        const mcRes = await GameSettings.SaveObjectSetting(SettingNames.MonthConfiguration, []);
        const cdRes = await GameSettings.SaveObjectSetting(SettingNames.CurrentDate, {});
        const lyrRes = await GameSettings.SaveObjectSetting(SettingNames.LeapYearRule, {});
        const tcRes = await GameSettings.SaveObjectSetting(SettingNames.TimeConfiguration, {});
        const scRes = await GameSettings.SaveObjectSetting(SettingNames.SeasonConfiguration, []);
        const moonRes = await GameSettings.SaveObjectSetting(SettingNames.MoonConfiguration, []);
        const nRes = await GameSettings.SaveObjectSetting(SettingNames.Notes, []);
        const ncRes = await GameSettings.SaveObjectSetting(SettingNames.NoteCategories, []);

        return gcRes && ycRes && wcRes && mcRes && cdRes && lyrRes && tcRes && scRes && moonRes && nRes && ncRes;
    }
}