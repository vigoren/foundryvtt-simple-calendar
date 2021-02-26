import Year from "./year";
import {Logger} from "./logging";
import {CurrentDateConfig, MonthConfig, WeekdayConfig, YearConfig, NoteConfig, LeapYearConfig} from "../interfaces";
import {ModuleName, SettingNames} from "../constants";
import SimpleCalendar from "./simple-calendar";
import Month from "./month";
import {Weekday} from "./weekday";
import {Note} from "./note";
import LeapYear from "./leap-year";

export class GameSettings {
    /**
     * Returns if the current user is the GM
     * @return {boolean}
     */
    static IsGm(): boolean {
        return game.user.isGM;
    }

    /**
     * Returns the current users name
     * @return {string}
     */
    static UserName(): string {
        return game.user.name;
    }

    /**
     * Returns the current users ID
     * @return {string}
     */
    static UserID(): string {
        return game.user.id;
    }

    /**
     * Returns the localized string based on the key
     * @param {string} key The localization string key
     */
    static Localize(key: string): string {
        return game.i18n.localize(key);
    }

    /**
     * Register the settings this module needs to use with the game
     */
    static RegisterSettings(){
        game.settings.register(ModuleName, SettingNames.YearConfiguration, {
            name: "Year Configuration",
            scope: "world",
            config: false,
            type: Object,
            onChange: SimpleCalendar.instance.settingUpdate.bind(SimpleCalendar.instance, true)
        });
        game.settings.register(ModuleName, SettingNames.WeekdayConfiguration, {
            name: "Weekday Configuration",
            scope: "world",
            config: false,
            type: Array,
            default: [],
            onChange: SimpleCalendar.instance.settingUpdate.bind(SimpleCalendar.instance, true)
        });
        game.settings.register(ModuleName, SettingNames.MonthConfiguration, {
            name: "Month Configuration",
            scope: "world",
            config: false,
            type: Array,
            default: [],
            onChange: SimpleCalendar.instance.settingUpdate.bind(SimpleCalendar.instance, true)
        });
        game.settings.register(ModuleName, SettingNames.CurrentDate, {
            name: "Current Date",
            scope: "world",
            config: false,
            type: Object,
            onChange:  SimpleCalendar.instance.settingUpdate.bind(SimpleCalendar.instance, true)
        });
        game.settings.register(ModuleName, SettingNames.LeapYearRule, {
            name: "Leap Year Rule",
            scope: "world",
            config: false,
            type: Object,
            onChange: SimpleCalendar.instance.loadNotes.bind(SimpleCalendar.instance, true)
        });
        game.settings.register(ModuleName, SettingNames.DefaultNoteVisibility, {
            name: "FSC.Configuration.DefaultNoteVisibility",
            hint: "FSC.Configuration.DefaultNoteVisibilityHint",
            scope: "world",
            config: true,
            type: Boolean,
            default: false
        });
        game.settings.register(ModuleName, SettingNames.Notes, {
            name: "Notes",
            scope: "world",
            config: false,
            type: Array,
            default: [],
            onChange: SimpleCalendar.instance.loadNotes.bind(SimpleCalendar.instance, true)
        });
    }

    /**
     * Gets the default note visibility setting
     * @return {boolean}
     */
    static GetDefaultNoteVisibility(){
        return <boolean>game.settings.get(ModuleName, SettingNames.DefaultNoteVisibility);
    }

    /**
     * Loads the year configuration from the game world settings
     * @return {YearConfig}
     */
    static LoadYearData(): YearConfig {
        return game.settings.get(ModuleName, SettingNames.YearConfiguration);
    }

    /**
     * Loads the current date from the game world settings
     * @return {Array.<CurrentDateConfig>}
     */
    static LoadCurrentDate(): CurrentDateConfig {
        return game.settings.get(ModuleName,  SettingNames.CurrentDate);
    }

    /**
     * Loads the month configuration from the game world settings
     * @return {Array.<MonthConfig>}
     */
    static LoadMonthData(): MonthConfig[] {
        let returnData: MonthConfig[] = [];
        let monthData = <any[]>game.settings.get(ModuleName, SettingNames.MonthConfiguration);
        if(monthData && monthData.length) {
            if (Array.isArray(monthData[0])) {
                returnData = <MonthConfig[]>monthData[0];
            }
        }
        return returnData;
    }

    /**
     * Loads the weekday configuration from the game world settings
     * @return {Array.<WeekdayConfig>}
     */
    static LoadWeekdayData(): WeekdayConfig[] {
        let returnData: WeekdayConfig[] = [];
        let weekdayData = <any[]>game.settings.get(ModuleName, SettingNames.WeekdayConfiguration);
        if(weekdayData && weekdayData.length) {
            if (Array.isArray(weekdayData[0])) {
                returnData = <WeekdayConfig[]>weekdayData[0];
            }
        }
        return returnData;
    }

    static LoadLeapYearRules(): LeapYearConfig {
        return game.settings.get(ModuleName, SettingNames.LeapYearRule);
    }

