import SimpleCalendar from "./simple-calendar";
//jest.mock('Application');

class Application{}

(globalThis as any).Application = Application;


describe('Simple Calendar Class Tests', () => {
    let sc: SimpleCalendar;

    beforeEach(() => {
        sc = new SimpleCalendar();
    });

    test('Properties', () => {
        expect(Object.keys(sc).length).toBe(2); //Make sure no new properties have been added
    });
});
