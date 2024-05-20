/**
 * This file mocks the FoundryVTT game global so that it can be used in testing
 */
import { jest } from "@jest/globals";
//@ts-ignore
const local: Localization = {
    lang: "",
    translations: {},
    initialize: () => {
        return Promise.resolve();
    },
    localize: (stringId: string) => {
        return "";
    },
    format: (stringId: string, replacements: any) => {
        return "";
    },
    setLanguage: (lang: string) => {
        return Promise.resolve();
    }
};

// @ts-ignore
const user: User = {
    name: "",
    id: "",
    active: true,
    viewedScene: "",
    avatar: "",
    //character: {},
    // @ts-ignore
    permissions: [],
    isTrusted: false,
    isGM: false,
    isSelf: true,
    //@ts-ignore
    data: {},
    // @ts-ignore
    can: jest.fn((permission: string) => {
        return false;
    }),
    hasPermission: jest.fn((permission: string) => {
        return false;
    }),
    // @ts-ignore
    hasRole: jest.fn((role: string) => {
        return true;
    }),
    // @ts-ignore
    isRole: jest.fn((role: string) => {
        return false;
    }),
    // @ts-ignore
    setPermission: jest.fn((premission: string, allowed: boolean) => {}),
    // @ts-ignore
    assignHotbarMacro: jest.fn((macro: Macro | null, slot: string | number, { fromSlot }: { fromSlot: number }): Promise<User> => {
        return Promise.resolve(user);
    }),
    // @ts-ignore
    getHotbarMacros: jest.fn((page?: number): Macro[] => {
        return [];
    })
};

// @ts-ignore
const game = {
    data: null,
    i18n: local,
    user: user,
    paused: true,
    // @ts-ignore
    settings: {
        get: jest.fn(),
        register: jest.fn((moduleName: string, settingName: string, data: any) => {}),
        registerMenu: jest.fn(),
        set: (moduleName: string, settingName: string, data: any) => {
            return Promise.resolve(true);
        }
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
        find: jest.fn((v: Function) => {
            return v.call(undefined, { started: true });
        }),
        filter: (v: any) => {
            return v.call(undefined, { started: true });
        }
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
        find: (v: any) => {
            return v.call(undefined, { isGM: false, active: true });
        },
        forEach: (v: any) => {
            return v.call(undefined, { id: "" });
        },
        filter: (v: any) => {
            return v.call(undefined, user);
        },
        map: (v: any) => {
            return [v.call(undefined, user)];
        },
        unshift: (v: any) => {},
        contents: () => {
            return [user];
        }
    },
    scenes: null,
    system: {
        id: "",
        data: {
            version: "1.2.3"
        }
    },
    togglePause: jest.fn(),
    journal: {
        get: (id: string, obj: any) => {
            if (id) {
                return {
                    getFlag: jest.fn().mockReturnValue({
                        calendarId: "test",
                        startDate: {},
                        endDate: {},
                        allDay: true,
                        repeats: 0,
                        order: 0,
                        categories: [],
                        remindUsers: ["qwe"]
                    }),
                    update: jest.fn(),
                    delete: async () => {},
                    testUserPermission: () => {
                        return true;
                    },
                    sheet: {
                        delete: jest.fn(),
                        render: jest.fn(),
                        reminderChange: async () => {}
                    }
                };
            }
            return null;
        },
        forEach: (v: any) => {
            return v.call(undefined, {});
        },
        directory: {
            folders: {
                find: (v: any) => {
                    return v.call(undefined, {
                        getFlag: jest.fn().mockReturnValueOnce(undefined).mockReturnValue({})
                    });
                }
            }
        }
    },
    macros: {
        forEach: (v: any) => {
            return v.call(undefined, { canExecute: true, name: "asd", id: "123" });
        },
        get: () => {
            return { canExecute: true, execute: jest.fn() };
        }
    },
    video: {
        getYouTubePlayer: async () => {
            return { seekTo: () => {} };
        },
        isYouTubeURL: (s: string) => {
            return s.indexOf("youtube") > -1;
        },
        getYouTubeEmbedURL: () => {
            return "";
        }
    },
    world: {
        id: "worldId"
    },
    release: {
        generation: 11
    },
    keybindings: {
        register: () => {}
    }
};

// @ts-ignore
global.game = game;

// @ts-ignore
global.ui = {
    chat: {
        _lastId: "",
        _state: 0,
        render: jest.fn((force: boolean) => {})
    },
    notifications: {
        info: jest.fn((message: string) => {}),
        warn: jest.fn((message: string) => {}),
        error: jest.fn((message: string) => {})
    },
    windows: {},
    activeWindow: null,
    menu: {
        toggle: jest.fn()
    }
};

// @ts-ignore
global.getRoute = (a: string) => {
    return a;
};

//@ts-ignore
global._maxZ = 100;
