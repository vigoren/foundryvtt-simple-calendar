/**
 * This file mocks the FoundryVTT game global so that it can be used in testing
 */
import {SettingNames} from "../src/constants";

// @ts-ignore
const local: Localization = {
    lang: '',
    translations: {},
    initialize: jest.fn(() => {return Promise.resolve();}),
    localize: jest.fn((stringId: string) => {return '';}),
    format: jest.fn((stringId: string, replacements: any) => {return '';}),
    setLanguage: jest.fn((lang: string) => {return Promise.resolve();}),
    _discoverLanguages: jest.fn(() => {}),
    _getTranslations: jest.fn((lang: string) => {return Promise.resolve();}),
    _loadTranslationFile: jest.fn((src: string) => {return Promise.resolve();})
};

// @ts-ignore
const user: User = {
    name: '',
    id: '',
    active: true,
    targets: new Set(),
    viewedScene: '',
    avatar: '',
    //character: {},
    permissions: [],
    isTrusted: false,
    isGM: false,
    isSelf: true,
    can: jest.fn((permission: string) => {return false;}),
    hasPermission: jest.fn((permission: string) => {return false;}),
    hasRole: jest.fn((role: string) => {return false;}),
    isRole: jest.fn((role: string) => {return false;}),
    setPermission: jest.fn((premission: string, allowed: boolean) => {}),
    broadCastActivity: jest.fn((activityData?: UserActivityData) => {}),
    assignHotbarMacro: jest.fn((macro: Macro | null, slot: number, {fromSlot}: { fromSlot?: number }): Promise<User> => { return Promise.resolve(user);}),
    getHotbarMacros: jest.fn((page?: number): Macro[] => {return [];})
};

// @ts-ignore
const game = {
    data: null,
    i18n: local,
    user: user,
    // @ts-ignore
    settings: {
        get: jest.fn((moduleName: string, settingName: string): any => {
            switch (settingName){
                case SettingNames.AllowPlayersToAddNotes:
                    return false;
                case SettingNames.YearConfiguration:
                    return {numericRepresentation: 0, prefix: '', postfix: ''};
                case SettingNames.MonthConfiguration:
                    return [[{numericRepresentation: 1, numberOfDays: 2, name: ''}]];
                case SettingNames.WeekdayConfiguration:
                    return [[{numericRepresentation: 0, name: ''}]];
                case SettingNames.CurrentDate:
                    return {year: 0, month: 1, day: 2};
                case SettingNames.Notes:
                    return [[{year: 0, month: 1, day: 2, title:'', content:'', author:'', playerVisible:  false}]];
            }
        }),
        register: jest.fn((moduleName: string, settingName: string, data: any) => {}),
        set: jest.fn((moduleName: string, settingName: string, data: any) => {return Promise.resolve(true);})
    }
    //keyboard: null,
    //modules: null
};
// @ts-ignore
global.game = game;

// @ts-ignore
global.ui = {
    notifications: {
        info: jest.fn((message: string) => {}),
        warn: jest.fn((message: string) => {}),
        error: jest.fn((message: string) => {})
    }
};
