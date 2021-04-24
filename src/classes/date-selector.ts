import Year from "./year";
import SimpleCalendar from "./simple-calendar";
import {DayTemplate} from "../interfaces";

export default class DateSelector {

    static build(id: string, placeHolderText: string, year: Year){
        let currentDate = {
            text: '',
            year: year.numericRepresentation,
            month: 0,
            monthText: '',
            day: 0
        };
        const currentYear = year.numericRepresentation;
        const currentMonth = year.getMonth();
        let currentDay = null;
        if(currentMonth){
            currentDate.month = currentMonth.numericRepresentation;
            currentDate.monthText = currentMonth.name;
            currentDay = currentMonth.getDay();
            if(currentDay){
                currentDate.day = currentDay.numericRepresentation;
                currentDate.text = `${currentMonth.name} ${currentDay.numericRepresentation}, ${currentYear}`;
            } else {
                currentDate.text = `${currentMonth.name} ${currentYear}`;
            }
        }

        const input = jQuery(`<div></div>`).append(`<input type="hidden" value="${currentDate.year}-${currentDate.month}-${currentDate.day}" id="${id}"/><input class="display-input" value="${currentDate.text}" placeholder="${placeHolderText}" tabindex="0" type="text" readonly="readonly">`);
        const calendar = jQuery(`<div class="sc-date-selector-calendar"></div>`);
        calendar.append(`<div class="header"><div class="current"><div class="prev"></div><span>${currentDate.monthText} ${currentDate.year}</span><div class="next"></div></div></div>`);
        if(year.showWeekdayHeadings){
            let weekdayRow = '<div class="weekdays">';
            for(let i = 0; i < year.weekdays.length; i++){
                const wd = year.weekdays[i].toTemplate();
                weekdayRow += `<div class="weekday" title="${wd.name}">${wd.firstCharacter}</div>`;
            }
            weekdayRow += '</div>';
            calendar.find('.header').append(weekdayRow);
        }
        let dayContainer = '<div class="days">';
        const yt = year.toTemplate();
        for(let i = 0; i < yt.weeks.length; i++){
            dayContainer += `<div class="week">`;
            for(let d = 0; d < yt.weeks[i].length; d++){
                if(yt.weeks[i][d] === false){
                    dayContainer += `<div class="empty-day"></div>`;
                } else {
                    const selected = (<DayTemplate>yt.weeks[i][d]).numericRepresentation === currentDate.day? 'selected' : '';
                    dayContainer += `<div class='day ${selected}' data-day='${(<DayTemplate>yt.weeks[i][d]).numericRepresentation}'>${(<DayTemplate>yt.weeks[i][d]).name}</div>`;
                }
            }
            dayContainer += '</div>';
        }
        dayContainer += '</div>';
        calendar.append(dayContainer);

        input.append(calendar);
        return `<div class="sc-date-selector">${input.html()}</div>`;
    }

}
