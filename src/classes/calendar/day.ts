import ConfigurationItemBase from "../configuration/configuration-item-base";

/**
 * Class representing a day
 */
export default class Day extends ConfigurationItemBase {
    /**
     * If this day is the current day
     */
    current: boolean = false;
    /**
     * If this day is the selected day
     */
    selected: boolean = false;

    /**
     * The Day constructor
     * @param {number} num The numeric representation of the day
     * @param {string} [name=''] Optional name for the day
     */
    constructor(num: number, name: string = "") {
        super(name, num);
        if (this.name === "" && this.numericRepresentation) {
            this.name = this.numericRepresentation.toString();
        }
    }

    /**
     * Returns the configuration data for the day
     */
    toConfig(): SimpleCalendar.DayData {
        return {
            ...super.toTemplate(),
            name: this.name,
            numericRepresentation: this.numericRepresentation
        };
    }

    /**
     * Creates a day template to be used when rendering the day in HTML
     * @return {DayTemplate}
     */
    toTemplate(): SimpleCalendar.HandlebarTemplateData.Day {
        return {
            ...super.toTemplate(),
            name: this.name,
            numericRepresentation: this.numericRepresentation,
            current: this.current,
            selected: this.selected
        };
    }

    /**
     * Creates a new day object with the exact same settings as the current day object
     * @return {Day}
     */
    clone(): Day {
        const d = new Day(this.numericRepresentation, this.name);
        d.id = this.id;
        d.current = this.current;
        d.selected = this.selected;
        return d;
    }
}
