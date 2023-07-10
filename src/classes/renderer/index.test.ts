/**
 * @jest-environment jsdom
 */
import Renderer from "./index";
import {jest, beforeEach, describe, expect, test} from '@jest/globals';

describe('Renderer Class Tests', () => {
    test('Renderer', () => {
        expect(Renderer.CalendarFull).toBeDefined();
        expect(Renderer.Clock).toBeDefined();
        expect(Renderer.TimeSelector).toBeDefined();
        expect(Renderer.MultiSelect).toBeDefined();
        expect(Renderer.DateTimeControls).toBeDefined();
    });
});
