import "./form-application";

// @ts-ignore
class DocumentSheet extends FormApplication{
    constructor(o: any) {
        super(o);
    }

    // @ts-ignore
    _getHeaderButtons(){return [{class: 'configure-sheet'}];}

    get isEditable(){return false;}
}

// @ts-ignore
global.DocumentSheet = DocumentSheet;
