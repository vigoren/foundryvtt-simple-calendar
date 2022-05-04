import SocketBase from "./socket-base";
import Calendar from "../calendar";
import {SocketTypes} from "../../constants";
import {CalManager, SC} from "../index";
import {GameSettings} from "../foundry-interfacing/game-settings";

export default class SetActiveCalendar extends SocketBase{
    constructor() {
        super();
    }

    public async process(data: SimpleCalendar.SimpleCalendarSocket.Data, calendar: Calendar): Promise<boolean> {
        if(data.type === SocketTypes.setActiveCalendar && GameSettings.IsGm() && SC.primary) {
            CalManager.setActiveCalendar((<SimpleCalendar.SimpleCalendarSocket.SetActiveCalendar>data.data).calendarId);
            return true;
        }
        return false;
    }
}