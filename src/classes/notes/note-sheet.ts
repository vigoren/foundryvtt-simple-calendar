import {
    ConcreteJournalEntry
} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/foundry.js/applications/formApplications/documentSheets/journalSheet";
import {ModuleName, NoteRepeat, SettingNames, SocketTypes, Themes} from "../../constants";
import {DateTheSame, DaysBetweenDates, FormatDateTime} from "../utilities/date-time";
import {GameSettings} from "../foundry-interfacing/game-settings";
import DateSelectorManager from "../date-selector/date-selector-manager";
import {CalManager, MainApplication, NManager} from "../index";
import {GetContrastColor} from "../utilities/visual";
import {getCheckBoxGroupValues, getNumericInputValue, getTextInputValue} from "../utilities/inputs";
import GameSockets from "../foundry-interfacing/game-sockets";

export class NoteSheet extends JournalSheet{

    private resized: boolean = false;

    private editMode: boolean = false;

    private readonly dateSelectorId: string;

    private static appWindowId: string = 'fsc-simple-calendar-note-journal-form';

    private journalData = {
        name: '',
        content: '',
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
        this.journalData.content = this.object.data.content;
        this.journalData.flags = mergeObject({}, this.object.data.flags);
        this.journalData.permission = mergeObject({}, this.object.data.permission);
    }

    protected _getHeaderButtons(): Application.HeaderButton[] {
        const buttons = super._getHeaderButtons();
        const reducedButtons = [];
        for(let i = 0; i < buttons.length; i++){
            if(buttons[i].class === 'close' || buttons[i].class === 'configure-sheet'){
                reducedButtons.push(buttons[i]);
            }
        }
        return reducedButtons;
    }

    close(options?: FormApplication.CloseOptions): Promise<void> {
        this.editMode = false;
        this.resized = false;
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
        let newOptions = {
            ...super.getData(),
            editable: this.isEditable,
            editMode: this.editMode,
            name: '',
            display: {
                date: '',
                reminder: false,
                repeats: 0,
                repeatsDisplay: '',
                author: {colorText: '', color: '', name: ''},
                categories: <any>[],
                enrichedContent: ''
            },
            edit: {
                dateDisplay: '',
                repeats: NoteRepeat.Never,
                noteData: {},
                users: <any>[],
                timeSelected: false,
                dateSelectorId: this.dateSelectorId,
                dateSelectorSelect: this.dateSelectorSelect.bind(this),
                repeatOptions: <SimpleCalendar.NoteRepeats>{0: 'FSC.Notes.Repeat.Never', 1: 'FSC.Notes.Repeat.Weekly', 2: 'FSC.Notes.Repeat.Monthly', 3: 'FSC.Notes.Repeat.Yearly'},
                allCategories: <any>[]
            }
        };

        const noteStub = NManager.getNoteStub(<JournalEntry>this.object);
        if(noteStub){
            newOptions.name = noteStub.title;
            if(this.editMode){
                newOptions.edit.noteData = noteStub.noteData || {};
                newOptions.edit.timeSelected = !noteStub.allDay;
                newOptions.edit.repeats = noteStub.repeats;
                const users = (<Game>game).users;
                if(users){
                    newOptions.edit.users = users.map(u => {return {
                        name: u.name,
                        id: u.id,
                        color: u.data.color,
                        textColor: GetContrastColor(u.color || ''),
                        selected: !!(this.object.data.permission[u.id] !== 0 && this.object.testUserPermission(u, 2)),
                        disabled: u.id === (<Game>game).user?.id
                    }});
                }
                const noteData = noteStub.noteData;
                if(noteData){
                    const calendar = CalManager.getCalendar(noteData.calendarId);
                    if(calendar){
                        newOptions.edit.dateDisplay = <string>FormatDateTime(noteData.startDate, 'MMMM DD, YYYY', calendar);
                        if(!DateTheSame(noteData.startDate, noteData.endDate)){
                            newOptions.edit.dateDisplay += ` - ${FormatDateTime(noteData.endDate, 'MMMM DD, YYYY', calendar)}`;
                        }
                        newOptions.edit.allCategories = calendar.noteCategories.map(nc => {
                            return {
                                name: nc.name,
                                color : nc.color,
                                textColor: nc.textColor,
                                selected: noteData.categories.find(c => c === nc.name) !== undefined
                            }
                        });
                    }
                }
            } else {
                newOptions.display.date = noteStub.fullDisplayDate;
                newOptions.display.reminder = noteStub.userReminderRegistered;
                newOptions.display.repeats = noteStub.repeats;
                newOptions.display.repeatsDisplay = GameSettings.Localize(newOptions.edit.repeatOptions[noteStub.repeats] || '');
                newOptions.display.author = noteStub.authorDisplay || {colorText: '', color: '', name: ''};
                newOptions.display.categories = noteStub.categories;
                newOptions.display.enrichedContent = TextEditor.enrichHTML(noteStub.content);
            }
        }
        return newOptions;
    }

