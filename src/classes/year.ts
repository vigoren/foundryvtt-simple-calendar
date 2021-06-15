import Month from "./month";
import {
    DateTimeIntervals,
    DateTimeParts,
    DayTemplate,
    GeneralSettings,
    PermissionMatrix,
    YearTemplate
} from "../interfaces";
import {Logger} from "./logging";
import {Weekday} from "./weekday";
import LeapYear from "./leap-year";
import Time from "./time";
import {GameSystems, GameWorldTimeIntegrations, LeapYearRules, TimeKeeperStatus, YearNamingRules} from "../constants";
import {GameSettings} from "./game-settings";
import Season from "./season";
import Moon from "./moon";
import {Note} from "./note";
import SimpleCalendar from "./simple-calendar";
import PF2E from "./systems/pf2e";

/**
 * Class for representing a year
 */
export default class Year {
    /**
     * The currently running game system
     * @type {GameSystems}
     */
    gameSystem: GameSystems;
    /**
     * The numeric representation of this year
     * @type {string}
     */
    numericRepresentation: number;
    /**
     * Any prefix to use for this year to display before its name
     * @type {string}
     */
    prefix: string = '';
    /**
     * Any postfix to use for this year to display after its name
     * @type {string}
     */
    postfix: string = '';
    /**
     * A list of all the months in this year
     * @type {Month[]}
     */
    months: Month[] = [];
    /**
     * The year for the selected day
     * @type {number}
     */
    selectedYear: number;
    /**
     * The year that is currently visible
     * @type {number}
     */
    visibleYear: number;
    /**
     * The days that make up a week
     * @type {Array.<Weekday>}
     */
    weekdays: Weekday[] = [];
    /**
     * If to show the weekday headings row or not on the calendar
     * @type {boolean}
     */
    showWeekdayHeadings: boolean = true;
    /**
     * The day of the week the first day of year 0 falls on
     * @type {number}
     */
    firstWeekday: number = 0;
    /**
     * The year to use that is considered year 0
     * @type {number}
     */
    yearZero: number = 0;
    /**
     * The leap year rules for the calendar
     * @type {LeapYear}
     */
    leapYearRule: LeapYear;
    /**
     * The time object responsible for all time related functionality
     * @type {Time}
     */
    time: Time;
    /**
     * If Simple Calendar has initiated a time change
     * @type {boolean}
     */
    timeChangeTriggered: boolean = false;
    /**
     * If a combat change has been triggered
     * @type {boolean}
     */
    combatChangeTriggered: boolean = false;

    /**
     * The default general settings for the simple calendar
     */
    generalSettings: GeneralSettings = {
        gameWorldTimeIntegration: GameWorldTimeIntegrations.None,
        showClock: false,
        pf2eSync: true,
        permissions: {
            viewCalendar: {player: true, trustedPlayer: true, assistantGameMaster: true, users: undefined},
            addNotes: {player: false, trustedPlayer: false, assistantGameMaster: false, users: undefined},
            changeDateTime: {player: false, trustedPlayer: false, assistantGameMaster: false, users: undefined}
        }
    };
    /**
     * All of the seasons for this calendar
     * @type {Array.<Season>}
     */
    seasons: Season[] = [];
    /**
     * All of the moons for this calendar
     */
    moons: Moon[] =[];

    yearNames: string[] = [];

    yearNamesStart: number = 0;

    yearNamingRule: YearNamingRules = YearNamingRules.Default;

    /**
     * The Year constructor
     * @param {number} numericRepresentation The numeric representation of this year
     */
    constructor(numericRepresentation: number) {
        this.numericRepresentation = numericRepresentation;
        this.selectedYear = numericRepresentation;
        this.visibleYear = numericRepresentation;
        this.leapYearRule = new LeapYear();
        this.time = new Time();

        switch (game.system.id){
            case GameSystems.DnD5E:
                this.gameSystem = GameSystems.DnD5E;
                break;
            case GameSystems.PF1E:
                this.gameSystem = GameSystems.PF1E;
                break;
            case GameSystems.PF2E:
                this.gameSystem = GameSystems.PF2E;
                break;
            case GameSystems.WarhammerFantasy4E:
                this.gameSystem = GameSystems.WarhammerFantasy4E;
                break;
            default:
                this.gameSystem = GameSystems.Other;
                break;
        }
    }

