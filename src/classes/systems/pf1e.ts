import { FoundryVTTGameData } from "../foundry-interfacing/game-data";

export default class PF1E {
    /**
     * Is the current system pathfinder 1e?
     */
    public static get isPF1E() {
        return FoundryVTTGameData.systemID === "pf1";
    }
}
