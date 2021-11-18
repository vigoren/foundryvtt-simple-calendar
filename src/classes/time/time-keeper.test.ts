/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/game";
import "../../../__mocks__/form-application";
import "../../__mocks__/application";
import "../../__mocks__/handlebars";
import "../../__mocks__/event";
import "../../../__mocks__/crypto";
import "../../__mocks__/dialog";
import "../../__mocks__/hooks";

import TimeKeeper from "./time-keeper";
import MainApp from "../applications/main-app";
import {GameWorldTimeIntegrations, TimeKeeperStatus} from "../../constants";
import Year from "../calendar/year";
import Month from "../calendar/month";

describe('Time Keeper Class Tests', () => {
    let tk: TimeKeeper

    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation();
        tk = new TimeKeeper(1);
        MainApp.instance = new MainApp();
    });


    test('Start/Stop', () => {
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
        MainApp.instance.primary = true;

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

        MainApp.instance.activeCalendar.year = new Year(0);
        MainApp.instance.activeCalendar.year.time.unifyGameAndClockPause = true;
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
    });

    test('Get Status', () => {
        expect(tk.getStatus()).toBe(TimeKeeperStatus.Stopped);
    });

    test('Set Status', () => {
        const o = MainApp.instance.element;
        //@ts-ignore
        MainApp.instance.element = {
            find: jest.fn().mockReturnValue({
                removeClass: jest.fn().mockReturnValue({addClass: jest.fn()})
            })
        };

        tk.setStatus(TimeKeeperStatus.Paused);
        expect(tk.getStatus()).toBe(TimeKeeperStatus.Paused);

        tk.setStatus(TimeKeeperStatus.Started);
        expect(tk.getStatus()).toBe(TimeKeeperStatus.Started);

        //@ts-ignore
        MainApp.instance.element = o;
    });

    test('Set Clock Time', () => {
        const o = MainApp.instance.element;
        //@ts-ignore
        MainApp.instance.element = {
            find: jest.fn().mockReturnValue({
                removeClass: jest.fn().mockReturnValue({addClass: jest.fn()}),
                text: jest.fn()
            })
        };

        tk.setClockTime('');
        //@ts-ignore
        expect(MainApp.instance.element.find).toHaveBeenCalled();
        MainApp.instance.activeCalendar.year = new Year(0);
        tk.setClockTime('');
        //@ts-ignore
        expect(MainApp.instance.element.find).toHaveBeenCalled();

        //@ts-ignore
        MainApp.instance.element = o;
    });

    test('Interval', () => {
        const o = MainApp.instance.element;
        //@ts-ignore
        MainApp.instance.element = {
            find: jest.fn().mockReturnValue({
                removeClass: jest.fn().mockReturnValue({addClass: jest.fn()}),
                text: jest.fn()
            })
        };

        //@ts-ignore
        tk.interval();

        MainApp.instance.activeCalendar.year = new Year(0);
        MainApp.instance.activeCalendar.year.months.push(new Month('M',1,0,10));
        MainApp.instance.activeCalendar.year.months[0].current = true;
        MainApp.instance.activeCalendar.year.months[0].days[0].current = true;
        //@ts-ignore
        tk.interval();

        //@ts-ignore
        game.paused = false;
        tk.start();
        //@ts-ignore
        tk.interval();

        MainApp.instance.activeCalendar.year.time.seconds = MainApp.instance.activeCalendar.year.time.secondsPerDay - 1;
        //@ts-ignore
        tk.interval();

        //@ts-ignore
        game.user.isGM = true;
        MainApp.instance.primary = true;

        //@ts-ignore
        tk.interval();

        MainApp.instance.activeCalendar.generalSettings.gameWorldTimeIntegration = GameWorldTimeIntegrations.None;

        //@ts-ignore
        tk.interval();

        tk.stop();
        //@ts-ignore
        MainApp.instance.element = o;
    });

    test('Save Interval', () => {
        //@ts-ignore
        tk.saveInterval();

        MainApp.instance.activeCalendar.year = new Year(0);

        //@ts-ignore
        tk.saveInterval();
        //@ts-ignore
        game.user.isGM = true;
        MainApp.instance.primary = true;

        //@ts-ignore
        tk.saveInterval();

        MainApp.instance.activeCalendar.generalSettings.gameWorldTimeIntegration = GameWorldTimeIntegrations.None;

        //@ts-ignore
        tk.interval();
    });
});
