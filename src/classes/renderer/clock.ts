import {SCRenderer} from "../../interfaces";
import Calendar from "../calendar";
import {deepMerge} from "../utilities/object";
import {GetIcon} from "../utilities/visual";
import {Icons, TimeKeeperStatus} from "../../constants";
import {CalManager} from "../index";

export default class Clock {
    private static defaultOptions: SCRenderer.ClockOptions = {
        id: '',
        cssClasses: ''
    };

    /**
     * Renders the full clock interface with icon and time
     * @param calendar
     * @param options
     */
    public static Render(calendar: Calendar, options: SCRenderer.ClockOptions = {id: ''}): string {
        options = deepMerge({}, this.defaultOptions, options);
        const status = calendar.timeKeeper.getStatus();
        options.cssClasses += ` ${status}`;

        let html = `<div id="${options.id}" class="sc-clock ${options.cssClasses} ${status === TimeKeeperStatus.Started? 'animate': ''}" data-calendar="${calendar.id}">`;
        //Hidden Options
        html += `<input class="render-options" type="hidden" value="${encodeURIComponent(JSON.stringify(options))}"/>`;
        html += `<div class="animated-clock">${GetIcon(Icons.Clock)}</div>`;
        html += this.RenderTime(calendar, options);
        html += `</div>`;
        return html;
    }

    /**
     * Generates the HTML for the current time of the clock
     * @param calendar
     * @param options
     */
    public static RenderTime(calendar: Calendar, options: SCRenderer.ClockOptions){
        return`<div class="current-time">${calendar.year.time.toString()}</div>`;
    }

    /**
     * Registers the update function with the calendars timekeeper so that the clock can be updated while the timekeeper is running.
     * @param clockId
     */
    public static ActivateListeners(clockId: string){
        const clockElement = document.getElementById(clockId);
        if(clockElement){
            const calendarIndex = clockElement.getAttribute('data-calendar') || '';
            const calendar = CalManager.getCalendar(calendarIndex);
            if(calendar){
                calendar.timeKeeper.registerUpdateListener(clockId, Clock.UpdateListener.bind(Clock, clockId))
            }
        }
    }

    /**
     * This function is called when the timekeeper has processed an interval or status change.
     * This function will update the display text for the clock as well as the clock icon
     * @param clockId
     * @param status
     */
    public static UpdateListener(clockId: string, status: TimeKeeperStatus){
        const clockElement = document.getElementById(clockId);
        if(clockElement){
            const calendarIndex = clockElement.getAttribute('data-calendar') || '';
            const calendar = CalManager.getCalendar(calendarIndex);
            if(calendar){
                let options: SCRenderer.ClockOptions = {id:''};
                const optionsInput = clockElement.querySelector('.render-options');
                if(optionsInput){
                    options = JSON.parse(decodeURIComponent((<HTMLInputElement>optionsInput).value));
                }
                const newHTML = Clock.RenderTime(calendar, options);
                const temp = document.createElement('div');
                temp.innerHTML = newHTML;
                if(temp.firstChild) {
                    const timeElement = clockElement.querySelector('.current-time');
                    if(timeElement){
                        timeElement.replaceWith(temp.firstChild);
                        if(!clockElement.classList.contains(status)){
                            clockElement.classList.remove(TimeKeeperStatus.Started, TimeKeeperStatus.Stopped, TimeKeeperStatus.Paused, 'animate');
                            clockElement.classList.add(status);
                            if(status === TimeKeeperStatus.Started){
                                clockElement.classList.add('animate');
                            }
                        }
                    }
                }
            }
        }
    }
}