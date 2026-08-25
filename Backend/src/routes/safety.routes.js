import express from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware.js";
import {
  createSafety,
  getAllSafety,
  getSafetyById,
  updateSafety,
  deleteSafety,
} from "../controllers/safety.controller.js";

const router = express.Router();

router.post("/", requireAuth, requireAdmin, createSafety);
router.get("/", requireAuth, getAllSafety);
router.get("/:id", requireAuth, getSafetyById);
router.put("/:id", requireAuth, requireAdmin, updateSafety);
router.delete("/:id", requireAuth, requireAdmin, deleteSafety);

export default router;