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
    const mt: MonthTemplate = {selected: false, current: false, visible: false, days: [], display: '', name: '', numericRepresentation: 0, numberOfDays: 0};
    const yt: YearTemplate = {display: '', months: [], numericRepresentation: 0, weekdays: []};
    const ct: CalendarTemplate = {isGM: false, currentYear: yt, visibleMonth: mt, currentMonth: mt, selectedMonth: mt, selectedDay: dt, currentDay: dt, showCurrentDay: false, visibleYear:0, selectedYear:0, showSelectedDay:false, visibleMonthStartWeekday: [], notes: []};


    test('Day Template', () => {
        expect(Object.keys(dt).length).toBe(4); //Make sure no new properties have been added
        expect(dt.selected).toBe(false);
        expect(dt.current).toBe(false);
        expect(dt.name).toBe("");
        expect(dt.numericRepresentation).toBe(0);
    });

    test('Month Template', () => {
        expect(Object.keys(mt).length).toBe(8); //Make sure no new properties have been added
        expect(mt.selected).toBe(false);
        expect(mt.current).toBe(false);
        expect(mt.visible).toBe(false);
        expect(mt.days).toStrictEqual([]);
        expect(mt.display).toBe("");
        expect(mt.name).toBe("");
        expect(mt.numericRepresentation).toBe(0);
        expect(mt.numberOfDays).toBe(0);
    });

    test('Weekday Template', () => {
        expect(wt.firstCharacter).toBe("");
        expect(wt.name).toBe("");
        expect(wt.numericRepresentation).toBe(0);
    });

    test('Year Template', () => {
        expect(Object.keys(yt).length).toBe(4); //Make sure no new properties have been added
        expect(yt.display).toBe('');
        expect(yt.months).toStrictEqual([]);
        expect(yt.weekdays).toStrictEqual([]);
        expect(yt.numericRepresentation).toBe(0);
    });

    test('Calendar Template', () => {
        expect(Object.keys(ct).length).toBe(13); //Make sure no new properties have been added
        expect(ct.isGM).toBe(false);
        expect(ct.selectedYear).toBe(0);
        expect(ct.selectedMonth).toStrictEqual(mt);
        expect(ct.selectedDay).toStrictEqual(dt);
        expect(ct.visibleYear).toBe(0);
        expect(ct.visibleMonth).toStrictEqual(mt);
        expect(ct.visibleMonthStartWeekday).toStrictEqual([]);
        expect(ct.currentYear).toStrictEqual(yt);
        expect(ct.currentMonth).toStrictEqual(mt);
        expect(ct.currentDay).toStrictEqual(dt);
        expect(ct.showSelectedDay).toBe(false);
        expect(ct.showCurrentDay).toBe(false);
        expect(ct.notes).toStrictEqual([]);
    });

    test('Year Config', () => {
        const yc: YearConfig = {postfix: '', prefix: '', numericRepresentation: 0};
        expect(Object.keys(yc).length).toBe(3); //Make sure no new properties have been added
        expect(yc.postfix).toBe('');
        expect(yc.prefix).toBe('');
        expect(yc.numericRepresentation).toBe(0);
    });

    test('Month Config', () => {
        const yc: MonthConfig = {numberOfDays: 0, numericRepresentation: 0, name: ''};
        expect(Object.keys(yc).length).toBe(3); //Make sure no new properties have been added
        expect(yc.name).toBe('');
        expect(yc.numberOfDays).toBe(0);
        expect(yc.numericRepresentation).toBe(0);
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
