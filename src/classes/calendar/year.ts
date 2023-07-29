import LeapYear from "./leap-year";
import { YearNamingRules } from "../../constants";
import ConfigurationItemBase from "../configuration/configuration-item-base";
import { randomHash } from "../utilities/string";

/**
 * Class for representing a year
 */
export default class Year extends ConfigurationItemBase {
    /**
     * Any prefix to use for this year to display before its name
     * @type {string}
     */
    prefix: string = "";
    /**
     * Any postfix to use for this year to display after its name
     * @type {string}
     */
    postfix: string = "";
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
        super("", numericRepresentation);
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
    toTemplate(): SimpleCalendar.HandlebarTemplateData.Year {
        return {
            ...super.toTemplate(),
            firstWeekday: this.firstWeekday,
            numericRepresentation: this.numericRepresentation,
            yearZero: this.yearZero,
            yearNames: this.yearNames,
            yearNamesStart: this.yearNamesStart,
            yearNamingRule: this.yearNamingRule
        };
    }

    /**
     * Loads the year data from the config object.
     * @param {YearData} config The configuration object for this class
     */
    loadFromSettings(config: SimpleCalendar.YearData) {
        if (config && Object.keys(config).length) {
            if (Object.prototype.hasOwnProperty.call(config, "id")) {
                this.id = config.id;
            }
            this.numericRepresentation = config.numericRepresentation;
            this.prefix = config.prefix;
            this.postfix = config.postfix;

            if (Object.prototype.hasOwnProperty.call(config, "showWeekdayHeadings")) {
                this.showWeekdayHeadings = config.showWeekdayHeadings;
            }
            if (Object.prototype.hasOwnProperty.call(config, "firstWeekday")) {
                this.firstWeekday = config.firstWeekday;
            }
            // Check to see if a year 0 has been set in the settings and use that
            if (Object.prototype.hasOwnProperty.call(config, "yearZero")) {
                this.yearZero = config.yearZero;
            }

            if (Object.prototype.hasOwnProperty.call(config, "yearNames")) {
                this.yearNames = config.yearNames;
            }
            if (Object.prototype.hasOwnProperty.call(config, "yearNamingRule")) {
                this.yearNamingRule = config.yearNamingRule;
            }
            if (Object.prototype.hasOwnProperty.call(config, "yearNamesStart")) {
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
        y.leapYearRule = this.leapYearRule.clone();
        y.showWeekdayHeadings = this.showWeekdayHeadings;
        y.firstWeekday = this.firstWeekday;
        y.yearNames = this.yearNames.map((n) => {
            return n;
        });
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
        const yearName = this.getYearName(selected ? this.selectedYear : this.visibleYear);
        if (yearName) {
            dispName = `${this.prefix} ${yearName} (${selected ? this.selectedYear.toString() : this.visibleYear.toString()}) ${this.postfix}`;
        } else {
            dispName = `${this.prefix !== "" ? this.prefix + " " : ""}${selected ? this.selectedYear.toString() : this.visibleYear.toString()}${
                this.postfix !== "" ? " " + this.postfix : ""
            }`;
        }
        return dispName;
    }

    /**
     * Get the name of the current year
     * @param {number} yearToUse The year to use to get the current date
     */
    getYearName(yearToUse: number): string {
        let name = "";
        if (this.yearNames.length) {
            let nameIndex = 0;
            if (this.yearNamingRule === YearNamingRules.Repeat) {
                nameIndex = (((yearToUse - this.yearNamesStart) % this.yearNames.length) + this.yearNames.length) % this.yearNames.length;
            } else if (this.yearNamingRule === YearNamingRules.Random) {
                const yearHash = randomHash(`${yearToUse}-AbCxYz`);
                nameIndex = (((yearHash - this.yearNamesStart) % this.yearNames.length) + this.yearNames.length) % this.yearNames.length;
            } else {
                nameIndex = Math.abs(this.yearNamesStart - yearToUse);
                if (nameIndex >= this.yearNames.length) {
                    nameIndex = this.yearNames.length - 1;
                }
            }
            name = this.yearNames[nameIndex];
        }

        return name;
    }
}
