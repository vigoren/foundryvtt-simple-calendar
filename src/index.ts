import SCController from "./classes/s-c-controller";
import * as API from "./classes/api";
import { Logger } from "./classes/logging";
import { SimpleCalendarHooks } from "./constants";
import {
    CalManager,
    MainApplication,
    MigrationApplication,
    NManager,
    SC,
    updateCalManager,
    updateConfigurationApplication,
    updateMainApplication,
    updateMigrationApplication,
    updateNManager,
    updateSC
} from "./classes";
import { HandlebarsHelpers } from "./classes/api/handlebars-helpers";
import GameSettingsRegistration from "./classes/foundry-interfacing/game-settings-registration";
import CalendarManager from "./classes/calendar/calendar-manager";
import MainApp from "./classes/applications/main-app";
import ConfigurationApp from "./classes/applications/configuration-app";
import MigrationApp from "./classes/applications/migration-app";
import NoteManager from "./classes/notes/note-manager";
import { NoteSheet } from "./classes/notes/note-sheet";
import PF2E from "./classes/systems/pf2e";
import { CheckRemScaling } from "./classes/utilities/visual";
import { Hook } from "./classes/api/hook";
import KeyBindings from "./classes/key-bindings";
import { Chat } from "./classes/chat";
import { ChatTimestamp } from "./classes/chat/chat-timestamp";

updateCalManager(new CalendarManager());
updateSC(new SCController());
updateMainApplication(new MainApp());
updateConfigurationApplication(new ConfigurationApp());
updateMigrationApplication(new MigrationApp());
updateNManager(new NoteManager());

//Add body click events
document.body.addEventListener("click", SCController.HideContextMenus);

//Expose the api
(window as any).SimpleCalendar = {
    api: API,
    Hooks: SimpleCalendarHooks
};

CheckRemScaling();

Hooks.on("init", async () => {
    //Register Handlebar Helpers and our game settings
    HandlebarsHelpers.Register();
    GameSettingsRegistration.Register();
    //Initialize the calendar manager (loads the calendars and their settings)
    await CalManager.initialize();
    //Load the global configuration settings
    SC.load();
    //Initialize the main application (Pre-set values before render)
    MainApplication.initialize();
    KeyBindings.register();
    Chat.init();
});
Hooks.on("ready", async () => {
    if (PF2E.isPF2E) {
        PF2E.updatePF2EVariables(true);
        ChatTimestamp.updateChatMessageTimestamps();
    }
    MigrationApplication.initialize();
    //Check to see if we need to run a migration, if we do show the migration dialog otherwise show the main app
    if (MigrationApplication.showMigration) {
        await MigrationApplication.run();
        //Initialize the note manager
        await NManager.initialize();
        //Initialize the Simple Calendar Class
        SC.initialize();
    } else {
        //Initialize the note manager
        await NManager.initialize();
        //Initialize the Simple Calendar Class
        SC.initialize();
        //If we are to open the main app on foundry load, open it
        if (SC.clientSettings.openOnLoad) {
            MainApplication.render();
        }
    }
    Hook.emit(SimpleCalendarHooks.Ready, CalManager.getActiveCalendar());
});
Hooks.on("canvasInit", SC.canvasInit.bind(SC));
Hooks.on("getSceneControlButtons", SC.getSceneControlButtons.bind(SC));
Hooks.on("renderJournalDirectory", SC.renderJournalDirectory.bind(SC));
Hooks.on("renderJournalSheet", SC.renderJournalSheet.bind(SC));
Hooks.on("updateWorldTime", SC.worldTimeUpdate.bind(SC));
Hooks.on("createCombatant", SC.createCombatant.bind(SC));
Hooks.on("updateCombat", SC.combatUpdate.bind(SC));
Hooks.on("deleteCombat", SC.combatDelete.bind(SC));
Hooks.on("pauseGame", SC.gamePaused.bind(SC));
Hooks.on("preCreateChatMessage", Chat.createChatMessage);
Hooks.on("renderChatMessage", Chat.onRenderChatMessage);
Hooks.on("renderMainApp", MainApp.setWidthHeight);
Hooks.on("renderNoteSheet", NoteSheet.SetHeight);
Hooks.on("createJournalEntry", NManager.journalEntryUpdate.bind(NManager, 0));
Hooks.on("updateJournalEntry", NManager.journalEntryUpdate.bind(NManager, 1));
Hooks.on("deleteJournalEntry", NManager.journalEntryUpdate.bind(NManager, 2));
Hooks.on("renderSceneConfig", SC.renderSceneConfig.bind(SC));
Hooks.on("closeWorldClockSettings", PF2E.updatePF2EVariables.bind(PF2E));

Logger.debugMode = false;

//Hooks.on(SimpleCalendarHooks.DateTimeChange, (...args: any) => {console.log(...args);});
//Hooks.on(SimpleCalendarHooks.Ready, (...args: any) => {console.log('SC Ready!');});
