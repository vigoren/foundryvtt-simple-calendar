/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/game";
import "../../../__mocks__/form-application";
import "../../__mocks__/application";
import "../../__mocks__/handlebars";
import "../../__mocks__/event";
import "../../../__mocks__/crypto";
import "../../__mocks__/dialog";
import "../../__mocks__/hooks";
import "../../__mocks__/chat-message";

import SimpleCalendar from "../applications/simple-calendar";
import GeneralSettings from "./general-settings";
import {GameWorldTimeIntegrations} from "../../constants";
import UserPermissions from "./user-permissions";

describe('General Settings Class Tests', () => {

    beforeEach(() => {
        SimpleCalendar.instance = new SimpleCalendar();
    });

    test('Properties', () => {
        const gs = new GeneralSettings();

        expect(Object.keys(gs).length).toBe(8); //Make sure no new properties have been added
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
        expect(gs.permissions.addNotes.player).toBe(true);

        gs.loadFromSettings({ id: 'a', gameWorldTimeIntegration: GameWorldTimeIntegrations.Mixed, showClock: true, pf2eSync: true, dateFormat:{date: '', time: '', monthYear: ''}, permissions: new UserPermissions(), playersAddNotes: true });
        expect(gs.id).toBe('a');
        expect(gs.showClock).toBe(true);
        expect(gs.pf2eSync).toBe(true);
    });
});
