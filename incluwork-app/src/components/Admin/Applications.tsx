import React, {useState, useEffect} from 'react';
import {Button, Paper, Typography} from '@mui/material';
import {ApplicationData} from '../../models/Application';
import {fetchData} from "../../services/adminService.ts";
import {User} from "../../models/User.ts";
import {fetchUserById} from "../../services/userService.ts";
import {getAllJobs} from "../../services/adminService.ts";
import {downloadMedicalProof, downloadResume} from "../../services/employerService.ts";
import { FaDownload} from "react-icons/fa"; // Import the ApplicationData interface

export interface Job {
    _id: string; // Change the type to string if you're expecting ObjectId in string format from the backend
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
// Define the ApplicationItem component to display individual application details
interface ApplicationWithDetails extends ApplicationData {
    userName: string;
    jobTitle: string;
    resumeURL: string;
    medicalProofURL: string;
}
// Define the main Applications component
const Applications: React.FC = () => {
    const [applications, setApplications] = useState<ApplicationWithDetails[]>([]);

    // Fetch application data from the endpoint and set the state
    useEffect(() => {
        const loadData = async () => {
        try {
            const jobs:Job[]=await  getAllJobs();

            const applicationData: ApplicationData[] = await  fetchData();
            const applicationsWithDetails =await  Promise.all(applicationData.map(async app => {
                const user: User = await fetchUserById(app.userId);

                const job = jobs.find(j => j._id === app.jobId);



                return {
                    ...app,
                    userName: user.name,
                    jobTitle: job ? job.title : "No Job Title",
                    resumeURL: user.resume,
                    medicalProofURL: user.medicalProof
                };
            }));
            setApplications(applicationsWithDetails);
        }
    catch (error) {
            console.log(error);
        throw new Error('Failed to fetch Employer data');
    }}
    loadData();
    }, []);



    return (
        <div>
            <Typography variant="h4" style={{marginBottom: '20px', marginTop:'20px', textAlign: 'center'}}>
                Job Applications
            </Typography>
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px' }}>
            {applications.map((app) => (
                <div key={app.applicationId} style={{
                    border: '1px solid #ccc',
                    padding: '20px',
                    width: 'calc(50% - 10px)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ flexGrow: 1 }}>
                        <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '25px' }}>Applicant: {app.userName}</span>
                            <div style={{
                                padding: '6px 12px',
                                backgroundColor: app.status === 'offered' ? 'green' : app.status === 'rejected' ? 'red' : 'none',

                                color: 'white',
                                borderRadius: '5px',
                                display: app.status === 'pending' ? 'none' : 'inline-block',
                                fontSize: '14px'  // Keeping the font size standard for status indicators
                            }}>
                                {app.status.toUpperCase()}
                            </div>
                        </h3>
                        <p>Job Title: {app.jobTitle}</p>
                        <p>Application Date: {new Date(app.applicationDate).toLocaleDateString()}</p>
                        <div style={{ marginTop: '20px' }}>
                            <Button onClick={() => downloadResume(emp.resume)}
                                    startIcon={<FaDownload />}
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    style={{ marginRight: '10px' }}>
                                Download Resume
                            </Button>
                            <Button onClick={() => downloadMedicalProof(emp.medicalProof)}
                                    startIcon={<FaDownload />}
                                    variant="contained"
                                    color="primary"
                                    size="small">
                                Download Medical Proof
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        </div>
    );
};

export default Applications;
