import SimpleCalendar from "./simple-calendar";
import {GameSettings} from "./game-settings";
import DateSelector from "./date-selector";
import Utilities from "./utilities";
import {Note} from "./note";

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

    /**
     * Handlebar Helper for rendering a DateSelector
     * @param options
     */
    static DateSelector(options: any){
        if(SimpleCalendar.instance.currentYear && options.hash.hasOwnProperty('id') ){
            const id = options.hash['id'];
            const ds = DateSelector.GetSelector(id, {showDate: true, showTime: false});
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
                    const userId = GameSettings.UserID();
                    const regularNotes = notes.filter(n => n.remindUsers.indexOf(userId) === -1);
                    const reminderNotes = notes.filter(n => n.remindUsers.indexOf(userId) !== -1);
                    let r = '';
                    if(regularNotes.length){
                        const rCount = regularNotes.length < 100? regularNotes.length : 99;
                        let rTitle = HandlebarsHelpers.GenerateNoteIconTitle(rCount, regularNotes);
                        r = `<span class="note-count" title="${rTitle}">${rCount}</span>`;
                    }
                    if(reminderNotes.length){
                        const remCount = reminderNotes.length < 100? reminderNotes.length : 99;
                        let remTitle = HandlebarsHelpers.GenerateNoteIconTitle(remCount, reminderNotes);
                        r += `<span class="note-count reminders" title="${remTitle}">${remCount}</span>`;
                    }

                    return new Handlebars.SafeString(r);
                }
            }
        }
        return '';
    }

    /**
     * Generates the title for the note indicator
     * @param {number} count How many notes there are
     * @param {Note[]} notes The notes for the indicator
     * @private
     */
    private static GenerateNoteIconTitle(count: number, notes: Note[]){
        let rTitle = `${count} ${GameSettings.Localize('FSC.Configuration.General.Notes')}`;
        if(notes.length < 3){
            rTitle = GameSettings.Localize('FSC.Configuration.General.Notes') + ':\n';
            for(let i = 0; i < notes.length; i++){
                if(i !== 0){
                    rTitle += '\n';
                }
                const nTitle = notes[i].title.replace(/"/g,'&quot;');
                rTitle += `${nTitle}`;
            }
        }
        return rTitle;
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
                    let moon = Utilities.GetMoonPhaseIcon(mp.icon, SimpleCalendar.instance.currentYear.moons[i].color);
                    html += `<span class="moon-phase ${mp.icon}" title="${SimpleCalendar.instance.currentYear.moons[i].name} - ${mp.name}">${moon}</span>`;
                }
            }
            return new Handlebars.SafeString(html);
        }
        return '';
    }
}
