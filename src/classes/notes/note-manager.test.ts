/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import { jest, beforeEach, describe, expect, test } from "@jest/globals";

import Calendar from "../calendar";
import { CalManager, MainApplication, NManager, updateCalManager, updateMainApplication, updateNManager } from "../index";
import CalendarManager from "../calendar/calendar-manager";
import MainApp from "../applications/main-app";
import NoteManager from "./note-manager";
import GameSockets from "../foundry-interfacing/game-sockets";
import { NoteTrigger } from "./note-trigger";
import * as DateUtil from "../utilities/date-time";
import { DateRangeMatch } from "../../constants";

describe("Note Manager Class Tests", () => {
    let tCal: Calendar;

    beforeEach(async () => {
        updateCalManager(new CalendarManager());
        updateMainApplication(new MainApp());
        updateNManager(new NoteManager());
        tCal = new Calendar("", "");
        jest.spyOn(CalManager, "getActiveCalendar").mockImplementation(() => {
            return tCal;
        });

        //@ts-ignore
        game.user.isGM = false;
    });

    test("Initialize", async () => {
        jest.spyOn(NManager, "registerNoteSheets").mockImplementation(() => {});
        jest.spyOn(NManager, "createJournalDirectory").mockImplementation(async () => {});
        jest.spyOn(NManager, "loadNotes").mockImplementation(async () => {});

        await NManager.initialize();

        expect(NManager.registerNoteSheets).toHaveBeenCalledTimes(1);
        expect(NManager.createJournalDirectory).toHaveBeenCalledTimes(1);
        expect(NManager.loadNotes).toHaveBeenCalledTimes(1);
    });

    test("Register Note Sheets", () => {
        NManager.registerNoteSheets();
        expect(Journal.registerSheet).toHaveBeenCalledTimes(1);
    });

    test("Create Journal Directory", async () => {
        await NManager.createJournalDirectory();
        expect(NManager.noteDirectory).toBeUndefined();

        //@ts-ignore
        game.user.isGM = true;
        await NManager.createJournalDirectory();
        expect(NManager.noteDirectory).toBeUndefined();
    });

    test("Add New Note", async () => {
        jest.spyOn(NManager, "createNote").mockImplementation(async () => {
            return null;
        });
        jest.spyOn(tCal, "getDateTime").mockImplementation(() => {
            return { year: 0, month: 0, day: 0, hour: 0, minute: 0, seconds: 0 };
        });
        await NManager.addNewNote(tCal, "");
        expect(NManager.createNote).toHaveBeenCalledTimes(1);
        expect(tCal.getDateTime).toHaveBeenCalledTimes(1);
    });

    test("Create Note", async () => {
        const noteData = {
            calendarId: tCal.id,
            startDate: { year: 0, month: 0, day: 0, hour: 0, minute: 0, seconds: 0 },
            endDate: { year: 0, month: 0, day: 0, hour: 0, minute: 0, seconds: 0 },
            allDay: false,
            repeats: 0,
            order: 0,
            categories: [],
            remindUsers: []
        };

        const jec = jest.spyOn(JournalEntry, "create").mockImplementation(async () => {
            return undefined;
        });
        jest.spyOn(MainApplication, "updateApp").mockImplementation(() => {});

        expect(await NManager.createNote("", "", noteData, tCal, false, false)).toBeNull();
        expect(MainApplication.updateApp).not.toHaveBeenCalled();

        //@ts-ignore
        jec.mockReturnValue({ createEmbeddedDocuments: async () => {}, pages: { contents: [] } });
        //@ts-ignore
        game.user.id = "asd";
        expect(await NManager.createNote("", "", noteData, tCal)).toBeDefined();

        tCal.generalSettings.noteDefaultVisibility = false;
        expect(await NManager.createNote("", "", noteData, tCal)).toBeDefined();
    });

    test("Journal Entry Update", () => {
        const fEntry = {
            getFlag: () => {
                return { calendarId: "a" };
            }
        };

        jest.spyOn(NManager, "addNoteStub").mockImplementation(() => {});
        jest.spyOn(NManager, "removeNoteStub").mockImplementation(() => {});
        jest.spyOn(MainApplication, "updateApp").mockImplementation(() => {});

        //@ts-ignore
        NManager.journalEntryUpdate(0, fEntry);
        expect(NManager.addNoteStub).toHaveBeenCalledTimes(1);

        //@ts-ignore
        NManager.journalEntryUpdate(1, fEntry);
        expect(MainApplication.updateApp).toHaveBeenCalledTimes(1);

        //@ts-ignore
        NManager.journalEntryUpdate(2, fEntry);
        expect(NManager.removeNoteStub).toHaveBeenCalledTimes(1);
    });

    test("Add Note Stub", () => {
        //@ts-ignore
        expect(Object.keys(NManager.notes).length).toBe(0);
        //@ts-ignore
        NManager.addNoteStub({ id: "" }, "asd");
        //@ts-ignore
        expect(Object.keys(NManager.notes).length).toBe(1);
    });

    test("Remove Note Stub", () => {
        //@ts-ignore
        NManager.notes["asd"] = [{ entryId: "ns1" }];
        const je = {
            id: "ns1",
            getFlag: () => {
                return { calendarId: "asd" };
            }
        };

        //@ts-ignore
        expect(NManager.notes["asd"].length).toBe(1);
        //@ts-ignore
        NManager.removeNoteStub(je);
        //@ts-ignore
        expect(NManager.notes["asd"].length).toBe(0);
    });

    test("Load Notes / Load Notes From Folder", async () => {
        const je = {
            id: "ns1",
            getFlag: () => {
                return { calendarId: "asd" };
            },
            pages: {
                contents: []
            },
            createEmbeddedDocuments: async () => {}
        };
        //@ts-ignore
        NManager.noteDirectory = { id: "nd", contents: [je] };

        jest.spyOn(NManager, "addNoteStub").mockImplementation(() => {});
        await NManager.loadNotes();
        expect(NManager.addNoteStub).toHaveBeenCalledTimes(1);

        //@ts-ignore
        const oldF = game.journal.directory.folders;
        //@ts-ignore
        game.journal.directory.folders = [{ folder: { id: "nd" }, contents: [] }];

        await NManager.loadNotes();
        expect(NManager.addNoteStub).toHaveBeenCalledTimes(2);

        //@ts-ignore
        game.journal.directory.folders = oldF;
    });

    test("Show Note", () => {
        const je = {
            sheet: {
                rendered: false,
                render: jest.fn(),
                bringToTop: jest.fn()
            }
        };
        //@ts-ignore
        jest.spyOn(game.journal, "get").mockImplementation(() => {
            return je;
        });

        NManager.showNote("");
        expect(je.sheet.render).toHaveBeenCalledTimes(1);
        expect(je.sheet.bringToTop).toHaveBeenCalledTimes(0);

        je.sheet.rendered = true;
        NManager.showNote("");
        expect(je.sheet.render).toHaveBeenCalledTimes(1);
        expect(je.sheet.bringToTop).toHaveBeenCalledTimes(1);
    });

    test("Get Note Stub", () => {
        const je = {
            id: "ns1",
            getFlag: jest.fn().mockReturnValue({ calendarId: "asd" }).mockReturnValueOnce(null)
        };
        //@ts-ignore
        NManager.notes["asd"] = [{ entryId: "ns1" }];

        //@ts-ignore
        expect(NManager.getNoteStub(je)).toBeUndefined();

        //@ts-ignore
        expect(NManager.getNoteStub(je)).toBeDefined();
    });

    test("Get Notes", () => {
        expect(NManager.getNotes("asd")).toEqual([]);

        //@ts-ignore
        NManager.notes["asd"] = [
            //@ts-ignore
            {
                canUserView: () => {
                    return true;
                }
            }
        ];
        expect(NManager.getNotes("asd").length).toBe(1);
    });

    test("Get Notes For Day", () => {
        expect(NManager.getNotesForDay("asd", 0, 0, 0)).toEqual([]);

        //@ts-ignore
        NManager.notes["asd"] = [
            //@ts-ignore
            {
                isVisible: () => {
                    return true;
                }
            }
        ];
        expect(NManager.getNotesForDay("asd", 0, 0, 0).length).toBe(1);
    });

    test("Get Note Count For Day", () => {
        expect(NManager.getNoteCountsForDay("asd", 0, 0, 0)).toEqual({ count: 0, reminderCount: 0 });

        //@ts-ignore
        NManager.notes["asd"] = [
            //@ts-ignore
            {
                userReminderRegistered: false,
                isVisible: () => {
                    return true;
                }
            },
            //@ts-ignore
            {
                userReminderRegistered: true,
                isVisible: () => {
                    return true;
                }
            }
        ];
        expect(NManager.getNoteCountsForDay("asd", 0, 0, 0)).toEqual({ count: 1, reminderCount: 1 });
    });

    test("Order Notes On Day", async () => {
        const nmgn = jest.spyOn(NManager, "getNotesForDay").mockImplementation(() => {
            return [];
        });
        jest.spyOn(GameSockets, "emit").mockImplementation(async () => {
            return true;
        });

        await NManager.orderNotesOnDay("asd", [], { year: 0, month: 0, day: 0, hour: 0, minute: 0, seconds: 0 });
        expect(NManager.getNotesForDay).toHaveBeenCalledTimes(1);
        expect(GameSockets.emit).toHaveBeenCalledTimes(1);

        //@ts-ignore
        nmgn.mockReturnValueOnce([
            //@ts-ignore
            { entryId: "ns1", setOrder: async () => {} },
            //@ts-ignore
            { entryId: "ns2", setOrder: async () => {} }
        ]);
        await NManager.orderNotesOnDay("asd", ["ns2", "ns1"], { year: 0, month: 0, day: 0, hour: 0, minute: 0, seconds: 0 });
        expect(NManager.getNotesForDay).toHaveBeenCalledTimes(2);
        expect(GameSockets.emit).toHaveBeenCalledTimes(2);
    });

    test("Day Note Sort", () => {
        const n1 = { noteData: { order: 0, startDate: { hour: 0, minute: 0 } } },
            n2 = { noteData: { order: 0, startDate: { hour: 0, minute: 1 } } };

        //@ts-ignore
        expect(NoteManager.dayNoteSort(n1, { noteData: null })).toBe(0);
        //@ts-ignore
        expect(NoteManager.dayNoteSort(n1, n2)).toBe(-1);
    });

    test("Note Triggered", () => {
        jest.spyOn(tCal, "getCurrentDate").mockReturnValue({ year: 2022, month: 4, day: 19, seconds: 3600 });
        const ns = {
            noteData: {
                allDay: true,
                startDate: { hour: 2, minute: 0, seconds: 0 },
                endDate: { hour: 4, minute: 0, seconds: 0 }
            },
            isVisible: () => {
                return true;
            }
        };

        //@ts-ignore
        expect(NManager.noteTriggered(ns, tCal)).toBe(true);

        ns.noteData.allDay = false;
        jest.spyOn(DateUtil, "IsDayBetweenDates")
            .mockReturnValueOnce(DateRangeMatch.Start)
            .mockReturnValueOnce(DateRangeMatch.Middle)
            .mockReturnValueOnce(DateRangeMatch.End)
            .mockReturnValueOnce(DateRangeMatch.Exact);

        //@ts-ignore
        expect(NManager.noteTriggered(ns, tCal)).toBe(false);

        //@ts-ignore
        expect(NManager.noteTriggered(ns, tCal)).toBe(true);

        //@ts-ignore
        expect(NManager.noteTriggered(ns, tCal)).toBe(true);

        ns.noteData.startDate.hour = 1;
        //@ts-ignore
        expect(NManager.noteTriggered(ns, tCal)).toBe(true);
    });

    test("Check Note Triggers", () => {
        jest.spyOn(CalManager, "getCalendar").mockImplementation(() => {
            return tCal;
        });
        jest.spyOn(NManager, "noteTriggered").mockReturnValue(true);

        const triggerFunction = jest.fn(() => {
            return true;
        });
        const nt = new NoteTrigger(triggerFunction, true);
        //@ts-ignore
        NManager.notes["asd"] = [
            {
                userReminderRegistered: false,
                isVisible: () => {
                    return true;
                },
                triggers: [nt],
                //@ts-ignore
                noteData: { allDay: true }
            },
            {
                userReminderRegistered: true,
                isVisible: () => {
                    return true;
                },
                triggers: [nt],
                //@ts-ignore
                noteData: { allDay: false, startDate: { hour: 0, minute: 0, seconds: 0 } }
            }
        ];

        NManager.checkNoteTriggers("asd");
        expect(triggerFunction).toHaveBeenCalledTimes(1);

        nt.fired = false;

        NManager.checkNoteTriggers("asd", true);
        expect(triggerFunction).toHaveBeenCalledTimes(2);
    });

    test("Search Notes", () => {
        //@ts-ignore
        NManager.notes["asd"] = [
            {
                canUserView: () => {
                    return true;
                },
                title: "test",
                fullDisplayDate: "",
                //@ts-ignore
                categories: [{ name: "c1" }],
                pages: [{ name: "", type: "text", text: { content: "" } }]
            }
        ];

        expect(NManager.searchNotes("asd", "test", { title: true, details: true, date: true, author: true, categories: true }).length).toBe(1);
    });
});
