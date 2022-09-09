import Sockets from "./sockets";
import {GameSettings} from "./foundry-interfacing/game-settings";
import {
    CombatPauseRules,
    ModuleName,
    NoteReminderNotificationType,
    SettingNames,
    SocketTypes,
    Themes,
    TimeKeeperStatus
} from "../constants";
import {Logger} from "./logging";
import {CalManager, MainApplication, NManager} from "./index";
import ConfigurationApp from "./applications/configuration-app";
import MainApp from "./applications/main-app";
import UserPermissions from "./configuration/user-permissions";
import {canUser} from "./utilities/permissions";
import GameSockets from "./foundry-interfacing/game-sockets";
import {RoundData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/client/data/documents/combat";
import MultiSelect from "./renderer/multi-select";
import {GetThemeName} from "./utilities/visual";
import {FoundryVTTGameData} from "./foundry-interfacing/game-data";

/**
 * The global Simple Calendar Controller class
 */
export default class SCController {
    /**
     * If this GM is considered the primary GM, if so all requests from players are filtered through this account.
     */
    public primary: boolean = false;
    /**
     * Gets the current active calendar
     */
    public get activeCalendar(){
        return CalManager.getActiveCalendar();
    }
    /**
     * The sockets class for communicating with the connected players over our own socket
     */
    sockets: Sockets;
    /**
     * The client specific settings for Simple Calendar
     */
    public clientSettings: SimpleCalendar.ClientSettingsData;
    /**
     * The global configuration settings for Simple Calendar
     */
    public globalConfiguration: SimpleCalendar.GlobalConfigurationData;

    constructor() {
        this.sockets = new Sockets();
        this.clientSettings = {id: '', theme: Themes[0].key, openOnLoad: true, openCompact: false, rememberPosition: true, appPosition: {}, noteReminderNotification: NoteReminderNotificationType.whisper};
        this.globalConfiguration = {
            id: '',
            version: '',
            calendarsSameTimestamp: false,
            combatPauseRule: CombatPauseRules.Active,
            permissions: new UserPermissions(),
            secondsInCombatRound: 6,
            syncCalendars: false,
            showNotesFolder: false
        };
    }

    /**
     * Called when the theme being used has changed and all currently open dialogs need to be updated to the new theme
     */
    public static ThemeChange(){
        this.LoadThemeCSS();
        const newTheme = GetThemeName();
        const themes = Themes.map(t => t.key);
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
        //Update Open Journals
        document.querySelectorAll('.journal-sheet.simple-calendar').forEach(j => {
            j.classList.remove(...themes);
            j.classList.add(newTheme);
        });
    }

    /**
     * Loads any extra css files required for the specified theme
     * This is required for all themes other than Light and Dark
     */
    public static LoadThemeCSS(setTheme: string = ''){
        const theme = setTheme? setTheme : GetThemeName();
        const cssExists = document.head.querySelector(`#theme-${theme}`);
        if(cssExists === null){
            const newStyle = document.createElement('link');
            newStyle.setAttribute('id', `theme-${theme}`);
            newStyle.setAttribute('rel', 'stylesheet');
            newStyle.setAttribute('type', 'text/css');
            newStyle.setAttribute('href', getRoute(`modules/${ModuleName}/styles/themes/${theme}.css`));
            document.head.append(newStyle);
        }
    }

    /**
     * Initialize the sockets
     * Check for note reminders
     */
    public initialize(){
        this.sockets.initialize();
        NManager.checkNoteTriggers(this.activeCalendar.id, true);
        //Close all open multi selects except the one being interacted with
        document.body.addEventListener('click', MultiSelect.BodyEventListener);
    }

    /**
     * Load the global configuration and apply it
     */
    public load(){
        SCController.LoadThemeCSS();
        const globalConfiguration = <SimpleCalendar.GlobalConfigurationData>GameSettings.GetObjectSettings(SettingNames.GlobalConfiguration);
        this.globalConfiguration.permissions.loadFromSettings(globalConfiguration.permissions);
        this.globalConfiguration.secondsInCombatRound = globalConfiguration.secondsInCombatRound;
        this.globalConfiguration.calendarsSameTimestamp = globalConfiguration.calendarsSameTimestamp;
        this.globalConfiguration.syncCalendars = globalConfiguration.syncCalendars;
        this.globalConfiguration.showNotesFolder = globalConfiguration.showNotesFolder;
        if(globalConfiguration.hasOwnProperty('combatPauseRule')){
            this.globalConfiguration.combatPauseRule = globalConfiguration.combatPauseRule;
        }
        this.clientSettings.theme = GetThemeName();
        this.clientSettings.openOnLoad = GameSettings.GetBooleanSettings(SettingNames.OpenOnLoad);
        this.clientSettings.openCompact = GameSettings.GetBooleanSettings(SettingNames.OpenCompact);
        this.clientSettings.rememberPosition = GameSettings.GetBooleanSettings(SettingNames.RememberPosition);
        this.clientSettings.appPosition = <SimpleCalendar.AppPosition>GameSettings.GetObjectSettings(SettingNames.AppPosition);
        this.clientSettings.noteReminderNotification = <NoteReminderNotificationType>GameSettings.GetStringSettings(SettingNames.NoteReminderNotification);
    }

    /**
     * Reloads certain portions of the client and global configuration after a change has been made.
     */
    public reload(){
        SCController.LoadThemeCSS();
        this.clientSettings.theme = GetThemeName();
    }

    /**
     * Save the global configuration and the calendar configuration
     */
    public save(globalConfig: SimpleCalendar.GlobalConfigurationData | null = null, clientConfig: SimpleCalendar.ClientSettingsData | null = null){
        CalManager.saveCalendars().catch(Logger.error);
        if(globalConfig && clientConfig){

            const gc: SimpleCalendar.GlobalConfigurationData = {
                id: '',
                version: GameSettings.GetModuleVersion(),
                permissions: globalConfig.permissions,
                secondsInCombatRound: globalConfig.secondsInCombatRound,
                calendarsSameTimestamp: globalConfig.calendarsSameTimestamp,
                syncCalendars: globalConfig.syncCalendars,
                showNotesFolder: globalConfig.showNotesFolder,
                combatPauseRule: globalConfig.combatPauseRule
            };
            //Save the client settings
            GameSettings.SaveStringSetting(`${FoundryVTTGameData.worldId}.${SettingNames.Theme}`, clientConfig.theme, false).then(this.reload.bind(this)).catch(Logger.error);
            GameSettings.SaveBooleanSetting(SettingNames.OpenOnLoad, clientConfig.openOnLoad, false).catch(Logger.error);
            GameSettings.SaveBooleanSetting(SettingNames.OpenCompact, clientConfig.openCompact, false).catch(Logger.error);
            GameSettings.SaveBooleanSetting(SettingNames.RememberPosition, clientConfig.rememberPosition, false).catch(Logger.error);
            GameSettings.SaveObjectSetting(SettingNames.AppPosition, clientConfig.appPosition, false).catch(Logger.error);
            GameSettings.SaveStringSetting(SettingNames.NoteReminderNotification, clientConfig.noteReminderNotification, false).catch(Logger.error);
            //Save the global configuration (triggers the load function)
            GameSettings.SaveObjectSetting(SettingNames.GlobalConfiguration, gc)
                .then(() => GameSockets.emit({type: SocketTypes.mainAppUpdate, data: {}}))
                .catch(Logger.error);
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
        if(canUser((<Game>game).user, this.globalConfiguration.permissions.viewCalendar)){
            let tokenControls = controls.find(c => c.name === "notes" );
            if(tokenControls && tokenControls.hasOwnProperty('tools')){
                tokenControls.tools.push({
                    name: "calendar",
                    title: "FSC.Title",
                    icon: "fas fa-calendar simple-calendar-icon",
                    button: true,
                    onClick: MainApplication.render.bind(MainApplication)
                });
            }
        }
    }

    /**
     * Checks settings to see if the note directory should be shown or hidden from the journal directory
     */
    public async renderJournalDirectory(tab: JournalDirectory, jquery: JQuery){
        await NManager.createJournalDirectory();
        if(!this.globalConfiguration.showNotesFolder && NManager.noteDirectory){
            const folder = jquery.find(`.folder[data-folder-id='${NManager.noteDirectory.id}']`);
            if(folder){
                folder.remove();
            }
        }
    }

    /**
     * Checks settings to see if the note directory should be shown or hidden from the journal sheet directory dropdown
     */
    public renderJournalSheet(sheet: JournalSheet, jquery:JQuery){
        if(!this.globalConfiguration.showNotesFolder && NManager.noteDirectory){
            const option = jquery.find(`option[value='${NManager.noteDirectory.id}']`);
            if(option){
                option.remove();
            }
        }
    }

    /**
     * Checks to see if the Simple Calendar not directory should be shown and if not removes all Simple Calendar notes from the list of available journal entries.
     * @param config
     * @param jquery
     * @param data
     */
    public renderSceneConfig(config: SceneConfig, jquery: JQuery, data: SceneConfig.Data){
        if(!this.globalConfiguration.showNotesFolder && data.journals){
            for(let i = 0; i < data.journals.length; i++){
                //@ts-ignore
                const je = (<Game>game).journal?.get(data.journals[i].id);
                if(je){
                    const nd = <SimpleCalendar.NoteData>je.getFlag(ModuleName, "noteData");
                    if(nd){
                        //@ts-ignore
                        const option = jquery.find(`option[value='${data.journals[i].id}']`);
                        if(option){
                            option.remove();
                        }
                    }
                }
            }
        }
    }


    /**
     * Triggered when the games pause state is changed.
     * @param paused
     */
    public gamePaused(paused: boolean){
        if(this.activeCalendar.time.unifyGameAndClockPause){
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
        this.activeCalendar.setFromTime(newTime, delta);
    }

    /**
     * Triggered when a combatant is added to a combat.
     * @param combatant The combatant details
     * @param options Options associated with creating the combatant
     * @param id The ID of the creation
     */
    public createCombatant(combatant: Combatant, options: any, id: string){
        const combatList = (<Game>game).combats;
        //If combat is running or if the combat list is undefined, skip this check
        if(!this.activeCalendar.time.combatRunning && combatList){
            const combat = combatList.find(c => c.id === combatant.parent?.id);
            const activeScene = GameSettings.GetSceneForCombatCheck();
            //If the combat has started and the current active scene is the scene for the combat then set that there is a combat running.
            if(combat && combat.started && ((activeScene !== null && combat.scene && combat.scene.id === activeScene.id) || activeScene === null)){
                this.activeCalendar.time.combatRunning = true;
            }
        }
    }

    /**
     * Triggered when a combat is creat/started/turn advanced
     * @param combat The specific combat data
     * @param round The current turns data
     * @param time The amount of time that has advanced
     */
    public combatUpdate(combat: Combat, round: RoundData, time: any){
        const activeScene = GameSettings.GetSceneForCombatCheck();
        if(combat.started && ((activeScene !== null && combat.scene && combat.scene.id === activeScene.id) || activeScene === null)){
            this.activeCalendar.time.combatRunning = true;

            //If time does not have the advanceTime property the combat was just started
            if(time && time.hasOwnProperty('advanceTime')){
                if(time.advanceTime !== 0){
                    this.activeCalendar.combatChangeTriggered = true;
                } else {
                    // System does not advance time when combat rounds change, check our own settings
                    this.activeCalendar.processOwnCombatRoundTime(combat);
                }
            }
        }
    }

    /**
     * Triggered when a combat is finished and removed
     * @param combat The specific combat data
     */
    public combatDelete(combat: Combat){
        const activeScene = GameSettings.GetSceneForCombatCheck();
        if(activeScene !== null && combat.scene && combat.scene.id === activeScene.id){
            this.activeCalendar.time.combatRunning = false;
        }
    }

    /**
     * Triggered when the canvas is initialized.
     * Using this to check if the user has changed Scenes.
     * @param canvas The canvas data
     */
    public canvasInit(canvas: Canvas){
        if(GameSettings.IsGm() && this.primary && this.globalConfiguration.combatPauseRule === CombatPauseRules.Current){
            const activeScene = canvas.scene? canvas.scene.id : null;
            const combatsInCurrent = (<Game>game).combats?.filter(combat => combat.started && combat.scene?.id === activeScene);
            this.activeCalendar.time.combatRunning = !!(combatsInCurrent && combatsInCurrent.length);
        }
    }

    /**
     * Triggered when a chat message is sent
     * @param chatLog
     * @param message
     * @param chatData
     */
    /*public onChatMessage(chatLog: ChatLog, message: string, chatData: ChatMessageData){
        return ParseChatCommand(message.trim());
    }*/

    /*public onRenderChatMessage(chatMessage: ChatMessage, html: JQuery, messageData: ChatMessageData){
        const element = html[0];
        if(element){
            const btn = element.querySelector('.fsc-control[data-date]');
            if(btn){
                let dateParts = null;
                try{
                    dateParts = JSON.parse(btn.getAttribute('data-date') || '');
                } catch (e: any){
                    Logger.error(e);
                }
                btn.addEventListener('click', showCalendar.bind(null , dateParts, false, 'active'));
            }
        }
    }*/
}