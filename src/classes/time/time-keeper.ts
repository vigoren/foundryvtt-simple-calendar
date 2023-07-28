import { Logger } from "../logging";
import { GameWorldTimeIntegrations, SimpleCalendarHooks, SocketTypes, TimeKeeperStatus } from "../../constants";
import { Hook } from "../api/hook";
import { GameSettings } from "../foundry-interfacing/game-settings";
import GameSockets from "../foundry-interfacing/game-sockets";
import { CalManager, SC } from "../index";

/**
 * The timekeeper class used by the built-in Simple Calendar Clock to keep real time
 */
export default class TimeKeeper {
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
     * The current status of the timekeeper
     * @type {TimeKeeperStatus}
     * @private
     */
    private status: TimeKeeperStatus = TimeKeeperStatus.Stopped;
    /**
     * If the pause button was clicked or not
     * @private
     */
    private pauseClicked: boolean = false;
    /**
     * How often (in seconds) to have the timekeeper process an interval
     */
    private uf: number;
    /**
     * A list of functions that listen for intervals or status changes from the timekeeper and are then called.
     * @private
     */
    private updateListeners: { key: string; func: (status: TimeKeeperStatus) => void }[] = [];

    constructor(calendarId: string, updateFrequency: number) {
        this.calendarId = calendarId;
        this.uf = updateFrequency;
    }

    /**
     * Getter for the updateFrequency
     */
    get updateFrequency(): number {
        return this.uf;
    }

    /**
     * Setter for the updateFrequency.
     * If the clock is running when this setting is updated, stop and restart the clock at the new frequency.
     * @param freq The new frequency to update the clock too.
     */
    set updateFrequency(freq: number) {
        this.uf = freq;
        if (this.intervalNumber !== undefined) {
            window.clearInterval(this.intervalNumber);
            this.intervalNumber = window.setInterval(this.interval.bind(this), 1000 * this.updateFrequency);
        }
    }
    /**
     * Starts the timekeeper interval and save interval
     */
    public start(fromPause: boolean = false) {
        this.pauseClicked = false;
        const activeCalendar = CalManager.getCalendar(this.calendarId);
        if (activeCalendar) {
            if (this.status !== TimeKeeperStatus.Started) {
                this.pauseClicked = false;
                if (activeCalendar.time.unifyGameAndClockPause && !fromPause) {
                    (<Game>game).togglePause(false, true);
                }
                if (this.intervalNumber === undefined) {
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
                if (activeCalendar.time.unifyGameAndClockPause) {
                    (<Game>game).togglePause(true, true);
                }
            }
        }
    }

    /**
     * Stops the timekeeper interval and save interval
     */
    public stop() {
        this.pauseClicked = false;
        if (this.intervalNumber !== undefined) {
            window.clearInterval(this.intervalNumber);
            window.clearInterval(this.saveIntervalNumber);
            const activeCalendar = CalManager.getCalendar(this.calendarId);
            if (activeCalendar && activeCalendar.time.unifyGameAndClockPause) {
                (<Game>game).togglePause(true, true);
            }
            if (GameSettings.IsGm() && SC.primary) {
                this.saveInterval();
            }
            this.intervalNumber = undefined;
            this.saveIntervalNumber = undefined;
            this.updateStatus();
        }
    }

    public pause() {
        if (this.status === TimeKeeperStatus.Started) {
            this.pauseClicked = true;
            this.status = TimeKeeperStatus.Paused;
        }
    }

    /**
     * Returns the current status of the timekeeper
     */
    public getStatus() {
        return this.status;
    }

    /**
     * Sets a new status for the timekeeper and updates the clock display
     * @param {TimeKeeperStatus} newStatus
     */
    public setStatus(newStatus: TimeKeeperStatus) {
        this.updateStatus(newStatus);
    }

    /**
     * The interval function that is called every second. Responsible for updating the clock display
     * @private
     */
    private interval() {
        this.updateStatus();
        if (this.status === TimeKeeperStatus.Started) {
            const activeCalendar = CalManager.getCalendar(this.calendarId);
            if (activeCalendar) {
                const changeAmount = activeCalendar.time.gameTimeRatio * this.updateFrequency;
                activeCalendar.changeDateTime({ seconds: changeAmount }, { updateApp: false, save: false });
                if (GameSettings.IsGm() && SC.primary && activeCalendar.generalSettings.gameWorldTimeIntegration === GameWorldTimeIntegrations.None) {
                    GameSockets.emit(<SimpleCalendar.SimpleCalendarSocket.Data>{ type: SocketTypes.clock, data: this.status }).catch(Logger.error);
                }
                this.callListeners();
            }
        }
    }

    /**
     * The save interval function that is called every 10 seconds to save the current time
     * @private
     */
    private saveInterval() {
        if (this.status === TimeKeeperStatus.Started) {
            const activeCalendar = CalManager.getCalendar(this.calendarId);
            if (activeCalendar && GameSettings.IsGm() && SC.primary) {
                if (activeCalendar.generalSettings.gameWorldTimeIntegration === GameWorldTimeIntegrations.None) {
                    GameSockets.emit(<SimpleCalendar.SimpleCalendarSocket.Data>{ type: SocketTypes.clock, data: this.status }).catch(Logger.error);
                } else {
                    activeCalendar.syncTime().catch(Logger.error);
                }
                CalManager.saveCalendars().catch(Logger.error);
            }
        }
    }

    /**
     * Checks the current state of the world and updates the timekeepers status accordingly.
     * If the status has changed, emits the socket and hook calls to update all players, modules, systems and macros
     * @private
     */
    private updateStatus(newStatus: TimeKeeperStatus | null = null) {
        const activeCalendar = CalManager.getCalendar(this.calendarId);
        if (activeCalendar) {
            const oldStatus = this.status;
            if (newStatus !== null) {
                this.status = newStatus;
            } else if (this.intervalNumber !== undefined) {
                if (this.pauseClicked || (<Game>game).paused || activeCalendar.time.combatRunning) {
                    this.status = TimeKeeperStatus.Paused;
                } else {
                    this.status = TimeKeeperStatus.Started;
                }
            } else {
                this.status = TimeKeeperStatus.Stopped;
            }
            //If the status has changed, emit that change
            if (oldStatus !== this.status) {
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
    private emitSocket() {
        if (GameSettings.IsGm() && SC.primary) {
            const socketData = <SimpleCalendar.SimpleCalendarSocket.Data>{
                type: SocketTypes.clock,
                data: this.status
            };
            GameSockets.emit(socketData).catch(Logger.error);
        }
    }

    /**
     * Registers a function to listen for updates from the timekeeper
     * @param key
     * @param func
     */
    public registerUpdateListener(key: string, func: (status: TimeKeeperStatus) => void) {
        const existing = this.updateListeners.findIndex((l) => {
            return l.key === key;
        });
        if (existing === -1) {
            this.updateListeners.push({ key: key, func: func });
        } else {
            this.updateListeners[existing].func = func;
        }
    }

    /**
     * Calls all registered update listeners
     * @private
     */
    private callListeners() {
        for (let i = 0; i < this.updateListeners.length; i++) {
            this.updateListeners[i].func(this.status);
        }
    }
}
