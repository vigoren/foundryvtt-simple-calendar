import {ModuleName} from "../../constants";
import {CalManager, SC} from "../index";
import {Logger} from "../logging";
import {FormatDateTime} from "../utilities/date-time";

export class ChatTimestamp {
    public static addGameTimeToMessage(chatMessage: ChatMessage){
        const cal = CalManager.getActiveCalendar();
        const flagData: {id: string, timestamp: number} = {
            id: cal.id,
            timestamp: cal.toSeconds()
        };
        chatMessage.setFlag(ModuleName, 'sc-timestamps', flagData).catch(Logger.error);
    }

    public static renderTimestamp(chatMessage: ChatMessage, html: JQuery){
        if (SC.globalConfiguration.inGameChatTimestamp) {
            const timestamps = <{id: string, timestamp: number;}>chatMessage.getFlag(ModuleName, 'sc-timestamps');
            if(timestamps){
                const cal = CalManager.getCalendar(timestamps['id']);
                if(cal){
                    const dateTime = cal.secondsToDate(timestamps['timestamp']);
                    const formattedDateTime = FormatDateTime(dateTime, `${cal.generalSettings.dateFormat.chatTime}`, cal);
                    const foundryTime = html[0].querySelector('.message-header .message-metadata .message-timestamp');
                    if(foundryTime){
                        (<HTMLElement>foundryTime).style.display = 'none';
                        const newTime = document.createElement('time');
                        newTime.classList.add('sc-timestamp');
                        newTime.innerText = formattedDateTime;
                        foundryTime.after(newTime);
                    }
                }
            }
        }
    }
}
