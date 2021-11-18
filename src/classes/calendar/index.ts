import Year from "./year";
import {
    CalendarConfiguration,
    CalendarTemplate,
    CurrentDateConfig,
    GeneralSettingsConfig,
    LeapYearConfig,
    MonthConfig,
    MoonConfiguration,
    NoteCategory,
    NoteConfig,
    NoteTemplate,
    PermissionMatrix,
    SCDateSelector,
    SearchOptions,
    SeasonConfiguration,
    SimpleCalendarSocket,
    TimeConfig,
    WeekdayConfig,
    YearConfig
} from "../../interfaces";
import {
    GameSystems,
    GameWorldTimeIntegrations,
    NoteRepeat,
    PredefinedCalendars,
    SettingNames,
    SimpleCalendarHooks,
    SocketTypes,
    TimeKeeperStatus
} from "../../constants";
import Note from "../note";
import Month from "./month";
import {Logger} from "../logging";
import {GameSettings} from "../foundry-interfacing/game-settings";
import {Weekday} from "./weekday";
import Season from "./season";
import Moon from "./moon";
import PredefinedCalendar from "../configuration/predefined-calendar";
import GeneralSettings from "../configuration/general-settings";
import ConfigurationItemBase from "../configuration/configuration-item-base";
import PF2E from "../systems/pf2e";
import Renderer from "../renderer";
import SimpleCalendar from "../simple-calendar";
import GameSockets from "../foundry-interfacing/game-sockets";
import Hook from "../api/hook";
import {generateUniqueId} from "../utilities/string";
import {FormatDateTime, ToSeconds, GetDisplayDate} from "../utilities/date-time";

export default class Calendar extends ConfigurationItemBase{
    /**
     * If this GM is considered the primary GM, if so all requests from players are filtered through this account.
     * @type {boolean}
     */
    public primary: boolean = false;
    /**
     * If this calendar is around temporarily. This is used when we want to clone a calendar, make changes to the clone without affecting the main calendar.
     * Primarily used by the configuration dialog
     */
    isTemporary: boolean = false;
    /**
     * The currently running game system
     * @type {GameSystems}
     */
    gameSystem: GameSystems;
    /**
     * All of the general settings for a calendar
     * @type {GeneralSettings}
     */
    generalSettings: GeneralSettings = new GeneralSettings();
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
        super(configuration.name);
        this.id = configuration.id || generateUniqueId();
        // Set Calendar Data
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
     * Creates a cloned version of the Calendar class
     */
    clone(): Calendar {
        const c = new Calendar({ id: this.id, name: this.name });
        c.id = this.id;
        c.name = this.name;
        c.gameSystem = this.gameSystem;
        c.generalSettings = this.generalSettings.clone();
        c.year = this.year.clone();
        c.notes = this.notes.map(n => n.clone());
        c.noteCategories = this.noteCategories.map(nc => {return {name: nc.name, textColor: nc.textColor, color: nc.color}});
        return c;
    }

