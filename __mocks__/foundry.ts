//@ts-ignore
import { jest } from "@jest/globals";

global.foundry = {
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
