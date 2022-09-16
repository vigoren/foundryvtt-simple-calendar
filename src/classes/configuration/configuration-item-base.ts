import {generateUniqueId} from "../utilities/string";
import Calendar from "../calendar";

export default class ConfigurationItemBase{

    /**
     * A unique ID for this configuration item
     */
    id: string;
    /**
     * The numeric representation of this weekday
     */
    numericRepresentation: number;
    /**
     * The name of the configuration item
     */
    name: string;
    /**
     * The shorthand version of the name
     */
    abbreviation: string;
    /**
     * A description of the configuration item for display to players
     */
    description: string;
    /**
     * Used to determine if the advanced options are should be shown or not. This is not saved.
     */
    showAdvanced: boolean = false;

    constructor(name: string = '', numericRepresentation: number = NaN) {
        this.id = generateUniqueId();
        this.name = name;
        this.numericRepresentation = numericRepresentation;
        this.description = '';
        this.abbreviation = '';
    }

    /**
     * Creates a clone of the current configuration item base
     */
    clone() {
        const cib = new ConfigurationItemBase(this.name, this.numericRepresentation);
        cib.id = this.id;
        cib.description = this.description;
        cib.abbreviation = this.abbreviation;
        cib.showAdvanced = this.showAdvanced;
        return cib;

    }

    /**
     * Creates a configuration object for the item base
     */
    toConfig(): SimpleCalendar.IDataItemBase{
        return {
            id: this.id,
            name: this.name,
            numericRepresentation: this.numericRepresentation,
            description: this.description,
            abbreviation: this.abbreviation
        }
    }

    /**
     * Creates a template for the configuration item base
     * @param calendar
     */
    toTemplate(calendar: Calendar | null = null): SimpleCalendar.IDataItemBase {
        return {
            id: this.id,
            name: this.name,
            numericRepresentation: this.numericRepresentation,
            description: this.description,
            abbreviation: this.abbreviation,
            showAdvanced: this.showAdvanced
        };
    }

    /**
     * Sets the properties for this class to options set in the passed in configuration object
     * @param config The configuration object for this class
     */
    loadFromSettings(config: SimpleCalendar.IDataItemBase): void{
        if(config.hasOwnProperty('id')){
            this.id = config.id;
        }
        if(config.hasOwnProperty('name') && config.name){
            this.name = config.name;
        }
        if(config.hasOwnProperty('numericRepresentation') && config.numericRepresentation){
            this.numericRepresentation = config.numericRepresentation;
        }
        if(config.hasOwnProperty('description') && config.description){
            this.description = config.description;
        }
        if(config.hasOwnProperty('abbreviation') && config.abbreviation){
            this.abbreviation = config.abbreviation;
        }
    }
}
