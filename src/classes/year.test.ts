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
import Year from "./year";
import Month from "./month";
import {Weekday} from "./weekday";
import {GameWorldTimeIntegrations, LeapYearRules} from "../constants";
import LeapYear from "./leap-year";
import Season from "./season";
import Moon from "./moon";
import SimpleCalendar from "./simple-calendar";

describe('Year Class Tests', () => {
    let year: Year;
    let year2: Year;
    let month: Month;

    beforeEach(() => {
        year = new Year(0);
        month = new Month("Test", 1, 0, 30);
        year2 = new Year(2020);
    });

    test('Properties', () => {
        expect(Object.keys(year).length).toBe(16); //Make sure no new properties have been added
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
        expect(year.firstWeekday).toBe(0);
        expect(year.time).toBeDefined();
        expect(year.timeChangeTriggered).toBe(false);
        expect(year.combatChangeTriggered).toBe(false);
        expect(year.generalSettings).toStrictEqual({gameWorldTimeIntegration: GameWorldTimeIntegrations.None, showClock: false, playersAddNotes: false });
        expect(year.seasons).toStrictEqual([]);
    });

    test('To Template', () => {
        year.weekdays.push(new Weekday(1, 'S'));
        let t = year.toTemplate();
        expect(Object.keys(t).length).toBe(17); //Make sure no new properties have been added
        expect(t.weekdays).toStrictEqual(year.weekdays.map(w=>w.toTemplate()));
        expect(t.display).toBe("0");
        expect(t.numericRepresentation).toBe(0);
        expect(t.selectedDisplayYear).toBe("0");
        expect(t.selectedDisplayMonth).toBe("");
        expect(t.selectedDisplayDay).toBe("");
        expect(t.visibleMonth).toBeUndefined();
        expect(t.weeks).toStrictEqual([]);
        expect(t.showWeekdayHeaders).toBe(true);
        expect(t.firstWeekday).toBe(0);
        expect(t.showClock).toBe(false);
        expect(t.showDateControls).toBe(true);
        expect(t.showTimeControls).toBe(false);
        expect(t.clockClass).toBe("stopped");
        expect(t.currentTime).toStrictEqual({hour:"00", minute:"00", second: "00"});
        expect(t.currentSeasonColor).toBe("");
        expect(t.currentSeasonName).toBe("");

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

        year.generalSettings.showClock = true;
        year.generalSettings.gameWorldTimeIntegration = GameWorldTimeIntegrations.ThirdParty;
        t = year.toTemplate();
        expect(t.showDateControls).toBe(false);
        expect(t.showTimeControls).toBe(false);



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
        year.months.push(new Month("Test 2", 2, 0, 22));
        year.months[1].visible = true;
        expect(year.visibleMonthStartingDayOfWeek()).toBe(2);

        year.months[1].visible = false;
        expect(year.visibleMonthStartingDayOfWeek()).toBe(0);

        year.months.push(new Month("Test 3", 3, 0, 2));
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

        year.months.push(new Month("Test 3", 3, 0, 2));
        year.months.push(new Month("Test 2", 2, 0, 22));
        year.months[1].intercalary = true;
        expect(year.dayOfTheWeek(year.numericRepresentation, 3, 2)).toBe(3);

        year.leapYearRule = new LeapYear();
        year.leapYearRule.rule = LeapYearRules.Gregorian;
        year.numericRepresentation = 4;
        expect(year.dayOfTheWeek(year.numericRepresentation, 3, 2)).toBe(1);
    });

    test('Date to Days', () => {
        year.months.push(month);
        year.months.push(new Month("Test 2", 2, 0, 22, 23));
        expect(year.dateToDays(0,0,1)).toBe(1);
        expect(year.dateToDays(5,0,1)).toBe(261);
        year.leapYearRule = new LeapYear();
        year.leapYearRule.rule = LeapYearRules.Gregorian;
        expect(year.dateToDays(5,0,1, true)).toBe(263);
        year.months[0].intercalary = true;
        expect(year.dateToDays(5,0,1, true)).toBe(113);
        year.months[0].intercalaryInclude = true;
        expect(year.dateToDays(5,2,1, true)).toBe(293);
    });

    test('Sync Time', () => {
        //@ts-ignore
        game.time.advance.mockClear();
        year.syncTime();
        expect(game.time.advance).not.toHaveBeenCalled();
        //@ts-ignore
        game.user.isGM = true;
        year.syncTime()
        expect(game.time.advance).not.toHaveBeenCalled();
        year.generalSettings.gameWorldTimeIntegration = GameWorldTimeIntegrations.Self;
        year.months.push(month);
        year.syncTime()
        expect(game.time.advance).not.toHaveBeenCalled();

        month.current = true;
        year.syncTime()
        expect(game.time.advance).toHaveBeenCalledTimes(1);
        month.days[0].current = true;
        year.syncTime()
        expect(game.time.advance).toHaveBeenCalledTimes(2);
    });

    test('Seconds To Date', () => {
        year.months.push(month);
        year.months.push(new Month("Test 2", 2, 0, 22, 23));
        year.months[1].intercalary = true;
        expect(year.secondsToDate(10)).toStrictEqual({year: 0, month: 0, day: 1, hour: 0, minute: 0, seconds: 10});
        expect(year.secondsToDate(70)).toStrictEqual({year: 0, month: 0, day: 1, hour: 0, minute: 1, seconds: 10});
        expect(year.secondsToDate(3670)).toStrictEqual({year: 0, month: 0, day: 1, hour: 1, minute: 1, seconds: 10});
        expect(year.secondsToDate(90070)).toStrictEqual({year: 0, month: 0, day: 2, hour: 1, minute: 1, seconds: 10});
        expect(year.secondsToDate(2682070)).toStrictEqual({year: 1, month: 0, day: 2, hour: 1, minute: 1, seconds: 10});
        year.months[1].intercalary = false;
        year.leapYearRule = new LeapYear();
        year.leapYearRule.rule = LeapYearRules.Gregorian;
        expect(year.secondsToDate(20908800)).toStrictEqual({year: 4, month: 1, day: 4, hour: 0, minute: 0, seconds: 0});
    });

    test('Update Time', () => {
        year.months.push(month);
        year.months.push(new Month("Test 2", 2, 0, 22, 23));
        year.updateTime({year: 1, month: 1, day: 3, hour: 4, minute: 5, seconds: 6});
        expect(year.numericRepresentation).toBe(1);
        expect(year.months[1].current).toBe(true);
        expect(year.months[1].days[2].current).toBe(true);
        expect(year.time.seconds).toBe(14706);
    });

    test('Set From Time', () => {
        year.months.push(month);
        month.current = true;
        //@ts-ignore
        game.user.isGM = false;
        year.time.seconds = 60;
        year.timeChangeTriggered = true;
        year.setFromTime(120, 0);
        expect(year.time.seconds).toBe(60);
        expect(year.timeChangeTriggered).toBe(false);
        year.timeChangeTriggered = true;
        year.setFromTime(120, 60);
        expect(year.time.seconds).toBe(60);
        expect(year.timeChangeTriggered).toBe(false);

        year.generalSettings.gameWorldTimeIntegration = GameWorldTimeIntegrations.Self;
        year.timeChangeTriggered = false;
        year.setFromTime(120, 60);
        expect(year.time.seconds).toBe(60);
        expect(year.timeChangeTriggered).toBe(false);

        year.timeChangeTriggered = true;
        year.setFromTime(120, 60);
        expect(year.time.seconds).toBe(60);
        expect(year.timeChangeTriggered).toBe(false);

        year.generalSettings.gameWorldTimeIntegration = GameWorldTimeIntegrations.ThirdParty;
        year.setFromTime(120, 60);
        expect(year.time.seconds).toBe(120);

        year.time.seconds = 60;
        //@ts-ignore
        game.user.isGM = true;
        SimpleCalendar.instance = new SimpleCalendar();
        SimpleCalendar.instance.currentYear = year;
        SimpleCalendar.instance.primary = true;
        year.setFromTime(120, 60);
        expect(year.time.seconds).toBe(120);
        expect(game.settings.set).toHaveBeenCalledTimes(1);

        year.time.seconds = 60;
        year.generalSettings.gameWorldTimeIntegration = GameWorldTimeIntegrations.Self;
        year.combatChangeTriggered = true;
        year.setFromTime(120, 60);
        expect(year.time.seconds).toBe(120);
        expect(game.settings.set).toHaveBeenCalledTimes(2);
    });

    test('Get Current Season', () => {
        let data = year.getCurrentSeason();
        expect(data.name).toBe('');
        expect(data.color).toBe('');

        year.months.push(month);
        year.months.push(new Month('Month 2', 2, 0, 20));
        month.current = true;
        data = year.getCurrentSeason();
        expect(data.name).toBe('');
        expect(data.color).toBe('');

        month.days[0].current = true;
        data = year.getCurrentSeason();
        expect(data.name).toBe('');
        expect(data.color).toBe('');

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
        year.seasons[1].color = 'custom';
        year.seasons[1].customColor = '#000000';
        data = year.getCurrentSeason();
        expect(data.name).toBe('Winter');
        expect(data.color).toBe('#000000');

        year.months[1].days[9].current = false;
        data = year.getCurrentSeason();
        expect(data.name).toBe('Spring');
        expect(data.color).toBe('#ffffff');
    });

});
