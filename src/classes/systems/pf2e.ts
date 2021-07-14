import SimpleCalendar from "../simple-calendar";

/**
 * System specific functionality for Pathfinder 2E
 */
export default class PF2E {
    /**
     * Gets the world creation time in seconds
     * @return {number}
     */
    public static getWorldCreateSeconds(adjustByDay: boolean = true): number{
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
            if(adjustByDay && SimpleCalendar.instance && SimpleCalendar.instance.currentYear){
                seconds -= SimpleCalendar.instance.currentYear.time.secondsPerDay;
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
        }
        return yearZero;
    }
}
