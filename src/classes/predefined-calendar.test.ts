/**
 * @jest-environment jsdom
 */
import "../../__mocks__/game";
import "../../__mocks__/form-application";
import "../../__mocks__/application";
import "../../__mocks__/handlebars";
import "../../__mocks__/event";
import "../../__mocks__/dialog";
import "../../__mocks__/hooks";
import "../../__mocks__/crypto";

import SimpleCalendar from "./simple-calendar";
import Year from "./year";
import PredefinedCalendar from "./predefined-calendar";
import {LeapYearRules, PredefinedCalendars} from "../constants";

describe('Predefined Calendar Tests', () => {
    let y: Year;
    SimpleCalendar.instance = new SimpleCalendar();


    beforeEach(()=>{
        y = new Year(0);
    });

    test('Set To Predefined', () => {
        const d = new Date();
        PredefinedCalendar.setToPredefined(y, PredefinedCalendars.Gregorian);
        expect(y.numericRepresentation).toBe(d.getFullYear());
        expect(y.months.length).toBe(12);
        expect(y.weekdays.length).toBe(7);
        expect(y.leapYearRule.rule).toBe(LeapYearRules.Gregorian);
        
        PredefinedCalendar.setToPredefined(y, PredefinedCalendars.DarkSun);
        expect(y.numericRepresentation).toBe(1);
        expect(y.months.length).toBe(15);
        expect(y.weekdays.length).toBe(6);
        expect(y.leapYearRule.rule).toBe(LeapYearRules.None);
        
        PredefinedCalendar.setToPredefined(y, PredefinedCalendars.Eberron);
        expect(y.numericRepresentation).toBe(998);
        expect(y.months.length).toBe(12);
        expect(y.weekdays.length).toBe(7);
        expect(y.leapYearRule.rule).toBe(LeapYearRules.None);
        
        PredefinedCalendar.setToPredefined(y, PredefinedCalendars.Exandrian);
        expect(y.numericRepresentation).toBe(812);
        expect(y.months.length).toBe(11);
        expect(y.weekdays.length).toBe(7);
        expect(y.leapYearRule.rule).toBe(LeapYearRules.None);
        
        PredefinedCalendar.setToPredefined(y, PredefinedCalendars.ForbiddenLands);
        expect(y.numericRepresentation).toBe(1165);
        expect(y.months.length).toBe(8);
        expect(y.weekdays.length).toBe(7);
        expect(y.leapYearRule.rule).toBe(LeapYearRules.None);
        
        PredefinedCalendar.setToPredefined(y, PredefinedCalendars.Harptos);
        expect(y.numericRepresentation).toBe(1495);
        expect(y.months.length).toBe(18);
        expect(y.weekdays.length).toBe(10);
        expect(y.leapYearRule.rule).toBe(LeapYearRules.Custom);
        
        PredefinedCalendar.setToPredefined(y, PredefinedCalendars.GolarianPF1E);
        expect(y.numericRepresentation).toBe(4710);
        expect(y.months.length).toBe(12);
        expect(y.weekdays.length).toBe(7);
        expect(y.leapYearRule.rule).toBe(LeapYearRules.Custom);
        
        PredefinedCalendar.setToPredefined(y, PredefinedCalendars.GolarianPF2E);
        expect(y.numericRepresentation).toBe(4710);
        expect(y.months.length).toBe(12);
        expect(y.weekdays.length).toBe(7);
        expect(y.leapYearRule.rule).toBe(LeapYearRules.Custom);
        
        PredefinedCalendar.setToPredefined(y, PredefinedCalendars.Greyhawk);
        expect(y.numericRepresentation).toBe(591);
        expect(y.months.length).toBe(16);
        expect(y.weekdays.length).toBe(7);
        expect(y.leapYearRule.rule).toBe(LeapYearRules.None);
        
        PredefinedCalendar.setToPredefined(y, PredefinedCalendars.TravellerImperialCalendar);
        expect(y.numericRepresentation).toBe(1000);
        expect(y.months.length).toBe(2);
        expect(y.weekdays.length).toBe(7);
        expect(y.leapYearRule.rule).toBe(LeapYearRules.None);
        
        PredefinedCalendar.setToPredefined(y, PredefinedCalendars.WarhammerImperialCalendar);
        expect(y.numericRepresentation).toBe(2522);
        expect(y.months.length).toBe(18);
        expect(y.weekdays.length).toBe(8);
        expect(y.leapYearRule.rule).toBe(LeapYearRules.None);
    });
});
