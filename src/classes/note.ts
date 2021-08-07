import {DateTimeParts, DayTemplate, NoteConfig, NoteTemplate} from "../interfaces";
import {GameSettings} from "./game-settings"
import {DateRangeMatch, NoteRepeat} from "../constants";
import SimpleCalendar from "./simple-calendar";
import DateSelector from "./date-selector";
import Utilities from "./utilities";

/**
 * All content around a calendar note
 */
export class Note{
    /**
     * The Unique ID of the note
     * @type {string}
     */
    id: string;
    /**
     * The year the note is in
     * @type {number}
     */
    year: number = 0;
    /**
     * The month the note is in
     * @type {number}
     */
    month: number = 0;
    /**
     * The display text for the month
     * @type {string}
     */
    monthDisplay: string = '';
    /**
     * The day the note is in
     * @type {number}
     */
    day: number = 0;
    /**
     * The hours the note starts
     * @type {number}
     */
    hour: number = 0;
    /**
     * The minute the note starts
     * @type {number}
     */
    minute: number = 0;
    /**
     * If the note runs all day or starts at a specific time
     * @type {boolean}
     */
    allDay: boolean = true;
    /**
     * The end date and time for a note
     * @type {DateTimeParts}
     */
    endDate: DateTimeParts = {year: 0, month: 0, day: 0, hour: 0, minute: 0, seconds: 0};
    /**
     * The title of the note
     * @type {string}
     */
    title: string = '';
    /**
     * The content of the note
     * @type {string}
     */
    content: string = '';
    /**
     * The author of the note
     * @type {string}
     */
    author: string = '';
    /**
     * If the note is visible to the players or not
     * @type {boolean}
     */
    playerVisible: boolean = false;
    /**
     * How often this note repeats
     * @type {NoteRepeat}
     */
    repeats: NoteRepeat = NoteRepeat.Never;
    /**
     * The order in which the not displays in the day list
     * @type {number}
     */
    order: number = 0;
    /**
     * The categories that this note is associated with
     * @type {string[]}
     */
    categories: string[] = [];

    /**
     * List of user IDs to send reminders too when the time reaches the note time
     * @type {string[]}
     */
    remindUsers: string[] = [];

    /**
     * If a reminder for this note has been sent to the user or not (Local variable to the user)
     * @type {boolean}
     */
    reminderSent: boolean = false;


    /**
     * The note constructor
     */
    constructor() {
        this.id = Utilities.generateUniqueId();
    }

    /**
     * Initializes the note with the passed in values as well as sets the current user as the author
     * @param {number} year
     * @param {number} month
     * @param {number} day
     * @param {string} monthName
     */
    initialize(year: number, month: number, day: number, monthName: string){
        this.year = year;
        this.month = month;
        this.day = day;
        this.endDate.year = year;
        this.endDate.month = month;
        this.endDate.day = day;
        this.monthDisplay = monthName;
        this.author = GameSettings.UserID();
        this.playerVisible = GameSettings.GetDefaultNoteVisibility();
    }

    /**
     * Converts the note class to a template to be used when rendering the note in HTML
     * @return {NoteTemplate}
     */
    toTemplate(): NoteTemplate {
        const author = GameSettings.GetUser(this.author);
        let authDisplay;
        if(author){
            authDisplay = {
                name: author.name,
                color: author.data.color? author.data.color : '',
                textColor: Utilities.GetContrastColor(author.data.color? author.data.color : '')
            };
        } else {
            authDisplay = null;
        }

        let reminder = false;
        if(this.remindUsers.indexOf(GameSettings.UserID()) > -1){
            reminder = true;
        }

        return {
            title: this.title,
            content: this.content,
            playerVisible: this.playerVisible,
            author: this.author,
            authorDisplay: authDisplay,
            monthDisplay: this.monthDisplay,
            id: this.id,
            allDay: this.allDay,
            displayDate: DateSelector.GetDisplayDate({year: this.year, month: this.month, day: this.day, hour: this.hour, minute: this.minute, allDay: this.allDay}, {year: this.endDate.year, month: this.endDate.month, day: this.endDate.day, hour: this.endDate.hour? this.endDate.hour : 0, minute: this.endDate.minute? this.endDate.minute : 0, allDay: this.allDay}, true),
            hour: this.hour,
            minute: this.minute,
            endDate: this.endDate,
            order: this.order,
            categories: SimpleCalendar.instance.noteCategories.filter(nc => this.categories.includes(nc.name)),
            reminder: reminder
        };
    }

