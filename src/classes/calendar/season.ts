import {SCDateSelector, SeasonConfiguration, SeasonTemplate} from "../../interfaces";
import Year from "./year";
import DateSelector from "../date-selector";
import SimpleCalendar from "../applications/simple-calendar";
import ConfigurationItemBase from "../configuration/configuration-item-base";

/**
 * All content around a season
 */
export default class Season extends ConfigurationItemBase{

    /**
     * The color of the season
     * @type{string}
     */
    color: string = '#ffffff';
    /**
     * The month this season starts on
     * @type{number}
     */
    startingMonth: number = -1;
    /**
     * The day of the starting month this season starts on
     * @type{number}
     */
    startingDay: number = -1;
    /**
     * The time, in seconds, that the sun rises
     * @type{number}
     */
    sunriseTime: number = 0;
    /**
     * The time, in seconds, that the sun sets
     * @type{number}
     */
    sunsetTime: number = 0;

    /**
     * The Season Constructor
     * @param {string} name The name of the season
     * @param {number} startingMonth The month this season starts on
     * @param {number} startingDay The day of the starting month this season starts on
     */
    constructor(name: string = '', startingMonth: number = 0, startingDay: number = 0) {
        super(name);
        this.startingMonth = startingMonth;
        this.startingDay = startingDay;
    }

    /**
     * Creates a clone of the current season
     * @return {Season}
     */
    clone(): Season {
        const t = new Season(this.name, this.startingMonth, this.startingDay);
        t.id = this.id;
        t.color = this.color;
        t.sunriseTime = this.sunriseTime;
        t.sunsetTime = this.sunsetTime;
        return t;
    }

    /**
     * The configuration details for the season
     */
    toConfig(): SeasonConfiguration {
        return {
            id: this.id,
            name: this.name,
            startingMonth: this.startingMonth,
            startingDay: this.startingDay,
            color: this.color,
            sunriseTime: this.sunriseTime,
            sunsetTime: this.sunsetTime
        }
    }

    /**
     * Creates a template of the season used to render its information
     * @param {Year} year The year to look in for the months and days list
     */
    toTemplate(year: Year): SeasonTemplate{
        const startDateSelectorId = `sc_season_start_date_${this.id}`;
        const sunriseSelectorId = `sc_season_sunrise_time_${this.id}`;

        let sunriseHour = 0, sunriseMinute = 0, sunsetHour = 0, sunsetMinute = 0;
        if(SimpleCalendar.instance){
            sunriseMinute = Math.floor(this.sunriseTime / SimpleCalendar.instance.activeCalendar.year.time.secondsInMinute);
            sunsetMinute = Math.floor(this.sunsetTime / SimpleCalendar.instance.activeCalendar.year.time.secondsInMinute);
            if(sunriseMinute >= SimpleCalendar.instance.activeCalendar.year.time.minutesInHour){
                sunriseHour = Math.floor(sunriseMinute / SimpleCalendar.instance.activeCalendar.year.time.minutesInHour);
                sunriseMinute = sunriseMinute - (sunriseHour * SimpleCalendar.instance.activeCalendar.year.time.minutesInHour);
            }
            if(sunsetMinute >= SimpleCalendar.instance.activeCalendar.year.time.minutesInHour){
                sunsetHour = Math.floor(sunsetMinute / SimpleCalendar.instance.activeCalendar.year.time.minutesInHour);
                sunsetMinute = sunsetMinute - (sunsetHour * SimpleCalendar.instance.activeCalendar.year.time.minutesInHour);
            }
        }

        const data: SeasonTemplate =  {
            ...super.toTemplate(),
            name: this.name,
            startingMonth: this.startingMonth,
            startingDay: this.startingDay,
            color: this.color,
            startDateSelectorId: startDateSelectorId,
            startDateSelectedDate: {year: 0, month: this.startingMonth, day: this.startingDay, hour: 0, minute: 0, seconds: 0},
            sunriseSelectorId: sunriseSelectorId,
            sunriseSelectorSelectedDates: {
                start: {year: 0, month: 1, day: 1, hour: sunriseHour, minute: sunriseMinute, seconds: 0},
                end: {year: 0, month: 1, day: 1, hour: sunsetHour, minute: sunsetMinute, seconds: 0}
            }
        };
        return data;
    }

    /**
     * Loads the season data from the config object.
     * @param {SeasonConfiguration} config The configuration object for this class
     */
    loadFromSettings(config: SeasonConfiguration) {
        if(config && Object.keys(config).length){
            if(config.hasOwnProperty('id')){
                this.id = config.id;
            }
            this.name = config.name;
            this.startingMonth = config.startingMonth;
            this.startingDay = config.startingDay;
            const sCustColor = config.customColor;
            this.color = config.color === 'custom' && sCustColor? sCustColor : config.color;
            if(config.hasOwnProperty('sunriseTime')){
                this.sunriseTime = config.sunriseTime;
            }
            if(config.hasOwnProperty('sunsetTime')){
                this.sunsetTime = config.sunsetTime;
            }
        }
    }
}
