import {Weekday} from "./weekday";

describe('Weekday Class Tests', () => {
    let weekday: Weekday;
    let weekday2: Weekday

    beforeEach(() => {
        weekday = new Weekday(0, '');
        weekday2 = new Weekday(1,'asd');
    });

    test('Properties', () => {
        expect(Object.keys(weekday).length).toBe(2); //Make sure no new properties have been added
        expect(weekday.name).toBe("");
        expect(weekday.numericRepresentation).toBe(0);
    });

    test('To Template', () => {
        const w = weekday.toTemplate();
        const w2 = weekday2.toTemplate();
        expect(Object.keys(w).length).toBe(3); //Make sure no new properties have been adde
        expect(w.name).toBe("");
        expect(w.firstCharacter).toBe("");
        expect(w.numericRepresentation).toBe(0);
        expect(w2.name).toBe("asd");
        expect(w2.firstCharacter).toBe("A");
        expect(w2.numericRepresentation).toBe(1);

    });

    test('Clone', () => {
        expect(weekday.clone()).toStrictEqual(weekday);
        expect(weekday2.clone()).toStrictEqual(weekday2);
    });
});
