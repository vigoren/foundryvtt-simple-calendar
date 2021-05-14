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
    });

    test('Properties', () => {
        expect(Object.keys(s).length).toBe(5); //Make sure no new properties have been added
        expect(s.name).toBe('Spring');
        expect(s.startingMonth).toBe(1);
        expect(s.startingDay).toBe(1);
        expect(s.color).toBe('#ffffff');
        expect(s.customColor).toBe('');
    });

    test('Clone', () => {
        expect(s.clone()).toStrictEqual(s);
    });

    test('To Template', () => {
        const y = new Year(0);
        let c = s.toTemplate(y);
        expect(Object.keys(c).length).toBe(5); //Make sure no new properties have been added
        expect(c.name).toBe('Spring');
        expect(c.startingMonth).toBe(1);
        expect(c.startingDay).toBe(1);
        expect(c.color).toBe('#ffffff');
        expect(c.dayList).toStrictEqual([]);

        SimpleCalendar.instance = new SimpleCalendar();

        c = s.toTemplate(y);
        expect(c.dayList.length).toStrictEqual(0);
        y.months.push(new Month("Month 1", 1, 0, 10));
        c = s.toTemplate(y);
        expect(c.dayList.length).toStrictEqual(10);

        s.color = 'custom';
        s.customColor = '#FF0000';
        c = s.toTemplate(y);
        expect(c.color).toBe('#FF0000');
    });

});
