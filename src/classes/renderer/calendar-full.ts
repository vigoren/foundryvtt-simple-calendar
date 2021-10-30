import Calendar from "../calendar";
import {DayTemplate, SCRenderer} from "../../interfaces";
import Utilities from "../utilities";
import SimpleCalendar from "../applications/simple-calendar";
import {GameSettings} from "../foundry-interfacing/game-settings";
import {CalendarClickEvents, DateRangeMatch} from "../../constants";
import RendererUtilities from "./utilities";

export default class CalendarFull{

    /**
     * The default options used when creating a full view calendar
     * @private
     */
    private static defaultOptions: SCRenderer.CalendarOptions = {
        id: '',
        allowChangeMonth: true,
        allowSelectDateRange: false,
        colorToMatchSeason: true,
        cssClasses: '',
        showCurrentDate: true,
        showSeasonName: true,
        showNoteCount: true,
        showMoonPhases: true,
        showYear: true
    };

    /**
     * Renders the full view for the passed in calendar
     * @param calendar
     * @param options
     */
    public static Render(calendar: Calendar, options: SCRenderer.CalendarOptions = {id: ''}): string {
        options = Utilities.deepMerge({}, this.defaultOptions, options);

        let monthYearFormat = calendar.generalSettings.dateFormat.monthYear;
        if(!options.showYear){
            monthYearFormat = monthYearFormat.replace(/YN|YA|YZ|YY(?:YY)?/g, '');
        }

        let vYear, vMonth = 1, vMonthIndex, ssYear, ssMonth, ssDay, seYear, seMonth, seDay, weeks: (boolean | DayTemplate)[][] = [], calendarStyle = '', seasonName = '';
        if(options.date){
            if(options.date.month > 0 && options.date.month < calendar.year.months.length){
                vMonth = calendar.year.months[options.date.month].numericRepresentation;
                vMonthIndex = options.date.month;
            } else {
                vMonth = calendar.year.months[0].numericRepresentation;
                vMonthIndex = 0;
            }
            vYear = options.date.year;
            const visibleMonth = calendar.year.months[options.date.month]
            if(visibleMonth){
                weeks = calendar.year.daysIntoWeeks(visibleMonth, vYear, calendar.year.weekdays.length);
            }
        } else {
            vYear = calendar.year.visibleYear;
            const visibleMonth = calendar.year.getMonth('visible');
            if(visibleMonth){
                vMonth = visibleMonth.numericRepresentation;
                weeks = calendar.year.daysIntoWeeks(visibleMonth, vYear, calendar.year.weekdays.length);
            }
            vMonthIndex = calendar.year.months.findIndex(m => m.numericRepresentation === vMonth);
        }

        //TODO: When Changing the year the same day and month are considered selected
        if(options.selectedDates){
            ssYear = options.selectedDates.start.year;
            seYear = options.selectedDates.end.year;
            ssMonth = options.selectedDates.start.month > 0 && options.selectedDates.start.month < calendar.year.months.length? calendar.year.months[options.selectedDates.start.month].numericRepresentation : calendar.year.months[0].numericRepresentation;
            seMonth = options.selectedDates.end.month > 0 && options.selectedDates.end.month < calendar.year.months.length? calendar.year.months[options.selectedDates.end.month].numericRepresentation : calendar.year.months[0].numericRepresentation;
            ssDay = options.selectedDates.start.day || 1;
            seDay = options.selectedDates.end.day || 1;
        } else {
            ssYear = seYear = calendar.year.selectedYear;
            const selectedMonth = calendar.year.getMonth('selected');
            if(selectedMonth){
                ssMonth = seMonth = selectedMonth.numericRepresentation;
                const selectedDay = selectedMonth.getDay('selected');
                if(selectedDay){
                    ssDay = seDay = selectedDay.numericRepresentation;
                }
            }
        }

        if(options.showSeasonName || options.colorToMatchSeason){
            const season = calendar.year.getSeason(vMonthIndex, ssDay? ssDay : 1);
            seasonName = season.name;
            calendarStyle = `background-color:${season.color};`;
        }

        let html = `<div id="${options.id}" class="calendar ${options.cssClasses}" style="${options.colorToMatchSeason? calendarStyle : ''}" data-calendar="${SimpleCalendar.instance.calendars.findIndex(c => c.id === calendar.id)}">`;
        //Hidden Options
        html += `<input class="render-options" type="hidden" value="${encodeURIComponent(JSON.stringify(options))}"/>`;
        //Put the header together
        html += `<div class="calendar-header" style="${options.colorToMatchSeason?calendarStyle:''}">`;
        //Visible date change and current date
        html += `<div class="current-date">`;
        if(options.allowChangeMonth){
            html += `<a class="fa fa-chevron-left" title="${GameSettings.Localize('FSC.ChangePreviousMonth')}"></a>`;
        }
        html += `<span class="month-year" data-visible="${vMonthIndex}/${vYear}">${Utilities.FormatDateTime({year: vYear, month: vMonth, day: 1, hour: 0, minute: 0, seconds: 0}, monthYearFormat)}</span>`;
        if(options.allowChangeMonth){
            html += `<a class="fa fa-chevron-right" title="${GameSettings.Localize('FSC.ChangeNextMonth')}"></a>`;
        }
        html += '</div>';
        //Season Name
        if(options.showSeasonName){
            html += `<div class="season">${seasonName}</div>`;
        }
        //Weekday Headings
        if(calendar.year.showWeekdayHeadings){
            html += `<div class="weekdays">${calendar.year.weekdays.map(w => `<div class="weekday" title="${w.name}">${w.abbreviation}</div>`).join('')}</div>`;
        }
        //Close header div
        html += '</div>';

        //Generate day list
        html += `<div class="days">`;
        for(let i = 0; i < weeks.length; i++){
            if(weeks[i]){
                html += `<div class="week">`;
                for(let x = 0; x < weeks[i].length; x++){
                    if(weeks[i][x]){
                        let dayClass = 'day';

                        //Check for selected dates to highlight
                        if(ssMonth !== undefined && ssDay !== undefined && seMonth !== undefined && seDay !== undefined){
                            const checkDate = {
                                year: options.showYear? vYear: 0,
                                month: vMonth,
                                day: (<DayTemplate>weeks[i][x]).numericRepresentation,
                                allDay: true,
                                hour: 0,
                                minute: 0
                            }
                            const inBetween = Utilities.IsDayBetweenDates(checkDate, {year: ssYear, month: ssMonth, day: ssDay, allDay: true, minute: 0, hour: 0}, {year: seYear, month: seMonth, day: seDay, allDay: true, minute: 0, hour: 0});
                            switch (inBetween){
                                case DateRangeMatch.Exact:
                                    dayClass += ' selected';
                                    (<DayTemplate>weeks[i][x]).selected = true;
                                    break;
                                case DateRangeMatch.Start:
                                    dayClass += ' selected selected-range-start';
                                    break;
                                case DateRangeMatch.Middle:
                                    dayClass += ' selected selected-range-mid';
                                    break;
                                case DateRangeMatch.End:
                                    dayClass += ' selected selected-range-end';
                                    break;
                            }
                        }
                        //Check for current date to highlight
                        if(options.showCurrentDate && vYear === calendar.year.numericRepresentation && (<DayTemplate>weeks[i][x]).current){
                            dayClass += ' current';
                        }

                        html += `<div class="${dayClass}" data-day="${(<DayTemplate>weeks[i][x]).numericRepresentation}">`;
                        if(options.showNoteCount){
                            html += `<div class="day-notes">${CalendarFull.NoteIndicator(calendar, vYear, vMonth, <DayTemplate>weeks[i][x])}</div>`;
                        }
                        html += (<DayTemplate>weeks[i][x]).name;
                        if(options.showMoonPhases){
                            html += `<div class="moons">${CalendarFull.MoonPhaseIcons(calendar, vYear, vMonth, <DayTemplate>weeks[i][x])}</div>`;
                        }
                        html += '</div>';
                    } else {
                        html += '<div class="empty-day"></div>'
                    }
                }
                html += '</div>';
            }
        }
        //Close day list div
        html += '</div>';

        //Close main div
        html += '</div>';
        return html;
    }

