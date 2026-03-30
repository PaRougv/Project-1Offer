import express from "express";

import {
  createCost,
  getAllCost,
  getCostById,
  updateCost,
  deleteCost
} from "../controllers/cost.controller.js";

const router = express.Router();

router.post("/", createCost);
router.get("/", getAllCost);
router.get("/:id", getCostById);
router.put("/:id", updateCost);
router.delete("/:id", deleteCost);

export default router;