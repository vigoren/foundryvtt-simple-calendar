import { LeapYearRules } from "../../constants";
import ConfigurationItemBase from "../configuration/configuration-item-base";
import PF2E from "../systems/pf2e";
import { CalManager } from "../index";

export default class LeapYear extends ConfigurationItemBase {
    /**
     * The leap year rule to use when determining when a leap year occurs
     * @type {LeapYearRules}
     */
    rule: LeapYearRules = LeapYearRules.None;
    /**
     * The custom modifier that determines how often a custom leap year happens in years
     * @type {number}
     */
    customMod: number = 1;
    /**
     * The year to start calculating leap years from.
     */
    startingYear: number = 0;

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
        ly.startingYear = this.startingYear;
        return ly;
    }

    /**
     * Returns the configuration for leap years
     */
    toConfig(): SimpleCalendar.LeapYearData {
        return {
            id: this.id,
            rule: this.rule,
            customMod: this.customMod,
            startingYear: this.startingYear
        };
    }

    /**
     * Converts this leap year to a leap year template used to render the leap year data
     * @type {LeapYearTemplate}
     */
    toTemplate(): SimpleCalendar.HandlebarTemplateData.LeapYearTemplate {
        return {
            ...super.toTemplate(),
            rule: this.rule,
            customMod: this.customMod,
            startingYear: this.startingYear
        };
    }

    /**
     * Sets the properties for this class to options set in the passed in configuration object
     * @param {LeapYearData} config The configuration object for this class
     */
    loadFromSettings(config: SimpleCalendar.LeapYearData): void {
        if (config && Object.keys(config).length) {
            super.loadFromSettings(config);
            if (Object.prototype.hasOwnProperty.call(config, "rule")) {
                this.rule = config.rule;
            }
            if (Object.prototype.hasOwnProperty.call(config, "customMod")) {
                this.customMod = config.customMod;
            }
            if (Object.prototype.hasOwnProperty.call(config, "startingYear")) {
                this.startingYear = config.startingYear;
            }

            if (this.rule === LeapYearRules.Custom && this.customMod <= 0) {
                this.rule = LeapYearRules.None;
            }
        }
    }

    /**
     * Checks if the passed in year is a leap year based on the configured rules
     * @param {number} year The year number to check
     */
    isLeapYear(year: number): boolean {
        const activeCalendar = CalManager.getActiveCalendar();
        year = year - this.startingYear;
        if (PF2E.isPF2E && activeCalendar.generalSettings.pf2eSync) {
            PF2E.checkLeapYearRules(this);
        }
        if (this.rule === LeapYearRules.Gregorian) {
            return year % 4 === 0 && (year % 100 !== 0 || (year % 100 === 0 && year % 400 === 0));
        } else if (this.rule === LeapYearRules.Custom) {
            return year % this.customMod === 0;
        }
        return false;
    }

    /**
     * Calculates how many leap years have passed since year 0 for the year
     * @param {number} year
     */
    howManyLeapYears(year: number): number {
        let testYear = year - this.startingYear;
        let num = 0;
        if (this.rule === LeapYearRules.Gregorian) {
            num = Math.floor(testYear / 4) - Math.floor(testYear / 100) + Math.floor(testYear / 400);
        } else if (this.rule === LeapYearRules.Custom && this.customMod !== 0) {
            num = Math.floor(testYear / this.customMod);
        }
        if (this.isLeapYear(year) && num > 0) {
            num = num - 1;
        }
        return num;
    }

    /**
     * Gets the previous leap year for the passed in year
     * @param {number} year
     */
    previousLeapYear(year: number): number | null {
        if (this.rule === LeapYearRules.Gregorian || (this.rule === LeapYearRules.Custom && this.customMod !== 0)) {
            let testYear = year - this.startingYear;
            while (Number.isInteger(testYear)) {
                if (this.isLeapYear(testYear)) {
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
    fraction(year: number) {
        const previousLeapYear = this.previousLeapYear(year);
        if (previousLeapYear !== null && previousLeapYear !== 0) {
            const yearInto = (year - this.startingYear) % previousLeapYear;
            if (this.rule === LeapYearRules.Gregorian) {
                return yearInto / 4;
            } else {
                return yearInto / this.customMod;
            }
        }
        return 0;
    }
}
