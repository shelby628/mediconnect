import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { CalendarDays, Clock, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const statusStyle = (s) => {
    const map = {
        Pending: { bg: '#FFF7ED', color: '#C2410C', label: 'Pending' },
        Approved: { bg: '#ECFDF5', color: '#065F46', label: 'Approved' },
        Cancelled: { bg: '#FEF2F2', color: '#B91C1C', label: 'Cancelled' },
        Completed: { bg: '#EFF6FF', color: '#1D4ED8', label: 'Completed' },
    };
    return map[s] || { bg: '#F4F0EB', color: '#6B6460', label: s };
};

const DoctorAppointments = () => {
    const { appointments, updateAppointmentStatus } = useData();
    const { user } = useAuth();
    const [filter, setFilter] = useState('All');

    // Filter appointments for this doctor
    const myAppointments = appointments;

    const filtered = filter === 'All' ? myAppointments : myAppointments.filter(a => a.status === filter);

    const stats = [
        { label: 'Total', value: myAppointments.length, color: '#6D2932', bg: '#F5E6E8' },
        { label: 'Pending', value: myAppointments.filter(a => a.status === 'Pending').length, color: '#C2410C', bg: '#FFF7ED' },
        { label: 'Approved', value: myAppointments.filter(a => a.status === 'Approved').length, color: '#065F46', bg: '#ECFDF5' },
        { label: 'Completed', value: myAppointments.filter(a => a.status === 'Completed').length, color: '#1D4ED8', bg: '#EFF6FF' },
    ];

    const formatDate = (dt) => {
        if (!dt) return '—';
        const d = new Date(dt);
        return d.toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    };

    const formatTime = (dt) => {
        if (!dt) return '—';
        const d = new Date(dt);
        return d.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div>
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 6, color: '#1A1310' }}>My Appointments</h1>
                <p style={{ color: '#6B6460', fontSize: '1rem' }}>Manage and update your patient appointments</p>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 32 }}>
                {stats.map(s => (
                    <div key={s.label} style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', border: '1px solid #E8E2DC', display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ width: 48, height: 48, background: s.bg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '1.4rem', fontWeight: 900, color: s.color }}>{s.value}</span>
                        </div>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#6B6460', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</span>
                    </div>
                ))}
            </div>

            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                {['All', 'Pending', 'Approved', 'Completed', 'Cancelled'].map(f => (
                    <button key={f} onClick={() => setFilter(f)} style={{
                        padding: '7px 18px', borderRadius: 50, border: 'none', cursor: 'pointer',
                        fontSize: '0.82rem', fontWeight: 700, fontFamily: 'inherit',
                        background: filter === f ? '#6D2932' : '#F4F0EB',
                        color: filter === f ? '#fff' : '#6B6460',
                        transition: 'all 0.18s'
                    }}>{f}</button>
                ))}
            </div>

            {/* Table */}
            <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #E8E2DC', overflow: 'hidden' }}>
                {filtered.length === 0 ? (
                    <div style={{ padding: 60, textAlign: 'center', color: '#6B6460' }}>
                        <CalendarDays size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                        <p style={{ fontWeight: 600 }}>No appointments found</p>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                        <thead style={{ background: '#FAF7F4', borderBottom: '2px solid #E8E2DC' }}>
                            <tr>{['Patient', 'Date', 'Time', 'Notes', 'Status', 'Actions'].map(h => (
                                <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6B6460' }}>{h}</th>
                            ))}</tr>
                        </thead>
                        <tbody>
                            {filtered.map((apt, i) => {
                                const st = statusStyle(apt.status);
                                const patientName = apt.patient_name || apt.patient?.full_name || 'Patient';
                                return (
                                    <motion.tr layout key={apt.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F2EDE8' : 'none' }}>
                                        <td style={{ padding: '16px 20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div style={{ width: 34, height: 34, borderRadius: 9, background: '#F5E6E8', color: '#6D2932', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', flexShrink: 0 }}>
                                                    {patientName.charAt(0).toUpperCase()}
                                                </div>
                                                <span style={{ fontWeight: 600 }}>{patientName}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 20px', color: '#6B6460' }}>{formatDate(apt.date_time)}</td>
                                        <td style={{ padding: '16px 20px', color: '#6B6460' }}>{formatTime(apt.date_time)}</td>
                                        <td style={{ padding: '16px 20px', color: '#6B6460', maxWidth: 180 }}>
                                            <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {apt.notes || '—'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <span style={{ padding: '4px 12px', borderRadius: 100, fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', background: st.bg, color: st.color }}>{st.label}</span>
                                        </td>
                                        <td style={{ padding: '16px 20px' }}>
                                            {apt.status === 'Pending' && (
                                                <div style={{ display: 'flex', gap: 8 }}>
                                                    <button onClick={() => updateAppointmentStatus(apt.id, 'Approved')}
                                                        style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, border: 'none', background: '#ECFDF5', color: '#065F46', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                                                        <CheckCircle size={13} /> Approve
                                                    </button>
                                                    <button onClick={() => updateAppointmentStatus(apt.id, 'Cancelled')}
                                                        style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, border: 'none', background: '#FEF2F2', color: '#B91C1C', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                                                        <XCircle size={13} /> Decline
                                                    </button>
                                                </div>
                                            )}
                                            {apt.status === 'Approved' && (
                                                <button onClick={() => updateAppointmentStatus(apt.id, 'Completed')}
                                                    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px', borderRadius: 8, border: 'none', background: '#EFF6FF', color: '#581369', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                                                    <CheckCircle size={13} /> Mark Done
                                                </button>
                                            )}
                                            {(apt.status === 'Cancelled' || apt.status === 'Completed') && (
                                                <span style={{ color: '#C4B8A8', fontSize: '0.8rem' }}>—</span>
                                            )}
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default DoctorAppointments;
