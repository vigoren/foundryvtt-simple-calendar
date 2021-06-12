import {SimpleCalendarHooks, TimeKeeperStatus} from "../constants";
import SimpleCalendar from "./simple-calendar";
import {Logger} from "./logging";

export default class Hook{

    /**
     * Emit a specific hook for other things to listen too. Data is put together within this function.
     * @param {SimpleCalendarHooks} hook The hook to emit
     */
    public static emit(hook: SimpleCalendarHooks){
        if(SimpleCalendar.instance && SimpleCalendar.instance.currentYear){
            const data: any = {};

            if(hook === SimpleCalendarHooks.DateTimeChange){
                data['season'] = {};
                data['moons'] = [];
                data['month'] = {};
                data['day'] = {};
                data['time'] = {};
                data['year'] = {
                    number: SimpleCalendar.instance.currentYear.numericRepresentation,
                    prefix: SimpleCalendar.instance.currentYear.prefix,
                    postfix: SimpleCalendar.instance.currentYear.postfix,
                    isLeapYear: SimpleCalendar.instance.currentYear.leapYearRule.isLeapYear(SimpleCalendar.instance.currentYear.numericRepresentation)
                };
                const currentMonth = SimpleCalendar.instance.currentYear.getMonth();
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
                data.time = SimpleCalendar.instance.currentYear.time.getCurrentTime();
                data.season = SimpleCalendar.instance.currentYear.getCurrentSeason();

                for(let i = 0; i < SimpleCalendar.instance.currentYear.moons.length; i++){
                    const phase = SimpleCalendar.instance.currentYear.moons[i].getMoonPhase(SimpleCalendar.instance.currentYear);
                    data.moons.push({
                        name: SimpleCalendar.instance.currentYear.moons[i].name,
                        color: SimpleCalendar.instance.currentYear.moons[i].color,
                        cycleLength: SimpleCalendar.instance.currentYear.moons[i].cycleLength,
                        cycleDayAdjust: SimpleCalendar.instance.currentYear.moons[i].cycleDayAdjust,
                        currentPhase: phase
                    });
                }
            } else if(hook === SimpleCalendarHooks.ClockStartStop){
                const status = SimpleCalendar.instance.currentYear.time.timeKeeper.getStatus();
                data['started'] = status === TimeKeeperStatus.Started;
                data['stopped'] = status === TimeKeeperStatus.Stopped;
                data['paused'] = status === TimeKeeperStatus.Paused;
            } else if(hook === SimpleCalendarHooks.PrimaryGM){
                data['isPrimaryGM'] = SimpleCalendar.instance.primary;
            }
            Hooks.callAll(hook, data);
        } else {
            Logger.error(`Unable to emit hook as current year is not set up.`);
        }
    }
}
