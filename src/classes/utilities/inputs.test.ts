/**
 * @jest-environment jsdom
 */

import {jest, beforeEach, describe, expect, test} from '@jest/globals';
import {getCheckBoxGroupValues, getCheckBoxInputValue, getNumericInputValue, getTextInputValue} from "./inputs";

describe('Utilities Inputs Tests', () => {

    test('Get Text Input Value', () => {
        const elm = document.createElement('input');
        elm.value = 'Test';
        jest.spyOn(document, 'querySelector').mockReturnValueOnce(null).mockReturnValueOnce(elm);

        expect(getTextInputValue('.asd', 'Default')).toBe('Default');
        expect(getTextInputValue('.test', 'Default')).toBe('Test');
    });

    test('Get Numeric Input Value', () => {
        const elm = document.createElement('input');
        elm.value = '12';
        jest.spyOn(document, 'querySelector').mockReturnValueOnce(null).mockReturnValueOnce(elm).mockReturnValueOnce(elm);

        expect(getNumericInputValue('.asd', 0)).toBe(0);
        expect(getNumericInputValue('.test', 0)).toBe(12);
        elm.value = '12.34';
        expect(getNumericInputValue('.test', 0, true)).toBe(12.34);
    });

    test('Get CheckBox Input Value', () => {
        const elm = document.createElement('input');
        elm.checked = true
        jest.spyOn(document, 'querySelector').mockReturnValueOnce(null).mockReturnValueOnce(elm).mockReturnValueOnce(elm);

        expect(getCheckBoxInputValue('.asd', false)).toBe(false);
        expect(getCheckBoxInputValue('.test', false)).toBe(true);
        elm.checked = false;
        expect(getCheckBoxInputValue('.test', false)).toBe(false);
    });

    test('Get CheckBox Group Values', () => {
        const elm1 = document.createElement('input');
        elm1.value = 'asd';
        //@ts-ignore
        jest.spyOn(document, 'querySelectorAll').mockReturnValueOnce([elm1]).mockReturnValueOnce([]);
        expect(getCheckBoxGroupValues('asd')).toEqual(['asd']);
        expect(getCheckBoxGroupValues('asd')).toEqual([]);
    });

});
