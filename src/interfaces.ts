/**
 * Interface for the calendar template that is passed to the HTML for rendering
 */
import {LeapYearRules, NoteRepeat} from "./constants";

export interface CalendarTemplate {
    isGM: boolean;
    currentYear: YearTemplate;
    showSelectedDay: boolean;
    showCurrentDay: boolean;
    notes: NoteTemplate[];
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
