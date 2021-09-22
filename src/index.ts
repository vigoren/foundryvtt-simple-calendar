import SimpleCalendar from "./classes/simple-calendar";
import Macros from "./classes/macros";
import API from "./classes/api";
import {Logger} from "./classes/logging";
import {SimpleCalendarHooks} from "./constants";
SimpleCalendar.instance = new SimpleCalendar();
Hooks.on('init', () => {
    //Initialize the Simple Calendar
    SimpleCalendar.instance.init();
    //Expose the api
    (window as any).SimpleCalendar = {
        show: Macros.show,
        setDateTime: Macros.setDateTime,
        changeDateTime: Macros.changeDateTime,
        api: API,
        Hooks: SimpleCalendarHooks
    };
});
Hooks.on('ready', () => {
    //Initialize the Simple Calendar Sockets
    SimpleCalendar.instance.initializeSockets();
    SimpleCalendar.instance.checkNoteReminders();
});
Hooks.on('getSceneControlButtons', SimpleCalendar.instance.getSceneControlButtons.bind(SimpleCalendar.instance));
Hooks.on("updateWorldTime", SimpleCalendar.instance.worldTimeUpdate.bind(SimpleCalendar.instance));
Hooks.on('createCombatant', SimpleCalendar.instance.createCombatant.bind(SimpleCalendar.instance));
Hooks.on("updateCombat", SimpleCalendar.instance.combatUpdate.bind(SimpleCalendar.instance));
Hooks.on("deleteCombat", SimpleCalendar.instance.combatDelete.bind(SimpleCalendar.instance));
Hooks.on("pauseGame", SimpleCalendar.instance.gamePaused.bind(SimpleCalendar.instance));

Logger.debugMode = false;

//Hooks.on(SimpleCalendarHooks.DateTimeChange, (...args: any) => {console.log(...args);});