    /**
     * Creates a template for the calendar class
     */
    toTemplate(): CalendarTemplate{
        let showSetCurrentDate = false;
        let vMonth = 1, vMonthIndex = 0, vYear = this.year.visibleYear, sYear = this.year.selectedYear, sMonth = 1, sDay = 1;
        const currentMonth = this.year.getMonth();
        const selectedMonth = this.year.getMonth('selected');
        const visibleMonth = this.year.getMonth('visible');
        if(selectedMonth){
            sMonth = selectedMonth.numericRepresentation;
            const selectedDay = selectedMonth.getDay('selected');
            if(selectedDay){
                sDay = selectedDay.numericRepresentation;
                if(!selectedDay.current){
                    showSetCurrentDate = true;
                }
            }
        } else if(currentMonth){
            sYear = this.year.numericRepresentation;
            sMonth = currentMonth.numericRepresentation;
            const currentDay = currentMonth.getDay();
            if(currentDay){
                sDay = currentDay.numericRepresentation;
            }
        }

        if(visibleMonth){
            vMonth = visibleMonth.numericRepresentation;
            vMonthIndex = this.year.months.findIndex(m => m.numericRepresentation === vMonth);
        }

        return {
            ...super.toTemplate(),
            addNotes: this.canUser((<Game>game).user, this.generalSettings.permissions.addNotes),
            calendarId: `sc_${this.id}_calendar`,
            clockId: `sc_${this.id}_clock`,
            changeDateTime: this.canUser((<Game>game).user, this.generalSettings.permissions.changeDateTime),
            currentYear: this.year.toTemplate(),
            gameSystem: this.gameSystem,
            isGM: GameSettings.IsGm(),
            id: this.id,
            name: this.name,
            notes: this.getNotesForDay().map(n => n.toTemplate()),
            reorderNotes: this.canUser((<Game>game).user, this.generalSettings.permissions.reorderNotes),
            showClock: this.generalSettings.showClock,
            showDateControls: this.generalSettings.gameWorldTimeIntegration !== GameWorldTimeIntegrations.ThirdParty,
            showSetCurrentDate: this.canUser((<Game>game).user, this.generalSettings.permissions.changeDateTime) && showSetCurrentDate,
            showTimeControls: this.generalSettings.showClock && this.generalSettings.gameWorldTimeIntegration !== GameWorldTimeIntegrations.ThirdParty,
            calendarDisplay: FormatDateTime({year: this.year.visibleYear, month: vMonth, day: 1, hour: 0, minute: 0, seconds: 0}, this.generalSettings.dateFormat.monthYear, this),
            selectedDisplay: FormatDateTime({year: sYear, month: sMonth, day: sDay, hour: 0, minute: 0, seconds: 0}, this.generalSettings.dateFormat.date, this),
            timeDisplay: FormatDateTime({year: 0, month: 0, day: 0, ...this.year.time.getCurrentTime()}, this.generalSettings.dateFormat.time, this),
            visibleDate: {year: vYear, month: vMonthIndex}
        };
    }

    /**
     * saves the current date and time to the game settings
     * @param emitHook
     */
    public async saveCurrentDate(emitHook: boolean = true){
        const currentMonth = this.year.getMonth();
        if(currentMonth){
            const currentDay = currentMonth.getDay();
            if(currentDay){
                const currentDate = <CurrentDateConfig>GameSettings.GetObjectSettings(SettingNames.CurrentDate);
                const newDate: CurrentDateConfig = {
                    year: this.year.numericRepresentation,
                    month: currentMonth.numericRepresentation,
                    day: currentDay.numericRepresentation,
                    seconds: this.year.time.seconds
                };
                const saved = await GameSettings.SaveObjectSetting(SettingNames.CurrentDate, newDate);
                if(saved){
                    if(emitHook){
                        const diff = this.year.toSeconds() - (ToSeconds(this, currentDate.year, currentDate.month, currentDate.day, false) + currentDate.seconds);
                        await GameSockets.emit(<SimpleCalendarSocket.Data>{type: SocketTypes.emitHook, data: <SimpleCalendarSocket.SimpleCalendarEmitHook>{hook: SimpleCalendarHooks.DateTimeChange, param: diff}});
                        Hook.emit(SimpleCalendarHooks.DateTimeChange, this, diff);
                    }
                    await GameSockets.emit(<SimpleCalendarSocket.Data>{ type: SocketTypes.noteReminders, data: { justTimeChange: currentDate.seconds !== newDate.seconds && currentDate.day === newDate.day }});
                    this.checkNoteReminders()
                    if(SimpleCalendar.instance){
                        SimpleCalendar.instance.checkNoteReminders(currentDate.seconds !== newDate.seconds && currentDate.day === newDate.day);
                    }
                }
            }
        }
    }

