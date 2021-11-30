import SocketBase from "./socket-base";
import {SimpleCalendarSocket} from "../../interfaces";
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
    public async process(data: SimpleCalendarSocket.Data, calendar: Calendar): Promise<boolean> {
        if(data.type === SocketTypes.date && GameSettings.IsGm() && SC.primary){
            const month = calendar.year.months.find(m => m.numericRepresentation === (<SimpleCalendarSocket.SimpleCalendarSocketDate>data.data).month);
            if(month){
                const day = month.days.find(d => d.numericRepresentation === (<SimpleCalendarSocket.SimpleCalendarSocketDate>data.data).day);
                if(day){
                    MainApplication.setCurrentDate((<SimpleCalendarSocket.SimpleCalendarSocketDate>data.data).year, month, day);
                }
            }
            return true;
        }
        return false;
    }
}