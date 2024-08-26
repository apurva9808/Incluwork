import * as jobService from './../services/jobService.js';

// Create a new job
export const createJob = async (req, res) => {
    try {
        // Check if the user type is employer
        if (req.user.type !== 'employer') {
            return res.status(403).send({ error: "Access denied: User is not an employer"});
        }

        const employerId = req.user.id;

        const job = await jobService.createJob(employerId, req.body);
        res.status(201).json(job);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
 
// Get all jobs
export const getAllJobs = async (req, res) => {
    try {
        // Check if the user type is employer
        if (req.user.type !== 'employer') {
            return res.status(403).send({ error: "Access denied: User is not an employer"});
        }

        const employerId = req.user.id;
        const jobs = await jobService.getAllJobs(employerId);
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
 
// Get job by ID
export const getJobById = async (req, res) => {
    try {
        // Check if the user type is employer
        if (req.user.type !== 'employer') {
            return res.status(403).send({ error: "Access denied: User is not an employer"});
        }

        const employerId = req.user.id;
        const job = await jobService.getJobById(employerId, req.params.id);
        
        res.json(job);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

// Update job by ID
export const updateJob = async (req, res) => {
    try {
        // Check if the user type is employer
        if (req.user.type !== 'employer') {
            return res.status(403).send({ error: "Access denied: User is not an employer"});
        }

        const job = await jobService.updateJob(req.params.id, req.body);
        res.json(job);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

// Delete job by ID
export const deleteJob = async (req, res) => {
    try {
        // Check if the user type is employer
        if (req.user.type !== 'employer') {
            return res.status(403).send({ error: "Access denied: User is not an employer"});
        }
        
        await jobService.deleteJob(req.params.id);
        return res.status(204).send(); 
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

// Fetch all jobs as a job seeker
export const fetchAllJobs = async (req, res) => {
    try {
        // Check if the user type is jobseeker
        if (req.user.type !== 'jobseeker') {
            return res.status(403).send({ error: "Access denied: User is not an jobseeker"});
        }

        const jobseekerId = req.user.id;
        const jobs = await jobService.fetchJobsForJobSeeker(jobseekerId,req.query);
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Fectch job by ID as a job seeker
export const fetchJobById = async (req, res) => {
    try {
        // Check if the user type is jobseeker
        if (req.user.type !== 'jobseeker') {
            return res.status(403).send({ error: "Access denied: User is not a job seeker"});
        }

        const job = await jobService.fetchJobById(req.params.id);
        
        res.json(job);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}
