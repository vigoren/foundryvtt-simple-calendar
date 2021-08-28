import {Logger} from "./logging";
import Year from "./year";
import {GameSettings} from "./game-settings";
import Month from "./month";
import {Weekday} from "./weekday";
import {
    GameWorldTimeIntegrations,
    LeapYearRules,
    ModuleName,
    MoonIcons,
    MoonYearResetOptions, PredefinedCalendars, SettingNames,
    YearNamingRules
} from "../constants";
import Importer from "./importer";
import Season from "./season";
import Moon from "./moon";
import SimpleCalendar from "./simple-calendar";
import {saveAs} from "file-saver";
import {NoteCategory} from "../interfaces";
import Utilities from "./utilities";
import PredefinedCalendar from "./predefined-calendar";

export class SimpleCalendarConfiguration extends FormApplication {

    /**
     * Used to store a globally accessible copy of the Simple calendar configuration class for access from event functions.
     * @type {SimpleCalendarConfiguration}
     */
    static instance: SimpleCalendarConfiguration;
    /**
     * The year object where the changes are applied and loaded from
     * @type {Year}
     * @private
     */
    private year: Year;

    private noteCategories: NoteCategory[] = [];

    /**
     * If the year has changed
     * @private
     */
    private yearChanged: boolean = false;

    private generalSettings = {
        defaultPlayerNoteVisibility: true
    }

    /**
     * The Calendar configuration constructor
     * @param {Year} data The year data used to populate the configuration dialog
     */
    constructor(data: Year) {
        super(!data && SimpleCalendar.instance.currentYear? SimpleCalendar.instance.currentYear.clone() : data);
        if(!data && SimpleCalendar.instance.currentYear){
            this.year = SimpleCalendar.instance.currentYear;
        } else {
            this.year = data;
        }
        this._tabs[0].active = "generalSettings";

        this.generalSettings.defaultPlayerNoteVisibility = GameSettings.GetDefaultNoteVisibility();

        this.noteCategories = SimpleCalendar.instance.noteCategories.map(nc => {
            return {
                name: nc.name,
                color: nc.color,
                textColor: nc.textColor
            }
        });
    }

    /**
     * Returns the default options for this application
     */
    static get defaultOptions() {
        const options = super.defaultOptions;
        options.template = "modules/foundryvtt-simple-calendar/templates/calendar-config.html";
        options.title = "FSC.Configuration.Title";
        options.classes = ["simple-calendar-configuration"];
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
        this.render(true);
    }

