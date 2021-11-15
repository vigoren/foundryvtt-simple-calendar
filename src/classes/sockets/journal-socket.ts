import SocketBase from "./socket-base";
import {SimpleCalendarSocket} from "../../interfaces";
import {SocketTypes} from "../../constants";
import {GameSettings} from "../foundry-interfacing/game-settings";
import {Logger} from "../logging";
import SimpleCalendar from "../applications/simple-calendar";

export default class JournalSocket extends SocketBase{
    constructor() {
        super();
    }

    public async process(data: SimpleCalendarSocket.Data): Promise<boolean> {
        if (data.type === SocketTypes.journal && GameSettings.IsGm() && SimpleCalendar.instance.primary){
            // If user is a GM and the primary GM then save the journal requests, otherwise do nothing
            Logger.debug(`Saving notes from user.`);
            await GameSettings.SaveNotes((<SimpleCalendarSocket.SimpleCalendarSocketJournal>data.data).notes);
            return true;
        }
        return false;
    }
}