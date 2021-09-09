/**
 * @jest-environment jsdom
 */
import "../../__mocks__/game";
import "../../__mocks__/form-application";
import "../../__mocks__/application";
import "../../__mocks__/handlebars";
import "../../__mocks__/event";
import "../../__mocks__/crypto";

import Season from "./season";
import SimpleCalendar from "./simple-calendar";
import Year from "./year";
import Month from "./month";

describe('Season Tests', () => {

    let s: Season;

    beforeEach(() => {
        s = new Season('Spring', 1, 1);

        // @ts-ignore
        SimpleCalendar.instance = undefined;
    });

    test('Properties', () => {
        expect(Object.keys(s).length).toBe(7); //Make sure no new properties have been added
        expect(s.id).toBeDefined();
        expect(s.name).toBe('Spring');
        expect(s.startingMonth).toBe(1);
        expect(s.startingDay).toBe(1);
        expect(s.color).toBe('#ffffff');
        expect(s.sunriseTime).toBe(0);
        expect(s.sunsetTime).toBe(0);
    });

    test('Clone', () => {
        expect(s.clone()).toStrictEqual(s);
    });

    test('To Template', () => {
        const y = new Year(0);
        let c = s.toTemplate(y);
        expect(Object.keys(c).length).toBe(6); //Make sure no new properties have been added
        expect(c.name).toBe('Spring');
        expect(c.startingMonth).toBe(1);
        expect(c.startingDay).toBe(1);
        expect(c.color).toBe('#ffffff');
        expect(c.startDateSelectorId).toBeDefined();
        expect(c.sunriseSelectorId).toBeDefined();

        SimpleCalendar.instance = new SimpleCalendar();
        SimpleCalendar.instance.currentYear = new Year(0);
        c = s.toTemplate(y);

        s.sunriseTime = 3660;
        s.sunsetTime = 3660;
        c = s.toTemplate(y);
    });

    test('Start Date Change', () => {
        s.startDateChange({
            startDate: { year: 0, month: 2, day: 4, minute: 0, hour: 0, allDay: true },
            endDate: { year: 0, month: 2, day: 4, minute: 0, hour: 0, allDay: true },
            visibleDate: { year: 0, month: 2, day: 4, minute: 0, hour: 0, allDay: true }
        });
        expect(s.startingMonth).toBe(2);
        expect(s.startingDay).toBe(4);
    });

    test('Sunrise Sunset Change', () => {
        s.sunriseSunsetChange({
            startDate: { year: 0, month: 1, day: 1, minute: 30, hour: 2, allDay: false },
            endDate: { year: 0, month: 1, day: 1, minute: 0, hour: 4, allDay: false },
            visibleDate: { year: 0, month: 1, day: 1, minute: 0, hour: 0, allDay: false }
        });
        expect(s.sunriseTime).toBe(0);
        expect(s.sunsetTime).toBe(0);

        SimpleCalendar.instance = new SimpleCalendar();
        SimpleCalendar.instance.currentYear = new Year(0);
        s.sunriseSunsetChange({
            startDate: { year: 0, month: 1, day: 1, minute: 30, hour: 2, allDay: false },
            endDate: { year: 0, month: 1, day: 1, minute: 0, hour: 4, allDay: false },
            visibleDate: { year: 0, month: 1, day: 1, minute: 0, hour: 0, allDay: false }
        });
        expect(s.sunriseTime).toBe(9000);
        expect(s.sunsetTime).toBe(14400);
    });

    test('Activate Date Selectors', () => {
        s.activateDateSelectors();
    });

});
