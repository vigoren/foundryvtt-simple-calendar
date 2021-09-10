import Year from "./year";
import {CalendarConfiguration, GeneralSettings, NoteCategory, PermissionMatrix} from "../interfaces";
import {GameSystems, GameWorldTimeIntegrations, PredefinedCalendars, TimeKeeperStatus} from "../constants";
import {Note} from "./note";
import Month from "./month";
import {Logger} from "./logging";
import {GameSettings} from "./game-settings";
import {Weekday} from "./weekday";
import Season from "./season";
import Moon from "./moon";
import SimpleCalendar from "./simple-calendar";
import PredefinedCalendar from "./predefined-calendar";

export default class Calendar{

    /**
     * Loads the calendars from the settings
     */
    static LoadCalendars(){
        const cal = new Calendar({name: 'default'});
        cal.settingUpdate();

        return [cal];
    }

    /**
     * The name of this calendar
     * @type {string}
     */
    name: string;
    /**
     * The currently running game system
     * @type {GameSystems}
     */
    gameSystem: GameSystems;
    /**
     * All of the general settings for a calendar
     * @type {GeneralSettings}
     */
    generalSettings: GeneralSettings = {
        gameWorldTimeIntegration: GameWorldTimeIntegrations.Mixed,
        showClock: true,
        pf2eSync: true,
        permissions: {
            viewCalendar: {player: true, trustedPlayer: true, assistantGameMaster: true, users: undefined},
            addNotes: {player: false, trustedPlayer: false, assistantGameMaster: false, users: undefined},
            reorderNotes: {player: false, trustedPlayer: false, assistantGameMaster: false, users: undefined},
            changeDateTime: {player: false, trustedPlayer: false, assistantGameMaster: false, users: undefined}
        }
    };
    /**
     * The year class for the calendar
     * @type {Year}
     */
    year: Year;
    /**
     * List of all notes in the calendar
     * @type {Array.<Note>}
     */
    public notes: Note[] = [];
    /**
     * List of all categories associated with notes
     * @type{Array.<NoteCategory>}
     */
    public noteCategories: NoteCategory[] = [];

    /**
     * Construct a new Calendar class
     * @param {CalendarConfiguration} configuration The configuration object for the calendar
     */
    constructor(configuration: CalendarConfiguration) {
        // Set Calendar Data
        this.name = configuration.name;
        this.gameSystem = GameSystems.Other;

        if((<Game>game).system){
            switch ((<Game>game).system.id){
                case GameSystems.DnD5E:
                    this.gameSystem = GameSystems.DnD5E;
                    break;
                case GameSystems.PF1E:
                    this.gameSystem = GameSystems.PF1E;
                    break;
                case GameSystems.PF2E:
                    this.gameSystem = GameSystems.PF2E;
                    break;
                case GameSystems.WarhammerFantasy4E:
                    this.gameSystem = GameSystems.WarhammerFantasy4E;
                    break;
            }
        }

        this.year = new Year(0);
        PredefinedCalendar.setToPredefined(this.year, PredefinedCalendars.Gregorian);
    }

    /**
     * Checks if a user can do an action based on a passed in permission matrix
     * @param user
     * @param permissions
     */
    canUser(user: User | null, permissions: PermissionMatrix): boolean{
        if(user === null){
            return false;
        }
        return !!(user.isGM || (permissions.player && user.hasRole(1)) || (permissions.trustedPlayer && user.hasRole(2)) || (permissions.assistantGameMaster && user.hasRole(3)) || (permissions.users && permissions.users.includes(user.id? user.id : '')));
    }




    /**
     * Called when a setting is updated, refreshes the configurations for all types
     * @param {string} [type='all']
     */
    public settingUpdate(type: string = 'all'){
        if(type === 'all' || type === 'year'){
            this.loadYearConfiguration();
        }
        if(type === 'all' || type === 'month'){
            this.loadMonthConfiguration();
        }
        if(type === 'all' || type === 'weekday'){
            this.loadWeekdayConfiguration();
        }
        if(type === 'all' || type === 'notes'){
            this.loadNotes();
        }
        if(type === 'leapyear'){
            this.year.leapYearRule.loadFromSettings();
        }
        if(type === 'all' || type === 'time'){
            this.loadTimeConfiguration();
        }
        if(type === 'all' || type === 'season'){
            this.loadSeasonConfiguration();
        }
        if(type === 'all' || type === 'moon'){
            this.loadMoonConfiguration();
        }
        if(type === 'all' || type === 'general'){
            this.loadGeneralSettings();
        }
        if(type === 'all' || type === 'note-categories'){
            this.loadNoteCategories();
        }
        this.loadCurrentDate();
    }

