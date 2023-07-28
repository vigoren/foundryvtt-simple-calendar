import SocketBase from "./socket-base";
import { GameWorldTimeIntegrations, SocketTypes, TimeKeeperStatus } from "../../constants";
import Renderer from "../renderer";
import { MainApplication } from "../index";
import type Calendar from "../calendar";

/**
 * Clock socket type, used to update the clock status
 */
export default class ClockSocket extends SocketBase {
    constructor() {
        super();
    }

    public async process(data: SimpleCalendar.SimpleCalendarSocket.Data, calendar: Calendar): Promise<boolean> {
        if (data.type === SocketTypes.clock) {
            // This is processed by all players to update the animated clock
            calendar.timeKeeper.setStatus(<TimeKeeperStatus>data.data);
            MainApplication.clockClass = <TimeKeeperStatus>data.data;
            if (calendar.generalSettings.gameWorldTimeIntegration === GameWorldTimeIntegrations.None) {
                Renderer.Clock.UpdateListener(`sc_${calendar.id}_clock`, <TimeKeeperStatus>data.data);
            }
            return true;
        }
        return false;
    }
}
