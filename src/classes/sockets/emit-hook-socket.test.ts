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
import {SimpleCalendarHooks, SocketTypes} from "../../constants";
import Calendar from "../calendar";
import {SC, updateMainApplication, updateSC} from "../index";
import SCController from "../s-c-controller";
import MainApp from "../applications/main-app";
import {Hook} from "../api/hook";
import EmitHookSocket from "./emit-hook-socket";

describe('Date Time Change Socket Tests', () => {

    let s: EmitHookSocket;
    let tCal: Calendar;

    beforeEach(() => {
        updateSC(new SCController());
        updateMainApplication(new MainApp());
        tCal = new Calendar('','');
        jest.spyOn(Hook, 'emit').mockImplementation(() => {});
        //@ts-ignore
        game.user.isGM = true;
        SC.primary = true;
        s = new EmitHookSocket();
    });

    test('Initialize', async () => {
        const r = await s.initialize();
        expect(r).toBe(true);
    });

    test('Process', async () => {
        let r = await s.process({type: SocketTypes.mainAppUpdate, data: {}}, tCal);
        expect(r).toBe(false);
        expect(Hook.emit).not.toHaveBeenCalled();

        r = await s.process({type: SocketTypes.emitHook, data: {}}, tCal);
        expect(r).toBe(true);
        expect(Hook.emit).not.toHaveBeenCalled();

        r = await s.process({type: SocketTypes.emitHook, data: {hook: SimpleCalendarHooks.Ready}}, tCal);
        expect(r).toBe(true);
        expect(Hook.emit).toHaveBeenCalledTimes(1);

    });
});