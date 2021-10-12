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

import {SimpleCalendarConfiguration} from "./simple-calendar-configuration";
import Year from "./year";
import Month from "./month";
import {Weekday} from "./weekday";
import {Logger} from "./logging";
import {LeapYearRules, MoonIcons, MoonYearResetOptions, YearNamingRules} from "../constants";
import Season from "./season";
import Moon from "./moon";
import SpyInstance = jest.SpyInstance;
import Mock = jest.Mock;
import SimpleCalendar from "./simple-calendar";
import Note from "./note";
import Calendar from "./calendar";

jest.mock('file-saver');


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

        SimpleCalendar.instance = new SimpleCalendar();

        SimpleCalendar.instance.activeCalendar.year = y;
        //Set up a new Simple Calendar instance
        SimpleCalendarConfiguration.instance = new SimpleCalendarConfiguration(SimpleCalendar.instance.activeCalendar);

        //Spy on the inherited render function of the new instance
        //@ts-ignore
        renderSpy = jest.spyOn(SimpleCalendarConfiguration.instance, 'render');
        //Clear all mock calls
        (<Mock>console.error).mockClear();
        (<Mock>console.debug).mockClear();
        renderSpy.mockClear();
        (<Mock>(<Game>game).settings.set).mockClear();
    });

    test('Constructor', () => {
        SimpleCalendar.instance.activeCalendar.year = y;
        SimpleCalendar.instance.activeCalendar.noteCategories.push({name: 'a', color:'a', textColor: 'a'});
        //@ts-ignore
        SimpleCalendarConfiguration.instance = new SimpleCalendarConfiguration();
        //@ts-ignore
        expect(SimpleCalendarConfiguration.instance.object).toStrictEqual(SimpleCalendar.instance.activeCalendar);
        //@ts-ignore
        expect(SimpleCalendarConfiguration.instance.noteCategories ).toStrictEqual([{name: 'a', color:'a', textColor: 'a'}]);
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
        SimpleCalendar.instance.activeCalendar.year = y;
        let data = SimpleCalendarConfiguration.instance.getData();
        //@ts-ignore
        expect(data.currentYear).toStrictEqual(y);
        //@ts-ignore
        expect(data.months).toStrictEqual(y.months.map(m => m.toTemplate()));
        //@ts-ignore
        expect(data.weekdays).toStrictEqual(y.weekdays.map(m => m.toTemplate()));

        (<Mock>(<Game>game).modules.get).mockReturnValueOnce({active:true, data: {version: '0.8.0'}}).mockReturnValueOnce({active:true}).mockReturnValueOnce({active:true});
        data = SimpleCalendarConfiguration.instance.getData();
        //@ts-ignore
        expect(data.importing.showCalendarWeather).toBe(true);
        //@ts-ignore
        expect(data.importing.showAboutTime).toBe(true);

        const orig = (<Game>game).users;
        //@ts-ignore
        game.user.isGM = true;
        data = SimpleCalendarConfiguration.instance.getData();
        //@ts-ignore
        expect(data.users).toStrictEqual({});
        //@ts-ignore
        game.users = [{isGM: false, id: 'asd', name: 'name'}];
        data = SimpleCalendarConfiguration.instance.getData();
        //@ts-ignore
        expect(data.users).toStrictEqual({'asd': 'name'});
        //@ts-ignore
        game.users = false;
        // @ts-ignore
        SimpleCalendar.instance = null;
        data = SimpleCalendarConfiguration.instance.getData();
        //@ts-ignore
        expect(data.users).toStrictEqual({});
        (<Game>game).users = orig;
    });

    test('Update Object', () => {
        //@ts-ignore
        expect(SimpleCalendarConfiguration.instance._updateObject()).resolves.toBeUndefined();
    });

    test('Date Format Table Click', () => {
        //@ts-ignore
        SimpleCalendarConfiguration.instance.dateFormatTableClick();
        //@ts-ignore
        expect(SimpleCalendarConfiguration.instance.dateFormatTableExpanded).toBe(true);
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
        expect(fakeQuery.find).toHaveBeenCalledTimes(37);
        expect(onFunc).toHaveBeenCalledTimes(37);
    });

    test('Rebase Month Numbers', () => {
        SimpleCalendarConfiguration.instance.rebaseMonthNumbers();
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.months[0].numericRepresentation).toBe(1);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.months[1].numericRepresentation).toBe(2);
        (<Calendar>SimpleCalendarConfiguration.instance.object).year.months[0].intercalary = true;
        SimpleCalendarConfiguration.instance.rebaseMonthNumbers();
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.months[0].numericRepresentation).toBe(-1);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.months[1].numericRepresentation).toBe(1);
    });

    test('Add Month', () => {
        const event = new Event('click');
        const currentMonthLength = (<Calendar>SimpleCalendarConfiguration.instance.object).year.months.length;
        SimpleCalendarConfiguration.instance.addToTable('month', event);
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.months.length).toBe(currentMonthLength + 1);
    });

    test('Remove Month', () => {
        const event = new Event('click');
        let currentMonthLength = (<Calendar>SimpleCalendarConfiguration.instance.object).year.months.length;
        SimpleCalendarConfiguration.instance.removeFromTable('month',event);
        expect(renderSpy).not.toHaveBeenCalled();
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.months.length).toBe(currentMonthLength);

        //Check for invalid index
        (<HTMLElement>event.currentTarget).setAttribute('data-index', 'a');
        currentMonthLength = (<Calendar>SimpleCalendarConfiguration.instance.object).year.months.length;
        SimpleCalendarConfiguration.instance.removeFromTable('month',event);
        expect(renderSpy).not.toHaveBeenCalled();
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.months.length).toBe(currentMonthLength);

        //Check for index outside of month length
        (<HTMLElement>event.currentTarget).setAttribute('data-index', '12');
        currentMonthLength = (<Calendar>SimpleCalendarConfiguration.instance.object).year.months.length;
        SimpleCalendarConfiguration.instance.removeFromTable('month',event);
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.months.length).toBe(currentMonthLength);

        //Check for valid index
        (<HTMLElement>event.currentTarget).setAttribute('data-index', '0');
        currentMonthLength = (<Calendar>SimpleCalendarConfiguration.instance.object).year.months.length;
        SimpleCalendarConfiguration.instance.removeFromTable('month',event);
        expect(renderSpy).toHaveBeenCalledTimes(2);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.months.length).toBe(currentMonthLength - 1);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.months[0].name).toBe('T');
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.months[0].days.length).toBe(15);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.months[0].numericRepresentation).toBe(1);

        //Check for removing all months
        (<HTMLElement>event.currentTarget).setAttribute('data-index', 'all');
        SimpleCalendarConfiguration.instance.removeFromTable('month',event);
        expect(renderSpy).toHaveBeenCalledTimes(3);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.months.length).toBe(0);
    });

    test('Add Weekday', () => {
        const event = new Event('click');
        const currentWeekdayLength = (<Calendar>SimpleCalendarConfiguration.instance.object).year.weekdays.length;
        SimpleCalendarConfiguration.instance.addToTable('weekday', event);
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.weekdays.length).toBe(currentWeekdayLength + 1);
    });

    test('Remove Weekday', () => {
        const event = new Event('click');
        let currentWeekdayLength = (<Calendar>SimpleCalendarConfiguration.instance.object).year.weekdays.length;
        SimpleCalendarConfiguration.instance.removeFromTable('weekday',event);
        expect(renderSpy).not.toHaveBeenCalled();
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.weekdays.length).toBe(currentWeekdayLength);

        //Check for invalid index
        (<HTMLElement>event.currentTarget).setAttribute('data-index', 'a');
        currentWeekdayLength = (<Calendar>SimpleCalendarConfiguration.instance.object).year.weekdays.length;
        SimpleCalendarConfiguration.instance.removeFromTable('weekday',event);
        expect(renderSpy).not.toHaveBeenCalled();
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.weekdays.length).toBe(currentWeekdayLength);

        //Check for index outside of weekday length
        (<HTMLElement>event.currentTarget).setAttribute('data-index', '12');
        currentWeekdayLength = (<Calendar>SimpleCalendarConfiguration.instance.object).year.weekdays.length;
        SimpleCalendarConfiguration.instance.removeFromTable('weekday',event);
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.weekdays.length).toBe(currentWeekdayLength);

        //Check for valid index
        (<HTMLElement>event.currentTarget).setAttribute('data-index', '0');
        currentWeekdayLength = (<Calendar>SimpleCalendarConfiguration.instance.object).year.weekdays.length;
        SimpleCalendarConfiguration.instance.removeFromTable('weekday',event);
        expect(renderSpy).toHaveBeenCalledTimes(2);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.weekdays.length).toBe(currentWeekdayLength - 1);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.weekdays[0].name).toBe('F');
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.weekdays[0].numericRepresentation).toBe(1);

        //Check for removing all weekdays
        (<HTMLElement>event.currentTarget).setAttribute('data-index', 'all');
        SimpleCalendarConfiguration.instance.removeFromTable('weekday',event);
        expect(renderSpy).toHaveBeenCalledTimes(3);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.weekdays.length).toBe(0);
    });

    test('Add Year Name', () => {
        const event = new Event('click');
        const currentLength = (<Calendar>SimpleCalendarConfiguration.instance.object).year.yearNames.length;
        SimpleCalendarConfiguration.instance.addToTable('year-name', event);
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.yearNames.length).toBe(currentLength + 1);
    });

    test('Remove Year Name', () => {
        const event = new Event('click');
        (<Calendar>SimpleCalendarConfiguration.instance.object).year.yearNames.push('Year Name 1');
        (<Calendar>SimpleCalendarConfiguration.instance.object).year.yearNames.push('Year Name 2');
        let currentLength = (<Calendar>SimpleCalendarConfiguration.instance.object).year.yearNames.length;
        SimpleCalendarConfiguration.instance.removeFromTable('year-name',event);
        expect(renderSpy).not.toHaveBeenCalled();
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.yearNames.length).toBe(currentLength);

        //Check for invalid index
        (<HTMLElement>event.currentTarget).setAttribute('data-index', 'a');
        currentLength = (<Calendar>SimpleCalendarConfiguration.instance.object).year.yearNames.length;
        SimpleCalendarConfiguration.instance.removeFromTable('year-name',event);
        expect(renderSpy).not.toHaveBeenCalled();
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.yearNames.length).toBe(currentLength);

        //Check for index outside of season length
        (<HTMLElement>event.currentTarget).setAttribute('data-index', '12');
        currentLength = (<Calendar>SimpleCalendarConfiguration.instance.object).year.yearNames.length;
        SimpleCalendarConfiguration.instance.removeFromTable('year-name',event);
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.yearNames.length).toBe(currentLength);

        //Check for valid index
        (<HTMLElement>event.currentTarget).setAttribute('data-index', '0');
        currentLength = (<Calendar>SimpleCalendarConfiguration.instance.object).year.yearNames.length;
        SimpleCalendarConfiguration.instance.removeFromTable('year-name',event);
        expect(renderSpy).toHaveBeenCalledTimes(2);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.yearNames.length).toBe(currentLength - 1);

        //Check for removing all seasons
        (<HTMLElement>event.currentTarget).setAttribute('data-index', 'all');
        SimpleCalendarConfiguration.instance.removeFromTable('year-name',event);
        expect(renderSpy).toHaveBeenCalledTimes(3);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.yearNames.length).toBe(0);
    });

    test('Add Season', () => {
        const event = new Event('click');
        const currentLength = (<Calendar>SimpleCalendarConfiguration.instance.object).year.seasons.length;
        SimpleCalendarConfiguration.instance.addToTable('season', event);
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.seasons.length).toBe(currentLength + 1);
    });

    test('Remove Season', () => {
        const event = new Event('click');
        let currentLength = (<Calendar>SimpleCalendarConfiguration.instance.object).year.seasons.length;
        SimpleCalendarConfiguration.instance.removeFromTable('season',event);
        expect(renderSpy).not.toHaveBeenCalled();
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.seasons.length).toBe(currentLength);

        //Check for invalid index
        (<HTMLElement>event.currentTarget).setAttribute('data-index', 'a');
        currentLength = (<Calendar>SimpleCalendarConfiguration.instance.object).year.seasons.length;
        SimpleCalendarConfiguration.instance.removeFromTable('season',event);
        expect(renderSpy).not.toHaveBeenCalled();
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.seasons.length).toBe(currentLength);

        //Check for index outside of season length
        (<HTMLElement>event.currentTarget).setAttribute('data-index', '12');
        currentLength = (<Calendar>SimpleCalendarConfiguration.instance.object).year.seasons.length;
        SimpleCalendarConfiguration.instance.removeFromTable('season',event);
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.seasons.length).toBe(currentLength);

        //Check for valid index
        (<HTMLElement>event.currentTarget).setAttribute('data-index', '0');
        currentLength = (<Calendar>SimpleCalendarConfiguration.instance.object).year.seasons.length;
        SimpleCalendarConfiguration.instance.removeFromTable('season',event);
        expect(renderSpy).toHaveBeenCalledTimes(2);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.seasons.length).toBe(currentLength - 1);

        //Check for removing all seasons
        (<HTMLElement>event.currentTarget).setAttribute('data-index', 'all');
        SimpleCalendarConfiguration.instance.removeFromTable('season',event);
        expect(renderSpy).toHaveBeenCalledTimes(3);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.seasons.length).toBe(0);
    });

    test('Add Moon', () => {
        const event = new Event('click');
        const currentLength = (<Calendar>SimpleCalendarConfiguration.instance.object).year.moons.length;
        SimpleCalendarConfiguration.instance.addToTable('moon', event);
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.moons.length).toBe(currentLength + 1);
    });

    test('Remove Moon', () => {
        const event = new Event('click');
        let currentLength = (<Calendar>SimpleCalendarConfiguration.instance.object).year.moons.length;
        SimpleCalendarConfiguration.instance.removeFromTable('moon',event);
        expect(renderSpy).not.toHaveBeenCalled();
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.moons.length).toBe(currentLength);

        //Check for invalid index
        (<HTMLElement>event.currentTarget).setAttribute('data-index', 'a');
        currentLength = (<Calendar>SimpleCalendarConfiguration.instance.object).year.moons.length;
        SimpleCalendarConfiguration.instance.removeFromTable('moon',event);
        expect(renderSpy).not.toHaveBeenCalled();
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.moons.length).toBe(currentLength);

        //Check for index outside of season length
        (<HTMLElement>event.currentTarget).setAttribute('data-index', '12');
        currentLength = (<Calendar>SimpleCalendarConfiguration.instance.object).year.moons.length;
        SimpleCalendarConfiguration.instance.removeFromTable('moon',event);
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.moons.length).toBe(currentLength);

        //Check for valid index
        (<HTMLElement>event.currentTarget).setAttribute('data-index', '0');
        currentLength = (<Calendar>SimpleCalendarConfiguration.instance.object).year.moons.length;
        SimpleCalendarConfiguration.instance.removeFromTable('moon',event);
        expect(renderSpy).toHaveBeenCalledTimes(2);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.moons.length).toBe(currentLength - 1);

        //Check for removing all seasons
        (<HTMLElement>event.currentTarget).setAttribute('data-index', 'all');
        SimpleCalendarConfiguration.instance.removeFromTable('moon',event);
        expect(renderSpy).toHaveBeenCalledTimes(3);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.moons.length).toBe(0);
    });

    test('Add Moon Phase', () => {
        const event = new Event('click');
        const currentLength = (<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].phases.length;
        SimpleCalendarConfiguration.instance.addToTable('moon-phase', event);
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].phases.length).toBe(currentLength);

        (<HTMLElement>event.currentTarget).setAttribute('data-moon-index', 'asd');
        SimpleCalendarConfiguration.instance.addToTable('moon-phase', event);
        expect(renderSpy).toHaveBeenCalledTimes(2);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].phases.length).toBe(currentLength);

        (<HTMLElement>event.currentTarget).setAttribute('data-moon-index', '0');
        SimpleCalendarConfiguration.instance.addToTable('moon-phase', event);
        expect(renderSpy).toHaveBeenCalledTimes(3);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].phases.length).toBe(currentLength + 1);
    });

    test('Remove Moon Phase', () => {
        const event = new Event('click');
        let currentLength = (<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].phases.length;
        SimpleCalendarConfiguration.instance.removeFromTable('moon-phase',event);
        expect(renderSpy).not.toHaveBeenCalled();
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].phases.length).toBe(currentLength);

        //Check for invalid index
        (<HTMLElement>event.currentTarget).setAttribute('data-index', 'a');
        currentLength = (<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].phases.length;
        SimpleCalendarConfiguration.instance.removeFromTable('moon-phase',event);
        expect(renderSpy).not.toHaveBeenCalled();
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].phases.length).toBe(currentLength);

        //Check for index outside of season length
        (<HTMLElement>event.currentTarget).setAttribute('data-index', '12');
        currentLength = (<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].phases.length;
        SimpleCalendarConfiguration.instance.removeFromTable('moon-phase',event);
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].phases.length).toBe(currentLength);

        //Check for valid index
        (<HTMLElement>event.currentTarget).setAttribute('data-index', '0');
        currentLength = (<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].phases.length;
        SimpleCalendarConfiguration.instance.removeFromTable('moon-phase',event);
        expect(renderSpy).toHaveBeenCalledTimes(2);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].phases.length).toBe(currentLength);

        //Check for invalid moon index
        (<HTMLElement>event.currentTarget).setAttribute('data-moon-index', 'a');
        SimpleCalendarConfiguration.instance.removeFromTable('moon-phase',event);
        expect(renderSpy).toHaveBeenCalledTimes(3);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].phases.length).toBe(currentLength);

        //Check for moon index outside of range
        (<HTMLElement>event.currentTarget).setAttribute('data-moon-index', '12');
        SimpleCalendarConfiguration.instance.removeFromTable('moon-phase',event);
        expect(renderSpy).toHaveBeenCalledTimes(4);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].phases.length).toBe(currentLength);

        //Check for valid moon index
        (<HTMLElement>event.currentTarget).setAttribute('data-moon-index', '0');
        SimpleCalendarConfiguration.instance.removeFromTable('moon-phase',event);
        expect(renderSpy).toHaveBeenCalledTimes(5);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].phases.length).toBe(currentLength - 1);

        //Check for removing all seasons
        (<HTMLElement>event.currentTarget).setAttribute('data-index', 'all');
        (<HTMLElement>event.currentTarget).removeAttribute('data-moon-index');
        SimpleCalendarConfiguration.instance.removeFromTable('moon-phase',event);
        expect(renderSpy).toHaveBeenCalledTimes(6);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].phases.length).toBe(0);

        (<HTMLElement>event.currentTarget).setAttribute('data-moon-index', 'a');
        SimpleCalendarConfiguration.instance.removeFromTable('moon-phase',event);
        expect(renderSpy).toHaveBeenCalledTimes(7);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].phases.length).toBe(0);

        (<HTMLElement>event.currentTarget).setAttribute('data-moon-index', '12');
        SimpleCalendarConfiguration.instance.removeFromTable('moon-phase',event);
        expect(renderSpy).toHaveBeenCalledTimes(8);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].phases.length).toBe(0);

        (<HTMLElement>event.currentTarget).setAttribute('data-moon-index', '0');
        SimpleCalendarConfiguration.instance.removeFromTable('moon-phase',event);
        expect(renderSpy).toHaveBeenCalledTimes(9);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].phases.length).toBe(0);
    });

    test('Add Note Category', () => {
        const event = new Event('click');
        // @ts-ignore
        const currentLength = SimpleCalendarConfiguration.instance.noteCategories.length;
        SimpleCalendarConfiguration.instance.addToTable('note-category', event);
        expect(renderSpy).toHaveBeenCalledTimes(1);
        // @ts-ignore
        expect(SimpleCalendarConfiguration.instance.noteCategories.length).toBe(currentLength + 1);
    });

    test('Remove Note Category', () => {
        const event = new Event('click');
        // @ts-ignore
        SimpleCalendarConfiguration.instance.noteCategories.push({name: 'a', color: 'a', textColor: 'a'});
        // @ts-ignore
        let currentLength = SimpleCalendarConfiguration.instance.noteCategories.length;
        SimpleCalendarConfiguration.instance.removeFromTable('note-category',event);
        expect(renderSpy).not.toHaveBeenCalled();
        // @ts-ignore
        expect(SimpleCalendarConfiguration.instance.noteCategories.length).toBe(currentLength);

        //Check for invalid index
        (<HTMLElement>event.currentTarget).setAttribute('data-index', 'a');
        // @ts-ignore
        currentLength = SimpleCalendarConfiguration.instance.noteCategories.length;
        SimpleCalendarConfiguration.instance.removeFromTable('note-category',event);
        expect(renderSpy).not.toHaveBeenCalled();
        // @ts-ignore
        expect(SimpleCalendarConfiguration.instance.noteCategories.length).toBe(currentLength);

        //Check for index outside of season length
        (<HTMLElement>event.currentTarget).setAttribute('data-index', '12');
        // @ts-ignore
        currentLength = SimpleCalendarConfiguration.instance.noteCategories.length;
        SimpleCalendarConfiguration.instance.removeFromTable('note-category',event);
        expect(renderSpy).toHaveBeenCalledTimes(1);
        // @ts-ignore
        expect(SimpleCalendarConfiguration.instance.noteCategories.length).toBe(currentLength);

        //Check for valid index
        (<HTMLElement>event.currentTarget).setAttribute('data-index', '0');
        // @ts-ignore
        currentLength = SimpleCalendarConfiguration.instance.noteCategories.length;
        SimpleCalendarConfiguration.instance.removeFromTable('note-category',event);
        expect(renderSpy).toHaveBeenCalledTimes(2);
        // @ts-ignore
        expect(SimpleCalendarConfiguration.instance.noteCategories.length).toBe(currentLength - 1);

        //Check for removing all seasons
        (<HTMLElement>event.currentTarget).setAttribute('data-index', 'all');
        SimpleCalendarConfiguration.instance.removeFromTable('note-category',event);
        expect(renderSpy).toHaveBeenCalledTimes(3);
        // @ts-ignore
        expect(SimpleCalendarConfiguration.instance.noteCategories.length).toBe(0);
    });

    test('Predefined Apply Confirm', () => {
        const select = document.createElement('input');

        select.value = 'gregorian';
        jest.spyOn(document, 'getElementById').mockImplementation().mockReturnValueOnce(select);
        SimpleCalendarConfiguration.instance.predefinedApplyConfirm();
        const d = new Date();
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.numericRepresentation).toBe(d.getFullYear());
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.months.length).toBe(12);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.weekdays.length).toBe(7);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.leapYearRule.rule).toBe(LeapYearRules.Gregorian);

        select.value = 'darksun';
        jest.spyOn(document, 'getElementById').mockImplementation().mockReturnValueOnce(select);
        SimpleCalendarConfiguration.instance.predefinedApplyConfirm();
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.numericRepresentation).toBe(1);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.months.length).toBe(15);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.weekdays.length).toBe(6);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.leapYearRule.rule).toBe(LeapYearRules.None);

        select.value = 'eberron';
        jest.spyOn(document, 'getElementById').mockImplementation().mockReturnValueOnce(select);
        SimpleCalendarConfiguration.instance.predefinedApplyConfirm();
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.numericRepresentation).toBe(998);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.months.length).toBe(12);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.weekdays.length).toBe(7);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.leapYearRule.rule).toBe(LeapYearRules.None);

        select.value = 'exandrian';
        jest.spyOn(document, 'getElementById').mockImplementation().mockReturnValueOnce(select);
        SimpleCalendarConfiguration.instance.predefinedApplyConfirm();
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.numericRepresentation).toBe(812);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.months.length).toBe(11);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.weekdays.length).toBe(7);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.leapYearRule.rule).toBe(LeapYearRules.None);

        select.value = 'golarianpf1e';
        jest.spyOn(document, 'getElementById').mockImplementation().mockReturnValueOnce(select);
        SimpleCalendarConfiguration.instance.predefinedApplyConfirm();
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.numericRepresentation).toBe(4710);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.months.length).toBe(12);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.weekdays.length).toBe(7);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.leapYearRule.rule).toBe(LeapYearRules.Custom);

        select.value = 'golarianpf2e';
        jest.spyOn(document, 'getElementById').mockImplementation().mockReturnValueOnce(select);
        SimpleCalendarConfiguration.instance.predefinedApplyConfirm();
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.numericRepresentation).toBe(4710);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.months.length).toBe(12);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.weekdays.length).toBe(7);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.leapYearRule.rule).toBe(LeapYearRules.Custom);

        select.value = 'greyhawk';
        jest.spyOn(document, 'getElementById').mockImplementation().mockReturnValueOnce(select);
        SimpleCalendarConfiguration.instance.predefinedApplyConfirm();
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.numericRepresentation).toBe(591);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.months.length).toBe(16);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.weekdays.length).toBe(7);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.leapYearRule.rule).toBe(LeapYearRules.None);

        select.value = 'harptos';
        jest.spyOn(document, 'getElementById').mockImplementation().mockReturnValueOnce(select);
        SimpleCalendarConfiguration.instance.predefinedApplyConfirm();
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.numericRepresentation).toBe(1495);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.months.length).toBe(18);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.weekdays.length).toBe(10);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.leapYearRule.rule).toBe(LeapYearRules.Custom);

        select.value = 'traveller-ic';
        jest.spyOn(document, 'getElementById').mockImplementation().mockReturnValueOnce(select);
        SimpleCalendarConfiguration.instance.predefinedApplyConfirm();
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.numericRepresentation).toBe(1000);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.months.length).toBe(2);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.weekdays.length).toBe(7);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.leapYearRule.rule).toBe(LeapYearRules.None);

        select.value = 'warhammer';
        jest.spyOn(document, 'getElementById').mockImplementation().mockReturnValueOnce(select);
        SimpleCalendarConfiguration.instance.predefinedApplyConfirm();
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.numericRepresentation).toBe(2522);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.months.length).toBe(18);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.weekdays.length).toBe(8);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.leapYearRule.rule).toBe(LeapYearRules.None);

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
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).generalSettings.gameWorldTimeIntegration).toBe('self');

        (<HTMLInputElement>event.currentTarget).id = "scShowClock";
        (<HTMLInputElement>event.currentTarget).checked = true;
        SimpleCalendarConfiguration.instance.inputChange(event);
        //@ts-ignore
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).generalSettings.showClock ).toBe(true);

        (<HTMLInputElement>event.currentTarget).id = "scPF2ESync";
        (<HTMLInputElement>event.currentTarget).checked = true;
        SimpleCalendarConfiguration.instance.inputChange(event);
        //@ts-ignore
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).generalSettings.pf2eSync ).toBe(true);

        (<HTMLInputElement>event.currentTarget).id = "scDateFormatsDate";
        (<HTMLInputElement>event.currentTarget).value = 'MMMM';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).generalSettings.dateFormat.date).toBe('MMMM');

        (<HTMLInputElement>event.currentTarget).id = "scDateFormatsTime";
        (<HTMLInputElement>event.currentTarget).value = 'HH';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).generalSettings.dateFormat.time).toBe('HH');

        (<HTMLInputElement>event.currentTarget).id = "scDateFormatsMonthYear";
        (<HTMLInputElement>event.currentTarget).value = 'M YY';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).generalSettings.dateFormat.monthYear).toBe('M YY');
    });

    test('Permission Input Change', () => {
        const event = new Event('change');
        (<HTMLInputElement>event.currentTarget).id = "scCalendarVisibleP";
        (<HTMLInputElement>event.currentTarget).checked = true;
        (<HTMLInputElement>event.currentTarget).value = '';

        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).generalSettings.permissions.viewCalendar.player ).toBe(true);
        (<HTMLInputElement>event.currentTarget).id = "scCalendarVisibleTP";
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).generalSettings.permissions.viewCalendar.trustedPlayer ).toBe(true);
        (<HTMLInputElement>event.currentTarget).id = "scCalendarVisibleAGM";
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).generalSettings.permissions.viewCalendar.assistantGameMaster ).toBe(true);

        (<HTMLInputElement>event.currentTarget).id = "scAddNotesP";
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).generalSettings.permissions.addNotes.player ).toBe(true);
        (<HTMLInputElement>event.currentTarget).id = "scAddNotesTP";
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).generalSettings.permissions.addNotes.trustedPlayer ).toBe(true);
        (<HTMLInputElement>event.currentTarget).id = "scAddNotesAGM";
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).generalSettings.permissions.addNotes.assistantGameMaster ).toBe(true);

        (<HTMLInputElement>event.currentTarget).id = "scChangeDateTimeP";
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).generalSettings.permissions.changeDateTime.player ).toBe(true);
        (<HTMLInputElement>event.currentTarget).id = "scChangeDateTimeTP";
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).generalSettings.permissions.changeDateTime.trustedPlayer ).toBe(true);
        (<HTMLInputElement>event.currentTarget).id = "scChangeDateTimeAGM";
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).generalSettings.permissions.changeDateTime.assistantGameMaster ).toBe(true);

        (<HTMLInputElement>event.currentTarget).id = "scReorderNotesP";
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).generalSettings.permissions.reorderNotes.player ).toBe(true);
        (<HTMLInputElement>event.currentTarget).id = "scReorderNotesTP";
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).generalSettings.permissions.reorderNotes.trustedPlayer ).toBe(true);
        (<HTMLInputElement>event.currentTarget).id = "scReorderNotesAGM";
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).generalSettings.permissions.reorderNotes.assistantGameMaster ).toBe(true);
    });

    test('Year Input Change', () => {
        const event = new Event('change');
        (<HTMLInputElement>event.currentTarget).id = "scCurrentYear";
        //Invalid current year
        (<HTMLInputElement>event.currentTarget).value = 'asd';
        const beforeYear = (<Calendar>SimpleCalendarConfiguration.instance.object).year.numericRepresentation;
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.numericRepresentation).toBe(beforeYear);
        //Valid current year
        (<HTMLInputElement>event.currentTarget).value = '10';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.numericRepresentation).toBe(10);

        //Prefix
        (<HTMLInputElement>event.currentTarget).id = "scYearPreFix";
        (<HTMLInputElement>event.currentTarget).value = 'Pre';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.prefix).toBe('Pre');

        //Postfix
        (<HTMLInputElement>event.currentTarget).id = "scYearPostFix";
        (<HTMLInputElement>event.currentTarget).value = 'Post';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.postfix).toBe('Post');

        //Year Zero - Invalid value
        (<HTMLInputElement>event.currentTarget).id = "scYearZero";
        (<HTMLInputElement>event.currentTarget).value = 'asd';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.yearZero).toBe(0);
        //Year Zero - Valid value
        (<HTMLInputElement>event.currentTarget).value = '1970';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.yearZero).toBe(1970);

        //Year Name Behaviour
        (<HTMLInputElement>event.currentTarget).id = "scYearNameBehaviour";
        (<HTMLInputElement>event.currentTarget).value = 'random';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.yearNamingRule).toBe(YearNamingRules.Random);

        //Year Name Start - Invalid value
        (<HTMLInputElement>event.currentTarget).id = "scYearNamesStart";
        (<HTMLInputElement>event.currentTarget).value = 'asd';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.yearNamesStart).toBe(0);
        //Year Name Start - Valid value
        (<HTMLInputElement>event.currentTarget).value = '1970';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.yearNamesStart).toBe(1970);

        // Year Name
        (<Calendar>SimpleCalendarConfiguration.instance.object).year.yearNames.push('Name');
        (<HTMLInputElement>event.currentTarget).id = "-asd";
        (<HTMLInputElement>event.currentTarget).setAttribute('data-index', '0');
        (<HTMLInputElement>event.currentTarget).setAttribute('class', 'year-name');
        (<HTMLInputElement>event.currentTarget).value = 'New Name';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.yearNames[0]).toBe('New Name');


        //Invalid ID
        (<HTMLInputElement>event.currentTarget).id = "asd";
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.numericRepresentation).toBe(10);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.prefix).toBe('Pre');
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.postfix).toBe('Post');

        //Season Stuff
        (<HTMLInputElement>event.currentTarget).id = "-asd";
        (<HTMLInputElement>event.currentTarget).setAttribute('data-index', '0');
        (<HTMLInputElement>event.currentTarget).setAttribute('class', 'season-name');
        (<HTMLInputElement>event.currentTarget).value = 'Wint';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.seasons[0].name).toBe('Wint');

        (<HTMLInputElement>event.currentTarget).setAttribute('class', 'season-color');
        (<HTMLInputElement>event.currentTarget).value = '#fffeee';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.seasons[0].color).toBe('#fffeee');

        (<HTMLInputElement>event.currentTarget).setAttribute('class', 'season-a');
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.seasons[0].color).toBe('#fffeee');
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
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.months[0].name).toBe('X');

        //Abbreviation
        (<HTMLElement>event.currentTarget).classList.remove('month-name');
        (<HTMLElement>event.currentTarget).classList.add('month-abbreviation');
        (<HTMLInputElement>event.currentTarget).value = 'A';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.months[0].abbreviation).toBe('A');

        //Test clicking show advanced
        (<HTMLElement>event.currentTarget).classList.remove('month-abbreviation');
        (<HTMLElement>event.currentTarget).classList.add('month-show-advanced');
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.months[0].showAdvanced).toBe(true);
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.months[0].showAdvanced).toBe(false);

        //Test all attributes for month day length change, invalid value
        (<HTMLElement>event.currentTarget).classList.remove('month-show-advanced');
        (<HTMLElement>event.currentTarget).classList.add('month-days');
        let numDays = (<Calendar>SimpleCalendarConfiguration.instance.object).year.months[0].numberOfDays;
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.months[0].numberOfDays).toBe(numDays);
        //Test all attributes for month day length change, set to same day length
        (<HTMLInputElement>event.currentTarget).value = (<Calendar>SimpleCalendarConfiguration.instance.object).year.months[0].numberOfDays.toString();
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.months[0].numberOfDays).toBe(numDays);
        //Test all attributes for month day length change
        (<HTMLInputElement>event.currentTarget).value = '20';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.months[0].numberOfDays).toBe(20);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.months[0].numberOfLeapYearDays).toBe(20);
        //Test all attributes for month day change with leapyear rules set
        (<Calendar>SimpleCalendarConfiguration.instance.object).year.leapYearRule.rule = LeapYearRules.Gregorian;
        (<HTMLInputElement>event.currentTarget).value = '19';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.months[0].numberOfDays).toBe(19);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.months[0].numberOfLeapYearDays).toBe(20);

        //Test intercalary change
        //@ts-ignore
        SimpleCalendarConfiguration.instance.element = {find: jest.fn(()=>{ return {parent: jest.fn(()=>{ return {parent: jest.fn(()=>{ return {parent: jest.fn(() => { return {removeClass: jest.fn(), addClass:jest.fn()} })} })} })} })};
        (<HTMLElement>event.currentTarget).classList.remove('month-days');
        (<HTMLElement>event.currentTarget).classList.add('month-intercalary');
        (<HTMLInputElement>event.currentTarget).checked = true;
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.months[0].intercalary).toBe(true);
        (<HTMLInputElement>event.currentTarget).checked = false;
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.months[0].intercalary).toBe(false);

        //Test intercalary include change
        (<HTMLElement>event.currentTarget).classList.remove('month-intercalary');
        (<HTMLElement>event.currentTarget).classList.add('month-intercalary-include');
        (<HTMLInputElement>event.currentTarget).checked = true;
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.months[0].intercalaryInclude).toBe(true);

        //Test Month Numeric Representation Offset change
        (<HTMLElement>event.currentTarget).classList.remove('month-intercalary-include');
        (<HTMLElement>event.currentTarget).classList.add('month-numeric-representation-offset');
        let nro = (<Calendar>SimpleCalendarConfiguration.instance.object).year.months[0].numericRepresentationOffset;
        (<HTMLInputElement>event.currentTarget).value = 'X';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.months[0].numericRepresentationOffset).toBe(nro);
        (<HTMLInputElement>event.currentTarget).value = '1';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.months[0].numericRepresentationOffset).toBe(1);

        //Test Month Starting Weekday
        (<HTMLElement>event.currentTarget).classList.remove('month-numeric-representation-offset');
        (<HTMLElement>event.currentTarget).classList.add('month-starting-weekday');
        (<HTMLInputElement>event.currentTarget).value = '1';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.months[0].startingWeekday).toBe(1);
        (<HTMLInputElement>event.currentTarget).value = 'asd';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.months[0].startingWeekday).toBeNull();

        //Test invalid class name
        (<HTMLElement>event.currentTarget).classList.remove('month-starting-weekday');
        (<HTMLElement>event.currentTarget).classList.add('no');
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect(console.debug).toHaveBeenCalledTimes(59);

    });

    test('Show Weekday Input Change', () => {
        const event = new Event('change');
        (<HTMLInputElement>event.currentTarget).id = 'scShowWeekdayHeaders';
        (<HTMLInputElement>event.currentTarget).value = '';
        (<HTMLInputElement>event.currentTarget).checked = true;
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.showWeekdayHeadings).toBe(true);
        (<HTMLInputElement>event.currentTarget).checked = false;
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.showWeekdayHeadings).toBe(false);
    });

    test('Note Category Input Change', () => {
        //@ts-ignore
        SimpleCalendarConfiguration.instance.noteCategories.push({name: 'a', color: 'a', textColor: 'a'});
        //@ts-ignore
        SimpleCalendarConfiguration.instance.noteCategories.push({name: 'b', color: 'b', textColor: 'b'});
        SimpleCalendar.instance = new SimpleCalendar();
        const event = new Event('change');
        (<HTMLElement>event.currentTarget).classList.remove('next');
        (<HTMLInputElement>event.currentTarget).classList.add('note-category-name');
        (<HTMLElement>event.currentTarget).setAttribute('data-index', '0');
        (<HTMLInputElement>event.currentTarget).value = 'asd';
        SimpleCalendarConfiguration.instance.inputChange(event);
        //@ts-ignore
        expect(SimpleCalendarConfiguration.instance.noteCategories[0].name).toBe('asd');

        SimpleCalendar.instance.activeCalendar.noteCategories.push({name: 'asd', color: 'a', textColor: 'a'});
        SimpleCalendar.instance.activeCalendar.noteCategories.push({name: 'b', color: 'b', textColor: 'b'});
        const n = new Note();
        n.categories.push('asd');
        SimpleCalendar.instance.activeCalendar.notes.push(n);
        (<HTMLInputElement>event.currentTarget).value = 'qwe';
        SimpleCalendarConfiguration.instance.inputChange(event);
        //@ts-ignore
        expect(SimpleCalendarConfiguration.instance.noteCategories[0].name).toBe('qwe');
        expect(n.categories).toStrictEqual(['qwe']);
        //@ts-ignore
        SimpleCalendarConfiguration.instance.noteCategories[0].name = 'asd';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect(n.categories).toStrictEqual(['qwe']);

        (<HTMLElement>event.currentTarget).classList.remove('note-category-name');
        (<HTMLInputElement>event.currentTarget).classList.add('note-category-color');
        (<HTMLInputElement>event.currentTarget).value = '#ffffff';
        SimpleCalendarConfiguration.instance.inputChange(event);
        //@ts-ignore
        expect(SimpleCalendarConfiguration.instance.noteCategories[0].color).toBe('#ffffff');
        //@ts-ignore
        expect(SimpleCalendarConfiguration.instance.noteCategories[0].textColor).toBe('#000000');

    });

    test('Weekday First Day Change', () => {
        const event = new Event('change');
        (<HTMLInputElement>event.currentTarget).id = 'scWeekdayFirstDay';
        (<HTMLInputElement>event.currentTarget).value = 'asd';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.firstWeekday).toBe(0);
        (<HTMLInputElement>event.currentTarget).value = '1';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.firstWeekday).toBe(1);
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
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.weekdays[0].name).toBe('X');

        (<HTMLElement>event.currentTarget).classList.remove('weekday-name');
        (<HTMLElement>event.currentTarget).classList.add('weekday-abbreviation');
        (<HTMLInputElement>event.currentTarget).value = 'A';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.weekdays[0].abbreviation).toBe('A');
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
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.leapYearRule.customMod).toBe(0);
        (<HTMLInputElement>event.currentTarget).value = 'qwe';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect(renderSpy).toHaveBeenCalledTimes(2);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.leapYearRule.customMod).toBe(0);
        (<HTMLInputElement>event.currentTarget).value = '2';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect(renderSpy).toHaveBeenCalledTimes(3);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.leapYearRule.customMod).toBe(2);
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
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.months[0].numberOfLeapYearDays).toBe(4);
        //Test invalid number of days
        (<HTMLInputElement>event.currentTarget).value = 'asd';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.months[0].numberOfLeapYearDays).toBe(4);
    });

    test('Time Input Change', () => {
        const event = new Event('change');
        (<HTMLInputElement>event.currentTarget).value = '';
        (<HTMLInputElement>event.currentTarget).id = "asd";
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.time.hoursInDay).toBe(24);

        //Invalid hours in day
        (<HTMLInputElement>event.currentTarget).id = "scHoursInDay";
        (<HTMLInputElement>event.currentTarget).value = 'asd';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.time.hoursInDay).toBe(24);
        //Valid hours in day
        (<HTMLInputElement>event.currentTarget).value = '10';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.time.hoursInDay).toBe(10);

        //Invalid minutes in hour
        (<HTMLInputElement>event.currentTarget).id = "scMinutesInHour";
        (<HTMLInputElement>event.currentTarget).value = 'asd';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.time.minutesInHour).toBe(60);
        //Valid minutes in hour
        (<HTMLInputElement>event.currentTarget).value = '10';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.time.minutesInHour).toBe(10);

        //Invalid seconds in minute
        (<HTMLInputElement>event.currentTarget).id = "scSecondsInMinute";
        (<HTMLInputElement>event.currentTarget).value = 'asd';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.time.secondsInMinute).toBe(60);
        //Valid seconds in minute
        (<HTMLInputElement>event.currentTarget).value = '10';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.time.secondsInMinute).toBe(10);

        //Invalid seconds in combat round
        (<HTMLInputElement>event.currentTarget).id = "scSecondsInCombatRound";
        (<HTMLInputElement>event.currentTarget).value = 'asd';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.time.secondsInCombatRound).toBe(6);
        //Valid seconds in combat round
        (<HTMLInputElement>event.currentTarget).value = '10';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.time.secondsInCombatRound).toBe(10);

        //Invalid game time ratio
        (<HTMLInputElement>event.currentTarget).id = "scGameTimeRatio";
        (<HTMLInputElement>event.currentTarget).value = 'asd';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.time.gameTimeRatio).toBe(1);
        //Valid game time ratio
        (<HTMLInputElement>event.currentTarget).value = '10';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.time.gameTimeRatio).toBe(10);

        //Unified Clock With Foundry Pause
        (<HTMLInputElement>event.currentTarget).id = "scUnifyClockWithFoundryPause";
        (<HTMLInputElement>event.currentTarget).checked = true;
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.time.unifyGameAndClockPause).toBe(true);

        //Invalid update frequency
        (<HTMLInputElement>event.currentTarget).id = "scTimeUpdateFrequency";
        (<HTMLInputElement>event.currentTarget).value = 'asd';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.time.updateFrequency).toBe(1);
        //Valid update frequency
        (<HTMLInputElement>event.currentTarget).value = '10';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.time.updateFrequency).toBe(10);
    });

    test('Moon Input Change', () => {
        const event = new Event('change');
        (<HTMLElement>event.currentTarget).classList.remove('next');
        (<HTMLElement>event.currentTarget).classList.add('moon-name');
        (<HTMLElement>event.currentTarget).setAttribute('data-index', '0');
        (<HTMLInputElement>event.currentTarget).value = 'moon';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].name).toBe('moon');

        (<HTMLElement>event.currentTarget).classList.remove('moon-name');
        (<HTMLElement>event.currentTarget).classList.add('moon-cycle-length');
        let prev:any = (<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].cycleLength;
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].cycleLength).toBe(prev);
        (<HTMLInputElement>event.currentTarget).value = '12.34';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].cycleLength).toBe(12.34);

        (<HTMLElement>event.currentTarget).classList.remove('moon-cycle-length');
        (<HTMLElement>event.currentTarget).classList.add('moon-cycle-adjustment');
        (<HTMLInputElement>event.currentTarget).value = 'asd';
        prev = (<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].cycleDayAdjust;
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].cycleDayAdjust).toBe(prev);
        (<HTMLInputElement>event.currentTarget).value = '12.34';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].cycleDayAdjust).toBe(12.34);

        (<HTMLElement>event.currentTarget).classList.remove('moon-cycle-adjustment');
        (<HTMLElement>event.currentTarget).classList.add('moon-year-reset');
        (<HTMLInputElement>event.currentTarget).value = 'leap-year';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].firstNewMoon.yearReset).toBe(MoonYearResetOptions.LeapYear);

        (<HTMLElement>event.currentTarget).classList.remove('moon-year-reset');
        (<HTMLElement>event.currentTarget).classList.add('moon-year-x');
        (<HTMLInputElement>event.currentTarget).value = 'asd';
        prev = (<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].firstNewMoon.yearX;
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].firstNewMoon.yearX).toBe(prev);
        (<HTMLInputElement>event.currentTarget).value = '12';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].firstNewMoon.yearX).toBe(12);

        (<HTMLElement>event.currentTarget).classList.remove('moon-year-x');
        (<HTMLElement>event.currentTarget).classList.add('moon-year');
        (<HTMLInputElement>event.currentTarget).value = 'asd';
        prev = (<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].firstNewMoon.year;
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].firstNewMoon.year).toBe(prev);
        (<HTMLInputElement>event.currentTarget).value = '12';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].firstNewMoon.year).toBe(12);

        (<HTMLElement>event.currentTarget).classList.remove('moon-year');
        (<HTMLElement>event.currentTarget).classList.add('moon-month');
        (<HTMLInputElement>event.currentTarget).value = 'asd';
        prev = (<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].firstNewMoon.month;
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].firstNewMoon.month).toBe(prev);
        (<HTMLInputElement>event.currentTarget).value = '12';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].firstNewMoon.month).toBe(12);

        (<HTMLElement>event.currentTarget).classList.remove('moon-month');
        (<HTMLElement>event.currentTarget).classList.add('moon-day');
        (<HTMLInputElement>event.currentTarget).value = 'asd';
        prev = (<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].firstNewMoon.day;
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].firstNewMoon.day).toBe(prev);
        (<HTMLInputElement>event.currentTarget).value = '12';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].firstNewMoon.day).toBe(12);

        (<HTMLElement>event.currentTarget).classList.remove('moon-day');
        (<HTMLElement>event.currentTarget).classList.add('moon-color');
        (<HTMLInputElement>event.currentTarget).value = 'asd';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].color).toBe('#asd');
        (<HTMLInputElement>event.currentTarget).value = '#fff';
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].color).toBe('#fff');

        (<HTMLElement>event.currentTarget).classList.remove('moon-color');
        (<HTMLElement>event.currentTarget).classList.add('moon-phase-name');
        (<HTMLInputElement>event.currentTarget).value = 'asd';
        prev = (<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].phases[0].name;
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].phases[0].name).toBe(prev);
        (<HTMLElement>event.currentTarget).setAttribute('data-moon-index', 'asd');
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].phases[0].name).toBe(prev);
        (<HTMLElement>event.currentTarget).setAttribute('data-moon-index', '0');
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].phases[0].name).toBe('asd');

        (<HTMLElement>event.currentTarget).classList.remove('moon-phase-name');
        (<HTMLElement>event.currentTarget).classList.add('moon-phase-single-day');
        (<HTMLInputElement>event.currentTarget).checked = true;
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].phases[0].singleDay).toBe(true);

        (<HTMLElement>event.currentTarget).classList.remove('moon-phase-single-day');
        (<HTMLElement>event.currentTarget).classList.add('moon-phase-icon');
        (<HTMLInputElement>event.currentTarget).value = MoonIcons.LastQuarter;
        SimpleCalendarConfiguration.instance.inputChange(event);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.moons[0].phases[0].icon).toBe(MoonIcons.LastQuarter);

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
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(8);
        expect(closeSpy).toHaveBeenCalledTimes(1);

        //Valid year weekday, invalid month days
        //@ts-ignore
        SimpleCalendarConfiguration.instance.yearChanged = true;
        jest.spyOn(document, 'getElementById').mockImplementation().mockReturnValueOnce(gameWorldIntegration).mockReturnValueOnce(validYear).mockReturnValueOnce(showWeekday);
        await SimpleCalendarConfiguration.instance.saveClick(event);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(17);
        expect(closeSpy).toHaveBeenCalledTimes(2);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.numericRepresentation).toBe(2);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.selectedYear).toBe(2);
        expect((<Calendar>SimpleCalendarConfiguration.instance.object).year.visibleYear).toBe(2);

        (<Calendar>SimpleCalendarConfiguration.instance.object).year.leapYearRule.rule = LeapYearRules.Gregorian;
        await SimpleCalendarConfiguration.instance.saveClick(event);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(17);
        expect(closeSpy).toHaveBeenCalledTimes(2);

        SimpleCalendar.instance = new SimpleCalendar();
        SimpleCalendar.instance.activeCalendar.year = <Year>SimpleCalendarConfiguration.instance.object;
        jest.spyOn(document, 'getElementById').mockImplementation().mockReturnValueOnce(gameWorldIntegration).mockReturnValueOnce(validYear).mockReturnValueOnce(showWeekday);
        await SimpleCalendarConfiguration.instance.saveClick(event);
    });

    test('Overwrite Confirmation Yes', async () => {
        //@ts-ignore
        game.user.isGM = true;
        await SimpleCalendarConfiguration.instance.overwriteConfirmationYes('a', 'b');
        expect(renderSpy).not.toHaveBeenCalled();
        expect((<Game>game).settings.set).not.toHaveBeenCalled();

        const select = document.createElement('input');
        select.value = 'gregorian';
        jest.spyOn(document, 'getElementById').mockImplementation().mockReturnValue(select);
        await SimpleCalendarConfiguration.instance.overwriteConfirmationYes('predefined', 'b');
        expect(renderSpy).toHaveBeenCalledTimes(1);
        expect((<Game>game).settings.set).not.toHaveBeenCalled();

        await SimpleCalendarConfiguration.instance.overwriteConfirmationYes('tp-import', 'b');
        expect(renderSpy).toHaveBeenCalledTimes(1);

        await SimpleCalendarConfiguration.instance.overwriteConfirmationYes('tp-import', 'about-time');
        expect(renderSpy).toHaveBeenCalledTimes(2);

        await SimpleCalendarConfiguration.instance.overwriteConfirmationYes('tp-import', 'calendar-weather');
        expect(renderSpy).toHaveBeenCalledTimes(3);

        await SimpleCalendarConfiguration.instance.overwriteConfirmationYes('tp-export', 'b');
        expect(renderSpy).toHaveBeenCalledTimes(3);

        await SimpleCalendarConfiguration.instance.overwriteConfirmationYes('tp-export', 'about-time');
        expect(renderSpy).toHaveBeenCalledTimes(3);

        await SimpleCalendarConfiguration.instance.overwriteConfirmationYes('tp-export', 'calendar-weather');
        expect(renderSpy).toHaveBeenCalledTimes(3);

        (<Mock>(<Game>game).settings.set).mockClear();
    });

    test('Export Calendar', () => {
        SimpleCalendarConfiguration.instance.exportCalendar(new Event('click'));
    });

    test('Import Calendar', () => {
        const event = new Event('click');
        SimpleCalendarConfiguration.instance.importCalendar(event);
        //@ts-ignore
        expect(ui.notifications.warn).toHaveBeenCalledTimes(1);

        const fileInput = {
            files: []
        };
        (<Mock>document.getElementById).mockReturnValueOnce(fileInput);

        SimpleCalendarConfiguration.instance.importCalendar(event);
        //@ts-ignore
        expect(ui.notifications.warn).toHaveBeenCalledTimes(2);
        //@ts-ignore
        fileInput.files.push(new Blob(['invalid'], {type:'application/json'}));
        (<Mock>document.getElementById).mockReturnValueOnce(fileInput);

        SimpleCalendarConfiguration.instance.importCalendar(event);
        //@ts-ignore
        expect(ui.notifications.warn).toHaveBeenCalledTimes(2);
    });

    test('Import Calendar On Load', () => {
        const reader = {
            result: ""
        };
        const event = new Event('click');

        //@ts-ignore
        SimpleCalendarConfiguration.instance.importOnLoad(reader, event);
        //@ts-ignore
        expect(ui.notifications.error).toHaveBeenCalledTimes(0);

        reader.result = "{{asd";
        //@ts-ignore
        SimpleCalendarConfiguration.instance.importOnLoad(reader, event);
        //@ts-ignore
        expect(ui.notifications.error).toHaveBeenCalledTimes(1);

        reader.result = "{}";
        //@ts-ignore
        SimpleCalendarConfiguration.instance.importOnLoad(reader, event);
        //@ts-ignore
        expect(ui.notifications.error).toHaveBeenCalledTimes(1);

        reader.result = "{\"currentDate\":{\"year\":1999,\"month\":3,\"day\":35,\"seconds\":72014},\"generalSettings\":{\"gameWorldTimeIntegration\":\"mixed\",\"showClock\":true,\"pf2eSync\":true,\"permissions\":{\"viewCalendar\":{\"player\":true,\"trustedPlayer\":true,\"assistantGameMaster\":true},\"addNotes\":{\"player\":false,\"trustedPlayer\":false,\"assistantGameMaster\":false},\"changeDateTime\":{\"player\":false,\"trustedPlayer\":false,\"assistantGameMaster\":false}}},\"leapYearSettings\":{\"rule\":\"gregorian\",\"customMod\":0},\"monthSettings\":[{\"name\":\"New Month1\",\"numericRepresentation\":1,\"numericRepresentationOffset\":0,\"numberOfDays\":30,\"numberOfLeapYearDays\":30,\"intercalary\":false,\"intercalaryInclude\":false,\"startingWeekday\":null},{\"name\":\"New Month2\",\"numericRepresentation\":2,\"numericRepresentationOffset\":0,\"numberOfDays\":17,\"numberOfLeapYearDays\":17,\"intercalary\":false,\"intercalaryInclude\":false,\"startingWeekday\":null},{\"name\":\"New 3\",\"numericRepresentation\":-1,\"numericRepresentationOffset\":0,\"numberOfDays\":1,\"numberOfLeapYearDays\":1,\"intercalary\":true,\"intercalaryInclude\":false,\"startingWeekday\":null},{\"name\":\"New Month4\",\"numericRepresentation\":3,\"numericRepresentationOffset\":17,\"numberOfDays\":18,\"numberOfLeapYearDays\":19,\"intercalary\":false,\"intercalaryInclude\":false,\"startingWeekday\":null},{\"name\":\"New Month5\",\"numericRepresentation\":4,\"numericRepresentationOffset\":0,\"numberOfDays\":30,\"numberOfLeapYearDays\":30,\"intercalary\":false,\"intercalaryInclude\":false,\"startingWeekday\":null}],\"moonSettings\":[{\"name\":\"Moon\",\"cycleLength\":29.53059,\"firstNewMoon\":{\"yearReset\":\"none\",\"yearX\":0,\"year\":2000,\"month\":1,\"day\":6},\"phases\":[{\"name\":\"New Moon\",\"length\":1,\"icon\":\"new\",\"singleDay\":true},{\"name\":\"Waxing Crescent\",\"length\":6.3826,\"icon\":\"waxing-crescent\",\"singleDay\":false},{\"name\":\"First Quarter\",\"length\":1,\"icon\":\"first-quarter\",\"singleDay\":true},{\"name\":\"Waxing Gibbous\",\"length\":6.3826,\"icon\":\"waxing-gibbous\",\"singleDay\":false},{\"name\":\"Full Moon\",\"length\":1,\"icon\":\"full\",\"singleDay\":true},{\"name\":\"Waning Gibbous\",\"length\":6.3826,\"icon\":\"waning-gibbous\",\"singleDay\":false},{\"name\":\"Last Quarter\",\"length\":1,\"icon\":\"last-quarter\",\"singleDay\":true},{\"name\":\"Waning Crescent\",\"length\":6.3826,\"icon\":\"waning-crescent\",\"singleDay\":false}],\"color\":\"#ffffff\",\"cycleDayAdjust\":0.5}],\"seasonSettings\":[{\"name\":\"Spring\",\"startingMonth\":3,\"startingDay\":20,\"color\":\"#fffce8\",\"customColor\":\"\"},{\"name\":\"Summer\",\"startingMonth\":6,\"startingDay\":20,\"color\":\"#f3fff3\",\"customColor\":\"\"},{\"name\":\"Fall\",\"startingMonth\":9,\"startingDay\":22,\"color\":\"#fff7f2\",\"customColor\":\"\"},{\"name\":\"Winter\",\"startingMonth\":12,\"startingDay\":21,\"color\":\"#f2f8ff\",\"customColor\":\"\"}],\"timeSettings\":{\"hoursInDay\":24,\"minutesInHour\":60,\"secondsInMinute\":60,\"gameTimeRatio\":1,\"unifyGameAndClockPause\":false,\"updateFrequency\":1},\"weekdaySettings\":[{\"name\":\"Sunday\",\"numericRepresentation\":1},{\"name\":\"Monday\",\"numericRepresentation\":2},{\"name\":\"Tuesday\",\"numericRepresentation\":3},{\"name\":\"Wednesday\",\"numericRepresentation\":4},{\"name\":\"Thursday\",\"numericRepresentation\":5},{\"name\":\"Friday\",\"numericRepresentation\":6},{\"name\":\"Saturday\",\"numericRepresentation\":7}],\"yearSettings\":{\"numericRepresentation\":2021,\"prefix\":\"\",\"postfix\":\"\",\"showWeekdayHeadings\":true,\"firstWeekday\":4,\"yearZero\":1970,\"yearNames\":[],\"yearNamingRule\":\"default\",\"yearNamesStart\":0},\"noteCategories\":[{\"name\": \"a\"}]}";
        //@ts-ignore
        SimpleCalendarConfiguration.instance.importOnLoad(reader, event);
        //@ts-ignore
        expect(ui.notifications.error).toHaveBeenCalledTimes(1);
    });
});
