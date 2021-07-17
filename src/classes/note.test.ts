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
import {LeapYearRules, NoteRepeat} from "../constants";
import SimpleCalendar from "./simple-calendar";
import Year from "./year";
import Month from "./month";
import {Weekday} from "./weekday";


describe('Note Tests', () => {
    let n: Note;

    beforeEach(() => {
        n = new Note();
        n.year = 0;
        n.month = 1;
        n.day = 2;
        n.endDate = {
            year: 0,
            month: 1,
            day: 2,
            hour: 0,
            minute: 0,
            seconds: 0
        };
        n.monthDisplay = '';
        n.title = '';
        n.content = '';
        n.author = '';
        n.playerVisible = false;
        n.id = "abc123";
        n.categories.push('cat');
    });

    test('Properties', () => {
        expect(Object.keys(n).length).toBe(17); //Make sure no new properties have been added
        expect(n.year).toBe(0);
        expect(n.month).toBe(1);
        expect(n.day).toBe(2);
        expect(n.hour).toBe(0);
        expect(n.minute).toBe(0);
        expect(n.allDay).toBe(true);
        expect(n.monthDisplay).toBe('');
        expect(n.title).toBe('');
        expect(n.content).toBe('');
        expect(n.author).toBe('');
        expect(n.playerVisible).toBe(false);
        expect(n.id).toBe('abc123');
        expect(n.repeats).toBe(NoteRepeat.Never);
        expect(n.endDate).toStrictEqual({ year: 0, month: 1, day: 2, hour: 0, minute: 0, seconds: 0});
        expect(n.categories).toStrictEqual(['cat']);
        expect(n.order).toBe(0);
    });

    test('Initialize', () => {
        n.initialize(1,2,3,'name');
        expect(n.year).toBe(1);
        expect(n.month).toBe(2);
        expect(n.day).toBe(3);
        expect(n.endDate.year).toBe(1);
        expect(n.endDate.month).toBe(2);
        expect(n.endDate.day).toBe(3);
        expect(n.monthDisplay).toBe('name');
    });

    test('To Template', () => {
        SimpleCalendar.instance = new SimpleCalendar();
        SimpleCalendar.instance.noteCategories.push({name: 'cat', color: '#fff', textColor: '#000'})

        let c = n.toTemplate();
        expect(Object.keys(c).length).toBe(15); //Make sure no new properties have been added
        expect(c.title).toBe('');
        expect(c.content).toBe('');
        expect(c.playerVisible).toBe(false);
        expect(c.author).toBe('');
        expect(c.authorDisplay).toBe(null);
        expect(c.monthDisplay).toBe('');
        expect(c.id).toBe('abc123');
        expect(c.allDay).toBe(true);
        expect(c.displayDate).toBe('');
        expect(c.hour).toBe(0);
        expect(c.minute).toBe(0);
        expect(c.endDate).toStrictEqual({ year: 0, month: 1, day: 2, hour: 0, minute: 0, seconds: 0});
        expect(c.order).toBe(0);
        expect(c.categories).toStrictEqual([{name: 'cat', color: '#fff', textColor: '#000'}]);

        n.author = 'test';
        const orig = (<Game>game).users;
        //@ts-ignore
        (<Game>game).users = [{id: 'test', name: 'name', data: {}}];
        n.endDate.hour = 1;
        n.endDate.minute = 2;
        c = n.toTemplate();
        expect(c.authorDisplay).toStrictEqual({name: 'name', color: '', textColor: '#000000'});
        expect(c.endDate).toStrictEqual({ year: 0, month: 1, day: 2, hour: 1, minute: 2, seconds: 0});

        //@ts-ignore
        (<Game>game).users = [{id: 'test', name: 'name', data: {color: "#ffffff"}}];
        c = n.toTemplate();
        expect(c.authorDisplay).toStrictEqual({name: 'name', color: '#ffffff', textColor: '#000000'});

        (<Game>game).users = orig;

        const uOrig = (<Game>game).user;
        //@ts-ignore
        (<Game>game).user = {id: 'asd'};

        c = n.toTemplate();
        expect(c.reminder).toBe(false);
        n.remindUsers = ['asd'];
        c = n.toTemplate();
        expect(c.reminder).toBe(true);

        //@ts-ignore
        (<Game>game).user = uOrig;
    });

    test('Load From Config', () => {
        let config: NoteConfig = {
            year: 1,
            month: 2,
            day: 3,
            monthDisplay: 'j',
            playerVisible: true,
            author: 'a',
            title: 't',
            content: 'c',
            id: 'i',
            repeats: 1,
            allDay: true,
            hour: 0,
            minute: 0,
            endDate: {
                year: 1,
                month: 2,
                day: 3,
                hour: 1,
                minute: 2,
                seconds: 0
            },
            order: 0,
            categories: [],
            remindUsers: []
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
        expect(n.repeats).toBe(1);
        expect(n.allDay).toBe(true);
        expect(n.hour).toBe(0);
        expect(n.minute).toBe(0);
        expect(n.endDate).toStrictEqual({ year: 1, month: 2, day: 3, hour: 1, minute: 2, seconds: 0});
        expect(n.order).toBe(0);
        expect(n.categories).toStrictEqual([]);

        //@ts-ignore
        config = {
            year: 2,
            month: 3,
            day: 4,
            monthDisplay: 'md',
            playerVisible: true,
            author: 'a',
            title: 't',
            content: 'c',
            id: 'i',
            repeats: 1
        };
        n.loadFromConfig(config);
        expect(n.year).toBe(2);
        expect(n.month).toBe(3);
        expect(n.day).toBe(4);
        expect(n.monthDisplay).toBe('md');
        expect(n.allDay).toBe(true);
        expect(n.hour).toBe(0);
        expect(n.minute).toBe(0);
        expect(n.endDate).toStrictEqual({ year: 2, month: 3, day: 4, hour: 0, minute: 0, seconds: 0});
        expect(n.order).toBe(0);
        expect(n.categories).toStrictEqual([]);
    });

    test('Clone', () => {
        expect(n.clone()).toStrictEqual(n);
    });

    test('Is Visible', () => {
        SimpleCalendar.instance = new SimpleCalendar()
        const y = new Year(0);
        SimpleCalendar.instance.currentYear = y;
        y.months.push(new Month('M', 1, 0, 20));
        y.months.push(new Month('T', 2, 0, 20));
        y.months.push(new Month('W', 3, 0, 20));
        expect(n.isVisible(0,0,0)).toBe(false);
        expect(n.isVisible(0,1,2)).toBe(false);
        n.playerVisible = true;
        expect(n.isVisible(0,1,2)).toBe(true);
        //@ts-ignore
        game.user.isGM = true;
        expect(n.isVisible(0,0,0)).toBe(false);
        expect(n.isVisible(0,1,2)).toBe(true);

        n.repeats = NoteRepeat.Monthly;
        expect(n.isVisible(99,99,1)).toBe(false);
        expect(n.isVisible(99,2,2)).toBe(true);
        n.month = 2;
        n.day = 18;
        n.endDate.month = 3;
        n.endDate.day = 3;
        expect(n.isVisible(99,1,1)).toBe(true);
        expect(n.isVisible(99,3,19)).toBe(true);
        expect(n.isVisible(99,3,10)).toBe(false);
        n.endDate.month = 123;
        expect(n.isVisible(99,3,10)).toBe(false);
        SimpleCalendar.instance = new SimpleCalendar();
        expect(n.isVisible(99,3,10)).toBe(false);

        SimpleCalendar.instance.currentYear = y;
        n.year = 0;
        n.month = 1;
        n.day = 2;
        n.endDate.year = 0;
        n.endDate.month = 1;
        n.endDate.day = 2;
        n.repeats = NoteRepeat.Yearly;
        expect(n.isVisible(99,0,0)).toBe(false);
        expect(n.isVisible(99,1,2)).toBe(true);
        n.year = 1;
        n.month = 3;
        n.day = 18;
        n.endDate.year = 2;
        n.endDate.month = 1;
        n.endDate.day = 2
        expect(n.isVisible(99,1,1)).toBe(true);
        expect(n.isVisible(99,3,19)).toBe(true);
        expect(n.isVisible(99,3,10)).toBe(false);
        SimpleCalendar.instance = new SimpleCalendar();
        expect(n.isVisible(99,3,10)).toBe(false);

        n.year = 0;
        n.month = 1;
        n.day = 2;
        n.endDate.year = 0;
        n.endDate.month = 1;
        n.endDate.day = 2;
        n.repeats = NoteRepeat.Weekly;
        SimpleCalendar.instance = new SimpleCalendar();
        expect(n.isVisible(0,0,0)).toBe(false);
        expect(n.isVisible(0,1,2)).toBe(false);

        SimpleCalendar.instance.currentYear = new Year(0);
        SimpleCalendar.instance.currentYear.months.push(new Month('J', 1, 0, 31));
        SimpleCalendar.instance.currentYear.months.push(new Month('F', 2, 0, 28));
        SimpleCalendar.instance.currentYear.weekdays.push(new Weekday(1, 'S'));
        SimpleCalendar.instance.currentYear.weekdays.push(new Weekday(2, 'M'));
        SimpleCalendar.instance.currentYear.weekdays.push(new Weekday(3, 'T'));
        SimpleCalendar.instance.currentYear.weekdays.push(new Weekday(4, 'W'));
        SimpleCalendar.instance.currentYear.weekdays.push(new Weekday(5, 'T'));
        SimpleCalendar.instance.currentYear.weekdays.push(new Weekday(6, 'F'));
        SimpleCalendar.instance.currentYear.weekdays.push(new Weekday(7, 'S'));
        expect(n.isVisible(0,0,0)).toBe(false);
        expect(n.isVisible(0,1,1)).toBe(false);
        expect(n.isVisible(0,1,2)).toBe(true);
        expect(n.isVisible(0,1,3)).toBe(false);
        expect(n.isVisible(0,1,4)).toBe(false);
        expect(n.isVisible(0,1,5)).toBe(false);
        expect(n.isVisible(0,1,6)).toBe(false);
        expect(n.isVisible(0,1,7)).toBe(false);
        expect(n.isVisible(0,1,8)).toBe(false);
        expect(n.isVisible(0,1,9)).toBe(true);
        expect(n.isVisible(0,1,16)).toBe(true);
        expect(n.isVisible(0,1,23)).toBe(true);
        expect(n.isVisible(0,1,30)).toBe(true);
        expect(n.isVisible(0,1,19)).toBe(false);
        expect(n.isVisible(0,2,1)).toBe(false);
        expect(n.isVisible(0,2,2)).toBe(false);
        expect(n.isVisible(0,2,3)).toBe(false);
        expect(n.isVisible(0,2,4)).toBe(false);
        expect(n.isVisible(0,2,5)).toBe(false);
        expect(n.isVisible(0,2,6)).toBe(true);
        expect(n.isVisible(0,2,7)).toBe(false);

        n.endDate.day = 4;
        expect(n.isVisible(0,0,0)).toBe(false);
        expect(n.isVisible(0,1,1)).toBe(false);
        expect(n.isVisible(0,1,2)).toBe(true);
        expect(n.isVisible(0,1,3)).toBe(true);
        expect(n.isVisible(0,1,4)).toBe(true);
        expect(n.isVisible(0,1,5)).toBe(false);
        expect(n.isVisible(0,1,6)).toBe(false);
        expect(n.isVisible(0,1,7)).toBe(false);
        expect(n.isVisible(0,1,8)).toBe(false);
        expect(n.isVisible(0,1,9)).toBe(true);
        expect(n.isVisible(0,1,16)).toBe(true);
        expect(n.isVisible(0,1,17)).toBe(true);
        expect(n.isVisible(0,1,18)).toBe(true);
        expect(n.isVisible(0,1,23)).toBe(true);
        expect(n.isVisible(0,1,24)).toBe(true);
        expect(n.isVisible(0,1,25)).toBe(true);
        expect(n.isVisible(0,1,30)).toBe(true);
        expect(n.isVisible(0,1,31)).toBe(true);
        expect(n.isVisible(0,2,1)).toBe(true);
        expect(n.isVisible(0,2,2)).toBe(false);
        expect(n.isVisible(0,2,3)).toBe(false);
        expect(n.isVisible(0,2,4)).toBe(false);
        expect(n.isVisible(0,2,5)).toBe(false);
        expect(n.isVisible(0,2,6)).toBe(true);
        expect(n.isVisible(0,2,7)).toBe(true);
        expect(n.isVisible(0,2,8)).toBe(true);
        expect(n.isVisible(0,2,9)).toBe(false);

        n.day = 6;
        n.endDate.day = 9;

        expect(n.isVisible(0,0,0)).toBe(true);
        expect(n.isVisible(0,1,1)).toBe(true);
        expect(n.isVisible(0,1,2)).toBe(true);
        expect(n.isVisible(0,1,3)).toBe(false);
        expect(n.isVisible(0,1,4)).toBe(false);
        expect(n.isVisible(0,1,5)).toBe(false);
        expect(n.isVisible(0,1,6)).toBe(true);
        expect(n.isVisible(0,1,7)).toBe(true);
        expect(n.isVisible(0,1,8)).toBe(true);
        expect(n.isVisible(0,1,9)).toBe(true);
        expect(n.isVisible(0,1,10)).toBe(false);
        expect(n.isVisible(0,1,11)).toBe(false);
    });

    test('Display', () => {
        SimpleCalendar.instance = new SimpleCalendar();
        expect(n.display()).toBe('');
        const y = new Year(0);
        SimpleCalendar.instance.currentYear = y;
        y.months.push(new Month('M', 1, 0, 20));
        y.months.push(new Month('T', 2, 0, 20));
        y.months.push(new Month('W', 3, 0, 18));
        y.months[0].current = true;
        y.months[0].days[0].current = true;
        expect(n.display()).toBe('M 2, 0');
        y.months[0].current = false;
        y.months[0].days[0].current = false;
        y.months[0].selected = true;
        y.months[0].days[1].selected = true;
        expect(n.display()).toBe('M 2, 0');
        n.month = 123;
        n.endDate.month = 123;
        expect(n.display()).toBe(' 2, 0');

        n.month = 1;
        n.endDate.month = 1;
        n.repeats = NoteRepeat.Yearly;
        expect(n.display()).toBe('M 2, 0');
        n.year = 0;
        n.month = 3;
        n.day = 17;
        n.endDate.year = 1;
        n.endDate.month = 1;
        n.endDate.day = 3;
        expect(n.display()).toBe('W 17, -1 - M 3, 0');
        y.months[0].selected = false;
        y.months[0].days[1].selected = false;
        y.months[2].selected = true;
        y.months[2].days[0].selected = true;
        expect(n.display()).toBe('W 17, 0 - M 3, 1');
        y.months[2].days[0].selected = false;
        y.months[2].days[17].selected = true;
        expect(n.display()).toBe('W 17, 0 - M 3, 1');

        y.months[2].selected = false;
        y.months[2].days[17].selected = false;
        y.months[0].selected = true;
        y.months[0].days[0].selected = true;
        n.repeats = NoteRepeat.Monthly;
        n.month = 1;
        n.day = 2;
        n.endDate.year = 0;
        n.endDate.month = 1;
        n.endDate.day = 3;
        expect(n.display()).toBe('M 2, 0 - M 3, 0');
        n.day = 15;
        n.endDate.day = 20;
        y.months[0].selected = false;
        y.months[0].days[0].selected = false;
        y.months[2].selected = true;
        y.months[2].days[0].selected = true;
        expect(n.display()).toBe('W 15, 0 - W 18, 0');
        y.leapYearRule.rule = LeapYearRules.Custom;
        y.leapYearRule.customMod = 1;
        expect(n.display()).toBe('W 15, 0 - W 18, 0');
        n.day = 19;
        expect(n.display()).toBe('W 18, 0');
        y.leapYearRule.rule = LeapYearRules.None;
        expect(n.display()).toBe('W 18, 0');
        y.resetMonths('selected');
        n.month = 1;
        n.day = 15;
        n.endDate.month = 2;
        n.endDate.day = 3;
        y.months[1].selected = true;
        y.months[1].days[0].selected = true;
        expect(n.display()).toBe('M 15, 0 - T 3, 0');
        y.resetMonths('selected');
        y.months[0].selected = true;
        y.months[0].days[0].selected = true;
        expect(n.display()).toBe('W 15, -1 - M 3, 0');
        y.months[0].days[0].selected = false;
        y.months[0].days[14].selected = true;
        expect(n.display()).toBe('M 15, 0 - T 3, 0');
        y.resetMonths('selected');
        y.months[2].selected = true;
        y.months[2].days[14].selected = true;
        expect(n.display()).toBe('W 15, 0 - M 3, 1');
        y.resetMonths('selected');
        y.months[2].selected = true;
        y.months[2].days[9].selected = true;
        expect(n.display()).toBe('W 15, 0 - W 3, 0');

        y.resetMonths('selected');
        y.months[0].selected = true;
        y.months[0].days[0].selected = true;
        y.weekdays.push(new Weekday(1, 'S'));
        y.weekdays.push(new Weekday(2, 'M'));
        y.weekdays.push(new Weekday(3, 'T'));
        y.weekdays.push(new Weekday(4, 'W'));
        y.weekdays.push(new Weekday(5, 'T'));
        y.weekdays.push(new Weekday(6, 'F'));
        y.weekdays.push(new Weekday(7, 'S'));
        n.repeats = NoteRepeat.Weekly;
        n.year = 0;
        n.month = 1;
        n.day = 2;
        n.endDate.year = 0;
        n.endDate.month = 1;
        n.endDate.day = 3;
        expect(n.display()).toBe('M 2, 0 - M 3, 0');
        n.day = 5;
        n.endDate.day = 9;
        expect(n.display()).toBe('W 16, -1 - M 2, 0');
        y.resetMonths('selected');
        y.months[1].selected = true;
        y.months[1].days[0].selected = true;
        expect(n.display()).toBe('M 19, 0 - T 3, 0');
        y.months[1].days[0].selected = false;
        y.months[1].days[15].selected = true;
        expect(n.display()).toBe('T 13, 0 - T 17, 0');
        y.months[1].days[15].selected = false;
        y.months[1].days[19].selected = true;
        expect(n.display()).toBe('T 20, 0 - W 4, 0');
        y.resetMonths('selected');
        y.visibleYear = 1;
        y.months[2].selected = true;
        y.months[2].days[17].selected = true;
        expect(n.display()).toBe('T 18, 1 - M 5, 2');
        y.resetMonths('selected');
        n.endDate.day = 10;
        y.visibleYear = 4;
        y.months[0].selected = true;
        y.months[0].days[0].selected = true;
        expect(n.display()).toBe('W 15, 3 - M 2, 4');
    });
});
