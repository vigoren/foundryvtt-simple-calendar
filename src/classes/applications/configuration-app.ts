import {Logger} from "../logging";
import {GameSettings} from "../foundry-interfacing/game-settings";
import Month from "../calendar/month";
import {Weekday} from "../calendar/weekday";
import {
    ConfigurationDateSelectors,
    GameWorldTimeIntegrations,
    Icons,
    LeapYearRules,
    ModuleName,
    MoonYearResetOptions,
    PredefinedCalendars,
    SettingNames,
    Themes,
    YearNamingRules
} from "../../constants";
import Season from "../calendar/season";
import Moon from "../calendar/moon";
import {saveAs} from "file-saver";
import {ClientSettings, NoteCategory, SCDateSelector} from "../../interfaces";
import PredefinedCalendar from "../configuration/predefined-calendar";
import Calendar from "../calendar";
import DateSelectorManager from "../date-selector/date-selector-manager";
import {animateElement, animateFormGroup, GetContrastColor} from "../utilities/visual";
import {CalManager, SC} from "../index";
import UserPermissions from "../configuration/user-permissions";
import {deepMerge} from "../utilities/object";
import {getCheckBoxInputValue, getNumericInputValue, getTextInputValue} from "../utilities/inputs";

export default class ConfigurationApp extends FormApplication {

    public static appWindowId: string = 'simple-calendar-configuration-application-form';

    private noteCategories: NoteCategory[] = [];


    private calendars: Calendar[] = [];
    /**
     * If the year has changed
     * @private
     */
    private yearChanged: boolean = false;

    private dateFormatTableExpanded: boolean = false;

    permissions: UserPermissions = new UserPermissions();

    clientSettings: ClientSettings = {id: '', theme: Themes.dark, openOnLoad: true, openCompact: false, rememberPosition: true, appPosition: {}};

    uiElementStates = {
        selectedPredefinedCalendar: '',
        qsNextClicked: false
    };

    /**
     * The Calendar configuration constructor
     */
    constructor() {
        super({});
    }

    /**
     * Sets up the data for the dialog and shows it
     */
    initializeAndShowDialog(){
        this.calendars = CalManager.cloneCalendars();
        this.object = this.calendars[0];//Temp until we get better calendar picking
        SC.load();
        this.permissions = SC.permissions.clone();
        this.clientSettings = deepMerge({}, SC.clientSettings);
        this._tabs[0].active = "globalSettings";

        if(!this.rendered){
            this.showApp();
        } else {
            this.bringToTop();
        }
    }

    /**
     * Returns the default options for this application
     */
    static get defaultOptions() {
        const options = super.defaultOptions;
        options.template = "modules/foundryvtt-simple-calendar/templates/calendar-config.html";
        options.title = "FSC.Configuration.Title";
        options.id = this.appWindowId;
        options.classes = ["simple-calendar"];
        options.resizable = true;
        options.tabs = [{navSelector: ".tabs", contentSelector: "form", initial: "yearSettings"}];
        options.height = 700;
        options.width = 1005;
        return options;
    }

    /**
     * Shows the application window
     */
    public showApp(){
        this.render(true, {classes: ["simple-calendar", GameSettings.GetStringSettings(SettingNames.Theme)]});
    }

    /**
     * Closes the application window
     */
    public closeApp(){
        this.close().catch(Logger.error);
    }

    /**
     * When closing the app make sure all date selectors are removed from the list so we don't keep around what we don't need
     * @param options
     */
    close(options?: FormApplication.CloseOptions): Promise<void> {
        CalManager.clearClones();
        (<Calendar>this.object).year.seasons.forEach(s => {
            DateSelectorManager.RemoveSelector(`sc_season_start_date_${s.id}`);
            DateSelectorManager.RemoveSelector(`sc_season_sunrise_time_${s.id}`);
        });
        return super.close(options);
    }

    /**
     * Re renders the application window
     * @private
     */
    private updateApp(){
        this.render(false);
    }