    /**
     * Returns an object that is used to display the year in the HTML template
     * @returns {YearTemplate}
     */
    toTemplate(): YearTemplate{
        const currentMonth = this.getMonth();
        const selectedMonth = this.getMonth('selected');
        const visibleMonth = this.getMonth('visible');

        let sMonth = '', sDay = '', sDayOfWeek = '', sMoonsPhase = [], sNotes: Note[] = [];
        if(selectedMonth){
            sMonth = selectedMonth.name;
            const d = selectedMonth.getDay('selected');
            if(d){
                sDay = d.name;
            }
        } else if(currentMonth){
            sMonth = currentMonth.name;
            const d = currentMonth.getDay();
            if(d){
                sDay = d.name;
                if(this.showWeekdayHeadings && this.weekdays.length){
                    const weekday = this.dayOfTheWeek(this.numericRepresentation, currentMonth.numericRepresentation, d.numericRepresentation);
                    sDayOfWeek = this.weekdays[weekday].name;
                }
                if(this.moons.length){
                    for(let i = 0; i < this.moons.length; i++){
                        sMoonsPhase.push({
                            name: this.moons[i].name,
                            color: this.moons[i].color,
                            phase: this.moons[i].getMoonPhase(this, 'current')
                        });
                    }
                }
                if(SimpleCalendar.instance){
                    sNotes = SimpleCalendar.instance.notes.filter(n => n.isVisible(this.numericRepresentation, currentMonth.numericRepresentation, d.numericRepresentation));
                }
            }
        }
        const currentSeason = this.getCurrentSeason();

        let weeks: (boolean | DayTemplate)[][] = [];
        if(visibleMonth){
            weeks = this.daysIntoWeeks(visibleMonth, this.visibleYear, this.weekdays.length);
        }
        return {
            gameSystem: this.gameSystem,
            display: this.getDisplayName(),
            selectedDisplayYear: this.getDisplayName(true),
            selectedDisplayMonth: sMonth,
            selectedDisplayDay: sDay,
            selectedDayOfWeek: sDayOfWeek,
            selectedDayMoons: sMoonsPhase,
            selectedDayNotes: sNotes,
            yearZero: this.yearZero,
            numericRepresentation: this.numericRepresentation,
            weekdays: this.weekdays.map(w => w.toTemplate()),
            showWeekdayHeaders: this.showWeekdayHeadings,
            firstWeekday: this.firstWeekday,
            visibleMonth: visibleMonth?.toTemplate(this.leapYearRule.isLeapYear(this.visibleYear)),
            showClock: this.generalSettings.showClock,
            clockClass: 'stopped',
            showTimeControls: this.generalSettings.showClock && this.generalSettings.gameWorldTimeIntegration !== GameWorldTimeIntegrations.ThirdParty,
            showDateControls: this.generalSettings.gameWorldTimeIntegration !== GameWorldTimeIntegrations.ThirdParty,
            currentTime: this.time.getCurrentTime(),
            currentSeasonName: currentSeason.name,
            currentSeasonColor: currentSeason.color,
            weeks: weeks,
            yearNames: this.yearNames,
            yearNamesStart: this.yearNamesStart,
            yearNamingRule: this.yearNamingRule
        }
    }

    /**
     * Will take the days of the passed in month and break it into an array of weeks
     * @param {Month} month The month to get the days from
     * @param {number} year The year the month is in (for leap year calculation)
     * @param {number} weekLength How many days there are in a week
     */
    daysIntoWeeks(month: Month, year: number, weekLength: number): (boolean | DayTemplate)[][]{
        const weeks = [];
        const dayOfWeekOffset = this.visibleMonthStartingDayOfWeek();
        const isLeapYear = this.leapYearRule.isLeapYear(year);
        const days = month.getDaysForTemplate(isLeapYear);

        if(days.length && weekLength > 0){
            const startingWeek = [];
            let dayOffset = 0;
            for(let i = 0; i < weekLength; i++){
                if(i<dayOfWeekOffset){
                    startingWeek.push(false);
                } else {
                    const dayIndex = i - dayOfWeekOffset;
                    if(dayIndex < days.length){
                        startingWeek.push(days[dayIndex]);
                        dayOffset++;
                    } else {
                        startingWeek.push(false);
                    }
                }
            }
            weeks.push(startingWeek);
            const numWeeks = Math.ceil((days.length - dayOffset) / weekLength);
            for(let i = 0; i < numWeeks; i++){
                const w = [];
                for(let d = 0; d < weekLength; d++){
                    const dayIndex = dayOffset + (i * weekLength) + d;
                    if(dayIndex < days.length){
                        w.push(days[dayIndex]);
                    } else {
                        w.push(false);
                    }
                }
                weeks.push(w);
            }
        }
        return weeks;
    }

    /**
     * Creates a new year object with the exact same settings as this year
     * @return {Year}
     */
    clone(): Year {
        const y = new Year(this.numericRepresentation);
        y.postfix = this.postfix;
        y.prefix = this.prefix;
        y.yearZero = this.yearZero;
        y.selectedYear = this.selectedYear;
        y.visibleYear = this.visibleYear;
        y.months = this.months.map(m => m.clone());
        y.weekdays = this.weekdays.map(w => w.clone());
        y.leapYearRule.rule = this.leapYearRule.rule;
        y.leapYearRule.customMod = this.leapYearRule.customMod;
        y.showWeekdayHeadings = this.showWeekdayHeadings;
        y.firstWeekday = this.firstWeekday;
        y.time = this.time.clone();
        y.generalSettings.gameWorldTimeIntegration = this.generalSettings.gameWorldTimeIntegration;
        y.generalSettings.showClock = this.generalSettings.showClock;
        y.generalSettings.pf2eSync = this.generalSettings.pf2eSync;
        y.generalSettings.permissions.viewCalendar = Year.clonePermissions(this.generalSettings.permissions.viewCalendar);
        y.generalSettings.permissions.addNotes = Year.clonePermissions(this.generalSettings.permissions.addNotes);
        y.generalSettings.permissions.changeDateTime = Year.clonePermissions(this.generalSettings.permissions.changeDateTime);
        y.seasons = this.seasons.map(s => s.clone());
        y.moons = this.moons.map(m => m.clone());
        y.yearNames = this.yearNames.map(n => n);
        y.yearNamesStart = this.yearNamesStart;
        y.yearNamingRule = this.yearNamingRule;
        return y;
    }

