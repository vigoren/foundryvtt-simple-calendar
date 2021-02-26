import Month from "./month";
import {MonthTemplate, YearTemplate} from "../interfaces";
import {Logger} from "./logging";
import {Weekday} from "./weekday";
import {LeapYearRules} from "../constants";
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
        return {
            display: this.getDisplayName(),
            numericRepresentation: this.numericRepresentation,
            months: this.getMonthsForTemplate(),
            weekdays: this.weekdays.map(w => w.toTemplate())
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
        return y;
    }

    /**
     * Generates the display text for this year
     * @returns {string}
     */
    getDisplayName(): string {
        return `${this.prefix}${this.visibleYear.toString()}${this.postfix}`;
    }

    /**
     * Returns an array of month objects to be used in HTML templating
     * @returns {Array.<MonthTemplate>}
     */
    getMonthsForTemplate(): MonthTemplate[] {
        return this.months.map(m => m.toTemplate());
    }

    /**
     * Returns the currently active month or undefined if no current month is found
     * @return {Month|undefined}
     */
    getCurrentMonth(): Month | undefined{
        return this.months.find(m => m.current);
    }

    /**
     * Returns the currently visible month or undefined if no month is visible
     * @return {Month|undefined}
     */
    getVisibleMonth(): Month | undefined{
        return this.months.find(m => m.visible);
    }

    /**
     * Returns the currently selected day
     * @return {Month|undefined}
     */
    getSelectedMonth(): Month | undefined{
        return this.months.find(m => m.selected);
    }

    /**
     * Changes the number of the currently active year
     * @param {number} amount The amount to change the year by
     * @param {boolean} updateMonth If to also update month
     * @param {string} [setting='visible'] The month property we are changing. Can be 'visible', 'current' or 'selected'
     */
    changeYear(amount: number, updateMonth: boolean = true, setting: string = 'visible'){
        if(setting === 'visible'){
            this.visibleYear = this.visibleYear + amount;
        } else if(setting === 'selected'){
            this.selectedYear = this.selectedYear + amount;
        } else {
            this.numericRepresentation = this.numericRepresentation + amount;
            this.visibleYear = this.numericRepresentation;
            Logger.debug(`New Year: ${this.numericRepresentation}`);
        }
        if(this.months.length && updateMonth){
            const verifiedSetting = setting.toLowerCase() as 'visible' | 'current' | 'selected';
            this.months.map(m => m[verifiedSetting] = false);
            let mIndex = 0;
            if(amount === -1){
                mIndex = this.months.length - 1;
            }
            this.months[mIndex][verifiedSetting] = true;
        }
    }

    /**
     * Changes the current, visible or selected month forward or back one month
     * @param {boolean} next If we are moving forward (true) or back (false) one month
     * @param {string} [setting='visible'] The month property we are changing. Can be 'visible', 'current' or 'selected'
     */
    changeMonth(next: boolean, setting: string = 'visible'){
        const verifiedSetting = setting.toLowerCase() as 'visible' | 'current' | 'selected';
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
                    const newMonth = this.getCurrentMonth();
                    if(newMonth){
                        Logger.debug(`New Month: ${newMonth.name}`);
                        newMonth.visible = true;
                        const currentDay = month.getCurrentDay();
                        if(currentDay){
                            let found = false;
                            // Look in the new month for a day that matches the current day of the old month
                            for(let d = 0; d < newMonth.days.length; d++){
                                if(newMonth.days[d].numericRepresentation === currentDay.numericRepresentation){
                                    newMonth.days[d].current = true;
                                    found = true;
                                }
                            }
                            // If no day was found to match the numeric day of the old months current day
                            // Then it is likely that the new month is shorter than the old one, so set the current to the last day of the new month
                            if(!found){
                                newMonth.days[newMonth.days.length - 1].current = true;
                            }
                            currentDay.current = false;
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
        const verifiedSetting = setting.toLowerCase() as 'current' | 'selected';
        const currentMonth = this.getCurrentMonth();
        if(currentMonth){
            const res = currentMonth.changeDay(next, verifiedSetting);
            // If it is positive or negative we need to change the current month
            if(res !== 0){
                this.changeMonth(res > 0, verifiedSetting);
                if(verifiedSetting === 'current'){
                    const newCurrentMonth = this.getCurrentMonth();
                    if(newCurrentMonth && newCurrentMonth.days.length){
                        if(res > 0){
                            newCurrentMonth.days[0][verifiedSetting] = true;
                        } else {
                            newCurrentMonth.days[newCurrentMonth.days.length - 1][verifiedSetting] = true;
                        }
                    }
                }
            }
        }
    }

    /**
     * Generates the total number of days in a year
     * @return {number}
     */
    totalNumberOfDays(): number {
        let total = 0;
        this.months.forEach((m) => {total += m.days.length;});
        return total;
    }

    /**
     * Calculates the day of the week the first day of the currently visible month lands on
     * @return {number}
     */
    visibleMonthStartingDayOfWeek(): number {
        const visibleMonth = this.getVisibleMonth();
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
            Logger.debug(`Days Per Year: ${daysPerYear}`);
            //Assuming a start year of 0
            const totalDaysForYears = daysPerYear * year;
            Logger.debug(`Total Days For Years: ${totalDaysForYears}`);
            let daysSoFarThisYear = 0;
            for(let i = 0; i < (targetMonth - 1); i++){
                daysSoFarThisYear = daysSoFarThisYear + this.months[i].days.length;
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
