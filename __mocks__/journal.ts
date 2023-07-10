import {jest} from '@jest/globals';
//@ts-ignore
global.Journal = {
    registerSheet: jest.fn(),
    showDialog: async () => {}
};
