/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import {jest, beforeEach, describe, expect, test} from '@jest/globals';

import TimeKeeper from "./time-keeper";
import {GameWorldTimeIntegrations, TimeKeeperStatus} from "../../constants";
import {CalManager, SC, updateCalManager, updateSC} from "../index";
import CalendarManager from "../calendar/calendar-manager";
import Calendar from "../calendar";
import SCController from "../s-c-controller";
import {Hook} from "../api/hook";
import GameSockets from "../foundry-interfacing/game-sockets";

describe('Time Keeper Class Tests', () => {
    let tk: TimeKeeper

    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(()=>{});
        updateCalManager(new CalendarManager());
        updateSC(new SCController());
        tk = new TimeKeeper('test',1);
        //@ts-ignore
        game.paused = true;
        //@ts-ignore
        game.user.isGM = false;
        SC.primary = false;
        //@ts-ignore
        tk.intervalNumber = undefined;
    });

    test('Update Frequency (Set)', () => {
        //@ts-ignore
        tk.intervalNumber = 123;
        tk.updateFrequency = 2;
        //@ts-ignore
        expect(tk.intervalNumber).not.toBe(123);
    });


    test('Start/Stop/Pause', () => {
        const tCal = new Calendar('', '');
        jest.spyOn(CalManager, 'getCalendar').mockReturnValue(tCal);
        //@ts-ignore
        game.paused = false;
        tk.start();
        //@ts-ignore
        expect(tk.intervalNumber).toBeDefined();
        //@ts-ignore
        expect(tk.saveIntervalNumber).toBeUndefined();


        tk.start();
        //@ts-ignore
        expect(tk.intervalNumber).toBeDefined();
        //@ts-ignore
        expect(tk.saveIntervalNumber).toBeUndefined();

        tk.stop();
        //@ts-ignore
        expect(tk.intervalNumber).toBeUndefined();
        //@ts-ignore
        expect(tk.saveIntervalNumber).toBeUndefined();

        tk.stop();
        //@ts-ignore
        expect(tk.intervalNumber).toBeUndefined();
        //@ts-ignore
        expect(tk.saveIntervalNumber).toBeUndefined();

        //@ts-ignore
        game.user.isGM = true;
        SC.primary = true;

        tk.start();
        //@ts-ignore
        expect(tk.intervalNumber).toBeDefined();
        //@ts-ignore
        expect(tk.saveIntervalNumber).toBeDefined();

        tk.stop();
        //@ts-ignore
        expect(tk.intervalNumber).toBeUndefined();
        //@ts-ignore
        expect(tk.saveIntervalNumber).toBeUndefined();

        tCal.time.unifyGameAndClockPause = true;
        tk.start();
        //@ts-ignore
        expect(tk.intervalNumber).toBeDefined();
        tk.start();
        //@ts-ignore
        expect(tk.intervalNumber).toBeDefined();
        //@ts-ignore
        tk.status = TimeKeeperStatus.Paused;
        //@ts-ignore
        game.paused = true;
        tk.start();

        tk.stop();
        //@ts-ignore
        expect(tk.intervalNumber).toBeUndefined();
        //@ts-ignore
        expect(tk.saveIntervalNumber).toBeUndefined();

        //@ts-ignore
        tk.status = TimeKeeperStatus.Stopped;
        //@ts-ignore
        expect(tk.pauseClicked).toBe(false);
        tk.pause();
        //@ts-ignore
        expect(tk.pauseClicked).toBe(false);
        //@ts-ignore
        tk.status = TimeKeeperStatus.Started;
        tk.pause();
        //@ts-ignore
        expect(tk.pauseClicked).toBe(true);
        //@ts-ignore
        expect(tk.status).toBe(TimeKeeperStatus.Paused);
    });

    test('Get Status', () => {
        expect(tk.getStatus()).toBe(TimeKeeperStatus.Stopped);
    });

    test('Set Status', () => {
        const tCal = new Calendar('', '');
        jest.spyOn(CalManager, 'getCalendar').mockReturnValue(tCal);
        expect(tk.getStatus()).toBe(TimeKeeperStatus.Stopped);
        tk.setStatus(TimeKeeperStatus.Started);
        expect(tk.getStatus()).toBe(TimeKeeperStatus.Started);
    });

    test('Interval', () => {
        const tCal = new Calendar('', '');
        jest.spyOn(CalManager, 'getCalendar').mockReturnValue(tCal);
        jest.spyOn(tCal, 'changeDateTime').mockImplementation(() => {return true;});
        jest.spyOn(Hook, 'emit').mockImplementation(() => {});
        jest.spyOn(GameSockets, 'emit').mockImplementation(async () => {return true;});
        //@ts-ignore
        game.paused = false;

        //@ts-ignore
        tk.interval();
        expect(CalManager.getCalendar).not.toHaveBeenCalledTimes(2);
        expect(tCal.changeDateTime).not.toHaveBeenCalled();

        //@ts-ignore
        tk.intervalNumber = 2;
        //@ts-ignore
        tk.interval();
        expect(CalManager.getCalendar).toHaveBeenCalledTimes(3);
        expect(tCal.changeDateTime).toHaveBeenCalledTimes(1);
        expect(Hook.emit).toHaveBeenCalled();

        //@ts-ignore
        game.user.isGM = true;
        SC.primary = true;
        tCal.generalSettings.gameWorldTimeIntegration = GameWorldTimeIntegrations.None;
        //@ts-ignore
        tk.interval();
    });

    test('Save Interval', () => {
        const tCal = new Calendar('', '');
        jest.spyOn(CalManager, 'getCalendar').mockReturnValue(tCal);
        jest.spyOn(CalManager, 'saveCalendars').mockImplementation(async () => {});
        jest.spyOn(tCal, 'syncTime').mockImplementation(async () => {});
        jest.spyOn(GameSockets, 'emit').mockImplementation(async () => {return true;});
        //@ts-ignore
        game.paused = false;

        //@ts-ignore
        tk.saveInterval();
        expect(CalManager.getCalendar).not.toHaveBeenCalled();
        expect(CalManager.saveCalendars).not.toHaveBeenCalled();

        //@ts-ignore
        tk.status = TimeKeeperStatus.Started;

        //@ts-ignore
        tk.saveInterval();
        expect(CalManager.getCalendar).toHaveBeenCalledTimes(1);

        //@ts-ignore
        game.user.isGM = true;
        SC.primary = true;

        //@ts-ignore
        tk.saveInterval();
        expect(CalManager.getCalendar).toHaveBeenCalledTimes(2);

        tCal.generalSettings.gameWorldTimeIntegration = GameWorldTimeIntegrations.None;
        //@ts-ignore
        tk.saveInterval();
        expect(CalManager.getCalendar).toHaveBeenCalledTimes(3)
    });

    test('Update Status', () => {
        const tCal = new Calendar('', '');
        jest.spyOn(CalManager, 'getCalendar').mockReturnValue(tCal);

        //@ts-ignore
        tk.updateStatus();
        expect(tk.getStatus()).toBe(TimeKeeperStatus.Stopped);

        //@ts-ignore
        tk.updateStatus(TimeKeeperStatus.Paused);
        expect(tk.getStatus()).toBe(TimeKeeperStatus.Paused);

        //@ts-ignore
        tk.intervalNumber = 2;
        //@ts-ignore
        tk.updateStatus();
        expect(tk.getStatus()).toBe(TimeKeeperStatus.Paused);

        //@ts-ignore
        game.paused = false;
        //@ts-ignore
        tk.updateStatus();
        expect(tk.getStatus()).toBe(TimeKeeperStatus.Started);
    });

    test('Emit Socket', () => {
        //@ts-ignore
        game.user.isGM = true;
        SC.primary = true;

        //@ts-ignore
        tk.emitSocket();
    });

    test('Register Update Listener', () => {
        tk.registerUpdateListener('test', () => {});
        //@ts-ignore
        expect(tk.updateListeners.length).toBe(1);

        tk.registerUpdateListener('test', () => {});
        //@ts-ignore
        expect(tk.updateListeners.length).toBe(1);
    });

    test('Call Listeners', () => {
        const testFN = jest.fn();
        tk.registerUpdateListener('test', testFN);
        //@ts-ignore
        tk.callListeners();
        expect(testFN).toHaveBeenCalled();
    });
});
