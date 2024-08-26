import express from "express";
import * as downloadController from "../controllers/downloadController.js"
import jwtAuth from "../lib/jwtAuth.js";

const router = express.Router();

router.get("/resume/:file",jwtAuth, downloadController.downloadResume);
router.get("/medicalproof/:file",jwtAuth, downloadController.downloadProof);

export default router;