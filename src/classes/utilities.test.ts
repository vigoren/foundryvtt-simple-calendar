import Utilities from "./utilities";

describe('Utilities Class Tests', () => {

    test('Random Hash', () => {
        expect(Utilities.randomHash('')).toBe(0);
        expect(Utilities.randomHash('asd')).not.toBe(0);
    });

    test('Ordinal Suffix', () => {
        expect(Utilities.ordinalSuffix(0)).toBe('th');
        expect(Utilities.ordinalSuffix(1)).toBe('st');
        expect(Utilities.ordinalSuffix(2)).toBe('nd');
        expect(Utilities.ordinalSuffix(3)).toBe('rd');
        expect(Utilities.ordinalSuffix(4)).toBe('th');
        expect(Utilities.ordinalSuffix(5)).toBe('th');
        expect(Utilities.ordinalSuffix(6)).toBe('th');
        expect(Utilities.ordinalSuffix(7)).toBe('th');
        expect(Utilities.ordinalSuffix(8)).toBe('th');
        expect(Utilities.ordinalSuffix(9)).toBe('th');
        expect(Utilities.ordinalSuffix(10)).toBe('th');
        expect(Utilities.ordinalSuffix(11)).toBe('th');
        expect(Utilities.ordinalSuffix(12)).toBe('th');
        expect(Utilities.ordinalSuffix(13)).toBe('th');
        expect(Utilities.ordinalSuffix(14)).toBe('th');
        expect(Utilities.ordinalSuffix(21)).toBe('st');
        expect(Utilities.ordinalSuffix(22)).toBe('nd');
        expect(Utilities.ordinalSuffix(23)).toBe('rd');
        expect(Utilities.ordinalSuffix(111)).toBe('th');
        expect(Utilities.ordinalSuffix(112)).toBe('th');
        expect(Utilities.ordinalSuffix(113)).toBe('th');
    });
});
