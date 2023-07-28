import { GameWorldTimeIntegrations, LeapYearRules, SimpleCalendarHooks, TimeKeeperStatus } from "../../constants";
import Year from "./year";
import Month from "./month";
import { Logger } from "../logging";
import { GameSettings } from "../foundry-interfacing/game-settings";
import { Weekday } from "./weekday";
import Season from "./season";
import Moon from "./moon";
import GeneralSettings from "../configuration/general-settings";
import ConfigurationItemBase from "../configuration/configuration-item-base";
import PF2E from "../systems/pf2e";
import Renderer from "../renderer";
import { generateUniqueId } from "../utilities/string";
import { DateToTimestamp, DaysBetweenDates, FormatDateTime, ToSeconds } from "../utilities/date-time";
import { canUser } from "../utilities/permissions";
import { CalManager, MainApplication, NManager, SC } from "../index";
import TimeKeeper from "../time/time-keeper";
import NoteStub from "../notes/note-stub";
import Time from "../time";
import { deepMerge } from "../utilities/object";
import { Hook } from "../api/hook";
import PF1E from "../systems/pf1e";

export default class Calendar extends ConfigurationItemBase {
    /**
     * All the general settings for a calendar
     * @type {GeneralSettings}
     */
    generalSettings: GeneralSettings = new GeneralSettings();
    /**
     * The year class for the calendar
     * @type {Year}
     */
    year: Year;
    /**
     * A list of all the months for this calendar
     */
    months: Month[] = [];
    /**
     * The days that make up a week
     */
    weekdays: Weekday[] = [];
    /**
     * All the seasons for this calendar
     */
    seasons: Season[] = [];
    /**
     * All the moons for this calendar
     */
    moons: Moon[] = [];
    /**
     * The time object responsible for all time related functionality
     */
    time: Time;
    /**
     * List of all notes in the calendar
     * @type {Array.<Note>}
     */
    public notes: NoteStub[] = [];
    /**
     * List of all categories associated with notes
     * @type{Array.<NoteCategory>}
     */
    public noteCategories: SimpleCalendar.NoteCategory[] = [];
    /**
     * The timekeeper class used for the in game clock
     */
    timeKeeper: TimeKeeper;
    /**
     * If Simple Calendar has initiated a time change
     */
    timeChangeTriggered: boolean = false;
    /**
     * If a combat change has been triggered
     */
    combatChangeTriggered: boolean = false;

    /**
     * Construct a new Calendar class
     * @param {string} id
     * @param {string} name
     * @param {CalendarData} configuration The configuration object for the calendar
     */
    constructor(id: string, name: string, configuration: SimpleCalendar.CalendarData = { id: "" }) {
        super(name);
        this.id = id || generateUniqueId();
        this.time = new Time();
        this.year = new Year(0);
        this.timeKeeper = new TimeKeeper(this.id, this.time.updateFrequency);
        if (Object.keys(configuration).length > 1) {
            this.loadFromSettings(configuration);
        }
    }

    /**
     * Creates a cloned version of the Calendar class
     */
    clone(includeNotes: boolean = true): Calendar {
        const c = new Calendar(this.id, this.name);
        c.id = this.id;
        c.name = this.name;
        c.generalSettings = this.generalSettings.clone();
        c.year = this.year.clone();
        c.months = this.months.map((m) => {
            return m.clone();
        });
        c.weekdays = this.weekdays.map((w) => {
            return w.clone();
        });
        c.seasons = this.seasons.map((s) => {
            return s.clone();
        });
        c.moons = this.moons.map((m) => {
            return m.clone();
        });
        c.time = this.time.clone();
        if (includeNotes) {
            //c.notes = this.notes.map(n => n.clone());
            c.noteCategories = this.noteCategories.map((nc) => {
                return { id: nc.id, name: nc.name, textColor: nc.textColor, color: nc.color };
            });
        }
        return c;
    }

    /**
     * Creates a template for the calendar class
     */
    toTemplate(): SimpleCalendar.HandlebarTemplateData.Calendar {
        let sYear = this.year.selectedYear,
            sMonth,
            sDay;

        const currentMonthDay = this.getMonthAndDayIndex();
        const selectedMonthDay = this.getMonthAndDayIndex("selected");
        const visibleMonthDay = this.getMonthAndDayIndex("visible");

        if (selectedMonthDay.month !== undefined) {
            sMonth = selectedMonthDay.month;
            sDay = selectedMonthDay.day || 0;
        } else {
            sYear = this.year.numericRepresentation;
            sMonth = currentMonthDay.month || 0;
            sDay = currentMonthDay.day || 0;
        }

        const noteCounts = NManager.getNoteCountsForDay(this.id, sYear, sMonth, sDay);
        return {
            ...super.toTemplate(),
            calendarDisplayId: `sc_${this.id}_calendar`,
            clockDisplayId: `sc_${this.id}_clock`,
            currentYear: this.year.toTemplate(),
            id: this.id,
            name: this.name,
            selectedDay: {
                dateDisplay: FormatDateTime(
                    { year: sYear, month: sMonth, day: sDay, hour: 0, minute: 0, seconds: 0 },
                    this.generalSettings.dateFormat.date,
                    this
                ),
                noteCount: noteCounts.count,
                noteReminderCount: noteCounts.reminderCount,
                notes: NManager.getNotesForDay(this.id, sYear, sMonth, sDay)
            },
            visibleDate: { year: this.year.visibleYear, month: visibleMonthDay.month || 0 }
        };
    }

    /**
     * Converts the calendar class to the configuration item to be saved
     */
    toConfig(): SimpleCalendar.CalendarData {
        return <SimpleCalendar.CalendarData>{
            id: this.id,
            name: this.name,
            currentDate: this.getCurrentDate(),
            general: this.generalSettings.toConfig(),
            leapYear: this.year.leapYearRule.toConfig(),
            months: this.months.map((m) => {
                return m.toConfig();
            }),
            moons: this.moons.map((m) => {
                return m.toConfig();
            }),
            noteCategories: this.noteCategories,
            seasons: this.seasons.map((s) => {
                return s.toConfig();
            }),
            time: this.time.toConfig(),
            weekdays: this.weekdays.map((w) => {
                return w.toConfig();
            }),
            year: this.year.toConfig()
        };
    }

