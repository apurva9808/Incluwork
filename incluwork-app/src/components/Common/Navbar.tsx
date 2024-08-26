import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AppBar,Box, Toolbar, Typography, Button, Dialog, DialogTitle, DialogContent, DialogContentText } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {useDispatch} from "react-redux";
import {logout} from "../../store/authSlice.ts";
import { User } from '../../models/User';
import { fetchUserById } from './../../services/userService';

import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import {useTranslation} from "react-i18next";


const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userType, setUserType] = useState('');
    const [userDetails, setUserDetails] = useState(null);
    const [verificationDialogOpen, setVerificationDialogOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const type = localStorage.getItem('type');
        if (token) {
            const decoded = jwtDecode(token);
            setUserDetails(decoded);
            const userId = decoded._id; // Replace 'sub' with the actual key used in your JWT for user ID
            if (userId) {
                fetchUserStatus(userId);
            }
            
        }
        setIsAuthenticated(!!token);
        setUserType(type);
    }, [location]);


    const fetchUserStatus = async (userId) => {
        try {
            const userDetails = await fetchUserById(userId);
            setUserDetails(userDetails);
            if (userDetails.type === 'jobseeker' && userDetails.status == 'pending') {
                setVerificationDialogOpen(true);
            }
            else {
                setVerificationDialogOpen(false);
            }
        } catch (error) {
            console.error("Failed to fetch user details:", error);
        }
    };
    

    const dispatch = useDispatch();


     const handleLogout = () => {
        setIsAuthenticated(false);
        dispatch(logout())
            .unwrap()
            .then(() => {
                navigate('/login'); // Redirect to login page after logout
            })
            .catch((error: { message: any; }) => {
                console.error('Logout failed:', error.message);
            });
    };

    const renderButtons = () => {
        if (location.pathname === '/upload') {
            return null; // Do not render any buttons on the /upload page
        }

        if (!isAuthenticated) {
            // Check the current path to conditionally render the Login or Signup button
            if (location.pathname === '/signup') {
                return <Button color="inherit" component={Link} to="/login">Login</Button>;
            } else if (location.pathname === '/login' || '/') {
                return <Button color="inherit" component={Link} to="/signup">Signup</Button>;
            }
        } else {
            // Render buttons based on user type when authenticated
            switch (userType) {
                case 'admin':
                    return (
                        <>
                            <Button color="inherit" component={Link} to="/users">Users</Button>
                            <Button color="inherit" component={Link} to="/jobs">Jobs</Button>
                            <Button color="inherit" component={Link} to="/verifyprofiles">Verify Profiles</Button>
                            <Button color="inherit" component={Link} to="/applications">Applications</Button>
                        </>
                    );
                case 'jobseeker':
                    if (!verificationDialogOpen)
                    return (
                        <>
                            <Button color="inherit" component={Link} to="/jobseekerhome">Home</Button>
                            <Button color="inherit" component={Link} to="/jobapplications">Applications</Button>
                            <Button color="inherit" component={Link} to="/joboffers">Job Offers</Button>
                            <Button color="inherit" component={Link} to="/jobseekerprofile">Profile</Button>
                          
                        </>
                    );
                case 'employer':
                    return (
                        <>
                            <Button color="inherit" component={Link} to="/employer">Home</Button>
                            <Button color="inherit" component={Link} to="/create-job">Create Job</Button>
                            <Button color="inherit" component={Link} to="/viewapplications">View Applications</Button>
                            <Button color="inherit" component={Link} to="/employees">Employees</Button>
                            <Button color="inherit" component={Link} to="/empprofile">Profile</Button>
                        </>
                    );
                default:
                    return null;
            }
        }
    };


    return (
        <>
            {verificationDialogOpen ? (
                <Dialog open={verificationDialogOpen} disableBackdropClick disableEscapeKeyDown>
                    <DialogTitle>Profile Verification Pending</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Your profile is currently under verification. Please contact the administrator for more details.
                        </DialogContentText>
                        <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Button
                            color="primary"
                            variant="contained"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => {
                                localStorage.clear();
                                handleLogout();  
                                setVerificationDialogOpen(false); // Close the dialog
                            }}
                        >
                            Back to Login
                        </Button>
                    </Box>
                    </DialogContent>
                </Dialog>
            ) : (
                <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
                    <Toolbar>
                        <Typography variant="h6" sx={{flexGrow: 1}}>
                            INCLU-WORK
                        </Typography>
                        {renderButtons()}
                        {isAuthenticated && (
                            <Button color="inherit" onClick={handleLogout}>Logout</Button>
                        )}
                    </Toolbar>
                </AppBar>
            )}
        </>

    );
};

export default Navbar;