    /**
     * Loads the general settings from the world settings and apply them
     * @private
     */
    private loadGeneralSettings(){
        Logger.debug('Loading general settings from world settings');
        const gSettings = GameSettings.LoadGeneralSettings();
        if(gSettings && Object.keys(gSettings).length){
            this.generalSettings.gameWorldTimeIntegration = gSettings.gameWorldTimeIntegration;
            this.generalSettings.showClock = gSettings.showClock;
            if(gSettings.hasOwnProperty('pf2eSync')){
                this.generalSettings.pf2eSync = gSettings.pf2eSync;
            }
            if(gSettings.hasOwnProperty('permissions')){
                this.generalSettings.permissions = gSettings.permissions;
                if(!gSettings.permissions.hasOwnProperty('reorderNotes')){
                    this.generalSettings.permissions.reorderNotes = {player: false, trustedPlayer: false, assistantGameMaster: false, users: undefined};
                }
            } else if(gSettings.hasOwnProperty('playersAddNotes')){
                this.generalSettings.permissions.addNotes.player = <boolean>gSettings['playersAddNotes'];
                this.generalSettings.permissions.addNotes.trustedPlayer = <boolean>gSettings['playersAddNotes'];
                this.generalSettings.permissions.addNotes.assistantGameMaster = <boolean>gSettings['playersAddNotes'];
            }
        }
    }

    /**
     * Loads the year configuration data from the settings and applies them to the current year
     */
    private loadYearConfiguration(){
        Logger.debug('Loading year configuration from settings.');

        const yearData = GameSettings.LoadYearData();
        if(yearData && Object.keys(yearData).length){
            Logger.debug('Setting the year from data.');
            this.year.numericRepresentation = yearData.numericRepresentation;
            this.year.prefix = yearData.prefix;
            this.year.postfix = yearData.postfix;

            if(yearData.hasOwnProperty('showWeekdayHeadings')){
                this.year.showWeekdayHeadings = yearData.showWeekdayHeadings;
            }
            if(yearData.hasOwnProperty('firstWeekday')){
                this.year.firstWeekday = yearData.firstWeekday;
            }
            // Check to see if a year 0 has been set in the settings and use that
            if(yearData.hasOwnProperty('yearZero')){
                this.year.yearZero = yearData.yearZero;
            }

            if(yearData.hasOwnProperty('yearNames')){
                this.year.yearNames = yearData.yearNames;
            }
            if(yearData.hasOwnProperty('yearNamingRule')){
                this.year.yearNamingRule = yearData.yearNamingRule;
            }
            if(yearData.hasOwnProperty('yearNamesStart')){
                this.year.yearNamesStart = yearData.yearNamesStart;
            }
        }
    }

    /**
     * Loads the month configuration data from the settings and applies them to the current year
     */
    private loadMonthConfiguration(){
        Logger.debug('Loading month configuration from settings.');
        const monthData = GameSettings.LoadMonthData();
        if(monthData.length){
            this.year.months = [];
            Logger.debug('Setting the months from data.');
            for(let i = 0; i < monthData.length; i++){
                if(Object.keys(monthData[i]).length){
                    let numDays = parseInt(monthData[i].numberOfDays.toString());
                    let numLeapDays = monthData[i].numberOfLeapYearDays === undefined? 0 : parseInt(monthData[i].numberOfLeapYearDays.toString());
                    if(isNaN(numDays)){
                        numDays = 1;
                    }
                    if(isNaN(numLeapDays)){
                        numLeapDays = 1;
                    }
                    const newMonth = new Month(monthData[i].name, monthData[i].numericRepresentation, monthData[i].numericRepresentationOffset, numDays, numLeapDays);
                    newMonth.intercalary = monthData[i].intercalary;
                    newMonth.intercalaryInclude = monthData[i].intercalaryInclude;
                    if(monthData[i].hasOwnProperty('startingWeekday')){
                        newMonth.startingWeekday = monthData[i].startingWeekday;
                    }
                    this.year.months.push(newMonth);
                }
            }
        }
    }

    /**
     * Loads the weekday configuration data from the settings and applies them to the current year
     */
    private loadWeekdayConfiguration(){
        Logger.debug('Loading weekday configuration from settings.');
        const weekdayData = GameSettings.LoadWeekdayData();
        if(weekdayData.length){
            Logger.debug('Setting the weekdays from data.');
            this.year.weekdays = [];
            for(let i = 0; i < weekdayData.length; i++){
                this.year.weekdays.push(new Weekday(weekdayData[i].numericRepresentation, weekdayData[i].name));
            }
        }
    }

    /**
     * Loads the season configuration data from the settings and applies them to the current year
     * @private
     */
    private loadSeasonConfiguration(){
        Logger.debug('Loading season configuration from settings.');
        const seasonData = GameSettings.LoadSeasonData();
        this.year.seasons = [];
        if(seasonData.length){
            Logger.debug('Setting the seasons from data.');
            for(let i = 0; i < seasonData.length; i++){
                const newSeason = new Season(seasonData[i].name, seasonData[i].startingMonth, seasonData[i].startingDay);
                const sCustColor = seasonData[i].customColor;
                newSeason.color = seasonData[i].color === 'custom' && sCustColor? sCustColor : seasonData[i].color;
                if(seasonData[i].hasOwnProperty('sunriseTime')){
                    newSeason.sunriseTime = seasonData[i].sunriseTime;
                }
                if(seasonData[i].hasOwnProperty('sunsetTime')){
                    newSeason.sunsetTime = seasonData[i].sunsetTime;
                }
                this.year.seasons.push(newSeason);
            }
        }
    }

