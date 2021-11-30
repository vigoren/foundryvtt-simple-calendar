import {SimpleCalendarHooks, TimeKeeperStatus} from "../../constants";
import {TimestampToDate} from "../utilities/date-time";
import type Calendar from "../calendar";
import {SC} from "../index";


export default class Hook{

    /**
     * Emit a specific hook for other things to listen too. Data is put together within this function.
     * @param {SimpleCalendarHooks} hook The hook to emit
     * @param {Calendar} calendar
     * @param param
     */
    public static emit(hook: SimpleCalendarHooks, calendar: Calendar, param: any = undefined){
        let data: any = {};

        if(hook === SimpleCalendarHooks.DateTimeChange){
            data['date'] = TimestampToDate(calendar.year.toSeconds(), calendar);
            data['diff'] = param;
            data['moons'] = [];

            data['season'] = {};
            data['month'] = {};
            data['day'] = {};
            data['time'] = {};
            data['year'] = {
                number: calendar.year.numericRepresentation,
                prefix: calendar.year.prefix,
                postfix: calendar.year.postfix,
                isLeapYear: calendar.year.leapYearRule.isLeapYear(calendar.year.numericRepresentation)
            };
            const currentMonth = calendar.year.getMonth();
            if(currentMonth){
                data.month = {
                    name: currentMonth.name,
                    number: currentMonth.numericRepresentation,
                    intercalary: currentMonth.intercalary,
                    numberOfDays: currentMonth.numberOfDays,
                    numberOfLeapYearDays: currentMonth.numberOfLeapYearDays
                };
                const currentDay = currentMonth.getDay();
                if(currentDay){
                    data.day = {
                        number: currentDay.numericRepresentation
                    };
                }
            }
            data.time = calendar.year.time.getCurrentTime();
            data.season = calendar.year.getCurrentSeason();

            for(let i = 0; i < calendar.year.moons.length; i++){
                const phase = calendar.year.moons[i].getMoonPhase(calendar.year);
                data.moons.push({
                    name: calendar.year.moons[i].name,
                    color: calendar.year.moons[i].color,
                    cycleLength: calendar.year.moons[i].cycleLength,
                    cycleDayAdjust: calendar.year.moons[i].cycleDayAdjust,
                    currentPhase: phase
                });
            }
        } else if(hook === SimpleCalendarHooks.ClockStartStop){
            const status = calendar.year.time.timeKeeper.getStatus();
            data = {
                started: status === TimeKeeperStatus.Started,
                stopped: status === TimeKeeperStatus.Stopped,
                paused: status === TimeKeeperStatus.Paused
            };
        } else if(hook === SimpleCalendarHooks.PrimaryGM){
            data['isPrimaryGM'] = SC.primary;
        }
        Hooks.callAll(hook, data);
    }
}