    /**
     * Configures the calendar from a configuration file
     * @param config
     */
    loadFromSettings(config: SimpleCalendar.CalendarData) {
        if (config.id) {
            this.id = config.id;
            this.timeKeeper.calendarId = this.id;
        }
        if (config.name) {
            this.name = config.name;
        }

        if (config.year) {
            this.year.loadFromSettings(config.year);
        } else if (config.yearSettings) {
            this.year.loadFromSettings(config.yearSettings);
        } else {
            Logger.warn(`Invalid year configuration found when loading calendar "${this.name}", setting year to default configuration`);
            this.year = new Year(0);
        }

        const configMonths: SimpleCalendar.MonthData[] | undefined = config.months || config.monthSettings;
        if (Array.isArray(configMonths)) {
            this.months = [];
            for (let i = 0; i < configMonths.length; i++) {
                const newMonth = new Month();
                newMonth.loadFromSettings(configMonths[i]);
                this.months.push(newMonth);
            }
            if (this.months.length === 0) {
                this.months.push(new Month("New Month", 1, 0, 30));
            }
        }
        const configWeekdays: SimpleCalendar.WeekdayData[] | undefined = config.weekdays || config.weekdaySettings;
        if (Array.isArray(configWeekdays)) {
            this.weekdays = [];
            for (let i = 0; i < configWeekdays.length; i++) {
                const newW = new Weekday();
                newW.loadFromSettings(configWeekdays[i]);
                this.weekdays.push(newW);
            }
        }

        if (config.leapYear) {
            this.year.leapYearRule.loadFromSettings(config.leapYear);
        } else if (config.leapYearSettings) {
            this.year.leapYearRule.loadFromSettings(config.leapYearSettings);
        }

        if (config.time) {
            this.time.loadFromSettings(config.time);
            this.timeKeeper.updateFrequency = this.time.updateFrequency;
        } else if (config.timeSettings) {
            this.time.loadFromSettings(config.timeSettings);
            this.timeKeeper.updateFrequency = this.time.updateFrequency;
        }

        const configSeasons: SimpleCalendar.SeasonData[] | undefined = config.seasons || config.seasonSettings;
        if (Array.isArray(configSeasons)) {
            this.seasons = [];
            for (let i = 0; i < configSeasons.length; i++) {
                const newW = new Season();
                newW.loadFromSettings(configSeasons[i]);
                this.seasons.push(newW);
            }
        }
        const configMoons: SimpleCalendar.MoonData[] | undefined = config.moons || config.moonSettings;
        if (Array.isArray(configMoons)) {
            this.moons = [];
            for (let i = 0; i < configMoons.length; i++) {
                const newW = new Moon();
                newW.loadFromSettings(configMoons[i]);
                this.moons.push(newW);
            }
        }

        if (config.general) {
            this.generalSettings.loadFromSettings(config.general);
        } else if (config.generalSettings) {
            this.generalSettings.loadFromSettings(config.generalSettings);
        }

        if (config.noteCategories) {
            this.noteCategories = config.noteCategories;
        }

        if (config.currentDate) {
            this.year.numericRepresentation = config.currentDate.year;
            this.year.selectedYear = config.currentDate.year;
            this.year.visibleYear = config.currentDate.year;

            this.resetMonths("current");
            this.resetMonths("visible");

            if (config.currentDate.month > -1 && config.currentDate.month < this.months.length) {
                this.months[config.currentDate.month].current = true;
                this.months[config.currentDate.month].visible = true;
                if (config.currentDate.day > -1 && config.currentDate.day < this.months[config.currentDate.month].days.length) {
                    this.months[config.currentDate.month].days[config.currentDate.day].current = true;
                } else {
                    Logger.warn(
                        "Saved current day could not be found in this month, perhaps number of days has changed. Setting current day to first day of month"
                    );
                    this.months[config.currentDate.month].days[0].current = true;
                }
            } else if (this.months.length) {
                Logger.warn("Saved current month could not be found, perhaps months have changed. Setting current month to the first month");
                this.months[0].current = true;
                this.months[0].visible = true;
                this.months[0].days[0].current = true;
            }
            this.time.seconds = config.currentDate.seconds;
            if (this.time.seconds === undefined) {
                this.time.seconds = 0;
            }
        } else if (this.months.length) {
            Logger.warn("No current date setting found, setting default current date.");
            this.months[0].current = true;
            this.months[0].visible = true;
            this.months[0].days[0].current = true;
        } else {
            Logger.error("Error setting the current date.");
        }
    }

    /**
     * Gets the current date configuration object
     * @private
     */
    getCurrentDate(): SimpleCalendar.CurrentDateData {
        const monthDayIndex = this.getMonthAndDayIndex();
        return {
            year: this.year.numericRepresentation,
            month: monthDayIndex.month || 0,
            day: monthDayIndex.day || 0,
            seconds: this.time.seconds
        };
    }

    /**
     * Gets the date and time for the selected date, or if not date is selected the current date
     */
    getDateTime(): SimpleCalendar.DateTime {
        const dt: SimpleCalendar.DateTime = {
            year: 0,
            month: 0,
            day: 0,
            hour: 0,
            minute: 0,
            seconds: 0
        };
        const selectedMonthDayIndex = this.getMonthAndDayIndex("selected");
        const currentMonthDayIndex = this.getMonthAndDayIndex();
        if (selectedMonthDayIndex.month !== undefined) {
            dt.year = this.year.selectedYear;
            dt.month = selectedMonthDayIndex.month;
            dt.day = selectedMonthDayIndex.day || 0;
        } else {
            dt.year = this.year.numericRepresentation;
            dt.month = currentMonthDayIndex.month || 0;
            dt.day = currentMonthDayIndex.day || 0;

            const time = this.time.getCurrentTime();
            dt.hour = time.hour;
            dt.minute = time.minute;
            dt.seconds = time.seconds;
        }
        return dt;
    }

