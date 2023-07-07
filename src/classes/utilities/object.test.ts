import {deepMerge, isObject, isObjectEmpty} from "./object";
import {jest, beforeEach, describe, expect, test} from '@jest/globals';

describe('Utilities Object Tests', () => {

    test('isObject', () => {
        expect(isObject([])).toBe(false);
        expect(isObject('asd')).toBe(false);
        expect(isObject(true)).toBe(false);
        expect(isObject({})).toBe(true);
        expect(isObject({asd:'asd'})).toBe(true);
    });

    test('isObjectEmpty', () => {
        expect(isObjectEmpty({})).toBe(true);
        expect(isObjectEmpty({asd:'asd'})).toBe(false);
    });

    test('deepMerge', () => {
        let target = deepMerge({}, {"qwe": 12}, {asd: 'asd'});
        expect(Object.keys(target).length).toBe(2);

        target = deepMerge({}, {"qwe": 12}, {asd: {a:1,b:2}});
        expect(target.asd.a).toBe(1);
    });
});
