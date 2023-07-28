import Calendar from "../calendar";
import { PadNumber } from "../utilities/string";
import { deepMerge } from "../utilities/object";
import { TimeSelectorEvents } from "../../constants";
import { CalManager } from "../index";

export default class TimeSelector {
    private static defaultOptions: SimpleCalendar.Renderer.TimeSelectorOptions = {
        id: "",
        allowTimeRange: true,
        disableSelfUpdate: false,
        timeDelimiter: "-",
        useCalendarClones: false
    };

    public static Render(calendar: Calendar, options: SimpleCalendar.Renderer.TimeSelectorOptions = { id: "" }): string {
        options = deepMerge({}, this.defaultOptions, options);
        let html = `<div id="${options.id}" class="fsc-time-selector" data-calendar="${CalManager.getAllCalendars(
            options.useCalendarClones
        ).findIndex((c) => {
            return c.id === calendar.id;
        })}">`;
        //Hidden Options
        html += `<input class="fsc-render-options" type="hidden" value="${encodeURIComponent(
            JSON.stringify(options)
        )}"/><span class="far fa-clock"></span>`;

        if (options.allowTimeRange) {
            html += this.RenderTimeInputGroup(calendar, "fsc-start-time", options.selectedTime?.start);
            html += `<span class="fsc-time-spacer">${options.timeDelimiter}</span>`;
            html += this.RenderTimeInputGroup(calendar, "fsc-end-time", options.selectedTime?.end);
        } else {
            html += this.RenderTimeInputGroup(calendar, "", options.selectedTime?.start);
        }

        //Close main div
        html += `</div>`;
        return html;
    }

    private static RenderTimeInputGroup(calendar: Calendar, cssClass: string = "", selectedAmount = { hour: 0, minute: 0 }) {
        let html = `<div class="fsc-ts-inputs ${cssClass}">`;
        //Add Hours
        html += `<input class="fsc-ts-hour" data-list="fsc-ts-hour-list" type="number" value="${PadNumber(
            selectedAmount.hour
        )}" /><ul class="fsc-dropdown fsc-hide fsc-ts-hour-list">`;
        for (let i = 0; i < calendar.time.hoursInDay; i++) {
            html += `<li>${PadNumber(i)}</li>`;
        }
        html += `</ul>`;

        //Ad Minutes
        html += `<span class="fsc-time-spacer">:</span><input class="fsc-ts-minute" data-list="fsc-ts-minute-list" type="number" value="${PadNumber(
            selectedAmount.minute
        )}" /><ul class="fsc-dropdown fsc-hide fsc-ts-minute-list">`;
        for (let i = 0; i < calendar.time.minutesInHour; i += 5) {
            html += `<li>${PadNumber(i)}</li>`;
        }
        html += `</ul>`;

        html += `</div>`;
        return html;
    }

    public static ActivateListeners(
        timeSelectorId: string,
        onTimeChange: ((options: SimpleCalendar.Renderer.TimeSelectorOptions) => void) | null = null
    ) {
        const timeSelectorElement = document.getElementById(timeSelectorId);
        if (timeSelectorElement) {
            if (timeSelectorElement.parentElement) {
                timeSelectorElement.parentElement.addEventListener("click", TimeSelector.HideTimeDropdown.bind(TimeSelector, timeSelectorId));
            }
            //Hour Click
            timeSelectorElement.querySelectorAll(".fsc-ts-inputs .fsc-ts-hour").forEach((h) => {
                h.addEventListener(
                    "change",
                    TimeSelector.ChangeEventListener.bind(TimeSelector, timeSelectorId, TimeSelectorEvents.change, onTimeChange)
                );
                h.addEventListener("click", TimeSelector.InputClickEventListener.bind(TimeSelector, timeSelectorId));
                h.addEventListener(
                    "wheel",
                    TimeSelector.ChangeEventListener.bind(TimeSelector, timeSelectorId, TimeSelectorEvents.wheel, onTimeChange)
                );
            });

            //minute Click
            timeSelectorElement.querySelectorAll(".fsc-ts-inputs .fsc-ts-minute").forEach((m) => {
                m.addEventListener(
                    "change",
                    TimeSelector.ChangeEventListener.bind(TimeSelector, timeSelectorId, TimeSelectorEvents.change, onTimeChange)
                );
                m.addEventListener("click", TimeSelector.InputClickEventListener.bind(TimeSelector, timeSelectorId));
                m.addEventListener(
                    "wheel",
                    TimeSelector.ChangeEventListener.bind(TimeSelector, timeSelectorId, TimeSelectorEvents.wheel, onTimeChange)
                );
            });

            //Dropdown Item Click
            timeSelectorElement.querySelectorAll(".fsc-ts-inputs .fsc-dropdown").forEach((d) => {
                d.addEventListener(
                    "click",
                    TimeSelector.ChangeEventListener.bind(TimeSelector, timeSelectorId, TimeSelectorEvents.dropdownClick, onTimeChange)
                );
            });
        }
    }

    /**
     * Hides all the time selector dropdowns
     * @param {string} timeSelectorId The ID of the time selector whose dropdowns to hide.
     */
    public static HideTimeDropdown(timeSelectorId: string) {
        const timeSelectorElement = document.getElementById(timeSelectorId);
        if (timeSelectorElement) {
            timeSelectorElement.querySelectorAll(".fsc-dropdown").forEach((n) => {
                n.classList.add("fsc-hide");
            });
        }
    }

