import {SettingNames} from "../../constants";
import {GameSettings} from "../foundry-interfacing/game-settings";
import Calendar from "../calendar";


export default class V1ToV2{
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
}