    /**
     * Loads the notes from the game world settings
     * @return {Array.<NoteConfig>}
     */
    static LoadNotes(): NoteConfig[] {
        let returnData: NoteConfig[] = [];
        let notes = <any[]>game.settings.get(ModuleName, SettingNames.Notes);
        if(notes && notes.length) {
            if (Array.isArray(notes[0])) {
                returnData = <NoteConfig[]>notes[0];
            }
        }
        return returnData;
    }

    /**
     * Saves the current date to the world settings
     * @param {Year} year The year that has the current date
     */
    static async SaveCurrentDate(year: Year){
        if(game.user.isGM){
            Logger.debug(`Saving current date.`);
            const currentMonth = year.getCurrentMonth();
            if(currentMonth){
                const currentDay = currentMonth.getCurrentDay();
                if(currentDay){
                    const currentDate = <CurrentDateConfig> game.settings.get(ModuleName, SettingNames.CurrentDate);
                    const newDate: CurrentDateConfig = {
                        year: year.numericRepresentation,
                        month: currentMonth.numericRepresentation,
                        day: currentDay.numericRepresentation
                    };
                    if(currentDate.year !== newDate.year || currentDate.month !== newDate.month || currentDate.day !== newDate.day){
                        return game.settings.set(ModuleName, SettingNames.CurrentDate, newDate);
                    } else {
                        Logger.debug('Current Date data has not changed, not updating settings');
                    }
                } else {
                    Logger.error('Unable to save current date, no current day found.');
                }
            } else {
                Logger.error('Unable to save current date, no current month found.');
            }
        } else {
            Logger.error('Unable to save current date, no current year found.');
        }
        return false;
    }

    /**
     * Saves the passed in year configuration into the world settings
     * @param {Year} year The year that makes up the configuration
     */
    static async SaveYearConfiguration(year: Year): Promise<boolean> {
        if(game.user.isGM) {
            Logger.debug(`Saving year configuration.`);
            const currentYearConfig = <YearConfig> game.settings.get(ModuleName, SettingNames.YearConfiguration);
            const yc: YearConfig = {
                numericRepresentation: year.numericRepresentation,
                prefix: year.prefix,
                postfix: year.postfix
            };
            if(currentYearConfig.numericRepresentation !== yc.numericRepresentation || currentYearConfig.prefix !== yc.prefix || currentYearConfig.postfix !== yc.postfix){
                return game.settings.set(ModuleName, SettingNames.YearConfiguration, yc).then(() => { return true }); //Return true because if no error was thrown then the save was successful and we don't need the returned data.
            } else {
                Logger.debug('Year configuration has not changed, not updating settings');
            }
        }
        return false;
    }

    /**
     * Saves the passed in month configuration into the world settings
     * @param {Array.<Month>} months
     */
    static async SaveMonthConfiguration(months: Month[]): Promise<any> {
        if(game.user.isGM) {
            Logger.debug(`Saving month configuration.`);
            const newConfig: MonthConfig[] = months.map(m => { return {  name: m.name, numericRepresentation: m.numericRepresentation, numberOfDays: m.days.length }; });
            return game.settings.set(ModuleName, SettingNames.MonthConfiguration, newConfig).then(() => {return true;});
        }
        return false;
    }

    /**
     * Saves the passed in weekday configuration into the world settings
     * @param {Array.<Weekday>} weekdays The weekdays that make up the configuration
     */
    static async SaveWeekdayConfiguration(weekdays: Weekday[]): Promise<any> {
        if(game.user.isGM) {
            Logger.debug(`Saving weekday configuration.`);
            const newConfig: WeekdayConfig[] = weekdays.map(w => {return {name: w.name, numericRepresentation: w.numericRepresentation}; });
            return game.settings.set(ModuleName, SettingNames.WeekdayConfiguration, newConfig).then(() => {return true;});
        }
        return false;
    }

    static async SaveLeapYearRules(leapYear: LeapYear): Promise<any>{
        if(game.user.isGM) {
            Logger.debug(`Saving leap year configuration.`);
            const newlyc: LeapYearConfig = {
                rule: leapYear.rule,
                customMod: leapYear.customMod
            };
            return game.settings.set(ModuleName, SettingNames.LeapYearRule, newlyc);
        }
        return false;
    }

    /**
     * Saves the passed in notes into the world settings
     * @param {Array.<Note>} notes The notes to save
     */
    static async SaveNotes(notes: Note[]): Promise<any> {
        Logger.debug(`Saving notes.`);
        const newConfig: NoteConfig[] = notes.map(w => {return {
            title: w.title,
            content: w.content,
            author: w.author,
            year: w.year,
            month: w.month,
            day: w.day,
            monthDisplay: w.monthDisplay,
            playerVisible: w.playerVisible,
            id: w.id,
            repeats: w.repeats
        };});
        return game.settings.set(ModuleName, SettingNames.Notes, newConfig).then(() => {return true;});
    }

    /**
     * Display a notification using the game UI
     * @param {string} message The message to display
     * @param {string} type The type of notification to show
     */
    static UiNotification(message: string, type: string = 'info'){
        if(type === 'info'){
            ui.notifications.info(message);
        } else if(type === 'warn'){
            ui.notifications.warn(message);
        } else if(type === 'error'){
            ui.notifications.error(message);
        }
    }
}
