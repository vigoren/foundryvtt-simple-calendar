import { jest } from "@jest/globals";
// @ts-ignore
global.canvas = {
    ready: true,
    activeLayer: {
        controlled: [{}],
        preview: {
            children: []
        },
        releaseAll: jest.fn()
    },
    fog: {
        save: jest.fn()
    }
};
