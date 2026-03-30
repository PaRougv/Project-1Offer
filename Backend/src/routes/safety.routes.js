import express from "express";
import {
  createSafety,
  getAllSafety,
  getSafetyById,
  updateSafety,
  deleteSafety,
} from "../controllers/safety.controller.js";

const router = express.Router();

router.post("/", createSafety);
router.get("/", getAllSafety);
router.get("/:id", getSafetyById);
router.put("/:id", updateSafety);
router.delete("/:id", deleteSafety);

export default router;