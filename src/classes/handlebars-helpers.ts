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
        Handlebars.registerHelper("day-has-note", HandlebarsHelpers.DayHasNotes);
        Handlebars.registerHelper("day-moon-phase", HandlebarsHelpers.DayMoonPhase);
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
                    return `<span class="note-count" title="${count} ${GameSettings.Localize('FSC.Configuration.General.Notes')}">${count}</span>`;
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
            return html;
        }
        return '';
    }
}
