import express from "express";
import multer from "multer";
import { 
  createPatient, 
  getPatients, 
  updateStatus, 
  uploadZip, 
  uploadPdf 
} from "../controllers/patient.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Multer in-memory storage configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024 * 1024 } // 1GB Limit
});

// All patient routes are protected
router.use(verifyToken);

// Shared / EndUser
router.post("/", createPatient);
router.get("/", getPatients);
router.post("/upload-zip", upload.single("file"), uploadZip);

// Admin Only
router.patch("/:id/status", isAdmin, updateStatus);
router.post("/:patientId/upload-pdf", isAdmin, upload.single("file"), uploadPdf);

export default router;
