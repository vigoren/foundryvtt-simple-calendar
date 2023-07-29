import { GameSettings } from "../foundry-interfacing/game-settings";

/**
 * Generates a random hash string that is cryptographically strong
 * @return {string}
 */
export function generateUniqueId() {
    return window.crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
}

/**
 * Generates a random numeric value based on the passed in string.
 * @param {string} value The string to hash
 * @return {number} The number representing the hash value
 */
export function randomHash(value: string) {
    let hash = 0;
    if (value.length === 0) {
        return hash;
    }
    for (let i = 0; i < value.length; i++) {
        const char = value.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

/**
 * Returns the ordinal suffix for the passed in number
 * @param {number} n The number to get the suffix for
 */
export function ordinalSuffix(n: number): string {
    return (
        [
            undefined,
            GameSettings.Localize("FSC.OrdinalSuffix.st"),
            GameSettings.Localize("FSC.OrdinalSuffix.nd"),
            GameSettings.Localize("FSC.OrdinalSuffix.rd")
        ][(n % 100 >> 3) ^ 1 && n % 10] || GameSettings.Localize("FSC.OrdinalSuffix.th")
    );
}

/**
 * Compares 2 Semantic version strings to see which one is greater than the other.
 * @param {string} v1 The first version string
 * @param {string} v2 The second version string
 * @returns {number} 1: v1 > v2; 0: v1 = v2; -1: v1 < v2
 */
export function compareSemanticVersions(v1: string, v2: string) {
    const a = v1.split("."),
        b = v2.split("."),
        len = Math.max(a.length, b.length);

    for (let i = 0; i < len; i++) {
        if ((a[i] && !b[i] && parseInt(a[i]) > 0) || parseInt(a[i]) > parseInt(b[i])) {
            return 1;
        } else if ((b[i] && !a[i] && parseInt(b[i]) > 0) || parseInt(a[i]) < parseInt(b[i])) {
            return -1;
        }
    }

    return 0;
}

/**
 * Adds zero padding to the front of numbers
 * @param num
 * @param zeroPadding
 */
export function PadNumber(num: number, zeroPadding: number = 1) {
    if (num < Math.pow(10, zeroPadding)) {
        const zeros = zeroPadding - ((Math.log(num) * Math.LOG10E) | 0);
        return `${"0".repeat(zeros)}${num}`;
    } else {
        return `${num}`;
    }
}
