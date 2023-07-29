import { Icons, MoonYearResetOptions } from "../../constants";
import { GameSettings } from "../foundry-interfacing/game-settings";
import ConfigurationItemBase from "../configuration/configuration-item-base";
import Calendar from "./index";

/**
 * Class for representing a moon
 */
export default class Moon extends ConfigurationItemBase {
    /**
     * How long in calendar days the moon takes to do 1 revolution
     * @type {number}
     */
    cycleLength: number;
    /**
     * The different phases of the moon
     * @type {Array<MoonPhase>}
     */
    phases: SimpleCalendar.MoonPhase[] = [];
    /**
     * When the first new moon took place. Used as a reference for calculating the position of the current cycle
     */
    firstNewMoon: SimpleCalendar.FirstNewMoonDate = {
        /**
         * The year reset options for the first new moon
         * @type {number}
         */
        yearReset: MoonYearResetOptions.None,
        /**
         * How often the year should reset
         * @type {number}
         */
        yearX: 0,
        /**
         * The year of the first new moon
         * @type {number}
         */
        year: 0,
        /**
         * The month of the first new moon
         * @type {number}
         */
        month: 1,
        /**
         * The day of the first new moon
         * @type {number}
         */
        day: 1
    };
    /**
     * A color to associate with the moon when displaying it on the calendar
     */
    color: string = "#ffffff";
    /**
     * The amount of days to adjust the current cycle day by
     * @type {number}
     */
    cycleDayAdjust: number = 0;

    /**
     * The moon constructor
     * @param {string} name The name of the moon
     * @param {number} cycleLength The length of the moons cycle
     */
    constructor(name: string = "", cycleLength: number = 0) {
        super(name);
        this.cycleLength = cycleLength;

        this.phases.push({
            name: GameSettings.Localize("FSC.Moon.Phase.New"),
            length: 3.69,
            icon: Icons.NewMoon,
            singleDay: true
        });
    }

    /**
     * Creates a clone of this moon object
     * @return {Moon}
     */
    clone(): Moon {
        const c = new Moon(this.name, this.cycleLength);
        c.id = this.id;
        c.phases = this.phases.map((p) => {
            return { name: p.name, length: p.length, icon: p.icon, singleDay: p.singleDay };
        });
        c.firstNewMoon.yearReset = this.firstNewMoon.yearReset;
        c.firstNewMoon.yearX = this.firstNewMoon.yearX;
        c.firstNewMoon.year = this.firstNewMoon.year;
        c.firstNewMoon.month = this.firstNewMoon.month;
        c.firstNewMoon.day = this.firstNewMoon.day;
        c.color = this.color;
        c.cycleDayAdjust = this.cycleDayAdjust;
        return c;
    }

    /**
     * Returns the configuration for the moon
     */
    toConfig(): SimpleCalendar.MoonData {
        return {
            id: this.id,
            name: this.name,
            cycleLength: this.cycleLength,
            firstNewMoon: {
                yearReset: this.firstNewMoon.yearReset,
                yearX: this.firstNewMoon.yearX,
                year: this.firstNewMoon.year,
                month: this.firstNewMoon.month,
                day: this.firstNewMoon.day
            },
            phases: this.phases.map((p) => {
                return { name: p.name, length: p.length, icon: p.icon, singleDay: p.singleDay };
            }),
            color: this.color,
            cycleDayAdjust: this.cycleDayAdjust
        };
    }

    /**
     * Converts this moon into a template used for displaying the moon in HTML
     */
    toTemplate(): SimpleCalendar.HandlebarTemplateData.Moon {
        const data: SimpleCalendar.HandlebarTemplateData.Moon = {
            ...super.toTemplate(),
            name: this.name,
            cycleLength: this.cycleLength,
            firstNewMoon: this.firstNewMoon,
            phases: this.phases,
            color: this.color,
            cycleDayAdjust: this.cycleDayAdjust,
            firstNewMoonDateSelectorId: `sc_first_new_moon_date_${this.id}`,
            firstNewMoonSelectedDate: { year: 0, month: this.firstNewMoon.month, day: this.firstNewMoon.day, hour: 0, minute: 0, seconds: 0 }
        };
        return data;
    }

