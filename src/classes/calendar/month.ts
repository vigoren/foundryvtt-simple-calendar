import Day from "./day";
import ConfigurationItemBase from "../configuration/configuration-item-base";
import Calendar from "./index";

/**
 * Class representing a month
 */
export default class Month extends ConfigurationItemBase {
    /**
     * A list of all the days in this month
     */
    days: Day[] = [];
    /**
     * The number of days for this month
     */
    numberOfDays: number = 0;
    /**
     * The number of days for this month in a leap year
     */
    numberOfLeapYearDays: number = 0;
    /**
     * How much to offset the numeric representation of days by when generating them
     */
    numericRepresentationOffset: number = 0;
    /**
     * If this month should be treated as an intercalary month
     */
    intercalary: boolean = false;
    /**
     * If to include the intercalary days as part of the total year count/weekday positioning or not
     */
    intercalaryInclude: boolean = false;
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
     * The day of the week this month starts on (ignores the day of the week calculation
     */
    startingWeekday: number | null = null;

    /**
     * Month class constructor
     * @param name The name of the month
     * @param numericRepresentation The numeric representation of the month
     * @param numericRepresentationOffset When numbering days offset them by this amount
     * @param numberOfDays The number of days in this month
     * @param numberOfLeapYearDays The number of days in this month on a leap year
     */
    constructor(
        name: string = "",
        numericRepresentation: number = NaN,
        numericRepresentationOffset: number = 0,
        numberOfDays: number = 0,
        numberOfLeapYearDays: number | null = null
    ) {
        super(name, numericRepresentation);
        this.numericRepresentationOffset = numericRepresentationOffset;
        if (this.name === "") {
            this.name = numericRepresentation.toString();
        }
        this.abbreviation = this.name.substring(0, 3);
        this.numberOfLeapYearDays = numberOfLeapYearDays === null ? numberOfDays : numberOfLeapYearDays;
        this.numberOfDays = numberOfDays;
        this.populateDays(this.numberOfLeapYearDays > this.numberOfDays ? this.numberOfLeapYearDays : this.numberOfDays);
    }

    /**
     * Adds day objects to the days list, so it totals the number of days in the month
     * @param {number} numberOfDays The number of days to create
     * @param {number|null} currentDay The currently selected day
     */
    public populateDays(numberOfDays: number, currentDay: number | null = null): void {
        for (let i = 1; i <= numberOfDays; i++) {
            const d = new Day(i + this.numericRepresentationOffset);
            if (i === currentDay) {
                d.current = true;
            }
            this.days.push(d);
        }
    }

    /**
     * Returns the configuration data for the month
     */
    toConfig(): SimpleCalendar.MonthData {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            abbreviation: this.abbreviation,
            numericRepresentation: this.numericRepresentation,
            numericRepresentationOffset: this.numericRepresentationOffset,
            numberOfDays: this.numberOfDays,
            numberOfLeapYearDays: this.numberOfLeapYearDays,
            intercalary: this.intercalary,
            intercalaryInclude: this.intercalaryInclude,
            startingWeekday: this.startingWeekday
        };
    }

