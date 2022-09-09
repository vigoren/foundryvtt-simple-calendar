/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import PF2E from "./pf2e";
import {LeapYearRules} from "../../constants";
import Calendar from "../calendar";

describe('Systems/PF2E Class Tests', () => {

    test('Get World Create Seconds', () => {
        const tCal = new Calendar('', '');
        expect(PF2E.getWorldCreateSeconds(tCal)).toBe(0);

        //@ts-ignore
        game.pf2e = {worldClock: {dateTheme: "AD", worldCreatedOn: 1626101710000}};
        expect(PF2E.getWorldCreateSeconds(tCal)).toBe(1626015310);

        expect(PF2E.getWorldCreateSeconds(tCal)).toBe(1626015310);

        //@ts-ignore
        game.pf2e = {worldClock: {dateTheme: "AR", worldCreatedOn: 1626101710000}};
        expect(PF2E.getWorldCreateSeconds(tCal)).toBe(63793234510);

        (<Game>game).system.data.version = '2.15.0';
        expect(PF2E.getWorldCreateSeconds(tCal)).toBe(63793320910);
        expect(PF2E.getWorldCreateSeconds(tCal, false)).toBe(63793407310);

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
        const tCal = new Calendar('', '');
        //@ts-ignore
        game.pf2e = {worldClock: {dateTheme: "AA", worldCreatedOn: 10000}};
        PF2E.checkLeapYearRules(tCal.year.leapYearRule);
        expect(tCal.year.leapYearRule.rule).toBe(LeapYearRules.None);

        //@ts-ignore
        game.pf2e = {worldClock: {dateTheme: "AR", worldCreatedOn: 10000}};
        PF2E.checkLeapYearRules(tCal.year.leapYearRule);
        expect(tCal.year.leapYearRule.rule).toBe(LeapYearRules.Gregorian);
    });

    test('Weekday Adjust', () => {
        //@ts-ignore
        game.pf2e = {worldClock: {dateTheme: "AA", worldCreatedOn: 10000}};
        expect(PF2E.weekdayAdjust()).toBeUndefined();

        //@ts-ignore
        game.pf2e = {worldClock: {dateTheme: "AD", worldCreatedOn: 10000}};
        expect(PF2E.weekdayAdjust()).toBe(4);

        //@ts-ignore
        game.pf2e = {worldClock: {dateTheme: "AR", worldCreatedOn: 10000}};
        expect(PF2E.weekdayAdjust()).toBe(5);

        (<Game>game).system.data.version = '3.1.2';
        expect(PF2E.weekdayAdjust()).toBe(6);
    });
});
