import { User } from "../models/User";

const API_BASE_URL = `http://localhost:3000/incluwork`;

// To get a user by userid
export const fetchUserById = async (userId: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch user');
    }
    return response.json();
};

// To update application status 
export const updateApplicationStatus = async (applicationId: string, status: string) => {
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) {
        throw new Error('Failed to update application status');
    }
    return response.json();
};