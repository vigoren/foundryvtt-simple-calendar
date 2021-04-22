
// @ts-ignore
class Application {
    constructor() {
        this.element = {
            find: jest.fn().mockReturnValue({show: jest.fn(), hide: jest.fn()})
        };
    }

    static get defaultOptions() { return {title:'',template:'',resizable: false, classes: []}; }

    rendered = true;

    // @ts-ignore
    element: any;

    render(force: boolean, options: any){}

    close(){return Promise.resolve();}

    activateListeners(data: any){}

    setPosition(){}

    _onResize(){}
}



// @ts-ignore
global.Application = Application;
