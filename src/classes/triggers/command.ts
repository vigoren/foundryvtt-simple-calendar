import {TriggerCondition} from "./condition";
import {TriggerConditions, TriggerParameters} from "../../constants";

export class TriggerCommand{
    command: string;

    conditions: TriggerCondition[] = [];

    constructor(command:string) {
        this.command = command;

        this.conditions.push(new TriggerCondition(TriggerConditions.CurrentDate, [TriggerParameters.AddSubtract]));
    }
}