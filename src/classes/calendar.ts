import Year from "./year";
import {Note} from "./note";
import {NoteCategory} from "../interfaces";

export default class Calendar{
    public year: Year;

    /**
     * List of all notes in the calendar
     * @type {Array.<Note>}
     */
    public notes: Note[] = [];

    public noteCategories: NoteCategory[] = [];

    constructor(year: Year) {
        this.year = year;
    }
}