    /**
     * Populates this note with the content from a note config
     * @param {NoteConfig} noteConfig The data loaded from the game settings to populate this note with
     */
    loadFromConfig(noteConfig: NoteConfig){
        this.year = noteConfig.year;
        this.month = noteConfig.month;
        this.day = noteConfig.day;
        this.monthDisplay = noteConfig.monthDisplay;
        this.title = noteConfig.title;
        this.content = noteConfig.content;
        this.author = noteConfig.author;
        this.playerVisible = noteConfig.playerVisible;
        this.id = noteConfig.id;
        this.repeats = noteConfig.repeats;

        if(noteConfig.hasOwnProperty('allDay')){
            this.allDay = noteConfig.allDay;
        }
        if(noteConfig.hasOwnProperty('hour')){
            this.hour = noteConfig.hour;
        }
        if(noteConfig.hasOwnProperty('minute')){
            this.minute = noteConfig.minute;
        }
        if(noteConfig.hasOwnProperty('endDate')){
            this.endDate = {
                year: noteConfig.endDate.year,
                month: noteConfig.endDate.month,
                day: noteConfig.endDate.day,
                hour: noteConfig.endDate.hour,
                minute: noteConfig.endDate.minute,
                seconds: 0
            };
        } else {
            this.endDate = {
                year: this.year,
                month: this.month,
                day: this.day,
                hour: this.hour,
                minute: this.minute,
                 seconds: 0
            };
        }
        if(noteConfig.hasOwnProperty('order')){
            this.order = noteConfig.order;
        }
        if(noteConfig.hasOwnProperty('categories')){
            this.categories = noteConfig.categories;
        }
        if(noteConfig.hasOwnProperty('remindUsers')){
            this.remindUsers = noteConfig.remindUsers;
        }
    }

    /**
     * Creates a new note object with the content of this note
     */
    clone(): Note {
        const n = new Note();
        n.year = this.year;
        n.month = this.month;
        n.day = this.day;
        n.monthDisplay = this.monthDisplay;
        n.allDay = this.allDay;
        n.hour = this.hour;
        n.minute = this.minute;
        n.title = this.title;
        n.content = this.content;
        n.author = this.author;
        n.playerVisible = this.playerVisible;
        n.id = this.id;
        n.repeats = this.repeats;
        n.endDate = {
            year: this.endDate.year,
            month: this.endDate.month,
            day: this.endDate.day,
            hour: this.endDate.hour,
            minute: this.endDate.minute,
            seconds: this.endDate.seconds
        };
        n.order = this.order;
        n.categories = [...this.categories];
        n.remindUsers = [...this.remindUsers];
        return n;
    }

