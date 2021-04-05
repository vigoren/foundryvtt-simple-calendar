import SimpleCalendar from "./simple-calendar";
import {SeasonTemplate} from "../interfaces";
import Year from "./year";

/**
 * All content around a season
 */
export default class Season {
    /**
     * The name of the season
     * @type{string}
     */
    name: string;
    /**
     * The color of the season
     * @type{string}
     */
    color: string = '#ffffff';
    /**
     * The custom color of the season
     * @type{string}
     */
    customColor: string = '';
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
     * The Season Constructor
     * @param {string} name The name of the season
     * @param {number} startingMonth The month this season starts on
     * @param {number} startingDay The day of the starting month this season starts on
     */
    constructor(name: string, startingMonth: number, startingDay: number) {
        this.name = name;
        this.startingMonth = startingMonth;
        this.startingDay = startingDay;
    }

    /**
     * Creates a clone of the current season
     * @return {Season}
     */
    clone(): Season {
        const t = new Season(this.name, this.startingMonth, this.startingDay);
        t.color = this.color;
        t.customColor = this.customColor;
        return t;
    }

    /**
     * Creates a template of the season used to render its information
     * @param {Year} year The year to look in for the months and days list
     */
    toTemplate(year: Year){
        const data: SeasonTemplate =  {
            name: this.name,
            startingMonth: this.startingMonth,
            startingDay: this.startingDay,
            color: this.color,
            customColor: this.customColor,
            dayList: []
        };

        const month = year.months.find(m => m.numericRepresentation === data.startingMonth);
        if(month){
            data.dayList = month.days.map(d => d.toTemplate());
        }
        return data;
    }
}
