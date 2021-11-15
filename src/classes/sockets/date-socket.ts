import SocketBase from "./socket-base";
import {SimpleCalendarSocket} from "../../interfaces";
import {SocketTypes} from "../../constants";
import {GameSettings} from "../foundry-interfacing/game-settings";
import SimpleCalendar from "../applications/simple-calendar";

export default class DateSocket extends SocketBase{
    constructor() {
        super();
    }

    public async process(data: SimpleCalendarSocket.Data): Promise<boolean> {
        if(data.type === SocketTypes.date && GameSettings.IsGm() && SimpleCalendar.instance.primary){
            const month = SimpleCalendar.instance.activeCalendar.year.months.find(m => m.numericRepresentation === (<SimpleCalendarSocket.SimpleCalendarSocketDate>data.data).month);
            if(month){
                const day = month.days.find(d => d.numericRepresentation === (<SimpleCalendarSocket.SimpleCalendarSocketDate>data.data).day);
                if(day){
                    SimpleCalendar.instance.setCurrentDate((<SimpleCalendarSocket.SimpleCalendarSocketDate>data.data).year, month, day);
                }
            }
            return true;
        }
        return false;
    }
}