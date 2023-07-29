import DateSelectorManager from "../date-selector/date-selector-manager";
import Renderer from "../renderer";
import { GetIcon } from "../utilities/visual";
import { CalManager } from "../index";
import SCController from "../s-c-controller";

/**
 * Class that contains all the Handlebars helper functions
 */
export class HandlebarsHelpers {
    /**
     * Registers the helper functions with Handlebars
     */
    static Register() {
        Handlebars.registerHelper("sc-date-selector", HandlebarsHelpers.DateSelector);
        Handlebars.registerHelper("sc-full-calendar", HandlebarsHelpers.FullCalendar);
        Handlebars.registerHelper("sc-clock", HandlebarsHelpers.Clock);
        Handlebars.registerHelper("sc-icon", HandlebarsHelpers.Icon);
        Handlebars.registerHelper("sc-multi-select", HandlebarsHelpers.MultiSelect);
        Handlebars.registerHelper("sc-date-time-controls", HandlebarsHelpers.DateTimeControls);
    }

    /**
     * Handlebar Helper for rendering a DateSelector
     * @param options
     */
    static DateSelector(options: any) {
        if (Object.prototype.hasOwnProperty.call(options.hash, "id")) {
            const dsOptions: SimpleCalendar.DateTimeSelector.Options = {};
            if (Object.prototype.hasOwnProperty.call(options.hash, "allowDateRangeSelection")) {
                dsOptions.allowDateRangeSelection = options.hash["allowDateRangeSelection"];
            }
            if (Object.prototype.hasOwnProperty.call(options.hash, "allowTimeRangeSelection")) {
                dsOptions.allowTimeRangeSelection = options.hash["allowTimeRangeSelection"];
            }
            if (Object.prototype.hasOwnProperty.call(options.hash, "calendar")) {
                dsOptions.calendar = CalManager.getCalendar(options.hash["calendar"]) || CalManager.getActiveCalendar();
            } else {
                dsOptions.calendar = CalManager.getActiveCalendar();
            }
            if (Object.prototype.hasOwnProperty.call(options.hash, "editYear")) {
                dsOptions.editYear = options.hash["editYear"];
            }
            if (Object.prototype.hasOwnProperty.call(options.hash, "onDateSelect")) {
                dsOptions.onDateSelect = options.hash["onDateSelect"];
            }
            if (Object.prototype.hasOwnProperty.call(options.hash, "position")) {
                dsOptions.position = options.hash["position"];
            }
            if (Object.prototype.hasOwnProperty.call(options.hash, "showCalendarYear")) {
                dsOptions.showCalendarYear = options.hash["showCalendarYear"];
            }
            if (Object.prototype.hasOwnProperty.call(options.hash, "showDateSelector")) {
                dsOptions.showDateSelector = options.hash["showDateSelector"];
            }
            if (Object.prototype.hasOwnProperty.call(options.hash, "selectedEndDate")) {
                dsOptions.selectedEndDate = options.hash["selectedEndDate"];
            }
            if (Object.prototype.hasOwnProperty.call(options.hash, "timeSelected")) {
                dsOptions.timeSelected = options.hash["timeSelected"];
            }
            if (Object.prototype.hasOwnProperty.call(options.hash, "selectedStartDate")) {
                dsOptions.selectedStartDate = options.hash["selectedStartDate"];
            }

            if (Object.prototype.hasOwnProperty.call(options.hash, "showTimeSelector")) {
                dsOptions.showTimeSelector = options.hash["showTimeSelector"];
            }
            if (Object.prototype.hasOwnProperty.call(options.hash, "timeDelimiter")) {
                dsOptions.timeDelimiter = options.hash["timeDelimiter"];
            }
            if (Object.prototype.hasOwnProperty.call(options.hash, "useCloneCalendars")) {
                dsOptions.useCloneCalendars = options.hash["useCloneCalendars"];
            }
            const id = options.hash["id"];
            const ds = DateSelectorManager.GetSelector(id, dsOptions);
            return new Handlebars.SafeString(ds.build());
        }
        return "";
    }

