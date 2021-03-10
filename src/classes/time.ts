import {Logger} from "./logging";
import {TimeKeeper} from "../constants";
import {TimeTemplate} from "../interfaces";

export default class Time {
    enabled: TimeKeeper;
    hoursInDay: number;
    minutesInHour: number;
    secondsInMinute: number;
    secondsPerRound: number;
    automaticTime: boolean;
    gameTimeRatio: number;

    seconds: number = 0;
    secondsPerDay: number;

    constructor(enabled: TimeKeeper = TimeKeeper.None, hoursInDay: number = 24, minutesInHour: number = 60, secondsInMinute: number = 60) {
        this.enabled = enabled;
        this.hoursInDay = hoursInDay;
        this.minutesInHour = minutesInHour;
        this.secondsInMinute = secondsInMinute;
        this.secondsPerRound = 6;
        this.automaticTime = false;
        this.gameTimeRatio = 1;

        this.secondsPerDay = this.hoursInDay * this.minutesInHour * this.secondsInMinute;
    }

    /**
     * Makes a clone of this class with all the same settings
     */
    clone() {
        const t = new Time(this.enabled, this.hoursInDay, this.minutesInHour, this.secondsInMinute);
        t.seconds = this.seconds;
        t.secondsPerRound = this.secondsPerRound ;
        t.automaticTime = this.automaticTime;
        t.gameTimeRatio = this.gameTimeRatio;
        return t;
    }

    getCurrentTime(): TimeTemplate{
        let s = this.seconds, m = 0, h = 0;
        if(s >= this.secondsInMinute){
            m = Math.floor(s / this.secondsInMinute);
            s = s - (m * this.secondsInMinute);
        }
        if(m >= this.minutesInHour){
            h = Math.floor(m / this.minutesInHour);
            m = m - (h * this.minutesInHour);
        }
        return {
            hour: h < 10? `0${h}` : h.toString(),
            minute: m < 10? `0${m}` : m.toString(),
            second: s < 10? `0${s}` : s.toString()
        };
    }

    changeTime(hour: number = 0, minute: number = 0, second: number = 0): number{
        const changeAmount  = (hour * this.minutesInHour * this.secondsInMinute) + (minute * this.secondsInMinute) + second;
        const newAmount = this.seconds + changeAmount;
        Logger.debug(`Checking if ${newAmount} seconds is valid`);
        if(newAmount >= this.secondsPerDay) {
            //If the new time is more seconds than there are in a day, change to the next day
            Logger.debug(`More time than in a day, changing time again with new seconds ${newAmount - this.secondsPerDay}`);
            this.seconds = 0;
            const dayChange = this.changeTime(0,0, newAmount - this.secondsPerDay);
            return dayChange + 1;
        } else if( newAmount < 0){
            // Going back to a previous day
            this.seconds = this.secondsPerDay;
            const dayChange = this.changeTime(0,0, newAmount);
            return dayChange + -1;
        }
        Logger.debug(`Updating seconds to ${newAmount}`);
        this.seconds = newAmount;
        return 0;
    }

    getTotalSeconds(totalDays: number, includeToday: boolean = true){
        return (totalDays * this.hoursInDay * this.minutesInHour * this.secondsInMinute) + (includeToday? this.seconds : 0);
    }


    async setWorldTime(seconds: number){
        //We only want to set the world time if simple calendar is the time keeper
        if(this.enabled === TimeKeeper.Self){
            const currentWorldTime = game.time.worldTime;
            const diff = seconds - currentWorldTime;
            const newTime = await game.time.advance(diff);
            Logger.debug(`Set New Time: ${newTime}`);
        } else {
            Logger.warn(`Time Keeping is disabled, not changing the world time.`);
        }
    }

}
