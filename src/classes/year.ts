import Month from "./month";
import {
    DateTime,
    DateTimeParts,
    DayTemplate,
    PermissionMatrix, YearConfig,
    YearTemplate
} from "../interfaces";
import {Logger} from "./logging";
import {Weekday} from "./weekday";
import LeapYear from "./leap-year";
import Time from "./time";
import {GameSystems, LeapYearRules, TimeKeeperStatus, YearNamingRules} from "../constants";
import {GameSettings} from "./game-settings";
import Season from "./season";
import Moon from "./moon";
import Note from "./note";
import SimpleCalendar from "./simple-calendar";
import PF2E from "./systems/pf2e";
import Utilities from "./utilities";
import Day from "./day";
import API from "./api";
import ConfigurationItemBase from "./configuration-item-base";

/**
 * Class for representing a year
 */
export default class Year extends ConfigurationItemBase {
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
     * All of the seasons for this calendar
     * @type {Array.<Season>}
     */
    seasons: Season[] = [];
    /**
     * All of the moons for this calendar
     * @type {Array.<Moon>}
     */
    moons: Moon[] =[];
    /**
     * A list of names to pull from for naming a year
     * @type {Array.<string>}
     */
    yearNames: string[] = [];
    /**
     * The year to start pulling from the name list
     * @type {number}
     */
    yearNamesStart: number = 0;
    /**
     * The rule around how to apply names to a given year
     * @type {YearNamingRules}
     */
    yearNamingRule: YearNamingRules = YearNamingRules.Default;

    /**
     * The Year constructor
     * @param {number} numericRepresentation The numeric representation of this year
     */
    constructor(numericRepresentation: number) {
        super('', numericRepresentation);
        this.selectedYear = numericRepresentation;
        this.visibleYear = numericRepresentation;
        this.leapYearRule = new LeapYear();
        this.time = new Time();
    }

    /**
     * Returns the configuration object for the year
     */
    toConfig(): YearConfig {
        return {
          id: this.id,
          numericRepresentation: this.numericRepresentation,
          prefix: this.prefix,
          postfix: this.postfix,
          showWeekdayHeadings: this.showWeekdayHeadings,
          firstWeekday: this.firstWeekday,
          yearZero: this.yearZero,
          yearNames: this.yearNames,
          yearNamingRule: this.yearNamingRule,
          yearNamesStart: this.yearNamesStart
        };
    }

    /**
     * Returns an object that is used to display the year in the HTML template
     * @returns {YearTemplate}
     */
    toTemplate(): YearTemplate{
        const currentMonth = this.getMonth();
        const visibleMonth = this.getMonth('visible');

        let sMoonsPhase = [], sNotes: Note[] = [], remNotes: Note[] = [];
        if(currentMonth){
            const d = currentMonth.getDay();
            if(d){
                if(this.moons.length){
                    for(let i = 0; i < this.moons.length; i++){
                        const phase = this.moons[i].getMoonPhase(this, 'current');
                        sMoonsPhase.push({
                            name: this.moons[i].name,
                            color: this.moons[i].color,
                            phase: this.moons[i].getMoonPhase(this, 'current'),
                            iconSVG: Utilities.GetMoonPhaseIcon(phase.icon, this.moons[i].color)
                        });
                    }
                }
                const notes = SimpleCalendar.instance.activeCalendar.notes.filter(n => n.isVisible(this.numericRepresentation, currentMonth.numericRepresentation, d.numericRepresentation));
                const userId = GameSettings.UserID();
                if(notes.length){
                    sNotes = notes.filter(n => n.remindUsers.indexOf(userId) === -1);
                    remNotes = notes.filter(n => n.remindUsers.indexOf(userId) !== -1);
                }
            }
        }
        const currentSeason = this.getCurrentSeason();

        let weeks: (boolean | DayTemplate)[][] = [];
        if(visibleMonth){
            weeks = this.daysIntoWeeks(visibleMonth, this.visibleYear, this.weekdays.length);
        }
        return {
            ...super.toTemplate(),
            currentSeasonName: currentSeason.name,
            currentSeasonColor: currentSeason.color,
            firstWeekday: this.firstWeekday,
            numericRepresentation: this.numericRepresentation,
            selectedDayMoons: sMoonsPhase,
            selectedDayNotes: {
                reminders: remNotes.length,
                normal: sNotes.length
            },
            showWeekdayHeaders: this.showWeekdayHeadings,
            visibleMonth: visibleMonth?.toTemplate(this),
            weekdays: this.weekdays.map(w => w.toTemplate()),
            weeks: weeks,
            yearZero: this.yearZero,
            yearNames: this.yearNames,
            yearNamesStart: this.yearNamesStart,
            yearNamingRule: this.yearNamingRule
        }
    }

