import SocketBase from "./socket-base";
import {SimpleCalendarSocket} from "../../interfaces";
import {SocketTypes} from "../../constants";
import {GameSettings} from "../foundry-interfacing/game-settings";
import GameSockets from "../foundry-interfacing/game-sockets";
import type Calendar from "../calendar";
import {SC} from "../index";

/**
 * Socket type used by connecting clients to see if the clock is currently running
 */
export default class CheckClockRunningSocket extends SocketBase {
    constructor() {
        super();
    }

    /**
     * When initializing this socket type, emit asking if the clock is running or not.
     */
    public async initialize(): Promise<boolean> {
        return GameSockets.emit({type: SocketTypes.checkClockRunning, data: {}});
    }

    /**
     * If a request is received asking if the clock is running, and you are the GM and the primary GM, emit out the current status of the clock.
     * @param data
     * @param {Calendar} calendar
     */
    public async process(data: SimpleCalendarSocket.Data, calendar: Calendar): Promise<boolean> {
        if (data.type === SocketTypes.checkClockRunning && GameSettings.IsGm() && SC.primary){
            return GameSockets.emit(<SimpleCalendarSocket.Data>{ type: SocketTypes.clock, data: { timeKeeperStatus: calendar.timeKeeper.getStatus() } });
        }
        return false;
    }
}