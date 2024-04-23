/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import { jest, beforeEach, describe, expect, test } from "@jest/globals";
import { foundryGetRoute, foundryMergeObject } from "./utilities";

describe("Foundry Utilities Class Tests", () => {
    test("foundryMergeObject", () => {
        const original = foundry.utils.mergeObject;
        //@ts-ignore
        foundry.utils.mergeObject = null;
        let result = foundryMergeObject({}, {});
        expect(mergeObject).toHaveBeenCalledTimes(1);

        //@ts-ignore
        foundry.utils.mergeObject = original;
        result = foundryMergeObject({}, {});
        expect(foundry.utils.mergeObject).toHaveBeenCalledTimes(1);
    });

    test("foundryGetRoute", () => {
        const originalUtil = foundry.utils.getRoute;
        const original = getRoute;
        //@ts-ignore
        foundry.utils.getRoute = null;
        //@ts-ignore
        getRoute = jest.fn();
        let result = foundryGetRoute("test");
        expect(getRoute).toHaveBeenCalledTimes(1);

        //@ts-ignore
        foundry.utils.getRoute = jest.fn();
        result = foundryGetRoute("test");
        expect(foundry.utils.getRoute).toHaveBeenCalledTimes(1);

        //@ts-ignore
        foundry.utils.getRoute = originalUtil;
        //@ts-ignore
        getRoute = original;
    });
});
