import {Logger} from "./logging";
import {SimpleCalendarHooks, SocketTypes, TimeKeeperStatus} from "../constants";
import SimpleCalendar from "./simple-calendar";
import Hook from "./hook";
import {GameSettings} from "./game-settings";
import {SimpleCalendarSocket} from "../interfaces";
import GameSockets from "./game-sockets";

/**
 * The Time Keeper class used by the built in Simple Calendar Clock to keep real time
 */
export default class TimeKeeper{
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

    public updateFrequency: number;

    constructor(updateFrequency: number) {
        this.updateFrequency = updateFrequency;
    }

    /**
     * Starts the time keeper interval and save interval
     */
    public start(fromPause: boolean = false){
        if(this.status !== TimeKeeperStatus.Started ){
            this.pauseClicked = false;
            if(SimpleCalendar.instance.activeCalendar.year.time.unifyGameAndClockPause && !fromPause){
                (<Game>game).togglePause(false, true);
            }
            if(this.intervalNumber === undefined) {
                Logger.debug(`TimeKeeper Starting`);
                this.intervalNumber = window.setInterval(this.interval.bind(this), 1000 * this.updateFrequency);
                this.updateStatus();
                if (GameSettings.IsGm() && SimpleCalendar.instance.primary) {
                    this.saveInterval();
                    this.saveIntervalNumber = window.setInterval(this.saveInterval.bind(this), 10000);
                }
            } else {
                this.updateStatus();
            }
        } else {
            this.pauseClicked = true;
            this.updateStatus(TimeKeeperStatus.Paused);
            if(SimpleCalendar.instance.activeCalendar.year.time.unifyGameAndClockPause){
                (<Game>game).togglePause(true, true);
            }
        }
    }

    /**
     * Stops the time keeper interval and save interval
     */
    public stop(){
        if(this.intervalNumber !== undefined){
            Logger.debug(`TimeKeeper Stopping`);
            window.clearInterval(this.intervalNumber);
            window.clearInterval(this.saveIntervalNumber);
            if(SimpleCalendar.instance.activeCalendar.year.time.unifyGameAndClockPause){
                (<Game>game).togglePause(true, true);
            }
            this.intervalNumber = undefined;
            this.saveIntervalNumber = undefined;
            this.updateStatus();
            if(GameSettings.IsGm() && SimpleCalendar.instance.primary){
                this.saveInterval(true);
            }
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
        this.status = newStatus;
        SimpleCalendar.instance.element.find('.time-display .clock, .time-controls .time-start, .time-controls .time-stop, .current-time .clock').removeClass('stopped started paused').addClass(this.status);
        if(this.status === TimeKeeperStatus.Started){
            SimpleCalendar.instance.element.find('.time-controls .time-start').removeClass('fa-play').addClass('fa-pause');
        } else {
            SimpleCalendar.instance.element.find('.time-controls .time-start').removeClass('fa-pause').addClass('fa-play');
        }
    }

    public setClockTime(time: string){
        SimpleCalendar.instance.element.find('.time-display .time, .current-time .time').text(time);
    }

    /**
     * The interval function that is called every second. Responsible for updating the clock display
     * @private
     */
    private interval(){
        this.updateStatus();
        if(this.status === TimeKeeperStatus.Started){
            const dayChange = SimpleCalendar.instance.activeCalendar.year.time.changeTime(0, 0, SimpleCalendar.instance.activeCalendar.year.time.gameTimeRatio * this.updateFrequency);
            if(dayChange !== 0){
                SimpleCalendar.instance.activeCalendar.year.changeDay(dayChange);
                SimpleCalendar.instance.updateApp();
            }
            if (GameSettings.IsGm() && SimpleCalendar.instance.primary) {
                SimpleCalendar.instance.activeCalendar.year.syncTime().catch(Logger.error);
            }
            Hook.emit(SimpleCalendarHooks.DateTimeChange);
        }
    }

    /**
     * The save interval function that is called every 10 seconds to save the current time
     * @param {boolean} [emitHook=false]
     * @private
     */
    private saveInterval(emitHook: boolean = false){
        if (GameSettings.IsGm() && SimpleCalendar.instance.primary) {
            SimpleCalendar.instance.activeCalendar.year.syncTime().catch(Logger.error);
            GameSettings.SaveCurrentDate(SimpleCalendar.instance.activeCalendar.year, emitHook).catch(Logger.error);
        }
    }

    /**
     * Checks the current state of the world and updates the time keepers status accordingly.
     * If the status has changed, emits the socket and hook calls to update all players, modules, systems and macros
     * @private
     */
    private updateStatus(newStatus: TimeKeeperStatus | null = null){
        const oldStatus = this.status;
        if(newStatus !== null){
            this.status = newStatus;
        } else if(this.intervalNumber !== undefined){
            if(this.pauseClicked || (<Game>game).paused || SimpleCalendar.instance.activeCalendar.year.time.combatRunning){
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
            Hook.emit(SimpleCalendarHooks.ClockStartStop);
            this.emitSocket();
        }
    }

    /**
     * Creates the socket data package and emits on the socket to all connected players.
     * @private
     */
    private emitSocket(){
        if(GameSettings.IsGm() && SimpleCalendar.instance.primary){
            const socketData = <SimpleCalendarSocket.Data>{
                type: SocketTypes.time,
                data: {
                    timeKeeperStatus: this.status
                }
            };
            GameSockets.emit(socketData).catch(Logger.error);
            SimpleCalendar.instance.processSocket(socketData).catch(Logger.error);
        }
    }
}
