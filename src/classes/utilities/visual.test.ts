/**
 * @jest-environment jsdom
 */
import {Icons} from "../../constants";
import {animateElement, animateFormGroup, GetContrastColor, GetIcon, timeoutCall} from "./visual";

describe('Utilities Visual Tests', () => {
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