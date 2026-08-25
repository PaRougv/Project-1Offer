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
router.get("/", getAllQuality);
router.get("/:id", getQualityById);
router.put("/:id", updateQuality);
router.delete("/:id", deleteQuality);

export default router;