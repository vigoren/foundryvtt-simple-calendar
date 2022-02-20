import {Logger} from "../logging";
import {GameSettings} from "../foundry-interfacing/game-settings";
import Month from "../calendar/month";
import {Weekday} from "../calendar/weekday";
import {
    ConfigurationDateSelectors,
    GameWorldTimeIntegrations,
    Icons,
    LeapYearRules, ModuleName,
    MoonYearResetOptions,
    PredefinedCalendars,
    SettingNames,
    Themes, YearNamingRules
} from "../../constants";
import Season from "../calendar/season";
import Moon from "../calendar/moon";
import {saveAs} from "file-saver";
import PredefinedCalendar from "../configuration/predefined-calendar";
import Calendar from "../calendar";
import DateSelectorManager from "../date-selector/date-selector-manager";
import {animateElement, animateFormGroup, GetContrastColor} from "../utilities/visual";
import {CalManager, SC} from "../index";
import UserPermissions from "../configuration/user-permissions";
import {deepMerge} from "../utilities/object";
import {getCheckBoxInputValue, getNumericInputValue, getTextInputValue} from "../utilities/inputs";
import {FormatDateTime} from "../utilities/date-time";
import {generateUniqueId} from "../utilities/string";

export default class ConfigurationApp extends FormApplication {
    /**
     * ID used for the application window when rendered on the page
     * @type{string}
     */
    public static appWindowId: string = 'simple-calendar-configuration-application-form';
    /**
     * The HTML element representing the application window
     * @type {HTMLElement | null}
     * @private
     */
    private appWindow: HTMLElement | null = null;
    /**
     * A list of temporary calendars to be edited in the configuration dialog.
     * @type {Calendar[]}
     * @private
     */
    private calendars: Calendar[] = [];
    /**
     * A copy of the global configuration options to be edited in the configuration dialog.
     * @type {GlobalConfigurationData}
     * @private
     */
    private globalConfiguration: SimpleCalendar.GlobalConfigurationData = {
        id: '',
        version: '',
        calendarsSameTimestamp: false,
        permissions: new UserPermissions(),
        secondsInCombatRound: 6,
        syncCalendars: false
    };
    /**
     * A copy of the client settings to be edited in the configuration dialog.
     * @type {ClientSettings}
     * @private
     */
    private clientSettings: SimpleCalendar.ClientSettingsData = {
        id: '',
        theme: Themes.dark,
        openOnLoad: true,
        openCompact: false,
        rememberPosition: true,
        appPosition: {}
    };
    /**
     * A list of different states for the UI
     * @private
     */
    private uiElementStates = {
        dateFormatExample: '',
        dateFormatTableExpanded: false,
        monthYearFormatExample: '',
        qsNextClicked: false,
        selectedPredefinedCalendar: '',
        timeFormatExample: ''
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
        this.globalConfiguration.permissions = SC.globalConfiguration.permissions.clone();
        this.globalConfiguration.secondsInCombatRound = SC.globalConfiguration.secondsInCombatRound;
        this.globalConfiguration.calendarsSameTimestamp = SC.globalConfiguration.calendarsSameTimestamp;
        this.globalConfiguration.syncCalendars = SC.globalConfiguration.syncCalendars;
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
        options.template = "modules/foundryvtt-simple-calendar/templates/configuration.html";
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
        this.appWindow = null;
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
        const currDate = (<Calendar>this.object).getCurrentDate();
        this.uiElementStates.dateFormatExample = FormatDateTime({year: currDate.year, month: currDate.month, day: currDate.day, hour: 13, minute: 36, seconds: 42}, (<Calendar>this.object).generalSettings.dateFormat.date, <Calendar>this.object);
        this.uiElementStates.timeFormatExample = FormatDateTime({year: currDate.year, month: currDate.month, day: currDate.day, hour: 13, minute: 36, seconds: 42}, (<Calendar>this.object).generalSettings.dateFormat.time, <Calendar>this.object);
        this.uiElementStates.monthYearFormatExample = FormatDateTime({year: currDate.year, month: currDate.month, day: currDate.day, hour: 13, minute: 36, seconds: 42}, (<Calendar>this.object).generalSettings.dateFormat.monthYear, <Calendar>this.object);

        let data = {
            ...super.getData(options),
            calendars: this.calendars,
            clientSettings: {
                openOnLoad: this.clientSettings.openOnLoad,
                openInCompact: this.clientSettings.openCompact,
                rememberPos: this.clientSettings.rememberPosition,
                theme: this.clientSettings.theme,
                themes: {
                    'dark': 'FSC.Configuration.Theme.Dark',
                    'light': 'FSC.Configuration.Theme.Light',
                    'classic': 'FSC.Configuration.Theme.Classic'
                }
            },
            currentYear: (<Calendar>this.object).year,
            gameSystem: (<Calendar>this.object).gameSystem,
            generalSettings: (<Calendar>this.object).generalSettings,
            globalConfiguration: this.globalConfiguration,
            isGM: GameSettings.IsGm(),
            leapYearRule: (<Calendar>this.object).year.leapYearRule,
            leapYearRules: {none: 'FSC.Configuration.LeapYear.Rules.None', gregorian: 'FSC.Configuration.LeapYear.Rules.Gregorian', custom: 'FSC.Configuration.LeapYear.Rules.Custom'},
            months: (<Calendar>this.object).year.months.map(m => m.toTemplate()),
            monthStartingWeekdays: <{[key: string]: string}>{},
            moons: (<Calendar>this.object).year.moons.map(m => m.toTemplate((<Calendar>this.object).year)),
            moonIcons: <{[key: string]: string}>{},
            moonYearReset: {
                none: 'FSC.Configuration.Moon.YearResetNo',
                'leap-year': 'FSC.Configuration.Moon.YearResetLeap',
                'x-years': 'FSC.Configuration.Moon.YearResetX'
            },
            noteCategories: <SimpleCalendar.NoteCategory[]>[],
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
            qsCalDate: {year: 1, month: 0, day: 0, hour: 0, minute: 0, allDay: true},
            seasonColors: [
                {
                    value: '#ffffff',
                    display: GameSettings.Localize("FSC.Configuration.Season.ColorWhite")
                },
                {
                    value: '#E0C40B',
                    display: GameSettings.Localize("FSC.Configuration.Season.ColorSpring")
                },
                {
                    value: '#46B946',
                    display: GameSettings.Localize("FSC.Configuration.Season.ColorSummer")
                },
                {
                    value: '#FF8E47',
                    display: GameSettings.Localize("FSC.Configuration.Season.ColorFall")
                },
                {
                    value: '#479DFF',
                    display: GameSettings.Localize("FSC.Configuration.Season.ColorWinter")
                }
            ],
            seasons: (<Calendar>this.object).year.seasons.map(s => s.toTemplate((<Calendar>this.object).year)),
            showLeapYearCustomMod: (<Calendar>this.object).year.leapYearRule.rule === LeapYearRules.Custom,
            showLeapYearMonths: (<Calendar>this.object).year.leapYearRule.rule !== LeapYearRules.None,
            timeTrackers: {
                none: 'FSC.Configuration.General.None',
                self: 'FSC.Configuration.General.Self',
                'third-party': 'FSC.Configuration.General.ThirdParty',
                'mixed': 'FSC.Configuration.General.Mixed'
            },
            uiElementStates: this.uiElementStates,
            weekdays: (<Calendar>this.object).year.weekdays.map(w => w.toTemplate()),
            yearNameBehaviourOptions: {
                'default': 'Default',
                'repeat': 'PLAYLIST.SoundRepeat',
                'random': 'FSC.Random'
            }
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
        this.appWindow = document.getElementById(ConfigurationApp.appWindowId);
        if(this.appWindow){

            DateSelectorManager.ActivateSelector('quick-setup-predefined-calendar');

            // Click anywhere in the app
            this.appWindow.addEventListener('click', () => {
                this.toggleCalendarSelector(true);
            });
            //---------------------
            // Calendar Picker / Add new calendar
            //---------------------
            this.appWindow.querySelector('.tabs .calendar-selector .heading')?.addEventListener('click', this.toggleCalendarSelector.bind(this, false));
            this.appWindow.querySelectorAll('.tabs .calendar-selector ul li[data-calendar]').forEach(e => {
                e.addEventListener('click', this.calendarClick.bind(this));
            });
            this.appWindow.querySelectorAll('.tabs .calendar-selector ul li[data-calendar] .control').forEach(e => {
                e.addEventListener('click', this.removeCalendarClick.bind(this));
            });
            this.appWindow.querySelector('.tab-wrapper .new-calendar .save')?.addEventListener('click', this.addNewCalendar.bind(this));
            //---------------------
            // Quick Setup
            //---------------------
            //Predefined Calendar clicked
            this.appWindow.querySelectorAll('.quick-setup .predefined-list .predefined-calendar').forEach(e => {
                e.addEventListener('click', this.predefinedCalendarClick.bind(this));
            });
            //Next button clicked
            this.appWindow.querySelector('.quick-setup .control-section .qs-next')?.addEventListener('click', this.quickSetupNextClick.bind(this));
            //Back button clicked
            this.appWindow.querySelector('.quick-setup .control-section .qs-back')?.addEventListener('click', this.quickSetupBackClick.bind(this));
            //Save button clicked
            this.appWindow.querySelector('.quick-setup .control-section .qs-save')?.addEventListener('click', this.quickSetupSaveClick.bind(this));

            //---------------------
            // Month Show/Hide Advanced
            //---------------------
            this.appWindow.querySelectorAll(".month-show-advanced").forEach(e => {
                e.addEventListener('click', this.toggleMonthShowAdvanced.bind(this));
            });
            //---------------------
            // Input Changes
            //---------------------
            this.appWindow.querySelectorAll("input, select").forEach(e => {
                e.addEventListener('change', () => {
                    this.writeInputValuesToObjects();
                    this.updateUIFromObject();
                });
            });
            //---------------------
            // Date Format Table open/close
            //---------------------
            this.appWindow.querySelector('.date-format-token-show')?.addEventListener('click', this.dateFormatTableClick.bind(this));
            //---------------------
            // Add To/Remove From Table
            //---------------------
            this.appWindow.querySelectorAll(`.table-actions .save`).forEach(e => {
                e.addEventListener('click', this.addToTable.bind(this));
            });
            this.appWindow.querySelectorAll(`.control.delete`).forEach(e => {
                e.addEventListener('click', this.removeFromTable.bind(this));
            });
            //---------------------
            // Import/Export buttons
            //---------------------
            this.appWindow.querySelector("#exportCalendar")?.addEventListener('click', this.exportCalendar.bind(this));
            this.appWindow.querySelector("#scImportCalendarPicker")?.addEventListener('change', this.importCalendarFileChange.bind(this));
            //---------------------
            // Save Button
            //---------------------
            this.appWindow.querySelector("#scSave")?.addEventListener('click', this.saveClick.bind(this, true));
        }
    }

    private toggleCalendarSelector(forceHide: boolean = false){
        if(this.appWindow){
            const cList = this.appWindow.querySelector(".tabs .calendar-selector ul");
            if(cList){
                animateElement(cList, 500, forceHide);
            }
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
                    this._tabs[0].active = "generalSettings";
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
        if(element && this.appWindow){
            const allReadySelected = element.classList.contains('selected');
            this.appWindow.querySelectorAll(`.quick-setup .predefined-list .predefined-calendar`).forEach(e => {
                e.classList.remove('selected');
            });
            const nextBttn = this.appWindow.querySelector('.quick-setup .control-section .qs-next');
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
        this.uiElementStates.qsNextClicked = !this.uiElementStates.qsNextClicked;
        PredefinedCalendar.setToPredefined((<Calendar>this.object).year, <PredefinedCalendars>this.uiElementStates.selectedPredefinedCalendar);
        this.updateApp();
    }

    private quickSetupBackClick(e: Event){
        e.preventDefault();
        this.uiElementStates.qsNextClicked = !this.uiElementStates.qsNextClicked;
        if(this.appWindow){
            const step1 = this.appWindow.querySelector('.quick-setup .predefined');
            const step2 = this.appWindow.querySelector('.quick-setup .settings');
            if(step1 && step2){
                animateElement(step1, 500);
                animateElement(step2, 500);
            }
        }
    }

    private quickSetupSaveClick(e: Event){
        e.preventDefault();
        this.uiElementStates.selectedPredefinedCalendar = ''
        this.uiElementStates.qsNextClicked = false;
        const ds = DateSelectorManager.GetSelector('quick-setup-predefined-calendar', {});
        let monthIndex, dayIndex = 0;
        monthIndex = (<Calendar>this.object).year.months.findIndex(m => m.numericRepresentation === ds.selectedDate.start.month);
        if(monthIndex > -1) {
            dayIndex = (<Calendar>this.object).year.months[monthIndex].days.findIndex(d => d.numericRepresentation === ds.selectedDate.start.day);
        }
        if(monthIndex > -1 && dayIndex > -1){
            (<Calendar>this.object).year.numericRepresentation = ds.selectedDate.start.year;
            (<Calendar>this.object).year.visibleYear = ds.selectedDate.start.year;
            (<Calendar>this.object).year.selectedYear = ds.selectedDate.start.year;
            (<Calendar>this.object).year.updateMonth(monthIndex, 'current', true, dayIndex);
        }
        this._tabs[0].active = "generalSettings";
        this.save(false, false).catch(Logger.error);
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
        if(this.appWindow){
            //----------------------------------
            // Global Config: Settings
            //----------------------------------
            this.globalConfiguration.secondsInCombatRound = <number>getNumericInputValue('#scSecondsInCombatRound', 6, false, this.appWindow);
            this.globalConfiguration.calendarsSameTimestamp = getCheckBoxInputValue('#scCalendarsSameTimestamp', false, this.appWindow);
            this.globalConfiguration.syncCalendars = getCheckBoxInputValue('#scSyncCalendars', false, this.appWindow);

            //----------------------------------
            // Global Config: Client Settings
            //----------------------------------
            this.clientSettings.theme = <Themes>getTextInputValue('#scTheme', <string>Themes.dark, this.appWindow);
            this.clientSettings.openOnLoad = getCheckBoxInputValue('#scOpenOnLoad', true, this.appWindow);
            this.clientSettings.openCompact = getCheckBoxInputValue('#scOpenInCompact', false, this.appWindow);
            this.clientSettings.rememberPosition = getCheckBoxInputValue('#scRememberPos', true, this.appWindow);

            //----------------------------------
            // Global Config: Permissions
            //----------------------------------
            this.globalConfiguration.permissions.viewCalendar.player = getCheckBoxInputValue('#scCalendarVisibleP', true, this.appWindow);
            this.globalConfiguration.permissions.viewCalendar.trustedPlayer = getCheckBoxInputValue('#scCalendarVisibleTP', true, this.appWindow);
            this.globalConfiguration.permissions.viewCalendar.assistantGameMaster = getCheckBoxInputValue('#scCalendarVisibleAGM', true, this.appWindow);
            this.globalConfiguration.permissions.addNotes.player = getCheckBoxInputValue('#scAddNotesP', false, this.appWindow);
            this.globalConfiguration.permissions.addNotes.trustedPlayer = getCheckBoxInputValue('#scAddNotesTP', false, this.appWindow);
            this.globalConfiguration.permissions.addNotes.assistantGameMaster = getCheckBoxInputValue('#scAddNotesAGM', false, this.appWindow);
            this.globalConfiguration.permissions.changeDateTime.player = getCheckBoxInputValue('#scChangeDateTimeP', false, this.appWindow);
            this.globalConfiguration.permissions.changeDateTime.trustedPlayer = getCheckBoxInputValue('#scChangeDateTimeTP', false, this.appWindow);
            this.globalConfiguration.permissions.changeDateTime.assistantGameMaster = getCheckBoxInputValue('#scChangeDateTimeAGM', false, this.appWindow);
            this.globalConfiguration.permissions.reorderNotes.player = getCheckBoxInputValue('#scReorderNotesP', false, this.appWindow);
            this.globalConfiguration.permissions.reorderNotes.trustedPlayer = getCheckBoxInputValue('#scReorderNotesTP', false, this.appWindow);
            this.globalConfiguration.permissions.reorderNotes.assistantGameMaster = getCheckBoxInputValue('#scReorderNotesAGM', false, this.appWindow);
            this.globalConfiguration.permissions.changeActiveCalendar.player = getCheckBoxInputValue('#scChangeActiveCalP', false, this.appWindow);
            this.globalConfiguration.permissions.changeActiveCalendar.trustedPlayer = getCheckBoxInputValue('#scChangeActiveCalTP', false, this.appWindow);
            this.globalConfiguration.permissions.changeActiveCalendar.assistantGameMaster = getCheckBoxInputValue('#scChangeActiveCalAGM', false, this.appWindow);

            //----------------------------------
            // Calendar: General Settings
            //----------------------------------
            (<Calendar>this.object).name = getTextInputValue('#scCalendarName', 'New Calendar', this.appWindow);
            (<Calendar>this.object).generalSettings.gameWorldTimeIntegration = <GameWorldTimeIntegrations>getTextInputValue('#scGameWorldTime', <string>GameWorldTimeIntegrations.Mixed, this.appWindow);
            (<Calendar>this.object).generalSettings.pf2eSync = getCheckBoxInputValue('#scPF2ESync', true, this.appWindow);

            //----------------------------------
            // Calendar: Display Options
            //----------------------------------
            (<Calendar>this.object).generalSettings.dateFormat.date = getTextInputValue('#scDateFormatsDate', 'MMMM DD, YYYY', this.appWindow);
            (<Calendar>this.object).generalSettings.dateFormat.time = getTextInputValue('#scDateFormatsTime', 'HH:mm:ss', this.appWindow);
            (<Calendar>this.object).generalSettings.dateFormat.monthYear = getTextInputValue('#scDateFormatsMonthYear', 'MMMM YAYYYYYZ', this.appWindow);

            //----------------------------------
            // Calendar: Year Settings
            //----------------------------------
            (<Calendar>this.object).year.numericRepresentation = <number>getNumericInputValue('#scCurrentYear', 0, false, this.appWindow);
            (<Calendar>this.object).year.prefix = getTextInputValue("#scYearPreFix", "", this.appWindow);
            (<Calendar>this.object).year.postfix = getTextInputValue("#scYearPostFix", "", this.appWindow);
            (<Calendar>this.object).year.yearZero = <number>getNumericInputValue('#scYearZero', 0, false, this.appWindow);

            (<Calendar>this.object).year.yearNamingRule = <YearNamingRules>getTextInputValue("#scYearNameBehaviour", <string>YearNamingRules.Default, this.appWindow);
            (<Calendar>this.object).year.yearNamesStart = <number>getNumericInputValue('#scYearNamesStart', 0, false, this.appWindow);
            this.appWindow.querySelectorAll('.year-settings .year-names>.row:not(.head)').forEach(e => {
                const index = parseInt((<HTMLElement>e).getAttribute('data-index') || '');
                if(!isNaN(index) && index >= 0 && index < (<Calendar>this.object).year.yearNames.length){
                    (<Calendar>this.object).year.yearNames[index] = getTextInputValue(".year-name", "New Named Year", e);
                }
            });

            //----------------------------------
            // Calendar: Month Settings
            //----------------------------------
            this.appWindow.querySelectorAll('.month-settings .months>.row:not(.head)').forEach(e => {
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
            (<Calendar>this.object).year.showWeekdayHeadings = getCheckBoxInputValue('#scShowWeekdayHeaders', true, this.appWindow);
            (<Calendar>this.object).year.firstWeekday = <number>getNumericInputValue('#scWeekdayFirstDay', 0, false, this.appWindow);
            this.appWindow.querySelectorAll('.weekday-settings .weekdays>.row:not(.head)').forEach(e => {
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
            (<Calendar>this.object).year.leapYearRule.rule = <LeapYearRules>getTextInputValue('#scLeapYearRule', 'none', this.appWindow);
            (<Calendar>this.object).year.leapYearRule.customMod = <number>getNumericInputValue('#scLeapYearCustomMod', 0, false, this.appWindow);
            this.appWindow.querySelectorAll('.leapyear-settings .months>.row:not(.head)').forEach(e => {
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
            this.appWindow.querySelectorAll('.season-settings .seasons>.row:not(.head)').forEach(e => {
                const index = parseInt((<HTMLElement>e).getAttribute('data-index') || '');
                if(!isNaN(index) && index >= 0 && index < (<Calendar>this.object).year.seasons.length){
                    (<Calendar>this.object).year.seasons[index].name = getTextInputValue(".season-name", "New Season", e);
                    (<Calendar>this.object).year.seasons[index].color = getTextInputValue(".season-color", "#FFFFFF", e);
                }
            });

            //----------------------------------
            // Calendar: Moon Settings
            //----------------------------------
            this.appWindow.querySelectorAll('.moon-settings .moons>.row:not(.head)').forEach(e => {
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
            (<Calendar>this.object).year.time.hoursInDay = <number>getNumericInputValue('#scHoursInDay', 24, false, this.appWindow);
            (<Calendar>this.object).year.time.minutesInHour = <number>getNumericInputValue('#scMinutesInHour', 60, false, this.appWindow);
            (<Calendar>this.object).year.time.secondsInMinute = <number>getNumericInputValue('#scSecondsInMinute', 60, false, this.appWindow);
            (<Calendar>this.object).generalSettings.showClock = getCheckBoxInputValue('#scShowClock', true, this.appWindow);
            (<Calendar>this.object).year.time.gameTimeRatio = <number>getNumericInputValue('#scGameTimeRatio', 1, false, this.appWindow);
            (<Calendar>this.object).year.time.updateFrequency = <number>getNumericInputValue('#scTimeUpdateFrequency', 1, false, this.appWindow);
            (<Calendar>this.object).year.time.unifyGameAndClockPause = getCheckBoxInputValue('#scUnifyClockWithFoundryPause', false, this.appWindow);

            //----------------------------------
            // Calendar: Note Settings
            //----------------------------------
            (<Calendar>this.object).generalSettings.noteDefaultVisibility = getCheckBoxInputValue('#scDefaultPlayerVisibility', true, this.appWindow);
            (<Calendar>this.object).generalSettings.postNoteRemindersOnFoundryLoad = getCheckBoxInputValue('#scPostNoteRemindersOnFoundryLoad', true, this.appWindow);
            this.appWindow.querySelectorAll('.note-settings .note-categories .row:not(.head)').forEach(e => {
                const index = parseInt((<HTMLElement>e).getAttribute('data-index') || '');
                if(!isNaN(index) && index >= 0 && index < (<Calendar>this.object).noteCategories.length){
                    (<Calendar>this.object).noteCategories[index].name = getTextInputValue(".note-category-name", "New Category", e);
                    (<Calendar>this.object).noteCategories[index].color = getTextInputValue(".note-category-color", "New Category", e);
                    (<Calendar>this.object).noteCategories[index].textColor = GetContrastColor((<Calendar>this.object).noteCategories[index].color);
                }
            });
        }
    }

    private updateUIFromObject(){
        if(this.appWindow){
            //----------------------------------
            // Calendar Config: Display Options
            //----------------------------------
            const currDate = (<Calendar>this.object).getCurrentDate();
            this.uiElementStates.dateFormatExample = FormatDateTime({year: currDate.year, month: currDate.month, day: currDate.day, hour: 13, minute: 36, seconds: 42}, (<Calendar>this.object).generalSettings.dateFormat.date, <Calendar>this.object);
            this.uiElementStates.timeFormatExample = FormatDateTime({year: currDate.year, month: currDate.month, day: currDate.day, hour: 13, minute: 36, seconds: 42}, (<Calendar>this.object).generalSettings.dateFormat.time, <Calendar>this.object);
            this.uiElementStates.monthYearFormatExample = FormatDateTime({year: currDate.year, month: currDate.month, day: currDate.day, hour: 13, minute: 36, seconds: 42}, (<Calendar>this.object).generalSettings.dateFormat.monthYear, <Calendar>this.object);

            let df = this.appWindow.querySelector(`#scDateFormatsDate`)?.closest('.form-group')?.querySelector('.example');
            if(df){
                (<HTMLElement>df).innerHTML = `<strong>${GameSettings.Localize('FSC.Example')}</strong>: ${this.uiElementStates.dateFormatExample}`;
            }
            df = this.appWindow.querySelector(`#scDateFormatsTime`)?.closest('.form-group')?.querySelector('.example');
            if(df){
                (<HTMLElement>df).innerHTML = `<strong>${GameSettings.Localize('FSC.Example')}</strong>: ${this.uiElementStates.timeFormatExample}`;
            }
            df = this.appWindow.querySelector(`#scDateFormatsMonthYear`)?.closest('.form-group')?.querySelector('.example');
            if(df){
                (<HTMLElement>df).innerHTML = `<strong>${GameSettings.Localize('FSC.Example')}</strong>: ${this.uiElementStates.monthYearFormatExample}`;
            }
            //----------------------------------
            // Calendar Config: Year
            //----------------------------------
            animateFormGroup('#scYearNamesStart', (<Calendar>this.object).year.yearNamingRule !== YearNamingRules.Random);

            //----------------------------------
            // Calendar Config: Month
            //----------------------------------
            for(let i = 0; i < (<Calendar>this.object).year.months.length; i++){
                const row = this.appWindow.querySelector(`.month-settings .months>.row[data-index="${i}"]`);
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
            let fg = this.appWindow.querySelector('#scLeapYearMonthList');
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
                const row = this.appWindow.querySelector(`.moon-settings .moons>.row[data-index="${i}"]`);
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
    }

    /**
     * When the date format table header is clicked, will expand/collapse the table of information
     */
    private dateFormatTableClick(){
        this.uiElementStates.dateFormatTableExpanded = !this.uiElementStates.dateFormatTableExpanded;
        if(this.appWindow){
            const collapseArea = this.appWindow.querySelector(`.display-options .tokens .collapse-data`);
            if(collapseArea){
                (<HTMLElement>collapseArea).style.display = this.uiElementStates.dateFormatTableExpanded? 'block' : 'none';
            }
            const a = this.appWindow.querySelector(`.display-options .tokens .date-format-token-show .fa`);
            if(a){
                (<HTMLElement>a).className = `fa ${this.uiElementStates.dateFormatTableExpanded? 'fa-chevron-up' : 'fa-chevron-down'}`;
            }
        }
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
     * @param {Event} e The click event
     */
    public addToTable(e: Event){
        e.preventDefault();
        const target = <HTMLElement>e.currentTarget;
        if(target){
            const filteredSetting = target.getAttribute('data-type');
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
                    (<Calendar>this.object).noteCategories.push({id:generateUniqueId(), name: "New Category", color:"#b13737 ", textColor:"#ffffff"});
                    break;
            }
            this.updateApp();
        }
    }

    /**
     * Removes one or more row from the specified table.
     * @param {Event} e The click event
     */
    public removeFromTable(e: Event){
        e.preventDefault();
        const target = <HTMLElement>e.currentTarget;
        if(target){
            const filteredSetting = target.getAttribute('data-type');
            const row = target.closest('.row');
            const dataIndex = target.getAttribute('data-index');
            if(row && !dataIndex){
                const rowDataIndex = (<HTMLElement>row).getAttribute('data-index');
                if(rowDataIndex){
                    const index = parseInt(rowDataIndex);
                    if(!isNaN(index)){
                        switch (filteredSetting){
                            case "month":
                                if(index < (<Calendar>this.object).year.months.length){
                                    (<Calendar>this.object).year.months.splice(index, 1);
                                    if((<Calendar>this.object).year.months.length === 0){
                                        (<Calendar>this.object).year.months.push(new Month('New Month', 1, 0, 30));
                                    }
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
                                const dataMoonIndex = target.getAttribute('data-moon-index');
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
                }
            }
            else if(dataIndex && dataIndex === 'all'){
                switch (filteredSetting){
                    case "month":
                        (<Calendar>this.object).year.months = [new Month('New Month', 1, 0, 30)];
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
    }

    /**
     * Function called when ever a date selector in the configuration dialog is changed.
     * @param {string} seasonId The ID of the item changed
     * @param {ConfigurationDateSelectors} dateSelectorType The type of date selector that was changed
     * @param {SCDateSelector.SelectedDate} selectedDate The returned data from the date selector
     */
    public dateSelectorChange(seasonId: string, dateSelectorType: ConfigurationDateSelectors, selectedDate: SimpleCalendar.DateTimeSelector.SelectedDates){
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
        await this.save(close);
    }

    /**
     * Saves the current settings
     * @param {boolean} close If to close the application window after saving
     * @param {boolean} updateFromForm If to update the data model from the form content
     */
    public async save(close: boolean, updateFromForm: boolean = true){
        if(updateFromForm){
            this.writeInputValuesToObjects();
        }
        CalManager.mergeClonedCalendars();
        SC.save(this.globalConfiguration, this.clientSettings);
        await CalManager.getActiveCalendar().syncTime(true);
        if(close){
            this.closeApp();
        } else {
            this.calendars = CalManager.cloneCalendars();
            this.object = this.calendars[0];
            this.updateApp();
        }
    }

    /**
     * Exports the current calendar configuration to a JSON file. Users should be prompted with a save as dialog.
     * @param event
     */
    public exportCalendar(event: Event){
        event.preventDefault();

        const options:Record<string, boolean> = {};
        this.appWindow?.querySelectorAll(`.import-export .calendar-list input`).forEach(e => {
            const id = e.getAttribute('data-id');
            if(id){
                options[id] = (<HTMLInputElement>e).checked;
            }
        });
        console.log(options);
        const data = {
            exportVersion: 2,
            globalConfig: options['global']? {
                secondsInCombatRound: this.globalConfiguration.secondsInCombatRound,
                calendarsSameTimestamp: this.globalConfiguration.calendarsSameTimestamp,
                syncCalendars: this.globalConfiguration.syncCalendars
            } : {},
            permissions: options['permissions']? this.globalConfiguration.permissions.toConfig() : {},
            calendars: <SimpleCalendar.CalendarData[]>[],
            notes: <Record<string, any[]>>{}
        };

        for(let i = 0; i < this.calendars.length; i++){
            const config = this.calendars[i].toConfig();
            const realId = config.id.replace('_temp', '');

            if(options[`${config.id}-notes`]){
                data.notes[realId] = [];
                (<Game>game).journal?.forEach(j => {
                    const scFlag = <SimpleCalendar.NoteData>j.getFlag(ModuleName, 'noteData');
                    if(scFlag && scFlag.calendarId && scFlag.calendarId === realId){
                        data.notes[realId].push(j.toObject());
                    }
                });
            }

            if(options[config.id]){
                config.id = realId;
                data.calendars.push(config);
            }
        }
        saveAs(new Blob([JSON.stringify(data)], {type: 'application/json'}), 'simple-calendar-export.json');
    }

    /**
     * Called when a file is selected in the input file picker
     * @param event
     */
    public importCalendarFileChange(event: Event){
        const target = <HTMLInputElement>event.target;
        if(target && target.files && target.files.length){
            if(target.files[0].type === 'application/json'){
                this.appWindow?.querySelector(`.import-export .progress`)?.classList.remove('hide');
                const reader = new FileReader();
                reader.onprogress = this.importCalendarProgress.bind(this);
                reader.onload = this.importCalendarRead.bind(this);
                reader.readAsText(target.files[0]);
            }
        }
    }

    /**
     * Resize the progress bar to show how much of the file has been loaded in. 99% of cases this will never actually show lol
     * @param e
     */
    public importCalendarProgress(e: Event){
        const bar = this.appWindow?.querySelector(`.import-export .progress .progress-bar`);
        if(bar){
            (<HTMLElement>bar).style.width = `${((<ProgressEvent>e).loaded / (<ProgressEvent>e).total) * 100}%`;
        }
    }

    /**
     * Called when a file has finished being read.
     * @param e
     */
    public importCalendarRead(e: Event){
        this.importCalendarProgress(e);
        this.appWindow?.querySelector(`.import-export .progress`)?.classList.add('hide');
        const reader = <FileReader>e.target;
        if(reader && reader.result && this.appWindow){
            const fDetail = this.appWindow.querySelector('.import-export .importing .file-details');
            if(fDetail){
                let html = `<p>${GameSettings.Localize('FSC.Configuration.ImportExport.ImportDetailsText')}</p><ul class="calendar-list">`;
                const res = JSON.parse(reader.result.toString());
                if(!res.hasOwnProperty('exportVersion')){
                    //v1 support - Convert v1 format into v2 format
                    res.calendars = [{id: 'default', name: 'Default'}];
                    res.globalConfig = {};
                    if(res.hasOwnProperty('generalSettings')){
                        if(res.generalSettings.hasOwnProperty('permissions')){
                            res.permissions = res.permissions || {};
                            res.permissions.viewCalendar = res.generalSettings.permissions.viewCalendar;
                            res.permissions.addNotes = res.generalSettings.permissions.addNotes;
                            res.permissions.reorderNotes = res.generalSettings.permissions.reorderNotes;
                            res.permissions.changeDateTime = res.generalSettings.permissions.changeDateTime;
                            delete res.generalSettings.permissions;
                        }
                        res.calendars[0].general = res.generalSettings;
                        delete res.generalSettings;
                    }
                    if(res.hasOwnProperty('currentDate')){
                        res.currentDate.day--;
                        res.currentDate.month--;
                        res.calendars[0].currentDate = res.currentDate;
                        delete res.currentDate;
                    }
                    if(res.hasOwnProperty('leapYearSettings')){
                        res.calendars[0].leapYear = res.leapYearSettings;
                        delete res.leapYearSettings;
                    }
                    if(res.hasOwnProperty('monthSettings')){
                        res.calendars[0].months = res.monthSettings;
                        delete res.monthSettings;
                    }
                    if(res.hasOwnProperty('moonSettings')){
                        for(let i = 0; i < res.moonSettings.length; i++){
                            res.moonSettings[i].firstNewMoon.month--;
                            res.moonSettings[i].firstNewMoon.day--;
                        }
                        res.calendars[0].moons = res.moonSettings;
                        delete res.moonSettings;
                    }
                    if(res.hasOwnProperty('noteCategories')){
                        res.calendars[0].noteCategories = res.noteCategories;
                        delete res.noteCategories;
                    }
                    if(res.hasOwnProperty('seasonSettings')){
                        for(let i = 0; i < res.seasonSettings.length; i++){
                            res.seasonSettings[i].startingMonth--;
                            res.seasonSettings[i].startingDay--;
                        }
                        res.calendars[0].seasons = res.seasonSettings;
                        delete res.seasonSettings;
                    }
                    if(res.hasOwnProperty('timeSettings')){
                        res.globalConfig.secondsInCombatRound = res.timeSettings.secondsInCombatRound;
                        delete res.timeSettings.secondsInCombatRound;
                        res.calendars[0].time = res.timeSettings;
                        delete res.timeSettings;
                    }
                    if(res.hasOwnProperty('weekdaySettings')){
                        res.calendars[0].weekdays = res.weekdaySettings;
                        delete res.weekdaySettings;
                    }
                    if(res.hasOwnProperty('yearSettings')){
                        res.calendars[0].year = res.yearSettings;
                        delete res.yearSettings;
                    }
                }
                if(res.hasOwnProperty('globalConfig') && !isObjectEmpty(res.globalConfig)){
                    html += `<li><label><input type="checkbox" data-id="global" checked /><span class="fa fa-cog"></span>&nbsp;${GameSettings.Localize('FSC.Configuration.Global.Title')}</label></li>`;
                }
                if(res.hasOwnProperty('permissions') && !isObjectEmpty(res.permissions)){
                    html += `<li><label><input type="checkbox" data-id="permissions" checked /><span class="fa fa-key"></span>&nbsp;${GameSettings.Localize('Permissions')}</label></li>`;
                }
                if(res.hasOwnProperty('calendars') && res.calendars.length){
                    for(let i = 0; i < res.calendars.length; i++){
                        html += `<li><label><input type="checkbox" data-id="${res.calendars[i].id}" checked /><strong><span class="fa fa-calendar"></span> ${res.calendars[i].name}</strong>: ${GameSettings.Localize('FSC.CalendarConfiguration')}</label><label>${GameSettings.Localize('FSC.ImportInto')}:&nbsp;<select data-for-cal="${res.calendars[i].id}">`;
                        const selectedIndex = this.calendars.findIndex(c => c.id.indexOf(res.calendars[i].id) === 0);
                        html += `<option value="new" ${selectedIndex === -1? 'selected' : ''}>${GameSettings.Localize('FSC.NewCalendar')}</option>`;
                        for(let i = 0; i < this.calendars.length; i++){
                            html += `<option value="${this.calendars[i].id}" ${selectedIndex === i? 'selected' : ''}>${this.calendars[i].name}</option>`;
                        }
                        html += `</select></label></li>`;
                        if(res.hasOwnProperty('notes') && res.notes.hasOwnProperty(res.calendars[i].id)){
                            html += `<li><label><input type="checkbox" data-id="${res.calendars[i].id}-notes" checked /><strong><span class="fa fa-sticky-note"></span> ${res.calendars[i].name}</strong>: ${GameSettings.Localize('FSC.CalendarNotes')}</label></label></li>`;
                        }
                    }
                }
                html += `</ul><button class="control save" id="importCalendar"><i class="fa fa-file-import"></i> ${GameSettings.Localize('FSC.Import')}</button>`;
                fDetail.innerHTML = html;
                fDetail.querySelector('#importCalendar')?.addEventListener('click', this.importCalendarSave.bind(this, res));
            }
        }
    }

    /**
     * Saves the data from the file into the selected calendars
     * @param data
     * @param event
     */
    public async importCalendarSave(data:any, event: Event){
        event.preventDefault();
        if(this.appWindow){
            if(data.hasOwnProperty('globalConfig') && !isObjectEmpty(data.globalConfig) && getCheckBoxInputValue('.import-export .importing .file-details input[data-id="global"]', true, this.appWindow)){
                this.globalConfiguration.secondsInCombatRound = data.globalConfig.secondsInCombatRound;
                this.globalConfiguration.calendarsSameTimestamp = data.globalConfig.calendarsSameTimestamp;
                this.globalConfiguration.syncCalendars = data.globalConfig.syncCalendars;
            }
            if(data.hasOwnProperty('permissions') && !isObjectEmpty(data.permissions) && getCheckBoxInputValue('.import-export .importing .file-details input[data-id="permissions"]', true, this.appWindow)){
                this.globalConfiguration.permissions.loadFromSettings(data.permissions);
            }
            if(data.hasOwnProperty('calendars') && data.calendars.length){
                for(let i = 0; i < data.calendars.length; i++){
                    const calId = data.calendars[i].id;
                    let newCalId = '';
                    if(getCheckBoxInputValue(`.import-export .importing .file-details input[data-id="${data.calendars[i].id}"]`, true, this.appWindow)){
                        const importInto = getTextInputValue(`.import-export .importing .file-details select[data-for-cal="${data.calendars[i].id}"]`, 'new', this.appWindow);
                        const importCalendar = this.calendars.find(c => c.id === importInto);
                        delete data.calendars[i].id;
                        if(importCalendar){
                            importCalendar.loadFromSettings(data.calendars[i]);
                        } else {
                            const newCalendar = CalManager.addTempCalendar(data.calendars[i].name);
                            newCalendar.loadFromSettings(data.calendars[i]);
                            newCalId = newCalendar.id;
                        }
                    }
                    if(data.hasOwnProperty('notes') && data.notes.hasOwnProperty(calId) && getCheckBoxInputValue(`.import-export .importing .file-details input[data-id="${calId}-notes"]`, true, this.appWindow)){
                        const importInto = getTextInputValue(`.import-export .importing .file-details select[data-for-cal="${calId}"]`, 'new', this.appWindow);
                        const importCalendar = this.calendars.find(c => c.id === importInto);

                        for(let n = 0; n < data.notes[calId].length; n++){
                            const journalEntryData = data.notes[calId][n];
                            let inNewCalendar = false;
                            if(journalEntryData.hasOwnProperty('flags') && journalEntryData.flags.hasOwnProperty(ModuleName) ** journalEntryData.flags[ModuleName].hasOwnProperty('noteData')){
                                inNewCalendar = importCalendar !== undefined || newCalId !== '';
                                journalEntryData.flags[ModuleName].noteData.calendarId = importCalendar? importCalendar.id : newCalId? newCalId : journalEntryData.flags[ModuleName].noteData.calendarId;
                            }
                            if(!inNewCalendar && (<Game>game).journal?.has(journalEntryData._id)){
                                (<Game>game).journal?.get(journalEntryData._id)?.update(journalEntryData);
                            } else {
                                await JournalEntry.create(journalEntryData, {keepId: !inNewCalendar});
                            }
                        }
                    }
                }
            }
            this._tabs[0].active = "generalSettings";
            this.save(false, false).catch(Logger.error);
        }
    }
}
