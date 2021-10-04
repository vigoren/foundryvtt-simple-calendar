import Year from "./year";
import {AboutTimeImport, CalendarWeatherImport} from "../interfaces";
import {Weekday} from "./weekday";
import Month from "./month";
import {GameSystems, LeapYearRules, MoonIcons, NoteRepeat} from "../constants";
import {GameSettings} from "./game-settings";
import Season from "./season";
import Moon from "./moon";
import Note from "./note";
import SimpleCalendar from "./simple-calendar";

export default class Importer{

    /**
     * Checks to see if about-time v1.0.0 or greater is installed and active
     */
    static aboutTimeV1(){
        let abv1 = false;
        const aboutTime = (<Game>game).modules.get('about-time');
        if(aboutTime && aboutTime.active){
            //@ts-ignore
            const versionParts = aboutTime.data.version.split('.');
            const p1 = parseInt(versionParts[0]);
            if(!isNaN(p1) && p1 >= 1){
                abv1 = true;
            }
        }
        return abv1;
    }

    /**
     * Loads the about time calendar configuration into Simple Calendars configuration
     * @param {Year} year The year to load the about time configuration into
     */
    static async importAboutTime(year: Year){
        const aboutTimeCalendar = <AboutTimeImport.Calendar>(<Game>game).settings.get('about-time', 'savedCalendar');

        if(aboutTimeCalendar){
            //Set up the time parameters
            year.time.hoursInDay = aboutTimeCalendar['hours_per_day'];
            year.time.minutesInHour = aboutTimeCalendar['minutes_per_hour'];
            year.time.secondsInMinute = aboutTimeCalendar['seconds_per_minute'];

            //Set up the weekdays
            year.weekdays = [];
            for(let i = 0; i < aboutTimeCalendar['weekdays'].length; i++){
                year.weekdays.push(new Weekday(i+1, aboutTimeCalendar['weekdays'][i]));
            }

            //Set up the months
            year.months = [];
            let mCount = 1;
            let mICount = 1;
            for(let key in aboutTimeCalendar['month_len']){
                if(aboutTimeCalendar['month_len'].hasOwnProperty(key)){
                    const newM = new Month(key, mCount, 0, aboutTimeCalendar['month_len'][key].days[0], aboutTimeCalendar['month_len'][key].days[1]);
                    if(aboutTimeCalendar['month_len'][key].intercalary){
                        newM.numericRepresentation = mICount * -1;
                        newM.intercalary = true;
                        newM.intercalaryInclude = false;
                        mICount++;
                    } else {
                        mCount++;
                    }
                    year.months.push(newM);
                }
            }

            //Try to set up the leap year rule
            year.leapYearRule.rule = LeapYearRules.None;
            if(aboutTimeCalendar['leap_year_rule'] === '(year) => Math.floor(year / 4) - Math.floor(year / 100) + Math.floor(year / 400)') {
                year.leapYearRule.rule = LeapYearRules.Gregorian;
            } else {
                const matches = aboutTimeCalendar['leap_year_rule'].match(/(\d)/g);
                if(matches && matches.length && matches[0] !== '0'){
                    year.leapYearRule.rule = LeapYearRules.Custom;
                    year.leapYearRule.customMod = parseInt(matches[0]);
                }
            }

            //Set the current time
            const currentTime = year.secondsToDate((<Game>game).time.worldTime);
            year.updateTime(currentTime);

            //Save everything
            await GameSettings.SaveYearConfiguration(year);
            await GameSettings.SaveMonthConfiguration(year.months);
            await GameSettings.SaveWeekdayConfiguration(year.weekdays);
            await GameSettings.SaveLeapYearRules(year.leapYearRule);
            await GameSettings.SaveTimeConfiguration(year.time);
            await GameSettings.SaveCurrentDate(year);
        }
    }

