import ConfigurationItemBase from "./configuration-item-base";
import {PermissionMatrix, UserPermissionsConfig, UserPermissionsTemplate} from "../../interfaces";

export default class UserPermissions extends ConfigurationItemBase{
    /**
     * Which users can view the calendar
     */
    viewCalendar: PermissionMatrix;
    /**
     * Which users can add notes to the calendar
     */
    addNotes: PermissionMatrix;
    /**
     * Which users can reorder notes on calendar days
     */
    reorderNotes: PermissionMatrix;
    /**
     * Which users can change the date/time of the calendar
     */
    changeDateTime: PermissionMatrix;

    constructor() {
        super();

        this.viewCalendar = {player: true, trustedPlayer: true, assistantGameMaster: true, users: undefined};
        this.addNotes = {player: false, trustedPlayer: false, assistantGameMaster: false, users: undefined};
        this.reorderNotes = {player: false, trustedPlayer: false, assistantGameMaster: false, users: undefined};
        this.changeDateTime = {player: false, trustedPlayer: false, assistantGameMaster: false, users: undefined};
    }

    /**
     * Makes a copy of a Permission Matrix
     * @param {PermissionMatrix} p The permission matrix to copy
     * @private
     */
    private static clonePermissions(p: PermissionMatrix): PermissionMatrix{
        return {
            player: p.player,
            trustedPlayer: p.trustedPlayer,
            assistantGameMaster: p.assistantGameMaster,
            users: p.users
        };
    }

    /**
     * Creates a clone of the current user permissions
     */
    clone(): UserPermissions {
        const up = new UserPermissions();
        up.id = this.id;
        up.viewCalendar = UserPermissions.clonePermissions(this.viewCalendar);
        up.addNotes = UserPermissions.clonePermissions(this.addNotes);
        up.reorderNotes = UserPermissions.clonePermissions(this.reorderNotes);
        up.changeDateTime = UserPermissions.clonePermissions(this.changeDateTime);
        return up;
    }

    /**
     * Creates a template for the user permissions
     */
    toTemplate(): UserPermissionsTemplate {
        return {
            ...super.toTemplate(),
            viewCalendar: this.viewCalendar,
            addNotes: this.addNotes,
            reorderNotes: this.reorderNotes,
            changeDateTime: this.changeDateTime
        };
    }

    /**
     * Creates the configuration object for these permissions
     */
    toConfig(): UserPermissionsConfig {
        return {
            id: this.id,
            addNotes: this.addNotes,
            changeDateTime: this.changeDateTime,
            reorderNotes: this.reorderNotes,
            viewCalendar: this.viewCalendar
        };
    }

    /**
     * Sets the properties for this class to options set in the passed in configuration object
     * @param {UserPermissionsConfig} config The configuration object for this class
     */
    loadFromSettings(config: UserPermissionsConfig) {
        if(config && Object.keys(config).length){
            this.viewCalendar = config.viewCalendar;
            this.addNotes = config.addNotes;
            this.changeDateTime = config.changeDateTime;

            if(config.hasOwnProperty('reorderNotes')){
                this.reorderNotes = config.reorderNotes;
            }
        }
    }
}