    public static ChangeEventListener(
        timeSelectorId: string,
        eventType: TimeSelectorEvents,
        onTimeChange: ((options: SimpleCalendar.Renderer.TimeSelectorOptions) => void) | null,
        event: Event
    ) {
        event.stopPropagation();
        event.preventDefault();
        const timeSelectorElement = document.getElementById(timeSelectorId);
        if (timeSelectorElement) {
            let options: SimpleCalendar.Renderer.TimeSelectorOptions = { id: "" };
            const optionsInput = timeSelectorElement.querySelector(".fsc-render-options");
            if (optionsInput) {
                options = JSON.parse(decodeURIComponent((<HTMLInputElement>optionsInput).value));
            }
            const calendarIndex = parseInt(timeSelectorElement.getAttribute("data-calendar") || "");
            const calendars = CalManager.getAllCalendars(options.useCalendarClones);
            if (!isNaN(calendarIndex) && calendarIndex >= 0 && calendarIndex < calendars.length) {
                const calendar = calendars[calendarIndex];
                if (!options.selectedTime) {
                    options.selectedTime = { start: { hour: 0, minute: 0, seconds: 0 }, end: { hour: 0, minute: 0, seconds: 0 } };
                }
                const target = <HTMLElement>event.target;
                let amount = 0;
                let isHours = true;
                let isStart = true;

                if (eventType === TimeSelectorEvents.change || eventType === TimeSelectorEvents.wheel) {
                    amount = parseInt((<HTMLInputElement>target).value);
                    if (!isNaN(amount)) {
                        isHours = target.classList.contains("fsc-ts-hour");
                        if (target.parentElement) {
                            isStart = target.parentElement.classList.contains("fsc-start-time");
                        }
                    } else {
                        amount = 0;
                    }

                    if (eventType === TimeSelectorEvents.wheel) {
                        amount += (<WheelEvent>event).deltaY < 0 ? 1 : -1;
                    }
                } else if (eventType === TimeSelectorEvents.dropdownClick) {
                    amount = parseInt(target.innerText);
                    if (!isNaN(amount) && target.parentElement) {
                        isHours = target.parentElement.classList.contains("fsc-ts-hour-list");
                        if (target.parentElement.parentElement) {
                            isStart = target.parentElement.parentElement.classList.contains("fsc-start-time");
                        }
                    }
                }
                if (options.allowTimeRange) {
                    if (isStart) {
                        if (isHours) {
                            options.selectedTime.start.hour = amount;
                        } else {
                            options.selectedTime.start.minute = amount;
                        }
                    } else {
                        if (isHours) {
                            options.selectedTime.end.hour = amount;
                        } else {
                            options.selectedTime.end.minute = amount;
                        }
                    }
                } else {
                    if (isHours) {
                        options.selectedTime.start.hour = amount;
                        options.selectedTime.end.hour = amount;
                    } else {
                        options.selectedTime.start.minute = amount;
                        options.selectedTime.end.minute = amount;
                    }
                }

                //Validate inputs fall within acceptable ranges for the calendar
                if (options.selectedTime.start.hour < 0) {
                    options.selectedTime.start.hour = 0;
                }
                if (options.selectedTime.start.minute < 0) {
                    options.selectedTime.start.minute = 0;
                }
                if (options.selectedTime.end.hour < 0) {
                    options.selectedTime.end.hour = 0;
                }
                if (options.selectedTime.end.minute < 0) {
                    options.selectedTime.end.minute = 0;
                }

                if (options.selectedTime.start.hour >= calendar.time.hoursInDay) {
                    options.selectedTime.start.hour = calendar.time.hoursInDay - 1;
                }
                if (options.selectedTime.start.minute >= calendar.time.minutesInHour) {
                    options.selectedTime.start.minute = calendar.time.minutesInHour - 1;
                }
                if (options.selectedTime.end.hour >= calendar.time.hoursInDay) {
                    options.selectedTime.end.hour = calendar.time.hoursInDay - 1;
                }
                if (options.selectedTime.end.minute >= calendar.time.minutesInHour) {
                    options.selectedTime.end.minute = calendar.time.minutesInHour - 1;
                }

                if (!options.disableSelfUpdate) {
                    const newHTML = TimeSelector.Render(calendar, options);
                    const temp = document.createElement("div");
                    temp.innerHTML = newHTML;
                    if (temp.firstChild) {
                        timeSelectorElement.replaceWith(temp.firstChild);
                        TimeSelector.ActivateListeners(options.id, onTimeChange);
                    }
                }

                if (onTimeChange) {
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
    public static InputClickEventListener(timeSelectorId: string, event: Event) {
        event.stopPropagation();
        TimeSelector.HideTimeDropdown(timeSelectorId);
        const target = <HTMLElement>event.target;
        if (target && target.parentElement) {
            const listClass = target.getAttribute("data-list");
            if (listClass) {
                target.parentElement.querySelector(`.${listClass}`)?.classList.remove("fsc-hide");
            }
        }
    }
}
