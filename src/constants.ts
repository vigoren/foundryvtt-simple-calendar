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
    CalendarConfigurationMenu= 'calendar-configuration-menu',
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
    SeasonConfiguration = 'season-configuration',
    MoonConfiguration = 'moon-configuration',
    NoteCategories = 'note-categories'
}

/**
 * The different predefined calendars that come with the calendar
 */
export enum PredefinedCalendars{
    Gregorian = 'gregorian',
    DarkSun = 'darksun',
    Eberron = 'eberron',
    Exandrian = 'exandrian',
    ForbiddenLands = 'forbidden-lands',
    Harptos = 'harptos',
    GolarianPF1E = 'golarianpf1e',
    GolarianPF2E = 'golarianpf2e',
    Greyhawk = 'greyhawk',
    TravellerImperialCalendar = 'traveller-ic',
    WarhammerImperialCalendar = 'warhammer'
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

export enum DateRangeMatch {
    None = 'none',
    Start = 'start',
    End = 'end',
    Middle = 'mid',
    Exact = 'exact'
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
 * The different rules used for determening how to name years
 */
export enum YearNamingRules{
    Default = 'default',
    Repeat = 'repeat',
    Random = 'random'
}

/**
 * The different types of information we send over our socket
 */
export enum SocketTypes {
    primary = 'primary',
    time = 'time',
    checkClockRunning = 'check-clock-running',
    journal = 'journal',
    dateTime = 'date-time',
    date = 'date',
    noteReminders = 'note-reminder',
    emitHook = 'emit-hook'
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

export enum MoonIcons {
    NewMoon = 'new',
    WaxingCrescent = 'waxing-crescent',
    FirstQuarter = 'first-quarter',
    WaxingGibbous = 'waxing-gibbous',
    Full = 'full',
    WaningGibbous = 'waning-gibbous',
    LastQuarter = 'last-quarter',
    WaningCrescent = 'waning-crescent'
}

export enum MoonYearResetOptions {
    None = 'none',
    LeapYear = 'leap-year',
    XYears = 'x-years'
}

export enum PresetTimeOfDay {
    Midnight = 'midnight',
    Sunrise = 'sunrise',
    Midday = 'midday',
    Sunset = 'sunset'
}

/**
 * Common Game Systems that can be used for system specific integrations
 */
export enum GameSystems {
    DnD5E ='dnd5e',
    PF1E = 'pf1',
    PF2E = 'pf2e',
    WarhammerFantasy4E = 'wfrp4e',
    Other = 'other'
}

export enum SimpleCalendarHooks {
    DateTimeChange = 'simple-calendar-date-time-change',
    ClockStartStop = 'simple-calendar-clock-start-stop',
    PrimaryGM = 'simple-calendar-primary-gm',
    Ready = 'simple-calendar-ready'
}

export enum TimeKeeperStatus {
    Started = 'started',
    Stopped = 'stopped',
    Paused = 'paused'
}
