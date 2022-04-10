import {CalManager} from "../index";
import {DateRangeMatch, ModuleName, NoteRepeat} from "../../constants";
import {GetDisplayDate, IsDayBetweenDates} from "../utilities/date-time";
import {GetContrastColor} from "../utilities/visual";

export default class NoteStub{
    public entryId: string;

    public reminderSent: boolean = false;

    constructor(journalEntryId: string) {
        this.entryId = journalEntryId;
    }

    public get noteData(){
        const journalEntry = (<Game>game).journal?.get(this.entryId);
        if(journalEntry){
            return <SimpleCalendar.NoteData>journalEntry.getFlag(ModuleName, "noteData");
        }
        return null;
    }

    public get allDay(): boolean{
        const noteData = this.noteData;
        if(noteData){
            return noteData.allDay;
        }
        return true;
    }

    public get content(): string {
        const journalEntry = (<Game>game).journal?.get(this.entryId);
        return journalEntry?.data.content || '';
    }

    public get title(): string{
        const journalEntry = (<Game>game).journal?.get(this.entryId);
        return journalEntry?.name || '';
    }

    public get repeats(): NoteRepeat{
        const nd = this.noteData;
        if(nd){
            return nd.repeats;
        }
        return NoteRepeat.Never;
    }

    public get order(): number {
        const nd = this.noteData;
        if(nd){
            return nd.order;
        }
        return 0;
    }

    public async setOrder(num: number) {
        const journalEntry = (<Game>game).journal?.get(this.entryId);
        if(journalEntry){
            const nd = <SimpleCalendar.NoteData>journalEntry.getFlag(ModuleName, "noteData");
            if(nd){
                nd.order = num;
                await journalEntry.setFlag(ModuleName, "noteData", nd);
            }
        }
    }

    public get authorDisplay(){
        const journalEntry = (<Game>game).journal?.get(this.entryId);
        if(journalEntry){
            const noteData = <SimpleCalendar.NoteData>journalEntry.getFlag(ModuleName, 'noteData');
            if(noteData.fromPredefined){
                return {
                    name: "System",
                    color: '',
                    colorText: ''
                };
            } else {
                for(let k in journalEntry.data.permission){
                    if(journalEntry.data.permission[k] === 3){
                        const author = (<Game>game).users?.get(k);
                        if(author){
                            return {
                                name: author.name || '',
                                color: author.data.color || '',
                                colorText: GetContrastColor(author.data.color || '')
                            };
                        }
                    }
                }
            }
        }
        return null;
    }

    public get categories():  SimpleCalendar.NoteCategory[]{
        const noteData = this.noteData;
        if(noteData){
            const calendar = CalManager.getCalendar(noteData.calendarId);
            if(calendar){
                return calendar.noteCategories.filter(nc => noteData.categories.indexOf(nc.name) > -1);
            }
        }
        return [];
    }

    public get displayDate(): string{
        return this.getDisplayDate(false);
    }

    public get fullDisplayDate(): string{
        return this.getDisplayDate(true);
    }

