import React, { useState, useEffect } from 'react';
import { fetchJobApplications, fetchAllJobs } from './../../services/jobSeekerService'; 
import {updateApplicationStatus} from './../../services/userService';
import { fetchUserById } from '../../services/userService';
import { Card, CardContent, Typography, Grid, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Chip } from '@mui/material';
import Confetti from 'react-confetti';
import './../../css/JobCards.css';

interface JobOfferData {
    applicationId: string;
    jobTitle: string;
    location: string;
    jobType: string;
    salary: number;
    dateOfJoining: Date;
    accessibilityFeatures: string[];
    companyName: string;
    applicationDate: Date;
    disabled?: boolean;
    accepted?: boolean;
}

const JobOffers: React.FC = () => {
    const [jobOffers, setJobOffers] = useState<JobOfferData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
    // const [openSnackbar, setOpenSnackbar] = useState(false);
    const [confettiRunning, setConfettiRunning] = useState(false);


    useEffect(() => {
        const loadData = async () => {
            try {
                const jobs = await fetchAllJobs();
                const apps = await fetchJobApplications();

                const filteredOffers = apps.filter(app => app.status === 'offered').map(app => {
                    const job = jobs.find(j => j.jobId === app.jobId);
                    const employer = job ? fetchUserById(app.employerId) : Promise.resolve({ name: "No Company" });
                    return employer.then(employerData => ({
                        ...app,
                        companyName: employerData.name,
                        jobTitle: job ? job.title : 'No Job Title',
                        location: job ? job.location : 'No Location',
                        jobType: job ? job.jobType : '',
                        salary: job ? job.salary : 0,
                        dateOfJoining: job ? job.dateOfJoining : new Date(),
                        accessibilityFeatures: job ? job.accessibilityFeatures : [],
                    }));
                });

                Promise.all(filteredOffers).then(offers => {
                    setJobOffers(offers);
                    setLoading(false);
                });

            } catch (error) {
                console.error('Failed to fetch data:', error);
                setError('Failed to fetch job offers');
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleAcceptOffer = (applicationId: string) => {
        setSelectedOffer(applicationId);
        setOpenDialog(true);
    };
    
    const confirmAcceptOffer = async () => {
        await updateApplicationStatus(selectedOffer, 'accepted'); 
        setJobOffers(offers => offers.map(offer =>
            offer.applicationId === selectedOffer ? { ...offer, accepted: true } : { ...offer, disabled: true }
        ));
        setOpenDialog(false);
        setConfettiRunning(true);
        setTimeout(() => {
            setConfettiRunning(false);
            setOpenSuccessDialog(true);
        }, 2500);// run confetti animation for 2.5 seconds
      
    };

  

    const handleCloseSuccessDialog = () => {
        setOpenSuccessDialog(false);
    };

    if (loading) return <div>Loading job offers...</div>;
    if (error) return <div>{error}</div>;

    return (
         
        <div style={{ padding: '20px 10%' }}>
        {/* // <div style={{ padding: '20px 10%' , height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}> */}
            
            {confettiRunning && <Confetti />}

            <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', marginBottom: 3 }}>
                  Job Offers
            </Typography>
            <Grid container spacing={4} justifyContent="center">
                {jobOffers.length > 0 ? (
                    jobOffers.map((offer) => (
                        <Grid item key={offer.applicationId} xs={12}>
                            <Card raised style={{ maxWidth: 800, margin: 'auto', opacity: offer.disabled ? 0.5 : 1 }}>
                                <CardContent style={{ padding: '20px' , position : 'relative'}}>
                                    <Typography variant="h5" component="h2">{offer.jobTitle}</Typography>
                                    <Typography color="textSecondary" gutterBottom>Company: {offer.companyName}</Typography>
                                    <Typography variant="body2" color="textSecondary">Location: {offer.location}</Typography>
                                    <Typography variant="body2">Salary: ${offer.salary}</Typography>
                                    <Typography variant="body2">Date of Joining: {new Date(offer.dateOfJoining).toLocaleDateString()}</Typography>
                                    <Typography variant="body2">Accessibility: {offer.accessibilityFeatures.join(", ")}</Typography>
                                    <Typography component="div" variant="body2">
                                        Application Date: {new Date(offer.applicationDate).toLocaleDateString()}
                                    </Typography>
                                    {offer.accepted && (
                                    <Chip label="Accepted" color="success" style={{ position: 'absolute', top: 20, right: 20 }} />
                                )}
                                 {!offer.accepted && (
                                <Button variant="contained" style={{ backgroundColor: offer.accepted ? 'grey' : 'green', position: 'absolute', bottom: 20, right: 20 }} onClick={() => handleAcceptOffer(offer.applicationId)} disabled={offer.disabled}>
                                    Accept
                                </Button>
                                 )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12} style={{ maxWidth: 800, margin: 'auto' }}>
                        <Card raised style={{ textAlign: 'center', width: '100%' }}>
                            <CardContent>
                                <Typography variant="h5" component="h2">Stay tuned! Your next opportunity is just around the corner.</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} >
                <DialogTitle>Confirm Acceptance</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to accept this job offer? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}  color="primary">Cancel</Button>
                    <Button onClick={confirmAcceptOffer} color="secondary">Confirm</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openSuccessDialog} onClose={handleCloseSuccessDialog} PaperProps={{
        className: "success-dialog" // Using the class for overall dialog styling
    }}>
                <DialogTitle className="dialog-title">Congratulations!</DialogTitle>
                <DialogContent className="dialog-content">
                    <DialogContentText>
                        You have accepted the job offer successfully!
                    </DialogContentText>
                </DialogContent>
                <DialogActions className="dialog-actions">
                    <Button onClick={handleCloseSuccessDialog} color="primary" variant="contained">OK</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default JobOffers;
