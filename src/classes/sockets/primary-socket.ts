import SocketBase from "./socket-base";
import {SimpleCalendarSocket} from "../../interfaces";
import {SimpleCalendarHooks, SocketTypes, TimeKeeperStatus} from "../../constants";
import {GameSettings} from "../foundry-interfacing/game-settings";
import {Logger} from "../logging";
import GameSockets from "../foundry-interfacing/game-sockets";
import Hook from "../api/hook";
import SimpleCalendar from "../applications/simple-calendar";

export default class PrimarySocket extends SocketBase {
    /**
     * The primary check timeout number used when checking if this user is the GM
     * @type{number|undefined}
     * @private
     */
    private primaryCheckTimeout: number | undefined;

    constructor() {
        super();
    }

    async primaryCheckTimeoutCall(){
        Logger.debug('No primary GM found, taking over as primary');
        SimpleCalendar.instance.primary = true;
        const socketData = <SimpleCalendarSocket.Data>{type: SocketTypes.primary, data: {amPrimary: SimpleCalendar.instance.primary}};
        await GameSockets.emit(socketData);
        const timeKeeperSocketData = <SimpleCalendarSocket.Data>{type: SocketTypes.time, data: {timeKeeperStatus: TimeKeeperStatus.Stopped}};
        await GameSockets.emit(timeKeeperSocketData);
        if(SimpleCalendar.instance.activeCalendar.year.time.unifyGameAndClockPause){
            (<Game>game).togglePause(true, true);
        }
        await SimpleCalendar.instance.timeKeepingCheck();
        SimpleCalendar.instance.updateApp();
        Hook.emit(SimpleCalendarHooks.PrimaryGM);
        Hook.emit(SimpleCalendarHooks.Ready);
    }

    public initialize() {
        if(GameSettings.IsGm()){
            const socket = <SimpleCalendarSocket.Data>{
                type: SocketTypes.primary,
                data: <SimpleCalendarSocket.SimpleCalendarPrimary> {
                    primaryCheck: true
                }
            };
            this.primaryCheckTimeout = window.setTimeout(this.primaryCheckTimeoutCall.bind(this), 5000);
            GameSockets.emit(socket).catch(Logger.error);
        } else {
            Hook.emit(SimpleCalendarHooks.Ready);
        }
    }

    public async process(data: SimpleCalendarSocket.Data): Promise<boolean> {
        if (data.type === SocketTypes.primary){
            if(GameSettings.IsGm()){
                // Another client is asking if anyone is the primary GM, respond accordingly
                if((<SimpleCalendarSocket.SimpleCalendarPrimary>data.data).primaryCheck){
                    Logger.debug(`Checking if I am the primary`);
                    await GameSockets.emit(<SimpleCalendarSocket.Data>{
                        type: SocketTypes.primary,
                        data: <SimpleCalendarSocket.SimpleCalendarPrimary> {
                            amPrimary: SimpleCalendar.instance.primary
                        }
                    });
                }
                    // Another client has emitted that they are the primary, stop my check and set myself to not being the primary
                // This CAN lead to no primary if 2 GMs finish their primary check at the same time. This is best resolved by 1 gm reloading the page.
                else if((<SimpleCalendarSocket.SimpleCalendarPrimary>data.data).amPrimary !== undefined){
                    if((<SimpleCalendarSocket.SimpleCalendarPrimary>data.data).amPrimary){
                        Logger.debug('A primary GM is all ready present.');
                        window.clearTimeout(this.primaryCheckTimeout);
                        SimpleCalendar.instance.primary = false;
                        Hook.emit(SimpleCalendarHooks.Ready);
                    } else {
                        Logger.debug('We are all ready waiting to take over as primary.');
                    }
                }
            }
            return true;
        }
        return false;
    }
}