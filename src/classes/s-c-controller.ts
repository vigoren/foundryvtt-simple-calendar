import Sockets from "./sockets";
import {GameSettings} from "./foundry-interfacing/game-settings";
import {SettingNames, Themes, TimeKeeperStatus} from "../constants";
import {Logger} from "./logging";
import {RoundData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/foundry.js/clientDocuments/combat";
import {CalManager, MainApplication, NManager} from "./index";
import ConfigurationApp from "./applications/configuration-app";
import MainApp from "./applications/main-app";
import UserPermissions from "./configuration/user-permissions";
import {canUser} from "./utilities/permissions";

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
     * @type {Sockets}
     */
    sockets: Sockets;

    public clientSettings: SimpleCalendar.ClientSettingsData;

    public globalConfiguration: SimpleCalendar.GlobalConfigurationData;

    constructor() {
        this.sockets = new Sockets();
        this.clientSettings = {id: '', theme: Themes.dark, openOnLoad: true, openCompact: false, rememberPosition: true, appPosition: {}};
        this.globalConfiguration = {
            id: '',
            version: '',
            calendarsSameTimestamp: false,
            permissions: new UserPermissions(),
            secondsInCombatRound: 6,
            syncCalendars: false
        };
    }

    public static ThemeChange(){
        this.LoadThemeCSS();
        const newTheme = GameSettings.GetStringSettings(SettingNames.Theme);
        const themes = [Themes.light, Themes.dark, Themes.classic]
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
    public static LoadThemeCSS(){
        const theme = GameSettings.GetStringSettings(SettingNames.Theme);
        if(theme !== Themes.dark && theme !== Themes.light){
            const cssExists = document.head.querySelector(`#theme-${theme}`);
            if(cssExists === null){
                const newStyle = document.createElement('link');
                newStyle.setAttribute('id', `theme-${theme}`);
                newStyle.setAttribute('rel', 'stylesheet');
                newStyle.setAttribute('type', 'text/css');
                newStyle.setAttribute('href', `modules/foundryvtt-simple-calendar/styles/themes/${theme}.css`);
                document.head.append(newStyle);
            }
        }
    }

    public initialize(){
        this.sockets.initialize();
        NManager.checkNoteReminders(this.activeCalendar.id, true);
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
        this.clientSettings.theme = <Themes>GameSettings.GetStringSettings(SettingNames.Theme);
        this.clientSettings.openOnLoad = GameSettings.GetBooleanSettings(SettingNames.OpenOnLoad);
        this.clientSettings.openCompact = GameSettings.GetBooleanSettings(SettingNames.OpenCompact);
        this.clientSettings.rememberPosition = GameSettings.GetBooleanSettings(SettingNames.RememberPosition);
        this.clientSettings.appPosition = <SimpleCalendar.AppPosition>GameSettings.GetObjectSettings(SettingNames.AppPosition);
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
                syncCalendars: globalConfig.syncCalendars
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
        if(canUser((<Game>game).user, this.globalConfiguration.permissions.viewCalendar)){
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
     * @param {Combatant} combatant The combatant details
     * @param {object} options Options associated with creating the combatant
     * @param {string} id The ID of the creation
     */
    public createCombatant(combatant: Combatant, options: any, id: string){
        const combatList = (<Game>game).combats;
        //If combat is running or if the combat list is undefined, skip this check
        if(!this.activeCalendar.time.combatRunning && combatList){
            const combat = combatList.find(c => c.id === combatant.parent?.id);
            const scenes = (<Game>game).scenes;
            const activeScene = scenes? scenes.active? scenes.active.id : null : null;
            //If the combat has started and the current active scene is the scene for the combat then set that there is a combat running.
            if(combat && combat.started && ((activeScene !== null && combat.scene && combat.scene.id === activeScene) || activeScene === null)){
                this.activeCalendar.time.combatRunning = true;
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
        const scenes = (<Game>game).scenes;
        const activeScene = scenes? scenes.active? scenes.active.id : null : null;
        if(combat.started && ((activeScene !== null && combat.scene && combat.scene.id === activeScene) || activeScene === null)){
            this.activeCalendar.time.combatRunning = true;

            //If time does not have the advanceTime property the combat was just started
            if(time && time.hasOwnProperty('advanceTime')){
                if(time.advanceTime !== 0){
                    this.activeCalendar.year.combatChangeTriggered = true;
                } else {
                    // System does not advance time when combat rounds change, check our own settings
                    this.activeCalendar.processOwnCombatRoundTime(combat);
                }
            }
        }
    }

    /**
     * Triggered when a combat is finished and removed
     */
    public combatDelete(combat: Combat){
        const scenes = (<Game>game).scenes;
        const activeScene = scenes? scenes.active? scenes.active.id : null : null;
        if(activeScene !== null && combat.scene && combat.scene.id === activeScene){
            this.activeCalendar.time.combatRunning = false;
        }
    }
}