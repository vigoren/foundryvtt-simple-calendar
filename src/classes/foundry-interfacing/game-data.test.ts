/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import {jest, beforeEach, describe, expect, test} from '@jest/globals';
import {FoundryVTTGameData} from "./game-data";

describe('FoundryVTT Game Data Class Tests', () => {
    test('World ID', () => {
        expect(FoundryVTTGameData.worldId).toBe('worldId');
    });

    test('System ID', () => {
        expect(FoundryVTTGameData.systemID).toBe('');
    });

    test('System Verions', () => {
        expect(FoundryVTTGameData.systemVersion).toBe('1.2.3');
    });
});
