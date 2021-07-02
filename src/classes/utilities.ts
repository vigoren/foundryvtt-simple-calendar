export default class Utilities{

    /**
     * Generates a random numeric value based on the passed in string.
     * @param {string} value The string to hash
     * @return {number} The number representing the hash value
     */
    public static randomHash(value: string) {
        let hash = 0;
        if (value.length == 0) {
            return hash;
        }
        for (let i = 0; i < value.length; i++) {
            let char = value.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }

    /**
     * Returns the ordinal suffix for the passed in number
     * @param {number} n The number to get the suffix for
     */
    public static ordinalSuffix(n: number): string {
        return [undefined,'st','nd','rd'][n%100>>3^1&&n%10]||'th';
    }
}
