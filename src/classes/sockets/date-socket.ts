import SocketBase from "./socket-base";
import {SocketTypes} from "../../constants";
import {GameSettings} from "../foundry-interfacing/game-settings";
import {MainApplication, SC} from "../index";
import type Calendar from "../calendar";

/**
 * Date socket type that processes a players request to change the current date.
 * This is called when a date is selected on the calendar view and the "Set To Current Date" button is clicked.
 */
export default class DateSocket extends SocketBase{
    constructor() {
        super();
    }

    /**
     * If we are the primary GM, this was a socket request from a player. We need to process the change so it is saved properly.
     * @param data
     * @param {Calendar} calendar
     */
    public async process(data: SimpleCalendar.SimpleCalendarSocket.Data, calendar: Calendar): Promise<boolean> {
        if(data.type === SocketTypes.date && GameSettings.IsGm() && SC.primary){
            MainApplication.setCurrentDate((<SimpleCalendar.SimpleCalendarSocket.SimpleCalendarSocketDate>data.data).year, (<SimpleCalendar.SimpleCalendarSocket.SimpleCalendarSocketDate>data.data).month, (<SimpleCalendar.SimpleCalendarSocket.SimpleCalendarSocketDate>data.data).day);
            return true;
        }
        return false;
    }
}