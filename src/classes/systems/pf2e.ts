import LeapYear from "../calendar/leap-year";
import { LeapYearRules } from "../../constants";
import Calendar from "../calendar";
import { compareSemanticVersions } from "../utilities/string";
import { FoundryVTTGameData } from "../foundry-interfacing/game-data";
import { SC } from "../index";
import { Chat } from "../chat";

/**
 * System specific functionality for Pathfinder 2E
 */
export default class PF2E {
    /**
     * The version that the world clock changed from having incorrect years and then adding years to the final display to using the correct years in the calculations.
     * @private
     */
    private static pf2eVersion214 = "2.14.4.8167";
    /**
     * The version of PF2E where a fix was applied that change the value of the year zero that should be used
     * @private
     */
    private static pf2eVersion3 = "3.0.1";
    /**
     * The compare result of the current system version to version 2.14
     * @private
     */
    private static pf2eVersionCompare214: number = 0;
    /**
     * The compare result of the current system version to version 3
     * @private
     */
    private static pf2eVersionCompare3: number = 0;
    /**
     * When the PF2E world was created in real world seconds.
     * @private
     */
    private static worldCreatedOn = 0;
    /**
     * The date theme being used by the PF2E world clock
     * @private
     */
    private static dateTheme = "AR";

    /**
     * Updates the pre-computed PF2E variables for easier use during checks.
     * @param initial
     */
    public static updatePF2EVariables(initial: boolean = false) {
        if (initial) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.worldCreatedOn = Math.floor(game.pf2e.worldClock.worldCreatedOn / 1000);
            this.pf2eVersionCompare214 = compareSemanticVersions(FoundryVTTGameData.systemVersion, PF2E.pf2eVersion214);
            this.pf2eVersionCompare3 = compareSemanticVersions(FoundryVTTGameData.systemVersion, PF2E.pf2eVersion3);
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.dateTheme = game.pf2e.worldClock.dateTheme;
    }

    /**
     * Is the current system pathfinder 2e?
     */
    public static get isPF2E() {
        return FoundryVTTGameData.systemID === "pf2e";
    }

    /**
     * Gets the world creation time in seconds
     * @return {number}
     */
    public static getWorldCreateSeconds(calendar: Calendar, adjustByDay: boolean = true): number {
        let seconds = 0;
        // If this is a Pathfinder 2E game, when setting Simple Calendar from the world time we need to add:
        //  - The World Create Time Stamp Offset (Used by PF2E to calculate the current world time) - This is a timestamp in Real world time
        //  - The offset from year 0 to Jan 1 1970 (This is because the World Create Time Stamp is based on a timestamp from 1970 so need to make up that difference)
        if (Object.prototype.hasOwnProperty.call(game, "pf2e")) {
            let worldCreateTimeStamp = this.worldCreatedOn;
            if (this.dateTheme === "AR" || this.dateTheme === "IC") {
                worldCreateTimeStamp += 62167219200;
            }
            seconds += worldCreateTimeStamp;

            // the PF2E System all calendars are based off of the gregorian calendar.
            // Now with update 2.15.0 all calendars are no longer adding arbitrary numbers to the display of the year but instead using the correct year
            if (!adjustByDay && this.pf2eVersionCompare214 > 0 && this.pf2eVersionCompare3 <= 0) {
                seconds += calendar.time.secondsPerDay;
            } else if (adjustByDay && (this.pf2eVersionCompare214 <= 0 || this.pf2eVersionCompare3 >= 0)) {
                seconds -= calendar.time.secondsPerDay;
            }
        }
        return seconds;
    }

    /**
     * Determines if we need to set a new year zero for the pathfinder 2e calendar
     * @return {number|undefined} If no adjustment, undefined otherwise the new year zero is returned
     */
    public static newYearZero(): number | undefined {
        let yearZero;
        if (Object.prototype.hasOwnProperty.call(game, "pf2e")) {
            //If we are using the Gregorian Calendar that ties into the pathfinder world we need to set the year zero to 1875
            if (this.dateTheme === "AD") {
                if (this.pf2eVersionCompare214 > 0 && this.pf2eVersionCompare3 <= 0) {
                    yearZero = 1970;
                } else {
                    yearZero = 1875;
                }
            } else if (this.dateTheme === "CE") {
                yearZero = 1970;
            } else if (this.dateTheme === "AR") {
                if (this.pf2eVersionCompare214 > 0 && this.pf2eVersionCompare3 <= 0) {
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
    public static checkLeapYearRules(leapYear: LeapYear) {
        //The Golarian and Gregorian based calendars need to use the gregorian rule
        if (this.dateTheme === "AD" || this.dateTheme === "CE" || this.dateTheme === "AR") {
            leapYear.rule = LeapYearRules.Gregorian;
        }
    }

    /**
     * Adjust the starting weekday
     */
    public static weekdayAdjust() {
        let adjust: number | undefined;
        if (this.dateTheme === "CE" || this.dateTheme === "AD") {
            adjust = 4;
        } else if (this.dateTheme === "AR") {
            if (this.pf2eVersionCompare3 > 0) {
                adjust = 6;
            } else {
                adjust = 5;
            }
        }
        return adjust;
    }
}
