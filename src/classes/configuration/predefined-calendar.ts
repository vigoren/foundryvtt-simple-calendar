import {
    ModuleName,
    PredefinedCalendars
} from "../../constants";
import Calendar from "../calendar";
import {NManager} from "../index";


export default class PredefinedCalendar{
    
    public static async setToPredefined(calendar: Calendar, calendarType: PredefinedCalendars, addNotes: boolean = true){
        let updated = false;
        //Attempt to load the predefined calendar settings from the server
        let res = await fetch(`modules/${ModuleName}/predefined-calendars/${calendarType}.json`);
        const data = await res.json();
        if(data && data.calendar){
            //Remove the name if present
            delete data.calendar['name'];

            if(calendarType === PredefinedCalendars.Gregorian){
                const d = new Date();
                data.calendar.currentDate.year = d.getFullYear();
                data.calendar.currentDate.month = d.getMonth();
                data.calendar.currentDate.day = d.getDate() - 1;
                data.calendar.year.numericRepresentation = d.getFullYear();
            }

            //Load the calendar with the settings
            calendar.loadFromSettings(data.calendar);

            if(addNotes && data.notes){
                const perms: Partial<Record<string, 0 | 1 | 2 | 3>> = {};
                (<Game>game).users?.forEach(u => perms[u.id] = (<Game>game).user?.id === u.id? 3 : 2);
                const calendarId = calendar.id.replace('_temp', '');
                for(let i = 0; i < data.notes.length; i++){
                    const note = data.notes[i];
                    note.flags[ModuleName].noteData.calendarId = calendarId;
                    note.folder = NManager.noteDirectory?.id;
                    note.permission = perms;
                    const je = await JournalEntry.create(note, {keepId: false});
                    if(je){
                        NManager.addNoteStub(je, calendarId);
                    }
                }
            }
            updated = true;
        }
        return updated;
    }
}
