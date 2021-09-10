import {LeapYearRules} from "../constants";
import {GameSettings} from "./game-settings";
import {Logger} from "./logging";

export default class LeapYear {
    rule: LeapYearRules = LeapYearRules.None;
    customMod: number = 0;

    constructor() {
        //this.loadFromSettings();
    }

    public loadFromSettings(): void {
        Logger.debug('Loading Leap Year Settings');
        const config = GameSettings.LoadLeapYearRules();
        if(config){
            if(config.hasOwnProperty('rule')){
                this.rule = config.rule;
            }
            if(config.hasOwnProperty('customMod')){
                this.customMod = config.customMod;
            }
        }
    }

    isLeapYear(year: number): boolean {
        if(this.rule === LeapYearRules.Gregorian){
            return year % 4 === 0 && (year % 100 !== 0 || (year % 100 === 0 && year % 400 === 0));
        } else if(this.rule === LeapYearRules.Custom){
            return year % this.customMod === 0;
        }
        return false;
    }

    howManyLeapYears(year: number): number {
        let num = 0;
        if(this.rule === LeapYearRules.Gregorian){
            num = Math.floor(year / 4) - Math.floor(year / 100) + Math.floor(year / 400);
        } else if(this.rule === LeapYearRules.Custom && this.customMod !== 0){
            num = Math.floor(year/this.customMod);
        }
        if(this.isLeapYear(year) && num > 0){
            num = num - 1;
        }
        return num;
    }

    previousLeapYear(year: number): number | null {
        if(this.rule === LeapYearRules.Gregorian || (this.rule === LeapYearRules.Custom && this.customMod !== 0)){
            let testYear = year;
            while(Number.isInteger(testYear)){
                if(this.isLeapYear(testYear)){
                    break;
                } else {
                    testYear--;
                }
            }
            return testYear;
        }
        return null;
    }

    fraction(year: number){
        const previousLeapYear = this.previousLeapYear(year);
        if(previousLeapYear !== null && previousLeapYear !== 0){
            const yearInto = year%previousLeapYear;
            if(this.rule === LeapYearRules.Gregorian){
                return yearInto / 4
            } else {
                return yearInto / this.customMod;
            }
        }
        return 0;
    }

}
