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
import SimpleCalendar from "./simple-calendar";
import Year from "./year";
import Month from "./month";
import {Weekday} from "./weekday";
import {GameSystems, LeapYearRules, PredefinedCalendars, TimeKeeperStatus, YearNamingRules} from "../constants";
import LeapYear from "./leap-year";
import Season from "./season";
import Moon from "./moon";
import Note from "./note";
import {SimpleCalendarConfiguration} from "./simple-calendar-configuration";
import PredefinedCalendar from "./predefined-calendar";

describe('Year Class Tests', () => {
    let year: Year;
    let year2: Year;
    let month: Month;
    SimpleCalendar.instance = new SimpleCalendar();

    beforeEach(() => {
        year = new Year(0);
        month = new Month("Test", 1, 0, 30);
        year2 = new Year(2020);

        SimpleCalendar.instance = new SimpleCalendar();
    });

    test('Properties', () => {
        expect(Object.keys(year).length).toBe(21); //Make sure no new properties have been added
        expect(year.months).toStrictEqual([]);
        expect(year.weekdays).toStrictEqual([]);
        expect(year.prefix).toBe("");
        expect(year.postfix).toBe("");
        expect(year.yearZero).toBe(0);
        expect(year.numericRepresentation).toBe(0);
        expect(year.selectedYear).toBe(0);
        expect(year.visibleYear).toBe(0);
        expect(year.leapYearRule.customMod).toBe(0);
        expect(year.leapYearRule.rule).toBe(LeapYearRules.None);
        expect(year.showWeekdayHeadings).toBe(true);
        expect(year.firstWeekday).toBe(0);
        expect(year.time).toBeDefined();
        expect(year.timeChangeTriggered).toBe(false);
        expect(year.combatChangeTriggered).toBe(false);
        expect(year.seasons).toStrictEqual([]);
        expect(year.yearNames).toStrictEqual([]);
        expect(year.yearNamesStart).toBe(0);
        expect(year.yearNamingRule).toBe(YearNamingRules.Default);
    });

    test('To Config', () => {
        const t = year.toConfig();
        expect(t.id).toBe(year.id);
    });

    test('To Template', () => {
        year.weekdays.push(new Weekday(1, 'S'));
        let t = year.toTemplate();
        expect(Object.keys(t).length).toBe(16); //Make sure no new properties have been added
        expect(t.weekdays).toStrictEqual(year.weekdays.map(w=>w.toTemplate()));
        expect(t.numericRepresentation).toBe(0);
        expect(t.yearZero).toBe(0);
        expect(t.selectedDayMoons).toStrictEqual([]);
        expect(t.visibleMonth).toBeUndefined();
        expect(t.weeks).toStrictEqual([]);
        expect(t.showWeekdayHeaders).toBe(true);
        expect(t.firstWeekday).toBe(0);
        expect(t.currentSeasonColor).toBe("#ffffff");
        expect(t.currentSeasonName).toBe("");
        expect(t.yearNames).toStrictEqual([]);
        expect(t.yearNamesStart).toBe(0);
        expect(t.yearNamingRule).toBe(YearNamingRules.Default);

        year.months.push(month);
        year.months[0].current = true;
        t = year.toTemplate();
        year.months[0].days[0].current = true;
        t = year.toTemplate();

        year.months[0].current = false;
        year.months[0].selected = true;
        year.months[0].days[0].current = false;
        t = year.toTemplate();
        year.months[0].days[0].selected = true;
        t = year.toTemplate();

        year.months[0].visible = true;
        t = year.toTemplate();
        expect(t.visibleMonth).toStrictEqual(year.months[0].toTemplate());

        year.resetMonths('selected');
        year.months[0].current = true;
        year.months[0].days[0].current = true;
        year.showWeekdayHeadings = false;
        t = year.toTemplate();

        year.moons.push(new Moon("Moon", 10));
        t = year.toTemplate();
        expect(t.selectedDayMoons.length).toBe(1);

        SimpleCalendar.instance = new SimpleCalendar();
        SimpleCalendar.instance.activeCalendar.year = year;
        t = year.toTemplate();
        expect(t.selectedDayNotes.normal).toBe(0);

        const n = new Note();
        n.day = 1;
        n.month = 1;
        n.year = 0;
        n.endDate.day = 1;
        n.endDate.month = 1;
        n.endDate.year = 0;
        n.playerVisible = true;
        SimpleCalendar.instance.activeCalendar.notes.push(n);
        t = year.toTemplate();
        expect(t.selectedDayNotes.normal).toBe(1);


    });

    test('Load From Settings', () => {
        //@ts-ignore
        year.loadFromSettings({});
        expect(year.id).toBeDefined();

        //@ts-ignore
        year.loadFromSettings({numericRepresentation: 12});
        expect(year.numericRepresentation).toBe(12);

        //@ts-ignore
        year.loadFromSettings({id: 'id', showWeekdayHeadings: false, firstWeekday: 2, yearZero: 0, yearNames: [], yearNamingRule: YearNamingRules.Random, yearNamesStart: 0});
        expect(year.id).toBe('id');
    });

    test('Days Into Weeks', () => {
        year.weekdays.push(new Weekday(1, "S"));
        year.weekdays.push(new Weekday(2, "S"));
        year.weekdays.push(new Weekday(3, "S"));
        year.weekdays.push(new Weekday(4, "S"));
        year.months.push(month);
        let weeks = year.daysIntoWeeks(month, year.numericRepresentation, 0);
        expect(weeks).toStrictEqual([]);

        weeks = year.daysIntoWeeks(month, year.numericRepresentation, year.weekdays.length);
        expect(weeks.length).toStrictEqual(8);

        const m2 = new Month("M", 2, 0, 15);
        month.visible = false;
        m2.visible = true;
        year.months.push(m2);
        weeks = year.daysIntoWeeks(m2, year.numericRepresentation, year.weekdays.length);
        expect(weeks.length).toStrictEqual(5);

        const m3 = new Month("3", 3, 0, 1);
        m2.visible = false;
        m3.visible = true;
        year.months.push(m3);
        weeks = year.daysIntoWeeks(m3, year.numericRepresentation, year.weekdays.length);
        expect(weeks.length).toStrictEqual(1);
    });

    test('Clone', () => {
        expect(year.clone()).toStrictEqual(year);
        year2.months.push(month);
        year2.weekdays.push(new Weekday(1, 'S'));
        year2.seasons.push(new Season('S', 1, 1));
        year2.moons.push(new Moon('M',1))
        year2.yearNames.push('Asd');
        expect(year2.clone()).toStrictEqual(year2);
    });

    test('Get Display Name', () => {
        expect(year.getDisplayName()).toBe('0');
        year.prefix = 'Pre';
        year.postfix = 'Post';
        expect(year.getDisplayName()).toBe('Pre 0 Post');

        year.selectedYear = 1;
        expect(year.getDisplayName(true)).toBe('Pre 1 Post');

        year.yearNames.push('Name');
        expect(year.getDisplayName()).toBe('Pre Name (0) Post');
        expect(year.getDisplayName(true)).toBe('Pre Name (1) Post');


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

    test('Set Current To Visible', () => {
        year.months.push(month);
        month.current = false;
        month.visible = false;

        //@ts-ignore
        year.time.timeKeeper.status = TimeKeeperStatus.Started;

        year.setCurrentToVisible();
        expect(month.visible).toBe(false);

        //@ts-ignore
        year.time.timeKeeper.status = TimeKeeperStatus.Stopped;

        year.setCurrentToVisible();
        expect(month.visible).toBe(false);
        month.current = true;

        year.setCurrentToVisible();
        expect(month.visible).toBe(true);

    });

    test('Update Month', () => {
        year.months.push(month);
        year.months.push(new Month("Test 2", 2, 0, 22));

        expect(year.months[0].current).toBe(false);
        expect(year.months[1].current).toBe(false);
        year.updateMonth(0, 'current', true);
        expect(year.months[0].current).toBe(true);
        expect(year.months[1].current).toBe(false);
        year.months[1].days[0].current = true;
        year.updateMonth(-1, 'current', true);
        expect(year.months[0].current).toBe(false);
        expect(year.months[1].current).toBe(true);

        year.months.push(new Month("Test 3", -1, 0, 0));
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
        year.months.push(new Month("Test 2", 2, 0, 22));
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
        year.months.push(new Month("Test 2", 2, 0, 22));
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
        year.months.push(new Month("Test 2", 2, 0, 22));
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
        year.months.push(new Month("Test 2", 2, 0, 22));
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
        year.months.push(new Month("Test 2", 2, 0, 22));
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
        year.months.push(new Month("Test 2", 2, 0, 22));
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
        year.months.push(new Month("Test 2", 2, 0, 22));
        year.months[0].current = true
        year.changeMonth(1, 'current');
        expect(year.months[0].current).toBe(false);
        expect(year.months[1].current).toBe(true);
        year.changeMonth(-1, 'current');
        expect(year.months[0].current).toBe(true);
        expect(year.months[1].current).toBe(false);
        year.changeMonth(-1, 'current');
        expect(year.months[0].current).toBe(false);
        expect(year.months[1].current).toBe(true);
        expect(year.numericRepresentation).toBe(-1);
        year.changeMonth(1, 'current');
        expect(year.months[0].current).toBe(true);
        expect(year.months[1].current).toBe(false);
        expect(year.numericRepresentation).toBe(0);

        year.months[0].days[0].current = true;
        year.changeMonth(1, 'current');
        expect(year.months[0].current).toBe(false);
        expect(year.months[1].current).toBe(true);
        expect(year.months[1].days[0].current).toBe(true);

        year.months[1].days[0].current = false;
        year.months[0].days[29].current = true;
        year.months[0].current = true;
        year.months[1].current = false;
        year.changeMonth(1, 'current');
        expect(year.months[0].current).toBe(false);
        expect(year.months[1].current).toBe(true);
        expect(year.months[1].days[21].current).toBe(true);

        year.months[0].current = false;
        year.months[1].current = false;
        year.changeMonth(1, 'current');
        expect(year.months[0].current).toBe(false);
        expect(year.months[1].current).toBe(false);

        year.months[0].current = true;
        year.changeMonth(13, 'current');
        expect(year.months[0].current).toBe(false);
        expect(year.months[1].current).toBe(true);

        year.changeMonth(-13, 'current');
        expect(year.months[0].current).toBe(true);
        expect(year.months[1].current).toBe(false);
    });

    test('Change Day Current', () => {
        year.months.push(month);
        year.months.push(new Month("Test 2", 2, 0, 22));
        year.months[0].days[0].current = true;
        year.changeDay(1);
        expect(year.months[0].days[0].current).toBe(true);
        year.months[0].current = true
        year.changeDay(1);
        expect(year.months[0].days[0].current).toBe(false);
        expect(year.months[0].days[1].current).toBe(true);
        year.months[0].days[0].current = true;
        year.months[0].days[1].current = false;
        year.changeDay(-1);
        expect(year.months[0].current).toBe(false);
        expect(year.months[1].current).toBe(true);
        expect(year.months[1].days[21].current).toBe(true);
        year.changeDay(1);
        expect(year.months[0].current).toBe(true);
        expect(year.months[1].current).toBe(false);
        expect(year.months[0].days[0].current).toBe(true);

        year.months.push(new Month("Test 3", 3, 0, 28, 29));
        year.leapYearRule.rule = LeapYearRules.Custom;
        year.leapYearRule.customMod = 2;
        year.numericRepresentation = 4;
        year.months[0].current = false;
        year.months[0].days[0].current = false;
        year.months[2].current = true;
        year.months[2].days[0].current = true;
        year.changeDay(1);
        expect(year.months[2].current).toBe(true);
        expect(year.months[2].days[0].current).toBe(false);
        expect(year.months[2].days[1].current).toBe(true);
    });

    test('Change Day Selected', () => {
        year.months.push(month);
        year.months.push(new Month("Test 2", 2, 0, 22));
        year.months[0].days[0].selected = true;
        year.changeDay(1, 'selected');
        expect(year.months[0].days[0].selected).toBe(true);
        year.months[0].selected = true
        year.months[0].current = true
        year.changeDay(1, 'selected');
        expect(year.months[0].days[0].selected).toBe(false);
        expect(year.months[0].days[1].selected).toBe(true);
        year.months[0].days[0].selected = true;
        year.months[0].days[1].selected = false;
        year.changeDay(-1, 'selected');
        expect(year.months[0].selected).toBe(false);
        expect(year.months[1].selected).toBe(true);
        expect(year.months[1].days[21].selected).toBe(false);
    });

    test('Change Day Bulk', () => {
        year.months.push(month);
        month.current = true;
        month.days[0].current = true;
        year.changeDayBulk(1);
        expect(year.months[0].days[1].current).toBe(true);
        year.changeDayBulk(31);
        expect(year.numericRepresentation).toBe(1);
    });

    test('Change Time', () => {
        year.changeTime(true, 'hour');
        expect(year.time.seconds).toBe(3600);
        year.changeTime(true, 'minute', 2);
        expect(year.time.seconds).toBe(3720);
        year.changeTime(true, 'second', 3);
        expect(year.time.seconds).toBe(3723);
        year.changeTime(true, 'asd', 3);
        expect(year.time.seconds).toBe(3723);

        year.changeTime(false, 'hour', 3);
        expect(year.time.seconds).toBe(79323);
    });

    test('Total Number of Days', () => {
        year.months.push(month);
        expect(year.totalNumberOfDays()).toBe(30);
        year.months.push(new Month("Test 2", 2, 0, 22));
        expect(year.totalNumberOfDays()).toBe(52);

        year.months.push(new Month("Test 3", 3, 0, 2));
        year.months[2].intercalary = true;
        expect(year.totalNumberOfDays()).toBe(52);
        year.months[2].intercalaryInclude = true;
        expect(year.totalNumberOfDays()).toBe(54);

    });

    test('Month Starting Day Of Week', () => {
        year.months.push(month);
        month.visible = true;
        //@ts-ignore
        expect(year.monthStartingDayOfWeek(false, year.numericRepresentation)).toBe(0);
        expect(year.monthStartingDayOfWeek(month, year.numericRepresentation)).toBe(0);
        year.weekdays.push(new Weekday(1, 'S'));
        year.weekdays.push(new Weekday(2, 'M'));
        year.weekdays.push(new Weekday(3, 'T'));
        year.weekdays.push(new Weekday(4, 'W'));
        year.weekdays.push(new Weekday(5, 'T'));
        year.weekdays.push(new Weekday(6, 'F'));
        year.weekdays.push(new Weekday(7, 'S'));
        expect(year.monthStartingDayOfWeek(month, year.numericRepresentation)).toBe(0);
        month.visible = false;
        year.months.push(new Month("Test 2", 2, 0, 22));
        year.months[1].visible = true;
        expect(year.monthStartingDayOfWeek(year.months[1], year.numericRepresentation)).toBe(2);

        year.months[1].visible = false;
        expect(year.monthStartingDayOfWeek(month, year.numericRepresentation)).toBe(0);

        year.months.push(new Month("Test 3", 3, 0, 2));
        year.months[2].visible = true;
        year.months[2].intercalary = true;
        expect(year.monthStartingDayOfWeek(year.months[2], year.numericRepresentation)).toBe(0);
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

        year.months.push(new Month("Test 3", 3, 0, 2));
        year.months.push(new Month("Test 2", 2, 0, 22));
        year.months[1].intercalary = true;
        expect(year.dayOfTheWeek(year.numericRepresentation, 3, 2)).toBe(3);

        year.leapYearRule = new LeapYear();
        year.leapYearRule.rule = LeapYearRules.Gregorian;
        year.numericRepresentation = 4;
        expect(year.dayOfTheWeek(year.numericRepresentation, 3, 2)).toBe(1);

        year.yearZero = 10;
        expect(year.dayOfTheWeek(year.numericRepresentation, 3, 2)).toBe(4);

        year.months[0].startingWeekday = 3;
        expect(year.dayOfTheWeek(year.numericRepresentation, 1, 1)).toBe(2);

        SimpleCalendar.instance.activeCalendar.gameSystem = GameSystems.PF2E;
        //@ts-ignore
        game.pf2e = {worldClock:{dateTheme: "AR", worldCreatedOn: 0}};
        expect(year.dayOfTheWeek(year.numericRepresentation, 1, 1)).toBe(2);
    });

    test('Date to Days', () => {
        year.months.push(month);
        year.months.push(new Month("Test 2", 2, 0, 30, 31));
        year.months.push(new Month("Test 3", 3, 0, 30));
        expect(year.dateToDays(0,1,-1)).toBe(0);
        expect(year.dateToDays(5,1,1)).toBe(450);
        expect(year.dateToDays(5,11,1)).toBe(450);
        year.leapYearRule = new LeapYear();
        year.leapYearRule.rule = LeapYearRules.Gregorian;
        expect(year.dateToDays(5,1,1, true)).toBe(452);
        expect(year.dateToDays(4,3,1, true)).toBe(422);
        year.months[0].intercalary = true;
        expect(year.dateToDays(5,1,1, true)).toBe(302);
        year.months[0].intercalaryInclude = true;
        expect(year.dateToDays(5,2,1, true)).toBe(482);

        year.yearZero = 5;
        expect(year.dateToDays(4,1,1, true)).toBe(-91);
        expect(year.dateToDays(3,1,1, true)).toBe(-181);
        expect(year.dateToDays(-1,1,1, true)).toBe(-542);
        expect(year.dateToDays(-4,1,1, true)).toBe(-813);

        year.months[2].intercalary = true;
        expect(year.dateToDays(4,1,1, true)).toBe(-61);
    });

    test('To Seconds', () => {
        SimpleCalendar.instance.activeCalendar.year = year;
        expect(year.toSeconds()).toBe(0);
        year.months.push(month);
        year.numericRepresentation = 1;
        year.months[0].current = true;
        year.months[0].days[0].current = true;
        expect(year.toSeconds()).toBe(2592000);

        SimpleCalendar.instance.activeCalendar.gameSystem = GameSystems.PF2E;
        //@ts-ignore
        game.pf2e = {worldClock:{dateTheme: "AA", worldCreatedOn: 0}};
        expect(year.toSeconds()).toBe(2678400);
        //@ts-ignore
        game.pf2e = {worldClock:{dateTheme: "AD", worldCreatedOn: 0}};
        expect(year.toSeconds()).toBe(-4857321600);
        month.days[0].current = false;
        expect(year.toSeconds()).toBe(-4857321600);
        //@ts-ignore
        game.pf2e.worldClock.dateTheme = "AR";
        expect(year.toSeconds()).toBe(-69162940800);

    });

    test('Seconds To Date', () => {
        const select = document.createElement('input');
        select.value = 'gregorian';
        jest.spyOn(document, 'getElementById').mockImplementation().mockReturnValueOnce(select);
        SimpleCalendar.instance.activeCalendar.year = year;
        const sc = new SimpleCalendarConfiguration(SimpleCalendar.instance.activeCalendar);
        sc.predefinedApplyConfirm();
        year.resetMonths();
        year.months[3].current = true;
        year.months[3].days[11].current = true;

        //After Year Zero Tests
        year.yearZero = 0;
        year.numericRepresentation = 1950;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: 1950, month: 3, day: 11, hour: 0, minute: 0, seconds: 0}); //+year, 0yearZero, year>yearZero
        year.yearZero = 1000;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: 1950, month: 3, day: 11, hour: 0, minute: 0, seconds: 0}); //+year, +yearZero, year>yearZero
        year.yearZero = -1000;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: 1950, month: 3, day: 11, hour: 0, minute: 0, seconds: 0}); //+year, -yearZero, year>yearZero
        year.numericRepresentation = -1950
        year.yearZero = -2000;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: -1950, month: 3, day: 11, hour: 0, minute: 0, seconds: 0}); //-year, -yearZero, year>yearZero

        // After Year Time Tests
        year.yearZero = 0;
        year.numericRepresentation = 1950;
        year.time.seconds = 1;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: 1950, month: 3, day: 11, hour: 0, minute: 0, seconds: 1});
        year.time.seconds = 60;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: 1950, month: 3, day: 11, hour: 0, minute: 1, seconds: 0});
        year.time.seconds = 61;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: 1950, month: 3, day: 11, hour: 0, minute: 1, seconds: 1});
        year.time.seconds = 3600;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: 1950, month: 3, day: 11, hour: 1, minute: 0, seconds: 0});
        year.time.seconds = 3660;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: 1950, month: 3, day: 11, hour: 1, minute: 1, seconds: 0});
        year.time.seconds = 3601;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: 1950, month: 3, day: 11, hour: 1, minute: 0, seconds: 1});
        year.time.seconds = 3661;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: 1950, month: 3, day: 11, hour: 1, minute: 1, seconds: 1});
        year.yearZero = 1000;
        year.time.seconds = 1;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: 1950, month: 3, day: 11, hour: 0, minute: 0, seconds: 1});
        year.time.seconds = 60;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: 1950, month: 3, day: 11, hour: 0, minute: 1, seconds: 0});
        year.time.seconds = 61;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: 1950, month: 3, day: 11, hour: 0, minute: 1, seconds: 1});
        year.time.seconds = 3600;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: 1950, month: 3, day: 11, hour: 1, minute: 0, seconds: 0});
        year.time.seconds = 3660;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: 1950, month: 3, day: 11, hour: 1, minute: 1, seconds: 0});
        year.time.seconds = 3601;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: 1950, month: 3, day: 11, hour: 1, minute: 0, seconds: 1});
        year.time.seconds = 3661;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: 1950, month: 3, day: 11, hour: 1, minute: 1, seconds: 1});
        year.yearZero = -1000;
        year.time.seconds = 1;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: 1950, month: 3, day: 11, hour: 0, minute: 0, seconds: 1});
        year.time.seconds = 60;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: 1950, month: 3, day: 11, hour: 0, minute: 1, seconds: 0});
        year.time.seconds = 61;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: 1950, month: 3, day: 11, hour: 0, minute: 1, seconds: 1});
        year.time.seconds = 3600;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: 1950, month: 3, day: 11, hour: 1, minute: 0, seconds: 0});
        year.time.seconds = 3660;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: 1950, month: 3, day: 11, hour: 1, minute: 1, seconds: 0});
        year.time.seconds = 3601;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: 1950, month: 3, day: 11, hour: 1, minute: 0, seconds: 1});
        year.time.seconds = 3661;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: 1950, month: 3, day: 11, hour: 1, minute: 1, seconds: 1});
        year.numericRepresentation = -1950;
        year.yearZero = -2000;
        year.time.seconds = 1;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: -1950, month: 3, day: 11, hour: 0, minute: 0, seconds: 1});
        year.time.seconds = 60;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: -1950, month: 3, day: 11, hour: 0, minute: 1, seconds: 0});
        year.time.seconds = 61;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: -1950, month: 3, day: 11, hour: 0, minute: 1, seconds: 1});
        year.time.seconds = 3600;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: -1950, month: 3, day: 11, hour: 1, minute: 0, seconds: 0});
        year.time.seconds = 3660;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: -1950, month: 3, day: 11, hour: 1, minute: 1, seconds: 0});
        year.time.seconds = 3601;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: -1950, month: 3, day: 11, hour: 1, minute: 0, seconds: 1});
        year.time.seconds = 3661;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: -1950, month: 3, day: 11, hour: 1, minute: 1, seconds: 1});

        //Before Year Zero Tests
        year.time.seconds = 0;
        year.yearZero = 1970;
        year.numericRepresentation = 1950;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: 1950, month: 3, day: 11, hour: 0, minute: 0, seconds: 0}); //+year, +yearZero, year<yearZero
        year.numericRepresentation = -1950
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: -1950, month: 3, day: 11, hour: 0, minute: 0, seconds: 0});//-year, +yearZero, year<yearZero
        year.yearZero = 0;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: -1950, month: 3, day: 11, hour: 0, minute: 0, seconds: 0});//-year, 0yearZero, year<yearZero
        year.yearZero = -1000;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: -1950, month: 3, day: 11, hour: 0, minute: 0, seconds: 0});//-year, -yearZero, year<yearZero
        year.numericRepresentation = 1968;
        year.yearZero = 1970;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: 1968, month: 3, day: 11, hour: 0, minute: 0, seconds: 0});
        year.yearZero = 1969;
        year.numericRepresentation = 1963;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: 1963, month: 3, day: 11, hour: 0, minute: 0, seconds: 0});

        // Before Year Time Tests
        year.yearZero = 1970;
        year.numericRepresentation = 1950;
        year.time.seconds = 1;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: 1950, month: 3, day: 11, hour: 0, minute: 0, seconds: 1});
        year.time.seconds = 60;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: 1950, month: 3, day: 11, hour: 0, minute: 1, seconds: 0});
        year.time.seconds = 61;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: 1950, month: 3, day: 11, hour: 0, minute: 1, seconds: 1});
        year.time.seconds = 3600;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: 1950, month: 3, day: 11, hour: 1, minute: 0, seconds: 0});
        year.time.seconds = 3660;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: 1950, month: 3, day: 11, hour: 1, minute: 1, seconds: 0});
        year.time.seconds = 3601;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: 1950, month: 3, day: 11, hour: 1, minute: 0, seconds: 1});
        year.time.seconds = 3661;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: 1950, month: 3, day: 11, hour: 1, minute: 1, seconds: 1});
        year.numericRepresentation = -1950;
        year.time.seconds = 1;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: -1950, month: 3, day: 11, hour: 0, minute: 0, seconds: 1});
        year.time.seconds = 60;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: -1950, month: 3, day: 11, hour: 0, minute: 1, seconds: 0});
        year.time.seconds = 61;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: -1950, month: 3, day: 11, hour: 0, minute: 1, seconds: 1});
        year.time.seconds = 3600;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: -1950, month: 3, day: 11, hour: 1, minute: 0, seconds: 0});
        year.time.seconds = 3660;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: -1950, month: 3, day: 11, hour: 1, minute: 1, seconds: 0});
        year.time.seconds = 3601;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: -1950, month: 3, day: 11, hour: 1, minute: 0, seconds: 1});
        year.time.seconds = 3661;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: -1950, month: 3, day: 11, hour: 1, minute: 1, seconds: 1});
        year.yearZero = 0;
        year.time.seconds = 1;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: -1950, month: 3, day: 11, hour: 0, minute: 0, seconds: 1});
        year.time.seconds = 60;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: -1950, month: 3, day: 11, hour: 0, minute: 1, seconds: 0});
        year.time.seconds = 61;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: -1950, month: 3, day: 11, hour: 0, minute: 1, seconds: 1});
        year.time.seconds = 3600;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: -1950, month: 3, day: 11, hour: 1, minute: 0, seconds: 0});
        year.time.seconds = 3660;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: -1950, month: 3, day: 11, hour: 1, minute: 1, seconds: 0});
        year.time.seconds = 3601;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: -1950, month: 3, day: 11, hour: 1, minute: 0, seconds: 1});
        year.time.seconds = 3661;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: -1950, month: 3, day: 11, hour: 1, minute: 1, seconds: 1});
        year.yearZero = -1000;
        year.time.seconds = 1;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: -1950, month: 3, day: 11, hour: 0, minute: 0, seconds: 1});
        year.time.seconds = 60;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: -1950, month: 3, day: 11, hour: 0, minute: 1, seconds: 0});
        year.time.seconds = 61;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: -1950, month: 3, day: 11, hour: 0, minute: 1, seconds: 1});
        year.time.seconds = 3600;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: -1950, month: 3, day: 11, hour: 1, minute: 0, seconds: 0});
        year.time.seconds = 3660;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: -1950, month: 3, day: 11, hour: 1, minute: 1, seconds: 0});
        year.time.seconds = 3601;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: -1950, month: 3, day: 11, hour: 1, minute: 0, seconds: 1});
        year.time.seconds = 3661;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: -1950, month: 3, day: 11, hour: 1, minute: 1, seconds: 1});

        // Testing Leap Month's
        year.numericRepresentation = -1950;
        year.months.push(new Month('Leap Month', 13, 0, 0, 2));
        year.months.push(new Month('Leap Month 2', 14, 0, 0, 2));
        year.months.push(new Month('New Month', 15, 0, 10));
        year.months.push(new Month('No Leap Month', 16, 0, 10, 0));
        year.resetMonths();
        year.months[11].current = true;
        year.months[11].days[29].current = true;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: -1950, month: 11, day: 29, hour: 1, minute: 1, seconds: 1});
        year.numericRepresentation = -1948;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: -1948, month: 11, day: 29, hour: 1, minute: 1, seconds: 1});

        year.numericRepresentation = 2000;
        year.resetMonths();
        year.months[14].current = true;
        year.months[14].days[0].current = true;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: 2000, month: 14, day: 0, hour: 1, minute: 1, seconds: 1});
        year.numericRepresentation = 2001;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: 2001, month: 14, day: 0, hour: 1, minute: 1, seconds: 1});
        year.resetMonths();
        year.months[14].current = true;
        year.months[14].days[9].current = true;
        expect(year.secondsToDate(year.toSeconds())).toStrictEqual({year: 2001, month: 14, day: 9, hour: 1, minute: 1, seconds: 1});
    });

    test('Seconds To Interval', () => {
        year.months.push(month);
        year.months.push(new Month("Test 2", 2, 0, 30, 30));
        year.months.push(new Month("Test 3", 3, 0, 30, 30));
        expect(year.secondsToInterval(6)).toStrictEqual({year: 0, month: 0, day: 0, hour: 0, minute: 0, second: 6});
        expect(year.secondsToInterval(66)).toStrictEqual({year: 0, month: 0, day: 0, hour: 0, minute: 1, second: 6});
        expect(year.secondsToInterval(3666)).toStrictEqual({year: 0, month: 0, day: 0, hour: 1, minute: 1, second: 6});
        expect(year.secondsToInterval(86400)).toStrictEqual({year: 0, month: 0, day: 1, hour: 0, minute: 0, second: 0});
        expect(year.secondsToInterval(2592000)).toStrictEqual({year: 0, month: 1, day: 0, hour: 0, minute: 0, second: 0});
        expect(year.secondsToInterval(7776000)).toStrictEqual({year: 1, month: 0, day: 0, hour: 0, minute: 0, second: 0});

        expect(year.secondsToInterval(2505600)).toStrictEqual({year: 0, month: 0, day: 29, hour: 0, minute: 0, second: 0});
        expect(year.secondsToInterval(2591999)).toStrictEqual({year: 0, month: 0, day: 29, hour: 23, minute: 59, second: 59});
        expect(year.secondsToInterval(5184000)).toStrictEqual({year: 0, month: 2, day: 0, hour: 0, minute: 0, second: 0});
    });

    test('Update Time', () => {
        year.months.push(month);
        year.months.push(new Month("Test 2", 2, 0, 22, 23));
        year.updateTime({year: 1, month: 1, day: 3, hour: 4, minute: 5, seconds: 6});
        expect(year.numericRepresentation).toBe(1);
        expect(year.months[1].current).toBe(true);
        expect(year.months[1].days[3].current).toBe(true);
        expect(year.time.seconds).toBe(14706);
    });

    test('Get Current Season', () => {
        let data = year.getCurrentSeason();
        expect(data.name).toBe('');
        expect(data.color).toBe('#ffffff');

        year.months.push(month);
        year.months.push(new Month('Month 2', 2, 0, 20));
        month.current = true;
        data = year.getCurrentSeason();
        expect(data.name).toBe('');
        expect(data.color).toBe('#ffffff');

        month.days[0].current = true;
        data = year.getCurrentSeason();
        expect(data.name).toBe('');
        expect(data.color).toBe('#ffffff');

        year.seasons.push(new Season('Spring', 1, 5));
        year.seasons.push(new Season('Winter', 2, 10));
        month.current = false;
        month.days[0].current = false;
        year.months[1].visible = true;
        year.months[1].days[0].selected = true;
        data = year.getCurrentSeason();
        expect(data.name).toBe('Spring');
        expect(data.color).toBe('#ffffff');

        year.months[1].days[0].selected = false;
        year.months[1].days[9].current = true;
        data = year.getCurrentSeason();
        expect(data.name).toBe('Winter');

        year.months[1].days[9].current = false;
        data = year.getCurrentSeason();
        expect(data.name).toBe('Spring');
        expect(data.color).toBe('#ffffff');
    });

    test('Get Season', () => {
        year.months.push(month);
        year.months.push(new Month('Month 2', 2, 0, 20));
        year.months.push(new Month('Month 3', 3, 0, 20));
        year.seasons.push(new Season('Spring', 1, 10));
        year.seasons.push(new Season('Summer', 2, 10));
        year.seasons.push(new Season('Fall', 3, 10));
        year.seasons.push(new Season('Winter', 3, 18));

        let data = year.getSeason(0, 1);
        expect(data.name).toBe('Winter');
        data = year.getSeason(2, 9);
        expect(data.name).toBe('Summer');

        year.seasons[0].startingMonth = -1;
        data = year.getSeason(0, 1);
        expect(data.name).toBe('Spring');
    });

    test('Get Year Name', () => {

        expect(year.getYearName(0)).toBe('');
        year.yearNames.push('First Year');
        year.yearNames.push('Second Year');
        year.yearNames.push('Third Year');
        year.yearNamesStart = 0;
        expect(year.getYearName(0)).toBe('First Year');
        expect(year.getYearName(1)).toBe('Second Year');
        expect(year.getYearName(2)).toBe('Third Year');
        expect(year.getYearName(3)).toBe('Third Year');

        year.yearNamingRule = YearNamingRules.Repeat;
        expect(year.getYearName(3)).toBe('First Year');

        year.yearNamingRule = YearNamingRules.Random;
        expect(year.getYearName(4)).not.toBe('');

    });

    test('Process Own Combat Round Time', () => {
        SimpleCalendar.instance.activeCalendar.year = year;
        PredefinedCalendar.setToPredefined(year, PredefinedCalendars.Gregorian);
        let curTime = year.time.seconds;
        year.processOwnCombatRoundTime(<Combat>{});
        expect(year.time.seconds).toBe(curTime + year.time.secondsInCombatRound);

        //@ts-ignore
        game.user.isGM = true;
        curTime = year.time.seconds;
        //@ts-ignore
        year.processOwnCombatRoundTime({round: 2, previous: {round: 1}});
        expect(year.time.seconds).toBe(curTime + year.time.secondsInCombatRound);

        curTime = year.time.seconds;
        //@ts-ignore
        year.processOwnCombatRoundTime({round: 2, previous: {round: 2}});
        expect(year.time.seconds).toBe(curTime);

        SimpleCalendar.instance.primary = true;
        curTime = year.time.seconds;
        //@ts-ignore
        year.processOwnCombatRoundTime({round: 2, previous: {round: 1}});
        expect(year.time.seconds).toBe(curTime + year.time.secondsInCombatRound);

        //@ts-ignore
        game.user.isGM = false;
    });

    test('Get Sunrise Sunset Time', () => {
        year.months.push(month);
        let sunrise = year.getSunriseSunsetTime(year.numericRepresentation, month, month.days[0]);
        expect(sunrise).toBe(0);

        PredefinedCalendar.setToPredefined(year, PredefinedCalendars.Gregorian);

        SimpleCalendar.instance = new SimpleCalendar();
        SimpleCalendar.instance.activeCalendar.year = year;

        sunrise = year.getSunriseSunsetTime(year.numericRepresentation, year.months[0], year.months[0].days[0], true, false);
        expect(sunrise).toBe(21600);

        sunrise = year.getSunriseSunsetTime(year.numericRepresentation, year.months[2], year.months[2].days[19], false, false);
        expect(sunrise).toBe(64800);

        sunrise = year.getSunriseSunsetTime(year.numericRepresentation, year.months[3], year.months[3].days[19], true, true);
        expect(sunrise).toBe(1618898400);

        sunrise = year.getSunriseSunsetTime(year.numericRepresentation, year.months[11], year.months[11].days[21], true, false);
        expect(sunrise).toBe(21600);

        year.seasons[1].startingMonth = 3;
        year.seasons[1].startingDay = 29;
        sunrise = year.getSunriseSunsetTime(year.numericRepresentation, year.months[0], year.months[0].days[0], true, false);
        expect(sunrise).toBe(21600);
    });

});
