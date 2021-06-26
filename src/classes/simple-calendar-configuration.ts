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
    MoonYearResetOptions, SettingNames,
    YearNamingRules
} from "../constants";
import Importer from "./importer";
import Season from "./season";
import Moon from "./moon";
import SimpleCalendar from "./simple-calendar";
import {saveAs} from "file-saver";

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
        super(data);
        this._tabs[0].active = "generalSettings";
        this.year = data;

        this.generalSettings.defaultPlayerNoteVisibility = GameSettings.GetDefaultNoteVisibility();
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
                golarianpf1e : 'Golarian: Pathfinder 1E',
                golarianpf2e : 'Golarian: Pathfinder 2E',
                greyhawk: 'Greyhawk',
                harptos: 'Harptos',
                'traveller-ic': 'Traveller: Imperial Calendar',
                warhammer: "Warhammer"
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
        };

        const calendarWeather = game.modules.get('calendar-weather');
        const aboutTime = game.modules.get('about-time');

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

        if(game.users){
            game.users.forEach(u => {
                if(!u.isGM){
                    data.users[u.id] = u.name;
                }
            });
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
        if(html.hasOwnProperty("length")) {
            //Month advanced click
            (<JQuery>html).find(".month-show-advanced").on('click', SimpleCalendarConfiguration.instance.inputChange.bind(this));

            //Save button clicks
            (<JQuery>html).find("#scSubmit").on('click', SimpleCalendarConfiguration.instance.saveClick.bind(this));

            //Predefined calendar apply
            (<JQuery>html).find("#scApplyPredefined").on('click', SimpleCalendarConfiguration.instance.overwriteConfirmationDialog.bind(this, 'predefined', ''));

            //Table Removes
            (<JQuery>html).find(".remove-month").on('click', SimpleCalendarConfiguration.instance.removeFromTable.bind(this, 'month'));
            (<JQuery>html).find(".remove-weekday").on('click', SimpleCalendarConfiguration.instance.removeFromTable.bind(this, 'weekday'));
            (<JQuery>html).find(".remove-season").on('click', SimpleCalendarConfiguration.instance.removeFromTable.bind(this, 'season'));
            (<JQuery>html).find(".remove-moon").on('click', SimpleCalendarConfiguration.instance.removeFromTable.bind(this, 'moon'));
            (<JQuery>html).find(".remove-moon-phase").on('click', SimpleCalendarConfiguration.instance.removeFromTable.bind(this, 'moon-phase'));
            (<JQuery>html).find(".remove-year-name").on('click', SimpleCalendarConfiguration.instance.removeFromTable.bind(this, 'year-name'));

            //Table Adds
            (<JQuery>html).find(".month-add").on('click', SimpleCalendarConfiguration.instance.addToTable.bind(this, 'month'));
            (<JQuery>html).find(".weekday-add").on('click', SimpleCalendarConfiguration.instance.addToTable.bind(this, 'weekday'));
            (<JQuery>html).find(".season-add").on('click', SimpleCalendarConfiguration.instance.addToTable.bind(this, 'season'));
            (<JQuery>html).find(".moon-add").on('click', SimpleCalendarConfiguration.instance.addToTable.bind(this, 'moon'));
            (<JQuery>html).find(".moon-phase-add").on('click', SimpleCalendarConfiguration.instance.addToTable.bind(this, 'moon-phase'));
            (<JQuery>html).find(".year-name-add").on('click', SimpleCalendarConfiguration.instance.addToTable.bind(this, 'year-name'));

            //Import Buttons
            (<JQuery>html).find("#scAboutTimeImport").on('click', SimpleCalendarConfiguration.instance.overwriteConfirmationDialog.bind(this, 'tp-import', 'about-time'));
            (<JQuery>html).find("#scAboutTimeExport").on('click', SimpleCalendarConfiguration.instance.overwriteConfirmationDialog.bind(this, 'tp-export','about-time'));
            (<JQuery>html).find("#scCalendarWeatherImport").on('click', SimpleCalendarConfiguration.instance.overwriteConfirmationDialog.bind(this, 'tp-import', 'calendar-weather'));
            (<JQuery>html).find("#scCalendarWeatherExport").on('click', SimpleCalendarConfiguration.instance.overwriteConfirmationDialog.bind(this, 'tp-export','calendar-weather'));

            (<JQuery>html).find("#exportCalendar").on('click', SimpleCalendarConfiguration.instance.exportCalendar.bind(this));
            (<JQuery>html).find("#importCalendar").on('click', SimpleCalendarConfiguration.instance.importCalendar.bind(this));

            //Input Change
            (<JQuery>html).find(".general-settings input").on('change', SimpleCalendarConfiguration.instance.inputChange.bind(this));
            (<JQuery>html).find(".note-settings input").on('change', SimpleCalendarConfiguration.instance.inputChange.bind(this));
            (<JQuery>html).find(".year-settings input").on('change', SimpleCalendarConfiguration.instance.inputChange.bind(this));
            (<JQuery>html).find(".year-settings select").on('change', SimpleCalendarConfiguration.instance.inputChange.bind(this));
            (<JQuery>html).find(".month-settings input").on('change', SimpleCalendarConfiguration.instance.inputChange.bind(this));
            (<JQuery>html).find(".month-settings select").on('change', SimpleCalendarConfiguration.instance.inputChange.bind(this));
            (<JQuery>html).find(".weekday-settings input").on('change', SimpleCalendarConfiguration.instance.inputChange.bind(this));
            (<JQuery>html).find(".weekday-settings select").on('change', SimpleCalendarConfiguration.instance.inputChange.bind(this));
            (<JQuery>html).find(".leapyear-settings input").on('change', SimpleCalendarConfiguration.instance.inputChange.bind(this));
            (<JQuery>html).find(".leapyear-settings select").on('change', SimpleCalendarConfiguration.instance.inputChange.bind(this));
            (<JQuery>html).find(".time-settings input").on('change', SimpleCalendarConfiguration.instance.inputChange.bind(this));
            (<JQuery>html).find(".moon-settings input").on('change', SimpleCalendarConfiguration.instance.inputChange.bind(this));
            (<JQuery>html).find(".moon-settings select").on('change', SimpleCalendarConfiguration.instance.inputChange.bind(this));
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
        const filteredSetting = setting.toLowerCase() as 'month' | 'weekday' | 'season' | 'moon' | 'moon-phase' | 'year-name';
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
        const filteredSetting = setting.toLowerCase() as 'month' | 'weekday' | 'season' | 'moon' | 'moon-phase' | 'year-name';
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
            }
            this.updateApp();
        }

    }

    /**
     * When the GM confirms using a predefined calendar
     */
    public predefinedApplyConfirm() {
        const selectedPredefined = (<HTMLInputElement>document.getElementById("scPreDefined")).value;
        Logger.debug(`Overwriting the existing calendar configuration with the "${selectedPredefined}" configuration`);
        let phaseLength = 0;
        switch (selectedPredefined){
            case 'gregorian':
                const currentDate = new Date();
                (<Year>this.object).numericRepresentation = currentDate.getFullYear();
                (<Year>this.object).prefix = '';
                (<Year>this.object).postfix = '';
                (<Year>this.object).yearZero = 1970;
                (<Year>this.object).months = [
                    new Month(GameSettings.Localize("FSC.Date.January"), 1, 0, 31),
                    new Month(GameSettings.Localize("FSC.Date.February"), 2, 0, 28, 29),
                    new Month(GameSettings.Localize("FSC.Date.March"),3, 0, 31),
                    new Month(GameSettings.Localize("FSC.Date.April"),4, 0, 30),
                    new Month(GameSettings.Localize("FSC.Date.May"),5, 0, 31),
                    new Month(GameSettings.Localize("FSC.Date.June"),6, 0, 30),
                    new Month(GameSettings.Localize("FSC.Date.July"),7, 0, 31),
                    new Month(GameSettings.Localize("FSC.Date.August"),8, 0, 31),
                    new Month(GameSettings.Localize("FSC.Date.September"),9, 0, 30),
                    new Month(GameSettings.Localize("FSC.Date.October"), 10, 0, 31),
                    new Month(GameSettings.Localize("FSC.Date.November"), 11, 0, 30),
                    new Month(GameSettings.Localize("FSC.Date.December"), 12, 0, 31),
                ];
                (<Year>this.object).showWeekdayHeadings = true;
                (<Year>this.object).firstWeekday = 4;
                (<Year>this.object).weekdays = [
                    new Weekday(1, GameSettings.Localize('FSC.Date.Sunday')),
                    new Weekday(2, GameSettings.Localize('FSC.Date.Monday')),
                    new Weekday(3, GameSettings.Localize('FSC.Date.Tuesday')),
                    new Weekday(4, GameSettings.Localize('FSC.Date.Wednesday')),
                    new Weekday(5, GameSettings.Localize('FSC.Date.Thursday')),
                    new Weekday(6, GameSettings.Localize('FSC.Date.Friday')),
                    new Weekday(7, GameSettings.Localize('FSC.Date.Saturday'))
                ];
                (<Year>this.object).seasons = [
                    new Season('Spring', 3, 20),
                    new Season('Summer', 6, 20),
                    new Season('Fall', 9, 22),
                    new Season('Winter', 12, 21)
                ];
                (<Year>this.object).time.hoursInDay = 24;
                (<Year>this.object).time.minutesInHour = 60;
                (<Year>this.object).time.secondsInMinute = 60;
                (<Year>this.object).time.gameTimeRatio = 1;
                (<Year>this.object).leapYearRule.rule = LeapYearRules.Gregorian;
                (<Year>this.object).leapYearRule.customMod = 0;
                (<Year>this.object).months[currentDate.getMonth()].current = true;
                (<Year>this.object).months[currentDate.getMonth()].days[currentDate.getDate()-1].current = true;
                (<Year>this.object).seasons[0].color = "#fffce8";
                (<Year>this.object).seasons[1].color = "#f3fff3";
                (<Year>this.object).seasons[2].color = "#fff7f2";
                (<Year>this.object).seasons[3].color = "#f2f8ff";
                (<Year>this.object).moons = [
                   new Moon('Moon', 29.53059)
                ];
                (<Year>this.object).moons[0].firstNewMoon.yearReset = MoonYearResetOptions.None;
                (<Year>this.object).moons[0].firstNewMoon.year = 2000;
                (<Year>this.object).moons[0].firstNewMoon.month = 1;
                (<Year>this.object).moons[0].firstNewMoon.day = 6;
                (<Year>this.object).moons[0].cycleDayAdjust = 0.5;
                phaseLength = Number((((<Year>this.object).moons[0].cycleLength - 4) / 4).toPrecision(5));
                (<Year>this.object).moons[0].phases = [
                    {name: GameSettings.Localize('FSC.Moon.Phase.New'), length: 1, icon: MoonIcons.NewMoon, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingCrescent'), length: phaseLength, icon: MoonIcons.WaxingCrescent, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.FirstQuarter'), length: 1, icon: MoonIcons.FirstQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingGibbous'), length: phaseLength, icon: MoonIcons.WaxingGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.Full'), length: 1, icon: MoonIcons.Full, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningGibbous'), length: phaseLength, icon: MoonIcons.WaningGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.LastQuarter'), length: 1, icon: MoonIcons.LastQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningCrescent'), length: phaseLength, icon: MoonIcons.WaningCrescent, singleDay: false}
                ];
                (<Year>this.object).yearNamesStart = 0;
                (<Year>this.object).yearNamingRule = YearNamingRules.Default;
                (<Year>this.object).yearNames = [];
                break;
            case 'darksun':
                (<Year>this.object).numericRepresentation = 1;
                (<Year>this.object).prefix = '';
                (<Year>this.object).postfix = '';
                (<Year>this.object).yearZero = 0;
                (<Year>this.object).months = [
                    new Month('Scorch', 1, 0, 30),
                    new Month('Morrow', 2, 0, 30),
                    new Month('Rest', 3, 0, 30),
                    new Month('Gather', 4, 0, 30),
                    new Month('Cooling Sun', -1, 0, 5),
                    new Month('Breeze', 5, 0, 30),
                    new Month('Mist', 6, 0, 30),
                    new Month('Bloom', 7, 0, 30),
                    new Month('Haze', 8, 0, 30),
                    new Month('Soaring Sun', -2, 0, 5),
                    new Month('Hoard', 9, 0, 30),
                    new Month('Wind', 10, 0, 30),
                    new Month('Sorrow', 11, 0, 30),
                    new Month('Smolder', 12, 0, 30),
                    new Month('Highest Sun', -3, 0, 5)
                ];
                (<Year>this.object).months[4].intercalary = true;
                (<Year>this.object).months[9].intercalary = true;
                (<Year>this.object).months[14].intercalary = true;
                (<Year>this.object).showWeekdayHeadings = false;
                (<Year>this.object).firstWeekday = 0;
                (<Year>this.object).weekdays = [
                    new Weekday(1, '1 Day'),
                    new Weekday(2, '2 Day'),
                    new Weekday(3, '3 Day'),
                    new Weekday(4, '4 Day'),
                    new Weekday(5, '5 Day'),
                    new Weekday(6, '6 Day')
                ];
                (<Year>this.object).seasons = [
                    new Season("Sun Descending", 3, 1),
                    new Season("Sun Ascending", 7, 1),
                    new Season("High Sun", 9, 1)
                ];
                (<Year>this.object).seasons[2].color = '#fff2da';
                (<Year>this.object).seasons[0].color = '#dececc';
                (<Year>this.object).seasons[1].color = '#fff1e7';
                (<Year>this.object).time.hoursInDay = 24;
                (<Year>this.object).time.minutesInHour = 60;
                (<Year>this.object).time.secondsInMinute = 60;
                (<Year>this.object).time.gameTimeRatio = 1;
                (<Year>this.object).leapYearRule.rule = LeapYearRules.None;
                (<Year>this.object).leapYearRule.customMod = 0;
                (<Year>this.object).months[0].current = true;
                (<Year>this.object).months[0].days[0].current = true;
                (<Year>this.object).moons = [
                    new Moon('Ral', 34),
                    new Moon('Guthay', 125)
                ];
                (<Year>this.object).moons[0].color = "#7ace57";
                (<Year>this.object).moons[0].firstNewMoon.yearReset = MoonYearResetOptions.None;
                (<Year>this.object).moons[0].firstNewMoon.year = 1;
                (<Year>this.object).moons[0].firstNewMoon.month = 1;
                (<Year>this.object).moons[0].firstNewMoon.day = 14;
                phaseLength = Number((((<Year>this.object).moons[0].cycleLength - 4) / 4).toPrecision(5));
                (<Year>this.object).moons[0].phases = [
                    {name: GameSettings.Localize('FSC.Moon.Phase.New'), length: 1, icon: MoonIcons.NewMoon, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingCrescent'), length: phaseLength, icon: MoonIcons.WaxingCrescent, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.FirstQuarter'), length: 1, icon: MoonIcons.FirstQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingGibbous'), length: phaseLength, icon: MoonIcons.WaxingGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.Full'), length: 1, icon: MoonIcons.Full, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningGibbous'), length: phaseLength, icon: MoonIcons.WaningGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.LastQuarter'), length: 1, icon: MoonIcons.LastQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningCrescent'), length: phaseLength, icon: MoonIcons.WaningCrescent, singleDay: false}
                ];
                (<Year>this.object).moons[1].color = "#ffd920";
                (<Year>this.object).moons[1].firstNewMoon.yearReset = MoonYearResetOptions.None;
                (<Year>this.object).moons[1].firstNewMoon.year = 1;
                (<Year>this.object).moons[1].firstNewMoon.month = 3;
                (<Year>this.object).moons[1].firstNewMoon.day = 3;
                phaseLength = Number((((<Year>this.object).moons[1].cycleLength - 4) / 4).toPrecision(5));
                (<Year>this.object).moons[1].phases = [
                    {name: GameSettings.Localize('FSC.Moon.Phase.New'), length: 1, icon: MoonIcons.NewMoon, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingCrescent'), length: phaseLength, icon: MoonIcons.WaxingCrescent, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.FirstQuarter'), length: 1, icon: MoonIcons.FirstQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingGibbous'), length: phaseLength, icon: MoonIcons.WaxingGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.Full'), length: 1, icon: MoonIcons.Full, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningGibbous'), length: phaseLength, icon: MoonIcons.WaningGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.LastQuarter'), length: 1, icon: MoonIcons.LastQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningCrescent'), length: phaseLength, icon: MoonIcons.WaningCrescent, singleDay: false}
                ];
                (<Year>this.object).yearNamesStart = -101;
                (<Year>this.object).yearNamingRule = YearNamingRules.Repeat;
                (<Year>this.object).yearNames = [
                    "Ral's Fury",
                    "Friend's Contemplation",
                    "Desert's Vengeance",
                    "Priest's Slumber",
                    "Wind's Defiance",
                    "Dragon's Reverance",
                    "Mountain's Agitation",
                    "King's Fury",
                    "Silt's Contemplation",
                    "Enemy's Vengeance",
                    "Guthay's Slumber",
                    "Ral's Defiance",
                    "Friend's Reverance",
                    "Desert's Agitation",
                    "Priest's Fury",
                    "Wind's Contemplation",
                    "Dragon's Vengeance",
                    "Mountain's Slumber",
                    "King's Defiance",
                    "Silt's Reverance",
                    "Enemy's Agitation",
                    "Guthay's Fury",
                    "Ral's Contemplation",
                    "Friend's Vengeance",
                    "Desert's Slumber",
                    "Priest's Defiance",
                    "Wind's Reverance",
                    "Dragon's Agitation",
                    "Mountain's Fury",
                    "King's Contemplation",
                    "Silt's Vengeance",
                    "Enemy's Slumber",
                    "Guthay's Defiance",
                    "Ral's Reverance",
                    "Friend's Agitation",
                    "Desert's Fury",
                    "Priest's Contemplation",
                    "Wind's Vengeance",
                    "Dragon's Slumber",
                    "Mountain's Defiance",
                    "King's Reverance",
                    "Silt's Agitation",
                    "Enemy's Fury",
                    "Guthay's Contemplation",
                    "Ral's Vengeance",
                    "Friend's Slumber",
                    "Desert's Defiance",
                    "Priest's Reverance",
                    "Wind's Agitation",
                    "Dragon's Fury",
                    "Mountain's Contemplation",
                    "King's Vengeance",
                    "Silt's Slumber",
                    "Enemy's Defiance",
                    "Guthay's Reverance",
                    "Ral's Agitation",
                    "Friend's Fury",
                    "Desert's Contemplation",
                    "Priest's Vengeance",
                    "Wind's Slumber",
                    "Dragon's Defiance",
                    "Mountain's Reverance",
                    "King's Agitation",
                    "Silt's Fury",
                    "Enemy's Contemplation",
                    "Guthay's Vengeance",
                    "Ral's Slumber",
                    "Friend's Defiance",
                    "Desert's Reverance",
                    "Priest's Agitation",
                    "Wind's Fury",
                    "Dragon's Contemplation",
                    "Mountain's Vengeance",
                    "King's Slumber",
                    "Silt's Defiance",
                    "Enemy's Reverance",
                    "Guthay's Agitation"
                ];
                break;
            case 'eberron':
                (<Year>this.object).numericRepresentation = 998;
                (<Year>this.object).prefix = '';
                (<Year>this.object).postfix = ' YK';
                (<Year>this.object).yearZero = 0;
                (<Year>this.object).months = [
                    new Month('Zarantyr', 1, 0, 28),
                    new Month('Olarune', 2, 0, 28),
                    new Month('Therendor', 3, 0, 28),
                    new Month('Eyre', 4, 0, 28),
                    new Month('Dravago', 5, 0, 28),
                    new Month('Nymm', 6, 0, 28),
                    new Month('Lharvion', 7, 0, 28),
                    new Month('Barrakas', 8, 0, 28),
                    new Month('Rhaan', 9, 0, 28),
                    new Month('Sypheros', 10, 0, 28),
                    new Month('Aryth', 11, 0, 28),
                    new Month('Vult', 12, 0, 28)
                ];
                (<Year>this.object).showWeekdayHeadings = true;
                (<Year>this.object).firstWeekday = 0;
                (<Year>this.object).weekdays = [
                    new Weekday(1, 'Sul'),
                    new Weekday(2, 'Mol'),
                    new Weekday(3, 'Zol'),
                    new Weekday(4, 'Wir'),
                    new Weekday(5, 'Zor'),
                    new Weekday(6, 'Far'),
                    new Weekday(7, 'Sar')
                ];
                (<Year>this.object).seasons = [];
                (<Year>this.object).time.hoursInDay = 24;
                (<Year>this.object).time.minutesInHour = 60;
                (<Year>this.object).time.secondsInMinute = 60;
                (<Year>this.object).time.gameTimeRatio = 1;
                (<Year>this.object).leapYearRule.rule = LeapYearRules.None;
                (<Year>this.object).leapYearRule.customMod = 0;
                (<Year>this.object).months[0].current = true;
                (<Year>this.object).months[0].days[0].current = true;
                (<Year>this.object).moons = []; //TODO: Maybe add all 12 moons?
                (<Year>this.object).yearNamesStart = 0;
                (<Year>this.object).yearNamingRule = YearNamingRules.Default;
                (<Year>this.object).yearNames = [];
                break;
            case 'exandrian':
                (<Year>this.object).numericRepresentation = 812;
                (<Year>this.object).prefix = '';
                (<Year>this.object).postfix = ' P.D.';
                (<Year>this.object).yearZero = 0;
                (<Year>this.object).months = [
                    new Month('Horisal', 1, 0, 29),
                    new Month('Misuthar', 2, 0, 30),
                    new Month('Dualahei', 3, 0, 30),
                    new Month('Thunsheer', 4, 0, 31),
                    new Month('Unndilar', 5, 0, 28),
                    new Month('Brussendar', 6, 0, 31),
                    new Month('Sydenstar', 7, 0, 32),
                    new Month('Fessuran', 8, 0, 29),
                    new Month('Quen\'pillar', 9, 0, 27),
                    new Month('Cuersaar', 10, 0, 29),
                    new Month('Duscar', 11, 0, 32)
                ];
                (<Year>this.object).showWeekdayHeadings = true;
                (<Year>this.object).firstWeekday = 3;
                (<Year>this.object).weekdays = [
                    new Weekday(1, 'Miresen'),
                    new Weekday(2, 'Grissen'),
                    new Weekday(3, 'Whelsen'),
                    new Weekday(4, 'Conthsen'),
                    new Weekday(5, 'Folsen'),
                    new Weekday(6, 'Yulisen'),
                    new Weekday(7, 'Da\'leysen')
                ];
                (<Year>this.object).seasons = [
                    new Season('Spring', 3, 13),
                    new Season('Summer', 5, 26),
                    new Season('Autumn', 8, 3),
                    new Season('Winter', 11, 2)
                ];
                (<Year>this.object).time.hoursInDay = 24;
                (<Year>this.object).time.minutesInHour = 60;
                (<Year>this.object).time.secondsInMinute = 60;
                (<Year>this.object).time.gameTimeRatio = 1;
                (<Year>this.object).leapYearRule.rule = LeapYearRules.None;
                (<Year>this.object).leapYearRule.customMod = 0;
                (<Year>this.object).months[0].current = true;
                (<Year>this.object).months[0].days[0].current = true;
                (<Year>this.object).seasons[0].color = "#fffce8";
                (<Year>this.object).seasons[1].color = "#f3fff3";
                (<Year>this.object).seasons[2].color = "#fff7f2";
                (<Year>this.object).seasons[3].color = "#f2f8ff";
                (<Year>this.object).moons = [
                    new Moon('Catha', 33),
                    new Moon('Ruidus', 328)
                ];
                (<Year>this.object).moons[0].firstNewMoon.yearReset = MoonYearResetOptions.None;
                (<Year>this.object).moons[0].firstNewMoon.year = 810;
                (<Year>this.object).moons[0].firstNewMoon.month = 1;
                (<Year>this.object).moons[0].firstNewMoon.day = 9;
                phaseLength = Number((((<Year>this.object).moons[0].cycleLength - 4) / 4).toPrecision(5));
                (<Year>this.object).moons[0].phases = [
                    {name: GameSettings.Localize('FSC.Moon.Phase.New'), length: 1, icon: MoonIcons.NewMoon, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingCrescent'), length: phaseLength, icon: MoonIcons.WaxingCrescent, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.FirstQuarter'), length: 1, icon: MoonIcons.FirstQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingGibbous'), length: phaseLength, icon: MoonIcons.WaxingGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.Full'), length: 1, icon: MoonIcons.Full, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningGibbous'), length: phaseLength, icon: MoonIcons.WaningGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.LastQuarter'), length: 1, icon: MoonIcons.LastQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningCrescent'), length: phaseLength, icon: MoonIcons.WaningCrescent, singleDay: false}
                ];
                (<Year>this.object).moons[1].color = "#ab82f3";
                (<Year>this.object).moons[1].firstNewMoon.yearReset = MoonYearResetOptions.None;
                (<Year>this.object).moons[1].firstNewMoon.year = 810;
                (<Year>this.object).moons[1].firstNewMoon.month = 3;
                (<Year>this.object).moons[1].firstNewMoon.day = 22;
                phaseLength = Number((((<Year>this.object).moons[1].cycleLength - 4) / 4).toPrecision(5));
                (<Year>this.object).moons[1].phases = [
                    {name: GameSettings.Localize('FSC.Moon.Phase.New'), length: 1, icon: MoonIcons.NewMoon, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingCrescent'), length: phaseLength, icon: MoonIcons.WaxingCrescent, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.FirstQuarter'), length: 1, icon: MoonIcons.FirstQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingGibbous'), length: phaseLength, icon: MoonIcons.WaxingGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.Full'), length: 1, icon: MoonIcons.Full, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningGibbous'), length: phaseLength, icon: MoonIcons.WaningGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.LastQuarter'), length: 1, icon: MoonIcons.LastQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningCrescent'), length: phaseLength, icon: MoonIcons.WaningCrescent, singleDay: false}
                ];
                (<Year>this.object).yearNamesStart = 0;
                (<Year>this.object).yearNamingRule = YearNamingRules.Default;
                (<Year>this.object).yearNames = [];
                break;
            case 'golarianpf1e':
                (<Year>this.object).numericRepresentation = 4710;
                (<Year>this.object).prefix = '';
                (<Year>this.object).postfix = ' AR';
                (<Year>this.object).yearZero = 0;
                (<Year>this.object).months = [
                    new Month('Abadius', 1, 0, 31),
                    new Month('Calistril', 2, 0, 28, 29),
                    new Month('Pharast', 3, 0, 31),
                    new Month('Gozran', 4, 0, 30),
                    new Month('Desnus', 5, 0, 31),
                    new Month('Sarenith', 6, 0, 30),
                    new Month('Erastus', 7, 0, 31),
                    new Month('Arodus', 8, 0, 31),
                    new Month('Rova', 9, 0, 30),
                    new Month('Lamashan', 10, 0, 31),
                    new Month('Neth', 11, 0, 30),
                    new Month('Kuthona', 12, 0, 31)
                ];
                (<Year>this.object).showWeekdayHeadings = true;
                (<Year>this.object).firstWeekday = 6;
                (<Year>this.object).weekdays = [
                    new Weekday(1, 'Moonday'),
                    new Weekday(2, 'Toilday'),
                    new Weekday(3, 'Wealday'),
                    new Weekday(4, 'Oathday'),
                    new Weekday(5, 'Fireday'),
                    new Weekday(6, 'Starday'),
                    new Weekday(7, 'Sunday')
                ];
                (<Year>this.object).seasons = [
                    new Season('Spring', 3, 1),
                    new Season('Summer', 6, 1),
                    new Season('Fall', 9, 1),
                    new Season('Winter', 12, 1)
                ];
                (<Year>this.object).time.hoursInDay = 24;
                (<Year>this.object).time.minutesInHour = 60;
                (<Year>this.object).time.secondsInMinute = 60;
                (<Year>this.object).time.gameTimeRatio = 1;
                (<Year>this.object).leapYearRule.rule = LeapYearRules.Custom;
                (<Year>this.object).leapYearRule.customMod = 8;
                (<Year>this.object).months[0].current = true;
                (<Year>this.object).months[0].days[0].current = true;
                (<Year>this.object).seasons[0].color = "#fffce8";
                (<Year>this.object).seasons[1].color = "#f3fff3";
                (<Year>this.object).seasons[2].color = "#fff7f2";
                (<Year>this.object).seasons[3].color = "#f2f8ff";
                (<Year>this.object).moons = [
                    new Moon('Somal', 29.5)
                ];
                (<Year>this.object).moons[0].firstNewMoon.yearReset = MoonYearResetOptions.XYears;
                (<Year>this.object).moons[0].firstNewMoon.yearX = 4;
                (<Year>this.object).moons[0].firstNewMoon.year = 4700;
                (<Year>this.object).moons[0].firstNewMoon.month = 1;
                (<Year>this.object).moons[0].firstNewMoon.day = 8;
                phaseLength = Number((((<Year>this.object).moons[0].cycleLength - 4) / 4).toPrecision(5));
                (<Year>this.object).moons[0].phases = [
                    {name: GameSettings.Localize('FSC.Moon.Phase.New'), length: 1, icon: MoonIcons.NewMoon, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingCrescent'), length: phaseLength, icon: MoonIcons.WaxingCrescent, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.FirstQuarter'), length: 1, icon: MoonIcons.FirstQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingGibbous'), length: phaseLength, icon: MoonIcons.WaxingGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.Full'), length: 1, icon: MoonIcons.Full, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningGibbous'), length: phaseLength, icon: MoonIcons.WaningGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.LastQuarter'), length: 1, icon: MoonIcons.LastQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningCrescent'), length: phaseLength, icon: MoonIcons.WaningCrescent, singleDay: false}
                ];
                (<Year>this.object).yearNamesStart = 0;
                (<Year>this.object).yearNamingRule = YearNamingRules.Default;
                (<Year>this.object).yearNames = [];
                break;
            case 'golarianpf2e':
                (<Year>this.object).numericRepresentation = 4710;
                (<Year>this.object).prefix = '';
                (<Year>this.object).postfix = ' AR';
                (<Year>this.object).yearZero = 2700;
                (<Year>this.object).months = [
                    new Month('Abadius', 1, 0, 31),
                    new Month('Calistril', 2, 0, 28, 29),
                    new Month('Pharast', 3, 0, 31),
                    new Month('Gozran', 4, 0, 30),
                    new Month('Desnus', 5, 0, 31),
                    new Month('Sarenith', 6, 0, 30),
                    new Month('Erastus', 7, 0, 31),
                    new Month('Arodus', 8, 0, 31),
                    new Month('Rova', 9, 0, 30),
                    new Month('Lamashan', 10, 0, 31),
                    new Month('Neth', 11, 0, 30),
                    new Month('Kuthona', 12, 0, 31)
                ];
                (<Year>this.object).showWeekdayHeadings = true;
                (<Year>this.object).firstWeekday = 6;
                (<Year>this.object).weekdays = [
                    new Weekday(1, 'Moonday'),
                    new Weekday(2, 'Toilday'),
                    new Weekday(3, 'Wealday'),
                    new Weekday(4, 'Oathday'),
                    new Weekday(5, 'Fireday'),
                    new Weekday(6, 'Starday'),
                    new Weekday(7, 'Sunday')
                ];
                (<Year>this.object).seasons = [
                    new Season('Spring', 3, 1),
                    new Season('Summer', 6, 1),
                    new Season('Fall', 9, 1),
                    new Season('Winter', 12, 1)
                ];
                (<Year>this.object).time.hoursInDay = 24;
                (<Year>this.object).time.minutesInHour = 60;
                (<Year>this.object).time.secondsInMinute = 60;
                (<Year>this.object).time.gameTimeRatio = 1;
                (<Year>this.object).leapYearRule.rule = LeapYearRules.Gregorian;
                (<Year>this.object).leapYearRule.customMod = 0;
                (<Year>this.object).months[0].current = true;
                (<Year>this.object).months[0].days[0].current = true;
                (<Year>this.object).seasons[0].color = "#fffce8";
                (<Year>this.object).seasons[1].color = "#f3fff3";
                (<Year>this.object).seasons[2].color = "#fff7f2";
                (<Year>this.object).seasons[3].color = "#f2f8ff";
                (<Year>this.object).moons = [
                    new Moon('Somal', 29.5)
                ];
                (<Year>this.object).moons[0].firstNewMoon.yearReset = MoonYearResetOptions.XYears;
                (<Year>this.object).moons[0].firstNewMoon.yearX = 4;
                (<Year>this.object).moons[0].firstNewMoon.year = 4700;
                (<Year>this.object).moons[0].firstNewMoon.month = 1;
                (<Year>this.object).moons[0].firstNewMoon.day = 8;
                phaseLength = Number((((<Year>this.object).moons[0].cycleLength - 4) / 4).toPrecision(5));
                (<Year>this.object).moons[0].phases = [
                    {name: GameSettings.Localize('FSC.Moon.Phase.New'), length: 1, icon: MoonIcons.NewMoon, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingCrescent'), length: phaseLength, icon: MoonIcons.WaxingCrescent, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.FirstQuarter'), length: 1, icon: MoonIcons.FirstQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingGibbous'), length: phaseLength, icon: MoonIcons.WaxingGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.Full'), length: 1, icon: MoonIcons.Full, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningGibbous'), length: phaseLength, icon: MoonIcons.WaningGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.LastQuarter'), length: 1, icon: MoonIcons.LastQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningCrescent'), length: phaseLength, icon: MoonIcons.WaningCrescent, singleDay: false}
                ];
                (<Year>this.object).yearNamesStart = 0;
                (<Year>this.object).yearNamingRule = YearNamingRules.Default;
                (<Year>this.object).yearNames = [];
                break;
            case 'greyhawk':
                (<Year>this.object).numericRepresentation = 591 ;
                (<Year>this.object).prefix = '';
                (<Year>this.object).postfix = ' cy';
                (<Year>this.object).yearZero = 0;
                (<Year>this.object).months = [
                    new Month('Needfest', -1, 0, 7),
                    new Month('Fireseek', 1, 0, 28),
                    new Month('Readying', 2, 0, 28),
                    new Month('Coldeven', 3, 0, 28),
                    new Month('Growfest', -2, 0, 7),
                    new Month('Planting', 4, 0, 28),
                    new Month('Flocktime', 5, 0, 28),
                    new Month('Wealsun', 6, 0, 28),
                    new Month('Richfest', -3, 0, 7),
                    new Month('Reaping', 7, 0, 28),
                    new Month('Goodmonth', 8, 0, 28),
                    new Month('Harvester', 9, 0, 28),
                    new Month('Brewfest', -4, 0, 7),
                    new Month('Patchwall', 10, 0, 28),
                    new Month('Ready\'reat', 11, 0, 28),
                    new Month('Sunsebb', 12, 0, 28),
                ];
                (<Year>this.object).months[0].intercalary = true;
                (<Year>this.object).months[4].intercalary = true;
                (<Year>this.object).months[8].intercalary = true;
                (<Year>this.object).months[12].intercalary = true;
                (<Year>this.object).showWeekdayHeadings = true;
                (<Year>this.object).firstWeekday = 0;
                (<Year>this.object).weekdays = [
                    new Weekday(1, 'Starday'),
                    new Weekday(2, 'Sunday'),
                    new Weekday(3, 'Moonday'),
                    new Weekday(4, 'Godsday'),
                    new Weekday(5, 'Waterday'),
                    new Weekday(6, 'Earthday'),
                    new Weekday(7, 'Freeday')
                ];
                (<Year>this.object).seasons = [
                    new Season('Spring', 2, 1),
                    new Season('Low Summer', 4, 1),
                    new Season('High Summer', 7, 1),
                    new Season('Fall', 10, 1),
                    new Season('Winter', 12, 1)
                ];
                (<Year>this.object).seasons[0].color = "#fffce8";
                (<Year>this.object).seasons[1].color = "#f3fff3";
                (<Year>this.object).seasons[2].color = "#f3fff3";
                (<Year>this.object).seasons[3].color = "#fff7f2";
                (<Year>this.object).seasons[4].color = "#f2f8ff";
                (<Year>this.object).time.hoursInDay = 24;
                (<Year>this.object).time.minutesInHour = 60;
                (<Year>this.object).time.secondsInMinute = 60;
                (<Year>this.object).time.gameTimeRatio = 1;
                (<Year>this.object).leapYearRule.rule = LeapYearRules.None;
                (<Year>this.object).leapYearRule.customMod = 0;
                (<Year>this.object).months[0].current = true;
                (<Year>this.object).months[0].days[0].current = true;
                (<Year>this.object).moons = [
                    new Moon('Luna', 28),
                    new Moon('Celene', 91)
                ];
                (<Year>this.object).moons[0].firstNewMoon.yearReset = MoonYearResetOptions.None;
                (<Year>this.object).moons[0].firstNewMoon.year = 590;
                (<Year>this.object).moons[0].firstNewMoon.month = 1;
                (<Year>this.object).moons[0].firstNewMoon.day = 25;
                phaseLength = Number((((<Year>this.object).moons[0].cycleLength - 4) / 4).toPrecision(5));
                (<Year>this.object).moons[0].phases = [
                    {name: GameSettings.Localize('FSC.Moon.Phase.New'), length: 1, icon: MoonIcons.NewMoon, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingCrescent'), length: phaseLength, icon: MoonIcons.WaxingCrescent, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.FirstQuarter'), length: 1, icon: MoonIcons.FirstQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingGibbous'), length: phaseLength, icon: MoonIcons.WaxingGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.Full'), length: 1, icon: MoonIcons.Full, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningGibbous'), length: phaseLength, icon: MoonIcons.WaningGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.LastQuarter'), length: 1, icon: MoonIcons.LastQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningCrescent'), length: phaseLength, icon: MoonIcons.WaningCrescent, singleDay: false}
                ];
                (<Year>this.object).moons[1].color = '#7FFFD4';
                (<Year>this.object).moons[1].firstNewMoon.yearReset = MoonYearResetOptions.None;
                (<Year>this.object).moons[1].firstNewMoon.year = 590;
                (<Year>this.object).moons[1].firstNewMoon.month = 2;
                (<Year>this.object).moons[1].firstNewMoon.day = 12;
                phaseLength = Number((((<Year>this.object).moons[1].cycleLength - 4) / 4).toPrecision(5));
                (<Year>this.object).moons[1].phases = [
                    {name: GameSettings.Localize('FSC.Moon.Phase.New'), length: 1, icon: MoonIcons.NewMoon, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingCrescent'), length: phaseLength, icon: MoonIcons.WaxingCrescent, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.FirstQuarter'), length: 1, icon: MoonIcons.FirstQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingGibbous'), length: phaseLength, icon: MoonIcons.WaxingGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.Full'), length: 1, icon: MoonIcons.Full, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningGibbous'), length: phaseLength, icon: MoonIcons.WaningGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.LastQuarter'), length: 1, icon: MoonIcons.LastQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningCrescent'), length: phaseLength, icon: MoonIcons.WaningCrescent, singleDay: false}
                ];
                (<Year>this.object).yearNamesStart = 0;
                (<Year>this.object).yearNamingRule = YearNamingRules.Default;
                (<Year>this.object).yearNames = [];
                break;
            case 'harptos':
                (<Year>this.object).numericRepresentation = 1495;
                (<Year>this.object).prefix = '';
                (<Year>this.object).postfix = ' DR';
                (<Year>this.object).yearZero = 0;
                (<Year>this.object).months = [
                    new Month('Hammer', 1, 0, 30),
                    new Month('Midwinter', -1, 0, 1),
                    new Month('Alturiak', 2, 0, 30),
                    new Month('Ches', 3, 0, 30),
                    new Month('Tarsakh', 4, 0, 30),
                    new Month('Greengrass', -2, 0, 1),
                    new Month('Mirtul', 5, 0, 30),
                    new Month('Kythorn', 6, 0, 30),
                    new Month('Flamerule', 7, 0, 30),
                    new Month('Midsummer', -3, 0, 1),
                    new Month('Shieldmeet', -4, 0, 0, 1),
                    new Month('Eleasis', 8, 0, 30),
                    new Month('Eleint', 9, 0, 30),
                    new Month('Higharvestide', -5, 0, 1),
                    new Month('Marpenoth', 10, 0, 30),
                    new Month('Uktar', 11, 0, 30),
                    new Month('Feast Of the Moon', -6, 0, 1),
                    new Month('Nightal', 12, 0, 30)
                ];
                (<Year>this.object).months[1].intercalary = true;
                (<Year>this.object).months[5].intercalary = true;
                (<Year>this.object).months[9].intercalary = true;
                (<Year>this.object).months[10].intercalary = true;
                (<Year>this.object).months[13].intercalary = true;
                (<Year>this.object).months[16].intercalary = true;
                (<Year>this.object).showWeekdayHeadings = false;
                (<Year>this.object).firstWeekday = 0;
                (<Year>this.object).weekdays = [
                    new Weekday(1, '1st'),
                    new Weekday(2, '2nd'),
                    new Weekday(3, '3rd'),
                    new Weekday(4, '4th'),
                    new Weekday(5, '5th'),
                    new Weekday(6, '6th'),
                    new Weekday(7, '7th'),
                    new Weekday(8, '8th'),
                    new Weekday(9, '9th'),
                    new Weekday(10, '10th')
                ];
                (<Year>this.object).seasons = [
                    new Season('Spring', 3, 19),
                    new Season('Summer', 6, 20),
                    new Season('Fall', 9, 21),
                    new Season('Winter', 12, 20)
                ];
                (<Year>this.object).seasons[0].color = "#fffce8";
                (<Year>this.object).seasons[1].color = "#f3fff3";
                (<Year>this.object).seasons[2].color = "#fff7f2";
                (<Year>this.object).seasons[3].color = "#f2f8ff";
                (<Year>this.object).time.hoursInDay = 24;
                (<Year>this.object).time.minutesInHour = 60;
                (<Year>this.object).time.secondsInMinute = 60;
                (<Year>this.object).time.gameTimeRatio = 1;
                (<Year>this.object).leapYearRule.rule = LeapYearRules.Custom;
                (<Year>this.object).leapYearRule.customMod = 4;
                (<Year>this.object).months[0].current = true;
                (<Year>this.object).months[0].days[0].current = true;
                (<Year>this.object).moons = [
                    new Moon('Selûne', 30.45)
                ];
                (<Year>this.object).moons[0].firstNewMoon.yearReset = MoonYearResetOptions.LeapYear;
                (<Year>this.object).moons[0].firstNewMoon.year = 1372;
                (<Year>this.object).moons[0].firstNewMoon.month = 1;
                (<Year>this.object).moons[0].firstNewMoon.day = 16;
                (<Year>this.object).moons[0].cycleDayAdjust = 0.5;
                phaseLength = Number((((<Year>this.object).moons[0].cycleLength - 4) / 4).toPrecision(5));
                (<Year>this.object).moons[0].phases = [
                    {name: GameSettings.Localize('FSC.Moon.Phase.New'), length: 1, icon: MoonIcons.NewMoon, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingCrescent'), length: phaseLength, icon: MoonIcons.WaxingCrescent, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.FirstQuarter'), length: 1, icon: MoonIcons.FirstQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingGibbous'), length: phaseLength, icon: MoonIcons.WaxingGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.Full'), length: 1, icon: MoonIcons.Full, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningGibbous'), length: phaseLength, icon: MoonIcons.WaningGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.LastQuarter'), length: 1, icon: MoonIcons.LastQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningCrescent'), length: phaseLength, icon: MoonIcons.WaningCrescent, singleDay: false}
                ];
                (<Year>this.object).yearNamesStart = 0;
                (<Year>this.object).yearNamingRule = YearNamingRules.Default;
                (<Year>this.object).yearNames = [];
                break;
            case 'traveller-ic':
                (<Year>this.object).numericRepresentation = 1000;
                (<Year>this.object).prefix = '';
                (<Year>this.object).postfix = '';
                (<Year>this.object).yearZero = 0;
                (<Year>this.object).months = [
                    new Month('Holiday', -1, 0, 1),
                    new Month('Year', 1,1, 364)
                ];
                (<Year>this.object).months[0].intercalary = true;
                (<Year>this.object).showWeekdayHeadings = true;
                (<Year>this.object).firstWeekday = 0;
                (<Year>this.object).weekdays = [
                    new Weekday(1, 'Wonday'),
                    new Weekday(2, 'Tuday'),
                    new Weekday(3, 'Thirday'),
                    new Weekday(4, 'Forday'),
                    new Weekday(5, 'Fiday'),
                    new Weekday(6, 'Sixday'),
                    new Weekday(7, 'Senday')
                ];
                (<Year>this.object).seasons = [];
                (<Year>this.object).time.hoursInDay = 24;
                (<Year>this.object).time.minutesInHour = 60;
                (<Year>this.object).time.secondsInMinute = 60;
                (<Year>this.object).time.gameTimeRatio = 1;
                (<Year>this.object).leapYearRule.rule = LeapYearRules.None;
                (<Year>this.object).leapYearRule.customMod = 0;
                (<Year>this.object).months[0].current = true;
                (<Year>this.object).months[0].days[0].current = true;
                (<Year>this.object).moons = [];
                (<Year>this.object).yearNamesStart = 0;
                (<Year>this.object).yearNamingRule = YearNamingRules.Default;
                (<Year>this.object).yearNames = [];
                break;
            case 'warhammer':
                (<Year>this.object).numericRepresentation = 2522;
                (<Year>this.object).prefix = '';
                (<Year>this.object).postfix = '';
                (<Year>this.object).yearZero = 0;
                (<Year>this.object).months = [
                    new Month('Hexenstag', -1, 0, 1),
                    new Month('Nachexen', 1, 0, 32),
                    new Month('Jahrdrung', 2, 0, 33),
                    new Month('Mitterfruhl', -2, 0, 1),
                    new Month('Pflugzeit', 3, 0, 33),
                    new Month('Sigmarzeit', 4, 0, 33),
                    new Month('Sommerzeit', 5, 0, 33),
                    new Month('Sonnstill', -3, 0, 1),
                    new Month('Vorgeheim', 6, 0, 33),
                    new Month('Geheimnistag', -4, 0, 1),
                    new Month('Nachgeheim', 7, 0, 32),
                    new Month('Erntezeit', 8, 0, 33),
                    new Month('Mittherbst', -5, 0, 1),
                    new Month('Brauzeit', 9, 0, 33),
                    new Month('Kaldezeit', 10, 0, 33),
                    new Month('Ulriczeit', 11, 0, 33),
                    new Month('Mondstille', -6, 0, 1),
                    new Month('Vorhexen', 12, 0, 33)
                ];
                (<Year>this.object).months[0].intercalary = true;
                (<Year>this.object).months[3].intercalary = true;
                (<Year>this.object).months[7].intercalary = true;
                (<Year>this.object).months[9].intercalary = true;
                (<Year>this.object).months[12].intercalary = true;
                (<Year>this.object).months[16].intercalary = true;
                (<Year>this.object).showWeekdayHeadings = true;
                (<Year>this.object).firstWeekday = 0;
                (<Year>this.object).weekdays = [
                    new Weekday(1, 'Wellentag'),
                    new Weekday(2, 'Aubentag'),
                    new Weekday(3, 'Marktag'),
                    new Weekday(4, 'Backertag'),
                    new Weekday(5, 'Bezahltag'),
                    new Weekday(6, 'Konistag'),
                    new Weekday(7, 'Angestag'),
                    new Weekday(8, 'Festag')
                ];
                (<Year>this.object).seasons = [
                    new Season('Spring', 3, 20),
                    new Season('Summer', 6, 20),
                    new Season('Fall', 9, 22),
                    new Season('Winter', 12, 21)
                ];
                (<Year>this.object).seasons[0].color = "#fffce8";
                (<Year>this.object).seasons[1].color = "#f3fff3";
                (<Year>this.object).seasons[2].color = "#fff7f2";
                (<Year>this.object).seasons[3].color = "#f2f8ff";
                (<Year>this.object).time.hoursInDay = 24;
                (<Year>this.object).time.minutesInHour = 60;
                (<Year>this.object).time.secondsInMinute = 60;
                (<Year>this.object).time.gameTimeRatio = 1;
                (<Year>this.object).leapYearRule.rule = LeapYearRules.None;
                (<Year>this.object).leapYearRule.customMod = 0;
                (<Year>this.object).months[0].current = true;
                (<Year>this.object).months[0].days[0].current = true;
                (<Year>this.object).moons = [
                    new Moon('Luna', 25)
                ];
                (<Year>this.object).moons[0].firstNewMoon.yearReset = MoonYearResetOptions.None;
                (<Year>this.object).moons[0].firstNewMoon.year = 2522;
                (<Year>this.object).moons[0].firstNewMoon.month = 1;
                (<Year>this.object).moons[0].firstNewMoon.day = 13;
                phaseLength = Number((((<Year>this.object).moons[0].cycleLength - 4) / 4).toPrecision(5));
                (<Year>this.object).moons[0].phases = [
                    {name: GameSettings.Localize('FSC.Moon.Phase.New'), length: 1, icon: MoonIcons.NewMoon, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingCrescent'), length: phaseLength, icon: MoonIcons.WaxingCrescent, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.FirstQuarter'), length: 1, icon: MoonIcons.FirstQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingGibbous'), length: phaseLength, icon: MoonIcons.WaxingGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.Full'), length: 1, icon: MoonIcons.Full, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningGibbous'), length: phaseLength, icon: MoonIcons.WaningGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.LastQuarter'), length: 1, icon: MoonIcons.LastQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningCrescent'), length: phaseLength, icon: MoonIcons.WaningCrescent, singleDay: false}
                ];
                (<Year>this.object).yearNamesStart = 0;
                (<Year>this.object).yearNamingRule = YearNamingRules.Default;
                (<Year>this.object).yearNames = [];
                break;
        }
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
                    } else if(cssClass === 'season-custom' && (<Year>this.object).seasons.length > index){
                        if(value[0] !== "#"){
                            value = '#'+value;
                        }
                        (<Year>this.object).seasons[index].customColor = value;
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
                    callback: SimpleCalendarConfiguration.instance.overwriteConfirmationYes.bind(this, type, type2)
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
                    await game.settings.set(ModuleName, SettingNames.YearConfiguration, res.yearSettings);
                }
                if(res.hasOwnProperty('monthSettings')){
                    await game.settings.set(ModuleName, SettingNames.MonthConfiguration, res.monthSettings);
                }
                if(res.hasOwnProperty('weekdaySettings')){
                    await game.settings.set(ModuleName, SettingNames.WeekdayConfiguration, res.weekdaySettings);
                }
                if(res.hasOwnProperty('leapYearSettings')){
                    await game.settings.set(ModuleName, SettingNames.LeapYearRule, res.leapYearSettings);
                }
                if(res.hasOwnProperty('timeSettings')){
                    await game.settings.set(ModuleName, SettingNames.TimeConfiguration, res.timeSettings);
                }
                if(res.hasOwnProperty('seasonSettings')){
                    await game.settings.set(ModuleName, SettingNames.SeasonConfiguration, res.seasonSettings);
                }
                if(res.hasOwnProperty('moonSettings')){
                    await game.settings.set(ModuleName, SettingNames.MoonConfiguration, res.moonSettings);
                }
                if(res.hasOwnProperty('generalSettings')){
                    await game.settings.set(ModuleName, SettingNames.GeneralConfiguration, res.generalSettings);
                }
                if(res.hasOwnProperty('currentDate')){
                    await game.settings.set(ModuleName, SettingNames.CurrentDate, res.currentDate);
                }
                this.closeApp();
            }
        } catch (ex){
            GameSettings.UiNotification(GameSettings.Localize('FSC.Importer.InvalidSCConfig'), 'error');
        }
    }
}