    /**
     * If the note is visible to the current user or not
     * @param {number} year The year we are checking
     * @param {number} month The month we are checking
     * @param {number} day The day we are checking
     */
    isVisible(year: number, month: number ,day: number){
        const userVisible = (GameSettings.IsGm() || (!GameSettings.IsGm() && this.playerVisible));
        let dayVisible = false;
        if(userVisible){
            let inBetween = DateRangeMatch.None;
            if(this.repeats === NoteRepeat.Weekly){
                let noteStartDayOfWeek = 0, noteEndDayOfWeek = 0, targetDayOfWeek = 1;
                if(SimpleCalendar.instance.currentYear){
                    noteStartDayOfWeek = SimpleCalendar.instance.currentYear.dayOfTheWeek(this.year, this.month, this.day);
                    targetDayOfWeek = SimpleCalendar.instance.currentYear.dayOfTheWeek(year, month, day);
                    noteEndDayOfWeek = SimpleCalendar.instance.currentYear.dayOfTheWeek(this.endDate.year, this.endDate.month, this.endDate.day);
                }
                if(noteStartDayOfWeek === targetDayOfWeek){
                    inBetween = DateRangeMatch.Start;
                } else if(noteEndDayOfWeek === targetDayOfWeek){
                    inBetween = DateRangeMatch.End;
                } else{
                    // Start and end day of the week are within the same week
                    if(noteStartDayOfWeek < noteEndDayOfWeek && noteStartDayOfWeek < targetDayOfWeek && noteEndDayOfWeek > targetDayOfWeek){
                        inBetween = DateRangeMatch.Middle;
                    }
                    //Start and end day of the week are are different weeks but the start day is later in the week than the end day
                    else if(noteStartDayOfWeek > noteEndDayOfWeek && ((noteStartDayOfWeek < targetDayOfWeek && noteEndDayOfWeek < targetDayOfWeek) || (noteStartDayOfWeek > targetDayOfWeek && noteEndDayOfWeek > targetDayOfWeek))){
                        inBetween = DateRangeMatch.Middle;
                    }
                }
            } else if(this.repeats === NoteRepeat.Monthly){
                let sMonth = month;
                let eMonth = month;
                let sYear = year;
                let eYear = year;
                if(SimpleCalendar.instance.currentYear) {
                    if (this.month !== this.endDate.month) {
                        let sMonthIndex = SimpleCalendar.instance.currentYear.months.findIndex(m => m.numericRepresentation === this.month);
                        let eMonthIndex = SimpleCalendar.instance.currentYear.months.findIndex(m => m.numericRepresentation === this.endDate.month);
                        let cMonthIndex = SimpleCalendar.instance.currentYear.months.findIndex(m => m.numericRepresentation === month);
                        let mDiff = eMonthIndex - sMonthIndex;
                        sMonthIndex = cMonthIndex - mDiff;
                        if(sMonthIndex < 0){
                            sMonthIndex = SimpleCalendar.instance.currentYear.months.length - 1;
                            sYear--;
                        }
                        eMonthIndex = cMonthIndex + mDiff;
                        if(eMonthIndex >= SimpleCalendar.instance.currentYear.months.length){
                            eMonthIndex = 0;
                            eYear++;
                        }
                        if(sMonthIndex > -1 && sMonthIndex < SimpleCalendar.instance.currentYear.months.length && eMonthIndex > -1 && eMonthIndex < SimpleCalendar.instance.currentYear.months.length){
                            sMonth = SimpleCalendar.instance.currentYear.months[sMonthIndex].numericRepresentation;
                            eMonth = SimpleCalendar.instance.currentYear.months[eMonthIndex].numericRepresentation;

                            const sInBetween = DateSelector.IsDayBetweenDates({year: year, month: month, day: day, allDay: true, hour: 0, minute: 0}, {year: year, month: month, day: this.day, allDay: true, hour: 0, minute: 0}, {year: eYear, month: eMonth, day: this.endDate.day, allDay: true, hour: 0, minute: 0});
                            const eInBetween = DateSelector.IsDayBetweenDates({year: year, month: month, day: day, allDay: true, hour: 0, minute: 0}, {year: sYear, month: sMonth, day: this.day, allDay: true, hour: 0, minute: 0}, {year: year, month: month, day: this.endDate.day, allDay: true, hour: 0, minute: 0});
                            if(sInBetween !== DateRangeMatch.None || eInBetween !== DateRangeMatch.None){
                                inBetween = DateRangeMatch.Middle;
                            }
                        }
                    }
                    else {
                        inBetween = DateSelector.IsDayBetweenDates({year: year, month: month, day: day, allDay: true, hour: 0, minute: 0}, {year: year, month: sMonth, day: this.day, allDay: true, hour: 0, minute: 0}, {year: year, month: eMonth, day: this.endDate.day, allDay: true, hour: 0, minute: 0});
                    }
                }
            } else if(this.repeats === NoteRepeat.Yearly){
                let sYear = year;
                let eYear = year;
                if(SimpleCalendar.instance.currentYear) {
                    if(this.year !== this.endDate.year){
                        const yDiff = this.endDate.year - this.year;
                        sYear = year - yDiff;
                        eYear = year + yDiff;
                        const sInBetween = DateSelector.IsDayBetweenDates({year: year, month: month, day: day, allDay: true, hour: 0, minute: 0}, {year: year, month: this.month, day: this.day, allDay: true, hour: 0, minute: 0}, {year: eYear, month: this.endDate.month, day: this.endDate.day, allDay: true, hour: 0, minute: 0});
                        const eInBetween = DateSelector.IsDayBetweenDates({year: year, month: month, day: day, allDay: true, hour: 0, minute: 0}, {year: sYear, month: this.month, day: this.day, allDay: true, hour: 0, minute: 0}, {year: year, month: this.endDate.month, day: this.endDate.day, allDay: true, hour: 0, minute: 0});
                        if(sInBetween !== DateRangeMatch.None || eInBetween !== DateRangeMatch.None){
                            inBetween = DateRangeMatch.Middle;
                        }
                    }
                    else{
                        inBetween = DateSelector.IsDayBetweenDates({year: year, month: month, day: day, allDay: true, hour: 0, minute: 0}, {year: year, month: this.month, day: this.day, allDay: true, hour: 0, minute: 0}, {year: year, month: this.endDate.month, day: this.endDate.day, allDay: true, hour: 0, minute: 0});
                    }
                }
            } else {
                inBetween = DateSelector.IsDayBetweenDates({year: year, month: month, day: day, allDay: true, hour: 0, minute: 0}, {year: this.year, month: this.month, day: this.day, allDay: true, hour: 0, minute: 0}, {year: this.endDate.year, month: this.endDate.month, day: this.endDate.day, allDay: true, hour: 0, minute: 0});
            }
            dayVisible = inBetween !== DateRangeMatch.None;
        }
        return userVisible && dayVisible;
    }

