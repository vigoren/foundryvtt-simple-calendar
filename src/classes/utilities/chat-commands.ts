import { CalManager } from "../index";
import { FormatDateTime } from "./date-time";
import { Logger } from "../logging";
import { GameSettings } from "../foundry-interfacing/game-settings";

export function ParseChatCommand(message: string) {
    let processed = false;
    const messageParts = message.split(" ");

    if (messageParts[0] === "/scal" && messageParts.length > 1) {
        messageParts.shift();
        const command = messageParts.shift();
        const options = messageParts.join("").trim();
        const calendar = CalManager.getActiveCalendar().clone(false);
        switch (command) {
            case "today":
                processed = true;
                break;
            case "yesterday":
                processed = true;
                calendar.changeDay(-1);
                break;
            case "tomorrow":
                processed = true;
                calendar.changeDay(1);
                break;
            default:
                break;
        }
        if (processed) {
            //Process any options
            if (options) {
                const regex = /([+-])(\d*)(sec|min|hr|d|m|y)/gi;
                const matches = [...options.matchAll(regex)];
                if (matches && matches.length) {
                    matches.forEach((match) => {
                        if (match.length === 4) {
                            const operator = match[1];
                            let value = parseInt(match[2]);
                            const unit = match[3];
                            if (!isNaN(value)) {
                                if (operator === "-") {
                                    value = value * -1;
                                }
                                switch (unit.toLowerCase()) {
                                    case "y":
                                        calendar.changeYear(value, false, "current");
                                        break;
                                    case "m":
                                        calendar.changeMonth(value, "current");
                                        break;
                                    case "d":
                                        calendar.changeDay(value, "current");
                                        break;
                                    case "hr":
                                        calendar.time.changeTime(value, 0, 0);
                                        break;
                                    case "min":
                                        calendar.time.changeTime(0, value, 0);
                                        break;
                                    case "sec":
                                        calendar.time.changeTime(0, 0, value);
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }
                    });
                }
            }
            const currentDate = calendar.getDateTime();
            let content = `<div class="fsc-chat-command-input">${command} ${options}</div>`;
            content += `<div class="fsc-chat-command-result">${FormatDateTime(
                currentDate,
                `${calendar.generalSettings.dateFormat.date} ${calendar.generalSettings.dateFormat.time}`,
                calendar
            )}</div>`;
            content += `<div class="fsc-actions"><button class="fsc-control" data-date='${JSON.stringify({
                year: currentDate.year,
                month: currentDate.month,
                day: currentDate.day
            })}'>View In Simple Calendar</button></div>`;
            ChatMessage.create({
                type: 1,
                content: `<div class="simple-calendar fsc-simple-calendar-message">${content}</div>`,
                whisper: [GameSettings.UserID()]
            }).catch(Logger.error);
        }
    }
    return !processed;
}
