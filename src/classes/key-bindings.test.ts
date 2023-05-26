/**
 * @jest-environment jsdom
 */
import "../../__mocks__/index";
import KeyBindings from "./key-bindings";
import {updateMainApplication} from "./index";
import MainApp from "./applications/main-app";

describe('KeyBindings Tests', () => {

    beforeEach(()=>{
        updateMainApplication(new MainApp());
    });

    test('register', () => {
        //@ts-ignore
        game.keybindings.register = jest.fn();
        KeyBindings.register();
        //@ts-ignore
        expect(game.keybindings.register).toHaveBeenCalledTimes(1);
    });
});
