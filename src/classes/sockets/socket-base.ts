import {SimpleCalendarSocket} from "../../interfaces";

/**
 * The base class used for all socket types
 */
export default class SocketBase{
    constructor() {}

    /**
     * Initialize this socket type
     */
    public async initialize():Promise<boolean> {return true;}

    /**
     * Process the data for this socket type
     * @param data
     */
    public async process(data: SimpleCalendarSocket.Data): Promise<boolean>{return false;}
}