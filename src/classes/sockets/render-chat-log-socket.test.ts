/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import { jest, beforeEach, describe, expect, test } from "@jest/globals";
import Calendar from "../calendar";
import RenderChatLogSocket from "./render-chat-log-socket";
import { SocketTypes } from "../../constants";
import Ui from "../foundry-interfacing/ui";

describe("Render Chat Log Socket Tests", () => {
    let tCal: Calendar;
    let s: RenderChatLogSocket;

    beforeEach(() => {
        tCal = new Calendar("", "");
        s = new RenderChatLogSocket();
    });

    test("Process", async () => {
        jest.spyOn(Ui, "renderChatLog").mockImplementation(() => {});
        let r = await s.process({ type: SocketTypes.dateTimeChange, data: false });
        expect(r).toBe(false);
        expect(Ui.renderChatLog).not.toHaveBeenCalled();

        r = await s.process({ type: SocketTypes.renderChatLog, data: false });
        expect(r).toBe(true);
        expect(Ui.renderChatLog).not.toHaveBeenCalled();

        r = await s.process({ type: SocketTypes.renderChatLog, data: true });
        expect(r).toBe(true);
        expect(Ui.renderChatLog).toHaveBeenCalledTimes(1);
    });
});
