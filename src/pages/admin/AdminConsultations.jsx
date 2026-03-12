import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Search, Eye, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminConsultations = () => {
    const { consultations } = useData();
    const [search, setSearch] = useState('');
    const [viewing, setViewing] = useState(null);

    const filtered = (consultations || []).filter(c =>
        c.doctor?.toLowerCase().includes(search.toLowerCase()) ||
        c.department?.toLowerCase().includes(search.toLowerCase()) ||
        c.id?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 6 }}>Consultations</h1>
                    <p style={{ color: '#6B6460', fontSize: '1rem' }}>View all patient consultation records</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', height: 46, background: '#fff', border: '1.5px solid #E8E2DC', borderRadius: 10, minWidth: 260 }}>
                    <Search size={16} color="#6B6460" />
                    <input type="text" placeholder="Search by doctor or department..." value={search} onChange={e => setSearch(e.target.value)}
                        style={{ border: 'none', outline: 'none', background: 'none', fontSize: '0.875rem', fontWeight: 500, width: '100%', fontFamily: 'inherit' }} />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 32 }}>
                {[
                    { label: 'Total Records', value: (consultations || []).length, color: '#6D2932', bg: '#F5E6E8' },
                    { label: 'Follow-up Required', value: (consultations || []).filter(c => c.followUp === 'Yes').length, color: '#C2410C', bg: '#FFF7ED' },
                    { label: 'No Follow-up', value: (consultations || []).filter(c => c.followUp !== 'Yes').length, color: '#1D4ED8', bg: '#EFF6FF' },
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
                        <tr>{['ID', 'Doctor', 'Department', 'Date', 'Follow-up', 'Actions'].map(h => (
                            <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6B6460' }}>{h}</th>
                        ))}</tr>
                    </thead>
                    <tbody>
                        {filtered.length > 0 ? filtered.map((c, i) => (
                            <motion.tr layout key={c.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F2EDE8' : 'none' }}>
                                <td style={{ padding: '16px 20px' }}><span style={{ fontFamily: 'monospace', fontSize: '0.8rem', background: '#F4F0EB', padding: '3px 8px', borderRadius: 6, fontWeight: 700 }}>{c.id}</span></td>
                                <td style={{ padding: '16px 20px', fontWeight: 700 }}>{c.doctor}</td>
                                <td style={{ padding: '16px 20px', color: '#6B6460' }}>{c.department}</td>
                                <td style={{ padding: '16px 20px', color: '#6B6460' }}>{c.date}</td>
                                <td style={{ padding: '16px 20px' }}>
                                    <span style={{ padding: '4px 12px', borderRadius: 100, fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', background: c.followUp === 'Yes' ? '#FFF7ED' : '#EFF6FF', color: c.followUp === 'Yes' ? '#C2410C' : '#1D4ED8' }}>
                                        {c.followUp === 'Yes' ? 'Required' : 'None'}
                                    </span>
                                </td>
                                <td style={{ padding: '16px 20px' }}>
                                    <button onClick={() => setViewing(c)} style={{ width: 34, height: 34, borderRadius: 8, background: '#F4F0EB', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6B6460' }}
                                        onMouseEnter={e => { e.currentTarget.style.background = '#F5E6E8'; e.currentTarget.style.color = '#6D2932'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = '#F4F0EB'; e.currentTarget.style.color = '#6B6460'; }}
                                    ><Eye size={15} /></button>
                                </td>
                            </motion.tr>
                        )) : (
                            <tr><td colSpan={6} style={{ padding: '48px 20px', textAlign: 'center', color: '#6B6460' }}>No consultations found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <AnimatePresence>
                {viewing && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewing(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }} style={{ background: '#fff', borderRadius: 28, padding: 40, width: '100%', maxWidth: 460, position: 'relative', boxShadow: '0 24px 60px rgba(0,0,0,0.15)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                                <div>
                                    <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Consultation Record</h2>
                                    <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#6B6460' }}>{viewing.id}</span>
                                </div>
                                <button onClick={() => setViewing(null)} style={{ background: '#F4F0EB', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
                                {[{ label: 'Doctor', value: viewing.doctor }, { label: 'Department', value: viewing.department }, { label: 'Date', value: viewing.date }, { label: 'Follow-up', value: viewing.followUp === 'Yes' ? 'Required' : 'None' }].map(f => (
                                    <div key={f.label} style={{ background: '#FAF7F4', borderRadius: 12, padding: '14px 16px' }}>
                                        <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6B6460', marginBottom: 4 }}>{f.label}</div>
                                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{f.value}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ background: '#FAF7F4', borderRadius: 12, padding: 16 }}>
                                <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6B6460', marginBottom: 8 }}>Clinical Notes</div>
                                <p style={{ fontSize: '0.9rem', lineHeight: 1.7, fontWeight: 500 }}>{viewing.notes}</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminConsultations;
