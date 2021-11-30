import {
    CalendarConfiguration, CurrentDateConfig, GeneralSettingsConfig,
    LeapYearConfig,
    MonthConfig, MoonConfiguration, NoteCategory, SeasonConfiguration,
    TimeConfig,
    WeekdayConfig,
    YearConfig
} from "../../interfaces";
import {SettingNames} from "../../constants";
import {GameSettings} from "../foundry-interfacing/game-settings";
import Calendar from "../calendar";

export default class V1ToV2{
    public static runCalendarMigration() : Calendar | null {
        //Create a calendar configuration with the legacy settings
        const legacySettings: CalendarConfiguration = {
            id: 'default',
            name: 'Default',
            currentDate: <CurrentDateConfig>GameSettings.GetObjectSettings(SettingNames.CurrentDate),
            general: <GeneralSettingsConfig>GameSettings.GetObjectSettings(SettingNames.GeneralConfiguration),
            leapYear: <LeapYearConfig>GameSettings.GetObjectSettings(SettingNames.LeapYearRule),
            months: <MonthConfig[]>GameSettings.GetObjectSettings(SettingNames.MonthConfiguration),
            moons: <MoonConfiguration[]>GameSettings.GetObjectSettings(SettingNames.MoonConfiguration),
            noteCategories: <NoteCategory[]>GameSettings.GetObjectSettings(SettingNames.NoteCategories),
            seasons: <SeasonConfiguration[]>GameSettings.GetObjectSettings(SettingNames.SeasonConfiguration),
            time: <TimeConfig>GameSettings.GetObjectSettings(SettingNames.TimeConfiguration),
            weekdays: <WeekdayConfig[]>GameSettings.GetObjectSettings(SettingNames.WeekdayConfiguration),
            year: <YearConfig>GameSettings.GetObjectSettings(SettingNames.YearConfiguration)
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
}