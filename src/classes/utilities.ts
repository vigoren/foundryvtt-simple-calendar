import {SCDateSelector} from "../interfaces";
import {GameSettings} from "./game-settings";

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
        return [undefined,GameSettings.Localize('FSC.OrdinalSuffix.st'),GameSettings.Localize('FSC.OrdinalSuffix.nd'),GameSettings.Localize('FSC.OrdinalSuffix.rd')][n%100>>3^1&&n%10]||GameSettings.Localize('FSC.OrdinalSuffix.th');
    }

    /**
     * Finds the "best" contrast color for the passed in color
     * @param color
     * @constructor
     */
    public static GetContrastColor(color: string){
        let contrastColor = "#000000";
        if (color.indexOf('#') === 0) {
            color = color.slice(1);
        }
        if(color.length === 3 || color.length === 6){
            // convert 3-digit hex to 6-digits.
            if (color.length === 3) {
                color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
            }
            var r = parseInt(color.slice(0, 2), 16),
                g = parseInt(color.slice(2, 4), 16),
                b = parseInt(color.slice(4, 6), 16);
            contrastColor = (r * 0.299 + g * 0.587 + b * 0.114) > 186? '#000000' : '#FFFFFF'
        }
        return contrastColor;
    }

    /**
     * Formats an hour and minute to include pre padded 0's
     * @param date
     */
    public static FormatTime(date: SCDateSelector.Date){
        let text = '';
        if(!date.allDay){
            let sHour: string | number = date.hour;
            let sMinute: string | number = date.minute;
            if(sHour < 10){
                sHour = `0${sHour}`;
            }
            if(sMinute < 10){
                sMinute = `0${sMinute}`;
            }
            text = `${sHour}:${sMinute}`;
        }
        return text;
    }
}
