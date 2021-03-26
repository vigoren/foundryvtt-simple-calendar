/**
 * Interface for the calendar template that is passed to the HTML for rendering
 */
import {LeapYearRules, NoteRepeat, GameWorldTimeIntegrations, SocketTypes} from "./constants";
import {Note} from "./classes/note";

/**
 * The general settings for the Simple calendar
 * NOTE: The Player note default visibility is not stored in these settings (Legacy support)
 */
export interface GeneralSettings {
    /** How Simple Calendar interacts with the game world time */
    gameWorldTimeIntegration: GameWorldTimeIntegrations;
    /** If to show the clock below the calendar */
    showClock: boolean;
    /** If players can add their own notes */
    playersAddNotes: boolean;
}

export interface CalendarTemplate {
    isGM: boolean;
    isPrimary: boolean;
    addNotes: boolean;
    currentYear: YearTemplate;
    showSelectedDay: boolean;
    showCurrentDay: boolean;
    notes: NoteTemplate[];
    clockClass: string;
    timeUnits: any;
}

/**
 * Interface for the year template that is passed to the HTML for rendering
 */
export interface YearTemplate {
    /** The display text of the year */
    display: string;
    /** The display text for the selected, or current, year */
    selectedDisplayYear: string;
    /** The display text for the selected, or current, month */
    selectedDisplayMonth: string;
    /** The display text for the selected, or current, day */
    selectedDisplayDay: string;
    /** The numeric representation of the year */
    numericRepresentation: number;
    /** The months that make up the year */
    visibleMonth: MonthTemplate | undefined;
    /** An array of 0's where the array length is the weekday the visible month starts on  */
    visibleMonthWeekOffset: number[];
    /** If to show the weekday headers on the calendar view */
    showWeekdayHeaders: boolean;
    /** The days of the week */
    weekdays: WeekdayTemplate[];

    showClock: boolean;

    clockClass: string;

    showTimeControls: boolean;

    showDateControls: boolean;

    currentTime: TimeTemplate;

    currentSeasonName: string;

    currentSeasonColor: string;
}

/**
 * Interface for the data saved to the game settings for a year class
 */
export interface YearConfig {
    numericRepresentation: number;
    prefix: string;
    postfix: string;
    showWeekdayHeadings: boolean;
}

/**
 * Interface for the month template that is passed to the HTML for rendering
 */
export interface  MonthTemplate {
    display: string;
    name: string;
    numericRepresentation: number;
    current: boolean;
    visible: boolean;
    selected: boolean;
    days: any[];
    numberOfDays: number;
    numberOfLeapYearDays: number;
    intercalary: boolean;
    intercalaryInclude: boolean;
}

/**
 * Interface for the data saved to the game settings for a month class
 */
export interface MonthConfig {
    name: string;
    numericRepresentation: number;
    numberOfDays: number;
    numberOfLeapYearDays: number;
    intercalary: boolean;
    intercalaryInclude: boolean;
}

/**
 * Interface for the day template that is passed to the HTML for rendering
 */
export interface DayTemplate {
    /** The display name of the day */
    name: string;
    /** The numeric representation of the day */
    numericRepresentation: number;
    /** If this day is the current day */
    current: boolean;
    /** If this day has been selected */
    selected: boolean;
}

/**
 * Interface for the data saved to the game settings for the current date
 */
export interface CurrentDateConfig {
    /** The current year */
    year: number;
    /** The current month */
    month: number;
    /** The current day */
    day: number
    /** The current time of day */
    seconds: number
}

/**
 * Interface for the note template that is passed to the HTML for rendering
 */
export interface NoteTemplate {
    title: string;
    content: string;
    author: string;
    monthDisplay: string;
    id: string;
}

/**
 * Interface for the data saved to the game settings for a note
 */
export interface NoteConfig {
    year: number;
    month: number;
    day: number;
    title: string;
    content: string;
    author: string;
    monthDisplay: string;
    playerVisible: boolean;
    id: string;
    repeats: NoteRepeat;
}

/**
 * Interface for the weekday template that is passed to the HTML for rendering
 */
export interface WeekdayTemplate {
    name: string;
    firstCharacter: string;
    numericRepresentation: number;
}

/**
 * Interface for the data saved to the game settings for each weekday class
 */
export interface WeekdayConfig {
    name: string;
    numericRepresentation: number;
}

/**
 * Interface for the data save to the game settings for the leap year information
 */
export interface LeapYearConfig {
    rule: LeapYearRules;
    customMod: number;
}