    /**
     * Renders the full calendar display
     * @param options
     */
    static FullCalendar(options: any) {
        const renderOptions: SimpleCalendar.Renderer.CalendarOptions = { id: "" };
        let calendarId = "";
        if (Object.prototype.hasOwnProperty.call(options.hash, "allowChangeMonth")) {
            renderOptions.allowChangeMonth = options.hash["allowChangeMonth"];
        }
        if (Object.prototype.hasOwnProperty.call(options.hash, "colorToMatchSeason")) {
            renderOptions.colorToMatchSeason = options.hash["colorToMatchSeason"];
        }
        if (Object.prototype.hasOwnProperty.call(options.hash, "cssClasses")) {
            renderOptions.cssClasses = options.hash["cssClasses"];
        }
        if (Object.prototype.hasOwnProperty.call(options.hash, "date")) {
            renderOptions.date = Object.assign({}, options.hash["date"]);
        }
        if (Object.prototype.hasOwnProperty.call(options.hash, "editYear")) {
            renderOptions.editYear = options.hash["editYear"];
        }
        if (Object.prototype.hasOwnProperty.call(options.hash, "id")) {
            renderOptions.id = options.hash["id"];
        }
        if (Object.prototype.hasOwnProperty.call(options.hash, "calendarId")) {
            calendarId = options.hash["calendarId"];
        }
        if (Object.prototype.hasOwnProperty.call(options.hash, "showCurrentDate")) {
            renderOptions.showCurrentDate = options.hash["showCurrentDate"];
        }
        if (Object.prototype.hasOwnProperty.call(options.hash, "showDayDetails")) {
            renderOptions.showDayDetails = options.hash["showDayDetails"];
        }
        if (Object.prototype.hasOwnProperty.call(options.hash, "showDescriptions")) {
            renderOptions.showDescriptions = options.hash["showDescriptions"];
        }
        if (Object.prototype.hasOwnProperty.call(options.hash, "showSeasonName")) {
            renderOptions.showSeasonName = options.hash["showSeasonName"];
        }
        if (Object.prototype.hasOwnProperty.call(options.hash, "showNoteCount")) {
            renderOptions.showNoteCount = options.hash["showNoteCount"];
        }
        if (Object.prototype.hasOwnProperty.call(options.hash, "showMoonPhases")) {
            renderOptions.showMoonPhases = options.hash["showMoonPhases"];
        }
        if (Object.prototype.hasOwnProperty.call(options.hash, "showYear")) {
            renderOptions.showYear = options.hash["showYear"];
        }
        if (Object.prototype.hasOwnProperty.call(options.hash, "theme")) {
            renderOptions.theme = options.hash["theme"];
            if (renderOptions.theme !== "none" && renderOptions.theme !== "auto") {
                SCController.LoadThemeCSS(renderOptions.theme);
            }
        }
        let cal = CalManager.getCalendar(calendarId);
        if (!cal) {
            cal = CalManager.getActiveCalendar();
        }
        return new Handlebars.SafeString(Renderer.CalendarFull.Render(cal, renderOptions));
    }

    /**
     * Renders the clock interface
     * @param options
     */
    static Clock(options: any) {
        const renderOptions: SimpleCalendar.Renderer.ClockOptions = { id: "" };
        let calendarId = "";
        if (Object.prototype.hasOwnProperty.call(options.hash, "id")) {
            renderOptions.id = options.hash["id"];
        }
        if (Object.prototype.hasOwnProperty.call(options.hash, "calendarId")) {
            calendarId = options.hash["calendarId"];
        }
        if (Object.prototype.hasOwnProperty.call(options.hash, "theme")) {
            renderOptions.theme = options.hash["theme"];
            if (renderOptions.theme !== "none" && renderOptions.theme !== "auto") {
                SCController.LoadThemeCSS(renderOptions.theme);
            }
        }
        let cal = CalManager.getCalendar(calendarId);
        if (!cal) {
            cal = CalManager.getActiveCalendar();
        }
        return new Handlebars.SafeString(Renderer.Clock.Render(cal, renderOptions));
    }

    /**
     * Renders one of the icons bundled with Simple Calendar
     * @param options
     */
    static Icon(options: any) {
        if (Object.prototype.hasOwnProperty.call(options.hash, "name")) {
            let stroke = "#000000";
            let fill = "#000000";

            if (Object.prototype.hasOwnProperty.call(options.hash, "stroke")) {
                stroke = options.hash["stroke"];
            }
            if (Object.prototype.hasOwnProperty.call(options.hash, "fill")) {
                fill = options.hash["fill"];
            }
            return new Handlebars.SafeString(GetIcon(options.hash["name"], stroke, fill));
        }
        return "";
    }

    /**
     * Renders a multi select input to allow users to choose more than one option from a select
     * @param options
     */
    static MultiSelect(options: any) {
        const renderOptions: SimpleCalendar.Renderer.MultiSelectOptions = { id: "", options: [] };
        if (Object.prototype.hasOwnProperty.call(options.hash, "id")) {
            renderOptions.id = options.hash["id"];
        }
        if (Object.prototype.hasOwnProperty.call(options.hash, "options")) {
            renderOptions.options = options.hash["options"];
        }

        return new Handlebars.SafeString(Renderer.MultiSelect.Render(renderOptions));
    }

    static DateTimeControls(options: any) {
        const renderOptions: SimpleCalendar.Renderer.DateTimeControlOptions = {};
        if (Object.prototype.hasOwnProperty.call(options.hash, "showDateControls")) {
            renderOptions.showDateControls = options.hash["showDateControls"];
        }
        if (Object.prototype.hasOwnProperty.call(options.hash, "showTimeControls")) {
            renderOptions.showTimeControls = options.hash["showTimeControls"];
        }
        if (Object.prototype.hasOwnProperty.call(options.hash, "showPresetTimeOfDay")) {
            renderOptions.showPresetTimeOfDay = options.hash["showPresetTimeOfDay"];
        }
        if (Object.prototype.hasOwnProperty.call(options.hash, "displayType")) {
            renderOptions.displayType = options.hash["displayType"];
        }
        if (Object.prototype.hasOwnProperty.call(options.hash, "fullDisplay")) {
            renderOptions.fullDisplay = options.hash["fullDisplay"];
        }
        if (Object.prototype.hasOwnProperty.call(options.hash, "largeSteps")) {
            renderOptions.largerSteps = options.hash["largeSteps"];
        }
        if (Object.prototype.hasOwnProperty.call(options.hash, "reverseTime")) {
            renderOptions.reverseTime = options.hash["reverseTime"];
        }
        return new Handlebars.SafeString(Renderer.DateTimeControls.Render(renderOptions));
    }
}