    /**
     * Sets up about time to match Simple Calendars configuration
     * @param {Year} year The year to use
     * @param {boolean} [force=false] If to force the export
     *
     * Known Issues:
     *      - Intercalary days seem to be calculated differently so calendars with them do not match up perfectly with Simple Calendar
     */
    static async exportToAboutTime(year: Year, force: boolean = false){
        let run = !Importer.aboutTimeV1();
        if(!run && !force){
            return;
        }
        const monthList: AboutTimeImport.MonthList = {};
        for(let i = 0; i < year.months.length; i++){
            let leapYearDays = year.months[i].numberOfLeapYearDays;
            if(year.leapYearRule.rule === LeapYearRules.None){
                leapYearDays = year.months[i].numberOfDays;
            }
            monthList[year.months[i].name] = {
                days: [year.months[i].numberOfDays, leapYearDays],
                intercalary: year.months[i].intercalary
            };
        }

        const newAboutTimeConfig: AboutTimeImport.Calendar = {
            "first_day": 0,
            "clock_start_year": year.yearZero,
            "has_year_0": year.yearZero === 0,
            "notes": {},
            "hours_per_day": year.time.hoursInDay,
            "minutes_per_hour": year.time.minutesInHour,
            "seconds_per_minute": year.time.secondsInMinute,
            "weekdays": year.weekdays.map( w => w.name),
            "leap_year_rule": `(year) => 0`,
            "month_len": monthList,
            "_month_len": {}
        };

        if(year.leapYearRule.rule === LeapYearRules.Gregorian){
            newAboutTimeConfig.leap_year_rule = `(year) => Math.floor(year / 4) - Math.floor(year / 100) + Math.floor(year / 400)`;
        } else if(year.leapYearRule.rule === LeapYearRules.Custom){
            //Gross but might be all we can do
            newAboutTimeConfig.leap_year_rule = `(year) => Math.floor(year / ${year.leapYearRule.customMod} ) + 1`;
        }
        (<Game>game).settings.set("about-time", "savedCalendar", newAboutTimeConfig);

        // Set the about-time timeZeroOffset to an empty string as it doesn't need to be set to anything, unless this is a PF2E game then don't set
        if(SimpleCalendar.instance.activeCalendar.gameSystem !== GameSystems.PF2E){
            await (<Game>game).settings.set("about-time", "timeZeroOffset", '');
        }

        // Ensure about time uses the new calendar on startup
        if ((<Game>game).settings.get("about-time", "calendar") !== 0){
            await (<Game>game).settings.set("about-time", "calendar", 0);
        }
    }

