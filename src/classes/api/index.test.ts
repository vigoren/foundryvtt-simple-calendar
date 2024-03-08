/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import { jest, beforeEach, describe, expect, test } from "@jest/globals";

import MainApp from "../applications/main-app";
import * as API from "./index";
import {
    DateSelectorPositions,
    Icons,
    LeapYearRules,
    MoonYearResetOptions,
    NoteRepeat,
    PredefinedCalendars,
    PresetTimeOfDay,
    TimeKeeperStatus,
    YearNamingRules
} from "../../constants";
import Calendar from "../calendar";
import {
    CalManager,
    MainApplication,
    MigrationApplication,
    NManager,
    SC,
    updateCalManager,
    updateMainApplication,
    updateMigrationApplication,
    updateNManager,
    updateSC
} from "../index";
import CalendarManager from "../calendar/calendar-manager";
import SCController from "../s-c-controller";
import NoteManager from "../notes/note-manager";
import Renderer from "../renderer";
import * as DateUtilities from "../utilities/date-time";
import fetchMock from "jest-fetch-mock";
import PredefinedCalendar from "../configuration/predefined-calendar";
import NoteStub from "../notes/note-stub";
import Mock = jest.Mock;
import MigrationApp from "../applications/migration-app";
import { FoundryVTTGameData } from "../foundry-interfacing/game-data";
import { ordinalSuffix, PadNumber } from "../utilities/string";
import { GameSettings } from "../foundry-interfacing/game-settings";
import * as VisualUtilities from "../utilities/visual";

