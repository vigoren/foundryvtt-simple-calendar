/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import {jest, beforeEach, describe, expect, test} from '@jest/globals';

import RendererUtilities from "./utilities";
import NoteStub from "../notes/note-stub";

describe('Renderer Utilities Class Tests', () => {
    test('Generate Note Icon Title', () => {
        //@ts-ignore
        const notes: NoteStub[] = [ {title: 'Note 1'},  {title: "MOre' Note's"}, {title: 'Note 2'} ];

        expect(RendererUtilities.GenerateNoteIconTitle(1, notes)).toBe('1 ');
        notes.pop();
        expect(RendererUtilities.GenerateNoteIconTitle(1, notes)).toBe(':\nNote 1\nMOre\' Note\'s');
    });
});
