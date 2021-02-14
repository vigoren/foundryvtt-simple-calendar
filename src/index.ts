import SimpleCalendar from "./classes/simple-calendar";
import {Logger} from "./classes/logging";
Logger.debugMode = true;
SimpleCalendar.instance = new SimpleCalendar();
Hooks.on('ready', () => {
    SimpleCalendar.instance.init();
});
Hooks.on('getSceneControlButtons', SimpleCalendar.instance.getSceneControlButtons);
