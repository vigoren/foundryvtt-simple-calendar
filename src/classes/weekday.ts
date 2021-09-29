import {WeekdayConfig, WeekdayTemplate} from "../interfaces";
import ConfigurationItemBase from "./configuration-item-base";

/**
 * Class for representing a weekday
 */
export class Weekday extends ConfigurationItemBase{
    /**
     * The abbreviated name of the weekday
     */
    abbreviation: string = '';
    /**
     * The weekday constructor
     * @param {number} numericRepresentation he numeric representation of this weekday
     * @param {string} name The name of the weekday
     */
    constructor(numericRepresentation: number = NaN, name: string = '') {
        super(name, numericRepresentation);
        this.abbreviation = name.substring(0, 2);
    }

    /**
     * Returns the configuration data for the Weekday
     */
    toConfig(): WeekdayConfig {
        return {
            abbreviation: this.abbreviation,
            id: this.id,
            name: this.name,
            numericRepresentation: this.numericRepresentation
        }
    }

    /**
     * Returns an object that is used to display the weekday in the HTML template
     * @return {WeekdayTemplate}
     */
    toTemplate(): WeekdayTemplate{
        return {
            ...super.toTemplate(),
            abbreviation: this.abbreviation,
            name: this.name,
            numericRepresentation: this.numericRepresentation
        }
    }

    /**
     * Creates a new weekday object with the exact same settings as this weekday
     * @return {Weekday}
     */
    clone(): Weekday {
        const w = new Weekday(this.numericRepresentation, this.name);
        w.id = this.id;
        w.abbreviation = this.abbreviation;
        return w;
    }

    /**
     * Loads the weekday data from the config object.
     * @param {WeekdayConfig} config The configuration object for this class
     */
    loadFromSettings(config: WeekdayConfig) {
        if(config && Object.keys(config).length){
            if(config.hasOwnProperty('id')){
                this.id = config.id;
            }
            this.name = config.name;
            this.numericRepresentation = config.numericRepresentation;

            if(config.hasOwnProperty('abbreviation')){
                this.abbreviation = config.abbreviation;
            } else {
                this.abbreviation = this.name.substring(0, 2);
            }
        }
    }
}
