import SocketBase from "./socket-base";
import {SimpleCalendarSocket} from "../../interfaces";
import Hook from "../api/hook";
import {SocketTypes} from "../../constants";
import SimpleCalendar from "../simple-calendar";

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
     */
    public async process(data: SimpleCalendarSocket.Data): Promise<boolean> {
        if(data.type === SocketTypes.emitHook){
            const hook = (<SimpleCalendarSocket.SimpleCalendarEmitHook>data.data).hook
            if(hook){
                Hook.emit(hook, SimpleCalendar.instance.activeCalendar, (<SimpleCalendarSocket.SimpleCalendarEmitHook>data.data).param);
            }
            return true;
        }
        return false;
    }
}