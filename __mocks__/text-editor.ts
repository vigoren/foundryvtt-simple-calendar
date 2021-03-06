

class TE {
    changeResult: any = null;

    create () {
        return Promise.resolve({on: this.on.bind(this)});
    }

    on(a: string, b: Function){
        this.changeResult = b;
    }
}

//@ts-ignore
global.TextEditor = new TE();
