/**
 * The name of this module
 */
export const ModuleName = 'foundryvtt-simple-calendar';

/**
 * The name of the module specific socket
 */
export const ModuleSocketName = `module.${ModuleName}`;

/**
 * The name of the settings that are saved in the world settings database
 */
export enum SettingNames {
    YearConfiguration = 'year-config',
    WeekdayConfiguration = 'weekday-config',
    MonthConfiguration = 'month-config',
    CurrentDate = 'current-date',
    Notes = 'notes',
    AllowPlayersToAddNotes = 'allow-players-add-notes',
    DefaultNoteVisibility = 'default-note-visibility',
    LeapYearRule = 'leap-year-rule',
    TimeConfiguration = 'time-configuration',
    GeneralConfiguration = 'general-configuration',
    ImportRan = 'import-ran',
    SeasonConfiguration = 'season-configuration',
    MoonConfiguration = 'moon-configuration'
}

/**
 * The different intervals a note can repeat
 */
export enum NoteRepeat {
    Never,
    Weekly,
    Monthly,
    Yearly
}

/**
 * The different rules used for leap years
 */
export enum LeapYearRules {
    None = 'none',
    Gregorian = 'gregorian',
    Custom = 'custom'
}

/**
 * The different types of information we send over our socket
 */
export enum SocketTypes {
    primary = 'primary',
    time = 'time',
    journal = 'journal'
}

/**
 * The different game world integrations offered
 */
export enum GameWorldTimeIntegrations {
    /**
     * Time tracking is disabled for this calendar
     * no clock will be shown
     * no time controls will be shown
     * date controls will be shown
     */
    None = 'none',
    /**
     * Simple Calendar is the main controller of the world time, updates to the game world time not initiated by simple calendar are ignored
     * clock will be shown
     * time controls will be shown
     * date controls will be shown
     */
    Self = 'self',
    /**
     * Another module is responsible for updating the game world time, simple calendar will not update the game world time
     * clock will be shown
     * time controls will not be shown
     * date controls will not be shown
     */
    ThirdParty = 'third-party',
    /**
     * Simple Calendar and other modules can both update the game world time, this could cause odd behaviour depending on what the other module is doing
     * clock will be shown
     * time controls will be shown
     * date controls will be shown
     */
    Mixed = 'mixed'
}
