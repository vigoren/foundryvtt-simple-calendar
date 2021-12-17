import {Logger} from "../logging";
import {GameWorldTimeIntegrations, SimpleCalendarHooks, SocketTypes, TimeKeeperStatus} from "../../constants";
import Hook from "../api/hook";
import {GameSettings} from "../foundry-interfacing/game-settings";
import {SimpleCalendarSocket} from "../../interfaces";
import GameSockets from "../foundry-interfacing/game-sockets";
import {CalManager, MainApplication, SC} from "../index";

/**
 * The Time Keeper class used by the built in Simple Calendar Clock to keep real time
 */
export default class TimeKeeper{
    /**
     * The ID of the calendar the TimeKeeper is associated with
     * @type {string}
     * @private
     */
    public calendarId: string;
    /**
     * The interval that is run every second to update the clock
     * @type {number | undefined}
     * @private
     */
    private intervalNumber: number | undefined;
    /**
     * The interval that us run every 10 seconds to save the current time and force sync across all players
     * @type {number | undefined}
     * @private
     */
    private saveIntervalNumber: number | undefined;
    /**
     * The current status of the time keeper
     * @type {TimeKeeperStatus}
     * @private
     */
    private status: TimeKeeperStatus = TimeKeeperStatus.Stopped;
    /**
     * If the pause button was clicked or not
     * @type {Boolean}
     * @private
     */
    private pauseClicked: boolean = false;
    /**
     * How often (in seconds) to have the time keeper process an interval
     * @type {number}
     */
    public updateFrequency: number;
    /**
     * A list of functions that listen for intervals or status changes from the time keeper and are then called.
     * @private
     */
    private updateListeners: {key: string, func: Function}[] = [];

    constructor(calendarId: string, updateFrequency: number) {
        this.calendarId = calendarId;
        this.updateFrequency = updateFrequency;
    }

    /**
     * Starts the time keeper interval and save interval
     */
    public start(fromPause: boolean = false){
        this.pauseClicked = false;
        const activeCalendar = CalManager.getCalendar(this.calendarId);
        if(activeCalendar){
            if(this.status !== TimeKeeperStatus.Started ){
                this.pauseClicked = false;
                if(activeCalendar.year.time.unifyGameAndClockPause && !fromPause){
                    (<Game>game).togglePause(false, true);
                }
                if(this.intervalNumber === undefined) {
                    Logger.debug(`TimeKeeper Starting`);
                    this.intervalNumber = window.setInterval(this.interval.bind(this), 1000 * this.updateFrequency);
                    this.updateStatus();
                    if (GameSettings.IsGm() && SC.primary) {
                        this.saveInterval();
                        this.saveIntervalNumber = window.setInterval(this.saveInterval.bind(this), 10000);
                    }
                } else {
                    this.updateStatus();
                }
            } else {
                this.pauseClicked = true;
                this.updateStatus(TimeKeeperStatus.Paused);
                if(activeCalendar.year.time.unifyGameAndClockPause){
                    (<Game>game).togglePause(true, true);
                }
            }
        }
    }

    /**
     * Stops the time keeper interval and save interval
     */
    public stop(){
        this.pauseClicked = false;
        if(this.intervalNumber !== undefined){
            Logger.debug(`TimeKeeper Stopping`);
            window.clearInterval(this.intervalNumber);
            window.clearInterval(this.saveIntervalNumber);
            const activeCalendar = CalManager.getCalendar(this.calendarId);
            if(activeCalendar && activeCalendar.year.time.unifyGameAndClockPause){
                (<Game>game).togglePause(true, true);
            }
            this.intervalNumber = undefined;
            this.saveIntervalNumber = undefined;
            this.updateStatus();
            if(GameSettings.IsGm() && SC.primary){
                this.saveInterval(true);
            }
        }
    }

    public pause(){
        if(this.status === TimeKeeperStatus.Started){
            this.pauseClicked = true;
            this.status = TimeKeeperStatus.Paused;
        }
    }

    /**
     * Returns the current status of the time keeper
     */
    public getStatus(){
        return this.status;
    }

    /**
     * Sets a new status for the time keeper and updates the clock display
     * @param {TimeKeeperStatus} newStatus
     */
    public setStatus(newStatus: TimeKeeperStatus){
        this.updateStatus(newStatus);
    }

