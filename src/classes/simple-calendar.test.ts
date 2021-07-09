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
import "../../__mocks__/hooks";


import SimpleCalendar from "./simple-calendar";
import Year from "./year";
import Month from "./month";
import {Note} from "./note";
import {GameWorldTimeIntegrations, SettingNames, SocketTypes, TimeKeeperStatus} from "../constants";
import {SimpleCalendarSocket} from "../interfaces";
import {SimpleCalendarConfiguration} from "./simple-calendar-configuration";
import {Weekday} from "./weekday";
import Mock = jest.Mock;
import SpyInstance = jest.SpyInstance;

jest.mock('./importer');

describe('Simple Calendar Class Tests', () => {
    let y: Year;
    let renderSpy: SpyInstance;

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
        y.months.push(new Month('M', 1, 0, 5));
        y.months.push(new Month('T', 2, 0, 15));

        y.selectedYear = 0;
        y.visibleYear = 0;
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
        expect(Object.keys(SimpleCalendar.instance).length).toBe(12); //Make sure no new properties have been added
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
        expect(SimpleCalendar.instance.currentYear).toBeNull();
        await SimpleCalendar.instance.init();
        expect(Handlebars.registerHelper).toHaveBeenCalledTimes(3);
        expect((<Game>game).settings.register).toHaveBeenCalledTimes(14);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(12);
        expect(SimpleCalendar.instance.currentYear?.numericRepresentation).toBe(0);
        expect(SimpleCalendar.instance.currentYear?.months.length).toBe(1);
        expect(SimpleCalendar.instance.currentYear?.months[0].days.length).toBe(2);
        expect(SimpleCalendar.instance.currentYear?.getMonth()?.numericRepresentation).toBe(1);
        expect(SimpleCalendar.instance.currentYear?.getMonth()?.getDay()?.numericRepresentation).toBe(2);

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
        expect((<Game>game).socket?.emit).toHaveBeenCalledTimes(0);
        // @ts-ignore
        game.user.isGM = true;
        SimpleCalendar.instance.currentYear = y;
        SimpleCalendar.instance.initializeSockets();
        // @ts-ignore
        expect(SimpleCalendar.instance.primaryCheckTimeout).toBeDefined();
        expect((<Game>game).socket?.emit).toHaveBeenCalledTimes(1);
        // @ts-ignore
        game.user.isGM = false;
    });

    test('Primary Check Timeout Call', async () => {
        SimpleCalendar.instance.currentYear = y;
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
        await SimpleCalendar.instance.processSocket(d);
        expect(renderSpy).toHaveBeenCalledTimes(0);

        SimpleCalendar.instance.currentYear = y;
        const orig = SimpleCalendar.instance.element;
        //@ts-ignore
        SimpleCalendar.instance.element = {
            find: jest.fn().mockReturnValue({
                removeClass: jest.fn().mockReturnValue({addClass: jest.fn()}),
                text: jest.fn()
            })
        }
        await SimpleCalendar.instance.processSocket(d);
        expect(renderSpy).toHaveBeenCalledTimes(0);
        //@ts-ignore
        SimpleCalendar.instance.element = orig;
        SimpleCalendar.instance.currentYear = null;

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
        expect((<Game>game).socket?.emit).toHaveBeenCalledTimes(1);
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
        SimpleCalendar.instance.currentYear = y;
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
        SimpleCalendar.instance.currentYear = y;
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
    });

    test('Get Data', async () => {
        let data = await SimpleCalendar.instance.getData();
        expect(data).toStrictEqual({
            "isGM": false,
            "changeDateTime": false,
            "isPrimary": false,
            "currentYear": {
                "clockClass": "stopped",
                "currentTime": {
                    "hour": "00",
                    "minute": "00",
                    "second": "00"
                },
                "display": "0",
                "firstWeekday": 0,
                "gameSystem": "other",
                "numericRepresentation": 0,
                "selectedDisplayDay": "",
                "selectedDisplayMonth": "",
                "selectedDisplayYear": "0",
                "selectedDayOfWeek": "",
                "selectedDayMoons": [],
                "selectedDayNotes": [],
                "showClock": true,
                "showDateControls": true,
                "showTimeControls": true,
                "showWeekdayHeaders": true,
                "visibleMonth": undefined,
                "weekdays": [],
                "currentSeasonColor": "",
                "currentSeasonName": "",
                "weeks": [],
                "yearNames": [],
                "yearNamesStart": 0,
                "yearNamingRule": "default",
                "yearZero": 0
            },
            "showCurrentDay": false,
            "showSelectedDay": false,
            "showSetCurrentDate": false,
            "notes": [],
            "addNotes": false,
            "reorderNotes": false,
            "clockClass": 'stopped',
            "timeUnits": {
                second: true,
                minute: false,
                hour: false
            },
            "compactView": false,
            "compactViewShowNotes": false
        });
        SimpleCalendar.instance.currentYear = y;
        SimpleCalendar.instance.notes.push(new Note());
        SimpleCalendar.instance.notes[0].playerVisible = true;
        SimpleCalendar.instance.notes[0].year = 0;
        SimpleCalendar.instance.notes[0].month = 1;
        SimpleCalendar.instance.notes[0].day = 1;
        SimpleCalendar.instance.notes[0].endDate = {year: 0, month: 1, day: 1, hour: 0, minute: 0, seconds: 0};
        //Nothing Undefined
        data = await SimpleCalendar.instance.getData();
        expect(data.isGM).toBe(false);
        expect(data.currentYear).toStrictEqual(y.toTemplate());
        expect(data.showSelectedDay).toBe(true);
        expect(data.showCurrentDay).toBe(true);
        expect(data.showSetCurrentDate).toBe(false);
        expect(data.notes.length).toStrictEqual(1);

        // @ts-ignore
        game.user.isGM = true;
        y.months[0].days[0].current = false;
        data = await SimpleCalendar.instance.getData();
        expect(data.showSetCurrentDate).toBe(true);

        y.months[0].selected = false;
        data = await SimpleCalendar.instance.getData();
        expect(data.showSetCurrentDate).toBe(false);

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
        SimpleCalendar.instance.currentYear = y;
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
    });

    test('Show App', () => {
        SimpleCalendar.instance.showApp();
        expect(renderSpy).not.toHaveBeenCalled();
        SimpleCalendar.instance.currentYear = y;
        SimpleCalendar.instance.showApp();
        expect(renderSpy).toHaveBeenCalled();
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

        SimpleCalendar.instance.currentYear = y;
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

        SimpleCalendar.instance.currentYear = y;
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

        SimpleCalendar.instance.currentYear.showWeekdayHeadings = false;

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
        expect(fakeQuery.find).toHaveBeenCalledTimes(19);
        expect(onFunc).toHaveBeenCalledTimes(13);

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
        expect(fakeQuery.find).toHaveBeenCalledTimes(19);
        expect(onFunc).toHaveBeenCalledTimes(26);

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
        expect(onFunc).toHaveBeenCalledTimes(33);
    });

    test('Show Compact Notes', () => {
        SimpleCalendar.instance.showCompactNotes(new Event('click'));
        expect(SimpleCalendar.instance.compactViewShowNotes).toBe(true);
        expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    test('View Previous Month', () => {
        SimpleCalendar.instance.viewPreviousMonth(new Event('click'));
        expect(renderSpy).not.toHaveBeenCalled();
        SimpleCalendar.instance.currentYear = y;
        SimpleCalendar.instance.viewPreviousMonth(new Event('click'));
        expect(renderSpy).toHaveBeenCalled();
    });

    test('View Next Month', () => {
        SimpleCalendar.instance.viewNextMonth(new Event('click'));
        expect(renderSpy).not.toHaveBeenCalled();
        SimpleCalendar.instance.currentYear = y;
        SimpleCalendar.instance.viewNextMonth(new Event('click'));
        expect(renderSpy).toHaveBeenCalled();
    });

    test('Day Click', () => {
        const event = new Event('click');
        SimpleCalendar.instance.currentYear = y;
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
        expect(SimpleCalendar.instance.currentYear.months[0].days[1].selected).toBe(true);

        SimpleCalendar.instance.currentYear.months[0].selected = false;
        (<HTMLElement>event.target).setAttribute('data-day', '1');
        SimpleCalendar.instance.dayClick(event);
        expect(renderSpy).toHaveBeenCalledTimes(2);
        expect(SimpleCalendar.instance.currentYear.months[0].days[1].selected).toBe(false);
        expect(SimpleCalendar.instance.currentYear.months[0].days[0].selected).toBe(true);

        SimpleCalendar.instance.currentYear.months[0].selected = false;
        (<HTMLElement>event.target).setAttribute('data-day', '3');
        SimpleCalendar.instance.currentYear.months[0].days[0].selected = false;
        SimpleCalendar.instance.currentYear.months[0].days = [SimpleCalendar.instance.currentYear.months[0].days[0],SimpleCalendar.instance.currentYear.months[0].days[1]];
        SimpleCalendar.instance.dayClick(event);
        expect(renderSpy).toHaveBeenCalledTimes(3);
        expect(SimpleCalendar.instance.currentYear.months[0].days[1].selected).toBe(false);
        expect(SimpleCalendar.instance.currentYear.months[0].days[0].selected).toBe(false);

        SimpleCalendar.instance.currentYear.months[0].visible = false;
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
        SimpleCalendar.instance.todayClick(event);
        expect(renderSpy).not.toHaveBeenCalled();
        SimpleCalendar.instance.currentYear = y;
        SimpleCalendar.instance.currentYear.months[0].current = false;
        SimpleCalendar.instance.currentYear.months[0].visible = false;
        SimpleCalendar.instance.currentYear.months[0].selected = false;
        SimpleCalendar.instance.currentYear.months[0].days[0].current = false;
        SimpleCalendar.instance.currentYear.months[0].days[0].selected = false;
        SimpleCalendar.instance.todayClick(event);
        expect(renderSpy).not.toHaveBeenCalled();
        SimpleCalendar.instance.currentYear.months[0].current = true;
        SimpleCalendar.instance.todayClick(event);
        expect(renderSpy).not.toHaveBeenCalled();
        SimpleCalendar.instance.currentYear.months[0].days[0].current = true;
        SimpleCalendar.instance.currentYear.months[0].days[1].selected = true;
        SimpleCalendar.instance.todayClick(event);
        expect(renderSpy).toHaveBeenCalled();
        expect(SimpleCalendar.instance.currentYear.months[0].visible).toBe(true);
        expect(SimpleCalendar.instance.currentYear.months[0].selected).toBe(true);
        expect(SimpleCalendar.instance.currentYear.months[0].days[0].selected).toBe(true);

        SimpleCalendar.instance.currentYear.months[0].visible = false;
        SimpleCalendar.instance.currentYear.months[0].selected = false;
        SimpleCalendar.instance.currentYear.months[1].visible = true;
        SimpleCalendar.instance.currentYear.months[1].selected = true;
        SimpleCalendar.instance.currentYear.months[0].days[0].selected = false;
        SimpleCalendar.instance.currentYear.months[1].days[0].selected = false;
        SimpleCalendar.instance.todayClick(event);
        expect(renderSpy).toHaveBeenCalled();
        expect(SimpleCalendar.instance.currentYear.months[0].visible).toBe(true);
        expect(SimpleCalendar.instance.currentYear.months[0].selected).toBe(true);
        expect(SimpleCalendar.instance.currentYear.months[0].days[0].selected).toBe(true);

        SimpleCalendar.instance.currentYear.months[0].visible = false;
        SimpleCalendar.instance.currentYear.months[0].selected = false;
        SimpleCalendar.instance.currentYear.months[1].visible = true;
        SimpleCalendar.instance.currentYear.months[1].selected = true;
        SimpleCalendar.instance.currentYear.months[0].days[0].selected = false;
        SimpleCalendar.instance.currentYear.months[1].days[0].selected = true;
        SimpleCalendar.instance.todayClick(event);
        expect(renderSpy).toHaveBeenCalled();
        expect(SimpleCalendar.instance.currentYear.months[0].visible).toBe(true);
        expect(SimpleCalendar.instance.currentYear.months[0].selected).toBe(true);
        expect(SimpleCalendar.instance.currentYear.months[0].days[0].selected).toBe(true);
    });

    test('Compact Time Control Click', () => {
        let e = new Event('click');
        //No Current Year
        SimpleCalendar.instance.compactTimeControlClick(e);
        expect(y.time.seconds).toBe(0);

        //No Attributes
        SimpleCalendar.instance.currentYear = y;
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

        //@ts-ignore
        game.user.isGM = false;
    });

    test('Time Unit Click', () => {
        let e = new Event('click');
        (<HTMLElement>e.currentTarget).setAttribute('data-type', 'second');
        SimpleCalendar.instance.timeUnitClick(e);
        expect(renderSpy).toHaveBeenCalledTimes(0);
        SimpleCalendar.instance.currentYear = y;
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
        SimpleCalendar.instance.currentYear = y;
        SimpleCalendar.instance.primary = true;
        // @ts-ignore
        game.user.isGM = true;
        //Test Each with current year set to null
        (<HTMLElement>event.currentTarget).setAttribute('data-type', 'day');
        SimpleCalendar.instance.gmControlClick(event);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(2);

        (<HTMLElement>event.currentTarget).setAttribute('data-type', 'month');
        SimpleCalendar.instance.gmControlClick(event);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(3);

        (<HTMLElement>event.currentTarget).setAttribute('data-type', 'year');
        SimpleCalendar.instance.gmControlClick(event);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(4);

        //Test with current year set
        SimpleCalendar.instance.currentYear = y;
        (<HTMLElement>event.currentTarget).classList.remove('next');
        (<HTMLElement>event.currentTarget).setAttribute('data-type', 'day');
        SimpleCalendar.instance.gmControlClick(event);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(5);

        (<HTMLElement>event.currentTarget).setAttribute('data-type', 'month');
        SimpleCalendar.instance.gmControlClick(event);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(6);
        (<HTMLElement>event.currentTarget).classList.add('next');
        SimpleCalendar.instance.gmControlClick(event);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(7);
        (<HTMLElement>event.currentTarget).classList.remove('next');

        (<HTMLElement>event.currentTarget).setAttribute('data-type', 'year');
        SimpleCalendar.instance.gmControlClick(event);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(8);

        (<HTMLElement>event.currentTarget).classList.add('next');
        SimpleCalendar.instance.gmControlClick(event);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(9);

        (<HTMLElement>event.currentTarget).setAttribute('data-type', 'time');
        SimpleCalendar.instance.gmControlClick(event);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(9);

        (<HTMLElement>event.currentTarget).setAttribute('data-amount', 'asd');
        SimpleCalendar.instance.gmControlClick(event);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(9);

        (<HTMLElement>event.currentTarget).setAttribute('data-amount', '1');
        SimpleCalendar.instance.gmControlClick(event);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(10);

        (<HTMLElement>event.currentTarget).classList.remove('next');
        SimpleCalendar.instance.timeUnits.second = false;
        SimpleCalendar.instance.timeUnits.minute = true;
        SimpleCalendar.instance.gmControlClick(event);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(11);

        SimpleCalendar.instance.timeUnits.second = false;
        SimpleCalendar.instance.timeUnits.minute = false;
        SimpleCalendar.instance.timeUnits.hour = true;
        SimpleCalendar.instance.gmControlClick(event);
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(12);

        // @ts-ignore
        game.user.isGM = false;
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

    test('Date Control Apply', () => {
        // @ts-ignore
        game.user.isGM = true;
        const event = new Event('click');
        SimpleCalendar.instance.dateControlApply(event);
        expect((<Game>game).settings.set).not.toHaveBeenCalled();

        SimpleCalendar.instance.currentYear = y;
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
        expect(ui.notifications.warn).toHaveBeenCalledTimes(2);
        (<Mock>(<Game>game).settings.set).mockReset();
    });

    test('Set Current Date', () => {
        SimpleCalendar.instance.setCurrentDate(1, y.months[1], y.months[1].days[0]);
        expect(y.months[0].current).toBe(true);
        expect(y.months[0].days[0].current).toBe(true);

        // @ts-ignore
        game.user.isGM = true;
        SimpleCalendar.instance.currentYear = y;
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

    test('Configuration Click', () => {
        // @ts-ignore
        game.user.isGM = true;
        const event = new Event('click');
        SimpleCalendar.instance.configurationClick(event);
        expect(console.error).toHaveBeenCalledTimes(1);
        SimpleCalendar.instance.currentYear = y;
        SimpleCalendar.instance.configurationClick(event);
        SimpleCalendarConfiguration.instance = new SimpleCalendarConfiguration(y);
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
        SimpleCalendar.instance.addNote(event);
        expect(console.error).toHaveBeenCalledTimes(1);
        SimpleCalendar.instance.currentYear = y;
        SimpleCalendar.instance.currentYear.months[0].current = false;
        SimpleCalendar.instance.currentYear.months[0].selected = false;
        SimpleCalendar.instance.currentYear.months[0].days[0].current = false;
        SimpleCalendar.instance.currentYear.months[0].days[0].selected = false;

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
        SimpleCalendar.instance.currentYear.months[0].current = true;
        SimpleCalendar.instance.addNote(event);
        //@ts-ignore
        expect(ui.notifications.warn).toHaveBeenCalledTimes(4);

        //Current and Selected Month, current day but no selected day
        SimpleCalendar.instance.currentYear.months[0].selected = true;
        SimpleCalendar.instance.currentYear.months[0].days[0].current = true;
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
        SimpleCalendar.instance.notes.push(note);

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
        SimpleCalendar.instance.currentYear = null;
        SimpleCalendar.instance.settingUpdate(true, 'leapyear');
        expect(renderSpy).toHaveBeenCalledTimes(7);

    });

    test('Load General Settings', () => {
        //@ts-ignore
        SimpleCalendar.instance.loadGeneralSettings();
        expect(console.error).toHaveBeenCalledTimes(1);

        SimpleCalendar.instance.currentYear = y;
        //@ts-ignore
        SimpleCalendar.instance.loadGeneralSettings();

        const orig = (<Game>game).settings.get;
        (<Game>game).settings.get =(moduleName: string, settingName: string) => { return {gameWorldTimeIntegration: GameWorldTimeIntegrations.None, showClock: false, playersAddNotes: false};};
        //@ts-ignore
        SimpleCalendar.instance.loadGeneralSettings();
        expect(y.generalSettings.pf2eSync).toBe(true);

        (<Game>game).settings.get =(moduleName: string, settingName: string) => { return {gameWorldTimeIntegration: GameWorldTimeIntegrations.None, showClock: false};};
        //@ts-ignore
        SimpleCalendar.instance.loadGeneralSettings();
        expect(y.generalSettings.permissions.addNotes.player).toBe(false);

        (<Game>game).settings.get =(moduleName: string, settingName: string) => { return {permissions: {}};};
        //@ts-ignore
        SimpleCalendar.instance.loadGeneralSettings();
        expect(y.generalSettings.permissions.reorderNotes).toStrictEqual({player: false, trustedPlayer: false, assistantGameMaster: false, users: undefined});

        (<Game>game).settings.get = orig;
    });

    test('Load Year Configuration', () => {
        SimpleCalendar.instance.settingUpdate();
        expect(SimpleCalendar.instance.currentYear?.numericRepresentation).toBe(0);
        expect(SimpleCalendar.instance.currentYear?.prefix).toBe('');
        expect(SimpleCalendar.instance.currentYear?.postfix).toBe('');
        expect(SimpleCalendar.instance.currentYear?.showWeekdayHeadings).toBe(true);
        SimpleCalendar.instance.settingUpdate();
        expect(SimpleCalendar.instance.currentYear?.numericRepresentation).toBe(0);
        const orig = (<Game>game).settings.get;
        (<Game>game).settings.get =(moduleName: string, settingName: string) => { return {};};
        SimpleCalendar.instance.settingUpdate();
        expect(SimpleCalendar.instance.currentYear?.numericRepresentation).toBe(new Date().getFullYear());
        expect(SimpleCalendar.instance.currentYear?.prefix).toBe('');
        expect(SimpleCalendar.instance.currentYear?.postfix).toBe('');
        expect(SimpleCalendar.instance.currentYear?.showWeekdayHeadings).toBe(true);
        (<Game>game).settings.get =(moduleName: string, settingName: string) => { return {numericRepresentation: 0, prefix: '', postfix: ''};};
        //@ts-ignore
        SimpleCalendar.instance.loadYearConfiguration();
        expect(SimpleCalendar.instance.currentYear?.numericRepresentation).toBe(0);
        expect(SimpleCalendar.instance.currentYear?.prefix).toBe('');
        expect(SimpleCalendar.instance.currentYear?.postfix).toBe('');
        expect(SimpleCalendar.instance.currentYear?.showWeekdayHeadings).toBe(true);
        (<Game>game).settings.get = orig;
    });

    test('Load Month/Weekday Configuration', () => {
        const orig = (<Game>game).settings.get;
        SimpleCalendar.instance.settingUpdate();
        expect(SimpleCalendar.instance.currentYear?.months.length).toBe(1);
        expect(SimpleCalendar.instance.currentYear?.months[0].numericRepresentation).toBe(1);
        expect(SimpleCalendar.instance.currentYear?.months[0].name).toBe('1');
        expect(SimpleCalendar.instance.currentYear?.months[0].days.length).toBe(2);
        expect(SimpleCalendar.instance.currentYear?.weekdays.length).toBe(1);
        if(SimpleCalendar.instance.currentYear){
            SimpleCalendar.instance.currentYear.months = [];
            (<Game>game).settings.get = (moduleName: string, settingName: string) => {
                switch (settingName){
                case SettingNames.YearConfiguration:
                    return {numericRepresentation: 0, prefix: '', postfix: ''};
                case SettingNames.MonthConfiguration:
                    return [[{}]];
                default:
                    return null;
            }};
            SimpleCalendar.instance.settingUpdate();
            expect(SimpleCalendar.instance.currentYear?.months.length).toBe(12);
            expect(SimpleCalendar.instance.currentYear?.months[0].numericRepresentation).toBe(1);
            expect(SimpleCalendar.instance.currentYear?.months[0].name).toBe('January');
            expect(SimpleCalendar.instance.currentYear?.months[0].days.length).toBe(31);
            expect(SimpleCalendar.instance.currentYear?.weekdays.length).toBe(7);

            SimpleCalendar.instance.currentYear.months = [];
            (<Game>game).settings.get = (moduleName: string, settingName: string) => {
                switch (settingName){
                    case SettingNames.YearConfiguration:
                        return {numericRepresentation: 0, prefix: '', postfix: ''};
                    case SettingNames.MonthConfiguration:
                        return [[]];
                    default:
                        return null;
                }};
            SimpleCalendar.instance.settingUpdate();
            expect(SimpleCalendar.instance.currentYear?.months.length).toBe(12);
            expect(SimpleCalendar.instance.currentYear?.months[0].numericRepresentation).toBe(1);
            expect(SimpleCalendar.instance.currentYear?.months[0].name).toBe('January');
            expect(SimpleCalendar.instance.currentYear?.months[0].days.length).toBe(31);

            SimpleCalendar.instance.currentYear.months = [];
            //@ts-ignore
            jest.spyOn(SimpleCalendar.instance, 'loadYearConfiguration').mockImplementation();
            SimpleCalendar.instance.currentYear = null;
            SimpleCalendar.instance.settingUpdate();
            expect(SimpleCalendar.instance.currentYear).toBeNull();
            //@ts-ignore
            (<Mock>SimpleCalendar.instance.loadYearConfiguration).mockReset()
        }
        (<Game>game).settings.get = orig;
    });

    test('Load Current Date', () => {
        const orig = (<Game>game).settings.get;
        SimpleCalendar.instance.settingUpdate();
        expect(SimpleCalendar.instance.currentYear?.numericRepresentation).toBe(0);
        expect(SimpleCalendar.instance.currentYear?.months[0].current).toBe(true);
        expect(SimpleCalendar.instance.currentYear?.months[0].days[1].current).toBe(true);

        (<Game>game).settings.get = (moduleName: string, settingName: string) => {
            switch (settingName){
                case SettingNames.AllowPlayersToAddNotes:
                    return false;
                case SettingNames.YearConfiguration:
                    return {numericRepresentation: 0, prefix: '', postfix: ''};
                case SettingNames.MonthConfiguration:
                    return [[{numericRepresentation: 1, numberOfDays: 2, name: ''}]];
                case SettingNames.WeekdayConfiguration:
                    return [[{numericRepresentation: 0, name: ''}]];
                case SettingNames.CurrentDate:
                    return {year: 0, month: 1, day: 200};
                case SettingNames.Notes:
                    return [[{year: 0, month: 1, day: 2, title:'', content:'', author:''}]];
                default:
                    return null;
            }};

        SimpleCalendar.instance.settingUpdate();
        expect(SimpleCalendar.instance.currentYear?.numericRepresentation).toBe(0);
        expect(SimpleCalendar.instance.currentYear?.months[0].current).toBe(true);
        expect(SimpleCalendar.instance.currentYear?.months[0].days[0].current).toBe(true);
        expect(console.error).toHaveBeenCalledTimes(1);

        (<Game>game).settings.get = (moduleName: string, settingName: string) => {
            switch (settingName){
                case SettingNames.AllowPlayersToAddNotes:
                    return false;
                case SettingNames.YearConfiguration:
                    return {numericRepresentation: 0, prefix: '', postfix: ''};
                case SettingNames.MonthConfiguration:
                    return [[{numericRepresentation: 1, numberOfDays: 2, name: ''}]];
                case SettingNames.WeekdayConfiguration:
                    return [[{numericRepresentation: 0, name: ''}]];
                case SettingNames.CurrentDate:
                    return {year: 0, month: 100, day: 200};
                case SettingNames.Notes:
                    return [[{year: 0, month: 1, day: 2, title:'', content:'', author:''}]];
                default:
                    return null;
            }};
        SimpleCalendar.instance.settingUpdate();
        expect(SimpleCalendar.instance.currentYear?.numericRepresentation).toBe(0);
        expect(SimpleCalendar.instance.currentYear?.months[0].current).toBe(true);
        expect(SimpleCalendar.instance.currentYear?.months[0].days[0].current).toBe(true);
        expect(console.error).toHaveBeenCalledTimes(2);

        (<Game>game).settings.get = (moduleName: string, settingName: string) => {
            switch (settingName){
                case SettingNames.AllowPlayersToAddNotes:
                    return false;
                case SettingNames.YearConfiguration:
                    return {numericRepresentation: 0, prefix: '', postfix: ''};
                case SettingNames.MonthConfiguration:
                    return [[{numericRepresentation: 1, numberOfDays: "asd", numberOfLeapYearDays: "asd", name: ''}]];
                case SettingNames.WeekdayConfiguration:
                    return [[{numericRepresentation: 0, name: ''}]];
                case SettingNames.CurrentDate:
                    return {};
                case SettingNames.Notes:
                    return [[{year: 0, month: 1, day: 2, title:'', content:'', author:''}]];
                default:
                    return null;
            }};
        //@ts-ignore
        SimpleCalendar.instance.settingUpdate();
        expect(SimpleCalendar.instance.currentYear?.numericRepresentation).toBe(0);
        expect(SimpleCalendar.instance.currentYear?.months[0].current).toBe(true);
        expect(SimpleCalendar.instance.currentYear?.months[0].days[0].current).toBe(true);
        expect(console.error).toHaveBeenCalledTimes(2);

        (<Game>game).settings.get = (moduleName: string, settingName: string) => {return null;};
        //@ts-ignore
        jest.spyOn(SimpleCalendar.instance, 'loadYearConfiguration').mockImplementation();
        SimpleCalendar.instance.currentYear = null;
        SimpleCalendar.instance.settingUpdate();
        expect(SimpleCalendar.instance.currentYear).toBeNull();
        expect(console.error).toHaveBeenCalledTimes(8);
        //@ts-ignore
        (<Mock>SimpleCalendar.instance.loadYearConfiguration).mockReset();
        (<Game>game).settings.get = orig;
    });

    test('Load  Time Configuration', () => {
        const orig = (<Game>game).settings.get;
        //@ts-ignore
        SimpleCalendar.instance.loadTimeConfiguration();
        expect(console.error).toHaveBeenCalledTimes(1);

        SimpleCalendar.instance.currentYear = y;
        (<Game>game).settings.get = () => {return null;}
        //@ts-ignore
        SimpleCalendar.instance.loadTimeConfiguration();
        (<Game>game).settings.get = () => {return {};}
        //@ts-ignore
        SimpleCalendar.instance.loadTimeConfiguration();

        (<Game>game).settings.get = () => {return {hoursInDay: 1, minutesInHour: 1, secondsInMinute: 1, gameTimeRatio: 1};}
        //@ts-ignore
        SimpleCalendar.instance.loadTimeConfiguration();
        expect(y.time.hoursInDay).toBe(1);
        expect(y.time.minutesInHour).toBe(1);
        expect(y.time.secondsInMinute).toBe(1);
        expect(y.time.gameTimeRatio).toBe(1);

        (<Game>game).settings.get = orig;

        //@ts-ignore
        SimpleCalendar.instance.loadTimeConfiguration();
        expect(y.time.unifyGameAndClockPause).toBe(false);
        expect(y.time.updateFrequency).toBe(1);
        expect(y.time.timeKeeper.updateFrequency).toBe(1);

    });

    test('Load Notes', () => {
        SimpleCalendar.instance.loadNotes();
        expect(SimpleCalendar.instance.notes.length).toBe(1);

        SimpleCalendar.instance.loadNotes(true);
        expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    test('Get Notes For Day', () => {
        //@ts-ignore
        expect(SimpleCalendar.instance.getNotesForDay()).toStrictEqual([]);
        SimpleCalendar.instance.settingUpdate();
        //@ts-ignore
        expect(SimpleCalendar.instance.getNotesForDay().length).toStrictEqual(0);
        SimpleCalendar.instance.notes[0].playerVisible = true;
        //@ts-ignore
        expect(SimpleCalendar.instance.getNotesForDay().length).toStrictEqual(1);

        if(SimpleCalendar.instance.currentYear){
            SimpleCalendar.instance.currentYear.months[0].resetDays();
            SimpleCalendar.instance.currentYear.months[0].resetDays('selected');
            //@ts-ignore
            expect(SimpleCalendar.instance.getNotesForDay().length).toStrictEqual(0);
            SimpleCalendar.instance.currentYear.resetMonths();
            SimpleCalendar.instance.currentYear.resetMonths('selected');
            //@ts-ignore
            expect(SimpleCalendar.instance.getNotesForDay().length).toStrictEqual(0);
        }

    });

    test('Day Note Sort', () => {
        //@ts-ignore
        expect(SimpleCalendar.dayNoteSort(new Note(), new Note())).toBe(0);
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
        SimpleCalendar.instance.currentYear = y;
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
        SimpleCalendar.instance.currentYear = y;
        SimpleCalendar.instance.worldTimeUpdate(100, 10);
        expect(y.time.seconds).toBe(100);
    });

    test('Combat Update', () => {
        //@ts-ignore
        SimpleCalendar.instance.combatUpdate({started: true}, {}, {advanceTime: 2});
        SimpleCalendar.instance.currentYear = y;
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
        game.scenes = null;
    });

    test('Combat Delete', () => {
        SimpleCalendar.instance.combatDelete();
        SimpleCalendar.instance.currentYear = y;
        y.time.combatRunning = true;
        SimpleCalendar.instance.combatDelete();
        expect(y.time.combatRunning).toBe(false);
    });

    test('Start Time', () => {

        const orig = SimpleCalendar.instance.element.find;

        SimpleCalendar.instance.element.find = jest.fn().mockReturnValue({
            removeClass: jest.fn().mockReturnValue({
                addClass: jest.fn()
            })
        });

        SimpleCalendar.instance.startTime();
        SimpleCalendar.instance.currentYear = y;
        SimpleCalendar.instance.startTime();
        expect(y.time.timeKeeper.getStatus()).toBe(TimeKeeperStatus.Started);
        y.generalSettings.gameWorldTimeIntegration = GameWorldTimeIntegrations.Self;
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

        y.generalSettings.gameWorldTimeIntegration = GameWorldTimeIntegrations.None;
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
        SimpleCalendar.instance.currentYear = y;
        SimpleCalendar.instance.stopTime();
        expect(y.time.timeKeeper.getStatus()).toBe(TimeKeeperStatus.Stopped);
    });

    test('Time Keeping Check', async () => {
        (<Mock>(<Game>game).settings.get).mockClear();
        await SimpleCalendar.instance.timeKeepingCheck();
        expect((<Game>game).settings.get).not.toHaveBeenCalled();

        SimpleCalendar.instance.currentYear = y;
        await SimpleCalendar.instance.timeKeepingCheck();
        expect((<Game>game).settings.get).not.toHaveBeenCalled();

        //@ts-ignore
        game.user.isGM = true;
        (<Mock>(<Game>game).settings.get).mockReturnValueOnce(true);
        y.generalSettings.gameWorldTimeIntegration = GameWorldTimeIntegrations.Self;
        await SimpleCalendar.instance.timeKeepingCheck();
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(1);

        (<Mock>(<Game>game).modules.get)
            .mockReturnValueOnce(null).mockReturnValueOnce(null)
            .mockReturnValueOnce(null).mockReturnValueOnce({active:true})
            .mockReturnValueOnce({active:true}).mockReturnValueOnce(null);
        await SimpleCalendar.instance.timeKeepingCheck();
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(2);

        await SimpleCalendar.instance.timeKeepingCheck();
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(3);
        //@ts-ignore
        expect(DialogRenderer).toHaveBeenCalledTimes(3);
        await SimpleCalendar.instance.timeKeepingCheck();
        expect((<Game>game).settings.get).toHaveBeenCalledTimes(4);
        //@ts-ignore
        expect(DialogRenderer).toHaveBeenCalledTimes(4);
    });

    test('Module Import Click', async () => {
        //@ts-ignore
        game.user.isGM = true;
        await SimpleCalendar.instance.moduleImportClick('asd');
        expect(console.error).toHaveBeenCalledTimes(1);
        SimpleCalendar.instance.currentYear = y;

        await SimpleCalendar.instance.moduleImportClick('asd');
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(1);
        await SimpleCalendar.instance.moduleImportClick('about-time');
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(2);
        expect(renderSpy).toHaveBeenCalledTimes(1);
        await SimpleCalendar.instance.moduleImportClick('calendar-weather');
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(3);
        expect(renderSpy).toHaveBeenCalledTimes(2);
    });

    test('Module Export Click', async () => {
        //@ts-ignore
        game.user.isGM = true;
        await SimpleCalendar.instance.moduleExportClick('asd');
        expect(console.error).toHaveBeenCalledTimes(1);
        SimpleCalendar.instance.currentYear = y;

        await SimpleCalendar.instance.moduleExportClick('asd');
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(1);
        await SimpleCalendar.instance.moduleExportClick('about-time');
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(2);
        await SimpleCalendar.instance.moduleExportClick('calendar-weather');
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(3);
    });

    test('Module Dialog No Change', async () => {
        (<Mock>(<Game>game).settings.set).mockClear();
        //@ts-ignore
        game.user.isGM = false;
        await SimpleCalendar.instance.moduleDialogNoChangeClick();
        expect((<Game>game).settings.set).not.toHaveBeenCalled();
        //@ts-ignore
        game.user.isGM = true;
        await SimpleCalendar.instance.moduleDialogNoChangeClick();
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(1);
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
        SimpleCalendar.instance.currentYear = y;
        SimpleCalendar.instance.notes.push(new Note());
        SimpleCalendar.instance.notes[0].year = 0;
        SimpleCalendar.instance.notes[0].month = 1;
        SimpleCalendar.instance.notes[0].day = 1;
        SimpleCalendar.instance.notes[0].playerVisible = true;
        SimpleCalendar.instance.notes[0].endDate = {year: 0, month: 1, day: 1, hour: 0, minute: 0, seconds: 0};
        SimpleCalendar.instance.noteDragEnd(e);

        (<HTMLElement>e.target).setAttribute('data-index', 'asd');
        SimpleCalendar.instance.noteDragEnd(e);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(1);

        (<HTMLElement>e.target).setAttribute('data-index', SimpleCalendar.instance.notes[0].id);
        SimpleCalendar.instance.noteDragEnd(e);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(2);

        const orig = (<Game>game).settings.get;
        (<Game>game).settings.get =(moduleName: string, settingName: string) => { return [{id: SimpleCalendar.instance.notes[0].id}];};
        SimpleCalendar.instance.noteDragEnd(e);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(3);
        (<Game>game).settings.get = orig;
    });
});
