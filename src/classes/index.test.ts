/**
 * @jest-environment jsdom
 */
import "../../__mocks__/index";
import { jest, beforeEach, describe, expect, test } from "@jest/globals";
import {
    CalManager,
    ConfigurationApplication,
    MainApplication,
    MigrationApplication,
    NManager,
    SC,
    updateCalManager,
    updateConfigurationApplication,
    updateMainApplication,
    updateMigrationApplication,
    updateNManager,
    updateSC
} from "./index";
import CalendarManager from "./calendar/calendar-manager";
import MainApp from "./applications/main-app";
import ConfigurationApp from "./applications/configuration-app";
import MigrationApp from "./applications/migration-app";
import SCController from "./s-c-controller";
import NoteManager from "./notes/note-manager";

describe("Classes Root Tests", () => {
    test("Update Cal Manager", () => {
        const cm = new CalendarManager();
        expect(CalManager).toBeUndefined();
        updateCalManager(cm);
        expect(CalManager).toStrictEqual(cm);
    });

    test("Update Main Application", () => {
        const cm = new MainApp();
        expect(MainApplication).toBeUndefined();
        updateMainApplication(cm);
        expect(MainApplication).toStrictEqual(cm);
    });

    test("Update Configuration Application", () => {
        const cm = new ConfigurationApp();
        expect(ConfigurationApplication).toBeUndefined();
        updateConfigurationApplication(cm);
        expect(ConfigurationApplication).toStrictEqual(cm);
    });

    test("Update Migration Application", () => {
        const cm = new MigrationApp();
        expect(MigrationApplication).toBeUndefined();
        updateMigrationApplication(cm);
        expect(MigrationApplication).toStrictEqual(cm);
    });

    test("Update SC", () => {
        const cm = new SCController();
        expect(SC).toBeUndefined();
        updateSC(cm);
        expect(SC).toStrictEqual(cm);
    });

    test("Update Note Manager", () => {
        const cm = new NoteManager();
        expect(NManager).toBeUndefined();
        updateNManager(cm);
        expect(NManager).toStrictEqual(cm);
    });
});
