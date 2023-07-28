import { TriggerParameters } from "../../constants";

export class TriggerParameter {
    type: TriggerParameters;

    modifier: number;

    isOr: boolean = false;

    constructor(type: TriggerParameters, modifier: number = 0) {
        this.type = type;
        this.modifier = modifier;
    }

    check(v1: number, v2: number) {
        let result = false;
        switch (this.type) {
            case TriggerParameters.After:
                result = v1 > v2;
                break;
            case TriggerParameters.Before:
                result = v1 < v2;
                break;
            case TriggerParameters.Nth:
                result = v1 % this.modifier === 0;
                break;
            case TriggerParameters.Equal:
            default:
                result = v1 === v2;
                break;
        }
        return result;
    }
}
