import {SimpleCalendarSocket} from "../../interfaces";

export default class SocketBase{
    constructor() {}

    public initialize(){}

    public async process(data: SimpleCalendarSocket.Data): Promise<boolean>{return false;}
}