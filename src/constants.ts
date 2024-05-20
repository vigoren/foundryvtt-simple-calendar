/**
 * The name of this module
 * @internal
 */
export const ModuleName = "foundryvtt-simple-calendar";

/**
 * The name of the module specific socket
 * @internal
 */
export const ModuleSocketName = `module.${ModuleName}`;

/**
 * The name of the settings that are saved in the world settings database
 * @internal
 */
export enum SettingNames {
    Theme = "theme",
    OpenOnLoad = "open-on-load",
    OpenCompact = "open-compact",
    RememberPosition = "remember-position",
    RememberCompactPosition = "remember-compact-position",
    AppPosition = "app-position",
    AppCompactPosition = "app-compact-position",
    NoteReminderNotification = "note-reminder-notification",
    NoteListOpenDirection = "note-list-open-direction",
    AlwaysShowNoteList = "always-show-note-list",
    PersistentOpen = "persistent-open",

    CompactViewScale = "compact-view-scale",
    CalendarMainApp = "calendar-main-app",
    CalendarConfigurationMenu = "calendar-configuration-menu",
    CalendarConfiguration = "calendar-configuration",
    ActiveCalendar = "active-calendar",
    GlobalConfiguration = "global-configuration",

    YearConfiguration = "year-config",
    WeekdayConfiguration = "weekday-config",
    MonthConfiguration = "month-config",
    CurrentDate = "current-date",
    Notes = "notes",
    AllowPlayersToAddNotes = "allow-players-add-notes",
    DefaultNoteVisibility = "default-note-visibility",
    LeapYearRule = "leap-year-rule",
    TimeConfiguration = "time-configuration",
    GeneralConfiguration = "general-configuration",
    SeasonConfiguration = "season-configuration",
    MoonConfiguration = "moon-configuration",
    NoteCategories = "note-categories"
}

/**
 * The different Themes that are available for Simple Calendar
 * @internal
 */
export const Themes: SimpleCalendar.Theme[] = [
    {
        key: "dark",
        name: "FSC.Configuration.Theme.Dark",
        system: false,
        module: false
    },
    {
        key: "light",
        name: "FSC.Configuration.Theme.Light",
        system: false,
        module: false
    },
    {
        key: "classic",
        name: "FSC.Configuration.Theme.Classic",
        system: false,
        module: false
    },
    {
        key: "wfrp4e",
        name: "FSC.Configuration.Theme.WFRP4E",
        system: true,
        module: false,
        images: {
            "--wfrp4e-window-app-header-blank": "/systems/wfrp4e/ui/frames/window-app-header-blank.webp",
            "--wfrp4e-window-app-background-bookshelf": "/systems/wfrp4e/ui/frames/window-app-background-bookshelf.webp",
            "--wfrp4e-window-app-dialog-content": "/systems/wfrp4e/ui/window-app-dialog-content.webp",
            "--wfrp4e-parchment-texture": "/systems/wfrp4e/ui/frames/parchment-texture.webp",
            "--wfrp4e-chat-message-border-private": "/systems/wfrp4e/ui/frames/chat-message-border-private.webp",
            "--wfrp4e-footer-button": "/systems/wfrp4e/ui/footer-button.webp",
            "--wfrp4e-button-close": "/systems/wfrp4e/ui/buttons/button-close.webp",
            "--wfrp4e-button-configure-sheet": "/systems/wfrp4e/ui/buttons/button-configure-sheet.webp",
            "--wfrp4e-button-show-players": "/systems/wfrp4e/ui/buttons/button-show-players.webp",
            "--wfrp4e-players-border": "/systems/wfrp4e/ui/players-border.webp",
            "--wfrp4e-button-blank": "/systems/wfrp4e/ui/buttons/button-blank.webp",
            "--wfrp4e-sidebar_button-background_grey": "/systems/wfrp4e/ui/sidebar_button-background_grey.webp",
            "--wfrp4e-sidebar_button-background_red": "/systems/wfrp4e/ui/sidebar_button-background_red.webp",
            "--wfrp4e-window-app-journal-sheet-content": "/systems/wfrp4e/ui/frames/window-app-journal-sheet-content.webp"
        }
    },
    {
        key: "forbidden-lands",
        name: "FSC.Predefined.ForbiddenLands",
        system: true,
        module: false,
        images: {
            "--forbidden-lands-box-border-large": "/systems/forbidden-lands/assets/journal-art/box-border-large.webp"
        }
    },
    {
        key: "dsa5",
        name: "FSC.Predefined.DSA-TDE5e",
        system: true,
        module: false,
        images: {
            "--dsa5-blackhat": "/systems/dsa5/icons/backgrounds/blackhat.webp",
            "--dsa5-blackbook": "/systems/dsa5/icons/backgrounds/blackbook.webp",
            "--dsa5-journalentry": "/systems/dsa5/icons/backgrounds/journalentry.webp",
            "--dsa5-actor": "/systems/dsa5/icons/backgrounds/actor.webp"
        }
    },
    {
        key: "sfrpg",
        name: "FSC.Predefined.Starfinder",
        system: true,
        module: false,
        images: {
            "--sfrpg-hexellence": "/systems/sfrpg/images/hexellence.webp"
        }
    },
    {
        key: "wrath-and-glory",
        name: "FSC.Predefined.Warhammer40kWG",
        system: true,
        module: false,
        images: {
            "--wrath-and-glory-header": "/systems/wrath-and-glory/asset/image/header.webp",
            "--wrath-and-glory-journal-border": "/systems/wrath-and-glory/asset/image/journal-border.webp",
            "--wrath-and-glory-background": "/systems/wrath-and-glory/asset/image/background.webp",
            "--wrath-and-glory-border": "/systems/wrath-and-glory/asset/image/border.webp",
            "--wrath-and-glory-input": "/systems/wrath-and-glory/asset/image/input.webp",
            "--wrath-and-glory-button": "/systems/wrath-and-glory/asset/image/button.webp"
        }
    },
    {
        key: "eclipsephase",
        name: "FSC.Predefined.EclipsePhase",
        system: true,
        module: false,
        images: {
            "--eclipsephase-background2": "/systems/eclipsephase/resources/img/background2.jpg"
        }
    },
    {
        key: "cyberpunk-red-core",
        name: "FSC.Configuration.Theme.Cyberpunk-Red",
        system: true,
        module: false
    }
    //key: "ernies-modern-layout", name: "Ernie's Modern UI", system: false, module: true}
];

