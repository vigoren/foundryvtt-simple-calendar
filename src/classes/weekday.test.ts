/**
 * @jest-environment jsdom
 */
import "../../__mocks__/game";
import "../../__mocks__/form-application";
import "../../__mocks__/application";
import "../../__mocks__/handlebars";
import "../../__mocks__/event";
import "../../__mocks__/crypto";
import "../../__mocks__/hooks";
import SimpleCalendar from "./simple-calendar";
import {Weekday} from "./weekday";

describe('Weekday Class Tests', () => {
    let weekday: Weekday;
    let weekday2: Weekday
    SimpleCalendar.instance = new SimpleCalendar();

    beforeEach(() => {
        weekday = new Weekday(0, '');
        weekday2 = new Weekday(1,'asd');
        const w = new Weekday();
    });

    test('Properties', () => {
        expect(Object.keys(weekday).length).toBe(3); //Make sure no new properties have been added
        expect(weekday.name).toBe("");
        expect(weekday.numericRepresentation).toBe(0);
    });

    test('To Template', () => {
        const w = weekday.toTemplate();
        const w2 = weekday2.toTemplate();
        expect(Object.keys(w).length).toBe(4); //Make sure no new properties have been adde
        expect(w.name).toBe("");
        expect(w.firstCharacter).toBe("");
        expect(w.numericRepresentation).toBe(0);
        expect(w2.name).toBe("asd");
        expect(w2.firstCharacter).toBe("As");
        expect(w2.numericRepresentation).toBe(1);

    });

    test('Clone', () => {
        expect(weekday.clone()).toStrictEqual(weekday);
        expect(weekday2.clone()).toStrictEqual(weekday2);
    });

    test('Load From Settings', () => {
        //@ts-ignore
        weekday.loadFromSettings({});
        expect(weekday.id).toBeDefined();

        //@ts-ignore
        weekday.loadFromSettings({name: 'Name', numericRepresentation: 2});
        expect(weekday.id).toBeDefined();
        expect(weekday.name).toBe('Name');
        expect(weekday.numericRepresentation).toBe(2);

        //@ts-ignore
        weekday.loadFromSettings({id: 'id', name: 'Name', numericRepresentation: 2});
        expect(weekday.id).toBe('id');
        expect(weekday.name).toBe('Name');
        expect(weekday.numericRepresentation).toBe(2);
    });
});
