import React, { useState } from 'react';
import { TextField, Button, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault(); // Prevent default form submission
        try {
            const res = await axios.post('http://localhost:5000/api/auth/signup', formData);
            setSuccess(res.data.message);
            setError('');
            alert('Signup successful! Redirecting to login page.');
            navigate('/login');
        } catch (err) {
            const backendError = err.response?.data?.error;
            if (backendError === 'Email is already registered') {
                setError('This email is already in use. Please use a different email.');
            } else {
                setError(backendError || 'Something went wrong!');
            }
            setSuccess('');
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
                {success && <Alert severity="success" style={{ marginBottom: '20px' }}>{success}</Alert>}
                <form onSubmit={handleSignup}>
                    <TextField
                        label="Username"
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
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
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
                            marginTop: '20px',
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
                        Sign Up
                    </Button>
                </form>
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <p style={{ color: '#fff' }}>
                        Already a user?{' '}
                        <Link
                            to="/login"
                            style={{
                                color: '#9c27b0',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                            }}
                        >
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
