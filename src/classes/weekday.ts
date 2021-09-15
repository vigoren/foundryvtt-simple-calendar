import {WeekdayConfig, WeekdayTemplate} from "../interfaces";
import ConfigurationItemBase from "./configuration-item-base";

/**
 * Class for representing a weekday
 */
export class Weekday extends ConfigurationItemBase{

    /**
     * The weekday constructor
     * @param {number} numericRepresentation he numeric representation of this weekday
     * @param {string} name The name of the weekday
     */
    constructor(numericRepresentation: number = NaN, name: string = '') {
        super(name, numericRepresentation);
    }

    /**
     * Returns an object that is used to display the weekday in the HTML template
     * @return {WeekdayTemplate}
     */
    toTemplate(): WeekdayTemplate{
        let abbrv = this.name.substring(0,1).toUpperCase();
        if(this.name.length > 1){
            abbrv += this.name.substring(1,2).toLowerCase();
        }

        return {
            ...super.toTemplate(),
            name: this.name,
            numericRepresentation: this.numericRepresentation,
            firstCharacter: abbrv
        }
    }

    /**
     * Creates a new weekday object with the exact same settings as this weekday
     * @return {Weekday}
     */
    clone(): Weekday {
        const w = new Weekday(this.numericRepresentation, this.name);
        w.id = this.id;
        return w;
    }

    /**
     * Loads the weekday data from the config object.
     * @param {WeekdayConfig} config The configuration object for this class
     */
    loadFromSettings(config: WeekdayConfig) {
        if(config){
            this.id = config.id;
            this.name = config.name;
            this.numericRepresentation = config.numericRepresentation;
        }
    }
}
