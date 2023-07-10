/**
 * @jest-environment jsdom
 */
import "../../../__mocks__/index";
import {jest, beforeEach, describe, expect, test} from '@jest/globals';
import MultiSelect from "./multi-select";

describe('Renderer MultiSelect Class Tests', () => {

    test('Render', () => {
        expect(MultiSelect.Render()).toContain("fsc-multiselect");
        expect(MultiSelect.Render({id: '', options: [{selected: true, value: "val1", text: "Option 1"},{selected: false, value: "val2", text: "Option 2"},{selected: false, value: "val3", text: "Option 3", disabled: true}]}, true)).toContain("fsc-show");
    });

    test('Activate Listeners', () => {
        const msParent = document.createElement('div');
        const msElm = document.createElement('div');
        const cElm = document.createElement('div');
        msParent.append(msElm);
        jest.spyOn(document, 'getElementById').mockReturnValue(msElm);
        //@ts-ignore
        jest.spyOn(msParent, 'querySelectorAll').mockReturnValue([cElm]);
        jest.spyOn(msParent, 'querySelector').mockReturnValue(cElm);
        jest.spyOn(cElm, 'addEventListener').mockImplementation(() => {});

        MultiSelect.ActivateListeners('', () => {});
        expect(cElm.addEventListener).toHaveBeenCalledTimes(2);
    });

    test('Event Listener', () => {
        const msParent = document.createElement('div');
        const msElm = document.createElement('div');
        const msInput = document.createElement('input');
        msParent.append(msElm);
        jest.spyOn(document, 'getElementById').mockReturnValue(msElm);
        const msQS = jest.spyOn(msParent, "querySelector").mockReturnValue(msElm);

        MultiSelect.EventListener('', 'button', ()=>{}, new Event('click'));
        expect(msElm.classList.contains('fsc-show')).toBe(true);

        MultiSelect.EventListener('', 'button', ()=>{}, new Event('click'));
        expect(msElm.classList.contains('fsc-show')).toBe(false);

        const opt = document.createElement('li');
        opt.setAttribute('data-value', 'v');
        msQS.mockReturnValue(msInput);
        const fEvent = {
            stopPropagation: jest.fn(),
            target: opt
        };
        const callBack = jest.fn();
        msInput.value = '{"id": "", "options":[{"value":"v", "makeOthersMatch": true},{"value2":"v2", "makeOthersMatch": false}]}';
        //@ts-ignore
        MultiSelect.EventListener('', 'option', callBack, fEvent);
    });

    test('Body Event Listener', () => {
        const ms = document.createElement('div');
        const msChild = document.createElement('div');
        ms.append(msChild);

        msChild.id = "id";

        //@ts-ignore
        jest.spyOn(document, "querySelectorAll").mockReturnValue([ms]);
        jest.spyOn(ms, "querySelector").mockReturnValue(msChild);

        MultiSelect.BodyEventListener();
        expect(ms.querySelector).toHaveBeenCalledTimes(2);

        //@ts-ignore
        MultiSelect.clickedElement = "id";
        MultiSelect.BodyEventListener();
        expect(ms.querySelector).toHaveBeenCalledTimes(3);
    });
});
