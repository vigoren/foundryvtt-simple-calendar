/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";

import UserPermissions from "./user-permissions";

describe('User Permissions Class Tests', () => {
    let up: UserPermissions;

    beforeEach(() => {
        up = new UserPermissions();
    });

    test('Properties', () => {
        expect(Object.keys(up).length).toBe(8); //Make sure no new properties have been added
        expect(up.viewCalendar).toStrictEqual({player: true, trustedPlayer: true, assistantGameMaster: true, users: undefined});
        expect(up.addNotes).toStrictEqual({player: false, trustedPlayer: false, assistantGameMaster: false, users: undefined});
        expect(up.reorderNotes).toStrictEqual({player: false, trustedPlayer: false, assistantGameMaster: false, users: undefined});
        expect(up.changeDateTime).toStrictEqual({player: false, trustedPlayer: false, assistantGameMaster: false, users: undefined});
    });

    test('Clone Permissions', () => {
        //@ts-ignore
        expect(UserPermissions.clonePermissions({player: true, trustedPlayer: true, assistantGameMaster: true, users: undefined})).toStrictEqual({player: true, trustedPlayer: true, assistantGameMaster: true, users: undefined});
    });

    test('Clone', () => {
        const c = up.clone();
        expect(up).toStrictEqual(c);
    });

    test('To Template', () => {
        const template = up.toTemplate();
        expect(template.id).toBeDefined();
        expect(template.viewCalendar).toStrictEqual(up.viewCalendar);
        expect(template.addNotes).toStrictEqual(up.addNotes);
        expect(template.reorderNotes).toStrictEqual(up.reorderNotes);
        expect(template.changeDateTime).toStrictEqual(up.changeDateTime);

    });
    test('To Config', () => {
        const template = up.toConfig();
        expect(template.id).toBeDefined();
        expect(template.viewCalendar).toStrictEqual(up.viewCalendar);
        expect(template.addNotes).toStrictEqual(up.addNotes);
        expect(template.reorderNotes).toStrictEqual(up.reorderNotes);
        expect(template.changeDateTime).toStrictEqual(up.changeDateTime);
    });

    test('Load From Settings', () => {
        //@ts-ignore
        up.loadFromSettings({});
        expect(up.id).toBeDefined();

        //@ts-ignore
        up.loadFromSettings({viewCalendar: {}, addNotes: {}, changeDateTime: {}, changeActiveCalendar: {}});
        expect(up.id).toBeDefined();
        //@ts-ignore
        up.loadFromSettings({reorderNotes: {player: false, trustedPlayer: false, assistantGameMaster: false, users: undefined}});
        expect(up.reorderNotes).toStrictEqual({player: false, trustedPlayer: false, assistantGameMaster: false, users: undefined});
    });
});