    /**
     * Gets the current season based on the current date
     */
    getCurrentSeason() {
        let monthIndex = this.getMonthIndex("visible");
        if (monthIndex === -1) {
            monthIndex = 0;
        }

        let dayIndex = this.months[monthIndex].getDayIndex("selected");
        if (dayIndex === -1) {
            dayIndex = this.months[monthIndex].getDayIndex();
            if (dayIndex === -1) {
                dayIndex = 0;
            }
        }
        const season = this.getSeason(monthIndex, dayIndex);
        return {
            name: season.name,
            color: season.color,
            icon: season.icon
        };
    }

    /**
     * Returns the month, where the passed in setting is true
     * @param [setting='current'] The setting to look for. Can be visible, current or selected
     */
    getMonth(setting: string = "current") {
        const verifiedSetting = setting.toLowerCase() as "visible" | "current" | "selected";
        return this.months.find((m) => {
            return m[verifiedSetting];
        });
    }

    /**
     * Returns the index of the month, where the passed in setting is true
     * @param [setting='current'] The setting to look for. Can be visible, current or selected
     */
    getMonthIndex(setting: string = "current") {
        const verifiedSetting = setting.toLowerCase() as "visible" | "current" | "selected";
        return this.months.findIndex((m) => {
            return m[verifiedSetting];
        });
    }

    /**
     * Returns the index of the month and index of the day in that month, where the passed in setting is true
     * @param [setting='current'] The setting to look for. Can be visible, current or selected
     */
    getMonthAndDayIndex(setting: string = "current") {
        const verifiedSetting = setting.toLowerCase() as "visible" | "current" | "selected";
        const result: Partial<SimpleCalendar.Date> = {
            month: 0,
            day: 0
        };
        const mIndex = this.months.findIndex((m) => {
            return m[verifiedSetting];
        });
        if (mIndex > -1) {
            result.month = mIndex;
            const dIndex = this.months[mIndex].getDayIndex(verifiedSetting);
            if (dIndex > -1) {
                result.day = dIndex;
            }
        } else {
            result.month = undefined;
        }
        return result;
    }

    /**
     * Gets the season for the passed in month and day
     * @param monthIndex The index of the month
     * @param dayIndex The day number
     */
    getSeason(monthIndex: number, dayIndex: number) {
        let season = new Season("", 0, 0);
        if (dayIndex >= 0 && monthIndex >= 0) {
            let currentSeason: Season | null = null;
            const sortedSeasons = this.seasons.sort((a, b) => {
                return a.startingMonth - b.startingMonth || a.startingDay - b.startingDay;
            });

            for (let i = 0; i < sortedSeasons.length; i++) {
                if (sortedSeasons[i].startingMonth === monthIndex && sortedSeasons[i].startingDay <= dayIndex) {
                    currentSeason = sortedSeasons[i];
                } else if (sortedSeasons[i].startingMonth < monthIndex) {
                    currentSeason = sortedSeasons[i];
                }
            }
            if (currentSeason === null) {
                currentSeason = sortedSeasons[sortedSeasons.length - 1];
            }

            if (currentSeason) {
                season = currentSeason.clone();
            }
        }
        return season;
    }

    /**
     * Calculates the sunrise or sunset time for the passed in date, based on the season setup
     * @param year The year of the date
     * @param monthIndex The month object of the date
     * @param dayIndex The day object of the date
     * @param [sunrise=true] If to calculate the sunrise or sunset
     * @param [calculateTimestamp=true] If to add the date timestamp to the sunrise/sunset time
     */
    getSunriseSunsetTime(year: number, monthIndex: number, dayIndex: number, sunrise: boolean = true, calculateTimestamp: boolean = true) {
        const activeCalendar = CalManager.getActiveCalendar();
        const sortedSeasons = this.seasons.sort((a, b) => {
            return a.startingMonth - b.startingMonth || a.startingDay - b.startingDay;
        });
        let seasonIndex = sortedSeasons.length - 1;
        for (let i = 0; i < sortedSeasons.length; i++) {
            if (sortedSeasons[i].startingMonth === monthIndex && sortedSeasons[i].startingDay <= dayIndex) {
                seasonIndex = i;
            } else if (sortedSeasons[i].startingMonth < monthIndex) {
                seasonIndex = i;
            }
        }
        const nextSeasonIndex = (seasonIndex + 1) % this.seasons.length;
        if (seasonIndex < sortedSeasons.length && nextSeasonIndex < sortedSeasons.length) {
            const season = sortedSeasons[seasonIndex];
            const nextSeason = sortedSeasons[nextSeasonIndex];
            let seasonYear = year;
            let nextSeasonYear = seasonYear;

            //If the current season is the last season of the year we need to check to see if the year for this season is the year before the current date
            if (seasonIndex === sortedSeasons.length - 1) {
                if (
                    monthIndex < sortedSeasons[seasonIndex].startingMonth ||
                    (sortedSeasons[seasonIndex].startingMonth === monthIndex && dayIndex < sortedSeasons[seasonIndex].startingDay)
                ) {
                    seasonYear = year - 1;
                }
                nextSeasonYear = seasonYear + 1;
            }
            const daysBetweenSeasonStartAndDay = DaysBetweenDates(
                activeCalendar,
                { year: seasonYear, month: season.startingMonth, day: season.startingDay, hour: 0, minute: 0, seconds: 0 },
                { year: year, month: monthIndex, day: dayIndex, hour: 0, minute: 0, seconds: 0 }
            );
            const daysBetweenSeasons = DaysBetweenDates(
                activeCalendar,
                { year: seasonYear, month: season.startingMonth, day: season.startingDay, hour: 0, minute: 0, seconds: 0 },
                { year: nextSeasonYear, month: nextSeason.startingMonth, day: nextSeason.startingDay, hour: 0, minute: 0, seconds: 0 }
            );
            const diff = sunrise ? nextSeason.sunriseTime - season.sunriseTime : nextSeason.sunsetTime - season.sunsetTime;
            const averageChangePerDay = diff / daysBetweenSeasons;
            const sunriseChangeForDay = daysBetweenSeasonStartAndDay * averageChangePerDay;
            const finalSunriseTime = Math.round((sunrise ? season.sunriseTime : season.sunsetTime) + sunriseChangeForDay);
            if (calculateTimestamp) {
                return (
                    DateToTimestamp({ year: year, month: monthIndex, day: dayIndex, hour: 0, minute: 0, seconds: 0 }, activeCalendar) +
                    finalSunriseTime
                );
            } else {
                return finalSunriseTime;
            }
        }
        return 0;
    }

    //-------------------------------
    // Date/Time Management
    //-------------------------------

    /**
     * Will take the days of the passed in month and break it into an array of weeks
     * @param monthIndex The month to get the days from
     * @param year The year the month is in (for leap year calculation)
     * @param weekLength How many days there are in a week
     */
    daysIntoWeeks(monthIndex: number, year: number, weekLength: number): (boolean | SimpleCalendar.HandlebarTemplateData.Day)[][] {
        const weeks = [];
        const dayOfWeekOffset = this.monthStartingDayOfWeek(monthIndex, year);
        const isLeapYear = this.year.leapYearRule.isLeapYear(year);
        const days = this.months[monthIndex].getDaysForTemplate(isLeapYear);

        if (days.length && weekLength > 0) {
            const startingWeek = [];
            let dayOffset = 0;
            for (let i = 0; i < weekLength; i++) {
                if (i < dayOfWeekOffset) {
                    startingWeek.push(false);
                } else {
                    const dayIndex = i - dayOfWeekOffset;
                    if (dayIndex < days.length) {
                        startingWeek.push(days[dayIndex]);
                        dayOffset++;
                    } else {
                        startingWeek.push(false);
                    }
                }
            }
            weeks.push(startingWeek);
            const numWeeks = Math.ceil((days.length - dayOffset) / weekLength);
            for (let i = 0; i < numWeeks; i++) {
                const w = [];
                for (let d = 0; d < weekLength; d++) {
                    const dayIndex = dayOffset + i * weekLength + d;
                    if (dayIndex < days.length) {
                        w.push(days[dayIndex]);
                    } else {
                        w.push(false);
                    }
                }
                weeks.push(w);
            }
        }
        return weeks;
    }

    /**
     * Calculates the day of the week a passed in day falls on based on its month and year
     * @param {number} year The year of the date to find its day of the week
     * @param {number} monthIndex The month that the target day is in
     * @param {number} dayIndex  The day of the month that we want to check
     * @return {number}
     */
    dayOfTheWeek(year: number, monthIndex: number, dayIndex: number): number {
        if (this.weekdays.length) {
            const activeCalendar = CalManager.getActiveCalendar();
            if (PF2E.isPF2E && activeCalendar.generalSettings.pf2eSync) {
                const pf2eAdjust = PF2E.weekdayAdjust();
                if (pf2eAdjust !== undefined) {
                    this.year.firstWeekday = pf2eAdjust;
                }
            }

            const month = this.months[monthIndex];
            let daysSoFar;
            if (month && month.startingWeekday !== null) {
                daysSoFar = dayIndex + month.startingWeekday - 1;
            } else {
                daysSoFar = this.dateToDays(year, monthIndex, dayIndex) + this.year.firstWeekday;
            }
            return ((daysSoFar % this.weekdays.length) + this.weekdays.length) % this.weekdays.length;
        } else {
            return 0;
        }
    }

    /**
     * Calculates the day of the week the first day of the currently visible month lands on
     * @param {Month} monthIndex The month to get the starting day of the week for
     * @param {number} year The year the check
     * @return {number}
     */
    monthStartingDayOfWeek(monthIndex: number, year: number): number {
        if (
            monthIndex > -1 &&
            monthIndex < this.months.length &&
            !(this.months[monthIndex].intercalary && !this.months[monthIndex].intercalaryInclude)
        ) {
            return this.dayOfTheWeek(year, monthIndex, 0);
        }
        return 0;
    }

    /**
     * Resents the setting for all months and days to false
     * @param {string} [setting='current']
     */
    resetMonths(setting: string = "current") {
        const verifiedSetting = setting.toLowerCase() as "visible" | "current" | "selected";
        this.months.forEach((m) => {
            if (setting !== "visible") {
                m.resetDays(setting);
            }
            m[verifiedSetting] = false;
        });
    }

    /**
     * Set the current date to also be the visible date
     */
    setCurrentToVisible() {
        this.year.visibleYear = this.year.numericRepresentation;
        this.resetMonths("visible");
        const curMonth = this.getMonth();
        if (curMonth) {
            curMonth.visible = true;
        }
    }

    /**
     * Updates the specified setting for the specified month, also handles instances if the new month has 0 days
     * @param month The index of the new month, -1 will be the last month
     * @param setting The setting to update, can be 'visible', 'current' or 'selected'
     * @param next If the change moved the calendar forward(true) or back(false) this is used to determine the direction to go if the new month has 0 days
     * @param setDay If to set the months day to a specific one
     */
    updateMonth(month: number, setting: string, next: boolean, setDay: null | number = null) {
        const verifiedSetting = setting.toLowerCase() as "visible" | "current" | "selected";
        const yearToUse =
            verifiedSetting === "current"
                ? this.year.numericRepresentation
                : verifiedSetting === "visible"
                ? this.year.visibleYear
                : this.year.selectedYear;
        const isLeapYear = this.year.leapYearRule.isLeapYear(yearToUse);
        if (month === -1 || month >= this.months.length) {
            month = this.months.length - 1;
        }
        //Get the current months current day
        let currentDay: number;

        if (setDay !== null) {
            currentDay = setDay;
        } else {
            const currentMonthDayIndex = this.getMonthAndDayIndex();
            currentDay = currentMonthDayIndex.day || 0;
        }

        //Reset all the months settings
        this.resetMonths(setting);
        //If the month we are going to show has no days, skip it
        if ((isLeapYear && this.months[month].numberOfLeapYearDays === 0) || (!isLeapYear && this.months[month].numberOfDays === 0)) {
            this.months[month][verifiedSetting] = true;
            return this.changeMonth(next ? 1 : -1, setting, setDay);
        } else {
            this.months[month][verifiedSetting] = true;
        }

        // If we are adjusting the current date we need to propagate that down to the days of the new month as well
        // We also need to set the visibility of the new month to true
        if (verifiedSetting === "current") {
            this.months[month].updateDay(currentDay, isLeapYear);
        }
    }

