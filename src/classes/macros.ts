import {Logger} from "./logging";
import SimpleCalendar from "./simple-calendar";
import {GameSettings} from "./game-settings";
import {SimpleCalendarSocket} from "../interfaces";
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
    public static setDateTime(year: number | null = null, month: number | null = null, day: number | null = null, hour: number | null = null, minute: number | null = null, seconds: number | null = null){
        if(GameSettings.IsGm()){
            if(SimpleCalendar.instance && SimpleCalendar.instance.currentYear){
                const currentMonth = SimpleCalendar.instance.currentYear.getMonth();
                const currentTime = SimpleCalendar.instance.currentYear.time.getCurrentTime();
                let totalSeconds = 0;

                if(seconds !== null){
                    totalSeconds += seconds;
                } else {
                    totalSeconds += parseInt(currentTime.second);
                }
                if(minute !== null){
                    totalSeconds += (minute * SimpleCalendar.instance.currentYear.time.secondsInMinute);
                } else {
                    totalSeconds += parseInt(currentTime.minute);
                }
                if(hour !== null){
                    totalSeconds += (hour * SimpleCalendar.instance.currentYear.time.minutesInHour * SimpleCalendar.instance.currentYear.time.secondsInMinute);
                } else {
                    totalSeconds += parseInt(currentTime.hour);
                }
                if(day === null){
                    if(currentMonth){
                        const currentDay = currentMonth.getDay();
                        if(currentDay){
                            day = currentDay.numericRepresentation;
                        } else {
                            day = 1;
                        }
                    } else {
                        day = 1;
                    }
                }

                if(month !== null){
                    if(month > -1 && month < SimpleCalendar.instance.currentYear.months.length){
                        month = SimpleCalendar.instance.currentYear.months[month].numericRepresentation;
                    } else {
                        month = SimpleCalendar.instance.currentYear.months[SimpleCalendar.instance.currentYear.months.length - 1].numericRepresentation;
                    }
                } else if(currentMonth) {
                    month = currentMonth.numericRepresentation;
                } else {
                    month = 1;
                }

                if(year === null){
                    year = SimpleCalendar.instance.currentYear.numericRepresentation;
                }

                const days = SimpleCalendar.instance.currentYear.dateToDays(year, month, day, true, true);
                totalSeconds += SimpleCalendar.instance.currentYear.time.getTotalSeconds(days, false);
                SimpleCalendar.instance.currentYear.updateTime(SimpleCalendar.instance.currentYear.secondsToDate(totalSeconds));
                GameSettings.SaveCurrentDate(SimpleCalendar.instance.currentYear).catch(Logger.error);
                SimpleCalendar.instance.currentYear.syncTime().catch(Logger.error);
                SimpleCalendar.instance.updateApp();
            } else {
                Logger.error('The current year is not defined, can not use macro');
            }
        } else {
            GameSettings.UiNotification(GameSettings.Localize('FSC.Warn.Macros.GMUpdate'), 'warn');
        }
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
        if(GameSettings.IsGm()){
            if(SimpleCalendar.instance && SimpleCalendar.instance.currentYear){
                let timeChange = false;
                let dateChange = false;
                if(seconds !== 0){
                    SimpleCalendar.instance.currentYear.changeTime(true, 'second', seconds);
                    timeChange = true;
                }
                if(minutes !== 0){
                    SimpleCalendar.instance.currentYear.changeTime(true, 'minute', minutes);
                    timeChange = true;
                }
                if(hours !== 0){
                    SimpleCalendar.instance.currentYear.changeTime(true, 'hour', hours);
                    timeChange = true;
                }
                if(months !== 0){
                    SimpleCalendar.instance.currentYear.changeMonth(months, 'current');
                    dateChange = true;
                }
                if(days !== 0){
                    SimpleCalendar.instance.currentYear.changeDay(days, 'current');
                    dateChange = true;
                }
                if(years !== 0){
                    SimpleCalendar.instance.currentYear.changeYear(years, !dateChange, 'current');
                    dateChange = true;
                }
                if(dateChange || timeChange){
                    GameSettings.SaveCurrentDate(SimpleCalendar.instance.currentYear).catch(Logger.error);
                    SimpleCalendar.instance.currentYear.syncTime().catch(Logger.error);
                    SimpleCalendar.instance.updateApp();
                }
            } else {
                Logger.error('The current year is not defined, can not use macro');
            }
        } else {
            GameSettings.UiNotification(GameSettings.Localize('FSC.Warn.Macros.GMUpdate'), 'warn');
        }
    }
}
