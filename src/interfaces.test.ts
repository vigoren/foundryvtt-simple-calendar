import {
    CalendarTemplate,
    CurrentDateConfig,
    DayTemplate,
    FirstNewMoonDate, IConfigurationItemBaseConfig, IConfigurationItemBaseTemplate,
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
    SimpleCalendarSocket, SimpleCalendarTemplate,
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
    const tt: TimeTemplate = {hour: 0, minute: 0, seconds: 0};
    const dt: DayTemplate = {id: '', selected: false, current: false, name: '', numericRepresentation: 0};
    const wt: WeekdayTemplate = {id: '', abbreviation:'', name:'', numericRepresentation:0};
    const mt: MonthTemplate = {
        id: '',
        display: '',
        abbreviation: '',
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
        id: '',
        selectedDayMoons: [],
        selectedDayNotes: {
            normal: 0,
            reminders: 0
        },
        numericRepresentation: 0,
        visibleMonth: mt,
        weekdays: [wt],
        showWeekdayHeaders: false,
        firstWeekday: 0,
        currentSeasonColor: '',
        currentSeasonName: '',
        weeks: [],
        yearZero: 0,
        yearNames: [],
        yearNamingRule: YearNamingRules.Default,
        yearNamesStart: 0
    };
    const ct: CalendarTemplate = {
        id: '',
        isGM: false,
        changeDateTime: false,
        addNotes: false,
        currentYear: yt,
        showSelectedDay: false,
        showCurrentDay: false,
        showSetCurrentDate: false,
        notes: [],
        reorderNotes: false,
        name: '',
        gameSystem: GameSystems.Other,
        showClock: true,
        showDateControls: true,
        showTimeControls: true,
        calendarDisplay: '',
        selectedDisplay: '',
        timeDisplay: ''
    };

    test('Configuration Item Base Config', () => {
        const t: IConfigurationItemBaseConfig = {id: '', name: '', numericRepresentation: 0};
        expect(Object.keys(t).length).toBe(3); //Make sure no new properties have been added
    });

    test('Configuration Item Base Template', () => {
        const t: IConfigurationItemBaseTemplate= {id: '', name: '', numericRepresentation: 0};
        expect(Object.keys(t).length).toBe(3); //Make sure no new properties have been added
    });

    test('Simple Calendar Template', () => {
        const t: SimpleCalendarTemplate= {calendar: {id: '', name: ''}, compactView: false, compactViewShowNotes: false, clockClass: '', timeUnits: {}, isPrimary: false};
        expect(Object.keys(t).length).toBe(6); //Make sure no new properties have been added
    });

    test('Day Template', () => {
        expect(Object.keys(dt).length).toBe(5); //Make sure no new properties have been added
        expect(dt.selected).toBe(false);
        expect(dt.current).toBe(false);
        expect(dt.name).toBe("");
        expect(dt.numericRepresentation).toBe(0);
    });

    test('Month Template', () => {
        expect(Object.keys(mt).length).toBe(16); //Make sure no new properties have been added
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
        expect(wt.abbreviation).toBe("");
        expect(wt.name).toBe("");
        expect(wt.numericRepresentation).toBe(0);
    });

    test('Year Template', () => {
        expect(Object.keys(yt).length).toBe(15); //Make sure no new properties have been added
        expect(yt.selectedDayMoons).toStrictEqual([]);
        expect(yt.selectedDayNotes).toStrictEqual({normal: 0, reminders: 0});
        expect(yt.numericRepresentation).toBe(0);
        expect(yt.visibleMonth).toStrictEqual(mt);
        expect(yt.weeks).toStrictEqual([]);
        expect(yt.weekdays).toStrictEqual([wt]);
        expect(yt.showWeekdayHeaders).toStrictEqual(false);
        expect(yt.firstWeekday).toStrictEqual(0);
        expect(yt.currentSeasonName).toStrictEqual('');
        expect(yt.currentSeasonColor).toStrictEqual('');
        expect(yt.yearZero).toBe(0);
        expect(yt.yearNames).toStrictEqual([]);
        expect(yt.yearNamingRule).toBe(YearNamingRules.Default);
        expect(yt.yearNamesStart).toBe(0);
    });

    test('Calendar Template', () => {
        expect(Object.keys(ct).length).toBe(18); //Make sure no new properties have been added
        expect(ct.isGM).toBe(false);
        expect(ct.changeDateTime).toBe(false);
        expect(ct.addNotes).toBe(false);
        expect(ct.currentYear).toStrictEqual(yt);
        expect(ct.showSelectedDay).toBe(false);
        expect(ct.showCurrentDay).toBe(false);
        expect(ct.showSetCurrentDate).toBe(false);
        expect(ct.notes).toStrictEqual([]);
    });

    test('Year Config', () => {
        const yc: YearConfig = {id: '', postfix: '', prefix: '', numericRepresentation: 0, showWeekdayHeadings: false, firstWeekday: 0, yearZero: 0, yearNames: [], yearNamingRule: YearNamingRules.Default, yearNamesStart: 0};
        expect(Object.keys(yc).length).toBe(10); //Make sure no new properties have been added
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
        const yc: MonthConfig = {id: '', numberOfDays: 0, numericRepresentation: 0, numericRepresentationOffset: 0, name: '', abbreviation: '',intercalaryInclude: false, intercalary: false, numberOfLeapYearDays: 0, startingWeekday: null};
        expect(Object.keys(yc).length).toBe(10); //Make sure no new properties have been added
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
        const wc: WeekdayConfig = {abbreviation: '', id: '', name: '', numericRepresentation: 0};
        expect(Object.keys(wc).length).toBe(4); //Make sure no new properties have been added
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
        const nt: NoteTemplate = {title: '', content: '', author: '', monthDisplay: '', id: '', minute: 0, hour: 0, categories: [], displayDate: '', order: 0, allDay: false, authorDisplay: '', playerVisible: true, endDate: {year: 0, month: 0, day: 0, hour: 0, minute: 0, seconds: 0}, reminder: false};
        expect(Object.keys(nt).length).toBe(15); //Make sure no new properties have been added
        expect(nt.title).toBe('');
        expect(nt.content).toBe('');
        expect(nt.author).toBe('');
        expect(nt.monthDisplay).toBe('');
        expect(nt.id).toBe('');
        expect(nt.displayDate).toBe('');
        expect(nt.authorDisplay).toBe('');
        expect(nt.hour).toBe(0);
        expect(nt.minute).toBe(0);
        expect(nt.order).toBe(0);
        expect(nt.allDay).toBe(false);
        expect(nt.playerVisible).toBe(true);
        expect(nt.endDate).toStrictEqual({year: 0, month: 0, day: 0, hour: 0, minute: 0, seconds: 0});
        expect(nt.categories).toStrictEqual([]);
    });

    test('Notes Config', () => {
        const nc: NoteConfig = {year: 0, month:0, day:0, title: '', content: '', author: '', playerVisible: false, monthDisplay: '', id: '', repeats: 0, hour: 0, minute: 0, allDay: true, order: 0, categories: [], endDate: {year: 0, month: 0, day: 0, hour: 0, minute: 0, seconds: 0}, remindUsers: []};
        expect(Object.keys(nc).length).toBe(17); //Make sure no new properties have been added
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
        expect(nc.hour).toBe(0);
        expect(nc.minute).toBe(0);
        expect(nc.order).toBe(0);
        expect(nc.allDay).toBe(true);
        expect(nc.playerVisible).toBe(false);
        expect(nc.endDate).toStrictEqual({year: 0, month: 0, day: 0, hour: 0, minute: 0, seconds: 0});
        expect(nc.categories).toStrictEqual([]);
    });

    test('Leap Year Config', () => {
        const lyc: LeapYearConfig = {id: '', customMod: 0, rule: LeapYearRules.None};
        expect(Object.keys(lyc).length).toBe(3); //Make sure no new properties have been added
        expect(lyc.customMod).toBe(0);
        expect(lyc.rule).toBe(LeapYearRules.None);
    });

    test('Time Configuration', () => {
        const tc: TimeConfig = {id:'', gameTimeRatio:1, secondsInMinute: 0, minutesInHour: 0, hoursInDay: 0, secondsInCombatRound: 6, unifyGameAndClockPause: false, updateFrequency: 1};
        expect(Object.keys(tc).length).toBe(8); //Make sure no new properties have been added
        expect(tc.gameTimeRatio).toBe(1);
        expect(tc.secondsInMinute).toBe(0);
        expect(tc.minutesInHour).toBe(0);
        expect(tc.hoursInDay).toBe(0);
        expect(tc.updateFrequency).toBe(1);
        expect(tc.unifyGameAndClockPause).toBe(false);
        expect(tc.secondsInCombatRound).toBe(6);
    });

    test('Time Template', () => {
        expect(Object.keys(tt).length).toBe(3); //Make sure no new properties have been added
        expect(tt.hour).toBe(0);
        expect(tt.minute).toBe(0);
        expect(tt.seconds).toBe(0);
    });

    test('Season Template', () => {
        const st: SeasonTemplate = {id:'', name: '', startingMonth: 1, startingDay: 1, color: '', startDateSelectorId: '', sunriseSelectorId: ''};
        expect(st.name).toBe('');
        expect(st.color).toBe('');
        expect(st.startingMonth).toBe(1);
        expect(st.startingDay).toBe(1);
    });

    test('Season Configuration', () => {
        const sc: SeasonConfiguration = {id:'', name: '', startingMonth: 1, startingDay: 1, color: '', customColor: '', sunriseTime: 0, sunsetTime: 0};
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
        const mp: MoonConfiguration = {id:'', name: '', cycleLength: 0, cycleDayAdjust: 0, color: '', phases: [], firstNewMoon: {yearReset: MoonYearResetOptions.None, yearX: 0, year: 0, month: 0, day: 0}};
        expect(mp.name).toBe('');
        expect(mp.cycleLength).toBe(0);
        expect(mp.cycleDayAdjust).toBe(0);
        expect(mp.color).toBe('');
        expect(mp.phases).toStrictEqual([]);
        expect(mp.firstNewMoon).toStrictEqual({yearReset: MoonYearResetOptions.None, yearX: 0, year: 0, month: 0, day: 0});
    });

    test('Moon Template', () => {
        const mp: MoonTemplate = {id:'', name: '', cycleLength: 0, cycleDayAdjust: 0, color: '', phases: [], firstNewMoon: {yearReset: MoonYearResetOptions.None, yearX: 0, year: 0, month: 0, day: 0}, dayList: []};
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
