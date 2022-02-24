import {
    GameSystems,
    GameWorldTimeIntegrations,
    SettingNames,
    TimeKeeperStatus
} from "../../constants";
import Year from "./year";
import Note from "../note";
import Month from "./month";
import {Logger} from "../logging";
import {GameSettings} from "../foundry-interfacing/game-settings";
import {Weekday} from "./weekday";
import Season from "./season";
import Moon from "./moon";
import GeneralSettings from "../configuration/general-settings";
import ConfigurationItemBase from "../configuration/configuration-item-base";
import PF2E from "../systems/pf2e";
import Renderer from "../renderer";
import {generateUniqueId} from "../utilities/string";
import {FormatDateTime, ToSeconds} from "../utilities/date-time";
import{canUser} from "../utilities/permissions";
import {CalManager, MainApplication, SC} from "../index";
import TimeKeeper from "../time/time-keeper";
import NoteStub from "../notes/note-stub";
import Fuse from 'fuse.js'

export default class Calendar extends ConfigurationItemBase{
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
    public notes: NoteStub[] = [];
    /**
     * List of all categories associated with notes
     * @type{Array.<NoteCategory>}
     */
    public noteCategories: SimpleCalendar.NoteCategory[] = [];
    /**
     * The Time Keeper class used for the in game clock
     */
    timeKeeper: TimeKeeper;

    /**
     * Construct a new Calendar class
     * @param {string} id
     * @param {string} name
     * @param {CalendarData} configuration The configuration object for the calendar
     */
    constructor(id: string, name: string, configuration: SimpleCalendar.CalendarData = {id: ''}) {
        super(name);
        this.id = id || generateUniqueId();
        this.year = new Year(0);
        this.timeKeeper = new TimeKeeper(this.id, this.year.time.updateFrequency);
        if(Object.keys(configuration).length > 1){
            this.loadFromSettings(configuration);
        }

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
    }

    /**
     * Creates a cloned version of the Calendar class
     */
    clone(includeNotes: boolean = true): Calendar {
        const c = new Calendar(this.id, this.name);
        c.id = this.id;
        c.name = this.name;
        c.gameSystem = this.gameSystem;
        c.generalSettings = this.generalSettings.clone();
        c.year = this.year.clone();
        if(includeNotes){
            //c.notes = this.notes.map(n => n.clone());
            c.noteCategories = this.noteCategories.map(nc => {return {id: nc.id, name: nc.name, textColor: nc.textColor, color: nc.color}});
        }
        return c;
    }

    /**
     * Creates a template for the calendar class
     */
    toTemplate(): SimpleCalendar.HandlebarTemplateData.Calendar{
        let sYear = this.year.selectedYear, sMonth, sDay;

        const currentMonthDay = this.year.getMonthAndDayIndex();
        const selectedMonthDay = this.year.getMonthAndDayIndex('selected');
        const visibleMonthDay = this.year.getMonthAndDayIndex('visible');

        if(selectedMonthDay.month !== undefined){
            sMonth = selectedMonthDay.month;
            sDay = selectedMonthDay.day || 0;
        } else {
            sYear = this.year.numericRepresentation;
            sMonth = currentMonthDay.month || 0;
            sDay = currentMonthDay.day || 0;
        }

        return {
            ...super.toTemplate(),
            calendarDisplayId: `sc_${this.id}_calendar`,
            clockDisplayId: `sc_${this.id}_clock`,
            currentYear: this.year.toTemplate(),
            gameSystem: this.gameSystem,
            id: this.id,
            name: this.name,
            notes: this.getNotesForDay().map(n => n.toTemplate()),
            calendarDisplay: FormatDateTime({year: this.year.visibleYear, month: visibleMonthDay.month || 0, day: 0, hour: 0, minute: 0, seconds: 0}, this.generalSettings.dateFormat.monthYear, this),
            selectedDisplay: FormatDateTime({year: sYear, month: sMonth, day: sDay, hour: 0, minute: 0, seconds: 0}, this.generalSettings.dateFormat.date, this),
            timeDisplay: FormatDateTime({year: 0, month: 0, day: 0, ...this.year.time.getCurrentTime()}, this.generalSettings.dateFormat.time, this),
            visibleDate: {year:  this.year.visibleYear, month: visibleMonthDay.month || 0}
        };
    }

