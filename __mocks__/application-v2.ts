import { jest } from "@jest/globals";

// @ts-ignore
class ApplicationV2 {
    static DEFAULT_OPTIONS = {
        id: "",
        classes: [],
        tag: "div",
        window: {
            title: "",
            icon: "",
            resizable: false,
            minimizable: true
        },
        position: {
            width: "auto",
            height: "auto"
        },
        actions: {}
    };

    static PARTS: Record<string, any> = {};

    options: any;
    position: any = {};
    tabGroups: Record<string, string> = {};

    constructor(options?: any) {
        this.options = Object.assign({}, (this.constructor as any).DEFAULT_OPTIONS, options);
        this.position = { ...(this.options.position || {}) };
    }

    get rendered() {
        return true;
    }

    get id() {
        return this.options.id || "";
    }

    get title() {
        return this.options.window?.title || "";
    }

    get element(): HTMLElement {
        return document.createElement("div");
    }

    render(options?: any) {
        return Promise.resolve();
    }

    close(options?: any) {
        return Promise.resolve();
    }

    setPosition(pos?: any) {}

    bringToTop() {}

    _prepareContext(options?: any) {
        return Promise.resolve({});
    }

    _onRender(context: any, options: any) {}

    _onFirstRender(context: any, options: any) {}

    _renderFrame(options: any) {
        return Promise.resolve(document.createElement("div"));
    }

    _preClose(options?: any) {
        return Promise.resolve();
    }

    _onClose(options?: any) {}

    _onPosition(pos?: any) {}

    async saveEditor(name: string) {}

    static async _onAction(event: Event, target: HTMLElement) {}
}

// @ts-ignore
if (!global.foundry) global.foundry = {};
// @ts-ignore
if (!global.foundry.applications) global.foundry.applications = {};
// @ts-ignore
if (!global.foundry.applications.api) global.foundry.applications.api = {};
// @ts-ignore
global.foundry.applications.api.ApplicationV2 = ApplicationV2;

// @ts-ignore
global.ApplicationV2 = ApplicationV2;

export { ApplicationV2 };
