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
import Macros from "./macros";


describe('API Class Tests', () => {
    let year: Year;
    let renderSpy: SpyInstance;
    beforeEach(() => {
        SimpleCalendar.instance = new SimpleCalendar();
        renderSpy = jest.spyOn(SimpleCalendar.instance, 'render');
        renderSpy.mockClear();
        year = new Year(1);
        year.months.push(new Month('M1', 1, 0, 30));
        year.months.push(new Month('M2', 2, 0, 30, 31));
        year.months[0].current = true;
        year.months[0].days[0].current = true;
    });

    test('Timestamp', () => {
        expect(API.timestamp()).toBe(0);
        SimpleCalendar.instance.currentYear = year;
        expect(API.timestamp()).toBe(5270400);
    });

    test('Timestamp Plus Interval', () => {
        expect(API.timestampPlusInterval(0, {})).toBe(0);
        SimpleCalendar.instance.currentYear = year;
        year.yearZero = 0;
        expect(API.timestampPlusInterval(0, {second: 1})).toBe(1);
        expect(API.timestampPlusInterval(0, {minute: 1})).toBe(60);
        expect(API.timestampPlusInterval(0, {hour: 1})).toBe(3600);
        expect(API.timestampPlusInterval(0, {hour: 1, minute: 1, second: 6})).toBe(3666);
        expect(API.timestampPlusInterval(0, {day: 1})).toBe(86400);
        expect(API.timestampPlusInterval(0, {month: 1})).toBe(2592000);
        expect(API.timestampPlusInterval(0, {year: 1})).toBe(5270400);

        year.leapYearRule.rule = LeapYearRules.Gregorian;
        expect(API.timestampPlusInterval(0, {day: 0})).toBe(0);
        expect(API.timestampPlusInterval(0, {})).toBe(0);

        expect(API.timestampPlusInterval(1623077754, {day: 0})).toBe(1623077754);
        expect(API.timestampPlusInterval(1623077754, {day: 1})).toBe(1623164154);

        expect(API.timestampPlusInterval(0, {second: 86401})).toBe(86401);
    });

    test('Timestamp to Date', () => {
        expect(API.timestampToDate(3600)).toStrictEqual({year: 0, month: 0, day: 0, dayOfTheWeek: 0, hour: 0, minute: 0, second: 0, monthName: "", yearName: "", yearZero: 0, weekdays: []});
        SimpleCalendar.instance.currentYear = year;
        year.weekdays.push(new Weekday(1, 'W1'));
        expect(API.timestampToDate(3600)).toStrictEqual({year: 0, month: 0, day: 0, dayOfTheWeek: 0, hour: 1, minute: 0, second: 0, monthName: "M1", yearName: "", yearZero: 0, weekdays: ["W1"]});
        expect(API.timestampToDate(5184000)).toStrictEqual({year: 1, month: 0, day: 0, dayOfTheWeek: 0, hour: 0, minute: 0, second: 0, monthName: "M1", yearName: "", yearZero: 0, weekdays: ["W1"]});
        expect(API.timestampToDate(5270400)).toStrictEqual({year: 1, month: 0, day: 1, dayOfTheWeek: 0, hour: 0, minute: 0, second: 0, monthName: "M1", yearName: "", yearZero: 0, weekdays: ["W1"]});
    });

    test('Seconds To Interval', () => {
        expect(API.secondsToInterval(3600)).toStrictEqual({ year: 0, month: 0, day: 0, hour: 0, minute: 0, second: 0});
        SimpleCalendar.instance.currentYear = year;
        expect(API.secondsToInterval(3600)).toStrictEqual({ year: 0, month: 0, day: 0, hour: 1, minute: 0, second: 0});
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

    test('Change Date', () => {
        API.changeDate({});
        expect(renderSpy).toHaveBeenCalledTimes(0);

        //@ts-ignore
        game.user.isGM = true;
        SimpleCalendar.instance.currentYear = year;

        API.changeDate({});
        expect(renderSpy).toHaveBeenCalledTimes(0);

        API.changeDate({year: 1});
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect(year.numericRepresentation).toBe(2);

        API.changeDate({month: 1});
        expect(renderSpy).toHaveBeenCalledTimes(2);
        expect(year.getMonth()?.numericRepresentation).toBe(2);

        API.changeDate({day: 1});
        expect(renderSpy).toHaveBeenCalledTimes(3);
        expect(year.getMonth()?.getDay()?.numericRepresentation).toBe(2);

        API.changeDate({second: 1});
        expect(renderSpy).toHaveBeenCalledTimes(4);
        expect(year.time.seconds).toBe(1);

        API.changeDate({second: 86401});
        expect(renderSpy).toHaveBeenCalledTimes(5);
        expect(year.getMonth()?.getDay()?.numericRepresentation).toBe(3);
        expect(year.time.seconds).toBe(2);

        //@ts-ignore
        game.user.isGM = false;
    });

    test('Set Date', () => {
        API.setDate({});
        expect(renderSpy).toHaveBeenCalledTimes(0);

        //@ts-ignore
        game.user.isGM = true;
        SimpleCalendar.instance.currentYear = year;
        API.setDate({year: 2021});
        expect(year.numericRepresentation).toBe(2021);

        API.setDate({month: 1, day: 1, hour: 1, minute: 1, second: 1});
        expect(year.numericRepresentation).toBe(0);
        expect(year.getMonth()?.numericRepresentation).toBe(2);
        expect(year.getMonth()?.getDay()?.numericRepresentation).toBe(2);
        expect(year.time.seconds).toBe(3661);

        year.yearZero = 1;
        API.setDate({month: -1, day: -1});
        expect(year.getMonth()?.numericRepresentation).toBe(1);
        expect(year.getMonth()?.getDay()?.numericRepresentation).toBe(1);

        //@ts-ignore
        game.user.isGM = false;
    });

    test('Choose Random Date', () => {
        expect(API.chooseRandomDate()).toStrictEqual({year: 0, month: 0, day: 0, hour: 0, minute: 0, second: 0});

        SimpleCalendar.instance.currentYear = year;
        expect(API.chooseRandomDate()).toBeDefined();

        expect(API.chooseRandomDate({year: 2000, month: 1, day: 0, hour: 0, minute: 0, second: 0},{year: 2021, month: 2, day: 1, hour: 12, minute:20, second:30})).toBeDefined();
        expect(API.chooseRandomDate({year: 2000, month: 1, day: 3, hour: 0, minute: 0, second: 0},{year: 2000, month: 1, day: 3, hour: 0, minute: 0, second: 0})).toStrictEqual({year: 2000, month: 1, day: 3, hour: 0, minute: 0, second: 0});
        expect(API.chooseRandomDate({year: 2000, month: -1, day: -3, hour: 0, minute: 0, second: 0},{year: 2000, month: -1, day: -3, hour: 0, minute: 0, second: 0})).toStrictEqual({year: 2000, month: 1, day: 30, hour: 0, minute: 0, second: 0});
    });

});
