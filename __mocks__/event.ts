//@ts-ignore
class Event{
    stopPropagation(){}
    preventDefault(){}
    constructor() {
        this.currentTarget.setAttribute('data-type', '');
        this.currentTarget.classList.add('next');
    }
    target = document.createElement('input');
    currentTarget = document.createElement('a');
}

//@ts-ignore
global.Event = Event;
