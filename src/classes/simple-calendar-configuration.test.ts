/**
 * @jest-environment jsdom
 */
import "../../__mocks__/game";
import "../../__mocks__/form-application";
import "../../__mocks__/application";
import "../../__mocks__/handlebars";
import "../../__mocks__/event";
import "../../__mocks__/dialog";

import {SimpleCalendarConfiguration} from "./simple-calendar-configuration";
import Year from "./year";
import SpyInstance = jest.SpyInstance;
import Mock = jest.Mock;
import Month from "./month";
import {Weekday} from "./weekday";
import {Logger} from "./logging";
import {LeapYearRules} from "../constants";

jest.mock('./importer');


describe('Simple Calendar Configuration Tests', () => {
    let y: Year;
    let renderSpy: SpyInstance;
    Logger.debugMode = true;

    beforeEach(()=>{
        //Spy on console.error calls
        jest.spyOn(console, 'error').mockImplementation();
        jest.spyOn(console, 'debug').mockImplementation();
        y = new Year(0);
        y.months.push(new Month('M', 1, 5));
        y.months.push(new Month('T', 2, 15));
        y.weekdays.push(new Weekday(1, 'S'));
        y.weekdays.push(new Weekday(2, 'F'));
        y.selectedYear = 0;
        y.visibleYear = 0;
        y.months[0].current = true;
        y.months[0].selected = true;
        y.months[0].visible = true;
        y.months[0].days[0].current = true;
        y.months[0].days[0].selected = true;

        //Set up a new Simple Calendar instance
        SimpleCalendarConfiguration.instance = new SimpleCalendarConfiguration(y);

        //Spy on the inherited render function of the new instance
        renderSpy = jest.spyOn(SimpleCalendarConfiguration.instance, 'render');
        //Clear all mock calls
        (<Mock>console.error).mockClear();
        (<Mock>console.debug).mockClear();
        renderSpy.mockClear();
        (<Mock>game.settings.set).mockClear();
    });

    test('Default Options', () => {
        const spy = jest.spyOn(FormApplication, 'defaultOptions', 'get');
        const opts = SimpleCalendarConfiguration.defaultOptions;
        expect(Object.keys(opts).length).toBe(7); //Make sure no new properties have been added
        //@ts-ignore
        expect(opts.template).toBe('modules/foundryvtt-simple-calendar/templates/calendar-config.html');
        //@ts-ignore
        expect(opts.title).toBe('FSC.Configuration.Title');
        expect(opts.classes).toStrictEqual(["simple-calendar"]);
        //@ts-ignore
        expect(opts.resizable).toBe(true);
        //@ts-ignore
        expect(opts.width).toBe(825);
        //@ts-ignore
        expect(opts.height).toBe(700);
        //@ts-ignore
        expect(opts.tabs).toStrictEqual([{navSelector: ".tabs", contentSelector: "form", initial: "yearSettings"}]);
        expect(spy).toHaveBeenCalled();
    });

    test('Show App', () => {
        SimpleCalendarConfiguration.instance.showApp();
        expect(renderSpy).toHaveBeenCalled();
    });

    test('Close App', () => {
        jest.spyOn(SimpleCalendarConfiguration.instance, 'close').mockImplementation(() => {return Promise.resolve();});
        SimpleCalendarConfiguration.instance.closeApp();
        expect(SimpleCalendarConfiguration.instance.close).toHaveBeenCalled();
        (<Mock>SimpleCalendarConfiguration.instance.close).mockResolvedValueOnce(Promise.reject("a"));
        SimpleCalendarConfiguration.instance.closeApp();
        //expect(console.error).toHaveBeenCalledTimes(1);
    });

    test('Update App', () => {
        //@ts-ignore
        SimpleCalendarConfiguration.instance.updateApp();
        expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    test('Get Data', () => {
        let data = SimpleCalendarConfiguration.instance.getData();
        //@ts-ignore
        expect(data.currentYear).toStrictEqual(y);
        //@ts-ignore
        expect(data.months).toStrictEqual(y.months.map(m => m.toTemplate()));
        //@ts-ignore
        expect(data.weekdays).toStrictEqual(y.weekdays.map(m => m.toTemplate()));

        (<Mock>game.modules.get).mockReturnValueOnce({active:true}).mockReturnValueOnce({active:true});
        data = SimpleCalendarConfiguration.instance.getData();
        //@ts-ignore
        expect(data.importing.showCalendarWeather).toBe(true);
        //@ts-ignore
        expect(data.importing.showAboutTime).toBe(true);
    });

    test('Update Object', () => {
        //@ts-ignore
        expect(SimpleCalendarConfiguration.instance._updateObject()).resolves.toBeUndefined();
    });

    test('Activate Listeners', () => {
        const onFunc = jest.fn();
        const fakeQuery = {
            find: jest.fn().mockReturnValue({on: onFunc})
        };
        //@ts-ignore
        SimpleCalendarConfiguration.instance.activateListeners(fakeQuery);
        expect(fakeQuery.find).toHaveBeenCalledTimes(0);
        expect(onFunc).toHaveBeenCalledTimes(0);
        //@ts-ignore
        fakeQuery.length = 1;
        //@ts-ignore
        SimpleCalendarConfiguration.instance.activateListeners(fakeQuery);
        expect(fakeQuery.find).toHaveBeenCalledTimes(20);
        expect(onFunc).toHaveBeenCalledTimes(20);
    });

    test('Rebase Month Numbers', () => {
        SimpleCalendarConfiguration.instance.rebaseMonthNumbers();
        expect((<Year>SimpleCalendarConfiguration.instance.object).months[0].numericRepresentation).toBe(1);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months[1].numericRepresentation).toBe(2);
        (<Year>SimpleCalendarConfiguration.instance.object).months[0].intercalary = true;
        SimpleCalendarConfiguration.instance.rebaseMonthNumbers();
        expect((<Year>SimpleCalendarConfiguration.instance.object).months[0].numericRepresentation).toBe(-1);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months[1].numericRepresentation).toBe(1);
    });

    test('Add Month', () => {
        const event = new Event('click');
        const currentMonthLength = (<Year>SimpleCalendarConfiguration.instance.object).months.length;
        SimpleCalendarConfiguration.instance.addMonth(event);
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months.length).toBe(currentMonthLength + 1);
    });

    test('Remove Month', () => {
        const event = new Event('click');
        let currentMonthLength = (<Year>SimpleCalendarConfiguration.instance.object).months.length;
        SimpleCalendarConfiguration.instance.removeMonth(event);
        expect(renderSpy).not.toHaveBeenCalled();
        expect((<Year>SimpleCalendarConfiguration.instance.object).months.length).toBe(currentMonthLength);

        //Check for invalid index
        (<HTMLElement>event.currentTarget).setAttribute('data-index', 'a');
        currentMonthLength = (<Year>SimpleCalendarConfiguration.instance.object).months.length;
        SimpleCalendarConfiguration.instance.removeMonth(event);
        expect(renderSpy).not.toHaveBeenCalled();
        expect((<Year>SimpleCalendarConfiguration.instance.object).months.length).toBe(currentMonthLength);

        //Check for index outside of month length
        (<HTMLElement>event.currentTarget).setAttribute('data-index', '12');
        currentMonthLength = (<Year>SimpleCalendarConfiguration.instance.object).months.length;
        SimpleCalendarConfiguration.instance.removeMonth(event);
        expect(renderSpy).not.toHaveBeenCalled();
        expect((<Year>SimpleCalendarConfiguration.instance.object).months.length).toBe(currentMonthLength);

        //Check for valid index
        (<HTMLElement>event.currentTarget).setAttribute('data-index', '0');
        currentMonthLength = (<Year>SimpleCalendarConfiguration.instance.object).months.length;
        SimpleCalendarConfiguration.instance.removeMonth(event);
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months.length).toBe(currentMonthLength - 1);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months[0].name).toBe('T');
        expect((<Year>SimpleCalendarConfiguration.instance.object).months[0].days.length).toBe(15);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months[0].numericRepresentation).toBe(1);

        //Check for removing all months
        (<HTMLElement>event.currentTarget).setAttribute('data-index', 'all');
        SimpleCalendarConfiguration.instance.removeMonth(event);
        expect(renderSpy).toHaveBeenCalledTimes(2);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months.length).toBe(0);
    });

    test('Add Weekday', () => {
        const event = new Event('click');
        const currentWeekdayLength = (<Year>SimpleCalendarConfiguration.instance.object).weekdays.length;
        SimpleCalendarConfiguration.instance.addWeekday(event);
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect((<Year>SimpleCalendarConfiguration.instance.object).weekdays.length).toBe(currentWeekdayLength + 1);
    });

    test('Remove Weekday', () => {
        const event = new Event('click');
        let currentWeekdayLength = (<Year>SimpleCalendarConfiguration.instance.object).weekdays.length;
        SimpleCalendarConfiguration.instance.removeWeekday(event);
        expect(renderSpy).not.toHaveBeenCalled();
        expect((<Year>SimpleCalendarConfiguration.instance.object).weekdays.length).toBe(currentWeekdayLength);

        //Check for invalid index
        (<HTMLElement>event.currentTarget).setAttribute('data-index', 'a');
        currentWeekdayLength = (<Year>SimpleCalendarConfiguration.instance.object).weekdays.length;
        SimpleCalendarConfiguration.instance.removeWeekday(event);
        expect(renderSpy).not.toHaveBeenCalled();
        expect((<Year>SimpleCalendarConfiguration.instance.object).weekdays.length).toBe(currentWeekdayLength);

        //Check for index outside of weekday length
        (<HTMLElement>event.currentTarget).setAttribute('data-index', '12');
        currentWeekdayLength = (<Year>SimpleCalendarConfiguration.instance.object).weekdays.length;
        SimpleCalendarConfiguration.instance.removeWeekday(event);
        expect(renderSpy).not.toHaveBeenCalled();
        expect((<Year>SimpleCalendarConfiguration.instance.object).weekdays.length).toBe(currentWeekdayLength);

        //Check for valid index
        (<HTMLElement>event.currentTarget).setAttribute('data-index', '0');
        currentWeekdayLength = (<Year>SimpleCalendarConfiguration.instance.object).weekdays.length;
        SimpleCalendarConfiguration.instance.removeWeekday(event);
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect((<Year>SimpleCalendarConfiguration.instance.object).weekdays.length).toBe(currentWeekdayLength - 1);
        expect((<Year>SimpleCalendarConfiguration.instance.object).weekdays[0].name).toBe('F');
        expect((<Year>SimpleCalendarConfiguration.instance.object).weekdays[0].numericRepresentation).toBe(1);

        //Check for removing all weekdays
        (<HTMLElement>event.currentTarget).setAttribute('data-index', 'all');
        SimpleCalendarConfiguration.instance.removeWeekday(event);
        expect(renderSpy).toHaveBeenCalledTimes(2);
        expect((<Year>SimpleCalendarConfiguration.instance.object).weekdays.length).toBe(0);
    });

    test('Predefined Apply Confirm', () => {
        const select = document.createElement('input');

        select.value = 'gregorian';
        jest.spyOn(document, 'getElementById').mockImplementation().mockReturnValueOnce(select);
        SimpleCalendarConfiguration.instance.predefinedApplyConfirm();
        const d = new Date();
        expect((<Year>SimpleCalendarConfiguration.instance.object).numericRepresentation).toBe(d.getFullYear());
        expect((<Year>SimpleCalendarConfiguration.instance.object).months.length).toBe(12);
        expect((<Year>SimpleCalendarConfiguration.instance.object).weekdays.length).toBe(7);
        expect((<Year>SimpleCalendarConfiguration.instance.object).leapYearRule.rule).toBe(LeapYearRules.Gregorian);

        select.value = 'eberron';
        jest.spyOn(document, 'getElementById').mockImplementation().mockReturnValueOnce(select);
        SimpleCalendarConfiguration.instance.predefinedApplyConfirm();
        expect((<Year>SimpleCalendarConfiguration.instance.object).numericRepresentation).toBe(998);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months.length).toBe(12);
        expect((<Year>SimpleCalendarConfiguration.instance.object).weekdays.length).toBe(7);
        expect((<Year>SimpleCalendarConfiguration.instance.object).leapYearRule.rule).toBe(LeapYearRules.None);

        select.value = 'exandrian';
        jest.spyOn(document, 'getElementById').mockImplementation().mockReturnValueOnce(select);
        SimpleCalendarConfiguration.instance.predefinedApplyConfirm();
        expect((<Year>SimpleCalendarConfiguration.instance.object).numericRepresentation).toBe(812);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months.length).toBe(11);
        expect((<Year>SimpleCalendarConfiguration.instance.object).weekdays.length).toBe(6);
        expect((<Year>SimpleCalendarConfiguration.instance.object).leapYearRule.rule).toBe(LeapYearRules.None);

        select.value = 'golarian';
        jest.spyOn(document, 'getElementById').mockImplementation().mockReturnValueOnce(select);
        SimpleCalendarConfiguration.instance.predefinedApplyConfirm();
        expect((<Year>SimpleCalendarConfiguration.instance.object).numericRepresentation).toBe(4710);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months.length).toBe(12);
        expect((<Year>SimpleCalendarConfiguration.instance.object).weekdays.length).toBe(7);
        expect((<Year>SimpleCalendarConfiguration.instance.object).leapYearRule.rule).toBe(LeapYearRules.Custom);

        select.value = 'greyhawk';
        jest.spyOn(document, 'getElementById').mockImplementation().mockReturnValueOnce(select);
        SimpleCalendarConfiguration.instance.predefinedApplyConfirm();
        expect((<Year>SimpleCalendarConfiguration.instance.object).numericRepresentation).toBe(591);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months.length).toBe(16);
        expect((<Year>SimpleCalendarConfiguration.instance.object).weekdays.length).toBe(7);
        expect((<Year>SimpleCalendarConfiguration.instance.object).leapYearRule.rule).toBe(LeapYearRules.None);

        select.value = 'harptos';
        jest.spyOn(document, 'getElementById').mockImplementation().mockReturnValueOnce(select);
        SimpleCalendarConfiguration.instance.predefinedApplyConfirm();
        expect((<Year>SimpleCalendarConfiguration.instance.object).numericRepresentation).toBe(1495);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months.length).toBe(18);
        expect((<Year>SimpleCalendarConfiguration.instance.object).weekdays.length).toBe(10);
        expect((<Year>SimpleCalendarConfiguration.instance.object).leapYearRule.rule).toBe(LeapYearRules.Custom);

        select.value = 'warhammer';
        jest.spyOn(document, 'getElementById').mockImplementation().mockReturnValueOnce(select);
        SimpleCalendarConfiguration.instance.predefinedApplyConfirm();
        expect((<Year>SimpleCalendarConfiguration.instance.object).numericRepresentation).toBe(2522);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months.length).toBe(18);
        expect((<Year>SimpleCalendarConfiguration.instance.object).weekdays.length).toBe(8);
        expect((<Year>SimpleCalendarConfiguration.instance.object).leapYearRule.rule).toBe(LeapYearRules.None);

    });

    test('General Input Change', () => {
        const event = new Event('change');
        (<HTMLInputElement>event.currentTarget).id = "scDefaultPlayerVisibility";
        (<HTMLInputElement>event.currentTarget).checked = true;

        //@ts-ignore
        expect(SimpleCalendarConfiguration.instance.generalSettings.defaultPlayerNoteVisibility).toBe(false);
        SimpleCalendarConfiguration.instance.generalInputChange(event);
        //@ts-ignore
        expect(SimpleCalendarConfiguration.instance.generalSettings.defaultPlayerNoteVisibility).toBe(true);
        (<HTMLInputElement>event.currentTarget).id = "asd";
        SimpleCalendarConfiguration.instance.generalInputChange(event);
        //@ts-ignore
        expect(SimpleCalendarConfiguration.instance.generalSettings.defaultPlayerNoteVisibility).toBe(true);

        (<HTMLInputElement>event.currentTarget).id = "scGameWorldTime";
        (<HTMLInputElement>event.currentTarget).value = 'self';
        SimpleCalendarConfiguration.instance.generalInputChange(event);
        //@ts-ignore
        expect((<Year>SimpleCalendarConfiguration.instance.object).generalSettings.gameWorldTimeIntegration).toBe('self');

        (<HTMLInputElement>event.currentTarget).id = "scShowClock";
        (<HTMLInputElement>event.currentTarget).checked = true;
        SimpleCalendarConfiguration.instance.generalInputChange(event);
        //@ts-ignore
        expect((<Year>SimpleCalendarConfiguration.instance.object).generalSettings.showClock ).toBe(true);
    });

    test('Year Input Change', () => {
        const event = new Event('change');
        (<HTMLInputElement>event.currentTarget).id = "scCurrentYear";
        //Invalid current year
        (<HTMLInputElement>event.currentTarget).value = 'asd';
        const beforeYear = (<Year>SimpleCalendarConfiguration.instance.object).numericRepresentation;
        SimpleCalendarConfiguration.instance.yearInputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).numericRepresentation).toBe(beforeYear);
        //Valid current year
        (<HTMLInputElement>event.currentTarget).value = '10';
        SimpleCalendarConfiguration.instance.yearInputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).numericRepresentation).toBe(10);

        //Prefix
        (<HTMLInputElement>event.currentTarget).id = "scYearPreFix";
        (<HTMLInputElement>event.currentTarget).value = 'Pre';
        SimpleCalendarConfiguration.instance.yearInputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).prefix).toBe('Pre');

        //Postfix
        (<HTMLInputElement>event.currentTarget).id = "scYearPostFix";
        (<HTMLInputElement>event.currentTarget).value = 'Post';
        SimpleCalendarConfiguration.instance.yearInputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).postfix).toBe('Post');

        //Invalid ID
        (<HTMLInputElement>event.currentTarget).id = "asd";
        SimpleCalendarConfiguration.instance.yearInputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).numericRepresentation).toBe(10);
        expect((<Year>SimpleCalendarConfiguration.instance.object).prefix).toBe('Pre');
        expect((<Year>SimpleCalendarConfiguration.instance.object).postfix).toBe('Post');
    });

    test('Month Input Change', () => {
        const event = new Event('change');
        (<HTMLElement>event.currentTarget).classList.remove('next');
        //Test No Attributes
        SimpleCalendarConfiguration.instance.monthInputChange(event);
        expect(console.debug).toHaveBeenCalledTimes(1);
        //Test set index and no class or value
        (<HTMLElement>event.currentTarget).setAttribute('data-index', 'a');
        SimpleCalendarConfiguration.instance.monthInputChange(event);
        expect(console.debug).toHaveBeenCalledTimes(2);
        //Test set index and class but no value
        (<HTMLElement>event.currentTarget).classList.add('month-name');
        SimpleCalendarConfiguration.instance.monthInputChange(event);
        expect(console.debug).toHaveBeenCalledTimes(3);
        //Test all attributes set but invalid index
        (<HTMLInputElement>event.currentTarget).value = 'X';
        SimpleCalendarConfiguration.instance.monthInputChange(event);
        expect(console.debug).toHaveBeenCalledTimes(4);
        //Test all attributes set but index outside of month length
        (<HTMLElement>event.currentTarget).setAttribute('data-index', '12');
        SimpleCalendarConfiguration.instance.monthInputChange(event);
        expect(console.debug).toHaveBeenCalledTimes(5);
        //Test all attributes for month name change
        (<HTMLElement>event.currentTarget).setAttribute('data-index', '0');
        SimpleCalendarConfiguration.instance.monthInputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months[0].name).toBe('X');

        //Test all attributes for month day length change, invalid value
        (<HTMLElement>event.currentTarget).classList.remove('month-name');
        (<HTMLElement>event.currentTarget).classList.add('month-days');
        let numDays = (<Year>SimpleCalendarConfiguration.instance.object).months[0].numberOfDays;
        SimpleCalendarConfiguration.instance.monthInputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months[0].numberOfDays).toBe(numDays);
        //Test all attributes for month day length change, set to same day length
        (<HTMLInputElement>event.currentTarget).value = (<Year>SimpleCalendarConfiguration.instance.object).months[0].numberOfDays.toString();
        SimpleCalendarConfiguration.instance.monthInputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months[0].numberOfDays).toBe(numDays);
        //Test all attributes for month day length change
        (<HTMLInputElement>event.currentTarget).value = '20';
        SimpleCalendarConfiguration.instance.monthInputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months[0].numberOfDays).toBe(20);

        //Test intercalary change
        //@ts-ignore
        SimpleCalendarConfiguration.instance.element = {find: jest.fn(()=>{ return {parent: jest.fn(()=>{ return {parent: jest.fn(()=>{ return {parent: jest.fn(() => { return {removeClass: jest.fn(), addClass:jest.fn()} })} })} })} })};
        (<HTMLElement>event.currentTarget).classList.remove('month-days');
        (<HTMLElement>event.currentTarget).classList.add('month-intercalary');
        (<HTMLInputElement>event.currentTarget).checked = true;
        SimpleCalendarConfiguration.instance.monthInputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months[0].intercalary).toBe(true);
        (<HTMLInputElement>event.currentTarget).checked = false;
        SimpleCalendarConfiguration.instance.monthInputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months[0].intercalary).toBe(false);

        //Test intercalary include change
        (<HTMLElement>event.currentTarget).classList.remove('month-intercalary');
        (<HTMLElement>event.currentTarget).classList.add('month-intercalary-include');
        (<HTMLInputElement>event.currentTarget).checked = true;
        SimpleCalendarConfiguration.instance.monthInputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months[0].intercalaryInclude).toBe(true);

        //Test invlaid class name
        (<HTMLElement>event.currentTarget).classList.remove('month-intercalary-include');
        (<HTMLElement>event.currentTarget).classList.add('no');
        SimpleCalendarConfiguration.instance.monthInputChange(event);
        expect(console.debug).toHaveBeenCalledTimes(6);

    });

    test('Show Weekday Input Change', () => {
        const event = new Event('change');
        (<HTMLInputElement>event.currentTarget).checked = true;
        SimpleCalendarConfiguration.instance.showWeekdayInputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).showWeekdayHeadings).toBe(true);
        (<HTMLInputElement>event.currentTarget).checked = false;
        SimpleCalendarConfiguration.instance.showWeekdayInputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).showWeekdayHeadings).toBe(false);
    });

    test('Weekday Input Change', () => {
        const event = new Event('change');
        //Test No Attributes
        SimpleCalendarConfiguration.instance.weekdayInputChange(event);
        expect(console.debug).toHaveBeenCalledTimes(1);
        //Test set index and no value
        (<HTMLElement>event.currentTarget).setAttribute('data-index', 'a');
        SimpleCalendarConfiguration.instance.weekdayInputChange(event);
        expect(console.debug).toHaveBeenCalledTimes(2);
        //Test all attributes set but invalid index
        (<HTMLInputElement>event.currentTarget).value = 'X';
        SimpleCalendarConfiguration.instance.weekdayInputChange(event);
        expect(console.debug).toHaveBeenCalledTimes(3);
        //Test all attributes set but index outside of weekday length
        (<HTMLElement>event.currentTarget).setAttribute('data-index', '12');
        SimpleCalendarConfiguration.instance.weekdayInputChange(event);
        expect(console.debug).toHaveBeenCalledTimes(4);
        //Test all attributes for weekday name change
        (<HTMLElement>event.currentTarget).setAttribute('data-index', '0');
        SimpleCalendarConfiguration.instance.weekdayInputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).weekdays[0].name).toBe('X');
    });

    test('Leap Year Rule Change', () => {
        const event = new Event('change');
        SimpleCalendarConfiguration.instance.leapYearRuleChange(event);
        expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    test('Leap Year Month Change', () => {
        const event = new Event('change');
        //Test No Attributes
        SimpleCalendarConfiguration.instance.leapYearMonthChange(event);
        expect(console.debug).toHaveBeenCalledTimes(1);
        //Test set index and no value
        (<HTMLElement>event.currentTarget).setAttribute('data-index', 'a');
        SimpleCalendarConfiguration.instance.leapYearMonthChange(event);
        expect(console.debug).toHaveBeenCalledTimes(2);
        //Test all attributes set but invalid index
        (<HTMLInputElement>event.currentTarget).value = '4';
        SimpleCalendarConfiguration.instance.leapYearMonthChange(event);
        expect(console.debug).toHaveBeenCalledTimes(3);
        //Test all attributes set but index outside of weekday length
        (<HTMLElement>event.currentTarget).setAttribute('data-index', '12');
        SimpleCalendarConfiguration.instance.leapYearMonthChange(event);
        expect(console.debug).toHaveBeenCalledTimes(4);
        //Test all attributes for weekday name change
        (<HTMLElement>event.currentTarget).setAttribute('data-index', '0');
        SimpleCalendarConfiguration.instance.leapYearMonthChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months[0].numberOfLeapYearDays).toBe(4);
        //Test invalid number of days
        (<HTMLInputElement>event.currentTarget).value = 'asd';
        SimpleCalendarConfiguration.instance.leapYearMonthChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months[0].numberOfLeapYearDays).toBe(4);
    });

    test('Time Input Change', () => {
        const event = new Event('change');
        (<HTMLInputElement>event.currentTarget).id = "asd";
        SimpleCalendarConfiguration.instance.timeInputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).time.hoursInDay).toBe(24);

        //Invalid hours in day
        (<HTMLInputElement>event.currentTarget).id = "scHoursInDay";
        (<HTMLInputElement>event.currentTarget).value = 'asd';
        SimpleCalendarConfiguration.instance.timeInputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).time.hoursInDay).toBe(24);
        //Valid hours in day
        (<HTMLInputElement>event.currentTarget).value = '10';
        SimpleCalendarConfiguration.instance.timeInputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).time.hoursInDay).toBe(10);

        //Invalid minutes in hour
        (<HTMLInputElement>event.currentTarget).id = "scMinutesInHour";
        (<HTMLInputElement>event.currentTarget).value = 'asd';
        SimpleCalendarConfiguration.instance.timeInputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).time.minutesInHour).toBe(60);
        //Valid minutes in hour
        (<HTMLInputElement>event.currentTarget).value = '10';
        SimpleCalendarConfiguration.instance.timeInputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).time.minutesInHour).toBe(10);

        //Invalid seconds in minute
        (<HTMLInputElement>event.currentTarget).id = "scSecondsInMinute";
        (<HTMLInputElement>event.currentTarget).value = 'asd';
        SimpleCalendarConfiguration.instance.timeInputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).time.secondsInMinute).toBe(60);
        //Valid seconds in minute
        (<HTMLInputElement>event.currentTarget).value = '10';
        SimpleCalendarConfiguration.instance.timeInputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).time.secondsInMinute).toBe(10);

        //Invalid game time ratio
        (<HTMLInputElement>event.currentTarget).id = "scGameTimeRatio";
        (<HTMLInputElement>event.currentTarget).value = 'asd';
        SimpleCalendarConfiguration.instance.timeInputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).time.gameTimeRatio).toBe(1);
        //Valid game time ratio
        (<HTMLInputElement>event.currentTarget).value = '10';
        SimpleCalendarConfiguration.instance.timeInputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).time.gameTimeRatio).toBe(10);
    });

    test('Overwrite Confirmation Dialog', () => {
        SimpleCalendarConfiguration.instance.overwriteConfirmationDialog('a', 'b', new Event('click'));
        //@ts-ignore
        expect(DialogRenderer).toHaveBeenCalledTimes(1);
    });

    test('Save Click', async () => {
        //@ts-ignore
        game.user.isGM = true;
        const event = new Event('click');
        const closeSpy = jest.spyOn(SimpleCalendarConfiguration.instance, 'closeApp');

        //Exception being thrown
        await SimpleCalendarConfiguration.instance.saveClick(event);
        //expect(console.error).toHaveBeenCalledTimes(1);

        const invalidYear = document.createElement('input');
        invalidYear.value = 'a';
        const validYear = document.createElement('input');
        validYear.value = '2';
        const pre = document.createElement('input');
        pre.value = 'pre';
        const post = document.createElement('input');
        post.value = 'post';
        const validCustMod = document.createElement('input');
        validCustMod.value = '4';
        const invalidCustMod = document.createElement('input');
        invalidCustMod.value = 'qwe';
        const showWeekday = document.createElement('input');
        showWeekday.checked = true;
        const gameWorldIntegration = document.createElement('input');
        showWeekday.value = 'self';


        //Invalid year, month and weekday
        jest.spyOn(document, 'getElementById').mockImplementation().mockReturnValueOnce(gameWorldIntegration).mockReturnValueOnce(showWeekday).mockReturnValueOnce(invalidYear).mockReturnValueOnce(pre).mockReturnValueOnce(post).mockReturnValueOnce(showWeekday).mockReturnValueOnce(invalidYear).mockReturnValueOnce(invalidYear).mockReturnValueOnce(invalidYear).mockReturnValueOnce(invalidYear).mockReturnValueOnce(showWeekday)
        await SimpleCalendarConfiguration.instance.saveClick(event);
        expect(game.settings.set).toHaveBeenCalledTimes(6);
        expect(closeSpy).toHaveBeenCalledTimes(1);

        //Valid year weekday, invalid month days
        jest.spyOn(document, 'getElementById').mockImplementation().mockReturnValueOnce(gameWorldIntegration).mockReturnValueOnce(showWeekday).mockReturnValueOnce(validYear).mockReturnValueOnce(pre).mockReturnValueOnce(post).mockReturnValueOnce(showWeekday).mockReturnValueOnce(validYear).mockReturnValueOnce(validYear).mockReturnValueOnce(validYear).mockReturnValueOnce(validYear).mockReturnValueOnce(showWeekday);
        await SimpleCalendarConfiguration.instance.saveClick(event);
        expect(game.settings.set).toHaveBeenCalledTimes(12);
        expect(closeSpy).toHaveBeenCalledTimes(2);
        expect((<Year>SimpleCalendarConfiguration.instance.object).numericRepresentation).toBe(2);
        expect((<Year>SimpleCalendarConfiguration.instance.object).selectedYear).toBe(2);
        expect((<Year>SimpleCalendarConfiguration.instance.object).visibleYear).toBe(2);
        expect((<Year>SimpleCalendarConfiguration.instance.object).prefix).toBe('pre');
        expect((<Year>SimpleCalendarConfiguration.instance.object).postfix).toBe('post');
        expect((<Year>SimpleCalendarConfiguration.instance.object).months[0].name).toBe('X');
        expect((<Year>SimpleCalendarConfiguration.instance.object).weekdays[0].name).toBe('Z');

        //Valid year weekday, month days the same as passed in days
        jest.spyOn(document, 'getElementById').mockImplementation().mockReturnValueOnce(gameWorldIntegration).mockReturnValueOnce(showWeekday).mockReturnValueOnce(validYear).mockReturnValueOnce(pre).mockReturnValueOnce(post).mockReturnValueOnce(showWeekday).mockReturnValueOnce(invalidCustMod).mockReturnValueOnce(validYear).mockReturnValueOnce(validYear).mockReturnValueOnce(validYear).mockReturnValueOnce(validYear).mockReturnValueOnce(showWeekday);
        await SimpleCalendarConfiguration.instance.saveClick(event);
        expect(game.settings.set).toHaveBeenCalledTimes(19);
        expect(closeSpy).toHaveBeenCalledTimes(3);

        //Valid year weekday valid month days
        (<Year>SimpleCalendarConfiguration.instance.object).months[0].days[3].current = true;
        jest.spyOn(document, 'getElementById').mockImplementation().mockReturnValueOnce(gameWorldIntegration).mockReturnValueOnce(showWeekday).mockReturnValueOnce(validYear).mockReturnValueOnce(pre).mockReturnValueOnce(post).mockReturnValueOnce(showWeekday).mockReturnValueOnce(validCustMod).mockReturnValueOnce(validYear).mockReturnValueOnce(validYear).mockReturnValueOnce(validYear).mockReturnValueOnce(validYear).mockReturnValueOnce(showWeekday);
        await SimpleCalendarConfiguration.instance.saveClick(event);
        expect(game.settings.set).toHaveBeenCalledTimes(26);
        expect(closeSpy).toHaveBeenCalledTimes(4);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months[0].days.length).toBe(7);

        //Valid year weekday valid month days, new month days is smaller than current month day
        (<Year>SimpleCalendarConfiguration.instance.object).months[0].days[0].current = false;
        (<Year>SimpleCalendarConfiguration.instance.object).months[0].days[6].current = true;
        jest.spyOn(document, 'getElementById').mockImplementation().mockReturnValueOnce(gameWorldIntegration).mockReturnValueOnce(showWeekday).mockReturnValueOnce(validYear).mockReturnValueOnce(pre).mockReturnValueOnce(post).mockReturnValueOnce(showWeekday).mockReturnValueOnce(validYear).mockReturnValueOnce(validYear).mockReturnValueOnce(validYear).mockReturnValueOnce(validYear).mockReturnValueOnce(showWeekday);
        await SimpleCalendarConfiguration.instance.saveClick(event);
        expect(game.settings.set).toHaveBeenCalledTimes(33);
        expect(closeSpy).toHaveBeenCalledTimes(5);
        //expect((<Year>SimpleCalendarConfiguration.instance.object).months[0].days[0].current).toBe(true);

        //@ts-ignore
        SimpleCalendarConfiguration.instance.yearChanged = true;
        jest.spyOn(document, 'getElementById').mockImplementation().mockReturnValueOnce(gameWorldIntegration).mockReturnValueOnce(showWeekday).mockReturnValueOnce(validYear).mockReturnValueOnce(pre).mockReturnValueOnce(post).mockReturnValueOnce(showWeekday).mockReturnValueOnce(validYear).mockReturnValueOnce(validYear).mockReturnValueOnce(validYear).mockReturnValueOnce(validYear).mockReturnValueOnce(showWeekday);
        await SimpleCalendarConfiguration.instance.saveClick(event);
        expect(game.settings.set).toHaveBeenCalledTimes(41);
        expect(closeSpy).toHaveBeenCalledTimes(6);

        //Valid year weekday valid month days, no current day
        jest.spyOn(document, 'getElementById').mockImplementation().mockReturnValueOnce(gameWorldIntegration).mockReturnValueOnce(showWeekday).mockReturnValueOnce(validYear).mockReturnValueOnce(pre).mockReturnValueOnce(post).mockReturnValueOnce(showWeekday).mockReturnValueOnce(validYear).mockReturnValueOnce(validYear).mockReturnValueOnce(validYear).mockReturnValueOnce(validYear).mockReturnValueOnce(showWeekday);
        await SimpleCalendarConfiguration.instance.saveClick(event);
        expect(game.settings.set).toHaveBeenCalledTimes(49);
        expect(closeSpy).toHaveBeenCalledTimes(7);
    });

    test('Overwrite Confirmation Yes', async () => {
        //@ts-ignore
        game.user.isGM = true;
        await SimpleCalendarConfiguration.instance.overwriteConfirmationYes('a', 'b');
        expect(renderSpy).not.toHaveBeenCalled();
        expect(game.settings.set).not.toHaveBeenCalled();

        const select = document.createElement('input');
        select.value = 'gregorian';
        jest.spyOn(document, 'getElementById').mockImplementation().mockReturnValue(select);
        await SimpleCalendarConfiguration.instance.overwriteConfirmationYes('predefined', 'b');
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect(game.settings.set).not.toHaveBeenCalled();

        await SimpleCalendarConfiguration.instance.overwriteConfirmationYes('tp-import', 'b');
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect(game.settings.set).toHaveBeenCalledTimes(1);

        await SimpleCalendarConfiguration.instance.overwriteConfirmationYes('tp-import', 'about-time');
        expect(renderSpy).toHaveBeenCalledTimes(2);
        expect(game.settings.set).toHaveBeenCalledTimes(2);

        await SimpleCalendarConfiguration.instance.overwriteConfirmationYes('tp-import', 'calendar-weather');
        expect(renderSpy).toHaveBeenCalledTimes(3);
        expect(game.settings.set).toHaveBeenCalledTimes(3);

        await SimpleCalendarConfiguration.instance.overwriteConfirmationYes('tp-export', 'b');
        expect(renderSpy).toHaveBeenCalledTimes(3);
        expect(game.settings.set).toHaveBeenCalledTimes(4);

        await SimpleCalendarConfiguration.instance.overwriteConfirmationYes('tp-export', 'about-time');
        expect(renderSpy).toHaveBeenCalledTimes(3);
        expect(game.settings.set).toHaveBeenCalledTimes(5);

        await SimpleCalendarConfiguration.instance.overwriteConfirmationYes('tp-export', 'calendar-weather');
        expect(renderSpy).toHaveBeenCalledTimes(3);
        expect(game.settings.set).toHaveBeenCalledTimes(6);

        (<Mock>game.settings.set).mockClear();
    });
});
