import {NoteConfig, NoteTemplate} from "../interfaces";
import {GameSettings} from "./game-settings"
import {NoteRepeat} from "../constants";
import SimpleCalendar from "./simple-calendar";
import {triggerAsyncId} from "async_hooks";

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

    allDay: boolean = true;
    hour: number = 0;
    minute: number = 0;
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
     * The note constructor
     */
    constructor() {
        this.id = window.crypto.getRandomValues(new Uint32Array(1))[0].toString(16)
    }

    /**
     * Converts the note class to a template to be used when rendering the note in HTML
     * @return {NoteTemplate}
     */
    toTemplate(): NoteTemplate {
        return {
            title: this.title,
            content: this.content,
            author: this.author,
            monthDisplay: this.monthDisplay,
            id: this.id
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
        this.allDay = noteConfig.allDay;
        this.hour = noteConfig.hour;
        this.minute = noteConfig.minute;
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
        if(this.repeats === NoteRepeat.Weekly){
            let noteDayOfWeek = 0, targetDayOfWeek = 1;
            if(SimpleCalendar.instance.currentYear){
                noteDayOfWeek = SimpleCalendar.instance.currentYear.dayOfTheWeek(this.year, this.month, this.day);
                targetDayOfWeek = SimpleCalendar.instance.currentYear.dayOfTheWeek(year, month, day);
            }
            dayVisible = noteDayOfWeek === targetDayOfWeek;
        } else if(this.repeats === NoteRepeat.Monthly){
            dayVisible = this.day === day;
        } else if(this.repeats === NoteRepeat.Yearly){
            dayVisible = this.month === month && this.day === day;
        } else {
            dayVisible = this.year === year && this.month === month && this.day === day;
        }
        return userVisible && dayVisible;
    }
}
