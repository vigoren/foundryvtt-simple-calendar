import {Note} from './note';
import {Logger} from "./logging";
import {GameSettings} from "./game-settings";

export class SimpleCalendarNotes extends FormApplication {
    /**
     * If we are editing an existing note
     * @type{boolean}
     */
    updateNote: boolean;

    viewMode: boolean;

    richEditorSaved: boolean = false;

    /**
     * Used to store a globally accessible copy of the Simple calendar Notes class for access from event functions.
     */
    static instance: SimpleCalendarNotes;

    /**
     * The Calendar Notes constructor
     * @param {Note} data The note data used to populate the dialog
     * @param {boolean} viewOnly If we are viewing an existing note
     */
    constructor(data: Note, viewOnly: boolean = false) {
        super(data);
        this.viewMode = viewOnly;
        this.updateNote = false;
        this.editors['content'] = {
            target: 'content',
            mce: null,
            changed: false,
            initial: (<Note>this.object).content,
            hasButton: false,
            button: null,
            active: false,
            options: {
                target: null,
                height: 200,
                //@ts-ignore
                save_onsavecallback: mce => this.saveEditor('content')
            },
        };
    }

    /**
     * Returns the default options for this application
     */
    static get defaultOptions() {
        const options = super.defaultOptions;
        options.template = "modules/foundryvtt-simple-calendar/templates/calendar-notes.html";
        options.title = "FSC.Notes.DialogTitle";
        options.classes = ["form","simple-calendar"];
        options.resizable = true;
        options.closeOnSubmit = false;
        return options;
    }

    /**
     * Gets the data object to be used by Handlebars when rending the HTML template
     */
    getData(): any {
        const options = super.getData();
        options.viewMode = this.viewMode;
        options.richButton = !this.viewMode;
        options.canEdit = GameSettings.IsGm();
        return options;
    }

    /**
     * Sets up our rich text editor when the app is shown
     * @param {JQuery|HTMLElement} html The element that makes up the root of the application
     * @private
     */
    private setUpTextEditor(html: JQuery | HTMLElement){
        if(this.editors['content'].mce === null){
            this.editors['content'].options.target = (<JQuery>html).find('.editor .editor-content')[0];
        }
        if(!this.viewMode && this.editors['content'].options.target !== null || this.editors['content'].button === null){
            this.editors['content'].button = this.editors['content'].options.target.nextElementSibling;
            this.editors['content'].hasButton = this.editors['content'].button && this.editors['content'].button.classList.contains("editor-edit");
            this.editors['content'].active = !this.viewMode;
            if(this.editors['content'].hasButton){
                this.editors['content'].button .onclick = (event: Event) => {
                    this.editors['content'].button .style.display = "none";
                    this.richEditorSaved = false;
                    //@ts-ignore
                    this.activateEditor('content');
                }
            }
        }
        console.log(this.editors['content'].active, this.editors['content'].mce);
        if(this.editors['content'].mce === null && this.editors['content'].active){
            //@ts-ignore
            this.activateEditor('content');
        }
        console.log(this.editors['content']);
    }

    /**
     * Adds any event listeners to the application DOM
     * @param {JQuery | HTMLElement} html The root HTML of the application window
     * @protected
     */
    protected activateListeners(html: JQuery | HTMLElement) {
        if(html.hasOwnProperty("length")) {
            this.setUpTextEditor(html);

            (<JQuery>html).find('#scSubmit').on('click', SimpleCalendarNotes.instance.saveButtonClick.bind(SimpleCalendarNotes.instance));

            (<JQuery>html).find('#scNoteEdit').on('click', SimpleCalendarNotes.instance.editButtonClick.bind(SimpleCalendarNotes.instance));
            (<JQuery>html).find('#scNoteDelete').on('click', SimpleCalendarNotes.instance.deleteButtonClick.bind(SimpleCalendarNotes.instance));
        }
    }

    /**
     * Updates our object with the content when the rich text editor
     * @param {Event} event The event that triggered this
     * @param {*} formData The data from the form
     * @protected
     */
    protected _updateObject(event: Event | JQuery.Event, formData: any): Promise<any> {
        (<Note>this.object).content = formData['content'];
        this.richEditorSaved = true;
        return Promise.resolve(false);
    }

    /**
     * Shows the application window
     */
    public showApp(){
        this.render(true, {width: 500, height: 500});
    }

    /**
     * Closes the application window
     */
    public closeApp(){
        this.close().catch(error => Logger.error(error));
    }

    public updateApp(){
        this.render(true);
    }

    public editButtonClick(e: Event){
        e.preventDefault();
        this.viewMode = false;
        this.updateNote = true;
        this.updateApp();
    }

    public async deleteButtonClick(e: Event){
        //TODO: Add confirmation dialog to help prevent accidental deletions of notes
        e.preventDefault();
        const currentNotes = GameSettings.LoadNotes().map(n => {
            const note = new Note();
            note.loadFromConfig(n);
            return note;
        });
        const indexToDelete = currentNotes.map(n => n.id).indexOf((<Note>this.object).id);
        if(indexToDelete > -1 && indexToDelete < currentNotes.length){
            currentNotes.splice(indexToDelete, 1);
            await GameSettings.SaveNotes(currentNotes).catch(Logger.error);
            this.closeApp();
        }
    }

    public async saveButtonClick(e: Event){
        Logger.debug('Saving New Note');
        e.preventDefault();
        if(this.richEditorSaved || (this.editors['content'].mce && this.editors['content'].mce.isNotDirty)){
            const title = (<JQuery>this.element).find('#scNoteTitle').val();
            const playerVisible = (<JQuery>this.element).find('#scNoteVisibility').is(':checked');
            if(title){
                (<Note>this.object).title = title.toString();
                (<Note>this.object).playerVisible = playerVisible;
                const currentNotes = GameSettings.LoadNotes().map(n => {
                    const note = new Note();
                    note.loadFromConfig(n);
                    return note;
                });
                if(this.updateNote){
                    const updateNote = currentNotes.find(n => n.id === (<Note>this.object).id);
                    if(updateNote){
                        updateNote.title = (<Note>this.object).title;
                        updateNote.content = (<Note>this.object).content;
                        updateNote.playerVisible = (<Note>this.object).playerVisible;
                    }
                } else {
                    currentNotes.push(<Note>this.object);
                }
                await GameSettings.SaveNotes(currentNotes).catch(Logger.error);
                this.closeApp();
            } else {
                GameSettings.UiNotification(GameSettings.Localize("FSC.Error.Note.NoTitle"), 'error');
            }
        } else {
            GameSettings.UiNotification(GameSettings.Localize("FSC.Error.Note.RichText"), 'warn');
        }

    }
}
