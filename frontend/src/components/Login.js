import React, { useState } from 'react';
import { TextField, Button, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent default form submission
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            const token = res.data.token;
            const username = res.data.username;

            // Save token to localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('username', username); // Saving the username

            // Clear error and redirect to the homepage
            setError('');
            alert('Login successful! Redirecting to homepage.');
            navigate('/home'); // Adjust this route as per your application's structure
        } catch (err) {
            const backendError = err.response?.data?.error;
            setError(backendError || 'Login failed! Please try again.');
        }
    };

    return (
        <div
            style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#121212', // Dark background
                color: '#fff',
            }}
        >
            <div
                style={{
                    width: '400px',
                    padding: '20px',
                    borderRadius: '10px',
                    backgroundColor: '#292929', // Slightly lighter dark background for the form container
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
                }}
            >
                {error && <Alert severity="error" style={{ marginBottom: '20px' }}>{error}</Alert>}
                <form onSubmit={handleLogin}>
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ style: { color: '#fff' } }}
                        InputProps={{
                            style: { color: '#fff', borderColor: '#6a1b9a' },
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#6a1b9a' },
                                '&:hover fieldset': { borderColor: '#9c27b0' },
                            },
                        }}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ style: { color: '#fff' } }}
                        InputProps={{
                            style: { color: '#fff', borderColor: '#6a1b9a' },
                        }}
                        sx={{
                            marginTop: '20px',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#6a1b9a' },
                                '&:hover fieldset': { borderColor: '#9c27b0' },
                            },
                        }}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        style={{
                            marginTop: '20px',
                            backgroundColor: '#6a1b9a', // Purple button background
                            color: '#fff',
                            fontFamily: 'Poppins',
                        }}
                        sx={{
                            '&:hover': {
                                backgroundColor: '#9c27b0',
                            },
                        }}
                    >
                        Login
                    </Button>
                </form>
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <p style={{ color: '#fff' }}>
                        Don’t have an account?{' '}
                        <Link
                            to="/signup"
                            style={{
                                color: '#9c27b0',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                            }}
                        >
                            Sign up here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
