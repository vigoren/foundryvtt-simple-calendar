import {Logger} from "./logging";
import {ModuleSocketName, SimpleCalendarHooks, SocketTypes, TimeKeeperStatus} from "../constants";
import SimpleCalendar from "./simple-calendar";
import Hook from "./hook";
import {GameSettings} from "./game-settings";
import {SimpleCalendarSocket} from "../interfaces";

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

    constructor() {
    }

    /**
     * Starts the time keeper interval and save interval
     */
    public start(){
        if(this.intervalNumber === undefined){
            Logger.debug(`TimeKeeper Starting`);
            this.intervalNumber = window.setInterval(this.interval.bind(this), 1000);
            this.updateStatus();
            if(GameSettings.IsGm() && SimpleCalendar.instance.primary){
                this.saveInterval();
                this.saveIntervalNumber = window.setInterval(this.saveInterval.bind(this), 10000);
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
            this.intervalNumber = undefined;
            this.saveIntervalNumber = undefined;
            this.updateStatus();
            if(GameSettings.IsGm() && SimpleCalendar.instance.primary){
                this.saveInterval();
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
    }

    public setClockTime(time: string){
        if(SimpleCalendar.instance && SimpleCalendar.instance.currentYear){
            SimpleCalendar.instance.element.find('.time-display .time, .current-time .time').text(time);
        }
    }

    /**
     * The interval function that is called every second. Responsible for updating the clock display
     * @private
     */
    private interval(){
        this.updateStatus();
        if(SimpleCalendar.instance && SimpleCalendar.instance.currentYear){
            if(this.status === TimeKeeperStatus.Started){
                const dayChange = SimpleCalendar.instance.currentYear.time.changeTime(0, 0, SimpleCalendar.instance.currentYear.time.gameTimeRatio);
                if(dayChange !== 0){
                    SimpleCalendar.instance.currentYear.changeDay(dayChange);
                    SimpleCalendar.instance.updateApp();
                }
                //SimpleCalendar.instance.element.find('.time-display .time, .current-time .time').text(SimpleCalendar.instance.currentYear.time.toString());
                if (GameSettings.IsGm() && SimpleCalendar.instance.primary) {
                    SimpleCalendar.instance.currentYear.syncTime().catch(Logger.error);
                }
            }
        }
    }

    /**
     * The save interval function that is called every 10 seconds to save the current time
     * @private
     */
    private saveInterval(){
        if(SimpleCalendar.instance && SimpleCalendar.instance.currentYear) {
            if (GameSettings.IsGm() && SimpleCalendar.instance.primary) {
                SimpleCalendar.instance.currentYear.syncTime().catch(Logger.error);
                GameSettings.SaveCurrentDate(SimpleCalendar.instance.currentYear).catch(Logger.error);
            }
        }
    }

    /**
     * Checks the current state of the world and updates the time keepers status accordingly.
     * If the status has changed, emits the socket and hook calls to update all players, modules, systems and macros
     * @private
     */
    private updateStatus(){
        const oldStatus = this.status;
        if(this.intervalNumber !== undefined){
            if(game.paused || (SimpleCalendar.instance && SimpleCalendar.instance.currentYear && SimpleCalendar.instance.currentYear.time.combatRunning)){
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
            game.socket.emit(ModuleSocketName, socketData);
            SimpleCalendar.instance.processSocket(socketData).catch(Logger.error);
        }
    }
}
