import SCController from "./classes/s-c-controller";
import * as API from "./classes/api";
import {Logger} from "./classes/logging";
import {SimpleCalendarHooks} from "./constants";
import {
    updateCalManager,
    updateMainApplication,
    updateSC,
    CalManager,
    MainApplication,
    SC,
    updateConfigurationApplication,
    updateMigrationApplication,
    MigrationApplication,
    updateNManager,
    NManager
} from "./classes";
import {HandlebarsHelpers} from "./classes/api/handlebars-helpers";
import GameSettingsRegistration from "./classes/foundry-interfacing/game-settings-registration";
import CalendarManager from "./classes/calendar/calendar-manager";
import MainApp from "./classes/applications/main-app";
import ConfigurationApp from "./classes/applications/configuration-app";
import MigrationApp from "./classes/applications/migration-app";
import NoteManager from "./classes/notes/note-manager";

updateCalManager(new CalendarManager());
updateSC(new SCController());
updateMainApplication(new MainApp());
updateConfigurationApplication(new ConfigurationApp());
updateMigrationApplication(new MigrationApp());
updateNManager(new NoteManager());

//Expose the api
(window as any).SimpleCalendar = {
    api: API,
    Hooks: SimpleCalendarHooks,
    test: NManager.createNote
};

Hooks.on('init', () => {
    //Register Handlebar Helpers and our game settings
    HandlebarsHelpers.Register();
    GameSettingsRegistration.Register();
    //Initialize the calendar manager (loads the calendars and their settings)
    CalManager.initialize();
    //Load the global configuration settings
    SC.load();
});
Hooks.on('ready', async () => {
    //Initialize the note manager
    await NManager.initialize();
    //Initialize the Simple Calendar Class
    SC.initialize();
    //Check to see if we need to run a migration, if we do show the migration dialog otherwise show the main app
    if(!MigrationApplication.showMigration()){
        //If we are to open the main app on foundry load, open it
        if(SC.clientSettings.openOnLoad){
            MainApplication.showApp();
        }
    }
});
Hooks.on('getSceneControlButtons', SC.getSceneControlButtons.bind(SC));
Hooks.on("updateWorldTime", SC.worldTimeUpdate.bind(SC));
Hooks.on('createCombatant', SC.createCombatant.bind(SC));
Hooks.on("updateCombat", SC.combatUpdate.bind(SC));
Hooks.on("deleteCombat", SC.combatDelete.bind(SC));
Hooks.on("pauseGame", SC.gamePaused.bind(SC));

Logger.debugMode = false;

//Hooks.on(SimpleCalendarHooks.DateTimeChange, (...args: any) => {console.log(...args);});
//Hooks.on(SimpleCalendarHooks.Ready, (...args: any) => {console.log('SC Ready!');});
