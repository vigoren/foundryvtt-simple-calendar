/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";

import ConfigurationItemBase from "./configuration-item-base";

describe('Configuration Item Base Class Tests', () => {

    beforeEach(() => {

    });

    test('Properties', () => {
        const cib = new ConfigurationItemBase()
        expect(Object.keys(cib).length).toBe(3); //Make sure no new properties have been added
    });

    test('Clone', () => {
        const cib = new ConfigurationItemBase();
        expect(cib.clone()).toStrictEqual(cib);
    });

    test('To Config', () => {
        const cib = new ConfigurationItemBase();
        cib.id = "id";
        expect(cib.toConfig()).toStrictEqual({id: 'id', name: '', numericRepresentation: NaN});
    });

    test('To Template', () => {
        const cib = new ConfigurationItemBase();
        cib.id = "id";
        expect(cib.toTemplate()).toStrictEqual({id: 'id', name: '', numericRepresentation: NaN})
    });

    test('Load From Settings', () => {
        const cib = new ConfigurationItemBase();
        cib.loadFromSettings({id: 'a'});
        expect(cib.id).toBe('a');
        expect(cib.name).toBe('');
        expect(cib.numericRepresentation).toBe(NaN);

        cib.loadFromSettings({id: 'a', name: 'n', numericRepresentation: 1});
        expect(cib.id).toBe('a');
        expect(cib.name).toBe('n');
        expect(cib.numericRepresentation).toBe(1);
    });
});
