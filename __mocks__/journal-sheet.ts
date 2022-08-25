import "./form-application";

// @ts-ignore
class JournalSheet extends FormApplication{
    constructor(o: any) {
        super(o);
    }

    // @ts-ignore
    _getHeaderButtons(){return [{class: 'configure-sheet'}];}

    get isEditable(){return false;}

    _activateFilePicker(){}

    _activateEditor(div: HTMLElement) {}
}

// @ts-ignore
global.JournalSheet = JournalSheet;