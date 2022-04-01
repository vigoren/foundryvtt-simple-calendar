import Calendar from "../calendar";
import {DateRangeMatch, GameSystems, Icons, PresetTimeOfDay} from "../../constants";
import PF2E from "../systems/pf2e";
import {PadNumber, ordinalSuffix} from "./string";
import {deepMerge} from "./object";
import {CalManager} from "../index";
import {Logger} from "../logging";

/**
 * Formats the passed in date/time to match the passed in mask
 * @param {DateTimeParts} date The date/time to change into a formatted string
 * @param {string} mask The mask that is used to change the date/time to match the mask
 * @param {Calendar} calendar The calendar to use to format the date string
 * @param {*} inputs
 */
export function FormatDateTime(date: SimpleCalendar.DateTime, mask: string, calendar: Calendar, inputs: {year?: boolean, month?: boolean} = {}){
    inputs = deepMerge({year: false, month: false}, inputs);
    const token = /DO|d{1,4}|M{1,4}|YN|YA|YZ|YY(?:YY)?|([HhMmsD])\1?|[aA]/g;
    const literal = /\[([^]*?)\]/gm;
    const formatFlags: Record<string, (dateObj: SimpleCalendar.DateTime) => string> = {
        "D": (dateObj: SimpleCalendar.DateTime) => String(calendar.months[dateObj.month].days[dateObj.day].numericRepresentation),
        "DD": (dateObj: SimpleCalendar.DateTime) => PadNumber(calendar.months[dateObj.month].days[dateObj.day].numericRepresentation),
        "DO": (dateObj: SimpleCalendar.DateTime) => `${String(calendar.months[dateObj.month].days[dateObj.day].numericRepresentation)}${ordinalSuffix(calendar.months[dateObj.month].days[dateObj.day].numericRepresentation)}`,
        "d": (dateObj: SimpleCalendar.DateTime) => String(calendar.weekdays[calendar.dayOfTheWeek(dateObj.year, dateObj.month, dateObj.day)].numericRepresentation),
        "dd": (dateObj: SimpleCalendar.DateTime) => PadNumber(calendar.weekdays[calendar.dayOfTheWeek(dateObj.year, dateObj.month, dateObj.day)].numericRepresentation),
        "ddd": (dateObj: SimpleCalendar.DateTime) => `${calendar.weekdays[calendar.dayOfTheWeek(dateObj.year, dateObj.month, dateObj.day)].abbreviation}`,
        "dddd": (dateObj: SimpleCalendar.DateTime) => `${calendar.weekdays[calendar.dayOfTheWeek(dateObj.year, dateObj.month, dateObj.day)].name}`,
        "M": (dateObj: SimpleCalendar.DateTime) => String(calendar.months[dateObj.month].numericRepresentation),
        "MM": (dateObj: SimpleCalendar.DateTime) => PadNumber(calendar.months[dateObj.month].numericRepresentation),
        "MMM": (dateObj: SimpleCalendar.DateTime) => calendar.months[dateObj.month].abbreviation,
        "MMMM": (dateObj: SimpleCalendar.DateTime) => calendar.months[dateObj.month].name,
        "YN": (dateObj: SimpleCalendar.DateTime) => calendar.year.getYearName(dateObj.year),
        "YA": (dateObj: SimpleCalendar.DateTime) => calendar.year.prefix,
        "YZ": (dateObj: SimpleCalendar.DateTime) => calendar.year.postfix,
        "YY": (dateObj: SimpleCalendar.DateTime) => inputs.year? `<input type="number" style="width:4ch;" value="${PadNumber(dateObj.year, 2).substring(2)}" />` : PadNumber(dateObj.year, 2).substring(2),
        "YYYY": (dateObj: SimpleCalendar.DateTime) => inputs.year? `<input type="number" style="width:${String(dateObj.year).length + 2}ch;" value="${dateObj.year}" />` : String(dateObj.year),
        "H": (dateObj: SimpleCalendar.DateTime) => String(dateObj.hour),
        "HH": (dateObj: SimpleCalendar.DateTime) => PadNumber(dateObj.hour),
        "h": (dateObj: SimpleCalendar.DateTime) => {
            const halfDay = Math.floor(calendar.time.hoursInDay / 2);
            const hour = dateObj.hour % halfDay || halfDay;
            return String(hour);
        },
        "hh": (dateObj: SimpleCalendar.DateTime) => {
            const halfDay = Math.floor(calendar.time.hoursInDay / 2);
            const hour = dateObj.hour % halfDay || halfDay;
            return PadNumber(hour);
        },
        "m": (dateObj: SimpleCalendar.DateTime) => String(dateObj.minute),
        "mm": (dateObj: SimpleCalendar.DateTime) => PadNumber(dateObj.minute),
        "s": (dateObj: SimpleCalendar.DateTime) => String(dateObj.seconds),
        "ss": (dateObj: SimpleCalendar.DateTime) => PadNumber(dateObj.seconds),
        "A": (dateObj: SimpleCalendar.DateTime) => {
            const halfDay = Math.floor(calendar.time.hoursInDay / 2);
            return dateObj.hour >= halfDay? "PM" : "AM";
        },
        "a": (dateObj: SimpleCalendar.DateTime) => {
            const halfDay = Math.floor(calendar.time.hoursInDay / 2);
            return dateObj.hour >= halfDay? "pm" : "am";
        }
    };
    const literals: string[] = [];
    // Make literals inactive by replacing them with @@@
    mask = mask.replace(literal, function($0, $1) {
        literals.push($1);
        return "@@@";
    });

    try{
        // Apply formatting rules
        mask = mask.replace(token, key => formatFlags[key](date) );
        // Inline literal values back into the formatted value
        return mask.replace(/@@@/g, () => <string>literals.shift());
    } catch (e: any){
        Logger.error(e);
        return '';
    }
}

