import { CompactViewDateTimeControlDisplay, GameWorldTimeIntegrations } from "../../constants";
import ConfigurationItemBase from "./configuration-item-base";

export default class GeneralSettings extends ConfigurationItemBase {
    /**
     * How the calendar integrates with the game world time
     */
    gameWorldTimeIntegration: GameWorldTimeIntegrations = GameWorldTimeIntegrations.Mixed;
    /**
     * If to show the clock
     */
    showClock: boolean = true;
    /**
     * For new notes, if by default the player visibility option is checked or not
     */
    noteDefaultVisibility: boolean = true;
    /**
     * If the note reminders should be PM'd to the players when foundry is loaded in the browser
     */
    postNoteRemindersOnFoundryLoad: boolean = true;
    /**
     * If to enable the PF2E World Clock Sync
     */
    pf2eSync: boolean = true;
    /**
     * The different date display formats for the interface
     */
    dateFormat = {
        /** Date format (year, month, day) and how to display it. Used in the compact view, Notes for <Date>, Date of Notes in display of notes and the Date Selector for notes */
        date: "MMMM DD, YYYY",
        /** Time format (hour, minute, second) and how to display it. Used in the compact view, the clock, Notes that have a specific time set and Date Selector for time*/
        time: "HH:mm:ss",
        /** Format for displaying just the month and year. Used at the top of any calendar month display */
        monthYear: "MMMM YAYYYYYZ",
        /** Date and time format used when displaying the in game timestamp on chat messages */
        chatTime: "MMM DD, YYYY HH:mm"
    };
    /**
     * The different display options tied to the compact view.
     */
    compactViewOptions = {
        /** How to display the date/time control buttons. */
        controlLayout: CompactViewDateTimeControlDisplay.Full
    };

    constructor() {
        super();
    }

    /**
     * Creates a clone of the current general settings
     */
    clone(): GeneralSettings {
        const gs = new GeneralSettings();
        gs.id = this.id;
        gs.gameWorldTimeIntegration = this.gameWorldTimeIntegration;
        gs.showClock = this.showClock;
        gs.noteDefaultVisibility = this.noteDefaultVisibility;
        gs.postNoteRemindersOnFoundryLoad = this.postNoteRemindersOnFoundryLoad;
        gs.pf2eSync = this.pf2eSync;
        gs.dateFormat.date = this.dateFormat.date;
        gs.dateFormat.time = this.dateFormat.time;
        gs.dateFormat.monthYear = this.dateFormat.monthYear;
        gs.dateFormat.chatTime = this.dateFormat.chatTime;
        gs.compactViewOptions.controlLayout = this.compactViewOptions.controlLayout;
        return gs;
    }

    /**
     * Creates a template for the general settings
     */
    toTemplate(): SimpleCalendar.HandlebarTemplateData.GeneralSettings {
        return {
            ...super.toTemplate(),
            gameWorldTimeIntegration: this.gameWorldTimeIntegration,
            showClock: this.showClock,
            noteDefaultVisibility: this.noteDefaultVisibility,
            postNoteRemindersOnFoundryLoad: this.postNoteRemindersOnFoundryLoad,
            pf2eSync: this.pf2eSync,
            dateFormat: this.dateFormat,
            compactViewOptions: this.compactViewOptions
        };
    }

    /**
     * Creates the configuration object for the general settings
     */
    toConfig(): SimpleCalendar.GeneralSettingsData {
        return {
            id: this.id,
            gameWorldTimeIntegration: this.gameWorldTimeIntegration,
            showClock: this.showClock,
            noteDefaultVisibility: this.noteDefaultVisibility,
            postNoteRemindersOnFoundryLoad: this.postNoteRemindersOnFoundryLoad,
            pf2eSync: this.pf2eSync,
            dateFormat: this.dateFormat,
            compactViewOptions: this.compactViewOptions
        };
    }

    /**
     * Sets the properties for this class to options set in the passed in configuration object
     * @param {GeneralSettingsData} config The configuration object for this class
     */
    loadFromSettings(config: SimpleCalendar.GeneralSettingsData) {
        if (config && Object.keys(config).length) {
            this.id = config.id;
            this.gameWorldTimeIntegration = config.gameWorldTimeIntegration;
            this.showClock = config.showClock;
            this.noteDefaultVisibility = config.noteDefaultVisibility;

            if (Object.prototype.hasOwnProperty.call(config, "pf2eSync")) {
                this.pf2eSync = config.pf2eSync;
            }

            if (Object.prototype.hasOwnProperty.call(config, "dateFormat")) {
                this.dateFormat = config.dateFormat;
                if (!Object.prototype.hasOwnProperty.call(config.dateFormat, "chatTime")) {
                    this.dateFormat.chatTime = "MMM DD, YYYY HH:mm";
                }
            }

            if (Object.prototype.hasOwnProperty.call(config, "compactViewOptions")) {
                this.compactViewOptions = config.compactViewOptions;
            }

            if (Object.prototype.hasOwnProperty.call(config, "postNoteRemindersOnFoundryLoad")) {
                this.postNoteRemindersOnFoundryLoad = config.postNoteRemindersOnFoundryLoad;
            }
        }
    }
}
