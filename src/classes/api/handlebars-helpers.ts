import DateSelectorManager from "../date-selector/date-selector-manager";
import Renderer from "../renderer";
import {GetIcon} from "../utilities/visual";
import {CalManager, SC} from "../index";
import SCController from "../s-c-controller";

/**
 * Class that contains all of the Handlebars helper functions
 */
export class HandlebarsHelpers{

    /**
     * Registers the helper functions with Handlebars
     */
    static Register(){
        Handlebars.registerHelper("sc-date-selector", HandlebarsHelpers.DateSelector);
        Handlebars.registerHelper("sc-full-calendar", HandlebarsHelpers.FullCalendar);
        Handlebars.registerHelper("sc-clock", HandlebarsHelpers.Clock);
        Handlebars.registerHelper("sc-icon", HandlebarsHelpers.Icon);
        Handlebars.registerHelper("sc-multi-select", HandlebarsHelpers.MultiSelect);
    }

    /**
     * Handlebar Helper for rendering a DateSelector
     * @param options
     */
    static DateSelector(options: any){
        if(options.hash.hasOwnProperty('id') ){
            const dsOptions: SimpleCalendar.DateTimeSelector.Options = {};
            if(options.hash.hasOwnProperty('allowDateRangeSelection')){
                dsOptions.allowDateRangeSelection = options.hash['allowDateRangeSelection'];
            }
            if(options.hash.hasOwnProperty('allowTimeRangeSelection')){
                dsOptions.allowTimeRangeSelection = options.hash['allowTimeRangeSelection'];
            }
            if(options.hash.hasOwnProperty('calendar')){
                dsOptions.calendar = CalManager.getCalendar(options.hash['calendar']) || CalManager.getActiveCalendar();
            } else {
                dsOptions.calendar = CalManager.getActiveCalendar();
            }
            if(options.hash.hasOwnProperty('editYear')){
                dsOptions.editYear = options.hash['editYear'];
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
            if(options.hash.hasOwnProperty('useCloneCalendars')){
                dsOptions.useCloneCalendars = options.hash['useCloneCalendars'];
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
        const renderOptions: SimpleCalendar.Renderer.CalendarOptions = {id:''};
        let calendarId = '';
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
        if(options.hash.hasOwnProperty('editYear')){
            renderOptions.editYear = options.hash['editYear'];
        }
        if(options.hash.hasOwnProperty('id')){
            renderOptions.id = options.hash['id'];
        }
        if(options.hash.hasOwnProperty('calendarId')){
            calendarId = options.hash['calendarId'];
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
        if(options.hash.hasOwnProperty('theme')){
            renderOptions.theme = options.hash['theme'];
            if(renderOptions.theme !== 'none' && renderOptions.theme !== 'auto'){
                SCController.LoadThemeCSS(renderOptions.theme);
            }
        }
        let cal = CalManager.getCalendar(calendarId);
        if(!cal){
            cal = CalManager.getActiveCalendar();
        }
        return new Handlebars.SafeString(Renderer.CalendarFull.Render(cal, renderOptions));
    }

    /**
     * Renders the clock interface
     * @param options
     */
    static Clock(options: any){
        const renderOptions: SimpleCalendar.Renderer.ClockOptions = {id:''};
        let calendarId = '';
        if(options.hash.hasOwnProperty('id')){
            renderOptions.id = options.hash['id'];
        }
        if(options.hash.hasOwnProperty('calendarId')){
            calendarId = options.hash['calendarId'];
        }
        if(options.hash.hasOwnProperty('theme')){
            renderOptions.theme = options.hash['theme'];
            if(renderOptions.theme !== 'none' && renderOptions.theme !== 'auto'){
                SCController.LoadThemeCSS(renderOptions.theme);
            }
        }
        let cal = CalManager.getCalendar(calendarId);
        if(!cal){
            cal = CalManager.getActiveCalendar();
        }
        return new Handlebars.SafeString(Renderer.Clock.Render(cal, renderOptions));
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

    /**
     * Renders a multi select input to allow users to choose more than one option from a select
     * @param options
     */
    static MultiSelect(options: any){
        const renderOptions: SimpleCalendar.Renderer.MultiSelectOptions = {id:'', options: []};
        if(options.hash.hasOwnProperty('id')){
            renderOptions.id = options.hash['id'];
        }
        if(options.hash.hasOwnProperty('options')){
            renderOptions.options = options.hash['options'];
        }

        return new Handlebars.SafeString(Renderer.MultiSelect.Render(renderOptions));
    }
}
