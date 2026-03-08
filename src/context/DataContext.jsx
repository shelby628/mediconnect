import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialDoctors, initialAppointments, initialConsultations, initialTickets } from '../data/mockData';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const [doctors, setDoctors] = useState(initialDoctors);
    const [appointments, setAppointments] = useState(initialAppointments);
    const [consultations, setConsultations] = useState(initialConsultations);
    const [tickets, setTickets] = useState(initialTickets);
    const [notifications, setNotifications] = useState([
        { id: 1, title: "Appointment Approved", message: "Your appointment with Dr. Sarah Johnson is approved.", date: "2024-03-20", read: false },
        { id: 2, title: "New Message", message: "Admin responded to your support ticket TKT-001.", date: "2024-03-18", read: true }
    ]);

    const bookAppointment = (doctor, dateTime, notes) => {
        const newAppointment = {
            id: `APT-${Math.floor(Math.random() * 100000)}`,
            doctor: doctor.name,
            department: doctor.department,
            dateTime,
            notes,
            status: "Pending",
            type: "Upcoming"
        };
        setAppointments([...appointments, newAppointment]);
        addNotification("Appointment Booked", `Your booking for ${doctor.name} on ${dateTime.split('T')[0]} is pending approval.`, "appointment");
        return newAppointment;
    };

    const cancelAppointment = (id) => {
        setAppointments(appointments.map(a => a.id === id ? { ...a, status: "Cancelled", type: "Past" } : a));
        addNotification("Appointment Cancelled", `Appointment ${id} has been cancelled successfully.`, "appointment");
    };

    const rescheduleAppointment = (id, newDateTime) => {
        setAppointments(appointments.map(a => a.id === id ? { ...a, dateTime: newDateTime, status: "Pending" } : a));
        addNotification("Appointment Rescheduled", `Appointment ${id} has been rescheduled to ${newDateTime.split('T')[0]}.`, "appointment");
    };

    const addTicket = (ticket) => {
        const newTicket = { ...ticket, id: `TKT-${Math.floor(Math.random() * 1000)}`, status: "Pending", date: new Date().toISOString().split('T')[0] };
        setTickets([...tickets, newTicket]);
        addNotification("Support Ticket Submitted", `Your support ticket ${newTicket.id} has been received.`, "support");
    };

    const requestFollowUp = (doctor, date, time) => {
        const newRequest = {
            id: `FLW-${Math.floor(Math.random() * 1000)}`,
            doctor,
            dateTime: `${date}T${time}`,
            status: "Pending",
            type: "Follow-up"
        };
        // Mock tracking this
        addNotification("Follow-up Requested", `Your follow-up request with ${doctor} is pending.`, "consultation");
        return newRequest;
    };

    const addNotification = (title, message, type) => {
        const newNotif = {
            id: Date.now(),
            title,
            message,
            date: new Date().toISOString().split('T')[0],
            read: false,
            type
        };
        setNotifications([newNotif, ...notifications]);
    };

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const markRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    // Admin methods
    const updateAppointmentStatus = (id, status) => {
        setAppointments(appointments.map(a => a.id === id ? { ...a, status } : a));
        const apt = appointments.find(a => a.id === id);
        if (apt) addNotification(`Appointment ${status}`, `Your appointment with ${apt.doctor} is ${status.toLowerCase()}.`, "appointment");
    };

    const respondToTicket = (id, response) => {
        setTickets(tickets.map(t => t.id === id ? { ...t, status: "Responded" } : t));
        addNotification("Ticket Response", `Admin has responded to your ticket ${id}.`, "support");
    };

    const updateDoctorAvailability = (id, status) => {
        setDoctors(doctors.map(d => d.id === id ? { ...d, status } : d));
    };

    return (
        <DataContext.Provider value={{
            doctors, appointments, consultations, tickets, notifications,
            bookAppointment, cancelAppointment, rescheduleAppointment, addTicket, requestFollowUp,
            markAllRead, markRead, updateAppointmentStatus, respondToTicket, updateDoctorAvailability
        }}>
            {children}
        </DataContext.Provider>
    );
};
