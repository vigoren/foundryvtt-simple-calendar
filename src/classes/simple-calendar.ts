import Sockets from "./sockets";
import {GameSettings} from "./foundry-interfacing/game-settings";
import {NoteRepeat, SettingNames, Themes, TimeKeeperStatus} from "../constants";
import {Logger} from "./logging";
import {RoundData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/foundry.js/clientDocuments/combat";
import {AppPosition, ClientSettings, GlobalConfiguration, SCDateSelector, UserPermissionsConfig} from "../interfaces";
import Note from "./note";
import {NotesApp} from "./applications/notes-app";
import {CalManager, MainApplication} from "./index";
import ConfigurationApp from "./applications/configuration-app";
import MainApp from "./applications/main-app";
import UserPermissions from "./configuration/user-permissions";

export default class SimpleCalendar {
    /**
     * If this GM is considered the primary GM, if so all requests from players are filtered through this account.
     * @type {boolean}
     */
    public primary: boolean = false;
    /**
     * Keeps track of the new note dialog, we only ever need 1 new note dialog.
     */
    public newNoteApp: NotesApp | undefined;
    /**
     * Gets the current active calendar
     */
    public get activeCalendar(){
        return CalManager.getActiveCalendar();
    }
    /**
     * The sockets class for communicating with the connected players over our own socket
     * @type {Sockets}
     */
    sockets: Sockets;

    public clientSettings: ClientSettings;

    public globalConfiguration: GlobalConfiguration;

    constructor() {
        this.sockets = new Sockets();
        this.clientSettings = {id: '', theme: Themes.dark, openOnLoad: true, openCompact: false, rememberPosition: true, appPosition: {}};
        this.globalConfiguration = {
            id: '',
            permissions: new UserPermissions(),
            secondsInCombatRound: 6,

        };
    }

    public static ThemeChange(){
        const newTheme = GameSettings.GetStringSettings(SettingNames.Theme);
        const themes = [Themes.light, Themes.dark]
        //Update the main app
        const mainApp = document.getElementById(MainApp.appWindowId);
        if(mainApp){
            mainApp.classList.remove(...themes);
            mainApp.classList.add(newTheme);
        }
        //Update the configuration (if open)
        const configApp = document.getElementById(ConfigurationApp.appWindowId);
        if(configApp){
            configApp.classList.remove(...themes);
            configApp.classList.add(newTheme);
        }
    }

    public initialize(){
        this.sockets.initialize();
        this.checkNoteReminders();
    }

    /**
     * Load the global configuration and apply it
     */
    public load(){
        const globalConfiguration = <GlobalConfiguration>GameSettings.GetObjectSettings(SettingNames.GlobalConfiguration);
        this.globalConfiguration.permissions.loadFromSettings(globalConfiguration.permissions);
        this.globalConfiguration.secondsInCombatRound = globalConfiguration.secondsInCombatRound;
        this.clientSettings.theme = <Themes>GameSettings.GetStringSettings(SettingNames.Theme);
        this.clientSettings.openOnLoad = GameSettings.GetBooleanSettings(SettingNames.OpenOnLoad);
        this.clientSettings.openCompact = GameSettings.GetBooleanSettings(SettingNames.OpenCompact);
        this.clientSettings.rememberPosition = GameSettings.GetBooleanSettings(SettingNames.RememberPosition);
        this.clientSettings.appPosition = <AppPosition>GameSettings.GetObjectSettings(SettingNames.AppPosition);
    }

    /**
     * Save the global configuration and the calendar configuration
     */
    public save(globalConfig: GlobalConfiguration | null = null, clientConfig: ClientSettings | null = null){
        CalManager.saveCalendars();
        if(globalConfig && clientConfig){
            const gc = {
                permissions: globalConfig.permissions.toConfig(),
                secondsInCombatRound: globalConfig.secondsInCombatRound
            };
            //Save the client settings
            GameSettings.SaveStringSetting(SettingNames.Theme, clientConfig.theme, false).catch(Logger.error);
            GameSettings.SaveBooleanSetting(SettingNames.OpenOnLoad, clientConfig.openOnLoad, false).catch(Logger.error);
            GameSettings.SaveBooleanSetting(SettingNames.OpenCompact, clientConfig.openCompact, false).catch(Logger.error);
            GameSettings.SaveBooleanSetting(SettingNames.RememberPosition, clientConfig.rememberPosition, false).catch(Logger.error);
            GameSettings.SaveObjectSetting(SettingNames.AppPosition, clientConfig.appPosition, false).catch(Logger.error);
            //Save the global configuration (triggers the load function)
            GameSettings.SaveObjectSetting(SettingNames.GlobalConfiguration, gc).catch(Logger.error);
        }
    }

    //---------------------------
    // Foundry Hooks
    //---------------------------
    /**
     * Adds the calendar button to the token button list
     * @param controls
     */
    public getSceneControlButtons(controls: any[]){
        if(this.activeCalendar.canUser((<Game>game).user, this.globalConfiguration.permissions.viewCalendar)){
            let tokenControls = controls.find(c => c.name === "token" );
            if(tokenControls && tokenControls.hasOwnProperty('tools')){
                tokenControls.tools.push({
                    name: "calendar",
                    title: "FSC.ButtonTitle",
                    icon: "fas fa-calendar",
                    button: true,
                    onClick: MainApplication.showApp.bind(MainApplication)
                });
            }
        }
    }

    /**
     * Triggered when the games pause state is changed.
     * @param paused
     */
    public gamePaused(paused: boolean){
        if(this.activeCalendar.year.time.unifyGameAndClockPause){
            if(!(<Game>game).paused){
                this.activeCalendar.timeKeeper.start(true);
            } else {
                this.activeCalendar.timeKeeper.setStatus(TimeKeeperStatus.Paused);
            }
        }
    }

    /**
     * Triggered when anything updates the game world time
     * @param {number} newTime The total time in seconds
     * @param {number} delta How much the newTime has changed from the old time in seconds
     */
    public worldTimeUpdate(newTime: number, delta: number){
        Logger.debug(`World Time Update, new time: ${newTime}. Delta of: ${delta}.`);
        this.activeCalendar.setFromTime(newTime, delta);
    }

    /**
     * Triggered when a combatant is added to a combat.
     * @param {Combatant} combatant The combatant details
     * @param {object} options Options associated with creating the combatant
     * @param {string} id The ID of the creation
     */
    public createCombatant(combatant: Combatant, options: any, id: string){
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
    public combatUpdate(combat: Combat, round: RoundData, time: any){
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
    public combatDelete(combat: Combat){
        Logger.debug('Combat Ended');
        const scenes = (<Game>game).scenes;
        const activeScene = scenes? scenes.active? scenes.active.id : null : null;
        if(activeScene !== null && combat.scene && combat.scene.id === activeScene){
            this.activeCalendar.year.time.combatRunning = false;
        }
    }

    //---------------------------
    // Note Functionality
    //---------------------------
    /**
     * Opens the new note application for creating a new note.
     */
    public openNewNoteApp(){
        const currentMonth = this.activeCalendar.year.getMonth('selected') || this.activeCalendar.year.getMonth();
        if(currentMonth){
            const currentDay = currentMonth.getDay('selected') || currentMonth.getDay();
            if(currentDay){
                const year = this.activeCalendar.year.selectedYear || this.activeCalendar.year.numericRepresentation;
                const newNote = new Note();
                newNote.initialize(year, currentMonth.numericRepresentation, currentDay.numericRepresentation, currentMonth.name);
                if(this.newNoteApp !== undefined && !this.newNoteApp.rendered){
                    this.newNoteApp.closeApp();
                    this.newNoteApp = undefined;
                }
                if(this.newNoteApp === undefined){
                    this.newNoteApp = new NotesApp(newNote);
                    this.newNoteApp.showApp();
                } else {
                    this.newNoteApp.bringToTop();
                    this.newNoteApp.maximize().catch(Logger.error);
                }
            } else {
                GameSettings.UiNotification(GameSettings.Localize("FSC.Error.Note.NoSelectedDay"), 'warn');
            }
        } else {
            GameSettings.UiNotification(GameSettings.Localize("FSC.Error.Note.NoSelectedMonth"), 'warn');
        }
    }

    /**
     * Checks to see if any note reminders needs to be sent to players for the current date.
     * @param {boolean} [justTimeChange=false] If only the time (hour, minute, second) has changed or not
     */
    public checkNoteReminders(justTimeChange: boolean = false){
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