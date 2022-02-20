import {ModuleName, NoteRepeat, NotesDirectoryName} from "../../constants";
import { NoteSheet } from "./note-sheet";
import {GameSettings} from "../foundry-interfacing/game-settings";
import Calendar from "../calendar";
import NoteStub from "./note-stub";


export default class NoteManager{

    private notes: Record<string, NoteStub[]> = {};

    public noteDirectory: Folder | undefined;

    public async initialize(){
        this.registerNoteSheets();
        await this.createJournalDirectory();
        this.loadNotes();
    }

    public registerNoteSheets(){
        //@ts-ignore
        Journal.registerSheet(ModuleName, NoteSheet, {
            types: ['base'],
            makeDefault: false,
            label: "Simple Calendar: Note Sheet"
        });
    }

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

    public async createNote(calendar: Calendar,  title: string){
        const dateTime = calendar.getDateTime();
        const noteData: SimpleCalendar.NoteData = {
            calendarId: calendar.id,
            startDate: dateTime,
            endDate: dateTime,
            allDay: true,
            repeats: NoteRepeat.Never,
            order: 0,
            categories: [],
            remindUsers: [],
            reminderSent: false
        };

        const perms: Partial<Record<string, 0 | 1 | 2 | 3>> = {};
        (<Game>game).users?.forEach(u => perms[u.id] = (<Game>game).user?.id === u.id? 3 : calendar.generalSettings.noteDefaultVisibility? 2 : 0);
        const newJE = await JournalEntry.create({
            name: title,
            folder: this.noteDirectory?.id,
            content: '',
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
            const sheet = new NoteSheet(newJE);
            sheet.render(true, {}, true);
        }
    }

    public loadNotes(){
        if(this.noteDirectory){
            for(let i = 0; i < this.noteDirectory.contents.length; i++){
                const je = <JournalEntry>this.noteDirectory.contents[i];
                const noteData = <SimpleCalendar.NoteData>je.getFlag(ModuleName, 'noteData');
                if(!this.notes.hasOwnProperty(noteData.calendarId)){
                    this.notes[noteData.calendarId] = [];
                }
                this.notes[noteData.calendarId].push(new NoteStub(je.id || '', je.name || ''))
            }
        }
    }

    public getNotesForDay(calendarId: string, year: number, monthIndex: number, dayIndex: number){
        const calendarNotes = this.notes[calendarId] || [];
        return calendarNotes.filter(n => n.isVisible(calendarId, year, monthIndex, dayIndex));
    }
}