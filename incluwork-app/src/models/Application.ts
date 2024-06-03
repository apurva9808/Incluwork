export interface ApplicationData {
    jobId: string; // The job ID in string format (ObjectId in backend)
    userId: string; // The user ID (job seeker ID) in string format
    employerId: string; // The employer ID in string format
    applicationDate: Date; // The application date as a Date object
    status: 'pending' | 'applied' | 'offered' | 'accepted' | 'rejected' | 'withdrawn'; // Enum for application status
}