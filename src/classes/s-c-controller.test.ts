/**
 * @jest-environment jsdom
 */
import "../../__mocks__/index";
import SCController from "./s-c-controller";
import {
    CalManager,
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
import {GameSettings} from "./foundry-interfacing/game-settings";
import {Themes} from "../constants";
import MigrationApp from "./applications/migration-app";
import NoteManager from "./notes/note-manager";
import Calendar from "./calendar";
import * as PermUtils from "./utilities/permissions";
import spyOn = jest.spyOn;
import GameSockets from "./foundry-interfacing/game-sockets";
import UserPermissions from "./configuration/user-permissions";

describe('SCController Tests', () => {

    beforeEach(() => {
        updateCalManager(new CalendarManager());
        updateSC(new SCController());
        updateMainApplication(new MainApp());
        updateConfigurationApplication(new ConfigurationApp());
        updateMigrationApplication(new MigrationApp());
        updateNManager(new NoteManager());
    });

    test('Properties', () => {
        expect(Object.keys(SC).length).toBe(4); //Make sure no new properties have been added
    });

    test('activeCalendar', () => {
        jest.spyOn(CalManager, 'getActiveCalendar');
        SC.activeCalendar;
        expect(CalManager.getActiveCalendar).toHaveBeenCalled();
    });

    test('ThemeChange', () => {
        const docGEIDSpy = jest.spyOn(document, 'getElementById');
        const docQSASpy = jest.spyOn(document, 'querySelectorAll');
        SCController.ThemeChange();
        expect(docGEIDSpy).toHaveBeenCalledTimes(2);
        expect(docQSASpy).toHaveBeenCalledTimes(1);

        const fakeResult = document.createElement('div');
        docGEIDSpy.mockReturnValueOnce(fakeResult).mockReturnValueOnce(fakeResult);
        //@ts-ignore
        docQSASpy.mockReturnValueOnce([fakeResult]);
        SCController.ThemeChange();
        expect(docGEIDSpy).toHaveBeenCalledTimes(4);
        expect(docQSASpy).toHaveBeenCalledTimes(2);
        expect(fakeResult.classList.contains('dark'));
    });

    test('LoadThemeCSS', () => {
        const gsGSSSpy = jest.spyOn(GameSettings, 'GetStringSettings');
        const docHeadQS = jest.spyOn(document.head, 'querySelector');
        const docHeadA = jest.spyOn(document.head, 'append');
        gsGSSSpy.mockReturnValueOnce(Themes.dark);
        SCController.LoadThemeCSS();
        expect(gsGSSSpy).toHaveBeenCalledTimes(1);
        expect(docHeadQS).not.toHaveBeenCalled();
        expect(docHeadA).not.toHaveBeenCalled();

        gsGSSSpy.mockReturnValueOnce(Themes.classic);
        docHeadQS.mockReturnValueOnce(document.createElement('a'));
        SCController.LoadThemeCSS();
        expect(gsGSSSpy).toHaveBeenCalledTimes(2);
        expect(docHeadQS).toHaveBeenCalledTimes(1);
        expect(docHeadA).not.toHaveBeenCalled();

        gsGSSSpy.mockReturnValueOnce(Themes.classic);
        docHeadQS.mockReturnValueOnce(null);
        SCController.LoadThemeCSS();
        expect(gsGSSSpy).toHaveBeenCalledTimes(3);
        expect(docHeadQS).toHaveBeenCalledTimes(2);
        expect(docHeadA).toHaveBeenCalledTimes(1);
    });

    test('initialize', () => {
        jest.spyOn(SC.sockets, 'initialize').mockImplementation(() => {});
        jest.spyOn(NManager, 'checkNoteReminders').mockImplementation(() => {});
        jest.spyOn(CalManager, 'getActiveCalendar').mockReturnValueOnce(new Calendar('', ''));
        SC.initialize();
        expect(SC.sockets.initialize).toHaveBeenCalledTimes(1);
        expect(NManager.checkNoteReminders).toHaveBeenCalledTimes(1);
    });

    test('load', () => {
        jest.spyOn(SCController, 'LoadThemeCSS').mockImplementation(() => {});
        jest.spyOn(GameSettings, 'GetObjectSettings').mockReturnValueOnce({
            permissions: {},
            secondsInCombatRound: 2,
            calendarsSameTimestamp: false,
            syncCalendars: true,
            showNotesFolder: true
        });
        jest.spyOn(GameSettings, 'GetStringSettings').mockReturnValue('test');
        jest.spyOn(GameSettings, 'GetBooleanSettings').mockReturnValue(false);
        SC.load();
        expect(SCController.LoadThemeCSS).toHaveBeenCalledTimes(1);
        expect(SC.globalConfiguration.secondsInCombatRound).toBe(2);
        expect(SC.globalConfiguration.calendarsSameTimestamp).toBe(false);
        expect(SC.globalConfiguration.syncCalendars).toBe(true);
        expect(SC.globalConfiguration.showNotesFolder).toBe(true);
        expect(SC.clientSettings.theme).toBe('test');
        expect(SC.clientSettings.openOnLoad ).toBe(false);
        expect(SC.clientSettings.openCompact ).toBe(false);
        expect(SC.clientSettings.rememberPosition).toBe(false);
    });

    test('save', () => {
        jest.spyOn(CalManager, 'saveCalendars').mockImplementation(async () => {});
        jest.spyOn(GameSettings, 'SaveStringSetting').mockImplementation(async () => {return true});
        jest.spyOn(GameSettings, 'SaveBooleanSetting').mockImplementation(async () => {return true});
        jest.spyOn(GameSettings, 'SaveObjectSetting').mockImplementation(async () => {return true});
        jest.spyOn(GameSockets, 'emit').mockImplementation(async () => {return true});

        SC.save();
        expect(CalManager.saveCalendars).toHaveBeenCalledTimes(1);

        SC.save({
            version: '',
            id: '',
            permissions: new UserPermissions(),
            secondsInCombatRound: 1,
            calendarsSameTimestamp: false,
            syncCalendars: false,
            showNotesFolder: false
        }, {
            id: '',
            theme: Themes.dark,
            openOnLoad: true,
            openCompact: false,
            rememberPosition: false,
            appPosition: {}
        });
        expect(CalManager.saveCalendars).toHaveBeenCalledTimes(2);
        expect(GameSettings.SaveStringSetting).toHaveBeenCalledTimes(1);
        expect(GameSettings.SaveBooleanSetting).toHaveBeenCalledTimes(3);
        expect(GameSettings.SaveObjectSetting).toHaveBeenCalledTimes(2);
    });

    test('Get Scene Control Buttons', () => {
        const controls: any[] = [{name:'test', tools:[]}];
        const canUserSpy = spyOn(PermUtils, 'canUser').mockReturnValue(true);
        SC.getSceneControlButtons(controls);
        expect(controls.length).toBe(1);
        expect(controls[0].tools.length).toBe(0);
        SC.getSceneControlButtons(controls);
        expect(controls.length).toBe(1);
        expect(controls[0].tools.length).toBe(0);
        controls.push({name:'token'});
        SC.getSceneControlButtons(controls);
        expect(controls.length).toBe(2);
        expect(controls[0].tools.length).toBe(0);
        controls[1].tools = [];
        SC.getSceneControlButtons(controls);
        expect(controls.length).toBe(2);
        expect(controls[0].tools.length).toBe(0);
        expect(controls[1].tools.length).toBe(1);
    });

    test('Render Journal Directory', async () => {
        const mockQuery = {
            find: jest.fn()
        };
        const mockFindResult = {remove: jest.fn()};
        jest.spyOn(NManager, 'createJournalDirectory').mockImplementation(async () => {});

        //@ts-ignore
        await SC.renderJournalDirectory(null, mockQuery);
        expect(NManager.createJournalDirectory).toHaveBeenCalledTimes(1);
        expect(mockQuery.find).not.toHaveBeenCalled();

        //@ts-ignore
        NManager.noteDirectory = {id: ''};
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

    test('Render Journal Sheet', () => {
        const mockQuery = {
            find: jest.fn()
        };
        const mockFindResult = {remove: jest.fn()};
        //@ts-ignore
        SC.renderJournalSheet(null, mockQuery);
        expect(mockQuery.find).not.toHaveBeenCalled();
        //@ts-ignore
        NManager.noteDirectory = {id: ''};

        //@ts-ignore
        SC.renderJournalSheet(null, mockQuery);
        expect(mockQuery.find).toHaveBeenCalledTimes(1);


        mockQuery.find.mockReturnValueOnce(mockFindResult);
        //@ts-ignore
        SC.renderJournalSheet(null, mockQuery);
        expect(mockQuery.find).toHaveBeenCalledTimes(2);
        expect(mockFindResult.remove).toHaveBeenCalledTimes(1);
    });

    test('Game Paused', () => {
        const tCal = new Calendar('', '');
        jest.spyOn(CalManager, 'getActiveCalendar').mockReturnValue(tCal);
        const tkStartSpy = jest.spyOn(tCal.timeKeeper, 'start').mockImplementation(() => {});
        const tkSetStatusSpy = jest.spyOn(tCal.timeKeeper, 'setStatus').mockImplementation(() => {});

        SC.gamePaused(true);
        expect(tkStartSpy).not.toHaveBeenCalled();
        expect(tkSetStatusSpy).not.toHaveBeenCalled();

        tCal.time.unifyGameAndClockPause = true;
        SC.gamePaused(true);
        expect(tkStartSpy).not.toHaveBeenCalled();
        expect(tkSetStatusSpy).toHaveBeenCalledTimes(1);
        //@ts-ignore
        game.paused = false;
        SC.gamePaused(true);
        expect(tkStartSpy).toHaveBeenCalledTimes(1);
        expect(tkSetStatusSpy).toHaveBeenCalledTimes(1);
    });

    test('World Time Update', () => {
        const tCal = new Calendar('', '');
        const setFromTimeSpy = jest.spyOn(tCal, 'setFromTime');
        jest.spyOn(CalManager, 'getActiveCalendar').mockReturnValue(tCal);
        SC.worldTimeUpdate(100, 10);
        expect(setFromTimeSpy).toHaveBeenCalled();
    });

    test('Create Combatant', () => {
        const tCal = new Calendar('', '');
        jest.spyOn(CalManager, 'getActiveCalendar').mockReturnValue(tCal);
        const orig = (<Game>game).combats;
        const origScenes = (<Game>game).scenes;
        (<Game>game).combats = undefined;
        //@ts-ignore
        SC.createCombatant({}, {}, "");
        expect(tCal.time.combatRunning).toBe(false);

        //@ts-ignore
        (<Game>game).combats = {size: 1, find: jest.fn((v)=>{return v.call(undefined, {id: 'cid'})? {id: 'cid', started: false, scene: {id:"sid"}} : null; }) };
        //@ts-ignore
        SC.createCombatant({parent: null}, {}, "");
        expect(tCal.time.combatRunning).toBe(false);

        //@ts-ignore
        (<Game>game).combats = {size: 1, find: jest.fn((v)=>{return v.call(undefined, {id: 'cid'})? {id: 'cid', started: false, scene: {id:"sid"}} : null; }) };
        //@ts-ignore
        game.scenes = {active: null};
        //@ts-ignore
        SC.createCombatant({parent: {id: 'cid'}}, {}, "");
        expect(tCal.time.combatRunning).toBe(false);

        //@ts-ignore
        (<Game>game).combats = {size: 1, find: jest.fn((v)=>{return v.call(undefined, {id: 'cid'})? {id: 'cid', started: true, scene: {id:"sid"}} : null; }) };
        //@ts-ignore
        game.scenes = {active: {id: 'sid'}};
        //@ts-ignore
        SC.createCombatant({parent: {id: 'cid'}}, {}, "");
        expect(tCal.time.combatRunning).toBe(true);

        tCal.time.combatRunning = false;
        //@ts-ignore
        game.scenes = null;
        //@ts-ignore
        SC.createCombatant({parent: {id: 'cid'}}, {}, "");
        expect(tCal.time.combatRunning).toBe(true);

        (<Game>game).combats = orig;
        (<Game>game).scenes = origScenes;
    });

    test('Combat Update', () => {
        const tCal = new Calendar('', '');
        jest.spyOn(CalManager, 'getActiveCalendar').mockReturnValue(tCal);
        //@ts-ignore
        SC.combatUpdate({started: true}, {}, {advanceTime: 2});
        //@ts-ignore
        game.scenes = {active: null};
        //@ts-ignore
        SC.combatUpdate({}, {}, {});
        expect(tCal.time.combatRunning).toBe(true);
        //@ts-ignore
        game.scenes = {active: {id: '123'}};
        //@ts-ignore
        SC.combatUpdate({started: true}, {}, {});
        expect(tCal.time.combatRunning).toBe(true);
        //@ts-ignore
        SC.combatUpdate({started: true, scene: {id:"123"}}, {}, {});
        expect(tCal.time.combatRunning).toBe(true);
        //@ts-ignore
        SC.combatUpdate({started: true, scene: {id:"123"}}, {}, {advanceTime: 2});
        expect(tCal.combatChangeTriggered).toBe(true);
        //@ts-ignore
        SC.combatUpdate({started: true, scene: {id:"123"}}, {}, {advanceTime: 0});
        expect(tCal.combatChangeTriggered).toBe(true);

        //@ts-ignore
        game.scenes = null;
    });

    test('Combat Delete', () => {
        const tCal = new Calendar('', '');
        jest.spyOn(CalManager, 'getActiveCalendar').mockReturnValueOnce(tCal);
        tCal.time.combatRunning = true;
        //@ts-ignore
        SC.combatDelete({});
        expect(tCal.time.combatRunning).toBe(true)

        //@ts-ignore
        game.scenes = {active: null};

        //@ts-ignore
        SC.combatDelete({});
        expect(tCal.time.combatRunning).toBe(true);

        //@ts-ignore
        game.scenes = {active: {id: '123'}};

        //@ts-ignore
        SC.combatDelete({started: true, scene: {id:"123"}});
        expect(tCal.time.combatRunning).toBe(false);

        //@ts-ignore
        game.scenes = null;
    });
});