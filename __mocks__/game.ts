/**
 * This file mocks the FoundryVTT game global so that it can be used in testing
 */
import {GameWorldTimeIntegrations, MoonIcons, MoonYearResetOptions, SettingNames} from "../src/constants";

//@ts-ignore
const local: Localization = {
    lang: '',
    translations: {},
    initialize: jest.fn(() => {return Promise.resolve();}),
    localize: jest.fn((stringId: string) => {return '';}),
    format: jest.fn((stringId: string, replacements: any) => {return '';}),
    setLanguage: jest.fn((lang: string) => {return Promise.resolve();})
};

// @ts-ignore
const user: User = {
    name: '',
    id: '',
    active: true,
    viewedScene: '',
    avatar: '',
    //character: {},
    // @ts-ignore
    permissions: [],
    isTrusted: false,
    isGM: false,
    isSelf: true,
    // @ts-ignore
    can: jest.fn((permission: string) => {return false;}),
    hasPermission: jest.fn((permission: string) => {return false;}),
    // @ts-ignore
    hasRole: jest.fn((role: string) => {return true;}),
    // @ts-ignore
    isRole: jest.fn((role: string) => {return false;}),
    // @ts-ignore
    setPermission: jest.fn((premission: string, allowed: boolean) => {}),
    assignHotbarMacro: jest.fn((macro: Macro | null, slot: string | number, {fromSlot}: { fromSlot: number }): Promise<User> => { return Promise.resolve(user);}),
    // @ts-ignore
    getHotbarMacros: jest.fn((page?: number): Macro[] => {return [];})
};

// @ts-ignore
const game = {
    data: null,
    i18n: local,
    user: user,
    paused: true,
    // @ts-ignore
    settings: {
        get: jest.fn((moduleName: string, settingName: string): any => {
            switch (settingName){
                case SettingNames.AllowPlayersToAddNotes:
                case SettingNames.DefaultNoteVisibility:
                    return false;
                case SettingNames.YearConfiguration:
                    return {id:'', numericRepresentation: 0, prefix: '', postfix: '', showWeekdayHeadings: true, firstWeekday: 0, yearZero: 0, yearNames: [], yearNamingRule: 'default', yearNamesStart: 0};
                case SettingNames.MonthConfiguration:
                    return [[{id:'', name: '', abbreviation: '', numericRepresentation: 1, numericRepresentationOffset: 0, numberOfDays: 2, numberOfLeapYearDays: 2, intercalary: false, intercalaryInclude: false, startingWeekday: null}]];
                case SettingNames.WeekdayConfiguration:
                    return [[{abbreviation: '', id:'', name: '', numericRepresentation: 0}]];
                case SettingNames.LeapYearRule:
                    return {id:'', rule: 'none', customMod: 0};
                case SettingNames.CurrentDate:
                    return {year: 0, month: 1, day: 2, seconds: 3};
                case SettingNames.Notes:
                    return [[{year: 0, month: 1, day: 2, title:'', content:'', author:'', playerVisible:  false, id: 'abc123'}]];
                case SettingNames.NoteCategories:
                    return [];
                case SettingNames.GeneralConfiguration:
                    return {id:'', gameWorldTimeIntegration: GameWorldTimeIntegrations.None, showClock: false, pf2eSync: true, dateFormat: {date: 'MMMM DD, YYYY', time: 'HH:mm:ss', monthYear: 'MMMM YAYYYYYZ'}, permissions: {id:'', viewCalendar: {player:true, trustedPlayer: true, assistantGameMaster: true, users: undefined}, addNotes:{player:false, trustedPlayer: false, assistantGameMaster: false, users: undefined}, reorderNotes:{player:false, trustedPlayer: false, assistantGameMaster: false}, changeDateTime:{player:false, trustedPlayer: false, assistantGameMaster: false, users: undefined}}}
                case SettingNames.TimeConfiguration:
                    return {id:'', hoursInDay:24, minutesInHour: 60, secondsInMinute: 60, secondsInCombatRound: 6, gameTimeRatio: 3, unifyGameAndClockPause: false, updateFrequency: 1};
                case SettingNames.SeasonConfiguration:
                    return [[{id:'', name:'', startingMonth: 1, startingDay: 1, color: '#ffffff', sunriseTime: 0, sunsetTime: 0}]];
                case SettingNames.MoonConfiguration:
                    return [[{id:'', "name":"","cycleLength":0,"firstNewMoon":{"yearReset":"none","yearX":0,"year":0,"month":1,"day":1},"phases":[{"name":"","length":3.69,"icon":"new","singleDay":true}],"color":"#ffffff","cycleDayAdjust":0}]];
            }
        }),
        register: jest.fn((moduleName: string, settingName: string, data: any) => {}),
        registerMenu: jest.fn(),
        set: jest.fn((moduleName: string, settingName: string, data: any) => {return Promise.resolve(true);})
    },
    time: {
        worldTime: 10,
        advance: jest.fn()
    },
    socket: {
        on: jest.fn(),
        emit: jest.fn()
    },
    combats: {
        size: 0,
        find: jest.fn((v)=>{
            return v.call(undefined, {started: true});
        })
    },
    modules: {
        get: jest.fn()
    },
    Gametime: {
        DTC: {
            saveUserCalendar: jest.fn()
        }
    },
    users: {
        get: jest.fn(),
        find: jest.fn((v)=>{
            return v.call(undefined, {isGM: false, active: true});
        }),
        forEach: jest.fn((v)=>{
            return v.call(undefined, user)
        })
    },
    scenes: null,
    system: {
        id: '',
        data: {
            version: "1.2.3"
        }
    },
    togglePause: jest.fn()
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
