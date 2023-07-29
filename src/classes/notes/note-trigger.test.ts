/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import { jest, beforeEach, describe, expect, test } from "@jest/globals";
import { NoteTrigger } from "./note-trigger";

describe("Note Trigger Class Tests", () => {
    const onFireFunction = jest.fn(() => {
        return true;
    });
    let nt: NoteTrigger;

    beforeEach(() => {
        nt = new NoteTrigger(onFireFunction, true);
    });

    test("Fire", () => {
        onFireFunction.mockReturnValue(true);
        //@ts-ignore
        nt.fire({});
        expect(onFireFunction).toHaveBeenCalledTimes(1);

        //@ts-ignore
        nt.fire({});
        expect(onFireFunction).toHaveBeenCalledTimes(1);
    });
});
