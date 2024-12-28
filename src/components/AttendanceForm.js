// frontend/src/components/AttendanceForm.js
import React, { useState, useRef, useEffect } from 'react';
import api from '../api/api';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box, IconButton } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CameraIcon from '@mui/icons-material/Camera';

function AttendanceForm() {
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [batch, setBatch] = useState('');
    const [image, setImage] = useState(null);
    const videoRef = useRef(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [batches, setBatches] = useState([])
    const [preview, setPreview] = useState(null)

    useEffect(() => {
        const fetchBatches = async () => {
            try {
                const batchesData = await api.getBatches();
                setBatches(batchesData);
            } catch (error) {
                console.error("Error fetching batches", error);
            }
        }
        fetchBatches();
    }, [])

    const handleCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
            setIsCameraActive(true);
        } catch (error) {
            console.error("Error accessing camera", error);
        }
    };

    const handleCapture = () => {
        const canvas = document.createElement('canvas');
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const imageUrl = canvas.toDataURL('image/jpeg')
        setImage(imageUrl);
        setPreview(imageUrl);
        setIsCameraActive(false);
        // Stop the camera stream
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const attendanceData = {
            name,
            mobile,
            batch,
            image
        };
        try {
            const response = await api.registerAttendance(attendanceData);
            if (response.status === 201) {
                console.log("Attendence registered successfully");
            }
            setName('');
            setMobile('');
            setBatch('');
            setImage(null);
            setPreview(null);
        } catch (error) {
            console.error("Error registering attendence", error)
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                maxWidth: '400px',
                margin: '20px auto',
                gap: '10px',
                padding: '20px',
                border: '1px solid #ccc',
                borderRadius: '8px',
            }}
        >
            <TextField label="Name" variant="outlined" value={name} onChange={(e) => setName(e.target.value)} required />
            <TextField label="Mobile Number" variant="outlined" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
            <FormControl fullWidth variant="outlined" required>
                <InputLabel id="batch-select-label">Batch</InputLabel>
                <Select
                    labelId="batch-select-label"
                    id="batch-select"
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    label="Batch"
                >
                    {batches.map((batchName, index) => (
                        <MenuItem value={batchName} key={index}>{batchName}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            {isCameraActive && <video ref={videoRef} autoPlay style={{ width: '100%', maxHeight: '300px' }} />}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {!isCameraActive && <IconButton onClick={handleCamera} aria-label="take-photo" color="primary">
                    <CameraAltIcon />
                </IconButton>}
                {isCameraActive && <Button variant="contained" onClick={handleCapture} startIcon={<CameraIcon />}>Capture</Button>}
            </Box>
            {preview && <img src={preview} width="100" height="100" alt='preview' />}
            <Button variant="contained" onClick={handleSubmit} color="primary">Submit</Button>
        </Box>
    );
}
export default AttendanceForm;