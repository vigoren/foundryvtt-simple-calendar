/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import Calendar from "../calendar";
import MainApp from "./main-app";
import {
    CalManager,
    ConfigurationApplication,
    NManager,
    SC,
    updateCalManager, updateConfigurationApplication,
    updateMainApplication,
    updateNManager,
    updateSC
} from "../index";
import CalendarManager from "../calendar/calendar-manager";
import SCController from "../s-c-controller";
import NoteManager from "../notes/note-manager";
import fetchMock from "jest-fetch-mock";
import PredefinedCalendar from "../configuration/predefined-calendar";
import {CalendarClickEvents, DateTimeUnits, PredefinedCalendars} from "../../constants";
import * as PermUtilities from "../utilities/permissions";
import * as VisualUtilities from "../utilities/visual";
import * as DateUtilities from "../utilities/date-time";
import {GameSettings} from "../foundry-interfacing/game-settings";
import GameSockets from "../foundry-interfacing/game-sockets";
import ConfigurationApp from "./configuration-app";

fetchMock.enableMocks();
describe('Main App Class Tests', () => {
    let tCal: Calendar;
    let vCal: Calendar;
    let ma: MainApp;

    beforeEach(async () => {
        updateCalManager(new CalendarManager());
        updateSC(new SCController());
        updateMainApplication(new MainApp());
        updateNManager(new NoteManager());
        updateConfigurationApplication(new ConfigurationApp());

        tCal = new Calendar('a','');
        vCal = new Calendar('b','');

        jest.spyOn(CalManager, 'getActiveCalendar').mockImplementation(() => {return tCal;});
        jest.spyOn(CalManager, 'getVisibleCalendar').mockImplementation(() => {return tCal;});
        jest.spyOn(CalManager, 'getAllCalendars').mockImplementation(() => {return [tCal];});

        fetchMock.resetMocks();
        fetchMock.mockOnce(`{"calendar":{"currentDate":{"year":2022,"month":2,"day":28,"seconds":0},"general":{"gameWorldTimeIntegration":"mixed","showClock":true,"noteDefaultVisibility":false,"postNoteRemindersOnFoundryLoad":true,"pf2eSync":true,"dateFormat":{"date":"MMMM DD, YYYY","time":"HH:mm:ss","monthYear":"MMMM YAYYYYYZ"}},"leapYear":{"rule":"gregorian","customMod":0},"months":[{"name":"January","abbreviation":"Jan","numericRepresentation":1,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"February","abbreviation":"Feb","numericRepresentation":2,"numericRepresentationOffset":0,"numberOfDays":28,"numberOfLeapYearDays":29,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"March","abbreviation":"Mar","numericRepresentation":3,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"April","abbreviation":"Apr","numericRepresentation":4,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"May","abbreviation":"May","numericRepresentation":5,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"June","abbreviation":"Jun","numericRepresentation":6,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"July","abbreviation":"Jul","numericRepresentation":7,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"August","abbreviation":"Aug","numericRepresentation":8,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"September","abbreviation":"Sep","numericRepresentation":9,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"October","abbreviation":"Oct","numericRepresentation":10,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"November","abbreviation":"Nov","numericRepresentation":11,"numericRepresentationOffset":0,"numberOfDays":30,"numberOfLeapYearDays":30,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null},{"name":"December","abbreviation":"Dec","numericRepresentation":12,"numericRepresentationOffset":0,"numberOfDays":31,"numberOfLeapYearDays":31,"intercalary":false,"intercalaryInclude":false,"startingWeekday":null}],"moons":[{"name":"Moon","cycleLength":29.53059,"firstNewMoon":{"yearReset":"none","yearX":0,"year":2000,"month":1,"day":5},"phases":[{"name":"New Moon","length":1,"icon":"new","singleDay":true},{"name":"Waxing Crescent","length":6.38265,"icon":"waxing-crescent","singleDay":false},{"name":"First Quarter","length":1,"icon":"first-quarter","singleDay":true},{"name":"Waxing Gibbous","length":6.38265,"icon":"waxing-gibbous","singleDay":false},{"name":"Full Moon","length":1,"icon":"full","singleDay":true},{"name":"Waning Gibbous","length":6.38265,"icon":"waning-gibbous","singleDay":false},{"name":"Last Quarter","length":1,"icon":"last-quarter","singleDay":true},{"name":"Waning Crescent","length":6.38265,"icon":"waning-crescent","singleDay":false}],"color":"#ffffff","cycleDayAdjust":0.5}],"noteCategories":[{"name":"Holiday","textColor":"#FFFFFF","color":"#148e94"}],"seasons":[{"name":"Spring","startingMonth":2,"startingDay":19,"color":"#46b946","icon":"spring","sunriseTime":21600,"sunsetTime":64800},{"name":"Summer","startingMonth":5,"startingDay":19,"color":"#e0c40b","icon":"summer","sunriseTime":21600,"sunsetTime":64800},{"name":"Fall","startingMonth":8,"startingDay":21,"color":"#ff8e47","icon":"fall","sunriseTime":21600,"sunsetTime":64800},{"name":"Winter","startingMonth":11,"startingDay":20,"color":"#479dff","icon":"winter","sunriseTime":21600,"sunsetTime":64800}],"time":{"hoursInDay":24,"minutesInHour":60,"secondsInMinute":60,"gameTimeRatio":1,"unifyGameAndClockPause":false,"updateFrequency":1},"weekdays":[{"abbreviation":"Su","name":"Sunday","numericRepresentation":1},{"abbreviation":"Mo","name":"Monday","numericRepresentation":2},{"abbreviation":"Tu","name":"Tuesday","numericRepresentation":3},{"abbreviation":"We","name":"Wednesday","numericRepresentation":4},{"abbreviation":"Th","name":"Thursday","numericRepresentation":5},{"abbreviation":"Fr","name":"Friday","numericRepresentation":6},{"abbreviation":"Sa","name":"Saturday","numericRepresentation":7}],"year":{"numericRepresentation":2022,"prefix":"","postfix":"","showWeekdayHeadings":true,"firstWeekday":4,"yearZero":1970,"yearNames":[],"yearNamingRule":"default","yearNamesStart":0}}}`);
        await PredefinedCalendar.setToPredefined(tCal, PredefinedCalendars.Gregorian);

        ma = new MainApp();

        //@ts-ignore
        game.user.isGM = false;
        SC.primary = false;
    });

    test('Active Calendar', () => {
        //@ts-ignore
        expect(ma.activeCalendar).toEqual(tCal);
    });

    test('Visible Calendar', () => {
        //@ts-ignore
        expect(ma.visibleCalendar).toEqual(tCal);
    });

    test('Default Options', () => {
        expect(MainApp.defaultOptions).toBeDefined();
    });

    test('Get Data', () => {

        tCal.months[0].selected = true;
        tCal.months[0].days[0].selected = true;
        expect(ma.getData()).toBeDefined();

        tCal.generalSettings.showClock = false;
        expect(ma.getData()).toBeDefined();

        jest.spyOn(PermUtilities, 'canUser').mockReturnValue(true);
        jest.spyOn(CalManager, 'getActiveCalendar').mockImplementation(() => {return vCal;});
        ma.uiElementStates.compactView = true;
        expect(ma.getData()).toBeDefined();
    });

    test('Show App', () => {
        jest.spyOn(ma, 'render').mockImplementation(() => {});

        ma.showApp();
        expect(ma.render).toHaveBeenCalledTimes(0);

        jest.spyOn(PermUtilities, 'canUser').mockReturnValue(true);
        jest.spyOn(GameSettings, 'GetBooleanSettings').mockReturnValue(true);
        jest.spyOn(GameSettings, 'GetObjectSettings').mockReturnValue({top:1, left: 1});
        ma.showApp();
        expect(ma.render).toHaveBeenCalledTimes(1);
    });

    test('minimize', async () => {
        await ma.minimize();
        expect(ma.uiElementStates.compactView).toBe(true);
    });

    test('maximize', async () => {
        await ma.maximize();
        expect(ma.uiElementStates.compactView).toBe(false);
    });

    test('Set Width Height', () => {
        const mainApp = document.createElement('div');
        const header = document.createElement('div');
        const wrapper = document.createElement('div');
        const wrapperChild = document.createElement('div');
        const wrapperChildChild = document.createElement('div');

        header.classList.add('window-header');
        wrapper.classList.add('fsc-main-wrapper');
        mainApp.append(header);
        mainApp.append(wrapper);
        wrapperChild.append(wrapperChildChild);

        jest.spyOn(document, 'querySelector').mockReturnValue(mainApp);
        jest.spyOn(ma, 'setPosition').mockImplementation(() => {});
        jest.spyOn(wrapper, 'querySelector').mockReturnValue(wrapperChild);
        //@ts-ignore
        jest.spyOn(wrapper, 'querySelectorAll').mockReturnValue([wrapperChild]);

        ma.setWidthHeight();
        expect(ma.setPosition).toHaveBeenCalledTimes(1);

        ma.uiElementStates.compactView = true;
        ma.setWidthHeight();
        expect(ma.setPosition).toHaveBeenCalledTimes(2);
    });

    test('Ensure Current Date Is Visible', () => {
        const mainApp = document.createElement('div');
        const currentDay = document.createElement('div');
        const selectedDay = document.createElement('div');
        jest.spyOn(document, 'querySelector').mockReturnValue(mainApp);
        jest.spyOn(mainApp, 'querySelector').mockReturnValueOnce(currentDay);
        jest.spyOn(mainApp, 'offsetHeight', 'get').mockReturnValue(600);
        jest.spyOn(mainApp, 'getBoundingClientRect').mockReturnValue({top: 50, left: 50, bottom: 650, right: 250, height: 600, width: 200, x: 50, y: 50, toJSON: () => {return ''}});
        jest.spyOn(currentDay, 'getBoundingClientRect').mockReturnValue({top: 50, left: 50, bottom: 650, right: 350, height: 600, width: 300, x: 50, y: 50, toJSON: () => {return ''}});
        jest.spyOn(selectedDay, 'getBoundingClientRect').mockReturnValue({top: 50, left: 50, bottom: 650, right: 250, height: 600, width: 200, x: 50, y: 50, toJSON: () => {return ''}});

        ma.ensureCurrentDateIsVisible(); //Current day
        expect(mainApp.scrollTop).toBe(-300);

        mainApp.scrollTop = 0;
        jest.spyOn(mainApp, 'querySelector').mockReturnValueOnce(currentDay).mockReturnValueOnce(selectedDay);
        ma.ensureCurrentDateIsVisible(); //Selected day
        expect(mainApp.scrollTop).toBe(0);
    });

    test('App Drag Move', () => {
        ma.appDragMove(new Event('drag'));
    });

    test('App Drag End', () => {
        const mainApp = document.createElement('div');
        jest.spyOn(document, 'getElementById').mockReturnValue(mainApp);
        jest.spyOn(GameSettings, 'SaveObjectSetting').mockImplementation(async () => {return true;});
        ma.appDragEnd(new Event('drag'));
        expect(GameSettings.SaveObjectSetting).toHaveBeenCalledTimes(1);
    });

    test('Activate Listeners', () => {
        const mainApp = document.createElement('div');
        const elm = document.createElement('div');
        jest.spyOn(document, 'getElementById').mockReturnValue(mainApp);
        jest.spyOn(mainApp, 'querySelector').mockReturnValue(elm);
        //@ts-ignore
        jest.spyOn(mainApp, 'querySelectorAll').mockReturnValue([elm]);
        jest.spyOn(ma, 'setWidthHeight').mockImplementation(() => {});
        jest.spyOn(ma, 'ensureCurrentDateIsVisible').mockImplementation(() => {});

        ma.activateListeners();
        expect(mainApp.classList.contains('fsc-compact-view')).toBe(false);

        ma.uiElementStates.compactView = true;
        ma.activateListeners();
        expect(mainApp.classList.contains('fsc-compact-view')).toBe(true);
    });

    test('Toggle Drawers', () => {
        const elm = document.createElement('div');
        jest.spyOn(ma, 'hideDrawers').mockImplementation(() => {});
        jest.spyOn(ma, 'searchOptionsToggle').mockImplementation(() => {});
        jest.spyOn(VisualUtilities, 'animateElement').mockImplementation(() => {return true;});
        jest.spyOn(document, 'querySelector').mockReturnValue(elm);

        ma.toggleDrawer('fsc-calendar-list');
        expect(ma.uiElementStates["fsc-calendar-list"]).toBe(true);

    });

    test('Hide Drawers', () => {
        const clElm = document.createElement('div');
        const nlElm = document.createElement('div');
        const nsElm = document.createElement('div');
        //@ts-ignore
        jest.spyOn(document,'querySelectorAll').mockReturnValue([clElm,nlElm,nsElm]);
        clElm.classList.add('fsc-side-drawer','fsc-calendar-list');
        nlElm.classList.add('fsc-side-drawer','fsc-note-list');
        nsElm.classList.add('fsc-side-drawer','fsc-note-search');
        ma.uiElementStates["fsc-calendar-list"] = true;
        ma.uiElementStates["fsc-note-list"] = true;
        ma.uiElementStates["fsc-note-search"] = true;

        ma.hideDrawers('fsc-note-search');
        expect(ma.uiElementStates["fsc-calendar-list"]).toBe(false);
        expect(ma.uiElementStates["fsc-note-list"]).toBe(false);
        expect(ma.uiElementStates["fsc-note-search"]).toBe(true);

        ma.uiElementStates["fsc-calendar-list"] = true;
        ma.uiElementStates["fsc-note-list"] = true;
        ma.uiElementStates["fsc-note-search"] = true;
        ma.hideDrawers();
        expect(ma.uiElementStates["fsc-calendar-list"]).toBe(false);
        expect(ma.uiElementStates["fsc-note-list"]).toBe(false);
        expect(ma.uiElementStates["fsc-note-search"]).toBe(false);
    });

    test('Toggle Unit Selector', () => {
        const elm = document.createElement('div');
        jest.spyOn(document, 'querySelector').mockReturnValue(elm);
        jest.spyOn(VisualUtilities, 'animateElement').mockImplementation(() => {return true;});
        ma.toggleUnitSelector();
        expect(ma.uiElementStates.dateTimeUnitOpen).toBe(true);
    });

    test('Change Unit', () => {
        const target = document.createElement('div');
        target.setAttribute('data-unit', 'year');

        const fEvent = {currentTarget: target};
        jest.spyOn(ma, "updateApp").mockImplementation(() => {});

        //@ts-ignore
        ma.changeUnit(fEvent);
        expect(ma.uiElementStates.dateTimeUnit).toBe(DateTimeUnits.Year);
        expect(ma.updateApp).toHaveBeenCalledTimes(1);

        target.setAttribute('data-unit', 'month');
        //@ts-ignore
        ma.changeUnit(fEvent);
        expect(ma.uiElementStates.dateTimeUnit).toBe(DateTimeUnits.Month);
        expect(ma.updateApp).toHaveBeenCalledTimes(2);

        target.setAttribute('data-unit', 'day');
        //@ts-ignore
        ma.changeUnit(fEvent);
        expect(ma.uiElementStates.dateTimeUnit).toBe(DateTimeUnits.Day);
        expect(ma.updateApp).toHaveBeenCalledTimes(3);

        target.setAttribute('data-unit', 'hour');
        //@ts-ignore
        ma.changeUnit(fEvent);
        expect(ma.uiElementStates.dateTimeUnit).toBe(DateTimeUnits.Hour);
        expect(ma.updateApp).toHaveBeenCalledTimes(4);

        target.setAttribute('data-unit', 'minute');
        //@ts-ignore
        ma.changeUnit(fEvent);
        expect(ma.uiElementStates.dateTimeUnit).toBe(DateTimeUnits.Minute);
        expect(ma.updateApp).toHaveBeenCalledTimes(5);

        target.setAttribute('data-unit', 'round');
        //@ts-ignore
        ma.changeUnit(fEvent);
        expect(ma.uiElementStates.dateTimeUnit).toBe(DateTimeUnits.Round);
        expect(ma.updateApp).toHaveBeenCalledTimes(6);

        target.setAttribute('data-unit', 'seconds');
        //@ts-ignore
        ma.changeUnit(fEvent);
        expect(ma.uiElementStates.dateTimeUnit).toBe(DateTimeUnits.Second);
        expect(ma.updateApp).toHaveBeenCalledTimes(7);
    });

    test('Change Calendar', () => {
        const target = document.createElement('div');
        const wrapper = document.createElement('div');
        const fEvent = {
            currentTarget: target
        };

        wrapper.setAttribute('data-calid', '123');

        jest.spyOn(GameSettings, 'UiNotification').mockImplementation(() => {});
        jest.spyOn(GameSockets, 'emit').mockImplementation(async () => {return true});
        jest.spyOn(target, 'closest').mockReturnValue(wrapper);
        jest.spyOn(CalManager, 'setActiveCalendar').mockImplementation(() => {});
        jest.spyOn(CalManager, 'setVisibleCalendar').mockImplementation(() => {});

        //@ts-ignore
        game.user.isGM = true;
        //@ts-ignore
        ma.changeCalendar(false, fEvent);
        expect(CalManager.setActiveCalendar).toHaveBeenCalledTimes(0);
        expect(GameSettings.UiNotification).toHaveBeenCalledTimes(1);

        //@ts-ignore
        jest.spyOn(game.users, 'find').mockImplementation((v: any)=>{return v.call(undefined, {isGM: true, active: true})});
        //@ts-ignore
        ma.changeCalendar(false, fEvent);
        expect(GameSockets.emit).toHaveBeenCalledTimes(1);

        SC.primary = true;
        //@ts-ignore
        ma.changeCalendar(false, fEvent);
        expect(CalManager.setActiveCalendar).toHaveBeenCalledTimes(1);

        //@ts-ignore
        ma.changeCalendar(true, fEvent);
        expect(CalManager.setVisibleCalendar).toHaveBeenCalledTimes(1);
    });

    test('Change Month', () => {
        jest.spyOn(ma, 'toggleUnitSelector').mockImplementation(() => {});
        jest.spyOn(ma, 'setWidthHeight').mockImplementation(() => {});
        jest.spyOn(tCal, 'changeMonth').mockImplementation(() => {});

        ma.changeMonth(CalendarClickEvents.next, {id: ''});
        expect(ma.toggleUnitSelector).toHaveBeenCalledTimes(1);
        expect(ma.setWidthHeight).toHaveBeenCalledTimes(1);
        expect(tCal.changeMonth).toHaveBeenCalledTimes(1);

        ma.changeMonth(CalendarClickEvents.previous, {id: ''});
        expect(ma.toggleUnitSelector).toHaveBeenCalledTimes(2);
        expect(ma.setWidthHeight).toHaveBeenCalledTimes(2);
        expect(tCal.changeMonth).toHaveBeenCalledTimes(2);
    });

    test('Day Click', () => {
        jest.spyOn(ma, 'toggleUnitSelector').mockImplementation(() => {});
        jest.spyOn(ma, 'updateApp').mockImplementation(() => {});

        tCal.months[0].selected = true;
        tCal.months[0].days[0].selected = true;

        ma.dayClick({
            id: '',
            selectedDates:{
                start:{
                    day: 0,
                    month: 0,
                    year: 2000
                },
                end:{
                    day: 0,
                    month: 0,
                    year: 2000
                }
            }
        });
        expect(ma.updateApp).toHaveBeenCalledTimes(1);
    });

    test('Today Click', () => {
        jest.spyOn(ma, 'updateApp').mockImplementation(() => {});
        ma.todayClick(new Event('click'));
        expect(ma.updateApp).toHaveBeenCalledTimes(1);
    });

    test('Time Unit Click', () => {
        const target = document.createElement('div');
        const fEvent = {
            currentTarget: target,
            stopPropagation: jest.fn()
        };

        jest.spyOn(GameSettings, 'UiNotification').mockImplementation(() => {});
        jest.spyOn(GameSockets, 'emit').mockImplementation(async () => {return true});
        jest.spyOn(tCal, 'changeDateTime').mockImplementation(() => {return true});
        jest.spyOn(DateUtilities, 'AdvanceTimeToPreset').mockImplementation(async () => {});

        target.setAttribute('data-type', 'round');
        target.setAttribute('data-amount', '1');

        //@ts-ignore
        game.user.isGM = true;

        //@ts-ignore
        ma.timeUnitClick(fEvent);
        expect(GameSettings.UiNotification).toHaveBeenCalledTimes(1);

        //@ts-ignore
        jest.spyOn(game.users, 'find').mockImplementation((v: any)=>{return v.call(undefined, {isGM: true, active: true})});
        target.setAttribute('data-type', 'year');
        //@ts-ignore
        ma.timeUnitClick(fEvent);
        expect(GameSettings.UiNotification).toHaveBeenCalledTimes(1);
        expect(GameSockets.emit).toHaveBeenCalledTimes(1);

        target.setAttribute('data-type', 'midnight');
        target.setAttribute('data-amount', '');
        //@ts-ignore
        ma.timeUnitClick(fEvent);
        expect(GameSettings.UiNotification).toHaveBeenCalledTimes(1);
        expect(GameSockets.emit).toHaveBeenCalledTimes(2);

        //@ts-ignore
        jest.spyOn(game.users, 'find').mockImplementation((v: any)=>{return v.call(undefined, {isGM: false, active: true})});
        //@ts-ignore
        ma.timeUnitClick(fEvent);
        expect(GameSettings.UiNotification).toHaveBeenCalledTimes(2);
        expect(GameSockets.emit).toHaveBeenCalledTimes(2);

        target.setAttribute('data-type', 'year');
        target.setAttribute('data-amount', '1');
        SC.primary = true;
        //@ts-ignore
        ma.timeUnitClick(fEvent);
        expect(GameSettings.UiNotification).toHaveBeenCalledTimes(2);
        expect(GameSockets.emit).toHaveBeenCalledTimes(2);
        expect(tCal.changeDateTime).toHaveBeenCalledTimes(1);

        target.setAttribute('data-type', 'midnight');
        target.setAttribute('data-amount', '');
        //@ts-ignore
        ma.timeUnitClick(fEvent);
        expect(GameSettings.UiNotification).toHaveBeenCalledTimes(2);
        expect(GameSockets.emit).toHaveBeenCalledTimes(2);
        expect(tCal.changeDateTime).toHaveBeenCalledTimes(1);
        expect(DateUtilities.AdvanceTimeToPreset).toHaveBeenCalledTimes(1);
    });

    test('Date Control Apply', () => {
        jest.spyOn(GameSettings, 'UiNotification').mockImplementation(() => {});
        ma.dateControlApply(new Event('click'));
        expect(GameSettings.UiNotification).toHaveBeenCalledTimes(1);

        const d = new Date();
        jest.spyOn(PermUtilities, 'canUser').mockReturnValue(true);
        jest.spyOn(ma, "setCurrentDate").mockImplementation(() => {});
        tCal.months[d.getMonth()].selected = true;
        tCal.months[d.getMonth()].days[0].selected = true;
        ma.dateControlApply(new Event('click'));
        expect(ma.setCurrentDate).toHaveBeenCalledTimes(1);

        tCal.resetMonths('selected');
        tCal.year.selectedYear = d.getFullYear() + 1;
        tCal.months[0].selected = true;
        tCal.months[0].days[0].selected = true;
        ma.dateControlApply(new Event('click'));
        //@ts-ignore
        expect(global.DialogRenderer).toHaveBeenCalledTimes(1);


        tCal.resetMonths('visible');
        tCal.year.visibleYear = tCal.year.selectedYear;
        tCal.months[0].visible = true;
        ma.dateControlApply(new Event('click'));
        expect(ma.setCurrentDate).toHaveBeenCalledTimes(2);
    });

    test('Set Current Date', () => {
        jest.spyOn(GameSettings, 'UiNotification').mockImplementation(() => {});
        jest.spyOn(GameSockets, 'emit').mockImplementation(async () => {return true});
        jest.spyOn(tCal, "setDateTime").mockImplementation(() => {return true});

        ma.setCurrentDate(0,0,0);
        expect(GameSettings.UiNotification).toHaveBeenCalledTimes(1);

        //@ts-ignore
        jest.spyOn(game.users, 'find').mockImplementation((v: any)=>{return v.call(undefined, {isGM: true, active: true})});
        ma.setCurrentDate(0,0,0);
        expect(GameSockets.emit).toHaveBeenCalledTimes(1);

        //@ts-ignore
        game.user.isGM = true;
        SC.primary = true;
        ma.setCurrentDate(0,0,0);
        expect(tCal.setDateTime).toHaveBeenCalledTimes(1);
    });

    test('Search Click', () => {
        const sb = document.createElement('input');
        sb.value = 'test';
        jest.spyOn(document, 'getElementById').mockReturnValue(sb);
        jest.spyOn(NManager, 'searchNotes').mockImplementation(() => {return []});
        jest.spyOn(ma, 'updateApp').mockImplementation(() => {});

        ma.searchClick();
        expect(ma.search.term).toBe('test');
        expect(NManager.searchNotes).toHaveBeenCalledTimes(1);
        expect(ma.updateApp).toHaveBeenCalledTimes(1);
    });

    test('Search Clear Click', () => {
        ma.search.term = 'test';
        jest.spyOn(ma, 'updateApp').mockImplementation(() => {});

        ma.searchClearClick();
        expect(ma.search.term).toBe('');
        expect(ma.updateApp).toHaveBeenCalledTimes(1);
    });

    test('Search Box Change', () => {
        const sb = document.createElement('input');
        sb.value = 'test';
        const fEvent = {target: sb, key: ''};
        jest.spyOn(ma, 'searchClick').mockImplementation(() => {});

        //@ts-ignore
        ma.searchBoxChange(fEvent);
        expect(ma.search.term).toBe('test');
        expect(ma.searchClick).toHaveBeenCalledTimes(0);

        fEvent.key = "Enter";
        //@ts-ignore
        ma.searchBoxChange(fEvent);
        expect(ma.search.term).toBe('test');
        expect(ma.searchClick).toHaveBeenCalledTimes(1);
    });

    test('Search Option Toggle', () => {
        const elm = document.createElement('div');

        jest.spyOn(document,'querySelector').mockReturnValue(elm);
        jest.spyOn(VisualUtilities, 'animateElement').mockImplementation(() => {return true;});

        ma.searchOptionsToggle();
        expect(ma.uiElementStates.searchOptionsOpen).toBe(true);
    });

    test('Search Option Fields Change', () => {
        const target = document.createElement('input');
        const fEvent = {target: target};

        target.setAttribute('data-field', 'author');
        target.checked = true;

        //@ts-ignore
        ma.searchOptionsFieldsChange(fEvent);
        expect(ma.search.options.fields.author).toBe(true);
    });

    test('Configuration Click', () => {
        jest.spyOn(ConfigurationApplication, 'initializeAndShowDialog').mockImplementation(async () => {});
        ma.configurationClick(new Event('click'));
        expect(ConfigurationApplication.initializeAndShowDialog).toHaveBeenCalledTimes(1);
    });

    test('Add Note', () => {
        jest.spyOn(GameSettings, 'UiNotification').mockImplementation(() => {});
        jest.spyOn(NManager, 'addNewNote').mockImplementation(async () => {});
        const fEvent = {stopPropagation: jest.fn()};

        //@ts-ignore
        ma.addNote(fEvent);
        expect(GameSettings.UiNotification).toHaveBeenCalledTimes(1);

        //@ts-ignore
        jest.spyOn(game.users, 'find').mockImplementation((v: any)=>{return v.call(undefined, {isGM: true, active: true})});
        //@ts-ignore
        ma.addNote(fEvent);
        expect(NManager.addNewNote).toHaveBeenCalledTimes(1);
    });

    test('View Note', () => {
        jest.spyOn(NManager, 'showNote').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});
        const target = document.createElement('div');
        const fEvent = {stopPropagation: jest.fn(), currentTarget: target};

        //@ts-ignore
        ma.viewNote(fEvent);
        expect(console.error).toHaveBeenCalledTimes(1);

        target.setAttribute('data-index', '123');
        //@ts-ignore
        ma.viewNote(fEvent);
        expect(NManager.showNote).toHaveBeenCalledTimes(1);
    });

    test('Update App', () => {
        jest.spyOn(ma, 'render').mockImplementation(() => {});
        ma.updateApp();
        expect(ma.render).toHaveBeenCalledTimes(1);
    });

    test('Start Time', () => {
        jest.spyOn(GameSettings, 'UiNotification').mockImplementation(() => {});
        jest.spyOn(ma, 'updateApp').mockImplementation(() => {});
        jest.spyOn(tCal.timeKeeper, 'start').mockImplementation(() => {});

        ma.startTime();
        expect(ma.updateApp).toHaveBeenCalledTimes(1);
        expect(tCal.timeKeeper.start).toHaveBeenCalledTimes(1);

        //@ts-ignore
        game.scenes = {};
        //@ts-ignore
        game.combats = {size: 1, find:(v: any)=>{return v.call(undefined, {started: true, scene: {id: 's1'}});}};
        ma.startTime();
        expect(GameSettings.UiNotification).toHaveBeenCalledTimes(1);

        //@ts-ignore
        game.scenes = {active:{id:'s1'}};
        ma.startTime();
        expect(GameSettings.UiNotification).toHaveBeenCalledTimes(2);
    });

    test('Stop Time', () => {
        jest.spyOn(tCal.timeKeeper, 'stop').mockImplementation(() => {});
        jest.spyOn(ma, 'updateApp').mockImplementation(() => {});
        ma.stopTime();
        expect(ma.updateApp).toHaveBeenCalledTimes(1);
        expect(tCal.timeKeeper.stop).toHaveBeenCalledTimes(1);
    });

    test('Time Keeping Check', async () => {
        //@ts-ignore
        game.user.isGM = true;
        jest.spyOn(tCal, 'syncTime').mockImplementation(async () => {});

        await ma.timeKeepingCheck();
        expect(tCal.syncTime).toHaveBeenCalledTimes(1);
    });

    test('Note Drag', () => {
        const target = document.createElement('div');
        const sibling = document.createElement('div');
        const targetParent = document.createElement('div');
        targetParent.append(target);
        targetParent.append(sibling);
        targetParent.classList.add('drag-active');

        const fEvent = {target: target};

        document.elementFromPoint = jest.fn().mockReturnValueOnce(null).mockReturnValue(sibling);

        //@ts-ignore
        ma.noteDrag(fEvent);
        expect(targetParent.childNodes[0]).toEqual(target);

        //@ts-ignore
        ma.noteDrag(fEvent);
        expect(targetParent.childNodes[0]).toEqual(sibling);
    });

    test('Note Drag End', () => {
        const target = document.createElement('div');
        const targetParent = document.createElement('div');
        targetParent.append(target);
        target.setAttribute('data-index', 'asd');
        const fEvent = {target: target};

        jest.spyOn(GameSettings, 'UiNotification').mockImplementation(() => {});
        jest.spyOn(GameSockets, 'emit').mockImplementation(async () => {return true});
        jest.spyOn(NManager, 'orderNotesOnDay').mockImplementation(async () => {});

        //@ts-ignore
        ma.noteDragEnd(fEvent);
        expect(GameSettings.UiNotification).toHaveBeenCalledTimes(1);

        //@ts-ignore
        jest.spyOn(game.users, 'find').mockImplementation((v: any)=>{return v.call(undefined, {isGM: true, active: true})});
        //@ts-ignore
        ma.noteDragEnd(fEvent);
        expect(GameSockets.emit).toHaveBeenCalledTimes(1);

        //@ts-ignore
        game.user.isGM = true;
        SC.primary = true;
        //@ts-ignore
        ma.noteDragEnd(fEvent);
        expect(NManager.orderNotesOnDay).toHaveBeenCalledTimes(1);
    });
});