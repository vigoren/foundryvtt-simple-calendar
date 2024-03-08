/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import { jest, beforeEach, describe, expect, test } from "@jest/globals";
import { updateCalManager, updateMainApplication, updateSC } from "../index";
import CalendarManager from "../calendar/calendar-manager";
import SCController from "../s-c-controller";
import MainApp from "./main-app";
import MainAppConfigWrapper from "./main-app-config-wrapper";

describe("Main App Config Wrapper Class Tests", () => {
    const mainApp = new MainApp();
    let mainAppConfigWrapper: MainAppConfigWrapper;

    beforeEach(async () => {
        updateCalManager(new CalendarManager());
        updateSC(new SCController());
        updateMainApplication(mainApp);
        mainAppConfigWrapper = new MainAppConfigWrapper();
    });

    test("Constructor", () => {
        expect(mainApp).not.toBeUndefined();
        expect(mainAppConfigWrapper).toBe(mainApp);
    });
});
