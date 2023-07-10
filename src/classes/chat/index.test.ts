/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import {jest, beforeEach, describe, expect, test} from '@jest/globals';
import {Chat} from "./index";
import {ChatTimestamp} from "./chat-timestamp";

describe('Chat Tests', () => {

    test('init', ()=>{
        jest.spyOn(ChatTimestamp, 'getFormattedChatTimestamp').mockImplementation(() => {return 'Game Time:'});
        Chat.init();
        const message = ChatMessage.prototype.export();
        expect(message).toContain('Game Time:');
    });

    test('Create Chat Message', () => {
        let cm = {};
        jest.spyOn(ChatTimestamp, 'addGameTimeToMessage').mockImplementation(() => {})

        //@ts-ignore
        expect(Chat.createChatMessage(cm, {}, '')).toBe(true);
        expect(ChatTimestamp.addGameTimeToMessage).toHaveBeenCalledTimes(0);

        //@ts-ignore
        game.user.isGM = true;
        //@ts-ignore
        expect(Chat.createChatMessage(cm, {}, '')).toBe(true);
        expect(ChatTimestamp.addGameTimeToMessage).toHaveBeenCalledTimes(1);
    });

    test('On Render Chat Message', () => {
        const fQuery = {};
        let cm = {};
        jest.spyOn(ChatTimestamp, 'renderTimestamp').mockImplementation(() => {})

        //@ts-ignore
        Chat.onRenderChatMessage(cm, fQuery, {});
        expect(ChatTimestamp.renderTimestamp).toHaveBeenCalledTimes(1);
    });

});
