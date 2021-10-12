import Year from "./year";
import {LeapYearRules, MoonIcons, MoonYearResetOptions, PredefinedCalendars, YearNamingRules} from "../constants";
import Month from "./month";
import {GameSettings} from "./game-settings";
import {Weekday} from "./weekday";
import Season from "./season";
import Moon from "./moon";

export default class PredefinedCalendar{
    
    public static setToPredefined(year: Year, calendar: PredefinedCalendars){
        let phaseLength = 0;
        let updated = false;
        switch (calendar){
            case PredefinedCalendars.Gregorian:
                const currentDate = new Date();
                year.numericRepresentation = currentDate.getFullYear();
                year.prefix = '';
                year.postfix = '';
                year.yearZero = 1970;
                year.months = [
                    new Month(GameSettings.Localize("FSC.Date.January"), 1, 0, 31),
                    new Month(GameSettings.Localize("FSC.Date.February"), 2, 0, 28, 29),
                    new Month(GameSettings.Localize("FSC.Date.March"),3, 0, 31),
                    new Month(GameSettings.Localize("FSC.Date.April"),4, 0, 30),
                    new Month(GameSettings.Localize("FSC.Date.May"),5, 0, 31),
                    new Month(GameSettings.Localize("FSC.Date.June"),6, 0, 30),
                    new Month(GameSettings.Localize("FSC.Date.July"),7, 0, 31),
                    new Month(GameSettings.Localize("FSC.Date.August"),8, 0, 31),
                    new Month(GameSettings.Localize("FSC.Date.September"),9, 0, 30),
                    new Month(GameSettings.Localize("FSC.Date.October"), 10, 0, 31),
                    new Month(GameSettings.Localize("FSC.Date.November"), 11, 0, 30),
                    new Month(GameSettings.Localize("FSC.Date.December"), 12, 0, 31),
                ];
                year.showWeekdayHeadings = true;
                year.firstWeekday = 4;
                year.weekdays = [
                    new Weekday(1, GameSettings.Localize('FSC.Date.Sunday')),
                    new Weekday(2, GameSettings.Localize('FSC.Date.Monday')),
                    new Weekday(3, GameSettings.Localize('FSC.Date.Tuesday')),
                    new Weekday(4, GameSettings.Localize('FSC.Date.Wednesday')),
                    new Weekday(5, GameSettings.Localize('FSC.Date.Thursday')),
                    new Weekday(6, GameSettings.Localize('FSC.Date.Friday')),
                    new Weekday(7, GameSettings.Localize('FSC.Date.Saturday'))
                ];
                year.seasons = [
                    new Season('Spring', 3, 20),
                    new Season('Summer', 6, 20),
                    new Season('Fall', 9, 22),
                    new Season('Winter', 12, 21)
                ];
                year.time.hoursInDay = 24;
                year.time.minutesInHour = 60;
                year.time.secondsInMinute = 60;
                year.time.gameTimeRatio = 1;
                year.leapYearRule.rule = LeapYearRules.Gregorian;
                year.leapYearRule.customMod = 0;
                year.months[currentDate.getMonth()].current = true;
                year.months[currentDate.getMonth()].days[currentDate.getDate()-1].current = true;
                year.seasons[0].color = "#fffce8";
                year.seasons[1].color = "#f3fff3";
                year.seasons[2].color = "#fff7f2";
                year.seasons[3].color = "#f2f8ff";
                year.seasons[0].sunriseTime = 21600;
                year.seasons[1].sunriseTime = 21600;
                year.seasons[2].sunriseTime = 21600;
                year.seasons[3].sunriseTime = 21600;
                year.seasons[0].sunsetTime = 64800;
                year.seasons[1].sunsetTime = 64800;
                year.seasons[2].sunsetTime = 64800;
                year.seasons[3].sunsetTime = 64800;
                year.moons = [
                    new Moon('Moon', 29.53059)
                ];
                year.moons[0].firstNewMoon.yearReset = MoonYearResetOptions.None;
                year.moons[0].firstNewMoon.year = 2000;
                year.moons[0].firstNewMoon.month = 1;
                year.moons[0].firstNewMoon.day = 6;
                year.moons[0].cycleDayAdjust = 0.5;
                phaseLength = Number(((year.moons[0].cycleLength - 4) / 4).toPrecision(5));
                year.moons[0].phases = [
                    {name: GameSettings.Localize('FSC.Moon.Phase.New'), length: 1, icon: MoonIcons.NewMoon, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingCrescent'), length: phaseLength, icon: MoonIcons.WaxingCrescent, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.FirstQuarter'), length: 1, icon: MoonIcons.FirstQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingGibbous'), length: phaseLength, icon: MoonIcons.WaxingGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.Full'), length: 1, icon: MoonIcons.Full, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningGibbous'), length: phaseLength, icon: MoonIcons.WaningGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.LastQuarter'), length: 1, icon: MoonIcons.LastQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningCrescent'), length: phaseLength, icon: MoonIcons.WaningCrescent, singleDay: false}
                ];
                year.yearNamesStart = 0;
                year.yearNamingRule = YearNamingRules.Default;
                year.yearNames = [];
                updated = true;
                break;
            case PredefinedCalendars.DarkSun:
                year.numericRepresentation = 1;
                year.prefix = '';
                year.postfix = '';
                year.yearZero = 0;
                year.months = [
                    new Month('Scorch', 1, 0, 30),
                    new Month('Morrow', 2, 0, 30),
                    new Month('Rest', 3, 0, 30),
                    new Month('Gather', 4, 0, 30),
                    new Month('Cooling Sun', -1, 0, 5),
                    new Month('Breeze', 5, 0, 30),
                    new Month('Mist', 6, 0, 30),
                    new Month('Bloom', 7, 0, 30),
                    new Month('Haze', 8, 0, 30),
                    new Month('Soaring Sun', -2, 0, 5),
                    new Month('Hoard', 9, 0, 30),
                    new Month('Wind', 10, 0, 30),
                    new Month('Sorrow', 11, 0, 30),
                    new Month('Smolder', 12, 0, 30),
                    new Month('Highest Sun', -3, 0, 5)
                ];
                year.months[4].intercalary = true;
                year.months[9].intercalary = true;
                year.months[14].intercalary = true;
                year.showWeekdayHeadings = false;
                year.firstWeekday = 0;
                year.weekdays = [
                    new Weekday(1, '1 Day'),
                    new Weekday(2, '2 Day'),
                    new Weekday(3, '3 Day'),
                    new Weekday(4, '4 Day'),
                    new Weekday(5, '5 Day'),
                    new Weekday(6, '6 Day')
                ];
                year.seasons = [
                    new Season("Sun Descending", 3, 1),
                    new Season("Sun Ascending", 7, 1),
                    new Season("High Sun", 9, 1)
                ];
                year.seasons[2].color = '#fff2da';
                year.seasons[0].color = '#dececc';
                year.seasons[1].color = '#fff1e7';
                year.seasons[0].sunriseTime = 21600;
                year.seasons[1].sunriseTime = 21600;
                year.seasons[2].sunriseTime = 21600;
                year.seasons[0].sunsetTime = 64800;
                year.seasons[1].sunsetTime = 64800;
                year.seasons[2].sunsetTime = 64800;
                year.time.hoursInDay = 24;
                year.time.minutesInHour = 60;
                year.time.secondsInMinute = 60;
                year.time.gameTimeRatio = 1;
                year.leapYearRule.rule = LeapYearRules.None;
                year.leapYearRule.customMod = 0;
                year.months[0].current = true;
                year.months[0].days[0].current = true;
                year.moons = [
                    new Moon('Ral', 34),
                    new Moon('Guthay', 125)
                ];
                year.moons[0].color = "#7ace57";
                year.moons[0].firstNewMoon.yearReset = MoonYearResetOptions.None;
                year.moons[0].firstNewMoon.year = 1;
                year.moons[0].firstNewMoon.month = 1;
                year.moons[0].firstNewMoon.day = 14;
                phaseLength = Number(((year.moons[0].cycleLength - 4) / 4).toPrecision(5));
                year.moons[0].phases = [
                    {name: GameSettings.Localize('FSC.Moon.Phase.New'), length: 1, icon: MoonIcons.NewMoon, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingCrescent'), length: phaseLength, icon: MoonIcons.WaxingCrescent, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.FirstQuarter'), length: 1, icon: MoonIcons.FirstQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingGibbous'), length: phaseLength, icon: MoonIcons.WaxingGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.Full'), length: 1, icon: MoonIcons.Full, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningGibbous'), length: phaseLength, icon: MoonIcons.WaningGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.LastQuarter'), length: 1, icon: MoonIcons.LastQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningCrescent'), length: phaseLength, icon: MoonIcons.WaningCrescent, singleDay: false}
                ];
                year.moons[1].color = "#ffd920";
                year.moons[1].firstNewMoon.yearReset = MoonYearResetOptions.None;
                year.moons[1].firstNewMoon.year = 1;
                year.moons[1].firstNewMoon.month = 3;
                year.moons[1].firstNewMoon.day = 3;
                phaseLength = Number(((year.moons[1].cycleLength - 4) / 4).toPrecision(5));
                year.moons[1].phases = [
                    {name: GameSettings.Localize('FSC.Moon.Phase.New'), length: 1, icon: MoonIcons.NewMoon, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingCrescent'), length: phaseLength, icon: MoonIcons.WaxingCrescent, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.FirstQuarter'), length: 1, icon: MoonIcons.FirstQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingGibbous'), length: phaseLength, icon: MoonIcons.WaxingGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.Full'), length: 1, icon: MoonIcons.Full, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningGibbous'), length: phaseLength, icon: MoonIcons.WaningGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.LastQuarter'), length: 1, icon: MoonIcons.LastQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningCrescent'), length: phaseLength, icon: MoonIcons.WaningCrescent, singleDay: false}
                ];
                year.yearNamesStart = -101;
                year.yearNamingRule = YearNamingRules.Repeat;
                year.yearNames = [
                    "Ral's Fury",
                    "Friend's Contemplation",
                    "Desert's Vengeance",
                    "Priest's Slumber",
                    "Wind's Defiance",
                    "Dragon's Reverance",
                    "Mountain's Agitation",
                    "King's Fury",
                    "Silt's Contemplation",
                    "Enemy's Vengeance",
                    "Guthay's Slumber",
                    "Ral's Defiance",
                    "Friend's Reverance",
                    "Desert's Agitation",
                    "Priest's Fury",
                    "Wind's Contemplation",
                    "Dragon's Vengeance",
                    "Mountain's Slumber",
                    "King's Defiance",
                    "Silt's Reverance",
                    "Enemy's Agitation",
                    "Guthay's Fury",
                    "Ral's Contemplation",
                    "Friend's Vengeance",
                    "Desert's Slumber",
                    "Priest's Defiance",
                    "Wind's Reverance",
                    "Dragon's Agitation",
                    "Mountain's Fury",
                    "King's Contemplation",
                    "Silt's Vengeance",
                    "Enemy's Slumber",
                    "Guthay's Defiance",
                    "Ral's Reverance",
                    "Friend's Agitation",
                    "Desert's Fury",
                    "Priest's Contemplation",
                    "Wind's Vengeance",
                    "Dragon's Slumber",
                    "Mountain's Defiance",
                    "King's Reverance",
                    "Silt's Agitation",
                    "Enemy's Fury",
                    "Guthay's Contemplation",
                    "Ral's Vengeance",
                    "Friend's Slumber",
                    "Desert's Defiance",
                    "Priest's Reverance",
                    "Wind's Agitation",
                    "Dragon's Fury",
                    "Mountain's Contemplation",
                    "King's Vengeance",
                    "Silt's Slumber",
                    "Enemy's Defiance",
                    "Guthay's Reverance",
                    "Ral's Agitation",
                    "Friend's Fury",
                    "Desert's Contemplation",
                    "Priest's Vengeance",
                    "Wind's Slumber",
                    "Dragon's Defiance",
                    "Mountain's Reverance",
                    "King's Agitation",
                    "Silt's Fury",
                    "Enemy's Contemplation",
                    "Guthay's Vengeance",
                    "Ral's Slumber",
                    "Friend's Defiance",
                    "Desert's Reverance",
                    "Priest's Agitation",
                    "Wind's Fury",
                    "Dragon's Contemplation",
                    "Mountain's Vengeance",
                    "King's Slumber",
                    "Silt's Defiance",
                    "Enemy's Reverance",
                    "Guthay's Agitation"
                ];
                updated = true;
                break;
            case PredefinedCalendars.Eberron:
                year.numericRepresentation = 998;
                year.prefix = '';
                year.postfix = ' YK';
                year.yearZero = 0;
                year.months = [
                    new Month('Zarantyr', 1, 0, 28),
                    new Month('Olarune', 2, 0, 28),
                    new Month('Therendor', 3, 0, 28),
                    new Month('Eyre', 4, 0, 28),
                    new Month('Dravago', 5, 0, 28),
                    new Month('Nymm', 6, 0, 28),
                    new Month('Lharvion', 7, 0, 28),
                    new Month('Barrakas', 8, 0, 28),
                    new Month('Rhaan', 9, 0, 28),
                    new Month('Sypheros', 10, 0, 28),
                    new Month('Aryth', 11, 0, 28),
                    new Month('Vult', 12, 0, 28)
                ];
                year.showWeekdayHeadings = true;
                year.firstWeekday = 0;
                year.weekdays = [
                    new Weekday(1, 'Sul'),
                    new Weekday(2, 'Mol'),
                    new Weekday(3, 'Zol'),
                    new Weekday(4, 'Wir'),
                    new Weekday(5, 'Zor'),
                    new Weekday(6, 'Far'),
                    new Weekday(7, 'Sar')
                ];
                year.seasons = [];
                year.time.hoursInDay = 24;
                year.time.minutesInHour = 60;
                year.time.secondsInMinute = 60;
                year.time.gameTimeRatio = 1;
                year.leapYearRule.rule = LeapYearRules.None;
                year.leapYearRule.customMod = 0;
                year.months[0].current = true;
                year.months[0].days[0].current = true;
                year.moons = []; //TODO: Maybe add all 12 moons?
                year.yearNamesStart = 0;
                year.yearNamingRule = YearNamingRules.Default;
                year.yearNames = [];
                updated = true;
                break;
            case PredefinedCalendars.Exandrian:
                year.numericRepresentation = 812;
                year.prefix = '';
                year.postfix = ' P.D.';
                year.yearZero = 0;
                year.months = [
                    new Month('Horisal', 1, 0, 29),
                    new Month('Misuthar', 2, 0, 30),
                    new Month('Dualahei', 3, 0, 30),
                    new Month('Thunsheer', 4, 0, 31),
                    new Month('Unndilar', 5, 0, 28),
                    new Month('Brussendar', 6, 0, 31),
                    new Month('Sydenstar', 7, 0, 32),
                    new Month('Fessuran', 8, 0, 29),
                    new Month('Quen\'pillar', 9, 0, 27),
                    new Month('Cuersaar', 10, 0, 29),
                    new Month('Duscar', 11, 0, 32)
                ];
                year.showWeekdayHeadings = true;
                year.firstWeekday = 3;
                year.weekdays = [
                    new Weekday(1, 'Miresen'),
                    new Weekday(2, 'Grissen'),
                    new Weekday(3, 'Whelsen'),
                    new Weekday(4, 'Conthsen'),
                    new Weekday(5, 'Folsen'),
                    new Weekday(6, 'Yulisen'),
                    new Weekday(7, 'Da\'leysen')
                ];
                year.seasons = [
                    new Season('Spring', 3, 13),
                    new Season('Summer', 5, 26),
                    new Season('Autumn', 8, 3),
                    new Season('Winter', 11, 2)
                ];
                year.time.hoursInDay = 24;
                year.time.minutesInHour = 60;
                year.time.secondsInMinute = 60;
                year.time.gameTimeRatio = 1;
                year.leapYearRule.rule = LeapYearRules.None;
                year.leapYearRule.customMod = 0;
                year.months[0].current = true;
                year.months[0].days[0].current = true;
                year.seasons[0].color = "#fffce8";
                year.seasons[1].color = "#f3fff3";
                year.seasons[2].color = "#fff7f2";
                year.seasons[3].color = "#f2f8ff";
                year.seasons[0].sunriseTime = 27000;
                year.seasons[1].sunriseTime = 21600;
                year.seasons[2].sunriseTime = 27000;
                year.seasons[3].sunriseTime = 32400;
                year.seasons[0].sunsetTime = 64800;
                year.seasons[1].sunsetTime = 75600;
                year.seasons[2].sunsetTime = 64800;
                year.seasons[3].sunsetTime = 54000;
                year.moons = [
                    new Moon('Catha', 33),
                    new Moon('Ruidus', 328)
                ];
                year.moons[0].firstNewMoon.yearReset = MoonYearResetOptions.None;
                year.moons[0].firstNewMoon.year = 810;
                year.moons[0].firstNewMoon.month = 1;
                year.moons[0].firstNewMoon.day = 9;
                phaseLength = Number(((year.moons[0].cycleLength - 4) / 4).toPrecision(5));
                year.moons[0].phases = [
                    {name: GameSettings.Localize('FSC.Moon.Phase.New'), length: 1, icon: MoonIcons.NewMoon, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingCrescent'), length: phaseLength, icon: MoonIcons.WaxingCrescent, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.FirstQuarter'), length: 1, icon: MoonIcons.FirstQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingGibbous'), length: phaseLength, icon: MoonIcons.WaxingGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.Full'), length: 1, icon: MoonIcons.Full, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningGibbous'), length: phaseLength, icon: MoonIcons.WaningGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.LastQuarter'), length: 1, icon: MoonIcons.LastQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningCrescent'), length: phaseLength, icon: MoonIcons.WaningCrescent, singleDay: false}
                ];
                year.moons[1].color = "#ab82f3";
                year.moons[1].firstNewMoon.yearReset = MoonYearResetOptions.None;
                year.moons[1].firstNewMoon.year = 810;
                year.moons[1].firstNewMoon.month = 3;
                year.moons[1].firstNewMoon.day = 22;
                phaseLength = Number(((year.moons[1].cycleLength - 4) / 4).toPrecision(5));
                year.moons[1].phases = [
                    {name: GameSettings.Localize('FSC.Moon.Phase.New'), length: 1, icon: MoonIcons.NewMoon, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingCrescent'), length: phaseLength, icon: MoonIcons.WaxingCrescent, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.FirstQuarter'), length: 1, icon: MoonIcons.FirstQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingGibbous'), length: phaseLength, icon: MoonIcons.WaxingGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.Full'), length: 1, icon: MoonIcons.Full, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningGibbous'), length: phaseLength, icon: MoonIcons.WaningGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.LastQuarter'), length: 1, icon: MoonIcons.LastQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningCrescent'), length: phaseLength, icon: MoonIcons.WaningCrescent, singleDay: false}
                ];
                year.yearNamesStart = 0;
                year.yearNamingRule = YearNamingRules.Default;
                year.yearNames = [];
                updated = true;
                break;
            case PredefinedCalendars.ForbiddenLands:
                year.numericRepresentation = 1165;
                year.prefix = '';
                year.postfix = ' AS';
                year.yearZero = 0;
                year.showWeekdayHeadings = true;
                year.firstWeekday = 0;
                year.yearNames = [];
                year.yearNamesStart = 0;
                year.yearNamingRule = YearNamingRules.Default;

                year.months = [
                    new Month('Winterwane', 1, 0, 46),
                    new Month('Springrise', 2, 0, 45),
                    new Month('Springwane', 3, 0, 46),
                    new Month('Sumerrise', 4, 0, 45),
                    new Month('Summerwane', 5, 0, 46),
                    new Month('Fallrise', 6, 0, 45),
                    new Month('Fallwane', 7, 0, 46),
                    new Month('Winterrise', 8, 0, 45)
                ];

                year.weekdays = [
                    new Weekday(1, 'Sunday'),
                    new Weekday(2, 'Moonday'),
                    new Weekday(3, 'Bloodday'),
                    new Weekday(4, 'Earthday'),
                    new Weekday(5, 'Growthday'),
                    new Weekday(6, 'Feastday'),
                    new Weekday(7, 'Stillday')
                ];

                year.seasons = [
                    new Season('Spring', 2, 1),
                    new Season('Summer', 4, 1),
                    new Season('Fall', 6, 1),
                    new Season('Winter', 8, 1)
                ];
                year.seasons[0].color = "#acffac";
                year.seasons[1].color = "#ff9393";
                year.seasons[2].color = "#ffdf99";
                year.seasons[3].color = "#a8a8ff";
                year.seasons[0].sunriseTime = 21600;
                year.seasons[1].sunriseTime = 21600;
                year.seasons[2].sunriseTime = 21600;
                year.seasons[3].sunriseTime = 21600;
                year.seasons[0].sunsetTime = 64800;
                year.seasons[1].sunsetTime = 64800;
                year.seasons[2].sunsetTime = 64800;
                year.seasons[3].sunsetTime = 64800;

                year.time.hoursInDay = 24;
                year.time.minutesInHour = 60;
                year.time.secondsInMinute = 60;
                year.time.gameTimeRatio = 1;
                year.leapYearRule.rule = LeapYearRules.None;
                year.leapYearRule.customMod = 0;

                year.months[1].current = true;
                year.months[1].days[0].current = true;

                year.moons = [
                    new Moon('Moon', 30)
                ];
                year.moons[0].firstNewMoon.yearReset = MoonYearResetOptions.None;
                year.moons[0].firstNewMoon.year = 0;
                year.moons[0].firstNewMoon.month = 1;
                year.moons[0].firstNewMoon.day = 1;
                year.moons[0].cycleDayAdjust = 0;
                phaseLength = Number(((year.moons[0].cycleLength - 4) / 4).toPrecision(5));
                year.moons[0].phases = [
                    {name: GameSettings.Localize('FSC.Moon.Phase.New'), length: 1, icon: MoonIcons.NewMoon, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingCrescent'), length: phaseLength, icon: MoonIcons.WaxingCrescent, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.FirstQuarter'), length: 1, icon: MoonIcons.FirstQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingGibbous'), length: phaseLength, icon: MoonIcons.WaxingGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.Full'), length: 1, icon: MoonIcons.Full, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningGibbous'), length: phaseLength, icon: MoonIcons.WaningGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.LastQuarter'), length: 1, icon: MoonIcons.LastQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningCrescent'), length: phaseLength, icon: MoonIcons.WaningCrescent, singleDay: false}
                ];

                updated = true;
                break;
            case PredefinedCalendars.GolarianPF1E:
                year.numericRepresentation = 4710;
                year.prefix = '';
                year.postfix = ' AR';
                year.yearZero = 0;
                year.months = [
                    new Month('Abadius', 1, 0, 31),
                    new Month('Calistril', 2, 0, 28, 29),
                    new Month('Pharast', 3, 0, 31),
                    new Month('Gozran', 4, 0, 30),
                    new Month('Desnus', 5, 0, 31),
                    new Month('Sarenith', 6, 0, 30),
                    new Month('Erastus', 7, 0, 31),
                    new Month('Arodus', 8, 0, 31),
                    new Month('Rova', 9, 0, 30),
                    new Month('Lamashan', 10, 0, 31),
                    new Month('Neth', 11, 0, 30),
                    new Month('Kuthona', 12, 0, 31)
                ];
                year.showWeekdayHeadings = true;
                year.firstWeekday = 6;
                year.weekdays = [
                    new Weekday(1, 'Moonday'),
                    new Weekday(2, 'Toilday'),
                    new Weekday(3, 'Wealday'),
                    new Weekday(4, 'Oathday'),
                    new Weekday(5, 'Fireday'),
                    new Weekday(6, 'Starday'),
                    new Weekday(7, 'Sunday')
                ];
                year.seasons = [
                    new Season('Spring', 3, 1),
                    new Season('Summer', 6, 1),
                    new Season('Fall', 9, 1),
                    new Season('Winter', 12, 1)
                ];
                year.time.hoursInDay = 24;
                year.time.minutesInHour = 60;
                year.time.secondsInMinute = 60;
                year.time.gameTimeRatio = 1;
                year.leapYearRule.rule = LeapYearRules.Custom;
                year.leapYearRule.customMod = 8;
                year.months[0].current = true;
                year.months[0].days[0].current = true;
                year.seasons[0].color = "#fffce8";
                year.seasons[1].color = "#f3fff3";
                year.seasons[2].color = "#fff7f2";
                year.seasons[3].color = "#f2f8ff";
                year.seasons[0].sunriseTime = 21600;
                year.seasons[1].sunriseTime = 21600;
                year.seasons[2].sunriseTime = 21600;
                year.seasons[3].sunriseTime = 21600;
                year.seasons[0].sunsetTime = 64800;
                year.seasons[1].sunsetTime = 64800;
                year.seasons[2].sunsetTime = 64800;
                year.seasons[3].sunsetTime = 64800;
                year.moons = [
                    new Moon('Somal', 29.5)
                ];
                year.moons[0].firstNewMoon.yearReset = MoonYearResetOptions.XYears;
                year.moons[0].firstNewMoon.yearX = 4;
                year.moons[0].firstNewMoon.year = 4700;
                year.moons[0].firstNewMoon.month = 1;
                year.moons[0].firstNewMoon.day = 8;
                phaseLength = Number(((year.moons[0].cycleLength - 4) / 4).toPrecision(5));
                year.moons[0].phases = [
                    {name: GameSettings.Localize('FSC.Moon.Phase.New'), length: 1, icon: MoonIcons.NewMoon, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingCrescent'), length: phaseLength, icon: MoonIcons.WaxingCrescent, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.FirstQuarter'), length: 1, icon: MoonIcons.FirstQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingGibbous'), length: phaseLength, icon: MoonIcons.WaxingGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.Full'), length: 1, icon: MoonIcons.Full, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningGibbous'), length: phaseLength, icon: MoonIcons.WaningGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.LastQuarter'), length: 1, icon: MoonIcons.LastQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningCrescent'), length: phaseLength, icon: MoonIcons.WaningCrescent, singleDay: false}
                ];
                year.yearNamesStart = 0;
                year.yearNamingRule = YearNamingRules.Default;
                year.yearNames = [];
                updated = true;
                break;
            case PredefinedCalendars.GolarianPF2E:
                year.numericRepresentation = 4710;
                year.prefix = '';
                year.postfix = ' AR';
                year.yearZero = 2700;
                year.months = [
                    new Month('Abadius', 1, 0, 31),
                    new Month('Calistril', 2, 0, 28, 29),
                    new Month('Pharast', 3, 0, 31),
                    new Month('Gozran', 4, 0, 30),
                    new Month('Desnus', 5, 0, 31),
                    new Month('Sarenith', 6, 0, 30),
                    new Month('Erastus', 7, 0, 31),
                    new Month('Arodus', 8, 0, 31),
                    new Month('Rova', 9, 0, 30),
                    new Month('Lamashan', 10, 0, 31),
                    new Month('Neth', 11, 0, 30),
                    new Month('Kuthona', 12, 0, 31)
                ];
                year.showWeekdayHeadings = true;
                year.firstWeekday = 6;
                year.weekdays = [
                    new Weekday(1, 'Moonday'),
                    new Weekday(2, 'Toilday'),
                    new Weekday(3, 'Wealday'),
                    new Weekday(4, 'Oathday'),
                    new Weekday(5, 'Fireday'),
                    new Weekday(6, 'Starday'),
                    new Weekday(7, 'Sunday')
                ];
                year.seasons = [
                    new Season('Spring', 3, 1),
                    new Season('Summer', 6, 1),
                    new Season('Fall', 9, 1),
                    new Season('Winter', 12, 1)
                ];
                year.time.hoursInDay = 24;
                year.time.minutesInHour = 60;
                year.time.secondsInMinute = 60;
                year.time.gameTimeRatio = 1;
                year.leapYearRule.rule = LeapYearRules.Custom;
                year.leapYearRule.customMod = 4;
                year.months[0].current = true;
                year.months[0].days[0].current = true;
                year.seasons[0].color = "#fffce8";
                year.seasons[1].color = "#f3fff3";
                year.seasons[2].color = "#fff7f2";
                year.seasons[3].color = "#f2f8ff";
                year.seasons[0].sunriseTime = 21600;
                year.seasons[1].sunriseTime = 21600;
                year.seasons[2].sunriseTime = 21600;
                year.seasons[3].sunriseTime = 21600;
                year.seasons[0].sunsetTime = 64800;
                year.seasons[1].sunsetTime = 64800;
                year.seasons[2].sunsetTime = 64800;
                year.seasons[3].sunsetTime = 64800;
                year.moons = [
                    new Moon('Somal', 29.5)
                ];
                year.moons[0].firstNewMoon.yearReset = MoonYearResetOptions.XYears;
                year.moons[0].firstNewMoon.yearX = 4;
                year.moons[0].firstNewMoon.year = 4700;
                year.moons[0].firstNewMoon.month = 1;
                year.moons[0].firstNewMoon.day = 8;
                phaseLength = Number(((year.moons[0].cycleLength - 4) / 4).toPrecision(5));
                year.moons[0].phases = [
                    {name: GameSettings.Localize('FSC.Moon.Phase.New'), length: 1, icon: MoonIcons.NewMoon, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingCrescent'), length: phaseLength, icon: MoonIcons.WaxingCrescent, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.FirstQuarter'), length: 1, icon: MoonIcons.FirstQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingGibbous'), length: phaseLength, icon: MoonIcons.WaxingGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.Full'), length: 1, icon: MoonIcons.Full, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningGibbous'), length: phaseLength, icon: MoonIcons.WaningGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.LastQuarter'), length: 1, icon: MoonIcons.LastQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningCrescent'), length: phaseLength, icon: MoonIcons.WaningCrescent, singleDay: false}
                ];
                year.yearNamesStart = 0;
                year.yearNamingRule = YearNamingRules.Default;
                year.yearNames = [];
                updated = true;
                break;
            case PredefinedCalendars.Greyhawk:
                year.numericRepresentation = 591 ;
                year.prefix = '';
                year.postfix = ' cy';
                year.yearZero = 0;
                year.months = [
                    new Month('Needfest', -1, 0, 7),
                    new Month('Fireseek', 1, 0, 28),
                    new Month('Readying', 2, 0, 28),
                    new Month('Coldeven', 3, 0, 28),
                    new Month('Growfest', -2, 0, 7),
                    new Month('Planting', 4, 0, 28),
                    new Month('Flocktime', 5, 0, 28),
                    new Month('Wealsun', 6, 0, 28),
                    new Month('Richfest', -3, 0, 7),
                    new Month('Reaping', 7, 0, 28),
                    new Month('Goodmonth', 8, 0, 28),
                    new Month('Harvester', 9, 0, 28),
                    new Month('Brewfest', -4, 0, 7),
                    new Month('Patchwall', 10, 0, 28),
                    new Month('Ready\'reat', 11, 0, 28),
                    new Month('Sunsebb', 12, 0, 28),
                ];
                year.months[0].intercalary = true;
                year.months[4].intercalary = true;
                year.months[8].intercalary = true;
                year.months[12].intercalary = true;
                year.showWeekdayHeadings = true;
                year.firstWeekday = 0;
                year.weekdays = [
                    new Weekday(1, 'Starday'),
                    new Weekday(2, 'Sunday'),
                    new Weekday(3, 'Moonday'),
                    new Weekday(4, 'Godsday'),
                    new Weekday(5, 'Waterday'),
                    new Weekday(6, 'Earthday'),
                    new Weekday(7, 'Freeday')
                ];
                year.seasons = [
                    new Season('Spring', 2, 1),
                    new Season('Low Summer', 4, 1),
                    new Season('High Summer', 7, 1),
                    new Season('Fall', 10, 1),
                    new Season('Winter', 12, 1)
                ];
                year.seasons[0].color = "#fffce8";
                year.seasons[1].color = "#f3fff3";
                year.seasons[2].color = "#f3fff3";
                year.seasons[3].color = "#fff7f2";
                year.seasons[4].color = "#f2f8ff";
                year.seasons[0].sunriseTime = 24300;
                year.seasons[1].sunriseTime = 18840;
                year.seasons[2].sunriseTime = 16500;
                year.seasons[3].sunriseTime = 20400;
                year.seasons[4].sunriseTime = 25740;
                year.seasons[0].sunsetTime = 48360;
                year.seasons[1].sunsetTime = 66540;
                year.seasons[2].sunsetTime = 69540;
                year.seasons[3].sunsetTime = 64140;
                year.seasons[4].sunsetTime = 59160;
                year.time.hoursInDay = 24;
                year.time.minutesInHour = 60;
                year.time.secondsInMinute = 60;
                year.time.gameTimeRatio = 1;
                year.leapYearRule.rule = LeapYearRules.None;
                year.leapYearRule.customMod = 0;
                year.months[0].current = true;
                year.months[0].days[0].current = true;
                year.moons = [
                    new Moon('Luna', 28),
                    new Moon('Celene', 91)
                ];
                year.moons[0].firstNewMoon.yearReset = MoonYearResetOptions.None;
                year.moons[0].firstNewMoon.year = 590;
                year.moons[0].firstNewMoon.month = 1;
                year.moons[0].firstNewMoon.day = 25;
                phaseLength = Number(((year.moons[0].cycleLength - 4) / 4).toPrecision(5));
                year.moons[0].phases = [
                    {name: GameSettings.Localize('FSC.Moon.Phase.New'), length: 1, icon: MoonIcons.NewMoon, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingCrescent'), length: phaseLength, icon: MoonIcons.WaxingCrescent, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.FirstQuarter'), length: 1, icon: MoonIcons.FirstQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingGibbous'), length: phaseLength, icon: MoonIcons.WaxingGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.Full'), length: 1, icon: MoonIcons.Full, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningGibbous'), length: phaseLength, icon: MoonIcons.WaningGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.LastQuarter'), length: 1, icon: MoonIcons.LastQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningCrescent'), length: phaseLength, icon: MoonIcons.WaningCrescent, singleDay: false}
                ];
                year.moons[1].color = '#7FFFD4';
                year.moons[1].firstNewMoon.yearReset = MoonYearResetOptions.None;
                year.moons[1].firstNewMoon.year = 590;
                year.moons[1].firstNewMoon.month = 2;
                year.moons[1].firstNewMoon.day = 12;
                phaseLength = Number(((year.moons[1].cycleLength - 4) / 4).toPrecision(5));
                year.moons[1].phases = [
                    {name: GameSettings.Localize('FSC.Moon.Phase.New'), length: 1, icon: MoonIcons.NewMoon, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingCrescent'), length: phaseLength, icon: MoonIcons.WaxingCrescent, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.FirstQuarter'), length: 1, icon: MoonIcons.FirstQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingGibbous'), length: phaseLength, icon: MoonIcons.WaxingGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.Full'), length: 1, icon: MoonIcons.Full, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningGibbous'), length: phaseLength, icon: MoonIcons.WaningGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.LastQuarter'), length: 1, icon: MoonIcons.LastQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningCrescent'), length: phaseLength, icon: MoonIcons.WaningCrescent, singleDay: false}
                ];
                year.yearNamesStart = 0;
                year.yearNamingRule = YearNamingRules.Default;
                year.yearNames = [];
                updated = true;
                break;
            case PredefinedCalendars.Harptos:
                year.numericRepresentation = 1495;
                year.prefix = '';
                year.postfix = ' DR';
                year.yearZero = 0;
                year.months = [
                    new Month('Hammer', 1, 0, 30),
                    new Month('Midwinter', -1, 0, 1),
                    new Month('Alturiak', 2, 0, 30),
                    new Month('Ches', 3, 0, 30),
                    new Month('Tarsakh', 4, 0, 30),
                    new Month('Greengrass', -2, 0, 1),
                    new Month('Mirtul', 5, 0, 30),
                    new Month('Kythorn', 6, 0, 30),
                    new Month('Flamerule', 7, 0, 30),
                    new Month('Midsummer', -3, 0, 1),
                    new Month('Shieldmeet', -4, 0, 0, 1),
                    new Month('Eleasis', 8, 0, 30),
                    new Month('Eleint', 9, 0, 30),
                    new Month('Higharvestide', -5, 0, 1),
                    new Month('Marpenoth', 10, 0, 30),
                    new Month('Uktar', 11, 0, 30),
                    new Month('Feast Of the Moon', -6, 0, 1),
                    new Month('Nightal', 12, 0, 30)
                ];
                year.months[1].intercalary = true;
                year.months[5].intercalary = true;
                year.months[9].intercalary = true;
                year.months[10].intercalary = true;
                year.months[13].intercalary = true;
                year.months[16].intercalary = true;
                year.showWeekdayHeadings = false;
                year.firstWeekday = 0;
                year.weekdays = [
                    new Weekday(1, '1st'),
                    new Weekday(2, '2nd'),
                    new Weekday(3, '3rd'),
                    new Weekday(4, '4th'),
                    new Weekday(5, '5th'),
                    new Weekday(6, '6th'),
                    new Weekday(7, '7th'),
                    new Weekday(8, '8th'),
                    new Weekday(9, '9th'),
                    new Weekday(10, '10th')
                ];
                year.seasons = [
                    new Season('Spring', 3, 19),
                    new Season('Summer', 6, 20),
                    new Season('Fall', 9, 21),
                    new Season('Winter', 12, 20)
                ];
                year.seasons[0].color = "#fffce8";
                year.seasons[1].color = "#f3fff3";
                year.seasons[2].color = "#fff7f2";
                year.seasons[3].color = "#f2f8ff";
                year.seasons[0].sunriseTime = 21600;
                year.seasons[1].sunriseTime = 21600;
                year.seasons[2].sunriseTime = 21600;
                year.seasons[3].sunriseTime = 21600;
                year.seasons[0].sunsetTime = 64800;
                year.seasons[1].sunsetTime = 64800;
                year.seasons[2].sunsetTime = 64800;
                year.seasons[3].sunsetTime = 64800;
                year.time.hoursInDay = 24;
                year.time.minutesInHour = 60;
                year.time.secondsInMinute = 60;
                year.time.gameTimeRatio = 1;
                year.leapYearRule.rule = LeapYearRules.Custom;
                year.leapYearRule.customMod = 4;
                year.months[0].current = true;
                year.months[0].days[0].current = true;
                year.moons = [
                    new Moon('Selûne', 30.45)
                ];
                year.moons[0].firstNewMoon.yearReset = MoonYearResetOptions.LeapYear;
                year.moons[0].firstNewMoon.year = 1372;
                year.moons[0].firstNewMoon.month = 1;
                year.moons[0].firstNewMoon.day = 16;
                year.moons[0].cycleDayAdjust = 0.5;
                phaseLength = Number(((year.moons[0].cycleLength - 4) / 4).toPrecision(5));
                year.moons[0].phases = [
                    {name: GameSettings.Localize('FSC.Moon.Phase.New'), length: 1, icon: MoonIcons.NewMoon, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingCrescent'), length: phaseLength, icon: MoonIcons.WaxingCrescent, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.FirstQuarter'), length: 1, icon: MoonIcons.FirstQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingGibbous'), length: phaseLength, icon: MoonIcons.WaxingGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.Full'), length: 1, icon: MoonIcons.Full, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningGibbous'), length: phaseLength, icon: MoonIcons.WaningGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.LastQuarter'), length: 1, icon: MoonIcons.LastQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningCrescent'), length: phaseLength, icon: MoonIcons.WaningCrescent, singleDay: false}
                ];
                year.yearNamesStart = 0;
                year.yearNamingRule = YearNamingRules.Default;
                year.yearNames = [];
                updated = true;
                break;
            case PredefinedCalendars.TravellerImperialCalendar:
                year.numericRepresentation = 1000;
                year.prefix = '';
                year.postfix = '';
                year.yearZero = 0;
                year.months = [
                    new Month('Holiday', -1, 0, 1),
                    new Month('Year', 1,1, 364)
                ];
                year.months[0].intercalary = true;
                year.showWeekdayHeadings = true;
                year.firstWeekday = 0;
                year.weekdays = [
                    new Weekday(1, 'Wonday'),
                    new Weekday(2, 'Tuday'),
                    new Weekday(3, 'Thirday'),
                    new Weekday(4, 'Forday'),
                    new Weekday(5, 'Fiday'),
                    new Weekday(6, 'Sixday'),
                    new Weekday(7, 'Senday')
                ];
                year.seasons = [];
                year.time.hoursInDay = 24;
                year.time.minutesInHour = 60;
                year.time.secondsInMinute = 60;
                year.time.gameTimeRatio = 1;
                year.leapYearRule.rule = LeapYearRules.None;
                year.leapYearRule.customMod = 0;
                year.months[0].current = true;
                year.months[0].days[0].current = true;
                year.moons = [];
                year.yearNamesStart = 0;
                year.yearNamingRule = YearNamingRules.Default;
                year.yearNames = [];
                updated = true;
                break;
            case PredefinedCalendars.WarhammerImperialCalendar:
                year.numericRepresentation = 2522;
                year.prefix = '';
                year.postfix = '';
                year.yearZero = 0;
                year.months = [
                    new Month('Hexenstag', -1, 0, 1),
                    new Month('Nachexen', 1, 0, 32),
                    new Month('Jahrdrung', 2, 0, 33),
                    new Month('Mitterfruhl', -2, 0, 1),
                    new Month('Pflugzeit', 3, 0, 33),
                    new Month('Sigmarzeit', 4, 0, 33),
                    new Month('Sommerzeit', 5, 0, 33),
                    new Month('Sonnstill', -3, 0, 1),
                    new Month('Vorgeheim', 6, 0, 33),
                    new Month('Geheimnistag', -4, 0, 1),
                    new Month('Nachgeheim', 7, 0, 32),
                    new Month('Erntezeit', 8, 0, 33),
                    new Month('Mittherbst', -5, 0, 1),
                    new Month('Brauzeit', 9, 0, 33),
                    new Month('Kaldezeit', 10, 0, 33),
                    new Month('Ulriczeit', 11, 0, 33),
                    new Month('Mondstille', -6, 0, 1),
                    new Month('Vorhexen', 12, 0, 33)
                ];
                year.months[0].intercalary = true;
                year.months[3].intercalary = true;
                year.months[7].intercalary = true;
                year.months[9].intercalary = true;
                year.months[12].intercalary = true;
                year.months[16].intercalary = true;
                year.showWeekdayHeadings = true;
                year.firstWeekday = 0;
                year.weekdays = [
                    new Weekday(1, 'Wellentag'),
                    new Weekday(2, 'Aubentag'),
                    new Weekday(3, 'Marktag'),
                    new Weekday(4, 'Backertag'),
                    new Weekday(5, 'Bezahltag'),
                    new Weekday(6, 'Konistag'),
                    new Weekday(7, 'Angestag'),
                    new Weekday(8, 'Festag')
                ];
                year.seasons = [
                    new Season('Spring', 3, 20),
                    new Season('Summer', 6, 20),
                    new Season('Fall', 9, 22),
                    new Season('Winter', 12, 21)
                ];
                year.seasons[0].color = "#fffce8";
                year.seasons[1].color = "#f3fff3";
                year.seasons[2].color = "#fff7f2";
                year.seasons[3].color = "#f2f8ff";
                year.seasons[0].sunriseTime = 21600;
                year.seasons[1].sunriseTime = 21600;
                year.seasons[2].sunriseTime = 21600;
                year.seasons[3].sunriseTime = 21600;
                year.seasons[0].sunsetTime = 64800;
                year.seasons[1].sunsetTime = 64800;
                year.seasons[2].sunsetTime = 64800;
                year.seasons[3].sunsetTime = 64800;
                year.time.hoursInDay = 24;
                year.time.minutesInHour = 60;
                year.time.secondsInMinute = 60;
                year.time.gameTimeRatio = 1;
                year.leapYearRule.rule = LeapYearRules.None;
                year.leapYearRule.customMod = 0;
                year.months[0].current = true;
                year.months[0].days[0].current = true;
                year.moons = [
                    new Moon('Luna', 25)
                ];
                year.moons[0].firstNewMoon.yearReset = MoonYearResetOptions.None;
                year.moons[0].firstNewMoon.year = 2522;
                year.moons[0].firstNewMoon.month = 1;
                year.moons[0].firstNewMoon.day = 13;
                phaseLength = Number(((year.moons[0].cycleLength - 4) / 4).toPrecision(5));
                year.moons[0].phases = [
                    {name: GameSettings.Localize('FSC.Moon.Phase.New'), length: 1, icon: MoonIcons.NewMoon, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingCrescent'), length: phaseLength, icon: MoonIcons.WaxingCrescent, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.FirstQuarter'), length: 1, icon: MoonIcons.FirstQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingGibbous'), length: phaseLength, icon: MoonIcons.WaxingGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.Full'), length: 1, icon: MoonIcons.Full, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningGibbous'), length: phaseLength, icon: MoonIcons.WaningGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.LastQuarter'), length: 1, icon: MoonIcons.LastQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningCrescent'), length: phaseLength, icon: MoonIcons.WaningCrescent, singleDay: false}
                ];
                year.yearNamesStart = 0;
                year.yearNamingRule = YearNamingRules.Default;
                year.yearNames = [];
                updated = true;
                break;
        }
        return updated;
    }
}
