/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import { jest, beforeEach, describe, expect, test } from "@jest/globals";
import Calendar from "../calendar";
import { CalManager, SC, updateCalManager, updateNManager, updateSC } from "../index";
import CalendarManager from "../calendar/calendar-manager";
import fetchMock from "jest-fetch-mock";
import PredefinedCalendar from "../configuration/predefined-calendar";
import { PredefinedCalendars } from "../../constants";
import { ChatTimestamp } from "./chat-timestamp";
import NoteManager from "../notes/note-manager";
import SCController from "../s-c-controller";
import PF2E from "../systems/pf2e";

fetchMock.enableMocks();

describe("Chat Timestamp Tests", () => {
    let tCal: Calendar;

    beforeEach(async () => {
        updateCalManager(new CalendarManager());
        updateSC(new SCController());
        updateNManager(new NoteManager());
        tCal = new Calendar("a", "");
        jest.spyOn(CalManager, "getActiveCalendar").mockImplementation(() => {
            return tCal;
        });
        jest.spyOn(CalManager, "getCalendar").mockImplementation(() => {
            return tCal;
        });

        fetchMock.resetMocks();
        fetchMock.mockOnce(
            `{"calendar":{"currentDate":{"year":2022,"month":2,"day":28,"seconds":0},"general":{"gameWorldTimeIntegration":"mixed","showClock":true,"noteDefaultVisibility":false,"postNoteRemindersOnFoundryLoad":true,"pf2eSync":true,"dateFormat":{"date":"MMMM DD, YYYY","time":"HH:mm:ss","monthYear":"MMMM YAYYYYYZ"}},"leapYear":{"rule":"gregorian","customMod":0},"months":[{"name":"January","abbreviation":"Jan","numericRepresentation":1,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"February","abbreviation":"Feb","numericRepresentation":2,"numericRepresentationOffset":0,"numberOfDays":28,"numberOfLeapYearDays":29,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"March","abbreviation":"Mar","numericRepresentation":3,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"April","abbreviation":"Apr","numericRepresentation":4,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"May","abbreviation":"May","numericRepresentation":5,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"June","abbreviation":"Jun","numericRepresentation":6,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"July","abbreviation":"Jul","numericRepresentation":7,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"August","abbreviation":"Aug","numericRepresentation":8,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"September","abbreviation":"Sep","numericRepresentation":9,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"October","abbreviation":"Oct","numericRepresentation":10,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"November","abbreviation":"Nov","numericRepresentation":11,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"December","abbreviation":"Dec","numericRepresentation":12,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null}],"moons":[{"name":"Moon","cycleLength":29.53059,"firstNewMoon":{"yearReset":"none","yearX":0,"year":2000,"month":1,"day":5},"phases":[{"name":"New Moon","length":1,"icon":"new","singleDay":true},{"name":"Waxing Crescent","length":6.38265,"icon":"waxing-crescent","singleDay":false},{"name":"First Quarter","length":1,"icon":"first-quarter","singleDay":true},{"name":"Waxing Gibbous","length":6.38265,"icon":"waxing-gibbous","singleDay":false},{"name":"Full Moon","length":1,"icon":"full","singleDay":true},{"name":"Waning Gibbous","length":6.38265,"icon":"waning-gibbous","singleDay":false},{"name":"Last Quarter","length":1,"icon":"last-quarter","singleDay":true},{"name":"Waning Crescent","length":6.38265,"icon":"waning-crescent","singleDay":false}],"color":"#ffffff","cycleDayAdjust":0.5}],"noteCategories":[{"name":"Holiday","textColor":"#FFFFFF","color":"#148e94"}],"seasons":[{"name":"Spring","startingMonth":2,"startingDay":19,"color":"#46b946","icon":"spring","sunriseTime":21600,"sunsetTime":64800},{"name":"Summer","startingMonth":5,"startingDay":19,"color":"#e0c40b","icon":"summer","sunriseTime":21600,"sunsetTime":64800},{"name":"Fall","startingMonth":8,"startingDay":21,"color":"#ff8e47","icon":"fall","sunriseTime":21600,"sunsetTime":64800},{"name":"Winter","startingMonth":11,"startingDay":20,"color":"#479dff","icon":"winter","sunriseTime":21600,"sunsetTime":64800}],"time":{"hoursInDay":24,"minutesInHour":60,"secondsInMinute":60,"gameTimeRatio":1,"unifyGameAndClockPause":false,"updateFrequency":1},"weekdays":[{"abbreviation":"Su","name":"Sunday","numericRepresentation":1},{"abbreviation":"Mo","name":"Monday","numericRepresentation":2},{"abbreviation":"Tu","name":"Tuesday","numericRepresentation":3},{"abbreviation":"We","name":"Wednesday","numericRepresentation":4},{"abbreviation":"Th","name":"Thursday","numericRepresentation":5},{"abbreviation":"Fr","name":"Friday","numericRepresentation":6},{"abbreviation":"Sa","name":"Saturday","numericRepresentation":7}],"year":{"numericRepresentation":2022,"prefix":"","postfix":"","showWeekdayHeadings":true,"firstWeekday":4,"yearZero":1970,"yearNames":[],"yearNamingRule":"default","yearNamesStart":0}}}`
        );
        await PredefinedCalendar.setToPredefined(tCal, PredefinedCalendars.Gregorian);
    });

    test("Add Game Time To Message", async () => {
        const cm = {
            setFlag: jest.fn((mn: string, key: string, data: any) => {
                cm.flags[key] = data;
                return Promise.resolve();
            }),
            flags: <Record<string, any>>{},
            updateSource: jest.fn((obj: Record<string, any>) => {
                cm.flags = obj["flags"];
            }),
            _source: {
                flags: <Record<string, any>>{}
            }
        };

        //@ts-ignore
        ChatTimestamp.addGameTimeToMessage(cm);

        expect(cm.updateSource).toHaveBeenCalledTimes(1);
        expect(cm.flags["foundryvtt-simple-calendar"]["sc-timestamps"]).toEqual({ id: "a", timestamp: tCal.toSeconds() });

        //@ts-ignore
        game.system.id = "D35E";
        //@ts-ignore
        ChatTimestamp.addGameTimeToMessage(cm);
        expect(cm._source.flags["foundryvtt-simple-calendar"]["sc-timestamps"]).toEqual({ id: "a", timestamp: tCal.toSeconds() });
    });

    test("Get Formatted Chat Timestamp", () => {
        const cm = {
            getFlag: jest.fn(() => {
                return { id: "a", timestamp: tCal.toSeconds() };
            })
        };

        //@ts-ignore
        let displayDate = ChatTimestamp.getFormattedChatTimestamp(cm);
        expect(displayDate).not.toBe("");
        expect(cm.getFlag).toHaveBeenCalledTimes(1);

        jest.spyOn(PF2E, "isPF2E", "get").mockReturnValue(true);
        tCal.generalSettings.pf2eSync = true;
        //@ts-ignore
        displayDate = ChatTimestamp.getFormattedChatTimestamp(cm);
        expect(displayDate).not.toBe("");
        expect(cm.getFlag).toHaveBeenCalledTimes(2);
    });

    test("Render Timestamp", async () => {
        const cm = {
            setFlag: jest.fn((mn: string, key: string, data: any) => {
                cm.flags[key] = data;
                return Promise.resolve();
            }),
            getFlag: jest.fn(() => {
                return { id: "a", timestamp: tCal.toSeconds() };
            }),
            flags: <Record<string, any>>{}
        };

        const tsc = document.createElement("div");
        const ts = document.createElement("time");

        jest.spyOn(tsc, "querySelector").mockReturnValue(ts);

        SC.globalConfiguration.inGameChatTimestamp = true;
        //@ts-ignore
        await ChatTimestamp.renderTimestamp(cm, [tsc]);
        expect(cm.getFlag).toHaveBeenCalledTimes(1);
        expect(ts.style.display).toBe("none");
    });

    test("Update Chat Message Timestamps", () => {
        const chat = document.createElement("div");
        chat.id = "chat";
        document.body.append(chat);

        const li = document.createElement("li");
        li.dataset.messageId = "a";
        chat.append(li);

        const fTime = document.createElement("time");
        const scTime = document.createElement("span");

        //@ts-ignore
        const cqsa = jest.spyOn(chat, "querySelectorAll").mockReturnValue([li]);
        const liqsa = jest.spyOn(li, "querySelector").mockReturnValue(fTime);
        //@ts-ignore
        game.messages = {
            get: jest.fn((id: string) => {
                return { id: id };
            })
        };
        jest.spyOn(ChatTimestamp, "getFormattedChatTimestamp").mockReturnValue("test");

        // Show Foundries timestamp
        ChatTimestamp.updateChatMessageTimestamps();
        expect(cqsa).toHaveBeenCalledTimes(1);
        expect(liqsa).toHaveBeenCalledTimes(2);
        expect(fTime.style.display).toBe("");

        // Create SC timestamp
        liqsa.mockReturnValueOnce(fTime).mockReturnValueOnce(null);
        SC.globalConfiguration.inGameChatTimestamp = true;
        ChatTimestamp.updateChatMessageTimestamps();
        expect(cqsa).toHaveBeenCalledTimes(2);
        expect(liqsa).toHaveBeenCalledTimes(4);
        expect(fTime.style.display).toBe("none");

        // Update SC timestamp
        liqsa.mockReturnValueOnce(fTime).mockReturnValueOnce(scTime);
        ChatTimestamp.updateChatMessageTimestamps();
        expect(cqsa).toHaveBeenCalledTimes(3);
        expect(liqsa).toHaveBeenCalledTimes(6);
        expect(fTime.style.display).toBe("none");
        expect(scTime.innerText).toBe("test");

        // FTime doesn't exist
        liqsa.mockReturnValueOnce(null).mockReturnValueOnce(scTime);
        ChatTimestamp.updateChatMessageTimestamps();
        expect(cqsa).toHaveBeenCalledTimes(4);
        expect(liqsa).toHaveBeenCalledTimes(8);
        expect(scTime.innerText).toBe("test");

        //No dataset id
        li.dataset.messageId = "";
        ChatTimestamp.updateChatMessageTimestamps();
        expect(cqsa).toHaveBeenCalledTimes(5);
        expect(liqsa).toHaveBeenCalledTimes(10);
    });
});
