import express from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware.js";
import {
  createQuality,
  getAllQuality,
  getQualityById,
  updateQuality,
  deleteQuality,
} from "../controllers/quality.controller.js";

const router = express.Router();

router.post("/", requireAuth, requireAdmin, createQuality);
router.get("/", requireAuth, getAllQuality);
router.get("/:id", requireAuth, getQualityById);
router.put("/:id", requireAuth, requireAdmin, updateQuality);
router.delete("/:id", requireAuth, requireAdmin, deleteQuality);

export default router;