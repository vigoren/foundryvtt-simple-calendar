import ConfigurationItemBase from "../configuration/configuration-item-base";
import { FormatDateTime } from "../utilities/date-time";
import { CalManager } from "../index";

/**
 * Class representing the time of day
 */
export default class Time extends ConfigurationItemBase {
    /**
     * How many hours are in a day
     * @type {number}
     */
    hoursInDay: number;
    /**
     * How many minutes are in an hour
     * @type {number}
     */
    minutesInHour: number;
    /**
     * How many seconds are in a minute
     * @type {number}
     */
    secondsInMinute: number;
    /**
     * The ratio at which to advance game time while real time passes, ratio of 1 is the same, ratio of 2 is twice as fast
     * @type {number}
     */
    gameTimeRatio: number;
    /**
     * The number of seconds that have passed for the current day
     * @type {number}
     */
    seconds: number = 0;
    /**
     * The number of seconds in a day
     * @type {number}
     */
    secondsPerDay: number;
    /**
     * If a combat is currently running or not
     */
    combatRunning: boolean = false;
    /**
     * If to keep the game start/pause unified with the clock start/pause
     */
    unifyGameAndClockPause: boolean = false;
    /**
     * How often the clock updates the time in seconds.
     */
    updateFrequency: number = 1;

    /**
     * A new Time constructor
     * @param {number} [hoursInDay=24] How many hours in a day
     * @param {number} [minutesInHour=60] How many minutes in an hour
     * @param {number} [secondsInMinute=60] How many seconds in a minute
     */
    constructor(hoursInDay: number = 24, minutesInHour: number = 60, secondsInMinute: number = 60) {
        super();
        this.hoursInDay = hoursInDay;
        this.minutesInHour = minutesInHour;
        this.secondsInMinute = secondsInMinute;
        this.gameTimeRatio = 1;

        this.secondsPerDay = this.hoursInDay * this.minutesInHour * this.secondsInMinute;
    }

    /**
     * Returns the configuration for time in the calendar
     */
    toConfig(): SimpleCalendar.TimeData {
        return {
            id: this.id,
            hoursInDay: this.hoursInDay,
            minutesInHour: this.minutesInHour,
            secondsInMinute: this.secondsInMinute,
            gameTimeRatio: this.gameTimeRatio,
            unifyGameAndClockPause: this.unifyGameAndClockPause,
            updateFrequency: this.updateFrequency
        };
    }

    /**
     * Makes a clone of this class with all the same settings
     */
    clone() {
        const t = new Time(this.hoursInDay, this.minutesInHour, this.secondsInMinute);
        t.id = this.id;
        t.seconds = this.seconds;
        t.gameTimeRatio = this.gameTimeRatio;
        t.combatRunning = this.combatRunning;
        t.unifyGameAndClockPause = this.unifyGameAndClockPause;
        t.updateFrequency = this.updateFrequency;
        return t;
    }

    /**
     * Sets the properties for this class to options set in the passed in configuration object
     * @param {TimeData} config The configuration object for this class
     */
    loadFromSettings(config: SimpleCalendar.TimeData) {
        if (config && Object.keys(config).length) {
            if (Object.prototype.hasOwnProperty.call(config, "id")) {
                this.id = config.id;
            }
            this.hoursInDay = config.hoursInDay;
            this.minutesInHour = config.minutesInHour;
            this.secondsInMinute = config.secondsInMinute;
            this.gameTimeRatio = config.gameTimeRatio;
            this.secondsPerDay = this.hoursInDay * this.minutesInHour * this.secondsInMinute;

            if (Object.prototype.hasOwnProperty.call(config, "unifyGameAndClockPause")) {
                this.unifyGameAndClockPause = config.unifyGameAndClockPause;
            }

            if (Object.prototype.hasOwnProperty.call(config, "updateFrequency")) {
                this.updateFrequency = config.updateFrequency;
            }
        }
    }

    /**
     * Returns the current time as string parts
     * @return {Time}
     */
    getCurrentTime(): SimpleCalendar.Time {
        let s = this.seconds,
            m = 0,
            h = 0;
        if (s >= this.secondsInMinute) {
            m = Math.floor(s / this.secondsInMinute);
            s = s - m * this.secondsInMinute;
        }
        if (m >= this.minutesInHour) {
            h = Math.floor(m / this.minutesInHour);
            m = m - h * this.minutesInHour;
        }
        s = Math.floor(s);
        return {
            hour: h,
            minute: m,
            seconds: s
        };
    }

    /**
     * Returns the current time as a string
     */
    toString(): string {
        const t = this.getCurrentTime();
        const activeCalendar = CalManager.getActiveCalendar();
        const mdIndex = activeCalendar.getMonthAndDayIndex();
        return FormatDateTime(
            { year: activeCalendar.year.numericRepresentation, month: mdIndex.month || 0, day: mdIndex.day || 0, ...t },
            activeCalendar.generalSettings.dateFormat.time,
            activeCalendar
        );
    }

    /**
     * Sets the current number of seconds based on the passed in hours, minutes and seconds
     * @param {number} [hour=0] The hour of the day
     * @param {number} [minute=0] The minute of the day
     * @param {number} [second=0] The seconds of the day
     */
    setTime(hour: number = 0, minute: number = 0, second: number = 0) {
        this.seconds = hour * this.minutesInHour * this.secondsInMinute + minute * this.secondsInMinute + second;
    }

    /**
     * Changes the current time by the passed in number of hours, minutes and seconds
     * @param {number} [hour=0] The number of hours to change the time by
     * @param {number} [minute=0] The number of minutes to change the time by
     * @param {number} [second=0] The number of seconds to change the time by
     * @return {number} The number of days that have changed as a result of the time change
     */
    changeTime(hour: number = 0, minute: number = 0, second: number = 0): number {
        second = +second.toFixed(3);
        const changeAmount = hour * this.minutesInHour * this.secondsInMinute + minute * this.secondsInMinute + second;
        const newAmount = this.seconds + changeAmount;
        if (newAmount >= this.secondsPerDay) {
            //If the new time is more seconds than there are in a day, change to the next day
            this.seconds = 0;
            const dayChange = this.changeTime(0, 0, newAmount - this.secondsPerDay);
            return dayChange + 1;
        } else if (newAmount < 0) {
            // Going back to a previous day
            this.seconds = this.secondsPerDay;
            const dayChange = this.changeTime(0, 0, newAmount);
            return dayChange + -1;
        }
        this.seconds = newAmount;
        return 0;
    }

    /**
     * Gets the total number of seconds based on the number of days
     * @param {number} totalDays The number of days to turn into seconds
     * @param {number} [includeToday=true] If to include todays time
     */
    getTotalSeconds(totalDays: number, includeToday: boolean = true) {
        return totalDays * this.hoursInDay * this.minutesInHour * this.secondsInMinute + (includeToday ? this.seconds : 0);
    }

    /**
     * Sets the world time to the passed in number of seconds
     * @param {number} seconds The number of seconds to set the world time too
     */
    async setWorldTime(seconds: number) {
        const currentWorldTime = (<Game>game).time.worldTime;
        const diff = seconds - currentWorldTime;
        await (<Game>game).time.advance(diff);
    }
}
