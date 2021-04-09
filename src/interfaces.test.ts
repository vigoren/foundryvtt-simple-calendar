import {
    CalendarTemplate,
    CurrentDateConfig,
    DayTemplate,
    FirstNewMoonDate,
    LeapYearConfig,
    MonthConfig,
    MonthTemplate, MoonConfiguration,
    MoonPhase, MoonTemplate,
    NoteConfig,
    NoteTemplate,
    SeasonConfiguration,
    SeasonTemplate,
    SimpleCalendarSocket,
    TimeConfig,
    TimeTemplate,
    WeekdayConfig,
    WeekdayTemplate,
    YearConfig,
    YearTemplate
} from "./interfaces";
import {LeapYearRules, MoonIcons, MoonYearResetOptions, SocketTypes} from "./constants";

describe('Interface Tests', () => {
    const tt: TimeTemplate = {hour: '', minute: '', second: ''};
    const dt: DayTemplate = {selected: false, current: false, name: '', numericRepresentation: 0};
    const wt: WeekdayTemplate = {firstCharacter:'', name:'', numericRepresentation:0};
    const mt: MonthTemplate = {
        display: '',
        name: '',
        numericRepresentation: 0,
        numericRepresentationOffset: 0,
        current: false,
        visible: false,
        selected: false,
        days: [],
        numberOfDays: 0,
        numberOfLeapYearDays: 0,
        intercalary: false,
        intercalaryInclude: false,
        showAdvanced: false
    };
    const yt: YearTemplate = {
        display: '',
        selectedDisplayYear: '',
        selectedDisplayMonth: '',
        selectedDisplayDay: '',
        numericRepresentation: 0,
        visibleMonth: mt,
        weekdays: [wt],
        showWeekdayHeaders: false,
        showClock: false,
        clockClass: '',
        showDateControls: false,
        showTimeControls: false,
        currentTime: tt,
        currentSeasonColor: '',
        currentSeasonName: '',
        weeks: []
    };
    const ct: CalendarTemplate = {
        isGM: false,
        addNotes: false,
        isPrimary: false,
        currentYear: yt,
        showSelectedDay: false,
        showCurrentDay: false,
        notes: [],
        clockClass: '',
        timeUnits: {}
    };


    test('Day Template', () => {
        expect(Object.keys(dt).length).toBe(4); //Make sure no new properties have been added
        expect(dt.selected).toBe(false);
        expect(dt.current).toBe(false);
        expect(dt.name).toBe("");
        expect(dt.numericRepresentation).toBe(0);
    });

    test('Month Template', () => {
        expect(Object.keys(mt).length).toBe(13); //Make sure no new properties have been added
        expect(mt.display).toBe("");
        expect(mt.name).toBe("");
        expect(mt.numericRepresentation).toBe(0);
        expect(mt.numericRepresentationOffset).toBe(0);
        expect(mt.selected).toBe(false);
        expect(mt.current).toBe(false);
        expect(mt.visible).toBe(false);
        expect(mt.days).toStrictEqual([]);
        expect(mt.numberOfDays).toBe(0);
        expect(mt.numberOfLeapYearDays).toBe(0);
        expect(mt.intercalary).toBe(false);
        expect(mt.intercalaryInclude).toBe(false);
        expect(mt.showAdvanced).toBe(false);
    });

    test('Weekday Template', () => {
        expect(wt.firstCharacter).toBe("");
        expect(wt.name).toBe("");
        expect(wt.numericRepresentation).toBe(0);
    });

    test('Year Template', () => {
        expect(Object.keys(yt).length).toBe(16); //Make sure no new properties have been added
        expect(yt.display).toBe('');
        expect(yt.selectedDisplayYear).toBe('');
        expect(yt.selectedDisplayMonth).toBe('');
        expect(yt.selectedDisplayDay).toBe('');
        expect(yt.numericRepresentation).toBe(0);
        expect(yt.visibleMonth).toStrictEqual(mt);
        expect(yt.weeks).toStrictEqual([]);
        expect(yt.weekdays).toStrictEqual([wt]);
        expect(yt.showWeekdayHeaders).toStrictEqual(false);
        expect(yt.showClock).toStrictEqual(false);
        expect(yt.showTimeControls).toStrictEqual(false);
        expect(yt.showDateControls).toStrictEqual(false);
        expect(yt.clockClass).toStrictEqual('');
        expect(yt.currentTime).toStrictEqual(tt);
        expect(yt.currentSeasonName).toStrictEqual('');
        expect(yt.currentSeasonColor).toStrictEqual('');
    });

    test('Calendar Template', () => {
        expect(Object.keys(ct).length).toBe(9); //Make sure no new properties have been added
        expect(ct.isGM).toBe(false);
        expect(ct.addNotes).toBe(false);
        expect(ct.isPrimary).toBe(false);
        expect(ct.currentYear).toStrictEqual(yt);
        expect(ct.showSelectedDay).toBe(false);
        expect(ct.showCurrentDay).toBe(false);
        expect(ct.notes).toStrictEqual([]);
        expect(ct.clockClass).toStrictEqual('');
        expect(ct.timeUnits).toStrictEqual({});
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
        const yc: MonthConfig = {numberOfDays: 0, numericRepresentation: 0, numericRepresentationOffset: 0, name: '',intercalaryInclude: false, intercalary: false, numberOfLeapYearDays: 0};
        expect(Object.keys(yc).length).toBe(7); //Make sure no new properties have been added
        expect(yc.name).toBe('');
        expect(yc.numberOfDays).toBe(0);
        expect(yc.numberOfLeapYearDays).toBe(0);
        expect(yc.numericRepresentation).toBe(0);
        expect(yc.numericRepresentationOffset).toBe(0);
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
        const yc: CurrentDateConfig = {year: 0, month: 0, day: 0, seconds: 0};
        expect(Object.keys(yc).length).toBe(4); //Make sure no new properties have been added
        expect(yc.year).toBe(0);
        expect(yc.month).toBe(0);
        expect(yc.day).toBe(0);
        expect(yc.seconds).toBe(0);
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

    test('Leap Year Config', () => {
        const lyc: LeapYearConfig = {customMod: 0, rule: LeapYearRules.None};
        expect(Object.keys(lyc).length).toBe(2); //Make sure no new properties have been added
        expect(lyc.customMod).toBe(0);
        expect(lyc.rule).toBe(LeapYearRules.None);
    });

    test('Time Configuration', () => {
        const tc: TimeConfig = {gameTimeRatio:1, secondsInMinute: 0, minutesInHour: 0, hoursInDay: 0};
        expect(Object.keys(tc).length).toBe(4); //Make sure no new properties have been added
        expect(tc.gameTimeRatio).toBe(1);
        expect(tc.secondsInMinute).toBe(0);
        expect(tc.minutesInHour).toBe(0);
        expect(tc.hoursInDay).toBe(0);
    });

    test('Time Template', () => {
        expect(Object.keys(tt).length).toBe(3); //Make sure no new properties have been added
        expect(tt.hour).toBe('');
        expect(tt.minute).toBe('');
        expect(tt.second).toBe('');
    });

    test('Season Template', () => {
        const st: SeasonTemplate = {name: '', startingMonth: 1, startingDay: 1, color: '', customColor: '', dayList: []};
        expect(st.name).toBe('');
        expect(st.color).toBe('');
        expect(st.customColor).toBe('');
        expect(st.startingMonth).toBe(1);
        expect(st.startingDay).toBe(1);
        expect(st.dayList).toStrictEqual([]);
    });

    test('Season Configuration', () => {
        const sc: SeasonConfiguration = {name: '', startingMonth: 1, startingDay: 1, color: '', customColor: ''};
        expect(sc.name).toBe('');
        expect(sc.color).toBe('');
        expect(sc.customColor).toBe('');
        expect(sc.startingMonth).toBe(1);
        expect(sc.startingDay).toBe(1);
    });

    test('Moon Phase', () => {
        const mp: MoonPhase = {name: '', length: 1, singleDay: false, icon: MoonIcons.NewMoon};
        expect(mp.name).toBe('');
        expect(mp.length).toBe(1);
        expect(mp.singleDay).toBe(false);
        expect(mp.icon).toBe(MoonIcons.NewMoon);
    });

    test('First New Moon Date', () => {
        const mp: FirstNewMoonDate = {yearReset: MoonYearResetOptions.None, yearX: 0, year: 0, month: 0, day: 0};
        expect(mp.yearReset).toBe(MoonYearResetOptions.None);
        expect(mp.yearX).toBe(0);
        expect(mp.year).toBe(0);
        expect(mp.month).toBe(0);
        expect(mp.day).toBe(0);
    });

    test('Moon Configuration', () => {
        const mp: MoonConfiguration = {name: '', cycleLength: 0, cycleDayAdjust: 0, color: '', phases: [], firstNewMoon: {yearReset: MoonYearResetOptions.None, yearX: 0, year: 0, month: 0, day: 0}};
        expect(mp.name).toBe('');
        expect(mp.cycleLength).toBe(0);
        expect(mp.cycleDayAdjust).toBe(0);
        expect(mp.color).toBe('');
        expect(mp.phases).toStrictEqual([]);
        expect(mp.firstNewMoon).toStrictEqual({yearReset: MoonYearResetOptions.None, yearX: 0, year: 0, month: 0, day: 0});
    });

    test('Moon Template', () => {
        const mp: MoonTemplate = {name: '', cycleLength: 0, cycleDayAdjust: 0, color: '', phases: [], firstNewMoon: {yearReset: MoonYearResetOptions.None, yearX: 0, year: 0, month: 0, day: 0}, dayList: []};
        expect(mp.name).toBe('');
        expect(mp.cycleLength).toBe(0);
        expect(mp.cycleDayAdjust).toBe(0);
        expect(mp.color).toBe('');
        expect(mp.phases).toStrictEqual([]);
        expect(mp.firstNewMoon).toStrictEqual({yearReset: MoonYearResetOptions.None, yearX: 0, year: 0, month: 0, day: 0});
        expect(mp.dayList).toStrictEqual([]);
    });

    describe('Simple Calendar Socket', () => {

        test('Data', () => {
            const d: SimpleCalendarSocket.Data = {data: {}, type: SocketTypes.time};
            expect(Object.keys(d).length).toBe(2); //Make sure no new properties have been added
            expect(d.data).toStrictEqual({});
            expect(d.type).toBe(SocketTypes.time);
        });

        test('Simple Calendar Socket Time', () => {
            const scst: SimpleCalendarSocket.SimpleCalendarSocketTime = {clockClass: ''};
            expect(Object.keys(scst).length).toBe(1); //Make sure no new properties have been added
            expect(scst.clockClass).toBe('');
        });

        test('Simple Calendar Socket Journal', () => {
            const scsj: SimpleCalendarSocket.SimpleCalendarSocketJournal = {notes: []};
            expect(Object.keys(scsj).length).toBe(1); //Make sure no new properties have been added
            expect(scsj.notes).toStrictEqual([]);
        });

        test('Simple Calendar Socket Primary', () => {
            const scsj: SimpleCalendarSocket.SimpleCalendarPrimary = {};
            expect(Object.keys(scsj).length).toBe(0); //Make sure no new properties have been added
        });

    });
});
