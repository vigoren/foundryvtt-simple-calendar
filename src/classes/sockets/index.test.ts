/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import {jest, beforeEach, describe, expect, test} from '@jest/globals';
import Sockets from "./index";
import {CalManager, MainApplication, updateCalManager, updateMainApplication} from "../index";
import MainApp from "../applications/main-app";
import CalendarManager from "../calendar/calendar-manager";
import Calendar from "../calendar";
import {SocketTypes} from "../../constants";

describe('Sockets Tests', () => {

    beforeEach(() => {
        updateCalManager(new CalendarManager());
        updateMainApplication(new MainApp());

        jest.spyOn(MainApplication, 'updateApp').mockImplementation(() => {});
        const tCal = new Calendar('', '');
        jest.spyOn(CalManager, 'getActiveCalendar').mockReturnValueOnce(tCal);
    });

    test('Constructor', () => {
        const s = new Sockets();

        //@ts-ignore
        expect(s.sockets.length).toBeGreaterThan(0);
    });

    test('Initialize', () => {
        const s = new Sockets();
        //@ts-ignore
        s.sockets.forEach(ss => jest.spyOn(ss, 'initialize').mockImplementation(async () => {return true}));
        s.initialize();
    });

    test('Process', async () => {
        const s = new Sockets();

        await s.process({type: SocketTypes.mainAppUpdate, data: {}});

        expect(MainApplication.updateApp).toHaveBeenCalled();
    });
});
