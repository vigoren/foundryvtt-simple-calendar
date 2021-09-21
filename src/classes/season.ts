import {SCDateSelector, SeasonConfiguration, SeasonTemplate} from "../interfaces";
import Year from "./year";
import DateSelector from "./date-selector";
import Utilities from "./utilities";
import SimpleCalendar from "./simple-calendar";
import ConfigurationItemBase from "./configuration-item-base";

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
     * Creates a template of the season used to render its information
     * @param {Year} year The year to look in for the months and days list
     */
    toTemplate(year: Year): SeasonTemplate{
        const startDateSelectorId = `sc_season_start_date_${this.id}`;
        const sunriseSelectorId = `sc_season_sunrise_time_${this.id}`;
        const data: SeasonTemplate =  {
            ...super.toTemplate(),
            name: this.name,
            startingMonth: this.startingMonth,
            startingDay: this.startingDay,
            color: this.color,
            startDateSelectorId: startDateSelectorId,
            sunriseSelectorId: sunriseSelectorId
        };

        DateSelector.GetSelector(startDateSelectorId, {
            showDate: true,
            showYear: false,
            showTime: false,
            dateRangeSelect: false,
            inputMatchCalendarWidth: false,
            startDate:{year: 0, month: this.startingMonth, day: this.startingDay, hour: 0, minute: 0, seconds: 0},
            allDay: true,
            onDateSelect: this.startDateChange.bind(this)
        });

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
        DateSelector.GetSelector(sunriseSelectorId, {
            showDate: false,
            showTime: true,
            dateRangeSelect: false,
            timeRangeSelect: true,
            showTimeLabel: false,
            timeDelimiter: '/',
            inputMatchCalendarWidth: false,
            startDate:{year: 0, month: 1, day: 1, hour: sunriseHour, minute: sunriseMinute, seconds: 0},
            endDate:{year: 0, month: 1, day: 1, hour: sunsetHour, minute: sunsetMinute, seconds: 0},
            allDay: false,
            onDateSelect: this.sunriseSunsetChange.bind(this)
        });
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

    /**
     * Handles the start date selector changes
     * @param {SCDateSelector.SelectedDate} selectedDate The date that was selected from the date selector
     */
    startDateChange(selectedDate: SCDateSelector.SelectedDate){
        this.startingMonth = selectedDate.startDate.month;
        this.startingDay = selectedDate.startDate.day;
    }

    /**
     * Handles the Sunrise and Sunset date selector changes
     * @param {SCDateSelector.SelectedDate} selectedDate The date/time that was selected from the date selector
     */
    sunriseSunsetChange(selectedDate: SCDateSelector.SelectedDate){
        if(SimpleCalendar.instance){
            this.sunriseTime = (selectedDate.startDate.hour * SimpleCalendar.instance.activeCalendar.year.time.minutesInHour * SimpleCalendar.instance.activeCalendar.year.time.secondsInMinute) + (selectedDate.startDate.minute * SimpleCalendar.instance.activeCalendar.year.time.secondsInMinute);
            this.sunsetTime = (selectedDate.endDate.hour * SimpleCalendar.instance.activeCalendar.year.time.minutesInHour * SimpleCalendar.instance.activeCalendar.year.time.secondsInMinute) + (selectedDate.endDate.minute * SimpleCalendar.instance.activeCalendar.year.time.secondsInMinute);
        }
    }

    /**
     * Activates the listeners for the date selectors used by the season.
     */
    activateDateSelectors(){
        DateSelector.GetSelector(`sc_season_start_date_${this.id}`, {showDate: true, showTime: false}).activateListeners();
        DateSelector.GetSelector( `sc_season_sunrise_time_${this.id}`, {showDate: false, showTime: true}).activateListeners();
    }
}
