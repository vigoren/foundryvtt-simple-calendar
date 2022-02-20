import {
    ConcreteJournalEntry
} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/foundry.js/applications/formApplications/documentSheets/journalSheet";
import {deepMerge} from "../utilities/object";
import {ModuleName, NoteRepeat, SettingNames, Themes} from "../../constants";
import {DateTheSame, FormatDateTime} from "../utilities/date-time";
import {GameSettings} from "../foundry-interfacing/game-settings";
import DateSelectorManager from "../date-selector/date-selector-manager";
import {CalManager} from "../index";
import {GetContrastColor} from "../utilities/visual";
import {getCheckBoxGroupValues, getNumericInputValue, getTextInputValue} from "../utilities/inputs";

export class NoteSheet extends JournalSheet{

    private editMode: boolean = false;

    private readonly dateSelectorId: string;

    private static appWindowId: string = 'simple-calendar-note-journal-form';

    private journalData = {
        name: '',
        flags: <Record<string,any>>{},
        permission: <Partial<Record<string, 0 | 1 | 2 | 3>>>{}
    };

    /**
     * The HTML element representing the application window
     * @private
     */
    private appWindow: HTMLElement | null = null;

    constructor(object: ConcreteJournalEntry, options = {}) {
        super(object, options);

        this.dateSelectorId = `scNoteDate_${this.object.id}`;
    }

    static get defaultOptions(){
        const options = super.defaultOptions;
        options.template = "modules/foundryvtt-simple-calendar/templates/note-sheet.html";
        options.title = "Simple Calendar Note";
        options.id = this.appWindowId;
        options.classes = ['sheet','journal-sheet','simple-calendar'];
        options.resizable = true;
        if((<Game>game).settings){
            options.classes.push(GameSettings.GetStringSettings(SettingNames.Theme));
        }
        return options;
    }

    static get defaultObject() {
        return {};
    }

    get template() {
        return this.options.template || '';
    }

    get type() {
        return 'simplecalendarnote';
    }

    copyData(){
        this.journalData.name = this.object.data.name;
        this.journalData.flags = mergeObject({}, this.object.data.flags);
        this.journalData.permission = mergeObject({}, this.object.data.permission);
    }

    protected _getHeaderButtons(): Application.HeaderButton[] {
        const closeButton = super._getHeaderButtons().find(h => h.class === 'close');
        if(closeButton){
            return [closeButton];
        }
        return [];
    }

    close(options?: FormApplication.CloseOptions): Promise<void> {
        this.editMode = false;
        return super.close(options);
    }

    render(force?: boolean, options?: Application.RenderOptions<JournalSheet.Options>, startInEditMode?: boolean): this {
        if(startInEditMode !== undefined){
            this.editMode = startInEditMode;
        }
        return super.render(force, options);
    }

    getData(options?: Partial<JournalSheet.Options>): Promise<JournalSheet.Data<JournalSheet.Options>> | JournalSheet.Data<JournalSheet.Options> {
        this.copyData();
        const noteData = <SimpleCalendar.NoteData>this.journalData.flags[ModuleName].noteData;
        let newOptions = {
            editable: this.isEditable,
            editMode: this.editMode,
            dateDisplay: '',
            noteData: {},
            users: <any>[],
            timeSelected: false,
            dateSelectorId: this.dateSelectorId,
            dateSelectorSelect: this.dateSelectorSelect.bind(this),
            repeatOptions: {0: 'FSC.Notes.Repeat.Never', 1: 'FSC.Notes.Repeat.Weekly', 2: 'FSC.Notes.Repeat.Monthly', 3: 'FSC.Notes.Repeat.Yearly'},
            allCategories: <any>[],
        };

        if(noteData){
            const calendar = CalManager.getCalendar(noteData.calendarId);
            let dateDisplay = '';



            newOptions.noteData = noteData;
            newOptions.timeSelected = !noteData.allDay;

            const users = (<Game>game).users;
            if(users){
                newOptions.users = users.map(u => {return {
                    name: u.name,
                    id: u.id,
                    color: u.data.color,
                    textColor: GetContrastColor(u.color || ''),
                    selected: this.object.testUserPermission(u, 2),
                    disabled: u.id === (<Game>game).user?.id
                }});
            }

            if(calendar){
                dateDisplay = <string>FormatDateTime(noteData.startDate, 'MMMM DD, YYYY', calendar);
                if(!DateTheSame(noteData.startDate, noteData.endDate)){
                    dateDisplay += ` - ${FormatDateTime(noteData.endDate, 'MMMM DD, YYYY', calendar)}`;
                }
                newOptions.dateDisplay = dateDisplay;
                newOptions.allCategories = calendar.noteCategories.map(nc => {
                    return {
                        name: nc.name,
                        color : nc.color,
                        textColor: nc.textColor,
                        selected: noteData.categories.find(c => c === nc.name) !== undefined
                    }
                });
            }
        }
        return deepMerge(super.getData(options), newOptions);
    }

