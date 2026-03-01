import express from "express";
import { register, login, logout } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);

router.get("/user", authMiddleware, (req, res) => {
  res.json({ message: "Protected route accessed", userId: req.userId });
});

export default router;
