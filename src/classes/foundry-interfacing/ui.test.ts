/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import Ui from "./ui";

describe('UI Class Tests', () => {

    test('Render Chat Log', () => {
        Ui.renderChatLog();
        //@ts-ignore
        expect(ui.chat.render).toHaveBeenCalledTimes(1);
    });
});
