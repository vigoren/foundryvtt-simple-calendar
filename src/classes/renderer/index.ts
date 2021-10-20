import Calendar from "../calendar";
import {DayTemplate, SCRenderer} from "../../interfaces";
import {GameSettings} from "../game-settings";
import Utilities from "../utilities";
import RendererUtilities from "./utilities";
import {DateRangeMatch} from "../../constants";

export default class Renderer{

    /**
     * The default options used when creating a full view calendar
     * @private
     */
    private static fullCalendarDefaultOptions: SCRenderer.Options = {
        id: '',
        colorToMatchSeason: true,
        cssClasses: '',
        showCurrentDay: true,
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
    public static CalendarFull(calendar: Calendar, options: SCRenderer.Options = {id: ''}): string {
        options = Utilities.deepMerge({}, this.fullCalendarDefaultOptions, options);
        //TODO: Add a way to activate all of the listeners so the calendar can be interactive
        //TODO: Add an option so that if interactivity is disabled the CSS hover states and the month change buttons are disabled

        let monthYearFormat = calendar.generalSettings.dateFormat.monthYear;
        if(!options.showYear){
            monthYearFormat = monthYearFormat.replace(/YN|YA|YZ|YY(?:YY)?/g, '');
        }

        let vYear, vMonth = 1, vMonthIndex, ssYear, ssMonth, ssDay, seYear, seMonth, seDay, weeks: (boolean | DayTemplate)[][] = [], calendarStyle = '', seasonName = '';
        if(options.date){
            if(options.date.month > 0 && options.date.month < calendar.year.months.length){
                vMonth = calendar.year.months[options.date.month].numericRepresentation;
            } else {
                vMonth = calendar.year.months[0].numericRepresentation;
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
        }

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
            vMonthIndex = calendar.year.months.findIndex(m => m.numericRepresentation === vMonth);
            const season = calendar.year.getSeason(vMonthIndex, ssDay? ssDay : 1);
            seasonName = season.name;
            calendarStyle = `background-color:${season.color};`;
        }

        let html = `<div id="${options.id}" class="calendar ${options.cssClasses}" style="${options.colorToMatchSeason? calendarStyle : ''}">`;
        //Put the header together
        html += `<div class="calendar-header" style="${options.colorToMatchSeason?calendarStyle:''}">`;
        //Visible date change and current date
        html += `<div class="current-date"><a class="fa fa-chevron-left" title="${GameSettings.Localize('FSC.ChangePreviousMonth')}"></a><span class="month-year" data-visible="${vMonth}/${vYear}">${Utilities.FormatDateTime({year: vYear, month: vMonth, day: 1, hour: 0, minute: 0, seconds: 0}, monthYearFormat)}</span><a class="fa fa-chevron-right" title="${GameSettings.Localize('FSC.ChangeNextMonth')}"></a></div>`;
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
                        if(options.showCurrentDay && vYear === calendar.year.numericRepresentation && (<DayTemplate>weeks[i][x]).current){
                            dayClass += ' current';
                        }

                        html += `<div class="${dayClass}" data-day="${(<DayTemplate>weeks[i][x]).numericRepresentation}">`;
                        if(options.showNoteCount){
                            html += `<div class="day-notes">${Renderer.NoteIndicator(calendar, vYear, vMonth, <DayTemplate>weeks[i][x])}</div>`;
                        }
                        html += (<DayTemplate>weeks[i][x]).name;
                        if(options.showMoonPhases){
                            html += `<div class="moons">${Renderer.MoonPhaseIcons(calendar, vYear, vMonth, <DayTemplate>weeks[i][x])}</div>`;
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