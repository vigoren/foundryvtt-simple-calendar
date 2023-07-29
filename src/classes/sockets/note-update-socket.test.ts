/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import { jest, beforeEach, describe, expect, test } from "@jest/globals";
import { SocketTypes } from "../../constants";
import Calendar from "../calendar";
import { MainApplication, NManager, updateMainApplication, updateNManager } from "../index";
import MainApp from "../applications/main-app";
import NoteUpdateSocket from "./note-update-socket";
import GameSockets from "../foundry-interfacing/game-sockets";
import NoteManager from "../notes/note-manager";

describe("Note Update Socket Tests", () => {
    let s: NoteUpdateSocket;
    let tCal: Calendar;

    beforeEach(() => {
        updateMainApplication(new MainApp());
        updateNManager(new NoteManager());
        tCal = new Calendar("", "");
        jest.spyOn(GameSockets, "emit").mockImplementation(async () => {
            return true;
        });
        jest.spyOn(MainApplication, "updateApp").mockImplementation(() => {});
        jest.spyOn(NManager, "orderNotesOnDay").mockImplementation(async () => {});
        //@ts-ignore
        game.user.isGM = true;
        s = new NoteUpdateSocket();
    });

    test("Initialize", async () => {
        const r = await s.initialize();
        expect(r).toBe(true);
    });

    test("Process", async () => {
        let r = await s.process({ type: SocketTypes.mainAppUpdate, data: {} });
        expect(r).toBe(false);
        expect(GameSockets.emit).not.toHaveBeenCalled();
        expect(MainApplication.updateApp).not.toHaveBeenCalled();

        r = await s.process({ type: SocketTypes.noteUpdate, data: {} });
        expect(r).toBe(true);
        expect(GameSockets.emit).not.toHaveBeenCalled();
        expect(MainApplication.updateApp).not.toHaveBeenCalled();

        r = await s.process({ type: SocketTypes.noteUpdate, data: { journalId: "123", userId: "asd" } });
        expect(r).toBe(true);
        expect(GameSockets.emit).toHaveBeenCalledTimes(1);
        expect(MainApplication.updateApp).not.toHaveBeenCalled();

        r = await s.process({ type: SocketTypes.noteUpdate, data: { journalId: "123", userId: "qwe" } });
        expect(r).toBe(true);
        expect(GameSockets.emit).toHaveBeenCalledTimes(2);
        expect(MainApplication.updateApp).not.toHaveBeenCalled();

        r = await s.process({
            type: SocketTypes.noteUpdate,
            data: { calendarId: "test", newOrder: ["1"], date: { year: 0, month: 0, day: 0, hour: 0, minute: 0, seconds: 0 } }
        });
        expect(r).toBe(true);
        expect(GameSockets.emit).toHaveBeenCalledTimes(3);
        expect(MainApplication.updateApp).toHaveBeenCalledTimes(1);
        expect(NManager.orderNotesOnDay).toHaveBeenCalledTimes(1);
    });
});
