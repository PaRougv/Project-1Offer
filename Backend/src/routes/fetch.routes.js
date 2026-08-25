import express from "express";
import { getDashboardData } from "../controllers/fetch.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/dashboard", requireAuth, getDashboardData);

export default router;