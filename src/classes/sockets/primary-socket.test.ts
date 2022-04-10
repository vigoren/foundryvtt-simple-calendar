/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/game";
import "../../../__mocks__/form-application";
import "../../../__mocks__/application";
import "../../../__mocks__/journal-sheet";
import "../../../__mocks__/handlebars";
import "../../../__mocks__/event";
import "../../../__mocks__/crypto";
import "../../../__mocks__/hooks";
import {SocketTypes} from "../../constants";
import Calendar from "../calendar";
import {MainApplication, SC, updateMainApplication, updateSC} from "../index";
import SCController from "../s-c-controller";
import MainApp from "../applications/main-app";
import PrimarySocket from "./primary-socket";

describe('Primary Socket Tests', () => {

    let s: PrimarySocket;
    let tCal: Calendar;

    beforeEach(() => {
        updateSC(new SCController());
        updateMainApplication(new MainApp());
        tCal = new Calendar('','');
        jest.spyOn(tCal, 'changeDateTime').mockImplementation(() => {return true;});
        jest.spyOn(MainApplication, 'setCurrentDate').mockImplementation(() => {});
        //@ts-ignore
        game.user.isGM = true;
        SC.primary = true;
        s = new PrimarySocket();
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
        expect(tCal.changeDateTime).toHaveBeenCalledTimes(1);
        expect(MainApplication.setCurrentDate).not.toHaveBeenCalled();

        r = await s.process({type: SocketTypes.dateTimeChange, data: {set: true, interval: {year: 0, month: 0, day: 0}}}, tCal);
        expect(r).toBe(true);
        expect(tCal.changeDateTime).toHaveBeenCalledTimes(1);
        expect(MainApplication.setCurrentDate).toHaveBeenCalledTimes(1);

    });
});