/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import { jest, beforeEach, describe, expect, test } from "@jest/globals";
import PF1E from "./pf1e";

describe("Systems/PF1E Class Tests", () => {
    test("Is PF1E", () => {
        expect(PF1E.isPF1E).toBe(false);
    });
});
