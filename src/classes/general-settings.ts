import {GameWorldTimeIntegrations} from "../constants";
import ConfigurationItemBase from "./configuration-item-base";
import {GeneralSettingsConfig, GeneralSettingsTemplate} from "../interfaces";
import UserPermissions from "./user-permissions";

export default class GeneralSettings extends ConfigurationItemBase{
    /**
     * How the calendar integrates with the game world time
     */
    gameWorldTimeIntegration: GameWorldTimeIntegrations = GameWorldTimeIntegrations.Mixed;
    /**
     * If to show the clock
     */
    showClock: boolean = true;
    /**
     * If to enable the PF2E World Clock Sync
     */
    pf2eSync: boolean = true;
    /**
     * The different date display formats for the interface
     */
    dateFormat = {
        /** Date format (year, month, day) and how to display it. Used in the compact view, Notes for <Date>, Date of Notes in display of notes and the Date Selector for notes */
        date: 'MMMM DD, YYYY',
        /** Time format (hour, minute, second) and how to display it. Used in the compact view, the clock, Notes that have a specific time set and Date Selector for time*/
        time: 'HH:mm:ss',
        /** Format for displaying just the month and year. Used at the top of any calendar month display */
        monthYear: 'MMMM YAYYYYYZ'
    };
    /**
     * User permissions for different actions in the calendar
     */
    permissions: UserPermissions;

    constructor() {
        super();
        this.permissions = new UserPermissions();
    }

    /**
     * Creates a clone of the current general settings
     */
    clone(): GeneralSettings {
        const gs = new GeneralSettings();
        gs.id = this.id;
        gs.gameWorldTimeIntegration = this.gameWorldTimeIntegration;
        gs.showClock = this.showClock;
        gs.pf2eSync = this.pf2eSync;
        gs.dateFormat.date = this.dateFormat.date;
        gs.dateFormat.time = this.dateFormat.time;
        gs.dateFormat.monthYear = this.dateFormat.monthYear;
        gs.permissions = this.permissions.clone();
        return gs;
    }

    /**
     * Creates a template for the general settings
     */
    toTemplate(): GeneralSettingsTemplate {
        return {
            ...super.toTemplate(),
            gameWorldTimeIntegration: this.gameWorldTimeIntegration,
            showClock: this.showClock,
            pf2eSync: this.pf2eSync,
            dateFormat: this.dateFormat,
            permissions: this.permissions.toTemplate()
        }
    }

    /**
     * Sets the properties for this class to options set in the passed in configuration object
     * @param {GeneralSettingsConfig} config The configuration object for this class
     */
    loadFromSettings(config: GeneralSettingsConfig) {
        if(config && Object.keys(config).length){
            this.id = config.id;
            this.gameWorldTimeIntegration = config.gameWorldTimeIntegration;
            this.showClock = config.showClock;

            if(config.hasOwnProperty('pf2eSync')){
                this.pf2eSync = config.pf2eSync;
            }

            if(config.hasOwnProperty('permissions')){
                this.permissions.loadFromSettings(config.permissions)
            } else if(config.hasOwnProperty('playersAddNotes')){
                this.permissions.addNotes.player = <boolean>config['playersAddNotes'];
                this.permissions.addNotes.trustedPlayer = <boolean>config['playersAddNotes'];
                this.permissions.addNotes.assistantGameMaster = <boolean>config['playersAddNotes'];
            }

            if(config.hasOwnProperty('dateFormat')){
                this.dateFormat = config.dateFormat;
            }
        }
    }
}
