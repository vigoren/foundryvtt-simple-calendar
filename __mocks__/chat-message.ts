import {jest} from '@jest/globals';
// @ts-ignore
global.ChatMessage = {
    create: jest.fn<() => Promise<null>>().mockResolvedValue(null),
    prototype: {
        export: () => {return "[] GM\nMessage"}
    }
};
