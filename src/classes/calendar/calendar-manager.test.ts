/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import {jest, beforeEach, describe, expect, test} from '@jest/globals';
import {
    CalManager,
    MainApplication,
    NManager,
    SC,
    updateCalManager,
    updateMainApplication,
    updateNManager,
    updateSC
} from "../index";
import CalendarManager from "./calendar-manager";
import SCController from "../s-c-controller";
import MainApp from "../applications/main-app";
import NoteManager from "../notes/note-manager";
import Calendar from "./index";
import {GameSettings} from "../foundry-interfacing/game-settings";
import fetchMock from "jest-fetch-mock";
import PredefinedCalendar from "../configuration/predefined-calendar";
import {Hook} from "../api/hook";
import {TimeKeeperStatus} from "../../constants";

fetchMock.enableMocks();
describe('Calendar Manager Class Tests', () => {

    let tCal: Calendar;

    beforeEach(async () => {
        fetchMock.resetMocks();
        fetchMock.mockOnce(`{"calendar":{"currentDate":{"year":2022,"month":2,"day":28,"seconds":0},"general":{"gameWorldTimeIntegration":"mixed","showClock":true,"noteDefaultVisibility":false,"postNoteRemindersOnFoundryLoad":true,"pf2eSync":true,"dateFormat":{"date":"MMMM DD, YYYY","time":"HH:mm:ss","monthYear":"MMMM YAYYYYYZ"}},"leapYear":{"rule":"gregorian","customMod":0},"months":[{"name":"January","abbreviation":"Jan","numericRepresentation":1,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"February","abbreviation":"Feb","numericRepresentation":2,"numericRepresentationOffset":0,"numberOfDays":28,"numberOfLeapYearDays":29,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"March","abbreviation":"Mar","numericRepresentation":3,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"April","abbreviation":"Apr","numericRepresentation":4,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"May","abbreviation":"May","numericRepresentation":5,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"June","abbreviation":"Jun","numericRepresentation":6,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"July","abbreviation":"Jul","numericRepresentation":7,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"August","abbreviation":"Aug","numericRepresentation":8,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"September","abbreviation":"Sep","numericRepresentation":9,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"October","abbreviation":"Oct","numericRepresentation":10,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"November","abbreviation":"Nov","numericRepresentation":11,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"December","abbreviation":"Dec","numericRepresentation":12,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null}],"moons":[{"name":"Moon","cycleLength":29.53059,"firstNewMoon":{"yearReset":"none","yearX":0,"year":2000,"month":1,"day":5},"phases":[{"name":"New Moon","length":1,"icon":"new","singleDay":true},{"name":"Waxing Crescent","length":6.38265,"icon":"waxing-crescent","singleDay":false},{"name":"First Quarter","length":1,"icon":"first-quarter","singleDay":true},{"name":"Waxing Gibbous","length":6.38265,"icon":"waxing-gibbous","singleDay":false},{"name":"Full Moon","length":1,"icon":"full","singleDay":true},{"name":"Waning Gibbous","length":6.38265,"icon":"waning-gibbous","singleDay":false},{"name":"Last Quarter","length":1,"icon":"last-quarter","singleDay":true},{"name":"Waning Crescent","length":6.38265,"icon":"waning-crescent","singleDay":false}],"color":"#ffffff","cycleDayAdjust":0.5}],"noteCategories":[{"name":"Holiday","textColor":"#FFFFFF","color":"#148e94"}],"seasons":[{"name":"Spring","startingMonth":2,"startingDay":19,"color":"#46b946","icon":"spring","sunriseTime":21600,"sunsetTime":64800},{"name":"Summer","startingMonth":5,"startingDay":19,"color":"#e0c40b","icon":"summer","sunriseTime":21600,"sunsetTime":64800},{"name":"Fall","startingMonth":8,"startingDay":21,"color":"#ff8e47","icon":"fall","sunriseTime":21600,"sunsetTime":64800},{"name":"Winter","startingMonth":11,"startingDay":20,"color":"#479dff","icon":"winter","sunriseTime":21600,"sunsetTime":64800}],"time":{"hoursInDay":24,"minutesInHour":60,"secondsInMinute":60,"gameTimeRatio":1,"unifyGameAndClockPause":false,"updateFrequency":1},"weekdays":[{"abbreviation":"Su","name":"Sunday","numericRepresentation":1},{"abbreviation":"Mo","name":"Monday","numericRepresentation":2},{"abbreviation":"Tu","name":"Tuesday","numericRepresentation":3},{"abbreviation":"We","name":"Wednesday","numericRepresentation":4},{"abbreviation":"Th","name":"Thursday","numericRepresentation":5},{"abbreviation":"Fr","name":"Friday","numericRepresentation":6},{"abbreviation":"Sa","name":"Saturday","numericRepresentation":7}],"year":{"numericRepresentation":2022,"prefix":"","postfix":"","showWeekdayHeadings":true,"firstWeekday":4,"yearZero":1970,"yearNames":[],"yearNamingRule":"default","yearNamesStart":0}}}`);
        updateCalManager(new CalendarManager());
        updateSC(new SCController());
        updateMainApplication(new MainApp());
        updateNManager(new NoteManager());

        tCal = new Calendar('1', 'cal1');
        //@ts-ignore
        CalManager.calendars['1'] = tCal;
        //@ts-ignore
        CalManager.activeId = '1';
        //@ts-ignore
        CalManager.visibleId  = '1';
    });

    test('Sync With All Calendars', () => {
        expect(CalManager.syncWithAllCalendars).toBe(false);
        CalManager.addCalendar('2', 'cal2', {id: '2'});
        SC.globalConfiguration.syncCalendars = true;
        expect(CalManager.syncWithAllCalendars).toBe(true);
    });

    test('Initialize', async () => {
        jest.spyOn(CalManager, 'loadCalendars').mockReturnValueOnce(1).mockReturnValueOnce(0);
        jest.spyOn(CalManager, 'loadActiveCalendar').mockImplementation(() => {});
        jest.spyOn(CalManager, 'getDefaultCalendar').mockImplementation(async () => {return tCal;});

        await CalManager.initialize();
        expect(CalManager.loadCalendars).toHaveBeenCalledTimes(1);
        expect(CalManager.loadActiveCalendar).toHaveBeenCalledTimes(1);
        expect(CalManager.getDefaultCalendar).not.toHaveBeenCalled();

        await CalManager.initialize();
        expect(CalManager.loadCalendars).toHaveBeenCalledTimes(2);
        expect(CalManager.loadActiveCalendar).toHaveBeenCalledTimes(1);
        expect(CalManager.getDefaultCalendar).toHaveBeenCalledTimes(1);
    });

    test('Save Calendars', async () => {
        jest.spyOn(tCal, 'toConfig').mockReturnValue({id: ''});
        jest.spyOn(GameSettings, 'SaveStringSetting').mockImplementation(async () => {return true;});
        jest.spyOn(GameSettings, 'SaveObjectSetting').mockImplementation(async () => {return true;});

        await CalManager.saveCalendars();
        expect(tCal.toConfig).toHaveBeenCalledTimes(1);
        expect(GameSettings.SaveStringSetting).toHaveBeenCalledTimes(1);
        expect(GameSettings.SaveObjectSetting).toHaveBeenCalledTimes(1);
    });

    test('Load Calendars', () => {
        //@ts-ignore
        CalManager.calendars = {};
        const mLoad = jest.spyOn(GameSettings, 'GetObjectSettings').mockReturnValue([]);
        jest.spyOn(NManager, 'checkNoteTriggers').mockImplementation(() => {});
        expect(CalManager.loadCalendars()).toBe(0);

        mLoad.mockReturnValueOnce(['']);
        expect(CalManager.loadCalendars()).toBe(0);

        jest.spyOn(tCal,'loadFromSettings').mockImplementation(() => {});
        //jest.spyOn(CalManager,'addCalendar').mockImplementation(() => {return new Calendar('','')});
        mLoad.mockReturnValueOnce([tCal.toConfig()]);
        expect(CalManager.loadCalendars()).toBe(1);

        mLoad.mockReturnValueOnce([{id: '3'}]);
        expect(CalManager.loadCalendars()).toBe(2);

        mLoad.mockReturnValueOnce([{id: '3'}]);
        //@ts-ignore
        CalManager.activeId = '';
        expect(CalManager.loadCalendars()).toBe(2);
        //@ts-ignore
        expect(CalManager.activeId).toBe('3');
    });

    test('Load Active Calendar', () => {
        jest.spyOn(GameSettings, 'GetStringSettings').mockReturnValue('1');
        jest.spyOn(MainApplication, 'updateApp').mockImplementation(() => {});

        CalManager.loadActiveCalendar();
        expect(MainApplication.updateApp).toHaveBeenCalledTimes(1);
        //@ts-ignore
        expect(CalManager.activeId).toBe('1');
        //@ts-ignore
        expect(CalManager.visibleId).toBe('1');

    });

    test('Add Calendar', () => {
        expect(CalManager.addCalendar('4', 'new', {id: '4'})).toBeDefined();
        //@ts-ignore
        expect(Object.keys(CalManager.calendars).length).toBe(2);
    });

    test('Add Temp Calendar', () => {
        const newCal = CalManager.addTempCalendar('new')
        expect(newCal).toBeDefined();
        expect(newCal.id).toContain('_temp');
        //@ts-ignore
        expect(Object.keys(CalManager.calendars).length).toBe(2);
    });

    test('Get Default Calendar', async () => {
        jest.spyOn(PredefinedCalendar, 'setToPredefined');
        const d1 = await CalManager.getDefaultCalendar();
        expect(d1).toBeDefined();
        expect(d1.id).toBe('default');
        expect(PredefinedCalendar.setToPredefined).toHaveBeenCalledTimes(1);

        expect(await CalManager.getDefaultCalendar()).toStrictEqual(d1);
    });

    test('Get Calendar', () => {
        expect(CalManager.getCalendar('qa')).toBeNull();
        expect(CalManager.getCalendar('1')).toStrictEqual(tCal);
    });

    test('Sort Calendars', async () => {
        const d1 =await CalManager.getDefaultCalendar();
        d1.id += '_temp';
        //@ts-ignore
        expect(CalendarManager.sortCalendars(d1, tCal)).toBe(-1);
        //@ts-ignore
        expect(CalendarManager.sortCalendars(tCal, d1)).toBe(1);
        //@ts-ignore
        expect(CalendarManager.sortCalendars(tCal, tCal)).toBe(0);
    });

    test('Get All Calendars', () => {
        expect(CalManager.getAllCalendars().length).toBe(1);
        expect(CalManager.getAllCalendars(true).length).toBe(0);
    });

    test('Get Active Calendar', () => {
        expect(CalManager.getActiveCalendar()).toStrictEqual(tCal);
    });

    test('Get Visible Calendar', () => {
        expect(CalManager.getVisibleCalendar()).toStrictEqual(tCal);
    });

    test('Set Calendars', () => {
        jest.spyOn(tCal, 'loadFromSettings').mockImplementation(() => {});
        jest.spyOn(CalManager,'setActiveCalendar').mockImplementation(() => {});
        jest.spyOn(CalManager,'setVisibleCalendar').mockImplementation(() => {});
        CalManager.setCalendars([tCal]);
        expect(tCal.loadFromSettings).toHaveBeenCalledTimes(1);
        expect(CalManager.setActiveCalendar).toHaveBeenCalledTimes(1);
        expect(CalManager.setVisibleCalendar).toHaveBeenCalledTimes(1);

        CalManager.setCalendars([new Calendar('12', '12')]);
        //@ts-ignore
        expect(Object.keys(CalManager.calendars).length).toBe(1);
        expect(CalManager.setActiveCalendar).toHaveBeenCalledTimes(2);
        expect(CalManager.setVisibleCalendar).toHaveBeenCalledTimes(2);
    });

    test('Set Active Calendar', () => {
        jest.spyOn(GameSettings,'SaveStringSetting').mockImplementation(async () => {return true;});
        jest.spyOn(Hook, 'emit').mockImplementation(() => {});
        jest.spyOn(tCal,'syncTime').mockImplementation(async () => {});
        CalManager.setActiveCalendar('1');
        expect(GameSettings.SaveStringSetting).toHaveBeenCalledTimes(1);
        expect(Hook.emit).toHaveBeenCalledTimes(1);
        expect(tCal.syncTime).toHaveBeenCalledTimes(1);
        //@ts-ignore
        expect(CalManager.activeId).toBe('1');
        //@ts-ignore
        expect(CalManager.visibleId).toBe('1');

        jest.spyOn(tCal.timeKeeper, 'start');
        tCal.timeKeeper.setStatus(TimeKeeperStatus.Started);
        CalManager.setActiveCalendar('1');
        expect(tCal.timeKeeper.start).toHaveBeenCalledTimes(1);
    });

    test('Set Visible Calendar', () => {
        jest.spyOn(MainApplication, 'updateApp').mockImplementation(() => {});
        CalManager.setVisibleCalendar('1');
        expect(MainApplication.updateApp).toHaveBeenCalledTimes(1);
        //@ts-ignore
        expect(CalManager.visibleId).toBe('1');
    });

    test('Remove Calendar', () => {
        CalManager.removeCalendar('123');
        //@ts-ignore
        expect(Object.keys(CalManager.calendars).length).toBe(1);

        CalManager.removeCalendar('1');
        //@ts-ignore
        expect(Object.keys(CalManager.calendars).length).toBe(0);
    });

    test('Clone Calendars', () => {
        expect(CalManager.cloneCalendars().length).toBe(1);
        expect(CalManager.cloneCalendars().length).toBe(2);
    });

    test('Merge Cloned Calendars', () => {
        jest.spyOn(CalManager,'setActiveCalendar').mockImplementation(() => {});
        jest.spyOn(CalManager,'setVisibleCalendar').mockImplementation(() => {});
        jest.spyOn(tCal, 'loadFromSettings').mockImplementation(() => {});
        CalManager.cloneCalendars();
        CalManager.mergeClonedCalendars();
        expect(tCal.loadFromSettings).toHaveBeenCalledTimes(1);
        expect(CalManager.setActiveCalendar).not.toHaveBeenCalled();
        expect(CalManager.setVisibleCalendar).not.toHaveBeenCalled();
        //@ts-ignore
        expect(Object.keys(CalManager.calendars).length).toBe(1);

        //@ts-ignore
        CalManager.activeId = 'q';
        //@ts-ignore
        CalManager.visibleId  = 'q';
        CalManager.addCalendar('new_temp', "new", {id:"new_temp"});
        CalManager.cloneCalendars();
        CalManager.mergeClonedCalendars();
        expect(tCal.loadFromSettings).toHaveBeenCalledTimes(2);
        expect(CalManager.setActiveCalendar).toHaveBeenCalledTimes(1);
        expect(CalManager.setVisibleCalendar).toHaveBeenCalledTimes(1);
        //@ts-ignore
        expect(Object.keys(CalManager.calendars).length).toBe(2);
    });

    test('Clear Clones', () => {
        CalManager.cloneCalendars();
        //@ts-ignore
        expect(Object.keys(CalManager.calendars).length).toBe(2);
        CalManager.clearClones();
        //@ts-ignore
        expect(Object.keys(CalManager.calendars).length).toBe(1);
    });

    test('Sync With Calendars', async () => {
        const d1 = await CalManager.getDefaultCalendar();
        jest.spyOn(tCal,'changeDateTime').mockImplementation(() => {return true;});
        jest.spyOn(d1,'changeDateTime').mockImplementation(() => {return true;});
        CalManager.syncWithCalendars({});
        expect(tCal.changeDateTime).not.toHaveBeenCalled();
        expect(d1.changeDateTime).toHaveBeenCalledTimes(1);
    });
});
