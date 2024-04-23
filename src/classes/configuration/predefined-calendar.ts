import { ModuleName, PredefinedCalendars } from "../../constants";
import Calendar from "../calendar";
import { NManager } from "../index";
import { foundryGetRoute } from "../foundry-interfacing/utilities";

export default class PredefinedCalendar {
    public static async setToPredefined(calendar: Calendar, calendarType: PredefinedCalendars, addNotes: boolean = true) {
        let updated = false;
        //Attempt to load the predefined calendar settings from the server
        const res = await fetch(foundryGetRoute(`modules/${ModuleName}/predefined-calendars/${calendarType}.json`));
        const data = await res.json();
        if (data && data.calendar) {
            const calendarId = calendar.id.replace("_temp", "");
            //Remove the name if present
            delete data.calendar["name"];

            if (calendarType === PredefinedCalendars.Gregorian) {
                const d = new Date();
                data.calendar.currentDate.year = d.getFullYear();
                data.calendar.currentDate.month = d.getMonth();
                data.calendar.currentDate.day = d.getDate() - 1;
                data.calendar.year.numericRepresentation = d.getFullYear();
            }

            //Load the calendar with the settings
            calendar.loadFromSettings(data.calendar);

            //Remove all existing system notes for the calendar
            const existingNotes = NManager.getNotes(calendarId);
            for (let i = 0; i < existingNotes.length; i++) {
                if (existingNotes[i].fromPredefined) {
                    const je = (<Game>game).journal?.get(existingNotes[i].entryId);
                    if (je) {
                        NManager.removeNoteStub(je);
                        await je.delete();
                    }
                }
            }

            if (addNotes && data.notes) {
                const perms: Partial<Record<string, 0 | 1 | 2 | 3>> = {};
                (<Game>game).users?.forEach((u) => {
                    return (perms[u.id] = (<Game>game).user?.id === u.id ? 3 : 2);
                });
                perms["default"] = 2;

                for (let i = 0; i < data.notes.length; i++) {
                    const note = data.notes[i];
                    note.flags[ModuleName].noteData.calendarId = calendarId;
                    note.flags[ModuleName].noteData.fromPredefined = true;
                    note.folder = NManager.noteDirectory?.id;
                    note.permission = perms;
                    await JournalEntry.create(note, { keepId: false });
                }
            }
            updated = true;
        }
        return updated;
    }
}
