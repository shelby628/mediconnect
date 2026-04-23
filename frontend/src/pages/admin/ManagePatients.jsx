import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Search, UserX, Eye, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ManagePatients = () => {
    const { patients } = useData();
    const [search, setSearch] = useState('');
    const [viewPatient, setViewPatient] = useState(null);
    const [deactivated, setDeactivated] = useState([]);

    // ✅ Backend returns 'name' not 'fullName'
    const filtered = (patients || []).filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.phone?.toLowerCase().includes(search.toLowerCase())
    );

    const toggleDeactivate = (id) => setDeactivated(prev =>
        prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 6 }}>Manage Patients</h1>
                    <p style={{ color: '#6B6460', fontSize: '1rem' }}>View and manage all registered patients</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', height: 46, background: '#fff', border: '1.5px solid #E8E2DC', borderRadius: 10, minWidth: 260 }}>
                    <Search size={16} color="#6B6460" />
                    <input type="text" placeholder="Search patients..." value={search} onChange={e => setSearch(e.target.value)}
                        style={{ border: 'none', outline: 'none', background: 'none', fontSize: '0.875rem', fontWeight: 500, width: '100%', fontFamily: 'inherit' }} />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 32 }}>
                {[
                    { label: 'Total Patients', value: (patients || []).length, color: '#6D2932', bg: '#F5E6E8' },
                    { label: 'Active', value: (patients || []).length - deactivated.length, color: '#065F46', bg: '#ECFDF5' },
                    { label: 'Deactivated', value: deactivated.length, color: '#B91C1C', bg: '#FEF2F2' },
                ].map(s => (
                    <div key={s.label} style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', border: '1px solid #E8E2DC', display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ width: 48, height: 48, background: s.bg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '1.4rem', fontWeight: 900, color: s.color }}>{s.value}</span>
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6B6460', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</span>
                    </div>
                ))}
            </div>

            <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #E8E2DC', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead style={{ background: '#FAF7F4', borderBottom: '2px solid #E8E2DC' }}>
                        <tr>{['Patient', 'Phone', 'Status', 'Actions'].map(h => (
                            <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6B6460' }}>{h}</th>
                        ))}</tr>
                    </thead>
                    <tbody>
                        {filtered.length > 0 ? filtered.map((p, i) => {
                            const isDeactivated = deactivated.includes(p.id);
                            // ✅ Backend returns 'name' field
                            const displayName = p.name || p.full_name || 'Unknown';
                            return (
                                <motion.tr layout key={p.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F2EDE8' : 'none', opacity: isDeactivated ? 0.5 : 1 }}>
                                    <td style={{ padding: '16px 20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#F5E6E8', color: '#6D2932', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>
                                                {displayName.charAt(0).toUpperCase()}
                                            </div>
                                            <span style={{ fontWeight: 700 }}>{displayName}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 20px', color: '#6B6460' }}>{p.phone || '—'}</td>
                                    <td style={{ padding: '16px 20px' }}>
                                        <span style={{ padding: '4px 12px', borderRadius: 100, fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', background: isDeactivated ? '#FEF2F2' : '#ECFDF5', color: isDeactivated ? '#B91C1C' : '#065F46' }}>
                                            {isDeactivated ? 'Deactivated' : 'Active'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 20px' }}>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button onClick={() => setViewPatient(p)} style={{ width: 34, height: 34, borderRadius: 8, background: '#F4F0EB', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6B6460' }}
                                                onMouseEnter={e => { e.currentTarget.style.background = '#F5E6E8'; e.currentTarget.style.color = '#6D2932'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = '#F4F0EB'; e.currentTarget.style.color = '#6B6460'; }}
                                            ><Eye size={15} /></button>
                                            <button onClick={() => toggleDeactivate(p.id)} style={{ width: 34, height: 34, borderRadius: 8, background: isDeactivated ? '#ECFDF5' : '#FEF2F2', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: isDeactivated ? '#065F46' : '#B91C1C' }}>
                                                <UserX size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            );
                        }) : (
                            <tr><td colSpan={4} style={{ padding: '48px 20px', textAlign: 'center', color: '#6B6460' }}>No patients found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <AnimatePresence>
                {viewPatient && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewPatient(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }} style={{ background: '#fff', borderRadius: 28, padding: 40, width: '100%', maxWidth: 440, position: 'relative', boxShadow: '0 24px 60px rgba(0,0,0,0.15)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                                <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Patient Profile</h2>
                                <button onClick={() => setViewPatient(null)} style={{ background: '#F4F0EB', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
                                <div style={{ width: 72, height: 72, background: '#F5E6E8', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6D2932', fontWeight: 900, fontSize: '1.8rem', marginBottom: 12 }}>
                                    {(viewPatient.name || viewPatient.full_name || '?').charAt(0).toUpperCase()}
                                </div>
                                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{viewPatient.name || viewPatient.full_name}</div>
                                <div style={{ color: '#6B6460', fontSize: '0.85rem' }}>{viewPatient.phone}</div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                {[
                                    { label: 'Phone', value: viewPatient.phone },
                                    { label: 'National ID', value: viewPatient.national_id },
                                ].map(f => (
                                    <div key={f.label} style={{ background: '#FAF7F4', borderRadius: 12, padding: '14px 16px' }}>
                                        <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6B6460', marginBottom: 4 }}>{f.label}</div>
                                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{f.value || '—'}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManagePatients;
