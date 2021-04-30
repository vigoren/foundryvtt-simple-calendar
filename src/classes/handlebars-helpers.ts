import SimpleCalendar from "./simple-calendar";
import {GameSettings} from "./game-settings";
import DateSelector from "./date-selector";
import {DayTemplate} from "../interfaces";

/**
 * Class that contains all of the Handlebars helper functions
 */
export default class HandlebarsHelpers{

    /**
     * Registers the helper functions with Handlebars
     */
    static Register(){
        Handlebars.registerHelper("sc-date-selector", HandlebarsHelpers.DateSelector);
        Handlebars.registerHelper("day-has-note", HandlebarsHelpers.DayHasNotes);
        Handlebars.registerHelper("day-moon-phase", HandlebarsHelpers.DayMoonPhase);
    }

    static DateSelector(options: any){
        if(SimpleCalendar.instance.currentYear && options.hash.hasOwnProperty('id') ){
            const id = options.hash['id'];
            const ds = DateSelector.GetSelector(id, {});
            return new Handlebars.SafeString(ds.build());
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
                    return new Handlebars.SafeString(`<span class="note-count" title="${count} ${GameSettings.Localize('FSC.Configuration.General.Notes')}">${count}</span>`);
                }
            }
        }
        return '';
    }

    /**
     * Checks to see the current phase of the moon for the given day
     * @param {*} options The options object passed from Handlebars
     * @return {string}
     */
    static DayMoonPhase(options: any){
        if(options.hash.hasOwnProperty('day') && SimpleCalendar.instance.currentYear){
            const day = options.hash['day'];
            let html = ''
            for(let i = 0; i < SimpleCalendar.instance.currentYear.moons.length; i++){
                const mp = SimpleCalendar.instance.currentYear.moons[i].getMoonPhase(SimpleCalendar.instance.currentYear, 'visible', day);
                if(mp && (mp.singleDay || day.selected || day.current)){
                    html += `<span class="moon-phase ${mp.icon}" title="${SimpleCalendar.instance.currentYear.moons[i].name} - ${mp.name}" style="background-color: ${SimpleCalendar.instance.currentYear.moons[i].color};"></span>`;
                }
            }
            return new Handlebars.SafeString(html);
        }
        return '';
    }
}