    //---------------------------
    // Note Functionality
    //---------------------------
    /**
     * Gets all of the notes associated with the selected or current day
     * @private
     * @return NoteTemplate[]
     */
    public getNotesForDay(): Note[] {
        const dayNotes: Note[] = [];
        const year = this.year.selectedYear || this.year.numericRepresentation;
        const month = this.year.getMonth('selected') || this.year.getMonth();
        if(month){
            const day = month.getDay('selected') || month.getDay();
            if(day){
                this.notes.forEach((note) => {
                    if(note.isVisible(year, month.numericRepresentation, day.numericRepresentation)){
                        dayNotes.push(note);
                    }
                });
            }
        }
        dayNotes.sort(Calendar.dayNoteSort);
        return dayNotes;
    }

    /**
     * Sort function for the list of notes on a day. Sorts by order, then hour then minute
     * @param {Note} a The first note to compare
     * @param {Note} b The second noe to compare
     * @private
     */
    private static dayNoteSort(a: Note, b: Note): number {
        return a.order - b.order || a.hour - b.hour || a.minute - b.minute;
    }

    /**
     * Searches the title and content of all notes to get a list that matches the passed in term. The results are sorted by relevancy
     * @param {String} term
     * @param {SearchOptions.Fields} options
     */
    public searchNotes(term: string, options: SearchOptions.Fields): NoteTemplate[] {
        const results: {match: number, note: Note}[] = [];
        term = term.toLowerCase();

        this.notes.forEach((note) => {
            if((GameSettings.IsGm() || (!GameSettings.IsGm() && note.playerVisible))){
                let match = 0;
                const noteFormattedDate = GetDisplayDate(this,{year: note.year, month: note.month, day: note.day, hour: note.hour, minute: note.minute, allDay: note.allDay}, {...note.endDate, allDay: note.allDay}).toLowerCase();
                const noteTitle = note.title.toLowerCase();
                const noteContent = note.content.toLowerCase();
                const author = GameSettings.GetUser(note.author);
                const authorName = author? author.name? author.name.toLowerCase() : '' : '';
                const categories = note.categories.map(c=> c.toLowerCase());

                //Search for the direct term match in the formatted date and give that a heavy weight (equivalent to 1000 matches)
                if(options.date){
                    if(RegExp(term).test(noteFormattedDate)){
                        match += 1000;
                    }
                }

                //Search for the direct term match in the title and give that a heavy weight (equivalent to 500 matches)
                if(options.title){
                    if(RegExp(term).test(noteTitle)){
                        match += 500;
                    }
                }

                //Search for the direct term match in the content and give that a medium weight (equivalent to 100 matches)
                if(options.details){
                    if(RegExp(term).test(noteContent)){
                        match += 100;
                    }
                }

                //Search for the direct term match in the authors name and give it a heavy weight
                if(options.author){
                    if(author && RegExp(term).test(authorName)){
                        match += 500;
                    }
                }

                if(options.categories){
                    if(categories.indexOf(term) > -1){
                        match += 500;
                    }
                }

                const terms = term.split(' ');
                for(var i = 0; i < terms.length; i++){
                    if(options.date){
                        //Check to see if the term exists anywhere as its own word, give that a weight of 2
                        if(RegExp('\\b'+terms[i]+'\\b').test(noteFormattedDate)){
                            match += 50;
                        }
                        //Check to see if the term appears anywhere (even in other words). give that a weight of 1
                        else if(noteFormattedDate.indexOf(terms[i]) > -1){
                            match+=30;
                        }
                    }

                    if(options.title){
                        //Check to see if the term exists anywhere as its own word, give that a weight of 2
                        if(RegExp('\\b'+terms[i]+'\\b').test(noteTitle)){
                            match += 20;
                        }
                        //Check to see if the term appears anywhere (even in other words). give that a weight of 1
                        else if(noteTitle.indexOf(terms[i]) > -1){
                            match+=10;
                        }
                    }

                    if(options.author){
                        //Check to see if the term exists anywhere as its own word, give that a weight of 2
                        if(author && RegExp('\\b'+terms[i]+'\\b').test(authorName)){
                            match += 20;
                        }
                        //Check to see if the term appears anywhere (even in other words). give that a weight of 1
                        else if(author && authorName.indexOf(terms[i]) > -1){
                            match+=10;
                        }
                    }

                    if(options.details){
                        //Check to see if the term exists anywhere as its own word, give that a weight of 2
                        if(RegExp('\\b'+terms[i]+'\\b').test(noteContent)){
                            match += 2;
                        }
                        //Check to see if the term appears anywhere (even in other words). give that a weight of 1
                        else if(noteContent.indexOf(terms[i]) > -1){
                            match++;
                        }
                    }

                    if(options.categories){
                        categories.forEach(c => {
                            //Check to see if the term exists anywhere as its own word, give that a weight of 2
                            if(RegExp('\\b'+terms[i]+'\\b').test(c)){
                                match += 20;
                            }
                            //Check to see if the term appears anywhere (even in other words). give that a weight of 1
                            else if(c.indexOf(terms[i]) > -1){
                                match++;
                            }
                        });
                    }
                }
                if(match > 0){
                    results.push({match: match, note: note});
                }
            }
        });
        results.sort((a: {match: number, note: Note}, b: {match: number, note: Note}) => b.match - a.match);

        return results.map(r => r.note.toTemplate());
    }

