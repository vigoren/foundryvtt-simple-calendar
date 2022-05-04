/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";

import Calendar from "../calendar";
import {
    CalManager,
    MainApplication,
    NManager,
    updateCalManager,
    updateMainApplication,
    updateNManager,
    updateSC
} from "../index";
import CalendarManager from "../calendar/calendar-manager";
import SCController from "../s-c-controller";
import MainApp from "../applications/main-app";
import NoteManager from "./note-manager";
import {NoteSheet} from "./note-sheet";
import {ModuleName, NoteRepeat, PredefinedCalendars} from "../../constants";
import fetchMock from "jest-fetch-mock";
import PredefinedCalendar from "../configuration/predefined-calendar";
import * as Utilities from "../utilities/inputs";
import GameSockets from "../foundry-interfacing/game-sockets";

fetchMock.enableMocks();
describe('Note Sheet Class Tests', () => {
    let tCal: Calendar;
    let ns: NoteSheet;
    let je: any;
    let nd: any;

    beforeEach(async () => {
        updateCalManager(new CalendarManager());
        updateSC(new SCController());
        updateMainApplication(new MainApp());
        updateNManager(new NoteManager());
        tCal = new Calendar('','');
        jest.spyOn(CalManager, 'getActiveCalendar').mockImplementation(() => {return tCal;});
        jest.spyOn(CalManager, 'getCalendar').mockImplementation(() => {return tCal;});
        fetchMock.resetMocks();
        fetchMock.mockOnce(`{"calendar":{"currentDate":{"year":2022,"month":2,"day":28,"seconds":0},"general":{"gameWorldTimeIntegration":"mixed","showClock":true,"noteDefaultVisibility":false,"postNoteRemindersOnFoundryLoad":true,"pf2eSync":true,"dateFormat":{"date":"MMMM DD, YYYY","time":"HH:mm:ss","monthYear":"MMMM YAYYYYYZ"}},"leapYear":{"rule":"gregorian","customMod":0},"months":[{"name":"January","abbreviation":"Jan","numericRepresentation":1,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"February","abbreviation":"Feb","numericRepresentation":2,"numericRepresentationOffset":0,"numberOfDays":28,"numberOfLeapYearDays":29,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"March","abbreviation":"Mar","numericRepresentation":3,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"April","abbreviation":"Apr","numericRepresentation":4,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"May","abbreviation":"May","numericRepresentation":5,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"June","abbreviation":"Jun","numericRepresentation":6,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"July","abbreviation":"Jul","numericRepresentation":7,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"August","abbreviation":"Aug","numericRepresentation":8,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"September","abbreviation":"Sep","numericRepresentation":9,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"October","abbreviation":"Oct","numericRepresentation":10,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"November","abbreviation":"Nov","numericRepresentation":11,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"December","abbreviation":"Dec","numericRepresentation":12,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null}],"moons":[{"name":"Moon","cycleLength":29.53059,"firstNewMoon":{"yearReset":"none","yearX":0,"year":2000,"month":1,"day":5},"phases":[{"name":"New Moon","length":1,"icon":"new","singleDay":true},{"name":"Waxing Crescent","length":6.38265,"icon":"waxing-crescent","singleDay":false},{"name":"First Quarter","length":1,"icon":"first-quarter","singleDay":true},{"name":"Waxing Gibbous","length":6.38265,"icon":"waxing-gibbous","singleDay":false},{"name":"Full Moon","length":1,"icon":"full","singleDay":true},{"name":"Waning Gibbous","length":6.38265,"icon":"waning-gibbous","singleDay":false},{"name":"Last Quarter","length":1,"icon":"last-quarter","singleDay":true},{"name":"Waning Crescent","length":6.38265,"icon":"waning-crescent","singleDay":false}],"color":"#ffffff","cycleDayAdjust":0.5}],"noteCategories":[{"name":"Holiday","textColor":"#FFFFFF","color":"#148e94"}],"seasons":[{"name":"Spring","startingMonth":2,"startingDay":19,"color":"#46b946","icon":"spring","sunriseTime":21600,"sunsetTime":64800},{"name":"Summer","startingMonth":5,"startingDay":19,"color":"#e0c40b","icon":"summer","sunriseTime":21600,"sunsetTime":64800},{"name":"Fall","startingMonth":8,"startingDay":21,"color":"#ff8e47","icon":"fall","sunriseTime":21600,"sunsetTime":64800},{"name":"Winter","startingMonth":11,"startingDay":20,"color":"#479dff","icon":"winter","sunriseTime":21600,"sunsetTime":64800}],"time":{"hoursInDay":24,"minutesInHour":60,"secondsInMinute":60,"gameTimeRatio":1,"unifyGameAndClockPause":false,"updateFrequency":1},"weekdays":[{"abbreviation":"Su","name":"Sunday","numericRepresentation":1},{"abbreviation":"Mo","name":"Monday","numericRepresentation":2},{"abbreviation":"Tu","name":"Tuesday","numericRepresentation":3},{"abbreviation":"We","name":"Wednesday","numericRepresentation":4},{"abbreviation":"Th","name":"Thursday","numericRepresentation":5},{"abbreviation":"Fr","name":"Friday","numericRepresentation":6},{"abbreviation":"Sa","name":"Saturday","numericRepresentation":7}],"year":{"numericRepresentation":2022,"prefix":"","postfix":"","showWeekdayHeadings":true,"firstWeekday":4,"yearZero":1970,"yearNames":[],"yearNamingRule":"default","yearNamesStart":0}}}`);
        await PredefinedCalendar.setToPredefined(tCal, PredefinedCalendars.Gregorian);

        nd = {calendarId: 'test', startDate: {year: 0, month: 0, day: 0, hour: 0, minute: 0, seconds: 0}, endDate: {year: 0, month: 0, day: 0, hour: 0, minute: 0, seconds: 0}, allDay: false, repeats: NoteRepeat.Yearly, order: 1, fromPredefined: true, categories: [], remindUsers: ['qwe']};

        je = {
            data:{
                name: 'Journal',
                content: 'test',
                flags: {
                    'foundryvtt-simple-calendar':{}
                },
                permission: {'': 3, 'a': 0}
            },
            name: 'Journal',
            getFlag: jest.fn().mockReturnValueOnce(null).mockReturnValue(nd),
            setFlag: jest.fn(),
            testUserPermission: () => {return true;},
            update: async () => {},
            delete: async () => {}
        };

        ns = new NoteSheet(je);
    });

    test('Get Default Options', () => {
        expect(NoteSheet.defaultOptions).toBeDefined();
    });

    test('Get Default Object', () => {
        expect(NoteSheet.defaultObject).toEqual({});
    });

    test('Template', () => {
        expect(ns.template).toBe('');
    });

    test('Type', () => {
        expect(ns.type).toBe('simplecalendarnote');
    });

    test('Copy Data', () => {
        ns.copyData();
        // @ts-ignore
        expect(ns.journalData.name).toBe('Journal');
        // @ts-ignore
        expect(ns.journalData.content).toBe('test');
    });

    test('Get Header Buttons', () => {
        //@ts-ignore
        expect(ns._getHeaderButtons().length).toBe(1);
    });

    test('Close', async () => {
        await ns.close();

        //@ts-ignore
        ns.dirty = true;
        await ns.close();
        //@ts-ignore
        expect(global.DialogRenderer).toHaveBeenCalledTimes(1);
    });

    test('Is Dirty Dialog Close', async () => {
        jest.spyOn(ns, 'close').mockImplementation(async () => {});
        jest.spyOn(ns, 'save').mockImplementation(async () => {});

        await ns.isDirtyDialogClose(false);
        expect(ns.close).toHaveBeenCalledTimes(1);
        expect(ns.save).toHaveBeenCalledTimes(0);

        await ns.isDirtyDialogClose(true);
        expect(ns.close).toHaveBeenCalledTimes(2);
        expect(ns.save).toHaveBeenCalledTimes(1);
    });

    test('Render', () => {
        ns.render();
        //@ts-ignore
        expect(ns.editMode).toBe(false);

        ns.render(true, {}, true);
        //@ts-ignore
        expect(ns.editMode).toBe(true);
    });

    test('Get Data', () => {
        expect(ns.getData()).toBeDefined();
        nd.endDate.day = 1;
        nd.categories.push('asd');
        //@ts-ignore
        jest.spyOn(NManager, 'getNoteStub').mockReturnValueOnce({title: 'Journal', noteData: null}).mockReturnValue({title: 'Journal', noteData: nd});
        //@ts-ignore
        ns.editMode = true;
        expect(ns.getData()).toBeDefined();
        expect(ns.getData()).toBeDefined();

        //@ts-ignore
        ns.editMode = false;
        expect(ns.getData()).toBeDefined();
    });

    test('Set Height', () => {
        const form = document.createElement('form');
        const elm = document.createElement('div');
        //@ts-ignore
        ns.appWindow = document.createElement('div');
        //@ts-ignore
        jest.spyOn(ns.appWindow, 'getElementsByTagName').mockImplementation(() => {return [form]});
        //@ts-ignore
        jest.spyOn(ns,'setPosition').mockImplementation(() => {});
        //@ts-ignore
        jest.spyOn(ns.appWindow, 'querySelector').mockImplementation(() => {return elm;});

        NoteSheet.setHeight(ns);
        //@ts-ignore
        expect(ns.setPosition).toHaveBeenCalledTimes(1);

        //@ts-ignore
        ns.editMode = true;
        NoteSheet.setHeight(ns);
        //@ts-ignore
        expect(ns.setPosition).toHaveBeenCalledTimes(2);
    });

    test('Activate Listeners', () => {
        const appWindow = document.createElement('div');
        jest.spyOn(document, 'getElementById').mockReturnValue(appWindow);
        //@ts-ignore
        ns.activateListeners({});

        //@ts-ignore
        ns.editMode = true;
        jest.spyOn(ns, 'updateNoteRepeatDropdown').mockImplementation();
        //@ts-ignore
        jest.spyOn(appWindow, 'querySelectorAll').mockReturnValue([document.createElement('div')]);
        //@ts-ignore
        ns.activateListeners({});
        expect(ns.updateNoteRepeatDropdown).toHaveBeenCalledTimes(1);
    });

    test('Input Change', async () => {
        jest.spyOn(ns, 'writeInputValuesToObjects').mockImplementation(async()=>{});
        await ns.inputChange();
        expect(ns.writeInputValuesToObjects).toHaveBeenCalledTimes(1);
    });

    test('On Resize', () => {
        //@ts-ignore
        expect(ns.resized).toBe(false);
        //@ts-ignore
        ns._onResize();
        //@ts-ignore
        expect(ns.resized).toBe(true);
    });

    test('Date Selector Select', async () => {
        jest.spyOn(ns, 'updateNoteRepeatDropdown').mockImplementation();
        //@ts-ignore
        ns.journalData.flags[ModuleName] = {noteData:{}};
        await ns.dateSelectorSelect({timeSelected: false, startDate: {year: 0, month: 0, day: 0, hour: 0, minute: 0, seconds: 0}, endDate: {year: 0, month: 0, day: 0, hour: 0, minute: 0, seconds: 0}});
        expect(ns.updateNoteRepeatDropdown).toHaveBeenCalledTimes(1);

        await ns.dateSelectorSelect({timeSelected: false, startDate: {year: 0, month: 1, day: 1, hour: 0, minute: 0, seconds: 0}, endDate: {year: 0, month: 1, day: 1, hour: 0, minute: 0, seconds: 0}});
        expect(ns.updateNoteRepeatDropdown).toHaveBeenCalledTimes(2);
    });

    test('Update Note Repeat Dropdown', () => {
        const selector = document.createElement('select');
        //@ts-ignore
        ns.appWindow = document.createElement('div');
        //@ts-ignore
        jest.spyOn(ns.appWindow, 'querySelector').mockImplementation(() => {return selector});
        //@ts-ignore
        ns.journalData.flags[ModuleName] = {noteData:{repeats: 0, startDate: {year: 0, month: 0, day: 0, hour: 0, minute: 0, seconds: 0}, endDate: {year: 0, month: 0, day: 0, hour: 0, minute: 0, seconds: 0}}};

        ns.updateNoteRepeatDropdown();
        expect(selector.innerHTML).toContain('<option');

        //@ts-ignore
        ns.journalData.flags[ModuleName] = {noteData:{repeats: 0, startDate: {year: 0, month: 0, day: 0, hour: 0, minute: 0, seconds: 0}, endDate: {year: 1, month: 1, day: 0, hour: 0, minute: 0, seconds: 0}}};
        ns.updateNoteRepeatDropdown();
        expect(selector.innerHTML).toContain('<option');

        //@ts-ignore
        ns.journalData.flags[ModuleName] = {noteData:{repeats: 0, startDate: {year: 0, month: 0, day: 0, hour: 0, minute: 0, seconds: 0}, endDate: {year: 0, month: 1, day: 1, hour: 0, minute: 0, seconds: 0}}};
        ns.updateNoteRepeatDropdown();
        expect(selector.innerHTML).toContain('<option');

        //@ts-ignore
        ns.journalData.flags[ModuleName] = {noteData:{repeats: 0, startDate: {year: 0, month: 0, day: 0, hour: 0, minute: 0, seconds: 0}, endDate: {year: 0, month: 0, day: 8, hour: 0, minute: 0, seconds: 0}}};
        ns.updateNoteRepeatDropdown();
        expect(selector.innerHTML).toContain('<option');
    });

    test('Write Input Values To Objects', async () => {
        //@ts-ignore
        ns.appWindow = document.createElement('div');
        //@ts-ignore
        ns.journalData.flags[ModuleName] = {noteData:{}};
        //@ts-ignore
        ns.journalData.permission['a'] = 3;
        //@ts-ignore
        ns.journalData.permission['b'] = 2;
        //@ts-ignore
        ns.editors['content'] = {};

        jest.spyOn(Utilities, 'getCheckBoxGroupValues').mockReturnValueOnce([]).mockReturnValue(['a', 'b']);

        await ns.writeInputValuesToObjects();
        //@ts-ignore
        expect(ns.dirty).toBe(true);
        //@ts-ignore
        expect(ns.journalData.flags[ModuleName].noteData.repeats).toBe(0);
    });

    test('Reminder Change', async () => {
        //@ts-ignore
        ns.journalData.flags[ModuleName] = {noteData:{remindUsers: []}};
        jest.spyOn(MainApplication, 'updateApp').mockImplementation(() => {});
        jest.spyOn(GameSockets, 'emit').mockImplementation(async () => {return true;});
        //@ts-ignore
        game.user.id = 'a';

        await ns.reminderChange();
        //@ts-ignore
        expect(ns.journalData.flags[ModuleName].noteData.remindUsers).toContain('a');
        expect(MainApplication.updateApp).toHaveBeenCalledTimes(1);
        expect(GameSockets.emit).toHaveBeenCalledTimes(0);

        await ns.reminderChange();
        //@ts-ignore
        expect(ns.journalData.flags[ModuleName].noteData.remindUsers).not.toContain('a');
        expect(MainApplication.updateApp).toHaveBeenCalledTimes(2);
        expect(GameSockets.emit).toHaveBeenCalledTimes(0);

        je.testUserPermission = () => {return false;};
        await ns.reminderChange();
        expect(MainApplication.updateApp).toHaveBeenCalledTimes(3);
        expect(GameSockets.emit).toHaveBeenCalledTimes(1);
    });

    test('Edit', async () => {
        await ns.edit(new Event('click'));
        //@ts-ignore
        expect(ns.editMode).toBe(true);
    });

    test('Save', async () => {
        //@ts-ignore
        ns.journalData.flags[ModuleName] = {noteData:{remindUsers: []}};
        jest.spyOn(MainApplication, 'updateApp').mockImplementation(() => {});
        await ns.save(new Event('click'));
        //@ts-ignore
        expect(ns.dirty).toBe(false);
        expect(MainApplication.updateApp).toHaveBeenCalledTimes(1);
    });

    test('Delete', () => {
        ns.delete(new Event('click'));
        //@ts-ignore
        expect(global.DialogRenderer).toHaveBeenCalledTimes(1);
    });

    test('Delete Confirm', async () => {
        jest.spyOn(NManager, 'removeNoteStub').mockImplementation(() => {});
        jest.spyOn(MainApplication, 'updateApp').mockImplementation(() => {});

        await ns.deleteConfirm();
        expect(NManager.removeNoteStub).toHaveBeenCalledTimes(1);
        expect(MainApplication.updateApp).toHaveBeenCalledTimes(1);
    });
});