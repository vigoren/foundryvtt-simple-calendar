import ConfigurationItemBase from "../configuration/configuration-item-base";
import { CalManager } from "../index";
import { Icons } from "../../constants";

/**
 * All content around a season
 */
export default class Season extends ConfigurationItemBase {
    /**
     * The color of the season
     * @type{string}
     */
    color: string = "#ffffff";
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
     * An Icon to assign to the season
     */
    icon: Icons = Icons.None;

    /**
     * The Season Constructor
     * @param {string} name The name of the season
     * @param {number} startingMonth The month this season starts on
     * @param {number} startingDay The day of the starting month this season starts on
     */
    constructor(name: string = "", startingMonth: number = 0, startingDay: number = 0) {
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
        t.description = this.description;
        t.color = this.color;
        t.icon = this.icon;
        t.sunriseTime = this.sunriseTime;
        t.sunsetTime = this.sunsetTime;
        return t;
    }

    /**
     * The configuration details for the season
     */
    toConfig(): SimpleCalendar.SeasonData {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            startingMonth: this.startingMonth,
            startingDay: this.startingDay,
            color: this.color,
            icon: this.icon,
            sunriseTime: this.sunriseTime,
            sunsetTime: this.sunsetTime
        };
    }

    /**
     * Creates a template of the season used to render its information
     */
    toTemplate(): SimpleCalendar.HandlebarTemplateData.Season {
        const startDateSelectorId = `sc_season_start_date_${this.id}`;
        const sunriseSelectorId = `sc_season_sunrise_time_${this.id}`;

        let sunriseHour = 0,
            sunriseMinute = 0,
            sunsetHour = 0,
            sunsetMinute = 0;
        const activeCalendar = CalManager.getActiveCalendar();
        sunriseMinute = Math.floor(this.sunriseTime / activeCalendar.time.secondsInMinute);
        sunsetMinute = Math.floor(this.sunsetTime / activeCalendar.time.secondsInMinute);
        if (sunriseMinute >= activeCalendar.time.minutesInHour) {
            sunriseHour = Math.floor(sunriseMinute / activeCalendar.time.minutesInHour);
            sunriseMinute = sunriseMinute - sunriseHour * activeCalendar.time.minutesInHour;
        }
        if (sunsetMinute >= activeCalendar.time.minutesInHour) {
            sunsetHour = Math.floor(sunsetMinute / activeCalendar.time.minutesInHour);
            sunsetMinute = sunsetMinute - sunsetHour * activeCalendar.time.minutesInHour;
        }

        return {
            ...super.toTemplate(),
            name: this.name,
            description: this.description,
            startingMonth: this.startingMonth,
            startingDay: this.startingDay,
            color: this.color,
            icon: this.icon,
            startDateSelectorId: startDateSelectorId,
            startDateSelectedDate: {
                year: 0,
                month: this.startingMonth,
                day: this.startingDay,
                hour: 0,
                minute: 0,
                seconds: 0
            },
            sunriseSelectorId: sunriseSelectorId,
            sunriseSelectorSelectedDates: {
                start: { year: 0, month: 0, day: 0, hour: sunriseHour, minute: sunriseMinute, seconds: 0 },
                end: { year: 0, month: 0, day: 0, hour: sunsetHour, minute: sunsetMinute, seconds: 0 }
            }
        };
    }

    /**
     * Loads the season data from the config object.
     * @param {SeasonData} config The configuration object for this class
     */
    loadFromSettings(config: SimpleCalendar.SeasonData) {
        if (config && Object.keys(config).length) {
            super.loadFromSettings(config);
            this.startingMonth = config.startingMonth;
            this.startingDay = config.startingDay;
            const sCustColor = config.customColor;
            this.color = config.color === "custom" && sCustColor ? sCustColor : config.color;
            if (Object.prototype.hasOwnProperty.call(config, "sunriseTime")) {
                this.sunriseTime = config.sunriseTime;
            }
            if (Object.prototype.hasOwnProperty.call(config, "sunsetTime")) {
                this.sunsetTime = config.sunsetTime;
            }
            if (Object.prototype.hasOwnProperty.call(config, "icon")) {
                this.icon = config.icon;
            }
        }
    }
}
