import { Router } from "express";
import { register, login, getUserDetails } from "../controllers/user.controller";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

// ✅ Ensure Route Handlers Use `Promise<void>`
router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticateToken, getUserDetails); // Protected

export default router;
