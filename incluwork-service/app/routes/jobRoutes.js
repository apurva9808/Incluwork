import express from "express";
import jwtAuth from "../lib/jwtAuth.js";
import * as jobController from "../controllers/jobController.js";

const router = express.Router();

router.post("/joblistings", jwtAuth, jobController.createJob);
router.get("/joblistings", jwtAuth, jobController.getAllJobs);
router.get("/joblistings/:id", jwtAuth, jobController.getJobById);
router.patch("/joblistings/:id", jwtAuth, jobController.updateJob);
router.get("/jobs", jwtAuth, jobController.fetchAllJobs);
router.get("/jobs/:id", jwtAuth, jobController.fetchJobById);
router.delete("/joblistings/:id", jwtAuth, jobController.deleteJob);


export default router;