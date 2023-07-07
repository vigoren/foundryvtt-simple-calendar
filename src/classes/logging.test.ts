import {Logger} from "./logging";
import {jest, beforeEach, describe, expect, test} from '@jest/globals';

describe('Logging Tests', () => {
    test('Debug', () => {
        jest.spyOn(console, 'debug').mockImplementation(()=>{});
        Logger.debug('Test');
        Logger.debug('');
        expect(console.debug).toHaveBeenCalledTimes(0);
        Logger.debugMode = true;
        Logger.debug('Test');
        Logger.debug('');
        expect(console.debug).toHaveBeenCalledTimes(1);
    });
    test('Info', () => {
        jest.spyOn(console, 'info').mockImplementation(()=>{});
        Logger.info('Test');
        Logger.info('');
        expect(console.info).toHaveBeenCalledTimes(1);
    });
    test('Warn', () => {
        jest.spyOn(console, 'warn').mockImplementation(()=>{});
        Logger.warn('Test');
        Logger.warn('');
        expect(console.warn).toHaveBeenCalledTimes(1);
    });
    test('Error', () => {
        jest.spyOn(console, 'error').mockImplementation(()=>{});
        Logger.error('Test');
        Logger.error(new Error('Test'));
        expect(console.error).toHaveBeenCalledTimes(2);
    });
});
