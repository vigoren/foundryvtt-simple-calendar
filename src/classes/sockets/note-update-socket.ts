import SocketBase from "./socket-base";
import { ModuleName, SocketTypes } from "../../constants";
import GameSockets from "../foundry-interfacing/game-sockets";
import { MainApplication, NManager } from "../index";

/**
 * Note Reminder socket type, this is triggered when a user wants to be reminded of a note they do not own
 */
export default class NoteUpdateSocket extends SocketBase {
    constructor() {
        super();
    }

    public async process(data: SimpleCalendar.SimpleCalendarSocket.Data): Promise<boolean> {
        if (data.type === SocketTypes.noteUpdate) {
            const d = <SimpleCalendar.SimpleCalendarSocket.NoteUpdate>data.data;
            const je = (<Game>game).journal?.get(d.journalId || "");
            //Make sure the journal and user id are set
            if (je && d.userId) {
                const flags = <Record<string, any>>je.getFlag(ModuleName, "noteData");
                if (flags) {
                    const userIndex = (<SimpleCalendar.NoteData>flags).remindUsers.indexOf(d.userId);
                    if (userIndex === -1) {
                        (<SimpleCalendar.NoteData>flags).remindUsers.push(d.userId);
                    } else {
                        (<SimpleCalendar.NoteData>flags).remindUsers.splice(userIndex, 1);
                    }
                    const fo: Record<string, any> = {};
                    fo[ModuleName] = { noteData: flags };
                    await je.update({ flags: fo });
                    await GameSockets.emit({
                        type: SocketTypes.mainAppUpdate,
                        data: {
                            userId: d.userId
                        }
                    });
                }
            } else if (d.calendarId && d.newOrder && d.date) {
                //Otherwise, this was a note order update
                await NManager.orderNotesOnDay(d.calendarId, d.newOrder, d.date);
                await GameSockets.emit({ type: SocketTypes.mainAppUpdate, data: {} });
                MainApplication.updateApp();
            }
            return true;
        }
        return false;
    }
}
