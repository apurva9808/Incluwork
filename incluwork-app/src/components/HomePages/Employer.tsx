import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Card, CardActions, CardContent, Button, Typography, Container,
    Dialog, DialogActions, DialogContent, DialogTitle, TextField,
    FormControl, Select, MenuItem, InputLabel, FormControlLabel, Radio,
    RadioGroup, FormLabel
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { format, isValid, parseISO } from 'date-fns';
import { useSelector } from "react-redux";
import { AppState } from "../../store";
import {JobTitles, Skills, Cities} from "../../constants/enums.ts";
import {User} from "../../models/User.ts";
import {fetchUserById} from "../../services/userService.ts";

export interface Job {
    accessibilityFeatures: string[];
    jobId: string;
    title: string;
    location: string;
    description?: string;
    jobType: string;
    requiredSkills: string[];
    salary: number;
    dateOfJoining: string;
    dateOfPosting: string;
    maxPositions:number;
}

const EmployerHome: React.FC = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [currentJob, setCurrentJob] = useState<Job | null>(null);
    let { user } = useSelector((state: AppState) => state.auth);
    const [accommodationFacilities, setAccommodationFacilities] = useState<string[]>([]);

    useEffect(() => {
        const loadData=async ()=> {
            const token = localStorage.getItem('token');
            const user: User = await fetchUserById(localStorage.getItem('userId'));
            setAccommodationFacilities(user.accommodationFacilities);
            console.log(user);
        }
        loadData();
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("No token found");
            navigate('/login');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/incluwork/joblistings', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {

                throw new Error('Failed to fetch jobs');
            }

            const data = await response.json() as Job[];
            setJobs(data);
        } catch (error) {
            console.log(error)
            console.error('Error fetching jobs:', error);
        }
    };

    const handleDeleteJob = async (jobId: string) => {
        const token = localStorage.getItem('token');
        const url = `http://localhost:3000/incluwork/joblistings/${jobId}`;

        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete job');
            }

            setJobs(jobs.filter(job => job.jobId !== jobId));
        } catch (error) {
            console.error('Error deleting job:', error);
        }
    };

    const handleEditJob = (job: Job) => {
        setCurrentJob(job);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentJob(null);
    };


    const handleSaveChanges = async () => {
        if (!currentJob) return;
        const token = localStorage.getItem('token');
        const url = `http://localhost:3000/incluwork/joblistings/${currentJob.jobId}`;

        try {
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(currentJob)
            });

            if (!response.ok) {
                throw new Error('Failed to update job');
            }

            const updatedJob = await response.json();
            setJobs(jobs.map(job => job.jobId === updatedJob.jobId ? updatedJob : job));
            handleCloseDialog();
        } catch (error) {
            console.error('Error updating job:', error);
        }
    };

    return (
        <Container component="main" maxWidth="false" style={{ padding: '20px' }}>  {/* Remove maxWidth limit and add padding */}
            <Typography variant="h4" gutterBottom>Employer Dashboard</Typography>
            <Typography variant="h6" style={{ marginBottom: '20px' }}>Your Jobs</Typography> {/* Add margin below the header */}
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}> {/* Adjust justifyContent */}
                {jobs.length > 0 ? (
                    jobs.map(job => (
                        <Card key={job.jobId} style={{ width: '30%', margin: '10px 20px' }}> {/* Adjust width and margin of cards */}
                            <CardContent>
                                <Typography variant="h5" component="div">{job.title}</Typography>
                                <Typography color="textSecondary">{job.location}</Typography>
                                <Typography variant="subtitle1"><span style={{ fontWeight: 'bold' }}>Job Type:</span> {job.jobType}</Typography>
                                <Typography variant="subtitle1"><span style={{ fontWeight: 'bold' }}>Salary: </span>${job.salary.toLocaleString()}</Typography>
                                <Typography variant="subtitle1"><span style={{ fontWeight: 'bold' }}>Skills: </span>{job.requiredSkills.toLocaleString()}</Typography>
                                <Typography variant="subtitle1"><span style={{ fontWeight: 'bold' }}>Accessibility Features: </span>{job.accessibilityFeatures.toLocaleString()}</Typography>
                                <Typography variant="subtitle1">
                                  <span
                                      style={{fontWeight: 'bold'}}>  Posted: </span>{job.dateOfPosting && isValid(parseISO(job.dateOfPosting)) ? format(parseISO(job.dateOfPosting), 'PPP') : 'Date not available'}
                                </Typography>
                            </CardContent>
                            <CardActions style={{ justifyContent: 'space-between' }}>
                                <Button variant="Rounded" startIcon={<DeleteIcon />} onClick={() => handleDeleteJob(job.jobId)}/>
                                <Button startIcon={<EditIcon />} onClick={() => handleEditJob(job)}></Button>
                            </CardActions>
                        </Card>
                    ))
                ) : (
                    <Typography>No jobs found.</Typography>
                )}
            </div>
            {currentJob && (
                <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
                    <DialogTitle style={{ textAlign: 'center' }} variant="h4">Edit Job</DialogTitle>
                    <DialogContent>
                        <form style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                            <FormControl fullWidth margin="dense">
                                <InputLabel>Job Title</InputLabel>
                                <Select
                                    value={currentJob.title}
                                    onChange={(e) => setCurrentJob({...currentJob, title: e.target.value})}
                                >
                                    {Object.values(JobTitles).map((title) => (
                                        <MenuItem key={title} value={title}>{title}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl component="fieldset" fullWidth margin="dense">
                                <FormLabel component="legend">Job Type</FormLabel>
                                <RadioGroup
                                    row
                                    name="jobType"
                                    value={currentJob.jobType}
                                    onChange={(e) => setCurrentJob({...currentJob, jobType: e.target.value})}
                                >
                                    <FormControlLabel value="full-time" control={<Radio/>} label="Full-time"/>
                                    <FormControlLabel value="part-time" control={<Radio/>} label="Part-time"/>
                                </RadioGroup>
                            </FormControl>

                            <FormControl fullWidth margin="dense">
                                <InputLabel>Location</InputLabel>
                                <Select
                                    value={currentJob.location}
                                    onChange={(e) => setCurrentJob({...currentJob, location: e.target.value})}
                                >
                                    {Object.values(Cities).map((city) => (
                                        <MenuItem key={city} value={city}>{city}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel>Skills</InputLabel>
                                <Select
                                    multiple
                                    value={Array.isArray(currentJob.requiredSkills) ? currentJob.requiredSkills : []}
                                    onChange={(e) => setCurrentJob({
                                        ...currentJob,
                                        skills: typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value
                                    })}
                                    renderValue={(selected) => selected.join(', ')}
                                >
                                    {Object.values(Skills).map((Skill) => (
                                        <MenuItem key={Skill} value={Skill}>{Skill}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth margin="dense">
                                <InputLabel>Accommodation Facilities</InputLabel>
                                <Select
                                    multiple
                                    value={Array.isArray(currentJob.accessibilityFeatures) ? currentJob.accessibilityFeatures : []}
                                    onChange={(e) => setCurrentJob({
                                        ...currentJob,
                                        accessibilityFeatures: typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value
                                    })}
                                    renderValue={(selected) => selected.join(', ')}
                                >
                                    {accommodationFacilities.map((facility) => (
                                        <MenuItem key={facility} value={facility}>{facility}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField
                                fullWidth
                                label="Max Positions"
                                type="number"
                                value={currentJob.maxPositions}
                                onChange={(e) => setCurrentJob({
                                    ...currentJob,
                                    maxPositions: parseInt(e.target.value, 10)
                                })}
                                margin="dense"
                            />

                            <TextField
                                fullWidth
                                label="Salary"
                                type="number"
                                value={currentJob.salary}
                                onChange={(e) => setCurrentJob({...currentJob, salary: parseInt(e.target.value, 10)})}
                                margin="dense"
                            />

                            <TextField
                                fullWidth
                                label="Date of Joining"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={currentJob.dateOfJoining ? currentJob.dateOfJoining.split('T')[0] : ''}
                                onChange={(e) => setCurrentJob({...currentJob, dateOfJoining: e.target.value})}
                                margin="dense"
                            />

                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button onClick={handleSaveChanges}>Save</Button>
                    </DialogActions>
                </Dialog>
            )}
        </Container>
    )
};

export default EmployerHome;
