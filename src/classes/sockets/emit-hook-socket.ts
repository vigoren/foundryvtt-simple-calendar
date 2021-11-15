import SocketBase from "./socket-base";
import {SimpleCalendarSocket} from "../../interfaces";
import Hook from "../api/hook";
import {SocketTypes} from "../../constants";

export default class EmitHookSocket extends SocketBase {
    constructor() {
        super();
    }

    public async process(data: SimpleCalendarSocket.Data): Promise<boolean> {
        if(data.type === SocketTypes.emitHook){
            const hook = (<SimpleCalendarSocket.SimpleCalendarEmitHook>data.data).hook
            if(hook){
                Hook.emit(hook, (<SimpleCalendarSocket.SimpleCalendarEmitHook>data.data).param);
            }
            return true;
        }
        return false;
    }
}