export enum CombatPauseRules {
    Active = "active",
    Current = "current"
}

/**
 * The different types of migrations that can happen
 * @internal
 */
export enum MigrationTypes {
    none = "none",
    v1To2 = "v1-v2"
}

/**
 * This is an enum that contains a list of all available predefined calendars within Simple Calendar.
 * @enum
 * @remarks
 * **Important**: This is a list of keys used internally to determine which Predefined calendar should be used it does not return an object containing the configuration for a predefined calendar.
 *
 */
export enum PredefinedCalendars {
    /** The standard real life calendar */
    Gregorian = "gregorian",
    /** This is the calendar from the Dark Sun setting for Dungeons and Dragons */
    DarkSun = "darksun",
    /** This is the calendar from the Eberron setting for Dungeons and Dragons */
    Eberron = "eberron",
    /** This is the calendar from the Exandria setting for Dungeons and Dragons */
    Exandrian = "exandrian",
    /** This is the calendar for Forbidden Lands */
    ForbiddenLands = "forbidden-lands",
    /** This is the calendar used across Faerun in the Forgotten Realms */
    Harptos = "harptos",
    /** This is the calendar from the Pathfinder 1E game */
    GolarianPF1E = "golarianpf1e",
    /** This is the calendar from the Pathfinder 2E game */
    GolarianPF2E = "golarianpf2e",
    /** This is the calendar from the Greyhawk setting for Dungeons and Dragons */
    Greyhawk = "greyhawk",
    /** This is the Imperial calendar used for the Traveller game system */
    TravellerImperialCalendar = "traveller-ic",
    /** This is the calendar used by the Imperium in the Fantasy Warhammer game */
    WarhammerImperialCalendar = "warhammer"
}

/**
 * The different intervals a note can repeat
 */
export enum NoteRepeat {
    /** The note will never repeat */
    Never,
    /** The note will repeat every week */
    Weekly,
    /** The note will repeat every month on the same days */
    Monthly,
    /** The note will repeat every year on the same days */
    Yearly
}

export const NotesDirectoryName = `_simple_calendar_notes_directory`;

/**
 * The different ways in which a date can match a date range
 * @internal
 */
export enum DateRangeMatch {
    None = "none",
    Start = "start",
    End = "end",
    Middle = "mid",
    Exact = "exact"
}

/**
 * The different rules used to determine when/if leap years happen
 */
