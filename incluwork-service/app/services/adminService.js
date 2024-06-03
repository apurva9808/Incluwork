import User from "../models/User.js";
import JobSeeker from "../models/JobSeeker.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import Employer from "../models/Employer.js";


export const getAllUsers = async (type) => {
    try {
        const query = type ? { type: type } : {};
        const users = await User.find(query);
        if (!users.length) {
            throw new Error('No users found');
        }

        const usersWithData = await Promise.all(users.map(async (user) => {
            const userData = {
                userId: user._id,
                name: user.name,
                email: user.email,
                type: user.type,
                contactNumber: user.contactNumber,
            };

            let additionalData = {};
            switch (userData.type) {
                case 'jobseeker':
                    additionalData = await JobSeeker.findOne({ userId: userData.userId });
                    additionalData = additionalData ? {
                        id: additionalData._id,
                        education: additionalData.education,
                        skills: additionalData.skills,
                        resume: additionalData.resume,
                        medicalProof: additionalData.medicalProof,
                        challenges: additionalData.challenges,
                        status:additionalData.status
                    } : {};
                    break;
                case 'employer':
                    additionalData = await Employer.findOne({ userId: userData.userId });
                    additionalData = additionalData ? {
                        companyName: additionalData.companyName,
                        companyProfile: additionalData.companyProfile,
                        inclusivityRating: additionalData.inclusivityRating,
                        accommodationFacilities: additionalData.accommodationFacilities,
                    } : {};
                    break;
                default:
                    
                    additionalData = {}; // Skip processing for invalid types
            }

            return { ...userData, ...additionalData };
        }));

        return usersWithData;
    } catch (error) {
        console.error('Error getting all users:', error);
        throw new Error(`Error getting all users: ${error.message}`);
    }
};



export const fetchAllUsers = async () => {
    try {
        // You might want to filter out sensitive fields
        const users = await User.find({}, '-password -__v'); // Excludes password and __v from results
        return users;
    } catch (err) {
        console.error("Failed to retrieve users:", err);
        throw err;
    }
};

//get all jobs for admin
export const getAllJobs = async () => {
    try {
        // Retrieve all jobs from the database
        const jobs = await Job.find();

        // Map over the retrieved jobs and transform each job object
        const transformedJobs = jobs.map(job => {
            // Destructure the job object to extract relevant properties
            const { _id, ...rest } = job.toObject();

            // Return a new object with "jobId" instead of "_id"
            return { jobId: _id, ...rest };
        });
        
        // Return the transformed jobs
        return transformedJobs;
    } catch (error) {
        // If an error occurs, throw an error message
        throw new Error(`Failed to retrieve jobs: ${error.message}`);
    }
};

//get all application dor admin
export const getAllApplications = async () => {
    try {
        const applications = await Application.find();
        return applications;
    } catch (error) {
        throw new Error(`Failed to retrieve applications: ${error.message}`);
    }
};



export const verifyJobseeker = async (userId,status) => {
    try {
        
         const js=await  JobSeeker.findOne(userId);
        const updatedJobSeeker = await JobSeeker.findOneAndUpdate(
            { userId },
            {
                status: status // Update status to pending after the upload
            },
        );
        return js ;
    } catch (error) {
        console.log(error);
        throw new Error(`Failed to set the status: ${error.message}`);
    }
};
