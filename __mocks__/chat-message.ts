import {jest} from '@jest/globals';
// @ts-ignore
global.ChatMessage = {
    // @ts-ignore
    create: jest.fn<() => Promise<null>>().mockResolvedValue(null),
    // @ts-ignore
    prototype: {
        export: () => {return "[] GM\nMessage"}
    }
};
