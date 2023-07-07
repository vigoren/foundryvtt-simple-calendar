import {jest} from '@jest/globals';
class DraggableMock{

    handlers = {
        dragMove: [],
        dragUp: []
    };

    constructor() {
    }
}

//@ts-ignore
window.Draggable = DraggableMock;
//@ts-ignore
window.jQuery = jest.fn();
