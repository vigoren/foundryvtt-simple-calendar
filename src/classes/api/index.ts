import {
    DateTime,
    LeapYearConfig,
    MonthConfig,
    MoonConfiguration,
    TimeConfig,
    WeekdayConfig,
    YearConfig
} from "../../interfaces";
import {Logger} from "../logging";
import {GameSettings} from "../foundry-interfacing/game-settings";
import {
    DateSelectorPositions,
    GameSystems,
    LeapYearRules,
    ModuleName,
    Icons,
    MoonYearResetOptions,
    PredefinedCalendars,
    PresetTimeOfDay,
    SettingNames,
    TimeKeeperStatus,
    YearNamingRules
} from "../../constants";
import PF2E from "../systems/pf2e";
import {DateToTimestamp, FormatDateTime, TimestampToDate} from "../utilities/date-time";
import DateSelectorManager from "../date-selector/date-selector-manager"
import PredefinedCalendar from "../configuration/predefined-calendar";
import Renderer from "../renderer";
import {MainApplication, CalManager, SC} from "../index";

/**
 * All external facing functions for other systems, modules or macros to consume
 */
export default class API{
    /**
     * The Date selector class used to create date selector inputs based on the calendar
     */
    public static DateSelector = {
        Activate: DateSelectorManager.ActivateSelector.bind(DateSelectorManager),
        Get: DateSelectorManager.GetSelector.bind(DateSelectorManager),
        Remove: DateSelectorManager.RemoveSelector.bind(DateSelectorManager)
    };

    /**
     * The different date selector positions available
     */
    public static DateSelectorPositions = DateSelectorPositions;
    /**
     * The predefined calendars packaged with the calendar
     */
    public static Calendars = PredefinedCalendars;
    /**
     * The leap year rules
     */
    public static LeapYearRules = LeapYearRules;
    /**
     * The Moon Icons
     */
    public static MoonIcons = Icons;
    /**
     * The moon year reset options
     */
    public static MoonYearResetOptions = MoonYearResetOptions;
    /**
     * The year naming rules
     */
    public static YearNamingRules = YearNamingRules;
    /**
     * The sun positions
     */
    public static PresetTimeOfDay = PresetTimeOfDay;


    /**
     * Activates listeners for month change and day clicks on the specified rendered calendar
     * @param {string} calendarId The ID of the HTML element representing the calendar to activate listeners for
     * @param {Function|null} onMonthChange Function to call when the month is changed
     * @param {Function|null} onDayClick Function to call when a day is clicked
     */
    public static activateFullCalendarListeners(calendarId: string, onMonthChange: Function | null = null, onDayClick: Function | null = null){
        Renderer.CalendarFull.ActivateListeners(calendarId, onMonthChange, onDayClick);
    }

    /**
     * Get the timestamp for the current year
     */
    public static timestamp(): number{
        return CalManager.getActiveCalendar().year.toSeconds();
    }

    /**
     * Takes in a current time stamp and adds the passed in interval to it and returns the new time stamp
     * @param currentSeconds
     * @param interval
     */
    public static timestampPlusInterval(currentSeconds: number, interval: DateTime): number{
        const activeCalendar = CalManager.getActiveCalendar();
        const clone = activeCalendar.year.clone();
        // If this is a Pathfinder 2E game, add the world creation seconds to the interval seconds
        if(activeCalendar.gameSystem === GameSystems.PF2E && activeCalendar.generalSettings.pf2eSync){
            currentSeconds += PF2E.getWorldCreateSeconds(activeCalendar);
        }

        const dateTime = clone.secondsToDate(currentSeconds);
        clone.updateTime(dateTime);
        if(interval.year){
            clone.changeYear(interval.year, false, 'current');
        }
        if(interval.month){
            //If a large number of months are passed in then
            if(interval.month > clone.months.length){
                let years = Math.floor(interval.month/clone.months.length);
                interval.month = interval.month - (years * clone.months.length);
                clone.changeYear(years, false, 'current');
            }
            clone.changeMonth(interval.month, 'current');
        }
        if(interval.day){
            clone.changeDayBulk(interval.day);
        }
        if(interval.hour && interval.hour > clone.time.hoursInDay){
            const days = Math.floor(interval.hour / clone.time.hoursInDay);
            interval.hour = interval.hour - (days * clone.time.hoursInDay);
            clone.changeDayBulk(days);
        }
        if(interval.minute && interval.minute > (clone.time.hoursInDay * clone.time.minutesInHour)){
            const days = Math.floor(interval.minute / (clone.time.hoursInDay * clone.time.minutesInHour));
            interval.minute = interval.minute - (days * (clone.time.hoursInDay * clone.time.minutesInHour));
            clone.changeDayBulk(days);
        }
        if(interval.second && interval.second > clone.time.secondsPerDay){
            const days = Math.floor(interval.second / clone.time.secondsPerDay);
            interval.second = interval.second - (days * clone.time.secondsPerDay);
            clone.changeDayBulk(days);
        }
        const dayChange = clone.time.changeTime(interval.hour, interval.minute, interval.second);
        if(dayChange !== 0){
            clone.changeDay(dayChange);
        }
        return clone.toSeconds();
    }

