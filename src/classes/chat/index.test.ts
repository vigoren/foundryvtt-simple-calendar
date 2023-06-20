/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import {Chat} from "./index";
import {ChatTimestamp} from "./chat-timestamp";

describe('Chat Tests', () => {

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
