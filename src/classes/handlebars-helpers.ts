import SimpleCalendar from "./simple-calendar";
import {GameSettings} from "./game-settings";

/**
 * Class that contains all of the Handlebars helper functions
 */
export default class HandlebarsHelpers{

    /**
     * Registers the helper functions with Handlebars
     */
    static Register(){
        Handlebars.registerHelper("calendar-width", HandlebarsHelpers.CalendarWidth);
        Handlebars.registerHelper("calendar-row-width", HandlebarsHelpers.CalendarRowWidth);
        Handlebars.registerHelper("day-has-note", HandlebarsHelpers.DayHasNotes);
    }

    /**
     * Determines what the width of the calendar should be based on how many days in a week
     * @return {string}
     */
    static CalendarWidth(){
        if(SimpleCalendar.instance.currentYear){
            return `width:${(SimpleCalendar.instance.currentYear.weekdays.length * 40) + 12}px;`;
        }
        return '';
    }

    /**
     * For the GM sets the width of the row that contains the calendar and the date update tools
     * @return {string}
     */
    static CalendarRowWidth(){
        if(GameSettings.IsGm() && SimpleCalendar.instance.currentYear){
            let width = (SimpleCalendar.instance.currentYear.weekdays.length * 40) + 312;
            return `width:${width}px;`;
        }
        return '';
    }

    /**
     * Checks if a specific day has any notes the user can see associated with it
     * @param {*} options The options object passed from Handlebars
     * @return {string}
     */
    static DayHasNotes(options: any){
        if(options.hash.hasOwnProperty('day') && SimpleCalendar.instance.currentYear){
            const day = options.hash['day'].numericRepresentation;
            const month = SimpleCalendar.instance.currentYear.getMonth('visible');
            const year = SimpleCalendar.instance.currentYear.visibleYear;
            if(month){
                const notes = SimpleCalendar.instance.notes.filter(n => n.isVisible(year, month.numericRepresentation, day));
                if(notes.length){
                    const count = notes.length < 100? notes.length : 99;
                    return `<span class="note-count">${count}</span>`;
                }
            }
        }
        return '';
    }
}