    /**
     * Takes in a timestamp in seconds and converts it to a date object.
     * @param seconds
     */
    public static timestampToDate(seconds: number){
        return TimestampToDate(seconds, CalManager.getActiveCalendar());
    }

    /**
     * Converts the passed in date to a timestamp. If date members are missing the current date members are used.
     * @param {DateTime} date
     */
    public static dateToTimestamp(date: DateTime): number{
        return DateToTimestamp(date, CalManager.getActiveCalendar());
    }

    /**
     * Attempts to convert the passed in seconds to an interval (day, month, year, hour, minute, second etc)
     * @param seconds
     */
    public static secondsToInterval(seconds: number): DateTime{
        return CalManager.getActiveCalendar().year.secondsToInterval(seconds);
    }

    /**
     * Returns the current status of the clock
     */
    public static clockStatus(){
        const status = CalManager.getActiveCalendar().year.time.timeKeeper.getStatus();
        return {
            started: status === TimeKeeperStatus.Started,
            stopped: status === TimeKeeperStatus.Stopped,
            paused: status === TimeKeeperStatus.Paused
        };
    }

    /**
     * Shows the calendar. If a date is passed in, the calendar will open so that date is visible and selected
     * @param {DateTime | null} [date=null] The date to set as visible, it not passed in what ever the users current date will be used
     * @param {boolean} [compact=false] If the calendar should open in compact mode or not
     */
    public static showCalendar(date: DateTime | null = null, compact: boolean = false){
        const activeCalendar = CalManager.getActiveCalendar();
        if(date !== null){
            if(!date.year){
                date.year = activeCalendar.year.numericRepresentation;
            }

            if(!date.month || !date.day){
                const curMonth = activeCalendar.year.getMonth();
                if(!date.month){
                    date.month = curMonth? activeCalendar.year.months.findIndex(m => m.numericRepresentation === curMonth.numericRepresentation) : 0;
                }

                if(!date.day){
                    if(curMonth){
                        const curDay = curMonth.getDay();
                        date.day = curDay? curMonth.days.findIndex(d => d.numericRepresentation === curDay.numericRepresentation) : 0;
                    } else {
                        date.day = 0;
                    }
                }
            }

            if(Number.isInteger(date.year) && Number.isInteger(date.month) && Number.isInteger(date.day)){
                const isLeapYear = activeCalendar.year.leapYearRule.isLeapYear(date.year);
                activeCalendar.year.visibleYear = date.year;
                if(date.month === -1 || date.month > activeCalendar.year.months.length){
                    date.month = activeCalendar.year.months.length - 1;
                }
                activeCalendar.year.resetMonths('visible');
                activeCalendar.year.months[date.month].visible = true;

                const numberOfDays = isLeapYear? activeCalendar.year.months[date.month].numberOfLeapYearDays : activeCalendar.year.months[date.month].numberOfDays;
                if(date.day > 0){
                    date.day = date.day - 1;
                }
                if(date.day == -1 || date.day > numberOfDays){
                    date.day = numberOfDays - 1;
                }
                activeCalendar.year.resetMonths('selected');
                activeCalendar.year.months[date.month].days[date.day].selected = true;
                activeCalendar.year.months[date.month].selected = true;
                activeCalendar.year.selectedYear = activeCalendar.year.visibleYear;
            } else {
                Logger.error('Main.api.showCalendar: Invalid date passed in.');
            }
        }
        MainApplication.uiElementStates.compactView = compact;
        MainApplication.showApp();
    }

