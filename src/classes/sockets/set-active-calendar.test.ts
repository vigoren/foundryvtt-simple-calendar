/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import { jest, beforeEach, describe, expect, test } from "@jest/globals";
import Calendar from "../calendar";
import SetActiveCalendar from "./set-active-calendar";
import { CalManager, SC, updateCalManager, updateSC } from "../index";
import CalendarManager from "../calendar/calendar-manager";
import SCController from "../s-c-controller";
import { SocketTypes } from "../../constants";

describe("Set Active Calendar Socket Tests", () => {
    let s: SetActiveCalendar;
    let tCal: Calendar;

    beforeEach(() => {
        updateCalManager(new CalendarManager());
        updateSC(new SCController());
        tCal = new Calendar("", "");

        s = new SetActiveCalendar();
    });

    test("Initialize", async () => {
        const r = await s.initialize();
        expect(r).toBe(true);
    });

    test("Process", async () => {
        jest.spyOn(CalManager, "setActiveCalendar").mockImplementation(() => {});
        expect(await s.process({ type: SocketTypes.mainAppUpdate, data: {} })).toBe(false);

        //@ts-ignore
        game.user.isGM = true;
        SC.primary = true;
        expect(await s.process({ type: SocketTypes.setActiveCalendar, data: { calendarId: "" } })).toBe(true);
        expect(CalManager.setActiveCalendar).toHaveBeenCalledTimes(1);
    });
});