fetchMock.enableMocks();
describe("API Class Tests", () => {
    let tCal: Calendar;

    beforeEach(async () => {
        updateCalManager(new CalendarManager());
        updateSC(new SCController());
        updateMainApplication(new MainApp());
        updateNManager(new NoteManager());
        fetchMock.resetMocks();
        fetchMock.mockOnce(
            `{"calendar":{"currentDate":{"year":2022,"month":2,"day":28,"seconds":0},"general":{"gameWorldTimeIntegration":"mixed","showClock":true,"noteDefaultVisibility":false,"postNoteRemindersOnFoundryLoad":true,"pf2eSync":true,"dateFormat":{"date":"MMMM DD, YYYY","time":"HH:mm:ss","monthYear":"MMMM YAYYYYYZ"}},"leapYear":{"rule":"gregorian","customMod":0},"months":[{"name":"January","abbreviation":"Jan","numericRepresentation":1,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"February","abbreviation":"Feb","numericRepresentation":2,"numericRepresentationOffset":0,"numberOfDays":28,"numberOfLeapYearDays":29,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"March","abbreviation":"Mar","numericRepresentation":3,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"April","abbreviation":"Apr","numericRepresentation":4,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"May","abbreviation":"May","numericRepresentation":5,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"June","abbreviation":"Jun","numericRepresentation":6,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"July","abbreviation":"Jul","numericRepresentation":7,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"August","abbreviation":"Aug","numericRepresentation":8,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"September","abbreviation":"Sep","numericRepresentation":9,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"October","abbreviation":"Oct","numericRepresentation":10,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"November","abbreviation":"Nov","numericRepresentation":11,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"December","abbreviation":"Dec","numericRepresentation":12,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null}],"moons":[{"name":"Moon","cycleLength":29.53059,"firstNewMoon":{"yearReset":"none","yearX":0,"year":2000,"month":1,"day":5},"phases":[{"name":"New Moon","length":1,"icon":"new","singleDay":true},{"name":"Waxing Crescent","length":6.38265,"icon":"waxing-crescent","singleDay":false},{"name":"First Quarter","length":1,"icon":"first-quarter","singleDay":true},{"name":"Waxing Gibbous","length":6.38265,"icon":"waxing-gibbous","singleDay":false},{"name":"Full Moon","length":1,"icon":"full","singleDay":true},{"name":"Waning Gibbous","length":6.38265,"icon":"waning-gibbous","singleDay":false},{"name":"Last Quarter","length":1,"icon":"last-quarter","singleDay":true},{"name":"Waning Crescent","length":6.38265,"icon":"waning-crescent","singleDay":false}],"color":"#ffffff","cycleDayAdjust":0.5}],"noteCategories":[{"name":"Holiday","textColor":"#FFFFFF","color":"#148e94"}],"seasons":[{"name":"Spring","startingMonth":2,"startingDay":19,"color":"#46b946","icon":"spring","sunriseTime":21600,"sunsetTime":64800},{"name":"Summer","startingMonth":5,"startingDay":19,"color":"#e0c40b","icon":"summer","sunriseTime":21600,"sunsetTime":64800},{"name":"Fall","startingMonth":8,"startingDay":21,"color":"#ff8e47","icon":"fall","sunriseTime":21600,"sunsetTime":64800},{"name":"Winter","startingMonth":11,"startingDay":20,"color":"#479dff","icon":"winter","sunriseTime":21600,"sunsetTime":64800}],"time":{"hoursInDay":24,"minutesInHour":60,"secondsInMinute":60,"gameTimeRatio":1,"unifyGameAndClockPause":false,"updateFrequency":1},"weekdays":[{"abbreviation":"Su","name":"Sunday","numericRepresentation":1},{"abbreviation":"Mo","name":"Monday","numericRepresentation":2},{"abbreviation":"Tu","name":"Tuesday","numericRepresentation":3},{"abbreviation":"We","name":"Wednesday","numericRepresentation":4},{"abbreviation":"Th","name":"Thursday","numericRepresentation":5},{"abbreviation":"Fr","name":"Friday","numericRepresentation":6},{"abbreviation":"Sa","name":"Saturday","numericRepresentation":7}],"year":{"numericRepresentation":2022,"prefix":"","postfix":"","showWeekdayHeadings":true,"firstWeekday":4,"yearZero":1970,"yearNames":[],"yearNamingRule":"default","yearNamesStart":0}}}`
        );
        tCal = new Calendar("", "");
        await PredefinedCalendar.setToPredefined(tCal, PredefinedCalendars.Gregorian);

        jest.spyOn(CalManager, "getActiveCalendar").mockImplementation(() => {
            return tCal;
        });
        jest.spyOn(CalManager, "getCalendar").mockImplementation(() => {
            return tCal;
        });
        jest.spyOn(console, "error").mockImplementation(() => {});

        //@ts-ignore
        game.user.isGM = false;

        (<Mock>CalManager.getActiveCalendar).mockReturnValueOnce(null);
    });

    test("Constant Exports", () => {
        expect(API.DateSelectorPositions).toStrictEqual(DateSelectorPositions);
        expect(API.Calendars).toStrictEqual(PredefinedCalendars);
        expect(API.LeapYearRules).toStrictEqual(LeapYearRules);
        expect(API.Icons).toStrictEqual(Icons);
        expect(API.MoonYearResetOptions).toStrictEqual(MoonYearResetOptions);
        expect(API.YearNamingRules).toStrictEqual(YearNamingRules);
        expect(API.PresetTimeOfDay).toStrictEqual(PresetTimeOfDay);
        expect(API.NoteRepeat).toStrictEqual(NoteRepeat);
    });

    test("Activate Full Calendar Listeners", () => {
        jest.spyOn(Renderer.CalendarFull, "ActivateListeners").mockImplementation(() => {});
        API.activateFullCalendarListeners("");
        expect(Renderer.CalendarFull.ActivateListeners).toHaveBeenCalledTimes(1);
    });

    test("Add Note", async () => {
        jest.spyOn(NManager, "createNote").mockImplementation(async () => {
            return null;
        });
        expect(
            await API.addNote(
                "",
                "",
                { year: 0, month: 0, day: 0, hour: 0, minute: 0, seconds: 0 },
                { year: 0, month: 0, day: 0, hour: 0, minute: 0, seconds: 0 },
                true,
                0,
                []
            )
        ).toBe(null);
        expect(NManager.createNote).not.toHaveBeenCalled();

        expect(
            await API.addNote(
                "",
                "",
                { year: 0, month: 0, day: 0, hour: 0, minute: 0, seconds: 0 },
                { year: 0, month: 0, day: 0, hour: 0, minute: 0, seconds: 0 },
                true,
                0,
                [],
                "",
                "asd"
            )
        ).toBe(null);
        expect(NManager.createNote).toHaveBeenCalledTimes(1);

        expect(
            await API.addNote(
                "",
                "",
                { year: 0, month: 0, day: 0, hour: 0, minute: 0, seconds: 0 },
                { year: 0, month: 0, day: 0, hour: 0, minute: 0, seconds: 0 },
                true,
                0,
                [],
                ""
            )
        ).toBe(null);
        expect(NManager.createNote).toHaveBeenCalledTimes(2);

        expect(await API.addNote("", "", {}, {}, false)).toBe(null);
        expect(NManager.createNote).toHaveBeenCalledTimes(3);

        const je = { update: jest.fn() };
        //@ts-ignore
        jest.spyOn(NManager, "createNote").mockImplementation(() => {
            return je;
        });

        //@ts-ignore
        expect(await API.addNote("", "", {}, {}, false, 0, [], "", "", ["asd"], 2)).toBe(je);
        expect(NManager.createNote).toHaveBeenCalledTimes(4);

        //@ts-ignore
        expect(await API.addNote("", "", {}, {}, false, 0, [], "", "", [""])).toBe(je);
        expect(NManager.createNote).toHaveBeenCalledTimes(5);

        //@ts-ignore
        const ou = game.users;
        //@ts-ignore
        game.users = [{ id: "" }, { id: "asd" }];
        //@ts-ignore
        expect(await API.addNote("", "", {}, {}, false, 0, [], "", "", ["default"])).toBe(je);
        expect(NManager.createNote).toHaveBeenCalledTimes(6);
        //@ts-ignore
        game.users = ou;
    });

    test("Add Sidebar Button", () => {
        jest.spyOn(MainApplication, "updateApp").mockImplementation(() => {});
        API.addSidebarButton("title", "icon", "class", true, () => {});
        expect(MainApplication.updateApp).toHaveBeenCalledTimes(1);
        expect(MainApplication.addonButtons.length).toBe(1);
    });

    test("Advance Time to Preset", () => {
        expect(API.advanceTimeToPreset(PresetTimeOfDay.Midday)).toBe(false);
        expect(console.error).toHaveBeenCalledTimes(1);

        expect(API.advanceTimeToPreset(PresetTimeOfDay.Midday)).toBe(false);
        expect(console.error).toHaveBeenCalledTimes(1);

        jest.spyOn(DateUtilities, "AdvanceTimeToPreset").mockImplementation(async () => {});
        //@ts-ignore
        game.user.isGM = true;
        expect(API.advanceTimeToPreset(PresetTimeOfDay.Midday, "")).toBe(true);
        expect(DateUtilities.AdvanceTimeToPreset).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledTimes(1);
    });

    test("Change Date", () => {
        expect(API.changeDate({})).toBe(false);
        expect(console.error).toHaveBeenCalledTimes(1);

        jest.spyOn(tCal, "changeDateTime").mockImplementation(() => {
            return true;
        });
        expect(API.changeDate({}, "")).toBe(true);
        expect(tCal.changeDateTime).toHaveBeenCalledTimes(1);
    });

    test("Choose Random Date", () => {
        expect(API.chooseRandomDate()).toBeDefined();
        expect(console.error).toHaveBeenCalledTimes(1);

        expect(API.chooseRandomDate({}, {}, "")).toBeDefined();
        expect(
            API.chooseRandomDate(
                { year: 2000, month: 1, day: 0, hour: 0, minute: 0, seconds: 0 },
                { year: 2021, month: 2, day: 1, hour: 12, minute: 20, seconds: 30 }
            )
        ).toBeDefined();
        expect(
            API.chooseRandomDate(
                { year: 2000, month: 1, day: 3, hour: 0, minute: 0, seconds: 0 },
                { year: 2000, month: 1, day: 3, hour: 0, minute: 0, seconds: 0 }
            )
        ).toStrictEqual({ year: 2000, month: 1, day: 3, hour: 0, minute: 0, seconds: 0 });
        expect(
            API.chooseRandomDate(
                { year: 2000, month: -1, day: -3, hour: 0, minute: 0, seconds: 0 },
                { year: 2000, month: -1, day: -3, hour: 0, minute: 0, seconds: 0 }
            )
        ).toStrictEqual({ year: 2000, month: 11, day: 30, hour: 0, minute: 0, seconds: 0 });
    });

    test("Clock Status", () => {
        expect(API.clockStatus()).toStrictEqual({ started: false, stopped: false, paused: false });
        expect(console.error).toHaveBeenCalledTimes(1);
        +expect(API.clockStatus("")).toStrictEqual({ started: false, stopped: true, paused: false });
    });

    test("Configure Calendar", async () => {
        expect(await API.configureCalendar(PredefinedCalendars.DarkSun)).toBe(false);
        //@ts-ignore
        game.user.isGM = true;
        expect(await API.configureCalendar(PredefinedCalendars.DarkSun)).toBe(false);
        expect(console.error).toHaveBeenCalledTimes(1);

        jest.spyOn(PredefinedCalendar, "setToPredefined").mockImplementation(async () => {
            return true;
        });
        jest.spyOn(tCal, "loadFromSettings").mockImplementation(() => {});
        jest.spyOn(CalManager, "saveCalendars").mockImplementation(async () => {});
        expect(await API.configureCalendar(PredefinedCalendars.DarkSun)).toBe(true);
        expect(PredefinedCalendar.setToPredefined).toHaveBeenCalledTimes(1);
        expect(tCal.loadFromSettings).not.toHaveBeenCalled();
        expect(CalManager.saveCalendars).toHaveBeenCalledTimes(1);

        expect(await API.configureCalendar({ id: "asd" }, "")).toBe(true);
        expect(PredefinedCalendar.setToPredefined).toHaveBeenCalledTimes(1);
        expect(tCal.loadFromSettings).toHaveBeenCalledTimes(1);
        expect(CalManager.saveCalendars).toHaveBeenCalledTimes(2);
    });

    test("Current Date Time", () => {
        const d = new Date();
        expect(API.currentDateTime()).toBeNull();
        expect(API.currentDateTime("")).toEqual({ year: d.getFullYear(), month: d.getMonth(), day: d.getDate() - 1, hour: 0, minute: 0, seconds: 0 });

        jest.spyOn(tCal, "getMonthAndDayIndex").mockReturnValue({});
        expect(API.currentDateTime("")).toEqual({ year: d.getFullYear(), month: 0, day: 0, hour: 0, minute: 0, seconds: 0 });
    });

    test("Current Date Time Display", () => {
        const d = new Date();
        expect(API.currentDateTimeDisplay()).toBeNull();
        expect(API.currentDateTimeDisplay("")).toEqual({
            date: `${tCal.months[d.getMonth()].name} ${PadNumber(d.getDate())}, ${d.getFullYear()}`,
            day: d.getDate().toString(),
            daySuffix: ordinalSuffix(d.getDay()),
            weekday: tCal.weekdays[d.getDay()].name,
            monthName: tCal.months[d.getMonth()].name,
            month: (d.getMonth() + 1).toString(),
            year: d.getFullYear().toString(),
            yearName: "",
            yearPrefix: "",
            yearPostfix: "",
            time: "00:00:00"
        });

        tCal.weekdays = [];
        jest.spyOn(tCal, "getMonthAndDayIndex").mockReturnValue({});
        expect(API.currentDateTimeDisplay("")).toEqual({
            date: `January 01, ${d.getFullYear()}`,
            day: "1",
            daySuffix: "",
            weekday: "",
            monthName: "January",
            month: "1",
            year: d.getFullYear().toString(),
            yearName: "",
            yearPrefix: "",
            yearPostfix: "",
            time: "00:00:00"
        });
    });

    test("Date to Timestamp", () => {
        expect(API.dateToTimestamp({})).toBe(0);
        expect(console.error).toHaveBeenCalledTimes(1);

        jest.spyOn(DateUtilities, "DateToTimestamp").mockImplementation(() => {
            return 1;
        });
        expect(API.dateToTimestamp({})).toBe(1);
        expect(API.dateToTimestamp({}, "")).toBe(1);
        expect(DateUtilities.DateToTimestamp).toHaveBeenCalledTimes(2);
    });

    test("Format Date Time", () => {
        expect(API.formatDateTime({})).toStrictEqual("");
        expect(console.error).toHaveBeenCalledTimes(1);

        expect(API.formatDateTime({})).toStrictEqual({ date: "January 01, 0", time: "00:00:00" });
        expect(API.formatDateTime({ year: 2021, month: 11, day: 24, hour: 10, minute: 20, seconds: 30 })).toStrictEqual({
            date: "December 25, 2021",
            time: "10:20:30"
        });
        expect(API.formatDateTime({ year: 2021, month: 111, day: 124, hour: 110, minute: 120, seconds: 130 })).toStrictEqual({
            date: "December 31, 2021",
            time: "23:59:59"
        });

        expect(API.formatDateTime({ year: 2021, month: 111, day: 124, hour: 110, minute: 120, seconds: 130 }, "DD/MM/YY HH:mm:ss", "")).toStrictEqual(
            "31/12/21 23:59:59"
        );
    });

    test("Format Timestamp", () => {
        expect(API.formatTimestamp(0)).toStrictEqual("");
        expect(console.error).toHaveBeenCalledTimes(1);

        expect(API.formatTimestamp(0)).toStrictEqual({ date: "January 01, 1970", time: "00:00:00" });
        expect(API.formatTimestamp(0, "DD/MM/YY HH:mm:ss", "")).toStrictEqual("01/01/70 00:00:00");

        (<Game>game).system.id = "pf2e";
        tCal.generalSettings.pf2eSync = true;
        expect(API.formatTimestamp(0)).toStrictEqual({ date: "January 01, 1970", time: "00:00:00" });
        (<Game>game).system.id = "";
        tCal.generalSettings.pf2eSync = false;
    });

    test("Get All Calendars", () => {
        expect(API.getAllCalendars().length).toBe(0);
        jest.spyOn(CalManager, "getAllCalendars").mockImplementation(() => {
            return [tCal];
        });
        expect(API.getAllCalendars().length).toBe(1);
    });

    test("Get All Months", () => {
        expect(API.getAllMonths().length).toBe(0);
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(API.getAllMonths("").length).toBeGreaterThan(0);
    });

    test("Get All Moons", () => {
        expect(API.getAllMoons().length).toBe(0);
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(API.getAllMoons("").length).toBeGreaterThan(0);
    });

    test("Get All Seasons", () => {
        expect(API.getAllSeasons().length).toBe(0);
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(API.getAllSeasons("").length).toBeGreaterThan(0);
    });

    test("Get All Themes", () => {
        expect(Object.keys(API.getAllThemes()).length).toBe(3);
    });

    test("Get All Weekdays", () => {
        expect(API.getAllWeekdays().length).toBe(0);
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(API.getAllWeekdays("").length).toBeGreaterThan(0);
    });

    test("Get Current Calendar", () => {
        expect(API.getCurrentCalendar).toThrowError(/toConfig/);
        expect(API.getCurrentCalendar()).toStrictEqual(tCal.toConfig());
    });

    test("Get Current Day", () => {
        expect(API.getCurrentDay()).toBeNull();
        expect(console.error).toHaveBeenCalledTimes(1);

        tCal.resetMonths();
        expect(API.getCurrentDay()).toBeNull();

        tCal.months[0].current = true;
        expect(API.getCurrentDay()).toBeNull();

        tCal.months[0].days[0].current = true;
        expect(API.getCurrentDay("")).not.toBeNull();
    });

    test("Get Current Month", () => {
        expect(API.getCurrentMonth()).toBeNull();

        tCal.resetMonths();
        expect(API.getCurrentMonth()).toBeNull();

        tCal.months[0].current = true;
        expect(API.getCurrentMonth("")).not.toBeNull();
    });

    test("Get Current Season", () => {
        expect(API.getCurrentSeason()).toStrictEqual({
            id: "",
            name: "",
            icon: Icons.None,
            color: "",
            description: "",
            startingMonth: 0,
            startingDay: 0,
            sunriseTime: 0,
            sunsetTime: 0
        });
        expect(console.error).toHaveBeenCalledTimes(1);

        tCal.resetMonths();
        tCal.months[0].current = true;
        tCal.months[0].days[0].current = true;
        expect(API.getCurrentSeason("")).not.toBeNull();
    });

    test("Get Current Theme", () => {
        expect(API.getCurrentTheme()).toBeUndefined();
    });

    test("Get Current Weekday", () => {
        expect(API.getCurrentWeekday()).toBeNull();

        tCal.resetMonths();
        expect(API.getCurrentWeekday()).not.toBeNull();

        tCal.months[0].current = true;
        expect(API.getCurrentWeekday("")).not.toBeNull();

        tCal.months[0].days[0].current = true;
        expect(API.getCurrentWeekday("")).not.toBeNull();
    });

    test("Get Current Year", () => {
        expect(API.getCurrentYear()).toBe(null);
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(API.getCurrentYear("")).toBeDefined();
    });

    test("Get Leap Year Configuration", () => {
        expect(API.getLeapYearConfiguration()).toBe(null);
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(API.getLeapYearConfiguration("")).toBeDefined();
    });

    test("Get Notes", () => {
        expect(API.getNotes).toThrowError();

        jest.spyOn(NManager, "getNotes").mockImplementation(() => {
            return [new NoteStub("asd")];
        });
        expect(API.getNotes("").length).toEqual(1);
    });

    test("Get Notes For Day", () => {
        expect(API.getNotesForDay).toThrowError();
        jest.spyOn(NManager, "getNotesForDay").mockImplementation(() => {
            return [new NoteStub("asd")];
        });
        expect(API.getNotesForDay(2020, 0, 0, "").length).toEqual(1);
    });

    test("Get Time Configuration", () => {
        expect(API.getTimeConfiguration()).toBe(null);
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(API.getTimeConfiguration("")).toBeDefined();
    });

    test("Is Open", () => {
        expect(API.isOpen()).toBe(true);
    });

    test("Is Primary GM", () => {
        expect(API.isPrimaryGM()).toBe(false);
    });

    test("Pause Clock", () => {
        expect(API.pauseClock()).toBe(false);
        SC.primary = true;
        expect(API.pauseClock()).toBe(false);
        expect(console.error).toHaveBeenCalledTimes(1);
        //@ts-ignore
        tCal.timeKeeper.status = TimeKeeperStatus.Started;
        expect(API.pauseClock("")).toBe(true);
        expect(API.pauseClock("")).toBe(true);
    });

    test("Remove Note", async () => {
        const ns = new NoteStub("asd");
        jest.spyOn(NManager, "getNoteStub").mockReturnValue(ns);
        jest.spyOn(ns, "isVisible").mockReturnValue(true);
        expect(await API.removeNote("asd")).toBe(true);

        //@ts-ignore
        const t = game.journal;
        //@ts-ignore
        game.journal = {
            get: () => {
                return false;
            }
        };
        expect(await API.removeNote("asd")).toBe(false);
        //@ts-ignore
        game.journal = t;
    });

    test("Run Migration", async () => {
        jest.spyOn(console, "info").mockImplementation(() => {});
        jest.spyOn(console, "warn").mockImplementation(() => {});
        updateMigrationApplication(new MigrationApp());
        jest.spyOn(MigrationApplication, "run").mockImplementation(async () => {});
        expect(API.runMigration()).toBeUndefined();

        //@ts-ignore
        game.user.isGM = true;
        SC.primary = true;
        expect(API.runMigration()).toBeUndefined();
    });

    test("Search Notes", () => {
        jest.spyOn(NManager, "searchNotes").mockImplementation(() => {
            return [new NoteStub("asd")];
        });
        API.searchNotes("asd");
        expect(console.error).toHaveBeenCalledTimes(1);

        API.searchNotes("asd", { date: true, title: true, details: true, categories: true, author: true }, "asd");
        expect(NManager.searchNotes).toHaveBeenCalledTimes(1);
    });

    test("Seconds To Interval", () => {
        expect(API.secondsToInterval(10)).toEqual({});
        expect(console.error).toHaveBeenCalledTimes(1);

        jest.spyOn(tCal, "secondsToInterval").mockImplementation(() => {
            return {};
        });
        expect(API.secondsToInterval(0, "")).toEqual({});
        expect(tCal.secondsToInterval).toHaveBeenCalledTimes(1);
    });

    test("Set Date", () => {
        expect(API.setDate({})).toEqual(false);
        expect(console.error).toHaveBeenCalledTimes(1);

        jest.spyOn(tCal, "setDateTime").mockImplementation(() => {
            return true;
        });
        expect(API.setDate({}, "")).toEqual(true);
        expect(tCal.setDateTime).toHaveBeenCalledTimes(1);
    });

    test("Set Theme", async () => {
        jest.spyOn(GameSettings, "UiNotification").mockImplementation(() => {});
        jest.spyOn(VisualUtilities, "GetThemeName").mockReturnValueOnce("dark").mockReturnValueOnce("light");
        expect(await API.setTheme("light")).toBe(true);
        expect(GameSettings.UiNotification).toHaveBeenCalledTimes(1);
        expect(await API.setTheme("light")).toBe(true);
        expect(GameSettings.UiNotification).toHaveBeenCalledTimes(1);
        expect(await API.setTheme("asd")).toBe(false);
        expect(console.error).toHaveBeenCalledTimes(1);
    });

    test("Show Calendar", () => {
        jest.spyOn(MainApplication, "render").mockImplementation(() => {});
        jest.spyOn(MainApplication, "updateApp").mockImplementation(() => {});
        //@ts-ignore
        jest.spyOn(MainApplication, "rendered", "get").mockReturnValueOnce(false).mockReturnValue(true);
        API.showCalendar();
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(MainApplication.render).toHaveBeenCalledTimes(1);

        tCal.resetMonths();
        //@ts-ignore
        API.showCalendar({ year: "asd" }, false, "");
        expect(console.error).toHaveBeenCalledTimes(2);
        expect(MainApplication.render).toHaveBeenCalledTimes(1);
        expect(MainApplication.updateApp).toHaveBeenCalledTimes(2);

        tCal.months[0].current = true;
        tCal.months[0].days[0].current = true;
        API.showCalendar({ month: 1 });
        expect(MainApplication.render).toHaveBeenCalledTimes(1);
        expect(MainApplication.updateApp).toHaveBeenCalledTimes(4);

        API.showCalendar({ year: 2021, month: -1, day: -1 });
        expect(MainApplication.render).toHaveBeenCalledTimes(1);
        expect(MainApplication.updateApp).toHaveBeenCalledTimes(6);

        API.showCalendar({ year: 2020, month: -1, day: -1 });
        expect(MainApplication.render).toHaveBeenCalledTimes(1);
        expect(MainApplication.updateApp).toHaveBeenCalledTimes(8);
    });

    test("Start Clock", () => {
        expect(API.startClock()).toBe(false);
        SC.primary = true;
        expect(API.startClock()).toBe(false);
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(API.startClock("")).toBe(true);
    });

    test("Stop Clock", () => {
        expect(API.stopClock()).toBe(false);
        SC.primary = true;
        expect(API.stopClock()).toBe(false);
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(API.stopClock("")).toBe(true);
    });

    test("Timestamp", () => {
        expect(API.timestamp()).toEqual(NaN);
        expect(console.error).toHaveBeenCalledTimes(1);

        jest.spyOn(tCal, "toSeconds").mockImplementation(() => {
            return 0;
        });
        expect(API.timestamp("")).toEqual(0);
        expect(tCal.toSeconds).toHaveBeenCalledTimes(1);
    });

    test("Timestamp Plus Interval", () => {
        expect(API.timestampPlusInterval(0, {})).toBe(NaN);
        expect(console.error).toHaveBeenCalledTimes(1);
        expect(API.timestampPlusInterval(0, {}, "")).toBe(0);
        expect(API.timestampPlusInterval(0, { seconds: 1 })).toBe(1);
        expect(API.timestampPlusInterval(0, { minute: 1 })).toBe(60);
        expect(API.timestampPlusInterval(0, { hour: 1 })).toBe(3600);
        expect(API.timestampPlusInterval(0, { hour: 1, minute: 1, seconds: 6 })).toBe(3666);
        expect(API.timestampPlusInterval(0, { day: 1 })).toBe(86400);
        expect(API.timestampPlusInterval(0, { month: 1 })).toBe(2678400);
        expect(API.timestampPlusInterval(0, { month: 13 })).toBe(34214400);
        expect(API.timestampPlusInterval(0, { year: 1 })).toBe(31536000);
        expect(API.timestampPlusInterval(0, { day: 0 })).toBe(0);
        expect(API.timestampPlusInterval(0, {})).toBe(0);
        expect(API.timestampPlusInterval(1623077754, { day: 0 })).toBe(1623077754);
        expect(API.timestampPlusInterval(1623077754, { day: 1 })).toBe(1623164154);
        expect(API.timestampPlusInterval(0, { seconds: 86401 })).toBe(86401);
        expect(API.timestampPlusInterval(0, { month: 3 })).toBe(7776000);
        expect(API.timestampPlusInterval(0, { hour: 2184 })).toBe(7862400);
        expect(API.timestampPlusInterval(0, { minute: 131040 })).toBe(7862400);
        expect(API.timestampPlusInterval(0, { seconds: 7862400 })).toBe(7862400);
        expect(API.timestampPlusInterval(86399, { seconds: 1 })).toBe(86400);

        jest.spyOn(FoundryVTTGameData, "systemID", "get").mockReturnValue("pf2e");
        //@ts-ignore
        game.pf2e = { worldClock: { dateTheme: "AR", worldCreatedOn: 0 } };
        expect(API.timestampPlusInterval(0, { day: 0 })).toBe(-23036572800);
        expect(API.timestampPlusInterval(0, {})).toBe(-23036572800);
        expect(API.timestampPlusInterval(0, { day: 1 })).toBe(-23036486400);
    });

    test("Timestamp to Date", () => {
        expect(API.timestampToDate(0)).toEqual(null);
        expect(console.error).toHaveBeenCalledTimes(1);

        //@ts-ignore
        jest.spyOn(DateUtilities, "TimestampToDateData").mockImplementation(() => {
            return {};
        });
        expect(API.timestampToDate(0, "")).toEqual({});
        expect(DateUtilities.TimestampToDateData).toHaveBeenCalledTimes(1);
    });
});
