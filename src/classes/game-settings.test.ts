
import "../../__mocks__/game";
import "../../__mocks__/form-application";
import "../../__mocks__/application";

import {GameSettings} from "./game-settings";
import SimpleCalendar from "./simple-calendar";
import Year from "./year";
import Month from "./month";
import {Weekday} from "./weekday";

describe('Game Settings Class Tests', () => {

    test('Localize', () => {
        expect(GameSettings.Localize('test')).toBe('');
        expect(game.i18n.localize).toHaveBeenCalled();
    });

    test( 'Is GM', () => {
        expect(GameSettings.IsGm()).toBe(false);
    });

    test('Register Settings', () => {
        SimpleCalendar.instance = new SimpleCalendar();
        GameSettings.RegisterSettings();
        expect(game.settings.register).toHaveBeenCalled();
        expect(game.settings.register).toHaveBeenCalledTimes(6);
    });

    test('Load Allow Players To Add Notes', () => {
        expect(GameSettings.LoadAllowPlayersToAddNotes()).toBe(false);
        expect(game.settings.get).toHaveBeenCalled();
    });

    test('Load Year Data', () => {
        expect(GameSettings.LoadYearData()).toStrictEqual({numericRepresentation: 0, prefix: '', postfix: ''});
        expect(game.settings.get).toHaveBeenCalled();
    });

    test('Load Current Date', () => {
        expect(GameSettings.LoadCurrentDate()).toStrictEqual({year: 0, month: 1, day: 2});
        expect(game.settings.get).toHaveBeenCalled();
    });

    test('Load Month Data', () => {
        expect(GameSettings.LoadMonthData()).toStrictEqual([{numericRepresentation: 0, numberOfDays: 1, name: ''}]);
        expect(game.settings.get).toHaveBeenCalled();
        const orig = game.settings.get;
        game.settings.get = (moduleName: string, settingName: string) => {return false;};
        expect(GameSettings.LoadMonthData()).toStrictEqual([]);
        game.settings.get = (moduleName: string, settingName: string) => {return [];};
        expect(GameSettings.LoadMonthData()).toStrictEqual([]);
        game.settings.get = (moduleName: string, settingName: string) => {return [false];};
        expect(GameSettings.LoadMonthData()).toStrictEqual([]);
        game.settings.get = orig;
    });

    test('Load Weekday Data', () => {
        expect(GameSettings.LoadWeekdayData()).toStrictEqual([{numericRepresentation: 0, name: ''}]);
        expect(game.settings.get).toHaveBeenCalled();
        const orig = game.settings.get;
        game.settings.get = (moduleName: string, settingName: string) => {return false;};
        expect(GameSettings.LoadWeekdayData()).toStrictEqual([]);
        game.settings.get = (moduleName: string, settingName: string) => {return [];};
        expect(GameSettings.LoadWeekdayData()).toStrictEqual([]);
        game.settings.get = (moduleName: string, settingName: string) => {return [false];};
        expect(GameSettings.LoadWeekdayData()).toStrictEqual([]);
        game.settings.get = orig;
    });

    test('Save Current Date', () => {
        jest.spyOn(console, 'error').mockImplementation();
        const year = new Year(0);
        const month = new Month('T', 1, 10);
        year.months.push(month);
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
        // @ts-ignore
        game.settings.get.mockClear();
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
        // @ts-ignore
        game.settings.get.mockClear();
        year.numericRepresentation = 1;
        expect(GameSettings.SaveYearConfiguration(year)).resolves.toBe(true);
        expect(game.settings.get).toHaveBeenCalled();
        expect(game.settings.set).toHaveBeenCalled();
    });

    test('Save Month Configuration', () => {
        // @ts-ignore
        game.user.isGM = false;
        const month = new Month('', 0, 1);
        expect(GameSettings.SaveMonthConfiguration([month])).resolves.toBe(false);
        // @ts-ignore
        game.user.isGM = true;
        expect(GameSettings.SaveMonthConfiguration([month])).resolves.toBe(true);
        expect(game.settings.set).toHaveBeenCalled();
    });

    test('Save Weekday Configuration', () => {
        // @ts-ignore
        game.user.isGM = false;
        const weekday = new Weekday(0, '');
        expect(GameSettings.SaveWeekdayConfiguration([weekday])).resolves.toBe(false);
        // @ts-ignore
        game.user.isGM = true;
        expect(GameSettings.SaveWeekdayConfiguration([weekday])).resolves.toBe(true);
        expect(game.settings.set).toHaveBeenCalled();
    });
});
