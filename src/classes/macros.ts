import {Logger} from "./logging";
import SimpleCalendar from "./simple-calendar";
import {GameSettings} from "./game-settings";
import API from "./api";

export default class Macros {
    /**
     * A globally exposed function for macros to show the calendar. If a date is passed in, the calendar will open so that date is visible and selected
     * @param {number | null} [year=null] The year to set as visible, it not passed in what ever the users current visible year will be used
     * @param {number | null} [month=null] The month index to set as visible, it not passed in what ever the users current visible month will be used
     * @param {number | null} [day=null] The day to set as selected, it not passed in what ever the users current selected day will be used
     */
    public static show(year: number | null = null, month: number | null = null, day: number | null = null){
        Logger.warn(`The SimpleCalendar.show function has been depreciated. Please update to use the SimpleCalendar.api.showCalendar() function.`);
        if(year !== null && month !== null && day !== null){
            API.showCalendar({year: year, month: month, day: day});
        } else {
            API.showCalendar();
        }
    }

    /**
     * A globally exposed function for macros to set the calendars current date.
     * Must be a GM to use this macro
     * @param {number | null} [year=null] The year to set as current, if not passed in what ever the current year is will be used
     * @param {number | null} [month=null] The month index to set as current, if not passed in what ever the current month is will be used
     * @param {number | null} [day=null] The day to set as current, if not passed in what ever the current day is will be used
     * @param {number | null} [hour=null] The hour to set as current, if not passed in what ever the current hour is will be used.
     * @param {number | null} [minute=null] The minute to set as current, if not passed in what ever the current minute is will be used.
     * @param {number | null} [seconds=null] The seconds to set as current, if not passed in what ever the current seconds is will be used.
     */
    public static setDateTime(year: number | null | undefined = null, month: number | null | undefined = null, day: number | null | undefined = null, hour: number | null | undefined = null, minute: number | null | undefined = null, seconds: number | null | undefined = null){
        Logger.warn(`The SimpleCalendar.setDateTime function has been depreciated. Please update to use the SimpleCalendar.api.setDate() function.`);
        if(year === null){
            year = undefined;
        }
        if(month === null){
            month = undefined;
        }
        if(day === null){
            day = undefined;
        }
        if(hour === null){
            hour = undefined;
        }
        if(minute === null){
            minute = undefined;
        }
        if(seconds === null){
            seconds = undefined;
        }
        API.setDate({year: year, month: month, day: day, hour: hour, minute: minute, second: seconds});
    }

    /**
     * A globally exposed function for macros to change the current date by a set amount.
     * @param {number} [seconds=0] The number of seconds to change the time by, can be any amount negative or positive.
     * @param {number} [minutes=0] The number of minutes to change the time by, can be any amount negative or positive.
     * @param {number} [hours=0] The number of hours to change the time by, can be any amount negative or positive.
     * @param {number} [days=0] The number of days to change the time by, can be any amount negative or positive.
     * @param {number} [months=0] The number of months to change the time by, can be any amount negative or positive.
     * @param {number} [years=0] The number of years to change the time by, can be any amount negative or positive.
     */
    public static changeDateTime(seconds: number = 0, minutes: number = 0, hours: number = 0, days: number = 0, months: number = 0, years: number = 0){
        Logger.warn(`The SimpleCalendar.changeDateTime function has been depreciated. Please update to use the SimpleCalendar.api.changeDate() function.`);
        API.changeDate({year: years, month: months, day: days, hour: hours, minute: minutes, second: seconds});
    }
}
