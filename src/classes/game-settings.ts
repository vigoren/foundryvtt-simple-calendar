import Year from "./year";
import {Logger} from "./logging";
import {CurrentDateConfig, MonthConfig, YearConfig} from "../interfaces";
import {ModuleName, SettingNames} from "../constants";
import SimpleCalendar from "./simple-calendar";
import Month from "./month";

export class GameSettings {

    /**
     * Register the settings this module needs to use with the game
     */
    static RegisterSettings(){
        game.settings.register(ModuleName, SettingNames.YearConfiguration, {
            name: "Year Configuration",
            scope: "world",
            config: false,
            type: Object,
            onChange: SimpleCalendar.instance.loadYearConfiguration.bind(SimpleCalendar.instance, true)
        });
        game.settings.register(ModuleName, SettingNames.MonthConfiguration, {
            name: "Month Configuration",
            scope: "world",
            config: false,
            type: Array,
            default: [],
            onChange: SimpleCalendar.instance.loadMonthConfiguration.bind(SimpleCalendar.instance, true)
        });
        game.settings.register(ModuleName, SettingNames.CurrentDate, {
            name: "Current Date",
            scope: "world",
            config: false,
            type: Object,
            onChange: () => {
                SimpleCalendar.instance.loadMonthConfiguration();
                SimpleCalendar.instance.loadCurrentDate(true);
            }
        });
        game.settings.register(ModuleName, SettingNames.Notes, {
            name: "Notes",
            scope: "world",
            config: false,
            type: Array,
            onChange: SimpleCalendar.instance.loadNotes.bind(SimpleCalendar.instance, true)
        });
        game.settings.register(ModuleName, SettingNames.AllowPlayersToAddNotes, {
            name: "Allow Players to Add Notes",
            hint: "Allows any player to add a note to the calendar.",
            scope: "world",
            config: "true",
            type: Boolean,
            default: true
        });
    }

    /**
     *
     * @param year
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
     *
     * @param year
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

    static async SaveMonthConfiguration(months: Month[]): Promise<any> {
        if(game.user.isGM) {
            Logger.debug(`Saving month configuration.`);
            const currentConfig = <MonthConfig[]> game.settings.get(ModuleName, SettingNames.MonthConfiguration);
            const newConfig: MonthConfig[] = months.map(m => { return {  name: m.name, numericRepresentation: m.numericRepresentation, numberOfDays: m.days.length }; });
            if(currentConfig.length !== newConfig.length){
                return game.settings.set(ModuleName, SettingNames.MonthConfiguration, newConfig).then(() => {return true;});
            } else {
                Logger.debug('Month configuration has not changed, not updating settings');
            }
        }
        return false;
    }

}
