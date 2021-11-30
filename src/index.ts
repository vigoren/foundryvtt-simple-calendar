import SimpleCalendar from "./classes/simple-calendar";
import API from "./classes/api";
import {Logger} from "./classes/logging";
import {SettingNames, SimpleCalendarHooks} from "./constants";
import {GameSettings} from "./classes/foundry-interfacing/game-settings";
import {updateCalManager, updateMainApplication, updateSC, CalManager, MainApplication, SC} from "./classes";
import HandlebarsHelpers from "./classes/api/handlebars-helpers";
import GameSettingsRegistration from "./classes/foundry-interfacing/game-settings-registration";
import CalendarManager from "./classes/calendar/calendar-manager";
import MainApp from "./classes/applications/main-app";

updateCalManager(new CalendarManager());
updateMainApplication(new MainApp());
updateSC(new SimpleCalendar());

Hooks.on('init', () => {
    //Register everything
    HandlebarsHelpers.Register();
    GameSettingsRegistration.Register();
    CalManager.initialize();
    //Expose the api
    (window as any).SimpleCalendar = {
        api: API,
        Hooks: SimpleCalendarHooks
    };
});
Hooks.on('ready', () => {
    //Initialize the Simple Calendar Class
    SC.initialize();
    if(GameSettings.GetBooleanSettings(SettingNames.OpenOnLoad)){
        MainApplication.showApp();
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
