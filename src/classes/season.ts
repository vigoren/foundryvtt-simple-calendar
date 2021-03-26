import SimpleCalendar from "./simple-calendar";
import {SeasonTemplate} from "../interfaces";

export default class Season {

    name: string;

    color: string = '#ffffff';

    customColor: string = '';

    startingMonth: number = -1;

    startingDay: number = -1;

    constructor(name: string, startingMonth: number, startingDay: number) {
        this.name = name;
        this.startingMonth = startingMonth;
        this.startingDay = startingDay;
    }

    clone(){
        const t = new Season(this.name, this.startingMonth, this.startingDay);
        t.color = this.color;
        t.customColor = this.customColor;
        return t;
    }

    toTemplate(){
        const data: SeasonTemplate =  {
            name: this.name,
            startingMonth: this.startingMonth,
            startingDay: this.startingDay,
            color: this.color,
            customColor: this.customColor,
            dayList: []
        };

        if(SimpleCalendar.instance.currentYear){
            const month = SimpleCalendar.instance.currentYear.months.find(m => m.numericRepresentation === data.startingMonth);
            if(month){
                data.dayList = month.days.map(d => d.toTemplate());
            }
        }
        return data;
    }
}
