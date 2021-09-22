import Note from './note';
import {Logger} from "./logging";
import {GameSettings} from "./game-settings";
import {NoteRepeat} from "../constants";
import SimpleCalendar from "./simple-calendar";
import DateSelector from "./date-selector";
import {NoteRepeats, SCDateSelector} from "../interfaces";
import Utilities from "./utilities";

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
     * If the note dialog has been resized at all
     */
    hasBeenResized: boolean = false;
    /**
     * The ID of the date selector input
     * @type {string}
     */
    dateSelectorId: string = '';
    /**
     * The date selector object
     * @type {DateSelector | null}
     */
    dateSelector: DateSelector | null = null;

    initialLoad: boolean = true;

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
        this.dateSelectorId = `scNoteDate_${data.id}`;
        this.dateSelector = DateSelector.GetSelector(this.dateSelectorId, {
            onDateSelect: this.dateSelectorClick.bind(this),
            placeHolderText: '',
            dateRangeSelect: true,
            showDate: true,
            showTime: true,
            startDate: {year: data.year, month: data.month, day: data.day, hour: data.hour, minute: data.minute, seconds: 0},
            endDate: data.endDate,
            allDay: data.allDay
        });
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
     * Checks to see if any of the known markdown editor modules are loaded and active in the world
     * Current Supported Editors:
     *      - Moerills Expandable Markdown Editor (https://www.foundryvtt-hub.com/package/markdown-editor/)
     */
    checkForThirdPartyMarkdownEditors(){
        const meme = (<Game>game).modules.get('markdown-editor');
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
            enrichedContent: TextEditor.enrichHTML((<Note>this.object).content),
            displayDate: '',
            repeatOptions: <NoteRepeats>{0: 'FSC.Notes.Repeat.Never', 1: 'FSC.Notes.Repeat.Weekly', 2: 'FSC.Notes.Repeat.Monthly', 3: 'FSC.Notes.Repeat.Yearly'},
            repeats: (<Note>this.object).repeats,
            repeatsText: '',
            reminder: (<Note>this.object).remindUsers.indexOf(GameSettings.UserID()) > -1,
            authDisplay: {
                name: '',
                color: '',
                textColor: ''
            },
            dateSelectorId: this.dateSelectorId,
            categories: SimpleCalendar.instance.activeCalendar.noteCategories.filter(nc => (<Note>this.object).categories.includes(nc.name)),
            allCategories: SimpleCalendar.instance.activeCalendar.noteCategories.map(nc => {
                return {
                    name: nc.name,
                    color : nc.color,
                    textColor: nc.textColor,
                    selected: (<Note>this.object).categories.find(c => c === nc.name) !== undefined
                }
            })
        };

        const daysBetween = Utilities.DaysBetweenDates({year: (<Note>this.object).year, month: (<Note>this.object).month, day: (<Note>this.object).day, hour: 0, minute:0, seconds: 0},{year: (<Note>this.object).endDate.year, month: (<Note>this.object).endDate.month, day: (<Note>this.object).endDate.day, hour: 0, minute:0, seconds: 0});

        if(daysBetween >= SimpleCalendar.instance.activeCalendar.year.totalNumberOfDays(false, true)){
            data.repeatOptions = {0: 'FSC.Notes.Repeat.Never'};
        } else if(daysBetween >= SimpleCalendar.instance.activeCalendar.year.months[0].days.length){
            data.repeatOptions = {0: 'FSC.Notes.Repeat.Never', 3: 'FSC.Notes.Repeat.Yearly'};
        }else if(daysBetween >= SimpleCalendar.instance.activeCalendar.year.weekdays.length){
            data.repeatOptions = {0: 'FSC.Notes.Repeat.Never', 2: 'FSC.Notes.Repeat.Monthly', 3: 'FSC.Notes.Repeat.Yearly'};
        }

        data.displayDate = (<Note>this.object).display();
        const rOpt = data.repeatOptions[data.repeats];
        if(rOpt){
            data.repeatsText = `${GameSettings.Localize("FSC.Notes.Repeats")} ${GameSettings.Localize(rOpt)}`;
        }

        const users = (<Game>game).users;
        if(users){
            Logger.debug(`Looking for users with the id "${(<Note>this.object).author}"`);
            const user = users.get((<Note>this.object).author);
            if(user){
                data.authDisplay = {
                    name: user.name? user.name : '',
                    color: user.data.color? user.data.color : '',
                    textColor: Utilities.GetContrastColor(user.data.color? user.data.color : '')
                }
            }
        }
        return data;
    }

    /**
     * When the window is resized
     * @param event
     * @protected
     */
    protected _onResize(event: Event) {
        super._onResize(event);
        this.hasBeenResized = true;
    }

    /**
     * Sets the width and height of the note window so that everything that needs to be visible is.
     * @param {JQuery} html
     */
    setWidthHeight(html: JQuery){
        if(this.hasBeenResized){
            return;
        }
        let halfWidth  = window.innerWidth / 2;
        let height = 0;
        let width = 16;

        const form = (<JQuery>html).find('form');
        if(form){
            const h = form.outerHeight(true);
            const w = form.outerWidth(true);
            height += h? h : 0;
            width += w? w : 0;
        }

        if(width > halfWidth){
            width = halfWidth;
        }

        if(width< 440){
            width = 440;
        }
        height += 46;
        if(height < 250){
            height = 250;
        }

        this.setPosition({width: width, height: height});
    }

    /**
     * Adds any event listeners to the application DOM
     * @param {JQuery<HTMLElement>} html The root HTML of the application window
     * @protected
     */
    public activateListeners(html: JQuery<HTMLElement>) {
        super.activateListeners(html);
        this.setWidthHeight(html);
        if(html.hasOwnProperty("length")) {
            this.dateSelector?.activateListeners();
            (<JQuery>this.element).find('#scNoteTitle').on('change', this.inputChanged.bind(this));
            (<JQuery>this.element).find('#scNoteRepeats').on('change', this.inputChanged.bind(this));
            (<JQuery>this.element).find('#scNoteVisibility').on('change', this.inputChanged.bind(this));
            (<JQuery>this.element).find('#scNoteDateAllDay').on('change', this.inputChanged.bind(this));
            (<JQuery>this.element).find('input[name="scNoteCategories"]').on('change', this.inputChanged.bind(this));
            (<JQuery>this.element).find('h1 .reminder input').on('change', this.reminderChange.bind(this));

            (<JQuery>html).find('#scSubmit').on('click', this.saveButtonClick.bind(this));
            (<JQuery>html).find('#scNoteEdit').on('click', this.editButtonClick.bind(this));
            (<JQuery>html).find('#scNoteDelete').on('click', this.deleteButtonClick.bind(this));
            if(this.initialLoad){
                this.initialLoad = false;
                setTimeout(this.focusTitleInput.bind(this), 1000);
            }
        }
    }

    /**
     * Focuses the title input
     */
    focusTitleInput(){
        (<JQuery>this.element).find('#scNoteTitle').focus();
    }

    /**
     * Processes all input change requests and ensures data is properly saved between form update
     * @param {Event} e The change event
     */
    public inputChanged(e: Event){
        Logger.debug('Input has changed, updating note object');
        const id = (<HTMLElement>e.currentTarget).id;
        const name = (<HTMLInputElement>e.currentTarget).name;
        let value = (<HTMLInputElement>e.currentTarget).value;
        const checked = (<HTMLInputElement>e.currentTarget).checked;

        if(value){
            value = value.trim();
        }

        if(id && id[0] !== '-'){
            Logger.debug(`ID "${id}" change found`);
            if(id === "scNoteTitle"){
                (<Note>this.object).title = value;
            } else if(id === "scNoteRepeats"){
                const r = parseInt(value);
                if(!isNaN(r)){
                    (<Note>this.object).repeats = r;
                } else {
                    (<Note>this.object).repeats = 0;
                }
            } else if(id === "scNoteVisibility"){
                (<Note>this.object).playerVisible = checked;
            } else if(id === "scNoteDateAllDay"){
                (<Note>this.object).allDay = !checked;
            }
        } else if(name){
            Logger.debug(`Input Name "${name}" change found`);
            if(name === 'scNoteCategories'){
                if(checked){
                    const nc = SimpleCalendar.instance.activeCalendar.noteCategories.findIndex(nc => nc.name === value);
                    (<Note>this.object).categories.push(SimpleCalendar.instance.activeCalendar.noteCategories[nc].name);
                } else {
                    const nci = (<Note>this.object).categories.findIndex(nc => nc === value);
                    (<Note>this.object).categories.splice(nci, 1);
                }
            }
        }
        this.updateApp();
    }

    /**
     * Triggers when the remind me button is clicks for a note.
     * @param e
     */
    public reminderChange(e: Event){
        const userId = GameSettings.UserID();
        const userIndex = (<Note>this.object).remindUsers.indexOf(userId);
        if(userId !== '' && userIndex === -1){
            (<Note>this.object).remindUsers.push(userId);
        } else if(userId !== '' && userIndex !== -1) {
            (<Note>this.object).remindUsers.splice(userIndex, 1);
        }
        if(this.viewMode){
            let currentNotes = GameSettings.LoadNotes().map(n => {
                const note = new Note();
                note.loadFromSettings(n);
                return note;
            });
            currentNotes = currentNotes.map(n => n.id === (<Note>this.object).id? (<Note>this.object) : n);
            GameSettings.SaveNotes(currentNotes).catch(Logger.error);
        }
        this.updateApp();
    }
    /**
     * Called when the date selector date has been selected
     * @param selectedDate
     */
    dateSelectorClick(selectedDate: SCDateSelector.SelectedDate){
        (<Note>this.object).year = selectedDate.startDate.year;
        (<Note>this.object).month = selectedDate.startDate.month;
        (<Note>this.object).day = selectedDate.startDate.day;
        (<Note>this.object).allDay = selectedDate.startDate.allDay;
        (<Note>this.object).hour = selectedDate.startDate.hour;
        (<Note>this.object).minute = selectedDate.startDate.minute;
        (<Note>this.object).endDate = {
            year: selectedDate.endDate.year,
            month: selectedDate.endDate.month,
            day: selectedDate.endDate.day,
            hour: selectedDate.endDate.hour,
            minute: selectedDate.endDate.minute,
            seconds: 0
        };

        const monthObj = SimpleCalendar.instance.activeCalendar.year.months.find(m => m.numericRepresentation === selectedDate.startDate.month);
        if(monthObj){
            (<Note>this.object).monthDisplay = monthObj.name;
        }
        this.updateApp();
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
        this.updateApp();
        return Promise.resolve(false);
    }

    /**
     * Override the base close function so that we can properly remove any instances of the date selector before closing the dialog
     * @param options
     */
    close(options?: FormApplication.CloseOptions): Promise<void> {
        DateSelector.RemoveSelector(this.dateSelectorId);
        return super.close(options);
    }

    /**
     * Shows the application window
     */
    public showApp(){
        this.hasBeenResized = false;
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
            note.loadFromSettings(n);
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

        if(this.editors['content'] && this.editors['content'].mce){
            if(this.editors['content'].mce.getContent().trim() !== ''){
                (<Note>this.object).content = this.editors['content'].mce.getContent().trim();
            }
        }
        if((<Note>this.object).title){
            let currentNotes = GameSettings.LoadNotes().map(n => {
                const note = new Note();
                note.loadFromSettings(n);
                return note;
            });
            if(this.updateNote){
                currentNotes = currentNotes.map(n => n.id === (<Note>this.object).id? (<Note>this.object) : n);
            } else {
                currentNotes.push(<Note>this.object);
            }
            await GameSettings.SaveNotes(currentNotes).catch(Logger.error);
            this.closeApp();
        } else {
            GameSettings.UiNotification(GameSettings.Localize("FSC.Error.Note.NoTitle"), 'error');
        }
    }
}
