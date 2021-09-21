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
import "../../__mocks__/crypto";

import Utilities from "./utilities";
import {DateTimeParts, SCDateSelector} from "../interfaces";
import {DateRangeMatch, MoonIcons} from "../constants";
import SimpleCalendar from "./simple-calendar";
import Month from "./month";
import Year from "./year";

describe('Utilities Class Tests', () => {

    let y: Year;

    beforeEach(() => {
        y = new Year(1);
    });

    test('Generate Unique Id', () => {
        expect(Utilities.generateUniqueId()).toBeDefined();
    });

    test('Random Hash', () => {
        expect(Utilities.randomHash('')).toBe(0);
        expect(Utilities.randomHash('asd')).not.toBe(0);
    });

    test('Ordinal Suffix', () => {
        const orig = (<Game>game).i18n.localize;
        (<Game>game).i18n.localize = jest.fn((a: string) => {
            switch (a){
                case 'FSC.OrdinalSuffix.st':
                    return 'st';
                case 'FSC.OrdinalSuffix.nd':
                    return 'nd';
                case 'FSC.OrdinalSuffix.rd':
                    return 'rd';
                default:
                    return 'th';
            }
        })

        expect(Utilities.ordinalSuffix(0)).toBe('th');
        expect(Utilities.ordinalSuffix(1)).toBe('st');
        expect(Utilities.ordinalSuffix(2)).toBe('nd');
        expect(Utilities.ordinalSuffix(3)).toBe('rd');
        expect(Utilities.ordinalSuffix(4)).toBe('th');
        expect(Utilities.ordinalSuffix(5)).toBe('th');
        expect(Utilities.ordinalSuffix(6)).toBe('th');
        expect(Utilities.ordinalSuffix(7)).toBe('th');
        expect(Utilities.ordinalSuffix(8)).toBe('th');
        expect(Utilities.ordinalSuffix(9)).toBe('th');
        expect(Utilities.ordinalSuffix(10)).toBe('th');
        expect(Utilities.ordinalSuffix(11)).toBe('th');
        expect(Utilities.ordinalSuffix(12)).toBe('th');
        expect(Utilities.ordinalSuffix(13)).toBe('th');
        expect(Utilities.ordinalSuffix(14)).toBe('th');
        expect(Utilities.ordinalSuffix(21)).toBe('st');
        expect(Utilities.ordinalSuffix(22)).toBe('nd');
        expect(Utilities.ordinalSuffix(23)).toBe('rd');
        expect(Utilities.ordinalSuffix(111)).toBe('th');
        expect(Utilities.ordinalSuffix(112)).toBe('th');
        expect(Utilities.ordinalSuffix(113)).toBe('th');

        (<Game>game).i18n.localize = orig;
    });

    test('Get Contrast Color', () => {
        expect(Utilities.GetContrastColor('#ffffff')).toBe('#000000');
        expect(Utilities.GetContrastColor('#000000')).toBe('#FFFFFF');
        expect(Utilities.GetContrastColor('#000')).toBe('#FFFFFF');
        expect(Utilities.GetContrastColor('ffffff')).toBe('#000000');
        expect(Utilities.GetContrastColor('fffff')).toBe('#000000');
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
        expect(Utilities.FormatTime(dateToCheck.hour, dateToCheck.minute, false)).toBe('00:00');
        dateToCheck.hour = 10;
        dateToCheck.minute = 15;
        expect(Utilities.FormatTime(dateToCheck.hour, dateToCheck.minute, false)).toBe('10:15');
        expect(Utilities.FormatTime(dateToCheck.hour, dateToCheck.minute, 0)).toBe('10:15:00');
        expect(Utilities.FormatTime(dateToCheck.hour, dateToCheck.minute, 12)).toBe('10:15:12');
    });

    test('Get Moon Phase Icon', () => {
        //@ts-ignore
        expect(Utilities.GetMoonPhaseIcon()).toBe('');
        expect(Utilities.GetMoonPhaseIcon(MoonIcons.FirstQuarter, '#ffffff')).toBeDefined();
        expect(Utilities.GetMoonPhaseIcon(MoonIcons.Full, '#ffffff')).toBeDefined();
        expect(Utilities.GetMoonPhaseIcon(MoonIcons.LastQuarter, '#ffffff')).toBeDefined();
        expect(Utilities.GetMoonPhaseIcon(MoonIcons.NewMoon, '#ffffff')).toBeDefined();
        expect(Utilities.GetMoonPhaseIcon(MoonIcons.WaningCrescent, '#ffffff')).toBeDefined();
        expect(Utilities.GetMoonPhaseIcon(MoonIcons.WaningGibbous, '#ffffff')).toBeDefined();
        expect(Utilities.GetMoonPhaseIcon(MoonIcons.WaxingCrescent, '#ffffff')).toBeDefined();
        expect(Utilities.GetMoonPhaseIcon(MoonIcons.WaxingGibbous, '#ffffff')).toBeDefined();
    });

    test('Date The Same', () => {
        expect(Utilities.DateTheSame({year: 1, month: 2, day: 3, allDay: false, hour: 4, minute: 5}, {year: 1, month: 2, day: 3, allDay: false, hour: 4, minute: 5})).toBe(true);
        expect(Utilities.DateTheSame({year: 1, month: 2, day: 3, allDay: false, hour: 4, minute: 5}, {year: 1, month: 2, day: 3, allDay: false, hour: 5, minute: 5})).toBe(true);
        expect(Utilities.DateTheSame({year: 1, month: 2, day: 3, allDay: false, hour: 4, minute: 5}, {year: 1, month: 2, day: 3, allDay: false, hour: 4, minute: 6})).toBe(true);
        expect(Utilities.DateTheSame({year: 1, month: 2, day: 3, allDay: false, hour: 4, minute: 5}, {year: 1, month: 2, day: 3, allDay: true, hour: 4, minute: 5})).toBe(true);
        expect(Utilities.DateTheSame({year: 1, month: 2, day: 3, allDay: false, hour: 4, minute: 5}, {year: 1, month: 2, day: 4, allDay: false, hour: 4, minute: 5})).toBe(false);
        expect(Utilities.DateTheSame({year: 1, month: 2, day: 3, allDay: false, hour: 4, minute: 5}, {year: 1, month: 3, day: 3, allDay: false, hour: 4, minute: 5})).toBe(false);
        expect(Utilities.DateTheSame({year: 1, month: 2, day: 3, allDay: false, hour: 4, minute: 5}, {year: 2, month: 2, day: 3, allDay: false, hour: 4, minute: 5})).toBe(false);
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

        SimpleCalendar.instance = new SimpleCalendar();
        SimpleCalendar.instance.activeCalendar.year = y;
        expect(Utilities.IsDayBetweenDates(dateToCheck, startDate, endDate)).toBe(DateRangeMatch.None);
        y.months.push(new Month('M', 1, 0, 20));
        y.months.push(new Month('T', 2, 0, 20));
        y.months.push(new Month('W', 3, 0, 20));
        expect(Utilities.IsDayBetweenDates(dateToCheck, startDate, endDate)).toBe(DateRangeMatch.Exact);

        endDate.day = 11;
        expect(Utilities.IsDayBetweenDates(dateToCheck, startDate, endDate)).toBe(DateRangeMatch.Start);

        startDate.day = 9;
        endDate.day = 10;
        expect(Utilities.IsDayBetweenDates(dateToCheck, startDate, endDate)).toBe(DateRangeMatch.End);

        endDate.day = 11;
        expect(Utilities.IsDayBetweenDates(dateToCheck, startDate, endDate)).toBe(DateRangeMatch.Middle);

        endDate.day = 9;
        expect(Utilities.IsDayBetweenDates(dateToCheck, startDate, endDate)).toBe(DateRangeMatch.None);

        endDate.month = 3;
        endDate.day = 11;
        expect(Utilities.IsDayBetweenDates(dateToCheck, startDate, endDate)).toBe(DateRangeMatch.Middle);

        dateToCheck.month = 3;
        expect(Utilities.IsDayBetweenDates(dateToCheck, startDate, endDate)).toBe(DateRangeMatch.Middle);

        dateToCheck.month = 2;
        expect(Utilities.IsDayBetweenDates(dateToCheck, startDate, endDate)).toBe(DateRangeMatch.Middle);

        endDate.year = 3;
        dateToCheck.month = 3;
        dateToCheck.year = 2;
        expect(Utilities.IsDayBetweenDates(dateToCheck, startDate, endDate)).toBe(DateRangeMatch.Middle);

        endDate.year = 1;
        expect(Utilities.IsDayBetweenDates(dateToCheck, startDate, endDate)).toBe(DateRangeMatch.None);

        endDate.year = 3;
        endDate.month = 1;
        expect(Utilities.IsDayBetweenDates(dateToCheck, startDate, endDate)).toBe(DateRangeMatch.Middle);
    });

    test('Days Between Dates', () => {
        const startDate: DateTimeParts = {
            year: 1,
            month: 1,
            day: 10,
            hour: 0,
            minute: 0,
            seconds: 0
        };
        const endDate: DateTimeParts = {
            year: 1,
            month: 1,
            day: 10,
            hour: 0,
            minute: 0,
            seconds: 0
        };

        SimpleCalendar.instance = new SimpleCalendar();
        SimpleCalendar.instance.activeCalendar.year = y;
        y.months.push(new Month('M', 1, 0, 20));
        y.months.push(new Month('T', 2, 0, 20));
        y.months.push(new Month('W', 3, 0, 20));

        expect(Utilities.DaysBetweenDates(startDate, endDate)).toBe(0);

        endDate.day = 11;
        expect(Utilities.DaysBetweenDates(startDate, endDate)).toBe(1);

        endDate.day = 12;
        expect(Utilities.DaysBetweenDates(startDate, endDate)).toBe(2);
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

        SimpleCalendar.instance = new SimpleCalendar();
        SimpleCalendar.instance.activeCalendar.year = y;
        expect(Utilities.GetDisplayDate(startDate, endDate)).toBe(' 10, 1');
        y.months.push(new Month('M', 1, 0, 20));
        y.months.push(new Month('T', 2, 0, 20));
        y.months.push(new Month('W', 3, 0, 20));
        expect(Utilities.GetDisplayDate(startDate, endDate)).toBe('M 10, 1');
        expect(Utilities.GetDisplayDate(startDate, endDate, true)).toBe('');

        endDate.day = 12;
        expect(Utilities.GetDisplayDate(startDate, endDate)).toBe('M 10, 1 - M 12, 1');
        expect(Utilities.GetDisplayDate(startDate, endDate, true)).toBe('M 10 - M 12');

        startDate.allDay = false;
        startDate.hour = 1;
        startDate.minute = 10;
        endDate.allDay = false;
        endDate.hour = 2;
        endDate.minute = 30;
        expect(Utilities.GetDisplayDate(startDate, endDate)).toBe('M 10, 1 01:10 - M 12, 1 02:30');

        endDate.day = 10;
        expect(Utilities.GetDisplayDate(startDate, endDate)).toBe('M 10, 1 01:10 -  02:30');

        endDate.hour = 1;
        endDate.minute = 10;
        expect(Utilities.GetDisplayDate(startDate, endDate)).toBe('M 10, 1 01:10');
        expect(Utilities.GetDisplayDate(startDate, endDate, false, false)).toBe('M 10 01:10');
    });
});
