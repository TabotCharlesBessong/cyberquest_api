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

router.get("/users", getUsers);
router.get("/users/:id", getUserDetail);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;
