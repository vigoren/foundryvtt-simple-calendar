import {
    CalendarTemplate,
    CurrentDateConfig,
    DayTemplate,
    FirstNewMoonDate,
    LeapYearConfig,
    MonthConfig,
    MonthTemplate,
    MoonConfiguration,
    MoonPhase,
    MoonTemplate,
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
import {
    GameSystems,
    LeapYearRules,
    MoonIcons,
    MoonYearResetOptions,
    SocketTypes,
    TimeKeeperStatus,
    YearNamingRules
} from "./constants";

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
        showAdvanced: false,
        startingWeekday: null
    };
    const yt: YearTemplate = {
        display: '',
        selectedDisplayYear: '',
        selectedDisplayMonth: '',
        selectedDisplayDay: '',
        selectedDayOfWeek: '',
        selectedDayMoons: [],
        selectedDayNotes: [],
        numericRepresentation: 0,
        visibleMonth: mt,
        weekdays: [wt],
        showWeekdayHeaders: false,
        firstWeekday: 0,
        showClock: false,
        clockClass: '',
        showDateControls: false,
        showTimeControls: false,
        currentTime: tt,
        currentSeasonColor: '',
        currentSeasonName: '',
        weeks: [],
        yearZero: 0,
        gameSystem: GameSystems.Other,
        yearNames: [],
        yearNamingRule: YearNamingRules.Default,
        yearNamesStart: 0
    };
    const ct: CalendarTemplate = {
        isGM: false,
        changeDateTime: false,
        addNotes: false,
        isPrimary: false,
        currentYear: yt,
        showSelectedDay: false,
        showCurrentDay: false,
        showSetCurrentDate: false,
        notes: [],
        clockClass: '',
        timeUnits: {},
        compactView: false,
        compactViewShowNotes: false
    };


    test('Day Template', () => {
        expect(Object.keys(dt).length).toBe(4); //Make sure no new properties have been added
        expect(dt.selected).toBe(false);
        expect(dt.current).toBe(false);
        expect(dt.name).toBe("");
        expect(dt.numericRepresentation).toBe(0);
    });

    test('Month Template', () => {
        expect(Object.keys(mt).length).toBe(14); //Make sure no new properties have been added
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
        expect(mt.startingWeekday).toBeNull();
    });

    test('Weekday Template', () => {
        expect(wt.firstCharacter).toBe("");
        expect(wt.name).toBe("");
        expect(wt.numericRepresentation).toBe(0);
    });

    test('Year Template', () => {
        expect(Object.keys(yt).length).toBe(25); //Make sure no new properties have been added
        expect(yt.display).toBe('');
        expect(yt.selectedDisplayYear).toBe('');
        expect(yt.selectedDisplayMonth).toBe('');
        expect(yt.selectedDisplayDay).toBe('');
        expect(yt.selectedDayOfWeek).toBe('');
        expect(yt.selectedDayMoons).toStrictEqual([]);
        expect(yt.selectedDayNotes).toStrictEqual([]);
        expect(yt.numericRepresentation).toBe(0);
        expect(yt.visibleMonth).toStrictEqual(mt);
        expect(yt.weeks).toStrictEqual([]);
        expect(yt.weekdays).toStrictEqual([wt]);
        expect(yt.showWeekdayHeaders).toStrictEqual(false);
        expect(yt.firstWeekday).toStrictEqual(0);
        expect(yt.showClock).toStrictEqual(false);
        expect(yt.showTimeControls).toStrictEqual(false);
        expect(yt.showDateControls).toStrictEqual(false);
        expect(yt.clockClass).toStrictEqual('');
        expect(yt.currentTime).toStrictEqual(tt);
        expect(yt.currentSeasonName).toStrictEqual('');
        expect(yt.currentSeasonColor).toStrictEqual('');
        expect(yt.yearZero).toBe(0);
        expect(yt.gameSystem).toBe(GameSystems.Other);
        expect(yt.yearNames).toStrictEqual([]);
        expect(yt.yearNamingRule).toBe(YearNamingRules.Default);
        expect(yt.yearNamesStart).toBe(0);
    });

    test('Calendar Template', () => {
        expect(Object.keys(ct).length).toBe(13); //Make sure no new properties have been added
        expect(ct.isGM).toBe(false);
        expect(ct.changeDateTime).toBe(false);
        expect(ct.addNotes).toBe(false);
        expect(ct.isPrimary).toBe(false);
        expect(ct.currentYear).toStrictEqual(yt);
        expect(ct.showSelectedDay).toBe(false);
        expect(ct.showCurrentDay).toBe(false);
        expect(ct.showSetCurrentDate).toBe(false);
        expect(ct.notes).toStrictEqual([]);
        expect(ct.clockClass).toStrictEqual('');
        expect(ct.timeUnits).toStrictEqual({});
        expect(ct.compactView).toBe(false);
        expect(ct.compactViewShowNotes).toBe(false);
    });

    test('Year Config', () => {
        const yc: YearConfig = {postfix: '', prefix: '', numericRepresentation: 0, showWeekdayHeadings: false, firstWeekday: 0, yearZero: 0, yearNames: [], yearNamingRule: YearNamingRules.Default, yearNamesStart: 0};
        expect(Object.keys(yc).length).toBe(9); //Make sure no new properties have been added
        expect(yc.postfix).toBe('');
        expect(yc.prefix).toBe('');
        expect(yc.numericRepresentation).toBe(0);
        expect(yc.showWeekdayHeadings).toBe(false);
        expect(yc.firstWeekday).toBe(0);
        expect(yc.yearZero).toBe(0);
        expect(yc.yearNames).toStrictEqual([]);
        expect(yc.yearNamingRule).toBe(YearNamingRules.Default);
        expect(yc.yearNamesStart).toBe(0);
    });

    test('Month Config', () => {
        const yc: MonthConfig = {numberOfDays: 0, numericRepresentation: 0, numericRepresentationOffset: 0, name: '',intercalaryInclude: false, intercalary: false, numberOfLeapYearDays: 0, startingWeekday: null};
        expect(Object.keys(yc).length).toBe(8); //Make sure no new properties have been added
        expect(yc.name).toBe('');
        expect(yc.numberOfDays).toBe(0);
        expect(yc.numberOfLeapYearDays).toBe(0);
        expect(yc.numericRepresentation).toBe(0);
        expect(yc.numericRepresentationOffset).toBe(0);
        expect(yc.intercalary).toBe(false);
        expect(yc.intercalaryInclude).toBe(false);
        expect(yc.startingWeekday).toBeNull();
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
        const tc: TimeConfig = {gameTimeRatio:1, secondsInMinute: 0, minutesInHour: 0, hoursInDay: 0, unifyGameAndClockPause: false, updateFrequency: 1};
        expect(Object.keys(tc).length).toBe(6); //Make sure no new properties have been added
        expect(tc.gameTimeRatio).toBe(1);
        expect(tc.secondsInMinute).toBe(0);
        expect(tc.minutesInHour).toBe(0);
        expect(tc.hoursInDay).toBe(0);
        expect(tc.updateFrequency).toBe(1);
        expect(tc.unifyGameAndClockPause).toBe(false);
    });

    test('Time Template', () => {
        expect(Object.keys(tt).length).toBe(3); //Make sure no new properties have been added
        expect(tt.hour).toBe('');
        expect(tt.minute).toBe('');
        expect(tt.second).toBe('');
    });

    test('Season Template', () => {
        const st: SeasonTemplate = {name: '', startingMonth: 1, startingDay: 1, color: '', dayList: []};
        expect(st.name).toBe('');
        expect(st.color).toBe('');
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
            const scst: SimpleCalendarSocket.SimpleCalendarSocketTime = {timeKeeperStatus: TimeKeeperStatus.Stopped};
            expect(Object.keys(scst).length).toBe(1); //Make sure no new properties have been added
            expect(scst.timeKeeperStatus).toBe(TimeKeeperStatus.Stopped);
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
