import type Calendar from "../calendar";

/**
 * The base class used for all socket types
 */
export default class SocketBase {
    constructor() {}

    /**
     * Initialize this socket type
     */
    public async initialize(): Promise<boolean> {
        return true;
    }

    /**
     * Process the data for this socket type
     * @param data
     * @param {Calendar} calendar
     */
    public async process(data: SimpleCalendar.SimpleCalendarSocket.Data, calendar: Calendar): Promise<boolean> {
        return false;
    }
}
