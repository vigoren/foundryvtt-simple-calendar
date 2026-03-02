import { ApplicationV2 } from "./application-v2";

function HandlebarsApplicationMixin(Base: typeof ApplicationV2) {
    // @ts-ignore
    class HandlebarsApplication extends Base {
        static PARTS: Record<string, any> = {};

        _attachPartListeners(partId: string, htmlElement: HTMLElement, options: any) {}
    }
    return HandlebarsApplication;
}

// @ts-ignore
if (!global.foundry) global.foundry = {};
// @ts-ignore
if (!global.foundry.applications) global.foundry.applications = {};
// @ts-ignore
if (!global.foundry.applications.api) global.foundry.applications.api = {};
// @ts-ignore
global.foundry.applications.api.HandlebarsApplicationMixin = HandlebarsApplicationMixin;
// @ts-ignore
global.HandlebarsApplicationMixin = HandlebarsApplicationMixin;

export { HandlebarsApplicationMixin };
