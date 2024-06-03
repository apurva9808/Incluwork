export interface JobData {
    jobId: string; // Change the type to string if you're expecting ObjectId in string format from the backend
    title: string;
    employerId: string; // This will also be in string format since it's an ObjectId
    location: string;
    jobType: 'part-time' | 'full-time'; // Enum for job type
    accessibilityFeatures: string[]; // Array of strings for accessibility features
    requiredSkills: string[]; // Array of strings for required skills
    maxPositions: number;
    dateOfPosting: Date; // Date object
    acceptedCandidates: number;
    salary: number;
    dateOfJoining: Date; // Date object
}