    /**
     * Changes the number of the currently active year
     * @param amount The amount to change the year by
     * @param updateMonth If to also update month
     * @param setting The month property we are changing. Can be 'visible', 'current' or 'selected'
     * @param setDay If to set the months day to a specific one
     */
    changeYear(amount: number, updateMonth: boolean = true, setting: string = "visible", setDay: null | number = null) {
        const verifiedSetting = setting.toLowerCase() as "visible" | "current" | "selected";
        if (verifiedSetting === "visible") {
            this.year.visibleYear = this.year.visibleYear + amount;
        } else if (verifiedSetting === "selected") {
            this.year.selectedYear = this.year.selectedYear + amount;
        } else {
            this.year.numericRepresentation = this.year.numericRepresentation + amount;
        }
        if (this.months.length) {
            if (updateMonth) {
                let mIndex = 0;
                if (amount === -1) {
                    mIndex = this.months.length - 1;
                }
                this.updateMonth(mIndex, setting, amount > 0, setDay);
            }
        }
    }

    /**
     * Changes the current, visible or selected month forward or back one month
     * @param amount If we are moving forward (true) or back (false) one month
     * @param setting The month property we are changing. Can be 'visible', 'current' or 'selected'
     * @param setDay If to set the months day to a specific one
     */
    changeMonth(amount: number, setting: string = "visible", setDay: null | number = null): void {
        const verifiedSetting = setting.toLowerCase() as "visible" | "current" | "selected";
        const next = amount > 0;
        for (let i = 0; i < this.months.length; i++) {
            const month = this.months[i];
            if (month[verifiedSetting]) {
                if (next && i + amount >= this.months.length) {
                    this.changeYear(1, true, verifiedSetting, setDay);
                    const changeAmount = amount - (this.months.length - i);
                    if (changeAmount > 0) {
                        this.changeMonth(changeAmount, verifiedSetting, setDay);
                    }
                } else if (!next && i + amount < 0) {
                    this.changeYear(-1, true, verifiedSetting, setDay);
                    const changeAmount = amount + i + 1;
                    if (changeAmount < 0) {
                        this.changeMonth(changeAmount, verifiedSetting, setDay);
                    }
                } else {
                    this.updateMonth(i + amount, setting, next, setDay);
                }
                break;
            }
        }
    }

    /**
     * Changes the current or selected day forward or back one day
     * @param {number} amount The number of days to change, positive forward, negative backwards
     * @param {string} [setting='current'] The day property we are changing. Can be 'current' or 'selected'
     */
    changeDay(amount: number, setting: string = "current") {
        const verifiedSetting = setting.toLowerCase() as "current" | "selected";
        const yearToUse = verifiedSetting === "current" ? this.year.numericRepresentation : this.year.selectedYear;
        const isLeapYear = this.year.leapYearRule.isLeapYear(yearToUse);
        const currentMonth = this.getMonth(verifiedSetting);
        if (currentMonth) {
            const next = amount > 0;
            const currentDayIndex = currentMonth.getDayIndex(verifiedSetting);
            const lastDayOfCurrentMonth = isLeapYear ? currentMonth.numberOfLeapYearDays : currentMonth.numberOfDays;
            if (next && currentDayIndex + amount >= lastDayOfCurrentMonth) {
                this.changeMonth(1, verifiedSetting, 0);
                this.changeDay(amount - (lastDayOfCurrentMonth - currentDayIndex), verifiedSetting);
            } else if (!next && currentDayIndex + amount < 0) {
                this.changeMonth(-1, verifiedSetting, -1);
                this.changeDay(amount + currentDayIndex + 1, verifiedSetting);
            } else {
                currentMonth.changeDay(amount, isLeapYear, verifiedSetting);
            }
        }
    }

    /**
     * Changes the current or selected day by the passed in amount. Adjusting for number of years first
     * @param amount
     * @param setting
     */
    changeDayBulk(amount: number, setting: string = "current") {
        let isLeapYear = this.year.leapYearRule.isLeapYear(this.year.numericRepresentation);
        let numberOfDays = this.totalNumberOfDays(isLeapYear, true);
        while (amount > numberOfDays) {
            this.changeYear(1, false, setting);
            amount -= numberOfDays;
            isLeapYear = this.year.leapYearRule.isLeapYear(this.year.numericRepresentation);
            numberOfDays = this.totalNumberOfDays(isLeapYear, true);
        }
        this.changeDay(amount, setting);
    }

    /**
     * Generates the total number of days in a year
     * @param leapYear If to count the total number of days in a leap year
     * @param ignoreIntercalaryRules If to ignore the intercalary rules and include the months days (used to match closer to about-time)
     * @return {number}
     */
    totalNumberOfDays(leapYear: boolean = false, ignoreIntercalaryRules: boolean = false): number {
        let total = 0;
        this.months.forEach((m) => {
            if ((m.intercalary && m.intercalaryInclude) || !m.intercalary || ignoreIntercalaryRules) {
                total += leapYear ? m.numberOfLeapYearDays : m.numberOfDays;
            }
        });
        return total;
    }

    /**
     * Converts the passed in date to the number of days that make up that date
     * @param year The year to convert
     * @param monthIndex The index of the month to convert
     * @param dayIndex The day to convert
     * @param ignoreIntercalaryRules If to ignore the intercalary rules and include the months days (used to match closer to about-time)
     */
    dateToDays(year: number, monthIndex: number, dayIndex: number, ignoreIntercalaryRules: boolean = false) {
        const beforeYearZero = year < this.year.yearZero;
        const daysPerYear = this.totalNumberOfDays(false, ignoreIntercalaryRules);
        const daysPerLeapYear = this.totalNumberOfDays(true, ignoreIntercalaryRules);
        const leapYearDayDifference = daysPerLeapYear - daysPerYear;
        const isLeapYear = this.year.leapYearRule.isLeapYear(year);
        const numberOfLeapYears = this.year.leapYearRule.howManyLeapYears(year);
        const numberOfYZLeapYears = this.year.leapYearRule.howManyLeapYears(this.year.yearZero);
        let leapYearDays;
        let procYear = Math.abs(year - this.year.yearZero);

        if (monthIndex < 0) {
            monthIndex = 0;
        } else if (monthIndex >= this.months.length) {
            monthIndex = this.months.length - 1;
        }

        if (beforeYearZero) {
            procYear = procYear - 1;
        }

        let daysIntoMonth = dayIndex + 1;
        let daysSoFar = daysPerYear * procYear;
        if (daysIntoMonth < 1) {
            daysIntoMonth = 1;
        }
        if (beforeYearZero) {
            if (isLeapYear) {
                leapYearDays = (numberOfYZLeapYears - (numberOfLeapYears + 1)) * leapYearDayDifference;
            } else {
                leapYearDays = (numberOfYZLeapYears - numberOfLeapYears) * leapYearDayDifference;
            }
            daysSoFar += leapYearDays;
            for (let i = this.months.length - 1; i >= 0; i--) {
                if (
                    i > monthIndex &&
                    (ignoreIntercalaryRules || !this.months[i].intercalary || (this.months[i].intercalary && this.months[i].intercalaryInclude))
                ) {
                    if (isLeapYear) {
                        daysSoFar = daysSoFar + this.months[i].numberOfLeapYearDays;
                    } else {
                        daysSoFar = daysSoFar + this.months[i].numberOfDays;
                    }
                }
            }
            daysSoFar += (isLeapYear ? this.months[monthIndex].numberOfLeapYearDays : this.months[monthIndex].numberOfDays) - daysIntoMonth;
        } else {
            leapYearDays = Math.abs(numberOfLeapYears - numberOfYZLeapYears) * leapYearDayDifference;
            daysSoFar += leapYearDays;

            for (let i = 0; i < this.months.length; i++) {
                //Only look at the month preceding the month we want and is not intercalary or is intercalary if the include setting is set otherwise skip
                if (
                    i < monthIndex &&
                    (ignoreIntercalaryRules || !this.months[i].intercalary || (this.months[i].intercalary && this.months[i].intercalaryInclude))
                ) {
                    if (isLeapYear) {
                        daysSoFar = daysSoFar + this.months[i].numberOfLeapYearDays;
                    } else {
                        daysSoFar = daysSoFar + this.months[i].numberOfDays;
                    }
                }
            }
            daysSoFar += daysIntoMonth;
        }
        if (beforeYearZero) {
            daysSoFar = daysSoFar + 1;
            if (year <= 0 && this.year.leapYearRule.rule !== LeapYearRules.None) {
                if (this.year.yearZero === 0 && !isLeapYear) {
                    daysSoFar -= leapYearDayDifference;
                } else if (this.year.yearZero !== 0 && isLeapYear) {
                    daysSoFar += leapYearDayDifference;
                }
            }
        } else {
            daysSoFar = daysSoFar - 1;
        }
        if (year > 0 && this.year.yearZero === 0 && this.year.leapYearRule.rule !== LeapYearRules.None) {
            daysSoFar += leapYearDayDifference;
        }
        return beforeYearZero ? daysSoFar * -1 : daysSoFar;
    }

    /**
     * Convert a number of seconds to year, month, day, hour, minute, seconds
     * @param {number} seconds The seconds to convert
     */
    secondsToDate(seconds: number): SimpleCalendar.DateTime {
        const beforeYearZero = seconds < 0;
        seconds = Math.abs(seconds);
        let day: number, dayCount, month: number, year: number;

        dayCount = Math.floor(seconds / this.time.secondsPerDay);
        seconds -= dayCount * this.time.secondsPerDay;

        let timeOfDaySeconds = beforeYearZero ? this.time.secondsPerDay - seconds : seconds;
        const hour = Math.floor(timeOfDaySeconds / (this.time.secondsInMinute * this.time.minutesInHour)) % this.time.hoursInDay;
        timeOfDaySeconds -= hour * (this.time.secondsInMinute * this.time.minutesInHour);
        const min = Math.floor(timeOfDaySeconds / this.time.secondsInMinute) % this.time.secondsInMinute;
        timeOfDaySeconds -= min * this.time.secondsInMinute;
        const sec = timeOfDaySeconds % 60;

        if (beforeYearZero) {
            year = this.year.yearZero - 1;
            let isLeapYear = this.year.leapYearRule.isLeapYear(year);
            month = this.months.length - 1;
            day = isLeapYear ? this.months[month].numberOfLeapYearDays - 1 : this.months[month].numberOfDays - 1;

            if (sec === 0 && min === 0 && hour === 0) {
                dayCount--;
            }
            while (dayCount > 0) {
                const yearTotalDays = this.totalNumberOfDays(isLeapYear, true);
                let monthDays = isLeapYear ? this.months[month].numberOfLeapYearDays : this.months[month].numberOfDays;
                if (dayCount >= yearTotalDays) {
                    year = year - 1;
                    isLeapYear = this.year.leapYearRule.isLeapYear(year);
                    monthDays = isLeapYear ? this.months[month].numberOfLeapYearDays : this.months[month].numberOfDays;
                    dayCount = dayCount - yearTotalDays;
                } else if (dayCount >= monthDays) {
                    month = month - 1;
                    //Check the new month to see if it has days for this year, if not then skip to the previous months until a month with days this year is found.
                    let newMonthDays = isLeapYear ? this.months[month].numberOfLeapYearDays : this.months[month].numberOfDays;
                    let safetyCounter = 0;
                    while (newMonthDays === 0 && safetyCounter <= this.months.length) {
                        month--;
                        newMonthDays = isLeapYear ? this.months[month].numberOfLeapYearDays : this.months[month].numberOfDays;
                        safetyCounter++;
                    }
                    day = isLeapYear ? this.months[month].numberOfLeapYearDays - 1 : this.months[month].numberOfDays - 1;
                    dayCount = dayCount - monthDays;
                } else {
                    day = day - 1;
                    dayCount = dayCount - 1;
                }
            }
        } else {
            year = this.year.yearZero;
            let isLeapYear = this.year.leapYearRule.isLeapYear(year);
            month = 0;
            day = 0;
            while (dayCount > 0) {
                const yearTotalDays = this.totalNumberOfDays(isLeapYear, true);
                const monthDays = isLeapYear ? this.months[month].numberOfLeapYearDays : this.months[month].numberOfDays;
                if (dayCount >= yearTotalDays) {
                    year = year + 1;
                    isLeapYear = this.year.leapYearRule.isLeapYear(year);
                    dayCount = dayCount - yearTotalDays;
                } else if (dayCount >= monthDays) {
                    month = month + 1;
                    //Check the new month to see if it has days for this year, if not then skip to the next months until a month with days this year is found.
                    let newMonthDays = isLeapYear ? this.months[month].numberOfLeapYearDays : this.months[month].numberOfDays;
                    let safetyCounter = 0;
                    while (newMonthDays === 0 && safetyCounter <= this.months.length) {
                        month++;
                        newMonthDays = isLeapYear ? this.months[month].numberOfLeapYearDays : this.months[month].numberOfDays;
                        safetyCounter++;
                    }
                    dayCount = dayCount - monthDays;
                } else {
                    day = day + 1;
                    dayCount = dayCount - 1;
                }
            }
            if (year < 0) {
                day++;
            }
        }
        return {
            year: year,
            month: month,
            day: day,
            hour: hour,
            minute: min,
            seconds: sec
        };
    }

