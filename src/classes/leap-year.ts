import {LeapYearRules} from "../constants";

export default class LeapYear {
    rule: LeapYearRules = LeapYearRules.None;
    customMod: number = 0;

    constructor() {

    }

    isLeapYear(year: number): boolean {
        if(this.rule === LeapYearRules.Gregorian){
            return year % 4 === 0 && (year % 100 !== 0 || (year % 100 === 0 && year % 400 === 0));
        } else if(this.rule === LeapYearRules.Custom){
            return year % this.customMod === 0;
        }
        return false;
    }

}