    toConfig(): SimpleCalendar.CalendarData {
        return <SimpleCalendar.CalendarData>{
            id: this.id,
            name: this.name,
            currentDate: this.getCurrentDate(),
            general: this.generalSettings.toConfig(),
            leapYear: this.year.leapYearRule.toConfig(),
            months: this.year.months.map(m => m.toConfig()),
            moons: this.year.moons.map(m => m.toConfig()),
            noteCategories: this.noteCategories,
            seasons: this.year.seasons.map(s => s.toConfig()),
            time: this.year.time.toConfig(),
            weekdays: this.year.weekdays.map(w => w.toConfig()),
            year: this.year.toConfig()
        };
    }

    loadFromSettings(config: SimpleCalendar.CalendarData) {
        if(config.id){
            this.id = config.id;
            this.timeKeeper.calendarId = this.id;
        }
        if(config.name){
            this.name = config.name;
        }

        if(config.year){
            this.year.loadFromSettings(config.year);
        } else if(config.yearSettings){
            this.year.loadFromSettings(config.yearSettings);
        } else {
            Logger.warn(`Invalid year configuration found when loading calendar "${this.name}", setting year to default configuration`);
            this.year = new Year(0);
        }

        if(config.months || config.monthSettings){
            this.year.months = [];
            const configMonths: SimpleCalendar.MonthData[] = config.months || config.monthSettings || [];
            for(let i = 0; i < configMonths.length; i++){
                const newMonth = new Month();
                newMonth.loadFromSettings(configMonths[i]);
                this.year.months.push(newMonth);
            }
        }

        if(config.weekdays || config.weekdaySettings){
            this.year.weekdays = [];
            const configWeekdays: SimpleCalendar.WeekdayData[] = config.weekdays || config.weekdaySettings || [];
            for(let i = 0; i < configWeekdays.length; i++){
                const newW = new Weekday();
                newW.loadFromSettings(configWeekdays[i]);
                this.year.weekdays.push(newW);
            }
        }

        if(config.leapYear){
            this.year.leapYearRule.loadFromSettings(config.leapYear);
        } else if(config.leapYearSettings){
            this.year.leapYearRule.loadFromSettings(config.leapYearSettings);
        }

        if(config.time){
            this.year.time.loadFromSettings(config.time);
            this.timeKeeper.updateFrequency = this.year.time.updateFrequency;
        } else if(config.timeSettings){
            this.year.time.loadFromSettings(config.timeSettings);
            this.timeKeeper.updateFrequency = this.year.time.updateFrequency;
        }

        if(config.seasons || config.seasonSettings){
            this.year.seasons = [];
            const configSeasons: SimpleCalendar.SeasonData[] = config.seasons || config.seasonSettings || [];
            for(let i = 0; i < configSeasons.length; i++){
                const newW = new Season();
                newW.loadFromSettings(configSeasons[i]);
                this.year.seasons.push(newW);
            }
        }

        if(config.moons || config.moonSettings){
            this.year.moons = [];
            const configMoons: SimpleCalendar.MoonData[] = config.moons || config.moonSettings || [];
            for(let i = 0; i < configMoons.length; i++){
                const newW = new Moon();
                newW.loadFromSettings(configMoons[i]);
                this.year.moons.push(newW);
            }
        }

        if(config.general){
            this.generalSettings.loadFromSettings(config.general);
        } else if(config.generalSettings){
            this.generalSettings.loadFromSettings(config.generalSettings);
        }

        if(config.noteCategories){
            this.noteCategories = config.noteCategories;
        }

        if(config.currentDate){
            this.year.numericRepresentation = config.currentDate.year;
            this.year.selectedYear = config.currentDate.year;
            this.year.visibleYear = config.currentDate.year;

            this.year.resetMonths('current');
            this.year.resetMonths('visible');

            if(config.currentDate.month > -1 && config.currentDate.month < this.year.months.length){
                this.year.months[config.currentDate.month].current = true;
                this.year.months[config.currentDate.month].visible = true;
                if(config.currentDate.day > -1 && config.currentDate.day < this.year.months[config.currentDate.month].days.length){
                    this.year.months[config.currentDate.month].days[config.currentDate.day].current = true;
                } else {
                    Logger.warn('Saved current day could not be found in this month, perhaps number of days has changed. Setting current day to first day of month');
                    this.year.months[config.currentDate.month].days[0].current = true;
                }
            } else {
                Logger.warn('Saved current month could not be found, perhaps months have changed. Setting current month to the first month');
                this.year.months[0].current = true;
                this.year.months[0].visible = true;
                this.year.months[0].days[0].current = true;
            }
            this.year.time.seconds = config.currentDate.seconds;
            if(this.year.time.seconds === undefined){
                this.year.time.seconds = 0;
            }
        } else if(this.year.months.length) {
            Logger.warn('No current date setting found, setting default current date.');
            this.year.months[0].current = true;
            this.year.months[0].visible = true;
            this.year.months[0].days[0].current = true;
        } else {
            Logger.error('Error setting the current date.');
        }
    }

