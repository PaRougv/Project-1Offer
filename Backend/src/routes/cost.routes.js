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
router.get("/", getAllCost);
router.get("/:id", getCostById);
router.put("/:id", updateCost);
router.delete("/:id", deleteCost);

export default router;