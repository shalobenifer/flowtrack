import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createTask,
  getProjectTasks,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";

const router = express.Router({ mergeParams: true });
router.use(authMiddleware);

router.post("/", createTask);
router.get("/", getProjectTasks);
router.patch("/:taskId", updateTask);
router.delete("/:taskId", deleteTask);

export default router;