    /**
     * Closes the application window
     */
    public closeApp(){
        this.close().catch(Logger.error);
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
            defaultPlayerNoteVisibility: this.generalSettings.defaultPlayerNoteVisibility,
            currentYear: (<Year>this.object),
            months: (<Year>this.object).months.map(m => m.toTemplate()),
            weekdays: (<Year>this.object).weekdays.map(w => w.toTemplate()),
            leapYearRules: {none: 'FSC.Configuration.LeapYear.Rules.None', gregorian: 'FSC.Configuration.LeapYear.Rules.Gregorian', custom: 'FSC.Configuration.LeapYear.Rules.Custom'},
            leapYearRule: (<Year>this.object).leapYearRule,
            showLeapYearCustomMod: (<Year>this.object).leapYearRule.rule === LeapYearRules.Custom,
            showLeapYearMonths: (<Year>this.object).leapYearRule.rule !== LeapYearRules.None,
            predefined: {
                gregorian: 'FSC.Configuration.LeapYear.Rules.Gregorian',
                darksun: 'Dark Sun',
                eberron: 'Eberron',
                exandrian: 'Exandrian',
                'forbidden-lands': 'Forbidden Lands',
                harptos: 'Forgotten Realms: Harptos',
                golarianpf1e : 'Golarian: Pathfinder 1E',
                golarianpf2e : 'Golarian: Pathfinder 2E',
                greyhawk: 'Greyhawk',
                'traveller-ic': 'Traveller: Imperial Calendar',
                warhammer: "Warhammer: Imperial Calendar"
            },
            timeTrackers: {
                none: 'FSC.Configuration.General.None',
                self: 'FSC.Configuration.General.Self',
                'third-party': 'FSC.Configuration.General.ThirdParty',
                'mixed': 'FSC.Configuration.General.Mixed'
            },
            importing: {
                showAboutTime: false,
                aboutTimeV1: Importer.aboutTimeV1(),
                showCalendarWeather:false
            },
            monthStartingWeekdays: <{[key: string]: string}>{},
            seasons: (<Year>this.object).seasons.map(s => s.toTemplate(<Year>this.object)),
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
            moons: (<Year>this.object).moons.map(m => m.toTemplate(<Year>this.object)),
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

        const calendarWeather = (<Game>game).modules.get('calendar-weather');
        const aboutTime = (<Game>game).modules.get('about-time');

        data.importing.showCalendarWeather = calendarWeather !== undefined && calendarWeather.active;
        data.importing.showAboutTime = aboutTime !== undefined && aboutTime.active;


        data.moonIcons[MoonIcons.NewMoon] = GameSettings.Localize('FSC.Moon.Phase.New');
        data.moonIcons[MoonIcons.WaxingCrescent] = GameSettings.Localize('FSC.Moon.Phase.WaxingCrescent');
        data.moonIcons[MoonIcons.FirstQuarter] = GameSettings.Localize('FSC.Moon.Phase.FirstQuarter');
        data.moonIcons[MoonIcons.WaxingGibbous] = GameSettings.Localize('FSC.Moon.Phase.WaxingGibbous');
        data.moonIcons[MoonIcons.Full] = GameSettings.Localize('FSC.Moon.Phase.Full');
        data.moonIcons[MoonIcons.WaningGibbous] = GameSettings.Localize('FSC.Moon.Phase.WaningGibbous');
        data.moonIcons[MoonIcons.LastQuarter] = GameSettings.Localize('FSC.Moon.Phase.LastQuarter');
        data.moonIcons[MoonIcons.WaningCrescent] = GameSettings.Localize('FSC.Moon.Phase.WaningCrescent');

        data.monthStartingWeekdays['null'] = GameSettings.Localize('Default');
        for(let i = 0; i < (<Year>this.object).weekdays.length; i++){
            data.monthStartingWeekdays[(<Year>this.object).weekdays[i].numericRepresentation.toString()] = (<Year>this.object).weekdays[i].name;
        }
        const users = (<Game>game).users;
        if(users){
            users.forEach(u => {
                if(!u.isGM && u.id !== null){
                    data.users[u.id] = u.name? u.name : '';
                }
            });
        }

        if(SimpleCalendar.instance){
            data.noteCategories = this.noteCategories;
        }

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
        (<Year>this.object).seasons.forEach(s => s.activateDateSelectors());
        if(html.hasOwnProperty("length")) {
            //Month advanced click
            (<JQuery>html).find(".month-show-advanced").on('click', this.inputChange.bind(this));

            //Save button clicks
            (<JQuery>html).find("#scSubmit").on('click', this.saveClick.bind(this));

            //Predefined calendar apply
            (<JQuery>html).find("#scApplyPredefined").on('click', this.overwriteConfirmationDialog.bind(this, 'predefined', ''));

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

            //Import Buttons
            (<JQuery>html).find("#scAboutTimeImport").on('click', this.overwriteConfirmationDialog.bind(this, 'tp-import', 'about-time'));
            (<JQuery>html).find("#scAboutTimeExport").on('click', this.overwriteConfirmationDialog.bind(this, 'tp-export','about-time'));
            (<JQuery>html).find("#scCalendarWeatherImport").on('click', this.overwriteConfirmationDialog.bind(this, 'tp-import', 'calendar-weather'));
            (<JQuery>html).find("#scCalendarWeatherExport").on('click', this.overwriteConfirmationDialog.bind(this, 'tp-export','calendar-weather'));

            (<JQuery>html).find("#exportCalendar").on('click', this.exportCalendar.bind(this));
            (<JQuery>html).find("#importCalendar").on('click', this.importCalendar.bind(this));

            //Input Change
            (<JQuery>html).find(".general-settings input").on('change', this.inputChange.bind(this));
            (<JQuery>html).find(".note-settings input").on('change', this.inputChange.bind(this));
            (<JQuery>html).find(".year-settings input").on('change', this.inputChange.bind(this));
            (<JQuery>html).find(".year-settings select").on('change', this.inputChange.bind(this));
            (<JQuery>html).find(".month-settings input").on('change', this.inputChange.bind(this));
            (<JQuery>html).find(".month-settings select").on('change', this.inputChange.bind(this));
            (<JQuery>html).find(".weekday-settings input").on('change', this.inputChange.bind(this));
            (<JQuery>html).find(".weekday-settings select").on('change', this.inputChange.bind(this));
            (<JQuery>html).find(".leapyear-settings input").on('change', this.inputChange.bind(this));
            (<JQuery>html).find(".leapyear-settings select").on('change', this.inputChange.bind(this));
            (<JQuery>html).find(".time-settings input").on('change', this.inputChange.bind(this));
            (<JQuery>html).find(".moon-settings input").on('change', this.inputChange.bind(this));
            (<JQuery>html).find(".moon-settings select").on('change', this.inputChange.bind(this));
        }
    }

