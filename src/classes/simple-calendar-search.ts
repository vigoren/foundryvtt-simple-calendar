import Calendar from "./calendar";
import {GameSettings} from "./game-settings";
import {SimpleCalendarNotes} from "./simple-calendar-notes";
import {Logger} from "./logging";
import Note from "./note";

export default class SimpleCalendarSearch extends FormApplication{
    /**
     * Used to store a globally accessible copy of the Simple calendar Notes class for access from event functions.
     */
    static instance: SimpleCalendarSearch;
    /**
     * The typed in term to be searched
     */
    searchTerm: string = '';
    /**
     * List of notes that match the results
     */
    results: Note[] = [];

    constructor(calendar: Calendar) {
        super(calendar);
    }

    /**
     * Returns the default options for this application
     */
    static get defaultOptions() {
        const options = super.defaultOptions;
        options.template = "modules/foundryvtt-simple-calendar/templates/search.html";
        options.title = "FSC.Search";
        options.classes = ["form","simple-calendar"];
        options.resizable = true;
        options.closeOnSubmit = false;
        options.width = 500;
        options.height = 400;
        return options;
    }

    /**
     * Returns the data used by handlebars to render the dialog
     * @param options
     */
    getData(options?: Partial<FormApplicationOptions>): Promise<FormApplication.Data<{}, FormApplicationOptions>> | FormApplication.Data<{}, FormApplicationOptions> {
        let data = {
            ...super.getData(options),
            isGM: GameSettings.IsGm(),
            searchTerm: this.searchTerm,
            results: this.results.map(n => n.toTemplate())
        };

        return data;
    }

    /**
     * Activates all HTML listeners in the dialog
     * @param html
     */
    activateListeners(html: JQuery) {
        super.activateListeners(html);
        (<JQuery>html).find(".search-box .fa-search").on('click', SimpleCalendarSearch.instance.search.bind(this));
        // Note Click
        (<JQuery>html).find(".note-list .note").on('click', SimpleCalendarSearch.instance.viewNote.bind(this));
    }

    protected _updateObject(event: Event, formData?: object): Promise<unknown> {
        return Promise.resolve(false);
    }

    /**
     * Shows the application window
     */
    public showApp(){
        this.render(true);
    }

    /**
     * Performs the search
     */
    public search(){
        this.searchTerm = (this.element.find('#simpleCalendarSearchBox').val() || '').toString();
        this.results = [];
        if(this.searchTerm){
            this.results = (<Calendar>this.object).searchNotes(this.searchTerm);
        }
        this.showApp();
    }

    /**
     * Opens up a note to view the contents
     * @param {Event} e The click event
     */
    public viewNote(e: Event){
        e.stopPropagation();
        const dataIndex = (<HTMLElement>e.currentTarget).getAttribute('data-index');
        if(dataIndex){
            const note = this.results.find(n=> n.id === dataIndex);
            if(note){
                SimpleCalendarNotes.instance = new SimpleCalendarNotes(note, true);
                SimpleCalendarNotes.instance.showApp();
            }
        } else {
            Logger.error('No Data index on note element found.');
        }
    }
}
