import NoteStub from "./note-stub";

/**
 * An event that can be triggered when a note is considered active
 */
export class NoteTrigger {
    /**
     * If this trigger should only be fired once
     */
    fireOnce: boolean = true;
    /**
     * If this trigger has been fired
     */
    fired: boolean = false;
    /**
     * The function to call when the trigger is fired
     */
    onFire: (note: NoteStub, initialLoad: boolean) => boolean;

    /**
     * An event that can be triggered when a note is considered active
     * @param onFire The function to call when the trigger is fired
     * @param fireOnce If this trigger should only be fired once
     */
    constructor(onFire: (note: NoteStub, initialLoad: boolean) => boolean, fireOnce: boolean) {
        this.fireOnce = fireOnce;
        this.onFire = onFire;
    }

    /**
     * Fire the note trigger
     * @param note The note stub this trigger is for
     * @param initialLoad If this is the initial load of foundry or not
     */
    fire(note: NoteStub, initialLoad: boolean = false) {
        if (!this.fireOnce || (this.fireOnce && !this.fired)) {
            this.fired = this.onFire(note, initialLoad);
        }
    }
}
