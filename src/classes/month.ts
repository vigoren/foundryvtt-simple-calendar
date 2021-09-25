import Day from "./day";
import {DayTemplate, MonthConfig, MonthTemplate} from "../interfaces";
import {Logger} from "./logging";
import ConfigurationItemBase from "./configuration-item-base";
import Year from "./year";

/**
 * Class representing a month
 */
export default class Month extends ConfigurationItemBase {
    /**
     * A list of all the days in this month
     * @type {Array<Day>}
     */
    days: Day[] = [];
    /**
     * The number of days for this month
     * @type {number}
     */
    numberOfDays: number = 0;
    /**
     * The number of days for this month in a leap year
     * @type {number}
     */
    numberOfLeapYearDays: number = 0;
    /**
     * How much to offset the numeric representation of days by when generating them
     * @type {number}
     */
    numericRepresentationOffset: number = 0;
    /**
     * If this month should be treated an a intercalary month
     * @type {boolean}
     */
    intercalary: boolean = false;
    /**
     * If to include the intercalary days as part of the total year count/weekday positioning or not
     * @type {boolean}
     */
    intercalaryInclude: boolean = false;
    /**
     * If this month is the current month
     * @type {boolean}
     */
    current: boolean = false;
    /**
     * If this month is the current month that is visible
     * @type {boolean}
     */
    visible: boolean = false;
    /**
     * If this month is the selected month
     * @type {boolean}
     */
    selected: boolean = false;
    /**
     * Used to determine if the advanced options are should be shown or not. This is not saved.
     * @type {boolean}
     */
    showAdvanced: boolean = false;
    /**
     * The day of the week this month starts on (ignores the day of the week calculation
     */
    startingWeekday: number | null = null;

    abbreviation: string = '';

    /**
     * Month class constructor
     * @param {string} name The name of the month
     * @param {number} numericRepresentation The numeric representation of the month
     * @param {number} numericRepresentationOffset When numbering days offset them by this amount
     * @param {number} numberOfDays The number of days in this month
     * @param {number} numberOfLeapYearDays The number of days in this month on a leap year
     */
    constructor(name: string = '', numericRepresentation: number = NaN, numericRepresentationOffset: number = 0, numberOfDays: number = 0, numberOfLeapYearDays: number | null = null) {
        super(name, numericRepresentation);
        this.numericRepresentationOffset = numericRepresentationOffset;
        if(this.name === ''){
            this.name = numericRepresentation.toString();
        }
        this.abbreviation = this.name.substring(0,3);
        this.numberOfLeapYearDays = numberOfLeapYearDays === null? numberOfDays : numberOfLeapYearDays;
        this.numberOfDays = numberOfDays;
        this.populateDays(this.numberOfLeapYearDays > this.numberOfDays? this.numberOfLeapYearDays : this.numberOfDays);
    }

    /**
     * Adds day objects to the days list so it totals the number of days in the month
     * @param {number} numberOfDays The number of days to create
     * @param {number|null} currentDay The currently selected day
     */
    public populateDays(numberOfDays: number, currentDay: number | null = null): void{
        for(let i = 1; i <= numberOfDays; i++){
            const d = new Day(i + this.numericRepresentationOffset);
            if(i === currentDay){
                d.current = true;
            }
            this.days.push(d);
        }
    }

    /**
     * Gets the display name for the month
     * @return {string}
     */
    getDisplayName(): string {
        if(this.numericRepresentation.toString() === this.name){
            return this.name;
        } else {
            return `${this.name} (${this.numericRepresentation})`;
        }
    }

    /**
     * Creates a month template to be used when rendering the month in HTML
     * @param {Year} [year=null] The year object
     * @return {MonthTemplate}
     */
    toTemplate(year: Year | null = null): MonthTemplate {
        let isLeapYear = false;
        if(year){
            isLeapYear = year.leapYearRule.isLeapYear(year.visibleYear);
        }
        return {
            ...super.toTemplate(),
            abbreviation: this.abbreviation,
            display: this.getDisplayName(),
            name: this.name,
            numericRepresentation: this.numericRepresentation,
            numericRepresentationOffset: this.numericRepresentationOffset,
            current: this.current,
            visible: this.visible,
            selected: this.selected,
            days: this.getDaysForTemplate(isLeapYear),
            numberOfDays: this.numberOfDays,
            numberOfLeapYearDays: this.numberOfLeapYearDays,
            intercalary: this.intercalary,
            intercalaryInclude: this.intercalaryInclude,
            showAdvanced: this.showAdvanced,
            startingWeekday: this.startingWeekday
        };
    }

    /**
     * Creates a new month object with the exact same settings as this month
     * @return {Month}
     */
    clone(): Month {
        const m = new Month(this.name, this.numericRepresentation, this.numericRepresentationOffset);
        m.id = this.id;
        m.name = this.name;
        m.abbreviation = this.abbreviation;
        m.current = this.current;
        m.selected = this.selected;
        m.visible = this.visible;
        m.days = this.days.map(d => d.clone());
        m.numberOfDays = this.numberOfDays;
        m.numberOfLeapYearDays = this.numberOfLeapYearDays;
        m.intercalary = this.intercalary;
        m.intercalaryInclude = this.intercalaryInclude;
        m.showAdvanced = this.showAdvanced;
        m.startingWeekday = this.startingWeekday;
        return m;
    }

