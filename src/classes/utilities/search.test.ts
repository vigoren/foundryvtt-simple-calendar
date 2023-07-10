import {BM25Levenshtein} from "./search";
import {jest, beforeEach, describe, expect, test} from '@jest/globals';

describe('Utility Search Tests', () => {
    const docs = [
        {id: '1', content: 'This is a test'},
        {id: '2', content: ['This is another test','with weirdness']},
        {id: '3', content: 'The quick brown fox jumps over the lazy dog'},
        {id: '4', content: '"The quick brown fox jumps over the lazy dog" is an English-language pangram—a sentence that contains all of the letters of the English alphabet. Owing to its brevity and coherence, it has become widely known. The phrase is commonly used for touch-typing practice, testing typewriters and computer keyboards, displaying examples of fonts, and other applications involving text where the use of all letters in the alphabet is desired.'}
    ];

    test('Constructor/Add Document/ Calculate IDF', () => {
        let bm25 = new BM25Levenshtein(docs);

        //@ts-ignore
        expect(Object.keys(bm25.documents).length).toBe(4);
        //@ts-ignore
        expect(Object.keys(bm25.terms).length).toBe(42);
        //@ts-ignore
        expect(bm25.totalDocumentTermCount).toBe(49);
        //@ts-ignore
        expect(bm25.averageDocumentTermCount ).toBe(12.25);
    });

    test('Search', () => {
        let bm25 = new BM25Levenshtein(docs);

        expect(bm25.search('quick')).toEqual(['3', '4']);
        expect(bm25.search('test')).toEqual(['1', '2', '4']);
        expect(bm25.search('lasy')).toEqual(['3', '4']);
    });

});
