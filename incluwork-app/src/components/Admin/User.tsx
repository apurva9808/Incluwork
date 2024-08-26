import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, useTheme } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkIcon from '@mui/icons-material/Work';
import {UserType} from "../../models/User.ts";

interface User {
    id: string;
    name: string;
    email: string;
    type: UserType;
    contactNumber?: string;
}

const UserItem: React.FC<{ user: User }> = ({ user }) => {
    const theme = useTheme();

    // Function to determine the border color based on user type
    const getBorderColor = (type) => {
        switch(type) {
            case 'jobseeker':
                return theme.palette.error.main; // Red for jobseeker
            case 'employer':
                return theme.palette.primary.main; // Blue for employer
            default:
                return theme.palette.grey[500]; // Default color
        }
    };

    const borderColor = getBorderColor(user.type);

    return (
        <Paper style={{ padding: theme.spacing(2), marginBottom: theme.spacing(2), borderLeft: `4px solid ${borderColor}` }}>
            <Typography variant="subtitle1" gutterBottom>
                <AccountCircleIcon color="primary" style={{ verticalAlign: 'bottom', marginRight: theme.spacing(1) }} />
                {user.name}
            </Typography>
            <Typography variant="body2">
                <EmailIcon fontSize="small" style={{ verticalAlign: 'middle', marginRight: theme.spacing(1) }} />
                {user.email}
            </Typography>
            <Typography variant="body2">
                <WorkIcon fontSize="small" style={{ verticalAlign: 'middle', marginRight: theme.spacing(1) }} />
                Type: {user.type}
            </Typography>
            {user.contactNumber && (
                <Typography variant="body2">
                    <PhoneIcon fontSize="small" style={{ verticalAlign: 'middle', marginRight: theme.spacing(1) }} />
                    Contact Number: {user.contactNumber}
                </Typography>
            )}
        </Paper>
    );
};

const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const token=localStorage.getItem('token');
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/incluwork/admin/users', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data: User[] = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <Grid container justifyContent="center" style={{ padding: '20px' }}>
            <Grid item xs={12}>
                <Typography variant="h4" style={{ marginBottom: '20px', textAlign: 'center' }}>
                    Users
                </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
                {users.length > 0 ? (
                    users.map((user) => (
                        <UserItem key={user.id} user={user} />
                    ))
                ) : (
                    <Typography variant="h6" style={{ textAlign: 'center' }}>
                        No users found
                    </Typography>
                )}
            </Grid>
        </Grid>
    );
};

export default Users;
