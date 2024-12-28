// frontend/src/components/AdminPanel.js
import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import api from '../api/api';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminPanel = () => {
    const [attendances, setAttendances] = useState([]);
    const [chartData, setChartData] = useState({});
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
        const fetchAttendances = async () => {
            try {
                const attendancesData = await api.getAttendances();
                setAttendances(attendancesData);
                prepareChartData(attendancesData);
            } catch (error) {
                console.error("Error fetching attendances", error)
            }
        };
        fetchAttendances();
    }, []);

    const prepareChartData = (data) => {
        const batchCounts = data.reduce((acc, curr) => {
            acc[curr.batch] = (acc[curr.batch] || 0) + 1;
            return acc;
        }, {});

        setChartData({
            labels: Object.keys(batchCounts),
            datasets: [
                {
                    label: 'Attendance by Batch',
                    data: Object.values(batchCounts),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
            ],
        });
    };
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Attendance by Batch',
            },
        },
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login')
    }
    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <Typography variant="h4">Admin Panel</Typography>
                <Button variant="contained" color="secondary" onClick={handleLogout}>Logout</Button>
            </div>
            <div style={{ width: '50%', margin: '20px auto' }}>
                {Object.keys(chartData).length > 0 && <Bar data={chartData} options={options} />}
            </div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Mobile</TableCell>
                            <TableCell>Batch</TableCell>
                            <TableCell>Timestamp</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {attendances.map((attendance) => (
                            <TableRow key={attendance._id}>
                                <TableCell>{attendance.name}</TableCell>
                                <TableCell>{attendance.mobile}</TableCell>
                                <TableCell>{attendance.batch}</TableCell>
                                <TableCell>{new Date(attendance.timestamp).toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default AdminPanel;