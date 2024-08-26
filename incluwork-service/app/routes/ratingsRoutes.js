import express from "express";
import jwtAuth from "../lib/jwtAuth.js";
import {postJobRatings,getJobRatings} from "../controllers/ratingsController.js";

const router = express.Router();

router.post("/ratings", jwtAuth, postJobRatings);
router.get("/ratings", jwtAuth, getJobRatings);

export default router;