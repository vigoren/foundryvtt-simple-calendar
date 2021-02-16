import Day from "./day";
import {DayTemplate, MonthTemplate} from "../interfaces";
import {Logger} from "./logging";

/**
 * Class representing a month
 */
export default class Month {
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
     * The month name
     * @type {string}
     */
    name: string;
    /**
     * The number representing the month, so all months are in numeric order
     * @type {number}
     */
    numericRepresentation: number;
    /**
     * If this month is the current month
     */
    current: boolean = false;
    /**
     * If this month is the current month that is visible
     */
    visible: boolean = false;
    /**
     * If this month is the selected month
     */
    selected: boolean = false;

    /**
     * Month class constructor
     * @param {string} name The name of the month
     * @param {number} numericRepresentation The numeric representation of the month
     * @param {number} numberOfDays The number of days in this month
     */
    constructor(name: string, numericRepresentation: number, numberOfDays: number = 0) {
        this.name = name.trim();
        this.numericRepresentation = numericRepresentation;
        if(this.name === ''){
            this.name = numericRepresentation.toString();
        }
        this.populateDays(numberOfDays);
    }

    /**
     * Adds day objects to the days list so it totals the number of days in the month
     * @param {number} numberOfDays The number of days to create
     * @param {number|null} currentDay The currently selected day
     */
    public populateDays(numberOfDays: number, currentDay: number | null = null): void{
        for(let i = 1; i <= numberOfDays; i++){
            const d = new Day(i);
            if(i === currentDay){
                d.current = true;
            }
            this.days.push(d);
        }
        this.numberOfDays = this.days.length;
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
     * @return {MonthTemplate}
     */
    toTemplate(): MonthTemplate {
        return {
            display: this.getDisplayName(),
            name: this.name,
            numericRepresentation: this.numericRepresentation,
            current: this.current,
            visible: this.visible,
            selected: this.selected,
            days: this.getDaysForTemplate(),
            numberOfDays: this.numberOfDays
        };
    }

    /**
     * Creates a new month object with the exact same settings as this month
     * @return {Month}
     */
    clone(): Month {
        const m = new Month(this.name, this.numericRepresentation);
        m.current = this.current;
        m.selected = this.selected;
        m.visible = this.visible;
        m.days = this.days.map(d => d.clone());
        m.numberOfDays = this.numberOfDays;
        return m;
    }

    /**
     * Gets the day class that represents the current day, or undefined if no day represents the current day
     * @return {Day | undefined}
     */
    getCurrentDay(): Day | undefined {
        return this.days.find(d => d.current);
    }

    /**
     * Gets the day class that represents the selected day, or undefined if no day represents the selected day
     * @return {Day | undefined}
     */
    getSelectedDay(): Day | undefined {
        return this.days.find(d => d.selected);
    }

    /**
     * Gets a list of all days template objects
     */
    getDaysForTemplate(): DayTemplate[] {
        return this.days.map(d => d.toTemplate());
    }

    /**
     * Changes the day to either the current or selected day
     * @param {boolean} next If to change to the next day (true) or previous day (false)
     * @param {string} [setting='current'] What setting on the day object to change
     */
    changeDay(next: boolean, setting: string = 'current'){
        const verifiedSetting = setting.toLowerCase() as 'current' | 'selected';
        let changeAmount = next? 1 : -1;
        for(let i = 0; i < this.days.length; i++){
            const day = this.days[i];
            if(day[verifiedSetting]){
                day[verifiedSetting] = false;
                if((next && i === (this.days.length - 1)) || (!next && i === 0)){
                    Logger.debug(`On ${next? 'last' : 'first'} day of the month, changing to ${next? 'next' : 'previous'} month`);
                } else {
                    Logger.debug(`New Day: ${this.days[i + changeAmount].numericRepresentation}`);
                    this.days[i + changeAmount][verifiedSetting] = true;
                    changeAmount = 0;
                }
                break;
            }
        }
        return changeAmount;
    }
}


