/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import {jest, beforeEach, describe, expect, test} from '@jest/globals';
import SocketBase from "./socket-base";
import {SocketTypes} from "../../constants";
import Calendar from "../calendar";

describe('Socket Base Tests', () => {
    let s: SocketBase;
    beforeEach(() => {
        s = new SocketBase();
    });

    test('Initialize', async () => {
        const r = await s.initialize();
        expect(r).toBe(true);
    });
    test('Process', async () => {
        const tCal = new Calendar('','');
        const r = await s.process({type: SocketTypes.mainAppUpdate, data: {}}, tCal);
        expect(r).toBe(false);
    });
});
