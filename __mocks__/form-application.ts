
// @ts-ignore
class FormApplication {
    object;
    element: any;
    constructor(o: any) {
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

        const weekdayNames = document.createElement('input');
        weekdayNames.setAttribute('data-index', '0');
        weekdayNames.value = 'Z';


        this.element = {
            find: jest.fn()
                .mockReturnValueOnce([noDataAttr]).mockReturnValueOnce([noDataAttr]).mockReturnValueOnce([noDataAttr])
                .mockReturnValueOnce([monthNames]).mockReturnValueOnce([invalidMonthDays]).mockReturnValueOnce([weekdayNames])
                .mockReturnValueOnce([monthNames]).mockReturnValueOnce([sameMonthDays]).mockReturnValueOnce([weekdayNames])
                .mockReturnValueOnce([monthNames]).mockReturnValueOnce([monthDays]).mockReturnValueOnce([weekdayNames])
                .mockReturnValueOnce([monthNames]).mockReturnValueOnce([sameMonthDays]).mockReturnValueOnce([weekdayNames])
                .mockReturnValueOnce([monthNames]).mockReturnValueOnce([monthDays]).mockReturnValueOnce([weekdayNames])
        };
    }

    static get defaultOptions() { return {title:'',template:'',resizable: false, classes: []}; }

    rendered = true;

    render(force: boolean, options: any){}

    close(){return Promise.resolve();}
}

// @ts-ignore
global.FormApplication = FormApplication;
