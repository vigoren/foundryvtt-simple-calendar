/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import {jest, beforeEach, describe, expect, test} from '@jest/globals';

import Season from "./season";
import Calendar from "./index";
import {CalManager, updateCalManager} from "../index";
import CalendarManager from "./calendar-manager";

describe('Season Tests', () => {
    let tCal: Calendar;
    let s: Season;
    let sBlank: Season;

    beforeEach(() => {
        sBlank = new Season();
        s = new Season('Spring', 1, 1);
        updateCalManager(new CalendarManager());
        tCal = new Calendar('','');
        jest.spyOn(CalManager, 'getActiveCalendar').mockImplementation(() => {return tCal;});
    });

    test('Properties', () => {
        expect(Object.keys(s).length).toBe(12); //Make sure no new properties have been added
        expect(s.id).toBeDefined();
        expect(s.name).toBe('Spring');
        expect(s.startingMonth).toBe(1);
        expect(s.startingDay).toBe(1);
        expect(s.color).toBe('#ffffff');
        expect(s.sunriseTime).toBe(0);
        expect(s.sunsetTime).toBe(0);
        expect(s.icon).toBe('none');

        expect(sBlank.name).toBe('');
        expect(sBlank.startingMonth).toBe(0);
        expect(sBlank.startingDay).toBe(0);
    });

    test('Clone', () => {
        expect(s.clone()).toStrictEqual(s);
    });

    test('To Config', () => {
        const c = s.toConfig();
        expect(Object.keys(c).length).toBe(9); //Make sure no new properties have been added
        expect(c.name).toBe('Spring');
        expect(c.startingMonth).toBe(1);
        expect(c.startingDay).toBe(1);
        expect(c.color).toBe('#ffffff');
        expect(c.icon).toBe('none');
    });

    test('To Template', () => {
        let c = s.toTemplate();
        expect(Object.keys(c).length).toBe(14); //Make sure no new properties have been added
        expect(c.name).toBe('Spring');
        expect(c.startingMonth).toBe(1);
        expect(c.startingDay).toBe(1);
        expect(c.color).toBe('#ffffff');
        expect(c.startDateSelectorId).toBeDefined();
        expect(c.sunriseSelectorId).toBeDefined();
        expect(c.icon).toBe('none');

        s.sunriseTime = 3660;
        s.sunsetTime = 3660;
        c = s.toTemplate();
        expect(c.sunriseSelectorSelectedDates.start.hour).toBe(1);
        expect(c.sunriseSelectorSelectedDates.start.minute).toBe(1);
        expect(c.sunriseSelectorSelectedDates.end.hour).toBe(1);
        expect(c.sunriseSelectorSelectedDates.end.minute).toBe(1);
    });

    test('Load From Settings', () => {
        //@ts-ignore
        s.loadFromSettings({});
        expect(s.id).toBeDefined();

        //@ts-ignore
        s.loadFromSettings({name: 'test', color:'custom', customColor:"#123FFF"});
        expect(s.id).toBeDefined();
        expect(s.color).toBe("#123FFF");

        //@ts-ignore
        s.loadFromSettings({id: 'a', name: 'test', sunriseTime: 0, sunsetTime: 0, icon: 'spring'});
        expect(s.id).toBe('a');
        expect(s.sunriseTime).toBe(0);
        expect(s.sunsetTime).toBe(0);

    });

});
