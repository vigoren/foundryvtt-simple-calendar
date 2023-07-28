export default class Ui {
    public static renderChatLog() {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        ui.chat._lastId = null;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        ui.chat._state = 0;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        ui.chat.render(true);
    }
}
