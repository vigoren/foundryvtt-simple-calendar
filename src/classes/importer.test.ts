/**
 * @jest-environment jsdom
 */
import "../../__mocks__/game";
import "../../__mocks__/form-application";
import "../../__mocks__/application";
import "../../__mocks__/handlebars";
import "../../__mocks__/event";
import "../../__mocks__/dialog";
import "../../__mocks__/hooks";
import "../../__mocks__/crypto";

import SimpleCalendar from "./simple-calendar";
import Year from "./year";
import Month from "./month";
import Importer from "./importer";
import {GameSystems, LeapYearRules} from "../constants";
import {Weekday} from "./weekday";
import Season from "./season";
import Moon from "./moon";
import Mock = jest.Mock;

describe('Importer Class Tests', () => {
    let y: Year;

    beforeEach(() => {
        jest.spyOn(console,'error').mockImplementation();
        SimpleCalendar.instance = new SimpleCalendar();
        y = new Year(0);
        y.months.push(new Month('M', 1, 0, 5));
        y.months.push(new Month('T', 2, 0, 15));
        y.months.push(new Month('W', 3, 0, 1));
        y.months[2].intercalary = true;
        y.weekdays.push(new Weekday(1, 'S'));
        y.seasons.push(new Season('S', 1, 1));
        y.moons.push(new Moon('M', 1));
        SimpleCalendar.instance.activeCalendar.year = y;
        // @ts-ignore
        game.user.isGM = true;
        (<Mock>(<Game>game).settings.set).mockClear();
    });

    test('About Time v1', () => {
        expect(Importer.aboutTimeV1()).toBe(false);
        (<Mock>(<Game>game).modules.get).mockReturnValueOnce({active: true, data: {version: 'a'}});
        expect(Importer.aboutTimeV1()).toBe(false);
        (<Mock>(<Game>game).modules.get).mockReturnValueOnce({active: true, data: {version: '0'}});
        expect(Importer.aboutTimeV1()).toBe(false);
        (<Mock>(<Game>game).modules.get).mockReturnValueOnce({active: true, data: {version: '1'}});
        expect(Importer.aboutTimeV1()).toBe(true);
    });

    test('Import About Time', () => {
        const mockAboutTime = {
            "clock_start_year": 1,
            "first_day": 1,
            "hours_per_day": 12,
            "seconds_per_minute": 30,
            "minutes_per_hour": 30,
            "has_year_0": true,
            "month_len": {
                "Month 1": {
                    "days": [10,10],
                    "intercalary": false
                },
                "Month 2": {
                    "days": [10,11],
                    "intercalary": false
                },
                "Month 3": {
                    "days": [1,1],
                    "intercalary": true
                }
            },
            "_month_len": {},
            "weekdays": ["S","M","T"],
            "leap_year_rule": '',
            "notes": {}
        };
        Importer.importAboutTime(y);
        (<Mock>(<Game>game).settings.get).mockReturnValueOnce(mockAboutTime);
        Importer.importAboutTime(y);

        expect(y.time.hoursInDay).toBe(12);
        expect(y.time.minutesInHour).toBe(30);
        expect(y.time.secondsInMinute).toBe(30);
        expect(y.weekdays.length).toBe(3);
        expect(y.weekdays[0].name).toBe('S');
        expect(y.weekdays[1].name).toBe('M');
        expect(y.weekdays[2].name).toBe('T');
        expect(y.months.length).toBe(3);
        expect(y.months[0].name).toBe('Month 1');
        expect(y.months[0].numberOfDays).toBe(10);
        expect(y.months[0].numberOfLeapYearDays).toBe(10);
        expect(y.months[0].intercalary).toBe(false);
        expect(y.months[1].name).toBe('Month 2');
        expect(y.months[1].numberOfDays).toBe(10);
        expect(y.months[1].numberOfLeapYearDays).toBe(11);
        expect(y.months[1].intercalary).toBe(false);
        expect(y.months[2].name).toBe('Month 3');
        expect(y.months[2].numberOfDays).toBe(1);
        expect(y.months[2].numberOfLeapYearDays).toBe(1);
        expect(y.months[2].intercalary).toBe(true);
        expect(y.leapYearRule.rule).toBe(LeapYearRules.None);

        (<Mock>(<Game>game).settings.get).mockReturnValueOnce(mockAboutTime);
        mockAboutTime.leap_year_rule = '(year) => Math.floor(year / 4) - Math.floor(year / 100) + Math.floor(year / 400)';
        Importer.importAboutTime(y);
        expect(y.leapYearRule.rule).toBe(LeapYearRules.Gregorian);

        (<Mock>(<Game>game).settings.get).mockReturnValueOnce(mockAboutTime);
        mockAboutTime.leap_year_rule = '(year) =>  Math.floor(year / 8 + 1)';
        Importer.importAboutTime(y);
        expect(y.leapYearRule.rule).toBe(LeapYearRules.Custom);
        expect(y.leapYearRule.customMod).toBe(8);
    });

    test('Export About Time', async () => {

        (<Mock>(<Game>game).modules.get).mockReturnValueOnce({active: true, data: {version: '1'}});
        await Importer.exportToAboutTime(y);

        await Importer.exportToAboutTime(y);
        //@ts-ignore
        expect(game.settings.set).toHaveBeenCalledTimes(3);

        y.leapYearRule.rule = LeapYearRules.Gregorian;
        (<Mock>(<Game>game).settings.get).mockReturnValueOnce(0);
        await Importer.exportToAboutTime(y);
        //@ts-ignore
        expect(game.settings.set).toHaveBeenCalledTimes(5);

        y.leapYearRule.rule = LeapYearRules.Custom;
        y.leapYearRule.customMod = 8;
        SimpleCalendar.instance.activeCalendar.gameSystem = GameSystems.PF2E;
        await Importer.exportToAboutTime(y);
        //@ts-ignore
        expect(game.settings.set).toHaveBeenCalledTimes(7);
    });

    test('Import Calendar Weather', () => {
        const mockCalendarWeather = {
            months: [
                {
                    name: 'Month 1',
                    length: 10,
                    leapLength: 10,
                    isNumbered: true,
                    abbrev: ''
                },
                {
                    name: 'Month 2',
                    length: 10,
                    leapLength: 11,
                    isNumbered: true,
                    abbrev: ''
                },
                {
                    name: 'Month 3',
                    length: 1,
                    leapLength: 1,
                    isNumbered: false,
                    abbrev: ''
                },
                {
                    name: 'Month 4',
                    length: "asd",
                    leapLength: "asd",
                    isNumbered: true,
                    abbrev: ''
                }

            ],
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
            seasons: [
                {
                    name: 'Spring',
                    rolltable: '',
                    date: {
                        month: '',
                        day: 1,
                        combined: '-1'
                    },
                    temp: '=',
                    humidity: '=',
                    color: 'red',
                    dawn: 6,
                    dusk: 19
                }
            ],
            moons: [{
                name:'moon',
                cycleLength: 0,
                cyclePercent:  0,
                lunarEclipseChange:  0,
                solarEclipseChange:  0,
                referenceTime:  0,
                referencePercent:  0,
                isWaxing: false
            }],
            events: [
                { "name":"event", "date":{ "month":"", "day":1, "year":"4721", "hours":19, "minutes":36, "seconds":18, "combined":"-1-4721" }, "text":"", "allDay":false },
                { "name":"event", "date":{ "month":"1", "day":1, "year":"4721", "hours":19, "minutes":36, "seconds":18, "combined":"-1-4721" }, "text":"", "allDay":false },
            ],
            reEvents: [
                { "name":"rere", "date":{ "month":"", "day":6, "combined":"-6" }, "text":"" },
                { "name":"rere", "date":{ "month":"2", "day":6, "combined":"-6" }, "text":"" }
            ]
        };
        Importer.importCalendarWeather(y);
        (<Mock>(<Game>game).settings.get).mockReturnValueOnce(mockCalendarWeather);
        Importer.importCalendarWeather(y);

        //expect(y.time.hoursInDay).toBe(12);
        expect(y.time.minutesInHour).toBe(60);
        expect(y.time.secondsInMinute).toBe(60);
        expect(y.weekdays.length).toBe(3);
        expect(y.weekdays[0].name).toBe('S');
        expect(y.weekdays[1].name).toBe('M');
        expect(y.weekdays[2].name).toBe('T');
        expect(y.months.length).toBe(4);
        expect(y.months[0].name).toBe('Month 1');
        expect(y.months[0].numberOfDays).toBe(10);
        expect(y.months[0].numberOfLeapYearDays).toBe(10);
        expect(y.months[0].intercalary).toBe(false);
        expect(y.months[1].name).toBe('Month 2');
        expect(y.months[1].numberOfDays).toBe(10);
        expect(y.months[1].numberOfLeapYearDays).toBe(11);
        expect(y.months[1].intercalary).toBe(false);
        expect(y.months[2].name).toBe('Month 3');
        expect(y.months[2].numberOfDays).toBe(1);
        expect(y.months[2].numberOfLeapYearDays).toBe(1);
        expect(y.months[2].intercalary).toBe(true);
        expect(y.months[3].name).toBe('Month 4');
        expect(y.months[3].numberOfDays).toBe(1);
        expect(y.months[3].numberOfLeapYearDays).toBe(1);
        expect(y.months[3].intercalary).toBe(false);
        expect(y.leapYearRule.rule).toBe(LeapYearRules.None);

        mockCalendarWeather.seasons[0].date.month = '1';
        mockCalendarWeather.seasons[0].color = 'orange';
        mockCalendarWeather.moons[0].isWaxing = true;

        (<Mock>(<Game>game).settings.get).mockReturnValueOnce(mockCalendarWeather);
        Importer.importCalendarWeather(y);
        expect(y.seasons[0].startingMonth).toBe(1);
        expect(y.seasons[0].color).toBe('#b1692e');

        mockCalendarWeather.seasons[0].color = 'yellow';
        (<Mock>(<Game>game).settings.get).mockReturnValueOnce(mockCalendarWeather);
        Importer.importCalendarWeather(y);
        expect(y.seasons[0].color).toBe('#b99946');

        mockCalendarWeather.seasons[0].color = 'green';
        (<Mock>(<Game>game).settings.get).mockReturnValueOnce(mockCalendarWeather);
        Importer.importCalendarWeather(y);
        expect(y.seasons[0].color).toBe('#258e25');

        mockCalendarWeather.seasons[0].color = 'blue';
        (<Mock>(<Game>game).settings.get).mockReturnValueOnce(mockCalendarWeather);
        Importer.importCalendarWeather(y);
        expect(y.seasons[0].color).toBe('#5b80a5');

        // @ts-ignore
        SimpleCalendar.instance = null;
        (<Mock>(<Game>game).settings.get).mockReturnValueOnce(mockCalendarWeather);
        Importer.importCalendarWeather(y);
    });

    test('Export Calendar Weather', async () => {
        //@ts-ignore
        delete window.location;
        //@ts-ignore
        window.location = {reload: jest.fn()};
        const xport = {
            months: [],
            daysOfTheWeek: [],
            year: 0,
            currentMonth: 0,
            day: 0,
            numDayOfTheWeek: 0,
            currentWeekday: '',
            era: '',
            dayLength: 0,
            first_day: 0
        };
        await Importer.exportCalendarWeather(y);
        (<Mock>(<Game>game).settings.get).mockReturnValueOnce(xport);
        await Importer.exportCalendarWeather(y);

        expect(xport.months.length).toBe(3);
        expect(xport.daysOfTheWeek.length).toBe(1);
        expect(xport.year).toBe(0);
        expect(xport.currentMonth).toBe(0);
        expect(xport.day).toBe(0);
        expect(window.location.reload).toHaveBeenCalledTimes(1);

        y.months[1].current = true;

        (<Mock>(<Game>game).settings.get).mockReturnValueOnce(xport);
        await Importer.exportCalendarWeather(y);
        expect(xport.currentMonth).toBe(1);
        expect(window.location.reload).toHaveBeenCalledTimes(2);

        y.months[1].days[2].current = true;
        (<Mock>(<Game>game).settings.get).mockReturnValueOnce(xport);
        await Importer.exportCalendarWeather(y);
        expect(xport.day).toBe(2);
        expect(window.location.reload).toHaveBeenCalledTimes(3);
    });
});
