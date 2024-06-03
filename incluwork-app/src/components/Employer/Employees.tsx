import React, { useEffect, useState } from "react";
import { fetchApplications, fetchAllJobs, downloadResume, downloadMedicalProof, fetchAccommodationFacilities } from "../../services/employerService";
import { fetchUserById } from '../../services/userService';
import { ApplicationData } from "../../models/Application";
import { JobData } from "../../models/Job";
import { User } from "../../models/User";
import { Card, CardContent, Typography, Button, Grid, Paper, Chip, IconButton, Tooltip, Fab } from '@mui/material';
import { FaDownload, FaAngleRight, FaAngleLeft } from "react-icons/fa";

interface EmployeeDetails extends User {
    jobTitle: string;
    skills: string[];
    challenges: string[];
}

const EmployeesComponent: React.FC = () => {
    const [employees, setEmployees] = useState<EmployeeDetails[]>([]);
    const [accommodationData, setAccommodationData] = useState<any[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const applications: ApplicationData[] = await fetchApplications();
            const jobs: JobData[] = await fetchAllJobs();
            const employeeDetails = await Promise.all(applications.filter(app => app.status === "accepted").map(async (app) => {
                const user: User = await fetchUserById(app.userId);
                const job = jobs.find(j => j.jobId === app.jobId);
                return {
                    ...user,
                    jobTitle: job ? job.title : "No Job Title",
                };
            }));
            setEmployees(employeeDetails);

            const allFacilities = await fetchAccommodationFacilities();
            setAccommodationData(allFacilities);
        };

        loadData();
    }, []);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // Calculate the challenges present in current employees to filter accommodations
    const challenges = [...new Set(employees.map(emp => emp.challenges).flat())];

    if (employees.length === 0) {
        return (
            <Grid container style={{ height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h4" style={{ textAlign: 'center' }}>
                    No Employees Yet! Soon to build the team.
                </Typography>
            </Grid>
        );
    }

    return (
        <Grid container spacing={3} style={{ padding: '20px' }}>
            
            <Grid item xs={isSidebarOpen ? 3 : 1} >
                <h4> View Accommodation Facilities </h4>
                <Paper elevation={3} style={{ height: '100vh', position: 'sticky', top: 0, overflow: 'auto' }}>
                <Fab color="primary" size="small" onClick={toggleSidebar} style={{ position: 'absolute', top: 10, right: -28, zIndex: 1000 }}>
                        {isSidebarOpen ? <FaAngleLeft /> : <FaAngleRight />}
                    </Fab>
                    {!isSidebarOpen && (
                        <Typography variant="caption" style={{
                            position: 'absolute', 
                            top: 10, 
                            right: -220, // Adjust this value to ensure it appears next to the button without needing to scroll
                            zIndex: 1000, 
                            width: 200, // Adjust width as needed
                            backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                            padding: '8px', 
                            borderRadius: '10px',
                            textAlign: 'center' // Center the text within the label for better aesthetics
                        }}>
                            View Accommodation Facilities
                        </Typography>
                    )}

                    {isSidebarOpen && (
                        <div style={{ padding: '20px' }}>
                            <Typography variant="h6" style={{ fontWeight: 'bold' }}>Accommodation Facilities</Typography>
                            {accommodationData.filter(facility => challenges.includes(facility.challenge)).map((facility, index) => (
                                <div key={index}>
                                    <Typography variant="subtitle1" style={{ marginTop: '10px', fontWeight: 'bold' }}>{facility.challenge}</Typography>
                                    <ul>
                                        {facility.accommodationFacilities.map((accFacility: string, idx: number) => (
                                            <li key={idx}>{accFacility}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </Paper>
            </Grid>
            <Grid item xs={isSidebarOpen ? 9 : 11} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {employees.map((emp, index) => (
                    <Card key={index} style={{ width: '100%', maxWidth: '800px', marginBottom: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                        <CardContent>
                            <Typography variant="h5" style={{ fontWeight: 'bold' }}>{emp.name} - {emp.jobTitle}</Typography>
                            <Typography><br/>Challenge: {emp.challenges}</Typography>
                            <Typography variant="subtitle1" style={{ marginTop: '10px' }}>Skills:</Typography>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
                            {emp.skills.map((skill, index) => (
                                <Chip key={index} label={skill} variant="outlined" />
                            ))}
                        </div>
                        <div style={{ marginTop: '20px' }}>
                            <Button onClick={() => downloadResume(emp.resume)}
                                startIcon={<FaDownload />}
                                variant="contained"
                                color="primary"
                                size="small"
                                style={{ marginRight: '10px' }}>
                                Download Resume
                            </Button>
                            <Button onClick={() => downloadMedicalProof(emp.medicalProof)}
                                startIcon={<FaDownload />}
                                variant="contained"
                                color="primary"
                                size="small">
                                Download Medical Proof
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </Grid>
    </Grid>
);
};

export default EmployeesComponent;