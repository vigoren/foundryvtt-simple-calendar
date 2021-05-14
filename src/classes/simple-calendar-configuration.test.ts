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
import Month from "./month";
import {Weekday} from "./weekday";
import {Logger} from "./logging";
import {LeapYearRules, MoonIcons, MoonYearResetOptions} from "../constants";
import Season from "./season";
import Moon from "./moon";
import SpyInstance = jest.SpyInstance;
import Mock = jest.Mock;

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
        y.months.push(new Month('M', 1, 0, 5));
        y.months.push(new Month('T', 2, 0, 15));
        y.weekdays.push(new Weekday(1, 'S'));
        y.weekdays.push(new Weekday(2, 'F'));
        y.seasons.push(new Season('S', 5, 5));
        y.moons.push(new Moon('Moon', 30));
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
        //@ts-ignore
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
        expect(opts.classes).toStrictEqual(["simple-calendar-configuration"]);
        //@ts-ignore
        expect(opts.resizable).toBe(true);
        //@ts-ignore
        expect(opts.width).toBe(1005);
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
        expect(fakeQuery.find).toHaveBeenCalledTimes(30);
        expect(onFunc).toHaveBeenCalledTimes(30);
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
        SimpleCalendarConfiguration.instance.addToTable('month', event);
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months.length).toBe(currentMonthLength + 1);
    });

    test('Remove Month', () => {
        const event = new Event('click');
        let currentMonthLength = (<Year>SimpleCalendarConfiguration.instance.object).months.length;
        SimpleCalendarConfiguration.instance.removeFromTable('month',event);
        expect(renderSpy).not.toHaveBeenCalled();
        expect((<Year>SimpleCalendarConfiguration.instance.object).months.length).toBe(currentMonthLength);

        //Check for invalid index
        (<HTMLElement>event.currentTarget).setAttribute('data-index', 'a');
        currentMonthLength = (<Year>SimpleCalendarConfiguration.instance.object).months.length;
        SimpleCalendarConfiguration.instance.removeFromTable('month',event);
        expect(renderSpy).not.toHaveBeenCalled();
        expect((<Year>SimpleCalendarConfiguration.instance.object).months.length).toBe(currentMonthLength);

        //Check for index outside of month length
        (<HTMLElement>event.currentTarget).setAttribute('data-index', '12');
        currentMonthLength = (<Year>SimpleCalendarConfiguration.instance.object).months.length;
        SimpleCalendarConfiguration.instance.removeFromTable('month',event);
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months.length).toBe(currentMonthLength);

        //Check for valid index
        (<HTMLElement>event.currentTarget).setAttribute('data-index', '0');
        currentMonthLength = (<Year>SimpleCalendarConfiguration.instance.object).months.length;
        SimpleCalendarConfiguration.instance.removeFromTable('month',event);
        expect(renderSpy).toHaveBeenCalledTimes(2);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months.length).toBe(currentMonthLength - 1);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months[0].name).toBe('T');
        expect((<Year>SimpleCalendarConfiguration.instance.object).months[0].days.length).toBe(15);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months[0].numericRepresentation).toBe(1);

        //Check for removing all months
        (<HTMLElement>event.currentTarget).setAttribute('data-index', 'all');
        SimpleCalendarConfiguration.instance.removeFromTable('month',event);
        expect(renderSpy).toHaveBeenCalledTimes(3);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months.length).toBe(0);
    });

    test('Add Weekday', () => {
        const event = new Event('click');
        const currentWeekdayLength = (<Year>SimpleCalendarConfiguration.instance.object).weekdays.length;
        SimpleCalendarConfiguration.instance.addToTable('weekday', event);
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect((<Year>SimpleCalendarConfiguration.instance.object).weekdays.length).toBe(currentWeekdayLength + 1);
    });

    test('Remove Weekday', () => {
        const event = new Event('click');
        let currentWeekdayLength = (<Year>SimpleCalendarConfiguration.instance.object).weekdays.length;
        SimpleCalendarConfiguration.instance.removeFromTable('weekday',event);
        expect(renderSpy).not.toHaveBeenCalled();
        expect((<Year>SimpleCalendarConfiguration.instance.object).weekdays.length).toBe(currentWeekdayLength);

        //Check for invalid index
        (<HTMLElement>event.currentTarget).setAttribute('data-index', 'a');
        currentWeekdayLength = (<Year>SimpleCalendarConfiguration.instance.object).weekdays.length;
        SimpleCalendarConfiguration.instance.removeFromTable('weekday',event);
        expect(renderSpy).not.toHaveBeenCalled();
        expect((<Year>SimpleCalendarConfiguration.instance.object).weekdays.length).toBe(currentWeekdayLength);

        //Check for index outside of weekday length
        (<HTMLElement>event.currentTarget).setAttribute('data-index', '12');
        currentWeekdayLength = (<Year>SimpleCalendarConfiguration.instance.object).weekdays.length;
        SimpleCalendarConfiguration.instance.removeFromTable('weekday',event);
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect((<Year>SimpleCalendarConfiguration.instance.object).weekdays.length).toBe(currentWeekdayLength);

        //Check for valid index
        (<HTMLElement>event.currentTarget).setAttribute('data-index', '0');
        currentWeekdayLength = (<Year>SimpleCalendarConfiguration.instance.object).weekdays.length;
        SimpleCalendarConfiguration.instance.removeFromTable('weekday',event);
        expect(renderSpy).toHaveBeenCalledTimes(2);
        expect((<Year>SimpleCalendarConfiguration.instance.object).weekdays.length).toBe(currentWeekdayLength - 1);
        expect((<Year>SimpleCalendarConfiguration.instance.object).weekdays[0].name).toBe('F');
        expect((<Year>SimpleCalendarConfiguration.instance.object).weekdays[0].numericRepresentation).toBe(1);

        //Check for removing all weekdays
        (<HTMLElement>event.currentTarget).setAttribute('data-index', 'all');
        SimpleCalendarConfiguration.instance.removeFromTable('weekday',event);
        expect(renderSpy).toHaveBeenCalledTimes(3);
        expect((<Year>SimpleCalendarConfiguration.instance.object).weekdays.length).toBe(0);
    });

    test('Add Season', () => {
        const event = new Event('click');
        const currentLength = (<Year>SimpleCalendarConfiguration.instance.object).seasons.length;
        SimpleCalendarConfiguration.instance.addToTable('season', event);
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect((<Year>SimpleCalendarConfiguration.instance.object).seasons.length).toBe(currentLength + 1);
    });

    test('Remove Season', () => {
        const event = new Event('click');
        let currentLength = (<Year>SimpleCalendarConfiguration.instance.object).seasons.length;
        SimpleCalendarConfiguration.instance.removeFromTable('season',event);
        expect(renderSpy).not.toHaveBeenCalled();
        expect((<Year>SimpleCalendarConfiguration.instance.object).seasons.length).toBe(currentLength);

        //Check for invalid index
        (<HTMLElement>event.currentTarget).setAttribute('data-index', 'a');
        currentLength = (<Year>SimpleCalendarConfiguration.instance.object).seasons.length;
        SimpleCalendarConfiguration.instance.removeFromTable('season',event);
        expect(renderSpy).not.toHaveBeenCalled();
        expect((<Year>SimpleCalendarConfiguration.instance.object).seasons.length).toBe(currentLength);

        //Check for index outside of season length
        (<HTMLElement>event.currentTarget).setAttribute('data-index', '12');
        currentLength = (<Year>SimpleCalendarConfiguration.instance.object).seasons.length;
        SimpleCalendarConfiguration.instance.removeFromTable('season',event);
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect((<Year>SimpleCalendarConfiguration.instance.object).seasons.length).toBe(currentLength);

        //Check for valid index
        (<HTMLElement>event.currentTarget).setAttribute('data-index', '0');
        currentLength = (<Year>SimpleCalendarConfiguration.instance.object).seasons.length;
        SimpleCalendarConfiguration.instance.removeFromTable('season',event);
        expect(renderSpy).toHaveBeenCalledTimes(2);
        expect((<Year>SimpleCalendarConfiguration.instance.object).seasons.length).toBe(currentLength - 1);

        //Check for removing all seasons
        (<HTMLElement>event.currentTarget).setAttribute('data-index', 'all');
        SimpleCalendarConfiguration.instance.removeFromTable('season',event);
        expect(renderSpy).toHaveBeenCalledTimes(3);
        expect((<Year>SimpleCalendarConfiguration.instance.object).seasons.length).toBe(0);
    });

    test('Add Moon', () => {
        const event = new Event('click');
        const currentLength = (<Year>SimpleCalendarConfiguration.instance.object).moons.length;
        SimpleCalendarConfiguration.instance.addToTable('moon', event);
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect((<Year>SimpleCalendarConfiguration.instance.object).moons.length).toBe(currentLength + 1);
    });

    test('Remove Moon', () => {
        const event = new Event('click');
        let currentLength = (<Year>SimpleCalendarConfiguration.instance.object).moons.length;
        SimpleCalendarConfiguration.instance.removeFromTable('moon',event);
        expect(renderSpy).not.toHaveBeenCalled();
        expect((<Year>SimpleCalendarConfiguration.instance.object).moons.length).toBe(currentLength);

        //Check for invalid index
        (<HTMLElement>event.currentTarget).setAttribute('data-index', 'a');
        currentLength = (<Year>SimpleCalendarConfiguration.instance.object).moons.length;
        SimpleCalendarConfiguration.instance.removeFromTable('moon',event);
        expect(renderSpy).not.toHaveBeenCalled();
        expect((<Year>SimpleCalendarConfiguration.instance.object).moons.length).toBe(currentLength);

        //Check for index outside of season length
        (<HTMLElement>event.currentTarget).setAttribute('data-index', '12');
        currentLength = (<Year>SimpleCalendarConfiguration.instance.object).moons.length;
        SimpleCalendarConfiguration.instance.removeFromTable('moon',event);
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect((<Year>SimpleCalendarConfiguration.instance.object).moons.length).toBe(currentLength);

        //Check for valid index
        (<HTMLElement>event.currentTarget).setAttribute('data-index', '0');
        currentLength = (<Year>SimpleCalendarConfiguration.instance.object).moons.length;
        SimpleCalendarConfiguration.instance.removeFromTable('moon',event);
        expect(renderSpy).toHaveBeenCalledTimes(2);
        expect((<Year>SimpleCalendarConfiguration.instance.object).moons.length).toBe(currentLength - 1);

        //Check for removing all seasons
        (<HTMLElement>event.currentTarget).setAttribute('data-index', 'all');
        SimpleCalendarConfiguration.instance.removeFromTable('moon',event);
        expect(renderSpy).toHaveBeenCalledTimes(3);
        expect((<Year>SimpleCalendarConfiguration.instance.object).moons.length).toBe(0);
    });

    test('Add Moon Phase', () => {
        const event = new Event('click');
        const currentLength = (<Year>SimpleCalendarConfiguration.instance.object).moons[0].phases.length;
        SimpleCalendarConfiguration.instance.addToTable('moon-phase', event);
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect((<Year>SimpleCalendarConfiguration.instance.object).moons[0].phases.length).toBe(currentLength);

        (<HTMLElement>event.currentTarget).setAttribute('data-moon-index', 'asd');
        SimpleCalendarConfiguration.instance.addToTable('moon-phase', event);
        expect(renderSpy).toHaveBeenCalledTimes(2);
        expect((<Year>SimpleCalendarConfiguration.instance.object).moons[0].phases.length).toBe(currentLength);

        (<HTMLElement>event.currentTarget).setAttribute('data-moon-index', '0');
        SimpleCalendarConfiguration.instance.addToTable('moon-phase', event);
        expect(renderSpy).toHaveBeenCalledTimes(3);
        expect((<Year>SimpleCalendarConfiguration.instance.object).moons[0].phases.length).toBe(currentLength + 1);
    });

    test('Remove Moon Phase', () => {
        const event = new Event('click');
        let currentLength = (<Year>SimpleCalendarConfiguration.instance.object).moons[0].phases.length;
        SimpleCalendarConfiguration.instance.removeFromTable('moon-phase',event);
        expect(renderSpy).not.toHaveBeenCalled();
        expect((<Year>SimpleCalendarConfiguration.instance.object).moons[0].phases.length).toBe(currentLength);

        //Check for invalid index
        (<HTMLElement>event.currentTarget).setAttribute('data-index', 'a');
        currentLength = (<Year>SimpleCalendarConfiguration.instance.object).moons[0].phases.length;
        SimpleCalendarConfiguration.instance.removeFromTable('moon-phase',event);
        expect(renderSpy).not.toHaveBeenCalled();
        expect((<Year>SimpleCalendarConfiguration.instance.object).moons[0].phases.length).toBe(currentLength);

        //Check for index outside of season length
        (<HTMLElement>event.currentTarget).setAttribute('data-index', '12');
        currentLength = (<Year>SimpleCalendarConfiguration.instance.object).moons[0].phases.length;
        SimpleCalendarConfiguration.instance.removeFromTable('moon-phase',event);
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect((<Year>SimpleCalendarConfiguration.instance.object).moons[0].phases.length).toBe(currentLength);

        //Check for valid index
        (<HTMLElement>event.currentTarget).setAttribute('data-index', '0');
        currentLength = (<Year>SimpleCalendarConfiguration.instance.object).moons[0].phases.length;
        SimpleCalendarConfiguration.instance.removeFromTable('moon-phase',event);
        expect(renderSpy).toHaveBeenCalledTimes(2);
        expect((<Year>SimpleCalendarConfiguration.instance.object).moons[0].phases.length).toBe(currentLength);

        //Check for invalid moon index
        (<HTMLElement>event.currentTarget).setAttribute('data-moon-index', 'a');
        SimpleCalendarConfiguration.instance.removeFromTable('moon-phase',event);
        expect(renderSpy).toHaveBeenCalledTimes(3);
        expect((<Year>SimpleCalendarConfiguration.instance.object).moons[0].phases.length).toBe(currentLength);

        //Check for moon index outside of range
        (<HTMLElement>event.currentTarget).setAttribute('data-moon-index', '12');
        SimpleCalendarConfiguration.instance.removeFromTable('moon-phase',event);
        expect(renderSpy).toHaveBeenCalledTimes(4);
        expect((<Year>SimpleCalendarConfiguration.instance.object).moons[0].phases.length).toBe(currentLength);

        //Check for valid moon index
        (<HTMLElement>event.currentTarget).setAttribute('data-moon-index', '0');
        SimpleCalendarConfiguration.instance.removeFromTable('moon-phase',event);
        expect(renderSpy).toHaveBeenCalledTimes(5);
        expect((<Year>SimpleCalendarConfiguration.instance.object).moons[0].phases.length).toBe(currentLength - 1);

        //Check for removing all seasons
        (<HTMLElement>event.currentTarget).setAttribute('data-index', 'all');
        (<HTMLElement>event.currentTarget).removeAttribute('data-moon-index');
        SimpleCalendarConfiguration.instance.removeFromTable('moon-phase',event);
        expect(renderSpy).toHaveBeenCalledTimes(6);
        expect((<Year>SimpleCalendarConfiguration.instance.object).moons[0].phases.length).toBe(0);

        (<HTMLElement>event.currentTarget).setAttribute('data-moon-index', 'a');
        SimpleCalendarConfiguration.instance.removeFromTable('moon-phase',event);
        expect(renderSpy).toHaveBeenCalledTimes(7);
        expect((<Year>SimpleCalendarConfiguration.instance.object).moons[0].phases.length).toBe(0);

        (<HTMLElement>event.currentTarget).setAttribute('data-moon-index', '12');
        SimpleCalendarConfiguration.instance.removeFromTable('moon-phase',event);
        expect(renderSpy).toHaveBeenCalledTimes(8);
        expect((<Year>SimpleCalendarConfiguration.instance.object).moons[0].phases.length).toBe(0);

        (<HTMLElement>event.currentTarget).setAttribute('data-moon-index', '0');
        SimpleCalendarConfiguration.instance.removeFromTable('moon-phase',event);
        expect(renderSpy).toHaveBeenCalledTimes(9);
        expect((<Year>SimpleCalendarConfiguration.instance.object).moons[0].phases.length).toBe(0);
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

        select.value = 'darksun';
        jest.spyOn(document, 'getElementById').mockImplementation().mockReturnValueOnce(select);
        SimpleCalendarConfiguration.instance.predefinedApplyConfirm();
        expect((<Year>SimpleCalendarConfiguration.instance.object).numericRepresentation).toBe(1);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months.length).toBe(15);
        expect((<Year>SimpleCalendarConfiguration.instance.object).weekdays.length).toBe(6);
        expect((<Year>SimpleCalendarConfiguration.instance.object).leapYearRule.rule).toBe(LeapYearRules.None);

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
        expect((<Year>SimpleCalendarConfiguration.instance.object).weekdays.length).toBe(7);
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

        select.value = 'traveller-ic';
        jest.spyOn(document, 'getElementById').mockImplementation().mockReturnValueOnce(select);
        SimpleCalendarConfiguration.instance.predefinedApplyConfirm();
        expect((<Year>SimpleCalendarConfiguration.instance.object).numericRepresentation).toBe(1000);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months.length).toBe(2);
        expect((<Year>SimpleCalendarConfiguration.instance.object).weekdays.length).toBe(7);
        expect((<Year>SimpleCalendarConfiguration.instance.object).leapYearRule.rule).toBe(LeapYearRules.None);

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
        (<HTMLInputElement>event.currentTarget).value = '';

        //@ts-ignore
        expect(SimpleCalendarConfiguration.instance.generalSettings.defaultPlayerNoteVisibility).toBe(false);
        SimpleCalendarConfiguration.instance.inputChange(event);
        //@ts-ignore
        expect(SimpleCalendarConfiguration.instance.generalSettings.defaultPlayerNoteVisibility).toBe(true);
        (<HTMLInputElement>event.currentTarget).id = "asd";
        SimpleCalendarConfiguration.instance.inputChange(event);
        //@ts-ignore
        expect(SimpleCalendarConfiguration.instance.generalSettings.defaultPlayerNoteVisibility).toBe(true);

        (<HTMLInputElement>event.currentTarget).id = "scGameWorldTime";
        (<HTMLInputElement>event.currentTarget).value = 'self';
        SimpleCalendarConfiguration.instance.inputChange(event);
        //@ts-ignore
        expect((<Year>SimpleCalendarConfiguration.instance.object).generalSettings.gameWorldTimeIntegration).toBe('self');

        (<HTMLInputElement>event.currentTarget).id = "scShowClock";
        (<HTMLInputElement>event.currentTarget).checked = true;
        SimpleCalendarConfiguration.instance.inputChange(event);
        //@ts-ignore
        expect((<Year>SimpleCalendarConfiguration.instance.object).generalSettings.showClock ).toBe(true);

        (<HTMLInputElement>event.currentTarget).id = "scPlayersAddNotes";
        (<HTMLInputElement>event.currentTarget).checked = true;
        SimpleCalendarConfiguration.instance.inputChange(event);
        //@ts-ignore
        expect((<Year>SimpleCalendarConfiguration.instance.object).generalSettings.playersAddNotes ).toBe(true);
    });

    test('Year Input Change', () => {
        const event = new Event('change');
        (<HTMLInputElement>event.currentTarget).id = "scCurrentYear";
        //Invalid current year
        (<HTMLInputElement>event.currentTarget).value = 'asd';
        const beforeYear = (<Year>SimpleCalendarConfiguration.instance.object).numericRepresentation;
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).numericRepresentation).toBe(beforeYear);
        //Valid current year
        (<HTMLInputElement>event.currentTarget).value = '10';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).numericRepresentation).toBe(10);

        //Prefix
        (<HTMLInputElement>event.currentTarget).id = "scYearPreFix";
        (<HTMLInputElement>event.currentTarget).value = 'Pre';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).prefix).toBe('Pre');

        //Postfix
        (<HTMLInputElement>event.currentTarget).id = "scYearPostFix";
        (<HTMLInputElement>event.currentTarget).value = 'Post';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).postfix).toBe('Post');

        //Year Zero - Invalid value
        (<HTMLInputElement>event.currentTarget).id = "scYearZero";
        (<HTMLInputElement>event.currentTarget).value = 'asd';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).yearZero).toBe(0);
        //Year Zero - Valid value
        (<HTMLInputElement>event.currentTarget).value = '1970';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).yearZero).toBe(1970);

        //Invalid ID
        (<HTMLInputElement>event.currentTarget).id = "asd";
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).numericRepresentation).toBe(10);
        expect((<Year>SimpleCalendarConfiguration.instance.object).prefix).toBe('Pre');
        expect((<Year>SimpleCalendarConfiguration.instance.object).postfix).toBe('Post');

        //Season Stuff
        (<HTMLInputElement>event.currentTarget).id = "-asd";
        (<HTMLInputElement>event.currentTarget).setAttribute('data-index', '0');
        (<HTMLInputElement>event.currentTarget).setAttribute('class', 'season-name');
        (<HTMLInputElement>event.currentTarget).value = 'Wint';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).seasons[0].name).toBe('Wint');

        (<HTMLInputElement>event.currentTarget).setAttribute('class', 'season-custom');
        (<HTMLInputElement>event.currentTarget).value = '#000000';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).seasons[0].customColor).toBe('#000000');
        (<HTMLInputElement>event.currentTarget).value = '000000';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).seasons[0].customColor).toBe('#000000');

        (<HTMLInputElement>event.currentTarget).setAttribute('class', 'season-month');
        (<HTMLInputElement>event.currentTarget).value = '2';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).seasons[0].startingMonth).toBe(2);
        (<HTMLInputElement>event.currentTarget).value = 'qwe';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).seasons[0].startingMonth).toBe(2);

        (<HTMLInputElement>event.currentTarget).setAttribute('class', 'season-day');
        (<HTMLInputElement>event.currentTarget).value = '2';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).seasons[0].startingDay).toBe(2);
        (<HTMLInputElement>event.currentTarget).value = 'qwe';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).seasons[0].startingDay).toBe(2);

        (<HTMLInputElement>event.currentTarget).setAttribute('class', 'season-color');
        (<HTMLInputElement>event.currentTarget).value = '#fffeee';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).seasons[0].color).toBe('#fffeee');

        (<HTMLInputElement>event.currentTarget).setAttribute('class', 'season-a');
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).seasons[0].color).toBe('#fffeee');
    });

    test('Month Input Change', () => {
        const event = new Event('change');
        (<HTMLInputElement>event.currentTarget).value = '';
        (<HTMLElement>event.currentTarget).classList.remove('next');
        //Test No Attributes
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect(console.debug).toHaveBeenCalledTimes(1);
        //Test set index and no class or value
        (<HTMLElement>event.currentTarget).setAttribute('data-index', 'a');
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect(console.debug).toHaveBeenCalledTimes(2);
        //Test set index and class but no value
        (<HTMLElement>event.currentTarget).classList.add('month-name');
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect(console.debug).toHaveBeenCalledTimes(5);
        //Test all attributes set but invalid index
        (<HTMLInputElement>event.currentTarget).value = 'X';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect(console.debug).toHaveBeenCalledTimes(8);
        //Test all attributes set but index outside of month length
        (<HTMLElement>event.currentTarget).setAttribute('data-index', '12');
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect(console.debug).toHaveBeenCalledTimes(11);
        //Test all attributes for month name change
        (<HTMLElement>event.currentTarget).setAttribute('data-index', '0');
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months[0].name).toBe('X');

        //Test clicking show advanced
        (<HTMLElement>event.currentTarget).classList.remove('month-name');
        (<HTMLElement>event.currentTarget).classList.add('month-show-advanced');
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months[0].showAdvanced).toBe(true);
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months[0].showAdvanced).toBe(false);

        //Test all attributes for month day length change, invalid value
        (<HTMLElement>event.currentTarget).classList.remove('month-show-advanced');
        (<HTMLElement>event.currentTarget).classList.add('month-days');
        let numDays = (<Year>SimpleCalendarConfiguration.instance.object).months[0].numberOfDays;
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months[0].numberOfDays).toBe(numDays);
        //Test all attributes for month day length change, set to same day length
        (<HTMLInputElement>event.currentTarget).value = (<Year>SimpleCalendarConfiguration.instance.object).months[0].numberOfDays.toString();
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months[0].numberOfDays).toBe(numDays);
        //Test all attributes for month day length change
        (<HTMLInputElement>event.currentTarget).value = '20';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months[0].numberOfDays).toBe(20);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months[0].numberOfLeapYearDays).toBe(20);
        //Test all attributes for month day change with leapyear rules set
        (<Year>SimpleCalendarConfiguration.instance.object).leapYearRule.rule = LeapYearRules.Gregorian;
        (<HTMLInputElement>event.currentTarget).value = '19';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months[0].numberOfDays).toBe(19);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months[0].numberOfLeapYearDays).toBe(20);

        //Test intercalary change
        //@ts-ignore
        SimpleCalendarConfiguration.instance.element = {find: jest.fn(()=>{ return {parent: jest.fn(()=>{ return {parent: jest.fn(()=>{ return {parent: jest.fn(() => { return {removeClass: jest.fn(), addClass:jest.fn()} })} })} })} })};
        (<HTMLElement>event.currentTarget).classList.remove('month-days');
        (<HTMLElement>event.currentTarget).classList.add('month-intercalary');
        (<HTMLInputElement>event.currentTarget).checked = true;
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months[0].intercalary).toBe(true);
        (<HTMLInputElement>event.currentTarget).checked = false;
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months[0].intercalary).toBe(false);

        //Test intercalary include change
        (<HTMLElement>event.currentTarget).classList.remove('month-intercalary');
        (<HTMLElement>event.currentTarget).classList.add('month-intercalary-include');
        (<HTMLInputElement>event.currentTarget).checked = true;
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months[0].intercalaryInclude).toBe(true);

        //Test Month Numeric Representation Offset change
        (<HTMLElement>event.currentTarget).classList.remove('month-intercalary-include');
        (<HTMLElement>event.currentTarget).classList.add('month-numeric-representation-offset');
        let nro = (<Year>SimpleCalendarConfiguration.instance.object).months[0].numericRepresentationOffset;
        (<HTMLInputElement>event.currentTarget).value = 'X';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months[0].numericRepresentationOffset).toBe(nro);
        (<HTMLInputElement>event.currentTarget).value = '1';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months[0].numericRepresentationOffset).toBe(1);

        //Test Month Starting Weekday
        (<HTMLElement>event.currentTarget).classList.remove('month-numeric-representation-offset');
        (<HTMLElement>event.currentTarget).classList.add('month-starting-weekday');
        (<HTMLInputElement>event.currentTarget).value = '1';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months[0].startingWeekday).toBe(1);
        (<HTMLInputElement>event.currentTarget).value = 'asd';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months[0].startingWeekday).toBeNull();

        //Test invalid class name
        (<HTMLElement>event.currentTarget).classList.remove('month-starting-weekday');
        (<HTMLElement>event.currentTarget).classList.add('no');
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect(console.debug).toHaveBeenCalledTimes(56);

    });

    test('Show Weekday Input Change', () => {
        const event = new Event('change');
        (<HTMLInputElement>event.currentTarget).id = 'scShowWeekdayHeaders';
        (<HTMLInputElement>event.currentTarget).value = '';
        (<HTMLInputElement>event.currentTarget).checked = true;
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).showWeekdayHeadings).toBe(true);
        (<HTMLInputElement>event.currentTarget).checked = false;
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).showWeekdayHeadings).toBe(false);
    });

    test('Weekday First Day Change', () => {
        const event = new Event('change');
        (<HTMLInputElement>event.currentTarget).id = 'scWeekdayFirstDay';
        (<HTMLInputElement>event.currentTarget).value = 'asd';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).firstWeekday).toBe(0);
        (<HTMLInputElement>event.currentTarget).value = '1';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).firstWeekday).toBe(1);
    });

    test('Weekday Input Change', () => {
        const event = new Event('change');
        (<HTMLElement>event.currentTarget).classList.remove('next');
        (<HTMLElement>event.currentTarget).classList.add('weekday-name');
        (<HTMLInputElement>event.currentTarget).value = '';
        //Test No Attributes
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect(console.debug).toHaveBeenCalledTimes(2);
        //Test set index and no value
        (<HTMLElement>event.currentTarget).setAttribute('data-index', 'a');
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect(console.debug).toHaveBeenCalledTimes(5);
        //Test all attributes set but invalid index
        (<HTMLInputElement>event.currentTarget).value = 'X';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect(console.debug).toHaveBeenCalledTimes(8);
        //Test all attributes set but index outside of weekday length
        (<HTMLElement>event.currentTarget).setAttribute('data-index', '12');
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect(console.debug).toHaveBeenCalledTimes(11);
        //Test all attributes for weekday name change
        (<HTMLElement>event.currentTarget).setAttribute('data-index', '0');
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).weekdays[0].name).toBe('X');
    });

    test('Leap Year Rule Change', () => {
        const event = new Event('change');
        (<HTMLInputElement>event.currentTarget).id = 'scLeapYearRule';
        (<HTMLInputElement>event.currentTarget).value = '';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    test('Leap Year Custom Mod Change', () => {
        const event = new Event('change');
        (<HTMLInputElement>event.currentTarget).id = 'scLeapYearCustomMod';
        (<HTMLInputElement>event.currentTarget).value = '';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect((<Year>SimpleCalendarConfiguration.instance.object).leapYearRule.customMod).toBe(0);
        (<HTMLInputElement>event.currentTarget).value = 'qwe';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect(renderSpy).toHaveBeenCalledTimes(2);
        expect((<Year>SimpleCalendarConfiguration.instance.object).leapYearRule.customMod).toBe(0);
        (<HTMLInputElement>event.currentTarget).value = '2';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect(renderSpy).toHaveBeenCalledTimes(3);
        expect((<Year>SimpleCalendarConfiguration.instance.object).leapYearRule.customMod).toBe(2);
    });

    test('Leap Year Month Change', () => {
        const event = new Event('change');
        (<HTMLElement>event.currentTarget).classList.remove('next');
        (<HTMLElement>event.currentTarget).classList.add('month-leap-days');
        (<HTMLInputElement>event.currentTarget).value = '';
        //Test No Attributes
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect(console.debug).toHaveBeenCalledTimes(2);
        //Test set index and no value
        (<HTMLElement>event.currentTarget).setAttribute('data-index', 'a');
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect(console.debug).toHaveBeenCalledTimes(5);
        //Test all attributes set but invalid index
        (<HTMLInputElement>event.currentTarget).value = '4';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect(console.debug).toHaveBeenCalledTimes(8);
        //Test all attributes set but index outside of weekday length
        (<HTMLElement>event.currentTarget).setAttribute('data-index', '12');
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect(console.debug).toHaveBeenCalledTimes(11);
        //Test all attributes for weekday name change
        (<HTMLElement>event.currentTarget).setAttribute('data-index', '0');
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months[0].numberOfLeapYearDays).toBe(4);
        //Test invalid number of days
        (<HTMLInputElement>event.currentTarget).value = 'asd';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).months[0].numberOfLeapYearDays).toBe(4);
    });

    test('Time Input Change', () => {
        const event = new Event('change');
        (<HTMLInputElement>event.currentTarget).value = '';
        (<HTMLInputElement>event.currentTarget).id = "asd";
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).time.hoursInDay).toBe(24);

        //Invalid hours in day
        (<HTMLInputElement>event.currentTarget).id = "scHoursInDay";
        (<HTMLInputElement>event.currentTarget).value = 'asd';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).time.hoursInDay).toBe(24);
        //Valid hours in day
        (<HTMLInputElement>event.currentTarget).value = '10';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).time.hoursInDay).toBe(10);

        //Invalid minutes in hour
        (<HTMLInputElement>event.currentTarget).id = "scMinutesInHour";
        (<HTMLInputElement>event.currentTarget).value = 'asd';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).time.minutesInHour).toBe(60);
        //Valid minutes in hour
        (<HTMLInputElement>event.currentTarget).value = '10';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).time.minutesInHour).toBe(10);

        //Invalid seconds in minute
        (<HTMLInputElement>event.currentTarget).id = "scSecondsInMinute";
        (<HTMLInputElement>event.currentTarget).value = 'asd';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).time.secondsInMinute).toBe(60);
        //Valid seconds in minute
        (<HTMLInputElement>event.currentTarget).value = '10';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).time.secondsInMinute).toBe(10);

        //Invalid game time ratio
        (<HTMLInputElement>event.currentTarget).id = "scGameTimeRatio";
        (<HTMLInputElement>event.currentTarget).value = 'asd';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).time.gameTimeRatio).toBe(1);
        //Valid game time ratio
        (<HTMLInputElement>event.currentTarget).value = '10';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).time.gameTimeRatio).toBe(10);
    });

    test('Moon Input Change', () => {
        const event = new Event('change');
        (<HTMLElement>event.currentTarget).classList.remove('next');
        (<HTMLElement>event.currentTarget).classList.add('moon-name');
        (<HTMLElement>event.currentTarget).setAttribute('data-index', '0');
        (<HTMLInputElement>event.currentTarget).value = 'moon';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).moons[0].name).toBe('moon');

        (<HTMLElement>event.currentTarget).classList.remove('moon-name');
        (<HTMLElement>event.currentTarget).classList.add('moon-cycle-length');
        let prev:any = (<Year>SimpleCalendarConfiguration.instance.object).moons[0].cycleLength;
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).moons[0].cycleLength).toBe(prev);
        (<HTMLInputElement>event.currentTarget).value = '12.34';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).moons[0].cycleLength).toBe(12.34);

        (<HTMLElement>event.currentTarget).classList.remove('moon-cycle-length');
        (<HTMLElement>event.currentTarget).classList.add('moon-cycle-adjustment');
        (<HTMLInputElement>event.currentTarget).value = 'asd';
        prev = (<Year>SimpleCalendarConfiguration.instance.object).moons[0].cycleDayAdjust;
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).moons[0].cycleDayAdjust).toBe(prev);
        (<HTMLInputElement>event.currentTarget).value = '12.34';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).moons[0].cycleDayAdjust).toBe(12.34);

        (<HTMLElement>event.currentTarget).classList.remove('moon-cycle-adjustment');
        (<HTMLElement>event.currentTarget).classList.add('moon-year-reset');
        (<HTMLInputElement>event.currentTarget).value = 'leap-year';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).moons[0].firstNewMoon.yearReset).toBe(MoonYearResetOptions.LeapYear);

        (<HTMLElement>event.currentTarget).classList.remove('moon-year-reset');
        (<HTMLElement>event.currentTarget).classList.add('moon-year-x');
        (<HTMLInputElement>event.currentTarget).value = 'asd';
        prev = (<Year>SimpleCalendarConfiguration.instance.object).moons[0].firstNewMoon.yearX;
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).moons[0].firstNewMoon.yearX).toBe(prev);
        (<HTMLInputElement>event.currentTarget).value = '12';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).moons[0].firstNewMoon.yearX).toBe(12);

        (<HTMLElement>event.currentTarget).classList.remove('moon-year-x');
        (<HTMLElement>event.currentTarget).classList.add('moon-year');
        (<HTMLInputElement>event.currentTarget).value = 'asd';
        prev = (<Year>SimpleCalendarConfiguration.instance.object).moons[0].firstNewMoon.year;
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).moons[0].firstNewMoon.year).toBe(prev);
        (<HTMLInputElement>event.currentTarget).value = '12';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).moons[0].firstNewMoon.year).toBe(12);

        (<HTMLElement>event.currentTarget).classList.remove('moon-year');
        (<HTMLElement>event.currentTarget).classList.add('moon-month');
        (<HTMLInputElement>event.currentTarget).value = 'asd';
        prev = (<Year>SimpleCalendarConfiguration.instance.object).moons[0].firstNewMoon.month;
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).moons[0].firstNewMoon.month).toBe(prev);
        (<HTMLInputElement>event.currentTarget).value = '12';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).moons[0].firstNewMoon.month).toBe(12);

        (<HTMLElement>event.currentTarget).classList.remove('moon-month');
        (<HTMLElement>event.currentTarget).classList.add('moon-day');
        (<HTMLInputElement>event.currentTarget).value = 'asd';
        prev = (<Year>SimpleCalendarConfiguration.instance.object).moons[0].firstNewMoon.day;
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).moons[0].firstNewMoon.day).toBe(prev);
        (<HTMLInputElement>event.currentTarget).value = '12';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).moons[0].firstNewMoon.day).toBe(12);

        (<HTMLElement>event.currentTarget).classList.remove('moon-day');
        (<HTMLElement>event.currentTarget).classList.add('moon-color');
        (<HTMLInputElement>event.currentTarget).value = 'asd';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).moons[0].color).toBe('#asd');
        (<HTMLInputElement>event.currentTarget).value = '#fff';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).moons[0].color).toBe('#fff');

        (<HTMLElement>event.currentTarget).classList.remove('moon-color');
        (<HTMLElement>event.currentTarget).classList.add('moon-phase-name');
        (<HTMLInputElement>event.currentTarget).value = 'asd';
        prev = (<Year>SimpleCalendarConfiguration.instance.object).moons[0].phases[0].name;
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).moons[0].phases[0].name).toBe(prev);
        (<HTMLElement>event.currentTarget).setAttribute('data-moon-index', 'asd');
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).moons[0].phases[0].name).toBe(prev);
        (<HTMLElement>event.currentTarget).setAttribute('data-moon-index', '0');
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).moons[0].phases[0].name).toBe('asd');

        (<HTMLElement>event.currentTarget).classList.remove('moon-phase-name');
        (<HTMLElement>event.currentTarget).classList.add('moon-phase-single-day');
        (<HTMLInputElement>event.currentTarget).checked = true;
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).moons[0].phases[0].singleDay).toBe(true);

        (<HTMLElement>event.currentTarget).classList.remove('moon-phase-single-day');
        (<HTMLElement>event.currentTarget).classList.add('moon-phase-icon');
        (<HTMLInputElement>event.currentTarget).value = MoonIcons.LastQuarter;
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Year>SimpleCalendarConfiguration.instance.object).moons[0].phases[0].icon).toBe(MoonIcons.LastQuarter);

    });

    test('Update Month Days', () => {
        const m = new Month('Month', 1, 0, 10);
        SimpleCalendarConfiguration.instance.updateMonthDays(m);
        expect(m.numberOfDays).toBe(10);
        expect(m.numberOfLeapYearDays).toBe(10);

        m.numberOfLeapYearDays = -1;
        SimpleCalendarConfiguration.instance.updateMonthDays(m);
        expect(m.numberOfLeapYearDays).toBe(10);

        m.days[9].current = true;
        m.numberOfDays = 5;
        SimpleCalendarConfiguration.instance.updateMonthDays(m);
        expect(m.numberOfDays).toBe(5);
        expect(m.days[0].current).toBe(false);

        m.numberOfDays = -1;
        SimpleCalendarConfiguration.instance.updateMonthDays(m);
        expect(m.numberOfDays).toBe(0);


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
        const gameWorldIntegration = document.createElement('input');
        gameWorldIntegration.value = 'self';
        const showWeekday = document.createElement('input');
        showWeekday.checked = true;

        //Invalid year
        jest.spyOn(document, 'getElementById').mockImplementation().mockReturnValueOnce(gameWorldIntegration).mockReturnValueOnce(invalidYear).mockReturnValueOnce(showWeekday);
        await SimpleCalendarConfiguration.instance.saveClick(event);
        expect(game.settings.set).toHaveBeenCalledTimes(7);
        expect(closeSpy).toHaveBeenCalledTimes(1);

        //Valid year weekday, invalid month days
        //@ts-ignore
        SimpleCalendarConfiguration.instance.yearChanged = true;
        jest.spyOn(document, 'getElementById').mockImplementation().mockReturnValueOnce(gameWorldIntegration).mockReturnValueOnce(validYear).mockReturnValueOnce(showWeekday);
        await SimpleCalendarConfiguration.instance.saveClick(event);
        expect(game.settings.set).toHaveBeenCalledTimes(16);
        expect(closeSpy).toHaveBeenCalledTimes(2);
        expect((<Year>SimpleCalendarConfiguration.instance.object).numericRepresentation).toBe(2);
        expect((<Year>SimpleCalendarConfiguration.instance.object).selectedYear).toBe(2);
        expect((<Year>SimpleCalendarConfiguration.instance.object).visibleYear).toBe(2);

        (<Year>SimpleCalendarConfiguration.instance.object).leapYearRule.rule = LeapYearRules.Gregorian;
        await SimpleCalendarConfiguration.instance.saveClick(event);
        expect(game.settings.set).toHaveBeenCalledTimes(16);
        expect(closeSpy).toHaveBeenCalledTimes(2);
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
