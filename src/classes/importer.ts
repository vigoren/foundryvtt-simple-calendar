import Year from "./year";
import {AboutTimeImport, CalendarWeatherImport} from "../interfaces";
import {Weekday} from "./weekday";
import Month from "./month";
import {LeapYearRules} from "../constants";
import {GameSettings} from "./game-settings";
import Season from "./season";
import Moon from "./moon";

export default class Importer{

    /**
     * Loads the about time calendar configuration into Simple Calendars configuration
     * @param {Year} year The year to load the about time configuration into
     */
    static async importAboutTime(year: Year){
        const aboutTimeCalendar = <AboutTimeImport.Calendar>game.settings.get('about-time', 'savedCalendar');

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
        const currentTime = year.secondsToDate(game.time.worldTime);
        year.updateTime(currentTime);

        //Save everything
        await GameSettings.SaveYearConfiguration(year);
        await GameSettings.SaveMonthConfiguration(year.months);
        await GameSettings.SaveWeekdayConfiguration(year.weekdays);
        await GameSettings.SaveLeapYearRules(year.leapYearRule);
        await GameSettings.SaveTimeConfiguration(year.time);
        await GameSettings.SaveCurrentDate(year);
    }

    /**
     * Sets up about time to match Simple Calendars configuration
     * @param {Year} year The year to use
     *
     * Known Issues:
     *      - Intercalary days seem to be calculated differently so calendars with them do not match up perfectly with Simple Calendar
     */
    static async exportToAboutTime(year: Year){

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
            "clock_start_year": 0,
            "has_year_0": true,
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
        //@ts-ignore
        game.Gametime.DTC.saveUserCalendar(newAboutTimeConfig);

        // Ensure about time uses the new calendar on startup
        if (game.settings.get("about-time", "calendar") !== 0){
            await game.settings.set("about-time", "calendar", 0);
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
        const currentSettings = <CalendarWeatherImport.Calendar> game.settings.get('calendar-weather', 'dateTime');

        //Set up the time
        year.time.hoursInDay = currentSettings.dayLength;

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

            const nMonth = new Month(currentSettings.months[i].name, i+1, 0, numDays, numLeapDays)
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

        //Set up the seasons
        year.seasons = [];
        for(let i = 0; i < currentSettings.seasons.length; i++){
            const nSeason = new Season(currentSettings.seasons[i].name, 1, currentSettings.seasons[i].date.day + 1);
            year.seasons.push(nSeason);
        }

        year.moons = [];
        for(let i = 0; i< currentSettings.moons.length; i++){
            const newMoon = new Moon(currentSettings.moons[i].name, currentSettings.moons[i].cycleLength);
            const currentTime = year.secondsToDate(currentSettings.moons[i].referenceTime);
            newMoon.firstNewMoon.year = currentTime.year;
            newMoon.firstNewMoon.month = currentTime.month;
            newMoon.firstNewMoon.day = currentTime.day;
        }

        //Set the current time
        const currentTime = year.secondsToDate(game.time.worldTime);
        year.updateTime(currentTime);

        //Save everything
        await GameSettings.SaveYearConfiguration(year);
        await GameSettings.SaveMonthConfiguration(year.months);
        await GameSettings.SaveWeekdayConfiguration(year.weekdays);
        await GameSettings.SaveLeapYearRules(year.leapYearRule);
        await GameSettings.SaveTimeConfiguration(year.time);
        await GameSettings.SaveMoonConfiguration(year.moons);
        await GameSettings.SaveCurrentDate(year);
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
        const currentSettings = <CalendarWeatherImport.Calendar>game.settings.get('calendar-weather', 'dateTime');

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
                    combined: `-${year.seasons[i].startingDay - 1}`
                }
            });
        }

        const moonList: CalendarWeatherImport.Moons[] = [];
        for(let i = 0; i < year.moons.length; i++){
            moonList.push({
                name: year.moons[i].name,
                cycleLength: year.moons[i].cycleLength,
                cyclePercent: 0,
                lunarEclipseChange: 0,
                solarEclipseChange: 0,
                referencePercent: 0,
                referenceTime: year.time.getTotalSeconds(year.dateToDays(year.moons[i].firstNewMoon.year, year.moons[i].firstNewMoon.month, year.moons[i].firstNewMoon.day, true, true) - 1)
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
        await game.settings.set('calendar-weather', 'dateTime', currentSettings);
        await Importer.exportToAboutTime(year);
        window.location.reload();
    }
}
