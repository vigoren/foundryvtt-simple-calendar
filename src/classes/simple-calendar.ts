import {Logger} from "./logging";
import Month from "./month";
import Note from "./note";
import {
    SCDateSelector,
    SimpleCalendarSocket,
    SimpleCalendarTemplate
} from "../interfaces";
import {SimpleCalendarConfiguration} from "./simple-calendar-configuration";
import {GameSettings} from "./game-settings";
import {SimpleCalendarNotes} from "./simple-calendar-notes";
import HandlebarsHelpers from "./handlebars-helpers";
import {GameWorldTimeIntegrations, NoteRepeat, SimpleCalendarHooks, SocketTypes, TimeKeeperStatus} from "../constants";
import Day from "./day";
import Hook from "./hook";
import {RoundData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/foundry.js/clientDocuments/combat";
import GameSockets from "./game-sockets";
import Calendar from "./calendar";


/**
 * Contains all functionality for displaying/updating the simple calendar
 */
export default class SimpleCalendar extends Application{

    /**
     * Used to store a globally accessible copy of the Simple calendar class for access from event functions.
     */
    static instance: SimpleCalendar;

    /**
     * A list of all calendars
     * @type {Calendar[]}
     * @private
     */
    private calendars: Calendar[] = [];

    /**
     * Gets the current active calendar
     */
    public get activeCalendar(){
        return this.calendars[0];
    }

    /**
     * The CSS class associated with the animated clock
     */
    clockClass = 'stopped';

    /**
     * The different time units that a user can choose from and which one is currently selected
     */
    timeUnits = {
        second: true,
        minute: false,
        hour: false
    };

    /**
     * If this GM is considered the primary GM, if so all requests from players are filtered through this account.
     * @type {boolean}
     */
    public primary: boolean = false;
    /**
     * The primary check timeout number used when checking if this user is the GM
     * @type{number|undefined}
     * @private
     */
    private primaryCheckTimeout: number | undefined;
    /**
     * If the dialog has been resized
     * @type {boolean}
     */
    hasBeenResized: boolean = false;
    /**
     * The new note dialog
     * @type {SimpleCalendarNotes | undefined}
     */
    newNote: SimpleCalendarNotes | undefined;

    /**
     * If to show the compact view of the calendar
     * @type {boolean}
     */
    compactView: boolean = false;
    /**
     * If to show the notes section of the compact view
     * @type {boolean}
     */
    compactViewShowNotes: boolean = false;
    /**
     * Simple Calendar constructor
     */
    constructor() {
        super();
        this.calendars.push(new Calendar({id: '', name: 'Gregorian'}));
    }

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
        this.calendars = Calendar.LoadCalendars();
    }

    /**
     * Initializes all of the sockets and begins the primary check
     */
    public initializeSockets(){
        //Set up the socket we use to forward data between players and the GM
        GameSockets.on(this.processSocket.bind(this));

        if(GameSettings.IsGm()){
            const socket = <SimpleCalendarSocket.Data>{
                type: SocketTypes.primary,
                data: <SimpleCalendarSocket.SimpleCalendarPrimary> {
                    primaryCheck: true
                }
            };
            this.primaryCheckTimeout = window.setTimeout(this.primaryCheckTimeoutCall.bind(this), 5000);
            GameSockets.emit(socket).catch(Logger.error);
        }
    }

    /**
     * Called after the timeout delay set to see if another GM account has been set as the primary
     */
    async primaryCheckTimeoutCall(){
        Logger.debug('No primary GM found, taking over as primary');
        this.primary = true;
        const socketData = <SimpleCalendarSocket.Data>{type: SocketTypes.primary, data: {amPrimary: this.primary}};
        await GameSockets.emit(socketData);
        const timeKeeperSocketData = <SimpleCalendarSocket.Data>{type: SocketTypes.time, data: {timeKeeperStatus: TimeKeeperStatus.Stopped}};
        await GameSockets.emit(timeKeeperSocketData);
        if(this.activeCalendar.year.time.unifyGameAndClockPause){
            (<Game>game).togglePause(true, true);
        }
        await this.timeKeepingCheck();
        this.updateApp();
        Hook.emit(SimpleCalendarHooks.PrimaryGM);
    }

    /**
     * Process any data received over our socket
     * @param {SimpleCalendarSocket.Data} data The data received
     */
    async processSocket(data: SimpleCalendarSocket.Data){
        Logger.debug(`Processing ${data.type} socket emit`);
        if(data.type === SocketTypes.time){
            // This is processed by all players to update the animated clock
            this.activeCalendar.year.time.timeKeeper.setStatus((<SimpleCalendarSocket.SimpleCalendarSocketTime>data.data).timeKeeperStatus);
            this.clockClass = this.activeCalendar.year.time.timeKeeper.getStatus();
            this.activeCalendar.year.time.timeKeeper.setClockTime(this.activeCalendar.year.time.toString());
        } else if (data.type === SocketTypes.journal){
            // If user is a GM and the primary GM then save the journal requests, otherwise do nothing
            if(GameSettings.IsGm() && this.primary){
                Logger.debug(`Saving notes from user.`);
                await GameSettings.SaveNotes((<SimpleCalendarSocket.SimpleCalendarSocketJournal>data.data).notes)
            }
        } else if (data.type === SocketTypes.primary){
            if(GameSettings.IsGm()){
                // Another client is asking if anyone is the primary GM, respond accordingly
                if((<SimpleCalendarSocket.SimpleCalendarPrimary>data.data).primaryCheck){
                    Logger.debug(`Checking if I am the primary`);
                    await GameSockets.emit(<SimpleCalendarSocket.Data>{
                        type: SocketTypes.primary,
                        data: <SimpleCalendarSocket.SimpleCalendarPrimary> {
                            amPrimary: this.primary
                        }
                    });
                }
                // Another client has emitted that they are the primary, stop my check and set myself to not being the primary
                // This CAN lead to no primary if 2 GMs finish their primary check at the same time. This is best resolved by 1 gm reloading the page.
                else if((<SimpleCalendarSocket.SimpleCalendarPrimary>data.data).amPrimary !== undefined){
                    if((<SimpleCalendarSocket.SimpleCalendarPrimary>data.data).amPrimary){
                        Logger.debug('A primary GM is all ready present.');
                        window.clearTimeout(this.primaryCheckTimeout);
                        this.primary = false;
                    } else {
                        Logger.debug('We are all ready waiting to take over as primary.');
                    }
                }
            }
        } else if(data.type === SocketTypes.dateTime){
            if(GameSettings.IsGm() && this.primary){
                Logger.debug(`Processing Date/Time Change Request.`);
                if((<SimpleCalendarSocket.SimpleCalendarSocketDateTime>data.data).dataType){
                    switch ((<SimpleCalendarSocket.SimpleCalendarSocketDateTime>data.data).dataType){
                        case 'time':
                            if(!isNaN((<SimpleCalendarSocket.SimpleCalendarSocketDateTime>data.data).amount)){
                                this.activeCalendar.year.changeTime((<SimpleCalendarSocket.SimpleCalendarSocketDateTime>data.data).isNext, (<SimpleCalendarSocket.SimpleCalendarSocketDateTime>data.data).unit, (<SimpleCalendarSocket.SimpleCalendarSocketDateTime>data.data).amount);
                            }
                            break;
                        case 'day':
                            this.activeCalendar.year.changeDay((<SimpleCalendarSocket.SimpleCalendarSocketDateTime>data.data).isNext? 1 : -1, 'current');
                            break;
                        case 'month':
                            this.activeCalendar.year.changeMonth((<SimpleCalendarSocket.SimpleCalendarSocketDateTime>data.data).isNext? 1 : -1, 'current');
                            break;
                        case 'year':
                            this.activeCalendar.year.changeYear((<SimpleCalendarSocket.SimpleCalendarSocketDateTime>data.data).isNext? 1 : -1, false, "current");
                            break;
                    }
                    GameSettings.SaveCurrentDate(this.activeCalendar.year).catch(Logger.error);
                    //Sync the current time on apply, this will propagate to other modules
                    this.activeCalendar.syncTime().catch(Logger.error);
                }
            }
        } else if(data.type === SocketTypes.date){
            if(GameSettings.IsGm() && this.primary){
                const month = this.activeCalendar.year.months.find(m => m.numericRepresentation === (<SimpleCalendarSocket.SimpleCalendarSocketDate>data.data).month);
                if(month){
                    const day = month.days.find(d => d.numericRepresentation === (<SimpleCalendarSocket.SimpleCalendarSocketDate>data.data).day);
                    if(day){
                        this.setCurrentDate((<SimpleCalendarSocket.SimpleCalendarSocketDate>data.data).year, month, day);
                    }
                }
            }
        } else if(data.type === SocketTypes.noteReminders){
            this.checkNoteReminders((<SimpleCalendarSocket.SimpleCalendarNoteReminder>data.data).justTimeChange);
        }
    }

    /**
     * Gets the data object to be used by Handlebars when rending the HTML template
     * @param {Application.RenderOptions | undefined} options The data options
     */
    getData(options?: Application.RenderOptions): SimpleCalendarTemplate | Promise<SimpleCalendarTemplate> {
        return {
            calendar: this.activeCalendar.toTemplate(),
            clockClass: this.clockClass,
            compactView: this.compactView,
            compactViewShowNotes: this.compactViewShowNotes,
            isPrimary: this.primary,
            timeUnits: this.timeUnits
        };
    }

    /**
     * Adding to the get header buttons
     * @protected
     */
    protected _getHeaderButtons(): Application.HeaderButton[] {
        const buttons: Application.HeaderButton[] = [];
        if(!this.compactView){
            buttons.push({
                label: 'FSC.Compact',
                class: 'compact-view',
                icon: 'fa fa-compress',
                onclick: this.minimize.bind(this)
            });
        } else {
            buttons.push({
                label: 'FSC.Full',
                class: 'compact-view',
                icon: 'fa fa-expand',
                onclick: this.minimize.bind(this)
            });
        }
        return buttons.concat(super._getHeaderButtons());
    }

    /**
     * Adds the calendar button to the token button list
     * @param controls
     */
    public getSceneControlButtons(controls: any[]){
        if(this.activeCalendar.canUser((<Game>game).user, this.activeCalendar.generalSettings.permissions.viewCalendar)){
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
    }

    /**
     * Shows the application window
     */
    public showApp(){
        if(this.activeCalendar.canUser((<Game>game).user, this.activeCalendar.generalSettings.permissions.viewCalendar)){
            this.hasBeenResized = false;
            this.activeCalendar.year.setCurrentToVisible();
            this.render(true, {});
        }
    }

    /**
     * Closes the application window
     */
    public closeApp(){
        this.close().catch(error => Logger.error(error));
    }

    /**
     * Overwrite the minimization function to reduce the calendar down to the compact form
     * If the calendar is all ready in the compact form, restore to the full form
     */
    async minimize(){
        this.compactViewShowNotes = false;
        this.compactView = !this.compactView;
        this.activeCalendar.year.resetMonths('selected');
        this.render(true);
    }

    /**
     * Overwrite the maximize function to set the calendar to its full form
     */
    async maximize(){
        this.compactView = false;
        this.render(true);
    }

    /**
     * When the window is resized
     * @param event
     * @protected
     */
    protected _onResize(event: Event) {
        super._onResize(event);
        this.hasBeenResized = true;
    }

    /**
     * Sets the width and height of the calendar window so that it is sized to show the calendar, the controls and space for 2 notes.
     * @param {JQuery} html
     */
    setWidthHeight(html: JQuery){
        if(this.hasBeenResized){
            return;
        }
        let height = 1;
        let width = 1;

        // Get the height of the header and adjust by that amount
        const header = (<JQuery>this.element).find('.window-header');
        if(header){
            const h = header.outerHeight(true);
            height += h? h : 32;
        } else {
            height += 32;
        }

        // Get the width and height of the border, margins and padding of the content area to be added
        const contentArea = (<JQuery>this.element).find('.window-content');
        if(contentArea){
            const h = contentArea.height();
            const oh = contentArea.outerHeight(true);
            height += (h && oh)? oh - h : 0;
            const w = contentArea.width();
            const ow = contentArea.outerWidth(true);
            width += (w && ow)? ow - w : 0;
        }

        if(this.compactView){
            let weekDayNameLength = 0, monthNameLength = 0, yearNameLength;
            if(this.activeCalendar.year.showWeekdayHeadings){
                for(let i = 0; i < this.activeCalendar.year.weekdays.length; i++){
                    if(this.activeCalendar.year.weekdays[i].name.length > weekDayNameLength){
                        weekDayNameLength = this.activeCalendar.year.weekdays[i].name.length;
                    }
                }
            }
            for(let i = 0; i < this.activeCalendar.year.months.length; i++){
                if(this.activeCalendar.year.months[i].name.length > monthNameLength){
                    monthNameLength = this.activeCalendar.year.months[i].name.length;
                }
            }
            yearNameLength = this.activeCalendar.year.getDisplayName().length + 1;

            const totalCharacterLength = weekDayNameLength + monthNameLength + yearNameLength + 7;
            width = (totalCharacterLength * 7) + 62;
            const seasonMoon = (<JQuery>html).find('.compact-calendar .season-moon-info');
            const currentDate = (<JQuery>html).find('.compact-calendar .current-date .date');
            const currentTime = (<JQuery>html).find('.compact-calendar .current-time');
            const timeControls = (<JQuery>html).find('.compact-calendar .time-controls');
            const noteListNote = (<JQuery>html).find('.compact-calendar .note-list .note');

            if(seasonMoon){
                const h = seasonMoon.outerHeight(true);
                height += h? h : 0;
            }

            if(currentDate){
                const h = currentDate.outerHeight(true);
                let w = currentDate.outerWidth(false);
                height += h? h : 0;
                if(w){
                    w += 16 + 16 // Prev & Next buttons
                    w += 25 // Padding on left and right
                    if(w > width){
                        width = w;
                    }
                }
            }
            if(currentTime){
                const h = currentTime.outerHeight(true);
                height += h? h : 0;
            }
            if(timeControls){
                const h = timeControls.outerHeight(true);
                height += h? h * 2 : 0;
            }

            if(noteListNote){
                const h = noteListNote.outerHeight(true);
                height += h? h * 2 : 0;
            }
            if(width < 250){
                width = 250;
            }
        } else {
            const calendar = (<JQuery>html).find('.calendar-row .calendar-display');
            const controls = (<JQuery>html).find('.calendar-row .controls');
            const noteHeader = (<JQuery>html).find('.date-notes-header h2');
            const addNote = (<JQuery>html).find('.date-notes-header .add-note');

            if(calendar){
                const h = calendar.outerHeight(true);
                const w = calendar.outerWidth(true);
                height += h? h : 0;
                width += w? w : 0;
            }

            if(controls){
                const h = controls.outerHeight(true);
                const w = controls.outerWidth(true);
                if(h && h > height){
                    height = h;
                }
                width += w? w : 0;
            }

            if(noteHeader && addNote){
                const nh = noteHeader.outerHeight(true);
                const nw = noteHeader.outerWidth(true);
                const w = addNote.outerWidth(true);

                const headerW = (nw? nw : 0) + (w?  w: 0);
                if(headerW > width){
                    width = headerW;
                }
                height += (nh? nh : 0) + 24;
            }

            width += 16;
            height += (60 * 2) + 46;
        }
        this.setPosition({width: width, height: height});
    }

    /**
     * Keeps the current/selected date centered in the list of days for a month on calendars that have very long day lists
     * @param {JQuery} html
     */
    ensureCurrentDateIsVisible(html: JQuery){
        const calendar = (<JQuery>html).find(".calendar");
        const calendarHeight = calendar.outerHeight();

        //This only needs to be processed if the calendar is more than 499px tall
        if(calendarHeight && calendarHeight >= 500){
            const currentDay = calendar.find('.day.current');
            const selectedDay = calendar.find('.day.selected');

            //Prefer to use the selected day as the main day to focus on rather than the current day
            let elementToUse = null;
            if(selectedDay.length){
                elementToUse = selectedDay[0];
            } else if(currentDay.length){
                elementToUse = currentDay[0];
            }

            if(elementToUse !== null){
                const calendarRect = calendar[0].getBoundingClientRect();
                const rect = elementToUse.getBoundingClientRect();
                const insideViewPort = rect.top >= calendarRect.top && rect.left >= calendarRect.left && rect.bottom <= calendarRect.bottom && rect.right <= calendarRect.right;
                if(!insideViewPort){
                    Logger.debug(`The Current/Selected day is not in the viewport, updating the day list scroll top position.`);
                    calendar[0].scrollTop = rect.top - calendarRect.top - (calendarHeight/ 2);
                }
            }
        }
    }

    /**
     * Adds any event listeners to the application DOM
     * @param {JQuery<HTMLElement>} html The root HTML of the application window
     * @protected
     */
    public activateListeners(html: JQuery<HTMLElement>) {
        Logger.debug('Simple-Calendar activateListeners()');
        if(html.hasOwnProperty("length")) {
            this.setWidthHeight(html);
            if(this.compactView){
                this.element.find('.window-resizable-handle').hide();
                this.element.find('.compact-view').empty().append(`<i class='fa fa-expand'></i> ` + GameSettings.Localize('FSC.Full'));

                // Add new note click
                (<JQuery>html).find(".compact-calendar .season-moon-info .add-note").on('click', SimpleCalendar.instance.addNote.bind(this));

                // Show Notes
                (<JQuery>html).find(".compact-calendar .season-moon-info .notes").on('click', SimpleCalendar.instance.showCompactNotes.bind(this));

                //Day Change
                (<JQuery>html).find(".compact-calendar .current-date .fa").on('click', SimpleCalendar.instance.gmControlClick.bind(this));

                //Time Change
                (<JQuery>html).find(".compact-calendar .time-controls .selector").on('click', SimpleCalendar.instance.compactTimeControlClick.bind(this));

                // Note Click
                (<JQuery>html).find(".compact-calendar .note-list .note").on('click', SimpleCalendar.instance.viewNote.bind(this));

            } else {
                this.element.find('.window-resizable-handle').show();
                this.element.find('.compact-view').empty().append(`<i class='fa fa-compress'></i> ` + GameSettings.Localize('FSC.Compact'));
                this.ensureCurrentDateIsVisible(html);
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
                (<JQuery>html).find(".time-controls .time-unit .selector").on('click', SimpleCalendar.instance.timeUnitClick.bind(this));
                (<JQuery>html).find(".controls .time-controls .control").on('click', SimpleCalendar.instance.gmControlClick.bind(this));
                (<JQuery>html).find(".controls .date-controls .control").on('click', SimpleCalendar.instance.gmControlClick.bind(this));
                (<JQuery>html).find(".controls .btn-apply").on('click', SimpleCalendar.instance.dateControlApply.bind(this));

                //Configuration Button Click
                (<JQuery>html).find(".calendar-controls .configure-button").on('click', SimpleCalendar.instance.configurationClick.bind(this));

                // Add new note click
                (<JQuery>html).find(".date-notes .add-note").on('click', SimpleCalendar.instance.addNote.bind(this));

                // Note Click
                (<JQuery>html).find(".date-notes .note").on('click', SimpleCalendar.instance.viewNote.bind(this));

                //Note Drag
                (<JQuery>html).find(".date-notes .note").on('drag', SimpleCalendar.instance.noteDrag.bind(this));
                (<JQuery>html).find(".date-notes .note").on('dragend', SimpleCalendar.instance.noteDragEnd.bind(this));
            }
            (<JQuery>html).find(".time-start").on('click', SimpleCalendar.instance.startTime.bind(this));
            (<JQuery>html).find(".time-stop").on('click', SimpleCalendar.instance.stopTime.bind(this));

        }
    }

    /**
     * Toggles the showing of the notes for a day in the compact view
     * @param {Event} e
     */
    public showCompactNotes(e: Event){
        e.preventDefault();
        this.compactViewShowNotes = !this.compactViewShowNotes;
        this.updateApp();
    }

    /**
     * Click Event to change the month the user is currently viewing to the previous
     * @param {Event} e The click event
     */
    public viewPreviousMonth(e: Event){
        Logger.debug('Changing view to previous month');
        e.stopPropagation()
        this.activeCalendar.year.changeMonth(-1);
        this.updateApp();
    }

    /**
     * Click Event to change the month the user is currently viewing to the next
     * @param {Event} e The click event
     */
    public viewNextMonth(e: Event){
        Logger.debug('Changing view to next month');
        e.stopPropagation()
        this.activeCalendar.year.changeMonth(1);
        this.updateApp();
    }

    /**
     * Click event when a users clicks on a day
     * @param {Event} e The click event
     */
    public dayClick(e: Event){
        Logger.debug('Day Clicked');
        e.stopPropagation();
        let target = <HTMLElement>e.target;
        if(target.parentElement){
            if(target.classList.contains('note-count')){
                target = target.parentElement;
            } else if(target.classList.contains('moon-phase') && target.parentElement.parentElement){
                target = target.parentElement.parentElement;
            }
        }
        const dataDate = target.getAttribute('data-day');
        if(dataDate){
            const dayNumber = parseInt(dataDate);
            const isSelected = target.classList.contains('selected');
            if(dayNumber > -1){
                this.activeCalendar.year.resetMonths('selected');
                if(!isSelected){
                    const visibleMonth = this.activeCalendar.year.getMonth('visible');
                    if(visibleMonth){
                        const dayIndex = visibleMonth.days.findIndex(d => d.numericRepresentation === dayNumber);
                        if(dayIndex > -1){
                            visibleMonth.selected = true;
                            visibleMonth.days[dayIndex].selected = true;
                            this.activeCalendar.year.selectedYear = this.activeCalendar.year.visibleYear;
                        }
                    }
                }
                this.updateApp();
            } else {
                Logger.error('Day has invalid data attribute!');
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
        const selectedMonth = this.activeCalendar.year.getMonth('selected');
        if(selectedMonth){
            selectedMonth.selected = false;
            const selectedDay = selectedMonth.getDay('selected');
            if(selectedDay){
                selectedDay.selected = false;
            }
        }
        const visibleMonth = this.activeCalendar.year.getMonth('visible');
        if(visibleMonth){
            visibleMonth.visible = false;
        }
        const currentMonth = this.activeCalendar.year.getMonth();
        if(currentMonth){
            const currentDay = currentMonth.getDay();
            if(currentDay){
                this.activeCalendar.year.selectedYear = this.activeCalendar.year.numericRepresentation;
                this.activeCalendar.year.visibleYear = this.activeCalendar.year.numericRepresentation;
                currentMonth.visible = true;
                currentMonth.selected = true;
                currentDay.selected = true;
                this.updateApp();
            }
        }
    }

    /**
     * When the compact time controls are clicked
     * @param e
     */
    public compactTimeControlClick(e: Event){
        e.stopPropagation();
        const target = <HTMLElement>e.currentTarget;
        const dataType = target.getAttribute('data-type');
        const dataAmount = target.getAttribute('data-amount');
        if(dataType && dataAmount){
            const amount = parseInt(dataAmount);
            if(!GameSettings.IsGm() || !this.primary){
                if(!(<Game>game).users?.find(u => u.isGM && u.active)){
                    GameSettings.UiNotification((<Game>game).i18n.localize('FSC.Warn.Calendar.NotGM'), 'warn');
                } else {
                    const socketData = <SimpleCalendarSocket.SimpleCalendarSocketDateTime>{dataType: 'time', isNext: true, amount: amount, unit: dataType};
                    Logger.debug(`Sending Date/Time Change to Primary GM`);
                    GameSockets.emit({type: SocketTypes.dateTime, data: socketData}).catch(Logger.error);
                }

            } else if(!isNaN(amount) && (dataType === 'second' || dataType === 'minute' || dataType === 'hour') ){
                this.activeCalendar.year.changeTime(true, dataType, amount);
                GameSettings.SaveCurrentDate(this.activeCalendar.year).catch(Logger.error);
                //Sync the current time on apply, this will propagate to other modules
                this.activeCalendar.syncTime().catch(Logger.error);
            }
        } else if(dataType && (dataType === 'dawn' || dataType === 'midday' || dataType === 'dusk' || dataType === 'midnight')){
            this.timeOfDayControlClick(dataType);
            GameSettings.SaveCurrentDate(this.activeCalendar.year).catch(Logger.error);
            //Sync the current time on apply, this will propagate to other modules
            this.activeCalendar.syncTime(true).catch(Logger.error);
        }
    }

    /**
     * Click event when a user is changing the time unit to adjust
     * @param {Event} e The click event
     */
    public timeUnitClick(e: Event){
        e.stopPropagation();
        const target = <HTMLElement>e.currentTarget;
        const dataType = target.getAttribute('data-type')?.toLowerCase() as 'second' | 'minute' | 'hour';
        this.timeUnits.second = false;
        this.timeUnits.minute = false;
        this.timeUnits.hour = false;
        this.timeUnits[dataType] = true;
        this.updateApp();
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
        let change = false;
        // If a player or non primary GM makes a request, filter it through the primary GM
        if(!GameSettings.IsGm() || !this.primary){
            if(!(<Game>game).users?.find(u => u.isGM && u.active)){
                GameSettings.UiNotification((<Game>game).i18n.localize('FSC.Warn.Calendar.NotGM'), 'warn');
            } else {
                const socketData = <SimpleCalendarSocket.SimpleCalendarSocketDateTime>{dataType: dataType, isNext: isNext, amount: 0, unit: this.timeUnits.second? 'second' : this.timeUnits.minute? 'minute' : 'hour'};
                if(dataType === 'time'){
                    const dataAmount = target.getAttribute('data-amount');
                    if(dataAmount) {
                        socketData.amount = parseInt(dataAmount);
                    }
                }
                Logger.debug(`Sending Date/Time Change to Primary GM: ${dataType}, ${isNext}`);
                GameSockets.emit({type: SocketTypes.dateTime, data: socketData}).catch(Logger.error);
            }
        } else {
            switch (dataType){
                case 'time':
                    const dataAmount = target.getAttribute('data-amount');
                    if(dataAmount){
                        const amount = parseInt(dataAmount);
                        if(!isNaN(amount)){
                            Logger.debug(`${isNext? 'Forward' : 'Back'} Time Clicked`);
                            const unit = this.timeUnits.second? 'second' : this.timeUnits.minute? 'minute' : 'hour';
                            this.activeCalendar.year.changeTime(isNext, unit, amount);
                            change = true;
                        }
                    }
                    break;
                case 'day':
                    Logger.debug(`${isNext? 'Forward' : 'Back'} Day Clicked`);
                    this.activeCalendar.year.changeDay(isNext? 1 : -1, 'current');
                    change = true;
                    break;
                case 'month':
                    Logger.debug(`${isNext? 'Forward' : 'Back'} Month Clicked`);
                    this.activeCalendar.year.changeMonth(isNext? 1 : -1, 'current');
                    change = true;
                    break;
                case 'year':
                    Logger.debug(`${isNext? 'Forward' : 'Back'} Year Clicked`);
                    this.activeCalendar.year.changeYear(isNext? 1 : -1, false, "current");
                    change = true;
                    break;
                case 'dawn':
                case 'midday':
                case 'dusk':
                case 'midnight':
                    this.timeOfDayControlClick(dataType);
                    change = true;
                    break;
            }
        }
        if(change){
            GameSettings.SaveCurrentDate(this.activeCalendar.year).catch(Logger.error);
            //Sync the current time on apply, this will propagate to other modules
            this.activeCalendar.syncTime(true).catch(Logger.error);
        }
    }


    public timeOfDayControlClick(type: string){
        let month = this.activeCalendar.year.getMonth();
        let day: Day | undefined;
        switch (type){
            case 'dawn':
                if(month){
                    day = month.getDay();
                    if(day){
                        let sunriseTime = this.activeCalendar.year.getSunriseSunsetTime(this.activeCalendar.year.numericRepresentation, month, day, true, false);
                        if(this.activeCalendar.year.time.seconds >= sunriseTime){
                            this.activeCalendar.year.changeDay(1, 'current');
                            month = this.activeCalendar.year.getMonth();
                            if(month){
                                day = month.getDay();
                                if(day){
                                    sunriseTime = this.activeCalendar.year.getSunriseSunsetTime(this.activeCalendar.year.numericRepresentation, month, day, true, false);
                                    this.activeCalendar.year.time.seconds = sunriseTime;
                                }
                            }
                        } else {
                            this.activeCalendar.year.time.seconds = sunriseTime;
                        }
                    }
                }
                break;
            case 'midday':
                const halfDay = this.activeCalendar.year.time.secondsPerDay / 2;
                if(this.activeCalendar.year.time.seconds >= halfDay){
                    this.activeCalendar.year.changeDay(1, 'current');
                }
                this.activeCalendar.year.time.seconds = halfDay;
                break;
            case 'dusk':
                if(month){
                    day = month.getDay();
                    if(day){
                        let sunsetTime = this.activeCalendar.year.getSunriseSunsetTime(this.activeCalendar.year.numericRepresentation, month, day, false, false);
                        if(this.activeCalendar.year.time.seconds >= sunsetTime){
                            this.activeCalendar.year.changeDay(1, 'current');
                            month = this.activeCalendar.year.getMonth();
                            if(month){
                                day = month.getDay();
                                if(day){
                                    sunsetTime = this.activeCalendar.year.getSunriseSunsetTime(this.activeCalendar.year.numericRepresentation, month, day, false, false);
                                    this.activeCalendar.year.time.seconds = sunsetTime;
                                }
                            }
                        } else {
                            this.activeCalendar.year.time.seconds = sunsetTime;
                        }
                    }
                }
                break;
            case 'midnight':
                this.activeCalendar.year.changeTime(true, 'second', this.activeCalendar.year.time.secondsPerDay - this.activeCalendar.year.time.seconds);
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
        if(this.activeCalendar.canUser((<Game>game).user, this.activeCalendar.generalSettings.permissions.changeDateTime)){
            let validSelection = false;
            const selectedYear = this.activeCalendar.year.selectedYear;
            const selectedMonth = this.activeCalendar.year.getMonth('selected');
            if(selectedMonth){
                const selectedDay = selectedMonth.getDay('selected');
                if(selectedDay){
                    Logger.debug(`Updating current date to selected day.`);
                    validSelection = true;
                    if(selectedYear !== this.activeCalendar.year.visibleYear || !selectedMonth.visible){
                        const utsd = new Dialog({
                            title: GameSettings.Localize('FSC.SetCurrentDateDialog.Title'),
                            content: GameSettings.Localize('FSC.SetCurrentDateDialog.Content').replace('{DATE}', `${selectedMonth.name} ${selectedDay.numericRepresentation}, ${selectedYear}`),
                            buttons:{
                                yes: {
                                    label: GameSettings.Localize('Yes'),
                                    callback: this.setCurrentDate.bind(this, selectedYear, selectedMonth, selectedDay)
                                },
                                no: {
                                    label: GameSettings.Localize('No')
                                }
                            },
                            default: "no"
                        });
                        utsd.render(true);
                    } else {
                        this.setCurrentDate(selectedYear, selectedMonth, selectedDay);
                    }
                }
            }
            if(!validSelection){
                GameSettings.SaveCurrentDate(this.activeCalendar.year).catch(Logger.error);
                //Sync the current time on apply, this will propagate to other modules
                this.activeCalendar.syncTime().catch(Logger.error);
            }
        } else {
            GameSettings.UiNotification(GameSettings.Localize("FSC.Error.Calendar.GMCurrent"), 'warn');
        }
    }

    /**
     * Sets the current date for the calendar
     * @param {number} year The year number to set the date to
     * @param {Month} month The month object to set as current
     * @param {Day} day They day object to set as current
     */
    public setCurrentDate(year: number, month: Month, day: Day){
        if(!GameSettings.IsGm() || !this.primary){
            if(!(<Game>game).users?.find(u => u.isGM && u.active)){
                GameSettings.UiNotification((<Game>game).i18n.localize('FSC.Warn.Calendar.NotGM'), 'warn');
            } else {
                const socketData = <SimpleCalendarSocket.SimpleCalendarSocketDate>{year: year, month: month.numericRepresentation, day: day.numericRepresentation};
                Logger.debug(`Sending Date Change to Primary GM: ${socketData.year}, ${socketData.month}, ${socketData.day}`);
                GameSockets.emit({type: SocketTypes.date, data: socketData}).catch(Logger.error);
            }
        } else {
            this.activeCalendar.year.numericRepresentation = year;
            this.activeCalendar.year.resetMonths();
            month.current = true;
            month.selected = false;
            day.current = true;
            day.selected = false;
            GameSettings.SaveCurrentDate(this.activeCalendar.year).catch(Logger.error);
            //Sync the current time on apply, this will propagate to other modules
            this.activeCalendar.syncTime().catch(Logger.error);
        }
    }

    /**
     * Click event for when a gm user clicks on the configuration button to configure the game calendar
     * @param {Event} e The click event
     */
    public configurationClick(e: Event) {
        e.stopPropagation();
        if(GameSettings.IsGm()){
            if(!SimpleCalendarConfiguration.instance || (SimpleCalendarConfiguration.instance && !SimpleCalendarConfiguration.instance.rendered)){
                SimpleCalendarConfiguration.instance = new SimpleCalendarConfiguration(this.activeCalendar.clone());
                SimpleCalendarConfiguration.instance.showApp();
            } else {
                SimpleCalendarConfiguration.instance.bringToTop();
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
        if(!(<Game>game).users?.find(u => u.isGM && u.active)){
            GameSettings.UiNotification((<Game>game).i18n.localize('FSC.Warn.Notes.NotGM'), 'warn');
        } else {
            const currentMonth = this.activeCalendar.year.getMonth('selected') || this.activeCalendar.year.getMonth();
            if(currentMonth){
                const currentDay = currentMonth.getDay('selected') || currentMonth.getDay();
                if(currentDay){
                    const year = this.activeCalendar.year.selectedYear || this.activeCalendar.year.numericRepresentation;
                    const newNote = new Note();
                    newNote.initialize(year, currentMonth.numericRepresentation, currentDay.numericRepresentation, currentMonth.name);
                    if(this.newNote !== undefined && !this.newNote.rendered){
                        this.newNote.closeApp();
                        this.newNote = undefined;
                    }
                    if(this.newNote === undefined){
                        this.newNote = new SimpleCalendarNotes(newNote);
                        this.newNote.showApp();
                    } else {
                        this.newNote.bringToTop();
                        this.newNote.maximize().catch(Logger.error);
                    }
                } else {
                    GameSettings.UiNotification(GameSettings.Localize("FSC.Error.Note.NoSelectedDay"), 'warn');
                }
            } else {
                GameSettings.UiNotification(GameSettings.Localize("FSC.Error.Note.NoSelectedMonth"), 'warn');
            }
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
            const note = this.activeCalendar.notes.find(n=> n.id === dataIndex);
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
    public updateApp(){
        if(this.rendered){
            this.render(false);
        }
    }

    /**
     * Called when a setting is updated, refreshes the configurations for all types
     * @param {boolean} [update=false] If to update the display
     * @param {string} [type='all']
     */
    public settingUpdate(update: boolean = false, type: string = 'all'){
        this.activeCalendar.settingUpdate(type);
        if(update && this.activeCalendar.year.time.timeKeeper.getStatus() !== TimeKeeperStatus.Started ) {
            this.updateApp();
        }
    }

    /**
     * Triggered when the games pause state is changed.
     * @param paused
     */
    gamePaused(paused: boolean){
        if(this.activeCalendar.year.time.unifyGameAndClockPause){
            if(!(<Game>game).paused){
                this.activeCalendar.year.time.timeKeeper.start(true);
            } else {
                this.activeCalendar.year.time.timeKeeper.setStatus(TimeKeeperStatus.Paused);
            }
        }
    }

    /**
     * Triggered when anything updates the game world time
     * @param {number} newTime The total time in seconds
     * @param {number} delta How much the newTime has changed from the old time in seconds
     */
    worldTimeUpdate(newTime: number, delta: number){
        Logger.debug(`World Time Update, new time: ${newTime}. Delta of: ${delta}.`);
        this.activeCalendar.setFromTime(newTime, delta);
    }

    /**
     * Triggered when a combatant is added to a combat.
     * @param {Combatant} combatant The combatant details
     * @param {object} options Options associated with creating the combatant
     * @param {string} id The ID of the creation
     */
    createCombatant(combatant: Combatant, options: any, id: string){
        const combatList = (<Game>game).combats;
        //If combat is running or if the combat list is undefined, skip this check
        if(!this.activeCalendar.year.time.combatRunning && combatList){
            const combat = combatList.find(c => c.id === combatant.parent?.id);
            const scenes = (<Game>game).scenes;
            const activeScene = scenes? scenes.active? scenes.active.id : null : null;
            //If the combat has started and the current active scene is the scene for the combat then set that there is a combat running.
            if(combat && combat.started && ((activeScene !== null && combat.scene && combat.scene.id === activeScene) || activeScene === null)){
                this.activeCalendar.year.time.combatRunning = true;
            }
        }
    }

    /**
     * Triggered when a combat is create/started/turn advanced
     * @param {Combat} combat The specific combat data
     * @param {RoundData} round The current turns data
     * @param {Object} time The amount of time that has advanced
     */
    combatUpdate(combat: Combat, round: RoundData, time: any){
        Logger.debug('Combat Update');
        const scenes = (<Game>game).scenes;
        const activeScene = scenes? scenes.active? scenes.active.id : null : null;
        if(combat.started && ((activeScene !== null && combat.scene && combat.scene.id === activeScene) || activeScene === null)){
            this.activeCalendar.year.time.combatRunning = true;

            //If time does not have the advanceTime property the combat was just started
            if(time && time.hasOwnProperty('advanceTime')){
                if(time.advanceTime !== 0){
                    Logger.debug('Combat Change Triggered');
                    this.activeCalendar.year.combatChangeTriggered = true;
                } else {
                    // System does not advance time when combat rounds change, check our own settings
                    this.activeCalendar.year.processOwnCombatRoundTime(combat);
                }
            }
        }
    }

    /**
     * Triggered when a combat is finished and removed
     */
    combatDelete(combat: Combat){
        Logger.debug('Combat Ended');
        const scenes = (<Game>game).scenes;
        const activeScene = scenes? scenes.active? scenes.active.id : null : null;
        if(activeScene !== null && combat.scene && combat.scene.id === activeScene){
            this.activeCalendar.year.time.combatRunning = false;
        }
    }

    /**
     * Starts the built in time keeper
     */
    startTime(){
        const scenes = (<Game>game).scenes;
        const combats = (<Game>game).combats;
        const activeScene = scenes? scenes.active? scenes.active.id : null : null;
        if(combats && combats.size > 0 && combats.find(g => g.started && ((activeScene !== null && g.scene && g.scene.id === activeScene) || activeScene === null))){
            GameSettings.UiNotification((<Game>game).i18n.localize('FSC.Warn.Time.ActiveCombats'), 'warn');
        } else if(this.activeCalendar.generalSettings.gameWorldTimeIntegration === GameWorldTimeIntegrations.Self || this.activeCalendar.generalSettings.gameWorldTimeIntegration === GameWorldTimeIntegrations.Mixed){
            this.activeCalendar.year.time.timeKeeper.start();
        }
    }

    /**
     * Stops the built in time keeper
     */
    stopTime(){
        this.activeCalendar.year.time.timeKeeper.stop();
    }

    /**
     * Checks to see if the module import/export dialog needs to be shown and syncs the game world time with the simple calendar
     */
    async timeKeepingCheck(){
        //If the current year is set up and the calendar is set up for time keeping and the user is the GM
        if(this.activeCalendar.generalSettings.gameWorldTimeIntegration !== GameWorldTimeIntegrations.None && GameSettings.IsGm() ){
            //Sync the current world time with the simple calendar
            await this.activeCalendar.syncTime();
        }
    }

    /**
     * While a note is being dragged
     * @param {Event} event
     */
    noteDrag(event: Event){
        const selectedItem = <HTMLElement>event.target,
            list = selectedItem.parentNode,
            x = (<DragEvent>event).clientX,
            y = (<DragEvent>event).clientY;
        selectedItem.classList.add('drag-active');
        let swapItem: Element | ChildNode | null = document.elementFromPoint(x, y) === null ? selectedItem : document.elementFromPoint(x, y);
        if (list !== null && swapItem !== null && list === swapItem.parentNode) {
            swapItem = swapItem !== selectedItem.nextSibling ? swapItem : swapItem.nextSibling;
            list.insertBefore(selectedItem, swapItem);
        }
    }

    /**
     * When the dragging has ended, re-order all events on this day and save their new order
     * @param {Event} event
     */
    noteDragEnd(event: Event){
        const selectedItem = <HTMLElement>event.target,
            list = selectedItem.parentNode,
            id = selectedItem.getAttribute('data-index');
        selectedItem.classList.remove('drag-active');
        if(id && list){
            const dayNotes = this.activeCalendar.getNotesForDay();
            for(let i = 0; i < list.children.length; i++){
                const cid = list.children[i].getAttribute('data-index');
                const n = dayNotes.find(n => n.id === cid);
                if(n){
                    n.order = i;
                }
            }
            let currentNotes = GameSettings.LoadNotes().map(n => {
                const note = new Note();
                note.loadFromSettings(n);
                return note;
            });
            currentNotes = currentNotes.map(n => {
                const dayNote = dayNotes.find(dn => dn.id === n.id);
                return dayNote? dayNote : n;
            });
            GameSettings.SaveNotes(currentNotes).catch(Logger.error);
        }
    }

    /**
     * Checks to see if any note reminders needs to be sent to players for the current date.
     * @param {boolean} [justTimeChange=false] If only the time (hour, minute, second) has changed or not
     */
    checkNoteReminders(justTimeChange: boolean = false){
        const userID = GameSettings.UserID();
        const noteRemindersForPlayer = this.activeCalendar.notes.filter(n => n.remindUsers.indexOf(userID) > -1);
        if(noteRemindersForPlayer.length){
            const currentMonth = this.activeCalendar.year.getMonth();
            const currentDay = currentMonth? currentMonth.getDay() : this.activeCalendar.year.months[0].days[0];
            const time = this.activeCalendar.year.time.getCurrentTime();
            const currentHour = time.hour;
            const currentMinute = time.minute;

            const currentDate: SCDateSelector.Date = {
                year: this.activeCalendar.year.numericRepresentation,
                month: currentMonth? currentMonth.numericRepresentation : 1,
                day: currentDay? currentDay.numericRepresentation : 1,
                hour: currentHour,
                minute: currentMinute,
                allDay: false
            };
            const noteRemindersCurrentDay = noteRemindersForPlayer.filter(n => {
                if(n.repeats !== NoteRepeat.Never && !justTimeChange){
                    if(n.repeats === NoteRepeat.Yearly){
                        if(n.year !== currentDate.year){
                            n.reminderSent = false;
                        }
                    } else if(n.repeats === NoteRepeat.Monthly){
                        if(n.year !== currentDate.year || n.month !== currentDate.month || (n.month === currentDate.month && n.year !== currentDate.year)){
                            n.reminderSent = false;
                        }
                    } else if(n.repeats === NoteRepeat.Weekly){
                        if(n.year !== currentDate.year || n.month !== currentDate.month || n.day !== currentDate.day || (n.day === currentDate.day && (n.month !== currentDate.month || n.year !== currentDate.year))){
                            n.reminderSent = false;
                        }
                    }
                }
                //Check if the reminder has been sent or not and if the new day is between the notes start/end date
                if(!n.reminderSent && n.isVisible(currentDate.year, currentDate.month, currentDate.day)){
                    if(n.allDay){
                        return true;
                    } else if(currentDate.hour === n.hour){
                        if(currentDate.minute >= n.minute){
                            return true;
                        }
                    } else if(currentDate.hour > n.hour){
                        return true;
                    } else if(currentDate.year > n.year || currentDate.month > n.month || currentDate.day > n.day){
                        return true;
                    }
                }
                return false;
            });
            for(let i = 0; i < noteRemindersCurrentDay.length; i++){
                const note = noteRemindersCurrentDay[i];
                ChatMessage.create({
                    speaker: {alias: "Simple Calendar Reminder"},
                    whisper: [userID],
                    content: `<div style="margin-bottom: 0.5rem;font-size:0.75rem">${note.display()}</div><h2>${note.title}</h2>${note.content}`
                }).catch(Logger.error);
                note.reminderSent = true;
            }
        }
    }

}
