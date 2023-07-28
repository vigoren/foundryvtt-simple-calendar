/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import { jest, beforeEach, describe, expect, test } from "@jest/globals";
import { CalManager, MainApplication, SC, updateCalManager, updateMainApplication, updateSC } from "../index";
import CalendarManager from "../calendar/calendar-manager";
import SCController from "../s-c-controller";
import MainApp from "./main-app";
import Calendar from "../calendar";
import MigrationApp from "./migration-app";
import { MigrationTypes } from "../../constants";
import { GameSettings } from "../foundry-interfacing/game-settings";
import V1ToV2 from "../migrations/v1-to-v2";

describe("Migration App Class Tests", () => {
    let tCal: Calendar;
    let ma: MigrationApp;

    beforeEach(async () => {
        updateCalManager(new CalendarManager());
        updateSC(new SCController());
        updateMainApplication(new MainApp());
        tCal = new Calendar("", "");

        jest.spyOn(console, "info").mockImplementation(() => {});
        jest.spyOn(console, "error").mockImplementation(() => {});

        ma = new MigrationApp();
    });

    test("Default Options", () => {
        expect(MigrationApp.defaultOptions).toBeDefined();
    });

    test("Show App", () => {
        jest.spyOn(ma, "render").mockImplementation(() => {});
        ma.showApp();
        expect(ma.render).toHaveBeenCalledTimes(1);
    });

    test("Get Data", () => {
        expect(ma.getData()).toBeDefined();
    });

    test("Heading Title", () => {
        expect(ma.headingTitle).toBe("Migration");
        ma.MigrationType = MigrationTypes.v1To2;
        expect(ma.headingTitle).toBe("FSC.Migration.v1v2.Title");
    });

    test("Description", () => {
        expect(ma.description).toBe("This dialog has not loaded property. Try refreshing the page.");
        ma.MigrationType = MigrationTypes.v1To2;
        expect(ma.description).toBe("FSC.Migration.v1v2.Help");
    });

    test("Initialize", () => {
        //@ts-ignore
        game.user.isGM = true;
        //@ts-ignore
        jest.spyOn(ma, "determineMigrationType").mockImplementation(() => {});
        ma.initialize();
        //@ts-ignore
        expect(ma.determineMigrationType).toHaveBeenCalledTimes(1);
    });

    test("Activate Listeners", () => {
        const app = document.createElement("div");

        jest.spyOn(document, "getElementById").mockReturnValue(app);
        jest.spyOn(app, "querySelector").mockReturnValue(document.createElement("div"));

        //@ts-ignore
        ma.activateListeners({});
        expect(app.querySelector).toHaveBeenCalledTimes(1);
    });

    test("Determine Migration Type", () => {
        const gos = jest.spyOn(GameSettings, "GetObjectSettings").mockReturnValue({});
        //@ts-ignore
        ma.determineMigrationType();
        expect(ma.MigrationType).toBe(MigrationTypes.none);

        gos.mockReturnValue({ a: 1 });
        //@ts-ignore
        ma.determineMigrationType();
        expect(ma.MigrationType).toBe(MigrationTypes.v1To2);
    });

    test("Show Migration", () => {
        expect(ma.showMigration).toBe(false);
        ma.MigrationType = MigrationTypes.v1To2;
        expect(ma.showMigration).toBe(true);
    });

    test("Run", async () => {
        jest.spyOn(ma, "showApp").mockImplementation(() => {});
        const rcm = jest.spyOn(ma, "runCalendarMigration").mockImplementation(() => {
            return false;
        });
        const rnm = jest.spyOn(ma, "runNoteMigration").mockImplementation(async () => {
            return false;
        });
        jest.spyOn(ma, "runCleanData").mockImplementation(async () => {
            return true;
        });
        jest.spyOn(MainApplication, "render").mockImplementation(() => {});

        await ma.run();
        expect(MainApplication.render).toHaveBeenCalledTimes(0);

        rcm.mockReturnValue(true);
        await ma.run();

        rnm.mockImplementation(async () => {
            return true;
        });
        await ma.run();
        expect(MainApplication.render).toHaveBeenCalledTimes(1);

        await ma.run(true);
        expect(MainApplication.render).toHaveBeenCalledTimes(2);
    });

    test("Run Calendar Migration", () => {
        const rcm = jest.spyOn(V1ToV2, "runCalendarMigration").mockImplementation(() => {
            return null;
        });
        const rgcm = jest.spyOn(V1ToV2, "runGlobalConfigurationMigration").mockImplementation(() => {
            return false;
        });
        jest.spyOn(CalManager, "setCalendars").mockImplementation(() => {});
        jest.spyOn(ma, "saveMigratedData").mockImplementation(() => {});

        expect(ma.runCalendarMigration()).toBe(false);

        ma.MigrationType = MigrationTypes.v1To2;
        expect(ma.runCalendarMigration()).toBe(false);
        expect(V1ToV2.runCalendarMigration).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledTimes(2);

        rcm.mockReturnValue(tCal);
        expect(ma.runCalendarMigration()).toBe(false);
        expect(V1ToV2.runCalendarMigration).toHaveBeenCalledTimes(2);
        expect(V1ToV2.runGlobalConfigurationMigration).toHaveBeenCalledTimes(2);
        expect(CalManager.setCalendars).toHaveBeenCalledTimes(1);
        expect(ma.saveMigratedData).toHaveBeenCalledTimes(0);

        rgcm.mockReturnValue(true);
        expect(ma.runCalendarMigration()).toBe(true);
        expect(V1ToV2.runCalendarMigration).toHaveBeenCalledTimes(3);
        expect(V1ToV2.runGlobalConfigurationMigration).toHaveBeenCalledTimes(3);
        expect(CalManager.setCalendars).toHaveBeenCalledTimes(2);
        expect(ma.saveMigratedData).toHaveBeenCalledTimes(1);
    });

    test("Save Migrated Data", () => {
        jest.spyOn(SC, "save").mockImplementation(() => {});
        ma.saveMigratedData();
        expect(SC.save).toHaveBeenCalledTimes(1);
    });

    test("Run Note Migration", async () => {
        jest.spyOn(V1ToV2, "runNoteMigration").mockImplementation(async () => {
            return false;
        });

        expect(await ma.runNoteMigration()).toBe(false);

        ma.MigrationType = MigrationTypes.v1To2;
        expect(await ma.runNoteMigration()).toBe(false);
        //@ts-ignore
        expect(ma.displayData.notesMigrationStatusIcon).toBe("fa-times-circle fsc-error");

        jest.spyOn(V1ToV2, "runNoteMigration").mockImplementation(async () => {
            return true;
        });
        expect(await ma.runNoteMigration()).toBe(true);
        //@ts-ignore
        expect(ma.displayData.notesMigrationStatusIcon).toBe("fa-check-circle fsc-completed");
    });

    test("Run Clean Data", () => {
        const cod = jest.spyOn(V1ToV2, "cleanUpOldData").mockImplementation(async () => {
            return true;
        });
        jest.spyOn(GameSettings, "UiNotification").mockImplementation(() => {});

        ma.MigrationType = MigrationTypes.v1To2;
        ma.runCleanData();
        expect(V1ToV2.cleanUpOldData).toHaveBeenCalledTimes(1);

        cod.mockImplementation(async () => {
            return false;
        });
        ma.runCleanData();
        expect(V1ToV2.cleanUpOldData).toHaveBeenCalledTimes(2);

        cod.mockRejectedValue("asd");
        ma.runCleanData();
        expect(V1ToV2.cleanUpOldData).toHaveBeenCalledTimes(3);
    });
});
