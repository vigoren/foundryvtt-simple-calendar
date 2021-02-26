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
    AllowPlayersToAddNotes = 'allow-players-add-notes'
}

/**
 * The different intervals a note can repeat
 */
export enum NoteRepeat {
    Never,
    Monthly,
    Yearly,
    Weekly
}