    /**
     * Gets the data object to be used by Handlebars when rending the HTML template
     */
    public getData(options?: Application.RenderOptions): Promise<FormApplication.Data<{}>> | FormApplication.Data<{}> {
        let data = {
            ...super.getData(options),
            isGM: GameSettings.IsGm(),
            qsCalDate: {year: 1, month: 0, day: 0, hour: 0, minute: 0, allDay: true},
            uiElementStates: this.uiElementStates,
            calendars: this.calendars,
            clientSettings: {
                openOnLoad: this.clientSettings.openOnLoad,
                openInCompact: this.clientSettings.openCompact,
                rememberPos: this.clientSettings.rememberPosition,
                theme: this.clientSettings.theme,
                themes: {
                    'dark': 'FSC.Configuration.Theme.Dark',
                    'light': 'FSC.Configuration.Theme.Light'
                }
            },
            globalConfiguration:{
                permissions: this.permissions
            },

            showDateFormatTokens: this.dateFormatTableExpanded,
            gameSystem: (<Calendar>this.object).gameSystem,
            currentYear: (<Calendar>this.object).year,
            generalSettings: (<Calendar>this.object).generalSettings,
            months: (<Calendar>this.object).year.months.map(m => m.toTemplate()),
            weekdays: (<Calendar>this.object).year.weekdays.map(w => w.toTemplate()),
            leapYearRules: {none: 'FSC.Configuration.LeapYear.Rules.None', gregorian: 'FSC.Configuration.LeapYear.Rules.Gregorian', custom: 'FSC.Configuration.LeapYear.Rules.Custom'},
            leapYearRule: (<Calendar>this.object).year.leapYearRule,
            showLeapYearCustomMod: (<Calendar>this.object).year.leapYearRule.rule === LeapYearRules.Custom,
            showLeapYearMonths: (<Calendar>this.object).year.leapYearRule.rule !== LeapYearRules.None,
            predefined: [
                {key: PredefinedCalendars.Gregorian, label: 'FSC.Configuration.LeapYear.Rules.Gregorian'},
                {key: PredefinedCalendars.DarkSun, label: 'Dark Sun'},
                {key: PredefinedCalendars.Eberron, label: 'Eberron'},
                {key: PredefinedCalendars.Exandrian, label: 'Exandrian'},
                {key: PredefinedCalendars.ForbiddenLands, label: 'Forbidden Lands'},
                {key: PredefinedCalendars.Harptos, label: 'Forgotten Realms: Harptos'},
                {key: PredefinedCalendars.GolarianPF1E, label: 'Golarian: Pathfinder 1E'},
                {key: PredefinedCalendars.GolarianPF2E, label: 'Golarian: Pathfinder 2E'},
                {key: PredefinedCalendars.Greyhawk, label: 'Greyhawk'},
                {key: PredefinedCalendars.TravellerImperialCalendar, label: 'Traveller: Imperial Calendar'},
                {key: PredefinedCalendars.WarhammerImperialCalendar, label: 'Warhammer: Imperial Calendar'}
            ],
            timeTrackers: {
                none: 'FSC.Configuration.General.None',
                self: 'FSC.Configuration.General.Self',
                'third-party': 'FSC.Configuration.General.ThirdParty',
                'mixed': 'FSC.Configuration.General.Mixed'
            },
            monthStartingWeekdays: <{[key: string]: string}>{},
            seasons: (<Calendar>this.object).year.seasons.map(s => s.toTemplate((<Calendar>this.object).year)),
            seasonColors: [
                {
                    value: '#ffffff',
                    display: GameSettings.Localize("FSC.Configuration.Season.ColorWhite")
                },
                {
                    value: '#fffce8',
                    display: GameSettings.Localize("FSC.Configuration.Season.ColorSpring")
                },
                {
                    value: '#f3fff3',
                    display: GameSettings.Localize("FSC.Configuration.Season.ColorSummer")
                },
                {
                    value: '#fff7f2',
                    display: GameSettings.Localize("FSC.Configuration.Season.ColorFall")
                },
                {
                    value: '#f2f8ff',
                    display: GameSettings.Localize("FSC.Configuration.Season.ColorWinter")
                }
            ],
            moons: (<Calendar>this.object).year.moons.map(m => m.toTemplate((<Calendar>this.object).year)),
            moonIcons: <{[key: string]: string}>{},
            moonYearReset: {
                none: 'FSC.Configuration.Moon.YearResetNo',
                'leap-year': 'FSC.Configuration.Moon.YearResetLeap',
                'x-years': 'FSC.Configuration.Moon.YearResetX'
            },
            yearNameBehaviourOptions: {
                'default': 'Default',
                'repeat': 'PLAYLIST.SoundRepeat',
                'random': 'FSC.Random'
            },
            users: <{[key: string]: string}>{},
            noteCategories: <NoteCategory[]>[]
        };

        data.moonIcons[Icons.NewMoon] = GameSettings.Localize('FSC.Moon.Phase.New');
        data.moonIcons[Icons.WaxingCrescent] = GameSettings.Localize('FSC.Moon.Phase.WaxingCrescent');
        data.moonIcons[Icons.FirstQuarter] = GameSettings.Localize('FSC.Moon.Phase.FirstQuarter');
        data.moonIcons[Icons.WaxingGibbous] = GameSettings.Localize('FSC.Moon.Phase.WaxingGibbous');
        data.moonIcons[Icons.Full] = GameSettings.Localize('FSC.Moon.Phase.Full');
        data.moonIcons[Icons.WaningGibbous] = GameSettings.Localize('FSC.Moon.Phase.WaningGibbous');
        data.moonIcons[Icons.LastQuarter] = GameSettings.Localize('FSC.Moon.Phase.LastQuarter');
        data.moonIcons[Icons.WaningCrescent] = GameSettings.Localize('FSC.Moon.Phase.WaningCrescent');

        data.monthStartingWeekdays['null'] = GameSettings.Localize('Default');
        for(let i = 0; i < (<Calendar>this.object).year.weekdays.length; i++){
            data.monthStartingWeekdays[(<Calendar>this.object).year.weekdays[i].numericRepresentation.toString()] = (<Calendar>this.object).year.weekdays[i].name;
        }
        const users = (<Game>game).users;
        if(users){
            users.forEach(u => {
                if(!u.isGM && u.id !== null){
                    data.users[u.id] = u.name? u.name : '';
                }
            });
        }

        const currDate = (<Calendar>this.object).getCurrentDate();
        data.qsCalDate.year = currDate.year;
        data.qsCalDate.month = currDate.month;
        data.qsCalDate.day = currDate.day;

        data.noteCategories = (<Calendar>this.object).noteCategories;
        return data;
    }

    /**
     * Updates the data object
     * @param event
     * @param formData
     * @protected
     */
    protected _updateObject(event: Event, formData?: object): Promise<unknown> {
        return Promise.resolve(undefined);
    }

    /**
     * Adds any event listeners to the application DOM
     * @param {JQuery<HTMLElement>} html The root HTML of the application window
     * @protected
     */
    public activateListeners(html: JQuery<HTMLElement>) {
        super.activateListeners(html);
        (<Calendar>this.object).year.seasons.forEach(s => {
            DateSelectorManager.GetSelector(`sc_season_start_date_${s.id}`, {onDateSelect: this.dateSelectorChange.bind(this, s.id, ConfigurationDateSelectors.seasonStartingDate)}).activateListeners();
            DateSelectorManager.GetSelector( `sc_season_sunrise_time_${s.id}`, {onDateSelect: this.dateSelectorChange.bind(this, s.id, ConfigurationDateSelectors.seasonSunriseSunsetTime)}).activateListeners();
        });

        const appWindow = document.getElementById(ConfigurationApp.appWindowId);
        if(appWindow){

            DateSelectorManager.ActivateSelector('quick-setup-predefined-calendar');

            // Click anywhere in the app
            appWindow.addEventListener('click', () => {
                this.toggleCalendarSelector(true);
            });
            //---------------------
            // Calendar Picker / Add new calendar
            //---------------------
            appWindow.querySelector('.tabs .calendar-selector .heading')?.addEventListener('click', this.toggleCalendarSelector.bind(this, false));
            appWindow.querySelectorAll('.tabs .calendar-selector ul li[data-calendar]').forEach(e => {
                e.addEventListener('click', this.calendarClick.bind(this));
            });
            appWindow.querySelectorAll('.tabs .calendar-selector ul li[data-calendar] .control').forEach(e => {
                e.addEventListener('click', this.removeCalendarClick.bind(this));
            });
            appWindow.querySelector('.tab-wrapper .new-calendar .save')?.addEventListener('click', this.addNewCalendar.bind(this));
            //---------------------
            // Quick Setup
            //---------------------
            //Predefined Calendar clicked
            appWindow.querySelectorAll('.quick-setup .predefined-list .predefined-calendar').forEach(e => {
                e.addEventListener('click', this.predefinedCalendarClick.bind(this));
            });
            //Next button clicked
            appWindow.querySelector('.quick-setup .control-section .qs-next')?.addEventListener('click', this.quickSetupNextClick.bind(this));
            //Back button clicked
            appWindow.querySelector('.quick-setup .control-section .qs-back')?.addEventListener('click', this.quickSetupBackClick.bind(this));
            //Save button clicked
            appWindow.querySelector('.quick-setup .control-section .qs-save')?.addEventListener('click', this.quickSetupSaveClick.bind(this));

            //---------------------
            // Month Show/Hide Advanced
            //---------------------
            appWindow.querySelectorAll(".month-show-advanced").forEach(e => {
                e.addEventListener('click', this.toggleMonthShowAdvanced.bind(this));
            });
            //---------------------
            // Input Changes
            //---------------------
            appWindow.querySelectorAll("input, select").forEach(e => {
                e.addEventListener('change', () => {
                    this.writeInputValuesToObjects();
                    this.updateUIFromObject();
                });
            });

            //---------------------
            // Save Button
            //---------------------
            appWindow.querySelector("#scSave")?.addEventListener('click', this.saveClick.bind(this, true));
        }



        if(html.hasOwnProperty("length")) {
            //Date Format Tokens Show/hide
            (<JQuery>html).find('.date-format-token-show').on('click', this.dateFormatTableClick.bind(this));

            //Table Removes
            (<JQuery>html).find(".remove-month").on('click', this.removeFromTable.bind(this, 'month'));
            (<JQuery>html).find(".remove-weekday").on('click', this.removeFromTable.bind(this, 'weekday'));
            (<JQuery>html).find(".remove-season").on('click', this.removeFromTable.bind(this, 'season'));
            (<JQuery>html).find(".remove-moon").on('click', this.removeFromTable.bind(this, 'moon'));
            (<JQuery>html).find(".remove-moon-phase").on('click', this.removeFromTable.bind(this, 'moon-phase'));
            (<JQuery>html).find(".remove-year-name").on('click', this.removeFromTable.bind(this, 'year-name'));
            (<JQuery>html).find(".remove-note-category").on('click', this.removeFromTable.bind(this, 'note-category'));

            //Table Adds
            (<JQuery>html).find(".month-add").on('click', this.addToTable.bind(this, 'month'));
            (<JQuery>html).find(".weekday-add").on('click', this.addToTable.bind(this, 'weekday'));
            (<JQuery>html).find(".season-add").on('click', this.addToTable.bind(this, 'season'));
            (<JQuery>html).find(".moon-add").on('click', this.addToTable.bind(this, 'moon'));
            (<JQuery>html).find(".moon-phase-add").on('click', this.addToTable.bind(this, 'moon-phase'));
            (<JQuery>html).find(".year-name-add").on('click', this.addToTable.bind(this, 'year-name'));
            (<JQuery>html).find(".note-category-add").on('click', this.addToTable.bind(this, 'note-category'));

            (<JQuery>html).find("#exportCalendar").on('click', this.exportCalendar.bind(this));
            (<JQuery>html).find("#importCalendar").on('click', this.importCalendar.bind(this));
        }
    }

