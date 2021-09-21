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

    });

    test('New Year Zero', () => {
        //@ts-ignore
        delete game.pf2e;
        expect(PF2E.newYearZero()).toBeUndefined();

        //@ts-ignore
        game.pf2e = {worldClock: {dateTheme: "AR", worldCreatedOn: 10000}};
        expect(PF2E.newYearZero()).toBeUndefined();

        //@ts-ignore
        game.pf2e = {worldClock: {dateTheme: "AD", worldCreatedOn: 10000}};
        expect(PF2E.newYearZero()).toBe(1875);

    });
});
