import { DateSelector } from "./index";

export default class DateSelectorManager {
    /**
     * List of date selector objects that are active on the page.
     */
    static Selectors: SimpleCalendar.DateTimeSelector.SelectorList = {};

    /**
     * Creates a new Date Selector or returns an existing Date Selector if it already exists in the list.
     * @param id The unique ID of the selector to add
     * @param options The options associated with setting up the new Date Selector
     * @return
     */
    static GetSelector(id: string, options: SimpleCalendar.DateTimeSelector.Options) {
        if (Object.prototype.hasOwnProperty.call(this.Selectors, id)) {
            this.Selectors[id].applyOptions(options);
            return this.Selectors[id];
        } else {
            const ds = new DateSelector(id, options);
            this.Selectors[id] = ds;
            return ds;
        }
    }

    /**
     * Removes a Date Selector from the list of selectors
     * @param id The ID of the selector to remove
     */
    static RemoveSelector(id: string) {
        if (Object.prototype.hasOwnProperty.call(this.Selectors, id)) {
            this.Selectors[id].deactivateListeners();
            delete this.Selectors[id];
        }
    }

    /**
     * Activates a selectors listeners
     * @param id The ID of the selector to activate
     */
    static ActivateSelector(id: string) {
        if (Object.prototype.hasOwnProperty.call(this.Selectors, id)) {
            this.Selectors[id].activateListeners();
        }
    }

    static DeactivateSelector(id: string) {
        if (Object.prototype.hasOwnProperty.call(this.Selectors, id)) {
            this.Selectors[id].deactivateListeners();
        }
    }
}
