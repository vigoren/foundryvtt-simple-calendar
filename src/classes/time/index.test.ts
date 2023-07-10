/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import {jest, beforeEach, describe, expect, test} from '@jest/globals';
import Time from "./index";
import Calendar from "../calendar";
import {CalManager, updateCalManager} from "../index";
import CalendarManager from "../calendar/calendar-manager";

describe('Time Tests', () => {
    let t: Time;

    beforeEach(()=>{
        updateCalManager(new CalendarManager());
        t = new Time();
    });

    test('Properties', () => {
        expect(Object.keys(t).length).toBe(15); //Make sure no new properties have been added
        expect(t.hoursInDay).toBe(24);
        expect(t.minutesInHour).toBe(60);
        expect(t.secondsInMinute).toBe(60);
        expect(t.gameTimeRatio).toBe(1);
        expect(t.seconds).toBe(0);
        expect(t.secondsPerDay).toBe(86400);
        expect(t.combatRunning).toBe(false);
        expect(t.updateFrequency).toBe(1);
        expect(t.unifyGameAndClockPause).toBe(false);
    });

    test('Clone', () => {
        const temp = t.clone();
        expect(temp).toStrictEqual(t);
    });

    test('To Config', () => {
        const c = t.toConfig();
        expect(c.id).toBeDefined();
    });

    test('Load From Settings', () => {
        //@ts-ignore
        t.loadFromSettings({});
        expect(t.id).toBeDefined();
        expect(t.hoursInDay).toBe(24);

        //@ts-ignore
        t.loadFromSettings({hoursInDay:2, minutesInHour: 3, secondsInMinute: 4, gameTimeRatio: 1});
        expect(t.id).toBeDefined();
        expect(t.hoursInDay).toBe(2);

        //@ts-ignore
        t.loadFromSettings({id: 'id', hoursInDay:2, minutesInHour: 3, secondsInMinute: 4, gameTimeRatio: 1, unifyGameAndClockPause: false, updateFrequency: 1, secondsInCombatRound: 5});
        expect(t.id).toBe('id');
        expect(t.hoursInDay).toBe(2);
        expect(t.unifyGameAndClockPause).toBe(false);
        expect(t.updateFrequency).toBe(1);
    });

    test('Get Current Time', () => {
        expect(t.getCurrentTime()).toStrictEqual({"hour": 0, "minute": 0, "seconds": 0});
        t.seconds = t.secondsPerDay - 1;
        expect(t.getCurrentTime()).toStrictEqual({"hour": 23, "minute": 59, "seconds": 59});
    });

    test('To String', () => {
        const tCal = new Calendar('', '');
        jest.spyOn(CalManager, 'getActiveCalendar').mockReturnValue(tCal);
        expect(t.toString()).toBe('00:00:00');
    });

    test('Set Time', () => {
        t.setTime(23,59,59);
        expect(t.seconds).toBe(t.secondsPerDay-1);
        t.setTime();
        expect(t.seconds).toBe(0);
    });

    test('Change Time', () => {
        let r = t.changeTime(0,0,1);
        expect(t.seconds).toBe(1);
        expect(r).toBe(0);

        r = t.changeTime(-1);
        expect(t.seconds).toBe(82801);
        expect(r).toBe(-1);

        r = t.changeTime(1);
        expect(t.seconds).toBe(1);
        expect(r).toBe(1);

        r = t.changeTime();
        expect(t.seconds).toBe(1);
        expect(r).toBe(0);
    });

    test('Get Total Seconds', () => {
        expect(t.getTotalSeconds(1, false)).toBe(86400);
        expect(t.getTotalSeconds(10, false)).toBe(864000);
        t.seconds = 10;
        expect(t.getTotalSeconds(1)).toBe(86410);
    });

    test('Set World Time', () => {
        t.setWorldTime(100);
        expect((<Game>game).time.advance).toHaveBeenCalledTimes(1);
    });
});
