import {LeapYearRules} from "../constants";
import ConfigurationItemBase from "./configuration-item-base";
import {LeapYearConfig, LeapYearTemplate} from "../interfaces";
import PF2E from "./systems/pf2e";

export default class LeapYear extends ConfigurationItemBase{
    /**
     * The leap year rule to use when determining when a leap year occurs
     * @type {LeapYearRules}
     */
    rule: LeapYearRules = LeapYearRules.None;
    /**
     * The custom modifier that determines how often a custom leap year happens in years
     * @type {number}
     */
    customMod: number = 0;

    constructor() {
        super();
    }

    /**
     * Creates a clone of this leap year class
     * @returns {LeapYear}
     */
    clone(): LeapYear {
        const ly = new LeapYear();
        ly.id = this.id;
        ly.rule = this.rule;
        ly.customMod = this.customMod;
        return ly;
    }

    /**
     * Returns the configuration for leap years
     */
    toConfig(): LeapYearConfig {
        return {
            id: this.id,
            rule: this.rule,
            customMod: this.customMod
        };
    }

    /**
     * Converts this leap year to a leap year template used to render the leap year data
     * @type {LeapYearTemplate}
     */
    toTemplate(): LeapYearTemplate {
        return {
            ...super.toTemplate(),
            rule: this.rule,
            customMod: this.customMod
        }
    }

    /**
     * Sets the properties for this class to options set in the passed in configuration object
     * @param {LeapYearConfig} config The configuration object for this class
     */
    loadFromSettings(config: LeapYearConfig): void {
        if(config && Object.keys(config).length){
            if(config.hasOwnProperty('id')){
                this.id = config.id;
            }
            if(config.hasOwnProperty('rule')){
                this.rule = config.rule;
            }
            if(config.hasOwnProperty('customMod')){
                this.customMod = config.customMod;
            }
        }
    }

    /**
     * Checks if the passed in year is a leap year based on the configured rules
     * @param {number} year The year number to check
     */
    isLeapYear(year: number): boolean {
        PF2E.checkLeapYearRules(this);
        if(this.rule === LeapYearRules.Gregorian){
            return year % 4 === 0 && (year % 100 !== 0 || (year % 100 === 0 && year % 400 === 0));
        } else if(this.rule === LeapYearRules.Custom){
            return year % this.customMod === 0;
        }
        return false;
    }

    /**
     * Calculates how many leap years have passed since year 0 for the year
     * @param {number} year
     */
    howManyLeapYears(year: number): number {
        let num = 0;
        if(this.rule === LeapYearRules.Gregorian){
            num = Math.floor(year / 4) - Math.floor(year / 100) + Math.floor(year / 400);
        } else if(this.rule === LeapYearRules.Custom && this.customMod !== 0){
            num = Math.floor(year/this.customMod);
        }
        if(this.isLeapYear(year) && num > 0){
            num = num - 1;
        }
        return num;
    }

    /**
     * Gets the previous leap year for the passed in year
     * @param {number} year
     */
    previousLeapYear(year: number): number | null {
        if(this.rule === LeapYearRules.Gregorian || (this.rule === LeapYearRules.Custom && this.customMod !== 0)){
            let testYear = year;
            while(Number.isInteger(testYear)){
                if(this.isLeapYear(testYear)){
                    break;
                } else {
                    testYear--;
                }
            }
            return testYear;
        }
        return null;
    }

    /**
     * Which fraction of the leap year is this year
     * @param year
     */
    fraction(year: number){
        const previousLeapYear = this.previousLeapYear(year);
        if(previousLeapYear !== null && previousLeapYear !== 0){
            const yearInto = year%previousLeapYear;
            if(this.rule === LeapYearRules.Gregorian){
                return yearInto / 4
            } else {
                return yearInto / this.customMod;
            }
        }
        return 0;
    }

}
