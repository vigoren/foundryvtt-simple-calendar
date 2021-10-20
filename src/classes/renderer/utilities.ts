import Note from "../note";
import {GameSettings} from "../game-settings";

export default class RendererUtilities{
    /**
     * Generates the title for the note indicator
     * @param {number} count How many notes there are
     * @param {Note[]} notes The notes for the indicator
     */
    public static GenerateNoteIconTitle(count: number, notes: Note[]){
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
}