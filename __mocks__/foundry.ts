//@ts-ignore
import { jest } from "@jest/globals";

// @ts-ignore
const foundryUtils: any = {
    getRoute: (a: string) => {
        return a;
    },
    randomID: () => {
        return "";
    },
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
    isEmpty: () => {}
};

//@ts-ignore
global.foundry = {
    utils: foundryUtils
};
