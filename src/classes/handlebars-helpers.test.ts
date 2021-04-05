/**
 * @jest-environment jsdom
 */
import "../../__mocks__/handlebars";
import "../../__mocks__/game";
import "../../__mocks__/form-application";
import "../../__mocks__/application";
import "../../__mocks__/event";
import "../../__mocks__/crypto";

import HandlebarsHelpers from "./handlebars-helpers";
import SimpleCalendar from "./simple-calendar";
import {Note} from "./note";

describe('Handlebars Helpers Tests', () => {

    beforeEach(() => {
        SimpleCalendar.instance = new SimpleCalendar();
    });

    test('Register', () => {
        HandlebarsHelpers.Register();
        expect(Handlebars.registerHelper).toHaveBeenCalledTimes(4);
    });

    test('Calendar Width', () => {
        expect(HandlebarsHelpers.CalendarWidth()).toBe('');
        SimpleCalendar.instance.settingUpdate();
        expect(HandlebarsHelpers.CalendarWidth()).toBe('width:52px;');
    });

    test('Calendar Row Width', () => {
        expect(HandlebarsHelpers.CalendarRowWidth()).toBe('');
        SimpleCalendar.instance.settingUpdate();
        expect(HandlebarsHelpers.CalendarRowWidth()).toBe('');
        // @ts-ignore
        game.user.isGM = true;
        expect(HandlebarsHelpers.CalendarRowWidth()).toBe('width:352px;');
        if(SimpleCalendar.instance.currentYear){
            SimpleCalendar.instance.currentYear.generalSettings.showClock = true;
            expect(HandlebarsHelpers.CalendarRowWidth()).toBe('width:550px;');
        }

    });

    test('Day Has Notes', () => {
        const options: any = {hash:{}};
        expect(HandlebarsHelpers.DayHasNotes(options)).toBe('');
        options.hash['day'] = {numericRepresentation: 1};
        expect(HandlebarsHelpers.DayHasNotes(options)).toBe('');
        SimpleCalendar.instance.settingUpdate();
        if(SimpleCalendar.instance.currentYear){
            SimpleCalendar.instance.currentYear.months[0].visible = false;
            expect(HandlebarsHelpers.DayHasNotes(options)).toBe('');
            SimpleCalendar.instance.currentYear.months[0].visible = true;
            expect(HandlebarsHelpers.DayHasNotes(options)).toBe('');
            options.hash['day'].numericRepresentation = 2;
            expect(HandlebarsHelpers.DayHasNotes(options)).toBe(`<span class="note-count" title="1 ">1</span>`);

            for(let i = 0; i < 99; i++){
                var n = new Note()
                n.year = SimpleCalendar.instance.currentYear.numericRepresentation;
                n.month = 1;
                n.day = 2;
                SimpleCalendar.instance.notes.push(n);
            }
            expect(SimpleCalendar.instance.notes.length).toBe(100);
            expect(HandlebarsHelpers.DayHasNotes(options)).toBe(`<span class="note-count" title="99 ">99</span>`);
        } else {
            fail('Current year is not set');
        }

    });

    test('Day Moon Phase', () => {
        const options: any = {hash:{}};
        expect(HandlebarsHelpers.DayMoonPhase(options)).toBe('');
        options.hash['day'] = {numericRepresentation: 1};
        expect(HandlebarsHelpers.DayMoonPhase(options)).toBe('');
        SimpleCalendar.instance.settingUpdate();
        if(SimpleCalendar.instance.currentYear){
            expect(HandlebarsHelpers.DayMoonPhase(options)).toBe('<span class="moon-phase new" title=" - " style="background-color: #ffffff;"></span>');
            SimpleCalendar.instance.currentYear.moons[0].phases[0].singleDay = false;
            expect(HandlebarsHelpers.DayMoonPhase(options)).toBe('');
        }
    });
});
