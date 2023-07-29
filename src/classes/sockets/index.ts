import GameSockets from "../foundry-interfacing/game-sockets";
import { Logger } from "../logging";
import ClockSocket from "./clock-socket";
import SocketBase from "./socket-base";
import CheckClockRunningSocket from "./check-clock-running-socket";
import DateTimeChangeSocket from "./date-time-change-socket";
import EmitHookSocket from "./emit-hook-socket";
import NoteUpdateSocket from "./note-update-socket";
import PrimarySocket from "./primary-socket";
import { CalManager } from "../index";
import MainAppUpdateSocket from "./main-app-update";
import SetActiveCalendar from "./set-active-calendar";
import RenderChatLogSocket from "./render-chat-log-socket";

export default class Sockets {
    /**
     * The list of all socket types currently supported.
     * @private
     */
    private sockets: SocketBase[] = [];

    constructor() {
        this.sockets.push(new MainAppUpdateSocket());
        this.sockets.push(new PrimarySocket());
        this.sockets.push(new CheckClockRunningSocket());
        this.sockets.push(new ClockSocket());
        this.sockets.push(new DateTimeChangeSocket());
        this.sockets.push(new EmitHookSocket());
        this.sockets.push(new NoteUpdateSocket());
        this.sockets.push(new SetActiveCalendar());
        this.sockets.push(new RenderChatLogSocket());
    }

    /**
     * Initializes all the socket types
     */
    public initialize() {
        //Set up the socket we use to forward data between players and the GM
        GameSockets.on(this.process.bind(this));
        //Initialize all our sockets

        Promise.all(
            this.sockets.map((s) => {
                return s.initialize();
            })
        ).catch(Logger.error);
    }

    /**
     * Process any data received over our socket
     * @param {SimpleCalendarSocket.Data} data The data received
     */
    async process(data: SimpleCalendar.SimpleCalendarSocket.Data) {
        const activeCalendar = CalManager.getActiveCalendar();
        for (let i = 0; i < this.sockets.length; i++) {
            // If this socket processed the data, then no need to check the other sockets.
            if (await this.sockets[i].process(data, activeCalendar)) {
                break;
            }
        }
    }
}
