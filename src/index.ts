import SimpleCalendar from "./classes/simple-calendar";
import Macros from "./classes/macros";
import {Logger} from "./classes/logging";
import {SimpleCalendarHooks} from "./constants";
SimpleCalendar.instance = new SimpleCalendar();
Hooks.on('init', () => {
    //Initialize the Simple Calendar
    SimpleCalendar.instance.init().catch(Logger.error);
});
Hooks.on('ready', () => {
    //Expose the macro show function
    (window as any).SimpleCalendar = {
        show: Macros.show,
        setDateTime: Macros.setDateTime,
        changeDateTime: Macros.changeDateTime,
        Hooks: SimpleCalendarHooks
    };
});
Hooks.on('getSceneControlButtons', SimpleCalendar.instance.getSceneControlButtons.bind(SimpleCalendar.instance));
Hooks.on("updateWorldTime", SimpleCalendar.instance.worldTimeUpdate.bind(SimpleCalendar.instance));
Hooks.on("updateCombat", SimpleCalendar.instance.combatUpdate.bind(SimpleCalendar.instance));
Hooks.on("deleteCombat", SimpleCalendar.instance.combatDelete.bind(SimpleCalendar.instance));
Hooks.on("pauseGame", SimpleCalendar.instance.gamePaused.bind(SimpleCalendar.instance));

Logger.debugMode = true;
