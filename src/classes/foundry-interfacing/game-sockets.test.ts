/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import {jest, beforeEach, describe, expect, test} from '@jest/globals';
import GameSockets from "./game-sockets";
import {SocketTypes} from "../../constants";

describe('Game Sockets Class Tests', () => {

    test('on', () => {
        const test = jest.fn<()=>{}>();
        const orig = (<Game>game).socket;
        (<Game>game).socket = null;
        GameSockets.on(test);

        (<Game>game).socket = orig;
        GameSockets.on(test);
        expect((<Game>game).socket?.on).toHaveBeenCalled();
    });

    test('emit', async() => {
        const orig = (<Game>game).socket;
        (<Game>game).socket = null;

        let r = await GameSockets.emit({type: SocketTypes.clock, data: {}});
        expect(r).toBe(false);

        (<Game>game).socket = orig;
        r = await GameSockets.emit({type: SocketTypes.clock, data: {}});
        expect(r).toBe(true);
        expect((<Game>game).socket?.emit).toHaveBeenCalled();
    });

});
