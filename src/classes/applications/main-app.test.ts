/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import { jest, beforeEach, describe, expect, test } from "@jest/globals";
import Calendar from "../calendar";
import MainApp from "./main-app";
import {
    CalManager,
    ConfigurationApplication,
    MainApplication,
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
import NoteManager from "../notes/note-manager";
import fetchMock from "jest-fetch-mock";
import PredefinedCalendar from "../configuration/predefined-calendar";
import { CalendarClickEvents, DateTimeUnits, Icons, PredefinedCalendars } from "../../constants";
import * as PermUtilities from "../utilities/permissions";
import * as VisualUtilities from "../utilities/visual";
import * as DateUtilities from "../utilities/date-time";
import { GameSettings } from "../foundry-interfacing/game-settings";
import GameSockets from "../foundry-interfacing/game-sockets";
import ConfigurationApp from "./configuration-app";
import NoteStub from "../notes/note-stub";

fetchMock.enableMocks();
describe("Main App Class Tests", () => {
    let tCal: Calendar;
    let vCal: Calendar;
    let ma: MainApp;

    beforeEach(async () => {
        updateCalManager(new CalendarManager());
        updateSC(new SCController());
        updateMainApplication(new MainApp());
        updateNManager(new NoteManager());
        updateConfigurationApplication(new ConfigurationApp());

        tCal = new Calendar("a", "");
        vCal = new Calendar("b", "");

        jest.spyOn(CalManager, "getActiveCalendar").mockImplementation(() => {
            return tCal;
        });
        jest.spyOn(CalManager, "getVisibleCalendar").mockImplementation(() => {
            return tCal;
        });
        jest.spyOn(CalManager, "getAllCalendars").mockImplementation(() => {
            return [tCal];
        });

        fetchMock.resetMocks();
        fetchMock.mockOnce(
            `{"calendar":{"currentDate":{"year":2022,"month":2,"day":28,"seconds":0},"general":{"gameWorldTimeIntegration":"mixed","showClock":true,"noteDefaultVisibility":false,"postNoteRemindersOnFoundryLoad":true,"pf2eSync":true,"dateFormat":{"date":"MMMM DD, YYYY","time":"HH:mm:ss","monthYear":"MMMM YAYYYYYZ"}},"leapYear":{"rule":"gregorian","customMod":0},"months":[{"name":"January","abbreviation":"Jan","numericRepresentation":1,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"February","abbreviation":"Feb","numericRepresentation":2,"numericRepresentationOffset":0,"numberOfDays":28,"numberOfLeapYearDays":29,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"March","abbreviation":"Mar","numericRepresentation":3,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"April","abbreviation":"Apr","numericRepresentation":4,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"May","abbreviation":"May","numericRepresentation":5,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"June","abbreviation":"Jun","numericRepresentation":6,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"July","abbreviation":"Jul","numericRepresentation":7,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"August","abbreviation":"Aug","numericRepresentation":8,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"September","abbreviation":"Sep","numericRepresentation":9,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"October","abbreviation":"Oct","numericRepresentation":10,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"November","abbreviation":"Nov","numericRepresentation":11,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"December","abbreviation":"Dec","numericRepresentation":12,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null}],"moons":[{"name":"Moon","cycleLength":29.53059,"firstNewMoon":{"yearReset":"none","yearX":0,"year":2000,"month":1,"day":5},"phases":[{"name":"New Moon","length":1,"icon":"new","singleDay":true},{"name":"Waxing Crescent","length":6.38265,"icon":"waxing-crescent","singleDay":false},{"name":"First Quarter","length":1,"icon":"first-quarter","singleDay":true},{"name":"Waxing Gibbous","length":6.38265,"icon":"waxing-gibbous","singleDay":false},{"name":"Full Moon","length":1,"icon":"full","singleDay":true},{"name":"Waning Gibbous","length":6.38265,"icon":"waning-gibbous","singleDay":false},{"name":"Last Quarter","length":1,"icon":"last-quarter","singleDay":true},{"name":"Waning Crescent","length":6.38265,"icon":"waning-crescent","singleDay":false}],"color":"#ffffff","cycleDayAdjust":0.5}],"noteCategories":[{"name":"Holiday","textColor":"#FFFFFF","color":"#148e94"}],"seasons":[{"name":"Spring","startingMonth":2,"startingDay":19,"color":"#46b946","icon":"spring","sunriseTime":21600,"sunsetTime":64800},{"name":"Summer","startingMonth":5,"startingDay":19,"color":"#e0c40b","icon":"summer","sunriseTime":21600,"sunsetTime":64800},{"name":"Fall","startingMonth":8,"startingDay":21,"color":"#ff8e47","icon":"fall","sunriseTime":21600,"sunsetTime":64800},{"name":"Winter","startingMonth":11,"startingDay":20,"color":"#479dff","icon":"winter","sunriseTime":21600,"sunsetTime":64800}],"time":{"hoursInDay":24,"minutesInHour":60,"secondsInMinute":60,"gameTimeRatio":1,"unifyGameAndClockPause":false,"updateFrequency":1},"weekdays":[{"abbreviation":"Su","name":"Sunday","numericRepresentation":1},{"abbreviation":"Mo","name":"Monday","numericRepresentation":2},{"abbreviation":"Tu","name":"Tuesday","numericRepresentation":3},{"abbreviation":"We","name":"Wednesday","numericRepresentation":4},{"abbreviation":"Th","name":"Thursday","numericRepresentation":5},{"abbreviation":"Fr","name":"Friday","numericRepresentation":6},{"abbreviation":"Sa","name":"Saturday","numericRepresentation":7}],"year":{"numericRepresentation":2022,"prefix":"","postfix":"","showWeekdayHeadings":true,"firstWeekday":4,"yearZero":1970,"yearNames":[],"yearNamingRule":"default","yearNamesStart":0}}}`
        );
        await PredefinedCalendar.setToPredefined(tCal, PredefinedCalendars.Gregorian);

        ma = new MainApp();

        //@ts-ignore
        game.user.isGM = false;
        SC.primary = false;
    });

    test("Active Calendar", () => {
        //@ts-ignore
        expect(ma.activeCalendar).toEqual(tCal);
    });

    test("Visible Calendar", () => {
        //@ts-ignore
        expect(ma.visibleCalendar).toEqual(tCal);
    });

    test("Default Options", () => {
        expect(MainApp.defaultOptions).toBeDefined();
    });

    test("Initialize", () => {
        jest.spyOn(GameSettings, "GetBooleanSettings").mockReturnValue(true);
        ma.initialize();
        expect(ma.uiElementStates["fsc-note-list"]).toBe(true);
    });

    test("Get Data", () => {
        expect(ma.getData()).toBeDefined();

        tCal.months[0].selected = true;
        tCal.months[0].days[0].selected = true;
        expect(ma.getData()).toBeDefined();

        tCal.generalSettings.showClock = false;
        expect(ma.getData()).toBeDefined();

        jest.spyOn(PermUtilities, "canUser").mockReturnValue(true);
        jest.spyOn(CalManager, "getActiveCalendar").mockImplementation(() => {
            return vCal;
        });
        ma.uiElementStates.compactView = true;
        expect(ma.getData()).toBeDefined();

        jest.spyOn(tCal, "getCurrentSeason").mockReturnValue({ name: "Summer", icon: Icons.None, color: "red" });
        ma.uiElementStates.compactView = true;
        expect(ma.getData()).toBeDefined();

        ma.uiElementStates.compactView = false;
        ma.addonButtons.push({
            title: "title",
            iconClass: "icon",
            customClass: "class",
            showSidePanel: true,
            onRender: () => {}
        });
        expect(ma.getData()).toBeDefined();

        ma.uiElementStates["fsc-addon-button-side-drawer-0"] = true;
        expect(ma.getData()).toBeDefined();
    });

    test("Render", () => {
        ma.render();

        jest.spyOn(PermUtilities, "canUser").mockReturnValue(true);
        jest.spyOn(GameSettings, "GetBooleanSettings").mockReturnValue(true);
        jest.spyOn(GameSettings, "GetObjectSettings").mockReturnValue({ top: 1, left: 1 });
        SC.clientSettings.persistentOpen = true;
        ma.render();

        SC.clientSettings.persistentOpen = false;
        ma.render();
    });

    test("Scene Control Button Click", () => {
        jest.spyOn(ma, "render").mockImplementation(() => {});

        ma.sceneControlButtonClick();
        expect(ma.render).toHaveBeenCalledTimes(1);

        SC.clientSettings.persistentOpen = true;
        ma.sceneControlButtonClick();
        expect(ma.render).toHaveBeenCalledTimes(1);

        //@ts-ignore
        jest.spyOn(ma, "rendered", "get").mockReturnValue(false);
        ma.sceneControlButtonClick();
        expect(ma.render).toHaveBeenCalledTimes(2);
    });

    test("close", () => {
        ma.close();
        expect(ma.opening).toBe(true);
        SC.clientSettings.persistentOpen = true;
        ma.close();

        //@ts-ignore
        game.user.isGM = true;
        ma.close();

        ui.windows = {
            //@ts-ignore
            1: { id: "fsc-simple-calendar-application", close: jest.fn() },
            //@ts-ignore
            2: { id: "", close: jest.fn() }
        };
        ma.close();
        expect(ui.windows[2].close).toHaveBeenCalledTimes(1);

        ui.windows = {};
    });

    test("Toggle Compact View", () => {
        const event = new Event("click");
        ma.toggleCompactView(event);
        expect(ma.uiElementStates.compactView).toBe(true);
        ma.toggleCompactView(event);
        expect(ma.uiElementStates.compactView).toBe(false);
    });

    test("_ Activate Header Buttons", () => {
        const button = document.createElement("a");
        const jquery = [
            {
                querySelectorAll: jest.fn().mockReturnValue([button])
            }
        ];
        //@ts-ignore
        ma._activateHeaderButtons(jquery, { headerButtons: ["test"] });
        expect(jquery[0].querySelectorAll).toHaveBeenCalledTimes(1);
        //@ts-ignore
        button.click();
    });

    test("_ Render Outer", async () => {
        const header = document.createElement("div");
        const jquery = {
            find: () => {
                return [header];
            },
            css: jest.fn()
        };
        //@ts-ignore
        global.$ = jest.fn().mockReturnValue(jquery);
        //@ts-ignore
        global.renderTemplate = jest.fn().mockReturnValue(null);

        ma.options["classes"] = [];
        //@ts-ignore
        ma.position = { zIndex: 1 };
        //@ts-ignore
        await ma._renderOuter();
        //@ts-ignore
        expect(global.$).toHaveBeenCalledTimes(1);
        expect(global.renderTemplate).toHaveBeenCalledTimes(1);
        expect(jquery.css).toHaveBeenCalledTimes(1);

        //@ts-ignore
        game.release.generation = 10;
        ma.options["minimizable"] = true;
        //@ts-ignore
        await ma._renderOuter();
        //@ts-ignore
        game.release.generation = 11;
    });

    test("Set Width Height", () => {
        const mainApp = document.createElement("div");
        const header = document.createElement("div");
        const windowContent = document.createElement("div");
        const wrapper = document.createElement("div");
        const calendarSections = document.createElement("div");
        const clockSections = document.createElement("div");
        const yearView = document.createElement("div");
        const calendarHeader = document.createElement("div");
        const calendarHeaderCurDate = document.createElement("div");
        const calendarHeaderCurDateChild = document.createElement("div");
        const calendarDays = document.createElement("div");
        const calendarWeek = document.createElement("div");
        const clock = document.createElement("div");
        const clockChild = document.createElement("div");

        header.classList.add("window-header");
        windowContent.classList.add("window-content");
        wrapper.classList.add("fsc-main-wrapper");
        calendarSections.classList.add("fsc-section", "fsc-calendar");
        clockSections.classList.add("fsc-section", "fsc-clock-display");
        yearView.classList.add("fsc-year-view");
        calendarHeader.classList.add("fsc-calendar-header");
        calendarHeaderCurDate.classList.add("fsc-current-date");
        calendarDays.classList.add("fsc-days");
        calendarWeek.classList.add("fsc-week");
        clock.classList.add("fsc-clock");

        mainApp.append(header, windowContent);
        windowContent.append(wrapper);
        wrapper.append(calendarSections, clockSections, yearView);
        calendarSections.append(calendarHeader, calendarDays);
        calendarHeader.append(calendarHeaderCurDate);
        calendarHeaderCurDate.append(calendarHeaderCurDateChild);
        calendarDays.append(calendarWeek);
        clockSections.append(clock);
        clock.append(clockChild);

        mainApp.style.borderWidth = "5px";

        jest.spyOn(document, "querySelector").mockReturnValue(mainApp);

        //@ts-ignore
        jest.spyOn(ma, "setPosition").mockImplementation(() => {});

        MainApp.setWidthHeight(ma);
        //@ts-ignore
        expect(ma.setPosition).toHaveBeenCalledTimes(1);

        jest.spyOn(calendarWeek, "offsetWidth", "get").mockReturnValue(300);
        MainApp.setWidthHeight(ma);
        //@ts-ignore
        expect(ma.setPosition).toHaveBeenCalledTimes(2);

        calendarSections.removeChild(calendarDays);
        jest.spyOn(GameSettings, "GetBooleanSettings").mockReturnValue(true);
        jest.spyOn(GameSettings, "GetObjectSettings").mockReturnValue({ top: 1, left: 1 });

        MainApp.setWidthHeight(ma);
        //@ts-ignore
        expect(ma.setPosition).toHaveBeenCalledTimes(4);

        ma.uiElementStates.compactView = true;
        const date = document.createElement("div");
        const dateText = document.createElement("div");
        const unitControls = document.createElement("div");
        const controlGroup = document.createElement("div");

        date.classList.add("fsc-date");
        dateText.classList.add("fsc-date-text");
        unitControls.classList.add("fsc-unit-controls");
        controlGroup.classList.add("fsc-control-group");

        date.append(dateText);
        unitControls.append(controlGroup);

        wrapper.append(date, unitControls);

        MainApp.setWidthHeight(ma);
        //@ts-ignore
        expect(ma.setPosition).toHaveBeenCalledTimes(6);
    });

    test("Ensure Current Date Is Visible", () => {
        const mainApp = document.createElement("div");
        const currentDay = document.createElement("div");
        const selectedDay = document.createElement("div");
        jest.spyOn(document, "querySelector").mockReturnValue(mainApp);
        jest.spyOn(mainApp, "querySelector").mockReturnValueOnce(currentDay);
        jest.spyOn(mainApp, "offsetHeight", "get").mockReturnValue(600);
        jest.spyOn(mainApp, "getBoundingClientRect").mockReturnValue({
            top: 50,
            left: 50,
            bottom: 650,
            right: 250,
            height: 600,
            width: 200,
            x: 50,
            y: 50,
            toJSON: () => {
                return "";
            }
        });
        jest.spyOn(currentDay, "getBoundingClientRect").mockReturnValue({
            top: 50,
            left: 50,
            bottom: 650,
            right: 350,
            height: 600,
            width: 300,
            x: 50,
            y: 50,
            toJSON: () => {
                return "";
            }
        });
        jest.spyOn(selectedDay, "getBoundingClientRect").mockReturnValue({
            top: 50,
            left: 50,
            bottom: 650,
            right: 250,
            height: 600,
            width: 200,
            x: 50,
            y: 50,
            toJSON: () => {
                return "";
            }
        });

        ma.ensureCurrentDateIsVisible(); //Current day
        expect(mainApp.scrollTop).toBe(-300);

        mainApp.scrollTop = 0;
        jest.spyOn(mainApp, "querySelector").mockReturnValueOnce(currentDay).mockReturnValueOnce(selectedDay);
        ma.ensureCurrentDateIsVisible(); //Selected day
        expect(mainApp.scrollTop).toBe(0);
    });

    test("App Drag Move", () => {
        ma.appDragMove(new Event("drag"));
        //@ts-ignore
        game.release.generation = 10;
        ma.appDragMove(new Event("drag"));
        //@ts-ignore
        game.release.generation = 11;
    });

    test("App Drag End", () => {
        const mainApp = document.createElement("div");
        jest.spyOn(document, "getElementById").mockReturnValue(mainApp);
        jest.spyOn(GameSettings, "SaveObjectSetting").mockImplementation(async () => {
            return true;
        });
        ma.appDragEnd(new Event("drag"));
        expect(GameSettings.SaveObjectSetting).toHaveBeenCalledTimes(1);

        mainApp.classList.add("fsc-compact-view");
        ma.appDragEnd(new Event("drag"));
        expect(GameSettings.SaveObjectSetting).toHaveBeenCalledTimes(2);
    });

    test("Activate Listeners", () => {
        const mainApp = document.createElement("div");
        const elm = document.createElement("div");
        jest.spyOn(document, "getElementById").mockReturnValue(mainApp);
        jest.spyOn(mainApp, "querySelector").mockReturnValue(elm);
        //@ts-ignore
        jest.spyOn(mainApp, "querySelectorAll").mockReturnValue([elm]);
        jest.spyOn(MainApp, "setWidthHeight").mockImplementation(() => {});
        jest.spyOn(ma, "ensureCurrentDateIsVisible").mockImplementation(() => {});

        ma.activateListeners();
        expect(mainApp.classList.contains("fsc-compact-view")).toBe(false);

        ma.uiElementStates.compactView = true;
        ma.activateListeners();
        expect(mainApp.classList.contains("fsc-compact-view")).toBe(true);

        //@ts-ignore
        game.release.generation = 10;
        ma.activateListeners();
        expect(mainApp.classList.contains("fsc-compact-view")).toBe(true);
        //@ts-ignore
        game.release.generation = 11;
    });

    test("Addon Button Click", () => {
        const button = document.createElement("button");
        button.setAttribute("data-sc-abi", "0");

        MainApplication.addonButtons.push({
            title: "title",
            iconClass: "icon",
            customClass: "class",
            showSidePanel: false,
            onRender: jest.fn().mockImplementationOnce(() => {
                throw "no";
            })
        });
        jest.spyOn(console, "error").mockImplementation(() => {});

        const fEvent = { target: button };

        //@ts-ignore
        MainApplication.addonButtonClick(fEvent);
        expect(MainApplication.addonButtons[0].onRender).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledTimes(1);

        //@ts-ignore
        MainApplication.addonButtonClick(fEvent);
        expect(MainApplication.addonButtons[0].onRender).toHaveBeenCalledTimes(2);
        expect(console.error).toHaveBeenCalledTimes(1);

        MainApplication.addonButtons[0].showSidePanel = true;
        jest.spyOn(MainApplication, "toggleDrawer").mockImplementation(() => {});
        //@ts-ignore
        MainApplication.addonButtonClick(fEvent);
        expect(MainApplication.toggleDrawer).toHaveBeenCalledTimes(1);
    });

    test("Addon Button Side Panel Content Render", () => {
        const mainApp = document.createElement("div");
        const sideDrawer = document.createElement("div");

        sideDrawer.classList.add("fsc-addon-button-side-drawer");
        sideDrawer.setAttribute("data-sc-abi", "0");

        mainApp.append(sideDrawer);

        MainApplication.addonButtons.push({
            title: "title",
            iconClass: "icon",
            customClass: "class",
            showSidePanel: true,
            onRender: jest.fn().mockImplementationOnce(() => {
                throw "no";
            })
        });
        jest.spyOn(console, "error").mockImplementation(() => {});

        MainApplication.addonButtonSidePanelContentRender(mainApp);
        expect(MainApplication.addonButtons[0].onRender).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledTimes(1);

        MainApplication.addonButtonSidePanelContentRender(mainApp);
        expect(MainApplication.addonButtons[0].onRender).toHaveBeenCalledTimes(2);
    });

    test("Toggle Drawers", () => {
        const elm = document.createElement("div");
        jest.spyOn(ma, "hideDrawers").mockImplementation(() => {});
        jest.spyOn(ma, "searchOptionsToggle").mockImplementation(() => {});
        jest.spyOn(VisualUtilities, "animateElement").mockReturnValueOnce(true).mockReturnValueOnce(false).mockReturnValueOnce(true);
        jest.spyOn(document, "querySelector").mockReturnValue(elm);

        ma.toggleDrawer("fsc-calendar-list");
        expect(ma.uiElementStates["fsc-calendar-list"]).toBe(true);

        jest.spyOn(GameSettings, "GetBooleanSettings").mockReturnValue(true);
        ma.toggleDrawer("fsc-calendar-list");
        expect(ma.uiElementStates["fsc-calendar-list"]).toBe(false);

        ma.uiElementStates["fsc-note-list"] = false;
        ma.toggleDrawer("fsc-note-list");
        expect(ma.uiElementStates["fsc-note-list"]).toBe(true);
    });

    test("Hide Drawers", () => {
        const clElm = document.createElement("div");
        const nlElm = document.createElement("div");
        const nsElm = document.createElement("div");
        const abElm = document.createElement("div");
        //@ts-ignore
        jest.spyOn(document, "querySelectorAll").mockReturnValue([clElm, nlElm, nsElm, abElm]);
        clElm.classList.add("fsc-side-drawer", "fsc-calendar-list");
        nlElm.classList.add("fsc-side-drawer", "fsc-note-list");
        nsElm.classList.add("fsc-side-drawer", "fsc-note-search");
        abElm.classList.add("fsc-side-drawer", "fsc-addon-button-side-drawer-0");
        ma.uiElementStates["fsc-calendar-list"] = true;
        ma.uiElementStates["fsc-note-list"] = true;
        ma.uiElementStates["fsc-note-search"] = true;

        ma.hideDrawers(["fsc-note-search"]);
        expect(ma.uiElementStates["fsc-calendar-list"]).toBe(false);
        expect(ma.uiElementStates["fsc-note-list"]).toBe(false);
        expect(ma.uiElementStates["fsc-note-search"]).toBe(true);

        ma.uiElementStates["fsc-calendar-list"] = true;
        ma.uiElementStates["fsc-note-list"] = true;
        ma.uiElementStates["fsc-note-search"] = true;
        ma.hideDrawers();
        expect(ma.uiElementStates["fsc-calendar-list"]).toBe(false);
        expect(ma.uiElementStates["fsc-note-list"]).toBe(false);
        expect(ma.uiElementStates["fsc-note-search"]).toBe(false);

        ma.addonButtons.push({
            title: "Test",
            iconClass: "",
            customClass: "",
            showSidePanel: true,
            onRender: () => {}
        });
        ma.uiElementStates["fsc-addon-button-side-drawer-0"] = true;
        ma.hideDrawers();
        expect(ma.uiElementStates["fsc-addon-button-side-drawer-0"]).toBe(false);
    });

    test("Toggle Unit Selector", () => {
        const elm = document.createElement("div");
        jest.spyOn(document, "querySelector").mockReturnValue(elm);
        jest.spyOn(VisualUtilities, "animateElement").mockImplementation(() => {
            return true;
        });
        ma.toggleUnitSelector();
        expect(ma.uiElementStates.dateTimeUnitOpen).toBe(true);

        ma.uiElementStates.compactView = true;
        ma.toggleUnitSelector();
        expect(ma.uiElementStates.dateTimeUnitOpen).toBe(true);

        jest.spyOn(elm, "getBoundingClientRect").mockReturnValue({
            top: 5000,
            bottom: 0,
            left: 0,
            right: 0,
            x: 0,
            y: 0,
            height: 100,
            width: 100,
            toJSON: () => {}
        });
        ma.toggleUnitSelector();
        expect(ma.uiElementStates.dateTimeUnitOpen).toBe(true);
    });

    test("Change Unit", () => {
        const target = document.createElement("div");
        target.setAttribute("data-unit", "year");

        const fEvent = { currentTarget: target };
        jest.spyOn(ma, "updateApp").mockImplementation(() => {});

        //@ts-ignore
        ma.changeUnit(fEvent);
        expect(ma.uiElementStates.dateTimeUnit).toBe(DateTimeUnits.Year);
        expect(ma.updateApp).toHaveBeenCalledTimes(1);

        target.setAttribute("data-unit", "month");
        //@ts-ignore
        ma.changeUnit(fEvent);
        expect(ma.uiElementStates.dateTimeUnit).toBe(DateTimeUnits.Month);
        expect(ma.updateApp).toHaveBeenCalledTimes(2);

        target.setAttribute("data-unit", "day");
        //@ts-ignore
        ma.changeUnit(fEvent);
        expect(ma.uiElementStates.dateTimeUnit).toBe(DateTimeUnits.Day);
        expect(ma.updateApp).toHaveBeenCalledTimes(3);

        target.setAttribute("data-unit", "hour");
        //@ts-ignore
        ma.changeUnit(fEvent);
        expect(ma.uiElementStates.dateTimeUnit).toBe(DateTimeUnits.Hour);
        expect(ma.updateApp).toHaveBeenCalledTimes(4);

        target.setAttribute("data-unit", "minute");
        //@ts-ignore
        ma.changeUnit(fEvent);
        expect(ma.uiElementStates.dateTimeUnit).toBe(DateTimeUnits.Minute);
        expect(ma.updateApp).toHaveBeenCalledTimes(5);

        target.setAttribute("data-unit", "round");
        //@ts-ignore
        ma.changeUnit(fEvent);
        expect(ma.uiElementStates.dateTimeUnit).toBe(DateTimeUnits.Round);
        expect(ma.updateApp).toHaveBeenCalledTimes(6);

        target.setAttribute("data-unit", "seconds");
        //@ts-ignore
        ma.changeUnit(fEvent);
        expect(ma.uiElementStates.dateTimeUnit).toBe(DateTimeUnits.Second);
        expect(ma.updateApp).toHaveBeenCalledTimes(7);
    });

    test("Change Calendar", () => {
        const target = document.createElement("div");
        const wrapper = document.createElement("div");
        const fEvent = {
            currentTarget: target
        };

        wrapper.setAttribute("data-calid", "123");

        jest.spyOn(GameSettings, "UiNotification").mockImplementation(() => {});
        jest.spyOn(GameSockets, "emit").mockImplementation(async () => {
            return true;
        });
        jest.spyOn(target, "closest").mockReturnValue(wrapper);
        jest.spyOn(CalManager, "setActiveCalendar").mockImplementation(() => {});
        jest.spyOn(CalManager, "setVisibleCalendar").mockImplementation(() => {});

        //@ts-ignore
        game.user.isGM = true;
        //@ts-ignore
        ma.changeCalendar(false, fEvent);
        expect(CalManager.setActiveCalendar).toHaveBeenCalledTimes(0);
        expect(GameSettings.UiNotification).toHaveBeenCalledTimes(1);

        //@ts-ignore
        jest.spyOn(game.users, "find").mockImplementation((v: any) => {
            return v.call(undefined, { isGM: true, active: true });
        });
        //@ts-ignore
        ma.changeCalendar(false, fEvent);
        expect(GameSockets.emit).toHaveBeenCalledTimes(1);

        SC.primary = true;
        //@ts-ignore
        ma.changeCalendar(false, fEvent);
        expect(CalManager.setActiveCalendar).toHaveBeenCalledTimes(1);

        //@ts-ignore
        ma.changeCalendar(true, fEvent);
        expect(CalManager.setVisibleCalendar).toHaveBeenCalledTimes(1);
    });

    test("Change Month", () => {
        jest.spyOn(ma, "toggleUnitSelector").mockImplementation(() => {});
        jest.spyOn(MainApp, "setWidthHeight").mockImplementation(() => {});
        jest.spyOn(tCal, "changeMonth").mockImplementation(() => {});

        ma.changeMonth(CalendarClickEvents.next);
        expect(ma.toggleUnitSelector).toHaveBeenCalledTimes(1);
        expect(MainApp.setWidthHeight).toHaveBeenCalledTimes(1);
        expect(tCal.changeMonth).toHaveBeenCalledTimes(1);

        ma.changeMonth(CalendarClickEvents.previous);
        expect(ma.toggleUnitSelector).toHaveBeenCalledTimes(2);
        expect(MainApp.setWidthHeight).toHaveBeenCalledTimes(2);
        expect(tCal.changeMonth).toHaveBeenCalledTimes(2);
    });

    test("Day Click", () => {
        jest.spyOn(ma, "toggleUnitSelector").mockImplementation(() => {});
        jest.spyOn(ma, "updateApp").mockImplementation(() => {});

        tCal.months[0].selected = true;
        tCal.months[0].days[0].selected = true;

        ma.dayClick({
            id: "",
            selectedDates: {
                start: {
                    day: 0,
                    month: 0,
                    year: 2000
                },
                end: {
                    day: 0,
                    month: 0,
                    year: 2000
                }
            }
        });
        expect(ma.updateApp).toHaveBeenCalledTimes(1);
    });

    test("Today Click", () => {
        jest.spyOn(ma, "updateApp").mockImplementation(() => {});
        ma.todayClick();
        expect(ma.updateApp).toHaveBeenCalledTimes(1);
    });

    test("Time Unit Click", () => {
        const target = document.createElement("div");
        const fEvent = {
            currentTarget: target,
            stopPropagation: jest.fn()
        };

        jest.spyOn(GameSettings, "UiNotification").mockImplementation(() => {});
        jest.spyOn(GameSockets, "emit").mockImplementation(async () => {
            return true;
        });
        jest.spyOn(tCal, "changeDateTime").mockImplementation(() => {
            return true;
        });
        jest.spyOn(DateUtilities, "AdvanceTimeToPreset").mockImplementation(async () => {});

        target.setAttribute("data-type", "round");
        target.setAttribute("data-amount", "1");

        //@ts-ignore
        game.user.isGM = true;

        //@ts-ignore
        ma.timeUnitClick(fEvent);
        expect(GameSettings.UiNotification).toHaveBeenCalledTimes(1);

        //@ts-ignore
        jest.spyOn(game.users, "find").mockImplementation((v: any) => {
            return v.call(undefined, { isGM: true, active: true });
        });
        target.setAttribute("data-type", "year");
        //@ts-ignore
        ma.timeUnitClick(fEvent);
        expect(GameSettings.UiNotification).toHaveBeenCalledTimes(1);
        expect(GameSockets.emit).toHaveBeenCalledTimes(1);

        target.setAttribute("data-type", "midnight");
        target.setAttribute("data-amount", "");
        //@ts-ignore
        ma.timeUnitClick(fEvent);
        expect(GameSettings.UiNotification).toHaveBeenCalledTimes(1);
        expect(GameSockets.emit).toHaveBeenCalledTimes(2);

        //@ts-ignore
        jest.spyOn(game.users, "find").mockImplementation((v: any) => {
            return v.call(undefined, { isGM: false, active: true });
        });
        //@ts-ignore
        ma.timeUnitClick(fEvent);
        expect(GameSettings.UiNotification).toHaveBeenCalledTimes(2);
        expect(GameSockets.emit).toHaveBeenCalledTimes(2);

        target.setAttribute("data-type", "year");
        target.setAttribute("data-amount", "1");
        SC.primary = true;
        //@ts-ignore
        ma.timeUnitClick(fEvent);
        expect(GameSettings.UiNotification).toHaveBeenCalledTimes(2);
        expect(GameSockets.emit).toHaveBeenCalledTimes(2);
        expect(tCal.changeDateTime).toHaveBeenCalledTimes(1);

        target.setAttribute("data-type", "midnight");
        target.setAttribute("data-amount", "");
        //@ts-ignore
        ma.timeUnitClick(fEvent);
        expect(GameSettings.UiNotification).toHaveBeenCalledTimes(2);
        expect(GameSockets.emit).toHaveBeenCalledTimes(2);
        expect(tCal.changeDateTime).toHaveBeenCalledTimes(1);
        expect(DateUtilities.AdvanceTimeToPreset).toHaveBeenCalledTimes(1);
    });

    test("Date Control Apply", () => {
        jest.spyOn(GameSettings, "UiNotification").mockImplementation(() => {});
        ma.dateControlApply();
        expect(GameSettings.UiNotification).toHaveBeenCalledTimes(1);

        const d = new Date();
        jest.spyOn(PermUtilities, "canUser").mockReturnValue(true);
        jest.spyOn(ma, "setCurrentDate").mockImplementation(() => {});
        tCal.months[d.getMonth()].selected = true;
        tCal.months[d.getMonth()].days[0].selected = true;
        ma.dateControlApply();
        expect(ma.setCurrentDate).toHaveBeenCalledTimes(1);

        tCal.resetMonths("selected");
        tCal.year.selectedYear = d.getFullYear() + 1;
        tCal.months[0].selected = true;
        tCal.months[0].days[0].selected = true;
        ma.dateControlApply();
        //@ts-ignore
        expect(global.DialogRenderer).toHaveBeenCalledTimes(1);

        tCal.resetMonths("visible");
        tCal.year.visibleYear = tCal.year.selectedYear;
        tCal.months[0].visible = true;
        ma.dateControlApply();
        expect(ma.setCurrentDate).toHaveBeenCalledTimes(2);
    });

    test("Set Current Date", () => {
        jest.spyOn(GameSettings, "UiNotification").mockImplementation(() => {});
        jest.spyOn(GameSockets, "emit").mockImplementation(async () => {
            return true;
        });
        jest.spyOn(tCal, "setDateTime").mockImplementation(() => {
            return true;
        });

        ma.setCurrentDate(0, 0, 0);
        expect(GameSettings.UiNotification).toHaveBeenCalledTimes(1);

        //@ts-ignore
        jest.spyOn(game.users, "find").mockImplementation((v: any) => {
            return v.call(undefined, { isGM: true, active: true });
        });
        ma.setCurrentDate(0, 0, 0);
        expect(GameSockets.emit).toHaveBeenCalledTimes(1);

        //@ts-ignore
        game.user.isGM = true;
        SC.primary = true;
        ma.setCurrentDate(0, 0, 0);
        expect(tCal.setDateTime).toHaveBeenCalledTimes(1);
    });

    test("Search Click", () => {
        const sb = document.createElement("input");
        sb.value = "test";
        jest.spyOn(document, "getElementById").mockReturnValue(sb);
        jest.spyOn(NManager, "searchNotes").mockImplementation(() => {
            return [];
        });
        jest.spyOn(ma, "updateApp").mockImplementation(() => {});

        ma.searchClick();
        expect(ma.search.term).toBe("test");
        expect(NManager.searchNotes).toHaveBeenCalledTimes(1);
        expect(ma.updateApp).toHaveBeenCalledTimes(1);
    });

    test("Search Clear Click", () => {
        ma.search.term = "test";
        jest.spyOn(ma, "updateApp").mockImplementation(() => {});

        ma.searchClearClick();
        expect(ma.search.term).toBe("");
        expect(ma.updateApp).toHaveBeenCalledTimes(1);
    });

    test("Search Box Change", () => {
        const sb = document.createElement("input");
        sb.value = "test";
        const fEvent = { target: sb, key: "" };
        jest.spyOn(ma, "searchClick").mockImplementation(() => {});

        //@ts-ignore
        ma.searchBoxChange(fEvent);
        expect(ma.search.term).toBe("test");
        expect(ma.searchClick).toHaveBeenCalledTimes(0);

        fEvent.key = "Enter";
        //@ts-ignore
        ma.searchBoxChange(fEvent);
        expect(ma.search.term).toBe("test");
        expect(ma.searchClick).toHaveBeenCalledTimes(1);
    });

    test("Search Option Toggle", () => {
        const elm = document.createElement("div");

        jest.spyOn(document, "querySelector").mockReturnValue(elm);
        jest.spyOn(VisualUtilities, "animateElement").mockImplementation(() => {
            return true;
        });

        ma.searchOptionsToggle();
        expect(ma.uiElementStates.searchOptionsOpen).toBe(true);
    });

    test("Search Option Fields Change", () => {
        const target = document.createElement("input");
        const fEvent = { target: target };

        target.setAttribute("data-field", "author");
        target.checked = true;

        //@ts-ignore
        ma.searchOptionsFieldsChange(fEvent);
        expect(ma.search.options.fields.author).toBe(true);
    });

    test("Configuration Click", () => {
        jest.spyOn(ConfigurationApplication, "initializeAndShowDialog").mockImplementation(async () => {});
        ma.configurationClick();
        expect(ConfigurationApplication.initializeAndShowDialog).toHaveBeenCalledTimes(1);
    });

    test("Add Note", () => {
        jest.spyOn(NManager, "addNewNote").mockImplementation(async () => {});
        const fEvent = { stopPropagation: jest.fn() };
        //@ts-ignore
        ma.addNote(fEvent);
        expect(NManager.addNewNote).toHaveBeenCalledTimes(1);
    });

    test("View Note", () => {
        jest.spyOn(NManager, "showNote").mockImplementation(() => {});
        jest.spyOn(console, "error").mockImplementation(() => {});
        const target = document.createElement("div");
        const fEvent = { stopPropagation: jest.fn(), currentTarget: target };

        //@ts-ignore
        ma.viewNote(fEvent);
        expect(console.error).toHaveBeenCalledTimes(1);

        target.setAttribute("data-index", "123");
        //@ts-ignore
        ma.viewNote(fEvent);
        expect(NManager.showNote).toHaveBeenCalledTimes(1);
    });

    test("Note Context", () => {
        const appWindow = document.createElement("div");
        const section = document.createElement("div");
        const contextMenu = document.createElement("div");
        const note = document.createElement("div");
        const editAction = document.createElement("div");
        const contextList = document.createElement("div");
        const visibleAction = document.createElement("div");

        note.classList.add("fsc-note");
        section.classList.add("fsc-section");
        contextMenu.classList.add("fsc-context-menu");
        contextList.classList.add("fsc-day-context-list");
        visibleAction.classList.add("fsc-context-list-action");

        appWindow.id = MainApp.appWindowId;
        note.setAttribute("data-index", "asd");
        editAction.setAttribute("data-action", "edit");
        visibleAction.setAttribute("data-action", "remind");

        contextList.append(visibleAction);
        contextList.append(editAction);
        contextMenu.append(contextList);
        section.append(contextMenu);
        section.append(note);
        appWindow.append(section);
        document.body.append(appWindow);

        const noteStub = new NoteStub("asd");
        jest.spyOn(NManager, "getNoteStub").mockReturnValue(noteStub);
        jest.spyOn(noteStub, "userReminderRegistered", "get").mockReturnValueOnce(true).mockReturnValueOnce(true).mockReturnValue(false);
        jest.spyOn(noteStub, "canEdit", "get").mockReturnValueOnce(true).mockReturnValue(false);

        const fEvent = {
            target: note
        };

        //@ts-ignore
        ma.noteContext(fEvent);
        expect(contextMenu.getAttribute("data-id")).toBe("asd");

        //@ts-ignore
        ma.noteContext(fEvent);
        expect(contextMenu.getAttribute("data-id")).toBe("asd");
    });

    test("Note Context Click", () => {
        const contextMenu = document.createElement("div");
        const action = document.createElement("div");

        contextMenu.classList.add("fsc-context-menu");
        action.classList.add("fsc-context-list-action");

        contextMenu.setAttribute("data-id", "asd");
        action.setAttribute("data-action", "showPlayers");

        contextMenu.append(action);

        jest.spyOn(console, "error").mockImplementation(() => {});
        //@ts-ignore
        jest.spyOn(Journal, "showDialog").mockImplementation(async () => {});

        const fEvent = {
            target: action
        };
        //@ts-ignore
        ma.noteContextClick(fEvent);
        //@ts-ignore
        expect(Journal.showDialog).toHaveBeenCalledTimes(1);

        //@ts-ignore
        jest.spyOn(Journal, "showDialog").mockRejectedValue("E");
        //@ts-ignore
        ma.noteContextClick(fEvent);
        //@ts-ignore
        expect(Journal.showDialog).toHaveBeenCalledTimes(2);

        const je = {
            sheet: {
                delete: jest.fn(),
                render: jest.fn(),
                reminderChange: jest.fn(async () => {})
            }
        };
        //@ts-ignore
        jest.spyOn(game.journal, "get").mockReturnValue(je);

        action.setAttribute("data-action", "delete");
        //@ts-ignore
        ma.noteContextClick(fEvent);
        expect(je.sheet.delete).toHaveBeenCalledTimes(1);

        action.setAttribute("data-action", "edit");
        //@ts-ignore
        ma.noteContextClick(fEvent);
        expect(je.sheet.render).toHaveBeenCalledTimes(1);

        action.setAttribute("data-action", "remind");
        //@ts-ignore
        ma.noteContextClick(fEvent);
        expect(je.sheet.reminderChange).toHaveBeenCalledTimes(1);

        je.sheet.reminderChange.mockRejectedValue("E");
        //@ts-ignore
        ma.noteContextClick(fEvent);
        expect(je.sheet.reminderChange).toHaveBeenCalledTimes(2);
    });

    test("Update App", () => {
        jest.spyOn(ma, "render").mockImplementation(() => {});
        ma.updateApp();
        expect(ma.render).toHaveBeenCalledTimes(1);
    });

    test("Start Time", () => {
        jest.spyOn(GameSettings, "UiNotification").mockImplementation(() => {});
        jest.spyOn(ma, "updateApp").mockImplementation(() => {});
        jest.spyOn(tCal.timeKeeper, "start").mockImplementation(() => {});

        ma.startTime();
        expect(ma.updateApp).toHaveBeenCalledTimes(1);
        expect(tCal.timeKeeper.start).toHaveBeenCalledTimes(1);

        //@ts-ignore
        game.scenes = {};
        //@ts-ignore
        game.combats = {
            size: 1,
            find: (v: any) => {
                return v.call(undefined, { started: true, scene: { id: "s1" } });
            }
        };
        ma.startTime();
        expect(GameSettings.UiNotification).toHaveBeenCalledTimes(1);

        //@ts-ignore
        game.scenes = { active: { id: "s1" } };
        ma.startTime();
        expect(GameSettings.UiNotification).toHaveBeenCalledTimes(2);
    });

    test("Stop Time", () => {
        jest.spyOn(tCal.timeKeeper, "stop").mockImplementation(() => {});
        jest.spyOn(ma, "updateApp").mockImplementation(() => {});
        ma.stopTime();
        expect(ma.updateApp).toHaveBeenCalledTimes(1);
        expect(tCal.timeKeeper.stop).toHaveBeenCalledTimes(1);
    });

    test("Time Keeping Check", async () => {
        //@ts-ignore
        game.user.isGM = true;
        jest.spyOn(tCal, "syncTime").mockImplementation(async () => {});

        await ma.timeKeepingCheck();
        expect(tCal.syncTime).toHaveBeenCalledTimes(1);
    });

    test("Note Drag", () => {
        const target = document.createElement("div");
        const sibling = document.createElement("div");
        const targetParent = document.createElement("div");
        targetParent.append(target);
        targetParent.append(sibling);
        targetParent.classList.add("drag-active");

        const fEvent = { target: target };

        document.elementFromPoint = jest.fn<(x: number, y: number) => Element | null>().mockReturnValueOnce(null).mockReturnValue(sibling);

        //@ts-ignore
        ma.noteDrag(fEvent);
        expect(targetParent.childNodes[0]).toEqual(target);

        //@ts-ignore
        ma.noteDrag(fEvent);
        expect(targetParent.childNodes[0]).toEqual(sibling);
    });

    test("Note Drag End", () => {
        const target = document.createElement("div");
        const targetParent = document.createElement("div");
        targetParent.append(target);
        target.setAttribute("data-index", "asd");
        const fEvent = { target: target };

        jest.spyOn(GameSettings, "UiNotification").mockImplementation(() => {});
        jest.spyOn(GameSockets, "emit").mockImplementation(async () => {
            return true;
        });
        jest.spyOn(NManager, "orderNotesOnDay").mockImplementation(async () => {});

        //@ts-ignore
        ma.noteDragEnd(fEvent);
        expect(GameSettings.UiNotification).toHaveBeenCalledTimes(1);

        //@ts-ignore
        jest.spyOn(game.users, "find").mockImplementation((v: any) => {
            return v.call(undefined, { isGM: true, active: true });
        });
        //@ts-ignore
        ma.noteDragEnd(fEvent);
        expect(GameSockets.emit).toHaveBeenCalledTimes(1);

        //@ts-ignore
        game.user.isGM = true;
        SC.primary = true;
        //@ts-ignore
        ma.noteDragEnd(fEvent);
        expect(NManager.orderNotesOnDay).toHaveBeenCalledTimes(1);
    });

    test("Update Object", () => {
        //@ts-ignore
        ma._updateObject();
    });

    test("keyClick", () => {
        jest.spyOn(ma, "render").mockImplementation(() => {});

        //@ts-ignore
        ma.keyClick({ repeat: false, shiftKey: false, ctrlKey: false });
        expect(ma.render).not.toHaveBeenCalled();

        ma.uiElementStates.compactView = true;
        //@ts-ignore
        ma.keyClick({ repeat: false, shiftKey: false, ctrlKey: false });
        expect(ma.render).toHaveBeenCalledTimes(1);
    });

    test("toggleWindow", () => {
        jest.spyOn(ma, "render").mockImplementation(() => {});

        ma.sceneControlButtonClick();
        expect(ma.render).toHaveBeenCalledTimes(1);

        SC.clientSettings.persistentOpen = true;
        ma.sceneControlButtonClick();
        expect(ma.render).toHaveBeenCalledTimes(1);

        //@ts-ignore
        jest.spyOn(ma, "rendered", "get").mockReturnValue(false);
        ma.sceneControlButtonClick();
        expect(ma.render).toHaveBeenCalledTimes(2);
    });

    test("Time Displayed Only With Proper Permission", async () => {
        jest.spyOn((game as Game).user as StoredDocument<User>, 'hasRole').mockImplementation((role) => role === 1);
        tCal.generalSettings.showClock = true;

        const permissionMock = jest.replaceProperty(SC.globalConfiguration.permissions, 'viewExactTime', {
            player: false,
            trustedPlayer: false,
            assistantGameMaster: false
        });

        expect((await ma.getData() as Record<string, any>).showClock).toBe(false);

        permissionMock.replaceValue({
            player: true,
            trustedPlayer: true,
            assistantGameMaster: true
        });

        expect((await ma.getData() as Record<string, any>).showClock).toBe(true);

        tCal.generalSettings.showClock = false;
        expect((await ma.getData() as Record<string, any>).showClock).toBe(false);

        permissionMock.restore();
    });
});
