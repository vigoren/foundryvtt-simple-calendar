import SimpleCalendar from "./simple-calendar";
import {
    DateTime,
    LeapYearConfig,
    MonthConfig,
    MoonConfiguration,
    NoteConfig,
    TimeConfig,
    WeekdayConfig,
    YearConfig
} from "../interfaces";
import {Logger} from "./logging";
import {GameSettings} from "./game-settings";
import {
    CalendarClickEvents,
    GameSystems,
    LeapYearRules,
    ModuleName,
    MoonIcons,
    MoonYearResetOptions,
    PredefinedCalendars,
    PresetTimeOfDay,
    SettingNames,
    TimeKeeperStatus,
    YearNamingRules
} from "../constants";
import PF2E from "./systems/pf2e";
import Utilities from "./utilities";
import DateSelector from "./date-selector";
import PredefinedCalendar from "./predefined-calendar";
import Renderer from "./renderer";

/**
 * All external facing functions for other systems, modules or macros to consume
 */
export default class API{
    /**
     * The Date selector class used to create date selector inputs based on the calendar
     */
    public static DateSelector = DateSelector;

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
    public static MoonIcons = MoonIcons;
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
        return SimpleCalendar.instance.activeCalendar.year.toSeconds();
    }

    /**
     * Takes in a current time stamp and adds the passed in interval to it and returns the new time stamp
     * @param currentSeconds
     * @param interval
     */
    public static timestampPlusInterval(currentSeconds: number, interval: DateTime): number{
        const clone = SimpleCalendar.instance.activeCalendar.year.clone();
        // If this is a Pathfinder 2E game, add the world creation seconds to the interval seconds
        if(SimpleCalendar.instance.activeCalendar.gameSystem === GameSystems.PF2E && SimpleCalendar.instance.activeCalendar.generalSettings.pf2eSync){
            currentSeconds += PF2E.getWorldCreateSeconds();
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
        const result = {
            year: 0,
            month: 0,
            dayOffset: 0,
            day: 0,
            dayOfTheWeek: 0,
            hour: 0,
            minute: 0,
            second: 0,
            yearZero: 0,
            sunrise: 0,
            sunset: 0,
            midday: 0,
            weekdays: <string[]>[],
            showWeekdayHeadings: true,
            currentSeason: {},
            isLeapYear: false,
            monthName: "",
            dayDisplay: '',
            yearName: "",
            yearPrefix: '',
            yearPostfix: '',
            display: {
                date: '',
                day: '',
                daySuffix: '',
                weekday: '',
                monthName: '',
                month: '',
                year: '',
                yearName: '',
                yearPrefix: '',
                yearPostfix: '',
                time: ''
            }
        };
        // If this is a Pathfinder 2E game, add the world creation seconds
        if(SimpleCalendar.instance.activeCalendar.gameSystem === GameSystems.PF2E && SimpleCalendar.instance.activeCalendar.generalSettings.pf2eSync){
            seconds += PF2E.getWorldCreateSeconds();
        }

        const dateTime = SimpleCalendar.instance.activeCalendar.year.secondsToDate(seconds);
        result.year = dateTime.year;
        result.month = dateTime.month;
        result.day = dateTime.day;
        result.hour = dateTime.hour;
        result.minute = dateTime.minute;
        result.second = dateTime.seconds;

        const month = SimpleCalendar.instance.activeCalendar.year.months[dateTime.month];
        const day = month.days[dateTime.day];
        result.dayOffset = month.numericRepresentationOffset;
        result.yearZero = SimpleCalendar.instance.activeCalendar.year.yearZero;
        result.dayOfTheWeek = SimpleCalendar.instance.activeCalendar.year.dayOfTheWeek(result.year, month.numericRepresentation, day.numericRepresentation);
        result.currentSeason = SimpleCalendar.instance.activeCalendar.year.getSeason(dateTime.month, dateTime.day + 1);
        result.weekdays = SimpleCalendar.instance.activeCalendar.year.weekdays.map(w => w.name);
        result.showWeekdayHeadings = SimpleCalendar.instance.activeCalendar.year.showWeekdayHeadings;
        result.isLeapYear = SimpleCalendar.instance.activeCalendar.year.leapYearRule.isLeapYear(result.year);
        result.sunrise = SimpleCalendar.instance.activeCalendar.year.getSunriseSunsetTime(result.year, month, day, true);
        result.sunset = SimpleCalendar.instance.activeCalendar.year.getSunriseSunsetTime(result.year, month, day, false);
        result.midday = this.dateToTimestamp({ year: result.year, month: result.month, day: result.day, hour: 0, minute: 0, second: 0 }) + Math.floor(SimpleCalendar.instance.activeCalendar.year.time.secondsPerDay / 2);

        // Display Stuff
        // Legacy - Depreciated first stable release of Foundry 9
        result.monthName = month.name;
        result.yearName = SimpleCalendar.instance.activeCalendar.year.getYearName(result.year);
        result.yearPrefix = SimpleCalendar.instance.activeCalendar.year.prefix;
        result.yearPostfix = SimpleCalendar.instance.activeCalendar.year.postfix;
        result.dayDisplay = day.numericRepresentation.toString();

        result.display.year = dateTime.year.toString();
        result.display.yearName = SimpleCalendar.instance.activeCalendar.year.getYearName(result.year);
        result.display.yearPrefix = SimpleCalendar.instance.activeCalendar.year.prefix;
        result.display.yearPostfix = SimpleCalendar.instance.activeCalendar.year.postfix;
        result.display.month = month.numericRepresentation.toString();
        result.display.monthName = month.name;
        if(SimpleCalendar.instance.activeCalendar.year.weekdays.length > result.dayOfTheWeek){
            result.display.weekday = SimpleCalendar.instance.activeCalendar.year.weekdays[result.dayOfTheWeek].name;
        }
        result.display.day = day.numericRepresentation.toString();
        result.display.daySuffix = Utilities.ordinalSuffix(day.numericRepresentation);
        result.display.time = Utilities.FormatDateTime({year: 0, month: 0, day: 0, hour: result.hour, minute: result.minute, seconds: result.second}, SimpleCalendar.instance.activeCalendar.generalSettings.dateFormat.time);
        result.display.date = Utilities.FormatDateTime({year: result.year, month: month.numericRepresentation, day: day.numericRepresentation, hour: 0, minute: 0, seconds: 0}, SimpleCalendar.instance.activeCalendar.generalSettings.dateFormat.date);
        return result;
    }

    /**
     * Converts the passed in date to a timestamp. If date members are missing the current date members are used.
     * @param {DateTime} date
     */
    public static dateToTimestamp(date: DateTime): number{
        let ts = 0;
        const clone = SimpleCalendar.instance.activeCalendar.year.clone();
        const currentMonth = clone.getMonth();
        const currentTime = clone.time.getCurrentTime();
        if(date.second === undefined){
            date.second = currentTime.seconds;
        }

        if(date.minute === undefined){
            date.minute = currentTime.minute;
        }

        if(date.hour === undefined){
            date.hour = currentTime.hour;
        }

        // If not year is passed in, set to the current year
        if(date.year === undefined){
            date.year = clone.numericRepresentation;
        }
        if(date.month === undefined){
            if(currentMonth){
                date.month = clone.months.findIndex(m => m.numericRepresentation === currentMonth.numericRepresentation);
            } else {
                date.month = 0;
            }
        }
        if(date.day === undefined){
            date.day = 0;
            if(currentMonth){
                const currDay = currentMonth.getDay();
                if(currDay){
                    date.day = currentMonth.days.findIndex(d => d.numericRepresentation === currDay.numericRepresentation);
                }
            }
        }
        clone.updateMonth(date.month, 'current', true, date.day);
        clone.numericRepresentation = date.year;
        clone.time.setTime(date.hour, date.minute, date.second);
        ts = clone.toSeconds();
        return ts;
    }

    /**
     * Attempts to convert the passed in seconds to an interval (day, month, year, hour, minute, second etc)
     * @param seconds
     */
    public static secondsToInterval(seconds: number): DateTime{
        return SimpleCalendar.instance.activeCalendar.year.secondsToInterval(seconds);
    }

    /**
     * Returns the current status of the clock
     */
    public static clockStatus(){
        const status = SimpleCalendar.instance.activeCalendar.year.time.timeKeeper.getStatus();
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
        if(date !== null){
            if(!date.year){
                date.year = SimpleCalendar.instance.activeCalendar.year.numericRepresentation;
            }

            if(!date.month || !date.day){
                const curMonth = SimpleCalendar.instance.activeCalendar.year.getMonth();
                if(!date.month){
                    date.month = curMonth? SimpleCalendar.instance.activeCalendar.year.months.findIndex(m => m.numericRepresentation === curMonth.numericRepresentation) : 0;
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
                const isLeapYear = SimpleCalendar.instance.activeCalendar.year.leapYearRule.isLeapYear(date.year);
                SimpleCalendar.instance.activeCalendar.year.visibleYear = date.year;
                if(date.month === -1 || date.month > SimpleCalendar.instance.activeCalendar.year.months.length){
                    date.month = SimpleCalendar.instance.activeCalendar.year.months.length - 1;
                }
                SimpleCalendar.instance.activeCalendar.year.resetMonths('visible');
                SimpleCalendar.instance.activeCalendar.year.months[date.month].visible = true;

                const numberOfDays = isLeapYear? SimpleCalendar.instance.activeCalendar.year.months[date.month].numberOfLeapYearDays : SimpleCalendar.instance.activeCalendar.year.months[date.month].numberOfDays;
                if(date.day > 0){
                    date.day = date.day - 1;
                }
                if(date.day == -1 || date.day > numberOfDays){
                    date.day = numberOfDays - 1;
                }
                SimpleCalendar.instance.activeCalendar.year.resetMonths('selected');
                SimpleCalendar.instance.activeCalendar.year.months[date.month].days[date.day].selected = true;
                SimpleCalendar.instance.activeCalendar.year.months[date.month].selected = true;
                SimpleCalendar.instance.activeCalendar.year.selectedYear = SimpleCalendar.instance.activeCalendar.year.visibleYear;
            } else {
                Logger.error('SimpleCalendar.api.showCalendar: Invalid date passed in.');
            }
        }
        SimpleCalendar.instance.compactView = compact;
        SimpleCalendar.instance.showApp();
    }

    /**
     * Changes the date of the calendar by the passed in interval. Checks to make sure only users who have permission can change the date.
     * @param interval
     */
    public static changeDate(interval: DateTime): boolean{
        if(SimpleCalendar.instance.activeCalendar.canUser((<Game>game).user, SimpleCalendar.instance.activeCalendar.generalSettings.permissions.changeDateTime)){
            let change = false;
            if(interval.year){
                SimpleCalendar.instance.activeCalendar.year.changeYear(interval.year, true, 'current');
                change = true;
            }
            if(interval.month){
                SimpleCalendar.instance.activeCalendar.year.changeMonth(interval.month, 'current');
                change = true;
            }
            if(interval.day){
                SimpleCalendar.instance.activeCalendar.year.changeDay(interval.day);
                change = true;
            }
            if(interval.hour || interval.minute || interval.second){
                const dayChange = SimpleCalendar.instance.activeCalendar.year.time.changeTime(interval.hour, interval.minute, interval.second);
                if(dayChange !== 0){
                    SimpleCalendar.instance.activeCalendar.year.changeDay(dayChange);
                }
                change = true;
            }

            if(change){
                GameSettings.SaveCurrentDate(SimpleCalendar.instance.activeCalendar.year).catch(Logger.error);
                SimpleCalendar.instance.activeCalendar.syncTime().catch(Logger.error);
                SimpleCalendar.instance.updateApp();
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
        if(SimpleCalendar.instance.activeCalendar.canUser((<Game>game).user, SimpleCalendar.instance.activeCalendar.generalSettings.permissions.changeDateTime)){
            const seconds = this.dateToTimestamp(date);
            SimpleCalendar.instance.activeCalendar.year.updateTime(SimpleCalendar.instance.activeCalendar.year.secondsToDate(seconds));
            GameSettings.SaveCurrentDate(SimpleCalendar.instance.activeCalendar.year).catch(Logger.error);
            SimpleCalendar.instance.activeCalendar.syncTime().catch(Logger.error);
            SimpleCalendar.instance.updateApp();
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
        if(SimpleCalendar.instance.activeCalendar.canUser((<Game>game).user, SimpleCalendar.instance.activeCalendar.generalSettings.permissions.changeDateTime)) {
            let timeOfDay = 0;

            if (preset === PresetTimeOfDay.Sunrise || preset === PresetTimeOfDay.Sunset) {
                let month = SimpleCalendar.instance.activeCalendar.year.getMonth();
                if (month) {
                    let day = month.getDay();
                    if (day) {
                        timeOfDay = SimpleCalendar.instance.activeCalendar.year.getSunriseSunsetTime(SimpleCalendar.instance.activeCalendar.year.numericRepresentation, month, day, preset === PresetTimeOfDay.Sunrise, false);
                        if (SimpleCalendar.instance.activeCalendar.year.time.seconds >= timeOfDay) {
                            SimpleCalendar.instance.activeCalendar.year.changeDay(1, 'current');
                            month = SimpleCalendar.instance.activeCalendar.year.getMonth();
                            if (month) {
                                day = month.getDay();
                                if (day) {
                                    timeOfDay = SimpleCalendar.instance.activeCalendar.year.getSunriseSunsetTime(SimpleCalendar.instance.activeCalendar.year.numericRepresentation, month, day, preset === PresetTimeOfDay.Sunrise, false);
                                }
                            }
                        }
                    }
                }
            } else if (preset === PresetTimeOfDay.Midday) {
                timeOfDay = Math.floor(SimpleCalendar.instance.activeCalendar.year.time.secondsPerDay / 2);
                if (SimpleCalendar.instance.activeCalendar.year.time.seconds >= timeOfDay) {
                    SimpleCalendar.instance.activeCalendar.year.changeDay(1, 'current');
                }
            } else if (preset === PresetTimeOfDay.Midnight) {
                SimpleCalendar.instance.activeCalendar.year.changeDay(1, 'current');
            }
            SimpleCalendar.instance.activeCalendar.year.time.seconds = timeOfDay;
            GameSettings.SaveCurrentDate(SimpleCalendar.instance.activeCalendar.year).catch(Logger.error);
            SimpleCalendar.instance.activeCalendar.syncTime(true).catch(Logger.error);
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
            month = Math.floor(Math.random() * SimpleCalendar.instance.activeCalendar.year.months.length);
        }

        if(month < 0 || month >= SimpleCalendar.instance.activeCalendar.year.months.length){
            month = SimpleCalendar.instance.activeCalendar.year.months.length - 1;
        }

        let monthObject = SimpleCalendar.instance.activeCalendar.year.months[month];
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
            hour = Math.floor(Math.random() * SimpleCalendar.instance.activeCalendar.year.time.hoursInDay);
        }

        if(startingDate.minute !== undefined && endingDate.minute !== undefined){
            if(startingDate.minute === endingDate.minute){
                minute = startingDate.minute;
            } else {
                minute = Math.floor(Math.random() * (endingDate.minute - startingDate.minute + 1)) + startingDate.minute;
            }
        } else {
            minute = Math.floor(Math.random() * SimpleCalendar.instance.activeCalendar.year.time.minutesInHour);
        }

        if(startingDate.second !== undefined && endingDate.second !== undefined){
            if(startingDate.second === endingDate.second){
                second = startingDate.second;
            } else {
                second = Math.floor(Math.random() * (endingDate.second - startingDate.second + 1)) + startingDate.second;
            }
        } else {
            second = Math.floor(Math.random() * SimpleCalendar.instance.activeCalendar.year.time.secondsInMinute);
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
        if(SimpleCalendar.instance){
            return SimpleCalendar.instance.primary;
        }
        return  false;
    }

    /**
     * Starts the built in clock - if the user is the primary gm
     */
    public static startClock(){
        if(SimpleCalendar.instance.primary){
            SimpleCalendar.instance.activeCalendar.year.time.timeKeeper.start();
            return true;
        }
        return false;
    }

    /**
     * Stops the build in clock
     */
    public static stopClock(){
        SimpleCalendar.instance.activeCalendar.year.time.timeKeeper.stop();
        return true;
    }

    /**
     * Returns the formatted date and time strings for the passed in date time object
     * @param {DateTime} date The date and time to format
     */
    public static formatDateTime(date: DateTime){
        const year = date.year? date.year : 0;
        let monthIndex = date.month && date.month >= 0? date.month : 0;
        if(monthIndex >= SimpleCalendar.instance.activeCalendar.year.months.length){
            monthIndex = SimpleCalendar.instance.activeCalendar.year.months.length - 1;
        }
        const month = SimpleCalendar.instance.activeCalendar.year.months[monthIndex];
        let dayIndex = date.day && date.day >= 0? date.day : 0;
        if(dayIndex >= month.days.length){
            dayIndex = month.days.length - 1;
        }
        const day = month.days[dayIndex];
        let hour = date.hour && date.hour >= 0? date.hour : 0;
        if(hour >= SimpleCalendar.instance.activeCalendar.year.time.hoursInDay){
            hour = SimpleCalendar.instance.activeCalendar.year.time.hoursInDay - 1;
        }
        let minute = date.minute && date.minute >= 0? date.minute : 0;
        if(minute >= SimpleCalendar.instance.activeCalendar.year.time.minutesInHour){
            minute = SimpleCalendar.instance.activeCalendar.year.time.minutesInHour - 1;
        }
        let second = date.second && date.second >= 0? date.second : 0;
        if(second >= SimpleCalendar.instance.activeCalendar.year.time.secondsInMinute){
            second = SimpleCalendar.instance.activeCalendar.year.time.secondsInMinute - 1;
        }
        return {
            date: Utilities.FormatDateTime({year: year, month: month.numericRepresentation, day: day.numericRepresentation, hour: 0, minute: 0, seconds:0}, SimpleCalendar.instance.activeCalendar.generalSettings.dateFormat.date),
            time: Utilities.FormatDateTime({year: 0, month: 0, day: 0, hour: hour, minute: minute, seconds:second}, SimpleCalendar.instance.activeCalendar.generalSettings.dateFormat.time)
        };
    }

    /**
     * Returns configuration details about the curent day, or null if the current day con't be found
     */
    public static getCurrentDay(){
        const month = SimpleCalendar.instance.activeCalendar.year.getMonth();
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
        return SimpleCalendar.instance.activeCalendar.year.leapYearRule.toConfig();
    }

    /**
     * Returns configuration details about the current month, or null if the current month can't be found.
     * @returns {MonthConfig| null}
     */
    public static getCurrentMonth(): MonthConfig | null{
        const month = SimpleCalendar.instance.activeCalendar.year.getMonth();
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
        return SimpleCalendar.instance.activeCalendar.year.months.map(m => m.toConfig());
    }

    /**
     * Returns configuration details for all moons
     */
    public static getAllMoons(): MoonConfiguration[] {
        return SimpleCalendar.instance.activeCalendar.year.moons.map(m => {
            const c = m.toConfig();
            c.currentPhase = m.getMoonPhase(SimpleCalendar.instance.activeCalendar.year);
            return c;
        });
    }

    /**
     * Returns the season for the current date
     */
    public static getCurrentSeason(){
        const clone = SimpleCalendar.instance.activeCalendar.year.clone();
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
        return SimpleCalendar.instance.activeCalendar.year.seasons.map(s => s.toConfig());
    }

    /**
     * Returns details for how time is configured in the calendar
     */
    public static getTimeConfiguration(): TimeConfig{
        return SimpleCalendar.instance.activeCalendar.year.time.toConfig();
    }

    /**
     * Returns details for the weekday whe current date falls on.
     * @returns {WeekdayConfig | null}
     */
    public static getCurrentWeekday(): WeekdayConfig | null{
        const month = SimpleCalendar.instance.activeCalendar.year.getMonth();
        if(month){
            const day = month.getDay();
            if(day){
                const weekdayIndex = SimpleCalendar.instance.activeCalendar.year.dayOfTheWeek(SimpleCalendar.instance.activeCalendar.year.numericRepresentation, month.numericRepresentation, day.numericRepresentation);
                return SimpleCalendar.instance.activeCalendar.year.weekdays[weekdayIndex].toConfig();
            }
        }
        return null;
    }

    /**
     * Returns details for all weekdays
     * @returns {WeekdayConfig[]}
     */
    public static getAllWeekdays(): WeekdayConfig[]{
        return SimpleCalendar.instance.activeCalendar.year.weekdays.map(w => w.toConfig());
    }

    /**
     * Returns details for the current year
     */
    public static getCurrentYear(): YearConfig {
        return SimpleCalendar.instance.activeCalendar.year.toConfig();
    }

    /**
     * Sets the current year to the passed in predefined calendar or the custom calendar object
     * @param o
     */
    public static async configureCalendar(o: PredefinedCalendars | any){
        if(GameSettings.IsGm()){
            if(typeof o === "string"){
                const clone = SimpleCalendar.instance.activeCalendar.year.clone();
                const res = PredefinedCalendar.setToPredefined(clone, <PredefinedCalendars>o);
                await GameSettings.SaveYearConfiguration(clone);
                await GameSettings.SaveMonthConfiguration(clone.months);
                await GameSettings.SaveWeekdayConfiguration(clone.weekdays);
                await GameSettings.SaveLeapYearRules(clone.leapYearRule);
                await GameSettings.SaveTimeConfiguration(clone.time);
                await GameSettings.SaveSeasonConfiguration(clone.seasons);
                await GameSettings.SaveMoonConfiguration(clone.moons);
                await GameSettings.SaveCurrentDate(clone);
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

    /**
     * This is only here until Calendar Weather has finished their migration from about-time functions to Simple Calendar functions. At which point it will be removed.
     * Runs the import calendar weather settings into Simple Calendar
     */
    public static async calendarWeatherImport(): Promise<boolean>{
        //if(SimpleCalendar.instance && SimpleCalendar.instance.activeCalendar.year){
            //await Importer.importCalendarWeather(SimpleCalendar.instance.activeCalendar.year, true);
            return true;
        //}
        //return false;
    }
}
