import { ModuleSocketName } from "../../constants";

/**
 * Soft wrapper around the foundry sockets class
 */
export default class GameSockets {
    /**
     * Initializes our socket with foundry and sets the listener function
     * @param {Function} listener The function to call when the socket is triggered
     */
    public static on(listener: (...args: any) => void) {
        const socket = (<Game>game).socket;
        if (socket) {
            socket.on(ModuleSocketName, listener);
        }
    }

    /**
     * Emits the passed in data on the modules socket
     * @param {*} data
     */
    public static async emit(data: SimpleCalendar.SimpleCalendarSocket.Data): Promise<boolean> {
        const socket = (<Game>game).socket;
        if (socket) {
            await socket.emit(ModuleSocketName, data);
            return true;
        }
        return false;
    }
}
