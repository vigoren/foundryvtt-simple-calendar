import {
    CalendarTemplate,
    YearTemplate,
    MonthTemplate,
    DayTemplate,
    YearConfig,
    MonthConfig,
    CurrentDateConfig, WeekdayTemplate, WeekdayConfig, NoteConfig, NoteTemplate
} from "./interfaces";

describe('Interface Tests', () => {

    const dt: DayTemplate = {selected: false, current: false, name: '', numericRepresentation: 0};
    const wt: WeekdayTemplate = {firstCharacter:'', name:'', numericRepresentation:0};
    const mt: MonthTemplate = {
        display: '',
        name: '',
        numericRepresentation: 0,
        current: false,
        visible: false,
        selected: false,
        days: [],
        numberOfDays: 0,
        numberOfLeapYearDays: 0,
        intercalary: false,
        intercalaryInclude: false
    };
    const yt: YearTemplate = {
        display: '',
        selectedDisplayYear: '',
        selectedDisplayMonth: '',
        selectedDisplayDay: '',
        numericRepresentation: 0,
        visibleMonth: mt,
        visibleMonthWeekOffset: [],
        weekdays: [wt],
        showWeekdayHeaders: false
    };
    const ct: CalendarTemplate = {
        isGM: false,
        currentYear: yt,
        showSelectedDay: false,
        showCurrentDay: false,
        notes: []
    };


    test('Day Template', () => {
        expect(Object.keys(dt).length).toBe(4); //Make sure no new properties have been added
        expect(dt.selected).toBe(false);
        expect(dt.current).toBe(false);
        expect(dt.name).toBe("");
        expect(dt.numericRepresentation).toBe(0);
    });

    test('Month Template', () => {
        expect(Object.keys(mt).length).toBe(11); //Make sure no new properties have been added
        expect(mt.display).toBe("");
        expect(mt.name).toBe("");
        expect(mt.numericRepresentation).toBe(0);
        expect(mt.selected).toBe(false);
        expect(mt.current).toBe(false);
        expect(mt.visible).toBe(false);
        expect(mt.days).toStrictEqual([]);
        expect(mt.numberOfDays).toBe(0);
        expect(mt.numberOfLeapYearDays).toBe(0);
        expect(mt.intercalary).toBe(false);
        expect(mt.intercalaryInclude).toBe(false);
    });

    test('Weekday Template', () => {
        expect(wt.firstCharacter).toBe("");
        expect(wt.name).toBe("");
        expect(wt.numericRepresentation).toBe(0);
    });

    test('Year Template', () => {
        expect(Object.keys(yt).length).toBe(9); //Make sure no new properties have been added
        expect(yt.display).toBe('');
        expect(yt.selectedDisplayYear).toBe('');
        expect(yt.selectedDisplayMonth).toBe('');
        expect(yt.selectedDisplayDay).toBe('');
        expect(yt.numericRepresentation).toBe(0);
        expect(yt.visibleMonth).toStrictEqual(mt);
        expect(yt.visibleMonthWeekOffset).toStrictEqual([]);
        expect(yt.weekdays).toStrictEqual([wt]);
        expect(yt.showWeekdayHeaders).toStrictEqual(false);
    });

    test('Calendar Template', () => {
        expect(Object.keys(ct).length).toBe(5); //Make sure no new properties have been added
        expect(ct.isGM).toBe(false);
        expect(ct.currentYear).toStrictEqual(yt);
        expect(ct.showSelectedDay).toBe(false);
        expect(ct.showCurrentDay).toBe(false);
        expect(ct.notes).toStrictEqual([]);
    });

    test('Year Config', () => {
        const yc: YearConfig = {postfix: '', prefix: '', numericRepresentation: 0, showWeekdayHeadings: false};
        expect(Object.keys(yc).length).toBe(4); //Make sure no new properties have been added
        expect(yc.postfix).toBe('');
        expect(yc.prefix).toBe('');
        expect(yc.numericRepresentation).toBe(0);
        expect(yc.showWeekdayHeadings).toBe(false);
    });

    test('Month Config', () => {
        const yc: MonthConfig = {numberOfDays: 0, numericRepresentation: 0, name: '',intercalaryInclude: false, intercalary: false, numberOfLeapYearDays: 0};
        expect(Object.keys(yc).length).toBe(6); //Make sure no new properties have been added
        expect(yc.name).toBe('');
        expect(yc.numberOfDays).toBe(0);
        expect(yc.numberOfLeapYearDays).toBe(0);
        expect(yc.numericRepresentation).toBe(0)
        expect(yc.intercalary).toBe(false);
        expect(yc.intercalaryInclude).toBe(false);
    });

    test('Weekday Config', () => {
        const wc: WeekdayConfig = {name: '', numericRepresentation: 0};
        expect(Object.keys(wc).length).toBe(2); //Make sure no new properties have been added
        expect(wc.name).toBe('');
        expect(wc.numericRepresentation).toBe(0);
    });

    test('Current Date Config', () => {
        const yc: CurrentDateConfig = {year: 0, month: 0, day: 0};
        expect(Object.keys(yc).length).toBe(3); //Make sure no new properties have been added
        expect(yc.year).toBe(0);
        expect(yc.month).toBe(0);
        expect(yc.day).toBe(0);
    });

    test('Notes Template', () => {
        const nt: NoteTemplate = {title: '', content: '', author: '', monthDisplay: '', id: ''};
        expect(Object.keys(nt).length).toBe(5); //Make sure no new properties have been added
        expect(nt.title).toBe('');
        expect(nt.content).toBe('');
        expect(nt.author).toBe('');
        expect(nt.monthDisplay).toBe('');
    });

    test('Notes Config', () => {
        const nc: NoteConfig = {year: 0, month:0, day:0, title: '', content: '', author: '', playerVisible: false, monthDisplay: '', id: '', repeats: 0};
        expect(Object.keys(nc).length).toBe(10); //Make sure no new properties have been added
        expect(nc.title).toBe('');
        expect(nc.content).toBe('');
        expect(nc.author).toBe('');
        expect(nc.year).toBe(0);
        expect(nc.month).toBe(0);
        expect(nc.day).toBe(0);
        expect(nc.playerVisible).toBe(false);
        expect(nc.monthDisplay).toBe('');
        expect(nc.id).toBe('');
        expect(nc.repeats).toBe(0);
    });
});
