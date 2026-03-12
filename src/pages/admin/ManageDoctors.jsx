import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { departments } from '../../data/mockData';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EMPTY = { name: '', department: 'Cardiology', specialty: '', status: 'Available' };

const ManageDoctors = () => {
    const { doctors, addDoctor, updateDoctor, deleteDoctor } = useData();
    const [showModal, setShowModal] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [confirmDelete, setConfirmDelete] = useState(null);

    const openAdd = () => { setEditTarget(null); setForm(EMPTY); setShowModal(true); };
    const openEdit = (doc) => { setEditTarget(doc); setForm({ name: doc.name, department: doc.department, specialty: doc.specialty, status: doc.status }); setShowModal(true); };

    const handleSubmit = (e) => {
        e.preventDefault();
        editTarget ? updateDoctor({ ...editTarget, ...form }) : addDoctor({ ...form, id: Date.now() });
        setShowModal(false);
    };

    const statusBg = (s) => s === 'Available' ? '#ECFDF5' : s === 'Fully Booked' ? '#FFF7ED' : '#FEF2F2';
    const statusColor = (s) => s === 'Available' ? '#065F46' : s === 'Fully Booked' ? '#C2410C' : '#B91C1C';

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 6 }}>Manage Doctors</h1>
                    <p style={{ color: '#6B6460', fontSize: '1rem' }}>Add, edit or remove doctors from the system</p>
                </div>
                <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px', background: '#6D2932', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(109,41,50,0.25)', fontFamily: 'inherit' }}>
                    <Plus size={18} /> Add Doctor
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 32 }}>
                {[
                    { label: 'Total Doctors', value: doctors.length, color: '#6D2932', bg: '#F5E6E8' },
                    { label: 'Available', value: doctors.filter(d => d.status === 'Available').length, color: '#065F46', bg: '#ECFDF5' },
                    { label: 'Unavailable', value: doctors.filter(d => d.status !== 'Available').length, color: '#B91C1C', bg: '#FEF2F2' },
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
                        <tr>{['Doctor', 'Department', 'Specialty', 'Status', 'Actions'].map(h => (
                            <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6B6460' }}>{h}</th>
                        ))}</tr>
                    </thead>
                    <tbody>
                        {doctors.map((doc, i) => (
                            <motion.tr layout key={doc.id} style={{ borderBottom: i < doctors.length - 1 ? '1px solid #F2EDE8' : 'none' }}>
                                <td style={{ padding: '16px 20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{ width: 38, height: 38, borderRadius: 10, background: '#F5E6E8', color: '#6D2932', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', flexShrink: 0 }}>
                                            {doc.name.split(' ').map(n => n[0]).join('').slice(0, 3)}
                                        </div>
                                        <span style={{ fontWeight: 700 }}>{doc.name}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '16px 20px', color: '#6B6460' }}>{doc.department}</td>
                                <td style={{ padding: '16px 20px', color: '#6B6460' }}>{doc.specialty}</td>
                                <td style={{ padding: '16px 20px' }}>
                                    <span style={{ padding: '4px 12px', borderRadius: 100, fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', background: statusBg(doc.status), color: statusColor(doc.status) }}>{doc.status}</span>
                                </td>
                                <td style={{ padding: '16px 20px' }}>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button onClick={() => openEdit(doc)} style={{ width: 34, height: 34, borderRadius: 8, background: '#F4F0EB', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6B6460' }}
                                            onMouseEnter={e => { e.currentTarget.style.background = '#F5E6E8'; e.currentTarget.style.color = '#6D2932'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = '#F4F0EB'; e.currentTarget.style.color = '#6B6460'; }}
                                        ><Pencil size={15} /></button>
                                        <button onClick={() => setConfirmDelete(doc)} style={{ width: 34, height: 34, borderRadius: 8, background: '#FEF2F2', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#B91C1C' }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#FEE2E2'}
                                            onMouseLeave={e => e.currentTarget.style.background = '#FEF2F2'}
                                        ><Trash2 size={15} /></button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AnimatePresence>
                {showModal && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} style={{ background: '#fff', borderRadius: 28, padding: 40, width: '100%', maxWidth: 480, position: 'relative', boxShadow: '0 24px 60px rgba(0,0,0,0.15)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                                <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{editTarget ? 'Edit Doctor' : 'Add New Doctor'}</h2>
                                <button onClick={() => setShowModal(false)} style={{ background: '#F4F0EB', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
                            </div>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                                {[{ label: 'Full Name', key: 'name', placeholder: 'Dr. John Doe' }, { label: 'Specialty', key: 'specialty', placeholder: 'e.g. Cardiologist' }].map(f => (
                                    <div key={f.key}>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6B6460', marginBottom: 6 }}>{f.label}</label>
                                        <input required type="text" placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                            style={{ width: '100%', height: 48, background: '#F8F5F2', border: '1.5px solid #E8E2DC', borderRadius: 10, padding: '0 14px', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit' }} />
                                    </div>
                                ))}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6B6460', marginBottom: 6 }}>Department</label>
                                    <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} style={{ width: '100%', height: 48, background: '#F8F5F2', border: '1.5px solid #E8E2DC', borderRadius: 10, padding: '0 14px', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', appearance: 'none' }}>
                                        {departments.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6B6460', marginBottom: 6 }}>Status</label>
                                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={{ width: '100%', height: 48, background: '#F8F5F2', border: '1.5px solid #E8E2DC', borderRadius: 10, padding: '0 14px', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', appearance: 'none' }}>
                                        {['Available', 'Fully Booked', 'Unavailable'].map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <button type="submit" style={{ height: 50, background: '#6D2932', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', marginTop: 8, fontFamily: 'inherit' }}>
                                    {editTarget ? 'Save Changes' : 'Add Doctor'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {confirmDelete && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setConfirmDelete(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={{ background: '#fff', borderRadius: 24, padding: 36, width: '100%', maxWidth: 400, position: 'relative', textAlign: 'center', boxShadow: '0 24px 60px rgba(0,0,0,0.15)' }}>
                            <div style={{ width: 56, height: 56, background: '#FEF2F2', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}><Trash2 size={24} color="#B91C1C" /></div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 8 }}>Remove Doctor?</h3>
                            <p style={{ color: '#6B6460', fontSize: '0.9rem', marginBottom: 28 }}>Are you sure you want to remove <strong>{confirmDelete.name}</strong>? This cannot be undone.</p>
                            <div style={{ display: 'flex', gap: 12 }}>
                                <button onClick={() => setConfirmDelete(null)} style={{ flex: 1, height: 46, background: '#F4F0EB', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                                <button onClick={() => { deleteDoctor(confirmDelete.id); setConfirmDelete(null); }} style={{ flex: 1, height: 46, background: '#DC2626', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Yes, Remove</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageDoctors;