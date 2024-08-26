import React, {useEffect, useState} from 'react';
import {Container, Grid, Paper, Typography, Button} from '@mui/material';
import {useNavigate} from "react-router-dom";


const JobseekerUpload: React.FC = () => {
    const [medicalFile, setMedicalFile] = useState<File | null>(null);
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const navigate=useNavigate();
    useEffect(() => {
        // Check if 'type' is not set or if it's not 'employer'
        if (localStorage.getItem('type') === null || localStorage.getItem('type') !== 'jobseeker') {
            
            localStorage.clear(); // Clear localStorage (remove all items)
            navigate('/unauthorized'); // Navigate user to '/unauthorized' page
        }
    }, [navigate]);
    const handleMedicalFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setMedicalFile(file);
        }
    };

    const handleResumeFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setResumeFile(file);
        }
    };

    const handleUpload = async () => {
        if (medicalFile) {
            await uploadFile(medicalFile, '/medicalproof'); // Upload medical file to /proof endpoint
        }
        if (resumeFile) {
            await uploadFile(resumeFile, '/resume'); // Upload resume file to /resume endpoint
        }
        alert('files are uploaded successfully');
        navigate('/jobseeker');
    };

    const uploadFile = async (file: File | Blob, endpoint: string) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/incluwork${endpoint}`, {
                method: 'POST',
                body: formData,
                headers: {
                    // 'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            console.log(`File ${file instanceof File ? file.name : 'Blob'} uploaded successfully to ${endpoint}`);

        } catch (error) {
            console.error(`Error uploading file ${file instanceof File ? file.name : 'Blob'}:`, error);
        }
    };


    return (
        <Container maxWidth="lg">
            <div className="upload-title">
                <Typography variant="h4" gutterBottom>
                    Upload Medical Document and Resume
                </Typography>
            </div>

            <Grid container spacing={3} className="docs-uploac">
                {/* Medical Document Upload Box */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} style={{padding: '20px', textAlign: 'center'}}>
                        <Typography variant="h6" gutterBottom>
                            Upload Medical Document
                        </Typography>
                        <input type="file" accept=".pdf,.doc,.docx" onChange={handleMedicalFileUpload}/>
                        {medicalFile && <Typography variant="body1">{medicalFile.name}</Typography>}
                    </Paper>
                </Grid>

                {/* Resume Upload Box */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} style={{padding: '20px', textAlign: 'center'}}>
                        <Typography variant="h6" gutterBottom>
                            Upload Resume
                        </Typography>
                        <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeFileUpload}/>
                        {resumeFile && <Typography variant="body1">{resumeFile.name}</Typography>}
                    </Paper>
                </Grid>
            </Grid>

            {/* Upload Button */}
            <div className="upload-button">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpload}
                    disabled={!medicalFile || !resumeFile}
                    style={{marginTop: '20px'}}
                >
                    Upload
                </Button>
            </div>

        </Container>
    );
};

export default JobseekerUpload;
