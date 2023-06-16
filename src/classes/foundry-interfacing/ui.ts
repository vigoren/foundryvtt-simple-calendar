export default class Ui {
    public static renderChatLog(){
        //@ts-ignore
        ui.chat._lastId = null;
        //@ts-ignore
        ui.chat._state = 0;
        //@ts-ignore
        ui.chat.render(true);
    }
}
