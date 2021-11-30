import SocketBase from "./socket-base";
import {SimpleCalendarSocket} from "../../interfaces";
import {SocketTypes} from "../../constants";
import {GameSettings} from "../foundry-interfacing/game-settings";
import {Logger} from "../logging";
import type Calendar from "../calendar";
import {CalManager, SC} from "../index";

/**
 * Date/Time Socket type that is called when a non primary GM user uses the change date/time controls
 */
export default class DateTimeSocket extends SocketBase{
    constructor() {
        super();
    }

    /**
     * If you are the priamry GM then process this request from a user
     * @param data
     * @param {Calendar} calendar
     */
    public async process(data: SimpleCalendarSocket.Data, calendar: Calendar): Promise<boolean> {
        if(data.type === SocketTypes.dateTime && GameSettings.IsGm() && SC.primary){
            Logger.debug(`Processing Date/Time Change Request.`);
            if((<SimpleCalendarSocket.SimpleCalendarSocketDateTime>data.data).dataType){
                switch ((<SimpleCalendarSocket.SimpleCalendarSocketDateTime>data.data).dataType){
                    case 'time':
                        if(!isNaN((<SimpleCalendarSocket.SimpleCalendarSocketDateTime>data.data).amount)){
                            calendar.year.changeTime((<SimpleCalendarSocket.SimpleCalendarSocketDateTime>data.data).isNext, (<SimpleCalendarSocket.SimpleCalendarSocketDateTime>data.data).unit, (<SimpleCalendarSocket.SimpleCalendarSocketDateTime>data.data).amount);
                        }
                        break;
                    case 'day':
                        calendar.year.changeDay((<SimpleCalendarSocket.SimpleCalendarSocketDateTime>data.data).isNext? 1 : -1, 'current');
                        break;
                    case 'month':
                        calendar.year.changeMonth((<SimpleCalendarSocket.SimpleCalendarSocketDateTime>data.data).isNext? 1 : -1, 'current');
                        break;
                    case 'year':
                        calendar.year.changeYear((<SimpleCalendarSocket.SimpleCalendarSocketDateTime>data.data).isNext? 1 : -1, false, "current");
                        break;
                }
                CalManager.saveCalendars();
                //Sync the current time on apply, this will propagate to other modules
                calendar.syncTime().catch(Logger.error);
            }
            return true;
        }
        return false;
    }
}