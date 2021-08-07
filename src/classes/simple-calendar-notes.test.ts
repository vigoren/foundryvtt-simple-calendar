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
import "../../__mocks__/merge-object";
import "../../__mocks__/text-editor";
import {SimpleCalendarNotes} from "./simple-calendar-notes";
import {Note} from "./note";
import SpyInstance = jest.SpyInstance;
import Mock = jest.Mock;
import SimpleCalendar from "./simple-calendar";
import Year from "./year";
import Month from "./month";
import {Weekday} from "./weekday";
import {SCDateSelector} from "../interfaces";

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
        note.author = '1';
        note.playerVisible = false;
        note.endDate.year = 0;
        note.endDate.month = 1;
        note.endDate.day = 2;

        SimpleCalendarNotes.instance = new SimpleCalendarNotes(note);

        //Spy on console.error calls
        jest.spyOn(console, 'error').mockImplementation();
        //Spy on the inherited render function of the new instance
        //@ts-ignore
        renderSpy = jest.spyOn(SimpleCalendarNotes.instance, 'render');
        (<Mock>console.error).mockClear();
        renderSpy.mockClear();
        (<Mock>(<Game>game).settings.get).mockClear();
        (<Mock>(<Game>game).settings.set).mockClear();
    });

    test('Properties', () => {
        expect(Object.keys(SimpleCalendarNotes.instance).length).toBe(12); //Make sure no new properties have been added
        expect(SimpleCalendarNotes.instance.updateNote).toBe(false);
        expect(SimpleCalendarNotes.instance.viewMode).toBe(false);
        expect(SimpleCalendarNotes.instance.hasBeenResized).toBe(false);
        expect(SimpleCalendarNotes.instance.dateSelectorId).toBeDefined();
        expect(SimpleCalendarNotes.instance.dateSelector).toBeDefined();
        expect(SimpleCalendarNotes.instance.object).toStrictEqual(note);
    });

    test('Default Options', () => {
        const spy = jest.spyOn(FormApplication, 'defaultOptions', 'get');
        const opts = SimpleCalendarNotes.defaultOptions;
        expect(Object.keys(opts).length).toBe(6); //Make sure no new properties have been added
        //@ts-ignore
        expect(opts.template).toBe('modules/foundryvtt-simple-calendar/templates/calendar-notes.html');
        //@ts-ignore
        expect(opts.title).toBe('FSC.Notes.DialogTitle');
        expect(opts.classes).toStrictEqual(["form","simple-calendar-note"]);
        //@ts-ignore
        expect(opts.resizable).toBe(true);
        //@ts-ignore
        expect(opts.closeOnSubmit).toBe(false);
        //@ts-ignore
        expect(opts.width).toBe(500);
        expect(spy).toHaveBeenCalled()
    });

    test('Check for Third Party Markdown Editors', () => {
        expect(SimpleCalendarNotes.instance.checkForThirdPartyMarkdownEditors()).toBe(false);
        const orig = (<Game>game).modules.get;
        (<Game>game).modules.get = jest.fn().mockReturnValue({active: true});
        expect(SimpleCalendarNotes.instance.checkForThirdPartyMarkdownEditors()).toBe(true);
        (<Game>game).modules.get = orig;
    });

    test('Get Data', () => {
        SimpleCalendar.instance = new SimpleCalendar();
        SimpleCalendar.instance.noteCategories.push({name: 'a', color: 'a', textColor: 'a'});
        SimpleCalendar.instance.noteCategories.push({name: 'b', color: 'b', textColor: 'b'});
        (<Note>SimpleCalendarNotes.instance.object).categories.push('a');

        let data = SimpleCalendarNotes.instance.getData();
        //@ts-ignore
        expect(data.isGM).toBe(false);
        //@ts-ignore
        expect(data.viewMode).toBe(false);
        //@ts-ignore
        expect(data.canEdit).toBe(false);
        //@ts-ignore
        expect(data.enableRichTextEditButton).toBe(false);
        //@ts-ignore
        expect(data.displayDate).toBe('');
        //@ts-ignore
        expect(data.repeats).toBe(0);
        //@ts-ignore
        expect(data.repeatsText).toBe(' ');
        //@ts-ignore
        expect(data.authDisplay).toStrictEqual({ name: '', color: '', textColor: '' });
        //@ts-ignore
        expect(data.dateSelectorId).toBeDefined();
        //@ts-ignore
        expect(data.categories).toStrictEqual([{"color": "a", "name": "a", "textColor": "a"}]);
        //@ts-ignore
        expect(data.allCategories).toStrictEqual([{"color": "a", "name": "a", "selected": true, "textColor": "a"}, {"color": "b", "name": "b", "selected": false, "textColor": "b"}]);

        SimpleCalendar.instance.currentYear = new Year(0);
        SimpleCalendar.instance.currentYear.months.push(new Month('M1', 1, 0, 30));
        SimpleCalendar.instance.currentYear.months.push(new Month('M2', 2, 0, 30));
        SimpleCalendar.instance.currentYear.weekdays.push(new Weekday(1, 'W1'));
        SimpleCalendar.instance.currentYear.weekdays.push(new Weekday(2, 'W2'));
        SimpleCalendar.instance.currentYear.months[0].current = true;
        SimpleCalendar.instance.currentYear.months[0].days[0].current = true;
        (<Note>SimpleCalendarNotes.instance.object).repeats = 12;
        data = SimpleCalendarNotes.instance.getData();
        //@ts-ignore
        expect(data.repeatsText).toBe('');

        (<Note>SimpleCalendarNotes.instance.object).endDate.year = 1;
        (<Note>SimpleCalendarNotes.instance.object).endDate.month = 2;
        data = SimpleCalendarNotes.instance.getData();
        //@ts-ignore
        expect(data.repeatOptions).toStrictEqual({"0": "FSC.Notes.Repeat.Never"});

        (<Note>SimpleCalendarNotes.instance.object).endDate.year = 0;
        (<Note>SimpleCalendarNotes.instance.object).endDate.month = 2;
        (<Note>SimpleCalendarNotes.instance.object).endDate.day = 2;
        data = SimpleCalendarNotes.instance.getData();
        //@ts-ignore
        expect(data.repeatOptions).toStrictEqual({0: 'FSC.Notes.Repeat.Never', 3: 'FSC.Notes.Repeat.Yearly'});

        (<Note>SimpleCalendarNotes.instance.object).endDate.year = 0;
        (<Note>SimpleCalendarNotes.instance.object).endDate.month = 1;
        (<Note>SimpleCalendarNotes.instance.object).endDate.day = 5;
        data = SimpleCalendarNotes.instance.getData();
        //@ts-ignore
        expect(data.repeatOptions).toStrictEqual({0: 'FSC.Notes.Repeat.Never', 2: 'FSC.Notes.Repeat.Monthly', 3: 'FSC.Notes.Repeat.Yearly'});

        //@ts-ignore
        (<Mock>game.users.get).mockReturnValueOnce({data:{}});
        data = SimpleCalendarNotes.instance.getData();
        //@ts-ignore
        expect(data.authDisplay.name).toBe('');

        //@ts-ignore
        (<Mock>game.users.get).mockReturnValueOnce({name:"asd", data:{color:"asd"}});
        data = SimpleCalendarNotes.instance.getData();
        //@ts-ignore
        expect(data.authDisplay.name).toBe('asd');

        const tusers = (<Game>game).users;
        (<Game>game).users = undefined;
        data = SimpleCalendarNotes.instance.getData();
        //@ts-ignore
        expect(data.authDisplay.name).toBe('');

        (<Game>game).users = tusers;

    });

    test('On Resize',() => {
        expect(SimpleCalendarNotes.instance.hasBeenResized).toBe(false);
        //@ts-ignore
        SimpleCalendarNotes.instance._onResize(new Event('click'));
        expect(SimpleCalendarNotes.instance.hasBeenResized).toBe(true);
    });

    test('Set Width Height', () => {
        //@ts-ignore
        const orig = SimpleCalendarNotes.instance.setPosition;
        //@ts-ignore
        SimpleCalendarNotes.instance.setPosition = jest.fn();

        const fakeQuery = {
            find: jest.fn().mockReturnValue({outerHeight: jest.fn().mockReturnValue(false), outerWidth: jest.fn().mockReturnValue(false)})
        };

        SimpleCalendarNotes.instance.hasBeenResized = true;
        //@ts-ignore
        SimpleCalendarNotes.instance.setWidthHeight(fakeQuery);
        //@ts-ignore
        expect(SimpleCalendarNotes.instance.setPosition).not.toHaveBeenCalled();


        SimpleCalendarNotes.instance.hasBeenResized = false;
        //@ts-ignore
        SimpleCalendarNotes.instance.setWidthHeight(fakeQuery);
        expect(fakeQuery.find).toHaveBeenCalledTimes(1);
        //@ts-ignore
        expect(SimpleCalendarNotes.instance.setPosition).toHaveBeenCalledTimes(1);

        fakeQuery.find.mockReturnValueOnce(false);
        //@ts-ignore
        SimpleCalendarNotes.instance.setWidthHeight(fakeQuery);
        expect(fakeQuery.find).toHaveBeenCalledTimes(2);
        //@ts-ignore
        expect(SimpleCalendarNotes.instance.setPosition).toHaveBeenCalledTimes(2);

        fakeQuery.find.mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(441), outerWidth: jest.fn().mockReturnValue(441)});
        //@ts-ignore
        SimpleCalendarNotes.instance.setWidthHeight(fakeQuery);
        expect(fakeQuery.find).toHaveBeenCalledTimes(3);
        //@ts-ignore
        expect(SimpleCalendarNotes.instance.setPosition).toHaveBeenCalledTimes(3);

        fakeQuery.find.mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(441), outerWidth: jest.fn().mockReturnValue(2000)});
        //@ts-ignore
        SimpleCalendarNotes.instance.setWidthHeight(fakeQuery);

        //@ts-ignore;
        SimpleCalendarNotes.instance.setPosition = orig;
    });

    test('Activate Listeners', () => {
         const fakeQuery = {
            find: jest.fn().mockReturnValue({on: jest.fn(), outerHeight: jest.fn(), outerWidth: jest.fn()})
        };
        //@ts-ignore
        SimpleCalendarNotes.instance.activateListeners(fakeQuery);
        expect(fakeQuery.find).toHaveBeenCalledTimes(1);
        //@ts-ignore
        fakeQuery.length = 1;
        //@ts-ignore
        const el = SimpleCalendarNotes.instance.element;
        //@ts-ignore
        SimpleCalendarNotes.instance.element = {
            find: jest.fn().mockReturnValue({on: jest.fn()})
        }
        //@ts-ignore
        SimpleCalendarNotes.instance.activateListeners(fakeQuery);
        //@ts-ignore
        expect(SimpleCalendarNotes.instance.element.find).toHaveBeenCalledTimes(6);

        SimpleCalendarNotes.instance.dateSelector = null;
        //@ts-ignore
        SimpleCalendarNotes.instance.activateListeners(fakeQuery);

        //@ts-ignore
        SimpleCalendarNotes.instance.element = el;
    });

    test('Focus Title Input', () => {
        //@ts-ignore
        const el = SimpleCalendarNotes.instance.element;
        const focusFun = jest.fn();
        //@ts-ignore
        SimpleCalendarNotes.instance.element = {
            find: jest.fn().mockReturnValue({focus: focusFun})
        }
        SimpleCalendarNotes.instance.focusTitleInput();
        expect(focusFun).toHaveBeenCalled();

        //@ts-ignore
        SimpleCalendarNotes.instance.element = el;
    });

    test('Input Change', () => {
        const event = new Event('change');
        (<HTMLElement>event.currentTarget).id = '';
        (<HTMLInputElement>event.currentTarget).name = '';
        (<HTMLInputElement>event.currentTarget).value = '';
        (<HTMLInputElement>event.currentTarget).checked = true;

        SimpleCalendarNotes.instance.inputChanged(event);
        expect(renderSpy).toHaveBeenCalledTimes(1);

        (<HTMLElement>event.currentTarget).id = 'scNoteTitle';
        (<HTMLInputElement>event.currentTarget).value = 'qwe';
        SimpleCalendarNotes.instance.inputChanged(event);
        expect(renderSpy).toHaveBeenCalledTimes(2);
        expect((<Note>SimpleCalendarNotes.instance.object).title).toBe('qwe');

        (<HTMLElement>event.currentTarget).id = 'scNoteRepeats';
        (<HTMLInputElement>event.currentTarget).value = 'a';
        SimpleCalendarNotes.instance.inputChanged(event);
        expect(renderSpy).toHaveBeenCalledTimes(3);
        expect((<Note>SimpleCalendarNotes.instance.object).repeats).toBe(0);
        (<HTMLInputElement>event.currentTarget).value = '1';
        SimpleCalendarNotes.instance.inputChanged(event);
        expect(renderSpy).toHaveBeenCalledTimes(4);
        expect((<Note>SimpleCalendarNotes.instance.object).repeats).toBe(1);

        (<HTMLElement>event.currentTarget).id = 'scNoteVisibility';
        SimpleCalendarNotes.instance.inputChanged(event);
        expect(renderSpy).toHaveBeenCalledTimes(5);
        expect((<Note>SimpleCalendarNotes.instance.object).playerVisible ).toBe(true);

        (<HTMLElement>event.currentTarget).id = 'scNoteDateAllDay';
        SimpleCalendarNotes.instance.inputChanged(event);
        expect(renderSpy).toHaveBeenCalledTimes(6);
        expect((<Note>SimpleCalendarNotes.instance.object).allDay ).toBe(false);

        (<HTMLElement>event.currentTarget).id = 'scNotReal';
        SimpleCalendarNotes.instance.inputChanged(event);
        expect(renderSpy).toHaveBeenCalledTimes(7);

        (<HTMLElement>event.currentTarget).id = '-scNotReal';
        SimpleCalendarNotes.instance.inputChanged(event);
        expect(renderSpy).toHaveBeenCalledTimes(8);

        (<HTMLInputElement>event.currentTarget).name = 'scNoteCategories';
        (<HTMLInputElement>event.currentTarget).value = 'a';
        (<HTMLInputElement>event.currentTarget).checked = true;
        SimpleCalendar.instance = new SimpleCalendar();
        SimpleCalendar.instance.noteCategories.push({name: 'a', color: 'a', textColor: 'a'});
        SimpleCalendar.instance.noteCategories.push({name: 'b', color: 'b', textColor: 'b'});
        SimpleCalendarNotes.instance.inputChanged(event);
        expect(renderSpy).toHaveBeenCalledTimes(9);
        expect((<Note>SimpleCalendarNotes.instance.object).categories ).toStrictEqual(['a']);
        (<HTMLInputElement>event.currentTarget).checked = false;
        SimpleCalendarNotes.instance.inputChanged(event);
        expect(renderSpy).toHaveBeenCalledTimes(10);
        expect((<Note>SimpleCalendarNotes.instance.object).categories ).toStrictEqual([]);

        (<HTMLInputElement>event.currentTarget).name = 'scNotReal';
        SimpleCalendarNotes.instance.inputChanged(event);
        expect(renderSpy).toHaveBeenCalledTimes(11);
    });

    test('Reminder Click', () => {
        const e = new Event('click');
        SimpleCalendarNotes.instance.reminderChange(e);
        expect(renderSpy).toHaveBeenCalledTimes(1);

        //@ts-ignore
        game.user.id = 'asd';
        SimpleCalendarNotes.instance.reminderChange(e);
        expect(renderSpy).toHaveBeenCalledTimes(2);
        expect(note.remindUsers).toStrictEqual(['asd']);

        SimpleCalendarNotes.instance.reminderChange(e);
        expect(renderSpy).toHaveBeenCalledTimes(3);
        expect(note.remindUsers).toStrictEqual([]);


        SimpleCalendarNotes.instance.viewMode = true;
        (<Mock>(<Game>game).settings.get).mockReturnValueOnce([new Note(), note]);
        SimpleCalendarNotes.instance.reminderChange(e);
        expect(renderSpy).toHaveBeenCalledTimes(4);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(1);

        //@ts-ignore
        game.user.id = '';
    });

    test('Date Selector Click', () => {
        const selectedDate: SCDateSelector.SelectedDate = {
            startDate: {year: 0, month: 1, day: 1, hour: 0, minute: 0, allDay: true},
            endDate: {year: 0, month: 1, day: 1, hour: 0, minute: 0, allDay: true},
            visibleDate: {year: 0, month: 1, day: 1, hour: 0, minute: 0, allDay: true}
        };

        SimpleCalendarNotes.instance.dateSelectorClick(selectedDate);
        expect(renderSpy).toHaveBeenCalledTimes(1);

        SimpleCalendar.instance = new SimpleCalendar();
        SimpleCalendar.instance.currentYear = new Year(0);
        SimpleCalendarNotes.instance.dateSelectorClick(selectedDate);
        expect(renderSpy).toHaveBeenCalledTimes(2);
        expect((<Note>SimpleCalendarNotes.instance.object).monthDisplay).toBe("");

        SimpleCalendar.instance.currentYear.months.push(new Month("M1", 1, 0, 30));
        SimpleCalendarNotes.instance.dateSelectorClick(selectedDate);
        expect(renderSpy).toHaveBeenCalledTimes(3);
        expect((<Note>SimpleCalendarNotes.instance.object).monthDisplay).toBe("M1");
    });

    test('Update Object', async () => {
        const event = new Event('click');
        const formData: any = {content: 'asd'};
        //@ts-ignore
        await expect(SimpleCalendarNotes.instance._updateObject(event, formData)).resolves.toBe(false);
        //@ts-ignore
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
        //@ts-ignore
        game.user.isGM = true;
        SimpleCalendarNotes.instance.deleteConfirm();
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(1);
        expect((<Game>game).settings.set).not.toHaveBeenCalled();

        //@ts-ignore
        SimpleCalendarNotes.instance.object.id = "abc123";
        SimpleCalendarNotes.instance.deleteConfirm();
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(2);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(1);

    });

    test('Save Button Click', () => {
        const event = new Event('click');
        SimpleCalendarNotes.instance.saveButtonClick(event);
        //@ts-ignore
        expect(ui.notifications.error).toHaveBeenCalledTimes(1);

        //@ts-ignore
        SimpleCalendarNotes.instance.editors['content'] = {mce: {getContent: ()=>{return '';},isNotDirty: false}};
        (<Note>SimpleCalendarNotes.instance.object).title = 'Title';
        SimpleCalendarNotes.instance.saveButtonClick(event);
        //@ts-ignore
        expect(ui.notifications.error).toHaveBeenCalledTimes(1);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(1);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(1);

        //@ts-ignore
        SimpleCalendarNotes.instance.editors['content'].mce = {getContent: ()=>{return 'a';},isNotDirty: false};
        SimpleCalendarNotes.instance.updateNote = true;
        SimpleCalendarNotes.instance.saveButtonClick(event);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(2);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(2);

        //@ts-ignore
        SimpleCalendarNotes.instance.object.id = "abc123";
        SimpleCalendarNotes.instance.saveButtonClick(event);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(3);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(3);
    });

});
