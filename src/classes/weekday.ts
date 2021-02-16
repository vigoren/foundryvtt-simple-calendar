import {WeekdayTemplate} from "../interfaces";

export class Weekday {
    numericRepresentation: number;
    name: string;

    constructor(numericRepresentation: number, name: string) {
        this.numericRepresentation = numericRepresentation;
        this.name = name;
    }

    toTemplate(): WeekdayTemplate{
        return {
            name: this.name,
            firstCharacter: this.name.substring(0,1).toUpperCase(),
            numericRepresentation: this.numericRepresentation
        };
    }
}