    /**
     * Activates listeners for month change and day clicks on the specified rendered calendar
     * @param {string} calendarId The ID of the HTML element representing the calendar to activate listeners for
     * @param {Function|null} onMonthChange Function to call when the month is changed
     * @param {Function|null} onDayClick Function to call when a day is clicked
     */
    public static ActivateListeners(calendarId: string, onMonthChange: Function | null = null, onDayClick: Function | null = null){
        const calendarElement = document.getElementById(calendarId);
        if(calendarElement){
            const prev = <HTMLElement>calendarElement.querySelector('.calendar-header .current-date .fa-chevron-left');
            if(prev){
                prev.addEventListener('click', CalendarFull.EventListener.bind(CalendarFull, calendarId, CalendarClickEvents.previous, onMonthChange, onDayClick));
            }
            const next = <HTMLElement>calendarElement.querySelector('.calendar-header .current-date .fa-chevron-right');
            if(next){
                next.addEventListener('click', CalendarFull.EventListener.bind(CalendarFull, calendarId, CalendarClickEvents.next, onMonthChange, onDayClick));
            }
            calendarElement.querySelectorAll('.days .day').forEach(el => {
                el.addEventListener('click', CalendarFull.EventListener.bind(CalendarFull, calendarId, CalendarClickEvents.day, onMonthChange, onDayClick));
            });
        }
    }

