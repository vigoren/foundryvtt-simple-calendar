import { ApplicationV2 } from "./application-v2";

// @ts-ignore
class DocumentSheetV2 extends ApplicationV2 {
    document: any;

    constructor(options?: any) {
        super(options);
        this.document = options?.document || {};
    }

    get isEditable() {
        return true;
    }
}

// @ts-ignore
if (!global.foundry) global.foundry = {};
// @ts-ignore
if (!global.foundry.applications) global.foundry.applications = {};
// @ts-ignore
if (!global.foundry.applications.api) global.foundry.applications.api = {};
// @ts-ignore
global.foundry.applications.api.DocumentSheetV2 = DocumentSheetV2;
// @ts-ignore
global.DocumentSheetV2 = DocumentSheetV2;

export { DocumentSheetV2 };
