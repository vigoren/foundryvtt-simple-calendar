/**
 * @jest-environment jsdom
 */
import "../../__mocks__/game";
import "../../__mocks__/form-application";
import "../../__mocks__/application";
import "../../__mocks__/handlebars";
import "../../__mocks__/event";
import "../../__mocks__/dialog";

import Year from "./year";
import Month from "./month";
import Importer from "./importer";
import {LeapYearRules} from "../constants";
import {Weekday} from "./weekday";
import Mock = jest.Mock;
import Season from "./season";
import Moon from "./moon";

describe('Importer Class Tests', () => {
    let y: Year;

    beforeEach(() => {
        y = new Year(0);
        y.months.push(new Month('M', 1, 0, 5));
        y.months.push(new Month('T', 2, 0, 15));
        y.months.push(new Month('W', 3, 0, 1));
        y.months[2].intercalary = true;
        y.weekdays.push(new Weekday(1, 'S'));
        y.seasons.push(new Season('S', 1, 1));
        y.moons.push(new Moon('M', 1));
        // @ts-ignore
        game.user.isGM = true;
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
        (<Mock>game.settings.get).mockReturnValueOnce(mockAboutTime);
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

        (<Mock>game.settings.get).mockReturnValueOnce(mockAboutTime);
        mockAboutTime.leap_year_rule = '(year) => Math.floor(year / 4) - Math.floor(year / 100) + Math.floor(year / 400)';
        Importer.importAboutTime(y);
        expect(y.leapYearRule.rule).toBe(LeapYearRules.Gregorian);

        (<Mock>game.settings.get).mockReturnValueOnce(mockAboutTime);
        mockAboutTime.leap_year_rule = '(year) =>  Math.floor(year / 8 + 1)';
        Importer.importAboutTime(y);
        expect(y.leapYearRule.rule).toBe(LeapYearRules.Custom);
        expect(y.leapYearRule.customMod).toBe(8);
    });

    test('Export About Time', async () => {
        await Importer.exportToAboutTime(y);
        //@ts-ignore
        expect(game.Gametime.DTC.saveUserCalendar).toHaveBeenCalledTimes(1);

        y.leapYearRule.rule = LeapYearRules.Gregorian;
        (<Mock>game.settings.get).mockReturnValueOnce(0);
        await Importer.exportToAboutTime(y);
        //@ts-ignore
        expect(game.Gametime.DTC.saveUserCalendar).toHaveBeenCalledTimes(2);

        y.leapYearRule.rule = LeapYearRules.Custom;
        y.leapYearRule.customMod = 8;
        await Importer.exportToAboutTime(y);
        //@ts-ignore
        expect(game.Gametime.DTC.saveUserCalendar).toHaveBeenCalledTimes(3);
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
            }],
            events: [],
            reEvents: []
        };

        (<Mock>game.settings.get).mockReturnValueOnce(mockCalendarWeather);
        Importer.importCalendarWeather(y);

        expect(y.time.hoursInDay).toBe(12);
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
        (<Mock>game.settings.get).mockReturnValueOnce(xport);
        await Importer.exportCalendarWeather(y);

        expect(xport.months.length).toBe(3);
        expect(xport.daysOfTheWeek.length).toBe(1);
        expect(xport.year).toBe(0);
        expect(xport.currentMonth).toBe(0);
        expect(xport.day).toBe(0);
        expect(window.location.reload).toHaveBeenCalledTimes(1);

        y.months[1].current = true;

        (<Mock>game.settings.get).mockReturnValueOnce(xport);
        await Importer.exportCalendarWeather(y);
        expect(xport.currentMonth).toBe(1);
        expect(window.location.reload).toHaveBeenCalledTimes(2);

        y.months[1].days[2].current = true;
        (<Mock>game.settings.get).mockReturnValueOnce(xport);
        await Importer.exportCalendarWeather(y);
        expect(xport.day).toBe(2);
        expect(window.location.reload).toHaveBeenCalledTimes(3);
    });
});
