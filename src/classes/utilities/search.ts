/**
 * A custom implementation of the Okapi BM25 search method.
 * BM25 is great for matching whole words but not partial's of words
 * This has been customized so that if the term does not exist
 *  - A check is fun to do a partial match on each term (eg 'key' matches 'keyword')
 *  - A Levenshtein Distance search is run to provide a fuzzy results score ('keyward' matches 'keyword')
 */
export class BM25Levenshtein {
    /**
     * Value used to tune term saturation (before the number of times a term is mentioned stops increasing the score)
     * Typically falls between 1.2 and 2. Lower is quicker saturation
     * @private
     */
    private k1 = 1.3;
    /**
     * Value used to tune field length normalization (so shorter and longer content are valued more equally)
     * Ranges from 0 to 1. 1 is full normalization, 0 is no normalization
     * @private
     */
    private b = 0.75;
    /**
     * The total number of terms across all documents
     * @private
     */
    private totalDocumentTermCount = 0;
    /**
     * The average number of terms per document
     * @private
     */
    private averageDocumentTermCount = 0;
    /**
     * The processed documents being searched
     * @private
     */
    private documents: Record<string, SimpleCalendar.Search.ProcessedDocument> = {};
    /**
     * A list of terms found across all documents
     * @private
     */
    private terms: Record<string, SimpleCalendar.Search.Term> = {};
    /**
     * A list of words that are very common and are not considered relevant to calculating a score.
     * @private
     */
    private stopWords: string[] = [
        "a",
        "about",
        "above",
        "after",
        "again",
        "against",
        "all",
        "am",
        "an",
        "and",
        "any",
        "are",
        "aren't",
        "as",
        "at",
        "be",
        "because",
        "been",
        "before",
        "being",
        "below",
        "between",
        "both",
        "but",
        "by",
        "can't",
        "cannot",
        "could",
        "couldn't",
        "did",
        "didn't",
        "do",
        "does",
        "doesn't",
        "doing",
        "don't",
        "down",
        "during",
        "each",
        "few",
        "for",
        "from",
        "further",
        "had",
        "hadn't",
        "has",
        "hasn't",
        "have",
        "haven't",
        "having",
        "he",
        "he'd",
        "he'll",
        "he's",
        "her",
        "here",
        "here's",
        "hers",
        "herself",
        "him",
        "himself",
        "his",
        "how",
        "how's",
        "i",
        "i'd",
        "i'll",
        "i'm",
        "i've",
        "if",
        "in",
        "into",
        "is",
        "isn't",
        "it",
        "it's",
        "its",
        "itself",
        "let's",
        "me",
        "more",
        "most",
        "mustn't",
        "my",
        "myself",
        "no",
        "nor",
        "not",
        "of",
        "off",
        "on",
        "once",
        "only",
        "or",
        "other",
        "ought",
        "our",
        "ours",
        "ourselves",
        "out",
        "over",
        "own",
        "same",
        "shan't",
        "she",
        "she'd",
        "she'll",
        "she's",
        "should",
        "shouldn't",
        "so",
        "some",
        "such",
        "than",
        "that",
        "that's",
        "the",
        "their",
        "theirs",
        "them",
        "themselves",
        "then",
        "there",
        "there's",
        "these",
        "they",
        "they'd",
        "they'll",
        "they're",
        "they've",
        "this",
        "those",
        "through",
        "to",
        "too",
        "under",
        "until",
        "up",
        "very",
        "was",
        "wasn't",
        "we",
        "we'd",
        "we'll",
        "we're",
        "we've",
        "were",
        "weren't",
        "what",
        "what's",
        "when",
        "when's",
        "where",
        "where's",
        "which",
        "while",
        "who",
        "who's",
        "whom",
        "why",
        "why's",
        "with",
        "won't",
        "would",
        "wouldn't",
        "you",
        "you'd",
        "you'll",
        "you're",
        "you've",
        "your",
        "yours",
        "yourself",
        "yourselves"
    ];

    constructor(documents: SimpleCalendar.Search.Document[]) {
        documents.forEach((d) => {
            return this.addDocument(d);
        });
        this.calculateIdf();
    }

    private addDocument(doc: SimpleCalendar.Search.Document) {
        const docContent = Array.isArray(doc.content) ? doc.content.join(" ") : doc.content;
        const docTokens = this.tokenize(docContent);
        const internalDocument: SimpleCalendar.Search.ProcessedDocument = {
            id: doc.id,
            content: docContent.toLowerCase(),
            score: 0,
            terms: {},
            tokens: docTokens,
            termCount: docTokens.length
        };
        this.totalDocumentTermCount += docTokens.length;
        for (let i = 0; i < docTokens.length; i++) {
            const term = docTokens[i];
            if (!internalDocument.terms[term]) {
                internalDocument.terms[term] = {
                    count: 0,
                    freq: 0
                };
            }
            internalDocument.terms[term].count++;
        }
        for (const k in internalDocument.terms) {
            internalDocument.terms[k].freq = internalDocument.terms[k].count / internalDocument.termCount;
            // Inverse Document Frequency initialization
            if (!this.terms[k]) {
                this.terms[k] = {
                    n: 0, // Number of docs this term appears in, uniquely
                    idf: 0
                };
            }

            this.terms[k].n++;
        }
        this.documents[internalDocument.id] = internalDocument;
        this.averageDocumentTermCount = this.totalDocumentTermCount / Object.keys(this.documents).length;
    }

