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
import SimpleCalendar from "./simple-calendar";
import Year from "./year";

describe('Time Tests', () => {
    let t: Time;

    beforeEach(()=>{
        t = new Time();
    });

    test('Properties', () => {
        expect(Object.keys(t).length).toBe(7); //Make sure no new properties have been added
        expect(t.hoursInDay).toBe(24);
        expect(t.minutesInHour).toBe(60);
        expect(t.secondsInMinute).toBe(60);
        expect(t.gameTimeRatio).toBe(1);
        expect(t.seconds).toBe(0);
        expect(t.secondsPerDay).toBe(86400);
        expect(t.keeper).toBeUndefined();
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

    test('Get Clock Class', () => {
        expect(t.getClockClass()).toBe('stopped');
        t.keeper = 2;
        expect(t.getClockClass()).toBe('paused');
        //@ts-ignore
        game.paused = false;
        expect(t.getClockClass()).toBe('started');
        t.combatRunning = true;
        expect(t.getClockClass()).toBe('paused');
    });

    test('Set World Time', () => {
        t.setWorldTime(100);
        expect(game.time.advance).toHaveBeenCalledTimes(1);
    });

    test('Start Time Keeper', () => {
        SimpleCalendar.instance = new SimpleCalendar();
        SimpleCalendar.instance.currentYear = new Year(0);
        window.setInterval = jest.fn().mockReturnValue(2);
        t.startTimeKeeper();
        expect(window.setInterval).toHaveBeenCalledTimes(1);
        t.startTimeKeeper();
        expect(window.setInterval).toHaveBeenCalledTimes(1);
    });

    test('Stop Time Keeper', () => {
        window.clearInterval = jest.fn();
        t.stopTimeKeeper();
        expect(window.clearInterval).not.toHaveBeenCalled();
        t.keeper = 2;
        t.stopTimeKeeper();
        expect(window.clearInterval).toHaveBeenCalledTimes(1);
        t.stopTimeKeeper();
        expect(window.clearInterval).toHaveBeenCalledTimes(1);
    });

    test('Time Keeper', () => {
        SimpleCalendar.instance = new SimpleCalendar();
        //@ts-ignore
        game.paused = true;
        t.combatRunning = false;
        t.timeKeeper();
        //@ts-ignore
        game.paused = false;
        t.combatRunning = true;
        t.timeKeeper();

        t.combatRunning = false;
        t.timeKeeper();

        t.seconds = 86400;
        t.timeKeeper();
        expect(t.seconds).toBe(30);

        SimpleCalendar.instance.currentYear = new Year(1);
        t.timeKeeper();
        t.seconds = 86400;
        t.timeKeeper();
        expect(t.seconds).toBe(30);
    });

    test('Update Users', () => {
        t.updateUsers();
        expect(game.socket.emit).not.toHaveBeenCalled();
        //@ts-ignore
        game.user.isGM = true;
        t.updateUsers();
        expect(game.socket.emit).toHaveBeenCalledTimes(1);
    });
});
