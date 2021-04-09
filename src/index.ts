import SimpleCalendar from "./classes/simple-calendar";
import {Logger} from "./classes/logging";
SimpleCalendar.instance = new SimpleCalendar();
Hooks.on('ready', () => {
    //Initialize the Simple Calendar
    SimpleCalendar.instance.init().catch(Logger.error);

    //Expose the macro show function
    (window as any).SimpleCalendar = {show: SimpleCalendar.instance.macroShow.bind(SimpleCalendar.instance)};
});
Hooks.on('getSceneControlButtons', SimpleCalendar.instance.getSceneControlButtons);
Hooks.on("updateWorldTime", SimpleCalendar.instance.worldTimeUpdate.bind(SimpleCalendar.instance));
Hooks.on("updateCombat", SimpleCalendar.instance.combatUpdate.bind(SimpleCalendar.instance));
Hooks.on("deleteCombat", SimpleCalendar.instance.combatDelete.bind(SimpleCalendar.instance));
Hooks.on("pauseGame", SimpleCalendar.instance.gamePaused.bind(SimpleCalendar.instance));
Logger.debugMode = true;
