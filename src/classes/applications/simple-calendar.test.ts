/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/game";
import "../../../__mocks__/form-application";
import "../../__mocks__/application";
import "../../__mocks__/handlebars";
import "../../__mocks__/event";
import "../../../__mocks__/crypto";
import "../../__mocks__/dialog";
import "../../__mocks__/hooks";
import "../../__mocks__/chat-message";


import MainApp from "./main-app";
import {ConfigurationApp} from "./configuration-app";
import Year from "../calendar/year";
import Month from "../calendar/month";
import {Weekday} from "../calendar/weekday";
import PredefinedCalendar from "../configuration/predefined-calendar";
import Note from "../note";
import {SimpleCalendarSocket} from "../../interfaces";
import {
    GameWorldTimeIntegrations,
    NoteRepeat,
    PredefinedCalendars,
    SimpleCalendarHooks,
    SocketTypes,
    TimeKeeperStatus
} from "../../constants";
import Mock = jest.Mock;
import SpyInstance = jest.SpyInstance;
import SimpleCalendarSearch from "./simple-calendar-search";

//jest.mock('./importer');

describe('Simple Calendar Class Tests', () => {
    let y: Year;
    let renderSpy: SpyInstance;
    MainApp.instance = new MainApp();

    beforeEach(()=>{
        //Spy on console.error calls
        jest.spyOn(console, 'error').mockImplementation();
        //Set up a new Simple Calendar instance
        MainApp.instance = new MainApp();
        //Spy on the inherited render function of the new instance
        renderSpy = jest.spyOn(MainApp.instance, 'render');
        //Clear all mock calls
        (<Mock>console.error).mockClear();
        renderSpy.mockClear();
        (<Mock>(<Game>game).settings.get).mockClear();
        (<Mock>(<Game>game).settings.set).mockClear();
        (<Mock>(<Game>game).socket?.emit).mockClear();
        //@ts-ignore
        (<Mock>ui.notifications.warn).mockClear();

        y = new Year(0);
        y.selectedYear = 0;
        y.visibleYear = 0;
        y.months.push(new Month('M', 1, 0, 5));
        y.months.push(new Month('T', 2, 0, 15));
        y.months[0].current = true;
        y.months[0].selected = true;
        y.months[0].visible = true;
        y.months[0].days[0].current = true;
        y.months[0].days[0].selected = true;
    });
    afterEach(() => {
        //@ts-ignore
        y = null;
    });

    test('Properties', () => {
        expect(Object.keys(MainApp.instance).length).toBe(10); //Make sure no new properties have been added
    });

    test('Default Options', () => {
        const spy = jest.spyOn(Application, 'defaultOptions', 'get');
        const opts = MainApp.defaultOptions;
        expect(Object.keys(opts).length).toBe(4); //Make sure no new properties have been added
        expect(opts.template).toBe('modules/foundryvtt-simple-calendar/templates/main.html');
        expect(opts.title).toBe('FSC.Title');
        expect(opts.classes).toStrictEqual(["simple-calendar"]);
        expect(opts.resizable).toBe(true);
        expect(spy).toHaveBeenCalled()
    });

    test('Init', async () => {
        await MainApp.instance.init();
        expect(Handlebars.registerHelper).toHaveBeenCalledTimes(3);
        expect((<Game>game).settings.register).toHaveBeenCalledTimes(13);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(11);
        expect(MainApp.instance.activeCalendar.year?.numericRepresentation).toBe(0);
        expect(MainApp.instance.activeCalendar.year?.months.length).toBe(1);
        expect(MainApp.instance.activeCalendar.year?.months[0].days.length).toBe(2);
        expect(MainApp.instance.activeCalendar.year?.getMonth()?.numericRepresentation).toBe(1);
        expect(MainApp.instance.activeCalendar.year?.getMonth()?.getDay()?.numericRepresentation).toBe(2);

        //Testing the functions within the handlebar helpers
        // @ts-ignore
        game.user.isGM = true;
        await MainApp.instance.init();
        expect(Handlebars.registerHelper).toHaveBeenCalledTimes(6);
        // @ts-ignore
        //expect(Main.instance.primaryCheckTimeout).toBeDefined();
        //expect(game.socket.emit).toHaveBeenCalledTimes(2);
        // @ts-ignore
        game.user.isGM = false;
    });

    test('Initialize Sockets', () => {
        MainApp.instance.initializeSockets();
        // @ts-ignore
        expect(MainApp.instance.primaryCheckTimeout).toBeUndefined();
        expect((<Game>game).socket?.emit).toHaveBeenCalledTimes(1);
        // @ts-ignore
        game.user.isGM = true;
        MainApp.instance.activeCalendar.year = y;
        MainApp.instance.initializeSockets();
        // @ts-ignore
        expect(MainApp.instance.primaryCheckTimeout).toBeDefined();
        expect((<Game>game).socket?.emit).toHaveBeenCalledTimes(3);
        // @ts-ignore
        game.user.isGM = false;
    });

    test('Primary Check Timeout Call', async () => {
        MainApp.instance.activeCalendar.year = y;
        y.time.unifyGameAndClockPause = false;
        await MainApp.instance.primaryCheckTimeoutCall();
        expect(MainApp.instance.primary).toBe(true);
        expect((<Game>game).socket?.emit).toHaveBeenCalledTimes(2);

        y.time.unifyGameAndClockPause = true;
        await MainApp.instance.primaryCheckTimeoutCall();
        expect(MainApp.instance.primary).toBe(true);
        expect((<Game>game).socket?.emit).toHaveBeenCalledTimes(4);
    });

    test('Process Socket', async () => {
        const d: SimpleCalendarSocket.Data = {
            type: SocketTypes.clock,
            data: TimeKeeperStatus.Stopped
        };
        //@ts-ignore
        MainApp.instance.element = {
            find: jest.fn().mockReturnValue({
                removeClass: jest.fn().mockReturnValue({addClass: jest.fn()}),
                text: jest.fn()
            })
        }
        await MainApp.instance.processSocket(d);
        expect(renderSpy).toHaveBeenCalledTimes(0);

        MainApp.instance.activeCalendar.year = y;
        const orig = MainApp.instance.element;

        await MainApp.instance.processSocket(d);
        expect(renderSpy).toHaveBeenCalledTimes(0);
        //@ts-ignore
        MainApp.instance.element = orig;

        d.type = SocketTypes.checkClockRunning;
        d.data = {};
        await MainApp.instance.processSocket(d);
        expect((<Game>game).socket?.emit).toHaveBeenCalledTimes(0);

        // @ts-ignore
        game.user.isGM = true;
        MainApp.instance.primary = true;
        await MainApp.instance.processSocket(d);
        expect((<Game>game).socket?.emit).toHaveBeenCalledTimes(1);

        // @ts-ignore
        game.user.isGM = false;
        MainApp.instance.primary = false;


        d.type = SocketTypes.journal;
        d.data = {notes: []};
        await MainApp.instance.processSocket(d);
        expect(renderSpy).toHaveBeenCalledTimes(0);

        // @ts-ignore
        game.user.isGM = true;
        MainApp.instance.primary = true;
        await MainApp.instance.processSocket(d);
        expect(renderSpy).toHaveBeenCalledTimes(0);

        d.type = SocketTypes.primary;
        d.data = {
            primaryCheck: true
        };
        await MainApp.instance.processSocket(d);
        expect(renderSpy).toHaveBeenCalledTimes(0);
        expect((<Game>game).socket?.emit).toHaveBeenCalledTimes(2);
        d.data = {
            amPrimary: true
        };
        await MainApp.instance.processSocket(d);
        expect(MainApp.instance.primary).toBe(false);
        d.data = {
            amPrimary: false
        };
        MainApp.instance.primary = true;
        await MainApp.instance.processSocket(d);
        expect(MainApp.instance.primary).toBe(true);

        d.data = {};
        await MainApp.instance.processSocket(d);
        expect(MainApp.instance.primary).toBe(true);

        // @ts-ignore
        game.user.isGM = false;
        await MainApp.instance.processSocket(d);
        expect(MainApp.instance.primary).toBe(true);


        d.type = SocketTypes.dateTimeChange;
        // @ts-ignore
        game.user.isGM = false;
        MainApp.instance.primary = false;
        await MainApp.instance.processSocket(d);

        // @ts-ignore
        game.user.isGM = true;
        MainApp.instance.primary = true;
        MainApp.instance.activeCalendar.year = y;
        await MainApp.instance.processSocket(d);



        d.data = {
            dataType: ' asd',
            isNext: true,
            amount: 0,
            unit: ''
        };
        await MainApp.instance.processSocket(d);

        d.data.dataType = 'year';
        await MainApp.instance.processSocket(d);
        d.data.isNext = false;
        await MainApp.instance.processSocket(d);
        d.data.dataType = 'month';
        await MainApp.instance.processSocket(d);
        d.data.isNext = true;
        await MainApp.instance.processSocket(d);
        d.data.dataType = 'day';
        await MainApp.instance.processSocket(d);
        d.data.isNext = false;
        await MainApp.instance.processSocket(d);
        d.data.dataType = 'time';
        d.data.amount = NaN;
        await MainApp.instance.processSocket(d);
        d.data.amount = 1;
        await MainApp.instance.processSocket(d);

        d.type = SocketTypes.date;
        // @ts-ignore
        game.user.isGM = false;
        MainApp.instance.primary = false;
        await MainApp.instance.processSocket(d);
        // @ts-ignore
        game.user.isGM = true;
        MainApp.instance.primary = true;
        MainApp.instance.activeCalendar.year = y;
        await MainApp.instance.processSocket(d);

        d.data = {
            year: 1,
            month: 1,
            day: 0
        };
        await MainApp.instance.processSocket(d);

        d.data.day = 1;
        await MainApp.instance.processSocket(d);

        // @ts-ignore
        game.user.isGM = false;
        //@ts-ignore
        d.type = 'asd';
        await MainApp.instance.processSocket(d);
        expect(renderSpy).toHaveBeenCalledTimes(0);

        d.type = SocketTypes.noteUpdate;
        await MainApp.instance.processSocket(d);
        expect(renderSpy).toHaveBeenCalledTimes(0);

        d.type = SocketTypes.emitHook;
        d.data = {hook: SimpleCalendarHooks.DateTimeChange};
        await MainApp.instance.processSocket(d);
        expect(Hooks.callAll).toHaveBeenCalledTimes(17);
        d.data = {};
        await MainApp.instance.processSocket(d);
        expect(Hooks.callAll).toHaveBeenCalledTimes(17);
    });

    test('Get Data', async () => {
        let data = await MainApp.instance.getData();
        expect(data).toBeDefined();
        MainApp.instance.activeCalendar.year = y;
        MainApp.instance.activeCalendar.notes.push(new Note());
        MainApp.instance.activeCalendar.notes[0].playerVisible = true;
        MainApp.instance.activeCalendar.notes[0].year = 0;
        MainApp.instance.activeCalendar.notes[0].month = 1;
        MainApp.instance.activeCalendar.notes[0].day = 1;
        MainApp.instance.activeCalendar.notes[0].endDate = {year: 0, month: 1, day: 1, hour: 0, minute: 0, seconds: 0};
        //Nothing Undefined
        data = await MainApp.instance.getData();
        expect(data).toBeDefined();

        // @ts-ignore
        game.user.isGM = true;
        y.months[0].days[0].current = false;
        data = await MainApp.instance.getData();
        expect(data).toBeDefined();

        y.months[0].selected = false;
        data = await MainApp.instance.getData();
        expect(data).toBeDefined();

        // @ts-ignore
        game.user.isGM = false;
    });

    test('Get Header Buttons', () => {
        //@ts-ignore
        let r = MainApp.instance._getHeaderButtons();
        expect(r.length).toBe(1);
        expect(r[0].label).toBe('FSC.Compact');

        MainApp.instance.compactView = true;
        //@ts-ignore
        r = MainApp.instance._getHeaderButtons();
        expect(r.length).toBe(1);
        expect(r[0].label).toBe('FSC.Full');
    });

    test('Show App', () => {
        // @ts-ignore
        game.user.isGM = false;
        MainApp.instance.activeCalendar.generalSettings.permissions.viewCalendar.player = false;
        MainApp.instance.activeCalendar.generalSettings.permissions.viewCalendar.trustedPlayer = false;
        MainApp.instance.activeCalendar.generalSettings.permissions.viewCalendar.assistantGameMaster = false;
        MainApp.instance.showApp();
        expect(renderSpy).not.toHaveBeenCalled();
        // @ts-ignore
        game.user.isGM = true;
        MainApp.instance.activeCalendar.year = y;
        MainApp.instance.showApp();
        expect(renderSpy).toHaveBeenCalled();
        MainApp.instance.activeCalendar.generalSettings.permissions.viewCalendar.player = true;
        MainApp.instance.activeCalendar.generalSettings.permissions.viewCalendar.trustedPlayer = true;
        MainApp.instance.activeCalendar.generalSettings.permissions.viewCalendar.assistantGameMaster = true;
        // @ts-ignore
        game.user.isGM = false;
    });

    test('Close App', () => {
        jest.spyOn(MainApp.instance, 'close').mockImplementation(() => {return Promise.resolve();});
        MainApp.instance.closeApp();
        expect(MainApp.instance.close).toHaveBeenCalled();
        (<Mock>MainApp.instance.close).mockResolvedValueOnce(Promise.reject("a"));
        MainApp.instance.closeApp();
        //expect(console.error).toHaveBeenCalledTimes(1);
    });

    test('Minimize', async () => {
        await MainApp.instance.minimize();
        expect(MainApp.instance.compactViewShowNotes).toBe(false);
        expect(MainApp.instance.compactView).toBe(true);
        expect(renderSpy).toHaveBeenCalledTimes(1);

        MainApp.instance.activeCalendar.year = y;
        await MainApp.instance.minimize();
        expect(MainApp.instance.compactView).toBe(false);
        expect(renderSpy).toHaveBeenCalledTimes(2);
    });

    test('Maximize', async () => {
        await MainApp.instance.maximize();
        expect(MainApp.instance.compactView).toBe(false);
        expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    test('On Resize', () => {
        expect(MainApp.instance.hasBeenResized).toBe(false);
        //@ts-ignore
        MainApp.instance._onResize(new Event('click'));
        expect(MainApp.instance.hasBeenResized).toBe(true);
    });

    test('Set Width Height', () => {
        const setPosSpy = jest.spyOn(MainApp.instance, 'setPosition');
        const fakeQuery = {
            find: jest.fn().mockReturnValue(false)
        };
        const origElementFind = MainApp.instance.element.find;
        MainApp.instance.element.find = jest.fn().mockReturnValue(false);
        //@ts-ignore
        MainApp.instance.setWidthHeight(fakeQuery);
        expect(setPosSpy).toHaveBeenCalledTimes(1);

        fakeQuery.find = jest.fn()
            .mockReturnValueOnce({outerHeight: jest.fn(), outerWidth: jest.fn()})
            .mockReturnValueOnce({outerHeight: jest.fn(), outerWidth: jest.fn()})
            .mockReturnValueOnce({outerHeight: jest.fn(), outerWidth: jest.fn()})
            .mockReturnValueOnce({outerHeight: jest.fn(), outerWidth: jest.fn()});

        MainApp.instance.element.find = jest.fn().mockReturnValue({
            height: jest.fn().mockReturnValue(1),
            width: jest.fn().mockReturnValue(1),
            outerHeight: jest.fn().mockReturnValue(2),
            outerWidth: jest.fn().mockReturnValue(2),
        })
        //@ts-ignore
        MainApp.instance.setWidthHeight(fakeQuery);
        expect(setPosSpy).toHaveBeenCalledTimes(2);

        fakeQuery.find = jest.fn()
            .mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(250), outerWidth: jest.fn().mockReturnValue(250)})
            .mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(300), outerWidth: jest.fn().mockReturnValue(250)})
            .mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(250), outerWidth: jest.fn().mockReturnValue(300)})
            .mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(25), outerWidth: jest.fn().mockReturnValue(250)});
        MainApp.instance.element.find = origElementFind;
        //@ts-ignore
        MainApp.instance.setWidthHeight(fakeQuery);
        expect(setPosSpy).toHaveBeenCalledTimes(3);

        MainApp.instance.hasBeenResized = true;
        //@ts-ignore
        MainApp.instance.setWidthHeight(fakeQuery);
        expect(setPosSpy).toHaveBeenCalledTimes(3);

        MainApp.instance.hasBeenResized = false;
        MainApp.instance.compactView = true;
        fakeQuery.find = jest.fn().mockReturnValue(false);
        //@ts-ignore
        MainApp.instance.setWidthHeight(fakeQuery);
        expect(setPosSpy).toHaveBeenCalledTimes(4);

        MainApp.instance.activeCalendar.year = y;
        y.weekdays.push(new Weekday(1, "Sunday"));
        y.weekdays.push(new Weekday(2, "Tue"));
        y.months.push(new Month('MOn', 3, 0, 12))

        fakeQuery.find = jest.fn()
            .mockReturnValueOnce({outerHeight: jest.fn(), outerWidth: jest.fn()})
            .mockReturnValueOnce({outerHeight: jest.fn(), outerWidth: jest.fn()})
            .mockReturnValueOnce({outerHeight: jest.fn(), outerWidth: jest.fn()})
            .mockReturnValueOnce({outerHeight: jest.fn(), outerWidth: jest.fn()})
            .mockReturnValueOnce({outerHeight: jest.fn(), outerWidth: jest.fn()});

        //@ts-ignore
        MainApp.instance.setWidthHeight(fakeQuery);
        expect(setPosSpy).toHaveBeenCalledTimes(5);

        fakeQuery.find = jest.fn()
            .mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(250), outerWidth: jest.fn().mockReturnValue(250)})
            .mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(300), outerWidth: jest.fn().mockReturnValue(250)})
            .mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(250), outerWidth: jest.fn().mockReturnValue(300)})
            .mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(25), outerWidth: jest.fn().mockReturnValue(250)})
            .mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(25), outerWidth: jest.fn().mockReturnValue(250)});

        //@ts-ignore
        MainApp.instance.setWidthHeight(fakeQuery);
        expect(setPosSpy).toHaveBeenCalledTimes(6);

        MainApp.instance.activeCalendar.year.showWeekdayHeadings = false;

        fakeQuery.find = jest.fn()
            .mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(250), outerWidth: jest.fn().mockReturnValue(250)})
            .mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(300), outerWidth: jest.fn().mockReturnValue(1)})
            .mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(250), outerWidth: jest.fn().mockReturnValue(300)})
            .mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(25), outerWidth: jest.fn().mockReturnValue(250)})
            .mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(25), outerWidth: jest.fn().mockReturnValue(250)});
        //@ts-ignore
        MainApp.instance.setWidthHeight(fakeQuery);
        expect(setPosSpy).toHaveBeenCalledTimes(7);
    });

    test('Ensure Current Date Is Visible', () => {
        const fakeQuery = {
            find: jest.fn().mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(false)}).mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(200)})
        };

        //@ts-ignore
        MainApp.instance.ensureCurrentDateIsVisible(fakeQuery);
        expect(fakeQuery.find).toHaveBeenCalledTimes(1);

        //@ts-ignore
        MainApp.instance.ensureCurrentDateIsVisible(fakeQuery);
        expect(fakeQuery.find).toHaveBeenCalledTimes(2);

        fakeQuery.find = jest.fn()
            .mockReturnValue({
                outerHeight: jest.fn().mockReturnValue(550),
                0: {
                    getBoundingClientRect: jest.fn().mockReturnValue({top: 0, left: 0, bottom: 1000, right: 1000}),
                    scrollTop: 0
                },
                find: jest.fn()
                    .mockReturnValueOnce({length:0}).mockReturnValueOnce({length:0})
                    .mockReturnValueOnce({length:0}).mockReturnValueOnce({length:1, 0: { getBoundingClientRect: jest.fn().mockReturnValue({top: 0, left: 0, bottom: 200, right: 200}) }})
                    .mockReturnValueOnce({length:1, 0: { getBoundingClientRect: jest.fn().mockReturnValue({top: -50, left: 0, bottom: 200, right: 200}) }}).mockReturnValueOnce({length:0})
            })

        //@ts-ignore
        MainApp.instance.ensureCurrentDateIsVisible(fakeQuery);
        expect(fakeQuery.find).toHaveBeenCalledTimes(1);

        //@ts-ignore
        MainApp.instance.ensureCurrentDateIsVisible(fakeQuery);
        expect(fakeQuery.find).toHaveBeenCalledTimes(2);

        //@ts-ignore
        MainApp.instance.ensureCurrentDateIsVisible(fakeQuery);
        expect(fakeQuery.find).toHaveBeenCalledTimes(3);
    });

    test('Activate Listeners', () => {
        const elm1 = document.createElement('a');
        elm1.classList.add('fa-chevron-left');
        const elm2 = document.createElement('a');
        elm2.classList.add('fa-chevron-right');
        const onFunc = jest.fn();

        const fakeQuery = {
            find: jest.fn()
                .mockReturnValueOnce({outerHeight: jest.fn(), outerWidth: jest.fn()})
                .mockReturnValueOnce({outerHeight: jest.fn(), outerWidth: jest.fn()})
                .mockReturnValueOnce({outerHeight: jest.fn(), outerWidth: jest.fn()})
                .mockReturnValueOnce({outerHeight: jest.fn(), outerWidth: jest.fn()})
                .mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(false)})
                .mockReturnValueOnce([elm1, elm2, document.createElement('a')])
                .mockReturnValue({on: onFunc})
        };
        //@ts-ignore
        MainApp.instance.activateListeners(fakeQuery);
        expect(fakeQuery.find).toHaveBeenCalledTimes(0);
        expect(onFunc).toHaveBeenCalledTimes(0);
        //@ts-ignore
        fakeQuery.length = 1;
        //@ts-ignore
        MainApp.instance.activateListeners(fakeQuery);
        expect(fakeQuery.find).toHaveBeenCalledTimes(20);
        expect(onFunc).toHaveBeenCalledTimes(14);

        fakeQuery.find = jest.fn()
            .mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(250), outerWidth: jest.fn().mockReturnValue(250)})
            .mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(25), outerWidth: jest.fn().mockReturnValue(250)})
            .mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(250), outerWidth: jest.fn().mockReturnValue(250)})
            .mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(25), outerWidth: jest.fn().mockReturnValue(250)})
            .mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(false)})
            .mockReturnValueOnce([elm1, elm2, document.createElement('a')])
            .mockReturnValue({on: onFunc});

        //@ts-ignore
        MainApp.instance.activateListeners(fakeQuery);
        expect(fakeQuery.find).toHaveBeenCalledTimes(20);
        expect(onFunc).toHaveBeenCalledTimes(28);

        MainApp.instance.compactView = true;
        fakeQuery.find = jest.fn()
            .mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(250), outerWidth: jest.fn().mockReturnValue(250)})
            .mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(300), outerWidth: jest.fn().mockReturnValue(1)})
            .mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(250), outerWidth: jest.fn().mockReturnValue(300)})
            .mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(25), outerWidth: jest.fn().mockReturnValue(250)})
            .mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(25), outerWidth: jest.fn().mockReturnValue(250)})
            .mockReturnValue({on: onFunc});
        //@ts-ignore
        MainApp.instance.activateListeners(fakeQuery);
        expect(fakeQuery.find).toHaveBeenCalledTimes(12);
        expect(onFunc).toHaveBeenCalledTimes(35);
    });

    test('Show Compact Notes', () => {
        MainApp.instance.showCompactNotes(new Event('click'));
        expect(MainApp.instance.compactViewShowNotes).toBe(true);
        expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    test('View Previous Month', () => {
        MainApp.instance.activeCalendar.year = y;
        MainApp.instance.viewPreviousMonth(new Event('click'));
        expect(renderSpy).toHaveBeenCalled();
    });

    test('View Next Month', () => {
        MainApp.instance.activeCalendar.year = y;
        MainApp.instance.viewNextMonth(new Event('click'));
        expect(renderSpy).toHaveBeenCalled();
    });

    test('Day Click', () => {
        const event = new Event('click');
        MainApp.instance.activeCalendar.year = y;
        //const eventSpy = jest.spyOn(Event, 'target')
        MainApp.instance.dayClick(event);
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(renderSpy).not.toHaveBeenCalled();
        (<HTMLElement>event.target).setAttribute('data-day', '-1');
        MainApp.instance.dayClick(event);
        expect(console.error).toHaveBeenCalledTimes(2);
        expect(renderSpy).not.toHaveBeenCalled();
        (<HTMLElement>event.target).setAttribute('data-day', '2');
        MainApp.instance.dayClick(event);
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect(MainApp.instance.activeCalendar.year.months[0].days[1].selected).toBe(true);

        MainApp.instance.activeCalendar.year.months[0].selected = false;
        (<HTMLElement>event.target).setAttribute('data-day', '1');
        MainApp.instance.dayClick(event);
        expect(renderSpy).toHaveBeenCalledTimes(2);
        expect(MainApp.instance.activeCalendar.year.months[0].days[1].selected).toBe(false);
        expect(MainApp.instance.activeCalendar.year.months[0].days[0].selected).toBe(true);

        MainApp.instance.activeCalendar.year.months[0].selected = false;
        (<HTMLElement>event.target).setAttribute('data-day', '3');
        MainApp.instance.activeCalendar.year.months[0].days[0].selected = false;
        MainApp.instance.activeCalendar.year.months[0].days = [MainApp.instance.activeCalendar.year.months[0].days[0],MainApp.instance.activeCalendar.year.months[0].days[1]];
        MainApp.instance.dayClick(event);
        expect(renderSpy).toHaveBeenCalledTimes(3);
        expect(MainApp.instance.activeCalendar.year.months[0].days[1].selected).toBe(false);
        expect(MainApp.instance.activeCalendar.year.months[0].days[0].selected).toBe(false);

        MainApp.instance.activeCalendar.year.months[0].visible = false;
        MainApp.instance.dayClick(event);
        expect(renderSpy).toHaveBeenCalledTimes(4);

        (<HTMLElement>event.target).classList.add('selected');
        MainApp.instance.dayClick(event);
        expect(renderSpy).toHaveBeenCalledTimes(5);


        (<HTMLElement>event.target).classList.remove('selected');
        const originalTarget = (<HTMLElement>event.target);
        const noteTarget = document.createElement('span');
        noteTarget.classList.add('note-count');
        originalTarget.appendChild(noteTarget);
        (<HTMLElement>event.target) = noteTarget;
        MainApp.instance.dayClick(event);
        expect(renderSpy).toHaveBeenCalledTimes(6);

        const moonTarget = document.createElement('span');
        moonTarget.classList.add('moon-phase');
        const moonContainer = document.createElement('div');
        moonContainer.appendChild(moonTarget);
        originalTarget.appendChild(moonContainer);
        (<HTMLElement>event.target) = moonTarget;
        MainApp.instance.dayClick(event);
        expect(renderSpy).toHaveBeenCalledTimes(7);

        const invalidTarget = document.createElement('span');
        originalTarget.appendChild(invalidTarget);
        (<HTMLElement>event.target) = invalidTarget;
        MainApp.instance.dayClick(event);
        expect(renderSpy).toHaveBeenCalledTimes(7);
    });

    test('Today Click', () => {
        const event = new Event('click');
        MainApp.instance.activeCalendar.year = y;
        MainApp.instance.activeCalendar.year.months[0].current = false;
        MainApp.instance.activeCalendar.year.months[0].visible = false;
        MainApp.instance.activeCalendar.year.months[0].selected = false;
        MainApp.instance.activeCalendar.year.months[0].days[0].current = false;
        MainApp.instance.activeCalendar.year.months[0].days[0].selected = false;
        MainApp.instance.todayClick(event);
        expect(renderSpy).not.toHaveBeenCalled();
        MainApp.instance.activeCalendar.year.months[0].current = true;
        MainApp.instance.todayClick(event);
        expect(renderSpy).not.toHaveBeenCalled();
        MainApp.instance.activeCalendar.year.months[0].days[0].current = true;
        MainApp.instance.activeCalendar.year.months[0].days[1].selected = true;
        MainApp.instance.todayClick(event);
        expect(renderSpy).toHaveBeenCalled();
        expect(MainApp.instance.activeCalendar.year.months[0].visible).toBe(true);
        expect(MainApp.instance.activeCalendar.year.months[0].selected).toBe(true);
        expect(MainApp.instance.activeCalendar.year.months[0].days[0].selected).toBe(true);

        MainApp.instance.activeCalendar.year.months[0].visible = false;
        MainApp.instance.activeCalendar.year.months[0].selected = false;
        MainApp.instance.activeCalendar.year.months[1].visible = true;
        MainApp.instance.activeCalendar.year.months[1].selected = true;
        MainApp.instance.activeCalendar.year.months[0].days[0].selected = false;
        MainApp.instance.activeCalendar.year.months[1].days[0].selected = false;
        MainApp.instance.todayClick(event);
        expect(renderSpy).toHaveBeenCalled();
        expect(MainApp.instance.activeCalendar.year.months[0].visible).toBe(true);
        expect(MainApp.instance.activeCalendar.year.months[0].selected).toBe(true);
        expect(MainApp.instance.activeCalendar.year.months[0].days[0].selected).toBe(true);

        MainApp.instance.activeCalendar.year.months[0].visible = false;
        MainApp.instance.activeCalendar.year.months[0].selected = false;
        MainApp.instance.activeCalendar.year.months[1].visible = true;
        MainApp.instance.activeCalendar.year.months[1].selected = true;
        MainApp.instance.activeCalendar.year.months[0].days[0].selected = false;
        MainApp.instance.activeCalendar.year.months[1].days[0].selected = true;
        MainApp.instance.todayClick(event);
        expect(renderSpy).toHaveBeenCalled();
        expect(MainApp.instance.activeCalendar.year.months[0].visible).toBe(true);
        expect(MainApp.instance.activeCalendar.year.months[0].selected).toBe(true);
        expect(MainApp.instance.activeCalendar.year.months[0].days[0].selected).toBe(true);
    });

    test('Compact Time Control Click', () => {
        let e = new Event('click');
        //No Current Year
        MainApp.instance.timeUnitClick(e);
        expect(y.time.seconds).toBe(0);

        //No Attributes
        MainApp.instance.activeCalendar.year = y;
        MainApp.instance.timeUnitClick(e);
        expect(y.time.seconds).toBe(0);

        //Garbage Attributes
        (<HTMLElement>e.currentTarget).setAttribute('data-type', 'asd');
        (<HTMLElement>e.currentTarget).setAttribute('data-amount', 'asd');
        MainApp.instance.timeUnitClick(e);
        expect(y.time.seconds).toBe(0);

        //Bad Type, Valid amount
        (<HTMLElement>e.currentTarget).setAttribute('data-amount', '1');
        MainApp.instance.timeUnitClick(e);
        expect(y.time.seconds).toBe(0);

        //Valid Type and amount not GM
        (<HTMLElement>e.currentTarget).setAttribute('data-type', 'second');
        MainApp.instance.timeUnitClick(e);
        expect(y.time.seconds).toBe(0);

        //@ts-ignore
        const orig = game.users.find;
        (<Game>game).users = undefined;
        MainApp.instance.timeUnitClick(e);
        expect((<Game>game).socket?.emit).not.toHaveBeenCalled();

        //@ts-ignore
        (<Game>game).users = {find: jest.fn((v)=>{
                //@ts-ignore
                return v.call(undefined, {isGM: true, active: true});
            })};
        MainApp.instance.timeUnitClick(e);
        expect((<Game>game).socket?.emit).toHaveBeenCalled();
        //@ts-ignore
        game.users.find = orig;

        //Valid Type and amount GM
        //@ts-ignore
        game.user.isGM = true;
        MainApp.instance.primary = true;
        (<HTMLElement>e.currentTarget).setAttribute('data-type', 'second');
        MainApp.instance.timeUnitClick(e);
        expect(y.time.seconds).toBe(1);

        (<HTMLElement>e.currentTarget).setAttribute('data-type', 'minute');
        MainApp.instance.timeUnitClick(e);
        expect(y.time.seconds).toBe(61);

        (<HTMLElement>e.currentTarget).setAttribute('data-type', 'hour');
        MainApp.instance.timeUnitClick(e);
        expect(y.time.seconds).toBe(3661);

        (<HTMLElement>e.currentTarget).setAttribute('data-type', 'asd');
        MainApp.instance.timeUnitClick(e);
        expect(y.time.seconds).toBe(3661);

        (<HTMLElement>e.currentTarget).setAttribute('data-type', 'midnight');
        (<HTMLElement>e.currentTarget).setAttribute('data-amount', '');
        MainApp.instance.timeUnitClick(e);
        expect(y.time.seconds).toBe(0);

        //@ts-ignore
        game.user.isGM = false;
    });

    test('Time Unit Click', () => {
        let e = new Event('click');
        (<HTMLElement>e.currentTarget).setAttribute('data-type', 'second');
        MainApp.instance.activeCalendar.year = y;
        MainApp.instance.timeUnitClick(e);
        expect(renderSpy).toHaveBeenCalledTimes(1);

        (<HTMLElement>e.currentTarget).removeAttribute('data-type');
        MainApp.instance.timeUnitClick(e);
        expect(renderSpy).toHaveBeenCalledTimes(2);
    });

    test('GM Control Click', () => {
        const event = new Event('click');
        MainApp.instance.gmControlClick(event);
        expect(renderSpy).not.toHaveBeenCalled();
        MainApp.instance.activeCalendar.year = y;
        MainApp.instance.primary = true;
        // @ts-ignore
        game.user.isGM = true;
        //Test Each with current year set to null
        (<HTMLElement>event.currentTarget).setAttribute('data-type', 'day');
        MainApp.instance.gmControlClick(event);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(1);

        (<HTMLElement>event.currentTarget).setAttribute('data-type', 'month');
        MainApp.instance.gmControlClick(event);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(2);

        (<HTMLElement>event.currentTarget).setAttribute('data-type', 'year');
        MainApp.instance.gmControlClick(event);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(3);

        //Test with current year set
        MainApp.instance.activeCalendar.year = y;
        (<HTMLElement>event.currentTarget).classList.remove('next');
        (<HTMLElement>event.currentTarget).setAttribute('data-type', 'day');
        MainApp.instance.gmControlClick(event);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(4);

        (<HTMLElement>event.currentTarget).setAttribute('data-type', 'month');
        MainApp.instance.gmControlClick(event);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(5);
        (<HTMLElement>event.currentTarget).classList.add('next');
        MainApp.instance.gmControlClick(event);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(6);
        (<HTMLElement>event.currentTarget).classList.remove('next');

        (<HTMLElement>event.currentTarget).setAttribute('data-type', 'year');
        MainApp.instance.gmControlClick(event);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(7);

        (<HTMLElement>event.currentTarget).classList.add('next');
        MainApp.instance.gmControlClick(event);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(8);

        (<HTMLElement>event.currentTarget).setAttribute('data-type', 'time');
        MainApp.instance.gmControlClick(event);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(8);

        (<HTMLElement>event.currentTarget).setAttribute('data-amount', 'asd');
        MainApp.instance.gmControlClick(event);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(8);

        (<HTMLElement>event.currentTarget).setAttribute('data-amount', '1');
        MainApp.instance.gmControlClick(event);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(9);

        (<HTMLElement>event.currentTarget).classList.remove('next');
        MainApp.instance.timeUnits.second = false;
        MainApp.instance.timeUnits.minute = true;
        MainApp.instance.gmControlClick(event);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(10);

        MainApp.instance.timeUnits.second = false;
        MainApp.instance.timeUnits.minute = false;
        MainApp.instance.timeUnits.hour = true;
        MainApp.instance.gmControlClick(event);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(11);


        (<HTMLElement>event.currentTarget).setAttribute('data-type', 'dawn');
        MainApp.instance.gmControlClick(event);
        expect(y.time.seconds).toBe(0);

        // @ts-ignore
        game.user.isGM = false;
        (<HTMLElement>event.currentTarget).setAttribute('data-type', 'time');
        MainApp.instance.gmControlClick(event);
        expect(ui.notifications?.warn).toHaveBeenCalled();

        //@ts-ignore
        const orig = game.users.find;

        (<Game>game).users = undefined;
        MainApp.instance.gmControlClick(event);
        expect((<Game>game).socket?.emit).not.toHaveBeenCalled();

        //@ts-ignore
        (<Game>game).users = {find: jest.fn((v)=>{
                //@ts-ignore
                return v.call(undefined, {isGM: true, active: true});
            })};
        MainApp.instance.gmControlClick(event);
        expect((<Game>game).socket?.emit).toHaveBeenCalled();

        MainApp.instance.timeUnits.second = false;
        MainApp.instance.timeUnits.minute = true;
        MainApp.instance.timeUnits.hour = false;
        (<HTMLElement>event.currentTarget).setAttribute('data-amount', '');
        MainApp.instance.gmControlClick(event);
        expect((<Game>game).socket?.emit).toHaveBeenCalled();

        MainApp.instance.timeUnits.second = true;
        MainApp.instance.timeUnits.minute = false;
        MainApp.instance.timeUnits.hour = false;
        (<HTMLElement>event.currentTarget).setAttribute('data-type', 'asd');
        MainApp.instance.gmControlClick(event);
        expect((<Game>game).socket?.emit).toHaveBeenCalled();

        //@ts-ignore
        game.users.find = orig;
    });

    test('Time of Day Control Click', () => {
        MainApp.instance.timeOfDayControlClick('asd');
        expect(y.time.seconds).toBe(0);

        PredefinedCalendar.setToPredefined(y, PredefinedCalendars.Gregorian);
        MainApp.instance.activeCalendar.year = y;
        MainApp.instance.timeOfDayControlClick('asd');
        expect(y.time.seconds).toBe(0);

        MainApp.instance.timeOfDayControlClick('dawn');
        expect(y.time.seconds).toBe(21600);
        y.time.seconds = 22000;
        MainApp.instance.timeOfDayControlClick('dawn');
        expect(y.time.seconds).toBe(21600);

        MainApp.instance.timeOfDayControlClick('midday');
        expect(y.time.seconds).toBe(43200);
        y.time.seconds = 44000;
        MainApp.instance.timeOfDayControlClick('midday');
        expect(y.time.seconds).toBe(43200);

        MainApp.instance.timeOfDayControlClick('dusk');
        expect(y.time.seconds).toBe(64800);
        y.time.seconds = 65000;
        MainApp.instance.timeOfDayControlClick('dusk');
        expect(y.time.seconds).toBe(64800);

        MainApp.instance.timeOfDayControlClick('midnight');
        expect(y.time.seconds).toBe(0);

        y.resetMonths();
        y.months[0].current = true;
        MainApp.instance.timeOfDayControlClick('dawn');
        expect(y.time.seconds).toBe(0);
        MainApp.instance.timeOfDayControlClick('dusk');
        expect(y.time.seconds).toBe(0);

        y.resetMonths();
        MainApp.instance.timeOfDayControlClick('dawn');
        expect(y.time.seconds).toBe(0);
        MainApp.instance.timeOfDayControlClick('dusk');
        expect(y.time.seconds).toBe(0);
    });

    test('Date Control Apply', () => {
        // @ts-ignore
        game.user.isGM = true;
        const event = new Event('click');

        MainApp.instance.activeCalendar.year = y;
        MainApp.instance.primary = true;
        y.months[0].selected = false;
        y.months[0].days[0].selected = false;
        MainApp.instance.dateControlApply(event);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(1);

        y.months[0].selected = true;
        MainApp.instance.dateControlApply(event);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(2);

        y.months[0].days[0].selected = true;
        MainApp.instance.dateControlApply(event);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(3);

        y.months[0].selected = true;
        y.months[0].visible = false;
        y.months[0].days[0].selected = true;
        MainApp.instance.dateControlApply(event);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(3);
        //@ts-ignore
        expect(DialogRenderer).toHaveBeenCalledTimes(1);

        (<Mock>(<Game>game).settings.set).mockImplementation(() => Promise.reject(new Error("error")));
        MainApp.instance.dateControlApply(event);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(3);



        // @ts-ignore
        game.user.isGM = false;
        MainApp.instance.dateControlApply(event);
        //@ts-ignore
        expect(ui.notifications.warn).toHaveBeenCalledTimes(1);
        (<Mock>(<Game>game).settings.set).mockReset();
    });

    test('Set Current Date', () => {
        MainApp.instance.setCurrentDate(1, y.months[1], y.months[1].days[0]);
        expect(y.months[0].current).toBe(true);
        expect(y.months[0].days[0].current).toBe(true);

        // @ts-ignore
        game.user.isGM = true;
        MainApp.instance.activeCalendar.year = y;
        MainApp.instance.primary = true;
        MainApp.instance.setCurrentDate(1, y.months[1], y.months[1].days[0]);
        expect(y.months[1].current).toBe(true);
        expect(y.months[1].days[0].current).toBe(true);
        // @ts-ignore
        game.user.isGM = false;
        MainApp.instance.setCurrentDate(1, y.months[1], y.months[1].days[0]);
        expect(ui.notifications?.warn).toHaveBeenCalled();
        //@ts-ignore
        const orig = game.users.find;
        (<Game>game).users = undefined;
        MainApp.instance.setCurrentDate(1, y.months[1], y.months[1].days[0]);
        expect((<Game>game).socket?.emit).not.toHaveBeenCalled();

        //@ts-ignore
        (<Game>game).users = {find: jest.fn((v)=>{
                //@ts-ignore
                return v.call(undefined, {isGM: true, active: true});
            })};
        MainApp.instance.setCurrentDate(1, y.months[1], y.months[1].days[0]);
        expect((<Game>game).socket?.emit).toHaveBeenCalled();
        //@ts-ignore
        game.users.find = orig;
    });

    test('Search Click', () => {
        const event = new Event('click');
        MainApp.instance.searchClick(event);
        // @ts-ignore
        SimpleCalendarSearch.instance.rendered = true;
        MainApp.instance.searchClick(event);
    });

    test('Configuration Click', () => {
        // @ts-ignore
        game.user.isGM = true;
        const event = new Event('click');
        MainApp.instance.activeCalendar.year = y;
        MainApp.instance.configurationClick(event);
        ConfigurationApp.instance = new ConfigurationApp(MainApp.instance.activeCalendar);
        // @ts-ignore
        ConfigurationApp.instance.rendered = true;
        MainApp.instance.configurationClick(event);
        // @ts-ignore
        game.user.isGM = false;
        MainApp.instance.configurationClick(event);
        //@ts-ignore
        expect(ui.notifications.warn).toHaveBeenCalledTimes(1);
    });

    test('Add Note', () => {
        const event = new Event('click');
        MainApp.instance.activeCalendar.year = y;
        MainApp.instance.activeCalendar.year.months[0].current = false;
        MainApp.instance.activeCalendar.year.months[0].selected = false;
        MainApp.instance.activeCalendar.year.months[0].days[0].current = false;
        MainApp.instance.activeCalendar.year.months[0].days[0].selected = false;

        //No GM Present
        MainApp.instance.addNote(event);
        //@ts-ignore
        expect(ui.notifications.warn).toHaveBeenCalledTimes(1);

        (<Game>game).users = undefined;
        MainApp.instance.addNote(event);
        //@ts-ignore
        expect(ui.notifications.warn).toHaveBeenCalledTimes(2);

        //GM is present
        //@ts-ignore
        (<Game>game).users = {find: jest.fn((v)=>{
            //@ts-ignore
            return v.call(undefined, {isGM: true, active: true});
        })};

        //No Current or selected month
        MainApp.instance.addNote(event);
        //@ts-ignore
        expect(ui.notifications.warn).toHaveBeenCalledTimes(3);

        //Current Month but no selected or current day
        MainApp.instance.activeCalendar.year.months[0].current = true;
        MainApp.instance.addNote(event);
        //@ts-ignore
        expect(ui.notifications.warn).toHaveBeenCalledTimes(4);

        //Current and Selected Month, current day but no selected day
        MainApp.instance.activeCalendar.year.months[0].selected = true;
        MainApp.instance.activeCalendar.year.months[0].days[0].current = true;
        MainApp.instance.addNote(event);
        //@ts-ignore
        expect(ui.notifications.warn).toHaveBeenCalledTimes(4);
        MainApp.instance.addNote(event);
        //@ts-ignore
        expect(ui.notifications.warn).toHaveBeenCalledTimes(4);
        //@ts-ignore
        MainApp.instance.newNote.rendered = false;
        MainApp.instance.addNote(event);
        //@ts-ignore
        expect(ui.notifications.warn).toHaveBeenCalledTimes(4);
    });

    test('View Note', () => {
        const event = new Event('click');
        const note = new Note();
        note.id = "123";
        MainApp.instance.activeCalendar.notes.push(note);

        //No Data attribute
        MainApp.instance.viewNote(event);
        expect(console.error).toHaveBeenCalledTimes(1);

        //Invalid data attribute
        const target = document.createElement('a');
        (<HTMLElement>target).setAttribute('data-index', '0');
        //@ts-ignore
        event.currentTarget = target;
        MainApp.instance.viewNote(event);
        expect(console.error).toHaveBeenCalledTimes(1);

        //Vaoid data attribute
        (<HTMLElement>target).setAttribute('data-index', '123');
        //@ts-ignore
        event.currentTarget = target;
        MainApp.instance.viewNote(event);

    });

    test('Update App/ Setting Update', () => {
        // @ts-ignore
        MainApp.instance.rendered = false;
        MainApp.instance.settingUpdate(true);
        expect(renderSpy).not.toHaveBeenCalled();
        // @ts-ignore
        MainApp.instance.rendered = true;
        MainApp.instance.settingUpdate(true);
        expect(renderSpy).toHaveBeenCalledTimes(1);

        MainApp.instance.settingUpdate();
        expect(renderSpy).toHaveBeenCalledTimes(1);

        //Year
        MainApp.instance.settingUpdate(true, 'year');
        expect(renderSpy).toHaveBeenCalledTimes(2);
        //Month
        MainApp.instance.settingUpdate(true, 'month');
        expect(renderSpy).toHaveBeenCalledTimes(3);
        //Weekday
        MainApp.instance.settingUpdate(true, 'weekday');
        expect(renderSpy).toHaveBeenCalledTimes(4);
        //Notes
        MainApp.instance.settingUpdate(true, 'notes');
        expect(renderSpy).toHaveBeenCalledTimes(5);
        //Leap year
        MainApp.instance.settingUpdate(true, 'leapyear');
        expect(renderSpy).toHaveBeenCalledTimes(6);

        MainApp.instance.settingUpdate(true, 'leapyear');
        expect(renderSpy).toHaveBeenCalledTimes(7);

    });





    test('Start Time', () => {

        const orig = MainApp.instance.element.find;

        MainApp.instance.element.find = jest.fn().mockReturnValue({
            removeClass: jest.fn().mockReturnValue({
                addClass: jest.fn()
            })
        });

        MainApp.instance.startTime();
        MainApp.instance.activeCalendar.year = y;
        MainApp.instance.startTime();
        expect(y.time.timeKeeper.getStatus()).toBe(TimeKeeperStatus.Started);
        MainApp.instance.activeCalendar.generalSettings.gameWorldTimeIntegration = GameWorldTimeIntegrations.Self;
        MainApp.instance.startTime();
        expect(y.time.timeKeeper.getStatus()).toBe(TimeKeeperStatus.Paused);
        //@ts-ignore
        game.combats.size = 1;
        MainApp.instance.startTime();
        expect(y.time.timeKeeper.getStatus()).toBe(TimeKeeperStatus.Paused);

        //@ts-ignore
        game.scenes = {active: null};
        MainApp.instance.startTime();
        expect(y.time.timeKeeper.getStatus()).toBe(TimeKeeperStatus.Paused);

        //@ts-ignore
        game.scenes = {active: {id: '123'}};
        //@ts-ignore
        game.combats.find = jest.fn((v)=>{
            //@ts-ignore
            return v.call(undefined, {started: true, scene: {id: "123"}});
        });
        MainApp.instance.startTime();
        expect(y.time.timeKeeper.getStatus()).toBe(TimeKeeperStatus.Paused);

        MainApp.instance.activeCalendar.generalSettings.gameWorldTimeIntegration = GameWorldTimeIntegrations.ThirdParty;
        //@ts-ignore
        game.combats.find = jest.fn((v)=>{
            return v.call(undefined, {started: true});
        });
        MainApp.instance.startTime();
        expect(y.time.timeKeeper.getStatus()).toBe(TimeKeeperStatus.Paused);

        MainApp.instance.element.find = orig;
    });

    test('Stop Time', () => {
        //y.time.keeper = 1;
        MainApp.instance.stopTime();
        //expect(y.time.keeper).toBe(1);
        MainApp.instance.activeCalendar.year = y;
        MainApp.instance.stopTime();
        expect(y.time.timeKeeper.getStatus()).toBe(TimeKeeperStatus.Stopped);
    });

    test('Time Keeping Check', async () => {
        await MainApp.instance.timeKeepingCheck();

        // @ts-ignore
        game.user.isGM = true;
        MainApp.instance.activeCalendar.year = y;
        await MainApp.instance.timeKeepingCheck();

        // @ts-ignore
        game.user.isGM = false;
    });

    test('Note Drag', () => {
        const e = new Event('drag');
        const tParent = document.createElement('div');
        tParent.appendChild((<HTMLElement>e.target));
        document.elementFromPoint = () => {return null};
        MainApp.instance.noteDrag(e);
        const sibling = document.createElement('div');
        document.elementFromPoint = () => {return sibling};
        MainApp.instance.noteDrag(e);
        (<HTMLElement>e.target).parentNode?.appendChild(sibling);
        MainApp.instance.noteDrag(e);
        expect((<HTMLElement>e.target).classList.contains('drag-active')).toBe(true);
    });

    test('Note Drag End', () => {
        const e = new Event('dragend');
        const tParent = document.createElement('div');
        tParent.appendChild((<HTMLElement>e.target));
        MainApp.instance.activeCalendar.year = y;
        MainApp.instance.activeCalendar.notes.push(new Note());
        MainApp.instance.activeCalendar.notes[0].year = 0;
        MainApp.instance.activeCalendar.notes[0].month = 1;
        MainApp.instance.activeCalendar.notes[0].day = 1;
        MainApp.instance.activeCalendar.notes[0].playerVisible = true;
        MainApp.instance.activeCalendar.notes[0].endDate = {year: 0, month: 1, day: 1, hour: 0, minute: 0, seconds: 0};
        MainApp.instance.noteDragEnd(e);

        (<HTMLElement>e.target).setAttribute('data-index', 'asd');
        MainApp.instance.noteDragEnd(e);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(0);

        (<HTMLElement>e.target).setAttribute('data-index', MainApp.instance.activeCalendar.notes[0].id);
        MainApp.instance.noteDragEnd(e);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(0);

        const orig = (<Game>game).settings.get;
        (<Game>game).settings.get =(moduleName: string, settingName: string) => { return [{id: MainApp.instance.activeCalendar.notes[0].id}];};
        MainApp.instance.noteDragEnd(e);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(0);
        (<Game>game).settings.get = orig;
    });

    test('Check Note Reminders', () => {
        // @ts-ignore
        game.user.isGM = true;
        MainApp.instance.checkNoteReminders();
        expect(ChatMessage.create).not.toHaveBeenCalled();

        MainApp.instance.activeCalendar.year = y;
        MainApp.instance.checkNoteReminders();
        expect(ChatMessage.create).not.toHaveBeenCalled();

        const n = new Note();
        n.title = 'Note';
        n.year = 0;
        n.month = 1;
        n.day = 1;
        n.endDate.year = 0;
        n.endDate.month = 1;
        n.endDate.day = 1;
        n.remindUsers.push('');
        MainApp.instance.activeCalendar.notes.push(n);

        //Tests for note that is only 1 day, does not repeat.
        MainApp.instance.checkNoteReminders();
        expect(ChatMessage.create).toHaveBeenCalledTimes(1);

        y.resetMonths();
        n.reminderSent = false;
        MainApp.instance.checkNoteReminders();
        expect(ChatMessage.create).toHaveBeenCalledTimes(2);

        y.months[0].current = true;
        y.months[0].days[1].current = true;
        n.reminderSent = false;
        //Current day is not the date of the note, not called
        MainApp.instance.checkNoteReminders();
        expect(ChatMessage.create).toHaveBeenCalledTimes(2);

        y.months[0].days[1].current = false;
        n.reminderSent = false;
        n.allDay = false;
        n.hour = 1;
        n.endDate.hour = 2;

        //Note at a specific time but current time is before the note, not called
        MainApp.instance.checkNoteReminders();
        expect(ChatMessage.create).toHaveBeenCalledTimes(2);

        n.reminderSent = false;
        n.minute = 1;
        y.time.seconds = 3600;
        //Note at a specific time, current time hour is equal to the hour but minutes are not, not called
        MainApp.instance.checkNoteReminders();
        expect(ChatMessage.create).toHaveBeenCalledTimes(2);

        n.reminderSent = false;
        y.time.seconds = 3660;
        //Note at a specific time, current time hour is equal and minutes are equal, called
        MainApp.instance.checkNoteReminders();
        expect(ChatMessage.create).toHaveBeenCalledTimes(3);

        n.reminderSent = false;
        y.time.seconds = 7261;
        //Note at a specific time, current time is greater than starting time, called
        MainApp.instance.checkNoteReminders();
        expect(ChatMessage.create).toHaveBeenCalledTimes(4);

        //Note repeats yearly
        n.repeats = NoteRepeat.Yearly;
        n.reminderSent = false;
        MainApp.instance.checkNoteReminders();
        expect(ChatMessage.create).toHaveBeenCalledTimes(5);
        y.numericRepresentation = 1;
        n.reminderSent = false;
        MainApp.instance.checkNoteReminders();
        expect(ChatMessage.create).toHaveBeenCalledTimes(6);

        //Note Repeats Monthly
        n.repeats = NoteRepeat.Monthly;
        n.reminderSent = false;
        y.numericRepresentation = 0;
        MainApp.instance.checkNoteReminders();
        expect(ChatMessage.create).toHaveBeenCalledTimes(7);
        y.resetMonths();
        y.months[1].current = true;
        y.months[1].days[0].current = true;
        MainApp.instance.checkNoteReminders();
        expect(ChatMessage.create).toHaveBeenCalledTimes(8);

        //Note Repeats Weekly
        n.repeats = NoteRepeat.Weekly;
        n.reminderSent = false;
        y.resetMonths();
        y.months[0].current = true;
        y.months[0].days[0].current = true;
        y.weekdays.push(new Weekday(1, 'W1'));
        y.weekdays.push(new Weekday(2, 'W2'));
        MainApp.instance.checkNoteReminders();
        expect(ChatMessage.create).toHaveBeenCalledTimes(9);
        y.months[0].days[0].current = false;
        y.months[0].days[2].current = true;
        MainApp.instance.checkNoteReminders();
        expect(ChatMessage.create).toHaveBeenCalledTimes(10);

        //Invalid Repeats
        //@ts-ignore
        n.repeats = 'asd';
        MainApp.instance.checkNoteReminders();
        expect(ChatMessage.create).toHaveBeenCalledTimes(10);

        //Note spans multiple days with a specific starting time but the time is earlier than the days current time but on a day in the middle
        n.repeats = NoteRepeat.Never;
        n.endDate.day = 3;
        n.reminderSent = false;
        y.resetMonths();
        y.months[0].current = true;
        y.months[0].days[1].current = true;
        y.time.seconds = 0;
        MainApp.instance.checkNoteReminders();
        expect(ChatMessage.create).toHaveBeenCalledTimes(11);

        // @ts-ignore
        game.user.isGM = false;
    });
});