    /**
     * Updates the rendered calendars view to change to the next or previous month
     * @param {string} calendarId The ID of the HTML element making up the calendar
     * @param {CalendarClickEvents} clickType If true the previous button was clicked, otherwise next was clicked
     * @param {Function|null} onMonthChange The custom function to call when the month is changed.
     * @param {Function|null} onDayClick The custom function to call when a day is clicked.
     * @param {Event} event The click event
     */
    public static EventListener(calendarId: string, clickType: CalendarClickEvents, onMonthChange: Function | null, onDayClick: Function | null, event: Event){
        event.stopPropagation();
        const calendarElement = document.getElementById(calendarId);
        if(calendarElement){
            const calendarIndex = parseInt(calendarElement.getAttribute('data-calendar') || '');
            if(!isNaN(calendarIndex) && calendarIndex >= 0 && calendarIndex < SimpleCalendar.instance.calendars.length){
                const calendar = SimpleCalendar.instance.calendars[calendarIndex];
                let options: SCRenderer.CalendarOptions = {id:''};
                const optionsInput = calendarElement.querySelector('.render-options');
                if(optionsInput){
                    options = JSON.parse(decodeURIComponent((<HTMLInputElement>optionsInput).value));
                }
                const currentMonthYear = <HTMLElement>calendarElement.querySelector('.month-year');
                if(currentMonthYear){
                    const dataVis = currentMonthYear.getAttribute('data-visible');
                    if(dataVis){
                        const my = dataVis.split('/');
                        if(my.length === 2){
                            let monthIndex = parseInt(my[0]);
                            let yearNumber = parseInt(my[1]);
                            if(!isNaN(yearNumber) && !isNaN(monthIndex)){
                                if(clickType === CalendarClickEvents.previous || clickType === CalendarClickEvents.next){
                                    let loop = true;
                                    let loopCount = 0;
                                    while(loop){
                                        if(clickType === CalendarClickEvents.previous){
                                            if(monthIndex === 0){
                                                monthIndex = calendar.year.months.length - 1;
                                                yearNumber--;
                                            } else {
                                                monthIndex--;
                                            }
                                        } else {
                                            if(monthIndex === (calendar.year.months.length - 1)){
                                                monthIndex = 0;
                                                yearNumber++;
                                            }else {
                                                monthIndex++;
                                            }
                                        }
                                        const isLeapYear = calendar.year.leapYearRule.isLeapYear(yearNumber);
                                        if((isLeapYear && calendar.year.months[monthIndex].numberOfLeapYearDays > 0) || (!isLeapYear && calendar.year.months[monthIndex].numberOfDays > 0)){
                                            loop = false;
                                        }
                                        loopCount++;
                                        if(loopCount === calendar.year.months.length){
                                            loop = false;
                                        }
                                    }
                                } else if(clickType === CalendarClickEvents.day){
                                    let target = <HTMLElement>event.target;
                                    //If a child of the day div is clicked get the closest day
                                    const closestDay = target.closest('.day');
                                    if(closestDay){
                                        target = <HTMLElement>closestDay;
                                    }
                                    const dataDate = target.getAttribute('data-day');
                                    if(dataDate){
                                        const dayNumber = parseInt(dataDate);
                                        if(!isNaN(dayNumber)){
                                            const start = {year: 0, month: 0, day: 0};
                                            const end = {year: 0, month: 0, day: 0};

                                            if(options.allowSelectDateRange){
                                                if(!options.selectedDates || options.selectedDates.end.year !== null){
                                                    start.year = yearNumber;
                                                    start.month = monthIndex;
                                                    start.day = dayNumber;
                                                    end.year = NaN;
                                                    end.month = NaN;
                                                    end.day = NaN;
                                                } else {
                                                    start.year = options.selectedDates.start.year;
                                                    start.month = options.selectedDates.start.month;
                                                    start.day = options.selectedDates.start.day || 1;
                                                    end.year = yearNumber;
                                                    end.month = monthIndex;
                                                    end.day = dayNumber;

                                                    // End date is less than start date
                                                    if((start.day > dayNumber && start.month  === monthIndex  && start.year === yearNumber) || (start.month > monthIndex && start.year === yearNumber) || start.year > yearNumber){
                                                        end.year = options.selectedDates.start.year;
                                                        end.month = options.selectedDates.start.month;
                                                        end.day = options.selectedDates.start.day || 1;
                                                        start.year = yearNumber;
                                                        start.month = monthIndex;
                                                        start.day = dayNumber;
                                                    }
                                                }
                                            } else {
                                                start.year = yearNumber;
                                                start.month = monthIndex;
                                                start.day = dayNumber;
                                                end.year = yearNumber;
                                                end.month = monthIndex;
                                                end.day = dayNumber;
                                            }
                                            options.selectedDates = {
                                                start: start,
                                                end: end
                                            };
                                        }
                                    }
                                }
                                options.date = {
                                    year: yearNumber,
                                    month: monthIndex
                                };
                            }
                        }
                    }
                }
                const newHTML = CalendarFull.Render(calendar, options);
                const temp = document.createElement('div');
                temp.innerHTML = newHTML;
                if(temp.firstChild) {
                    calendarElement.replaceWith(temp.firstChild);
                    CalendarFull.ActivateListeners(options.id, onMonthChange, onDayClick);
                }
                if(onMonthChange !== null && (clickType === CalendarClickEvents.previous || clickType === CalendarClickEvents.next)){
                    onMonthChange(clickType, options);
                } else if(onDayClick !== null && clickType === CalendarClickEvents.day){
                    onDayClick(options);
                }
            }
        }
    }

