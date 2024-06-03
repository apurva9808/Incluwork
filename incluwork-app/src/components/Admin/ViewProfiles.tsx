import React, { useState, useEffect } from 'react';
import {Card, CardContent, Typography, Button, Grid, Container, IconButton, Box} from '@mui/material';
import {downloadMedicalProof} from "../../services/employerService.ts";
import {FaDownload} from "react-icons/fa";
import {fetchJobSeekersByType, updateJobSeekerProfileStatus} from "../../services/adminService.ts";

// Define the TypeScript interfaces for the types of data we expect to handle
interface EducationDetail {
    institutionName: string;
    courseName: string;
    startYear: number;
    endYear: number;
    _id: string;
}

interface JobSeeker {
    userId: string;
    name: string;
    email: string;
    type: string;
    contactNumber: string;
    id: string;
    education: EducationDetail[];
    skills: string[];
    resume: string;
    medicalProof: string;
    challenges: string[];
    status: string;
}

// Component to display individual job seeker details in a card
const JobSeekerCard: React.FC<{ jobseeker: JobSeeker, onUpdate: () => void }> = ({ jobseeker, onUpdate }) => {
    const handleStatusChange = async (status: string) => {
        await updateJobSeekerProfileStatus(jobseeker.userId,status);
        onUpdate();
    };

    return (
        <Card sx={{ display: 'flex', justifyContent: 'space-between', margin: 2, width: '90%', boxShadow: 3 }}>
            <CardContent sx={{ flexGrow: 1,width: '70%' }}>
                <Typography variant="h5" component="div" gutterBottom>
                    <Box component="span" sx={{ fontWeight: 'bold',marginBottom:'10px' }}>Name:</Box> {jobseeker.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                    <Box component="span" sx={{ fontWeight: 'bold',marginBottom:'10px' }}>Email:</Box> {jobseeker.email}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                    <Box component="span" sx={{ fontWeight: 'bold',marginBottom:'10px' }}>Contact:</Box> {jobseeker.contactNumber}
                </Typography>
                <Typography paragraph>
                    <Box component="span" sx={{ fontWeight: 'bold',marginBottom:'10px' }}>Skills:</Box> {jobseeker.skills.join(', ')}
                </Typography>
                <Typography paragraph>
                    <Box component="span" sx={{ fontWeight: 'bold',marginBottom:'10px' }}>Challenges:</Box> {jobseeker.challenges.join(', ')}
                </Typography>
                <IconButton onClick={() => downloadMedicalProof(jobseeker.medicalProof)} color="primary" aria-label="download medical proof">
                    <FaDownload />
                </IconButton>
            </CardContent>
            <Grid container direction="column" style={{ padding: 16 }} alignItems="flex-end">
                <Button color="primary" onClick={() => handleStatusChange('verified')} style={{ marginBottom: 8 }}>Accept</Button>
                <Button color="secondary" onClick={() => handleStatusChange('incomplete')}>Deny</Button>
            </Grid>
        </Card>
    );
};
// Component to manage the list of job seekers
const JobSeekersList: React.FC = () => {
    const [jobseekers, setJobseekers] = useState<JobSeeker[]>([]);
    const [refresh, setRefresh] = useState(false); // Used to trigger re-fetching

    useEffect(() => {
        const fetchData = async () => {
            try {
                const jobseekers = await fetchJobSeekersByType('jobseeker');
                setJobseekers(jobseekers);
            } catch (error) {
                console.error('Failed to load jobseekers:', error);
            }
        };

        fetchData();
    }, [refresh]);  // Dependency on refresh to re-trigger the effect

    const handleUpdate = () => {
        setRefresh(!refresh); // Toggle the refresh state to re-fetch data
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" style={{marginBottom: '20px', marginTop:'20px', textAlign: 'center'}}>
                Verify Job Seekers Medical Proof
            </Typography>

            <Grid container spacing={2}>
            {jobseekers.map(jobseeker => (
                    <Grid item xs={12} key={jobseeker.id}>
                        <JobSeekerCard jobseeker={jobseeker} onUpdate={handleUpdate} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};
export default JobSeekersList;
