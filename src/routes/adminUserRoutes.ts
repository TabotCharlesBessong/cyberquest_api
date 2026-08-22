import { Router } from "express";
import { authMiddleware, adminOnly } from "../middleware/auth";
import {
  getUsers,
  getUserDetail,
  updateUser,
  deleteUser,
} from "../controllers/adminUserController";

const router = Router();

router.use(authMiddleware, adminOnly);

router.get("/", getUsers);
router.get("/:id", getUserDetail);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
