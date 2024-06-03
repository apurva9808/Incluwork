import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    TextField, Button, Typography, Container, Select, MenuItem,
    Radio, RadioGroup, FormControl, FormLabel, FormControlLabel, Dialog, DialogActions,
    DialogContent, DialogContentText, DialogTitle, InputLabel
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { AppState } from "../../store";
import {JobTitles,Skills,Cities} from "../../constants/enums.ts";
import {fetchUserById} from "../../services/userService.ts";
import {User} from "../../models/User.ts";

interface JobFormData {
    title: string;
    employerId: string;
    location: string;
    jobType: string;
    accessibilityFeatures: string[];
    requiredSkills: string[];
    maxPositions: number;
    salary: number;
    dateOfJoining: string;
    dateOfPosting: string;
}


const JobCreationForm: React.FC = () => {
    const todayDate = new Date().toISOString().split('T')[0];
    const [formData, setFormData] = useState<JobFormData>({
        title: '',
        employerId: '',
        location: '',
        jobType: 'full-time',
        accessibilityFeatures: [],
        requiredSkills: [],
        maxPositions: 0,
        salary: 0,
        dateOfJoining: '',
        dateOfPosting: todayDate
    });

    const [openDialog, setOpenDialog] = useState(false);
    const { user } = useSelector((state: AppState) => state.auth);
    const [accommodationFacilities, setAccommodationFacilities] = useState<string[]>([]);

    useEffect(() => {
        const loadData=async ()=> {
            const token = localStorage.getItem('token');
            const user: User = await fetchUserById(localStorage.getItem('userId'));
            setAccommodationFacilities(user.accommodationFacilities);
            console.log(user);
        }
        loadData();

    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAccessibilityFeaturesChange = (event: SelectChangeEvent<string[]>) => {
        const { value } = event.target;

        setFormData(prev => ({ ...prev, accessibilityFeatures: typeof value === 'string' ? value.split(',') : value }));

    };
    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("in submit",formData.accessibilityFeatures)


        const url = `http://localhost:3000/incluwork/joblistings`;
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) throw new Error('Failed to create job');
            await response.json();
            setOpenDialog(true);
            resetForm();  // Reset form after successful submission
        } catch (error) {
            console.error('Error creating job:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            employerId: user.id,  // Keep the employer ID constant
            location: '',
            jobType: 'full-time',
            accessibilityFeatures: [],
            requiredSkills: [],
            maxPositions: 0,
            salary: 0,
            dateOfJoining: '',
            dateOfPosting: todayDate
        });
    };
    return (
        <Container component="main" maxWidth="sm">
            <Typography variant="h4" gutterBottom style={{ margin: '20px', padding: '10px', textAlign: 'center' }}>
                Create Job Posting
            </Typography>

            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="job-title-label">Job Title</InputLabel>
                    <Select
                        labelId="job-title-label"
                        id="jobTitle"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                    >
                        {Object.values(JobTitles).map(title => (
                            <MenuItem key={title} value={title}>{title}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl component="fieldset" margin="normal" fullWidth>
                    <FormLabel component="legend">Job Type</FormLabel>
                    <RadioGroup row name="jobType" value={formData.jobType} onChange={handleInputChange}>
                        <FormControlLabel value="full-time" control={<Radio />} label="Full-time" />
                        <FormControlLabel value="part-time" control={<Radio />} label="Part-time" />
                    </RadioGroup>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel id="location-label">Location</InputLabel>
                    <Select
                        labelId="location-label"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleSelectChange}

                    >
                        {Object.values(Cities).map(city => (
                            <MenuItem key={city} value={city}>{city}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <FormLabel>Required Skills</FormLabel>
                    <Select
                        multiple
                        name="requiredSkills"
                        value={formData.requiredSkills}
                        onChange={handleSelectChange}
                        renderValue={(selected) => selected.join(', ')}

                    >
                        {Object.values(Skills).map(skill => (
                            <MenuItem key={skill} value={skill}>{skill}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <FormLabel>Accommodation Facilities</FormLabel>
                    <Select
                        multiple
                        name="accommodationFacilities"
                        value={formData.accessibilityFeatures}
                        onChange={handleAccessibilityFeaturesChange}
                        renderValue={(selected) => selected.join(', ')}
                    >
                        {accommodationFacilities.map(feature => (
                            <MenuItem key={feature} value={feature}>{feature}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    margin="normal"
                    fullWidth
                    label="Max Positions"
                    name="maxPositions"
                    type="number"
                    value={formData.maxPositions}
                    onChange={handleInputChange}

                />

                <TextField
                    margin="normal"
                    fullWidth
                    label="Salary"
                    name="salary"
                    type="number"
                    value={formData.salary}
                    onChange={handleInputChange}

                />

                <TextField
                    margin="normal"
                    fullWidth
                    label="Date of Joining"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: todayDate }}
                    name="dateOfJoining"
                    value={formData.dateOfJoining}
                    onChange={handleInputChange}

                />

                <TextField
                    margin="normal"
                    fullWidth
                    label="Date of Posting"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    name="dateOfPosting"
                    value={formData.dateOfPosting}
                    disabled
                />

                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                    Create Job
                </Button>

                <Dialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Job Created Successfully"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            The job has been created successfully. Would you like to view jobs or create another job?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Add more jobs</Button>
                        <Button onClick={() => window.location.href = '/employer'} autoFocus>View Jobs</Button>
                    </DialogActions>
                </Dialog>
            </form>
        </Container>
    );

};

export default JobCreationForm;
