import SimpleCalendar from "../simple-calendar";
import LeapYear from "../leap-year";
import {GameSystems, LeapYearRules} from "../../constants";

/**
 * System specific functionality for Pathfinder 2E
 */
export default class PF2E {
    /**
     * Gets the world creation time in seconds
     * @return {number}
     */
    public static getWorldCreateSeconds(changeFromSC: boolean = true): number{
        let seconds = 0;
        // If this is a Pathfinder 2E game, when setting Simple Calendar from the world time we need to add:
        //  - The World Create Time Stamp Offset (Used by PF2E to calculate the current world time) - This is a timestamp in Real world time
        //  - The offset from year 0 to Jan 1 1970 (This is because the World Create Time Stamp is based on a timestamp from 1970 so need to make up that difference)
        if(game.hasOwnProperty('pf2e')){
            // @ts-ignore
            let worldCreateTimeStamp = Math.floor(game.pf2e.worldClock.worldCreatedOn/1000);
            // @ts-ignore
            if(game.pf2e.worldClock.dateTheme === 'AR' || game.pf2e.worldClock.dateTheme === 'IC') {
                worldCreateTimeStamp += 62167219200;
            }
            seconds += worldCreateTimeStamp;

            //The PF2E World clock miscalculates leap years, which causes SC to not be correct at certain points
            //They calculate the leap year using Gregorian leap year rules but also subtract 2700 from the year when doing the check
            //This results in some years being considered leap years when they should not
            //PF2E uses Julian Leap years by the rules (leap year every 4 years) so right now neither calendar is technically correct

            //If we set SC to do leap years every 4 years, then we just need to adjust the seconds by a set number to get it to match the date of the PF2E World Clock

            if(SimpleCalendar.instance){
                // @ts-ignore
                if((<Game>game).pf2e.worldClock.dateTheme === 'AR'){
                    seconds += (SimpleCalendar.instance.activeCalendar.year.time.secondsPerDay * (changeFromSC? 15 : 16));
                }
                //@ts-ignore
                else if((<Game>game).pf2e.worldClock.dateTheme === 'CE' && !changeFromSC){
                    seconds += SimpleCalendar.instance.activeCalendar.year.time.secondsPerDay;
                }
                // @ts-ignore
                else if((<Game>game).pf2e.worldClock.dateTheme === 'AD'){
                    const currentYear = SimpleCalendar.instance.activeCalendar.year.numericRepresentation;
                    //Check to see if the PF2E World clock thinks that this year is a leap year or not
                    // @ts-ignore
                    if(!SimpleCalendar.instance.activeCalendar.year.leapYearRule.isLeapYear(currentYear - CONFIG['PF2E'].worldClock.AD.yearOffset)){
                        //Check to see if SC's current year is a leap year
                        if(SimpleCalendar.instance.activeCalendar.year.leapYearRule.isLeapYear(currentYear)){
                            const currMonth = SimpleCalendar.instance.activeCalendar.year.getMonth();
                            //If the change is not from SC and the current month is after feb add 1 day
                            if(!changeFromSC && currMonth && currMonth.numericRepresentation > 2){
                                seconds += SimpleCalendar.instance.activeCalendar.year.time.secondsPerDay;
                            }
                            //If the change is from SC and the current month is jan or feb, subtract 1 day
                            else if(changeFromSC && currMonth && currMonth.numericRepresentation <= 2){
                                seconds -= SimpleCalendar.instance.activeCalendar.year.time.secondsPerDay;
                            }
                        }
                        //If SC's current year is not a leap yaer and the change is from SC, subtract 1 day
                        else if(changeFromSC) {
                            seconds -= SimpleCalendar.instance.activeCalendar.year.time.secondsPerDay;
                        }
                    }
                    //If the PF2E World clock thinks that this year is not a leap year
                    else {
                        const currMonth = SimpleCalendar.instance.activeCalendar.year.getMonth();
                        //If the change is not from SC and the current month is Jan or Feb, add 1 day
                        if(!changeFromSC && currMonth && currMonth.numericRepresentation <= 2){
                            seconds += SimpleCalendar.instance.activeCalendar.year.time.secondsPerDay;
                        }
                        //If the change is from SC and the current month is after Feb, subtract 1 day
                        else if(changeFromSC && currMonth && currMonth.numericRepresentation > 2){
                            seconds -= SimpleCalendar.instance.activeCalendar.year.time.secondsPerDay;
                        }
                    }

                    //IDK why we need to do this... the days are off if the PF2E calendar years are over 2100 or between 1699 and 1996
                    //@ts-ignore
                    if((game.pf2e.worldClock.worldTime.year < 1996 && game.pf2e.worldClock.worldTime.year > 1699) || game.pf2e.worldClock.worldTime.year > 2100){
                        seconds += SimpleCalendar.instance.activeCalendar.year.time.secondsPerDay;
                    }

                }
            }
        }
        return seconds;
    }

    /**
     * Determines if we need to set a new year zero for the pathfinder 2e calendar
     * @return {number|undefined} If no adjustment, undefined otherwise the new year zero is returned
     */
    public static newYearZero(): number | undefined{
        let yearZero;
        if(game.hasOwnProperty('pf2e')){
            //If we are using the Gregorian Calendar that ties into the pathfinder world we need to set the year zero to 1875
            // @ts-ignore
            if(game.pf2e.worldClock.dateTheme === 'AD'){
                yearZero = 1875;
            }
            // @ts-ignore
            else if(game.pf2e.worldClock.dateTheme === 'CE'){
                yearZero = 1970;
            }
            // @ts-ignore
            else if(game.pf2e.worldClock.dateTheme === 'AR'){
                yearZero = 2700;
            }
        }
        return yearZero;
    }

    /**
     * Checks and updates the leap year rules for the PF2E system and if the PF2E World Clock sync setting is enabled
     * @param {LeapYear} leapYear the leap year class to update
     */
    public static checkLeapYearRules(leapYear: LeapYear){
        if(SimpleCalendar.instance.activeCalendar.gameSystem === GameSystems.PF2E && SimpleCalendar.instance.activeCalendar.generalSettings.pf2eSync){
            //The Gregorian based calendars need to use the gregorian rule
            // @ts-ignore
            if(game.pf2e.worldClock.dateTheme === 'AD' || game.pf2e.worldClock.dateTheme === 'CE'){
                leapYear.rule = LeapYearRules.Gregorian;
            }
            //The Golarian calendar needs to use the Julian style leap year rules
            // @ts-ignore
            else if(game.pf2e.worldClock.dateTheme === 'AR'){
                leapYear.rule = LeapYearRules.Custom;
                leapYear.customMod = 4;
            }
        }
    }

    /**
     * Adjust the starting weekday
     */
    public static weekdayAdjust(){
        let adjust: number | undefined;
        if(SimpleCalendar.instance.activeCalendar.gameSystem === GameSystems.PF2E && SimpleCalendar.instance.activeCalendar.generalSettings.pf2eSync){
            // @ts-ignore
            if(game.pf2e.worldClock.dateTheme === 'AR' || game.pf2e.worldClock.dateTheme === 'CE' || game.pf2e.worldClock.dateTheme === 'AD'){
                adjust = 4;
            }
        }
        return adjust
    }
}
