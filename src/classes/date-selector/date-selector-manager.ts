import {SCDateSelector} from "../../interfaces";
import DateSelector from "./date-selector";

export default class DateSelectorManager{
    /**
     * List of date selector objects that are active on the page.
     * @type {SCDateSelector.SelectorList}
     */
    static Selectors:SCDateSelector.SelectorList = {};

    /**
     * Creates a new Date Selector or returns an existing Date Selector if it all ready exists in the list.
     * @param {string} id The unique ID of the selector to add
     * @param {SCDateSelector.Options} options The options associated with setting up the new Date Selector
     * @return {DateSelector}
     */
    static GetSelector(id: string, options: SCDateSelector.Options){
        if(this.Selectors.hasOwnProperty(id)){
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
     * @param {string} id The ID of the selector to remove
     */
    static RemoveSelector(id: string){
        if(this.Selectors.hasOwnProperty(id)){
            delete this.Selectors[id];
        }
    }

    /**
     * Activates a selectors listeners
     * @param {string} id The ID of the selector to activate
     */
    static ActivateSelector(id: string){
        if(this.Selectors.hasOwnProperty(id)){
            this.Selectors[id].activateListeners();
        }
    }
}