/**
 * @jest-environment jsdom
 */
import "../../__mocks__/game";
import "../../__mocks__/form-application";
import "../../__mocks__/application";
import "../../__mocks__/handlebars";
import "../../__mocks__/event";
import "../../__mocks__/hooks";
import Time from "./time";

describe('Time Tests', () => {
    let t: Time;

    beforeEach(()=>{
        t = new Time();
    });

    test('Properties', () => {
        expect(Object.keys(t).length).toBe(8); //Make sure no new properties have been added
        expect(t.hoursInDay).toBe(24);
        expect(t.minutesInHour).toBe(60);
        expect(t.secondsInMinute).toBe(60);
        expect(t.gameTimeRatio).toBe(1);
        expect(t.seconds).toBe(0);
        expect(t.secondsPerDay).toBe(86400);
        expect(t.timeKeeper).toBeDefined();
        expect(t.combatRunning).toBe(false);
    });

    test('Clone', () => {
        const temp = t.clone();
        expect(temp).toStrictEqual(t);
    });

    test('Get Current Time', () => {
        expect(t.getCurrentTime()).toStrictEqual({"hour": "00", "minute": "00", "second": "00"});
        t.seconds = t.secondsPerDay - 1;
        expect(t.getCurrentTime()).toStrictEqual({"hour": "23", "minute": "59", "second": "59"});
    });

    test('To String', () => {
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
        expect(game.time.advance).toHaveBeenCalledTimes(1);
    });
});