    setHeight(){
        if(this.appWindow && !this.resized){
            const form = this.appWindow.getElementsByTagName('form');
            if(form && form.length){
                let height = 30;
                height += form[0].offsetHeight;
                if(this.editMode && height < 785){
                    height = 785;
                }
                const maxHeight = window.outerHeight * .75;
                if(height > maxHeight){
                    height = maxHeight;
                }
                this.setPosition({height: height, width: 720});
            }
        }
    }

    activateListeners(html: JQuery) {
        super.activateListeners(html);
        this.appWindow = document.getElementById(`${NoteSheet.appWindowId}-${this.object.id}`);
        if(this.appWindow){
            this.setHeight();
            if(this.editMode){
                DateSelectorManager.ActivateSelector(this.dateSelectorId);
                this.updateNoteRepeatDropdown();
                //---------------------
                // Input Changes
                //---------------------
                this.appWindow.querySelectorAll("input, select").forEach(e => {
                    e.addEventListener('change', async () => {
                        await this.writeInputValuesToObjects();
                    });
                });
            } else {
                //---------------------
                // Reminder Button Click
                //---------------------
                this.appWindow.querySelector('#scNoteReminder')?.removeAttribute('disabled');
                this.appWindow.querySelector('#scNoteReminder')?.addEventListener('click', this.reminderChange.bind(this));
            }
            //---------------------
            // Save/Edit/Delete Buttons
            //---------------------
            this.appWindow.querySelector('#scSubmit')?.addEventListener('click', this.save.bind(this));
            this.appWindow.querySelector('#scNoteEdit')?.addEventListener('click', this.edit.bind(this));
            this.appWindow.querySelector('#scNoteDelete')?.addEventListener('click', this.delete.bind(this));
        }
    }

    protected _onResize(event: Event) {
        this.resized = true;
        super._onResize(event);
    }

    async dateSelectorSelect(selectedDate: SimpleCalendar.DateTimeSelector.SelectedDates){
        const calendar = CalManager.getCalendar((<SimpleCalendar.NoteData>this.journalData.flags[ModuleName].noteData).calendarId);
        if(calendar){
            const sMonthIndex = !selectedDate.startDate.month || selectedDate.startDate.month < 0? 0 : selectedDate.startDate.month;
            const sDayIndex = !selectedDate.startDate.day || selectedDate.startDate.day < 0? 0 : selectedDate.startDate.day;
            const eMonthIndex = !selectedDate.endDate.month || selectedDate.endDate.month < 0? 0 : selectedDate.endDate.month;
            const eDayIndex = !selectedDate.endDate.day || selectedDate.endDate.day < 0? 0 : selectedDate.endDate.day;

            (<SimpleCalendar.NoteData>this.journalData.flags[ModuleName].noteData).allDay = !selectedDate.timeSelected;

            (<SimpleCalendar.NoteData>this.journalData.flags[ModuleName].noteData).startDate = {
                year: selectedDate.startDate.year || 0,
                month: sMonthIndex,
                day: sDayIndex,
                hour: selectedDate.startDate.hour || 0,
                minute: selectedDate.startDate.minute || 0,
                seconds: selectedDate.startDate.seconds || 0
            };
            (<SimpleCalendar.NoteData>this.journalData.flags[ModuleName].noteData).endDate = {
                year: selectedDate.endDate.year || 0,
                month: eMonthIndex,
                day: eDayIndex,
                hour: selectedDate.endDate.hour || 0,
                minute: selectedDate.endDate.minute || 0,
                seconds: selectedDate.endDate.seconds || 0
            };
            this.updateNoteRepeatDropdown();
        }
    }

