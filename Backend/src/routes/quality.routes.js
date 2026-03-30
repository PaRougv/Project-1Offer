import express from "express";
import {
  createQuality,
  getAllQuality,
  getQualityById,
  updateQuality,
  deleteQuality,
} from "../controllers/quality.controller.js";

const router = express.Router();

router.post("/", createQuality);
router.get("/", getAllQuality);
router.get("/:id", getQualityById);
router.put("/:id", updateQuality);
router.delete("/:id", deleteQuality);

export default router;