    /**
     * Looks at all of the months and updates their numeric representation depending on if they are intercalary or not
     */
    public rebaseMonthNumbers(){
        let lastMonthNumber = 0;
        let icMonths = 0;
        for(let i = 0; i < (<Year>this.object).months.length; i++){
            const month = (<Year>this.object).months[i];
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
                const newMonthNumber = (<Year>this.object).months.length + 1;
                (<Year>this.object).months.push(new Month('New Month', newMonthNumber, 0, 30));
                this.rebaseMonthNumbers();
                break;
            case "weekday":
                const newWeekdayNumber = (<Year>this.object).weekdays.length + 1;
                (<Year>this.object).weekdays.push(new Weekday(newWeekdayNumber, 'New Weekday'));
                break;
            case "season":
                (<Year>this.object).seasons.push(new Season('New Season', 1, 1));
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
                    {name: GameSettings.Localize('FSC.Moon.Phase.New'), length: 1, icon: MoonIcons.NewMoon, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingCrescent'), length: phaseLength, icon: MoonIcons.WaxingCrescent, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.FirstQuarter'), length: 1, icon: MoonIcons.FirstQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingGibbous'), length: phaseLength, icon: MoonIcons.WaxingGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.Full'), length: 1, icon: MoonIcons.Full, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningGibbous'), length: phaseLength, icon: MoonIcons.WaningGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.LastQuarter'), length: 1, icon: MoonIcons.LastQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningCrescent'), length: phaseLength, icon: MoonIcons.WaningCrescent, singleDay: false}
                ];
                (<Year>this.object).moons.push(newMoon);
                break;
            case "moon-phase":
                const dataMoonIndex = (<HTMLElement>e.currentTarget).getAttribute('data-moon-index');
                if(dataMoonIndex){
                    const moonIndex = parseInt(dataMoonIndex);
                    if(!isNaN(moonIndex) && moonIndex < (<Year>this.object).moons.length){
                        (<Year>this.object).moons[moonIndex].phases.push({
                            name: "Phase",
                            length: 1,
                            icon: MoonIcons.NewMoon,
                            singleDay: false
                        });
                        (<Year>this.object).moons[moonIndex].updatePhaseLength();
                    }
                }
                break;
            case "year-name":
                (<Year>this.object).yearNames.push('New Named Year');
                break;
            case 'note-category':
                this.noteCategories.push({name: "New Category", color:"#b13737 ", textColor:"#ffffff"});
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
                        if(index < (<Year>this.object).months.length){
                            (<Year>this.object).months.splice(index, 1);
                            //Reindex the remaining months
                            for(let i = 0; i < (<Year>this.object).months.length; i++){
                                (<Year>this.object).months[i].numericRepresentation = i + 1;
                            }
                            this.rebaseMonthNumbers();
                        }
                        break;
                    case "weekday":
                        if(index < (<Year>this.object).weekdays.length){
                            (<Year>this.object).weekdays.splice(index, 1);
                            //Reindex the remaining months
                            for(let i = 0; i < (<Year>this.object).weekdays.length; i++){
                                (<Year>this.object).weekdays[i].numericRepresentation = i + 1;
                            }
                        }
                        break;
                    case "season":
                        if(index < (<Year>this.object).seasons.length){
                            (<Year>this.object).seasons.splice(index, 1);
                        }
                        break;
                    case "moon":
                        if(index < (<Year>this.object).moons.length){
                            (<Year>this.object).moons.splice(index, 1);
                        }
                        break;
                    case "moon-phase":
                        const dataMoonIndex = (<HTMLElement>e.currentTarget).getAttribute('data-moon-index');
                        if(dataMoonIndex){
                            const moonIndex = parseInt(dataMoonIndex);
                            if(!isNaN(moonIndex) && moonIndex < (<Year>this.object).moons.length && index < (<Year>this.object).moons[moonIndex].phases.length){
                                (<Year>this.object).moons[moonIndex].phases.splice(index, 1);
                                (<Year>this.object).moons[moonIndex].updatePhaseLength();
                            }
                        }
                        break;
                    case "year-name":
                        if(index < (<Year>this.object).yearNames.length){
                            (<Year>this.object).yearNames.splice(index, 1);
                        }
                        break;
                    case 'note-category':
                        if(index < this.noteCategories.length){{
                            this.noteCategories.splice(index, 1);
                        }}
                        break;
                }
                this.updateApp();
            }
        } else if(dataIndex && dataIndex === 'all'){
            switch (filteredSetting){
                case "month":
                    (<Year>this.object).months = [];
                    break;
                case "weekday":
                    (<Year>this.object).weekdays = [];
                    break;
                case "season":
                    (<Year>this.object).seasons = [];
                    break;
                case "moon":
                    (<Year>this.object).moons = [];
                    break;
                case "moon-phase":
                    const dataMoonIndex = (<HTMLElement>e.currentTarget).getAttribute('data-moon-index');
                    if(dataMoonIndex){
                        const moonIndex = parseInt(dataMoonIndex);
                        if(!isNaN(moonIndex) && moonIndex < (<Year>this.object).moons.length){
                            (<Year>this.object).moons[moonIndex].phases = [];
                        }
                    }
                    break;
                case "year-name":
                    (<Year>this.object).yearNames = [];
                    break;
                case 'note-category':
                    this.noteCategories = [];
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
        PredefinedCalendar.setToPredefined((<Year>this.object), selectedPredefined);
        this.yearChanged = true;
        this.updateApp();
    }

    /**
     * Processes all input change requests and ensures data is properly saved between form update
     * @param {Event} e The change event
     */
    public inputChange(e: Event){
        Logger.debug('Input has changed, updating configuration object');
        const id = (<HTMLElement>e.currentTarget).id;
        const cssClass = (<HTMLElement>e.currentTarget).getAttribute('class');
        const dataIndex = (<HTMLElement>e.currentTarget).getAttribute('data-index');
        let value = (<HTMLInputElement>e.currentTarget).value;
        const checked = (<HTMLInputElement>e.currentTarget).checked;

        if(value){
            value = value.trim();
        }

        if(id && id[0] !== '-'){
            Logger.debug(`ID "${id}" change found`);
            //General Setting Inputs
            if(id === "scDefaultPlayerVisibility"){
                this.generalSettings.defaultPlayerNoteVisibility = checked;
            } else if(id === 'scGameWorldTime'){
                (<Year>this.object).generalSettings.gameWorldTimeIntegration = <GameWorldTimeIntegrations>value;
            } else if(id === 'scShowClock'){
                (<Year>this.object).generalSettings.showClock = checked;
            } else if(id === 'scPF2ESync'){
                (<Year>this.object).generalSettings.pf2eSync = checked;
            }
            //Permission Settings
            else if(id === 'scCalendarVisibleP'){
                (<Year>this.object).generalSettings.permissions.viewCalendar.player = checked;
            } else if(id === 'scCalendarVisibleTP'){
                (<Year>this.object).generalSettings.permissions.viewCalendar.trustedPlayer = checked;
            } else if(id === 'scCalendarVisibleAGM'){
                (<Year>this.object).generalSettings.permissions.viewCalendar.assistantGameMaster = checked;
            } else if(id === 'scAddNotesP'){
                (<Year>this.object).generalSettings.permissions.addNotes.player = checked;
            } else if(id === 'scAddNotesTP'){
                (<Year>this.object).generalSettings.permissions.addNotes.trustedPlayer = checked;
            } else if(id === 'scAddNotesAGM'){
                (<Year>this.object).generalSettings.permissions.addNotes.assistantGameMaster = checked;
            } else if(id === 'scChangeDateTimeP'){
                (<Year>this.object).generalSettings.permissions.changeDateTime.player = checked;
            } else if(id === 'scChangeDateTimeTP'){
                (<Year>this.object).generalSettings.permissions.changeDateTime.trustedPlayer = checked;
            } else if(id === 'scChangeDateTimeAGM'){
                (<Year>this.object).generalSettings.permissions.changeDateTime.assistantGameMaster = checked;
            } else if(id === 'scReorderNotesP'){
                (<Year>this.object).generalSettings.permissions.reorderNotes.player = checked;
            } else if(id === 'scReorderNotesTP'){
                (<Year>this.object).generalSettings.permissions.reorderNotes.trustedPlayer = checked;
            } else if(id === 'scReorderNotesAGM'){
                (<Year>this.object).generalSettings.permissions.reorderNotes.assistantGameMaster = checked;
            }
            //Year Setting Inputs
            else if(id === "scCurrentYear"){
                const year = parseInt(value);
                if(!isNaN(year)){
                    (<Year>this.object).numericRepresentation = year;
                    this.yearChanged = true;
                }
            } else if(id === 'scYearPreFix'){
                (<Year>this.object).prefix = value;
            } else if(id === 'scYearPostFix'){
                (<Year>this.object).postfix = value;
            } else if(id === 'scYearZero'){
                const year = parseInt(value);
                if(!isNaN(year)){
                    (<Year>this.object).yearZero = year;
                }
            } else if(id === 'scYearNameBehaviour'){
                (<Year>this.object).yearNamingRule =  <YearNamingRules>value;
            } else if(id === 'scYearNamesStart'){
                const year = parseInt(value);
                if(!isNaN(year)){
                    (<Year>this.object).yearNamesStart = year;
                }
            }
            //Weekday Setting Inputs
            else if(id === 'scShowWeekdayHeaders'){
                (<Year>this.object).showWeekdayHeadings = checked;
            }
            else if(id === 'scWeekdayFirstDay'){
                const weekdayIndex = parseInt(value);
                if(!isNaN(weekdayIndex)){
                    (<Year>this.object).firstWeekday = weekdayIndex;
                }
            }
            //Leap Year Setting Inputs
            else if(id === 'scLeapYearRule'){
                (<Year>this.object).leapYearRule.rule = <LeapYearRules>value;
            } else if(id === 'scLeapYearCustomMod'){
                const lycm = parseInt(value);
                if(!isNaN(lycm)){
                    (<Year>this.object).leapYearRule.customMod = lycm;
                }
            }
            //Time Setting Inputs
            else if(id === 'scHoursInDay'){
                const min = parseInt(value);
                if(!isNaN(min)){
                    (<Year>this.object).time.hoursInDay = min;
                }
            } else if(id === 'scMinutesInHour'){
                const min = parseInt(value);
                if(!isNaN(min)){
                    (<Year>this.object).time.minutesInHour = min;
                }
            } else if(id === 'scSecondsInMinute'){
                const min = parseInt(value);
                if(!isNaN(min)){
                    (<Year>this.object).time.secondsInMinute = min;
                }
            } else if(id === 'scGameTimeRatio'){
                const min = parseFloat(value);
                if(!isNaN(min)){
                    (<Year>this.object).time.gameTimeRatio = min;
                }
            } else if(id === 'scUnifyClockWithFoundryPause'){
                (<Year>this.object).time.unifyGameAndClockPause = checked;
            } else if(id === 'scTimeUpdateFrequency'){
                const min = parseInt(value);
                if(!isNaN(min)){
                    (<Year>this.object).time.updateFrequency = min;
                }
            }

            this.updateApp();
        } else if (cssClass) {
            Logger.debug(`CSS Class "${cssClass}" change found`);
            if(dataIndex){
                const index = parseInt(dataIndex);
                Logger.debug(`Indexed item (${index}) changed.`);
                if(!isNaN(index)){
                    //Year Name Inputs
                    if(cssClass === 'year-name' && (<Year>this.object).yearNames.length > index){
                        (<Year>this.object).yearNames[index] = value;
                    }
                    //Season Setting Inputs
                    else if(cssClass === 'season-name' && (<Year>this.object).seasons.length > index){
                        (<Year>this.object).seasons[index].name = value;
                    } else if(cssClass === 'season-month' && (<Year>this.object).seasons.length > index){
                        const month = parseInt(value);
                        if(!isNaN(month)){
                            (<Year>this.object).seasons[index].startingMonth = month;
                            (<Year>this.object).seasons[index].startingDay = 1;
                        }
                    } else if(cssClass === 'season-day' && (<Year>this.object).seasons.length > index){
                        const day = parseInt(value);
                        if(!isNaN(day)){
                            (<Year>this.object).seasons[index].startingDay = day;
                        }
                    } else if(cssClass === 'season-color' && (<Year>this.object).seasons.length > index){
                        (<Year>this.object).seasons[index].color = value;
                    }
                    //Month Setting Inputs
                    else if(cssClass === 'month-show-advanced' && (<Year>this.object).months.length > index){
                        (<Year>this.object).months[index].showAdvanced = !(<Year>this.object).months[index].showAdvanced;
                    }
                    else if(cssClass === 'month-name' && (<Year>this.object).months.length > index){
                        (<Year>this.object).months[index].name = value;
                    } else if(cssClass === 'month-days' && (<Year>this.object).months.length > index){
                        let days = parseInt(value);
                        if(!isNaN(days) && days !== (<Year>this.object).months[index].days.length){
                            (<Year>this.object).months[index].numberOfDays = days;
                            if((<Year>this.object).leapYearRule.rule === LeapYearRules.None){
                                (<Year>this.object).months[index].numberOfLeapYearDays = days;
                            }
                            this.updateMonthDays((<Year>this.object).months[index]);
                        }
                    } else if (cssClass === 'month-intercalary' && (<Year>this.object).months.length > index){
                        (<Year>this.object).months[index].intercalary = checked;
                        const a = (<JQuery>this.element).find(`.month-intercalary-include[data-index='${dataIndex}']`).parent().parent().parent();
                        if((<Year>this.object).months[index].intercalary){
                            a.removeClass('hidden');
                        } else {
                            a.addClass('hidden');
                        }
                        this.rebaseMonthNumbers();
                    } else if (cssClass === 'month-intercalary-include' && (<Year>this.object).months.length > index){
                        (<Year>this.object).months[index].intercalaryInclude = checked;
                        this.rebaseMonthNumbers();
                    } else if(cssClass === 'month-numeric-representation-offset' && (<Year>this.object).months.length > index){
                        let v = parseInt(value);
                        if(!isNaN(v)){
                            (<Year>this.object).months[index].numericRepresentationOffset = v;
                        }
                    } else if(cssClass === 'month-starting-weekday' && (<Year>this.object).months.length > index){
                        let v = parseInt(value);
                        if(!isNaN(v)){
                            (<Year>this.object).months[index].startingWeekday = v;
                        } else {
                            (<Year>this.object).months[index].startingWeekday = null;
                        }
                    }
                    //Weekday Setting Inputs
                    else if(cssClass === 'weekday-name' && (<Year>this.object).weekdays.length > index){
                        (<Year>this.object).weekdays[index].name = value;
                    }
                    //Leap Year Setting Inputs
                    else if(cssClass === 'month-leap-days' && (<Year>this.object).months.length > index){
                        const days = parseInt(value);
                        if(!isNaN(days) && days !== (<Year>this.object).months[index].numberOfLeapYearDays){
                            (<Year>this.object).months[index].numberOfLeapYearDays = days;
                            this.updateMonthDays((<Year>this.object).months[index]);
                        }
                    }
                    //Moon Setting Inputs
                    else if(cssClass === 'moon-name' && (<Year>this.object).moons.length > index){
                        (<Year>this.object).moons[index].name = value;
                    } else if(cssClass === 'moon-cycle-length' && (<Year>this.object).moons.length > index){
                        const cycle = parseFloat(value);
                        if(!isNaN(cycle)){
                            (<Year>this.object).moons[index].cycleLength = cycle;
                            (<Year>this.object).moons[index].updatePhaseLength();
                        }
                    } else if(cssClass === 'moon-cycle-adjustment' && (<Year>this.object).moons.length > index){
                        const cycle = parseFloat(value);
                        if(!isNaN(cycle)){
                            (<Year>this.object).moons[index].cycleDayAdjust = cycle;
                        }
                    } else if(cssClass === 'moon-year-reset' && (<Year>this.object).moons.length > index){
                        (<Year>this.object).moons[index].firstNewMoon.yearReset = <MoonYearResetOptions>value;
                    } else if(cssClass === 'moon-year-x' && (<Year>this.object).moons.length > index){
                        const year = parseInt(value);
                        if(!isNaN(year)){
                            (<Year>this.object).moons[index].firstNewMoon.yearX = year;
                        }
                    }else if(cssClass === 'moon-year' && (<Year>this.object).moons.length > index){
                        const year = parseInt(value);
                        if(!isNaN(year)){
                            (<Year>this.object).moons[index].firstNewMoon.year = year;
                        }
                    } else if(cssClass === 'moon-month' && (<Year>this.object).moons.length > index){
                        const month = parseInt(value);
                        if(!isNaN(month)){
                            (<Year>this.object).moons[index].firstNewMoon.month = month;
                            (<Year>this.object).moons[index].firstNewMoon.day = 1;
                        }
                    } else if(cssClass === 'moon-day' && (<Year>this.object).moons.length > index){
                        const day = parseInt(value);
                        if(!isNaN(day)){
                            (<Year>this.object).moons[index].firstNewMoon.day = day;
                        }
                    } else if(cssClass === 'moon-color' && (<Year>this.object).moons.length > index){
                        if(value[0] !== "#"){
                            value = '#'+value;
                        }
                        (<Year>this.object).moons[index].color = value;
                    } else if(cssClass === 'moon-phase-name' || cssClass === 'moon-phase-single-day' || cssClass === 'moon-phase-icon'){
                        const dataMoonIndex = (<HTMLElement>e.currentTarget).getAttribute('data-moon-index');
                        if(dataMoonIndex){
                            const moonIndex = parseInt(dataMoonIndex);
                            if(!isNaN(moonIndex) && (<Year>this.object).moons.length > moonIndex && (<Year>this.object).moons[moonIndex].phases.length > index){
                                if(cssClass === 'moon-phase-name'){
                                    (<Year>this.object).moons[moonIndex].phases[index].name = value;
                                } else if(cssClass === 'moon-phase-single-day'){
                                    (<Year>this.object).moons[moonIndex].phases[index].singleDay = checked;
                                    (<Year>this.object).moons[moonIndex].updatePhaseLength();
                                } else if(cssClass === 'moon-phase-icon'){
                                    (<Year>this.object).moons[moonIndex].phases[index].icon = <MoonIcons>value;
                                }

                            }
                        }
                    }
                    // Note Categories
                    else if(cssClass === 'note-category-name' && this.noteCategories.length > index){
                        const oldName = this.noteCategories[index].name;
                        this.noteCategories[index].name = value;
                        if(index < SimpleCalendar.instance.noteCategories.length){
                            //Update all existing notes with the new name;
                            SimpleCalendar.instance.notes.forEach(n => {
                                const nci = n.categories.indexOf(oldName);
                                if (nci > -1) {
                                    n.categories[nci] = value;
                                }
                            });
                        }
                    } else if(cssClass === 'note-category-color' && this.noteCategories.length > index){
                        this.noteCategories[index].color = value;
                        this.noteCategories[index].textColor = Utilities.GetContrastColor(value);
                    }
                }
            }
            this.updateApp();
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
     * @param {string} type They type of action the user is attempting to preform - Used to call the correct functions
     * @param {string} type2 The sub type of the above type the user is attempting to preform
     * @param {Event} e The click event
     */
    public overwriteConfirmationDialog(type: string, type2: string, e: Event){
        e.preventDefault();
        const dialog = new Dialog({
            title: GameSettings.Localize('FSC.OverwriteConfirm'),
            content: GameSettings.Localize("FSC.OverwriteConfirmText"),
            buttons:{
                yes: {
                    icon: '<i class="fas fa-check"></i>',
                    label: GameSettings.Localize('FSC.Apply'),
                    callback: this.overwriteConfirmationYes.bind(this, type, type2)
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
     * @param {string} type The type of action being preformed
     * @param {string} type2 The sub type of the above type
     */
    public async overwriteConfirmationYes(type: string, type2: string){
        if(type === 'predefined'){
            this.predefinedApplyConfirm();
        } else if(type === 'tp-import'){
            if(type2 === 'about-time'){
                await Importer.importAboutTime(<Year>this.object);
                this.updateApp();
            } else if(type2 === 'calendar-weather'){
                await Importer.importCalendarWeather(<Year>this.object);
                this.updateApp();
            }
            await GameSettings.SetImportRan(true);
        } else if(type === 'tp-export'){
            if(type2 === 'about-time'){
                await Importer.exportToAboutTime(<Year>this.object);
            } else if(type2 === 'calendar-weather'){
                await Importer.exportCalendarWeather(<Year>this.object);
            }
            await GameSettings.SetImportRan(true);
        }
    }

    /**
     * When the save button is clicked, apply those changes to the game settings and re-load the calendars across all players
     * @param {Event} e The click event
     */
    public async saveClick(e: Event) {
        e.preventDefault();
        try{
            //If there is no leap year rule set ensure months leap year and normal days match
            if((<Year>this.object).leapYearRule.rule === LeapYearRules.None){
                for(let i = 0; i < (<Year>this.object).months.length; i++){
                    (<Year>this.object).months[i].numberOfLeapYearDays = (<Year>this.object).months[i].numberOfDays;
                }
            }
            // Update the general Settings
            (<Year>this.object).generalSettings.gameWorldTimeIntegration = <GameWorldTimeIntegrations>(<HTMLInputElement>document.getElementById("scGameWorldTime")).value;
            await GameSettings.SaveGeneralSettings((<Year>this.object).generalSettings);

            // Update the Year Configuration
            const currentYear = parseInt((<HTMLInputElement>document.getElementById("scCurrentYear")).value);
            if(!isNaN(currentYear)){
                (<Year>this.object).numericRepresentation = currentYear;
                (<Year>this.object).selectedYear = currentYear;
                (<Year>this.object).visibleYear = currentYear;
            }

            await GameSettings.SaveYearConfiguration(<Year>this.object);
            // Update the Month Configuration
            await GameSettings.SaveMonthConfiguration((<Year>this.object).months);
            //Update Weekday Configuration
            await GameSettings.SaveWeekdayConfiguration((<Year>this.object).weekdays);
            //Update Leap Year Configuration
            await GameSettings.SaveLeapYearRules((<Year>this.object).leapYearRule);
            //Update Time Configuration
            await GameSettings.SaveTimeConfiguration((<Year>this.object).time);
            //Update Season Configuration
            await GameSettings.SaveSeasonConfiguration((<Year>this.object).seasons);
            //Update Moon Settings
            await GameSettings.SaveMoonConfiguration((<Year>this.object).moons);

            if(this.yearChanged){
                await GameSettings.SaveCurrentDate(<Year>this.object);
            }

            const noteDefaultPlayerVisibility = (<HTMLInputElement>document.getElementById('scDefaultPlayerVisibility')).checked;
            await GameSettings.SetDefaultNoteVisibility(noteDefaultPlayerVisibility);

            await GameSettings.SaveNoteCategories(this.noteCategories);

            if(SimpleCalendar.instance && SimpleCalendar.instance.currentYear){
                await SimpleCalendar.instance.currentYear.syncTime(true);
            }

            this.closeApp();
        } catch (error){
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
            currentDate: GameSettings.LoadCurrentDate(),
            generalSettings: GameSettings.LoadGeneralSettings(),
            leapYearSettings: GameSettings.LoadLeapYearRules(),
            monthSettings: GameSettings.LoadMonthData(),
            moonSettings: GameSettings.LoadMoonData(),
            noteCategories: GameSettings.LoadNoteCategories(),
            seasonSettings: GameSettings.LoadSeasonData(),
            timeSettings: GameSettings.LoadTimeData(),
            weekdaySettings: GameSettings.LoadWeekdayData(),
            yearSettings: GameSettings.LoadYearData()
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
