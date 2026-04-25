import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const DataContext = createContext();
export const useData = () => useContext(DataContext);

const API_URL = import.meta.env.VITE_API_URL;

// ── AUTH HEADERS ──
const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');

    if (!token || token === 'null' || token === 'undefined') {
        console.error('❌ No valid token found!');
        return {};
    }

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const DataProvider = ({ children }) => {
    const { user, logout } = useAuth();

    // ── STATE ──
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [consultations, setConsultations] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [patients, setPatients] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    // ── FETCH DOCTORS (public) ──
    const fetchDoctors = async () => {
        try {
            const res = await axios.get(`${API_URL}/doctors/`);
            setDoctors(res.data);
        } catch (error) {
            console.error('Failed to fetch doctors:', error);
        }
    };

    // ── FETCH USER DATA ──
    const fetchAppointments = async () => {
        try {
            const res = await axios.get(`${API_URL}/appointments/`, getAuthHeaders());
            setAppointments(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchDoctorAppointments = async () => {
        try {
            const res = await axios.get(
                `${API_URL}/doctors/me/appointments/`,
                getAuthHeaders()
            );
            setAppointments(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchConsultations = async () => {
        try {
            const res = await axios.get(`${API_URL}/consultations/`, getAuthHeaders());
            setConsultations(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchTickets = async () => {
        try {
            const res = await axios.get(`${API_URL}/tickets/`, getAuthHeaders());
            setTickets(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchAllPatients = async () => {
        try {
            const res = await axios.get(`${API_URL}/admin/patients/`, getAuthHeaders());
            setPatients(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    // ── LOAD ALL DATA ──
    const loadData = async () => {
        if (!user) return;

        await fetchDoctors();

        if (user.role === 'doctor') {
            await fetchDoctorAppointments();
        } else {
            await fetchAppointments();
        }

        await fetchConsultations();
        await fetchTickets();

        if (user.role === 'admin') {
            await fetchAllPatients();
        }
    };

    // ── AUTO LOAD ON LOGIN ──
    useEffect(() => {
        loadData();
    }, [user]);

    // ── NOTIFICATIONS ──
    const addNotification = (title, message, type) => {
        setNotifications(prev => [
            {
                id: Date.now(),
                title,
                message,
                type,
                date: new Date().toISOString().split('T')[0],
                read: false
            },
            ...prev
        ]);
    };

    const markRead = (id) =>
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, read: true } : n))
        );

    const markAllRead = () =>
        setNotifications(prev =>
            prev.map(n => ({ ...n, read: true }))
        );

    // ── APPOINTMENTS ──
    const bookAppointment = async (doctor, dateTime, notes) => {
        try {
            const res = await axios.post(
                `${API_URL}/appointments/`,
                {
                    doctor: doctor.id,
                    date_time: dateTime,
                    notes
                },
                getAuthHeaders()
            );

            setAppointments(prev => [...prev, res.data]);

            addNotification(
                'Appointment Booked',
                `Booking with Dr. ${doctor.full_name} pending approval.`,
                'appointment'
            );

            return res.data;
        } catch (error) {
            console.error(error);
        }
    };

    const cancelAppointment = async (id) => {
        try {
            await axios.put(
                `${API_URL}/appointments/${id}/status/`,
                { status: 'Cancelled' },
                getAuthHeaders()
            );

            setAppointments(prev =>
                prev.map(a =>
                    a.id === id ? { ...a, status: 'Cancelled' } : a
                )
            );
        } catch (error) {
            console.error(error);
        }
    };

    const rescheduleAppointment = async (id, newDateTime) => {
        try {
            await axios.put(
                `${API_URL}/appointments/${id}/`,
                { date_time: newDateTime },
                getAuthHeaders()
            );

            setAppointments(prev =>
                prev.map(a =>
                    a.id === id
                        ? { ...a, date_time: newDateTime, status: 'Pending' }
                        : a
                )
            );
        } catch (error) {
            console.error(error);
        }
    };

    // ── TICKETS ──
    const addTicket = async (ticket) => {
        try {
            const res = await axios.post(
                `${API_URL}/tickets/`,
                ticket,
                getAuthHeaders()
            );

            setTickets(prev => [...prev, res.data]);
            return res.data;
        } catch (error) {
            console.error(error);
        }
    };

    // ── ADMIN ──
    const updateAppointmentStatus = async (id, status) => {
        try {
            await axios.put(
                `${API_URL}/appointments/${id}/status/`,
                { status },
                getAuthHeaders()
            );

            setAppointments(prev =>
                prev.map(a =>
                    a.id === id ? { ...a, status } : a
                )
            );
        } catch (error) {
            console.error(error);
        }
    };

    const respondToTicket = async (id, response) => {
        try {
            await axios.put(
                `${API_URL}/tickets/${id}/respond/`,
                { response },
                getAuthHeaders()
            );

            setTickets(prev =>
                prev.map(t =>
                    t.id === id
                        ? { ...t, status: 'Responded', response }
                        : t
                )
            );
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <DataContext.Provider
            value={{
                doctors,
                appointments,
                consultations,
                tickets,
                patients,
                notifications,
                loading,

                bookAppointment,
                cancelAppointment,
                rescheduleAppointment,
                addTicket,

                markRead,
                markAllRead,

                updateAppointmentStatus,
                respondToTicket,

                fetchDoctors,
                loadData
            }}
        >
            {children}
        </DataContext.Provider>
    );
};