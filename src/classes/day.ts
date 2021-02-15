import {DayTemplate} from "../interfaces";

/**
 * Class representing a day
 */
export default class Day {
    /**
     * The name of the day, if it has a special name
     */
    name: string = '';
    /**
     * The numeric representation of this day
     */
    numericRepresentation: number = 0;
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
    constructor(num: number, name: string = '') {
        this.numericRepresentation = num;
        this.name = name;

        if(this.name === '' && this.numericRepresentation){
            this.name = this.numericRepresentation.toString();
        }
    }

    /**
     * Creates a day template to be used when rendering the day in HTML
     * @return {DayTemplate}
     */
    toTemplate() : DayTemplate{
        return {
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
        d.current = this.current;
        d.selected = this.selected;
        return d;
    }

}
