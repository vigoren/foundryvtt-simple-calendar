/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import { jest, beforeEach, describe, expect, test } from "@jest/globals";

import Calendar from "../calendar";
import { CalManager, NManager, SC, updateCalManager, updateNManager, updateSC } from "../index";
import CalendarManager from "../calendar/calendar-manager";
import SCController from "../s-c-controller";
import NoteManager from "../notes/note-manager";
import V1ToV2 from "./v1-to-v2";
import Mock = jest.Mock;
import { GameWorldTimeIntegrations, MoonYearResetOptions } from "../../constants";
import Month from "../calendar/month";
import { GameSettings } from "../foundry-interfacing/game-settings";

describe("V1 to V2 Class Tests", () => {
    let tCal: Calendar;

    beforeEach(() => {
        updateCalManager(new CalendarManager());
        updateSC(new SCController());
        updateNManager(new NoteManager());
        tCal = new Calendar("", "");
        jest.spyOn(CalManager, "getActiveCalendar").mockImplementation(() => {
            return tCal;
        });
        jest.spyOn(console, "warn").mockImplementation(() => {});
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    test("Run Calendar Migration", () => {
        expect(V1ToV2.runCalendarMigration()).toBeNull();
        expect(console.warn).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledTimes(1);

        (<Mock>(<Game>game).settings.get)
            .mockReturnValueOnce({ year: 1, month: 0, day: 0, seconds: 0 }) //Current Date
            .mockReturnValueOnce({ gameWorldTimeIntegration: GameWorldTimeIntegrations.Mixed, showClock: true, noteDefaultVisibility: false }) //General Settings
            .mockReturnValueOnce({}) //Leap Year
            .mockReturnValueOnce([
                {
                    name: "January",
                    numericRepresentation: 1,
                    numericRepresentationOffset: 0,
                    numberOfDays: 31,
                    numberOfLeapYearDays: 31,
                    intercalary: false,
                    intercalaryInclude: false
                }
            ]) //Months
            .mockReturnValueOnce([
                {
                    name: "Moon",
                    cycleLength: 30,
                    phases: [],
                    firstNewMoon: { yearReset: MoonYearResetOptions.None, yearX: 0, year: 0, month: 0, day: 1 },
                    color: "#ffffff",
                    cycleDayAdjust: 0
                }
            ]) //Moons
            .mockReturnValueOnce([]) //Note Categories
            .mockReturnValueOnce([
                { name: "Spring", startingMonth: 0, startingDay: 1, color: "#fffce8" },
                { name: "Summer", startingMonth: 0, startingDay: 1, color: "#f3fff3" },
                { name: "Fall", startingMonth: 0, startingDay: 1, color: "#fff7f2" },
                { name: "Winter", startingMonth: 0, startingDay: 1, color: "#f2f8ff" },
                { name: "2nd Winter", startingMonth: 0, startingDay: 1, color: "#" }
            ]) //Seasons
            .mockReturnValueOnce({ hoursInDay: 24, minutesInHour: 60, secondsInMinute: 60, gameTimeRatio: 1 }) //Time
            .mockReturnValueOnce([{ name: "Monday", numericRepresentation: 1 }]) //Weekdays
            .mockReturnValueOnce({ numericRepresentation: 1, prefix: "", postfix: "" }); //Year
        const cal = V1ToV2.runCalendarMigration() || tCal;
        expect(cal.seasons[0].color).toBe("#46B946");
        expect(cal.seasons[1].color).toBe("#E0C40B");
        expect(cal.seasons[2].color).toBe("#FF8E47");
        expect(cal.seasons[3].color).toBe("#479DFF");
        expect(cal.seasons[0].startingMonth).toBe(0);
        expect(cal.moons[0].firstNewMoon.month).toBe(0);
        expect(console.warn).toHaveBeenCalledTimes(2);
        expect(console.error).toHaveBeenCalledTimes(1);
    });

    test("Run Global Configuration Migration", () => {
        (<Mock>(<Game>game).settings.get)
            .mockReturnValueOnce({}) //General Configuration
            .mockReturnValueOnce({}); //Time Configuration
        expect(V1ToV2.runGlobalConfigurationMigration()).toBe(true);

        (<Mock>(<Game>game).settings.get)
            .mockReturnValueOnce({
                permissions: {
                    viewCalendar: { player: false, trustedPlayer: false, assistantGameMaster: false, users: undefined },
                    addNotes: { player: false, trustedPlayer: false, assistantGameMaster: false, users: undefined },
                    changeDateTime: { player: false, trustedPlayer: false, assistantGameMaster: false, users: undefined },
                    reorderNotes: { player: false, trustedPlayer: false, assistantGameMaster: false, users: undefined }
                }
            }) //General Configuration
            .mockReturnValueOnce({ secondsInCombatRound: 6 }); //Time Configuration
        expect(V1ToV2.runGlobalConfigurationMigration()).toBe(true);
        expect(SC.globalConfiguration.permissions.viewCalendar).toEqual({
            player: false,
            trustedPlayer: false,
            assistantGameMaster: false,
            users: undefined
        });
        expect(SC.globalConfiguration.secondsInCombatRound).toBe(6);
    });

    test("Run Note Migration", async () => {
        (<Mock>(<Game>game).settings.get).mockReturnValueOnce([]); //Notes
        expect(await V1ToV2.runNoteMigration()).toBe(true);

        const je = { ownership: { asd: 1 }, update: jest.fn() };
        //@ts-ignore
        jest.spyOn(NManager, "createNote").mockImplementation(async () => {
            return je;
        });
        (<Mock>(<Game>game).settings.get).mockReturnValueOnce([
            {
                allDay: false,
                calendarId: "",
                repeats: 0,
                order: 0,
                categories: [],
                remindUsers: [],
                startDate: { year: 0, month: 1, day: 1, hour: 0, minute: 0, seconds: 0 },
                endDate: { year: 0, month: 1, day: 1, hour: 0, minute: 0, seconds: 0 }
            }
        ]); //Notes
        expect(await V1ToV2.runNoteMigration()).toBe(true);
        expect(NManager.createNote).toHaveBeenCalledTimes(1);
        expect(je.update).toHaveBeenCalledTimes(1);

        tCal.months.push(new Month("Month", 1, 0, 30));
        (<Mock>(<Game>game).settings.get).mockReturnValueOnce([
            {
                allDay: false,
                author: "asd",
                calendarId: "",
                repeats: 0,
                order: 0,
                categories: [],
                remindUsers: [],
                startDate: { year: 0, month: 1, day: 1, hour: 0, minute: 0, seconds: 0 },
                endDate: { year: 0, month: 1, day: 1, hour: 0, minute: 0, seconds: 0 }
            }
        ]); //Notes
        expect(await V1ToV2.runNoteMigration()).toBe(true);
        expect(NManager.createNote).toHaveBeenCalledTimes(2);
        expect(je.update).toHaveBeenCalledTimes(2);

        (<Mock>(<Game>game).settings.get).mockReturnValueOnce([
            {
                allDay: false,
                author: "aasd",
                playerVisible: true,
                calendarId: "",
                repeats: 0,
                order: 0,
                categories: [],
                remindUsers: [],
                startDate: { year: 0, month: 1, day: 1, hour: 0, minute: 0, seconds: 0 },
                endDate: { year: 0, month: 1, day: 1, hour: 0, minute: 0, seconds: 0 }
            }
        ]); //Notes
        expect(await V1ToV2.runNoteMigration()).toBe(true);
        expect(NManager.createNote).toHaveBeenCalledTimes(3);
        expect(je.update).toHaveBeenCalledTimes(3);

        //@ts-ignore
        (<Mock>(<Game>game).settings.get).mockReturnValueOnce([
            {
                author: "aasd",
                playerVisible: true,
                calendarId: "",
                startDate: { year: 0, month: 1, day: 1, hour: 0, minute: 0, seconds: 0 },
                endDate: { year: 0, month: 0, day: 0, hour: 0, minute: 0, seconds: 0 }
            }
        ]); //Notes
        expect(await V1ToV2.runNoteMigration()).toBe(true);
        expect(NManager.createNote).toHaveBeenCalledTimes(4);
        expect(je.update).toHaveBeenCalledTimes(4);
    });

    test("Clean Up Old Data", async () => {
        jest.spyOn(GameSettings, "SaveObjectSetting").mockImplementation(async () => {
            return true;
        });
        expect(await V1ToV2.cleanUpOldData()).toBe(true);
    });
});
