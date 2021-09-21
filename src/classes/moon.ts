import {DayTemplate, FirstNewMoonDate, MoonConfiguration, MoonPhase, MoonTemplate} from "../interfaces";
import Year from "./year";
import {MoonIcons, MoonYearResetOptions} from "../constants";
import {Logger} from "./logging";
import {GameSettings} from "./game-settings";
import ConfigurationItemBase from "./configuration-item-base";

/**
 * Class for representing a moon
 */
export default class Moon extends ConfigurationItemBase{
    /**
     * How long in calendar days the moon takes to do 1 revolution
     * @type {number}
     */
    cycleLength: number;
    /**
     * The different phases of the moon
     * @type {Array<MoonPhase>}
     */
    phases: MoonPhase[] = [];
    /**
     * When the first new moon took place. Used as a reference for calculating the position of the current cycle
     */
    firstNewMoon: FirstNewMoonDate = {
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
    color: string = '#ffffff';
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
    constructor(name: string = '', cycleLength: number = 0) {
        super(name);
        this.cycleLength = cycleLength;

        this.phases.push({
            name: GameSettings.Localize('FSC.Moon.Phase.New'),
            length: 3.69,
            icon: MoonIcons.NewMoon,
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
        c.phases = this.phases.map(p => { return { name: p.name, length: p.length, icon: p.icon, singleDay: p.singleDay };});
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
     * Converts this moon into a template used for displaying the moon in HTML
     * @param {Year} year The year to use for getting the days and months
     */
    toTemplate(year: Year): MoonTemplate {
        const data: MoonTemplate = {
            ...super.toTemplate(),
            name: this.name,
            cycleLength: this.cycleLength,
            firstNewMoon: this.firstNewMoon,
            phases: this.phases,
            color: this.color,
            cycleDayAdjust: this.cycleDayAdjust,
            dayList: []
        };

        const month = year.months.find(m => m.numericRepresentation === data.firstNewMoon.month);

        if(month){
            data.dayList = month.days.map(d => d.toTemplate());
        }

        return data;
    }

    /**
     * Loads the moon data from the config object.
     * @param {MoonConfiguration} config The configuration object for this class
     */
    loadFromSettings(config: MoonConfiguration) {
        if(config && Object.keys(config).length){
            if(config.hasOwnProperty('id')){
                this.id = config.id;
            }
            this.name = config.name;
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
    updatePhaseLength(){
        let pLength = 0, singleDays = 0;
        for(let i = 0; i < this.phases.length; i++){
            if(this.phases[i].singleDay){
               singleDays++;
            } else {
                pLength++;
            }
        }
        const phaseLength = Number(((this.cycleLength - singleDays) / pLength).toPrecision(6));

        this.phases.forEach(p => {
            if(p.singleDay){
                p.length = 1;
            } else {
                p.length = phaseLength;
            }
        });
    }

    /**
     * Returns the current phase of the moon based on a year month and day.
     * This phase will be within + or - 1 days of when the phase actually begins
     * @param {Year} year The year class used to get the year, month and day to use
     * @param {string} property Which property to use when getting the year, month and day. Can be current, selected or visible
     * @param {DayTemplate|null} [dayToUse=null] The day to use instead of the day associated with the property
     */
    getMoonPhase(year: Year, property = 'current', dayToUse: DayTemplate | null = null): MoonPhase{
        property = property.toLowerCase() as 'current' | 'selected' | 'visible';
        let yearNum = property === 'current'? year.numericRepresentation : property === 'selected'? year.selectedYear : year.visibleYear;
        let firstNewMoonDays = year.dateToDays(this.firstNewMoon.year, this.firstNewMoon.month, this.firstNewMoon.day, true, true);

        const month = year.getMonth(property);
        if(month){
            const day = property !== 'visible'? month.getDay(property) : dayToUse;
            let monthNum = month.numericRepresentation;
            let dayNum = day? day.numericRepresentation : 1;
            let resetYearAdjustment = 0;

            if(this.firstNewMoon.yearReset === MoonYearResetOptions.LeapYear){
                let lyYear = year.leapYearRule.previousLeapYear(yearNum);
                if(lyYear !== null){
                    Logger.debug(`Resetting moon calculation first day to year: ${lyYear}`);
                    firstNewMoonDays = year.dateToDays(lyYear, this.firstNewMoon.month, this.firstNewMoon.day, true, true);
                    if(yearNum !== lyYear){
                        resetYearAdjustment += year.leapYearRule.fraction(yearNum);
                    }
                }
            } else if(this.firstNewMoon.yearReset === MoonYearResetOptions.XYears){
                const resetMod = yearNum % this.firstNewMoon.yearX;
                if(resetMod !== 0){
                    let resetYear = yearNum - resetMod;
                    firstNewMoonDays = year.dateToDays(resetYear, this.firstNewMoon.month, this.firstNewMoon.day, true, true);
                    resetYearAdjustment += resetMod / this.firstNewMoon.yearX;
                }
            }

            const daysSoFar = year.dateToDays(yearNum, monthNum, dayNum, true, true);
            const daysSinceReferenceMoon = daysSoFar - firstNewMoonDays + resetYearAdjustment;
            const moonCycles = daysSinceReferenceMoon / this.cycleLength;
            let daysIntoCycle = ((moonCycles - Math.floor(moonCycles)) * this.cycleLength) + this.cycleDayAdjust;

            let phaseDays = 0;
            let phase: MoonPhase | null = null;
            for(let i = 0; i < this.phases.length; i++){
                const newPhaseDays = phaseDays + this.phases[i].length;
                if(daysIntoCycle >= phaseDays && daysIntoCycle < newPhaseDays){
                    phase = this.phases[i];
                    break;
                }
                phaseDays = newPhaseDays;
            }
            if(phase !== null){
                return phase;
            }
        }
        return this.phases[0];
    }

}
