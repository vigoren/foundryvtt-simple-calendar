import SocketBase from "./socket-base";
import { SocketTypes } from "../../constants";
import { ChatTimestamp } from "../chat/chat-timestamp";

export default class RenderChatLogSocket extends SocketBase {
    constructor() {
        super();
    }

    async process(data: SimpleCalendar.SimpleCalendarSocket.Data): Promise<boolean> {
        if (data.type === SocketTypes.renderChatLog) {
            if (<boolean>data.data) {
                ChatTimestamp.updateChatMessageTimestamps();
            }
            return true;
        }
        return false;
    }
}
