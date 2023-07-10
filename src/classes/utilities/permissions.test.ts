import {canUser} from "./permissions";
import {jest, beforeEach, describe, expect, test} from '@jest/globals';

describe('Utilities Permissions Tests', () => {

    test('Can User', () => {
        let permMatrix =  {player: false, trustedPlayer: false, assistantGameMaster: false, users: undefined};
        const user = {id: 'qwe', isGm: false, hasRole: (i: number) => {return i%3===0;}};
        expect(canUser(null, permMatrix)).toBe(false);
        //@ts-ignore
        expect(canUser(user, permMatrix)).toBe(false);
        permMatrix =  {player: true, trustedPlayer: true, assistantGameMaster: true, users: undefined};
        //@ts-ignore
        expect(canUser(user, permMatrix)).toBe(true);
        //@ts-ignore
        permMatrix =  {player: false, trustedPlayer: false, assistantGameMaster: false, users: ['qwe']};
        //@ts-ignore
        expect(canUser(user, permMatrix)).toBe(true);
        //@ts-ignore
        user.id = null;
        //@ts-ignore
        expect(canUser(user, permMatrix)).toBe(false);
    });
});