    private toggleCalendarSelector(forceHide: boolean = false){
        const cList = document.querySelector(".tabs .calendar-selector ul");
        if(cList){
            animateElement(cList, 500, forceHide);
        }
    }

    private calendarClick(e: Event){
        const target = <HTMLElement>e.currentTarget;
        if(target){
            const calId = target.getAttribute('data-calendar');
            if(calId && calId !== (<Calendar>this.object).id){
                const clickedCal = this.calendars.find(c => c.id === calId);
                if(clickedCal){
                    this.object = clickedCal;
                    this.updateApp();
                }
            }
        }
    }

    private removeCalendarClick(e: Event){
        e.preventDefault();
        e.stopPropagation();
        const target = <HTMLElement>e.currentTarget;
        if(target){
            const calId = target.getAttribute('data-calendar');
            if(calId){
                const clickedCal = this.calendars.find(c => c.id === calId);
                if(clickedCal){
                    this.confirmationDialog('remove-calendar', 'remove-calendar', {id: clickedCal.id, name: clickedCal.name});
                }
            }
        }
    }

    private removeCalendarConfirm(args: any){
        if(args['id']){
            CalManager.removeCalendar(args['id']);
            this.calendars = CalManager.getAllCalendars(true);
            this.updateApp();
        }
    }

    private addNewCalendar(e: Event){
        e.preventDefault();
        const calNameElement = <HTMLInputElement>document.getElementById('scAddCalendarName');
        if(calNameElement && calNameElement.value){
            const newCal = CalManager.addTempCalendar(calNameElement.value);
            PredefinedCalendar.setToPredefined(newCal.year, PredefinedCalendars.Gregorian);
            this.calendars.push(newCal);
            this.object = newCal;
            this._tabs[0].active = "quickSetup";
            this.updateApp();
        }
    }

    private predefinedCalendarClick(e: Event){
        const element = <HTMLElement>e.target;
        if(element){
            const allReadySelected = element.classList.contains('selected');
            document.querySelectorAll(`#${ConfigurationApp.appWindowId} .quick-setup .predefined-list .predefined-calendar`).forEach(e => {
                e.classList.remove('selected');
            });
            const nextBttn = document.querySelector('#simple-calendar-configuration-application-form .quick-setup .control-section .qs-next');
            if(!allReadySelected){
                element.classList.add('selected');
                const cal = element.getAttribute('data-calendar');
                if(cal){
                    this.uiElementStates.selectedPredefinedCalendar = cal;
                    if(nextBttn){
                        (<HTMLElement>nextBttn).style.display = 'block';
                    }
                    //PredefinedCalendar.setToPredefined((<Calendar>this.object).year, <PredefinedCalendars>cal);
                }
            } else {
                this.uiElementStates.selectedPredefinedCalendar = '';
                if(nextBttn){
                    (<HTMLElement>nextBttn).style.display = 'none';
                }
            }

        }
    }

    private quickSetupNextClick(e: Event){
        e.preventDefault();
        this.confirmationDialog('overwrite', 'predefined', {name: (<Calendar>this.object).name});
    }

    private quickSetupNextConfirm(){
        PredefinedCalendar.setToPredefined((<Calendar>this.object).year, <PredefinedCalendars>this.uiElementStates.selectedPredefinedCalendar);
        this.uiElementStates.qsNextClicked = !this.uiElementStates.qsNextClicked;
        const step1 = document.querySelector('#simple-calendar-configuration-application-form .quick-setup .predefined');
        const step2 = document.querySelector('#simple-calendar-configuration-application-form .quick-setup .settings');
        if(step1 && step2){
            animateElement(step1, 500);
            animateElement(step2, 500);
        }
        const currDate = (<Calendar>this.object).getCurrentDate();
        const ds = DateSelectorManager.GetSelector('quick-setup-predefined-calendar', {
            calendar: (<Calendar>this.object),
            selectedStartDate: {year: currDate.year, month: currDate.month, day: currDate.day, hour: 0, minute: 0, seconds: 0},
            selectedEndDate: {year: currDate.year, month: currDate.month, day: currDate.day, hour: 0, minute: 0, seconds: 0}
        });
        ds.update(false);
    }

    private quickSetupBackClick(e: Event){
        e.preventDefault();
        this.uiElementStates.qsNextClicked = !this.uiElementStates.qsNextClicked;
        const step1 = document.querySelector('#simple-calendar-configuration-application-form .quick-setup .predefined');
        const step2 = document.querySelector('#simple-calendar-configuration-application-form .quick-setup .settings');
        if(step1 && step2){
            animateElement(step1, 500);
            animateElement(step2, 500);
        }
    }

    private quickSetupSaveClick(e: Event){
        e.preventDefault();
        this.uiElementStates.selectedPredefinedCalendar = ''
        this.uiElementStates.qsNextClicked = false;
        const ds = DateSelectorManager.GetSelector('quick-setup-predefined-calendar', {});
        let monthIndex, dayIndex = 0;
        monthIndex = (<Calendar>this.object).year.months.findIndex(m => m.numericRepresentation === ds.selectedDate.startDate.month);
        if(monthIndex > -1) {
            dayIndex = (<Calendar>this.object).year.months[monthIndex].days.findIndex(d => d.numericRepresentation === ds.selectedDate.startDate.day);
        }
        if(monthIndex > -1 && dayIndex > -1){
            (<Calendar>this.object).year.numericRepresentation = ds.selectedDate.startDate.year;
            (<Calendar>this.object).year.visibleYear = ds.selectedDate.startDate.year;
            (<Calendar>this.object).year.selectedYear = ds.selectedDate.startDate.year;
            (<Calendar>this.object).year.updateMonth(monthIndex, 'current', true, dayIndex);
        }
        this._tabs[0].active = "generalSettings";
        const curYear = document.getElementById('scCurrentYear');
        if(curYear){
            (<HTMLInputElement>curYear).value = (<Calendar>this.object).year.numericRepresentation.toString();
        }
        this.saveClick(false, e).catch(Logger.error);
    }

