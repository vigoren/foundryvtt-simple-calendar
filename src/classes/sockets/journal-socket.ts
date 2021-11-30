import SocketBase from "./socket-base";
import {SimpleCalendarSocket} from "../../interfaces";
import {SettingNames, SocketTypes} from "../../constants";
import {GameSettings} from "../foundry-interfacing/game-settings";
import {Logger} from "../logging";
import type Calendar from "../calendar";
import {SC} from "../index";

/**
 * Journal Socket type, used when a user wants to add a new note or edit an existing note
 */
export default class JournalSocket extends SocketBase{
    constructor() {
        super();
    }

    public async process(data: SimpleCalendarSocket.Data, calendar: Calendar): Promise<boolean> {
        //TODO: This either needs to be removed (with notes being saved as journal entries or updated so the user is not specifying the entire note collection)
        if (data.type === SocketTypes.journal && GameSettings.IsGm() && SC.primary){
            // If user is a GM and the primary GM then save the journal requests, otherwise do nothing
            Logger.debug(`Saving notes from user.`);
            await GameSettings.SaveObjectSetting(SettingNames.Notes, (<SimpleCalendarSocket.SimpleCalendarSocketJournal>data.data).notes.map(n => n.toConfig()));
            return true;
        }
        return false;
    }
}