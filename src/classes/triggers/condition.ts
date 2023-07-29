import { TriggerConditions } from "../../constants";
import { CalManager } from "../index";
import { ToSeconds } from "../utilities/date-time";
import { generateUniqueId } from "../utilities/string";
import { TriggerParameter } from "./ parameter";

export class TriggerCondition {
    id: string;

    conditionType: TriggerConditions;

    parameters: TriggerParameter[] = [];

    constructor(type: TriggerConditions, parameters: TriggerParameter[]) {
        this.id = generateUniqueId();
        this.conditionType = type;
        this.parameters = parameters;
    }

    isMet(date: SimpleCalendar.DateTime) {
        let v1: number = 0,
            v2: number = 0;
        const calendar = CalManager.getActiveCalendar();
        const currentDate = calendar.getCurrentDate();

        switch (this.conditionType) {
            case TriggerConditions.Date:
                v1 = ToSeconds(calendar, date.year, date.month, date.day);
                v2 = ToSeconds(calendar, currentDate.year, currentDate.month, currentDate.day, false);
                break;
            case TriggerConditions.Time:
                v1 =
                    date.hour * calendar.time.minutesInHour * calendar.time.secondsInMinute +
                    date.minute * calendar.time.secondsInMinute +
                    date.seconds;
                v2 = calendar.time.seconds;
                break;
            case TriggerConditions.DateTime:
                v1 =
                    ToSeconds(calendar, date.year, date.month, date.day) +
                    (date.hour * calendar.time.minutesInHour * calendar.time.secondsInMinute +
                        date.minute * calendar.time.secondsInMinute +
                        date.seconds);
                v2 = ToSeconds(calendar, currentDate.year, currentDate.month, currentDate.day, false) + calendar.time.seconds;
                break;
            case TriggerConditions.Year:
                v1 = date.year;
                v2 = currentDate.year;
                break;
            case TriggerConditions.Month:
                v1 = date.month;
                v2 = currentDate.month;
                break;
            case TriggerConditions.Day:
                v1 = date.day;
                v2 = currentDate.day;
                break;
            default:
                break;
        }
        let met = false;
        for (let i = 0; i < this.parameters.length; i++) {
            const r = this.parameters[i].check(v1, v2);
            if (i === 0) {
                met = r;
            } else if (this.parameters[i].isOr) {
                met = met || r;
            } else {
                met = met && r;
            }
        }
        return met;
    }
}