    private toggleMonthShowAdvanced(e: Event){
        e.preventDefault();
        const target = <HTMLElement>e.currentTarget;
        if(target){
            const row = <HTMLElement>target.closest('.row');
            if(row){
                const index = parseInt(row.getAttribute('data-index') || '');
                if(!isNaN(index) && index >= 0 && index < (<Calendar>this.object).year.months.length){
                    (<Calendar>this.object).year.months[index].showAdvanced = !(<Calendar>this.object).year.months[index].showAdvanced;
                    this.updateUIFromObject();
                }
            }
        }
    }

    private writeInputValuesToObjects(){
        //----------------------------------
        // Global Config: Settings
        //----------------------------------
        this.clientSettings.theme = <Themes>getTextInputValue('#scTheme', <string>Themes.dark);
        this.clientSettings.openOnLoad = getCheckBoxInputValue('#scOpenOnLoad', true);
        this.clientSettings.openCompact = getCheckBoxInputValue('#scOpenInCompact', false);
        this.clientSettings.rememberPosition = getCheckBoxInputValue('#scRememberPos', true);

        //----------------------------------
        // Global Config: Permissions
        //----------------------------------
        this.permissions.viewCalendar.player = getCheckBoxInputValue('#scCalendarVisibleP', true);
        this.permissions.viewCalendar.trustedPlayer = getCheckBoxInputValue('#scCalendarVisibleTP', true);
        this.permissions.viewCalendar.assistantGameMaster = getCheckBoxInputValue('#scCalendarVisibleAGM', true);
        this.permissions.addNotes.player = getCheckBoxInputValue('#scAddNotesP', false);
        this.permissions.addNotes.trustedPlayer = getCheckBoxInputValue('#scAddNotesTP', false);
        this.permissions.addNotes.assistantGameMaster = getCheckBoxInputValue('#scAddNotesAGM', false);
        this.permissions.changeDateTime.player = getCheckBoxInputValue('#scChangeDateTimeP', false);
        this.permissions.changeDateTime.trustedPlayer = getCheckBoxInputValue('#scChangeDateTimeTP', false);
        this.permissions.changeDateTime.assistantGameMaster = getCheckBoxInputValue('#scChangeDateTimeAGM', false);
        this.permissions.reorderNotes.player = getCheckBoxInputValue('#scReorderNotesP', false);
        this.permissions.reorderNotes.trustedPlayer = getCheckBoxInputValue('#scReorderNotesTP', false);
        this.permissions.reorderNotes.assistantGameMaster = getCheckBoxInputValue('#scReorderNotesAGM', false);

        //----------------------------------
        // Calendar: General Settings
        //----------------------------------
        (<Calendar>this.object).name = getTextInputValue('#scCalendarName', 'New Calendar');
        (<Calendar>this.object).generalSettings.gameWorldTimeIntegration = <GameWorldTimeIntegrations>getTextInputValue('#scGameWorldTime', <string>GameWorldTimeIntegrations.Mixed);
        (<Calendar>this.object).generalSettings.pf2eSync = getCheckBoxInputValue('#scPF2ESync', true);

        //----------------------------------
        // Calendar: Display Options
        //----------------------------------
        (<Calendar>this.object).generalSettings.dateFormat.date = getTextInputValue('#scDateFormatsDate', 'MMMM DD, YYYY');
        (<Calendar>this.object).generalSettings.dateFormat.time = getTextInputValue('#scDateFormatsTime', 'HH:mm:ss');
        (<Calendar>this.object).generalSettings.dateFormat.monthYear = getTextInputValue('#scDateFormatsMonthYear', 'MMMM YAYYYYYZ');

        //----------------------------------
        // Calendar: Year Settings
        //----------------------------------
        (<Calendar>this.object).year.numericRepresentation = <number>getNumericInputValue('#scCurrentYear', 0);
        (<Calendar>this.object).year.prefix = getTextInputValue("#scYearPreFix", "");
        (<Calendar>this.object).year.postfix = getTextInputValue("#scYearPostFix", "");
        (<Calendar>this.object).year.yearZero = <number>getNumericInputValue('#scYearZero', 0);

        (<Calendar>this.object).year.yearNamingRule = <YearNamingRules>getTextInputValue("#scYearNameBehaviour", <string>YearNamingRules.Default);
        (<Calendar>this.object).year.yearNamesStart = <number>getNumericInputValue('#scYearNamesStart', 0);
        document.querySelectorAll('#simple-calendar-configuration-application-form .year-settings .year-names>.row:not(.head)').forEach(e => {
            const index = parseInt((<HTMLElement>e).getAttribute('data-index') || '');
            if(!isNaN(index) && index >= 0 && index < (<Calendar>this.object).year.yearNames.length){
                (<Calendar>this.object).year.yearNames[index] = getTextInputValue(".year-name", "New Named Year", e);
            }
        });

        //----------------------------------
        // Calendar: Month Settings
        //----------------------------------
        document.querySelectorAll('#simple-calendar-configuration-application-form .month-settings .months>.row:not(.head)').forEach(e => {
            const index = parseInt((<HTMLElement>e).getAttribute('data-index') || '');
            if(!isNaN(index) && index >= 0 && index < (<Calendar>this.object).year.months.length){
                const name = getTextInputValue(".month-name", "New Month", e);
                if(name !== (<Calendar>this.object).year.months[index].name ){
                    (<Calendar>this.object).year.months[index].abbreviation = name.substring(0, 3);
                } else {
                    (<Calendar>this.object).year.months[index].abbreviation = getTextInputValue(".month-abbreviation", "New Month", e);
                }
                (<Calendar>this.object).year.months[index].name = name;
                const days = <number>getNumericInputValue('.month-days', 1, false, e);
                if(days !== (<Calendar>this.object).year.months[index].numberOfDays){
                    (<Calendar>this.object).year.months[index].numberOfDays = days;
                    if((<Calendar>this.object).year.leapYearRule.rule === LeapYearRules.None){
                        (<Calendar>this.object).year.months[index].numberOfLeapYearDays = days;
                    }
                    this.updateMonthDays((<Calendar>this.object).year.months[index]);
                }
                const intercalary = getCheckBoxInputValue(".month-intercalary", false, e);
                if(intercalary !== (<Calendar>this.object).year.months[index].intercalary){
                    (<Calendar>this.object).year.months[index].intercalary = intercalary;
                    this.rebaseMonthNumbers();
                }
                const intercalaryInclude = getCheckBoxInputValue(".month-intercalary-include", false, e);
                if(intercalaryInclude !== (<Calendar>this.object).year.months[index].intercalaryInclude){
                    (<Calendar>this.object).year.months[index].intercalaryInclude = intercalaryInclude;
                    this.rebaseMonthNumbers();
                }
                (<Calendar>this.object).year.months[index].numericRepresentationOffset = <number>getNumericInputValue(".month-numeric-representation-offset", 0, false, e);
                (<Calendar>this.object).year.months[index].startingWeekday = getNumericInputValue(".month-starting-weekday", null, false, e);
            }
        });
        //----------------------------------
        // Calendar: Weekday Settings
        //----------------------------------
        (<Calendar>this.object).year.showWeekdayHeadings = getCheckBoxInputValue('#scShowWeekdayHeaders', true);
        (<Calendar>this.object).year.firstWeekday = <number>getNumericInputValue('#scWeekdayFirstDay', 0, false);
        document.querySelectorAll('#simple-calendar-configuration-application-form .weekday-settings .weekdays>.row:not(.head)').forEach(e => {
            const index = parseInt((<HTMLElement>e).getAttribute('data-index') || '');
            if(!isNaN(index) && index >= 0 && index < (<Calendar>this.object).year.weekdays.length){
                const name = getTextInputValue('.weekday-name', 'New Weekday', e);
                if(name !== (<Calendar>this.object).year.weekdays[index].name){
                    (<Calendar>this.object).year.weekdays[index].name = name;
                    (<Calendar>this.object).year.weekdays[index].abbreviation = name.substring(0, 2);
                } else {
                    (<Calendar>this.object).year.weekdays[index].abbreviation = getTextInputValue('.weekday-abbreviation', 'New', e);
                }
            }
        });

        //----------------------------------
        // Calendar: Leap Year Settings
        //----------------------------------
        (<Calendar>this.object).year.leapYearRule.rule = <LeapYearRules>getTextInputValue('#scLeapYearRule', 'none');
        (<Calendar>this.object).year.leapYearRule.customMod = <number>getNumericInputValue('#scLeapYearCustomMod', 0, false);
        document.querySelectorAll('#simple-calendar-configuration-application-form .leapyear-settings .months>.row:not(.head)').forEach(e => {
            const index = parseInt((<HTMLElement>e).getAttribute('data-index') || '');
            if(!isNaN(index) && index >= 0 && index < (<Calendar>this.object).year.months.length){
                const days = <number>getNumericInputValue('.month-leap-days', 0, false, e);
                if(days !== (<Calendar>this.object).year.months[index].numberOfLeapYearDays){
                    (<Calendar>this.object).year.months[index].numberOfLeapYearDays = days;
                    this.updateMonthDays((<Calendar>this.object).year.months[index]);
                }
            }
        });

        //----------------------------------
        // Calendar: Season Settings
        //----------------------------------
        document.querySelectorAll('#simple-calendar-configuration-application-form .season-settings .seasons>.row:not(.head)').forEach(e => {
            const index = parseInt((<HTMLElement>e).getAttribute('data-index') || '');
            if(!isNaN(index) && index >= 0 && index < (<Calendar>this.object).year.seasons.length){
                (<Calendar>this.object).year.seasons[index].name = getTextInputValue(".season-name", "New Season", e);
                (<Calendar>this.object).year.seasons[index].color = getTextInputValue(".season-color", "#FFFFFF", e);
            }
        });

        //----------------------------------
        // Calendar: Moon Settings
        //----------------------------------
        document.querySelectorAll('#simple-calendar-configuration-application-form .moon-settings .moons>.row:not(.head)').forEach(e => {
            const index = parseInt((<HTMLElement>e).getAttribute('data-index') || '');
            if(!isNaN(index) && index >= 0 && index < (<Calendar>this.object).year.moons.length){
                (<Calendar>this.object).year.moons[index].name = getTextInputValue('.moon-name', 'New Moon', e);
                (<Calendar>this.object).year.moons[index].cycleLength = <number>getNumericInputValue('.moon-cycle-length', 29.53059, true, e);
                (<Calendar>this.object).year.moons[index].cycleDayAdjust = <number>getNumericInputValue('.moon-cycle-adjustment', 0, true, e);
                (<Calendar>this.object).year.moons[index].color = getTextInputValue('.moon-color', '#FFFFFF', e);
                (<Calendar>this.object).year.moons[index].firstNewMoon.yearReset = <MoonYearResetOptions>getTextInputValue('.moon-year-reset', 'none', e);
                (<Calendar>this.object).year.moons[index].firstNewMoon.year = <number>getNumericInputValue('.moon-year', 0, false, e);
                (<Calendar>this.object).year.moons[index].firstNewMoon.yearX = <number>getNumericInputValue('.moon-year-x', 0, false, e);
                (<Calendar>this.object).year.moons[index].firstNewMoon.month = <number>getNumericInputValue('.moon-month', 1, false, e);
                (<Calendar>this.object).year.moons[index].firstNewMoon.day = <number>getNumericInputValue('.moon-day', 1, false, e);

                e.querySelectorAll('.phases>.row:not(.head)').forEach(p => {
                    const phaseIndex = parseInt((<HTMLElement>p).getAttribute('data-index') || '');
                    if(!isNaN(phaseIndex) && phaseIndex >= 0 && phaseIndex < (<Calendar>this.object).year.moons[index].phases.length){
                        (<Calendar>this.object).year.moons[index].phases[phaseIndex].name = getTextInputValue('.moon-phase-name', 'New Phase', p);
                        (<Calendar>this.object).year.moons[index].phases[phaseIndex].singleDay = getCheckBoxInputValue('.moon-phase-single-day', false, p);
                        (<Calendar>this.object).year.moons[index].phases[phaseIndex].icon = <Icons>getTextInputValue('.moon-phase-icon', 'new', p);
                    }
                });

                (<Calendar>this.object).year.moons[index].updatePhaseLength();
            }
        });

        //----------------------------------
        // Calendar: Time Settings
        //----------------------------------
        (<Calendar>this.object).year.time.hoursInDay = <number>getNumericInputValue('#scHoursInDay', 24);
        (<Calendar>this.object).year.time.minutesInHour = <number>getNumericInputValue('#scMinutesInHour', 60);
        (<Calendar>this.object).year.time.secondsInMinute = <number>getNumericInputValue('#scSecondsInMinute', 60);
        (<Calendar>this.object).year.time.secondsInCombatRound = <number>getNumericInputValue('#scSecondsInCombatRound', 6);
        (<Calendar>this.object).generalSettings.showClock = getCheckBoxInputValue('#scShowClock', true);
        (<Calendar>this.object).year.time.gameTimeRatio = <number>getNumericInputValue('#scGameTimeRatio', 1);
        (<Calendar>this.object).year.time.updateFrequency = <number>getNumericInputValue('#scTimeUpdateFrequency', 1);
        (<Calendar>this.object).year.time.unifyGameAndClockPause = getCheckBoxInputValue('#scUnifyClockWithFoundryPause', false);

        //----------------------------------
        // Calendar: Note Settings
        //----------------------------------
        (<Calendar>this.object).generalSettings.noteDefaultVisibility = getCheckBoxInputValue('#scDefaultPlayerVisibility', true);
        document.querySelectorAll('#simple-calendar-configuration-application-form .note-settings .note-categories .row:not(.head)').forEach(e => {
            const index = parseInt((<HTMLElement>e).getAttribute('data-index') || '');
            if(!isNaN(index) && index >= 0 && index < (<Calendar>this.object).noteCategories.length){
                (<Calendar>this.object).noteCategories[index].name = getTextInputValue(".note-category-name", "New Category", e);
                (<Calendar>this.object).noteCategories[index].color = getTextInputValue(".note-category-color", "New Category", e);
                (<Calendar>this.object).noteCategories[index].textColor = GetContrastColor((<Calendar>this.object).noteCategories[index].color);
            }
        });
    }

