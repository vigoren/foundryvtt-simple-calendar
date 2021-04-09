import {Note} from './note';
import {Logger} from "./logging";
import {GameSettings} from "./game-settings";
import {ModuleName, ModuleSocketName, NoteRepeat, SettingNames, SocketTypes} from "../constants";
import SimpleCalendar from "./simple-calendar";
import {SimpleCalendarSocket} from "../interfaces";

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
        this.editors['content'] = {
            target: 'content',
            changed: false,
            initial: (<Note>this.object).content,
            //@ts-ignore
            button: null,
            hasButton: false,
            active: false,
            mce: null,
            options: {
                //@ts-ignore
                target: null,
                //@ts-ignore
                height: 200,
                save_onsavecallback: this.saveEditor.bind(this, 'content')
            },
        };
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

    /**
     * Gets the data object to be used by Handlebars when rending the HTML template
     */
    getData(options?: Application.RenderOptions): Promise<FormApplication.Data<{}>> | FormApplication.Data<{}> {
        let data = {
            ... super.getData(options),
            isGM: GameSettings.IsGm(),
            viewMode: this.viewMode,
            richButton: !this.viewMode,
            canEdit: GameSettings.IsGm() || GameSettings.UserID() === (<Note>this.object).author,
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
     * Sets up our rich text editor when the app is shown
     * @param {JQuery<HTMLElement>} html The element that makes up the root of the application
     * @private
     */
    private setUpTextEditor(html: JQuery<HTMLElement>){
        if(this.editors['content']){
            if(this.editors['content'].mce === null){
                this.editors['content'].options.target = (<JQuery>html).find('.editor .editor-content')[0];
            }
            if(!this.viewMode && this.editors['content'].options.target && this.editors['content'].button === null){
                this.editors['content'].button = <HTMLElement>this.editors['content'].options.target.nextElementSibling;
                this.editors['content'].hasButton = this.editors['content'].button && this.editors['content'].button.classList.contains("editor-edit");
                this.editors['content'].active = !this.viewMode;
                if(this.editors['content'].hasButton){
                    this.editors['content'].button.onclick = SimpleCalendarNotes.instance.textEditorButtonClick.bind(this)
                }
            }
            if(this.editors['content'].mce === null && this.editors['content'].active){
                this.activateEditor('content');
            }
        }
    }

    /**
     * Activates a rich text editor, copied code from the main code file but with the editor focus removed
     * @param name
     * @param options
     * @param initialContent
     */
    public activateEditor(name: string, options: any ={}, initialContent="") {
        const editor = this.editors[name];
        if ( !editor ) throw new Error(`${name} is not a registered editor name!`);
        options = mergeObject(editor.options, options);
        options.height = options.target.offsetHeight;
        TextEditor.create(options, initialContent || editor.initial).then(mce => {
            editor.mce = mce;
            editor.changed = false;
            editor.active = true;
            mce.on('change', ev => editor.changed = true);
        });
    }

    /**
     * The button click for re-initializing the text editor
     * @param {Event} e The click event
     */
    public textEditorButtonClick(e: Event){
        if(this.editors['content']){
            this.editors['content'].button.style.display = "none";
        }
        this.richEditorSaved = false;
        this.activateEditor('content');
    }

    /**
     * Adds any event listeners to the application DOM
     * @param {JQuery<HTMLElement>} html The root HTML of the application window
     * @protected
     */
    public activateListeners(html: JQuery<HTMLElement>) {
        if(html.hasOwnProperty("length")) {
            this.setUpTextEditor(html);
            (<JQuery>this.element).find('#scNoteTitle').focus();
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
        Logger.debug('Update Object Called');
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
                    callback: SimpleCalendarNotes.instance.deleteConfirm.bind(this)
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
            if(this.editors['content'].mce.getContent().trim() !== '' && !this.editors['content'].mce.isNotDirty){
                (<Note>this.object).content = this.editors['content'].mce.getContent().trim();
                this.richEditorSaved = true;
            }
        } else {
            detailsEmpty = false;
        }
        if(this.richEditorSaved || detailsEmpty){
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
