import Calendar from "../calendar";
import { deepMerge } from "../utilities/object";
import { GetIcon } from "../utilities/visual";
import { Icons, TimeKeeperStatus } from "../../constants";
import { CalManager, SC } from "../index";

export default class Clock {
    private static defaultOptions: SimpleCalendar.Renderer.ClockOptions = {
        id: "",
        cssClasses: "",
        theme: "auto"
    };

    /**
     * Renders the full clock interface with icon and time
     * @param calendar
     * @param options
     */
    public static Render(calendar: Calendar, options: SimpleCalendar.Renderer.ClockOptions = { id: "" }): string {
        options = deepMerge({}, this.defaultOptions, options);
        const status = calendar.timeKeeper.getStatus();
        options.cssClasses += ` ${status}`;

        let html = `<div id="${options.id}" class="fsc-clock ${options.cssClasses} ${
            status === TimeKeeperStatus.Started ? "fsc-animate" : ""
        }" data-calendar="${calendar.id}">`;
        //Hidden Options
        html += `<input class="fsc-render-options" type="hidden" value="${encodeURIComponent(JSON.stringify(options))}"/>`;
        html += `<div class="fsc-animated-clock">${GetIcon(Icons.Clock)}</div>`;
        html += this.RenderTime(calendar);
        html += `</div>`;

        if (options.theme !== "none") {
            const theme = options.theme === "auto" ? SC.clientSettings.theme : options.theme;
            html = `<div class="simple-calendar ${theme}">${html}</div>`;
        }
        return html;
    }

    /**
     * Generates the HTML for the current time of the clock
     * @param calendar
     * @param options
     */
    public static RenderTime(calendar: Calendar) {
        return `<div class="fsc-current-time">${calendar.time.toString()}</div>`;
    }

    /**
     * Registers the update function with the calendars timekeeper so that the clock can be updated while the timekeeper is running.
     * @param clockId
     */
    public static ActivateListeners(clockId: string) {
        const clockElement = document.getElementById(clockId);
        if (clockElement) {
            const calendarIndex = clockElement.getAttribute("data-calendar") || "";
            const calendar = CalManager.getCalendar(calendarIndex);
            if (calendar) {
                calendar.timeKeeper.registerUpdateListener(clockId, Clock.UpdateListener.bind(Clock, clockId));
            }
        }
    }

    /**
     * This function is called when the timekeeper has processed an interval or status change.
     * This function will update the display text for the clock as well as the clock icon
     * @param clockId
     * @param status
     */
    public static UpdateListener(clockId: string, status: TimeKeeperStatus) {
        const clockElement = document.getElementById(clockId);
        if (clockElement) {
            const calendarIndex = clockElement.getAttribute("data-calendar") || "";
            const calendar = CalManager.getCalendar(calendarIndex);
            if (calendar) {
                /*let options: SimpleCalendar.Renderer.ClockOptions = { id: "" };
                const optionsInput = clockElement.querySelector(".fsc-render-options");
                if (optionsInput) {
                    options = JSON.parse(decodeURIComponent((<HTMLInputElement>optionsInput).value));
                }*/
                const newHTML = Clock.RenderTime(calendar);
                const temp = document.createElement("div");
                temp.innerHTML = newHTML;
                if (temp.firstChild) {
                    const timeElement = clockElement.querySelector(".fsc-current-time");
                    if (timeElement) {
                        timeElement.replaceWith(temp.firstChild);
                        if (!clockElement.classList.contains(status)) {
                            clockElement.classList.remove(TimeKeeperStatus.Started, TimeKeeperStatus.Stopped, TimeKeeperStatus.Paused, "fsc-animate");
                            clockElement.classList.add(status);
                            if (status === TimeKeeperStatus.Started) {
                                clockElement.classList.add("fsc-animate");
                            }
                        }
                    }
                }
            }
        }
    }
}
