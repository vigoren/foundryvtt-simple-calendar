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
import DateSelector from "./date-selector";
import {SCDateSelector} from "../interfaces";
import SimpleCalendar from "./simple-calendar";
import Year from "./year";
import {DateRangeMatch} from "../constants";
import Month from "./month";
import {Note} from "./note";
import jQuery from "jquery";

// @ts-ignore
global.jQuery = jQuery;


describe('Date Selector Class Tests', () => {

    let ds: DateSelector, y: Year;

    beforeEach(() => {
        DateSelector.RemoveSelector('test');
        ds = DateSelector.GetSelector('test', {showDate: true, showTime: true});
        y = new Year(1);
        // @ts-ignore
        SimpleCalendar.instance = undefined;
    });

    test('Get Selector', () => {
        let newDs = DateSelector.GetSelector('test2', {showDate: true, showTime: true, rangeSelect: true, onDateSelect: () => {}, placeHolderText: 'asd'});
        expect(newDs.id).toBe('test2');
        expect(newDs.range).toBe(true);
        expect(newDs.onDateSelect ).not.toBeNull();
        expect(newDs.placeHolderText ).toBe('asd');
        expect(Object.keys(DateSelector.Selectors).length).toBe(2);

        newDs = DateSelector.GetSelector('test', {showDate: true, showTime: true});
        expect(newDs).toStrictEqual(ds);
    });

    test('Remove Selector', () => {
        expect(Object.keys(DateSelector.Selectors).length).toBe(2);
        DateSelector.RemoveSelector('no');
        expect(Object.keys(DateSelector.Selectors).length).toBe(2);
        DateSelector.RemoveSelector('test2');
        expect(Object.keys(DateSelector.Selectors).length).toBe(1);
    });

    test('Date The Same', () => {
        expect(DateSelector.DateTheSame({year: 1, month: 2, day: 3, allDay: false, hour: 4, minute: 5}, {year: 1, month: 2, day: 3, allDay: false, hour: 4, minute: 5})).toBe(true);
        expect(DateSelector.DateTheSame({year: 1, month: 2, day: 3, allDay: false, hour: 4, minute: 5}, {year: 1, month: 2, day: 3, allDay: false, hour: 5, minute: 5})).toBe(true);
        expect(DateSelector.DateTheSame({year: 1, month: 2, day: 3, allDay: false, hour: 4, minute: 5}, {year: 1, month: 2, day: 3, allDay: false, hour: 4, minute: 6})).toBe(true);
        expect(DateSelector.DateTheSame({year: 1, month: 2, day: 3, allDay: false, hour: 4, minute: 5}, {year: 1, month: 2, day: 3, allDay: true, hour: 4, minute: 5})).toBe(true);
        expect(DateSelector.DateTheSame({year: 1, month: 2, day: 3, allDay: false, hour: 4, minute: 5}, {year: 1, month: 2, day: 4, allDay: false, hour: 4, minute: 5})).toBe(false);
        expect(DateSelector.DateTheSame({year: 1, month: 2, day: 3, allDay: false, hour: 4, minute: 5}, {year: 1, month: 3, day: 3, allDay: false, hour: 4, minute: 5})).toBe(false);
        expect(DateSelector.DateTheSame({year: 1, month: 2, day: 3, allDay: false, hour: 4, minute: 5}, {year: 2, month: 2, day: 3, allDay: false, hour: 4, minute: 5})).toBe(false);
    });

    test('Is Day Between Dates', () => {
        const dateToCheck: SCDateSelector.Date = {
            year: 1,
            month: 1,
            day: 10,
            allDay: true,
            hour: 0,
            minute: 0
        };
        const startDate: SCDateSelector.Date = {
            year: 1,
            month: 1,
            day: 10,
            allDay: true,
            hour: 0,
            minute: 0
        };
        const endDate: SCDateSelector.Date = {
            year: 1,
            month: 1,
            day: 10,
            allDay: true,
            hour: 0,
            minute: 0
        };

        expect(DateSelector.IsDayBetweenDates(dateToCheck, startDate, endDate)).toBe(DateRangeMatch.None);
        SimpleCalendar.instance = new SimpleCalendar();
        expect(DateSelector.IsDayBetweenDates(dateToCheck, startDate, endDate)).toBe(DateRangeMatch.None);
        SimpleCalendar.instance.currentYear = y;
        expect(DateSelector.IsDayBetweenDates(dateToCheck, startDate, endDate)).toBe(DateRangeMatch.Exact);
        y.months.push(new Month('M', 1, 0, 20));
        y.months.push(new Month('T', 2, 0, 20));
        y.months.push(new Month('W', 3, 0, 20));
        expect(DateSelector.IsDayBetweenDates(dateToCheck, startDate, endDate)).toBe(DateRangeMatch.Exact);

        endDate.day = 11;
        expect(DateSelector.IsDayBetweenDates(dateToCheck, startDate, endDate)).toBe(DateRangeMatch.Start);

        startDate.day = 9;
        endDate.day = 10;
        expect(DateSelector.IsDayBetweenDates(dateToCheck, startDate, endDate)).toBe(DateRangeMatch.End);

        endDate.day = 11;
        expect(DateSelector.IsDayBetweenDates(dateToCheck, startDate, endDate)).toBe(DateRangeMatch.Middle);

        endDate.day = 9;
        expect(DateSelector.IsDayBetweenDates(dateToCheck, startDate, endDate)).toBe(DateRangeMatch.None);

        endDate.month = 3;
        endDate.day = 11;
        expect(DateSelector.IsDayBetweenDates(dateToCheck, startDate, endDate)).toBe(DateRangeMatch.Middle);

        dateToCheck.month = 3;
        expect(DateSelector.IsDayBetweenDates(dateToCheck, startDate, endDate)).toBe(DateRangeMatch.Middle);

        dateToCheck.month = 2;
        expect(DateSelector.IsDayBetweenDates(dateToCheck, startDate, endDate)).toBe(DateRangeMatch.Middle);

        endDate.year = 3;
        dateToCheck.month = 3;
        dateToCheck.year = 2;
        expect(DateSelector.IsDayBetweenDates(dateToCheck, startDate, endDate)).toBe(DateRangeMatch.Middle);

        endDate.year = 1;
        expect(DateSelector.IsDayBetweenDates(dateToCheck, startDate, endDate)).toBe(DateRangeMatch.None);

        endDate.year = 3;
        endDate.month = 1;
        expect(DateSelector.IsDayBetweenDates(dateToCheck, startDate, endDate)).toBe(DateRangeMatch.None);
    });

    test('Format Time', () => {
        const dateToCheck: SCDateSelector.Date = {
            year: 1,
            month: 1,
            day: 10,
            allDay: true,
            hour: 0,
            minute: 0
        };

        expect(DateSelector.FormatTime(dateToCheck)).toBe('');
        dateToCheck.allDay = false;
        expect(DateSelector.FormatTime(dateToCheck)).toBe('00:00');
        dateToCheck.hour = 10;
        dateToCheck.minute = 15;
        expect(DateSelector.FormatTime(dateToCheck)).toBe('10:15');
    });

    test('Get Display Date', () => {
        const startDate: SCDateSelector.Date = {
            year: 1,
            month: 1,
            day: 10,
            allDay: true,
            hour: 0,
            minute: 0
        };
        const endDate: SCDateSelector.Date = {
            year: 1,
            month: 1,
            day: 10,
            allDay: true,
            hour: 0,
            minute: 0
        };

        expect(DateSelector.GetDisplayDate(startDate, endDate)).toBe('');
        SimpleCalendar.instance = new SimpleCalendar();
        expect(DateSelector.GetDisplayDate(startDate, endDate)).toBe('');
        SimpleCalendar.instance.currentYear = y;
        expect(DateSelector.GetDisplayDate(startDate, endDate)).toBe(' 10, 1');
        y.months.push(new Month('M', 1, 0, 20));
        y.months.push(new Month('T', 2, 0, 20));
        y.months.push(new Month('W', 3, 0, 20));
        expect(DateSelector.GetDisplayDate(startDate, endDate)).toBe('M 10, 1');
        expect(DateSelector.GetDisplayDate(startDate, endDate, true)).toBe('');

        endDate.day = 12;
        expect(DateSelector.GetDisplayDate(startDate, endDate)).toBe('M 10, 1 - M 12, 1');
        expect(DateSelector.GetDisplayDate(startDate, endDate, true)).toBe('M 10 - M 12');

        startDate.allDay = false;
        startDate.hour = 1;
        startDate.minute = 10;
        endDate.allDay = false;
        endDate.hour = 2;
        endDate.minute = 30;
        expect(DateSelector.GetDisplayDate(startDate, endDate)).toBe('M 10, 1 01:10 - M 12, 1 02:30');

        endDate.day = 10;
        expect(DateSelector.GetDisplayDate(startDate, endDate)).toBe('M 10, 1 01:10 -  02:30');

        endDate.hour = 1;
        endDate.minute = 10;
        expect(DateSelector.GetDisplayDate(startDate, endDate)).toBe('M 10, 1 01:10');
    });

    test('Update Selected Date', () => {
        const n = new Note();
        n.year = 1;
        n.month = 1;
        n.day = 1;
        n.allDay = true;
        n.endDate = {
            year: 1,
            month: 1,
            day: 1
        };

        ds.updateSelectedDate(n);
        expect(ds.addTime).toBe(false);
        expect(ds.selectedDate).toStrictEqual({
            startDate: {
                year: 1,
                month: 1,
                day: 1,
                allDay: true,
                hour: 0,
                minute: 0
            },
            visibleDate: {
                year: 1,
                month: 1,
                day: 1,
                allDay: true,
                hour: 0,
                minute: 0
            },
            endDate: {
                year: 1,
                month: 1,
                day: 1,
                allDay: true,
                hour: 0,
                minute: 0
            }
        });

        n.allDay = false;
        n.hour = 1;
        n.endDate.hour = 2;
        n.endDate.minute = 30;
        ds.updateSelectedDate(n);
        expect(ds.addTime).toBe(true);
        expect(ds.selectedDate).toStrictEqual({
            startDate: {
                year: 1,
                month: 1,
                day: 1,
                allDay: false,
                hour: 1,
                minute: 0
            },
            visibleDate: {
                year: 1,
                month: 1,
                day: 1,
                allDay: false,
                hour: 1,
                minute: 0
            },
            endDate: {
                year: 1,
                month: 1,
                day: 1,
                allDay: false,
                hour: 2,
                minute: 30
            }
        });
    });

    test('Build', () => {
        expect(ds.build()).toBe('');
        SimpleCalendar.instance = new SimpleCalendar();
        expect(ds.build()).toBe('');
        SimpleCalendar.instance.currentYear = y;
        expect(ds.build()).toBe('');
    });

});
