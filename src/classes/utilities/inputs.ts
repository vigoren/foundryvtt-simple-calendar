export function getTextInputValue(selector: string, defaultVal: string, root: Document | Element = document){
    const el = <HTMLInputElement>root.querySelector(selector);
    return el? el.value : defaultVal;
}

export function getNumericInputValue(selector: string, defaultVal: number|null, isFloat: boolean = false, root: Document | Element = document){
    const el = <HTMLInputElement>root.querySelector(selector);
    if(el){
        const v = isFloat? parseFloat(el.value) : parseInt(el.value);
        if(!isNaN(v)){
            return v;
        }
    }
    return defaultVal;
}

export function getCheckBoxInputValue(selector: string, defaultVal: boolean, root: Document | Element = document){
    const el = <HTMLInputElement>root.querySelector(selector);
    return el? el.checked : defaultVal;
}