
// @ts-ignore
class Application {
    constructor() {}

    static get defaultOptions() { return {title:'',template:'',resizable: false, classes: []}; }

    rendered = true;

    render(force: boolean, options: any){}

    close(){return Promise.resolve();}
}



// @ts-ignore
global.Application = Application;