    /**
     * Changes the date of the calendar by the passed in interval. Checks to make sure only users who have permission can change the date.
     * @param interval
     */
    public static changeDate(interval: DateTime): boolean{
        const activeCalendar = CalManager.getActiveCalendar();
        if(activeCalendar.canUser((<Game>game).user, activeCalendar.generalSettings.permissions.changeDateTime)){
            let change = false;
            if(interval.year){
                activeCalendar.year.changeYear(interval.year, true, 'current');
                change = true;
            }
            if(interval.month){
                activeCalendar.year.changeMonth(interval.month, 'current');
                change = true;
            }
            if(interval.day){
                activeCalendar.year.changeDay(interval.day);
                change = true;
            }
            if(interval.hour || interval.minute || interval.second){
                const dayChange = activeCalendar.year.time.changeTime(interval.hour, interval.minute, interval.second);
                if(dayChange !== 0){
                    activeCalendar.year.changeDay(dayChange);
                }
                change = true;
            }

            if(change){
                CalManager.saveCalendars();
                activeCalendar.syncTime().catch(Logger.error);
                MainApplication.updateApp();
            }
            return true;
        } else {
            GameSettings.UiNotification(GameSettings.Localize('FSC.Warn.Macros.GMUpdate'), 'warn');
        }
        return false;
    }

    /**
     * Sets the current date to the passed in date object
     * @param date
     */
    public static setDate(date: DateTime): boolean{
        const activeCalendar = CalManager.getActiveCalendar();
        if(activeCalendar.canUser((<Game>game).user, activeCalendar.generalSettings.permissions.changeDateTime)){
            const seconds = this.dateToTimestamp(date);
            activeCalendar.year.updateTime(activeCalendar.year.secondsToDate(seconds));
            CalManager.saveCalendars();
            activeCalendar.syncTime().catch(Logger.error);
            MainApplication.updateApp();
            return true;
        } else {
            GameSettings.UiNotification(GameSettings.Localize('FSC.Warn.Macros.GMUpdate'), 'warn');
        }
        return false;
    }

    /**
     * Advances to the next time that matches the preset time of day (same day or next)
     * @param preset
     */
    public static advanceTimeToPreset(preset: PresetTimeOfDay){
        const activeCalendar = CalManager.getActiveCalendar();
        if(activeCalendar.canUser((<Game>game).user, activeCalendar.generalSettings.permissions.changeDateTime)) {
            let timeOfDay = 0;

            if (preset === PresetTimeOfDay.Sunrise || preset === PresetTimeOfDay.Sunset) {
                let month = activeCalendar.year.getMonth();
                if (month) {
                    let day = month.getDay();
                    if (day) {
                        timeOfDay = activeCalendar.year.getSunriseSunsetTime(activeCalendar.year.numericRepresentation, month, day, preset === PresetTimeOfDay.Sunrise, false);
                        if (activeCalendar.year.time.seconds >= timeOfDay) {
                            activeCalendar.year.changeDay(1, 'current');
                            month = activeCalendar.year.getMonth();
                            if (month) {
                                day = month.getDay();
                                if (day) {
                                    timeOfDay = activeCalendar.year.getSunriseSunsetTime(activeCalendar.year.numericRepresentation, month, day, preset === PresetTimeOfDay.Sunrise, false);
                                }
                            }
                        }
                    }
                }
            } else if (preset === PresetTimeOfDay.Midday) {
                timeOfDay = Math.floor(activeCalendar.year.time.secondsPerDay / 2);
                if (activeCalendar.year.time.seconds >= timeOfDay) {
                    activeCalendar.year.changeDay(1, 'current');
                }
            } else if (preset === PresetTimeOfDay.Midnight) {
                activeCalendar.year.changeDay(1, 'current');
            }
            activeCalendar.year.time.seconds = timeOfDay;
            CalManager.saveCalendars();
            activeCalendar.syncTime(true).catch(Logger.error);
            return true;
        } else {
            return false;
        }
    }

