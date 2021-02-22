import {NoteConfig, NoteTemplate} from "../interfaces";
import {GameSettings} from "./game-settings"

export class Note{
    id: string;
    year: number = 0;
    month: number = 0;
    monthDisplay: string = '';
    day: number = 0;

    title: string = '';
    content: string = '';
    author: string = '';

    playerVisible: boolean = false;

    constructor() {
        this.id = window.crypto.getRandomValues(new Uint32Array(1))[0].toString(16)
    }

    toTemplate(): NoteTemplate {
        return {
            title: this.title,
            content: this.content,
            author: this.author,
            monthDisplay: this.monthDisplay,
            id: this.id
        };
    }

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
    }

    clone(): Note {
        const n = new Note();
        n.year = this.year;
        n.month = this.month;
        n.day = this.day;
        n.monthDisplay = this.monthDisplay;
        n.title = this.title;
        n.content = this.content;
        n.author = this.author;
        n.playerVisible = this.playerVisible;
        n.id = this.id;
        return n;
    }

    isVisible(year: number, month: number ,day: number){
        return (GameSettings.IsGm() || (!GameSettings.IsGm() && this.playerVisible)) && this.year === year && this.month === month && this.day === day;
    }
}
