/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import {jest, beforeEach, describe, expect, test} from '@jest/globals';

import Calendar from "../calendar";
import {CalManager, SC, updateCalManager, updateNManager, updateSC} from "../index";
import CalendarManager from "../calendar/calendar-manager";
import NoteStub from "./note-stub";
import {NoteReminderNotificationType, NoteRepeat, PredefinedCalendars} from "../../constants";
import fetchMock from "jest-fetch-mock";
import PredefinedCalendar from "../configuration/predefined-calendar";
import NoteManager from "./note-manager";
import SCController from "../s-c-controller";
import Mock = jest.Mock;

fetchMock.enableMocks();
describe('Note Stub Class Tests', () => {
    let tCal: Calendar;
    let nStub: NoteStub;
    let je: any;
    let nd: any;
    let jp: any;

    beforeEach(async () => {
        updateSC(new SCController());
        updateCalManager(new CalendarManager());
        updateNManager(new NoteManager());
        tCal = new Calendar('test','');
        jest.spyOn(CalManager, 'getActiveCalendar').mockImplementation(() => {return tCal;});
        jest.spyOn(CalManager, 'getCalendar').mockImplementation(() => {return tCal;});
        fetchMock.resetMocks();
        fetchMock.mockOnce(`{"calendar":{"currentDate":{"year":2022,"month":2,"day":28,"seconds":0},"general":{"gameWorldTimeIntegration":"mixed","showClock":true,"noteDefaultVisibility":false,"postNoteRemindersOnFoundryLoad":true,"pf2eSync":true,"dateFormat":{"date":"MMMM DD, YYYY","time":"HH:mm:ss","monthYear":"MMMM YAYYYYYZ"}},"leapYear":{"rule":"gregorian","customMod":0},"months":[{"name":"January","abbreviation":"Jan","numericRepresentation":1,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"February","abbreviation":"Feb","numericRepresentation":2,"numericRepresentationOffset":0,"numberOfDays":28,"numberOfLeapYearDays":29,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"March","abbreviation":"Mar","numericRepresentation":3,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"April","abbreviation":"Apr","numericRepresentation":4,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"May","abbreviation":"May","numericRepresentation":5,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"June","abbreviation":"Jun","numericRepresentation":6,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"July","abbreviation":"Jul","numericRepresentation":7,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"August","abbreviation":"Aug","numericRepresentation":8,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"September","abbreviation":"Sep","numericRepresentation":9,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"October","abbreviation":"Oct","numericRepresentation":10,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"November","abbreviation":"Nov","numericRepresentation":11,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"December","abbreviation":"Dec","numericRepresentation":12,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null}],"moons":[{"name":"Moon","cycleLength":29.53059,"firstNewMoon":{"yearReset":"none","yearX":0,"year":2000,"month":1,"day":5},"phases":[{"name":"New Moon","length":1,"icon":"new","singleDay":true},{"name":"Waxing Crescent","length":6.38265,"icon":"waxing-crescent","singleDay":false},{"name":"First Quarter","length":1,"icon":"first-quarter","singleDay":true},{"name":"Waxing Gibbous","length":6.38265,"icon":"waxing-gibbous","singleDay":false},{"name":"Full Moon","length":1,"icon":"full","singleDay":true},{"name":"Waning Gibbous","length":6.38265,"icon":"waning-gibbous","singleDay":false},{"name":"Last Quarter","length":1,"icon":"last-quarter","singleDay":true},{"name":"Waning Crescent","length":6.38265,"icon":"waning-crescent","singleDay":false}],"color":"#ffffff","cycleDayAdjust":0.5}],"noteCategories":[{"name":"Holiday","textColor":"#FFFFFF","color":"#148e94"}],"seasons":[{"name":"Spring","startingMonth":2,"startingDay":19,"color":"#46b946","icon":"spring","sunriseTime":21600,"sunsetTime":64800},{"name":"Summer","startingMonth":5,"startingDay":19,"color":"#e0c40b","icon":"summer","sunriseTime":21600,"sunsetTime":64800},{"name":"Fall","startingMonth":8,"startingDay":21,"color":"#ff8e47","icon":"fall","sunriseTime":21600,"sunsetTime":64800},{"name":"Winter","startingMonth":11,"startingDay":20,"color":"#479dff","icon":"winter","sunriseTime":21600,"sunsetTime":64800}],"time":{"hoursInDay":24,"minutesInHour":60,"secondsInMinute":60,"gameTimeRatio":1,"unifyGameAndClockPause":false,"updateFrequency":1},"weekdays":[{"abbreviation":"Su","name":"Sunday","numericRepresentation":1},{"abbreviation":"Mo","name":"Monday","numericRepresentation":2},{"abbreviation":"Tu","name":"Tuesday","numericRepresentation":3},{"abbreviation":"We","name":"Wednesday","numericRepresentation":4},{"abbreviation":"Th","name":"Thursday","numericRepresentation":5},{"abbreviation":"Fr","name":"Friday","numericRepresentation":6},{"abbreviation":"Sa","name":"Saturday","numericRepresentation":7}],"year":{"numericRepresentation":2022,"prefix":"","postfix":"","showWeekdayHeadings":true,"firstWeekday":4,"yearZero":1970,"yearNames":[],"yearNamingRule":"default","yearNamesStart":0}}}`);
        await PredefinedCalendar.setToPredefined(tCal, PredefinedCalendars.Gregorian);
        nStub = new NoteStub('je1');
        tCal.noteCategories.push({name: 'qwe', id: '', color: '', textColor: ''});

        nd = {calendarId: 'test', startDate: {year: 0, month: 0, day: 0, hour: 0, minute: 0, seconds: 0}, endDate: {year: 0, month: 0, day: 0, hour: 0, minute: 0, seconds: 0}, allDay: false, repeats: NoteRepeat.Yearly, order: 1, fromPredefined: true, categories: [], remindUsers: ['qwe'], macro: '123abc'};

        jp = {}

        je = {
            data:{
                content: 'test',
                 permission: {'': 3, 'a': 0}
            },
            name: 'Journal',
            getFlag: jest.fn().mockReturnValueOnce(null).mockReturnValue(nd),
            setFlag: jest.fn(),
            testUserPermission: () => {return true;},
            ownership: {'': 3, 'a': 0},
            link: 'asd',
            pages: {
                contents: [jp]
            }
        };

        //@ts-ignore
        jest.spyOn(game.journal, 'get').mockReturnValue(je);
        //@ts-ignore
        game.user.isGM = false;
    });

    test('Reminder Note Trigger', () => {
        jest.spyOn(ChatMessage, 'create').mockImplementation(async () => {return undefined});
        jest.spyOn(nStub, 'userReminderRegistered', 'get').mockReturnValue(true);
        expect(NoteStub.reminderNoteTrigger(nStub, false)).toBe(false);
        expect(NoteStub.reminderNoteTrigger(nStub, true)).toBe(true);
        SC.clientSettings.noteReminderNotification = NoteReminderNotificationType.render;
        expect(NoteStub.reminderNoteTrigger(nStub, true)).toBe(true);
    });

    test('Macro Note Trigger', () => {
        expect(NoteStub.macroNoteTrigger(nStub, false)).toBe(false);
        expect(NoteStub.macroNoteTrigger(nStub, false)).toBe(true);
    });

    test('Note Data', () => {
        //@ts-ignore
        (<Mock>game.journal.get).mockReturnValueOnce(null);
        expect(nStub.noteData).toBeNull();
        expect(nStub.noteData).toBeDefined();
    });

    test('Ownership', () => {
        //@ts-ignore
        (<Mock>game.journal.get).mockReturnValueOnce(null);
        expect(nStub.ownership).toStrictEqual({});
        expect(nStub.ownership).toBeDefined();
    });

    test('All Day', () => {
        expect(nStub.allDay).toBe(true);
        expect(nStub.allDay).toBe(false);
    });

    test('Link', () => {
        //@ts-ignore
        (<Mock>game.journal.get).mockReturnValueOnce(null);
        expect(nStub.link).toBe('');
        expect(nStub.link).toBeDefined();
    });

    test('Title', () => {
        //@ts-ignore
        (<Mock>game.journal.get).mockReturnValueOnce(null);
        expect(nStub.title).toBe('');
        expect(nStub.title).toBe('Journal');
    });

    test('Pages', () => {
        //@ts-ignore
        (<Mock>game.journal.get).mockReturnValueOnce(null);
        expect(nStub.pages.length).toBe(0);
        expect(nStub.pages.length).toBe(1);
    });

    test('Repeats', () => {
        expect(nStub.repeats).toBe(NoteRepeat.Never);
        expect(nStub.repeats).toBe(NoteRepeat.Yearly);
    });

    test('Order', () => {
        expect(nStub.order).toBe(0);
        expect(nStub.order).toBe(1);
    });

    test('Set Order', async () => {
        await nStub.setOrder(2);
        await nStub.setOrder(2);
    });

    test('Author Display', () => {
        //@ts-ignore
        (<Mock>game.journal.get).mockReturnValueOnce(null);
        expect(nStub.authorDisplay).toBeNull();

        //@ts-ignore
        (<Mock>game.users.get).mockReturnValueOnce(game.user);
        expect(nStub.authorDisplay).toEqual({"color": "", "colorText": "#000000", "name": ""});
        expect(nStub.authorDisplay).toEqual({"color": "", "colorText": "", "name": "System"});
    });

    test('Can Edit', () => {
        expect(nStub.canEdit).toBe(true);
    });

    test('Categories', () => {
        expect(nStub.categories).toEqual([]);
        expect(nStub.categories).toEqual([]);
    });

    test('Display Date', () => {
        //@ts-ignore
        jest.spyOn(nStub, 'getDisplayDate').mockImplementation(() => { return ''});
        expect(nStub.displayDate).toEqual('');
        //@ts-ignore
        expect(nStub.getDisplayDate).toHaveBeenCalledTimes(1);
    });

    test('Full Display Date', () => {
        //@ts-ignore
        jest.spyOn(nStub, 'getDisplayDate').mockImplementation(() => { return ''});
        expect(nStub.fullDisplayDate).toEqual('');
        //@ts-ignore
        expect(nStub.getDisplayDate).toHaveBeenCalledTimes(1);
    });

    test('Player Visible', () => {
        jest.spyOn(nStub, 'ownership', 'get').mockReturnValue({'': 1});
        expect(nStub.playerVisible).toEqual({ icon: 'fa-eye-slash', color: 'fsc-danger', players: "" });
        //@ts-ignore
        jest.spyOn(game.users, 'filter').mockReturnValueOnce([]);
        expect(nStub.playerVisible).toEqual({ icon: 'fa-eye', color: 'fsc-success', players: ":<ul style=\"text-align: left;padding: 0;margin-bottom:0;list-style: none;\"><li></li></ul>" });
        //@ts-ignore
        jest.spyOn(game.users, 'filter').mockReturnValue([game.user, game.user]);
        //@ts-ignore
        (<Mock>game.users.get).mockReturnValueOnce(game.user);
        expect(nStub.playerVisible).toEqual({ icon: 'fa-eye-low-vision', color: 'fsc-secondary', players: ":<ul style=\"text-align: left;padding: 0;margin-bottom:0;list-style: none;\"><li></li><li></li></ul>" });
    });

    test('User Reminder Registered', () => {
        expect(nStub.userReminderRegistered).toEqual(false);
        expect(nStub.userReminderRegistered).toEqual(false);
    });

    test('From Predefined', () => {
        expect(nStub.fromPredefined).toEqual(false);
        expect(nStub.fromPredefined).toEqual(true);
    });

    test('Macro', () => {
        expect(nStub.macro).toBe('none');
        expect(nStub.macro).toBe('123abc');
    });

    test('Can User View', () => {
        //@ts-ignore
        (<Mock>game.journal.get).mockReturnValueOnce(null);
        expect(nStub.canUserView()).toEqual(false);
        expect(nStub.canUserView()).toEqual(true);
    });

    test('Get Display Date', () => {
        tCal.year.selectedYear = 0;
        tCal.year.visibleYear = 0;
        expect(nStub.displayDate).toBe('');
        expect(nStub.displayDate).toBe(' 00:00');

        nd.endDate.year = 1;
        tCal.resetMonths('current');
        tCal.resetMonths('selected');
        expect(nStub.displayDate).toBe('January 01, 0 00:00 - January 01, 1');
        nd.startDate.day = 1;
        expect(nStub.displayDate).toBe('January 02, -1 00:00 - January 01, 0');

        nd.repeats = NoteRepeat.Monthly;
        nd.endDate.year = 0;
        nd.startDate.day = 0;
        expect(nStub.displayDate).toBe(' 00:00');

        nd.startDate.day = 10;
        nd.endDate.month = 1;
        nd.endDate.day = 1;
        expect(nStub.displayDate).toBe('December 11, -1 00:00 - January 02, 0');

        tCal.months[0].current = true;
        tCal.months[0].days[12].current = true;
        expect(nStub.displayDate).toBe('January 11, 0 00:00 - February 02, 0');

        tCal.resetMonths('current');
        tCal.months[11].current = true;
        tCal.months[11].days[12].current = true;
        expect(nStub.displayDate).toBe('December 11, 0 00:00 - January 02, 1');

        nd.startDate.day = 44;
        nd.endDate.day = 44;
        expect(nStub.displayDate).toBe('November 30, 0 00:00 - December 31, 0');

        tCal.year.visibleYear = 1999;
        expect(nStub.displayDate).toBe('November 30, 1999 00:00 - December 31, 1999');


        tCal.resetMonths('current');
        nd.repeats = NoteRepeat.Weekly;
        nd.startDate.day = 0;
        nd.endDate.day = 0;
        nd.endDate.month = 0;
        expect(nStub.displayDate).toBe(' 00:00');

        tCal.year.visibleYear = 2022;
        nd.startDate.day = 2;
        nd.endDate.day = 4;
        expect(nStub.displayDate).toBe('January 03, 2022 00:00 - January 05, 2022');

        nd.startDate.day = 5;
        nd.endDate.day = 9;
        expect(nStub.displayDate).toBe('December 30, 2021 00:00 - January 03, 2022');
        tCal.year.visibleYear = 2021
        expect(nStub.displayDate).toBe('December 31, 2020 00:00 - January 04, 2021');

        nd.startDate.day = 6;
        nd.endDate.day = 9;
        tCal.months[11].current = true;
        tCal.months[11].days[30].current = true;
        expect(nStub.displayDate).toBe('December 31, 2021 00:00 - January 03, 2022');
        tCal.year.visibleYear = 2020;
        nd.startDate.day = 8;
        nd.startDate.year = 2020;
        nd.endDate.day = 12;
        nd.endDate.year = 2020;
        expect(nStub.displayDate).toBe('December 31, 2020 00:00 - January 04, 2021');
    });

    test('Is Visible', () => {
        expect(nStub.isVisible('', 2022, 0, 0)).toBe(false); //Note Data is null for first call

        //Exact Check
        nd.repeats = NoteRepeat.Never;
        expect(nStub.isVisible('', 2022, 0, 0)).toBe(false);

        //Yearly Repeat
        nd.repeats = NoteRepeat.Yearly;
        expect(nStub.isVisible('', 2022, 0, 0)).toBe(true);
        nd.startDate.month = 10;
        nd.endDate.year = 1;
        expect(nStub.isVisible('', 2022, 0, 0)).toBe(true);

        //Monthly Repeat
        nd.repeats = NoteRepeat.Monthly;
        nd.startDate.month = 0;
        nd.endDate.year = 0;
        expect(nStub.isVisible('', 2022, 0, 0)).toBe(true);
        nd.startDate.day = 15;
        nd.endDate.month = 1;
        expect(nStub.isVisible('', 2022, 0, 0)).toBe(true);
        nd.startDate.day = 25;
        nd.startDate.month = 10;
        nd.endDate.day = 1;
        nd.endDate.month = 11;
        expect(nStub.isVisible('', 2022, 11, 28)).toBe(true);

        //Weekly Repeat
        nd.repeats = NoteRepeat.Weekly;
        nd.startDate.day = 0;
        nd.startDate.month = 0;
        nd.endDate.day = 0;
        nd.endDate.month = 0;
        expect(nStub.isVisible('', 2022, 0, 0)).toBe(true);
        nd.endDate.day = 1;
        expect(nStub.isVisible('', 2022, 0, 1)).toBe(true);
        nd.endDate.day = 3;
        expect(nStub.isVisible('', 2022, 0, 1)).toBe(true);

        nd.startDate.year = 2022;
        nd.endDate.year = 2022;
        nd.startDate.day = 2;
        nd.endDate.day = 4;
        expect(nStub.isVisible('', 2022, 0, 3)).toBe(true);
        nd.startDate.day = 6;
        nd.endDate.day = 9;
        expect(nStub.isVisible('', 2022, 0, 7)).toBe(true);
    });
});
