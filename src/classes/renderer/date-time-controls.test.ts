/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import {jest, beforeEach, describe, expect, test} from '@jest/globals';
import {DateTimeControls} from "./date-time-controls";
import {CompactViewDateTimeControlDisplay} from "../../constants";

describe('Renderer DateTimeControls Class Tests', () => {
    test("Render", () => {
        const options = {
            showDateControls: true,
            showTimeControls: true,
            showPresetTimeOfDay: true,
            displayType: CompactViewDateTimeControlDisplay.Full,
            fullDisplay:{
                unit: 'seconds',
                unitText: 'FSC.Second',
                dateTimeUnitOpen: true
            },
            largerSteps: false,
            reverseTime: false
        };
        expect(DateTimeControls.Render()).toContain('fsc-unit-controls');
        expect(DateTimeControls.Render(options)).toContain('fsc-open');
        options.fullDisplay.unit = "round";
        expect(DateTimeControls.Render(options)).toContain('fsc-selected');
        options.fullDisplay.unit = "minute";
        expect(DateTimeControls.Render(options)).toContain('fsc-selected');
        options.fullDisplay.unit = "hour";
        expect(DateTimeControls.Render(options)).toContain('fsc-selected');
        options.fullDisplay.unit = "day";
        expect(DateTimeControls.Render(options)).toContain('fsc-selected');
        options.fullDisplay.unit = "month";
        expect(DateTimeControls.Render(options)).toContain('fsc-selected');
        options.fullDisplay.unit = "year";
        expect(DateTimeControls.Render(options)).toContain('fsc-selected');

        options.displayType = CompactViewDateTimeControlDisplay.QuickIncrement;
        expect(DateTimeControls.Render(options)).toContain('fsc-control-group');
        options.largerSteps = true;
        options.reverseTime = true;
        expect(DateTimeControls.Render(options)).toContain('fsc-control-group');
        options.showTimeControls = false;
        options.showDateControls = true;
        expect(DateTimeControls.Render(options)).toContain('fsc-control-group');
        options.largerSteps = false;
        options.reverseTime = false;
        expect(DateTimeControls.Render(options)).toContain('fsc-control-group');
    });
});
