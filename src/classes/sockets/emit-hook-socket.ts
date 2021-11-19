import SocketBase from "./socket-base";
import {SimpleCalendarSocket} from "../../interfaces";
import Hook from "../api/hook";
import {SocketTypes} from "../../constants";
import type Calendar from "../calendar";

/**
 * Emit Hook Socket type that will emit the specified hook
 */
export default class EmitHookSocket extends SocketBase {
    constructor() {
        super();
    }

    /**
     * All clients will emit this passed in hook.
     * @param data
     * @param {Calendar} calendar
     */
    public async process(data: SimpleCalendarSocket.Data, calendar: Calendar): Promise<boolean> {
        if(data.type === SocketTypes.emitHook){
            const hook = (<SimpleCalendarSocket.SimpleCalendarEmitHook>data.data).hook
            if(hook){
                Hook.emit(hook, calendar, (<SimpleCalendarSocket.SimpleCalendarEmitHook>data.data).param);
            }
            return true;
        }
        return false;
    }
}