import ConfigurationItemBase from "../configuration/configuration-item-base";

/**
 * Class for representing a weekday
 */
export class Weekday extends ConfigurationItemBase {
    /**
     * If the weekday is part of the weekend (rest day)
     */
    restday: boolean;
    /**
     * The weekday constructor
     * @param {number} numericRepresentation he numeric representation of this weekday
     * @param {string} name The name of the weekday
     */
    constructor(numericRepresentation: number = NaN, name: string = "") {
        super(name, numericRepresentation);
        this.abbreviation = name.substring(0, 2);
        this.restday = false;
    }

    /**
     * Returns the configuration data for the Weekday
     */
    toConfig(): SimpleCalendar.WeekdayData {
        return {
            abbreviation: this.abbreviation,
            id: this.id,
            name: this.name,
            description: this.description,
            numericRepresentation: this.numericRepresentation,
            restday: this.restday
        };
    }

    /**
     * Returns an object that is used to display the weekday in the HTML template
     */
    toTemplate(): SimpleCalendar.HandlebarTemplateData.Weekday {
        return {
            ...super.toTemplate(),
            abbreviation: this.abbreviation,
            name: this.name,
            numericRepresentation: this.numericRepresentation,
            showAdvanced: this.showAdvanced,
            restday: this.restday
        };
    }

    /**
     * Creates a new weekday object with the exact same settings as this weekday
     * @return {Weekday}
     */
    clone(): Weekday {
        const w = new Weekday(this.numericRepresentation, this.name);
        w.id = this.id;
        w.abbreviation = this.abbreviation;
        w.description = this.description;
        w.showAdvanced = this.showAdvanced;
        w.restday = this.restday;
        return w;
    }

    /**
     * Loads the weekday data from the config object.
     * @param {WeekdayData} config The configuration object for this class
     */
    loadFromSettings(config: SimpleCalendar.WeekdayData) {
        if (config && Object.keys(config).length) {
            super.loadFromSettings(config);
            if (Object.prototype.hasOwnProperty.call(config, "abbreviation")) {
                this.abbreviation = config.abbreviation;
            } else {
                this.abbreviation = this.name.substring(0, 2);
            }
            if (Object.prototype.hasOwnProperty.call(config, "restday")) {
                this.restday = config.restday;
            }
        }
    }
}