    /**
     * The interval function that is called every second. Responsible for updating the clock display
     * @private
     */
    private interval(){
        this.updateStatus();
        if(this.status === TimeKeeperStatus.Started){
            const activeCalendar = CalManager.getCalendar(this.calendarId);
            if(activeCalendar){
                const changeAmount = activeCalendar.year.time.gameTimeRatio * this.updateFrequency;
                const dayChange = activeCalendar.year.time.changeTime(0, 0, changeAmount);
                if(dayChange !== 0){
                    activeCalendar.year.changeDay(dayChange);
                    MainApplication.updateApp();
                }
                if (GameSettings.IsGm() && SC.primary) {
                    if(activeCalendar.generalSettings.gameWorldTimeIntegration === GameWorldTimeIntegrations.None){
                        //Main.instance.updateApp();
                        GameSockets.emit(<SimpleCalendarSocket.Data>{ type: SocketTypes.clock, data: { timeKeeperStatus: this.status } }).catch(Logger.error);
                    } else {
                        activeCalendar.syncTime().catch(Logger.error);
                    }
                }
                Hook.emit(SimpleCalendarHooks.DateTimeChange, activeCalendar, changeAmount);
                this.callListeners();
            }
        }
    }

    /**
     * The save interval function that is called every 10 seconds to save the current time
     * @param {boolean} [emitHook=false]
     * @private
     */
    private saveInterval(emitHook: boolean = false){
        if(this.status === TimeKeeperStatus.Started){
            const activeCalendar = CalManager.getCalendar(this.calendarId);
            if (activeCalendar && GameSettings.IsGm() && SC.primary) {
                if(activeCalendar.generalSettings.gameWorldTimeIntegration === GameWorldTimeIntegrations.None){
                    GameSockets.emit(<SimpleCalendarSocket.Data>{ type: SocketTypes.clock, data: { timeKeeperStatus: this.status } }).catch(Logger.error);
                } else {
                    activeCalendar.syncTime().catch(Logger.error);
                }
                CalManager.saveCalendars();
            }
        }
    }

    /**
     * Checks the current state of the world and updates the time keepers status accordingly.
     * If the status has changed, emits the socket and hook calls to update all players, modules, systems and macros
     * @private
     */
    private updateStatus(newStatus: TimeKeeperStatus | null = null){
        const activeCalendar = CalManager.getCalendar(this.calendarId);
        if(activeCalendar){
            const oldStatus = this.status;
            if(newStatus !== null){
                this.status = newStatus;
            } else if(this.intervalNumber !== undefined){
                if(this.pauseClicked || (<Game>game).paused || activeCalendar.year.time.combatRunning){
                    this.status = TimeKeeperStatus.Paused;
                } else {
                    this.status = TimeKeeperStatus.Started;
                }
            } else {
                this.status = TimeKeeperStatus.Stopped;
            }
            //If the status has changed, emit that change
            if(oldStatus !== this.status){
                Logger.debug(`Updating Timer Status from ${oldStatus} to ${this.status}`);
                Hook.emit(SimpleCalendarHooks.ClockStartStop, activeCalendar);
                this.callListeners();
                this.emitSocket();
            }
        }
    }

    /**
     * Creates the socket data package and emits on the socket to all connected players.
     * @private
     */
    private emitSocket(){
        if(GameSettings.IsGm() && SC.primary){
            const socketData = <SimpleCalendarSocket.Data>{
                type: SocketTypes.clock,
                data: {
                    timeKeeperStatus: this.status
                }
            };
            GameSockets.emit(socketData).catch(Logger.error);
        }
    }

    /**
     * Registers a function to listen for updates from the timekeeper
     * @param key
     * @param func
     */
    public registerUpdateListener(key: string, func: Function){
        const existing = this.updateListeners.findIndex(l => l.key === key);
        if(existing === -1){
            this.updateListeners.push({key: key, func: func});
        } else {
            this.updateListeners[existing].func = func;
        }
    }

    /**
     * Calls all registered update listeners
     * @private
     */
    private callListeners(){
        for(let i = 0; i < this.updateListeners.length; i++){
            this.updateListeners[i].func(this.status);
        }
    }
}