    /**
     * Loads the calendar/weather calendar configuration into Simple Calendars configuration
     * @param {Year} year The year to load the about time configuration into
     *
     * Known Issues:
     *      - Seasons: The month is not properly stored by calendar-weather so all months are set to the first month
     *      - Seasons: The color of the seasons can not be transferred over
     */
    static async importCalendarWeather(year: Year){
        const currentSettings = <CalendarWeatherImport.Calendar> (<Game>game).settings.get('calendar-weather', 'dateTime');

        if(currentSettings){
            //Set up the time
            //year.time.hoursInDay = currentSettings.dayLength;

            //Set up the weekdays
            year.weekdays = [];
            for(let i = 0; i < currentSettings.daysOfTheWeek.length; i++){
                year.weekdays.push(new Weekday(i+1, currentSettings.daysOfTheWeek[i]));
            }

            //Set up the months
            year.months = [];
            let mCount = 1;
            let mICount = 1;
            for(let i = 0; i < currentSettings.months.length; i++){
                let numDays = parseInt(currentSettings.months[i].length.toString());
                let numLeapDays = parseInt(currentSettings.months[i].leapLength.toString());
                if(isNaN(numDays)){
                    numDays = 1;
                }
                if(isNaN(numLeapDays)){
                    numLeapDays = 1;
                }

                const nMonth = new Month(currentSettings.months[i].name, mCount, 0, numDays, numLeapDays)
                if(!currentSettings.months[i].isNumbered){
                    nMonth.numericRepresentation = mICount * -1;
                    nMonth.intercalary = true;
                    nMonth.intercalaryInclude = false;
                    mICount++;
                } else {
                    mCount++;
                }
                year.months.push(nMonth);
            }

            year.leapYearRule.rule = LeapYearRules.None;

            //Set the current year
            year.numericRepresentation = parseInt(currentSettings.year.toString());
            year.postfix = currentSettings.era;
            year.yearZero = 0;

            //Set the current time
            const currentTime = year.secondsToDate((<Game>game).time.worldTime);
            year.updateTime(currentTime);

            //Set up the seasons
            year.seasons = [];
            for(let i = 0; i < currentSettings.seasons.length; i++){
                let seasonMonth = parseInt(currentSettings.seasons[i].date.month.toString());
                if(isNaN(seasonMonth)){
                    seasonMonth = 1;
                }
                const nSeason = new Season(currentSettings.seasons[i].name, seasonMonth, currentSettings.seasons[i].date.day);
                switch (currentSettings.seasons[i].color){
                    case 'red':
                        nSeason.color = "#b12e2e";
                        break;
                    case 'orange':
                        nSeason.color = "#b1692e";
                        break;
                    case 'yellow':
                        nSeason.color = "#b99946";
                        break;
                    case 'green':
                        nSeason.color = "#258e25";
                        break;
                    case 'blue':
                        nSeason.color = "#5b80a5";
                        break;
                }
                year.seasons.push(nSeason);
            }

            year.moons = [];
            for(let i = 0; i< currentSettings.moons.length; i++){
                const newMoon = new Moon(currentSettings.moons[i].name, currentSettings.moons[i].cycleLength);

                let referencePercent = currentSettings.moons[i].cyclePercent / 100;
                if(!currentSettings.moons[i].isWaxing){
                    referencePercent = 0.5;
                }
                const dayAdjust = year.time.secondsPerDay * (newMoon.cycleLength * referencePercent);

                const currentTime = year.secondsToDate(currentSettings.moons[i].referenceTime + dayAdjust);
                newMoon.firstNewMoon.year = currentTime.year;
                newMoon.firstNewMoon.month = year.months[currentTime.month].numericRepresentation;
                newMoon.firstNewMoon.day = year.months[currentTime.month].days[currentTime.day].numericRepresentation;
                const phaseLength = Number(((newMoon.cycleLength - 4) / 4).toPrecision(5));
                newMoon.phases = [
                    {name: GameSettings.Localize('FSC.Moon.Phase.New'), length: 1, icon: MoonIcons.NewMoon, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingCrescent'), length: phaseLength, icon: MoonIcons.WaxingCrescent, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.FirstQuarter'), length: 1, icon: MoonIcons.FirstQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaxingGibbous'), length: phaseLength, icon: MoonIcons.WaxingGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.Full'), length: 1, icon: MoonIcons.Full, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningGibbous'), length: phaseLength, icon: MoonIcons.WaningGibbous, singleDay: false},
                    {name: GameSettings.Localize('FSC.Moon.Phase.LastQuarter'), length: 1, icon: MoonIcons.LastQuarter, singleDay: true},
                    {name: GameSettings.Localize('FSC.Moon.Phase.WaningCrescent'), length: phaseLength, icon: MoonIcons.WaningCrescent, singleDay: false}
                ]
                year.moons.push(newMoon);
            }

            if(SimpleCalendar.instance){
                for(let i = 0; i < currentSettings.events.length; i++){
                    const event = currentSettings.events[i];
                    const note = new Note();
                    note.title = event.name;
                    note.content = event.text;
                    note.allDay = event.allDay;
                    note.year = parseInt(event.date.year.toString());
                    note.endDate.year = note.year;

                    let month = year.months.findIndex(m => m.numericRepresentation === parseInt(event.date.month) || m.name === event.date.month);
                    if(month < 0){
                        month = 0;
                    }

                    note.month = year.months[month].numericRepresentation;
                    note.endDate.month = note.month;
                    note.day = event.date.day;
                    note.endDate.day = note.day;
                    note.hour = event.date.hours;
                    note.minute = event.date.minutes;
                    note.endDate.hour = note.hour;
                    note.endDate.minute = note.minute;
                    SimpleCalendar.instance.activeCalendar.notes.push(note);
                }

                for(let i = 0; i < currentSettings.reEvents.length; i++){
                    const event = currentSettings.reEvents[i];
                    const note = new Note();
                    note.title = event.name;
                    note.content = event.text;
                    note.year = 0;
                    note.endDate.year = note.year;

                    let month = year.months.findIndex(m => m.numericRepresentation === parseInt(event.date.month) || m.name === event.date.month);
                    if(month < 0){
                        month = 0;
                    }

                    note.month = year.months[month].numericRepresentation;
                    note.endDate.month = note.month;
                    note.day = event.date.day;
                    note.endDate.day = note.day;
                    note.hour = 0;
                    note.minute = 0;
                    note.endDate.hour = note.hour;
                    note.endDate.minute = note.minute;
                    note.repeats = NoteRepeat.Yearly;
                    SimpleCalendar.instance.activeCalendar.notes.push(note);
                }

                await GameSettings.SaveNotes(SimpleCalendar.instance.activeCalendar.notes);
            }

            //Save everything
            await GameSettings.SaveYearConfiguration(year);
            await GameSettings.SaveMonthConfiguration(year.months);
            await GameSettings.SaveWeekdayConfiguration(year.weekdays);
            await GameSettings.SaveLeapYearRules(year.leapYearRule);
            await GameSettings.SaveTimeConfiguration(year.time);
            await GameSettings.SaveSeasonConfiguration(year.seasons);
            await GameSettings.SaveMoonConfiguration(year.moons);
            await GameSettings.SaveCurrentDate(year);
        }
    }

    /**
     * Sets up calendar weather to match Simple Calendars configuration
     * @param {Year} year The year to use
     *
     * Known Issues:
     *      - Calendar/Weather does not support leap years so any calendar that has leap years will not work properly and be out of sync with Simple Calendar
     *      - As About time is used as the base, the same known issues for that will apply here
     *      - Seasons: Simple Calendars colors do not exist in Calendar/Weather so they can not be exported
     */
    static async exportCalendarWeather(year: Year){
        const currentSettings = <CalendarWeatherImport.Calendar>(<Game>game).settings.get('calendar-weather', 'dateTime');

        if(currentSettings){
            const monthList: CalendarWeatherImport.Month[] = [];
            for(let i = 0; i < year.months.length; i++){
                monthList.push({
                    name: year.months[i].name,
                    length: year.months[i].numberOfDays,
                    leapLength: year.months[i].numberOfLeapYearDays,
                    isNumbered: !year.months[i].intercalary,
                    abbrev: year.months[i].intercalary? year.months[i].name.substring(0,2) : ''
                });
            }

            const seasonList: CalendarWeatherImport.Seasons[] = [];
            for(let i = 0; i < year.seasons.length; i++){
                seasonList.push({
                    name: year.seasons[i].name,
                    color: '',
                    dawn: 6,
                    dusk: 19,
                    humidity: '=',
                    rolltable: '',
                    temp: '=',
                    date: {
                        day: year.seasons[i].startingDay - 1,
                        month: '',
                        combined: `-${year.seasons[i].startingDay - 1}`,
                        year: year.numericRepresentation.toString(),
                        hours: 0,
                        minutes: 0,
                        seconds: 0
                    }
                });
            }

            const moonList: CalendarWeatherImport.Moons[] = [];
            for(let i = 0; i < year.moons.length; i++){
                moonList.push({
                    isWaxing: false,
                    name: year.moons[i].name,
                    cycleLength: year.moons[i].cycleLength,
                    cyclePercent: 0,
                    lunarEclipseChange: 0,
                    solarEclipseChange: 0,
                    referencePercent: 0,
                    referenceTime: year.time.getTotalSeconds(year.dateToDays(year.moons[i].firstNewMoon.year, year.moons[i].firstNewMoon.month, year.moons[i].firstNewMoon.day, true, true))
                });
            }

            const currentMonth = year.getMonth();
            const currentDay = currentMonth?.getDay();
            const weekDays = year.weekdays.map( w => w.name)
            const dow = year.dayOfTheWeek(year.numericRepresentation, currentMonth? currentMonth.numericRepresentation : 1, currentDay? currentDay.numericRepresentation : 1);
            currentSettings.months = monthList;
            currentSettings.daysOfTheWeek = weekDays;
            currentSettings.year = year.numericRepresentation;
            currentSettings.currentMonth = currentMonth? currentMonth.numericRepresentation - 1 : 0;
            currentSettings.day = currentDay? currentDay.numericRepresentation - 1 : 0;
            currentSettings.numDayOfTheWeek = dow;
            currentSettings.currentWeekday = weekDays[dow];
            currentSettings.era = '';
            currentSettings.dayLength = year.time.hoursInDay
            currentSettings.first_day = 0;
            currentSettings.seasons = seasonList;
            currentSettings.moons = moonList;
            await (<Game>game).settings.set('calendar-weather', 'dateTime', currentSettings);
            await Importer.exportToAboutTime(year);
            window.location.reload();
        }
    }
}
