import express from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware.js";

import {
  createDelivery,
  getAllDelivery,
  getDeliveryById,
  updateDelivery,
  deleteDelivery
} from "../controllers/delivery.controller.js";

const router = express.Router();

router.post("/", requireAuth, requireAdmin, createDelivery);
router.get("/", requireAuth, getAllDelivery);
router.get("/:id", requireAuth, getDeliveryById);
router.put("/:id", requireAuth, requireAdmin, updateDelivery);
router.delete("/:id", requireAuth, requireAdmin, deleteDelivery);

export default router;