    /**
     * Convert the passed in seconds into an interval of larger time
     * @param seconds
     */
    secondsToInterval(seconds: number): SimpleCalendar.DateTimeParts {
        let sec = seconds,
            min = 0,
            hour = 0,
            month: number;
        if (sec >= this.time.secondsInMinute) {
            min = Math.floor(sec / this.time.secondsInMinute);
            sec = sec - min * this.time.secondsInMinute;
        }
        if (min >= this.time.minutesInHour) {
            hour = Math.floor(min / this.time.minutesInHour);
            min = min - hour * this.time.minutesInHour;
        }
        let dayCount = 0;
        if (hour >= this.time.hoursInDay) {
            dayCount = Math.floor(hour / this.time.hoursInDay);
            hour = hour - dayCount * this.time.hoursInDay;
        }

        const daysInYear = this.totalNumberOfDays(false, false);
        const averageDaysInMonth =
            daysInYear /
            this.months.map((m) => {
                return !m.intercalary;
            }).length;

        month = Math.floor(dayCount / averageDaysInMonth);
        const day = dayCount - Math.round(month * averageDaysInMonth);

        const year = Math.floor(month / this.months.length);
        month = month - Math.round(year * this.months.length);

        return {
            seconds: sec,
            minute: min,
            hour: hour,
            day: day,
            month: month,
            year: year
        };
    }

    /**
     * Converts current date into seconds
     */
    public toSeconds() {
        const monthDay = this.getMonthAndDayIndex();
        return ToSeconds(this, this.year.numericRepresentation, monthDay.month || 0, monthDay.day || 0, true);
    }

    public changeDateTime(interval: SimpleCalendar.DateTimeParts, options: SimpleCalendar.DateChangeOptions = {}) {
        options = deepMerge({}, { updateMonth: true, updateApp: true, save: true, sync: true, showWarning: false }, options);
        if (canUser((<Game>game).user, SC.globalConfiguration.permissions.changeDateTime)) {
            const initialTimestamp = this.toSeconds();
            let change = false;
            if (interval.year) {
                this.changeYear(interval.year, options.updateMonth, "current");
                change = true;
            }
            if (interval.month) {
                this.changeMonth(interval.month, "current");
                change = true;
            }
            if (interval.day) {
                this.changeDay(interval.day);
                change = true;
            }
            if (interval.hour || interval.minute || interval.seconds) {
                const dayChange = this.time.changeTime(interval.hour, interval.minute, interval.seconds);
                if (dayChange !== 0) {
                    this.changeDay(dayChange);
                }
                change = true;
            }

            if (change) {
                if (CalManager.isActiveCalendar(this.id)) {
                    const changeInSeconds = this.toSeconds() - initialTimestamp;
                    Hook.emit(SimpleCalendarHooks.DateTimeChange, this, changeInSeconds);

                    if (!options.fromCalSync && CalManager.syncWithAllCalendars && !isNaN(initialTimestamp)) {
                        CalManager.syncWithCalendars({ seconds: changeInSeconds });
                    }
                }

                if (options.save) {
                    CalManager.saveCalendars().catch(Logger.error);
                }
                if (options.sync) {
                    this.syncTime().catch(Logger.error);
                }
                if (options.updateApp) {
                    MainApplication.updateApp();
                }
            }
            return true;
        } else if (options.showWarning) {
            GameSettings.UiNotification(GameSettings.Localize("FSC.Warn.Macros.GMUpdate"), "warn");
        }
        return false;
    }

    public setDateTime(date: SimpleCalendar.DateTimeParts, options: SimpleCalendar.DateChangeOptions = {}) {
        options = deepMerge(
            {},
            { updateMonth: true, updateApp: true, save: true, sync: true, showWarning: false, bypassPermissionCheck: false },
            options
        );
        if (canUser((<Game>game).user, SC.globalConfiguration.permissions.changeDateTime) || options.bypassPermissionCheck) {
            const initialTimestamp = this.toSeconds();

            const processedDate: SimpleCalendar.DateTime = {
                year: date.year || 0,
                month: date.month || 0,
                day: date.day || 0,
                hour: date.hour || 0,
                minute: date.minute || 0,
                seconds: date.seconds || 0
            };
            const monthDayIndex = this.getMonthAndDayIndex();
            const currentTime = this.time.getCurrentTime();
            if (date.seconds === undefined) {
                processedDate.seconds = currentTime.seconds;
            }
            if (date.minute === undefined) {
                processedDate.minute = currentTime.minute;
            }
            if (date.hour === undefined) {
                processedDate.hour = currentTime.hour;
            }
            if (date.year === undefined) {
                processedDate.year = this.year.numericRepresentation;
            }
            if (date.month === undefined) {
                processedDate.month = monthDayIndex.month || 0;
            }
            if (date.day === undefined) {
                processedDate.day = monthDayIndex.day || 0;
            }
            this.updateTime(processedDate);

            const changeInSeconds = this.toSeconds() - initialTimestamp;

            if (CalManager.isActiveCalendar(this.id)) {
                Hook.emit(SimpleCalendarHooks.DateTimeChange, this, changeInSeconds);
            }

            if (!options.fromCalSync && CalManager.syncWithAllCalendars && !isNaN(initialTimestamp)) {
                CalManager.syncWithCalendars({ seconds: changeInSeconds });
            }
            if (options.save) {
                CalManager.saveCalendars().catch(Logger.error);
            }
            if (options.sync) {
                this.syncTime().catch(Logger.error);
            }
            if (options.updateApp) {
                MainApplication.updateApp();
            }
            return true;
        } else if (options.showWarning) {
            GameSettings.UiNotification(GameSettings.Localize("FSC.Warn.Macros.GMUpdate"), "warn");
        }
        return false;
    }

