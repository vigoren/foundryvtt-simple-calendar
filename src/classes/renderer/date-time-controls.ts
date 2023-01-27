import {deepMerge} from "../utilities/object";
import {GameSettings} from "../foundry-interfacing/game-settings";
import {GetIcon} from "../utilities/visual";
import {CompactViewDateTimeControlDisplay, Icons} from "../../constants";

export class DateTimeControls {

    private static defaultOptions: SimpleCalendar.Renderer.DateTimeControlOptions = {
        showDateControls: true,
        showTimeControls: true,
        showPresetTimeOfDay: true,
        displayType: CompactViewDateTimeControlDisplay.Full,
        fullDisplay:{
            unit: '',
            unitText: '',
            dateTimeUnitOpen: false
        }
    };
    public static Render(options: SimpleCalendar.Renderer.DateTimeControlOptions = {}): string{
        options = deepMerge({}, this.defaultOptions, options);
        let html = '<div class="fsc-controls fsc-unit-controls">';
        if(options.displayType === CompactViewDateTimeControlDisplay.Full){
            html += `<div class="fsc-control-group">
                        <button class="fsc-control fsc-primary" data-tooltip="${GameSettings.Localize('FSC.MoveBackwardFive')}" data-type="${options.fullDisplay?.unit}" data-amount="-5"><span class="fa fa-angle-double-left"></span></button>
                        <button class="fsc-control fsc-primary" data-tooltip="${GameSettings.Localize('FSC.MoveBackwardOne')}" data-type="${options.fullDisplay?.unit}" data-amount="-1"><span class="fa fa-angle-left"></span></button>
                        <button class="fsc-control fsc-primary fsc-selector" data-unit="time">${GameSettings.Localize(options.fullDisplay?.unitText || '')}&nbsp;</button>
                        <button class="fsc-control fsc-primary" data-tooltip="${GameSettings.Localize('FSC.MoveForwardOne')}" data-type="${options.fullDisplay?.unit}" data-amount="1"><span class="fa fa-angle-right"></span></button>
                        <button class="fsc-control fsc-primary" data-tooltip="${GameSettings.Localize('FSC.MoveForwardFive')}" data-type="${options.fullDisplay?.unit}" data-amount="5"><span class="fa fa-angle-double-right"></span></button>
                        <ul class="fsc-unit-list fsc-time-units fsc-primary ${options.fullDisplay?.dateTimeUnitOpen? 'fsc-open' : 'fsc-closed'}">`;
            if(options.showTimeControls){
                html += `<li class="${options.fullDisplay?.unit === 'seconds'? 'fsc-selected' : ''}" data-unit="seconds">${GameSettings.Localize('FSC.Second')}</li>
                        <li class="${options.fullDisplay?.unit === 'round'? 'fsc-selected' : ''}" data-unit="round">${GameSettings.Localize('FSC.Round')}</li>
                        <li class="${options.fullDisplay?.unit === 'minute'? 'fsc-selected' : ''}" data-unit="minute">${GameSettings.Localize('FSC.Minute')}</li>
                        <li class="${options.fullDisplay?.unit === 'hour'? 'fsc-selected' : ''}" data-unit="hour">${GameSettings.Localize('FSC.Hour')}</li>`;
            }
            if(options.showDateControls){
                html += `<li class="${options.fullDisplay?.unit === 'day'? 'fsc-selected' : ''}" data-unit="day">${GameSettings.Localize('FSC.Day')}</li>
                        <li class="${options.fullDisplay?.unit === 'month'? 'fsc-selected' : ''}" data-unit="month">${GameSettings.Localize('FSC.Month')}</li>
                        <li class="${options.fullDisplay?.unit === 'year'? 'fsc-selected' : ''}" data-unit="year">${GameSettings.Localize('FSC.Year')}</li>`;
            }
            html += '</ul></div>';
        } else if(options.showTimeControls && options.displayType === CompactViewDateTimeControlDisplay.QuickIncrement){
            html += `<div class="fsc-control-group">                        
                        <button class="fsc-control fsc-primary" data-tooltip="1 ${GameSettings.Localize('FSC.Round')}" data-type="round" data-amount="1">1&nbsp;${GameSettings.Localize('FSC.RoundShorthand')}</button>
                        <button class="fsc-control fsc-primary" data-tooltip="1 ${GameSettings.Localize('FSC.Minute')}" data-type="minute" data-amount="1">1&nbsp;${GameSettings.Localize('FSC.MinuteShorthand')}</button>
                        <button class="fsc-control fsc-primary" data-tooltip="5 ${GameSettings.Localize('FSC.Minute')}" data-type="minute" data-amount="5">5&nbsp;${GameSettings.Localize('FSC.MinuteShorthand')}</button>
                        <button class="fsc-control fsc-primary" data-tooltip="15 ${GameSettings.Localize('FSC.Minute')}" data-type="minute" data-amount="15">15&nbsp;${GameSettings.Localize('FSC.MinuteShorthand')}</button>
                        <button class="fsc-control fsc-primary" data-tooltip="1 ${GameSettings.Localize('FSC.Hour')}" data-type="hour" data-amount="1">1&nbsp;${GameSettings.Localize('FSC.HourShorthand')}</button>
                    </div>`;
        }
        if(options.showTimeControls && options.showPresetTimeOfDay){
            html += `<div class="fsc-control-group">
                            <button class="fsc-control fsc-secondary" data-type="sunrise" data-tooltip="${GameSettings.Localize('FSC.Dawn')}">${GetIcon(Icons.Sunrise)}</button>
                            <button class="fsc-control fsc-secondary" data-type="midday" data-tooltip="${GameSettings.Localize('FSC.Midday')}">${GetIcon(Icons.Midday)}</button>
                            <button class="fsc-control fsc-secondary" data-type="sunset" data-tooltip="${GameSettings.Localize('FSC.Dusk')}">${GetIcon(Icons.Sunset)}</button>
                            <button class="fsc-control fsc-secondary" data-type="midnight" data-tooltip="${GameSettings.Localize('FSC.Midnight')}">${GetIcon(Icons.Midnight)}</button>
                        </div>`;
        }
        html += '</div>';

        return html;
    }

}
