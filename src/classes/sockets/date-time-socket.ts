import SocketBase from "./socket-base";
import {SocketTypes} from "../../constants";
import {GameSettings} from "../foundry-interfacing/game-settings";
import {Logger} from "../logging";
import type Calendar from "../calendar";
import {SC} from "../index";

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
    public async process(data: SimpleCalendar.SimpleCalendarSocket.Data, calendar: Calendar): Promise<boolean> {
        if(data.type === SocketTypes.dateTime && GameSettings.IsGm() && SC.primary){
            Logger.debug(`Processing Date/Time Change Request.`);
            if((<SimpleCalendar.SimpleCalendarSocket.SimpleCalendarSocketDateTime>data.data).interval){
                calendar.changeDateTime((<SimpleCalendar.SimpleCalendarSocket.SimpleCalendarSocketDateTime>data.data).interval, false);
            }
            return true;
        }
        return false;
    }
}