/**
 * @jest-environment jsdom
 */
import "../../__mocks__/game";
import "../../__mocks__/form-application";
import "../../__mocks__/application";
import "../../__mocks__/handlebars";
import "../../__mocks__/event";
import "../../__mocks__/crypto";
import "../../__mocks__/dialog";
import SimpleCalendar from "./applications/simple-calendar";
import Year from "./calendar/year";
import SpyInstance = jest.SpyInstance;
import Month from "./calendar/month";
import Macros from "./macros";
import Mock = jest.Mock;

describe('Macros Tests', () => {
    let y: Year;
    let renderSpy: SpyInstance;

    beforeEach(()=>{
        //Spy on console.error calls
        jest.spyOn(console, 'error').mockImplementation();
        jest.spyOn(console, 'warn').mockImplementation();
        //Set up a new Simple Calendar instance
        SimpleCalendar.instance = new SimpleCalendar();
        //Spy on the inherited render function of the new instance
        renderSpy = jest.spyOn(SimpleCalendar.instance, 'render');
        renderSpy.mockClear();
        (<Mock>console.error).mockClear();
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
    });

    test('Macro Show', () => {
        SimpleCalendar.instance.activeCalendar.year = y;
        Macros.show();
        expect(renderSpy).toHaveBeenCalledTimes(1);
        Macros.show(0,1,1);
        expect(renderSpy).toHaveBeenCalledTimes(2);
    });

    test('Set Date Time', () => {
        Macros.setDateTime();
        expect(renderSpy).toHaveBeenCalledTimes(0);

        //@ts-ignore
        game.user.isGM = true;
        SimpleCalendar.instance.activeCalendar.year = y;
        Macros.setDateTime();
        expect(renderSpy).toHaveBeenCalledTimes(1);

        Macros.setDateTime(1, 1, 1, 1, 1, 1);
        expect(renderSpy).toHaveBeenCalledTimes(2);

        //@ts-ignore
        game.user.isGM = false;
    });

    test('Change Date Time', () => {
        Macros.changeDateTime();
        expect(renderSpy).toHaveBeenCalledTimes(0);
        //@ts-ignore
        game.user.isGM = true;
        SimpleCalendar.instance.activeCalendar.year = y;
        Macros.changeDateTime(10);
        expect(renderSpy).toHaveBeenCalledTimes(1);
        //@ts-ignore
        game.user.isGM = false;
    });
});
