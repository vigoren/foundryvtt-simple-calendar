import Month from "./month";

describe('Month Class Tests', () => {
    let month: Month;
    let month2: Month;
    let monthLy: Month;
    let monthIc: Month;

    beforeEach(() => {
        month = new Month("Test", 0, 0, 0);
        month2 = new Month("", 0, 0, 30);
        monthLy = new Month("LY", 2, 0, 30, 31);
        monthIc = new Month("IC", -1, 0, 1, 1);
    });

    test('Properties', () => {
        expect(Object.keys(month).length).toBe(12); //Make sure no new properties have been added
        expect(month.days).toStrictEqual([]);
        expect(month.numberOfDays).toBe(0);
        expect(month.numberOfLeapYearDays).toBe(0);
        expect(month.numericRepresentation).toBe(0);
        expect(month.numericRepresentationOffset).toBe(0);
        expect(month.name).toBe('Test');
        expect(month.intercalary).toBe(false);
        expect(month.intercalaryInclude).toBe(false);
        expect(month.current).toBe(false);
        expect(month.selected).toBe(false);
        expect(month.visible).toBe(false);
        expect(month.showAdvanced).toBe(false);

        expect(month2.name).toBe('0');
        expect(month2.days.length).toBe(30);
        expect(month2.numberOfDays).toBe(30);

        const m = new Month("No Days", 0);
        expect(m.days).toStrictEqual([]);
        expect(m.days.length).toBe(0);
        expect(m.numberOfDays).toBe(0);

        expect(monthLy.days.length).toBe(31);
        expect(monthLy.numberOfDays).toBe(30);
        expect(monthLy.numberOfLeapYearDays).toBe(31);
    });

    test('Populate Days', () => {
        month.days = [];
        month.populateDays(10);
        expect(month.days.length).toBe(10);
        month.days = [];
        month.populateDays(10, 2);
        expect(month.days.length).toBe(10);
        expect(month.days[1].current).toBe(true);
    });

    test('Get Display Name', () => {
        expect(month.getDisplayName()).toBe("Test (0)");
        expect(month2.getDisplayName()).toBe("0");
    });

    test('To Template', () => {
        const t = month.toTemplate();
        expect(Object.keys(t).length).toBe(13); //Make sure no new properties have been added
        expect(t.display).toBe('Test (0)');
        expect(t.name).toBe('Test');
        expect(t.numericRepresentation).toBe(0);
        expect(t.numericRepresentationOffset).toBe(0);
        expect(t.current).toBe(false);
        expect(t.selected).toBe(false);
        expect(t.visible).toBe(false);
        expect(t.days).toStrictEqual([]);
        expect(t.numberOfDays).toBe(0);
        expect(t.numberOfLeapYearDays).toBe(0);
        expect(t.intercalary).toBe(false);
        expect(t.intercalaryInclude).toBe(false);
        expect(t.showAdvanced).toBe(false);

        //Intercalary days are represented by negative numbers, the template spits them out as 0
        const t2 = monthIc.toTemplate();
        expect(t2.numericRepresentation).toBe(0);
    });

    test('Clone', () => {
        expect(month.clone()).toStrictEqual(month);
        expect(month2.clone()).toStrictEqual(month2);
        expect(monthLy.clone()).toStrictEqual(monthLy);
        expect(monthIc.clone()).toStrictEqual(monthIc);
    });

    test('Get Current Day', () => {
        month2.days[0].current = true;
        expect(month.getDay()).toBeUndefined();
        expect(month2.getDay()).toStrictEqual(month2.days[0]);

    });

    test('Get Selected Day', () => {
        month2.days[0].selected = true;
        expect(month.getDay('selected')).toBeUndefined();
        expect(month2.getDay('selected')).toStrictEqual(month2.days[0]);

    });

    test('Get Days for Template', () => {
        expect(month.getDaysForTemplate()).toStrictEqual([]);
        expect(month2.getDaysForTemplate().length).toBe(30);
        expect(month2.getDaysForTemplate(true).length).toBe(30);
        expect(monthLy.getDaysForTemplate().length).toBe(30);
        expect(monthLy.getDaysForTemplate(true).length).toBe(31);
        expect(monthIc.getDaysForTemplate().length).toBe(1);

        //We also support getting months where the leap year has less days than a normal month
        monthLy.numberOfDays = 31;
        monthLy.numberOfLeapYearDays = 30;
        expect(monthLy.getDaysForTemplate().length).toBe(31);
        expect(monthLy.getDaysForTemplate(true).length).toBe(30);
    });

    test('Change Day', () => {
        month2.days[0].current = true;
        //Move Forward one day within month
        let changeAmount = month2.changeDay(true);
        expect(month2.days[1].current).toBe(true);
        expect(changeAmount).toBe(0);
        //Move back one day within month
        changeAmount = month2.changeDay(false);
        expect(month2.days[0].current).toBe(true);
        expect(changeAmount).toBe(0);
        //When at first day of month, move back 1 day into previous month
        changeAmount = month2.changeDay(false);
        expect(month2.days[0].current).toBe(false);
        expect(changeAmount).toBe(-1);
        //When at the last day of month move forward 1 day and into next month
        month2.days[29].current = true;
        changeAmount = month2.changeDay(true);
        expect(month2.days[29].current).toBe(false);
        expect(changeAmount).toBe(1);

        month2.days[0].selected = true;
        //Move Forward one day within month
        changeAmount = month2.changeDay(true, false, 'selected');
        expect(month2.days[1].selected).toBe(true);
        expect(changeAmount).toBe(0);
        //Move back one day within month
        changeAmount = month2.changeDay(false, false, 'selected');
        expect(month2.days[0].selected).toBe(true);
        expect(changeAmount).toBe(0);
        //When at first day of month, move back 1 day into previous month
        changeAmount = month2.changeDay(false, false, 'selected');
        expect(month2.days[0].selected).toBe(false);
        expect(changeAmount).toBe(-1);
        //When at the last day of month move forward 1 day and into next month
        month2.days[29].selected = true;
        changeAmount = month2.changeDay(true, false, 'selected');
        expect(month2.days[29].selected).toBe(false);
        expect(changeAmount).toBe(1);

        //Leap Year
        monthLy.days[0].current = true;
        changeAmount = monthLy.changeDay(true);
        expect(monthLy.days[1].current).toBe(true);
        expect(changeAmount).toBe(0);
        monthLy.days[1].current = false;
        //Last day of the month normally
        monthLy.days[29].current = true;
        changeAmount = monthLy.changeDay(true);
        expect(monthLy.days[30].current).toBe(false);
        expect(changeAmount).toBe(1);

        //Last day of the month normally on leap year
        monthLy.days[29].current = true;
        changeAmount = monthLy.changeDay(true, true);
        expect(monthLy.days[29].current).toBe(false);
        expect(monthLy.days[30].current).toBe(true);
        expect(changeAmount).toBe(0);

        //No target day
        monthLy.resetDays();
        changeAmount = monthLy.changeDay(true);
        expect(changeAmount).toBe(1);
    });

    test('Reset Days', () => {
        month2.days[0].current = true;
        month2.days[0].selected = true;
        month2.resetDays();
        expect(month2.days[0].current).toBe(false);
        expect(month2.days[0].selected).toBe(true);
        month2.days[1].selected = true;
        month2.resetDays('selected');
        expect(month2.days[0].selected).toBe(false);
        expect(month2.days[1].selected).toBe(false);
    });

    test('Update Day', () => {
        monthLy.days[0].current = true;
        monthLy.updateDay(1);
        expect(monthLy.days[0].current).toBe(false);
        expect(monthLy.days[1].current).toBe(true);
        monthLy.updateDay(30, false);
        expect(monthLy.days[1].current).toBe(false);
        expect(monthLy.days[29].current).toBe(true);
        monthLy.updateDay(30, true);
        expect(monthLy.days[29].current).toBe(false);
        expect(monthLy.days[30].current).toBe(true);
        monthLy.updateDay(-1, false);
        expect(monthLy.days[30].current).toBe(false);
        expect(monthLy.days[29].current).toBe(true);
        monthLy.updateDay(0, false, 'selected');
        expect(monthLy.days[29].current).toBe(true);
        expect(monthLy.days[0].selected).toBe(true);
    });
});
