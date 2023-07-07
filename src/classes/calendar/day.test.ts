/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import {jest, beforeEach, describe, expect, test} from '@jest/globals';

import Day from "./day";

describe('Day Class Tests', () => {
    let day:Day;
    let dayS:Day;
    beforeEach(()=>{
        day = new Day(1);
        dayS = new Day(10, "NaMe");
    });

    test('Properties', () => {
        expect(Object.keys(day).length).toBe(8); //Make sure no new properties have been added
        expect(day.selected).toBe(false);
        expect(day.current).toBe(false);
        expect(day.name).toBe("1");
        expect(day.numericRepresentation).toBe(1);
        expect(dayS.selected).toBe(false);
        expect(dayS.current).toBe(false);
        expect(dayS.name).toBe("NaMe");
        expect(dayS.numericRepresentation).toBe(10);

        const d = new Day(0);
        expect(d.name).toBe("");
        expect(d.numericRepresentation).toBe(0);
    });

    test('To Config', () => {
        const c = day.toConfig();
        const cS = dayS.toConfig();
        expect(c.id).toEqual(expect.any(String));
        expect(c.name).toBe("1");
        expect(c.numericRepresentation).toBe(1);
        expect(cS.id).toEqual(expect.any(String));
        expect(cS.name).toBe("NaMe");
        expect(cS.numericRepresentation).toBe(10);
    });

    test('To Template', () => {
        const t = day.toTemplate();
        const tS = dayS.toTemplate();
        expect(Object.keys(t).length).toBe(8); //Make sure no new properties have been added
        expect(t.selected).toBe(false);
        expect(t.current).toBe(false);
        expect(t.name).toBe("1");
        expect(t.numericRepresentation).toBe(1);
        expect(tS.selected).toBe(false);
        expect(tS.current).toBe(false);
        expect(tS.name).toBe("NaMe");
        expect(tS.numericRepresentation).toBe(10);
    });

    test('Clone', () => {
        const clone = day.clone();
        expect(clone).toStrictEqual(day);
    });
});
