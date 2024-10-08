import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Grid, Typography, Paper } from '@mui/material';

const Profile = () => {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    phone: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/profile')
      .then(response => setProfile(response.data))
      .catch(error => console.error('Error fetching profile data:', error));
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    axios.post('http://localhost:5000/api/profile', profile)
      .then(response => {
        setProfile(response.data);
        setIsEditing(false);  // Exit edit mode after saving
      })
      .catch(error => console.error('Error saving profile:', error));
  };

  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',  // Full height for vertical centering
        padding: '0 16px' 
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          padding: '30px', 
          borderRadius: '12px', 
          background: 'linear-gradient(to right, #ece9e6, #ffffff)', 
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Typography 
          variant="h5" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 700, 
            color: '#333', 
            marginBottom: '24px', 
            textAlign: 'center' 
          }}
        >
          User Profile
        </Typography>
        
        {isEditing ? (
          <form noValidate autoComplete="off">
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  variant="outlined"
                  value={profile.username}
                  onChange={handleChange}
                  sx={{ borderRadius: '8px' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  variant="outlined"
                  value={profile.email}
                  onChange={handleChange}
                  sx={{ borderRadius: '8px' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  variant="outlined"
                  value={profile.phone}
                  onChange={handleChange}
                  sx={{ borderRadius: '8px' }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  sx={{
                    padding: '12px',
                    fontWeight: 'bold',
                    borderRadius: '8px',
                    backgroundColor: '#4caf50',
                    '&:hover': {
                      backgroundColor: '#45a049'
                    }
                  }}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </form>
        ) : (
          <div>
            <Typography variant="body1" sx={{ marginBottom: '12px', fontWeight: 500 }}>
              <strong>Username:</strong> {profile.username || 'N/A'}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: '12px', fontWeight: 500 }}>
              <strong>Email:</strong> {profile.email || 'N/A'}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: '24px', fontWeight: 500 }}>
              <strong>Phone Number:</strong> {profile.phone || 'N/A'}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={handleEditToggle}
              sx={{
                padding: '10px',
                fontWeight: 'bold',
                borderRadius: '8px',
                borderColor: '#1976d2',
                color: '#1976d2',
                '&:hover': {
                  backgroundColor: '#f0f4ff'
                }
              }}
            >
              Edit
            </Button>
          </div>
        )}
      </Paper>
    </Container>
  );
};

export default Profile;
