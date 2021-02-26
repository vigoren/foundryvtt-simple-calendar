import {Logger} from "./logging";
import Year from "./year";
import {GameSettings} from "./game-settings";
import Month from "./month";
import {Weekday} from "./weekday";
import {LeapYearRules} from "../constants";

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
     * The Calendar configuration constructor
     * @param {Year} data The year data used to populate the configuration dialog
     */
    constructor(data: Year) {
        super(data);
        this._tabs[0].active = "yearSettings";
        this.year = data;
    }

    /**
     * Returns the default options for this application
     */
    static get defaultOptions() {
        const options = super.defaultOptions;
        options.template = "modules/foundryvtt-simple-calendar/templates/calendar-config.html";
        options.title = "FSC.Configuration.Title";
        options.classes = ["simple-calendar"];
        options.resizable = true;
        options.tabs = [{navSelector: ".tabs", contentSelector: "form", initial: "yearSettings"}];
        options.height = 700;
        options.width = 650;
        return options;
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
        this.close().catch(Logger.error);
    }

    /**
     * Re renders the application window
     * @private
     */
    private updateApp(){
        this.render(false, {width: 500, height: 500});
    }

    /**
     * Gets the data object to be used by Handlebars when rending the HTML template
     */
    public getData(){
        return {
            currentYear: (<Year>this.object),
            months: (<Year>this.object).months.map(m => m.toTemplate()),
            weekdays: (<Year>this.object).weekdays.map(w => w.toTemplate()),
            leapYearRules: {none: 'FSC.Configuration.LeapYear.Rules.None', gregorian: 'FSC.Configuration.LeapYear.Rules.Gregorian', custom: 'FSC.Configuration.LeapYear.Rules.Custom'},
            leapYearRule: (<Year>this.object).leapYearRule
        };
    }

    /**
     * Adds any event listeners to the application DOM
     * @param {JQuery | HTMLElement} html The root HTML of the application window
     * @protected
     */
    protected activateListeners(html: JQuery | HTMLElement) {
        super.activateListeners(html);
        if(html.hasOwnProperty("length")) {

            //Save button clicks
            (<JQuery>html).find("#scSubmit").on('click', SimpleCalendarConfiguration.instance.saveClick.bind(this));

            //Month Deletes
            (<JQuery>html).find(".remove-month").on('click', SimpleCalendarConfiguration.instance.removeMonth.bind(this));

            //Weekday Deletes
            (<JQuery>html).find(".remove-weekday").on('click', SimpleCalendarConfiguration.instance.removeWeekday.bind(this));

            //Add Month
            (<JQuery>html).find(".month-add").on('click', SimpleCalendarConfiguration.instance.addMonth.bind(this));

            //Add Weekday
            (<JQuery>html).find(".weekday-add").on('click', SimpleCalendarConfiguration.instance.addWeekday.bind(this));

            //Input Change
            (<JQuery>html).find(".month-settings table td input").on('change', SimpleCalendarConfiguration.instance.monthInputChange.bind(this));
            (<JQuery>html).find(".weekday-settings table td input").on('change', SimpleCalendarConfiguration.instance.weekdayInputChange.bind(this));
            (<JQuery>html).find(".leapyear-settings #scNoteRepeats").on('change', SimpleCalendarConfiguration.instance.leapYearRuleChange.bind(this));
        }
    }

    /**
     * Adds a new month to the list of months in the year
     * @param {Event} e The passed in event
     */
    public addMonth(e: Event){
        e.preventDefault();
        const newMonthNumber = (<Year>this.object).months.length + 1;
        (<Year>this.object).months.push(new Month('New Month', newMonthNumber, 30));
        this.updateApp();
    }

    /**
     * Removes a month from the list of months in the year
     * @param {Event} e The passed in event
     */
    public removeMonth(e: Event){
        e.preventDefault();
        const dataIndex = (<HTMLElement>e.currentTarget).getAttribute('data-index');
        if(dataIndex && dataIndex !== 'all'){
            const monthIndex = parseInt(dataIndex);
            const months = (<Year>this.object).months;
            if(!isNaN(monthIndex) && monthIndex < months.length){
                months.splice(monthIndex, 1);
                //Reindex the remaining months
                for(let i = 0; i < months.length; i++){
                    months[i].numericRepresentation = i + 1;
                }
                this.updateApp();
            }
        } else if(dataIndex && dataIndex === 'all'){
            (<Year>this.object).months = [];
            this.updateApp();
        }
    }

    /**
     * Adds a new weekday to the list of weekdays in the year
     * @param {Event} e The passed in event
     */
    public addWeekday(e: Event) {
        e.preventDefault();
        const newWeekdayNumber = (<Year>this.object).weekdays.length + 1;
        (<Year>this.object).weekdays.push(new Weekday(newWeekdayNumber, 'New Weekday'));
        this.updateApp();
    }

    /**
     * Removes a weekday from the list of weekdays in the year
     * @param {Event} e The passed in event
     */
    public removeWeekday(e: Event) {
        e.preventDefault();
        const dataIndex = (<HTMLElement>e.currentTarget).getAttribute('data-index');
        if(dataIndex && dataIndex !== 'all'){
            const weekdayIndex = parseInt(dataIndex);
            const weekdays = (<Year>this.object).weekdays;
            if(!isNaN(weekdayIndex) && weekdayIndex < weekdays.length){
                weekdays.splice(weekdayIndex, 1);
                //Reindex the remaining months
                for(let i = 0; i < weekdays.length; i++){
                    weekdays[i].numericRepresentation = i + 1;
                }
                this.updateApp();
            }
        } else if(dataIndex && dataIndex === 'all'){
            (<Year>this.object).weekdays = [];
            this.updateApp();
        }
    }

    /**
     * Event when a text box for month name or day is changed to temporarily store those changes so that if the application is updated the correct values are displayed
     * @param {Event} e The change event
     */
    public monthInputChange(e: Event){
        e.preventDefault();
        const dataIndex = (<HTMLElement>e.currentTarget).getAttribute('data-index');
        const cssClass = (<HTMLElement>e.currentTarget).getAttribute('class');
        const value = (<HTMLInputElement>e.currentTarget).value;
        if(dataIndex && cssClass && value){
            const monthIndex = parseInt(dataIndex);
            const months = (<Year>this.object).months;
            if(!isNaN(monthIndex) && monthIndex < months.length){
                if(cssClass === 'month-name'){
                    months[monthIndex].name = value;
                } else if(cssClass === 'month-days'){
                    const days = parseInt(value);
                    if(!isNaN(days) && days !== months[monthIndex].days.length){
                        months[monthIndex].numberOfDays = days;
                    }
                } else {
                    Logger.debug(`Invalid CSS Class for input "${cssClass}"`);
                }
                return;
            }
        }
        Logger.debug('Unable to set the months data on change.');
    }

    /**
     * Event when a text box for weekday name is changed to temporarily store those changes so that if the application is updated the correct values are displayed
     * @param {Event} e The change event
     */
    public weekdayInputChange(e: Event){
        e.preventDefault();
        const dataIndex = (<HTMLElement>e.currentTarget).getAttribute('data-index');
        const value = (<HTMLInputElement>e.currentTarget).value;
        if(dataIndex && value){
            const weekdayIndex = parseInt(dataIndex);
            const weekdays = (<Year>this.object).weekdays;
            if(!isNaN(weekdayIndex) && weekdayIndex < weekdays.length){
                weekdays[weekdayIndex].name = value;
                return;
            }
        }
        Logger.debug('Unable to set the weekday data on change.');
    }

    public leapYearRuleChange(e: Event){
        e.preventDefault();
        console.log(e);
    }

    /**
     * When the save button is clicked, apply those changes to the game settings and re-load the calendars across all players
     * @param {Event} e The click event
     */
    public async saveClick(e: Event) {
        e.preventDefault();
        try{
            // Update the Year Configuration
            let updateCurrentDate = false;
            const currentYear = parseInt((<HTMLInputElement>document.getElementById("scCurrentYear")).value);
            if(!isNaN(currentYear)){
                updateCurrentDate = (<Year>this.object).numericRepresentation !== currentYear;
                (<Year>this.object).numericRepresentation = currentYear;
                (<Year>this.object).selectedYear = currentYear;
                (<Year>this.object).visibleYear = currentYear;
            }
            (<Year>this.object).prefix = (<HTMLInputElement>document.getElementById("scYearPreFix")).value;
            (<Year>this.object).postfix = (<HTMLInputElement>document.getElementById("scYearPostFix")).value;
            await GameSettings.SaveYearConfiguration(<Year>this.object);
            // Update the Month Configuration
            const monthNames = (<JQuery>this.element).find('.month-name');
            const monthDays= (<JQuery>this.element).find('.month-days');

            for(let i = 0; i < monthNames.length; i++){
                const monthIndex = monthNames[i].getAttribute('data-index');
                if(monthIndex){
                    const index = parseInt(monthIndex);
                    const month = (<Year>this.object).months[index];
                    month.name = (<HTMLInputElement>monthNames[i]).value;
                    const days = parseInt((<HTMLInputElement>monthDays[i]).value);
                    if(!isNaN(days) && month.days.length !== days){
                        Logger.debug(`Days for month ${month.name} are different, rebuilding month days`);
                        const monthCurrentDay = month.getCurrentDay();
                        month.days = [];
                        let currentDay = null;
                        if(monthCurrentDay){
                            if(monthCurrentDay.numericRepresentation >= days){
                                Logger.debug('The current day falls outside of the months news days, setting to first day of the month.');
                                currentDay = 0;
                            } else {
                                currentDay = monthCurrentDay.numericRepresentation;
                            }
                        }
                        month.populateDays(days, currentDay);
                    }
                }
            }
            await GameSettings.SaveMonthConfiguration((<Year>this.object).months);
            //Update Weekday Configuration
            const weekdayNames = (<JQuery>this.element).find('.weekday-name');
            for(let i = 0; i < weekdayNames.length; i++){
                const weekdayIndex = weekdayNames[i].getAttribute('data-index');
                if(weekdayIndex) {
                    const index = parseInt(weekdayIndex);
                    const weekday = (<Year>this.object).weekdays[index];
                    weekday.name = (<HTMLInputElement>weekdayNames[i]).value;
                }
            }
            await GameSettings.SaveWeekdayConfiguration((<Year>this.object).weekdays);
            if(updateCurrentDate){
                await GameSettings.SaveCurrentDate(<Year>this.object);
            }
            this.closeApp();
        } catch (error){
            Logger.error(error);
        }
    }
}