    /**
     * Loads the year data from the config object.
     * @param {YearConfig} config The configuration object for this class
     */
    loadFromSettings(config: YearConfig) {
        if(config && Object.keys(config).length){
            Logger.debug('Setting the year from data.');
            if(config.hasOwnProperty('id')){
                this.id = config.id;
            }
            this.numericRepresentation = config.numericRepresentation;
            this.prefix = config.prefix;
            this.postfix = config.postfix;

            if(config.hasOwnProperty('showWeekdayHeadings')){
                this.showWeekdayHeadings = config.showWeekdayHeadings;
            }
            if(config.hasOwnProperty('firstWeekday')){
                this.firstWeekday = config.firstWeekday;
            }
            // Check to see if a year 0 has been set in the settings and use that
            if(config.hasOwnProperty('yearZero')){
                this.yearZero = config.yearZero;
            }

            if(config.hasOwnProperty('yearNames')){
                this.yearNames = config.yearNames;
            }
            if(config.hasOwnProperty('yearNamingRule')){
                this.yearNamingRule = config.yearNamingRule;
            }
            if(config.hasOwnProperty('yearNamesStart')){
                this.yearNamesStart = config.yearNamesStart;
            }
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
        const dayOfWeekOffset = this.monthStartingDayOfWeek(month, year);
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
        y.id = this.id;
        y.postfix = this.postfix;
        y.prefix = this.prefix;
        y.yearZero = this.yearZero;
        y.selectedYear = this.selectedYear;
        y.visibleYear = this.visibleYear;
        y.months = this.months.map(m => m.clone());
        y.weekdays = this.weekdays.map(w => w.clone());
        y.leapYearRule = this.leapYearRule.clone();
        y.showWeekdayHeadings = this.showWeekdayHeadings;
        y.firstWeekday = this.firstWeekday;
        y.time = this.time.clone();
        y.seasons = this.seasons.map(s => s.clone());
        y.moons = this.moons.map(m => m.clone());
        y.yearNames = this.yearNames.map(n => n);
        y.yearNamesStart = this.yearNamesStart;
        y.yearNamingRule = this.yearNamingRule;
        return y;
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
            let currentDayIndex = 0;
            const currentDay = currentMonth.getDay(verifiedSetting);
            if(currentDay){
                currentDayIndex = currentMonth.days.findIndex(d => d.numericRepresentation === (currentDay.numericRepresentation));
            }
            const lastDayOfCurrentMonth = isLeapYear? currentMonth.numberOfLeapYearDays : currentMonth.numberOfDays;
            if(next && currentDayIndex + amount >= lastDayOfCurrentMonth){
                Logger.debug(`Advancing the ${verifiedSetting} day (${currentDayIndex}) by more days (${amount}) than there are in the month (${lastDayOfCurrentMonth}), advancing the month by 1`);
                this.changeMonth(1, verifiedSetting, 0);
                this.changeDay(amount - (lastDayOfCurrentMonth - currentDayIndex), verifiedSetting);
            } else if(!next && currentDayIndex + amount < 0){
                Logger.debug(`Advancing the ${verifiedSetting} day (${currentDayIndex}) by less days (${amount}) than there are in the month (${lastDayOfCurrentMonth}), advancing the month by -1`);
                this.changeMonth(-1, verifiedSetting, -1);
                this.changeDay(amount + currentDayIndex + 1, verifiedSetting);
            } else{
               currentMonth.changeDay(amount, isLeapYear, verifiedSetting);
            }
        }
    }

