import {generateUniqueId} from "../utilities/string";
import {IConfigurationItemBaseConfig, IConfigurationItemBaseTemplate} from "../../interfaces";
import Year from "../calendar/year";

export default class ConfigurationItemBase{

    /**
     * A unique ID for this configuration item
     * @type {string}
     */
    id: string;
    /**
     * The numeric representation of this weekday
     * @type {number}
     */
    numericRepresentation: number;
    /**
     * The name of the weekday
     * @type {string}
     */
    name: string;

    constructor(name: string = '', numericRepresentation: number = NaN) {
        this.id = generateUniqueId();
        this.name = name;
        this.numericRepresentation = numericRepresentation;
    }

    /**
     * Creates a clone of the current configuration item base
     */
    clone() {
        const cib = new ConfigurationItemBase(this.name, this.numericRepresentation);
        cib.id = this.id;
        return cib;

    }

    /**
     * Creates a configuration object for the item base
     */
    toConfig(): IConfigurationItemBaseConfig{
        return {
            id: this.id,
            name: this.name,
            numericRepresentation: this.numericRepresentation
        }
    }

    /**
     * Creates a template for the configuration item base
     * @param {Year|null} [year=null] The year object to use when generating the template
     */
    toTemplate(year: Year | null = null): IConfigurationItemBaseTemplate {
        return {
            id: this.id,
            name: this.name,
            numericRepresentation: this.numericRepresentation
        };
    }

    /**
     * Sets the properties for this class to options set in the passed in configuration object
     * @param {IConfigurationItemBaseConfig} config The configuration object for this class
     */
    loadFromSettings(config: IConfigurationItemBaseConfig): void{
        this.id = config.id;
        if(config.hasOwnProperty('name') && config.name){
            this.name = config.name;
        }
        if(config.hasOwnProperty('numericRepresentation') && config.numericRepresentation){
            this.numericRepresentation = config.numericRepresentation;
        }
    }
}
