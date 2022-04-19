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
import GameSockets from "../foundry-interfacing/game-sockets";
import CheckClockRunningSocket from "./check-clock-running-socket";
import {SocketTypes} from "../../constants";
import Calendar from "../calendar";
import {SC, updateSC} from "../index";
import SCController from "../s-c-controller";

describe('Check Clock Running Socket Tests', () => {

    let s: CheckClockRunningSocket;
    let tCal: Calendar;

    beforeEach(() => {
        updateSC(new SCController());
        jest.spyOn(GameSockets, 'emit').mockImplementation(async () => {return true;});
        tCal = new Calendar('','');
        //@ts-ignore
        game.user.isGM = true;
        SC.primary = true;
        s = new CheckClockRunningSocket();
    });

    test('Initialize', async () => {
        const r = await s.initialize();
        expect(r).toBe(true);
    });

    test('Process', async () => {
        let r = await s.process({type: SocketTypes.checkClockRunning, data: {}}, tCal);
        expect(r).toBe(true);
        r = await s.process({type: SocketTypes.mainAppUpdate, data: {}}, tCal);
        expect(r).toBe(false);
    });
});