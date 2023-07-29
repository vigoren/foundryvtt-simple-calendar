import type CalendarManager from "./calendar/calendar-manager";
import type MainApp from "./applications/main-app";
import type SCController from "./s-c-controller";
import ConfigurationApp from "./applications/configuration-app";
import MigrationApp from "./applications/migration-app";
import NoteManager from "./notes/note-manager";

export let CalManager: CalendarManager;
export let MainApplication: MainApp;
export let ConfigurationApplication: ConfigurationApp;
export let MigrationApplication: MigrationApp;
export let SC: SCController;
export let NManager: NoteManager;

/**
 * Updates the global calendar manager to the passed in value, should only be called once
 * @param {CalendarManager} manager
 */
export function updateCalManager(manager: CalendarManager) {
    CalManager = manager;
}

/**
 * Updates the global main application to the passed in value, should only be called once
 * @param {MainApp} app
 */
export function updateMainApplication(app: MainApp) {
    MainApplication = app;
}

/**
 * Updates the global configuration application to the passed in value, should only be called once
 * @param {MainApp} app
 */
export function updateConfigurationApplication(app: ConfigurationApp) {
    ConfigurationApplication = app;
}

/**
 * Updates the global migration application to the passed in value, should only be called once
 * @param app
 */
export function updateMigrationApplication(app: MigrationApp) {
    MigrationApplication = app;
}

/**
 * Updates the global simple calendar to the passed in value, should only be called once
 * @param {SCController} sc
 */
export function updateSC(sc: SCController) {
    SC = sc;
}

/**
 * Updates the global note manager to the passed in value, should only be called once
 * @param manager
 */
export function updateNManager(manager: NoteManager) {
    NManager = manager;
}
