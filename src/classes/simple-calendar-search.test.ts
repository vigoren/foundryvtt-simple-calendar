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
import SimpleCalendar from "./simple-calendar";
import SimpleCalendarSearch from "./simple-calendar-search";
import Calendar from "./calendar";
import Note from "./note";
import SpyInstance = jest.SpyInstance;
import Mock = jest.Mock;


describe('Simple Calendar Search Tests', () => {
    SimpleCalendar.instance = new SimpleCalendar();
    let renderSpy: SpyInstance;
    const cal = Calendar.LoadCalendars()[0];
    const n = new Note();
    n.title = 'Asd';
    n.content = 'QWE';
    n.year = 0;
    n.month = 1;
    n.day = 2;
    n.endDate.year = 0;
    n.endDate.month = 1;
    n.endDate.day = 2;
    cal.notes.push(n);


    beforeEach(() => {
        SimpleCalendarSearch.instance = new SimpleCalendarSearch(cal);
        //Spy on the inherited render function of the new instance
        //@ts-ignore
        renderSpy = jest.spyOn(SimpleCalendarSearch.instance, 'render');
        //Spy on console.error calls
        jest.spyOn(console, 'error').mockImplementation();

        (<Mock>console.error).mockClear();
        let spyInstance = renderSpy.mockClear();
    });



    //TODO XDY Reinstate this test
    // test('Default Options', () => {
    //     const spy = jest.spyOn(FormApplication, 'defaultOptions', 'get');
    //     const opts = SimpleCalendarSearch.defaultOptions;
    //     expect(Object.keys(opts).length).toBe(7); //Make sure no new properties have been added
    //     //@ts-ignore
    //     expect(opts.template).toBe('modules/foundryvtt-simple-calendar/templates/search.html');
    //     //@ts-ignore
    //     expect(opts.title).toBe('FSC.Search');
    //     expect(opts.classes).toStrictEqual(["form","simple-calendar"]);
    //     //@ts-ignore
    //     expect(opts.resizable).toBe(true);
    //     //@ts-ignore
    //     expect(opts.closeOnSubmit).toBe(false);
    //     //@ts-ignore
    //     expect(opts.width).toBe(500);
    //     expect(spy).toHaveBeenCalled()
    // });

    test('Get Data', () => {
        SimpleCalendarSearch.instance.results = [n];
        const data = SimpleCalendarSearch.instance.getData();
        //@ts-ignore
        expect(data.isGM).toBe(false);
        //@ts-ignore
        expect(data.searchTerm).toBe('');
        //@ts-ignore
        expect(data.results.length).toBe(1);
    });

    test('Activate Listeners', () => {
        const fakeQuery = {
            find: jest.fn().mockReturnValue({on: jest.fn(), outerHeight: jest.fn(), outerWidth: jest.fn()})
        };
        //@ts-ignore
        SimpleCalendarSearch.instance.activateListeners(fakeQuery);
        expect(fakeQuery.find).toHaveBeenCalledTimes(2);
    });

    test('Update Object', async () => {
        const event = new Event('click');
        const formData: any = {content: 'asd'};
        //@ts-ignore
        await expect(SimpleCalendarSearch.instance._updateObject(event, formData)).resolves.toBe(false);
    });

    test('Show App', () => {
        SimpleCalendarSearch.instance.showApp();
        expect(renderSpy).toHaveBeenCalled();
    });

    test('Search', () => {
        //@ts-ignore
        const orig = SimpleCalendarSearch.instance.element;
        //@ts-ignore
        SimpleCalendarSearch.instance.element = {
            find: jest.fn().mockReturnValue({val: jest.fn().mockReturnValueOnce('').mockReturnValueOnce('asd')})
        };
        SimpleCalendarSearch.instance.search();
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect(SimpleCalendarSearch.instance.results.length).toBe(0);

        SimpleCalendarSearch.instance.search();
        expect(renderSpy).toHaveBeenCalledTimes(2);
        expect(SimpleCalendarSearch.instance.results.length).toBe(1);

        //@ts-ignore
        SimpleCalendarSearch.instance.element = orig;
    });

    test('View Note', () => {
        const event = new Event('click');
        const note = new Note();
        note.id = "123";
        SimpleCalendarSearch.instance.results.push(note);

        //No Data attribute
        SimpleCalendarSearch.instance.viewNote(event);
        expect(console.error).toHaveBeenCalledTimes(1);

        //Invalid data attribute
        const target = document.createElement('a');
        (<HTMLElement>target).setAttribute('data-index', '0');
        //@ts-ignore
        event.currentTarget = target;
        SimpleCalendarSearch.instance.viewNote(event);
        expect(console.error).toHaveBeenCalledTimes(1);

        //Valid data attribute
        (<HTMLElement>target).setAttribute('data-index', '123');
        //@ts-ignore
        event.currentTarget = target;
        SimpleCalendarSearch.instance.viewNote(event);

    });
});
