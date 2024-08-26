import React, { useEffect, useState } from "react";
import {
  fetchApplications,
  fetchAllJobs,
  downloadResume,
  downloadMedicalProof,
  updateJobListing
} from '../../services/employerService.ts';
import { fetchUserById, updateApplicationStatus } from '../../services/userService.ts';
import { ApplicationData } from "../../models/Application";
import { JobData } from "../../models/Job";
import { User } from "../../models/User";
import { FaDownload, FaCheck, FaTimes } from "react-icons/fa";
import { Button, TextField, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import InputAdornment from '@mui/material/InputAdornment';

interface ApplicationWithDetails extends ApplicationData {
    userName: string;
    jobTitle: string;
    resumeURL: string;
    medicalProofURL: string;
}

const JobApplications: React.FC = () => {
    const [applications, setApplications] = useState<ApplicationWithDetails[]>([]);
    const [jobs, setJobs] = useState<JobData[]>([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        loadData(searchKeyword);
    }, [searchKeyword]);

    const loadData = async (keywords: string) => {
        try {
            const fetchedJobs: JobData[] = await fetchAllJobs();
            setJobs(fetchedJobs);
            const applicationData: ApplicationData[] = await fetchApplications(keywords);
            const applicationsWithDetails = await Promise.all(applicationData.map(async app => {
                const user: User = await fetchUserById(app.userId);
                const job = fetchedJobs.find(j => j.jobId === app.jobId);
                return {
                    ...app,
                    userName: user.name,
                    jobTitle: job ? job.title : "No Job Title",
                    resumeURL: user.resume,
                    medicalProofURL: user.medicalProof
                };
            }));
            setApplications(applicationsWithDetails);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    const handleStatusUpdate = async (applicationId: string, newStatus: 'offered' | 'rejected' | 'accepted', jobId?: string) => {
        try {
            const response = await updateApplicationStatus(applicationId, newStatus);
            if (response && jobId) {
                const jobIndex = jobs.findIndex(j => j.jobId === jobId);
                if (jobIndex !== -1 && newStatus === 'offered' && jobs[jobIndex].maxPositions > 0) {
                    const updatedJob = await updateJobListing(jobId, jobs[jobIndex].maxPositions - 1);
                    const newJobs = [...jobs];
                    newJobs[jobIndex] = { ...newJobs[jobIndex], maxPositions: updatedJob.maxPositions };
                    setJobs(newJobs);
                    
                    if (updatedJob.maxPositions === 0) {
                        setModalMessage('All positions for this job are now filled.');
                        setModalOpen(true);
                    }
                }
                // Update the application locally to reflect the change
                const newApplications = applications.map(app => app.applicationId === applicationId ? { ...app, status: newStatus } : app);
                setApplications(newApplications);
            }
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchKeyword(event.target.value);
    };

    const clearSearch = () => {
        setSearchKeyword('');
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    return (
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <TextField
                variant="outlined"
                placeholder="Search…"
                value={searchKeyword}
                onChange={handleSearchChange}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <IconButton onClick={clearSearch}>
                            <CloseIcon />
                        </IconButton>
                    )
                }}
                style={{ marginBottom: '20px', width: '300px' }}
            />
            <Dialog open={modalOpen} onClose={handleCloseModal}>
                <DialogTitle>{"Notification"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {modalMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary" autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px' }}>
            {applications.map((app) => {
            // Find the job corresponding to the current application.
            const job = jobs.find(j => j.jobId === app.jobId);

            return (
                <div key={app.applicationId} style={{
                    border: '1px solid #ccc',
                    padding: '20px',
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
                                backgroundColor: app.status === 'accepted' ? 'green' : app.status === 'offered' ? 'brown' : app.status === 'rejected' ? 'red' : 'none',
                                color: 'white',
                                borderRadius: '5px',
                                display: app.status === 'pending' ? 'none' : 'inline-block',
                                fontSize: '14px'
                            }}>
                                {app.status.toUpperCase()}
                            </div>
                        </h3>
                        <p>Job Title: {app.jobTitle}</p>
                        <p>Application Date: {new Date(app.applicationDate).toLocaleDateString()}</p>
                        <div style={{ marginTop: '20px' }}>
                            <Button onClick={() => downloadResume(app.resumeURL)}
                                startIcon={<FaDownload />}
                                variant="contained"
                                color="primary"
                                size="small"
                                style={{ marginRight: '10px' }}>
                                Download Resume
                            </Button>
                            <Button onClick={() => downloadMedicalProof(app.medicalProofURL)}
                                startIcon={<FaDownload />}
                                variant="contained"
                                color="primary"
                                size="small">
                                Download Medical Proof
                            </Button>
                        </div>
                    </div>
                    <div>
                        {['pending', 'applied'].includes(app.status) && (!job || job.maxPositions > 0) ? (
                            <div style={{ display: 'flex' }}>
                                <Button onClick={() => handleStatusUpdate(app.applicationId, 'offered', app.jobId)}
                                    style={{ backgroundColor: 'brown', color: 'white', marginRight: '10px', padding: '10px' }}>
                                    <FaCheck /> Offer
                                </Button>
                                <Button onClick={() => handleStatusUpdate(app.applicationId, 'rejected')}
                                    style={{ backgroundColor: 'red', color: 'white', padding: '10px' }}>
                                    <FaTimes /> Reject
                                </Button>
                            </div>
                            ) : null}
                        </div>
                    </div>
                    );
                })}
            </div>
        </div>
    );
};

export default JobApplications;
