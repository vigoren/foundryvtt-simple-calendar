/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import { jest, beforeEach, describe, expect, test } from "@jest/globals";
import Calendar from "../calendar";
import ConfigurationApp from "./configuration-app";
import {
    CalManager,
    NManager,
    SC,
    updateCalManager,
    updateConfigurationApplication,
    updateMainApplication,
    updateNManager,
    updateSC
} from "../index";
import CalendarManager from "../calendar/calendar-manager";
import SCController from "../s-c-controller";
import MainApp from "./main-app";
import NoteManager from "../notes/note-manager";
import { GameSettings } from "../foundry-interfacing/game-settings";
import fetchMock from "jest-fetch-mock";
import PredefinedCalendar from "../configuration/predefined-calendar";
import { ConfigurationDateSelectors, LeapYearRules, PredefinedCalendars } from "../../constants";
import DateSelectorManager from "../date-selector/date-selector-manager";
import * as VisualUtilities from "../utilities/visual";
import * as InputUtilities from "../utilities/inputs";
import * as ObjectUtilities from "../utilities/object";
import Month from "../calendar/month";
import { saveAs } from "file-saver";
import { FoundryVTTGameData } from "../foundry-interfacing/game-data";

jest.mock("file-saver");

fetchMock.enableMocks();
describe("Configuration App Class Tests", () => {
    let tCal: Calendar;
    let cloneCal: Calendar;
    let ca: ConfigurationApp;

    beforeEach(async () => {
        updateCalManager(new CalendarManager());
        updateSC(new SCController());
        updateMainApplication(new MainApp());
        updateNManager(new NoteManager());

        tCal = new Calendar("a", "");
        cloneCal = new Calendar("a_temp", "");

        jest.spyOn(CalManager, "getActiveCalendar").mockImplementation(() => {
            return tCal;
        });
        jest.spyOn(CalManager, "getVisibleCalendar").mockImplementation(() => {
            return tCal;
        });
        jest.spyOn(CalManager, "getAllCalendars").mockImplementation(() => {
            return [tCal];
        });
        jest.spyOn(CalManager, "cloneCalendars").mockImplementation(() => {
            return [cloneCal];
        });

        ca = new ConfigurationApp();
        updateConfigurationApplication(ca);

        fetchMock.resetMocks();
        fetchMock.mockOnce(
            `{"calendar":{"currentDate":{"year":2022,"month":2,"day":28,"seconds":0},"general":{"gameWorldTimeIntegration":"mixed","showClock":true,"noteDefaultVisibility":false,"postNoteRemindersOnFoundryLoad":true,"pf2eSync":true,"dateFormat":{"date":"MMMM DD, YYYY","time":"HH:mm:ss","monthYear":"MMMM YAYYYYYZ"}},"leapYear":{"rule":"gregorian","customMod":0},"months":[{"name":"January","abbreviation":"Jan","numericRepresentation":1,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"February","abbreviation":"Feb","numericRepresentation":2,"numericRepresentationOffset":0,"numberOfDays":28,"numberOfLeapYearDays":29,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"March","abbreviation":"Mar","numericRepresentation":3,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"April","abbreviation":"Apr","numericRepresentation":4,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"May","abbreviation":"May","numericRepresentation":5,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"June","abbreviation":"Jun","numericRepresentation":6,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"July","abbreviation":"Jul","numericRepresentation":7,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"August","abbreviation":"Aug","numericRepresentation":8,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"September","abbreviation":"Sep","numericRepresentation":9,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"October","abbreviation":"Oct","numericRepresentation":10,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"November","abbreviation":"Nov","numericRepresentation":11,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"December","abbreviation":"Dec","numericRepresentation":12,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null}],"moons":[{"name":"Moon","cycleLength":29.53059,"firstNewMoon":{"yearReset":"none","yearX":0,"year":2000,"month":1,"day":5},"phases":[{"name":"New Moon","length":1,"icon":"new","singleDay":true},{"name":"Waxing Crescent","length":6.38265,"icon":"waxing-crescent","singleDay":false},{"name":"First Quarter","length":1,"icon":"first-quarter","singleDay":true},{"name":"Waxing Gibbous","length":6.38265,"icon":"waxing-gibbous","singleDay":false},{"name":"Full Moon","length":1,"icon":"full","singleDay":true},{"name":"Waning Gibbous","length":6.38265,"icon":"waning-gibbous","singleDay":false},{"name":"Last Quarter","length":1,"icon":"last-quarter","singleDay":true},{"name":"Waning Crescent","length":6.38265,"icon":"waning-crescent","singleDay":false}],"color":"#ffffff","cycleDayAdjust":0.5}],"noteCategories":[{"name":"Holiday","textColor":"#FFFFFF","color":"#148e94"}],"seasons":[{"name":"Spring","startingMonth":2,"startingDay":19,"color":"#46b946","icon":"spring","sunriseTime":21600,"sunsetTime":64800},{"name":"Summer","startingMonth":5,"startingDay":19,"color":"#e0c40b","icon":"summer","sunriseTime":21600,"sunsetTime":64800},{"name":"Fall","startingMonth":8,"startingDay":21,"color":"#ff8e47","icon":"fall","sunriseTime":21600,"sunsetTime":64800},{"name":"Winter","startingMonth":11,"startingDay":20,"color":"#479dff","icon":"winter","sunriseTime":21600,"sunsetTime":64800}],"time":{"hoursInDay":24,"minutesInHour":60,"secondsInMinute":60,"gameTimeRatio":1,"unifyGameAndClockPause":false,"updateFrequency":1},"weekdays":[{"abbreviation":"Su","name":"Sunday","numericRepresentation":1},{"abbreviation":"Mo","name":"Monday","numericRepresentation":2},{"abbreviation":"Tu","name":"Tuesday","numericRepresentation":3},{"abbreviation":"We","name":"Wednesday","numericRepresentation":4},{"abbreviation":"Th","name":"Thursday","numericRepresentation":5},{"abbreviation":"Fr","name":"Friday","numericRepresentation":6},{"abbreviation":"Sa","name":"Saturday","numericRepresentation":7}],"year":{"numericRepresentation":2022,"prefix":"","postfix":"","showWeekdayHeadings":true,"firstWeekday":4,"yearZero":1970,"yearNames":[],"yearNamingRule":"default","yearNamesStart":0}}}`
        );
        await PredefinedCalendar.setToPredefined(tCal, PredefinedCalendars.Gregorian);

        //@ts-ignore
        ca.object = tCal;
        //@ts-ignore
        ca.calendars.push(tCal);

        //@ts-ignore
        game.user.isGM = false;
        SC.primary = false;
    });

    test("Render", () => {
        jest.spyOn(ca, "initializeAndShowDialog").mockImplementation(async () => {});
        jest.spyOn(GameSettings, "GetStringSettings").mockImplementation(() => {
            return "";
        });
        jest.spyOn(ObjectUtilities, "isObjectEmpty").mockReturnValueOnce(true).mockReturnValue(false);

        ca.render();
        expect(ca.initializeAndShowDialog).toHaveBeenCalledTimes(1);

        ca.render();
        expect(GameSettings.GetStringSettings).toHaveBeenCalledTimes(2);

        ca.render(false, {});
        expect(GameSettings.GetStringSettings).toHaveBeenCalledTimes(4);
    });

    test("Initialize And Show Dialog", async () => {
        jest.spyOn(SC, "load").mockImplementation(() => {});

        fetchMock.mockOnce(
            '[{"key": "gregorian", "label": "Gregorian", "config":  true, "notes":  false},{"key": "darksun", "label": "Dark Sun", "config":  true, "notes":  false},{"key": "dsa-tde5e", "label": "Das Schwarze Auge/The Dark Eye 5th Edition", "config":  true, "notes":  true},{"key": "eberron", "label": "Eberron", "config":  true, "notes":  true},{"key": "exandrian", "label": "Exandrian", "config":  true, "notes":  true},{"key": "forbidden-lands", "label": "Forbidden Lands", "config":  true, "notes":  false},{"key": "harptos", "label": "Forgotten Realms: Harptos", "config":  true, "notes":  true},{"key": "golarianpf1e", "label": "Golarian: Pathfinder 1E", "config":  true, "notes":  false},{"key": "golarianpf2e", "label": "Golarian: Pathfinder 2E", "config":  true, "notes":  false},{"key": "greyhawk", "label": "Greyhawk", "config":  true, "notes":  false},{"key": "traveller-ic", "label": "Traveller: Imperial Calendar", "config":  true, "notes":  false},{"key": "warhammer", "label": "Warhammer: Imperial Calendar", "config":  true, "notes":  false}]'
        );

        await ca.initializeAndShowDialog();
        //@ts-ignore
        expect(ca.predefindCalendars.length).toBeGreaterThan(0);

        jest.spyOn(console, "error").mockImplementation(() => {});
        //@ts-ignore
        ca.predefindCalendars = [];

        //@ts-ignore
        jest.spyOn(ca, "rendered", "get").mockReturnValue(false);

        await ca.initializeAndShowDialog();
        expect(console.error).toHaveBeenCalledTimes(1);
    });

    test("Default Options", () => {
        expect(ConfigurationApp.defaultOptions).toBeDefined();
    });

    test("Show App", () => {
        jest.spyOn(ca, "render").mockImplementation(() => {});
        ca.showApp();
        expect(ca.render).toHaveBeenCalledTimes(1);
    });

    test("Close App", () => {
        jest.spyOn(ca, "close").mockImplementation(async () => {});
        ca.closeApp();
        expect(ca.close).toHaveBeenCalledTimes(1);
    });

    test("Close", () => {
        jest.spyOn(CalManager, "clearClones").mockImplementation(() => {});
        jest.spyOn(DateSelectorManager, "RemoveSelector").mockImplementation(() => {});
        ca.close();
        expect(CalManager.clearClones).toHaveBeenCalledTimes(1);
        expect(DateSelectorManager.RemoveSelector).toHaveBeenCalledTimes(8);
        //@ts-ignore
        expect(ca.appWindow).toBeNull();
    });

    test("Update App", () => {
        jest.spyOn(ca, "render").mockImplementation(() => {});
        //@ts-ignore
        ca.updateApp();
        expect(ca.render).toHaveBeenCalledTimes(1);
    });

    test("Get Data", () => {
        jest.spyOn(FoundryVTTGameData, "systemID", "get").mockReturnValue("pf2e");
        expect(ca.getData()).toBeDefined();
    });

    test("Update Object", async () => {
        //@ts-ignore
        expect(await ca._updateObject(new Event("click"))).toBeUndefined();
    });

    test("Activate Listeners", () => {
        const fQuery = {};
        const appWindow = document.createElement("div");
        const elm = document.createElement("div");
        //@ts-ignore
        jest.spyOn(DateSelectorManager, "GetSelector").mockImplementation(() => {
            return { activateListeners: jest.fn() };
        });
        jest.spyOn(document, "getElementById").mockReturnValue(appWindow);
        jest.spyOn(appWindow, "querySelector").mockReturnValue(elm);
        //@ts-ignore
        jest.spyOn(appWindow, "querySelectorAll").mockReturnValue([elm]);

        //@ts-ignore
        ca.activateListeners(fQuery);
        expect(DateSelectorManager.GetSelector).toHaveBeenCalledTimes(9);
        expect(appWindow.querySelector).toHaveBeenCalled();
        expect(appWindow.querySelectorAll).toHaveBeenCalled();
    });

    test("Input Change", () => {
        //@ts-ignore
        jest.spyOn(ca, "writeInputValuesToObjects").mockImplementation(() => {
            return true;
        });
        //@ts-ignore
        jest.spyOn(ca, "updateUIFromObject").mockImplementation(() => {
            return true;
        });
        //@ts-ignore
        ca.inputChange();
        //@ts-ignore
        expect(ca.writeInputValuesToObjects).toHaveBeenCalledTimes(1);
        //@ts-ignore
        expect(ca.updateUIFromObject).toHaveBeenCalledTimes(1);
    });

    test("Toggle Calendar Selector", () => {
        //@ts-ignore
        ca.appWindow = document.createElement("div");
        //@ts-ignore
        jest.spyOn(ca.appWindow, "querySelector").mockReturnValue(document.createElement("div"));
        jest.spyOn(VisualUtilities, "animateElement").mockImplementation(() => {
            return true;
        });

        //@ts-ignore
        ca.toggleCalendarSelector();
        expect(VisualUtilities.animateElement).toHaveBeenCalledTimes(1);
    });

    test("Calendar Click", () => {
        const fEvent = {
            currentTarget: document.createElement("div")
        };
        fEvent.currentTarget.setAttribute("data-calendar", "a_temp");
        //@ts-ignore
        ca.calendars.push(cloneCal);

        //@ts-ignore
        jest.spyOn(ca, "updateApp").mockImplementation(() => {
            return true;
        });

        //@ts-ignore
        ca.calendarClick(fEvent);
        //@ts-ignore
        expect(ca.updateApp).toHaveBeenCalledTimes(1);
    });

    test("Remove Calendar Click", () => {
        const fEvent = {
            currentTarget: document.createElement("div"),
            preventDefault: jest.fn(),
            stopPropagation: jest.fn()
        };
        fEvent.currentTarget.setAttribute("data-calendar", "a");

        jest.spyOn(ca, "confirmationDialog").mockImplementation(() => {});

        //@ts-ignore
        ca.removeCalendarClick(fEvent);
        expect(ca.confirmationDialog).toHaveBeenCalledTimes(1);
    });

    test("Remove Calendar Confirm", () => {
        jest.spyOn(CalManager, "removeCalendar").mockImplementation(() => {});
        //@ts-ignore
        jest.spyOn(ca, "updateApp").mockImplementation(() => {
            return true;
        });

        //@ts-ignore
        ca.removeCalendarConfirm({ id: "a" });
        expect(CalManager.removeCalendar).toHaveBeenCalledTimes(1);
        //@ts-ignore
        expect(ca.updateApp).toHaveBeenCalledTimes(1);
    });

    test("Add New Calendar", async () => {
        const fEvent = {
            preventDefault: jest.fn()
        };
        const input = document.createElement("input");
        input.value = "test";

        jest.spyOn(document, "getElementById").mockReturnValue(input);
        jest.spyOn(CalManager, "addTempCalendar").mockReturnValue(tCal);
        jest.spyOn(PredefinedCalendar, "setToPredefined").mockImplementation(async () => {
            return true;
        });
        //@ts-ignore
        jest.spyOn(ca, "updateApp").mockImplementation(() => {
            return true;
        });

        //@ts-ignore
        await ca.addNewCalendar(fEvent);
        expect(CalManager.addTempCalendar).toHaveBeenCalledTimes(1);
        expect(PredefinedCalendar.setToPredefined).toHaveBeenCalledTimes(1);
        //@ts-ignore
        expect(ca.updateApp).toHaveBeenCalledTimes(1);
    });

    test("Predefined Calendar Click", () => {
        //@ts-ignore
        ca.appWindow = document.createElement("div");
        const fEvent = {
            target: document.createElement("div")
        };
        const preDefined = document.createElement("div");
        const elm = document.createElement("div");
        const nextBtn = document.createElement("div");

        jest.spyOn(fEvent.target, "closest").mockReturnValue(elm);
        //@ts-ignore
        jest.spyOn(ca.appWindow, "querySelector").mockReturnValue(nextBtn);
        //@ts-ignore
        jest.spyOn(ca.appWindow, "querySelectorAll").mockReturnValue([preDefined]);

        elm.classList.add("fsc-selected");
        //@ts-ignore
        ca.predefinedCalendarClick(fEvent);
        //@ts-ignore
        expect(ca.uiElementStates.selectedPredefinedCalendar).toBe("");
        expect(nextBtn.style.display).toBe("none");

        elm.classList.remove("fsc-selected");
        elm.setAttribute("data-calendar", "a");
        //@ts-ignore
        ca.predefinedCalendarClick(fEvent);
        //@ts-ignore
        expect(ca.uiElementStates.selectedPredefinedCalendar).toBe("a");
        expect(nextBtn.style.display).toBe("block");
    });

    test("Quick Setup Next Click", () => {
        const fEvent = {
            preventDefault: jest.fn()
        };
        jest.spyOn(ca, "confirmationDialog").mockImplementation(() => {});

        //@ts-ignore
        ca.quickSetupNextClick(fEvent);
        expect(ca.confirmationDialog).toHaveBeenCalledTimes(1);
    });

    test("Quick Setup Next Confirm", async () => {
        jest.spyOn(PredefinedCalendar, "setToPredefined").mockImplementation(async () => {
            return true;
        });
        //@ts-ignore
        jest.spyOn(ca, "updateApp").mockImplementation(() => {
            return true;
        });

        //@ts-ignore
        await ca.quickSetupNextConfirm();
        //@ts-ignore
        expect(ca.uiElementStates.qsNextClicked).toBe(true);
        expect(PredefinedCalendar.setToPredefined).toHaveBeenCalledTimes(1);
        //@ts-ignore
        expect(ca.updateApp).toHaveBeenCalledTimes(1);
    });

    test("Quick Setup Back Click", () => {
        //@ts-ignore
        ca.appWindow = document.createElement("div");
        const fEvent = {
            preventDefault: jest.fn()
        };
        const elm = document.createElement("div");

        //@ts-ignore
        jest.spyOn(ca.appWindow, "querySelector").mockReturnValue(elm);
        jest.spyOn(VisualUtilities, "animateElement").mockImplementation(() => {
            return true;
        });

        //@ts-ignore
        ca.quickSetupBackClick(fEvent);

        //@ts-ignore
        expect(ca.uiElementStates.qsNextClicked).toBe(true);
        expect(VisualUtilities.animateElement).toHaveBeenCalledTimes(2);
    });

    test("Quick Setup Save Click", () => {
        const fEvent = {
            preventDefault: jest.fn()
        };
        //@ts-ignore
        jest.spyOn(DateSelectorManager, "GetSelector").mockReturnValue({ selectedDate: { start: { year: 1, month: 0, day: 0 } } });
        //@ts-ignore
        jest.spyOn(ca, "save").mockImplementation(async () => {});
        jest.spyOn(tCal, "updateMonth").mockImplementation(() => {});

        //@ts-ignore
        ca.quickSetupSaveClick(fEvent);
        //@ts-ignore
        expect(ca.uiElementStates.selectedPredefinedCalendar).toBe("");
        //@ts-ignore
        expect(ca.uiElementStates.qsNextClicked).toBe(false);
        //@ts-ignore
        expect(ca.uiElementStates.qsAddNotes).toBe(true);
        expect(tCal.updateMonth).toHaveBeenCalledTimes(1);
        expect(ca.save).toHaveBeenCalledTimes(1);
    });

    test("Toggle Show Advanced", () => {
        const fEvent = {
            currentTarget: document.createElement("div"),
            preventDefault: jest.fn()
        };
        const row = document.createElement("div");

        jest.spyOn(fEvent.currentTarget, "closest").mockReturnValue(row);
        //@ts-ignore
        jest.spyOn(ca, "updateUIFromObject").mockImplementation(() => {});

        //@ts-ignore
        ca.toggleShowAdvanced(fEvent);
        //@ts-ignore
        expect(ca.updateUIFromObject).toHaveBeenCalledTimes(0);

        row.setAttribute("data-index", "0");
        row.setAttribute("data-type", "month");
        //@ts-ignore
        ca.toggleShowAdvanced(fEvent);
        //@ts-ignore
        expect(ca.updateUIFromObject).toHaveBeenCalledTimes(1);
        expect(tCal.months[0].showAdvanced).toBe(true);

        row.setAttribute("data-type", "season");
        //@ts-ignore
        ca.toggleShowAdvanced(fEvent);
        //@ts-ignore
        expect(ca.updateUIFromObject).toHaveBeenCalledTimes(2);
        expect(tCal.seasons[0].showAdvanced).toBe(true);

        row.setAttribute("data-type", "weekday");
        //@ts-ignore
        ca.toggleShowAdvanced(fEvent);
        //@ts-ignore
        expect(ca.updateUIFromObject).toHaveBeenCalledTimes(3);
        expect(tCal.weekdays[0].showAdvanced).toBe(true);
    });

    test("Write Input Values To Objects", () => {
        //@ts-ignore
        ca.appWindow = document.createElement("div");

        tCal.year.yearNames.push("123");
        tCal.noteCategories.push({ id: "", name: "asd", textColor: "", color: "" });
        const compcatControlDisplay = document.createElement("input");
        const yearName = document.createElement("div");
        const month = document.createElement("div");
        const weekday = document.createElement("div");
        const season = document.createElement("div");
        const moon = document.createElement("div");
        const moonPhase = document.createElement("div");
        const noteCategory = document.createElement("div");
        //@ts-ignore
        jest.spyOn(ca.appWindow, "querySelectorAll")
            //@ts-ignore
            .mockReturnValueOnce([compcatControlDisplay])
            //@ts-ignore
            .mockReturnValueOnce([yearName])
            //@ts-ignore
            .mockReturnValueOnce([month])
            //@ts-ignore
            .mockReturnValueOnce([weekday])
            //@ts-ignore
            .mockReturnValueOnce([month])
            //@ts-ignore
            .mockReturnValueOnce([season])
            //@ts-ignore
            .mockReturnValueOnce([moon])
            //@ts-ignore
            .mockReturnValueOnce([noteCategory]);
        //@ts-ignore
        jest.spyOn(moon, "querySelectorAll").mockReturnValue([moonPhase]);
        //@ts-ignore
        ca.writeInputValuesToObjects();

        yearName.setAttribute("data-index", "0");
        month.setAttribute("data-index", "0");
        weekday.setAttribute("data-index", "0");
        season.setAttribute("data-index", "0");
        moon.setAttribute("data-index", "0");
        noteCategory.setAttribute("data-index", "0");

        //@ts-ignore
        jest.spyOn(ca.appWindow, "querySelectorAll")
            //@ts-ignore
            .mockReturnValueOnce([compcatControlDisplay])
            //@ts-ignore
            .mockReturnValueOnce([yearName])
            //@ts-ignore
            .mockReturnValueOnce([month])
            //@ts-ignore
            .mockReturnValueOnce([weekday])
            //@ts-ignore
            .mockReturnValueOnce([month])
            //@ts-ignore
            .mockReturnValueOnce([season])
            //@ts-ignore
            .mockReturnValueOnce([moon])
            //@ts-ignore
            .mockReturnValueOnce([noteCategory]);

        //@ts-ignore
        ca.writeInputValuesToObjects();

        moonPhase.setAttribute("data-index", "0");
        tCal.months[0].intercalary = true;
        tCal.months[0].intercalaryInclude = true;
        //@ts-ignore
        jest.spyOn(ca.appWindow, "querySelectorAll")
            //@ts-ignore
            .mockReturnValueOnce([compcatControlDisplay])
            //@ts-ignore
            .mockReturnValueOnce([yearName])
            //@ts-ignore
            .mockReturnValueOnce([month])
            //@ts-ignore
            .mockReturnValueOnce([weekday])
            //@ts-ignore
            .mockReturnValueOnce([month])
            //@ts-ignore
            .mockReturnValueOnce([season])
            //@ts-ignore
            .mockReturnValueOnce([moon])
            //@ts-ignore
            .mockReturnValueOnce([noteCategory]);

        jest.spyOn(InputUtilities, "getNumericInputValue").mockReturnValue(0);

        //@ts-ignore
        ca.writeInputValuesToObjects();

        jest.spyOn(InputUtilities, "getNumericInputValue").mockReturnValue(-1);

        //@ts-ignore
        ca.writeInputValuesToObjects();
        expect(tCal.time.hoursInDay).toBe(1);
        expect(tCal.time.minutesInHour).toBe(1);
        expect(tCal.time.secondsInMinute).toBe(1);
        expect(tCal.time.updateFrequency).toBe(1);
    });

    test("Update UI From Object", () => {
        //@ts-ignore
        ca.appWindow = document.createElement("div");
        const elm = document.createElement("div");
        //@ts-ignore
        jest.spyOn(ca.appWindow, "querySelector").mockReturnValue(elm);
        jest.spyOn(elm, "closest").mockReturnValue(elm);
        jest.spyOn(elm, "querySelector").mockReturnValue(elm);

        //@ts-ignore
        ca.updateUIFromObject();

        elm.classList.add("fsc-closed");
        tCal.months[0].numericRepresentation = -1;

        //@ts-ignore
        ca.updateUIFromObject();

        elm.classList.remove("fsc-closed");
        tCal.months[0].showAdvanced = true;
        //@ts-ignore
        ca.updateUIFromObject();

        elm.classList.remove("fsc-closed");
        elm.classList.remove("fsc-open");
        tCal.year.leapYearRule.rule = LeapYearRules.None;
        //@ts-ignore
        ca.updateUIFromObject();
    });

    test("Date Format Table Click", () => {
        //@ts-ignore
        ca.appWindow = document.createElement("div");
        const elm = document.createElement("div");
        //@ts-ignore
        jest.spyOn(ca.appWindow, "querySelector").mockReturnValue(elm);

        //@ts-ignore
        ca.dateFormatTableClick();
        //@ts-ignore
        expect(ca.uiElementStates.dateFormatTableExpanded).toBe(true);
        expect(elm.style.display).toBe("block");
        expect(elm.classList.contains("fa-chevron-up")).toBe(true);

        //@ts-ignore
        ca.dateFormatTableClick();
        //@ts-ignore
        expect(ca.uiElementStates.dateFormatTableExpanded).toBe(false);
        expect(elm.style.display).toBe("none");
        expect(elm.classList.contains("fa-chevron-down")).toBe(true);
    });

    test("Rebase Month Numbers", () => {
        ca.rebaseMonthNumbers();
        expect(tCal.months[0].numericRepresentation).toBe(1);
        expect(tCal.months[11].numericRepresentation).toBe(12);

        tCal.months[2].intercalary = true;
        ca.rebaseMonthNumbers();
        expect(tCal.months[0].numericRepresentation).toBe(1);

        expect(tCal.months[2].numericRepresentation).toBe(-1);
        expect(tCal.months[11].numericRepresentation).toBe(11);
    });

    test("Add To Table", () => {
        const fEvent = {
            currentTarget: document.createElement("div"),
            preventDefault: jest.fn()
        };

        //@ts-ignore
        jest.spyOn(ca, "updateApp").mockImplementation(() => {
            return true;
        });

        fEvent.currentTarget.setAttribute("data-type", "month");
        //@ts-ignore
        ca.addToTable(fEvent);
        expect(tCal.months.length).toBe(13);

        fEvent.currentTarget.setAttribute("data-type", "weekday");
        //@ts-ignore
        ca.addToTable(fEvent);
        expect(tCal.weekdays.length).toBe(8);

        fEvent.currentTarget.setAttribute("data-type", "season");
        //@ts-ignore
        ca.addToTable(fEvent);
        expect(tCal.seasons.length).toBe(5);

        fEvent.currentTarget.setAttribute("data-type", "moon");
        //@ts-ignore
        ca.addToTable(fEvent);
        expect(tCal.moons.length).toBe(2);

        fEvent.currentTarget.setAttribute("data-type", "moon-phase");
        fEvent.currentTarget.setAttribute("data-moon-index", "1");
        //@ts-ignore
        ca.addToTable(fEvent);
        expect(tCal.moons[1].phases.length).toBe(9);

        fEvent.currentTarget.setAttribute("data-type", "year-name");
        //@ts-ignore
        ca.addToTable(fEvent);
        expect(tCal.year.yearNames.length).toBe(1);

        fEvent.currentTarget.setAttribute("data-type", "note-category");
        //@ts-ignore
        ca.addToTable(fEvent);
        expect(tCal.noteCategories.length).toBe(2);

        fEvent.currentTarget.setAttribute("data-type", "");
        //@ts-ignore
        ca.addToTable(fEvent);
        expect(tCal.noteCategories.length).toBe(2);
    });

    test("Remove From Table", () => {
        const row = document.createElement("div");
        const fEvent = {
            currentTarget: document.createElement("div"),
            preventDefault: jest.fn()
        };
        //@ts-ignore
        jest.spyOn(ca, "updateApp").mockImplementation(() => {
            return true;
        });
        jest.spyOn(fEvent.currentTarget, "closest").mockReturnValue(row);

        fEvent.currentTarget.setAttribute("data-type", "month");
        row.setAttribute("data-index", "0");
        //@ts-ignore
        ca.removeFromTable(fEvent);
        expect(tCal.months.length).toBe(11);

        fEvent.currentTarget.setAttribute("data-type", "weekday");
        //@ts-ignore
        ca.removeFromTable(fEvent);
        expect(tCal.weekdays.length).toBe(6);

        fEvent.currentTarget.setAttribute("data-type", "season");
        //@ts-ignore
        ca.removeFromTable(fEvent);
        expect(tCal.seasons.length).toBe(3);

        fEvent.currentTarget.setAttribute("data-type", "moon-phase");
        fEvent.currentTarget.setAttribute("data-moon-index", "0");
        //@ts-ignore
        ca.removeFromTable(fEvent);
        expect(tCal.moons[0].phases.length).toBe(7);

        fEvent.currentTarget.setAttribute("data-type", "moon");
        //@ts-ignore
        ca.removeFromTable(fEvent);
        expect(tCal.moons.length).toBe(0);

        tCal.year.yearNames.push("asd");
        fEvent.currentTarget.setAttribute("data-type", "year-name");
        //@ts-ignore
        ca.removeFromTable(fEvent);
        expect(tCal.year.yearNames.length).toBe(0);

        fEvent.currentTarget.setAttribute("data-type", "note-category");
        //@ts-ignore
        ca.removeFromTable(fEvent);
        expect(tCal.noteCategories.length).toBe(0);

        fEvent.currentTarget.setAttribute("data-type", "");
        //@ts-ignore
        ca.removeFromTable(fEvent);

        //Remove All
        fEvent.currentTarget.setAttribute("data-index", "all");
        fEvent.currentTarget.setAttribute("data-type", "month");
        //@ts-ignore
        ca.removeFromTable(fEvent);
        expect(tCal.months.length).toBe(1);

        fEvent.currentTarget.setAttribute("data-type", "weekday");
        //@ts-ignore
        ca.removeFromTable(fEvent);
        expect(tCal.weekdays.length).toBe(0);

        fEvent.currentTarget.setAttribute("data-type", "season");
        //@ts-ignore
        ca.removeFromTable(fEvent);
        expect(tCal.seasons.length).toBe(0);

        fEvent.currentTarget.setAttribute("data-type", "moon");
        //@ts-ignore
        ca.addToTable(fEvent);

        fEvent.currentTarget.setAttribute("data-type", "moon-phase");
        fEvent.currentTarget.setAttribute("data-moon-index", "0");
        //@ts-ignore
        ca.removeFromTable(fEvent);
        expect(tCal.moons[0].phases.length).toBe(0);

        fEvent.currentTarget.setAttribute("data-type", "moon");
        //@ts-ignore
        ca.removeFromTable(fEvent);
        expect(tCal.moons.length).toBe(0);

        fEvent.currentTarget.setAttribute("data-type", "year-name");
        //@ts-ignore
        ca.removeFromTable(fEvent);
        expect(tCal.year.yearNames.length).toBe(0);

        fEvent.currentTarget.setAttribute("data-type", "note-category");
        //@ts-ignore
        ca.removeFromTable(fEvent);
        expect(tCal.noteCategories.length).toBe(0);

        fEvent.currentTarget.setAttribute("data-type", "");
        //@ts-ignore
        ca.removeFromTable(fEvent);

        //Remove the last month
        fEvent.currentTarget.setAttribute("data-index", "");
        fEvent.currentTarget.setAttribute("data-type", "month");
        //@ts-ignore
        ca.removeFromTable(fEvent);
        expect(tCal.months.length).toBe(1);
    });

    test("Date Selector Change", () => {
        ca.dateSelectorChange(tCal.seasons[0].id, ConfigurationDateSelectors.seasonStartingDate, {
            startDate: { month: 0, day: 0 },
            endDate: {},
            timeSelected: false
        });
        expect(tCal.seasons[0].startingMonth).toBe(0);
        expect(tCal.seasons[0].startingDay).toBe(0);

        ca.dateSelectorChange(tCal.seasons[0].id, ConfigurationDateSelectors.seasonStartingDate, {
            startDate: { month: 1, day: 1 },
            endDate: {},
            timeSelected: false
        });
        expect(tCal.seasons[0].startingMonth).toBe(1);
        expect(tCal.seasons[0].startingDay).toBe(1);

        ca.dateSelectorChange(tCal.seasons[0].id, ConfigurationDateSelectors.seasonSunriseSunsetTime, {
            startDate: { hour: 0, minute: 0 },
            endDate: { hour: 0, minute: 0 },
            timeSelected: true
        });
        expect(tCal.seasons[0].sunriseTime).toBe(0);
        expect(tCal.seasons[0].sunsetTime).toBe(0);

        ca.dateSelectorChange(tCal.seasons[0].id, ConfigurationDateSelectors.seasonSunriseSunsetTime, {
            startDate: { hour: 1, minute: 1 },
            endDate: { hour: 1, minute: 1 },
            timeSelected: true
        });
        expect(tCal.seasons[0].sunriseTime).toBe(3660);
        expect(tCal.seasons[0].sunsetTime).toBe(3660);

        ca.dateSelectorChange(tCal.moons[0].id, ConfigurationDateSelectors.moonFirstNewMoonDate, {
            startDate: { month: 0, day: 0 },
            endDate: {},
            timeSelected: false
        });
        expect(tCal.moons[0].firstNewMoon.month).toBe(0);
        expect(tCal.moons[0].firstNewMoon.day).toBe(0);

        ca.dateSelectorChange(tCal.moons[0].id, ConfigurationDateSelectors.moonFirstNewMoonDate, {
            startDate: { month: 1, day: 1 },
            endDate: {},
            timeSelected: false
        });
        expect(tCal.moons[0].firstNewMoon.month).toBe(1);
        expect(tCal.moons[0].firstNewMoon.day).toBe(1);
    });

    test("Update Month Days", () => {
        const m = new Month("New Month", 1, 0, -1);
        ca.updateMonthDays(m);
        expect(m.numberOfDays).toBe(0);

        m.numberOfLeapYearDays = 10;
        ca.updateMonthDays(m);
        expect(m.days.length).toBe(10);

        m.resetDays();
        m.days[2].current = true;

        m.numberOfDays = 10;
        m.numberOfLeapYearDays = 10;
        ca.updateMonthDays(m);
        expect(m.days[2].current).toBe(true);

        m.numberOfDays = 1;
        m.numberOfLeapYearDays = 1;
        ca.updateMonthDays(m);
        expect(m.days[0].current).toBe(true);
    });

    test("Confirmation Dialog", () => {
        ca.confirmationDialog("overwrite", "", {});
        //@ts-ignore
        expect(global.DialogRenderer).toHaveBeenCalledTimes(1);

        ca.confirmationDialog("remove-calendar", "", {});
        //@ts-ignore
        expect(global.DialogRenderer).toHaveBeenCalledTimes(2);
    });

    test("Confirmation Dialog Yes", async () => {
        //@ts-ignore
        jest.spyOn(ca, "quickSetupNextConfirm").mockImplementation(() => {});
        //@ts-ignore
        jest.spyOn(ca, "removeCalendarConfirm").mockImplementation(() => {});

        await ca.confirmationDialogYes("predefined", {});
        //@ts-ignore
        expect(ca.quickSetupNextConfirm).toHaveBeenCalledTimes(1);

        await ca.confirmationDialogYes("remove-calendar", {});
        //@ts-ignore
        expect(ca.removeCalendarConfirm).toHaveBeenCalledTimes(1);
    });

    test("Save Click", async () => {
        jest.spyOn(ca, "save").mockImplementation(async () => {});
        //@ts-ignore
        await ca.saveClick(false, { preventDefault: jest.fn() });
        expect(ca.save).toHaveBeenCalledTimes(1);
    });

    test("Save", async () => {
        //@ts-ignore
        jest.spyOn(ca, "writeInputValuesToObjects").mockImplementation(() => {});
        //@ts-ignore
        jest.spyOn(ca, "updateApp").mockImplementation(() => {});
        jest.spyOn(ca, "closeApp").mockImplementation(() => {});
        jest.spyOn(CalManager, "mergeClonedCalendars").mockImplementation(() => {});
        jest.spyOn(SC, "save").mockImplementation(() => {});

        //@ts-ignore
        game.user.isGM = true;

        await ca.save(false);
        //@ts-ignore
        expect(ca.writeInputValuesToObjects).toHaveBeenCalledTimes(1);
        expect(CalManager.mergeClonedCalendars).toHaveBeenCalledTimes(1);
        expect(SC.save).toHaveBeenCalledTimes(1);
        //@ts-ignore
        expect(ca.updateApp).toHaveBeenCalledTimes(1);

        //@ts-ignore
        game.user.isGM = false;

        await ca.save(true);
        //@ts-ignore
        expect(ca.writeInputValuesToObjects).toHaveBeenCalledTimes(2);
        expect(CalManager.mergeClonedCalendars).toHaveBeenCalledTimes(1);
        expect(SC.save).toHaveBeenCalledTimes(2);
        expect(ca.closeApp).toHaveBeenCalledTimes(1);
    });

    test("Export Calendar", () => {
        const fEvent = { preventDefault: jest.fn() };
        //@ts-ignore
        ca.appWindow = document.createElement("div");
        const elm = document.createElement("input");
        //@ts-ignore
        jest.spyOn(ca.appWindow, "querySelectorAll").mockReturnValue([elm]);

        elm.setAttribute("data-id", "global");
        elm.checked = true;

        //@ts-ignore
        ca.exportCalendar(fEvent);
        expect(saveAs).toHaveBeenCalledTimes(1);

        elm.setAttribute("data-id", "permissions");
        //@ts-ignore
        ca.exportCalendar(fEvent);
        expect(saveAs).toHaveBeenCalledTimes(2);

        //@ts-ignore
        jest.spyOn(game.journal, "forEach").mockImplementation((v: any) => {
            return v.call(undefined, {
                getFlag: () => {
                    return { calendarId: "a" };
                },
                toObject: () => {}
            });
        });
        elm.setAttribute("data-id", "a-notes");
        //@ts-ignore
        ca.exportCalendar(fEvent);
        expect(saveAs).toHaveBeenCalledTimes(3);

        elm.setAttribute("data-id", "a");
        //@ts-ignore
        ca.exportCalendar(fEvent);
        expect(saveAs).toHaveBeenCalledTimes(4);
    });

    test("Import Calendar File Change", () => {
        //@ts-ignore
        ca.appWindow = document.createElement("div");
        const fEvent = { target: { files: [{ type: "application/json" }] } };
        //@ts-ignore
        jest.spyOn(ca.appWindow, "querySelector").mockReturnValue(document.createElement("div"));
        const frspy = jest.spyOn(FileReader.prototype, "readAsText").mockImplementation(() => {});

        //@ts-ignore
        ca.importCalendarFileChange(fEvent);
        expect(frspy).toHaveBeenCalledTimes(1);
    });

    test("Import Calendar Progress", () => {
        const bar = document.createElement("div");
        //@ts-ignore
        ca.appWindow = document.createElement("div");
        //@ts-ignore
        jest.spyOn(ca.appWindow, "querySelector").mockReturnValue(bar);

        ca.importCalendarProgress(new Event("click"));
        expect(bar.style.width).toBe("");
    });

    test("Import Calendar Read", () => {
        //@ts-ignore
        ca.appWindow = document.createElement("div");
        const fEvent = {
            target: {
                result: {
                    toString: () => {
                        return '{"generalSettings": {"permissions": {}}, "currentDate":{"day":1,"month":1}, "leapYearSettings":{}, "monthSettings": [], "moonSettings":[{"firstNewMoon":{"month":1,"day":1}}], "noteCategories":[], "seasonSettings":[{"startingMonth":1,"startingDay":1}], "timeSettings":{"secondsInCombatRound":6}, "weekdaySettings":[], "yearSettings":{}, "notes":{"default":{}}}';
                    }
                }
            }
        };
        const fDetail = document.createElement("div");
        //@ts-ignore
        jest.spyOn(ca.appWindow, "querySelector").mockReturnValue(fDetail);
        jest.spyOn(fDetail, "querySelector").mockReturnValue(document.createElement("div"));

        tCal.id = "default";

        //@ts-ignore
        ca.importCalendarRead(fEvent);
        expect(fDetail.innerHTML).toBeDefined();

        tCal.id = "a";
        //@ts-ignore
        ca.importCalendarRead(fEvent);
        expect(fDetail.innerHTML).toBeDefined();
    });

    test("Import Calendar Save", async () => {
        //@ts-ignore
        ca.appWindow = document.createElement("div");
        const fEvent = {
            preventDefault: jest.fn()
        };
        const data = {
            globalConfig: {
                secondsInCombatRound: 6,
                calendarsSameTimestamp: false,
                syncCalendars: false,
                showNotesFolder: false
            },
            permissions: { viewCalendar: {} },
            calendars: [
                {
                    id: "a"
                }
            ],
            notes: {
                a: [
                    { flags: { "foundryvtt-simple-calendar": { noteData: { calendarId: "a" } } } },
                    { flags: { "foundryvtt-simple-calendar": { noteData: { calendarId: "a" } } } }
                ],
                b: [
                    { flags: { "foundryvtt-simple-calendar": { noteData: { calendarId: "b" } } } },
                    { flags: { "foundryvtt-simple-calendar": { noteData: { calendarId: "b" } } } }
                ]
            }
        };

        jest.spyOn(ca, "save").mockImplementation(async () => {});
        const gc = jest.spyOn(InputUtilities, "getCheckBoxInputValue").mockReturnValue(true);
        const gt = jest.spyOn(InputUtilities, "getTextInputValue").mockReturnValue("a");
        jest.spyOn(NManager, "createJournalDirectory").mockImplementation(async () => {});
        jest.spyOn(Calendar.prototype, "loadFromSettings").mockImplementation(() => {});

        //@ts-ignore
        game.journal.has = jest.fn().mockReturnValueOnce(true).mockReturnValue(false);

        //@ts-ignore
        await ca.importCalendarSave(data, fEvent);
        expect(NManager.createJournalDirectory).toHaveBeenCalledTimes(1);
        expect(tCal.loadFromSettings).toHaveBeenCalledTimes(1);

        gt.mockReturnValue("b");
        data.calendars[0].id = "a";

        //@ts-ignore
        await ca.importCalendarSave(data, fEvent);
        expect(NManager.createJournalDirectory).toHaveBeenCalledTimes(2);
        expect(tCal.loadFromSettings).toHaveBeenCalledTimes(2);

        gc.mockReturnValueOnce(false).mockReturnValueOnce(false).mockReturnValueOnce(false).mockReturnValue(true);
        data.calendars[0].id = "a";
        //@ts-ignore
        await ca.importCalendarSave(data, fEvent);
        expect(NManager.createJournalDirectory).toHaveBeenCalledTimes(3);
        expect(tCal.loadFromSettings).toHaveBeenCalledTimes(2);
    });
});
