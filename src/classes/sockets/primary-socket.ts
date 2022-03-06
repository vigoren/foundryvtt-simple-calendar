import SocketBase from "./socket-base";
import {SimpleCalendarHooks, SocketTypes, TimeKeeperStatus} from "../../constants";
import {GameSettings} from "../foundry-interfacing/game-settings";
import {Logger} from "../logging";
import GameSockets from "../foundry-interfacing/game-sockets";
import {Hook} from "../api/hook";
import {CalManager, MainApplication, SC} from "../index";
import type Calendar from "../calendar";

/**
 * Socket calls used to set who is considered the primary GM
 */
export default class PrimarySocket extends SocketBase {
    /**
     * How long to wait for a response to who is the primary GM before taking over as primary.
     * @type{number}
     * @private
     */
    private checkDuration: number = 5000;
    /**
     * If another primary GM responded
     * @private
     */
    private otherPrimaryFound: boolean = false;

    constructor() {
        super();
    }

    /**
     * Called when no primary GM was found
     * Emit a socket saying that we have taken over as primary.
     * Emit a socket saying that the clock is currently not running. (increase the clock was running and the GM got disconnected)
     * Emit the hook saying we are the primary GM
     */
    async primaryCheckTimeoutCall(){
        Logger.debug('No primary GM found, taking over as primary');
        const activeCalendar = CalManager.getActiveCalendar();
        SC.primary = true;
        const socketData = <SimpleCalendar.SimpleCalendarSocket.Data>{type: SocketTypes.primary, data: {amPrimary: SC.primary}};
        await GameSockets.emit(socketData);
        const timeKeeperSocketData = <SimpleCalendar.SimpleCalendarSocket.Data>{type: SocketTypes.clock, data: {timeKeeperStatus: TimeKeeperStatus.Stopped}};
        await GameSockets.emit(timeKeeperSocketData);
        if(activeCalendar.time.unifyGameAndClockPause){
            (<Game>game).togglePause(true, true);
        }
        await MainApplication.timeKeepingCheck();
        Hook.emit(SimpleCalendarHooks.PrimaryGM, activeCalendar);
    }

    /**
     * Initializes this socket type by emitting a socket asking if anyone is currently the primary GM
     * Also starts a timeout, if no one responds in the timeframe we assume we are the primary
     */
    public async initialize(): Promise<boolean> {
        if(GameSettings.IsGm()){
            const users = (<Game>game).users;
            const numberOfGMs = users? users.filter(u => u.isGM).length : 0;
            //If more than 1 GM in the world, check to see who is the primary GM. Otherwise take over as primary GM
            if(numberOfGMs > 1){
                const socket = <SimpleCalendar.SimpleCalendarSocket.Data>{
                    type: SocketTypes.primary,
                    data: <SimpleCalendar.SimpleCalendarSocket.SimpleCalendarPrimary> {
                        primaryCheck: true
                    }
                };
                return GameSockets.emit(socket).then(() => {
                    return new Promise<boolean>(resolve => {
                        //Set a timeout for the check duration
                        window.setTimeout(((r: Function) => {
                            //If no other primary GM was found, take over
                            if(!this.otherPrimaryFound){
                                this.primaryCheckTimeoutCall();
                            }
                            r(true);
                        }).bind(this, resolve), this.checkDuration);
                    });
                });
            } else {
                await this.primaryCheckTimeoutCall();
                return true;
            }
        } else {
            return true;
        }
    }

    /**
     * Process this socket type
     * @param data
     * @param {Calendar} calendar
     */
    public async process(data: SimpleCalendar.SimpleCalendarSocket.Data, calendar: Calendar): Promise<boolean> {
        if (data.type === SocketTypes.primary){
            if(GameSettings.IsGm()){
                // Another client is asking if anyone is the primary GM, respond accordingly
                if((<SimpleCalendar.SimpleCalendarSocket.SimpleCalendarPrimary>data.data).primaryCheck){
                    Logger.debug(`Checking if I am the primary`);
                    await GameSockets.emit(<SimpleCalendar.SimpleCalendarSocket.Data>{
                        type: SocketTypes.primary,
                        data: <SimpleCalendar.SimpleCalendarSocket.SimpleCalendarPrimary> {
                            amPrimary: SC.primary
                        }
                    });
                }
                // Another client has emitted that they are the primary, stop my check and set myself to not being the primary
                // This CAN lead to no primary if 2 GMs finish their primary check at the same time. This is best resolved by 1 gm reloading the page.
                else if((<SimpleCalendar.SimpleCalendarSocket.SimpleCalendarPrimary>data.data).amPrimary !== undefined){
                    if((<SimpleCalendar.SimpleCalendarSocket.SimpleCalendarPrimary>data.data).amPrimary){
                        Logger.debug('A primary GM is all ready present.');
                        this.otherPrimaryFound = true;
                        SC.primary = false;
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