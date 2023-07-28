/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import { jest, beforeEach, describe, expect, test } from "@jest/globals";
import { SocketTypes } from "../../constants";
import Calendar from "../calendar";
import { MainApplication, updateMainApplication } from "../index";
import MainApp from "../applications/main-app";
import MainAppUpdateSocket from "./main-app-update";
import { GameSettings } from "../foundry-interfacing/game-settings";

describe("Main App Update Socket Tests", () => {
    let s: MainAppUpdateSocket;
    let tCal: Calendar;

    beforeEach(() => {
        updateMainApplication(new MainApp());
        tCal = new Calendar("", "");
        jest.spyOn(MainApplication, "updateApp").mockImplementation(() => {});
        //@ts-ignore
        game.user.isGM = true;
        s = new MainAppUpdateSocket();
    });

    test("Initialize", async () => {
        const r = await s.initialize();
        expect(r).toBe(true);
    });

    test("Process", async () => {
        let r = await s.process({ type: SocketTypes.dateTimeChange, data: {} });
        expect(r).toBe(false);
        expect(MainApplication.updateApp).not.toHaveBeenCalled();

        r = await s.process({ type: SocketTypes.mainAppUpdate, data: {} });
        expect(r).toBe(true);
        expect(MainApplication.updateApp).toHaveBeenCalledTimes(1);

        r = await s.process({ type: SocketTypes.mainAppUpdate, data: { userId: "qwe" } });
        expect(r).toBe(true);
        expect(MainApplication.updateApp).toHaveBeenCalledTimes(1);

        jest.spyOn(GameSettings, "UserID").mockImplementation(() => {
            return "qwe";
        });

        r = await s.process({ type: SocketTypes.mainAppUpdate, data: { userId: "qwe" } });
        expect(r).toBe(true);
        expect(MainApplication.updateApp).toHaveBeenCalledTimes(2);
    });
});
