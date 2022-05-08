
const hooks = {
    callAll: jest.fn(),
    on: jest.fn(),
    off: jest.fn()
};

//@ts-ignore
global.Hooks = hooks;
