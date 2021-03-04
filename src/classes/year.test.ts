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
import Year from "./year";
import Month from "./month";
import {Weekday} from "./weekday";
import {LeapYearRules} from "../constants";
import LeapYear from "./leap-year";

describe('Year Class Tests', () => {
    let year: Year;
    let year2: Year;
    let month: Month;

    beforeEach(() => {
        year = new Year(0);
        month = new Month("Test", 1, 30);
        year2 = new Year(2020);
    });

    test('Properties', () => {
        expect(Object.keys(year).length).toBe(9); //Make sure no new properties have been added
        expect(year.months).toStrictEqual([]);
        expect(year.weekdays).toStrictEqual([]);
        expect(year.prefix).toBe("");
        expect(year.postfix).toBe("");
        expect(year.numericRepresentation).toBe(0);
        expect(year.selectedYear).toBe(0);
        expect(year.visibleYear).toBe(0);
        expect(year.leapYearRule.customMod).toBe(0);
        expect(year.leapYearRule.rule).toBe(LeapYearRules.None);
        expect(year.showWeekdayHeadings).toBe(true);
    });

    test('To Template', () => {
        year.weekdays.push(new Weekday(1, 'S'));
        let t = year.toTemplate();
        expect(Object.keys(t).length).toBe(9); //Make sure no new properties have been added
        expect(t.weekdays).toStrictEqual(year.weekdays.map(w=>w.toTemplate()));
        expect(t.display).toBe("0");
        expect(t.numericRepresentation).toBe(0);
        expect(t.selectedDisplayYear).toBe("0");
        expect(t.selectedDisplayMonth).toBe("");
        expect(t.selectedDisplayDay).toBe("");
        expect(t.visibleMonth).toBeUndefined();
        expect(t.visibleMonthWeekOffset).toStrictEqual([]);
        expect(t.showWeekdayHeaders).toBe(true);

        year.months.push(month);
        year.months[0].current = true;
        t = year.toTemplate();
        expect(t.selectedDisplayMonth).toBe("Test");
        expect(t.selectedDisplayDay).toBe("");
        year.months[0].days[0].current = true;
        t = year.toTemplate();
        expect(t.selectedDisplayDay).toBe("1");

        year.months[0].current = false;
        year.months[0].selected = true;
        year.months[0].days[0].current = false;
        t = year.toTemplate();
        expect(t.selectedDisplayMonth).toBe("Test");
        expect(t.selectedDisplayDay).toBe("");
        year.months[0].days[0].selected = true;
        t = year.toTemplate();
        expect(t.selectedDisplayDay).toBe("1");

        year.months[0].visible = true;
        t = year.toTemplate();
        expect(t.visibleMonth).toStrictEqual(year.months[0].toTemplate());

    });

    test('Clone', () => {
        expect(year.clone()).toStrictEqual(year);
        year2.months.push(month);
        year2.weekdays.push(new Weekday(1, 'S'));
        expect(year2.clone()).toStrictEqual(year2);
    });

    test('Get Display Name', () => {
        expect(year.getDisplayName()).toBe('0');
        year.prefix = 'Pre ';
        year.postfix = ' Post';
        expect(year.getDisplayName()).toBe('Pre 0 Post');
    });

    test('Get Current Month', () => {
        expect(year.getMonth()).toBeUndefined();
        year.months.push(month);
        year.months[0].current = true;
        expect(year.getMonth()).toStrictEqual(month);
    });

    test('Get Selected Month', () => {
        expect(year.getMonth('selected')).toBeUndefined();
        year.months.push(month);
        year.months[0].selected = true;
        expect(year.getMonth('selected')).toStrictEqual(month);
    });

    test('Get Visible Month', () => {
        expect(year.getMonth('visible')).toBeUndefined();
        year.months.push(month);
        year.months[0].visible = true;
        expect(year.getMonth('visible')).toStrictEqual(month);
    });

    test('Reset Months', () => {
        year.months.push(month);
        month.current = true;
        month.selected = true;
        month.visible = true;

        year.resetMonths();
        expect(month.current).toBe(false);
        expect(month.selected).toBe(true);
        expect(month.visible).toBe(true);

        year.resetMonths('selected');
        expect(month.current).toBe(false);
        expect(month.selected).toBe(false);
        expect(month.visible).toBe(true);

        year.resetMonths('visible');
        expect(month.current).toBe(false);
        expect(month.selected).toBe(false);
        expect(month.visible).toBe(false);

    });

    test('Update Month', () => {
        year.months.push(month);
        year.months.push(new Month("Test 2", 2, 22));

        expect(year.months[0].current).toBe(false);
        expect(year.months[1].current).toBe(false);
        year.updateMonth(0, 'current', true);
        expect(year.months[0].current).toBe(true);
        expect(year.months[1].current).toBe(false);
        year.months[1].days[0].current = true;
        year.updateMonth(-1, 'current', true);
        expect(year.months[0].current).toBe(false);
        expect(year.months[1].current).toBe(true);

        year.months.push(new Month("Test 3", -1, 0));
        year.updateMonth(-1, 'current', true);
        expect(year.months[0].current).toBe(true);
        expect(year.months[1].current).toBe(false);

        year.leapYearRule = new LeapYear();
        year.leapYearRule.rule = LeapYearRules.Gregorian;
        year.numericRepresentation = 0;
        year.updateMonth(-1, 'current', false);
        expect(year.months[0].current).toBe(false);
        expect(year.months[1].current).toBe(true);
    });

    test('Change Year Visibility', () => {
        year.months.push(month);
        year.months.push(new Month("Test 2", 2, 22));
        year.months[1].visible = true;
        year.changeYear(1);
        expect(year.visibleYear).toBe(1);
        expect(year.months[1].visible).toBe(false);
        expect(year.months[0].visible).toBe(true);
        year.changeYear(-1);
        expect(year.visibleYear).toBe(0);
        expect(year.months[1].visible).toBe(true);
        expect(year.months[0].visible).toBe(false);
        year.months = [];
        year.changeYear(1);
        expect(year.visibleYear).toBe(1);
    });

    test('Change Year Current', () => {
        year.months.push(month);
        year.months.push(new Month("Test 2", 2, 22));
        year.months[1].current = true;
        year.changeYear(1, true, 'current');
        expect(year.numericRepresentation).toBe(1);
        expect(year.months[1].current).toBe(false);
        expect(year.months[0].current).toBe(true);
        year.changeYear(-1, true, 'current');
        expect(year.numericRepresentation).toBe(0);
        expect(year.months[1].current).toBe(true);
        expect(year.months[0].current).toBe(false);
        year.months = [];
        year.changeYear(1, true, 'current');
        expect(year.numericRepresentation).toBe(1);

        year.months.push(month);
        year.months.push(new Month("Test 2", 2, 22));
        year.changeYear(-1, false, 'current');
        expect(year.numericRepresentation).toBe(0);
        year.months[1].current = true;
        year.changeYear(1, false, 'current');
        expect(year.numericRepresentation).toBe(1);
        expect(year.months[1].current).toBe(true);
        year.months[1].days[0].current = true;
        year.changeYear(-1, false, 'current');
        expect(year.numericRepresentation).toBe(0);
        expect(year.months[1].current).toBe(true);
        expect(year.months[1].days[0].current).toBe(true);
    });

    test('Change Year Selected', () => {
        year.months.push(month);
        year.months.push(new Month("Test 2", 2, 22));
        year.months[1].selected = true;
        year.changeYear(1, true, 'selected');
        expect(year.selectedYear).toBe(1);
        expect(year.months[1].selected).toBe(false);
        expect(year.months[0].selected).toBe(true);
        year.changeYear(-1, true, 'selected');
        expect(year.selectedYear).toBe(0);
        expect(year.months[1].selected).toBe(true);
        expect(year.months[0].selected).toBe(false);
        year.months = [];
        year.changeYear(1, true, 'selected');
        expect(year.selectedYear).toBe(1);
    });

    test('Change Month Visible', () => {
        year.months.push(month);
        year.months.push(new Month("Test 2", 2, 22));
        year.months[0].visible = true
        year.changeMonth(1);
        expect(year.months[0].visible).toBe(false);
        expect(year.months[1].visible).toBe(true);
        year.changeMonth(-1);
        expect(year.months[0].visible).toBe(true);
        expect(year.months[1].visible).toBe(false);
        year.changeMonth(-1);
        expect(year.months[0].visible).toBe(false);
        expect(year.months[1].visible).toBe(true);
        expect(year.visibleYear).toBe(-1);
        year.changeMonth(1);
        expect(year.months[0].visible).toBe(true);
        expect(year.months[1].visible).toBe(false);
        expect(year.visibleYear).toBe(0);
    });

    test('Change Month Selected', () => {
        year.months.push(month);
        year.months.push(new Month("Test 2", 2, 22));
        year.months[0].selected = true
        year.changeMonth(1, 'selected');
        expect(year.months[0].selected).toBe(false);
        expect(year.months[1].selected).toBe(true);
        year.changeMonth(-1, 'selected');
        expect(year.months[0].selected).toBe(true);
        expect(year.months[1].selected).toBe(false);
        year.changeMonth(-1, 'selected');
        expect(year.months[0].selected).toBe(false);
        expect(year.months[1].selected).toBe(true);
        expect(year.selectedYear).toBe(-1);
        year.changeMonth(1, 'selected');
        expect(year.months[0].selected).toBe(true);
        expect(year.months[1].selected).toBe(false);
        expect(year.selectedYear).toBe(0);
    });

    test('Change Month Current', () => {
        year.months.push(month);
        year.months.push(new Month("Test 2", 2, 22));
        year.months[0].current = true
        year.changeMonth(1, 'current');
        expect(year.months[0].current).toBe(false);
        expect(year.months[1].current).toBe(true);
        expect(year.months[1].visible).toBe(true);
        year.changeMonth(-1, 'current');
        expect(year.months[0].current).toBe(true);
        expect(year.months[0].visible).toBe(true);
        expect(year.months[1].current).toBe(false);
        year.changeMonth(-1, 'current');
        expect(year.months[0].current).toBe(false);
        expect(year.months[1].current).toBe(true);
        expect(year.months[1].visible).toBe(true);
        expect(year.numericRepresentation).toBe(-1);
        year.changeMonth(1, 'current');
        expect(year.months[0].current).toBe(true);
        expect(year.months[0].visible).toBe(true);
        expect(year.months[1].current).toBe(false);
        expect(year.numericRepresentation).toBe(0);

        year.months[0].days[0].current = true;
        year.changeMonth(1, 'current');
        expect(year.months[0].current).toBe(false);
        expect(year.months[1].current).toBe(true);
        expect(year.months[1].visible).toBe(true);
        expect(year.months[1].days[0].current).toBe(true);

        year.months[1].days[0].current = false;
        year.months[0].days[29].current = true;
        year.months[0].current = true;
        year.months[1].current = false;
        year.changeMonth(1, 'current');
        expect(year.months[0].current).toBe(false);
        expect(year.months[1].current).toBe(true);
        expect(year.months[1].visible).toBe(true);
        expect(year.months[1].days[21].current).toBe(false);

        year.months[0].current = false;
        year.months[1].current = false;
        year.changeMonth(1, 'current');
        expect(year.months[0].current).toBe(false);
        expect(year.months[1].current).toBe(false);
    });

    test('Change Day Current', () => {
        year.months.push(month);
        year.months.push(new Month("Test 2", 2, 22));
        year.months[0].days[0].current = true;
        year.changeDay(true);
        expect(year.months[0].days[0].current).toBe(true);
        year.months[0].current = true
        year.changeDay(true);
        expect(year.months[0].days[0].current).toBe(false);
        expect(year.months[0].days[1].current).toBe(true);
        year.months[0].days[0].current = true;
        year.months[0].days[1].current = false;
        year.changeDay(false);
        expect(year.months[0].current).toBe(false);
        expect(year.months[1].current).toBe(true);
        expect(year.months[1].days[21].current).toBe(true);
        year.changeDay(true);
        expect(year.months[0].current).toBe(true);
        expect(year.months[1].current).toBe(false);
        expect(year.months[0].days[0].current).toBe(true);
    });

    test('Change Day Selected', () => {
        year.months.push(month);
        year.months.push(new Month("Test 2", 2, 22));
        year.months[0].days[0].selected = true;
        year.changeDay(true, 'selected');
        expect(year.months[0].days[0].selected).toBe(true);
        year.months[0].selected = true
        year.months[0].current = true
        year.changeDay(true, 'selected');
        expect(year.months[0].days[0].selected).toBe(false);
        expect(year.months[0].days[1].selected).toBe(true);
        year.months[0].days[0].selected = true;
        year.months[0].days[1].selected = false;
        year.changeDay(false, 'selected');
        expect(year.months[0].selected).toBe(false);
        expect(year.months[1].selected).toBe(true);
        expect(year.months[1].days[21].selected).toBe(false);
    });

    test('Total Number of Days', () => {
        year.months.push(month);
        expect(year.totalNumberOfDays()).toBe(30);
        year.months.push(new Month("Test 2", 2, 22));
        expect(year.totalNumberOfDays()).toBe(52);

        year.months.push(new Month("Test 3", 3, 2));
        year.months[2].intercalary = true;
        expect(year.totalNumberOfDays()).toBe(52);
        year.months[2].intercalaryInclude = true;
        expect(year.totalNumberOfDays()).toBe(54);

    });

    test('Visible Month Starting Day Of Week', () => {
        year.months.push(month);
        month.visible = true;
        expect(year.visibleMonthStartingDayOfWeek()).toBe(0);
        year.weekdays.push(new Weekday(1, 'S'));
        year.weekdays.push(new Weekday(2, 'M'));
        year.weekdays.push(new Weekday(3, 'T'));
        year.weekdays.push(new Weekday(4, 'W'));
        year.weekdays.push(new Weekday(5, 'T'));
        year.weekdays.push(new Weekday(6, 'F'));
        year.weekdays.push(new Weekday(7, 'S'));
        expect(year.visibleMonthStartingDayOfWeek()).toBe(0);
        month.visible = false;
        year.months.push(new Month("Test 2", 2, 22));
        year.months[1].visible = true;
        expect(year.visibleMonthStartingDayOfWeek()).toBe(2);

        year.months[1].visible = false;
        expect(year.visibleMonthStartingDayOfWeek()).toBe(0);

        year.months.push(new Month("Test 3", 3, 2));
        year.months[2].visible = true;
        year.months[2].intercalary = true;
        expect(year.visibleMonthStartingDayOfWeek()).toBe(0);
    });

    test('Day of the Week', () => {
        year.months.push(month);
        expect(year.dayOfTheWeek(year.numericRepresentation, 1, 1)).toBe(0);
        year.weekdays.push(new Weekday(1, 'S'));
        year.weekdays.push(new Weekday(2, 'M'));
        year.weekdays.push(new Weekday(3, 'T'));
        year.weekdays.push(new Weekday(4, 'W'));
        year.weekdays.push(new Weekday(5, 'T'));
        year.weekdays.push(new Weekday(6, 'F'));
        year.weekdays.push(new Weekday(7, 'S'));
        expect(year.dayOfTheWeek(year.numericRepresentation, 1, 2)).toBe(1);
        expect(year.dayOfTheWeek(year.numericRepresentation, 1, -1)).toBe(0);

        year.months.push(new Month("Test 3", 3, 2));
        year.months.push(new Month("Test 2", 2, 22));
        year.months[1].intercalary = true;
        expect(year.dayOfTheWeek(year.numericRepresentation, 3, 2)).toBe(3);

        year.leapYearRule = new LeapYear();
        year.leapYearRule.rule = LeapYearRules.Gregorian;
        year.numericRepresentation = 4;
        expect(year.dayOfTheWeek(year.numericRepresentation, 3, 2)).toBe(1);
    });

});
