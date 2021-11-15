import GameSockets from "../foundry-interfacing/game-sockets";
import {SimpleCalendarSocket} from "../../interfaces";
import {SocketTypes} from "../../constants";
import {Logger} from "../logging";
import TimeSocket from "./time-socket";
import SocketBase from "./socket-base";
import CheckClockRunningSocket from "./check-clock-running-socket";
import DateSocket from "./date-socket";
import DateTimeSocket from "./date-time-socket";
import EmitHookSocket from "./emit-hook-socket";
import JournalSocket from "./journal-socket";
import NoteRemindersSocket from "./note-reminders-socket";
import PrimarySocket from "./primary-socket";

export default class Sockets {

    private sockets: SocketBase[] = [];

    constructor() {
        this.sockets.push(new CheckClockRunningSocket());
        this.sockets.push(new DateSocket());
        this.sockets.push(new DateTimeSocket());
        this.sockets.push(new EmitHookSocket());
        this.sockets.push(new JournalSocket());
        this.sockets.push(new NoteRemindersSocket());
        this.sockets.push(new PrimarySocket());
        this.sockets.push(new TimeSocket());
    }

    /**
     * Initializes all of the sockets and begins the primary check
     */
    public initializeSockets(){
        //Set up the socket we use to forward data between players and the GM
        GameSockets.on(this.processSocket.bind(this));
        //Initialize all our sockets
        for(let i = 0; i < this.sockets.length; i++){
            this.sockets[i].initialize();
        }
        GameSockets.emit({type: SocketTypes.checkClockRunning, data: {}}).catch(Logger.error);
    }

    /**
     * Process any data received over our socket
     * @param {SimpleCalendarSocket.Data} data The data received
     */
    async processSocket(data: SimpleCalendarSocket.Data){
        Logger.debug(`Processing ${data.type} socket emit`);
        for(let i = 0; i < this.sockets.length; i++){
            // If this socket processed the data, then no need to check the other sockets.
            if(await this.sockets[i].process(data)){
                break;
            }
        }
    }
}