    /**
     * Calculates the Inverse Document Frequency (IDF) for each term across all documents
     * IDF - The rarer a word is the higher its value in being searched
     * @private
     */
    private calculateIdf() {
        const totalDocuments = Object.keys(this.documents).length;
        for (const k in this.terms) {
            this.terms[k].idf = Math.max(Math.log10((totalDocuments - this.terms[k].n + 0.5) / (this.terms[k].n + 0.5)), 0.01);
        }
    }

    private static _min(d0: number, d1: number, d2: number, bx: number, ay: number) {
        return d0 < d1 || d2 < d1 ? (d0 > d2 ? d2 + 1 : d0 + 1) : bx === ay ? d1 : d1 + 1;
    }

    /**
     * Runs a distance calculation to determine how many character changes are needed for string A to match string B
     * @param a
     * @param b
     * @private
     */
    private static levenshteinDistance(a: string, b: string) {
        if (a.length > b.length) {
            const tmp = a;
            a = b;
            b = tmp;
        }

        let la = a.length;
        let lb = b.length;

        while (la > 0 && a.charCodeAt(la - 1) === b.charCodeAt(lb - 1)) {
            la--;
            lb--;
        }

        let offset = 0;

        while (offset < la && a.charCodeAt(offset) === b.charCodeAt(offset)) {
            offset++;
        }

        la -= offset;
        lb -= offset;

        if (la === 0 || lb < 3) {
            return lb;
        }

        let x = 0;
        let y;
        let d0;
        let d1;
        let d2;
        let d3;
        let dd = 1000;
        let dy;
        let ay;
        let bx0;
        let bx1;
        let bx2;
        let bx3;

        const vector: number[] = [];

        for (y = 0; y < la; y++) {
            vector.push(y + 1);
            vector.push(a.charCodeAt(offset + y));
        }

        const len = vector.length - 1;

        for (; x < lb - 3; ) {
            bx0 = b.charCodeAt(offset + (d0 = x));
            bx1 = b.charCodeAt(offset + (d1 = x + 1));
            bx2 = b.charCodeAt(offset + (d2 = x + 2));
            bx3 = b.charCodeAt(offset + (d3 = x + 3));
            dd = x += 4;
            for (y = 0; y < len; y += 2) {
                dy = vector[y];
                ay = vector[y + 1];
                d0 = BM25Levenshtein._min(dy, d0, d1, bx0, ay);
                d1 = BM25Levenshtein._min(d0, d1, d2, bx1, ay);
                d2 = BM25Levenshtein._min(d1, d2, d3, bx2, ay);
                dd = BM25Levenshtein._min(d2, d3, dd, bx3, ay);
                vector[y] = dd;
                d3 = d2;
                d2 = d1;
                d1 = d0;
                d0 = dy;
            }
        }

        for (; x < lb; ) {
            bx0 = b.charCodeAt(offset + (d0 = x));
            dd = ++x;
            for (y = 0; y < len; y += 2) {
                dy = vector[y];
                vector[y] = dd = BM25Levenshtein._min(dy, d0, dd, bx0, vector[y + 1]);
                d0 = dy;
            }
        }

        return dd;
    }

    /**
     * Normalizes text into an array of words
     * @param text
     */
    public tokenize(text: string) {
        return text
            .toLowerCase()
            .replace(/\r?\n|\r/g, " ")
            .trim()
            .split(" ")
            .filter((w) => {
                return this.stopWords.indexOf(w) === -1;
            });
    }

    public search(query: string) {
        const queryTerms = this.tokenize(query);
        const results = [];

        for (const k in this.documents) {
            this.documents[k].score = 0;

            for (let i = 0; i < queryTerms.length; i++) {
                const queryTerm = queryTerms[i];

                //Term is in the document and global terms
                if (this.terms[queryTerm] && this.documents[k].terms[queryTerm]) {
                    //Score the document
                    // IDF * (TF * (k1 + 1)) / (TF + k1 * (1 - b + b * docLength / avgDocLength))
                    const denom =
                        this.documents[k].terms[queryTerm].count +
                        this.k1 * (1 - this.b + (this.b * this.documents[k].termCount) / this.averageDocumentTermCount);
                    this.documents[k].score += (this.terms[queryTerm].idf * (this.documents[k].terms[queryTerm].count * (this.k1 + 1))) / denom;
                } else {
                    //Check to see if there is a partial match
                    const partialScore = Object.keys(this.documents[k].terms).filter((t) => {
                        return t.indexOf(queryTerm) !== -1;
                    }).length;
                    //Do a fuzzy check to see if there are additional matches
                    const fuzzyScore = Object.keys(this.documents[k].terms)
                        .map((t) => {
                            return BM25Levenshtein.levenshteinDistance(t, queryTerm) / 3;
                        })
                        .filter((a) => {
                            return a < 1;
                        })
                        .reduce((s, a) => {
                            return s + (1 - a);
                        }, 0);
                    this.documents[k].score += partialScore * 0.00125 + fuzzyScore * 0.0025;
                }
            }

            if (!isNaN(this.documents[k].score) && this.documents[k].score > 0) {
                results.push(this.documents[k]);
            }
        }

        results.sort(function (a, b) {
            return b.score - a.score;
        });
        return results.map((r) => {
            return r.id;
        });
    }
}