    /**
     * Sets the current game world time to match what our current time is
     */
    async syncTime(force: boolean = false) {
        let totalSeconds = NaN;
        // Only if the time tracking rules are set to self or mixed
        if (
            canUser((<Game>game).user, SC.globalConfiguration.permissions.changeDateTime) &&
            (this.generalSettings.gameWorldTimeIntegration === GameWorldTimeIntegrations.Self ||
                this.generalSettings.gameWorldTimeIntegration === GameWorldTimeIntegrations.Mixed)
        ) {
            totalSeconds = this.toSeconds();
            // If the calculated seconds are different from what is set in the game world time, update the game world time to match sc's time
            if (totalSeconds !== (<Game>game).time.worldTime || force) {
                //Let the local functions know that we already updated this time
                this.timeChangeTriggered = true;
                //Set the world time, this will trigger the setFromTime function on all connected players when the updateWorldTime hook is triggered
                if (GameSettings.IsGm()) {
                    await this.time.setWorldTime(totalSeconds);
                }
            }
        }
    }

    /**
     * Sets the simple calendars year, month, day and time from a passed in number of seconds
     * @param {number} newTime The new time represented by seconds
     * @param {number} changeAmount The amount that the time has changed by
     */
    setFromTime(newTime: number, changeAmount: number) {
        // If this is a Pathfinder 2E game, add the world creation seconds
        if (PF2E.isPF2E && this.generalSettings.pf2eSync) {
            newTime += PF2E.getWorldCreateSeconds(this);
        }
        if (changeAmount !== 0) {
            // If the tracking rules are for self or mixed and the clock is running then we make the change.
            if (
                (this.generalSettings.gameWorldTimeIntegration === GameWorldTimeIntegrations.Self ||
                    this.generalSettings.gameWorldTimeIntegration === GameWorldTimeIntegrations.Mixed) &&
                this.timeKeeper.getStatus() === TimeKeeperStatus.Started
            ) {
                //If we didn't request the change (we are running the clock) we need to update the internal time to match the new world time
                if (!this.timeChangeTriggered) {
                    const parsedDate = this.secondsToDate(newTime);
                    this.setDateTime(parsedDate, {
                        updateApp: this.time.updateFrequency * this.time.gameTimeRatio !== changeAmount,
                        sync: false,
                        save: false,
                        bypassPermissionCheck: true
                    });
                    Renderer.Clock.UpdateListener(`sc_${this.id}_clock`, this.timeKeeper.getStatus());
                }
            }
            // If the tracking rules are for self only, and we requested the change OR the change came from a combat turn change
            else if (
                (this.generalSettings.gameWorldTimeIntegration === GameWorldTimeIntegrations.Self ||
                    this.generalSettings.gameWorldTimeIntegration === GameWorldTimeIntegrations.Mixed) &&
                (this.timeChangeTriggered || this.combatChangeTriggered)
            ) {
                //If we didn't request the change (from a combat change) we need to update the internal time to match the new world time
                if (!this.timeChangeTriggered) {
                    const parsedDate = this.secondsToDate(newTime);
                    // If the current player is the GM then we need to save this new value to the database
                    // Since the current date is updated this will trigger an update on all players as well
                    this.setDateTime(parsedDate, { updateApp: false, sync: false, save: GameSettings.IsGm() && SC.primary });
                }
            }
            // If we didn't (locally) request this change then parse the new time into years, months, days and seconds and set those values
            // This covers other modules/built-in features updating the world time and Simple Calendar updating to reflect those changes
            else if (
                (this.generalSettings.gameWorldTimeIntegration === GameWorldTimeIntegrations.ThirdParty ||
                    this.generalSettings.gameWorldTimeIntegration === GameWorldTimeIntegrations.Mixed) &&
                !this.timeChangeTriggered
            ) {
                const parsedDate = this.secondsToDate(newTime);
                // If the current player is the GM then we need to save this new value to the database
                // Since the current date is updated this will trigger an update on all players as well
                this.setDateTime(parsedDate, { updateApp: false, sync: false, save: GameSettings.IsGm() && SC.primary });
            }
        }
        this.timeChangeTriggered = false;
        this.combatChangeTriggered = false;
    }

    /**
     * If we have determined that the system does not change the world time when a combat round is changed we run this function to update the time by the set amount.
     * @param {Combat} combat The current active combat
     */
    processOwnCombatRoundTime(combat: Combat) {
        const roundSeconds = SC.globalConfiguration.secondsInCombatRound;
        let roundsPassed = 1;

        if (Object.prototype.hasOwnProperty.call(combat, "previous") && combat["previous"].round) {
            roundsPassed = combat.round - combat["previous"].round;
        } else if (PF1E.isPF1E) {
            roundsPassed = 0;
        }
        if (roundSeconds !== 0 && roundsPassed !== 0) {
            // If the current player is the GM then we need to save this new value to the database
            // Since the current date is updated this will trigger an update on all players as well
            this.changeDateTime({ seconds: roundSeconds * roundsPassed }, { updateApp: false, sync: true, save: GameSettings.IsGm() && SC.primary });
        }
    }

    /**
     * Updates the year's data with passed in date information
     * @param {DateTimeParts} parsedDate Interface that contains all of the individual parts of a date and time
     */
    updateTime(parsedDate: SimpleCalendar.DateTime) {
        const isLeapYear = this.year.leapYearRule.isLeapYear(parsedDate.year);
        this.year.numericRepresentation = parsedDate.year;
        this.updateMonth(parsedDate.month, "current", true);
        this.months[parsedDate.month].updateDay(parsedDate.day, isLeapYear);
        this.time.setTime(parsedDate.hour, parsedDate.minute, parsedDate.seconds);
    }
}
