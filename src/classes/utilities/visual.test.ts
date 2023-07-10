/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import {jest, beforeEach, afterEach, describe, expect, test} from '@jest/globals';
import {Icons, Themes} from "../../constants";
import {
    animateElement,
    animateFormGroup, CheckRemScaling, ConvertPxBasedOnRemSize,
    GetContrastColor,
    GetIcon,
    GetThemeList,
    GetThemeName, RemSize,
    timeoutCall
} from "./visual";
import {GameSettings} from "../foundry-interfacing/game-settings";

describe('Utilities Visual Tests', () => {
    beforeEach(() => {
        Themes.push({key: 'test', name:'test', system: false, module: true});
    });
    afterEach(() => {
        Themes.pop();
    });
    test('Get Contrast Color', () => {
        expect(GetContrastColor('#ffffff')).toBe('#000000');
        expect(GetContrastColor('#000000')).toBe('#FFFFFF');
        expect(GetContrastColor('#000')).toBe('#FFFFFF');
        expect(GetContrastColor('ffffff')).toBe('#000000');
        expect(GetContrastColor('fffff')).toBe('#000000');
    });

    test('Get Icons', () => {
        //@ts-ignore
        expect(GetIcon()).toBe('');
        expect(GetIcon(Icons.Logo)).toBeDefined();
        expect(GetIcon(Icons.Clock)).toBeDefined();
        expect(GetIcon(Icons.Midday)).toBeDefined();
        expect(GetIcon(Icons.Midnight)).toBeDefined();
        expect(GetIcon(Icons.Sunrise)).toBeDefined();
        expect(GetIcon(Icons.Sunset)).toBeDefined();
        expect(GetIcon(Icons.FirstQuarter, '#ffffff')).toBeDefined();
        expect(GetIcon(Icons.Full, '#ffffff')).toBeDefined();
        expect(GetIcon(Icons.LastQuarter, '#ffffff')).toBeDefined();
        expect(GetIcon(Icons.NewMoon, '#ffffff')).toBeDefined();
        expect(GetIcon(Icons.WaningCrescent, '#ffffff')).toBeDefined();
        expect(GetIcon(Icons.WaningGibbous, '#ffffff')).toBeDefined();
        expect(GetIcon(Icons.WaxingCrescent, '#ffffff')).toBeDefined();
        expect(GetIcon(Icons.WaxingGibbous, '#ffffff')).toBeDefined();
        expect(GetIcon(Icons.Spring)).toBeDefined();
        expect(GetIcon(Icons.Summer)).toBeDefined();
        expect(GetIcon(Icons.Fall)).toBeDefined();
        expect(GetIcon(Icons.Winter)).toBeDefined();
    });

    test('Get Theme Name', () => {
        jest.spyOn(GameSettings, 'GetStringSettings').mockReturnValueOnce('').mockReturnValue('dark');
        expect(GetThemeName()).toBe('dark');

        jest.spyOn(GameSettings, 'GetStringSettings').mockReturnValueOnce('').mockReturnValue('wfrp4e');
        expect(GetThemeName()).toBe('dark');

        jest.spyOn(GameSettings, 'GetStringSettings').mockReturnValueOnce('').mockReturnValue('test');
        //@ts-ignore
        jest.spyOn(game.modules, 'get').mockReturnValue({active: false});
        expect(GetThemeName()).toBe('dark');
    });

    test('Get Theme List', () => {
        let obj = GetThemeList();
        expect(Object.keys(obj).length).toBe(3);

        //@ts-ignore
        game.system.id = 'wfrp4e';
        obj = GetThemeList();
        expect(Object.keys(obj).length).toBe(4);

        jest.spyOn(GameSettings, 'GetStringSettings').mockReturnValueOnce('').mockReturnValue('test');
        //@ts-ignore
        jest.spyOn(game.modules, 'get').mockReturnValue({active: true});
        obj = GetThemeList();
        expect(Object.keys(obj).length).toBe(5);
    });

    test('Convert PX Based On REM Size', () => {
        expect(ConvertPxBasedOnRemSize(16)).toBe(NaN);
    });

    test('Check REM Scaling', () => {
        CheckRemScaling();
        expect(document.body.classList.contains('sc-scale-NaN')).toBe(true);
    });

    test('Animate Element', () => {
        let elm = document.createElement('div');
        expect(animateElement(elm, 0)).toBe(true);
        elm.classList.add('fsc-open');
        elm.classList.remove('fsc-animate');
        expect(animateElement(elm, 0)).toBe(false);
    });

    test('Timeout Call', () => {
        let elm = document.createElement('div');
        timeoutCall(elm, true, 'asd');
        expect(elm.classList.contains('asd')).toBe(true);
        timeoutCall(elm, false, 'asd');
        expect(elm.classList.contains('asd')).toBe(false);
    });

    test('Animate Form Group', () => {
        let elm = document.createElement('div');
        elm.classList.add('form-group');
        jest.spyOn(document,'querySelector').mockReturnValue(elm);

        animateFormGroup('', false);
        expect(elm.classList.contains('fsc-closed')).toBe(true);
        elm.classList.remove('fsc-closed');
        animateFormGroup('', true);
        expect(elm.classList.contains('fsc-open')).toBe(true);
        animateFormGroup('', false);
        elm.classList.remove('fsc-open');
        elm.classList.add('fsc-closed');
        animateFormGroup('', true);
    });
});
