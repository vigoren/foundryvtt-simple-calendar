import {TriggerConditions, TriggerParameters} from "../../constants";

export class TriggerCondition {
    conditionType: TriggerConditions = TriggerConditions.CurrentDate;

    parameters: TriggerParameters[] = [];

    constructor(type: TriggerConditions, parameters: TriggerParameters[]) {
        this.conditionType = type;
        this.parameters = parameters;
    }
}