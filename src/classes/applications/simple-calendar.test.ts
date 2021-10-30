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


import SimpleCalendar from "./simple-calendar";
import {SimpleCalendarConfiguration} from "./simple-calendar-configuration";
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
    SimpleCalendar.instance = new SimpleCalendar();

    beforeEach(()=>{
        //Spy on console.error calls
        jest.spyOn(console, 'error').mockImplementation();
        //Set up a new Simple Calendar instance
        SimpleCalendar.instance = new SimpleCalendar();
        //Spy on the inherited render function of the new instance
        renderSpy = jest.spyOn(SimpleCalendar.instance, 'render');
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
        expect(Object.keys(SimpleCalendar.instance).length).toBe(10); //Make sure no new properties have been added
    });

    test('Default Options', () => {
        const spy = jest.spyOn(Application, 'defaultOptions', 'get');
        const opts = SimpleCalendar.defaultOptions;
        expect(Object.keys(opts).length).toBe(4); //Make sure no new properties have been added
        expect(opts.template).toBe('modules/foundryvtt-simple-calendar/templates/calendar.html');
        expect(opts.title).toBe('FSC.Title');
        expect(opts.classes).toStrictEqual(["simple-calendar"]);
        expect(opts.resizable).toBe(true);
        expect(spy).toHaveBeenCalled()
    });

    test('Init', async () => {
        await SimpleCalendar.instance.init();
        expect(Handlebars.registerHelper).toHaveBeenCalledTimes(3);
        expect((<Game>game).settings.register).toHaveBeenCalledTimes(13);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(11);
        expect(SimpleCalendar.instance.activeCalendar.year?.numericRepresentation).toBe(0);
        expect(SimpleCalendar.instance.activeCalendar.year?.months.length).toBe(1);
        expect(SimpleCalendar.instance.activeCalendar.year?.months[0].days.length).toBe(2);
        expect(SimpleCalendar.instance.activeCalendar.year?.getMonth()?.numericRepresentation).toBe(1);
        expect(SimpleCalendar.instance.activeCalendar.year?.getMonth()?.getDay()?.numericRepresentation).toBe(2);

        //Testing the functions within the handlebar helpers
        // @ts-ignore
        game.user.isGM = true;
        await SimpleCalendar.instance.init();
        expect(Handlebars.registerHelper).toHaveBeenCalledTimes(6);
        // @ts-ignore
        //expect(SimpleCalendar.instance.primaryCheckTimeout).toBeDefined();
        //expect(game.socket.emit).toHaveBeenCalledTimes(2);
        // @ts-ignore
        game.user.isGM = false;
    });

    test('Initialize Sockets', () => {
        SimpleCalendar.instance.initializeSockets();
        // @ts-ignore
        expect(SimpleCalendar.instance.primaryCheckTimeout).toBeUndefined();
        expect((<Game>game).socket?.emit).toHaveBeenCalledTimes(1);
        // @ts-ignore
        game.user.isGM = true;
        SimpleCalendar.instance.activeCalendar.year = y;
        SimpleCalendar.instance.initializeSockets();
        // @ts-ignore
        expect(SimpleCalendar.instance.primaryCheckTimeout).toBeDefined();
        expect((<Game>game).socket?.emit).toHaveBeenCalledTimes(3);
        // @ts-ignore
        game.user.isGM = false;
    });

    test('Primary Check Timeout Call', async () => {
        SimpleCalendar.instance.activeCalendar.year = y;
        y.time.unifyGameAndClockPause = false;
        await SimpleCalendar.instance.primaryCheckTimeoutCall();
        expect(SimpleCalendar.instance.primary).toBe(true);
        expect((<Game>game).socket?.emit).toHaveBeenCalledTimes(2);

        y.time.unifyGameAndClockPause = true;
        await SimpleCalendar.instance.primaryCheckTimeoutCall();
        expect(SimpleCalendar.instance.primary).toBe(true);
        expect((<Game>game).socket?.emit).toHaveBeenCalledTimes(4);
    });

    test('Process Socket', async () => {
        const d: SimpleCalendarSocket.Data = {
            type: SocketTypes.time,
            data: {
                timeKeeperStatus: TimeKeeperStatus.Stopped
            }
        };
        //@ts-ignore
        SimpleCalendar.instance.element = {
            find: jest.fn().mockReturnValue({
                removeClass: jest.fn().mockReturnValue({addClass: jest.fn()}),
                text: jest.fn()
            })
        }
        await SimpleCalendar.instance.processSocket(d);
        expect(renderSpy).toHaveBeenCalledTimes(0);

        SimpleCalendar.instance.activeCalendar.year = y;
        const orig = SimpleCalendar.instance.element;

        await SimpleCalendar.instance.processSocket(d);
        expect(renderSpy).toHaveBeenCalledTimes(0);
        //@ts-ignore
        SimpleCalendar.instance.element = orig;

        d.type = SocketTypes.checkClockRunning;
        d.data = {};
        await SimpleCalendar.instance.processSocket(d);
        expect((<Game>game).socket?.emit).toHaveBeenCalledTimes(0);

        // @ts-ignore
        game.user.isGM = true;
        SimpleCalendar.instance.primary = true;
        await SimpleCalendar.instance.processSocket(d);
        expect((<Game>game).socket?.emit).toHaveBeenCalledTimes(1);

        // @ts-ignore
        game.user.isGM = false;
        SimpleCalendar.instance.primary = false;


        d.type = SocketTypes.journal;
        d.data = {notes: []};
        await SimpleCalendar.instance.processSocket(d);
        expect(renderSpy).toHaveBeenCalledTimes(0);

        // @ts-ignore
        game.user.isGM = true;
        SimpleCalendar.instance.primary = true;
        await SimpleCalendar.instance.processSocket(d);
        expect(renderSpy).toHaveBeenCalledTimes(0);

        d.type = SocketTypes.primary;
        d.data = {
            primaryCheck: true
        };
        await SimpleCalendar.instance.processSocket(d);
        expect(renderSpy).toHaveBeenCalledTimes(0);
        expect((<Game>game).socket?.emit).toHaveBeenCalledTimes(2);
        d.data = {
            amPrimary: true
        };
        await SimpleCalendar.instance.processSocket(d);
        expect(SimpleCalendar.instance.primary).toBe(false);
        d.data = {
            amPrimary: false
        };
        SimpleCalendar.instance.primary = true;
        await SimpleCalendar.instance.processSocket(d);
        expect(SimpleCalendar.instance.primary).toBe(true);

        d.data = {};
        await SimpleCalendar.instance.processSocket(d);
        expect(SimpleCalendar.instance.primary).toBe(true);

        // @ts-ignore
        game.user.isGM = false;
        await SimpleCalendar.instance.processSocket(d);
        expect(SimpleCalendar.instance.primary).toBe(true);


        d.type = SocketTypes.dateTime;
        // @ts-ignore
        game.user.isGM = false;
        SimpleCalendar.instance.primary = false;
        await SimpleCalendar.instance.processSocket(d);

        // @ts-ignore
        game.user.isGM = true;
        SimpleCalendar.instance.primary = true;
        SimpleCalendar.instance.activeCalendar.year = y;
        await SimpleCalendar.instance.processSocket(d);



        d.data = {
            dataType: ' asd',
            isNext: true,
            amount: 0,
            unit: ''
        };
        await SimpleCalendar.instance.processSocket(d);

        d.data.dataType = 'year';
        await SimpleCalendar.instance.processSocket(d);
        d.data.isNext = false;
        await SimpleCalendar.instance.processSocket(d);
        d.data.dataType = 'month';
        await SimpleCalendar.instance.processSocket(d);
        d.data.isNext = true;
        await SimpleCalendar.instance.processSocket(d);
        d.data.dataType = 'day';
        await SimpleCalendar.instance.processSocket(d);
        d.data.isNext = false;
        await SimpleCalendar.instance.processSocket(d);
        d.data.dataType = 'time';
        d.data.amount = NaN;
        await SimpleCalendar.instance.processSocket(d);
        d.data.amount = 1;
        await SimpleCalendar.instance.processSocket(d);

        d.type = SocketTypes.date;
        // @ts-ignore
        game.user.isGM = false;
        SimpleCalendar.instance.primary = false;
        await SimpleCalendar.instance.processSocket(d);
        // @ts-ignore
        game.user.isGM = true;
        SimpleCalendar.instance.primary = true;
        SimpleCalendar.instance.activeCalendar.year = y;
        await SimpleCalendar.instance.processSocket(d);

        d.data = {
            year: 1,
            month: 1,
            day: 0
        };
        await SimpleCalendar.instance.processSocket(d);

        d.data.day = 1;
        await SimpleCalendar.instance.processSocket(d);

        // @ts-ignore
        game.user.isGM = false;
        //@ts-ignore
        d.type = 'asd';
        await SimpleCalendar.instance.processSocket(d);
        expect(renderSpy).toHaveBeenCalledTimes(0);

        d.type = SocketTypes.noteReminders;
        await SimpleCalendar.instance.processSocket(d);
        expect(renderSpy).toHaveBeenCalledTimes(0);

        d.type = SocketTypes.emitHook;
        d.data = {hook: SimpleCalendarHooks.DateTimeChange};
        await SimpleCalendar.instance.processSocket(d);
        expect(Hooks.callAll).toHaveBeenCalledTimes(17);
        d.data = {};
        await SimpleCalendar.instance.processSocket(d);
        expect(Hooks.callAll).toHaveBeenCalledTimes(17);
    });

    test('Get Data', async () => {
        let data = await SimpleCalendar.instance.getData();
        expect(data).toBeDefined();
        SimpleCalendar.instance.activeCalendar.year = y;
        SimpleCalendar.instance.activeCalendar.notes.push(new Note());
        SimpleCalendar.instance.activeCalendar.notes[0].playerVisible = true;
        SimpleCalendar.instance.activeCalendar.notes[0].year = 0;
        SimpleCalendar.instance.activeCalendar.notes[0].month = 1;
        SimpleCalendar.instance.activeCalendar.notes[0].day = 1;
        SimpleCalendar.instance.activeCalendar.notes[0].endDate = {year: 0, month: 1, day: 1, hour: 0, minute: 0, seconds: 0};
        //Nothing Undefined
        data = await SimpleCalendar.instance.getData();
        expect(data).toBeDefined();

        // @ts-ignore
        game.user.isGM = true;
        y.months[0].days[0].current = false;
        data = await SimpleCalendar.instance.getData();
        expect(data).toBeDefined();

        y.months[0].selected = false;
        data = await SimpleCalendar.instance.getData();
        expect(data).toBeDefined();

        // @ts-ignore
        game.user.isGM = false;
    });

    test('Get Header Buttons', () => {
        //@ts-ignore
        let r = SimpleCalendar.instance._getHeaderButtons();
        expect(r.length).toBe(1);
        expect(r[0].label).toBe('FSC.Compact');

        SimpleCalendar.instance.compactView = true;
        //@ts-ignore
        r = SimpleCalendar.instance._getHeaderButtons();
        expect(r.length).toBe(1);
        expect(r[0].label).toBe('FSC.Full');
    });

    test('Get Scene Control Buttons', () => {
        const controls: any[] = [{name:'test', tools:[]}];
        SimpleCalendar.instance.getSceneControlButtons(controls);
        expect(controls.length).toBe(1);
        expect(controls[0].tools.length).toBe(0);
        SimpleCalendar.instance.activeCalendar.year = y;
        SimpleCalendar.instance.getSceneControlButtons(controls);
        expect(controls.length).toBe(1);
        expect(controls[0].tools.length).toBe(0);
        controls.push({name:'token'});
        SimpleCalendar.instance.getSceneControlButtons(controls);
        expect(controls.length).toBe(2);
        expect(controls[0].tools.length).toBe(0);
        controls[1].tools = [];
        SimpleCalendar.instance.getSceneControlButtons(controls);
        expect(controls.length).toBe(2);
        expect(controls[0].tools.length).toBe(0);
        expect(controls[1].tools.length).toBe(1);

        SimpleCalendar.instance.activeCalendar.generalSettings.permissions.viewCalendar.player = false;
        SimpleCalendar.instance.activeCalendar.generalSettings.permissions.viewCalendar.trustedPlayer = false;
        SimpleCalendar.instance.activeCalendar.generalSettings.permissions.viewCalendar.assistantGameMaster = false;
        SimpleCalendar.instance.getSceneControlButtons(controls);
        expect(controls.length).toBe(2);
        expect(controls[0].tools.length).toBe(0);
        expect(controls[1].tools.length).toBe(1);
    });

    test('Show App', () => {
        // @ts-ignore
        game.user.isGM = false;
        SimpleCalendar.instance.activeCalendar.generalSettings.permissions.viewCalendar.player = false;
        SimpleCalendar.instance.activeCalendar.generalSettings.permissions.viewCalendar.trustedPlayer = false;
        SimpleCalendar.instance.activeCalendar.generalSettings.permissions.viewCalendar.assistantGameMaster = false;
        SimpleCalendar.instance.showApp();
        expect(renderSpy).not.toHaveBeenCalled();
        // @ts-ignore
        game.user.isGM = true;
        SimpleCalendar.instance.activeCalendar.year = y;
        SimpleCalendar.instance.showApp();
        expect(renderSpy).toHaveBeenCalled();
        SimpleCalendar.instance.activeCalendar.generalSettings.permissions.viewCalendar.player = true;
        SimpleCalendar.instance.activeCalendar.generalSettings.permissions.viewCalendar.trustedPlayer = true;
        SimpleCalendar.instance.activeCalendar.generalSettings.permissions.viewCalendar.assistantGameMaster = true;
        // @ts-ignore
        game.user.isGM = false;
    });

    test('Close App', () => {
        jest.spyOn(SimpleCalendar.instance, 'close').mockImplementation(() => {return Promise.resolve();});
        SimpleCalendar.instance.closeApp();
        expect(SimpleCalendar.instance.close).toHaveBeenCalled();
        (<Mock>SimpleCalendar.instance.close).mockResolvedValueOnce(Promise.reject("a"));
        SimpleCalendar.instance.closeApp();
        //expect(console.error).toHaveBeenCalledTimes(1);
    });

    test('Minimize', async () => {
        await SimpleCalendar.instance.minimize();
        expect(SimpleCalendar.instance.compactViewShowNotes).toBe(false);
        expect(SimpleCalendar.instance.compactView).toBe(true);
        expect(renderSpy).toHaveBeenCalledTimes(1);

        SimpleCalendar.instance.activeCalendar.year = y;
        await SimpleCalendar.instance.minimize();
        expect(SimpleCalendar.instance.compactView).toBe(false);
        expect(renderSpy).toHaveBeenCalledTimes(2);
    });

    test('Maximize', async () => {
        await SimpleCalendar.instance.maximize();
        expect(SimpleCalendar.instance.compactView).toBe(false);
        expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    test('On Resize', () => {
        expect(SimpleCalendar.instance.hasBeenResized).toBe(false);
        //@ts-ignore
        SimpleCalendar.instance._onResize(new Event('click'));
        expect(SimpleCalendar.instance.hasBeenResized).toBe(true);
    });

    test('Set Width Height', () => {
        const setPosSpy = jest.spyOn(SimpleCalendar.instance, 'setPosition');
        const fakeQuery = {
            find: jest.fn().mockReturnValue(false)
        };
        const origElementFind = SimpleCalendar.instance.element.find;
        SimpleCalendar.instance.element.find = jest.fn().mockReturnValue(false);
        //@ts-ignore
        SimpleCalendar.instance.setWidthHeight(fakeQuery);
        expect(setPosSpy).toHaveBeenCalledTimes(1);

        fakeQuery.find = jest.fn()
            .mockReturnValueOnce({outerHeight: jest.fn(), outerWidth: jest.fn()})
            .mockReturnValueOnce({outerHeight: jest.fn(), outerWidth: jest.fn()})
            .mockReturnValueOnce({outerHeight: jest.fn(), outerWidth: jest.fn()})
            .mockReturnValueOnce({outerHeight: jest.fn(), outerWidth: jest.fn()});

        SimpleCalendar.instance.element.find = jest.fn().mockReturnValue({
            height: jest.fn().mockReturnValue(1),
            width: jest.fn().mockReturnValue(1),
            outerHeight: jest.fn().mockReturnValue(2),
            outerWidth: jest.fn().mockReturnValue(2),
        })
        //@ts-ignore
        SimpleCalendar.instance.setWidthHeight(fakeQuery);
        expect(setPosSpy).toHaveBeenCalledTimes(2);

        fakeQuery.find = jest.fn()
            .mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(250), outerWidth: jest.fn().mockReturnValue(250)})
            .mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(300), outerWidth: jest.fn().mockReturnValue(250)})
            .mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(250), outerWidth: jest.fn().mockReturnValue(300)})
            .mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(25), outerWidth: jest.fn().mockReturnValue(250)});
        SimpleCalendar.instance.element.find = origElementFind;
        //@ts-ignore
        SimpleCalendar.instance.setWidthHeight(fakeQuery);
        expect(setPosSpy).toHaveBeenCalledTimes(3);

        SimpleCalendar.instance.hasBeenResized = true;
        //@ts-ignore
        SimpleCalendar.instance.setWidthHeight(fakeQuery);
        expect(setPosSpy).toHaveBeenCalledTimes(3);

        SimpleCalendar.instance.hasBeenResized = false;
        SimpleCalendar.instance.compactView = true;
        fakeQuery.find = jest.fn().mockReturnValue(false);
        //@ts-ignore
        SimpleCalendar.instance.setWidthHeight(fakeQuery);
        expect(setPosSpy).toHaveBeenCalledTimes(4);

        SimpleCalendar.instance.activeCalendar.year = y;
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
        SimpleCalendar.instance.setWidthHeight(fakeQuery);
        expect(setPosSpy).toHaveBeenCalledTimes(5);

        fakeQuery.find = jest.fn()
            .mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(250), outerWidth: jest.fn().mockReturnValue(250)})
            .mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(300), outerWidth: jest.fn().mockReturnValue(250)})
            .mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(250), outerWidth: jest.fn().mockReturnValue(300)})
            .mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(25), outerWidth: jest.fn().mockReturnValue(250)})
            .mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(25), outerWidth: jest.fn().mockReturnValue(250)});

        //@ts-ignore
        SimpleCalendar.instance.setWidthHeight(fakeQuery);
        expect(setPosSpy).toHaveBeenCalledTimes(6);

        SimpleCalendar.instance.activeCalendar.year.showWeekdayHeadings = false;

        fakeQuery.find = jest.fn()
            .mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(250), outerWidth: jest.fn().mockReturnValue(250)})
            .mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(300), outerWidth: jest.fn().mockReturnValue(1)})
            .mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(250), outerWidth: jest.fn().mockReturnValue(300)})
            .mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(25), outerWidth: jest.fn().mockReturnValue(250)})
            .mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(25), outerWidth: jest.fn().mockReturnValue(250)});
        //@ts-ignore
        SimpleCalendar.instance.setWidthHeight(fakeQuery);
        expect(setPosSpy).toHaveBeenCalledTimes(7);
    });

    test('Ensure Current Date Is Visible', () => {
        const fakeQuery = {
            find: jest.fn().mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(false)}).mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(200)})
        };

        //@ts-ignore
        SimpleCalendar.instance.ensureCurrentDateIsVisible(fakeQuery);
        expect(fakeQuery.find).toHaveBeenCalledTimes(1);

        //@ts-ignore
        SimpleCalendar.instance.ensureCurrentDateIsVisible(fakeQuery);
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
        SimpleCalendar.instance.ensureCurrentDateIsVisible(fakeQuery);
        expect(fakeQuery.find).toHaveBeenCalledTimes(1);

        //@ts-ignore
        SimpleCalendar.instance.ensureCurrentDateIsVisible(fakeQuery);
        expect(fakeQuery.find).toHaveBeenCalledTimes(2);

        //@ts-ignore
        SimpleCalendar.instance.ensureCurrentDateIsVisible(fakeQuery);
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
        SimpleCalendar.instance.activateListeners(fakeQuery);
        expect(fakeQuery.find).toHaveBeenCalledTimes(0);
        expect(onFunc).toHaveBeenCalledTimes(0);
        //@ts-ignore
        fakeQuery.length = 1;
        //@ts-ignore
        SimpleCalendar.instance.activateListeners(fakeQuery);
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
        SimpleCalendar.instance.activateListeners(fakeQuery);
        expect(fakeQuery.find).toHaveBeenCalledTimes(20);
        expect(onFunc).toHaveBeenCalledTimes(28);

        SimpleCalendar.instance.compactView = true;
        fakeQuery.find = jest.fn()
            .mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(250), outerWidth: jest.fn().mockReturnValue(250)})
            .mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(300), outerWidth: jest.fn().mockReturnValue(1)})
            .mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(250), outerWidth: jest.fn().mockReturnValue(300)})
            .mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(25), outerWidth: jest.fn().mockReturnValue(250)})
            .mockReturnValueOnce({outerHeight: jest.fn().mockReturnValue(25), outerWidth: jest.fn().mockReturnValue(250)})
            .mockReturnValue({on: onFunc});
        //@ts-ignore
        SimpleCalendar.instance.activateListeners(fakeQuery);
        expect(fakeQuery.find).toHaveBeenCalledTimes(12);
        expect(onFunc).toHaveBeenCalledTimes(35);
    });

    test('Show Compact Notes', () => {
        SimpleCalendar.instance.showCompactNotes(new Event('click'));
        expect(SimpleCalendar.instance.compactViewShowNotes).toBe(true);
        expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    test('View Previous Month', () => {
        SimpleCalendar.instance.activeCalendar.year = y;
        SimpleCalendar.instance.viewPreviousMonth(new Event('click'));
        expect(renderSpy).toHaveBeenCalled();
    });

    test('View Next Month', () => {
        SimpleCalendar.instance.activeCalendar.year = y;
        SimpleCalendar.instance.viewNextMonth(new Event('click'));
        expect(renderSpy).toHaveBeenCalled();
    });

    test('Day Click', () => {
        const event = new Event('click');
        SimpleCalendar.instance.activeCalendar.year = y;
        //const eventSpy = jest.spyOn(Event, 'target')
        SimpleCalendar.instance.dayClick(event);
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(renderSpy).not.toHaveBeenCalled();
        (<HTMLElement>event.target).setAttribute('data-day', '-1');
        SimpleCalendar.instance.dayClick(event);
        expect(console.error).toHaveBeenCalledTimes(2);
        expect(renderSpy).not.toHaveBeenCalled();
        (<HTMLElement>event.target).setAttribute('data-day', '2');
        SimpleCalendar.instance.dayClick(event);
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect(SimpleCalendar.instance.activeCalendar.year.months[0].days[1].selected).toBe(true);

        SimpleCalendar.instance.activeCalendar.year.months[0].selected = false;
        (<HTMLElement>event.target).setAttribute('data-day', '1');
        SimpleCalendar.instance.dayClick(event);
        expect(renderSpy).toHaveBeenCalledTimes(2);
        expect(SimpleCalendar.instance.activeCalendar.year.months[0].days[1].selected).toBe(false);
        expect(SimpleCalendar.instance.activeCalendar.year.months[0].days[0].selected).toBe(true);

        SimpleCalendar.instance.activeCalendar.year.months[0].selected = false;
        (<HTMLElement>event.target).setAttribute('data-day', '3');
        SimpleCalendar.instance.activeCalendar.year.months[0].days[0].selected = false;
        SimpleCalendar.instance.activeCalendar.year.months[0].days = [SimpleCalendar.instance.activeCalendar.year.months[0].days[0],SimpleCalendar.instance.activeCalendar.year.months[0].days[1]];
        SimpleCalendar.instance.dayClick(event);
        expect(renderSpy).toHaveBeenCalledTimes(3);
        expect(SimpleCalendar.instance.activeCalendar.year.months[0].days[1].selected).toBe(false);
        expect(SimpleCalendar.instance.activeCalendar.year.months[0].days[0].selected).toBe(false);

        SimpleCalendar.instance.activeCalendar.year.months[0].visible = false;
        SimpleCalendar.instance.dayClick(event);
        expect(renderSpy).toHaveBeenCalledTimes(4);

        (<HTMLElement>event.target).classList.add('selected');
        SimpleCalendar.instance.dayClick(event);
        expect(renderSpy).toHaveBeenCalledTimes(5);


        (<HTMLElement>event.target).classList.remove('selected');
        const originalTarget = (<HTMLElement>event.target);
        const noteTarget = document.createElement('span');
        noteTarget.classList.add('note-count');
        originalTarget.appendChild(noteTarget);
        (<HTMLElement>event.target) = noteTarget;
        SimpleCalendar.instance.dayClick(event);
        expect(renderSpy).toHaveBeenCalledTimes(6);

        const moonTarget = document.createElement('span');
        moonTarget.classList.add('moon-phase');
        const moonContainer = document.createElement('div');
        moonContainer.appendChild(moonTarget);
        originalTarget.appendChild(moonContainer);
        (<HTMLElement>event.target) = moonTarget;
        SimpleCalendar.instance.dayClick(event);
        expect(renderSpy).toHaveBeenCalledTimes(7);

        const invalidTarget = document.createElement('span');
        originalTarget.appendChild(invalidTarget);
        (<HTMLElement>event.target) = invalidTarget;
        SimpleCalendar.instance.dayClick(event);
        expect(renderSpy).toHaveBeenCalledTimes(7);
    });

    test('Today Click', () => {
        const event = new Event('click');
        SimpleCalendar.instance.activeCalendar.year = y;
        SimpleCalendar.instance.activeCalendar.year.months[0].current = false;
        SimpleCalendar.instance.activeCalendar.year.months[0].visible = false;
        SimpleCalendar.instance.activeCalendar.year.months[0].selected = false;
        SimpleCalendar.instance.activeCalendar.year.months[0].days[0].current = false;
        SimpleCalendar.instance.activeCalendar.year.months[0].days[0].selected = false;
        SimpleCalendar.instance.todayClick(event);
        expect(renderSpy).not.toHaveBeenCalled();
        SimpleCalendar.instance.activeCalendar.year.months[0].current = true;
        SimpleCalendar.instance.todayClick(event);
        expect(renderSpy).not.toHaveBeenCalled();
        SimpleCalendar.instance.activeCalendar.year.months[0].days[0].current = true;
        SimpleCalendar.instance.activeCalendar.year.months[0].days[1].selected = true;
        SimpleCalendar.instance.todayClick(event);
        expect(renderSpy).toHaveBeenCalled();
        expect(SimpleCalendar.instance.activeCalendar.year.months[0].visible).toBe(true);
        expect(SimpleCalendar.instance.activeCalendar.year.months[0].selected).toBe(true);
        expect(SimpleCalendar.instance.activeCalendar.year.months[0].days[0].selected).toBe(true);

        SimpleCalendar.instance.activeCalendar.year.months[0].visible = false;
        SimpleCalendar.instance.activeCalendar.year.months[0].selected = false;
        SimpleCalendar.instance.activeCalendar.year.months[1].visible = true;
        SimpleCalendar.instance.activeCalendar.year.months[1].selected = true;
        SimpleCalendar.instance.activeCalendar.year.months[0].days[0].selected = false;
        SimpleCalendar.instance.activeCalendar.year.months[1].days[0].selected = false;
        SimpleCalendar.instance.todayClick(event);
        expect(renderSpy).toHaveBeenCalled();
        expect(SimpleCalendar.instance.activeCalendar.year.months[0].visible).toBe(true);
        expect(SimpleCalendar.instance.activeCalendar.year.months[0].selected).toBe(true);
        expect(SimpleCalendar.instance.activeCalendar.year.months[0].days[0].selected).toBe(true);

        SimpleCalendar.instance.activeCalendar.year.months[0].visible = false;
        SimpleCalendar.instance.activeCalendar.year.months[0].selected = false;
        SimpleCalendar.instance.activeCalendar.year.months[1].visible = true;
        SimpleCalendar.instance.activeCalendar.year.months[1].selected = true;
        SimpleCalendar.instance.activeCalendar.year.months[0].days[0].selected = false;
        SimpleCalendar.instance.activeCalendar.year.months[1].days[0].selected = true;
        SimpleCalendar.instance.todayClick(event);
        expect(renderSpy).toHaveBeenCalled();
        expect(SimpleCalendar.instance.activeCalendar.year.months[0].visible).toBe(true);
        expect(SimpleCalendar.instance.activeCalendar.year.months[0].selected).toBe(true);
        expect(SimpleCalendar.instance.activeCalendar.year.months[0].days[0].selected).toBe(true);
    });

    test('Compact Time Control Click', () => {
        let e = new Event('click');
        //No Current Year
        SimpleCalendar.instance.compactTimeControlClick(e);
        expect(y.time.seconds).toBe(0);

        //No Attributes
        SimpleCalendar.instance.activeCalendar.year = y;
        SimpleCalendar.instance.compactTimeControlClick(e);
        expect(y.time.seconds).toBe(0);

        //Garbage Attributes
        (<HTMLElement>e.currentTarget).setAttribute('data-type', 'asd');
        (<HTMLElement>e.currentTarget).setAttribute('data-amount', 'asd');
        SimpleCalendar.instance.compactTimeControlClick(e);
        expect(y.time.seconds).toBe(0);

        //Bad Type, Valid amount
        (<HTMLElement>e.currentTarget).setAttribute('data-amount', '1');
        SimpleCalendar.instance.compactTimeControlClick(e);
        expect(y.time.seconds).toBe(0);

        //Valid Type and amount not GM
        (<HTMLElement>e.currentTarget).setAttribute('data-type', 'second');
        SimpleCalendar.instance.compactTimeControlClick(e);
        expect(y.time.seconds).toBe(0);

        //@ts-ignore
        const orig = game.users.find;
        (<Game>game).users = undefined;
        SimpleCalendar.instance.compactTimeControlClick(e);
        expect((<Game>game).socket?.emit).not.toHaveBeenCalled();

        //@ts-ignore
        (<Game>game).users = {find: jest.fn((v)=>{
                //@ts-ignore
                return v.call(undefined, {isGM: true, active: true});
            })};
        SimpleCalendar.instance.compactTimeControlClick(e);
        expect((<Game>game).socket?.emit).toHaveBeenCalled();
        //@ts-ignore
        game.users.find = orig;

        //Valid Type and amount GM
        //@ts-ignore
        game.user.isGM = true;
        SimpleCalendar.instance.primary = true;
        (<HTMLElement>e.currentTarget).setAttribute('data-type', 'second');
        SimpleCalendar.instance.compactTimeControlClick(e);
        expect(y.time.seconds).toBe(1);

        (<HTMLElement>e.currentTarget).setAttribute('data-type', 'minute');
        SimpleCalendar.instance.compactTimeControlClick(e);
        expect(y.time.seconds).toBe(61);

        (<HTMLElement>e.currentTarget).setAttribute('data-type', 'hour');
        SimpleCalendar.instance.compactTimeControlClick(e);
        expect(y.time.seconds).toBe(3661);

        (<HTMLElement>e.currentTarget).setAttribute('data-type', 'asd');
        SimpleCalendar.instance.compactTimeControlClick(e);
        expect(y.time.seconds).toBe(3661);

        (<HTMLElement>e.currentTarget).setAttribute('data-type', 'midnight');
        (<HTMLElement>e.currentTarget).setAttribute('data-amount', '');
        SimpleCalendar.instance.compactTimeControlClick(e);
        expect(y.time.seconds).toBe(0);

        //@ts-ignore
        game.user.isGM = false;
    });

    test('Time Unit Click', () => {
        let e = new Event('click');
        (<HTMLElement>e.currentTarget).setAttribute('data-type', 'second');
        SimpleCalendar.instance.activeCalendar.year = y;
        SimpleCalendar.instance.timeUnitClick(e);
        expect(renderSpy).toHaveBeenCalledTimes(1);

        (<HTMLElement>e.currentTarget).removeAttribute('data-type');
        SimpleCalendar.instance.timeUnitClick(e);
        expect(renderSpy).toHaveBeenCalledTimes(2);
    });

    test('GM Control Click', () => {
        const event = new Event('click');
        SimpleCalendar.instance.gmControlClick(event);
        expect(renderSpy).not.toHaveBeenCalled();
        SimpleCalendar.instance.activeCalendar.year = y;
        SimpleCalendar.instance.primary = true;
        // @ts-ignore
        game.user.isGM = true;
        //Test Each with current year set to null
        (<HTMLElement>event.currentTarget).setAttribute('data-type', 'day');
        SimpleCalendar.instance.gmControlClick(event);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(1);

        (<HTMLElement>event.currentTarget).setAttribute('data-type', 'month');
        SimpleCalendar.instance.gmControlClick(event);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(2);

        (<HTMLElement>event.currentTarget).setAttribute('data-type', 'year');
        SimpleCalendar.instance.gmControlClick(event);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(3);

        //Test with current year set
        SimpleCalendar.instance.activeCalendar.year = y;
        (<HTMLElement>event.currentTarget).classList.remove('next');
        (<HTMLElement>event.currentTarget).setAttribute('data-type', 'day');
        SimpleCalendar.instance.gmControlClick(event);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(4);

        (<HTMLElement>event.currentTarget).setAttribute('data-type', 'month');
        SimpleCalendar.instance.gmControlClick(event);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(5);
        (<HTMLElement>event.currentTarget).classList.add('next');
        SimpleCalendar.instance.gmControlClick(event);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(6);
        (<HTMLElement>event.currentTarget).classList.remove('next');

        (<HTMLElement>event.currentTarget).setAttribute('data-type', 'year');
        SimpleCalendar.instance.gmControlClick(event);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(7);

        (<HTMLElement>event.currentTarget).classList.add('next');
        SimpleCalendar.instance.gmControlClick(event);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(8);

        (<HTMLElement>event.currentTarget).setAttribute('data-type', 'time');
        SimpleCalendar.instance.gmControlClick(event);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(8);

        (<HTMLElement>event.currentTarget).setAttribute('data-amount', 'asd');
        SimpleCalendar.instance.gmControlClick(event);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(8);

        (<HTMLElement>event.currentTarget).setAttribute('data-amount', '1');
        SimpleCalendar.instance.gmControlClick(event);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(9);

        (<HTMLElement>event.currentTarget).classList.remove('next');
        SimpleCalendar.instance.timeUnits.second = false;
        SimpleCalendar.instance.timeUnits.minute = true;
        SimpleCalendar.instance.gmControlClick(event);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(10);

        SimpleCalendar.instance.timeUnits.second = false;
        SimpleCalendar.instance.timeUnits.minute = false;
        SimpleCalendar.instance.timeUnits.hour = true;
        SimpleCalendar.instance.gmControlClick(event);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(11);


        (<HTMLElement>event.currentTarget).setAttribute('data-type', 'dawn');
        SimpleCalendar.instance.gmControlClick(event);
        expect(y.time.seconds).toBe(0);

        // @ts-ignore
        game.user.isGM = false;
        (<HTMLElement>event.currentTarget).setAttribute('data-type', 'time');
        SimpleCalendar.instance.gmControlClick(event);
        expect(ui.notifications?.warn).toHaveBeenCalled();

        //@ts-ignore
        const orig = game.users.find;

        (<Game>game).users = undefined;
        SimpleCalendar.instance.gmControlClick(event);
        expect((<Game>game).socket?.emit).not.toHaveBeenCalled();

        //@ts-ignore
        (<Game>game).users = {find: jest.fn((v)=>{
                //@ts-ignore
                return v.call(undefined, {isGM: true, active: true});
            })};
        SimpleCalendar.instance.gmControlClick(event);
        expect((<Game>game).socket?.emit).toHaveBeenCalled();

        SimpleCalendar.instance.timeUnits.second = false;
        SimpleCalendar.instance.timeUnits.minute = true;
        SimpleCalendar.instance.timeUnits.hour = false;
        (<HTMLElement>event.currentTarget).setAttribute('data-amount', '');
        SimpleCalendar.instance.gmControlClick(event);
        expect((<Game>game).socket?.emit).toHaveBeenCalled();

        SimpleCalendar.instance.timeUnits.second = true;
        SimpleCalendar.instance.timeUnits.minute = false;
        SimpleCalendar.instance.timeUnits.hour = false;
        (<HTMLElement>event.currentTarget).setAttribute('data-type', 'asd');
        SimpleCalendar.instance.gmControlClick(event);
        expect((<Game>game).socket?.emit).toHaveBeenCalled();

        //@ts-ignore
        game.users.find = orig;
    });

    test('Time of Day Control Click', () => {
        SimpleCalendar.instance.timeOfDayControlClick('asd');
        expect(y.time.seconds).toBe(0);

        PredefinedCalendar.setToPredefined(y, PredefinedCalendars.Gregorian);
        SimpleCalendar.instance.activeCalendar.year = y;
        SimpleCalendar.instance.timeOfDayControlClick('asd');
        expect(y.time.seconds).toBe(0);

        SimpleCalendar.instance.timeOfDayControlClick('dawn');
        expect(y.time.seconds).toBe(21600);
        y.time.seconds = 22000;
        SimpleCalendar.instance.timeOfDayControlClick('dawn');
        expect(y.time.seconds).toBe(21600);

        SimpleCalendar.instance.timeOfDayControlClick('midday');
        expect(y.time.seconds).toBe(43200);
        y.time.seconds = 44000;
        SimpleCalendar.instance.timeOfDayControlClick('midday');
        expect(y.time.seconds).toBe(43200);

        SimpleCalendar.instance.timeOfDayControlClick('dusk');
        expect(y.time.seconds).toBe(64800);
        y.time.seconds = 65000;
        SimpleCalendar.instance.timeOfDayControlClick('dusk');
        expect(y.time.seconds).toBe(64800);

        SimpleCalendar.instance.timeOfDayControlClick('midnight');
        expect(y.time.seconds).toBe(0);

        y.resetMonths();
        y.months[0].current = true;
        SimpleCalendar.instance.timeOfDayControlClick('dawn');
        expect(y.time.seconds).toBe(0);
        SimpleCalendar.instance.timeOfDayControlClick('dusk');
        expect(y.time.seconds).toBe(0);

        y.resetMonths();
        SimpleCalendar.instance.timeOfDayControlClick('dawn');
        expect(y.time.seconds).toBe(0);
        SimpleCalendar.instance.timeOfDayControlClick('dusk');
        expect(y.time.seconds).toBe(0);
    });

    test('Date Control Apply', () => {
        // @ts-ignore
        game.user.isGM = true;
        const event = new Event('click');

        SimpleCalendar.instance.activeCalendar.year = y;
        SimpleCalendar.instance.primary = true;
        y.months[0].selected = false;
        y.months[0].days[0].selected = false;
        SimpleCalendar.instance.dateControlApply(event);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(1);

        y.months[0].selected = true;
        SimpleCalendar.instance.dateControlApply(event);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(2);

        y.months[0].days[0].selected = true;
        SimpleCalendar.instance.dateControlApply(event);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(3);

        y.months[0].selected = true;
        y.months[0].visible = false;
        y.months[0].days[0].selected = true;
        SimpleCalendar.instance.dateControlApply(event);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(3);
        //@ts-ignore
        expect(DialogRenderer).toHaveBeenCalledTimes(1);

        (<Mock>(<Game>game).settings.set).mockImplementation(() => Promise.reject(new Error("error")));
        SimpleCalendar.instance.dateControlApply(event);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(3);



        // @ts-ignore
        game.user.isGM = false;
        SimpleCalendar.instance.dateControlApply(event);
        //@ts-ignore
        expect(ui.notifications.warn).toHaveBeenCalledTimes(1);
        (<Mock>(<Game>game).settings.set).mockReset();
    });

    test('Set Current Date', () => {
        SimpleCalendar.instance.setCurrentDate(1, y.months[1], y.months[1].days[0]);
        expect(y.months[0].current).toBe(true);
        expect(y.months[0].days[0].current).toBe(true);

        // @ts-ignore
        game.user.isGM = true;
        SimpleCalendar.instance.activeCalendar.year = y;
        SimpleCalendar.instance.primary = true;
        SimpleCalendar.instance.setCurrentDate(1, y.months[1], y.months[1].days[0]);
        expect(y.months[1].current).toBe(true);
        expect(y.months[1].days[0].current).toBe(true);
        // @ts-ignore
        game.user.isGM = false;
        SimpleCalendar.instance.setCurrentDate(1, y.months[1], y.months[1].days[0]);
        expect(ui.notifications?.warn).toHaveBeenCalled();
        //@ts-ignore
        const orig = game.users.find;
        (<Game>game).users = undefined;
        SimpleCalendar.instance.setCurrentDate(1, y.months[1], y.months[1].days[0]);
        expect((<Game>game).socket?.emit).not.toHaveBeenCalled();

        //@ts-ignore
        (<Game>game).users = {find: jest.fn((v)=>{
                //@ts-ignore
                return v.call(undefined, {isGM: true, active: true});
            })};
        SimpleCalendar.instance.setCurrentDate(1, y.months[1], y.months[1].days[0]);
        expect((<Game>game).socket?.emit).toHaveBeenCalled();
        //@ts-ignore
        game.users.find = orig;
    });

    test('Search Click', () => {
        const event = new Event('click');
        SimpleCalendar.instance.searchClick(event);
        // @ts-ignore
        SimpleCalendarSearch.instance.rendered = true;
        SimpleCalendar.instance.searchClick(event);
    });

    test('Configuration Click', () => {
        // @ts-ignore
        game.user.isGM = true;
        const event = new Event('click');
        SimpleCalendar.instance.activeCalendar.year = y;
        SimpleCalendar.instance.configurationClick(event);
        SimpleCalendarConfiguration.instance = new SimpleCalendarConfiguration(SimpleCalendar.instance.activeCalendar);
        // @ts-ignore
        SimpleCalendarConfiguration.instance.rendered = true;
        SimpleCalendar.instance.configurationClick(event);
        // @ts-ignore
        game.user.isGM = false;
        SimpleCalendar.instance.configurationClick(event);
        //@ts-ignore
        expect(ui.notifications.warn).toHaveBeenCalledTimes(1);
    });

    test('Add Note', () => {
        const event = new Event('click');
        SimpleCalendar.instance.activeCalendar.year = y;
        SimpleCalendar.instance.activeCalendar.year.months[0].current = false;
        SimpleCalendar.instance.activeCalendar.year.months[0].selected = false;
        SimpleCalendar.instance.activeCalendar.year.months[0].days[0].current = false;
        SimpleCalendar.instance.activeCalendar.year.months[0].days[0].selected = false;

        //No GM Present
        SimpleCalendar.instance.addNote(event);
        //@ts-ignore
        expect(ui.notifications.warn).toHaveBeenCalledTimes(1);

        (<Game>game).users = undefined;
        SimpleCalendar.instance.addNote(event);
        //@ts-ignore
        expect(ui.notifications.warn).toHaveBeenCalledTimes(2);

        //GM is present
        //@ts-ignore
        (<Game>game).users = {find: jest.fn((v)=>{
            //@ts-ignore
            return v.call(undefined, {isGM: true, active: true});
        })};

        //No Current or selected month
        SimpleCalendar.instance.addNote(event);
        //@ts-ignore
        expect(ui.notifications.warn).toHaveBeenCalledTimes(3);

        //Current Month but no selected or current day
        SimpleCalendar.instance.activeCalendar.year.months[0].current = true;
        SimpleCalendar.instance.addNote(event);
        //@ts-ignore
        expect(ui.notifications.warn).toHaveBeenCalledTimes(4);

        //Current and Selected Month, current day but no selected day
        SimpleCalendar.instance.activeCalendar.year.months[0].selected = true;
        SimpleCalendar.instance.activeCalendar.year.months[0].days[0].current = true;
        SimpleCalendar.instance.addNote(event);
        //@ts-ignore
        expect(ui.notifications.warn).toHaveBeenCalledTimes(4);
        SimpleCalendar.instance.addNote(event);
        //@ts-ignore
        expect(ui.notifications.warn).toHaveBeenCalledTimes(4);
        //@ts-ignore
        SimpleCalendar.instance.newNote.rendered = false;
        SimpleCalendar.instance.addNote(event);
        //@ts-ignore
        expect(ui.notifications.warn).toHaveBeenCalledTimes(4);
    });

    test('View Note', () => {
        const event = new Event('click');
        const note = new Note();
        note.id = "123";
        SimpleCalendar.instance.activeCalendar.notes.push(note);

        //No Data attribute
        SimpleCalendar.instance.viewNote(event);
        expect(console.error).toHaveBeenCalledTimes(1);

        //Invalid data attribute
        const target = document.createElement('a');
        (<HTMLElement>target).setAttribute('data-index', '0');
        //@ts-ignore
        event.currentTarget = target;
        SimpleCalendar.instance.viewNote(event);
        expect(console.error).toHaveBeenCalledTimes(1);

        //Vaoid data attribute
        (<HTMLElement>target).setAttribute('data-index', '123');
        //@ts-ignore
        event.currentTarget = target;
        SimpleCalendar.instance.viewNote(event);

    });

    test('Update App/ Setting Update', () => {
        // @ts-ignore
        SimpleCalendar.instance.rendered = false;
        SimpleCalendar.instance.settingUpdate(true);
        expect(renderSpy).not.toHaveBeenCalled();
        // @ts-ignore
        SimpleCalendar.instance.rendered = true;
        SimpleCalendar.instance.settingUpdate(true);
        expect(renderSpy).toHaveBeenCalledTimes(1);

        SimpleCalendar.instance.settingUpdate();
        expect(renderSpy).toHaveBeenCalledTimes(1);

        //Year
        SimpleCalendar.instance.settingUpdate(true, 'year');
        expect(renderSpy).toHaveBeenCalledTimes(2);
        //Month
        SimpleCalendar.instance.settingUpdate(true, 'month');
        expect(renderSpy).toHaveBeenCalledTimes(3);
        //Weekday
        SimpleCalendar.instance.settingUpdate(true, 'weekday');
        expect(renderSpy).toHaveBeenCalledTimes(4);
        //Notes
        SimpleCalendar.instance.settingUpdate(true, 'notes');
        expect(renderSpy).toHaveBeenCalledTimes(5);
        //Leap year
        SimpleCalendar.instance.settingUpdate(true, 'leapyear');
        expect(renderSpy).toHaveBeenCalledTimes(6);

        SimpleCalendar.instance.settingUpdate(true, 'leapyear');
        expect(renderSpy).toHaveBeenCalledTimes(7);

    });

    test('Game Paused', () => {
        const o = SimpleCalendar.instance.element;
        //@ts-ignore
        SimpleCalendar.instance.element = {
            find: jest.fn().mockReturnValue({
                removeClass: jest.fn().mockReturnValue({addClass: jest.fn()}),
                text: jest.fn()
            })
        };
        SimpleCalendar.instance.gamePaused(true);
        SimpleCalendar.instance.activeCalendar.year = y;
        SimpleCalendar.instance.gamePaused(true);
        y.time.unifyGameAndClockPause = true;
        SimpleCalendar.instance.gamePaused(true);
        //@ts-ignore
        game.paused = false;
        SimpleCalendar.instance.gamePaused(true);
        //@ts-ignore
        SimpleCalendar.instance.element = o;
    });

    test('World Time Update', () => {
        SimpleCalendar.instance.worldTimeUpdate(100, 10);
        SimpleCalendar.instance.activeCalendar.year = y;
        SimpleCalendar.instance.worldTimeUpdate(100, 10);
        expect(y.time.seconds).toBe(100);
    });

    test('Create Combatant', () => {
        const orig = (<Game>game).combats;
        const origScenes = (<Game>game).scenes;
        (<Game>game).combats = undefined;
        //@ts-ignore
        SimpleCalendar.instance.createCombatant({}, {}, "");
        expect(SimpleCalendar.instance.activeCalendar.year.time.combatRunning).toBe(false);

        //@ts-ignore
        (<Game>game).combats = {size: 1, find: jest.fn((v)=>{return v.call(undefined, {id: 'cid'})? {id: 'cid', started: false, scene: {id:"sid"}} : null; }) };
        //@ts-ignore
        SimpleCalendar.instance.createCombatant({parent: null}, {}, "");
        expect(SimpleCalendar.instance.activeCalendar.year.time.combatRunning).toBe(false);

        //@ts-ignore
        (<Game>game).combats = {size: 1, find: jest.fn((v)=>{return v.call(undefined, {id: 'cid'})? {id: 'cid', started: false, scene: {id:"sid"}} : null; }) };
        //@ts-ignore
        game.scenes = {active: null};
        //@ts-ignore
        SimpleCalendar.instance.createCombatant({parent: {id: 'cid'}}, {}, "");
        expect(SimpleCalendar.instance.activeCalendar.year.time.combatRunning).toBe(false);

        //@ts-ignore
        (<Game>game).combats = {size: 1, find: jest.fn((v)=>{return v.call(undefined, {id: 'cid'})? {id: 'cid', started: true, scene: {id:"sid"}} : null; }) };
        //@ts-ignore
        game.scenes = {active: {id: 'sid'}};
        //@ts-ignore
        SimpleCalendar.instance.createCombatant({parent: {id: 'cid'}}, {}, "");
        expect(SimpleCalendar.instance.activeCalendar.year.time.combatRunning).toBe(true);

        SimpleCalendar.instance.activeCalendar.year.time.combatRunning = false;
        //@ts-ignore
        game.scenes = null;
        //@ts-ignore
        SimpleCalendar.instance.createCombatant({parent: {id: 'cid'}}, {}, "");
        expect(SimpleCalendar.instance.activeCalendar.year.time.combatRunning).toBe(true);

        (<Game>game).combats = orig;
        (<Game>game).scenes = origScenes;
    });

    test('Combat Update', () => {
        //@ts-ignore
        SimpleCalendar.instance.combatUpdate({started: true}, {}, {advanceTime: 2});
        SimpleCalendar.instance.activeCalendar.year = y;
        //@ts-ignore
        game.scenes = {active: null};
        //@ts-ignore
        SimpleCalendar.instance.combatUpdate({}, {}, {});
        expect(y.time.combatRunning).toBe(false);
        //@ts-ignore
        game.scenes = {active: {id: '123'}};
        //@ts-ignore
        SimpleCalendar.instance.combatUpdate({started: true}, {}, {});
        expect(y.time.combatRunning).toBe(false);
        //@ts-ignore
        SimpleCalendar.instance.combatUpdate({started: true, scene: {id:"123"}}, {}, {});
        expect(y.time.combatRunning).toBe(true);
        //@ts-ignore
        SimpleCalendar.instance.combatUpdate({started: true, scene: {id:"123"}}, {}, {advanceTime: 2});
        expect(y.combatChangeTriggered).toBe(true);
        //@ts-ignore
        SimpleCalendar.instance.combatUpdate({started: true, scene: {id:"123"}}, {}, {advanceTime: 0});
        expect(y.combatChangeTriggered).toBe(true);

        //@ts-ignore
        game.scenes = null;
    });

    test('Combat Delete', () => {
        SimpleCalendar.instance.activeCalendar.year = y;
        y.time.combatRunning = true;
        //@ts-ignore
        SimpleCalendar.instance.combatDelete({});
        expect(y.time.combatRunning).toBe(true);

        //@ts-ignore
        game.scenes = {active: null};
        //@ts-ignore
        SimpleCalendar.instance.combatDelete({});
        expect(y.time.combatRunning).toBe(true);

        //@ts-ignore
        game.scenes = {active: {id: '123'}};
        //@ts-ignore
        SimpleCalendar.instance.combatDelete({started: true, scene: {id:"123"}});
        expect(y.time.combatRunning).toBe(false);

        //@ts-ignore
        game.scenes = null;
    });

    test('Start Time', () => {

        const orig = SimpleCalendar.instance.element.find;

        SimpleCalendar.instance.element.find = jest.fn().mockReturnValue({
            removeClass: jest.fn().mockReturnValue({
                addClass: jest.fn()
            })
        });

        SimpleCalendar.instance.startTime();
        SimpleCalendar.instance.activeCalendar.year = y;
        SimpleCalendar.instance.startTime();
        expect(y.time.timeKeeper.getStatus()).toBe(TimeKeeperStatus.Started);
        SimpleCalendar.instance.activeCalendar.generalSettings.gameWorldTimeIntegration = GameWorldTimeIntegrations.Self;
        SimpleCalendar.instance.startTime();
        expect(y.time.timeKeeper.getStatus()).toBe(TimeKeeperStatus.Paused);
        //@ts-ignore
        game.combats.size = 1;
        SimpleCalendar.instance.startTime();
        expect(y.time.timeKeeper.getStatus()).toBe(TimeKeeperStatus.Paused);

        //@ts-ignore
        game.scenes = {active: null};
        SimpleCalendar.instance.startTime();
        expect(y.time.timeKeeper.getStatus()).toBe(TimeKeeperStatus.Paused);

        //@ts-ignore
        game.scenes = {active: {id: '123'}};
        //@ts-ignore
        game.combats.find = jest.fn((v)=>{
            //@ts-ignore
            return v.call(undefined, {started: true, scene: {id: "123"}});
        });
        SimpleCalendar.instance.startTime();
        expect(y.time.timeKeeper.getStatus()).toBe(TimeKeeperStatus.Paused);

        SimpleCalendar.instance.activeCalendar.generalSettings.gameWorldTimeIntegration = GameWorldTimeIntegrations.ThirdParty;
        //@ts-ignore
        game.combats.find = jest.fn((v)=>{
            return v.call(undefined, {started: true});
        });
        SimpleCalendar.instance.startTime();
        expect(y.time.timeKeeper.getStatus()).toBe(TimeKeeperStatus.Paused);

        SimpleCalendar.instance.element.find = orig;
    });

    test('Stop Time', () => {
        //y.time.keeper = 1;
        SimpleCalendar.instance.stopTime();
        //expect(y.time.keeper).toBe(1);
        SimpleCalendar.instance.activeCalendar.year = y;
        SimpleCalendar.instance.stopTime();
        expect(y.time.timeKeeper.getStatus()).toBe(TimeKeeperStatus.Stopped);
    });

    test('Time Keeping Check', async () => {
        await SimpleCalendar.instance.timeKeepingCheck();

        // @ts-ignore
        game.user.isGM = true;
        SimpleCalendar.instance.activeCalendar.year = y;
        await SimpleCalendar.instance.timeKeepingCheck();

        // @ts-ignore
        game.user.isGM = false;
    });

    test('Note Drag', () => {
        const e = new Event('drag');
        const tParent = document.createElement('div');
        tParent.appendChild((<HTMLElement>e.target));
        document.elementFromPoint = () => {return null};
        SimpleCalendar.instance.noteDrag(e);
        const sibling = document.createElement('div');
        document.elementFromPoint = () => {return sibling};
        SimpleCalendar.instance.noteDrag(e);
        (<HTMLElement>e.target).parentNode?.appendChild(sibling);
        SimpleCalendar.instance.noteDrag(e);
        expect((<HTMLElement>e.target).classList.contains('drag-active')).toBe(true);
    });

    test('Note Drag End', () => {
        const e = new Event('dragend');
        const tParent = document.createElement('div');
        tParent.appendChild((<HTMLElement>e.target));
        SimpleCalendar.instance.activeCalendar.year = y;
        SimpleCalendar.instance.activeCalendar.notes.push(new Note());
        SimpleCalendar.instance.activeCalendar.notes[0].year = 0;
        SimpleCalendar.instance.activeCalendar.notes[0].month = 1;
        SimpleCalendar.instance.activeCalendar.notes[0].day = 1;
        SimpleCalendar.instance.activeCalendar.notes[0].playerVisible = true;
        SimpleCalendar.instance.activeCalendar.notes[0].endDate = {year: 0, month: 1, day: 1, hour: 0, minute: 0, seconds: 0};
        SimpleCalendar.instance.noteDragEnd(e);

        (<HTMLElement>e.target).setAttribute('data-index', 'asd');
        SimpleCalendar.instance.noteDragEnd(e);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(0);

        (<HTMLElement>e.target).setAttribute('data-index', SimpleCalendar.instance.activeCalendar.notes[0].id);
        SimpleCalendar.instance.noteDragEnd(e);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(0);

        const orig = (<Game>game).settings.get;
        (<Game>game).settings.get =(moduleName: string, settingName: string) => { return [{id: SimpleCalendar.instance.activeCalendar.notes[0].id}];};
        SimpleCalendar.instance.noteDragEnd(e);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(0);
        (<Game>game).settings.get = orig;
    });

    test('Check Note Reminders', () => {
        // @ts-ignore
        game.user.isGM = true;
        SimpleCalendar.instance.checkNoteReminders();
        expect(ChatMessage.create).not.toHaveBeenCalled();

        SimpleCalendar.instance.activeCalendar.year = y;
        SimpleCalendar.instance.checkNoteReminders();
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
        SimpleCalendar.instance.activeCalendar.notes.push(n);

        //Tests for note that is only 1 day, does not repeat.
        SimpleCalendar.instance.checkNoteReminders();
        expect(ChatMessage.create).toHaveBeenCalledTimes(1);

        y.resetMonths();
        n.reminderSent = false;
        SimpleCalendar.instance.checkNoteReminders();
        expect(ChatMessage.create).toHaveBeenCalledTimes(2);

        y.months[0].current = true;
        y.months[0].days[1].current = true;
        n.reminderSent = false;
        //Current day is not the date of the note, not called
        SimpleCalendar.instance.checkNoteReminders();
        expect(ChatMessage.create).toHaveBeenCalledTimes(2);

        y.months[0].days[1].current = false;
        n.reminderSent = false;
        n.allDay = false;
        n.hour = 1;
        n.endDate.hour = 2;

        //Note at a specific time but current time is before the note, not called
        SimpleCalendar.instance.checkNoteReminders();
        expect(ChatMessage.create).toHaveBeenCalledTimes(2);

        n.reminderSent = false;
        n.minute = 1;
        y.time.seconds = 3600;
        //Note at a specific time, current time hour is equal to the hour but minutes are not, not called
        SimpleCalendar.instance.checkNoteReminders();
        expect(ChatMessage.create).toHaveBeenCalledTimes(2);

        n.reminderSent = false;
        y.time.seconds = 3660;
        //Note at a specific time, current time hour is equal and minutes are equal, called
        SimpleCalendar.instance.checkNoteReminders();
        expect(ChatMessage.create).toHaveBeenCalledTimes(3);

        n.reminderSent = false;
        y.time.seconds = 7261;
        //Note at a specific time, current time is greater than starting time, called
        SimpleCalendar.instance.checkNoteReminders();
        expect(ChatMessage.create).toHaveBeenCalledTimes(4);

        //Note repeats yearly
        n.repeats = NoteRepeat.Yearly;
        n.reminderSent = false;
        SimpleCalendar.instance.checkNoteReminders();
        expect(ChatMessage.create).toHaveBeenCalledTimes(5);
        y.numericRepresentation = 1;
        n.reminderSent = false;
        SimpleCalendar.instance.checkNoteReminders();
        expect(ChatMessage.create).toHaveBeenCalledTimes(6);

        //Note Repeats Monthly
        n.repeats = NoteRepeat.Monthly;
        n.reminderSent = false;
        y.numericRepresentation = 0;
        SimpleCalendar.instance.checkNoteReminders();
        expect(ChatMessage.create).toHaveBeenCalledTimes(7);
        y.resetMonths();
        y.months[1].current = true;
        y.months[1].days[0].current = true;
        SimpleCalendar.instance.checkNoteReminders();
        expect(ChatMessage.create).toHaveBeenCalledTimes(8);

        //Note Repeats Weekly
        n.repeats = NoteRepeat.Weekly;
        n.reminderSent = false;
        y.resetMonths();
        y.months[0].current = true;
        y.months[0].days[0].current = true;
        y.weekdays.push(new Weekday(1, 'W1'));
        y.weekdays.push(new Weekday(2, 'W2'));
        SimpleCalendar.instance.checkNoteReminders();
        expect(ChatMessage.create).toHaveBeenCalledTimes(9);
        y.months[0].days[0].current = false;
        y.months[0].days[2].current = true;
        SimpleCalendar.instance.checkNoteReminders();
        expect(ChatMessage.create).toHaveBeenCalledTimes(10);

        //Invalid Repeats
        //@ts-ignore
        n.repeats = 'asd';
        SimpleCalendar.instance.checkNoteReminders();
        expect(ChatMessage.create).toHaveBeenCalledTimes(10);

        //Note spans multiple days with a specific starting time but the time is earlier than the days current time but on a day in the middle
        n.repeats = NoteRepeat.Never;
        n.endDate.day = 3;
        n.reminderSent = false;
        y.resetMonths();
        y.months[0].current = true;
        y.months[0].days[1].current = true;
        y.time.seconds = 0;
        SimpleCalendar.instance.checkNoteReminders();
        expect(ChatMessage.create).toHaveBeenCalledTimes(11);

        // @ts-ignore
        game.user.isGM = false;
    });
});
