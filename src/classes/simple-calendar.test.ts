/**
 * @jest-environment jsdom
 */
import "../../__mocks__/game";
import "../../__mocks__/form-application";
import "../../__mocks__/application";
import "../../__mocks__/handlebars";
import "../../__mocks__/event";
import "../../__mocks__/crypto";


import SimpleCalendar from "./simple-calendar";
import Year from "./year";
import Month from "./month";
import Mock = jest.Mock;
import SpyInstance = jest.SpyInstance;
import {SettingNames} from "../constants";
import {SimpleCalendarNotes} from "./simple-calendar-notes";

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
        expect(Object.keys(SimpleCalendar.instance).length).toBe(4); //Make sure no new properties have been added
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

    test('Init', () => {
        expect(SimpleCalendar.instance.currentYear).toBeNull();
        SimpleCalendar.instance.init();
        expect(Handlebars.registerHelper).toHaveBeenCalledTimes(3);
        expect(game.settings.register).toHaveBeenCalledTimes(5);
        expect(game.settings.get).toHaveBeenCalledTimes(5);
        expect(SimpleCalendar.instance.currentYear?.numericRepresentation).toBe(0);
        expect(SimpleCalendar.instance.currentYear?.months.length).toBe(1);
        expect(SimpleCalendar.instance.currentYear?.months[0].days.length).toBe(2);
        expect(SimpleCalendar.instance.currentYear?.getCurrentMonth()?.numericRepresentation).toBe(1);
        expect(SimpleCalendar.instance.currentYear?.getCurrentMonth()?.getCurrentDay()?.numericRepresentation).toBe(2);

        //Testing the functions within the handlebar helpers
        // @ts-ignore
        game.user.isGM = true;
        SimpleCalendar.instance.init();
        expect(Handlebars.registerHelper).toHaveBeenCalledTimes(6);
        // @ts-ignore
        game.user.isGM = false;
    });

    test('Get Data', () => {
        let data = SimpleCalendar.instance.getData();
        expect(data).toBeUndefined();
        SimpleCalendar.instance.currentYear = y;
        //Nothing Undefined
        data = SimpleCalendar.instance.getData();
        expect(data?.isGM).toBe(false);
        expect(data?.currentYear).toStrictEqual(y.toTemplate());
        expect(data?.currentMonth).toStrictEqual(y.months[0].toTemplate());
        expect(data?.currentDay).toStrictEqual(y.months[0].days[0].toTemplate());
        expect(data?.selectedYear).toBe(y.selectedYear);
        expect(data?.selectedMonth).toStrictEqual(y.months[0].toTemplate());
        expect(data?.selectedDay).toStrictEqual(y.months[0].days[0]);
        expect(data?.visibleYear).toBe(y.visibleYear);
        expect(data?.visibleMonth).toStrictEqual(y.months[0].toTemplate());
        expect(data?.visibleMonthStartWeekday).toStrictEqual([]);
        expect(data?.showSelectedDay).toBe(true);
        expect(data?.showCurrentDay).toBe(true);
        expect(data?.notes).toStrictEqual([]);
        //No Current or selected day
        SimpleCalendar.instance.currentYear.months[0].days[0].current = false;
        SimpleCalendar.instance.currentYear.months[0].days[0].selected = false;
        data = SimpleCalendar.instance.getData();
        expect(data?.currentDay).toBeUndefined();
        expect(data?.selectedDay).toBeUndefined();
        //No Current, visible or selected month
        SimpleCalendar.instance.currentYear.months[0].current = false;
        SimpleCalendar.instance.currentYear.months[0].selected = false;
        SimpleCalendar.instance.currentYear.months[0].visible = false;
        data = SimpleCalendar.instance.getData();
        expect(data?.currentMonth).toBeUndefined();
        expect(data?.currentDay).toBeUndefined();
        expect(data?.selectedMonth).toBeUndefined();
        expect(data?.selectedDay).toBeUndefined();
        expect(data?.visibleMonth).toBeUndefined();
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
        expect(fakeQuery.find).toHaveBeenCalledTimes(8);
        expect(onFunc).toHaveBeenCalledTimes(7);
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
        SimpleCalendar.instance.todayClick(event);
        expect(renderSpy).toHaveBeenCalled();
        expect(SimpleCalendar.instance.currentYear.months[0].visible).toBe(true);
        expect(SimpleCalendar.instance.currentYear.months[0].selected).toBe(true);
        expect(SimpleCalendar.instance.currentYear.months[0].days[0].selected).toBe(true);
    });

    test('GM Control Click', () => {
        const event = new Event('click');
        SimpleCalendar.instance.gmControlClick(event);
        expect(renderSpy).not.toHaveBeenCalled();
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

        (<HTMLElement>event.currentTarget).setAttribute('data-type', 'year');
        SimpleCalendar.instance.gmControlClick(event);
        expect(renderSpy).toHaveBeenCalledTimes(6);

        (<HTMLElement>event.currentTarget).classList.add('next');
        SimpleCalendar.instance.gmControlClick(event);
        expect(renderSpy).toHaveBeenCalledTimes(7);
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
        expect(ui.notifications.warn).toHaveBeenCalledTimes(1);
    });

    test('Configuration Click', () => {
        // @ts-ignore
        game.user.isGM = true;
        const event = new Event('click');
        SimpleCalendar.instance.configurationClick(event);
        expect(console.error).toHaveBeenCalledTimes(1);
        SimpleCalendar.instance.currentYear = y;
        SimpleCalendar.instance.configurationClick(event);
        // @ts-ignore
        game.user.isGM = false;
        SimpleCalendar.instance.configurationClick(event);
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

        //No Current or selected month
        SimpleCalendar.instance.addNote(event);
        expect(ui.notifications.warn).toHaveBeenCalledTimes(1);

        //Current Month but no selected or current day
        SimpleCalendar.instance.currentYear.months[0].current = true;
        SimpleCalendar.instance.addNote(event);
        expect(ui.notifications.warn).toHaveBeenCalledTimes(2);

        //Current and Selected Month, current day but no selected day
        SimpleCalendar.instance.currentYear.months[0].selected = true;
        SimpleCalendar.instance.currentYear.months[0].days[0].current = true;
        SimpleCalendar.instance.addNote(event);
        expect(ui.notifications.warn).toHaveBeenCalledTimes(2);
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
    });

    test('Load Year Configuration', () => {
        SimpleCalendar.instance.settingUpdate();
        expect(SimpleCalendar.instance.currentYear?.numericRepresentation).toBe(0);
        expect(SimpleCalendar.instance.currentYear?.prefix).toBe('');
        expect(SimpleCalendar.instance.currentYear?.postfix).toBe('');
        SimpleCalendar.instance.settingUpdate();
        expect(SimpleCalendar.instance.currentYear?.numericRepresentation).toBe(0);
        const orig = game.settings.get;
        game.settings.get =(moduleName: string, settingName: string) => { return {};};
        SimpleCalendar.instance.settingUpdate();
        expect(SimpleCalendar.instance.currentYear?.numericRepresentation).toBe(new Date().getFullYear());
        expect(SimpleCalendar.instance.currentYear?.prefix).toBe('');
        expect(SimpleCalendar.instance.currentYear?.postfix).toBe('');
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
        expect(console.error).toHaveBeenCalledTimes(5);
        //@ts-ignore
        (<Mock>SimpleCalendar.instance.loadYearConfiguration).mockReset()

        game.settings.get = orig;
    });

    test('Load Notes', () => {
        SimpleCalendar.instance.settingUpdate();
        expect(SimpleCalendar.instance.notes.length).toBe(1);
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
    });
});
