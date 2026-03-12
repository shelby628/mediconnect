import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminSidebar from '../../components/layout/AdminSidebar';
import ManageDoctors from './ManageDoctors';
import ManagePatients from './ManagePatients';
import AdminConsultations from './AdminConsultations';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const { user } = useAuth();
    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#F4F0EB' }}>
            <AdminSidebar />
            <main style={{ marginLeft: 260, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <header style={{ height: 72, background: '#fff', borderBottom: '1px solid #E8E2DC', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 36px', position: 'sticky', top: 0, zIndex: 50, flexShrink: 0 }}>
                    <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#6B6460', margin: 0 }}>
                        Welcome, <span style={{ color: '#6D2932', fontWeight: 800 }}>{user?.fullName}</span>
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 14px 6px 8px', background: '#F5E6E8', borderRadius: 10, border: '1px solid #e8d0d3' }}>
                        <div style={{ width: 32, height: 32, background: '#6D2932', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.85rem' }}>A</div>
                        <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1A1310', lineHeight: 1.2 }}>{user?.fullName}</div>
                            <div style={{ fontSize: '0.68rem', color: '#6D2932', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Administrator</div>
                        </div>
                    </div>
                </header>
                <div style={{ padding: '40px 40px 64px', flex: 1 }}>
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                        <Routes>
                            <Route path="doctors" element={<ManageDoctors />} />
                            <Route path="patients" element={<ManagePatients />} />
                            <Route path="consultations" element={<AdminConsultations />} />
                            <Route path="/" element={<Navigate to="doctors" replace />} />
                        </Routes>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;