    /**
     * Creates a month template to be used when rendering the month in HTML
     * @param calendar The year object
     */
    toTemplate(calendar: Calendar | null = null): SimpleCalendar.HandlebarTemplateData.Month {
        let isLeapYear = false;
        if (calendar) {
            isLeapYear = calendar.year.leapYearRule.isLeapYear(calendar.year.visibleYear);
        }
        return {
            ...super.toTemplate(),
            abbreviation: this.abbreviation,
            name: this.name,
            numericRepresentation: this.numericRepresentation,
            showAdvanced: this.showAdvanced,
            numericRepresentationOffset: this.numericRepresentationOffset,
            current: this.current,
            visible: this.visible,
            selected: this.selected,
            days: this.getDaysForTemplate(isLeapYear),
            numberOfDays: this.numberOfDays,
            numberOfLeapYearDays: this.numberOfLeapYearDays,
            intercalary: this.intercalary,
            intercalaryInclude: this.intercalaryInclude,
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
        m.description = this.description;
        m.abbreviation = this.abbreviation;
        m.current = this.current;
        m.selected = this.selected;
        m.visible = this.visible;
        m.days = this.days.map((d) => {
            return d.clone();
        });
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
     * @param {MonthData} config The configuration object for this class
     */
    loadFromSettings(config: SimpleCalendar.MonthData) {
        if (config && Object.keys(config).length) {
            super.loadFromSettings(config);
            this.numericRepresentationOffset = config.numericRepresentationOffset;
            let numDays = parseInt(config.numberOfDays.toString());
            let numLeapDays = config.numberOfLeapYearDays === undefined ? 0 : parseInt(config.numberOfLeapYearDays.toString());
            if (isNaN(numDays)) {
                numDays = 1;
            }
            if (isNaN(numLeapDays)) {
                numLeapDays = 1;
            }
            this.numberOfDays = numDays;
            this.numberOfLeapYearDays = numLeapDays;
            this.intercalary = config.intercalary;
            this.intercalaryInclude = config.intercalaryInclude;
            if (Object.prototype.hasOwnProperty.call(config, "startingWeekday")) {
                this.startingWeekday = config.startingWeekday;
            }
            if (Object.prototype.hasOwnProperty.call(config, "abbreviation")) {
                this.abbreviation = config.abbreviation;
            } else {
                this.abbreviation = this.name.substring(0, 3);
            }
            this.days = [];
            this.populateDays(this.numberOfLeapYearDays > this.numberOfDays ? this.numberOfLeapYearDays : this.numberOfDays);
        }
    }

    /**
     * Gets the day that represents that passed in setting, or undefined if no day represents the setting
     * @param {string} [setting='current'] The day setting to check against. Valid options are 'current' or 'selected'
     */
    getDay(setting: string = "current"): Day | undefined {
        const verifiedSetting = setting.toLowerCase() as "current" | "selected";
        return this.days.find((d) => {
            return d[verifiedSetting];
        });
    }

    getDayIndex(setting: string = "current"): number {
        const verifiedSetting = setting.toLowerCase() as "current" | "selected";
        return this.days.findIndex((d) => {
            return d[verifiedSetting];
        });
    }

    /**
     * Gets a list of all days template objects
     * @param {boolean} [isLeapYear=false] If the year is a leap year
     */
    getDaysForTemplate(isLeapYear: boolean = false): SimpleCalendar.HandlebarTemplateData.Day[] {
        const dt = this.days.map((d) => {
            return d.toTemplate();
        });
        if (this.numberOfDays !== this.numberOfLeapYearDays) {
            const diff = this.numberOfLeapYearDays - this.numberOfDays;
            if (diff > 0 && !isLeapYear) {
                return dt.slice(0, dt.length - diff);
            } else if (diff < 0 && isLeapYear) {
                return dt.slice(0, dt.length - Math.abs(diff));
            }
        }
        return dt;
    }

    /**
     * Changes the day to either the current or selected day
     * @param {number} amount The number of days to change, positive forward, negative backwards
     * @param {boolean} [isLeapYear=false] If the year this month is apart of is a leap year
     * @param {string} [setting='current'] What setting on the day object to change
     */
    changeDay(amount: number, isLeapYear: boolean = false, setting: string = "current") {
        const targetDayIndex = this.getDayIndex(setting);
        let changeAmount = 0;
        const numberOfDays = isLeapYear ? this.numberOfLeapYearDays : this.numberOfDays;
        if (targetDayIndex > -1) {
            const newIndex = targetDayIndex + amount;
            if ((amount > 0 && newIndex >= numberOfDays) || (amount < 0 && newIndex < 0) || newIndex < 0) {
                this.resetDays(setting);
                changeAmount = amount > 0 ? 1 : -1;
            } else {
                this.updateDay(newIndex, isLeapYear, setting);
            }
        }
        return changeAmount;
    }

    /**
     * Resets the passed in setting for all days of the month
     * @param {string} [setting='current'] The setting on the day to reset. Can be either current or selected
     */
    resetDays(setting: string = "current") {
        const verifiedSetting = setting.toLowerCase() as "current" | "selected";
        this.days.forEach((d) => {
            d[verifiedSetting] = false;
        });
    }

    /**
     * Updates the setting for the day to true
     * @param {number} dayIndex The Index of the day to update, -1 is for the last day of the month
     * @param {boolean} [isLeapYear=false] If the year is a leap year
     * @param {string} [setting='current'] The setting on the day to update. Can be either current or selected
     */
    updateDay(dayIndex: number, isLeapYear: boolean = false, setting: string = "current") {
        const verifiedSetting = setting.toLowerCase() as "current" | "selected";
        const numberOfDays = isLeapYear ? this.numberOfLeapYearDays : this.numberOfDays;
        this.resetDays(setting);
        if (dayIndex < 0 || dayIndex >= numberOfDays) {
            this.days[numberOfDays - 1][verifiedSetting] = true;
        } else if (this.days[dayIndex]) {
            this.days[dayIndex][verifiedSetting] = true;
        }
    }
}
