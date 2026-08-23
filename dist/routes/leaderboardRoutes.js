"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const leaderboardController_1 = require("../controllers/leaderboardController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
router.get("/", leaderboardController_1.getLeaderboard);
router.post("/recompute", leaderboardController_1.recomputeLeaderboard);
exports.default = router;
//# sourceMappingURL=leaderboardRoutes.js.map