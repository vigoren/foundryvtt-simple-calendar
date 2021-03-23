import Month from "./month";
import {GeneralSettings, YearTemplate} from "../interfaces";
import {Logger} from "./logging";
import {Weekday} from "./weekday";
import LeapYear from "./leap-year";
import Time from "./time";
import {GameWorldTimeIntegrations} from "../constants";
import {GameSettings} from "./game-settings";

/**
 * Class for representing a year
 */
export default class Year {
    /**
     * The numeric representation of this year
     */
    numericRepresentation: number;
    /**
     * Any prefix to use for this year to display before its name
     */
    prefix: string = '';
    /**
     * Any postfix to use for this year to display after its name
     */
    postfix: string = '';
    /**
     * A list of all the months in this year
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
     * The leap year rules for the calendar
     * @type {LeapYear}
     */
    leapYearRule: LeapYear;

    time: Time;

    timeChangeTriggered: boolean = false;

    combatChangeTriggered: boolean = false;

    /**
     * The default general settings for the simple calendar
     */
    generalSettings: GeneralSettings = {
        gameWorldTimeIntegration: GameWorldTimeIntegrations.None,
        showClock: false
    };

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
    }

    /**
     * Returns an object that is used to display the year in the HTML template
     * @returns {YearTemplate}
     */
    toTemplate(): YearTemplate{
        const currentMonth = this.getMonth();
        const selectedMonth = this.getMonth('selected');

        let sMonth = '', sDay = '';
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
            }
        }
        return {
            display: this.getDisplayName(),
            selectedDisplayYear: this.getDisplayName(true),
            selectedDisplayMonth: sMonth,
            selectedDisplayDay: sDay,
            numericRepresentation: this.numericRepresentation,
            weekdays: this.weekdays.map(w => w.toTemplate()),
            showWeekdayHeaders: this.showWeekdayHeadings,
            visibleMonth: this.getMonth('visible')?.toTemplate(this.leapYearRule.isLeapYear(this.visibleYear)),
            visibleMonthWeekOffset:  Array(this.visibleMonthStartingDayOfWeek()).fill(0),
            showClock: this.generalSettings.showClock,
            clockClass: this.time.getClockClass(),
            showTimeControls: this.generalSettings.showClock && this.generalSettings.gameWorldTimeIntegration !== GameWorldTimeIntegrations.ThirdParty,
            showDateControls: this.generalSettings.gameWorldTimeIntegration !== GameWorldTimeIntegrations.ThirdParty,
            currentTime: this.time.getCurrentTime()
        }
    }

    /**
     * Creates a new year object with the exact same settings as this year
     * @return {Year}
     */
    clone(): Year {
        const y = new Year(this.numericRepresentation);
        y.postfix = this.postfix;
        y.prefix = this.prefix;
        y.selectedYear = this.selectedYear;
        y.visibleYear = this.visibleYear;
        y.months = this.months.map(m => m.clone());
        y.weekdays = this.weekdays.map(w => w.clone());
        y.leapYearRule.rule = this.leapYearRule.rule;
        y.leapYearRule.customMod = this.leapYearRule.customMod;
        y.showWeekdayHeadings = this.showWeekdayHeadings;
        y.time = this.time.clone();
        y.generalSettings.gameWorldTimeIntegration = this.generalSettings.gameWorldTimeIntegration;
        y.generalSettings.showClock = this.generalSettings.showClock;
        return y;
    }

    /**
     * Generates the display text for this year
     * @param {boolean} selected If to use the selected/current year
     * @returns {string}
     */
    getDisplayName(selected: boolean = false): string {
        if(selected){
            return `${this.prefix}${this.selectedYear.toString()}${this.postfix}`;
        } else {
            return `${this.prefix}${this.visibleYear.toString()}${this.postfix}`;
        }
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

    /**
     * Updates the specified setting for the specified month, also handles instances if the new month has 0 days
     * @param {number} month The index of the new month, -1 will be the last month
     * @param {string} setting The setting to update, can be 'visible', 'current' or 'selected'
     * @param {boolean} next If the change moved the calendar forward(true) or back(false) this is used to determine the direction to go if the new month has 0 days
     */
    updateMonth(month: number, setting: string, next: boolean){
        const verifiedSetting = setting.toLowerCase() as 'visible' | 'current' | 'selected';
        const yearToUse = verifiedSetting === 'current'? this.numericRepresentation : verifiedSetting === 'visible'? this.visibleYear : this.selectedYear;
        const isLeapYear = this.leapYearRule.isLeapYear(yearToUse);
        this.resetMonths(setting);
        if(month === -1 || month >= this.months.length){
            month = this.months.length - 1;
        }
        //If the month we are going to show has no days, skip it
        if((isLeapYear && this.months[month].numberOfLeapYearDays === 0) || (!isLeapYear && this.months[month].numberOfDays === 0)){
            Logger.debug(`The month "${this.months[month].name}" has no days skipping to ${next? 'next' : 'previous'} month.`);
            this.months[month][verifiedSetting] = true;
            return this.changeMonth((next? 1 : -1), setting);
        } else {
            this.months[month][verifiedSetting] = true;
        }

        // If we are adjusting the current date we need to propagate that down to the days of the new month as well
        // We also need to set the visibility of the new month to true
        if(verifiedSetting === 'current'){
            //this.months[month].visible = false;
            this.resetMonths('visible');
            Logger.debug(`New Month: ${this.months[month].name}`);
            this.months[month].visible = true;
            this.months[month].updateDay(next? 0 : -1, isLeapYear);
        }
    }

    /**
     * Changes the number of the currently active year
     * @param {number} amount The amount to change the year by
     * @param {boolean} updateMonth If to also update month
     * @param {string} [setting='visible'] The month property we are changing. Can be 'visible', 'current' or 'selected'
     */
    changeYear(amount: number, updateMonth: boolean = true, setting: string = 'visible'){
        const verifiedSetting = setting.toLowerCase() as 'visible' | 'current' | 'selected';
        if(verifiedSetting === 'visible'){
            this.visibleYear = this.visibleYear + amount;
        } else if(verifiedSetting === 'selected'){
            this.selectedYear = this.selectedYear + amount;
        } else {
            this.numericRepresentation = this.numericRepresentation + amount;
            this.visibleYear = this.numericRepresentation;
            Logger.debug(`New Year: ${this.numericRepresentation}`);
        }
        if(this.months.length){
            if(updateMonth){
                let mIndex = 0;
                if(amount === -1){
                    mIndex = this.months.length - 1;
                }
                this.updateMonth(mIndex, setting, (amount > 0));
            }
        }
    }

    /**
     * Changes the current, visible or selected month forward or back one month
     * @param {boolean} amount If we are moving forward (true) or back (false) one month
     * @param {string} [setting='visible'] The month property we are changing. Can be 'visible', 'current' or 'selected'
     */
    changeMonth(amount: number, setting: string = 'visible'): void{
        const verifiedSetting = setting.toLowerCase() as 'visible' | 'current' | 'selected';
        const next = amount > 0;

        for(let i = 0; i < this.months.length; i++){
            const month = this.months[i];
            if(month[verifiedSetting]){
                if((next && i === (this.months.length - amount)) || (!next && i === Math.abs(amount) - 1)){
                    Logger.debug(`On ${next? 'last' : 'first'} month of the year, changing to ${next? 'next' : 'previous'} year`);
                    //We will never advance more than 1 year when changing months
                    this.changeYear(next? 1 : -1, true, verifiedSetting);
                } else {
                    this.updateMonth(i+amount, setting, next);
                }
                break;
            }
        }
    }

    /**
     * Changes the current or selected day forward or back one day
     * @param {boolean} next If we are moving forward (true) or back (false) one day
     * @param {string} [setting='current'] The day property we are changing. Can be 'current' or 'selected'
     */
    changeDay(next: boolean, setting: string = 'current'){
        const verifiedSetting = setting.toLowerCase() as 'current' | 'selected';
        const currentMonth = this.getMonth();
        if (currentMonth) {
            const yearToUse = verifiedSetting === 'current' ? this.numericRepresentation : this.selectedYear;
            const isLeapYear = this.leapYearRule.isLeapYear(yearToUse);
            const res = currentMonth.changeDay(next, isLeapYear, verifiedSetting);
            // If it is positive or negative we need to change the current month
            if (res !== 0) {
                this.changeMonth(res, verifiedSetting);
            }
        }
    }

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
            this.changeDay(dayChange > 0);
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
            const daysSoFar = this.dateToDays(year, targetMonth, targetDay) - 1;
            return (daysSoFar% this.weekdays.length + this.weekdays.length) % this.weekdays.length;
        } else {
            return 0;
        }
    }

    /**
     * Converts the passed in date to the number of days that make up that date
     * @param {number} year The year to convert
     * @param {number} month The month to convert
     * @param {number} day The day to convert
     * @param {boolean} addLeapYearDiff If to add the leap your difference to the end result. Year 0 is not counted in the number of leap years so the total days will be off by that amount.
     * @param {boolean} [ignoreIntercalaryRules=false] If to ignore the intercalary rules and include the months days (used to match closer to about-time)
     */
    dateToDays(year: number, month: number, day: number, addLeapYearDiff: boolean = false, ignoreIntercalaryRules: boolean = false){
        const daysPerYear = this.totalNumberOfDays(false, ignoreIntercalaryRules);
        const daysPerLeapYear = this.totalNumberOfDays(true, ignoreIntercalaryRules);
        const leapYearDayDifference = daysPerLeapYear - daysPerYear;
        const numberOfLeapYears = this.leapYearRule.howManyLeapYears(year);
        const isLeapYear = this.leapYearRule.isLeapYear(year);
        let daysSoFar = (daysPerYear * year) + (numberOfLeapYears * leapYearDayDifference);
        for(let i = 0; i < this.months.length; i++){
            //Only look at the month preceding the month we want and is not intercalary or is intercalary if the include setting is set otherwise skip
            if(this.months[i].numericRepresentation < month && (ignoreIntercalaryRules || !this.months[i].intercalary || (this.months[i].intercalary && this.months[i].intercalaryInclude))){
                if(isLeapYear){
                    daysSoFar = daysSoFar + this.months[i].numberOfLeapYearDays;
                } else {
                    daysSoFar = daysSoFar + this.months[i].numberOfDays;
                }
            }
        }
        if(day < 1){
            day = 1;
        }
        daysSoFar += day;
        if(addLeapYearDiff){
            daysSoFar += leapYearDayDifference;
        }
        return daysSoFar;
    }

    /**
     * Sets the current game world time to match what our current time is
     */
    async syncTime(){
        // Only GMs can sync the time
        // Only if the time tracking rules are set to self or mixed
        if(GameSettings.IsGm() && (this.generalSettings.gameWorldTimeIntegration === GameWorldTimeIntegrations.Self || this.generalSettings.gameWorldTimeIntegration === GameWorldTimeIntegrations.Mixed)){
            Logger.debug(`Year.syncTime()`);
            const month = this.getMonth();
            if(month){
                const day = month.getDay();
                //Get the days so for and add one to include the current day - Subtract one day to keep it in time with how about-time keeps track
                const daysSoFar = this.dateToDays(this.numericRepresentation, month.numericRepresentation, day? day.numericRepresentation : 1, true, true) - 1;
                const totalSeconds = this.time.getTotalSeconds(daysSoFar);
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
    secondsToDate(seconds: number){
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
        // Add one day to keep the time in sync with how about-time does it
        dayCount++;
        let daysProcessed = 0;
        while(dayCount > 0){
            let isLeapYear = this.leapYearRule.isLeapYear(year);
            for(let i = 0; i < this.months.length; i ++){
                if(!this.months[i].intercalary || (this.months[i].intercalary && this.months[i].intercalaryInclude)){
                    const daysInMonth = isLeapYear? this.months[i].numberOfLeapYearDays : this.months[i].numberOfDays;
                    month = i;
                    if(dayCount < daysInMonth) {
                        day = dayCount;
                    }
                    daysProcessed += daysInMonth;
                    dayCount -= daysInMonth;
                    if(dayCount <= 0){
                        break;
                    }
                }
            }
            if(dayCount > 0){
                year++;
            }
        }
        return {
            year: year,
            month: month,
            day: day,
            hour: hour,
            minute: min,
            second: sec
        }
    }

    /**
     * Updates the year's data with passed in date information
     * @param parsedDate
     */
    updateTime(parsedDate: any){
        this.numericRepresentation = parsedDate.year;
        this.updateMonth(parsedDate.month, 'current', true);
        this.months[parsedDate.month].updateDay(parsedDate.day-1, this.leapYearRule.isLeapYear(parsedDate.year));
        this.time.setTime(parsedDate.hour, parsedDate.minute, parsedDate.second);
    }

    /**
     * Sets the simple calendars year, month, day and time from a passed in number of seconds
     * @param {number} newTime The new time represented by seconds
     * @param {number} changeAmount The amount that the time has changed by
     */
    setFromTime(newTime: number, changeAmount: number){
        Logger.debug('Year.setFromTime()');
        if(changeAmount !== 0){
            // If the tracking rules are for self only and we requested the change OR the change came from a combat turn change
            if((this.generalSettings.gameWorldTimeIntegration=== GameWorldTimeIntegrations.Self || this.generalSettings.gameWorldTimeIntegration === GameWorldTimeIntegrations.Mixed) && (this.timeChangeTriggered || this.combatChangeTriggered)){
                Logger.debug(`Tracking Rule: Self.\nTriggered Change: Simple Calendar/Combat Turn. Applying Change!`);
                //If we didn't request the change (from a combat change) we need to update the internal time to match the new world time
                if(!this.timeChangeTriggered){
                    const parsedDate = this.secondsToDate(newTime);
                    this.updateTime(parsedDate);
                }
                // If the current player is the GM then we need to save this new value to the database
                // Since the current date is updated this will trigger an update on all players as well
                if(GameSettings.IsGm()){
                    GameSettings.SaveCurrentDate(this).catch(Logger.error);
                }
            }
            // If we didn't (locally) request this change then parse the new time into years, months, days and seconds and set those values
            // This covers other modules/built in features updating the world time and Simple Calendar updating to reflect those changes
            else if((this.generalSettings.gameWorldTimeIntegration === GameWorldTimeIntegrations.ThirdParty || this.generalSettings.gameWorldTimeIntegration === GameWorldTimeIntegrations.Mixed) && !this.timeChangeTriggered){
                Logger.debug('Tracking Rule: ThirdParty.\nTriggered Change: External Change. Applying Change!');
                const parsedDate = this.secondsToDate(newTime);
                this.updateTime(parsedDate);
                //We need to save the change so that when the game is reloaded simple calendar will display the correct time
                if(GameSettings.IsGm()){
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
}
