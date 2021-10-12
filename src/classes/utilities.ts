import {GameSettings} from "./game-settings";
import {DateRangeMatch, GameSystems, MoonIcons} from "../constants";
import FirstQuarterIcon from "../icons/moon-first-quarter.svg";
import FullMoonIcon from "../icons/moon-full.svg";
import LastQuarterIcon from "../icons/moon-last-quarter.svg";
import NewMoonIcon from "../icons/moon-new.svg";
import WaningCrescentIcon from "../icons/moon-waning-crescent.svg";
import WaningGibbousIcon from "../icons/moon-waning-gibbous.svg";
import WaxingCrescentIcon from "../icons/moon-waxing-crescent.svg";
import WaxingGibbousIcon from "../icons/moon-waxing-gibbous.svg";
import {DateTimeParts, SCDateSelector} from "../interfaces";
import SimpleCalendar from "./simple-calendar";
import PF2E from "./systems/pf2e";
import Year from "./year";

export default class Utilities{

    /**
     * Generates a random hash string that is cryptographically strong
     * @return {string}
     */
    public static generateUniqueId(){
        return window.crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
    }

    /**
     * Generates a random numeric value based on the passed in string.
     * @param {string} value The string to hash
     * @return {number} The number representing the hash value
     */
    public static randomHash(value: string) {
        let hash = 0;
        if (value.length == 0) {
            return hash;
        }
        for (let i = 0; i < value.length; i++) {
            let char = value.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }

    /**
     * Returns the ordinal suffix for the passed in number
     * @param {number} n The number to get the suffix for
     */
    public static ordinalSuffix(n: number): string {
        return [undefined,GameSettings.Localize('FSC.OrdinalSuffix.st'),GameSettings.Localize('FSC.OrdinalSuffix.nd'),GameSettings.Localize('FSC.OrdinalSuffix.rd')][n%100>>3^1&&n%10]||GameSettings.Localize('FSC.OrdinalSuffix.th');
    }

    /**
     * Compares 2 Semantic version strings to see which one is greater than the other.
     * @param {string} v1 The first version string
     * @param {string} v2 The second version string
     * @returns {number} 1: v1 > v2; 0: v1 = v2; -1: v1 < v2
     */
    public static compareSemanticVersions(v1: string, v2: string){
        const a = v1.split('.'),
            b = v2.split('.'),
            len = Math.max(a.length, b.length);

        for (let i = 0; i < len; i++) {
            if ((a[i] && !b[i] && parseInt(a[i]) > 0) || (parseInt(a[i]) > parseInt(b[i]))) {
                return 1;
            } else if ((b[i] && !a[i] && parseInt(b[i]) > 0) || (parseInt(a[i]) < parseInt(b[i]))) {
                return -1;
            }
        }

        return 0;
    }

    /**
     * Finds the "best" contrast color for the passed in color
     * @param color
     * @constructor
     */
    public static GetContrastColor(color: string){
        let contrastColor = "#000000";
        if (color.indexOf('#') === 0) {
            color = color.slice(1);
        }
        if(color.length === 3 || color.length === 6){
            // convert 3-digit hex to 6-digits.
            if (color.length === 3) {
                color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
            }
            var r = parseInt(color.slice(0, 2), 16),
                g = parseInt(color.slice(2, 4), 16),
                b = parseInt(color.slice(4, 6), 16);
            contrastColor = (r * 0.299 + g * 0.587 + b * 0.114) > 186? '#000000' : '#FFFFFF'
        }
        return contrastColor;
    }

    /**
     * Gets the SVG icon for the specific moon phase
     * @param {MoonIcons} icon The phase of the moon
     * @param {string} color The color of the moon
     */
    public static GetMoonPhaseIcon(icon: MoonIcons, color: string){
        let moon = '';
        switch (icon){
            case MoonIcons.FirstQuarter:
                moon = FirstQuarterIcon;
                break;
            case MoonIcons.Full:
                moon = FullMoonIcon;
                break;
            case MoonIcons.LastQuarter:
                moon = LastQuarterIcon;
                break;
            case MoonIcons.NewMoon:
                moon = NewMoonIcon;
                break;
            case MoonIcons.WaningCrescent:
                moon = WaningCrescentIcon;
                break;
            case MoonIcons.WaningGibbous:
                moon = WaningGibbousIcon;
                break;
            case MoonIcons.WaxingCrescent:
                moon = WaxingCrescentIcon;
                break;
            case MoonIcons.WaxingGibbous:
                moon = WaxingGibbousIcon;
                break;
        }
        return moon.replace(`fill="#ffffff"`, `fill="${color}"`);
    }

    /**
     * Adds zero padding to the front of numbers
     * @param num
     * @param zeroPadding
     */
    public static PadNumber(num: number, zeroPadding: number = 1){
        if(num < Math.pow(10, zeroPadding)){
            const zeros = zeroPadding - (Math.log(num) * Math.LOG10E | 0);
            return `${'0'.repeat(zeros)}${num}`;
        } else {
            return `${num}`;
        }
    }

    /**
     * Formats the passed in date/time to match the passed in mask
     * @param {DateTimeParts} date The date/time to change into a formatted string
     * @param {string} mask The mask that is used to change the date/time to match the mask
     */
    public static FormatDateTime(date: DateTimeParts, mask: string){
        const token = /DO|d{1,4}|M{1,4}|YN|YA|YZ|YY(?:YY)?|ZZ|Z|([HhMmsD])\1?|[aA]/g;
        const literal = /\[([^]*?)\]/gm;
        const formatFlags: Record<string, (dateObj: DateTimeParts) => string> = {
            "D": (dateObj: DateTimeParts) => String(dateObj.day),
            "DD": (dateObj: DateTimeParts) => Utilities.PadNumber(dateObj.day),
            "DO": (dateObj: DateTimeParts) => `${dateObj.day}${Utilities.ordinalSuffix(dateObj.day)}`,
            "d": (dateObj: DateTimeParts) => String(SimpleCalendar.instance.activeCalendar.year.weekdays[SimpleCalendar.instance.activeCalendar.year.dayOfTheWeek(dateObj.year, dateObj.month, dateObj.day)].numericRepresentation),
            "dd": (dateObj: DateTimeParts) => Utilities.PadNumber(SimpleCalendar.instance.activeCalendar.year.weekdays[SimpleCalendar.instance.activeCalendar.year.dayOfTheWeek(dateObj.year, dateObj.month, dateObj.day)].numericRepresentation),
            "ddd": (dateObj: DateTimeParts) => `${SimpleCalendar.instance.activeCalendar.year.weekdays[SimpleCalendar.instance.activeCalendar.year.dayOfTheWeek(dateObj.year, dateObj.month, dateObj.day)].name.substring(0, 3)}`,
            "dddd": (dateObj: DateTimeParts) => `${SimpleCalendar.instance.activeCalendar.year.weekdays[SimpleCalendar.instance.activeCalendar.year.dayOfTheWeek(dateObj.year, dateObj.month, dateObj.day)].name}`,
            "M": (dateObj: DateTimeParts) => String(dateObj.month),
            "MM": (dateObj: DateTimeParts) => Utilities.PadNumber(dateObj.month),
            "MMM": (dateObj: DateTimeParts) => {
                const month = SimpleCalendar.instance.activeCalendar.year.months.find(m => m.numericRepresentation === dateObj.month);
                return month? month.abbreviation : '';
            },
            "MMMM": (dateObj: DateTimeParts) => {
                const month = SimpleCalendar.instance.activeCalendar.year.months.find(m => m.numericRepresentation === dateObj.month);
                return month? month.name : '';
            },
            "YN": (dateObj: DateTimeParts) => SimpleCalendar.instance.activeCalendar.year.getYearName(dateObj.year),
            "YA": (dateObj: DateTimeParts) => SimpleCalendar.instance.activeCalendar.year.prefix,
            "YZ": (dateObj: DateTimeParts) => SimpleCalendar.instance.activeCalendar.year.postfix,
            "YY": (dateObj: DateTimeParts) => Utilities.PadNumber(dateObj.year, 2).substring(2),
            "YYYY": (dateObj: DateTimeParts) => String(dateObj.year),
            "H": (dateObj: DateTimeParts) => String(dateObj.hour),
            "HH": (dateObj: DateTimeParts) => Utilities.PadNumber(dateObj.hour),
            "h": (dateObj: DateTimeParts) => {
                const halfDay = Math.floor(SimpleCalendar.instance.activeCalendar.year.time.hoursInDay / 2);
                const hour = dateObj.hour % halfDay || halfDay;
                return String(hour);
            },
            "hh": (dateObj: DateTimeParts) => {
                const halfDay = Math.floor(SimpleCalendar.instance.activeCalendar.year.time.hoursInDay / 2);
                const hour = dateObj.hour % halfDay || halfDay;
                return Utilities.PadNumber(hour);
            },
            "m": (dateObj: DateTimeParts) => String(dateObj.minute),
            "mm": (dateObj: DateTimeParts) => Utilities.PadNumber(dateObj.minute),
            "s": (dateObj: DateTimeParts) => String(dateObj.seconds),
            "ss": (dateObj: DateTimeParts) => Utilities.PadNumber(dateObj.seconds),
            "A": (dateObj: DateTimeParts) => {
                const halfDay = Math.floor(SimpleCalendar.instance.activeCalendar.year.time.hoursInDay / 2);
                return dateObj.hour >= halfDay? "PM" : "AM";
            },
            "a": (dateObj: DateTimeParts) => {
                const halfDay = Math.floor(SimpleCalendar.instance.activeCalendar.year.time.hoursInDay / 2);
                return dateObj.hour >= halfDay? "pm" : "am";
            }
        };
        const literals: string[] = [];
        // Make literals inactive by replacing them with @@@
        mask = mask.replace(literal, function($0, $1) {
            literals.push($1);
            return "@@@";
        });
        // Apply formatting rules
        mask = mask.replace(token, key => formatFlags[key](date) );
        // Inline literal values back into the formatted value
        return mask.replace(/@@@/g, () => <string>literals.shift());
    }

    /**
     * Converts that year, month and day numbers into a total number of seconds for the current active calendar
     * @param {number} year The year number
     * @param {number} month The month number
     * @param {number} day The day number
     * @param {boolean} [includeToday=true] If to include today's seconds in the calculation
     * @param {Year} [yearClass=SimpleCalendar.instance.activeCalendar.year] The year class to use for the seconds calculations
     */
    public static ToSeconds(year: number, month: number, day: number, includeToday: boolean = true, yearClass: Year = SimpleCalendar.instance.activeCalendar.year){
        //Get the days so for and add one to include the current day
        let daysSoFar = yearClass.dateToDays(year, month, day, true, true);
        let totalSeconds = yearClass.time.getTotalSeconds(daysSoFar, includeToday);
        // If this is a Pathfinder 2E game, subtract the world creation seconds
        if(SimpleCalendar.instance.activeCalendar.gameSystem === GameSystems.PF2E && SimpleCalendar.instance.activeCalendar.generalSettings.pf2eSync){
            const newYZ = PF2E.newYearZero();
            if(newYZ !== undefined){
                SimpleCalendar.instance.activeCalendar.year.yearZero = newYZ;
                daysSoFar = yearClass.dateToDays(year, month, day, true, true);
            }
            daysSoFar++;
            totalSeconds =  yearClass.time.getTotalSeconds(daysSoFar, includeToday) - PF2E.getWorldCreateSeconds(false);
        }
        return totalSeconds;
    }

    /**
     * Gets the formatted display date for the passed in start and end date.
     * @param {SCDateSelector.Date} startDate The starting datetime
     * @param {SCDateSelector.Date} endDate The ending datetime
     * @param {boolean} [dontIncludeSameDate=false] If to include the date if it is the same in the result (useful for just getting the time)
     * @param {boolean} [showYear=true] If to include the year in the display string
     * @param {string} [delimiter='-'] The delimiter to use between the 2 dates
     */
    public static GetDisplayDate(startDate: SCDateSelector.Date, endDate: SCDateSelector.Date, dontIncludeSameDate: boolean = false, showYear: boolean = true, delimiter: string = '-'){
        const timeMask = SimpleCalendar.instance.activeCalendar.generalSettings.dateFormat.time.replace(/:?[s]/g, '');
        let dateMask = SimpleCalendar.instance.activeCalendar.generalSettings.dateFormat.date;
        if(!showYear){
            dateMask = dateMask.replace(/[,.\/\\\s]*?(YN|YA|YZ|YY(?:YY)?)/g, '');
        }
        let startDateMask = ``;
        let endDateMask = ``;

        if(!Utilities.DateTheSame(startDate, endDate) && endDate.month !== 0 && endDate.day !== 0){
            startDateMask = `${dateMask}`;
            endDateMask = `${dateMask}`;
        } else if(!dontIncludeSameDate){
            startDateMask = `${dateMask}`;
        }

        if(!startDate.allDay){
            startDateMask += ` ${timeMask}`;
        }
        if(!endDate.allDay && !(startDate.hour === endDate.hour && startDate.minute === endDate.minute)){
            endDateMask += ` ${timeMask}`;
        }

        if(endDateMask !== ''){
            endDateMask = ` ${delimiter} ${endDateMask}`;
        }

        return `${Utilities.FormatDateTime({year: startDate.year, month: startDate.month, day: startDate.day, hour: startDate.hour, minute: startDate.minute, seconds: 0}, startDateMask)}${Utilities.FormatDateTime({year: endDate.year, month: endDate.month, day: endDate.day, hour: endDate.hour, minute: endDate.minute, seconds: 0}, endDateMask)}`;
    }

    /**
     * If the two dates are the same or not
     * @param {SCDateSelector.Date} startDate
     * @param {SCDateSelector.Date} endDate
     */
    public static DateTheSame(startDate: DateTimeParts | SCDateSelector.Date, endDate: DateTimeParts | SCDateSelector.Date){
        return startDate.year === endDate.year && startDate.month == endDate.month && startDate.day === endDate.day;
    }

    /**
     * Calculates the number of days between two dates
     * @param {DateTimeParts} startDate The starting date
     * @param {DateTimeParts} endDate The ending date
     */
    public static DaysBetweenDates(startDate: DateTimeParts, endDate: DateTimeParts){
        const sDays = SimpleCalendar.instance.activeCalendar.year.dateToDays(startDate.year, startDate.month, startDate.day);
        const eDays = SimpleCalendar.instance.activeCalendar.year.dateToDays(endDate.year, endDate.month, endDate.day);
        return eDays - sDays;
    }

    /**
     * Checks if a passed in date is between 2 other dates. Will return a DateRangeMatch which indicates where it falls (Exact, Start, End, Between or None)
     * @param {SCDateSelector.Date} checkDate The date to check
     * @param {SCDateSelector.Date} startDate The starting date to use
     * @param {SCDateSelector.Date} endDate The ending date to use
     * @constructor
     */
    public static IsDayBetweenDates(checkDate: SCDateSelector.Date, startDate: SCDateSelector.Date, endDate: SCDateSelector.Date){
        let between = DateRangeMatch.None;
        let checkSeconds = 0;
        let startSeconds = 0;
        let endSeconds = 0;

        const sMonth = SimpleCalendar.instance.activeCalendar.year.months.findIndex(m => m.numericRepresentation === startDate.month);
        const cMonth = SimpleCalendar.instance.activeCalendar.year.months.findIndex(m => m.numericRepresentation === checkDate.month);
        const eMonth = SimpleCalendar.instance.activeCalendar.year.months.findIndex(m => m.numericRepresentation === endDate.month);

        if(sMonth > -1){
            startSeconds = Utilities.ToSeconds(startDate.year, startDate.month, startDate.day, false);
        }
        if(cMonth > -1){
            checkSeconds = Utilities.ToSeconds(checkDate.year, checkDate.month, checkDate.day, false);
        }
        if(eMonth > -1){
            endSeconds = Utilities.ToSeconds(endDate.year, endDate.month, endDate.day, false);
        }

        if(cMonth === -1 || sMonth === -1 || eMonth === -1){
            between = DateRangeMatch.None;
        }
        //If the start and end date are the same as the check date
        else if(checkSeconds === startSeconds && checkSeconds === endSeconds){
            between = DateRangeMatch.Exact;
        }
        else if(checkSeconds === startSeconds){
            between = DateRangeMatch.Start;
        } else if(checkSeconds === endSeconds){
            between = DateRangeMatch.End;
        } else if( checkSeconds < endSeconds && checkSeconds > startSeconds){
            between = DateRangeMatch.Middle;
        }
        return between;
    }
}
