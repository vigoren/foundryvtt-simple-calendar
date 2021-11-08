import {SCRenderer} from "../../interfaces";
import Calendar from "../calendar";
import Utilities from "../utilities";
import {Icons, TimeKeeperStatus} from "../../constants";

export default class Clock {
    private static defaultOptions: SCRenderer.ClockOptions = {
        id: '',
        cssClasses: ''
    };

    public static Render(calendar: Calendar, options: SCRenderer.ClockOptions = {id: ''}): string {
        options = Utilities.deepMerge({}, this.defaultOptions, options);
        const status = calendar.year.time.timeKeeper.getStatus();
        options.cssClasses += ` ${status}`;

        let html = `<div id="${options.id}" class="sc-clock ${options.cssClasses}">`;
        html += `<div class="animated-clock ${status === TimeKeeperStatus.Started? 'animate': ''}">${Utilities.GetIcon(Icons.Clock)}</div>`;
        html += `<div class="current-time">${calendar.year.time.toString()}</div>`;
        html += `</div>`;
        return html;
    }

    public static ActivateListeners(calendarId: string){

    }

    public static EventListener(calendarId: string, event: Event){

    }
}