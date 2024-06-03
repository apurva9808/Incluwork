import React, { useEffect, useState } from 'react';
import profileIcon from './../../assets/jobseeker.png';
import StarRating from './StarRating';
import { postRating } from './../../services/ratingService';
import { fetchUserById } from './../../services/userService';
import {downloadMedicalProof, downloadResume} from "../../services/employerService.ts";
import { Typography, Grid, Card, CardContent, Avatar,  IconButton, DialogContentText } from '@mui/material';
import { Dialog, DialogContent, DialogTitle, TextField, Button, Checkbox, ListItem, ListItemText, List, DialogActions } from '@mui/material';
import {
    fetchJobSeekerDetails,
    updateJobSeekerDetails,
    deleteJobSeeker,
    fetchAllJobs,
    fetchJobApplications,
    uploadResume 
  } from '../../services/jobSeekerService';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Skills } from "../../constants/enums"; 
import { useNavigate } from 'react-router-dom';

interface JobApplication {
    jobId: string;
    jobTitle: string;
    companyName: string;
    employerId: string;
    status: string;
}

// Define an interface for the job seeker profile
interface JobSeekerProfile {
    id: string;
    name: string;
    email: string;
    contactNumber: string;
    skills: string[];
    challenge: string;
    resume: string; // Assuming URL to the resume
    medicalProof: string; // Assuming URL to the medical proof
    jobTitle?: string;
    employerName?: string;
}

