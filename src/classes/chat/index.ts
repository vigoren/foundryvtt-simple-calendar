import {ChatTimestamp} from "./chat-timestamp";
import {ChatMessageData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs";
import {GameSettings} from "../foundry-interfacing/game-settings";


export class Chat{

    public static init(){
        //Extend the ChatMessage export function so that we can add in the game time for each message to the exported list.
        const handler = {
            apply: function(target: () => string, thisArg: ChatMessage, argumentsList: any[]){
                let origExport = target.apply(thisArg);
                return origExport.replace("\n", `\n{Game Time: ${ChatTimestamp.getFormattedChatTimestamp(thisArg)}}\n`);
            }
        };
        ChatMessage.prototype.export = new Proxy(ChatMessage.prototype.export, handler);
    }
    public static createChatMessage(chatMessage: ChatMessage, data: object, messageId: string){
        if(GameSettings.IsGm()){
            ChatTimestamp.addGameTimeToMessage(chatMessage);
        }
        return true;
    }

    public static onRenderChatMessage(chatMessage: ChatMessage, html: JQuery, messageData: ChatMessageData){
        ChatTimestamp.renderTimestamp(chatMessage, html);
    }
}
