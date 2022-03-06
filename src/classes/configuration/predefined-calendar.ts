import {LeapYearRules, MoonYearResetOptions, Icons, PredefinedCalendars, YearNamingRules} from "../../constants";
import Month from "../calendar/month";
import {Weekday} from "../calendar/weekday";
import Season from "../calendar/season";
import Moon from "../calendar/moon";
import Calendar from "../calendar";


export default class PredefinedCalendar{
    
    public static setToPredefined(calendar: Calendar, calendarType: PredefinedCalendars){
        let phaseLength = 0;
        let updated = false;
        switch (calendarType){
            case PredefinedCalendars.Gregorian:
                const currentDate = new Date();
                calendar.year.numericRepresentation = currentDate.getFullYear();
                calendar.year.prefix = '';
                calendar.year.postfix = '';
                calendar.year.yearZero = 1970;
                calendar.year.months = [
                    new Month("January", 1, 0, 31),
                    new Month("February", 2, 0, 28, 29),
                    new Month("March",3, 0, 31),
                    new Month("April",4, 0, 30),
                    new Month("May",5, 0, 31),
                    new Month("June",6, 0, 30),
                    new Month("July", 7, 0, 31),
                    new Month("August",8, 0, 31),
                    new Month("September",9, 0, 30),
                    new Month("October", 10, 0, 31),
                    new Month("November", 11, 0, 30),
                    new Month("December", 12, 0, 31),
                ];
                calendar.year.showWeekdayHeadings = true;
                calendar.year.firstWeekday = 4;
                calendar.weekdays = [
                    new Weekday(1, 'Sunday'),
                    new Weekday(2, 'Monday'),
                    new Weekday(3, 'Tuesday'),
                    new Weekday(4, 'Wednesday'),
                    new Weekday(5, 'Thursday'),
                    new Weekday(6, 'Friday'),
                    new Weekday(7, 'Saturday')
                ];
                calendar.seasons = [
                    new Season('Spring', 2, 19),
                    new Season('Summer', 5, 19),
                    new Season('Fall', 8, 21),
                    new Season('Winter', 11, 20)
                ];
                calendar.time.hoursInDay = 24;
                calendar.time.minutesInHour = 60;
                calendar.time.secondsInMinute = 60;
                calendar.time.gameTimeRatio = 1;
                calendar.year.leapYearRule.rule = LeapYearRules.Gregorian;
                calendar.year.leapYearRule.customMod = 0;
                calendar.year.months[currentDate.getMonth()].current = true;
                calendar.year.months[currentDate.getMonth()].days[currentDate.getDate()-1].current = true;
                calendar.seasons[0].color = "#E0C40B";
                calendar.seasons[1].color = "#46B946";
                calendar.seasons[2].color = "#FF8E47";
                calendar.seasons[3].color = "#479DFF";
                calendar.seasons[0].sunriseTime = 21600;
                calendar.seasons[1].sunriseTime = 21600;
                calendar.seasons[2].sunriseTime = 21600;
                calendar.seasons[3].sunriseTime = 21600;
                calendar.seasons[0].sunsetTime = 64800;
                calendar.seasons[1].sunsetTime = 64800;
                calendar.seasons[2].sunsetTime = 64800;
                calendar.seasons[3].sunsetTime = 64800;
                calendar.moons = [
                    new Moon('Moon', 29.53059)
                ];
                calendar.moons[0].firstNewMoon.yearReset = MoonYearResetOptions.None;
                calendar.moons[0].firstNewMoon.year = 2000;
                calendar.moons[0].firstNewMoon.month = 0;
                calendar.moons[0].firstNewMoon.day = 5;
                calendar.moons[0].cycleDayAdjust = 0.5;
                phaseLength = Number(((calendar.moons[0].cycleLength - 4) / 4).toPrecision(5));
                calendar.moons[0].phases = [
                    {name: "New Moon", length: 1, icon: Icons.NewMoon, singleDay: true},
                    {name: "Waxing Crescent", length: phaseLength, icon: Icons.WaxingCrescent, singleDay: false},
                    {name: "First Quarter", length: 1, icon: Icons.FirstQuarter, singleDay: true},
                    {name: "Waxing Gibbous", length: phaseLength, icon: Icons.WaxingGibbous, singleDay: false},
                    {name: "Full Moon", length: 1, icon: Icons.Full, singleDay: true},
                    {name: "Waning Gibbous", length: phaseLength, icon: Icons.WaningGibbous, singleDay: false},
                    {name: "Last Quarter", length: 1, icon: Icons.LastQuarter, singleDay: true},
                    {name: "Waning Crescent", length: phaseLength, icon: Icons.WaningCrescent, singleDay: false}
                ];
                calendar.year.yearNamesStart = 0;
                calendar.year.yearNamingRule = YearNamingRules.Default;
                calendar.year.yearNames = [];
                updated = true;
                break;
            case PredefinedCalendars.DarkSun:
                calendar.year.numericRepresentation = 1;
                calendar.year.prefix = '';
                calendar.year.postfix = '';
                calendar.year.yearZero = 0;
                calendar.year.months = [
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
                calendar.year.months[4].intercalary = true;
                calendar.year.months[9].intercalary = true;
                calendar.year.months[14].intercalary = true;
                calendar.year.showWeekdayHeadings = false;
                calendar.year.firstWeekday = 0;
                calendar.weekdays = [
                    new Weekday(1, '1 Day'),
                    new Weekday(2, '2 Day'),
                    new Weekday(3, '3 Day'),
                    new Weekday(4, '4 Day'),
                    new Weekday(5, '5 Day'),
                    new Weekday(6, '6 Day')
                ];
                calendar.seasons = [
                    new Season("Sun Descending", 2, 0),
                    new Season("Sun Ascending", 6, 0),
                    new Season("High Sun", 8, 0)
                ];
                calendar.seasons[2].color = '#ffa500';
                calendar.seasons[0].color = '#cd4a39';
                calendar.seasons[1].color = '#ff6a00';
                calendar.seasons[0].sunriseTime = 21600;
                calendar.seasons[1].sunriseTime = 21600;
                calendar.seasons[2].sunriseTime = 21600;
                calendar.seasons[0].sunsetTime = 64800;
                calendar.seasons[1].sunsetTime = 64800;
                calendar.seasons[2].sunsetTime = 64800;
                calendar.time.hoursInDay = 24;
                calendar.time.minutesInHour = 60;
                calendar.time.secondsInMinute = 60;
                calendar.time.gameTimeRatio = 1;
                calendar.year.leapYearRule.rule = LeapYearRules.None;
                calendar.year.leapYearRule.customMod = 0;
                calendar.year.months[0].current = true;
                calendar.year.months[0].days[0].current = true;
                calendar.moons = [
                    new Moon('Ral', 34),
                    new Moon('Guthay', 125)
                ];
                calendar.moons[0].color = "#7ace57";
                calendar.moons[0].firstNewMoon.yearReset = MoonYearResetOptions.None;
                calendar.moons[0].firstNewMoon.year = 1;
                calendar.moons[0].firstNewMoon.month = 0;
                calendar.moons[0].firstNewMoon.day = 13;
                phaseLength = Number(((calendar.moons[0].cycleLength - 4) / 4).toPrecision(5));
                calendar.moons[0].phases = [
                    {name: "New Moon", length: 1, icon: Icons.NewMoon, singleDay: true},
                    {name: "Waxing Crescent", length: phaseLength, icon: Icons.WaxingCrescent, singleDay: false},
                    {name: "First Quarter", length: 1, icon: Icons.FirstQuarter, singleDay: true},
                    {name: "Waxing Gibbous", length: phaseLength, icon: Icons.WaxingGibbous, singleDay: false},
                    {name: "Full Moon", length: 1, icon: Icons.Full, singleDay: true},
                    {name: "Waning Gibbous", length: phaseLength, icon: Icons.WaningGibbous, singleDay: false},
                    {name: "Last Quarter", length: 1, icon: Icons.LastQuarter, singleDay: true},
                    {name: "Waning Crescent", length: phaseLength, icon: Icons.WaningCrescent, singleDay: false}
                ];
                calendar.moons[1].color = "#ffd920";
                calendar.moons[1].firstNewMoon.yearReset = MoonYearResetOptions.None;
                calendar.moons[1].firstNewMoon.year = 1;
                calendar.moons[1].firstNewMoon.month = 2;
                calendar.moons[1].firstNewMoon.day = 2;
                phaseLength = Number(((calendar.moons[1].cycleLength - 4) / 4).toPrecision(5));
                calendar.moons[1].phases = [
                    {name: "New Moon", length: 1, icon: Icons.NewMoon, singleDay: true},
                    {name: "Waxing Crescent", length: phaseLength, icon: Icons.WaxingCrescent, singleDay: false},
                    {name: "First Quarter", length: 1, icon: Icons.FirstQuarter, singleDay: true},
                    {name: "Waxing Gibbous", length: phaseLength, icon: Icons.WaxingGibbous, singleDay: false},
                    {name: "Full Moon", length: 1, icon: Icons.Full, singleDay: true},
                    {name: "Waning Gibbous", length: phaseLength, icon: Icons.WaningGibbous, singleDay: false},
                    {name: "Last Quarter", length: 1, icon: Icons.LastQuarter, singleDay: true},
                    {name: "Waning Crescent", length: phaseLength, icon: Icons.WaningCrescent, singleDay: false}
                ];
                calendar.year.yearNamesStart = -101;
                calendar.year.yearNamingRule = YearNamingRules.Repeat;
                calendar.year.yearNames = [
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
                calendar.year.numericRepresentation = 998;
                calendar.year.prefix = '';
                calendar.year.postfix = ' YK';
                calendar.year.yearZero = 0;
                calendar.year.months = [
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
                calendar.year.showWeekdayHeadings = true;
                calendar.year.firstWeekday = 0;
                calendar.weekdays = [
                    new Weekday(1, 'Sul'),
                    new Weekday(2, 'Mol'),
                    new Weekday(3, 'Zol'),
                    new Weekday(4, 'Wir'),
                    new Weekday(5, 'Zor'),
                    new Weekday(6, 'Far'),
                    new Weekday(7, 'Sar')
                ];
                calendar.seasons = [];
                calendar.time.hoursInDay = 24;
                calendar.time.minutesInHour = 60;
                calendar.time.secondsInMinute = 60;
                calendar.time.gameTimeRatio = 1;
                calendar.year.leapYearRule.rule = LeapYearRules.None;
                calendar.year.leapYearRule.customMod = 0;
                calendar.year.months[0].current = true;
                calendar.year.months[0].days[0].current = true;
                calendar.moons = []; //TODO: Maybe add all 12 moons?
                calendar.year.yearNamesStart = 0;
                calendar.year.yearNamingRule = YearNamingRules.Default;
                calendar.year.yearNames = [];
                updated = true;
                break;
            case PredefinedCalendars.Exandrian:
                calendar.year.numericRepresentation = 812;
                calendar.year.prefix = '';
                calendar.year.postfix = ' P.D.';
                calendar.year.yearZero = 0;
                calendar.year.months = [
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
                calendar.year.showWeekdayHeadings = true;
                calendar.year.firstWeekday = 3;
                calendar.weekdays = [
                    new Weekday(1, 'Miresen'),
                    new Weekday(2, 'Grissen'),
                    new Weekday(3, 'Whelsen'),
                    new Weekday(4, 'Conthsen'),
                    new Weekday(5, 'Folsen'),
                    new Weekday(6, 'Yulisen'),
                    new Weekday(7, 'Da\'leysen')
                ];
                calendar.seasons = [
                    new Season('Spring', 2, 12),
                    new Season('Summer', 4, 25),
                    new Season('Autumn', 7, 2),
                    new Season('Winter', 10, 1)
                ];
                calendar.time.hoursInDay = 24;
                calendar.time.minutesInHour = 60;
                calendar.time.secondsInMinute = 60;
                calendar.time.gameTimeRatio = 1;
                calendar.year.leapYearRule.rule = LeapYearRules.None;
                calendar.year.leapYearRule.customMod = 0;
                calendar.year.months[0].current = true;
                calendar.year.months[0].days[0].current = true;
                calendar.seasons[0].color = "#E0C40B";
                calendar.seasons[1].color = "#46B946";
                calendar.seasons[2].color = "#FF8E47";
                calendar.seasons[3].color = "#479DFF";
                calendar.seasons[0].sunriseTime = 27000;
                calendar.seasons[1].sunriseTime = 21600;
                calendar.seasons[2].sunriseTime = 27000;
                calendar.seasons[3].sunriseTime = 32400;
                calendar.seasons[0].sunsetTime = 64800;
                calendar.seasons[1].sunsetTime = 75600;
                calendar.seasons[2].sunsetTime = 64800;
                calendar.seasons[3].sunsetTime = 54000;
                calendar.moons = [
                    new Moon('Catha', 33),
                    new Moon('Ruidus', 328)
                ];
                calendar.moons[0].firstNewMoon.yearReset = MoonYearResetOptions.None;
                calendar.moons[0].firstNewMoon.year = 810;
                calendar.moons[0].firstNewMoon.month = 0;
                calendar.moons[0].firstNewMoon.day = 8;
                phaseLength = Number(((calendar.moons[0].cycleLength - 4) / 4).toPrecision(5));
                calendar.moons[0].phases = [
                    {name: "New Moon", length: 1, icon: Icons.NewMoon, singleDay: true},
                    {name: "Waxing Crescent", length: phaseLength, icon: Icons.WaxingCrescent, singleDay: false},
                    {name: "First Quarter", length: 1, icon: Icons.FirstQuarter, singleDay: true},
                    {name: "Waxing Gibbous", length: phaseLength, icon: Icons.WaxingGibbous, singleDay: false},
                    {name: "Full Moon", length: 1, icon: Icons.Full, singleDay: true},
                    {name: "Waning Gibbous", length: phaseLength, icon: Icons.WaningGibbous, singleDay: false},
                    {name: "Last Quarter", length: 1, icon: Icons.LastQuarter, singleDay: true},
                    {name: "Waning Crescent", length: phaseLength, icon: Icons.WaningCrescent, singleDay: false}
                ];
                calendar.moons[1].color = "#ab82f3";
                calendar.moons[1].firstNewMoon.yearReset = MoonYearResetOptions.None;
                calendar.moons[1].firstNewMoon.year = 810;
                calendar.moons[1].firstNewMoon.month = 2;
                calendar.moons[1].firstNewMoon.day = 21;
                phaseLength = Number(((calendar.moons[1].cycleLength - 4) / 4).toPrecision(5));
                calendar.moons[1].phases = [
                    {name: "New Moon", length: 1, icon: Icons.NewMoon, singleDay: true},
                    {name: "Waxing Crescent", length: phaseLength, icon: Icons.WaxingCrescent, singleDay: false},
                    {name: "First Quarter", length: 1, icon: Icons.FirstQuarter, singleDay: true},
                    {name: "Waxing Gibbous", length: phaseLength, icon: Icons.WaxingGibbous, singleDay: false},
                    {name: "Full Moon", length: 1, icon: Icons.Full, singleDay: true},
                    {name: "Waning Gibbous", length: phaseLength, icon: Icons.WaningGibbous, singleDay: false},
                    {name: "Last Quarter", length: 1, icon: Icons.LastQuarter, singleDay: true},
                    {name: "Waning Crescent", length: phaseLength, icon: Icons.WaningCrescent, singleDay: false}
                ];
                calendar.year.yearNamesStart = 0;
                calendar.year.yearNamingRule = YearNamingRules.Default;
                calendar.year.yearNames = [];
                updated = true;
                break;
            case PredefinedCalendars.ForbiddenLands:
                calendar.year.numericRepresentation = 1165;
                calendar.year.prefix = '';
                calendar.year.postfix = ' AS';
                calendar.year.yearZero = 0;
                calendar.year.showWeekdayHeadings = true;
                calendar.year.firstWeekday = 0;
                calendar.year.yearNames = [];
                calendar.year.yearNamesStart = 0;
                calendar.year.yearNamingRule = YearNamingRules.Default;

                calendar.year.months = [
                    new Month('Winterwane', 1, 0, 46),
                    new Month('Springrise', 2, 0, 45),
                    new Month('Springwane', 3, 0, 46),
                    new Month('Sumerrise', 4, 0, 45),
                    new Month('Summerwane', 5, 0, 46),
                    new Month('Fallrise', 6, 0, 45),
                    new Month('Fallwane', 7, 0, 46),
                    new Month('Winterrise', 8, 0, 45)
                ];

                calendar.weekdays = [
                    new Weekday(1, 'Sunday'),
                    new Weekday(2, 'Moonday'),
                    new Weekday(3, 'Bloodday'),
                    new Weekday(4, 'Earthday'),
                    new Weekday(5, 'Growthday'),
                    new Weekday(6, 'Feastday'),
                    new Weekday(7, 'Stillday')
                ];

                calendar.seasons = [
                    new Season('Spring', 1, 0),
                    new Season('Summer', 3, 0),
                    new Season('Fall', 5, 0),
                    new Season('Winter', 7, 0)
                ];
                calendar.seasons[0].color = "#acffac";
                calendar.seasons[1].color = "#ff9393";
                calendar.seasons[2].color = "#ffdf99";
                calendar.seasons[3].color = "#a8a8ff";
                calendar.seasons[0].sunriseTime = 21600;
                calendar.seasons[1].sunriseTime = 21600;
                calendar.seasons[2].sunriseTime = 21600;
                calendar.seasons[3].sunriseTime = 21600;
                calendar.seasons[0].sunsetTime = 64800;
                calendar.seasons[1].sunsetTime = 64800;
                calendar.seasons[2].sunsetTime = 64800;
                calendar.seasons[3].sunsetTime = 64800;

                calendar.time.hoursInDay = 24;
                calendar.time.minutesInHour = 60;
                calendar.time.secondsInMinute = 60;
                calendar.time.gameTimeRatio = 1;
                calendar.year.leapYearRule.rule = LeapYearRules.None;
                calendar.year.leapYearRule.customMod = 0;

                calendar.year.months[1].current = true;
                calendar.year.months[1].days[0].current = true;

                calendar.moons = [
                    new Moon('Moon', 30)
                ];
                calendar.moons[0].firstNewMoon.yearReset = MoonYearResetOptions.None;
                calendar.moons[0].firstNewMoon.year = 0;
                calendar.moons[0].firstNewMoon.month = 0;
                calendar.moons[0].firstNewMoon.day = 0;
                calendar.moons[0].cycleDayAdjust = 0;
                phaseLength = Number(((calendar.moons[0].cycleLength - 4) / 4).toPrecision(5));
                calendar.moons[0].phases = [
                    {name: "New Moon", length: 1, icon: Icons.NewMoon, singleDay: true},
                    {name: "Waxing Crescent", length: phaseLength, icon: Icons.WaxingCrescent, singleDay: false},
                    {name: "First Quarter", length: 1, icon: Icons.FirstQuarter, singleDay: true},
                    {name: "Waxing Gibbous", length: phaseLength, icon: Icons.WaxingGibbous, singleDay: false},
                    {name: "Full Moon", length: 1, icon: Icons.Full, singleDay: true},
                    {name: "Waning Gibbous", length: phaseLength, icon: Icons.WaningGibbous, singleDay: false},
                    {name: "Last Quarter", length: 1, icon: Icons.LastQuarter, singleDay: true},
                    {name: "Waning Crescent", length: phaseLength, icon: Icons.WaningCrescent, singleDay: false}
                ];

                updated = true;
                break;
            case PredefinedCalendars.GolarianPF1E:
                calendar.year.numericRepresentation = 4710;
                calendar.year.prefix = '';
                calendar.year.postfix = ' AR';
                calendar.year.yearZero = 0;
                calendar.year.months = [
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
                calendar.year.showWeekdayHeadings = true;
                calendar.year.firstWeekday = 6;
                calendar.weekdays = [
                    new Weekday(1, 'Moonday'),
                    new Weekday(2, 'Toilday'),
                    new Weekday(3, 'Wealday'),
                    new Weekday(4, 'Oathday'),
                    new Weekday(5, 'Fireday'),
                    new Weekday(6, 'Starday'),
                    new Weekday(7, 'Sunday')
                ];
                calendar.seasons = [
                    new Season('Spring', 2, 0),
                    new Season('Summer', 5, 0),
                    new Season('Fall', 8, 0),
                    new Season('Winter', 11, 0)
                ];
                calendar.time.hoursInDay = 24;
                calendar.time.minutesInHour = 60;
                calendar.time.secondsInMinute = 60;
                calendar.time.gameTimeRatio = 1;
                calendar.year.leapYearRule.rule = LeapYearRules.Custom;
                calendar.year.leapYearRule.customMod = 8;
                calendar.year.months[0].current = true;
                calendar.year.months[0].days[0].current = true;
                calendar.seasons[0].color = "#E0C40B";
                calendar.seasons[1].color = "#46B946";
                calendar.seasons[2].color = "#FF8E47";
                calendar.seasons[3].color = "#479DFF";
                calendar.seasons[0].sunriseTime = 21600;
                calendar.seasons[1].sunriseTime = 21600;
                calendar.seasons[2].sunriseTime = 21600;
                calendar.seasons[3].sunriseTime = 21600;
                calendar.seasons[0].sunsetTime = 64800;
                calendar.seasons[1].sunsetTime = 64800;
                calendar.seasons[2].sunsetTime = 64800;
                calendar.seasons[3].sunsetTime = 64800;
                calendar.moons = [
                    new Moon('Somal', 29.5)
                ];
                calendar.moons[0].firstNewMoon.yearReset = MoonYearResetOptions.XYears;
                calendar.moons[0].firstNewMoon.yearX = 4;
                calendar.moons[0].firstNewMoon.year = 4700;
                calendar.moons[0].firstNewMoon.month = 0;
                calendar.moons[0].firstNewMoon.day = 7;
                phaseLength = Number(((calendar.moons[0].cycleLength - 4) / 4).toPrecision(5));
                calendar.moons[0].phases = [
                    {name: "New Moon", length: 1, icon: Icons.NewMoon, singleDay: true},
                    {name: "Waxing Crescent", length: phaseLength, icon: Icons.WaxingCrescent, singleDay: false},
                    {name: "First Quarter", length: 1, icon: Icons.FirstQuarter, singleDay: true},
                    {name: "Waxing Gibbous", length: phaseLength, icon: Icons.WaxingGibbous, singleDay: false},
                    {name: "Full Moon", length: 1, icon: Icons.Full, singleDay: true},
                    {name: "Waning Gibbous", length: phaseLength, icon: Icons.WaningGibbous, singleDay: false},
                    {name: "Last Quarter", length: 1, icon: Icons.LastQuarter, singleDay: true},
                    {name: "Waning Crescent", length: phaseLength, icon: Icons.WaningCrescent, singleDay: false}
                ];
                calendar.year.yearNamesStart = 0;
                calendar.year.yearNamingRule = YearNamingRules.Default;
                calendar.year.yearNames = [];
                updated = true;
                break;
            case PredefinedCalendars.GolarianPF2E:
                calendar.year.numericRepresentation = 4710;
                calendar.year.prefix = '';
                calendar.year.postfix = ' AR';
                calendar.year.yearZero = 2700;
                calendar.year.months = [
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
                calendar.year.showWeekdayHeadings = true;
                calendar.year.firstWeekday = 6;
                calendar.weekdays = [
                    new Weekday(1, 'Moonday'),
                    new Weekday(2, 'Toilday'),
                    new Weekday(3, 'Wealday'),
                    new Weekday(4, 'Oathday'),
                    new Weekday(5, 'Fireday'),
                    new Weekday(6, 'Starday'),
                    new Weekday(7, 'Sunday')
                ];
                calendar.seasons = [
                    new Season('Spring', 2, 0),
                    new Season('Summer', 5, 0),
                    new Season('Fall', 8, 0),
                    new Season('Winter', 11, 0)
                ];
                calendar.time.hoursInDay = 24;
                calendar.time.minutesInHour = 60;
                calendar.time.secondsInMinute = 60;
                calendar.time.gameTimeRatio = 1;
                calendar.year.leapYearRule.rule = LeapYearRules.Custom;
                calendar.year.leapYearRule.customMod = 4;
                calendar.year.months[0].current = true;
                calendar.year.months[0].days[0].current = true;
                calendar.seasons[0].color = "#E0C40B";
                calendar.seasons[1].color = "#46B946";
                calendar.seasons[2].color = "#FF8E47";
                calendar.seasons[3].color = "#479DFF";
                calendar.seasons[0].sunriseTime = 21600;
                calendar.seasons[1].sunriseTime = 21600;
                calendar.seasons[2].sunriseTime = 21600;
                calendar.seasons[3].sunriseTime = 21600;
                calendar.seasons[0].sunsetTime = 64800;
                calendar.seasons[1].sunsetTime = 64800;
                calendar.seasons[2].sunsetTime = 64800;
                calendar.seasons[3].sunsetTime = 64800;
                calendar.moons = [
                    new Moon('Somal', 29.5)
                ];
                calendar.moons[0].firstNewMoon.yearReset = MoonYearResetOptions.XYears;
                calendar.moons[0].firstNewMoon.yearX = 4;
                calendar.moons[0].firstNewMoon.year = 4700;
                calendar.moons[0].firstNewMoon.month = 0;
                calendar.moons[0].firstNewMoon.day = 7;
                phaseLength = Number(((calendar.moons[0].cycleLength - 4) / 4).toPrecision(5));
                calendar.moons[0].phases = [
                    {name: "New Moon", length: 1, icon: Icons.NewMoon, singleDay: true},
                    {name: "Waxing Crescent", length: phaseLength, icon: Icons.WaxingCrescent, singleDay: false},
                    {name: "First Quarter", length: 1, icon: Icons.FirstQuarter, singleDay: true},
                    {name: "Waxing Gibbous", length: phaseLength, icon: Icons.WaxingGibbous, singleDay: false},
                    {name: "Full Moon", length: 1, icon: Icons.Full, singleDay: true},
                    {name: "Waning Gibbous", length: phaseLength, icon: Icons.WaningGibbous, singleDay: false},
                    {name: "Last Quarter", length: 1, icon: Icons.LastQuarter, singleDay: true},
                    {name: "Waning Crescent", length: phaseLength, icon: Icons.WaningCrescent, singleDay: false}
                ];
                calendar.year.yearNamesStart = 0;
                calendar.year.yearNamingRule = YearNamingRules.Default;
                calendar.year.yearNames = [];
                updated = true;
                break;
            case PredefinedCalendars.Greyhawk:
                calendar.year.numericRepresentation = 591 ;
                calendar.year.prefix = '';
                calendar.year.postfix = ' cy';
                calendar.year.yearZero = 0;
                calendar.year.months = [
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
                calendar.year.months[0].intercalary = true;
                calendar.year.months[4].intercalary = true;
                calendar.year.months[8].intercalary = true;
                calendar.year.months[12].intercalary = true;
                calendar.year.showWeekdayHeadings = true;
                calendar.year.firstWeekday = 0;
                calendar.weekdays = [
                    new Weekday(1, 'Starday'),
                    new Weekday(2, 'Sunday'),
                    new Weekday(3, 'Moonday'),
                    new Weekday(4, 'Godsday'),
                    new Weekday(5, 'Waterday'),
                    new Weekday(6, 'Earthday'),
                    new Weekday(7, 'Freeday')
                ];
                calendar.seasons = [
                    new Season('Spring', 1, 0),
                    new Season('Low Summer', 3, 0),
                    new Season('High Summer', 6, 0),
                    new Season('Fall', 9, 0),
                    new Season('Winter', 11, 0)
                ];
                calendar.seasons[0].color = "#E0C40B";
                calendar.seasons[1].color = "#46B946";
                calendar.seasons[2].color = "#46B946";
                calendar.seasons[3].color = "#FF8E47";
                calendar.seasons[4].color = "#479DFF";
                calendar.seasons[0].sunriseTime = 24300;
                calendar.seasons[1].sunriseTime = 18840;
                calendar.seasons[2].sunriseTime = 16500;
                calendar.seasons[3].sunriseTime = 20400;
                calendar.seasons[4].sunriseTime = 25740;
                calendar.seasons[0].sunsetTime = 48360;
                calendar.seasons[1].sunsetTime = 66540;
                calendar.seasons[2].sunsetTime = 69540;
                calendar.seasons[3].sunsetTime = 64140;
                calendar.seasons[4].sunsetTime = 59160;
                calendar.time.hoursInDay = 24;
                calendar.time.minutesInHour = 60;
                calendar.time.secondsInMinute = 60;
                calendar.time.gameTimeRatio = 1;
                calendar.year.leapYearRule.rule = LeapYearRules.None;
                calendar.year.leapYearRule.customMod = 0;
                calendar.year.months[0].current = true;
                calendar.year.months[0].days[0].current = true;
                calendar.moons = [
                    new Moon('Luna', 28),
                    new Moon('Celene', 91)
                ];
                calendar.moons[0].firstNewMoon.yearReset = MoonYearResetOptions.None;
                calendar.moons[0].firstNewMoon.year = 590;
                calendar.moons[0].firstNewMoon.month = 0;
                calendar.moons[0].firstNewMoon.day = 24;
                phaseLength = Number(((calendar.moons[0].cycleLength - 4) / 4).toPrecision(5));
                calendar.moons[0].phases = [
                    {name: "New Moon", length: 1, icon: Icons.NewMoon, singleDay: true},
                    {name: "Waxing Crescent", length: phaseLength, icon: Icons.WaxingCrescent, singleDay: false},
                    {name: "First Quarter", length: 1, icon: Icons.FirstQuarter, singleDay: true},
                    {name: "Waxing Gibbous", length: phaseLength, icon: Icons.WaxingGibbous, singleDay: false},
                    {name: "Full Moon", length: 1, icon: Icons.Full, singleDay: true},
                    {name: "Waning Gibbous", length: phaseLength, icon: Icons.WaningGibbous, singleDay: false},
                    {name: "Last Quarter", length: 1, icon: Icons.LastQuarter, singleDay: true},
                    {name: "Waning Crescent", length: phaseLength, icon: Icons.WaningCrescent, singleDay: false}
                ];
                calendar.moons[1].color = '#7FFFD4';
                calendar.moons[1].firstNewMoon.yearReset = MoonYearResetOptions.None;
                calendar.moons[1].firstNewMoon.year = 590;
                calendar.moons[1].firstNewMoon.month = 1;
                calendar.moons[1].firstNewMoon.day = 11;
                phaseLength = Number(((calendar.moons[1].cycleLength - 4) / 4).toPrecision(5));
                calendar.moons[1].phases = [
                    {name: "New Moon", length: 1, icon: Icons.NewMoon, singleDay: true},
                    {name: "Waxing Crescent", length: phaseLength, icon: Icons.WaxingCrescent, singleDay: false},
                    {name: "First Quarter", length: 1, icon: Icons.FirstQuarter, singleDay: true},
                    {name: "Waxing Gibbous", length: phaseLength, icon: Icons.WaxingGibbous, singleDay: false},
                    {name: "Full Moon", length: 1, icon: Icons.Full, singleDay: true},
                    {name: "Waning Gibbous", length: phaseLength, icon: Icons.WaningGibbous, singleDay: false},
                    {name: "Last Quarter", length: 1, icon: Icons.LastQuarter, singleDay: true},
                    {name: "Waning Crescent", length: phaseLength, icon: Icons.WaningCrescent, singleDay: false}
                ];
                calendar.year.yearNamesStart = 0;
                calendar.year.yearNamingRule = YearNamingRules.Default;
                calendar.year.yearNames = [];
                updated = true;
                break;
            case PredefinedCalendars.Harptos:
                calendar.year.numericRepresentation = 1495;
                calendar.year.prefix = '';
                calendar.year.postfix = ' DR';
                calendar.year.yearZero = 0;
                calendar.year.months = [
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
                calendar.year.months[1].intercalary = true;
                calendar.year.months[5].intercalary = true;
                calendar.year.months[9].intercalary = true;
                calendar.year.months[10].intercalary = true;
                calendar.year.months[13].intercalary = true;
                calendar.year.months[16].intercalary = true;
                calendar.year.showWeekdayHeadings = false;
                calendar.year.firstWeekday = 0;
                calendar.weekdays = [
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
                calendar.seasons = [
                    new Season('Spring', 2, 18),
                    new Season('Summer', 7, 19),
                    new Season('Fall', 12, 20),
                    new Season('Winter', 17, 19)
                ];
                calendar.seasons[0].color = "#E0C40B";
                calendar.seasons[1].color = "#46B946";
                calendar.seasons[2].color = "#FF8E47";
                calendar.seasons[3].color = "#479DFF";
                calendar.seasons[0].sunriseTime = 21600;
                calendar.seasons[1].sunriseTime = 21600;
                calendar.seasons[2].sunriseTime = 21600;
                calendar.seasons[3].sunriseTime = 21600;
                calendar.seasons[0].sunsetTime = 64800;
                calendar.seasons[1].sunsetTime = 64800;
                calendar.seasons[2].sunsetTime = 64800;
                calendar.seasons[3].sunsetTime = 64800;
                calendar.time.hoursInDay = 24;
                calendar.time.minutesInHour = 60;
                calendar.time.secondsInMinute = 60;
                calendar.time.gameTimeRatio = 1;
                calendar.year.leapYearRule.rule = LeapYearRules.Custom;
                calendar.year.leapYearRule.customMod = 4;
                calendar.year.months[0].current = true;
                calendar.year.months[0].days[0].current = true;
                calendar.moons = [
                    new Moon('Selûne', 30.45)
                ];
                calendar.moons[0].firstNewMoon.yearReset = MoonYearResetOptions.LeapYear;
                calendar.moons[0].firstNewMoon.year = 1372;
                calendar.moons[0].firstNewMoon.month = 0;
                calendar.moons[0].firstNewMoon.day = 15;
                calendar.moons[0].cycleDayAdjust = 0.5;
                phaseLength = Number(((calendar.moons[0].cycleLength - 4) / 4).toPrecision(5));
                calendar.moons[0].phases = [
                    {name: "New Moon", length: 1, icon: Icons.NewMoon, singleDay: true},
                    {name: "Waxing Crescent", length: phaseLength, icon: Icons.WaxingCrescent, singleDay: false},
                    {name: "First Quarter", length: 1, icon: Icons.FirstQuarter, singleDay: true},
                    {name: "Waxing Gibbous", length: phaseLength, icon: Icons.WaxingGibbous, singleDay: false},
                    {name: "Full Moon", length: 1, icon: Icons.Full, singleDay: true},
                    {name: "Waning Gibbous", length: phaseLength, icon: Icons.WaningGibbous, singleDay: false},
                    {name: "Last Quarter", length: 1, icon: Icons.LastQuarter, singleDay: true},
                    {name: "Waning Crescent", length: phaseLength, icon: Icons.WaningCrescent, singleDay: false}
                ];
                calendar.year.yearNamesStart = 0;
                calendar.year.yearNamingRule = YearNamingRules.Default;
                calendar.year.yearNames = [];
                updated = true;
                break;
            case PredefinedCalendars.TravellerImperialCalendar:
                calendar.year.numericRepresentation = 1000;
                calendar.year.prefix = '';
                calendar.year.postfix = '';
                calendar.year.yearZero = 0;
                calendar.year.months = [
                    new Month('Holiday', -1, 0, 1),
                    new Month('Year', 1,1, 364)
                ];
                calendar.year.months[0].intercalary = true;
                calendar.year.showWeekdayHeadings = true;
                calendar.year.firstWeekday = 0;
                calendar.weekdays = [
                    new Weekday(1, 'Wonday'),
                    new Weekday(2, 'Tuday'),
                    new Weekday(3, 'Thirday'),
                    new Weekday(4, 'Forday'),
                    new Weekday(5, 'Fiday'),
                    new Weekday(6, 'Sixday'),
                    new Weekday(7, 'Senday')
                ];
                calendar.seasons = [];
                calendar.time.hoursInDay = 24;
                calendar.time.minutesInHour = 60;
                calendar.time.secondsInMinute = 60;
                calendar.time.gameTimeRatio = 1;
                calendar.year.leapYearRule.rule = LeapYearRules.None;
                calendar.year.leapYearRule.customMod = 0;
                calendar.year.months[0].current = true;
                calendar.year.months[0].days[0].current = true;
                calendar.moons = [];
                calendar.year.yearNamesStart = 0;
                calendar.year.yearNamingRule = YearNamingRules.Default;
                calendar.year.yearNames = [];
                updated = true;
                break;
            case PredefinedCalendars.WarhammerImperialCalendar:
                calendar.year.numericRepresentation = 2522;
                calendar.year.prefix = '';
                calendar.year.postfix = '';
                calendar.year.yearZero = 0;
                calendar.year.months = [
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
                calendar.year.months[0].intercalary = true;
                calendar.year.months[3].intercalary = true;
                calendar.year.months[7].intercalary = true;
                calendar.year.months[9].intercalary = true;
                calendar.year.months[12].intercalary = true;
                calendar.year.months[16].intercalary = true;
                calendar.year.showWeekdayHeadings = true;
                calendar.year.firstWeekday = 0;
                calendar.weekdays = [
                    new Weekday(1, 'Wellentag'),
                    new Weekday(2, 'Aubentag'),
                    new Weekday(3, 'Marktag'),
                    new Weekday(4, 'Backertag'),
                    new Weekday(5, 'Bezahltag'),
                    new Weekday(6, 'Konistag'),
                    new Weekday(7, 'Angestag'),
                    new Weekday(8, 'Festag')
                ];
                calendar.seasons = [
                    new Season('Spring', 0, 16),
                    new Season('Summer', 3, 17),
                    new Season('Fall', 6, 16),
                    new Season('Winter', 9, 17)
                ];
                calendar.seasons[0].color = "#E0C40B";
                calendar.seasons[1].color = "#46B946";
                calendar.seasons[2].color = "#FF8E47";
                calendar.seasons[3].color = "#479DFF";
                calendar.seasons[0].sunriseTime = 21600;
                calendar.seasons[1].sunriseTime = 21600;
                calendar.seasons[2].sunriseTime = 21600;
                calendar.seasons[3].sunriseTime = 21600;
                calendar.seasons[0].sunsetTime = 64800;
                calendar.seasons[1].sunsetTime = 64800;
                calendar.seasons[2].sunsetTime = 64800;
                calendar.seasons[3].sunsetTime = 64800;
                calendar.time.hoursInDay = 24;
                calendar.time.minutesInHour = 60;
                calendar.time.secondsInMinute = 60;
                calendar.time.gameTimeRatio = 1;
                calendar.year.leapYearRule.rule = LeapYearRules.None;
                calendar.year.leapYearRule.customMod = 0;
                calendar.year.months[0].current = true;
                calendar.year.months[0].days[0].current = true;
                calendar.moons = [
                    new Moon('Luna', 25)
                ];
                calendar.moons[0].firstNewMoon.yearReset = MoonYearResetOptions.None;
                calendar.moons[0].firstNewMoon.year = 2522;
                calendar.moons[0].firstNewMoon.month = 0;
                calendar.moons[0].firstNewMoon.day = 12;
                phaseLength = Number(((calendar.moons[0].cycleLength - 4) / 4).toPrecision(5));
                calendar.moons[0].phases = [
                    {name: "New Moon", length: 1, icon: Icons.NewMoon, singleDay: true},
                    {name: "Waxing Crescent", length: phaseLength, icon: Icons.WaxingCrescent, singleDay: false},
                    {name: "First Quarter", length: 1, icon: Icons.FirstQuarter, singleDay: true},
                    {name: "Waxing Gibbous", length: phaseLength, icon: Icons.WaxingGibbous, singleDay: false},
                    {name: "Full Moon", length: 1, icon: Icons.Full, singleDay: true},
                    {name: "Waning Gibbous", length: phaseLength, icon: Icons.WaningGibbous, singleDay: false},
                    {name: "Last Quarter", length: 1, icon: Icons.LastQuarter, singleDay: true},
                    {name: "Waning Crescent", length: phaseLength, icon: Icons.WaningCrescent, singleDay: false}
                ];
                calendar.year.yearNamesStart = 0;
                calendar.year.yearNamingRule = YearNamingRules.Default;
                calendar.year.yearNames = [];
                updated = true;
                break;
        }
        return updated;
    }
}
