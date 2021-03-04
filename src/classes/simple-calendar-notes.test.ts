/**
 * @jest-environment jsdom
 */
import "../../__mocks__/game";
import "../../__mocks__/form-application";
import "../../__mocks__/application";
import "../../__mocks__/handlebars";
import "../../__mocks__/event";
import "../../__mocks__/crypto";
import "../../__mocks__/dialog";
import {SimpleCalendarNotes} from "./simple-calendar-notes";
import {Note} from "./note";
import SpyInstance = jest.SpyInstance;
import Mock = jest.Mock;
import {NoteRepeat} from "../constants";
import SimpleCalendar from "./simple-calendar";
import Year from "./year";
import Month from "./month";

describe('Simple Calendar Notes Tests', () => {
    let renderSpy: SpyInstance;
    let note: Note;
    beforeEach(() => {
        note = new Note();
        note.year = 0;
        note.month = 1;
        note.day = 2;
        note.monthDisplay = '';
        note.title = '';
        note.content = '';
        note.author = '';
        note.playerVisible = false;

        SimpleCalendarNotes.instance = new SimpleCalendarNotes(note);

        //Spy on console.error calls
        jest.spyOn(console, 'error').mockImplementation();
        //Spy on the inherited render function of the new instance
        renderSpy = jest.spyOn(SimpleCalendarNotes.instance, 'render');
        (<Mock>console.error).mockClear();
        renderSpy.mockClear();
        (<Mock>game.settings.get).mockClear();
        (<Mock>game.settings.set).mockClear();
    });

    test('Properties', () => {
        expect(Object.keys(SimpleCalendarNotes.instance).length).toBe(9); //Make sure no new properties have been added
        expect(SimpleCalendarNotes.instance.updateNote).toBe(false);
        expect(SimpleCalendarNotes.instance.viewMode).toBe(false);
        expect(SimpleCalendarNotes.instance.richEditorSaved).toBe(false);
        expect(SimpleCalendarNotes.instance.object).toStrictEqual(note);
        expect(SimpleCalendarNotes.instance.editors).toBeDefined();
    });

    test('Default Options', () => {
        const spy = jest.spyOn(FormApplication, 'defaultOptions', 'get');
        const opts = SimpleCalendarNotes.defaultOptions;
        expect(Object.keys(opts).length).toBe(6); //Make sure no new properties have been added
        expect(opts.template).toBe('modules/foundryvtt-simple-calendar/templates/calendar-notes.html');
        expect(opts.title).toBe('FSC.Notes.DialogTitle');
        expect(opts.classes).toStrictEqual(["form","simple-calendar"]);
        expect(opts.resizable).toBe(true);
        //@ts-ignore
        expect(opts.closeOnSubmit).toBe(false);
        //@ts-ignore
        expect(opts.width).toBe(500);
        expect(spy).toHaveBeenCalled()
    });

    test('Get Data', () => {
        let data = SimpleCalendarNotes.instance.getData();
        expect(data.viewMode).toBe(false);
        expect(data.richButton).toBe(true);
        expect(data.canEdit).toBe(false);
        expect(data.noteYear).toBe(0);
        expect(data.noteMonth).toBe('');

        SimpleCalendar.instance = new SimpleCalendar();
        SimpleCalendarNotes.instance.object.repeats = NoteRepeat.Yearly;
        data = SimpleCalendarNotes.instance.getData();
        expect(data.noteYear).toBeUndefined()
        expect(data.noteMonth).toBe('');

        SimpleCalendarNotes.instance.object.repeats = NoteRepeat.Monthly;
        data = SimpleCalendarNotes.instance.getData();
        expect(data.noteYear).toBeUndefined();
        expect(data.noteMonth).toBeUndefined();

        SimpleCalendar.instance.currentYear = new Year(1);
        data = SimpleCalendarNotes.instance.getData();
        expect(data.noteYear).toBe(1);
        expect(data.noteMonth).toBeUndefined();
        SimpleCalendar.instance.currentYear.months.push(new Month('Name', 1));
        SimpleCalendar.instance.currentYear.months[0].visible = true;
        data = SimpleCalendarNotes.instance.getData();
        expect(data.noteYear).toBe(1);
        expect(data.noteMonth).toBe('Name');
    });

    test('Set Up Text Editor', () => {
        const onFunc = jest.fn();
        const button = document.createElement('a');
        button.classList.add('editor-edit');
        const fakeQuery = {
            find: jest.fn()
                .mockReturnValueOnce({0:{nextElementSibling: false}})
                .mockReturnValue({
                    on: onFunc,
                    0: {
                        nextElementSibling: button
                    }
                })
        };

        // Initial setup where everything is valid
        //@ts-ignore
        SimpleCalendarNotes.instance.setUpTextEditor(fakeQuery);
        expect(SimpleCalendarNotes.instance.editors['content'].options.target).toBeDefined();
        expect(SimpleCalendarNotes.instance.editors['content'].button).toBe(false);
        expect(SimpleCalendarNotes.instance.editors['content'].hasButton).toBe(false);
        expect(SimpleCalendarNotes.instance.editors['content'].active).toBe(true);

        SimpleCalendarNotes.instance.editors['content'].button = null;
        //@ts-ignore
        SimpleCalendarNotes.instance.setUpTextEditor(fakeQuery);
        expect(SimpleCalendarNotes.instance.editors['content'].options.target).toBeDefined();
        expect(SimpleCalendarNotes.instance.editors['content'].button).toBeDefined()
        expect(SimpleCalendarNotes.instance.editors['content'].hasButton).toBe(true);
        expect(SimpleCalendarNotes.instance.editors['content'].active).toBe(true);

        SimpleCalendarNotes.instance.editors['content'].mce = {};
        //@ts-ignore
        SimpleCalendarNotes.instance.setUpTextEditor(fakeQuery);

        SimpleCalendarNotes.instance.viewMode = true;
        SimpleCalendarNotes.instance.editors['content'].button = null;
        //@ts-ignore
        SimpleCalendarNotes.instance.setUpTextEditor(fakeQuery);
        expect(SimpleCalendarNotes.instance.editors['content'].options.target).toBeDefined();
        expect(SimpleCalendarNotes.instance.editors['content'].button).toBeDefined()
        expect(SimpleCalendarNotes.instance.editors['content'].hasButton).toBe(true);
        expect(SimpleCalendarNotes.instance.editors['content'].active).toBe(true);
    });

    test('Text Editor Button Click', () => {
        SimpleCalendarNotes.instance.editors['content'].button = document.createElement('a');
        SimpleCalendarNotes.instance.textEditorButtonClick(new Event('click'));
        expect(SimpleCalendarNotes.instance.editors['content'].button.style.display).toBe('none');
        expect(SimpleCalendarNotes.instance.richEditorSaved).toBe(false);
    });

    test('Activate Listeners', () => {
        const onFunc = jest.fn();

        const fakeQuery = {
            find: jest.fn().mockReturnValue({on: onFunc, 0: { nextElementSibling: document.createElement('a') }})
        };
        //@ts-ignore
        SimpleCalendarNotes.instance.activateListeners(fakeQuery);
        expect(fakeQuery.find).toHaveBeenCalledTimes(0);
        expect(onFunc).toHaveBeenCalledTimes(0);
        //@ts-ignore
        fakeQuery.length = 1;
        //@ts-ignore
        SimpleCalendarNotes.instance.activateListeners(fakeQuery);
        expect(fakeQuery.find).toHaveBeenCalledTimes(4);
        expect(onFunc).toHaveBeenCalledTimes(3);
    });

    test('Update Object', async () => {
        const event = new Event('click');
        const formData: any = {content: 'asd'};
        //@ts-ignore
        await expect(SimpleCalendarNotes.instance._updateObject(event, formData)).resolves.toBe(false);
        expect(SimpleCalendarNotes.instance.richEditorSaved).toBe(true);
        expect(SimpleCalendarNotes.instance.object.content).toBe('asd');
    });

    test('Show App', () => {
        SimpleCalendarNotes.instance.showApp();
        expect(renderSpy).toHaveBeenCalled();
    });

    test('Close App', () => {
        jest.spyOn(SimpleCalendarNotes.instance, 'close').mockImplementation(() => {return Promise.resolve();});
        SimpleCalendarNotes.instance.closeApp();
        expect(SimpleCalendarNotes.instance.close).toHaveBeenCalled();
        (<Mock>SimpleCalendarNotes.instance.close).mockResolvedValueOnce(Promise.reject("a"));
        SimpleCalendarNotes.instance.closeApp();
        //expect(console.error).toHaveBeenCalledTimes(1);
    });

    test('Update App', () => {
        expect(renderSpy).not.toHaveBeenCalled();
        SimpleCalendarNotes.instance.updateApp();
        expect(renderSpy).toHaveBeenCalled();
    });

    test('Edit Button Click', () => {
        const event = new Event('click');
        expect(SimpleCalendarNotes.instance.viewMode).toBe(false);
        expect(SimpleCalendarNotes.instance.updateNote).toBe(false);
        SimpleCalendarNotes.instance.editButtonClick(event);
        expect(SimpleCalendarNotes.instance.viewMode).toBe(false);
        expect(SimpleCalendarNotes.instance.updateNote).toBe(true);
        expect(renderSpy).toHaveBeenCalled();
    });

    test('Delete Button Click', () => {
        SimpleCalendarNotes.instance.deleteButtonClick(new Event('click'));
        //@ts-ignore
        expect(DialogRenderer).toHaveBeenCalled();
    });

    test('Delete Confirm', () => {
        SimpleCalendarNotes.instance.deleteConfirm();
        expect(game.settings.get).toHaveBeenCalledTimes(1);
        expect(game.settings.set).not.toHaveBeenCalled();

        SimpleCalendarNotes.instance.object.id = "abc123";
        SimpleCalendarNotes.instance.deleteConfirm();
        expect(game.settings.get).toHaveBeenCalledTimes(2);
        expect(game.settings.set).toHaveBeenCalledTimes(1);

    });

    test('Save Button Click', () => {
        const event = new Event('click');
        SimpleCalendarNotes.instance.saveButtonClick(event);
        expect(ui.notifications.warn).toHaveBeenCalledTimes(1);

        SimpleCalendarNotes.instance.editors['content'].mce = {getContent: ()=>{return 'a';},isNotDirty: false};
        SimpleCalendarNotes.instance.saveButtonClick(event);
        expect(ui.notifications.warn).toHaveBeenCalledTimes(2);

        //@ts-ignore
        SimpleCalendarNotes.instance.element = {
            find: jest.fn()
                .mockReturnValueOnce({ val: () => {return '';} })
                .mockReturnValueOnce({ is: () => {return false;} })
                .mockReturnValueOnce({ find: () => {return {val: () => {return false;}}} })
                .mockReturnValueOnce({ val: () => {return 'Title';} })
                .mockReturnValueOnce({ is: () => {return true;} })
                .mockReturnValueOnce({ find: () => {return {val: () => {return '0';}}} })
                .mockReturnValueOnce({ val: () => {return 'Title';} })
                .mockReturnValueOnce({ is: () => {return true;} })
                .mockReturnValueOnce({ find: () => {return {val: () => {return '0';}}} })
                .mockReturnValueOnce({ val: () => {return 'Title';} })
                .mockReturnValueOnce({ is: () => {return true;} })
                .mockReturnValueOnce({ find: () => {return {val: () => {return '0';}}} })
        };
        SimpleCalendarNotes.instance.editors['content'].mce = {getContent: ()=>{return '';},isNotDirty: false};
        SimpleCalendarNotes.instance.richEditorSaved = true;
        SimpleCalendarNotes.instance.saveButtonClick(event);
        expect(ui.notifications.error).toHaveBeenCalledTimes(1);

        SimpleCalendarNotes.instance.saveButtonClick(event);
        expect(SimpleCalendarNotes.instance.object.title).toBe('Title');
        expect(SimpleCalendarNotes.instance.object.playerVisible).toBe(true);
        expect(game.settings.get).toHaveBeenCalledTimes(1);
        expect(game.settings.set).toHaveBeenCalledTimes(1);

        SimpleCalendarNotes.instance.updateNote = true;
        SimpleCalendarNotes.instance.saveButtonClick(event);
        expect(game.settings.get).toHaveBeenCalledTimes(2);
        expect(game.settings.set).toHaveBeenCalledTimes(2);

        SimpleCalendarNotes.instance.object.id = "abc123";
        SimpleCalendarNotes.instance.saveButtonClick(event);
        expect(game.settings.get).toHaveBeenCalledTimes(3);
        expect(game.settings.set).toHaveBeenCalledTimes(3);
    });

});
