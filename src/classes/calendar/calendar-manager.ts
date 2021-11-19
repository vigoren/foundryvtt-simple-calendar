import Calendar from "./index";
import {CalendarConfiguration} from "../../interfaces";
import {GameSettings} from "../foundry-interfacing/game-settings";
import {SettingNames} from "../../constants";

export default class CalendarManager {
    /**
     * A list of all calendars
     * @type {Calendar[]}
     */
    private calendars: Record<string, Calendar>= {};

    private activeId: string = '';

    public register(){
        //TODO: Replace with loading from the game settings
        const calendars = <CalendarConfiguration[]>GameSettings.GetObjectSettings(SettingNames.CalendarConfiguration);
        if(calendars.length === 1 && !calendars[0]){
            calendars.shift();
        }
        if(calendars.length){

        } else {
            const cal = this.getDefaultCalendar();
            cal.settingUpdate();
            this.activeId = cal.id;
        }
    }

    public getDefaultCalendar(){
        let dCal = this.getCalendar('default');
        if(!dCal){
            dCal = this.addCalendar({id: 'default', name: 'Default'});
        }
        return dCal;
    }

    public addCalendar(configuration: CalendarConfiguration): Calendar{
        const cal = new Calendar(configuration);
        this.calendars[cal.id] = cal;
        return this.calendars[cal.id];
    }

    public updateCalendars(calendars: Calendar[]){
        for(let i = 0; i < calendars.length; i++){
            this.calendars[calendars[i].id] = calendars[i];
        }
    }

    public getCalendar(id: string): Calendar | null {
        if(this.calendars.hasOwnProperty(id)){
            return this.calendars[id];
        } else {
            return null;
        }
    }

    public getAllCalendars(): Calendar[] {
        const cals: Calendar[] = [];
        for(const [key, value] of Object.entries(this.calendars)){
            cals.push(value);
        }
        return cals;
    }

    public getActiveCalendar(){
        return this.calendars[this.activeId];
    }
}