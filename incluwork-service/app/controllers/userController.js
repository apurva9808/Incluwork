import * as userService from "../services/userService.js";
 
 
export const getAllUsers = async (req, res) => {
    try {
        const users = await userService.fetchAllUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Error retrieving users", error: err });
    }
};

export const getAllJobs = async (req, res) => {
    try {
        const jobs = await userService.fetchAllJobs();
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: "Error retrieving users", error: err });
    }
};
 
// Get a user by userId
export const getUserById = async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await userService.getUserById(userId);
      res.json(user);
    } catch (error) {
      console.error('Error getting user by userId:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateUser = async (req, res) => {
    const { userId } = req.params;
    const data = req.body;

    try {
        const updatedUser = await userService.patchUserById(userId, data);
        res.json({
            message: 'User updated successfully',
            data: updatedUser
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error updating user',
            error: error.message
        });
    }
};
 
//Controller functions for job seeker profile
 
//To fetch a specific job seeker's profile
export const getJobSeekerProfile = async (req, res) => {

    const  id  = req.user.id;
    try {
         // Check if the user type is jobseeker
         if (req.user.type !== 'jobseeker') {
            return res.status(403).send('Access denied: User is not a jobseeker');
        }

        const jobSeeker = await userService.findJobSeekerById(id);
        if (!jobSeeker) {
            return res.status(404).json({ message: "Job seeker not found" });
        }
        res.json(jobSeeker);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};
 
//Updating a job seeker profile
export const updateJobSeekerProfile = async (req, res) => {
    console.log('inside controller ',req.body);
    const id = req.user.id; // Using user ID from JWT
    const updateData = req.body;
    
    
    // Check if the user type is jobseeker
    if (req.user.type !== 'jobseeker') {
        return res.status(403).send('Access denied: User is not a jobseeker');
    }
    
    // Check if the email field is present in request body
    if (req.body.email) {
        return res.status(400).send('Updating the email address is not allowed');
    }
    try {
        const updatedJobSeeker = await userService.updateJobSeekerProfile(id, updateData);
        if (!updatedJobSeeker) {
            return res.status(404).json({ message: "Job seeker not found" });
        }
        res.status(200).json(updatedJobSeeker);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
 
//Deleting a job seeker profile
export const deleteJobSeekerProfile = async (req, res) => {
    const id = req.user.id; // Using user ID from JWT
   
    try {
        // Check if the user type is jobseeker
         if (req.user.type !== 'jobseeker') {
               return res.status(403).send('Access denied: User is not a jobseeker');
         }
        // Delete job seeker, user account, and associated job applications
        const result = await userService.deleteJobSeeker(id);
        res.status(204).send(result);
        
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
 
//Controller functions for employer profile
 
export const getEmployerProfile = async (req, res) => {
    try {
        // Check if the user type is employer
        if (req.user.type !== 'employer') {
            return res.status(403).send({ error: "Access denied: User is not an employer"});
        }
 
        const employer = await userService.findEmployerById(req.user.id);
        if (!employer) {
            return res.status(404).send({ error: "Employer not found"});
        }
        res.json(employer);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
 
export const updateEmployerProfile = async (req, res) => {
    try {
        // Check if the user type is employer
        if (req.user.type !== 'employer') {
            return res.status(403).send({ error: "Access denied: User is not an employer"});
        }
 
        // Check if the email field is present in the request body
        if (req.body.email) {
            return res.status(400).send({ error: "Updating the email address is not allowed"});
        }
 
        const updatedEmployer = await userService.updateEmployerProfile(req.user.id, req.body);
        res.json(updatedEmployer);
    } catch (error) {
        res.status(400).send(error.message);
    }
};
 
export const deleteEmployerProfile = async (req, res) => {
    try {
        // Check if the user type is employer
        if (req.user.type !== 'employer') {
            return res.status(403).json({ error: "Access denied: User is not an employer"});
        }
 
        await userService.deleteEmployer(req.user.id);
        return res.status(204).send(); 
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
