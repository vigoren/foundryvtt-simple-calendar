import Calendar from "../calendar";
import {PadNumber} from "../utilities/string";
import {deepMerge} from "../utilities/object";
import {TimeSelectorEvents} from "../../constants";
import {CalManager} from "../index";

export default class TimeSelector {

    private static defaultOptions: SimpleCalendar.Renderer.TimeSelectorOptions = {
        id: '',
        allowTimeRange: true,
        disableSelfUpdate: false,
        timeDelimiter: '-'
    };

    public static Render(calendar: Calendar, options: SimpleCalendar.Renderer.TimeSelectorOptions = {id: ''}): string{
        options = deepMerge({}, this.defaultOptions, options);
        let html = `<div id="${options.id}" class="time-selector" data-calendar="${CalManager.getAllCalendars().findIndex(c => c.id === calendar.id)}">`;
        //Hidden Options
        html += `<input class="render-options" type="hidden" value="${encodeURIComponent(JSON.stringify(options))}"/><span class="far fa-clock"></span>`;

        if(options.allowTimeRange){
            html += this.RenderTimeInputGroup(calendar, 'start-time', options.selectedTime?.start);
            html += `<span class="time-spacer">${options.timeDelimiter}</span>`;
            html += this.RenderTimeInputGroup(calendar, 'end-time', options.selectedTime?.end);
        } else{
            html += this.RenderTimeInputGroup(calendar, '', options.selectedTime?.start);
        }

        //Close main div
        html += `</div>`;
        return html;
    }

    private static RenderTimeInputGroup(calendar: Calendar, cssClass: string = '', selectedAmount = {hour: 0, minute: 0}){
        let html = `<div class="sc-ts-inputs ${cssClass}">`;
        //Add Hours
        html += `<input class="sc-ts-hour" type="number" value="${PadNumber(selectedAmount.hour)}" /><ul class="dropdown hide sc-ts-hour-list">`;
        for(let i = 0; i < calendar.year.time.hoursInDay; i++){
            html += `<li>${PadNumber(i)}</li>`;
        }
        html += `</ul>`;

        //Ad Minutes
        html += `<span class="time-spacer">:</span><input class="sc-ts-minute" type="number" value="${PadNumber(selectedAmount.minute)}" /><ul class="dropdown hide sc-ts-minute-list">`;
        for(let i = 0; i < calendar.year.time.minutesInHour; i+=5){
            html += `<li>${PadNumber(i)}</li>`;
        }
        html += `</ul>`;

        html += `</div>`;
        return html;
    }

    public static ActivateListeners(timeSelectorId: string, onTimeChange: Function | null = null){
        const timeSelectorElement = document.getElementById(timeSelectorId);
        if(timeSelectorElement){
            if(timeSelectorElement.parentElement){
                timeSelectorElement.parentElement.addEventListener('click', TimeSelector.HideTimeDropdown.bind(TimeSelector, timeSelectorId))
            }
            //Hour Click
            timeSelectorElement.querySelectorAll('.sc-ts-inputs .sc-ts-hour').forEach(h => {
                h.addEventListener('change', TimeSelector.ChangeEventListener.bind(TimeSelector, timeSelectorId, TimeSelectorEvents.change, onTimeChange));
                h.addEventListener('click', TimeSelector.InputClickEventListener.bind(TimeSelector, timeSelectorId));
                h.addEventListener('wheel', TimeSelector.ChangeEventListener.bind(TimeSelector, timeSelectorId, TimeSelectorEvents.wheel, onTimeChange));
            });

            //minute Click
            timeSelectorElement.querySelectorAll('.sc-ts-inputs .sc-ts-minute').forEach(m => {
                m.addEventListener('change', TimeSelector.ChangeEventListener.bind(TimeSelector, timeSelectorId, TimeSelectorEvents.change, onTimeChange));
                m.addEventListener('click', TimeSelector.InputClickEventListener.bind(TimeSelector, timeSelectorId));
                m.addEventListener('wheel', TimeSelector.ChangeEventListener.bind(TimeSelector, timeSelectorId, TimeSelectorEvents.wheel, onTimeChange));
            });

            //Dropdown Item Click
            timeSelectorElement.querySelectorAll('.sc-ts-inputs .dropdown').forEach(d => {
                d.addEventListener('click', TimeSelector.ChangeEventListener.bind(TimeSelector, timeSelectorId, TimeSelectorEvents.dropdownClick, onTimeChange));
            });
        }
    }

    /**
     * Hides all the time selector dropdowns
     * @param {string} timeSelectorId The ID of the time selector whose dropdowns to hide.
     */
    public static HideTimeDropdown(timeSelectorId: string){
        const timeSelectorElement = document.getElementById(timeSelectorId);
        if(timeSelectorElement){
            timeSelectorElement.querySelectorAll('.dropdown').forEach(n => {
                n.classList.add('hide');
            });
        }
    }

