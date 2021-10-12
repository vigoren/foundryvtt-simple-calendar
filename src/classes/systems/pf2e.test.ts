/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/game";
import "../../../__mocks__/form-application";
import "../../../__mocks__/application";
import "../../../__mocks__/handlebars";
import "../../../__mocks__/event";
import "../../../__mocks__/crypto";
import "../../../__mocks__/dialog";
import "../../../__mocks__/hooks";
import PF2E from "./pf2e";
import SimpleCalendar from "../simple-calendar";
import {GameSystems, LeapYearRules} from "../../constants";

describe('Systems/PF2E Class Tests', () => {

    test('Get World Create Seconds', () => {
        expect(PF2E.getWorldCreateSeconds()).toBe(0);

        //@ts-ignore
        game.pf2e = {worldClock: {dateTheme: "AD", worldCreatedOn: 1626101710000}};
        expect(PF2E.getWorldCreateSeconds()).toBe(1626101710);

        SimpleCalendar.instance = new SimpleCalendar();
        expect(PF2E.getWorldCreateSeconds()).toBe(1626015310);

        //@ts-ignore
        game.pf2e = {worldClock: {dateTheme: "AR", worldCreatedOn: 1626101710000}};
        expect(PF2E.getWorldCreateSeconds()).toBe(63793234510);

        (<Game>game).system.data.version = '2.15.0';
        expect(PF2E.getWorldCreateSeconds()).toBe(63793320910);
        expect(PF2E.getWorldCreateSeconds(false)).toBe(63793407310);

        (<Game>game).system.data.version = '1.2.3';
    });

    test('New Year Zero', () => {
        //@ts-ignore
        delete game.pf2e;
        expect(PF2E.newYearZero()).toBeUndefined();

        //@ts-ignore
        game.pf2e = {worldClock: {dateTheme: "AR", worldCreatedOn: 10000}};
        expect(PF2E.newYearZero()).toBe(2700);

        //@ts-ignore
        game.pf2e = {worldClock: {dateTheme: "AD", worldCreatedOn: 10000}};
        expect(PF2E.newYearZero()).toBe(1875);

        //@ts-ignore
        game.pf2e = {worldClock: {dateTheme: "CE", worldCreatedOn: 10000}};
        expect(PF2E.newYearZero()).toBe(1970);

        (<Game>game).system.data.version = '2.15.0';

        //@ts-ignore
        game.pf2e = {worldClock: {dateTheme: "AR", worldCreatedOn: 10000}};
        expect(PF2E.newYearZero()).toBe(0);

        //@ts-ignore
        game.pf2e = {worldClock: {dateTheme: "AD", worldCreatedOn: 10000}};
        expect(PF2E.newYearZero()).toBe(1970);

        //@ts-ignore
        game.pf2e = {worldClock: {dateTheme: "CE", worldCreatedOn: 10000}};
        expect(PF2E.newYearZero()).toBe(1970);

        //@ts-ignore
        game.pf2e = {worldClock: {dateTheme: "AA", worldCreatedOn: 10000}};
        expect(PF2E.newYearZero()).toBeUndefined();

        (<Game>game).system.data.version = '1.2.3';
    });

    test('Check Leap Year Rules', () => {
        SimpleCalendar.instance = new SimpleCalendar();
        SimpleCalendar.instance.activeCalendar.gameSystem = GameSystems.DnD5E;
        SimpleCalendar.instance.activeCalendar.year.leapYearRule.rule = LeapYearRules.None;

        PF2E.checkLeapYearRules(SimpleCalendar.instance.activeCalendar.year.leapYearRule);
        expect(SimpleCalendar.instance.activeCalendar.year.leapYearRule.rule).toBe(LeapYearRules.None);

        SimpleCalendar.instance.activeCalendar.gameSystem = GameSystems.PF2E;
        //@ts-ignore
        game.pf2e = {worldClock: {dateTheme: "AA", worldCreatedOn: 10000}};
        PF2E.checkLeapYearRules(SimpleCalendar.instance.activeCalendar.year.leapYearRule);
        expect(SimpleCalendar.instance.activeCalendar.year.leapYearRule.rule).toBe(LeapYearRules.None);

        //@ts-ignore
        game.pf2e = {worldClock: {dateTheme: "AR", worldCreatedOn: 10000}};
        PF2E.checkLeapYearRules(SimpleCalendar.instance.activeCalendar.year.leapYearRule);
        expect(SimpleCalendar.instance.activeCalendar.year.leapYearRule.rule).toBe(LeapYearRules.Gregorian);
    });

    test('Weekday Adjust', () => {
        SimpleCalendar.instance = new SimpleCalendar();
        SimpleCalendar.instance.activeCalendar.gameSystem = GameSystems.DnD5E;
        expect(PF2E.weekdayAdjust()).toBeUndefined();

        SimpleCalendar.instance.activeCalendar.gameSystem = GameSystems.PF2E;
        //@ts-ignore
        game.pf2e = {worldClock: {dateTheme: "AA", worldCreatedOn: 10000}};
        expect(PF2E.weekdayAdjust()).toBeUndefined();

        //@ts-ignore
        game.pf2e = {worldClock: {dateTheme: "AD", worldCreatedOn: 10000}};
        expect(PF2E.weekdayAdjust()).toBe(4);

        //@ts-ignore
        game.pf2e = {worldClock: {dateTheme: "AR", worldCreatedOn: 10000}};
        expect(PF2E.weekdayAdjust()).toBe(5);
    });
});
