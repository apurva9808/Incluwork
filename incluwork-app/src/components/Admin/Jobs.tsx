import React, {useEffect, useState} from 'react';
import {Container, Grid, Paper, Typography, useTheme} from '@mui/material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter'; // For job type
import LocationOnIcon from '@mui/icons-material/LocationOn'; // For location
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'; // For salary
import EventIcon from '@mui/icons-material/Event'; // For dates
import PeopleIcon from '@mui/icons-material/People'; // For max positions
import { JobData } from '../../models/Job';
import {getAllJobs} from "../../services/adminService.ts";




const JobItem: React.FC<{ job: JobData }> = ({ job }) => {

    const theme = useTheme();

    return (
        <Paper style={{ padding: theme.spacing(3), marginBottom: theme.spacing(2) }}>
            <Typography variant="h5" gutterBottom>
                <BusinessCenterIcon fontSize="small" style={{ verticalAlign: 'middle', marginRight: theme.spacing(1) }} />
                {job.title}
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Typography>
                        <LocationOnIcon fontSize="small" style={{ verticalAlign: 'middle', marginRight: theme.spacing(1) }} />
                        Location: {job.location}
                    </Typography>
                    <Typography>
                        <AttachMoneyIcon fontSize="small" style={{ verticalAlign: 'middle', marginRight: theme.spacing(1) }} />
                        Salary: ${job.salary.toLocaleString()}
                    </Typography>
                    <Typography>
                        Accessibility Features: {job.accessibilityFeatures.join(', ')}
                    </Typography>
                    <Typography>
                        Required Skills: {job.requiredSkills.join(', ')}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography>
                        <EventIcon fontSize="small" style={{ verticalAlign: 'middle', marginRight: theme.spacing(1) }} />
                        Date of Posting: {new Date(job.dateOfPosting).toLocaleDateString()}
                    </Typography>
                    <Typography>
                        <EventIcon fontSize="small" style={{ verticalAlign: 'middle', marginRight: theme.spacing(1) }} />
                        Date of Joining: {new Date(job.dateOfJoining).toLocaleDateString()}
                    </Typography>
                    <Typography>
                        <PeopleIcon fontSize="small" style={{ verticalAlign: 'middle', marginRight: theme.spacing(1) }} />
                        Max Positions: {job.maxPositions}
                    </Typography>
                    <Typography>
                        Accepted Candidates: {job.acceptedCandidates}
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    );
};

const Jobs: React.FC = () => {
    const [jobs, setJobs] = useState<JobData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const jobs:JobData[]=await  getAllJobs();
            setJobs(jobs);
        }



        fetchData();
    }, []);

    return (
        <Container maxWidth="md">
            <Typography variant="h4" style={{ margin: '20px 0', textAlign: 'center' }}>
                Job Listings
            </Typography>
            <Grid container spacing={2} justifyContent="center">
                {jobs.length > 0 ? jobs.map((job) => (
                    <Grid item xs={12} md={10} key={job.jobId}>
                        <JobItem job={job} />
                    </Grid>
                )) : (
                    <Typography variant="h6" style={{ textAlign: 'center', width: '100%' }}>
                        No jobs found
                    </Typography>
                )}
            </Grid>
        </Container>
    );
};

export default Jobs;