const JobseekerProfile: React.FC = () => {
    const [Applications, setAcceptedApplications] = useState<JobApplication[]>([]);
    const [profile, setProfile] = useState<JobSeekerProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editedContactNumber, setEditedContactNumber] = useState('');
    const [editedSkills, setEditedSkills] = useState<string[]>([]);
    const [resumeFile, setResumeFile] = useState<string>('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const loadProfileAndJobs = async () => {
            setLoading(true);
            try {
                const [profileData, jobs, applications] = await Promise.all([
                    fetchJobSeekerDetails(), 
                    fetchAllJobs(),
                    fetchJobApplications()
                ]);

                const acceptedApplication = applications.find(app => app.status === 'accepted' && app.jobId);
                const jobDetails = acceptedApplication ? jobs.find(job => job.jobId === acceptedApplication.jobId) : null;

                

                if (jobDetails && acceptedApplication) {
                    const employerDetails = await fetchUserById(jobDetails.employerId);
                    
                    setProfile({
                        ...profileData,
                        jobTitle: jobDetails.title,
                        employerName: employerDetails ? employerDetails.companyName : 'Unknown Company'
                    });
                } else {
                    setProfile(profileData);
                }
              
            } catch (error) {
                console.error('Failed to fetch profile or job details:', error);
                setError('Failed to fetch data');
            }
            setLoading(false);
        };

        loadProfileAndJobs();
    }, []);

    // To handle update in skills
    const handleSkillChange = (skill: string) => {
        setEditedSkills(prev => {
            const currentIndex = prev.indexOf(skill);
            if (currentIndex === -1) {
                return [...prev, skill];
            } else {
                return prev.filter(s => s !== skill);
            }
        });
    };
 
    //To handle resume file change

    const handleResumeFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setResumeFile(file);
        }
    };

    const handleUploadResume = async () => {
        if (!resumeFile) {
            alert('No file selected');
            return;
          } // Making sure there's a file selected

        try {
            const newResumeURL = await uploadResume(resumeFile);
            setResumeFile(newResumeURL);

            alert('Resume uploaded successfully');
        } catch (error) {
            alert(`Failed to upload resume: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    //Save changes
    const handleSubmit = async () => {

        const { name, email,challenge, ...rest } = profile!;
        const updatedProfile = {
            ...rest,
            contactNumber: editedContactNumber,
            skills: editedSkills,
            resume: resumeFile || profile.resume,
        };
        try {
            await updateJobSeekerDetails(updatedProfile);
            setProfile(prev => ({
                ...prev, // keep all existing data
                ...updatedProfile, // override with updated data
            }));
            setEditDialogOpen(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert('Failed to update profile: ' + error.message); // Add this to see error feedback directly on UI
        }
    };
 

    const handleEdit = () => {
        setEditedContactNumber(profile?.contactNumber || '');
        setEditedSkills(profile?.skills || []);
        // setResumeFile(profile?.resume || '');
        setEditDialogOpen(true);
    };



    //To handle opening the delete confirmation dialog
    const handleDeleteConfirmation = () => {
        setDeleteDialogOpen(true);
    };

   // To handle cancel action in  the delete confirmation dialog
    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
    };

    // To handle the confirm action in delete confirmation
    const handleDeleteConfirm = async () => {
        try {
            await deleteJobSeeker();
            alert('Jobseeker profile deleted successfully');
            localStorage.clear();
            setProfile(null); // Clear the profile data
            setDeleteDialogOpen(false); // Close the dialog
            //navigate('/login');
        } catch (error) {
            console.error('Failed to delete profile:', error);
            setDeleteDialogOpen(false); // Close the dialog in case of error as well
        }
    };
    // if (loading) return <div>Loading profile...</div>;
    if (error) return <div>{error}</div>;
    if (!profile) return <div>No Profile Found</div>;

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
         <Card raised style={{ maxWidth: 600, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
           <div style={{ alignSelf: 'flex-start', marginBottom: '20px' }}>
          
          </div>
          <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>

                    <Avatar alt="Profile Picture" src={profileIcon} sx={{ width: 128, height: 128 }} />   
                    <Typography variant="h5" align="center" gutterBottom>Name : {profile.name}</Typography>
                    <Typography color="textSecondary" align="center">Email : {profile.email}</Typography>
                    <Typography color="textSecondary" align="center" gutterBottom>Contact number : {profile.contactNumber}</Typography>
                    <Typography align="center" gutterBottom>Skills: {profile.skills.join(', ')}</Typography>
                    <Typography align="center" gutterBottom>Challenge: {profile.challenge}</Typography>
                    {profile.jobTitle && <Typography>Job Title: {profile.jobTitle}</Typography>}
                    {profile.employerName && <Typography>Company : {profile.employerName}</Typography>}
                    <div style={{ alignSelf: 'flex-end', marginTop: 'auto', display: 'flex', gap: '10px' }}>
                   <Button variant="contained" startIcon={<FileDownloadIcon />} onClick={() => downloadResume(profile.resume)}>Download Resume</Button>
                   <Button variant="contained" startIcon={<FileDownloadIcon />} onClick={() => downloadMedicalProof(profile.medicalProof)}>Download Medical Proof</Button>
          </div>
          <div style={{ alignSelf: 'flex-end', display: 'flex', gap: '10px' }}>
            <IconButton onClick={handleEdit} color="primary"><EditIcon /></IconButton>
            <IconButton onClick={handleDeleteConfirmation} color="error"><DeleteIcon /></IconButton>
          </div>
             </CardContent>
            </Card>

            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                <DialogTitle>Edit Your Profile</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Contact Number"
                        value={editedContactNumber}
                        onChange={(e) => setEditedContactNumber(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                
                     <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
                                <input
                                    id="file-input"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleResumeFileChange}
                                    style={{ display: 'none' }}
                                />
                                <label htmlFor="file-input" style={{ cursor: 'pointer' }}>
                                    <Typography variant="body2" color="primary">Choose File</Typography>
                                </label>
                                <Button
                                    variant="contained"
                                    startIcon={<FileUploadIcon />}
                                    onClick={handleUploadResume} 
                                    disabled={!resumeFile}
                                >
                                    Upload Resume
                                </Button>
                    </div>
                    <List>
                         Add Skills: 
                        {Object.values(Skills).map(skill => (
                            <ListItem key={skill} button onClick={() => handleSkillChange(skill)}>
                                <Checkbox checked={editedSkills.includes(skill)} />
                                <ListItemText primary={skill} />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSubmit} color="primary">Save Changes</Button>
                    <Button onClick={() => setEditDialogOpen(false)} color="primary">Cancel</Button>
                </DialogActions>
            </Dialog>
         {/* Delete Confirmation Dialog */}
         <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirm Deletion"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete your profile?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="primary" autoFocus>
                        Yes, Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default JobseekerProfile;
