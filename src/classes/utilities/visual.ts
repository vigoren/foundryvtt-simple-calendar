import {Icons} from "../../constants";
import SCIcon from "../../icons/logo.svg";
import Clock from "../../icons/clock.svg";
import MiddayIcon from "../../icons/midday.svg";
import MidnightIcon from "../../icons/midnight.svg";
import SunriseIcon from "../../icons/sunrise.svg";
import SunsetIcon from "../../icons/sunset.svg";
import FirstQuarterIcon from "../../icons/moon-first-quarter.svg";
import FullMoonIcon from "../../icons/moon-full.svg";
import LastQuarterIcon from "../../icons/moon-last-quarter.svg";
import NewMoonIcon from "../../icons/moon-new.svg";
import WaningCrescentIcon from "../../icons/moon-waning-crescent.svg";
import WaningGibbousIcon from "../../icons/moon-waning-gibbous.svg";
import WaxingCrescentIcon from "../../icons/moon-waxing-crescent.svg";
import WaxingGibbousIcon from "../../icons/moon-waxing-gibbous.svg";

/**
 * Finds the "best" contrast color for the passed in color
 * @param color
 * @constructor
 */
export function GetContrastColor(color: string){
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
 * Gets the SVG icon string for the specified icon  type
 * @param {Icons} icon The icon to get
 * @param {string} strokeColor The color of the svg stroke
 * @param {string} fillColor The color of the svg fill
 */
export function GetIcon(icon: Icons, strokeColor: string = "#000000", fillColor: string = "#000000"){
    let iString = '';
    let fillSearch = /fill="#000000"/g;

    switch (icon){
        case Icons.Logo:
            iString = SCIcon;
            break;
        case Icons.Clock:
            iString = Clock;
            break;
        case Icons.Midday:
            iString = MiddayIcon;
            break;
        case Icons.Midnight:
            iString = MidnightIcon;
            break;
        case Icons.Sunrise:
            iString = SunriseIcon;
            break;
        case Icons.Sunset:
            iString = SunsetIcon;
            break;
        case Icons.FirstQuarter:
            iString = FirstQuarterIcon;
            fillSearch = /fill="#ffffff"/g;
            break;
        case Icons.Full:
            iString = FullMoonIcon;
            fillSearch = /fill="#ffffff"/g;
            break;
        case Icons.LastQuarter:
            iString = LastQuarterIcon;
            fillSearch = /fill="#ffffff"/g;
            break;
        case Icons.NewMoon:
            iString = NewMoonIcon;
            fillSearch = /fill="#ffffff"/g;
            break;
        case Icons.WaningCrescent:
            iString = WaningCrescentIcon;
            fillSearch = /fill="#ffffff"/g;
            break;
        case Icons.WaningGibbous:
            iString = WaningGibbousIcon;
            fillSearch = /fill="#ffffff"/g;
            break;
        case Icons.WaxingCrescent:
            iString = WaxingCrescentIcon;
            fillSearch = /fill="#ffffff"/g;
            break;
        case Icons.WaxingGibbous:
            iString = WaxingGibbousIcon;
            fillSearch = /fill="#ffffff"/g;
            break;
    }

    iString = iString.replace(/stroke="#000000"/g, `stroke="${strokeColor}"`);
    iString = iString.replace(fillSearch, `fill="${fillColor}"`);
    return iString;
}

/**
 * Processes opening and closing animations for HTML elements
 * @param element
 * @param duration
 * @param forceHide
 */
export function animateElement(element: Element, duration: number, forceHide: boolean = false){
    let openState = false;
    if(element && !element.classList.contains('fsc-animate')){
        if(element.classList.contains('fsc-open') || forceHide){
            element.classList.add('fsc-animate');
            element.classList.remove('fsc-open');
            openState = false;
            setTimeout(((nl: Element) => { nl.classList.add('fsc-closed'); }).bind(null, element), duration);
        } else {
            element.classList.add('fsc-animate', 'fsc-open');
            element.classList.remove('fsc-closed');
            openState = true;
        }
        setTimeout(((nl: Element) => { nl.classList.remove('fsc-animate'); }).bind(null, element), duration);
    }
    return openState;
}

export function animateFormGroup(selector: string, check: boolean, element: Document | Element = document){
    const fg = element.querySelector(selector)?.closest('.form-group');
    if(fg){
        if((fg.classList.contains('fsc-closed') && check) || fg.classList.contains('fsc-open') && !check){
            animateElement(fg, 200);
        } else if(check){
            fg.classList.remove('fsc-closed');
            fg.classList.add('fsc-open');
        } else {
            fg.classList.add('fsc-closed');
            fg.classList.remove('fsc-open');
        }
    }
}