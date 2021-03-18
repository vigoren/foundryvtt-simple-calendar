/**
 * Interface for the calendar template that is passed to the HTML for rendering
 */
import {LeapYearRules, NoteRepeat, GameWorldTimeIntegrations, SocketTypes} from "./constants";

/**
 * The general settings for the Simple calendar
 * NOTE: The Player note default visibility is not stored in these settings (Legacy support)
 */
export interface GeneralSettings {
    /** How Simple Calendar interacts with the game world time */
    gameWorldTimeIntegration: GameWorldTimeIntegrations;
    /** If to show the clock below the calendar */
    showClock: boolean;
}

export interface CalendarTemplate {
    isGM: boolean;
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
 * Interface for the weekday tempalte that is passed to the HTML for rendering
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

export interface LeapYearConfig {
    rule: LeapYearRules;
    customMod: number;
}


export interface TimeConfig {
    hoursInDay: number;
    minutesInHour: number;
    secondsInMinute: number;
    gameTimeRatio: number;
}

export interface TimeTemplate {
    hour: string;
    minute: string;
    second: string;
}

export namespace SimpleCalendarSocket{
    export interface Data {
        type: SocketTypes;
        data: SimpleCalendarSocketJournal|SimpleCalendarSocketTime;
    }

    export interface SimpleCalendarSocketTime{
        clockClass: string;
    }

    export interface SimpleCalendarSocketJournal{

    }
}

export namespace AboutTimeImport {
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

    export interface MonthList{
        [key: string]: Month
    }

    export interface Month {
        "days": number[];
        "intercalary": boolean;
    }
}

export namespace CalendarWeatherImport{
    export interface Month {
        name: string;
        length: number;
        leapLength: number;
        isNumbered: boolean;
        abbrev: string;
    }

    export interface Date {
        month: string;
        day: number;
        combined: string;
    }

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
    export interface Moons {
        name: string;
        cycleLength: number;
        cyclePercent: number;
        lunarEclipseChange: number;
        solarEclipseChange: number;
        referenceTime: number;
        referencePercent: number;
    }
    export interface Event {
        name: string;
        text: string;
        date: Date;
    }

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
