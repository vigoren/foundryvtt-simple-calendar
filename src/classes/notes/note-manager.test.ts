/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/game";
import "../../../__mocks__/form-application";
import "../../../__mocks__/application";
import "../../../__mocks__/document-sheet";
import "../../../__mocks__/handlebars";
import "../../../__mocks__/event";
import "../../../__mocks__/crypto";
import "../../../__mocks__/dialog";
import "../../../__mocks__/hooks";
import "../../../__mocks__/chat-message";
import "../../../__mocks__/journal";
import "../../../__mocks__/folder";

import Calendar from "../calendar";
import {CalManager, NManager, updateCalManager, updateMainApplication, updateNManager} from "../index";
import CalendarManager from "../calendar/calendar-manager";
import MainApp from "../applications/main-app";
import NoteManager from "./note-manager";

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
});