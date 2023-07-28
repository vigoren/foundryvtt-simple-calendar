/**
 * @jest-environment jsdom
 */
import "../../__mocks__/index";
import { jest, beforeEach, describe, expect, test } from "@jest/globals";
import SCController from "./s-c-controller";
import {
    CalManager,
    MainApplication,
    NManager,
    SC,
    updateCalManager,
    updateConfigurationApplication,
    updateMainApplication,
    updateMigrationApplication,
    updateNManager,
    updateSC
} from "./index";
import CalendarManager from "./calendar/calendar-manager";
import MainApp from "./applications/main-app";
import ConfigurationApp from "./applications/configuration-app";
import { GameSettings } from "./foundry-interfacing/game-settings";
import { CombatPauseRules, NoteReminderNotificationType } from "../constants";
import MigrationApp from "./applications/migration-app";
import NoteManager from "./notes/note-manager";
import Calendar from "./calendar";
import * as PermUtils from "./utilities/permissions";
import GameSockets from "./foundry-interfacing/game-sockets";
import UserPermissions from "./configuration/user-permissions";

describe("SCController Tests", () => {
    beforeEach(() => {
        updateCalManager(new CalendarManager());
        updateSC(new SCController());
        updateMainApplication(new MainApp());
        updateConfigurationApplication(new ConfigurationApp());
        updateMigrationApplication(new MigrationApp());
        updateNManager(new NoteManager());
    });

    test("Properties", () => {
        expect(Object.keys(SC).length).toBe(4); //Make sure no new properties have been added
    });

    test("activeCalendar", () => {
        jest.spyOn(CalManager, "getActiveCalendar");
        SC.activeCalendar;
        expect(CalManager.getActiveCalendar).toHaveBeenCalled();
    });

    test("ThemeChange", () => {
        const docGEIDSpy = jest.spyOn(document, "getElementById");
        const docQSASpy = jest.spyOn(document, "querySelectorAll");
        SCController.ThemeChange();
        expect(docGEIDSpy).toHaveBeenCalledTimes(2);
        expect(docQSASpy).toHaveBeenCalledTimes(1);

        const fakeResult = document.createElement("div");
        docGEIDSpy.mockReturnValueOnce(fakeResult).mockReturnValueOnce(fakeResult);
        //@ts-ignore
        docQSASpy.mockReturnValueOnce([fakeResult]);
        SCController.ThemeChange();
        expect(docGEIDSpy).toHaveBeenCalledTimes(4);
        expect(docQSASpy).toHaveBeenCalledTimes(2);
        expect(fakeResult.classList.contains("dark"));
    });

    test("LoadThemeCSS", () => {
        const gsGSSSpy = jest.spyOn(GameSettings, "GetStringSettings");
        const docHeadQS = jest.spyOn(document.head, "querySelector");
        const docHeadA = jest.spyOn(document.head, "append");
        jest.spyOn(SCController, "addCSSImageURLPaths").mockImplementation(() => {});
        gsGSSSpy.mockReturnValueOnce(`dark`);
        SCController.LoadThemeCSS();
        expect(gsGSSSpy).toHaveBeenCalledTimes(1);
        expect(docHeadQS).toHaveBeenCalledTimes(1);
        expect(docHeadA).toHaveBeenCalledTimes(1);

        gsGSSSpy.mockReturnValueOnce(`classic`);
        docHeadQS.mockReturnValueOnce(document.createElement("a"));
        SCController.LoadThemeCSS();
        expect(gsGSSSpy).toHaveBeenCalledTimes(2);
        expect(docHeadQS).toHaveBeenCalledTimes(2);
        expect(docHeadA).toHaveBeenCalledTimes(1);

        gsGSSSpy.mockReturnValueOnce(`classic`);
        docHeadQS.mockReturnValueOnce(null);
        SCController.LoadThemeCSS();
        expect(gsGSSSpy).toHaveBeenCalledTimes(3);
        expect(docHeadQS).toHaveBeenCalledTimes(3);
        expect(docHeadA).toHaveBeenCalledTimes(2);

        SCController.LoadThemeCSS("light");
        expect(gsGSSSpy).toHaveBeenCalledTimes(3);
        expect(docHeadQS).toHaveBeenCalledTimes(4);
        expect(docHeadA).toHaveBeenCalledTimes(3);
    });

    test("Add CSS Image URL Paths", () => {
        const docHeadQS = jest.spyOn(document.head, "querySelector");
        const docHeadA = jest.spyOn(document.head, "append");

        docHeadQS.mockReturnValueOnce(null);

        SCController.addCSSImageURLPaths("dsa5");
        expect(docHeadQS).toHaveBeenCalledTimes(1);
        expect(docHeadA).toHaveBeenCalledTimes(1);

        docHeadQS.mockReturnValueOnce(document.createElement("style"));
        SCController.addCSSImageURLPaths("dsa5");
        expect(docHeadQS).toHaveBeenCalledTimes(2);
        expect(docHeadA).toHaveBeenCalledTimes(1);
    });

    test("Persistence Change", () => {
        const mainApp = document.createElement("div");
        jest.spyOn(GameSettings, "GetBooleanSettings").mockReturnValueOnce(false).mockReturnValue(true);
        jest.spyOn(document, "getElementById").mockReturnValue(mainApp);

        SC.PersistenceChange();
        expect(mainApp.classList.contains("fsc-persistent")).toBe(false);
        SC.PersistenceChange();
        expect(mainApp.classList.contains("fsc-persistent")).toBe(true);
    });

    test("Compact Scale Change", () => {
        const mainApp = document.createElement("div");
        jest.spyOn(GameSettings, "GetNumericSettings").mockReturnValueOnce(120).mockReturnValue(200);
        jest.spyOn(document, "getElementById").mockReturnValue(mainApp);

        SC.CompactScaleChange();
        expect(mainApp.classList.contains("sc-scale-120")).toBe(true);
        SC.CompactScaleChange();
        expect(mainApp.classList.contains("sc-scale-120")).toBe(false);
        expect(mainApp.classList.contains("sc-scale-200")).toBe(true);
    });

    test("Side Drawer Direction Change", () => {
        jest.spyOn(MainApplication, "render").mockImplementation(() => {});
        SCController.SideDrawerDirectionChange();
        expect(MainApplication.render).toHaveBeenCalledTimes(1);
    });

    test("Always Show Note List Change", () => {
        jest.spyOn(MainApplication, "initialize").mockImplementation(() => {});
        jest.spyOn(MainApplication, "render").mockImplementation(() => {});

        SCController.AlwaysShowNoteListChange();

        expect(MainApplication.initialize).toHaveBeenCalledTimes(1);
        expect(MainApplication.render).toHaveBeenCalledTimes(1);
    });

    test("initialize", () => {
        jest.spyOn(SC.sockets, "initialize").mockImplementation(() => {});
        jest.spyOn(NManager, "checkNoteTriggers").mockImplementation(() => {});
        jest.spyOn(CalManager, "getActiveCalendar").mockReturnValueOnce(new Calendar("", ""));
        SC.initialize();
        expect(SC.sockets.initialize).toHaveBeenCalledTimes(1);
        expect(NManager.checkNoteTriggers).toHaveBeenCalledTimes(1);
    });

    test("load", () => {
        jest.spyOn(SCController, "LoadThemeCSS").mockImplementation(() => {});
        jest.spyOn(GameSettings, "GetObjectSettings").mockReturnValueOnce({
            permissions: {},
            secondsInCombatRound: 2,
            calendarsSameTimestamp: false,
            syncCalendars: true,
            showNotesFolder: true,
            combatPauseRule: "active",
            inGameChatTimestamp: false
        });
        jest.spyOn(GameSettings, "GetStringSettings").mockReturnValue("test");
        jest.spyOn(GameSettings, "GetBooleanSettings").mockReturnValue(false);
        SC.load();
        expect(SCController.LoadThemeCSS).toHaveBeenCalledTimes(1);
        expect(SC.globalConfiguration.secondsInCombatRound).toBe(2);
        expect(SC.globalConfiguration.calendarsSameTimestamp).toBe(false);
        expect(SC.globalConfiguration.syncCalendars).toBe(true);
        expect(SC.globalConfiguration.showNotesFolder).toBe(true);
        expect(SC.clientSettings.theme).toBe("test");
        expect(SC.clientSettings.openOnLoad).toBe(false);
        expect(SC.clientSettings.openCompact).toBe(false);
        expect(SC.clientSettings.rememberPosition).toBe(false);
    });

    test("Reload", () => {
        jest.spyOn(SCController, "LoadThemeCSS").mockImplementation(() => {});
        jest.spyOn(GameSettings, "GetStringSettings").mockReturnValue("test");
        SC.reload();
        expect(SCController.LoadThemeCSS).toHaveBeenCalledTimes(1);
        expect(SC.clientSettings.theme).toBe("test");
    });

    test("save", () => {
        jest.spyOn(CalManager, "saveCalendars").mockImplementation(async () => {});
        jest.spyOn(GameSettings, "SaveStringSetting").mockImplementation(async () => {
            return true;
        });
        jest.spyOn(GameSettings, "SaveBooleanSetting").mockImplementation(async () => {
            return true;
        });
        jest.spyOn(GameSettings, "SaveObjectSetting").mockImplementation(async () => {
            return true;
        });
        jest.spyOn(GameSockets, "emit").mockImplementation(async () => {
            return true;
        });

        SC.save();
        expect(CalManager.saveCalendars).toHaveBeenCalledTimes(1);

        SC.save(
            {
                version: "",
                id: "",
                permissions: new UserPermissions(),
                secondsInCombatRound: 1,
                calendarsSameTimestamp: false,
                syncCalendars: false,
                showNotesFolder: false,
                combatPauseRule: CombatPauseRules.Active,
                inGameChatTimestamp: true
            },
            {
                id: "",
                theme: `dark`,
                openOnLoad: true,
                openCompact: false,
                rememberPosition: false,
                rememberCompactPosition: false,
                appPosition: {},
                noteReminderNotification: NoteReminderNotificationType.whisper,
                sideDrawerDirection: "sc-right",
                alwaysShowNoteList: false,
                persistentOpen: false,
                compactViewScale: 100
            }
        );
        expect(CalManager.saveCalendars).toHaveBeenCalledTimes(2);
        expect(GameSettings.SaveStringSetting).toHaveBeenCalledTimes(3);
        expect(GameSettings.SaveBooleanSetting).toHaveBeenCalledTimes(6);
        expect(GameSettings.SaveObjectSetting).toHaveBeenCalledTimes(2);
    });

    test("Hide Context Menus", () => {
        const context = document.createElement("div");
        context.classList.add("fsc-context-menu");
        document.body.append(context);
        SCController.HideContextMenus();
        expect(context.classList.contains("fsc-hide")).toBe(true);
    });

    test("Check Combat Active", () => {
        const tCal = new Calendar("", "");
        jest.spyOn(CalManager, "getActiveCalendar").mockReturnValue(tCal);
        const orig = (<Game>game).combats;
        const origScenes = (<Game>game).scenes;
        //@ts-ignore
        (<Game>game).combats = {
            size: 1,
            //@ts-ignore
            find: jest.fn((v) => {
                //@ts-ignore
                return v.call(undefined, { id: "cid" }) ? { id: "cid", started: false, scene: { id: "sid" } } : null;
            })
        };
        //@ts-ignore
        SC.checkCombatActive();
        expect(tCal.time.combatRunning).toBe(false);

        //@ts-ignore
        (<Game>game).combats = {
            size: 1,
            //@ts-ignore
            find: jest.fn((v) => {
                //@ts-ignore
                return v.call(undefined, { id: "cid", started: true, scene: { id: "sid" } })
                    ? { id: "cid", started: true, scene: { id: "sid" } }
                    : null;
            })
        };
        //@ts-ignore
        jest.spyOn(GameSettings, "GetSceneForCombatCheck").mockReturnValue({ id: "sid" });
        //@ts-ignore
        SC.checkCombatActive();
        expect(tCal.time.combatRunning).toBe(true);

        (<Game>game).combats = orig;
        (<Game>game).scenes = origScenes;
    });

    test("Get Scene Control Buttons", () => {
        const controls: any[] = [{ name: "test", tools: [] }];
        const canUserSpy = jest.spyOn(PermUtils, "canUser").mockReturnValue(true);
        SC.getSceneControlButtons(controls);
        expect(controls.length).toBe(1);
        expect(controls[0].tools.length).toBe(0);
        SC.getSceneControlButtons(controls);
        expect(controls.length).toBe(1);
        expect(controls[0].tools.length).toBe(0);
        controls.push({ name: "notes" });
        SC.getSceneControlButtons(controls);
        expect(controls.length).toBe(2);
        expect(controls[0].tools.length).toBe(0);
        controls[1].tools = [];
        SC.getSceneControlButtons(controls);
        expect(controls.length).toBe(2);
        expect(controls[0].tools.length).toBe(0);
        expect(controls[1].tools.length).toBe(1);
    });

    test("Render Journal Directory", async () => {
        const mockQuery = {
            find: jest.fn()
        };
        const mockFindResult = { remove: jest.fn() };
        jest.spyOn(NManager, "createJournalDirectory").mockImplementation(async () => {});

        //@ts-ignore
        await SC.renderJournalDirectory(null, mockQuery);
        expect(NManager.createJournalDirectory).toHaveBeenCalledTimes(1);
        expect(mockQuery.find).not.toHaveBeenCalled();

        //@ts-ignore
        NManager.noteDirectory = { id: "" };
        //@ts-ignore
        await SC.renderJournalDirectory(null, mockQuery);
        expect(NManager.createJournalDirectory).toHaveBeenCalledTimes(2);
        expect(mockQuery.find).toHaveBeenCalledTimes(1);

        mockQuery.find.mockReturnValueOnce(mockFindResult);
        //@ts-ignore
        await SC.renderJournalDirectory(null, mockQuery);
        expect(NManager.createJournalDirectory).toHaveBeenCalledTimes(3);
        expect(mockQuery.find).toHaveBeenCalledTimes(2);
        expect(mockFindResult.remove).toHaveBeenCalledTimes(1);
    });

    test("Render Journal Sheet", () => {
        const mockQuery = {
            find: jest.fn()
        };
        const mockFindResult = { remove: jest.fn() };
        //@ts-ignore
        SC.renderJournalSheet(null, mockQuery);
        expect(mockQuery.find).not.toHaveBeenCalled();
        //@ts-ignore
        NManager.noteDirectory = { id: "" };

        //@ts-ignore
        SC.renderJournalSheet(null, mockQuery);
        expect(mockQuery.find).toHaveBeenCalledTimes(1);

        mockQuery.find.mockReturnValueOnce(mockFindResult);
        //@ts-ignore
        SC.renderJournalSheet(null, mockQuery);
        expect(mockQuery.find).toHaveBeenCalledTimes(2);
        expect(mockFindResult.remove).toHaveBeenCalledTimes(1);
    });

    test("Render Scene Config", () => {
        const mockQuery = {
            find: jest.fn()
        };
        const mockFindResult = { remove: jest.fn() };
        mockQuery.find.mockReturnValue(mockFindResult);

        //@ts-ignore
        SC.renderSceneConfig({}, mockQuery, { journals: [{ id: "asd", name: "asd" }] });
    });

    test("Game Paused", () => {
        const tCal = new Calendar("", "");
        jest.spyOn(CalManager, "getActiveCalendar").mockReturnValue(tCal);
        const tkStartSpy = jest.spyOn(tCal.timeKeeper, "start").mockImplementation(() => {});
        const tkSetStatusSpy = jest.spyOn(tCal.timeKeeper, "setStatus").mockImplementation(() => {});

        SC.gamePaused();
        expect(tkStartSpy).not.toHaveBeenCalled();
        expect(tkSetStatusSpy).not.toHaveBeenCalled();

        tCal.time.unifyGameAndClockPause = true;
        SC.gamePaused();
        expect(tkStartSpy).not.toHaveBeenCalled();
        expect(tkSetStatusSpy).toHaveBeenCalledTimes(1);
        //@ts-ignore
        game.paused = false;
        SC.gamePaused();
        expect(tkStartSpy).toHaveBeenCalledTimes(1);
        expect(tkSetStatusSpy).toHaveBeenCalledTimes(1);
    });

    test("World Time Update", () => {
        const tCal = new Calendar("", "");
        const setFromTimeSpy = jest.spyOn(tCal, "setFromTime");
        jest.spyOn(CalManager, "getActiveCalendar").mockReturnValue(tCal);
        SC.worldTimeUpdate(100, 10);
        expect(setFromTimeSpy).toHaveBeenCalled();
    });

    test("Create Combatant", () => {
        const tCal = new Calendar("", "");
        jest.spyOn(CalManager, "getActiveCalendar").mockReturnValue(tCal);
        const orig = (<Game>game).combats;
        const origScenes = (<Game>game).scenes;
        (<Game>game).combats = undefined;
        //@ts-ignore
        SC.createCombatant({}, {}, "");
        expect(tCal.time.combatRunning).toBe(false);

        //@ts-ignore
        (<Game>game).combats = {
            size: 1,
            //@ts-ignore
            find: jest.fn((v) => {
                //@ts-ignore
                return v.call(undefined, { id: "cid" }) ? { id: "cid", started: false, scene: { id: "sid" } } : null;
            })
        };
        //@ts-ignore
        SC.createCombatant({ parent: null }, {}, "");
        expect(tCal.time.combatRunning).toBe(false);

        //@ts-ignore
        (<Game>game).combats = {
            size: 1,
            //@ts-ignore
            find: jest.fn((v) => {
                //@ts-ignore
                return v.call(undefined, { id: "cid" }) ? { id: "cid", started: false, scene: { id: "sid" } } : null;
            })
        };
        //@ts-ignore
        game.scenes = { active: null };
        //@ts-ignore
        SC.createCombatant({ parent: { id: "cid" } }, {}, "");
        expect(tCal.time.combatRunning).toBe(false);

        //@ts-ignore
        (<Game>game).combats = {
            size: 1,
            //@ts-ignore
            find: jest.fn((v) => {
                //@ts-ignore
                return v.call(undefined, { id: "cid" }) ? { id: "cid", started: true, scene: { id: "sid" } } : null;
            })
        };
        //@ts-ignore
        game.scenes = { active: { id: "sid" } };
        //@ts-ignore
        SC.createCombatant({ parent: { id: "cid" } }, {}, "");
        expect(tCal.time.combatRunning).toBe(true);

        tCal.time.combatRunning = false;
        //@ts-ignore
        game.scenes = null;
        //@ts-ignore
        SC.createCombatant({ parent: { id: "cid" } }, {}, "");
        expect(tCal.time.combatRunning).toBe(true);

        (<Game>game).combats = orig;
        (<Game>game).scenes = origScenes;
    });

    test("Combat Update", () => {
        const tCal = new Calendar("", "");
        jest.spyOn(CalManager, "getActiveCalendar").mockReturnValue(tCal);
        //@ts-ignore
        SC.combatUpdate({ started: true }, {}, { advanceTime: 2 });
        //@ts-ignore
        game.scenes = { active: null };
        //@ts-ignore
        SC.combatUpdate({}, {}, {});
        expect(tCal.time.combatRunning).toBe(true);
        //@ts-ignore
        game.scenes = { active: { id: "123" } };
        //@ts-ignore
        SC.combatUpdate({ started: true }, {}, {});
        expect(tCal.time.combatRunning).toBe(true);
        //@ts-ignore
        SC.combatUpdate({ started: true, scene: { id: "123" } }, {}, {});
        expect(tCal.time.combatRunning).toBe(true);
        //@ts-ignore
        SC.combatUpdate({ started: true, scene: { id: "123" } }, {}, { advanceTime: 2 });
        expect(tCal.combatChangeTriggered).toBe(true);
        //@ts-ignore
        SC.combatUpdate({ started: true, scene: { id: "123" } }, {}, { advanceTime: 0 });
        expect(tCal.combatChangeTriggered).toBe(true);

        //@ts-ignore
        game.scenes = null;
    });

    test("Combat Delete", () => {
        const tCal = new Calendar("", "");
        jest.spyOn(CalManager, "getActiveCalendar").mockReturnValueOnce(tCal);
        tCal.time.combatRunning = true;
        //@ts-ignore
        SC.combatDelete({});
        expect(tCal.time.combatRunning).toBe(true);

        //@ts-ignore
        game.scenes = { active: null };

        //@ts-ignore
        SC.combatDelete({});
        expect(tCal.time.combatRunning).toBe(true);

        //@ts-ignore
        game.scenes = { active: { id: "123" } };

        //@ts-ignore
        SC.combatDelete({ started: true, scene: { id: "123" } });
        expect(tCal.time.combatRunning).toBe(false);

        //@ts-ignore
        game.scenes = null;
    });

    test("Canvas Init", () => {
        const orig = (<Game>game).combats;
        //@ts-ignore
        game.user.isGM = true;
        SC.primary = true;
        SC.globalConfiguration.combatPauseRule = CombatPauseRules.Current;

        const tCal = new Calendar("", "");
        jest.spyOn(CalManager, "getActiveCalendar").mockReturnValue(tCal);

        //@ts-ignore
        SC.canvasInit({});
        expect(tCal.time.combatRunning).toBe(false);

        //@ts-ignore
        (<Game>game).combats = {
            size: 1,
            //@ts-ignore
            filter: jest.fn((v) => {
                //@ts-ignore
                return v.call(undefined, { id: "cid", started: true, scene: { id: "sid" } })
                    ? [{ id: "cid", started: true, scene: { id: "sid" } }]
                    : [];
            })
        };
        //@ts-ignore
        SC.canvasInit({ scene: { id: "sid" } });
        expect(tCal.time.combatRunning).toBe(true);

        (<Game>game).combats = orig;
        //@ts-ignore
        game.user.isGM = false;
        SC.primary = false;
    });
});
