// frontend/src/components/Login.js
import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.login({ username, password });
            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                navigate('/admin');
            }
        } catch (error) {
            setError('Invalid credentials');
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                maxWidth: '400px',
                margin: '100px auto',
                gap: '20px',
                padding: '20px',
                border: '1px solid #ccc',
                borderRadius: '8px',
            }}
        >
            <Typography variant="h5" align="center">Admin Login</Typography>
            <TextField
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
                label="Password"
                variant="outlined"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {error && <Alert severity="error">{error}</Alert>}
            <Button variant="contained" onClick={handleSubmit} color="primary">
                Login
            </Button>
        </Box>
    );
};

export default Login;