    /**
     * Makes a copy of a Permission Matrix
     * @param {PermissionMatrix} p The permission matric to copy
     * @private
     */
    private static clonePermissions(p: PermissionMatrix): PermissionMatrix{
        return {
            player: p.player,
            trustedPlayer: p.trustedPlayer,
            assistantGameMaster: p.assistantGameMaster,
            users: p.users
        };
    }

    /**
     * Checks if a user can do an action based on a passed in permission matrix
     * @param user
     * @param permissions
     */
    canUser(user: User | null, permissions: PermissionMatrix): boolean{
        if(user === null){
            return false;
        }
        return !!(user.isGM || (permissions.player && user.hasRole(1)) || (permissions.trustedPlayer && user.hasRole(2)) || (permissions.assistantGameMaster && user.hasRole(3)) || (permissions.users && permissions.users.includes(user.id)));
    }

    /**
     * Generates the display text for this year
     * @param {boolean} selected If to use the selected/current year
     * @returns {string}
     */
    getDisplayName(selected: boolean = false): string {
        let dispName;
        const yearName = this.getYearName(selected? this.selectedYear : this.visibleYear);
        if(yearName){
            dispName = `${this.prefix} ${yearName} (${selected?this.selectedYear.toString():this.visibleYear.toString()}) ${this.postfix}`;
        } else {
            dispName = `${this.prefix !== '' ?this.prefix + ' ' : ''}${selected?this.selectedYear.toString():this.visibleYear.toString()}${this.postfix !== '' ? ' ' + this.postfix : ''}`;
        }
        return dispName;
    }

    /**
     * Returns the month where the passed in setting is tru
     * @param {string} [setting='current'] The setting to look for. Can be visible, current or selected
     */
    getMonth(setting: string = 'current'){
        const verifiedSetting = setting.toLowerCase() as 'visible' | 'current' | 'selected';
        return this.months.find(m => m[verifiedSetting]);
    }

    /**
     * Resents the setting for all months and days to false
     * @param {string} [setting='current']
     */
    resetMonths(setting: string = 'current'){
        const verifiedSetting = setting.toLowerCase() as 'visible' | 'current' | 'selected';
        this.months.forEach(m => {if(setting!=='visible'){m.resetDays(setting);} m[verifiedSetting] = false;});
    }

    setCurrentToVisible(){
        if(this.time.timeKeeper.getStatus() !== TimeKeeperStatus.Started){
            this.visibleYear = this.numericRepresentation;
            this.resetMonths('visible');
            const curMonth = this.getMonth();
            if(curMonth){
                curMonth.visible = true;
            }
        }
    }

    /**
     * Updates the specified setting for the specified month, also handles instances if the new month has 0 days
     * @param {number} month The index of the new month, -1 will be the last month
     * @param {string} setting The setting to update, can be 'visible', 'current' or 'selected'
     * @param {boolean} next If the change moved the calendar forward(true) or back(false) this is used to determine the direction to go if the new month has 0 days
     * @param {null|number} [setDay=null] If to set the months day to a specific one
     */
    updateMonth(month: number, setting: string, next: boolean, setDay: null | number = null){
        const verifiedSetting = setting.toLowerCase() as 'visible' | 'current' | 'selected';
        const yearToUse = verifiedSetting === 'current'? this.numericRepresentation : verifiedSetting === 'visible'? this.visibleYear : this.selectedYear;
        const isLeapYear = this.leapYearRule.isLeapYear(yearToUse);
        if(month === -1 || month >= this.months.length){
            month = this.months.length - 1;
        }
        //Get the current months current day
        let currentDay = next? 0 : -1;

        if(setDay !== null){
            currentDay = setDay;
        } else {
            const curMonth = this.getMonth();

            if(curMonth){
                const curDay = curMonth.getDay();
                if(curDay){
                    currentDay = curDay.numericRepresentation - 1;
                }
            }
        }

        //Reset all of the months settings
        this.resetMonths(setting);
        //If the month we are going to show has no days, skip it
        if((isLeapYear && this.months[month].numberOfLeapYearDays === 0) || (!isLeapYear && this.months[month].numberOfDays === 0)){
            Logger.debug(`The month "${this.months[month].name}" has no days skipping to ${next? 'next' : 'previous'} month.`);
            this.months[month][verifiedSetting] = true;
            return this.changeMonth((next? 1 : -1), setting, setDay);
        } else {
            this.months[month][verifiedSetting] = true;
        }

        // If we are adjusting the current date we need to propagate that down to the days of the new month as well
        // We also need to set the visibility of the new month to true
        if(verifiedSetting === 'current'){
            Logger.debug(`New Month: ${this.months[month].name}`);
            this.months[month].updateDay(currentDay, isLeapYear);
        }
    }

