// frontend/src/api/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = {
    getBatches: async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/batches`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    },
    registerAttendance: async (attendanceData) => {
        const formData = new FormData();
        for (let key in attendanceData) {
            formData.append(key, attendanceData[key]);
        }
        const response = await axios.post(`${API_BASE_URL}/attendances`, attendanceData,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
        return response;
    },
    getAttendances: async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/attendances`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    },
    login: async (userData) => {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, userData);
        return response;
    },
    register: async (userData) => {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
        return response;
    }
};

export default api;