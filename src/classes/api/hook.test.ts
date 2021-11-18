/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/game";
import "../../../__mocks__/form-application";
import "../../__mocks__/application";
import "../../__mocks__/handlebars";
import "../../__mocks__/event";
import "../../../__mocks__/crypto";
import "../../__mocks__/dialog";
import "../../__mocks__/hooks";
import MainApp from "../applications/main-app";
import Year from "../calendar/year";
import Month from "../calendar/month";
import Hook from "./hook";
import {SimpleCalendarHooks} from "../../constants";
import Mock = jest.Mock;
import Moon from "../calendar/moon";

describe('Hook Tests', () => {
    let y: Year;

    beforeEach(()=>{
        jest.spyOn(console, 'error').mockImplementation();
        MainApp.instance = new MainApp();
        y = new Year(0);
        y.months.push(new Month('M', 1, 0, 5));
        y.months.push(new Month('T', 2, 0, 15));
        y.selectedYear = 0;
        y.visibleYear = 0;
        y.months[0].current = true;
        y.months[0].selected = true;
        y.months[0].visible = true;
        y.months[0].days[0].current = true;
        y.months[0].days[0].selected = true;
        y.moons.push(new Moon('Moon', 10));
        (<Mock>console.error).mockClear();
    });

    test('Emit Date/Time Change', ()=>{
        // @ts-ignore
        MainApp.instance = null;
        Hook.emit(SimpleCalendarHooks.DateTimeChange);
        expect(console.error).toHaveBeenCalledTimes(1);

        Hook.emit(SimpleCalendarHooks.ClockStartStop);
        expect(console.error).toHaveBeenCalledTimes(2);

        MainApp.instance = new MainApp();
        MainApp.instance.activeCalendar.year = y;
        Hook.emit(SimpleCalendarHooks.DateTimeChange);
        expect(console.error).toHaveBeenCalledTimes(2);
        expect(Hooks.callAll).toHaveBeenCalledTimes(1);

        y.months[0].days[0].current = false;
        Hook.emit(SimpleCalendarHooks.DateTimeChange);
        expect(console.error).toHaveBeenCalledTimes(2);
        expect(Hooks.callAll).toHaveBeenCalledTimes(2);

        y.months[0].current = false;
        Hook.emit(SimpleCalendarHooks.DateTimeChange);
        expect(console.error).toHaveBeenCalledTimes(2);
        expect(Hooks.callAll).toHaveBeenCalledTimes(3);

        Hook.emit(SimpleCalendarHooks.ClockStartStop);
        expect(console.error).toHaveBeenCalledTimes(2);
        expect(Hooks.callAll).toHaveBeenCalledTimes(4);

        Hook.emit(SimpleCalendarHooks.PrimaryGM);
        expect(console.error).toHaveBeenCalledTimes(2);
        expect(Hooks.callAll).toHaveBeenCalledTimes(5);

        //@ts-ignore
        Hook.emit('asd');
        expect(console.error).toHaveBeenCalledTimes(2);
        expect(Hooks.callAll).toHaveBeenCalledTimes(6);
    });
});
