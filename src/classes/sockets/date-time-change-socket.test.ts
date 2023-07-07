/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import {jest, beforeEach, describe, expect, test} from '@jest/globals';
import {DateTimeChangeSocketTypes, PresetTimeOfDay, SocketTypes} from "../../constants";
import Calendar from "../calendar";
import {MainApplication, SC, updateMainApplication, updateSC} from "../index";
import SCController from "../s-c-controller";
import DateTimeChangeSocket from "./date-time-change-socket";
import MainApp from "../applications/main-app";
import * as DateUtils from "../utilities/date-time";

describe('Date Time Change Socket Tests', () => {

    let s: DateTimeChangeSocket;
    let tCal: Calendar;

    beforeEach(() => {
        updateSC(new SCController());
        updateMainApplication(new MainApp());
        tCal = new Calendar('','');
        jest.spyOn(tCal, 'changeDateTime').mockImplementation(() => {return true;});
        jest.spyOn(MainApplication, 'setCurrentDate').mockImplementation(() => {});
        jest.spyOn(DateUtils, 'AdvanceTimeToPreset').mockImplementation(async () => {});
        //@ts-ignore
        game.user.isGM = true;
        SC.primary = true;
        s = new DateTimeChangeSocket();
    });

    test('Initialize', async () => {
        const r = await s.initialize();
        expect(r).toBe(true);
    });

    test('Process', async () => {
        let r = await s.process({type: SocketTypes.mainAppUpdate, data: {}}, tCal);
        expect(r).toBe(false);
        expect(tCal.changeDateTime).not.toHaveBeenCalled();
        expect(MainApplication.setCurrentDate).not.toHaveBeenCalled();

        r = await s.process({type: SocketTypes.dateTimeChange, data: {}}, tCal);
        expect(r).toBe(true);
        expect(tCal.changeDateTime).toHaveBeenCalledTimes(0);
        expect(MainApplication.setCurrentDate).not.toHaveBeenCalled();

        r = await s.process({type: SocketTypes.dateTimeChange, data: {type: DateTimeChangeSocketTypes.changeDateTime, interval: {year: 0, month: 0, day: 0}}}, tCal);
        expect(r).toBe(true);
        expect(tCal.changeDateTime).toHaveBeenCalledTimes(1);
        expect(MainApplication.setCurrentDate).toHaveBeenCalledTimes(0);
        expect(DateUtils.AdvanceTimeToPreset).toHaveBeenCalledTimes(0);

        r = await s.process({type: SocketTypes.dateTimeChange, data: {type: DateTimeChangeSocketTypes.setDate, interval: {year: 0, month: 0, day: 0}}}, tCal);
        expect(r).toBe(true);
        expect(tCal.changeDateTime).toHaveBeenCalledTimes(1);
        expect(MainApplication.setCurrentDate).toHaveBeenCalledTimes(1);
        expect(DateUtils.AdvanceTimeToPreset).toHaveBeenCalledTimes(0);

        r = await s.process({type: SocketTypes.dateTimeChange, data: {type: DateTimeChangeSocketTypes.advanceTimeToPreset, interval: {}, presetTimeOfDay: PresetTimeOfDay.Midday}}, tCal);
        expect(r).toBe(true);
        expect(tCal.changeDateTime).toHaveBeenCalledTimes(1);
        expect(MainApplication.setCurrentDate).toHaveBeenCalledTimes(1);
        expect(DateUtils.AdvanceTimeToPreset).toHaveBeenCalledTimes(1);

    });
});
