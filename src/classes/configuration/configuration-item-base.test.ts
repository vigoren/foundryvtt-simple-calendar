/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import {jest, beforeEach, describe, expect, test} from '@jest/globals';

import ConfigurationItemBase from "./configuration-item-base";

describe('Configuration Item Base Class Tests', () => {

    beforeEach(() => {

    });

    test('Properties', () => {
        const cib = new ConfigurationItemBase()
        expect(Object.keys(cib).length).toBe(6); //Make sure no new properties have been added
    });

    test('Clone', () => {
        const cib = new ConfigurationItemBase();
        expect(cib.clone()).toStrictEqual(cib);
    });

    test('To Config', () => {
        const cib = new ConfigurationItemBase();
        cib.id = "id";
        expect(cib.toConfig()).toStrictEqual({abbreviation:'',description:'',id: 'id', name: '', numericRepresentation: NaN});
    });

    test('To Template', () => {
        const cib = new ConfigurationItemBase();
        cib.id = "id";
        expect(cib.toTemplate()).toStrictEqual({abbreviation:'',description:'',id: 'id', name: '', numericRepresentation: NaN, showAdvanced: false})
    });

    test('Load From Settings', () => {
        const cib = new ConfigurationItemBase();
        cib.loadFromSettings({id: 'a'});
        expect(cib.id).toBe('a');
        expect(cib.name).toBe('');
        expect(cib.numericRepresentation).toBe(NaN);

        cib.loadFromSettings({id: 'a', name: 'n', numericRepresentation: 1, description: 'd'});
        expect(cib.id).toBe('a');
        expect(cib.name).toBe('n');
        expect(cib.numericRepresentation).toBe(1);
        expect(cib.description).toBe('d');
    });
});
