/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import {jest, beforeEach, describe, expect, test} from '@jest/globals';
import GameSettingsRegistration from "./game-settings-registration";
import Calendar from "../calendar";
import CalendarManager from "../calendar/calendar-manager";
import {CalManager, updateCalManager, updateSC} from "../index";
import SCController from "../s-c-controller";


describe('Game Settings Registration Class Tests', () => {
    let tCal: Calendar;

    beforeEach(async () => {
        updateCalManager(new CalendarManager());
        updateSC(new SCController());
        tCal = new Calendar('','');
        jest.spyOn(CalManager, 'getActiveCalendar').mockImplementation(() => {return tCal;});
    });

    test('Register Settings', () => {
        GameSettingsRegistration.Register();
        expect((<Game>game).settings.registerMenu).toHaveBeenCalledTimes(2);
        expect((<Game>game).settings.register).toHaveBeenCalledTimes(28);
    });
});
