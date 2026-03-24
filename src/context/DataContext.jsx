import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const DataContext = createContext();
export const useData = () => useContext(DataContext);

const API_URL = 'http://localhost:8000/api';

export const DataProvider = ({ children }) => {
    const { user } = useAuth();

    // ── Get auth headers ──
    const getAuthHeaders = () => {
        // First try axios defaults (most reliable)
        const axiosToken = axios.defaults.headers.common['Authorization'];
        if (axiosToken) {
            console.log('✅ Using axios default token');
            return { headers: { 'Authorization': axiosToken } };
        }

        // Fall back to localStorage
        const token = localStorage.getItem('access_token');
        if (!token || token === 'null' || token === 'undefined') {
            console.error('❌ No valid token found anywhere!');
            return {};
        }

        // Set it in axios too
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('✅ Using localStorage token');
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
        // Always fetch doctors (public)
        fetchDoctors();

        const token = localStorage.getItem('access_token');
        const validToken = token && token !== 'null' && token !== 'undefined';

        console.log('useEffect — user:', user?.fullName, '| token valid:', !!validToken);

        if (!user || !validToken) {
            setAppointments([]);
            setConsultations([]);
            setTickets([]);
            setPatients([]);
            setNotifications([]);
            return;
        }

        // Make sure axios has the token
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Delay slightly to ensure everything is set
        const timer = setTimeout(() => {
            console.log('🔄 Fetching user data...');
            fetchAppointments();
            fetchConsultations();
            fetchTickets();

            if (user.role === 'admin') {
                fetchAllPatients();
            }
        }, 300);

        return () => clearTimeout(timer);

    }, [user]);


    // ════════════════════════════════
    //  REFRESH ALL DATA (called after login)
    // ════════════════════════════════

    const refreshAllData = (token) => {
        const headers = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        console.log('🔄 refreshAllData called with token:', token?.substring(0, 30) + '...');

        // Set in axios defaults immediately
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Doctors are public
        axios.get(`${API_URL}/doctors/`)
            .then(res => setDoctors(res.data))
            .catch(err => console.error('Doctors error:', err));

        // User specific data
        axios.get(`${API_URL}/appointments/`, headers)
            .then(res => {
                console.log('✅ Appointments loaded:', res.data.length);
                setAppointments(res.data);
            })
            .catch(err => console.error('Appointments error:', err));

        axios.get(`${API_URL}/consultations/`, headers)
            .then(res => setConsultations(res.data))
            .catch(err => console.error('Consultations error:', err));

        axios.get(`${API_URL}/tickets/`, headers)
            .then(res => setTickets(res.data))
            .catch(err => console.error('Tickets error:', err));

        // If admin fetch patients too
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            if (parsedUser.role === 'admin') {
                axios.get(`${API_URL}/admin/patients/`, headers)
                    .then(res => setPatients(res.data))
                    .catch(err => console.error('Patients error:', err));
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
            console.log('✅ Appointments:', res.data);
            setAppointments(res.data);
        } catch (error) {
            console.error('Failed to fetch appointments:', error);
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
            id: Date.now(),
            title,
            message,
            type,
            date: new Date().toISOString().split('T')[0],
            read: false
        }, ...prev]);
    };

    const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));


    // ════════════════════════════════
    //  APPOINTMENTS
    // ════════════════════════════════

    const bookAppointment = async (doctor, dateTime, notes) => {
        try {
            console.log('📅 Booking appointment...');
            console.log('Doctor:', doctor);
            console.log('Headers:', getAuthHeaders());

            const res = await axios.post(`${API_URL}/appointments/`, {
                doctor: doctor.id,
                date_time: dateTime,
                notes: notes,
                status: 'Pending',
                type: 'Upcoming'
            }, getAuthHeaders());

            console.log('✅ Appointment booked:', res.data);
            setAppointments(prev => [...prev, res.data]);
            addNotification(
                'Appointment Booked',
                `Your booking with ${doctor.name} is pending approval.`,
                'appointment'
            );
            return res.data;

        } catch (error) {
            console.error('❌ Failed to book appointment:', error.response?.data || error);
        }
    };

    const cancelAppointment = async (id) => {
        try {
            await axios.put(`${API_URL}/appointments/${id}/`, {
                status: 'Cancelled',
                type: 'Past'
            }, getAuthHeaders());

            setAppointments(prev =>
                prev.map(a => a.id === id
                    ? { ...a, status: 'Cancelled', type: 'Past' }
                    : a
                )
            );
            addNotification(
                'Appointment Cancelled',
                `Appointment has been cancelled.`,
                'appointment'
            );

        } catch (error) {
            console.error('Failed to cancel appointment:', error);
        }
    };

    const rescheduleAppointment = async (id, newDateTime) => {
        try {
            await axios.put(`${API_URL}/appointments/${id}/`, {
                date_time: newDateTime,
                status: 'Pending'
            }, getAuthHeaders());

            setAppointments(prev =>
                prev.map(a => a.id === id
                    ? { ...a, date_time: newDateTime, status: 'Pending' }
                    : a
                )
            );
            addNotification(
                'Appointment Rescheduled',
                `Your appointment has been rescheduled.`,
                'appointment'
            );

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
            addNotification(
                'Support Ticket Submitted',
                `Ticket has been received.`,
                'support'
            );
            return res.data;

        } catch (error) {
            console.error('Failed to add ticket:', error);
        }
    };


    // ════════════════════════════════
    //  CONSULTATIONS
    // ════════════════════════════════

    const requestFollowUp = async (doctor, date, time) => {
        addNotification(
            'Follow-up Requested',
            `Your follow-up with ${doctor} is pending.`,
            'consultation'
        );
    };


    // ════════════════════════════════
    //  ADMIN — DOCTORS
    // ════════════════════════════════

    const addDoctor = async (doctor) => {
        try {
            const res = await axios.post(
                `${API_URL}/doctors/add/`,
                doctor,
                getAuthHeaders()
            );
            setDoctors(prev => [...prev, res.data]);
        } catch (error) {
            console.error('Failed to add doctor:', error);
        }
    };

    const updateDoctor = async (updated) => {
        try {
            const res = await axios.put(
                `${API_URL}/doctors/${updated.id}/`,
                updated,
                getAuthHeaders()
            );
            setDoctors(prev => prev.map(d => d.id === updated.id ? res.data : d));
        } catch (error) {
            console.error('Failed to update doctor:', error);
        }
    };

    const deleteDoctor = async (id) => {
        try {
            await axios.delete(`${API_URL}/doctors/${id}/`, getAuthHeaders());
            setDoctors(prev => prev.filter(d => d.id !== id));
        } catch (error) {
            console.error('Failed to delete doctor:', error);
        }
    };

    const updateDoctorAvailability = async (id, status) => {
        try {
            const res = await axios.put(
                `${API_URL}/doctors/${id}/`,
                { status },
                getAuthHeaders()
            );
            setDoctors(prev => prev.map(d => d.id === id ? res.data : d));
        } catch (error) {
            console.error('Failed to update doctor availability:', error);
        }
    };


    // ════════════════════════════════
    //  ADMIN — APPOINTMENTS & TICKETS
    // ════════════════════════════════

    const updateAppointmentStatus = async (id, status) => {
        try {
            await axios.put(
                `${API_URL}/appointments/${id}/`,
                { status },
                getAuthHeaders()
            );
            setAppointments(prev =>
                prev.map(a => a.id === id ? { ...a, status } : a)
            );
        } catch (error) {
            console.error('Failed to update appointment status:', error);
        }
    };

    const respondToTicket = async (id) => {
        try {
            await axios.put(
                `${API_URL}/tickets/${id}/`,
                { status: 'Responded' },
                getAuthHeaders()
            );
            setTickets(prev =>
                prev.map(t => t.id === id ? { ...t, status: 'Responded' } : t)
            );
        } catch (error) {
            console.error('Failed to respond to ticket:', error);
        }
    };


    return (
        <DataContext.Provider value={{
            // Data
            doctors,
            appointments,
            consultations,
            tickets,
            patients,
            notifications,
            loading,

            // Appointments
            bookAppointment,
            cancelAppointment,
            rescheduleAppointment,

            // Tickets
            addTicket,

            // Consultations
            requestFollowUp,

            // Notifications
            markRead,
            markAllRead,

            // Admin — Doctors
            addDoctor,
            updateDoctor,
            deleteDoctor,
            updateDoctorAvailability,

            // Admin — Appointments & Tickets
            updateAppointmentStatus,
            respondToTicket,

            // Refresh functions
            fetchDoctors,
            fetchAppointments,
            fetchConsultations,
            fetchTickets,
            refreshAllData,
        }}>
            {children}
        </DataContext.Provider>
    );
};