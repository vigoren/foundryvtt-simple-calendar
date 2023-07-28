import SocketBase from "./socket-base";
import { SocketTypes } from "../../constants";
import Ui from "../foundry-interfacing/ui";

export default class RenderChatLogSocket extends SocketBase {
    constructor() {
        super();
    }

    async process(data: SimpleCalendar.SimpleCalendarSocket.Data): Promise<boolean> {
        if (data.type === SocketTypes.renderChatLog) {
            if (<boolean>data.data) {
                Ui.renderChatLog();
            }
            return true;
        }
        return false;
    }
}
