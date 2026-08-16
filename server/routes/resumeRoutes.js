import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";
import {
  uploadResume,
  analyzeResume,
  getResumeHistory,
  deleteResume,
} from "../controllers/resumeController.js";

const router = express.Router();

// Upload standalone PDF
router.post("/upload", authMiddleware, upload.single("resume"), uploadResume);

// Analyze Resume against JD (accepts multipart optional resume file or JSON body)
router.post("/analyze", authMiddleware, upload.single("resume"), analyzeResume);

// Fetch saved analysis history for logged in user
router.get("/history", authMiddleware, getResumeHistory);

// Delete analysis record
router.delete("/:id", authMiddleware, deleteResume);

export default router;