    /**
     * Loads the moon data from the config object.
     * @param {MoonData} config The configuration object for this class
     */
    loadFromSettings(config: SimpleCalendar.MoonData) {
        if (config && Object.keys(config).length) {
            super.loadFromSettings(config);
            this.cycleLength = config.cycleLength;
            this.phases = config.phases;
            this.firstNewMoon = {
                yearReset: config.firstNewMoon.yearReset,
                yearX: config.firstNewMoon.yearX,
                year: config.firstNewMoon.year,
                month: config.firstNewMoon.month,
                day: config.firstNewMoon.day
            };
            this.color = config.color;
            this.cycleDayAdjust = config.cycleDayAdjust;
        }
    }

    /**
     * Updates each phases length in days so the total length of all phases matches the cycle length
     */
    updatePhaseLength() {
        let pLength = 0,
            singleDays = 0;
        for (let i = 0; i < this.phases.length; i++) {
            if (this.phases[i].singleDay) {
                singleDays++;
            } else {
                pLength++;
            }
        }
        const phaseLength = Number(((this.cycleLength - singleDays) / pLength).toPrecision(6));

        this.phases.forEach((p) => {
            if (p.singleDay) {
                p.length = 1;
            } else {
                p.length = phaseLength;
            }
        });
    }

    /**
     * Returns the current phase of the moon based on a year month and day.
     * This phase will be within + or - 1 days of when the phase actually begins
     * @param calendar The year class to get the information from
     * @param {number} yearNum The year to use
     * @param {number} monthIndex The month to use
     * @param {number} dayIndex The day to use
     */
    getDateMoonPhase(calendar: Calendar, yearNum: number, monthIndex: number, dayIndex: number): SimpleCalendar.MoonPhase {
        let firstNewMoonDays = calendar.dateToDays(this.firstNewMoon.year, this.firstNewMoon.month, this.firstNewMoon.day, true);
        let resetYearAdjustment = 0;
        if (this.firstNewMoon.yearReset === MoonYearResetOptions.LeapYear) {
            const lyYear = calendar.year.leapYearRule.previousLeapYear(yearNum);
            if (lyYear !== null) {
                firstNewMoonDays = calendar.dateToDays(lyYear, this.firstNewMoon.month, this.firstNewMoon.day, true);
                if (yearNum !== lyYear) {
                    resetYearAdjustment += calendar.year.leapYearRule.fraction(yearNum);
                }
            }
        } else if (this.firstNewMoon.yearReset === MoonYearResetOptions.XYears) {
            const resetMod = yearNum % this.firstNewMoon.yearX;
            if (resetMod !== 0) {
                const resetYear = yearNum - resetMod;
                firstNewMoonDays = calendar.dateToDays(resetYear, this.firstNewMoon.month, this.firstNewMoon.day, true);
                resetYearAdjustment += resetMod / this.firstNewMoon.yearX;
            }
        }

        const daysSoFar = calendar.dateToDays(yearNum, monthIndex, dayIndex, true);
        const daysSinceReferenceMoon = daysSoFar - firstNewMoonDays + resetYearAdjustment;
        const moonCycles = daysSinceReferenceMoon / this.cycleLength;
        const daysIntoCycle = (moonCycles - Math.floor(moonCycles)) * this.cycleLength + this.cycleDayAdjust;

        let phaseDays = 0;
        let phase: SimpleCalendar.MoonPhase | null = null;
        for (let i = 0; i < this.phases.length; i++) {
            const newPhaseDays = phaseDays + this.phases[i].length;
            if (daysIntoCycle >= phaseDays && daysIntoCycle < newPhaseDays) {
                phase = this.phases[i];
                break;
            }
            phaseDays = newPhaseDays;
        }
        if (phase !== null) {
            return phase;
        } else {
            return this.phases[0];
        }
    }

    /**
     * Gets the moon phase based on the current, selected or visible date
     * @param calendar The year class used to get the year, month and day to use
     * @param property Which property to use when getting the year, month and day. Can be current, selected or visible
     * @param dayToUse The day to use instead of the day associated with the property
     */
    getMoonPhase(calendar: Calendar, property: string = "current", dayToUse: number = 0): SimpleCalendar.MoonPhase {
        property = property.toLowerCase() as "current" | "selected" | "visible";
        const yearNum =
            property === "current"
                ? calendar.year.numericRepresentation
                : property === "selected"
                ? calendar.year.selectedYear
                : calendar.year.visibleYear;
        const monthIndex = calendar.getMonthIndex(property);
        if (monthIndex > -1) {
            const dayIndex = property !== "visible" ? calendar.months[monthIndex].getDayIndex(property) : dayToUse;
            return this.getDateMoonPhase(calendar, yearNum, monthIndex, dayIndex);
        }
        return this.phases[0];
    }
}
