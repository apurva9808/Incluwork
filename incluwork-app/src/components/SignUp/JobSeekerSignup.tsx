import React, { useState } from 'react';
import {
    TextField,
    Button,
    Dialog,
    DialogTitle,
    List,
    ListItem,
    ListItemText,
    Checkbox,
    InputLabel,
    FormControl,
    Select,
    SelectChangeEvent,
    MenuItem,
    Chip,
    Box
  
  } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import {signup } from './../../store/authSlice';
import './../../css/Signup.css';
import {Skills} from "../../constants/enums.ts";

// import {findJobSeekerById,findEmployerById} from '../../../../incluwork-service/app/services/userService'

const JobSeekerSignup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [challenges, setChallenges] = useState('');
    const [institutionName, setInstitutionName] = useState('');
    const [courseName, setCourseName] = useState('');
    const [startYear, setStartYear] = useState('');
    const [endYear, setEndYear] = useState('');
    const [endYears, setEndYears] = useState([]);
    const [skills, setSkills] = useState<string[]>([]);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const challengesEnum = [
        'Visual Impairment', 'Hearing Impairment', 'Speech Impairment', 'Dual Sensory Impairment', 'Vestibular Impairment', 'Paralysis', 'Arthritis', 'Down Syndrome', 'Ehlers-Danlos Syndrome', 'Orthopedic Disabilities'
    ];




    const handleStartYearChange = (event: SelectChangeEvent<string>) => {
        const selectedStartYear = event.target.value;
        setStartYear(selectedStartYear);
        const updatedEndYears = Array.from(new Array(new Date().getFullYear() - parseInt(selectedStartYear) + 1), (_val, index) => parseInt(selectedStartYear) + index).reverse();
        setEndYears(updatedEndYears);
        setEndYear(''); // Reset end year if start year changes
    };

    const handleChange = (value: string) => {
        const currentIndex = skills.indexOf(value);
        const newChecked = [...skills];
 
        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setSkills(newChecked);
    };

    const handleChallengeChange = (event: SelectChangeEvent<string>) => {
        setChallenges(event.target.value);
    };



    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = {
            name,
            email,
            password,
            type: "jobseeker",
            contactNumber,
            challenges,
            education: [{
                institutionName,
                courseName,
                startYear,
                endYear
            }],
            skills
        };

        dispatch(signup(formData)).unwrap()
            .then(response => {
                console.log('Registration successful:', response);
                navigate('/upload'); // Redirect on success
            })
            .catch(error => {
                console.error('Registration failed:', error);
                // Handle error appropriately
            });
    };

    return (
        <div className="signup-form">
            <form onSubmit={handleSubmit}>
                <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth margin="normal" />
                <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth margin="normal" />
                <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth margin="normal" />
                <TextField label="Contact Number" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} fullWidth margin="normal" />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Challenges</InputLabel>
                    <Select
                        
                        value={challenges}
                        onChange={handleChallengeChange}
                        label="Challenge"
                    >
                        {challengesEnum.map((challenge) => (
                            <MenuItem key={challenge} value={challenge}>
                                {challenge}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField label="Institution Name" value={institutionName} onChange={(e) => setInstitutionName(e.target.value)} fullWidth margin="normal" />
                <TextField label="Course Name" value={courseName} onChange={(e) => setCourseName(e.target.value)} fullWidth margin="normal" />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Start Year</InputLabel>
                    <Select
                        value={startYear}
                        label="Start Year"
                        onChange={handleStartYearChange}
                    >
                        {Array.from(new Array(50), (_val, index) => new Date().getFullYear() - index).map(year => (
                            <MenuItem key={year} value={year.toString()}>
                                {year}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel>End Year</InputLabel>
                    <Select
                        value={endYear}
                        label="End Year"
                        onChange={(e) => setEndYear(e.target.value)}
                        disabled={!startYear}
                    >
                        {endYears.map(year => (
                            <MenuItem key={year} value={year.toString()}>
                                {year}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                 {/* Button and Chip display */}
                 <div style={{ marginBottom: '16px' }}>
                    <Button onClick={() => setDialogOpen(true)} variant="outlined" color="secondary" fullWidth>
                        Choose Skills
                    </Button>
                </div>
                <Box display="flex" flexWrap="wrap" gap={1} marginBottom={2}>
                    {skills.map(skill => (
                        <Chip key={skill} label={skill} onDelete={() => handleChange(skill)} />
                    ))}
                </Box>
                 {/* Dialog for selection */}
                 <Dialog onClose={() => setDialogOpen(false)} open={dialogOpen}>
                    <DialogTitle>Skills</DialogTitle>
                    <List>
                        {Object.values(Skills).map(skill => (
                            <ListItem
                                key={skill}
                                dense
                                button
                                onClick={() => handleChange(skill)}
                            >
                                <Checkbox
                                    edge="start"
                                    checked={skills.indexOf(skill) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                />
                                <ListItemText primary={skill} />
                            </ListItem>
                        ))}
                    </List>
                </Dialog>
                 {/* Submit and navigation buttons */}
                 <div className="button-container">
                    <Button variant="outlined" color="secondary" type="submit">Register</Button>
                    <p>Already have an account? Click login</p>
                    <Button onClick={() => navigate('/login')} variant="outlined" color="secondary">LOGIN</Button>
                </div>
            </form>
        </div>
    );
};

export default JobSeekerSignup;