/**
 * Converts that year, month and day numbers into a total number of seconds for the current active calendar
 * @param {Calendar} calendar The calendar to use to convert a date to seconds
 * @param {number} year The year number
 * @param {number} monthIndex The month number
 * @param {number} dayIndex The day number
 * @param {boolean} [includeToday=true] If to include today's seconds in the calculation
 */
export function ToSeconds(calendar: Calendar, year: number, monthIndex: number, dayIndex: number, includeToday: boolean = true){
    //Get the days so for and add one to include the current day
    let daysSoFar = calendar.dateToDays(year, monthIndex, dayIndex, true, true);
    let totalSeconds = calendar.time.getTotalSeconds(daysSoFar, includeToday);
    // If this is a Pathfinder 2E game, subtract the world creation seconds
    if(calendar.gameSystem === GameSystems.PF2E && calendar.generalSettings.pf2eSync){
        const newYZ = PF2E.newYearZero();
        if(newYZ !== undefined){
            calendar.year.yearZero = newYZ;
            daysSoFar = calendar.dateToDays(year, monthIndex, dayIndex, true, true);
        }
        daysSoFar++;
        totalSeconds =  calendar.time.getTotalSeconds(daysSoFar, includeToday) - PF2E.getWorldCreateSeconds(calendar, false);
    }
    return totalSeconds;
}

/**
 * Gets the formatted display date for the passed in start and end date.
 * @param calendar The calendar to pull the date formatting from
 * @param startDate The starting datetime
 * @param endDate The ending datetime
 * @param allDay
 * @param [dontIncludeSameDate=false] If to include the date if it is the same in the result (useful for just getting the time)
 * @param [showYear=true] If to include the year in the display string
 * @param [delimiter='-'] The delimiter to use between the 2 dates
 */
export function GetDisplayDate(calendar: Calendar, startDate: SimpleCalendar.DateTime, endDate: SimpleCalendar.DateTime, allDay: boolean, dontIncludeSameDate: boolean = false, showYear: boolean = true, delimiter: string = '-'){
    const timeMask = calendar.generalSettings.dateFormat.time.replace(/:?[s]/g, '');
    let dateMask = calendar.generalSettings.dateFormat.date;
    if(!showYear){
        dateMask = dateMask.replace(/[,.\/\\\s]*?(YN|YA|YZ|YY(?:YY)?)/g, '');
    }
    let startDateMask = ``;
    let endDateMask = ``;

    if(!DateTheSame(startDate, endDate)){
        startDateMask = `${dateMask}`;
        endDateMask = `${dateMask}`;
    } else if(!dontIncludeSameDate){
        startDateMask = `${dateMask}`;
    }

    if(!allDay){
        startDateMask += ` ${timeMask}`;
    }
    if(!allDay && !(startDate.hour === endDate.hour && startDate.minute === endDate.minute)){
        endDateMask += ` ${timeMask}`;
    }

    if(endDateMask !== ''){
        endDateMask = ` ${delimiter} ${endDateMask}`;
    }

    return `${FormatDateTime(startDate, startDateMask, calendar)}${FormatDateTime(endDate, endDateMask, calendar)}`;
}

