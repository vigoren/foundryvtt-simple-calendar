/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/game";
import "../../../__mocks__/form-application";
import "../../../__mocks__/application";
import "../../../__mocks__/document-sheet";
import "../../../__mocks__/handlebars";
import "../../../__mocks__/event";
import "../../../__mocks__/crypto";
import "../../../__mocks__/hooks";
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