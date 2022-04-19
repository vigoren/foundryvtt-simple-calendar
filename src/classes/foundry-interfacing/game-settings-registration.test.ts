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
import "../../../__mocks__/dialog";
import "../../../__mocks__/hooks";
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
        expect((<Game>game).settings.registerMenu).toHaveBeenCalledTimes(1);
        expect((<Game>game).settings.register).toHaveBeenCalledTimes(20);
    });
});