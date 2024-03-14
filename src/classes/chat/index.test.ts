/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import { jest, beforeEach, describe, expect, test } from "@jest/globals";
import { Chat } from "./index";
import { ChatTimestamp } from "./chat-timestamp";

describe("Chat Tests", () => {
    test("init", () => {
        jest.spyOn(ChatTimestamp, "getFormattedChatTimestamp").mockImplementation(() => {
            return "Game Time:";
        });
        Chat.init();
        const message = ChatMessage.prototype.export();
        expect(message).toContain("Game Time:");
    });

    test("Create Chat Message", async () => {
        let cm = {};
        jest.spyOn(ChatTimestamp, "addGameTimeToMessage").mockImplementation(async () => {
            return <ChatMessage>cm;
        });
        //@ts-ignore
        let rcm = await Chat.createChatMessage(cm);
        //@ts-ignore
        expect(rcm).toBe(cm);
        expect(ChatTimestamp.addGameTimeToMessage).toHaveBeenCalledTimes(1);

        //@ts-ignore
        game.user.isGM = true;
        //@ts-ignore
        rcm = await Chat.createChatMessage(cm, {}, "");
        expect(rcm).toBe(cm);
        expect(ChatTimestamp.addGameTimeToMessage).toHaveBeenCalledTimes(2);
    });

    test("On Render Chat Message", async () => {
        const fQuery = {};
        let cm = {};
        jest.spyOn(ChatTimestamp, "renderTimestamp").mockImplementation(async () => {});

        //@ts-ignore
        await Chat.onRenderChatMessage(cm, fQuery, {});
        expect(ChatTimestamp.renderTimestamp).toHaveBeenCalledTimes(1);
    });
});
