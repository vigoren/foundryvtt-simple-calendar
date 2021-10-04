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
import Note from "./note";

describe('Handlebars Helpers Tests', () => {

    beforeEach(() => {
        SimpleCalendar.instance = new SimpleCalendar();
    });

    test('Register', () => {
        HandlebarsHelpers.Register();
        expect(Handlebars.registerHelper).toHaveBeenCalledTimes(3);
    });

    test('Date Selector', () => {
        const options: any = {hash:{}};
        expect(HandlebarsHelpers.DateSelector(options)).toBe('');
        SimpleCalendar.instance.settingUpdate();
        options.hash['id'] = 'test';
        expect(HandlebarsHelpers.DateSelector(options)).toBeDefined();
    });

    test('Day Has Notes', () => {
        // @ts-ignore
        game.user.isGM = true;
        const options: any = {hash:{}};
        expect(HandlebarsHelpers.DayHasNotes(options)).toBe('');
        options.hash['day'] = {numericRepresentation: 1};
        expect(HandlebarsHelpers.DayHasNotes(options)).toBe('');
        SimpleCalendar.instance.settingUpdate();
        if(SimpleCalendar.instance.activeCalendar.year){
            SimpleCalendar.instance.activeCalendar.year.months[0].visible = false;
            expect(HandlebarsHelpers.DayHasNotes(options)).toBe('');
            SimpleCalendar.instance.activeCalendar.year.months[0].visible = true;
            expect(HandlebarsHelpers.DayHasNotes(options)).toBeDefined();
            options.hash['day'].numericRepresentation = 2;
            expect(HandlebarsHelpers.DayHasNotes(options)).toBeDefined();

            SimpleCalendar.instance.activeCalendar.notes = [];
            expect(HandlebarsHelpers.DayHasNotes(options)).toBe('');
            for(let i = 0; i < 2; i++){
                var n = new Note()
                n.title = i.toString();
                n.year = SimpleCalendar.instance.activeCalendar.year.numericRepresentation;
                n.month = 1;
                n.day = 2;
                n.endDate.year = n.year;
                n.endDate.month = n.month;
                n.endDate.day = n.day;
                SimpleCalendar.instance.activeCalendar.notes.push(n);
            }
            expect(HandlebarsHelpers.DayHasNotes(options)).toBeDefined();
            SimpleCalendar.instance.activeCalendar.notes = [];
            for(let i = 0; i < 100; i++){
                var n = new Note()
                n.year = SimpleCalendar.instance.activeCalendar.year.numericRepresentation;
                n.month = 1;
                n.day = 2;
                n.endDate.year = n.year;
                n.endDate.month = n.month;
                n.endDate.day = n.day;
                SimpleCalendar.instance.activeCalendar.notes.push(n);
            }
            expect(SimpleCalendar.instance.activeCalendar.notes.length).toBe(100);
            expect(HandlebarsHelpers.DayHasNotes(options)).toBeDefined();

            SimpleCalendar.instance.activeCalendar.notes = [];
            var n = new Note()
            n.year = SimpleCalendar.instance.activeCalendar.year.numericRepresentation;
            n.month = 1;
            n.day = 2;
            n.endDate.year = n.year;
            n.endDate.month = n.month;
            n.endDate.day = n.day;
            n.remindUsers.push('');
            SimpleCalendar.instance.activeCalendar.notes.push(n);
            expect(HandlebarsHelpers.DayHasNotes(options)).toBeDefined();

            SimpleCalendar.instance.activeCalendar.notes = [];
            for(let i = 0; i < 100; i++){
                var n = new Note()
                n.year = SimpleCalendar.instance.activeCalendar.year.numericRepresentation;
                n.month = 1;
                n.day = 2;
                n.endDate.year = n.year;
                n.endDate.month = n.month;
                n.endDate.day = n.day;
                n.remindUsers.push('');
                SimpleCalendar.instance.activeCalendar.notes.push(n);
            }
            expect(SimpleCalendar.instance.activeCalendar.notes.length).toBe(100);
            expect(HandlebarsHelpers.DayHasNotes(options)).toBeDefined();

        } else {
            fail('Current year is not set');
        }

    });

    test('Day Moon Phase', () => {
        const options: any = {hash:{}};
        expect(HandlebarsHelpers.DayMoonPhase(options)).toBe('');
        options.hash['day'] = {numericRepresentation: 1};
        SimpleCalendar.instance.settingUpdate();
        if(SimpleCalendar.instance.activeCalendar.year){
            expect(HandlebarsHelpers.DayMoonPhase(options)).toBeDefined();
            SimpleCalendar.instance.activeCalendar.year.moons[0].phases[0].singleDay = false;
            expect(HandlebarsHelpers.DayMoonPhase(options)).toBeDefined();
        }
    });
});
