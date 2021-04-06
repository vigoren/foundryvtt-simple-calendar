import {WeekdayTemplate} from "../interfaces";

/**
 * Class for representing a weekday
 */
export class Weekday {
    /**
     * The numeric representation of this weekday
     * @type {number}
     */
    numericRepresentation: number;
    /**
     * The name of the weekday
     * @type {string}
     */
    name: string;

    /**
     * The weekday constructor
     * @param {number} numericRepresentation he numeric representation of this weekday
     * @param {string} name The name of the weekday
     */
    constructor(numericRepresentation: number, name: string) {
        this.numericRepresentation = numericRepresentation;
        this.name = name;
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
            name: this.name,
            firstCharacter: abbrv,
            numericRepresentation: this.numericRepresentation
        };
    }

    /**
     * Creates a new weekday object with the exact same settings as this weekday
     * @return {Weekday}
     */
    clone(): Weekday {
        return new Weekday(this.numericRepresentation, this.name);
    }
}
