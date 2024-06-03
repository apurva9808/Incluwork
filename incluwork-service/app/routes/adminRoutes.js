import express from 'express';
import * as adminController from '../controllers/adminController.js';
import jwtAuth from '../lib/jwtAuth.js';
import * as userController from "../controllers/userController.js";
import * as jobController from '../controllers/jobController.js';
import {getAllUsersFilter} from "../controllers/adminController.js";


const router = express.Router();

router.get("/admin/getUsers", jwtAuth, adminController.getAllUsersFilter);

//Route to get all users
router.get("/admin/users", jwtAuth, userController.getAllUsers);
router.get("/admin/jobs", jwtAuth, userController.getAllJobs);

router.get('/admin/jobs', jwtAuth,adminController.getAllJobs);
router.get('/admin/applications', jwtAuth,adminController.getAllApplications);
router.patch('/admin/jobseeker/verify',jwtAuth,adminController.verifyJobseeker);




export default router;