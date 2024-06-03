import * as jobApplicationService from '../services/jobApplicationService.js';

export const createjobApplication = async (req, res) => {
    try {

        // Check if the user type is jobseeker
        if (req.user.type !== 'jobseeker') {
            return res.status(403).send({ error: "Access denied: User is not a jobseeker"});
        }
        const jobseekerid = req.user.id;
        const applicationData = req.body;
        const application = await jobApplicationService.createjobApplication(jobseekerid,applicationData);
        res.status(201).json(application);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//Fetching all job applications for specific job seeker
export const getJobApplications = async (req, res) => {
    try {
        const jobseekerId = req.user.id; 
        const jobApplications = await jobApplicationService.getJobApplicationsByUserId(jobseekerId);
        res.status(200).json( jobApplications );
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Fetch all applications for job listings of specific employer
export const getJoblistingApplications = async (req, res) => {
    try {
        // Check if the user type is employer
        if (req.user.type !== 'employer') {
            return res.status(403).send({ error: "Access denied: User is not an employer"});
        }

        const employerId = req.user.id;
        const keywords = req.query.keywords; // Fetch keywords from query parameters
        
        // Call the service function to fetch applications
        const applications = await jobApplicationService.getJoblistingApplications(employerId, keywords);
        res.json(applications);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

export const updateApplicationStatus = async (req, res) => {
    try {
        // Check if the user type is employer or job seeker
        if (req.user.type !== 'employer' && req.user.type !== 'jobseeker') {
            return res.status(403).send({ error: "Access denied: Not a valid user"});
        }
        
        const applicationId = req.params.applicationId;
        const { status } = req.body;
        const updatedApplication = await jobApplicationService.updateApplicationStatus(applicationId, status);
        res.json(updatedApplication);
    } catch (error) {
        console.error('Error updating application status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
// Delete job by ID
export const deleteJobApplication = async (req, res) => {
    try {
        // Check if the user type is jobseeker
        if (req.user.type !== 'jobseeker') {
            return res.status(403).send({ error: "Access denied: User is not a job seeker"});
        }
        
        await jobApplicationService.deleteJobApplication(req.params.id);
        return res.status(204).send(); 
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}