    /**
     * Changes the number of the currently active year
     * @param {number} amount The amount to change the year by
     * @param {boolean} updateMonth If to also update month
     * @param {string} [setting='visible'] The month property we are changing. Can be 'visible', 'current' or 'selected'
     * @param {null|number} [setDay=null] If to set the months day to a specific one
     */
    changeYear(amount: number, updateMonth: boolean = true, setting: string = 'visible', setDay: null | number = null){
        const verifiedSetting = setting.toLowerCase() as 'visible' | 'current' | 'selected';
        if(verifiedSetting === 'visible'){
            this.visibleYear = this.visibleYear + amount;
        } else if(verifiedSetting === 'selected'){
            this.selectedYear = this.selectedYear + amount;
        } else {
            this.numericRepresentation = this.numericRepresentation + amount;
            Logger.debug(`New Year: ${this.numericRepresentation}`);
        }
        if(this.months.length){
            if(updateMonth){
                let mIndex = 0;
                if(amount === -1){
                    mIndex = this.months.length - 1;
                }
                this.updateMonth(mIndex, setting, (amount > 0), setDay);
            }
        }
    }

    /**
     * Changes the current, visible or selected month forward or back one month
     * @param {boolean} amount If we are moving forward (true) or back (false) one month
     * @param {string} [setting='visible'] The month property we are changing. Can be 'visible', 'current' or 'selected'
     * @param {null|number} [setDay=null] If to set the months day to a specific one
     */
    changeMonth(amount: number, setting: string = 'visible', setDay: null | number = null): void{
        const verifiedSetting = setting.toLowerCase() as 'visible' | 'current' | 'selected';
        const next = amount > 0;
        for(let i = 0; i < this.months.length; i++){
            const month = this.months[i];
            if(month[verifiedSetting]){
                if(next && (i + amount) >= this.months.length){
                    Logger.debug(`Advancing the ${verifiedSetting} month (${i}) by more months (${amount}) than there are in the year (${this.months.length}), advancing the year by 1`);
                    this.changeYear(1, true, verifiedSetting, setDay);
                    const changeAmount = amount - (this.months.length - i);
                    if(changeAmount > 0){
                        this.changeMonth(changeAmount,verifiedSetting, setDay);
                    }
                } else if(!next && (i + amount) < 0){
                    this.changeYear(-1, true, verifiedSetting, setDay);
                    const changeAmount = amount + i + 1;
                    if(changeAmount < 0){
                        this.changeMonth(changeAmount,verifiedSetting, setDay);
                    }
                }
                else {
                    this.updateMonth(i+amount, setting, next, setDay);
                }
                break;
            }
        }
    }

    /**
     * Changes the current or selected day forward or back one day
     * @param {number} amount The number of days to change, positive forward, negative backwards
     * @param {string} [setting='current'] The day property we are changing. Can be 'current' or 'selected'
     */
    changeDay(amount: number, setting: string = 'current'){
        const verifiedSetting = setting.toLowerCase() as 'current' | 'selected';
        const yearToUse = verifiedSetting === 'current' ? this.numericRepresentation : this.selectedYear;
        const isLeapYear = this.leapYearRule.isLeapYear(yearToUse);
        const currentMonth = this.getMonth();
        if (currentMonth) {
            const next = amount > 0;
            let currentDayNumber = 1;
            const currentDay = currentMonth.getDay(verifiedSetting);
            if(currentDay){
                currentDayNumber = currentDay.numericRepresentation;
            }
            const lastDayOfCurrentMonth = isLeapYear? currentMonth.numberOfLeapYearDays : currentMonth.numberOfDays;
            if(next && currentDayNumber + amount > lastDayOfCurrentMonth){
                Logger.debug(`Advancing the ${verifiedSetting} day (${currentDayNumber}) by more days (${amount}) than there are in the month (${lastDayOfCurrentMonth}), advancing the month by 1`);
                this.changeMonth(1, verifiedSetting, 0);
                this.changeDay(amount - (lastDayOfCurrentMonth - currentDayNumber) - 1, verifiedSetting);
            } else if(!next && currentDayNumber + amount < 1){
                Logger.debug(`Advancing the ${verifiedSetting} day (${currentDayNumber}) by less days (${amount}) than there are in the month (${lastDayOfCurrentMonth}), advancing the month by -1`);
                this.changeMonth(-1, verifiedSetting, -1);
                this.changeDay(amount + currentDayNumber, verifiedSetting);
            } else{
               currentMonth.changeDay(amount, isLeapYear, verifiedSetting);
            }
        }
    }