/**
 * If the two dates are the same or not
 * @param startDate
 * @param endDate
 */
export function DateTheSame(startDate: SimpleCalendar.DateTime, endDate: SimpleCalendar.DateTime){
    return startDate.year === endDate.year && startDate.month == endDate.month && startDate.day === endDate.day;
}

/**
 * Calculates the number of days between two dates
 * @param calendar The calendar used to check the dates
 * @param startDate The starting date
 * @param endDate The ending date
 */
export function DaysBetweenDates(calendar: Calendar, startDate: SimpleCalendar.DateTime, endDate: SimpleCalendar.DateTime){
    const sDays = calendar.dateToDays(startDate.year, startDate.month, startDate.day);
    const eDays = calendar.dateToDays(endDate.year, endDate.month, endDate.day);
    return eDays - sDays;
}

/**
 * Checks if a passed in date is between 2 other dates. Will return a DateRangeMatch which indicates where it falls (Exact, Start, End, Between or None)
 * @param calendar The calendar to use to check the dates
 * @param checkDate The date to check
 * @param startDate The starting date to use
 * @param endDate The ending date to use
 */
export function IsDayBetweenDates(calendar: Calendar, checkDate: SimpleCalendar.DateTime, startDate: SimpleCalendar.DateTime, endDate: SimpleCalendar.DateTime){
    let between = DateRangeMatch.None;
    let checkSeconds = ToSeconds(calendar, checkDate.year, checkDate.month, checkDate.day, false);
    let startSeconds = ToSeconds(calendar, startDate.year, startDate.month, startDate.day, false);
    let endSeconds = ToSeconds(calendar, endDate.year, endDate.month, endDate.day, false);
    //If the start and end date are the same as the check date
    if(checkSeconds === startSeconds && checkSeconds === endSeconds){
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

/**
 * Changes the passed in timestamp to a date in the passed in calendar
 * @param seconds The timestamp to be converted
 * @param calendar The calendar to use to do the conversion
 */
export function TimestampToDate(seconds: number, calendar: Calendar): SimpleCalendar.DateData{
    const result: SimpleCalendar.DateData = {
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
        currentSeason: {
            id: '',
            name: '',
            color: '',
            icon: Icons.None,
            sunsetTime: 0,
            sunriseTime: 0,
            startingDay: 0,
            startingMonth: 0
        },
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

    const dateTime = calendar.secondsToDate(seconds);
    result.year = dateTime.year;
    result.month = dateTime.month;
    result.day = dateTime.day;
    result.hour = dateTime.hour;
    result.minute = dateTime.minute;
    result.second = dateTime.seconds;

    const month = calendar.months[dateTime.month];
    const day = month.days[dateTime.day];
    result.dayOffset = month.numericRepresentationOffset;
    result.yearZero = calendar.year.yearZero;
    result.dayOfTheWeek = calendar.dayOfTheWeek(result.year, result.month, result.day);
    result.currentSeason = calendar.getSeason(result.month, result.day + 1);
    result.weekdays = calendar.weekdays.map(w => w.name);
    result.showWeekdayHeadings = calendar.year.showWeekdayHeadings;
    result.isLeapYear = calendar.year.leapYearRule.isLeapYear(result.year);
    result.sunrise = calendar.getSunriseSunsetTime(result.year, result.month, result.day, true);
    result.sunset = calendar.getSunriseSunsetTime(result.year, result.month, result.day, false);
    result.midday = DateToTimestamp({ year: result.year, month: result.month, day: result.day, hour: 0, minute: 0, seconds: 0 }, calendar) + Math.floor(calendar.time.secondsPerDay / 2);

    // Display Stuff
    result.display.year = dateTime.year.toString();
    result.display.yearName = calendar.year.getYearName(result.year);
    result.display.yearPrefix = calendar.year.prefix;
    result.display.yearPostfix = calendar.year.postfix;
    result.display.month = month.numericRepresentation.toString();
    result.display.monthName = month.name;
    if(calendar.weekdays.length > result.dayOfTheWeek){
        result.display.weekday = calendar.weekdays[result.dayOfTheWeek].name;
    }
    result.display.day = day.numericRepresentation.toString();
    result.display.daySuffix = ordinalSuffix(day.numericRepresentation);
    result.display.time = FormatDateTime({year: 0, month: 0, day: 0, hour: result.hour, minute: result.minute, seconds: result.second}, calendar.generalSettings.dateFormat.time, calendar);
    result.display.date = FormatDateTime({year: result.year, month: result.month, day: result.day, hour: 0, minute: 0, seconds: 0}, calendar.generalSettings.dateFormat.date, calendar);
    return result;
}

/**
 * Changes the passed in date/time and converts it to a timestamp for the passed in calendar
 * @param date The date and time parts to convert to a timestamp
 * @param calendar The calendar to use to do the conversion
 */
export function DateToTimestamp(date: SimpleCalendar.DateTimeParts , calendar: Calendar): number {
    let ts = 0;
    const clone = calendar.clone(false);
    const monthIndex = clone.months.findIndex(m => m.current);
    const currentTime = clone.time.getCurrentTime();
    if (date.seconds === undefined) {
        date.seconds = currentTime.seconds;
    }

    if (date.minute === undefined) {
        date.minute = currentTime.minute;
    }

    if (date.hour === undefined) {
        date.hour = currentTime.hour;
    }

    // If not year is passed in, set to the current year
    if (date.year === undefined) {
        date.year = clone.year.numericRepresentation;
    }
    if (date.month === undefined) {
        date.month = monthIndex > -1? monthIndex : 0;
    }
    if (date.day === undefined) {
        date.day = 0;
        if (monthIndex > -1) {
            const dayIndex = clone.months[monthIndex].days.findIndex(d => d.current);
            date.day = dayIndex > -1? dayIndex : 0;
        }
    }
    clone.updateMonth(date.month, 'current', true, date.day);
    clone.numericRepresentation = date.year;
    clone.time.setTime(date.hour, date.minute, date.seconds);
    ts = clone.toSeconds();
    return ts;
}

/**
 * Advance the current date/time for the passed in calendar ID to the passed in preset
 * @param preset The time of day preset to change to
 * @param calendarId The ID of the calendar to adjust
 */
export async function AdvanceTimeToPreset(preset: PresetTimeOfDay, calendarId: string){
    const calendar = CalManager.getCalendar(calendarId);
    if(calendar){
        let targetTimeOfDay = 0;
        let changeAmount = 0;

        if (preset === PresetTimeOfDay.Sunrise || preset === PresetTimeOfDay.Sunset) {
            let monthDayIndex = calendar.getMonthAndDayIndex();
            targetTimeOfDay = calendar.getSunriseSunsetTime(calendar.year.numericRepresentation, monthDayIndex.month || 0, monthDayIndex.day || 0, preset === PresetTimeOfDay.Sunrise, false);
            changeAmount = targetTimeOfDay - calendar.time.seconds;
        }
        else if (preset === PresetTimeOfDay.Midday) {
            changeAmount = Math.floor(calendar.time.secondsPerDay / 2) - calendar.time.seconds;
        } else if (preset === PresetTimeOfDay.Midnight) {
            changeAmount = calendar.time.secondsPerDay - calendar.time.seconds;
        }
        if(changeAmount <= 0){
            changeAmount += calendar.time.secondsPerDay;
        }
        calendar.changeDateTime({seconds: changeAmount}, {updateApp: false, showWarning: true});

        if (preset === PresetTimeOfDay.Sunrise || preset === PresetTimeOfDay.Sunset) {
            let monthDayIndex = calendar.getMonthAndDayIndex();
            targetTimeOfDay = calendar.getSunriseSunsetTime(calendar.year.numericRepresentation, monthDayIndex.month || 0, monthDayIndex.day || 0, preset === PresetTimeOfDay.Sunrise, false);
            if(targetTimeOfDay !== calendar.time.seconds){
                changeAmount = targetTimeOfDay - calendar.time.seconds;
                calendar.changeDateTime({seconds: changeAmount}, {updateApp: false, showWarning: true});
            }
        }
    }
}