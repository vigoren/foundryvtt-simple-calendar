/** 
 * A fake mock collection for testing purposes. 
 * Needs to implement the get() and set() functions 
 */
export class FakeCollection extends Array {
    get size() {
        return this.length;
    }

    get contents() {
        return Array.from(this);
    }
}