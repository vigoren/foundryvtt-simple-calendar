import { Logger } from "../logging";
import { CombatPauseRules, ModuleName, SettingNames } from "../../constants";
import { SC } from "../index";

export class GameSettings {
    /**
     * Returns if the current user is the GM
     * @return {boolean}
     */
    static IsGm(): boolean {
        const u = (<Game>game).user;
        return u ? u.isGM : false;
    }

    /**
     * Returns the current users name
     * @return {string}
     */
    static UserName(): string {
        const u = (<Game>game).user;
        return u ? (u.name ? u.name : "") : "";
    }

    /**
     * Returns the current users ID
     * @return {string}
     */
    static UserID(): string {
        const u = (<Game>game).user;
        return u ? (u.id ? u.id : "") : "";
    }

    static GetUser(userId: string): User | undefined {
        const users = (<Game>game).users;
        if (users) {
            return users.find((u) => {
                return u.id === userId;
            });
        }
        return undefined;
    }

    /**
     * Gets the current version of Simple Calendar
     */
    static GetModuleVersion(): string {
        const mData = (<Game>game).modules.get(ModuleName);
        if (mData) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            return mData.version;
        }
        return "";
    }

    /**
     * Returns the localized string based on the key
     * @param {string} key The localization string key
     */
    static Localize(key: string): string {
        if ((<Game>game).i18n) {
            return (<Game>game).i18n.localize(key);
        } else {
            const parts = key.split(".");
            return parts[parts.length - 1];
        }
    }

    /**
     * Will return the value for the passed in boolean setting
     * @param {SettingNames} setting The name of the setting to get
     */
    static GetBooleanSettings(setting: SettingNames): boolean {
        return <boolean>(<Game>game).settings.get(ModuleName, setting);
    }

    /**
     * Will return the value for the passed in object setting
     * @param {SettingNames} setting The name of the setting to get
     */
    static GetObjectSettings(setting: SettingNames): object {
        return <object>(<Game>game).settings.get(ModuleName, setting);
    }

    /**
     * Will return the value for the passed in string setting
     * @param {SettingNames} setting The name of the setting to get
     */
    static GetStringSettings(setting: SettingNames | string): string {
        return <string>(<Game>game).settings.get(ModuleName, setting);
    }

    /**
     * Will return the value for the passed in number setting
     * @param {SettingNames} setting The name of the setting to get
     */
    static GetNumericSettings(setting: SettingNames | string): number {
        return <number>(<Game>game).settings.get(ModuleName, setting);
    }

    static async SaveBooleanSetting(setting: SettingNames, data: boolean, checkIfGM: boolean = true): Promise<boolean> {
        let save = false;
        if (checkIfGM) {
            if (this.IsGm()) {
                save = true;
            }
        } else {
            save = true;
        }
        if (save) {
            return await (<Game>game).settings.set(ModuleName, setting, data).then(() => {
                return true;
            });
        }
        return false;
    }

    static async SaveStringSetting(setting: SettingNames | string, data: string, checkIfGM: boolean = true): Promise<boolean> {
        let save = false;
        if (checkIfGM) {
            if (this.IsGm()) {
                save = true;
            }
        } else {
            save = true;
        }
        if (save) {
            return await (<Game>game).settings.set(ModuleName, setting, data).then(() => {
                return true;
            });
        }
        return false;
    }

    static async SaveNumericSetting(setting: SettingNames | string, data: number, checkIfGM: boolean = true): Promise<boolean> {
        let save = false;
        if (checkIfGM) {
            if (this.IsGm()) {
                save = true;
            }
        } else {
            save = true;
        }
        if (save) {
            return await (<Game>game).settings.set(ModuleName, setting, data).then(() => {
                return true;
            });
        }
        return false;
    }

    /**
     * Save the passed in object to the passed in setting
     * @param setting
     * @param data
     * @param checkIfGM
     */
    static async SaveObjectSetting(setting: SettingNames, data: object, checkIfGM: boolean = true): Promise<boolean> {
        let save = false;
        if (checkIfGM) {
            if (this.IsGm()) {
                save = true;
            }
        } else {
            save = true;
        }
        if (save) {
            const currentSettings = GameSettings.GetObjectSettings(setting);
            if (JSON.stringify(data) !== JSON.stringify(currentSettings)) {
                return await (<Game>game).settings.set(ModuleName, setting, data).then(() => {
                    return true;
                });
            }
        }
        return false;
    }

    /**
     * Display a notification using the game UI
     * @param {string} message The message to display
     * @param {string} type The type of notification to show
     * @param permanent If the message should stay until dismissed.
     */
    static UiNotification(message: string, type: string = "info", permanent: boolean = false) {
        if (ui.notifications) {
            if (type === "info") {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                ui.notifications.info(message, { permanent: permanent, console: false, localize: true });
            } else if (type === "warn") {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                ui.notifications.warn(message, { permanent: permanent, console: false, localize: true });
            } else if (type === "error") {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                ui.notifications.error(message, { permanent: permanent, console: false, localize: true });
            }
        } else {
            Logger.error("The UI class is not initialized.");
        }
    }

    /**
     * Gets the scene to check for active combats
     */
    static GetSceneForCombatCheck() {
        let scene: Scene | null = null;
        const scenes = (<Game>game).scenes;
        if (scenes) {
            if (SC.globalConfiguration.combatPauseRule === CombatPauseRules.Active) {
                scene = scenes.active || null;
            } else if (SC.globalConfiguration.combatPauseRule === CombatPauseRules.Current) {
                scene = scenes.current || null;
            }
        }
        return scene;
    }
}
