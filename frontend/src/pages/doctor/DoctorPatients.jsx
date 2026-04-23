import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Users, Search } from 'lucide-react';

const DoctorPatients = () => {
    const { appointments } = useData();
    const { user } = useAuth();
    const [search, setSearch] = useState('');

    // Derive unique patients from this doctor's appointments
    const myAppointments = appointments;


    const uniquePatients = Object.values(
        myAppointments.reduce((acc, apt) => {
            const pid = apt.patient;                    // ✅ it's just a number ID
            const name = apt.patient_name || 'Unknown'; // ✅ flat field from serializer

            if (!pid) return acc;

            if (!acc[pid]) {
                acc[pid] = {
                    id: pid,
                    name,
                    totalVisits: 0,
                    lastVisit: null,
                    status: apt.status,
                };
            }

            acc[pid].totalVisits += 1;

            const dt = apt.date_time ? new Date(apt.date_time) : null;
            if (dt && (!acc[pid].lastVisit || dt > new Date(acc[pid].lastVisit))) {
                acc[pid].lastVisit = apt.date_time;
                acc[pid].status = apt.status;
            }

            return acc;
        }, {})
    );


    const filtered = uniquePatients.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    const formatDate = (dt) => {
        if (!dt) return '—';
        return new Date(dt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div>
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 6, color: '#1A1310' }}>My Patients</h1>
                <p style={{ color: '#6B6460', fontSize: '1rem' }}>Patients who have booked appointments with you</p>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 32 }}>
                {[
                    { label: 'Total Patients', value: uniquePatients.length, color: '#6D2932', bg: '#F5E6E8' },
                    { label: 'This Month', value: uniquePatients.filter(p => p.lastVisit && new Date(p.lastVisit).getMonth() === new Date().getMonth()).length, color: '#065F46', bg: '#ECFDF5' },
                    { label: 'Total Visits', value: myAppointments.filter(a => a.status === 'Completed').length, color: '#1D4ED8', bg: '#EFF6FF' },
                ].map(s => (
                    <div key={s.label} style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', border: '1px solid #E8E2DC', display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ width: 48, height: 48, background: s.bg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '1.4rem', fontWeight: 900, color: s.color }}>{s.value}</span>
                        </div>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#6B6460', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</span>
                    </div>
                ))}
            </div>

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: 20, maxWidth: 360 }}>
                <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#A89A8A' }} />
                <input
                    type="text"
                    placeholder="Search patients..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ width: '100%', height: 44, paddingLeft: 40, paddingRight: 16, background: '#fff', border: '1.5px solid #E8E2DC', borderRadius: 10, fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', color: '#1A1310' }}
                />
            </div>

            {/* Patient cards */}
            {filtered.length === 0 ? (
                <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #E8E2DC', padding: 60, textAlign: 'center', color: '#6B6460' }}>
                    <Users size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                    <p style={{ fontWeight: 600 }}>No patients found</p>
                </div>
            ) : (
                <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #E8E2DC', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                        <thead style={{ background: '#FAF7F4', borderBottom: '2px solid #E8E2DC' }}>
                            <tr>{['Patient', 'Total Visits', 'Last Visit', 'Last Status'].map(h => (
                                <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6B6460' }}>{h}</th>
                            ))}</tr>
                        </thead>
                        <tbody>
                            {filtered.map((p, i) => (
                                <tr key={p.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F2EDE8' : 'none' }}>
                                    <td style={{ padding: '16px 20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{ width: 38, height: 38, borderRadius: 10, background: '#F5E6E8', color: '#6D2932', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>
                                                {p.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span style={{ fontWeight: 700 }}>{p.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 20px', color: '#6B6460' }}>{p.totalVisits}</td>
                                    <td style={{ padding: '16px 20px', color: '#6B6460' }}>{formatDate(p.lastVisit)}</td>
                                    <td style={{ padding: '16px 20px' }}>
                                        <span style={{
                                            padding: '4px 12px', borderRadius: 100, fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase',
                                            background: p.status === 'Completed' ? '#ECFDF5' : p.status === 'Approved' ? '#EFF6FF' : '#FFF7ED',
                                            color: p.status === 'Completed' ? '#065F46' : p.status === 'Approved' ? '#1D4ED8' : '#C2410C',
                                        }}>{p.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default DoctorPatients;
