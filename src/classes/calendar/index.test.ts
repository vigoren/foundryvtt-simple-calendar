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

import SimpleCalendar from "../applications/simple-calendar";
import Calendar from "./index";
import {GameSystems, GameWorldTimeIntegrations, SettingNames, TimeKeeperStatus} from "../../constants";
import Note from "../note";
import Month from "./month";
import Mock = jest.Mock;

describe('Calendar Class Tests', () => {

    beforeEach(() => {
        SimpleCalendar.instance = new SimpleCalendar();
    });

    test('Properties', () => {
        const c = new Calendar({id: '', name: ''});
        expect(Object.keys(c).length).toBe(8); //Make sure no new properties have been added

        (<Game>game).system.id = GameSystems.DnD5E;
        let c2 = new Calendar({id: '', name: ''});
        expect(c2.gameSystem).toBe(GameSystems.DnD5E);

        (<Game>game).system.id = GameSystems.PF1E;
        c2 = new Calendar({id: '', name: ''});
        expect(c2.gameSystem).toBe(GameSystems.PF1E);

        (<Game>game).system.id = GameSystems.PF2E;
        c2 = new Calendar({id: '', name: ''});
        expect(c2.gameSystem).toBe(GameSystems.PF2E);

        (<Game>game).system.id = GameSystems.WarhammerFantasy4E;
        c2 = new Calendar({id: '', name: ''});
        expect(c2.gameSystem).toBe(GameSystems.WarhammerFantasy4E);

        const orig = (<Game>game).system;
        //@ts-ignore
        (<Game>game).system = null;
        c2 = new Calendar({id: '', name: ''});
        (<Game>game).system = orig;
    });

    test('Load Calendars', () => {
        expect(Calendar.LoadCalendars().length).toBe(1);
    });

    test('Clone', () => {
        const cal = Calendar.LoadCalendars()[0];
        cal.generalSettings.permissions.viewCalendar.users = [];
        cal.generalSettings.permissions.addNotes.users = [];
        cal.generalSettings.permissions.reorderNotes.users = [];
        cal.generalSettings.permissions.changeDateTime.users = [];
        cal.noteCategories.push({name: 'Holiday', color: '#000000', textColor: '#ffffff'});
        const calClone = cal.clone();
        expect(calClone).toStrictEqual(cal);
    });

    test('Can User', () => {
        const cal = Calendar.LoadCalendars()[0];
        expect(cal.canUser(null, cal.generalSettings.permissions.addNotes)).toBe(false);
        expect(cal.canUser((<Game>game).user, cal.generalSettings.permissions.addNotes)).toBe(false);
        expect(cal.canUser((<Game>game).user, cal.generalSettings.permissions.viewCalendar)).toBe(true);
        cal.generalSettings.permissions.viewCalendar.player = false;
        expect(cal.canUser((<Game>game).user, cal.generalSettings.permissions.viewCalendar)).toBe(true);
        cal.generalSettings.permissions.viewCalendar.trustedPlayer = false;
        expect(cal.canUser((<Game>game).user, cal.generalSettings.permissions.viewCalendar)).toBe(true);
        cal.generalSettings.permissions.viewCalendar.assistantGameMaster = false;
        // @ts-ignore
        (<Game>game).user.id = "asd";
        cal.generalSettings.permissions.viewCalendar.users = ['asd'];
        expect(cal.canUser((<Game>game).user, cal.generalSettings.permissions.viewCalendar)).toBe(true);
        // @ts-ignore
        (<Game>game).user.id = "";
        cal.generalSettings.permissions.viewCalendar.users = ['asd'];
        expect(cal.canUser((<Game>game).user, cal.generalSettings.permissions.viewCalendar)).toBe(false);
    });

    test('To Template', () => {
        const cal = Calendar.LoadCalendars()[0];
        cal.year.resetMonths();
        cal.year.resetMonths('visible');
        let calTemp = cal.toTemplate();
        expect(calTemp.id).toBeDefined();

        cal.year.months[0].current = true;
        cal.year.months[0].visible = true;
        calTemp = cal.toTemplate();
        expect(calTemp.showSetCurrentDate).toBe(false);

        cal.year.months[0].days[1].current = true;
        calTemp = cal.toTemplate();
        expect(calTemp.showSetCurrentDate).toBe(false);

        cal.year.months[0].selected = true;
        calTemp = cal.toTemplate();
        expect(calTemp.showSetCurrentDate).toBe(false);

        cal.year.months[0].days[1].selected = true;
        cal.generalSettings.showClock = true;
        calTemp = cal.toTemplate();
        expect(calTemp.showSetCurrentDate).toBe(false);

        //@ts-ignore
        game.user.isGM = true;
        cal.year.numericRepresentation = 0;
        cal.year.selectedYear = 0;
        cal.year.months[0].days[1].current = false;
        cal.year.months[0].selected = true;
        cal.year.months[0].days[0].selected = true;
        const n = new Note();
        n.year = 0;
        n.month = 1;
        n.day = 1;
        n.endDate.year = 0;
        n.endDate.month = 1;
        n.endDate.day = 1;
        cal.notes = [];
        cal.notes.push(n);
        calTemp = cal.toTemplate();
        expect(calTemp.showSetCurrentDate).toBe(true);
        //@ts-ignore
        game.user.isGM = false;
    });

    test('Get Notes For Day', () => {
        const cal = Calendar.LoadCalendars()[0];
        const n = new Note();
        n.year = 0;
        n.month = 1;
        n.day = 2;
        n.endDate.year = 0;
        n.endDate.month = 1;
        n.endDate.day = 1;

        cal.notes = [n];
        cal.year.months[0].current = false;
        cal.year.months[0].resetDays();
        cal.year.months[0].resetDays('selected');
        expect(cal.getNotesForDay().length).toBe(0);

        cal.year.months[0].current = true;
        expect(cal.getNotesForDay().length).toBe(0);

        //@ts-ignore
        game.user.isGM = true;
        cal.year.months[0].days[0].current = true;
        expect(cal.getNotesForDay().length).toBe(1);
        //@ts-ignore
        game.user.isGM = false;
    });

    test('Day Note Sort', () => {
        const n1 = new Note();
        n1.order = 1;
        n1.hour = 1;
        n1.minute = 1;
        const n2 = new Note();
        n2.order = 1;
        n2.hour = 1;
        n2.minute = 1;

        //@ts-ignore
        expect(Calendar.dayNoteSort(n1, n2)).toBe(0);
    });

    test('Search Notes', () => {
        const cal = Calendar.LoadCalendars()[0];
        const n = new Note();
        n.title = 'New Note';
        n.content = 'Content about everything';
        n.year = 0;
        n.month = 1;
        n.day = 3;
        n.endDate.year = 0;
        n.endDate.month = 1;
        n.endDate.day = 3;
        cal.notes.push(n);

        expect(cal.searchNotes('xyz').length).toBe(0);

        cal.notes[0].title = 'This is a title!';
        cal.notes[0].content = 'This is content!';

        expect(cal.searchNotes('This').length).toBe(1);
        expect(cal.searchNotes('coNteNt').length).toBe(2);
        expect(cal.searchNotes('tent').length).toBe(2);
        expect(cal.searchNotes('ote').length).toBe(1);
        expect(cal.searchNotes('1').length).toBe(2);
        expect(cal.searchNotes('3').length).toBe(1);
    });

    test('Sync Time', () => {
        const cal = Calendar.LoadCalendars()[0];
        const month = new Month('M2', 2, 0, 30);
        cal.generalSettings.gameWorldTimeIntegration = GameWorldTimeIntegrations.None;
        //@ts-ignore
        game.time.advance.mockClear();
        cal.syncTime();
        expect((<Game>game).time.advance).not.toHaveBeenCalled();
        //@ts-ignore
        game.user.isGM = true;
        cal.syncTime()
        expect((<Game>game).time.advance).not.toHaveBeenCalled();
        cal.generalSettings.gameWorldTimeIntegration = GameWorldTimeIntegrations.Self;
        cal.year.months.push(month);
        cal.syncTime()
        expect((<Game>game).time.advance).toHaveBeenCalledTimes(1);

        month.current = true;
        cal.syncTime()
        expect((<Game>game).time.advance).toHaveBeenCalledTimes(2);
        month.days[0].current = true;
        cal.syncTime()
        expect((<Game>game).time.advance).toHaveBeenCalledTimes(3);

        cal.year.yearZero = 1;
        cal.syncTime()
        expect((<Game>game).time.advance).toHaveBeenCalledTimes(4);

        expect(cal.year.toSeconds()).toBe(-2678397);
        //@ts-ignore
        game.time.worldTime = -2678397;
        cal.syncTime();
        expect((<Game>game).time.advance).toHaveBeenCalledTimes(4);

        cal.syncTime(true);
        expect((<Game>game).time.advance).toHaveBeenCalledTimes(5);
    });

    test('Set From Time', () => {
        const cal = Calendar.LoadCalendars()[0];
        const month = new Month('M2', 2, 0, 30);
        //@ts-ignore
        SimpleCalendar.instance.calendars = [cal];
        cal.year.months.push(month);
        month.current = true;
        //@ts-ignore
        game.user.isGM = false;
        cal.year.time.seconds = 60;
        cal.year.timeChangeTriggered = true;
        cal.setFromTime(120, 0);
        expect(cal.year.time.seconds).toBe(60);
        expect(cal.year.timeChangeTriggered).toBe(false);
        cal.year.timeChangeTriggered = true;
        cal.setFromTime(120, 60);
        expect(cal.year.time.seconds).toBe(60);
        expect(cal.year.timeChangeTriggered).toBe(false);

        cal.generalSettings.gameWorldTimeIntegration = GameWorldTimeIntegrations.Self;
        cal.year.timeChangeTriggered = false;
        cal.setFromTime(120, 60);
        expect(cal.year.time.seconds).toBe(60);
        expect(cal.year.timeChangeTriggered).toBe(false);

        cal.year.timeChangeTriggered = true;
        cal.setFromTime(120, 60);
        expect(cal.year.time.seconds).toBe(60);
        expect(cal.year.timeChangeTriggered).toBe(false);

        cal.generalSettings.gameWorldTimeIntegration = GameWorldTimeIntegrations.ThirdParty;
        cal.setFromTime(120, 60);
        expect(cal.year.time.seconds).toBe(120);

        cal.year.time.seconds = 60;
        //@ts-ignore
        game.user.isGM = true;
        SimpleCalendar.instance = new SimpleCalendar();
        SimpleCalendar.instance.activeCalendar.year = cal.year;
        SimpleCalendar.instance.primary = true;
        cal.setFromTime(120, 60);
        expect(cal.year.time.seconds).toBe(120);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(1);

        cal.year.time.seconds = 60;
        cal.generalSettings.gameWorldTimeIntegration = GameWorldTimeIntegrations.Self;
        cal.year.combatChangeTriggered = true;
        cal.setFromTime(120, 60);
        expect(cal.year.time.seconds).toBe(120);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(2);

        //@ts-ignore
        game.user.isGM = false;
        cal.year.combatChangeTriggered = true;
        cal.setFromTime(240, 60);
        expect(cal.year.time.seconds).toBe(240);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(2);

        //@ts-ignore
        game.user.isGM = true;
        cal.gameSystem = GameSystems.PF2E;
        cal.generalSettings.gameWorldTimeIntegration = GameWorldTimeIntegrations.Mixed;
        cal.setFromTime(240, 60);
        expect(cal.year.time.seconds).toBe(240);

        //@ts-ignore
        game.pf2e = {worldClock: {dateTheme: "AD", worldCreatedOn: 0}};
        cal.setFromTime(240, 60);
        expect(cal.year.time.seconds).toBe(240);

        const o = SimpleCalendar.instance.element;
        //@ts-ignore
        SimpleCalendar.instance.element = {
            find: jest.fn().mockReturnValue({
                removeClass: jest.fn().mockReturnValue({addClass: jest.fn()}),
                text: jest.fn()
            })
        };

        cal.generalSettings.gameWorldTimeIntegration = GameWorldTimeIntegrations.Self;
        //@ts-ignore
        cal.year.time.timeKeeper.status = TimeKeeperStatus.Started;
        cal.setFromTime(240, 60);
        expect(cal.year.time.seconds).toBe(240);

        //@ts-ignore
        cal.year.time.timeKeeper.status = TimeKeeperStatus.Started
        cal.year.time.updateFrequency = 1;
        cal.year.time.gameTimeRatio = 1;
        cal.setFromTime(240, 1);
        expect(cal.year.time.seconds).toBe(240);

        //@ts-ignore
        SimpleCalendar.instance.element = o;

        //@ts-ignore
        game.user.isGM = false;
    });

    test('Setting Update', () => {
        SimpleCalendar.instance = new SimpleCalendar();
        SimpleCalendar.instance.activeCalendar.settingUpdate('all');

        SimpleCalendar.instance.activeCalendar.settingUpdate('a');

        (<Game>game).settings.get = (moduleName: string, settingName: string) => {
            switch (settingName){
                case SettingNames.MonthConfiguration:
                case SettingNames.WeekdayConfiguration:
                case SettingNames.SeasonConfiguration:
                case SettingNames.MoonConfiguration:
                    return [[]];
                default:
                    return null;
            }};
        SimpleCalendar.instance.activeCalendar.settingUpdate('all');
    });

    test('Load Current Date', () => {
        jest.spyOn(console, 'error').mockImplementation();
        SimpleCalendar.instance = new SimpleCalendar();
        const orig = (<Game>game).settings.get;
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
                    return {year: 0, month: 1, day: 2};
                case SettingNames.Notes:
                    return [[{year: 0, month: 1, day: 2, title:'', content:'', author:''}]];
                default:
                    return null;
            }};
        SimpleCalendar.instance.activeCalendar.loadCurrentDate();
        expect(SimpleCalendar.instance.activeCalendar.year.numericRepresentation).toBe(0);
        expect(SimpleCalendar.instance.activeCalendar.year.months[0].current).toBe(true);
        expect(SimpleCalendar.instance.activeCalendar.year.months[0].days[1].current).toBe(true);

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
        SimpleCalendar.instance.activeCalendar.loadCurrentDate();
        expect(SimpleCalendar.instance.activeCalendar.year.numericRepresentation).toBe(0);
        expect(SimpleCalendar.instance.activeCalendar.year.months[0].current).toBe(true);
        expect(SimpleCalendar.instance.activeCalendar.year.months[0].days[0].current).toBe(true);
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
                    return {year: 0, month: 100, day: 200, seconds: 3};
                case SettingNames.Notes:
                    return [[{year: 0, month: 1, day: 2, title:'', content:'', author:''}]];
                default:
                    return null;
            }};
        SimpleCalendar.instance.activeCalendar.loadCurrentDate();
        expect(SimpleCalendar.instance.activeCalendar.year.numericRepresentation).toBe(0);
        expect(SimpleCalendar.instance.activeCalendar.year.months[0].current).toBe(true);
        expect(SimpleCalendar.instance.activeCalendar.year.months[0].days[0].current).toBe(true);
        expect(console.error).toHaveBeenCalledTimes(2);

        (<Game>game).settings.get = (moduleName: string, settingName: string) => {return null;};
        SimpleCalendar.instance.activeCalendar.loadCurrentDate();
        expect(SimpleCalendar.instance.activeCalendar.year.months[0].current).toBe(true);
        expect(SimpleCalendar.instance.activeCalendar.year.months[0].days[0].current).toBe(true);

        SimpleCalendar.instance.activeCalendar.year.months = [];
        SimpleCalendar.instance.activeCalendar.loadCurrentDate();
        expect(console.error).toHaveBeenCalledTimes(3);

        (<Game>game).settings.get = orig;
        (<Mock>console.error).mockReset();
    });
});
