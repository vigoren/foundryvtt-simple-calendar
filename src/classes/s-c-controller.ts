import Sockets from "./sockets";
import { GameSettings } from "./foundry-interfacing/game-settings";
import {
    CombatPauseRules,
    ModuleName,
    NoteReminderNotificationType,
    SettingNames,
    SimpleCalendarHooks,
    SocketTypes,
    Themes,
    TimeKeeperStatus
} from "../constants";
import { Logger } from "./logging";
import { CalManager, MainApplication, NManager, SC } from "./index";
import ConfigurationApp from "./applications/configuration-app";
import MainApp from "./applications/main-app";
import UserPermissions from "./configuration/user-permissions";
import { canUser } from "./utilities/permissions";
import GameSockets from "./foundry-interfacing/game-sockets";
import { RoundData } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/client/data/documents/combat";
import MultiSelect from "./renderer/multi-select";
import { GetThemeName } from "./utilities/visual";
import { FoundryVTTGameData } from "./foundry-interfacing/game-data";
import { Hook } from "./api/hook";
import { ChatTimestamp } from "./chat/chat-timestamp";
import { foundryGetRoute } from "./foundry-interfacing/utilities";

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
    public get activeCalendar() {
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
        this.clientSettings = {
            id: "",
            theme: Themes[0].key,
            openOnLoad: true,
            openCompact: false,
            rememberPosition: true,
            rememberCompactPosition: false,
            appPosition: {},
            noteReminderNotification: NoteReminderNotificationType.whisper,
            sideDrawerDirection: "sc-right",
            alwaysShowNoteList: false,
            persistentOpen: false,
            compactViewScale: 100
        };
        this.globalConfiguration = {
            id: "",
            version: "",
            calendarsSameTimestamp: false,
            combatPauseRule: CombatPauseRules.Active,
            permissions: new UserPermissions(),
            secondsInCombatRound: 6,
            syncCalendars: false,
            showNotesFolder: false,
            inGameChatTimestamp: false
        };
    }

    /**
     * Called when the theme being used has changed and all currently open dialogs need to be updated to the new theme
     */
    public static ThemeChange() {
        this.LoadThemeCSS();
        const newTheme = GetThemeName();
        const themes = Themes.map((t) => {
            return t.key;
        });
        //Update the main app
        const mainApp = document.getElementById(MainApp.appWindowId);
        if (mainApp) {
            mainApp.classList.remove(...themes);
            mainApp.classList.add(newTheme);
        }
        //Update the configuration (if open)
        const configApp = document.getElementById(ConfigurationApp.appWindowId);
        if (configApp) {
            configApp.classList.remove(...themes);
            configApp.classList.add(newTheme);
        }
        //Update Open Journals
        document.querySelectorAll(".journal-sheet.simple-calendar").forEach((j) => {
            j.classList.remove(...themes);
            j.classList.add(newTheme);
        });
    }

    /**
     * Loads any extra css files required for the specified theme
     */
    public static LoadThemeCSS(setTheme: string = "") {
        const theme = setTheme ? setTheme : GetThemeName();
        this.addCSSImageURLPaths(theme);
        const cssExists = document.head.querySelector(`#theme-${theme}`);
        if (cssExists === null) {
            const newStyle = document.createElement("link");
            newStyle.setAttribute("id", `theme-${theme}`);
            newStyle.setAttribute("rel", "stylesheet");
            newStyle.setAttribute("type", "text/css");
            newStyle.setAttribute("href", foundryGetRoute(`modules/${ModuleName}/styles/themes/${theme}.css`));
            document.head.append(newStyle);
        }
    }

    /**
     * Adds a style tag to the header that includes borrowed image path variables for themes to use
     * @param theme The theme to add image paths for
     */
    public static addCSSImageURLPaths(theme: string) {
        const styleTagExists = document.head.querySelector(`#sc-image-urls`);
        const cssVars = [
            `--ui-denim075: url("${foundryGetRoute("/ui/denim075.png")}");`,
            `--ui-parchment: url("${foundryGetRoute("/ui/parchment.jpg")}");`
        ];
        const themeData = Themes.find((t) => {
            return t.key === theme;
        });
        if (themeData && themeData.images) {
            for (const [key, value] of Object.entries(themeData.images)) {
                cssVars.push(`${key}: url("${foundryGetRoute(value)}");`);
            }
        }
        const styles = `.simple-calendar {${cssVars.join("")}`;
        if (styleTagExists) {
            styleTagExists.textContent = styles;
        } else {
            const styleTag = document.createElement("style");
            styleTag.setAttribute("id", `sc-image-urls`);
            styleTag.appendChild(document.createTextNode(styles));
            document.head.append(styleTag);
        }
    }

    public PersistenceChange() {
        this.clientSettings.persistentOpen = GameSettings.GetBooleanSettings(SettingNames.PersistentOpen);
        const mainApp = document.getElementById(MainApp.appWindowId);
        if (mainApp) {
            if (this.clientSettings.persistentOpen) {
                mainApp.classList.add("fsc-persistent");
            } else {
                mainApp.classList.remove("fsc-persistent");
            }
        }
    }

    public CompactScaleChange() {
        this.clientSettings.compactViewScale = GameSettings.GetNumericSettings(SettingNames.CompactViewScale);
        const mainApp = document.getElementById(MainApp.appWindowId);
        if (mainApp) {
            for (let i = mainApp.classList.length - 1; i >= 0; i--) {
                if (mainApp.classList[i].startsWith("sc-scale")) {
                    mainApp.classList.remove(mainApp.classList[i]);
                }
            }
            mainApp.classList.add(`sc-scale-${SC.clientSettings.compactViewScale}`);
        }
    }

    /**
     * When the side drawer direction client setting has changed re-render the main application.
     */
    public static SideDrawerDirectionChange() {
        MainApplication.updateApp();
    }

    public static AlwaysShowNoteListChange() {
        MainApplication.initialize();
        MainApplication.updateApp();
    }

    /**
     * Initialize the sockets
     * Check for note reminders
     */
    public initialize() {
        this.sockets.initialize();
        NManager.checkNoteTriggers(this.activeCalendar.id, true);
        //Close all open multi selects except the one being interacted with
        document.body.addEventListener("click", MultiSelect.BodyEventListener);
        this.checkCombatActive();
        Hook.emit(SimpleCalendarHooks.Init, CalManager.getActiveCalendar());
    }

    /**
     * Load the global configuration and apply it
     */
    public load() {
        SCController.LoadThemeCSS();
        const globalConfiguration = <SimpleCalendar.GlobalConfigurationData>GameSettings.GetObjectSettings(SettingNames.GlobalConfiguration);
        this.globalConfiguration.permissions.loadFromSettings(globalConfiguration.permissions);
        this.globalConfiguration.secondsInCombatRound = globalConfiguration.secondsInCombatRound;
        this.globalConfiguration.calendarsSameTimestamp = globalConfiguration.calendarsSameTimestamp;
        this.globalConfiguration.syncCalendars = globalConfiguration.syncCalendars;
        this.globalConfiguration.showNotesFolder = globalConfiguration.showNotesFolder;
        if (Object.prototype.hasOwnProperty.call(globalConfiguration, "combatPauseRule")) {
            this.globalConfiguration.combatPauseRule = globalConfiguration.combatPauseRule;
        }
        if (Object.prototype.hasOwnProperty.call(globalConfiguration, "inGameChatTimestamp")) {
            this.globalConfiguration.inGameChatTimestamp = globalConfiguration.inGameChatTimestamp;
        }
        this.clientSettings.theme = GetThemeName();
        this.clientSettings.openOnLoad = GameSettings.GetBooleanSettings(SettingNames.OpenOnLoad);
        this.clientSettings.openCompact = GameSettings.GetBooleanSettings(SettingNames.OpenCompact);
        this.clientSettings.rememberPosition = GameSettings.GetBooleanSettings(SettingNames.RememberPosition);
        this.clientSettings.rememberCompactPosition = GameSettings.GetBooleanSettings(SettingNames.RememberCompactPosition);
        this.clientSettings.appPosition = <SimpleCalendar.AppPosition>GameSettings.GetObjectSettings(SettingNames.AppPosition);
        this.clientSettings.noteReminderNotification = <NoteReminderNotificationType>(
            GameSettings.GetStringSettings(SettingNames.NoteReminderNotification)
        );
        this.clientSettings.sideDrawerDirection = GameSettings.GetStringSettings(SettingNames.NoteListOpenDirection);
        this.clientSettings.alwaysShowNoteList = GameSettings.GetBooleanSettings(SettingNames.AlwaysShowNoteList);
        this.clientSettings.persistentOpen = GameSettings.GetBooleanSettings(SettingNames.PersistentOpen);
        this.clientSettings.compactViewScale = GameSettings.GetNumericSettings(SettingNames.CompactViewScale);
    }

    /**
     * Reloads certain portions of the client and global configuration after a change has been made.
     */
    public reload() {
        SCController.LoadThemeCSS();
        this.clientSettings.theme = GetThemeName();
    }

    /**
     * Save the global configuration and the calendar configuration
     */
    public save(globalConfig: SimpleCalendar.GlobalConfigurationData | null = null, clientConfig: SimpleCalendar.ClientSettingsData | null = null) {
        CalManager.saveCalendars().catch(Logger.error);

        if (clientConfig) {
            //Save the client settings
            GameSettings.SaveStringSetting(`${FoundryVTTGameData.worldId}.${SettingNames.Theme}`, clientConfig.theme, false)
                .then(this.reload.bind(this))
                .catch(Logger.error);
            GameSettings.SaveBooleanSetting(SettingNames.OpenOnLoad, clientConfig.openOnLoad, false).catch(Logger.error);
            GameSettings.SaveBooleanSetting(SettingNames.OpenCompact, clientConfig.openCompact, false).catch(Logger.error);
            GameSettings.SaveBooleanSetting(SettingNames.RememberPosition, clientConfig.rememberPosition, false).catch(Logger.error);
            GameSettings.SaveBooleanSetting(SettingNames.RememberCompactPosition, clientConfig.rememberCompactPosition, false).catch(Logger.error);
            GameSettings.SaveObjectSetting(SettingNames.AppPosition, clientConfig.appPosition, false).catch(Logger.error);
            GameSettings.SaveStringSetting(SettingNames.NoteReminderNotification, clientConfig.noteReminderNotification, false).catch(Logger.error);
            GameSettings.SaveStringSetting(SettingNames.NoteListOpenDirection, clientConfig.sideDrawerDirection, false).catch(Logger.error);
            GameSettings.SaveBooleanSetting(SettingNames.AlwaysShowNoteList, clientConfig.alwaysShowNoteList, false).catch(Logger.error);
            GameSettings.SaveBooleanSetting(SettingNames.PersistentOpen, clientConfig.persistentOpen, false).catch(Logger.error);
            GameSettings.SaveNumericSetting(SettingNames.CompactViewScale, clientConfig.compactViewScale, false).catch(Logger.error);
        }

        if (globalConfig) {
            const gc: SimpleCalendar.GlobalConfigurationData = {
                id: "",
                version: GameSettings.GetModuleVersion(),
                permissions: globalConfig.permissions,
                secondsInCombatRound: globalConfig.secondsInCombatRound,
                calendarsSameTimestamp: globalConfig.calendarsSameTimestamp,
                syncCalendars: globalConfig.syncCalendars,
                showNotesFolder: globalConfig.showNotesFolder,
                combatPauseRule: globalConfig.combatPauseRule,
                inGameChatTimestamp: globalConfig.inGameChatTimestamp
            };
            //Save the global configuration (triggers the load function)
            GameSettings.SaveObjectSetting(SettingNames.GlobalConfiguration, gc)
                .then(
                    ((renderChatLog: boolean) => {
                        if (renderChatLog) {
                            ChatTimestamp.updateChatMessageTimestamps();
                            //Ui.renderChatLog();
                            GameSockets.emit({ type: SocketTypes.renderChatLog, data: renderChatLog }).catch(Logger.error);
                        }
                        return GameSockets.emit({ type: SocketTypes.mainAppUpdate, data: {} });
                    }).bind(this, this.globalConfiguration.inGameChatTimestamp !== globalConfig.inGameChatTimestamp)
                )
                .catch(Logger.error);
        }
    }

    /**
     * Hides any open context menus
     */
    public static HideContextMenus() {
        document.querySelectorAll(".fsc-context-menu").forEach((e) => {
            e.classList.add("fsc-hide");
        });
    }

    private checkCombatActive() {
        const activeScene = GameSettings.GetSceneForCombatCheck();
        const combat = (<Game>game).combats?.find((c: Combat) => {
            if (c.scene && activeScene) {
                return c.scene.id === activeScene.id;
            }
            return false;
        });
        if (combat && combat.started) {
            this.activeCalendar.time.combatRunning = true;
        }
    }

    //---------------------------
    // Foundry Hooks
    //---------------------------
    /**
     * Adds the calendar button to the token button list
     * @param controls
     */
    public getSceneControlButtons(controls: any[]) {
        if (canUser((<Game>game).user, this.globalConfiguration.permissions.viewCalendar)) {
            const tokenControls = controls.find((c) => {
                return c.name === "notes";
            });
            if (tokenControls && Object.prototype.hasOwnProperty.call(tokenControls, "tools")) {
                tokenControls.tools.push({
                    name: "calendar",
                    title: "FSC.Title",
                    icon: "fas fa-calendar simple-calendar-icon",
                    button: true,
                    onClick: MainApplication.sceneControlButtonClick.bind(MainApplication)
                });
            }
        }
    }

    /**
     * Checks settings to see if the note directory should be shown or hidden from the journal directory
     */
    public async renderJournalDirectory(tab: JournalDirectory, jquery: JQuery) {
        await NManager.createJournalDirectory();
        if (!this.globalConfiguration.showNotesFolder && NManager.noteDirectory) {
            const folder = jquery.find(`.folder[data-folder-id='${NManager.noteDirectory.id}']`);
            if (folder) {
                folder.remove();
            }
        }
    }

    /**
     * Checks settings to see if the note directory should be shown or hidden from the journal sheet directory dropdown
     */
    public renderJournalSheet(sheet: JournalSheet, jquery: JQuery) {
        if (!this.globalConfiguration.showNotesFolder && NManager.noteDirectory) {
            const option = jquery.find(`option[value='${NManager.noteDirectory.id}']`);
            if (option) {
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
    public renderSceneConfig(config: SceneConfig, jquery: JQuery, data: SceneConfig.Data) {
        if (!this.globalConfiguration.showNotesFolder && data.journals) {
            for (let i = 0; i < data.journals.length; i++) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                const je = (<Game>game).journal?.get(data.journals[i].id);
                if (je) {
                    const nd = <SimpleCalendar.NoteData>je.getFlag(ModuleName, "noteData");
                    if (nd) {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        //@ts-ignore
                        const option = jquery.find(`option[value='${data.journals[i].id}']`);
                        if (option) {
                            option.remove();
                        }
                    }
                }
            }
        }
    }

    /**
     * Triggered when the games pause state is changed.
     */
    public gamePaused() {
        if (this.activeCalendar.time.unifyGameAndClockPause) {
            if (!(<Game>game).paused) {
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
    public worldTimeUpdate(newTime: number, delta: number) {
        this.activeCalendar.setFromTime(newTime, delta);
    }

    /**
     * Triggered when a combatant is added to a combat.
     * @param combatant The combatant details
     */
    public createCombatant(combatant: Combatant) {
        const combatList = (<Game>game).combats;
        //If combat is running or if the combat list is undefined, skip this check
        if (!this.activeCalendar.time.combatRunning && combatList) {
            const combat = combatList.find((c) => {
                return c.id === combatant.parent?.id;
            });
            const activeScene = GameSettings.GetSceneForCombatCheck();
            //If the combat has started and the current active scene is the scene for the combat then set that there is a combat running.
            if (combat && combat.started && ((activeScene !== null && combat.scene && combat.scene.id === activeScene.id) || activeScene === null)) {
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
    public combatUpdate(combat: Combat, round: RoundData, time: any) {
        const activeScene = GameSettings.GetSceneForCombatCheck();
        if (combat.started && ((activeScene !== null && combat.scene && combat.scene.id === activeScene.id) || activeScene === null)) {
            this.activeCalendar.time.combatRunning = true;

            //If time does not have the advanceTime property the combat was just started
            if (time && Object.prototype.hasOwnProperty.call(time, "advanceTime")) {
                if (time.advanceTime !== 0) {
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
    public combatDelete(combat: Combat) {
        const activeScene = GameSettings.GetSceneForCombatCheck();
        if (activeScene !== null && combat.scene && combat.scene.id === activeScene.id) {
            this.activeCalendar.time.combatRunning = false;
        }
    }

    /**
     * Triggered when the canvas is initialized.
     * Using this to check if the user has changed Scenes.
     * @param canvas The canvas data
     */
    public canvasInit(canvas: Canvas) {
        if (GameSettings.IsGm() && this.primary && this.globalConfiguration.combatPauseRule === CombatPauseRules.Current) {
            const activeScene = canvas.scene ? canvas.scene.id : null;
            const combatsInCurrent = (<Game>game).combats?.filter((combat) => {
                return combat.started && combat.scene?.id === activeScene;
            });
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
