import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const DataContext = createContext();
export const useData = () => useContext(DataContext);

const API_URL = '/api';

export const DataProvider = ({ children }) => {
    const { user } = useAuth();

    // ── Get auth headers ──
    // Always reads fresh from localStorage so it never misses a token
    const getAuthHeaders = () => {
        const token = localStorage.getItem('access_token');
        if (!token || token === 'null' || token === 'undefined') {
            console.error('❌ No valid token found!');
            return {};
        }
        // Also keep axios default in sync
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return { headers: { 'Authorization': `Bearer ${token}` } };
    };

    // ── State ──
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [consultations, setConsultations] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [patients, setPatients] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    // ── Fetch data when user changes ──
    useEffect(() => {
        fetchDoctors();

        const token = localStorage.getItem('access_token');
        const validToken = token && token !== 'null' && token !== 'undefined';

        if (!user || !validToken) {
            setAppointments([]);
            setConsultations([]);
            setTickets([]);
            setPatients([]);
            setNotifications([]);
            return;
        }

        // ✅ Set axios default immediately so all fetch functions have it
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        const timer = setTimeout(() => {
            if (user.role === 'doctor') {
                fetchDoctorAppointments();
            } else {
                fetchAppointments();
            }
            fetchConsultations();
            fetchTickets();
            if (user.role === 'admin') fetchAllPatients();
        }, 300);

        return () => clearTimeout(timer);
    }, [user]);


    // ════════════════════════════════
    //  REFRESH ALL DATA (called after login)
    // ════════════════════════════════
    const refreshAllData = (token) => {
        // ✅ Set axios default FIRST before any requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const headers = { headers: { 'Authorization': `Bearer ${token}` } };

        axios.get(`${API_URL}/doctors/`)
            .then(res => setDoctors(res.data))
            .catch(console.error);

        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);

            if (parsedUser.role === 'doctor') {
                axios.get(`${API_URL}/doctors/me/appointments/`, headers)
                    .then(res => setAppointments(res.data)).catch(console.error);
            } else {
                axios.get(`${API_URL}/appointments/`, headers)
                    .then(res => setAppointments(res.data)).catch(console.error);
            }

            // ✅ All requests use explicit headers — no relying on axios defaults
            axios.get(`${API_URL}/consultations/`, headers)
                .then(res => setConsultations(res.data)).catch(console.error);

            axios.get(`${API_URL}/tickets/`, headers)
                .then(res => setTickets(res.data)).catch(console.error);

            if (parsedUser.role === 'admin') {
                axios.get(`${API_URL}/admin/patients/`, headers)
                    .then(res => setPatients(res.data)).catch(console.error);
            }
        }
    };


    // ════════════════════════════════
    //  FETCH FUNCTIONS
    // ════════════════════════════════
    const fetchDoctors = async () => {
        try {
            const res = await axios.get(`${API_URL}/doctors/`);
            setDoctors(res.data);
        } catch (error) {
            console.error('Failed to fetch doctors:', error);
        }
    };

    const fetchAppointments = async () => {
        try {
            const res = await axios.get(`${API_URL}/appointments/`, getAuthHeaders());
            setAppointments(res.data);
        } catch (error) {
            console.error('Failed to fetch appointments:', error);
        }
    };

    const fetchDoctorAppointments = async () => {
        try {
            const res = await axios.get(`${API_URL}/doctors/me/appointments/`, getAuthHeaders());
            setAppointments(res.data);
        } catch (error) {
            console.error('Failed to fetch doctor appointments:', error);
        }
    };

    const fetchConsultations = async () => {
        try {
            const res = await axios.get(`${API_URL}/consultations/`, getAuthHeaders());
            setConsultations(res.data);
        } catch (error) {
            console.error('Failed to fetch consultations:', error);
        }
    };

    const fetchTickets = async () => {
        try {
            const res = await axios.get(`${API_URL}/tickets/`, getAuthHeaders());
            setTickets(res.data);
        } catch (error) {
            console.error('Failed to fetch tickets:', error);
        }
    };

    const fetchAllPatients = async () => {
        try {
            const res = await axios.get(`${API_URL}/admin/patients/`, getAuthHeaders());
            setPatients(res.data);
        } catch (error) {
            console.error('Failed to fetch patients:', error);
        }
    };


    // ════════════════════════════════
    //  NOTIFICATIONS (local only)
    // ════════════════════════════════
    const addNotification = (title, message, type) => {
        setNotifications(prev => [{
            id: Date.now(), title, message, type,
            date: new Date().toISOString().split('T')[0],
            read: false
        }, ...prev]);
    };

    const markRead = (id) => setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    const markAllRead = () => setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
    );


    // ════════════════════════════════
    //  APPOINTMENTS
    // ════════════════════════════════
    const bookAppointment = async (doctor, dateTime, notes) => {
        try {
            const res = await axios.post(`${API_URL}/appointments/`, {
                doctor: doctor.id,
                date_time: dateTime,
                notes: notes,
            }, getAuthHeaders());

            setAppointments(prev => [...prev, res.data]);
            addNotification('Appointment Booked', `Your booking with Dr. ${doctor.full_name} is pending approval.`, 'appointment');
            return res.data;
        } catch (error) {
            console.error('❌ Failed to book appointment:', error.response?.data || error);
        }
    };

    const cancelAppointment = async (id) => {
        try {
            await axios.put(`${API_URL}/appointments/${id}/status/`, { status: 'Cancelled' }, getAuthHeaders());
            setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'Cancelled' } : a));
            addNotification('Appointment Cancelled', 'Appointment has been cancelled.', 'appointment');
        } catch (error) {
            console.error('Failed to cancel appointment:', error);
        }
    };

    const rescheduleAppointment = async (id, newDateTime) => {
        try {
            await axios.put(`${API_URL}/appointments/${id}/`, { date_time: newDateTime }, getAuthHeaders());
            setAppointments(prev => prev.map(a => a.id === id ? { ...a, date_time: newDateTime, status: 'Pending' } : a));
            addNotification('Appointment Rescheduled', 'Your appointment has been rescheduled.', 'appointment');
        } catch (error) {
            console.error('Failed to reschedule appointment:', error);
        }
    };


    // ════════════════════════════════
    //  TICKETS
    // ════════════════════════════════
    const addTicket = async (ticket) => {
        try {
            const res = await axios.post(`${API_URL}/tickets/`, {
                subject: ticket.subject,
                type: ticket.type,
                message: ticket.message
            }, getAuthHeaders());
            setTickets(prev => [...prev, res.data]);
            addNotification('Support Ticket Submitted', 'Your ticket has been received.', 'support');
            return res.data;
        } catch (error) {
            console.error('Failed to add ticket:', error);
        }
    };


    // ════════════════════════════════
    //  CONSULTATIONS
    // ════════════════════════════════
    const requestFollowUp = async (doctor, date, time) => {
        addNotification('Follow-up Requested', `Your follow-up with ${doctor} is pending.`, 'consultation');
    };


    // ════════════════════════════════
    //  ADMIN — DOCTORS
    // ════════════════════════════════
    const addDoctor = async (doctor) => {
        try {
            const res = await axios.post(`${API_URL}/doctors/add/`, doctor, getAuthHeaders());
            setDoctors(prev => [...prev, res.data]);
        } catch (error) {
            console.error('Failed to add doctor:', error);
        }
    };

    const updateDoctor = async (updated) => {
        try {
            setDoctors(prev => prev.map(d => d.id === updated.id ? { ...d, ...updated } : d));
        } catch (error) {
            console.error('Failed to update doctor:', error);
        }
    };

    const deleteDoctor = async (id) => {
        try {
            setDoctors(prev => prev.filter(d => d.id !== id));
        } catch (error) {
            console.error('Failed to delete doctor:', error);
        }
    };

    const updateDoctorAvailability = async (id, newStatus) => {
        try {
            await axios.put(`${API_URL}/doctors/me/status/`, { status: newStatus }, getAuthHeaders());
            setDoctors(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
        } catch (error) {
            console.error('Failed to update doctor availability:', error);
        }
    };


    // ════════════════════════════════
    //  ADMIN — APPOINTMENTS & TICKETS
    // ════════════════════════════════
    const updateAppointmentStatus = async (id, status) => {
        try {
            await axios.put(`${API_URL}/appointments/${id}/status/`, { status }, getAuthHeaders());
            setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
        } catch (error) {
            console.error('Failed to update appointment status:', error);
        }
    };

    const respondToTicket = async (id, response) => {
        try {
            await axios.put(`${API_URL}/tickets/${id}/respond/`, { response }, getAuthHeaders());
            setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'Responded', response } : t));
        } catch (error) {
            console.error('Failed to respond to ticket:', error);
        }
    };


    return (
        <DataContext.Provider value={{
            doctors, appointments, consultations, tickets, patients, notifications, loading,
            bookAppointment, cancelAppointment, rescheduleAppointment,
            addTicket, requestFollowUp,
            markRead, markAllRead,
            addDoctor, updateDoctor, deleteDoctor, updateDoctorAvailability,
            updateAppointmentStatus, respondToTicket,
            fetchDoctors, fetchAppointments, fetchConsultations, fetchTickets,
            fetchDoctorAppointments, refreshAllData,
        }}>
            {children}
        </DataContext.Provider>
    );
};
