import {Logger} from "./logging";
import Year from "./year";
import {GameSettings} from "./game-settings";
import Month from "./month";
import {Weekday} from "./weekday";
import {LeapYearRules} from "../constants";
import SimpleCalendar from "./simple-calendar";

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

    private yearChanged = false;

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
        options.width = 710;
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
            leapYearRule: (<Year>this.object).leapYearRule,
            showLeapYearCustomMod: (<Year>this.object).leapYearRule.rule === LeapYearRules.Custom,
            showLeapYearMonths: (<Year>this.object).leapYearRule.rule !== LeapYearRules.None,
            predefined: {
                gregorian: 'FSC.Configuration.LeapYear.Rules.Gregorian',
                eberron: 'Eberron',
                exandrian: 'Exandrian',
                golarian : 'Golarian',
                greyhawk: 'Greyhawk',
                harptos: 'Harptos',
                warhammer: "Warhammer"
            }
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

            //Predefined calendar apply
            (<JQuery>html).find("#scApplyPredefined").on('click', SimpleCalendarConfiguration.instance.predefinedApply.bind(this));

            //Month Deletes
            (<JQuery>html).find(".remove-month").on('click', SimpleCalendarConfiguration.instance.removeMonth.bind(this));

            //Weekday Deletes
            (<JQuery>html).find(".remove-weekday").on('click', SimpleCalendarConfiguration.instance.removeWeekday.bind(this));

            //Add Month
            (<JQuery>html).find(".month-add").on('click', SimpleCalendarConfiguration.instance.addMonth.bind(this));

            //Add Weekday
            (<JQuery>html).find(".weekday-add").on('click', SimpleCalendarConfiguration.instance.addWeekday.bind(this));

            //Input Change
            (<JQuery>html).find(".year-settings input").on('change', SimpleCalendarConfiguration.instance.yearInputChange.bind(this));
            (<JQuery>html).find(".month-settings .f-table .row div input").on('change', SimpleCalendarConfiguration.instance.monthInputChange.bind(this));
            (<JQuery>html).find(".weekday-settings #scShowWeekdayHeaders").on('change', SimpleCalendarConfiguration.instance.showWeekdayInputChange.bind(this));
            (<JQuery>html).find(".weekday-settings table td input").on('change', SimpleCalendarConfiguration.instance.weekdayInputChange.bind(this));
            (<JQuery>html).find(".leapyear-settings #scLeapYearRule").on('change', SimpleCalendarConfiguration.instance.leapYearRuleChange.bind(this));
            (<JQuery>html).find(".leapyear-settings table td input").on('change', SimpleCalendarConfiguration.instance.leapYearMonthChange.bind(this));
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
     * Adds a new month to the list of months in the year
     * @param {Event} e The passed in event
     */
    public addMonth(e: Event){
        e.preventDefault();
        const newMonthNumber = (<Year>this.object).months.length + 1;
        (<Year>this.object).months.push(new Month('New Month', newMonthNumber, 30));
        this.rebaseMonthNumbers();
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
                this.rebaseMonthNumbers();
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
     * When the Apply button for the predefined calendar is clicked, show a dialog to confirm their actions
     * @param {Event} e The event that triggered this
     */
    public predefinedApply(e: Event){
        e.preventDefault();
        const dialog = new Dialog({
            title: GameSettings.Localize('FSC.OverwriteConfirm'),
            content: GameSettings.Localize("FSC.OverwriteConfirmText"),
            buttons:{
                yes: {
                    icon: '<i class="fas fa-check"></i>',
                    label: GameSettings.Localize('FSC.Apply'),
                    callback: SimpleCalendarConfiguration.instance.predefinedApplyConfirm.bind(this)
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
     * When the GM confirms using a predefined calendar
     */
    public predefinedApplyConfirm() {
        const selectedPredefined = (<HTMLInputElement>document.getElementById("scPreDefined")).value;
        Logger.debug(`Overwriting the existing calendar configuration with the "${selectedPredefined}" configuration`);
        switch (selectedPredefined){
            case 'gregorian':
                const currentDate = new Date();
                (<Year>this.object).numericRepresentation = currentDate.getFullYear();
                (<Year>this.object).prefix = '';
                (<Year>this.object).postfix = '';
                (<Year>this.object).months = [
                    new Month(GameSettings.Localize("FSC.Date.January"), 1, 31),
                    new Month(GameSettings.Localize("FSC.Date.February"), 2, 28, 29),
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
                (<Year>this.object).showWeekdayHeadings = true;
                (<Year>this.object).weekdays = [
                    new Weekday(1, GameSettings.Localize('FSC.Date.Sunday')),
                    new Weekday(2, GameSettings.Localize('FSC.Date.Monday')),
                    new Weekday(3, GameSettings.Localize('FSC.Date.Tuesday')),
                    new Weekday(4, GameSettings.Localize('FSC.Date.Wednesday')),
                    new Weekday(5, GameSettings.Localize('FSC.Date.Thursday')),
                    new Weekday(6, GameSettings.Localize('FSC.Date.Friday')),
                    new Weekday(7, GameSettings.Localize('FSC.Date.Saturday'))
                ];
                (<Year>this.object).leapYearRule.rule = LeapYearRules.Gregorian;
                (<Year>this.object).leapYearRule.customMod = 0;
                (<Year>this.object).months[currentDate.getMonth()].current = true;
                (<Year>this.object).months[currentDate.getMonth()].days[currentDate.getDate()-1].current = true;
                break;
            case 'eberron':
                (<Year>this.object).numericRepresentation = 998;
                (<Year>this.object).prefix = '';
                (<Year>this.object).postfix = ' YK';
                (<Year>this.object).months = [
                    new Month('Zarantyr', 1, 28),
                    new Month('Olarune', 2, 28),
                    new Month('Therendor', 3, 28),
                    new Month('Eyre', 4, 28),
                    new Month('Dravago', 5, 28),
                    new Month('Nymm', 6, 28),
                    new Month('Lharvion', 7, 28),
                    new Month('Barrakas', 8, 28),
                    new Month('Rhaan', 9, 28),
                    new Month('Sypheros', 10, 28),
                    new Month('Aryth', 11, 28),
                    new Month('Vult', 12, 28)
                ];
                (<Year>this.object).showWeekdayHeadings = true;
                (<Year>this.object).weekdays = [
                    new Weekday(1, 'Sul'),
                    new Weekday(2, 'Mol'),
                    new Weekday(3, 'Zol'),
                    new Weekday(4, 'Wir'),
                    new Weekday(5, 'Zor'),
                    new Weekday(6, 'Far'),
                    new Weekday(7, 'Sar')
                ];
                (<Year>this.object).leapYearRule.rule = LeapYearRules.None;
                (<Year>this.object).leapYearRule.customMod = 0;
                (<Year>this.object).months[0].current = true;
                (<Year>this.object).months[0].days[0].current = true;
                break;
            case 'exandrian':
                (<Year>this.object).numericRepresentation = 812;
                (<Year>this.object).prefix = '';
                (<Year>this.object).postfix = ' P.D.';
                (<Year>this.object).months = [
                    new Month('Horisal', 1, 29),
                    new Month('Misuthar', 2, 30),
                    new Month('Dualahei', 3, 30),
                    new Month('Thunsheer', 4, 31),
                    new Month('Unndilar', 5, 28),
                    new Month('Brussendar', 6, 31),
                    new Month('Sydenstar', 7, 32),
                    new Month('Fessuran', 8, 29),
                    new Month('Quen\'pillar', 9, 27),
                    new Month('Cuersaar', 10, 29),
                    new Month('Duscar', 11, 32)
                ];
                (<Year>this.object).showWeekdayHeadings = true;
                (<Year>this.object).weekdays = [
                    new Weekday(1, 'Grissen'),
                    new Weekday(2, 'Whelsen'),
                    new Weekday(3, 'Conthsen'),
                    new Weekday(4, 'Folsen'),
                    new Weekday(5, 'Yulisen'),
                    new Weekday(6, 'Da\'leysen')
                ];
                (<Year>this.object).leapYearRule.rule = LeapYearRules.None;
                (<Year>this.object).leapYearRule.customMod = 0;
                (<Year>this.object).months[0].current = true;
                (<Year>this.object).months[0].days[0].current = true;
                break;
            case 'golarian':
                (<Year>this.object).numericRepresentation = 4710;
                (<Year>this.object).prefix = '';
                (<Year>this.object).postfix = ' AR';
                (<Year>this.object).months = [
                    new Month('Abadius', 1, 31),
                    new Month('Calistril', 2, 28, 29),
                    new Month('Pharast', 3, 31),
                    new Month('Gozran', 4, 30),
                    new Month('Desnus', 5, 31),
                    new Month('Sarenith', 6, 30),
                    new Month('Erastus', 7, 31),
                    new Month('Arodus', 8, 31),
                    new Month('Rova', 9, 30),
                    new Month('Lamashan', 10, 31),
                    new Month('Neth', 11, 30),
                    new Month('Kuthona', 12, 31)
                ];
                (<Year>this.object).showWeekdayHeadings = true;
                (<Year>this.object).weekdays = [
                    new Weekday(1, 'Moonday'),
                    new Weekday(2, 'Toilday'),
                    new Weekday(3, 'Wealday'),
                    new Weekday(4, 'Oathday'),
                    new Weekday(5, 'Fireday'),
                    new Weekday(6, 'Starday'),
                    new Weekday(7, 'Sunday')
                ];
                (<Year>this.object).leapYearRule.rule = LeapYearRules.Custom;
                (<Year>this.object).leapYearRule.customMod = 8;
                (<Year>this.object).months[0].current = true;
                (<Year>this.object).months[0].days[0].current = true;
                break;
            case 'greyhawk':
                (<Year>this.object).numericRepresentation = 591 ;
                (<Year>this.object).prefix = '';
                (<Year>this.object).postfix = ' cy';
                (<Year>this.object).months = [
                    new Month('Needfest', -1, 7),
                    new Month('Fireseek', 1, 28),
                    new Month('Readying', 2, 28),
                    new Month('Coldeven', 3, 28),
                    new Month('Growfest', -2, 7),
                    new Month('Planting', 4, 28),
                    new Month('Flocktime', 5, 28),
                    new Month('Wealsun', 6, 28),
                    new Month('Richfest', -3, 7),
                    new Month('Reaping', 7, 28),
                    new Month('Goodmonth', 8, 28),
                    new Month('Harvester', 9, 28),
                    new Month('Brewfest', -4, 7),
                    new Month('Patchwall', 10, 28),
                    new Month('Ready\'reat', 11, 28),
                    new Month('Sunsebb', 12, 28),
                ];
                (<Year>this.object).months[0].intercalary = true;
                (<Year>this.object).months[4].intercalary = true;
                (<Year>this.object).months[8].intercalary = true;
                (<Year>this.object).months[12].intercalary = true;
                (<Year>this.object).showWeekdayHeadings = true;
                (<Year>this.object).weekdays = [
                    new Weekday(1, 'Starday'),
                    new Weekday(2, 'Sunday'),
                    new Weekday(3, 'Moonday'),
                    new Weekday(4, 'Godsday'),
                    new Weekday(5, 'Waterday'),
                    new Weekday(6, 'Earthday'),
                    new Weekday(7, 'Freeday')
                ];
                (<Year>this.object).leapYearRule.rule = LeapYearRules.None;
                (<Year>this.object).leapYearRule.customMod = 0;
                (<Year>this.object).months[0].current = true;
                (<Year>this.object).months[0].days[0].current = true;
                break;
            case 'harptos':
                (<Year>this.object).numericRepresentation = 1495;
                (<Year>this.object).prefix = '';
                (<Year>this.object).postfix = ' DR';
                (<Year>this.object).months = [
                    new Month('Hammer', 1, 30),
                    new Month('Midwinter', -1, 1),
                    new Month('Alturiak', 2, 30),
                    new Month('Ches', 3, 30),
                    new Month('Tarsakh', 4, 30),
                    new Month('Greengrass', -2, 1),
                    new Month('Mirtul', 5, 30),
                    new Month('Kythorn', 6, 30),
                    new Month('Flamerule', 7, 30),
                    new Month('Midsummer', -3, 1),
                    new Month('Shieldmeet', -4, 0, 1),
                    new Month('Eleasis', 8, 30),
                    new Month('Eleint', 9, 30),
                    new Month('Higharvestide', -5, 1),
                    new Month('Marpenoth', 10, 30),
                    new Month('Uktar', 11, 30),
                    new Month('Feast Of the Moon', -6, 1),
                    new Month('Nightal', 12, 30)
                ];
                (<Year>this.object).months[1].intercalary = true;
                (<Year>this.object).months[5].intercalary = true;
                (<Year>this.object).months[9].intercalary = true;
                (<Year>this.object).months[10].intercalary = true;
                (<Year>this.object).months[13].intercalary = true;
                (<Year>this.object).months[17].intercalary = true;
                (<Year>this.object).showWeekdayHeadings = false;
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
                (<Year>this.object).leapYearRule.rule = LeapYearRules.Custom;
                (<Year>this.object).leapYearRule.customMod = 4;
                (<Year>this.object).months[0].current = true;
                (<Year>this.object).months[0].days[0].current = true;
                break;
            case 'warhammer':
                (<Year>this.object).numericRepresentation = 2522;
                (<Year>this.object).prefix = '';
                (<Year>this.object).postfix = '';
                (<Year>this.object).months = [
                    new Month('Hexenstag', -1, 1),
                    new Month('Nachexen', 1, 32),
                    new Month('Jahrdrung', 2, 33),
                    new Month('Mitterfruhl', -2, 1),
                    new Month('Pflugzeit', 3, 33),
                    new Month('Sigmarzeit', 4, 33),
                    new Month('Sommerzeit', 5, 33),
                    new Month('Sonnstill', -3, 1),
                    new Month('Vorgeheim', 6, 33),
                    new Month('Geheimnistag', -4, 1),
                    new Month('Nachgeheim', 7, 32),
                    new Month('Erntezeit', 8, 33),
                    new Month('Mittherbst', -5, 1),
                    new Month('Brauzeit', 9, 33),
                    new Month('Kaldezeit', 10, 33),
                    new Month('Ulriczeit', 11, 33),
                    new Month('Mondstille', -6, 1),
                    new Month('Vorhexen', 12, 33)
                ];
                (<Year>this.object).months[0].intercalary = true;
                (<Year>this.object).months[3].intercalary = true;
                (<Year>this.object).months[7].intercalary = true;
                (<Year>this.object).months[9].intercalary = true;
                (<Year>this.object).months[12].intercalary = true;
                (<Year>this.object).months[16].intercalary = true;
                (<Year>this.object).showWeekdayHeadings = true;
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
                (<Year>this.object).leapYearRule.rule = LeapYearRules.None;
                (<Year>this.object).leapYearRule.customMod = 0;
                (<Year>this.object).months[0].current = true;
                (<Year>this.object).months[0].days[0].current = true;
                break;
        }
        this.yearChanged = true;
        this.updateApp();
    }

    /**
     * Event when any year inputs are changed
     * @param {Event} e The event
     */
    public yearInputChange(e: Event){
        const id = (<HTMLElement>e.currentTarget).id;
        const value = (<HTMLInputElement>e.currentTarget).value;
        if(id === "scCurrentYear"){
            const year = parseInt(value);
            if(!isNaN(year)){
                (<Year>this.object).numericRepresentation = year;
                this.yearChanged = true;
            }
        } else if(id === 'scYearPreFix'){
            (<Year>this.object).prefix = value;
        } else if(id === 'scYearPostFix'){
            (<Year>this.object).postfix = value;
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
                } else if (cssClass === 'month-intercalary' ){
                    months[monthIndex].intercalary = (<HTMLInputElement>e.currentTarget).checked;
                    const a = (<JQuery>this.element).find(`.month-intercalary-include[data-index='${dataIndex}']`).parent().parent().parent();
                    if(months[monthIndex].intercalary){
                        a.removeClass('hidden');
                    } else {
                        a.addClass('hidden');
                    }
                    this.rebaseMonthNumbers();
                    this.updateApp();
                } else if (cssClass === 'month-intercalary-include' ){
                    months[monthIndex].intercalaryInclude = (<HTMLInputElement>e.currentTarget).checked;
                    this.rebaseMonthNumbers();
                    this.updateApp();
                } else {
                    Logger.debug(`Invalid CSS Class for input "${cssClass}"`);
                }
                return;
            }
        }
        Logger.debug('Unable to set the months data on change.');
    }

    /**
     * Event when the checkbox for showing the weekday headings is changed
     * @param {Event} e The event that triggered the change
     */
    public showWeekdayInputChange(e: Event) {
        e.preventDefault();
        (<Year>this.object).showWeekdayHeadings = (<HTMLInputElement>e.currentTarget).checked;
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

    /**
     * Event when the leap year rule dropdown has changed to temporarily store those changes so if the application is updated the correct values are displayed
     * @param {Event} e The event that triggered the change
     */
    public leapYearRuleChange(e: Event){
        e.preventDefault();
        const leapYearRule = (<HTMLSelectElement>e.currentTarget).value;
        (<Year>this.object).leapYearRule.rule = <LeapYearRules>leapYearRule;
        this.updateApp();
    }

    /**
     * Event when a text box for the leap year month day count is change to temporarily store those changes so that if the application is updated the correct values are displayed
     * @param {Event} e The event that triggered the change
     */
    public leapYearMonthChange(e: Event){
        e.preventDefault();
        const dataIndex = (<HTMLElement>e.currentTarget).getAttribute('data-index');
        const cssClass = (<HTMLElement>e.currentTarget).getAttribute('class');
        const value = (<HTMLInputElement>e.currentTarget).value;
        if(dataIndex && cssClass && value){
            const monthIndex = parseInt(dataIndex);
            const months = (<Year>this.object).months;
            if(!isNaN(monthIndex) && monthIndex < months.length){
                const days = parseInt(value);
                if(!isNaN(days) && days !== months[monthIndex].numberOfLeapYearDays){
                    months[monthIndex].numberOfLeapYearDays = days;
                }
                return;
            }
        }
        Logger.debug('Unable to set the months data on change.');
    }

    /**
     * When the save button is clicked, apply those changes to the game settings and re-load the calendars across all players
     * @param {Event} e The click event
     */
    public async saveClick(e: Event) {
        e.preventDefault();
        try{
            // Update the Year Configuration
            const currentYear = parseInt((<HTMLInputElement>document.getElementById("scCurrentYear")).value);
            if(!isNaN(currentYear)){
                (<Year>this.object).numericRepresentation = currentYear;
                (<Year>this.object).selectedYear = currentYear;
                (<Year>this.object).visibleYear = currentYear;
            }
            (<Year>this.object).prefix = (<HTMLInputElement>document.getElementById("scYearPreFix")).value;
            (<Year>this.object).postfix = (<HTMLInputElement>document.getElementById("scYearPostFix")).value;
            (<Year>this.object).showWeekdayHeadings = (<HTMLInputElement>document.getElementById("scShowWeekdayHeaders")).checked;
            await GameSettings.SaveYearConfiguration(<Year>this.object);
            // Update the Month Configuration
            const monthNames = (<JQuery>this.element).find('input.month-name');
            const monthDays= (<JQuery>this.element).find('input.month-days');
            const monthIntercalary= (<JQuery>this.element).find('input.month-intercalary');
            const monthIntercalaryInclude= (<JQuery>this.element).find('input.month-intercalary-include');
            const monthLeapDays= (<JQuery>this.element).find('input.month-leap-days');
            for(let i = 0; i < monthNames.length; i++){
                const monthIndex = monthNames[i].getAttribute('data-index');
                if(monthIndex){
                    const index = parseInt(monthIndex);
                    const month = (<Year>this.object).months[index];
                    month.name = (<HTMLInputElement>monthNames[i]).value;
                    month.intercalary = (<HTMLInputElement>monthIntercalary[i]).checked;
                    month.intercalaryInclude = (<HTMLInputElement>monthIntercalaryInclude[i]).checked;
                    if(i < monthLeapDays.length){
                        let days = parseInt((<HTMLInputElement>monthLeapDays[i]).value);
                        if(isNaN(days) || days < 0){
                            days = 0;
                        }
                        if(month.numberOfLeapYearDays !== days){
                            month.numberOfLeapYearDays = days;
                        }
                    } else {
                        month.numberOfLeapYearDays = 0;
                    }
                    let days = parseInt((<HTMLInputElement>monthDays[i]).value);
                    if(isNaN(days) || days < 0){
                        days = 0;
                    }
                    if(month.numberOfDays !== days){
                        month.numberOfDays = days;
                        if(month.numberOfLeapYearDays < 1){
                            month.numberOfLeapYearDays = month.numberOfDays;
                        }
                    }
                    const daysShouldBe = month.numberOfLeapYearDays > month.numberOfDays? month.numberOfLeapYearDays : month.numberOfDays;
                    if(month.days.length !== daysShouldBe){
                        Logger.debug(`Days for month ${month.name} are different, rebuilding month days`);
                        const monthCurrentDay = month.getDay();
                        let currentDay = null;
                        if(monthCurrentDay){
                            if(monthCurrentDay.numericRepresentation >= days){
                                Logger.debug('The current day falls outside of the months new days, setting to first day of the month.');
                                currentDay = 0;
                            } else {
                                currentDay = monthCurrentDay.numericRepresentation;
                            }
                        }
                        month.days = [];
                        month.populateDays(daysShouldBe, currentDay);
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

            const leapYearRule = (<JQuery>this.element).find('#scLeapYearRule').find(":selected").val();
            if(leapYearRule){
                (<Year>this.object).leapYearRule.rule = <LeapYearRules>leapYearRule.toString();
            }
            if((<Year>this.object).leapYearRule.rule === LeapYearRules.Custom){
                const leapYearCustomMod = parseInt((<HTMLInputElement>document.getElementById("scLeapYearCustomMod")).value);
                if(!isNaN(leapYearCustomMod)){
                    (<Year>this.object).leapYearRule.customMod = leapYearCustomMod;
                }
            }

            await GameSettings.SaveLeapYearRules((<Year>this.object).leapYearRule);

            if(this.yearChanged){
                await GameSettings.SaveCurrentDate(<Year>this.object);
            }
            this.closeApp();
        } catch (error){
            Logger.error(error);
        }
    }
}
