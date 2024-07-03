import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Container, Typography } from '@mui/material';

function Callback() {
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchAccessToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      if (code) {
        try {
          const response = await axios.get(`${baseURL}/auth/callback?code=${code}`);
          const token = response.data.accessToken;
          sessionStorage.setItem('accessToken', token);
          navigate('/');
        } catch (error) {
          console.error('Error fetching access token:', error);
        }
      }
    };
    fetchAccessToken();
  }, [baseURL, navigate]);

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Logging in...
      </Typography>
      <CircularProgress />
    </Container>
  );
}

export default Callback;