    /**
     * Loads the moon configuration data from the settings and applies them to the current year
     * @private
     */
    private loadMoonConfiguration(){
        Logger.debug('Loading moon configuration from settings.');
        const moonData = GameSettings.LoadMoonData();
        this.year.moons = [];
        if(moonData.length){
            Logger.debug('Setting the moons from data.');
            for(let i = 0; i < moonData.length; i++){
                const newMoon = new Moon(moonData[i].name, moonData[i].cycleLength);
                newMoon.phases = moonData[i].phases;
                newMoon.firstNewMoon = {
                    yearReset: moonData[i].firstNewMoon.yearReset,
                    yearX: moonData[i].firstNewMoon.yearX,
                    year: moonData[i].firstNewMoon.year,
                    month: moonData[i].firstNewMoon.month,
                    day: moonData[i].firstNewMoon.day
                };
                newMoon.color = moonData[i].color;
                newMoon.cycleDayAdjust = moonData[i].cycleDayAdjust;
                this.year.moons.push(newMoon);
            }
        }
    }

    /**
     * Loads the time configuration from the settings and applies them to the current year
     * @private
     */
    private loadTimeConfiguration(){
        Logger.debug('Loading time configuration from settings.');
        const timeData = GameSettings.LoadTimeData();
        if(timeData && Object.keys(timeData).length){
            this.year.time.hoursInDay = timeData.hoursInDay;
            this.year.time.minutesInHour = timeData.minutesInHour;
            this.year.time.secondsInMinute = timeData.secondsInMinute;
            this.year.time.gameTimeRatio = timeData.gameTimeRatio;
            this.year.time.secondsPerDay = this.year.time.hoursInDay * this.year.time.minutesInHour * this.year.time.secondsInMinute;

            if(timeData.hasOwnProperty('unifyGameAndClockPause')){
                this.year.time.unifyGameAndClockPause = timeData.unifyGameAndClockPause;
            }

            if(timeData.hasOwnProperty('updateFrequency')){
                this.year.time.updateFrequency = timeData.updateFrequency;
                this.year.time.timeKeeper.updateFrequency = timeData.updateFrequency;
            }

            if(timeData.hasOwnProperty('secondsInCombatRound')){
                this.year.time.secondsInCombatRound = timeData.secondsInCombatRound;
            }
        }
    }

    /**
     * Loads the current date data from the settings and applies them to the current year
     */
    private loadCurrentDate(){
        Logger.debug('Loading current date from settings.');
        const currentDate = GameSettings.LoadCurrentDate();
        if(currentDate && Object.keys(currentDate).length){
            this.year.numericRepresentation = currentDate.year;
            this.year.selectedYear = currentDate.year;
            this.year.visibleYear = currentDate.year;

            this.year.resetMonths('current');
            this.year.resetMonths('visible');

            const month = this.year.months.find(m => m.numericRepresentation === currentDate.month);
            if(month){
                month.current = true;
                month.visible = true;
                const day = month.days.find(d => d.numericRepresentation === currentDate.day);
                if(day){
                    day.current = true;
                } else {
                    Logger.error('Save day could not be found in this month, perhaps number of days has changed. Setting current day to first day of month');
                    month.days[0].current = true;
                }
            } else {
                Logger.error('Saved month could not be found, perhaps months have changed. Setting current month to the first month');
                this.year.months[0].current = true;
                this.year.months[0].visible = true;
                this.year.months[0].days[0].current = true;
            }
            this.year.time.seconds = currentDate.seconds;
            if(this.year.time.seconds === undefined){
                this.year.time.seconds = 0;
            }
        } else if(this.year.months.length) {
            Logger.debug('No current date setting found, setting default current date.');
            this.year.months[0].current = true;
            this.year.months[0].visible = true;
            this.year.months[0].days[0].current = true;
        } else {
            Logger.error('Error setting the current date.');
        }
    }

    /**
     * Loads the notes from the game setting
     * @private
     */
    public loadNotes(update = false){
        Logger.debug('Loading notes from settings.');
        const notes = GameSettings.LoadNotes();
        this.notes = notes.map(n => {
            const note = new Note();
            note.loadFromConfig(n);
            return note;
        });
        if(update){
            SimpleCalendar.instance.updateApp();
        }
    }

    public loadNoteCategories(){
        this.noteCategories= GameSettings.LoadNoteCategories();
    }
}
