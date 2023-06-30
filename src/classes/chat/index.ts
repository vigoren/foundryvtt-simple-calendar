import {ChatTimestamp} from "./chat-timestamp";
import {ChatMessageData} from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs";
import {GameSettings} from "../foundry-interfacing/game-settings";


export class Chat{
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
