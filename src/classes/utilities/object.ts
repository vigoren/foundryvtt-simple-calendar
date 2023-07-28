/**
 * If the passed in item is an object
 * @param item
 */
export function isObject(item: any): boolean {
    return item && typeof item === "object" && !Array.isArray(item);
}

/**
 * If the passed in item is an empty object or not
 * @param item
 */
export function isObjectEmpty(item: any): boolean {
    return item && Object.keys(item).length === 0 && Object.getPrototypeOf(item) === Object.prototype;
}

/**
 * Preforms a light deep merge of any number of source objects into the target object
 * @param target
 * @param sources
 */
export function deepMerge(target: any, ...sources: any): any {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                deepMerge(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return deepMerge(target, ...sources);
}
