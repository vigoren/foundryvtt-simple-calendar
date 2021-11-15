import SocketBase from "./socket-base";
import {SimpleCalendarSocket} from "../../interfaces";
import {SocketTypes} from "../../constants";
import {GameSettings} from "../foundry-interfacing/game-settings";
import GameSockets from "../foundry-interfacing/game-sockets";
import {Logger} from "../logging";
import SimpleCalendar from "../applications/simple-calendar";

export default class CheckClockRunningSocket extends SocketBase {
    constructor() {
        super();
    }

    public async process(data: SimpleCalendarSocket.Data): Promise<boolean> {
        if (data.type === SocketTypes.checkClockRunning && GameSettings.IsGm() && SimpleCalendar.instance.primary){
            GameSockets.emit(<SimpleCalendarSocket.Data>{ type: SocketTypes.time, data: { timeKeeperStatus: SimpleCalendar.instance.activeCalendar.year.time.timeKeeper.getStatus() } }).catch(Logger.error);
            return true;
        }
        return false;
    }
}