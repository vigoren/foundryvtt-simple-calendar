import SocketBase from "./socket-base";
import Calendar from "../calendar";
import {SocketTypes} from "../../constants";
import Ui from "../foundry-interfacing/ui";

export default class RenderChatLogSocket extends SocketBase {
    constructor() {
        super();
    }

    async process(data: SimpleCalendar.SimpleCalendarSocket.Data, calendar: Calendar): Promise<boolean> {
        if(data.type === SocketTypes.renderChatLog){
            if(<boolean>data.data){
                Ui.renderChatLog();
            }
            return true;
        }
        return false;
    }
}
