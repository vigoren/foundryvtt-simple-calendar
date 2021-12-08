import {DateTime, DateTimeParts, SCDateSelector} from "../../interfaces";
import Calendar from "../calendar";
import {DateRangeMatch, GameSystems} from "../../constants";
import PF2E from "../systems/pf2e";
import {PadNumber, ordinalSuffix} from "./string";
import {deepMerge} from "./object";

/**
 * Formats the passed in date/time to match the passed in mask
 * @param {DateTimeParts} date The date/time to change into a formatted string
 * @param {string} mask The mask that is used to change the date/time to match the mask
 * @param {Calendar} calendar The calendar to use to format the date string
 * @param {*} inputs
 */
export function FormatDateTime(date: DateTimeParts, mask: string, calendar: Calendar, inputs: {year?: boolean, month?: boolean} = {}){
    inputs = deepMerge({year: false, month: false}, inputs);
    const token = /DO|d{1,4}|M{1,4}|YN|YA|YZ|YY(?:YY)?|([HhMmsD])\1?|[aA]/g;
    const literal = /\[([^]*?)\]/gm;
    const formatFlags: Record<string, (dateObj: DateTimeParts) => string> = {
        "D": (dateObj: DateTimeParts) => String(dateObj.day),
        "DD": (dateObj: DateTimeParts) => PadNumber(dateObj.day),
        "DO": (dateObj: DateTimeParts) => `${dateObj.day}${ordinalSuffix(dateObj.day)}`,
        "d": (dateObj: DateTimeParts) => String(calendar.year.weekdays[calendar.year.dayOfTheWeek(dateObj.year, dateObj.month, dateObj.day)].numericRepresentation),
        "dd": (dateObj: DateTimeParts) => PadNumber(calendar.year.weekdays[calendar.year.dayOfTheWeek(dateObj.year, dateObj.month, dateObj.day)].numericRepresentation),
        "ddd": (dateObj: DateTimeParts) => `${calendar.year.weekdays[calendar.year.dayOfTheWeek(dateObj.year, dateObj.month, dateObj.day)].name.substring(0, 3)}`,
        "dddd": (dateObj: DateTimeParts) => `${calendar.year.weekdays[calendar.year.dayOfTheWeek(dateObj.year, dateObj.month, dateObj.day)].name}`,
        "M": (dateObj: DateTimeParts) => String(dateObj.month),
        "MM": (dateObj: DateTimeParts) => PadNumber(dateObj.month),
        "MMM": (dateObj: DateTimeParts) => {
            const month = calendar.year.months.find(m => m.numericRepresentation === dateObj.month);
            return month? month.abbreviation : '';
        },
        "MMMM": (dateObj: DateTimeParts) => {
            const month = calendar.year.months.find(m => m.numericRepresentation === dateObj.month);
            return month? month.name : '';
        },
        "YN": (dateObj: DateTimeParts) => calendar.year.getYearName(dateObj.year),
        "YA": (dateObj: DateTimeParts) => calendar.year.prefix,
        "YZ": (dateObj: DateTimeParts) => calendar.year.postfix,
        "YY": (dateObj: DateTimeParts) => inputs.year? `<input type="number" style="width:4ch;" value="${PadNumber(dateObj.year, 2).substring(2)}" />` : PadNumber(dateObj.year, 2).substring(2),
        "YYYY": (dateObj: DateTimeParts) => inputs.year? `<input type="number" style="width:${String(dateObj.year).length + 2}ch;" value="${dateObj.year}" />` : String(dateObj.year),
        "H": (dateObj: DateTimeParts) => String(dateObj.hour),
        "HH": (dateObj: DateTimeParts) => PadNumber(dateObj.hour),
        "h": (dateObj: DateTimeParts) => {
            const halfDay = Math.floor(calendar.year.time.hoursInDay / 2);
            const hour = dateObj.hour % halfDay || halfDay;
            return String(hour);
        },
        "hh": (dateObj: DateTimeParts) => {
            const halfDay = Math.floor(calendar.year.time.hoursInDay / 2);
            const hour = dateObj.hour % halfDay || halfDay;
            return PadNumber(hour);
        },
        "m": (dateObj: DateTimeParts) => String(dateObj.minute),
        "mm": (dateObj: DateTimeParts) => PadNumber(dateObj.minute),
        "s": (dateObj: DateTimeParts) => String(dateObj.seconds),
        "ss": (dateObj: DateTimeParts) => PadNumber(dateObj.seconds),
        "A": (dateObj: DateTimeParts) => {
            const halfDay = Math.floor(calendar.year.time.hoursInDay / 2);
            return dateObj.hour >= halfDay? "PM" : "AM";
        },
        "a": (dateObj: DateTimeParts) => {
            const halfDay = Math.floor(calendar.year.time.hoursInDay / 2);
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
 * @param {Calendar} calendar The calendar to use to convert a date to seconds
 * @param {number} year The year number
 * @param {number} month The month number
 * @param {number} day The day number
 * @param {boolean} [includeToday=true] If to include today's seconds in the calculation
 */
export function ToSeconds(calendar: Calendar, year: number, month: number, day: number, includeToday: boolean = true){
    //Get the days so for and add one to include the current day
    let daysSoFar = calendar.year.dateToDays(year, month, day, true, true);
    let totalSeconds = calendar.year.time.getTotalSeconds(daysSoFar, includeToday);
    // If this is a Pathfinder 2E game, subtract the world creation seconds
    if(calendar.gameSystem === GameSystems.PF2E && calendar.generalSettings.pf2eSync){
        const newYZ = PF2E.newYearZero();
        if(newYZ !== undefined){
            calendar.year.yearZero = newYZ;
            daysSoFar = calendar.year.dateToDays(year, month, day, true, true);
        }
        daysSoFar++;
        totalSeconds =  calendar.year.time.getTotalSeconds(daysSoFar, includeToday) - PF2E.getWorldCreateSeconds(calendar, false);
    }
    return totalSeconds;
}

/**
 * Gets the formatted display date for the passed in start and end date.
 * @param {Calendar} calendar The calendar to pull the date formatting from
 * @param {SCDateSelector.Date} startDate The starting datetime
 * @param {SCDateSelector.Date} endDate The ending datetime
 * @param {boolean} [dontIncludeSameDate=false] If to include the date if it is the same in the result (useful for just getting the time)
 * @param {boolean} [showYear=true] If to include the year in the display string
 * @param {string} [delimiter='-'] The delimiter to use between the 2 dates
 */
export function GetDisplayDate(calendar: Calendar, startDate: SCDateSelector.Date, endDate: SCDateSelector.Date, dontIncludeSameDate: boolean = false, showYear: boolean = true, delimiter: string = '-'){
    const timeMask = calendar.generalSettings.dateFormat.time.replace(/:?[s]/g, '');
    let dateMask = calendar.generalSettings.dateFormat.date;
    if(!showYear){
        dateMask = dateMask.replace(/[,.\/\\\s]*?(YN|YA|YZ|YY(?:YY)?)/g, '');
    }
    let startDateMask = ``;
    let endDateMask = ``;

    if(!DateTheSame(startDate, endDate) && endDate.month !== 0 && endDate.day !== 0){
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

    return `${FormatDateTime({year: startDate.year, month: startDate.month, day: startDate.day, hour: startDate.hour, minute: startDate.minute, seconds: 0}, startDateMask, calendar)}${FormatDateTime({year: endDate.year, month: endDate.month, day: endDate.day, hour: endDate.hour, minute: endDate.minute, seconds: 0}, endDateMask, calendar)}`;
}

/**
 * If the two dates are the same or not
 * @param {SCDateSelector.Date} startDate
 * @param {SCDateSelector.Date} endDate
 */
export function DateTheSame(startDate: DateTimeParts | SCDateSelector.Date, endDate: DateTimeParts | SCDateSelector.Date){
    return startDate.year === endDate.year && startDate.month == endDate.month && startDate.day === endDate.day;
}

/**
 * Calculates the number of days between two dates
 * @param {Calendar} calendar The calendar used to check the dates
 * @param {DateTimeParts} startDate The starting date
 * @param {DateTimeParts} endDate The ending date
 */
export function DaysBetweenDates(calendar: Calendar, startDate: DateTimeParts, endDate: DateTimeParts){
    const sDays = calendar.year.dateToDays(startDate.year, startDate.month, startDate.day);
    const eDays = calendar.year.dateToDays(endDate.year, endDate.month, endDate.day);
    return eDays - sDays;
}

/**
 * Checks if a passed in date is between 2 other dates. Will return a DateRangeMatch which indicates where it falls (Exact, Start, End, Between or None)
 * @param {Calendar} calendar The calendar to use to check the dates
 * @param {SCDateSelector.Date} checkDate The date to check
 * @param {SCDateSelector.Date} startDate The starting date to use
 * @param {SCDateSelector.Date} endDate The ending date to use
 * @constructor
 */
export function IsDayBetweenDates(calendar: Calendar, checkDate: SCDateSelector.Date, startDate: SCDateSelector.Date, endDate: SCDateSelector.Date){
    let between = DateRangeMatch.None;
    let checkSeconds = 0;
    let startSeconds = 0;
    let endSeconds = 0;

    const sMonth = calendar.year.months.findIndex(m => m.numericRepresentation === startDate.month);
    const cMonth = calendar.year.months.findIndex(m => m.numericRepresentation === checkDate.month);
    const eMonth = calendar.year.months.findIndex(m => m.numericRepresentation === endDate.month);

    if(sMonth > -1){
        startSeconds = ToSeconds(calendar, startDate.year, startDate.month, startDate.day, false);
    }
    if(cMonth > -1){
        checkSeconds = ToSeconds(calendar, checkDate.year, checkDate.month, checkDate.day, false);
    }
    if(eMonth > -1){
        endSeconds = ToSeconds(calendar, endDate.year, endDate.month, endDate.day, false);
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

export function TimestampToDate(seconds: number, calendar: Calendar){
    const result = {
        year: 0,
        month: 0,
        dayOffset: 0,
        day: 0,
        dayOfTheWeek: 0,
        hour: 0,
        minute: 0,
        second: 0,
        yearZero: 0,
        sunrise: 0,
        sunset: 0,
        midday: 0,
        weekdays: <string[]>[],
        showWeekdayHeadings: true,
        currentSeason: {},
        isLeapYear: false,
        display: {
            date: '',
            day: '',
            daySuffix: '',
            weekday: '',
            monthName: '',
            month: '',
            year: '',
            yearName: '',
            yearPrefix: '',
            yearPostfix: '',
            time: ''
        }
    };
    // If this is a Pathfinder 2E game, add the world creation seconds
    if(calendar.gameSystem === GameSystems.PF2E && calendar.generalSettings.pf2eSync){
        seconds += PF2E.getWorldCreateSeconds(calendar);
    }

    const dateTime = calendar.year.secondsToDate(seconds);
    result.year = dateTime.year;
    result.month = dateTime.month;
    result.day = dateTime.day;
    result.hour = dateTime.hour;
    result.minute = dateTime.minute;
    result.second = dateTime.seconds;

    const month = calendar.year.months[dateTime.month];
    const day = month.days[dateTime.day];
    result.dayOffset = month.numericRepresentationOffset;
    result.yearZero = calendar.year.yearZero;
    result.dayOfTheWeek = calendar.year.dayOfTheWeek(result.year, month.numericRepresentation, day.numericRepresentation);
    result.currentSeason = calendar.year.getSeason(dateTime.month, dateTime.day + 1);
    result.weekdays = calendar.year.weekdays.map(w => w.name);
    result.showWeekdayHeadings = calendar.year.showWeekdayHeadings;
    result.isLeapYear = calendar.year.leapYearRule.isLeapYear(result.year);
    result.sunrise = calendar.year.getSunriseSunsetTime(result.year, month, day, true);
    result.sunset = calendar.year.getSunriseSunsetTime(result.year, month, day, false);
    result.midday = DateToTimestamp({ year: result.year, month: result.month, day: result.day, hour: 0, minute: 0, second: 0 }, calendar) + Math.floor(calendar.year.time.secondsPerDay / 2);

    // Display Stuff
    result.display.year = dateTime.year.toString();
    result.display.yearName = calendar.year.getYearName(result.year);
    result.display.yearPrefix = calendar.year.prefix;
    result.display.yearPostfix = calendar.year.postfix;
    result.display.month = month.numericRepresentation.toString();
    result.display.monthName = month.name;
    if(calendar.year.weekdays.length > result.dayOfTheWeek){
        result.display.weekday = calendar.year.weekdays[result.dayOfTheWeek].name;
    }
    result.display.day = day.numericRepresentation.toString();
    result.display.daySuffix = ordinalSuffix(day.numericRepresentation);
    result.display.time = FormatDateTime({year: 0, month: 0, day: 0, hour: result.hour, minute: result.minute, seconds: result.second}, calendar.generalSettings.dateFormat.time, calendar);
    result.display.date = FormatDateTime({year: result.year, month: month.numericRepresentation, day: day.numericRepresentation, hour: 0, minute: 0, seconds: 0}, calendar.generalSettings.dateFormat.date, calendar);
    return result;
}

export function DateToTimestamp(date: DateTime , calendar: Calendar): number {
    let ts = 0;
    const clone = calendar.year.clone();
    const currentMonth = clone.getMonth();
    const currentTime = clone.time.getCurrentTime();
    if (date.second === undefined) {
        date.second = currentTime.seconds;
    }

    if (date.minute === undefined) {
        date.minute = currentTime.minute;
    }

    if (date.hour === undefined) {
        date.hour = currentTime.hour;
    }

    // If not year is passed in, set to the current year
    if (date.year === undefined) {
        date.year = clone.numericRepresentation;
    }
    if (date.month === undefined) {
        if (currentMonth) {
            date.month = clone.months.findIndex(m => m.numericRepresentation === currentMonth.numericRepresentation);
        } else {
            date.month = 0;
        }
    }
    if (date.day === undefined) {
        date.day = 0;
        if (currentMonth) {
            const currDay = currentMonth.getDay();
            if (currDay) {
                date.day = currentMonth.days.findIndex(d => d.numericRepresentation === currDay.numericRepresentation);
            }
        }
    }
    clone.updateMonth(date.month, 'current', true, date.day);
    clone.numericRepresentation = date.year;
    clone.time.setTime(date.hour, date.minute, date.second);
    ts = clone.toSeconds();
    return ts;
}