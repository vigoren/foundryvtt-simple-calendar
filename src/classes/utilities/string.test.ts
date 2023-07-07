/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import {jest, beforeEach, describe, expect, test} from '@jest/globals';
import {compareSemanticVersions, generateUniqueId, ordinalSuffix, PadNumber, randomHash} from "./string";

describe('Utilities String Tests', () => {

    test('Generate Unique Id', () => {
        expect(generateUniqueId()).toBeDefined();
    });

    test('Random Hash', () => {
        expect(randomHash('')).toBe(0);
        expect(randomHash('asd')).not.toBe(0);
    });

    test('Ordinal Suffix', () => {
        jest.spyOn((<Game>game).i18n, 'localize').mockImplementation((a: string) => {
            switch (a){
                case 'FSC.OrdinalSuffix.st':
                    return 'st';
                case 'FSC.OrdinalSuffix.nd':
                    return 'nd';
                case 'FSC.OrdinalSuffix.rd':
                    return 'rd';
                default:
                    return 'th';
            }
        });

        expect(ordinalSuffix(0)).toBe('th');
        expect(ordinalSuffix(1)).toBe('st');
        expect(ordinalSuffix(2)).toBe('nd');
        expect(ordinalSuffix(3)).toBe('rd');
        expect(ordinalSuffix(4)).toBe('th');
        expect(ordinalSuffix(5)).toBe('th');
        expect(ordinalSuffix(6)).toBe('th');
        expect(ordinalSuffix(7)).toBe('th');
        expect(ordinalSuffix(8)).toBe('th');
        expect(ordinalSuffix(9)).toBe('th');
        expect(ordinalSuffix(10)).toBe('th');
        expect(ordinalSuffix(11)).toBe('th');
        expect(ordinalSuffix(12)).toBe('th');
        expect(ordinalSuffix(13)).toBe('th');
        expect(ordinalSuffix(14)).toBe('th');
        expect(ordinalSuffix(21)).toBe('st');
        expect(ordinalSuffix(22)).toBe('nd');
        expect(ordinalSuffix(23)).toBe('rd');
        expect(ordinalSuffix(111)).toBe('th');
        expect(ordinalSuffix(112)).toBe('th');
        expect(ordinalSuffix(113)).toBe('th');
    });

    test('Compare Semantic Versions', () => {
        expect(compareSemanticVersions('1.2.3', '1.2.3')).toBe(0);
        expect(compareSemanticVersions('1.2.3', '1.2.4')).toBe(-1);
        expect(compareSemanticVersions('1.2.3', '1.2.2')).toBe(1);

        expect(compareSemanticVersions('1.2.3', '1.2')).toBe(1);
        expect(compareSemanticVersions('1.2', '1.2.2')).toBe(-1);
    });

    test('Pad Number', () => {
        expect(PadNumber(1)).toBe('01');
        expect(PadNumber(11)).toBe('11');
        expect(PadNumber(11,2)).toBe('011');
        expect(PadNumber(111,2)).toBe('111');
        expect(PadNumber(1111,2)).toBe('1111');
    });

});
