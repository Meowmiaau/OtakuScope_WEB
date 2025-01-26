import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';

const GetStarted = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Redirect to home if the user is already logged in
            navigate('/home');
        }
    }, [navigate]);

    const handleGetStarted = () => {
        navigate('/signup');
    };

    return (
        <div
            style={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.2)), url(/landing.jpeg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: '#fff',
                textAlign: 'center', // Center-align text for better readability
                padding: '0 20px', // Add padding for small screens
            }}
        >
            <Typography
                variant="h2"
                style={{
                    fontFamily: 'Poppins',
                    textShadow: '2px 2px 10px rgba(0, 0, 0, 0.9)', // Shadow for contrast
                    marginBottom: '20px',
                }}
            >
                Welcome to OtakuScope
            </Typography>
            <Typography
                variant="body1"
                style={{
                    fontSize: '1.2rem',
                    fontFamily: 'Poppins',
                    maxWidth: '600px',
                    textShadow: '1px 1px 5px rgba(0, 0, 0, 0.7)',
                    marginBottom: '40px',
                }}
            >
                Dive into a world of anime, manga, and much more. Join the Otaku community and explore amazing features tailored just for you.
            </Typography>
            <Button
                variant="contained"
                style={{
                    fontFamily: 'Poppins',
                    backgroundColor: '#8B5DFF',
                    color: '#fff',
                    padding: '10px 20px',
                    fontSize: '1rem',
                    textTransform: 'none', // Avoid uppercase transformation
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)', // Add subtle shadow
                }}
                onClick={handleGetStarted}
            >
                Get Started
            </Button>
        </div>
    );
};

export default GetStarted;
