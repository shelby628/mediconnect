import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import Profile from './Profile';
import DoctorAvailability from './DoctorAvailability';
import Appointments from './Appointments';
import Consultation from './Consultation';
import CustomerCare from './CustomerCare';
import About from './About';
import { motion } from 'framer-motion';

const PatientDashboard = () => {
    return (
        <div className="flex bg-neutral-50 min-h-screen">
            <Sidebar />
            <main className="main-content flex-1 flex flex-col pt-0 px-0">
                <Header />
                <div className="p-8 pb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-7xl mx-auto"
                    >
                        <Routes>
                            <Route path="profile" element={<Profile />} />
                            <Route path="doctors" element={<DoctorAvailability />} />
                            <Route path="appointments" element={<Appointments />} />
                            <Route path="consultation" element={<Consultation />} />
                            <Route path="support" element={<CustomerCare />} />
                            <Route path="about" element={<About />} />
                            <Route path="/" element={<Navigate to="doctors" replace />} />
                        </Routes>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default PatientDashboard;
