/**
 * @jest-environment jsdom
 */
import "../../__mocks__/game";
import "../../__mocks__/form-application";
import "../../__mocks__/application";
import "../../__mocks__/handlebars";
import "../../__mocks__/event";
import "../../__mocks__/crypto";
import "../../__mocks__/dialog";
import "../../__mocks__/hooks";
import "../../__mocks__/chat-message";

import SimpleCalendar from "./simple-calendar";
import ConfigurationItemBase from "./configuration-item-base";

describe('Configuration Item Base Class Tests', () => {

    beforeEach(() => {
        SimpleCalendar.instance = new SimpleCalendar();
    });

    test('Properties', () => {
        const cib = new ConfigurationItemBase()
        expect(Object.keys(cib).length).toBe(3); //Make sure no new properties have been added
    });

    test('Clone', () => {
        const cib = new ConfigurationItemBase();
        expect(cib.clone()).toStrictEqual(cib);
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
