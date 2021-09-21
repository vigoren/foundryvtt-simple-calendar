import {GameSettings} from "./game-settings";
import {DateRangeMatch, MoonIcons} from "../constants";
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
     * Formats an hour, minute and optionally second to include pre padded 0's
     * @param {Number} hour
     * @param {Number} minute
     * @param {Number|Boolean} second
     */
    public static FormatTime(hour: number, minute: number, second: number | false){
        let text = '';
        let sHour = hour.toString();
        let sMinute = minute.toString()
        if(hour < 10){
            sHour = `0${hour}`;
        }
        if(minute < 10){
            sMinute = `0${minute}`;
        }

        if(second !== false){
            let sSecond = second.toString();
            if(second < 10){
                sSecond = `0${second}`;
            }
            text = `${sHour}:${sMinute}:${sSecond}`;
        } else {
            text = `${sHour}:${sMinute}`;
        }
        return text;
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
     * Gets the formatted display date for the passed in start and end date.
     * @param {SCDateSelector.Date} startDate The starting datetime
     * @param {SCDateSelector.Date} endDate The ending datetime
     * @param {boolean} [dontIncludeSameDate=false] If to include the date if it is the same in the result (useful for just getting the time)
     * @param {boolean} [showYear=true] If to include the year in the display string
     * @param {string} [delimiter='-'] The delimiter to use between the 2 dates
     */
    public static GetDisplayDate(startDate: SCDateSelector.Date, endDate: SCDateSelector.Date, dontIncludeSameDate: boolean = false, showYear: boolean = true, delimiter: string = '-'){
        let startDateTimeText = '', endDateTimeText = '', startingMonthName = '', endingMonthName = '';
        const startingMonth = SimpleCalendar.instance.activeCalendar.year.months.find(m => m.numericRepresentation === startDate.month);
        const endingMonth = SimpleCalendar.instance.activeCalendar.year.months.find(m => m.numericRepresentation === endDate.month);
        if(startingMonth){
            startingMonthName = startingMonth.name;
        }
        if(endingMonth){
            endingMonthName = endingMonth.name;
        }

        if(!Utilities.DateTheSame(startDate, endDate) && endDate.month !== 0 && endDate.day !== 0){
            startDateTimeText += `${startingMonthName} ${startDate.day}`;
            endDateTimeText += `${endingMonthName} ${endDate.day}`;
            if(!dontIncludeSameDate || (dontIncludeSameDate && startDate.year !== endDate.year)){
                startDateTimeText += `, ${startDate.year}`;
                endDateTimeText += `, ${endDate.year}`;
            }
        } else if(!dontIncludeSameDate){
            if(showYear){
                startDateTimeText += `${startingMonthName} ${startDate.day}, ${startDate.year}`;
            } else {
                startDateTimeText += `${startingMonthName} ${startDate.day}`;
            }
        }

        let startTimeText = `00:00`;
        let endTimeText = `00:00`;
        if(!startDate.allDay){
            startTimeText = ' ' + Utilities.FormatTime(startDate.hour, startDate.minute, false);
            startDateTimeText += startTimeText;
        }
        if(!endDate.allDay){
            endTimeText = ' ' + Utilities.FormatTime(endDate.hour, endDate.minute, false);
            if(endDateTimeText !== '' || (endDateTimeText === '' && startTimeText !== endTimeText)){
                endDateTimeText += endTimeText;
            }
        }
        return `${startDateTimeText}${endDateTimeText? ` ${delimiter} ` + endDateTimeText: ''}`;
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
        let checkMonthIndex = checkDate.month;
        let checkDayIndex = checkDate.day;
        let startMonthIndex = startDate.month;
        let startDayIndex = startDate.day;
        let endMonthIndex = endDate.month;
        let endDayIndex = endDate.day;

        let checkSeconds = 0;
        let startSeconds = 0;
        let endSeconds = 0;

        const sMonth = SimpleCalendar.instance.activeCalendar.year.months.findIndex(m => m.numericRepresentation === startDate.month);
        const cMonth = SimpleCalendar.instance.activeCalendar.year.months.findIndex(m => m.numericRepresentation === checkDate.month);
        const eMonth = SimpleCalendar.instance.activeCalendar.year.months.findIndex(m => m.numericRepresentation === endDate.month);
        let clone = SimpleCalendar.instance.activeCalendar.year.clone();//TODO: This results in a lot of data being cloned, it should be reduced down
        clone.time.setTime(0, 0, 0);

        if(sMonth > -1){
            startMonthIndex = sMonth;
            startDayIndex = SimpleCalendar.instance.activeCalendar.year.months[startMonthIndex].days.findIndex(d => d.numericRepresentation === startDate.day);
            clone.updateMonth(startMonthIndex, 'current', true, startDayIndex);
            clone.numericRepresentation = startDate.year;
            startSeconds = clone.toSeconds();
        }
        if(cMonth > -1){
            checkMonthIndex = cMonth;
            checkDayIndex = SimpleCalendar.instance.activeCalendar.year.months[checkMonthIndex].days.findIndex(d => d.numericRepresentation === checkDate.day);
            clone.updateMonth(checkMonthIndex, 'current', true, checkDayIndex);
            clone.numericRepresentation = checkDate.year;
            checkSeconds = clone.toSeconds();
        }
        if(eMonth > -1){
            endMonthIndex = eMonth;
            endDayIndex = SimpleCalendar.instance.activeCalendar.year.months[endMonthIndex].days.findIndex(d => d.numericRepresentation === endDate.day);
            clone.updateMonth(endMonthIndex, 'current', true, endDayIndex);
            clone.numericRepresentation = endDate.year;
            endSeconds = clone.toSeconds();
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
