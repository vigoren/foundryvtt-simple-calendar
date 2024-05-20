/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import { jest, beforeEach, beforeAll, afterAll, describe, expect, test } from "@jest/globals";

import Calendar from "../calendar";
import { CalManager, MainApplication, NManager, updateCalManager, updateMainApplication, updateNManager, updateSC } from "../index";
import CalendarManager from "../calendar/calendar-manager";
import SCController from "../s-c-controller";
import MainApp from "../applications/main-app";
import NoteManager from "./note-manager";
import { NoteSheet } from "./note-sheet";
import { ModuleName, NoteRepeat, PredefinedCalendars } from "../../constants";
import fetchMock from "jest-fetch-mock";
import PredefinedCalendar from "../configuration/predefined-calendar";
import * as Utilities from "../utilities/inputs";
import GameSockets from "../foundry-interfacing/game-sockets";

fetchMock.enableMocks();
describe("Note Sheet Class Tests", () => {
    let tCal: Calendar;
    let ns: NoteSheet;
    let je: any;
    let nd: any;
    let oldUID: string;

    beforeEach(async () => {
        updateCalManager(new CalendarManager());
        updateSC(new SCController());
        updateMainApplication(new MainApp());
        updateNManager(new NoteManager());
        tCal = new Calendar("", "");
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

        nd = {
            calendarId: "test",
            startDate: { year: 0, month: 0, day: 0, hour: 0, minute: 0, seconds: 0 },
            endDate: { year: 0, month: 0, day: 0, hour: 0, minute: 0, seconds: 0 },
            allDay: false,
            repeats: NoteRepeat.Yearly,
            order: 1,
            fromPredefined: true,
            categories: [],
            remindUsers: ["qwe"]
        };

        je = {
            data: {
                flags: {
                    "foundryvtt-simple-calendar": {}
                }
            },
            name: "Journal",
            getFlag: jest.fn().mockReturnValueOnce(null).mockReturnValue(nd),
            setFlag: jest.fn(),
            testUserPermission: () => {
                return true;
            },
            update: async () => {},
            delete: async () => {},
            ownership: { "": 3, a: 0, default: 0 },
            pages: {
                contents: [
                    {
                        _id: "",
                        name: "page",
                        type: "text",
                        text: { content: "test" },
                        image: { caption: "" },
                        video: { timestamp: 0 }
                    }
                ]
            },
            getEmbeddedCollection: () => {
                return { contents: [] };
            },
            updateEmbeddedDocuments: async () => {},
            createEmbeddedDocuments: async () => {}
        };

        ns = new NoteSheet(je);
        //@ts-ignore
        ns.journalData.flags = {};
        //@ts-ignore
        ns.journalData.ownership = { "": 3, a: 0, default: 0 };
    });

    beforeAll(() => {
        //@ts-ignore
        oldUID = game.user.id;
        //@ts-ignore
        Object.defineProperty(game.user, "id", {
            get: () => {
                return "";
            }
        });
    });

    afterAll(() => {
        //@ts-ignore
        delete game.user.id;
        //@ts-ignore
        game.user.id = oldUID;
    });

    test("Get Default Options", () => {
        expect(NoteSheet.defaultOptions).toBeDefined();
    });

    test("Get Default Object", () => {
        expect(NoteSheet.defaultObject).toEqual({});
    });

    test("Template", () => {
        expect(ns.template).toBe("");
    });

    test("Type", () => {
        expect(ns.type).toBe("simplecalendarnote");
    });

    test("Copy Data", () => {
        ns.copyData();
        // @ts-ignore
        expect(ns.journalData.name).toBe("Journal");

        je.name = "";
        ns.copyData();
        // @ts-ignore
        expect(ns.journalData.name).toBe("");
    });

    test("Get Header Buttons", () => {
        //@ts-ignore
        expect(ns._getHeaderButtons().length).toBe(1);
    });

    test("Get Title", () => {
        expect(ns.title).toBe("Journal");
        je.name = "";
        ns.copyData();
        expect(ns.title).toBe("Note");
    });

    test("Close", async () => {
        await ns.close();

        //@ts-ignore
        ns.dirty = true;
        await ns.close();
        //@ts-ignore
        expect(global.DialogRenderer).toHaveBeenCalledTimes(1);
    });

    test("Is Dirty Dialog Close", async () => {
        jest.spyOn(ns, "close").mockImplementation(async () => {});
        jest.spyOn(ns, "save").mockImplementation(async () => {});

        await ns.isDirtyDialogClose(false);
        expect(ns.close).toHaveBeenCalledTimes(1);
        expect(ns.save).toHaveBeenCalledTimes(0);

        await ns.isDirtyDialogClose(true);
        expect(ns.close).toHaveBeenCalledTimes(2);
        expect(ns.save).toHaveBeenCalledTimes(1);
    });

    test("Clean Up Prosemirror", () => {
        //@ts-ignore
        ns.editors["content"] = { instance: { destroy: jest.fn() } };
        ns.cleanUpProsemirror();
        //@ts-ignore
        expect(ns.editors["content"].instance.destroy).toHaveBeenCalledTimes(1);
    });

    test("Render", () => {
        ns.render();
        //@ts-ignore
        expect(ns.editMode).toBe(false);

        ns.render(true, {}, true);
        //@ts-ignore
        expect(ns.editMode).toBe(true);
    });

    test("Get Data", async () => {
        expect(ns.getData()).toBeDefined();
        nd.endDate.day = 1;
        nd.categories.push("asd");
        //@ts-ignore
        ns.journalData.flags["foundryvtt-simple-calendar"] = { noteData: { repeats: 0, macro: "none", remindUsers: [], categories: ["Holiday"] } };
        jest.spyOn(NManager, "getNoteStub")
            //@ts-ignore
            .mockReturnValueOnce({ title: "Journal", noteData: null, ownership: {} })
            //@ts-ignore
            .mockReturnValue({ title: "Journal", noteData: nd, ownership: je.ownership });
        //@ts-ignore
        ns.editMode = true;
        jest.spyOn(ns, "isEditable", "get").mockReturnValue(true);
        //@ts-ignore
        jest.spyOn(game.user, "id", "get")
            .mockReturnValueOnce("asd")
            .mockReturnValueOnce("asd")
            .mockReturnValueOnce("asd")
            .mockReturnValueOnce("asd")
            .mockReturnValueOnce("asd")
            .mockReturnValueOnce("noth");
        expect(await ns.getData()).toBeDefined();
        je.pages.contents[0].text.content = "";
        je.pages.contents[0].video.timestamp = 666;
        ns.copyData();
        //@ts-ignore
        ns.journalData.ownership = { "": 3, a: 0, default: 0 };
        //@ts-ignore
        ns.journalData.flags = {
            "foundryvtt-simple-calendar": { noteData: { repeats: 0, macro: "none", remindUsers: [], categories: ["Holiday"] } }
        };
        expect(await ns.getData()).toBeDefined();
        //Image page
        je.pages.contents[0].type = "image";
        ns.copyData();
        //@ts-ignore
        ns.journalData.ownership = { "": 3, a: 0, default: 0 };
        //@ts-ignore
        ns.journalData.flags = { "foundryvtt-simple-calendar": { noteData: { repeats: 0, macro: "none", remindUsers: [], categories: [] } } };
        expect(await ns.getData()).toBeDefined();
        //PDF page
        je.pages.contents[0].type = "pdf";
        ns.copyData();
        //@ts-ignore
        ns.journalData.ownership = { "": 3, a: 0, default: 0 };
        //@ts-ignore
        ns.journalData.flags = { "foundryvtt-simple-calendar": { noteData: { repeats: 0, macro: "none", remindUsers: [], categories: [] } } };
        expect(await ns.getData()).toBeDefined();
        //Video page
        je.pages.contents[0].type = "video";
        ns.copyData();
        //@ts-ignore
        ns.journalData.ownership = { "": 3, a: 0, default: 0 };
        //@ts-ignore
        ns.journalData.flags = { "foundryvtt-simple-calendar": { noteData: { repeats: 0, macro: "", remindUsers: [], categories: [] } } };
        expect(await ns.getData()).toBeDefined();

        //@ts-ignore
        ns.editMode = false;
        expect(await ns.getData()).toBeDefined();
    });

    test("Get YouTube Vars", () => {
        //@ts-ignore
        ns.editMode = true;
        let v = ns._getYouTubeVars();
        expect(v).toStrictEqual(expect.objectContaining({ playsinline: expect.any(Number), modestbranding: expect.any(Number) }));

        //@ts-ignore
        ns.editMode = false;
        v = ns._getYouTubeVars();
        expect(v).toStrictEqual(
            expect.objectContaining({
                playsinline: expect.any(Number),
                modestbranding: expect.any(Number),
                controls: expect.any(Number),
                autoplay: expect.any(Number),
                loop: expect.any(Number)
            })
        );

        //@ts-ignore
        ns.journalPages[0].video = { controls: true, autoplay: true, loop: true, timestamp: 12 };
        v = ns._getYouTubeVars();
        expect(v).toStrictEqual(
            expect.objectContaining({
                playsinline: expect.any(Number),
                modestbranding: expect.any(Number),
                controls: expect.any(Number),
                autoplay: expect.any(Number),
                loop: expect.any(Number),
                start: expect.any(Number)
            })
        );
    });

    test("Activate Video", () => {
        //@ts-ignore
        ns.appWindow = document.createElement("div");
        const frame = document.createElement("iframe");
        const video = document.createElement("video");
        //@ts-ignore
        jest.spyOn(ns.appWindow, "querySelector").mockReturnValueOnce(frame).mockReturnValue(video);

        ns._activateVideo();
        //@ts-ignore
        ns.journalPages[0].video = { volume: 1, timestamp: 12 };
        ns._activateVideo();
    });

    test("Youtube On State Change", () => {
        //@ts-ignore
        global.YT = { PlayerState: { PLAYING: 1 } };

        const fEvent = {
            data: 1,
            target: {
                setVolume: jest.fn()
            }
        };
        //@ts-ignore
        ns.youtubeOnStateChange(1, fEvent);
        expect(fEvent.target.setVolume).toHaveBeenCalledTimes(1);
    });

    test("Video Load Metadata", () => {
        const video = document.createElement("video");

        ns.videoLoadMetadata(video, 1, 12);
        expect(video.volume).toBe(1);
        expect(video.currentTime).toBe(12);
    });

    test("Set Height", () => {
        const form = document.createElement("form");
        const header = document.createElement("header");
        const section = document.createElement("section");
        const elm = document.createElement("div");
        //@ts-ignore
        ns.appWindow = document.createElement("div");
        jest.spyOn(ns.appWindow, "getElementsByTagName")
            //@ts-ignore
            .mockReturnValueOnce([form])
            //@ts-ignore
            .mockReturnValueOnce([header])
            //@ts-ignore
            .mockReturnValueOnce([section])
            //@ts-ignore
            .mockReturnValueOnce([form])
            //@ts-ignore
            .mockReturnValueOnce([header])
            //@ts-ignore
            .mockReturnValueOnce([section]);
        //@ts-ignore
        jest.spyOn(ns, "setPosition").mockImplementation(() => {});
        //@ts-ignore
        jest.spyOn(ns.appWindow, "querySelector").mockImplementation(() => {
            return elm;
        });

        NoteSheet.SetHeight(ns);
        //@ts-ignore
        expect(ns.setPosition).toHaveBeenCalledTimes(1);

        //@ts-ignore
        ns.editMode = true;
        NoteSheet.SetHeight(ns);
        //@ts-ignore
        expect(ns.setPosition).toHaveBeenCalledTimes(2);
    });

    test("Activate Listeners", () => {
        const appWindow = document.createElement("div");
        jest.spyOn(document, "getElementById").mockReturnValue(appWindow);
        //@ts-ignore
        ns.activateListeners({});

        //@ts-ignore
        ns.editMode = true;
        jest.spyOn(ns, "updateNoteRepeatDropdown").mockImplementation(() => {});
        jest.spyOn(appWindow, "querySelector").mockReturnValue(document.createElement("div"));
        //@ts-ignore
        jest.spyOn(appWindow, "querySelectorAll").mockReturnValue([document.createElement("div")]);
        //@ts-ignore
        ns.activateListeners({});
        expect(ns.updateNoteRepeatDropdown).toHaveBeenCalledTimes(1);

        //@ts-ignore
        ns.journalPages[0].text.content = "";
        //@ts-ignore
        ns.activateListeners({});
        expect(ns.updateNoteRepeatDropdown).toHaveBeenCalledTimes(2);

        //@ts-ignore
        ns.journalPages[0].type = "image";
        //@ts-ignore
        ns.activateListeners({});
        expect((<any>ns).object.content).toBe("");
    });

    test("Update Object", () => {
        //@ts-ignore
        ns._updateObject(new Event("click"), { content: "asd" });
        //@ts-ignore
        expect(ns.journalPages[0].text.content).toBe("asd");
        //@ts-ignore
        expect(ns.dirty).toBe(true);
    });

    test("Toggle Drawer", () => {
        ns.appWindow = document.createElement("div");
        const list = document.createElement("div");
        const link = document.createElement("a");
        const chev = document.createElement("i");

        jest.spyOn(ns.appWindow, "querySelector").mockReturnValue(list);
        jest.spyOn(list, "querySelector").mockReturnValue(link);
        jest.spyOn(link, "querySelector").mockReturnValue(chev);

        ns.toggleDrawer("asd");
        expect(chev.classList.contains("fa-caret-right")).toBe(true);
        ns.toggleDrawer("asd");
        expect(chev.classList.contains("fa-caret-left")).toBe(true);
    });

    test("Input Change", async () => {
        jest.spyOn(ns, "writeInputValuesToObjects").mockImplementation(async () => {});
        jest.spyOn(ns as any, "generateImageHTML").mockReturnValue("Image HTML");
        jest.spyOn(ns as any, "generatePDFHTML").mockReturnValue("PDF HTML");
        jest.spyOn(ns as any, "generateVideoHTML").mockReturnValue("Video HTML");
        const target = document.createElement("input");
        const targetParent = document.createElement("div");
        let element = document.createElement("figure");
        targetParent.classList.add("fsc-editor-container");
        targetParent.append(target);
        targetParent.append(element);
        target.name = "src";
        const fEvent = { target: target };
        //@ts-ignore
        ns.journalPages[0].type = "image";
        //@ts-ignore
        await ns.inputChange(fEvent);
        expect(ns.writeInputValuesToObjects).toHaveBeenCalledTimes(1);
        //@ts-ignore
        expect(ns.generateImageHTML).toHaveBeenCalledTimes(1);

        element = document.createElement("figure");
        targetParent.append(element);
        //@ts-ignore
        ns.journalPages[0].type = "pdf";
        //@ts-ignore
        await ns.inputChange(fEvent);
        //@ts-ignore
        expect(ns.generatePDFHTML).toHaveBeenCalledTimes(1);

        target.name = "video.height";
        element = document.createElement("figure");
        targetParent.append(element);
        //@ts-ignore
        ns.journalPages[0].type = "video";
        //@ts-ignore
        await ns.inputChange(fEvent);
        //@ts-ignore
        expect(ns.generateVideoHTML).toHaveBeenCalledTimes(1);

        target.name = "video.volume";
        target.value = "0.55";
        ns.appWindow = document.createElement("div");
        const vSpan = document.createElement("span");
        jest.spyOn(ns.appWindow, "querySelector").mockReturnValue(vSpan);
        //@ts-ignore
        await ns.inputChange(fEvent);
        expect(vSpan.innerHTML).toBe("55%");
    });

    test("Load PDF", () => {
        jest.spyOn(NoteSheet, "SetHeight");
        const parent = document.createElement("div");
        const target = document.createElement("button");
        parent.append(target);
        const fEvent = { currentTarget: target };

        //@ts-ignore
        ns._loadPDF(fEvent);
        expect(NoteSheet.SetHeight).toHaveBeenCalledTimes(1);
    });

    test("On Resize", () => {
        //@ts-ignore
        expect(ns.resized).toBe(false);
        //@ts-ignore
        ns._onResize();
        //@ts-ignore
        expect(ns.resized).toBe(true);
    });

    test("Generate Image HTML", () => {
        //@ts-ignore
        let h = ns.generateImageHTML();
        expect(h).toContain("fsc-image-placeholder");

        //@ts-ignore
        h = ns.generateImageHTML("this-is-a-source");
        expect(h).toContain("this-is-a-source");
    });

    test("Generate PDF HTML", async () => {
        //@ts-ignore
        let h = await ns.generatePDFHTML();
        expect(h).toContain("fsc-image-placeholder");

        //@ts-ignore
        h = await ns.generatePDFHTML("this-is-a-source");
        expect(h).toContain("load-pdf");

        //@ts-ignore
        h = await ns.generatePDFHTML("this-is-a-source", true);
        expect(h).toContain("this-is-a-source");
    });

    test("Generate Video HTML", () => {
        //@ts-ignore
        let h = ns.generateVideoHTML();
        expect(h).toContain("fsc-image-placeholder");

        //@ts-ignore
        h = ns.generateVideoHTML("this-is-a-source");
        expect(h).toContain("<video");

        //@ts-ignore
        h = ns.generateVideoHTML("this-is-a-youtube-source");
        expect(h).toContain("<iframe");

        //@ts-ignore
        ns.journalPages[0].video.width = 10;
        //@ts-ignore
        ns.journalPages[0].video.height = 10;
        //@ts-ignore
        h = ns.generateVideoHTML("this-is-a-source");
        expect(h).toContain("<video");

        //@ts-ignore
        h = ns.generateVideoHTML("this-is-a-youtube-source");
        expect(h).toContain("<iframe");
    });

    test("Date Selector Select", async () => {
        jest.spyOn(ns, "updateNoteRepeatDropdown").mockImplementation(() => {});
        //@ts-ignore
        ns.journalData.flags[ModuleName] = { noteData: {} };
        await ns.dateSelectorSelect({
            timeSelected: false,
            startDate: { year: 0, month: 0, day: 0, hour: 0, minute: 0, seconds: 0 },
            endDate: { year: 0, month: 0, day: 0, hour: 0, minute: 0, seconds: 0 }
        });
        expect(ns.updateNoteRepeatDropdown).toHaveBeenCalledTimes(1);

        await ns.dateSelectorSelect({
            timeSelected: false,
            startDate: { year: 0, month: 1, day: 1, hour: 0, minute: 0, seconds: 0 },
            endDate: { year: 0, month: 1, day: 1, hour: 0, minute: 0, seconds: 0 }
        });
        expect(ns.updateNoteRepeatDropdown).toHaveBeenCalledTimes(2);
    });

    test("MultiSelect Option Change", () => {
        //@ts-ignore
        ns.journalData.flags["foundryvtt-simple-calendar"] = { noteData: { categories: [] } };
        ns.multiSelectOptionChange("scNoteCategories_undefined", "Holiday", true);
        //@ts-ignore
        expect(ns.journalData.flags["foundryvtt-simple-calendar"].noteData.categories.indexOf("Holiday") > -1).toBe(true);

        ns.multiSelectOptionChange("scNoteCategories_undefined", "Holiday", false);
        //@ts-ignore
        expect(ns.journalData.flags["foundryvtt-simple-calendar"].noteData.categories.indexOf("Holiday") > -1).toBe(false);

        ns.multiSelectOptionChange("scUserPermissions_undefined", "123", true);
        //@ts-ignore
        expect(ns.journalData.ownership["123"]).toBe(2);
        //@ts-ignore
        ns.journalData.ownership["123"] = 1;
        ns.multiSelectOptionChange("scUserPermissions_undefined", "123", true);
        //@ts-ignore
        expect(ns.journalData.ownership["123"]).toBe(2);
        //@ts-ignore
        ns.journalData.ownership["123"] = 3;
        ns.multiSelectOptionChange("scUserPermissions_undefined", "123", true);
        //@ts-ignore
        expect(ns.journalData.ownership["123"]).toBe(3);

        ns.multiSelectOptionChange("scUserPermissions_undefined", "123", false);
        //@ts-ignore
        expect(ns.journalData.ownership["123"]).toBe(0);

        //@ts-ignore
        jest.spyOn(game.user, "id", "get").mockReturnValue("123");
        //@ts-ignore
        ns.journalData.ownership[""] = 2;
        ns.multiSelectOptionChange("scUserPermissions_undefined", "default", false);
        //@ts-ignore
        expect(ns.journalData.ownership["default"]).toBe(0);
        //@ts-ignore
        expect(ns.journalData.ownership[""]).toBe(0);

        ns.multiSelectOptionChange("scUserPermissions_undefined", "default", true);
        //@ts-ignore
        expect(ns.journalData.ownership["default"]).toBe(2);
        //@ts-ignore
        expect(ns.journalData.ownership[""]).toBe(2);

        jest.spyOn(ns, "writeInputValuesToObjects").mockImplementation(async () => {
            return Promise.reject();
        });
        ns.multiSelectOptionChange("scUserPermissions_undefined", "default", true);
    });

    test("Update Note Repeat Dropdown", () => {
        const selector = document.createElement("select");
        //@ts-ignore
        ns.appWindow = document.createElement("div");
        //@ts-ignore
        jest.spyOn(ns.appWindow, "querySelector").mockImplementation(() => {
            return selector;
        });
        //@ts-ignore
        ns.journalData.flags[ModuleName] = {
            noteData: {
                repeats: 0,
                startDate: { year: 0, month: 0, day: 0, hour: 0, minute: 0, seconds: 0 },
                endDate: { year: 0, month: 0, day: 0, hour: 0, minute: 0, seconds: 0 }
            }
        };

        ns.updateNoteRepeatDropdown();
        expect(selector.innerHTML).toContain("<option");

        //@ts-ignore
        ns.journalData.flags[ModuleName] = {
            noteData: {
                repeats: 0,
                startDate: { year: 0, month: 0, day: 0, hour: 0, minute: 0, seconds: 0 },
                endDate: { year: 1, month: 1, day: 0, hour: 0, minute: 0, seconds: 0 }
            }
        };
        ns.updateNoteRepeatDropdown();
        expect(selector.innerHTML).toContain("<option");

        //@ts-ignore
        ns.journalData.flags[ModuleName] = {
            noteData: {
                repeats: 0,
                startDate: { year: 0, month: 0, day: 0, hour: 0, minute: 0, seconds: 0 },
                endDate: { year: 0, month: 1, day: 1, hour: 0, minute: 0, seconds: 0 }
            }
        };
        ns.updateNoteRepeatDropdown();
        expect(selector.innerHTML).toContain("<option");

        //@ts-ignore
        ns.journalData.flags[ModuleName] = {
            noteData: {
                repeats: 0,
                startDate: { year: 0, month: 0, day: 0, hour: 0, minute: 0, seconds: 0 },
                endDate: { year: 0, month: 0, day: 8, hour: 0, minute: 0, seconds: 0 }
            }
        };
        ns.updateNoteRepeatDropdown();
        expect(selector.innerHTML).toContain("<option");
    });

    test("Write Input Values To Objects", async () => {
        //@ts-ignore
        ns.appWindow = document.createElement("div");
        //@ts-ignore
        ns.journalData.flags[ModuleName] = { noteData: { remindUsers: [] } };
        //@ts-ignore
        ns.journalData.ownership["a"] = 3;
        //@ts-ignore
        ns.journalData.ownership["b"] = 2;
        //@ts-ignore
        ns.editors["content"] = {};
        await ns.writeInputValuesToObjects();
        //@ts-ignore
        expect(ns.dirty).toBe(true);
        //@ts-ignore
        expect(ns.journalData.flags[ModuleName].noteData.repeats).toBe(0);

        jest.spyOn(Utilities, "getTextInputValue").mockReturnValue("image");
        jest.spyOn(Utilities, "getCheckBoxInputValue").mockReturnValueOnce(true);
        await ns.writeInputValuesToObjects();
        //@ts-ignore
        expect(ns.journalPages[0].src).toBe("image");

        jest.spyOn(Utilities, "getTextInputValue").mockReturnValue("pdf");
        await ns.writeInputValuesToObjects();
        //@ts-ignore
        expect(ns.journalPages[0].src).toBe("pdf");

        jest.spyOn(Utilities, "getTextInputValue").mockReturnValue("video");
        await ns.writeInputValuesToObjects();
        //@ts-ignore
        expect(ns.journalPages[0].src).toBe("video");

        jest.spyOn(Utilities, "getNumericInputValue").mockReturnValue(null);
        await ns.writeInputValuesToObjects();
        //@ts-ignore
        expect(ns.journalPages[0].video.volume).toBe(0);

        jest.spyOn(Utilities, "getTextInputValue").mockReturnValue("");
        await ns.writeInputValuesToObjects();
    });

    test("Reminder Change", async () => {
        //@ts-ignore
        ns.journalData.flags[ModuleName] = { noteData: { remindUsers: [] } };
        jest.spyOn(MainApplication, "updateApp").mockImplementation(() => {});
        jest.spyOn(GameSockets, "emit").mockImplementation(async () => {
            return true;
        });
        //@ts-ignore
        jest.spyOn(game.user, "id", "get").mockReturnValue("a");

        await ns.reminderChange();
        //@ts-ignore
        expect(ns.journalData.flags[ModuleName].noteData.remindUsers).toContain("a");
        expect(MainApplication.updateApp).toHaveBeenCalledTimes(1);
        expect(GameSockets.emit).toHaveBeenCalledTimes(0);

        await ns.reminderChange();
        //@ts-ignore
        expect(ns.journalData.flags[ModuleName].noteData.remindUsers).not.toContain("a");
        expect(MainApplication.updateApp).toHaveBeenCalledTimes(2);
        expect(GameSockets.emit).toHaveBeenCalledTimes(0);

        je.testUserPermission = () => {
            return false;
        };
        await ns.reminderChange();
        expect(MainApplication.updateApp).toHaveBeenCalledTimes(3);
        expect(GameSockets.emit).toHaveBeenCalledTimes(1);
    });

    test("Search Update", () => {
        const target = document.createElement("input");
        const fEvent = { target: target };
        jest.spyOn(ns, "searchPages").mockImplementation(() => {});

        //@ts-ignore
        ns.searchUpdate(fEvent);
        expect(ns.searchPages).toHaveBeenCalledTimes(1);
    });

    test("Clear Search", () => {
        ns.appWindow = document.createElement("div");
        const target = document.createElement("input");
        jest.spyOn(ns.appWindow, "querySelector").mockReturnValue(target);
        jest.spyOn(ns, "searchPages").mockImplementation(() => {});

        target.value = "asd";
        ns.clearSearch();
        expect(target.value).toBe("");
        expect(ns.searchPages).toHaveBeenCalledTimes(1);
    });

    test("Search Pages", () => {
        ns.appWindow = document.createElement("div");
        const target = document.createElement("input");
        //@ts-ignore
        jest.spyOn(ns.appWindow, "querySelectorAll").mockReturnValue([target]);

        ns.searchPages();
        //@ts-ignore
        expect(ns.journalPages[0].show).toBe(true);

        ns.uiElementStates.search.term = "asd";
        ns.searchPages();
        //@ts-ignore
        expect(ns.journalPages[0].show).toBe(false);
    });

    test("Edit", async () => {
        await ns.edit(new Event("click"));
        //@ts-ignore
        expect(ns.editMode).toBe(true);
    });

    test("Change Page", () => {
        //@ts-ignore
        ns.journalPages.push({ _id: "new123", show: true, name: "New Page", type: "text", text: { content: "" } });
        const target = document.createElement("div");
        const listItem = document.createElement("li");
        listItem.setAttribute("data-index", "new123");
        listItem.append(target);
        const fEvent = {
            target: target,
            stopPropagation: () => {}
        };

        jest.spyOn(ns, "render");

        //@ts-ignore
        ns.changePage(fEvent);
        expect(ns.render).toHaveBeenCalledTimes(1);
        expect(ns.uiElementStates.selectedPageIndex).toBe(1);
    });

    test("Add Page", async () => {
        jest.spyOn(ns, "render");

        await ns.addPage();
        expect(ns.render).toHaveBeenCalledTimes(1);
        expect(ns.uiElementStates.selectedPageIndex).toBe(1);
    });

    test("Remove Page", async () => {
        //@ts-ignore
        ns.journalPages.push({ _id: "new123", show: true, name: "New Page", type: "text", text: { content: "" } });
        const target = document.createElement("div");
        const listItem = document.createElement("li");
        listItem.setAttribute("data-index", "new123");
        listItem.append(target);
        const fEvent = {
            target: target,
            stopPropagation: () => {}
        };
        ns.uiElementStates.selectedPageIndex = 1;
        jest.spyOn(ns, "render");

        //@ts-ignore
        await ns.removePage(fEvent);
        expect(ns.render).toHaveBeenCalledTimes(1);
        expect(ns.uiElementStates.selectedPageIndex).toBe(0);
    });

    test("Save", async () => {
        //@ts-ignore
        ns.journalPages.push({ _id: "new123", show: true, name: "New Page", type: "text", text: { content: "" } });
        //@ts-ignore
        ns.journalPages[0].text.content = "";
        //@ts-ignore
        ns.journalData.flags[ModuleName] = { noteData: { remindUsers: [] } };
        jest.spyOn(MainApplication, "updateApp").mockImplementation(() => {});
        //@ts-ignore
        jest.spyOn(ns.object, "getEmbeddedCollection").mockReturnValue({ contents: [{ id: "" }, { id: "nothere", delete: async () => {} }] });
        await ns.save(new Event("click"));
        //@ts-ignore
        expect(ns.dirty).toBe(false);
        expect(MainApplication.updateApp).toHaveBeenCalledTimes(1);
    });

    test("Delete", () => {
        ns.delete(new Event("click"));
        //@ts-ignore
        expect(global.DialogRenderer).toHaveBeenCalledTimes(1);
    });

    test("Delete Confirm", async () => {
        jest.spyOn(NManager, "removeNoteStub").mockImplementation(() => {});
        jest.spyOn(MainApplication, "updateApp").mockImplementation(() => {});

        await ns.deleteConfirm();
        expect(NManager.removeNoteStub).toHaveBeenCalledTimes(1);
        expect(MainApplication.updateApp).toHaveBeenCalledTimes(1);
    });
});
