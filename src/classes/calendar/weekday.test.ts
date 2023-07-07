/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import {jest, beforeEach, describe, expect, test} from '@jest/globals';
import {Weekday} from "./weekday";

describe('Weekday Class Tests', () => {
    let weekday: Weekday;
    let weekday2: Weekday

    beforeEach(() => {
        weekday = new Weekday(0, '');
        weekday2 = new Weekday(1,'asd');
        const w = new Weekday();
    });

    test('Properties', () => {
        expect(Object.keys(weekday).length).toBe(7); //Make sure no new properties have been added
        expect(weekday.name).toBe("");
        expect(weekday.numericRepresentation).toBe(0);
    });

    test('To Config', () => {
        const c = weekday.toConfig();
        expect(c.id).toBe(weekday.id);
    });

    test('To Template', () => {
        const w = weekday.toTemplate();
        const w2 = weekday2.toTemplate();
        expect(Object.keys(w).length).toBe(7); //Make sure no new properties have been adde
        expect(w.name).toBe("");
        expect(w.abbreviation).toBe("");
        expect(w.numericRepresentation).toBe(0);
        expect(w2.name).toBe("asd");
        expect(w2.abbreviation).toBe("as");
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
        weekday.loadFromSettings({id: 'id', abbreviation: "Na", name: 'Name', numericRepresentation: 2, restday: true});
        expect(weekday.id).toBe('id');
        expect(weekday.name).toBe('Name');
        expect(weekday.abbreviation).toBe('Na');
        expect(weekday.numericRepresentation).toBe(2);
        expect(weekday.restday).toBe(true);
    });
});
