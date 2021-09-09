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
import {GeneralSettings} from "../interfaces";
import Mock = jest.Mock;
import Time from "./time";
import Season from "./season";
import Moon from "./moon";

describe('Game Settings Class Tests', () => {

    beforeEach(()=>{
        (<Mock>(<Game>game).settings.get).mockClear();
        (<Mock>(<Game>game).settings.set).mockClear();
        (<Mock>(<Game>game).socket?.emit).mockClear();
    });

    test('Localize', () => {
        expect(GameSettings.Localize('test')).toBe('');
        expect((<Game>game).i18n.localize).toHaveBeenCalled();
    });

    test( 'Is GM', () => {
        const origGameUser = (<Game>game).user;
        expect(GameSettings.IsGm()).toBe(false);
        //@ts-ignore
        game.user = undefined;
        expect(GameSettings.IsGm()).toBe(false);
        //@ts-ignore
        game.user = origGameUser;
    });

    test('User Name', () => {
        const origGameUser = (<Game>game).user;
        expect(GameSettings.UserName()).toBe('');
        //@ts-ignore
        game.user = undefined;
        expect(GameSettings.UserName()).toBe('');
        //@ts-ignore
        game.user = {name: 'name'};
        expect(GameSettings.UserName()).toBe('name');
        //@ts-ignore
        game.user = origGameUser;
    });

    test('User ID', () => {
        const origGameUser = (<Game>game).user;
        expect(GameSettings.UserID()).toBe('');
        //@ts-ignore
        game.user = undefined;
        expect(GameSettings.UserID()).toBe('');
        //@ts-ignore
        game.user = {id: 'id'};
        expect(GameSettings.UserID()).toBe('id');
        //@ts-ignore
        game.user = origGameUser;
    });

    test('Get User', () => {
        const origGameUser = (<Game>game).users;
        expect(GameSettings.GetUser('')).toBe(false);
        //@ts-ignore
        game.users = undefined;
        expect(GameSettings.GetUser('')).toBeUndefined();
        //@ts-ignore
        game.users = [{id: 'id'}];
        expect(GameSettings.GetUser('id')).toBeDefined();
        //@ts-ignore
        game.users = origGameUser;
    });

    test('Register Settings', () => {
        SimpleCalendar.instance = new SimpleCalendar();
        GameSettings.RegisterSettings();
        expect((<Game>game).settings.register).toHaveBeenCalled();
        expect((<Game>game).settings.register).toHaveBeenCalledTimes(13);
    });

    test('Get Default Note Visibility', () => {
        expect(GameSettings.GetDefaultNoteVisibility()).toBe(false);
        expect((<Game>game).settings.get).toHaveBeenCalled();
    });

    test('Load General Settings', () => {
        expect(GameSettings.LoadGeneralSettings()).toStrictEqual({gameWorldTimeIntegration: GameWorldTimeIntegrations.None, showClock: false, pf2eSync: true, permissions: {viewCalendar: {player:true, trustedPlayer: true, assistantGameMaster: true, users: undefined}, addNotes:{player:false, trustedPlayer: false, assistantGameMaster: false, users: undefined}, changeDateTime:{player:false, trustedPlayer: false, assistantGameMaster: false, users: undefined}, reorderNotes: {player:false, trustedPlayer: false, assistantGameMaster: false}}});
        expect((<Game>game).settings.get).toHaveBeenCalled();
    });

    test('Load Year Data', () => {
        expect(GameSettings.LoadYearData()).toStrictEqual({numericRepresentation: 0, prefix: '', postfix: '', showWeekdayHeadings: true, firstWeekday: 0, yearZero: 0, yearNames: [], yearNamingRule: 'default', yearNamesStart: 0});
        expect((<Game>game).settings.get).toHaveBeenCalled();
    });

    test('Load Current Date', () => {
        expect(GameSettings.LoadCurrentDate()).toStrictEqual({year: 0, month: 1, day: 2, seconds: 3});
        expect((<Game>game).settings.get).toHaveBeenCalled();
    });

    test('Load Month Data', () => {
        expect(GameSettings.LoadMonthData()).toStrictEqual([{name: '', numericRepresentation: 1, numericRepresentationOffset: 0, numberOfDays: 2, numberOfLeapYearDays: 2, intercalary: false, intercalaryInclude: false, startingWeekday: null}]);
        expect((<Game>game).settings.get).toHaveBeenCalled();
        (<Mock>(<Game>game).settings.get).mockReturnValueOnce(false);
        expect(GameSettings.LoadMonthData()).toStrictEqual([]);
        (<Mock>(<Game>game).settings.get).mockReturnValueOnce([]);
        expect(GameSettings.LoadMonthData()).toStrictEqual([]);
        (<Mock>(<Game>game).settings.get).mockReturnValueOnce([false]);
        expect(GameSettings.LoadMonthData()).toStrictEqual([false]);
    });

    test('Load Weekday Data', () => {
        expect(GameSettings.LoadWeekdayData()).toStrictEqual([{numericRepresentation: 0, name: ''}]);
        expect((<Game>game).settings.get).toHaveBeenCalled();
        (<Mock>(<Game>game).settings.get).mockReturnValueOnce(false);
        expect(GameSettings.LoadWeekdayData()).toStrictEqual([]);
        (<Mock>(<Game>game).settings.get).mockReturnValueOnce([]);
        expect(GameSettings.LoadWeekdayData()).toStrictEqual([]);
        (<Mock>(<Game>game).settings.get).mockReturnValueOnce([false]);
        expect(GameSettings.LoadWeekdayData()).toStrictEqual([false]);
    });

    test('Load Season Data', () => {
        expect(GameSettings.LoadSeasonData()).toStrictEqual([{name:'', startingMonth: 1, startingDay: 1, color: '#ffffff', sunriseTime: 0, sunsetTime: 0}]);
        expect((<Game>game).settings.get).toHaveBeenCalled();
        (<Mock>(<Game>game).settings.get).mockReturnValueOnce(false);
        expect(GameSettings.LoadSeasonData()).toStrictEqual([]);
        (<Mock>(<Game>game).settings.get).mockReturnValueOnce([]);
        expect(GameSettings.LoadSeasonData()).toStrictEqual([]);
        (<Mock>(<Game>game).settings.get).mockReturnValueOnce([false]);
        expect(GameSettings.LoadSeasonData()).toStrictEqual([false]);
    });

    test('Load Moon Data', () => {
        expect(GameSettings.LoadMoonData()).toStrictEqual([{"name":"","cycleLength":0,"firstNewMoon":{"yearReset":"none","yearX":0,"year":0,"month":1,"day":1},"phases":[{"name":"","length":3.69,"icon":"new","singleDay":true}],"color":"#ffffff","cycleDayAdjust":0}]);
        expect((<Game>game).settings.get).toHaveBeenCalled();
        (<Mock>(<Game>game).settings.get).mockReturnValueOnce(false);
        expect(GameSettings.LoadMoonData()).toStrictEqual([]);
        (<Mock>(<Game>game).settings.get).mockReturnValueOnce([]);
        expect(GameSettings.LoadMoonData()).toStrictEqual([]);
        (<Mock>(<Game>game).settings.get).mockReturnValueOnce([false]);
        expect(GameSettings.LoadMoonData()).toStrictEqual([false]);
    });

    test('Load Leap Year Rule', () => {
        expect(GameSettings.LoadLeapYearRules()).toStrictEqual({rule: 'none', customMod: 0});
        expect((<Game>game).settings.get).toHaveBeenCalled();
    });

    test('Load Time Data', () => {
        expect(GameSettings.LoadTimeData()).toStrictEqual({hoursInDay:0, minutesInHour: 1, secondsInMinute: 2, gameTimeRatio: 3, unifyGameAndClockPause: false, updateFrequency: 1, secondsInCombatRound: 6});
        expect((<Game>game).settings.get).toHaveBeenCalled();
    });

    test('Load Notes', () => {
        expect(GameSettings.LoadNotes()).toStrictEqual([{year: 0, month: 1, day: 2, title:'', content:'', author:'', playerVisible: false, id: "abc123"}]);
        expect((<Game>game).settings.get).toHaveBeenCalled();
        (<Mock>(<Game>game).settings.get).mockReturnValueOnce(false);
        expect(GameSettings.LoadNotes()).toStrictEqual([]);
        (<Mock>(<Game>game).settings.get).mockReturnValueOnce([]);
        expect(GameSettings.LoadNotes()).toStrictEqual([]);
        (<Mock>(<Game>game).settings.get).mockReturnValueOnce([false]);
        expect(GameSettings.LoadNotes()).toStrictEqual([false]);
    });

    test('Load Note Categories', () => {
        expect(GameSettings.LoadNoteCategories()).toStrictEqual([]);
        expect((<Game>game).settings.get).toHaveBeenCalled();
        (<Mock>(<Game>game).settings.get).mockReturnValueOnce([{name: "Holiday", color: "#148e94", textColor: "#FFFFFF"}]);
        expect(GameSettings.LoadNoteCategories()).toStrictEqual([{name: "Holiday", color: "#148e94", textColor: "#FFFFFF"}]);
        (<Mock>(<Game>game).settings.get).mockReturnValueOnce([[{name: "Holiday", color: "#148e94", textColor: "#FFFFFF"}]]);
        expect(GameSettings.LoadNoteCategories()).toStrictEqual([{name: "Holiday", color: "#148e94", textColor: "#FFFFFF"}]);
    });

    test('Save General Settings', async () => {
        // @ts-ignore
        game.user.isGM = false;
        let gs: GeneralSettings = {gameWorldTimeIntegration: GameWorldTimeIntegrations.None, showClock: false, pf2eSync: true, permissions: {viewCalendar: {player:true, trustedPlayer: true, assistantGameMaster: true}, addNotes:{player:false, trustedPlayer: false, assistantGameMaster: false}, reorderNotes:{player:false, trustedPlayer: false, assistantGameMaster: false}, changeDateTime:{player:false, trustedPlayer: false, assistantGameMaster: false}}};
        await expect(GameSettings.SaveGeneralSettings(gs)).resolves.toBe(false);
        // @ts-ignore
        game.user.isGM = true;
        await expect(GameSettings.SaveGeneralSettings(gs)).resolves.toBe(false);

        gs.showClock = true;
        await expect(GameSettings.SaveGeneralSettings(gs)).resolves.toBe(true);
        expect((<Game>game).settings.set).toHaveBeenCalled();
    });

    test('Save Current Date', async () => {
        jest.spyOn(console, 'error').mockImplementation();
        // @ts-ignore
        game.user.isGM = false;
        const year = new Year(0);
        const month = new Month('T', 1, 0, 10);
        year.months.push(month);
        year.time.seconds = 3;
        await expect(GameSettings.SaveCurrentDate(year)).resolves.toBe(false);
        expect(console.error).toHaveBeenCalledTimes(1);
        // @ts-ignore
        game.user.isGM = true;
        await expect(GameSettings.SaveCurrentDate(year)).resolves.toBe(false);
        expect(console.error).toHaveBeenCalledTimes(2);
        year.months[0].current = true;
        await expect(GameSettings.SaveCurrentDate(year)).resolves.toBe(false);
        expect(console.error).toHaveBeenCalledTimes(3);
        year.months[0].days[1].current = true;
        await expect(GameSettings.SaveCurrentDate(year)).resolves.toBe(false);
        expect((<Game>game).settings.get).toHaveBeenCalled();
        expect((<Game>game).settings.set).not.toHaveBeenCalled();
        (<Mock>(<Game>game).settings.get).mockClear();
        year.months[0].days[1].current = false;
        year.months[0].days[2].current = true;
        await expect(GameSettings.SaveCurrentDate(year)).resolves.toBe(true);
        expect((<Game>game).settings.get).toHaveBeenCalled();
        expect((<Game>game).settings.set).toHaveBeenCalled();

        year.time.seconds = 300;
        (<Mock>(<Game>game).settings.get).mockClear();
        await expect(GameSettings.SaveCurrentDate(year)).resolves.toBe(true);
        expect((<Game>game).settings.get).toHaveBeenCalled();
        expect((<Game>game).settings.set).toHaveBeenCalled();

        //@ts-ignore
        SimpleCalendar.instance = null;
        await expect(GameSettings.SaveCurrentDate(year)).resolves.toBe(true);
        expect((<Game>game).settings.get).toHaveBeenCalled();
        expect((<Game>game).settings.set).toHaveBeenCalled();
    });

    test('Save Year Configuration', async () => {
        // @ts-ignore
        game.user.isGM = false;
        const year = new Year(0);
        await expect(GameSettings.SaveYearConfiguration(year)).resolves.toBe(false);
        // @ts-ignore
        game.user.isGM = true;
        await expect(GameSettings.SaveYearConfiguration(year)).resolves.toBe(false);
        expect((<Game>game).settings.get).toHaveBeenCalled();
        (<Mock>(<Game>game).settings.get).mockClear();
        year.numericRepresentation = 1;
        await expect(GameSettings.SaveYearConfiguration(year)).resolves.toBe(true);
        expect((<Game>game).settings.get).toHaveBeenCalled();
        expect((<Game>game).settings.set).toHaveBeenCalled();

        const orig = (<Game>game).settings.get;
        (<Game>game).settings.get =(moduleName: string, settingName: string) => { return {numericRepresentation: 0, prefix: '', postfix: ''};};
        await expect(GameSettings.SaveYearConfiguration(year)).resolves.toBe(true);
        (<Game>game).settings.get = orig;

    });

    test('Save Month Configuration', async () => {
        // @ts-ignore
        game.user.isGM = false;
        const month = new Month('', 0, 0, 1);
        await expect(GameSettings.SaveMonthConfiguration([month])).resolves.toBe(false);
        // @ts-ignore
        game.user.isGM = true;
        await expect(GameSettings.SaveMonthConfiguration([month])).resolves.toBe(true);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(1);
        month.name = '';
        month.numericRepresentation = 1;
        month.numberOfDays = 2;
        month.numberOfLeapYearDays = 2;
        await expect(GameSettings.SaveMonthConfiguration([month])).resolves.toBe(false);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(1);
    });

    test('Save Weekday Configuration', async () => {
        // @ts-ignore
        game.user.isGM = false;
        const weekday = new Weekday(0, '');
        await expect(GameSettings.SaveWeekdayConfiguration([weekday])).resolves.toBe(false);
        // @ts-ignore
        game.user.isGM = true;
        await expect(GameSettings.SaveWeekdayConfiguration([weekday])).resolves.toBe(false);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(0);
        weekday.numericRepresentation = 1;
        await expect(GameSettings.SaveWeekdayConfiguration([weekday])).resolves.toBe(true);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(1);
    });

    test('Save Season Configuration', async () => {
        // @ts-ignore
        game.user.isGM = false;
        const season = new Season('', 1, 1);
        await expect(GameSettings.SaveSeasonConfiguration([season])).resolves.toBe(false);
        // @ts-ignore
        game.user.isGM = true;
        await expect(GameSettings.SaveSeasonConfiguration([season])).resolves.toBe(false);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(0);
        season.name = 'Spring';
        await expect(GameSettings.SaveSeasonConfiguration([season])).resolves.toBe(true);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(1);
    });

    test('Save Moon Configuration', async () => {
        // @ts-ignore
        game.user.isGM = false;
        const moon = new Moon('', 0);
        await expect(GameSettings.SaveMoonConfiguration([moon])).resolves.toBe(false);
        // @ts-ignore
        game.user.isGM = true;
        await expect(GameSettings.SaveMoonConfiguration([moon])).resolves.toBe(false);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(0);
        moon.name = "Moon";
        await expect(GameSettings.SaveMoonConfiguration([moon])).resolves.toBe(true);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(1);
    });

    test('Save Leap Year Rule', async () => {
        // @ts-ignore
        game.user.isGM = false;
        const lr = new LeapYear();
        await expect(GameSettings.SaveLeapYearRules(lr)).resolves.toBe(false);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(0);
        // @ts-ignore
        game.user.isGM = true;
        await expect(GameSettings.SaveLeapYearRules(lr)).resolves.toBe(false);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(0);
        lr.rule = LeapYearRules.Gregorian;
        await expect(GameSettings.SaveLeapYearRules(lr)).resolves.toBe(true);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(1);
    });

    test('Save Time Configuration', async () => {
        // @ts-ignore
        game.user.isGM = false;
        let gs = new Time(0, 1, 2);
        gs.gameTimeRatio = 3;
        await expect(GameSettings.SaveTimeConfiguration(gs)).resolves.toBe(false);
        // @ts-ignore
        game.user.isGM = true;
        await expect(GameSettings.SaveTimeConfiguration(gs)).resolves.toBe(false);

        gs.gameTimeRatio = 4;
        await expect(GameSettings.SaveTimeConfiguration(gs)).resolves.toBe(true);
        expect((<Game>game).settings.set).toHaveBeenCalled();
    });

    test('Save Note Categories', async () => {
        await GameSettings.SaveNoteCategories([{name: "Holiday", color: "#148e94", textColor: "#FFFFFF"}]);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(1);
        (<Mock>(<Game>game).settings.get).mockReturnValueOnce([{name: "Holiday", color: "#148e94", textColor: "#FFFFFF"}]);
        await GameSettings.SaveNoteCategories([{name: "Holiday", color: "#148e94", textColor: "#FFFFFF"}]);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(1);
        // @ts-ignore
        game.user.isGM = false;
        await GameSettings.SaveNoteCategories([{name: "Holiday", color: "#148e94", textColor: "#FFFFFF"}]);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(1);

        // @ts-ignore
        game.user.isGM = true;
    });

    test('Save Notes', async () => {
        const note = new Note();
        note.year = 0;
        note.month = 1;
        note.day = 2;
        await GameSettings.SaveNotes([note]);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(1);
        // @ts-ignore
        game.user.isGM = false;
        await GameSettings.SaveNotes([note]);
        expect((<Game>game).settings.set).toHaveBeenCalledTimes(1);
        expect((<Game>game).socket?.emit).toHaveBeenCalledTimes(1);
    });

    test('Set Default Note Visibility', async () => {
        // @ts-ignore
        game.user.isGM = false;
        await expect(GameSettings.SetDefaultNoteVisibility(true)).resolves.toBe(false);
        // @ts-ignore
        game.user.isGM = true;
        await expect(GameSettings.SetDefaultNoteVisibility(true)).resolves.toBe(true);
        expect((<Game>game).settings.set).toHaveBeenCalled();
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