    /**
     * Changes the passed in time type by the passed in amount
     * @param {boolean} next If we are going forward or backwards
     * @param {string} type The time type we are adjusting, can be hour, minute or second
     * @param {number} [clickedAmount=1] The amount to change by
     */
    changeTime(next: boolean, type: string, clickedAmount: number = 1){
        type = type.toLowerCase();
        const amount = next? clickedAmount : clickedAmount * -1;
        let dayChange = 0;
        this.timeChangeTriggered = true;
        if(type === 'hour'){
            dayChange = this.time.changeTime(amount);
        } else if(type === 'minute'){
            dayChange = this.time.changeTime(0, amount);
        } else if(type === 'second'){
            dayChange = this.time.changeTime(0, 0, amount);
        }

        if(dayChange !== 0){
            this.changeDay(dayChange);
        }
    }

    /**
     * Generates the total number of days in a year
     * @param {boolean} [leapYear=false] If to count the total number of days in a leap year
     * @param {boolean} [ignoreIntercalaryRules=false] If to ignore the intercalary rules and include the months days (used to match closer to about-time)
     * @return {number}
     */
    totalNumberOfDays(leapYear: boolean = false, ignoreIntercalaryRules: boolean = false): number {
        let total = 0;
        this.months.forEach((m) => {
            if((m.intercalary && m.intercalaryInclude) || !m.intercalary || ignoreIntercalaryRules){
                total += leapYear? m.numberOfLeapYearDays : m.numberOfDays;
            }
        });
        return total;
    }

    /**
     * Calculates the day of the week the first day of the currently visible month lands on
     * @return {number}
     */
    visibleMonthStartingDayOfWeek(): number {
        const visibleMonth = this.getMonth('visible');
        if(visibleMonth){
            if(visibleMonth.intercalary && !visibleMonth.intercalaryInclude){
                return 0;
            } else {
                return this.dayOfTheWeek(this.visibleYear, visibleMonth.numericRepresentation, 1);
            }
        } else {
            return 0;
        }
    }

    /**
     * Calculates the day of the week a passed in day falls on based on its month and year
     * @param {number} year The year of the date to find its day of the week
     * @param {number} targetMonth The month that the target day is in
     * @param {number} targetDay  The day of the month that we want to check
     * @return {number}
     */
    dayOfTheWeek(year: number, targetMonth: number, targetDay: number): number{
        if(this.weekdays.length){
            const month = this.months.find(m => m.numericRepresentation === targetMonth);
            let daysSoFar;
            if(month && month.startingWeekday !== null){
                daysSoFar = targetDay + month.startingWeekday - 2;
            } else {
                daysSoFar = this.dateToDays(year, targetMonth, targetDay) + (this.yearZero === 0 && this.leapYearRule.rule !== LeapYearRules.None? -1 : 0) + this.firstWeekday;
                //daysSoFar = this.dateToDays(year, targetMonth, targetDay) + this.firstWeekday;
            }
            return (daysSoFar % this.weekdays.length + this.weekdays.length) % this.weekdays.length;
        } else {
            return 0;
        }
    }

    /**
     * Converts the passed in date to the number of days that make up that date
     * @param {number} year The year to convert
     * @param {number} month The month to convert
     * @param {number} day The day to convert
     * @param {boolean} addLeapYearDiff If to add the leap year difference to the end result. Year 0 is not counted in the number of leap years so the total days will be off by that amount.
     * @param {boolean} [ignoreIntercalaryRules=false] If to ignore the intercalary rules and include the months days (used to match closer to about-time)
     */
    dateToDays(year: number, month: number, day: number, addLeapYearDiff: boolean = false, ignoreIntercalaryRules: boolean = false){
        const beforeYearZero = year < this.yearZero;
        const daysPerYear = this.totalNumberOfDays(false, ignoreIntercalaryRules);
        const daysPerLeapYear = this.totalNumberOfDays(true, ignoreIntercalaryRules);
        const leapYearDayDifference = daysPerLeapYear - daysPerYear;
        const monthIndex = this.months.findIndex(m => m.numericRepresentation === month);
        const isLeapYear = this.leapYearRule.isLeapYear(year);
        const numberOfLeapYears = this.leapYearRule.howManyLeapYears(year);
        const numberOfYZLeapYears = this.leapYearRule.howManyLeapYears(this.yearZero);
        let leapYearDays;
        let procYear = Math.abs(year - this.yearZero);

        if(beforeYearZero){
            procYear = procYear - 1;
        }
        let daysSoFar = (daysPerYear * procYear);
        if(day < 1){
            day = 1;
        }
        if(beforeYearZero){
            if(isLeapYear){
                leapYearDays = (numberOfYZLeapYears - (numberOfLeapYears + 1)) * leapYearDayDifference;
            } else {
                leapYearDays = (numberOfYZLeapYears - numberOfLeapYears) * leapYearDayDifference;
            }
            daysSoFar += leapYearDays;
            for(let i = this.months.length - 1; i >= 0; i--){
                if(i > monthIndex && (ignoreIntercalaryRules || !this.months[i].intercalary || (this.months[i].intercalary && this.months[i].intercalaryInclude))){
                    if(isLeapYear){
                        daysSoFar = daysSoFar + this.months[i].numberOfLeapYearDays;
                    } else {
                        daysSoFar = daysSoFar + this.months[i].numberOfDays;
                    }
                }
            }
            daysSoFar += (isLeapYear? this.months[monthIndex].numberOfLeapYearDays : this.months[monthIndex].numberOfDays) - day;
        } else {
            leapYearDays = Math.abs(numberOfLeapYears - numberOfYZLeapYears) * leapYearDayDifference;
            daysSoFar += leapYearDays;

            for(let i = 0; i < this.months.length; i++){
                //Only look at the month preceding the month we want and is not intercalary or is intercalary if the include setting is set otherwise skip
                if(i < monthIndex && (ignoreIntercalaryRules || !this.months[i].intercalary || (this.months[i].intercalary && this.months[i].intercalaryInclude))){
                    if(isLeapYear){
                        daysSoFar = daysSoFar + this.months[i].numberOfLeapYearDays;
                    } else {
                        daysSoFar = daysSoFar + this.months[i].numberOfDays;
                    }
                }
            }
            daysSoFar += day;
        }
        if(beforeYearZero){
            daysSoFar = daysSoFar + 1;
            if(year < 0 && this.yearZero === 0 && this.leapYearRule.rule !== LeapYearRules.None){
                daysSoFar--;
            }
        } else {
            daysSoFar = daysSoFar - 1;
        }
        if(year > 0 && this.yearZero === 0 && this.leapYearRule.rule !== LeapYearRules.None){
            daysSoFar++;
        }
        return beforeYearZero? daysSoFar * -1 : daysSoFar;
    }

