import Renderer from "./index";

describe('Renderer Class Tests', () => {
    test('Renderer', () => {
        expect(Renderer.CalendarFull).toBeDefined();
        expect(Renderer.Clock).toBeDefined();
        expect(Renderer.TimeSelector).toBeDefined();
    });
});