    /**
     * Randomly chooses a date between the two passed in dates, or if no dates passed in chooses a random date.
     * @param startingDate
     * @param endingDate
     */
    public static chooseRandomDate(startingDate: DateTime = {}, endingDate: DateTime = {}): DateTime {
        const activeCalendar = CalManager.getActiveCalendar();
        let year = 0, month = 0, day = 0, hour = 0, minute = 0, second = 0;

        /**
         * Choose a random year
         *      If the starting and ending year are the same, use that year
         *      If they are different random choose a year between them (they are included)
         *      If no years are provided, random choose a year between 0 and 10,000
         */
        if(startingDate.year !== undefined && endingDate.year !== undefined){
            if(startingDate.year === endingDate.year){
                year = startingDate.year;
            } else {
                year = Math.floor(Math.random() * (endingDate.year - startingDate.year + 1)) + startingDate.year;
            }
        } else {
            year = Math.floor(Math.random() * 10000);
        }

        /**
         * Choose a random month
         *      If the starting and ending month are the same use that month
         *      If they are different randomly choose a month between them (they are included)
         *      If no months are provided randomly choose a month between 0 and the number of months in a year
         */
        if(startingDate.month !== undefined && endingDate.month !== undefined){
            if(startingDate.month === endingDate.month){
                month = startingDate.month;
            } else {
                month = Math.floor(Math.random() * (endingDate.month - startingDate.month + 1)) + startingDate.month;
            }
        } else {
            month = Math.floor(Math.random() * activeCalendar.year.months.length);
        }

        if(month < 0 || month >= activeCalendar.year.months.length){
            month = activeCalendar.year.months.length - 1;
        }

        let monthObject = activeCalendar.year.months[month];
        /**
         * Chose a random day
         *      If the starting and ending day are the same use that day
         *      If they are different randomly choose a day between them (they are included)
         *      If no days are provided randomly choose a day between 0 and the number of days in the month selected above
         */
        if(startingDate.day !== undefined && endingDate.day !== undefined){
            if(startingDate.day === endingDate.day){
                day = startingDate.day;
            } else {
                day = Math.floor(Math.random() * (endingDate.day - startingDate.day + 1)) + startingDate.day;
            }
        } else {
            day = Math.floor(Math.random() * monthObject.days.length);
        }

        if(day < 0 || day >= monthObject.days.length){
            day = monthObject.days.length - 1;
        }

        if(startingDate.hour !== undefined && endingDate.hour !== undefined){
            if(startingDate.hour === endingDate.hour){
                hour = startingDate.hour;
            } else {
                hour = Math.floor(Math.random() * (endingDate.hour - startingDate.hour + 1)) + startingDate.hour;
            }
        } else {
            hour = Math.floor(Math.random() * activeCalendar.year.time.hoursInDay);
        }

        if(startingDate.minute !== undefined && endingDate.minute !== undefined){
            if(startingDate.minute === endingDate.minute){
                minute = startingDate.minute;
            } else {
                minute = Math.floor(Math.random() * (endingDate.minute - startingDate.minute + 1)) + startingDate.minute;
            }
        } else {
            minute = Math.floor(Math.random() * activeCalendar.year.time.minutesInHour);
        }

        if(startingDate.second !== undefined && endingDate.second !== undefined){
            if(startingDate.second === endingDate.second){
                second = startingDate.second;
            } else {
                second = Math.floor(Math.random() * (endingDate.second - startingDate.second + 1)) + startingDate.second;
            }
        } else {
            second = Math.floor(Math.random() * activeCalendar.year.time.secondsInMinute);
        }
        return {
            year: year,
            month: month,
            day: day,
            hour: hour,
            minute: minute,
            second: second
        };
    }

    /**
     * Returns if the current user is the primary GM
     */
    public static isPrimaryGM(){
        return SC.primary;
    }

    /**
     * Starts the built in clock - if the user is the primary gm
     */
    public static startClock(){
        if(SC.primary){
            CalManager.getActiveCalendar().year.time.timeKeeper.start();
            return true;
        }
        return false;
    }

    /**
     * Stops the build in clock
     */
    public static stopClock(){
        CalManager.getActiveCalendar().year.time.timeKeeper.stop();
        return true;
    }