    /**
     * Converts the years current date into seconds
     */
    toSeconds(addLeapYearDiff: boolean = true){
        let totalSeconds = 0;
        const month = this.getMonth();
        if(month){
            const day = month.getDay();
            //Get the days so for and add one to include the current day
            let daysSoFar = this.dateToDays(this.numericRepresentation, month.numericRepresentation, day? day.numericRepresentation : 1, addLeapYearDiff, true);
            totalSeconds = this.time.getTotalSeconds(daysSoFar);

            // If this is a Pathfinder 2E game, subtract the world creation seconds
            if(this.gameSystem === GameSystems.PF2E && this.generalSettings.pf2eSync){
                const newYZ = PF2E.newYearZero();
                if(newYZ !== undefined){
                    this.yearZero = 1875;
                    daysSoFar = this.dateToDays(this.numericRepresentation, month.numericRepresentation, day? day.numericRepresentation : 1, addLeapYearDiff, true);
                }
                daysSoFar++;
                totalSeconds =  this.time.getTotalSeconds(daysSoFar) - PF2E.getWorldCreateSeconds();
            }
        }
        return totalSeconds;
    }

    /**
     * Sets the current game world time to match what our current time is
     */
    async syncTime(force: boolean = false){
        // Only if the time tracking rules are set to self or mixed
        if(this.canUser(game.user, this.generalSettings.permissions.changeDateTime) && (this.generalSettings.gameWorldTimeIntegration === GameWorldTimeIntegrations.Self || this.generalSettings.gameWorldTimeIntegration === GameWorldTimeIntegrations.Mixed)){
            Logger.debug(`Year.syncTime()`);
            const totalSeconds = this.toSeconds();
            // If the calculated seconds are different from what is set in the game world time, update the game world time to match sc's time
            if(totalSeconds !== game.time.worldTime || force){
                //Let the local functions know that we all ready updated this time
                this.timeChangeTriggered = true;
                //Set the world time, this will trigger the setFromTime function on all connected players when the updateWorldTime hook is triggered
                await this.time.setWorldTime(totalSeconds);
            }
        }
    }

