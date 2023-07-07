/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import {jest, beforeEach, describe, expect, test} from '@jest/globals';

import Calendar from "../calendar";
import {CalManager, updateCalManager, updateNManager} from "../index";
import CalendarManager from "../calendar/calendar-manager";
import NoteManager from "../notes/note-manager";
import fetchMock from "jest-fetch-mock";
import PredefinedCalendar from "../configuration/predefined-calendar";
import {PredefinedCalendars, TimeSelectorEvents} from "../../constants";
import TimeSelector from "./time-selector";

fetchMock.enableMocks();
describe('Renderer Time Selector Class Tests', () => {
    let tCal: Calendar;

    beforeEach(async () => {
        updateCalManager(new CalendarManager());
        updateNManager(new NoteManager());
        fetchMock.resetMocks();
        fetchMock.mockOnce(`{"calendar":{"currentDate":{"year":2022,"month":2,"day":28,"seconds":0},"general":{"gameWorldTimeIntegration":"mixed","showClock":true,"noteDefaultVisibility":false,"postNoteRemindersOnFoundryLoad":true,"pf2eSync":true,"dateFormat":{"date":"MMMM DD, YYYY","time":"HH:mm:ss","monthYear":"MMMM YAYYYYYZ"}},"leapYear":{"rule":"gregorian","customMod":0},"months":[{"name":"January","abbreviation":"Jan","numericRepresentation":1,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"February","abbreviation":"Feb","numericRepresentation":2,"numericRepresentationOffset":0,"numberOfDays":28,"numberOfLeapYearDays":29,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"March","abbreviation":"Mar","numericRepresentation":3,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"April","abbreviation":"Apr","numericRepresentation":4,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"May","abbreviation":"May","numericRepresentation":5,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"June","abbreviation":"Jun","numericRepresentation":6,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"July","abbreviation":"Jul","numericRepresentation":7,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"August","abbreviation":"Aug","numericRepresentation":8,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"September","abbreviation":"Sep","numericRepresentation":9,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"October","abbreviation":"Oct","numericRepresentation":10,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"November","abbreviation":"Nov","numericRepresentation":11,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"December","abbreviation":"Dec","numericRepresentation":12,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null}],"moons":[{"name":"Moon","cycleLength":29.53059,"firstNewMoon":{"yearReset":"none","yearX":0,"year":2000,"month":1,"day":5},"phases":[{"name":"New Moon","length":1,"icon":"new","singleDay":true},{"name":"Waxing Crescent","length":6.38265,"icon":"waxing-crescent","singleDay":false},{"name":"First Quarter","length":1,"icon":"first-quarter","singleDay":true},{"name":"Waxing Gibbous","length":6.38265,"icon":"waxing-gibbous","singleDay":false},{"name":"Full Moon","length":1,"icon":"full","singleDay":true},{"name":"Waning Gibbous","length":6.38265,"icon":"waning-gibbous","singleDay":false},{"name":"Last Quarter","length":1,"icon":"last-quarter","singleDay":true},{"name":"Waning Crescent","length":6.38265,"icon":"waning-crescent","singleDay":false}],"color":"#ffffff","cycleDayAdjust":0.5}],"noteCategories":[{"name":"Holiday","textColor":"#FFFFFF","color":"#148e94"}],"seasons":[{"name":"Spring","startingMonth":2,"startingDay":19,"color":"#46b946","icon":"spring","sunriseTime":21600,"sunsetTime":64800},{"name":"Summer","startingMonth":5,"startingDay":19,"color":"#e0c40b","icon":"summer","sunriseTime":21600,"sunsetTime":64800},{"name":"Fall","startingMonth":8,"startingDay":21,"color":"#ff8e47","icon":"fall","sunriseTime":21600,"sunsetTime":64800},{"name":"Winter","startingMonth":11,"startingDay":20,"color":"#479dff","icon":"winter","sunriseTime":21600,"sunsetTime":64800}],"time":{"hoursInDay":24,"minutesInHour":60,"secondsInMinute":60,"gameTimeRatio":1,"unifyGameAndClockPause":false,"updateFrequency":1},"weekdays":[{"abbreviation":"Su","name":"Sunday","numericRepresentation":1},{"abbreviation":"Mo","name":"Monday","numericRepresentation":2},{"abbreviation":"Tu","name":"Tuesday","numericRepresentation":3},{"abbreviation":"We","name":"Wednesday","numericRepresentation":4},{"abbreviation":"Th","name":"Thursday","numericRepresentation":5},{"abbreviation":"Fr","name":"Friday","numericRepresentation":6},{"abbreviation":"Sa","name":"Saturday","numericRepresentation":7}],"year":{"numericRepresentation":2022,"prefix":"","postfix":"","showWeekdayHeadings":true,"firstWeekday":4,"yearZero":1970,"yearNames":[],"yearNamingRule":"default","yearNamesStart":0}}}`);
        tCal = new Calendar('','');
        await PredefinedCalendar.setToPredefined(tCal, PredefinedCalendars.Gregorian);
        jest.spyOn(CalManager, 'getActiveCalendar').mockImplementation(() => {return tCal;});
        jest.spyOn(CalManager, 'getCalendar').mockImplementation(() => {return tCal;});
        jest.spyOn(CalManager, 'getAllCalendars').mockImplementation(() => {return [tCal];});
    });

    test('Render', () => {
        expect(TimeSelector.Render(tCal)).toContain('fsc-start-time');
        expect(TimeSelector.Render(tCal, {id:'', allowTimeRange: false})).not.toContain('fsc-start-time');
    });

    test('Render Time Input Group', () => {
        //@ts-ignore
        expect(TimeSelector.RenderTimeInputGroup(tCal)).toContain('fsc-ts-inputs');
    });

    test('Activate Listeners', () => {
        const tsParent = document.createElement('div');
        const tsElm = document.createElement('div');
        const cElm = document.createElement('div');
        tsParent.append(tsElm);
        jest.spyOn(document, 'getElementById').mockReturnValue(tsElm);
        //@ts-ignore
        jest.spyOn(tsElm, 'querySelectorAll').mockReturnValue([cElm]);
        jest.spyOn(cElm, 'addEventListener').mockImplementation(() => {});

        TimeSelector.ActivateListeners('');
        expect(cElm.addEventListener).toHaveBeenCalledTimes(7);
    });

    test('Hide Time Dropdown', () => {
        const tsElm = document.createElement('div');
        const cElm = document.createElement('div');
        jest.spyOn(document, 'getElementById').mockReturnValue(tsElm);
        //@ts-ignore
        jest.spyOn(tsElm, 'querySelectorAll').mockReturnValue([cElm]);

        TimeSelector.HideTimeDropdown('');
        expect(cElm.classList.contains('fsc-hide')).toBe(true);
    });

    test('Change Event Listener', () => {
        const tsElm = document.createElement('div');
        const optInpt = document.createElement('input');
        const targetParentParent = document.createElement('div');
        const targetParent = document.createElement('div');
        const target = document.createElement('input');
        const fEvent = {
            stopPropagation: jest.fn(),
            preventDefault: jest.fn(),
            target: target,
            deltaY: 0
        };
        const onTimeC = jest.fn();
        targetParent.append(target);
        targetParentParent.append(targetParent);
        optInpt.value = "{}";
        target.value = '1';
        target.innerText = '1';
        tsElm.setAttribute('data-calendar', '0');

        jest.spyOn(document, 'getElementById').mockReturnValue(tsElm);
        jest.spyOn(tsElm, 'querySelector').mockReturnValue(optInpt);


        //@ts-ignore
        TimeSelector.ChangeEventListener('', TimeSelectorEvents.wheel, onTimeC, fEvent); //Wheel/Change not NaN target value
        expect(onTimeC).toHaveBeenCalledTimes(1);
        target.value = 'asd';
        fEvent.deltaY = -1;
        //@ts-ignore
        TimeSelector.ChangeEventListener('', TimeSelectorEvents.wheel, onTimeC, fEvent); //Wheel/Change NaN target value
        expect(onTimeC).toHaveBeenCalledTimes(2);

        //@ts-ignore
        TimeSelector.ChangeEventListener('', TimeSelectorEvents.dropdownClick, onTimeC, fEvent); //Dropdown Click not NaN target text
        expect(onTimeC).toHaveBeenCalledTimes(3);
        target.innerText = 'asd';
        //@ts-ignore
        TimeSelector.ChangeEventListener('', TimeSelectorEvents.dropdownClick, onTimeC, fEvent); //Dropdown Click NaN target text
        expect(onTimeC).toHaveBeenCalledTimes(4);


        optInpt.value = "%7B%22allowTimeRange%22%3Atrue%7D";
        target.value = '-1';
        target.classList.add('fsc-ts-hour');
        targetParent.classList.add('fsc-start-time');
        //@ts-ignore
        TimeSelector.ChangeEventListener('', TimeSelectorEvents.change, onTimeC, fEvent); //Time Range, is start, negative hour
        expect(onTimeC).toHaveBeenCalledTimes(5);

        target.classList.remove('fsc-ts-hour');
        //@ts-ignore
        TimeSelector.ChangeEventListener('', TimeSelectorEvents.change, onTimeC, fEvent); //Time Range, is start, negative minute
        expect(onTimeC).toHaveBeenCalledTimes(6);

        target.classList.add('fsc-ts-hour');
        targetParent.classList.remove('fsc-start-time');
        //@ts-ignore
        TimeSelector.ChangeEventListener('', TimeSelectorEvents.change, onTimeC, fEvent); //Time Range, is end, negative hour
        expect(onTimeC).toHaveBeenCalledTimes(7);

        target.classList.remove('fsc-ts-hour');
        //@ts-ignore
        TimeSelector.ChangeEventListener('', TimeSelectorEvents.change, onTimeC, fEvent); //Time Range, is end, negative minute
        expect(onTimeC).toHaveBeenCalledTimes(8);


        optInpt.value = "{}";
        target.value = '90';
        target.classList.add('fsc-ts-hour');
        //@ts-ignore
        TimeSelector.ChangeEventListener('', TimeSelectorEvents.change, onTimeC, fEvent); //Too many hours
        expect(onTimeC).toHaveBeenCalledTimes(9);
        target.classList.remove('fsc-ts-hour');
        //@ts-ignore
        TimeSelector.ChangeEventListener('', TimeSelectorEvents.change, onTimeC, fEvent); //Too many minutes
        expect(onTimeC).toHaveBeenCalledTimes(10);


        tsElm.removeAttribute('data-calendar');
        //@ts-ignore
        TimeSelector.ChangeEventListener('', TimeSelectorEvents.change, onTimeC, fEvent); //Too many minutes
        expect(onTimeC).toHaveBeenCalledTimes(10);
    });

    test('Input Click Event Listener', () => {
        const tsParent = document.createElement('div');
        const tsElm = document.createElement('div');
        const cElm = document.createElement('div');
        tsParent.append(tsElm);
        cElm.classList.add('fsc-hide');
        tsElm.setAttribute('data-list', 'a');
        const fEvent = {
            stopPropagation: jest.fn(),
            target: tsElm
        };

        jest.spyOn(tsParent, 'querySelector').mockReturnValue(cElm);

        expect(cElm.classList.contains('fsc-hide')).toBe(true);
        //@ts-ignore
        TimeSelector.InputClickEventListener('', fEvent);
        expect(cElm.classList.contains('fsc-hide')).toBe(false);
    });
});
