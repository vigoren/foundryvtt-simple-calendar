
const handlebars = {
    registerHelper: jest.fn((name: string, fn: Function) => {})
};

// @ts-ignore
global.Handlebars = handlebars;
