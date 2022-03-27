import {ModuleName, NoteRepeat, NotesDirectoryName, SettingNames, SocketTypes} from "../../constants";
import {NoteSheet} from "./note-sheet";
import {GameSettings} from "../foundry-interfacing/game-settings";
import Calendar from "../calendar";
import NoteStub from "./note-stub";
import {CalManager, MainApplication, NManager} from "../index";
import GameSockets from "../foundry-interfacing/game-sockets";
import {Logger} from "../logging";
import {BM25Levenshtein} from "../utilities/search";


/**
 * Manages all interactions with notes within Simple Calendar
 */
export default class NoteManager{

    /**
     * A dictionary of notes organized by calendar ID
     * @private
     */
    private notes: Record<string, NoteStub[]> = {};

    /**
     * The journal folder where all notes are stored
     */
    public noteDirectory: Folder | undefined;

    /**
     * Initializes the note manager
     */
    public async initialize(){
        this.registerNoteSheets();
        await this.createJournalDirectory();
        this.loadNotes();
    }

    /**
     * Registers the Simple Calendar note sheet with foundry
     */
    public registerNoteSheets(){
        Journal.registerSheet(ModuleName, NoteSheet, {
            types: ['base'],
            makeDefault: false,
            label: "Simple Calendar: Note Sheet"
        });
    }

    /**
     * Checks to see if the journal director for SC notes exists and creates it if it does not
     */
    public async createJournalDirectory(){
        const journalDirectory = (<Game>game).journal?.directory;
        if(journalDirectory){
            this.noteDirectory = journalDirectory.folders.find(f => f.name === NotesDirectoryName);
            if(!this.noteDirectory && GameSettings.IsGm()){
                //TODO: Set the permissions on this created folder
                await Folder.create({
                    name: NotesDirectoryName,
                    type: 'JournalEntry',
                    parent: null
                });
                this.noteDirectory = journalDirectory.folders.find(f => f.name === NotesDirectoryName);
            }
        }
    }

    public async addNewNote(calendar: Calendar, title: string){
        const dateTime = calendar.getDateTime();
        const noteData: SimpleCalendar.NoteData = {
            calendarId: calendar.id,
            startDate: dateTime,
            endDate: dateTime,
            allDay: true,
            repeats: NoteRepeat.Never,
            order: 0,
            categories: [],
            remindUsers: []
        };
        await this.createNote(title, '', noteData, calendar);
    }

    public async createNote(title: string, content: string, noteData: SimpleCalendar.NoteData, calendar: Calendar, renderSheet: boolean = true, updateMain: boolean = true): Promise<StoredDocument<JournalEntry> | null>{
        const perms: Partial<Record<string, 0 | 1 | 2 | 3>> = {};
        (<Game>game).users?.forEach(u => perms[u.id] = (<Game>game).user?.id === u.id? 3 : calendar.generalSettings.noteDefaultVisibility? 2 : 0);
        const newJE = await JournalEntry.create({
            name: title,
            folder: this.noteDirectory?.id,
            content: content,
            flags: {
                core: {
                    sheetClass: `${ModuleName}.${NoteSheet.name}`
                },
                [ModuleName]: {
                    noteData: noteData
                }
            },
            permission: perms
        });
        if(newJE){
            this.addNoteStub(newJE, calendar.id);
            if(renderSheet){
                const sheet = new NoteSheet(newJE);
                sheet.render(true, {}, true);
            }
            if(updateMain){
                MainApplication.updateApp();
            }
            return newJE;
        }
        return null;
    }

    public addNoteStub(journalEntry: JournalEntry, calendarId: string){
        if(!this.notes.hasOwnProperty(calendarId)){
            this.notes[calendarId] = [];
        }
        this.notes[calendarId].push(new NoteStub(journalEntry.id || ''));
    }

    public removeNoteStub(journalEntry: JournalEntry){
        const noteData = <SimpleCalendar.NoteData>journalEntry.getFlag(ModuleName, 'noteData');
        if(noteData && this.notes.hasOwnProperty(noteData.calendarId)){
            const index = this.notes[noteData.calendarId].findIndex(n => n.entryId === journalEntry.id);
            if(index >= 0){
                this.notes[noteData.calendarId].splice(index, 1);
            }
        }
    }

    public loadNotes(){
        if(this.noteDirectory){
            this.notes = {};
            for(let i = 0; i < this.noteDirectory.contents.length; i++){
                const je = <JournalEntry>this.noteDirectory.contents[i];
                const noteData = <SimpleCalendar.NoteData>je.getFlag(ModuleName, 'noteData');
                this.addNoteStub(je, noteData.calendarId);
            }
        }
    }

    public showNote(journalId: string){
        const journalEntry = (<Game>game).journal?.get(journalId);
        if(journalEntry && journalEntry.sheet){
            if(journalEntry.sheet.rendered){
                journalEntry.sheet.bringToTop();
            } else {
                journalEntry.sheet.render(true);
            }
        }
    }

    public getNoteStub(journalEntry: JournalEntry): NoteStub | undefined{
        const noteData = <SimpleCalendar.NoteData>journalEntry.getFlag(ModuleName, 'noteData');
        if(noteData && this.notes.hasOwnProperty(noteData.calendarId)){
            return this.notes[noteData.calendarId].find(n => n.entryId === journalEntry.id);
        }
        return undefined;
    }

