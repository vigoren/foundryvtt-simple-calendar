import {Note} from './note';
import {Logger} from "./logging";
import {GameSettings} from "./game-settings";
import {NoteRepeat} from "../constants";
import SimpleCalendar from "./simple-calendar";

export class SimpleCalendarNotes extends FormApplication {
    /**
     * If we are editing an existing note
     * @type{boolean}
     */
    updateNote: boolean;
    /**
     * If we are just viewing the content or editing
     * @type {boolean}
     */
    viewMode: boolean;
    /**
     * If the rich text editor has been saved or not.
     * @type {boolean}
     */
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
        if(!GameSettings.IsGm()){
            (<Note>this.object).playerVisible = true;
        }
    }

    /**
     * Returns the default options for this application
     */
    static get defaultOptions() {
        const options = super.defaultOptions;
        options.template = "modules/foundryvtt-simple-calendar/templates/calendar-notes.html";
        options.title = "FSC.Notes.DialogTitle";
        options.classes = ["form","simple-calendar-note"];
        options.resizable = true;
        options.closeOnSubmit = false;
        options.width = 500;
        return options;
    }

    checkForThirdPartyMarkdownEditors(){
        const meme = game.modules.get('markdown-editor');
        return meme !== undefined && meme.active;
    }

    /**
     * Gets the data object to be used by Handlebars when rending the HTML template
     */
    getData(options?: Application.RenderOptions): Promise<FormApplication.Data<{}>> | FormApplication.Data<{}> {
        let data = {
            ... super.getData(options),
            isGM: GameSettings.IsGm(),
            viewMode: this.viewMode,
            canEdit: GameSettings.IsGm() || GameSettings.UserID() === (<Note>this.object).author,
            enableRichTextEditButton: this.checkForThirdPartyMarkdownEditors(),
            noteYear: 0,
            noteMonth: '',
            repeatOptions: {0: 'FSC.Notes.Repeat.Never', 1: 'FSC.Notes.Repeat.Weekly', 2: 'FSC.Notes.Repeat.Monthly', 3: 'FSC.Notes.Repeat.Yearly'},
            repeats: (<Note>this.object).repeats,
            repeatsText: '',
            authorName: (<Note>this.object).author
        };
        if(SimpleCalendar.instance.currentYear && ((<Note>this.object).repeats === NoteRepeat.Yearly || (<Note>this.object).repeats === NoteRepeat.Monthly)){
            data.noteYear = SimpleCalendar.instance.currentYear.visibleYear;
        } else {
            data.noteYear = (<Note>this.object).year;
        }
        if(SimpleCalendar.instance.currentYear && (<Note>this.object).repeats === NoteRepeat.Monthly){
            const visibleMonth = SimpleCalendar.instance.currentYear.getMonth('visible');
            data.noteMonth = visibleMonth? visibleMonth.name : (<Note>this.object).monthDisplay;
        } else {
            data.noteMonth = (<Note>this.object).monthDisplay;
        }
        data.repeatsText = `${GameSettings.Localize("FSC.Notes.Repeats")} ${GameSettings.Localize(data.repeatOptions[data.repeats])}`;

        if(game.users){
            Logger.debug(`Looking for users with the id "${(<Note>this.object).author}"`);
            const user = game.users.get((<Note>this.object).author);
            if(user){
                data.authorName = user.name;
            }
        }
        return data;
    }

    /**
     * Adds any event listeners to the application DOM
     * @param {JQuery<HTMLElement>} html The root HTML of the application window
     * @protected
     */
    public activateListeners(html: JQuery<HTMLElement>) {
        super.activateListeners(html);
        if(html.hasOwnProperty("length")) {
            (<JQuery>this.element).find('#scNoteTitle').focus();
            (<JQuery>html).find('#scSubmit').on('click', this.saveButtonClick.bind(this));

            (<JQuery>html).find('#scNoteEdit').on('click', this.editButtonClick.bind(this));
            (<JQuery>html).find('#scNoteDelete').on('click', this.deleteButtonClick.bind(this));
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
        Logger.debug('Update Object Called');
        this.richEditorSaved = true;
        return Promise.resolve(false);
    }

    /**
     * Shows the application window
     */
    public showApp(){
        this.render(true);
    }

    /**
     * Closes the application window
     */
    public closeApp(){
        this.close().catch(error => Logger.error(error));
    }

    /**
     * Updates the windows rendering
     */
    public updateApp(){
        this.render(true);
    }

    /**
     * When the edit button is clicked
     * @param {Event} e The click event
     */
    public editButtonClick(e: Event){
        e.preventDefault();
        this.viewMode = false;
        this.updateNote = true;
        this.updateApp();
    }

    /**
     * When the delete button is clicked
     * @param {Event} e The click event
     */
    public async deleteButtonClick(e: Event){
        e.preventDefault();
        const dialog = new Dialog({
            title: GameSettings.Localize('FSC.DeleteConfirm'),
            content: GameSettings.Localize("FSC.DeleteConfirmText"),
            buttons:{
                yes: {
                    icon: '<i class="fas fa-trash"></i>',
                    label: GameSettings.Localize('FSC.Delete'),
                    callback: this.deleteConfirm.bind(this)
                },
                no: {
                    icon: '<i class="fas fa-times"></i>',
                    label: GameSettings.Localize('FSC.Cancel')
                }
            },
            default: "no"
        });
        dialog.render(true);
    }

    /**
     * Called when the user confirms the deletion of a note.
     */
    public async deleteConfirm(){
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

    /**
     * The save button click
     * @param {Event} e The click event
     */
    public async saveButtonClick(e: Event){
        Logger.debug('Saving New Note');
        e.preventDefault();
        let detailsEmpty = true;
        if(this.editors['content'] && this.editors['content'].mce){
            if(this.editors['content'].mce.getContent().trim() !== ''){
                (<Note>this.object).content = this.editors['content'].mce.getContent().trim();
                detailsEmpty = false;
            }
        }
        if(this.richEditorSaved || !detailsEmpty){
            const title = (<JQuery>this.element).find('#scNoteTitle').val();
            const playerVisible = (<JQuery>this.element).find('#scNoteVisibility').is(':checked');
            let repeats = (<JQuery>this.element).find('#scNoteRepeats').find(":selected").val();
            if(repeats){
                repeats = parseInt(repeats.toString());
            } else {
                repeats = 0;
            }
            if(title){
                (<Note>this.object).title = title.toString();
                (<Note>this.object).playerVisible = playerVisible;
                (<Note>this.object).repeats = repeats;
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
                        updateNote.repeats = (<Note>this.object).repeats;
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
