import {SettingNames} from "../../constants";
import {GameSettings} from "../foundry-interfacing/game-settings";
import Calendar from "../calendar";
import UserPermissions from "../configuration/user-permissions";
import {CalManager, NManager, SC} from "../index";
import {deepMerge} from "../utilities/object";

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

        //Month and Day storage changed from actual number to index so need to adjust the current date, seasons and moons
        if(legacySettings.months){
            if(legacySettings.currentDate){
                legacySettings.currentDate.month = legacySettings.months.findIndex(m => m.numericRepresentation === legacySettings.currentDate?.month);
                if(legacySettings.currentDate.month < 0){
                    legacySettings.currentDate.month = 0;
                }
                legacySettings.currentDate.day--;
            }
            if(legacySettings.seasons){
                for(let i = 0; i < legacySettings.seasons.length; i++){
                    const monthNum = legacySettings.seasons[i].startingMonth;
                    legacySettings.seasons[i].startingMonth = legacySettings.months.findIndex(m => m.numericRepresentation === monthNum);
                    if(legacySettings.seasons[i].startingMonth < 0){
                        legacySettings.seasons[i].startingMonth = 0;
                    }
                    legacySettings.seasons[i].startingDay--;
                }
            }
            if(legacySettings.moons){
                for(let i = 0; i < legacySettings.moons.length; i++){
                    const monthNum = legacySettings.moons[i].firstNewMoon.month;
                    legacySettings.moons[i].firstNewMoon.month = legacySettings.months.findIndex(m => m.numericRepresentation === monthNum);
                    if(legacySettings.moons[i].firstNewMoon.month < 0){
                        legacySettings.moons[i].firstNewMoon.month = 0;
                    }
                    legacySettings.moons[i].firstNewMoon.day--;
                }
            }
        }

        //Create a new calendar loading the legacy settings
        const newCalendar = new Calendar('default', 'Default', legacySettings);
        //Validate the new calendar. As long as the months have a length the calendar should be valid
        let isValid = false;
        if(newCalendar.year && newCalendar.months.length){
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

    public static async runNoteMigration(): Promise<boolean> {
        const oldNotes = <any[]>GameSettings.GetObjectSettings(SettingNames.Notes);
        const calendar = CalManager.getActiveCalendar();
        for(let i = 0; i < oldNotes.length; i++){
            const oldNote = oldNotes[i];
            const newNoteData: SimpleCalendar.NoteData = {
                allDay: oldNote.allDay,
                calendarId: calendar.id,
                repeats: oldNote.repeats,
                order: oldNote.order,
                categories: oldNote.categories,
                remindUsers: oldNote.remindUsers,
                startDate: {
                    year: oldNote.year,
                    month: calendar.months.findIndex(m => m.numericRepresentation === oldNote.month),
                    day: oldNote.day - 1,
                    hour: oldNote.hour,
                    minute: oldNote.minute,
                    seconds: 0
                },
                endDate: {
                    year: oldNote.endDate.year,
                    month: calendar.months.findIndex(m => m.numericRepresentation === oldNote.endDate.month),
                    day: oldNote.endDate.day - 1,
                    hour: oldNote.endDate.hour,
                    minute: oldNote.endDate.minute,
                    seconds: 0
                }
            };
            if(newNoteData.startDate.month < 0){
                newNoteData.startDate.month = 0;
            }
            if(newNoteData.endDate.month < 0){
                newNoteData.endDate.month = 0;
            }

            const newJe = await NManager.createNote(oldNote.title, oldNote.content, newNoteData, calendar, false, false);
            if(newJe){
                const newPerms: Partial<Record<string, 0 | 1 | 2 | 3>> = {};
                Object.keys(newJe.data.permission).forEach(p => { newPerms[p] = p === oldNote.author? 3 : oldNote.playerVisible? 2 : 0 });
                await newJe.update({permission: newPerms})
            }
        }
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