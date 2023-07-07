import {jest} from '@jest/globals';
class ss{
    v: string;
    constructor(v: string) {
        this.v = v;
    }

    toString() {
        return this.v.toString();
    }
}

const handlebars = {
    registerHelper: jest.fn((name: string, fn: Function) => {}),
    SafeString: ss
};

// @ts-ignore
global.Handlebars = handlebars;
