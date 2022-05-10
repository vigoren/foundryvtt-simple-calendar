/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";

import Calendar from "../calendar";
import {CalManager, NManager, updateCalManager, updateNManager, updateSC} from "../index";
import CalendarManager from "../calendar/calendar-manager";
import NoteManager from "../notes/note-manager";
import fetchMock from "jest-fetch-mock";
import PredefinedCalendar from "../configuration/predefined-calendar";
import {CalendarClickEvents, CalendarViews, PredefinedCalendars} from "../../constants";
import CalendarFull from "./calendar-full";
import Moon from "../calendar/moon";
import Month from "../calendar/month";
import SCController from "../s-c-controller";

fetchMock.enableMocks();
describe('Renderer Calendar Full Class Tests', () => {
    let tCal: Calendar;

    beforeEach(async () => {
        updateCalManager(new CalendarManager());
        updateNManager(new NoteManager());
        updateSC(new SCController());
        fetchMock.resetMocks();
        fetchMock.mockOnce(`{"calendar":{"currentDate":{"year":2022,"month":2,"day":28,"seconds":0},"general":{"gameWorldTimeIntegration":"mixed","showClock":true,"noteDefaultVisibility":false,"postNoteRemindersOnFoundryLoad":true,"pf2eSync":true,"dateFormat":{"date":"MMMM DD, YYYY","time":"HH:mm:ss","monthYear":"MMMM YAYYYYYZ"}},"leapYear":{"rule":"gregorian","customMod":0},"months":[{"name":"January","abbreviation":"Jan","numericRepresentation":1,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"February","abbreviation":"Feb","numericRepresentation":2,"numericRepresentationOffset":0,"numberOfDays":28,"numberOfLeapYearDays":29,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"March","abbreviation":"Mar","numericRepresentation":3,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"April","abbreviation":"Apr","numericRepresentation":4,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"May","abbreviation":"May","numericRepresentation":5,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"June","abbreviation":"Jun","numericRepresentation":6,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"July","abbreviation":"Jul","numericRepresentation":7,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"August","abbreviation":"Aug","numericRepresentation":8,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"September","abbreviation":"Sep","numericRepresentation":9,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"October","abbreviation":"Oct","numericRepresentation":10,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"November","abbreviation":"Nov","numericRepresentation":11,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"December","abbreviation":"Dec","numericRepresentation":12,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null}],"moons":[{"name":"Moon","cycleLength":29.53059,"firstNewMoon":{"yearReset":"none","yearX":0,"year":2000,"month":1,"day":5},"phases":[{"name":"New Moon","length":1,"icon":"new","singleDay":true},{"name":"Waxing Crescent","length":6.38265,"icon":"waxing-crescent","singleDay":false},{"name":"First Quarter","length":1,"icon":"first-quarter","singleDay":true},{"name":"Waxing Gibbous","length":6.38265,"icon":"waxing-gibbous","singleDay":false},{"name":"Full Moon","length":1,"icon":"full","singleDay":true},{"name":"Waning Gibbous","length":6.38265,"icon":"waning-gibbous","singleDay":false},{"name":"Last Quarter","length":1,"icon":"last-quarter","singleDay":true},{"name":"Waning Crescent","length":6.38265,"icon":"waning-crescent","singleDay":false}],"color":"#ffffff","cycleDayAdjust":0.5}],"noteCategories":[{"name":"Holiday","textColor":"#FFFFFF","color":"#148e94"}],"seasons":[{"name":"Spring","startingMonth":2,"startingDay":19,"color":"#46b946","icon":"spring","sunriseTime":21600,"sunsetTime":64800},{"name":"Summer","startingMonth":5,"startingDay":19,"color":"#e0c40b","icon":"summer","sunriseTime":21600,"sunsetTime":64800},{"name":"Fall","startingMonth":8,"startingDay":21,"color":"#ff8e47","icon":"fall","sunriseTime":21600,"sunsetTime":64800},{"name":"Winter","startingMonth":11,"startingDay":20,"color":"#479dff","icon":"winter","sunriseTime":21600,"sunsetTime":64800}],"time":{"hoursInDay":24,"minutesInHour":60,"secondsInMinute":60,"gameTimeRatio":1,"unifyGameAndClockPause":false,"updateFrequency":1},"weekdays":[{"abbreviation":"Su","name":"Sunday","numericRepresentation":1},{"abbreviation":"Mo","name":"Monday","numericRepresentation":2},{"abbreviation":"Tu","name":"Tuesday","numericRepresentation":3},{"abbreviation":"We","name":"Wednesday","numericRepresentation":4},{"abbreviation":"Th","name":"Thursday","numericRepresentation":5},{"abbreviation":"Fr","name":"Friday","numericRepresentation":6},{"abbreviation":"Sa","name":"Saturday","numericRepresentation":7}],"year":{"numericRepresentation":2022,"prefix":"","postfix":"","showWeekdayHeadings":true,"firstWeekday":4,"yearZero":1970,"yearNames":[],"yearNamingRule":"default","yearNamesStart":0}}}`);
        tCal = new Calendar('','');
        await PredefinedCalendar.setToPredefined(tCal, PredefinedCalendars.Gregorian);
        jest.spyOn(CalManager, 'getActiveCalendar').mockImplementation(() => {return tCal;});
        jest.spyOn(CalManager, 'getCalendar').mockImplementation(() => {return tCal;});
    });

    test('Render and Build', () => {
        const d = new Date();
        let HTML = CalendarFull.Render(tCal);
        expect(HTML).toContain('fsc-calendar');
        expect(HTML).toContain(`<span class="fsc-month-year" data-visible="${d.getMonth()}/${d.getFullYear()}">${tCal.months[d.getMonth()].name} ${d.getFullYear()}</span>`);

        tCal.months[2].selected = true;
        tCal.months[2].days[3].selected = true;
        HTML = CalendarFull.Render(tCal, {id: '', showYear: false, showSeasonName: false, allowChangeMonth: false, date: {year: d.getFullYear(), month: 2, day: 3}});
        expect(HTML).toContain('fsc-calendar');
        expect(HTML).toContain(`<span class="fsc-month-year" data-visible="2/${d.getFullYear()}">${tCal.months[2].name} </span>`);

        HTML = CalendarFull.Render(tCal, {id: '', colorToMatchSeason: false, date: {year: d.getFullYear(), month: 2, day: 3}});
        expect(HTML).toContain('fsc-calendar');
        expect(HTML).toContain(`<span class="fsc-month-year" data-visible="2/${d.getFullYear()}">${tCal.months[2].name} ${d.getFullYear()}</span>`);

        HTML = CalendarFull.Render(tCal, {id: '', colorToMatchSeason: false, date: {year: d.getFullYear(), month: 2, day: 3}, selectedDates:{start:{year: d.getFullYear(), month: 2, day: 4}, end:{year: d.getFullYear(), month:2, day: 6}}});
        expect(HTML).toContain('fsc-calendar');
        expect(HTML).toContain(`<span class="fsc-month-year" data-visible="2/${d.getFullYear()}">${tCal.months[2].name} ${d.getFullYear()}</span>`);

        HTML = CalendarFull.Render(tCal, {id: '', colorToMatchSeason: false, date: {year: d.getFullYear(), month: 2, day: 3}, selectedDates:{start:{year: d.getFullYear(), month: -1, day: 0}, end:{year: d.getFullYear(), month:-1, day: 0}}});
        expect(HTML).toContain('fsc-calendar');
        expect(HTML).toContain(`<span class="fsc-month-year" data-visible="2/${d.getFullYear()}">${tCal.months[2].name} ${d.getFullYear()}</span>`);

        //Theme
        HTML = CalendarFull.Render(tCal, {id: '', theme: 'light'});
        expect(HTML).toContain('simple-calendar light');

        //Year View (all months)
        HTML = CalendarFull.Render(tCal, {id: '', view: CalendarViews.Year});
        expect(HTML).toContain('fsc-year-view');
    });

    test('Activate Listeners', () => {
        const cal = document.createElement('div');
        const elm = document.createElement('div');
        jest.spyOn(document, 'getElementById').mockReturnValue(cal);
        jest.spyOn(cal, 'querySelector').mockReturnValue(elm);
        //@ts-ignore
        jest.spyOn(cal, 'querySelectorAll').mockReturnValue([elm]);
        jest.spyOn(CalendarFull, 'EventListener').mockImplementation(() => {});

        CalendarFull.ActivateListeners('');
        expect(document.getElementById).toHaveBeenCalledTimes(1);
        expect(cal.querySelector).toHaveBeenCalledTimes(3);
        expect(cal.querySelectorAll).toHaveBeenCalledTimes(1);

        //@ts-ignore
        elm.dispatchEvent(new Event('click'));
    });

    test('Event Listener', () => {
        const cal = document.createElement('div');
        const optionsElm = document.createElement('input');
        const monthYearElm = document.createElement('div');
        const onMonthC = jest.fn();
        const onDayC = jest.fn();
        const onyearC = jest.fn();

        jest.spyOn(document, 'getElementById').mockReturnValue(cal);
        const elmqs = jest.spyOn(cal, 'querySelector').mockReturnValueOnce(optionsElm).mockReturnValueOnce(monthYearElm);

        optionsElm.value = '{}';
        monthYearElm.setAttribute('data-visible', '2/2022'); //Normal math advance
        CalendarFull.EventListener('', CalendarClickEvents.next, {onMonthChange: onMonthC, onDayClick: null, onYearChange: null}, new Event('click'));
        expect(onMonthC).toHaveBeenCalledTimes(1);

        elmqs.mockReturnValueOnce(optionsElm).mockReturnValueOnce(monthYearElm);
        monthYearElm.setAttribute('data-visible', '11/2019'); //Advance to next year, which is leap year
        CalendarFull.EventListener('', CalendarClickEvents.next, {onMonthChange: onMonthC, onDayClick: null, onYearChange: null}, new Event('click'));
        expect(onMonthC).toHaveBeenCalledTimes(2);

        elmqs.mockReturnValueOnce(optionsElm).mockReturnValueOnce(monthYearElm);
        monthYearElm.setAttribute('data-visible', '11/2019'); //Normal month previous
        CalendarFull.EventListener('', CalendarClickEvents.previous, {onMonthChange: onMonthC, onDayClick: null, onYearChange: null}, new Event('click'));
        expect(onMonthC).toHaveBeenCalledTimes(3);

        elmqs.mockReturnValueOnce(optionsElm).mockReturnValueOnce(monthYearElm);
        monthYearElm.setAttribute('data-visible', '0/2019'); //Month Previous next year
        CalendarFull.EventListener('', CalendarClickEvents.previous, {onMonthChange: onMonthC, onDayClick: null, onYearChange: null}, new Event('click'));
        expect(onMonthC).toHaveBeenCalledTimes(4);

        tCal.months.push(new Month('m1', 13, 0, 0, 0));
        tCal.months.push(new Month('m2', 14, 0, 0, 0));
        elmqs.mockReturnValueOnce(optionsElm).mockReturnValueOnce(monthYearElm);
        monthYearElm.setAttribute('data-visible', '13/2019'); //Too many months
        CalendarFull.EventListener('', CalendarClickEvents.next, {onMonthChange: onMonthC, onDayClick: null, onYearChange: null}, new Event('click'));
        expect(onMonthC).toHaveBeenCalledTimes(5);


        const day = document.createElement('div');
        const fEvent = {
            stopPropagation: () => {},
            target: {closest: () => {return day;}}
        };
        elmqs.mockReturnValueOnce(optionsElm).mockReturnValueOnce(monthYearElm);
        monthYearElm.setAttribute('data-visible', '0/2019'); //Day click no allowed date range
        day.setAttribute('data-day', '2');
        //@ts-ignore
        CalendarFull.EventListener('', CalendarClickEvents.day, {onMonthChange: null, onDayClick: onDayC, onYearChange: null}, fEvent);
        expect(onDayC).toHaveBeenCalledTimes(1);

        elmqs.mockReturnValueOnce(optionsElm).mockReturnValueOnce(monthYearElm);
        optionsElm.value = '%7B%22allowSelectDateRange%22%3A%20true%7D';
        monthYearElm.setAttribute('data-visible', '0/2019'); //Day click, allowed date range, first click
        day.setAttribute('data-day', '2');
        //@ts-ignore
        CalendarFull.EventListener('', CalendarClickEvents.day, {onMonthChange: null, onDayClick: onDayC, onYearChange: null}, fEvent);
        expect(onDayC).toHaveBeenCalledTimes(2);

        elmqs.mockReturnValueOnce(optionsElm).mockReturnValueOnce(monthYearElm);
        optionsElm.value = '%7B%22allowSelectDateRange%22%3A%20true%2C%20%22selectedDates%22%3A%20%7B%22start%22%3A%7B%22year%22%3A2020%2C%20%22month%22%3A0%2C%22day%22%3A0%7D%2C%20%22end%22%3A%7B%22year%22%3Anull%2C%20%22month%22%3A0%2C%22day%22%3A0%7D%7D%7D';
        monthYearElm.setAttribute('data-visible', '0/2019'); //Day click, allowed date range, second click, start year greater than end year
        day.setAttribute('data-day', '4');
        //@ts-ignore
        CalendarFull.EventListener('', CalendarClickEvents.day, {onMonthChange: null, onDayClick: onDayC, onYearChange: null}, fEvent);
        expect(onDayC).toHaveBeenCalledTimes(3);

        elmqs.mockReturnValueOnce(optionsElm).mockReturnValueOnce(monthYearElm);
        optionsElm.value = '%7B%22allowSelectDateRange%22%3A%20true%2C%20%22selectedDates%22%3A%20%7B%22start%22%3A%7B%22year%22%3A2020%2C%20%22month%22%3A2%2C%22day%22%3A0%7D%2C%20%22end%22%3A%7B%22year%22%3Anull%2C%20%22month%22%3A0%2C%22day%22%3A0%7D%7D%7D';
        monthYearElm.setAttribute('data-visible', '0/2019'); //Day click, allowed date range, second click, start month greater than end month
        day.setAttribute('data-day', '4');
        //@ts-ignore
        CalendarFull.EventListener('', CalendarClickEvents.day, {onMonthChange: null, onDayClick: onDayC, onYearChange: null}, fEvent);
        expect(onDayC).toHaveBeenCalledTimes(4);

        elmqs.mockReturnValueOnce(optionsElm).mockReturnValueOnce(monthYearElm);
        optionsElm.value = '%7B%22allowSelectDateRange%22%3A%20true%2C%20%22selectedDates%22%3A%20%7B%22start%22%3A%7B%22year%22%3A2019%2C%20%22month%22%3A0%2C%22day%22%3A10%7D%2C%20%22end%22%3A%7B%22year%22%3Anull%2C%20%22month%22%3A0%2C%22day%22%3A0%7D%7D%7D';
        monthYearElm.setAttribute('data-visible', '0/2019'); //Day click, allowed date range, second click, start day greater than end day
        day.setAttribute('data-day', '4');
        //@ts-ignore
        CalendarFull.EventListener('', CalendarClickEvents.day, {onMonthChange: null, onDayClick: onDayC, onYearChange: null}, fEvent);
        expect(onDayC).toHaveBeenCalledTimes(5);



        const monthYearInput = document.createElement('input');
        elmqs.mockReturnValueOnce(optionsElm).mockReturnValueOnce(monthYearElm);
        jest.spyOn(monthYearElm, 'querySelector').mockReturnValue(monthYearInput);
        monthYearElm.setAttribute('data-visible', '0/2019'); //Month Previous next year
        monthYearInput.value = '2222';
        CalendarFull.EventListener('', CalendarClickEvents.year, {onMonthChange: null, onDayClick: null, onYearChange: onyearC}, new Event('click'));
        expect(onyearC).toHaveBeenCalledTimes(1);

    });

    test('Note Indicator', () => {
        //@ts-ignore
        jest.spyOn(NManager, 'getNotesForDay').mockReturnValue([{title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: false}]);

        expect(CalendarFull.NoteIndicator(tCal, 0, 0, 0)).toBe('<span class="fsc-note-count" title=":\nN2">1</span><span class="fsc-note-count fsc-reminders" title=":\nN1">1</span>');

        //@ts-ignore
        jest.spyOn(NManager, 'getNotesForDay').mockReturnValue([{title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}, {title: 'N1', userReminderRegistered: true}, {title: 'N2', userReminderRegistered: true}]);
        expect(CalendarFull.NoteIndicator(tCal, 0, 0, 0)).toBe('<span class="fsc-note-count fsc-reminders" title="99 ">99</span>');

        //@ts-ignore
        jest.spyOn(NManager, 'getNotesForDay').mockReturnValue([{title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}, {title: 'N1', userReminderRegistered: false}, {title: 'N2', userReminderRegistered: false}]);
        expect(CalendarFull.NoteIndicator(tCal, 0, 0, 0)).toBe('<span class="fsc-note-count" title="99 ">99</span>');
    });

    test('Moon Phase Icons', () => {
        expect(CalendarFull.MoonPhaseIcons(tCal, 0, 0, 0)).toBe('');
        tCal.resetMonths();
        tCal.months[0].current = true;
        tCal.months[0].days[0].current = true;
        expect(CalendarFull.MoonPhaseIcons(tCal, 0, 0, 0)).toBe('<span class="fsc-moon-phase waxing-crescent" title="Moon - Waxing Crescent"></span>');

        tCal.moons.push(new Moon('a'));
        tCal.moons.push(new Moon('b'));
        tCal.moons.push(new Moon('c'));
        expect(CalendarFull.MoonPhaseIcons(tCal, 0, 0, 0)).toContain('fsc-moon-group-wrapper');
        expect(CalendarFull.MoonPhaseIcons(tCal, 0, 0, 0, true, true)).toContain('fsc-left');
    });
});