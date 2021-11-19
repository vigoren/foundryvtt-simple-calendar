import DateSelectorManager from "../date-selector/date-selector-manager";
import Renderer from "../renderer";
import {SCDateSelector, SCRenderer} from "../../interfaces";
import {GetIcon} from "../utilities/visual";
import {CalManager} from "../index";

/**
 * Class that contains all of the Handlebars helper functions
 */
export default class HandlebarsHelpers{

    /**
     * Registers the helper functions with Handlebars
     */
    static Register(){
        Handlebars.registerHelper("sc-date-selector", HandlebarsHelpers.DateSelector);
        Handlebars.registerHelper("sc-full-calendar", HandlebarsHelpers.FullCalendar);
        Handlebars.registerHelper("sc-clock", HandlebarsHelpers.Clock);
        Handlebars.registerHelper("sc-icon", HandlebarsHelpers.Icon);
    }

    /**
     * Handlebar Helper for rendering a DateSelector
     * @param options
     */
    static DateSelector(options: any){
        if(options.hash.hasOwnProperty('id') ){
            const dsOptions: SCDateSelector.Options = {};
            if(options.hash.hasOwnProperty('allowDateRangeSelection')){
                dsOptions.allowDateRangeSelection = options.hash['allowDateRangeSelection'];
            }
            if(options.hash.hasOwnProperty('allowTimeRangeSelection')){
                dsOptions.allowTimeRangeSelection = options.hash['allowTimeRangeSelection'];
            }
            if(options.hash.hasOwnProperty('calendar')){
                dsOptions.calendar = options.hash['calendar'];
            } else {
                dsOptions.calendar = CalManager.getActiveCalendar();
            }
            if(options.hash.hasOwnProperty('onDateSelect')){
                dsOptions.onDateSelect = options.hash['onDateSelect'];
            }
            if(options.hash.hasOwnProperty('position')){
                dsOptions.position = options.hash['position'];
            }
            if(options.hash.hasOwnProperty('showCalendarYear')){
                dsOptions.showCalendarYear = options.hash['showCalendarYear'];
            }
            if(options.hash.hasOwnProperty('showDateSelector')){
                dsOptions.showDateSelector= options.hash['showDateSelector'];
            }
            if(options.hash.hasOwnProperty('selectedEndDate')){
                dsOptions.selectedEndDate = options.hash['selectedEndDate'];
            }
            if(options.hash.hasOwnProperty('timeSelected')){
                dsOptions.timeSelected= options.hash['timeSelected'];
            }
            if(options.hash.hasOwnProperty('selectedStartDate')){
                dsOptions.selectedStartDate = options.hash['selectedStartDate'];
            }

            if(options.hash.hasOwnProperty('showTimeSelector')){
                dsOptions.showTimeSelector = options.hash['showTimeSelector'];
            }
            if(options.hash.hasOwnProperty('timeDelimiter')){
                dsOptions.timeDelimiter = options.hash['timeDelimiter'];
            }
            const id = options.hash['id'];
            const ds = DateSelectorManager.GetSelector(id, dsOptions);
            return new Handlebars.SafeString(ds.build());
        }
        return '';
    }

    /**
     * Renders the full calendar display
     * @param options
     */
    static FullCalendar(options: any){
        const renderOptions: SCRenderer.CalendarOptions = {id:''};
        if(options.hash.hasOwnProperty('allowChangeMonth')){
            renderOptions.allowChangeMonth = options.hash['allowChangeMonth'];
        }
        if(options.hash.hasOwnProperty('colorToMatchSeason')){
            renderOptions.colorToMatchSeason = options.hash['colorToMatchSeason'];
        }
        if(options.hash.hasOwnProperty('cssClasses')){
            renderOptions.cssClasses = options.hash['cssClasses'];
        }
        if(options.hash.hasOwnProperty('date')){
            renderOptions.date = Object.assign({}, options.hash['date']);
        }
        if(options.hash.hasOwnProperty('id')){
            renderOptions.id = options.hash['id'];
        }
        if(options.hash.hasOwnProperty('showCurrentDate')){
            renderOptions.showCurrentDate = options.hash['showCurrentDate'];
        }
        if(options.hash.hasOwnProperty('showSeasonName')){
            renderOptions.showSeasonName = options.hash['showSeasonName'];
        }
        if(options.hash.hasOwnProperty('showNoteCount')){
            renderOptions.showNoteCount = options.hash['showNoteCount'];
        }
        if(options.hash.hasOwnProperty('showMoonPhases')){
            renderOptions.showMoonPhases = options.hash['showMoonPhases'];
        }
        if(options.hash.hasOwnProperty('showYear')){
            renderOptions.showYear = options.hash['showYear'];
        }
        return new Handlebars.SafeString(Renderer.CalendarFull.Render(CalManager.getActiveCalendar(), renderOptions));
    }

    /**
     * Renders the clock interface
     * @param options
     */
    static Clock(options: any){
        const renderOptions: SCRenderer.ClockOptions = {id:''};
        if(options.hash.hasOwnProperty('id')){
            renderOptions.id = options.hash['id'];
        }
        return new Handlebars.SafeString(Renderer.Clock.Render(CalManager.getActiveCalendar(), renderOptions));
    }

    /**
     * Renders one of the icons bundled with Simple Calendar
     * @param options
     */
    static Icon(options: any){
        if(options.hash.hasOwnProperty('name') ){
            let stroke = "#000000";
            let fill = "#000000";

            if(options.hash.hasOwnProperty('stroke')){
                stroke = options.hash['stroke'];
            }
            if(options.hash.hasOwnProperty('fill')){
                fill = options.hash['fill'];
            }
            return new Handlebars.SafeString(GetIcon(options.hash['name'], stroke, fill));
        }
        return '';
    }
}
