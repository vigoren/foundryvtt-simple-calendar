/**
 * Interface for the calendar template that is passed to the HTML for rendering
 */
export interface CalendarTemplate {
    isGM: boolean;
    playersAddNotes: boolean;
    selectedYear: number;
    selectedMonth: MonthTemplate | undefined;
    selectedDay: DayTemplate | undefined;
    visibleYear: number;
    visibleMonth: MonthTemplate | undefined;
    visibleMonthStartWeekday: any[];
    currentYear: YearTemplate;
    currentMonth: MonthTemplate | undefined;
    currentDay: DayTemplate | undefined;
    showSelectedDay: boolean;
    showCurrentDay: boolean;
}

/**
 * Interface for the year template that is passed to the HTML for rendering
 */
export interface YearTemplate {
    /** The display text of the year */
    display: string;
    /** The numeric representation of the year */
    numericRepresentation: number;
    /** The months that make up the year */
    months: MonthTemplate[];
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
}

/**
 * Interface for the data saved to the game settings for a month class
 */
export interface MonthConfig {
    name: string;
    numericRepresentation: number;
    numberOfDays: number;
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
