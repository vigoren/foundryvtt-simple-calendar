/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import { jest, beforeEach, describe, expect, test } from "@jest/globals";
import D35E from "./D35E";

describe("Systems/D35E Class Tests", () => {
    test("Is D35E", () => {
        expect(D35E.isD35E).toBe(false);
    });
});