    /**
     * Convert a number of seconds to year, month, day, hour, minute, seconds
     * @param {number} seconds The seconds to convert
     */
    secondsToDate(seconds: number): DateTimeParts{
        const beforeYearZero = seconds < 0;
        seconds = Math.abs(seconds);
        let sec, min, hour, day = 0, dayCount, month = 0, year = 0;

        dayCount = Math.floor(seconds / this.time.secondsPerDay);
        seconds -= dayCount * this.time.secondsPerDay;

        hour = Math.floor(seconds / (this.time.secondsInMinute * this.time.minutesInHour) ) % this.time.hoursInDay;
        seconds -= hour * (this.time.secondsInMinute * this.time.minutesInHour);

        min = Math.floor(seconds / this.time.secondsInMinute) % this.time.secondsInMinute;
        seconds -= min * this.time.secondsInMinute;

        sec = seconds % 60

        if(beforeYearZero){
            if(hour > 0){
                hour = this.time.hoursInDay - hour - (sec > 0 || min > 0? 1 : 0);
            }
            if(min > 0){
                min = this.time.minutesInHour - min - (sec > 0? 1 : 0);
            }
            if(sec > 0){
                sec = this.time.secondsInMinute - sec;
            }

            year = this.yearZero - 1;
            let isLeapYear = this.leapYearRule.isLeapYear(year);
            month = this.months.length - 1;
            day = isLeapYear? this.months[month].numberOfLeapYearDays - 1 : this.months[month].numberOfDays - 1;

            if(sec === 0 && min === 0 && hour === 0){
                dayCount--;
            }
            while(dayCount > 0){
                const yearTotalDays = this.totalNumberOfDays(isLeapYear, true);
                const monthDays = isLeapYear? this.months[month].numberOfLeapYearDays : this.months[month].numberOfDays;
                if(dayCount >= yearTotalDays){
                    year = year - 1;
                    isLeapYear = this.leapYearRule.isLeapYear(year);
                    dayCount = dayCount - yearTotalDays;
                } else if(dayCount >= monthDays){
                    month = month - 1;
                    day = isLeapYear? this.months[month].numberOfLeapYearDays - 1 : this.months[month].numberOfDays - 1;
                    dayCount = dayCount - monthDays;
                } else {
                    day = day - 1;
                    dayCount = dayCount - 1;
                }
            }
        } else {
            year = this.yearZero;
            let isLeapYear = this.leapYearRule.isLeapYear(year);
            month = 0;
            day = 0;
            while(dayCount > 0){
                const yearTotalDays = this.totalNumberOfDays(isLeapYear, true);
                const monthDays = isLeapYear? this.months[month].numberOfLeapYearDays : this.months[month].numberOfDays;
                if(dayCount >= yearTotalDays){
                    year = year + 1;
                    isLeapYear = this.leapYearRule.isLeapYear(year);
                    dayCount = dayCount - yearTotalDays;
                } else if(dayCount >= monthDays){
                    month = month + 1;
                    dayCount = dayCount - monthDays;
                } else {
                    day = day + 1;
                    dayCount = dayCount - 1;
                }
            }
            if(year < 0){
                day++;
            }
        }
        return {
            year: year,
            month: month,
            day: day,
            hour: hour,
            minute: min,
            seconds: sec
        }
    }

    /**
     * Convert the passed in seconds into an interval of larger time
     * @param seconds
     */
    secondsToInterval(seconds: number): DateTimeIntervals {
        let sec = seconds, min = 0, hour = 0, day = 0, month = 0, year = 0;
        if(sec >= this.time.secondsInMinute){
            min = Math.floor(sec / this.time.secondsInMinute);
            sec = sec - (min * this.time.secondsInMinute);
        }
        if(min >= this.time.minutesInHour){
            hour = Math.floor(min / this.time.minutesInHour);
            min = min - (hour * this.time.minutesInHour);
        }
        let dayCount = 0;
        if(hour >= this.time.hoursInDay){
            dayCount = Math.floor(hour / this.time.hoursInDay);
            hour = hour - (dayCount * this.time.hoursInDay);
        }

        const daysInYear = this.totalNumberOfDays(false, false);
        const averageDaysInMonth = daysInYear / this.months.map(m => !m.intercalary).length;

        month = Math.floor(dayCount / averageDaysInMonth);
        day = dayCount - Math.round(month * averageDaysInMonth);

        year = Math.floor(month / this.months.length);
        month = month - Math.round(year * this.months.length);

        return {
            second: sec,
            minute: min,
            hour: hour,
            day: day,
            month: month,
            year: year
        };
    }

    /**
     * Updates the year's data with passed in date information
     * @param {DateTimeParts} parsedDate Interface that contains all of the individual parts of a date and time
     */
    updateTime(parsedDate: DateTimeParts){
        let isLeapYear = this.leapYearRule.isLeapYear(parsedDate.year);
        this.numericRepresentation = parsedDate.year;
        this.updateMonth(parsedDate.month, 'current', true);
        this.months[parsedDate.month].updateDay(parsedDate.day, isLeapYear);
        this.time.setTime(parsedDate.hour, parsedDate.minute, parsedDate.seconds);
    }

