import DateSelector from "./date-selector";
import Renderer from "./renderer";
import SimpleCalendar from "./simple-calendar";
import {SCRenderer} from "../interfaces";

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
            const id = options.hash['id'];
            const ds = DateSelector.GetSelector(id, {showDate: true, showTime: false});
            return new Handlebars.SafeString(ds.build());
        }
        return '';
    }

    /**
     * Renders the full calendar display
     * @param options
     */
    static FullCalendar(options: any){
        const renderOptions: SCRenderer.Options = {id:''};
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
        return new Handlebars.SafeString(Renderer.CalendarFull(SimpleCalendar.instance.activeCalendar, renderOptions));
    }
}
