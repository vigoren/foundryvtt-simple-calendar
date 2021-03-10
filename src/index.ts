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
Hooks.on("updateWorldTime", (newTime, dt) => {
    console.log(newTime, dt);
});

Logger.debugMode = true;
