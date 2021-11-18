import SocketBase from "./socket-base";
import {SimpleCalendarSocket} from "../../interfaces";
import {SocketTypes} from "../../constants";
import SimpleCalendar from "../simple-calendar";

/**
 * Note Reminder socket type, this is triggered for each client to check if any note reminders need to be triggered
 */
export default class NoteRemindersSocket extends SocketBase{
    constructor() {
        super();
    }

    public async process(data: SimpleCalendarSocket.Data): Promise<boolean> {
        if(data.type === SocketTypes.noteReminders){
            SimpleCalendar.instance.checkNoteReminders((<SimpleCalendarSocket.SimpleCalendarNoteReminder>data.data).justTimeChange);
            return true;
        }
        return false;
    }
}