    /**
     * Checks if the passed in day has any notes from the passed in calendar and generates the note indicators
     * @param {Calendar} calendar The calendar to pull the data from
     * @param {number} visibleYear
     * @param {number} visibleMonth
     * @param {DayTemplate} day They day to check
     */
    public static NoteIndicator(calendar: Calendar, visibleYear: number, visibleMonth: number, day: DayTemplate): string {
        let r = '';
        const notes = calendar.notes.filter(n => n.isVisible(visibleYear, visibleMonth, day.numericRepresentation));
        if(notes.length){
            const userId = GameSettings.UserID();
            const regularNotes = notes.filter(n => n.remindUsers.indexOf(userId) === -1);
            const reminderNotes = notes.filter(n => n.remindUsers.indexOf(userId) !== -1);

            if(regularNotes.length){
                const rCount = regularNotes.length < 100? regularNotes.length : 99;
                let rTitle = RendererUtilities.GenerateNoteIconTitle(rCount, regularNotes);
                r = `<span class="note-count" title="${rTitle}">${rCount}</span>`;
            }
            if(reminderNotes.length){
                const remCount = reminderNotes.length < 100? reminderNotes.length : 99;
                let remTitle = RendererUtilities.GenerateNoteIconTitle(remCount, reminderNotes);
                r += `<span class="note-count reminders" title="${remTitle}">${remCount}</span>`;
            }
        }
        return r;
    }

    /**
     * Gets the icons for all moon phases for the passed in day from the passed in calendar and generates the HTML
     * @param {Calendar} calendar The calendar to pull data from
     * @param {number} visibleYear
     * @param {number} visibleMonth
     * @param {DayTemplate} day The day to check
     */
    public static MoonPhaseIcons(calendar: Calendar, visibleYear: number, visibleMonth: number, day: DayTemplate): string {
        let html = ''
        for(let i = 0; i < calendar.year.moons.length; i++){
            const mp = calendar.year.moons[i].getDateMoonPhase(calendar.year, visibleYear, visibleMonth, day.numericRepresentation);
            if(mp && (mp.singleDay || day.selected || day.current)){
                let moon = Utilities.GetMoonPhaseIcon(mp.icon, calendar.year.moons[i].color);
                html += `<span class="moon-phase ${mp.icon}" title="${calendar.year.moons[i].name} - ${mp.name}">${moon}</span>`;
            }
        }
        return html;
    }
}