    private updateUIFromObject(){
        //----------------------------------
        // Calendar Config: Year
        //----------------------------------
        animateFormGroup('#scYearNamesStart', (<Calendar>this.object).year.yearNamingRule !== YearNamingRules.Random);

        //----------------------------------
        // Calendar Config: Month
        //----------------------------------
        for(let i = 0; i < (<Calendar>this.object).year.months.length; i++){
            const row = document.querySelector(`#simple-calendar-configuration-application-form .month-settings .months>.row[data-index="${i}"]`);
            if(row){
                //Show Advanced Stuff
                const button = row.querySelector('.month-show-advanced');
                const options = row.querySelector('.options');
                if(button && options){
                    if((options.classList.contains('closed') && (<Calendar>this.object).year.months[i].showAdvanced) || (options.classList.contains('open') && !(<Calendar>this.object).year.months[i].showAdvanced)){
                        animateElement(options, 400);
                    }
                    if((<Calendar>this.object).year.months[i].showAdvanced){
                        button.classList.remove('fa-chevron-down');
                        button.classList.add('fa-chevron-up');
                        (<HTMLElement>button).innerHTML = `<span>${GameSettings.Localize('FSC.HideAdvanced')}</span>`;
                    } else {
                        button.classList.add('fa-chevron-down');
                        button.classList.remove('fa-chevron-up');
                        (<HTMLElement>button).innerHTML = `<span>${GameSettings.Localize('FSC.ShowAdvanced')}</span>`;
                    }
                }
                //Intercalary Stuff
                animateFormGroup('.month-intercalary-include', (<Calendar>this.object).year.months[i].intercalary, row);

                //Month Number
                const mn = row.querySelector('.month-number');
                if(mn){
                    (<HTMLElement>mn).innerText = (<Calendar>this.object).year.months[i].numericRepresentation < 0 ? 'IC' : (<Calendar>this.object).year.months[i].numericRepresentation.toString();
                }
            }
        }

        //----------------------------------
        // Calendar Config: Leap Year
        //----------------------------------
        animateFormGroup('#scLeapYearCustomMod', (<Calendar>this.object).year.leapYearRule.rule === LeapYearRules.Custom);
        let fg = document.querySelector('#scLeapYearMonthList');
        if(fg){
            if((fg.classList.contains('closed') && (<Calendar>this.object).year.leapYearRule.rule !== LeapYearRules.None) || (fg.classList.contains('open') && (<Calendar>this.object).year.leapYearRule.rule === LeapYearRules.None)){
                animateElement(fg, 400);
            } else if((<Calendar>this.object).year.leapYearRule.rule !== LeapYearRules.None){
                fg.classList.remove('closed');
                fg.classList.add('open');
            } else {
                fg.classList.add('closed');
                fg.classList.remove('open');
            }
        }

        //----------------------------------
        // Calendar Config: Moons
        //----------------------------------
        for(let i = 0; i < (<Calendar>this.object).year.moons.length; i++){
            const row = document.querySelector(`#simple-calendar-configuration-application-form .moon-settings .moons>.row[data-index="${i}"]`);
            if(row){
                animateFormGroup('.moon-year', (<Calendar>this.object).year.moons[i].firstNewMoon.yearReset === MoonYearResetOptions.None, row);
                animateFormGroup('.moon-year-x', (<Calendar>this.object).year.moons[i].firstNewMoon.yearReset === MoonYearResetOptions.XYears, row);
                for(let p = 0; p < (<Calendar>this.object).year.moons[i].phases.length; p++){
                    const pl = row.querySelector(`.phases>.row[data-index="${p}"] .moon-phase-length`);
                    if(pl){
                        (<HTMLElement>pl).innerText = `${(<Calendar>this.object).year.moons[i].phases[p].length} ${GameSettings.Localize('FSC.Days')}`;
                    }
                }
            }
        }
    }

