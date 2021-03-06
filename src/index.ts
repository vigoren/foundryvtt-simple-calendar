import SimpleCalendar from "./classes/simple-calendar";
SimpleCalendar.instance = new SimpleCalendar();
Hooks.on('ready', () => {
    //Initialize the Simple Calendar
    SimpleCalendar.instance.init();

    //Expose the macro show function
    (window as any).SimpleCalendar = {show: SimpleCalendar.instance.macroShow.bind(SimpleCalendar.instance)};
});
Hooks.on('getSceneControlButtons', SimpleCalendar.instance.getSceneControlButtons);
