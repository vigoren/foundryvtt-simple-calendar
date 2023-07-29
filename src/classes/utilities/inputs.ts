/**
 * Return the value, or default value if no element is found, for the passed in text input element.
 * @param selector The query selector string to get the object
 * @param defaultVal The default value to use if the element can not be found
 * @param root The root element to use when looking for the selector element
 */
export function getTextInputValue(selector: string, defaultVal: string, root: Document | Element = document) {
    const el = <HTMLInputElement>root.querySelector(selector);
    return el ? el.value : defaultVal;
}

/**
 * Return the value, or default value if no element is found, for the passed in numeric input element.
 * @param selector The query selector string to get the object
 * @param defaultVal The default value to use if the element can not be found
 * @param isFloat If the value could be a float and should be parsed as such
 * @param root The root element to use when looking for the selector element
 */
export function getNumericInputValue(selector: string, defaultVal: number | null, isFloat: boolean = false, root: Document | Element = document) {
    const el = <HTMLInputElement>root.querySelector(selector);
    if (el) {
        const v = isFloat ? parseFloat(el.value) : parseInt(el.value);
        if (!isNaN(v)) {
            return v;
        }
    }
    return defaultVal;
}

/**
 * Return the value, or default value if no element is found, for the passed in checkbox input element.
 * @param selector The query selector string to get the object
 * @param defaultVal The default value to use if the element can not be found
 * @param root The root element to use when looking for the selector element
 */
export function getCheckBoxInputValue(selector: string, defaultVal: boolean, root: Document | Element = document) {
    const el = <HTMLInputElement>root.querySelector(selector);
    return el ? el.checked : defaultVal;
}

/**
 * Return the checkbox group values for all checked items
 * @param groupName The name of the checkbox group to look for
 * @param root The root element to use when looking for the selector element
 */
export function getCheckBoxGroupValues(groupName: string, root: Document | Element = document) {
    return Array.from(root.querySelectorAll(`input[name=${groupName}]:checked`)).map((v) => {
        return (<HTMLInputElement>v).value;
    });
}
