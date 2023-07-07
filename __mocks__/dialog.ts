import {jest} from '@jest/globals';
const renderer = jest.fn((force: boolean, options: any)=>{});

// @ts-ignore
class Dialog{

    constructor(o:any) {
    }

    render = renderer
}

// @ts-ignore
global.DialogRenderer = renderer;

// @ts-ignore
global.Dialog = Dialog;
