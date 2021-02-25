import {Logger} from "./logging";
import Year from "./year";
import Month from "./month";
import {Note} from "./note";
import {CalendarTemplate, NoteTemplate} from "../interfaces";
import {SimpleCalendarConfiguration} from "./simple-calendar-configuration";
import {GameSettings} from "./game-settings";
import {Weekday} from "./weekday";
import {SimpleCalendarNotes} from "./simple-calendar-notes";
import HandlebarsHelpers from "./handlebars-helpers";


/**
 * Contains all functionality for displaying/updating the simple calendar
 */
export default class SimpleCalendar extends Application{

    /**
     * Used to store a globally accessible copy of the Simple calendar class for access from event functions.
     */
    static instance: SimpleCalendar;

    /**
     * The current year the user is viewing
     * @type {Year | null}
     */
    public currentYear: Year | null = null;

    public notes: Note[] = []

    /**
     * Simple Calendar constructor
     */
    constructor() {super();}

    /**
     * Returns the default options for this application
     */
    static get defaultOptions() {
        const options = super.defaultOptions;
        options.template = "modules/foundryvtt-simple-calendar/templates/calendar.html";
        options.title = "FSC.Title";
        options.classes = ["simple-calendar"];
        options.resizable = true;
        return options;
    }

    /**
     * Initializes the dialogs once foundry is ready to go
     */
    public init(){
        HandlebarsHelpers.Register();
        GameSettings.RegisterSettings();
        this.settingUpdate();
    }

    /**
     * Gets the data object to be used by Handlebars when rending the HTML template
     */
    public getData(): CalendarTemplate | undefined {
        if(this.currentYear){
            const currentMonth = this.currentYear.getCurrentMonth();
            const selectedMonth = this.currentYear.getSelectedMonth();
            return {
                isGM: GameSettings.IsGm(),
                currentYear: this.currentYear.toTemplate(),
                currentMonth: currentMonth?.toTemplate(),
                currentDay: currentMonth?.getCurrentDay()?.toTemplate(),
                selectedYear: this.currentYear.selectedYear,
                selectedMonth: selectedMonth?.toTemplate(),
                selectedDay : selectedMonth?.getSelectedDay(),
                visibleYear: this.currentYear.visibleYear,
                visibleMonth: this.currentYear.getVisibleMonth()?.toTemplate(),
                visibleMonthStartWeekday: Array(this.currentYear.visibleMonthStartingDayOfWeek()).fill(0),
                showSelectedDay: this.currentYear.visibleYear === this.currentYear.selectedYear,
                showCurrentDay: this.currentYear.visibleYear === this.currentYear.numericRepresentation,
                notes: this.getNotesForDay()
            };
        } else {
            return;
        }
    }

