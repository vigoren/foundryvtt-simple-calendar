import "../../../__mocks__/game";
import PF2E from "./pf2e";

describe('Systems/PF2E Class Tests', () => {

    test('Get World Create Seconds', () => {
        expect(PF2E.getWorldCreateSeconds()).toBe(0);

        //@ts-ignore
        game.pf2e = {worldClock: {dateTheme: "AD", worldCreatedOn: 10000}};
        expect(PF2E.getWorldCreateSeconds()).toBe(10);

        //@ts-ignore
        game.pf2e = {worldClock: {dateTheme: "AR", worldCreatedOn: 10000}};
        expect(PF2E.getWorldCreateSeconds()).toBe(62167219210);

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
