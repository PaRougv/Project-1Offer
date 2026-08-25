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
router.get("/", getAllDelivery);
router.get("/:id", getDeliveryById);
router.put("/:id", updateDelivery);
router.delete("/:id", deleteDelivery);

export default router;