import { FoundryVTTGameData } from "../foundry-interfacing/game-data";

export default class D35E {
    /**
     * Is the current system pathfinder 1e?
     */
    public static get isD35E() {
        return FoundryVTTGameData.systemID === "D35E";
    }
}
