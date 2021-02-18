
const handlebars = {
    registerHelper: jest.fn((name: string, fn: Function) => {return fn();})
};

// @ts-ignore
global.Handlebars = handlebars;
