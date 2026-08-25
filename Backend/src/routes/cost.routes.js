import express from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware.js";

import {
  createCost,
  getAllCost,
  getCostById,
  updateCost,
  deleteCost
} from "../controllers/cost.controller.js";

const router = express.Router();

router.post("/", requireAuth, requireAdmin, createCost);
router.get("/", requireAuth, getAllCost);
router.get("/:id", requireAuth, getCostById);
router.put("/:id", requireAuth, requireAdmin, updateCost);
router.delete("/:id", requireAuth, requireAdmin, deleteCost);

export default router;