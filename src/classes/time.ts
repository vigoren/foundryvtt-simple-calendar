import {Logger} from "./logging";
import {SimpleCalendarSocket, TimeTemplate} from "../interfaces";
import Timeout = NodeJS.Timeout;
import SimpleCalendar from "./simple-calendar";
import {ModuleSocketName, SocketTypes} from "../constants";
import {GameSettings} from "./game-settings";

export default class Time {
    hoursInDay: number;
    minutesInHour: number;
    secondsInMinute: number;
    gameTimeRatio: number;

    seconds: number = 0;
    secondsPerDay: number;

    keeper: Timeout | undefined;
    combatRunning: boolean = false;

    constructor(hoursInDay: number = 24, minutesInHour: number = 60, secondsInMinute: number = 60) {
        this.hoursInDay = hoursInDay;
        this.minutesInHour = minutesInHour;
        this.secondsInMinute = secondsInMinute;
        this.gameTimeRatio = 1;

        this.secondsPerDay = this.hoursInDay * this.minutesInHour * this.secondsInMinute;
    }

    /**
     * Makes a clone of this class with all the same settings
     */
    clone() {
        const t = new Time(this.hoursInDay, this.minutesInHour, this.secondsInMinute);
        t.seconds = this.seconds;
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

    setTime(hour: number = 0, minute: number = 0, second: number = 0){
        this.seconds = (hour * this.minutesInHour * this.secondsInMinute) + (minute * this.secondsInMinute) + second;
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

    getClockClass(){
        if(this.keeper !== undefined){
            if(!game.paused && !this.combatRunning){
                return 'go';
            } else {
                return 'paused';
            }
        }
        return 'stopped';
    }

    async setWorldTime(seconds: number){
        const currentWorldTime = game.time.worldTime;
        let diff = seconds - currentWorldTime;
        const newTime = await game.time.advance(diff);
        Logger.debug(`Set New Game World Time: ${newTime}`);
    }

    startTimeKeeper(){
        if(this.keeper === undefined){
            Logger.debug('Starting the built in Time Keeper');
            this.keeper = setInterval(this.timeKeeper.bind(this), 30000);
            this.timeKeeper();
        }
    }

    stopTimeKeeper(){
        if(this.keeper){
            Logger.debug('Stopping the built in Time Keeper');
            clearInterval(this.keeper);
            this.keeper = undefined;
            this.updateUsers();
        }
    }

    timeKeeper(){
        this.updateUsers();
        if(!game.paused && !this.combatRunning){
            Logger.debug('Updating Time...');
            const modifiedSeconds = 30 * this.gameTimeRatio;
            const dayChange = this.changeTime(0,0,modifiedSeconds);
            if(dayChange !== 0){
                SimpleCalendar.instance.currentYear?.changeDay(dayChange > 0);
            }
            SimpleCalendar.instance.currentYear?.syncTime();

        } else {
            Logger.debug('Game Paused or combat started, not updating time.');
        }
    }

    updateUsers(){
        if(GameSettings.IsGm()){
            const socketData = <SimpleCalendarSocket.Data>{type: SocketTypes.time, data: {clockClass: this.getClockClass()}};
            Logger.debug(`Update Users Clock Class: ${(<SimpleCalendarSocket.SimpleCalendarSocketTime>socketData.data).clockClass}`);
            game.socket.emit(ModuleSocketName, socketData);
            SimpleCalendar.instance.processSocket(socketData);
        }
    }

}
