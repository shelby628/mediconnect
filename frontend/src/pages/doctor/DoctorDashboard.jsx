import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DoctorSidebar from '../../components/layout/DoctorSidebar';
import DoctorAppointments from './DoctorAppointments';
import DoctorPatients from './DoctorPatients';
import DoctorConsultations from './DoctorConsultations';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const DoctorDashboard = () => {
    const { user } = useAuth();

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#F4F0EB' }}>
            <DoctorSidebar />
            <main style={{ marginLeft: 260, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <header style={{
                    height: 72, background: '#fff',
                    borderBottom: '1px solid #E8E2DC',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0 36px', position: 'sticky', top: 0, zIndex: 50, flexShrink: 0
                }}>
                    <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#6B6460', margin: 0 }}>
                        Welcome, <span style={{ color: '#6D2932', fontWeight: 800 }}>
                            Dr. {user?.full_name || user?.fullName || user?.name || ''}
                        </span>
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 14px 6px 8px', background: '#F5E6E8', borderRadius: 10, border: '1px solid #e8d0d3' }}>
                        <div style={{ width: 32, height: 32, background: '#6D2932', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.85rem' }}>
                            {(user?.full_name || user?.fullName || user?.name || 'D').charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1A1310', lineHeight: 1.2 }}>
                                {user?.full_name || user?.fullName || user?.name}
                            </div>
                            <div style={{ fontSize: '0.68rem', color: '#6D2932', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                {user?.specialty || user?.department || 'Doctor'}
                            </div>
                        </div>
                    </div>
                </header>

                <div style={{ padding: '40px 40px 64px', flex: 1 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Routes>
                            <Route path="appointments" element={<DoctorAppointments />} />
                            <Route path="patients" element={<DoctorPatients />} />
                            <Route path="consultations" element={<DoctorConsultations />} />
                            <Route path="/" element={<Navigate to="appointments" replace />} />
                        </Routes>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default DoctorDashboard;