    /**
     * Gets the current date configuration object
     * @private
     */
    getCurrentDate(): SimpleCalendar.CurrentDateData{
        const monthDayIndex = this.year.getMonthAndDayIndex();
        return {
            year: this.year.numericRepresentation,
            month: monthDayIndex.month || 0,
            day: monthDayIndex.day || 0,
            seconds: this.year.time.seconds
        };
    }

    /**
     * Gets the date and time for the selected date, or if not date is selected the current date
     */
    getDateTime(): SimpleCalendar.DateTime {
        const dt: SimpleCalendar.DateTime = {
            year: 0,
            month: 0,
            day: 0,
            hour: 0,
            minute: 0,
            seconds: 0
        };
        const selectedMonthDayIndex = this.year.getMonthAndDayIndex('selected');
        const currentMonthDayIndex = this.year.getMonthAndDayIndex();
        if(selectedMonthDayIndex.month !== undefined){
            dt.year = this.year.selectedYear;
            dt.month = selectedMonthDayIndex.month;
            dt.day = selectedMonthDayIndex.day || 0;
        } else {
            dt.year = this.year.numericRepresentation;
            dt.month = currentMonthDayIndex.month || 0;
            dt.day = currentMonthDayIndex.day || 0;

            const time = this.year.time.getCurrentTime();
            dt.hour = time.hour;
            dt.minute = time.minute;
            dt.seconds = time.seconds;
        }
        return dt;
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
                    //if(note.isVisible(year, month.numericRepresentation, day.numericRepresentation)){
                    //    dayNotes.push(note);
                    //}
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
    public searchNotes(term: string, options: SimpleCalendar.SearchOptions.Fields): SimpleCalendar.HandlebarTemplateData.NoteTemplate[] {
        const results: {match: number, note: Note}[] = [];
        term = term.toLowerCase();

        /*const f = new Fuse(this.notes, {
            keys: ['name']
        });
        const res = f.search(term);

        console.log(res);*/

        /*this.notes.forEach((note) => {
            if((GameSettings.IsGm() || (!GameSettings.IsGm() && note.playerVisible))){
                let match = 0;
                const noteFormattedDate = GetDisplayDate(this,{year: note.year, month: note.month, day: note.day, hour: note.hour, minute: note.minute, seconds: 0}, note.endDate, note.allDay).toLowerCase();
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
        });*/
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
        let currentNotes = (<SimpleCalendar.NoteConfig[]>GameSettings.GetObjectSettings(SettingNames.Notes)).map(n => {
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
        if(this.generalSettings.postNoteRemindersOnFoundryLoad){
            /*const userID = GameSettings.UserID();
            const noteRemindersForPlayer = this.notes.filter(n => n.remindUsers.indexOf(userID) > -1);
            if(noteRemindersForPlayer.length){
                const currentMonth = this.year.getMonth();
                const currentDay = currentMonth? currentMonth.getDay() : this.year.months[0].days[0];
                const time = this.year.time.getCurrentTime();
                const currentHour = time.hour;
                const currentMinute = time.minute;

                const currentDate: SimpleCalendar.DateTime = {
                    year: this.year.numericRepresentation,
                    month: currentMonth? currentMonth.numericRepresentation : 1,
                    day: currentDay? currentDay.numericRepresentation : 1,
                    hour: currentHour,
                    minute: currentMinute,
                    seconds: 0
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
            }*/
        }
    }

    //-------------------------------
    // Date/Time Management
    //-------------------------------

    /**
     * Converts current date into seconds
     */
    public toSeconds(){
        const monthDay = this.year.getMonthAndDayIndex();
        return ToSeconds(this, this.year.numericRepresentation, monthDay.month || 0, monthDay.day || 0, true);
    }

    public changeDateTime(interval: SimpleCalendar.DateTimeParts, yearChangeUpdateMonth: boolean = true, syncChange: boolean = false){
        if(canUser((<Game>game).user, SC.globalConfiguration.permissions.changeDateTime)){
            let change = false;
            if(interval.year){
                this.year.changeYear(interval.year, yearChangeUpdateMonth, 'current');
                change = true;
            }
            if(interval.month){
                this.year.changeMonth(interval.month, 'current');
                change = true;
            }
            if(interval.day){
                this.year.changeDay(interval.day);
                change = true;
            }
            if(interval.hour || interval.minute || interval.seconds){
                const dayChange = this.year.time.changeTime(interval.hour, interval.minute, interval.seconds);
                if(dayChange !== 0){
                    this.year.changeDay(dayChange);
                }
                change = true;
            }

            if(change && !syncChange){
                if(SC.globalConfiguration.syncCalendars){
                    const calendars = CalManager.getAllCalendars();
                    for(let i = 0; i < calendars.length; i++){
                        if(calendars[i].id !== this.id){
                            calendars[i].changeDateTime(interval, yearChangeUpdateMonth, true);
                        }
                    }
                }
                CalManager.saveCalendars().catch(Logger.error);
                this.syncTime().catch(Logger.error);
                MainApplication.updateApp();
            }
            return true;
        } else {
            GameSettings.UiNotification(GameSettings.Localize('FSC.Warn.Macros.GMUpdate'), 'warn');
        }
        return false;
    }

    /**
     * Sets the current game world time to match what our current time is
     */
    async syncTime(force: boolean = false){
        // Only if the time tracking rules are set to self or mixed
        if(canUser((<Game>game).user, SC.globalConfiguration.permissions.changeDateTime) && (this.generalSettings.gameWorldTimeIntegration === GameWorldTimeIntegrations.Self || this.generalSettings.gameWorldTimeIntegration === GameWorldTimeIntegrations.Mixed)){
            Logger.debug(`Year.syncTime()`);
            const totalSeconds = this.toSeconds();
            // If the calculated seconds are different from what is set in the game world time, update the game world time to match sc's time
            if(totalSeconds !== (<Game>game).time.worldTime || force){
                //Let the local functions know that we already updated this time
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
            if((this.generalSettings.gameWorldTimeIntegration === GameWorldTimeIntegrations.Self || this.generalSettings.gameWorldTimeIntegration === GameWorldTimeIntegrations.Mixed) && this.timeKeeper.getStatus() === TimeKeeperStatus.Started){
                Logger.debug(`Tracking Rule: Self/Mixed\nClock Is Running, no need to update the date.`)
                const parsedDate = this.year.secondsToDate(newTime);
                this.year.updateTime(parsedDate);
                Renderer.Clock.UpdateListener(`sc_${this.id}_clock`, this.timeKeeper.getStatus());
                //Something else has changed the world time and we need to update everything to reflect that.
                if((this.year.time.updateFrequency * this.year.time.gameTimeRatio) !== changeAmount){
                    MainApplication.updateApp();
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
                    if(GameSettings.IsGm() && SC.primary){
                        CalManager.saveCalendars().catch(Logger.error);
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
                if(GameSettings.IsGm() && SC.primary){
                    CalManager.saveCalendars().catch(Logger.error);
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
     * If we have determined that the system does not change the world time when a combat round is changed we run this function to update the time by the set amount.
     * @param {Combat} combat The current active combat
     */
    processOwnCombatRoundTime(combat: Combat){
        let roundSeconds = SC.globalConfiguration.secondsInCombatRound;
        let roundsPassed = 1;

        if(combat.hasOwnProperty('previous') && combat['previous'].round){
            roundsPassed = combat.round - combat['previous'].round;
        }
        if(roundSeconds !== 0 && roundsPassed !== 0){
            const parsedDate = this.year.secondsToDate(this.toSeconds() + (roundSeconds * roundsPassed));
            this.year.updateTime(parsedDate);
            // If the current player is the GM then we need to save this new value to the database
            // Since the current date is updated this will trigger an update on all players as well
            if(GameSettings.IsGm() && SC.primary){
                CalManager.saveCalendars().catch(Logger.error);
            }
        }
    }
}
