import {NoteTemplate} from "../interfaces";

export class Note{
    year: number;
    month: number;
    day: number;

    title: string;
    content: string;
    author: string;

    constructor(year: number, month: number, day: number, title: string = '', content: string = '', author: string = '') {
        this.year = year;
        this.month = month;
        this.day = day;
        this.title = title;
        this.content = content;
        this.author = author;
    }

    toTemplate(): NoteTemplate {
        return {
            year: this.year,
            month: this.month,
            day: this.day,
            title: this.title,
            content: this.content,
            author: this.author
        };
    }

    clone(): Note {
        return new Note(this.year, this.month, this.day, this.title, this.content, this.author);
    }
}
