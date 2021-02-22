/**
 * @jest-environment jsdom
 */
import "../../__mocks__/game";
import "../../__mocks__/form-application";
import "../../__mocks__/application";
import "../../__mocks__/handlebars";
import "../../__mocks__/event";
import "../../__mocks__/crypto";

import {Note} from "./note";
import {NoteConfig} from "../interfaces";


describe('Note Tests', () => {
    let n: Note;

    beforeEach(() => {
        n = new Note();
        n.year = 0;
        n.month = 1;
        n.day = 2;
        n.monthDisplay = '';
        n.title = '';
        n.content = '';
        n.author = '';
        n.playerVisible = false;
        n.id = "abc123";
    });

    test('Properties', () => {
        expect(Object.keys(n).length).toBe(9); //Make sure no new properties have been added
        expect(n.year).toBe(0);
        expect(n.month).toBe(1);
        expect(n.day).toBe(2);
        expect(n.monthDisplay).toBe('');
        expect(n.title).toBe('');
        expect(n.content).toBe('');
        expect(n.author).toBe('');
        expect(n.playerVisible).toBe(false);
        expect(n.id).toBe('abc123');
    });

    test('To Template', () => {
        const c = n.toTemplate();
        expect(Object.keys(c).length).toBe(5); //Make sure no new properties have been added
        expect(c.monthDisplay).toBe('');
        expect(c.title).toBe('');
        expect(c.content).toBe('');
        expect(c.author).toBe('');
        expect(c.id).toBe('abc123');
    });

    test('Load From Config', () => {
        const config: NoteConfig = {
            year: 1,
            month: 2,
            day: 3,
            monthDisplay: 'j',
            playerVisible: true,
            author: 'a',
            title: 't',
            content: 'c',
            id: 'i'
        };
        n.loadFromConfig(config);
        expect(n.year).toBe(1);
        expect(n.month).toBe(2);
        expect(n.day).toBe(3);
        expect(n.monthDisplay).toBe('j');
        expect(n.title).toBe('t');
        expect(n.content).toBe('c');
        expect(n.author).toBe('a');
        expect(n.playerVisible).toBe(true);
        expect(n.id).toBe('i');
    });

    test('Clone', () => {
        expect(n.clone()).toStrictEqual(n);
    });

    test('Is Visible', () => {
        expect(n.isVisible(0,0,0)).toBe(false);
        expect(n.isVisible(0,1,2)).toBe(false);
        n.playerVisible = true;
        expect(n.isVisible(0,1,2)).toBe(true);
        //@ts-ignore
        game.user.isGM = true;
        expect(n.isVisible(0,0,0)).toBe(false);
        expect(n.isVisible(0,1,2)).toBe(true);
    });
});
