import { TriggerCondition } from "./condition";

export class TriggerCommand {
    command: string;

    conditions: TriggerCondition[] = [];

    constructor(command: string, conditions: TriggerCondition[] = []) {
        this.command = command;

        this.conditions = conditions;
    }
}
