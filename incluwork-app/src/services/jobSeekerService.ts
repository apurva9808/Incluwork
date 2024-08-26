import { JobSeeker } from "../models/JobSeeker";

const BASE_URL = "http://localhost:3000/incluwork";

//Service code to get jobseeker data by id
export const getJobSeekerData = async (userId: string, token: string): Promise<JobSeeker | null> => {
    const url = `${BASE_URL}/jobseekers?id=${userId}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch jobseeker data');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching jobseeker data:', error);
        return null;
    }
};



// Service code to fetch all jobs 
export const fetchAllJobs = async (query='') => {
    const url = `${BASE_URL}/jobs?keywords=${query}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch jobs');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return [];
    }
};

//Service code to create a job application
export const applyToJob = async (jobId) => {
    const url = `${BASE_URL}/jobapplications`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,  // Assuming token-based authentication is required
            },
            body: JSON.stringify({ jobId })
        });

        if (!response.ok) {
            throw new Error('Failed to apply to job');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error applying to job:', error);
        return null;  // Re-throw to handle it in the component
    }
};

//Service code to get all applications for a job seeker
export const fetchJobApplications = async () => {
    const url = `${BASE_URL}/jobapplications`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`, // Ensure you are sending authorization token
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch applications');
        }

        return await response.json(); // returns the list of applications
    } catch (error) {
        console.error('Error fetching applications:', error);
        return [];
    }
};

export const deleteJobApplication = async (applicationId: string): Promise<boolean> => {
    const url = `${BASE_URL}/jobapplications/${applicationId}`;
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`// Ensure you are sending authorization token
            },
        });
        if (response.ok) {
            return true;
        } else {
            throw new Error('Failed to delete the application');
        }
    } catch (error) {
        console.error('Error when deleting application:', error);
        return false;
    }
};

// Function to fetch jobseeker details
export const fetchJobSeekerDetails = async () => {
    const url = `${BASE_URL}/jobseekers`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Assuming the token is stored in localStorage
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch jobseeker details');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching jobseeker details:', error);
        throw error;
    }
};

// Function to update jobseeker details
export const updateJobSeekerDetails = async (updateData) => {
    console.log("Updating with data:", updateData); 
    
    const url = `${BASE_URL}/jobseekers`;
    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(updateData)
        });
        if (!response.ok) {
            throw new Error('Failed to update jobseeker details');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating jobseeker details:', error);
        throw error;
    }
};

// Function to delete jobseeker
export const deleteJobSeeker = async () => {
    const url = `${BASE_URL}/jobseekers`;
   
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        
        if(response.status===204)
            {
                 console.log('Profile deleted successfully, nothing to return');
                 return;
            }
       //If response is not ok     
       throw new Error('Failed to delete jobseeker profile');
};

// To upload resume
export const uploadResume = async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${BASE_URL}/resume`, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        console.log('Resume uploaded successfully');
    } catch (error) {
        console.error('Failed to upload resume:', error);
        throw error;
    }
};

export default {
    getJobSeekerData
};