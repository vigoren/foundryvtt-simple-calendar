import {GameSettings} from "../foundry-interfacing/game-settings";
import {CalManager} from "../index";
import {DateRangeMatch, ModuleName, NoteRepeat} from "../../constants";
import {IsDayBetweenDates} from "../utilities/date-time";
import {SimpleCalendar} from "../../../types";

export default class NoteStub{
    private entryId: string;

    public title: string;

    constructor(journalEntryId: string, title: string) {
        this.entryId = journalEntryId;
        this.title = title;
    }

    public canUserView(): boolean {
        const journalEntry = (<Game>game).journal?.get(this.entryId);
        const user = (<Game>game).user;
        if(journalEntry && user){
            return GameSettings.IsGm() || journalEntry.testUserPermission(user, 2);
        }
        return false;
    }

    public isVisible(calendarId: string, year: number, monthIndex: number, dayIndex: number){
        const journalEntry = (<Game>game).journal?.get(this.entryId);
        const calendar = CalManager.getCalendar(calendarId);
        let visible = false;
        if(journalEntry && calendar && this.canUserView()){
            const noteData = <SimpleCalendar.NoteData>journalEntry.getFlag(ModuleName, "noteData");
            if(noteData){
                let inBetween = DateRangeMatch.None;
                if(noteData.repeats === NoteRepeat.Weekly){
                    let noteStartDayOfWeek = 0, noteEndDayOfWeek = 0, targetDayOfWeek = 1;
                    noteStartDayOfWeek = calendar.year.dayOfTheWeek(noteData.startDate.year, noteData.startDate.month, noteData.startDate.day);
                    targetDayOfWeek = calendar.year.dayOfTheWeek(year, monthIndex, dayIndex);
                    noteEndDayOfWeek = calendar.year.dayOfTheWeek(noteData.endDate.year, noteData.endDate.month, noteData.endDate.day);
                    if(noteStartDayOfWeek === targetDayOfWeek){
                        inBetween = DateRangeMatch.Start;
                    } else if(noteEndDayOfWeek === targetDayOfWeek){
                        inBetween = DateRangeMatch.End;
                    } else{
                        // Start and end day of the week are within the same week
                        if(noteStartDayOfWeek < noteEndDayOfWeek && noteStartDayOfWeek < targetDayOfWeek && noteEndDayOfWeek > targetDayOfWeek){
                            inBetween = DateRangeMatch.Middle;
                        }
                        //Start and end day of the week are different weeks but the start day is later in the week than the end day
                        else if(noteStartDayOfWeek > noteEndDayOfWeek && ((noteStartDayOfWeek < targetDayOfWeek && noteEndDayOfWeek < targetDayOfWeek) || (noteStartDayOfWeek > targetDayOfWeek && noteEndDayOfWeek > targetDayOfWeek))){
                            inBetween = DateRangeMatch.Middle;
                        }
                    }
                } else if(noteData.repeats === NoteRepeat.Monthly){
                    let sMonthIndex = monthIndex;
                    let eMonthIndex = monthIndex;
                    let sYear = year;
                    let eYear = year;
                    if (noteData.startDate.month !== noteData.endDate.month) {
                        sMonthIndex = noteData.startDate.month;
                        eMonthIndex = noteData.endDate.month;
                        let mDiff = eMonthIndex - sMonthIndex;
                        sMonthIndex = monthIndex - mDiff;
                        if(sMonthIndex < 0){
                            sMonthIndex = calendar.year.months.length - 1;
                            sYear--;
                        }
                        eMonthIndex = monthIndex + mDiff;
                        if(eMonthIndex >= calendar.year.months.length){
                            eMonthIndex = 0;
                            eYear++;
                        }
                        if(sMonthIndex > -1 && sMonthIndex < calendar.year.months.length && eMonthIndex > -1 && eMonthIndex < calendar.year.months.length){
                            const sInBetween = IsDayBetweenDates(calendar, {year: year, month: monthIndex, day: dayIndex, hour: 0, minute: 0, seconds: 0}, {year: year, month: monthIndex, day: noteData.startDate.day, hour: 0, minute: 0, seconds: 0}, {year: eYear, month: eMonthIndex, day: noteData.endDate.day, hour: 0, minute: 0, seconds: 0});
                            const eInBetween = IsDayBetweenDates(calendar, {year: year, month: monthIndex, day: dayIndex, hour: 0, minute: 0, seconds: 0}, {year: sYear, month: sMonthIndex, day: noteData.startDate.day, hour: 0, minute: 0, seconds: 0}, {year: year, month: monthIndex, day: noteData.endDate.day, hour: 0, minute: 0, seconds: 0});
                            if(sInBetween !== DateRangeMatch.None || eInBetween !== DateRangeMatch.None){
                                inBetween = DateRangeMatch.Middle;
                            }
                        }
                    }
                    else {
                        inBetween = IsDayBetweenDates(calendar, {year: year, month: monthIndex, day: dayIndex, hour: 0, minute: 0, seconds: 0}, {year: year, month: sMonthIndex, day: noteData.startDate.day, hour: 0, minute: 0, seconds: 0}, {year: year, month: eMonthIndex, day: noteData.endDate.day, hour: 0, minute: 0, seconds: 0});
                    }
                } else if(noteData.repeats === NoteRepeat.Yearly){
                    let sYear = year;
                    let eYear = year;
                    if(noteData.startDate.year !== noteData.endDate.year){
                        const yDiff = noteData.endDate.year - noteData.startDate.year;
                        sYear = year - yDiff;
                        eYear = year + yDiff;
                        const sInBetween = IsDayBetweenDates(calendar, {year: year, month: monthIndex, day: dayIndex, hour: 0, minute: 0, seconds: 0}, {year: year, month: noteData.startDate.month, day: noteData.startDate.day, hour: 0, minute: 0, seconds: 0}, {year: eYear, month: noteData.endDate.month, day: noteData.endDate.day, hour: 0, minute: 0, seconds: 0});
                        const eInBetween = IsDayBetweenDates(calendar, {year: year, month: monthIndex, day: dayIndex, hour: 0, minute: 0, seconds: 0}, {year: sYear, month: noteData.startDate.month, day: noteData.startDate.day, hour: 0, minute: 0, seconds: 0}, {year: year, month: noteData.endDate.month, day: noteData.endDate.day, hour: 0, minute: 0, seconds: 0});
                        if(sInBetween !== DateRangeMatch.None || eInBetween !== DateRangeMatch.None){
                            inBetween = DateRangeMatch.Middle;
                        }
                    }
                    else{
                        inBetween = IsDayBetweenDates(calendar, {year: year, month: monthIndex, day: dayIndex, hour: 0, minute: 0, seconds: 0}, {year: year, month: noteData.startDate.month, day: noteData.startDate.day, hour: 0, minute: 0, seconds: 0}, {year: year, month: noteData.endDate.month, day: noteData.endDate.day, hour: 0, minute: 0, seconds: 0});
                    }
                } else {
                    inBetween = IsDayBetweenDates(calendar, {year: year, month: monthIndex, day: dayIndex, hour: 0, minute: 0, seconds: 0}, {year: noteData.startDate.year, month: noteData.startDate.month, day: noteData.startDate.day, hour: 0, minute: 0, seconds: 0}, {year: noteData.endDate.year, month: noteData.endDate.month, day: noteData.endDate.day, hour: 0, minute: 0, seconds: 0});
                }
                visible = inBetween !== DateRangeMatch.None;
            }
        }
        return visible;
    }

    public userReminderRegistered(): boolean{
        let registered = false;
        if(this.canUserView()){
            const journalEntry = (<Game>game).journal?.get(this.entryId);
            const user = (<Game>game).user;
            if(journalEntry && user){
                const noteData = <SimpleCalendar.NoteData>journalEntry.getFlag(ModuleName, "noteData");
                if(noteData){
                    registered = noteData.remindUsers.indexOf(user.id) > -1;
                }
            }
        }
        return registered;
    }
}