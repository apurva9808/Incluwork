import express from "express";
import multer from "multer";
const upload = multer();
import * as uploadController from "../controllers/uploadController.js"
import jwtAuth from "../lib/jwtAuth.js";


const router = express.Router();

router.post("/resume",jwtAuth, upload.single("file"), uploadController.uploadResume);
router.post("/medicalproof",jwtAuth, upload.single("file"), uploadController.uploadProof);

export default router;