import SocketBase from "./socket-base";
import {SimpleCalendarSocket} from "../../interfaces";
import {SocketTypes} from "../../constants";
import type Calendar from "../calendar";
import {SC} from "../index"

/**
 * Note Reminder socket type, this is triggered for each client to check if any note reminders need to be triggered
 */
export default class NoteRemindersSocket extends SocketBase{
    constructor() {
        super();
    }

    public async process(data: SimpleCalendarSocket.Data, calendar: Calendar): Promise<boolean> {
        if(data.type === SocketTypes.noteReminders){
            SC.checkNoteReminders((<SimpleCalendarSocket.SimpleCalendarNoteReminder>data.data).justTimeChange);
            return true;
        }
        return false;
    }
}