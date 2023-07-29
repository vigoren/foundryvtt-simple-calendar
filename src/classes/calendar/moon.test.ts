/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import { jest, beforeEach, describe, expect, test } from "@jest/globals";
import Moon from "./moon";
import { Icons, MoonYearResetOptions, PredefinedCalendars } from "../../constants";
import { CalManager, updateCalManager, updateNManager } from "../index";
import CalendarManager from "./calendar-manager";
import Calendar from "./index";
import PredefinedCalendar from "../configuration/predefined-calendar";
import fetchMock from "jest-fetch-mock";
import NoteManager from "../notes/note-manager";

fetchMock.enableMocks();
describe("Moon Tests", () => {
    let m: Moon;
    let tCal: Calendar;

    beforeEach(async () => {
        fetchMock.resetMocks();
        fetchMock.mockOnce(
            `{"calendar":{"currentDate":{"year":2022,"month":2,"day":28,"seconds":127},"general":{"gameWorldTimeIntegration":"mixed","showClock":true,"noteDefaultVisibility":false,"postNoteRemindersOnFoundryLoad":true,"pf2eSync":true,"dateFormat":{"date":"MMMM DD, YYYY","time":"HH:mm:ss","monthYear":"MMMM YAYYYYYZ"}},"leapYear":{"rule":"gregorian","customMod":0},"months":[{"name":"January","abbreviation":"Jan","numericRepresentation":1,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"February","abbreviation":"Feb","numericRepresentation":2,"numericRepresentationOffset":0,"numberOfDays":28,"numberOfLeapYearDays":29,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"March","abbreviation":"Mar","numericRepresentation":3,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"April","abbreviation":"Apr","numericRepresentation":4,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"May","abbreviation":"May","numericRepresentation":5,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"June","abbreviation":"Jun","numericRepresentation":6,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"July","abbreviation":"Jul","numericRepresentation":7,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"August","abbreviation":"Aug","numericRepresentation":8,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"September","abbreviation":"Sep","numericRepresentation":9,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"October","abbreviation":"Oct","numericRepresentation":10,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"November","abbreviation":"Nov","numericRepresentation":11,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"December","abbreviation":"Dec","numericRepresentation":12,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null}],"moons":[{"name":"Moon","cycleLength":29.53059,"firstNewMoon":{"yearReset":"none","yearX":0,"year":2000,"month":1,"day":5},"phases":[{"name":"New Moon","length":1,"icon":"new","singleDay":true},{"name":"Waxing Crescent","length":6.38265,"icon":"waxing-crescent","singleDay":false},{"name":"First Quarter","length":1,"icon":"first-quarter","singleDay":true},{"name":"Waxing Gibbous","length":6.38265,"icon":"waxing-gibbous","singleDay":false},{"name":"Full Moon","length":1,"icon":"full","singleDay":true},{"name":"Waning Gibbous","length":6.38265,"icon":"waning-gibbous","singleDay":false},{"name":"Last Quarter","length":1,"icon":"last-quarter","singleDay":true},{"name":"Waning Crescent","length":6.38265,"icon":"waning-crescent","singleDay":false}],"color":"#ffffff","cycleDayAdjust":0.5}],"noteCategories":[{"name":"Holiday","textColor":"#FFFFFF","color":"#148e94"}],"seasons":[{"name":"Spring","startingMonth":2,"startingDay":19,"color":"#46b946","icon":"spring","sunriseTime":21600,"sunsetTime":64800},{"name":"Summer","startingMonth":5,"startingDay":19,"color":"#e0c40b","icon":"summer","sunriseTime":21600,"sunsetTime":64800},{"name":"Fall","startingMonth":8,"startingDay":21,"color":"#ff8e47","icon":"fall","sunriseTime":21600,"sunsetTime":64800},{"name":"Winter","startingMonth":11,"startingDay":20,"color":"#479dff","icon":"winter","sunriseTime":21600,"sunsetTime":64800}],"time":{"hoursInDay":24,"minutesInHour":60,"secondsInMinute":60,"gameTimeRatio":1,"unifyGameAndClockPause":false,"updateFrequency":1},"weekdays":[{"abbreviation":"Su","name":"Sunday","numericRepresentation":1},{"abbreviation":"Mo","name":"Monday","numericRepresentation":2},{"abbreviation":"Tu","name":"Tuesday","numericRepresentation":3},{"abbreviation":"We","name":"Wednesday","numericRepresentation":4},{"abbreviation":"Th","name":"Thursday","numericRepresentation":5},{"abbreviation":"Fr","name":"Friday","numericRepresentation":6},{"abbreviation":"Sa","name":"Saturday","numericRepresentation":7}],"year":{"numericRepresentation":2022,"prefix":"","postfix":"","showWeekdayHeadings":true,"firstWeekday":4,"yearZero":1970,"yearNames":[],"yearNamingRule":"default","yearNamesStart":0}}}`
        );
        updateCalManager(new CalendarManager());
        updateNManager(new NoteManager());
        tCal = new Calendar("", "");
        jest.spyOn(CalManager, "getActiveCalendar").mockImplementation(() => {
            return tCal;
        });
        await PredefinedCalendar.setToPredefined(tCal, PredefinedCalendars.Gregorian);
        m = tCal.moons[0];
    });

    test("Properties", () => {
        expect(Object.keys(m).length).toBe(11); //Make sure no new properties have been added
        expect(m.name).toBe("Moon");
        expect(m.cycleLength).toBe(29.53059);
        expect(m.cycleDayAdjust).toBe(0.5);
        expect(m.color).toBe("#ffffff");
        expect(m.phases.length).toBe(8);
        expect(m.firstNewMoon).toStrictEqual({ day: 5, month: 1, year: 2000, yearReset: "none", yearX: 0 });
    });

    test("Clone", () => {
        expect(m.clone()).toStrictEqual(m);
    });

    test("To Config", () => {
        let c = m.toConfig();
        expect(Object.keys(c).length).toBe(7); //Make sure no new properties have been added
        expect(c.name).toBe("Moon");
        expect(c.cycleLength).toBe(29.53059);
    });

    test("To Template", () => {
        let c = m.toTemplate();
        expect(Object.keys(c).length).toBe(13); //Make sure no new properties have been added
        expect(c.name).toBe("Moon");
        expect(c.cycleLength).toBe(29.53059);
        expect(c.firstNewMoon).toStrictEqual({ day: 5, month: 1, year: 2000, yearReset: "none", yearX: 0 });
        expect(c.phases.length).toBe(8);
        expect(c.color).toBe("#ffffff");
        expect(c.cycleDayAdjust).toBe(0.5);
    });

    test("Load From Settings", () => {
        //@ts-ignore
        m.loadFromSettings({});
        expect(m.id).toBeDefined();
        //@ts-ignore
        m.loadFromSettings({ id: "a", name: "", firstNewMoon: {} });
        expect(m.id).toBe("a");
        //@ts-ignore
        m.loadFromSettings({ name: "", firstNewMoon: {} });
        expect(m.id).toBeDefined();
    });

    test("Update Phase Length", () => {
        m.updatePhaseLength();
        expect(m.phases[0].length).toBe(1);

        m.phases.push({ name: "p2", icon: Icons.NewMoon, length: 0, singleDay: false });
        m.updatePhaseLength();
        expect(m.phases[0].length).toBe(1);
        expect(m.phases[1].length).toBe(5.10612);
    });

    test("Get Date Moon Phase", () => {
        expect(m.getDateMoonPhase(tCal, 1999, 11, 24)).toStrictEqual(m.phases[5]);
        expect(m.getDateMoonPhase(tCal, 2000, 0, 6)).toStrictEqual(m.phases[0]);

        m.firstNewMoon.yearReset = MoonYearResetOptions.LeapYear;
        expect(m.getDateMoonPhase(tCal, 1999, 11, 24)).toStrictEqual(m.phases[1]);

        m.firstNewMoon.yearReset = MoonYearResetOptions.XYears;
        expect(m.getDateMoonPhase(tCal, 1999, 11, 24)).toStrictEqual(m.phases[0]);
        m.firstNewMoon.yearX = 5;
        expect(m.getDateMoonPhase(tCal, 1999, 11, 24)).toStrictEqual(m.phases[3]);
    });

    test("Get Moon Phase", () => {
        expect(m.getMoonPhase(tCal)).toBeDefined();
        expect(m.getMoonPhase(tCal, "selected")).toBeDefined();
        expect(m.getMoonPhase(tCal, "visible")).toBeDefined();
    });
});
