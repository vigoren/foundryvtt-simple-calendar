import { ModuleName } from "../constants";
import { MainApplication } from "./index";

export default class KeyBindings {
    public static register() {
        (<Game>game).keybindings.register(ModuleName, "toggleMainApp", {
            name: "FSC.KeyBinding.Toggle.Title",
            hint: "FSC.KeyBinding.Toggle.Hint",
            editable: [
                {
                    key: "Z",
                    modifiers: []
                }
            ],
            onDown: MainApplication.toggleWindow.bind(MainApplication),
            precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
        });
    }
}
