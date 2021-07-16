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
import {DateRangeMatch, LeapYearRules} from "../constants";
import Month from "./month";
import {Note} from "./note";
import {Weekday} from "./weekday";

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
        expect(DateSelector.IsDayBetweenDates(dateToCheck, startDate, endDate)).toBe(DateRangeMatch.None);
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
        expect(DateSelector.IsDayBetweenDates(dateToCheck, startDate, endDate)).toBe(DateRangeMatch.Middle);
    });

    test('Days Between Dates', () => {
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
        expect(DateSelector.DaysBetweenDates(startDate, endDate)).toBe(0);

        SimpleCalendar.instance = new SimpleCalendar();
        SimpleCalendar.instance.currentYear = y;
        y.months.push(new Month('M', 1, 0, 20));
        y.months.push(new Month('T', 2, 0, 20));
        y.months.push(new Month('W', 3, 0, 20));

        expect(DateSelector.DaysBetweenDates(startDate, endDate)).toBe(0);

        endDate.day = 11;
        expect(DateSelector.DaysBetweenDates(startDate, endDate)).toBe(1);

        endDate.day = 12;
        expect(DateSelector.DaysBetweenDates(startDate, endDate)).toBe(2);
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
            day: 1,
            hour: 0,
            minute: 0,
            seconds: 0
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
        expect(ds.build().length).toBeGreaterThan(0);

        y.showWeekdayHeadings = false;
        y.months.push(new Month('M', 1, 0, 20));
        y.months.push(new Month('T', 2, 0, 20));
        y.months.push(new Month('W', 3, 0, 20));
        ds.selectedDate.visibleDate.month = 1;
        expect(ds.build().length).toBe(0);

        y.showWeekdayHeadings = true;
        y.weekdays.push(new Weekday(1, "W1"));
        y.weekdays.push(new Weekday(2, "W2"));
        y.weekdays.push(new Weekday(3, "W3"));
        ds.addTime = true;
        expect(ds.build().length).toBeGreaterThan(0);

        ds.selectedDate.visibleDate.year = 1;
        ds.selectedDate.startDate.year = 1;
        ds.selectedDate.startDate.month = 1;
        ds.selectedDate.startDate.day = 2;
        ds.selectedDate.startDate.hour = 2;
        ds.selectedDate.startDate.minute = 30;
        ds.selectedDate.startDate.allDay = false;
        ds.selectedDate.endDate.year = 1;
        ds.selectedDate.endDate.month = 1;
        ds.selectedDate.endDate.day = 2;
        ds.selectedDate.endDate.hour = 4;
        ds.selectedDate.endDate.minute = 30;
        ds.selectedDate.endDate.allDay = false;
        expect(ds.build().length).toBeGreaterThan(0);

        ds.selectedDate.endDate.year = 1;
        ds.selectedDate.endDate.month = 1;
        ds.selectedDate.endDate.day = 20;
        ds.selectedDate.endDate.minute = 0;
        expect(ds.build().length).toBeGreaterThan(0);

        ds.selectedDate.endDate.minute = 12;
        ds.showDate = false;
        expect(ds.build().length).toBeGreaterThan(0);

        ds.showDate = true;
        ds.showTime = false;
        expect(ds.build(true).length).toBeGreaterThan(0);

        jest.spyOn(document, 'querySelector').mockReturnValueOnce(document.createElement('input'));
        expect(ds.build(true).length).toBeGreaterThan(0);
    });

    test('Update', () => {
        const buildSpy = jest.spyOn(ds, 'build');
        ds.update();
        expect(buildSpy).toHaveBeenCalledTimes(1);

        const docQSSpy = jest.spyOn(document, 'querySelector');
        docQSSpy.mockReturnValueOnce(document.createElement('div'));
        ds.update();
        expect(buildSpy).toHaveBeenCalledTimes(2);

        buildSpy.mockRestore();
        docQSSpy.mockRestore();
    });

    test('Activate Listeners', () => {
        const docQSSpy = jest.spyOn(document, 'querySelector');
        const docAELSpy = jest.spyOn(document, 'addEventListener');

        ds.activateListeners();
        expect(docQSSpy).toHaveBeenCalledTimes(1);

        docQSSpy.mockReturnValue(document.createElement('div'));
        ds.activateListeners();
        expect(docQSSpy).toHaveBeenCalledTimes(2);
        expect(docAELSpy).toHaveBeenCalledTimes(1);

        const fakeWrapper = document.createElement('div');
        const fwqsSpy = jest.spyOn(fakeWrapper, 'querySelector');
        const fwqsaSpy = jest.spyOn(fakeWrapper, 'querySelectorAll');

        const returnedElement = document.createElement('div');
        const reaelSpy = jest.spyOn(returnedElement, 'addEventListener');

        //@ts-ignore
        fwqsaSpy.mockReturnValue([]);

        ds.activateListeners(fakeWrapper);
        expect(docQSSpy).toHaveBeenCalledTimes(2);
        expect(docAELSpy).toHaveBeenCalledTimes(2);
        expect(fwqsSpy).toHaveBeenCalledTimes(6);
        expect(fwqsaSpy).toHaveBeenCalledTimes(4);
        expect(reaelSpy).toHaveBeenCalledTimes(0);

        fwqsSpy.mockReturnValue(returnedElement);
        //@ts-ignore
        fwqsaSpy.mockReturnValue([returnedElement]);
        ds.activateListeners(fakeWrapper);
        expect(docQSSpy).toHaveBeenCalledTimes(2);
        expect(docAELSpy).toHaveBeenCalledTimes(3);
        expect(fwqsSpy).toHaveBeenCalledTimes(12);
        expect(fwqsaSpy).toHaveBeenCalledTimes(8);
        expect(reaelSpy).toHaveBeenCalledTimes(10);

        ds.showTime = false;
        ds.activateListeners(fakeWrapper, true);
        expect(docQSSpy).toHaveBeenCalledTimes(2);
        expect(docAELSpy).toHaveBeenCalledTimes(3);
        expect(fwqsSpy).toHaveBeenCalledTimes(15);
        expect(fwqsaSpy).toHaveBeenCalledTimes(9);
        expect(reaelSpy).toHaveBeenCalledTimes(14);

        ds.showDate = false;
        ds.activateListeners(fakeWrapper);
        expect(docQSSpy).toHaveBeenCalledTimes(2);
        expect(docAELSpy).toHaveBeenCalledTimes(3);
        expect(fwqsSpy).toHaveBeenCalledTimes(15);
        expect(fwqsaSpy).toHaveBeenCalledTimes(9);
        expect(reaelSpy).toHaveBeenCalledTimes(14);

        docQSSpy.mockRestore();
        docAELSpy.mockRestore();
    });

    test('Toggle Calendar', () => {
        const fakeWrapper = document.createElement('div');
        const fwqsSpy = jest.spyOn(fakeWrapper, 'querySelector');
        const returnedElement = document.createElement('div');

        ds.toggleCalendar(fakeWrapper, new Event('click'));
        expect(fwqsSpy).toHaveBeenCalledTimes(1);

        fwqsSpy.mockReturnValue(returnedElement);
        ds.toggleCalendar(fakeWrapper, new Event('click'));
        expect(fwqsSpy).toHaveBeenCalledTimes(2);
        expect(returnedElement.style.display).toBe('none');

        ds.toggleCalendar(fakeWrapper, new Event('click'));
        expect(fwqsSpy).toHaveBeenCalledTimes(3);
        expect(returnedElement.style.display).toBe('block');
    });

    test('Hide Calendar', () => {
        const fakeWrapper = document.createElement('div');
        const fwqsSpy = jest.spyOn(fakeWrapper, 'querySelector');
        const returnedElement = document.createElement('div');
        //@ts-ignore
        jest.spyOn(returnedElement, 'getClientRects').mockReturnValue([1]);

        ds.hideCalendar(fakeWrapper);
        expect(fwqsSpy).toHaveBeenCalledTimes(1);

        fwqsSpy.mockReturnValue(returnedElement);
        ds.hideCalendar(fakeWrapper);
        expect(fwqsSpy).toHaveBeenCalledTimes(2);
        expect(returnedElement.style.display).toBe('none');

        ds.onDateSelect = jest.fn();
        ds.hideCalendar(fakeWrapper);
        expect(fwqsSpy).toHaveBeenCalledTimes(3);
        expect(ds.onDateSelect).toHaveBeenCalledTimes(1);
    });

    test('Calendar Click', () => {
        const docGEBISpy = jest.spyOn(document, 'getElementById');
        const returnedElement = document.createElement('div');
        const ddElement = document.createElement('div');
        const reGEBCNSpy = jest.spyOn(returnedElement, 'getElementsByClassName');
        //@ts-ignore
        reGEBCNSpy.mockReturnValue([ddElement]);

        ds.calendarClick(new Event('click'));
        expect(docGEBISpy).toHaveBeenCalledTimes(1);

        docGEBISpy.mockReturnValue(returnedElement);
        ds.calendarClick(new Event('click'));
        expect(docGEBISpy).toHaveBeenCalledTimes(2);
        expect(reGEBCNSpy).toHaveBeenCalledTimes(1);
        expect(ddElement.classList.contains('hide')).toBe(true);

        docGEBISpy.mockRestore()
    });

    test('Day Click', () => {
        const html = document.createElement('div');
        const event = new Event('click');
        const htmlQSSpy = jest.spyOn(html, "querySelector");

        const updateSpy = jest.spyOn(ds, "update").mockImplementation();
        const hideCalendarSpy = jest.spyOn(ds, "hideCalendar").mockImplementation();

        ds.dayClick(html ,event);
        expect(htmlQSSpy).toHaveBeenCalledTimes(1);

        const currentMonthYear = document.createElement('div');
        htmlQSSpy.mockReturnValue(currentMonthYear);
        (<HTMLElement>event.target).setAttribute('data-day', 'a');
        ds.dayClick(html ,event);
        expect(htmlQSSpy).toHaveBeenCalledTimes(2);


        currentMonthYear.setAttribute('data-visible','a');
        ds.dayClick(html ,event);
        expect(htmlQSSpy).toHaveBeenCalledTimes(3);

        currentMonthYear.setAttribute('data-visible','a/b');
        ds.dayClick(html ,event);
        expect(htmlQSSpy).toHaveBeenCalledTimes(4);

        currentMonthYear.setAttribute('data-visible','1/1');
        (<HTMLElement>event.target).setAttribute('data-day', '1');
        ds.dayClick(html ,event);
        expect(htmlQSSpy).toHaveBeenCalledTimes(5);
        expect(updateSpy).toHaveBeenCalledTimes(1);
        expect(hideCalendarSpy).toHaveBeenCalledTimes(1);

        ds.range = true;
        ds.dayClick(html ,event);
        expect(htmlQSSpy).toHaveBeenCalledTimes(6);
        expect(updateSpy).toHaveBeenCalledTimes(2);
        expect(hideCalendarSpy).toHaveBeenCalledTimes(1);
        expect(ds.selectedDate.startDate.year).toBe(1);
        expect(ds.selectedDate.startDate.month).toBe(1);
        expect(ds.selectedDate.startDate.day).toBe(1);

        (<HTMLElement>event.target).setAttribute('data-day', '3');
        ds.dayClick(html ,event);
        expect(htmlQSSpy).toHaveBeenCalledTimes(7);
        expect(updateSpy).toHaveBeenCalledTimes(3);
        expect(hideCalendarSpy).toHaveBeenCalledTimes(2);
        expect(ds.selectedDate.endDate.year).toBe(1);
        expect(ds.selectedDate.endDate.month).toBe(1);
        expect(ds.selectedDate.endDate.day).toBe(3);

        SimpleCalendar.instance = new SimpleCalendar();
        SimpleCalendar.instance.currentYear = y;
        y.months.push(new Month('M', 1, 0, 20));
        y.months.push(new Month('T', 2, 0, 20));
        y.months.push(new Month('W', 3, 0, 20));

        ds.secondDaySelect = true;
        ds.dayClick(html ,event);
        expect(htmlQSSpy).toHaveBeenCalledTimes(8);
        expect(updateSpy).toHaveBeenCalledTimes(4);
        expect(hideCalendarSpy).toHaveBeenCalledTimes(3);
        expect(ds.selectedDate.endDate.year).toBe(1);
        expect(ds.selectedDate.endDate.month).toBe(1);
        expect(ds.selectedDate.endDate.day).toBe(3);

        currentMonthYear.setAttribute('data-visible','12/1');
        ds.secondDaySelect = true;
        ds.selectedDate.startDate.month = 12;
        ds.dayClick(html ,event);
        expect(htmlQSSpy).toHaveBeenCalledTimes(9);
        expect(updateSpy).toHaveBeenCalledTimes(5);
        expect(hideCalendarSpy).toHaveBeenCalledTimes(4);
        expect(ds.selectedDate.endDate.year).toBe(1);
        expect(ds.selectedDate.endDate.month).toBe(12);
        expect(ds.selectedDate.endDate.day).toBe(3);

        currentMonthYear.setAttribute('data-visible','1/1');
        ds.secondDaySelect = true;
        ds.selectedDate.startDate.month = 1;
        ds.selectedDate.startDate.day = 12;
        ds.dayClick(html ,event);
        expect(htmlQSSpy).toHaveBeenCalledTimes(10);
        expect(updateSpy).toHaveBeenCalledTimes(6);
        expect(hideCalendarSpy).toHaveBeenCalledTimes(5);
        expect(ds.selectedDate.endDate.year).toBe(1);
        expect(ds.selectedDate.endDate.month).toBe(1);
        expect(ds.selectedDate.endDate.day).toBe(12);

        ds.secondDaySelect = true;
        ds.selectedDate.startDate.month = 3;
        ds.selectedDate.startDate.day = 12;
        ds.dayClick(html ,event);
        expect(htmlQSSpy).toHaveBeenCalledTimes(11);
        expect(updateSpy).toHaveBeenCalledTimes(7);
        expect(hideCalendarSpy).toHaveBeenCalledTimes(6);
        expect(ds.selectedDate.endDate.year).toBe(1);
        expect(ds.selectedDate.endDate.month).toBe(3);
        expect(ds.selectedDate.endDate.day).toBe(12);
    });

    test('Next Click', () => {
        const changeSpy = jest.spyOn(ds, 'changeMonth').mockImplementation();
        ds.nextClick(new Event('click'));
        expect(changeSpy).toHaveBeenCalledTimes(1);
    });

    test('Prev Click', () => {
        const changeSpy = jest.spyOn(ds, 'changeMonth').mockImplementation();
        ds.prevClick(new Event('click'));
        expect(changeSpy).toHaveBeenCalledTimes(1);
    });

    test('Change Month', () => {
        const updateSpy = jest.spyOn(ds, "update").mockImplementation();
        ds.changeMonth(true);
        expect(updateSpy).not.toHaveBeenCalled();

        SimpleCalendar.instance = new SimpleCalendar();
        SimpleCalendar.instance.currentYear = y;
        y.months.push(new Month('M', 1, 0, 20));
        y.months.push(new Month('T', 2, 0, 20));
        y.months.push(new Month('W', 3, 0, 20));

        ds.changeMonth(true);
        expect(updateSpy).toHaveBeenCalledTimes(1);

        ds.selectedDate.visibleDate.month = 1;
        ds.changeMonth(true);
        expect(updateSpy).toHaveBeenCalledTimes(2);
        expect(ds.selectedDate.visibleDate.month).toBe(2);

        ds.changeMonth(true);
        expect(updateSpy).toHaveBeenCalledTimes(3);
        expect(ds.selectedDate.visibleDate.month).toBe(3);

        ds.changeMonth(true);
        expect(updateSpy).toHaveBeenCalledTimes(4);
        expect(ds.selectedDate.visibleDate.month).toBe(1);
        expect(ds.selectedDate.visibleDate.year).toBe(1);

        ds.changeMonth(false);
        expect(updateSpy).toHaveBeenCalledTimes(5);
        expect(ds.selectedDate.visibleDate.month).toBe(3);
        expect(ds.selectedDate.visibleDate.year).toBe(0);

        ds.changeMonth(false);
        expect(updateSpy).toHaveBeenCalledTimes(6);
        expect(ds.selectedDate.visibleDate.month).toBe(2);

        ds.changeMonth(false);
        expect(updateSpy).toHaveBeenCalledTimes(7);
        expect(ds.selectedDate.visibleDate.month).toBe(1);

        y.leapYearRule.rule = LeapYearRules.Custom;
        y.leapYearRule.customMod = 2;
        ds.selectedDate.visibleDate.year = 2;
        y.months[1].numberOfLeapYearDays = 0;

        ds.changeMonth(true);
        expect(updateSpy).toHaveBeenCalledTimes(8);
        expect(ds.selectedDate.visibleDate.month).toBe(3);
    });

    test('Add Time Click', () => {
        const updateSpy = jest.spyOn(ds, 'update').mockImplementation();
        ds.addTimeClick(new Event('click'));
        expect(ds.addTime).toBe(true);
        expect(updateSpy).toHaveBeenCalledTimes(1);
    });

    test('Remove Time Click', () => {
        const updateSpy = jest.spyOn(ds, 'update').mockImplementation();
        ds.removeTimeClick(new Event('click'));
        expect(ds.addTime).toBe(false);
        expect(updateSpy).toHaveBeenCalledTimes(1);
    });

    test('Time Click', () => {
        const calendarClickSpy = jest.spyOn(ds, "calendarClick").mockImplementation();
        const event = new Event('click');

        ds.timeClick(event);
        expect(calendarClickSpy).toHaveBeenCalledTimes(1);

        const par = document.createElement('div');
        par.appendChild(<HTMLElement>event.currentTarget);
        ds.timeClick(event);
        expect(calendarClickSpy).toHaveBeenCalledTimes(2);

        const dd = document.createElement('div');
        //@ts-ignore
        const parSpy = jest.spyOn(par, 'getElementsByClassName').mockReturnValue([dd]);
        ds.timeClick(event);
        expect(calendarClickSpy).toHaveBeenCalledTimes(3);
        expect(dd.classList.contains('hide')).toBe(false);
    });

    test('Time Dropdown Click', () => {
        const event = new Event('click');

        ds.timeDropdownClick(event);

        const ctParent = document.createElement('div');
        ctParent.appendChild(<HTMLElement>event.currentTarget);
        (<HTMLElement>event.currentTarget).setAttribute('data-hour', 'a');
        (<HTMLElement>event.currentTarget).setAttribute('data-minute', 'a');
        ds.timeDropdownClick(event);

        const ctParentParent = document.createElement('div');
        ctParentParent.appendChild(ctParent);
        (<HTMLElement>event.currentTarget).setAttribute('data-hour', '1');
        (<HTMLElement>event.currentTarget).setAttribute('data-minute', '2');
        ds.timeDropdownClick(event);

        const input = document.createElement('input');
        //@ts-ignore
        const ctppSpy = jest.spyOn(ctParentParent, 'getElementsByTagName').mockReturnValue([input]);
        const inputSPy = jest.spyOn(input, "dispatchEvent").mockImplementation();
        ds.timeDropdownClick(event);
        expect(input.value).toBe('1:2');
        expect(inputSPy).toHaveBeenCalled();
    });

    test('Time Update', () => {
        const event = new Event('change');
        const updateSpy = jest.spyOn(ds, 'update').mockImplementation();
        (<HTMLInputElement>event.currentTarget).value = '';

        ds.timeUpdate(event);
        expect(updateSpy).not.toHaveBeenCalled();

        (<HTMLInputElement>event.currentTarget).value = 'a:a';
        ds.timeUpdate(event);
        expect(updateSpy).not.toHaveBeenCalled();

        (<HTMLInputElement>event.currentTarget).value = '1:2';
        ds.timeUpdate(event);
        expect(updateSpy).not.toHaveBeenCalled();

        SimpleCalendar.instance = new SimpleCalendar();
        SimpleCalendar.instance.currentYear = y;
        ds.timeUpdate(event);
        expect(updateSpy).toHaveBeenCalledTimes(1);

        (<HTMLInputElement>event.currentTarget).value = '24:60';
        (<HTMLInputElement>event.currentTarget).setAttribute('class', 'start-time');
        ds.timeUpdate(event);
        expect(updateSpy).toHaveBeenCalledTimes(2);

        (<HTMLInputElement>event.currentTarget).value = '-1:-1';
        ds.selectedDate.endDate.hour = 0;
        ds.timeUpdate(event);
        expect(updateSpy).toHaveBeenCalledTimes(3);

        (<HTMLInputElement>event.currentTarget).value = '1:0';
        ds.selectedDate.endDate.hour = 0;
        ds.selectedDate.endDate.minute = 0;
        ds.timeUpdate(event);
        expect(updateSpy).toHaveBeenCalledTimes(4);

        (<HTMLInputElement>event.currentTarget).value = '-1:-1';
        ds.selectedDate.endDate.hour = 10;
        ds.timeUpdate(event);
        expect(updateSpy).toHaveBeenCalledTimes(5);

        (<HTMLInputElement>event.currentTarget).value = '24:60';
        ds.selectedDate.endDate.hour = 0;
        ds.timeUpdate(event);
        expect(updateSpy).toHaveBeenCalledTimes(6);

        (<HTMLInputElement>event.currentTarget).setAttribute('class', 'end-time');
        (<HTMLInputElement>event.currentTarget).value = '-1:-1';
        ds.selectedDate.startDate.minute = 59;
        ds.timeUpdate(event);
        expect(updateSpy).toHaveBeenCalledTimes(7);
        expect(ds.selectedDate.endDate.hour).toBe(23);
        expect(ds.selectedDate.endDate.minute).toBe(59);

        ds.selectedDate.startDate.minute = 0;
        ds.timeUpdate(event);
        expect(updateSpy).toHaveBeenCalledTimes(8);
        expect(ds.selectedDate.endDate.hour).toBe(23);
        expect(ds.selectedDate.endDate.minute).toBe(0);

        (<HTMLInputElement>event.currentTarget).value = '1:1';
        ds.selectedDate.startDate.hour = 0;
        ds.timeUpdate(event);
        expect(updateSpy).toHaveBeenCalledTimes(9);
        expect(ds.selectedDate.endDate.hour).toBe(1);
        expect(ds.selectedDate.endDate.minute).toBe(1);

        ds.selectedDate.startDate.hour = 10;
        ds.selectedDate.endDate.day = 10;
        ds.timeUpdate(event);
        expect(updateSpy).toHaveBeenCalledTimes(10);
        expect(ds.selectedDate.endDate.hour).toBe(1);
        expect(ds.selectedDate.endDate.minute).toBe(1);
    });
});
