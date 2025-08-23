//@ts-ignore
import { jest } from "@jest/globals";

class DraggableMock {
    handlers = {
        dragMove: [],
        dragUp: []
    };

    static get implementation() {
        return DraggableMock;
    }

    constructor() {
    }
}

class ApplicationV2 {
    static _maxZ: number;
}

global.foundry = {
    //@ts-ignore
    applications: {
        api: {
            //@ts-ignore
            ApplicationV2: ApplicationV2,
        },
        //@ts-ignore
        handlebars: {
            renderTemplate: (template: string, options?: object) => Promise.resolve(""),
        },
        ux: {
            //@ts-ignore
            Draggable: DraggableMock,
        }
    },
    documents: {
        collections: {
            //@ts-ignore
            Journal: {
                registerSheet: jest.fn(),
                showDialog: async () => {}
            },
        }
    },
    //@ts-ignore
    utils: {
        getRoute: (a: string) => {
            return a;
        },
        randomID: () => {
            return "";
        },
        //@ts-ignore
        mergeObject: jest.fn(
            (
                original: {},
                other?: any,
                options?: {
                    insertKeys: boolean;
                    insertValues: boolean;
                    overwrite: boolean;
                    recursive: boolean;
                    inplace: boolean;
                    enforceTypes: boolean;
                    performDeletions: boolean;
                },
                _d?: number
            ) => {
                return { target: { offsetHeight: 0 } };
            }
        ),
        //@ts-ignore
        isEmpty: () => {}
    }
};
