import GameSockets from "../foundry-interfacing/game-sockets";
import {SimpleCalendarSocket} from "../../interfaces";
import {SimpleCalendarHooks} from "../../constants";
import {Logger} from "../logging";
import ClockSocket from "./clock-socket";
import SocketBase from "./socket-base";
import CheckClockRunningSocket from "./check-clock-running-socket";
import DateSocket from "./date-socket";
import DateTimeSocket from "./date-time-socket";
import EmitHookSocket from "./emit-hook-socket";
import JournalSocket from "./journal-socket";
import NoteRemindersSocket from "./note-reminders-socket";
import PrimarySocket from "./primary-socket";
import Hook from "../api/hook";
import {CalManager, MainApplication} from "../index";

export default class Sockets {

    /**
     * The list of all socket types currently supported.
     * @private
     */
    private sockets: SocketBase[] = [];

    constructor() {
        this.sockets.push(new CheckClockRunningSocket());
        this.sockets.push(new ClockSocket());
        this.sockets.push(new DateSocket());
        this.sockets.push(new DateTimeSocket());
        this.sockets.push(new EmitHookSocket());
        this.sockets.push(new JournalSocket());
        this.sockets.push(new NoteRemindersSocket());
        this.sockets.push(new PrimarySocket());
    }

    /**
     * Initializes all of the socket types
     */
    public initialize(){
        //Set up the socket we use to forward data between players and the GM
        GameSockets.on(this.process.bind(this));
        //Initialize all our sockets

        Promise.all(this.sockets.map(s => s.initialize()))
            .then((results => {
                MainApplication.updateApp();
                Hook.emit(SimpleCalendarHooks.Ready, CalManager.getActiveCalendar());
            }))
            .catch(Logger.error);
    }

    /**
     * Process any data received over our socket
     * @param {SimpleCalendarSocket.Data} data The data received
     */
    async process(data: SimpleCalendarSocket.Data){
        Logger.debug(`Processing ${data.type} socket emit`);
        const activeCalendar = CalManager.getActiveCalendar();
        for(let i = 0; i < this.sockets.length; i++){
            // If this socket processed the data, then no need to check the other sockets.
            if(await this.sockets[i].process(data, activeCalendar)){
                break;
            }
        }
    }
}