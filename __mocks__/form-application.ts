import {jest} from '@jest/globals';
import "./application";

// @ts-ignore
class FormApplication extends Application{
    object;
    // @ts-ignore
    element: any;
    editors: any = [];
    _tabs: any = [{active: ''}];

    constructor(o: any) {
        super();
        this.object = o;

        const noDataAttr = document.createElement("input");

        const monthNames = document.createElement("input");
        monthNames.setAttribute('data-index', '0');
        monthNames.value = 'X';
        const invalidMonthDays = document.createElement("input");
        invalidMonthDays.setAttribute('data-index', '0');
        invalidMonthDays.value = 'X';
        const sameMonthDays = document.createElement("input");
        sameMonthDays.setAttribute('data-index', '0');
        sameMonthDays.value = '5';
        const monthDays = document.createElement("input");
        monthDays.setAttribute('data-index', '0');
        monthDays.value = '7';

        const intercalary = document.createElement('input');
        intercalary.setAttribute('data-index', '0');
        intercalary.checked = false;

        const monthLeapDays = document.createElement("input");
        monthLeapDays.setAttribute('data-index', '0');
        monthLeapDays.value = '7';

        const weekdayNames = document.createElement('input');
        weekdayNames.setAttribute('data-index', '0');
        weekdayNames.value = 'Z';


        const seasonNames = document.createElement('input');
        seasonNames.setAttribute('data-index', '0');
        seasonNames.value = 'Spring';
        const seasonStart = document.createElement('input');
        seasonStart.setAttribute('data-index', '0');
        seasonStart.value = '2';
        const seasonColor = document.createElement('input');
        seasonColor.setAttribute('data-index', '0');
        seasonColor.value = '#ffffff';




        this.element = {
            find: jest.fn()
                .mockReturnValueOnce([noDataAttr]).mockReturnValueOnce([noDataAttr]).mockReturnValueOnce([noDataAttr]).mockReturnValueOnce([noDataAttr]).mockReturnValueOnce([noDataAttr]).mockReturnValueOnce([noDataAttr]).mockReturnValueOnce({find: jest.fn(()=>{return {val: jest.fn(() => {return '';})};})}).mockReturnValueOnce([noDataAttr]).mockReturnValueOnce([noDataAttr]).mockReturnValueOnce([noDataAttr]).mockReturnValueOnce([noDataAttr]).mockReturnValueOnce([noDataAttr])
                .mockReturnValueOnce([monthNames]).mockReturnValueOnce([invalidMonthDays]).mockReturnValueOnce([intercalary]).mockReturnValueOnce([intercalary]).mockReturnValueOnce([]).mockReturnValueOnce([weekdayNames]).mockReturnValueOnce({find: jest.fn(()=>{return {val: jest.fn(() => {return 'none';})};})}).mockReturnValueOnce([seasonNames]).mockReturnValueOnce([invalidMonthDays]).mockReturnValueOnce([invalidMonthDays]).mockReturnValueOnce([seasonColor]).mockReturnValueOnce([seasonColor])
                .mockReturnValueOnce([monthNames]).mockReturnValueOnce([sameMonthDays]).mockReturnValueOnce([intercalary]).mockReturnValueOnce([intercalary]).mockReturnValueOnce([invalidMonthDays]).mockReturnValueOnce([weekdayNames]).mockReturnValueOnce({find: jest.fn(()=>{return {val: jest.fn(() => {return 'custom';})};})}).mockReturnValueOnce([seasonNames]).mockReturnValueOnce([seasonStart]).mockReturnValueOnce([seasonStart]).mockReturnValueOnce([seasonColor]).mockReturnValueOnce([seasonColor])
                .mockReturnValueOnce([monthNames]).mockReturnValueOnce([sameMonthDays]).mockReturnValueOnce([intercalary]).mockReturnValueOnce([intercalary]).mockReturnValueOnce([monthLeapDays]).mockReturnValueOnce([weekdayNames]).mockReturnValueOnce({find: jest.fn(()=>{return {val: jest.fn(() => {return 'custom';})};})}).mockReturnValueOnce([seasonNames]).mockReturnValueOnce([seasonStart]).mockReturnValueOnce([seasonStart]).mockReturnValueOnce([seasonColor]).mockReturnValueOnce([seasonColor])
                .mockReturnValueOnce([monthNames]).mockReturnValueOnce([monthDays]).mockReturnValueOnce([intercalary]).mockReturnValueOnce([intercalary]).mockReturnValueOnce([monthLeapDays]).mockReturnValueOnce([weekdayNames]).mockReturnValueOnce({find: jest.fn(()=>{return {val: jest.fn(() => {return 'none';})};})}).mockReturnValueOnce([seasonNames]).mockReturnValueOnce([seasonStart]).mockReturnValueOnce([seasonStart]).mockReturnValueOnce([seasonColor]).mockReturnValueOnce([seasonColor])
                .mockReturnValueOnce([monthNames]).mockReturnValueOnce([invalidMonthDays]).mockReturnValueOnce([intercalary]).mockReturnValueOnce([intercalary]).mockReturnValueOnce([monthLeapDays]).mockReturnValueOnce([weekdayNames]).mockReturnValueOnce({find: jest.fn(()=>{return {val: jest.fn(() => {return 'none';})};})}).mockReturnValueOnce([seasonNames]).mockReturnValueOnce([seasonStart]).mockReturnValueOnce([seasonStart]).mockReturnValueOnce([seasonColor]).mockReturnValueOnce([seasonColor])
                .mockReturnValueOnce([monthNames]).mockReturnValueOnce([monthDays]).mockReturnValueOnce([intercalary]).mockReturnValueOnce([intercalary]).mockReturnValueOnce([monthLeapDays]).mockReturnValueOnce([weekdayNames]).mockReturnValueOnce({find: jest.fn(()=>{return {val: jest.fn(() => {return 'none';})};})}).mockReturnValueOnce([seasonNames]).mockReturnValueOnce([seasonStart]).mockReturnValueOnce([seasonStart]).mockReturnValueOnce([seasonColor]).mockReturnValueOnce([seasonColor])
        };
    }

    static get defaultOptions() { return {title:'',template:'',resizable: false, classes: []}; }

    get rendered(){return true};

    // @ts-ignore
    render(force: boolean, options: any){}

    close(){return Promise.resolve();}

    getData(){return {};}

    activateEditor(a: string){}
    saveEditor(a: string){}
    bringToTop(){}
    maximize(){return Promise.resolve();}
    setPosition(){}
}

// @ts-ignore
global.FormApplication = FormApplication;
