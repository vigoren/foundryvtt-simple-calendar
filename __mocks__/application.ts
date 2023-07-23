import {jest} from '@jest/globals';
// @ts-ignore
class Application {
    constructor() {
        this.element = {
            find: jest.fn().mockReturnValue({
                show: jest.fn(),
                hide: jest.fn(),
                empty: jest.fn().mockReturnValue({
                    append: jest.fn()
                }),
                height: jest.fn().mockReturnValue(0),
                width: jest.fn().mockReturnValue(0),
                outerHeight: jest.fn().mockReturnValue(0),
                outerWidth: jest.fn().mockReturnValue(0),
            })
        };
    }

    static get defaultOptions() { return {title:'',template:'',resizable: false, classes: []}; }

    // @ts-ignore
    options = {};

    get rendered(){return true};

    // @ts-ignore
    element: any;

    getData(){}

    render(force: boolean, options: any){}

    close(){return Promise.resolve();}

    activateListeners(data: any){}

    setPosition(){}

    _onResize(){}

    _getHeaderButtons(){return [];}

    _onDragMouseUp(){};

    _onDragMouseMove(){};

    get popOut() {
        //@ts-ignore
        return this.options.popOut;
    }
}



// @ts-ignore
global.Application = Application;