/**
 * Interface for the data saved to the game settings for the time information
 */
export interface TimeConfig {
    hoursInDay: number;
    minutesInHour: number;
    secondsInMinute: number;
    gameTimeRatio: number;
}

/**
 * Interface for displaying the time information
 */
export interface TimeTemplate {
    hour: string;
    minute: string;
    second: string;
}

/**
 * Interface for displaying the season information
 */
export interface SeasonTemplate {
    name: string;
    startingMonth: number;
    startingDay: number;
    color: string;
    customColor: string;
    dayList: DayTemplate[]
}

/**
 * Interface for saving season information
 */
export interface SeasonConfiguration {
    name: string;
    startingMonth: number;
    startingDay: number;
    color: string;
    customColor: string;
}

export interface MoonConfiguration {

}

/**
 * Namespace for our own socket information
 */
export namespace SimpleCalendarSocket{

    /**
     * Interface for the data that is sent with each socket
     */
    export interface Data {
        type: SocketTypes;
        data: SimpleCalendarSocketJournal|SimpleCalendarSocketTime|SimpleCalendarPrimary;
    }

    /**
     * Interface for socket data that has to do with the time
     */
    export interface SimpleCalendarSocketTime{
        clockClass: string;
    }

    /**
     * Interface for socket data that has to do with journals
     */
    export interface SimpleCalendarSocketJournal{
        notes: Note[];
    }

    /**
     * Interface for a GM to take over being the primary source
     */
    export interface SimpleCalendarPrimary{

    }
}

/**
 * Interfaces that have to do with the about time classes
 * These are not apart of our interface unit tests
 */
export namespace AboutTimeImport {
    /**
     * The about-time calendar object
     */
    export interface Calendar {
        "clock_start_year": number;
        "first_day": number;
        "hours_per_day": number;
        "seconds_per_minute": number;
        "minutes_per_hour": number;
        "has_year_0": boolean;
        "month_len": MonthList;
        "_month_len": {},
        "weekdays": string[],
        "leap_year_rule": string;
        "notes": {};
    }

    /**
     * Calendar month list
     */
    export interface MonthList{
        [key: string]: Month
    }

    /**
     * About time month object
     */
    export interface Month {
        "days": number[];
        "intercalary": boolean;
    }
}

/**
 * Interfaces that have to do with the calendar/weather classes
 * These are not apart of our interface unit tests
 */
export namespace CalendarWeatherImport{
    /**
     * Calendar/Weather month class
     */
    export interface Month {
        name: string;
        length: number;
        leapLength: number;
        isNumbered: boolean;
        abbrev: string;
    }

    /**
     * Calendar/Weather date class
     */
    export interface Date {
        month: string;
        day: number;
        combined: string;
    }

    /**
     * Calendar/Weather weather class
     */
    export interface Weather {
        humidity: number;
        temp: number;
        lastTemp: number;
        season: string;
        seasonColor: string;
        seasonTemp: number;
        seasonHumidity: number;
        seasonRolltable: string;
        climate: string;
        climateTemp: number;
        climateHumidity: number;
        precipitation: string;
        dawn: number;
        dusk: number;
        isVolcanic: boolean;
        outputToChat: boolean;
        weatherFx: [];
        isC: boolean;
        cTemp: string;
        tempRange: {
            max: number;
            min: number;
        }
    }

    /**
     * Calendar/Weather seasons class
     */
    export interface Seasons {
        name: string;
        rolltable: string;
        date: Date;
        temp: string;
        humidity: string;
        color: string;
        dawn: number;
        dusk: number;
    }

    /**
     * Calendar/Weather moon class
     */
    export interface Moons {
        name: string;
        cycleLength: number;
        cyclePercent: number;
        lunarEclipseChange: number;
        solarEclipseChange: number;
        referenceTime: number;
        referencePercent: number;
    }

    /**
     * Calendar/Weather event class
     */
    export interface Event {
        name: string;
        text: string;
        date: Date;
    }

    /**
     * Calendar/Weather calendar class
     */
    export interface Calendar {
        months: Month[];
        daysOfTheWeek: string[];
        year: number;
        day: number;
        numDayOfTheWeek: number;
        first_day: number;
        currentMonth: number;
        currentWeekday: string;
        dateWordy: string;
        era: string;
        dayLength: number;
        timeDisp: string;
        dateNum: string;
        weather: Weather;
        seasons: Seasons[];
        moons: Moons[];
        events: Event[];
        reEvents: Event[];
    }
}
