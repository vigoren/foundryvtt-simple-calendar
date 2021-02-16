import Year from "./year";
import Month from "./month";
import {Weekday} from "./weekday";

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
        expect(Object.keys(year).length).toBe(7); //Make sure no new properties have been added
        expect(year.months).toStrictEqual([]);
        expect(year.weekdays).toStrictEqual([]);
        expect(year.prefix).toBe("");
        expect(year.postfix).toBe("");
        expect(year.numericRepresentation).toBe(0);
        expect(year.selectedYear).toBe(0);
        expect(year.visibleYear).toBe(0);
    });

    test('To Template', () => {
        year.weekdays.push(new Weekday(1, 'S'));
        const t = year.toTemplate();
        expect(Object.keys(t).length).toBe(4); //Make sure no new properties have been added
        expect(t.months).toStrictEqual([]);
        expect(t.weekdays).toStrictEqual(year.weekdays.map(w=>w.toTemplate()));
        expect(t.display).toBe("0");
        expect(t.numericRepresentation).toBe(0);

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

    test('Get Months For Template', () => {
        expect(year.getMonthsForTemplate()).toStrictEqual([]);
        year.months.push(month);
        expect(year.getMonthsForTemplate()).toStrictEqual([month.toTemplate()]);
    });

    test('Get Current Month', () => {
        expect(year.getCurrentMonth()).toBeUndefined();
        year.months.push(month);
        year.months[0].current = true;
        expect(year.getCurrentMonth()).toStrictEqual(month);
    });

    test('Get Selected Month', () => {
        expect(year.getSelectedMonth()).toBeUndefined();
        year.months.push(month);
        year.months[0].selected = true;
        expect(year.getSelectedMonth()).toStrictEqual(month);
    });

    test('Get Visible Month', () => {
        expect(year.getVisibleMonth()).toBeUndefined();
        year.months.push(month);
        year.months[0].visible = true;
        expect(year.getVisibleMonth()).toStrictEqual(month);
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
        year.changeMonth(true);
        expect(year.months[0].visible).toBe(false);
        expect(year.months[1].visible).toBe(true);
        year.changeMonth(false);
        expect(year.months[0].visible).toBe(true);
        expect(year.months[1].visible).toBe(false);
        year.changeMonth(false);
        expect(year.months[0].visible).toBe(false);
        expect(year.months[1].visible).toBe(true);
        expect(year.visibleYear).toBe(-1);
        year.changeMonth(true);
        expect(year.months[0].visible).toBe(true);
        expect(year.months[1].visible).toBe(false);
        expect(year.visibleYear).toBe(0);
    });

    test('Change Month Selected', () => {
        year.months.push(month);
        year.months.push(new Month("Test 2", 2, 22));
        year.months[0].selected = true
        year.changeMonth(true, 'selected');
        expect(year.months[0].selected).toBe(false);
        expect(year.months[1].selected).toBe(true);
        year.changeMonth(false, 'selected');
        expect(year.months[0].selected).toBe(true);
        expect(year.months[1].selected).toBe(false);
        year.changeMonth(false, 'selected');
        expect(year.months[0].selected).toBe(false);
        expect(year.months[1].selected).toBe(true);
        expect(year.selectedYear).toBe(-1);
        year.changeMonth(true, 'selected');
        expect(year.months[0].selected).toBe(true);
        expect(year.months[1].selected).toBe(false);
        expect(year.selectedYear).toBe(0);
    });

    test('Change Month Current', () => {
        year.months.push(month);
        year.months.push(new Month("Test 2", 2, 22));
        year.months[0].current = true
        year.changeMonth(true, 'current');
        expect(year.months[0].current).toBe(false);
        expect(year.months[1].current).toBe(true);
        expect(year.months[1].visible).toBe(true);
        year.changeMonth(false, 'current');
        expect(year.months[0].current).toBe(true);
        expect(year.months[0].visible).toBe(true);
        expect(year.months[1].current).toBe(false);
        year.changeMonth(false, 'current');
        expect(year.months[0].current).toBe(false);
        expect(year.months[1].current).toBe(true);
        expect(year.months[1].visible).toBe(true);
        expect(year.numericRepresentation).toBe(-1);
        year.changeMonth(true, 'current');
        expect(year.months[0].current).toBe(true);
        expect(year.months[0].visible).toBe(true);
        expect(year.months[1].current).toBe(false);
        expect(year.numericRepresentation).toBe(0);

        year.months[0].days[0].current = true;
        year.changeMonth(true, 'current');
        expect(year.months[0].current).toBe(false);
        expect(year.months[1].current).toBe(true);
        expect(year.months[1].visible).toBe(true);
        expect(year.months[1].days[0].current).toBe(true);

        year.months[1].days[0].current = false;
        year.months[0].days[29].current = true;
        year.months[0].current = true;
        year.months[1].current = false;
        year.changeMonth(true, 'current');
        expect(year.months[0].current).toBe(false);
        expect(year.months[1].current).toBe(true);
        expect(year.months[1].visible).toBe(true);
        expect(year.months[1].days[21].current).toBe(true);

        year.months[0].current = false;
        year.months[1].current = false;
        year.changeMonth(true, 'current');
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
    });

});
