import SocketBase from "./socket-base";
import {SimpleCalendarSocket} from "../../interfaces";
import {GameWorldTimeIntegrations, SocketTypes} from "../../constants";
import Renderer from "../renderer";
import SimpleCalendar from "../applications/simple-calendar";

export default class TimeSocket extends SocketBase{
    constructor() {
        super();
    }

    public async process(data: SimpleCalendarSocket.Data): Promise<boolean> {
        console.log(data);
        if(data.type === SocketTypes.time) {
            // This is processed by all players to update the animated clock
            SimpleCalendar.instance.activeCalendar.year.time.timeKeeper.setStatus((<SimpleCalendarSocket.SimpleCalendarSocketTime>data.data).timeKeeperStatus);
            SimpleCalendar.instance.clockClass = (<SimpleCalendarSocket.SimpleCalendarSocketTime>data.data).timeKeeperStatus;
            if (SimpleCalendar.instance.activeCalendar.generalSettings.gameWorldTimeIntegration === GameWorldTimeIntegrations.None) {
                Renderer.Clock.UpdateListener(`sc_${SimpleCalendar.instance.activeCalendar.id}_clock`, (<SimpleCalendarSocket.SimpleCalendarSocketTime>data.data).timeKeeperStatus);
            }
            return true;
        }
        return false;
    }
}