/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import { jest, beforeEach, describe, expect, test } from "@jest/globals";
import PF2E from "./pf2e";
import { LeapYearRules } from "../../constants";
import Calendar from "../calendar";

describe("Systems/PF2E Class Tests", () => {
    test("Update PF2E Variables", () => {
        //@ts-ignore
        game.pf2e = { worldClock: { dateTheme: "AD", worldCreatedOn: 1626101710000 } };

        PF2E.updatePF2EVariables(true);
        //@ts-ignore
        expect(PF2E.worldCreatedOn).toBe(1626101710);
        //@ts-ignore
        expect(PF2E.dateTheme).toBe("AD");

        //@ts-ignore
        game.pf2e = { worldClock: { dateTheme: "AR", worldCreatedOn: 0 } };
        PF2E.updatePF2EVariables();
        //@ts-ignore
        expect(PF2E.worldCreatedOn).toBe(1626101710);
        //@ts-ignore
        expect(PF2E.dateTheme).toBe("AR");
    });

    test("Is PF2E", () => {
        expect(PF2E.isPF2E).toBe(false);
    });

    test("Get World Create Seconds", () => {
        const tCal = new Calendar("", "");

        //@ts-ignore
        game.pf2e = { worldClock: { dateTheme: "AR", worldCreatedOn: 0 } };
        PF2E.updatePF2EVariables();
        expect(PF2E.getWorldCreateSeconds(tCal)).toBe(63793234510);

        //@ts-ignore
        game.pf2e = { worldClock: { dateTheme: "AD", worldCreatedOn: 1626101710000 } };
        PF2E.updatePF2EVariables(true);
        expect(PF2E.getWorldCreateSeconds(tCal)).toBe(1626015310);

        expect(PF2E.getWorldCreateSeconds(tCal)).toBe(1626015310);

        //@ts-ignore
        game.pf2e = { worldClock: { dateTheme: "AR", worldCreatedOn: 1626101710000 } };
        PF2E.updatePF2EVariables(true);
        expect(PF2E.getWorldCreateSeconds(tCal)).toBe(63793234510);

        (<Game>game).system.data.version = "2.15.0";
        PF2E.updatePF2EVariables(true);
        expect(PF2E.getWorldCreateSeconds(tCal)).toBe(63793320910);
        expect(PF2E.getWorldCreateSeconds(tCal, false)).toBe(63793407310);

        (<Game>game).system.data.version = "1.2.3";
        PF2E.updatePF2EVariables(true);
    });

    test("New Year Zero", () => {
        //@ts-ignore
        delete game.pf2e;
        expect(PF2E.newYearZero()).toBeUndefined();

        //@ts-ignore
        game.pf2e = { worldClock: { dateTheme: "AR", worldCreatedOn: 10000 } };
        PF2E.updatePF2EVariables(true);
        expect(PF2E.newYearZero()).toBe(2700);

        //@ts-ignore
        game.pf2e = { worldClock: { dateTheme: "AD", worldCreatedOn: 10000 } };
        PF2E.updatePF2EVariables(true);
        expect(PF2E.newYearZero()).toBe(1875);

        //@ts-ignore
        game.pf2e = { worldClock: { dateTheme: "CE", worldCreatedOn: 10000 } };
        PF2E.updatePF2EVariables(true);
        expect(PF2E.newYearZero()).toBe(1970);

        (<Game>game).system.data.version = "2.15.0";

        //@ts-ignore
        game.pf2e = { worldClock: { dateTheme: "AR", worldCreatedOn: 10000 } };
        PF2E.updatePF2EVariables(true);
        expect(PF2E.newYearZero()).toBe(0);

        //@ts-ignore
        game.pf2e = { worldClock: { dateTheme: "AD", worldCreatedOn: 10000 } };
        PF2E.updatePF2EVariables(true);
        expect(PF2E.newYearZero()).toBe(1970);

        //@ts-ignore
        game.pf2e = { worldClock: { dateTheme: "CE", worldCreatedOn: 10000 } };
        PF2E.updatePF2EVariables(true);
        expect(PF2E.newYearZero()).toBe(1970);

        //@ts-ignore
        game.pf2e = { worldClock: { dateTheme: "AA", worldCreatedOn: 10000 } };
        PF2E.updatePF2EVariables(true);
        expect(PF2E.newYearZero()).toBeUndefined();

        (<Game>game).system.data.version = "1.2.3";
        PF2E.updatePF2EVariables(true);
    });

    test("Check Leap Year Rules", () => {
        const tCal = new Calendar("", "");
        //@ts-ignore
        game.pf2e = { worldClock: { dateTheme: "AA", worldCreatedOn: 10000 } };
        PF2E.updatePF2EVariables(true);
        PF2E.checkLeapYearRules(tCal.year.leapYearRule);
        expect(tCal.year.leapYearRule.rule).toBe(LeapYearRules.None);

        //@ts-ignore
        game.pf2e = { worldClock: { dateTheme: "AR", worldCreatedOn: 10000 } };
        PF2E.updatePF2EVariables(true);
        PF2E.checkLeapYearRules(tCal.year.leapYearRule);
        expect(tCal.year.leapYearRule.rule).toBe(LeapYearRules.Gregorian);
    });

    test("Weekday Adjust", () => {
        //@ts-ignore
        game.pf2e = { worldClock: { dateTheme: "AA", worldCreatedOn: 10000 } };
        PF2E.updatePF2EVariables(true);
        expect(PF2E.weekdayAdjust()).toBeUndefined();

        //@ts-ignore
        game.pf2e = { worldClock: { dateTheme: "AD", worldCreatedOn: 10000 } };
        PF2E.updatePF2EVariables(true);
        expect(PF2E.weekdayAdjust()).toBe(4);

        //@ts-ignore
        game.pf2e = { worldClock: { dateTheme: "AR", worldCreatedOn: 10000 } };
        PF2E.updatePF2EVariables(true);
        expect(PF2E.weekdayAdjust()).toBe(5);

        (<Game>game).system.data.version = "3.1.2";
        PF2E.updatePF2EVariables(true);
        expect(PF2E.weekdayAdjust()).toBe(6);
    });
});
