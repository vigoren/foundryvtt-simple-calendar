import SocketBase from "./socket-base";
import {SimpleCalendarSocket} from "../../interfaces";
import {SocketTypes} from "../../constants";
import {GameSettings} from "../foundry-interfacing/game-settings";
import {Logger} from "../logging";
import SimpleCalendar from "../applications/simple-calendar";

export default class DateTimeSocket extends SocketBase{
    constructor() {
        super();
    }

    public async process(data: SimpleCalendarSocket.Data): Promise<boolean> {
        if(data.type === SocketTypes.dateTime && GameSettings.IsGm() && SimpleCalendar.instance.primary){
            Logger.debug(`Processing Date/Time Change Request.`);
            if((<SimpleCalendarSocket.SimpleCalendarSocketDateTime>data.data).dataType){
                switch ((<SimpleCalendarSocket.SimpleCalendarSocketDateTime>data.data).dataType){
                    case 'time':
                        if(!isNaN((<SimpleCalendarSocket.SimpleCalendarSocketDateTime>data.data).amount)){
                            SimpleCalendar.instance.activeCalendar.year.changeTime((<SimpleCalendarSocket.SimpleCalendarSocketDateTime>data.data).isNext, (<SimpleCalendarSocket.SimpleCalendarSocketDateTime>data.data).unit, (<SimpleCalendarSocket.SimpleCalendarSocketDateTime>data.data).amount);
                        }
                        break;
                    case 'day':
                        SimpleCalendar.instance.activeCalendar.year.changeDay((<SimpleCalendarSocket.SimpleCalendarSocketDateTime>data.data).isNext? 1 : -1, 'current');
                        break;
                    case 'month':
                        SimpleCalendar.instance.activeCalendar.year.changeMonth((<SimpleCalendarSocket.SimpleCalendarSocketDateTime>data.data).isNext? 1 : -1, 'current');
                        break;
                    case 'year':
                        SimpleCalendar.instance.activeCalendar.year.changeYear((<SimpleCalendarSocket.SimpleCalendarSocketDateTime>data.data).isNext? 1 : -1, false, "current");
                        break;
                }
                GameSettings.SaveCurrentDate(SimpleCalendar.instance.activeCalendar.year).catch(Logger.error);
                //Sync the current time on apply, this will propagate to other modules
                SimpleCalendar.instance.activeCalendar.syncTime().catch(Logger.error);
            }
            return true;
        }
        return false;
    }
}