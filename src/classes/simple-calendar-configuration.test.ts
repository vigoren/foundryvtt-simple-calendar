/**
 * @jest-environment jsdom
 */
import "../../__mocks__/game";
import "../../__mocks__/form-application";
import "../../__mocks__/application";
import "../../__mocks__/handlebars";
import "../../__mocks__/event";

import {SimpleCalendarConfiguration} from "./simple-calendar-configuration";
import Year from "./year";
import SpyInstance = jest.SpyInstance;
import Mock = jest.Mock;
import Month from "./month";
import {Weekday} from "./weekday";
import {Logger} from "./logging";


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
        expect(opts.template).toBe('modules/foundryvtt-simple-calendar/templates/calendar-config.html');
        expect(opts.title).toBe('FSC.Configuration.Title');
        expect(opts.classes).toStrictEqual(["simple-calendar"]);
        expect(opts.resizable).toBe(true);
        //@ts-ignore
        expect(opts.width).toBe(550);
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
        expect(data.currentYear).toStrictEqual(y);
        expect(data.months).toStrictEqual(y.months.map(m => m.toTemplate()));
        expect(data.weekdays).toStrictEqual(y.weekdays.map(m => m.toTemplate()));
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
        expect(fakeQuery.find).toHaveBeenCalledTimes(7);
        expect(onFunc).toHaveBeenCalledTimes(7);
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

        //Test invlaid class name
        (<HTMLElement>event.currentTarget).classList.remove('month-days');
        (<HTMLElement>event.currentTarget).classList.add('no');
        SimpleCalendarConfiguration.instance.monthInputChange(event);
        expect(console.debug).toHaveBeenCalledTimes(6);

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

    test('Save Click', async () => {
        //@ts-ignore
        game.user.isGM = true;
        const event = new Event('click');
        const closeSpy = jest.spyOn(SimpleCalendarConfiguration.instance, 'closeApp');

        //Exception being thrown
        await SimpleCalendarConfiguration.instance.saveClick(event);
        expect(console.error).toHaveBeenCalledTimes(1);

        const invalidYear = document.createElement('input');
        invalidYear.value = 'a';
        const validYear = document.createElement('input');
        validYear.value = '2';
        const pre = document.createElement('input');
        pre.value = 'pre';
        const post = document.createElement('input');
        post.value = 'post';

        //Invalid year, month and weekday
        jest.spyOn(document, 'getElementById').mockImplementation().mockReturnValueOnce(invalidYear).mockReturnValueOnce(pre).mockReturnValueOnce(post);
        await SimpleCalendarConfiguration.instance.saveClick(event);
        expect(game.settings.set).toHaveBeenCalledTimes(3);
        expect(closeSpy).toHaveBeenCalledTimes(1);

        //Valid year weekday, invalid month days
        jest.spyOn(document, 'getElementById').mockImplementation().mockReturnValueOnce(validYear).mockReturnValueOnce(pre).mockReturnValueOnce(post);
        await SimpleCalendarConfiguration.instance.saveClick(event);
        expect(game.settings.set).toHaveBeenCalledTimes(7);
        expect(closeSpy).toHaveBeenCalledTimes(2);
        expect((<Year>SimpleCalendarConfiguration.instance.object).numericRepresentation).toBe(2);
        expect((<Year>SimpleCalendarConfiguration.instance.object).selectedYear).toBe(2);
        expect((<Year>SimpleCalendarConfiguration.instance.object).visibleYear).toBe(2);
        expect((<Year>SimpleCalendarConfiguration.instance.object).prefix).toBe('pre');
        expect((<Year>SimpleCalendarConfiguration.instance.object).postfix).toBe('post');
        expect((<Year>SimpleCalendarConfiguration.instance.object).months[0].name).toBe('X');
        expect((<Year>SimpleCalendarConfiguration.instance.object).weekdays[0].name).toBe('Z');

        //Valid year weekday, month days the same as passed in days
        jest.spyOn(document, 'getElementById').mockImplementation().mockReturnValueOnce(validYear).mockReturnValueOnce(pre).mockReturnValueOnce(post);
        await SimpleCalendarConfiguration.instance.saveClick(event);
        expect(game.settings.set).toHaveBeenCalledTimes(10);
        expect(closeSpy).toHaveBeenCalledTimes(3);

        //Valid year weekday valid month days
        jest.spyOn(document, 'getElementById').mockImplementation().mockReturnValueOnce(validYear).mockReturnValueOnce(pre).mockReturnValueOnce(post);
        await SimpleCalendarConfiguration.instance.saveClick(event);
        expect(game.settings.set).toHaveBeenCalledTimes(13);
        expect(closeSpy).toHaveBeenCalledTimes(4);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months[0].days.length).toBe(7);

        //Valid year weekday valid month days, new month days is smaller than current month day
        (<Year>SimpleCalendarConfiguration.instance.object).months[0].days[0].current = false;
        (<Year>SimpleCalendarConfiguration.instance.object).months[0].days[6].current = true;
        jest.spyOn(document, 'getElementById').mockImplementation().mockReturnValueOnce(validYear).mockReturnValueOnce(pre).mockReturnValueOnce(post);
        await SimpleCalendarConfiguration.instance.saveClick(event);
        expect(game.settings.set).toHaveBeenCalledTimes(16);
        expect(closeSpy).toHaveBeenCalledTimes(5);
        //expect((<Year>SimpleCalendarConfiguration.instance.object).months[0].days[0].current).toBe(true);

        //Valid year weekday valid month days, no current day
        jest.spyOn(document, 'getElementById').mockImplementation().mockReturnValueOnce(validYear).mockReturnValueOnce(pre).mockReturnValueOnce(post);
        await SimpleCalendarConfiguration.instance.saveClick(event);
        expect(game.settings.set).toHaveBeenCalledTimes(19);
        expect(closeSpy).toHaveBeenCalledTimes(6);
    });
});
