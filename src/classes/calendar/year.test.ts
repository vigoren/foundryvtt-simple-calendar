/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import {jest, beforeEach, describe, expect, test} from '@jest/globals';
import {LeapYearRules, YearNamingRules} from "../../constants";
import Calendar from "./index";


describe('Year Class Tests', () => {
    let tCal: Calendar;

    beforeEach(() => {
        tCal = new Calendar('','');
    });

    test('Properties', () => {
        expect(Object.keys(tCal.year).length).toBe(17); //Make sure no new properties have been added
        expect(tCal.year.prefix).toBe("");
        expect(tCal.year.postfix).toBe("");
        expect(tCal.year.yearZero).toBe(0);
        expect(tCal.year.numericRepresentation).toBe(0);
        expect(tCal.year.selectedYear).toBe(0);
        expect(tCal.year.visibleYear).toBe(0);
        expect(tCal.year.leapYearRule.customMod).toBe(1);
        expect(tCal.year.leapYearRule.rule).toBe(LeapYearRules.None);
        expect(tCal.year.showWeekdayHeadings).toBe(true);
        expect(tCal.year.firstWeekday).toBe(0);
        expect(tCal.year.yearNames).toStrictEqual([]);
        expect(tCal.year.yearNamesStart).toBe(0);
        expect(tCal.year.yearNamingRule).toBe(YearNamingRules.Default);
    });

    test('To Config', () => {
        const t = tCal.year.toConfig();
        expect(t.id).toBe(tCal.year.id);
    });

    test('To Template', () => {
        let t = tCal.year.toTemplate();
        expect(Object.keys(t).length).toBe(11); //Make sure no new properties have been added
        expect(t.numericRepresentation).toBe(0);
        expect(t.yearZero).toBe(0);
        expect(t.firstWeekday).toBe(0);
        expect(t.yearNames).toStrictEqual([]);
        expect(t.yearNamesStart).toBe(0);
        expect(t.yearNamingRule).toBe(YearNamingRules.Default);
    });

    test('Load From Settings', () => {
        //@ts-ignore
        tCal.year.loadFromSettings({});
        expect(tCal.year.id).toBeDefined();

        //@ts-ignore
        tCal.year.loadFromSettings({numericRepresentation: 12});
        expect(tCal.year.numericRepresentation).toBe(12);

        //@ts-ignore
        tCal.year.loadFromSettings({id: 'id', showWeekdayHeadings: false, firstWeekday: 2, yearZero: 0, yearNames: [], yearNamingRule: YearNamingRules.Random, yearNamesStart: 0});
        expect(tCal.year.id).toBe('id');
    });

    test('Clone', () => {
        expect(tCal.year.clone()).toEqual(tCal.year);

        tCal.year.yearNames.push('NAME');
        expect(tCal.year.clone()).toEqual(tCal.year);
    });

    test('Get Display Name', () => {
        expect(tCal.year.getDisplayName()).toBe('0');
        tCal.year.prefix = 'Pre';
        tCal.year.postfix = 'Post';
        expect(tCal.year.getDisplayName()).toBe('Pre 0 Post');

        tCal.year.selectedYear = 1;
        expect(tCal.year.getDisplayName(true)).toBe('Pre 1 Post');

        tCal.year.yearNames.push('Name');
        expect(tCal.year.getDisplayName()).toBe('Pre Name (0) Post');
        expect(tCal.year.getDisplayName(true)).toBe('Pre Name (1) Post');


    });

    test('Get Year Name', () => {
        expect(tCal.year.getYearName(0)).toBe('');
        tCal.year.yearNames.push('First Year');
        tCal.year.yearNames.push('Second Year');
        tCal.year.yearNames.push('Third Year');
        tCal.year.yearNamesStart = 0;
        expect(tCal.year.getYearName(0)).toBe('First Year');
        expect(tCal.year.getYearName(1)).toBe('Second Year');
        expect(tCal.year.getYearName(2)).toBe('Third Year');
        expect(tCal.year.getYearName(3)).toBe('Third Year');

        tCal.year.yearNamingRule = YearNamingRules.Repeat;
        expect(tCal.year.getYearName(3)).toBe('First Year');

        tCal.year.yearNamingRule = YearNamingRules.Random;
        expect(tCal.year.getYearName(4)).not.toBe('');
    });
});
