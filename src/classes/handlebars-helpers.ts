import DateSelector from "./date-selector";
import Renderer from "./renderer";
import SimpleCalendar from "./simple-calendar";
import {SCDateSelector, SCRenderer} from "../interfaces";

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
    }

    /**
     * Handlebar Helper for rendering a DateSelector
     * @param options
     */
    static DateSelector(options: any){
        if(options.hash.hasOwnProperty('id') ){
            const dsOptions: SCDateSelector.Options = {};
            if(options.hash.hasOwnProperty('timeSelected')){
                dsOptions.timeSelected= options.hash['timeSelected'];
            }
            if(options.hash.hasOwnProperty('showDateSelector')){
                dsOptions.showDateSelector= options.hash['showDateSelector'];
            }
            if(options.hash.hasOwnProperty('showTimeSelector')){
                dsOptions.showTimeSelector = options.hash['showTimeSelector'];
            }
            if(options.hash.hasOwnProperty('showCalendarYear')){
                dsOptions.showCalendarYear = options.hash['showCalendarYear'];
            }
            if(options.hash.hasOwnProperty('placeHolderText')){
                dsOptions.placeHolderText = options.hash['placeHolderText'];
            }
            if(options.hash.hasOwnProperty('allowDateRangeSelection')){
                dsOptions.allowDateRangeSelection = options.hash['allowDateRangeSelection'];
            }
            if(options.hash.hasOwnProperty('allowTimeRangeSelection')){
                dsOptions.allowTimeRangeSelection = options.hash['allowTimeRangeSelection'];
            }
            if(options.hash.hasOwnProperty('timeDelimiter')){
                dsOptions.timeDelimiter = options.hash['timeDelimiter'];
            }
            if(options.hash.hasOwnProperty('selectedStartDate')){
                dsOptions.selectedStartDate = options.hash['selectedStartDate'];
            }
            if(options.hash.hasOwnProperty('selectedEndDate')){
                dsOptions.selectedEndDate = options.hash['selectedEndDate'];
            }
            if(options.hash.hasOwnProperty('onDateSelect')){
                dsOptions.onDateSelect = options.hash['onDateSelect'];
            }

            const id = options.hash['id'];
            const ds = DateSelector.GetSelector(id, dsOptions);
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
        return new Handlebars.SafeString(Renderer.CalendarFull.Render(SimpleCalendar.instance.activeCalendar, renderOptions));
    }
}