    updateNoteRepeatDropdown(){
        if(this.appWindow){
            const selector = this.appWindow.querySelector('#scNoteRepeats');
            const noteData = <SimpleCalendar.NoteData>this.journalData.flags[ModuleName].noteData;
            if(selector && noteData){
                const calendar = CalManager.getCalendar(noteData.calendarId);
                if(calendar){
                    //Adjust the repeat options so that you can't repeat if the days between the start and end date are longer than the different options
                    const daysBetween = DaysBetweenDates(calendar, noteData.startDate,noteData.endDate);
                    let options: Record<string, string>= {'0': 'FSC.Notes.Repeat.Never', '1': 'FSC.Notes.Repeat.Weekly', '2': 'FSC.Notes.Repeat.Monthly', '3': 'FSC.Notes.Repeat.Yearly'};
                    if(daysBetween >= calendar.totalNumberOfDays(false, true)){
                        delete options['1'];
                        delete options['2'];
                        delete options['3'];
                    } else if(daysBetween >= calendar.months[noteData.startDate.month].days.length){
                        delete options['1'];
                        delete options['2'];
                    }else if(daysBetween >= calendar.weekdays.length){
                        delete options['1'];
                    }
                    let optionsHTML = '';
                    for(let k in options){
                        const selected = noteData.repeats.toString() === k;
                        optionsHTML += `<option value="${k}" ${selected? 'selected' : ''}>${GameSettings.Localize(options[k])}</option>`
                    }
                    selector.innerHTML = optionsHTML;
                }
            }
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
            if(this.editors['content']){
                this.journalData.content = this.editors['content'].mce?.getContent() || '';
            }
        }
    }

    async reminderChange(){
        const user = (<Game>game).user;
        if(user){
            const userId = user.id;
            //If the current user can edit the journal entry, then just edit it
            if((<JournalEntry>this.object).testUserPermission(user, 3)) {

                const userIndex = (<SimpleCalendar.NoteData>this.journalData.flags[ModuleName].noteData).remindUsers.indexOf(userId);
                if(userId !== '' && userIndex === -1){
                    (<SimpleCalendar.NoteData>this.journalData.flags[ModuleName].noteData).remindUsers.push(userId);
                } else if(userId !== '' && userIndex !== -1) {
                    (<SimpleCalendar.NoteData>this.journalData.flags[ModuleName].noteData).remindUsers.splice(userIndex, 1);
                }
                await (<JournalEntry>this.object).update(this.journalData);
            }
            //Otherwise, we need to send it to the GM to make the change
            else {
                const socket = <SimpleCalendar.SimpleCalendarSocket.Data>{
                    type: SocketTypes.noteUpdate,
                    data: {
                        userId: userId,
                        journalId: (<JournalEntry>this.object).id
                    }
                };
                await GameSockets.emit(socket);
            }
            this.render(true);
            MainApplication.updateApp();
        }
    }

    async edit(e: Event){
        e.preventDefault();
        this.resized = false;
        this.editMode = true;
        this.render(true);
    }

    async save(e: Event){
        e.preventDefault();
        await this.writeInputValuesToObjects();
        console.log(this.journalData);
        await (<JournalEntry>this.object).update(this.journalData);
        MainApplication.updateApp();
        this.resized = false;
        this.editMode = false;
        this.render(true);
        //await this.close();
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
        NManager.removeNoteStub((<JournalEntry>this.object));
        MainApplication.updateApp();
        await (<JournalEntry>this.object).delete();
        await this.close();
    }

}