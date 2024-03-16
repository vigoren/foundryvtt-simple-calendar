import { ModuleName } from "../../constants";
import { CalManager, SC } from "../index";
import { FormatDateTime } from "../utilities/date-time";
import PF2E from "../systems/pf2e";
import D35E from "../systems/D35E";

export class ChatTimestamp {
    public static addGameTimeToMessage(chatMessage: ChatMessage) {
        console.log("ChatTimestamp.addGameTimeToMessage");
        const cal = CalManager.getActiveCalendar();
        const flagData: { id: string; timestamp: number } = {
            id: cal.id,
            timestamp: cal.toSeconds()
        };
        if (D35E.isD35E) {
            // the updateSource function call creates an infinite loop in D35E so we just need to update the source directly, which isn't as safe.
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            chatMessage._source.flags[ModuleName] = { "sc-timestamps": flagData };
        } else {
            //Updating the message flags then updating the source with its own flags ensures what we do not wright over another modules message settings.
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            const messageFlags = chatMessage.flags;
            if (!Object.prototype.hasOwnProperty.call(messageFlags, ModuleName)) {
                messageFlags[ModuleName] = {};
            }
            messageFlags[ModuleName]["sc-timestamps"] = flagData;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            chatMessage.updateSource({ flags: messageFlags });
        }
    }

    public static getFormattedChatTimestamp(chatMessage: ChatMessage) {
        const timestamps = <{ id: string; timestamp: number }>chatMessage.getFlag(ModuleName, "sc-timestamps");
        let formattedDateTime = "";
        if (timestamps) {
            const cal = CalManager.getCalendar(timestamps["id"]);
            if (cal) {
                let seconds = timestamps["timestamp"];
                // If this is a Pathfinder 2E game, add the world creation seconds to the interval seconds
                if (PF2E.isPF2E && cal.generalSettings.pf2eSync) {
                    seconds += PF2E.getWorldCreateSeconds(cal);
                }
                const dateTime = cal.secondsToDate(seconds);
                formattedDateTime = FormatDateTime(dateTime, `${cal.generalSettings.dateFormat.chatTime}`, cal);
            }
        }
        return formattedDateTime;
    }

    public static renderTimestamp(chatMessage: ChatMessage, html: JQuery) {
        if (SC.globalConfiguration.inGameChatTimestamp) {
            const formattedDateTime = this.getFormattedChatTimestamp(chatMessage);
            if (formattedDateTime) {
                const foundryTime = html[0].querySelector(".message-header .message-metadata .message-timestamp");
                if (foundryTime) {
                    (<HTMLElement>foundryTime).style.display = "none";
                    const newTime = document.createElement("time");
                    newTime.classList.add("sc-timestamp");
                    newTime.innerText = formattedDateTime;
                    foundryTime.after(newTime);
                }
            }
        }
        return Promise.resolve();
    }

    public static updateChatMessageTimestamps() {
        const chat = document.getElementById("chat");
        if (chat) {
            chat.querySelectorAll("#chat-log .message").forEach((li) => {
                const message = (<Game>game).messages?.get((<HTMLElement>li).dataset.messageId || "");
                if (message) {
                    const formattedDateTime = this.getFormattedChatTimestamp(message);
                    const foundryTime = li.querySelector(".message-header .message-metadata .message-timestamp");
                    const stamp = <HTMLElement>li.querySelector(".sc-timestamp");
                    if (formattedDateTime && foundryTime) {
                        if (SC.globalConfiguration.inGameChatTimestamp) {
                            (<HTMLElement>foundryTime).style.display = "none";
                            if (stamp) {
                                stamp.innerText = formattedDateTime;
                            } else {
                                const newTime = document.createElement("time");
                                newTime.classList.add("sc-timestamp");
                                newTime.innerText = formattedDateTime;
                                foundryTime.after(newTime);
                            }
                        } else {
                            (<HTMLElement>foundryTime).style.display = "";
                            stamp?.remove();
                        }
                    } else if (formattedDateTime && stamp) {
                        stamp.innerText = formattedDateTime;
                    }
                }
            });
        }
    }
}
