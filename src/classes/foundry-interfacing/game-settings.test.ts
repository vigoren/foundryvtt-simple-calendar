/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import {jest, beforeEach, describe, expect, test} from '@jest/globals';

import {GameSettings} from "./game-settings";
import {CombatPauseRules, SettingNames} from "../../constants";
import {SC, updateSC} from "../index";
import SCController from "../s-c-controller";
import Mock = jest.Mock;

describe('Game Settings Class Tests', () => {

    beforeEach(()=>{
        (<Mock>(<Game>game).settings.get).mockClear();
        (<Mock>(<Game>game).socket?.emit).mockClear();
        //@ts-ignore
        game.user.isGM = false;
    });

    test( 'Is GM', () => {
        const origGameUser = (<Game>game).user;
        expect(GameSettings.IsGm()).toBe(false);
        //@ts-ignore
        game.user = undefined;
        expect(GameSettings.IsGm()).toBe(false);
        //@ts-ignore
        game.user = origGameUser;
    });

    test('User Name', () => {
        const origGameUser = (<Game>game).user;
        expect(GameSettings.UserName()).toBe('');
        //@ts-ignore
        game.user = undefined;
        expect(GameSettings.UserName()).toBe('');
        //@ts-ignore
        game.user = {name: 'name'};
        expect(GameSettings.UserName()).toBe('name');
        //@ts-ignore
        game.user = origGameUser;
    });

    test('User ID', () => {
        const origGameUser = (<Game>game).user;
        expect(GameSettings.UserID()).toBe('');
        //@ts-ignore
        game.user = undefined;
        expect(GameSettings.UserID()).toBe('');
        //@ts-ignore
        game.user = {id: 'id'};
        expect(GameSettings.UserID()).toBe('id');
        //@ts-ignore
        game.user = origGameUser;
    });

    test('Get User', () => {
        const origGameUser = (<Game>game).users;
        expect(GameSettings.GetUser('')).toBe(false);
        //@ts-ignore
        game.users = undefined;
        expect(GameSettings.GetUser('')).toBeUndefined();
        //@ts-ignore
        game.users = [{id: 'id'}];
        expect(GameSettings.GetUser('id')).toBeDefined();
        //@ts-ignore
        game.users = origGameUser;
    });

    test('Get Module Version', () => {
        expect(GameSettings.GetModuleVersion()).toBe('');
        (<Mock>(<Game>game).modules.get).mockReturnValueOnce({version:'1'});
        expect(GameSettings.GetModuleVersion()).toBe('1');
    });

    test('Localize', () => {
        expect(GameSettings.Localize('test')).toBe('');
        const orig = (<Game>game).i18n;
        // @ts-ignore
        (<Game>game).i18n = null;
        expect(GameSettings.Localize('test')).toBe('test');
        (<Game>game).i18n = orig;
    });

    test('Get Boolean Settings', () => {
        (<Mock>(<Game>game).settings.get).mockReturnValueOnce(false);
        expect(GameSettings.GetBooleanSettings(SettingNames.ActiveCalendar)).toBe(false);
    });

    test('Get Object Settings', () => {
        (<Mock>(<Game>game).settings.get).mockReturnValueOnce({});
        expect(GameSettings.GetObjectSettings(SettingNames.ActiveCalendar)).toEqual({});
    });

    test('Get String Settings', () => {
        (<Mock>(<Game>game).settings.get).mockReturnValueOnce('');
        expect(GameSettings.GetStringSettings(SettingNames.ActiveCalendar)).toBe('');
    });

    test('Get Numeric Settings', () => {
        (<Mock>(<Game>game).settings.get).mockReturnValueOnce(1);
        expect(GameSettings.GetNumericSettings(SettingNames.ActiveCalendar)).toBe(1);
    });

    test('Save Boolean Setting', async () => {
        expect(await GameSettings.SaveBooleanSetting(SettingNames.ActiveCalendar, false)).toBe(false);
        expect(await GameSettings.SaveBooleanSetting(SettingNames.ActiveCalendar, false, false)).toBe(true);
        //@ts-ignore
        game.user.isGM = true;
        expect(await GameSettings.SaveBooleanSetting(SettingNames.ActiveCalendar, false)).toBe(true);
    });

    test('Save String Setting', async () => {
        expect(await GameSettings.SaveStringSetting(SettingNames.ActiveCalendar, '')).toBe(false);
        expect(await GameSettings.SaveStringSetting(SettingNames.ActiveCalendar, '', false)).toBe(true);
        //@ts-ignore
        game.user.isGM = true;
        expect(await GameSettings.SaveStringSetting(SettingNames.ActiveCalendar, '')).toBe(true);
    });

    test('Save Numeric Setting', async () => {
        expect(await GameSettings.SaveNumericSetting(SettingNames.ActiveCalendar, 1)).toBe(false);
        expect(await GameSettings.SaveNumericSetting(SettingNames.ActiveCalendar, 1, false)).toBe(true);
        //@ts-ignore
        game.user.isGM = true;
        expect(await GameSettings.SaveNumericSetting(SettingNames.ActiveCalendar, 1)).toBe(true);
    });

    test('Save Object Setting', async () => {
        expect(await GameSettings.SaveObjectSetting(SettingNames.ActiveCalendar, {})).toBe(false);
        expect(await GameSettings.SaveObjectSetting(SettingNames.ActiveCalendar, {}, false)).toBe(true);
        //@ts-ignore
        game.user.isGM = true;
        expect(await GameSettings.SaveObjectSetting(SettingNames.ActiveCalendar, {})).toBe(true);
    });

    test('UI Notification', () => {
        GameSettings.UiNotification('');
        //@ts-ignore
        expect(ui.notifications.info).toHaveBeenCalledTimes(1);
        GameSettings.UiNotification('', 'warn');
        //@ts-ignore
        expect(ui.notifications.warn).toHaveBeenCalledTimes(1);
        GameSettings.UiNotification('', 'error');
        //@ts-ignore
        expect(ui.notifications.error).toHaveBeenCalledTimes(1);
        GameSettings.UiNotification('', 'asdasd');
        //@ts-ignore
        expect(ui.notifications.info).toHaveBeenCalledTimes(1);
        //@ts-ignore
        expect(ui.notifications.warn).toHaveBeenCalledTimes(1);
        //@ts-ignore
        expect(ui.notifications.error).toHaveBeenCalledTimes(1);

        jest.spyOn(console, 'error').mockImplementation(()=>{});
        const origUi = ui.notifications;
        ui.notifications = undefined;
        GameSettings.UiNotification('');
        expect(console.error).toHaveBeenCalled();
        ui.notifications = origUi;
    });

    test('Get Scene For Combat Check', () => {
        updateSC(new SCController());
        expect(GameSettings.GetSceneForCombatCheck()).toBeNull();
        const origScenes = (<Game>game).scenes;
        //@ts-ignore
        game.scenes = {active: {}, current: {}};
        expect(GameSettings.GetSceneForCombatCheck()).toBeDefined();
        SC.globalConfiguration.combatPauseRule = CombatPauseRules.Current;
        expect(GameSettings.GetSceneForCombatCheck()).toBeDefined();
        //@ts-ignore
        game.scenes = {active: null, current: null};
        expect(GameSettings.GetSceneForCombatCheck()).toBeNull();
        SC.globalConfiguration.combatPauseRule = CombatPauseRules.Active;
        expect(GameSettings.GetSceneForCombatCheck()).toBeNull();

        (<Game>game).scenes = origScenes;
    });
});
