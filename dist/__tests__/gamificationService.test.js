"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gamificationService_1 = require("../services/gamificationService");
describe("GamificationService", () => {
    describe("calculateLevel", () => {
        it("returns level 1 for 0 XP", () => {
            expect(gamificationService_1.GamificationService.calculateLevel(0)).toBe(1);
        });
        it("returns level 2 for 100 XP", () => {
            expect(gamificationService_1.GamificationService.calculateLevel(100)).toBe(2);
        });
        it("returns level 3 for 400 XP", () => {
            expect(gamificationService_1.GamificationService.calculateLevel(400)).toBe(3);
        });
        it("returns level 10 for 8100 XP", () => {
            expect(gamificationService_1.GamificationService.calculateLevel(8100)).toBe(10);
        });
    });
    describe("xpForNextLevel", () => {
        it("returns 100 for level 1", () => {
            expect(gamificationService_1.GamificationService.xpForNextLevel(0)).toBe(100);
        });
        it("returns 300 for level 2", () => {
            expect(gamificationService_1.GamificationService.xpForNextLevel(100)).toBe(300);
        });
    });
    describe("xpIntoLevel", () => {
        it("returns 0 at level boundary", () => {
            expect(gamificationService_1.GamificationService.xpIntoLevel(100)).toBe(0);
        });
        it("returns 50 halfway through level 2", () => {
            expect(gamificationService_1.GamificationService.xpIntoLevel(150)).toBe(50);
        });
    });
});
//# sourceMappingURL=gamificationService.test.js.map