    /**
     * Returns the formatted date and time strings for the passed in date time object
     * @param {DateTime} date The date and time to format
     */
    public static formatDateTime(date: DateTime){
        const activeCalendar = CalManager.getActiveCalendar();
        const year = date.year? date.year : 0;
        let monthIndex = date.month && date.month >= 0? date.month : 0;
        if(monthIndex >= activeCalendar.year.months.length){
            monthIndex = activeCalendar.year.months.length - 1;
        }
        const month = activeCalendar.year.months[monthIndex];
        let dayIndex = date.day && date.day >= 0? date.day : 0;
        if(dayIndex >= month.days.length){
            dayIndex = month.days.length - 1;
        }
        const day = month.days[dayIndex];
        let hour = date.hour && date.hour >= 0? date.hour : 0;
        if(hour >= activeCalendar.year.time.hoursInDay){
            hour = activeCalendar.year.time.hoursInDay - 1;
        }
        let minute = date.minute && date.minute >= 0? date.minute : 0;
        if(minute >= activeCalendar.year.time.minutesInHour){
            minute = activeCalendar.year.time.minutesInHour - 1;
        }
        let second = date.second && date.second >= 0? date.second : 0;
        if(second >= activeCalendar.year.time.secondsInMinute){
            second = activeCalendar.year.time.secondsInMinute - 1;
        }
        return {
            date: FormatDateTime({year: year, month: month.numericRepresentation, day: day.numericRepresentation, hour: 0, minute: 0, seconds:0}, activeCalendar.generalSettings.dateFormat.date, activeCalendar),
            time: FormatDateTime({year: 0, month: 0, day: 0, hour: hour, minute: minute, seconds:second}, activeCalendar.generalSettings.dateFormat.time, activeCalendar)
        };
    }

    /**
     * Returns configuration details about the curent day, or null if the current day con't be found
     */
    public static getCurrentDay(){
        const month = CalManager.getActiveCalendar().year.getMonth();
        if(month){
            const day = month.getDay();
            if(day){
                return day.toConfig();
            }
        }
        return null;
    }

    /**
     * Returns the configuration details about leap years
     */
    public static getLeapYearConfiguration(): LeapYearConfig{
        return CalManager.getActiveCalendar().year.leapYearRule.toConfig();
    }

    /**
     * Returns configuration details about the current month, or null if the current month can't be found.
     * @returns {MonthConfig| null}
     */
    public static getCurrentMonth(): MonthConfig | null{
        const month = CalManager.getActiveCalendar().year.getMonth();
        if(month){
            return month.toConfig();
        }
        return null;
    }

    /**
     * Returns configuration details for all months
     * @returns {Array<MonthConfig>}
     */
    public static getAllMonths(): MonthConfig[]{
        return CalManager.getActiveCalendar().year.months.map(m => m.toConfig());
    }

    /**
     * Returns configuration details for all moons
     */
    public static getAllMoons(): MoonConfiguration[] {
        const activeCalendar = CalManager.getActiveCalendar();
        return activeCalendar.year.moons.map(m => {
            const c = m.toConfig();
            c.currentPhase = m.getMoonPhase(activeCalendar.year);
            return c;
        });
    }

    /**
     * Returns the season for the current date
     */
    public static getCurrentSeason(){
        const clone = CalManager.getActiveCalendar().year.clone();
        const mon = clone.getMonth('current');
        if(mon){
            const mIndex = clone.months.findIndex(m => m.numericRepresentation == mon.numericRepresentation);
            const day = mon.getDay();
            if(day){
                return clone.getSeason(mIndex, day.numericRepresentation).toConfig();
            }
        }
        return {name: '', color: ''};
    }

    /**
     * Returns details for all seasons set up in the calendar
     */
    public static getAllSeasons(){
        return CalManager.getActiveCalendar().year.seasons.map(s => s.toConfig());
    }

    /**
     * Returns details for how time is configured in the calendar
     */
    public static getTimeConfiguration(): TimeConfig{
        return CalManager.getActiveCalendar().year.time.toConfig();
    }