    /**
     * Takes a list of note IDs and will order the notes on the current day to match the passed in order.
     * @param newOrderedIds
     */
    public reorderNotesOnDay(newOrderedIds: string[]){
        const dayNotes = this.getNotesForDay();
        for(let i = 0; i < newOrderedIds.length; i++){
            const n = dayNotes.find(n => n.id === newOrderedIds[i]);
            if(n){
                n.order = i;
            }
        }
        let currentNotes = (<NoteConfig[]>GameSettings.GetObjectSettings(SettingNames.Notes)).map(n => {
            const note = new Note();
            note.loadFromSettings(n);
            return note;
        });
        currentNotes = currentNotes.map(n => {
            const dayNote = dayNotes.find(dn => dn.id === n.id);
            return dayNote? dayNote : n;
        });
        GameSettings.SaveObjectSetting(SettingNames.Notes, currentNotes.map(n => n.toConfig())).catch(Logger.error);
    }

    /**
     * Checks to see if any note reminders needs to be sent to players for the current date.
     * @param {boolean} [justTimeChange=false] If only the time (hour, minute, second) has changed or not
     */
    public checkNoteReminders(justTimeChange: boolean = false){
        const userID = GameSettings.UserID();
        const noteRemindersForPlayer = this.notes.filter(n => n.remindUsers.indexOf(userID) > -1);
        if(noteRemindersForPlayer.length){
            const currentMonth = this.year.getMonth();
            const currentDay = currentMonth? currentMonth.getDay() : this.year.months[0].days[0];
            const time = this.year.time.getCurrentTime();
            const currentHour = time.hour;
            const currentMinute = time.minute;

            const currentDate: SCDateSelector.Date = {
                year: this.year.numericRepresentation,
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

    /**
     * Sets the current game world time to match what our current time is
     */
    async syncTime(force: boolean = false){
        // Only if the time tracking rules are set to self or mixed
        if(this.canUser((<Game>game).user, this.generalSettings.permissions.changeDateTime) && (this.generalSettings.gameWorldTimeIntegration === GameWorldTimeIntegrations.Self || this.generalSettings.gameWorldTimeIntegration === GameWorldTimeIntegrations.Mixed)){
            Logger.debug(`Year.syncTime()`);
            const totalSeconds = this.year.toSeconds();
            // If the calculated seconds are different from what is set in the game world time, update the game world time to match sc's time
            if(totalSeconds !== (<Game>game).time.worldTime || force){
                //Let the local functions know that we all ready updated this time
                this.year.timeChangeTriggered = true;
                //Set the world time, this will trigger the setFromTime function on all connected players when the updateWorldTime hook is triggered
                await this.year.time.setWorldTime(totalSeconds);
            }
        }
    }

    /**
     * Sets the simple calendars year, month, day and time from a passed in number of seconds
     * @param {number} newTime The new time represented by seconds
     * @param {number} changeAmount The amount that the time has changed by
     */
    setFromTime(newTime: number, changeAmount: number){
        Logger.debug('Year.setFromTime()');

        // If this is a Pathfinder 2E game, add the world creation seconds
        if(this.gameSystem === GameSystems.PF2E && this.generalSettings.pf2eSync){
            newTime += PF2E.getWorldCreateSeconds(this);
        }
        if(changeAmount !== 0){
            // If the tracking rules are for self or mixed and the clock is running then we make the change.
            if((this.generalSettings.gameWorldTimeIntegration === GameWorldTimeIntegrations.Self || this.generalSettings.gameWorldTimeIntegration === GameWorldTimeIntegrations.Mixed) && this.year.time.timeKeeper.getStatus() === TimeKeeperStatus.Started){
                Logger.debug(`Tracking Rule: Self/Mixed\nClock Is Running, no need to update the date.`)
                const parsedDate = this.year.secondsToDate(newTime);
                this.year.updateTime(parsedDate);
                Renderer.Clock.UpdateListener(`sc_${this.id}_clock`, this.year.time.timeKeeper.getStatus());
                //Something else has changed the world time and we need to update everything to reflect that.
                if((this.year.time.updateFrequency * this.year.time.gameTimeRatio) !== changeAmount){
                    SimpleCalendar.instance.mainApp?.updateApp();
                }
            }
            // If the tracking rules are for self only and we requested the change OR the change came from a combat turn change
            else if((this.generalSettings.gameWorldTimeIntegration=== GameWorldTimeIntegrations.Self || this.generalSettings.gameWorldTimeIntegration === GameWorldTimeIntegrations.Mixed) && (this.year.timeChangeTriggered || this.year.combatChangeTriggered)){
                Logger.debug(`Tracking Rule: Self.\nTriggered Change: Simple Calendar/Combat Turn. Applying Change!`);
                //If we didn't request the change (from a combat change) we need to update the internal time to match the new world time
                if(!this.year.timeChangeTriggered){
                    const parsedDate = this.year.secondsToDate(newTime);
                    this.year.updateTime(parsedDate);
                    // If the current player is the GM then we need to save this new value to the database
                    // Since the current date is updated this will trigger an update on all players as well
                    if(GameSettings.IsGm() && this.primary){
                        this.saveCurrentDate().catch(Logger.error);
                    }
                }
            }
                // If we didn't (locally) request this change then parse the new time into years, months, days and seconds and set those values
            // This covers other modules/built in features updating the world time and Simple Calendar updating to reflect those changes
            else if((this.generalSettings.gameWorldTimeIntegration === GameWorldTimeIntegrations.ThirdParty || this.generalSettings.gameWorldTimeIntegration === GameWorldTimeIntegrations.Mixed) && !this.year.timeChangeTriggered){
                Logger.debug('Tracking Rule: ThirdParty.\nTriggered Change: External Change. Applying Change!');
                const parsedDate = this.year.secondsToDate(newTime);
                this.year.updateTime(parsedDate);
                //We need to save the change so that when the game is reloaded simple calendar will display the correct time
                if(GameSettings.IsGm() && this.primary){
                    this.saveCurrentDate().catch(Logger.error);
                }
            } else {
                Logger.debug(`Not Applying Change!`);
            }
        }
        Logger.debug('Resetting time change triggers.');
        this.year.timeChangeTriggered = false;
        this.year.combatChangeTriggered = false;
    }

    /**
     * Called when a setting is updated, refreshes the configurations for all types
     * @param {string} [type='all']
     */
    public settingUpdate(type: string = 'all'){
        if(type === 'all' || type === 'year'){
            this.year.loadFromSettings(<YearConfig>GameSettings.GetObjectSettings(SettingNames.YearConfiguration));
        }
        if(type === 'all' || type === 'month'){
            Logger.debug('Loading month configuration from settings.');
            const monthData = <MonthConfig[]>GameSettings.GetObjectSettings(SettingNames.MonthConfiguration);
            if(monthData.length){
                Logger.debug('Setting the months from data.');
                this.year.months = [];
                for(let i = 0; i < monthData.length; i++){
                    const newMonth = new Month();
                    newMonth.loadFromSettings(monthData[i]);
                    this.year.months.push(newMonth);
                }
            }
        }
        if(type === 'all' || type === 'weekday'){
            Logger.debug('Loading weekday configuration from settings.');
            const weekdayData = <WeekdayConfig[]>GameSettings.GetObjectSettings(SettingNames.WeekdayConfiguration);
            if(weekdayData.length){
                Logger.debug('Setting the weekdays from data.');
                this.year.weekdays = [];
                for(let i = 0; i < weekdayData.length; i++){
                    const weekday = new Weekday();
                    weekday.loadFromSettings(weekdayData[i]);
                    this.year.weekdays.push(weekday);
                }
            }
        }
        if(type === 'all' || type === 'notes'){
            Logger.debug('Loading notes from settings.');
            const notes = <NoteConfig[]>GameSettings.GetObjectSettings(SettingNames.Notes);
            this.notes = notes.map(n => {
                const note = new Note();
                note.loadFromSettings(n);
                return note;
            });
        }
        if(type === 'all' || type === 'leapyear'){
            Logger.debug('Loading Leap Year Settings');
            this.year.leapYearRule.loadFromSettings(<LeapYearConfig>GameSettings.GetObjectSettings(SettingNames.LeapYearRule));
        }
        if(type === 'all' || type === 'time'){
            Logger.debug('Loading time configuration from settings.');
            this.year.time.loadFromSettings(<TimeConfig>GameSettings.GetObjectSettings(SettingNames.TimeConfiguration));
        }
        if(type === 'all' || type === 'season'){
            Logger.debug('Loading season configuration from settings.');
            const seasonData = <SeasonConfiguration[]>GameSettings.GetObjectSettings(SettingNames.SeasonConfiguration);
            this.year.seasons = [];
            if(seasonData.length){
                Logger.debug('Setting the seasons from data.');
                for(let i = 0; i < seasonData.length; i++){
                    const newSeason = new Season();
                    newSeason.loadFromSettings(seasonData[i]);
                    this.year.seasons.push(newSeason);
                }
            }
        }
        if(type === 'all' || type === 'moon'){
            Logger.debug('Loading moon configuration from settings.');
            const moonData = <MoonConfiguration[]>GameSettings.GetObjectSettings(SettingNames.MoonConfiguration);
            this.year.moons = [];
            if(moonData.length){
                Logger.debug('Setting the moons from data.');
                for(let i = 0; i < moonData.length; i++){
                    const newMoon = new Moon();
                    newMoon.loadFromSettings(moonData[i]);
                    this.year.moons.push(newMoon);
                }
            }
        }
        if(type === 'all' || type === 'general'){
            Logger.debug('Loading General Settings');
            this.generalSettings.loadFromSettings(<GeneralSettingsConfig>GameSettings.GetObjectSettings(SettingNames.GeneralConfiguration));
        }
        if(type === 'all' || type === 'note-categories'){
            this.noteCategories = <NoteCategory[]>GameSettings.GetObjectSettings(SettingNames.NoteCategories);
        }
        this.loadCurrentDate();
    }

    /**
     * Loads the current date data from the settings and applies them to the current year
     */
    public loadCurrentDate(){
        Logger.debug('Loading current date from settings.');
        const currentDate = <CurrentDateConfig>GameSettings.GetObjectSettings(SettingNames.CurrentDate);
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
}
