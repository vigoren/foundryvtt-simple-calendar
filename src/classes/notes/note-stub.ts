import { CalManager, NManager, SC } from "../index";
import { DateRangeMatch, ModuleName, NoteReminderNotificationType, NoteRepeat } from "../../constants";
import { GetDisplayDate, IsDayBetweenDates } from "../utilities/date-time";
import { GetContrastColor } from "../utilities/visual";
import { NoteTrigger } from "./note-trigger";
import { GameSettings } from "../foundry-interfacing/game-settings";
import { Logger } from "../logging";

/**
 * Class that contains information about notes in the calendar and references to the journal entries that make up the notes
 */
export default class NoteStub {
    /**
     * The ID of the journal entry associated with this stub
     */
    public entryId: string;

    /**
     * A list of triggers that a note can cause to fire.
     */
    public triggers: NoteTrigger[] = [];

    /**
     * Processes the note reminder trigger that happens when a note is triggered and the current user wants to be reminded of the note
     * This will send a whisper to the player with the note details.
     *
     * @param note The note stub for the note
     * @param initialLoad If this is the initial load of foundry or not
     */
    public static reminderNoteTrigger(note: NoteStub, initialLoad: boolean): boolean {
        const noteData = note.noteData;
        if (noteData && note.userReminderRegistered) {
            const calendar = CalManager.getCalendar(noteData.calendarId);
            if (calendar && (!initialLoad || (initialLoad && calendar.generalSettings.postNoteRemindersOnFoundryLoad))) {
                if (SC.clientSettings.noteReminderNotification === NoteReminderNotificationType.whisper) {
                    ChatMessage.create({
                        speaker: { alias: "Simple Calendar Reminder" },
                        whisper: [GameSettings.UserID()],
                        content: `<h2>${note.title}</h2><div style="display: flex;margin-bottom: 0.5rem;"><div class="note-category"><span class="fa fa-calendar"></span> ${note.fullDisplayDate}</div></div>${note.link}`
                    }).catch(Logger.error);
                } else if (SC.clientSettings.noteReminderNotification === NoteReminderNotificationType.render) {
                    note.render();
                }
                return true;
            }
        }
        return false;
    }

    /**
     * Processes the note macro trigger that happens when a note is triggered and there is a macro assigned to the note.
     * @param note The note stub for the note
     * @param initialLoad If this is the initial load of foundry or not
     */
    public static macroNoteTrigger(note: NoteStub, initialLoad: boolean): boolean {
        const macroId = note.macro;
        if (!initialLoad && macroId && macroId !== "none") {
            const macro = (<Game>game).macros?.get(macroId);
            if (macro && macro.canExecute) {
                macro.execute();
                return true;
            }
        }
        return false;
    }

    /**
     * @param journalEntryId The ID of the journal entry associated with this stub
     */
    constructor(journalEntryId: string) {
        this.entryId = journalEntryId;
        this.triggers.push(new NoteTrigger(NoteStub.reminderNoteTrigger, true));
        this.triggers.push(new NoteTrigger(NoteStub.macroNoteTrigger, true));
    }

    /**
     * Returns the note data flag from the journal entry associated with this note stub
     */
    public get noteData() {
        const journalEntry = (<Game>game).journal?.get(this.entryId);
        if (journalEntry) {
            return <SimpleCalendar.NoteData>journalEntry.getFlag(ModuleName, "noteData");
        }
        return null;
    }

