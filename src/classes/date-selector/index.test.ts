/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import { jest, beforeEach, describe, expect, test } from "@jest/globals";

import { DateSelector } from "./index";
import { CalendarClickEvents, DateSelectorPositions } from "../../constants";
import Calendar from "../calendar";
import { CalManager, updateCalManager } from "../index";
import CalendarManager from "../calendar/calendar-manager";
import Renderer from "../renderer";
import * as DateUtils from "../utilities/date-time";

describe("Date Selector Class Tests", () => {
    let tCal: Calendar;
    let ds: DateSelector;

    beforeEach(() => {
        updateCalManager(new CalendarManager());
        tCal = new Calendar("", "");
        jest.spyOn(CalManager, "getActiveCalendar").mockImplementation(() => {
            return tCal;
        });
        ds = new DateSelector("test", {});
    });

    test("Constructor", () => {
        expect(ds.addTime).toBe(false);
        ds = new DateSelector("test", { timeSelected: true });
        expect(ds.addTime).toBe(true);
    });

    test("Apply Options", () => {
        ds.applyOptions({
            calendar: tCal,
            showDateSelector: true,
            showTimeSelector: true,
            showCalendarYear: true,
            onDateSelect: () => {},
            position: DateSelectorPositions.Auto,
            allowDateRangeSelection: true,
            allowTimeRangeSelection: true,
            editYear: true,
            timeDelimiter: "~",
            selectedStartDate: {
                year: 0,
                month: 0,
                day: 0,
                hour: 0,
                minute: 0,
                seconds: 0
            },
            selectedEndDate: {
                year: 0,
                month: 0,
                day: 1,
                hour: 0,
                minute: 0,
                seconds: 0
            },
            timeSelected: true,
            useCloneCalendars: true
        });
        expect(ds.showDateSelector).toBe(true);
        expect(ds.showTimeSelector).toBe(true);
        expect(ds.showCalendarYear).toBe(true);
        expect(ds.allowDateRangeSelection).toBe(true);
        expect(ds.allowTimeRangeSelection).toBe(true);
        expect(ds.editYear).toBe(true);
        expect(ds.selectedDate.allDay).toBe(false);
        expect(ds.useCloneCalendars).toBe(true);
    });

    test("Build", () => {
        jest.spyOn(Renderer.CalendarFull, "Render").mockImplementation(() => {
            return "";
        });
        jest.spyOn(Renderer.TimeSelector, "Render").mockImplementation(() => {
            return "";
        });
        jest.spyOn(DateUtils, "GetDisplayDate").mockImplementation(() => {
            return "";
        });

        expect(ds.build()).toBeDefined();
        expect(Renderer.CalendarFull.Render).toHaveBeenCalledTimes(1);
        expect(Renderer.TimeSelector.Render).toHaveBeenCalledTimes(0);
        expect(DateUtils.GetDisplayDate).toHaveBeenCalledTimes(1);

        ds.showTimeSelector = true;
        expect(ds.build()).toBeDefined();
        expect(Renderer.CalendarFull.Render).toHaveBeenCalledTimes(2);
        expect(Renderer.TimeSelector.Render).toHaveBeenCalledTimes(0);
        expect(DateUtils.GetDisplayDate).toHaveBeenCalledTimes(2);

        ds.addTime = true;
        expect(ds.build(false)).toBeDefined();
        expect(Renderer.CalendarFull.Render).toHaveBeenCalledTimes(3);
        expect(Renderer.TimeSelector.Render).toHaveBeenCalledTimes(1);
        expect(DateUtils.GetDisplayDate).toHaveBeenCalledTimes(3);

        ds.showDateSelector = false;
        expect(ds.build(false)).toBeDefined();
        expect(Renderer.CalendarFull.Render).toHaveBeenCalledTimes(3);
        expect(Renderer.TimeSelector.Render).toHaveBeenCalledTimes(2);
        expect(DateUtils.GetDisplayDate).toHaveBeenCalledTimes(4);

        ds.showDateSelector = true;
        ds.selectedDate.end.year = NaN;
        expect(ds.build()).toBeDefined();
        expect(Renderer.CalendarFull.Render).toHaveBeenCalledTimes(4);
        expect(Renderer.TimeSelector.Render).toHaveBeenCalledTimes(3);
        expect(DateUtils.GetDisplayDate).toHaveBeenCalledTimes(5);
    });

    test("Set Position", () => {
        const elm = document.createElement("div");
        ds.setPosition(elm);
        expect(elm.classList.contains(DateSelectorPositions.Auto)).toBe(true);

        const container = document.createElement("div");
        jest.spyOn(elm, "closest").mockImplementation(() => {
            return container;
        });

        const elmgbcr = jest
            .spyOn(elm, "getBoundingClientRect")
            .mockReturnValue({ top: 0, left: 0, right: 0, bottom: 0, y: 0, x: 0, width: 0, height: 0, toJSON: () => {} });
        jest.spyOn(container, "getBoundingClientRect").mockReturnValue({
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            y: 0,
            x: 0,
            width: 0,
            height: 0,
            toJSON: () => {}
        });

        ds.setPosition(elm);
        expect(elm.classList.contains("left-down")).toBe(true);

        elmgbcr.mockReturnValue({ top: 10, left: 0, right: 10, bottom: 20, y: 0, x: 0, width: 0, height: 5, toJSON: () => {} });
        ds.setPosition(elm);
        expect(elm.classList.contains("right-up")).toBe(true);
    });

    test("Update", () => {
        jest.spyOn(ds, "build").mockImplementation(() => {
            return "";
        });
        jest.spyOn(ds, "setPosition").mockImplementation(() => {});
        ds.update();
        expect(ds.build).toHaveBeenCalledTimes(1);

        const docQSSpy = jest.spyOn(document, "querySelector");
        docQSSpy.mockReturnValue(document.createElement("div"));
        ds.update();
        expect(ds.build).toHaveBeenCalledTimes(2);
        expect(ds.setPosition).toHaveBeenCalledTimes(1);
    });

    test("Activate Listeners", () => {
        ds.activateListeners();

        const html = document.createElement("div");
        const htmlChild = document.createElement("div");
        const qs = jest.spyOn(document, "querySelector").mockImplementation(() => {
            return html;
        });
        const htmlQs = jest.spyOn(html, "querySelector").mockImplementation(() => {
            return null;
        });
        jest.spyOn(htmlChild, "addEventListener").mockImplementation(() => {});

        ds.activateListeners();
        expect(qs).toHaveBeenCalledTimes(1);
        expect(htmlQs).toHaveBeenCalledTimes(2);
        expect(htmlChild.addEventListener).toHaveBeenCalledTimes(0);

        htmlQs.mockReturnValue(htmlChild);
        ds.showTimeSelector = true;
        ds.activateListeners();
        expect(qs).toHaveBeenCalledTimes(2);
        expect(htmlQs).toHaveBeenCalledTimes(6);
        expect(htmlChild.addEventListener).toHaveBeenCalledTimes(4);
    });

    test("Deactivate Listeners", () => {
        const relSpy = jest.spyOn(document, "removeEventListener");
        ds.deactivateListeners();
        expect(relSpy).toHaveBeenCalledTimes(1);
    });

    test("Call On Date Select", () => {
        ds.onDateSelect = jest.fn();
        ds.callOnDateSelect();
        expect(ds.onDateSelect).toHaveBeenCalledTimes(1);

        ds.selectedDate.end.year = NaN;
        ds.callOnDateSelect();
        expect(ds.onDateSelect).toHaveBeenCalledTimes(2);
        expect(ds.selectedDate.end).toEqual(ds.selectedDate.start);
    });

    test("Toggle Calendar", () => {
        const fakeWrapper = document.createElement("div");
        const fwqsSpy = jest.spyOn(fakeWrapper, "querySelector");
        const returnedElement = document.createElement("div");

        ds.toggleCalendar(fakeWrapper, new Event("click"));
        expect(fwqsSpy).toHaveBeenCalledTimes(1);

        fwqsSpy.mockReturnValue(returnedElement);
        ds.toggleCalendar(fakeWrapper, new Event("click"));
        expect(fwqsSpy).toHaveBeenCalledTimes(2);
        expect(returnedElement.style.display).toBe("none");

        ds.toggleCalendar(fakeWrapper, new Event("click"));
        expect(fwqsSpy).toHaveBeenCalledTimes(3);
        expect(returnedElement.style.display).toBe("block");
    });

    test("Hide Calendar", () => {
        const fakeWrapper = document.createElement("div");
        const docSpy = jest.spyOn(document, "getElementById").mockReturnValue(fakeWrapper);
        const fwqsSpy = jest.spyOn(fakeWrapper, "querySelector");
        const returnedElement = document.createElement("div");
        //@ts-ignore
        jest.spyOn(returnedElement, "getClientRects").mockReturnValue([1]);

        ds.hideCalendar();
        expect(fwqsSpy).toHaveBeenCalledTimes(1);

        fwqsSpy.mockReturnValue(returnedElement);
        ds.hideCalendar();
        expect(fwqsSpy).toHaveBeenCalledTimes(2);
        expect(returnedElement.style.display).toBe("none");

        ds.onDateSelect = jest.fn();
        ds.hideCalendar();
        expect(fwqsSpy).toHaveBeenCalledTimes(3);
        expect(ds.onDateSelect).toHaveBeenCalledTimes(1);
    });

    test("Calendar Click", () => {
        const wrapElm = document.createElement("div");
        const ddElm = document.createElement("div");
        jest.spyOn(Renderer.TimeSelector, "HideTimeDropdown").mockImplementation(() => {});
        const gebiSpy = jest.spyOn(document, "getElementById").mockReturnValue(wrapElm);
        //@ts-ignore
        jest.spyOn(wrapElm, "getElementsByClassName").mockReturnValue([ddElm]);

        ds.calendarClick(new Event("click"));
        expect(Renderer.TimeSelector.HideTimeDropdown).toHaveBeenCalledTimes(1);
        expect(document.getElementById).toHaveBeenCalledTimes(1);
        expect(wrapElm.getElementsByClassName).toHaveBeenCalledTimes(1);
        expect(ddElm.classList.contains("hide")).toBe(true);
    });

    test("Day Click", () => {
        jest.spyOn(ds, "update").mockImplementation(() => {});
        jest.spyOn(ds, "callOnDateSelect").mockImplementation(() => {});
        jest.spyOn(Renderer.TimeSelector, "HideTimeDropdown").mockImplementation(() => {});
        ds.allowDateRangeSelection = true;
        ds.dayClick({
            id: "",
            selectedDates: {
                start: { year: 0, month: 0, day: 0 },
                end: { year: 0, month: 0, day: 0 }
            }
        });
        expect(ds.update).not.toHaveBeenCalled();
        expect(ds.callOnDateSelect).not.toHaveBeenCalled();
        expect(Renderer.TimeSelector.HideTimeDropdown).not.toHaveBeenCalled();

        ds.showTimeSelector = true;
        ds.secondDaySelect = false;
        ds.dayClick({
            id: "",
            selectedDates: {
                start: { year: 0, month: 0, day: 0 },
                end: { year: 0, month: 0, day: 0 }
            }
        });
        expect(ds.update).not.toHaveBeenCalled();
        expect(ds.callOnDateSelect).not.toHaveBeenCalled();
        expect(Renderer.TimeSelector.HideTimeDropdown).toHaveBeenCalledTimes(1);

        ds.dayClick({
            id: "",
            selectedDates: {
                start: { year: 0, month: 0, day: 0 },
                end: { year: 0, month: 0, day: 0 }
            }
        });
        expect(ds.update).toHaveBeenCalledTimes(1);
        expect(ds.callOnDateSelect).toHaveBeenCalledTimes(1);
        expect(Renderer.TimeSelector.HideTimeDropdown).toHaveBeenCalledTimes(1);

        ds.secondDaySelect = true;
        ds.dayClick({
            id: "",
            selectedDates: {
                start: { year: 0, month: 0, day: 0 },
                end: { year: 0, month: 0, day: 0 }
            }
        });
        expect(ds.update).toHaveBeenCalledTimes(2);
        expect(ds.callOnDateSelect).toHaveBeenCalledTimes(2);
        expect(Renderer.TimeSelector.HideTimeDropdown).toHaveBeenCalledTimes(1);

        ds.secondDaySelect = false;
        ds.allowDateRangeSelection = false;
        ds.dayClick({
            id: "",
            selectedDates: {
                start: { year: 0, month: 0, day: 0 },
                end: { year: 0, month: 0, day: 0 }
            }
        });
        expect(ds.update).toHaveBeenCalledTimes(3);
        expect(ds.callOnDateSelect).toHaveBeenCalledTimes(3);
        expect(Renderer.TimeSelector.HideTimeDropdown).toHaveBeenCalledTimes(1);
    });

    test("Change Month Click", () => {
        jest.spyOn(ds, "update").mockImplementation(() => {});
        jest.spyOn(Renderer.TimeSelector, "HideTimeDropdown").mockImplementation(() => {});

        ds.changeMonthClick(CalendarClickEvents.next, { id: "", date: { year: 0, month: 0, day: 0 } });
        expect(ds.update).toHaveBeenCalledTimes(1);
        expect(Renderer.TimeSelector.HideTimeDropdown).not.toHaveBeenCalled();

        ds.showTimeSelector = true;
        ds.changeMonthClick(CalendarClickEvents.next, { id: "", date: { year: 0, month: 0, day: 0 } });
        expect(ds.update).toHaveBeenCalledTimes(2);
        expect(Renderer.TimeSelector.HideTimeDropdown).toHaveBeenCalledTimes(1);
    });

    test("Change Year", () => {
        jest.spyOn(ds, "update").mockImplementation(() => {});
        jest.spyOn(Renderer.TimeSelector, "HideTimeDropdown").mockImplementation(() => {});

        ds.changeYear({ id: "", date: { year: 0, month: 0, day: 0 } });
        expect(ds.update).toHaveBeenCalledTimes(1);
        expect(Renderer.TimeSelector.HideTimeDropdown).not.toHaveBeenCalled();

        ds.showTimeSelector = true;
        ds.changeYear({ id: "", date: { year: 0, month: 0, day: 0 } });
        expect(ds.update).toHaveBeenCalledTimes(2);
        expect(Renderer.TimeSelector.HideTimeDropdown).toHaveBeenCalledTimes(1);
    });

    test("Add Time Click", () => {
        const updateSpy = jest.spyOn(ds, "update").mockImplementation(() => {});
        ds.addTimeClick(new Event("click"));
        expect(ds.addTime).toBe(true);
        expect(updateSpy).toHaveBeenCalledTimes(1);
    });

    test("Remove Time Click", () => {
        const updateSpy = jest.spyOn(ds, "update").mockImplementation(() => {});
        ds.removeTimeClick(new Event("click"));
        expect(ds.addTime).toBe(false);
        expect(updateSpy).toHaveBeenCalledTimes(1);
    });

    test("Time Change", () => {
        jest.spyOn(ds, "update").mockImplementation(() => {});
        jest.spyOn(ds, "callOnDateSelect").mockImplementation(() => {});

        ds.timeChange({ id: "", selectedTime: { start: { hour: 0, minute: 0, seconds: 0 }, end: { hour: 0, minute: 0, seconds: 0 } } });
        expect(ds.update).toHaveBeenCalledTimes(1);
        expect(ds.callOnDateSelect).not.toHaveBeenCalled();
        expect(ds.selectedDate.start.hour).toBe(0);
        expect(ds.selectedDate.start.minute).toBe(0);
        expect(ds.selectedDate.end.hour).toBe(0);
        expect(ds.selectedDate.end.minute).toBe(0);

        ds.showTimeSelector = true;
        ds.showDateSelector = false;
        ds.timeChange({ id: "", selectedTime: { start: { hour: 1, minute: 2, seconds: 3 }, end: { hour: 0, minute: 1, seconds: 6 } } });
        expect(ds.update).toHaveBeenCalledTimes(2);
        expect(ds.callOnDateSelect).toHaveBeenCalledTimes(1);
        expect(ds.selectedDate.start.hour).toBe(1);
        expect(ds.selectedDate.start.minute).toBe(2);
        expect(ds.selectedDate.end.hour).toBe(1);
        expect(ds.selectedDate.end.minute).toBe(2);
    });
});
