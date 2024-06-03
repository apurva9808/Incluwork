import { Employer } from "../models/Employer.ts";
import {Job} from "../components/HomePages/Employer.tsx";


const API_BASE_URL = `http://localhost:3000/incluwork`;

export const getEmployerData = async (_userId: string, token: string): Promise<Employer | null> => {
    const url = "http://localhost:3000/incluwork/employers";

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Use the token in the Authorization header
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch Employer data');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching Employer data:', error);
        return null;
    }
};

export const fetchApplications = async (keywords = '') => {
    const url = `${API_BASE_URL}/applications?keywords=${encodeURIComponent(keywords)}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch applications');
    }
    
    return response.json();
};



// Fetch all jobs
export const fetchAllJobs = async () => {
    const response = await fetch(`${API_BASE_URL}/joblistings`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch job listings');
    }

    return response.json();
};

export const downloadFile = async (fileUrl: string, fileName: string): Promise<void> => {
   
    const response = await fetch(`${API_BASE_URL}${fileUrl}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to download file');
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', fileName); // Set the file name for download
    document.body.appendChild(link);
    link.click();
    link.parentNode!.removeChild(link); // Clean up
    window.URL.revokeObjectURL(downloadUrl); // Free up memory
};

export const downloadResume = (resumeURL: string): Promise<void> => {
    return downloadFile(`${resumeURL}`, 'Resume.pdf');
};

export const downloadMedicalProof = (medicalProofURL: string): Promise<void> => {
    return downloadFile(`${medicalProofURL}`, 'MedicalProof.pdf');
}

export async function fetchAccommodationFacilities(): Promise<any[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/mappings`);
        if (!response.ok) {
            throw new Error('Failed to fetch accommodation facilities');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching accommodation facilities:', error);
        return [];
    }
};

// Function to create a job listing
export const createJobListing = async (formData: any): Promise<void> => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_BASE_URL}/joblistings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });
        if (!response.ok) throw new Error('Failed to create job');

        await response.json();  // Assuming we might need the response data for something
    } catch (error) {
        console.error('Error creating job:', error);
        throw error;  // Re-throw the error to handle it further up the call stack
    }
};

export const deleteJobListing = async (jobId: string): Promise<void> => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_BASE_URL}/joblistings/${jobId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete job');
        }

        await response.json();
    } catch (error) {
        console.error('Error deleting job:', error);
        throw error; // Re-throw the error to handle it further up the call stack
    }
};

export const fetchjobs = async (): Promise<Job[]> => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("Authentication token is missing");
    }

    const response = await fetch(`${API_BASE_URL}/joblistings`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch jobs');
    }

    return await response.json() as Promise<Job[]>;
};

export const updateJob = async (currentJob: Job | null) => {
    if (!currentJob) return;
    const token = localStorage.getItem('token');
    const url = `${API_BASE_URL}/joblistings/${currentJob.jobId}`;

    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(currentJob)
        });

        if (!response.ok) {
            throw new Error('Failed to update job');
        }

        const updatedJob = await response.json() as Job;
        return updatedJob;
    } catch (error) {
        console.error('Error updating job:', error);
    }
};

export const updateJobListing = async (jobId: string, decrement: number): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/joblistings/${jobId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            maxPositions: decrement
        })
    });

    

    if (!response.ok) {
        throw new Error('Failed to update job listing');
    }

    return response.json();
};

export const getEmployerProfile = async (): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/employers`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    console.log("Response after GET", response);

    if (!response.ok) {
        throw new Error('Failed to fetch employer profile');
    }

    return response.json();
};

export const updateEmployerProfile = async (profileData: any): Promise<any> => {
    console.log(profileData);
    const response = await fetch(`${API_BASE_URL}/employers`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
    });

    if (!response.ok) {
        throw new Error('Failed to update employer profile');
    }

    return response.json();
};

export const deleteEmployerProfile = async (): Promise<any> => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        throw new Error('No token found');
    }

    const response = await fetch(`${API_BASE_URL}/employers`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    // Check if the response is OK and specifically handle the 204 No Content response
    if (response.status === 204) {
        console.log('Profile deleted successfully, no content to return.');
        return; // Early return to skip any further processing
    }

    // If response is not OK, and it is not a 204 (handled above), throw an error
    throw new Error('Failed to delete employer profile');
};