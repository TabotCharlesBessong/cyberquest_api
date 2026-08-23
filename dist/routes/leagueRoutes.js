"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const leagueController_1 = require("../controllers/leagueController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
router.get("/me", leagueController_1.getMyLeague);
router.post("/weekly-reset", leagueController_1.runWeeklyReset);
exports.default = router;
//# sourceMappingURL=leagueRoutes.js.map