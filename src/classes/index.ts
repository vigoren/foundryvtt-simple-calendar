import type CalendarManager from "./calendar/calendar-manager";
import type MainApp from "./applications/main-app";
import type SimpleCalendar from "./simple-calendar";
import ConfigurationApp from "./applications/configuration-app";

export let CalManager: CalendarManager;
export let MainApplication: MainApp;
export let ConfigurationApplication: ConfigurationApp;
export let SC: SimpleCalendar;

/**
 * Updates the global calendar manager to the passed in value, should only be called once
 * @param {CalendarManager} manager
 */
export function updateCalManager(manager: CalendarManager){
    CalManager = manager;
}

/**
 * Updates the global main application to the passed in value, should only be called once
 * @param {MainApp} app
 */
export function updateMainApplication(app: MainApp){
    MainApplication = app;
}

/**
 * Updates the global configuration application to the passed in value, should only be called once
 * @param {MainApp} app
 */
export function updateConfigurationApplication(app: ConfigurationApp){
    ConfigurationApplication = app;
}

/**
 * Updates the global simple calendar to the passed in value, should only be called once
 * @param {SimpleCalendar} sc
 */
export function updateSC(sc: SimpleCalendar){
    SC = sc;
}