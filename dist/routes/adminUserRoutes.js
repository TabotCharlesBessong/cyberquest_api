"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const adminUserController_1 = require("../controllers/adminUserController");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware, auth_1.adminOnly);
router.get("/", adminUserController_1.getUsers);
router.get("/:id", adminUserController_1.getUserDetail);
router.put("/:id", adminUserController_1.updateUser);
router.delete("/:id", adminUserController_1.deleteUser);
exports.default = router;
//# sourceMappingURL=adminUserRoutes.js.map