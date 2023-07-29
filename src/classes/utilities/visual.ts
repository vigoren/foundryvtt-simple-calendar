import { Icons, SettingNames, Themes } from "../../constants";
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
import { GameSettings } from "../foundry-interfacing/game-settings";
import { FoundryVTTGameData } from "../foundry-interfacing/game-data";

/**
 * The current Rem size for this system. Most systems are 16px
 */
export const RemSize = parseInt(window.getComputedStyle(document.documentElement).getPropertyValue("font-size"));

/**
 * Finds the "best" contrast color for the passed in color
 * @param color
 */
export function GetContrastColor(color: string) {
    let contrastColor = "#000000";
    if (color.indexOf("#") === 0) {
        color = color.slice(1);
    }
    if (color.length === 3 || color.length === 6) {
        // convert 3-digit hex to 6-digits.
        if (color.length === 3) {
            color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
        }
        const r = parseInt(color.slice(0, 2), 16),
            g = parseInt(color.slice(2, 4), 16),
            b = parseInt(color.slice(4, 6), 16);
        contrastColor = r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "#000000" : "#FFFFFF";
    }
    return contrastColor;
}

/**
 * Gets the SVG icon string for the specified icon  type
 * @param {Icons} icon The icon to get
 * @param {string} strokeColor The color of the svg stroke
 * @param {string} fillColor The color of the svg fill
 */
export function GetIcon(icon: Icons, strokeColor: string = "#000000", fillColor: string = "#000000") {
    let iString = "";
    let fillSearch = /fill="#000000"/g;

    switch (icon) {
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
        case Icons.Spring:
            iString = `<span class="fa fa-seedling" style="color:${strokeColor};"></span>`;
            break;
        case Icons.Summer:
            iString = `<span class="fa fa-sun" style="color:${strokeColor};"></span>`;
            break;
        case Icons.Fall:
            iString = `<span class="fa fa-leaf" style="color:${strokeColor};"></span>`;
            break;
        case Icons.Winter:
            iString = `<span class="fa fa-snowflake" style="color:${strokeColor};"></span>`;
            break;
        default:
            break;
    }

    iString = iString.replace(/stroke="#000000"/g, `stroke="${strokeColor}"`);
    iString = iString.replace(fillSearch, `fill="${fillColor}"`);
    return iString;
}

/**
 * Gets the text name of the Theme being used. Will check the old Theme client setting if the new world specific one is not set.
 */
export function GetThemeName(): string {
    let theme = GameSettings.GetStringSettings(`${FoundryVTTGameData.worldId}.${SettingNames.Theme}`);
    if (!theme) {
        theme = GameSettings.GetStringSettings(SettingNames.Theme);
        //Check to see if we are trying to load a system specific theme in the wrong system.
        const tObj = Themes.find((t) => {
            return t.key === theme;
        });
        if (tObj) {
            if (tObj.system && FoundryVTTGameData.systemID !== tObj.key) {
                theme = Themes[0].key;
            } else if (tObj.module) {
                const m = (<Game>game).modules.get(tObj.key);
                if (!m || !m.active) {
                    theme = Themes[0].key;
                }
            }
        }
    }
    return theme;
}

/**
 * Returns a list of themes to be used in a drop-down
 */
export function GetThemeList(): { [key: string]: string } {
    const choices: { [key: string]: string } = {};
    for (let i = 0; i < Themes.length; i++) {
        if ((!Themes[i].system && !Themes[i].module) || (Themes[i].system && FoundryVTTGameData.systemID === Themes[i].key)) {
            choices[Themes[i].key] = Themes[i].name;
        } else if (Themes[i].module) {
            const m = (<Game>game).modules.get(Themes[i].key);
            if (m && m.active) {
                choices[Themes[i].key] = Themes[i].name;
            }
        }
    }
    return choices;
}

/**
 * Converts a pixel amount to a new pixel amount based on the current pages REM size
 * @param px The pixel amount to convert
 */
export function ConvertPxBasedOnRemSize(px: number) {
    return px * (RemSize / 16);
}

/**
 * Checks the current systems Rem size and adds the appropriate class to the body to account for that size.
 */
export function CheckRemScaling() {
    if (RemSize !== 16) {
        document.body.classList.add(`sc-scale-${RemSize}`);
    }
}

/**
 * Processes opening and closing animations for HTML elements
 * @param element
 * @param duration
 * @param forceHide
 */
export function animateElement(element: Element, duration: number, forceHide: boolean = false) {
    let openState = false;
    if (element && !element.classList.contains("fsc-animate")) {
        if (element.classList.contains("fsc-open") || forceHide) {
            element.classList.add("fsc-animate");
            element.classList.remove("fsc-open");
            openState = false;
            setTimeout(timeoutCall.bind(null, element, true, "fsc-closed"), duration);
        } else {
            element.classList.add("fsc-animate", "fsc-open");
            element.classList.remove("fsc-closed");
            openState = true;
        }
        setTimeout(timeoutCall.bind(null, element, false, "fsc-animate"), duration);
    }
    return openState;
}

/**
 * Function that is called after the animate element timeout is finished
 * @param element The element that was being animated
 * @param add If a class is being added or removed
 * @param cssClass The class to add/remove
 */
export function timeoutCall(element: Element, add: boolean, cssClass: string) {
    if (add) {
        element.classList.add(cssClass);
    } else {
        element.classList.remove(cssClass);
    }
}

/**
 * Animates a form group
 * @param selector The selector to get an element within the form group
 * @param check If we are opening or closing the group
 * @param element The root element to search for the selector
 */
export function animateFormGroup(selector: string, check: boolean, element: Document | Element = document) {
    const fg = element.querySelector(selector)?.closest(".form-group");
    if (fg) {
        if ((fg.classList.contains("fsc-closed") && check) || (fg.classList.contains("fsc-open") && !check)) {
            animateElement(fg, 200);
        } else if (check) {
            fg.classList.remove("fsc-closed");
            fg.classList.add("fsc-open");
        } else {
            fg.classList.add("fsc-closed");
            fg.classList.remove("fsc-open");
        }
    }
}
