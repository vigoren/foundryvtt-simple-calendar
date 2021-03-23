/**
 * @jest-environment jsdom
 */
import "../../__mocks__/game";
import "../../__mocks__/form-application";
import "../../__mocks__/application";
import "../../__mocks__/crypto";

import {GameSettings} from "./game-settings";
import SimpleCalendar from "./simple-calendar";
import Year from "./year";
import Month from "./month";
import {Weekday} from "./weekday";
import {Note} from "./note";
import LeapYear from "./leap-year";
import {GameWorldTimeIntegrations, LeapYearRules} from "../constants";
import {GeneralSettings, TimeConfig} from "../interfaces";
import Mock = jest.Mock;
import Time from "./time";

describe('Game Settings Class Tests', () => {

    beforeEach(()=>{
        (<Mock>game.settings.get).mockClear();
        (<Mock>game.settings.set).mockClear();
    });

    test('Localize', () => {
        expect(GameSettings.Localize('test')).toBe('');
        expect(game.i18n.localize).toHaveBeenCalled();
    });

    test( 'Is GM', () => {
        const origGameUser = game.user;
        expect(GameSettings.IsGm()).toBe(false);
        //@ts-ignore
        game.user = undefined;
        expect(GameSettings.IsGm()).toBe(false);
        //@ts-ignore
        game.user = origGameUser;
    });

    test('User Name', () => {
        const origGameUser = game.user;
        expect(GameSettings.UserName()).toBe('');
        //@ts-ignore
        game.user = undefined;
        expect(GameSettings.UserName()).toBe('');
        //@ts-ignore
        game.user = origGameUser;
    });

    test('User ID', () => {
        const origGameUser = game.user;
        expect(GameSettings.UserID()).toBe('');
        //@ts-ignore
        game.user = undefined;
        expect(GameSettings.UserID()).toBe('');
        //@ts-ignore
        game.user = origGameUser;
    });

    test('Register Settings', () => {
        SimpleCalendar.instance = new SimpleCalendar();
        GameSettings.RegisterSettings();
        expect(game.settings.register).toHaveBeenCalled();
        expect(game.settings.register).toHaveBeenCalledTimes(10);
    });

    test('Get Import Ran', () => {
        expect(GameSettings.GetImportRan()).toBe(false);
        expect(game.settings.get).toHaveBeenCalled();
    });

    test('Get Default Note Visibility', () => {
        expect(GameSettings.GetDefaultNoteVisibility()).toBe(false);
        expect(game.settings.get).toHaveBeenCalled();
    });

    test('Load General Settings', () => {
        expect(GameSettings.LoadGeneralSettings()).toStrictEqual({gameWorldTimeIntegration: GameWorldTimeIntegrations.None, showClock: false});
        expect(game.settings.get).toHaveBeenCalled();
    });

    test('Load Year Data', () => {
        expect(GameSettings.LoadYearData()).toStrictEqual({numericRepresentation: 0, prefix: '', postfix: '', showWeekdayHeadings: true});
        expect(game.settings.get).toHaveBeenCalled();
    });

    test('Load Current Date', () => {
        expect(GameSettings.LoadCurrentDate()).toStrictEqual({year: 0, month: 1, day: 2, seconds: 3});
        expect(game.settings.get).toHaveBeenCalled();
    });

    test('Load Month Data', () => {
        expect(GameSettings.LoadMonthData()).toStrictEqual([{name: '', numericRepresentation: 1, numberOfDays: 2, numberOfLeapYearDays: 2, intercalary: false, intercalaryInclude: false}]);
        expect(game.settings.get).toHaveBeenCalled();
        (<Mock>game.settings.get).mockReturnValueOnce(false);
        expect(GameSettings.LoadMonthData()).toStrictEqual([]);
        (<Mock>game.settings.get).mockReturnValueOnce([]);
        expect(GameSettings.LoadMonthData()).toStrictEqual([]);
        (<Mock>game.settings.get).mockReturnValueOnce([false]);
        expect(GameSettings.LoadMonthData()).toStrictEqual([]);
    });

    test('Load Weekday Data', () => {
        expect(GameSettings.LoadWeekdayData()).toStrictEqual([{numericRepresentation: 0, name: ''}]);
        expect(game.settings.get).toHaveBeenCalled();
        (<Mock>game.settings.get).mockReturnValueOnce(false);
        expect(GameSettings.LoadWeekdayData()).toStrictEqual([]);
        (<Mock>game.settings.get).mockReturnValueOnce([]);
        expect(GameSettings.LoadWeekdayData()).toStrictEqual([]);
        (<Mock>game.settings.get).mockReturnValueOnce([false]);
        expect(GameSettings.LoadWeekdayData()).toStrictEqual([]);
    });

    test('Load Leap Year Rule', () => {
        expect(GameSettings.LoadLeapYearRules()).toStrictEqual({rule: 'none', customMod: 0});
        expect(game.settings.get).toHaveBeenCalled();
    });

    test('Load Time Data', () => {
        expect(GameSettings.LoadTimeData()).toStrictEqual({hoursInDay:0, minutesInHour: 1, secondsInMinute: 2, gameTimeRatio: 3});
        expect(game.settings.get).toHaveBeenCalled();
    });

    test('Load Notes', () => {
        expect(GameSettings.LoadNotes()).toStrictEqual([{year: 0, month: 1, day: 2, title:'', content:'', author:'', playerVisible: false, id: "abc123"}]);
        expect(game.settings.get).toHaveBeenCalled();
        (<Mock>game.settings.get).mockReturnValueOnce(false);
        expect(GameSettings.LoadNotes()).toStrictEqual([]);
        (<Mock>game.settings.get).mockReturnValueOnce([]);
        expect(GameSettings.LoadNotes()).toStrictEqual([]);
        (<Mock>game.settings.get).mockReturnValueOnce([false]);
        expect(GameSettings.LoadNotes()).toStrictEqual([]);
    });

    test('Set Import Ran', () => {
        // @ts-ignore
        game.user.isGM = false;
        expect(GameSettings.SetImportRan(true)).resolves.toBe(false);
        // @ts-ignore
        game.user.isGM = true;
        expect(GameSettings.SetImportRan(true)).resolves.toBe(true);
        expect(game.settings.set).toHaveBeenCalled();
    });

    test('Save General Settings', () => {
        // @ts-ignore
        game.user.isGM = false;
        let gs: GeneralSettings = {gameWorldTimeIntegration: GameWorldTimeIntegrations.None, showClock: false};
        expect(GameSettings.SaveGeneralSettings(gs)).resolves.toBe(false);
        // @ts-ignore
        game.user.isGM = true;
        expect(GameSettings.SaveGeneralSettings(gs)).resolves.toBe(false);

        gs.showClock = true;
        expect(GameSettings.SaveGeneralSettings(gs)).resolves.toBe(true);
        expect(game.settings.set).toHaveBeenCalled();
    });

    test('Save Current Date', () => {
        jest.spyOn(console, 'error').mockImplementation();
        // @ts-ignore
        game.user.isGM = false;
        const year = new Year(0);
        const month = new Month('T', 1, 10);
        year.months.push(month);
        year.time.seconds = 3;
        expect(GameSettings.SaveCurrentDate(year)).resolves.toBe(false);
        expect(console.error).toHaveBeenCalledTimes(1);
        // @ts-ignore
        game.user.isGM = true;
        expect(GameSettings.SaveCurrentDate(year)).resolves.toBe(false);
        expect(console.error).toHaveBeenCalledTimes(2);
        year.months[0].current = true;
        expect(GameSettings.SaveCurrentDate(year)).resolves.toBe(false);
        expect(console.error).toHaveBeenCalledTimes(3);
        year.months[0].days[1].current = true;
        expect(GameSettings.SaveCurrentDate(year)).resolves.toBe(false);
        expect(game.settings.get).toHaveBeenCalled();
        expect(game.settings.set).not.toHaveBeenCalled();
        (<Mock>game.settings.get).mockClear();
        year.months[0].days[1].current = false;
        year.months[0].days[2].current = true;
        expect(GameSettings.SaveCurrentDate(year)).resolves.toBe(true);
        expect(game.settings.get).toHaveBeenCalled();
        expect(game.settings.set).toHaveBeenCalled();
    });

    test('Save Year Configuration', () => {
        // @ts-ignore
        game.user.isGM = false;
        const year = new Year(0);
        expect(GameSettings.SaveYearConfiguration(year)).resolves.toBe(false);
        // @ts-ignore
        game.user.isGM = true;
        expect(GameSettings.SaveYearConfiguration(year)).resolves.toBe(false);
        expect(game.settings.get).toHaveBeenCalled();
        (<Mock>game.settings.get).mockClear();
        year.numericRepresentation = 1;
        expect(GameSettings.SaveYearConfiguration(year)).resolves.toBe(true);
        expect(game.settings.get).toHaveBeenCalled();
        expect(game.settings.set).toHaveBeenCalled();

        const orig = game.settings.get;
        game.settings.get =(moduleName: string, settingName: string) => { return {numericRepresentation: 0, prefix: '', postfix: ''};};
        expect(GameSettings.SaveYearConfiguration(year)).resolves.toBe(true);
        game.settings.get = orig;

    });

    test('Save Month Configuration', () => {
        // @ts-ignore
        game.user.isGM = false;
        const month = new Month('', 0, 1);
        expect(GameSettings.SaveMonthConfiguration([month])).resolves.toBe(false);
        // @ts-ignore
        game.user.isGM = true;
        expect(GameSettings.SaveMonthConfiguration([month])).resolves.toBe(true);
        expect(game.settings.set).toHaveBeenCalledTimes(1);
        month.name = '';
        month.numericRepresentation = 1;
        month.numberOfDays = 2;
        month.numberOfLeapYearDays = 2;
        expect(GameSettings.SaveMonthConfiguration([month])).resolves.toBe(false);
        expect(game.settings.set).toHaveBeenCalledTimes(1);
    });

    test('Save Weekday Configuration', () => {
        // @ts-ignore
        game.user.isGM = false;
        const weekday = new Weekday(0, '');
        expect(GameSettings.SaveWeekdayConfiguration([weekday])).resolves.toBe(false);
        // @ts-ignore
        game.user.isGM = true;
        expect(GameSettings.SaveWeekdayConfiguration([weekday])).resolves.toBe(false);
        expect(game.settings.set).toHaveBeenCalledTimes(0);
        weekday.numericRepresentation = 1;
        expect(GameSettings.SaveWeekdayConfiguration([weekday])).resolves.toBe(true);
        expect(game.settings.set).toHaveBeenCalledTimes(1);
    });

    test('Save Leap Year Rule', () => {
        // @ts-ignore
        game.user.isGM = false;
        const lr = new LeapYear();
        expect(GameSettings.SaveLeapYearRules(lr)).resolves.toBe(false);
        expect(game.settings.set).toHaveBeenCalledTimes(0);
        // @ts-ignore
        game.user.isGM = true;
        expect(GameSettings.SaveLeapYearRules(lr)).resolves.toBe(false);
        expect(game.settings.set).toHaveBeenCalledTimes(0);
        lr.rule = LeapYearRules.Gregorian;
        expect(GameSettings.SaveLeapYearRules(lr)).resolves.toBe(true);
        expect(game.settings.set).toHaveBeenCalledTimes(1);
    });

    test('Save Time Configuration', () => {
        // @ts-ignore
        game.user.isGM = false;
        let gs = new Time(0, 1, 2);
        gs.gameTimeRatio = 3;
        expect(GameSettings.SaveTimeConfiguration(gs)).resolves.toBe(false);
        // @ts-ignore
        game.user.isGM = true;
        expect(GameSettings.SaveTimeConfiguration(gs)).resolves.toBe(false);

        gs.gameTimeRatio = 4;
        expect(GameSettings.SaveTimeConfiguration(gs)).resolves.toBe(true);
        expect(game.settings.set).toHaveBeenCalled();
    });

    test('Save Notes', () => {
        const note = new Note();
        note.year = 0;
        note.month = 1;
        note.day = 2;
        expect(GameSettings.SaveNotes([note])).resolves.toBe(true);
        expect(game.settings.set).toHaveBeenCalled();
    });

    test('Set Default Note Visibility', () => {
        // @ts-ignore
        game.user.isGM = false;
        expect(GameSettings.SetDefaultNoteVisibility(true)).resolves.toBe(false);
        // @ts-ignore
        game.user.isGM = true;
        expect(GameSettings.SetDefaultNoteVisibility(true)).resolves.toBe(true);
        expect(game.settings.set).toHaveBeenCalled();
    });

    test('UI Notification', () => {
        GameSettings.UiNotification('');
        //@ts-ignore
        expect(ui.notifications.info).toHaveBeenCalledTimes(1);
        GameSettings.UiNotification('', 'warn');
        //@ts-ignore
        expect(ui.notifications.warn).toHaveBeenCalledTimes(1);
        GameSettings.UiNotification('', 'error');
        //@ts-ignore
        expect(ui.notifications.error).toHaveBeenCalledTimes(1);
        GameSettings.UiNotification('', 'asdasd');
        //@ts-ignore
        expect(ui.notifications.info).toHaveBeenCalledTimes(1);
        //@ts-ignore
        expect(ui.notifications.warn).toHaveBeenCalledTimes(1);
        //@ts-ignore
        expect(ui.notifications.error).toHaveBeenCalledTimes(1);

        const origUi = ui.notifications;
        ui.notifications = undefined;
        GameSettings.UiNotification('');
        expect(console.error).toHaveBeenCalled();
        ui.notifications = origUi;
    });
});
