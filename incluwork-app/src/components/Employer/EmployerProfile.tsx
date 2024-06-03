import React, { useEffect, useState } from 'react';
import { getEmployerProfile, updateEmployerProfile, deleteEmployerProfile } from '../../services/employerService';
import { Dialog, Button, TextField, DialogActions, DialogContent, DialogTitle, Card, CardContent, CardActions, Select, MenuItem, InputLabel, FormControl, Chip, OutlinedInput, IconButton, Typography, Grid, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import DescriptionIcon from '@mui/icons-material/Description';
import HomeWorkIcon from '@mui/icons-material/HomeWork'; // Icon for accommodation facilities
import { AccommodationFacilities } from '../../constants/enums';
import profileImage from '../../assets/empprofile.jpg';
import { useNavigate } from 'react-router-dom'; 

interface ProfileData {
  name: string;
  email: string;
  contactNumber: string;
  companyName: string;
  companyProfile: string;
  accommodationFacilities: string[];
  inclusivityRating: number;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const EmployerProfile: React.FC = () => {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const [isDisclaimerDialogOpen, setDisclaimerDialogOpen] = useState<boolean>(false); // State for the disclaimer dialog
    const [isEditDialogOpen, setEditDialogOpen] = useState<boolean>(false);
    const [editData, setEditData] = useState<ProfileData | null>(null);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();  // Initialize useNavigate hook for navigation

    useEffect(() => {
        const fetchProfile = async () => {
            const data = await getEmployerProfile();
            setProfile(data);
            setEditData(data);
        };
        fetchProfile();
    }, []);
   
    const handleDelete = async () => {
        try {
            await deleteEmployerProfile();  // This function does not return a value on success.
            alert('Profile deleted successfully'); // Show alert message
            localStorage.clear();  // Clear the localStorage
            setProfile(null); // Update state to indicate no profile data available
            setDeleteDialogOpen(false); // Close the delete dialog
            setDisclaimerDialogOpen(false); // Close the disclaimer dialog
        } catch (error) {
            console.error('Error deleting profile:', error);
            setError('Failed to delete profile.');
        }
    };
    

    const handleUpdate = async () => {
        if (!editData || !profile) return;

        const fieldsToUpdate = Object.keys(editData).reduce((acc, key) => {
            if (editData[key as keyof ProfileData] !== profile[key as keyof ProfileData]) {
                acc[key] = editData[key as keyof ProfileData];
            }
            return acc;
        }, {});
   
        if (Object.keys(fieldsToUpdate).length > 0) {
            try {
                const updatedProfile = await updateEmployerProfile(fieldsToUpdate);
                setProfile({ ...profile, ...updatedProfile });
                setEditData({ ...profile, ...updatedProfile });
                console.log('Profile updated successfully');
            } catch (error) {
                console.error('Error updating profile:', error);
                setError('Failed to update profile.');
            }
        }
        setEditDialogOpen(false);
    };

    const handleChange = (field: keyof ProfileData, value: any) => {
        setEditData(prev => prev ? ({ ...prev, [field]: value }) : null);
    };

    return (
        <Grid container spacing={2} alignItems="center" justifyContent="center" style={{ height: '100vh', marginTop: '0' }}>
            <Grid item xs={12} sm={8} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Card style={{ display: 'flex', boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',  width: '800px'}}>
                    <img src={profileImage} alt="Profile" style={{ width: '200px', height: '200px', borderRadius: '50%', margin: '20px' }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <CardContent>
                            {profile && (
                                <>
                                    <Typography variant="h5" component="h2" style={{ fontWeight: 'bold', marginBottom: '20px' }}>
                                        {profile.companyName}
                                    </Typography>
                                    <Typography variant="body1" style={{ marginBottom: '10px' }}>
                                        <BusinessIcon style={{ verticalAlign: 'middle', marginRight: '8px', fontSize: '1rem' }} />
                                        Manager: {profile.name}
                                    </Typography>
                                    <Typography variant="body1" style={{ marginBottom: '10px' }}>
                                        <EmailIcon style={{ verticalAlign: 'middle', marginRight: '8px', fontSize: '1rem' }} />
                                        Email: {profile.email}
                                    </Typography>
                                    <Typography variant="body1" style={{ marginBottom: '10px' }}>
                                        <PhoneIcon style={{ verticalAlign: 'middle', marginRight: '8px', fontSize: '1rem' }} />
                                        Contact Number: {profile.contactNumber}
                                    </Typography>
                                    <Typography variant="body1" style={{ marginBottom: '10px' }}>
                                        <DescriptionIcon style={{ verticalAlign: 'middle', marginRight: '8px', fontSize: '1rem' }} />
                                        Company Profile: {profile.companyProfile}
                                    </Typography>
                                    <Typography variant="body1" style={{ marginBottom: '2px' }}>
                                        <HomeWorkIcon style={{ verticalAlign: 'middle', marginRight: '8px', fontSize: '1rem' }} />Accommodation Facilities:
                                    </Typography>
                                    <div style={{ marginLeft: '20px' }}>
                                        {profile.accommodationFacilities.map((facility, index) => (
                                            <Typography key={index} variant="body2">- {facility}</Typography>
                                        ))}
                                    </div>
                                </>
                            )}
                            {!profile && <Typography variant="body1">No profile data available.</Typography>}
                            {error && <Typography color="error">{error}</Typography>}
                        </CardContent>
                        <CardActions style={{ justifyContent: 'flex-end', padding: '0 20px 20px' }}>
                            <IconButton onClick={() => setEditDialogOpen(true)} color="primary" sx={{ color: 'blue' }}><EditIcon /></IconButton>
                            <IconButton onClick={() => setDeleteDialogOpen(true)} color="error" sx={{ color: 'red' }}><DeleteIcon /></IconButton>
                        </CardActions>
                    </Box>
                </Card>
            </Grid>
            <Dialog open={isDeleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>{"Delete Profile"}</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to terminate your contract with IncluWork?</Typography><br></br>
                    <Typography style={{ fontStyle: 'italic', color: 'gray' }}>Disclaimer: All your details including job listings and applications will be deleted from the application.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleDelete()} color="primary">Yes, delete</Button>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="secondary">Cancel</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={isEditDialogOpen} onClose={() => setEditDialogOpen(false)}>
                <DialogTitle>{"Edit Profile"}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={editData?.name || ''}
                        onChange={(e) => handleChange('name', e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Contact Number"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={editData?.contactNumber || ''}
                        onChange={(e) => handleChange('contactNumber', e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Company Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={editData?.companyName || ''}
                        onChange={(e) => handleChange('companyName', e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Company Profile"
                        type="text"
                        fullWidth
                        multiline
                        variant="standard"
                        value={editData?.companyProfile || ''}
                        onChange={(e) => handleChange('companyProfile', e.target.value)}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel id="accommodation-facilities-label">Accommodation Facilities</InputLabel>
                        <Select
                            labelId="accommodation-facilities-label"
                            multiple
                            value={editData?.accommodationFacilities || []}
                            onChange={(e) => handleChange('accommodationFacilities', e.target.value as string[])}
                            input={<OutlinedInput id="select-multiple-chip" label="Accommodation Facilities" />}
                            renderValue={(selected) => (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={value} />
                                    ))}
                                </div>
                            )}
                            MenuProps={MenuProps}
                        >
                            {Object.keys(AccommodationFacilities).map((key) => (
                                <MenuItem key={key} value={AccommodationFacilities[key]}>
                                    {AccommodationFacilities[key]}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleUpdate} color="primary">Save</Button>
                    <Button onClick={() => setEditDialogOpen(false)} color="secondary">Cancel</Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
};

export default EmployerProfile;
