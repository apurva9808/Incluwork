import { ApplicationData } from '../../models/Application';
import { JobData } from "../../models/Job";
import { User } from "../../models/User";
import React, { useState, useEffect } from 'react';
import { fetchJobApplications , 
         fetchAllJobs,
         deleteJobApplication } from './../../services/jobSeekerService'; // Adjust the import path as necessary
import { fetchUserById } from '../../services/userService';
import { Card, CardContent, Typography, Grid, Box,Button, Dialog,DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import './../../css/JobCards.css'

interface CurrentApplicationData extends ApplicationData{

  
    jobTitle: string;
    location: string;
    jobType: string;
    salary: number;
    dateOfJoining: Date;
    accessibilityFeatures: string[];
    companyName: string;
}


// React Component

const ApplicationsView: React.FC = () => {
    const [applications, setApplications] = useState<CurrentApplicationData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const jobs: JobData[] = await fetchAllJobs();
                const apps: ApplicationData[] = await fetchJobApplications();

                const applicationDetails = await Promise.all(apps.map(async app => {
                    const job = jobs.find(j => j.jobId === app.jobId);
                    const employer: User = await fetchUserById(app.employerId);
                    
                    return {
                        ...app,
                        companyName: employer.name,
                        jobTitle: job ? job.title : 'No Job Title',
                        location: job ? job.location : 'No Location',
                        jobType: job ? job.jobType : '',
                        salary: job ? job.salary : 0,
                        dateOfJoining: job ? job.dateOfJoining : new Date(),
                        accessibilityFeatures: job ? job.accessibilityFeatures : [],
                        
                    };
                }));
                setApplications(applicationDetails);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch data:', error);
                setError('Failed to fetch applications');
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Delete button click
    const handleDeleteClick = (applicationId: string) => {

        setSelectedApplicationId(applicationId);
        setOpenDialog(true);
    };


 
    // To hit the delete endpoint on confirmation
    const handleDeleteConfirm = async () => {
        if (selectedApplicationId && await deleteJobApplication(selectedApplicationId)) {
            setApplications(prev => prev.filter(app => app.applicationId !== selectedApplicationId));
            setOpenDialog(false);
        }
    };

    //Cancel
    const handleCancel = () => {
        setOpenDialog(false);
    };
    if (loading) return <div>Loading applications...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div style={{ padding: '20px 10%' }}>  
        {/* // Adjusted padding for centering */}
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', marginBottom: 3 }}>
                Applications
         </Typography>  
            <Grid container spacing={4} justifyContent="center">
                {applications.map(app => (
                    <Grid item key={app.applicationId} xs={12}>
                        <Card raised style={{ maxWidth: 800, margin: 'auto' }}>
                            <CardContent style={{ padding: '20px' }}>
                                <Typography variant="h5" component="h2">{app.jobTitle}</Typography>
                                <Typography color="textSecondary" gutterBottom>Company: {app.companyName}</Typography>
                                <Typography variant="body2" color="textSecondary">Location: {app.location}</Typography>
                                <Typography variant="body2">Salary: ${app.salary}</Typography>
                                <Typography variant="body2">Date of Joining: {new Date(app.dateOfJoining).toLocaleDateString()}</Typography>
                                <Typography variant="body2">Accessibility Features: {app.accessibilityFeatures.join(", ")}</Typography>
                                <Typography component="div" variant="body2" color="textSecondary">
                                    Application Status: {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                </Typography>
                                <Typography component="div" variant="body2">
                                    Application Date: {new Date(app.applicationDate).toLocaleDateString()}
                                </Typography>
                            </CardContent>
                            <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteClick(app.applicationId)}>
                                    Delete
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Dialog open={openDialog} onClose={handleCancel}>
                <DialogTitle>{"Are you sure?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This action will permanently delete the application. Are you sure you want to proceed?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel} color="primary">Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="secondary">Yes</Button>
                </DialogActions>
            </Dialog>
        </div>
        
    );
};


export default ApplicationsView;