    /**
     * Returns details for the weekday whe current date falls on.
     * @returns {WeekdayConfig | null}
     */
    public static getCurrentWeekday(): WeekdayConfig | null{
        const activeCalendar = CalManager.getActiveCalendar();
        const month = activeCalendar.year.getMonth();
        if(month){
            const day = month.getDay();
            if(day){
                const weekdayIndex = activeCalendar.year.dayOfTheWeek(activeCalendar.year.numericRepresentation, month.numericRepresentation, day.numericRepresentation);
                return activeCalendar.year.weekdays[weekdayIndex].toConfig();
            }
        }
        return null;
    }

    /**
     * Returns details for all weekdays
     * @returns {WeekdayConfig[]}
     */
    public static getAllWeekdays(): WeekdayConfig[]{
        return CalManager.getActiveCalendar().year.weekdays.map(w => w.toConfig());
    }

    /**
     * Returns details for the current year
     */
    public static getCurrentYear(): YearConfig {
        return CalManager.getActiveCalendar().year.toConfig();
    }

    /**
     * Sets the current year to the passed in predefined calendar or the custom calendar object
     * @param o
     */
    public static async configureCalendar(o: PredefinedCalendars | any){
        if(GameSettings.IsGm()){
            const activeCalendar = CalManager.getActiveCalendar();
            if(typeof o === "string"){
                const clone = activeCalendar.year.clone();
                const res = PredefinedCalendar.setToPredefined(clone, <PredefinedCalendars>o);
                await GameSettings.SaveObjectSetting(SettingNames.YearConfiguration, clone.toConfig());
                await GameSettings.SaveObjectSetting(SettingNames.MonthConfiguration, clone.months.map(m => m.toConfig()));
                await GameSettings.SaveObjectSetting(SettingNames.WeekdayConfiguration, clone.weekdays.map(w => w.toConfig()));
                await GameSettings.SaveObjectSetting(SettingNames.LeapYearRule, clone.leapYearRule.toConfig());
                await GameSettings.SaveObjectSetting(SettingNames.TimeConfiguration, clone.time.toConfig());
                await GameSettings.SaveObjectSetting(SettingNames.SeasonConfiguration, clone.seasons.map(s => s.toConfig()));
                await GameSettings.SaveObjectSetting(SettingNames.MoonConfiguration, clone.moons.map(m => m.toConfig()));

                CalManager.saveCalendars();
                return res;
            } else if(Object.keys(o).length) {
                if(o.hasOwnProperty('yearSettings')){
                    await (<Game>game).settings.set(ModuleName, SettingNames.YearConfiguration, o.yearSettings);
                }
                if(o.hasOwnProperty('monthSettings')){
                    await (<Game>game).settings.set(ModuleName, SettingNames.MonthConfiguration, o.monthSettings);
                }
                if(o.hasOwnProperty('weekdaySettings')){
                    await (<Game>game).settings.set(ModuleName, SettingNames.WeekdayConfiguration, o.weekdaySettings);
                }
                if(o.hasOwnProperty('leapYearSettings')){
                    await (<Game>game).settings.set(ModuleName, SettingNames.LeapYearRule, o.leapYearSettings);
                }
                if(o.hasOwnProperty('timeSettings')){
                    await (<Game>game).settings.set(ModuleName, SettingNames.TimeConfiguration, o.timeSettings);
                }
                if(o.hasOwnProperty('seasonSettings')){
                    await (<Game>game).settings.set(ModuleName, SettingNames.SeasonConfiguration, o.seasonSettings);
                }
                if(o.hasOwnProperty('moonSettings')){
                    await (<Game>game).settings.set(ModuleName, SettingNames.MoonConfiguration, o.moonSettings);
                }
                if(o.hasOwnProperty('generalSettings')){
                    await (<Game>game).settings.set(ModuleName, SettingNames.GeneralConfiguration, o.generalSettings);
                }
                if(o.hasOwnProperty('noteCategories')){
                    await (<Game>game).settings.set(ModuleName, SettingNames.NoteCategories, o.noteCategories);
                }
                if(o.hasOwnProperty('currentDate')){
                    await (<Game>game).settings.set(ModuleName, SettingNames.CurrentDate, o.currentDate);
                }
                return true;
            }
        }
        return false;
    }
}