export enum LeapYearRules {
    /** The calendar contains no leap years */
    None = "none",
    /** The calendars leap year rules are like the standard calendar (Every year that is exactly divisible by four is a leap year, except for years that are exactly divisible by 100, but these years are leap years if they are exactly divisible by 400) */
    Gregorian = "gregorian",
    /** Allows you to specify `n` interval in years for when a leap year happens */
    Custom = "custom"
}

/**
 * The different rules used for determining how to name years
 */
export enum YearNamingRules {
    /** Names from the list of year names are used in order. If there are not enough names in the list for the current year then the last name in the list is used. */
    Default = "default",
    /** Names from the list of year names are used in order. If there are not enough names in the list for the current year then the list is repeated. */
    Repeat = "repeat",
    /**
     * Names from the list of year names are randomly assigned to years
     * @remarks
     * Simple Calendar does attempt to keep the same name for years, so switching between years should not result in a different name every time.
     * If a name is added or removed from the list of year names, the year names are randomly assigned again to years. This can result in a different name being used for the current year.
     */
    Random = "random"
}

/**
 * The different types of information we send over our socket
 * @internal
 */
export enum SocketTypes {
    mainAppUpdate = "main-app-update",
    primary = "primary",
    clock = "clock",
    checkClockRunning = "check-clock-running",
    journal = "journal",
    dateTimeChange = "date-time-change",
    noteUpdate = "note-update",
    emitHook = "emit-hook",
    setActiveCalendar = "set-calendar",
    renderChatLog = "render-chat-log"
}

/**
 * The types that can be associated with a date time change socket request
 * @internal
 */
export enum DateTimeChangeSocketTypes {
    setDate = "set-date",
    changeDateTime = "change-date-time",
    advanceTimeToPreset = "advance-time-to-preset"
}

/**
 * The different game world integrations offered
 */
export enum GameWorldTimeIntegrations {
    /**
     * Simple Calendar does not interact with the game world time at all. This setting is ideal if you want to keep Simple Calendar isolated from other modules.
     *
     * **Update Game World Time**: Does not update the game world time.
     *
     * **Whe Game World Time Is Updated**: Simple Calendar is not updated when the game world time is updated by something else.
     */
    None = "none",
    /**
     * Treats Simple Calendar as the authority source for the game world time. This setting is ideal when you want Simple Calendar to be in control of the games time and don't want other modules updating Simple Calendar.
     *
     * **Update Game World Time**: Updates the game world time to match what is in Simple Calendar.
     *
     * **Whe Game World Time Is Updated**: Combat round changes will update Simple Calendars time. Simple Calendar will ignore updates from all others modules.
     */
    Self = "self",
    /**
     * This will instruct Simple Calendar to just display the Time in the game world time. All date changing controls are disabled and the changing of time relies 100% on another module. This setting is ideal if you are just want to use Simple Calenar to display the date in calendar form and/or take advantage of the notes.
     *
     * **Update Game World Time**: Does not update the game world time.
     *
     * **Whe Game World Time Is Updated**: Updates its display everytime the game world time is changed, following what the other modules say the time is.
     */
    ThirdParty = "third-party",
    /**
     * This option is a blend of the self and third party options. Simple calendar can change the game world time and changes made by other modules are reflected in Simple Calendar. This setting is ideal if you want to use Simple Calendar and another module to change the game time.
     *
     * **Update Game World Time**: Will update the game world time.
     *
     * **Whe Game World Time Is Updated**: Will update its own time based on changes to the game world time, following what other modules say the time is.
     */
    Mixed = "mixed"
}

/**
 * All SVG icons that are available to use with the sc-icon handlebar helper
 */
export enum Icons {
    /** An empty Icon */
    None = "none",
    /** The Simple Calendar Logo */
    Logo = "logo",
    /** The clock icon used in the animated clock */
    Clock = "clock",
    /** The icon that represents midday */
    Midday = "midday",
    /** The icon that represents midnight */
    Midnight = "midnight",
    /** The icon that represents sunrise */
    Sunrise = "sunrise",
    /** The icon that represents sunset */
    Sunset = "sunset",
    /** The icon that represents a new moon */
    NewMoon = "new",
    /** The icon that represents a waxing crescent moon */
    WaxingCrescent = "waxing-crescent",
    /** The icon that represents first quarter moon */
    FirstQuarter = "first-quarter",
    /** The icon that represents waxing gibbous moon */
    WaxingGibbous = "waxing-gibbous",
    /** The icon that represents full moon */
    Full = "full",
    /** The icon that represents waning gibbous moon */
    WaningGibbous = "waning-gibbous",
    /** The icon that represents last quarter moon */
    LastQuarter = "last-quarter",
    /** The icon that represents waning crescent moon */
    WaningCrescent = "waning-crescent",
    /** The icon that represents the season spring */
    Spring = "spring",
    /** The icon that represents the season summer */
    Summer = "summer",
    /** The icon that represents the season fall */
    Fall = "fall",
    /** The icon that represents the season winter */
    Winter = "winter"
}

