/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import {jest, beforeEach, describe, expect, test} from '@jest/globals';
import {GameWorldTimeIntegrations, SocketTypes} from "../../constants";
import Calendar from "../calendar";
import {SC, updateMainApplication, updateSC} from "../index";
import SCController from "../s-c-controller";
import ClockSocket from "./clock-socket";
import MainApp from "../applications/main-app";
import Renderer from "../renderer";

describe('Clock Socket Tests', () => {

    let s: ClockSocket;
    let tCal: Calendar;

    beforeEach(() => {
        updateSC(new SCController());
        updateMainApplication(new MainApp());
        tCal = new Calendar('','');
        jest.spyOn(tCal.timeKeeper, 'setStatus').mockImplementation(() => {});
        jest.spyOn(Renderer.Clock, 'UpdateListener').mockImplementation(() => {});
        //@ts-ignore
        game.user.isGM = true;
        SC.primary = true;
        s = new ClockSocket();
    });

    test('Initialize', async () => {
        const r = await s.initialize();
        expect(r).toBe(true);
    });

    test('Process', async () => {
        let r = await s.process({type: SocketTypes.mainAppUpdate, data: {}}, tCal);
        expect(r).toBe(false);
        expect(tCal.timeKeeper.setStatus).not.toHaveBeenCalled();

        r = await s.process({type: SocketTypes.clock, data: {}}, tCal);
        expect(r).toBe(true);
        expect(tCal.timeKeeper.setStatus).toHaveBeenCalledTimes(1);
        expect(Renderer.Clock.UpdateListener).not.toHaveBeenCalled();

        tCal.generalSettings.gameWorldTimeIntegration = GameWorldTimeIntegrations.None;
        r = await s.process({type: SocketTypes.clock, data: {}}, tCal);
        expect(r).toBe(true);
        expect(tCal.timeKeeper.setStatus).toHaveBeenCalledTimes(2);
        expect(Renderer.Clock.UpdateListener).toHaveBeenCalledTimes(1);
    });
});