    /**
     * Sets the simple calendars year, month, day and time from a passed in number of seconds
     * @param {number} newTime The new time represented by seconds
     * @param {number} changeAmount The amount that the time has changed by
     */
    setFromTime(newTime: number, changeAmount: number){
        Logger.debug('Year.setFromTime()');

        // If this is a Pathfinder 2E game, add the world creation seconds
        if(this.gameSystem === GameSystems.PF2E && this.generalSettings.pf2eSync){
            newTime += PF2E.getWorldCreateSeconds();
            newTime -= this.time.secondsPerDay;
        }
        if(changeAmount !== 0){
            // If the tracking rules are for self or mixed and the clock is running then we make the change.
            if((this.generalSettings.gameWorldTimeIntegration === GameWorldTimeIntegrations.Self || this.generalSettings.gameWorldTimeIntegration === GameWorldTimeIntegrations.Mixed) && this.time.timeKeeper.getStatus() === TimeKeeperStatus.Started){
                Logger.debug(`Tracking Rule: Self/Mixed\nClock Is Running, no need to update the date.`)
                const parsedDate = this.secondsToDate(newTime);
                this.updateTime(parsedDate);
                this.time.timeKeeper.setClockTime(this.time.toString());
                if((this.time.updateFrequency * this.time.gameTimeRatio) !== changeAmount){
                    SimpleCalendar.instance.updateApp();
                }
            }
            // If the tracking rules are for self only and we requested the change OR the change came from a combat turn change
            else if((this.generalSettings.gameWorldTimeIntegration=== GameWorldTimeIntegrations.Self || this.generalSettings.gameWorldTimeIntegration === GameWorldTimeIntegrations.Mixed) && (this.timeChangeTriggered || this.combatChangeTriggered)){
                Logger.debug(`Tracking Rule: Self.\nTriggered Change: Simple Calendar/Combat Turn. Applying Change!`);
                //If we didn't request the change (from a combat change) we need to update the internal time to match the new world time
                if(!this.timeChangeTriggered){
                    const parsedDate = this.secondsToDate(newTime);
                    this.updateTime(parsedDate);
                    // If the current player is the GM then we need to save this new value to the database
                    // Since the current date is updated this will trigger an update on all players as well
                    if(GameSettings.IsGm() && SimpleCalendar.instance.primary){
                        GameSettings.SaveCurrentDate(this).catch(Logger.error);
                    }
                }
            }
            // If we didn't (locally) request this change then parse the new time into years, months, days and seconds and set those values
            // This covers other modules/built in features updating the world time and Simple Calendar updating to reflect those changes
            else if((this.generalSettings.gameWorldTimeIntegration === GameWorldTimeIntegrations.ThirdParty || this.generalSettings.gameWorldTimeIntegration === GameWorldTimeIntegrations.Mixed) && !this.timeChangeTriggered){
                Logger.debug('Tracking Rule: ThirdParty.\nTriggered Change: External Change. Applying Change!');
                const parsedDate = this.secondsToDate(newTime);
                this.updateTime(parsedDate);
                //We need to save the change so that when the game is reloaded simple calendar will display the correct time
                if(GameSettings.IsGm() && SimpleCalendar.instance.primary){
                    GameSettings.SaveCurrentDate(this).catch(Logger.error);
                }
            } else {
                Logger.debug(`Not Applying Change!`);
            }
        }
        Logger.debug('Resetting time change triggers.');
        this.timeChangeTriggered = false;
        this.combatChangeTriggered = false;
    }

    /**
     * Gets the current season based on the current date
     */
    getCurrentSeason() {
        let currentMonth = 0, currentDay = 0;

        const month = this.getMonth('visible');
        if(month){
            currentMonth = this.months.findIndex(m=> m.numericRepresentation === month.numericRepresentation);
            const day = month.getDay('selected') || month.getDay();
            if(day){
                currentDay = day.numericRepresentation;
            } else {
                currentDay = 1;
            }
        }
        if(currentDay > 0 && currentMonth >= 0){
            let currentSeason: Season | null = null;
            for(let i = 0; i < this.seasons.length; i++){
                const seasonMonthIndex = this.months.findIndex(m => m.numericRepresentation === this.seasons[i].startingMonth);
                if(seasonMonthIndex === currentMonth && this.seasons[i].startingDay <= currentDay){
                    currentSeason = this.seasons[i];
                } else if (seasonMonthIndex < currentMonth){
                    currentSeason = this.seasons[i];
                }
            }
            if(currentSeason === null){
                currentSeason = this.seasons[this.seasons.length - 1];
            }

            if(currentSeason){
                return {
                    name: currentSeason.name,
                    color: currentSeason.color === 'custom'? currentSeason.customColor : currentSeason.color
                };
            }
        }
        return {
            name: '',
            color: ''
        };
    }

    /**
     * Get the name of the current year
     * @param {number} yearToUse The year to use to get the current date
     */
    getYearName(yearToUse: number): string{
        let name = '';
        if(this.yearNames.length){
            let nameIndex = 0;
            if(this.yearNamingRule === YearNamingRules.Repeat){
                nameIndex = (((yearToUse - this.yearNamesStart) % this.yearNames.length) + this.yearNames.length) % this.yearNames.length;
            } else if(this.yearNamingRule === YearNamingRules.Random){
                const yearHash = this.randomHash(`${yearToUse}-AbCxYz`);
                nameIndex = (((yearHash - this.yearNamesStart) % this.yearNames.length) + this.yearNames.length) % this.yearNames.length;
            } else {
                nameIndex = Math.abs(this.yearNamesStart - yearToUse);
                if(nameIndex >= this.yearNames.length){
                    nameIndex = this.yearNames.length - 1;
                }
            }
            name = this.yearNames[nameIndex];
        }

        return name;
    }

    /**
     * Generates a random numeric value based on the passed in string.
     * @param {string} value The string to hash
     * @return {number} The number representing the hash value
     */
    randomHash(value: string) {
        let hash = 0;
        if (value.length == 0) {
            return hash;
        }
        for (let i = 0; i < value.length; i++) {
            let char = value.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }
}