    public getNotes(calendarId: string){
        const calendarNotes = this.notes[calendarId] || [];
        return calendarNotes.filter(n => n.canUserView());
    }

    public getNotesForDay(calendarId: string, year: number, monthIndex: number, dayIndex: number){
        const calendarNotes: NoteStub[] = this.notes[calendarId] || [];
        const rawNotes = calendarNotes.filter(n => n.isVisible(calendarId, year, monthIndex, dayIndex));
        rawNotes.sort(NoteManager.dayNoteSort);
        return rawNotes;
    }

    public getNoteCountsForDay(calendarId: string, year: number, monthIndex: number, dayIndex: number){
        const notesForDay = NManager.getNotesForDay(calendarId, year, monthIndex, dayIndex);
        const results = {
            count: 0,
            reminderCount: 0
        };
        for(let i = 0; i < notesForDay.length; i++){
            if(notesForDay[i].userReminderRegistered){
                results.reminderCount++;
            } else {
                results.count++;
            }
        }
        return results;
    }

    public async orderNotesOnDay(calendarId: string, newOrderedIds: string[], day: SimpleCalendar.DateTime){
        const dayNotes = this.getNotesForDay(calendarId, day.year, day.month, day.day);
        for(let i = 0; i < newOrderedIds.length; i++){
            const n = dayNotes.find(n => n.entryId === newOrderedIds[i]);
            if(n){
                await n.setOrder(i);
            }
        }
        await GameSockets.emit({type: SocketTypes.mainAppUpdate, data:{}});

    }

    /**
     * Sort function for the list of notes on a day. Sorts by order, then hour then minute
     * @param {NoteStub} a The first note to compare
     * @param {NoteStub} b The second noe to compare
     * @private
     */
    private static dayNoteSort(a: NoteStub, b: NoteStub): number {
        const nda = a.noteData, ndb = b.noteData;
        if(nda && ndb){
            return nda.order - ndb.order || nda.startDate.hour - ndb.startDate.hour || nda.startDate.minute - ndb.startDate.minute;
        }
        return 0;
    }

    public checkNoteReminders(calendarId: string, initialLoad: boolean = false){
        const calendar = CalManager.getCalendar(calendarId);
        if(calendar && (!initialLoad || (initialLoad && calendar.generalSettings.postNoteRemindersOnFoundryLoad)) && this.notes[calendarId]){
            const noteList = this.notes[calendarId];
            const currentDate = calendar.getCurrentDate();
            for(let i = 0; i < noteList.length; i++){
                const note = noteList[i];
                //Current user wants to be reminded of this note and the note is visible on this day
                if(!note.reminderSent && note.userReminderRegistered && note.isVisible(calendarId, currentDate.year, currentDate.month, currentDate.day)){
                    const nd = note.noteData;
                    if(nd){
                        let sendReminder = nd.allDay;
                        //If this is an all day event
                        if(!nd.allDay){
                            const nSeconds = (nd.startDate.hour * calendar.time.minutesInHour * calendar.time.secondsInMinute) + (nd.startDate.minute * calendar.time.secondsInMinute) + nd.startDate.seconds;
                            sendReminder = currentDate.seconds >= nSeconds;
                        }
                        if(sendReminder){
                            note.reminderSent = true;
                            ChatMessage.create({
                                speaker: {alias: "Simple Calendar Reminder"},
                                whisper: [GameSettings.UserID()],
                                content: `<div class='simple-calendar ${GameSettings.GetStringSettings(SettingNames.Theme)}'><h2>${note.title}</h2><div style="display: flex;"><div class="note-category"><span class="fa fa-calendar"></span> ${note.fullDisplayDate}</div></div>${note.content}</div>`
                            }).catch(Logger.error);
                        }
                    }
                }
            }
        }
    }

    public resetNoteReminderSent(calendarId: string){
        //TODO: Look into calling this so repeating notes can be called again
        const noteList = this.notes[calendarId];
        if(noteList){
            for(let i = 0; i < noteList.length; i++){
                noteList[i].reminderSent = false;
            }
        }
    }

    public searchNotes(calendarId: string, term: string, options: SimpleCalendar.Search.OptionsFields):  NoteStub[]{
        const noteList = this.notes[calendarId];
        let results: NoteStub[] = [];
        if(noteList){
            //prepare the note list for searching
            const nl: SimpleCalendar.Search.Document[] = [];
            for(let i = 0; i < noteList.length; i++){
                if(noteList[i].canUserView()){
                    const docCont: string[] = [];
                    if(options.title){
                        docCont.push(noteList[i].title);
                    }
                    if(options.details){
                        let tmp = document.createElement("DIV");
                        tmp.innerHTML = noteList[i].content;
                        docCont.push((tmp.textContent || tmp.innerText || "").replace(/\r?\n|\r/g, ' '));
                    }
                    if(options.date){
                        docCont.push(noteList[i].fullDisplayDate);
                    }
                    if(options.author){
                        docCont.push(noteList[i].authorDisplay?.name || '');
                    }
                    if(options.categories){
                        docCont.push(noteList[i].categories.map(c => c.name).join(', '));
                    }
                    nl.push({id: noteList[i].entryId, content: docCont});
                }
            }
            const bm25 = new BM25Levenshtein(nl);
            const r = bm25.search(term);
            results = noteList.filter(ns => r.indexOf(ns.entryId) !== -1);
        }
        return results;
    }
}