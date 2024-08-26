import React, { useState, useEffect } from 'react';
import { JobData } from '../../models/Job';
import { fetchAllJobs , applyToJob} from './../../services/jobSeekerService'; // Make sure this path matches the location of your service function
import { Card, CardContent, Typography, Grid, Chip ,Button,Box, TextField, IconButton, CircularProgress, InputAdornment} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import './../../css/JobCards.css';
import  {debounce}  from 'lodash';



const JobCards: React.FC = () => {
    const [jobs, setJobs] = useState<JobData[]>([]);  // Use the imported JobData type for state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');


    useEffect(() => {
        loadJobs();
    }, []);

    const loadJobs = async (query = '') => {
        setLoading(true);
        try {
            const jobsFetched = await fetchAllJobs(query);  // Assuming fetchAllJobs can accept a query string
            setJobs(jobsFetched);
        } catch (error) {
            setError('Failed to fetch jobs');
            console.error(error);
        }
        setLoading(false);
    };
    
    // Debounce the loadJobs function to delay execution until 500ms after the last call
    const debouncedLoadJobs = debounce(loadJobs, 500);

    
    const handleSearchChange = (event) => {
        const { value } = event.target;
        setSearchTerm(value);
        debouncedLoadJobs(value);
    };
    // For apply button click to create a job application
    const handleApply = async (jobId) => {
        
        try {
            const result = await applyToJob(jobId);
            console.log('Application Result:', result);
            // Update the isApplied status for the applied job
            setJobs(jobs.map(job => job.jobId === jobId ? { ...job, isApplied: true } : job));
            alert('Applied successfully!'); // Alert or handle UI update
        } catch (error) {
            console.error('Failed to apply:', error);
            alert('Failed to apply.'); // Alert or handle UI update
        }
    };
    return (
         // Adjusted padding for centering
         <div className="job-cards-container">
         <Typography variant="h4" component="h1" gutterBottom className="jobs-title">
                Jobs
         </Typography>
         <Box className="search-box">
                <TextField
                    variant="outlined"
                    placeholder="Search Job"
                    size="small"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        endAdornment: searchTerm && (
                            <IconButton
                                onClick={() => {
                                    setSearchTerm('');
                                    loadJobs(''); // Clear the search and reload all jobs
                                }}
                            >
                            <ClearIcon />
                            </IconButton>
                        )
                    }}
                />
            </Box>  
         {/* {loading ? <CircularProgress color="primary" className="loading-progress" /> : null} */}
         {error && <div>{error}</div>}
         <Grid container spacing={4} justifyContent="center">
             {jobs.map((job) => (
                 <Grid item key={job.jobId} xs={12}>
                     <Card raised className="job-card">
                         <CardContent className="job-card-content">
                             <Typography variant="h5" component="h2" className="Typography--margin">{job.title}</Typography>
                             <Typography color="textSecondary" gutterBottom className="Typography--margin">{job.location} - {job.jobType}</Typography>
                             <Typography variant="body2" color="textSecondary" className="Typography--margin">Salary: ${job.salary.toLocaleString()}</Typography>
                             <Typography variant="body2" color="textSecondary" className="Typography--margin Section--spacing">
                                 Positions Available: {job.maxPositions}
                             </Typography>
                             <Typography variant="body2" component="p" className="Typography--margin Section--spacing">
                                 Skills Required:
                                 {job.requiredSkills.map((skill, index) => (
                                     <Chip key={index} label={skill} color="primary"className="chip"size="small" />
                                 ))}
                             </Typography>
                             <Typography variant="body2" component="p" className="Typography--margin">
                                 Accessibility Features:
                                 {job.accessibilityFeatures.map((feature, index) => (
                                     <Chip key={index} label={feature} size="small" className="chip"  />
                                 ))}
                             </Typography>
                         </CardContent>
                         <Box className="button-box">
                         {job.isApplied ? (
                                    <Chip label="Applied" color="success" style={{ backgroundColor: 'green', color: 'white', borderRadius: '20px' }} />
                                ) : (
                                    <Button variant="contained" color="primary" endIcon={<SendIcon />} onClick={() => handleApply(job.jobId)}>
                                        Apply
                                    </Button>
                                )}
                         </Box>
                     </Card>
                 </Grid>
             ))}
         </Grid>
     </div>
 );
};
    

export default JobCards;