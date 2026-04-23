import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { ClipboardList } from 'lucide-react';
import { motion } from 'framer-motion';

const DoctorConsultations = () => {
    const { consultations } = useData();
    const { user } = useAuth();
    const [filter, setFilter] = useState('All');

    // ✅ Backend already filters consultations by doctor — just use directly
    const myConsultations = consultations;

    const filtered = filter === 'All'
        ? myConsultations
        : myConsultations.filter(c => c.status === filter);

    const formatDate = (dt) => {
        if (!dt) return '—';
        return new Date(dt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const statusStyle = (s) => {
        const map = {
            Pending: { bg: '#FFF7ED', color: '#C2410C' },
            Active: { bg: '#ECFDF5', color: '#065F46' },
            Closed: { bg: '#F4F0EB', color: '#6B6460' },
            Completed: { bg: '#EFF6FF', color: '#1D4ED8' },
        };
        return map[s] || { bg: '#F4F0EB', color: '#6B6460' };
    };

    return (
        <div>
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 6, color: '#1A1310' }}>Consultations</h1>
                <p style={{ color: '#6B6460', fontSize: '1rem' }}>View and manage your patient consultations</p>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 32 }}>
                {[
                    { label: 'Total', value: myConsultations.length, color: '#6D2932', bg: '#F5E6E8' },
                    { label: 'Active', value: myConsultations.filter(c => c.status === 'Active' || c.status === 'Pending').length, color: '#065F46', bg: '#ECFDF5' },
                    { label: 'Completed', value: myConsultations.filter(c => c.status === 'Completed' || c.status === 'Closed').length, color: '#1D4ED8', bg: '#EFF6FF' },
                ].map(s => (
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
                {['All', 'Pending', 'Active', 'Completed', 'Closed'].map(f => (
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
                        <ClipboardList size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                        <p style={{ fontWeight: 600 }}>No consultations found</p>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                        <thead style={{ background: '#FAF7F4', borderBottom: '2px solid #E8E2DC' }}>
                            <tr>{['Patient', 'Date', 'Notes', 'Follow Up', 'Status'].map(h => (
                                <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6B6460' }}>{h}</th>
                            ))}</tr>
                        </thead>
                        <tbody>
                            {filtered.map((c, i) => {
                                const st = statusStyle(c.status);
                                // ✅ patient_name is a flat field from ConsultationSerializer
                                const patientName = c.patient_name || 'Patient';
                                return (
                                    <motion.tr layout key={c.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F2EDE8' : 'none' }}>
                                        <td style={{ padding: '16px 20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div style={{ width: 34, height: 34, borderRadius: 9, background: '#F5E6E8', color: '#6D2932', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', flexShrink: 0 }}>
                                                    {patientName.charAt(0).toUpperCase()}
                                                </div>
                                                <span style={{ fontWeight: 600 }}>{patientName}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 20px', color: '#6B6460' }}>
                                            {formatDate(c.created_at)}
                                        </td>
                                        <td style={{ padding: '16px 20px', color: '#6B6460', maxWidth: 240 }}>
                                            <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {c.notes || '—'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <span style={{
                                                padding: '4px 12px', borderRadius: 100, fontSize: '0.68rem', fontWeight: 800,
                                                background: c.follow_up ? '#ECFDF5' : '#F4F0EB',
                                                color: c.follow_up ? '#065F46' : '#6B6460',
                                            }}>
                                                {c.follow_up ? 'Yes' : 'No'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <span style={{ padding: '4px 12px', borderRadius: 100, fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', background: st.bg, color: st.color }}>
                                                {c.status || 'Completed'}
                                            </span>
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

export default DoctorConsultations;
