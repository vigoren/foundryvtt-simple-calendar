import SocketBase from "./socket-base";
import {SimpleCalendarSocket} from "../../interfaces";
import {SocketTypes} from "../../constants";
import SimpleCalendar from "../applications/simple-calendar";

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