    /**
     * Adds the calendar button to the token button list
     * @param controls
     */
    public getSceneControlButtons(controls: any[]){
        let tokenControls = controls.find(c => c.name === "token" );
        if(tokenControls && tokenControls.hasOwnProperty('tools')){
            tokenControls.tools.push({
                name: "calendar",
                title: "FSC.ButtonTitle",
                icon: "fas fa-calendar",
                button: true,
                onClick: SimpleCalendar.instance.showApp.bind(SimpleCalendar.instance)
            });
        }
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
     * Adds any event listeners to the application DOM
     * @param {JQuery | HTMLElement} html The root HTML of the application window
     * @protected
     */
    protected activateListeners(html: JQuery | HTMLElement) {
        if(html.hasOwnProperty("length")) {
            // Change the month that is being viewed
            const nextPrev = (<JQuery>html).find(".current-date .fa");
            for (let i = 0; i < nextPrev.length; i++) {
                if (nextPrev[i].classList.contains('fa-chevron-left')) {
                    nextPrev[i].addEventListener('click', SimpleCalendar.instance.viewPreviousMonth.bind(this));
                } else if (nextPrev[i].classList.contains('fa-chevron-right')) {
                    nextPrev[i].addEventListener('click', SimpleCalendar.instance.viewNextMonth.bind(this));
                }
            }
            // Listener for when a day is clicked
            (<JQuery>html).find(".calendar .days .day").on('click', SimpleCalendar.instance.dayClick.bind(this));

            // Today button click
            (<JQuery>html).find(".calendar-controls .today").on('click', SimpleCalendar.instance.todayClick.bind(this));

            // When the GM Date controls are clicked
            (<JQuery>html).find(".controls .control").on('click', SimpleCalendar.instance.gmControlClick.bind(this));
            (<JQuery>html).find(".controls .btn-apply").on('click', SimpleCalendar.instance.dateControlApply.bind(this));

            //Configuration Button Click
            (<JQuery>html).find(".calendar-controls .configure-button").on('click', SimpleCalendar.instance.configurationClick.bind(this));

            // Add new note click
            (<JQuery>html).find(".date-notes .add-note").on('click', SimpleCalendar.instance.addNote.bind(this));

            // Note Click
            (<JQuery>html).find(".date-notes .note").on('click', SimpleCalendar.instance.viewNote.bind(this));
        }
    }

    /**
     * Click Event to change the month the user is currently viewing to the previous
     * @param {Event} e The click event
     */
    public viewPreviousMonth(e: Event){
        Logger.debug('Changing view to previous month');
        e.stopPropagation()
        if(this.currentYear){
            this.currentYear.changeMonth(false);
            this.updateApp();
        }
    }

    /**
     * Click Event to change the month the user is currently viewing to the next
     * @param {Event} e The click event
     */
    public viewNextMonth(e: Event){
        Logger.debug('Changing view to next month');
        e.stopPropagation()
        if(this.currentYear){
            this.currentYear.changeMonth(true);
            this.updateApp();
        }
    }

    /**
     * Click event when a users clicks on a day
     * @param {Event} e The click event
     */
    public dayClick(e: Event){
        Logger.debug('Day Clicked');
        e.stopPropagation();
        const target = <HTMLElement>e.target;
        const dataDate = target.getAttribute('data-day');
        if(dataDate){
            const index = parseInt(dataDate) - 1;
            if(this.currentYear && index > -1){
                const currentSelectedMonth = this.currentYear.getSelectedMonth();
                const currentSelectedDay = currentSelectedMonth?.getSelectedDay();
                if(currentSelectedMonth){
                    currentSelectedMonth.selected = false;
                }
                if(currentSelectedDay){
                    currentSelectedDay.selected = false;
                }
                const visibleMonth = this.currentYear.getVisibleMonth();
                if(visibleMonth && visibleMonth.days.length > index){
                    visibleMonth.selected = true;
                    visibleMonth.days[index].selected = true;
                    this.currentYear.selectedYear = this.currentYear.visibleYear;
                }
                this.updateApp();
            } else {
                Logger.error('Day has invalid data attribute or no current year is set!');
            }
        } else {
            Logger.error('Day is missing data attribute!');
        }
    }

    /**
     * Click event when a user clicks on the Today button
     * @param {Event} e The click event
     */
    public todayClick(e: Event) {
        e.preventDefault();
        if(this.currentYear){
            const selectedMonth = this.currentYear.getSelectedMonth();
            if(selectedMonth){
                selectedMonth.selected = false;
                const selectedDay = selectedMonth.getSelectedDay();
                if(selectedDay){
                    selectedDay.selected = false;
                }
            }
            const visibleMonth = this.currentYear.getVisibleMonth();
            if(visibleMonth){
                visibleMonth.visible = false;
            }
            const currentMonth = this.currentYear.getCurrentMonth();
            if(currentMonth){
                const currentDay = currentMonth.getCurrentDay();
                if(currentDay){
                    this.currentYear.selectedYear = this.currentYear.numericRepresentation;
                    this.currentYear.visibleYear = this.currentYear.numericRepresentation;
                    currentMonth.visible = true;
                    currentMonth.selected = true;
                    currentDay.selected = true;
                    this.updateApp();
                }
            }
        }
    }

    /**
     * Click event when a gm user clicks on any of the next/back buttons for day/month/year
     * @param {Event} e The click event
     */
    public gmControlClick(e: Event){
        e.stopPropagation();
        const target = <HTMLElement>e.currentTarget;
        const dataType = target.getAttribute('data-type');
        const isNext = target.classList.contains('next');

        switch (dataType){
            case 'day':
                Logger.debug(`${isNext? 'Forward' : 'Back'} Day Clicked`);
                this.currentYear?.changeDay(isNext, 'current');
                this.updateApp();
                break;
            case 'month':
                Logger.debug(`${isNext? 'Forward' : 'Back'} Month Clicked`);
                this.currentYear?.changeMonth(isNext, 'current');
                this.updateApp();
                break;
            case 'year':
                Logger.debug(`${isNext? 'Forward' : 'Back'} Year Clicked`);
                this.currentYear?.changeYear(isNext? 1 : -1, false, "current");
                this.updateApp();
                break;
        }

    }

    /**
     * Click event for when a gm user clicks on the apply button for the current date controls
     * Will attempt to save the new current date to the world settings.
     * @param {Event} e The click event
     */
    public dateControlApply(e: Event){
        e.stopPropagation();
        if(GameSettings.IsGm()){
            if(this.currentYear) {
                GameSettings.SaveCurrentDate(this.currentYear).catch(Logger.error);
            }
        } else {
            GameSettings.UiNotification(GameSettings.Localize("FSC.Error.Calendar.GMCurrent"), 'warn');
        }
    }

    /**
     * Click event for when a gm user clicks on the configuration button to configure the game calendar
     * @param {Event} e The click event
     */
    public configurationClick(e: Event) {
        e.stopPropagation();
        if(GameSettings.IsGm()){
            if(this.currentYear){
                SimpleCalendarConfiguration.instance = new SimpleCalendarConfiguration(this.currentYear.clone());
                SimpleCalendarConfiguration.instance.showApp();
            } else {
                Logger.error('The Current year is not configured.');
            }
        } else {
            GameSettings.UiNotification(GameSettings.Localize("FSC.Error.Calendar.GMConfigure"), 'warn');
        }
    }

    /**
     * Opens up the note adding dialog
     * @param {Event} e The click event
     */
    public addNote(e: Event) {
        e.stopPropagation();
        if(this.currentYear){
            const currentMonth = this.currentYear.getSelectedMonth() || this.currentYear.getCurrentMonth();
            if(currentMonth){
                const currentDay = currentMonth.getSelectedDay() || currentMonth.getCurrentDay();
                if(currentDay){
                    const year = this.currentYear.selectedYear || this.currentYear.numericRepresentation;
                    const month = currentMonth.numericRepresentation;
                    const day = currentDay.numericRepresentation;
                    const newNote = new Note();
                    newNote.year = year;
                    newNote.month = month;
                    newNote.day = day;
                    newNote.monthDisplay = currentMonth.name;
                    newNote.title = 'New Note';
                    newNote.author = GameSettings.UserName();
                    SimpleCalendarNotes.instance = new SimpleCalendarNotes(newNote);
                    SimpleCalendarNotes.instance.showApp();
                } else {
                    GameSettings.UiNotification(GameSettings.Localize("FSC.Error.Note.NoSelectedDay"), 'warn');
                }
            } else {
                GameSettings.UiNotification(GameSettings.Localize("FSC.Error.Note.NoSelectedMonth"), 'warn');
            }
        } else {
            Logger.error('The Current year is not configured.');
        }
    }

    /**
     * Opens up a note to view the contents
     * @param {Event} e The click event
     */
    public viewNote(e: Event){
        e.stopPropagation();
        const dataIndex = (<HTMLElement>e.currentTarget).getAttribute('data-index');
        if(dataIndex){
            const note = this.notes.find(n=> n.id === dataIndex);
            if(note){
                SimpleCalendarNotes.instance = new SimpleCalendarNotes(note, true);
                SimpleCalendarNotes.instance.showApp();
            }
        } else {
            Logger.error('No Data index on note element found.');
        }
    }

    /**
     * Re renders the application window
     * @private
     */
    private updateApp(){
        if(this.rendered){
            this.render(false, {width: 500, height: 500});
        }
    }

    /**
     * Called when a setting is updated, refreshes the configurations for all types
     * @param {boolean} [update=false] If to update the display
     */
    public settingUpdate(update: boolean = false){
        this.loadYearConfiguration();
        this.loadMonthConfiguration();
        this.loadWeekdayConfiguration();
        this.loadCurrentDate();
        this.loadNotes();
        if(update) {
            this.updateApp();
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
            if(!this.currentYear){
                this.currentYear = new Year(yearData.numericRepresentation);
            } else {
                this.currentYear.numericRepresentation = yearData.numericRepresentation;
            }
            this.currentYear.prefix = yearData.prefix;
            this.currentYear.postfix = yearData.postfix;
        } else {
            Logger.debug('No year configuration found, setting default year data.');
            this.currentYear = new Year(new Date().getFullYear());
        }
    }

    /**
     * Loads the month configuration data from the settings and applies them to the current year
     */
    private loadMonthConfiguration(){
        Logger.debug('Loading month configuration from settings.');

        const date = new Date();
        const dYear = date.getFullYear();
        if(this.currentYear){
            const monthData = GameSettings.LoadMonthData();
            if(monthData.length){
                this.currentYear.months = [];
                Logger.debug('Setting the months from data.');
                for(let i = 0; i < monthData.length; i++){
                    if(Object.keys(monthData[i]).length){
                        this.currentYear.months.push(new Month(monthData[i].name, monthData[i].numericRepresentation, monthData[i].numberOfDays));
                    }
                }
            }
            if(this.currentYear.months.length === 0) {
                Logger.debug('No month configuration found, setting default month data.');
                this.currentYear.months = [
                    new Month(GameSettings.Localize("FSC.Date.January"), 1, 31),
                    new Month(GameSettings.Localize("FSC.Date.February"), 2, (((dYear % 4 == 0) && (dYear % 100 != 0)) || (dYear % 400 == 0))? 29 : 28),
                    new Month(GameSettings.Localize("FSC.Date.March"),3, 31),
                    new Month(GameSettings.Localize("FSC.Date.April"),4, 30),
                    new Month(GameSettings.Localize("FSC.Date.May"),5, 31),
                    new Month(GameSettings.Localize("FSC.Date.June"),6, 30),
                    new Month(GameSettings.Localize("FSC.Date.July"),7, 31),
                    new Month(GameSettings.Localize("FSC.Date.August"),8, 31),
                    new Month(GameSettings.Localize("FSC.Date.September"),9, 30),
                    new Month(GameSettings.Localize("FSC.Date.October"), 10, 31),
                    new Month(GameSettings.Localize("FSC.Date.November"), 11, 30),
                    new Month(GameSettings.Localize("FSC.Date.December"), 12, 31),
                ];
            }
        } else {
            Logger.error('No Current year configured, can not load month data.');
        }
    }

    /**
     * Loads the weekday configuration data from the settings and applies them to the current year
     */
    private loadWeekdayConfiguration(){
        Logger.debug('Loading weekday configuration from settings.');
        if(this.currentYear){
            const weekdayData = GameSettings.LoadWeekdayData();
            if(weekdayData.length){
                Logger.debug('Setting the weekdays from data.');
                this.currentYear.weekdays = [];
                for(let i = 0; i < weekdayData.length; i++){
                    this.currentYear.weekdays.push(new Weekday(weekdayData[i].numericRepresentation, weekdayData[i].name));
                }
            } else {
                Logger.debug('No weekday configuration found, loading default data.');
                this.currentYear.weekdays = [
                    new Weekday(1, GameSettings.Localize('FSC.Date.Sunday')),
                    new Weekday(2, GameSettings.Localize('FSC.Date.Monday')),
                    new Weekday(3, GameSettings.Localize('FSC.Date.Tuesday')),
                    new Weekday(4, GameSettings.Localize('FSC.Date.Wednesday')),
                    new Weekday(5, GameSettings.Localize('FSC.Date.Thursday')),
                    new Weekday(6, GameSettings.Localize('FSC.Date.Friday')),
                    new Weekday(7, GameSettings.Localize('FSC.Date.Saturday'))
                ];
            }
        } else {
            Logger.error('No Current year configured, can not load weekday data.');
        }
    }

    /**
     * Loads the current date data from the settings and applies them to the current year
     */
    private loadCurrentDate(){
        Logger.debug('Loading current date from settings.');
        const currentDate = GameSettings.LoadCurrentDate();
        if(this.currentYear && currentDate && Object.keys(currentDate).length){
            Logger.debug('Loading current date data from settings.');
            this.currentYear.numericRepresentation = currentDate.year;
            this.currentYear.visibleYear = currentDate.year;
            this.currentYear.selectedYear = currentDate.year;
            const month = this.currentYear.months.find(m => m.numericRepresentation === currentDate.month);
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
                this.currentYear.months[0].current = true;
                this.currentYear.months[0].visible = true;
                this.currentYear.months[0].days[0].current = true;
            }
        } else if(this.currentYear && this.currentYear.months.length) {
            Logger.debug('No current date setting found, setting default current date.');
            this.currentYear.months[0].current = true;
            this.currentYear.months[0].visible = true;
            this.currentYear.months[0].days[0].current = true;
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
            this.updateApp();
        }
    }

    /**
     * Gets all of the notes associated with the selected or current day
     * @private
     * @return NoteTemplate[]
     */
    private getNotesForDay(): NoteTemplate[] {
        const dayNotes: NoteTemplate[] = [];
        if(this.currentYear){
            const year = this.currentYear.selectedYear || this.currentYear.numericRepresentation;
            const month = this.currentYear.getSelectedMonth() || this.currentYear.getCurrentMonth();
            if(month){
                const day = month.getSelectedDay() || month.getCurrentDay();
                if(day){
                    this.notes.forEach((note) => {
                        if(note.isVisible(year, month.numericRepresentation, day.numericRepresentation)){
                            dayNotes.push(note.toTemplate());
                        }
                    });
                }
            }
        }
        return dayNotes;
    }

}