    /**
     * Returns the ownership object for the journal entry
     */
    public get ownership(): Record<string, number> {
        const journalEntry = (<Game>game).journal?.get(this.entryId);
        if (journalEntry) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            return journalEntry.ownership;
        }
        return {};
    }

    /**
     * If this note takes place all day
     */
    public get allDay(): boolean {
        const noteData = this.noteData;
        if (noteData) {
            return noteData.allDay;
        }
        return true;
    }

    /**
     * The link to this journal entry
     */
    public get link(): string {
        const journalEntry = (<Game>game).journal?.get(this.entryId);
        if (journalEntry) {
            return journalEntry.link;
        }
        return "";
    }

    /**
     * The title of this note
     */
    public get title(): string {
        const journalEntry = (<Game>game).journal?.get(this.entryId);
        return journalEntry?.name || "";
    }

    /**
     * The list of pages for this journal entry
     */
    public get pages() {
        const journalEntry = (<Game>game).journal?.get(this.entryId);
        if (journalEntry) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            return journalEntry.pages.contents;
        }
        return [];
    }

    /**
     * How often this note repeats
     */
    public get repeats(): NoteRepeat {
        const nd = this.noteData;
        if (nd) {
            return nd.repeats;
        }
        return NoteRepeat.Never;
    }

    /**
     * Gets the order of the note on the day
     */
    public get order(): number {
        const nd = this.noteData;
        if (nd) {
            return nd.order;
        }
        return 0;
    }

    /**
     * Sets the order of the note on the day
     * @param num
     */
    public async setOrder(num: number) {
        const journalEntry = (<Game>game).journal?.get(this.entryId);
        if (journalEntry) {
            const nd = <SimpleCalendar.NoteData>journalEntry.getFlag(ModuleName, "noteData");
            if (nd) {
                nd.order = num;
                await journalEntry.setFlag(ModuleName, "noteData", nd);
            }
        }
    }

    /**
     * Get the author display information for the note
     */
    public get authorDisplay() {
        const journalEntry = (<Game>game).journal?.get(this.entryId);
        if (journalEntry) {
            const noteData = <SimpleCalendar.NoteData>journalEntry.getFlag(ModuleName, "noteData");
            if (noteData && noteData.fromPredefined) {
                return {
                    name: "System",
                    color: "",
                    colorText: ""
                };
            } else {
                const own = this.ownership;
                for (const k in own) {
                    if (own[k] === 3) {
                        const author = (<Game>game).users?.get(k);
                        if (author) {
                            let color = author.color?.toString() || "";
                            return {
                                name: author.name || "",
                                color: color || "",
                                colorText: GetContrastColor(color || "")
                            };
                        }
                    }
                }
            }
        }
        return null;
    }

    /**
     * If the current user can edit this note or not.
     * GMs can always edit otherwise needs to be the author of the note.
     */
    public get canEdit() {
        let res = GameSettings.IsGm();
        if (!res) {
            const journalEntry = (<Game>game).journal?.get(this.entryId);
            if (journalEntry) {
                const own = this.ownership;
                for (const k in own) {
                    if (own[k] === 3 && k === GameSettings.UserID()) {
                        res = true;
                        break;
                    }
                }
            }
        }
        return res;
    }

    /**
     * Gets the categories associated with the note
     */
    public get categories(): SimpleCalendar.NoteCategory[] {
        const noteData = this.noteData;
        if (noteData) {
            const calendar = CalManager.getCalendar(noteData.calendarId);
            if (calendar) {
                return calendar.noteCategories.filter((nc) => {
                    return noteData.categories.indexOf(nc.name) > -1;
                });
            }
        }
        return [];
    }

    /**
     * Gets the display date for the note
     */
    public get displayDate(): string {
        return this.getDisplayDate(false);
    }

    /**
     * Gets the full display date for the note
     */
    public get fullDisplayDate(): string {
        return this.getDisplayDate(true);
    }

    /**
     * Gets icon, color and formatted player list of who can see the note.
     */
    public get playerVisible() {
        const journalEntry = (<Game>game).journal?.get(this.entryId);
        const result = {
            icon: "fa-eye-slash",
            color: "fsc-danger",
            players: ""
        };
        if (journalEntry) {
            const own = this.ownership;
            const playerCoverage = (<Game>game).users?.filter((u) => {
                return own[u.id] !== undefined && own[u.id] >= 2;
            });
            if (playerCoverage) {
                if (playerCoverage.length === (<Game>game).users?.contents.length) {
                    result.icon = "fa-eye";
                    result.color = "fsc-success";
                } else if (playerCoverage.length > 1) {
                    result.icon = "fa-eye-low-vision";
                    result.color = "fsc-secondary";
                }
                result.players = `${GameSettings.Localize(
                    "FSC.Notes.UserPermissionTitle"
                )}:<ul style="text-align: left;padding: 0;margin-bottom:0;list-style: none;"><li>${playerCoverage
                    .map((u) => {
                        return u.name || "";
                    })
                    .join("</li><li>")}</li></ul>`;
            }
        }
        return result;
    }

    /**
     * Gets if the current user has a reminder registered for this note or not
     */
    public get userReminderRegistered(): boolean {
        let registered = false;
        if (this.canUserView()) {
            const noteData = this.noteData;
            const user = (<Game>game).user;
            if (noteData && user) {
                registered = noteData.remindUsers.indexOf(user.id) > -1;
            }
        }
        return registered;
    }

    /**
     * Checks if this note was added as part of the predefined calendar
     */
    public get fromPredefined(): boolean {
        const nd = this.noteData;
        if (nd && nd.fromPredefined !== undefined) {
            return nd.fromPredefined;
        }
        return false;
    }

    /**
     * Gets the macro to trigger when this note is triggered
     */
    public get macro(): string {
        const nd = this.noteData;
        if (nd && nd.macro !== undefined) {
            return nd.macro;
        }
        return "none";
    }

    /**
     * Rendered this note's sheet
     */
    public render() {
        NManager.showNote(this.entryId);
    }
    /**
     * If the current user can view this note
     */
    public canUserView(): boolean {
        const journalEntry = (<Game>game).journal?.get(this.entryId);
        const user = (<Game>game).user;
        if (journalEntry && user) {
            // GM's always are considered to have ownership of a journal entry,
            // so we need to test if the permission is actually set to 0 before using the built-in test
            return !!(this.ownership[user.id] !== 0 && journalEntry.testUserPermission(user, 2));
        }
        return false;
    }

    /**
     * Calculates the display date of the note. Takes into consideration how often the note repeats.
     * @param full
     * @private
     */
    private getDisplayDate(full: boolean): string {
        const noteData = this.noteData;
        if (noteData) {
            const calendar = CalManager.getCalendar(noteData.calendarId);
            if (calendar) {
                const currentVisibleYear = calendar.year.selectedYear || calendar.year.visibleYear;
                let visibleMonthDay = calendar.getMonthAndDayIndex("selected");
                if (visibleMonthDay.month === undefined) {
                    visibleMonthDay = calendar.getMonthAndDayIndex();
                }

                let startYear = noteData.startDate.year;
                let startMonth = noteData.startDate.month;
                let startDay = noteData.startDate.day;
                let endYear = noteData.endDate.year;
                let endMonth = noteData.endDate.month;
                let endDay = noteData.endDate.day;

                if (noteData.repeats === NoteRepeat.Weekly) {
                    startYear = currentVisibleYear;
                    endYear = currentVisibleYear;
                    const noteStartDayOfWeek = calendar.dayOfTheWeek(noteData.startDate.year, startMonth, startDay);
                    const noteEndDayOfWeek = calendar.dayOfTheWeek(noteData.endDate.year, endMonth, endDay);
                    const currentDayOfWeek = calendar.dayOfTheWeek(currentVisibleYear, visibleMonthDay.month || 0, visibleMonthDay.day || 0);
                    let noteLength = noteEndDayOfWeek - noteStartDayOfWeek;
                    if (noteLength < 0) {
                        noteLength = calendar.weekdays.length + noteLength;
                    }
                    noteLength++;

                    startMonth = visibleMonthDay.month || 0;
                    endMonth = visibleMonthDay.month || 0;
                    let noteStartDiff = currentDayOfWeek - noteStartDayOfWeek;
                    let noteEndDiff = noteEndDayOfWeek - currentDayOfWeek;
                    if (noteStartDiff < 0) {
                        noteStartDiff = calendar.weekdays.length + noteStartDiff;
                    }
                    if (noteEndDiff < 0) {
                        noteEndDiff = calendar.weekdays.length + noteEndDiff;
                    }
                    if (noteStartDiff + noteEndDiff < noteLength) {
                        startDay = (visibleMonthDay.day || 0) - noteStartDiff;
                        endDay = (visibleMonthDay.day || 0) + noteEndDiff;
                        let safetyCount = 0;
                        while (startDay < 0 && safetyCount < calendar.months.length) {
                            startMonth--;
                            if (startMonth < 0) {
                                startYear--;
                                startMonth = calendar.months.length - 1;
                            }
                            const isLeapYear = calendar.year.leapYearRule.isLeapYear(startYear);
                            startDay = calendar.months[startMonth][isLeapYear ? "numberOfLeapYearDays" : "numberOfDays"] + startDay;
                            safetyCount++;
                        }

                        let endIsLeapYear = calendar.year.leapYearRule.isLeapYear(endYear);
                        safetyCount = 0;
                        while (
                            endDay >= calendar.months[endMonth][endIsLeapYear ? "numberOfLeapYearDays" : "numberOfDays"] &&
                            safetyCount < calendar.months.length
                        ) {
                            endDay = endDay - calendar.months[endMonth][endIsLeapYear ? "numberOfLeapYearDays" : "numberOfDays"];
                            endMonth++;
                            if (endMonth >= calendar.months.length) {
                                endYear++;
                                endMonth = 0;
                                endIsLeapYear = calendar.year.leapYearRule.isLeapYear(endYear);
                            }
                            safetyCount++;
                        }
                    }
                } else if (noteData.repeats === NoteRepeat.Monthly) {
                    startYear = currentVisibleYear;
                    endYear = currentVisibleYear;
                    startMonth = visibleMonthDay.month || 0;
                    endMonth = visibleMonthDay.month || 0;
                    if (noteData.startDate.month !== noteData.endDate.month) {
                        if (noteData.startDate.day <= (visibleMonthDay.day || 0)) {
                            endMonth = (visibleMonthDay.month || 0) + 1;
                            if (endMonth >= calendar.months.length) {
                                endMonth = 0;
                                endYear = currentVisibleYear + 1;
                            }
                        } else if (noteData.endDate.day >= (visibleMonthDay.day || 0)) {
                            startMonth = (visibleMonthDay.month || 0) - 1;
                            if (startMonth < 0) {
                                startMonth = calendar.months.length - 1;
                                startYear = currentVisibleYear - 1;
                            }
                        }
                    }
                    // Check if the selected start day is more days than the current month has, if so adjust the end day to the max number of day.
                    if (noteData.startDate.day >= calendar.months[startMonth].days.length) {
                        const isLeapYear = calendar.year.leapYearRule.isLeapYear(startYear);
                        startDay = (isLeapYear ? calendar.months[startMonth].numberOfLeapYearDays : calendar.months[startMonth].numberOfDays) - 1;
                    }

                    // Check if the selected end day is more days than the current month has, if so adjust the end day to the max number of day.
                    if (noteData.endDate.day >= calendar.months[endMonth].days.length) {
                        const isLeapYear = calendar.year.leapYearRule.isLeapYear(endYear);
                        endDay = (isLeapYear ? calendar.months[endMonth].numberOfLeapYearDays : calendar.months[endMonth].numberOfDays) - 1;
                    }
                } else if (noteData.repeats === NoteRepeat.Yearly) {
                    if (noteData.startDate.year !== noteData.endDate.year) {
                        const yDiff = noteData.endDate.year - noteData.startDate.year;
                        // The start month is in the current month and  the start day is less than the current day
                        if (noteData.startDate.month === (visibleMonthDay.month || 0) && noteData.startDate.day <= (visibleMonthDay.day || 0)) {
                            startYear = currentVisibleYear;
                            endYear = currentVisibleYear + yDiff;
                        } else if (noteData.endDate.month === (visibleMonthDay.month || 0) && noteData.endDate.day >= (visibleMonthDay.day || 0)) {
                            startYear = currentVisibleYear - yDiff;
                            endYear = currentVisibleYear;
                        }
                    } else {
                        startYear = currentVisibleYear;
                        endYear = currentVisibleYear;
                    }
                }
                return GetDisplayDate(
                    calendar,
                    {
                        year: startYear,
                        month: startMonth,
                        day: startDay,
                        hour: noteData.startDate.hour,
                        minute: noteData.startDate.minute,
                        seconds: 0
                    },
                    { year: endYear, month: endMonth, day: endDay, hour: noteData.endDate.hour, minute: noteData.endDate.minute, seconds: 0 },
                    noteData.allDay,
                    !full
                );
            }
        }
        return "";
    }

    /**
     * Checks if the note is visible on the passed in date. Takes into consideration how often the note repeats.
     * @param calendarId The ID of the calendar the note is for
     * @param year The year to check
     * @param monthIndex The month to check
     * @param dayIndex The day to check
     */
    public isVisible(calendarId: string, year: number, monthIndex: number, dayIndex: number) {
        const calendar = CalManager.getCalendar(calendarId);
        const noteData = this.noteData;
        let visible = false;
        if (noteData && calendar && this.canUserView()) {
            let inBetween = DateRangeMatch.None;
            if (noteData.repeats === NoteRepeat.Weekly) {
                const noteStartDayOfWeek = calendar.dayOfTheWeek(noteData.startDate.year, noteData.startDate.month, noteData.startDate.day);
                const targetDayOfWeek = calendar.dayOfTheWeek(year, monthIndex, dayIndex);
                const noteEndDayOfWeek = calendar.dayOfTheWeek(noteData.endDate.year, noteData.endDate.month, noteData.endDate.day);
                if (noteStartDayOfWeek === targetDayOfWeek) {
                    inBetween = DateRangeMatch.Start;
                } else if (noteEndDayOfWeek === targetDayOfWeek) {
                    inBetween = DateRangeMatch.End;
                } else {
                    // Start and end day of the week are within the same week
                    if (noteStartDayOfWeek < noteEndDayOfWeek && noteStartDayOfWeek < targetDayOfWeek && noteEndDayOfWeek > targetDayOfWeek) {
                        inBetween = DateRangeMatch.Middle;
                    }
                    //Start and end day of the week are different weeks but the start day is later in the week than the end day
                    else if (
                        noteStartDayOfWeek > noteEndDayOfWeek &&
                        ((noteStartDayOfWeek < targetDayOfWeek && noteEndDayOfWeek < targetDayOfWeek) ||
                            (noteStartDayOfWeek > targetDayOfWeek && noteEndDayOfWeek > targetDayOfWeek))
                    ) {
                        inBetween = DateRangeMatch.Middle;
                    }
                }
            } else if (noteData.repeats === NoteRepeat.Monthly) {
                if (noteData.startDate.month !== noteData.endDate.month) {
                    //Notes can only repeat in different months if they are less than a full month long
                    //This means that we just have to check the previous and next months while using the current month
                    let adjustedStartMonth = monthIndex - 1;
                    let adjustedEndMonth = monthIndex + 1;
                    let sYear = year;
                    let eYear = year;
                    if (adjustedStartMonth < 0) {
                        adjustedStartMonth = calendar.months.length - 1;
                        sYear--;
                    }
                    if (adjustedEndMonth >= calendar.months.length) {
                        adjustedEndMonth = 0;
                        eYear++;
                    }
                    const sInBetween = IsDayBetweenDates(
                        calendar,
                        { year: year, month: monthIndex, day: dayIndex, hour: 0, minute: 0, seconds: 0 },
                        { year: sYear, month: adjustedStartMonth, day: noteData.startDate.day, hour: 0, minute: 0, seconds: 0 },
                        { year: year, month: monthIndex, day: noteData.endDate.day, hour: 0, minute: 0, seconds: 0 }
                    );
                    const eInBetween = IsDayBetweenDates(
                        calendar,
                        { year: year, month: monthIndex, day: dayIndex, hour: 0, minute: 0, seconds: 0 },
                        { year: year, month: monthIndex, day: noteData.startDate.day, hour: 0, minute: 0, seconds: 0 },
                        { year: eYear, month: adjustedEndMonth, day: noteData.endDate.day, hour: 0, minute: 0, seconds: 0 }
                    );
                    if (sInBetween !== DateRangeMatch.None || eInBetween !== DateRangeMatch.None) {
                        inBetween = DateRangeMatch.Middle;
                    }
                } else {
                    inBetween = IsDayBetweenDates(
                        calendar,
                        { year: year, month: monthIndex, day: dayIndex, hour: 0, minute: 0, seconds: 0 },
                        { year: year, month: monthIndex, day: noteData.startDate.day, hour: 0, minute: 0, seconds: 0 },
                        { year: year, month: monthIndex, day: noteData.endDate.day, hour: 0, minute: 0, seconds: 0 }
                    );
                }
            } else if (noteData.repeats === NoteRepeat.Yearly) {
                let sYear = year;
                let eYear = year;
                if (noteData.startDate.year !== noteData.endDate.year) {
                    const yDiff = noteData.endDate.year - noteData.startDate.year;
                    sYear = year - yDiff;
                    eYear = year + yDiff;
                    const sInBetween = IsDayBetweenDates(
                        calendar,
                        { year: year, month: monthIndex, day: dayIndex, hour: 0, minute: 0, seconds: 0 },
                        { year: year, month: noteData.startDate.month, day: noteData.startDate.day, hour: 0, minute: 0, seconds: 0 },
                        { year: eYear, month: noteData.endDate.month, day: noteData.endDate.day, hour: 0, minute: 0, seconds: 0 }
                    );
                    const eInBetween = IsDayBetweenDates(
                        calendar,
                        { year: year, month: monthIndex, day: dayIndex, hour: 0, minute: 0, seconds: 0 },
                        { year: sYear, month: noteData.startDate.month, day: noteData.startDate.day, hour: 0, minute: 0, seconds: 0 },
                        { year: year, month: noteData.endDate.month, day: noteData.endDate.day, hour: 0, minute: 0, seconds: 0 }
                    );
                    if (sInBetween !== DateRangeMatch.None || eInBetween !== DateRangeMatch.None) {
                        inBetween = DateRangeMatch.Middle;
                    }
                } else {
                    inBetween = IsDayBetweenDates(
                        calendar,
                        { year: year, month: monthIndex, day: dayIndex, hour: 0, minute: 0, seconds: 0 },
                        { year: year, month: noteData.startDate.month, day: noteData.startDate.day, hour: 0, minute: 0, seconds: 0 },
                        { year: year, month: noteData.endDate.month, day: noteData.endDate.day, hour: 0, minute: 0, seconds: 0 }
                    );
                }
            } else {
                inBetween = IsDayBetweenDates(
                    calendar,
                    { year: year, month: monthIndex, day: dayIndex, hour: 0, minute: 0, seconds: 0 },
                    { year: noteData.startDate.year, month: noteData.startDate.month, day: noteData.startDate.day, hour: 0, minute: 0, seconds: 0 },
                    { year: noteData.endDate.year, month: noteData.endDate.month, day: noteData.endDate.day, hour: 0, minute: 0, seconds: 0 }
                );
            }
            visible = inBetween !== DateRangeMatch.None;
        }
        return visible;
    }
}
