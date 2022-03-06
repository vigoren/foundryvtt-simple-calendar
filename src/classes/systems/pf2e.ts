import LeapYear from "../calendar/leap-year";
import {LeapYearRules} from "../../constants";
import Calendar from "../calendar";
import{compareSemanticVersions} from "../utilities/string";

/**
 * System specific functionality for Pathfinder 2E
 */
export default class PF2E {

    /**
     * The version that the world clock changed from having incorrect years and then adding years to the final display to using the correct years in the calculations.
     * @private
     */
    private static worldClockCodeChangeVersion = "2.14.4.8167";
    /**
     * The version of PF2E where a fix was applied that change the value of the year zero that should be used
     * @private
     */
    private static worldClockCodeChangeBackVersion = "3.0.1";
    /**
     * Gets the world creation time in seconds
     * @return {number}
     */
    public static getWorldCreateSeconds(calendar: Calendar, adjustByDay: boolean = true): number{
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


            // the PF2E System all calendars are based off of the gregorian calendar.
            // Now with update 2.15.0 all calendars are no longer adding arbitrary numbers to the display of the year but instead using the correct year
            if(!adjustByDay && compareSemanticVersions((<Game>game).system.data.version, PF2E.worldClockCodeChangeVersion) > 0 && compareSemanticVersions((<Game>game).system.data.version, PF2E.worldClockCodeChangeBackVersion) <= 0){
                seconds += calendar.time.secondsPerDay;
            } else if( adjustByDay && (compareSemanticVersions((<Game>game).system.data.version, PF2E.worldClockCodeChangeVersion) <= 0 || compareSemanticVersions((<Game>game).system.data.version, PF2E.worldClockCodeChangeBackVersion) >= 0)){
                seconds -= calendar.time.secondsPerDay;
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
                if(compareSemanticVersions((<Game>game).system.data.version, PF2E.worldClockCodeChangeVersion) > 0 && compareSemanticVersions((<Game>game).system.data.version, PF2E.worldClockCodeChangeBackVersion) <= 0){
                    yearZero = 1970;
                } else {
                    yearZero = 1875;
                }
            }
            // @ts-ignore
            else if(game.pf2e.worldClock.dateTheme === 'CE'){
                yearZero = 1970;
            }
            // @ts-ignore
            else if(game.pf2e.worldClock.dateTheme === 'AR'){
                if(compareSemanticVersions((<Game>game).system.data.version, PF2E.worldClockCodeChangeVersion) > 0 && compareSemanticVersions((<Game>game).system.data.version, PF2E.worldClockCodeChangeBackVersion) <= 0){
                    yearZero = 0;
                } else {
                    yearZero = 2700;
                }
            }
        }
        return yearZero;
    }

    /**
     * Checks and updates the leap year rules for the PF2E system and if the PF2E World Clock sync setting is enabled
     * @param {LeapYear} leapYear the leap year class to update
     */
    public static checkLeapYearRules(leapYear: LeapYear){
        //The Golarian and Gregorian based calendars need to use the gregorian rule
        // @ts-ignore
        if(game.pf2e.worldClock.dateTheme === 'AD' || game.pf2e.worldClock.dateTheme === 'CE' || game.pf2e.worldClock.dateTheme === 'AR'){
            leapYear.rule = LeapYearRules.Gregorian;
        }
    }

    /**
     * Adjust the starting weekday
     */
    public static weekdayAdjust(){
        let adjust: number | undefined;
        // @ts-ignore
        if(game.pf2e.worldClock.dateTheme === 'CE' || game.pf2e.worldClock.dateTheme === 'AD'){
            adjust = 4;
        }
        // @ts-ignore
        else if(game.pf2e.worldClock.dateTheme === 'AR'){
            if(compareSemanticVersions((<Game>game).system.data.version, PF2E.worldClockCodeChangeBackVersion) > 0){
                adjust = 6;
            } else {
                adjust = 5;
            }
        }
        return adjust
    }
}
