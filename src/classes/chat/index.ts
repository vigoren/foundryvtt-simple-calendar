import { ChatTimestamp } from "./chat-timestamp";

export class Chat {
    public static init() {
        //Extend the ChatMessage export function so that we can add in the game time for each message to the exported list.
        const handler = {
            apply: function (target: () => string, thisArg: ChatMessage) {
                const origExport = target.apply(thisArg);
                return origExport.replace("\n", `\n{Game Time: ${ChatTimestamp.getFormattedChatTimestamp(thisArg)}}\n`);
            }
        };
        ChatMessage.prototype.export = new Proxy(ChatMessage.prototype.export, handler);
    }
    public static createChatMessage(chatMessage: ChatMessage) {
        ChatTimestamp.addGameTimeToMessage(chatMessage);
        return true;
    }

    public static onRenderChatMessage(chatMessage: ChatMessage, html: JQuery) {
        return ChatTimestamp.renderTimestamp(chatMessage, html);
    }
}
