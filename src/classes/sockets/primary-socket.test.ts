/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import { jest, beforeEach, describe, expect, test } from "@jest/globals";
import { SocketTypes } from "../../constants";
import Calendar from "../calendar";
import { CalManager, MainApplication, SC, updateCalManager, updateMainApplication, updateSC } from "../index";
import SCController from "../s-c-controller";
import MainApp from "../applications/main-app";
import PrimarySocket from "./primary-socket";
import CalendarManager from "../calendar/calendar-manager";
import GameSockets from "../foundry-interfacing/game-sockets";
import { Hook } from "../api/hook";

jest.setTimeout(6000);

describe("Primary Socket Tests", () => {
    let s: PrimarySocket;
    let tCal: Calendar;

    beforeEach(() => {
        updateCalManager(new CalendarManager());
        updateSC(new SCController());
        updateMainApplication(new MainApp());
        tCal = new Calendar("", "");
        jest.spyOn(CalManager, "getActiveCalendar").mockImplementation(() => {
            return tCal;
        });
        //@ts-ignore
        game.user.isGM = true;
        s = new PrimarySocket();
    });

    test("Primary Check Timeout Call", async () => {
        jest.spyOn(MainApplication, "timeKeepingCheck").mockImplementation(async () => {});
        jest.spyOn(GameSockets, "emit").mockImplementation(async () => {
            return true;
        });
        jest.spyOn(Hook, "emit").mockImplementation(async () => {});
        await s.primaryCheckTimeoutCall();
        expect(MainApplication.timeKeepingCheck).toHaveBeenCalledTimes(1);
        expect(GameSockets.emit).toHaveBeenCalledTimes(2);
        expect(Hook.emit).toHaveBeenCalledTimes(1);
    });

    test("Initialize", async () => {
        const primaryCheckTimeoutSpy = jest.spyOn(s, "primaryCheckTimeoutCall").mockImplementation(async () => {});

        //User is not GM
        //@ts-ignore
        game.user.isGM = false;
        let r = await s.initialize();
        expect(r).toBe(true);
        expect(MainApplication.uiElementStates.primaryCheckRunning).toBe(false);

        // Undefined users
        //@ts-ignore
        game.user.isGM = true;
        const users = (<Game>game).users;
        (<Game>game).users = undefined;

        r = await s.initialize();
        expect(r).toBe(true);
        expect(primaryCheckTimeoutSpy).toHaveBeenCalledTimes(1);

        // Only 1 GM
        (<Game>game).users = users;
        r = await s.initialize();
        expect(r).toBe(true);
        expect(primaryCheckTimeoutSpy).toHaveBeenCalledTimes(2);

        // Multiple GMs
        //@ts-ignore
        jest.spyOn(game.users, "filter").mockReturnValueOnce([game.user, game.user]);
        r = await s.initialize();
        expect(r).toBe(true);
        expect(primaryCheckTimeoutSpy).toHaveBeenCalledTimes(3);
    });

    test("Process", async () => {
        jest.spyOn(GameSockets, "emit").mockImplementation(async () => {
            return true;
        });
        let r = await s.process({ type: SocketTypes.mainAppUpdate, data: {} });
        expect(r).toBe(false);
        expect(GameSockets.emit).not.toHaveBeenCalled();

        r = await s.process({ type: SocketTypes.primary, data: { primaryCheck: true } });
        expect(r).toBe(true);
        expect(GameSockets.emit).toHaveBeenCalledTimes(1);

        r = await s.process({ type: SocketTypes.primary, data: { amPrimary: true } });
        expect(r).toBe(true);
        //@ts-ignore
        expect(s.otherPrimaryFound).toBe(true);
        expect(SC.primary).toBe(false);
    });
});