    /**
     * Returns the display text for the note
     * Takes into account if the note repeats.
     */
    display(){
        let display: string = '';

        if(SimpleCalendar.instance && SimpleCalendar.instance.currentYear){
            let currentVisibleYear = SimpleCalendar.instance.currentYear.visibleYear;
            let currentVisibleMonthIndex = SimpleCalendar.instance.currentYear.months.findIndex(m => m.selected);
            if(currentVisibleMonthIndex === -1){
                currentVisibleMonthIndex = SimpleCalendar.instance.currentYear.months.findIndex(m => m.current);
            }
            let currentVisibleDayIndex = SimpleCalendar.instance.currentYear.months[currentVisibleMonthIndex].days.findIndex(d => d.selected);
            if(currentVisibleDayIndex === -1){
                currentVisibleDayIndex = SimpleCalendar.instance.currentYear.months[currentVisibleMonthIndex].days.findIndex(d => d.current);
            }
            let noteStartMonthIndex = SimpleCalendar.instance.currentYear.months.findIndex(m => m.numericRepresentation === this.month);
            let noteEndMonthIndex = SimpleCalendar.instance.currentYear.months.findIndex(m => m.numericRepresentation === this.endDate.month);
            if(noteStartMonthIndex === -1){
                noteStartMonthIndex = 0;
            }
            if(noteEndMonthIndex === -1){
                noteEndMonthIndex = 0;
            }
            let noteStartDayIndex = SimpleCalendar.instance.currentYear.months[noteStartMonthIndex].days.findIndex(d => d.numericRepresentation === this.day);
            let noteEndDayIndex = SimpleCalendar.instance.currentYear.months[noteEndMonthIndex].days.findIndex(d => d.numericRepresentation === this.endDate.day);


            let startYear = this.year;
            let startMonth = this.month;
            let startDay = this.day;
            let endYear = this.endDate.year;
            let endMonth = this.endDate.month;
            let endDay = this.endDate.day;

            if(this.repeats === NoteRepeat.Weekly){
                startYear = currentVisibleYear;
                endYear = currentVisibleYear;
                let sMonth = currentVisibleMonthIndex;
                let eMonth = currentVisibleMonthIndex;
                let sDay: number | undefined = this.day;
                let eDay: number | undefined = this.endDate.day;
                const currentVisibleDayNumericRepresentation = SimpleCalendar.instance.currentYear.months[currentVisibleMonthIndex].days[currentVisibleDayIndex].numericRepresentation;
                let noteStartDayOfWeek = SimpleCalendar.instance.currentYear.dayOfTheWeek(this.year, this.month, startDay);
                let noteEndDayOfWeek = SimpleCalendar.instance.currentYear.dayOfTheWeek(this.endDate.year, this.endDate.month, endDay);
                let currentDayOfWeek = SimpleCalendar.instance.currentYear.dayOfTheWeek(SimpleCalendar.instance.currentYear.visibleYear, SimpleCalendar.instance.currentYear.months[currentVisibleMonthIndex].numericRepresentation, currentVisibleDayNumericRepresentation);
                let weeks = SimpleCalendar.instance.currentYear.daysIntoWeeks(SimpleCalendar.instance.currentYear.months[currentVisibleMonthIndex], currentVisibleYear, SimpleCalendar.instance.currentYear.weekdays.length);

                for(let i = 0; i < weeks.length; i++){
                    const res = weeks[i].find(wd => wd !== false && wd !== true && wd.numericRepresentation === currentVisibleDayNumericRepresentation);
                    if(res !== false && res !== true && res !== undefined) {
                        // Note spans weeks
                        if (noteEndDayOfWeek < noteStartDayOfWeek) {
                            if (currentDayOfWeek <= noteEndDayOfWeek) {
                                eDay = (<DayTemplate>weeks[i][noteEndDayOfWeek]).numericRepresentation;
                                //Choose the previous week
                                if (i > 0) {
                                    sDay = (<DayTemplate>weeks[i - 1][noteStartDayOfWeek]).numericRepresentation;
                                } else {
                                    sDay = undefined;
                                }
                            } else {
                                sDay = (<DayTemplate>weeks[i][noteStartDayOfWeek]).numericRepresentation;
                                //Choose the next week
                                if (i < weeks.length - 1) {
                                    eDay = (<DayTemplate>weeks[i + 1][noteEndDayOfWeek]).numericRepresentation;
                                } else {
                                    eDay = undefined;
                                }
                            }
                        } else {
                            sDay = (<DayTemplate>weeks[i][noteStartDayOfWeek]).numericRepresentation;
                            eDay = (<DayTemplate>weeks[i][noteEndDayOfWeek]).numericRepresentation;
                        }
                    }
                }
                if(sDay === undefined){
                    if(sMonth > 0){
                        sMonth--;
                    } else {
                        startYear--;
                        sMonth = SimpleCalendar.instance.currentYear.months.length - 1;
                    }
                    weeks = SimpleCalendar.instance.currentYear.daysIntoWeeks(SimpleCalendar.instance.currentYear.months[sMonth], startYear, SimpleCalendar.instance.currentYear.weekdays.length);
                    let wi = weeks.length - 1;
                    while(wi >= 0){
                        if(weeks[wi][noteStartDayOfWeek] !== false){
                            sDay = (<DayTemplate>weeks[wi][noteStartDayOfWeek]).numericRepresentation;
                        }
                        wi--;
                        if(sDay !== undefined){
                            break;
                        }
                    }
                }
                if(eDay === undefined){
                    if(eMonth < SimpleCalendar.instance.currentYear.months.length - 1){
                        eMonth++;
                    } else {
                        endYear++;
                        eMonth = 0;
                    }
                    weeks = SimpleCalendar.instance.currentYear.daysIntoWeeks(SimpleCalendar.instance.currentYear.months[eMonth], endYear, SimpleCalendar.instance.currentYear.weekdays.length);
                    let wi = 0;
                    while(wi < weeks.length){
                        if(weeks[wi][noteEndDayOfWeek] !== false){
                            eDay = (<DayTemplate>weeks[wi][noteEndDayOfWeek]).numericRepresentation;
                        }
                        wi++;
                        if(eDay !== undefined){
                            break;
                        }
                    }
                }
                startMonth = SimpleCalendar.instance.currentYear.months[sMonth].numericRepresentation;
                endMonth = SimpleCalendar.instance.currentYear.months[eMonth].numericRepresentation;
                startDay = sDay? sDay : 1;
                endDay = eDay? eDay : 1;

            } else if(this.repeats === NoteRepeat.Monthly){
                startYear = currentVisibleYear;
                endYear = currentVisibleYear;
                let sMonth = currentVisibleMonthIndex;
                let eMonth = currentVisibleMonthIndex;
                if (this.month !== this.endDate.month) {
                    const mDiff = noteEndMonthIndex - noteStartMonthIndex;
                    if(noteStartDayIndex <= currentVisibleDayIndex){
                        eMonth = currentVisibleMonthIndex + mDiff;
                        if(eMonth >= SimpleCalendar.instance.currentYear.months.length){
                            eMonth = 0;
                            endYear = currentVisibleYear + 1;
                        }
                    } else if(noteEndDayIndex >= currentVisibleDayIndex){
                        sMonth = currentVisibleMonthIndex - mDiff;
                        if(sMonth < 0){
                            sMonth = SimpleCalendar.instance.currentYear.months.length - 1;
                            startYear = currentVisibleYear - 1;
                        }
                    }
                    startMonth = SimpleCalendar.instance.currentYear.months[sMonth].numericRepresentation;
                    endMonth = SimpleCalendar.instance.currentYear.months[eMonth].numericRepresentation;
                } else {
                    startMonth = SimpleCalendar.instance.currentYear.months[currentVisibleMonthIndex].numericRepresentation;
                    endMonth = SimpleCalendar.instance.currentYear.months[currentVisibleMonthIndex].numericRepresentation;
                }
                // Check if the selected start day is more days than the current month has, if so adjust the end day to the max number of day.
                if(noteStartDayIndex >= SimpleCalendar.instance.currentYear.months[sMonth].days.length){
                    const isLeapYear = SimpleCalendar.instance.currentYear.leapYearRule.isLeapYear(startYear);
                    startDay = isLeapYear? SimpleCalendar.instance.currentYear.months[sMonth].numberOfLeapYearDays : SimpleCalendar.instance.currentYear.months[sMonth].numberOfDays;
                }

                // Check if the selected end day is more days than the current month has, if so adjust the end day to the max number of day.
                if(noteEndDayIndex >= SimpleCalendar.instance.currentYear.months[eMonth].days.length){
                    const isLeapYear = SimpleCalendar.instance.currentYear.leapYearRule.isLeapYear(endYear);
                    endDay = isLeapYear? SimpleCalendar.instance.currentYear.months[eMonth].numberOfLeapYearDays : SimpleCalendar.instance.currentYear.months[eMonth].numberOfDays;
                }
            } else if(this.repeats === NoteRepeat.Yearly){
                if(this.year !== this.endDate.year){
                    const yDiff = this.endDate.year - this.year;
                    // The start month is in the current month and  the start day is less than the current day
                    if(noteStartMonthIndex === currentVisibleMonthIndex && noteStartDayIndex <= currentVisibleDayIndex){
                        startYear = currentVisibleYear;
                        endYear = currentVisibleYear + yDiff
                    } else if(noteEndMonthIndex === currentVisibleMonthIndex && noteEndDayIndex >= currentVisibleDayIndex){
                        startYear = currentVisibleYear - yDiff;
                        endYear = currentVisibleYear;
                    }
                }
                else{
                    startYear = currentVisibleYear;
                    endYear = currentVisibleYear;
                }
            }
            display = DateSelector.GetDisplayDate({year: startYear, month: startMonth, day: startDay, hour: this.hour, minute: this.minute, allDay: this.allDay},{year: endYear, month: endMonth, day: endDay, hour: this.endDate.hour, minute: this.endDate.minute, allDay: this.allDay} );
        }
        return display;
    }
}
