import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Calendar, Clock, MapPin, MoreVertical, X, Check, Edit2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Appointments = () => {
    const { appointments, cancelAppointment, rescheduleAppointment } = useData();
    const [activeTab, setActiveTab] = useState('Upcoming');
    const [selectedApt, setSelectedApt] = useState(null);
    const [showReschedule, setShowReschedule] = useState(false);
    const [newDateTime, setNewDateTime] = useState({ date: '', time: '' });

    const filteredApts = appointments.filter(a => a.type === activeTab);

    const handleCancel = (id) => {
        if (confirm("Are you sure you want to cancel this appointment?")) {
            cancelAppointment(id);
        }
    };

    const handleReschedule = (e) => {
        e.preventDefault();
        rescheduleAppointment(selectedApt.id, `${newDateTime.date}T${newDateTime.time}`);
        setShowReschedule(false);
        setSelectedApt(null);
    };

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-4xl font-bold tracking-tight mb-2">Appointments</h1>
                <p className="text-neutral-500 text-lg">Manage and track your schedule</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1.5 bg-neutral-100 rounded-2xl w-fit">
                {['Upcoming', 'Past'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab ? 'bg-white text-primary shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Appointment Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {filteredApts.length > 0 ? (
                    filteredApts.map((apt) => (
                        <motion.div
                            layout
                            key={apt.id}
                            className="card p-8 flex flex-col md:flex-row gap-8 relative overflow-hidden group"
                        >
                            {/* Left Side: Status */}
                            <div className="hidden md:flex flex-col items-center justify-center p-6 bg-neutral-50 rounded-3xl min-w-[120px]">
                                <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-2">Status</div>
                                <div className={`px-3 py-1 rounded-full text-[10px] font-bold ${apt.status === 'Approved' ? 'bg-primary-light text-primary-dark' :
                                        apt.status === 'Completed' ? 'bg-neutral-200 text-neutral-600' :
                                            apt.status === 'Cancelled' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                                    }`}>
                                    {apt.status}
                                </div>
                            </div>

                            {/* Right Side: Details */}
                            <div className="flex-1 space-y-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold mb-1">{apt.doctor}</h3>
                                        <p className="text-sm text-neutral-400 font-medium">{apt.department}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-neutral-400 font-bold mb-1 uppercase tracking-widest">ID: {apt.id}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary"><Calendar size={18} /></div>
                                        <div>
                                            <div className="text-[10px] text-neutral-400 font-bold uppercase">Date</div>
                                            <div className="text-sm font-bold">{apt.dateTime.split('T')[0]}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary"><Clock size={18} /></div>
                                        <div>
                                            <div className="text-[10px] text-neutral-400 font-bold uppercase">Time</div>
                                            <div className="text-sm font-bold">{apt.dateTime.split('T')[1]}</div>
                                        </div>
                                    </div>
                                </div>

                                {apt.status !== 'Cancelled' && apt.status !== 'Completed' && (
                                    <div className="flex gap-4 pt-4 border-t border-neutral-50">
                                        <button
                                            onClick={() => { setSelectedApt(apt); setShowReschedule(true); }}
                                            className="btn btn-secondary flex-1 border-neutral-200 hover:bg-primary/5 hover:text-primary hover:border-primary/20"
                                        >
                                            <Edit2 size={16} /> Reschedule
                                        </button>
                                        <button
                                            onClick={() => handleCancel(apt.id)}
                                            className="btn btn-secondary flex-1 text-red-500 border-red-100 hover:bg-red-50"
                                        >
                                            <X size={16} /> Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full p-20 card border-dashed border-4 border-neutral-100 flex flex-col items-center justify-center text-center opacity-50">
                        <Calendar size={64} className="text-neutral-200 mb-6" />
                        <h3 className="text-2xl font-bold">No {activeTab} Appointments</h3>
                        <p className="text-neutral-400 max-w-sm">Seems like you don't have any appointments in this category.</p>
                    </div>
                )}
            </div>

            {/* Reschedule Modal */}
            <AnimatePresence>
                {showReschedule && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowReschedule(false)}
                            className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
                        ></motion.div>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-10 space-y-8 relative"
                        >
                            <h2 className="text-2xl font-bold">Reschedule Appointment</h2>
                            <form onSubmit={handleReschedule} className="space-y-6">
                                <div className="input-group">
                                    <label className="text-sm font-bold text-neutral-700 mb-2 block uppercase tracking-wider">New Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full h-14 bg-neutral-50 px-4 rounded-xl border border-neutral-100"
                                        onChange={(e) => setNewDateTime({ ...newDateTime, date: e.target.value })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="text-sm font-bold text-neutral-700 mb-2 block uppercase tracking-wider">New Time</label>
                                    <input
                                        type="time"
                                        required
                                        className="w-full h-14 bg-neutral-50 px-4 rounded-xl border border-neutral-100"
                                        onChange={(e) => setNewDateTime({ ...newDateTime, time: e.target.value })}
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <button type="button" onClick={() => setShowReschedule(false)} className="btn btn-secondary flex-1">Cancel</button>
                                    <button type="submit" className="btn btn-primary flex-1">Confirm</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Appointments;
