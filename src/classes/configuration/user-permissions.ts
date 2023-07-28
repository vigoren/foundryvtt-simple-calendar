import ConfigurationItemBase from "./configuration-item-base";
import { isObject } from "../utilities/object";

export default class UserPermissions extends ConfigurationItemBase {
    /**
     * Which users can view the calendar
     */
    viewCalendar: SimpleCalendar.PermissionMatrix;
    /**
     * Which users can add notes to the calendar
     */
    addNotes: SimpleCalendar.PermissionMatrix;
    /**
     * Which users can reorder notes on calendar days
     */
    reorderNotes: SimpleCalendar.PermissionMatrix;
    /**
     * Which users can change the date/time of the calendar
     */
    changeDateTime: SimpleCalendar.PermissionMatrix;
    /**
     * Which users can change the active calendar
     */
    changeActiveCalendar: SimpleCalendar.PermissionMatrix;

    constructor() {
        super();

        this.viewCalendar = { player: true, trustedPlayer: true, assistantGameMaster: true, users: undefined };
        this.addNotes = { player: false, trustedPlayer: false, assistantGameMaster: false, users: undefined };
        this.reorderNotes = { player: false, trustedPlayer: false, assistantGameMaster: false, users: undefined };
        this.changeDateTime = { player: false, trustedPlayer: false, assistantGameMaster: false, users: undefined };
        this.changeActiveCalendar = { player: false, trustedPlayer: false, assistantGameMaster: false, users: undefined };
    }

    /**
     * Makes a copy of a Permission Matrix
     * @param {PermissionMatrix} p The permission matrix to copy
     * @private
     */
    private static clonePermissions(p: SimpleCalendar.PermissionMatrix): SimpleCalendar.PermissionMatrix {
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
        up.changeActiveCalendar = UserPermissions.clonePermissions(this.changeActiveCalendar);
        return up;
    }

    /**
     * Creates a template for the user permissions
     */
    toTemplate(): SimpleCalendar.HandlebarTemplateData.UserPermissions {
        return {
            ...super.toTemplate(),
            viewCalendar: this.viewCalendar,
            addNotes: this.addNotes,
            reorderNotes: this.reorderNotes,
            changeDateTime: this.changeDateTime,
            changeActiveCalendar: this.changeActiveCalendar
        };
    }

    /**
     * Creates the configuration object for these permissions
     */
    toConfig(): SimpleCalendar.UserPermissionsData {
        return {
            id: this.id,
            addNotes: this.addNotes,
            changeDateTime: this.changeDateTime,
            reorderNotes: this.reorderNotes,
            viewCalendar: this.viewCalendar,
            changeActiveCalendar: this.changeActiveCalendar
        };
    }

    /**
     * Sets the properties for this class to option set from the passed in configuration object
     * @param {UserPermissionsData} config The configuration object for this class
     */
    loadFromSettings(config: SimpleCalendar.UserPermissionsData) {
        if (config && Object.keys(config).length) {
            if (Object.prototype.hasOwnProperty.call(config, "viewCalendar") && this.validateUserPermissionMatrix(config.viewCalendar)) {
                this.viewCalendar = config.viewCalendar;
            }
            if (Object.prototype.hasOwnProperty.call(config, "addNotes") && this.validateUserPermissionMatrix(config.addNotes)) {
                this.addNotes = config.addNotes;
            }
            if (Object.prototype.hasOwnProperty.call(config, "changeDateTime") && this.validateUserPermissionMatrix(config.changeDateTime)) {
                this.changeDateTime = config.changeDateTime;
            }
            if (Object.prototype.hasOwnProperty.call(config, "reorderNotes") && this.validateUserPermissionMatrix(config.reorderNotes)) {
                this.reorderNotes = config.reorderNotes;
            }
            if (
                Object.prototype.hasOwnProperty.call(config, "changeActiveCalendar") &&
                this.validateUserPermissionMatrix(config.changeActiveCalendar)
            ) {
                this.changeActiveCalendar = config.changeActiveCalendar;
            }
        }
    }

    /**
     * Checks to make sure the Permission Matrix object contains all the required properties
     * @param obj The item to check if is a valid permission matrix
     */
    validateUserPermissionMatrix(obj: any) {
        return !!(
            obj &&
            isObject(obj) &&
            Object.prototype.hasOwnProperty.call(obj, "player") &&
            Object.prototype.hasOwnProperty.call(obj, "trustedPlayer") &&
            Object.prototype.hasOwnProperty.call(obj, "assistantGameMaster")
        );
    }
}
