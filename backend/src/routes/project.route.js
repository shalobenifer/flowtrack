import express from "express";
import taskRoute from "./task.route.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createProject,
  updateProject,
  deleteProject,
  getProjects,
  getProject,
} from "../controllers/project.controller.js";

const router = express.Router();
router.use(authMiddleware);

router.post("/", createProject);
router.get("/", getProjects);
router.patch("/:projectId", updateProject);
router.delete("/:projectId", deleteProject);
router.get("/:projectId", getProject);

router.use("/:projectId/tasks", taskRoute);

export default router;
