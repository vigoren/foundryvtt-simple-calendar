import SimpleCalendar from "./classes/simple-calendar";
import API from "./classes/api";
import {Logger} from "./classes/logging";
import {SettingNames, SimpleCalendarHooks} from "./constants";
import {GameSettings} from "./classes/foundry-interfacing/game-settings";

SimpleCalendar.instance = new SimpleCalendar();
Hooks.on('init', () => {
    //Initialize the Simple Calendar
    SimpleCalendar.instance.initialize();
    //Expose the api
    (window as any).SimpleCalendar = {
        api: API,
        Hooks: SimpleCalendarHooks
    };
});
Hooks.on('ready', () => {
    //Initialize the Simple Calendar Sockets
    SimpleCalendar.instance.sockets.initialize();
    SimpleCalendar.instance.checkNoteReminders();
    if(GameSettings.GetBooleanSettings(SettingNames.OpenOnLoad)){
        SimpleCalendar.instance.mainApp?.showApp();
    }
});
Hooks.on('getSceneControlButtons', SimpleCalendar.instance.getSceneControlButtons.bind(SimpleCalendar.instance));
Hooks.on("updateWorldTime", SimpleCalendar.instance.worldTimeUpdate.bind(SimpleCalendar.instance));
Hooks.on('createCombatant', SimpleCalendar.instance.createCombatant.bind(SimpleCalendar.instance));
Hooks.on("updateCombat", SimpleCalendar.instance.combatUpdate.bind(SimpleCalendar.instance));
Hooks.on("deleteCombat", SimpleCalendar.instance.combatDelete.bind(SimpleCalendar.instance));
Hooks.on("pauseGame", SimpleCalendar.instance.gamePaused.bind(SimpleCalendar.instance));

Logger.debugMode = false;

//Hooks.on(SimpleCalendarHooks.DateTimeChange, (...args: any) => {console.log(...args);});
//Hooks.on(SimpleCalendarHooks.Ready, (...args: any) => {console.log('SC Ready!');});
