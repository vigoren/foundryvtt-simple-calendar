import {SimpleCalendarHooks} from "../../constants";
import SimpleCalendar from "../applications/simple-calendar";
import {Logger} from "../logging";
import API from "./index";

export default class Hook{

    /**
     * Emit a specific hook for other things to listen too. Data is put together within this function.
     * @param {SimpleCalendarHooks} hook The hook to emit
     * @param param
     */
    public static emit(hook: SimpleCalendarHooks, param: any = undefined){
        let data: any = {};
        if(SimpleCalendar.instance){
            if(hook === SimpleCalendarHooks.DateTimeChange){
                data['date'] = API.timestampToDate(SimpleCalendar.instance.activeCalendar.year.toSeconds());
                data['diff'] = param;
                data['moons'] = [];

                data['season'] = {};
                data['month'] = {};
                data['day'] = {};
                data['time'] = {};
                data['year'] = {
                    number: SimpleCalendar.instance.activeCalendar.year.numericRepresentation,
                    prefix: SimpleCalendar.instance.activeCalendar.year.prefix,
                    postfix: SimpleCalendar.instance.activeCalendar.year.postfix,
                    isLeapYear: SimpleCalendar.instance.activeCalendar.year.leapYearRule.isLeapYear(SimpleCalendar.instance.activeCalendar.year.numericRepresentation)
                };
                const currentMonth = SimpleCalendar.instance.activeCalendar.year.getMonth();
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
                data.time = SimpleCalendar.instance.activeCalendar.year.time.getCurrentTime();
                data.season = SimpleCalendar.instance.activeCalendar.year.getCurrentSeason();

                for(let i = 0; i < SimpleCalendar.instance.activeCalendar.year.moons.length; i++){
                    const phase = SimpleCalendar.instance.activeCalendar.year.moons[i].getMoonPhase(SimpleCalendar.instance.activeCalendar.year);
                    data.moons.push({
                        name: SimpleCalendar.instance.activeCalendar.year.moons[i].name,
                        color: SimpleCalendar.instance.activeCalendar.year.moons[i].color,
                        cycleLength: SimpleCalendar.instance.activeCalendar.year.moons[i].cycleLength,
                        cycleDayAdjust: SimpleCalendar.instance.activeCalendar.year.moons[i].cycleDayAdjust,
                        currentPhase: phase
                    });
                }
            } else if(hook === SimpleCalendarHooks.ClockStartStop){
                data = API.clockStatus();
            } else if(hook === SimpleCalendarHooks.PrimaryGM){
                data['isPrimaryGM'] = API.isPrimaryGM();
            }
            Hooks.callAll(hook, data);
        } else {
            Logger.error(`Simple Calendar instance is not defined.`);
        }


    }
}
