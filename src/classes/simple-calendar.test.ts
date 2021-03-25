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


import SimpleCalendar from "./simple-calendar";
import Year from "./year";
import Month from "./month";
import {Note} from "./note";
import {GameWorldTimeIntegrations, LeapYearRules, SettingNames, SocketTypes} from "../constants";
import {SimpleCalendarSocket} from "../interfaces";
import {SimpleCalendarConfiguration} from "./simple-calendar-configuration";
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
        (<Mock>game.settings.get).mockClear();
        (<Mock>game.settings.set).mockClear();
        (<Mock>game.socket.emit).mockClear();
        //@ts-ignore
        (<Mock>ui.notifications.warn).mockClear();


        y = new Year(0);
        y.months.push(new Month('M', 1, 5));
        y.months.push(new Month('T', 2, 15));

        y.selectedYear = 0;
        y.visibleYear = 0;
        y.months[0].current = true;
        y.months[0].selected = true;
        y.months[0].visible = true;
        y.months[0].days[0].current = true;
        y.months[0].days[0].selected = true;
    });

    test('Properties', () => {
        expect(Object.keys(SimpleCalendar.instance).length).toBe(7); //Make sure no new properties have been added
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
        expect(game.settings.register).toHaveBeenCalledTimes(10);
        expect(game.settings.get).toHaveBeenCalledTimes(9);
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
        expect(SimpleCalendar.instance.primaryCheckTimeout).toBeDefined();
        expect(game.socket.emit).toHaveBeenCalledTimes(1);
        // @ts-ignore
        game.user.isGM = false;
    });

    test('Primary Check Timeout Call', () => {
        SimpleCalendar.instance.primaryCheckTimeoutCall();
        expect(SimpleCalendar.instance.primary).toBe(true);
        expect(game.socket.emit).toHaveBeenCalledTimes(1);
    })

    test('Process Socket', async () => {
        const d: SimpleCalendarSocket.Data = {
            type: SocketTypes.time,
            data: {
                clockClass: ''
            }
        };
        await SimpleCalendar.instance.processSocket(d);
        expect(renderSpy).toHaveBeenCalledTimes(1);

        d.type = SocketTypes.journal;
        d.data = {notes: []};
        await SimpleCalendar.instance.processSocket(d);
        expect(renderSpy).toHaveBeenCalledTimes(1);

        // @ts-ignore
        game.user.isGM = true;
        SimpleCalendar.instance.primary = true;
        await SimpleCalendar.instance.processSocket(d);
        expect(renderSpy).toHaveBeenCalledTimes(1);

        // @ts-ignore
        game.user.isGM = false;

        d.type = SocketTypes.primary;
        await SimpleCalendar.instance.processSocket(d);
        expect(renderSpy).toHaveBeenCalledTimes(1);

        //@ts-ignore
        d.type = 'asd';
        await SimpleCalendar.instance.processSocket(d);
        expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    test('Get Data', async () => {
        let data = await SimpleCalendar.instance.getData();
        expect(data).toStrictEqual({
            "isGM": false,
            "isPrimary": false,
            "currentYear": {
                "clockClass": "stopped",
                "currentTime": {
                    "hour": "00",
                    "minute": "00",
                    "second": "00"
                },
                "display": "0",
                "numericRepresentation": 0,
                "selectedDisplayDay": "",
                "selectedDisplayMonth": "",
                "selectedDisplayYear": "0",
                "showClock": false,
                "showDateControls": true,
                "showTimeControls": false,
                "showWeekdayHeaders": true,
                "visibleMonth": undefined,
                "visibleMonthWeekOffset": [],
                "weekdays": []
            },
            "showCurrentDay": false,
            "showSelectedDay": false,
            "notes": [],
            "addNotes": false,
            "clockClass": 'stopped',
            "timeUnits": {
                second: true,
                minute: false,
                hour: false
            }

        });
        SimpleCalendar.instance.currentYear = y;
        //Nothing Undefined
        data = await SimpleCalendar.instance.getData();
        expect(data.isGM).toBe(false);
        expect(data.currentYear).toStrictEqual(y.toTemplate());
        expect(data.showSelectedDay).toBe(true);
        expect(data.showCurrentDay).toBe(true);
        expect(data.notes).toStrictEqual([]);
    });

    test('Get Scene Control Buttons', () => {
        const controls: any[] = [{name:'test', tools:[]}];
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

    test('Macro Show', () => {
        SimpleCalendar.instance.macroShow();
        expect(renderSpy).toHaveBeenCalledTimes(0);
        expect(console.error).toHaveBeenCalledTimes(1);

        SimpleCalendar.instance.currentYear = y;
        SimpleCalendar.instance.macroShow();
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledTimes(1);

        //@ts-ignore
        SimpleCalendar.instance.macroShow('abc');
        expect(y.visibleYear).toBe(0);
        expect(renderSpy).toHaveBeenCalledTimes(2);
        expect(console.error).toHaveBeenCalledTimes(2);

        SimpleCalendar.instance.macroShow(1);
        expect(y.visibleYear).toBe(1);
        expect(renderSpy).toHaveBeenCalledTimes(3);
        expect(console.error).toHaveBeenCalledTimes(2);

        //@ts-ignore
        SimpleCalendar.instance.macroShow(1, 'abc');
        expect(y.visibleYear).toBe(1);
        expect(y.months[0].visible).toBe(true);
        expect(renderSpy).toHaveBeenCalledTimes(4);
        expect(console.error).toHaveBeenCalledTimes(3);

        SimpleCalendar.instance.macroShow(1, 1);
        expect(y.visibleYear).toBe(1);
        expect(y.months[0].visible).toBe(false);
        expect(y.months[1].visible).toBe(true);
        expect(renderSpy).toHaveBeenCalledTimes(5);
        expect(console.error).toHaveBeenCalledTimes(3);

        y.months[0].visible = true;
        y.months[1].visible = false;
        SimpleCalendar.instance.macroShow(1, -1);
        expect(y.visibleYear).toBe(1);
        expect(y.months[0].visible).toBe(false);
        expect(y.months[1].visible).toBe(true);
        expect(renderSpy).toHaveBeenCalledTimes(6);
        expect(console.error).toHaveBeenCalledTimes(3);

        //@ts-ignore
        SimpleCalendar.instance.macroShow(1, 0, 'asd');
        expect(y.visibleYear).toBe(1);
        expect(y.months[0].visible).toBe(true);
        expect(y.months[0].days[0].selected).toBe(true);
        expect(renderSpy).toHaveBeenCalledTimes(7);
        expect(console.error).toHaveBeenCalledTimes(4);

        SimpleCalendar.instance.macroShow(1, 0, 0);
        expect(y.visibleYear).toBe(1);
        expect(y.months[0].visible).toBe(true);
        expect(y.months[0].days[0].selected).toBe(true);
        expect(renderSpy).toHaveBeenCalledTimes(8);
        expect(console.error).toHaveBeenCalledTimes(4);

        SimpleCalendar.instance.macroShow(4, 0, 2);
        expect(y.visibleYear).toBe(4);
        expect(y.months[0].visible).toBe(true);
        expect(y.months[0].days[1].selected).toBe(true);
        expect(renderSpy).toHaveBeenCalledTimes(9);
        expect(console.error).toHaveBeenCalledTimes(4);

        SimpleCalendar.instance.macroShow(1, 0, -1);
        expect(y.visibleYear).toBe(1);
        expect(y.months[0].visible).toBe(true);
        expect(y.months[0].days[4].selected).toBe(true);
        expect(renderSpy).toHaveBeenCalledTimes(10);
        expect(console.error).toHaveBeenCalledTimes(4);

        y.months[0].visible = false;
        SimpleCalendar.instance.macroShow(1, null, 1);
        expect(y.visibleYear).toBe(1);
        expect(y.months[0].visible).toBe(false);
        expect(y.months[0].days[0].selected).toBe(true);
        expect(renderSpy).toHaveBeenCalledTimes(11);
        expect(console.error).toHaveBeenCalledTimes(4);

        y.months[0].current = false;
        SimpleCalendar.instance.macroShow(1, null, 2);
        expect(y.visibleYear).toBe(1);
        expect(y.months[0].visible).toBe(false);
        expect(y.months[0].days[0].selected).toBe(true);
        expect(y.months[0].days[1].selected).toBe(false);
        expect(renderSpy).toHaveBeenCalledTimes(12);
        expect(console.error).toHaveBeenCalledTimes(4);

        y.leapYearRule.rule = LeapYearRules.Gregorian;
        SimpleCalendar.instance.macroShow(4, 0, 2);
        expect(y.visibleYear).toBe(4);
        expect(y.months[0].visible).toBe(true);
        expect(y.months[0].days[1].selected).toBe(true);
        expect(renderSpy).toHaveBeenCalledTimes(13);
        expect(console.error).toHaveBeenCalledTimes(4);
    });

    test('Show App', () => {
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

    test('Activate Listeners', () => {
        const elm1 = document.createElement('a');
        elm1.classList.add('fa-chevron-left');
        const elm2 = document.createElement('a');
        elm2.classList.add('fa-chevron-right');
        const onFunc = jest.fn();

        const fakeQuery = {
            find: jest.fn().mockReturnValueOnce([elm1, elm2, document.createElement('a')]).mockReturnValue({on: onFunc})
        };
        //@ts-ignore
        SimpleCalendar.instance.activateListeners(fakeQuery);
        expect(fakeQuery.find).toHaveBeenCalledTimes(0);
        expect(onFunc).toHaveBeenCalledTimes(0);
        //@ts-ignore
        fakeQuery.length = 1;
        //@ts-ignore
        SimpleCalendar.instance.activateListeners(fakeQuery);
        expect(fakeQuery.find).toHaveBeenCalledTimes(11);
        expect(onFunc).toHaveBeenCalledTimes(10);
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
        (<HTMLElement>event.target).setAttribute('data-day', '0');
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
        expect(SimpleCalendar.instance.currentYear.months[0].days[1].selected).toBe(true);
        expect(SimpleCalendar.instance.currentYear.months[0].days[0].selected).toBe(true);

        SimpleCalendar.instance.currentYear.months[0].selected = false;
        (<HTMLElement>event.target).setAttribute('data-day', '3');
        SimpleCalendar.instance.currentYear.months[0].days[0].selected = false;
        SimpleCalendar.instance.currentYear.months[0].days = [SimpleCalendar.instance.currentYear.months[0].days[0],SimpleCalendar.instance.currentYear.months[0].days[1]];
        SimpleCalendar.instance.dayClick(event);
        expect(renderSpy).toHaveBeenCalledTimes(3);
        expect(SimpleCalendar.instance.currentYear.months[0].days[1].selected).toBe(true);
        expect(SimpleCalendar.instance.currentYear.months[0].days[0].selected).toBe(false);

        SimpleCalendar.instance.currentYear.months[0].visible = false;
        SimpleCalendar.instance.dayClick(event);
        expect(renderSpy).toHaveBeenCalledTimes(4);
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
        //Test Each with current year set to null
        (<HTMLElement>event.currentTarget).setAttribute('data-type', 'day');
        SimpleCalendar.instance.gmControlClick(event);
        expect(renderSpy).toHaveBeenCalledTimes(1);

        (<HTMLElement>event.currentTarget).setAttribute('data-type', 'month');
        SimpleCalendar.instance.gmControlClick(event);
        expect(renderSpy).toHaveBeenCalledTimes(2);

        (<HTMLElement>event.currentTarget).setAttribute('data-type', 'year');
        SimpleCalendar.instance.gmControlClick(event);
        expect(renderSpy).toHaveBeenCalledTimes(3);

        //Test with current year set
        SimpleCalendar.instance.currentYear = y;
        (<HTMLElement>event.currentTarget).classList.remove('next');
        (<HTMLElement>event.currentTarget).setAttribute('data-type', 'day');
        SimpleCalendar.instance.gmControlClick(event);
        expect(renderSpy).toHaveBeenCalledTimes(4);

        (<HTMLElement>event.currentTarget).setAttribute('data-type', 'month');
        SimpleCalendar.instance.gmControlClick(event);
        expect(renderSpy).toHaveBeenCalledTimes(5);
        (<HTMLElement>event.currentTarget).classList.add('next');
        SimpleCalendar.instance.gmControlClick(event);
        expect(renderSpy).toHaveBeenCalledTimes(6);
        (<HTMLElement>event.currentTarget).classList.remove('next');

        (<HTMLElement>event.currentTarget).setAttribute('data-type', 'year');
        SimpleCalendar.instance.gmControlClick(event);
        expect(renderSpy).toHaveBeenCalledTimes(7);

        (<HTMLElement>event.currentTarget).classList.add('next');
        SimpleCalendar.instance.gmControlClick(event);
        expect(renderSpy).toHaveBeenCalledTimes(8);

        (<HTMLElement>event.currentTarget).setAttribute('data-type', 'time');
        SimpleCalendar.instance.gmControlClick(event);
        expect(renderSpy).toHaveBeenCalledTimes(8);

        (<HTMLElement>event.currentTarget).setAttribute('data-amount', 'asd');
        SimpleCalendar.instance.gmControlClick(event);
        expect(renderSpy).toHaveBeenCalledTimes(8);

        (<HTMLElement>event.currentTarget).setAttribute('data-amount', '1');
        SimpleCalendar.instance.gmControlClick(event);
        expect(renderSpy).toHaveBeenCalledTimes(9);

        (<HTMLElement>event.currentTarget).classList.remove('next');
        SimpleCalendar.instance.timeUnits.second = false;
        SimpleCalendar.instance.timeUnits.minute = true;
        SimpleCalendar.instance.gmControlClick(event);
        expect(renderSpy).toHaveBeenCalledTimes(10);

        SimpleCalendar.instance.timeUnits.second = false;
        SimpleCalendar.instance.timeUnits.minute = false;
        SimpleCalendar.instance.timeUnits.hour = true;
        SimpleCalendar.instance.gmControlClick(event);
        expect(renderSpy).toHaveBeenCalledTimes(11);
    });

    test('Date Control Apply', () => {
        // @ts-ignore
        game.user.isGM = true;
        const event = new Event('click');
        SimpleCalendar.instance.dateControlApply(event);
        expect(game.settings.set).not.toHaveBeenCalled();

        SimpleCalendar.instance.currentYear = y;
        SimpleCalendar.instance.dateControlApply(event);
        expect(game.settings.set).toHaveBeenCalledTimes(1);

        (<Mock>game.settings.set).mockImplementation(() => Promise.reject(new Error("error")));
        SimpleCalendar.instance.dateControlApply(event);
        expect(game.settings.set).toHaveBeenCalledTimes(2);

        // @ts-ignore
        game.user.isGM = false;
        SimpleCalendar.instance.dateControlApply(event);
        //@ts-ignore
        expect(ui.notifications.warn).toHaveBeenCalledTimes(1);
        (<Mock>game.settings.set).mockReset();
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

        //GM is present
        //@ts-ignore
        (<Mock>game.users.find) = jest.fn((v)=>{
            return v.call(undefined, {isGM: true, active: true});
        });

        //No Current or selected month
        SimpleCalendar.instance.addNote(event);
        //@ts-ignore
        expect(ui.notifications.warn).toHaveBeenCalledTimes(2);

        //Current Month but no selected or current day
        SimpleCalendar.instance.currentYear.months[0].current = true;
        SimpleCalendar.instance.addNote(event);
        //@ts-ignore
        expect(ui.notifications.warn).toHaveBeenCalledTimes(3);

        //Current and Selected Month, current day but no selected day
        SimpleCalendar.instance.currentYear.months[0].selected = true;
        SimpleCalendar.instance.currentYear.months[0].days[0].current = true;
        SimpleCalendar.instance.addNote(event);
        //@ts-ignore
        expect(ui.notifications.warn).toHaveBeenCalledTimes(3);
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
    });

    test('Load Year Configuration', () => {
        SimpleCalendar.instance.settingUpdate();
        expect(SimpleCalendar.instance.currentYear?.numericRepresentation).toBe(0);
        expect(SimpleCalendar.instance.currentYear?.prefix).toBe('');
        expect(SimpleCalendar.instance.currentYear?.postfix).toBe('');
        expect(SimpleCalendar.instance.currentYear?.showWeekdayHeadings).toBe(true);
        SimpleCalendar.instance.settingUpdate();
        expect(SimpleCalendar.instance.currentYear?.numericRepresentation).toBe(0);
        const orig = game.settings.get;
        game.settings.get =(moduleName: string, settingName: string) => { return {};};
        SimpleCalendar.instance.settingUpdate();
        expect(SimpleCalendar.instance.currentYear?.numericRepresentation).toBe(new Date().getFullYear());
        expect(SimpleCalendar.instance.currentYear?.prefix).toBe('');
        expect(SimpleCalendar.instance.currentYear?.postfix).toBe('');
        expect(SimpleCalendar.instance.currentYear?.showWeekdayHeadings).toBe(true);
        game.settings.get =(moduleName: string, settingName: string) => { return {numericRepresentation: 0, prefix: '', postfix: ''};};
        //@ts-ignore
        SimpleCalendar.instance.loadYearConfiguration();
        expect(SimpleCalendar.instance.currentYear?.numericRepresentation).toBe(0);
        expect(SimpleCalendar.instance.currentYear?.prefix).toBe('');
        expect(SimpleCalendar.instance.currentYear?.postfix).toBe('');
        expect(SimpleCalendar.instance.currentYear?.showWeekdayHeadings).toBe(true);
        game.settings.get = orig;
    });

    test('Load Month/Weekday Configuration', () => {
        const orig = game.settings.get;
        SimpleCalendar.instance.settingUpdate();
        expect(SimpleCalendar.instance.currentYear?.months.length).toBe(1);
        expect(SimpleCalendar.instance.currentYear?.months[0].numericRepresentation).toBe(1);
        expect(SimpleCalendar.instance.currentYear?.months[0].name).toBe('1');
        expect(SimpleCalendar.instance.currentYear?.months[0].days.length).toBe(2);
        expect(SimpleCalendar.instance.currentYear?.weekdays.length).toBe(1);
        if(SimpleCalendar.instance.currentYear){
            SimpleCalendar.instance.currentYear.months = [];
            game.settings.get = (moduleName: string, settingName: string) => {
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
            expect(SimpleCalendar.instance.currentYear?.months[0].name).toBe('1');
            expect(SimpleCalendar.instance.currentYear?.months[0].days.length).toBe(31);
            expect(SimpleCalendar.instance.currentYear?.weekdays.length).toBe(7);

            SimpleCalendar.instance.currentYear.months = [];
            game.settings.get = (moduleName: string, settingName: string) => {
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
            expect(SimpleCalendar.instance.currentYear?.months[0].name).toBe('1');
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
        game.settings.get = orig;
    });

    test('Load Current Date', () => {
        const orig = game.settings.get;
        SimpleCalendar.instance.settingUpdate();
        expect(SimpleCalendar.instance.currentYear?.numericRepresentation).toBe(0);
        expect(SimpleCalendar.instance.currentYear?.months[0].current).toBe(true);
        expect(SimpleCalendar.instance.currentYear?.months[0].days[1].current).toBe(true);

        game.settings.get = (moduleName: string, settingName: string) => {
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

        game.settings.get = (moduleName: string, settingName: string) => {
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

        game.settings.get = (moduleName: string, settingName: string) => {
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
                    return {};
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

        game.settings.get = (moduleName: string, settingName: string) => {return null;};
        //@ts-ignore
        jest.spyOn(SimpleCalendar.instance, 'loadYearConfiguration').mockImplementation();
        SimpleCalendar.instance.currentYear = null;
        SimpleCalendar.instance.settingUpdate();
        expect(SimpleCalendar.instance.currentYear).toBeNull();
        expect(console.error).toHaveBeenCalledTimes(6);
        //@ts-ignore
        (<Mock>SimpleCalendar.instance.loadYearConfiguration).mockReset()

        game.settings.get = orig;
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

    test('World Time Update', () => {
        SimpleCalendar.instance.worldTimeUpdate(100, 10);
        SimpleCalendar.instance.currentYear = y;
        SimpleCalendar.instance.worldTimeUpdate(100, 10);
        expect(y.time.seconds).toBe(0);
    });

    test('Combat Update', () => {
        //@ts-ignore
        SimpleCalendar.instance.combatUpdate({started: true}, {}, {advanceTime: 2});
        SimpleCalendar.instance.currentYear = y;
        //@ts-ignore
        SimpleCalendar.instance.combatUpdate({started: true}, {}, {});
        expect(y.time.combatRunning).toBe(true);
        //@ts-ignore
        SimpleCalendar.instance.combatUpdate({started: true}, {}, {advanceTime: 2});
        expect(y.combatChangeTriggered).toBe(true);
    });

    test('Combat Delete', () => {
        SimpleCalendar.instance.combatDelete();
        SimpleCalendar.instance.currentYear = y;
        y.time.combatRunning = true;
        SimpleCalendar.instance.combatDelete();
        expect(y.time.combatRunning).toBe(false);
    });

    test('Game Paused', () => {
        SimpleCalendar.instance.gamePaused(false);
        SimpleCalendar.instance.currentYear = y;
        SimpleCalendar.instance.gamePaused(false);
    });

    test('Start Time', () => {
        SimpleCalendar.instance.startTime();
        SimpleCalendar.instance.currentYear = y;
        SimpleCalendar.instance.startTime();
        expect(y.time.keeper).toBeUndefined();
        y.generalSettings.gameWorldTimeIntegration = GameWorldTimeIntegrations.Self;
        SimpleCalendar.instance.startTime();
        expect(y.time.keeper).toBeDefined();
        //@ts-ignore
        game.combats.size = 1;
        SimpleCalendar.instance.startTime();
    });

    test('Stop Time', () => {
        y.time.keeper = 1;
        SimpleCalendar.instance.stopTime();
        expect(y.time.keeper).toBe(1);
        SimpleCalendar.instance.currentYear = y;
        SimpleCalendar.instance.stopTime();
        expect(y.time.keeper).toBeUndefined();
    });

    test('Time Keeping Check', async () => {
        (<Mock>game.settings.get).mockClear();
        await SimpleCalendar.instance.timeKeepingCheck();
        expect(game.settings.get).not.toHaveBeenCalled();

        SimpleCalendar.instance.currentYear = y;
        await SimpleCalendar.instance.timeKeepingCheck();
        expect(game.settings.get).not.toHaveBeenCalled();

        //@ts-ignore
        game.user.isGM = true;
        (<Mock>game.settings.get).mockReturnValueOnce(true);
        y.generalSettings.gameWorldTimeIntegration = GameWorldTimeIntegrations.Self;
        await SimpleCalendar.instance.timeKeepingCheck();
        expect(game.settings.get).toHaveBeenCalledTimes(1);

        (<Mock>game.modules.get)
            .mockReturnValueOnce(null).mockReturnValueOnce(null)
            .mockReturnValueOnce(null).mockReturnValueOnce({active:true})
            .mockReturnValueOnce({active:true}).mockReturnValueOnce(null);
        await SimpleCalendar.instance.timeKeepingCheck();
        expect(game.settings.get).toHaveBeenCalledTimes(2);

        await SimpleCalendar.instance.timeKeepingCheck();
        expect(game.settings.get).toHaveBeenCalledTimes(3);
        //@ts-ignore
        expect(DialogRenderer).toHaveBeenCalledTimes(1);
        await SimpleCalendar.instance.timeKeepingCheck();
        expect(game.settings.get).toHaveBeenCalledTimes(4);
        //@ts-ignore
        expect(DialogRenderer).toHaveBeenCalledTimes(2);
    });

    test('Module Import Click', async () => {
        //@ts-ignore
        game.user.isGM = true;
        await SimpleCalendar.instance.moduleImportClick('asd');
        expect(console.error).toHaveBeenCalledTimes(1);
        SimpleCalendar.instance.currentYear = y;

        await SimpleCalendar.instance.moduleImportClick('asd');
        expect(game.settings.set).toHaveBeenCalledTimes(1);
        await SimpleCalendar.instance.moduleImportClick('about-time');
        expect(game.settings.set).toHaveBeenCalledTimes(2);
        expect(renderSpy).toHaveBeenCalledTimes(1);
        await SimpleCalendar.instance.moduleImportClick('calendar-weather');
        expect(game.settings.set).toHaveBeenCalledTimes(3);
        expect(renderSpy).toHaveBeenCalledTimes(2);
    });

    test('Module Export Click', async () => {
        //@ts-ignore
        game.user.isGM = true;
        await SimpleCalendar.instance.moduleExportClick('asd');
        expect(console.error).toHaveBeenCalledTimes(1);
        SimpleCalendar.instance.currentYear = y;

        await SimpleCalendar.instance.moduleExportClick('asd');
        expect(game.settings.set).toHaveBeenCalledTimes(1);
        await SimpleCalendar.instance.moduleExportClick('about-time');
        expect(game.settings.set).toHaveBeenCalledTimes(2);
        await SimpleCalendar.instance.moduleExportClick('calendar-weather');
        expect(game.settings.set).toHaveBeenCalledTimes(3);
    });

    test('Module Dialog No Change', async () => {
        (<Mock>game.settings.set).mockClear();
        //@ts-ignore
        game.user.isGM = false;
        await SimpleCalendar.instance.moduleDialogNoChangeClick();
        expect(game.settings.set).not.toHaveBeenCalled();
        //@ts-ignore
        game.user.isGM = true;
        await SimpleCalendar.instance.moduleDialogNoChangeClick();
        expect(game.settings.set).toHaveBeenCalledTimes(1);
    });
});