    activateListeners(html: JQuery) {
        super.activateListeners(html);
        this.appWindow = document.getElementById(`${NoteSheet.appWindowId}-${this.object.id}`);
        DateSelectorManager.ActivateSelector(this.dateSelectorId);

        if(this.appWindow){
            //---------------------
            // Input Changes
            //---------------------
            this.appWindow.querySelectorAll("input, select").forEach(e => {
                e.addEventListener('change', async () => {
                    await this.writeInputValuesToObjects();
                });
            });

            //---------------------
            // Save/Edit/Delete Buttons
            //---------------------
            this.appWindow.querySelector('#scSubmit')?.addEventListener('click', this.save.bind(this));
            this.appWindow.querySelector('#scNoteEdit')?.addEventListener('click', this.edit.bind(this));
            this.appWindow.querySelector('#scNoteDelete')?.addEventListener('click', this.delete.bind(this));
        }
    }

    async dateSelectorSelect(selectedDate: SimpleCalendar.DateTimeSelector.SelectedDates){
        const calendar = CalManager.getCalendar((<SimpleCalendar.NoteData>this.journalData.flags[ModuleName].noteData).calendarId);
        if(calendar){
            const sMonthIndex = !selectedDate.startDate.month || selectedDate.startDate.month < 0? 0 : selectedDate.startDate.month;
            const sDayIndex = !selectedDate.startDate.day || selectedDate.startDate.day < 0? 0 : selectedDate.startDate.day;
            const eMonthIndex = !selectedDate.endDate.month || selectedDate.endDate.month < 0? 0 : selectedDate.endDate.month;
            const eDayIndex = !selectedDate.endDate.day || selectedDate.endDate.day < 0? 0 : selectedDate.endDate.day;
            const startMonthObj = calendar.year.months[sMonthIndex];
            const endMonthObj = calendar.year.months[eMonthIndex];

            (<SimpleCalendar.NoteData>this.journalData.flags[ModuleName].noteData).startDate = {
                year: selectedDate.startDate.year || 0,
                month: startMonthObj.numericRepresentation,
                day: startMonthObj.days[sDayIndex].numericRepresentation,
                hour: selectedDate.startDate.hour || 0,
                minute: selectedDate.startDate.minute || 0,
                seconds: selectedDate.startDate.seconds || 0
            };
            (<SimpleCalendar.NoteData>this.journalData.flags[ModuleName].noteData).endDate = {
                year: selectedDate.endDate.year || 0,
                month: endMonthObj.numericRepresentation,
                day: endMonthObj.days[eDayIndex].numericRepresentation,
                hour: selectedDate.endDate.hour || 0,
                minute: selectedDate.endDate.minute || 0,
                seconds: selectedDate.endDate.seconds || 0
            };
        }
    }

    async writeInputValuesToObjects(){
        if(this.appWindow){
            this.journalData.name = getTextInputValue('#scNoteTitle', <string>Themes.dark, this.appWindow);
            (<SimpleCalendar.NoteData>this.journalData.flags[ModuleName].noteData).repeats = <NoteRepeat>getNumericInputValue('#scNoteRepeats', NoteRepeat.Never, false, this.appWindow);
            (<SimpleCalendar.NoteData>this.journalData.flags[ModuleName].noteData).categories = getCheckBoxGroupValues('scNoteCategories', this.appWindow);

            const usersWithView = getCheckBoxGroupValues('scUserPermissions', this.appWindow);
            for(let k in this.journalData.permission){
                if(this.journalData.permission[k] !== 3){
                    this.journalData.permission[k] = 0;
                }
            }
            for(let i = 0; i < usersWithView.length; i++){
                const permissionValue = this.journalData.permission[usersWithView[i]];
                if(permissionValue === undefined || permissionValue < 2){
                    this.journalData.permission [usersWithView[i]] = 2;
                } else if(permissionValue === 3){
                    this.journalData.permission [usersWithView[i]] = 3;
                }
            }
        }
    }

    async edit(e: Event){
        e.preventDefault();
        this.editMode = true;
        this.render(true);
    }

    async save(e: Event){
        e.preventDefault();
        await this.writeInputValuesToObjects();
        await (<JournalEntry>this.object).update(this.journalData);
        await this.close();
    }

    delete(e: Event){
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

    async deleteConfirm(){
        await (<JournalEntry>this.object).delete();
        await this.close();
    }

}