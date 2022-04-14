/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/game";
import "../../../__mocks__/form-application";
import "../../../__mocks__/application";
import "../../../__mocks__/handlebars";
import "../../../__mocks__/event";
import "../../../__mocks__/crypto";

import LeapYear from "./leap-year";
import {GameSystems, LeapYearRules} from "../../constants";
import {SimpleCalendar} from "../../../types";
import Calendar from "./index";
import {CalManager, updateCalManager} from "../index";
import CalendarManager from "./calendar-manager";

describe('Leap Year Tests', () => {
    let lr: LeapYear;
    let tCal: Calendar;

    beforeEach(() => {
        lr = new LeapYear();
        updateCalManager(new CalendarManager());
        tCal = new Calendar('','');
        jest.spyOn(CalManager, 'getActiveCalendar').mockImplementation(() => {return tCal;});
    });

    test('Properties', () => {
        expect(Object.keys(lr).length).toBe(5); //Make sure no new properties have been added
        expect(lr.rule).toBe(LeapYearRules.None);
        expect(lr.customMod).toBe(0);
    });

    test('Clone', () => {
        expect(lr.clone()).toStrictEqual(lr);
    });

    test('To Config', () => {
        const lyc = lr.toConfig();
        expect(lyc.id).toBeDefined();
        expect(lyc.rule).toBe(LeapYearRules.None);
        expect(lyc.customMod).toBe(0);
    });

    test('To Template', () => {
        const lyt = lr.toTemplate();
        expect(lyt.rule).toBe(LeapYearRules.None);
        expect(lyt.customMod).toBe(0);
    });

    test('Load From Settings', () => {
        const config: SimpleCalendar.LeapYearData = {
            id: '',
            rule: LeapYearRules.Custom,
            customMod: 10
        };

        //@ts-ignore
        lr.loadFromSettings();
        expect(lr.rule).toBe(LeapYearRules.None);
        expect(lr.customMod).toBe(0);
        //@ts-ignore
        lr.loadFromSettings({});
        expect(lr.rule).toBe(LeapYearRules.None);
        expect(lr.customMod).toBe(0);

        lr.loadFromSettings(config);
        expect(lr.rule).toBe(LeapYearRules.Custom);
        expect(lr.customMod).toBe(10);
    });

    test('Is Leap Year', () => {
        expect(lr.isLeapYear(2020)).toBe(false);

        lr.rule = LeapYearRules.Gregorian;
        expect(lr.isLeapYear(2020)).toBe(true);
        expect(lr.isLeapYear(2021)).toBe(false);
        expect(lr.isLeapYear(1900)).toBe(false);
        expect(lr.isLeapYear(2000)).toBe(true);
        expect(lr.isLeapYear(0)).toBe(true);
        expect(lr.isLeapYear(4)).toBe(true);
        expect(lr.isLeapYear(8)).toBe(true);

        lr.rule = LeapYearRules.Custom;
        lr.customMod = 5;
        expect(lr.isLeapYear(2021)).toBe(false);
        expect(lr.isLeapYear(2020)).toBe(true);
        expect(lr.isLeapYear(0)).toBe(true);
        expect(lr.isLeapYear(5)).toBe(true);
        expect(lr.isLeapYear(8)).toBe(false);

        tCal.gameSystem = GameSystems.PF2E;
        tCal.generalSettings.pf2eSync = true;
        //@ts-ignore
        game.pf2e = {worldClock: {dateTheme: "AD", worldCreatedOn: 10000}};
        expect(lr.isLeapYear(2020)).toBe(true);
    });

    test('How Many Leap Years', () => {
        expect(lr.howManyLeapYears(2020)).toBe(0);

        lr.rule = LeapYearRules.Gregorian;
        expect(lr.howManyLeapYears(0)).toBe(0);
        expect(lr.howManyLeapYears(4)).toBe(0);
        expect(lr.howManyLeapYears(5)).toBe(1);
        expect(lr.howManyLeapYears(8)).toBe(1);
        expect(lr.howManyLeapYears(9)).toBe(2);
        expect(lr.howManyLeapYears(2020)).toBe(489);
        expect(lr.howManyLeapYears(2021)).toBe(490);

        lr.rule = LeapYearRules.Custom;
        expect(lr.howManyLeapYears(0)).toBe(0);
        expect(lr.howManyLeapYears(4)).toBe(0);
        expect(lr.howManyLeapYears(2020)).toBe(0);
        expect(lr.howManyLeapYears(2021)).toBe(0);

        lr.customMod = 5;
        expect(lr.howManyLeapYears(0)).toBe(0);
        expect(lr.howManyLeapYears(5)).toBe(0);
        expect(lr.howManyLeapYears(6)).toBe(1);
        expect(lr.howManyLeapYears(2020)).toBe(403);
        expect(lr.howManyLeapYears(2021)).toBe(404);
    });

    test('Previous Leap Year', () => {
        expect(lr.previousLeapYear(1990)).toBe(null);
        lr.rule = LeapYearRules.Gregorian;
        expect(lr.previousLeapYear(1990)).toBe(1988);
    });

    test('Fraction', () => {
        expect(lr.fraction(1990)).toBe(0);
        lr.rule = LeapYearRules.Gregorian;
        expect(lr.fraction(1990)).toBe(0.5);
        lr.rule = LeapYearRules.Custom;
        lr.customMod = 5;
        expect(lr.fraction(1991)).toBe(0.2);

        lr.customMod = 0;
        expect(lr.fraction(1990)).toBe(0);
    });
});
