import SocketBase from "./socket-base";
import { SocketTypes } from "../../constants";
import { MainApplication } from "../index";
import { GameSettings } from "../foundry-interfacing/game-settings";

/**
 * Will trigger each user, or the specified user to update the main application
 */
export default class MainAppUpdateSocket extends SocketBase {
    constructor() {
        super();
    }

    async process(data: SimpleCalendar.SimpleCalendarSocket.Data): Promise<boolean> {
        if (data.type === SocketTypes.mainAppUpdate) {
            const d = <SimpleCalendar.SimpleCalendarSocket.MainAppUpdate>data.data;
            if (d.userId) {
                if (GameSettings.UserID() === d.userId) {
                    MainApplication.updateApp();
                }
            } else {
                MainApplication.updateApp();
            }
            return true;
        }
        return false;
    }
}