    /**
     * When the date format table header is clicked, will expand/collapse the table of information
     */
    private dateFormatTableClick(){
        this.dateFormatTableExpanded = !this.dateFormatTableExpanded;
        this.updateApp();
    }

    /**
     * Looks at all of the months and updates their numeric representation depending on if they are intercalary or not
     */
    public rebaseMonthNumbers(){
        let lastMonthNumber = 0;
        let icMonths = 0;
        for(let i = 0; i < (<Calendar>this.object).year.months.length; i++){
            const month = (<Calendar>this.object).year.months[i];
            if(month.intercalary){
                icMonths++;
                month.numericRepresentation = -1 * icMonths;
            } else {
                month.numericRepresentation = lastMonthNumber + 1;
                lastMonthNumber = month.numericRepresentation;
            }
        }
    }

    /**
     * Adds to the specified table.
     * @param {string} setting The settings table we are adding to. only accepts month, weekday, season, moon, moon-phase
     * @param {Event} e The click event
     */
    public addToTable(setting: string, e: Event){
        e.preventDefault();
        const filteredSetting = setting.toLowerCase() as 'month' | 'weekday' | 'season' | 'moon' | 'moon-phase' | 'year-name' | 'note-category';
        switch (filteredSetting){
            case "month":
                const newMonthNumber = (<Calendar>this.object).year.months.length + 1;
                (<Calendar>this.object).year.months.push(new Month('New Month', newMonthNumber, 0, 30));
                this.rebaseMonthNumbers();
                break;
            case "weekday":
                const newWeekdayNumber = (<Calendar>this.object).year.weekdays.length + 1;
                (<Calendar>this.object).year.weekdays.push(new Weekday(newWeekdayNumber, 'New Weekday'));
                break;
            case "season":
                (<Calendar>this.object).year.seasons.push(new Season('New Season', 1, 1));
                break;
            case "moon":
                const newMoon = new Moon('Moon', 29.53059);
                newMoon.firstNewMoon = {
                    yearReset: MoonYearResetOptions.None,
                    yearX: 0,
                    year: 0,
                    month: 1,
                    day: 1
                };
                const phaseLength = Number(((newMoon.cycleLength - 4) / 4).toPrecision(5));
                newMoon.phases = [
                    {name: GameSettings.Localize('FSC.Moon.Phase.New'), length: 1, icon: Icons.NewMoon, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingCrescent'), length: phaseLength, icon: Icons.WaxingCrescent, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.FirstQuarter'), length: 1, icon: Icons.FirstQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingGibbous'), length: phaseLength, icon: Icons.WaxingGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.Full'), length: 1, icon: Icons.Full, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningGibbous'), length: phaseLength, icon: Icons.WaningGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.LastQuarter'), length: 1, icon: Icons.LastQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningCrescent'), length: phaseLength, icon: Icons.WaningCrescent, singleDay: false}
                ];
                (<Calendar>this.object).year.moons.push(newMoon);
                break;
            case "moon-phase":
                const dataMoonIndex = (<HTMLElement>e.currentTarget).getAttribute('data-moon-index');
                if(dataMoonIndex){
                    const moonIndex = parseInt(dataMoonIndex);
                    if(!isNaN(moonIndex) && moonIndex < (<Calendar>this.object).year.moons.length){
                        (<Calendar>this.object).year.moons[moonIndex].phases.push({
                            name: "Phase",
                            length: 1,
                            icon: Icons.NewMoon,
                            singleDay: false
                        });
                        (<Calendar>this.object).year.moons[moonIndex].updatePhaseLength();
                    }
                }
                break;
            case "year-name":
                (<Calendar>this.object).year.yearNames.push('New Named Year');
                break;
            case 'note-category':
                (<Calendar>this.object).noteCategories.push({name: "New Category", color:"#b13737 ", textColor:"#ffffff"});
                break;
        }
        this.updateApp();
    }

    /**
     * Removes one or more row from the specified table.
     * @param {string} setting The settings table we are removing from. only accepts month, weekday, season, moon, moon-phase
     * @param {Event} e The click event
     */
    public removeFromTable(setting: string, e: Event){
        e.preventDefault();
        const filteredSetting = setting.toLowerCase() as 'month' | 'weekday' | 'season' | 'moon' | 'moon-phase' | 'year-name' | 'note-category';
        const dataIndex = (<HTMLElement>e.currentTarget).getAttribute('data-index');
        if(dataIndex && dataIndex !== 'all'){
            const index = parseInt(dataIndex);
            if(!isNaN(index)){
                switch (filteredSetting){
                    case "month":
                        if(index < (<Calendar>this.object).year.months.length){
                            (<Calendar>this.object).year.months.splice(index, 1);
                            //Reindex the remaining months
                            for(let i = 0; i < (<Calendar>this.object).year.months.length; i++){
                                (<Calendar>this.object).year.months[i].numericRepresentation = i + 1;
                            }
                            this.rebaseMonthNumbers();
                        }
                        break;
                    case "weekday":
                        if(index < (<Calendar>this.object).year.weekdays.length){
                            (<Calendar>this.object).year.weekdays.splice(index, 1);
                            //Reindex the remaining months
                            for(let i = 0; i < (<Calendar>this.object).year.weekdays.length; i++){
                                (<Calendar>this.object).year.weekdays[i].numericRepresentation = i + 1;
                            }
                        }
                        break;
                    case "season":
                        if(index < (<Calendar>this.object).year.seasons.length){
                            (<Calendar>this.object).year.seasons.splice(index, 1);
                        }
                        break;
                    case "moon":
                        if(index < (<Calendar>this.object).year.moons.length){
                            (<Calendar>this.object).year.moons.splice(index, 1);
                        }
                        break;
                    case "moon-phase":
                        const dataMoonIndex = (<HTMLElement>e.currentTarget).getAttribute('data-moon-index');
                        if(dataMoonIndex){
                            const moonIndex = parseInt(dataMoonIndex);
                            if(!isNaN(moonIndex) && moonIndex < (<Calendar>this.object).year.moons.length && index < (<Calendar>this.object).year.moons[moonIndex].phases.length){
                                (<Calendar>this.object).year.moons[moonIndex].phases.splice(index, 1);
                                (<Calendar>this.object).year.moons[moonIndex].updatePhaseLength();
                            }
                        }
                        break;
                    case "year-name":
                        if(index < (<Calendar>this.object).year.yearNames.length){
                            (<Calendar>this.object).year.yearNames.splice(index, 1);
                        }
                        break;
                    case 'note-category':
                        if(index < (<Calendar>this.object).noteCategories.length){{
                            (<Calendar>this.object).noteCategories.splice(index, 1);
                        }}
                        break;
                }
                this.updateApp();
            }
        } else if(dataIndex && dataIndex === 'all'){
            switch (filteredSetting){
                case "month":
                    (<Calendar>this.object).year.months = [];
                    break;
                case "weekday":
                    (<Calendar>this.object).year.weekdays = [];
                    break;
                case "season":
                    (<Calendar>this.object).year.seasons = [];
                    break;
                case "moon":
                    (<Calendar>this.object).year.moons = [];
                    break;
                case "moon-phase":
                    const dataMoonIndex = (<HTMLElement>e.currentTarget).getAttribute('data-moon-index');
                    if(dataMoonIndex){
                        const moonIndex = parseInt(dataMoonIndex);
                        if(!isNaN(moonIndex) && moonIndex < (<Calendar>this.object).year.moons.length){
                            (<Calendar>this.object).year.moons[moonIndex].phases = [];
                        }
                    }
                    break;
                case "year-name":
                    (<Calendar>this.object).year.yearNames = [];
                    break;
                case 'note-category':
                    (<Calendar>this.object).noteCategories = [];
                    break;
            }
            this.updateApp();
        }

    }

    /**
     * When the GM confirms using a predefined calendar
     */
    public predefinedApplyConfirm() {
        const selectedPredefined = <PredefinedCalendars>(<HTMLInputElement>document.getElementById("scPreDefined")).value;
        Logger.debug(`Overwriting the existing calendar configuration with the "${selectedPredefined}" configuration`);
        PredefinedCalendar.setToPredefined((<Calendar>this.object).year, selectedPredefined);
        this.yearChanged = true;
        this.updateApp();
    }

    /**
     * Function called when ever a date selector in the configuration dialog is changed.
     * @param {string} seasonId The ID of the item changed
     * @param {ConfigurationDateSelectors} dateSelectorType The type of date selector that was changed
     * @param {SCDateSelector.SelectedDate} selectedDate The returned data from the date selector
     */
    public dateSelectorChange(seasonId: string, dateSelectorType: ConfigurationDateSelectors, selectedDate: SCDateSelector.Result){
        //Season Changes
        const season = (<Calendar>this.object).year.seasons.find(s => s.id === seasonId);
        if(season){
            if(dateSelectorType === ConfigurationDateSelectors.seasonStartingDate){
                const sMonthIndex = !selectedDate.startDate.month || selectedDate.startDate.month < 0? 0 : selectedDate.startDate.month;
                const sDayIndex = !selectedDate.startDate.day || selectedDate.startDate.day < 0? 0 : selectedDate.startDate.day;
                season.startingMonth = (<Calendar>this.object).year.months[sMonthIndex].numericRepresentation;
                season.startingDay = (<Calendar>this.object).year.months[sMonthIndex].days[sDayIndex].numericRepresentation;
            } else if(dateSelectorType === ConfigurationDateSelectors.seasonSunriseSunsetTime){
                const activeCalendar = CalManager.getActiveCalendar();
                season.sunriseTime = ((selectedDate.startDate.hour || 0) * activeCalendar.year.time.minutesInHour * activeCalendar.year.time.secondsInMinute) + ((selectedDate.startDate.minute || 0) * activeCalendar.year.time.secondsInMinute);
                season.sunsetTime = ((selectedDate.endDate.hour || 0) * activeCalendar.year.time.minutesInHour * activeCalendar.year.time.secondsInMinute) + ((selectedDate.endDate.minute || 0) * activeCalendar.year.time.secondsInMinute);
            }
        }
    }

    /**
     * Updates the month object to ensure the number of day objects it has matches any change values
     * @param {Month} month The month to check
     */
    public updateMonthDays(month: Month){
        //Check to see if the number of days is less than 0 and set it to 0
        if(month.numberOfDays < 0){
            month.numberOfDays = 0;
        }
        //Check if the leap year days was set to less than 0 and set it to equal the number of days
        if(month.numberOfLeapYearDays < 0){
            month.numberOfLeapYearDays = month.numberOfDays;
        }
        //The number of day objects to create
        const daysShouldBe = month.numberOfLeapYearDays > month.numberOfDays? month.numberOfLeapYearDays : month.numberOfDays;
        const monthCurrentDay = month.getDay();
        let currentDay = null;
        if(monthCurrentDay){
            if(monthCurrentDay.numericRepresentation >= month.numberOfDays){
                Logger.debug('The current day falls outside of the months new days, setting to first day of the month.');
                currentDay = 0;
            } else {
                currentDay = monthCurrentDay.numericRepresentation;
            }
        }
        month.days = [];
        month.populateDays(daysShouldBe, currentDay);
    }

    /**
     * Shows a confirmation dialog to the user to confirm that they want to do the action they chose
     * @param {string} dialogType
     * @param {string} contentType
     * @param {*} args
     */
    public confirmationDialog(dialogType: string, contentType: string, args: any){
        let title = '', content = '';
        if(dialogType === 'overwrite'){
            title = GameSettings.Localize('FSC.ApplyPredefined');
            content = GameSettings.Localize("FSC.ApplyPredefinedText").replace('${CAL_NAME}', args['name']);
        } else if(dialogType === 'remove-calendar'){
            title = GameSettings.Localize('FSC.RemoveCalendar');
            content = GameSettings.Localize("FSC.RemoveCalendarConfirmText").replace('${CAL_NAME}', args['name']);
        }
        const dialog = new Dialog({
            title: title,
            content: content,
            buttons:{
                yes: {
                    icon: '<i class="fas fa-check"></i>',
                    label: GameSettings.Localize('FSC.Confirm'),
                    callback: this.confirmationDialogYes.bind(this, contentType, args)
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
     * Based on the passed in types calls the correct functionality
     * @param {string} contentType The type of action being preformed
     * @param {*} args The sub type of the above type
     */
    public async confirmationDialogYes(contentType: string, args: any){
        if(contentType === 'predefined'){
            this.quickSetupNextConfirm();
        } else if(contentType === 'remove-calendar'){
            this.removeCalendarConfirm(args);
        }
    }

    /**
     * When the save button is clicked, apply those changes to the game settings and re-load the calendars across all players
     * @param {boolean} close If to close the dialog after save
     * @param {Event} e The click event
     */
    public async saveClick(close: boolean, e: Event) {
        e.preventDefault();
        try{
            this.writeInputValuesToObjects();
            CalManager.mergeClonedCalendars();
            SC.save({
                id: '',
                permissions: this.permissions.toConfig(),
                clientSettings: this.clientSettings
            });
            await CalManager.getActiveCalendar().syncTime(true);
            if(close){
                this.closeApp();
            } else {
                this.calendars = CalManager.cloneCalendars();
                this.object = this.calendars[0];
                this.updateApp();
            }
        } catch (error: any){
            Logger.error(error);
        }
    }

    /**
     * Exports the current calendar configuration to a JSON file. Users should be prompted with a save as dialog.
     * @param event
     */
    public exportCalendar(event: Event){
        event.preventDefault();
        const ex = {
            currentDate: GameSettings.GetObjectSettings(SettingNames.CurrentDate),
            generalSettings: GameSettings.GetObjectSettings(SettingNames.GeneralConfiguration),
            leapYearSettings: GameSettings.GetObjectSettings(SettingNames.LeapYearRule),
            monthSettings: GameSettings.GetObjectSettings(SettingNames.MonthConfiguration),
            moonSettings: GameSettings.GetObjectSettings(SettingNames.MoonConfiguration),
            noteCategories: GameSettings.GetObjectSettings(SettingNames.NoteCategories),
            seasonSettings: GameSettings.GetObjectSettings(SettingNames.SeasonConfiguration),
            timeSettings: GameSettings.GetObjectSettings(SettingNames.TimeConfiguration),
            weekdaySettings: GameSettings.GetObjectSettings(SettingNames.WeekdayConfiguration),
            yearSettings: GameSettings.GetObjectSettings(SettingNames.YearConfiguration)
        };
        saveAs(new Blob([JSON.stringify(ex)], {type: 'application/json'}), 'simple-calendar-export.json');
    }

    /**
     * Imports a Simple Calendar configuration JSON file into the current calendar. Does its best to detect incorrect file format.
     * @param event
     */
    public importCalendar(event: Event){
        event.preventDefault();
        const fileInput = <HTMLInputElement>document.getElementById('-scImportCalendarPicker');
        if(fileInput && fileInput.files && fileInput.files.length){
            const reader = new FileReader();
            reader.onload = this.importOnLoad.bind(this, reader);
            reader.readAsText(fileInput.files[0]);
        } else {
            GameSettings.UiNotification(GameSettings.Localize('FSC.Importer.NoFile'), 'warn');
        }
    }

    /**
     * Processes the response once the file has been loaded.
     * @param reader
     * @param e
     * @private
     */
    private async importOnLoad(reader: FileReader, e: Event){
        try{
            if(reader.result){
                const res = JSON.parse(reader.result.toString());
                if(res.hasOwnProperty('yearSettings')){
                    await (<Game>game).settings.set(ModuleName, SettingNames.YearConfiguration, res.yearSettings);
                }
                if(res.hasOwnProperty('monthSettings')){
                    await (<Game>game).settings.set(ModuleName, SettingNames.MonthConfiguration, res.monthSettings);
                }
                if(res.hasOwnProperty('weekdaySettings')){
                    await (<Game>game).settings.set(ModuleName, SettingNames.WeekdayConfiguration, res.weekdaySettings);
                }
                if(res.hasOwnProperty('leapYearSettings')){
                    await (<Game>game).settings.set(ModuleName, SettingNames.LeapYearRule, res.leapYearSettings);
                }
                if(res.hasOwnProperty('timeSettings')){
                    await (<Game>game).settings.set(ModuleName, SettingNames.TimeConfiguration, res.timeSettings);
                }
                if(res.hasOwnProperty('seasonSettings')){
                    await (<Game>game).settings.set(ModuleName, SettingNames.SeasonConfiguration, res.seasonSettings);
                }
                if(res.hasOwnProperty('moonSettings')){
                    await (<Game>game).settings.set(ModuleName, SettingNames.MoonConfiguration, res.moonSettings);
                }
                if(res.hasOwnProperty('generalSettings')){
                    await (<Game>game).settings.set(ModuleName, SettingNames.GeneralConfiguration, res.generalSettings);
                }
                if(res.hasOwnProperty('noteCategories')){
                    await (<Game>game).settings.set(ModuleName, SettingNames.NoteCategories, res.noteCategories);
                }
                if(res.hasOwnProperty('currentDate')){
                    await (<Game>game).settings.set(ModuleName, SettingNames.CurrentDate, res.currentDate);
                }
                this.closeApp();
            }
        } catch (ex){
            GameSettings.UiNotification(GameSettings.Localize('FSC.Importer.InvalidSCConfig'), 'error');
        }
    }
}
