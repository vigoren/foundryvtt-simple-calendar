import SocketBase from "./socket-base";
import {SimpleCalendarSocket} from "../../interfaces";
import {GameWorldTimeIntegrations, SocketTypes} from "../../constants";
import Renderer from "../renderer";
import {MainApplication} from "../index";
import type Calendar from "../calendar";

/**
 * Clock socket type, used to update the clock status
 */
export default class ClockSocket extends SocketBase{
    constructor() {
        super();
    }

    public async process(data: SimpleCalendarSocket.Data, calendar: Calendar): Promise<boolean> {
        if(data.type === SocketTypes.clock) {
            // This is processed by all players to update the animated clock
            calendar.timeKeeper.setStatus((<SimpleCalendarSocket.SimpleCalendarSocketTime>data.data).timeKeeperStatus);
            MainApplication.clockClass = (<SimpleCalendarSocket.SimpleCalendarSocketTime>data.data).timeKeeperStatus;
            if (calendar.generalSettings.gameWorldTimeIntegration === GameWorldTimeIntegrations.None) {
                Renderer.Clock.UpdateListener(`sc_${calendar.id}_clock`, (<SimpleCalendarSocket.SimpleCalendarSocketTime>data.data).timeKeeperStatus);
            }
            return true;
        }
        return false;
    }
}