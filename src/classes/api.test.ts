/**
 * @jest-environment jsdom
 */
import "../../__mocks__/game";
import "../../__mocks__/form-application";
import "../../__mocks__/application";
import "../../__mocks__/handlebars";
import "../../__mocks__/event";
import "../../__mocks__/crypto";
import "../../__mocks__/dialog";
import "../../__mocks__/hooks";

import SimpleCalendar from "./simple-calendar";
import Year from "./year";
import API from "./api";
import Month from "./month";
import {Weekday} from "./weekday";
import {LeapYearRules} from "../constants";
import SpyInstance = jest.SpyInstance;


describe('API Class Tests', () => {
    let year: Year;
    let renderSpy: SpyInstance;
    beforeEach(() => {
        SimpleCalendar.instance = new SimpleCalendar();
        renderSpy = jest.spyOn(SimpleCalendar.instance, 'render');
        renderSpy.mockClear();
        year = new Year(1);
        year.months.push(new Month('M1', 1, 0, 30));
        year.months.push(new Month('M2', 2, 0, 30));
        year.months[0].current = true;
        year.months[0].days[0].current = true;
    });

    test('Timestamp', () => {
        expect(API.timestamp()).toBe(0);
        SimpleCalendar.instance.currentYear = year;
        expect(API.timestamp()).toBe(5184000);
    });

    test('Timestamp Plus Interval', () => {
        expect(API.timestampPlusInterval(0, {})).toBe(0);
        SimpleCalendar.instance.currentYear = year;
        expect(API.timestampPlusInterval(0, {seconds: 1})).toBe(1);
        expect(API.timestampPlusInterval(0, {minutes: 1})).toBe(60);
        expect(API.timestampPlusInterval(0, {hours: 1})).toBe(3600);
        expect(API.timestampPlusInterval(0, {hours: 1, minutes: 1, seconds: 6})).toBe(3666);
        expect(API.timestampPlusInterval(0, {days: 1})).toBe(86400);
        expect(API.timestampPlusInterval(0, {months: 1})).toBe(2592000);
        expect(API.timestampPlusInterval(0, {years: 1})).toBe(5184000);
    });

    test('Timestamp to Date', () => {
        expect(API.timestampToDate(3600)).toStrictEqual({year: 0, month: 0, day: 0, dayOfTheWeek: 0, hours: 0, minutes: 0, seconds: 0, monthName: "", yearName: "", yearZero: 0, weekdays: []});
        SimpleCalendar.instance.currentYear = year;
        year.weekdays.push(new Weekday(1, 'W1'));
        expect(API.timestampToDate(3600)).toStrictEqual({year: 0, month: 0, day: 1, dayOfTheWeek: 0, hours: 1, minutes: 0, seconds: 0, monthName: "M1", yearName: "", yearZero: 0, weekdays: ["W1"]});
        expect(API.timestampToDate(5184000)).toStrictEqual({year: 1, month: 0, day: 1, dayOfTheWeek: 0, hours: 0, minutes: 0, seconds: 0, monthName: "M1", yearName: "", yearZero: 0, weekdays: ["W1"]});
    });

    test('Seconds To Interval', () => {
        expect(API.secondsToInterval(3600)).toStrictEqual({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0});
        SimpleCalendar.instance.currentYear = year;
        expect(API.secondsToInterval(3600)).toStrictEqual({ years: 0, months: 0, days: 0, hours: 1, minutes: 0, seconds: 0});
    });

    test('Clock Status', () => {
        expect(API.clockStatus()).toStrictEqual({ started: false, stopped: true, paused: false });
        SimpleCalendar.instance.currentYear = year;
        expect(API.clockStatus()).toStrictEqual({ started: false, stopped: true, paused: false });
    });

    test('Show Clock', () => {
        API.showCalendar();
        expect(renderSpy).toHaveBeenCalledTimes(0);

        SimpleCalendar.instance.currentYear = year;
        API.showCalendar();
        expect(renderSpy).toHaveBeenCalledTimes(1);

        // @ts-ignore
        API.showCalendar({});
        expect(renderSpy).toHaveBeenCalledTimes(2);

        // @ts-ignore
        API.showCalendar({year: '', month: '', day: ''});
        expect(renderSpy).toHaveBeenCalledTimes(3);

        API.showCalendar({year: 0, month: 0, day: 1});
        expect(renderSpy).toHaveBeenCalledTimes(4);

        year.leapYearRule.rule = LeapYearRules.Gregorian
        API.showCalendar({year: 4, month: -1, day: -1});
        expect(renderSpy).toHaveBeenCalledTimes(5);
    });

});
