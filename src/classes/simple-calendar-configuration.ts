import {Logger} from "./logging";
import Year from "./year";
import {GameSettings} from "./game-settings";
import Month from "./month";

export class SimpleCalendarConfiguration extends FormApplication {

    /**
     * Used to store a globally accessible copy of the Simple calendar configuration class for access from event functions.
     */
    static instance: SimpleCalendarConfiguration;

    private year: Year;

    constructor(data: Year) {
        super(data);
        this.year = data;
    }

    static get defaultOptions() {
        const options = super.defaultOptions;
        options.template = "modules/foundryvtt-simple-calendar/templates/calendar-config.html";
        options.title = "FSC.Configuration.Title";
        options.classes = ["simple-calendar"];
        options.resizable = true;
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

    public getData(){
        return {
            currentYear: (<Year>this.object),
            months: (<Year>this.object).months.map(m => m.toTemplate())
        };
    }

    protected activateListeners(html: JQuery | HTMLElement) {
        if(html.hasOwnProperty("length")) {
            //Save button clicks
            (<JQuery>html).find("#scSubmit").on('click', SimpleCalendarConfiguration.instance.saveClick.bind(this));

            //Month Deletes
            (<JQuery>html).find(".remove-month").on('click', SimpleCalendarConfiguration.instance.removeMonth.bind(this));

            //Add Month
            (<JQuery>html).find(".month-add").on('click', SimpleCalendarConfiguration.instance.addMonth.bind(this));
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


            if(updateCurrentDate){
                await GameSettings.SaveCurrentDate(<Year>this.object);
            }
            this.closeApp();
        } catch (error){
            Logger.error(error);
        }
    }
}
