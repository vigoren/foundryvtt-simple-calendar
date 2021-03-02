import Month from "./month";
import {YearTemplate} from "../interfaces";
import {Logger} from "./logging";
import {Weekday} from "./weekday";
import LeapYear from "./leap-year";

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

    leapYearRule: LeapYear;

    /**
     * The Year constructor
     * @param {number} numericRepresentation The numeric representation of this year
     */
    constructor(numericRepresentation: number) {
        this.numericRepresentation = numericRepresentation;
        this.selectedYear = numericRepresentation;
        this.visibleYear = numericRepresentation;
        this.leapYearRule = new LeapYear();
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
            visibleMonth: this.getMonth('visible')?.toTemplate(this.leapYearRule.isLeapYear(this.visibleYear)),
            visibleMonthWeekOffset:  Array(this.visibleMonthStartingDayOfWeek()).fill(0)
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

    resetMonths(setting: string = 'current'){
        const verifiedSetting = setting.toLowerCase() as 'visible' | 'current' | 'selected';
        this.months.forEach(m => {if(setting!=='visible'){m.resetDays(setting);} m[verifiedSetting] = false;});
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
                this.resetMonths(setting);
                let mIndex = 0;
                if(amount === -1){
                    mIndex = this.months.length - 1;
                }
                this.months[mIndex][verifiedSetting] = true;
            } else if(verifiedSetting !== 'visible') {
                const month = this.getMonth(setting);
                if(month){
                    const day = month.getDay(setting);
                    if(day){
                        const yearToUse = verifiedSetting === 'current'? this.numericRepresentation : this.selectedYear;
                        const isLeapYear = this.leapYearRule.isLeapYear(yearToUse);
                        month.resetDays(setting);
                        month.updateDay(day.numericRepresentation - 1, isLeapYear, setting);
                    }
                }
            }
        }
    }

    /**
     * Changes the current, visible or selected month forward or back one month
     * @param {boolean} next If we are moving forward (true) or back (false) one month
     * @param {string} [setting='visible'] The month property we are changing. Can be 'visible', 'current' or 'selected'
     */
    changeMonth(next: boolean, setting: string = 'visible'){
        const verifiedSetting = setting.toLowerCase() as 'visible' | 'current' | 'selected';
        const yearToUse = verifiedSetting === 'current'? this.numericRepresentation : verifiedSetting === 'visible'? this.visibleYear : this.selectedYear;
        const isLeapYear = this.leapYearRule.isLeapYear(yearToUse);
        const changeAmount = next? 1 : -1;
        for(let i = 0; i < this.months.length; i++){
            const month = this.months[i];
            if(month[verifiedSetting]){
                month[verifiedSetting] = false;
                if((next && i === (this.months.length - 1)) || (!next && i === 0)){
                    Logger.debug(`On ${next? 'last' : 'first'} month of the year, changing to ${next? 'next' : 'previous'} year`);
                    this.changeYear(changeAmount, true, verifiedSetting);
                } else {
                    this.months[i + changeAmount][verifiedSetting] = true;
                }
                // If we are adjusting the current date we need to propagate that down to the days of the new month as well
                // We also need to set the visibility of the new month to true
                if(verifiedSetting === 'current'){
                    month.visible = false;
                    const newMonth = this.getMonth();
                    if(newMonth){
                        Logger.debug(`New Month: ${newMonth.name}`);
                        newMonth.visible = true;
                        const currentDay = month.getDay();
                        if(currentDay){
                            newMonth.updateDay(currentDay.numericRepresentation - 1, isLeapYear);
                        } else {
                            newMonth.updateDay(next? 0 : -1, isLeapYear);
                        }
                    }
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
        const currentMonth = this.getMonth();
        if(currentMonth){
            const verifiedSetting = setting.toLowerCase() as 'current' | 'selected';
            const yearToUse = verifiedSetting === 'current'? this.numericRepresentation : this.selectedYear;
            const isLeapYear = this.leapYearRule.isLeapYear(yearToUse);
            const res = currentMonth.changeDay(next, isLeapYear, verifiedSetting);
            // If it is positive or negative we need to change the current month
            if(res !== 0){
                this.changeMonth(res > 0, verifiedSetting);
            }
        }
    }

    /**
     * Goes through every month and every day and makes sure the passed in setting is set to false
     * @param {string} [setting='current'] The setting to clear, must be one of the following: visible, current or selected
     */
    clearDateProperty(setting: string = 'current'){
        const verifiedSetting = setting.toLowerCase() as 'visible' | 'current' | 'selected';
        for(let i = 0; i < this.months.length; i++){
            const month = this.months[i];
            if(month[verifiedSetting]){
                month[verifiedSetting] = false;
                if(verifiedSetting === 'current' || verifiedSetting === 'selected') {
                    for (let d = 0; d < month.days.length; d++) {
                        const day = month.days[d];
                        if (day[verifiedSetting]) {
                            day[verifiedSetting] = false;
                        }
                    }
                }
            }
        }
    }

    /**
     * Generates the total number of days in a year
     * @param {boolean} [leapYear=false] If to count the total number of days in a leap year
     * @return {number}
     */
    totalNumberOfDays(leapYear: boolean = false): number {
        let total = 0;
        this.months.forEach((m) => { total += leapYear? m.numberOfLeapYearDays : m.numberOfDays; });
        return total;
    }

    /**
     * Calculates the day of the week the first day of the currently visible month lands on
     * @return {number}
     */
    visibleMonthStartingDayOfWeek(): number {
        const visibleMonth = this.getMonth('visible');
        if(visibleMonth){
            return this.dayOfTheWeek(this.visibleYear, visibleMonth.numericRepresentation, 1);
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
            const daysPerYear = this.totalNumberOfDays();
            const daysPerLeapYear = this.totalNumberOfDays(true);
            const leapYearDayDifference = daysPerLeapYear - daysPerYear;
            const numberOfLeapYears = this.leapYearRule.howManyLeapYears(year);
            Logger.debug(`Days Per Year: ${daysPerYear}`);
            Logger.debug(`Days Per Leap Year: ${daysPerLeapYear}`);
            Logger.debug(`How man days extra per leap year: ${leapYearDayDifference}`);
            Logger.debug(`Number of leap years so far: ${numberOfLeapYears}`);

            //Assuming a start year of 0
            const totalDaysForYears = (daysPerYear * year) + (numberOfLeapYears * leapYearDayDifference);
            Logger.debug(`Total Days For Years: ${totalDaysForYears}`);
            const isLeapYear = this.leapYearRule.isLeapYear(year);
            let daysSoFarThisYear = 0;
            for(let i = 0; i < (targetMonth - 1); i++){
                if(isLeapYear){
                    daysSoFarThisYear = daysSoFarThisYear + this.months[i].numberOfLeapYearDays;
                } else {
                    daysSoFarThisYear = daysSoFarThisYear + this.months[i].numberOfDays;
                }

            }
            if(targetDay < 1){
                targetDay = 1;
            }
            daysSoFarThisYear += (targetDay - 1);
            Logger.debug(`Days So Far This Year: ${daysSoFarThisYear}`);
            Logger.debug(`Number of days per week: ${this.weekdays.length}`);
            return ((totalDaysForYears + daysSoFarThisYear)% this.weekdays.length + this.weekdays.length) % this.weekdays.length;
        } else {
            return 0;
        }
    }

}
