import express from "express";
import * as userController from "../controllers/userController.js";
import jwtAuth from "../lib/jwtAuth.js";

const router = express.Router();

//Route to get all users
router.get("/users", jwtAuth, userController.getAllUsers);
// Route to get a user by userId
router.get('/users/:userId', jwtAuth, userController.getUserById);

// Routes for job seeker profile
// Get the job seeker profile of the logged in user
router.get('/jobseekers',jwtAuth, userController.getJobSeekerProfile);

// Update the job seeker profile of the logged in user
router.patch('/jobseekers',jwtAuth, userController.updateJobSeekerProfile);

router.patch('/users/:userId', jwtAuth, userController.updateUser);

// Delete the job seeker profile of the logged in user
router.delete('/jobseekers',jwtAuth, userController.deleteJobSeekerProfile);

// Routes for employer profile
// Get the employer profile of the authenticated user
router.get('/employers', jwtAuth, userController.getEmployerProfile);
 
// Update the employer profile of the authenticated user
router.patch('/employers', jwtAuth, userController.updateEmployerProfile);
 
// Delete the employer profile of the authenticated user
router.delete('/employers', jwtAuth, userController.deleteEmployerProfile);

export default router;