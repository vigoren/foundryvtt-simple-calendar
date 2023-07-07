/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import {jest, beforeEach, describe, expect, test} from '@jest/globals';

import GeneralSettings from "./general-settings";
import {CompactViewDateTimeControlDisplay, GameWorldTimeIntegrations} from "../../constants";

describe('General Settings Class Tests', () => {

    beforeEach(() => {
    });

    test('Properties', () => {
        const gs = new GeneralSettings();

        expect(Object.keys(gs).length).toBe(13); //Make sure no new properties have been added
    });

    test('Clone', () => {
        const gs = new GeneralSettings();
        expect(gs.clone()).toStrictEqual(gs);
    });

    test('To Template', () => {
        const gs = new GeneralSettings();
        const gst = gs.toTemplate();
        expect(gst.id).toBeDefined();
        expect(gst.gameWorldTimeIntegration).toBe(GameWorldTimeIntegrations.Mixed);
    });

    test('To Config', () => {
        const gs = new GeneralSettings();
        const gst = gs.toConfig();
        expect(gst.id).toBeDefined();
        expect(gst.gameWorldTimeIntegration).toBe(GameWorldTimeIntegrations.Mixed);
    });

    test('Load From Settings', () => {
        const gs = new GeneralSettings();
        let oID = gs.id;
        //@ts-ignore
        gs.loadFromSettings({});
        expect(gs.id).toBe(oID);

        //@ts-ignore
        gs.loadFromSettings({id:'a'});
        expect(gs.id).toBe('a');

        //@ts-ignore
        gs.loadFromSettings({ id: 'a', gameWorldTimeIntegration: GameWorldTimeIntegrations.Mixed, playersAddNotes: true });
        expect(gs.id).toBe('a');

        gs.loadFromSettings({ id: 'a', gameWorldTimeIntegration: GameWorldTimeIntegrations.Mixed, showClock: true, pf2eSync: true, dateFormat:{date: '', time: '', monthYear: '', chatTime: ''}, playersAddNotes: true, noteDefaultVisibility: true, postNoteRemindersOnFoundryLoad: true, compactViewOptions:{controlLayout: CompactViewDateTimeControlDisplay.Full} });
        expect(gs.id).toBe('a');
        expect(gs.showClock).toBe(true);
        expect(gs.pf2eSync).toBe(true);
    });
});
