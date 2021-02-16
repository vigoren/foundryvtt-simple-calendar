import {Logger} from "./logging";
import Year from "./year";
import Month from "./month";
import {CalendarTemplate, YearConfig, MonthConfig, CurrentDateConfig} from "../interfaces";
import { ModuleName, SettingNames} from "../constants";
import {SimpleCalendarConfiguration} from "./simple-calendar-configuration";
import {GameSettings} from "./game-settings";


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
     * @private
     */
    private currentYear: Year | null = null;

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
        GameSettings.RegisterSettings();
        this.loadYearConfiguration();
        this.loadMonthConfiguration();
        this.loadCurrentDate();
        this.loadNotes();
    }

    /**
     * Gets the data object to be used by Handlebars when rending the HTML template
     */
    public getData(): CalendarTemplate | undefined {
        if(this.currentYear){
            const currentMonth = this.currentYear.getCurrentMonth();
            const selectedMonth = this.currentYear.getSelectedMonth();
            return {
                isGM: game.user.isGM,
                playersAddNotes: game.settings.get(ModuleName, SettingNames.AllowPlayersToAddNotes),
                currentYear: this.currentYear.toTemplate(),
                currentMonth: currentMonth?.toTemplate(),
                currentDay: currentMonth?.getCurrentDay()?.toTemplate(),
                selectedYear: this.currentYear.selectedYear,
                selectedMonth: selectedMonth?.toTemplate(),
                selectedDay : selectedMonth?.getSelectedDay(),
                visibleYear: this.currentYear.visibleYear,
                visibleMonth: this.currentYear.getVisibleMonth()?.toTemplate(),
                showSelectedDay: this.currentYear.visibleYear === this.currentYear.selectedYear,
                showCurrentDay: this.currentYear.visibleYear === this.currentYear.numericRepresentation
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
                onClick: () => {SimpleCalendar.instance.showApp();}
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
            const days = (<JQuery>html).find(".calendar .days .day");
            days.on('click', SimpleCalendar.instance.dayClick.bind(this));

            // Today button click
            const todayButton = (<JQuery>html).find(".calendar-controls .today");
            todayButton.on('click', SimpleCalendar.instance.todayClick.bind(this));

            // When the GM Date controls are clicked
            const controls = (<JQuery>html).find(".controls .control");
            controls.on('click', SimpleCalendar.instance.gmControlClick.bind(this));
            const applyButton = (<JQuery>html).find(".controls .btn-apply");
            applyButton.on('click', SimpleCalendar.instance.dateControlApply.bind(this));

            //Configuration Button Click
            const configurationButton = (<JQuery>html).find(".calendar-controls .configure-button");
            configurationButton.on('click', SimpleCalendar.instance.configurationClick.bind(this));
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
                    this.currentYear.selectedYear = this.currentYear.numericRepresentation;
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
            const currentMonth = this.currentYear.getCurrentMonth();
            if(currentMonth){
                const currentDay = currentMonth.getCurrentDay();
                if(currentDay){
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
     * @param {Event} e
     */
    public dateControlApply(e: Event){
        e.stopPropagation();
        if(this.currentYear) {
            GameSettings.SaveCurrentDate(this.currentYear).catch(Logger.error);
        }
    }

    /**
     * Click event for when a gm user clicks on the configuration button to configure the game calendar
     * @param {Event} e
     */
    public configurationClick(e: Event) {
        e.stopPropagation();
        if(this.currentYear){
            SimpleCalendarConfiguration.instance = new SimpleCalendarConfiguration(this.currentYear.clone());
            SimpleCalendarConfiguration.instance.showApp();
        } else {
            Logger.error('The Current year is not configured.');
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
     * Loads the year configuration data from the settings and applies them to the current year
     * @param {boolean} [update=false] If to also update the page rendering
     */
    public loadYearConfiguration(update: boolean = false){
        try{
            Logger.debug('Loading year configuration from settings.');

            const yearData = <YearConfig>game.settings.get(ModuleName, SettingNames.YearConfiguration);
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
            if(update){
                this.updateApp();
            }
        } catch (e){
            Logger.error(e);
        }
    }

    /**
     * Loads the month configuration data from the settings and applies them to the current year
     * @param {boolean} [update=false] If to also update the page rendering
     */
    public loadMonthConfiguration(update: boolean = false){
        try{
            Logger.debug('Loading month configuration from settings.');
            let monthData = <any[]>game.settings.get(ModuleName, SettingNames.MonthConfiguration);
            const date = new Date();
            const dYear = date.getFullYear();
            if(this.currentYear){
                if(monthData && monthData.length){
                    if(Array.isArray(monthData[0])){
                        monthData = <MonthConfig[]>monthData[0];
                    }
                    this.currentYear.months = [];
                    if(monthData.length){
                        Logger.debug('Setting the months from data.');
                        for(let i = 0; i < monthData.length; i++){
                            if(Object.keys(monthData[i]).length){
                                this.currentYear.months.push(new Month(monthData[i].name, monthData[i].numericRepresentation, monthData[i].numberOfDays));
                            }
                        }
                        this.loadCurrentDate(true);
                    }
                }
                if(this.currentYear.months.length === 0) {
                    Logger.debug('No month configuration found, setting default month data.');
                    this.currentYear.months = [
                        new Month(game.i18n.localize("FSC.Date.January"), 1, 31),
                        new Month(game.i18n.localize("FSC.Date.February"), 2, (((dYear % 4 == 0) && (dYear % 100 != 0)) || (dYear % 400 == 0))? 29 : 28),
                        new Month(game.i18n.localize("FSC.Date.March"),3, 31),
                        new Month(game.i18n.localize("FSC.Date.April"),4, 30),
                        new Month(game.i18n.localize("FSC.Date.May"),5, 31),
                        new Month(game.i18n.localize("FSC.Date.June"),6, 30),
                        new Month(game.i18n.localize("FSC.Date.July"),7, 31),
                        new Month(game.i18n.localize("FSC.Date.August"),8, 31),
                        new Month(game.i18n.localize("FSC.Date.September"),9, 30),
                        new Month(game.i18n.localize("FSC.Date.October"), 10, 31),
                        new Month(game.i18n.localize("FSC.Date.November"), 11, 30),
                        new Month(game.i18n.localize("FSC.Date.December"), 12, 31),
                    ];
                }
            } else {
                Logger.error('No Current year configured, can not load month data.');
            }

            if(update){
                this.updateApp();
            }
        } catch (e){
            Logger.error(e);
        }
    }

    /**
     * Loads the current date data from the settings and applies them to the current year
     * @param {boolean} [update=false] If to also update the page rendering
     */
    public loadCurrentDate(update: boolean = false){
        try{
            Logger.debug('Loading current date from settings.');
            const currentDate = <CurrentDateConfig> game.settings.get(ModuleName,  SettingNames.CurrentDate);
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

            if(update){
                this.updateApp();
            }
        } catch (e){
            Logger.error(e);
        }
    }

    public loadNotes(update: boolean = false){
        try{
            Logger.debug('Loading notes from settings.');
            const notes = game.settings.get(ModuleName, SettingNames.Notes);

            if(update){
                this.updateApp();
            }
        } catch (e){
            Logger.error(e);
        }
    }

}
