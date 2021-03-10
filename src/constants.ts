/**
 * The name of this module
 */
export const ModuleName = 'foundryvtt-simple-calendar';

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
    TimeConfiguration = 'time-configuration'
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

export enum LeapYearRules {
    None = 'none',
    Gregorian = 'gregorian',
    Custom = 'custom'
}

export enum TimeKeeper {
    None = 'none',
    Self = 'self',
    AboutTime = 'about-time'
}
