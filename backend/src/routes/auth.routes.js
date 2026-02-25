import express from "express";
import { signup, login, logout, me } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/signup", signup);

// Protected routes (require token)
router.post("/login", verifyToken, login); // Verify token and start session
router.post("/logout", verifyToken, logout); 
router.get("/me", verifyToken, me);

export default router;