    /**
     * Loads the month data from the config object.
     * @param {MonthConfig} config The configuration object for this class
     */
    loadFromSettings(config: MonthConfig) {
        if(config && Object.keys(config).length){
            if(config.hasOwnProperty('id')){
                this.id = config.id;
            }
            this.name = config.name;
            this.numericRepresentation = config.numericRepresentation;
            this.numericRepresentationOffset = config.numericRepresentationOffset;

            let numDays = parseInt(config.numberOfDays.toString());
            let numLeapDays = config.numberOfLeapYearDays === undefined? 0 : parseInt(config.numberOfLeapYearDays.toString());
            if(isNaN(numDays)){
                numDays = 1;
            }
            if(isNaN(numLeapDays)){
                numLeapDays = 1;
            }
            this.numberOfDays = numDays;
            this.numberOfLeapYearDays = numLeapDays;
            this.intercalary = config.intercalary;
            this.intercalaryInclude = config.intercalaryInclude;
            if(config.hasOwnProperty('startingWeekday')){
                this.startingWeekday = config.startingWeekday;
            }
            if(config.hasOwnProperty('abbreviation')){
                this.abbreviation = config.abbreviation;
            } else {
                this.abbreviation = this.name.substring(0, 3);
            }
            this.days = [];
            this.populateDays(this.numberOfLeapYearDays > this.numberOfDays? this.numberOfLeapYearDays : this.numberOfDays);
        }
    }

    /**
     * Gets the day that represents that passed in setting, or undefined if no day represents the setting
     * @param {string} [setting='current'] The day setting to check against. Valid options are 'current' or 'selected'
     */
    getDay(setting: string = 'current'): Day | undefined{
        const verifiedSetting = setting.toLowerCase() as 'current' | 'selected';
        return this.days.find(d => d[verifiedSetting]);
    }

    /**
     * Gets a list of all days template objects
     * @param {boolean} [isLeapYear=false] If the year is a leap year
     */
    getDaysForTemplate(isLeapYear: boolean = false): DayTemplate[] {
        let dt = this.days.map(d => d.toTemplate());
        Logger.debug(`Getting Day Templates for ${this.name}, there are a max of ${dt.length} days`);
        if(this.numberOfDays !== this.numberOfLeapYearDays){
            const diff = this.numberOfLeapYearDays - this.numberOfDays;
            Logger.debug(`There is a difference of "${diff}" between the normal number of days and number of days in a leap year.`);
            if(diff > 0 && !isLeapYear){
                Logger.debug(`It is not a leap year so trim off the extra leap days to get ${dt.length - diff} days`);
                return dt.slice(0, dt.length - diff);
            } else if(diff < 0 && isLeapYear){
                Logger.debug(`It is a leap year so trim off the extra normal days to get ${dt.length + diff} days`);
                return dt.slice(0, dt.length - Math.abs(diff));
            }
        }
        return  dt;
    }

    /**
     * Changes the day to either the current or selected day
     * @param {number} amount The number of days to change, positive forward, negative backwards
     * @param {boolean} [isLeapYear=false] If the year this month is apart of is a leap year
     * @param {string} [setting='current'] What setting on the day object to change
     */
    changeDay(amount: number, isLeapYear: boolean = false, setting: string = 'current'){
        const targetDay = this.getDay(setting);
        let changeAmount = 0;
        const numberOfDays = isLeapYear? this.numberOfLeapYearDays : this.numberOfDays;
        if(targetDay){
            let index = this.days.findIndex(d => d.numericRepresentation === (targetDay.numericRepresentation)) + amount;
            if((amount > 0 && index >= numberOfDays) || (amount < 0 && index < 0) || index < 0){
                Logger.debug(`On ${amount > 0? 'last' : 'first'} day of the month, changing to ${amount > 0? 'next' : 'previous'} month`);
                this.resetDays(setting);
                changeAmount = amount > 0? 1 : -1;
            } else {
                Logger.debug(`New Day: ${this.days[index].numericRepresentation}`);
                this.updateDay(index, isLeapYear, setting);
            }
        }
        return changeAmount;
    }

    /**
     * Resets the passed in setting for all days of the month
     * @param {string} [setting='current'] The setting on the day to reset. Can be either current or selected
     */
    resetDays(setting: string = 'current'){
        const verifiedSetting = setting.toLowerCase() as 'current' | 'selected';
        this.days.forEach((d) => {d[verifiedSetting] = false;});
    }

    /**
     * Updates the setting for the day to true
     * @param {number} day The Index of the day to update, -1 is for the last day of the month
     * @param {boolean} [isLeapYear=false] If the year is a leap year
     * @param {string} [setting='current'] The setting on the day to update. Can be either current or selected
     */
    updateDay(day: number, isLeapYear: boolean = false, setting: string = 'current'){
        const verifiedSetting = setting.toLowerCase() as 'current' | 'selected';
        const numberOfDays = isLeapYear? this.numberOfLeapYearDays : this.numberOfDays;
        this.resetDays(setting);
        if(day < 0 || day >= numberOfDays){
            this.days[numberOfDays - 1][verifiedSetting] = true;
        } else {
            this.days[day][verifiedSetting] = true;
        }
    }
}


