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
import API from "./api";
import Month from "./month";
import {Weekday} from "./weekday";
import {GameSystems, LeapYearRules} from "../constants";
import SpyInstance = jest.SpyInstance;
import Mock = jest.Mock;
import Season from "./season";
jest.spyOn(console, 'error').mockImplementation(() => {});


describe('API Class Tests', () => {
    let year: Year;
    let renderSpy: SpyInstance;
    beforeEach(() => {
        SimpleCalendar.instance = new SimpleCalendar();
        renderSpy = jest.spyOn(SimpleCalendar.instance, 'render');
        renderSpy.mockClear();
        year = new Year(1);
        year.months.push(new Month('M1', 1, 0, 30));
        year.months.push(new Month('M2', 2, 0, 30, 31));
        year.months[0].current = true;
        year.months[0].days[0].current = true;
    });

    test('Timestamp', () => {
        expect(API.timestamp()).toBe(0);
        SimpleCalendar.instance.currentYear = year;
        expect(API.timestamp()).toBe(5184000);
    });

    test('Timestamp Plus Interval', () => {
        expect(API.timestampPlusInterval(0, {})).toBe(0);
        SimpleCalendar.instance.currentYear = year;
        year.yearZero = 0;
        expect(API.timestampPlusInterval(0, {second: 1})).toBe(1);
        expect(API.timestampPlusInterval(0, {minute: 1})).toBe(60);
        expect(API.timestampPlusInterval(0, {hour: 1})).toBe(3600);
        expect(API.timestampPlusInterval(0, {hour: 1, minute: 1, second: 6})).toBe(3666);
        expect(API.timestampPlusInterval(0, {day: 1})).toBe(86400);
        expect(API.timestampPlusInterval(0, {month: 1})).toBe(2592000);
        expect(API.timestampPlusInterval(0, {year: 1})).toBe(5184000);

        year.leapYearRule.rule = LeapYearRules.Gregorian;
        expect(API.timestampPlusInterval(0, {day: 0})).toBe(0);
        expect(API.timestampPlusInterval(0, {})).toBe(0);

        expect(API.timestampPlusInterval(1623077754, {day: 0})).toBe(1623077754);
        expect(API.timestampPlusInterval(1623077754, {day: 1})).toBe(1623164154);

        expect(API.timestampPlusInterval(0, {second: 86401})).toBe(86401);

        expect(API.timestampPlusInterval(0, {month: 3})).toBe(7862400);
        expect(API.timestampPlusInterval(0, {hour: 2184})).toBe(7862400);
        expect(API.timestampPlusInterval(0, {minute: 131040})).toBe(7862400);
        expect(API.timestampPlusInterval(0, {second: 7862400})).toBe(7862400);
        expect(API.timestampPlusInterval(86399, {second: 1})).toBe(86400);

        year.gameSystem = GameSystems.PF2E;
        year.generalSettings.pf2eSync = true;
        expect(API.timestampPlusInterval(0, {day: 0})).toBe(0);
        expect(API.timestampPlusInterval(0, {})).toBe(0);
        expect(API.timestampPlusInterval(0, {day: 1})).toBe(86400);
    });

    test('Timestamp to Date', () => {
        year.seasons.push(new Season('', 1, 1));
        expect(API.timestampToDate(3600)).toStrictEqual({year: 0, month: 0, day: 0, dayOfTheWeek: 0, hour: 0, minute: 0, second: 0, monthName: "", yearName: "", yearZero: 0, weekdays: [], currentSeason: {}, isLeapYear: false, showWeekdayHeadings: true, yearPostfix: '', yearPrefix: '', dayOffset: 0, dayDisplay: '', "display": {"day": "", "daySuffix": "", "month": "", "monthName": "", "weekday": "", "year": "", "yearName": "", "yearPostfix": "", "yearPrefix": "", time:""}});
        SimpleCalendar.instance.currentYear = year;
        year.weekdays.push(new Weekday(1, 'W1'));
        const season = year.seasons[0].clone();
        season.startingMonth = 0;
        season.startingDay = 0;
        expect(API.timestampToDate(3600)).toStrictEqual({year: 0, month: 0, day: 0, dayOfTheWeek: 0, hour: 1, minute: 0, second: 0, monthName: "M1", yearName: "", yearZero: 0, weekdays: ["W1"], currentSeason: season, isLeapYear: false, showWeekdayHeadings: true, yearPostfix: '', yearPrefix: '', dayOffset: 0, dayDisplay: '1', "display": {"day": "1", "daySuffix": "", "month": "1", "monthName": "M1", "weekday": "W1", "year": "0", "yearName": "", "yearPostfix": "", "yearPrefix": "", time:"01:00:00"}});
        expect(API.timestampToDate(5184000)).toStrictEqual({year: 1, month: 0, day: 0, dayOfTheWeek: 0, hour: 0, minute: 0, second: 0, monthName: "M1", yearName: "", yearZero: 0, weekdays: ["W1"], currentSeason: season, isLeapYear: false, showWeekdayHeadings: true, yearPostfix: '', yearPrefix: '', dayOffset: 0, dayDisplay: '1', "display": {"day": "1", "daySuffix": "", "month": "1", "monthName": "M1", "weekday": "W1", "year": "1", "yearName": "", "yearPostfix": "", "yearPrefix": "", time:"00:00:00"}});
        expect(API.timestampToDate(5270400)).toStrictEqual({year: 1, month: 0, day: 1, dayOfTheWeek: 0, hour: 0, minute: 0, second: 0, monthName: "M1", yearName: "", yearZero: 0, weekdays: ["W1"], currentSeason: season, isLeapYear: false, showWeekdayHeadings: true, yearPostfix: '', yearPrefix: '', dayOffset: 0, dayDisplay: '2', "display": {"day": "2", "daySuffix": "", "month": "1", "monthName": "M1", "weekday": "W1", "year": "1", "yearName": "", "yearPostfix": "", "yearPrefix": "", time:"00:00:00"}});

        year.gameSystem = GameSystems.PF2E;
        year.generalSettings.pf2eSync = true;
        expect(API.timestampToDate(3600)).toStrictEqual({year: 0, month: 0, day: 0, dayOfTheWeek: 0, hour: 1, minute: 0, second: 0, monthName: "M1", yearName: "", yearZero: 0, weekdays: ["W1"], currentSeason: season, isLeapYear: false, showWeekdayHeadings: true, yearPostfix: '', yearPrefix: '', dayOffset: 0, dayDisplay: '1', "display": {"day": "1", "daySuffix": "", "month": "1", "monthName": "M1", "weekday": "W1", "year": "0", "yearName": "", "yearPostfix": "", "yearPrefix": "", time:"01:00:00"}});
        expect(API.timestampToDate(5184000)).toStrictEqual({year: 1, month: 0, day: 0, dayOfTheWeek: 0, hour: 0, minute: 0, second: 0, monthName: "M1", yearName: "", yearZero: 0, weekdays: ["W1"], currentSeason: season, isLeapYear: false, showWeekdayHeadings: true, yearPostfix: '', yearPrefix: '', dayOffset: 0, dayDisplay: '1', "display": {"day": "1", "daySuffix": "", "month": "1", "monthName": "M1", "weekday": "W1", "year": "1", "yearName": "", "yearPostfix": "", "yearPrefix": "", time:"00:00:00"}});
        expect(API.timestampToDate(5270400)).toStrictEqual({year: 1, month: 0, day: 1, dayOfTheWeek: 0, hour: 0, minute: 0, second: 0, monthName: "M1", yearName: "", yearZero: 0, weekdays: ["W1"], currentSeason: season, isLeapYear: false, showWeekdayHeadings: true, yearPostfix: '', yearPrefix: '', dayOffset: 0, dayDisplay: '2', "display": {"day": "2", "daySuffix": "", "month": "1", "monthName": "M1", "weekday": "W1", "year": "1", "yearName": "", "yearPostfix": "", "yearPrefix": "", time:"00:00:00"}});
    });

    test('Date to Timestamp', () => {
        expect(API.dateToTimestamp({})).toBe(0);
        SimpleCalendar.instance.currentYear = year;

        expect(API.dateToTimestamp({})).toBe(API.timestamp());
        expect(API.dateToTimestamp({year: 2021, month: 5, day: 10, hour: 15, minute: 54, second: 29})).toBe(10480377269);

        year.months[0].days[0].current = false;
        expect(API.dateToTimestamp({year: 2021, hour: 15, minute: 54, second: 29})).toBe(10476921269);
        year.months[0].current = false;
        expect(API.dateToTimestamp({year: 2021, hour: 15, minute: 54, second: 29})).toBe(10476921269);
    });

    test('Seconds To Interval', () => {
        expect(API.secondsToInterval(3600)).toStrictEqual({ year: 0, month: 0, day: 0, hour: 0, minute: 0, second: 0});
        SimpleCalendar.instance.currentYear = year;
        expect(API.secondsToInterval(3600)).toStrictEqual({ year: 0, month: 0, day: 0, hour: 1, minute: 0, second: 0});
    });

    test('Clock Status', () => {
        expect(API.clockStatus()).toStrictEqual({ started: false, stopped: true, paused: false });
        SimpleCalendar.instance.currentYear = year;
        expect(API.clockStatus()).toStrictEqual({ started: false, stopped: true, paused: false });
    });

    test('Show Calendar', () => {
        API.showCalendar();
        expect(renderSpy).toHaveBeenCalledTimes(0);

        SimpleCalendar.instance.currentYear = year;
        API.showCalendar();
        expect(renderSpy).toHaveBeenCalledTimes(1);

        // @ts-ignore
        API.showCalendar({});
        expect(renderSpy).toHaveBeenCalledTimes(2);

        // @ts-ignore
        API.showCalendar({year: '', month: '', day: ''});
        expect(renderSpy).toHaveBeenCalledTimes(3);

        // @ts-ignore
        API.showCalendar({year: 'a', month: 'b', day: 'c'});
        expect(renderSpy).toHaveBeenCalledTimes(4);

        API.showCalendar({year: 0, month: 0, day: 1});
        expect(renderSpy).toHaveBeenCalledTimes(5);

        year.leapYearRule.rule = LeapYearRules.Gregorian
        API.showCalendar({year: 4, month: -1, day: -1});
        expect(renderSpy).toHaveBeenCalledTimes(6);

        year.months[0].days[0].current = false;
        API.showCalendar({year: 0, month: 0, day: 0});
        expect(renderSpy).toHaveBeenCalledTimes(7);

        year.months[0].current = false;
        API.showCalendar({year: 0, month: 0, day: 0});
        expect(renderSpy).toHaveBeenCalledTimes(8);

        year.months[0].current = false;
        API.showCalendar({year: 0, month: 10, day: 0});
        expect(renderSpy).toHaveBeenCalledTimes(9);
    });

    test('Change Date', () => {
        API.changeDate({});
        expect(renderSpy).toHaveBeenCalledTimes(0);

        //@ts-ignore
        game.user.isGM = true;
        SimpleCalendar.instance.currentYear = year;

        API.changeDate({});
        expect(renderSpy).toHaveBeenCalledTimes(0);

        API.changeDate({year: 1});
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect(year.numericRepresentation).toBe(2);

        API.changeDate({month: 1});
        expect(renderSpy).toHaveBeenCalledTimes(2);
        expect(year.getMonth()?.numericRepresentation).toBe(2);

        API.changeDate({day: 1});
        expect(renderSpy).toHaveBeenCalledTimes(3);
        expect(year.getMonth()?.getDay()?.numericRepresentation).toBe(2);

        API.changeDate({second: 1});
        expect(renderSpy).toHaveBeenCalledTimes(4);
        expect(year.time.seconds).toBe(1);

        API.changeDate({second: 86401});
        expect(renderSpy).toHaveBeenCalledTimes(5);
        expect(year.getMonth()?.getDay()?.numericRepresentation).toBe(3);
        expect(year.time.seconds).toBe(2);

        //@ts-ignore
        game.user.isGM = false;
    });

    test('Set Date', () => {
        API.setDate({});
        expect(renderSpy).toHaveBeenCalledTimes(0);

        //@ts-ignore
        game.user.isGM = true;
        SimpleCalendar.instance.currentYear = year;
        API.setDate({year: 2021});
        expect(year.numericRepresentation).toBe(2021);

        API.setDate({month: 1, day: 1, hour: 1, minute: 1, second: 1});
        expect(year.numericRepresentation).toBe(2021);
        expect(year.months[1].current).toBe(true);
        expect(year.months[1].days[1].current).toBe(true);
        expect(year.time.seconds).toBe(3661);

        year.yearZero = 1;
        API.setDate({month: -1, day: -1});
        expect(year.getMonth()?.numericRepresentation).toBe(2);
        expect(year.getMonth()?.getDay()?.numericRepresentation).toBe(30);

        //@ts-ignore
        game.user.isGM = false;
    });

    test('Choose Random Date', () => {
        expect(API.chooseRandomDate()).toStrictEqual({year: 0, month: 0, day: 0, hour: 0, minute: 0, second: 0});

        SimpleCalendar.instance.currentYear = year;
        expect(API.chooseRandomDate()).toBeDefined();

        expect(API.chooseRandomDate({year: 2000, month: 1, day: 0, hour: 0, minute: 0, second: 0},{year: 2021, month: 2, day: 1, hour: 12, minute:20, second:30})).toBeDefined();
        expect(API.chooseRandomDate({year: 2000, month: 1, day: 3, hour: 0, minute: 0, second: 0},{year: 2000, month: 1, day: 3, hour: 0, minute: 0, second: 0})).toStrictEqual({year: 2000, month: 1, day: 3, hour: 0, minute: 0, second: 0});
        expect(API.chooseRandomDate({year: 2000, month: -1, day: -3, hour: 0, minute: 0, second: 0},{year: 2000, month: -1, day: -3, hour: 0, minute: 0, second: 0})).toStrictEqual({year: 2000, month: 1, day: 30, hour: 0, minute: 0, second: 0});
    });

    test('Is Primary GM', () => {
        expect(API.isPrimaryGM()).toBe(false);
        // @ts-ignore
        SimpleCalendar.instance = null;
        expect(API.isPrimaryGM()).toBe(false);
    });

    test('Start Clock', () => {
        expect(API.startClock()).toBe(false);
        SimpleCalendar.instance.currentYear = year;
        SimpleCalendar.instance.primary = true;
        expect(API.startClock()).toBe(true);
    });

    test('Stop Clock', () => {
        expect(API.stopClock()).toBe(false);
        SimpleCalendar.instance.currentYear = year;
        expect(API.stopClock()).toBe(true);
    });

    test('Get Current Season', () => {
        expect(API.getCurrentSeason()).toStrictEqual({name:'', color: ''});
        SimpleCalendar.instance.currentYear = year;
        year.seasons.push(new Season('s1', 1, 1));
        const s = API.getCurrentSeason()
        expect(s.name).toBe(year.seasons[0].name);
        year.months[0].days[0].current = false;
        expect(API.getCurrentSeason()).toStrictEqual({name:'', color: ''});
        year.months[0].current = false;
        expect(API.getCurrentSeason()).toStrictEqual({name:'', color: ''});
    });

    test('Get All Seasons', () => {
        expect(API.getAllSeasons().length).toBe(0);
        SimpleCalendar.instance.currentYear = year;
        year.seasons.push(new Season('s1', 1, 1));
        year.seasons.push(new Season('s1', 122, 1));
        expect(API.getAllSeasons().length).toBe(2);
    });

    test('Configure Calendar', async () => {
        //@ts-ignore
        game.user.isGM = false;
        let r = await API.configureCalendar(API.Calendars.Harptos);
        expect(r).toBe(false);

        SimpleCalendar.instance.currentYear = year;
        r = await API.configureCalendar(API.Calendars.Harptos);
        expect(r).toBe(false);

        //@ts-ignore
        game.user.isGM = true;
        r = await API.configureCalendar(123);
        expect(r).toBe(false);

        r = await API.configureCalendar(API.Calendars.Harptos);
        expect(r).toBe(true);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(16);

        r = await API.configureCalendar({asd: 1});
        expect(r).toBe(true);

        r = await API.configureCalendar({"currentDate":{"year":811,"month":4,"day":13,"seconds":5400},"generalSettings":{"gameWorldTimeIntegration":"mixed","showClock":true,"pf2eSync":true,"permissions":{"viewCalendar":{"player":true,"trustedPlayer":true,"assistantGameMaster":true},"addNotes":{"player":false,"trustedPlayer":false,"assistantGameMaster":false},"reorderNotes":{"player":false,"trustedPlayer":false,"assistantGameMaster":false},"changeDateTime":{"player":false,"trustedPlayer":false,"assistantGameMaster":false}}},"leapYearSettings":{"rule":"none","customMod":0},"monthSettings":[{"name":"Torsmånad","numericRepresentation":1,"numericRepresentationOffset":0,"numberOfDays":29,"numberOfLeapYearDays":29,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"Göjemånad","numericRepresentation":2,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"Ugglemånad","numericRepresentation":3,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"Gräsmånad","numericRepresentation":4,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"Blomstermånad","numericRepresentation":5,"numericRepresentationOffset":0,"numberOfDays":28,"numberOfLeapYearDays":28,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"Sommarmånad","numericRepresentation":6,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"Hömånad","numericRepresentation":7,"numericRepresentationOffset":0,"numberOfDays":32,"numberOfLeapYearDays":32,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"Skördemånad","numericRepresentation":8,"numericRepresentationOffset":0,"numberOfDays":29,"numberOfLeapYearDays":29,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"Höstmånad","numericRepresentation":9,"numericRepresentationOffset":0,"numberOfDays":27,"numberOfLeapYearDays":27,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"Slakmånad","numericRepresentation":10,"numericRepresentationOffset":0,"numberOfDays":29,"numberOfLeapYearDays":29,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"Vintermånad","numericRepresentation":11,"numericRepresentationOffset":0,"numberOfDays":32,"numberOfLeapYearDays":32,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null}],"moonSettings":[{"name":"Selia","cycleLength":33,"firstNewMoon":{"yearReset":"none","yearX":0,"year":810,"month":1,"day":4},"phases":[{"name":"Nymåne","length":1,"icon":"new","singleDay":true},{"name":"Första kvarten","length":7.25,"icon":"waxing-crescent","singleDay":false},{"name":"Halvmåne","length":1,"icon":"first-quarter","singleDay":true},{"name":"Andra kvarten","length":7.25,"icon":"waxing-gibbous","singleDay":false},{"name":"Fullmåne","length":1,"icon":"full","singleDay":true},{"name":"Tredje kvarten","length":7.25,"icon":"waning-gibbous","singleDay":false},{"name":"Halvmåne","length":1,"icon":"last-quarter","singleDay":true},{"name":"Sista kvarten","length":7.25,"icon":"waning-crescent","singleDay":false}],"color":"#ffffff","cycleDayAdjust":0},{"name":"Demira","cycleLength":328,"firstNewMoon":{"yearReset":"none","yearX":0,"year":810,"month":3,"day":22},"phases":[{"name":"Nymåne","length":1,"icon":"new","singleDay":true},{"name":"Första kvarten","length":81,"icon":"waxing-crescent","singleDay":false},{"name":"Halvmåne","length":1,"icon":"first-quarter","singleDay":true},{"name":"Andra kvarten","length":81,"icon":"waxing-gibbous","singleDay":false},{"name":"Fullmåne","length":1,"icon":"full","singleDay":true},{"name":"Tredje kvarten","length":81,"icon":"waning-gibbous","singleDay":false},{"name":"Halvmåne","length":1,"icon":"last-quarter","singleDay":true},{"name":"Sista kvarten","length":81,"icon":"waning-crescent","singleDay":false}],"color":"#ff0d00","cycleDayAdjust":0}],"noteCategories":[{"name":"Helgdag","color":"#148e94","textColor":"#FFFFFF"}],"seasonSettings":[{"name":"Sommar","startingMonth":5,"startingDay":5,"color":"#f3fff3"},{"name":"Höst","startingMonth":9,"startingDay":9,"color":"#fff7f2"},{"name":"Vinter","startingMonth":11,"startingDay":10,"color":"#f2f8ff"},{"name":"Vår","startingMonth":3,"startingDay":14,"color":"#fffce8"}],"timeSettings":{"hoursInDay":24,"minutesInHour":60,"secondsInMinute":60,"gameTimeRatio":5,"unifyGameAndClockPause":false,"updateFrequency":1},"weekdaySettings":[{"name":"Manadagher","numericRepresentation":1},{"name":"Tirsdagher","numericRepresentation":2},{"name":"Óðinsdagher","numericRepresentation":3},{"name":"Torsdagher","numericRepresentation":4},{"name":"Frejdagher","numericRepresentation":5},{"name":"Rûndagher","numericRepresentation":6},{"name":"Soldagher","numericRepresentation":7}],"yearSettings":{"numericRepresentation":811,"prefix":"","postfix":"E.C","showWeekdayHeadings":true,"firstWeekday":0,"yearZero":0,"yearNames":[],"yearNamingRule":"default","yearNamesStart":0}});
        expect(r).toBe(true);

        //@ts-ignore
        game.user.isGM = false;
    });

    test('Calendar Weather Import', async () => {
        let r = await API.calendarWeatherImport();
        expect(r).toBe(false);

        (<Mock>(<Game>game).settings.get).mockReturnValueOnce({
            months: [{
                name: 'Month 1',
                length: 10,
                leapLength: 10,
                isNumbered: true,
                abbrev: ''
            }],
            daysOfTheWeek: ["S","M","T"],
            year: 12,
            day: 5,
            numDayOfTheWeek: 2,
            first_day: 0,
            currentMonth: 2,
            currentWeekday: 'M',
            dateWordy: "",
            era: "",
            dayLength: 12,
            timeDisp: '',
            dateNum: '',
            weather: {},
            seasons: [],
            moons: [],
            events: [],
            reEvents: []
        });
        SimpleCalendar.instance.currentYear = year;
        r = await API.calendarWeatherImport();
        expect(r).toBe(true);
    });

});
