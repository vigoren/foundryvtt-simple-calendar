/**
 * Accessors for foundry game data
 */
export class FoundryVTTGameData {
    /**
     * Get the ID of the current world
     */
    public static get worldId(): string {
        return (<Game>game).world.id;
    }

    /**
     * Get the ID of the current system
     */
    public static get systemID(): string {
        return (<Game>game).system.id;
    }

    /**
     * Get the version of the current system
     */
    public static get systemVersion(): string {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        return (<Game>game).system.version || (<Game>game).system.data.version;
    }
}
