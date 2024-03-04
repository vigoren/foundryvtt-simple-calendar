/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import { jest, beforeEach, describe, expect, test } from "@jest/globals";

import Calendar from "./index";
import { LeapYearRules, PredefinedCalendars, TimeKeeperStatus } from "../../constants";
import { CalManager, MainApplication, SC, updateCalManager, updateMainApplication, updateNManager, updateSC } from "../index";
import CalendarManager from "./calendar-manager";
import NoteManager from "../notes/note-manager";
import fetchMock from "jest-fetch-mock";
import PredefinedCalendar from "../configuration/predefined-calendar";
import LeapYear from "./leap-year";
import MainApp from "../applications/main-app";
import Month from "./month";
import { GameSettings } from "../foundry-interfacing/game-settings";
import SCController from "../s-c-controller";
import PF2E from "../systems/pf2e";
import { FoundryVTTGameData } from "../foundry-interfacing/game-data";
import PF1E from "../systems/pf1e";

fetchMock.enableMocks();
describe("Calendar Class Tests", () => {
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
        jest.spyOn(CalManager, "getActiveCalendar").mockImplementation(() => {
            return tCal;
        });
        jest.spyOn(CalManager, "isActiveCalendar").mockImplementation(() => {
            return true;
        });
        await PredefinedCalendar.setToPredefined(tCal, PredefinedCalendars.Gregorian);

        //@ts-ignore
        game.user.isGM = false;
    });

    test("Constructor", () => {
        let c = new Calendar("a", "cal");
        expect(c.id).toBe("a");

        c = new Calendar("", "cal");
        expect(c.id.length).toBeGreaterThan(0);

        jest.spyOn(Calendar.prototype, "loadFromSettings").mockImplementation(() => {});
        c = new Calendar("a", "cal", { id: "b", name: "asd" });
        expect(c.loadFromSettings).toHaveBeenCalledTimes(1);

        const orig = (<Game>game).system;
        //@ts-ignore
        (<Game>game).system = null;
        c = new Calendar("a", "cal");
        (<Game>game).system = orig;
    });

    test("Clone", () => {
        const calClone = tCal.clone();
        expect(calClone).toEqual(tCal);
    });

    test("To Template", () => {
        const d = new Date();
        let t = tCal.toTemplate();
        expect(t.name).toBe("");

        tCal.resetMonths();
        t = tCal.toTemplate();
        expect(t.selectedDay.dateDisplay).toBe(`January 01, ${d.getFullYear()}`);
        expect(t.visibleDate).toEqual({ year: d.getFullYear(), month: d.getMonth() });

        tCal.months[2].selected = true;
        t = tCal.toTemplate();
        expect(t.selectedDay.dateDisplay).toBe(`March 01, ${d.getFullYear()}`);
        expect(t.visibleDate).toEqual({ year: d.getFullYear(), month: d.getMonth() });

        tCal.months[2].days[2].selected = true;
        t = tCal.toTemplate();
        expect(t.selectedDay.dateDisplay).toBe(`March 03, ${d.getFullYear()}`);
        expect(t.visibleDate).toEqual({ year: d.getFullYear(), month: d.getMonth() });

        tCal.resetMonths("visible");
        t = tCal.toTemplate();
        expect(t.selectedDay.dateDisplay).toBe(`March 03, ${d.getFullYear()}`);
        expect(t.visibleDate).toEqual({ year: d.getFullYear(), month: 0 });
    });

    test("To Config", () => {
        const c = tCal.toConfig();
        expect(Object.keys(c).length).toBe(12);
    });

    test("Load From Settings", () => {
        jest.spyOn(console, "error").mockImplementation(() => {});
        jest.spyOn(console, "warn").mockImplementation(() => {});

        //@ts-ignore
        tCal.loadFromSettings({});
        expect(console.error).not.toHaveBeenCalled();
        expect(console.warn).toHaveBeenCalledTimes(2);

        jest.spyOn(tCal.year, "loadFromSettings").mockImplementation(() => {});
        jest.spyOn(tCal.year.leapYearRule, "loadFromSettings").mockImplementation(() => {});
        jest.spyOn(tCal.time, "loadFromSettings").mockImplementation(() => {});
        jest.spyOn(tCal.generalSettings, "loadFromSettings").mockImplementation(() => {});

        //@ts-ignore
        tCal.loadFromSettings({
            id: "a",
            name: "tCal",
            //@ts-ignore
            year: { id: "" },
            months: [],
            weekdays: [],
            //@ts-ignore
            leapYear: {},
            //@ts-ignore
            time: {},
            seasons: [],
            moons: [],
            //@ts-ignore
            general: {},
            noteCategories: []
        });
        expect(tCal.id).toBe("a");
        expect(tCal.name).toBe("tCal");
        expect(tCal.months.length).toBe(1);
        expect(tCal.weekdays.length).toBe(0);
        expect(tCal.seasons.length).toBe(0);
        expect(tCal.moons.length).toBe(0);
        expect(tCal.noteCategories.length).toBe(0);
        expect(tCal.year.loadFromSettings).toHaveBeenCalledTimes(1);
        expect(tCal.year.leapYearRule.loadFromSettings).toHaveBeenCalledTimes(1);
        expect(tCal.time.loadFromSettings).toHaveBeenCalledTimes(1);
        expect(tCal.generalSettings.loadFromSettings).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledTimes(0);

        //@ts-ignore
        tCal.loadFromSettings({
            //@ts-ignore
            yearSettings: {},
            //@ts-ignore
            monthSettings: [
                //@ts-ignore
                {
                    name: "January",
                    abbreviation: "Jan",
                    numericRepresentation: 1,
                    numericRepresentationOffset: 0,
                    numberOfDays: 31,
                    numberOfLeapYearDays: 31,
                    intercalary: false,
                    intercalaryInclude: false,
                    startingWeekday: null
                }
            ],
            //@ts-ignore
            weekdaySettings: {},
            //@ts-ignore
            leapYearSettings: {},
            //@ts-ignore
            timeSettings: {},
            seasonSettings: [],
            moonSettings: [],
            //@ts-ignore
            generalSettings: {},
            //@ts-ignore
            currentDate: { year: 2022, month: 0, day: 1 }
        });
        expect(tCal.months.length).toBe(1);
        expect(tCal.weekdays.length).toBe(0);
        expect(tCal.seasons.length).toBe(0);
        expect(tCal.moons.length).toBe(0);
        expect(tCal.year.loadFromSettings).toHaveBeenCalledTimes(2);
        expect(tCal.year.leapYearRule.loadFromSettings).toHaveBeenCalledTimes(2);
        expect(tCal.time.loadFromSettings).toHaveBeenCalledTimes(2);
        expect(tCal.generalSettings.loadFromSettings).toHaveBeenCalledTimes(2);
        expect(tCal.getMonthAndDayIndex()).toEqual({ month: 0, day: 1 });
        expect(tCal.time.seconds).toBe(0);

        //@ts-ignore
        tCal.loadFromSettings({ currentDate: { year: 2022, month: 1, day: 1 } });
        expect(tCal.getMonthAndDayIndex()).toEqual({ month: 0, day: 0 });

        //@ts-ignore
        tCal.loadFromSettings({ currentDate: { year: 2022, month: 0, day: 41 } });
        expect(tCal.getMonthAndDayIndex()).toEqual({ month: 0, day: 0 });
        expect(console.warn).toHaveBeenCalledTimes(7);
    });

    test("Get Current Date", () => {
        const d = new Date();
        expect(tCal.getCurrentDate()).toEqual({
            year: d.getFullYear(),
            month: d.getMonth(),
            day: d.getDate() - 1,
            seconds: 0
        });

        tCal.resetMonths();
        expect(tCal.getCurrentDate()).toEqual({
            year: d.getFullYear(),
            month: 0,
            day: 0,
            seconds: 0
        });
    });

    test("Get Date Time", () => {
        const d = new Date();
        expect(tCal.getDateTime()).toEqual({
            year: d.getFullYear(),
            month: d.getMonth(),
            day: d.getDate() - 1,
            hour: 0,
            minute: 0,
            seconds: 0
        });

        tCal.resetMonths();
        expect(tCal.getDateTime()).toEqual({
            year: d.getFullYear(),
            month: 0,
            day: 0,
            hour: 0,
            minute: 0,
            seconds: 0
        });

        tCal.months[2].selected = true;
        expect(tCal.getDateTime()).toEqual({
            year: d.getFullYear(),
            month: 2,
            day: 0,
            hour: 0,
            minute: 0,
            seconds: 0
        });

        tCal.months[2].days[4].selected = true;
        expect(tCal.getDateTime()).toEqual({
            year: d.getFullYear(),
            month: 2,
            day: 4,
            hour: 0,
            minute: 0,
            seconds: 0
        });
    });

    test("Get Current Season", () => {
        tCal.resetMonths("visible");
        tCal.months[4].visible = true;

        expect(tCal.getCurrentSeason()).toEqual({
            name: "Spring",
            color: "#46b946",
            icon: "spring"
        });

        tCal.resetMonths("visible");

        expect(tCal.getCurrentSeason()).toEqual({
            name: "Winter",
            color: "#479dff",
            icon: "winter"
        });
    });

    test("Get Month", () => {
        const d = new Date();
        let m = tCal.getMonth();
        expect(m?.numericRepresentation).toBe(d.getMonth() + 1);

        tCal.resetMonths("visible");
        tCal.months[5].visible = true;
        expect(tCal.getMonth("visible")).toStrictEqual(tCal.months[5]);

        tCal.months[7].selected = true;
        expect(tCal.getMonth("selected")).toStrictEqual(tCal.months[7]);

        tCal.resetMonths("visible");
        expect(tCal.getMonth("visible")).toBeUndefined();
    });

    test("Get Month Index", () => {
        const d = new Date();
        let m = tCal.getMonthIndex();
        expect(m).toBe(d.getMonth());

        tCal.resetMonths("visible");
        tCal.months[5].visible = true;
        expect(tCal.getMonthIndex("visible")).toStrictEqual(5);

        tCal.months[7].selected = true;
        expect(tCal.getMonthIndex("selected")).toStrictEqual(7);

        tCal.resetMonths("visible");
        expect(tCal.getMonthIndex("visible")).toBe(-1);
    });

    test("Get Month And Day Index", () => {
        const d = new Date();
        expect(tCal.getMonthAndDayIndex()).toEqual({ month: d.getMonth(), day: d.getDate() - 1 });

        tCal.resetMonths();
        expect(tCal.getMonthAndDayIndex()).toEqual({ month: undefined, day: 0 });
    });

    test("Get Season", () => {
        let data = tCal.getSeason(0, 1);
        expect(data.name).toBe("Winter");
        data = tCal.getSeason(6, 9);
        expect(data.name).toBe("Summer");

        data = tCal.getSeason(2, 21);
        expect(data.name).toBe("Spring");

        tCal.seasons[1].startingMonth = 2;
        tCal.seasons[1].startingDay = 25;

        data = tCal.getSeason(2, 21);
        expect(data.name).toBe("Spring");

        data = tCal.getSeason(2, 26);
        expect(data.name).toBe("Summer");
    });

    test("Get Sunrise Sunset Time", () => {
        let sunrise = tCal.getSunriseSunsetTime(tCal.year.numericRepresentation, 0, 0, true, false);
        expect(sunrise).toBe(21600);

        sunrise = tCal.getSunriseSunsetTime(tCal.year.numericRepresentation, 2, 19, false, false);
        expect(sunrise).toBe(64800);

        sunrise = tCal.getSunriseSunsetTime(tCal.year.numericRepresentation, 3, 19, true, true);
        expect(sunrise).toBeGreaterThan(0);

        sunrise = tCal.getSunriseSunsetTime(tCal.year.numericRepresentation, 11, 21, true, false);
        expect(sunrise).toBe(21600);

        tCal.seasons[1].startingMonth = 3;
        tCal.seasons[1].startingDay = 29;
        sunrise = tCal.getSunriseSunsetTime(tCal.year.numericRepresentation, 0, 0, true, false);
        expect(sunrise).toBe(21600);

        tCal.seasons[1].startingMonth = 2;
        tCal.seasons[1].startingDay = 25;

        sunrise = tCal.getSunriseSunsetTime(tCal.year.numericRepresentation, 2, 19, false, false);
        expect(sunrise).toBe(64800);

        tCal.seasons = [];
        sunrise = tCal.getSunriseSunsetTime(tCal.year.numericRepresentation, 2, 19);
        expect(sunrise).toBe(0);
    });

    test("Days Into Weeks", () => {
        let weeks = tCal.daysIntoWeeks(0, 2022, 0);
        expect(weeks).toStrictEqual([]);

        weeks = tCal.daysIntoWeeks(0, 2022, tCal.weekdays.length);
        expect(weeks.length).toStrictEqual(6);

        tCal.months[1].numberOfDays = 4;
        tCal.months[1].numberOfLeapYearDays = 4;
        tCal.months[1].days = [];
        tCal.months[1].populateDays(4);
        weeks = tCal.daysIntoWeeks(1, 2022, tCal.weekdays.length);
        expect(weeks.length).toStrictEqual(1);
    });

    test("Day of the Week", () => {
        expect(tCal.dayOfTheWeek(2022, 0, 0)).toBe(6);
        expect(tCal.dayOfTheWeek(2022, 0, 2)).toBe(1);
        expect(tCal.dayOfTheWeek(2022, 0, -1)).toBe(6);

        tCal.months[0].startingWeekday = 3;
        expect(tCal.dayOfTheWeek(2022, 0, 0)).toBe(2);

        jest.spyOn(FoundryVTTGameData, "systemID", "get").mockReturnValue("pf2e");
        //@ts-ignore
        game.pf2e = { worldClock: { dateTheme: "AR", worldCreatedOn: 0 } };
        expect(tCal.dayOfTheWeek(4697, 0, 0)).toBe(2);

        tCal.weekdays = [];
        expect(tCal.dayOfTheWeek(2022, 0, 0)).toBe(0);
    });

    test("Month Starting Day Of Week", () => {
        expect(tCal.monthStartingDayOfWeek(0, 2022)).toBe(6);
        expect(tCal.monthStartingDayOfWeek(-1, 2022)).toBe(0);

        tCal.months[0].intercalary = true;
        expect(tCal.monthStartingDayOfWeek(0, 2022)).toBe(0);
    });

    test("Reset Months", () => {
        tCal.months[0].current = true;
        tCal.months[0].selected = true;
        tCal.months[0].visible = true;

        tCal.resetMonths();
        expect(tCal.months[0].current).toBe(false);
        expect(tCal.months[0].selected).toBe(true);
        expect(tCal.months[0].visible).toBe(true);

        tCal.resetMonths("selected");
        expect(tCal.months[0].current).toBe(false);
        expect(tCal.months[0].selected).toBe(false);
        expect(tCal.months[0].visible).toBe(true);

        tCal.resetMonths("visible");
        expect(tCal.months[0].current).toBe(false);
        expect(tCal.months[0].selected).toBe(false);
        expect(tCal.months[0].visible).toBe(false);
    });

    test("Set Current To Visible", () => {
        tCal.resetMonths();
        tCal.resetMonths("visible");
        tCal.months[0].current = true;
        tCal.months[4].visible = true;

        expect(tCal.months[0].visible).toBe(false);
        expect(tCal.months[4].visible).toBe(true);
        tCal.setCurrentToVisible();
        expect(tCal.months[0].visible).toBe(true);
        expect(tCal.months[4].visible).toBe(false);
    });

    test("Update Month", () => {
        tCal.resetMonths();
        tCal.resetMonths("visible");
        tCal.resetMonths("selected");
        expect(tCal.months[0].current).toBe(false);
        expect(tCal.months[1].current).toBe(false);
        tCal.updateMonth(0, "current", true);
        expect(tCal.months[0].current).toBe(true);
        expect(tCal.months[1].current).toBe(false);
        tCal.months[1].days[0].current = true;
        tCal.updateMonth(-1, "current", true);
        expect(tCal.months[0].current).toBe(false);
        expect(tCal.months[11].current).toBe(true);

        tCal.updateMonth(0, "selected", true, 4);
        expect(tCal.months[0].selected).toBe(true);

        tCal.updateMonth(0, "visible", true, 4);
        expect(tCal.months[0].visible).toBe(true);

        tCal.year.leapYearRule = new LeapYear();
        tCal.year.leapYearRule.rule = LeapYearRules.Gregorian;
        tCal.year.numericRepresentation = 0;
        tCal.updateMonth(1, "current", false);
        expect(tCal.months[0].current).toBe(false);
        expect(tCal.months[1].current).toBe(true);

        tCal.months[1].numberOfLeapYearDays = 0;
        tCal.updateMonth(1, "current", true);
        expect(tCal.months[1].current).toBe(false);
        expect(tCal.months[2].current).toBe(true);

        tCal.updateMonth(1, "current", false);
        expect(tCal.months[1].current).toBe(false);
        expect(tCal.months[0].current).toBe(true);
    });

    test("Change Year", () => {
        const d = new Date();
        tCal.changeYear(1);
        expect(tCal.year.visibleYear).toBe(d.getFullYear() + 1);

        tCal.changeYear(1, false, "selected");
        expect(tCal.year.selectedYear).toBe(d.getFullYear() + 1);

        tCal.changeYear(-1, true, "current");
        expect(tCal.year.numericRepresentation).toBe(d.getFullYear() - 1);
        expect(tCal.months[11].current).toBe(true);
    });

    test("Change Month", () => {
        const d = new Date();
        tCal.changeMonth(1);
        expect(tCal.months[d.getMonth()].visible).toBe(false);
        expect(tCal.months[(d.getMonth() + 1) % tCal.months.length].visible).toBe(true);

        const curVisYear = tCal.year.visibleYear;
        tCal.changeMonth(tCal.months.length + 1);
        expect(tCal.months[(d.getMonth() + 2) % tCal.months.length].visible).toBe(true);
        expect(tCal.year.visibleYear).toBe(curVisYear + 1);

        tCal.resetMonths("visible");
        tCal.months[10].visible = true;
        tCal.changeMonth(-1 * tCal.months.length);
        expect(tCal.months[10].visible).toBe(true);
        expect(tCal.year.visibleYear).toBe(curVisYear);
    });

    test("Change Day Current", () => {
        tCal.resetMonths();
        tCal.months[1].current = true;
        tCal.months[1].selected = true;
        tCal.months[1].days[0].current = true;
        tCal.months[1].days[0].selected = true;

        tCal.changeDay(1);
        expect(tCal.months[1].days[0].current).toBe(false);
        expect(tCal.months[1].days[1].current).toBe(true);

        tCal.changeDay(1, "selected");
        expect(tCal.months[1].days[0].selected).toBe(false);
        expect(tCal.months[1].days[1].selected).toBe(true);

        tCal.year.numericRepresentation = 2021;
        tCal.changeDay(27);
        expect(tCal.months[1].days[1].current).toBe(false);
        expect(tCal.months[2].days[0].current).toBe(true);

        tCal.changeDay(-1);
        expect(tCal.months[2].days[0].current).toBe(false);
        expect(tCal.months[1].days[27].current).toBe(true);

        tCal.year.numericRepresentation = 2020;
        tCal.changeDay(1);
        expect(tCal.months[1].days[27].current).toBe(false);
        expect(tCal.months[1].days[28].current).toBe(true);
    });

    test("Change Day Bulk", () => {
        const d = new Date(2021, 0, 1, 0, 0, 0, 0);
        tCal.resetMonths();
        tCal.months[0].current = true;
        tCal.months[0].days[0].current = true;
        tCal.year.numericRepresentation = 2021;

        tCal.changeDayBulk(1);
        expect(tCal.months[0].days[1].current).toBe(true);
        expect(tCal.year.numericRepresentation).toBe(d.getFullYear());

        tCal.changeDayBulk(365);
        expect(tCal.months[0].days[1].current).toBe(true);
        expect(tCal.year.numericRepresentation).toBe(d.getFullYear() + 1);

        tCal.changeDayBulk(366);
        expect(tCal.months[0].days[2].current).toBe(true);
        expect(tCal.year.numericRepresentation).toBe(d.getFullYear() + 2);
    });

    test("Total Number of Days", () => {
        expect(tCal.totalNumberOfDays(true)).toBe(366);
        expect(tCal.totalNumberOfDays()).toBe(365);

        tCal.months[0].intercalary = true;
        expect(tCal.totalNumberOfDays()).toBe(334);
        expect(tCal.totalNumberOfDays(false, true)).toBe(365);
    });

    test("Date to Days", () => {
        expect(tCal.dateToDays(1970, 0, 0)).toBe(0);
        expect(tCal.dateToDays(1970, 0, 1)).toBe(1);
        expect(tCal.dateToDays(1970, -1, 1)).toBe(1);
        expect(tCal.dateToDays(1970, 14, 1)).toBe(335);
        expect(tCal.dateToDays(1972, 2, 0)).toBe(790); //Leap year and we are past the leap day
        expect(tCal.dateToDays(1969, 0, 0)).toBe(-365); //Before year 0
        expect(tCal.dateToDays(1968, 0, 0)).toBe(-731); //Leap year and we are past the leap day
        expect(tCal.dateToDays(-4, 0, 0)).toBe(-720989); //Leap year and year is below 0 and year is below year zero
        //With Intercalary month
        tCal.months[3].intercalary = true;
        expect(tCal.dateToDays(1970, 4, 0)).toBe(90);
        expect(tCal.dateToDays(1969, 2, 30)).toBe(-246);
        tCal.months[3].intercalary = false;
        //Month with an offset
        tCal.months[0].numericRepresentationOffset = 2;
        expect(tCal.dateToDays(1970, 0, 0)).toBe(0);
        expect(tCal.dateToDays(1970, 0, 3)).toBe(3);
        tCal.months[0].numericRepresentationOffset = 0;
        //year Zero is 0
        tCal.year.yearZero = 0;
        expect(tCal.dateToDays(1, 0, 0)).toBe(366);
        expect(tCal.dateToDays(-1, 0, 0)).toBe(-365);
    });

    test("Seconds To Date", () => {
        tCal.resetMonths();
        tCal.months[3].current = true;
        tCal.months[3].days[11].current = true;

        //After Year Zero Tests
        tCal.year.yearZero = 0;
        tCal.year.numericRepresentation = 1950;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: 1950, month: 3, day: 11, hour: 0, minute: 0, seconds: 0 }); //+year, 0yearZero, year>yearZero
        tCal.year.yearZero = 1000;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: 1950, month: 3, day: 11, hour: 0, minute: 0, seconds: 0 }); //+year, +yearZero, year>yearZero
        tCal.year.yearZero = -1000;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: 1950, month: 3, day: 11, hour: 0, minute: 0, seconds: 0 }); //+year, -yearZero, year>yearZero
        tCal.year.numericRepresentation = -1950;
        tCal.year.yearZero = -2000;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: -1950, month: 3, day: 11, hour: 0, minute: 0, seconds: 0 }); //-year, -yearZero, year>yearZero

        // After Year Time Tests
        tCal.year.yearZero = 0;
        tCal.year.numericRepresentation = 1950;
        tCal.time.seconds = 1;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: 1950, month: 3, day: 11, hour: 0, minute: 0, seconds: 1 });
        tCal.time.seconds = 60;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: 1950, month: 3, day: 11, hour: 0, minute: 1, seconds: 0 });
        tCal.time.seconds = 61;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: 1950, month: 3, day: 11, hour: 0, minute: 1, seconds: 1 });
        tCal.time.seconds = 3600;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: 1950, month: 3, day: 11, hour: 1, minute: 0, seconds: 0 });
        tCal.time.seconds = 3660;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: 1950, month: 3, day: 11, hour: 1, minute: 1, seconds: 0 });
        tCal.time.seconds = 3601;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: 1950, month: 3, day: 11, hour: 1, minute: 0, seconds: 1 });
        tCal.time.seconds = 3661;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: 1950, month: 3, day: 11, hour: 1, minute: 1, seconds: 1 });
        tCal.year.yearZero = 1000;
        tCal.time.seconds = 1;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: 1950, month: 3, day: 11, hour: 0, minute: 0, seconds: 1 });
        tCal.time.seconds = 60;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: 1950, month: 3, day: 11, hour: 0, minute: 1, seconds: 0 });
        tCal.time.seconds = 61;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: 1950, month: 3, day: 11, hour: 0, minute: 1, seconds: 1 });
        tCal.time.seconds = 3600;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: 1950, month: 3, day: 11, hour: 1, minute: 0, seconds: 0 });
        tCal.time.seconds = 3660;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: 1950, month: 3, day: 11, hour: 1, minute: 1, seconds: 0 });
        tCal.time.seconds = 3601;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: 1950, month: 3, day: 11, hour: 1, minute: 0, seconds: 1 });
        tCal.time.seconds = 3661;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: 1950, month: 3, day: 11, hour: 1, minute: 1, seconds: 1 });
        tCal.year.yearZero = -1000;
        tCal.time.seconds = 1;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: 1950, month: 3, day: 11, hour: 0, minute: 0, seconds: 1 });
        tCal.time.seconds = 60;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: 1950, month: 3, day: 11, hour: 0, minute: 1, seconds: 0 });
        tCal.time.seconds = 61;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: 1950, month: 3, day: 11, hour: 0, minute: 1, seconds: 1 });
        tCal.time.seconds = 3600;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: 1950, month: 3, day: 11, hour: 1, minute: 0, seconds: 0 });
        tCal.time.seconds = 3660;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: 1950, month: 3, day: 11, hour: 1, minute: 1, seconds: 0 });
        tCal.time.seconds = 3601;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: 1950, month: 3, day: 11, hour: 1, minute: 0, seconds: 1 });
        tCal.time.seconds = 3661;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: 1950, month: 3, day: 11, hour: 1, minute: 1, seconds: 1 });
        tCal.year.numericRepresentation = -1950;
        tCal.year.yearZero = -2000;
        tCal.time.seconds = 1;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: -1950, month: 3, day: 11, hour: 0, minute: 0, seconds: 1 });
        tCal.time.seconds = 60;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: -1950, month: 3, day: 11, hour: 0, minute: 1, seconds: 0 });
        tCal.time.seconds = 61;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: -1950, month: 3, day: 11, hour: 0, minute: 1, seconds: 1 });
        tCal.time.seconds = 3600;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: -1950, month: 3, day: 11, hour: 1, minute: 0, seconds: 0 });
        tCal.time.seconds = 3660;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: -1950, month: 3, day: 11, hour: 1, minute: 1, seconds: 0 });
        tCal.time.seconds = 3601;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: -1950, month: 3, day: 11, hour: 1, minute: 0, seconds: 1 });
        tCal.time.seconds = 3661;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: -1950, month: 3, day: 11, hour: 1, minute: 1, seconds: 1 });

        //Before Year Zero Tests
        tCal.time.seconds = 0;
        tCal.year.yearZero = 1970;
        tCal.year.numericRepresentation = 1950;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: 1950, month: 3, day: 11, hour: 0, minute: 0, seconds: 0 }); //+year, +yearZero, year<yearZero
        tCal.year.numericRepresentation = -1950;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: -1950, month: 3, day: 11, hour: 0, minute: 0, seconds: 0 }); //-year, +yearZero, year<yearZero
        tCal.year.yearZero = 0;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: -1950, month: 3, day: 11, hour: 0, minute: 0, seconds: 0 }); //-year, 0yearZero, year<yearZero
        tCal.year.yearZero = -1000;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: -1950, month: 3, day: 11, hour: 0, minute: 0, seconds: 0 }); //-year, -yearZero, year<yearZero
        tCal.year.numericRepresentation = 1968;
        tCal.year.yearZero = 1970;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: 1968, month: 3, day: 11, hour: 0, minute: 0, seconds: 0 });
        tCal.year.yearZero = 1969;
        tCal.year.numericRepresentation = 1963;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: 1963, month: 3, day: 11, hour: 0, minute: 0, seconds: 0 });

        // Before Year Time Tests
        tCal.year.yearZero = 1970;
        tCal.year.numericRepresentation = 1950;
        tCal.time.seconds = 1;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: 1950, month: 3, day: 11, hour: 0, minute: 0, seconds: 1 });
        tCal.time.seconds = 60;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: 1950, month: 3, day: 11, hour: 0, minute: 1, seconds: 0 });
        tCal.time.seconds = 61;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: 1950, month: 3, day: 11, hour: 0, minute: 1, seconds: 1 });
        tCal.time.seconds = 3600;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: 1950, month: 3, day: 11, hour: 1, minute: 0, seconds: 0 });
        tCal.time.seconds = 3660;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: 1950, month: 3, day: 11, hour: 1, minute: 1, seconds: 0 });
        tCal.time.seconds = 3601;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: 1950, month: 3, day: 11, hour: 1, minute: 0, seconds: 1 });
        tCal.time.seconds = 3661;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: 1950, month: 3, day: 11, hour: 1, minute: 1, seconds: 1 });
        tCal.year.numericRepresentation = -1950;
        tCal.time.seconds = 1;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: -1950, month: 3, day: 11, hour: 0, minute: 0, seconds: 1 });
        tCal.time.seconds = 60;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: -1950, month: 3, day: 11, hour: 0, minute: 1, seconds: 0 });
        tCal.time.seconds = 61;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: -1950, month: 3, day: 11, hour: 0, minute: 1, seconds: 1 });
        tCal.time.seconds = 3600;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: -1950, month: 3, day: 11, hour: 1, minute: 0, seconds: 0 });
        tCal.time.seconds = 3660;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: -1950, month: 3, day: 11, hour: 1, minute: 1, seconds: 0 });
        tCal.time.seconds = 3601;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: -1950, month: 3, day: 11, hour: 1, minute: 0, seconds: 1 });
        tCal.time.seconds = 3661;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: -1950, month: 3, day: 11, hour: 1, minute: 1, seconds: 1 });
        tCal.year.yearZero = 0;
        tCal.time.seconds = 1;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: -1950, month: 3, day: 11, hour: 0, minute: 0, seconds: 1 });
        tCal.time.seconds = 60;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: -1950, month: 3, day: 11, hour: 0, minute: 1, seconds: 0 });
        tCal.time.seconds = 61;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: -1950, month: 3, day: 11, hour: 0, minute: 1, seconds: 1 });
        tCal.time.seconds = 3600;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: -1950, month: 3, day: 11, hour: 1, minute: 0, seconds: 0 });
        tCal.time.seconds = 3660;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: -1950, month: 3, day: 11, hour: 1, minute: 1, seconds: 0 });
        tCal.time.seconds = 3601;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: -1950, month: 3, day: 11, hour: 1, minute: 0, seconds: 1 });
        tCal.time.seconds = 3661;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: -1950, month: 3, day: 11, hour: 1, minute: 1, seconds: 1 });
        tCal.year.yearZero = -1000;
        tCal.time.seconds = 1;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: -1950, month: 3, day: 11, hour: 0, minute: 0, seconds: 1 });
        tCal.time.seconds = 60;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: -1950, month: 3, day: 11, hour: 0, minute: 1, seconds: 0 });
        tCal.time.seconds = 61;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: -1950, month: 3, day: 11, hour: 0, minute: 1, seconds: 1 });
        tCal.time.seconds = 3600;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: -1950, month: 3, day: 11, hour: 1, minute: 0, seconds: 0 });
        tCal.time.seconds = 3660;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: -1950, month: 3, day: 11, hour: 1, minute: 1, seconds: 0 });
        tCal.time.seconds = 3601;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: -1950, month: 3, day: 11, hour: 1, minute: 0, seconds: 1 });
        tCal.time.seconds = 3661;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: -1950, month: 3, day: 11, hour: 1, minute: 1, seconds: 1 });

        // Testing Leap Month's
        tCal.year.yearZero = 1970;
        tCal.year.numericRepresentation = -1950;
        tCal.months.push(new Month("Leap Month", 13, 0, 0, 2));
        tCal.months.push(new Month("Leap Month 2", 14, 0, 0, 2));
        tCal.months.push(new Month("New Month", 15, 0, 10));
        tCal.months.push(new Month("No Leap Month", 16, 0, 10, 0));
        tCal.months.push(new Month("New Month 2", 17, 0, 10));
        tCal.resetMonths();
        tCal.months[11].current = true;
        tCal.months[11].days[29].current = true;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: -1950, month: 11, day: 29, hour: 1, minute: 1, seconds: 1 });
        tCal.year.numericRepresentation = -1948;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: -1948, month: 11, day: 29, hour: 1, minute: 1, seconds: 1 });

        tCal.year.numericRepresentation = 2000;
        tCal.resetMonths();
        tCal.months[14].current = true;
        tCal.months[14].days[0].current = true;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: 2000, month: 14, day: 0, hour: 1, minute: 1, seconds: 1 });
        tCal.year.numericRepresentation = 2020;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: 2020, month: 14, day: 0, hour: 1, minute: 1, seconds: 1 });
        tCal.year.numericRepresentation = 2001;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: 2001, month: 14, day: 0, hour: 1, minute: 1, seconds: 1 });
        tCal.resetMonths();
        tCal.months[14].current = true;
        tCal.months[14].days[9].current = true;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: 2001, month: 14, day: 9, hour: 1, minute: 1, seconds: 1 });

        tCal.resetMonths();
        tCal.months[15].current = true;
        tCal.months[15].days[2].current = true;
        tCal.year.numericRepresentation = -1952;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: -1952, month: 16, day: 2, hour: 1, minute: 1, seconds: 1 });

        tCal.year.numericRepresentation = 2020;
        expect(tCal.secondsToDate(tCal.toSeconds())).toStrictEqual({ year: 2020, month: 16, day: 2, hour: 1, minute: 1, seconds: 1 });
    });

    test("Seconds To Interval", () => {
        expect(tCal.secondsToInterval(6)).toStrictEqual({ year: 0, month: 0, day: 0, hour: 0, minute: 0, seconds: 6 });
        expect(tCal.secondsToInterval(66)).toStrictEqual({ year: 0, month: 0, day: 0, hour: 0, minute: 1, seconds: 6 });
        expect(tCal.secondsToInterval(3666)).toStrictEqual({ year: 0, month: 0, day: 0, hour: 1, minute: 1, seconds: 6 });
        expect(tCal.secondsToInterval(86400)).toStrictEqual({ year: 0, month: 0, day: 1, hour: 0, minute: 0, seconds: 0 });
        expect(tCal.secondsToInterval(2678400)).toStrictEqual({ year: 0, month: 1, day: 1, hour: 0, minute: 0, seconds: 0 }); // Interval uses the average number of days per month so it will never be exact. In this case 31 days worth of seconds works out to 1 month and 1 day
        expect(tCal.secondsToInterval(31536000)).toStrictEqual({ year: 1, month: 0, day: 0, hour: 0, minute: 0, seconds: 0 });

        expect(tCal.secondsToInterval(2505600)).toStrictEqual({ year: 0, month: 0, day: 29, hour: 0, minute: 0, seconds: 0 });
        expect(tCal.secondsToInterval(2591999)).toStrictEqual({ year: 0, month: 0, day: 29, hour: 23, minute: 59, seconds: 59 });
        expect(tCal.secondsToInterval(5356800)).toStrictEqual({ year: 0, month: 2, day: 1, hour: 0, minute: 0, seconds: 0 });
    });

    test("To Seconds", () => {
        jest.spyOn(tCal, "getMonthAndDayIndex");
        expect(tCal.toSeconds()).toBeDefined();
        expect(tCal.getMonthAndDayIndex).toHaveBeenCalledTimes(1);

        tCal.resetMonths();
        expect(tCal.toSeconds()).toBeDefined();
        expect(tCal.getMonthAndDayIndex).toHaveBeenCalledTimes(2);
    });

    test("Change Date Time", () => {
        jest.spyOn(GameSettings, "UiNotification");

        expect(tCal.changeDateTime({})).toBe(false);
        expect(GameSettings.UiNotification).not.toHaveBeenCalled();

        expect(tCal.changeDateTime({}, { showWarning: true })).toBe(false);
        expect(GameSettings.UiNotification).toHaveBeenCalledTimes(1);

        //@ts-ignore
        game.user.isGM = true;
        expect(tCal.changeDateTime({})).toBe(true);
        tCal.resetMonths();
        tCal.year.numericRepresentation = 2022;
        tCal.months[0].current = true;
        tCal.months[0].days[0].current = true;

        jest.spyOn(CalManager, "syncWithCalendars").mockImplementation(async () => {});
        jest.spyOn(CalManager, "saveCalendars").mockImplementation(async () => {});
        jest.spyOn(MainApplication, "updateApp").mockImplementation(async () => {});
        jest.spyOn(tCal, "syncTime").mockImplementation(async () => {});

        expect(
            tCal.changeDateTime({ year: 1, month: 1, day: 1, hour: 1, minute: 1, seconds: 1 }, { updateApp: false, save: false, sync: false })
        ).toBe(true);
        expect(tCal.year.numericRepresentation).toBe(2023);
        expect(tCal.months[1].current).toBe(true);
        expect(tCal.months[1].days[1].current).toBe(true);
        expect(tCal.time.seconds).toBe(3661);
        expect(CalManager.syncWithCalendars).not.toHaveBeenCalled();
        expect(CalManager.saveCalendars).not.toHaveBeenCalled();
        expect(MainApplication.updateApp).not.toHaveBeenCalled();
        expect(tCal.syncTime).not.toHaveBeenCalled();

        jest.spyOn(CalManager, "syncWithAllCalendars", "get").mockImplementation(() => {
            return true;
        });
        expect(tCal.changeDateTime({ hour: 23 }, { updateApp: true, save: true, sync: true })).toBe(true);
        expect(tCal.year.numericRepresentation).toBe(2023);
        expect(tCal.months[1].current).toBe(true);
        expect(tCal.months[1].days[2].current).toBe(true);
        expect(tCal.time.seconds).toBe(61);
        expect(CalManager.syncWithCalendars).toHaveBeenCalled();
        expect(CalManager.saveCalendars).toHaveBeenCalled();
        expect(MainApplication.updateApp).toHaveBeenCalled();
        expect(tCal.syncTime).toHaveBeenCalled();
    });

    test("Set Date Time", () => {
        updateSC(new SCController());
        updateMainApplication(new MainApp());
        jest.spyOn(GameSettings, "UiNotification");
        expect(tCal.setDateTime({})).toBe(false);
        expect(GameSettings.UiNotification).not.toHaveBeenCalled();

        expect(tCal.setDateTime({}, { showWarning: true })).toBe(false);
        expect(GameSettings.UiNotification).toHaveBeenCalledTimes(1);

        //@ts-ignore
        game.user.isGM = true;
        jest.spyOn(CalManager, "syncWithCalendars").mockImplementation(async () => {});
        jest.spyOn(CalManager, "saveCalendars").mockImplementation(async () => {});
        jest.spyOn(MainApplication, "updateApp").mockImplementation(async () => {});
        jest.spyOn(tCal, "syncTime").mockImplementation(async () => {});
        jest.spyOn(tCal, "updateTime");

        const d = new Date();
        expect(tCal.setDateTime({}, { updateApp: false, save: false, sync: false })).toBe(true);
        expect(tCal.year.numericRepresentation).toBe(d.getFullYear());
        expect(tCal.months[d.getMonth()].current).toBe(true);
        expect(tCal.months[d.getMonth()].days[d.getDate() - 1].current).toBe(true);
        expect(CalManager.syncWithCalendars).not.toHaveBeenCalled();
        expect(CalManager.saveCalendars).not.toHaveBeenCalled();
        expect(MainApplication.updateApp).not.toHaveBeenCalled();
        expect(tCal.syncTime).not.toHaveBeenCalled();
        expect(tCal.updateTime).toHaveBeenCalledTimes(1);

        jest.spyOn(CalManager, "syncWithAllCalendars", "get").mockImplementation(() => {
            return true;
        });
        tCal.resetMonths();
        expect(tCal.setDateTime({ year: 2222 }, { updateApp: true, save: true, sync: true })).toBe(true);
        expect(tCal.year.numericRepresentation).toBe(2222);
        expect(tCal.months[0].current).toBe(true);
        expect(tCal.months[0].days[0].current).toBe(true);
        expect(CalManager.syncWithCalendars).toHaveBeenCalled();
        expect(CalManager.saveCalendars).toHaveBeenCalled();
        expect(MainApplication.updateApp).toHaveBeenCalled();
        expect(tCal.syncTime).toHaveBeenCalled();
        expect(tCal.updateTime).toHaveBeenCalledTimes(2);
    });

    test("Sync Time", async () => {
        jest.spyOn(tCal.time, "setWorldTime").mockImplementation(async () => {});

        await tCal.syncTime();
        expect(tCal.time.setWorldTime).not.toHaveBeenCalled();

        //@ts-ignore
        game.user.isGM = true;
        await tCal.syncTime();
        expect(tCal.time.setWorldTime).toHaveBeenCalledTimes(1);

        //@ts-ignore
        game.time.worldTime = tCal.toSeconds();
        await tCal.syncTime();
        expect(tCal.time.setWorldTime).toHaveBeenCalledTimes(1);
        await tCal.syncTime(true);
        expect(tCal.time.setWorldTime).toHaveBeenCalledTimes(2);
    });

    test("Set From Time", () => {
        //@ts-ignore
        game.user.isGM = true;
        jest.spyOn(tCal, "setDateTime").mockImplementation(() => {
            return true;
        });
        jest.spyOn(tCal, "secondsToDate").mockImplementation(() => {
            return { year: 0, month: 0, day: 0, hour: 0, minute: 0, seconds: 0 };
        });

        tCal.setFromTime(1, 0);
        expect(tCal.setDateTime).not.toHaveBeenCalled();

        tCal.setFromTime(1, 1);
        expect(tCal.setDateTime).toHaveBeenCalledTimes(1);
        expect(tCal.secondsToDate).toHaveBeenCalledTimes(1);

        tCal.timeChangeTriggered = true;
        tCal.setFromTime(1, 1);
        expect(tCal.setDateTime).toHaveBeenCalledTimes(1);
        expect(tCal.secondsToDate).toHaveBeenCalledTimes(1);

        tCal.timeChangeTriggered = false;
        tCal.combatChangeTriggered = true;
        tCal.setFromTime(1, 1);
        expect(tCal.setDateTime).toHaveBeenCalledTimes(2);
        expect(tCal.secondsToDate).toHaveBeenCalledTimes(2);

        jest.spyOn(tCal.timeKeeper, "getStatus").mockImplementation(() => {
            return TimeKeeperStatus.Started;
        });
        tCal.setFromTime(1, 1);
        expect(tCal.setDateTime).toHaveBeenCalledTimes(3);
        expect(tCal.secondsToDate).toHaveBeenCalledTimes(3);

        jest.spyOn(PF2E, "getWorldCreateSeconds");
        jest.spyOn(FoundryVTTGameData, "systemID", "get").mockReturnValue("pf2e");
        tCal.setFromTime(1, 1);
        expect(PF2E.getWorldCreateSeconds).toHaveBeenCalledTimes(1);
        expect(tCal.setDateTime).toHaveBeenCalledTimes(4);
        expect(tCal.secondsToDate).toHaveBeenCalledTimes(4);
    });

    test("Process Own Combat Round Time", () => {
        jest.spyOn(tCal, "changeDateTime").mockImplementation(() => {
            return true;
        });
        //@ts-ignore
        game.user.isGM = true;
        //@ts-ignore
        tCal.processOwnCombatRoundTime({ round: 2, previous: { round: 1 } });
        expect(tCal.changeDateTime).toHaveBeenCalledTimes(1);

        //@ts-ignore
        tCal.processOwnCombatRoundTime({ round: 2, previous: { round: 2 } });
        expect(tCal.changeDateTime).toHaveBeenCalledTimes(1);

        SC.primary = true;
        //@ts-ignore
        tCal.processOwnCombatRoundTime({ round: 2, previous: { round: 1 } });
        expect(tCal.changeDateTime).toHaveBeenCalledTimes(2);

        jest.spyOn(PF1E, "isPF1E", "get").mockReturnValue(true);
        //@ts-ignore
        tCal.processOwnCombatRoundTime({ round: 2, previous: { round: 0 } });
        expect(tCal.changeDateTime).toHaveBeenCalledTimes(2);
    });

    test("Update Time", () => {
        tCal.updateTime({ year: 1, month: 1, day: 3, hour: 4, minute: 5, seconds: 6 });
        expect(tCal.year.numericRepresentation).toBe(1);
        expect(tCal.months[1].current).toBe(true);
        expect(tCal.months[1].days[3].current).toBe(true);
        expect(tCal.time.seconds).toBe(14706);
    });
});
