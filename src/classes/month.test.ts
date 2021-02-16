import Month from "./month";

describe('Month Class Tests', () => {
    let month: Month;
    let month2: Month;

    beforeEach(() => {
        month = new Month("Test", 0, 0);
        month2 = new Month("", 0, 30);
    });

    test('Properties', () => {
        expect(Object.keys(month).length).toBe(7); //Make sure no new properties have been added
        expect(month.days).toStrictEqual([]);
        expect(month.numberOfDays).toBe(0);
        expect(month.name).toBe('Test');
        expect(month.numericRepresentation).toBe(0);
        expect(month.current).toBe(false);
        expect(month.selected).toBe(false);
        expect(month.visible).toBe(false);

        expect(month2.name).toBe('0');
        expect(month2.days.length).toBe(30);
        expect(month2.numberOfDays).toBe(30);

        const m = new Month("No Days", 0);
        expect(m.days).toStrictEqual([]);
        expect(m.days.length).toBe(0);
        expect(m.numberOfDays).toBe(0);
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
        expect(Object.keys(t).length).toBe(8); //Make sure no new properties have been added
        expect(t.days).toStrictEqual([]);
        expect(t.numberOfDays).toBe(0);
        expect(t.display).toBe('Test (0)');
        expect(t.name).toBe('Test');
        expect(t.numericRepresentation).toBe(0);
        expect(t.current).toBe(false);
        expect(t.selected).toBe(false);
        expect(t.visible).toBe(false);
    });

    test('Clone', () => {
        expect(month.clone()).toStrictEqual(month);
        expect(month2.clone()).toStrictEqual(month2);
    });

    test('Get Current Day', () => {
        month2.days[0].current = true;
        expect(month.getCurrentDay()).toBeUndefined();
        expect(month2.getCurrentDay()).toStrictEqual(month2.days[0]);

    });

    test('Get Selected Day', () => {
        month2.days[0].selected = true;
        expect(month.getSelectedDay()).toBeUndefined();
        expect(month2.getSelectedDay()).toStrictEqual(month2.days[0]);

    });

    test('Get Days for Template', () => {
        expect(month.getDaysForTemplate()).toStrictEqual([]);
        expect(month2.getDaysForTemplate().length).toBe(30);

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
    });
});
