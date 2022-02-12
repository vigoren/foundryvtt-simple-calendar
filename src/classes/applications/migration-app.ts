import {GameSettings} from "../foundry-interfacing/game-settings";
import {MigrationTypes, SettingNames, Themes} from "../../constants";
import {Logger} from "../logging";
import V1ToV2 from "../migrations/v1-to-v2";
import {CalManager, SC} from "../index";
import {isObjectEmpty} from "../utilities/object";

export default class MigrationApp extends Application{
    /**
     * The ID used for the application window within foundry
     * @type {string}
     */
    public static appWindowId: string = 'simple-calendar-migration-application';

    /**
     * The HTML element representing the application window
     * @type {HTMLElement | null}
     * @private
     */
    private appWindow: HTMLElement | null = null;

    private MigrationType: MigrationTypes = MigrationTypes.none;

    private displayData = {
        calendarButtonDisable: false,
        calendarMigrationRun: false,
        calendarMigrationSuccess: false,
        noteButtonDisable: false,
        noteMigrationRun: false,
        noteMigrationSuccess: false,
        cleanUpRun: false
    };

    /**
     * Migration App constructor
     */
    constructor() {
        super();
    }

    /**
     * Returns the default options for this application
     */
    static get defaultOptions() {
        const options = super.defaultOptions;
        options.template = "modules/foundryvtt-simple-calendar/templates/migration.html";
        options.title = "FSC.Migration.Title";
        options.classes = ["simple-calendar"];
        options.id = this.appWindowId;
        options.resizable = false;
        options.width = 500;
        return options;
    }

    /**
     * Shows the application window
     */
    public showApp(){
        this.render(true, {classes: ["simple-calendar", GameSettings.GetStringSettings(SettingNames.Theme)]});
    }

    /**
     *
     * @param options
     */
    public getData(options?: Partial<ApplicationOptions>): object | Promise<object> {
        return {
            ...super.getData(options),
            ...this.displayData
        };
    }

    /**
     *
     * @param html
     */
    public activateListeners(html: JQuery) {
        super.activateListeners(html);
        this.appWindow = document.getElementById(MigrationApp.appWindowId);
        if(this.appWindow){
            this.appWindow.querySelector('.calendar-migration')?.addEventListener('click', this.runCalendarMigration.bind(this));
            this.appWindow.querySelector('.note-migration')?.addEventListener('click', this.runNoteMigration.bind(this));
            this.appWindow.querySelector('.clean-data')?.addEventListener('click', this.runCleanData.bind(this));
        }
    }

    public showMigration(){
        //Only the primary GM can do this
        if(GameSettings.IsGm() && SC.primary){
            const genConfig = <SimpleCalendar.GlobalConfigurationData>GameSettings.GetObjectSettings(SettingNames.GlobalConfiguration);
            const oldYearConfig = GameSettings.GetObjectSettings(SettingNames.YearConfiguration);
            //Check to see if the old year config is empty, if it is then this is a new installation
            //Check to see if we need to update from v1 to 2
            //If there is no version property on the general configuration object then we are still on version 1
            if(isObjectEmpty(oldYearConfig) && isObjectEmpty(genConfig) ){
                this.MigrationType = MigrationTypes.none;
            } else if(!isObjectEmpty(oldYearConfig) && !genConfig.hasOwnProperty('version')){
                Logger.info('Migration required from Simple Calendar v1 to Version 2');
                this.MigrationType = MigrationTypes.v1To2;
                this.showApp();
            }
        }
    }

    public runCalendarMigration(){
        Logger.info('Migrating Calendar Configuration...');

        if(this.MigrationType == MigrationTypes.v1To2){
            const newCalendar = V1ToV2.runCalendarMigration();
            if(newCalendar !== null){
                CalManager.setCalendars([newCalendar]);
                Logger.info('Calendar Configuration successfully migrated!');
                Logger.info('Migrating Permissions and General Settings...');
                if(V1ToV2.runGlobalConfigurationMigration()){
                    Logger.info('Permissions and General Settings successfully migrated!');
                    this.displayData.calendarButtonDisable = true;
                    this.displayData.calendarMigrationSuccess = true;
                    this.saveMigratedData();
                } else {
                    Logger.error('There was an error converting the existing permissions and general settings to the new permissions and general settings data model.');
                }
            } else {
                Logger.error('There was an error converting the existing calendar configuration to the new calendar data model.');
            }
        }
        this.displayData.calendarMigrationRun = true;
        this.showApp();
    }

    public saveMigratedData(){
        SC.save(SC.globalConfiguration, {
            id: '',
            theme: Themes.dark,
            openOnLoad: true,
            openCompact: false,
            rememberPosition: true,
            appPosition: {}
        });
    }

    public runNoteMigration(){
        Logger.info('Migrating Calendar Notes...');

        if(this.MigrationType == MigrationTypes.v1To2){
            if(V1ToV2.runNoteMigration()){
                Logger.info('Calendar Notes successfully migrated!');
                this.displayData.noteButtonDisable = true;
                this.displayData.noteMigrationSuccess = true;
            } else {
                Logger.error('There was an error converting the existing notes to journal entries.');
            }
            this.displayData.noteMigrationRun = true;
            this.showApp();
        }
    }

    public runCleanData(){
        Logger.info('Clearing all old data...');
        if(this.MigrationType == MigrationTypes.v1To2){
            V1ToV2.cleanUpOldData().catch(Logger.error);
            this.displayData.cleanUpRun = true;
            Logger.info('All old data has been cleared.');
            this.showApp();
        }
    }
}