    public static ChangeEventListener(timeSelectorId: string, eventType: TimeSelectorEvents, onTimeChange: Function | null = null, event: Event){
        event.stopPropagation();
        event.preventDefault();
        const timeSelectorElement = document.getElementById(timeSelectorId);
        if(timeSelectorElement){
            const calendarIndex = parseInt(timeSelectorElement.getAttribute('data-calendar') || '');
            const calendars = CalManager.getAllCalendars();
            if(!isNaN(calendarIndex) && calendarIndex >= 0 && calendarIndex < calendars.length){
                const calendar = calendars[calendarIndex];
                let options: SimpleCalendar.Renderer.TimeSelectorOptions = {id:''};
                const optionsInput = timeSelectorElement.querySelector('.render-options');
                if(optionsInput){
                    options = JSON.parse(decodeURIComponent((<HTMLInputElement>optionsInput).value));
                }
                if(!options.selectedTime){
                    options.selectedTime = { start: { hour: 0, minute: 0, seconds: 0 }, end: { hour: 0, minute: 0, seconds: 0 } };
                }
                let target = <HTMLElement>event.target;
                let amount = 0;
                let isHours = true;
                let isStart = true;

                if(eventType === TimeSelectorEvents.change || eventType === TimeSelectorEvents.wheel){
                    amount = parseInt((<HTMLInputElement>target).value);
                    if(!isNaN(amount)){
                        isHours =  target.classList.contains('sc-ts-hour');
                        if(target.parentElement){
                            isStart = target.parentElement.classList.contains('start-time');
                        }
                    } else {
                        amount = 0;
                    }

                    if(eventType === TimeSelectorEvents.wheel){
                        amount += (<WheelEvent>event).deltaY < 0? 1 : -1;
                    }
                } else if(eventType === TimeSelectorEvents.dropdownClick){
                    amount = parseInt(target.innerText);
                    if(!isNaN(amount) && target.parentElement){
                        isHours =  target.parentElement.classList.contains('sc-ts-hour-list');
                        if(target.parentElement.parentElement) {
                            isStart = target.parentElement.parentElement.classList.contains('start-time');
                        }
                    }
                }
                if(options.allowTimeRange){
                    if(isStart){
                        if(isHours){
                            options.selectedTime.start.hour = amount;
                        } else {
                            options.selectedTime.start.minute = amount;
                        }
                    } else {
                        if(isHours){
                            options.selectedTime.end.hour = amount;
                        } else {
                            options.selectedTime.end.minute = amount;
                        }
                    }
                } else {
                    if(isHours){
                        options.selectedTime.start.hour = amount;
                        options.selectedTime.end.hour = amount;
                    } else {
                        options.selectedTime.start.minute = amount;
                        options.selectedTime.end.minute = amount;
                    }
                }

                //Validate inputs fall within acceptable ranges for the calendar
                if(options.selectedTime.start.hour < 0){
                    options.selectedTime.start.hour = 0;
                }
                if(options.selectedTime.start.minute < 0){
                    options.selectedTime.start.minute = 0;
                }
                if(options.selectedTime.end.hour < 0){
                    options.selectedTime.end.hour = 0;
                }
                if(options.selectedTime.end.minute < 0){
                    options.selectedTime.end.minute = 0;
                }

                if(options.selectedTime.start.hour >= calendar.year.time.hoursInDay){
                    options.selectedTime.start.hour = calendar.year.time.hoursInDay - 1;
                }
                if(options.selectedTime.start.minute >= calendar.year.time.minutesInHour){
                    options.selectedTime.start.minute = calendar.year.time.minutesInHour - 1;
                }
                if(options.selectedTime.end.hour >= calendar.year.time.hoursInDay){
                    options.selectedTime.end.hour = calendar.year.time.hoursInDay - 1;
                }
                if(options.selectedTime.end.minute >= calendar.year.time.minutesInHour){
                    options.selectedTime.end.minute = calendar.year.time.minutesInHour - 1;
                }

                if(!options.disableSelfUpdate){
                    const newHTML = TimeSelector.Render(calendar, options);
                    const temp = document.createElement('div');
                    temp.innerHTML = newHTML;
                    if(temp.firstChild) {
                        timeSelectorElement.replaceWith(temp.firstChild);
                        TimeSelector.ActivateListeners(options.id, onTimeChange);
                    }
                }

                if(onTimeChange){
                    onTimeChange(options);
                }

            }
        }
    }

    /**
     * When a time input is clicked, will open the associated dropdown for that input.
     * @param {string} timeSelectorId The ID of the time selector this input belongs too
     * @param {Event} event The event from the input that was clicked
     */
    public static InputClickEventListener(timeSelectorId: string, event: Event){
        event.stopPropagation();
        TimeSelector.HideTimeDropdown(timeSelectorId);
        let target = <HTMLElement>event.target;
        if(target && target.parentElement){
            const cssClass = target.classList.toString() + '-list';
            target.parentElement.querySelector(`.${cssClass}`)?.classList.remove('hide');
        }
    }
}