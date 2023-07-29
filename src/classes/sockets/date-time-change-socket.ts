import SocketBase from "./socket-base";
import { DateTimeChangeSocketTypes, SocketTypes } from "../../constants";
import { GameSettings } from "../foundry-interfacing/game-settings";
import type Calendar from "../calendar";
import { MainApplication, SC } from "../index";
import { AdvanceTimeToPreset } from "../utilities/date-time";

/**
 * Date/Time Socket type that is called when a non-primary GM user uses the change date/time controls or the "Set To Current Date" button is clicked
 */
export default class DateTimeChangeSocket extends SocketBase {
    constructor() {
        super();
    }

    /**
     * If you are the primary GM then process this request from a user
     * @param data
     * @param {Calendar} calendar
     */
    public async process(data: SimpleCalendar.SimpleCalendarSocket.Data, calendar: Calendar): Promise<boolean> {
        if (data.type === SocketTypes.dateTimeChange && GameSettings.IsGm() && SC.primary) {
            const d = <SimpleCalendar.SimpleCalendarSocket.DateTimeChange>data.data;
            if (d.type === DateTimeChangeSocketTypes.setDate) {
                MainApplication.setCurrentDate(d.interval.year || 0, d.interval.month || 0, d.interval.day || 0);
            } else if (d.type === DateTimeChangeSocketTypes.changeDateTime) {
                calendar.changeDateTime(d.interval, { updateMonth: false });
            } else if (d.type === DateTimeChangeSocketTypes.advanceTimeToPreset && d.presetTimeOfDay) {
                await AdvanceTimeToPreset(d.presetTimeOfDay, calendar);
            }
            return true;
        }
        return false;
    }
}
