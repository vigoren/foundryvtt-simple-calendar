import {DateTimeParts, NoteCategory, NoteConfig, NoteTemplate} from "../interfaces";
import {GameSettings} from "./game-settings"
import {DateRangeMatch, NoteRepeat} from "../constants";
import SimpleCalendar from "./simple-calendar";
import DateSelector from "./date-selector";

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
     * @type {NoteCategory[]}
     */
    categories: NoteCategory[] = [];

    static GetContrastColor(color: string){
        let contrastColor = "#000000";
        if (color.indexOf('#') === 0) {
            color = color.slice(1);
        }
        if(color.length === 3 || color.length === 6){
            // convert 3-digit hex to 6-digits.
            if (color.length === 3) {
                color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
            }
            var r = parseInt(color.slice(0, 2), 16),
                g = parseInt(color.slice(2, 4), 16),
                b = parseInt(color.slice(4, 6), 16);
            contrastColor = (r * 0.299 + g * 0.587 + b * 0.114) > 186? '#000000' : '#FFFFFF'
        }
        return contrastColor;
    }

    /**
     * The note constructor
     */
    constructor() {
        this.id = window.crypto.getRandomValues(new Uint32Array(1))[0].toString(16)
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
                color: author.color || author.data.color,
                textColor: Note.GetContrastColor(author.color || author.data.color)
            };
        } else {
            authDisplay = null;
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
            categories: this.categories
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
                minute: noteConfig.endDate.minute
            };
        } else {
            this.endDate = {
                year: noteConfig.year,
                month: noteConfig.month,
                day: noteConfig.day,
                hour: noteConfig.hour,
                minute: noteConfig.minute
            };
        }
        if(noteConfig.hasOwnProperty('order')){
            this.order = noteConfig.order;
        }
        if(noteConfig.hasOwnProperty('categories')){
            this.categories = noteConfig.categories;
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
        if(this.endDate !== null){
            n.endDate = {
                year: this.endDate.year,
                month: this.endDate.month,
                day: this.endDate.day,
                hour: this.endDate.hour,
                minute: this.endDate.minute,
                seconds: this.endDate.seconds
            };
        }
        n.order = this.order;
        n.categories = this.categories.map(c => {return {name: c.name, color: c.color, textColor: c.textColor};});
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
                    if(this.endDate){
                        noteEndDayOfWeek = SimpleCalendar.instance.currentYear.dayOfTheWeek(this.endDate.year, this.endDate.month, this.endDate.day);
                    }
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
                inBetween = DateSelector.IsDayBetweenDates({year: year, month: month, day: day, allDay: true, hour: 0, minute: 0}, {year: year, month: month, day: this.day, allDay: true, hour: 0, minute: 0}, {year: year, month: month, day: this.endDate.day, allDay: true, hour: 0, minute: 0});
            } else if(this.repeats === NoteRepeat.Yearly){
                inBetween = DateSelector.IsDayBetweenDates({year: year, month: month, day: day, allDay: true, hour: 0, minute: 0}, {year: year, month: this.month, day: this.day, allDay: true, hour: 0, minute: 0}, {year: year, month: this.endDate.month, day: this.endDate.day, allDay: true, hour: 0, minute: 0});
            } else {
                inBetween = DateSelector.IsDayBetweenDates({year: year, month: month, day: day, allDay: true, hour: 0, minute: 0}, {year: this.year, month: this.month, day: this.day, allDay: true, hour: 0, minute: 0}, {year: this.endDate.year, month: this.endDate.month, day: this.endDate.day, allDay: true, hour: 0, minute: 0});
            }
            //TODO: Dates that span multiple days, the start and end day are visible no matter the year.
            dayVisible = inBetween !== DateRangeMatch.None;
        }
        return userVisible && dayVisible;
    }
}