/**
 * These options are used to tell Simple Calendar when to reset the year portion of the reference new moon.
 * @remarks
 * The reference new moon is any date a new moon occurred on in the calendar. This date is then used as a starting point to calculate the different phases of the moon. Any phase in any year can be calculated from this value, and it does not need to be updated after its initial setting.
 */
export enum MoonYearResetOptions {
    /** Do not reset the year of the reference new moon */
    None = "none",
    /** Reset the year of the reference new moon every year that is a leap year */
    LeapYear = "leap-year",
    /** Reset the year of the reference new moon by every x number of years */
    XYears = "x-years"
}

/**
 * These are times of the day that do not always have the same time but rather need to be calculated. This value can be passed into other functions to specify which time of day you want calculated.
 */
export enum PresetTimeOfDay {
    /** The time of day when midnight occurs  */
    Midnight = "midnight",
    /** The time of day when the sun rises. This time is affected by the sunrise time of a season and the current date */
    Sunrise = "sunrise",
    /** The time of day when midday (noon) occurs  */
    Midday = "midday",
    /** The time of day when the sun sets. This time is affected by the sunset time of a season and the current date */
    Sunset = "sunset"
}

/**
 * The different hooks that other systems and modules can listen too
 */
export enum SimpleCalendarHooks {
    DateTimeChange = "simple-calendar-date-time-change",
    ClockStartStop = "simple-calendar-clock-start-stop",
    PrimaryGM = "simple-calendar-primary-gm",
    Ready = "simple-calendar-ready",
    Init = "simple-calendar-init"
}

/**
 * The statuses that a timekeeper can have
 * @internal
 */
export enum TimeKeeperStatus {
    Started = "started",
    Stopped = "stopped",
    Paused = "paused"
}

/**
 * The different options for how to display the compact view date/time controls
 */
export enum CompactViewDateTimeControlDisplay {
    Full = "full",
    QuickIncrement = "quick-increment"
}

/**
 * Which view the calendar should render
 * @internal
 */
export enum CalendarViews {
    Month = "Month",
    Year = "year"
}

/**
 * The associated click events for a calendar view
 * @internal
 */
export enum CalendarClickEvents {
    calendar = "calendar",
    previous = "previous",
    next = "next",
    day = "day",
    dayContext = "datContext",
    year = "year"
}

/**
 * The associated click events for a time selector
 * @internal
 */
export enum TimeSelectorEvents {
    wheel = "wheel",
    change = "change",
    dropdownClick = "dropdown-click"
}

/**
 * The types of date selectors in the configuration application
 * @internal
 */
export enum ConfigurationDateSelectors {
    seasonStartingDate = "ssd",
    seasonSunriseSunsetTime = "ssst",
    moonFirstNewMoonDate = "mfnmd"
}

/**
 * These are the options for how a {@link DateSelector | DateSelector's} calendar will open when the input is clicked.
 * @internal
 */
export enum DateSelectorPositions {
    /** The {@link DateSelector | DateSelector} will attempt to choose the best direction to open the calendar based on the input's location on the screen */
    Auto = "auto",
    /** Will open the calendar from the left side of and below the input */
    LeftDown = "left-down",
    /** Will open the calendar from the left side of and above the input */
    LeftUp = "left-up",
    /** Will open the calendar from the right side of and below the input */
    RightDown = "right-down",
    /** Will open the calendar from the right side of and above the input */
    RightUp = "right-up"
}

/**
 * The time units that the calendar can be adjusted by
 * @internal
 */
export enum DateTimeUnits {
    Day = "day",
    Month = "month",
    Year = "year",
    Hour = "hour",
    Minute = "minute",
    Round = "round",
    Second = "seconds"
}

/**
 * When a note reminder is triggered how to let the user know about the reminder.
 * @internal
 */
export enum NoteReminderNotificationType {
    /** Have the reminder whispered to the player in chat with details and link to the note */
    whisper = "whisper",
    /** Display the note's sheet */
    render = "render"
}

export enum TriggerConditions {
    Date,
    Time,
    DateTime,
    Year,
    Month,
    Day
}

export enum TriggerParameters {
    Equal,
    Before,
    After,
    Nth
}