    /**
     * Changes the current or selected day by the passed in amount. Adjusting for number of years first
     * @param amount
     * @param setting
     */
    changeDayBulk(amount: number, setting: string = 'current'){
        let isLeapYear = this.leapYearRule.isLeapYear(this.numericRepresentation);
        let numberOfDays = this.totalNumberOfDays(isLeapYear, true);
        while(amount > numberOfDays){
            this.changeYear(1, false, setting);
            amount -= numberOfDays;
            isLeapYear = this.leapYearRule.isLeapYear(this.numericRepresentation);
            numberOfDays = this.totalNumberOfDays(isLeapYear, true);
        }
        this.changeDay(amount, setting);
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
     * @param {Month} month The month to get the starting day of the week for
     * @param {number} year The year the check
     * @return {number}
     */
    monthStartingDayOfWeek(month: Month, year: number): number {
        if(month){
            if(month.intercalary && !month.intercalaryInclude){
                return 0;
            } else {
                return this.dayOfTheWeek(year, month.numericRepresentation, 1);
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
            const pf2eAdjust = PF2E.weekdayAdjust();
            if(pf2eAdjust !== undefined){
                this.firstWeekday = pf2eAdjust;
            }

            const month = this.months.find(m => m.numericRepresentation === targetMonth);
            let daysSoFar;
            if(month && month.startingWeekday !== null){
                daysSoFar = targetDay + month.startingWeekday - 2;
            } else {
                daysSoFar = this.dateToDays(year, targetMonth, targetDay) + this.firstWeekday;
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
        let monthIndex = this.months.findIndex(m => m.numericRepresentation === month);
        const isLeapYear = this.leapYearRule.isLeapYear(year);
        const numberOfLeapYears = this.leapYearRule.howManyLeapYears(year);
        const numberOfYZLeapYears = this.leapYearRule.howManyLeapYears(this.yearZero);
        let leapYearDays;
        let procYear = Math.abs(year - this.yearZero);

        if(monthIndex < 0){
            monthIndex = 0;
        }

        if(beforeYearZero){
            procYear = procYear - 1;
        }
        //If the month has a day offset set we need to remove that from the days numeric representation or too many days are calculated.
        day = day - this.months[monthIndex].numericRepresentationOffset;

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
            if(year <= 0 && this.leapYearRule.rule !== LeapYearRules.None){
                if(this.yearZero === 0 && !isLeapYear){
                    daysSoFar -= leapYearDayDifference;
                } else if(this.yearZero !== 0 && isLeapYear){
                    daysSoFar += leapYearDayDifference;
                }
            }
        } else {
            daysSoFar = daysSoFar - 1;
        }
        if(year > 0 && this.yearZero === 0 && this.leapYearRule.rule !== LeapYearRules.None){
            daysSoFar += leapYearDayDifference;
        }
        return beforeYearZero? daysSoFar * -1 : daysSoFar;
    }

    /**
     * Converts the years current date into seconds
     */
    toSeconds(){
        let totalSeconds = 0;
        const month = this.getMonth();
        if(month){
            const day = month.getDay();
            totalSeconds = Utilities.ToSeconds(this.numericRepresentation, month.numericRepresentation, day? day.numericRepresentation : 1, true, this);
        }
        return totalSeconds;
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
                let monthDays = isLeapYear? this.months[month].numberOfLeapYearDays : this.months[month].numberOfDays;
                if(dayCount >= yearTotalDays){
                    year = year - 1;
                    isLeapYear = this.leapYearRule.isLeapYear(year);
                    monthDays = isLeapYear? this.months[month].numberOfLeapYearDays : this.months[month].numberOfDays;
                    dayCount = dayCount - yearTotalDays;
                } else if(dayCount >= monthDays){
                    month = month - 1;
                    //Check the new month to see if it has days for this year, if not then skip to the previous months until a month with days this year is found.
                    let newMonthDays = isLeapYear? this.months[month].numberOfLeapYearDays : this.months[month].numberOfDays;
                    let safetyCounter = 0
                    while(newMonthDays === 0 && safetyCounter <= this.months.length){
                        month--;
                        newMonthDays = isLeapYear? this.months[month].numberOfLeapYearDays : this.months[month].numberOfDays;
                        safetyCounter++;
                    }
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
                    //Check the new month to see if it has days for this year, if not then skip to the next months until a month with days this year is found.
                    let newMonthDays = isLeapYear? this.months[month].numberOfLeapYearDays : this.months[month].numberOfDays;
                    let safetyCounter = 0
                    while(newMonthDays === 0 && safetyCounter <= this.months.length){
                        month++;
                        newMonthDays = isLeapYear? this.months[month].numberOfLeapYearDays : this.months[month].numberOfDays;
                        safetyCounter++;
                    }
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
    secondsToInterval(seconds: number): DateTime {
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

        const season = this.getSeason(currentMonth, currentDay);
        return {
            name: season.name,
            color: season.color
        };
    }

    /**
     * Gets the season for the passed in month and day
     * @param {number} monthIndex The index of the month
     * @param {number} day The day number
     */
    getSeason(monthIndex: number, day: number) {
        let season = new Season('', 1, 1);
        if(day > 0 && monthIndex >= 0){
            let currentSeason: Season | null = null;

            const sortedSeasons = this.seasons.sort((a, b) => {
                const aIndex = this.months.findIndex(m => m.numericRepresentation === a.startingMonth);
                const bIndex = this.months.findIndex(m => m.numericRepresentation === b.startingMonth);
                return aIndex - bIndex || a.startingDay - b.startingDay;
            });

            for(let i = 0; i < sortedSeasons.length; i++){
                const seasonMonthIndex = this.months.findIndex(m => m.numericRepresentation === sortedSeasons[i].startingMonth);
                if(seasonMonthIndex === monthIndex && sortedSeasons[i].startingDay <= day){
                    currentSeason = sortedSeasons[i];
                } else if (seasonMonthIndex < monthIndex){
                    currentSeason = sortedSeasons[i];
                }
            }
            if(currentSeason === null){
                currentSeason = sortedSeasons[sortedSeasons.length - 1];
            }

            if(currentSeason){
                season = currentSeason.clone();
            }
        }
        if(this.months.length > 0){
            season.startingMonth = this.months.findIndex(m => m.numericRepresentation === season.startingMonth);
            season.startingDay = this.months[season.startingMonth >= 0? season.startingMonth : 0].days.findIndex(d => d.numericRepresentation === season.startingDay);
        }
        return season;
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
                const yearHash = Utilities.randomHash(`${yearToUse}-AbCxYz`);
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
     * If we have determined that the system does not change the world time when a combat round is changed we run this function to update the time by the set amount.
     * @param {Combat} combat The current active combat
     */
    processOwnCombatRoundTime(combat: Combat){
        let roundSeconds = this.time.secondsInCombatRound;
        let roundsPassed = 1;

        if(combat.hasOwnProperty('previous') && combat['previous'].round){
            roundsPassed = combat.round - combat['previous'].round;
        }
        if(roundSeconds !== 0 && roundsPassed !== 0){
            const parsedDate = this.secondsToDate(this.toSeconds() + (roundSeconds * roundsPassed));
            this.updateTime(parsedDate);
            // If the current player is the GM then we need to save this new value to the database
            // Since the current date is updated this will trigger an update on all players as well
            if(GameSettings.IsGm() && SimpleCalendar.instance.primary){
                GameSettings.SaveCurrentDate(this).catch(Logger.error);
            }
        }
    }

    /**
     * Calculates the sunrise or sunset time for the passed in date, based on the the season setup
     * @param {number} year The year of the date
     * @param {Month} month The month object of the date
     * @param {Day} day The day object of the date
     * @param {boolean} [sunrise=true] If to calculate the sunrise or sunset
     * @param {boolean} [calculateTimestamp=true] If to add the date timestamp to the sunrise/sunset time
     */
    getSunriseSunsetTime(year: number, month: Month, day: Day, sunrise: boolean = true, calculateTimestamp: boolean = true){
        const monthIndex = this.months.findIndex(m => m.numericRepresentation === month.numericRepresentation);
        const dayIndex = month.days.findIndex(d => d.numericRepresentation === day.numericRepresentation);

        const sortedSeasons = this.seasons.sort((a, b) => {
            const aIndex = this.months.findIndex(m => m.numericRepresentation === a.startingMonth);
            const bIndex = this.months.findIndex(m => m.numericRepresentation === b.startingMonth);
            return aIndex - bIndex || a.startingDay - b.startingDay;
        });
        let seasonIndex = sortedSeasons.length - 1;
        for(let i = 0; i < sortedSeasons.length; i++){
            const seasonMonthIndex = this.months.findIndex(m => m.numericRepresentation === sortedSeasons[i].startingMonth);
            if(seasonMonthIndex === monthIndex && sortedSeasons[i].startingDay <= day.numericRepresentation){
                seasonIndex = i;
            } else if (seasonMonthIndex < monthIndex){
                seasonIndex = i;
            }
        }
        const nextSeasonIndex = (seasonIndex + 1) % this.seasons.length;
        if(seasonIndex < sortedSeasons.length && nextSeasonIndex < sortedSeasons.length){
            let season = sortedSeasons[seasonIndex];
            const nextSeason = sortedSeasons[nextSeasonIndex];
            let seasonYear = year;
            let nextSeasonYear = seasonYear;

            //If the current season is the last season of the year we need to check to see if the year for this season is the year before the current date
            if(seasonIndex === sortedSeasons.length - 1){
                if(this.months[monthIndex].numericRepresentation < sortedSeasons[seasonIndex].startingMonth || (sortedSeasons[seasonIndex].startingMonth === this.months[monthIndex].numericRepresentation && this.months[monthIndex].days[dayIndex].numericRepresentation < sortedSeasons[seasonIndex].startingDay)){
                    seasonYear = year - 1;
                }
                nextSeasonYear = seasonYear + 1
            }
            const daysBetweenSeasonStartAndDay = Utilities.DaysBetweenDates(
                { year: seasonYear, month: season.startingMonth, day: season.startingDay, hour: 0, minute: 0, seconds: 0 },
                { year: year, month: this.months[monthIndex].numericRepresentation, day: this.months[monthIndex].days[dayIndex].numericRepresentation, hour: 0, minute: 0, seconds: 0 }
            );
            const daysBetweenSeasons = Utilities.DaysBetweenDates(
                { year: seasonYear, month: season.startingMonth, day: season.startingDay, hour: 0, minute: 0, seconds: 0 },
                { year: nextSeasonYear, month: nextSeason.startingMonth, day: nextSeason.startingDay, hour: 0, minute: 0, seconds: 0 }
            );
            const diff = sunrise? nextSeason.sunriseTime - season.sunriseTime : nextSeason.sunsetTime - season.sunsetTime;
            const averageChangePerDay = diff / daysBetweenSeasons;
            const sunriseChangeForDay = daysBetweenSeasonStartAndDay * averageChangePerDay;
            const finalSunriseTime = Math.round((sunrise? season.sunriseTime : season.sunsetTime) + sunriseChangeForDay);
            if(calculateTimestamp){
                return API.dateToTimestamp({ year: year, month: monthIndex, day: dayIndex, hour: 0, minute: 0, second: 0 }) + finalSunriseTime;
            } else {
                return finalSunriseTime;
            }
        }
        return 0;
    }
}