    public get playerVisible(){
        const journalEntry = (<Game>game).journal?.get(this.entryId);
        if(journalEntry){
            for(let k in journalEntry.data.permission){
                const permissionLevel = journalEntry.data.permission[k] || 0;
                if(permissionLevel >= 2){
                    const user = (<Game>game).users?.get(k);
                    if(user && !user.isGM){
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public get userReminderRegistered(): boolean{
        let registered = false;
        if(this.canUserView()){
            const noteData = this.noteData;
            const user = (<Game>game).user;
            if(noteData && user){
                registered = noteData.remindUsers.indexOf(user.id) > -1;
            }
        }
        return registered;
    }

    public get fromPredefined(): boolean {
        const nd = this.noteData;
        if(nd && nd.fromPredefined !== undefined){
            return  nd.fromPredefined;
        }
        return false;
    }

    public canUserView(): boolean {
        const journalEntry = (<Game>game).journal?.get(this.entryId);
        const user = (<Game>game).user;
        if(journalEntry && user){
            // GM's always are considered to have ownership of a journal entry,
            // so we need to test if the permission is actually set to 0 before using the built-in test
            return !!(journalEntry.data.permission[user.id] !== 0 && journalEntry.testUserPermission(user, 2));
        }
        return false;
    }

    private getDisplayDate(full: boolean): string{
        const noteData = this.noteData;
        if(noteData){
            const calendar = CalManager.getCalendar(noteData.calendarId);
            if(calendar){
                let display: string = '';
                let currentVisibleYear = calendar.year.selectedYear || calendar.year.visibleYear;
                let visibleMonthDay = calendar.getMonthAndDayIndex('selected');
                if(visibleMonthDay.month === undefined){
                    visibleMonthDay = calendar.getMonthAndDayIndex();
                }

                let startYear = noteData.startDate.year;
                let startMonth = noteData.startDate.month;
                let startDay = noteData.startDate.day;
                let endYear = noteData.endDate.year;
                let endMonth = noteData.endDate.month;
                let endDay = noteData.endDate.day;

                if(noteData.repeats === NoteRepeat.Weekly){
                    startYear = currentVisibleYear;
                    endYear = currentVisibleYear;
                    let noteStartDayOfWeek = calendar.dayOfTheWeek(noteData.startDate.year, startMonth, startDay);
                    let noteEndDayOfWeek = calendar.dayOfTheWeek(noteData.endDate.year, endMonth, endDay);
                    let currentDayOfWeek = calendar.dayOfTheWeek(currentVisibleYear, visibleMonthDay.month || 0, visibleMonthDay.day || 0);
                    let noteLength = noteEndDayOfWeek - noteStartDayOfWeek;
                    if(noteLength < 0){
                        noteLength = calendar.weekdays.length + noteLength;
                    }
                    noteLength++;

                    startMonth = visibleMonthDay.month || 0;
                    endMonth = visibleMonthDay.month || 0;
                    let noteStartDiff = currentDayOfWeek - noteStartDayOfWeek;
                    let noteEndDiff = noteEndDayOfWeek - currentDayOfWeek;
                    if(noteStartDiff < 0){
                        noteStartDiff = calendar.weekdays.length + noteStartDiff;
                    }
                    if(noteEndDiff < 0){
                        noteEndDiff = calendar.weekdays.length + noteEndDiff;
                    }
                    if((noteStartDiff + noteEndDiff) < noteLength){
                        startDay = (visibleMonthDay.day || 0) - noteStartDiff;
                        endDay = (visibleMonthDay.day || 0) + noteEndDiff;
                        let safetyCount = 0;
                        while(startDay < 0){
                            startMonth--;
                            if(startMonth < 0){
                                startYear--;
                                startMonth = calendar.months.length - 1;
                            }
                            const isLeapYear = calendar.year.leapYearRule.isLeapYear(startYear);
                            startDay = calendar.months[startMonth][isLeapYear? 'numberOfLeapYearDays' : 'numberOfDays'] + startDay;
                            safetyCount++;
                            if(safetyCount > calendar.months.length){
                                break;
                            }
                        }

                        let endIsLeapYear = calendar.year.leapYearRule.isLeapYear(endYear);
                        safetyCount = 0;
                        while(endDay >= calendar.months[endMonth][endIsLeapYear? 'numberOfLeapYearDays' : 'numberOfDays']){
                            endDay = endDay - calendar.months[endMonth][endIsLeapYear? 'numberOfLeapYearDays' : 'numberOfDays'];
                            endMonth++;
                            if(endMonth >= calendar.months.length){
                                endYear++;
                                endMonth = 0;
                                endIsLeapYear = calendar.year.leapYearRule.isLeapYear(endYear);
                            }
                            safetyCount++;
                            if(safetyCount > calendar.months.length){
                                break;
                            }
                        }
                    }
                } else if(noteData.repeats === NoteRepeat.Monthly){
                    startYear = currentVisibleYear;
                    endYear = currentVisibleYear;
                    startMonth = visibleMonthDay.month || 0;
                    endMonth = visibleMonthDay.month || 0;
                    if (noteData.startDate.month !== noteData.endDate.month) {
                        if(noteData.startDate.day <= (visibleMonthDay.day || 0)){
                            endMonth = (visibleMonthDay.month || 0) + 1;
                            if(endMonth >= calendar.months.length){
                                endMonth = 0;
                                endYear = currentVisibleYear + 1;
                            }
                        } else if(noteData.endDate.day >= (visibleMonthDay.day || 0)){
                            startMonth = (visibleMonthDay.month || 0) - 1;
                            if(startMonth < 0){
                                startMonth = calendar.months.length - 1;
                                startYear = currentVisibleYear - 1;
                            }
                        }
                    }
                    // Check if the selected start day is more days than the current month has, if so adjust the end day to the max number of day.
                    if(noteData.startDate.day >= calendar.months[startMonth].days.length){
                        const isLeapYear = calendar.year.leapYearRule.isLeapYear(startYear);
                        startDay = (isLeapYear? calendar.months[startMonth].numberOfLeapYearDays : calendar.months[startMonth].numberOfDays) - 1;
                    }

                    // Check if the selected end day is more days than the current month has, if so adjust the end day to the max number of day.
                    if(noteData.endDate.day >= calendar.months[endMonth].days.length){
                        const isLeapYear = calendar.year.leapYearRule.isLeapYear(endYear);
                        endDay = (isLeapYear? calendar.months[endMonth].numberOfLeapYearDays : calendar.months[endMonth].numberOfDays) - 1;
                    }
                } else if(noteData.repeats === NoteRepeat.Yearly){
                    if(noteData.startDate.year !== noteData.endDate.year){
                        const yDiff = noteData.endDate.year - noteData.startDate.year;
                        // The start month is in the current month and  the start day is less than the current day
                        if(noteData.startDate.month === (visibleMonthDay.month || 0) && noteData.startDate.day <= (visibleMonthDay.day || 0)){
                            startYear = currentVisibleYear;
                            endYear = currentVisibleYear + yDiff
                        } else if(noteData.endDate.month === (visibleMonthDay.month || 0) && noteData.endDate.day >= (visibleMonthDay.day || 0)){
                            startYear = currentVisibleYear - yDiff;
                            endYear = currentVisibleYear;
                        }
                    }
                    else{
                        startYear = currentVisibleYear;
                        endYear = currentVisibleYear;
                    }
                }
                display = GetDisplayDate(calendar,{year: startYear, month: startMonth, day: startDay, hour: noteData.startDate.hour, minute: noteData.startDate.minute, seconds: 0},{year: endYear, month: endMonth, day: endDay, hour: noteData.endDate.hour, minute: noteData.endDate.minute, seconds: 0}, noteData.allDay, !full);
                return display;
            }
        }
        return '';
    }

    public isVisible(calendarId: string, year: number, monthIndex: number, dayIndex: number){
        const calendar = CalManager.getCalendar(calendarId);
        const noteData = this.noteData;
        let visible = false;
        if(noteData && calendar && this.canUserView()){
            let inBetween = DateRangeMatch.None;
            if(noteData.repeats === NoteRepeat.Weekly){
                let noteStartDayOfWeek = 0, noteEndDayOfWeek = 0, targetDayOfWeek = 1;
                noteStartDayOfWeek = calendar.dayOfTheWeek(noteData.startDate.year, noteData.startDate.month, noteData.startDate.day);
                targetDayOfWeek = calendar.dayOfTheWeek(year, monthIndex, dayIndex);
                noteEndDayOfWeek = calendar.dayOfTheWeek(noteData.endDate.year, noteData.endDate.month, noteData.endDate.day);
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
                if (noteData.startDate.month !== noteData.endDate.month) {
                    //Notes can only repeat in different months if they are less than a full month long
                    //This means that we just have to check the previous and next months while using the current month
                    let adjustedStartMonth = monthIndex - 1;
                    let adjustedEndMonth = monthIndex + 1;
                    let sYear = year;
                    let eYear = year;
                    if(adjustedStartMonth < 0){
                        adjustedStartMonth = calendar.months.length - 1;
                        sYear--;
                    }
                    if(adjustedEndMonth >= calendar.months.length){
                        adjustedEndMonth = 0;
                        eYear++;
                    }
                    const sInBetween = IsDayBetweenDates(calendar, {year: year, month: monthIndex, day: dayIndex, hour: 0, minute: 0, seconds: 0}, {year: sYear, month: adjustedStartMonth, day: noteData.startDate.day, hour: 0, minute: 0, seconds: 0}, {year: year, month: monthIndex, day: noteData.endDate.day, hour: 0, minute: 0, seconds: 0});
                    const eInBetween = IsDayBetweenDates(calendar, {year: year, month: monthIndex, day: dayIndex, hour: 0, minute: 0, seconds: 0}, {year: year, month: monthIndex, day: noteData.startDate.day, hour: 0, minute: 0, seconds: 0}, {year: eYear, month: adjustedEndMonth, day: noteData.endDate.day, hour: 0, minute: 0, seconds: 0});
                    if(sInBetween !== DateRangeMatch.None || eInBetween !== DateRangeMatch.None){
                        inBetween = DateRangeMatch.Middle;
                    }
                }
                else {
                    inBetween = IsDayBetweenDates(calendar, {year: year, month: monthIndex, day: dayIndex, hour: 0, minute: 0, seconds: 0}, {year: year, month: monthIndex, day: noteData.startDate.day, hour: 0, minute: 0, seconds: 0}, {year: year, month: monthIndex, day: noteData.endDate.day, hour: 0, minute: 0, seconds: 0});
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
        return visible;
    }
}