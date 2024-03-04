import { MainApplication } from "../index";

// @ts-ignore
export default class MainAppConfigWrapper extends FormApplication {
    constructor() {
        super({});
        //This is a janky way of having the menu button in a configuration dialog open our existing main application.
        // @ts-ignore
        return MainApplication;
    }
}
