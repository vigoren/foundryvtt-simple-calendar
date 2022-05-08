/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";

import Calendar from "../calendar";
import {CalManager, MainApplication, NManager, updateCalManager, updateMainApplication, updateNManager} from "../index";
import CalendarManager from "../calendar/calendar-manager";
import MainApp from "../applications/main-app";
import NoteManager from "./note-manager";
import GameSockets from "../foundry-interfacing/game-sockets";

describe('Note Manager Class Tests', () => {
    let tCal: Calendar;

    beforeEach(async () => {
        updateCalManager(new CalendarManager());
        updateMainApplication(new MainApp());
        updateNManager(new NoteManager());
        tCal = new Calendar('','');
        jest.spyOn(CalManager, 'getActiveCalendar').mockImplementation(() => {return tCal;});

        //@ts-ignore
        game.user.isGM = false;
    });

    test('Initialize', async () => {
        jest.spyOn(NManager, 'registerNoteSheets').mockImplementation(() => {});
        jest.spyOn(NManager, 'createJournalDirectory').mockImplementation(async () => {});
        jest.spyOn(NManager, 'loadNotes').mockImplementation(() => {});

        await NManager.initialize();

        expect(NManager.registerNoteSheets).toHaveBeenCalledTimes(1);
        expect(NManager.createJournalDirectory).toHaveBeenCalledTimes(1);
        expect(NManager.loadNotes).toHaveBeenCalledTimes(1);
    });

    test('Register Note Sheets', () => {
        NManager.registerNoteSheets();
        expect(Journal.registerSheet).toHaveBeenCalledTimes(1);
    });

    test('Create Journal Directory', async () => {
        await NManager.createJournalDirectory();
        expect(NManager.noteDirectory).toBeUndefined();

        //@ts-ignore
        game.user.isGM = true;
        await NManager.createJournalDirectory();
        expect(NManager.noteDirectory).toBeUndefined();
    });

    test('Add New Note', async () => {
        jest.spyOn(NManager, 'createNote').mockImplementation(async () => {return null;});
        jest.spyOn(tCal, 'getDateTime').mockImplementation(() => {return {year: 0, month: 0, day: 0, hour: 0, minute: 0, seconds: 0};});
        await NManager.addNewNote(tCal, '');
        expect(NManager.createNote).toHaveBeenCalledTimes(1);
        expect(tCal.getDateTime).toHaveBeenCalledTimes(1);
    });

    test('Create Note', async () => {
        const noteData = {calendarId: tCal.id, startDate:{year:0, month:0, day:0, hour:0, minute:0, seconds:0}, endDate:{year:0, month:0, day:0, hour:0, minute:0, seconds:0}, allDay:false, repeats: 0, order: 0, categories: [], remindUsers: []};

        const jec = jest.spyOn(JournalEntry, 'create').mockImplementation(async () => {return undefined;});
        jest.spyOn(MainApplication, 'updateApp').mockImplementation(() => {});

        expect(await NManager.createNote('', '', noteData, tCal, false, false)).toBeNull();
        expect(MainApplication.updateApp).not.toHaveBeenCalled();

        //@ts-ignore
        jec.mockReturnValue({});
        //@ts-ignore
        game.user.id = 'asd';
        expect(await NManager.createNote('', '', noteData, tCal)).toEqual({});

        tCal.generalSettings.noteDefaultVisibility = false;
        expect(await NManager.createNote('', '', noteData, tCal)).toEqual({});
    });

    test('Journal Entry Update', () => {
        const fEntry = {getFlag: () => {return {calendarId: 'a'}}};

        jest.spyOn(NManager, 'addNoteStub').mockImplementation(() => {});
        jest.spyOn(NManager, 'removeNoteStub').mockImplementation(() => {});
        jest.spyOn(MainApplication, 'updateApp').mockImplementation(() => {});

        //@ts-ignore
        NManager.journalEntryUpdate(0, fEntry);
        expect(NManager.addNoteStub).toHaveBeenCalledTimes(1);

        //@ts-ignore
        NManager.journalEntryUpdate(1, fEntry);
        expect(MainApplication.updateApp).toHaveBeenCalledTimes(1);

        //@ts-ignore
        NManager.journalEntryUpdate(2, fEntry);
        expect(NManager.removeNoteStub).toHaveBeenCalledTimes(1);
    });

    test('Add Note Stub', () => {
        //@ts-ignore
        expect(Object.keys(NManager.notes).length).toBe(0);
        //@ts-ignore
        NManager.addNoteStub({id: ''}, 'asd');
        //@ts-ignore
        expect(Object.keys(NManager.notes).length).toBe(1);
    });

    test('Remove Note Stub', () => {
        //@ts-ignore
        NManager.notes['asd'] = [{entryId: 'ns1'}];
        const je = {
            id: 'ns1',
            getFlag: () => {
                return {calendarId: 'asd'};
            }
        };

        //@ts-ignore
        expect(NManager.notes['asd'].length).toBe(1);
        //@ts-ignore
        NManager.removeNoteStub(je);
        //@ts-ignore
        expect(NManager.notes['asd'].length).toBe(0);
    });

    test('Load Notes', () => {
        const je = {
            id: 'ns1',
            getFlag: () => {
                return {calendarId: 'asd'};
            }
        };
        //@ts-ignore
        NManager.noteDirectory = {contents: [je]};

        jest.spyOn(NManager,'addNoteStub').mockImplementation(() => {});
        NManager.loadNotes();
        expect(NManager.addNoteStub).toHaveBeenCalledTimes(1);
    });

    test('Show Note', () => {
        const je = {
            sheet: {
                rendered: false,
                render: jest.fn(),
                bringToTop: jest.fn()
            }
        };
        //@ts-ignore
        jest.spyOn(game.journal, 'get').mockImplementation(() => {return je;});

        NManager.showNote('');
        expect(je.sheet.render).toHaveBeenCalledTimes(1);
        expect(je.sheet.bringToTop).toHaveBeenCalledTimes(0);

        je.sheet.rendered = true;
        NManager.showNote('');
        expect(je.sheet.render).toHaveBeenCalledTimes(1);
        expect(je.sheet.bringToTop).toHaveBeenCalledTimes(1);
    });

    test('Get Note Stub', () => {
        const je = {
            id: 'ns1',
            getFlag: jest.fn().mockReturnValue({calendarId: 'asd'}).mockReturnValueOnce(null)
        };
        //@ts-ignore
        NManager.notes['asd'] = [{entryId: 'ns1'}];

        //@ts-ignore
        expect(NManager.getNoteStub(je)).toBeUndefined();

        //@ts-ignore
        expect(NManager.getNoteStub(je)).toBeDefined();
    });

    test('Get Notes', () => {
        expect(NManager.getNotes('asd')).toEqual([]);

        //@ts-ignore
        NManager.notes['asd'] = [{canUserView: () => {return true;}}];
        expect(NManager.getNotes('asd').length).toBe(1);
    });

    test('Get Notes For Day', () => {
        expect(NManager.getNotesForDay('asd', 0, 0, 0)).toEqual([]);

        //@ts-ignore
        NManager.notes['asd'] = [{isVisible: () => {return true;}}];
        expect(NManager.getNotesForDay('asd', 0, 0, 0).length).toBe(1);
    });

    test('Get Note Count For Day', () => {
        expect(NManager.getNoteCountsForDay('asd', 0, 0, 0)).toEqual({count: 0, reminderCount: 0});

        //@ts-ignore
        NManager.notes['asd'] = [{userReminderRegistered: false, isVisible: () => {return true;}}, {userReminderRegistered: true, isVisible: () => {return true;}}];
        expect(NManager.getNoteCountsForDay('asd', 0, 0, 0)).toEqual({count: 1, reminderCount: 1});
    });

    test('Order Notes On Day', async () => {
        const nmgn = jest.spyOn(NManager, 'getNotesForDay').mockImplementation(() => {return [];});
        jest.spyOn(GameSockets, 'emit').mockImplementation(async () => {return true});

        await NManager.orderNotesOnDay('asd', [], {year:0,month:0,day:0,hour:0, minute:0, seconds:0});
        expect(NManager.getNotesForDay).toHaveBeenCalledTimes(1);
        expect(GameSockets.emit).toHaveBeenCalledTimes(1);

        //@ts-ignore
        nmgn.mockReturnValueOnce([{entryId:'ns1', setOrder: async () => {}},{entryId:'ns2', setOrder: async () => {}}]);
        await NManager.orderNotesOnDay('asd', ['ns2', 'ns1'], {year:0,month:0,day:0,hour:0, minute:0, seconds:0});
        expect(NManager.getNotesForDay).toHaveBeenCalledTimes(2);
        expect(GameSockets.emit).toHaveBeenCalledTimes(2);
    });

    test('Day Note Sort', () => {
        const n1 = {noteData: {order: 0, startDate: {hour:0, minute: 0}}},
            n2 = {noteData: {order: 0, startDate: {hour:0, minute: 1}}};

        //@ts-ignore
        expect(NoteManager.dayNoteSort(n1, {noteData: null})).toBe(0);
        //@ts-ignore
        expect(NoteManager.dayNoteSort(n1, n2)).toBe(-1);
    });

    test('Check Note Reminders', () => {
        jest.spyOn(CalManager, 'getCalendar').mockImplementation(() => {return tCal});
        jest.spyOn(ChatMessage, 'create').mockImplementation(async () => {return undefined});

        //@ts-ignore
        NManager.notes['asd'] = [{userReminderRegistered: false, isVisible: () => {return true;}, noteData: {allDay: true}}, {userReminderRegistered: true, isVisible: () => {return true;}, noteData: {allDay: false, startDate:{hour: 0, minute: 0, seconds: 0}}}];


        NManager.checkNoteReminders('asd');
        expect(ChatMessage.create).toHaveBeenCalledTimes(1);

        NManager.checkNoteReminders('asd', true);
        expect(ChatMessage.create).toHaveBeenCalledTimes(1);
    });

    test('Reset Note Reminder Sent', () => {
        //@ts-ignore
        NManager.notes['asd'] = [{reminderSent: true}];

        NManager.resetNoteReminderSent('asd');
        //@ts-ignore
        expect(NManager.notes['asd'][0].reminderSent).toBe(false);
    });

    test('Search Notes', () => {
        //@ts-ignore
        NManager.notes['asd'] = [{canUserView: () => {return true;}, title: 'test', content: '', fullDisplayDate: '', categories: [{name: 'c1'}]}];

        expect(NManager.searchNotes('asd', 'test', {title: true, details: true, date: true, author: true, categories: true}).length).toBe(1);
    });
});