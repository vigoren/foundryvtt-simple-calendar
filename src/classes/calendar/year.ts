import Month from "./month";
import LeapYear from "./leap-year";
import {LeapYearRules, YearNamingRules} from "../../constants";
import ConfigurationItemBase from "../configuration/configuration-item-base";
import {randomHash} from "../utilities/string";

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
    }

    /**
     * Returns the configuration object for the year
     */
    toConfig(): SimpleCalendar.YearData {
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
     * @returns {SimpleCalendar.HandlebarTemplateData.Year}
     */
    toTemplate(): SimpleCalendar.HandlebarTemplateData.Year{
        return {
            ...super.toTemplate(),
            firstWeekday: this.firstWeekday,
            numericRepresentation: this.numericRepresentation,
            yearZero: this.yearZero,
            yearNames: this.yearNames,
            yearNamesStart: this.yearNamesStart,
            yearNamingRule: this.yearNamingRule
        }
    }

    /**
     * Loads the year data from the config object.
     * @param {YearData} config The configuration object for this class
     */
    loadFromSettings(config: SimpleCalendar.YearData) {
        if(config && Object.keys(config).length){
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
        y.leapYearRule = this.leapYearRule.clone();
        y.showWeekdayHeadings = this.showWeekdayHeadings;
        y.firstWeekday = this.firstWeekday;
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

    getMonthIndex(setting: string = 'current'){
        const verifiedSetting = setting.toLowerCase() as 'visible' | 'current' | 'selected';
        return this.months.findIndex(m => m[verifiedSetting]);
    }

    getMonthAndDayIndex(setting: string = 'current'){
        const verifiedSetting = setting.toLowerCase() as 'visible' | 'current' | 'selected';
        const result: Partial<SimpleCalendar.Date> = {
            month: 0,
            day: 0
        };
        const mIndex = this.months.findIndex(m => m[verifiedSetting]);
        if(mIndex > -1){
            result.month = mIndex;
            const dIndex = this.months[mIndex].getDayIndex(verifiedSetting);
            if(dIndex > -1){
                result.day = dIndex;
            }
        } else {
            result.month = undefined;
        }
        return result;
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
        this.visibleYear = this.numericRepresentation;
        this.resetMonths('visible');
        const curMonth = this.getMonth();
        if(curMonth){
            curMonth.visible = true;
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
            const currentMonthDayIndex = this.getMonthAndDayIndex();
            currentDay = currentMonthDayIndex.day || 0;
        }

        //Reset all the months settings
        this.resetMonths(setting);
        //If the month we are going to show has no days, skip it
        if((isLeapYear && this.months[month].numberOfLeapYearDays === 0) || (!isLeapYear && this.months[month].numberOfDays === 0)){
            this.months[month][verifiedSetting] = true;
            return this.changeMonth((next? 1 : -1), setting, setDay);
        } else {
            this.months[month][verifiedSetting] = true;
        }

        // If we are adjusting the current date we need to propagate that down to the days of the new month as well
        // We also need to set the visibility of the new month to true
        if(verifiedSetting === 'current'){
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
            let currentDayIndex = currentMonth.getDayIndex();
            const lastDayOfCurrentMonth = isLeapYear? currentMonth.numberOfLeapYearDays : currentMonth.numberOfDays;
            if(next && currentDayIndex + amount >= lastDayOfCurrentMonth){
                this.changeMonth(1, verifiedSetting, 0);
                this.changeDay(amount - (lastDayOfCurrentMonth - currentDayIndex), verifiedSetting);
            } else if(!next && currentDayIndex + amount < 0){
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
     * Converts the passed in date to the number of days that make up that date
     * @param {number} year The year to convert
     * @param {number} monthIndex The index of the month to convert
     * @param {number} dayIndex The day to convert
     * @param {boolean} addLeapYearDiff If to add the leap year difference to the end result. Year 0 is not counted in the number of leap years so the total days will be off by that amount.
     * @param {boolean} [ignoreIntercalaryRules=false] If to ignore the intercalary rules and include the months days (used to match closer to about-time)
     */
    dateToDays(year: number, monthIndex: number, dayIndex: number, addLeapYearDiff: boolean = false, ignoreIntercalaryRules: boolean = false){
        const beforeYearZero = year < this.yearZero;
        const daysPerYear = this.totalNumberOfDays(false, ignoreIntercalaryRules);
        const daysPerLeapYear = this.totalNumberOfDays(true, ignoreIntercalaryRules);
        const leapYearDayDifference = daysPerLeapYear - daysPerYear;
        const isLeapYear = this.leapYearRule.isLeapYear(year);
        const numberOfLeapYears = this.leapYearRule.howManyLeapYears(year);
        const numberOfYZLeapYears = this.leapYearRule.howManyLeapYears(this.yearZero);
        let leapYearDays;
        let procYear = Math.abs(year - this.yearZero);

        if(monthIndex < 0){
            monthIndex = 0;
        } else if(monthIndex > this.months.length){
            monthIndex = this.months.length - 1;
        }

        if(beforeYearZero) {
            procYear = procYear - 1;
        }
        //If the month has a day offset set we need to remove that from the days numeric representation or too many days are calculated.
        let daysIntoMonth = dayIndex - this.months[monthIndex].numericRepresentationOffset + 1;

        let daysSoFar = (daysPerYear * procYear);
        if(daysIntoMonth < 1){
            daysIntoMonth = 1;
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
            daysSoFar += (isLeapYear? this.months[monthIndex].numberOfLeapYearDays : this.months[monthIndex].numberOfDays) - daysIntoMonth;
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
            daysSoFar += daysIntoMonth;
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
                const yearHash = randomHash(`${yearToUse}-AbCxYz`);
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
}
